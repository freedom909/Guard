# Guard

![Guard CI/CD](https://github.com/freedom909/Guard/actions/workflows/ci-cd.yml/badge.svg)

Guard is a TypeScript-based system for transaction authorization and auditing, implementing role-based access control (RBAC) and state machine validations. It includes:

- Transaction decision logic (`executeTransaction`, `DecideTransactionService`)
- Async/await support
- MongoDB-based audit logging
- Unit tests for all critical paths
- CI/CD integration via GitHub Actions

---

## Features

- **RBAC Enforcement:** Different roles (ADMIN, AGENT, MANAGER, CUSTOMER) have distinct permissions.
- **State Machine:** Validates transitions between business states (S01 → S05).
- **Audit Logging:** Every decision is logged in MongoDB with `auditId`, timestamp, actor, event, and decision result.
- **Async/Await Ready:** Services and database operations are fully asynchronous.
- **CI/CD:** Automated tests and builds on every push/PR. Docker deployment optional.

---

## Getting Started

### Prerequisites

- Node.js >= 20
- MongoDB (local or cloud)
- npm >= 9

### Installation

```bash
git clone https://github.com/freedom909/Guard.git
cd Guard
npm ci
Environment Variables
Create a .env file with:

MONGO_URI=mongodb://localhost:27017/guard
Run Locally
npx ts-node src/index.ts
Run Tests
npm test
Project Structure
src/
├─ application/
│  └─ services/DecideTransactionService.ts
├─ domain/
│  └─ commands/
│     └─ ExecuteTransactionCommand.ts
├─ cores/
│  ├─ RbacPolicy.ts
│  └─ StateMachine.ts
├─ infra/
│  └─ audit/MongoAuditLogRepository.ts
└─ index.ts
CI/CD
GitHub Actions runs on push/PR to main.

TypeScript check, unit tests, and MongoDB service included.

Docker build & push optional for deployment.

Example Usage
import { ExecuteTransactionCommand } from './domain/commands/ExecuteTransactionCommand';
import { BusinessState } from './cores/StateMachine';
import { BusinessEvent, Role } from './cores/RbacPolicy';
import { executeTransaction } from './cores/Executor';

const command: ExecuteTransactionCommand = {
  entityId: 'tx-001',
  fromState: BusinessState.S02,
  toState: BusinessState.S03,
  event: BusinessEvent.CONTRACT_CONCLUDED,
  actorRole: Role.CUSTOMER,
};

const envelope = {
  commandId: 'cmd-001',
  correlationId: 'corr-001',
  payload: command,
  issuedAt: new Date().toISOString(),
};

const result = await executeTransaction(envelope);
console.log(result);
License
MIT License
