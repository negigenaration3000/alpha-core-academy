import { 
  Course, CourseVariant, Category, Banner, PaymentSetting, 
  SocialLink, SiteSettings, Order, Enrollment, AdminStats, 
  SalesDataPoint, UserProfile, PaymentStatus, OrderStatus 
} from '../types';
import { 
  INITIAL_CATEGORIES, INITIAL_COURSES, INITIAL_VARIANTS, 
  INITIAL_BANNER, INITIAL_PAYMENT_SETTINGS, INITIAL_SOCIAL_LINKS, 
  INITIAL_SITE_SETTINGS, INITIAL_ORDERS, INITIAL_ENROLLMENTS, 
  INITIAL_ADMIN_STATS, INITIAL_SALES_CHART 
} from './mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

class StoreService {
  private categories: Category[];
  private courses: Course[];
  private variants: CourseVariant[];
  private banner: Banner;
  private paymentSettings: PaymentSetting[];
  private socialLinks: SocialLink[];
  private siteSettings: SiteSettings;
  private orders: Order[];
  private enrollments: Enrollment[];
  private adminStats: AdminStats;
  private salesChart: SalesDataPoint[];
  private currentUser: UserProfile | null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Load from localStorage if present to maintain state across reloads in demo/fallback mode
    this.categories = this.loadStorage('aca_categories', INITIAL_CATEGORIES);
    this.courses = this.loadStorage('aca_courses', INITIAL_COURSES);
    this.variants = this.loadStorage('aca_variants', INITIAL_VARIANTS);
    this.banner = this.loadStorage('aca_banner', INITIAL_BANNER);
    this.paymentSettings = this.loadStorage('aca_payment_settings', INITIAL_PAYMENT_SETTINGS);
    this.socialLinks = this.loadStorage('aca_social_links', INITIAL_SOCIAL_LINKS);
    this.siteSettings = this.loadStorage('aca_site_settings', INITIAL_SITE_SETTINGS);
    this.orders = this.loadStorage('aca_orders', INITIAL_ORDERS);
    this.enrollments = this.loadStorage('aca_enrollments', INITIAL_ENROLLMENTS);
    this.adminStats = this.loadStorage('aca_admin_stats', INITIAL_ADMIN_STATS);
    this.salesChart = this.loadStorage('aca_sales_chart', INITIAL_SALES_CHART);

    // Initial demo user: Admin Sohel Shahriar
    const defaultUser: UserProfile = {
      id: 'usr-admin-01',
      full_name: 'Sohel Shahriar',
      phone: '01844221100',
      avatar_url: '/images/instructor_hero.png',
      role: 'admin',
      account_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.currentUser = this.loadStorage('aca_current_user', defaultUser);

    if (isSupabaseConfigured) {
      this.syncFromSupabase();
    }
  }

  private loadStorage<T>(key: string, fallback: T): T {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return fallback;
  }

  private saveStorage(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.notify();
    } catch {
      // Ignore
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  private async syncFromSupabase() {
    if (!supabase) return;
    try {
      const [catRes, courseRes, varRes, payRes, bannerRes, socialRes, orderRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('courses').select('*, category:categories(*)').order('created_at', { ascending: false }),
        supabase.from('course_variants').select('*'),
        supabase.from('payment_settings').select('*'),
        supabase.from('banners').select('*').limit(1).single(),
        supabase.from('social_links').select('*').order('sort_order', { ascending: true }),
        supabase.from('orders').select('*, items:order_items(*), payments(*)').order('created_at', { ascending: false }),
      ]);

      if (catRes.data && catRes.data.length > 0) this.categories = catRes.data;
      if (courseRes.data && courseRes.data.length > 0) this.courses = courseRes.data;
      if (varRes.data && varRes.data.length > 0) this.variants = varRes.data;
      if (payRes.data && payRes.data.length > 0) this.paymentSettings = payRes.data;
      if (bannerRes.data) this.banner = bannerRes.data;
      if (socialRes.data && socialRes.data.length > 0) this.socialLinks = socialRes.data;
      if (orderRes.data && orderRes.data.length > 0) this.orders = orderRes.data;

      this.notify();
    } catch (e) {
      console.warn('Supabase sync notice:', e);
    }
  }

  // --- Auth & User ---
  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public setCurrentUser(user: UserProfile | null) {
    this.currentUser = user;
    this.saveStorage('aca_current_user', user);
  }

  public switchRole(role: 'admin' | 'student') {
    if (!this.currentUser) return;
    this.currentUser = {
      ...this.currentUser,
      role,
      full_name: role === 'admin' ? 'Sohel Shahriar' : 'Student Spartan',
    };
    this.saveStorage('aca_current_user', this.currentUser);
  }

