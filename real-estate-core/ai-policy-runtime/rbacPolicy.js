class RbacViolationError extends Error {
  constructor(role, event) {
    super(`RBAC violation: role=${role}, event=${event}`);
    this.name = 'RbacViolationError';
  }
}

class RbacPolicy {
  constructor() {
    // 角色 × 业务事件 的执行矩阵
    this.permissionMatrix = {
      ADMIN: [
        'TRANSACTION_CREATED',
        'TRANSACTION_APPROVED',
        'TRANSACTION_REJECTED'
      ],
      AUDITOR: [
        'TRANSACTION_VIEWED'
      ],
      SYSTEM: [
        'TRANSACTION_CREATED'
      ]
    };
  }

  validate(role, event) {
    const allowedEvents = this.permissionMatrix[role];
    if (!allowedEvents || !allowedEvents.includes(event)) {
      throw new RbacViolationError(role, event);
    }
  }
}

module.exports = {
  RbacPolicy,
  RbacViolationError
};
