import { jwtVerify, SignJWT } from 'jose';

// Use a consistent secret key for development and production
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'supersecret_make_this_long_enough_32chars'
);

export interface JWTPayload {
  id: number;
  email: string;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function createToken(payload: { id: number; email: string; name: string; role: string }): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    
    // Validate the payload has the required fields
    if (
      typeof payload.id !== 'number' ||
      typeof payload.email !== 'string' ||
      typeof payload.name !== 'string' ||
      typeof payload.role !== 'string'
    ) {
      console.error('Invalid token payload structure');
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      iat: payload.iat,
      exp: payload.exp
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export async function getJWTPayload(): Promise<JWTPayload | null> {
  try {
    const token = getCookieValue('token');
    if (!token) return null;
    
    return await verifyToken(token);
  } catch (error) {
    console.error('Error getting JWT payload:', error);
    removeCookie('token'); // Clear invalid token
    return null;
  }
}

export function getCookieValue(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

export function setCookie(name: string, value: string, seconds = 86400) {
  const opts = {
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: seconds
  };

  if (typeof document !== 'undefined') {
    document.cookie = `${name}=${value}; ${Object.entries(opts)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')}`;
  }
}

export function removeCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
}

export function setAPIResponseCookie(response: Response, name: string, value: string, options: { [key: string]: any } = {}) {
  const defaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 86400 // 24 hours
  };

  const cookieOptions = { ...defaultOptions, ...options };
  let cookieString = `${name}=${value}`;

  Object.entries(cookieOptions).forEach(([key, value]) => {
    if (value === true) {
      cookieString += `; ${key}`;
    } else if (value) {
      cookieString += `; ${key}=${value}`;
    }
  });

  response.headers.set('Set-Cookie', cookieString);
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

export function setAuthCookie(res: Response, token: string) {
  res.headers.set(
    'Set-Cookie',
    `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${24 * 60 * 60}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
  );
}

export async function auth(): Promise<AuthUser | null> {
  // Placeholder for auth logic
  return null;
}
