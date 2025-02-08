'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { marketplace, streams, admins, feedbackTable, membersTable } from '@/lib/schema';
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
  community_id: z.number(),
  user_id: z.number().optional(),
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
    await db.insert(feedbackTable).values({
      user_id: 1, // hardcoded user id for now
      feedback_text: validatedFields.data.message,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    throw new Error('Failed to submit feedback');
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
      price: validatedFields.data.price,
      image_url: validatedFields.data.imageUrl,
      author_id: '1',
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
      community_id: validatedFields.data.community_id,
      user_id: 1, // hardcoded user id for now
      stream_key: streamKey,
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
      hashed_password: `${salt}:${hashedPassword}`,
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

    const [salt, storedHash] = admin[0].hashed_password.split(':');
    const hash = hashPassword(validatedFields.data.password, salt);

    if (hash !== storedHash) {
      throw new Error('Invalid credentials');
    }


    // Set session cookie
    const session = {
      id: admin[0].id,
      name: admin[0].name,
      email: admin[0].email,
      role: admin[0].role,
    };

    const sessionToken = createHash('sha256')
      .update(JSON.stringify(session) + generateSalt())
      .digest('hex');

    const cookieStore = cookies();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    await cookieStore.set('admin_session', sessionToken, {
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
  await cookieStore.delete('admin_session');
  return { success: true };
}

export async function handleCreatePost(formData: FormData) {
  try {
    const title = formData.get("title");
    const content = formData.get("content");
    
    if (!title || !content) {
      return { error: "Title and content are required" };
    }

    if (typeof title === 'string' && typeof content === 'string') {
      const post = await db.insert(membersTable)
        .values({
          title: title,
          content: content,
          author_id: 1, // hardcoded user id for now
        })
        .returning({ id: membersTable.id });

      revalidatePath('/');
      return { success: true, postId: post[0].id };
    }
  } catch (error) {
    console.error('Error creating post:', error);
    return { error: "Failed to create post. Please try again." };
  }
}
