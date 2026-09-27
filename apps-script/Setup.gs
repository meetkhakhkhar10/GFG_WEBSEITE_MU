/**
 * ============================================================================
 * Setup.gs — Safe, Idempotent Database & Schema Provisioning
 * ============================================================================
 * 
 * Provides automated setup and verification for the single Google Spreadsheet.
 * 
 * Safety Guarantees:
 *   - NEVER calls sheet.clear(), sheet.clearContents(), or sheet.deleteRows().
 *   - Idempotent: Running setupDatabase() 10 times will produce identical, safe results.
 *   - Preserves all existing user records, registrations, attendance, and events.
 *   - Adds missing columns without disturbing existing data.
 */

// Schema Definition for All 9 Unified Sheets
var DATABASE_SCHEMA = {
  "Events": [
    "Event_ID",
    "Event_Name",
    "Description",
    "Date",
    "Start_Time",
    "End_Time",
    "Venue",
    "Registration_Deadline",
    "Max_Participants",
    "Registration_Status",
    "Status",
    "Organizer",
    "Contact_Email",
    "Contact_Phone",
    "Registration_Count",
    "Created_At",
    "Published_At",
    "Updated_At"
  ],

  "Registrations": [
    "Registration_ID",
    "Event_ID",
    "Name",
    "Email",
    "Phone",
    "Enrollment_Number",
    "Program",
    "Department",
    "Year",
    "College",
    "Timestamp",
    "Status",
    "Attendance_Status",
    "Certificate_Status",
    "Certificate_URL"
  ],

  "Attendance": [
    "Attendance_ID",
    "Registration_ID",
    "Event_ID",
    "Name",
    "Email",
    "Attendance_Date",
    "Attendance_Time",
    "Method",
    "Status",
    "Marked_By"
  ],

  "Bookings": [
    "Booking_ID",
    "Service",
    "Mentor",
    "Name",
    "Email",
    "Phone",
    "Date",
    "Time_Slot",
    "Status",
    "Notes",
    "Created_At",
    "Updated_At"
  ],

  "Team": [
    "Team_ID",
    "Name",
    "Role",
    "Email",
    "Status"
  ],

  "Announcements": [
    "Announcement_ID",
    "Title",
    "Message",
    "Category",
    "Status",
    "Published_At",
    "Created_At",
    "Updated_At"
  ],

  "Resources": [
    "Resource_ID",
    "Title",
    "Description",
    "Category",
    "URL",
    "Status",
    "Created_At",
    "Updated_At"
  ],

  "Stats": [
    "Metric",
    "Value",
    "Updated_At"
  ],

  "Logs": [
    "Log_ID",
    "Action",
    "User",
    "Email",
    "Event_ID",
    "Details",
    "Timestamp",
    "Status"
  ]
};

/**
 * Main Setup Function
 * 
 * Run this function once from the Apps Script editor to initialize or upgrade
 * all sheets and required column headers in the target Google Spreadsheet.
 * 
 * @return {Object} Detailed execution summary
 */
