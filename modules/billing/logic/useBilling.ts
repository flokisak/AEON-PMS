import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Invoice,
  InvoiceLineItem,
  Payment,
  GuestAccount,
  Folio,
  TaxRate,
  BillingReport,
  InvoiceTemplate,
  BillingOperation,
  SplitAccount
} from '@/core/types';

// Mock data stores
let mockInvoices: Invoice[] = [
  {
    id: 1,
    guest_account_id: 'GA001',
    invoice_number: 'INV-2024-001',
    guest_name: 'John Doe',
    guest_email: 'john.doe@email.com',
    issue_date: '2024-11-01',
    due_date: '2024-11-15',
    status: 'paid',
    currency: 'USD',
    subtotal: 250.00,
    tax_amount: 20.00,
    discount_amount: 0,
    total_amount: 270.00,
    paid_amount: 270.00,
    balance: 0,
    line_items: [
      {
        id: 'li1',
        description: 'Standard Room - 3 nights',
        quantity: 3,
        unit_price: 100.00,
        total: 300.00,
        tax_rate: 8.0,
        tax_amount: 24.00,
        category: 'accommodation',
        date: '2024-11-01',
        reference: 'Room 101'
      },
      {
        id: 'li2',
        description: 'Room service - Breakfast',
        quantity: 2,
        unit_price: 15.00,
        total: 30.00,
        tax_rate: 8.0,
        tax_amount: 2.40,
        category: 'food_beverage',
        date: '2024-11-02',
        reference: 'Restaurant'
      }
    ],
    payments: [
      {
        id: 'p1',
        invoice_id: 1,
        amount: 270.00,
        payment_method: 'credit_card',
        payment_date: '2024-11-15',
        reference_number: 'CC-123456',
        processed_by: 'Front Desk'
      }
    ],
    notes: 'Thank you for staying with us!',
    updated_at: '2024-11-15T10:30:00Z'
  },
  {
    id: 2,
    guest_account_id: 'GA002',
    invoice_number: 'INV-2024-002',
    guest_name: 'Jane Smith',
    guest_email: 'jane.smith@email.com',
    issue_date: '2024-11-05',
    due_date: '2024-11-20',
      status: 'sent',
    currency: 'USD',
    subtotal: 400.00,
    tax_amount: 32.00,
    discount_amount: 20.00,
    total_amount: 412.00,
    paid_amount: 200.00,
    balance: 212.00,
    line_items: [
      {
        id: 'li3',
        description: 'Deluxe Suite - 2 nights',
        quantity: 2,
        unit_price: 150.00,
        total: 300.00,
        tax_rate: 8.0,
        tax_amount: 24.00,
        category: 'accommodation',
        date: '2024-11-05',
        reference: 'Room 201'
      },
      {
        id: 'li4',
        description: 'Spa Treatment',
        quantity: 1,
        unit_price: 100.00,
        total: 100.00,
        tax_rate: 8.0,
        tax_amount: 8.00,
        category: 'services',
        date: '2024-11-06',
        reference: 'Spa'
      }
    ],
    payments: [
      {
        id: 'p2',
        invoice_id: 2,
        amount: 200.00,
        payment_method: 'bank_transfer',
        payment_date: '2024-11-10',
        reference_number: 'BT-789012',
        notes: 'Partial payment'
      }
    ],
    notes: '20% discount applied for loyalty program',
    updated_at: '2024-11-10T14:20:00Z'
  },
  {
    id: 3,
    guest_account_id: 'GA003',
    invoice_number: 'INV-2024-003',
    guest_name: 'Mike Johnson',
    issue_date: '2024-11-08',
    due_date: '2024-11-22',
    status: 'overdue',
    currency: 'USD',
    subtotal: 180.00,
    tax_amount: 14.40,
    discount_amount: 0,
    total_amount: 194.40,
    paid_amount: 0,
    balance: 194.40,
    line_items: [
      {
        id: 'li5',
        description: 'Tent Cabin - 3 nights',
        quantity: 3,
        unit_price: 60.00,
        total: 180.00,
        tax_rate: 8.0,
        tax_amount: 14.40,
        category: 'accommodation',
        date: '2024-11-08',
        reference: 'Tent 1'
      }
    ],
    payments: [],
    notes: 'Payment due - please contact front desk',
    updated_at: '2024-11-12T09:15:00Z'
  }
];

