'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePackagesEvents, Package, Event, Partner, PartnerOffer, PartnerReservation } from '../logic/usePackagesEvents';
import { useCurrency } from '@/core/hooks/useCurrency';
import { FiPackage, FiCalendar, FiPlus, FiEdit, FiTrash, FiX, FiUsers, FiUser, FiClock, FiMail, FiPhone, FiMapPin, FiDollarSign } from 'react-icons/fi';

function PackageCard({ pkg, onEdit, onDelete, onBook }: { 
  pkg: Package; 
  onEdit: () => void; 
  onDelete: () => void;
  onBook: () => void;
}) {
  const { t } = useTranslation('common');
  const { partnerOffers, partners } = usePackagesEvents();
  const { formatCurrency } = useCurrency();
  
  const partnerOffersList = pkg.partner_offers
    .filter(po => po.included_in_package)
    .map(po => {
      const offer = partnerOffers?.find(o => o.id === po.partner_offer_id);
      const partner = partners?.find(p => p.id === offer?.partner_id);
      return { offer, partner, auto_book: po.auto_book };
    })
    .filter(item => item.offer && item.partner);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{pkg.name}</h3>
          <p className="text-gray-600 text-sm">{pkg.description}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-blue-600 hover:text-blue-800">
            <FiEdit size={18} />
          </button>
          <button onClick={onDelete} className="text-red-600 hover:text-red-800">
            <FiTrash size={18} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">{t('packagesEvents.price')}</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(pkg.price)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">{t('packagesEvents.duration')}</p>
          <p className="text-xl font-bold">{pkg.duration} {t('packagesEvents.nights')}</p>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">{t('packagesEvents.includes')}:</p>
        <div className="flex flex-wrap gap-1">
          {pkg.includes.map((item, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {item}
            </span>
          ))}
        </div>
      </div>
      
      {partnerOffersList.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">{t('packagesEvents.partnerOffers')}:</p>
          <div className="space-y-2">
            {partnerOffersList.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs bg-purple-50 p-2 rounded">
                <div>
                  <span className="font-medium">{item.offer!.name}</span>
                  <span className="text-gray-600 ml-1">({item.partner!.name})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">{formatCurrency(item.offer!.price)}</span>
                  {item.auto_book && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{t('packagesEvents.autoBook')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span>{t('packagesEvents.maxGuests')}: {pkg.max_guests}</span>
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            pkg.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {t(`packagesEvents.${pkg.status}`)}
          </span>
        </div>
        <button
          onClick={onBook}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium"
          disabled={pkg.status !== 'active'}
        >
          {t('packagesEvents.bookPackage')}
        </button>
      </div>
    </div>
  );
}

function EventCard({ event, onEdit, onDelete }: { event: Event; onEdit: () => void; onDelete: () => void }) {
  const { t } = useTranslation('common');
  const { formatCurrency } = useCurrency();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{event.name}</h3>
          <p className="text-gray-600 text-sm">{event.description}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-blue-600 hover:text-blue-800">
            <FiEdit size={18} />
          </button>
          <button onClick={onDelete} className="text-red-600 hover:text-red-800">
            <FiTrash size={18} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">{t('packagesEvents.date')}</p>
          <p className="text-lg font-bold">{new Date(event.date).toLocaleDateString('cs-CZ')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">{t('packagesEvents.time')}</p>
          <p className="text-lg font-bold">{event.start_time} - {event.end_time}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">{t('packagesEvents.capacity')}</p>
          <p className="text-xl font-bold">{event.capacity}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">{t('packagesEvents.price')}</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(event.price)}</p>
        </div>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span className={`px-2 py-1 rounded text-xs ${
          event.type === 'wedding' ? 'bg-pink-100 text-pink-800' :
          event.type === 'conference' ? 'bg-blue-100 text-blue-800' :
          event.type === 'corporate' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {t(`packagesEvents.${event.type}`)}
        </span>
        <span className={`px-2 py-1 rounded text-xs ${
          event.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
          event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
          event.status === 'completed' ? 'bg-blue-100 text-blue-800' :
          'bg-red-100 text-red-800'
        }`}>
          {t(`packagesEvents.${event.status}`)}
        </span>
      </div>
    </div>
  );
}

function PackageForm({ 
  package: pkg, 
  onSave, 
  onCancel 
}: { 
  package: Package | null; 
  onSave: (pkg: Omit<Package, 'id'>) => void; 
  onCancel: () => void; 
}) {
  const { t } = useTranslation('common');
  const { partnerOffers, partners } = usePackagesEvents();
  const { formatCurrency } = useCurrency();
  
  const [formData, setFormData] = useState({
    name: pkg?.name || '',
    description: pkg?.description || '',
    price: pkg?.price || 0,
    duration: pkg?.duration || 1,
    includes: pkg?.includes || [],
    partner_offers: pkg?.partner_offers || [],
    available_from: pkg?.available_from || '',
    available_to: pkg?.available_to || '',
    max_guests: pkg?.max_guests || 1,
    status: pkg?.status || 'active' as 'active' | 'inactive'
  });

  const [newInclude, setNewInclude] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addInclude = () => {
    if (newInclude.trim() && !formData.includes.includes(newInclude.trim())) {
      setFormData(prev => ({
        ...prev,
        includes: [...prev.includes, newInclude.trim()]
      }));
      setNewInclude('');
    }
  };

  const removeInclude = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">{t('packagesEvents.packageName')} *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">{t('packagesEvents.price')} *</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">{t('packagesEvents.duration')} ({t('packagesEvents.nights')}) *</label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">{t('packagesEvents.maxGuests')} *</label>
          <input
            type="number"
            value={formData.max_guests}
            onChange={(e) => setFormData(prev => ({ ...prev, max_guests: parseInt(e.target.value) || 1 }))}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">{t('packagesEvents.availableFrom')} *</label>
          <input
            type="date"
            value={formData.available_from}
            onChange={(e) => setFormData(prev => ({ ...prev, available_from: e.target.value }))}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">{t('packagesEvents.availableTo')} *</label>
          <input
            type="date"
            value={formData.available_to}
            onChange={(e) => setFormData(prev => ({ ...prev, available_to: e.target.value }))}
            className="form-input"
            required
          />
        </div>
      </div>

      <div>
        <label className="form-label">{t('packagesEvents.description')} *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="form-input w-full h-24 resize-none"
          required
        />
      </div>

      <div>
        <label className="form-label">{t('packagesEvents.includes')}</label>
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={newInclude}
            onChange={(e) => setNewInclude(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
            placeholder={t('packagesEvents.addItem')}
            className="form-input flex-1"
          />
          <button
            type="button"
            onClick={addInclude}
            className="btn-secondary"
          >
            {t('packagesEvents.add')}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.includes.map((item, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center space-x-2"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeInclude(index)}
                className="text-primary/60 hover:text-primary"
              >
                <FiX size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

       <div>
         <label className="form-label">{t('packagesEvents.partnerOffers')}</label>
         <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
           {partnerOffers?.map(offer => {
             const partner = partners?.find(p => p.id === offer.partner_id);
             const currentOffer = formData.partner_offers.find(po => po.partner_offer_id === offer.id);
             
             return (
               <div key={offer.id} className="flex items-center justify-between p-3 bg-white rounded border">
                 <div className="flex-1">
                   <div className="flex items-center">
                     <input
                       type="checkbox"
                       checked={currentOffer?.included_in_package || false}
                       onChange={(e) => {
                         if (e.target.checked) {
                           setFormData(prev => ({
                             ...prev,
                             partner_offers: [...prev.partner_offers.filter(po => po.partner_offer_id !== offer.id), {
                               partner_offer_id: offer.id,
                               included_in_package: true,
                               auto_book: false
                             }]
                           }));
                         } else {
                           setFormData(prev => ({
                             ...prev,
                             partner_offers: prev.partner_offers.filter(po => po.partner_offer_id !== offer.id)
                           }));
                         }
                       }}
                       className="mr-3"
                     />
                     <div>
                       <p className="font-medium">{offer.name}</p>
                        <p className="text-sm text-gray-600">{partner?.name} - {formatCurrency(offer.price)} ({offer.duration_minutes}{t('packagesEvents.minutes')})</p>
                     </div>
                   </div>
                 </div>
                 {currentOffer?.included_in_package && (
                   <div className="flex items-center ml-4">
                     <input
                       type="checkbox"
                       checked={currentOffer.auto_book}
                       onChange={(e) => {
                         setFormData(prev => ({
                           ...prev,
                           partner_offers: prev.partner_offers.map(po =>
                             po.partner_offer_id === offer.id
                               ? { ...po, auto_book: e.target.checked }
                               : po
                           )
                         }));
                       }}
                       className="mr-2"
                     />
                     <label className="text-sm">{t('packagesEvents.autoBook')}</label>
                   </div>
                 )}
               </div>
             );
           })}
         </div>
         <p className="text-xs text-gray-500 mt-2">
           {t('packagesEvents.selectPartnerOffers')}
         </p>
       </div>

       <div>
         <label className="form-label">{t('packagesEvents.status')} *</label>
         <select
           value={formData.status}
           onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
           className="form-input"
           required
         >
           <option value="active">{t('packagesEvents.active')}</option>
           <option value="inactive">{t('packagesEvents.inactive')}</option>
         </select>
       </div>

       <div className="flex justify-end space-x-4">
         <button type="button" onClick={onCancel} className="btn-secondary">
           {t('packagesEvents.cancel')}
         </button>
         <button type="submit" className="btn-primary">
           {pkg ? t('packagesEvents.updatePackage') : t('packagesEvents.createPackage')}
         </button>
       </div>
    </form>
  );
}

function EventForm({ 
  event, 
  onSave, 
  onCancel 
}: { 
  event: Event | null; 
  onSave: (event: Omit<Event, 'id'>) => void; 
  onCancel: () => void; 
}) {
  const { t } = useTranslation('common');
  const { formatCurrency } = useCurrency();
  
  const [formData, setFormData] = useState({
    name: event?.name || '',
    description: event?.description || '',
    date: event?.date || '',
    start_time: event?.start_time || '',
    end_time: event?.end_time || '',
    capacity: event?.capacity || 1,
    price: event?.price || 0,
    type: event?.type || 'other' as 'conference' | 'wedding' | 'party' | 'corporate' | 'other',
    status: event?.status || 'upcoming' as 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">{t('packagesEvents.eventName')} *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">{t('packagesEvents.eventType')} *</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'conference' | 'wedding' | 'party' | 'corporate' | 'other' }))}
            className="form-input"
            required
          >
            <option value="conference">{t('packagesEvents.conference')}</option>
            <option value="wedding">{t('packagesEvents.wedding')}</option>
            <option value="party">{t('packagesEvents.party')}</option>
            <option value="corporate">{t('packagesEvents.corporate')}</option>
            <option value="other">{t('packagesEvents.other')}</option>
          </select>
        </div>
        <div>
          <label className="form-label">{t('packagesEvents.date')} *</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">{t('packagesEvents.price')} *</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">{t('packagesEvents.startTime')} *</label>
          <input
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">{t('packagesEvents.endTime')} *</label>
          <input
            type="time"
            value={formData.end_time}
            onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">{t('packagesEvents.capacity')} *</label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">{t('packagesEvents.status')} *</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'upcoming' | 'ongoing' | 'completed' | 'cancelled' }))}
            className="form-input"
            required
          >
            <option value="upcoming">{t('packagesEvents.upcoming')}</option>
            <option value="ongoing">{t('packagesEvents.ongoing')}</option>
            <option value="completed">{t('packagesEvents.completed')}</option>
            <option value="cancelled">{t('packagesEvents.cancelled')}</option>
          </select>
        </div>
      </div>

      <div>
        <label className="form-label">{t('packagesEvents.description')} *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="form-input w-full h-24 resize-none"
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="btn-secondary">
          {t('packagesEvents.cancel')}
        </button>
        <button type="submit" className="btn-primary">
          {event ? t('packagesEvents.updateEvent') : t('packagesEvents.createEvent')}
        </button>
      </div>
    </form>
  );
}

function PartnerCard({ partner, onEdit, onDelete }: { partner: Partner; onEdit: () => void; onDelete: () => void }) {
  const { t } = useTranslation('common');
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{partner.name}</h3>
          <p className="text-gray-600 text-sm">{partner.description}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-blue-600 hover:text-blue-800">
            <FiEdit size={18} />
          </button>
          <button onClick={onDelete} className="text-red-600 hover:text-red-800">
            <FiTrash size={18} />
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <FiUsers className="mr-2" />
          <span className="capitalize">{t(`packagesEvents.${partner.category}`)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiMail className="mr-2" />
          <span>{partner.contact_email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiPhone className="mr-2" />
          <span>{partner.contact_phone}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiMapPin className="mr-2" />
          <span>{partner.address}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiDollarSign className="mr-2" />
          <span>{t('packagesEvents.commissionRate')}: {partner.commission_rate}%</span>
        </div>
      </div>
      <div className="mt-4">
        <span className={`px-2 py-1 rounded text-xs ${
          partner.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {t(`packagesEvents.${partner.status}`)}
        </span>
      </div>
    </div>
  );
}

function PartnerOfferCard({ offer, partner, onEdit, onDelete }: { 
  offer: PartnerOffer; 
  partner: Partner; 
  onEdit: () => void; 
  onDelete: () => void; 
}) {
  const { t } = useTranslation('common');
  const { formatCurrency } = useCurrency();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{offer.name}</h3>
          <p className="text-gray-600 text-sm">{offer.description}</p>
          <p className="text-xs text-gray-500 mt-1">{t('packagesEvents.partner')}: {partner.name}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-blue-600 hover:text-blue-800">
            <FiEdit size={18} />
          </button>
          <button onClick={onDelete} className="text-red-600 hover:text-red-800">
            <FiTrash size={18} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">{t('packagesEvents.price')}</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(offer.price)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">{t('packagesEvents.duration')}</p>
          <p className="text-xl font-bold">{offer.duration_minutes} {t('packagesEvents.minutes')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">{t('packagesEvents.capacity')}</p>
          <p className="text-xl font-bold">{offer.capacity_per_slot} {t('packagesEvents.people')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">{t('packagesEvents.bookingWindow')}</p>
          <p className="text-xl font-bold">{offer.booking_window_days} {t('packagesEvents.days')}</p>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">{t('packagesEvents.availability')}:</p>
        <div className="text-sm text-gray-700">
          <p>{t('packagesEvents.daysOfWeek')}: {offer.availability.days_of_week.map(day => t(`packagesEvents.${['sun','mon','tue','wed','thu','fri','sat'][day]}`)).join(', ')}</p>
          <p>{t('packagesEvents.hours')}: {offer.availability.start_time} - {offer.availability.end_time}</p>
        </div>
      </div>
      <div className="flex justify-between">
        <span className={`px-2 py-1 rounded text-xs ${
          offer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {t(`packagesEvents.${offer.status}`)}
        </span>
      </div>
    </div>
  );
}

function PartnerReservationCard({ reservation, offer, partner }: { 
  reservation: PartnerReservation; 
  offer: PartnerOffer; 
  partner: Partner; 
}) {
  const { t } = useTranslation('common');
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{offer.name}</h3>
          <p className="text-gray-600 text-sm">{partner.name}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs ${
          reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
          reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          reservation.status === 'rejected' ? 'bg-red-100 text-red-800' :
          reservation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {t(`packagesEvents.${reservation.status}`)}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">{t('packagesEvents.guestName')}:</span>
          <span className="font-medium">{reservation.guest_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">{t('packagesEvents.date')} & {t('packagesEvents.time')}:</span>
          <span className="font-medium">{reservation.scheduled_date} at {reservation.scheduled_time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">{t('packagesEvents.people')}:</span>
          <span className="font-medium">{reservation.number_of_people}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">{t('packagesEvents.contact')}:</span>
          <span className="font-medium">{reservation.guest_email}</span>
        </div>
        {reservation.partner_confirmation_code && (
          <div className="flex justify-between">
            <span className="text-gray-600">{t('packagesEvents.confirmationCode')}:</span>
            <span className="font-medium">{reservation.partner_confirmation_code}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function PartnerForm({ 
  partner, 
  onSave, 
  onCancel 
}: { 
  partner: Partner | null; 
  onSave: (partner: Omit<Partner, 'id'>) => void; 
  onCancel: () => void; 
}) {
  const { t } = useTranslation('common');
  
  const [formData, setFormData] = useState({
    name: partner?.name || '',
    description: partner?.description || '',
    category: partner?.category || 'other' as Partner['category'],
    contact_email: partner?.contact_email || '',
    contact_phone: partner?.contact_phone || '',
    address: partner?.address || '',
    commission_rate: partner?.commission_rate || 0,
    status: partner?.status || 'active' as Partner['status']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">{t('packagesEvents.partnerName')} *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">{t('packagesEvents.partnerCategory')} *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Partner['category'] }))}
            className="form-input"
            required
          >
            <option value="restaurant">{t('packagesEvents.restaurant')}</option>
            <option value="winery">{t('packagesEvents.winery')}</option>
            <option value="spa">{t('packagesEvents.spa')}</option>
            <option value="activity">{t('packagesEvents.activity')}</option>
            <option value="transport">{t('packagesEvents.transport')}</option>
            <option value="entertainment">{t('packagesEvents.entertainment')}</option>
            <option value="other">{t('packagesEvents.other')}</option>
          </select>
        </div>
        <div>
          <label className="form-label">{t('packagesEvents.contactEmail')} *</label>
          <input
            type="email"
            value={formData.contact_email}
            onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">{t('packagesEvents.contactPhone')} *</label>
          <input
            type="tel"
            value={formData.contact_phone}
            onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">{t('packagesEvents.commissionRate')} *</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.commission_rate}
            onChange={(e) => setFormData(prev => ({ ...prev, commission_rate: parseFloat(e.target.value) || 0 }))}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">{t('packagesEvents.status')} *</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Partner['status'] }))}
            className="form-input"
            required
          >
            <option value="active">{t('packagesEvents.active')}</option>
            <option value="inactive">{t('packagesEvents.inactive')}</option>
          </select>
        </div>
      </div>

      <div>
        <label className="form-label">{t('packagesEvents.address')} *</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          className="form-input"
          required
        />
      </div>

      <div>
        <label className="form-label">{t('packagesEvents.description')} *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="form-input w-full h-24 resize-none"
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="btn-secondary">
          {t('packagesEvents.cancel')}
        </button>
        <button type="submit" className="btn-primary">
          {partner ? t('packagesEvents.updatePartner') : t('packagesEvents.createPartner')}
        </button>
      </div>
    </form>
  );
}

export function PackagesEventsPage() {
  const { t } = useTranslation('common');
  const { formatCurrency } = useCurrency();

  // Add currency change listener for auto-refresh
  useEffect(() => {
    const handleCurrencyChange = () => {
      window.location.reload();
    };
    window.addEventListener('currencyChanged', handleCurrencyChange);
    return () => window.removeEventListener('currencyChanged', handleCurrencyChange);
  }, []);
  const { 
    packages, 
    events, 
    partners, 
    partnerOffers, 
    partnerReservations,
    isLoading, 
    createPackage, 
    createEvent, 
    updatePackage, 
    updateEvent, 
    deletePackage, 
    deleteEvent,
    createPartner,
    updatePartner,
    deletePartner,
    createPartnerOffer,
    updatePartnerOffer,
    deletePartnerOffer,
    updatePartnerReservation,
    bookPackagePartnerOffers
  } = usePackagesEvents();
  const [activeTab, setActiveTab] = useState<'packages' | 'events' | 'partners' | 'offers' | 'reservations'>('packages');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Package | Event | Partner | PartnerOffer | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [bookingForm, setBookingForm] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    scheduledDate: '',
    numberOfPeople: 1
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">{t('packagesEvents.title')}</h1>

      {/* Tabs */}
      <div className="flex mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-1 border border-indigo-100">
        <button
          onClick={() => setActiveTab('packages')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            activeTab === 'packages' ? 'bg-white shadow-md text-indigo-700 border border-indigo-200' : 'text-indigo-600 hover:text-indigo-800'
          }`}
        >
          <FiPackage className="inline mr-2" />
          {t('packagesEvents.packages')}
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            activeTab === 'events' ? 'bg-white shadow-md text-indigo-700 border border-indigo-200' : 'text-indigo-600 hover:text-indigo-800'
          }`}
        >
          <FiCalendar className="inline mr-2" />
          {t('packagesEvents.events')}
        </button>
        <button
          onClick={() => setActiveTab('partners')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            activeTab === 'partners' ? 'bg-white shadow-md text-indigo-700 border border-indigo-200' : 'text-indigo-600 hover:text-indigo-800'
          }`}
        >
          <FiUser className="inline mr-2" />
          {t('packagesEvents.partners')}
        </button>
        <button
          onClick={() => setActiveTab('offers')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            activeTab === 'offers' ? 'bg-white shadow-md text-indigo-700 border border-indigo-200' : 'text-indigo-600 hover:text-indigo-800'
          }`}
        >
          <FiPackage className="inline mr-2" />
          {t('packagesEvents.offers')}
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            activeTab === 'reservations' ? 'bg-white shadow-md text-indigo-700 border border-indigo-200' : 'text-indigo-600 hover:text-indigo-800'
          }`}
        >
          <FiClock className="inline mr-2" />
          {t('packagesEvents.reservations')}
        </button>
      </div>

       {/* Add Button */}
       <div className="flex justify-end">
         <button
           onClick={() => setShowForm(true)}
           className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center"
         >
           <FiPlus className="mr-2" />
           {activeTab === 'packages' ? t('packagesEvents.addPackage') : 
            activeTab === 'events' ? t('packagesEvents.addEvent') : 
            activeTab === 'partners' ? t('packagesEvents.addPartner') : 
            t('packagesEvents.addOffer')}
         </button>
       </div>

      {/* Content */}
       {activeTab === 'packages' && (
         <div>
           <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('packagesEvents.hotelPackages')}</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {packages?.map(pkg => (
               <PackageCard
                 key={pkg.id}
                 pkg={pkg}
                 onEdit={() => {
                   setEditingItem(pkg);
                   setShowForm(true);
                 }}
                 onDelete={() => deletePackage.mutate(pkg.id)}
                 onBook={() => {
                   setSelectedPackage(pkg);
                   setShowBookingForm(true);
                 }}
               />
             ))}
           </div>
         </div>
       )}

       {activeTab === 'events' && (
         <div>
           <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('packagesEvents.events')}</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {events?.map(event => (
               <EventCard
                 key={event.id}
                 event={event}
                 onEdit={() => {
                   setEditingItem(event);
                   setShowForm(true);
                 }}
                 onDelete={() => deleteEvent.mutate(event.id)}
               />
             ))}
           </div>
         </div>
       )}

       {activeTab === 'partners' && (
         <div>
           <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('packagesEvents.partners')}</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {partners?.map(partner => (
               <PartnerCard
                 key={partner.id}
                 partner={partner}
                 onEdit={() => {
                   setEditingItem(partner);
                   setShowForm(true);
                 }}
                 onDelete={() => deletePartner.mutate(partner.id)}
               />
             ))}
           </div>
         </div>
       )}

       {activeTab === 'offers' && (
         <div>
           <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('packagesEvents.partnerOffers')}</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {partnerOffers?.map(offer => {
               const partner = partners?.find(p => p.id === offer.partner_id);
               return (
                 <PartnerOfferCard
                   key={offer.id}
                   offer={offer}
                   partner={partner!}
                   onEdit={() => {
                     setEditingItem(offer);
                     setShowForm(true);
                   }}
                   onDelete={() => deletePartnerOffer.mutate(offer.id)}
                 />
               );
             })}
           </div>
         </div>
       )}

       {activeTab === 'reservations' && (
         <div>
           <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('packagesEvents.partnerReservations')}</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {partnerReservations?.map(reservation => {
               const offer = partnerOffers?.find(o => o.id === reservation.partner_offer_id);
               const partner = partners?.find(p => p.id === offer?.partner_id);
               return offer && partner ? (
                 <PartnerReservationCard
                   key={reservation.id}
                   reservation={reservation}
                   offer={offer}
                   partner={partner}
                 />
               ) : null;
             })}
           </div>
         </div>
       )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-medium">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-semibold text-foreground">
                    {editingItem ? t('employeeManagement.edit') : t('employeeManagement.add')} {activeTab === 'packages' ? t('packagesEvents.package') : t('packagesEvents.event')}
                  </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                  }}
                  className="text-neutral-dark hover:text-foreground text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
             <div className="p-6">
               {activeTab === 'packages' ? (
                 <PackageForm
                   package={editingItem as Package | null}
                   onSave={(pkg) => {
                     if (editingItem) {
                       updatePackage.mutate({ ...pkg, id: (editingItem as Package).id });
                     } else {
                       createPackage.mutate(pkg);
                     }
                     setShowForm(false);
                     setEditingItem(null);
                   }}
                   onCancel={() => {
                     setShowForm(false);
                     setEditingItem(null);
                   }}
                 />
               ) : activeTab === 'events' ? (
                 <EventForm
                   event={editingItem as Event | null}
                   onSave={(event) => {
                     if (editingItem) {
                       updateEvent.mutate({ ...event, id: (editingItem as Event).id });
                     } else {
                       createEvent.mutate(event);
                     }
                     setShowForm(false);
                     setEditingItem(null);
                   }}
                   onCancel={() => {
                     setShowForm(false);
                     setEditingItem(null);
                   }}
                 />
               ) : activeTab === 'partners' ? (
                 <PartnerForm
                   partner={editingItem as Partner | null}
                   onSave={(partner) => {
                     if (editingItem) {
                       updatePartner.mutate({ ...partner, id: (editingItem as Partner).id });
                     } else {
                       createPartner.mutate(partner);
                     }
                     setShowForm(false);
                     setEditingItem(null);
                   }}
                   onCancel={() => {
                     setShowForm(false);
                     setEditingItem(null);
                   }}
                 />
               ) : (
                 <div className="text-center py-8">
                   <p className="text-gray-600">{t('packagesEvents.offerFormComingSoon')}</p>
                   <button
                     onClick={() => {
                       setShowForm(false);
                       setEditingItem(null);
                     }}
                     className="mt-4 btn-secondary"
                   >
                     {t('packagesEvents.close')}
                   </button>
                 </div>
               )}
             </div>
           </div>
         </div>
       )}

       {/* Booking Form Modal */}
       {showBookingForm && selectedPackage && (
         <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-neutral-medium">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-foreground">
                    {t('packagesEvents.bookPackage')} {selectedPackage.name}
                  </h3>
                  <button
                    onClick={() => {
                      setShowBookingForm(false);
                      setSelectedPackage(null);
                      setBookingForm({
                        guestName: '',
                        guestEmail: '',
                        guestPhone: '',
                        scheduledDate: '',
                        numberOfPeople: 1
                      });
                    }}
                    className="text-neutral-dark hover:text-foreground text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
                  <h4 className="font-semibold text-indigo-800 mb-2">{t('packagesEvents.packageDetails')}</h4>
                  <p className="text-sm text-indigo-700">{selectedPackage.description}</p>
                  <p className="text-lg font-bold text-indigo-800 mt-2">{formatCurrency(selectedPackage.price)} for {selectedPackage.duration} {t('packagesEvents.nights')}</p>
                  
                  {selectedPackage.partner_offers.filter(po => po.included_in_package && po.auto_book).length > 0 && (
                    <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
                      <p className="text-sm font-medium text-green-800">
                        🎉 {t('packagesEvents.autoBookingIncluded')}
                      </p>
                      <ul className="text-xs text-green-700 mt-1">
                        {selectedPackage.partner_offers
                          .filter(po => po.included_in_package && po.auto_book)
                          .map(po => {
                            const offer = partnerOffers?.find(o => o.id === po.partner_offer_id);
                            const partner = partners?.find(p => p.id === offer?.partner_id);
                            return offer && partner ? (
                              <li key={po.partner_offer_id}>• {offer.name} ({partner.name})</li>
                            ) : null;
                          })}
                      </ul>
                    </div>
                  )}
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  bookPackagePartnerOffers.mutate({
                    packageId: selectedPackage.id,
                    guestName: bookingForm.guestName,
                    guestEmail: bookingForm.guestEmail,
                    guestPhone: bookingForm.guestPhone,
                    scheduledDate: bookingForm.scheduledDate,
                    numberOfPeople: bookingForm.numberOfPeople
                  }, {
                    onSuccess: () => {
                      setShowBookingForm(false);
                      setSelectedPackage(null);
                      setBookingForm({
                        guestName: '',
                        guestEmail: '',
                        guestPhone: '',
                        scheduledDate: '',
                        numberOfPeople: 1
                      });
                      alert(t('packagesEvents.packageBookedSuccessfully'));
                    }
                  });
                }} className="space-y-4">
                  <div>
                    <label className="form-label">{t('packagesEvents.guestName')} *</label>
                    <input
                      type="text"
                      value={bookingForm.guestName}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, guestName: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">{t('packagesEvents.guestEmail')} *</label>
                    <input
                      type="email"
                      value={bookingForm.guestEmail}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, guestEmail: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">{t('packagesEvents.guestPhone')} *</label>
                    <input
                      type="tel"
                      value={bookingForm.guestPhone}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, guestPhone: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">{t('packagesEvents.checkInDate')} *</label>
                    <input
                      type="date"
                      value={bookingForm.scheduledDate}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">{t('packagesEvents.numberOfPeople')} *</label>
                    <input
                      type="number"
                      min="1"
                      max={selectedPackage.max_guests}
                      value={bookingForm.numberOfPeople}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, numberOfPeople: parseInt(e.target.value) || 1 }))}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBookingForm(false);
                        setSelectedPackage(null);
                        setBookingForm({
                          guestName: '',
                          guestEmail: '',
                          guestPhone: '',
                          scheduledDate: '',
                          numberOfPeople: 1
                        });
                      }}
                      className="btn-secondary"
                    >
                      {t('packagesEvents.cancel')}
                    </button>
                    <button type="submit" className="btn-primary">
                      {t('packagesEvents.bookPackage')}
                    </button>
                  </div>
                </form>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 }