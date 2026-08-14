import { z } from 'zod';

export const EquipmentSchema = z.object({
  serialNumber: z.string().min(3, 'Serial number required'),
  modelName: z.string().min(2, 'Model name required'),
  category: z.enum(['UPS', 'Inverter', 'Battery Bank', 'Solar System', 'Stabilizer', 'Accessory']),
  capacityKva: z.number().positive(),
  phase: z.enum(['1-Phase', '3-Phase']),
  customerId: z.string()
});

export type EquipmentInput = z.infer<typeof EquipmentSchema>;
