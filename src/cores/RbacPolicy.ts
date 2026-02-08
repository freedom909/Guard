/**
 * RBAC Policy Definition
 * Source: skills/skill-definition.md
 */

export enum Role {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  OWNER = 'OWNER',
  CUSTOMER = 'CUSTOMER',
  PENDING_AGENT = 'PENDING_AGENT',
}

export enum BusinessEvent {
  APPLICATION_ACCEPTED = 'APPLICATION_ACCEPTED',
  CONTRACT_CONCLUDED = 'CONTRACT_CONCLUDED',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  TRANSACTION_COMPLETED = 'TRANSACTION_COMPLETED',
}

/**
 * RBAC Policy (Executable Matrix)
 * Rule: If a role–event pair is not explicitly defined → DENY
 */
const RBAC_MATRIX: Readonly<Record<BusinessEvent, Readonly<Partial<Record<Role, boolean>>>>> = {
  [BusinessEvent.APPLICATION_ACCEPTED]: {
    [Role.CUSTOMER]: true,
  },
  [BusinessEvent.CONTRACT_CONCLUDED]: {
    [Role.OWNER]: true,
    [Role.CUSTOMER]: true,
  },
  [BusinessEvent.PAYMENT_COMPLETED]: {
    [Role.OWNER]: true,
  },
  [BusinessEvent.TRANSACTION_COMPLETED]: {
    [Role.OWNER]: true,
    [Role.CUSTOMER]: true,
  },
};

/**
 * Deterministically validates if a role is allowed to perform an event.
 * Implements Default Deny semantics.
 * 
 * @param role The actor's role
 * @param event The requested business event
 * @returns true if ALLOW, false if DENY
 */
export function validateRbac(role: Role, event: BusinessEvent): boolean {
  const allowedRoles = RBAC_MATRIX[event];
  
  if (!allowedRoles) {
    return false;
  }

  return allowedRoles[role] === true;
}