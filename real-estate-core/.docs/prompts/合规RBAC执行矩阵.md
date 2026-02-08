//real-estate-core/.docs/prompts/合规RBAC执行矩阵.md
合规 RBAC 执行矩阵
Role           Event                  Permission
------------------------------------------------
Admin          ApplicationAccepted    Deny
Admin          ContractConcluded      Deny
Admin          PaymentCompleted       Deny
Admin          TransactionCompleted   Deny

Agent          ApplicationAccepted    Deny
Agent          ContractConcluded      Deny
Agent          PaymentCompleted       Deny
Agent          TransactionCompleted   Deny

Owner          ApplicationAccepted    Deny
Owner          ContractConcluded      Allow
Owner          PaymentCompleted       Deny   ← 修正
Owner          TransactionCompleted   Allow

Customer       ApplicationAccepted    Allow
Customer       ContractConcluded      Deny   ← 修正
Customer       PaymentCompleted       Deny
Customer       TransactionCompleted   Deny   ← 除非你定义 Customer = 買主

Pending_Agent  ApplicationAccepted    Deny
Pending_Agent  ContractConcluded      Deny
Pending_Agent  PaymentCompleted       Deny
Pending_Agent  TransactionCompleted   Deny
