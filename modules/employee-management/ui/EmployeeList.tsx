'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMoreVertical } from 'react-icons/fi';
import { Employee, EmployeeStatus, Department, EmploymentType } from '../types';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/core/ui/DropdownMenu';

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  onView: (employee: Employee) => void;
}

export function EmployeeList({ employees, onEdit, onDelete, onView }: EmployeeListProps) {
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<EmployeeStatus | 'all'>('all');

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status: EmployeeStatus) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700';
      case 'inactive':
        return 'bg-neutral-100 text-neutral-700';
      case 'on-leave':
        return 'bg-amber-50 text-amber-700';
      case 'terminated':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getEmploymentTypeColor = (type: EmploymentType) => {
    switch (type) {
      case 'full-time':
        return 'bg-blue-50 text-blue-700';
      case 'part-time':
        return 'bg-purple-50 text-purple-700';
      case 'seasonal':
        return 'bg-green-50 text-green-700';
      case 'contract':
        return 'bg-orange-50 text-orange-700';
      case 'intern':
        return 'bg-pink-50 text-pink-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label text-sm">{t('employeeManagement.search')}</label>
            <input
              type="text"
              placeholder={t('employeeManagement.searchEmployees')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label text-sm">{t('employeeManagement.department')}</label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="form-input"
            >
              <option value="all">{t('employeeManagement.allDepartments')}</option>
              <option value="front-desk">{t('employeeManagement.frontDesk')}</option>
              <option value="housekeeping">{t('employeeManagement.housekeeping')}</option>
              <option value="maintenance">{t('employeeManagement.maintenance')}</option>
              <option value="food-beverage">{t('employeeManagement.foodBeverage')}</option>
              <option value="management">{t('employeeManagement.management')}</option>
              <option value="security">{t('employeeManagement.security')}</option>
              <option value="spa">{t('employeeManagement.spa')}</option>
              <option value="administration">{t('employeeManagement.administration')}</option>
            </select>
          </div>
          <div>
            <label className="form-label text-sm">{t('employeeManagement.status')}</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as EmployeeStatus | 'all')}
              className="form-input"
            >
              <option value="all">{t('employeeManagement.allStatus')}</option>
              <option value="active">{t('employeeManagement.active')}</option>
              <option value="inactive">{t('employeeManagement.inactive')}</option>
              <option value="on-leave">{t('employeeManagement.onLeave')}</option>
              <option value="terminated">{t('employeeManagement.terminated')}</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-neutral-dark">
              {t('employeeManagement.showingEmployees', { filtered: filteredEmployees.length, total: employees.length })}
            </div>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-medium overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-light">
            <tr>
              <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.employee')}</th>
              <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.position')}</th>
              <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.department')}</th>
              <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.type')}</th>
              <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.status')}</th>
              <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.hireDate')}</th>
              <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="border-t border-neutral-medium hover:bg-neutral-light/50">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {employee.first_name[0]}{employee.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {employee.first_name} {employee.last_name}
                      </div>
                      <div className="text-sm text-neutral-dark">
                        {employee.employee_id} • {employee.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-foreground">{employee.position}</td>
                 <td className="p-4 text-foreground capitalize">
                   {t(`employeeManagement.${employee.department.replace('-', '')}`) || employee.department.replace('-', ' ')}
                 </td>
                 <td className="p-4">
                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmploymentTypeColor(employee.employment_type)}`}>
                     {t(`employeeManagement.${employee.employment_type.replace('-', '')}`) || employee.employment_type.replace('-', ' ')}
                   </span>
                 </td>
                 <td className="p-4">
                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                     {t(`employeeManagement.${employee.status.replace('-', '')}`) || employee.status.replace('-', ' ')}
                   </span>
                 </td>
                <td className="p-4 text-neutral-dark">
                  {new Date(employee.hire_date).toLocaleDateString('cs-CZ')}
                </td>
                <td className="p-4">
                  <DropdownMenu
                    trigger={
                      <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                        <FiMoreVertical size={16} />
                      </button>
                    }
                    align="right"
                  >
                    <DropdownMenuItem onClick={() => onView(employee)}>
                      {t('employeeManagement.view')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(employee)}>
                      {t('employeeManagement.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDelete(employee.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {t('employeeManagement.delete')}
                    </DropdownMenuItem>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
         {filteredEmployees.length === 0 && (
           <div className="text-center py-12">
             <div className="text-neutral-dark">{t('employeeManagement.noEmployeesFound')}</div>
           </div>
         )}
      </div>
    </div>
  );
}