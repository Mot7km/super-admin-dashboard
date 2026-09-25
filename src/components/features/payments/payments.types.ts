export type PaymentStatus =
  | 'successful'
  | 'failed'
  | 'refunded'
  | 'pending'
  | 'disputed';

export type PaymentMethodType =
  | 'credit_card'
  | 'apple_pay'
  | 'google_pay'
  | 'mada'
  | 'fawry'
  | 'bank_transfer'
  | 'digital_wallet';

export type CardBrand = 'visa' | 'mastercard' | 'mada' | 'amex';

export type PaymentProviderId =
  | 'stripe'
  | 'paymob'
  | 'geidea'
  | 'hyperpay'
  | 'checkout_com'
  | 'tap';

export type ProviderHealthStatus =
  | 'operational'
  | 'degraded_performance'
  | 'partial_outage'
  | 'maintenance';

export type RevenuePeriod = 'today' | 'month' | 'year' | 'custom';

export type PaymentTransaction = {
  id: string; // e.g. 'txn_9041'
  invoiceId?: string;
  businessId: string;
  businessName: string;
  amount: number;
  currency: 'EGP' | 'SAR' | 'AED' | 'USD';
  status: PaymentStatus;
  failureReason?: string; // e.g. 'card_declined', 'insufficient_funds', '3ds_timeout'
  failureCode?: string;
  paymentMethod: PaymentMethodType;
  cardBrand?: CardBrand;
  cardLast4?: string;
  provider: PaymentProviderId;
  providerTxnRef: string;
  fee: number;
  net: number;
  customerName: string;
  customerEmail: string;
  createdAt: string; // ISO
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: string;
  riskScore?: number; // 0-100
  ipAddress?: string;
  country?: string;
};

export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue' | 'draft' | 'void';

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type Invoice = {
  id: string; // e.g. 'inv_2026_091'
  invoiceNumber: string; // e.g. 'INV-2026-0091'
  businessId: string;
  businessName: string;
  planTier: string;
  periodStart: string;
  periodEnd: string;
  subtotal: number;
  taxRate: number; // e.g. 0.14 or 0.15
  taxAmount: number;
  total: number;
  currency: 'EGP' | 'SAR' | 'AED' | 'USD';
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string;
  items: InvoiceItem[];
  paymentMethodUsed?: string;
  transactionId?: string;
  taxNumber?: string;
};

export type PaymentProviderStatus = {
  id: PaymentProviderId;
  name: string;
  logo: string;
  status: ProviderHealthStatus;
  latencyMs: number;
  uptimePercent: number;
  successRatePercent: number;
  activeIncidentsCount: number;
  lastChecked: string;
  supportedCurrencies: string[];
  supportedMethods: PaymentMethodType[];
  primaryForCurrencies: string[];
};

export type RevenueSummary = {
  period: RevenuePeriod;
  grossVolume: number;
  netRevenue: number;
  totalTransactionsCount: number;
  successfulCount: number;
  failedCount: number;
  refundedVolume: number;
  refundCount: number;
  successRate: number;
  avgOrderValue: number;
  growthVsPrevious: number; // percentage e.g. 18.4
  sparkline: number[];
};

export type PaymentFilterState = {
  activeTab: 'transactions' | 'invoices' | 'gateways' | 'methods';
  revenuePeriod: RevenuePeriod;
  customStartDate: string;
  customEndDate: string;
  status: 'all' | PaymentStatus;
  provider: 'all' | PaymentProviderId;
  method: 'all' | PaymentMethodType;
  business: string; // 'all' or businessId
  search: string;
  sortBy: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
  page: number;
  pageSize: number;
};

export type PaymentModalAction =
  | { type: 'refund'; transaction: PaymentTransaction }
  | { type: 'view_transaction'; transaction: PaymentTransaction }
  | { type: 'retry_payment'; transaction: PaymentTransaction }
  | { type: 'view_invoice'; invoice: Invoice }
  | { type: 'create_invoice' }
  | { type: 'gateway_details'; provider: PaymentProviderStatus }
  | null;
