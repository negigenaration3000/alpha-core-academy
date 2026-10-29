# ALPHA-CORE ACADEMY (CODE SPARTAN)
### Full-Stack Online Course Platform & Admin Command Center

> **Tagline:** DOMINATE THE TECH AND BUSINESS.  
> **Secondary Slogan:** CRUSH COMPETITION. NO EXCUSES.  
> **Lead Instructor:** Sohel Shahriar  

Alpha-Core Academy is a production-grade, full-stack course selling platform and student management system built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Supabase PostgreSQL**. The visual identity, typography, spacing, and dashboard layouts strictly replicate the reference design.

---

## 1. Visual & Aesthetic Architecture

- **Primary Background:** Warm Ivory (`#F7F1E3`)
- **Main Dark:** Deep Charcoal (`#111111`)
- **Sidebar & Card Dark:** Surface Graphite (`#202124`)
- **Imperial Gold:** Primary (`#C8A653`), Light (`#E8D49A`), Dark (`#A68434`)
- **Secondary Cream:** `#FFF9ED`
- **Accent Rose:** `#E99CB0`
- **Typography:** **Oswald** (Heavy condensed uppercase headings), **Cinzel** (Spartan luxury crests), **Inter** (Clean high-contrast UI body).

---

## 2. Key Modules & Features

### A. Public Storefront
1. **Dynamic Top Header:**
   - Gold crest shield emblem (`/shield-helmet.svg`)
   - Real-time course search input with gold magnifying glass icon
   - Quick role switcher ("Admin Mode" / "Student Mode") for streamlined testing
   - Social media links dynamically populated from database
   - Shopping cart with animated items badge
2. **Hero Carousel:**
   - Dark technology datacenter backdrop
   - Instructor portrait (Sohel Shahriar) in professional suit
   - Prominent slogans, gold CTA button: `"DOMINATE THE CURRICULUM"`
   - Interactive chevron navigation and slide indicators
3. **Feature Highlight Cards:**
   - **Elite Mentorship** (Warm Ivory)
   - **Warrior Mindset** (Imperial Gold Gradient)
   - **Tech Mastery** (Muted Rose)
4. **Category Disciplines:**
   - Frontend Dominance, Backend Architecture, Systems Warfare, Data Strategies
5. **Latest Courses Carousel & Grid:**
   - C++ Masterclass, Next.js Fullstack Warfare, Scalable Systems Dominance
   - 5-Star ratings, gold price banners, instructor avatars, format pills
   - Instant "Add to Cart" and "Buy Now" triggers
6. **Detailed Course Page (`/course/:slug`):**
   - Independent variation-based pricing engine (Recorded, Recorded + Live Q&A, VIP Spartan Mentorship)
   - Price updates dynamically in real time upon selecting a format
7. **Cart & Checkout (`/cart`, `/checkout`):**
   - Bangladeshi manual payment integration (bKash, Nagad, Rocket, Cash)
   - Configurable collection numbers loaded dynamically from database settings
   - Sender mobile number and Transaction ID (TrxID) submission
8. **Real-Time Order Tracking (`/track-order`):**
   - Look up order status by order number (`ACA-2026-XXXX`) or mobile number

### B. Student Portal (`/student/dashboard`)
- **My Courses:** Access-controlled course viewer showing only verified paid enrollments
- **My Orders:** Full transaction audit trail with payment states
- **Profile Settings:** Cadet details and role indicators

### C. Admin Command Center (`/admin`)
- **Visual Design:** Dark vertical sidebar (`#202124`), ivory content (`#F7F1E3`), gold buttons (`#C8A653`)
- **Top Stats Cards:** Total Enrollments, Total Sales, Active Students, Total Courses
- **Sales Overview:** Recharts area line chart with gold gradient fill
- **Recent Enrollments Table:** Student avatar, course variation, amount, status badges
- **Course Variation Management:** Add, edit regular & sale prices, duplicate, and toggle formats
- **Dynamic Payment Gateway Settings:** Real-time editable bKash, Nagad, and Rocket numbers with "SAVE CHANGES"
- **Course & Category Management:** Create, edit, publish/draft courses and categories
- **Manual Payment Verification Queue (`/admin/orders`):** Review submitted TrxIDs and click "Verify" or "Reject" with internal notes

---

## 3. Technology Stack

- **Frontend:** React 18, Vite 5, TypeScript 5, Tailwind CSS 3
- **Icons & Visuals:** Lucide React, Custom SVG Shield & Spartan Crests
- **Charts:** Recharts
- **Forms & Validation:** React Hook Form & Zod
- **Database & Storage:** Supabase PostgreSQL with Row Level Security (RLS)
- **Local Fallback Engine:** Persistent reactive store with localStorage synchronization

---

## 4. Setup & Installation

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...
VITE_DEFAULT_CURRENCY=BDT
VITE_DEFAULT_CURRENCY_SYMBOL=৳
```
*(Note: If left blank or not yet created, the application will automatically run in high-fidelity local simulation mode with all reference data intact).*

### Step 3: Run Supabase SQL Migrations
In your Supabase project's **SQL Editor**:
1. Execute `supabase/migrations/20261028000000_alpha_core_schema.sql` to establish tables, constraints, RLS policies, and RPC verification triggers.
2. Execute `supabase/seed.sql` to load standard categories, courses, variants, payment numbers, and branding.

### Step 4: Bootstrap the First Administrator
Run this query in Supabase SQL Editor after registering an account:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@alpha-core.academy');
```

### Step 5: Start Development Server
```bash
npm run dev
```

### Step 6: Build for Production
```bash
npm run build
```
The optimized bundle will be generated in `dist/`.

---

## 5. Security Architecture

1. **Immutable Order Snapshots:** Course titles, variation names, and unit prices are snapshot into `order_items` at checkout. Future price changes will not alter historical transactions.
2. **Numeric Currency Precision:** `NUMERIC(12, 2)` is enforced for all monetary values.
3. **Privileged Roles:** The client browser cannot elevate a user's role. Administrative actions are protected by `public.is_admin()` server-side checks and RLS policies.
4. **Manual Verification Enforcement:** Courses are only unlocked after an administrator verifies the submitted transaction ID.
