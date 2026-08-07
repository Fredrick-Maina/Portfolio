# Default Credentials Not Rotated

**Tags:** `#web` `#authentication` `#default-credentials` `#configuration`

**CWE:** CWE-1392 (Use of Default Credentials)

**OWASP:** A07:2021 – Identification and Authentication Failures

**Severity:** Critical (CVSS ~9.0)

---

## Description

Applications and services ship with default credentials intended to be changed on first use, but they are never rotated. Anyone who knows the defaults can gain unauthorized access.

---

## Vulnerable Pattern

`html
<!-- IT seeds every property with the same starter login:
     user: concierge
     pass: StayNoticed2024! -->


{
  "telephony_user": "FreePBXUCPTemplateCreator",
  "telephony_pass": "St4yN0t1c3d_2026"
}


In both cases, the credentials were documented as defaults but never changed after deployment.

Attack Payloads

1. Try vendor default credentials:
Common defaults: admin:admin, concierge:password, service-specific template accounts.

2. Check documentation or setup guides:
Often contain the default credentials for initial configuration.

3. Check public default password lists:
Services like FreePBX have known default template accounts.
Detection

Review vendor documentation for default accounts. Test all application roles and service accounts for unchanged default credentials during assessments.
Remediation

    Force password change on first login — no skip option

    Generate unique random passwords per deployment

    Disable or remove default template accounts entirely in production

    Audit accounts regularly for unchanged default passwords

    Alert on login attempts using known default credentials

Rooms Seen
Room	Context	Date
The Hollow Shell (Hacker Holidays 2026)	concierge:StayNoticed2024! default login to Shoreline Display portal	Jul 2026
Infinity Pool (Hacker Holidays 2026)	FreePBXUCPTemplateCreator:St4yN0t1c3d_2026 FreePBX default template account (CVE-2026)	Aug 2026
Related

    HTML Comment Credential Leak — how the Hollow Shell defaults were exposed

    Hardcoded Template Credentials — FreePBX variant of the same issue