  // --- Courses & Variants ---
  public getCourses(): Course[] {
    return this.courses.map((course) => {
      const category = this.categories.find((c) => c.id === course.category_id);
      const variants = this.variants.filter((v) => v.course_id === course.id);
      return { ...course, category, variants };
    });
  }

  public getCourseBySlug(slug: string): Course | undefined {
    return this.getCourses().find((c) => c.slug === slug);
  }

  public getCourseById(id: string): Course | undefined {
    return this.getCourses().find((c) => c.id === id);
  }

  public addCourse(course: Omit<Course, 'id'>, initialVariants?: Partial<CourseVariant>[]): Course {
    const id = `course-${Date.now()}`;
    const newCourse: Course = { ...course, id };
    this.courses = [newCourse, ...this.courses];
    this.saveStorage('aca_courses', this.courses);

    if (initialVariants && initialVariants.length > 0) {
      initialVariants.forEach((v) => {
        this.addVariant({
          course_id: id,
          name: v.name || 'Standard Variation',
          regular_price: v.regular_price || 999,
          sale_price: v.sale_price || 750,
          duration_days: v.duration_days || 365,
          is_active: true,
          ...v,
        });
      });
    }

    if (isSupabaseConfigured && supabase) {
      supabase.from('courses').insert([{ ...course, id }]).then();
    }

    return newCourse;
  }

  public updateCourse(id: string, updates: Partial<Course>): Course | undefined {
    this.courses = this.courses.map((c) => (c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c));
    this.saveStorage('aca_courses', this.courses);

    if (isSupabaseConfigured && supabase) {
      supabase.from('courses').update(updates).eq('id', id).then();
    }

    return this.getCourseById(id);
  }

  public deleteCourse(id: string) {
    this.courses = this.courses.filter((c) => c.id !== id);
    this.variants = this.variants.filter((v) => v.course_id !== id);
    this.saveStorage('aca_courses', this.courses);
    this.saveStorage('aca_variants', this.variants);

    if (isSupabaseConfigured && supabase) {
      supabase.from('courses').delete().eq('id', id).then();
    }
  }

  // --- Variants ---
  public getVariants(courseId?: string): CourseVariant[] {
    if (courseId) return this.variants.filter((v) => v.course_id === courseId);
    return this.variants;
  }

