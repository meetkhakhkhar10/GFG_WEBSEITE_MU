/**
 * ============================================================================
 * CertificateCode.gs — Complete Dedicated Certificate Backend System
 * ============================================================================
 * 
 * Part of GFG × Marwadi University Portal
 * 
 * Attendance Sheet Columns (1-10 / Columns A-J):
 *   Column A (1):  Attendance_ID   (ATT-[timestamp]-[3 digit random number])
 *   Column B (2):  Registration_ID (REG-[timestamp]-[3 digit random number])
 *   Column C (3):  Event_ID        (Dynamic, supplied by frontend)
 *   Column D (4):  Name            (Participant Full Name)
 *   Column E (5):  Email           (Participant Email)
 *   Column F (6):  Attendance_Date (DD/MM/YYYY, e.g. 26/09/2026)
 *   Column G (7):  Attendance_Time (HH:mm:ss, e.g. 23:15:42)
 *   Column H (8):  Method          ("BY-OWN")
 *   Column I (9):  Status          ("DONE")
 *   Column J (10): Marked_By       (Initially blank, updated upon coordinator QR scan)
 * 
 * Functions provided for Code.gs router hook:
 *   - isCertificateAction(action)
 *   - handleCertificatePostAction(action, data, e)
 *   - handleCertificateDataEntry(data)
 *   - handleCertificateScannerLogin(data)
 *   - handleCertificateQrScan(data)
 *   - validateScannerSession_(token)
 *   - certJsonResponse(obj)
 */

// --- CONFIGURATION CONSTANTS ---
var CERT_CONFIG = {
  ATTENDANCE_SHEET_NAME: "Attendance",
  LOCK_TIMEOUT_MS: 30000,
  SESSION_LIFETIME_MS: 30 * 60 * 1000, // 30 minutes session expiry
  TIMEZONE: "Asia/Kolkata",
  SCANNER_ACCOUNTS: {
    "meet123": {
      password: "meet",
      identity: "Meet Khakhkhar"
    },
    "vyshnavi": {
      password: "vyshnavi123",
      identity: "Vyshnavi"
    }
  }
};

/**
 * Checks if the requested action is one of the 3 dedicated certificate actions
 * @param {string} action
 * @return {boolean}
 */
function isCertificateAction(action) {
  if (!action) return false;
  var act = action.toString().toLowerCase().trim();
  return (
    act === "certificate_data_entry" ||
    act === "scanner_login" ||
    act === "certificate_qr_scan"
  );
}

/**
 * Routes Certificate POST Actions
 * @param {string} action
 * @param {Object} data - Parsed POST payload object
 * @param {Object} e - Original Apps Script event object
 * @return {TextOutput}
 */
function handleCertificatePostAction(action, data, e) {
  var act = (action || "").toString().toLowerCase().trim();

  if (act === "certificate_data_entry") {
    return handleCertificateDataEntry(data);
  }

  if (act === "scanner_login") {
    return handleCertificateScannerLogin(data);
  }

  if (act === "certificate_qr_scan") {
    return handleCertificateQrScan(data);
  }

  return certJsonResponse({
    success: false,
    code: "INVALID_ACTION",
    message: "Invalid certificate action: " + action
  });
}

/**
 * ============================================================================
 * 1. CERTIFICATE DATA ENTRY
 * ============================================================================
 * Appends participant information to existing Attendance sheet with unique IDs.
 * Requires: name, email, event_id.
 * Protected by LockService to prevent race conditions.
 *
 * Attendance Columns (A-J / 1-10):
 * [Attendance_ID, Registration_ID, Event_ID, Name, Email, Attendance_Date, Attendance_Time, "BY-OWN", "DONE", ""]
 */
