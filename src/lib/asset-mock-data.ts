import type {
  Asset,
  AssetCategory,
  AssignmentRecord,
  AssignmentApproval,
  AssetTransfer,
  ReturnRequest,
  ConditionEntry,
  MaintenanceRecord,
  MaintenanceRequest,
  DepreciationEntry,
  DisposalRecord,
  AssetRequest,
  DamageReport,
  WarrantyInfo,
  AssetNotification,
} from "@/types/asset";

// --- Categories ---
export const MOCK_ASSET_CATEGORIES: AssetCategory[] = [
  { id: "cat-1", name: "Laptops", icon: "laptop", color: "text-blue-600", assetCount: 45, defaultDepreciationMethod: "straight-line", defaultUsefulLife: 36, defaultMaintenanceFrequency: 12, subCategories: [{ id: "sub-1", name: "MacBook", assetCount: 20 }, { id: "sub-2", name: "Windows Laptop", assetCount: 25 }] },
  { id: "cat-2", name: "Monitors", icon: "monitor", color: "text-violet-600", assetCount: 38, defaultDepreciationMethod: "straight-line", defaultUsefulLife: 48, defaultMaintenanceFrequency: 24, subCategories: [{ id: "sub-3", name: "24-inch", assetCount: 20 }, { id: "sub-4", name: "27-inch", assetCount: 18 }] },
  { id: "cat-3", name: "Phones", icon: "smartphone", color: "text-emerald-600", assetCount: 22, defaultDepreciationMethod: "straight-line", defaultUsefulLife: 24, defaultMaintenanceFrequency: 12, subCategories: [{ id: "sub-5", name: "iPhone", assetCount: 12 }, { id: "sub-6", name: "Android", assetCount: 10 }] },
  { id: "cat-4", name: "Furniture", icon: "armchair", color: "text-amber-600", assetCount: 60, defaultDepreciationMethod: "straight-line", defaultUsefulLife: 84, defaultMaintenanceFrequency: 0, subCategories: [{ id: "sub-7", name: "Desk", assetCount: 30 }, { id: "sub-8", name: "Chair", assetCount: 30 }] },
  { id: "cat-5", name: "Vehicles", icon: "car", color: "text-red-600", assetCount: 8, defaultDepreciationMethod: "declining-balance", defaultUsefulLife: 60, defaultMaintenanceFrequency: 6, subCategories: [{ id: "sub-9", name: "Sedan", assetCount: 5 }, { id: "sub-10", name: "SUV", assetCount: 3 }] },
  { id: "cat-6", name: "Networking", icon: "wifi", color: "text-cyan-600", assetCount: 15, defaultDepreciationMethod: "straight-line", defaultUsefulLife: 48, defaultMaintenanceFrequency: 12, subCategories: [{ id: "sub-11", name: "Router", assetCount: 8 }, { id: "sub-12", name: "Switch", assetCount: 7 }] },
  { id: "cat-7", name: "Printers", icon: "printer", color: "text-slate-600", assetCount: 12, defaultDepreciationMethod: "straight-line", defaultUsefulLife: 48, defaultMaintenanceFrequency: 6, subCategories: [{ id: "sub-13", name: "Laser", assetCount: 8 }, { id: "sub-14", name: "Inkjet", assetCount: 4 }] },
  { id: "cat-8", name: "Other", icon: "box", color: "text-gray-600", assetCount: 10, defaultDepreciationMethod: "straight-line", defaultUsefulLife: 36, defaultMaintenanceFrequency: 0, subCategories: [] },
];

