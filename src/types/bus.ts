export type UserRole = 
  | 'super_admin' 
  | 'company_admin' 
  | 'manager' 
  | 'booking_agent' 
  | 'accountant' 
  | 'driver' 
  | 'passenger';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  organization_id?: string;
}

export type BusType = 'AC Coach' | 'Non-AC Coach' | 'Business Class' | 'Sleeper Coach' | 'Economy';
export type BusStatus = 'available' | 'on_trip' | 'maintenance' | 'inactive';
export type LayoutType = '2x2' | '2x1' | 'sleeper_2x1';

export interface Bus {
  id: string;
  reg_no: string; // e.g. "DHAKA METRO-BA 14-8890"
  bus_name: string;
  operator: string;
  bus_type: BusType;
  seat_capacity: number;
  layout_type: LayoutType;
  manufacturer: string;
  model: string;
  year: number;
  status: BusStatus;
  assigned_driver_id?: string;
  assigned_driver_name?: string;
  image_url: string;
  amenities: string[];
}

export interface RouteStop {
  stop_name: string;
  estimated_time_from_start: string;
  distance_km: number;
}

export interface BusRoute {
  id: string;
  route_code: string;
  origin: string;
  destination: string;
  distance_km: number;
  estimated_duration: string;
  stops: string[];
  base_price: number;
  status: 'active' | 'inactive';
  bus_count?: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  license_number: string;
  license_expiry: string;
  address: string;
  employment_status: 'active' | 'on_duty' | 'leave' | 'suspended';
  assigned_bus_id?: string;
  assigned_bus_reg?: string;
  total_trips: number;
  rating: number;
  avatar?: string;
}

export type ScheduleStatus = 'scheduled' | 'boarding' | 'departed' | 'completed' | 'delayed' | 'cancelled';

export interface Schedule {
  id: string;
  schedule_code: string;
  bus_id: string;
  bus_name: string;
  reg_no: string;
  bus_type: BusType;
  driver_id: string;
  driver_name: string;
  route_id: string;
  origin: string;
  destination: string;
  departure_date: string;
  departure_time: string;
  arrival_time: string;
  estimated_duration: string;
  price: number;
  available_seats: number;
  total_seats: number;
  status: ScheduleStatus;
  boarding_points: string[];
  dropping_points: string[];
}

export type SeatStatus = 'available' | 'booked' | 'selected' | 'reserved';

export interface SeatItem {
  id: string; // "A1", "A2", etc.
  label: string;
  row: string;
  col: number;
  status: SeatStatus;
  type: 'standard' | 'business' | 'sleeper';
  price: number;
  reservedFor?: string;
}

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'card' | 'counter_cash';

export interface Booking {
  id: string;
  booking_reference: string; // e.g. "BBB-2026-842"
  schedule_id: string;
  route_id: string;
  route_title: string;
  origin: string;
  destination: string;
  bus_name: string;
  bus_type: BusType;
  departure_date: string;
  departure_time: string;
  arrival_time: string;
  passenger_id?: string;
  passenger_name: string;
  passenger_phone: string;
  passenger_email?: string;
  boarding_point: string;
  dropping_point: string;
  seats: string[];
  total_seats: number;
  fare_per_seat: number;
  subtotal: number;
  service_charge: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  booking_status: BookingStatus;
  created_at: string;
  notes?: string;
}

export interface Passenger {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  total_trips: number;
  total_spent: number;
  last_journey_date: string;
  status: 'active' | 'blocked';
  created_at: string;
}

export type ExpenseCategory = 
  | 'fuel' 
  | 'maintenance' 
  | 'driver_salary' 
  | 'toll_fee' 
  | 'police_permit' 
  | 'refreshment' 
  | 'terminal_fee' 
  | 'other';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  bus_id?: string;
  bus_name?: string;
  driver_id?: string;
  driver_name?: string;
  receipt_no?: string;
  description: string;
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  transaction_id: string;
  booking_reference: string;
  passenger_name: string;
  passenger_phone: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  created_at: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'schedule' | 'maintenance' | 'system' | 'driver' | 'payment';
  read: boolean;
  created_at: string;
}

export interface CompanySettings {
  id: string;
  name: string;
  tagline: string;
  hotline: string;
  support_email: string;
  address: string;
  currency: string;
  currency_symbol: string;
  timezone: string;
  cancellation_fee_percentage: number;
  counter_booking_enabled: boolean;
  online_booking_enabled: boolean;
}
