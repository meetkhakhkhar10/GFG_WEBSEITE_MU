# GFG × Marwadi University — Backend Architecture & Data Flow

This document details the system design, end-to-end data flow, database schemas, and complete API specifications for the GFG × Marwadi University Google Apps Script backend.

---

## 1. System Topology & Data Flow

```
+-------------------------------------------------------------+
|                     React Single Page App                   |
| (Events, Registration Modal, Cert Scanner, Booking, Team)   |
+-------------------------------------------------------------+
                              |
                              | HTTP GET / POST (fetch)
                              v
+-------------------------------------------------------------+
|                 src/services/gasApi.ts                      |
|   (Direct fetch to DIRECT_GAS_URL with cache-busting)       |
+-------------------------------------------------------------+
                              |
                              | /exec URL
                              v
+-------------------------------------------------------------+
|          Google Apps Script Web App Router (Main.gs)        |
|             doGet(e)  /  doPost(e)  -> handleRequest(e)     |
+-------------------------------------------------------------+
         |            |             |             |
         v            v             v             v
   [Events.gs]  [Registrations] [Certificate]  [Scanner.gs]
   [Team.gs]    [Attendance.gs] [Bookings.gs]  [Announce/Stats]
         \            \             /             /
          \            \           /             /
           v            v         v             v
+-------------------------------------------------------------+
|                   Google Spreadsheet                        |
|                  (Single Source of Truth)                   |
| 9 Sheets: Events, Registrations, Attendance, Bookings,      |
|           Team, Announcements, Resources, Stats, Logs       |
+-------------------------------------------------------------+
```

---

## 2. API Endpoint Reference

### Base URL
All requests are sent to the single deployed Web App `/exec` URL.

---

### A. Public GET Actions

| Action | Parameters | Description | Module Handler |
| :--- | :--- | :--- | :--- |
| `health` / `ping` | `action=health` | Verifies API health & spreadsheet connection | `healthCheck()` |
| `events` | `action=events` | Fetches all published events from `Events` sheet | `getEventsList()` |
| `event` | `action=event&id=EVT_ID` | Fetches detailed specifications for a single event | `getSingleEvent(id)` |
| `registration` | `action=registration&id=REG_ID` | Queries participant registration details | `getRegistrationById(id)` |
| `team` | `action=team` | Fetches active core team & lead profiles | `getTeamList()` |
| `announcements` | `action=announcements` | Fetches published chapter announcements | `getAnnouncementsList()` |
| `resources` | `action=resources` | Fetches technical learning materials | `getResourcesList()` |
| `stats` | `action=stats` | Aggregates portal metrics (events, registrations) | `getPortalStats()` |

---

### B. Public POST Actions

| Action | Payload Fields | Description | Module Handler |
| :--- | :--- | :--- | :--- |
| `register` | `event_id`, `name`, `email`, `phone`, `enrollment_number`, `program`, `department`, `year`, `college` | Registers participant, creates `REG-ID`, increments count | `registerEvent(data)` |
| `certificate_data_entry` | `name`, `email`, `event_id` | Self-submits participant for certificate attendance | `handleCertificateDataEntry(data)` |
| `booking` | `service`, `mentor`, `name`, `email`, `phone`, `date`, `time_slot`, `notes` | Reserves campus lab slot or mentorship session | `handleFacilityBooking(data)` |
| `attendance` | `registration_id`, `event_id`, `name`, `email`, `method`, `marked_by` | General coordinator attendance marking | `handleNormalAttendance(data)` |
| `announcement` | `title`, `message`, `category` | Publishes chapter bulletin | `handleNewAnnouncement(data)` |

---

### C. Scanner Authentication & QR Actions

| Action | Payload Fields | Description | Module Handler |
| :--- | :--- | :--- | :--- |
| `scanner_login` | `username`, `password` | Authenticates coordinator, generates 30-min `STOK_` token | `handleCertificateScannerLogin(data)` |
| `certificate_qr_scan` | `registration_id`, `token` | Verifies QR, updates Column J (`Marked_By`) in-place | `handleCertificateQrScan(data)` |

---

## 3. Database Sheets Specification

All 9 sheets exist within the same Google Spreadsheet managed by `Config.gs` and `Setup.gs`:

### 1. `Events`
```
Event_ID | Event_Name | Description | Date | Start_Time | End_Time | Venue | Registration_Deadline | Max_Participants | Registration_Status | Status | Organizer | Contact_Email | Contact_Phone | Registration_Count | Created_At | Published_At | Updated_At
```

### 2. `Registrations`
```
Registration_ID | Event_ID | Name | Email | Phone | Enrollment_Number | Program | Department | Year | College | Timestamp | Status | Attendance_Status | Certificate_Status | Certificate_URL
```

### 3. `Attendance`
```
Attendance_ID | Registration_ID | Event_ID | Name | Email | Attendance_Date | Attendance_Time | Method | Status | Marked_By
```

### 4. `Bookings`
```
Booking_ID | Service | Mentor | Name | Email | Phone | Date | Time_Slot | Status | Notes | Created_At | Updated_At
```

### 5. `Team`
```
Team_ID | Name | Role | Email | Status
```

### 6. `Announcements`
```
Announcement_ID | Title | Message | Category | Status | Published_At | Created_At | Updated_At
```

### 7. `Resources`
```
Resource_ID | Title | Description | Category | URL | Status | Created_At | Updated_At
```

### 8. `Stats`
```
Metric | Value | Updated_At
```

### 9. `Logs`
```
Log_ID | Action | User | Email | Event_ID | Details | Timestamp | Status
```

---

## 4. Live Event Qualification Rules

An event in the `Events` sheet is considered publicly active and open for registration if and only if:
1. `Registration_Status` == `"OPEN"` (case-insensitive, trimmed)
2. `Status` == `"PUBLISHED"` (case-insensitive, trimmed)

If `Registration_Status` is changed to `"CLOSED"` in Google Sheets:
- `is_open` immediately returns `false`.
- The frontend dynamically excludes the event from "OPEN REGISTRATIONS" without any code changes.
