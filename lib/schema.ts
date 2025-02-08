import { pgTable, serial, text, timestamp, integer, primaryKey, decimal, boolean } from "drizzle-orm/pg-core"

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const threads = pgTable("threads", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  authorId: integer("author_id").notNull(), // Foreign key to users table (not defined here)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  threadId: integer("thread_id").notNull().references(() => threads.id),
  authorId: integer("author_id").notNull(), // Foreign key to users table (not defined here)
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const marketplace = pgTable("marketplace", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  authorId: text("author_id").notNull(),
  authorName: text("author_name").notNull(),
  status: text("status").notNull().default('active'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const communities = pgTable("communities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
});

export const streams = pgTable("streams", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  communityId: integer("community_id").references(() => communities.id),
  streamKey: text("stream_key").notNull(),
  status: text("status").notNull().default('inactive'),
  viewerCount: integer("viewer_count").notNull().default(0),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const streamChat = pgTable("stream_chat", {
  id: serial("id").primaryKey(),
  streamId: integer("stream_id").references(() => streams.id),
  userId: text("user_id").notNull(),
  username: text("username").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default('text'), // text, image, video
  mediaUrl: text("media_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default('admin'),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
