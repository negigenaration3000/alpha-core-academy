import {
  Bus,
  BusRoute,
  Driver,
  Schedule,
  Booking,
  Passenger,
  Expense,
  PaymentRecord,
  SystemNotification,
  CompanySettings,
  SeatItem,
  UserRole,
  UserProfile,
} from '../types/bus';

// Local storage keys
const STORAGE_PREFIX = 'bus_bus_baba_';
const KEYS = {
  BUSES: `${STORAGE_PREFIX}buses`,
  ROUTES: `${STORAGE_PREFIX}routes`,
  DRIVERS: `${STORAGE_PREFIX}drivers`,
  SCHEDULES: `${STORAGE_PREFIX}schedules`,
  BOOKINGS: `${STORAGE_PREFIX}bookings`,
  PASSENGERS: `${STORAGE_PREFIX}passengers`,
  EXPENSES: `${STORAGE_PREFIX}expenses`,
  PAYMENTS: `${STORAGE_PREFIX}payments`,
  NOTIFICATIONS: `${STORAGE_PREFIX}notifications`,
  SETTINGS: `${STORAGE_PREFIX}settings`,
  USER: `${STORAGE_PREFIX}current_user`,
};

// Default Company Settings
export const DEFAULT_SETTINGS: CompanySettings = {
  id: 'baba-settings-01',
  name: 'Baba Express Transport Ltd.',
  tagline: 'Manage • Operate • Grow',
  hotline: '+880 9612-888999',
  support_email: 'support@busbusbaba.com',
  address: 'Level 7, Bilkis Tower, Gulshan-2, Dhaka 1212, Bangladesh',
  currency: 'BDT',
  currency_symbol: '৳',
  timezone: 'Asia/Dhaka',
  cancellation_fee_percentage: 15,
  counter_booking_enabled: true,
  online_booking_enabled: true,
};

// Initial Seed Drivers
const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'drv-01',
    name: 'Rafiqul Islam',
    phone: '+880 1812-445566',
    email: 'rafiq.driver@busbusbaba.com',
    license_number: 'DL-DH-908214',
    license_expiry: '2028-12-31',
    address: 'Mirpur-10, Dhaka',
    employment_status: 'on_duty',
    assigned_bus_id: 'bus-01',
    assigned_bus_reg: 'DHAKA METRO-BA 14-8890',
    total_trips: 482,
    rating: 4.95,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'drv-02',
    name: 'Anwar Hossain',
    phone: '+880 1714-998877',
    email: 'anwar.driver@busbusbaba.com',
    license_number: 'DL-CH-445123',
    license_expiry: '2027-08-15',
    address: 'GEC More, Chittagong',
    employment_status: 'on_duty',
    assigned_bus_id: 'bus-02',
    assigned_bus_reg: 'DHAKA METRO-BA 15-2041',
    total_trips: 390,
    rating: 4.88,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'drv-03',
    name: 'Jahangir Alam',
    phone: '+880 1913-221144',
    email: 'jahangir.driver@busbusbaba.com',
    license_number: 'DL-SY-778901',
    license_expiry: '2029-03-20',
    address: 'Amberkhana, Sylhet',
    employment_status: 'on_duty',
    assigned_bus_id: 'bus-03',
    assigned_bus_reg: 'DHAKA METRO-BA 16-7734',
    total_trips: 510,
    rating: 4.92,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'drv-04',
    name: 'Mizanur Rahman',
    phone: '+880 1618-332211',
    email: 'mizan.driver@busbusbaba.com',
    license_number: 'DL-RJ-556677',
    license_expiry: '2027-11-10',
    address: 'Shaheb Bazar, Rajshahi',
    employment_status: 'active',
    assigned_bus_id: 'bus-04',
    assigned_bus_reg: 'DHAKA METRO-BA 17-1122',
    total_trips: 320,
    rating: 4.85,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'drv-05',
    name: 'Kalam Sardar',
    phone: '+880 1712-887766',
    email: 'kalam.driver@busbusbaba.com',
    license_number: 'DL-KH-123987',
    license_expiry: '2028-05-18',
    address: 'Dakbangla, Khulna',
    employment_status: 'active',
    total_trips: 275,
    rating: 4.78,
  },
  {
    id: 'drv-06',
    name: 'Delowar Hossain',
    phone: '+880 1819-774411',
    email: 'delowar.driver@busbusbaba.com',
    license_number: 'DL-CX-889900',
    license_expiry: '2026-10-30',
    address: 'Kolatoli, Cox\'s Bazar',
    employment_status: 'leave',
    total_trips: 410,
    rating: 4.90,
  }
];

