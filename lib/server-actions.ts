'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { feedback, marketplace, members, streams } from '@/lib/schema';
import { revalidatePath } from 'next/cache';
import { InferModel } from 'drizzle-orm';
import { nanoid } from 'nanoid';

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
