import { RoleType } from '@/types';

export type ActionType = 
  | 'inventory.read'
  | 'inventory.create'
  | 'inventory.update'
  | 'inventory.receive'
  | 'inventory.issue'
  | 'inventory.return'
  | 'inventory.transfer'
  | 'inventory.adjust'
  | 'service.read'
  | 'service.create'
  | 'service.assign'
  | 'service.reassign'
  | 'service.dispatch'
  | 'service.complete'
  | 'service.close'
  | 'finance.read'
  | 'finance.create_invoice'
  | 'finance.record_payment';

const ROLE_PERMISSIONS: Record<RoleType, ActionType[]> = {
  'Super Admin': [
    'inventory.read', 'inventory.create', 'inventory.update', 'inventory.receive', 'inventory.issue', 'inventory.return', 'inventory.transfer', 'inventory.adjust',
    'service.read', 'service.create', 'service.assign', 'service.reassign', 'service.dispatch', 'service.complete', 'service.close',
    'finance.read', 'finance.create_invoice', 'finance.record_payment'
  ],
  'Admin': [
    'inventory.read', 'inventory.create', 'inventory.update', 'inventory.receive', 'inventory.issue', 'inventory.return', 'inventory.transfer', 'inventory.adjust',
    'service.read', 'service.create', 'service.assign', 'service.reassign', 'service.dispatch', 'service.complete', 'service.close',
    'finance.read', 'finance.create_invoice', 'finance.record_payment'
  ],
  'Inventory Manager': [
    'inventory.read', 'inventory.create', 'inventory.update', 'inventory.receive', 'inventory.issue', 'inventory.return', 'inventory.transfer', 'inventory.adjust'
  ],
  'Service Manager': [
    'inventory.read',
    'service.read', 'service.create', 'service.assign', 'service.reassign', 'service.dispatch', 'service.complete', 'service.close'
  ],
  'Engineer': [
    'inventory.read', 'inventory.issue',
    'service.read', 'service.complete'
  ],
  'Accounts': [
    'finance.read', 'finance.create_invoice', 'finance.record_payment'
  ],
  'Sales': [
    'inventory.read', 'finance.read'
  ]
};

export const hasPermission = (role: RoleType, action: ActionType): boolean => {
  return ROLE_PERMISSIONS[role]?.includes(action) ?? false;
};