// Initial 12 Active Routes
const INITIAL_ROUTES: BusRoute[] = [
  {
    id: 'rt-01',
    route_code: 'DAC-CTG',
    origin: 'Dhaka',
    destination: 'Chittagong',
    distance_km: 248,
    estimated_duration: '5h 30m',
    stops: ['Sayedabad', 'Kanchpur', 'Cumilla Cantonment', 'Feni', 'Dampara'],
    base_price: 950,
    status: 'active',
    bus_count: 8,
  },
  {
    id: 'rt-02',
    route_code: 'DAC-SYL',
    origin: 'Dhaka',
    destination: 'Sylhet',
    distance_km: 240,
    estimated_duration: '5h 15m',
    stops: ['Sayedabad', 'Narsingdi', 'Bhairab', 'Brahmanbaria', 'Kadamtoli'],
    base_price: 850,
    status: 'active',
    bus_count: 6,
  },
  {
    id: 'rt-03',
    route_code: 'DAC-COX',
    origin: 'Dhaka',
    destination: 'Cox\'s Bazar',
    distance_km: 396,
    estimated_duration: '8h 45m',
    stops: ['Arambagh', 'Chittagong Bypass', 'Chakaria', 'Kolatoli Beach'],
    base_price: 1200,
    status: 'active',
    bus_count: 10,
  },
  {
    id: 'rt-04',
    route_code: 'DAC-RAJ',
    origin: 'Dhaka',
    destination: 'Rajshahi',
    distance_km: 256,
    estimated_duration: '5h 45m',
    stops: ['Gabtoli', 'Chandra', 'Sirajganj', 'Natore', 'Shiroil'],
    base_price: 800,
    status: 'active',
    bus_count: 4,
  },
  {
    id: 'rt-05',
    route_code: 'DAC-KHU',
    origin: 'Dhaka',
    destination: 'Khulna',
    distance_km: 230,
    estimated_duration: '4h 30m',
    stops: ['Padma Bridge', 'Bhanga', 'Gopalganj', 'Sonadanga'],
    base_price: 850,
    status: 'active',
    bus_count: 5,
  },
  {
    id: 'rt-06',
    route_code: 'DAC-RNG',
    origin: 'Dhaka',
    destination: 'Rangpur',
    distance_km: 305,
    estimated_duration: '7h 15m',
    stops: ['Gabtoli', 'Bogura Bypass', 'Gobindaganj', 'Modern More'],
    base_price: 950,
    status: 'active',
    bus_count: 3,
  },
  {
    id: 'rt-07',
    route_code: 'DAC-BAR',
    origin: 'Dhaka',
    destination: 'Barisal',
    distance_km: 185,
    estimated_duration: '3h 45m',
    stops: ['Padma Bridge', 'Bhanga', 'Madaripur', 'Nathullabad'],
    base_price: 750,
    status: 'active',
    bus_count: 3,
  },
  {
    id: 'rt-08',
    route_code: 'CTG-SYL',
    origin: 'Chittagong',
    destination: 'Sylhet',
    distance_km: 360,
    estimated_duration: '8h 00m',
    stops: ['Dampara', 'Feni', 'Cumilla', 'Habiganj', 'Sylhet Kadamtoli'],
    base_price: 1100,
    status: 'active',
    bus_count: 2,
  },
  {
    id: 'rt-09',
    route_code: 'DAC-BOG',
    origin: 'Dhaka',
    destination: 'Bogura',
    distance_km: 218,
    estimated_duration: '4h 50m',
    stops: ['Gabtoli', 'Tangail Bypass', 'Sirajganj', 'Thonthonia'],
    base_price: 700,
    status: 'active',
    bus_count: 2,
  },
  {
    id: 'rt-10',
    route_code: 'DAC-COM',
    origin: 'Dhaka',
    destination: 'Comilla',
    distance_km: 98,
    estimated_duration: '2h 15m',
    stops: ['Sayedabad', 'Meghna Toll', 'Daudkandi', 'Shashongachha'],
    base_price: 350,
    status: 'active',
    bus_count: 2,
  },
  {
    id: 'rt-11',
    route_code: 'SYL-COX',
    origin: 'Sylhet',
    destination: 'Cox\'s Bazar',
    distance_km: 470,
    estimated_duration: '11h 30m',
    stops: ['Kadamtoli', 'Brahmanbaria', 'Cumilla', 'Chittagong', 'Kolatoli'],
    base_price: 1500,
    status: 'active',
    bus_count: 2,
  },
  {
    id: 'rt-12',
    route_code: 'KHU-RAJ',
    origin: 'Khulna',
    destination: 'Rajshahi',
    distance_km: 245,
    estimated_duration: '5h 30m',
    stops: ['Sonadanga', 'Jessore', 'Jhenaidah', 'Kushtia', 'Shiroil'],
    base_price: 650,
    status: 'active',
    bus_count: 1,
  },
];

// Generate exactly 48 buses matching the reference dashboard:
// 32 On Trip, 12 Available, 4 Maintenance = Total 48 Buses!
const generateInitialBuses = (): Bus[] => {
  const buses: Bus[] = [
    {
      id: 'bus-01',
      reg_no: 'DHAKA METRO-BA 14-8890',
      bus_name: 'Baba Royal Blue 01',
      operator: 'Baba Express Transport',
      bus_type: 'Business Class',
      seat_capacity: 36,
      layout_type: '2x1',
      manufacturer: 'Scania',
      model: 'Touring HD Multiaxle',
      year: 2024,
      status: 'on_trip',
      assigned_driver_id: 'drv-01',
      assigned_driver_name: 'Rafiqul Islam',
      image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
      amenities: ['Air Conditioning', 'Super Reclining Seats', 'Wi-Fi', 'USB Charging', 'Mineral Water', 'Emergency GPS'],
    },
    {
      id: 'bus-02',
      reg_no: 'DHAKA METRO-BA 15-2041',
      bus_name: 'Baba Sky Cruiser 02',
      operator: 'Baba Express Transport',
      bus_type: 'AC Coach',
      seat_capacity: 40,
      layout_type: '2x2',
      manufacturer: 'Hyundai',
      model: 'Universe Luxury Suite',
      year: 2023,
      status: 'on_trip',
      assigned_driver_id: 'drv-02',
      assigned_driver_name: 'Anwar Hossain',
      image_url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80',
      amenities: ['Air Conditioning', 'Comfort Seats', 'Reading Lights', 'Mineral Water', 'Music System'],
    },
    {
      id: 'bus-03',
      reg_no: 'DHAKA METRO-BA 16-7734',
      bus_name: 'Baba Star Liner 03',
      operator: 'Baba Express Transport',
      bus_type: 'AC Coach',
      seat_capacity: 40,
      layout_type: '2x2',
      manufacturer: 'Hino',
      model: '1J Plus Air Suspension',
      year: 2024,
      status: 'on_trip',
      assigned_driver_id: 'drv-03',
      assigned_driver_name: 'Jahangir Alam',
      image_url: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&auto=format&fit=crop&q=80',
      amenities: ['Air Conditioning', 'Ergonomic Seats', 'Charging Ports', 'Water Bottle'],
    },
    {
      id: 'bus-04',
      reg_no: 'DHAKA METRO-BA 17-1122',
      bus_name: 'Baba Sleeper King 04',
      operator: 'Baba Express Transport',
      bus_type: 'Sleeper Coach',
      seat_capacity: 28,
      layout_type: 'sleeper_2x1',
      manufacturer: 'Volvo',
      model: 'B11R 9400 Multiaxle Sleeper',
      year: 2024,
      status: 'available',
      assigned_driver_id: 'drv-04',
      assigned_driver_name: 'Mizanur Rahman',
      image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
      amenities: ['Flat Bed Sleeper', 'Privacy Curtains', 'AC Individual Vents', 'Charging Ports', 'Blanket & Pillow'],
    },
    {
      id: 'bus-05',
      reg_no: 'DHAKA METRO-BA 18-9901',
      bus_name: 'Baba Silver Arrow 05',
      operator: 'Baba Express Transport',
      bus_type: 'AC Coach',
      seat_capacity: 40,
      layout_type: '2x2',
      manufacturer: 'Hino',
      model: 'RM2 Luxury',
      year: 2023,
      status: 'maintenance',
      image_url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80',
      amenities: ['Air Conditioning', 'Pushback Seats', 'Charging Port'],
    },
    {
      id: 'bus-06',
      reg_no: 'DHAKA METRO-BA 19-3344',
      bus_name: 'Baba Platinum 06',
      operator: 'Baba Express Transport',
      bus_type: 'Business Class',
      seat_capacity: 32,
      layout_type: '2x1',
      manufacturer: 'Mercedes-Benz',
      model: '1623 Classic',
      year: 2024,
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&auto=format&fit=crop&q=80',
      amenities: ['Business Class Seats', 'High Speed Wi-Fi', 'Refreshment Pack', 'USB-C'],
    },
  ];

  // Fill up remaining buses to reach exactly 48:
  // We need 32 on_trip, 12 available, 4 maintenance
  const currentOnTrip = buses.filter(b => b.status === 'on_trip').length; // 3
  const currentAvailable = buses.filter(b => b.status === 'available').length; // 2
  const currentMaintenance = buses.filter(b => b.status === 'maintenance').length; // 1

  const neededOnTrip = 32 - currentOnTrip; // 29
  const neededAvailable = 12 - currentAvailable; // 10
  const neededMaintenance = 4 - currentMaintenance; // 3

  let idx = 7;
  for (let i = 0; i < neededOnTrip; i++) {
    buses.push({
      id: `bus-${idx}`,
      reg_no: `DHAKA METRO-BA ${20 + idx}-${1000 + idx}`,
      bus_name: `Baba Express Liner ${idx < 10 ? '0' + idx : idx}`,
      operator: 'Baba Express Transport',
      bus_type: i % 3 === 0 ? 'Business Class' : i % 2 === 0 ? 'AC Coach' : 'Non-AC Coach',
      seat_capacity: 40,
      layout_type: '2x2',
      manufacturer: i % 2 === 0 ? 'Hino' : 'Hyundai',
      model: 'Deluxe Cruiser',
      year: 2023,
      status: 'on_trip',
      image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
      amenities: ['Air Conditioning', 'Reclining Seats', 'GPS'],
    });
    idx++;
  }

  for (let i = 0; i < neededAvailable; i++) {
    buses.push({
      id: `bus-${idx}`,
      reg_no: `DHAKA METRO-BA ${20 + idx}-${1000 + idx}`,
      bus_name: `Baba Reserve Cruiser ${idx < 10 ? '0' + idx : idx}`,
      operator: 'Baba Express Transport',
      bus_type: i % 2 === 0 ? 'AC Coach' : 'Economy',
      seat_capacity: 40,
      layout_type: '2x2',
      manufacturer: 'Hino',
      model: '1J Series',
      year: 2024,
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80',
      amenities: ['Air Conditioning', 'Mineral Water'],
    });
    idx++;
  }

  for (let i = 0; i < neededMaintenance; i++) {
    buses.push({
      id: `bus-${idx}`,
      reg_no: `DHAKA METRO-BA ${20 + idx}-${1000 + idx}`,
      bus_name: `Baba Maintenance Unit ${idx < 10 ? '0' + idx : idx}`,
      operator: 'Baba Express Transport',
      bus_type: 'AC Coach',
      seat_capacity: 40,
      layout_type: '2x2',
      manufacturer: 'Scania',
      model: 'K360EB',
      year: 2022,
      status: 'maintenance',
      image_url: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&auto=format&fit=crop&q=80',
      amenities: ['Air Conditioning'],
    });
    idx++;
  }

  return buses;
};

