CREATE TABLE IF NOT EXISTS "posts" (
  "id" serial PRIMARY KEY,
  "title" text NOT NULL,
  "content" text NOT NULL,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
); 