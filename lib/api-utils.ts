import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

type ApiHandler = (
  req: NextRequest,
  context: { userId: number; params?: any }
) => Promise<NextResponse>;

export const createApiHandler = (handler: ApiHandler) => {
  return async (req: NextRequest, context: { params?: any }) => {
    try {
      const userId = Number(req.headers.get('x-user-id'));
      return await handler(req, { ...context, userId });
    } catch (error) {
      console.error(`API_ERROR: ${error}`);
      return error instanceof z.ZodError
        ? NextResponse.json({ error: error.errors }, { status: 400 })
        : NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
    }
  };
};

export const validateBody = async <T>(req: NextRequest, schema: z.Schema<T>): Promise<T> => {
  const body = await req.json();
  return schema.parse(body);
}; 