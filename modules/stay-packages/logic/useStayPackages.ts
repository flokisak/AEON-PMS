import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  StayPackage,
  PackageComponent,
  PackagePricingRule,
  PackageAvailability,
  PackageBooking
} from '@/core/types';

// Mock data stores
let mockStayPackages: StayPackage[] = [
  {
    id: '1',
    code: 'ROMANTIK2024',
    name: 'Romantický útěk',
    description: 'Dokonalý romantický únik se šampaňskou snídaní, párovou masáží a soukromou večeří',
    short_description: 'Romantický útěk pro páry',
    category: 'romantic',
    status: 'active',
    base_price: 10500.00,
    currency: 'CZK',
    minimum_stay: 2,
    maximum_stay: 7,
    max_guests: 2,
    components: [
      {
        id: 'comp1',
        type: 'accommodation',
        name: 'Deluxe Suite',
        description: 'Spacious suite with balcony and city view',
        quantity: 1,
        unit_price: 200.00,
        total_price: 200.00,
        is_mandatory: true,
        category: 'suite',
        reference_id: 'room_201'
      },
      {
        id: 'comp2',
        type: 'meal',
        name: 'Champagne Breakfast',
        description: 'Daily breakfast with champagne',
        quantity: 1,
        unit_price: 25.00,
        total_price: 25.00,
        is_mandatory: true,
        category: 'breakfast'
      },
      {
        id: 'comp3',
        type: 'service',
        name: 'Couples Massage',
        description: '60-minute couples massage session',
        quantity: 1,
        unit_price: 150.00,
        total_price: 150.00,
        is_mandatory: false,
        category: 'spa'
      },
      {
        id: 'comp4',
        type: 'meal',
        name: 'Private Dinner',
        description: 'Romantic dinner for two with wine',
        quantity: 1,
        unit_price: 75.00,
        total_price: 75.00,
        is_mandatory: false,
        category: 'dinner'
      }
    ],
    pricing_rules: [
      {
        id: 'rule1',
        name: 'Valentine\'s Day Special',
        type: 'seasonal',
        conditions: {
          date_from: '2024-02-14',
          date_to: '2024-02-14'
        },
        adjustment_type: 'percentage',
        adjustment_value: 15, // 15% discount
        is_active: true,
        priority: 10
      },
      {
        id: 'rule2',
        name: 'Early Bird Discount',
        type: 'early_bird',
        conditions: {
          booking_window_days: 30
        },
        adjustment_type: 'percentage',
        adjustment_value: 10,
        is_active: true,
        priority: 5
      }
    ],
    availability_rules: [
      {
        id: 'avail1',
        package_id: '1',
        date_from: '2024-01-01',
        date_to: '2024-12-31',
        is_available: true,
        max_bookings: 5,
        current_bookings: 2,
        blackout_dates: ['2024-12-25', '2024-12-31'],
        minimum_stay: 2,
        maximum_stay: 7
      }
    ],
    images: ['romance-suite.jpg', 'couples-massage.jpg'],
    highlights: [
      'Private balcony with city views',
      'Champagne breakfast daily',
      'Couples spa treatment',
      'Romantic dinner included'
    ],
    terms_conditions: 'Minimum 2-night stay required. Cancellation policy: 48 hours notice.',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    valid_from: '2024-01-01',
    valid_to: '2024-12-31',
    total_bookings: 24,
    total_revenue: 10800.00,
    average_rating: 4.8,
    review_count: 18
  },
  {
    id: '2',
    code: 'RODINNA2024',
    name: 'Rodinné dobrodružství',
    description: 'Vzrušující rodinný balíček s aktivitami, dětským koutkem a přátelským vybavením',
    short_description: 'Dobrodružství pro celou rodinu',
    category: 'family',
    status: 'active',
    base_price: 8500.00,
    currency: 'CZK',
    minimum_stay: 3,
    maximum_stay: 10,
    max_guests: 4,
    components: [
      {
        id: 'comp5',
        type: 'accommodation',
        name: 'Rodinný apartmá',
        description: 'Prostorný apartmá ideální pro rodiny',
        quantity: 1,
        unit_price: 180.00,
        total_price: 180.00,
        is_mandatory: true,
        category: 'suite'
      },
      {
        id: 'comp6',
        type: 'activity',
        name: 'Přístup do dětského koutku',
        description: 'Plný přístup k hlídaným dětským aktivitám',
        quantity: 1,
        unit_price: 50.00,
        total_price: 50.00,
        is_mandatory: false,
        category: 'kids'
      },
      {
        id: 'comp7',
        type: 'activity',
        name: 'Rodinný výlet',
        description: 'Vedené rodinné turistické dobrodružství',
        quantity: 1,
        unit_price: 40.00,
        total_price: 40.00,
        is_mandatory: false,
        category: 'outdoor'
      },
      {
        id: 'comp8',
        type: 'meal',
        name: 'Rodinné stravování',
        description: 'Speciální rodinný zážitek ze stravování',
        quantity: 1,
        unit_price: 50.00,
        total_price: 50.00,
        is_mandatory: true,
        category: 'dining'
      }
    ],
    pricing_rules: [
      {
        id: 'rule3',
        name: 'Rodinná sleva (3+ noci)',
        type: 'base',
        conditions: {
          min_stay: 3
        },
        adjustment_type: 'percentage',
        adjustment_value: 12,
        is_active: true,
        priority: 8
      }
    ],
    availability_rules: [
      {
        id: 'avail2',
        package_id: '2',
        date_from: '2024-06-01',
        date_to: '2024-08-31',
        is_available: true,
        max_bookings: 8,
        current_bookings: 3,
        blackout_dates: [],
        minimum_stay: 3,
        maximum_stay: 10
      }
    ],
    images: ['family-suite.jpg', 'kids-club.jpg'],
    highlights: [
      'Prostorný rodinný apartmá',
      'Hlídané dětské aktivity',
      'Vedená rodinná dobrodružství',
      'Speciální rodinné stravování'
    ],
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-10T00:00:00Z',
    valid_from: '2024-06-01',
    valid_to: '2024-08-31',
    total_bookings: 15,
    total_revenue: 127500.00,
    average_rating: 4.6,
    review_count: 12
  }
];

