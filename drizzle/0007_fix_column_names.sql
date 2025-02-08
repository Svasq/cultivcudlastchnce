-- Fix column names to use snake_case consistently
ALTER TABLE communities RENAME COLUMN ownerId TO owner_id;
ALTER TABLE communities RENAME COLUMN imageUrl TO image_url;
ALTER TABLE communities RENAME COLUMN memberCount TO member_count;
ALTER TABLE communities RENAME COLUMN createdAt TO created_at;
ALTER TABLE communities RENAME COLUMN updatedAt TO updated_at;

ALTER TABLE community_members RENAME COLUMN communityId TO community_id;
ALTER TABLE community_members RENAME COLUMN userId TO user_id;
ALTER TABLE community_members RENAME COLUMN createdAt TO created_at;

ALTER TABLE forum_posts RENAME COLUMN threadId TO thread_id;
ALTER TABLE forum_posts RENAME COLUMN authorId TO author_id;
ALTER TABLE forum_posts RENAME COLUMN createdAt TO created_at;
ALTER TABLE forum_posts RENAME COLUMN updatedAt TO updated_at;

ALTER TABLE marketplace RENAME COLUMN imageUrl TO image_url;
ALTER TABLE marketplace RENAME COLUMN authorId TO author_id;
ALTER TABLE marketplace RENAME COLUMN createdAt TO created_at;
ALTER TABLE marketplace RENAME COLUMN updatedAt TO updated_at;

ALTER TABLE products RENAME COLUMN imageUrl TO image_url;
ALTER TABLE products RENAME COLUMN sellerId TO seller_id;
ALTER TABLE products RENAME COLUMN createdAt TO created_at;
ALTER TABLE products RENAME COLUMN updatedAt TO updated_at;

ALTER TABLE streams RENAME COLUMN communityId TO community_id;
ALTER TABLE streams RENAME COLUMN userId TO user_id;
ALTER TABLE streams RENAME COLUMN streamKey TO stream_key;
ALTER TABLE streams RENAME COLUMN viewerCount TO viewer_count;
ALTER TABLE streams RENAME COLUMN thumbnailUrl TO thumbnail_url;
ALTER TABLE streams RENAME COLUMN createdAt TO created_at;
ALTER TABLE streams RENAME COLUMN updatedAt TO updated_at;

ALTER TABLE stream_chat RENAME COLUMN streamId TO stream_id;
ALTER TABLE stream_chat RENAME COLUMN userId TO user_id;
ALTER TABLE stream_chat RENAME COLUMN mediaUrl TO media_url;
ALTER TABLE stream_chat RENAME COLUMN createdAt TO created_at;

ALTER TABLE threads RENAME COLUMN authorId TO author_id;
ALTER TABLE threads RENAME COLUMN createdAt TO created_at;
ALTER TABLE threads RENAME COLUMN updatedAt TO updated_at;

ALTER TABLE users RENAME COLUMN hashedPassword TO hashed_password;
ALTER TABLE users RENAME COLUMN createdAt TO created_at;
ALTER TABLE users RENAME COLUMN updatedAt TO updated_at; 