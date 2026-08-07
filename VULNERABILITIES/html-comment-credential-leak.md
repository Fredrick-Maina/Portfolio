# HTML Comment Credential Leak

**Tags:** `#web` `#credential-leak` `#information-disclosure` `#client-side`

**CWE:** CWE-615 (Information Exposure Through Comments)

**OWASP:** A04:2021 – Insecure Design

**Severity:** High (CVSS ~7.5)

---

## Description

Sensitive credentials are embedded in HTML comments in the page source of a public-facing login page, visible to anyone who views the source code.

---

## Vulnerable Pattern

html
<!--
    Byte Lotus // internal display-manager portal
    New on the floor team? IT seeds every property with the same
    starter login until you set your own:
        user: concierge
        pass: StayNoticed2024!
    (rotate it from Settings on first sign-in — most people forget)
-->

Default credentials placed in an HTML comment with instructions to rotate — which were never followed.
Attack Payloads

1. View page source:
Press Ctrl+U or right-click → View Page Source on the login page.

2. Log in with discovered credentials:
text

Username: concierge
Password: StayNoticed2024!

Detection

Static: Grep HTML files for user, pass, password, credential, login inside comment tags (<!-- -->).

Dynamic: View page source on all login and authentication pages during testing. Check DevTools Sources tab.
Remediation

    Never put credentials in HTML comments — they are sent to every visitor in the HTTP response

    Use environment variables or a secrets manager for default credentials

    Force password change on first login with no option to skip

    Disable or remove default accounts entirely in production deployments

Rooms Seen
Room	Context	Date
The Hollow Shell (Hacker Holidays 2026)	concierge:StayNoticed2024! found in HTML comment on the Shoreline Display login page, granting access to the shell upload feature	Jul 2026
Related

    Default Credentials Not Rotated — the comment literally said "most people forget" to rotate