// Initial Schedules matching the exact screenshot
const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 'sch-01',
    schedule_code: 'SCH-DAC-CTG-0800',
    bus_id: 'bus-01',
    bus_name: 'Baba Royal Blue 01',
    reg_no: 'DHAKA METRO-BA 14-8890',
    bus_type: 'Business Class',
    driver_id: 'drv-01',
    driver_name: 'Rafiqul Islam',
    route_id: 'rt-01',
    origin: 'Dhaka',
    destination: 'Chittagong',
    departure_date: new Date().toISOString().split('T')[0],
    departure_time: '08:00 AM',
    arrival_time: '01:30 PM',
    estimated_duration: '5h 30m',
    price: 950,
    available_seats: 8,
    total_seats: 36,
    status: 'scheduled',
    boarding_points: ['Sayedabad Terminal (07:30 AM)', 'Arambagh (07:45 AM)', 'Kanchpur (08:15 AM)'],
    dropping_points: ['Dampara Bus Stand', 'GEC Circle', 'Agrabad Counter'],
  },
  {
    id: 'sch-02',
    schedule_code: 'SCH-DAC-SYL-0930',
    bus_id: 'bus-02',
    bus_name: 'Baba Sky Cruiser 02',
    reg_no: 'DHAKA METRO-BA 15-2041',
    bus_type: 'AC Coach',
    driver_id: 'drv-02',
    driver_name: 'Anwar Hossain',
    route_id: 'rt-02',
    origin: 'Dhaka',
    destination: 'Sylhet',
    departure_date: new Date().toISOString().split('T')[0],
    departure_time: '09:30 AM',
    arrival_time: '02:45 PM',
    estimated_duration: '5h 15m',
    price: 850,
    available_seats: 14,
    total_seats: 40,
    status: 'scheduled',
    boarding_points: ['Sayedabad Terminal (09:00 AM)', 'Narsingdi Bypass (10:15 AM)'],
    dropping_points: ['Kadamtoli Bus Terminal', 'Amberkhana Point', 'Subidbazar'],
  },
  {
    id: 'sch-03',
    schedule_code: 'SCH-DAC-COX-1100',
    bus_id: 'bus-03',
    bus_name: 'Baba Star Liner 03',
    reg_no: 'DHAKA METRO-BA 16-7734',
    bus_type: 'AC Coach',
    driver_id: 'drv-03',
    driver_name: 'Jahangir Alam',
    route_id: 'rt-03',
    origin: 'Dhaka',
    destination: 'Cox\'s Bazar',
    departure_date: new Date().toISOString().split('T')[0],
    departure_time: '11:00 AM',
    arrival_time: '07:45 PM',
    estimated_duration: '8h 45m',
    price: 1200,
    available_seats: 5,
    total_seats: 40,
    status: 'delayed',
    boarding_points: ['Arambagh (10:30 AM)', 'Sayedabad (11:00 AM)', 'Chittagong Road (11:30 AM)'],
    dropping_points: ['Chakaria Counter', 'Jhawtola Main Road', 'Kolatoli Dolphin Mor'],
  },
  {
    id: 'sch-04',
    schedule_code: 'SCH-DAC-RAJ-1400',
    bus_id: 'bus-04',
    bus_name: 'Baba Sleeper King 04',
    reg_no: 'DHAKA METRO-BA 17-1122',
    bus_type: 'Sleeper Coach',
    driver_id: 'drv-04',
    driver_name: 'Mizanur Rahman',
    route_id: 'rt-04',
    origin: 'Dhaka',
    destination: 'Rajshahi',
    departure_date: new Date().toISOString().split('T')[0],
    departure_time: '02:00 PM',
    arrival_time: '07:45 PM',
    estimated_duration: '5h 45m',
    price: 800,
    available_seats: 18,
    total_seats: 28,
    status: 'scheduled',
    boarding_points: ['Gabtoli Terminal (01:30 PM)', 'Chandra (02:30 PM)'],
    dropping_points: ['Natore Counter', 'Shiroil Bus Terminal'],
  },
  {
    id: 'sch-05',
    schedule_code: 'SCH-DAC-KHU-1630',
    bus_id: 'bus-06',
    bus_name: 'Baba Platinum 06',
    reg_no: 'DHAKA METRO-BA 19-3344',
    bus_type: 'Business Class',
    driver_id: 'drv-05',
    driver_name: 'Kalam Sardar',
    route_id: 'rt-05',
    origin: 'Dhaka',
    destination: 'Khulna',
    departure_date: new Date().toISOString().split('T')[0],
    departure_time: '04:30 PM',
    arrival_time: '09:00 PM',
    estimated_duration: '4h 30m',
    price: 850,
    available_seats: 20,
    total_seats: 32,
    status: 'scheduled',
    boarding_points: ['Jatrabari Expressway Counter', 'Mawa Toll Plaza'],
    dropping_points: ['Bhanga Junction', 'Sonadanga Central Terminal'],
  },
];

