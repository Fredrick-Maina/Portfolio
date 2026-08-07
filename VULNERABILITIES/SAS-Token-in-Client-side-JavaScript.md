```markdown
# SAS Token in Client-Side JavaScript

**Tags:** `#azure` `#cloud` `#credential-leak` `#client-side`

**CWE:** CWE-798 (Hardcoded Credentials)

**OWASP:** A04:2021 – Insecure Design

**Severity:** High (CVSS ~7.5)

---

## Description

A Shared Access Signature (SAS) token with broad permissions is embedded directly in client-side JavaScript, visible to anyone who views the page source or loads the script in their browser.

---

## Vulnerable Pattern

```javascript
const BACKUP_SAS = "?sv=2022-11-02&ss=b&srt=sco&sp=rl&se=2099-12-31T23:59:59Z&st=2024-01-01T00:00:00Z&spr=https&sig=...";
```

The SAS token is hardcoded in `app.js` which is loaded by every visitor's browser. It grants Read and List access to blob storage and expires in the year 2099 — effectively permanent.

---

## Attack Payloads

**1. List all containers in the storage account:**
```
az storage container list --account-name <name> --sas-token "<token>"
```

**2. List blobs in a hidden container:**
```
az storage blob list --container-name vault --account-name <name> --sas-token "<token>"
```

**3. Download sensitive files from storage:**
```
az storage blob download --name seed_phrase.txt --container-name vault --account-name <name> --sas-token "<token>" --file out.txt
```

---

## Detection

**Static:** Search client-side files (`.js`, `.html`) for `sig=`, `?sv=`, `SharedAccessSignature`, or SAS token URL patterns.

**Dynamic:** Open browser DevTools → Sources tab → search for `sig=` or `blob.core.windows.net`.

---

## Remediation

1. Never expose SAS tokens in client-side code — they are credentials
2. Generate short-lived, least-privilege SAS tokens server-side per authenticated request
3. Use Managed Identities or Azure AD authentication instead of SAS where possible
4. Rotate exposed SAS tokens immediately and revoke the old ones

---

## Rooms Seen

| Room | Context | Date |
|------|---------|------|
| CryptoCabana (Hacker Holidays 2026) | SAS token embedded in `app.js` granted list/read access to entire storage account, leading to discovery of vault container and service principal credentials | Jul 2026 |

---

## Related

- Overly Permissive SAS Scope — same token, same room
- Credentials Stored in Blob Storage — what the SAS token exposed in the vault container
```
