import { Customer, Equipment, ServiceTicket, InventoryItem, AmcContract, Lead, Quotation, Invoice } from '@/types';

// ─── Demo Customers ───────────────────────────────────────────────────────────
export const demoCustomers: Customer[] = [
  {
    id: 'demo-cust-1',
    code: 'CUST-DEMO-01',
    companyName: 'Apex Data Technologies',
    gstin: '29AAACX99991Z1',
    industry: 'IT & Data Center',
    primaryContactName: 'Rajesh Kumar',
    primaryContactEmail: 'rajesh@apexdata.in',
    primaryContactPhone: '+91 98765 43210',
    city: 'Bengaluru',
    branches: [],
    status: 'Active',
    totalEquipmentCount: 14,
    activeAmcContractsCount: 2,
    totalRevenue: 4500000,
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-cust-2',
    code: 'CUST-DEMO-02',
    companyName: 'Global Health Hospitals',
    gstin: '27AADCB2234M1Z',
    industry: 'Healthcare',
    primaryContactName: 'Dr. Sarah Menon',
    primaryContactEmail: 's.menon@globalhealth.org',
    primaryContactPhone: '+91 99887 76655',
    city: 'Mumbai',
    branches: [],
    status: 'Active',
    totalEquipmentCount: 8,
    activeAmcContractsCount: 1,
    totalRevenue: 2800000,
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-cust-3',
    code: 'CUST-DEMO-03',
    companyName: 'Nexus Manufacturing',
    gstin: '33AABCN1122P1Z',
    industry: 'Manufacturing',
    primaryContactName: 'Vikram Singh',
    primaryContactEmail: 'vsingh@nexusmfg.in',
    primaryContactPhone: '+91 91234 56789',
    city: 'Chennai',
    branches: [],
    status: 'Active',
    totalEquipmentCount: 22,
    activeAmcContractsCount: 4,
    totalRevenue: 8900000,
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-cust-4',
    code: 'CUST-DEMO-04',
    companyName: 'Fortis Infrastructure Ltd',
    gstin: '07AAACF1234B1Z5',
    industry: 'Real Estate & Infrastructure',
    primaryContactName: 'Ankit Sharma',
    primaryContactEmail: 'a.sharma@fortis.in',
    primaryContactPhone: '+91 98110 22233',
    city: 'Delhi',
    branches: [],
    status: 'Active',
    totalEquipmentCount: 6,
    activeAmcContractsCount: 1,
    totalRevenue: 1900000,
    createdAt: new Date().toISOString()
  }
];

// ─── Demo Equipment ───────────────────────────────────────────────────────────
export const demoEquipment: Equipment[] = [
  {
    id: 'demo-eq-1',
    serialNumber: 'ESSMA-UPS-60K-001',
    modelName: 'PowerMax Pro 60kVA',
    category: 'UPS',
    capacityKva: 60,
    capacityKw: 54,
    phase: '3-Phase',
    batteryType: '12V 100Ah SMF',
    batteryQuantity: 32,
    customerId: 'demo-cust-1',
    customerName: 'Apex Data Technologies',
    branchId: 'br-1',
    siteAddress: 'Electronic City, Bengaluru',
    city: 'Bengaluru',
    installationDate: '2023-05-12',
    warrantyStartDate: '2023-05-12',
    warrantyEndDate: '2025-05-12',
    warrantyStatus: 'Active',
    amcStatus: 'Covered',
    healthScore: 98,
    lastInspectionDate: '2024-01-10',
    nextMaintenanceDueDate: '2024-04-10'
  },
  {
    id: 'demo-eq-2',
    serialNumber: 'ESSMA-INV-10K-042',
    modelName: 'Solar Grid-Tie 10kW',
    category: 'Inverter',
    capacityKva: 10,
    capacityKw: 10,
    phase: '3-Phase',
    batteryType: 'None',
    batteryQuantity: 0,
    customerId: 'demo-cust-2',
    customerName: 'Global Health Hospitals',
    branchId: 'br-1',
    siteAddress: 'Andheri West, Mumbai',
    city: 'Mumbai',
    installationDate: '2022-11-20',
    warrantyStartDate: '2022-11-20',
    warrantyEndDate: '2024-11-20',
    warrantyStatus: 'Active',
    amcStatus: 'Pending Renewal',
    healthScore: 82,
    lastInspectionDate: '2023-11-20',
    nextMaintenanceDueDate: '2024-02-20'
  },
  {
    id: 'demo-eq-3',
    serialNumber: 'ESSMA-UPS-120K-99',
    modelName: 'Titan Industrial 120kVA',
    category: 'UPS',
    capacityKva: 120,
    capacityKw: 108,
    phase: '3-Phase',
    batteryType: '2V 500Ah Tubular',
    batteryQuantity: 180,
    customerId: 'demo-cust-3',
    customerName: 'Nexus Manufacturing',
    branchId: 'br-1',
    siteAddress: 'Oragadam Industrial Area, Chennai',
    city: 'Chennai',
    installationDate: '2021-08-15',
    warrantyStartDate: '2021-08-15',
    warrantyEndDate: '2023-08-15',
    warrantyStatus: 'Expired',
    amcStatus: 'Covered',
    healthScore: 94,
    lastInspectionDate: '2024-02-01',
    nextMaintenanceDueDate: '2024-05-01'
  }
];