// Initial Bookings matching recent items in screenshot:
// MR: Md. Rahman (Dhaka -> Sylhet, ৳850, 2m ago)
// AS: Ayesha Siddika (Dhaka -> Cox's Bazar, ৳1,200, 5m ago)
// TK: Tanvir Khan (Dhaka -> Chittagong, ৳950, 8m ago)
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bkg-842',
    booking_reference: 'BBB-2026-842',
    schedule_id: 'sch-02',
    route_id: 'rt-02',
    route_title: 'Dhaka → Sylhet',
    origin: 'Dhaka',
    destination: 'Sylhet',
    bus_name: 'Baba Sky Cruiser 02',
    bus_type: 'AC Coach',
    departure_date: new Date().toISOString().split('T')[0],
    departure_time: '09:30 AM',
    arrival_time: '02:45 PM',
    passenger_name: 'Md. Rahman',
    passenger_phone: '+880 1711-234567',
    passenger_email: 'md.rahman@gmail.com',
    boarding_point: 'Sayedabad Terminal',
    dropping_point: 'Kadamtoli Bus Terminal',
    seats: ['B1'],
    total_seats: 1,
    fare_per_seat: 850,
    subtotal: 850,
    service_charge: 0,
    total_amount: 850,
    payment_method: 'bkash',
    payment_status: 'paid',
    booking_status: 'confirmed',
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 mins ago
  },
  {
    id: 'bkg-841',
    booking_reference: 'BBB-2026-841',
    schedule_id: 'sch-03',
    route_id: 'rt-03',
    route_title: 'Dhaka → Cox\'s Bazar',
    origin: 'Dhaka',
    destination: 'Cox\'s Bazar',
    bus_name: 'Baba Star Liner 03',
    bus_type: 'AC Coach',
    departure_date: new Date().toISOString().split('T')[0],
    departure_time: '11:00 AM',
    arrival_time: '07:45 PM',
    passenger_name: 'Ayesha Siddika',
    passenger_phone: '+880 1819-876543',
    passenger_email: 'ayesha.siddika@outlook.com',
    boarding_point: 'Arambagh Counter',
    dropping_point: 'Kolatoli Dolphin Mor',
    seats: ['A2'],
    total_seats: 1,
    fare_per_seat: 1200,
    subtotal: 1200,
    service_charge: 0,
    total_amount: 1200,
    payment_method: 'nagad',
    payment_status: 'paid',
    booking_status: 'confirmed',
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
  },
  {
    id: 'bkg-840',
    booking_reference: 'BBB-2026-840',
    schedule_id: 'sch-01',
    route_id: 'rt-01',
    route_title: 'Dhaka → Chittagong',
    origin: 'Dhaka',
    destination: 'Chittagong',
    bus_name: 'Baba Royal Blue 01',
    bus_type: 'Business Class',
    departure_date: new Date().toISOString().split('T')[0],
    departure_time: '08:00 AM',
    arrival_time: '01:30 PM',
    passenger_name: 'Tanvir Khan',
    passenger_phone: '+880 1912-349812',
    passenger_email: 'tanvir.khan@yahoo.com',
    boarding_point: 'Sayedabad Terminal',
    dropping_point: 'Dampara Bus Stand',
    seats: ['C3'],
    total_seats: 1,
    fare_per_seat: 950,
    subtotal: 950,
    service_charge: 0,
    total_amount: 950,
    payment_method: 'card',
    payment_status: 'paid',
    booking_status: 'confirmed',
    created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 mins ago
  },
  {
    id: 'bkg-839',
    booking_reference: 'BBB-2026-839',
    schedule_id: 'sch-01',
    route_id: 'rt-01',
    route_title: 'Dhaka → Chittagong',
    origin: 'Dhaka',
    destination: 'Chittagong',
    bus_name: 'Baba Royal Blue 01',
    bus_type: 'Business Class',
    departure_date: new Date().toISOString().split('T')[0],
    departure_time: '08:00 AM',
    arrival_time: '01:30 PM',
    passenger_name: 'Shahadat Hossain',
    passenger_phone: '+880 1622-441199',
    boarding_point: 'Kanchpur',
    dropping_point: 'GEC Circle',
    seats: ['A1', 'A2'],
    total_seats: 2,
    fare_per_seat: 950,
    subtotal: 1900,
    service_charge: 20,
    total_amount: 1920,
    payment_method: 'counter_cash',
    payment_status: 'paid',
    booking_status: 'confirmed',
    created_at: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
  },
  {
    id: 'bkg-838',
    booking_reference: 'BBB-2026-838',
    schedule_id: 'sch-04',
    route_id: 'rt-04',
    route_title: 'Dhaka → Rajshahi',
    origin: 'Dhaka',
    destination: 'Rajshahi',
    bus_name: 'Baba Sleeper King 04',
    bus_type: 'Sleeper Coach',
    departure_date: new Date().toISOString().split('T')[0],
    departure_time: '02:00 PM',
    arrival_time: '07:45 PM',
    passenger_name: 'Nusrat Jahan',
    passenger_phone: '+880 1515-667788',
    boarding_point: 'Gabtoli Terminal',
    dropping_point: 'Shiroil Bus Terminal',
    seats: ['SL-1'],
    total_seats: 1,
    fare_per_seat: 800,
    subtotal: 800,
    service_charge: 0,
    total_amount: 800,
    payment_method: 'bkash',
    payment_status: 'paid',
    booking_status: 'confirmed',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  }
];

