'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Employee, Department, EmploymentType, EmployeeStatus, WorkSchedule, ShiftPattern, EmergencyContact, Certification } from '../types';

interface EmployeeFormProps {
  employee?: Employee;
  onSave: (employee: Omit<Employee, 'id' | 'employee_id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

export function EmployeeForm({ employee, onSave, onCancel }: EmployeeFormProps) {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    hire_date: '',
    position: '',
    department: 'front-desk' as Department,
    employment_type: 'full-time' as EmploymentType,
    status: 'active' as EmployeeStatus,
    salary: 0,
    hourly_rate: 0,
    emergency_contact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    skills: [] as string[],
    notes: ''
  });

  const [workSchedule, setWorkSchedule] = useState<WorkSchedule>({
    monday: { is_working: false },
    tuesday: { is_working: false },
    wednesday: { is_working: false },
    thursday: { is_working: false },
    friday: { is_working: false },
    saturday: { is_working: false },
    sunday: { is_working: false }
  });

  const [newSkill, setNewSkill] = useState('');
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    if (employee) {
      const formData = {
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone,
        address: employee.address,
        date_of_birth: employee.date_of_birth,
        hire_date: employee.hire_date,
        department: employee.department,
        position: employee.position,
        employment_type: employee.employment_type,
        salary: employee.salary,
        status: employee.status,
        hourly_rate: employee.hourly_rate,
        emergency_contact: {
          name: employee.emergency_contact.name,
          relationship: employee.emergency_contact.relationship,
          phone: employee.emergency_contact.phone,
          email: employee.emergency_contact.email || ''
        },
        skills: employee.skills,
        notes: employee.notes || ''
      };
      setFormData(formData);
    }
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      work_schedule: workSchedule,
      certifications: certifications
    });
  };

  const updateWorkSchedule = (day: keyof WorkSchedule, updates: Partial<ShiftPattern>) => {
    setWorkSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], ...updates }
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuing_organization: '',
      issue_date: '',
      expiry_date: '',
      status: 'active'
    };
    setCertifications([...certifications, newCert]);
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    setCertifications(certifications.map(cert => 
      cert.id === id ? { ...cert, ...updates } : cert
    ));
  };

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
  };

  const daysOfWeek = [
    { key: 'monday', label: t('employeeManagement.monday') },
    { key: 'tuesday', label: t('employeeManagement.tuesday') },
    { key: 'wednesday', label: t('employeeManagement.wednesday') },
    { key: 'thursday', label: t('employeeManagement.thursday') },
    { key: 'friday', label: t('employeeManagement.friday') },
    { key: 'saturday', label: t('employeeManagement.saturday') },
    { key: 'sunday', label: t('employeeManagement.sunday') }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       {/* Personal Information */}
       <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
         <h3 className="text-lg font-semibold mb-4 text-foreground">{t('employeeManagement.personalInformation')}</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <label className="form-label">{t('employeeManagement.firstName')} *</label>
             <input
               type="text"
               value={formData.first_name}
               onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
               className="form-input"
               required
             />
           </div>
           <div>
             <label className="form-label">{t('employeeManagement.lastName')} *</label>
             <input
               type="text"
               value={formData.last_name}
               onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
               className="form-input"
               required
             />
           </div>
           <div>
             <label className="form-label">{t('employeeManagement.email')} *</label>
             <input
               type="email"
               value={formData.email}
               onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
               className="form-input"
               required
             />
           </div>
           <div>
             <label className="form-label">{t('employeeManagement.phone')} *</label>
             <input
               type="tel"
               value={formData.phone}
               onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
               className="form-input"
               required
             />
           </div>
           <div className="md:col-span-2">
             <label className="form-label">{t('employeeManagement.address')}</label>
             <input
               type="text"
               value={formData.address}
               onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
               className="form-input"
             />
           </div>
           <div>
             <label className="form-label">{t('employeeManagement.dateOfBirth')}</label>
             <input
               type="date"
               value={formData.date_of_birth}
               onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
               className="form-input"
             />
           </div>
           <div>
             <label className="form-label">{t('employeeManagement.hireDate')} *</label>
             <input
               type="date"
               value={formData.hire_date}
               onChange={(e) => setFormData(prev => ({ ...prev, hire_date: e.target.value }))}
               className="form-input"
               required
             />
           </div>
         </div>
       </div>

       {/* Job Information */}
       <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
         <h3 className="text-lg font-semibold mb-4 text-foreground">{t('employeeManagement.jobInformation')}</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           <div>
             <label className="form-label">{t('employeeManagement.position')} *</label>
             <input
               type="text"
               value={formData.position}
               onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
               className="form-input"
               required
             />
           </div>
           <div>
             <label className="form-label">{t('employeeManagement.department')} *</label>
             <select
               value={formData.department}
               onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value as Department }))}
               className="form-input"
               required
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
           <div>
             <label className="form-label">{t('employeeManagement.employmentType')} *</label>
             <select
               value={formData.employment_type}
               onChange={(e) => setFormData(prev => ({ ...prev, employment_type: e.target.value as EmploymentType }))}
               className="form-input"
               required
             >
               <option value="full-time">{t('employeeManagement.fullTime')}</option>
               <option value="part-time">{t('employeeManagement.partTime')}</option>
               <option value="seasonal">{t('employeeManagement.seasonal')}</option>
               <option value="contract">{t('employeeManagement.contract')}</option>
               <option value="intern">{t('employeeManagement.intern')}</option>
             </select>
           </div>
           <div>
             <label className="form-label">{t('employeeManagement.status')} *</label>
             <select
               value={formData.status}
               onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as EmployeeStatus }))}
               className="form-input"
               required
             >
               <option value="active">{t('employeeManagement.active')}</option>
               <option value="inactive">{t('employeeManagement.inactive')}</option>
               <option value="on-leave">{t('employeeManagement.onLeave')}</option>
               <option value="terminated">{t('employeeManagement.terminated')}</option>
             </select>
           </div>
           <div>
             <label className="form-label">{t('employeeManagement.annualSalary')}</label>
             <input
               type="number"
               value={formData.salary}
               onChange={(e) => setFormData(prev => ({ ...prev, salary: parseFloat(e.target.value) || 0 }))}
               className="form-input"
             />
           </div>
           <div>
             <label className="form-label">{t('employeeManagement.hourlyRate')}</label>
             <input
               type="number"
               step="0.01"
               value={formData.hourly_rate}
               onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: parseFloat(e.target.value) || 0 }))}
               className="form-input"
             />
           </div>
         </div>
       </div>

       {/* Work Schedule */}
       <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
         <h3 className="text-lg font-semibold mb-4 text-foreground">{t('employeeManagement.workSchedule')}</h3>
         <div className="space-y-3">
           {daysOfWeek.map(({ key, label }) => (
             <div key={key} className="flex items-center space-x-4 p-3 bg-neutral-light rounded-lg">
               <div className="w-24">
                 <label className="flex items-center">
                   <input
                     type="checkbox"
                     checked={workSchedule[key as keyof WorkSchedule].is_working}
                     onChange={(e) => updateWorkSchedule(key as keyof WorkSchedule, { is_working: e.target.checked })}
                     className="mr-2"
                   />
                   <span className="font-medium">{label}</span>
                 </label>
               </div>
               {workSchedule[key as keyof WorkSchedule].is_working && (
                 <>
                   <div>
                     <label className="form-label text-sm">{t('employeeManagement.start')}</label>
                     <input
                       type="time"
                       value={workSchedule[key as keyof WorkSchedule].start_time || ''}
                       onChange={(e) => updateWorkSchedule(key as keyof WorkSchedule, { start_time: e.target.value })}
                       className="form-input text-sm"
                     />
                   </div>
                   <div>
                     <label className="form-label text-sm">{t('employeeManagement.end')}</label>
                     <input
                       type="time"
                       value={workSchedule[key as keyof WorkSchedule].end_time || ''}
                       onChange={(e) => updateWorkSchedule(key as keyof WorkSchedule, { end_time: e.target.value })}
                       className="form-input text-sm"
                     />
                   </div>
                   <div>
                     <label className="form-label text-sm">{t('employeeManagement.breakMinutes')}</label>
                     <input
                       type="number"
                       value={workSchedule[key as keyof WorkSchedule].break_duration || 0}
                       onChange={(e) => updateWorkSchedule(key as keyof WorkSchedule, { break_duration: parseInt(e.target.value) || 0 })}
                       className="form-input text-sm w-20"
                     />
                   </div>
                 </>
               )}
             </div>
           ))}
         </div>
       </div>

       {/* Emergency Contact */}
       <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
         <h3 className="text-lg font-semibold mb-4 text-foreground">{t('employeeManagement.emergencyContact')}</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <label className="form-label">{t('employeeManagement.contactName')} *</label>
             <input
               type="text"
               value={formData.emergency_contact.name}
               onChange={(e) => setFormData(prev => ({
                 ...prev,
                 emergency_contact: { ...prev.emergency_contact, name: e.target.value }
               }))}
               className="form-input"
               required
             />
           </div>
           <div>
             <label className="form-label">{t('employeeManagement.relationship')} *</label>
             <input
               type="text"
               value={formData.emergency_contact.relationship}
               onChange={(e) => setFormData(prev => ({
                 ...prev,
                 emergency_contact: { ...prev.emergency_contact, relationship: e.target.value }
               }))}
               className="form-input"
               required
             />
           </div>
           <div>
             <label className="form-label">{t('employeeManagement.phone')} *</label>
             <input
               type="tel"
               value={formData.emergency_contact.phone}
               onChange={(e) => setFormData(prev => ({
                 ...prev,
                 emergency_contact: { ...prev.emergency_contact, phone: e.target.value }
               }))}
               className="form-input"
               required
             />
           </div>
           <div>
             <label className="form-label">{t('employeeManagement.email')}</label>
             <input
               type="email"
               value={formData.emergency_contact.email}
               onChange={(e) => setFormData(prev => ({
                 ...prev,
                 emergency_contact: { ...prev.emergency_contact, email: e.target.value }
               }))}
               className="form-input"
             />
           </div>
         </div>
       </div>

       {/* Skills */}
       <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
         <h3 className="text-lg font-semibold mb-4 text-foreground">{t('employeeManagement.skills')}</h3>
         <div className="flex space-x-2 mb-4">
           <input
             type="text"
             value={newSkill}
             onChange={(e) => setNewSkill(e.target.value)}
             onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
             placeholder={t('employeeManagement.addASkill')}
             className="form-input flex-1"
           />
           <button type="button" onClick={addSkill} className="btn-secondary">
             {t('employeeManagement.addSkill')}
           </button>
         </div>
         <div className="flex flex-wrap gap-2">
           {formData.skills.map((skill, index) => (
             <span
               key={index}
               className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center space-x-2"
             >
               <span>{skill}</span>
               <button
                 type="button"
                 onClick={() => removeSkill(skill)}
                 className="text-primary/60 hover:text-primary"
               >
                 ×
               </button>
             </span>
           ))}
         </div>
       </div>

       {/* Notes */}
       <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
         <h3 className="text-lg font-semibold mb-4 text-foreground">{t('employeeManagement.notes')}</h3>
         <textarea
           value={formData.notes}
           onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
           placeholder={t('employeeManagement.additionalNotes')}
           className="form-input w-full h-32 resize-none"
         />
       </div>

       {/* Form Actions */}
       <div className="flex justify-end space-x-4">
         <button type="button" onClick={onCancel} className="btn-secondary">
           {t('employeeManagement.cancel')}
         </button>
         <button type="submit" className="btn-primary">
           {employee ? t('employeeManagement.updateEmployee') : t('employeeManagement.addEmployeeBtn')}
         </button>
       </div>
    </form>
  );
}