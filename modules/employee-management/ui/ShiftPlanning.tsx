'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shift, Employee, ShiftStatus, Department } from '../types';

interface ShiftPlanningProps {
  shifts: Shift[];
  employees: Employee[];
  onAddShift: (shift: Omit<Shift, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateShift: (id: string, updates: Partial<Shift>) => void;
  onDeleteShift: (id: string) => void;
}

export function ShiftPlanning({ shifts, employees, onAddShift, onUpdateShift, onDeleteShift }: ShiftPlanningProps) {
  const { t } = useTranslation('common');
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [showAddShift, setShowAddShift] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getShiftsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return shifts.filter(shift => shift.date === dateStr);
  };

  const getEmployeeById = (id: string) => {
    return employees.find(emp => emp.id === id);
  };

  const getShiftStatusColor = (status: ShiftStatus) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'in-progress':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'completed':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'missed':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'cancelled':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const weekDates = getWeekDates(selectedWeek);
  const departments: Department[] = ['front-desk', 'housekeeping', 'maintenance', 'food-beverage', 'management', 'security', 'spa', 'administration'];

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(selectedWeek.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedWeek(newDate);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">{t('employeeManagement.shiftPlanningTitle')}</h2>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateWeek('prev')}
                className="btn-secondary px-3 py-1"
              >
                ←
              </button>
              <span className="font-medium text-foreground">
                 {weekDates[0].toLocaleDateString('cs-CZ')} - {weekDates[6].toLocaleDateString('cs-CZ')}
              </span>
              <button
                onClick={() => navigateWeek('next')}
                className="btn-secondary px-3 py-1"
              >
                →
              </button>
            </div>
            <button
              onClick={() => setSelectedWeek(new Date())}
              className="btn-secondary"
            >
              {t('employeeManagement.today')}
            </button>
            <div className="flex bg-neutral-light rounded-lg p-1 border border-neutral-medium">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  viewMode === 'calendar' ? 'bg-white shadow-sm text-primary border border-neutral-medium' : 'text-neutral-dark hover:text-primary'
                }`}
              >
                {t('employeeManagement.calendar')}
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-primary border border-neutral-medium' : 'text-neutral-dark hover:text-primary'
                }`}
              >
                {t('employeeManagement.list')}
              </button>
            </div>
            <button
              onClick={() => setShowAddShift(true)}
              className="btn-primary"
            >
              {t('employeeManagement.addShift')}
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        /* Calendar View */
        <div className="bg-white rounded-lg shadow-sm border border-neutral-medium overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Calendar Header */}
            <div className="grid grid-cols-8 border-b border-neutral-medium">
              <div className="p-4 bg-neutral-light font-semibold text-foreground">{t('employeeManagement.employeeDepartment')}</div>
              {weekDates.map((date, index) => (
                <div key={index} className="p-4 bg-neutral-light text-center">
                  <div className="font-semibold text-foreground">
                    {date.toLocaleDateString('cs-CZ', { weekday: 'short' })}
                  </div>
                  <div className="text-sm text-neutral-dark">
                    {date.toLocaleDateString('cs-CZ')}
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="divide-y divide-neutral-medium">
              {departments.map(department => {
                const departmentEmployees = employees.filter(emp => emp.department === department);
                if (departmentEmployees.length === 0) return null;

                return (
                  <div key={department}>
                    {/* Department Header */}
                     <div className="grid grid-cols-8">
                        <div className="p-4 bg-neutral-light font-semibold text-foreground capitalize">
                          {(() => {
                            const keyMap: { [key: string]: string } = {
                              'front-desk': 'frontDesk',
                              'housekeeping': 'housekeeping',
                              'maintenance': 'maintenance',
                              'food-beverage': 'foodBeverage',
                              'management': 'management',
                              'security': 'security',
                              'spa': 'spa',
                              'administration': 'administration'
                            };
                            const translationKey = keyMap[department] || department;
                            return t(`employeeManagement.${translationKey}`);
                          })()}
                        </div>
                       <div className="col-span-7 p-2 bg-neutral-light/50">
                         <div className="text-sm text-neutral-dark">
                           {t('employeeManagement.employeeCount', { count: departmentEmployees.length, plural: departmentEmployees.length !== 1 ? 's' : '' })}
                         </div>
                       </div>
                     </div>

                    {/* Employee Rows */}
                    {departmentEmployees.map(employee => (
                      <div key={employee.id} className="grid grid-cols-8">
                        <div className="p-4 border-r border-neutral-medium">
                          <div className="font-medium text-foreground">
                            {employee.first_name} {employee.last_name}
                          </div>
                          <div className="text-sm text-neutral-dark">
                            {employee.position}
                          </div>
                        </div>
                        {weekDates.map((date, dateIndex) => {
                          const dayShifts = getShiftsForDate(date);
                          const employeeShifts = dayShifts.filter(shift => shift.employee_id === employee.id);

                          return (
                            <div key={dateIndex} className="p-2 border-r border-neutral-medium min-h-[80px]">
                              {employeeShifts.map(shift => {
                                const employee = getEmployeeById(shift.employee_id);
                                return (
                                  <div
                                    key={shift.id}
                                    className={`p-2 rounded text-xs mb-1 border ${getShiftStatusColor(shift.status)}`}
                                  >
                                    <div className="font-medium">
                                      {shift.start_time} - {shift.end_time}
                                    </div>
                                    <div className="text-xs opacity-75">
                                      {shift.position}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-lg shadow-sm border border-neutral-medium">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-light">
                <tr>
                  <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.employee')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.date')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.time')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.position')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.department')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.status')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('employeeManagement.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {shifts
                  .filter(shift => {
                    const shiftDate = new Date(shift.date);
                    return shiftDate >= weekDates[0] && shiftDate <= weekDates[6];
                  })
                  .sort((a, b) => {
                    const dateCompare = a.date.localeCompare(b.date);
                    if (dateCompare !== 0) return dateCompare;
                    return a.start_time.localeCompare(b.start_time);
                  })
                  .map((shift) => {
                    const employee = getEmployeeById(shift.employee_id);
                    return (
                      <tr key={shift.id} className="border-t border-neutral-medium hover:bg-neutral-light/50">
                        <td className="p-4">
                          <div className="font-medium text-foreground">
                            {employee?.first_name} {employee?.last_name}
                          </div>
                          <div className="text-sm text-neutral-dark">
                            {employee?.position}
                          </div>
                        </td>
                        <td className="p-4 text-foreground">
                          {new Date(shift.date).toLocaleDateString('cs-CZ')}
                        </td>
                        <td className="p-4 text-foreground">
                          {shift.start_time} - {shift.end_time}
                        </td>
                        <td className="p-4 text-foreground">{shift.position}</td>
                          <td className="p-4 text-foreground capitalize">
                            {(() => {
                              const keyMap: { [key: string]: string } = {
                                'front-desk': 'frontDesk',
                                'housekeeping': 'housekeeping',
                                'maintenance': 'maintenance',
                                'food-beverage': 'foodBeverage',
                                'management': 'management',
                                'security': 'security',
                                'spa': 'spa',
                                'administration': 'administration'
                              };
                              const translationKey = keyMap[shift.department] || shift.department;
                              return t(`employeeManagement.${translationKey}`);
                            })()}
                          </td>
                         <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getShiftStatusColor(shift.status)}`}>
                              {(() => {
                                const statusKeyMap: { [key: string]: string } = {
                                  'scheduled': 'scheduled',
                                  'in-progress': 'inProgress',
                                  'completed': 'completed',
                                  'missed': 'missed',
                                  'cancelled': 'cancelled'
                                };
                                const translationKey = statusKeyMap[shift.status] || shift.status;
                                return t(`employeeManagement.${translationKey}`);
                              })()}
                            </span>
                         </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => onUpdateShift(shift.id, { 
                                status: shift.status === 'scheduled' ? 'in-progress' : 
                                       shift.status === 'in-progress' ? 'completed' : 'scheduled'
                              })}
                              className="btn-secondary text-sm px-3 py-1"
                            >
                               {shift.status === 'scheduled' ? t('employeeManagement.start') : 
                                shift.status === 'in-progress' ? t('employeeManagement.complete') : t('employeeManagement.reschedule')}
                             </button>
                             <button
                               onClick={() => onDeleteShift(shift.id)}
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
            
            {shifts.filter(shift => {
              const shiftDate = new Date(shift.date);
              return shiftDate >= weekDates[0] && shiftDate <= weekDates[6];
            }).length === 0 && (
              <div className="text-center py-12">
                <div className="text-neutral-dark">{t('employeeManagement.noShiftsThisWeek')}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Shift Modal */}
      {showAddShift && (
        <AddShiftModal
          employees={employees}
          onClose={() => setShowAddShift(false)}
          onSave={onAddShift}
        />
      )}
    </div>
  );
}

interface AddShiftModalProps {
  employees: Employee[];
  onClose: () => void;
  onSave: (shift: Omit<Shift, 'id' | 'created_at' | 'updated_at'>) => void;
}

function AddShiftModal({ employees, onClose, onSave }: AddShiftModalProps) {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    start_time: '',
    end_time: '',
    break_duration: 60,
    position: '',
    department: 'front-desk' as Department,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      status: 'scheduled'
    });
    onClose();
  };

  const selectedEmployee = employees.find(emp => emp.id === formData.employee_id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-medium">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-foreground">{t('employeeManagement.addNewShift')}</h3>
            <button
              onClick={onClose}
              className="text-neutral-dark hover:text-foreground text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t('employeeManagement.employee')} *</label>
              <select
                value={formData.employee_id}
                onChange={(e) => {
                  const employee = employees.find(emp => emp.id === e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    employee_id: e.target.value,
                    position: employee?.position || '',
                    department: employee?.department || 'front-desk'
                  }));
                }}
                className="form-input"
                required
              >
                <option value="">{t('employeeManagement.selectEmployee')}</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name} - {employee.position}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">{t('employeeManagement.date')} *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">{t('employeeManagement.startTime')} *</label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">{t('employeeManagement.endTime')} *</label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">{t('employeeManagement.breakDurationMinutes')}</label>
              <input
                type="number"
                value={formData.break_duration}
                onChange={(e) => setFormData(prev => ({ ...prev, break_duration: parseInt(e.target.value) || 0 }))}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">{t('employeeManagement.position')}</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="form-input"
                placeholder={selectedEmployee?.position}
              />
            </div>
            <div>
              <label className="form-label">{t('employeeManagement.department')}</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value as Department }))}
                className="form-input"
              >
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
          </div>
          <div className="mt-4">
            <label className="form-label">{t('employeeManagement.notes')}</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder={t('employeeManagement.anyNotesAboutShift')}
              className="form-input w-full h-24 resize-none"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">
              {t('employeeManagement.cancel')}
            </button>
            <button type="submit" className="btn-primary">
              {t('employeeManagement.addShiftBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}