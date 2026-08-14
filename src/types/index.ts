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
  customerCode: string;
  companyName: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  alternatePhone: string | null;
  gstNumber: string | null;
  panNumber: string | null;
  billingAddress: string | null;
  serviceAddress: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  customerType: string | null;
  status: string | null;
  notes: string | null;
  createdAt: string | null;
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
  customerId: string;
  equipmentCode: string;
  equipmentType: string | null;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  capacity: string | null;
  location: string | null;
  installationDate: string | null;
  warrantyStart: string | null;
  warrantyEnd: string | null;
  lastServiceDate: string | null;
  nextServiceDate: string | null;
  status: string | null;
  condition: string | null;
  notes: string | null;
  assetNumber: string | null;
  purchaseDate: string | null;
  // Below fields are joined/computed fields that we will populate dynamically, not strictly DB columns, but useful for UI.
  customerName?: string;
}

export interface Lead {
  id: string;
  leadNumber: string;
  companyName: string;
  contactPerson: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  requirement: string | null;
  estimatedKva: number | null;
  budget: number | null;
  source: string | null;
  status: string | null;
  probability: number | null;
  assignedSalespersonId: string | null;
  expectedClosureDate: string | null;
  createdAt: string | null;

  // UI fields
  assignedSalespersonName?: string;
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
  equipmentId: string | null;
  title: string;
  description: string | null;
  ticketType: string | null;
  priority: string | null;
  status: string | null;
  source: string | null;
  assignedTo: string | null;
  reportedAt: string | null;
  scheduledAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  closedAt: string | null;
  
  // UI Display fields (joined)
  customerName?: string;
  equipmentModel?: string;
  serialNumber?: string;
  assignedEngineerName?: string;
}

export interface AmcContract {
  id: string;
  contractNumber: string;
  customerId: string;
  contractType: string | null;
  startDate: string | null;
  endDate: string | null;
  billingFrequency: string | null;
  contractValue: number | null;
  taxAmount: number | null;
  totalValue: number | null;
  status: string | null;
  notes: string | null;
  terms: string | null;

  // UI fields
  customerName?: string;
}

export interface PmVisit {
  id: string;
  visitNumber: string;
  amcContractId: string;
  customerId: string;
  equipmentId: string;
  assignedEngineerId: string | null;
  scheduledDate: string | null;
  status: string | null;
  checklist: any;
  batteryVoltageReadings: any;
  engineerNotes?: string | null;
  customerSignature?: string | null;
  completedAt?: string | null;

  // UI fields
  customerName?: string;
  equipmentModel?: string;
  serialNumber?: string;
  assignedEngineerName?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  categoryId: string | null;
  description: string | null;
  unit: string | null;
  currentStock: number | null;
  minimumStock: number | null;
  maximumStock: number | null;
  reservedStock: number | null;
  unitCost: number | null;
  sellingPrice: number | null;
  supplierId: string | null;
  status: string | null;

  // UI fields
  categoryName?: string;
  supplierName?: string;
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
  customerId: string;
  invoiceDate: string | null;
  dueDate: string | null;
  subtotal: number | null;
  taxAmount: number | null;
  discount: number | null;
  totalAmount: number | null;
  amountPaid: number | null;
  balanceAmount: number | null;
  status: string | null;
  notes: string | null;
  serviceTicketId: string | null;
  amcId: string | null;

  // UI display fields (joined)
  customerName?: string;
  invoiceItems?: any[];
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