function handleCertificateDataEntry(data) {
  var lock = LockService.getScriptLock();
  try {
    var hasLock = lock.tryLock(CERT_CONFIG.LOCK_TIMEOUT_MS);
    if (!hasLock) {
      return certJsonResponse({
        success: false,
        code: "SERVER_BUSY",
        message: "Server is currently busy. Please try submitting again in a moment."
      });
    }

    var name = (data.name || data.Name || "").toString().trim();
    var email = (data.email || data.Email || "").toString().trim();
    var eventId = (data.event_id || data.eventId || data.Event_ID || "").toString().trim();

    // 1. Mandatory Event_ID validation (No hardcoded fallback allowed)
    if (!eventId) {
      return certJsonResponse({
        success: false,
        code: "SUBMISSION_FAILED",
        message: "event_id is required"
      });
    }

    // 2. Mandatory Name validation
    if (!name) {
      return certJsonResponse({
        success: false,
        code: "SUBMISSION_FAILED",
        message: "name is required"
      });
    }

    // 3. Email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return certJsonResponse({
        success: false,
        code: "SUBMISSION_FAILED",
        message: "A valid email is required"
      });
    }

    // 4. Retrieve existing Attendance Sheet ONLY (Never create a new sheet)
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(CERT_CONFIG.ATTENDANCE_SHEET_NAME);
    if (!sheet) {
      return certJsonResponse({
        success: false,
        code: "CONFIGURATION_ERROR",
        message: "Attendance sheet not found"
      });
    }

    var rows = sheet.getDataRange().getValues();

    // 5. Case-insensitive Duplicate Submission Check (Email + Event_ID)
    var cleanEmail = email.toLowerCase();
    var cleanEventId = eventId.toLowerCase();

    for (var i = 1; i < rows.length; i++) {
      var rowRegId = (rows[i][1] || "").toString().trim();
      var rowEvent = (rows[i][2] || "").toString().trim().toLowerCase();
      var rowEmail = (rows[i][4] || "").toString().trim().toLowerCase();

      if (rowEmail === cleanEmail && rowEvent === cleanEventId) {
        return certJsonResponse({
          success: false,
          code: "ALREADY_SUBMITTED",
          message: "Certificate data already submitted for this event.",
          registration_id: rowRegId
        });
      }
    }

    // 6. Generate IDs matching existing Attendance system format:
    // Attendance_ID:   ATT-[timestamp]-[3 digit random number]
    // Registration_ID: REG-[timestamp]-[3 digit random number]
    var timestamp = new Date().getTime();
    var randomSuffix = Math.floor(100 + Math.random() * 900);
    var registrationId = "REG-" + timestamp + "-" + randomSuffix;
    var attendanceId = "ATT-" + timestamp + "-" + randomSuffix;

    // 7. Date and Time in Asia/Kolkata (Strictly separated)
    var now = new Date();
    var dateFormatted = Utilities.formatDate(now, CERT_CONFIG.TIMEZONE, "dd/MM/yyyy"); // DD/MM/YYYY
    var timeFormatted = Utilities.formatDate(now, CERT_CONFIG.TIMEZONE, "HH:mm:ss");   // HH:mm:ss

    var method = "BY-OWN";
    var status = "DONE";
    var markedBy = ""; // Left blank initially until coordinator QR scan

    // Exactly ONE row appended:
    // Col A (1): Attendance_ID
    // Col B (2): Registration_ID
    // Col C (3): Event_ID
    // Col D (4): Name
    // Col E (5): Email
    // Col F (6): Attendance_Date (DD/MM/YYYY)
    // Col G (7): Attendance_Time (HH:mm:ss)
    // Col H (8): "BY-OWN"
    // Col I (9): "DONE"
    // Col J (10): "" (blank)
    var newRow = [
      attendanceId,
      registrationId,
      eventId,
      name,
      email,
      dateFormatted,
      timeFormatted,
      method,
      status,
      markedBy
    ];

    sheet.appendRow(newRow);
    SpreadsheetApp.flush();

    return certJsonResponse({
      success: true,
      code: "CREATED",
      message: "Certificate data submitted successfully.",
      attendance_id: attendanceId,
      registration_id: registrationId,
      event_id: eventId,
      name: name,
      email: email,
      date: dateFormatted,
      time: timeFormatted
    });

  } catch (err) {
    return certJsonResponse({
      success: false,
      code: "SERVER_ERROR",
      message: "Error processing certificate entry: " + err.toString()
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (e) {}
  }
}

/**
 * ============================================================================
 * 2. SCANNER AUTHENTICATION (SERVER-SIDE SESSION)
 * ============================================================================
 * Exactly TWO Allowed Accounts:
 *   1) meet123 / meet         -> Meet Khakhkhar
 *   2) vyshnavi / vyshnavi123 -> Vyshnavi
 *
 * Generates an unpredictable random session token stored in Script Properties.
 * Session duration: 30 minutes.
 * Server determines identity from credentials; frontend has no control over identity.
 */
function handleCertificateScannerLogin(data) {
  var username = (data.username || data.login_id || data.loginId || "").toString().trim();
  var password = (data.password || data.pass || "").toString().trim();

  if (!username || !password) {
    return certJsonResponse({
      success: false,
      code: "INVALID_CREDENTIALS",
      message: "Invalid username or password."
    });
  }

  var account = CERT_CONFIG.SCANNER_ACCOUNTS[username];
  if (!account || account.password !== password) {
    return certJsonResponse({
      success: false,
      code: "INVALID_CREDENTIALS",
      message: "Invalid username or password."
    });
  }

  // Generate cryptographically random session token
  var randomId = Utilities.getUuid().replace(/-/g, "") + "_" + Math.floor(100000 + Math.random() * 900000);
  var sessionToken = "STOK_" + randomId;

  var now = new Date().getTime();
  var sessionData = {
    token: sessionToken,
    username: username,
    identity: account.identity,
    issued_at: now,
    expires_at: now + CERT_CONFIG.SESSION_LIFETIME_MS
  };

  // Persist session server-side in Script Properties (fallback to User Properties)
  try {
    var props = PropertiesService.getScriptProperties();
    props.setProperty("SESSION_" + sessionToken, JSON.stringify(sessionData));
  } catch (e) {
    PropertiesService.getUserProperties().setProperty("SESSION_" + sessionToken, JSON.stringify(sessionData));
  }

  return certJsonResponse({
    success: true,
    code: "LOGIN_SUCCESS",
    token: sessionToken,
    identity: account.identity
  });
}

/**
 * Validates a server-side session token against stored Script Properties
 * @param {string} token
 * @return {Object|null}
 */
function validateScannerSession_(token) {
  if (!token) return null;
  var tokenStr = token.toString().trim();

  var rawSession = null;
  try {
    rawSession = PropertiesService.getScriptProperties().getProperty("SESSION_" + tokenStr);
    if (!rawSession) {
      rawSession = PropertiesService.getUserProperties().getProperty("SESSION_" + tokenStr);
    }
  } catch (e) {}

  if (!rawSession) return null;

  try {
    var session = JSON.parse(rawSession);
    var now = new Date().getTime();

    // Check expiration (30 minutes)
    if (now > session.expires_at) {
      try {
        PropertiesService.getScriptProperties().deleteProperty("SESSION_" + tokenStr);
        PropertiesService.getUserProperties().deleteProperty("SESSION_" + tokenStr);
      } catch (e) {}
      return { expired: true };
    }

    // Verify username belongs to exact allowed scanner list
    var account = CERT_CONFIG.SCANNER_ACCOUNTS[session.username];
    if (!account || account.identity !== session.identity) {
      return null;
    }

    return session;
  } catch (e) {
    return null;
  }
}

/**
 * ============================================================================
 * 3. CERTIFICATE QR SCAN & VERIFICATION
 * ============================================================================
 * Request must contain:
 *   {
 *     "action": "certificate_qr_scan",
 *     "registration_id": "REG-...",
 *     "token": "SERVER_GENERATED_SESSION_TOKEN"
 *   }
 *
 * Rules:
 *   1. Authenticates session token via PropertiesService (derives coordinator identity).
 *   2. Client-supplied identity strings or marked_by fallbacks are NEVER accepted.
 *   3. Finds row in Attendance sheet by searching Column B (Registration_ID) ONLY.
 *      Never searches Attendance_ID (Col A), Name (Col D), Email (Col E), or Event_ID (Col C).
 *   4. If Marked_By (Column J) is blank -> Updates ONLY Column J in-place to scanner identity.
 *   5. If Marked_By (Column J) is already populated -> Returns ALREADY_VERIFIED without modifying row.
 *   6. If Registration_ID not found in Column B -> Returns REGISTRATION_NOT_FOUND.
 *   7. NEVER appends a new row to Attendance.
 *   8. Protected by LockService.
 */
function handleCertificateQrScan(data) {
  var lock = LockService.getScriptLock();
  try {
    var hasLock = lock.tryLock(CERT_CONFIG.LOCK_TIMEOUT_MS);
    if (!hasLock) {
      return certJsonResponse({
        success: false,
        code: "SERVER_BUSY",
        message: "Server is busy. Please try scanning again."
      });
    }

    // 1. Session Token Authentication
    var token = (data.token || "").toString().trim();
    if (!token) {
      return certJsonResponse({
        success: false,
        code: "UNAUTHORIZED",
        message: "Invalid or expired scanner session."
      });
    }

    var session = validateScannerSession_(token);
    if (!session || session.expired) {
      return certJsonResponse({
        success: false,
        code: "UNAUTHORIZED",
        message: "Invalid or expired scanner session."
      });
    }

    // Scanner identity derived EXCLUSIVELY from server-side session
    var scannerIdentity = session.identity;

    // 2. Extract Registration ID
    var rawRegId = (data.registration_id || "").toString().trim();
    if (!rawRegId) {
      return certJsonResponse({
        success: false,
        code: "REGISTRATION_NOT_FOUND",
        message: "Registration ID not found."
      });
    }

    // 3. Access Attendance Sheet ONLY
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(CERT_CONFIG.ATTENDANCE_SHEET_NAME);
    if (!sheet) {
      return certJsonResponse({
        success: false,
        code: "CONFIGURATION_ERROR",
        message: "Attendance sheet not found"
      });
    }

    var rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return certJsonResponse({
        success: false,
        code: "REGISTRATION_NOT_FOUND",
        message: "Registration ID not found."
      });
    }

    // 4. Search Column B (Col index 1) ONLY for Registration_ID
    var matchIndex = -1;
    var targetClean = rawRegId.toUpperCase();

    for (var i = 1; i < rows.length; i++) {
      var rowRegId = (rows[i][1] || "").toString().trim().toUpperCase(); // Column B ONLY

      if (rowRegId === targetClean) {
        matchIndex = i;
        break;
      }
    }

    if (matchIndex === -1) {
      return certJsonResponse({
        success: false,
        code: "REGISTRATION_NOT_FOUND",
        message: "Registration ID not found."
      });
    }

    var participantRow = rows[matchIndex];
    var regId = participantRow[1];  // Column B
    var eventId = participantRow[2]; // Column C
    var pName = participantRow[3];   // Column D
    var pEmail = participantRow[4];  // Column E
    var existingMarkedBy = (participantRow[9] || "").toString().trim(); // Column J

    // 5. Check if already verified
    if (existingMarkedBy !== "") {
      return certJsonResponse({
        success: false,
        code: "ALREADY_VERIFIED",
        message: "This registration has already been verified.",
        registration_id: regId,
        name: pName,
        email: pEmail,
        event_id: eventId,
        marked_by: existingMarkedBy
      });
    }

    // 6. Update ONLY Column J (Column 10) on the EXISTING row (1-indexed row: matchIndex + 1)
    var sheetRowIndex = matchIndex + 1;
    sheet.getRange(sheetRowIndex, 10).setValue(scannerIdentity);
    SpreadsheetApp.flush();

    return certJsonResponse({
      success: true,
      code: "VERIFIED",
      message: "Certificate attendance verified successfully.",
      registration_id: regId,
      name: pName,
      email: pEmail,
      event_id: eventId,
      marked_by: scannerIdentity
    });

  } catch (err) {
    return certJsonResponse({
      success: false,
      code: "SERVER_ERROR",
      message: "Error verifying QR: " + err.toString()
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (e) {}
  }
}

/**
 * ============================================================================
 * 4. JSON RESPONSE HELPER
 * ============================================================================
 */
function certJsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
