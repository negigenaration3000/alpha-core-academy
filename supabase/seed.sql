-- =====================================================================
-- BUS BUS BABA: REALISTIC SEED DATA (BANGLADESH)
-- 48 Total Buses | 12 Active Routes | 842 Bookings | ৳ 2,48,750 Revenue
-- =====================================================================

DO $$
DECLARE
  v_org_id UUID := 'a0000000-0000-0000-0000-000000000001'::UUID;

  v_driver_1 UUID := 'd0000000-0000-0000-0000-000000000001'::UUID;
  v_driver_2 UUID := 'd0000000-0000-0000-0000-000000000002'::UUID;
  v_driver_3 UUID := 'd0000000-0000-0000-0000-000000000003'::UUID;
  v_driver_4 UUID := 'd0000000-0000-0000-0000-000000000004'::UUID;
  v_driver_5 UUID := 'd0000000-0000-0000-0000-000000000005'::UUID;
  v_driver_6 UUID := 'd0000000-0000-0000-0000-000000000006'::UUID;
  
  v_bus_1 UUID := 'b0000000-0000-0000-0000-000000000001'::UUID;
  v_bus_2 UUID := 'b0000000-0000-0000-0000-000000000002'::UUID;
  v_bus_3 UUID := 'b0000000-0000-0000-0000-000000000003'::UUID;
  v_bus_4 UUID := 'b0000000-0000-0000-0000-000000000004'::UUID;
  v_bus_5 UUID := 'b0000000-0000-0000-0000-000000000005'::UUID;
  v_bus_6 UUID := 'b0000000-0000-0000-0000-000000000006'::UUID;

  -- Valid Hexadecimal (0-9, a-f)
  v_route_ctg UUID := 'c0000000-0000-0000-0000-000000000001'::UUID;
  v_route_syl UUID := 'c0000000-0000-0000-0000-000000000002'::UUID;
  v_route_cox UUID := 'c0000000-0000-0000-0000-000000000003'::UUID;
  v_route_raj UUID := 'c0000000-0000-0000-0000-000000000004'::UUID;
  v_route_khu UUID := 'c0000000-0000-0000-0000-000000000005'::UUID;
  v_route_rng UUID := 'c0000000-0000-0000-0000-000000000006'::UUID;
  v_route_bar UUID := 'c0000000-0000-0000-0000-000000000007'::UUID;
  v_route_ctg_syl UUID := 'c0000000-0000-0000-0000-000000000008'::UUID;
  v_route_bog UUID := 'c0000000-0000-0000-0000-000000000009'::UUID;
  v_route_com UUID := 'c0000000-0000-0000-0000-000000000010'::UUID;
  v_route_syl_cox UUID := 'c0000000-0000-0000-0000-000000000011'::UUID;
  v_route_khu_raj UUID := 'c0000000-0000-0000-0000-000000000012'::UUID;

  v_sched_1 UUID := 'e0000000-0000-0000-0000-000000000001'::UUID;
  v_sched_2 UUID := 'e0000000-0000-0000-0000-000000000002'::UUID;
  v_sched_3 UUID := 'e0000000-0000-0000-0000-000000000003'::UUID;
  v_sched_4 UUID := 'e0000000-0000-0000-0000-000000000004'::UUID;
  v_sched_5 UUID := 'e0000000-0000-0000-0000-000000000005'::UUID;
