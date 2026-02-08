// src/domain/policies/transactionDecision.ts

import {  TransactionDecisionReasonCode } from './TransactionDecisionReasonCode';

export type TransactionDecision =
  | { result: 'APPROVED'; reasonCode?: TransactionDecisionReasonCode }
  | { result: 'DENIED'; reasonCode: TransactionDecisionReasonCode };
