// 5.7 Cross-Border & Global Payroll — Mock Data & Types

export interface CurrencyConfig {
  id: string;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  baseCurrency: boolean;
  lastUpdated: string;
  autoUpdate: boolean;
  status: "active" | "inactive";
}

export interface InternationalPayment {
  id: string;
  employeeId: string;
  employeeName: string;
  country: string;
  currency: string;
  localAmount: number;
  baseAmount: number;
  exchangeRate: number;
  bankName: string;
  swiftCode: string;
  iban: string;
  paymentMethod: "swift" | "local-transfer" | "wallet";
  period: string;
  initiatedAt: string;
  completedAt: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  fees: number;
}

export interface CountryTaxConfig {
  id: string;
  country: string;
  countryCode: string;
  currency: string;
  taxSystem: string;
  employeeTaxRate: number;
  employerTaxRate: number;
  socialSecurity: number;
  healthInsurance: number;
  pensionRate: number;
  otherDeductions: number;
  totalEmployeeBurden: number;
  totalEmployerBurden: number;
  effectiveFrom: string;
  status: "active" | "draft";
  employeeCount: number;
}

export interface EmployeeWalletAdmin {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  wallets: WalletBalance[];
  totalValueNGN: number;
  lastTransaction: string;
  status: "active" | "frozen" | "inactive";
}

export interface WalletBalance {
  currency: string;
  balance: number;
  lastUpdated: string;
}

export const CURRENCY_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: "Active", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  inactive: { label: "Inactive", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
};

export const INTL_PAYMENT_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: "Pending", bg: "bg-amber-50 border-amber-200", color: "text-amber-700" },
  processing: { label: "Processing", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
  completed: { label: "Completed", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  failed: { label: "Failed", bg: "bg-red-50 border-red-200", color: "text-red-700" },
};

export const WALLET_STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: "Active", bg: "bg-emerald-50 border-emerald-200", color: "text-emerald-700" },
  frozen: { label: "Frozen", bg: "bg-blue-50 border-blue-200", color: "text-blue-700" },
  inactive: { label: "Inactive", bg: "bg-gray-50 border-gray-200", color: "text-gray-700" },
};

