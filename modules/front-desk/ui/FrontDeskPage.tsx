'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFrontDesk } from '../logic/useFrontDesk';
import { CheckIn } from '@/core/types';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  visits: number;
  lastVisit: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
}

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}

interface Company {
  id: string;
  name: string;
  tax_id: string;
  address: string;
  phone: string;
  email: string;
  contact_person?: string;
}

function CRMSection({ companies, setCompanies }: { companies: Company[], setCompanies: React.Dispatch<React.SetStateAction<Company[]>> }) {
  const { t } = useTranslation('common');
  const [crmTab, setCrmTab] = useState<'guests' | 'leads' | 'companies' | 'newsletter'>('guests');
  const [frequentGuests, setFrequentGuests] = useState<Guest[]>([
    { id: '1', name: 'Novák Jiří', email: 'jiri.novak@email.cz', phone: '+420 602 123 456', visits: 5, lastVisit: '2024-11-01' },
    { id: '2', name: 'Svobodová Eva', email: 'eva.svobodova@email.cz', phone: '+420 723 987 654', visits: 3, lastVisit: '2024-10-15' },
    { id: '3', name: 'Dvořák Petr', email: 'petr.dvorak@email.cz', phone: '+420 608 456 789', visits: 8, lastVisit: '2024-11-05' },
    { id: '4', name: 'Černá Marie', email: 'marie.cerna@email.cz', phone: '+420 733 258 147', visits: 2, lastVisit: '2024-09-20' },
  ]);
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'Procházka Tomáš', email: 'tomas.prochazka@firma.cz', phone: '+420 777 123 456', source: 'Web', status: 'new' },
    { id: '2', name: 'Kučerová Lenka', email: 'lenka.kucerova@firma.cz', phone: '+420 602 987 654', source: 'Doporučení', status: 'contacted' },
    { id: '3', name: 'Horák Martin', email: 'martin.horak@email.cz', phone: '+420 723 456 789', source: 'Facebook', status: 'qualified' },
  ]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    { id: '1', email: 'novak.jiri@email.cz', subscribedAt: '2024-09-01', status: 'active' },
    { id: '2', email: 'svobodova.eva@email.cz', subscribedAt: '2024-08-15', status: 'active' },
    { id: '3', email: 'dvorak.p@email.cz', subscribedAt: '2024-10-20', status: 'active' },
  ]);

  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null);

  const addGuest = (guest: Omit<Guest, 'id'>) => {
    const newGuest = { ...guest, id: Date.now().toString() };
    setFrequentGuests([...frequentGuests, newGuest]);
  };

  const addLead = (lead: Omit<Lead, 'id'>) => {
    const newLead = { ...lead, id: Date.now().toString() };
    setLeads([...leads, newLead]);
  };

  const addSubscriber = (subscriber: Omit<Subscriber, 'id'>) => {
    const newSubscriber = { ...subscriber, id: Date.now().toString() };
    setSubscribers([...subscribers, newSubscriber]);
  };

  const addCompany = (company: Omit<Company, 'id'>) => {
    const newCompany = { ...company, id: Date.now().toString() };
    setCompanies([...companies, newCompany]);
  };

  const updateGuest = (id: string, updated: Omit<Guest, 'id'>) => {
    setFrequentGuests(frequentGuests.map(g => g.id === id ? { ...updated, id } : g));
  };

  const updateLead = (id: string, updated: Omit<Lead, 'id'>) => {
    setLeads(leads.map(l => l.id === id ? { ...updated, id } : l));
  };

  const updateSubscriber = (id: string, updated: Omit<Subscriber, 'id'>) => {
    setSubscribers(subscribers.map(s => s.id === id ? { ...updated, id } : s));
  };

  const updateCompany = (id: string, updated: Omit<Company, 'id'>) => {
    setCompanies(companies.map(c => c.id === id ? { ...updated, id } : c));
  };

  return (
    <div>
      <div className="flex mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-1 border border-indigo-100">
        <button
          onClick={() => setCrmTab('guests')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            crmTab === 'guests' ? 'bg-white shadow-md text-indigo-700 border border-indigo-200' : 'text-indigo-600 hover:text-indigo-800'
          }`}
        >
          👤 {t('frontDesk.frequentGuests')}
        </button>
        <button
          onClick={() => setCrmTab('leads')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            crmTab === 'leads' ? 'bg-white shadow-md text-indigo-700 border border-indigo-200' : 'text-indigo-600 hover:text-indigo-800'
          }`}
        >
          🎯 {t('frontDesk.leads')}
        </button>
        <button
          onClick={() => setCrmTab('companies')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            crmTab === 'companies' ? 'bg-white shadow-md text-indigo-700 border border-indigo-200' : 'text-indigo-600 hover:text-indigo-800'
          }`}
        >
          🏢 {t('frontDesk.companies')}
        </button>
        <button
          onClick={() => setCrmTab('newsletter')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            crmTab === 'newsletter' ? 'bg-white shadow-md text-indigo-700 border border-indigo-200' : 'text-indigo-600 hover:text-indigo-800'
          }`}
        >
          📧 {t('frontDesk.newsletter')}
        </button>
      </div>

      {crmTab === 'guests' && (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">{editingGuest ? t('frontDesk.editGuest') : t('frontDesk.addNewGuest')}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              if (editingGuest) {
                updateGuest(editingGuest.id, {
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  phone: formData.get('phone') as string,
                  visits: parseInt(formData.get('visits') as string) || 0,
                  lastVisit: formData.get('lastVisit') as string,
                });
                setEditingGuest(null);
              } else {
                addGuest({
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  phone: formData.get('phone') as string,
                  visits: parseInt(formData.get('visits') as string) || 0,
                  lastVisit: formData.get('lastVisit') as string,
                });
              }
              (e.target as HTMLFormElement).reset();
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <input name="name" placeholder={t('frontDesk.name')} defaultValue={editingGuest?.name} required className="form-input" />
                <input name="email" type="email" placeholder={t('frontDesk.email')} defaultValue={editingGuest?.email} required className="form-input" />
                <input name="phone" placeholder={t('frontDesk.phone')} defaultValue={editingGuest?.phone} required className="form-input" />
                <input name="visits" type="number" placeholder={t('frontDesk.visits')} defaultValue={editingGuest?.visits} required className="form-input" />
                <input name="lastVisit" type="date" defaultValue={editingGuest?.lastVisit} required className="form-input" />
              </div>
              <button type="submit" className="btn-primary">{editingGuest ? t('frontDesk.updateGuest') : t('frontDesk.addGuest')}</button>
              {editingGuest && <button type="button" onClick={() => setEditingGuest(null)} className="btn-secondary ml-2">{t('frontDesk.cancel')}</button>}
            </form>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-medium overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-light">
                <tr>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.name')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.email')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.phone')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.visits')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.lastVisit')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {frequentGuests.map((guest) => (
                  <tr key={guest.id} className="border-t border-neutral-medium hover:bg-neutral-light/50">
                    <td className="p-4 text-foreground font-medium">{guest.name}</td>
                    <td className="p-4 text-neutral-dark">{guest.email}</td>
                    <td className="p-4 text-neutral-dark">{guest.phone}</td>
                    <td className="p-4 text-neutral-dark">{guest.visits}</td>
                    <td className="p-4 text-neutral-dark">{guest.lastVisit}</td>
                     <td className="p-4">
                       <button onClick={() => setEditingGuest(guest)} className="btn-secondary text-sm px-3 py-1">{t('frontDesk.edit')}</button>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {crmTab === 'leads' && (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">{t('frontDesk.addNewLead')}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              addLead({
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                source: formData.get('source') as string,
                status: formData.get('status') as 'new' | 'contacted' | 'qualified' | 'lost',
              });
              (e.target as HTMLFormElement).reset();
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <input name="name" placeholder={t('frontDesk.name')} required className="form-input" />
                <input name="email" type="email" placeholder={t('frontDesk.email')} required className="form-input" />
                <input name="phone" placeholder={t('frontDesk.phone')} required className="form-input" />
                <input name="source" placeholder={t('frontDesk.source')} required className="form-input" />
                <select name="status" required className="form-input">
                  <option value="new">{t('frontDesk.leadStatus.new')}</option>
                  <option value="contacted">{t('frontDesk.leadStatus.contacted')}</option>
                  <option value="qualified">{t('frontDesk.leadStatus.qualified')}</option>
                  <option value="lost">{t('frontDesk.leadStatus.lost')}</option>
                </select>
              </div>
              <button type="submit" className="btn-primary">{t('frontDesk.addLead')}</button>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-medium overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-light">
                <tr>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.name')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.email')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.phone')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.source')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.status')}</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-neutral-medium hover:bg-neutral-light/50">
                    <td className="p-4 text-foreground font-medium">{lead.name}</td>
                    <td className="p-4 text-neutral-dark">{lead.email}</td>
                    <td className="p-4 text-neutral-dark">{lead.phone}</td>
                    <td className="p-4 text-neutral-dark">{lead.source}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.status === 'new' ? 'bg-cyan-50 text-cyan-700' :
                        lead.status === 'contacted' ? 'bg-amber-50 text-amber-700' :
                        lead.status === 'qualified' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-red-50 text-red-700'
                       }`}>
                        {t(`frontDesk.leadStatus.${lead.status}`)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {crmTab === 'companies' && (
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">{editingCompany ? t('frontDesk.editCompany') : t('frontDesk.addNewCompany')}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              if (editingCompany) {
                updateCompany(editingCompany.id, {
                  name: formData.get('name') as string,
                  tax_id: formData.get('tax_id') as string,
                  address: formData.get('address') as string,
                  phone: formData.get('phone') as string,
                  email: formData.get('email') as string,
                  contact_person: formData.get('contact_person') as string || undefined,
                });
                setEditingCompany(null);
              } else {
                addCompany({
                  name: formData.get('name') as string,
                  tax_id: formData.get('tax_id') as string,
                  address: formData.get('address') as string,
                  phone: formData.get('phone') as string,
                  email: formData.get('email') as string,
                  contact_person: formData.get('contact_person') as string || undefined,
                });
              }
              (e.target as HTMLFormElement).reset();
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <input name="name" placeholder={t('frontDesk.companyName')} defaultValue={editingCompany?.name} required className="form-input" />
                <input name="tax_id" placeholder={t('frontDesk.taxId')} defaultValue={editingCompany?.tax_id} required className="form-input" />
                <input name="address" placeholder={t('frontDesk.address')} defaultValue={editingCompany?.address} required className="form-input" />
                <input name="phone" placeholder={t('frontDesk.phone')} defaultValue={editingCompany?.phone} required className="form-input" />
                <input name="email" type="email" placeholder={t('frontDesk.email')} defaultValue={editingCompany?.email} required className="form-input" />
                <input name="contact_person" placeholder={t('frontDesk.contactPerson')} defaultValue={editingCompany?.contact_person} className="form-input" />
              </div>
              <button type="submit" className="btn-primary">{editingCompany ? t('frontDesk.updateCompany') : t('frontDesk.addCompany')}</button>
              {editingCompany && <button type="button" onClick={() => setEditingCompany(null)} className="btn-secondary ml-2">{t('frontDesk.cancel')}</button>}
            </form>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-medium overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-light">
                <tr>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.name')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.taxId')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.address')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.phone')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.email')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.contactPerson')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} className="border-t border-neutral-medium hover:bg-neutral-light/50">
                    <td className="p-4 text-foreground font-medium">{company.name}</td>
                    <td className="p-4 text-neutral-dark">{company.tax_id}</td>
                    <td className="p-4 text-neutral-dark">{company.address}</td>
                    <td className="p-4 text-neutral-dark">{company.phone}</td>
                    <td className="p-4 text-neutral-dark">{company.email}</td>
                     <td className="p-4 text-neutral-dark">{company.contact_person || t('frontDesk.notApplicable')}</td>
                     <td className="p-4">
                       <button onClick={() => setEditingCompany(company)} className="btn-secondary text-sm px-3 py-1">{t('frontDesk.edit')}</button>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {crmTab === 'newsletter' && (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">{t('frontDesk.addNewSubscriber')}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              addSubscriber({
                email: formData.get('email') as string,
                subscribedAt: formData.get('subscribedAt') as string,
                status: formData.get('status') as 'active' | 'unsubscribed',
              });
              (e.target as HTMLFormElement).reset();
            }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input name="email" type="email" placeholder={t('frontDesk.email')} required className="form-input" />
                <input name="subscribedAt" type="date" required className="form-input" />
                <select name="status" required className="form-input">
                  <option value="active">{t('frontDesk.subscriberStatus.active')}</option>
                  <option value="unsubscribed">{t('frontDesk.subscriberStatus.unsubscribed')}</option>
                </select>
              </div>
              <button type="submit" className="btn-primary">{t('frontDesk.addSubscriber')}</button>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-medium overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-light">
                <tr>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.email')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.subscribedAt')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.status')}</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="border-t border-neutral-medium hover:bg-neutral-light/50">
                    <td className="p-4 text-foreground font-medium">{sub.email}</td>
                    <td className="p-4 text-neutral-dark">{sub.subscribedAt}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sub.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-700'
                       }`}>
                        {t(`frontDesk.subscriberStatus.${sub.status}`)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export function FrontDeskPage() {
  const { t } = useTranslation('common');
  const { checkIns, isLoading, checkInGuest, checkOutGuest } = useFrontDesk();
  const [activeTab, setActiveTab] = useState<'checkin' | 'crm'>('checkin');
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([
    { id: '1', name: 'Česká software s.r.o.', tax_id: '12345678', address: 'Na Příkopě 20, Praha 1', phone: '+420 222 551 111', email: 'info@ceskasoftware.cz', contact_person: 'Ing. Novák' },
    { id: '2', name: 'Moravské strojírny a.s.', tax_id: '87654321', address: 'Husova 15, Brno', phone: '+420 533 422 222', email: 'obchod@moravskestrojirny.cz', contact_person: 'Dvořák Tomáš' },
    { id: '3', name: 'Pražská dopravní a.s.', tax_id: '45678912', address: 'Vinohradská 150, Praha 3', phone: '+420 266 123 456', email: 'nakup@prazskadopravni.cz', contact_person: 'Svobodová Jana' },
    { id: '4', name: 'Sudetská energetika s.r.o.', tax_id: '78912345', address: 'Teplická 78, Ústí nad Labem', phone: '+420 475 777 888', email: 'objednavky@sudetskaenergetika.cz', contact_person: 'Procházka Martin' },
  ]);
  const [form, setForm] = useState<Omit<CheckIn, 'id' | 'status'>>({
    guest_name: '',
    address: '',
    phone: '',
    email: '',
    is_company: false,
    company_name: '',
    company_tax_id: '',
    company_address: '',
    company_phone: '',
    company_email: '',
    room_number: 0,
    check_in_date: '',
    check_out_date: '',
    notes: ''
  });

  const handleSubmitModal = () => {
    if (!form.guest_name || !form.phone) {
      alert(t('frontDesk.requiredFieldsError'));
      return;
    }
    checkInGuest.mutate(form as CheckIn);
    setShowCheckInModal(false);
    setForm({
      guest_name: '',
      address: '',
      phone: '',
      email: '',
      is_company: false,
      company_name: '',
      company_tax_id: '',
      company_address: '',
      company_phone: '',
      company_email: '',
      room_number: 0,
      check_in_date: '',
      check_out_date: '',
      notes: ''
    });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="space-y-6 p-4 lg:p-6 xl:p-8">
       <div>
         <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('frontDesk.title')}</h1>
         <p className="text-neutral-dark">{t('frontDesk.description')}</p>
       </div>

      <div className="flex mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-1 border border-indigo-100">
        <button
          onClick={() => setActiveTab('checkin')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            activeTab === 'checkin' ? 'bg-white shadow-md text-indigo-700 border border-indigo-200' : 'text-indigo-600 hover:text-indigo-800'
          }`}
         >
           🏨 {t('frontDesk.checkin')}
         </button>
         <button
           onClick={() => setActiveTab('crm')}
           className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
             activeTab === 'crm' ? 'bg-white shadow-md text-indigo-700 border border-indigo-200' : 'text-indigo-600 hover:text-indigo-800'
           }`}
         >
           👥 {t('frontDesk.crm')}
         </button>
      </div>

      {activeTab === 'checkin' && (
        <div>
           <div className="flex justify-between items-center mb-6">
             <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('frontDesk.recentCheckins')}</h2>
               <p className="text-neutral-dark">{t('frontDesk.recentCheckinsDescription')}</p>
             </div>
             <div>
               <button
                 onClick={() => setShowCheckInModal(true)}
                 className="btn-primary"
               >
                 {t('frontDesk.checkInGuest')}
               </button>
             </div>
           </div>
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-neutral-medium">
            <table className="w-full">
              <thead className="bg-neutral-light">
                <tr>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.guestName')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.room')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.checkin')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.checkout')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.status')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('frontDesk.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {checkIns?.map((checkIn) => (
                  <tr key={checkIn.id} className="border-t border-neutral-medium hover:bg-neutral-light/50">
                    <td className="p-4 text-foreground font-medium">{checkIn.guest_name}</td>
                    <td className="p-4 text-neutral-dark">{checkIn.room_number || t('frontDesk.notApplicable')}</td>
                    <td className="p-4 text-neutral-dark">{checkIn.check_in_date}</td>
                    <td className="p-4 text-neutral-dark">{checkIn.check_out_date || t('frontDesk.notApplicable')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        checkIn.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {t(`frontDesk.checkinStatus.${checkIn.status}`)}
                      </span>
                    </td>
                    <td className="p-4">
                      {checkIn.status === 'active' && (
                        <button 
                          onClick={() => checkOutGuest.mutate(checkIn.id)}
                          className="btn-secondary text-sm px-3 py-1"
                        >
                          {t('frontDesk.checkOut')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'crm' && (
        <CRMSection companies={companies} setCompanies={setCompanies} />
      )}

      {/* Check-in Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 sm:p-6 lg:p-8 border-b border-neutral-medium flex-shrink-0">
              <div className="flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground">{t('frontDesk.checkInGuest')}</h3>
                <button
                  onClick={() => setShowCheckInModal(false)}
                  className="text-neutral-dark hover:text-foreground text-2xl p-2 hover:bg-neutral-light rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
             <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1">
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mb-4 sm:mb-6">
                 <div>
                   <label className="form-label">{t('frontDesk.guestName')} *</label>
                   <input
                     type="text"
                     value={form.guest_name}
                     onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
                     className="form-input"
                     required
                   />
                 </div>
                 <div>
                   <label className="form-label">{t('frontDesk.address')}</label>
                   <input
                     type="text"
                     value={form.address}
                     onChange={(e) => setForm({ ...form, address: e.target.value })}
                     className="form-input"
                   />
                 </div>
                 <div>
                   <label className="form-label">{t('frontDesk.phone')} *</label>
                   <input
                     type="tel"
                     value={form.phone}
                     onChange={(e) => setForm({ ...form, phone: e.target.value })}
                     className="form-input"
                     required
                   />
                 </div>
                 <div>
                   <label className="form-label">{t('frontDesk.email')}</label>
                   <input
                     type="email"
                     value={form.email}
                     onChange={(e) => setForm({ ...form, email: e.target.value })}
                     className="form-input"
                   />
                 </div>
                 <div>
                   <label className="form-label">{t('frontDesk.checkoutDate')}</label>
                   <input
                     type="date"
                     value={form.check_out_date || ''}
                     onChange={(e) => setForm({ ...form, check_out_date: e.target.value })}
                     className="form-input"
                   />
                 </div>
               </div>
               <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                 <label className="flex items-center">
                   <input
                     type="checkbox"
                     checked={form.is_company}
                     onChange={(e) => setForm({ ...form, is_company: e.target.checked })}
                     className="mr-2"
                   />
                   {t('frontDesk.companyBooking')}
                 </label>
               </div>
               {form.is_company && (
                 <div className="mb-4 sm:mb-6">
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 bg-neutral-light p-4 sm:p-6 rounded-lg border border-neutral-medium">
                     <div>
                       <label className="form-label">{t('frontDesk.companyName')} *</label>
                       <input
                         type="text"
                         value={form.company_name}
                         onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                         className="form-input"
                         required={form.is_company}
                       />
                     </div>
                     <div>
                       <label className="form-label">{t('frontDesk.taxId')}</label>
                       <input
                         type="text"
                         value={form.company_tax_id}
                         onChange={(e) => setForm({ ...form, company_tax_id: e.target.value })}
                         className="form-input"
                       />
                     </div>
                     <div>
                       <label className="form-label">{t('frontDesk.companyAddress')}</label>
                       <input
                         type="text"
                         value={form.company_address}
                         onChange={(e) => setForm({ ...form, company_address: e.target.value })}
                         className="form-input"
                       />
                     </div>
                     <div>
                       <label className="form-label">{t('frontDesk.companyPhone')}</label>
                       <input
                         type="tel"
                         value={form.company_phone}
                         onChange={(e) => setForm({ ...form, company_phone: e.target.value })}
                         className="form-input"
                       />
                     </div>
                     <div>
                       <label className="form-label">{t('frontDesk.companyEmail')}</label>
                       <input
                         type="email"
                         value={form.company_email}
                         onChange={(e) => setForm({ ...form, company_email: e.target.value })}
                         className="form-input"
                       />
                     </div>
                   </div>
                </div>
              )}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                 <div>
                   <label className="form-label">{t('frontDesk.roomNumber')}</label>
                   <input
                     type="number"
                     value={form.room_number || ''}
                     onChange={(e) => setForm({ ...form, room_number: parseInt(e.target.value) || 0 })}
                     className="form-input"
                     placeholder={t('frontDesk.roomNumberPlaceholder')}
                   />
                 </div>
               </div>
               <div className="mb-6">
                 <label className="form-label">{t('frontDesk.notes')}</label>
                 <textarea
                   placeholder={t('frontDesk.notesPlaceholder')}
                   value={form.notes || ''}
                   onChange={(e) => setForm({ ...form, notes: e.target.value })}
                   className="form-input w-full h-24 resize-none"
                 />
               </div>
               <div className="flex justify-end gap-4">
                 <button
                   onClick={() => setShowCheckInModal(false)}
                   className="btn-secondary px-6 py-2"
                 >
                   {t('frontDesk.cancel')}
                 </button>
                 <button
                   onClick={handleSubmitModal}
                   className="btn-primary px-6 py-2"
                 >
                   {t('frontDesk.checkInGuest')}
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}