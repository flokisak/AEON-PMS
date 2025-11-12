import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/core/config/supabaseClient';

export interface Partner {
  id: number;
  name: string;
  description: string;
  category: 'restaurant' | 'winery' | 'spa' | 'activity' | 'transport' | 'entertainment' | 'other';
  contact_email: string;
  contact_phone: string;
  address: string;
  commission_rate: number; // percentage
  status: 'active' | 'inactive';
}

export interface PartnerOffer {
  id: number;
  partner_id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  capacity_per_slot: number;
  availability: {
    days_of_week: number[]; // 0-6 (Sunday-Saturday)
    start_time: string;
    end_time: string;
  };
  booking_window_days: number;
  status: 'active' | 'inactive';
}

export interface PartnerReservation {
  id: number;
  package_id: number;
  partner_offer_id: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  scheduled_date: string;
  scheduled_time: string;
  number_of_people: number;
  special_requests: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  partner_confirmation_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number; // in nights
  includes: string[];
  partner_offers: {
    partner_offer_id: number;
    included_in_package: boolean;
    auto_book: boolean;
  }[];
  available_from: string;
  available_to: string;
  max_guests: number;
  status: 'active' | 'inactive';
}

export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  price: number;
  type: 'conference' | 'wedding' | 'party' | 'corporate' | 'other';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export function usePackagesEvents() {
  const queryClient = useQueryClient();

  const { data: partners, isLoading: partnersLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      // Mock data
      return [
        {
          id: 1,
          name: 'Vinařství Západ slunce',
          description: 'Místní vinařství nabízející ochutnávky vín',
          category: 'winery' as const,
          contact_email: 'info@sunsetwinery.com',
          contact_phone: '+1234567890',
          address: 'Vinohradská 123, Vinařská oblast',
          commission_rate: 15,
          status: 'active' as const
        },
        {
          id: 2,
          name: 'Wellness Klid',
          description: 'Plně vybavené wellness a relaxační centrum',
          category: 'spa' as const,
          contact_email: 'bookings@tranquilspa.com',
          contact_phone: '+1234567891',
          address: 'Relaxační 456',
          commission_rate: 20,
          status: 'active' as const
        }
      ] as Partner[];
    },
  });

  const { data: partnerOffers, isLoading: partnerOffersLoading } = useQuery({
    queryKey: ['partnerOffers'],
    queryFn: async () => {
      // Mock data
      return [
        {
          id: 1,
          partner_id: 1,
          name: 'Ochutnávka vín',
          description: 'Prohlídka našich vinic s ochutnávkou 5 prémiových vín',
          price: 1200,
          duration_minutes: 90,
          capacity_per_slot: 10,
          availability: {
            days_of_week: [2, 3, 4, 5, 6], // Tuesday-Saturday
            start_time: '14:00',
            end_time: '17:00'
          },
          booking_window_days: 7,
          status: 'active' as const
        },
        {
          id: 2,
          partner_id: 2,
          name: 'Párová masáž',
          description: '60minutová párová masáž s aromaterapií',
          price: 4800,
          duration_minutes: 60,
          capacity_per_slot: 2,
          availability: {
            days_of_week: [0, 1, 2, 3, 4, 5, 6], // All week
            start_time: '09:00',
            end_time: '20:00'
          },
          booking_window_days: 14,
          status: 'active' as const
        }
      ] as PartnerOffer[];
    },
  });

  const { data: partnerReservations, isLoading: reservationsLoading } = useQuery({
    queryKey: ['partnerReservations'],
    queryFn: async () => {
      // Mock data
      return [
        {
          id: 1,
          package_id: 1,
          partner_offer_id: 1,
          guest_name: 'John Doe',
          guest_email: 'john@example.com',
          guest_phone: '+1234567890',
          scheduled_date: '2024-12-15',
          scheduled_time: '15:00',
          number_of_people: 2,
          special_requests: 'Vegetarian options for cheese pairing',
          status: 'confirmed' as const,
          partner_confirmation_code: 'WIN123456',
          created_at: '2024-12-01T10:00:00Z',
          updated_at: '2024-12-01T14:30:00Z'
        }
      ] as PartnerReservation[];
    },
  });

  const { data: packages, isLoading: packagesLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      // Mock data
      return [
        {
          id: 1,
          name: 'Romantický víkend',
          description: 'Dokonalý útěk pro páry',
          price: 7900,
          duration: 2,
          includes: ['Snídaně', 'Pozdní odhlášení'],
          partner_offers: [
            { partner_offer_id: 1, included_in_package: true, auto_book: true },
            { partner_offer_id: 2, included_in_package: true, auto_book: false }
          ],
          available_from: '2024-01-01',
          available_to: '2024-12-31',
          max_guests: 2,
          status: 'active'
        },
        {
          id: 2,
          name: 'Rodinná zábava',
          description: 'Skvělé pro rodiny s dětmi',
          price: 12000,
          duration: 3,
          includes: ['Všechna jídla', 'Dětské aktivity', 'Zábava'],
          partner_offers: [],
          available_from: '2024-06-01',
          available_to: '2024-08-31',
          max_guests: 4,
          status: 'active'
        }
      ] as Package[];
    },
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      // Mock data
      return [
        {
          id: 1,
          name: 'Letní svatba',
          description: 'Krásný venkovní svatební obřad',
          price: 130000,
          type: 'wedding',
          status: 'upcoming'
        },
        {
          id: 2,
          name: 'Technologická konference 2024',
          description: 'Roční technologická konference',
          price: 4000,
          type: 'conference',
          status: 'upcoming'
        }
      ] as Event[];
    },
  });

  const createPackage = useMutation({
    mutationFn: async (newPackage: Omit<Package, 'id'>) => {
      // Mock
      console.log('Creating package:', newPackage);
      return { ...newPackage, id: Date.now() };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['packages'] }),
  });

  const createEvent = useMutation({
    mutationFn: async (newEvent: Omit<Event, 'id'>) => {
      // Mock
      console.log('Creating event:', newEvent);
      return { ...newEvent, id: Date.now() };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });

  const updatePackage = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Package> & { id: number }) => {
      // Mock
      console.log('Updating package:', id, updates);
      return { id, ...updates };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['packages'] }),
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Event> & { id: number }) => {
      // Mock
      console.log('Updating event:', id, updates);
      return { id, ...updates };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });

  const deletePackage = useMutation({
    mutationFn: async (id: number) => {
      // Mock
      console.log('Deleting package:', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['packages'] }),
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: number) => {
      // Mock
      console.log('Deleting event:', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });

  // Partner CRUD operations
  const createPartner = useMutation({
    mutationFn: async (newPartner: Omit<Partner, 'id'>) => {
      console.log('Creating partner:', newPartner);
      return { ...newPartner, id: Date.now() };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partners'] }),
  });

  const updatePartner = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Partner> & { id: number }) => {
      console.log('Updating partner:', id, updates);
      return { id, ...updates };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partners'] }),
  });

  const deletePartner = useMutation({
    mutationFn: async (id: number) => {
      console.log('Deleting partner:', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partners'] }),
  });

  // Partner Offer CRUD operations
  const createPartnerOffer = useMutation({
    mutationFn: async (newOffer: Omit<PartnerOffer, 'id'>) => {
      console.log('Creating partner offer:', newOffer);
      return { ...newOffer, id: Date.now() };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partnerOffers'] }),
  });

  const updatePartnerOffer = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PartnerOffer> & { id: number }) => {
      console.log('Updating partner offer:', id, updates);
      return { id, ...updates };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partnerOffers'] }),
  });

  const deletePartnerOffer = useMutation({
    mutationFn: async (id: number) => {
      console.log('Deleting partner offer:', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partnerOffers'] }),
  });

  // Partner Reservation operations
  const createPartnerReservation = useMutation({
    mutationFn: async (newReservation: Omit<PartnerReservation, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating partner reservation:', newReservation);
      
      // Simulate sending email to partner
      const partner = partners?.find(p => p.id === partnerOffers?.find(o => o.id === newReservation.partner_offer_id)?.partner_id);
      if (partner) {
        console.log(`Sending reservation request to ${partner.name} at ${partner.contact_email}`);
        // In real implementation, this would send an actual email
      }
      
      return { 
        ...newReservation, 
        id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partnerReservations'] }),
  });

  const updatePartnerReservation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PartnerReservation> & { id: number }) => {
      console.log('Updating partner reservation:', id, updates);
      return { id, ...updates, updated_at: new Date().toISOString() };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partnerReservations'] }),
  });

  const deletePartnerReservation = useMutation({
    mutationFn: async (id: number) => {
      console.log('Deleting partner reservation:', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partnerReservations'] }),
  });

  // Function to auto-book partner offers when package is booked
  const bookPackagePartnerOffers = useMutation({
    mutationFn: async ({ 
      packageId, 
      guestName, 
      guestEmail, 
      guestPhone, 
      scheduledDate,
      numberOfPeople 
    }: {
      packageId: number;
      guestName: string;
      guestEmail: string;
      guestPhone: string;
      scheduledDate: string;
      numberOfPeople: number;
    }) => {
      const pkg = packages?.find(p => p.id === packageId);
      if (!pkg) throw new Error('Package not found');

      const autoBookOffers = pkg.partner_offers.filter(po => po.included_in_package && po.auto_book);
      const reservations = [];

      for (const offerRef of autoBookOffers) {
        const offer = partnerOffers?.find(o => o.id === offerRef.partner_offer_id);
        if (offer) {
          const reservation: Omit<PartnerReservation, 'id' | 'created_at' | 'updated_at'> = {
            package_id: packageId,
            partner_offer_id: offerRef.partner_offer_id,
            guest_name: guestName,
            guest_email: guestEmail,
            guest_phone: guestPhone,
            scheduled_date: scheduledDate,
            scheduled_time: '10:00', // Default time, could be configurable
            number_of_people: Math.min(numberOfPeople, offer.capacity_per_slot),
            special_requests: '',
            status: 'pending'
          };
          
          const result = await createPartnerReservation.mutateAsync(reservation);
          reservations.push(result);
        }
      }

      return reservations;
    },
  });

  return {
    packages,
    events,
    partners,
    partnerOffers,
    partnerReservations,
    isLoading: packagesLoading || eventsLoading || partnersLoading || partnerOffersLoading || reservationsLoading,
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
    createPartnerReservation,
    updatePartnerReservation,
    deletePartnerReservation,
    bookPackagePartnerOffers,
  };
}