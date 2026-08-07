```markdown
# Race Condition — Time-of-Check Time-of-Use (TOCTOU)

**Tags:** `#web` `#race-condition` `#toctou` `#api` `#business-logic`

**CWE:** CWE-367 (Time-of-Check Time-of-Use)

**OWASP:** A01:2021 – Broken Access Control

**Severity:** High (CVSS ~7.5)

---

## Description

A server checks whether a user is allowed to perform an action and then performs it, but the time gap between the check and the action allows multiple requests to slip through before the state is updated. This is exploited by sending parallel requests that all pass the check before any of them update the state.

---

## Vulnerable Pattern

```python
def claim_reward():
    user = get_current_user()
    if time_since_last_claim(user) < 24_hours:
        return "Already claimed"
    grant_reward(user)
    update_last_claim_time(user)
```

If five requests arrive simultaneously, all five pass the `if` check before any reaches `update_last_claim_time()`. All five receive the reward.

---

## Attack Payloads

**1. Capture the request in Burp Suite:**
Send `POST /claim` to Repeater.

**2. Duplicate the tab multiple times:**
Right-click → Duplicate tab, repeat until 5-10 tabs exist.

**3. Group tabs and send in parallel:**
Select all tabs → Add to group → "Send group in parallel."

**4. Refresh the dashboard:**
All claims were processed before the timer updated, granting multiple rewards.

---

## Detection

**Static:** Look for patterns where a security check and state update are not atomic. Check for `if (condition) { action(); update(); }` with no locking.

**Dynamic:** Use Burp Suite's "Send group in parallel" feature on state-changing endpoints. Send 10-20 identical requests simultaneously and check if more than one succeeds.

---

## Remediation

1. Use atomic database operations:
   ```sql
   UPDATE claims SET last_claim = NOW() WHERE user_id = ? AND last_claim < NOW() - INTERVAL '24 hours'
   ```
   Check the affected row count — if 0, the claim was denied.

2. Use database-level locking: `SELECT ... FOR UPDATE` before checking and updating

3. Implement idempotency keys — each claim request must include a unique key, and duplicates are rejected

4. Use distributed locks (Redis, etc.) for multi-server deployments

---

## Rooms Seen

| Room | Context | Date |
|------|---------|------|
| Towel on the Sunbed (Hacker Holidays 2026) | `POST /claim` had no atomicity between the 24-hour check and the claim update, allowing parallel requests to claim rewards multiple times and unlock the Whale Vault | Jul 2026 |

---

## Related

- None — this was a standalone challenge
```
