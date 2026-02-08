// src/domain/commands/policies/TransactionDecisionReasonCode.ts

export enum TransactionDecisionReasonCode {
  APPROVED = 'APPROVED',                  // 批准
  RBAC_VIOLATION = 'RBAC_VIOLATION',      // 权限不足
  INVALID_STATE_TRANSITION = 'INVALID_STATE_TRANSITION', // 状态转换非法
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',   // 其他业务规则不通过
}
