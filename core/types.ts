export interface Reservation {
  id: number;
  guest_name: string;
  room_id?: string; // UUID reference to rooms.id
  room_number?: number; // Display room number (for UI)
  check_in?: string;
  check_out?: string;
  status: 'booked' | 'checked_in' | 'checked_out' | 'cancelled';
  created_at: string;
  room_type?: string; // Optional preference
  nationality?: string; // Guest nationality for foreign police reporting
  passport_number?: string; // Passport/ID number for foreign police reporting
}

export interface HousekeepingTask {
  id: number;
  room_number: number;
  assigned_to: string;
  status: 'pending' | 'in_progress' | 'done';
  updated_at: string;
}

export interface CheckIn {
  id: number;
  guest_name: string;
  address: string;
  phone: string;
  email: string;
  is_company: boolean;
  company_name?: string;
  company_tax_id?: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
  room_number: number;
  check_in_date: string;
  check_out_date: string;
  status: 'active' | 'completed';
  notes?: string;
  additional_guests?: string[];
}

// Billing and Financial Types
export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  tax_rate?: number;
  tax_amount?: number;
  category: 'accommodation' | 'food_beverage' | 'services' | 'other';
  date: string;
  reference?: string; // Room number, service ID, etc.
}

export interface Payment {
  id: string;
  invoice_id: number;
  amount: number;
  payment_method: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'check' | 'digital_wallet' | 'other';
  payment_date: string;
  reference_number?: string;
  notes?: string;
  processed_by?: string;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number; // Percentage (e.g., 8.25 for 8.25%)
  is_active: boolean;
  applies_to: ('accommodation' | 'food_beverage' | 'services' | 'other')[];
}

export interface GuestAccount {
  id: string;
  guest_id?: string; // Link to guest if available
  guest_name: string;
  email?: string;
  phone?: string;
  address?: string;
  credit_limit?: number;
  current_balance: number;
  total_charged: number;
  total_paid: number;
  last_activity: string;
  status: 'active' | 'inactive' | 'suspended';
  notes?: string; // Additional notes for account operations
}

export interface Folio {
  id: string;
  guest_account_id: string;
  invoice_id?: number;
  folio_number: string;
  type: 'guest' | 'master' | 'split';
  status: 'open' | 'closed' | 'transferred';
  created_date: string;
  closed_date?: string;
  total_charges: number;
  total_payments: number;
  balance: number;
  window_number?: number; // For split folios
  parent_folio_id?: string; // For split folios
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description?: string;
  line_items: Omit<InvoiceLineItem, 'id' | 'date'>[];
  is_active: boolean;
  created_by?: string;
  created_at: string;
}

export interface BillingOperation {
  id: string;
  operation_type: 'edit_invoice' | 'add_line_item' | 'remove_line_item' | 'split_account' | 'transfer_payment' | 'merge_folios' | 'void_invoice' | 'separate_bill';
  invoice_id?: number;
  folio_id?: string;
  guest_account_id?: string;
  description: string;
  changes: Record<string, unknown>; // Operation-specific change data
  performed_by: string;
  performed_at: string;
  approved_by?: string;
  approved_at?: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
}

export interface SplitAccount {
  id: string;
  original_invoice_id: number;
  split_reason: string;
  created_at: string;
  created_by: string;
  splits: {
    guest_account_id: string;
    percentage: number;
    fixed_amount?: number;
    line_items: InvoiceLineItem[];
    folio_id: string;
  }[];
}

export interface Invoice {
  id: number;
  folio_id?: string;
  guest_account_id: string;
  invoice_number: string;
  guest_name: string;
  guest_email?: string;
  guest_phone?: string;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'unpaid' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  currency: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  balance: number;
  line_items: InvoiceLineItem[];
  payments: Payment[];
  notes?: string;
  terms?: string;
  created_by?: string;
  updated_at: string;
}

export interface BillingReport {
  id: string;
  report_type: 'daily_revenue' | 'monthly_revenue' | 'outstanding_balances' | 'payment_methods' | 'tax_summary' | 'guest_ledger';
  date_range: {
    start: string;
    end: string;
  };
  generated_at: string;
  data: Record<string, unknown>; // Report-specific data structure
  total_revenue?: number;
  total_payments?: number;
  outstanding_balance?: number;
}

export interface Company {
  id: string;
  name: string;
  tax_id: string;
  address: string;
  phone: string;
  email: string;
  contact_person?: string;
}

// Packages Types
export interface PackageComponent {
  id: string;
  type: 'accommodation' | 'meal' | 'service' | 'amenity' | 'transport' | 'activity' | 'other';
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  is_mandatory: boolean;
  category?: string; // e.g., 'breakfast', 'dinner', 'spa', etc.
  reference_id?: string; // ID of the actual room, service, etc.
}

export interface PackagePricingRule {
  id: string;
  name: string;
  type: 'base' | 'seasonal' | 'occupancy' | 'early_bird' | 'last_minute' | 'loyalty';
  conditions: {
    date_from?: string;
    date_to?: string;
    min_stay?: number;
    max_stay?: number;
    occupancy_rate?: number;
    booking_window_days?: number;
  };
  adjustment_type: 'fixed' | 'percentage' | 'multiplier';
  adjustment_value: number;
  is_active: boolean;
  priority: number; // Higher priority rules override lower ones
}

export interface PackageAvailability {
  id: string;
  package_id: string;
  date_from: string;
  date_to: string;
  is_available: boolean;
  max_bookings?: number;
  current_bookings: number;
  blackout_dates: string[]; // Specific dates when package is not available
  minimum_stay: number;
  maximum_stay?: number;
}

export interface StayPackage {
  id: string;
  code: string; // Unique package code like 'ROMANCE2024', 'FAMILYFUN'
  name: string;
  description: string;
  short_description?: string;
  category: 'romantic' | 'family' | 'business' | 'wellness' | 'adventure' | 'luxury' | 'budget' | 'seasonal' | 'other';
  status: 'draft' | 'active' | 'inactive' | 'archived';

  // Package details
  base_price: number;
  currency: string;
  minimum_stay: number;
  maximum_stay?: number;
  max_guests: number;

  // Components
  components: PackageComponent[];

  // Pricing and availability
  pricing_rules: PackagePricingRule[];
  availability_rules: PackageAvailability[];

  // Marketing and display
  images: string[];
  highlights: string[]; // Key selling points
  terms_conditions?: string;
  cancellation_policy?: string;

  // Metadata
  created_at: string;
  updated_at: string;
  created_by?: string;
  valid_from: string;
  valid_to?: string;

  // Statistics
  total_bookings: number;
  total_revenue: number;
  average_rating?: number;
  review_count: number;
}

export interface PackageBooking {
  id: string;
  package_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  check_in_date: string;
  check_out_date: string;
  guests_count: number;
  total_price: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  special_requests?: string;
  booking_reference: string;
  created_at: string;
  payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded';
}

export interface Amenity {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface MaintenanceNote {
  id: string;
  date: string;
  note: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  reported_by?: string;
}

export interface Room {
  id: number;
  room_number: number;
  type: string;
  status: 'available' | 'occupied' | 'maintenance' | 'dirty' | 'cleaning';
  price: number;
  description?: string;
  capacity: number;
  size?: number; // in square meters/feet
  floor?: number;
  amenities: Amenity[];
  maintenance_notes: MaintenanceNote[];
  images?: string[];
  last_cleaned?: string;
  next_maintenance?: string;
}

export interface ReportData {
  totalRevenue: number;
  totalOccupancy: number;
  totalGuests: number;
}