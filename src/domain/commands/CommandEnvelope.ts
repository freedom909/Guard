// src/contracts/commands/CommandEnvelope.ts

export interface CommandEnvelope<T> {
  commandId: string;
  correlationId: string;
  payload: T;
  issuedAt: string;
}
