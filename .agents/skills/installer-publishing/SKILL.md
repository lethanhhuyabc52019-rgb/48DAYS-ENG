---
name: installer-publishing
description: Workflow and standards for packaging, updating, and publishing software installers (SMOB Suite) on the landing page, including bilingual synchronization, Windows SmartScreen trust guide, all-in-one zip packaging, and no-Zalo compliance.
version: 1.0.0
---

# Installer Publishing & Download Center Workflow

This skill defines the standardized protocol for updating, packaging, and publishing installers for the SMOB BIM Suite on the landing page.

---

## 📦 1. All-in-One Packaging Standards

- **Single ZIP Archive**: Always package all binaries (`SMOB_Setup.exe` AND `SMOB_Uninstall.exe`) into a unified archive: `public/downloads/SMOB_Setup.zip`.
- **No Standalone Uninstaller Button**: Do NOT show a separate download button for the uninstaller on the UI. Instead, show an All-in-One package badge indicating both installer and uninstaller are bundled together.
- **Git Tracking Exception**: Ensure `.gitignore` explicitly allows publishing the download zip:
  ```gitignore
  *.zip
  !public/downloads/*.zip
  ```
- **File Size Accuracy**: Calculate and display the actual zip file size (e.g. `1.6 MB`) in `versionData.ts` and on the UI badges.

---

## 🔗 2. Download Button & Tag Requirements

- **HTML Attributes**: Every download button must carry standard attributes:
  ```tsx
  <a
    href="/downloads/SMOB_Setup.zip"
    download="SMOB_Setup.zip"
    className="..."
  >
    <Download className="w-4 h-4" />
    <span>{t.downloadZipBtn}</span>
    <span>1.6 MB</span>
  </a>
  ```
- **Dual Access**: Ensure direct download access is available from both the landing page Hero/Product card and inside the Download Center Modal.

---

## 💡 3. Quick Installation & Browser Trust Guide

Always provide the 3-step installation and browser trust guide (`InstallationGuideCard`) in Apple Dark Glassmorphism style (Space Black `#0B0C10`, border `#2A2B36`, ambient glows):

1. **Step 1 - Download & Extract**: Download `SMOB_Setup.zip` and extract to a folder (includes setup and uninstaller).
2. **Step 2 - SmartScreen Tip**: Clear instructions for bypassing Windows SmartScreen / browser download warnings:
   - Click **`...` (More Options)** ➔ **`Keep`** ➔ **`Keep anyway`** (or *More info ➔ Run anyway*).
3. **Step 3 - Run & Enjoy**: Run `SMOB_Setup.exe`, select Autodesk Revit® versions (2020 – 2026), and automate.

---

## 🌐 4. 100% Bilingual Synchronization (EN ⇄ VN)

- All text across the Installation Guide, Download Modal, System Requirements labels, and Action buttons must reactively sync with `useLanguage()`:
  - English: 100% professional BIM/AEC industry terminology.
  - Vietnamese: Precise, native translation while preserving technical terms (`SMOB_Setup.zip`, `SmartScreen`, `Revit 2020–2026`).
- Centralize all copy in `src/data/translations.ts` under `tool`.

---

## 🚫 5. Strict No-Zalo Policy

- Never display "Zalo" in any UI component, form label, placeholder, helper text, or backend email template.
- Always use **Phone / WhatsApp** or general contact channels instead.

---

## 🚀 6. Verification & Deployment Protocol

1. **Typecheck**: Run `npx tsc --noEmit` to guarantee zero TypeScript errors.
2. **Git Commit & Push**:
   ```bash
   git add .
   git commit -m "feat(download): update installer package and release notes"
   git push origin main
   ```
3. **Cache Invalidation Advice**: Remind users to perform a Hard Reload (`Ctrl + F5` or `Cmd + Shift + R`) or open an incognito window to bypass browser-level caching.
