'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { feedback, marketplace, members, streams, admins } from '@/lib/schema';
import { revalidatePath } from 'next/cache';
import { InferModel } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { createHash, randomBytes } from 'crypto';

const feedbackSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

const marketplaceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be a positive number'),
  imageUrl: z.string().optional(),
  authorName: z.string().min(2, 'Name must be at least 2 characters'),
});

const streamSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  communityId: z.number(),
});

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const adminCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

// Utility functions for password handling
function hashPassword(password: string, salt: string): string {
  return createHash('sha256')
    .update(password + salt)
    .digest('hex');
}

function generateSalt(): string {
  return randomBytes(16).toString('hex');
}

export async function submitFeedback(values: z.infer<typeof feedbackSchema>) {
  const validatedFields = feedbackSchema.safeParse(values);
  
  if (!validatedFields.success) {
    throw new Error('Invalid feedback data');
  }

  try {
    await db.insert(feedback).values({
      name: validatedFields.data.name,
      email: validatedFields.data.email,
      message: validatedFields.data.message,
      createdAt: new Date(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    throw new Error('Failed to submit feedback');
  }
}

export async function handleCreatePost(formData: FormData) {
  try {
    const title = formData.get("title");
    const content = formData.get("content");
    
    if (!title || !content) {
      return { error: "Title and content are required" };
    }

    if (typeof title === 'string' && typeof content === 'string') {
      const post = await db.insert(members)
        .values({ title, content })
        .returning({ id: members.id });
        
      revalidatePath('/');
      return { success: true, postId: post[0].id };
    }
  } catch (error) {
    console.error('Error creating post:', error);
    return { error: "Failed to create post. Please try again." };
  }
}

export async function createListing(values: z.infer<typeof marketplaceSchema>) {
  const validatedFields = marketplaceSchema.safeParse(values);
  
  if (!validatedFields.success) {
    throw new Error('Invalid listing data');
  }

  try {
    const listing = await db.insert(marketplace).values({
      title: validatedFields.data.title,
      description: validatedFields.data.description,
      price: validatedFields.data.price.toString(),
      imageUrl: validatedFields.data.imageUrl,
      authorId: 'anonymous',
      authorName: validatedFields.data.authorName,
      status: 'active',
    }).returning();

    revalidatePath('/marketplace');
    return { success: true, data: listing[0] };
  } catch (error) {
    console.error('Failed to create listing:', error);
    throw new Error('Failed to create listing');
  }
}

export async function startStream(values: z.infer<typeof streamSchema>) {
  const validatedFields = streamSchema.safeParse(values);
  
  if (!validatedFields.success) {
    throw new Error('Invalid stream data');
  }

  try {
    const streamKey = nanoid();
    const stream = await db.insert(streams).values({
      title: validatedFields.data.title,
      communityId: validatedFields.data.communityId,
      streamKey,
      status: 'active',
    }).returning();

    revalidatePath('/live');
    return { success: true, data: stream[0] };
  } catch (error) {
    console.error('Failed to start stream:', error);
    throw new Error('Failed to start stream');
  }
}

export async function createAdmin(values: z.infer<typeof adminCreateSchema>) {
  const validatedFields = adminCreateSchema.safeParse(values);
  
  if (!validatedFields.success) {
    throw new Error('Invalid admin data');
  }

  try {
    const salt = generateSalt();
    const hashedPassword = hashPassword(validatedFields.data.password, salt);

    const admin = await db.insert(admins).values({
      email: validatedFields.data.email,
      hashedPassword: `${salt}:${hashedPassword}`,
      name: validatedFields.data.name,
      role: 'admin',
    }).returning();

    return { success: true, data: { id: admin[0].id, email: admin[0].email } };
  } catch (error) {
    console.error('Failed to create admin:', error);
    throw new Error('Failed to create admin');
  }
}

export async function adminLogin(values: z.infer<typeof adminLoginSchema>) {
  const validatedFields = adminLoginSchema.safeParse(values);
  
  if (!validatedFields.success) {
    throw new Error('Invalid credentials');
  }

  try {
    const admin = await db.select()
      .from(admins)
      .where(eq(admins.email, validatedFields.data.email))
      .limit(1);

    if (!admin[0]) {
      throw new Error('Invalid credentials');
    }

    const [salt, storedHash] = admin[0].hashedPassword.split(':');
    const hash = hashPassword(validatedFields.data.password, salt);

    if (hash !== storedHash) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await db.update(admins)
      .set({ lastLogin: new Date() })
      .where(eq(admins.id, admin[0].id));

    // Set session cookie
    const session = {
      id: admin[0].id,
      email: admin[0].email,
      role: admin[0].role,
    };

    const sessionToken = createHash('sha256')
      .update(JSON.stringify(session) + generateSalt())
      .digest('hex');

    const cookieStore = cookies();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    cookieStore.set({
      name: 'admin_session',
      value: sessionToken,
      expires: new Date(Date.now() + oneWeek),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return { success: true, data: session };
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Invalid credentials');
  }
}

export async function adminLogout() {
  const cookieStore = cookies();
  cookieStore.set({
    name: 'admin_session',
    value: '',
    expires: new Date(0),
    path: '/',
  });
  return { success: true };
}
