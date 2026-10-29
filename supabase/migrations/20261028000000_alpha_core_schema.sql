-- ==============================================================================
-- ALPHA-CORE ACADEMY / CODE SPARTAN — COMPLETE POSTGRESQL PRODUCTION SCHEMA
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES (Extends Supabase auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT '',
    phone TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'instructor')),
    account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deactivated')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index on role for fast permission checks
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ------------------------------------------------------------------------------
-- 2. CATEGORIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active_order ON public.categories(is_active, sort_order);

-- ------------------------------------------------------------------------------
-- 3. COURSES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    thumbnail_url TEXT DEFAULT '',
    instructor_name TEXT NOT NULL DEFAULT 'Sohel Shahriar',
    duration TEXT DEFAULT '12 Weeks',
    level TEXT DEFAULT 'Intermediate to Advanced',
    language TEXT DEFAULT 'Bangla / English Tech',
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_featured ON public.courses(is_featured);

-- ------------------------------------------------------------------------------
-- 4. COURSE IMAGES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.course_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------------------------
-- 5. COURSE VARIANTS (Independent Variation-Based Pricing Engine)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.course_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g. "Recorded Classes", "Recorded + Live Q&A", "Full Mentorship"
    description TEXT DEFAULT '',
    sku TEXT DEFAULT '',
    regular_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    sale_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    enrollment_limit INTEGER DEFAULT NULL,
    duration_days INTEGER NOT NULL DEFAULT 365,
    image_url TEXT DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_course_variants_course ON public.course_variants(course_id);
CREATE INDEX IF NOT EXISTS idx_course_variants_active ON public.course_variants(is_active);

-- ------------------------------------------------------------------------------
-- 6. CARTS & CART ITEMS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_identifier TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_carts_session ON public.carts(session_identifier);
CREATE INDEX IF NOT EXISTS idx_carts_user ON public.carts(user_id);

CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES public.course_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(cart_id, variant_id)
);

-- ------------------------------------------------------------------------------
-- 7. ORDERS & ORDER ITEMS (Immutable Historical Pricing Snapshots)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    billing_address TEXT DEFAULT '',
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'BDT',
    order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'completed', 'cancelled')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bkash', 'nagad', 'rocket')),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'awaiting_verification', 'paid', 'rejected', 'refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
    variant_id UUID NOT NULL REFERENCES public.course_variants(id) ON DELETE RESTRICT,
    course_title_snapshot TEXT NOT NULL,
    variation_name_snapshot TEXT NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    line_total NUMERIC(12, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ------------------------------------------------------------------------------
-- 8. PAYMENTS (Manual Verification Workflow)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('cash', 'bkash', 'nagad', 'rocket')),
    amount NUMERIC(12, 2) NOT NULL,
    sender_phone TEXT NOT NULL DEFAULT '',
    transaction_id TEXT NOT NULL DEFAULT '',
    payment_status TEXT NOT NULL DEFAULT 'awaiting_verification' CHECK (payment_status IN ('unpaid', 'awaiting_verification', 'paid', 'rejected', 'refunded')),
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ DEFAULT NULL,
    verification_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_txid ON public.payments(transaction_id);

