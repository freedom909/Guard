//real-estate-core/.docs/prompts/Architect.md
# Architecture Design Document: Role-Based Access Control (RBAC)

## 1. Overview

This design introduces a Role-Based Access Control (RBAC) system to the existing production real-estate platform. The primary objective is to enforce granular access security across backend APIs while maintaining strict backward compatibility.

The implementation follows an **additive-only** strategy. No existing APIs will be renamed or removed. The system utilizes a feature flag mechanism to ensure that the new authorization logic can be toggled safely. When the feature flag is disabled, the system behaves exactly as the legacy system (open access for authenticated users).

**Key Constraints:**
*   **Legacy Default:** Existing users and tokens without role definitions default to the `Customer` role.
*   **Zero Breaking Changes:** API contracts remain immutable.
*   **Safety:** Full rollback capability via feature flags.

## 2. Authorization Model

The authorization model is built on a flat role hierarchy enforced at the middleware level.

### 2.1 Roles and Definitions

| Role | Description | Scope |
| :--- | :--- | :--- |
| **Admin** | System Administrator | Full access to all resources and user management. |
| **Agent** | Verified Real Estate Agent | Management of listings, contracts, and transactions. |
| **Owner** | Property Owner | Management of owned properties and viewing of offers. |
| **Customer** | End User (Default) | Read-only access to public listings; Write access to own profile. |
| **Pending_Agent** | Unverified Staff | Restricted access limited to onboarding and verification. |

### 2.2 The Pending_Agent Constraint
The `Pending_Agent` role is a critical security boundary. It represents an authenticated user who has applied for Agent status but has not been verified.
*   **MUST NOT** access business-critical write operations (Listings, Contracts).
*   **MAY** access specific onboarding endpoints (Document Upload, Status Check).
*   **MAY** read their own user profile.

### 2.3 Access Control Strategy
*   **Token-Based Identity:** User roles are embedded in the JWT as a custom claim (`role`).
*   **Legacy Token Handling:** If the `role` claim is absent, the system treats the user as `Customer`.
*   **Enforcement Point:** Authorization middleware intercepts requests *after* authentication but *before* controller logic.

## 3. Technical Implementation

### 3.1 JWT Token Structure
The authentication system will issue JSON Web Tokens (JWT) containing a custom `role` claim.

```json
{
  "id": "user_123",
  "email": "user@example.com",
  "role": "Agent", // Optional. Defaults to "Customer" if missing.
  "iat": 1610000000,
  "exp": 1610003600
}
```

### 3.2 Authorization Middleware Logic
The middleware function `authorize(allowedRoles)` will perform the following steps:

1.  **Feature Flag Check:** Check `ENABLE_RBAC` environment variable. If `false`, call `next()` immediately (Legacy Mode).
2.  **Token Verification:** Verify JWT signature and expiration.
3.  **Role Extraction:**
    *   Retrieve `role` from token payload.
    *   If `role` is undefined/null, assign `Customer`.
4.  **Permission Check:**
    *   If `user.role` is included in `allowedRoles`, call `next()`.
    *   Otherwise, return `403 Forbidden`.

### 3.3 Feature Flagging
A global configuration switch will control the activation of the authorization layer.

*   **Variable:** `ENABLE_RBAC` (Boolean)
*   **Default:** `false` (Safe default for initial deployment)
*   **Behavior:** When disabled, the system bypasses all role checks, effectively operating as the legacy system.

## 4. Security Considerations

### 4.1 Privilege Escalation Prevention
*   **Immutable Roles:** Users cannot modify their own role via profile update endpoints. Role assignment is restricted to Admin-only APIs or direct database operations.
*   **Pending Status:** `Pending_Agent` is explicitly blocked from all transaction-related write operations to prevent unverified actors from manipulating listings.

### 4.2 Token Security
*   **Expiration:** Tokens must have a short expiration time (e.g., 1 hour) to limit the window of opportunity for compromised credentials.
*   **Signing:** Tokens must be signed using a strong secret key stored in secure environment variables, not in the codebase.

## 5. Rollout & Rollback Strategy

### 5.1 Deployment Phases
1.  **Code Deployment:** Deploy the new middleware and updated user model with `ENABLE_RBAC=false`.
2.  **Verification:** Verify that existing login and API flows function without regression.
3.  **Activation:** Set `ENABLE_RBAC=true` in the production environment variables.
4.  **Monitoring:** Monitor API error rates (specifically 403s) to detect legitimate users being blocked.

### 5.2 Rollback Plan
If critical issues arise (e.g., legitimate Agents being blocked):
1.  **Immediate Action:** Update environment variable `ENABLE_RBAC=false`.
2.  **Effect:** System reverts to legacy behavior immediately (requiring service restart if env vars are cached).
3.  **Data Integrity:** Since this change is logic-only and does not alter database schemas destructively, no database rollback is required.
