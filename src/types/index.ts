export type RoleType = 
  | 'Super Admin'
  | 'Admin'
  | 'Sales'
  | 'Service Manager'
  | 'Engineer'
  | 'Accounts'
  | 'Inventory Manager';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: RoleType;
  avatarUrl?: string;
  skills?: string[];
  certifications?: string[];
  availabilityStatus?: 'Available' | 'On Job' | 'On Leave' | 'Busy';
  rating?: number;
  completedJobsCount?: number;
  currentGpsLocation?: { lat: number; lng: number; address: string };
  createdAt: string;
}

export interface CustomerBranch {
  id: string;
  branchName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  isPrimary?: boolean;
}

export interface Customer {
  id: string;
  code: string; // e.g. CUST-2026-089
  companyName: string;
  gstin: string;
  industry: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  city: string;
  branches: CustomerBranch[];
  status: 'Active' | 'Inactive' | 'Lead';
  totalEquipmentCount: number;
  activeAmcContractsCount: number;
  totalRevenue: number;
  createdAt: string;
}

export type EquipmentCategory = 'UPS' | 'Inverter' | 'Battery Bank' | 'Solar System' | 'Stabilizer' | 'Accessory';

export interface BatteryLog {
  id: string;
  timestamp: string;
  batteryId: string;
  voltage: number; // e.g. 13.6V
  temperature: number; // e.g. 28°C
  internalResistance: number; // mΩ
  status: 'Healthy' | 'Warning' | 'Critical';
  notes?: string;
}

export interface Equipment {
  id: string;
  serialNumber: string; // Dynamic QR encoded
  modelName: string;
  category: EquipmentCategory;
  capacityKva: number; // kVA rating
  capacityKw: number;
  phase: '1-Phase' | '3-Phase';
  batteryType?: string; // e.g. 12V 100Ah Tubular
  batteryQuantity?: number;
  customerId: string;
  customerName: string;
  branchId: string;
  siteAddress: string;
  city: string;
  installationDate: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyStatus: 'Active' | 'Expired' | 'Claim Pending';
  amcStatus: 'Covered' | 'Expired' | 'None' | 'Pending Renewal';
  amcContractId?: string;
  healthScore: number; // 0-100%
  lastInspectionDate: string;
  nextMaintenanceDueDate: string;
  assignedEngineerId?: string;
  assignedEngineerName?: string;
  installationPhotos?: string[];
  qrCodeUrl?: string;
}

export interface Lead {
  id: string;
  leadNumber: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  requirement: string;
  estimatedKva: number;
  budget: number;
  source: 'Website' | 'Referral' | 'Tender' | 'Cold Call' | 'Exhibition';
  status: 'New' | 'Qualified' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';
  probability: number; // %
  assignedSalespersonId: string;
  assignedSalespersonName: string;
  expectedClosureDate: string;
  createdAt: string;
}

export interface QuotationItem {
  id: string;
  description: string;
  category: EquipmentCategory;
  quantity: number;
  unitPrice: number;
  gstRate: number; // 18% standard
  totalAmount: number;
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  version: number;
  leadId?: string;
  customerId: string;
  customerName: string;
  gstin: string;
  items: QuotationItem[];
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTax: number;
  grandTotal: number;
  termsAndConditions: string;
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Converted to Order';
  createdBy: string;
  createdAt: string;
  validUntil: string;
}

export interface InstallationTask {
  id: string;
  installationNumber: string;
  orderId?: string;
  customerId: string;
  customerName: string;
  equipmentId: string;
  equipmentModel: string;
  serialNumber: string;
  siteAddress: string;
  scheduledDate: string;
  assignedEngineerId: string;
  assignedEngineerName: string;
  stage: 'Site Survey' | 'Quotation' | 'Approved' | 'Installation In Progress' | 'Commissioning' | 'Customer Training' | 'Handover Completed';
  checklist: {
    siteSurveyDone: boolean;
    inputVoltageVerified: boolean;
    earthingChecked: boolean;
    batteryBankConnected: boolean;
    loadTestPassed: boolean;
    customerTrained: boolean;
  };
  commissioningReportUrl?: string;
  customerSignature?: string;
  photos?: string[];
  gpsCheckIn?: { lat: number; lng: number; timestamp: string };
  completedAt?: string;
}

export type TicketPriority = 'Emergency' | 'High' | 'Medium' | 'Low';
export type TicketStatus = 'Open' | 'Assigned' | 'In Progress' | 'Pending Spares' | 'Resolved' | 'Closed';

