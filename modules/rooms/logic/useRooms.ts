import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Room, MaintenanceNote, Amenity } from '@/core/types';

// Mock data store
let mockRooms: Room[] = [
  {
    id: 1,
    number: 101,
    type: 'Standardní pokoj',
    status: 'available',
    price: 2400,
    description: 'Pohodlný standardní pokoj s výhledem na město',
    capacity: 2,
    size: 25,
    floor: 1,
    amenities: [
      { id: 'wifi', name: 'Bezplatné WiFi', description: 'Rychlý internetový přístup' },
      { id: 'tv', name: 'Smart TV', description: '55palcová chytrá televize' },
      { id: 'ac', name: 'Klimatizace', description: 'Systém kontroly klimatu' },
    ],
    maintenance_notes: [
      {
        id: '1',
        date: '2024-11-10',
        note: 'Dálkový ovladač TV potřebuje nové baterie',
        priority: 'low',
        status: 'open',
        reported_by: 'Úklid'
      }
    ],
    last_cleaned: '2024-11-12',
    next_maintenance: '2024-12-01'
  },
  {
    id: 2,
    number: 102,
    type: 'Apartmá Deluxe',
    status: 'occupied',
    price: 3600,
    description: 'Prostorný apartmá s balkonem a prémiovým vybavením',
    capacity: 4,
    size: 45,
    floor: 2,
    amenities: [
      { id: 'wifi', name: 'Bezplatné WiFi', description: 'Rychlý internetový přístup' },
      { id: 'tv', name: 'Smart TV', description: '65palcová chytrá televize' },
      { id: 'ac', name: 'Klimatizace', description: 'Systém kontroly klimatu' },
      { id: 'balcony', name: 'Soukromý balkon', description: 'Venkovní sezení' },
      { id: 'minibar', name: 'Minibar', description: 'Nápoje a občerstvení' },
    ],
    maintenance_notes: [],
    last_cleaned: '2024-11-11',
    next_maintenance: '2024-12-15'
  },
  {
    id: 3,
    number: 201,
    type: 'Pokoj Superior',
    status: 'maintenance',
    price: 1800,
    description: 'Moderní pokoj s pracovním koutem',
    capacity: 2,
    size: 30,
    floor: 2,
    amenities: [
      { id: 'wifi', name: 'Bezplatné WiFi', description: 'Rychlý internetový přístup' },
      { id: 'tv', name: 'Smart TV', description: '55palcová chytrá televize' },
      { id: 'ac', name: 'Klimatizace', description: 'Systém kontroly klimatu' },
      { id: 'workspace', name: 'Pracovní kout', description: 'Psací stůl a židle' },
    ],
    maintenance_notes: [
      {
        id: '2',
        date: '2024-11-08',
        note: 'Nutná výměna žárovky v lampě u stolu',
        priority: 'high',
        status: 'in_progress',
        reported_by: 'Údržba'
      }
    ],
    last_cleaned: '2024-11-09',
    next_maintenance: '2024-11-20'
  },
  {
    id: 4,
    number: 301,
    type: 'Rodinný pokoj',
    status: 'available',
    price: 4200,
    description: 'Velký rodinný pokoj s oddělenými spacími prostory',
    capacity: 4,
    size: 55,
    floor: 3,
    amenities: [
      { id: 'wifi', name: 'Bezplatné WiFi', description: 'Rychlý internetový přístup' },
      { id: 'tv', name: 'Smart TV', description: '65palcová chytrá televize' },
      { id: 'ac', name: 'Klimatizace', description: 'Systém kontroly klimatu' },
      { id: 'minibar', name: 'Minibar', description: 'Nápoje a občerstvení' },
      { id: 'kids', name: 'Dětské vybavení', description: 'Postýlka a židle pro dítě' },
    ],
    maintenance_notes: [],
    last_cleaned: '2024-11-12',
    next_maintenance: '2024-12-10'
  },
  {
    id: 5,
    number: 302,
    type: 'Prezidentský apartmá',
    status: 'occupied',
    price: 8500,
    description: 'Luxusní apartmá s panoramatickým výhledem',
    capacity: 6,
    size: 120,
    floor: 3,
    amenities: [
      { id: 'wifi', name: 'Bezplatné WiFi', description: 'Rychlý internetový přístup' },
      { id: 'tv', name: 'Smart TV', description: '75palcová chytrá televize' },
      { id: 'ac', name: 'Klimatizace', description: 'Systém kontroly klimatu' },
      { id: 'balcony', name: 'Velký balkon', description: 'Venkovní posezení s výhledem' },
      { id: 'minibar', name: 'Minibar', description: 'Prémiové nápoje a občerstvení' },
      { id: 'jacuzzi', name: 'Jacuzzi', description: 'Soukromé vířivka v pokoji' },
      { id: 'workspace', name: 'Pracovní kout', description: 'Plně vybavená pracovna' },
    ],
    maintenance_notes: [],
    last_cleaned: '2024-11-11',
    next_maintenance: '2024-12-20'
  }
];

// Global amenities store
let globalAmenities: Amenity[] = [
  { id: 'wifi', name: 'Bezplatné WiFi', description: 'Rychlý internetový přístup' },
  { id: 'tv', name: 'Smart TV', description: '55palcová chytrá televize' },
  { id: 'ac', name: 'Klimatizace', description: 'Systém kontroly klimatu' },
  { id: 'balcony', name: 'Soukromý balkon', description: 'Venkovní sezení' },
  { id: 'minibar', name: 'Minibar', description: 'Nápoje a občerstvení' },
  { id: 'workspace', name: 'Pracovní kout', description: 'Psací stůl a židle' },
  { id: 'parking', name: 'Bezplatné parkování', description: 'Parkovací stání zdarma' },
  { id: 'breakfast', name: 'Snídaně zdarma', description: 'Denní snídaňový servis' },
  { id: 'spa', name: 'Přístup do wellness', description: 'Vstup do wellness centra' },
  { id: 'kids', name: 'Dětské vybavení', description: 'Postýlka a židle pro dítě' },
  { id: 'jacuzzi', name: 'Jacuzzi', description: 'Soukromá vířivka v pokoji' },
  { id: 'safe', name: 'Trezor', description: 'Bezpečnostní trezor v pokoji' },
  { id: 'roomservice', name: 'Pokojová služba', description: '24/7 pokojová služba' },
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