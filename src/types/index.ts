export type UserRole = 'student' | 'admin' | 'instructor';
export type AccountStatus = 'active' | 'suspended' | 'deactivated';

export interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  avatar_url?: string;
  role: UserRole;
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface CourseVariant {
  id: string;
  course_id: string;
  name: string;
  description?: string;
  sku?: string;
  regular_price: number;
  sale_price: number;
  enrollment_limit?: number | null;
  duration_days: number;
  image_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  category_id?: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  thumbnail_url: string;
  instructor_name: string;
  duration: string;
  level: string;
  language: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
  category?: Category;
  variants?: CourseVariant[];
  average_rating?: number;
  review_count?: number;
}

export interface CartItem {
  id: string;
  course_id: string;
  variant_id: string;
  course: Course;
  variant: CourseVariant;
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'rocket';
export type PaymentStatus = 'unpaid' | 'awaiting_verification' | 'paid' | 'rejected' | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  course_id: string;
  variant_id: string;
  course_title_snapshot: string;
  variation_name_snapshot: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  billing_address?: string;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  order_status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  payments?: PaymentRecord[];
}

export interface PaymentRecord {
  id: string;
  order_id: string;
  provider: PaymentMethod;
  amount: number;
  sender_phone: string;
  transaction_id: string;
  payment_status: PaymentStatus;
  verified_by?: string;
  verified_at?: string;
  verification_notes?: string;
  created_at: string;
}

export type EnrollmentStatus = 'active' | 'pending' | 'suspended' | 'expired' | 'revoked';

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  variant_id: string;
  order_id?: string;
  enrollment_status: EnrollmentStatus;
  access_start: string;
  access_expiry?: string;
  created_at: string;
  course?: Course;
  variant?: CourseVariant;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  supporting_text?: string;
  slogan?: string;
  image_url: string;
  button_text: string;
  target_url: string;
  sort_order: number;
  is_active: boolean;
}

export interface PaymentSetting {
  id: string;
  provider: PaymentMethod;
  display_name: string;
  payment_number: string;
  account_type: 'Personal' | 'Merchant' | 'Agent';
  instructions: string;
  is_enabled: boolean;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  sort_order: number;
  is_active: boolean;
}

export interface SiteSettings {
  site_name: string;
  brand_compact: string;
  instructor_name: string;
  tagline: string;
  secondary_tagline: string;
  cta_hero: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  currency: string;
  currency_symbol: string;
  default_seo_title: string;
  default_seo_desc: string;
}

export interface CourseReview {
  id: string;
  student_id: string;
  course_id: string;
  rating: number;
  review_text: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  student_name?: string;
}

export interface AdminStats {
  total_enrollments: number;
  total_sales: number;
  active_students: number;
  total_courses: number;
  enrollments_growth: number;
  sales_growth: number;
  students_growth: number;
  courses_growth: number;
}

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}
