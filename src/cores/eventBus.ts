interface EventBus {
  publish(topic: string, payload: any): Promise<void>
}
