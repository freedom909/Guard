export interface ExecuteTxInput {
  correlationId: string;
  commandId: string; // /** Command identity (causation root) */
  entityId: string;
  fromState: string;
  toState: string;

  actorRole: 'CUSTOMER' | 'AGENT' | 'ADMIN';
  event: 'CONTRACT_CONCLUDED';
}

export interface ExecuteTxOutput {
  result: 'APPROVED' | 'DENIED';
}