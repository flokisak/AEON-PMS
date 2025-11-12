'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRooms } from '../logic/useRooms';
import { Amenity } from '../../../core/types';

function AmenityForm({ amenity, onSave, onCancel }: {
  amenity?: Amenity;
  onSave: (data: Omit<Amenity, 'id'>) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState<Omit<Amenity, 'id'>>({
    name: amenity?.name || '',
    description: amenity?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h4 className="font-medium mb-3">{amenity ? t('rooms.editAmenity') : t('rooms.addNewAmenity')}</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="form-label text-sm">{t('rooms.name')}</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="form-input w-full text-sm"
            placeholder="e.g., Free WiFi"
            required
          />
        </div>

        <div>
          <label className="form-label text-sm">{t('rooms.optionalDescription')}</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="form-input w-full text-sm"
            placeholder={t('rooms.briefDescription')}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary text-sm px-3 py-1"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="btn-primary text-sm px-3 py-1"
          >
            {amenity ? t('rooms.updateAmenity') : t('rooms.addAmenity')} {t('rooms.amenities')}
          </button>
        </div>
      </form>
    </div>
  );
}

export function AmenitiesManager() {
  const { t } = useTranslation('common');
  const { amenities, addAmenity, updateAmenity, deleteAmenity } = useRooms();
  const [showForm, setShowForm] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | undefined>();

  const handleAddAmenity = () => {
    setEditingAmenity(undefined);
    setShowForm(true);
  };

  const handleEditAmenity = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    setShowForm(true);
  };

  const handleSaveAmenity = (data: Omit<Amenity, 'id'>) => {
    if (editingAmenity) {
      updateAmenity.mutate({ id: editingAmenity.id, data });
    } else {
      addAmenity.mutate(data);
    }
    setShowForm(false);
  };

  const handleDeleteAmenity = (id: string) => {
    if (confirm(t('rooms.confirmDeleteAmenity'))) {
      deleteAmenity.mutate(id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">{t('rooms.amenitiesManagement')}</h3>
        <button
          onClick={handleAddAmenity}
          className="btn-primary text-sm px-4 py-2"
        >
          {t('rooms.addAmenity')}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <AmenityForm
            amenity={editingAmenity}
            onSave={handleSaveAmenity}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {amenities?.map((amenity) => (
          <div key={amenity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-800">{amenity.name}</h4>
                {amenity.description && (
                  <p className="text-sm text-gray-600 mt-1">{amenity.description}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEditAmenity(amenity)}
                className="btn-secondary flex-1 text-xs py-1"
              >
                {t('rooms.editAmenity')}
              </button>
              <button
                onClick={() => handleDeleteAmenity(amenity.id)}
                className="btn-danger flex-1 text-xs py-1"
              >
                {t('rooms.deleteAmenity')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {amenities?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>{t('rooms.noAmenities')}</p>
        </div>
      )}
    </div>
  );
}