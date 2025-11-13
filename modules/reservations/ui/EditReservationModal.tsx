'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useReservations } from '../logic/useReservations';
import { useBilling } from '../../billing/logic/useBilling';
import { Reservation } from '../../../core/types';
import { useCurrency } from '@/core/hooks/useCurrency';

interface EditReservationModalProps {
  reservation: Reservation;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditReservationModal({ reservation, onClose, onSuccess }: EditReservationModalProps) {
  const { t } = useTranslation('common');
  const { updateReservation } = useReservations();
  const { guestAccounts } = useBilling();
  const { formatCurrency } = useCurrency();

  const [form, setForm] = useState({
    guest_name: reservation.guest_name,
    guest_email: reservation.guest_email || '',
    guest_phone: reservation.guest_phone || '',
    room_number: reservation.room_number || 0,
    check_in: reservation.check_in || '',
    check_out: reservation.check_out || '',
    status: reservation.status,
    room_type: reservation.room_type || '',
    notes: reservation.notes || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find guest account for this reservation
  const guestAccount = guestAccounts?.find(account =>
    account.guest_name.toLowerCase() === reservation.guest_name.toLowerCase()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateReservation.mutateAsync({
        id: reservation.id,
        ...form
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update reservation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-medium">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-foreground">
              {t('reservations.editReservation')} - {reservation.guest_name}
            </h3>
            <button
              onClick={onClose}
              className="text-neutral-dark hover:text-foreground text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Guest Account Information */}
          {guestAccount && (
            <div className="mb-6 bg-neutral-light rounded-lg p-4">
              <h4 className="text-lg font-semibold text-foreground mb-3">{t('billing.guestAccount')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-neutral-dark">{t('billing.accountId')}:</span>
                  <div className="font-semibold">{guestAccount.id}</div>
                </div>
                <div>
                  <span className="text-sm text-neutral-dark">{t('billing.currentBalance')}:</span>
                  <div className={`font-semibold ${guestAccount.current_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(guestAccount.current_balance)}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-neutral-dark">{t('billing.totalCharged')}:</span>
                  <div className="font-semibold">{formatCurrency(guestAccount.total_charged)}</div>
                </div>
                <div>
                  <span className="text-sm text-neutral-dark">{t('billing.totalPaid')}:</span>
                  <div className="font-semibold text-green-600">{formatCurrency(guestAccount.total_paid)}</div>
                </div>
                <div>
                  <span className="text-sm text-neutral-dark">{t('billing.status')}:</span>
                  <div className="font-semibold capitalize">{guestAccount.status}</div>
                </div>
                <div>
                  <span className="text-sm text-neutral-dark">{t('billing.lastActivity')}:</span>
                  <div className="font-semibold">{new Date(guestAccount.last_activity).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">{t('reservations.guestName')} *</label>
                <input
                  type="text"
                  value={form.guest_name}
                  onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">{t('reservations.email')}</label>
                <input
                  type="email"
                  value={form.guest_email}
                  onChange={(e) => setForm({ ...form, guest_email: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">{t('reservations.phone')}</label>
                <input
                  type="tel"
                  value={form.guest_phone}
                  onChange={(e) => setForm({ ...form, guest_phone: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">{t('reservations.roomNumber')}</label>
                <input
                  type="number"
                  value={form.room_number}
                  onChange={(e) => setForm({ ...form, room_number: parseInt(e.target.value) || 0 })}
                  className="form-input"
                  min="1"
                />
              </div>
              <div>
                <label className="form-label">{t('reservations.checkIn')}</label>
                <input
                  type="date"
                  value={form.check_in}
                  onChange={(e) => setForm({ ...form, check_in: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">{t('reservations.checkOut')}</label>
                <input
                  type="date"
                  value={form.check_out}
                  onChange={(e) => setForm({ ...form, check_out: e.target.value })}
                  className="form-input"
                />
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
                  <option value="checked_out">{t('reservations.checkedOut')}</option>
                  <option value="cancelled">{t('reservations.cancelled')}</option>
                </select>
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
            </div>

            <div>
              <label className="form-label">{t('reservations.notes')}</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="form-input"
                rows={3}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? t('reservations.updating') : t('reservations.updateReservation')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}