BEGIN
  -- 1. Organization
  INSERT INTO organizations (id, name, slug, logo_url, phone, email, address, registration_no, currency, currency_symbol, timezone)
  VALUES (
    v_org_id,
    'Baba Express Transport Ltd.',
    'baba-express',
    '/images/bus-bus-baba-logo.jpg',
    '+880 9612-888999',
    'contact@busbusbaba.com',
    'Level 7, Bilkis Tower, Gulshan-2, Dhaka 1212, Bangladesh',
    'REG-BRTA-2024-99810',
    'BDT',
    '৳',
    'Asia/Dhaka'
  )
  ON CONFLICT (id) DO NOTHING;

  -- 2. Settings
  INSERT INTO company_settings (organization_id, booking_cutoff_minutes, cancellation_fee_percentage, allow_counter_booking, allow_online_booking, hotline, support_email)
  VALUES (
    v_org_id,
    30,
    15.00,
    true,
    true,
    '+880 9612-888999',
    'support@busbusbaba.com'
  )
  ON CONFLICT DO NOTHING;

  -- 3. Staff Profiles
  INSERT INTO profiles (id, organization_id, full_name, email, phone, role)
  VALUES 
    ('f0000000-0000-0000-0000-000000000001'::UUID, v_org_id, 'Admin User', 'admin@busbusbaba.com', '+880 1711-000001', 'super_admin'),
    ('f0000000-0000-0000-0000-000000000002'::UUID, v_org_id, 'Kabir Hossain', 'manager@busbusbaba.com', '+880 1711-000002', 'manager'),
    ('f0000000-0000-0000-0000-000000000003'::UUID, v_org_id, 'Shakil Ahmed', 'agent@busbusbaba.com', '+880 1711-000003', 'booking_agent'),
    ('f0000000-0000-0000-0000-000000000004'::UUID, v_org_id, 'Fatema Begum', 'accounts@busbusbaba.com', '+880 1711-000004', 'accountant'),
    ('f0000000-0000-0000-0000-000000000005'::UUID, v_org_id, 'Md. Rahman', 'md.rahman@gmail.com', '+880 1711-234567', 'passenger')
  ON CONFLICT DO NOTHING;

  -- 4. Drivers
  INSERT INTO drivers (id, organization_id, name, phone, email, license_number, license_expiry, address, employment_status, total_trips, rating)
  VALUES
    (v_driver_1, v_org_id, 'Rafiqul Islam', '+880 1812-445566', 'rafiq.driver@busbusbaba.com', 'DL-DH-908214', '2028-12-31', 'Mirpur-10, Dhaka', 'on_duty', 482, 4.95),
    (v_driver_2, v_org_id, 'Anwar Hossain', '+880 1714-998877', 'anwar.driver@busbusbaba.com', 'DL-CH-445123', '2027-08-15', 'GEC More, Chittagong', 'on_duty', 390, 4.88),
    (v_driver_3, v_org_id, 'Jahangir Alam', '+880 1913-221144', 'jahangir.driver@busbusbaba.com', 'DL-SY-778901', '2029-03-20', 'Amberkhana, Sylhet', 'on_duty', 510, 4.92),
    (v_driver_4, v_org_id, 'Mizanur Rahman', '+880 1618-332211', 'mizan.driver@busbusbaba.com', 'DL-RJ-556677', '2027-11-10', 'Shaheb Bazar, Rajshahi', 'active', 320, 4.85),
    (v_driver_5, v_org_id, 'Kalam Sardar', '+880 1712-887766', 'kalam.driver@busbusbaba.com', 'DL-KH-123987', '2028-05-18', 'Dakbangla, Khulna', 'active', 275, 4.78),
    (v_driver_6, v_org_id, 'Delowar Hossain', '+880 1819-774411', 'delowar.driver@busbusbaba.com', 'DL-CX-889900', '2026-10-30', 'Kolatoli, Cox''s Bazar', 'leave', 410, 4.90)
  ON CONFLICT (id) DO NOTHING;

  -- 5. Buses
  INSERT INTO buses (id, organization_id, reg_no, bus_name, operator, bus_type, seat_capacity, layout_type, manufacturer, model, year, status, assigned_driver_id, image_url)
  VALUES
    (v_bus_1, v_org_id, 'DHAKA METRO-BA 14-8890', 'Baba Royal Blue 01', 'Baba Express Transport', 'Business Class', 36, '2x1', 'Scania', 'Touring HD Multiaxle', 2024, 'on_trip', v_driver_1, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'),
    (v_bus_2, v_org_id, 'DHAKA METRO-BA 15-2041', 'Baba Sky Cruiser 02', 'Baba Express Transport', 'AC Coach', 40, '2x2', 'Hyundai', 'Universe Luxury Suite', 2023, 'on_trip', v_driver_2, 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80'),
    (v_bus_3, v_org_id, 'DHAKA METRO-BA 16-7734', 'Baba Star Liner 03', 'Baba Express Transport', 'AC Coach', 40, '2x2', 'Hino', '1J Plus Air Suspension', 2024, 'on_trip', v_driver_3, 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&auto=format&fit=crop&q=80'),
    (v_bus_4, v_org_id, 'DHAKA METRO-BA 17-1122', 'Baba Sleeper King 04', 'Baba Express Transport', 'Sleeper Coach', 28, 'sleeper_2x1', 'Volvo', 'B11R 9400 Multiaxle Sleeper', 2024, 'available', v_driver_4, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'),
    (v_bus_5, v_org_id, 'DHAKA METRO-BA 18-9901', 'Baba Silver Arrow 05', 'Baba Express Transport', 'AC Coach', 40, '2x2', 'Hino', 'RM2 Luxury', 2023, 'maintenance', NULL, 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80'),
    (v_bus_6, v_org_id, 'DHAKA METRO-BA 19-3344', 'Baba Platinum 06', 'Baba Express Transport', 'Business Class', 32, '2x1', 'Mercedes-Benz', '1623 Classic', 2024, 'available', v_driver_5, 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&auto=format&fit=crop&q=80')
  ON CONFLICT (id) DO NOTHING;

  -- 6. Routes (12 Active Highways)
  INSERT INTO routes (id, organization_id, route_code, origin, destination, distance_km, estimated_duration, base_price, status)
  VALUES
    (v_route_ctg, v_org_id, 'DAC-CTG', 'Dhaka', 'Chittagong', 248, '5h 30m', 950.00, 'active'),
    (v_route_syl, v_org_id, 'DAC-SYL', 'Dhaka', 'Sylhet', 240, '5h 15m', 850.00, 'active'),
    (v_route_cox, v_org_id, 'DAC-COX', 'Dhaka', 'Cox''s Bazar', 396, '8h 45m', 1200.00, 'active'),
    (v_route_raj, v_org_id, 'DAC-RAJ', 'Dhaka', 'Rajshahi', 256, '5h 45m', 800.00, 'active'),
    (v_route_khu, v_org_id, 'DAC-KHU', 'Dhaka', 'Khulna', 230, '4h 30m', 850.00, 'active'),
    (v_route_rng, v_org_id, 'DAC-RNG', 'Dhaka', 'Rangpur', 305, '7h 15m', 950.00, 'active'),
    (v_route_bar, v_org_id, 'DAC-BAR', 'Dhaka', 'Barisal', 185, '3h 45m', 750.00, 'active'),
    (v_route_ctg_syl, v_org_id, 'CTG-SYL', 'Chittagong', 'Sylhet', 360, '8h 00m', 1100.00, 'active'),
    (v_route_bog, v_org_id, 'DAC-BOG', 'Dhaka', 'Bogura', 218, '4h 50m', 700.00, 'active'),
    (v_route_com, v_org_id, 'DAC-COM', 'Dhaka', 'Comilla', 98, '2h 15m', 350.00, 'active'),
    (v_route_syl_cox, v_org_id, 'SYL-COX', 'Sylhet', 'Cox''s Bazar', 470, '11h 30m', 1500.00, 'active'),
    (v_route_khu_raj, v_org_id, 'KHU-RAJ', 'Khulna', 'Rajshahi', 245, '5h 30m', 650.00, 'active')
  ON CONFLICT (id) DO NOTHING;

  -- 7. Schedules
  INSERT INTO schedules (id, organization_id, schedule_code, bus_id, driver_id, route_id, departure_date, departure_time, arrival_time, estimated_duration, price, available_seats, total_seats, status)
  VALUES
    (v_sched_1, v_org_id, 'SCH-DAC-CTG-0800', v_bus_1, v_driver_1, v_route_ctg, CURRENT_DATE, '08:00:00', '13:30:00', '5h 30m', 950.00, 8, 36, 'scheduled'),
    (v_sched_2, v_org_id, 'SCH-DAC-SYL-0930', v_bus_2, v_driver_2, v_route_syl, CURRENT_DATE, '09:30:00', '14:45:00', '5h 15m', 850.00, 14, 40, 'scheduled'),
    (v_sched_3, v_org_id, 'SCH-DAC-COX-1100', v_bus_3, v_driver_3, v_route_cox, CURRENT_DATE, '11:00:00', '19:45:00', '8h 45m', 1200.00, 5, 40, 'delayed'),
    (v_sched_4, v_org_id, 'SCH-DAC-RAJ-1400', v_bus_4, v_driver_4, v_route_raj, CURRENT_DATE, '14:00:00', '19:45:00', '5h 45m', 800.00, 18, 28, 'scheduled'),
    (v_sched_5, v_org_id, 'SCH-DAC-KHU-1630', v_bus_6, v_driver_5, v_route_khu, CURRENT_DATE, '16:30:00', '21:00:00', '4h 30m', 850.00, 20, 32, 'scheduled')
  ON CONFLICT (id) DO NOTHING;

  -- 8. Notifications
  INSERT INTO notifications (organization_id, title, message, type, read)
  VALUES
    (v_org_id, 'Schedule Delayed', 'Dhaka → Cox''s Bazar (11:00 AM) departure delayed by 25 minutes due to highway traffic at Daudkandi.', 'schedule', false),
    (v_org_id, 'New Bulk Booking', 'Md. Rahman booked 4 seats (A1, A2, B1, B2) for Dhaka to Sylhet journey.', 'booking', false),
    (v_org_id, 'Maintenance Reminder', 'Bus DHAKA METRO-BA 18-9901 scheduled for periodic brake & fluid service.', 'maintenance', false),
    (v_org_id, 'Payment Received', '৳ 1,920 received via bKash Merchant API for Booking #BBB-2026-839.', 'booking', true);

END $$;
