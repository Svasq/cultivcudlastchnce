CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "hashed_password" TEXT NOT NULL,
  "image" TEXT,
  "role" TEXT NOT NULL DEFAULT 'user',
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "threads" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "author_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "forum_posts" (
  "id" SERIAL PRIMARY KEY,
  "thread_id" INTEGER NOT NULL REFERENCES "threads"("id"),
  "author_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "communities" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "bio" TEXT NOT NULL,
  "owner_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "image_url" TEXT,
  "member_count" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "community_members" (
  "community_id" INTEGER NOT NULL REFERENCES "communities"("id"),
  "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "role" TEXT NOT NULL DEFAULT 'member',
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("community_id", "user_id")
);

CREATE TABLE IF NOT EXISTS "products" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "image_url" TEXT,
  "seller_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "status" TEXT NOT NULL DEFAULT 'active',
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "streams" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "community_id" INTEGER NOT NULL REFERENCES "communities"("id"),
  "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "stream_key" TEXT NOT NULL UNIQUE,
  "status" TEXT NOT NULL DEFAULT 'inactive',
  "viewer_count" INTEGER NOT NULL DEFAULT 0,
  "thumbnail_url" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "stream_chat" (
  "id" SERIAL PRIMARY KEY,
  "stream_id" INTEGER NOT NULL REFERENCES "streams"("id"),
  "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "message" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'text',
  "media_url" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
); 