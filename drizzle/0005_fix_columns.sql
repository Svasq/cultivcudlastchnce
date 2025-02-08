-- Fix image columns
ALTER TABLE communities RENAME COLUMN imageurl TO image_url;
ALTER TABLE products RENAME COLUMN imageurl TO image_url;
ALTER TABLE marketplace RENAME COLUMN imageurl TO image_url;

-- Fix user columns
ALTER TABLE streams RENAME COLUMN user_id TO userId;
ALTER TABLE stream_chat RENAME COLUMN user_id TO userId;
ALTER TABLE community_members RENAME COLUMN user_id TO userId;

-- Fix other columns for consistency
ALTER TABLE streams RENAME COLUMN community_id TO communityId;
ALTER TABLE streams RENAME COLUMN stream_key TO streamKey;
ALTER TABLE streams RENAME COLUMN thumbnail_url TO thumbnailUrl;
ALTER TABLE stream_chat RENAME COLUMN stream_id TO streamId;
ALTER TABLE stream_chat RENAME COLUMN media_url TO mediaUrl;
ALTER TABLE community_members RENAME COLUMN community_id TO communityId; 