  public addVariant(variant: Omit<CourseVariant, 'id'>): CourseVariant {
    const newVariant: CourseVariant = { ...variant, id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` };
    this.variants = [...this.variants, newVariant];
    this.saveStorage('aca_variants', this.variants);

    if (isSupabaseConfigured && supabase) {
      supabase.from('course_variants').insert([newVariant]).then();
    }

    return newVariant;
  }

  public updateVariant(id: string, updates: Partial<CourseVariant>): CourseVariant | undefined {
    this.variants = this.variants.map((v) => (v.id === id ? { ...v, ...updates, updated_at: new Date().toISOString() } : v));
    this.saveStorage('aca_variants', this.variants);

    if (isSupabaseConfigured && supabase) {
      supabase.from('course_variants').update(updates).eq('id', id).then();
    }

    return this.variants.find((v) => v.id === id);
  }

  public deleteVariant(id: string) {
    this.variants = this.variants.filter((v) => v.id !== id);
    this.saveStorage('aca_variants', this.variants);

    if (isSupabaseConfigured && supabase) {
      supabase.from('course_variants').delete().eq('id', id).then();
    }
  }

  // --- Categories ---
  public getCategories(): Category[] {
    return this.categories;
  }

  public addCategory(cat: Omit<Category, 'id'>): Category {
    const newCat: Category = { ...cat, id: `cat-${Date.now()}` };
    this.categories = [...this.categories, newCat];
    this.saveStorage('aca_categories', this.categories);
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | undefined {
    this.categories = this.categories.map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.saveStorage('aca_categories', this.categories);
    return this.categories.find((c) => c.id === id);
  }

  public deleteCategory(id: string) {
    this.categories = this.categories.filter((c) => c.id !== id);
    this.saveStorage('aca_categories', this.categories);
  }

  // --- Orders & Manual Payment Verification ---
  public getOrders(): Order[] {
    return this.orders;
  }

  public getOrderById(idOrNumber: string): Order | undefined {
    return this.orders.find((o) => o.id === idOrNumber || o.order_number === idOrNumber);
  }

  public createOrder(orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>): Order {
    const timestamp = Date.now();
    const orderNumber = `ACA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${timestamp}`,
      order_number: orderNumber,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.orders = [newOrder, ...this.orders];
    this.saveStorage('aca_orders', this.orders);

    if (isSupabaseConfigured && supabase) {
      supabase.from('orders').insert([newOrder]).then();
    }

    return newOrder;
  }

  public verifyPayment(orderId: string, action: 'verify' | 'reject', notes: string = ''): boolean {
    const orderIndex = this.orders.findIndex((o) => o.id === orderId || o.order_number === orderId);
    if (orderIndex === -1) return false;

    const order = this.orders[orderIndex];
    const newPaymentStatus: PaymentStatus = action === 'verify' ? 'paid' : 'rejected';
    const newOrderStatus: OrderStatus = action === 'verify' ? 'confirmed' : 'cancelled';

    const updatedOrder: Order = {
      ...order,
      payment_status: newPaymentStatus,
      order_status: newOrderStatus,
      updated_at: new Date().toISOString(),
      payments: (order.payments || []).map((p) => ({
        ...p,
        payment_status: newPaymentStatus,
        verified_by: this.currentUser?.id,
        verified_at: new Date().toISOString(),
        verification_notes: notes,
      })),
    };

    this.orders[orderIndex] = updatedOrder;
    this.saveStorage('aca_orders', this.orders);

    // If verified, automatically generate course enrollments for the student!
    if (action === 'verify' && order.user_id) {
      (order.items || []).forEach((item) => {
        const existingEnrollment = this.enrollments.find(
          (e) => e.student_id === order.user_id && e.course_id === item.course_id && e.variant_id === item.variant_id
        );

        if (!existingEnrollment) {
          const newEnrollment: Enrollment = {
            id: `enr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            student_id: order.user_id!,
            course_id: item.course_id,
            variant_id: item.variant_id,
            order_id: order.id,
            enrollment_status: 'active',
            access_start: new Date().toISOString(),
            created_at: new Date().toISOString(),
          };
          this.enrollments = [newEnrollment, ...this.enrollments];
          this.saveStorage('aca_enrollments', this.enrollments);
        }
      });
    }

    if (isSupabaseConfigured && supabase) {
      supabase.rpc('verify_order_payment', {
        p_order_id: order.id,
        p_admin_id: this.currentUser?.id,
        p_action: action,
        p_notes: notes,
      }).then();
    }

    return true;
  }

  // --- Enrollments ---
  public getEnrollments(studentId?: string): Enrollment[] {
    const list = studentId ? this.enrollments.filter((e) => e.student_id === studentId) : this.enrollments;
    return list.map((enr) => ({
      ...enr,
      course: this.getCourseById(enr.course_id),
      variant: this.variants.find((v) => v.id === enr.variant_id),
    }));
  }

  // --- Settings ---
  public getPaymentSettings(): PaymentSetting[] {
    return this.paymentSettings;
  }

  public updatePaymentSetting(provider: string, updates: Partial<PaymentSetting>): PaymentSetting | undefined {
    this.paymentSettings = this.paymentSettings.map((p) =>
      p.provider === provider ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
    );
    this.saveStorage('aca_payment_settings', this.paymentSettings);

    if (isSupabaseConfigured && supabase) {
      supabase.from('payment_settings').update(updates).eq('provider', provider).then();
    }

    return this.paymentSettings.find((p) => p.provider === provider);
  }

  public getSocialLinks(): SocialLink[] {
    return this.socialLinks;
  }

  public updateSocialLink(platform: string, url: string) {
    this.socialLinks = this.socialLinks.map((s) => (s.platform === platform ? { ...s, url } : s));
    this.saveStorage('aca_social_links', this.socialLinks);

    if (isSupabaseConfigured && supabase) {
      supabase.from('social_links').update({ url }).eq('platform', platform).then();
    }
  }

  public getSiteSettings(): SiteSettings {
    return this.siteSettings;
  }

  public updateSiteSettings(updates: Partial<SiteSettings>) {
    this.siteSettings = { ...this.siteSettings, ...updates };
    this.saveStorage('aca_site_settings', this.siteSettings);
  }

  public getBanner(): Banner {
    return this.banner;
  }

  public updateBanner(updates: Partial<Banner>) {
    this.banner = { ...this.banner, ...updates };
    this.saveStorage('aca_banner', this.banner);
  }

  public getAdminStats(): AdminStats {
    const verifiedOrders = this.orders.filter((o) => o.payment_status === 'paid');
    const totalSales = verifiedOrders.reduce((sum, o) => sum + o.total, 0);
    const activeEnrollments = this.enrollments.filter((e) => e.enrollment_status === 'active').length;

    return {
      total_enrollments: activeEnrollments || this.adminStats.total_enrollments,
      total_sales: totalSales > 0 ? totalSales : this.adminStats.total_sales,
      active_students: activeEnrollments > 0 ? activeEnrollments : this.adminStats.active_students,
      total_courses: this.courses.length || this.adminStats.total_courses,
      enrollments_growth: this.adminStats.enrollments_growth,
      sales_growth: this.adminStats.sales_growth,
      students_growth: this.adminStats.students_growth,
      courses_growth: this.adminStats.courses_growth,
    };
  }

  public getSalesChart(): SalesDataPoint[] {
    return this.salesChart;
  }
}

export const store = new StoreService();
