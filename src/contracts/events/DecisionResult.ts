// contracts/events/DecisionResult.ts
export enum DecisionResult {
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
}
export type Decision = {
  result: DecisionResult;
  reason?: string;
};