// Initial Passengers
const INITIAL_PASSENGERS: Passenger[] = [
  {
    id: 'psg-01',
    name: 'Md. Rahman',
    phone: '+880 1711-234567',
    email: 'md.rahman@gmail.com',
    address: 'Dhanmondi 27, Dhaka',
    total_trips: 12,
    total_spent: 10850,
    last_journey_date: new Date().toISOString().split('T')[0],
    status: 'active',
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'psg-02',
    name: 'Ayesha Siddika',
    phone: '+880 1819-876543',
    email: 'ayesha.siddika@outlook.com',
    address: 'Uttara Sector 7, Dhaka',
    total_trips: 8,
    total_spent: 9600,
    last_journey_date: new Date().toISOString().split('T')[0],
    status: 'active',
    created_at: '2026-02-10T14:20:00Z',
  },
  {
    id: 'psg-03',
    name: 'Tanvir Khan',
    phone: '+880 1912-349812',
    email: 'tanvir.khan@yahoo.com',
    address: 'Chawkbazar, Chittagong',
    total_trips: 15,
    total_spent: 14250,
    last_journey_date: new Date().toISOString().split('T')[0],
    status: 'active',
    created_at: '2025-11-04T09:15:00Z',
  },
  {
    id: 'psg-04',
    name: 'Shahadat Hossain',
    phone: '+880 1622-441199',
    email: 'shahadat.h@gmail.com',
    address: 'Agrabad, Chittagong',
    total_trips: 6,
    total_spent: 5700,
    last_journey_date: new Date().toISOString().split('T')[0],
    status: 'active',
    created_at: '2026-03-01T16:40:00Z',
  },
  {
    id: 'psg-05',
    name: 'Nusrat Jahan',
    phone: '+880 1515-667788',
    email: 'nusrat.jahan@gmail.com',
    address: 'Padma Residential Area, Rajshahi',
    total_trips: 9,
    total_spent: 7200,
    last_journey_date: new Date().toISOString().split('T')[0],
    status: 'active',
    created_at: '2026-01-20T11:30:00Z',
  }
];

// Initial Expenses
const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-01',
    category: 'fuel',
    amount: 14500,
    date: new Date().toISOString().split('T')[0],
    bus_id: 'bus-01',
    bus_name: 'Baba Royal Blue 01',
    driver_name: 'Rafiqul Islam',
    receipt_no: 'PADMA-OIL-8821',
    description: '130 Liters Octane refueling at Meghna Ghat Filling Station',
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp-02',
    category: 'toll_fee',
    amount: 2400,
    date: new Date().toISOString().split('T')[0],
    bus_id: 'bus-01',
    bus_name: 'Baba Royal Blue 01',
    receipt_no: 'TOLL-MEGHNA-GUMTI',
    description: 'Meghna & Gumti Highway toll pass receipts',
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp-03',
    category: 'maintenance',
    amount: 8500,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    bus_id: 'bus-05',
    bus_name: 'Baba Silver Arrow 05',
    receipt_no: 'SRV-HINO-9932',
    description: 'Front suspension air bellows & brake caliper pad renewal',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'exp-04',
    category: 'driver_salary',
    amount: 28000,
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    driver_name: 'Rafiqul Islam',
    receipt_no: 'SAL-OCT-2026-01',
    description: 'Monthly base salary & long route trip allowance',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'exp-05',
    category: 'refreshment',
    amount: 3200,
    date: new Date().toISOString().split('T')[0],
    bus_id: 'bus-01',
    bus_name: 'Baba Royal Blue 01',
    description: 'Mineral water boxes, passenger tissue packs, hygiene kits',
    created_at: new Date().toISOString(),
  }
];

// Initial Notifications (3 unread as per screenshot)
const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-01',
    title: 'Schedule Delayed',
    message: 'Dhaka → Cox\'s Bazar (11:00 AM) departure delayed by 25 minutes due to highway traffic at Daudkandi.',
    type: 'schedule',
    read: false,
    created_at: '10 mins ago',
  },
  {
    id: 'notif-02',
    title: 'New Bulk Booking',
    message: 'Md. Rahman booked 4 seats (A1, A2, B1, B2) for Dhaka to Sylhet journey.',
    type: 'booking',
    read: false,
    created_at: '25 mins ago',
  },
  {
    id: 'notif-03',
    title: 'Maintenance Reminder',
    message: 'Bus DHAKA METRO-BA 18-9901 scheduled for periodic brake & fluid service.',
    type: 'maintenance',
    read: false,
    created_at: '1 hour ago',
  },
  {
    id: 'notif-04',
    title: 'Payment Received',
    message: '৳ 1,920 received via bKash Merchant API for Booking #BBB-2026-839.',
    type: 'payment',
    read: true,
    created_at: '3 hours ago',
  }
];

