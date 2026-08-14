import { z } from 'zod';

export const TicketSchema = z.object({
  equipmentId: z.string(),
  issueType: z.string(),
  priority: z.enum(['Emergency', 'High', 'Medium', 'Low']),
  assignedEngineerId: z.string(),
  reportedBy: z.string()
});

export type TicketInput = z.infer<typeof TicketSchema>;
