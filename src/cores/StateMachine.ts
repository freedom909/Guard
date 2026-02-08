/**
 * State Machine Definition
 * Source: skills/skill-definition.md
 */

import { BusinessEvent } from './RbacPolicy';

export enum BusinessState {
  S01 = 'S01',
  S02 = 'S02',
  S03 = 'S03',
  S04 = 'S04',
  S05 = 'S05',
}

/**
 * State Machine (Explicit Only)
 * Rule: Transitions not listed here are forbidden.
 */
const STATE_TRANSITIONS: Readonly<Record<BusinessState, Readonly<Partial<Record<BusinessEvent, BusinessState>>>>> = {
  [BusinessState.S01]: {
    [BusinessEvent.APPLICATION_ACCEPTED]: BusinessState.S02,
  },
  [BusinessState.S02]: {
    [BusinessEvent.CONTRACT_CONCLUDED]: BusinessState.S03,
  },
  [BusinessState.S03]: {
    [BusinessEvent.PAYMENT_COMPLETED]: BusinessState.S04,
  },
  [BusinessState.S04]: {
    [BusinessEvent.TRANSACTION_COMPLETED]: BusinessState.S05,
  },
  [BusinessState.S05]: {
    // Terminal state
  },
};

/**
 * Deterministically calculates the next state based on current state and event.
 * 
 * @param currentState The current business state
 * @param event The requested business event
 * @returns The next BusinessState if transition is valid, or undefined if forbidden.
 */
export function getNextState(currentState: BusinessState, event: BusinessEvent): BusinessState | undefined {
  const transitions = STATE_TRANSITIONS[currentState];
  return transitions?.[event];
}