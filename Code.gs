/**
 * ============================================================================
 * Code.gs — Main Google Apps Script Backend (University Portal System)
 * ============================================================================
 * 
 * Manages:
 *   - Events & Registrations
 *   - Normal Attendance
 *   - Bookings (Labs / Halls)
 *   - Team Members
 *   - Announcements
 *   - Resources
 *   - Statistics
 *   - Activity Logging & Emails
 * 
 * NOTE: Certificate logic is cleanly delegated to `CertificateCode.gs`.
 */

var UNIVERSITY_CONFIG = {
  TIMEZONE: "Asia/Kolkata",
  SHEETS: {
    EVENTS: "Events",
    REGISTRATIONS: "Registrations",
    ATTENDANCE: "Attendance",
    BOOKINGS: "Bookings",
    TEAM: "Team",
    ANNOUNCEMENTS: "Announcements",
    RESOURCES: "Resources",
    STATS: "Stats",
    LOGS: "Logs"
  }
};

/**
 * Main Web App POST Entry Point
 */
function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var action = (data.action || "").toString().toLowerCase().trim();

    // ========================================================================
    // MINIMAL HOOK: Route Certificate Actions to CertificateCode.gs
    // ========================================================================
    if (typeof isCertificateAction === "function" && isCertificateAction(action)) {
      return handleCertificatePostAction(action, data, e);
    }

    // ========================================================================
    // Existing University System POST Actions
    // ========================================================================
    if (action === "register") {
      return handleEventRegistration(data);
    } else if (action === "booking") {
      return handleFacilityBooking(data);
    } else if (action === "attendance") {
      return handleNormalAttendance(data);
    } else if (action === "announcement") {
      return handleNewAnnouncement(data);
    }

    return universityJsonResponse({
      success: false,
      error: "Invalid action"
    });

  } catch (err) {
    return universityJsonResponse({
      success: false,
      error: "Server POST error: " + err.toString()
    });
  }
}

/**
 * Main Web App GET Entry Point (University System)
 */
function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = (params.action || "").toString().toLowerCase().trim();

    // ========================================================================
    // Existing University System GET Actions
    // ========================================================================
    if (action === "events") {
      return getEventsList();
    } else if (action === "event") {
      return getSingleEvent(params.id);
    } else if (action === "team") {
      return getTeamList();
    } else if (action === "announcements") {
      return getAnnouncementsList();
    } else if (action === "resources") {
      return getResourcesList();
    } else if (action === "stats") {
      return getPortalStats();
    } else if (action === "registration") {
      return getRegistrationById(params.id);
    }

    return universityJsonResponse({
      success: true,
      service: "GFG × Marwadi University API",
      status: "ACTIVE",
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    return universityJsonResponse({
      success: false,
      error: "Server GET error: " + err.toString()
    });
  }
}

// ----------------------------------------------------------------------------
// Existing University System Helper Functions
// ----------------------------------------------------------------------------

function handleEventRegistration(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(UNIVERSITY_CONFIG.SHEETS.REGISTRATIONS) || ss.insertSheet(UNIVERSITY_CONFIG.SHEETS.REGISTRATIONS);
  
  var regId = "REG-" + new Date().getTime() + "-" + Math.floor(100 + Math.random() * 900);
  var eventId = data.event_id || data.eventId || "EVT-0001";
  var name = data.name || "";
  var email = data.email || "";
  var phone = data.phone || "";
  var enrollment = data.enrollment_number || "";
  var program = data.program || "";
  var dept = data.department || "";
  var year = data.year || "";
  var college = data.college || "";
  var dateStr = Utilities.formatDate(new Date(), UNIVERSITY_CONFIG.TIMEZONE, "dd/MM/yyyy HH:mm:ss");

  sheet.appendRow([regId, eventId, name, email, phone, enrollment, program, dept, year, college, dateStr, "Confirmed"]);
  SpreadsheetApp.flush();

  return universityJsonResponse({
    success: true,
    registration_id: regId,
    event_id: eventId,
    name: name,
    email: email,
    message: "Registration successful"
  });
}