// ─── Demo Service Tickets ─────────────────────────────────────────────────────
export const demoTickets: ServiceTicket[] = [
  {
    id: 'demo-tkt-1',
    ticketNumber: 'TKT-2026-001',
    customerId: 'demo-cust-1',
    customerName: 'Apex Data Technologies',
    equipmentId: 'demo-eq-1',
    equipmentModel: 'PowerMax Pro 60kVA',
    serialNumber: 'ESSMA-UPS-60K-001',
    siteAddress: 'Electronic City, Bengaluru',
    issueType: 'Battery Backup Failure',
    priority: 'Emergency',
    status: 'In Progress',
    reportedBy: 'NOC Manager',
    reportedPhone: '+91 98450 12345',
    assignedEngineerId: 'usr-3',
    assignedEngineerName: 'Amit Kumar',
    diagnosisNotes: 'Found 2 faulty SMF batteries in bank 2 causing voltage drop.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    slaMet: true
  },
  {
    id: 'demo-tkt-2',
    ticketNumber: 'TKT-2026-002',
    customerId: 'demo-cust-2',
    customerName: 'Global Health Hospitals',
    equipmentId: 'demo-eq-2',
    equipmentModel: 'Solar Grid-Tie 10kW',
    serialNumber: 'ESSMA-INV-10K-042',
    siteAddress: 'Andheri West, Mumbai',
    issueType: 'Output Voltage Distortion',
    priority: 'High',
    status: 'Assigned',
    reportedBy: 'Facility Admin',
    reportedPhone: '+91 99887 76655',
    assignedEngineerId: 'usr-4',
    assignedEngineerName: 'Ravi Prasad',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    slaMet: true
  },
  {
    id: 'demo-tkt-3',
    ticketNumber: 'TKT-2026-003',
    customerId: 'demo-cust-3',
    customerName: 'Nexus Manufacturing',
    equipmentId: 'demo-eq-3',
    equipmentModel: 'Titan Industrial 120kVA',
    serialNumber: 'ESSMA-UPS-120K-99',
    siteAddress: 'Oragadam Industrial Area, Chennai',
    issueType: 'Overheating',
    priority: 'Medium',
    status: 'Open',
    reportedBy: 'Plant Manager',
    reportedPhone: '+91 99000 55566',
    assignedEngineerId: 'usr-3',
    assignedEngineerName: 'Amit Kumar',
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    slaMet: true
  }
];

// ─── Demo Leads ───────────────────────────────────────────────────────────────
export const demoLeads: Lead[] = [
  {
    id: 'demo-lead-1',
    leadNumber: 'LEAD-2026-101',
    companyName: 'Sterling Pharma Labs',
    contactPerson: 'Nitin Gupta',
    email: 'nitin@sterlingpharma.in',
    phone: '+91 98001 23456',
    city: 'Hyderabad',
    requirement: '200kVA Online UPS with 2Hr Battery Backup',
    estimatedKva: 200,
    budget: 3500000,
    source: 'Referral',
    status: 'Qualified',
    probability: 75,
    assignedSalespersonId: 'usr-5',
    assignedSalespersonName: 'Priya Sundaram',
    expectedClosureDate: '2026-09-30',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'demo-lead-2',
    leadNumber: 'LEAD-2026-102',
    companyName: 'TechHub Co-working Spaces',
    contactPerson: 'Pooja Iyer',
    email: 'p.iyer@techhub.in',
    phone: '+91 80012 99988',
    city: 'Pune',
    requirement: '60kVA UPS + Solar 15kW Hybrid System',
    estimatedKva: 60,
    budget: 1800000,
    source: 'Website',
    status: 'Proposal Sent',
    probability: 55,
    assignedSalespersonId: 'usr-5',
    assignedSalespersonName: 'Priya Sundaram',
    expectedClosureDate: '2026-10-15',
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
  }
];

// ─── Demo Quotations ──────────────────────────────────────────────────────────
export const demoQuotations: Quotation[] = [
  {
    id: 'demo-qt-1',
    quoteNumber: 'ESSMA-QT-2026-201',
    version: 1,
    customerId: 'demo-cust-1',
    customerName: 'Apex Data Technologies',
    gstin: '29AAACX99991Z1',
    items: [
      { id: 'qi-1', description: 'ESSMA PowerMax 60kVA Online UPS', category: 'UPS', quantity: 2, unitPrice: 850000, gstRate: 18, totalAmount: 1700000 },
      { id: 'qi-2', description: '12V 100Ah SMF Battery Bank (32 Nos)', category: 'Battery Bank', quantity: 2, unitPrice: 180000, gstRate: 18, totalAmount: 360000 }
    ],
    subtotal: 2060000,
    discountPercentage: 5,
    discountAmount: 103000,
    cgstAmount: 174870,
    sgstAmount: 174870,
    igstAmount: 0,
    totalTax: 349740,
    grandTotal: 2306740,
    termsAndConditions: '1. 50% Advance with PO. 2. Balance on delivery. 3. 1-Year Onsite Warranty.',
    status: 'Sent',
    createdBy: 'Priya Sundaram',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    validUntil: new Date(Date.now() + 86400000 * 27).toISOString().substring(0, 10)
  }
];

