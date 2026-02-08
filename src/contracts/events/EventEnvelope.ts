export interface EventEnvelope<TPayload = unknown> {
  // CloudEvents core
  specversion: '1.0';
  id: string;
  type: string;
  source: string;
  time: string;

  // 🔑 Tracing
  correlationId: string; // 同一业务流程
  causationId?: string;  // 触发它的上一个事件 / command

  // Payload
  data: TPayload;
}
