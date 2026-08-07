# Zip Slip Path Traversal

**Tags:** `#web` `#path-traversal` `#file-upload` `#zip` `#python`

**CWE:** CWE-22 (Path Traversal)

**OWASP:** A01:2021 – Broken Access Control

**Severity:** Critical (CVSS ~8.8)

---

## Description

A zip extraction function does not validate that extracted file paths stay within the intended directory. By crafting a malicious zip with `../` sequences in filenames, an attacker can write files anywhere on the filesystem.

---

## Vulnerable Pattern

``python
import zipfile

with zipfile.ZipFile(uploaded_zip) as archive:
    archive.extractall(target_dir)  # No path validation



Each entry in the zip is extracted without checking whether the resolved path stays within target_dir. A filename like ../../static/hacked.css escapes the extraction directory.
Attack Payloads

1. Confirm zip slip with a test file:
python

archive.writestr("../../static/zipslip-proof.css", "ZIP_SLIP_CONFIRMED")

Then visit /static/zipslip-proof.css to verify.

2. Overwrite application source code for RCE:
python

archive.writestr("../../app.py", "malicious Flask app with /cmd endpoint")

3. Overwrite templates for SSTI:
python

archive.writestr("../../templates/dashboard.html", "{{ config.__class__... }}")

Detection

Static: Search code for extractall, extract, ZipFile.extract without path sanitization using os.path.realpath() or os.path.commonpath().

Dynamic: Upload a zip containing ../ filenames and check if files land outside the intended directory.
Remediation

    Validate each zip entry's resolved path before extraction:
    python

import os
target = os.path.realpath(os.path.join(extract_dir, entry_name))
if not target.startswith(os.path.realpath(extract_dir) + os.sep):
    raise ValueError("Path traversal detected")

    Use os.path.commonpath() to verify the extraction directory is a prefix of the resolved path

    Strip path separators and .. sequences from entry names before extraction

    Extract to a temporary directory and move only validated files

Rooms Seen
Room	Context	Date
The Hollow Shell (Hacker Holidays 2026)	Shell upload feature extracted zip without path validation, allowing overwrite of app.py via ../../app.py to gain RCE	Jul 2026
Related

    Command Injection via shell=True — the RCE obtained after overwriting app.py

    HTML Comment Credential Leak — how we logged in to access the upload feature
