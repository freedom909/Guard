class InMemoryBus implements EventBus {
  async publish(topic: string, payload: any): Promise<void> {
    console.log("[EVENT]", topic, payload)
  }
}
