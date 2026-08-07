```markdown
# Self-Documenting Health Endpoint

**Tags:** `#api` `#information-disclosure` `#misconfiguration` `#enumeration`

**CWE:** CWE-200 (Exposure of Sensitive Information to an Unauthorized Actor)

**OWASP:** A05:2021 – Security Misconfiguration

**Severity:** Medium (CVSS ~5.3)

---

## Description

A health check endpoint on an internal service exposes full API documentation, including endpoint paths, authentication header format, required JSON body fields, and the privilege level the service runs as.

---

## Vulnerable Pattern

```bash
curl http://127.0.0.1:9000/health
```

Response:
```json
{
  "endpoints": {
    "GET /health": "service status",
    "POST /jobs/export": {
      "auth": "Authorization: Bearer <automation key>",
      "body": {"report": "<report name>"},
      "desc": "archive the latest data export"
    }
  },
  "runs_as": "root",
  "service": "automation",
  "status": "ok"
}
```

The response documents the exact endpoint, auth format, required parameters, and even warns that the service runs as root.

---

## Attack Payloads

**1. Fuzz for health endpoints:**
```
for word in health status info api docs; do
  curl http://127.0.0.1:9000/$word
done
```

**2. Read the self-documentation:**
The response maps out the entire attack surface — endpoints, authentication, and required fields.

**3. Use the documentation to craft a valid attack:**
With the auth header format and body schema known, construct a malicious request.

---

## Detection

**Static:** Review all health/info/status endpoints for verbose output. Flag responses containing `endpoint`, `auth`, `body`, `POST`, `GET` documentation.

**Dynamic:** Call `/health`, `/status`, `/info`, `/api`, `/docs` on every internal service discovered.

---

## Remediation

1. Health endpoints should return minimal information: `{"status": "ok"}`
2. Separate API documentation from runtime endpoints — use Swagger UI on a dev-only route
3. Never expose privilege level (`runs_as: root`) in API responses
4. Don't document authentication formats in responses — attackers don't need to know the header name

---

## Rooms Seen

| Room | Context | Date |
|------|---------|------|
| Infinity Pool (Hacker Holidays 2026) | Automation worker `/health` on port 9000 documented the `/jobs/export` endpoint, `Authorization: Bearer` header format, and `{"report":"name"}` body schema | Aug 2026 |

---

## Related

- Loopback Service Without Authentication — why the health endpoint was accessible
- API Key in Voicemail — where we got the key to use against the documented endpoint
- Command Injection via shell=True — the vulnerability we exploited after learning the endpoint
```
