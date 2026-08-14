import { z } from 'zod';
import { Customer } from '@/types';

export const CustomerSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN Format'),
  industry: z.string(),
  primaryContactName: z.string().min(2, 'Contact name required'),
  primaryContactEmail: z.string().email('Invalid email'),
  primaryContactPhone: z.string().min(10, 'Valid phone required'),
  city: z.string()
});

export type CustomerInput = z.infer<typeof CustomerSchema>;
