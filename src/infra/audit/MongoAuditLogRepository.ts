// src/infra/audit/MongoAuditLogRepository.ts
import { AuditLogRepository } from '../../ports/AuditLogRepository';
import { AuditLog } from '../../application/types/AuditLog';
import { MongoClient, Db, Collection } from 'mongodb';


export class MongoAuditLogRepository implements AuditLogRepository {
  private db!: Db;
  private collection!: Collection<AuditLog>;

  constructor(
    private readonly uri: string,
    private readonly dbName = 'audit',
    private readonly collectionName = 'audit_logs'
  ) {}

  async connect() {
    const client = new MongoClient(this.uri);
    await client.connect();
    this.db = client.db(this.dbName);
    this.collection = this.db.collection<AuditLog>(this.collectionName);

    await this.collection.createIndex({ auditId: 1 }, { unique: true });
    await this.collection.createIndex({ 'target.entityId': 1 });
    await this.collection.createIndex({ occurredAt: -1 });
  }

  async save(log: AuditLog) {
    if (!this.collection) throw new Error('MongoAuditLogRepository not connected');
    await this.collection.insertOne(log);
  }
}

