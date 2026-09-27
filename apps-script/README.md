# GFG × Marwadi University — Google Apps Script Backend Setup Guide

This folder contains the complete, production-ready, modular Google Apps Script backend source code for the **GFG × Marwadi University Portal**.

---

## 📂 Architecture Overview

All `.gs` files belong to **ONE unified Google Apps Script Web App** connected to **ONE Google Spreadsheet**.

```
apps-script/
├── README.md           <- Deployment & Copy/Paste Guide
├── ARCHITECTURE.md     <- Complete API Specification & Data Flow
├── Config.gs           <- Central Spreadsheet ID & Account Config
├── Main.gs             <- Single doGet() & doPost() Router + Health Check
├── Setup.gs            <- Non-Destructive setupDatabase() & verifyDatabase()
├── Events.gs           <- Live Events Repository & Dynamic Header Mapping
├── Registrations.gs    <- Event Registration & Participant Lookup
├── Attendance.gs       <- General Attendance Tracking
├── Certificate.gs      <- Certificate Self-Entry Submission
├── Scanner.gs          <- Coordinator QR Scanner & Session Verification
├── Bookings.gs         <- Facility & Mentorship Session Bookings
├── Team.gs             <- Core Team & Faculty Leads Directory
├── Announcements.gs    <- Bulletins & Notification Broadcasts
├── Resources.gs        <- Technical Roadmaps & Toolkits
└── Stats.gs            <- Live Dashboard Statistical Counters
```

---

## 🚀 Step-by-Step Deployment Instructions

### STEP 1: Create Google Apps Script Project
1. Open [script.google.com](https://script.google.com/home).
2. Click **+ New project**.
3. Rename the project to: `GFG-MU-Chapter-Backend`.

---

### STEP 2: Create Modular Files in Google Apps Script
In the Google Apps Script left sidebar, click the **+** icon next to **Files** and create standard script files (`.gs`) with the exact names below:

1. `Config.gs`
2. `Main.gs`
3. `Setup.gs`
4. `Events.gs`
5. `Registrations.gs`
6. `Attendance.gs`
7. `Certificate.gs`
8. `Scanner.gs`
9. `Bookings.gs`
10. `Team.gs`
11. `Announcements.gs`
12. `Resources.gs`
13. `Stats.gs`

*(You can delete or replace the default `Code.gs` file).*

---

### STEP 3: Copy Each File from this Codebase into Apps Script
Copy the entire contents of each `.gs` file in `/apps-script/` into its corresponding file in your Google Apps Script project.

---

### STEP 4: Configure Your Spreadsheet ID
1. Open your target Google Spreadsheet.
2. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit
                                         ^^^^^^^^^^^^^^^^^^^^
   ```
3. Open `Config.gs` in Apps Script and replace:
   ```javascript
   SPREADSHEET_ID: "PASTE_YOUR_SPREADSHEET_ID_HERE"
   ```
   with your actual ID, e.g.:
   ```javascript
   SPREADSHEET_ID: "1a2b3c4d5e6f7g8h9i0j"
   ```
4. Click **Save** (Ctrl+S or Cmd+S).

---

### STEP 5: Run Database Setup
1. In the Apps Script top toolbar, select the function dropdown.
2. Select **`setupDatabase`**.
3. Click **Run**.

---

### STEP 6: Authorize Permissions
1. When prompted with "Authorization required", click **Review Permissions**.
2. Choose your Google Account.
3. Click **Advanced** → **Go to GFG-MU-Chapter-Backend (unsafe)**.
4. Click **Allow**.

---

### STEP 7: Confirm Spreadsheet Setup
1. Open your Google Spreadsheet.
2. Verify that all 9 sheets have been automatically created with bold frozen headers:
   - `Events`
   - `Registrations`
   - `Attendance`
   - `Bookings`
   - `Team`
   - `Announcements`
   - `Resources`
   - `Stats`
   - `Logs`

*(Optional: You may run `verifyDatabase` to perform a non-destructive audit of all sheets and headers).*

---

### STEP 8: Deploy as a Web App
1. In the Apps Script editor (top right), click **Deploy** → **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Configure the deployment settings:
   - **Description**: `GFG MU Production API v2`
   - **Execute as**: `Me (your_email@gmail.com)`
   - **Who has access**: `Anyone` *(Crucial: allows frontend API requests without Google Login prompts)*
4. Click **Deploy**.

---

### STEP 9: Copy the Web App URL
Copy the **Web app URL** (ends with `/exec`), e.g.:
```
https://script.google.com/macros/s/AKfycbwNoOZEt6heYNEFojQaHZMoRemC4OlfDNqhcGqRUXyDehfMAUm3kQXuNfoQi9pyqHNz7w/exec
```

---

### STEP 10: Paste the URL into Frontend
Open `src/services/gasApi.ts` in this project and paste your active `/exec` URL:

```typescript
export const GAS_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwNoOZEt6heYNEFojQaHZMoRemC4OlfDNqhcGqRUXyDehfMAUm3kQXuNfoQi9pyqHNz7w/exec";

export const APPS_SCRIPT_URL = GAS_WEB_APP_URL;
export const DIRECT_GAS_URL = GAS_WEB_APP_URL;
export const API_BASE_URL = GAS_WEB_APP_URL;
```

---

## 🔒 Security & Safe Database Operations

- `setupDatabase()` is **strictly non-destructive and idempotent**. Running it multiple times will never overwrite data, delete rows, or duplicate sheets.
- Coordinator scanner credentials are authenticated server-side in `Scanner.gs`. Session tokens expire in 30 minutes.
- All write operations use `LockService.getScriptLock()` to guarantee zero duplicate submissions or race conditions.