function handleNormalAttendance(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(UNIVERSITY_CONFIG.SHEETS.ATTENDANCE) || ss.insertSheet(UNIVERSITY_CONFIG.SHEETS.ATTENDANCE);
  
  var attId = "ATT-" + new Date().getTime();
  var regId = data.registration_id || "";
  var eventId = data.event_id || "";
  var markedBy = data.marked_by || "Staff";
  var dateStr = Utilities.formatDate(new Date(), UNIVERSITY_CONFIG.TIMEZONE, "dd/MM/yyyy");
  var timeStr = Utilities.formatDate(new Date(), UNIVERSITY_CONFIG.TIMEZONE, "HH:mm:ss");

  sheet.appendRow([attId, regId, eventId, "", "", dateStr, timeStr, "SCAN", "DONE", markedBy]);
  SpreadsheetApp.flush();

  return universityJsonResponse({
    success: true,
    attendance_id: attId,
    registration_id: regId,
    status: "DONE",
    marked_by: markedBy,
    message: "Attendance marked successfully"
  });
}

function handleFacilityBooking(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(UNIVERSITY_CONFIG.SHEETS.BOOKINGS) || ss.insertSheet(UNIVERSITY_CONFIG.SHEETS.BOOKINGS);
  var bookingId = "BKG-" + new Date().getTime();
  sheet.appendRow([bookingId, data.facility_id || "", data.name || "", data.email || "", data.date || "", data.slot || "", "Pending"]);
  return universityJsonResponse({ success: true, booking_id: bookingId });
}

function handleNewAnnouncement(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(UNIVERSITY_CONFIG.SHEETS.ANNOUNCEMENTS) || ss.insertSheet(UNIVERSITY_CONFIG.SHEETS.ANNOUNCEMENTS);
  var id = "ANN-" + new Date().getTime();
  sheet.appendRow([id, data.title || "", data.message || "", data.category || "General", Utilities.formatDate(new Date(), UNIVERSITY_CONFIG.TIMEZONE, "dd/MM/yyyy"), data.priority || "NORMAL"]);
  return universityJsonResponse({ success: true, id: id });
}

function getEventsList() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(UNIVERSITY_CONFIG.SHEETS.EVENTS);
  if (!sheet) return universityJsonResponse({ success: true, events: [] });
  var rows = sheet.getDataRange().getValues();
  var events = [];
  for (var i = 1; i < rows.length; i++) {
    events.push({ id: rows[i][0], title: rows[i][1], date: rows[i][2], location: rows[i][3], status: rows[i][4] });
  }
  return universityJsonResponse({ success: true, events: events });
}

function getSingleEvent(id) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(UNIVERSITY_CONFIG.SHEETS.EVENTS);
  if (!sheet) return universityJsonResponse({ success: false, error: "Event not found" });
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] == id) {
      return universityJsonResponse({ success: true, event: { id: rows[i][0], title: rows[i][1], date: rows[i][2] } });
    }
  }
  return universityJsonResponse({ success: false, error: "Event not found" });
}

function getTeamList() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(UNIVERSITY_CONFIG.SHEETS.TEAM);
  if (!sheet) return universityJsonResponse({ success: true, team: [] });
  var rows = sheet.getDataRange().getValues();
  var team = [];
  for (var i = 1; i < rows.length; i++) {
    team.push({ id: rows[i][0], name: rows[i][1], role: rows[i][2], photo_url: rows[i][3], active: true });
  }
  return universityJsonResponse({ success: true, team: team });
}

function getAnnouncementsList() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(UNIVERSITY_CONFIG.SHEETS.ANNOUNCEMENTS);
  if (!sheet) return universityJsonResponse({ success: true, announcements: [] });
  var rows = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < rows.length; i++) {
    list.push({ id: rows[i][0], title: rows[i][1], message: rows[i][2], category: rows[i][3] });
  }
  return universityJsonResponse({ success: true, announcements: list });
}

function getResourcesList() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(UNIVERSITY_CONFIG.SHEETS.RESOURCES);
  if (!sheet) return universityJsonResponse({ success: true, resources: [] });
  var rows = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < rows.length; i++) {
    list.push({ id: rows[i][0], title: rows[i][1], url: rows[i][2], category: rows[i][3] });
  }
  return universityJsonResponse({ success: true, resources: list });
}

function getPortalStats() {
  return universityJsonResponse({
    success: true,
    total_events: 12,
    total_registrations: 450,
    total_attendance: 380,
    active_team_members: 18
  });
}

function getRegistrationById(id) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(UNIVERSITY_CONFIG.SHEETS.REGISTRATIONS);
  if (!sheet) return universityJsonResponse({ success: false, error: "Registration not found" });
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] == id) {
      return universityJsonResponse({ success: true, registration: { id: rows[i][0], name: rows[i][2], email: rows[i][3] } });
    }
  }
  return universityJsonResponse({ success: false, error: "Registration not found" });
}

function universityJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
