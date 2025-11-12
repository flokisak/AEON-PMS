'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEmployeeManagement } from '../logic/useEmployeeManagement';
import { Employee, DepartmentInfo } from '../types';
import { EmployeeList } from './EmployeeList';
import { EmployeeForm } from './EmployeeForm';
import { ShiftPlanning } from './ShiftPlanning';

type ActiveTab = 'employees' | 'shifts' | 'departments' | 'attendance' | 'payroll';

export function EmployeeManagementPage() {
  const { t } = useTranslation('common');
  const {
    employees,
    shifts,
    departments,
    isLoading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addShift,
    updateShift,
    deleteShift,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentStats
  } = useEmployeeManagement();

  const [activeTab, setActiveTab] = useState<ActiveTab>('employees');
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentInfo | null>(null);

  const departmentStats = getDepartmentStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-700">{t('error')}: {error}</div>
      </div>
    );
  }

  const handleAddEmployee = (employeeData: Omit<Employee, 'id' | 'employee_id' | 'created_at' | 'updated_at'>) => {
    addEmployee(employeeData);
    setShowEmployeeForm(false);
    setEditingEmployee(null);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleViewEmployee = (employee: Employee) => {
    setViewingEmployee(employee);
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm(t('employeeManagement.confirmDeleteEmployee'))) {
      deleteEmployee(id);
    }
  };

  const handleAddDepartment = (departmentData: Omit<DepartmentInfo, 'id'>) => {
    addDepartment(departmentData);
    setShowDepartmentForm(false);
    setEditingDepartment(null);
  };

  const handleEditDepartment = (department: DepartmentInfo) => {
    setEditingDepartment(department);
    setShowDepartmentForm(true);
  };

  const handleDeleteDepartment = (id: string) => {
    if (confirm(t('employeeManagement.confirmDeleteDepartment'))) {
      deleteDepartment(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{t('employeeManagement.title')}</h1>
        <p className="text-neutral-dark">{t('employeeManagement.description')}</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-1">
        <div className="flex space-x-1">
           {[
             { id: 'employees', label: t('employeeManagement.employees'), count: employees.length },
             { id: 'shifts', label: t('employeeManagement.shiftPlanning'), count: shifts.filter(s => s.status === 'scheduled').length },
             { id: 'departments', label: t('employeeManagement.departments'), count: departments.length },
             { id: 'attendance', label: t('employeeManagement.attendance'), count: null },
             { id: 'payroll', label: t('employeeManagement.payroll'), count: null }
           ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-white shadow-sm text-primary border border-neutral-medium'
                  : 'text-neutral-dark hover:text-primary'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Employees Tab */}
      {activeTab === 'employees' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{t('employeeManagement.employeeDirectory')}</h2>
              <p className="text-neutral-dark">{t('employeeManagement.manageHotelStaff')}</p>
            </div>
            <button
              onClick={() => setShowEmployeeForm(true)}
              className="btn-primary"
            >
              {t('employeeManagement.addEmployee')}
            </button>
          </div>

          {/* Department Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {departmentStats.map((stat) => (
              <div key={stat.department} className="bg-white rounded-lg shadow-sm border border-neutral-medium p-4 h-[160px] flex flex-col">
                 <h3 className="font-semibold text-foreground capitalize mb-2">
                   {t(`employeeManagement.${stat.department.replace('-', '')}`) || stat.department.replace('-', ' ')}
                 </h3>
                 <div className="space-y-1 text-sm">
                   <div className="flex justify-between">
                     <span className="text-neutral-dark">{t('employeeManagement.total')}:</span>
                     <span className="font-medium">{stat.total_employees}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-neutral-dark">{t('employeeManagement.active')}:</span>
                     <span className="font-medium text-emerald-600">{stat.active_employees}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-neutral-dark">{t('employeeManagement.onLeave')}:</span>
                     <span className="font-medium text-amber-600">{stat.on_leave_employees}</span>
                    </div>
                  </div>
                  <div className="mt-auto"></div>
               </div>
            ))}
          </div>

          <EmployeeList
            employees={employees}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
            onView={handleViewEmployee}
          />
        </div>
      )}

      {/* Shift Planning Tab */}
      {activeTab === 'shifts' && (
        <ShiftPlanning
          shifts={shifts}
          employees={employees}
          onAddShift={addShift}
          onUpdateShift={updateShift}
          onDeleteShift={deleteShift}
        />
      )}

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{t('employeeManagement.departments')}</h2>
              <p className="text-neutral-dark">{t('employeeManagement.description')}</p>
            </div>
            <button
              onClick={() => setShowDepartmentForm(true)}
              className="btn-primary"
            >
              {t('employeeManagement.addDepartment')}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-medium overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-light">
                <tr>
                  <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.department')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.description')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.headOfDepartment')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.budget')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.employeesCount')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((department) => {
                  const deptEmployees = employees.filter(emp => 
                    emp.department === department.name.toLowerCase().replace(' & ', '-')
                  );
                  return (
                    <tr key={department.id} className="border-t border-neutral-medium hover:bg-neutral-light/50">
                      <td className="p-4 font-medium text-foreground">{department.name}</td>
                      <td className="p-4 text-neutral-dark">{department.description}</td>
                       <td className="p-4 text-foreground">{department.head_of_department || t('employeeManagement.na')}</td>
                      <td className="p-4 text-foreground">
                         {department.budget ? `$${department.budget.toLocaleString()}` : t('employeeManagement.na')}
                      </td>
                      <td className="p-4 text-foreground">{deptEmployees.length}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditDepartment(department)}
                            className="btn-secondary text-sm px-3 py-1"
                           >
                             {t('employeeManagement.edit')}
                           </button>
                           <button
                             onClick={() => handleDeleteDepartment(department.id)}
                             className="btn-secondary text-sm px-3 py-1 text-red-600 hover:text-red-700"
                           >
                             {t('employeeManagement.delete')}
                           </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{t('employeeManagement.attendanceTracking')}</h2>
              <p className="text-neutral-dark">{t('employeeManagement.monitorAttendance')}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
            <div className="text-center py-12">
              <div className="text-neutral-dark mb-4">{t('employeeManagement.attendanceTrackingComingSoon')}</div>
              <div className="text-sm text-neutral-dark">
                {t('employeeManagement.attendanceFeatures')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payroll Tab */}
      {activeTab === 'payroll' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{t('employeeManagement.payrollManagement')}</h2>
              <p className="text-neutral-dark">{t('employeeManagement.processPayroll')}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
            <div className="text-center py-12">
              <div className="text-neutral-dark mb-4">{t('employeeManagement.payrollComingSoon')}</div>
              <div className="text-sm text-neutral-dark">
                {t('employeeManagement.payrollFeatures')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee Form Modal */}
      {(showEmployeeForm || editingEmployee) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-medium">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-foreground">
                  {editingEmployee ? t('employeeManagement.editEmployee') : t('employeeManagement.addNewEmployee')}
                </h3>
                <button
                  onClick={() => {
                    setShowEmployeeForm(false);
                    setEditingEmployee(null);
                  }}
                  className="text-neutral-dark hover:text-foreground text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <EmployeeForm
                employee={editingEmployee || undefined}
                onSave={handleAddEmployee}
                onCancel={() => {
                  setShowEmployeeForm(false);
                  setEditingEmployee(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Employee View Modal */}
      {viewingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-medium">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-foreground">{t('employeeManagement.employeeDetails')}</h3>
                <button
                  onClick={() => setViewingEmployee(null)}
                  className="text-neutral-dark hover:text-foreground text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
    <div className="space-y-6 p-4 lg:p-6 xl:p-8">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-2xl">
                      {viewingEmployee.first_name[0]}{viewingEmployee.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">
                      {viewingEmployee.first_name} {viewingEmployee.last_name}
                    </h4>
                    <p className="text-neutral-dark">{viewingEmployee.position}</p>
                    <p className="text-sm text-neutral-dark">{viewingEmployee.employee_id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="form-label text-sm">{t('employeeManagement.email')}</label>
                     <div className="text-foreground">{viewingEmployee.email}</div>
                   </div>
                   <div>
                     <label className="form-label text-sm">{t('employeeManagement.phone')}</label>
                     <div className="text-foreground">{viewingEmployee.phone}</div>
                   </div>
                   <div>
                     <label className="form-label text-sm">{t('employeeManagement.department')}</label>
                     <div className="text-foreground capitalize">
                       {t(`employeeManagement.${viewingEmployee.department.replace('-', '')}`) || viewingEmployee.department.replace('-', ' ')}
                     </div>
                   </div>
                   <div>
                     <label className="form-label text-sm">{t('employeeManagement.employmentType')}</label>
                     <div className="text-foreground capitalize">
                       {t(`employeeManagement.${viewingEmployee.employment_type.replace('-', '')}`) || viewingEmployee.employment_type.replace('-', ' ')}
                     </div>
                   </div>
                   <div>
                     <label className="form-label text-sm">{t('employeeManagement.hireDate')}</label>
                     <div className="text-foreground">
                       {new Date(viewingEmployee.hire_date).toLocaleDateString()}
                     </div>
                   </div>
                   <div>
                     <label className="form-label text-sm">{t('employeeManagement.status')}</label>
                     <div className="text-foreground capitalize">
                       {t(`employeeManagement.${viewingEmployee.status.replace('-', '')}`) || viewingEmployee.status.replace('-', ' ')}
                     </div>
                   </div>
                </div>

                 {viewingEmployee.skills.length > 0 && (
                   <div>
                     <label className="form-label text-sm">{t('employeeManagement.skills')}</label>
                     <div className="flex flex-wrap gap-2">
                       {viewingEmployee.skills.map((skill, index) => (
                         <span
                           key={index}
                           className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                         >
                           {skill}
                         </span>
                       ))}
                     </div>
                   </div>
                 )}

                 {viewingEmployee.notes && (
                   <div>
                     <label className="form-label text-sm">{t('employeeManagement.notes')}</label>
                     <div className="text-foreground">{viewingEmployee.notes}</div>
                   </div>
                 )}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setViewingEmployee(null);
                    handleEditEmployee(viewingEmployee);
                   }}
                   className="btn-primary"
                 >
                   {t('employeeManagement.editEmployee')}
                 </button>
                 <button
                   onClick={() => setViewingEmployee(null)}
                   className="btn-secondary"
                 >
                   {t('employeeManagement.close')}
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}