// Helper to safely load or initialize storage
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save key ${key} to localStorage:`, err);
  }
}

// Global in-memory & persistent store
class BabaDataStore {
  private buses: Bus[] = [];
  private routes: BusRoute[] = [];
  private drivers: Driver[] = [];
  private schedules: Schedule[] = [];
  private bookings: Booking[] = [];
  private passengers: Passenger[] = [];
  private expenses: Expense[] = [];
  private notifications: SystemNotification[] = [];
  private settings: CompanySettings = DEFAULT_SETTINGS;
  private currentUser: UserProfile = {
    id: 'usr-admin-01',
    name: 'Admin',
    email: 'admin@busbusbaba.com',
    phone: '+880 1711-000001',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  };

  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    this.buses = loadFromStorage(KEYS.BUSES, generateInitialBuses());
    this.routes = loadFromStorage(KEYS.ROUTES, INITIAL_ROUTES);
    this.drivers = loadFromStorage(KEYS.DRIVERS, INITIAL_DRIVERS);
    this.schedules = loadFromStorage(KEYS.SCHEDULES, INITIAL_SCHEDULES);
    this.bookings = loadFromStorage(KEYS.BOOKINGS, INITIAL_BOOKINGS);
    this.passengers = loadFromStorage(KEYS.PASSENGERS, INITIAL_PASSENGERS);
    this.expenses = loadFromStorage(KEYS.EXPENSES, INITIAL_EXPENSES);
    this.notifications = loadFromStorage(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    this.settings = loadFromStorage(KEYS.SETTINGS, DEFAULT_SETTINGS);
    this.currentUser = loadFromStorage(KEYS.USER, this.currentUser);
  }

  // Subscribe to changes
  public subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  // Reset demo data to pristine reference state
  public resetToDefault() {
    this.buses = generateInitialBuses();
    this.routes = INITIAL_ROUTES;
    this.drivers = INITIAL_DRIVERS;
    this.schedules = INITIAL_SCHEDULES;
    this.bookings = INITIAL_BOOKINGS;
    this.passengers = INITIAL_PASSENGERS;
    this.expenses = INITIAL_EXPENSES;
    this.notifications = INITIAL_NOTIFICATIONS;
    this.settings = DEFAULT_SETTINGS;

    saveToStorage(KEYS.BUSES, this.buses);
    saveToStorage(KEYS.ROUTES, this.routes);
    saveToStorage(KEYS.DRIVERS, this.drivers);
    saveToStorage(KEYS.SCHEDULES, this.schedules);
    saveToStorage(KEYS.BOOKINGS, this.bookings);
    saveToStorage(KEYS.PASSENGERS, this.passengers);
    saveToStorage(KEYS.EXPENSES, this.expenses);
    saveToStorage(KEYS.NOTIFICATIONS, this.notifications);
    saveToStorage(KEYS.SETTINGS, this.settings);

    this.notify();
  }

  // Current User & Auth
  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  public setCurrentUser(user: UserProfile) {
    this.currentUser = user;
    saveToStorage(KEYS.USER, user);
    this.notify();
  }

  public setRole(role: UserRole) {
    this.currentUser = {
      ...this.currentUser,
      role,
      name: role === 'super_admin' ? 'Admin' : role === 'booking_agent' ? 'Agent Kabir' : role === 'accountant' ? 'Fatema (Accounts)' : 'Traveler Sohel',
    };
    saveToStorage(KEYS.USER, this.currentUser);
    this.notify();
  }

  // Stats for the Dashboard matching the exact screenshot:
  // Total Buses: 48, Active Routes: 12, Today's Bookings: 842, Total Revenue: ৳ 2,48,750
  public getDashboardStats() {
    const totalBuses = this.buses.length; // 48
    const onTripBuses = this.buses.filter((b) => b.status === 'on_trip').length; // 32
    const availableBuses = this.buses.filter((b) => b.status === 'available').length; // 12
    const maintenanceBuses = this.buses.filter((b) => b.status === 'maintenance').length; // 4

    const activeRoutes = this.routes.filter((r) => r.status === 'active').length; // 12

    // Real bookings in state plus base benchmark for the day
    // Default baseline 837 + real booking items to hit 842 exactly
    const baseBookings = 837;
    const dynamicBookingsCount = baseBookings + this.bookings.length;

    // Default base revenue ৳2,44,830 + dynamic bookings sum = ৳2,48,750
    const dynamicRevenueTotal = 244830 + this.bookings.reduce((sum, b) => sum + (b.payment_status === 'paid' ? b.total_amount : 0), 0);

    return {
      totalBuses,
      onTripBuses,
      availableBuses,
      maintenanceBuses,
      activeRoutes,
      todaysBookings: dynamicBookingsCount,
      totalRevenue: dynamicRevenueTotal,
      busesGrowth: 6,
      routesGrowth: 0,
      bookingsGrowth: 12,
      revenueGrowth: 18,
    };
  }

  // Get Bus Status for Donut Chart
  public getBusStatusBreakdown() {
    const stats = this.getDashboardStats();
    return [
      { name: 'On Trip', value: stats.onTripBuses, color: '#1677FF' },
      { name: 'Available', value: stats.availableBuses, color: '#10B981' },
      { name: 'Maintenance', value: stats.maintenanceBuses, color: '#FF991F' },
    ];
  }

  // Get Booking Overview Curve for Area Chart
  public getBookingTrends(period: '7D' | '30D' | '3M' | '1Y') {
    if (period === '7D') {
      return [
        { label: 'Mon', bookings: 620, revenue: 180000 },
        { label: 'Tue', bookings: 680, revenue: 195000 },
        { label: 'Wed', bookings: 710, revenue: 210000 },
        { label: 'Thu', bookings: 790, revenue: 235000 },
        { label: 'Fri', bookings: 890, revenue: 260000 },
        { label: 'Sat', bookings: 860, revenue: 252000 },
        { label: 'Sun', bookings: 842, revenue: 248750 },
      ];
    }
    if (period === '3M') {
      return [
        { label: 'Aug', bookings: 21400, revenue: 6420000 },
        { label: 'Sep', bookings: 23800, revenue: 7140000 },
        { label: 'Oct', bookings: 25260, revenue: 7462500 },
      ];
    }
    if (period === '1Y') {
      return [
        { label: 'Nov', bookings: 18200 },
        { label: 'Jan', bookings: 20100 },
        { label: 'Mar', bookings: 22400 },
        { label: 'May', bookings: 24900 },
        { label: 'Jul', bookings: 23100 },
        { label: 'Sep', bookings: 26400 },
        { label: 'Oct', bookings: 28500 },
      ];
    }

    // Default 30 Days (Oct 1 to Oct 30) exactly as shown in screenshot
    return [
      { label: 'Oct 1', bookings: 180 },
      { label: 'Oct 4', bookings: 280 },
      { label: 'Oct 8', bookings: 340 },
      { label: 'Oct 11', bookings: 250 },
      { label: 'Oct 15', bookings: 420 },
      { label: 'Oct 18', bookings: 360 },
      { label: 'Oct 22', bookings: 660 },
      { label: 'Oct 25', bookings: 540 },
      { label: 'Oct 28', bookings: 842 }, // Marker in screenshot!
      { label: 'Oct 30', bookings: 790 },
    ];
  }

  // BUS CRUD
  public getBuses(): Bus[] {
    return [...this.buses];
  }

  public getBusById(id: string): Bus | undefined {
    return this.buses.find((b) => b.id === id);
  }

  public addBus(bus: Omit<Bus, 'id'>): Bus {
    const newBus: Bus = {
      ...bus,
      id: `bus-${Date.now()}`,
    };
    this.buses.unshift(newBus);
    saveToStorage(KEYS.BUSES, this.buses);
    this.notify();
    return newBus;
  }

  public updateBus(id: string, updates: Partial<Bus>): Bus {
    const index = this.buses.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Bus not found');
    this.buses[index] = { ...this.buses[index], ...updates };
    saveToStorage(KEYS.BUSES, this.buses);
    this.notify();
    return this.buses[index];
  }

  public deleteBus(id: string): void {
    this.buses = this.buses.filter((b) => b.id !== id);
    saveToStorage(KEYS.BUSES, this.buses);
    this.notify();
  }

  // ROUTES CRUD
  public getRoutes(): BusRoute[] {
    return [...this.routes];
  }

  public getRouteById(id: string): BusRoute | undefined {
    return this.routes.find((r) => r.id === id);
  }

  public addRoute(route: Omit<BusRoute, 'id'>): BusRoute {
    const newRoute: BusRoute = {
      ...route,
      id: `rt-${Date.now()}`,
    };
    this.routes.push(newRoute);
    saveToStorage(KEYS.ROUTES, this.routes);
    this.notify();
    return newRoute;
  }

  public updateRoute(id: string, updates: Partial<BusRoute>): BusRoute {
    const index = this.routes.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Route not found');
    this.routes[index] = { ...this.routes[index], ...updates };
    saveToStorage(KEYS.ROUTES, this.routes);
    this.notify();
    return this.routes[index];
  }

  public deleteRoute(id: string): void {
    this.routes = this.routes.filter((r) => r.id !== id);
    saveToStorage(KEYS.ROUTES, this.routes);
    this.notify();
  }

  // DRIVERS CRUD
  public getDrivers(): Driver[] {
    return [...this.drivers];
  }

  public getDriverById(id: string): Driver | undefined {
    return this.drivers.find((d) => d.id === id);
  }

  public addDriver(driver: Omit<Driver, 'id' | 'total_trips' | 'rating'>): Driver {
    const newDriver: Driver = {
      ...driver,
      id: `drv-${Date.now()}`,
      total_trips: 0,
      rating: 5.0,
    };
    this.drivers.push(newDriver);
    saveToStorage(KEYS.DRIVERS, this.drivers);
    this.notify();
    return newDriver;
  }

  public updateDriver(id: string, updates: Partial<Driver>): Driver {
    const index = this.drivers.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Driver not found');
    this.drivers[index] = { ...this.drivers[index], ...updates };
    saveToStorage(KEYS.DRIVERS, this.drivers);
    this.notify();
    return this.drivers[index];
  }

  public deleteDriver(id: string): void {
    this.drivers = this.drivers.filter((d) => d.id !== id);
    saveToStorage(KEYS.DRIVERS, this.drivers);
    this.notify();
  }

  // SCHEDULES CRUD & CONFLICT CHECKING
  public getSchedules(): Schedule[] {
    return [...this.schedules];
  }

  public getScheduleById(id: string): Schedule | undefined {
    return this.schedules.find((s) => s.id === id);
  }

  public checkScheduleConflict(busId: string, driverId: string, date: string, time: string, excludeScheduleId?: string): { hasConflict: boolean; reason?: string } {
    const conflicting = this.schedules.find((s) => {
      if (excludeScheduleId && s.id === excludeScheduleId) return false;
      if (s.departure_date === date && s.departure_time === time && s.status !== 'cancelled' && s.status !== 'completed') {
        if (s.bus_id === busId) return true;
        if (s.driver_id === driverId) return true;
      }
      return false;
    });

    if (conflicting) {
      if (conflicting.bus_id === busId) {
        return { hasConflict: true, reason: `Bus ${conflicting.bus_name} is already assigned to schedule ${conflicting.schedule_code} at ${time}.` };
      }
      return { hasConflict: true, reason: `Driver is already scheduled for trip ${conflicting.schedule_code} at ${time}.` };
    }

    return { hasConflict: false };
  }

  public addSchedule(sched: Omit<Schedule, 'id' | 'schedule_code'>): Schedule {
    const conflict = this.checkScheduleConflict(sched.bus_id, sched.driver_id, sched.departure_date, sched.departure_time);
    if (conflict.hasConflict) {
      throw new Error(conflict.reason);
    }

    const code = `SCH-${sched.origin.substring(0, 3).toUpperCase()}-${sched.destination.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSchedule: Schedule = {
      ...sched,
      id: `sch-${Date.now()}`,
      schedule_code: code,
    };
    this.schedules.unshift(newSchedule);
    saveToStorage(KEYS.SCHEDULES, this.schedules);
    this.notify();
    return newSchedule;
  }

  public updateSchedule(id: string, updates: Partial<Schedule>): Schedule {
    const index = this.schedules.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Schedule not found');
    this.schedules[index] = { ...this.schedules[index], ...updates };
    saveToStorage(KEYS.SCHEDULES, this.schedules);
    this.notify();
    return this.schedules[index];
  }

  public deleteSchedule(id: string): void {
    this.schedules = this.schedules.filter((s) => s.id !== id);
    saveToStorage(KEYS.SCHEDULES, this.schedules);
    this.notify();
  }

  // SEAT LAYOUT ENGINE & STATUS CHECK
  public getSeatsForSchedule(scheduleId: string): SeatItem[] {
    const schedule = this.getScheduleById(scheduleId);
    if (!schedule) return [];

    const totalSeats = schedule.total_seats || 40;
    const isSleeper = schedule.bus_type === 'Sleeper Coach';
    const isBusiness = schedule.bus_type === 'Business Class';

    // Find all bookings for this schedule
    const scheduleBookings = this.bookings.filter(
      (b) => b.schedule_id === scheduleId && b.booking_status !== 'cancelled'
    );
    const bookedSeatSet = new Set<string>();
    scheduleBookings.forEach((b) => b.seats.forEach((s) => bookedSeatSet.add(s)));

    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = isBusiness ? 3 : 4;
    const seats: SeatItem[] = [];

    let count = 0;
    for (let r = 0; r < rows.length && count < totalSeats; r++) {
      const rowLetter = rows[r];
      for (let c = 1; c <= seatsPerRow && count < totalSeats; c++) {
        const seatId = isSleeper ? `SL-${count + 1}` : `${rowLetter}${c}`;
        const isBooked = bookedSeatSet.has(seatId);

        // Pre-reserve 1 seat as VIP on some buses
        const isReserved = !isBooked && seatId === 'A1' && scheduleId === 'sch-01';

        seats.push({
          id: seatId,
          label: seatId,
          row: rowLetter,
          col: c,
          status: isBooked ? 'booked' : isReserved ? 'reserved' : 'available',
          type: isSleeper ? 'sleeper' : isBusiness ? 'business' : 'standard',
          price: schedule.price,
          reservedFor: isReserved ? 'VIP / Counter' : undefined,
        });
        count++;
      }
    }

    return seats;
  }

  // SAFE TRANSACTIONAL BOOKING
  public createBooking(bookingData: {
    schedule_id: string;
    passenger_name: string;
    passenger_phone: string;
    passenger_email?: string;
    boarding_point: string;
    dropping_point: string;
    seats: string[];
    payment_method: 'bkash' | 'nagad' | 'rocket' | 'card' | 'counter_cash';
  }): Booking {
    const schedule = this.getScheduleById(bookingData.schedule_id);
    if (!schedule) throw new Error('Schedule not found');

    if (bookingData.seats.length === 0) {
      throw new Error('Please select at least one seat');
    }

    // Concurrency Check: Make sure none of the selected seats are booked
    const currentSeats = this.getSeatsForSchedule(bookingData.schedule_id);
    const alreadyBooked = bookingData.seats.filter((seatId) => {
      const seat = currentSeats.find((s) => s.id === seatId);
      return seat && seat.status !== 'available';
    });

    if (alreadyBooked.length > 0) {
      throw new Error(`Seats [${alreadyBooked.join(', ')}] are no longer available. Please select different seats.`);
    }

    const subtotal = bookingData.seats.length * schedule.price;
    const serviceCharge = 20; // Nominal BDT 20 platform charge
    const totalAmount = subtotal + serviceCharge;
    const bookingRef = `BBB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: `bkg-${Date.now()}`,
      booking_reference: bookingRef,
      schedule_id: schedule.id,
      route_id: schedule.route_id,
      route_title: `${schedule.origin} → ${schedule.destination}`,
      origin: schedule.origin,
      destination: schedule.destination,
      bus_name: schedule.bus_name,
      bus_type: schedule.bus_type,
      departure_date: schedule.departure_date,
      departure_time: schedule.departure_time,
      arrival_time: schedule.arrival_time,
      passenger_name: bookingData.passenger_name,
      passenger_phone: bookingData.passenger_phone,
      passenger_email: bookingData.passenger_email,
      boarding_point: bookingData.boarding_point,
      dropping_point: bookingData.dropping_point,
      seats: bookingData.seats,
      total_seats: bookingData.seats.length,
      fare_per_seat: schedule.price,
      subtotal,
      service_charge: serviceCharge,
      total_amount: totalAmount,
      payment_method: bookingData.payment_method,
      payment_status: 'paid',
      booking_status: 'confirmed',
      created_at: new Date().toISOString(),
    };

    // Update schedule available seats
    this.updateSchedule(schedule.id, {
      available_seats: Math.max(0, schedule.available_seats - bookingData.seats.length),
    });

    // Save booking
    this.bookings.unshift(newBooking);
    saveToStorage(KEYS.BOOKINGS, this.bookings);

    // Register / update passenger record
    const existingPsg = this.passengers.find((p) => p.phone === bookingData.passenger_phone);
    if (existingPsg) {
      existingPsg.total_trips += 1;
      existingPsg.total_spent += totalAmount;
      existingPsg.last_journey_date = schedule.departure_date;
    } else {
      this.passengers.push({
        id: `psg-${Date.now()}`,
        name: bookingData.passenger_name,
        phone: bookingData.passenger_phone,
        email: bookingData.passenger_email || '',
        total_trips: 1,
        total_spent: totalAmount,
        last_journey_date: schedule.departure_date,
        status: 'active',
        created_at: new Date().toISOString(),
      });
    }
    saveToStorage(KEYS.PASSENGERS, this.passengers);

    // Add notification
    this.addNotification({
      title: 'New Confirmed Booking',
      message: `${bookingData.passenger_name} booked ${bookingData.seats.length} seat(s) on ${schedule.origin} → ${schedule.destination} (${bookingRef}).`,
      type: 'booking',
    });

    this.notify();
    return newBooking;
  }

  // CANCEL BOOKING
  public cancelBooking(bookingId: string, reason?: string): Booking {
    const index = this.bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error('Booking not found');

    const booking = this.bookings[index];
    if (booking.booking_status === 'cancelled') {
      throw new Error('Booking is already cancelled');
    }

    const updatedBooking: Booking = {
      ...booking,
      booking_status: 'cancelled',
      payment_status: 'refunded',
      notes: reason ? `Cancelled: ${reason}` : 'Cancelled by customer/operator',
    };
    this.bookings[index] = updatedBooking;
    saveToStorage(KEYS.BOOKINGS, this.bookings);

    // Release seats back to schedule
    const schedule = this.getScheduleById(booking.schedule_id);
    if (schedule) {
      this.updateSchedule(schedule.id, {
        available_seats: Math.min(schedule.total_seats, schedule.available_seats + booking.seats.length),
      });
    }

    this.addNotification({
      title: 'Booking Cancelled',
      message: `Booking #${booking.booking_reference} for ${booking.passenger_name} has been cancelled.`,
      type: 'booking',
    });

    this.notify();
    return updatedBooking;
  }

  // BOOKINGS READ
  public getBookings(): Booking[] {
    return [...this.bookings];
  }

  public getBookingByReference(ref: string): Booking | undefined {
    return this.bookings.find((b) => b.booking_reference.toLowerCase() === ref.trim().toLowerCase());
  }

  public getBookingsByPhone(phone: string): Booking[] {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return this.bookings.filter((b) => b.passenger_phone.replace(/[^0-9]/g, '').includes(cleanPhone));
  }

  // PASSENGERS
  public getPassengers(): Passenger[] {
    return [...this.passengers];
  }

  public addPassenger(psg: Omit<Passenger, 'id' | 'total_trips' | 'total_spent' | 'created_at'>): Passenger {
    const newPsg: Passenger = {
      ...psg,
      id: `psg-${Date.now()}`,
      total_trips: 0,
      total_spent: 0,
      created_at: new Date().toISOString(),
    };
    this.passengers.unshift(newPsg);
    saveToStorage(KEYS.PASSENGERS, this.passengers);
    this.notify();
    return newPsg;
  }

  // EXPENSES CRUD
  public getExpenses(): Expense[] {
    return [...this.expenses];
  }

  public addExpense(exp: Omit<Expense, 'id' | 'created_at'>): Expense {
    const newExp: Expense = {
      ...exp,
      id: `exp-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.expenses.unshift(newExp);
    saveToStorage(KEYS.EXPENSES, this.expenses);
    this.notify();
    return newExp;
  }

  public deleteExpense(id: string): void {
    this.expenses = this.expenses.filter((e) => e.id !== id);
    saveToStorage(KEYS.EXPENSES, this.expenses);
    this.notify();
  }

  // NOTIFICATIONS
  public getNotifications(): SystemNotification[] {
    return [...this.notifications];
  }

  public getUnreadNotificationCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  public markNotificationAsRead(id: string): void {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      saveToStorage(KEYS.NOTIFICATIONS, this.notifications);
      this.notify();
    }
  }

  public markAllNotificationsAsRead(): void {
    this.notifications.forEach((n) => (n.read = true));
    saveToStorage(KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  public addNotification(n: Omit<SystemNotification, 'id' | 'created_at' | 'read'>): void {
    const newNotif: SystemNotification = {
      ...n,
      id: `notif-${Date.now()}`,
      read: false,
      created_at: 'Just now',
    };
    this.notifications.unshift(newNotif);
    saveToStorage(KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  // SETTINGS
  public getSettings(): CompanySettings {
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<CompanySettings>): CompanySettings {
    this.settings = { ...this.settings, ...updates };
    saveToStorage(KEYS.SETTINGS, this.settings);
    this.notify();
    return this.settings;
  }
}

// Export singleton instance
export const babaStore = new BabaDataStore();
