```markdown
# Hardcoded Template Credentials (FreePBX CVE-2026)

**Tags:** `#voip` `#freepbx` `#hardcoded-credentials` `#cve`

**CWE:** CWE-798 (Hardcoded Credentials)

**OWASP:** A07:2021 – Identification and Authentication Failures

**Severity:** Critical (CVSS ~9.8)

---

## Description

FreePBX ships with a hardcoded template account `FreePBXUCPTemplateCreator` with a known default password. This account is intended for initial setup but remains active in production deployments, allowing unauthenticated access to the User Control Panel.

---

## Vulnerable Pattern

```
Username: FreePBXUCPTemplateCreator
Password: St4yN0t1c3d_2026
```

The credentials were discovered in the Watchtower API response with an ops note: "UCP still on default template creds — ROTATE." The rotation never happened.

---

## Attack Payloads

**1. Log into FreePBX UCP:**
Navigate to `http://target:8080/ucp/` and authenticate with the template credentials.

**2. Access voicemail and system messages:**
Once logged in, navigate to the voicemail inbox to read messages containing additional secrets.

**3. Extract further credentials from the portal:**
The voicemail contained an automation API key used to access the root-level automation worker.

---

## Detection

**Static:** Search FreePBX configuration files (`/etc/freepbx.conf`, `/etc/amportal.conf`) for default account definitions.

**Dynamic:** Attempt login to `/ucp/` with `FreePBXUCPTemplateCreator` and known default passwords. Check if the account exists and is enabled.

---

## Remediation

1. Disable or delete the `FreePBXUCPTemplateCreator` account in production
2. Force password change on first login for all template accounts
3. Audit FreePBX installations for default credentials as part of deployment checklist
4. Monitor login logs for use of template account names

---

## Rooms Seen

| Room | Context | Date |
|------|---------|------|
| Infinity Pool (Hacker Holidays 2026) | FreePBX 16.0.45 `FreePBXUCPTemplateCreator:St4yN0t1c3d_2026` granted UCP access, voicemail contained automation key leading to root | Aug 2026 |

---

## Related

- Unauthenticated API Credential Leak — how the FreePBX creds were discovered via Watchtower
- Default Credentials Not Rotated — same vulnerability pattern, different service
- API Key in Voicemail — what the FreePBX access revealed
```
