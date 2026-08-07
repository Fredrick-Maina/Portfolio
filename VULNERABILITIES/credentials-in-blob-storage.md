# Credentials Stored in Blob Storage

**Tags:** `#azure` `#cloud` `#credential-leak` `#storage` `#misconfiguration`

**CWE:** CWE-260 (Password in Configuration File)

**OWASP:** A04:2021 – Insecure Design

**Severity:** Critical (CVSS ~9.0)

---

## Description

Full Azure service principal credentials including client ID, client secret, tenant ID, and a Key Vault URI are stored as a plaintext JSON file in blob storage, protected only by a SAS token that was already exposed in client-side JavaScript.

---

## Vulnerable Pattern

json
{
  "client_id": "dbcf2923-e4eb-4b72-a0a4-688aa1185cf5",
  "client_secret": "UBX8Q~...",
  "key_vault_name": "ccabana-kv-f5scjagc",
  "key_vault_uri": "https://ccabana-kv-f5scjagc.vault.azure.net/",
  "note": "Rotate this if it ever leaves the vault. -- IT",
  "tenant_id": "8f8c5f8e-42d3-4ceb-97ad-241bbf446d6c"
}

The file's own note warns "Rotate this if it ever leaves the vault" — yet it was stored in blob storage accessible via a publicly exposed SAS token.
Attack Payloads

1. Authenticate to Azure as the service principal:
text

az login --service-principal --username <client_id> --password <secret> --tenant <tenant_id>

2. List all secrets in the linked Key Vault:
text

az keyvault secret list --vault-name ccabana-kv-f5scjagc

3. Read individual secrets:
text

az keyvault secret show --vault-name ccabana-kv-f5scjagc --name key-shard-1

Detection

Static: Scan blob storage for .json, .env, .pem, .pfx files containing keywords: client_secret, password, key, connectionString, credential.

Dynamic: After discovering a SAS token or storage access, list and download files from all containers looking for credential files.
Remediation

    Never store credentials in blob storage — use Azure Key Vault

    Use Managed Identities for service-to-service authentication instead of service principals with secrets

    If service principals are necessary, store only the client ID in config and retrieve secrets from Key Vault at runtime

    Enable Azure Defender for Storage to alert on credential exposure

Rooms Seen
Room	Context	Date
CryptoCabana (Hacker Holidays 2026)	backup-service-account.json in the vault container contained full service principal credentials with Key Vault access	Jul 2026
Related

    SAS Token in Client-Side JavaScript — how we got access to the blob

    Overly Permissive SAS Scope — how we discovered the vault container

    Secret Rotation Without Cleanup — what the credentials allowed us to access