// --- Assets ---
export const MOCK_ASSETS: Asset[] = [
  { id: "ast-1", name: "MacBook Pro 16\" M3", tag: "SHR-LAP-001", description: "16-inch MacBook Pro with M3 Pro chip", categoryId: "cat-1", categoryName: "Laptops", subCategoryId: "sub-1", status: "assigned", condition: "good", location: "Lagos Office", branch: "Head Office - Victoria Island", assignedTo: "emp-001", assignedToName: "Adebayo Ogunlesi", assignedDate: "2025-09-15", purchaseDate: "2025-08-01", purchasePrice: 1250000, vendor: "iStore Nigeria", warrantyExpiry: "2027-08-01", warrantyProvider: "Apple", model: "MacBook Pro 16\" 2024", serialNumber: "C02X1234HDKQ", specifications: { "Processor": "M3 Pro", "RAM": "18GB", "Storage": "512GB SSD", "Display": "16.2\" Liquid Retina XDR" }, depreciationMethod: "straight-line", usefulLifeMonths: 36, currentBookValue: 937500, salvageValue: 125000, photos: [], documents: [{ id: "adoc-1", name: "Purchase Invoice", type: "invoice", fileName: "invoice_macbook_001.pdf", uploadDate: "2025-08-05", size: "245 KB" }], createdAt: "2025-08-05T10:00:00Z", updatedAt: "2025-09-15T14:00:00Z" },
  { id: "ast-2", name: "Dell UltraSharp 27\" 4K", tag: "SHR-MON-001", description: "27-inch 4K USB-C monitor", categoryId: "cat-2", categoryName: "Monitors", subCategoryId: "sub-4", status: "assigned", condition: "good", location: "Lagos Office", branch: "Head Office - Victoria Island", assignedTo: "emp-001", assignedToName: "Adebayo Ogunlesi", assignedDate: "2025-09-15", purchaseDate: "2025-08-01", purchasePrice: 450000, vendor: "Dell Nigeria", warrantyExpiry: "2028-08-01", warrantyProvider: "Dell", model: "U2723QE", serialNumber: "CN-0ABC123-456", specifications: { "Resolution": "3840 x 2160", "Panel": "IPS", "Ports": "USB-C, HDMI, DP" }, depreciationMethod: "straight-line", usefulLifeMonths: 48, currentBookValue: 375000, salvageValue: 50000, photos: [], documents: [], createdAt: "2025-08-05T10:00:00Z", updatedAt: "2025-09-15T14:00:00Z" },
  { id: "ast-3", name: "iPhone 15 Pro", tag: "SHR-PHN-001", description: "Company phone for senior staff", categoryId: "cat-3", categoryName: "Phones", subCategoryId: "sub-5", status: "assigned", condition: "good", location: "Lagos Office", branch: "Head Office - Victoria Island", assignedTo: "emp-002", assignedToName: "Chiamaka Eze", assignedDate: "2025-10-01", purchaseDate: "2025-09-20", purchasePrice: 850000, vendor: "iStore Nigeria", warrantyExpiry: "2026-09-20", warrantyProvider: "Apple", model: "iPhone 15 Pro 256GB", serialNumber: "DNQX123456789", specifications: { "Storage": "256GB", "Color": "Natural Titanium" }, depreciationMethod: "straight-line", usefulLifeMonths: 24, currentBookValue: 495833, salvageValue: 100000, photos: [], documents: [], createdAt: "2025-09-25T09:00:00Z", updatedAt: "2025-10-01T10:00:00Z" },
  { id: "ast-4", name: "Herman Miller Aeron Chair", tag: "SHR-FRN-001", description: "Ergonomic office chair, size B", categoryId: "cat-4", categoryName: "Furniture", subCategoryId: "sub-8", status: "assigned", condition: "good", location: "Lagos Office", branch: "Head Office - Victoria Island", assignedTo: "emp-003", assignedToName: "Oluwaseun Afolabi", assignedDate: "2025-09-01", purchaseDate: "2025-08-15", purchasePrice: 320000, vendor: "Workspace Solutions", warrantyExpiry: "2037-08-15", warrantyProvider: "Herman Miller", model: "Aeron Size B", serialNumber: "HM-AER-2025-001", specifications: { "Size": "B (Medium)", "Color": "Graphite" }, depreciationMethod: "straight-line", usefulLifeMonths: 84, currentBookValue: 292857, salvageValue: 50000, photos: [], documents: [], createdAt: "2025-08-20T10:00:00Z", updatedAt: "2025-09-01T10:00:00Z" },
  { id: "ast-5", name: "ThinkPad X1 Carbon Gen 11", tag: "SHR-LAP-002", description: "14-inch business ultrabook", categoryId: "cat-1", categoryName: "Laptops", subCategoryId: "sub-2", status: "available", condition: "new", location: "Lagos Office", branch: "Head Office - Victoria Island", assignedTo: null, assignedToName: null, assignedDate: null, purchaseDate: "2026-02-15", purchasePrice: 980000, vendor: "Lenovo Nigeria", warrantyExpiry: "2029-02-15", warrantyProvider: "Lenovo", model: "X1 Carbon Gen 11", serialNumber: "PF-4A1234", specifications: { "Processor": "Intel i7-1365U", "RAM": "16GB", "Storage": "512GB SSD" }, depreciationMethod: "straight-line", usefulLifeMonths: 36, currentBookValue: 953889, salvageValue: 100000, photos: [], documents: [], createdAt: "2026-02-20T10:00:00Z", updatedAt: "2026-02-20T10:00:00Z" },
  { id: "ast-6", name: "Toyota Camry 2024", tag: "SHR-VEH-001", description: "Company sedan for executives", categoryId: "cat-5", categoryName: "Vehicles", subCategoryId: "sub-9", status: "assigned", condition: "good", location: "Lagos", branch: "Head Office - Victoria Island", assignedTo: "emp-004", assignedToName: "Fatima Abdullahi", assignedDate: "2025-06-01", purchaseDate: "2025-05-15", purchasePrice: 28000000, vendor: "Toyota Nigeria Ltd", warrantyExpiry: "2028-05-15", warrantyProvider: "Toyota", model: "Camry XLE 2024", serialNumber: "JTDKN3DU5A0123456", specifications: { "Engine": "2.5L Hybrid", "Color": "Celestial Silver", "Mileage": "12,500 km" }, depreciationMethod: "declining-balance", usefulLifeMonths: 60, currentBookValue: 22400000, salvageValue: 5000000, photos: [], documents: [{ id: "adoc-2", name: "Vehicle Registration", type: "other", fileName: "vehicle_reg_camry.pdf", uploadDate: "2025-05-20", size: "120 KB" }], createdAt: "2025-05-20T10:00:00Z", updatedAt: "2025-06-01T10:00:00Z" },
  { id: "ast-7", name: "HP LaserJet Pro M404dn", tag: "SHR-PRT-001", description: "Mono laser printer for general office use", categoryId: "cat-7", categoryName: "Printers", subCategoryId: "sub-13", status: "available", condition: "good", location: "Lagos Office", branch: "Head Office - Victoria Island", assignedTo: null, assignedToName: null, assignedDate: null, purchaseDate: "2025-07-10", purchasePrice: 185000, vendor: "HP Store Nigeria", warrantyExpiry: "2026-07-10", warrantyProvider: "HP", model: "LaserJet Pro M404dn", serialNumber: "VNB3T12345", specifications: { "Speed": "40 ppm", "Duplex": "Yes", "Connectivity": "USB, Ethernet" }, depreciationMethod: "straight-line", usefulLifeMonths: 48, currentBookValue: 148125, salvageValue: 20000, photos: [], documents: [], createdAt: "2025-07-15T10:00:00Z", updatedAt: "2025-07-15T10:00:00Z" },
  { id: "ast-8", name: "Cisco Catalyst 9200", tag: "SHR-NET-001", description: "24-port managed switch", categoryId: "cat-6", categoryName: "Networking", subCategoryId: "sub-12", status: "maintenance", condition: "fair", location: "Server Room", branch: "Head Office - Victoria Island", assignedTo: null, assignedToName: null, assignedDate: null, purchaseDate: "2025-03-01", purchasePrice: 650000, vendor: "Cisco Nigeria", warrantyExpiry: "2028-03-01", warrantyProvider: "Cisco", model: "C9200-24T", serialNumber: "FCW2512G1AB", specifications: { "Ports": "24x 1G", "PoE": "No", "Management": "Layer 3" }, depreciationMethod: "straight-line", usefulLifeMonths: 48, currentBookValue: 487500, salvageValue: 50000, photos: [], documents: [], createdAt: "2025-03-10T10:00:00Z", updatedAt: "2026-03-01T10:00:00Z" },
  { id: "ast-9", name: "Standing Desk — Electric", tag: "SHR-FRN-010", description: "Height-adjustable standing desk", categoryId: "cat-4", categoryName: "Furniture", subCategoryId: "sub-7", status: "available", condition: "new", location: "Abuja Office", branch: "Abuja Branch", assignedTo: null, assignedToName: null, assignedDate: null, purchaseDate: "2026-01-20", purchasePrice: 180000, vendor: "Workspace Solutions", warrantyExpiry: "2029-01-20", warrantyProvider: "FlexiSpot", model: "E7 Pro", serialNumber: "FS-E7-2026-042", specifications: { "Width": "160cm", "Height Range": "58-123cm", "Motor": "Dual" }, depreciationMethod: "straight-line", usefulLifeMonths: 84, currentBookValue: 175714, salvageValue: 20000, photos: [], documents: [], createdAt: "2026-01-25T10:00:00Z", updatedAt: "2026-01-25T10:00:00Z" },
  { id: "ast-10", name: "MacBook Air 15\" M3", tag: "SHR-LAP-010", description: "15-inch MacBook Air for design team", categoryId: "cat-1", categoryName: "Laptops", subCategoryId: "sub-1", status: "disposed", condition: "poor", location: "N/A", branch: "Head Office - Victoria Island", assignedTo: null, assignedToName: null, assignedDate: null, purchaseDate: "2023-06-01", purchasePrice: 950000, vendor: "iStore Nigeria", warrantyExpiry: "2025-06-01", warrantyProvider: "Apple", model: "MacBook Air 15\" M2", serialNumber: "C02Y9876HDKQ", specifications: { "Processor": "M2", "RAM": "16GB", "Storage": "256GB SSD" }, depreciationMethod: "straight-line", usefulLifeMonths: 36, currentBookValue: 0, salvageValue: 100000, photos: [], documents: [], createdAt: "2023-06-10T10:00:00Z", updatedAt: "2026-01-15T10:00:00Z" },
];

