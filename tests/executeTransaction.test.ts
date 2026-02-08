// // tests/executeTransaction.test.ts

// import {
//   executeTransaction,
//   DecisionResult,
//   ViolationReason,
// } from '../src/cores/Executor';
// import { Role, BusinessEvent } from '../src/cores/RbacPolicy';
// import { BusinessState } from '../src/cores/StateMachine';

// describe('Transaction Execution Skill', () => {

//   test('APPROVED: CUSTOMER can conclude contract at S02', () => {
//     const result = executeTransaction({
//       entity_Id: 'tx-001',
//       current_state: BusinessState.S02,
//       requested_event: BusinessEvent.CONTRACT_CONCLUDED,
//       actor: {
//         user_id: 'u-1',
//         role: Role.CUSTOMER,
//       },
//     });

//     expect(result).toEqual({
//       result: DecisionResult.APPROVED,
//       entity_id: 'tx-001',
//       from_state: BusinessState.S02,
//       to_state: BusinessState.S03,
//       event: BusinessEvent.CONTRACT_CONCLUDED,
//       actor_role: Role.CUSTOMER,
//       audit: 'RBAC + State Transition validated',
//     });
//   });

//   test('DENIED: AGENT cannot conclude contract', () => {
//     const result = executeTransaction({
//       entity_id: 'tx-002',
//       current_state: BusinessState.S02,
//       requested_event: BusinessEvent.CONTRACT_CONCLUDED,
//       actor: {
//         user_id: 'u-2',
//         role: Role.AGENT,
//       },
//     });

//     expect(result).toEqual({
//       result: DecisionResult.DENIED,
//       reason: ViolationReason.RBAC_VIOLATION,
//       actor_role: Role.AGENT,
//       event: BusinessEvent.CONTRACT_CONCLUDED,
//     });
//   });

//   test('DENIED: Invalid state transition', () => {
//     const result = executeTransaction({
//       entity_id: 'tx-003',
//       current_state: BusinessState.S01,
//       requested_event: BusinessEvent.CONTRACT_CONCLUDED, // illegal
//       actor: {
//         user_id: 'u-3',
//         role: Role.CUSTOMER,
//       },
//     });

//     expect(result).toEqual({
//       result: DecisionResult.DENIED,
//       reason: ViolationReason.INVALID_STATE_TRANSITION,
//       actor_role: Role.CUSTOMER,
//       event: BusinessEvent.CONTRACT_CONCLUDED,
//     });
//   });

// });