export const MOCK_CURRENCIES: CurrencyConfig[] = [
  { id: "cur-1", code: "NGN", name: "Nigerian Naira", symbol: "₦", exchangeRate: 1, baseCurrency: true, lastUpdated: "2026-03-25", autoUpdate: false, status: "active" },
  { id: "cur-2", code: "USD", name: "US Dollar", symbol: "$", exchangeRate: 1580, baseCurrency: false, lastUpdated: "2026-03-25", autoUpdate: true, status: "active" },
  { id: "cur-3", code: "GBP", name: "British Pound", symbol: "£", exchangeRate: 2010, baseCurrency: false, lastUpdated: "2026-03-25", autoUpdate: true, status: "active" },
  { id: "cur-4", code: "EUR", name: "Euro", symbol: "€", exchangeRate: 1720, baseCurrency: false, lastUpdated: "2026-03-25", autoUpdate: true, status: "active" },
  { id: "cur-5", code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵", exchangeRate: 105, baseCurrency: false, lastUpdated: "2026-03-25", autoUpdate: true, status: "active" },
  { id: "cur-6", code: "KES", name: "Kenyan Shilling", symbol: "KSh", exchangeRate: 12.2, baseCurrency: false, lastUpdated: "2026-03-25", autoUpdate: true, status: "active" },
  { id: "cur-7", code: "ZAR", name: "South African Rand", symbol: "R", exchangeRate: 86, baseCurrency: false, lastUpdated: "2026-03-24", autoUpdate: true, status: "inactive" },
];

export const MOCK_INTERNATIONAL_PAYMENTS: InternationalPayment[] = [
  { id: "ip-1", employeeId: "EMP-020", employeeName: "James Okonkwo", country: "United Kingdom", currency: "GBP", localAmount: 3500, baseAmount: 7035000, exchangeRate: 2010, bankName: "Barclays Bank", swiftCode: "BARCGB22", iban: "GB82WEST12345698765432", paymentMethod: "swift", period: "February 2026", initiatedAt: "2026-02-25T10:00:00", completedAt: "2026-02-27T14:00:00", status: "completed", fees: 25000 },
  { id: "ip-2", employeeId: "EMP-021", employeeName: "Amara Osei", country: "Ghana", currency: "GHS", localAmount: 15000, baseAmount: 1575000, exchangeRate: 105, bankName: "Ecobank Ghana", swiftCode: "EABORIGH", iban: "", paymentMethod: "local-transfer", period: "February 2026", initiatedAt: "2026-02-25T10:00:00", completedAt: "2026-02-26T09:00:00", status: "completed", fees: 5000 },
  { id: "ip-3", employeeId: "EMP-022", employeeName: "David Kamau", country: "Kenya", currency: "KES", localAmount: 250000, baseAmount: 3050000, exchangeRate: 12.2, bankName: "KCB Bank", swiftCode: "KCBLKENA", iban: "", paymentMethod: "local-transfer", period: "February 2026", initiatedAt: "2026-02-25T10:00:00", completedAt: "2026-02-26T11:00:00", status: "completed", fees: 8000 },
  { id: "ip-4", employeeId: "EMP-020", employeeName: "James Okonkwo", country: "United Kingdom", currency: "GBP", localAmount: 3500, baseAmount: 7035000, exchangeRate: 2010, bankName: "Barclays Bank", swiftCode: "BARCGB22", iban: "GB82WEST12345698765432", paymentMethod: "swift", period: "March 2026", initiatedAt: "2026-03-25T10:00:00", completedAt: null, status: "pending", fees: 25000 },
  { id: "ip-5", employeeId: "EMP-023", employeeName: "Sarah Miller", country: "United States", currency: "USD", localAmount: 5200, baseAmount: 8216000, exchangeRate: 1580, bankName: "Chase Bank", swiftCode: "CHASUS33", iban: "", paymentMethod: "swift", period: "March 2026", initiatedAt: "2026-03-25T10:00:00", completedAt: null, status: "processing", fees: 35000 },
];

export const MOCK_COUNTRY_TAX_CONFIGS: CountryTaxConfig[] = [
  { id: "ctc-1", country: "Nigeria", countryCode: "NG", currency: "NGN", taxSystem: "PAYE (Progressive)", employeeTaxRate: 24, employerTaxRate: 0, socialSecurity: 0, healthInsurance: 5, pensionRate: 8, otherDeductions: 2.5, totalEmployeeBurden: 39.5, totalEmployerBurden: 10, effectiveFrom: "2026-01-01", status: "active", employeeCount: 148 },
  { id: "ctc-2", country: "United Kingdom", countryCode: "GB", currency: "GBP", taxSystem: "PAYE (Progressive)", employeeTaxRate: 40, employerTaxRate: 13.8, socialSecurity: 12, healthInsurance: 0, pensionRate: 5, otherDeductions: 0, totalEmployeeBurden: 57, totalEmployerBurden: 18.8, effectiveFrom: "2026-01-01", status: "active", employeeCount: 3 },
  { id: "ctc-3", country: "Ghana", countryCode: "GH", currency: "GHS", taxSystem: "PAYE (Progressive)", employeeTaxRate: 30, employerTaxRate: 0, socialSecurity: 5.5, healthInsurance: 0, pensionRate: 5.5, otherDeductions: 0, totalEmployeeBurden: 41, totalEmployerBurden: 13, effectiveFrom: "2026-01-01", status: "active", employeeCount: 2 },
  { id: "ctc-4", country: "Kenya", countryCode: "KE", currency: "KES", taxSystem: "PAYE (Progressive)", employeeTaxRate: 30, employerTaxRate: 0, socialSecurity: 6, healthInsurance: 1.5, pensionRate: 6, otherDeductions: 1.5, totalEmployeeBurden: 45, totalEmployerBurden: 7.5, effectiveFrom: "2026-01-01", status: "active", employeeCount: 2 },
  { id: "ctc-5", country: "United States", countryCode: "US", currency: "USD", taxSystem: "Federal + State", employeeTaxRate: 37, employerTaxRate: 7.65, socialSecurity: 6.2, healthInsurance: 0, pensionRate: 0, otherDeductions: 1.45, totalEmployeeBurden: 44.65, totalEmployerBurden: 7.65, effectiveFrom: "2026-01-01", status: "active", employeeCount: 1 },
];

export const MOCK_EMPLOYEE_WALLETS_ADMIN: EmployeeWalletAdmin[] = [
  { id: "ew-1", employeeId: "EMP-020", employeeName: "James Okonkwo", department: "Engineering", wallets: [{ currency: "NGN", balance: 250000, lastUpdated: "2026-03-20" }, { currency: "GBP", balance: 500, lastUpdated: "2026-03-18" }], totalValueNGN: 1255000, lastTransaction: "2026-03-20", status: "active" },
  { id: "ew-2", employeeId: "EMP-021", employeeName: "Amara Osei", department: "Marketing", wallets: [{ currency: "NGN", balance: 180000, lastUpdated: "2026-03-22" }, { currency: "GHS", balance: 2000, lastUpdated: "2026-03-15" }], totalValueNGN: 390000, lastTransaction: "2026-03-22", status: "active" },
  { id: "ew-3", employeeId: "EMP-022", employeeName: "David Kamau", department: "Sales", wallets: [{ currency: "NGN", balance: 120000, lastUpdated: "2026-03-19" }, { currency: "KES", balance: 50000, lastUpdated: "2026-03-10" }], totalValueNGN: 730000, lastTransaction: "2026-03-19", status: "active" },
  { id: "ew-4", employeeId: "EMP-023", employeeName: "Sarah Miller", department: "Product", wallets: [{ currency: "NGN", balance: 0, lastUpdated: "2026-01-10" }, { currency: "USD", balance: 1200, lastUpdated: "2026-03-01" }], totalValueNGN: 1896000, lastTransaction: "2026-03-01", status: "active" },
  { id: "ew-5", employeeId: "EMP-024", employeeName: "Chen Wei", department: "Engineering", wallets: [{ currency: "NGN", balance: 50000, lastUpdated: "2025-12-15" }], totalValueNGN: 50000, lastTransaction: "2025-12-15", status: "frozen" },
];
