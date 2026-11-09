# Bus Bus Baba — Complete Bus Transport Management & Booking SaaS Platform

> **Manage • Operate • Grow**  
> *Target Market:* Bangladesh (BDT ৳, Asia/Dhaka Timezone, Inter-district Highways)

Bus Bus Baba is a complete, production-minded multi-module bus transportation management SaaS platform. It combines a passenger-facing online booking portal with a comprehensive operator control center matching the exact dark navy dashboard specification.

---

## 🎨 Visual Identity & Brand System

- **Primary Background:** `#080F22`
- **Sidebar Background:** `#0C1730`
- **Card Background:** `#111F3B`
- **Elevated Surface:** `#17294A`
- **Primary Functional Blue:** `#1677FF`
- **Secondary Blue Light:** `#38A5FF`
- **Baba Brand Orange:** `#FF991F`
- **Status Colors:**
  - Success: `#10B981`
  - Warning: `#F59E0B`
  - Danger: `#EF4444`
- **Typography:** Plus Jakarta Sans & Inter
- **Iconography:** Lucide React

---

## 🚀 Key Modules & Architecture

### A. Operator Admin Dashboard (`/admin`) — Pixel-Perfect Reference Match
1. **Greeting & Scenic Night Banner:** "Good Morning, Admin 👋" / "Here's what's happening with your fleet today." with the Baba Express highway coach banner and "Travel Smart Travel Better" motto.
2. **4 Benchmark Metric Cards:**
   - **Total Buses:** `48` (↑ 6%) with electric blue sparkline.
   - **Active Routes:** `12` (0%) with purple sparkline.
   - **Today's Bookings:** `842` (↑ 12%) with emerald sparkline.
   - **Total Revenue:** `৳ 2,48,750` (↑ 18%) with orange sparkline.
3. **Booking Overview Area Chart:** Smooth spline with blue glow gradient, 7D, 30D, 3M, 1Y filters, and interactive tooltips showing passenger counts.
4. **Bus Status Donut Chart:** Donut chart with centered `48 Total` label, breakdown of **32 On Trip**, **12 Available**, and **4 Maintenance**.
5. **Upcoming Trips:** Departure cards with status indicators (e.g. *Dhaka → Chittagong 8:00 AM On Time*, *Dhaka → Cox's Bazar 11:00 AM Delayed*).
6. **Recent Bookings:** Live passenger bookings with avatar initials (Md. Rahman, Ayesha Siddika, Tanvir Khan) with BDT prices and time ago timestamps.
7. **Quick Action Grid:** Instant modal triggers for **Add Bus**, **Create Schedule**, **New Booking**, and **View Reports**.

### B. Core Fleet & Operations Modules
- **Bus Management (`/admin/buses`):** 48-bus fleet directory with BRTA registration numbers (`DHAKA METRO-BA 14-8890`), manufacturer (Scania, Hyundai, Hino, Volvo), layout (`2x2`, `2x1`, `sleeper_2x1`), assigned drivers, and status controls.
- **Route Management (`/admin/routes`):** 12 active Bangladesh inter-district highways with intermediate stops, distance in km, travel duration, and base fares.
- **Driver / Pilot Management (`/admin/drivers`):** Verified heavy-vehicle pilot directory with BRTA driving licenses, expiration monitoring, safety ratings (4.8★ - 5.0★), and completed trip manifests.
- **Schedule Management (`/admin/schedules`):** Timetable dispatch system with built-in **collision prevention** that detects and stops assigning occupied coaches or drivers to overlapping departure windows.
- **Bookings & Ticketing (`/admin/bookings`):** Transaction ledger with manual counter booking, booking status updates, cancellation engine, and printable passenger E-Tickets with reference codes (`BBB-2026-XXXX`).
- **Seat Management (`/admin/seats`):** Visual interactive seat layout editor with live occupancy matrix, VIP holds, and counter reservations.
- **Expense Tracking (`/admin/expenses`):** Operational cost tracker for diesel/octane refueling, highway tolls (Meghna, Padma Bridge), workshop maintenance, and driver trip allowances.
- **Payment Settlements (`/admin/payments`):** Digital payment reconciliation for bKash, Nagad, Rocket, credit cards, and counter cash, with refund processing.
- **Reports & Analytics (`/admin/reports`):** Operating margin (P&L), route yield performance, fleet utilization rates, and **one-click CSV export**.
- **Notification Center (`/admin/notifications`):** Real-time alert feed for delay warnings, bulk bookings, and workshop reminders.
- **Platform Settings (`/admin/settings`):** Company profile, BDT currency, Asia/Dhaka timezone, cancellation policies, and RBAC matrix.

### C. Public Booking Portal
- **Homepage (`/`):** Hero section with the master bus search widget, popular Bangladesh destinations (Cox's Bazar, Sylhet, Chittagong, Rajshahi), verified operator showcase, feature highlights, and FAQs.
- **Search Results (`/search`):** Real-time coach filtering by AC/Non-AC, coach class, departure time slots (Morning, Afternoon, Night), and price slider.
- **Interactive Seat Selection (`/book/:scheduleId`):** Realistic bus cockpit layout with live seat selection, dynamic price tally, passenger details form, and simulated payment gateway (bKash, Nagad, Card).
- **Passenger Account (`/my-bookings`):** Search bookings by reference number or mobile phone number, view digital E-Tickets, and request ticket cancellations.

---

## 🔒 Security & Database Integrity

### 1. PostgreSQL Safe Transactional Function
Located at `supabase/migrations/20261109000000_bus_bus_baba_schema.sql`:
- Stored procedure `fn_book_seats`: Acquires row-level locks on `schedule_seats` (`FOR UPDATE`) to eliminate double-booking race conditions when multiple passengers select the same seat simultaneously.

### 2. Row Level Security (RLS)
- Multi-tenant isolation per organization.
- Public read access for active schedules and available seats.
- Role-gated mutations for Super Admin, Company Admin, Manager, Agent, Accountant, Driver, and Passenger.

---

## 💻 Running Locally

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://vhkurukasuzxwdqcefqm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_DEFAULT_CURRENCY=BDT
VITE_DEFAULT_CURRENCY_SYMBOL=৳
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 👥 Role Personas for Demo Testing

Use the user profile dropdown in the top right or `/login` to test with one click:
- **Super Admin:** `admin@busbusbaba.com` (All access)
- **Company Admin:** `director@busbusbaba.com` (M. A. Malek)
- **Fleet Manager:** `manager@busbusbaba.com` (Kabir Hossain)
- **Booking Agent:** `agent@busbusbaba.com` (Shakil Ahmed)
- **Accountant:** `accounts@busbusbaba.com` (Fatema Begum)
- **Highway Pilot:** `rafiq.driver@busbusbaba.com` (Rafiqul Islam)
- **Passenger:** `md.rahman@gmail.com` (Md. Rahman)
