# Overly Permissive SAS Scope

**Tags:** `#azure` `#cloud` `#authorization` `#sas` `#misconfiguration`

**CWE:** CWE-863 (Incorrect Authorization)

**OWASP:** A01:2021 – Broken Access Control

**Severity:** High (CVSS ~7.5)

---

## Description

A SAS token is scoped to Service, Container, and Object levels (`srt=sco`) instead of being restricted to a single container, allowing an attacker to enumerate and access all containers in the storage account.

---

## Vulnerable Pattern

?sv=2022-11-02&ss=b&srt=sco&sp=rl&se=2099-12-31...
text


`srt=sco` means Service, Container, Object — the token works at the entire storage account level. The application only needed access to the `backups` container to upload user seed phrases.

---

## Attack Payloads

**1. List all containers instead of just one:**

az storage container list --account-name <name> --sas-token "<token>"
text


**2. Discover hidden containers not referenced in the application:**
The kiosk only mentioned `backups`, but listing returned `$web`, `backups`, and `vault`.

**3. Access blobs in any discovered container:**

az storage blob list --container-name vault --account-name <name> --sas-token "<token>"
text


---

## Detection

**Static:** Review all SAS token parameters. `srt=sco` or `srt=co` on tokens meant for single-container access is a red flag.

**Dynamic:** Use a SAS token to attempt listing containers or accessing blobs outside the intended scope.

---

## Remediation

1. Scope SAS tokens to the minimum required resource level: use `srt=o` (Object only) when possible
2. Specify the container name directly in the SAS URI when only one container is needed
3. Use stored access policies on containers for additional access control
4. Combine with IP restrictions and short expiry times

---

## Rooms Seen

| Room | Context | Date |
|------|---------|------|
| CryptoCabana (Hacker Holidays 2026) | SAS token with `srt=sco` allowed enumeration of all containers, revealing the hidden `vault` container containing service principal credentials and seed phrase | Jul 2026 |

---

## Related

- SAS Token in Client-Side JavaScript — how the token was exposed
- Credentials Stored in Blob Storage — what the overly permissive scope revealed