-- ------------------------------------------------------------------------------
-- 9. ENROLLMENTS (Access Control Linked to Verified Purchases)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES public.course_variants(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    enrollment_status TEXT NOT NULL DEFAULT 'active' CHECK (enrollment_status IN ('pending', 'active', 'suspended', 'expired', 'revoked')),
    access_start TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    access_expiry TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(student_id, course_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON public.enrollments(enrollment_status);

-- ------------------------------------------------------------------------------
-- 10. BANNERS (Hero Carousel)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL DEFAULT '',
    supporting_text TEXT DEFAULT '',
    slogan TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    button_text TEXT NOT NULL DEFAULT 'DOMINATE THE CURRICULUM',
    target_url TEXT NOT NULL DEFAULT '/courses',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 11. PAYMENT SETTINGS (Admin Configurable Numbers)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider TEXT NOT NULL UNIQUE CHECK (provider IN ('cash', 'bkash', 'nagad', 'rocket')),
    display_name TEXT NOT NULL,
    payment_number TEXT NOT NULL DEFAULT '',
    account_type TEXT NOT NULL DEFAULT 'Personal' CHECK (account_type IN ('Personal', 'Merchant', 'Agent')),
    instructions TEXT NOT NULL DEFAULT '',
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 12. SOCIAL LINKS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- ------------------------------------------------------------------------------
-- 13. SITE SETTINGS (Key-Value Configuration)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 14. COURSE REVIEWS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.course_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 15. ORDER EVENTS & AUDIT LOGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID DEFAULT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Helper security function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin' AND account_status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile except role" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins have full access to profiles" ON public.profiles
    FOR ALL USING (public.is_admin());

-- 2. Categories
CREATE POLICY "Active categories are viewable by everyone" ON public.categories
    FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (public.is_admin());

-- 3. Courses
CREATE POLICY "Published courses are viewable by everyone" ON public.courses
    FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage courses" ON public.courses
    FOR ALL USING (public.is_admin());

-- 4. Course Images
CREATE POLICY "Course images viewable by everyone" ON public.course_images
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage course images" ON public.course_images
    FOR ALL USING (public.is_admin());

-- 5. Course Variants
CREATE POLICY "Active variants viewable by everyone" ON public.course_variants
    FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage variants" ON public.course_variants
    FOR ALL USING (public.is_admin());

-- 6. Carts & Items
CREATE POLICY "Users can manage own cart" ON public.carts
    FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Cart items accessible via cart session" ON public.cart_items
    FOR ALL USING (true);

-- 7. Orders & Order Items
CREATE POLICY "Students can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Orders can be inserted by customer checkout" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all orders" ON public.orders
    FOR ALL USING (public.is_admin());

CREATE POLICY "Students can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND (orders.user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Order items can be inserted at checkout" ON public.order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all order items" ON public.order_items
    FOR ALL USING (public.is_admin());

-- 8. Payments
CREATE POLICY "Students can view own payment submissions" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = payments.order_id
            AND (orders.user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Customers can submit payments for orders" ON public.payments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage payments" ON public.payments
    FOR ALL USING (public.is_admin());

-- 9. Enrollments
CREATE POLICY "Students can view own active enrollments" ON public.enrollments
    FOR SELECT USING (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Only admins or trusted system procedures can grant enrollments" ON public.enrollments
    FOR ALL USING (public.is_admin());

-- 10. Banners, Payment Settings, Social Links, Site Settings
CREATE POLICY "Public read banners" ON public.banners FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin manage banners" ON public.banners FOR ALL USING (public.is_admin());

CREATE POLICY "Public read enabled payment settings" ON public.payment_settings FOR SELECT USING (is_enabled = true OR public.is_admin());
CREATE POLICY "Admin manage payment settings" ON public.payment_settings FOR ALL USING (public.is_admin());

CREATE POLICY "Public read social links" ON public.social_links FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin manage social links" ON public.social_links FOR ALL USING (public.is_admin());

CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage site settings" ON public.site_settings FOR ALL USING (public.is_admin());

-- 11. Reviews
CREATE POLICY "Public read approved reviews" ON public.course_reviews FOR SELECT USING (status = 'approved' OR public.is_admin());
CREATE POLICY "Students can submit reviews" ON public.course_reviews FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Admin manage reviews" ON public.course_reviews FOR ALL USING (public.is_admin());

-- 12. Audit Logs & Order Events
CREATE POLICY "Admin read audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin read order events" ON public.order_events FOR SELECT USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- AUTOMATIC PROFILE TRIGGER ON SIGNUP
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role, account_status)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Student Spartan'),
        COALESCE(new.raw_user_meta_data->>'phone', ''),
        COALESCE(new.raw_user_meta_data->>'role', 'student'),
        'active'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- SECURE ADMIN VERIFICATION & ENROLLMENT TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.verify_order_payment(
    p_order_id UUID,
    p_admin_id UUID,
    p_action TEXT, -- 'verify' or 'reject'
    p_notes TEXT DEFAULT ''
)
RETURNS JSONB AS $$
DECLARE
    v_order RECORD;
    v_item RECORD;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: only administrators can verify payments.';
    END IF;

    SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order not found.';
    END IF;

    IF p_action = 'verify' THEN
        -- Update order status
        UPDATE public.orders
        SET payment_status = 'paid', order_status = 'confirmed', updated_at = now()
        WHERE id = p_order_id;

        -- Update payments table
        UPDATE public.payments
        SET payment_status = 'paid', verified_by = p_admin_id, verified_at = now(), verification_notes = p_notes
        WHERE order_id = p_order_id;

        -- Grant enrollments if user_id exists
        IF v_order.user_id IS NOT NULL THEN
            FOR v_item IN SELECT * FROM public.order_items WHERE order_id = p_order_id LOOP
                INSERT INTO public.enrollments (student_id, course_id, variant_id, order_id, enrollment_status, access_start)
                VALUES (v_order.user_id, v_item.course_id, v_item.variant_id, p_order_id, 'active', now())
                ON CONFLICT (student_id, course_id, variant_id) DO UPDATE
                SET enrollment_status = 'active', access_start = now();
            END LOOP;
        END IF;

        -- Log audit event
        INSERT INTO public.order_events (order_id, event_type, description, actor_id)
        VALUES (p_order_id, 'payment_verified', 'Payment verified and enrollments granted', p_admin_id);

        RETURN jsonb_build_object('success', true, 'message', 'Payment successfully verified.');
    ELSE
        -- Reject payment
        UPDATE public.orders
        SET payment_status = 'rejected', order_status = 'cancelled', updated_at = now()
        WHERE id = p_order_id;

        UPDATE public.payments
        SET payment_status = 'rejected', verified_by = p_admin_id, verified_at = now(), verification_notes = p_notes
        WHERE order_id = p_order_id;

        INSERT INTO public.order_events (order_id, event_type, description, actor_id)
        VALUES (p_order_id, 'payment_rejected', 'Payment rejected: ' || p_notes, p_admin_id);

        RETURN jsonb_build_object('success', true, 'message', 'Payment marked as rejected.');
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
