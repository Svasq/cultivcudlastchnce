import { pgTable, serial, text, timestamp, integer, primaryKey, decimal, boolean } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  hashed_password: text("hashed_password").notNull(),
  image: text("image"),
  role: text("role").default("user").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const threads = pgTable("threads", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  author_id: integer("author_id").notNull().references(() => users.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  thread_id: integer("thread_id").notNull().references(() => threads.id),
  author_id: integer("author_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const communities = pgTable("communities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  bio: text("bio").notNull(),
  owner_id: integer("owner_id").notNull().references(() => users.id),
  image_url: text("image_url"),
  member_count: integer("member_count").notNull().default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const communityMembers = pgTable("community_members", {
  community_id: integer("community_id").notNull().references(() => communities.id),
  user_id: integer("user_id").notNull().references(() => users.id),
  role: text("role").notNull().default('member'),
  created_at: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey(table.community_id, table.user_id),
}));

export const marketplace = pgTable("marketplace", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image_url: text("image_url"),
  author_id: integer("author_id").notNull().references(() => users.id),
  status: text("status").notNull().default('active'),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const streams = pgTable("streams", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  community_id: integer("community_id").notNull().references(() => communities.id),
  user_id: integer("user_id").notNull().references(() => users.id),
  stream_key: text("stream_key").notNull().unique(),
  status: text("status").notNull().default('inactive'),
  viewer_count: integer("viewer_count").notNull().default(0),
  thumbnail_url: text("thumbnail_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const streamChat = pgTable("stream_chat", {
  id: serial("id").primaryKey(),
  stream_id: integer("stream_id").notNull().references(() => streams.id),
  user_id: integer("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  type: text("type").notNull().default('text'),
  media_url: text("media_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image_url: text("image_url"),
  seller_id: integer("seller_id").notNull().references(() => users.id),
  status: text("status").notNull().default('active'),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

export const feedbackTable = pgTable("feedback", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  feedback_text: text("feedback_text").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const membersTable = pgTable("members", {
  id: serial("id").primaryKey(),
  community_id: integer("community_id").notNull().references(() => communities.id),
  user_id: integer("user_id").notNull().references(() => users.id),
});