// ─── Demo Invoices ────────────────────────────────────────────────────────────
export const demoInvoices: Invoice[] = [
  {
    id: 'demo-inv-1',
    invoiceNumber: 'ESSMA-INV-2026-1001',
    invoiceType: 'Sales',
    customerId: 'demo-cust-3',
    customerName: 'Nexus Manufacturing',
    gstin: '33AABCN1122P1Z',
    issueDate: '2026-07-15',
    dueDate: '2026-07-30',
    items: [
      { description: 'ESSMA Titan 120kVA UPS', quantity: 1, unitPrice: 1450000, total: 1450000 },
      { description: 'Installation & Commissioning', quantity: 1, unitPrice: 45000, total: 45000 }
    ],
    subtotal: 1495000,
    cgst: 134550,
    sgst: 134550,
    igst: 0,
    totalTax: 269100,
    grandTotal: 1764100,
    paidAmount: 882050,
    balanceDue: 882050,
    paymentStatus: 'Partially Paid'
  },
  {
    id: 'demo-inv-2',
    invoiceNumber: 'ESSMA-INV-2026-1002',
    invoiceType: 'Service',
    customerId: 'demo-cust-2',
    customerName: 'Global Health Hospitals',
    gstin: '27AADCB2234M1Z',
    issueDate: '2026-08-01',
    dueDate: '2026-08-15',
    items: [
      { description: 'Emergency Battery Replacement - 4 Nos 12V 100Ah SMF', quantity: 4, unitPrice: 7500, total: 30000 },
      { description: 'Field Service Charge - Emergency Visit', quantity: 1, unitPrice: 5000, total: 5000 }
    ],
    subtotal: 35000,
    cgst: 3150,
    sgst: 3150,
    igst: 0,
    totalTax: 6300,
    grandTotal: 41300,
    paidAmount: 41300,
    balanceDue: 0,
    paymentStatus: 'Paid'
  }
];

// ─── Demo Inventory ───────────────────────────────────────────────────────────
export const demoInventory: InventoryItem[] = [
  {
    id: 'demo-inv-item-1',
    sku: 'ESSMA-BAT-12V100AH-SMF',
    name: '12V 100Ah SMF VRLA Battery',
    category: 'Battery Bank',
    warehouseLocation: 'Main WH - BLR',
    rackNumber: 'Rack B2',
    shelfNumber: 'Shelf 1',
    batchNumber: 'BT-2026-07',
    quantityInStock: 48,
    reservedQuantity: 16,
    minimumThreshold: 20,
    unitCost: 7200,
    sellingPrice: 9500,
    supplierId: 'sup-1',
    supplierName: 'Exide Industries Ltd',
    lastRestockedDate: '2026-07-20',
    barcodeQr: 'ESSMA-BAT-12V100AH-SMF'
  },
  {
    id: 'demo-inv-item-2',
    sku: 'ESSMA-PART-IGBT-MODULE',
    name: 'IGBT Power Module 1200V/75A',
    category: 'Spare Part',
    warehouseLocation: 'Main WH - BLR',
    rackNumber: 'Rack A3',
    shelfNumber: 'Shelf 4',
    batchNumber: 'BT-2026-06',
    quantityInStock: 4,
    reservedQuantity: 0,
    minimumThreshold: 5,
    unitCost: 12500,
    sellingPrice: 18000,
    supplierId: 'sup-2',
    supplierName: 'Semikron Electronics',
    lastRestockedDate: '2026-06-10',
    barcodeQr: 'ESSMA-PART-IGBT-MODULE'
  },
  {
    id: 'demo-inv-item-3',
    sku: 'ESSMA-CABLE-4SQ-50M',
    name: 'DC Power Cable 4 Sq.mm (50m Roll)',
    category: 'Accessory',
    warehouseLocation: 'Main WH - BLR',
    rackNumber: 'Rack C1',
    shelfNumber: 'Shelf 2',
    batchNumber: 'BT-2026-05',
    quantityInStock: 12,
    reservedQuantity: 2,
    minimumThreshold: 5,
    unitCost: 1800,
    sellingPrice: 2800,
    supplierId: 'sup-3',
    supplierName: 'Polycab Wires Ltd',
    lastRestockedDate: '2026-05-15',
    barcodeQr: 'ESSMA-CABLE-4SQ-50M'
  }
];
