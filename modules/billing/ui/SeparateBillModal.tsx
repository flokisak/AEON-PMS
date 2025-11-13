'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBilling } from '../logic/useBilling';

interface SeparateBillModalProps {
  guestAccountId: string;
  guestName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function SeparateBillModal({ guestAccountId, guestName, onClose, onSuccess }: SeparateBillModalProps) {
  const { t } = useTranslation('common');
  const { separateBill } = useBilling();

  const [fromRoom, setFromRoom] = useState('');
  const [toRoom, setToRoom] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock line items for demonstration
  const mockLineItems = [
    { id: 'li1', description: 'Room charge - Deluxe Room 201', amount: 2400, date: '2024-11-15' },
    { id: 'li2', description: 'Mini bar - Water bottle', amount: 45, date: '2024-11-15' },
    { id: 'li3', description: 'Room service - Breakfast', amount: 180, date: '2024-11-16' },
    { id: 'li4', description: 'Laundry service', amount: 320, date: '2024-11-16' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromRoom || !toRoom || selectedItems.length === 0 || !reason) return;

    setIsSubmitting(true);
    try {
      await separateBill.mutateAsync({
        guestAccountId,
        fromRoom,
        toRoom,
        lineItemIds: selectedItems,
        reason,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to separate bill:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-medium">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-foreground">
              {t('billing.separateBill')} - {guestName}
            </h3>
            <button
              onClick={onClose}
              className="text-neutral-dark hover:text-foreground text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t('billing.fromRoom')}</label>
              <input
                type="text"
                value={fromRoom}
                onChange={(e) => setFromRoom(e.target.value)}
                placeholder="e.g., Room 201"
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">{t('billing.toRoom')}</label>
              <input
                type="text"
                value={toRoom}
                onChange={(e) => setToRoom(e.target.value)}
                placeholder="e.g., Room 305"
                className="form-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">{t('billing.selectItemsToTransfer')}</label>
            <div className="border border-neutral-medium rounded-lg max-h-48 overflow-y-auto">
              {mockLineItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 border-b border-neutral-light last:border-b-0 cursor-pointer hover:bg-neutral-light/50 ${
                    selectedItems.includes(item.id) ? 'bg-primary/10' : ''
                  }`}
                  onClick={() => toggleItemSelection(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="rounded border-neutral-medium"
                      />
                      <div>
                        <div className="font-medium text-foreground">{item.description}</div>
                        <div className="text-sm text-neutral-dark">{item.date}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-foreground">
                      ${item.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {selectedItems.length > 0 && (
              <div className="mt-2 text-sm text-neutral-dark">
                {t('billing.selectedItems')}: {selectedItems.length}
              </div>
            )}
          </div>

          <div>
            <label className="form-label">{t('billing.reason')}</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('billing.reasonPlaceholder')}
              className="form-input"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-neutral-medium">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              {t('billing.cancel')}
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || !fromRoom || !toRoom || selectedItems.length === 0 || !reason}
            >
              {isSubmitting ? t('billing.processing') : t('billing.separateBill')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}