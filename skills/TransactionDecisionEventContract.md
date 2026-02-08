Transaction Decision Event Contract（正式版）

定位
本 Contract 是 Transaction Execution Skill 的唯一对外输出协议
用于 MQ / EventBus / Kafka / RabbitMQ / Webhook / Audit Log

❗任何消费者 只能信这个 Contract，不得推断内部逻辑

1️⃣ Event Envelope（统一外壳）

所有事件 必须 包在这个 Envelope 里
这是系统演进的生命线

// contracts/events/EventEnvelope.ts
export interface EventEnvelope<TPayload> {
  spec_version: '1.0';
  event_type: string;
  occurred_at: string; // ISO-8601
  producer: 'transaction-skill';
  payload: TPayload;
}


设计原则

spec_version：防止未来破坏性升级

event_type：消费者路由依据

occurred_at：审计 / 回放必需

producer：多 Skill 并存时区分来源

2️⃣ Decision Result（裁决枚举）
// contracts/events/DecisionResult.ts
export enum DecisionResult {
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
}

3️⃣ Violation Reason（拒绝原因）
// contracts/events/ViolationReason.ts
export enum ViolationReason {
  INVALID_ROLE = 'INVALID_ROLE',
  RBAC_VIOLATION = 'RBAC_VIOLATION',
  INVALID_STATE_TRANSITION = 'INVALID_STATE_TRANSITION',
}

4️⃣ Transaction Approved Event（状态推进事件）
// contracts/events/TransactionApprovedEvent.ts
import { DecisionResult } from './DecisionResult';
import { BusinessEvent, Role } from '../domain';
import { BusinessState } from '../domain';

export interface TransactionApprovedEvent {
  decision: DecisionResult.APPROVED;

  entity_id: string;

  from_state: BusinessState;
  to_state: BusinessState;

  event: BusinessEvent;
  actor_role: Role;

  audit: string;
}


📌 语义保证

一定发生了状态推进

状态变化是确定的

可安全驱动下游系统

5️⃣ Transaction Denied Event（安全事件）
// contracts/events/TransactionDeniedEvent.ts
import { DecisionResult } from './DecisionResult';
import { ViolationReason } from './ViolationReason';
import { BusinessEvent, Role } from '../domain';

export interface TransactionDeniedEvent {
  decision: DecisionResult.DENIED;

  entity_id: string;

  event: BusinessEvent;
  actor_role: Role;

  reason: ViolationReason;
}


📌 语义保证

没有状态变化

属于策略 / 安全 / 合规事件

不能被“重试”当作成功

6️⃣ Event Type 常量（禁止魔法字符串）
// contracts/events/EventTypes.ts
export const EventTypes = {
  TRANSACTION_APPROVED: 'transaction.approved.v1',
  TRANSACTION_DENIED: 'transaction.denied.v1',
} as const;

7️⃣ 最终对外事件定义（Envelope + Payload）
// contracts/events/index.ts
import { EventEnvelope } from './EventEnvelope';
import { TransactionApprovedEvent } from './TransactionApprovedEvent';
import { TransactionDeniedEvent } from './TransactionDeniedEvent';

export type TransactionApprovedEnvelope =
  EventEnvelope<TransactionApprovedEvent>;

export type TransactionDeniedEnvelope =
  EventEnvelope<TransactionDeniedEvent>;

8️⃣ Skill 输出 → Event Contract 映射（关键）
import { EventTypes } from '../contracts/events/EventTypes';

function toApprovedEvent(output: OutputSuccess): TransactionApprovedEnvelope {
  return {
    spec_version: '1.0',
    event_type: EventTypes.TRANSACTION_APPROVED,
    occurred_at: new Date().toISOString(),
    producer: 'transaction-skill',
    payload: {
      decision: DecisionResult.APPROVED,
      entity_id: output.entity_id,
      from_state: output.from_state,
      to_state: output.to_state,
      event: output.event,
      actor_role: output.actor_role,
      audit: output.audit,
    },
  };
}

function toDeniedEvent(output: OutputFailure): TransactionDeniedEnvelope {
  return {
    spec_version: '1.0',
    event_type: EventTypes.TRANSACTION_DENIED,
    occurred_at: new Date().toISOString(),
    producer: 'transaction-skill',
    payload: {
      decision: DecisionResult.DENIED,
      entity_id: output.entity_id,
      event: output.event,
      actor_role: output.actor_role,
      reason: output.reason,
    },
  };
}
