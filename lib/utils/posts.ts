import { db } from "../db"
import { posts } from "../schema"
import { eq } from "drizzle-orm"

export async function getPosts() {
  try {
    const result = await db.select().from(posts)
    return result
  } catch (error) {
    console.error("Error fetching posts:", error)
    throw error
  }
}

export async function createPost(title: string, content: string) {
  try {
    const result = await db.insert(posts).values({ title, content }).returning()
    return result[0]
  } catch (error) {
    console.error("Error creating post:", error)
    throw error
  }
}

export async function getPostById(id: number) {
  try {
    const result = await db.select().from(posts).where(eq(posts.id, id))
    return result[0]
  } catch (error) {
    console.error("Error fetching post:", error)
    throw error
  }
}

