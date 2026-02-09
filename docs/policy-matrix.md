# Transaction Policy Matrix

Legend:
- ✅ APPROVED
- ❌ DENIED (RBAC)
- ⚠️ DENIED (Invalid State)

## Event: CONTRACT_CONCLUDED

| Role \ State Transition | S02 → S03 | S03 → S04 |
|------------------------|-----------|-----------|
| CUSTOMER | ✅ | ⚠️ |
| AGENT | ❌ | ❌ |
| ADMIN | ❌ | ❌ |

