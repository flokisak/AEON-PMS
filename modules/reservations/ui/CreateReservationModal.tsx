'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReservations } from '../logic/useReservations';
import { Reservation } from '../../../core/types';

interface CreateReservationModalProps {
  roomNumber: number;
  checkIn: string;
  checkOut: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateReservationModal({ roomNumber, checkIn, checkOut, onClose, onSuccess }: CreateReservationModalProps) {
  const { t } = useTranslation('common');
  const { createReservation } = useReservations();

  const [form, setForm] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    room_type: '',
    status: 'booked' as Reservation['status'],
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if check-in date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInDate = new Date(checkIn);
    checkInDate.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      alert('Cannot create reservations in the past. Please select a future date.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createReservation.mutateAsync({
        guest_name: form.guest_name,
        guest_email: form.guest_email,
        guest_phone: form.guest_phone,
        room_number: roomNumber,
        check_in: checkIn,
        check_out: checkOut,
        status: form.status,
        room_type: form.room_type,
        notes: form.notes
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create reservation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-medium">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-foreground">
              {t('reservations.createReservation')} - {t('reservations.room')} {roomNumber}
            </h3>
            <button
              onClick={onClose}
              className="text-neutral-dark hover:text-foreground text-2xl"
            >
              ×
            </button>
          </div>
          <div className="mt-2 text-sm text-neutral-dark">
            {t('reservations.checkIn')}: {new Date(checkIn).toLocaleDateString()} |
            {t('reservations.checkOut')}: {new Date(checkOut).toLocaleDateString()}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">{t('reservations.guestName')} *</label>
              <input
                type="text"
                value={form.guest_name}
                onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
                className="form-input"
                required
                placeholder={t('reservations.enterGuestName')}
              />
            </div>
            <div>
              <label className="form-label">{t('reservations.email')}</label>
              <input
                type="email"
                value={form.guest_email}
                onChange={(e) => setForm({ ...form, guest_email: e.target.value })}
                className="form-input"
                placeholder="guest@email.com"
              />
            </div>
            <div>
              <label className="form-label">{t('reservations.phone')}</label>
              <input
                type="tel"
                value={form.guest_phone}
                onChange={(e) => setForm({ ...form, guest_phone: e.target.value })}
                className="form-input"
                placeholder="+420 123 456 789"
              />
            </div>
            <div>
              <label className="form-label">{t('reservations.roomType')}</label>
              <select
                value={form.room_type}
                onChange={(e) => setForm({ ...form, room_type: e.target.value })}
                className="form-input"
              >
                <option value="">{t('reservations.anyType')}</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            <div>
              <label className="form-label">{t('reservations.status')}</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Reservation['status'] })}
                className="form-input"
              >
                <option value="booked">{t('reservations.booked')}</option>
                <option value="confirmed">{t('reservations.confirmed')}</option>
                <option value="checked_in">{t('reservations.checkedIn')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">{t('reservations.notes')}</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="form-input"
              rows={3}
              placeholder={t('reservations.specialRequests')}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-neutral-medium">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              {t('reservations.cancel')}
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || !form.guest_name.trim()}
            >
              {isSubmitting ? t('reservations.creating') : t('reservations.createReservation')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}