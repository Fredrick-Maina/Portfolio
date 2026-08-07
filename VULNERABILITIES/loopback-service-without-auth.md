```markdown
# Loopback Service Without Authentication

**Tags:** `#network` `#authorization` `#internal-services` `#pivot`

**CWE:** CWE-306 (Missing Authentication for Critical Function)

**OWASP:** A01:2021 – Broken Access Control

**Severity:** High (CVSS ~7.8)

---

## Description

Internal services bind to localhost (`127.0.0.1`) and trust any connection from the local machine without requiring authentication. Once an attacker gains local access, all loopback-only services are freely accessible.

---

## Vulnerable Pattern

```bash
LISTEN 127.0.0.1:3000    Watchtower ops console
LISTEN 127.0.0.1:9000    Automation worker (runs as root)
LISTEN 127.0.0.1:8080    FreePBX / Apache
```

All three services assume that if you can connect from localhost, you are authorized. No API keys, tokens, or credentials required.

---

## Attack Payloads

**1. Access internal API from local shell:**
```
curl http://127.0.0.1:3000/api/config
```

**2. Port forward for browser access:**
```
ssh -L 8080:127.0.0.1:8080 user@target -N
```

**3. Fuzz all loopback ports for undocumented endpoints:**
```
for port in 3000 3306 5038 8080 8088 8089 9000; do curl -s http://127.0.0.1:$port/; done
```

---

## Detection

**During assessment:** After gaining any local access, run `ss -tlnp` or `netstat -tlnp` to map all listening services. Test each one.

**In code review:** Flag any service binding to `127.0.0.1` that doesn't implement authentication.

---

## Remediation

1. Add authentication to all services, even loopback-only ones
2. Use API keys, mTLS, or Unix socket permissions for internal service communication
3. Run services under different local user accounts with restricted permissions
4. Implement network segmentation — don't rely on loopback binding as a security boundary

---

## Rooms Seen

| Room | Context | Date |
|------|---------|------|
| Infinity Pool (Hacker Holidays 2026) | Watchtower (:3000), automation worker (:9000), and FreePBX (:8080) all trusted localhost connections, allowing pivot after command injection as web user | Aug 2026 |

---

## Related

- Command Injection via shell=True — how we gained local access
- Unauthenticated API Credential Leak — Watchtower gave up FreePBX creds with no auth
- Self-Documenting Health Endpoint — automation worker /health exposed API docs
```