// --- Assignments ---
export const MOCK_ASSIGNMENTS: AssignmentRecord[] = [
  { id: "asgn-1", assetId: "ast-1", assetName: "MacBook Pro 16\" M3", assetTag: "SHR-LAP-001", employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", department: "Engineering", assignedBy: "Amina Bello", assignedDate: "2025-09-15", returnedDate: null, status: "active", notes: "Primary work laptop", acknowledged: true, acknowledgedDate: "2025-09-15" },
  { id: "asgn-2", assetId: "ast-2", assetName: "Dell UltraSharp 27\" 4K", assetTag: "SHR-MON-001", employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", department: "Engineering", assignedBy: "Amina Bello", assignedDate: "2025-09-15", returnedDate: null, status: "active", notes: "External monitor", acknowledged: true, acknowledgedDate: "2025-09-15" },
  { id: "asgn-3", assetId: "ast-3", assetName: "iPhone 15 Pro", assetTag: "SHR-PHN-001", employeeId: "emp-002", employeeName: "Chiamaka Eze", department: "Engineering", assignedBy: "Amina Bello", assignedDate: "2025-10-01", returnedDate: null, status: "active", notes: "Company phone", acknowledged: true, acknowledgedDate: "2025-10-01" },
  { id: "asgn-4", assetId: "ast-4", assetName: "Herman Miller Aeron Chair", assetTag: "SHR-FRN-001", employeeId: "emp-003", employeeName: "Oluwaseun Afolabi", department: "Engineering", assignedBy: "Fatima Abdullahi", assignedDate: "2025-09-01", returnedDate: null, status: "active", notes: "Ergonomic seating", acknowledged: true, acknowledgedDate: "2025-09-02" },
  { id: "asgn-5", assetId: "ast-6", assetName: "Toyota Camry 2024", assetTag: "SHR-VEH-001", employeeId: "emp-004", employeeName: "Fatima Abdullahi", department: "Human Resources", assignedBy: "Olufunke Adeyemi", assignedDate: "2025-06-01", returnedDate: null, status: "active", notes: "Executive vehicle", acknowledged: true, acknowledgedDate: "2025-06-01" },
];

// --- Approval Queue ---
export const MOCK_APPROVAL_QUEUE: AssignmentApproval[] = [
  { id: "apv-1", assetId: "ast-5", assetName: "ThinkPad X1 Carbon Gen 11", assetPhoto: "", categoryName: "Laptops", requestedBy: "Chiamaka Eze", targetEmployee: "Tochukwu Nwankwo", targetDepartment: "Engineering", requestDate: "2026-03-10", urgency: "standard", status: "pending", comment: "New hire needs a work laptop", slaDeadline: "2026-03-17" },
  { id: "apv-2", assetId: "ast-9", assetName: "Standing Desk — Electric", assetPhoto: "", categoryName: "Furniture", requestedBy: "Fatima Abdullahi", targetEmployee: "Aisha Mohammed", targetDepartment: "Finance", requestDate: "2026-03-08", urgency: "standard", status: "pending", comment: "Ergonomic request approved by HR", slaDeadline: "2026-03-15" },
  { id: "apv-3", assetId: "ast-7", assetName: "HP LaserJet Pro M404dn", assetPhoto: "", categoryName: "Printers", requestedBy: "Ibrahim Musa", targetEmployee: "Ibrahim Musa", targetDepartment: "Operations", requestDate: "2026-03-12", urgency: "urgent", status: "pending", comment: "Kano office printer broke down, need replacement urgently", slaDeadline: "2026-03-14" },
];

// --- Transfers ---
export const MOCK_TRANSFERS: AssetTransfer[] = [
  { id: "trf-1", assetId: "ast-3", assetName: "iPhone 15 Pro", assetTag: "SHR-PHN-001", fromEmployeeId: "emp-005", fromEmployeeName: "Emeka Okafor", toEmployeeId: "emp-002", toEmployeeName: "Chiamaka Eze", reason: "Role change — VP needs company phone", transferDate: "2025-10-01", conditionAtTransfer: "good", approvalStatus: "approved", approvedBy: "Fatima Abdullahi" },
];

// --- Return Requests ---
export const MOCK_RETURN_REQUESTS: ReturnRequest[] = [
  { id: "ret-1", assetId: "ast-4", assetName: "Herman Miller Aeron Chair", assetTag: "SHR-FRN-001", assetPhoto: "", employeeId: "emp-003", employeeName: "Oluwaseun Afolabi", reason: "leaving", selfAssessedCondition: "good", proposedDate: "2026-03-20", submittedDate: "2026-03-10", status: "submitted", branch: "Head Office - Victoria Island", categoryName: "Furniture" },
  { id: "ret-2", assetId: "ast-2", assetName: "Dell UltraSharp 27\" 4K", assetTag: "SHR-MON-001", assetPhoto: "", employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", reason: "upgrade", selfAssessedCondition: "good", proposedDate: "2026-03-25", submittedDate: "2026-03-12", status: "collection-scheduled", branch: "Head Office - Victoria Island", categoryName: "Monitors" },
];

// --- Condition History ---
export const MOCK_CONDITION_HISTORY: ConditionEntry[] = [
  { id: "cond-1", assetId: "ast-1", condition: "good", previousCondition: "new", notes: "Normal wear after 6 months of use. Minor scratches on bottom case.", photos: [], assessedBy: "Amina Bello", assessedDate: "2026-02-15" },
  { id: "cond-2", assetId: "ast-8", condition: "fair", previousCondition: "good", notes: "Some ports showing intermittent connectivity issues. Firmware updated.", photos: [], assessedBy: "IT Support", assessedDate: "2026-03-01" },
];

// --- Maintenance ---
export const MOCK_MAINTENANCE_RECORDS: MaintenanceRecord[] = [
  { id: "maint-1", assetId: "ast-8", assetName: "Cisco Catalyst 9200", type: "corrective", description: "Port connectivity repair and firmware update", vendor: "Cisco TAC", cost: 85000, date: "2026-03-01", nextDueDate: "2026-06-01", isRecurring: false, recurringFrequencyMonths: null, status: "completed" },
  { id: "maint-2", assetId: "ast-6", assetName: "Toyota Camry 2024", type: "preventive", description: "15,000 km service — oil, filters, brake check", vendor: "Toyota Service Center", cost: 120000, date: "2026-02-10", nextDueDate: "2026-08-10", isRecurring: true, recurringFrequencyMonths: 6, status: "completed" },
  { id: "maint-3", assetId: "ast-7", assetName: "HP LaserJet Pro M404dn", type: "preventive", description: "Toner replacement and cleaning", vendor: "HP Support", cost: 35000, date: "2026-01-15", nextDueDate: "2026-04-15", isRecurring: true, recurringFrequencyMonths: 3, status: "scheduled" },
  { id: "maint-4", assetId: "ast-1", assetName: "MacBook Pro 16\" M3", type: "inspection", description: "Annual IT audit and security check", vendor: "Internal IT", cost: 0, date: "2026-03-15", nextDueDate: "2027-03-15", isRecurring: true, recurringFrequencyMonths: 12, status: "scheduled" },
];

// --- Maintenance Requests (raised by employees or admin) ---
export const MOCK_MAINTENANCE_REQUESTS: MaintenanceRequest[] = [
  { id: "mr-1", assetId: "ast-1", assetName: "MacBook Pro 16\" M3", assetTag: "SHR-LAP-001", employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", type: "corrective", urgency: "high", description: "Fan noise has become much louder over the past week, temperatures are higher than normal under load.", preferredDate: "2026-04-22", submittedAt: "2026-04-18T09:15:00Z", status: "pending", reviewedBy: null, reviewedAt: null, reviewerNote: null },
  { id: "mr-2", assetId: "ast-7", assetName: "HP LaserJet Pro M404dn", assetTag: "SHR-PRT-001", employeeId: "emp-009", employeeName: "Ibrahim Musa", type: "preventive", urgency: "normal", description: "Toner low warning and output is fading. Request routine maintenance and toner replacement.", preferredDate: "2026-04-24", submittedAt: "2026-04-17T14:20:00Z", status: "pending", reviewedBy: null, reviewedAt: null, reviewerNote: null },
  { id: "mr-3", assetId: "ast-6", assetName: "Toyota Camry 2024", assetTag: "SHR-VEH-001", employeeId: "emp-005", employeeName: "Emeka Okafor", type: "inspection", urgency: "low", description: "Quarterly inspection — AC re-gassing and tyre rotation.", preferredDate: "2026-05-05", submittedAt: "2026-04-15T10:00:00Z", status: "approved", reviewedBy: "Amina Bello", reviewedAt: "2026-04-16T09:30:00Z", reviewerNote: "Approved — scheduled with Toyota Service Center." },
];

// --- Depreciation (for ast-1) ---
export const MOCK_DEPRECIATION_SCHEDULE: DepreciationEntry[] = [
  { period: "Sep 2025", openingValue: 1250000, charge: 31250, accumulated: 31250, closingValue: 1218750 },
  { period: "Oct 2025", openingValue: 1218750, charge: 31250, accumulated: 62500, closingValue: 1187500 },
  { period: "Nov 2025", openingValue: 1187500, charge: 31250, accumulated: 93750, closingValue: 1156250 },
  { period: "Dec 2025", openingValue: 1156250, charge: 31250, accumulated: 125000, closingValue: 1125000 },
  { period: "Jan 2026", openingValue: 1125000, charge: 31250, accumulated: 156250, closingValue: 1093750 },
  { period: "Feb 2026", openingValue: 1093750, charge: 31250, accumulated: 187500, closingValue: 1062500 },
  { period: "Mar 2026", openingValue: 1062500, charge: 31250, accumulated: 218750, closingValue: 1031250 },
];

// --- Disposals ---
export const MOCK_DISPOSALS: DisposalRecord[] = [
  { id: "disp-1", assetId: "ast-10", assetName: "MacBook Air 15\" M2", assetTag: "SHR-LAP-010", method: "sold", disposalValue: 150000, bookValueAtDisposal: 0, reason: "End of useful life, replaced with newer models", buyerOrRecipient: "Staff Purchase — Yetunde Bakare", disposalDate: "2026-01-15", approvalStatus: "approved", approvedBy: "Olufunke Adeyemi", certificateGenerated: true },
];

// --- Employee Asset Requests ---
export const MOCK_ASSET_REQUESTS: AssetRequest[] = [
  { id: "req-1", requestNumber: "AR-2026-001", employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", categoryId: "cat-2", categoryName: "Monitors", justification: "Need a second monitor for multi-tasking with design tools and IDE", urgency: "standard", preferredSpecs: "27-inch, 4K, USB-C", manager: "Chiamaka Eze", requestDate: "2026-03-05", status: "manager-approved", expectedDelivery: "2026-03-20", comments: [{ by: "Chiamaka Eze", text: "Approved — productivity need is valid", date: "2026-03-06" }] },
  { id: "req-2", requestNumber: "AR-2026-002", employeeId: "emp-007", employeeName: "Tochukwu Nwankwo", categoryId: "cat-1", categoryName: "Laptops", justification: "Current laptop is too slow for backend development and Docker containers", urgency: "urgent", preferredSpecs: "16GB RAM minimum, 512GB SSD", manager: "Chiamaka Eze", requestDate: "2026-03-10", status: "submitted", expectedDelivery: null, comments: [] },
  { id: "req-3", requestNumber: "AR-2026-003", employeeId: "emp-006", employeeName: "Aisha Mohammed", categoryId: "cat-4", categoryName: "Furniture", justification: "Back pain from regular chair, doctor recommended ergonomic seating", urgency: "standard", preferredSpecs: "Ergonomic chair with lumbar support", manager: "Ibrahim Musa", requestDate: "2026-03-08", status: "it-processing", expectedDelivery: "2026-03-18", comments: [{ by: "Ibrahim Musa", text: "Approved with medical recommendation", date: "2026-03-09" }, { by: "Amina Bello", text: "Checking inventory for available ergonomic chairs", date: "2026-03-10" }] },
];

// --- Damage Reports ---
export const MOCK_DAMAGE_REPORTS: DamageReport[] = [
  { id: "dmg-1", assetId: "ast-1", assetName: "MacBook Pro 16\" M3", assetTag: "SHR-LAP-001", employeeId: "emp-001", employeeName: "Adebayo Ogunlesi", issueType: "damaged", description: "Screen has a small crack on the bottom-left corner after accidental drop from desk", incidentDate: "2026-03-08", reportedDate: "2026-03-08", photos: [], status: "under-investigation", resolution: "" },
  { id: "dmg-2", assetId: "ast-7", assetName: "HP LaserJet Pro M404dn", assetTag: "SHR-PRT-001", employeeId: "emp-009", employeeName: "Ibrahim Musa", issueType: "malfunctioning", description: "Paper jam error keeps recurring, tried clearing but issue persists", incidentDate: "2026-03-11", reportedDate: "2026-03-11", photos: [], status: "submitted", resolution: "" },
];

// --- Warranty ---
export const MOCK_WARRANTIES: WarrantyInfo[] = [
  { assetId: "ast-1", assetName: "MacBook Pro 16\" M3", assetTag: "SHR-LAP-001", provider: "Apple", coverage: "Hardware defects, battery replacement", startDate: "2025-08-01", endDate: "2027-08-01", claimContact: "apple.com/support", claims: [] },
  { assetId: "ast-3", assetName: "iPhone 15 Pro", assetTag: "SHR-PHN-001", provider: "Apple", coverage: "Hardware defects", startDate: "2025-09-20", endDate: "2026-09-20", claimContact: "apple.com/support", claims: [] },
  { assetId: "ast-6", assetName: "Toyota Camry 2024", assetTag: "SHR-VEH-001", provider: "Toyota", coverage: "Powertrain, electrical, corrosion", startDate: "2025-05-15", endDate: "2028-05-15", claimContact: "toyota.com.ng/service", claims: [{ id: "wc-1", submissionDate: "2025-12-10", description: "AC compressor issue under warranty", status: "resolved", resolution: "Compressor replaced at no cost" }] },
  { assetId: "ast-7", assetName: "HP LaserJet Pro M404dn", assetTag: "SHR-PRT-001", provider: "HP", coverage: "Hardware defects, print head", startDate: "2025-07-10", endDate: "2026-07-10", claimContact: "hp.com/support", claims: [] },
];

// --- Notifications ---
export const MOCK_ASSET_NOTIFICATIONS: AssetNotification[] = [
  { id: "an-1", type: "assignment", title: "New Asset Assigned", message: "A MacBook Pro 16\" M3 has been assigned to you. Tap to review and accept.", timestamp: "2025-09-15T10:00:00Z", read: false, assetId: "ast-1", actionUrl: "/employee/assets/ast-1" },
  { id: "an-2", type: "return-reminder", title: "Return Scheduled", message: "Your Dell UltraSharp monitor return is scheduled for March 25. Please have it ready.", timestamp: "2026-03-12T09:00:00Z", read: false, assetId: "ast-2", actionUrl: "/employee/assets" },
  { id: "an-3", type: "damage-update", title: "Damage Report Updated", message: "Your report for MacBook Pro screen damage is now under investigation.", timestamp: "2026-03-09T14:00:00Z", read: true, assetId: "ast-1", actionUrl: "/employee/assets/ast-1" },
  { id: "an-4", type: "request-status", title: "Asset Request Approved", message: "Your request for a second monitor has been approved by your manager.", timestamp: "2026-03-06T11:00:00Z", read: true, assetId: "", actionUrl: "/employee/assets/requests" },
  { id: "an-5", type: "maintenance-due", title: "Maintenance Due", message: "HP LaserJet Pro is due for scheduled maintenance on April 15.", timestamp: "2026-03-13T08:00:00Z", read: false, assetId: "ast-7", actionUrl: "/documents/library" },
  { id: "an-6", type: "warranty-expiry", title: "Warranty Expiring Soon", message: "iPhone 15 Pro warranty expires on Sep 20, 2026 (6 months remaining).", timestamp: "2026-03-13T08:00:00Z", read: false, assetId: "ast-3", actionUrl: "/documents/library" },
];

// --- Helpers ---
export const ASSET_STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  available: { label: "Available", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  assigned: { label: "Assigned", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  maintenance: { label: "Maintenance", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  disposed: { label: "Disposed", color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
  missing: { label: "Missing", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

export const ASSET_CONDITION_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: "New", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  good: { label: "Good", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  fair: { label: "Fair", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
  poor: { label: "Poor", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  damaged: { label: "Damaged", color: "text-red-700", bg: "bg-red-50 border-red-200" },
  "non-functional": { label: "Non-Functional", color: "text-gray-700", bg: "bg-gray-100 border-gray-300" },
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);
}
