-- ============================================================
-- Temporarily open RLS policies for content management
-- Allows unauthenticated users to manage content (for development)
-- Later: tighten back to admin-only after setting up admin user
-- ============================================================

-- VIDEOS: Drop admin-only policies, allow all writes
DROP POLICY IF EXISTS "Admins can insert videos" ON public.videos;
DROP POLICY IF EXISTS "Admins can update videos" ON public.videos;
DROP POLICY IF EXISTS "Admins can delete videos" ON public.videos;

CREATE POLICY "Anyone can insert videos" ON public.videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update videos" ON public.videos FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete videos" ON public.videos FOR DELETE USING (true);

-- BOOKS: Drop admin-only policies, allow all writes
DROP POLICY IF EXISTS "Admins can insert books" ON public.books;
DROP POLICY IF EXISTS "Admins can update books" ON public.books;
DROP POLICY IF EXISTS "Admins can delete books" ON public.books;

CREATE POLICY "Anyone can insert books" ON public.books FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update books" ON public.books FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete books" ON public.books FOR DELETE USING (true);

-- CATEGORIES: Drop admin-only policy, allow all writes
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;

CREATE POLICY "Anyone can manage categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- RECURRING SERVICES
DROP POLICY IF EXISTS "Admins can manage recurring services" ON public.recurring_services;

CREATE POLICY "Anyone can manage recurring services" ON public.recurring_services FOR ALL USING (true) WITH CHECK (true);

-- SCHEDULED SERVICES
DROP POLICY IF EXISTS "Admins can manage scheduled services" ON public.scheduled_services;

CREATE POLICY "Anyone can manage scheduled services" ON public.scheduled_services FOR ALL USING (true) WITH CHECK (true);

-- STREAM CONFIG
DROP POLICY IF EXISTS "Admins can update stream config" ON public.stream_config;
DROP POLICY IF EXISTS "Admins can insert stream config" ON public.stream_config;

CREATE POLICY "Anyone can insert stream config" ON public.stream_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update stream config" ON public.stream_config FOR UPDATE USING (true);

-- DONATIONS: Allow anyone to create donations (public donation form)
DROP POLICY IF EXISTS "Users can insert own donations" ON public.donations;

CREATE POLICY "Anyone can insert donations" ON public.donations FOR INSERT WITH CHECK (true);

-- PRAYER REQUESTS: Allow anyone to submit
DROP POLICY IF EXISTS "Users can insert own prayer requests" ON public.prayer_requests;

CREATE POLICY "Anyone can insert prayer requests" ON public.prayer_requests FOR INSERT WITH CHECK (true);