const mockPackageBookings: PackageBooking[] = [
  {
    id: 'pb1',
    package_id: '1',
    guest_name: 'John & Jane Smith',
    guest_email: 'john.jane@email.com',
    guest_phone: '+1-555-0101',
    check_in_date: '2024-02-14',
    check_out_date: '2024-02-16',
    guests_count: 2,
    total_price: 675.00, // With Valentine's discount
    status: 'confirmed',
    special_requests: 'Anniversary celebration - please arrange rose petals',
    booking_reference: 'PKG-ROMANCE-001',
    created_at: '2024-01-20T10:30:00Z',
    payment_status: 'paid'
  }
];

export function useStayPackages() {
  const queryClient = useQueryClient();

  // Packages
  const { data: stayPackages, isLoading: packagesLoading } = useQuery({
    queryKey: ['stay-packages'],
    queryFn: async () => mockStayPackages,
  });

  // Package Bookings
  const { data: packageBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['package-bookings'],
    queryFn: async () => mockPackageBookings,
  });

  const isLoading = packagesLoading || bookingsLoading;

  // Package CRUD Operations
  const createPackage = useMutation({
    mutationFn: async (pkgData: Omit<StayPackage, 'id' | 'created_at' | 'updated_at' | 'total_bookings' | 'total_revenue' | 'review_count'>) => {
      const newPackage: StayPackage = {
        ...pkgData,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        total_bookings: 0,
        total_revenue: 0,
        review_count: 0,
      };
      mockStayPackages.push(newPackage);
      return newPackage;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stay-packages'] }),
  });

  const updatePackage = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StayPackage> }) => {
      const pkgIndex = mockStayPackages.findIndex(pkg => pkg.id === id);
      if (pkgIndex !== -1) {
        mockStayPackages[pkgIndex] = {
          ...mockStayPackages[pkgIndex],
          ...data,
          updated_at: new Date().toISOString()
        };
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stay-packages'] }),
  });

  const deletePackage = useMutation({
    mutationFn: async (id: string) => {
      mockStayPackages = mockStayPackages.filter(pkg => pkg.id !== id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stay-packages'] }),
  });

  // Component Management
  const addComponent = useMutation({
    mutationFn: async ({ packageId, component }: { packageId: string; component: Omit<PackageComponent, 'id'> }) => {
      const pkg = mockStayPackages.find(p => p.id === packageId);
      if (pkg) {
        const newComponent: PackageComponent = {
          ...component,
          id: `comp${Date.now()}`,
        };
        pkg.components.push(newComponent);
        pkg.updated_at = new Date().toISOString();
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stay-packages'] }),
  });

  const updateComponent = useMutation({
    mutationFn: async ({ packageId, componentId, data }: { packageId: string; componentId: string; data: Partial<PackageComponent> }) => {
      const pkg = mockStayPackages.find(p => p.id === packageId);
      if (pkg) {
        const compIndex = pkg.components.findIndex(c => c.id === componentId);
        if (compIndex !== -1) {
          pkg.components[compIndex] = { ...pkg.components[compIndex], ...data };
          pkg.updated_at = new Date().toISOString();
        }
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stay-packages'] }),
  });

  const removeComponent = useMutation({
    mutationFn: async ({ packageId, componentId }: { packageId: string; componentId: string }) => {
      const pkg = mockStayPackages.find(p => p.id === packageId);
      if (pkg) {
        pkg.components = pkg.components.filter(c => c.id !== componentId);
        pkg.updated_at = new Date().toISOString();
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stay-packages'] }),
  });

  // Pricing Rules
  const addPricingRule = useMutation({
    mutationFn: async ({ packageId, rule }: { packageId: string; rule: Omit<PackagePricingRule, 'id'> }) => {
      const pkg = mockStayPackages.find(p => p.id === packageId);
      if (pkg) {
        const newRule: PackagePricingRule = {
          ...rule,
          id: `rule${Date.now()}`,
        };
        pkg.pricing_rules.push(newRule);
        pkg.updated_at = new Date().toISOString();
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stay-packages'] }),
  });

  const updatePricingRule = useMutation({
    mutationFn: async ({ packageId, ruleId, data }: { packageId: string; ruleId: string; data: Partial<PackagePricingRule> }) => {
      const pkg = mockStayPackages.find(p => p.id === packageId);
      if (pkg) {
        const ruleIndex = pkg.pricing_rules.findIndex(r => r.id === ruleId);
        if (ruleIndex !== -1) {
          pkg.pricing_rules[ruleIndex] = { ...pkg.pricing_rules[ruleIndex], ...data };
          pkg.updated_at = new Date().toISOString();
        }
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stay-packages'] }),
  });

  const removePricingRule = useMutation({
    mutationFn: async ({ packageId, ruleId }: { packageId: string; ruleId: string }) => {
      const pkg = mockStayPackages.find(p => p.id === packageId);
      if (pkg) {
        pkg.pricing_rules = pkg.pricing_rules.filter(r => r.id !== ruleId);
        pkg.updated_at = new Date().toISOString();
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stay-packages'] }),
  });

  // Package Bookings
  const createPackageBooking = useMutation({
    mutationFn: async (booking: Omit<PackageBooking, 'id' | 'created_at' | 'booking_reference'>) => {
      const newBooking: PackageBooking = {
        ...booking,
        id: `pb${Date.now()}`,
        booking_reference: `PKG-${booking.package_id.toUpperCase()}-${String(Date.now()).slice(-4)}`,
        created_at: new Date().toISOString(),
      };
      mockPackageBookings.push(newBooking);

      // Update package statistics
      const pkg = mockStayPackages.find(p => p.id === booking.package_id);
      if (pkg) {
        pkg.total_bookings += 1;
        pkg.total_revenue += booking.total_price;
      }

      return newBooking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stay-packages'] });
      queryClient.invalidateQueries({ queryKey: ['package-bookings'] });
    },
  });

  // Calculate package price with rules
  const calculatePackagePrice = (pkg: StayPackage, checkInDate: string, checkOutDate: string, guestsCount: number): number => {
    const stayNights = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24));

    let basePrice = pkg.base_price * stayNights;

    // Apply pricing rules in priority order
    const applicableRules = pkg.pricing_rules
      .filter(rule => rule.is_active)
      .sort((a, b) => b.priority - a.priority);

    for (const rule of applicableRules) {
      let applyRule = false;

      switch (rule.type) {
        case 'seasonal':
          if (rule.conditions.date_from && rule.conditions.date_to) {
            const checkIn = new Date(checkInDate);
            const ruleStart = new Date(rule.conditions.date_from);
            const ruleEnd = new Date(rule.conditions.date_to);
            applyRule = checkIn >= ruleStart && checkIn <= ruleEnd;
          }
          break;
        case 'early_bird':
          // Simplified: assume booking is made today
          applyRule = rule.conditions.booking_window_days ?
            (new Date(checkInDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) >= rule.conditions.booking_window_days : false;
          break;
        case 'base':
          applyRule = rule.conditions.min_stay ? stayNights >= rule.conditions.min_stay : true;
          break;
      }

      if (applyRule) {
        switch (rule.adjustment_type) {
          case 'percentage':
            basePrice *= (1 - rule.adjustment_value / 100);
            break;
          case 'fixed':
            basePrice -= rule.adjustment_value;
            break;
          case 'multiplier':
            basePrice *= rule.adjustment_value;
            break;
        }
        break; // Apply only the highest priority rule
      }
    }

    return Math.max(0, basePrice);
  };

  return {
    // Data
    stayPackages,
    packageBookings,
    isLoading,

    // Package operations
    createPackage,
    updatePackage,
    deletePackage,

    // Component operations
    addComponent,
    updateComponent,
    removeComponent,

    // Pricing operations
    addPricingRule,
    updatePricingRule,
    removePricingRule,

    // Booking operations
    createPackageBooking,

    // Utilities
    calculatePackagePrice,
  };
}