export interface ServiceTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  equipmentId: string;
  equipmentModel: string;
  serialNumber: string;
  siteAddress: string;
  issueType: 'UPS Tripping' | 'Battery Backup Failure' | 'Overheating' | 'Noise / Fan Fault' | 'Output Voltage Distortion' | 'Preventive Maintenance';
  priority: TicketPriority;
  status: TicketStatus;
  reportedBy: string;
  reportedPhone: string;
  assignedEngineerId?: string;
  assignedEngineerName?: string;
  diagnosisNotes?: string;
  partsUsed?: { partId: string; partName: string; quantity: number; cost: number }[];
  voltageReadings?: { inputR: number; inputY: number; inputB: number; outputR: number; batteryVoltage: number };
  beforePhotos?: string[];
  afterPhotos?: string[];
  customerSignature?: string;
  resolutionTimeHours?: number;
  slaMet?: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface AmcContract {
  id: string;
  contractNumber: string;
  customerId: string;
  customerName: string;
  equipmentIds: string[];
  coverageType: 'Comprehensive' | 'Non-Comprehensive' | 'Labor Only';
  startDate: string;
  endDate: string;
  totalValue: number;
  visitFrequency: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Annual';
  totalVisitsScheduled: number;
  visitsCompleted: number;
  visitsMissed: number;
  status: 'Active' | 'Expiring Soon' | 'Expired' | 'Renewed';
  assignedEngineerId: string;
  assignedEngineerName: string;
  lastVisitDate?: string;
  nextScheduledVisit: string;
}

export interface PmVisit {
  id: string;
  visitNumber: string;
  amcContractId: string;
  customerId: string;
  customerName: string;
  equipmentId: string;
  equipmentModel: string;
  serialNumber: string;
  assignedEngineerId: string;
  assignedEngineerName: string;
  scheduledDate: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Missed';
  checklist: {
    mainsVoltageChecked: boolean;
    outputVoltageChecked: boolean;
    upsLoadPercent: number;
    batteryVoltageLogged: boolean;
    fanCleaningDone: boolean;
    terminalTighteningDone: boolean;
  };
  batteryVoltageReadings: { batteryIndex: number; voltage: number }[];
  engineerNotes?: string;
  customerSignature?: string;
  completedAt?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: EquipmentCategory | 'Spare Part';
  warehouseLocation: string; // e.g. WH-1 (Main Warehouse)
  rackNumber: string; // e.g. RACK-B3
  shelfNumber: string; // e.g. SHELF-02
  batchNumber: string;
  serialNumber?: string;
  quantityInStock: number;
  reservedQuantity: number;
  minimumThreshold: number;
  unitCost: number;
  sellingPrice: number;
  supplierId: string;
  supplierName: string;
  lastRestockedDate: string;
  barcodeQr: string;
}

export interface Supplier {
  id: string;
  code: string;
  companyName: string;
  gstin: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  productsSupplied: string[];
  rating: number; // 1-5
  totalPurchases: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceType: 'Sales' | 'Service' | 'AMC Contract';
  customerId: string;
  customerName: string;
  gstin: string;
  issueDate: string;
  dueDate: string;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  paidAmount: number;
  balanceDue: number;
  paymentStatus: 'Paid' | 'Partially Paid' | 'Unpaid' | 'Overdue';
  pdfUrl?: string;
}

export interface PaymentRecord {
  id: string;
  paymentReceiptNo: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amountPaid: number;
  paymentMode: 'NEFT/RTGS' | 'UPI' | 'Cheque' | 'Credit Card' | 'Cash';
  referenceNo: string;
  paymentDate: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  items: { description: string; quantity: number; unitCost: number; total: number }[];
  totalAmount: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Delivered' | 'Cancelled';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: RoleType;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'DISPATCH' | 'APPROVE' | 'EXPORT';
  entityType: 'Customer' | 'Equipment' | 'Ticket' | 'Quotation' | 'AMC' | 'Inventory' | 'Invoice' | 'Installation';
  entityId: string;
  details: string;
  ipAddress?: string;
}

export interface SystemNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'AMC Renewal' | 'Warranty Expiry' | 'Low Stock' | 'Ticket Escalation' | 'Invoice Payment' | 'Engineer Assignment';
  severity: 'info' | 'warning' | 'critical' | 'success';
  read: boolean;
  linkUrl?: string;
}