const mockGuestAccounts: GuestAccount[] = [
  {
    id: 'GA001',
    guest_name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-0101',
    credit_limit: 1000,
    current_balance: 0,
    total_charged: 270.00,
    total_paid: 270.00,
    last_activity: '2024-11-15',
    status: 'active'
  },
  {
    id: 'GA002',
    guest_name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1-555-0102',
    credit_limit: 2000,
    current_balance: 212.00,
    total_charged: 412.00,
    total_paid: 200.00,
    last_activity: '2024-11-10',
    status: 'active'
  },
  {
    id: 'GA003',
    guest_name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    phone: '+1-555-0103',
    current_balance: 194.40,
    total_charged: 194.40,
    total_paid: 0,
    last_activity: '2024-11-08',
    status: 'active'
  }
];

const mockTaxRates: TaxRate[] = [
  {
    id: 'TR001',
    name: 'Standard Sales Tax',
    rate: 8.0,
    is_active: true,
    applies_to: ['accommodation', 'food_beverage', 'services', 'other']
  },
  {
    id: 'TR002',
    name: 'Reduced Food Tax',
    rate: 5.0,
    is_active: true,
    applies_to: ['food_beverage']
  }
];

const mockInvoiceTemplates: InvoiceTemplate[] = [
  {
    id: 'T001',
    name: 'Standard Room Stay',
    description: 'Basic room accommodation with standard amenities',
    line_items: [
      {
        description: 'Room Accommodation',
        quantity: 1,
        unit_price: 150.00,
        total: 150.00,
        category: 'accommodation',
        reference: 'Room Rate'
      }
    ],
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'T002',
    name: 'Business Conference Package',
    description: 'Room with conference facilities and meals',
    line_items: [
      {
        description: 'Deluxe Room',
        quantity: 1,
        unit_price: 200.00,
        total: 200.00,
        category: 'accommodation',
        reference: 'Conference Room'
      },
      {
        description: 'Conference Facilities',
        quantity: 1,
        unit_price: 100.00,
        total: 100.00,
        category: 'services',
        reference: 'Meeting Room'
      },
      {
        description: 'Business Lunch',
        quantity: 2,
        unit_price: 35.00,
        total: 70.00,
        category: 'food_beverage',
        reference: 'Restaurant'
      }
    ],
    is_active: true,
    created_at: '2024-01-15T00:00:00Z'
  }
];

const mockBillingOperations: BillingOperation[] = [];
const mockSplitAccounts: SplitAccount[] = [];

