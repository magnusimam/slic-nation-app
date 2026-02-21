-- ============================================================
-- SLIC Nations App - Seed Data
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- ────────────────────────────────────────────────
-- VIDEOS
-- ────────────────────────────────────────────────
INSERT INTO public.videos (id, title, description, thumbnail, duration, speaker, date, series, category, views, is_featured) VALUES
  ('11111111-0001-0001-0001-000000000001', 'A Perfect Christian Is Possible', 'Discover how God empowers us to live a perfect Christian life through His grace.', 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&h=600&fit=crop', 45, 'Pastor John', '2024-02-10', 'Christian Living', 'teaching', 12500, true),
  ('11111111-0001-0001-0001-000000000002', 'Faith in Action', 'Learn how to put your faith into action and make a real difference in your community.', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop', 52, 'Dr. Sarah', '2024-02-09', 'Living Bold', 'teaching', 8900, true),
  ('11111111-0001-0001-0001-000000000003', 'Grace Unlimited', 'Understanding the infinite grace of God in our daily lives.', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=1200&h=600&fit=crop', 48, 'Pastor Michael', '2024-02-08', 'Grace Series', 'teaching', 15200, true),
  ('11111111-0001-0001-0001-000000000004', 'Foundations of Faith', 'Building a strong spiritual foundation in Christ.', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=1200&h=600&fit=crop', 50, 'Pastor John', '2024-02-07', 'Foundations', 'teaching', 9800, false),
  ('11111111-0001-0001-0001-000000000005', 'Power of Prayer', 'Unlocking the transformative power of prayer in your life.', 'https://images.unsplash.com/photo-1516321318423-f06f70259b51?w=1200&h=600&fit=crop', 55, 'Dr. Sarah', '2024-02-06', 'Prayer Series', 'teaching', 11300, false),
  ('11111111-0001-0001-0001-000000000006', 'Freedom in Christ', 'Breaking free from spiritual bondage and living in freedom.', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop', 58, 'Pastor Michael', '2024-02-05', 'Freedom Series', 'teaching', 7600, false),
  ('11111111-0001-0001-0001-000000000007', 'Love Never Fails', 'The power of God''s love transforms everything.', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=1200&h=600&fit=crop', 46, 'Dr. Sarah', '2024-02-04', 'Love Series', 'teaching', 13100, false),
  ('11111111-0001-0001-0001-000000000008', 'Walking in Wisdom', 'Gaining the wisdom to navigate life''s challenges.', 'https://images.unsplash.com/photo-1516321318423-f06f70259b51?w=1200&h=600&fit=crop', 52, 'Pastor John', '2024-02-03', 'Wisdom Series', 'teaching', 8200, false);


-- ────────────────────────────────────────────────
-- BOOKS
-- ────────────────────────────────────────────────
INSERT INTO public.books (id, title, author, cover, description, category, pages, year, downloads, is_new, is_featured) VALUES
  ('22222222-0001-0001-0001-000000000001', 'Open Secrets', 'Apst Emmanuel Etim', '/Open%20Secrets.jpg', 'Discover the hidden truths and divine revelations that will transform your spiritual walk.', 'Christian Living', 320, 2024, 12500, true, true),
  ('22222222-0001-0001-0001-000000000002', 'Deep Conversations with the Holy Spirit', 'Apst Emmanuel Etim', '/Deep%20conversations%20with%20the%20Holy%20Spirit.jpg', 'Learn to cultivate an intimate prayer life and hear the voice of the Holy Spirit clearly.', 'Prayer', 280, 2024, 9800, true, true),
  ('22222222-0001-0001-0001-000000000003', 'Grace & Mercy', 'Joyce Meyer', 'https://images.unsplash.com/photo-1497206365907-3ff1691d6d5d?w=300&h=450&fit=crop', 'Understanding God''s grace in every season of life.', 'Devotional', 350, 2023, 15200, false, false),
  ('22222222-0001-0001-0001-000000000004', 'Power of Prayer', 'E.M. Bounds', 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=300&h=450&fit=crop', 'A classic work on the transformative power of prayer.', 'Prayer', 380, 2022, 22100, false, false),
  ('22222222-0001-0001-0001-000000000005', 'Walking in Freedom', 'Neil T. Anderson', 'https://images.unsplash.com/photo-1508020129803-b859a74e9d07?w=300&h=450&fit=crop', 'Breaking free from spiritual oppression and finding liberty in Christ.', 'Christian Living', 320, 2023, 8400, false, false),
  ('22222222-0001-0001-0001-000000000006', 'The Purpose Driven Life', 'Rick Warren', 'https://images.unsplash.com/photo-1505680325957-4d812e291c73?w=300&h=450&fit=crop', 'Discovering your life purpose in God''s plan.', 'Spirituality', 400, 2022, 31500, false, false);


-- ────────────────────────────────────────────────
-- CATEGORIES
-- ────────────────────────────────────────────────
INSERT INTO public.categories (id, name, thumbnail, description, video_count, color, is_trending, is_new, last_updated, total_duration, recently_added_count, preview_videos) VALUES
  ('teaching', 'Teaching', 'https://images.unsplash.com/photo-1516321318423-f06f70259b51?w=500&h=300&fit=crop', 'Deep biblical teachings and spiritual lessons', 24, 'from-blue-600 to-blue-800', true, false, '2026-02-17', 18, 3, ARRAY['https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=200&h=120&fit=crop', 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=200&h=120&fit=crop', 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=200&h=120&fit=crop']),
  ('prayer', 'Prayer', 'https://images.unsplash.com/photo-1511379938547-c1f69b12d835?w=500&h=300&fit=crop', 'Prayer sessions and guidance for spiritual connection', 18, 'from-purple-600 to-purple-800', false, false, '2026-02-16', 12, 2, ARRAY['https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=120&fit=crop', 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=200&h=120&fit=crop', 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=200&h=120&fit=crop']),
  ('prophecy', 'Prophecy', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=300&fit=crop', 'Prophetic words and revelations from Scripture', 12, 'from-amber-600 to-amber-800', false, true, '2026-02-17', 8, 5, ARRAY['https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=200&h=120&fit=crop', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=200&h=120&fit=crop', 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=200&h=120&fit=crop']),
  ('worship', 'Worship', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop', 'Worship sessions and spiritual music performances', 15, 'from-pink-600 to-pink-800', true, false, '2026-02-15', 10, 1, ARRAY['https://images.unsplash.com/photo-1516321318423-f06f70259b51?w=200&h=120&fit=crop', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=120&fit=crop', 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=200&h=120&fit=crop']),
  ('devotional', 'Devotional', 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=500&h=300&fit=crop', 'Daily devotionals for spiritual growth', 30, 'from-green-600 to-green-800', false, false, '2026-02-14', 24, 0, ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=120&fit=crop', 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=200&h=120&fit=crop', 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=200&h=120&fit=crop']),
  ('conferences', 'Conferences', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop', 'Conference messages and special events', 8, 'from-red-600 to-red-800', false, true, '2026-02-17', 6, 4, ARRAY['https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=200&h=120&fit=crop', 'https://images.unsplash.com/photo-1516321318423-f06f70259b51?w=200&h=120&fit=crop', 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=200&h=120&fit=crop']);


-- ────────────────────────────────────────────────
-- RECURRING SERVICES
-- ────────────────────────────────────────────────
INSERT INTO public.recurring_services (id, title, day_of_week, time, duration_hours, speaker, thumbnail) VALUES
  ('33333333-0001-0001-0001-000000000001', 'Sunday Morning Service', 0, '09:00', 3, 'Apst Emmanuel Etim', 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=450&fit=crop'),
  ('33333333-0001-0001-0001-000000000002', 'Wednesday Midweek Service', 3, '18:00', 2, 'Apst Emmanuel Etim', 'https://images.unsplash.com/photo-1516321318423-f06f70259b51?w=800&h=450&fit=crop');


-- ============================================================
-- DONE! Your database is now seeded with initial content.
-- ============================================================
