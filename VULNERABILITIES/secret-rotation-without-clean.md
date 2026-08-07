# Secret Rotation Without Old Version Cleanup

**Tags:** `#azure` `#key-vault` `#secret-management` `#versioning` `#cryptocabana`

**CWE:** CWE-1275 (Sensitive Information Uncleared Before Release)

**OWASP:** A04:2021 – Insecure Design

**Severity:** Medium (CVSS ~5.5)

---

## Description

When a secret is rotated in Azure Key Vault, the old version remains accessible via its version ID unless explicitly purged. An attacker with read access to the vault can retrieve previous versions and recover sensitive data that was supposed to be replaced.

---

## Vulnerable Pattern

Current secret value after rotation:

"Rotated this after IT flagged it -- old value should still be recoverable if you know where to look."
text


The old version still exists with ID `3d6492d2c6f74123bc754a9ded22b2a0` and contains the original sensitive value.

---

## Attack Payloads

**1. List all versions of a secret:**

az keyvault secret list-versions --vault-name <vault> --name <secret> --maxresults 25
text


**2. Read an old version by its version ID:**

az keyvault secret show --vault-name <vault> --name <secret> --version <old_version_id> --query value --output tsv
text


---

## Detection

After rotating a secret, verify old versions are either purged or disabled. Check Key Vault audit logs for version history and access patterns.

---

## Remediation

1. Purge old secret versions after rotation if they contained sensitive values
2. Set an expiration policy on old versions to trigger automatic cleanup
3. Disable old versions so they cannot be read even with valid access
4. Audit secret version history regularly for forgotten sensitive data

---

## Rooms Seen

| Room | Context | Date |
|------|---------|------|
| CryptoCabana (Hacker Holidays 2026) | `key-shard-2` was rotated with a note saying the old value was "still recoverable" — the old version ID contained the missing flag shard `_k3ys_n0t_` | Jul 2026 |

---

## Related

- Credentials Stored in Blob Storage — how we got the service principal credentials to access Key Vault
- SAS Token in Client-Side JavaScript — how we discovered the storage account


