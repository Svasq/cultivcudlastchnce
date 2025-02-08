import { z } from 'zod';
import { db } from '@/lib/db';
import { feedback, marketplace, communities } from '@/lib/schema';
import { revalidatePath } from 'next/cache';
import { members } from '@/lib/schema';
import { InferModel } from 'drizzle-orm';

const feedbackSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

type Post = InferModel<typeof members>;

const marketplaceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be a positive number'),
  imageUrl: z.string().optional(),
  authorName: z.string().min(2, 'Name must be at least 2 characters'),
});

const communitySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
});

export async function submitFeedback(values: z.infer<typeof feedbackSchema>) {
  'use server';

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
  "use server";
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
  'use server';

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
      authorId: 'anonymous', // In a real app, this would come from auth
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

export async function createCommunity(values: z.infer<typeof communitySchema>) {
  'use server';

  const validatedFields = communitySchema.safeParse(values);
  
  if (!validatedFields.success) {
    throw new Error('Invalid community data');
  }

  try {
    const community = await db.insert(communities).values({
      name: validatedFields.data.name,
      bio: validatedFields.data.bio,
    }).returning();

    revalidatePath('/communities');
    return { success: true, data: community[0] };
  } catch (error) {
    console.error('Failed to create community:', error);
    throw new Error('Failed to create community');
  }
}
