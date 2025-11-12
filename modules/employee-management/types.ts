export interface Employee {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
  hire_date: string;
  position: string;
  department: Department;
  employment_type: EmploymentType;
  status: EmployeeStatus;
  salary: number;
  hourly_rate: number;
  work_schedule: WorkSchedule;
  emergency_contact: EmergencyContact;
  skills: string[];
  certifications: Certification[];
  avatar?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DepartmentInfo {
  id: string;
  name: string;
  description: string;
  head_of_department?: string;
  budget?: number;
}

export interface Shift {
  id: string;
  employee_id: string;
  date: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  position: string;
  department: string;
  status: ShiftStatus;
  actual_start_time?: string;
  actual_end_time?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: string;
  employee_id: string;
  shift_id: string;
  clock_in: string;
  clock_out?: string;
  break_start?: string;
  break_end?: string;
  total_hours?: number;
  overtime_hours?: number;
  status: TimeEntryStatus;
  notes?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  status: LeaveStatus;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface PayrollRecord {
  id: string;
  employee_id: string;
  pay_period_start: string;
  pay_period_end: string;
  regular_hours: number;
  overtime_hours: number;
  regular_pay: number;
  overtime_pay: number;
  deductions: number;
  bonuses: number;
  net_pay: number;
  status: PayrollStatus;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date: string;
  certificate_number?: string;
  status: 'active' | 'expired' | 'pending';
}

export interface WorkSchedule {
  monday: ShiftPattern;
  tuesday: ShiftPattern;
  wednesday: ShiftPattern;
  thursday: ShiftPattern;
  friday: ShiftPattern;
  saturday: ShiftPattern;
  sunday: ShiftPattern;
}

export interface ShiftPattern {
  is_working: boolean;
  start_time?: string;
  end_time?: string;
  break_duration?: number;
}

export type Department = 'front-desk' | 'housekeeping' | 'maintenance' | 'food-beverage' | 'management' | 'security' | 'spa' | 'administration';
export type EmploymentType = 'full-time' | 'part-time' | 'seasonal' | 'contract' | 'intern';
export type EmployeeStatus = 'active' | 'inactive' | 'on-leave' | 'terminated';
export type ShiftStatus = 'scheduled' | 'in-progress' | 'completed' | 'missed' | 'cancelled';
export type TimeEntryStatus = 'pending' | 'approved' | 'rejected';
export type LeaveType = 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'bereavement' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type PayrollStatus = 'draft' | 'pending' | 'approved' | 'paid' | 'cancelled';

export interface ShiftTemplate {
  id: string;
  name: string;
  department: Department;
  position: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  is_active: boolean;
}

export interface AttendanceReport {
  employee_id: string;
  period_start: string;
  period_end: string;
  total_shifts: number;
  completed_shifts: number;
  missed_shifts: number;
  late_arrivals: number;
  early_departures: number;
  total_hours: number;
  overtime_hours: number;
  attendance_rate: number;
}

export interface DepartmentStats {
  department: Department;
  total_employees: number;
  active_employees: number;
  on_leave_employees: number;
  scheduled_hours_this_week: number;
  overtime_hours_this_week: number;
  upcoming_shifts: number;
}

export interface ScheduleConflict {
  id: string;
  type: 'overlap' | 'understaffed' | 'overstaffed' | 'certification-expired' | 'leave-conflict';
  employee_ids: string[];
  shift_ids: string[];
  date: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
}