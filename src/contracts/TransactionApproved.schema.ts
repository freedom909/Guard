import { z } from 'zod';

export const TransactionApprovedSchema = z.object({
  entityId: z.string(),
  fromState: z.string(),
  toState: z.string(),
  actorRole: z.enum(['CUSTOMER', 'AGENT', 'ADMIN']),
});

export type TransactionApprovedEvent =
  z.infer<typeof TransactionApprovedSchema>;