export function useBilling() {
  const queryClient = useQueryClient();

  // Invoices
  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => mockInvoices,
  });

  // Guest Accounts
  const { data: guestAccounts, isLoading: accountsLoading } = useQuery({
    queryKey: ['guest-accounts'],
    queryFn: async () => mockGuestAccounts,
  });

  // Tax Rates
  const { data: taxRates, isLoading: taxRatesLoading } = useQuery({
    queryKey: ['tax-rates'],
    queryFn: async () => mockTaxRates,
  });

  const isLoading = invoicesLoading || accountsLoading || taxRatesLoading;

  // Invoice Operations
  const createInvoice = useMutation({
    mutationFn: async (newInvoice: Omit<Invoice, 'id' | 'invoice_number' | 'updated_at'>) => {
      const invoice: Invoice = {
        ...newInvoice,
        id: Math.max(...mockInvoices.map(i => i.id), 0) + 1,
        invoice_number: `INV-2024-${String(Math.max(...mockInvoices.map(i => i.id), 0) + 1).padStart(3, '0')}`,
        updated_at: new Date().toISOString(),
      };
      mockInvoices.push(invoice);

      // Update guest account balance
      const account = mockGuestAccounts.find(a => a.id === newInvoice.guest_account_id);
      if (account) {
        account.current_balance += newInvoice.balance;
        account.total_charged += newInvoice.total_amount;
        account.last_activity = new Date().toISOString().split('T')[0];
      }

      return invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['guest-accounts'] });
    },
  });

  const updateInvoice = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Invoice> }) => {
      const index = mockInvoices.findIndex(i => i.id === id);
      if (index !== -1) {
        mockInvoices[index] = { ...mockInvoices[index], ...data, updated_at: new Date().toISOString() };
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  });

  const deleteInvoice = useMutation({
    mutationFn: async (id: number) => {
      mockInvoices = mockInvoices.filter(i => i.id !== id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  });

  // Payment Operations
  const addPayment = useMutation({
    mutationFn: async (payment: Omit<Payment, 'id'>) => {
      const newPayment: Payment = {
        ...payment,
        id: `p${Date.now()}`,
      };

      const invoice = mockInvoices.find(i => i.id === payment.invoice_id);
      if (invoice) {
        invoice.payments.push(newPayment);
        invoice.paid_amount += payment.amount;
        invoice.balance = Math.max(0, invoice.total_amount - invoice.paid_amount);

        if (invoice.balance === 0) {
          invoice.status = 'paid';
        } else if (invoice.balance < invoice.total_amount) {
          invoice.status = 'paid'; // Partial payment
        }

        // Update guest account
        const account = mockGuestAccounts.find(a => a.id === invoice.guest_account_id);
        if (account) {
          account.current_balance -= payment.amount;
          account.total_paid += payment.amount;
          account.last_activity = new Date().toISOString().split('T')[0];
        }
      }

      return newPayment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['guest-accounts'] });
    },
  });

  // Guest Account Operations
  const createGuestAccount = useMutation({
    mutationFn: async (account: Omit<GuestAccount, 'id' | 'current_balance' | 'total_charged' | 'total_paid' | 'last_activity'>) => {
      const newAccount: GuestAccount = {
        ...account,
        id: `GA${String(Math.max(...mockGuestAccounts.map(a => parseInt(a.id.slice(2))), 0) + 1).padStart(3, '0')}`,
        current_balance: 0,
        total_charged: 0,
        total_paid: 0,
        last_activity: new Date().toISOString().split('T')[0],
      };
      mockGuestAccounts.push(newAccount);
      return newAccount;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['guest-accounts'] }),
  });

  // Reports
  const generateReport = useMutation({
    mutationFn: async ({ type, startDate, endDate }: { type: BillingReport['report_type']; startDate: string; endDate: string }) => {
      // Generate mock report data
      const reportData: BillingReport = {
        id: `report-${Date.now()}`,
        report_type: type,
        date_range: { start: startDate, end: endDate },
        generated_at: new Date().toISOString(),
        data: {},
      };

      switch (type) {
        case 'daily_revenue':
          reportData.total_revenue = mockInvoices
            .filter(i => i.issue_date >= startDate && i.issue_date <= endDate)
            .reduce((sum, i) => sum + i.total_amount, 0);
          break;
        case 'outstanding_balances':
          reportData.outstanding_balance = mockInvoices
            .filter(i => i.status !== 'paid' && i.status !== 'cancelled')
            .reduce((sum, i) => sum + i.balance, 0);
          break;
        // Add more report types as needed
      }

      return reportData;
    },
  });

  // Invoice Templates
  const { data: invoiceTemplates } = useQuery({
    queryKey: ['invoice-templates'],
    queryFn: async () => mockInvoiceTemplates,
  });

  const createInvoiceTemplate = useMutation({
    mutationFn: async (template: Omit<InvoiceTemplate, 'id' | 'created_at'>) => {
      const newTemplate: InvoiceTemplate = {
        ...template,
        id: `T${String(Math.max(...mockInvoiceTemplates.map(t => parseInt(t.id.slice(1))), 0) + 1).padStart(3, '0')}`,
        created_at: new Date().toISOString(),
      };
      mockInvoiceTemplates.push(newTemplate);
      return newTemplate;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoice-templates'] }),
  });

  // Advanced Invoice Operations
  const addLineItem = useMutation({
    mutationFn: async ({ invoiceId, lineItem }: { invoiceId: number; lineItem: Omit<InvoiceLineItem, 'id'> }) => {
      const invoice = mockInvoices.find(i => i.id === invoiceId);
      if (invoice) {
        const newLineItem: InvoiceLineItem = {
          ...lineItem,
          id: `li${Date.now()}`,
        };
        invoice.line_items.push(newLineItem);

        // Recalculate totals
        invoice.subtotal = invoice.line_items.reduce((sum, item) => sum + item.total, 0);
        invoice.tax_amount = invoice.line_items.reduce((sum, item) => sum + (item.tax_amount || 0), 0);
        invoice.total_amount = invoice.subtotal + invoice.tax_amount - invoice.discount_amount;
        invoice.balance = invoice.total_amount - invoice.paid_amount;

        // Log operation
        mockBillingOperations.push({
          id: `op${Date.now()}`,
          operation_type: 'add_line_item',
          invoice_id: invoiceId,
          description: `Added line item: ${lineItem.description}`,
          changes: { lineItem: newLineItem },
          performed_by: 'System',
          performed_at: new Date().toISOString(),
          status: 'completed',
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  });

  const updateLineItem = useMutation({
    mutationFn: async ({ invoiceId, lineItemId, updates }: { invoiceId: number; lineItemId: string; updates: Partial<InvoiceLineItem> }) => {
      const invoice = mockInvoices.find(i => i.id === invoiceId);
      if (invoice) {
        const lineItem = invoice.line_items.find(li => li.id === lineItemId);
        if (lineItem) {
          Object.assign(lineItem, updates);

          // Recalculate totals
          invoice.subtotal = invoice.line_items.reduce((sum, item) => sum + item.total, 0);
          invoice.tax_amount = invoice.line_items.reduce((sum, item) => sum + (item.tax_amount || 0), 0);
          invoice.total_amount = invoice.subtotal + invoice.tax_amount - invoice.discount_amount;
          invoice.balance = invoice.total_amount - invoice.paid_amount;
        }
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  });

  const removeLineItem = useMutation({
    mutationFn: async ({ invoiceId, lineItemId }: { invoiceId: number; lineItemId: string }) => {
      const invoice = mockInvoices.find(i => i.id === invoiceId);
      if (invoice) {
        const lineItemIndex = invoice.line_items.findIndex(li => li.id === lineItemId);
        if (lineItemIndex !== -1) {
          const removedItem = invoice.line_items.splice(lineItemIndex, 1)[0];

          // Recalculate totals
          invoice.subtotal = invoice.line_items.reduce((sum, item) => sum + item.total, 0);
          invoice.tax_amount = invoice.line_items.reduce((sum, item) => sum + (item.tax_amount || 0), 0);
          invoice.total_amount = invoice.subtotal + invoice.tax_amount - invoice.discount_amount;
          invoice.balance = invoice.total_amount - invoice.paid_amount;

          // Log operation
          mockBillingOperations.push({
            id: `op${Date.now()}`,
            operation_type: 'remove_line_item',
            invoice_id: invoiceId,
            description: `Removed line item: ${removedItem.description}`,
            changes: { removedItem },
            performed_by: 'System',
            performed_at: new Date().toISOString(),
            status: 'completed',
          });
        }
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  });

  // Account Splitting
  const splitAccount = useMutation({
    mutationFn: async ({ invoiceId, splits, reason }: {
      invoiceId: number;
      splits: { guest_account_id: string; percentage: number; fixed_amount?: number }[];
      reason: string;
    }) => {
      const originalInvoice = mockInvoices.find(i => i.id === invoiceId);
      if (!originalInvoice) throw new Error('Invoice not found');

      const splitAccountData: SplitAccount = {
        id: `SA${Date.now()}`,
        original_invoice_id: invoiceId,
        split_reason: reason,
        created_at: new Date().toISOString(),
        created_by: 'System',
        splits: splits.map(split => ({
          guest_account_id: split.guest_account_id,
          percentage: split.percentage,
          fixed_amount: split.fixed_amount,
          line_items: [],
          folio_id: `F${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
        })),
      };

      // Create separate invoices for each split
      splits.forEach((split, index) => {
        const splitAmount = split.fixed_amount || (originalInvoice.total_amount * split.percentage / 100);
        const splitInvoice: Invoice = {
          ...originalInvoice,
          id: Math.max(...mockInvoices.map(i => i.id), 0) + index + 1,
          guest_account_id: split.guest_account_id,
          invoice_number: `${originalInvoice.invoice_number}-SPLIT${index + 1}`,
          total_amount: splitAmount,
          balance: splitAmount,
          paid_amount: 0,
          payments: [],
          line_items: originalInvoice.line_items.map(item => ({
            ...item,
            total: item.total * (split.percentage / 100),
          })),
        };
        mockInvoices.push(splitInvoice);
      });

      mockSplitAccounts.push(splitAccountData);

      // Log operation
      mockBillingOperations.push({
        id: `op${Date.now()}`,
        operation_type: 'split_account',
        invoice_id: invoiceId,
        description: `Split account: ${reason}`,
        changes: { splitAccountData },
        performed_by: 'System',
        performed_at: new Date().toISOString(),
        status: 'completed',
      });

      return splitAccountData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['split-accounts'] });
    },
  });

  // Payment Transfer
  const transferPayment = useMutation({
    mutationFn: async ({ fromInvoiceId, toInvoiceId, amount, reason }: {
      fromInvoiceId: number;
      toInvoiceId: number;
      amount: number;
      reason: string;
    }) => {
      const fromInvoice = mockInvoices.find(i => i.id === fromInvoiceId);
      const toInvoice = mockInvoices.find(i => i.id === toInvoiceId);

      if (!fromInvoice || !toInvoice) throw new Error('Invoice not found');
      if (fromInvoice.paid_amount < amount) throw new Error('Insufficient payment amount');

      // Transfer payment
      fromInvoice.paid_amount -= amount;
      fromInvoice.balance += amount;

      toInvoice.paid_amount += amount;
      toInvoice.balance -= amount;

      if (toInvoice.balance <= 0) {
        toInvoice.status = 'paid';
      }

      // Update guest accounts
      const fromAccount = mockGuestAccounts.find(a => a.id === fromInvoice.guest_account_id);
      const toAccount = mockGuestAccounts.find(a => a.id === toInvoice.guest_account_id);

      if (fromAccount) {
        fromAccount.current_balance += amount;
        fromAccount.total_paid -= amount;
      }
      if (toAccount) {
        toAccount.current_balance -= amount;
        toAccount.total_paid += amount;
      }

      // Log operation
      mockBillingOperations.push({
        id: `op${Date.now()}`,
        operation_type: 'transfer_payment',
        description: `Transferred $${amount} from invoice ${fromInvoiceId} to ${toInvoiceId}: ${reason}`,
        changes: { fromInvoiceId, toInvoiceId, amount, reason },
        performed_by: 'System',
        performed_at: new Date().toISOString(),
        status: 'completed',
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  });

  // Void Invoice
  const voidInvoice = useMutation({
    mutationFn: async ({ invoiceId, reason }: { invoiceId: number; reason: string }) => {
      const invoice = mockInvoices.find(i => i.id === invoiceId);
      if (!invoice) throw new Error('Invoice not found');

      invoice.status = 'cancelled';
      invoice.balance = 0;

      // Update guest account
      const account = mockGuestAccounts.find(a => a.id === invoice.guest_account_id);
      if (account) {
        account.current_balance -= invoice.total_amount;
        account.total_charged -= invoice.total_amount;
      }

      // Log operation
      mockBillingOperations.push({
        id: `op${Date.now()}`,
        operation_type: 'void_invoice',
        invoice_id: invoiceId,
        description: `Voided invoice: ${reason}`,
        changes: { reason },
        performed_by: 'System',
        performed_at: new Date().toISOString(),
        status: 'completed',
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  });

  return {
    // Data
    invoices,
    guestAccounts,
    taxRates,
    invoiceTemplates,
    isLoading,

    // Invoice operations
    createInvoice,
    updateInvoice,
    deleteInvoice,

    // Line item operations
    addLineItem,
    updateLineItem,
    removeLineItem,

    // Payment operations
    addPayment,

    // Advanced operations
    splitAccount,
    transferPayment,
    voidInvoice,

    // Guest account operations
    createGuestAccount,

    // Templates
    createInvoiceTemplate,

    // Reports
    generateReport,
  };
}