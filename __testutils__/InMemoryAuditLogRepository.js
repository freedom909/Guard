"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryAuditLogRepository = void 0;
class InMemoryAuditLogRepository {
    logs = [];
    async save(log) {
        this.logs.push(log);
    }
    getAll() {
        return this.logs;
    }
    clear() {
        this.logs = [];
    }
}
exports.InMemoryAuditLogRepository = InMemoryAuditLogRepository;
