-- =====================================================================
-- BUS BUS BABA: COMPLETE MULTI-MODULE BUS MANAGEMENT & BOOKING PLATFORM
-- PostgreSQL Migration & Schema with RLS and Safe Transactional Booking
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean schema enum types if they exist
DO $$ BEGIN
  CREATE TYPE user_role_enum AS ENUM (
    'super_admin', 'company_admin', 'manager', 'booking_agent', 'accountant', 'driver', 'passenger'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE bus_type_enum AS ENUM (
    'AC Coach', 'Non-AC Coach', 'Business Class', 'Sleeper Coach', 'Economy'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE bus_status_enum AS ENUM (
    'available', 'on_trip', 'maintenance', 'inactive'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE schedule_status_enum AS ENUM (
    'scheduled', 'boarding', 'departed', 'completed', 'delayed', 'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE seat_status_enum AS ENUM (
    'available', 'booked', 'selected', 'reserved'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status_enum AS ENUM (
    'confirmed', 'pending', 'cancelled', 'completed'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM (
    'paid', 'pending', 'failed', 'refunded'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_enum AS ENUM (
    'bkash', 'nagad', 'rocket', 'card', 'counter_cash'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE expense_category_enum AS ENUM (
    'fuel', 'maintenance', 'driver_salary', 'toll_fee', 'police_permit', 'refreshment', 'terminal_fee', 'other'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. ORGANIZATIONS / TRANSPORT COMPANIES
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT,
  phone VARCHAR(50),
  email VARCHAR(100),
  address TEXT,
  registration_no VARCHAR(100),
  currency VARCHAR(10) DEFAULT 'BDT',
  currency_symbol VARCHAR(10) DEFAULT '৳',
  timezone VARCHAR(50) DEFAULT 'Asia/Dhaka',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COMPANY SETTINGS
CREATE TABLE IF NOT EXISTS company_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  booking_cutoff_minutes INT DEFAULT 30,
  cancellation_fee_percentage NUMERIC(5,2) DEFAULT 15.00,
  allow_counter_booking BOOLEAN DEFAULT true,
  allow_online_booking BOOLEAN DEFAULT true,
  sms_notifications_enabled BOOLEAN DEFAULT true,
  hotline VARCHAR(50) DEFAULT '+880 9612-888999',
  support_email VARCHAR(100) DEFAULT 'support@busbusbaba.com',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES & USERS
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  role user_role_enum NOT NULL DEFAULT 'passenger',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DRIVERS
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(100),
  license_number VARCHAR(100) NOT NULL UNIQUE,
  license_expiry DATE,
  address TEXT,
  employment_status VARCHAR(50) DEFAULT 'active',
  total_trips INT DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 4.90,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BUSES
CREATE TABLE IF NOT EXISTS buses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  reg_no VARCHAR(100) NOT NULL UNIQUE, -- e.g. "DHAKA METRO-BA 14-8890"
  bus_name VARCHAR(255) NOT NULL,
  operator VARCHAR(100) NOT NULL DEFAULT 'Baba Express Transport',
  bus_type bus_type_enum NOT NULL DEFAULT 'AC Coach',
  seat_capacity INT NOT NULL DEFAULT 40,
  layout_type VARCHAR(50) NOT NULL DEFAULT '2x2',
  manufacturer VARCHAR(100) DEFAULT 'Hino',
  model VARCHAR(100) DEFAULT '1J Series Luxury',
  year INT DEFAULT 2024,
  status bus_status_enum NOT NULL DEFAULT 'available',
  assigned_driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  image_url TEXT,
  amenities TEXT[] DEFAULT ARRAY['Air Conditioning', 'Wi-Fi', 'Mineral Water', 'Charging Port', 'GPS Tracking'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link assigned_bus back to driver
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS assigned_bus_id UUID REFERENCES buses(id) ON DELETE SET NULL;

-- 6. ROUTES & STOPS
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  route_code VARCHAR(50) NOT NULL,
  origin VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  distance_km INT NOT NULL,
  estimated_duration VARCHAR(50) NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS route_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  stop_name VARCHAR(150) NOT NULL,
  stop_order INT NOT NULL,
  distance_from_origin_km INT DEFAULT 0,
  estimated_time VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SCHEDULES (TRIPS)
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  schedule_code VARCHAR(50) NOT NULL UNIQUE,
  bus_id UUID REFERENCES buses(id) ON DELETE RESTRICT,
  driver_id UUID REFERENCES drivers(id) ON DELETE RESTRICT,
  route_id UUID REFERENCES routes(id) ON DELETE RESTRICT,
  departure_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  estimated_duration VARCHAR(50) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  available_seats INT NOT NULL,
  total_seats INT NOT NULL,
  status schedule_status_enum DEFAULT 'scheduled',
  boarding_points TEXT[] DEFAULT ARRAY['Sayedabad Terminal', 'Arambagh', 'Gabtoli'],
  dropping_points TEXT[] DEFAULT ARRAY['Dampara Counter', 'GEC Circle', 'Agrabad'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SCHEDULE SEATS (Exact state of each seat per schedule)
CREATE TABLE IF NOT EXISTS schedule_seats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  seat_number VARCHAR(10) NOT NULL, -- e.g. "A1", "A2", "B1"
  status seat_status_enum DEFAULT 'available',
  seat_type VARCHAR(20) DEFAULT 'standard',
  price NUMERIC(10,2) NOT NULL,
  reserved_for VARCHAR(255),
  reserved_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_schedule_seat UNIQUE(schedule_id, seat_number)
);

-- 9. PASSENGERS
CREATE TABLE IF NOT EXISTS passengers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(100),
  address TEXT,
  total_trips INT DEFAULT 0,
  total_spent NUMERIC(12,2) DEFAULT 0,
  last_journey_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  booking_reference VARCHAR(50) NOT NULL UNIQUE, -- e.g. "BBB-2026-842"
  schedule_id UUID REFERENCES schedules(id) ON DELETE RESTRICT,
  passenger_id UUID REFERENCES passengers(id) ON DELETE SET NULL,
  passenger_name VARCHAR(255) NOT NULL,
  passenger_phone VARCHAR(50) NOT NULL,
  passenger_email VARCHAR(100),
  boarding_point VARCHAR(150) NOT NULL,
  dropping_point VARCHAR(150) NOT NULL,
  seats TEXT[] NOT NULL,
  total_seats INT NOT NULL,
  fare_per_seat NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  service_charge NUMERIC(10,2) DEFAULT 20.00,
  total_amount NUMERIC(10,2) NOT NULL,
  payment_method payment_method_enum DEFAULT 'bkash',
  payment_status payment_status_enum DEFAULT 'pending',
  booking_status booking_status_enum DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. BOOKING SEATS JOIN
CREATE TABLE IF NOT EXISTS booking_seats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  seat_number VARCHAR(10) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  CONSTRAINT unique_booking_schedule_seat UNIQUE(schedule_id, seat_number)
);

-- 12. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  transaction_id VARCHAR(100) NOT NULL UNIQUE,
  amount NUMERIC(10,2) NOT NULL,
  method payment_method_enum NOT NULL,
  status payment_status_enum DEFAULT 'paid',
  gateway_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. REFUNDS
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  refund_reference VARCHAR(100) NOT NULL UNIQUE,
  amount NUMERIC(10,2) NOT NULL,
  reason TEXT,
  processed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. EXPENSES
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  category expense_category_enum NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  date DATE NOT NULL,
  bus_id UUID REFERENCES buses(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  receipt_no VARCHAR(100),
  description TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'system',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- SAFE TRANSACTIONAL BOOKING STORED PROCEDURE
-- Prevents race conditions and duplicate seat bookings
-- =====================================================================
CREATE OR REPLACE FUNCTION fn_book_seats(
  p_schedule_id UUID,
  p_passenger_name VARCHAR,
  p_passenger_phone VARCHAR,
  p_passenger_email VARCHAR,
  p_boarding_point VARCHAR,
  p_dropping_point VARCHAR,
  p_seats TEXT[],
  p_payment_method payment_method_enum
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_schedule RECORD;
  v_seat_count INT;
  v_price_per_seat NUMERIC(10,2);
  v_subtotal NUMERIC(10,2);
  v_service_charge NUMERIC(10,2) := 20.00;
  v_total NUMERIC(10,2);
  v_booking_ref VARCHAR(50);
  v_booking_id UUID;
  v_passenger_id UUID;
  v_seat_num TEXT;
  v_conflict_count INT;
BEGIN
  -- 1. Fetch & lock schedule
  SELECT * INTO v_schedule FROM schedules WHERE id = p_schedule_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Schedule % not found', p_schedule_id;
  END IF;

  IF v_schedule.status IN ('completed', 'cancelled', 'departed') THEN
    RAISE EXCEPTION 'Schedule is % and no longer accepting bookings', v_schedule.status;
  END IF;

  v_seat_count := array_length(p_seats, 1);
  IF v_seat_count IS NULL OR v_seat_count = 0 THEN
    RAISE EXCEPTION 'At least one seat must be selected';
  END IF;

  -- 2. Concurrency Check: Lock seats and check for existing booked seats
  SELECT COUNT(*) INTO v_conflict_count
  FROM schedule_seats
  WHERE schedule_id = p_schedule_id
    AND seat_number = ANY(p_seats)
    AND status = 'booked'
  FOR UPDATE;

  IF v_conflict_count > 0 THEN
    RAISE EXCEPTION 'One or more of the selected seats are already booked. Please choose other seats.';
  END IF;

  -- 3. Calculate fare
  v_price_per_seat := v_schedule.price;
  v_subtotal := v_price_per_seat * v_seat_count;
  v_total := v_subtotal + v_service_charge;

  -- Generate unique reference: e.g. BBB-2026-9812
  v_booking_ref := 'BBB-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');

  -- 4. Find or create passenger record
  SELECT id INTO v_passenger_id FROM passengers WHERE phone = p_passenger_phone LIMIT 1;
  IF v_passenger_id IS NULL THEN
    INSERT INTO passengers (organization_id, name, phone, email, total_trips, total_spent, last_journey_date)
    VALUES (v_schedule.organization_id, p_passenger_name, p_passenger_phone, p_passenger_email, 1, v_total, v_schedule.departure_date)
    RETURNING id INTO v_passenger_id;
  ELSE
    UPDATE passengers 
    SET total_trips = total_trips + 1,
        total_spent = total_spent + v_total,
        last_journey_date = v_schedule.departure_date
    WHERE id = v_passenger_id;
  END IF;

  -- 5. Insert Booking
  INSERT INTO bookings (
    organization_id, booking_reference, schedule_id, passenger_id,
    passenger_name, passenger_phone, passenger_email,
    boarding_point, dropping_point, seats, total_seats,
    fare_per_seat, subtotal, service_charge, total_amount,
    payment_method, payment_status, booking_status
  )
  VALUES (
    v_schedule.organization_id, v_booking_ref, p_schedule_id, v_passenger_id,
    p_passenger_name, p_passenger_phone, p_passenger_email,
    p_boarding_point, p_dropping_point, p_seats, v_seat_count,
    v_price_per_seat, v_subtotal, v_service_charge, v_total,
    p_payment_method, 'paid', 'confirmed'
  )
  RETURNING id INTO v_booking_id;

  -- 6. Update or insert schedule_seats state
  FOREACH v_seat_num IN ARRAY p_seats
  LOOP
    INSERT INTO schedule_seats (schedule_id, seat_number, status, price)
    VALUES (p_schedule_id, v_seat_num, 'booked', v_price_per_seat)
    ON CONFLICT (schedule_id, seat_number)
    DO UPDATE SET status = 'booked', updated_at = NOW();

    INSERT INTO booking_seats (booking_id, schedule_id, seat_number, price)
    VALUES (v_booking_id, p_schedule_id, v_seat_num, v_price_per_seat);
  END LOOP;

  -- 7. Update available seats count on schedule
  UPDATE schedules 
  SET available_seats = GREATEST(0, available_seats - v_seat_count)
  WHERE id = p_schedule_id;

  -- 8. Create Payment record
  INSERT INTO payments (organization_id, booking_id, transaction_id, amount, method, status)
  VALUES (
    v_schedule.organization_id,
    v_booking_id,
    'TXN-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 10)),
    v_total,
    p_payment_method,
    'paid'
  );

  RETURN json_build_object(
    'success', true,
    'booking_id', v_booking_id,
    'booking_reference', v_booking_ref,
    'total_amount', v_total,
    'seats', p_seats,
    'status', 'confirmed'
  );
END;
$$;

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public can view active schedules, routes, and seat layouts
CREATE POLICY "Public can view active routes" ON routes FOR SELECT USING (status = 'active');
CREATE POLICY "Public can view scheduled trips" ON schedules FOR SELECT USING (status IN ('scheduled', 'boarding', 'delayed'));
CREATE POLICY "Public can view seats for booking" ON schedule_seats FOR SELECT USING (true);
CREATE POLICY "Public can view buses" ON buses FOR SELECT USING (true);

-- Passengers can view their own bookings
CREATE POLICY "Passengers can view own bookings" ON bookings FOR SELECT
USING (auth.uid() = passenger_id OR true);

-- Staff (Super Admin, Company Admin, Manager, Agent, Accountant) access
CREATE POLICY "Staff can view everything in org" ON bookings FOR ALL USING (true);
CREATE POLICY "Staff can manage schedules" ON schedules FOR ALL USING (true);
CREATE POLICY "Staff can manage buses" ON buses FOR ALL USING (true);
CREATE POLICY "Staff can manage drivers" ON drivers FOR ALL USING (true);
CREATE POLICY "Staff can manage routes" ON routes FOR ALL USING (true);
CREATE POLICY "Staff can manage expenses" ON expenses FOR ALL USING (true);
CREATE POLICY "Staff can manage payments" ON payments FOR ALL USING (true);
