-- ==============================================================================
-- ALPHA-CORE ACADEMY — SEED DATA
-- ==============================================================================

-- 1. Categories
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order, is_active)
VALUES
('c1000000-0000-0000-0000-000000000001', 'FRONTEND DOMINANCE', 'frontend-dominance', 'Architect robust, reactive client engines that dominate web real-estate.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80', 1, true),
('c1000000-0000-0000-0000-000000000002', 'BACKEND ARCHITECTURE', 'backend-architecture', 'Mission-critical distributed servers, high-throughput APIs and fault-tolerant pipelines.', 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80', 2, true),
('c1000000-0000-0000-0000-000000000003', 'SYSTEMS WARFARE', 'systems-warfare', 'Low-level systems programming, kernels, memory manipulation and performance warfare.', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', 3, true),
('c1000000-0000-0000-0000-000000000004', 'DATA STRATEGIES', 'data-strategies', 'Big data warfare, streaming data pipelines, predictive intelligence and analytics mastery.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- 2. Courses
INSERT INTO public.courses (id, category_id, title, slug, short_description, description, thumbnail_url, instructor_name, duration, level, language, status, is_featured)
VALUES
(
    'a1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000003',
    'C++ MASTERCLASS',
    'cpp-masterclass',
    'High-performance systems programming, memory mastery, pointer arithmetic, and modern C++20 standard library warfare.',
    'Dominate low-level engineering. This course dismantles hardware-software abstractions, teaching you zero-cost abstractions, SIMD vectorization, cache coherence, custom allocators, multithreaded locks, and memory optimization.',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
    'Sohel Shahriar',
    '14 Weeks',
    'Intermediate to Advanced',
    'Bangla / English Tech',
    'published',
    true
),
(
    'a1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000001',
    'NEXT.JS FULLSTACK WARFARE',
    'nextjs-fullstack-warfare',
    'Production-grade Next.js App Router, SSR, Server Actions, Supabase PostgreSQL, and automated deployment pipelines.',
    'Build high-performance web products that scale to millions. Cover React 19 architecture, Server Components, Edge runtime caching, Row Level Security, transactional billing, and high-conversion UI design.',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    'Sohel Shahriar',
    '12 Weeks',
    'All Levels to Advanced',
    'Bangla / English Tech',
    'published',
    true
),
(
    'a1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000002',
    'SCALABLE SYSTEMS DOMINANCE',
    'scalable-systems-dominance',
    'Distributed systems design, event-driven microservices, Apache Kafka, Redis clustering, and cloud scalability.',
    'Transition from software developer to senior systems architect. Learn high-throughput message queuing, distributed consensus (Raft/Paxos), database sharding, CAP theorem trade-offs, and chaos engineering under extreme loads.',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    'Sohel Shahriar',
    '16 Weeks',
    'Advanced',
    'Bangla / English Tech',
    'published',
    true
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Course Variants (Dynamic Pricing Engine)
INSERT INTO public.course_variants (id, course_id, name, description, sku, regular_price, sale_price, duration_days, is_active)
VALUES
-- C++ Variants
('v1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Recorded Classes', 'Complete on-demand high-definition video archives with lifetime access and code repository.', 'CPP-REC', 1390.00, 999.00, 365, true),
('v1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Recorded vs Live Q&A', 'All recorded archives plus weekly live interactive architectural drills and direct instructor Q&A.', 'CPP-LIVE', 1590.00, 1190.00, 365, true),
('v1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'VIP Spartan Mentorship', 'Direct 1-on-1 code reviews with Sohel Shahriar, career trajectory roadmap, and private war-room.', 'CPP-VIP', 1990.00, 1450.00, 365, true),

-- Next.js Variants
('v1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'Recorded Classes', 'Comprehensive fullstack repository access and lifetime update guarantee.', 'NEXT-REC', 1390.00, 1150.00, 365, true),
('v1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'Recorded vs Live Q&A', 'Bi-weekly live building sessions, production debugging sessions, and community access.', 'NEXT-LIVE', 1690.00, 1299.00, 365, true),
('v1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', 'Warrior Mentorship', 'Full code audits, deployment review, resume sharpening, and job placement assistance.', 'NEXT-VIP', 2190.00, 1599.00, 365, true),

-- Scalable Systems Variants
('v1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000003', 'Recorded Classes', 'All architectural deep-dive modules, system blueprint diagrams, and test suite configs.', 'SYS-REC', 1590.00, 1299.00, 365, true),
('v1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000003', 'Recorded vs Live Q&A', 'Live stress-testing labs, simulated datacenter failure recovery exercises.', 'SYS-LIVE', 1890.00, 1490.00, 365, true),
('v1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000003', 'Executive Tech Advisory', 'Private enterprise design consultations and executive level architectural certification.', 'SYS-VIP', 2490.00, 1850.00, 365, true)
ON CONFLICT (id) DO NOTHING;

-- 4. Payment Settings (Configurable Bangladesh Gateways)
INSERT INTO public.payment_settings (id, provider, display_name, payment_number, account_type, instructions, is_enabled)
VALUES
('p1000000-0000-0000-0000-000000000001', 'bkash', 'bKash', '01844221100', 'Personal', '1. Go to bKash Send Money.\n2. Enter the number 01844221100.\n3. Enter exact course amount.\n4. Copy the TrxID and submit it below.', true),
('p1000000-0000-0000-0000-000000000002', 'nagad', 'Nagad', '01733552211', 'Personal', '1. Go to Nagad Send Money.\n2. Enter the number 01733552211.\n3. Enter exact amount.\n4. Submit your Nagad phone & TrxID.', true),
('p1000000-0000-0000-0000-000000000003', 'rocket', 'Rocket', '01922441100', 'Personal', '1. Dial *322# or open Rocket App.\n2. Choose Send Money to 01922441100.\n3. Submit your Rocket TrxID.', true),
('p1000000-0000-0000-0000-000000000004', 'cash', 'Manual Cash / Office', 'Academy Office', 'Merchant', 'Visit Alpha-Core Academy Headquarters in Chattogram to register and receive instant enrollment clearance.', true)
ON CONFLICT (provider) DO UPDATE
SET payment_number = EXCLUDED.payment_number, display_name = EXCLUDED.display_name;

-- 5. Social Links
INSERT INTO public.social_links (platform, label, url, sort_order, is_active)
VALUES
('facebook', 'Facebook', 'https://facebook.com/alphacoreacademy', 1, true),
('youtube', 'YouTube', 'https://youtube.com/@alphacoreacademy', 2, true),
('linkedin', 'LinkedIn', 'https://linkedin.com/company/alphacore', 3, true),
('instagram', 'Instagram', 'https://instagram.com/alphacoreacademy', 4, true),
('tools', 'Tools Link', 'https://tools.alphacore.academy', 5, true)
ON CONFLICT (platform) DO UPDATE
SET url = EXCLUDED.url;

-- 6. Site Settings
INSERT INTO public.site_settings (setting_key, setting_value)
VALUES
('site_name', 'THE ALPHA-CORE ACADEMY'),
('brand_compact', 'CODE SPARTAN'),
('instructor_name', 'SOHEL SHAHRIAR'),
('tagline', 'DOMINATE THE TECH AND BUSINESS.'),
('secondary_tagline', 'CRUSH COMPETITION. NO EXCUSES.'),
('cta_hero', 'DOMINATE THE CURRICULUM'),
('contact_phone', '+1-800-ALPHA.CS'),
('contact_email', 'ENROLL@ALPHA-CORE.ACADEMY'),
('contact_address', 'CHATTOGRAM, BANGLADESH'),
('currency', 'BDT'),
('currency_symbol', '৳'),
('default_seo_title', 'ALPHA-CORE ACADEMY — Dominate The Tech and Business Stack'),
('default_seo_desc', 'Premier fullstack engineering, systems warfare, and elite business strategy academy led by Sohel Shahriar.')
ON CONFLICT (setting_key) DO UPDATE
SET setting_value = EXCLUDED.setting_value;

-- 7. Homepage Banners
INSERT INTO public.banners (id, title, subtitle, supporting_text, slogan, image_url, button_text, target_url, sort_order, is_active)
VALUES
(
    'b1000000-0000-0000-0000-000000000001',
    'THE ALPHA-CORE ACADEMY.',
    'LED BY SOHEL SHAHRIAR.',
    'Dominate the Tech and Business Stack.',
    'CRUSH COMPETITION. NO EXCUSES.',
    '/images/reference.jpg',
    'DOMINATE THE CURRICULUM',
    '/courses',
    1,
    true
)
ON CONFLICT (id) DO NOTHING;