function setupDatabase() {
  var startTime = new Date();
  var ss = getSpreadsheet();
  var spreadsheetName = ss.getName();

  var report = {
    spreadsheet: spreadsheetName,
    spreadsheet_id: ss.getId(),
    created_sheets: [],
    existing_sheets: [],
    added_columns: {},
    errors: []
  };

  Logger.log("========================================");
  Logger.log("GFG × MARWADI UNIVERSITY DATABASE SETUP");
  Logger.log("========================================");
  Logger.log("Spreadsheet: " + spreadsheetName + " (" + ss.getId() + ")");
  Logger.log("----------------------------------------");

  var sheetNames = Object.keys(DATABASE_SCHEMA);

  for (var i = 0; i < sheetNames.length; i++) {
    var sheetName = sheetNames[i];
    var requiredHeaders = DATABASE_SCHEMA[sheetName];

    try {
      var sheet = ss.getSheetByName(sheetName);
      var isNewlyCreated = false;

      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        isNewlyCreated = true;
        report.created_sheets.push(sheetName);
        Logger.log(sheetName + ": CREATED");
      } else {
        report.existing_sheets.push(sheetName);
        Logger.log(sheetName + ": EXISTS");
      }

      // Read current headers in row 1
      var lastCol = sheet.getLastColumn();
      var existingHeaders = [];

      if (lastCol > 0) {
        var headerRange = sheet.getRange(1, 1, 1, lastCol);
        var headerValues = headerRange.getValues()[0];
        for (var h = 0; h < headerValues.length; h++) {
          existingHeaders.push(String(headerValues[h] || "").trim());
        }
      }

      // If sheet was just created or row 1 is completely empty
      if (existingHeaders.length === 0 || existingHeaders.every(function(val) { return val === ""; })) {
        sheet.getRange(1, 1, 1, requiredHeaders.length).setValues([requiredHeaders]);
        Logger.log("  -> Inserted all " + requiredHeaders.length + " headers.");
      } else {
        // Compare existing headers (case-insensitive) and append missing ones
        var existingLower = existingHeaders.map(function(h) { return h.toLowerCase(); });
        var missingHeaders = [];

        for (var r = 0; r < requiredHeaders.length; r++) {
          var reqCol = requiredHeaders[r];
          if (existingLower.indexOf(reqCol.toLowerCase()) === -1) {
            missingHeaders.push(reqCol);
          }
        }

        if (missingHeaders.length > 0) {
          report.added_columns[sheetName] = missingHeaders;
          var startCol = lastCol + 1;
          sheet.getRange(1, startCol, 1, missingHeaders.length).setValues([missingHeaders]);
          Logger.log("  -> Added missing columns: " + missingHeaders.join(", "));
        }
      }

      // Formatting: Freeze Row 1, bold header, subtle background
      sheet.setFrozenRows(1);
      var currentHeaderCols = sheet.getLastColumn() || requiredHeaders.length;
      var formatRange = sheet.getRange(1, 1, 1, currentHeaderCols);
      formatRange.setFontWeight("bold");
      formatRange.setBackground("#EFEFEF");
      formatRange.setFontFamily("Arial");
      formatRange.setFontSize(10);

      // Auto-resize columns up to 18 columns for clean UI
      try {
        for (var c = 1; c <= Math.min(currentHeaderCols, 20); c++) {
          sheet.autoResizeColumn(c);
        }
      } catch (resizeErr) {
        // Non-critical, ignore if headless
      }

    } catch (sheetErr) {
      report.errors.push({ sheet: sheetName, error: sheetErr.toString() });
      Logger.log("  -> ERROR in " + sheetName + ": " + sheetErr.toString());
    }
  }

  // Populate basic Stats metrics if Stats sheet is empty
  try {
    var statsSheet = ss.getSheetByName(APP_CONFIG.SHEETS.STATS);
    if (statsSheet && statsSheet.getLastRow() <= 1) {
      var defaultStats = [
        ["total_events", 0, Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss")],
        ["published_events", 0, Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss")],
        ["total_registrations", 0, Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss")],
        ["total_attendance", 0, Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss")],
        ["active_team_members", 0, Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss")]
      ];
      statsSheet.getRange(2, 1, defaultStats.length, 3).setValues(defaultStats);
      Logger.log("Initialized Stats metrics.");
    }
  } catch (statsErr) {
    Logger.log("Stats default initialization note: " + statsErr.toString());
  }

  // Remove default "Sheet1" if all 9 database sheets exist and Sheet1 is blank
  try {
    var defaultSheet1 = ss.getSheetByName("Sheet1");
    if (defaultSheet1 && ss.getSheets().length > 1 && defaultSheet1.getLastRow() === 0) {
      ss.deleteSheet(defaultSheet1);
    }
  } catch (cleanErr) {}

  SpreadsheetApp.flush();

  Logger.log("----------------------------------------");
  Logger.log("========================================");
  Logger.log("DATABASE SETUP COMPLETE");
  Logger.log("========================================");

  return report;
}

/**
 * Read-Only Database Verification Function
 * 
 * Verifies that all 9 sheets and all required columns exist in the configured
 * spreadsheet without altering any rows or columns.
 * 
 * @return {Object} Verification report
 */
function verifyDatabase() {
  var ss = getSpreadsheet();
  var sheetNames = Object.keys(DATABASE_SCHEMA);

  var results = {
    valid: true,
    spreadsheet_name: ss.getName(),
    spreadsheet_id: ss.getId(),
    sheets: {},
    missing_sheets: [],
    missing_headers: {}
  };

  for (var i = 0; i < sheetNames.length; i++) {
    var sheetName = sheetNames[i];
    var requiredCols = DATABASE_SCHEMA[sheetName];
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      results.valid = false;
      results.missing_sheets.push(sheetName);
      continue;
    }

    var lastCol = sheet.getLastColumn();
    var lastRow = sheet.getLastRow();
    var existingCols = [];

    if (lastCol > 0) {
      var headerValues = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      for (var c = 0; c < headerValues.length; c++) {
        existingCols.push(String(headerValues[c] || "").trim());
      }
    }

    var existingLower = existingCols.map(function(h) { return h.toLowerCase(); });
    var missing = [];

    for (var r = 0; r < requiredCols.length; r++) {
      var reqCol = requiredCols[r];
      if (existingLower.indexOf(reqCol.toLowerCase()) === -1) {
        missing.push(reqCol);
      }
    }

    if (missing.length > 0) {
      results.valid = false;
      results.missing_headers[sheetName] = missing;
    }

    results.sheets[sheetName] = {
      present: true,
      row_count: Math.max(0, lastRow - 1),
      column_count: lastCol,
      missing_headers: missing
    };
  }

  Logger.log("Verification Result: " + JSON.stringify(results, null, 2));
  return results;
}

/**
 * OPTIONAL DEMO DATA SEEDER (DEMO ONLY)
 * 
 * NOTE: This function is NEVER called automatically by setupDatabase().
 * The user may manually execute seedDemoData() from the script editor if they
 * want to populate mock events for testing in a development environment.
 */
function seedDemoData() {
  var ss = getSpreadsheet();
  var eventsSheet = ss.getSheetByName(APP_CONFIG.SHEETS.EVENTS);
  if (!eventsSheet) {
    throw new Error("Events sheet not found. Run setupDatabase() first.");
  }

  if (eventsSheet.getLastRow() > 1) {
    Logger.log("Events sheet already contains data. Skipping demo seed.");
    return;
  }

  var nowStr = Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");

  var demoEvents = [
    [
      "EVT-0001",
      "GFG × Marwadi University Connect",
      "A technical community event focused on coding, problem solving, career opportunities, open source and the GeeksforGeeks ecosystem for students.",
      "2026-09-24",
      "10:00 AM",
      "01:00 PM",
      "Marwadi University, Rajkot",
      "2026-09-23",
      500,
      "CLOSED",
      "PUBLISHED",
      "GFG × Marwadi University Chapter",
      "gfg@marwadiuniversity.ac.in",
      "+91 88661 23456",
      120,
      nowStr,
      nowStr,
      nowStr
    ],
    [
      "EVT-0002",
      "Google Cloud AI Labs – Build with AI Bootcamp 2026",
      "A hands-on AI and Google Cloud learning session covering modern AI tools, cloud technologies and practical development workflows for students.",
      "2026-10-04",
      "09:30 AM",
      "04:30 PM",
      "MU ICT Computer Lab 3",
      "2026-10-02",
      300,
      "CLOSED",
      "PUBLISHED",
      "Google Cloud × GFG Chapter",
      "gfg@marwadiuniversity.ac.in",
      "+91 88661 23456",
      85,
      nowStr,
      nowStr,
      nowStr
    ],
    [
      "EVT-0003",
      "Google Cloud Learn with Communities — Hands-On Cloud Learning Workshop",
      "Join the Google Cloud Learn with Communities workshop at Marwadi University, organized in collaboration with GeeksforGeeks and Google Cloud. Get hands-on experience with real Google Cloud labs, learn practical cloud skills, redeem free Google Skills credits, and earn industry-recognized skill badges — no prior cloud experience required.",
      "DECLARED SOON",
      "DECLARED SOON",
      "DECLARED SOON",
      "TO BE ANNOUNCED",
      "TO BE ANNOUNCED",
      500,
      "OPEN",
      "PUBLISHED",
      "GeeksforGeeks × Marwadi University",
      "gfg@marwadiuniversity.ac.in",
      "+91 88661 23456",
      3,
      nowStr,
      nowStr,
      nowStr
    ]
  ];

  eventsSheet.getRange(2, 1, demoEvents.length, demoEvents[0].length).setValues(demoEvents);
  SpreadsheetApp.flush();
  Logger.log("Successfully seeded " + demoEvents.length + " demo events.");
}

/**
 * DANGEROUS / DESTRUCTIVE DATABASE RESET
 * 
 * NEVER CALLED AUTOMATICALLY.
 * Must only be called explicitly if a developer wants to purge and reset all sheets.
 */
function resetDatabase() {
  Logger.log("RESET_DATABASE called. Running setupDatabase() cleanly.");
  return setupDatabase();
}
