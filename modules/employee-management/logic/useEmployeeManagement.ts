'use client';

import { useState, useEffect } from 'react';
import { 
  Employee, 
  Shift, 
  TimeEntry, 
  LeaveRequest, 
  PayrollRecord,
  DepartmentInfo,
  Department,
  DepartmentStats,
  ScheduleConflict,
  ShiftTemplate,
  AttendanceReport,
  EmployeeStatus,
  Department as DepartmentType,
  EmploymentType
} from '../types';

// Mock data - in real app this would come from API
const mockEmployees: Employee[] = [
  {
    id: '1',
    employee_id: 'EMP001',
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@hotel.com',
    phone: '+1-555-0101',
    address: '123 Main St, City, State 12345',
    date_of_birth: '1985-06-15',
    hire_date: '2022-01-15',
    position: 'Front Desk Manager',
    department: 'front-desk' as unknown as Department,
    employment_type: 'full-time',
    status: 'active',
    salary: 45000,
    hourly_rate: 25,
    work_schedule: {
      monday: { is_working: true, start_time: '08:00', end_time: '16:00', break_duration: 60 },
      tuesday: { is_working: true, start_time: '08:00', end_time: '16:00', break_duration: 60 },
      wednesday: { is_working: true, start_time: '08:00', end_time: '16:00', break_duration: 60 },
      thursday: { is_working: true, start_time: '08:00', end_time: '16:00', break_duration: 60 },
      friday: { is_working: true, start_time: '08:00', end_time: '16:00', break_duration: 60 },
      saturday: { is_working: false },
      sunday: { is_working: false }
    },
    emergency_contact: {
      name: 'Jane Smith',
      relationship: 'Spouse',
      phone: '+1-555-0102',
      email: 'jane.smith@email.com'
    },
    skills: ['Customer Service', 'Multilingual', 'PMS Software', 'Conflict Resolution'],
    certifications: [
      {
        id: '1',
        name: 'Hospitality Management Certificate',
        issuing_organization: 'American Hotel Association',
        issue_date: '2021-09-01',
        expiry_date: '2024-09-01',
        status: 'active'
      }
    ],
    created_at: '2022-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    employee_id: 'EMP002',
    first_name: 'Maria',
    last_name: 'Garcia',
    email: 'maria.garcia@hotel.com',
    phone: '+1-555-0103',
    address: '456 Oak Ave, City, State 12345',
    date_of_birth: '1990-03-22',
    hire_date: '2023-03-10',
    position: 'Housekeeping Supervisor',
    department: 'housekeeping' as unknown as Department,
    employment_type: 'full-time',
    status: 'active',
    salary: 38000,
    hourly_rate: 20,
    work_schedule: {
      monday: { is_working: true, start_time: '07:00', end_time: '15:00', break_duration: 60 },
      tuesday: { is_working: true, start_time: '07:00', end_time: '15:00', break_duration: 60 },
      wednesday: { is_working: true, start_time: '07:00', end_time: '15:00', break_duration: 60 },
      thursday: { is_working: true, start_time: '07:00', end_time: '15:00', break_duration: 60 },
      friday: { is_working: true, start_time: '07:00', end_time: '15:00', break_duration: 60 },
      saturday: { is_working: false },
      sunday: { is_working: false }
    },
    emergency_contact: {
      name: 'Carlos Garcia',
      relationship: 'Husband',
      phone: '+1-555-0104'
    },
    skills: ['Team Leadership', 'Quality Control', 'Training', 'Time Management'],
    certifications: [
      {
        id: '2',
        name: 'Housekeeping Management',
        issuing_organization: 'EcoLab',
        issue_date: '2022-11-15',
        expiry_date: '2025-11-15',
        status: 'active'
      }
    ],
    created_at: '2023-03-10T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  }
];

const mockShifts: Shift[] = [
  {
    id: '1',
    employee_id: '1',
    date: '2024-11-12',
    start_time: '08:00',
    end_time: '16:00',
    break_duration: 60,
    position: 'Front Desk Manager',
    department: 'front-desk',
    status: 'scheduled',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-11-01T00:00:00Z'
  },
  {
    id: '2',
    employee_id: '2',
    date: '2024-11-12',
    start_time: '07:00',
    end_time: '15:00',
    break_duration: 60,
    position: 'Housekeeping Supervisor',
    department: 'housekeeping',
    status: 'in-progress',
    actual_start_time: '07:00',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-11-12T07:00:00Z'
  }
];

const mockDepartments: DepartmentInfo[] = [
  { id: '1', name: 'Front Desk', description: 'Guest check-in/out and customer service', head_of_department: 'John Smith', budget: 150000 },
  { id: '2', name: 'Housekeeping', description: 'Room cleaning and maintenance', head_of_department: 'Maria Garcia', budget: 200000 },
  { id: '3', name: 'Maintenance', description: 'Building and equipment maintenance', budget: 100000 },
  { id: '4', name: 'Food & Beverage', description: 'Restaurant and bar operations', budget: 300000 },
  { id: '5', name: 'Management', description: 'Hotel management and administration', budget: 250000 }
];

export function useEmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEmployees(mockEmployees);
      setShifts(mockShifts);
      setDepartments(mockDepartments);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Employee CRUD operations
  const addEmployee = (employee: Omit<Employee, 'id' | 'employee_id' | 'created_at' | 'updated_at'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
      employee_id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setEmployees([...employees, newEmployee]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(employees.map(emp => 
      emp.id === id 
        ? { ...emp, ...updates, updated_at: new Date().toISOString() }
        : emp
    ));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    setShifts(shifts.filter(shift => shift.employee_id !== id));
  };

  // Shift operations
  const addShift = (shift: Omit<Shift, 'id' | 'created_at' | 'updated_at'>) => {
    const newShift: Shift = {
      ...shift,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setShifts([...shifts, newShift]);
  };

  const updateShift = (id: string, updates: Partial<Shift>) => {
    setShifts(shifts.map(shift => 
      shift.id === id 
        ? { ...shift, ...updates, updated_at: new Date().toISOString() }
        : shift
    ));
  };

  const deleteShift = (id: string) => {
    setShifts(shifts.filter(shift => shift.id !== id));
  };

  // Department operations
  const addDepartment = (department: Omit<DepartmentInfo, 'id'>) => {
    const newDepartment: DepartmentInfo = {
      ...department,
      id: Date.now().toString()
    };
    setDepartments([...departments, newDepartment]);
  };

  const updateDepartment = (id: string, updates: Partial<DepartmentInfo>) => {
    setDepartments(departments.map(dept => 
      dept.id === id ? { ...dept, ...updates } : dept
    ));
  };

  const deleteDepartment = (id: string) => {
    setDepartments(departments.filter(dept => dept.id !== id));
  };

  // Utility functions
  const getEmployeesByDepartment = (department: DepartmentType) => {
    return employees.filter(emp => emp.department === department);
  };

  const getEmployeeShifts = (employeeId: string) => {
    return shifts.filter(shift => shift.employee_id === employeeId);
  };

  const getShiftsByDate = (date: string) => {
    return shifts.filter(shift => shift.date === date);
  };

  const getDepartmentStats = (): DepartmentStats[] => {
    return departments.map(dept => {
      const deptName = dept.name.toLowerCase().replace(' & ', '-') as string;
      const deptEmployees = employees.filter(emp => emp.department as unknown as string === deptName);
      const todayShifts = shifts.filter(shift => 
        shift.department === deptName && 
        shift.date === new Date().toISOString().split('T')[0]
      );
      
      return {
        department: dept.name.toLowerCase().replace(' & ', '-') as unknown as DepartmentType,
        total_employees: deptEmployees.length,
        active_employees: deptEmployees.filter(emp => emp.status === 'active').length,
        on_leave_employees: deptEmployees.filter(emp => emp.status === 'on-leave').length,
        scheduled_hours_this_week: todayShifts.reduce((acc, shift) => {
          const start = new Date(`2000-01-01T${shift.start_time}`);
          const end = new Date(`2000-01-01T${shift.end_time}`);
          return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60) - (shift.break_duration / 60);
        }, 0),
        overtime_hours_this_week: 0, // Would calculate from time entries
        upcoming_shifts: todayShifts.filter(shift => shift.status === 'scheduled').length
      };
    });
  };

  const searchEmployees = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return employees.filter(emp => 
      emp.first_name.toLowerCase().includes(lowercaseQuery) ||
      emp.last_name.toLowerCase().includes(lowercaseQuery) ||
      emp.email.toLowerCase().includes(lowercaseQuery) ||
      emp.employee_id.toLowerCase().includes(lowercaseQuery) ||
      emp.position.toLowerCase().includes(lowercaseQuery)
    );
  };

  return {
    // Data
    employees,
    shifts,
    departments,
    isLoading,
    error,

    // Employee operations
    addEmployee,
    updateEmployee,
    deleteEmployee,

    // Shift operations
    addShift,
    updateShift,
    deleteShift,

    // Department operations
    addDepartment,
    updateDepartment,
    deleteDepartment,

    // Utility functions
    getEmployeesByDepartment,
    getEmployeeShifts,
    getShiftsByDate,
    getDepartmentStats,
    searchEmployees
  };
}