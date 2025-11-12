import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Room, MaintenanceNote, Amenity } from '@/core/types';

// Mock data store
let mockRooms: Room[] = [
  {
    id: 1,
    number: 101,
    type: 'Standard Room',
    status: 'available',
    price: 100,
    description: 'Comfortable standard room with city view',
    capacity: 2,
    size: 25,
    floor: 1,
    amenities: [
      { id: 'wifi', name: 'Free WiFi', description: 'High-speed internet access' },
      { id: 'tv', name: 'Smart TV', description: '55-inch smart television' },
      { id: 'ac', name: 'Air Conditioning', description: 'Climate control system' },
    ],
    maintenance_notes: [
      {
        id: '1',
        date: '2024-11-10',
        note: 'TV remote needs new batteries',
        priority: 'low',
        status: 'open',
        reported_by: 'Housekeeping'
      }
    ],
    last_cleaned: '2024-11-12',
    next_maintenance: '2024-12-01'
  },
  {
    id: 2,
    number: 102,
    type: 'Deluxe Suite',
    status: 'occupied',
    price: 150,
    description: 'Spacious suite with balcony and premium amenities',
    capacity: 4,
    size: 45,
    floor: 2,
    amenities: [
      { id: 'wifi', name: 'Free WiFi', description: 'High-speed internet access' },
      { id: 'tv', name: 'Smart TV', description: '65-inch smart television' },
      { id: 'ac', name: 'Air Conditioning', description: 'Climate control system' },
      { id: 'balcony', name: 'Private Balcony', description: 'Outdoor seating area' },
      { id: 'minibar', name: 'Minibar', description: 'Stocked with beverages and snacks' },
    ],
    maintenance_notes: [],
    last_cleaned: '2024-11-11',
    next_maintenance: '2024-12-15'
  },
  {
    id: 3,
    number: 201,
    type: 'Tent Cabin',
    status: 'maintenance',
    price: 75,
    description: 'Rustic tent cabin perfect for outdoor enthusiasts',
    capacity: 2,
    size: 15,
    floor: 0,
    amenities: [
      { id: 'firepit', name: 'Fire Pit', description: 'Outdoor fire pit for evening gatherings' },
      { id: 'campfire', name: 'Campfire Area', description: 'Designated campfire space' },
    ],
    maintenance_notes: [
      {
        id: '2',
        date: '2024-11-08',
        note: 'Tent canvas needs repair - small tear detected',
        priority: 'high',
        status: 'in_progress',
        reported_by: 'Maintenance Team'
      }
    ],
    last_cleaned: '2024-11-09',
    next_maintenance: '2024-11-20'
  },
];

// Global amenities store
let globalAmenities: Amenity[] = [
  { id: 'wifi', name: 'Free WiFi', description: 'High-speed internet access' },
  { id: 'tv', name: 'Smart TV', description: '55-inch smart television' },
  { id: 'ac', name: 'Air Conditioning', description: 'Climate control system' },
  { id: 'balcony', name: 'Private Balcony', description: 'Outdoor seating area' },
  { id: 'minibar', name: 'Minibar', description: 'Stocked with beverages and snacks' },
  { id: 'firepit', name: 'Fire Pit', description: 'Outdoor fire pit for evening gatherings' },
  { id: 'campfire', name: 'Campfire Area', description: 'Designated campfire space' },
  { id: 'parking', name: 'Free Parking', description: 'Complimentary parking space' },
  { id: 'breakfast', name: 'Complimentary Breakfast', description: 'Daily breakfast service' },
  { id: 'spa', name: 'Spa Access', description: 'Access to spa facilities' },
];

export function useRooms() {
  const queryClient = useQueryClient();

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      // Return mock data
      return [...mockRooms];
    },
  });

  const updateRoomStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: Room['status'] }) => {
      const roomIndex = mockRooms.findIndex(room => room.id === id);
      if (roomIndex !== -1) {
        mockRooms[roomIndex].status = status;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });

  const addRoom = useMutation({
    mutationFn: async (roomData: Omit<Room, 'id'>) => {
      const newRoom: Room = {
        ...roomData,
        id: Math.max(...mockRooms.map(r => r.id), 0) + 1,
      };
      mockRooms.push(newRoom);
      return { id: newRoom.id };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });

  const updateRoom = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Room> }) => {
      const roomIndex = mockRooms.findIndex(room => room.id === id);
      if (roomIndex !== -1) {
        mockRooms[roomIndex] = { ...mockRooms[roomIndex], ...data };
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });

  const deleteRoom = useMutation({
    mutationFn: async (id: number) => {
      mockRooms = mockRooms.filter(room => room.id !== id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });

  const addMaintenanceNote = useMutation({
    mutationFn: async ({ roomId, note }: { roomId: number; note: Omit<MaintenanceNote, 'id'> }) => {
      const roomIndex = mockRooms.findIndex(room => room.id === roomId);
      if (roomIndex !== -1) {
        const newNote: MaintenanceNote = {
          ...note,
          id: Date.now().toString(),
        };
        mockRooms[roomIndex].maintenance_notes.push(newNote);
        return { id: newNote.id };
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });

  const updateMaintenanceNote = useMutation({
    mutationFn: async ({ roomId, noteId, data }: { roomId: number; noteId: string; data: Partial<MaintenanceNote> }) => {
      const roomIndex = mockRooms.findIndex(room => room.id === roomId);
      if (roomIndex !== -1) {
        const noteIndex = mockRooms[roomIndex].maintenance_notes.findIndex(note => note.id === noteId);
        if (noteIndex !== -1) {
          mockRooms[roomIndex].maintenance_notes[noteIndex] = {
            ...mockRooms[roomIndex].maintenance_notes[noteIndex],
            ...data
          };
        }
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });

  // Amenities management
  const { data: amenities } = useQuery({
    queryKey: ['amenities'],
    queryFn: async () => [...globalAmenities],
  });

  const addAmenity = useMutation({
    mutationFn: async (amenity: Omit<Amenity, 'id'>) => {
      const newAmenity: Amenity = {
        ...amenity,
        id: Date.now().toString(),
      };
      globalAmenities.push(newAmenity);
      return newAmenity;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['amenities'] }),
  });

  const updateAmenity = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Amenity> }) => {
      const amenityIndex = globalAmenities.findIndex(amenity => amenity.id === id);
      if (amenityIndex !== -1) {
        globalAmenities[amenityIndex] = { ...globalAmenities[amenityIndex], ...data };
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['amenities'] }),
  });

  const deleteAmenity = useMutation({
    mutationFn: async (id: string) => {
      globalAmenities = globalAmenities.filter(amenity => amenity.id !== id);
      // Remove from all rooms
      mockRooms.forEach(room => {
        room.amenities = room.amenities.filter(amenity => amenity.id !== id);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  return {
    rooms,
    isLoading,
    updateRoomStatus,
    addRoom,
    updateRoom,
    deleteRoom,
    addMaintenanceNote,
    updateMaintenanceNote,
    amenities,
    addAmenity,
    updateAmenity,
    deleteAmenity,
  };
}