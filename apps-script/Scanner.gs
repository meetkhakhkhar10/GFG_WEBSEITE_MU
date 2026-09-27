/**
 * ============================================================================
 * Scanner.gs — Coordinator QR Attendance Scanner & Verification Engine
 * ============================================================================
 * 
 * Rules:
 *   1. Authenticates session token via PropertiesService (derives coordinator identity).
 *   2. Client-supplied identity strings or marked_by fallbacks are NEVER trusted.
 *   3. Finds row in Attendance sheet by searching Column B (Registration_ID) ONLY.
 *      Never searches Attendance_ID (Col A), Name (Col D), Email (Col E), or Event_ID (Col C).
 *   4. If Marked_By (Column J) is blank -> Updates ONLY Column J in-place to scanner identity.
 *   5. If Marked_By (Column J) is already populated -> Returns ALREADY_VERIFIED without modifying row.
 *   6. If Registration_ID not found in Column B -> Returns REGISTRATION_NOT_FOUND.
 *   7. NEVER appends a new row to Attendance during QR scanning.
 *   8. Protected by LockService to eliminate concurrent double-marking race conditions.
 */

/**
 * POST ?action=scanner_login
 * 
 * Authenticates coordinator accounts and generates an unpredictable session token.
 * 
 * @param {Object} data
 * @return {TextOutput}
 */
function handleCertificateScannerLogin(data) {
  var username = (data.username || data.login_id || data.loginId || "").toString().trim();
  var password = (data.password || data.pass || "").toString().trim();

  if (!username || !password) {
    return jsonResponse({
      success: false,
      code: "INVALID_CREDENTIALS",
      message: "Invalid username or password."
    });
  }

  var account = APP_CONFIG.SCANNER_ACCOUNTS[username];
  if (!account || account.password !== password) {
    return jsonResponse({
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
    expires_at: now + APP_CONFIG.SESSION_LIFETIME_MS
  };

  // Persist session server-side in Script Properties (fallback to User Properties)
  try {
    var props = PropertiesService.getScriptProperties();
    props.setProperty("SESSION_" + sessionToken, JSON.stringify(sessionData));
  } catch (e) {
    PropertiesService.getUserProperties().setProperty("SESSION_" + sessionToken, JSON.stringify(sessionData));
  }

  logActivity("SCANNER_LOGIN", account.identity, username + "@scanner", "", "Coordinator logged in", "SUCCESS");

  return jsonResponse({
    success: true,
    code: "LOGIN_SUCCESS",
    token: sessionToken,
    identity: account.identity
  });
}

/**
 * Validates a server-side session token against stored Script Properties.
 * 
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
    var account = APP_CONFIG.SCANNER_ACCOUNTS[session.username];
    if (!account || account.identity !== session.identity) {
      return null;
    }

    return session;
  } catch (e) {
    return null;
  }
}

/**
 * POST ?action=certificate_qr_scan
 * 
 * Verifies participant QR code by searching Column B (Registration_ID) in Attendance sheet.
 * 
 * @param {Object} data
 * @return {TextOutput}
 */
function handleCertificateQrScan(data) {
  var lock = LockService.getScriptLock();
  try {
    var hasLock = lock.tryLock(APP_CONFIG.LOCK_TIMEOUT_MS);
    if (!hasLock) {
      return jsonResponse({
        success: false,
        code: "SERVER_BUSY",
        message: "Server is busy. Please try scanning again."
      });
    }

    // 1. Session Token Authentication
    var token = (data.token || "").toString().trim();
    if (!token) {
      return jsonResponse({
        success: false,
        code: "UNAUTHORIZED",
        message: "Invalid or expired scanner session."
      });
    }

    var session = validateScannerSession_(token);
    if (!session || session.expired) {
      return jsonResponse({
        success: false,
        code: "UNAUTHORIZED",
        message: "Invalid or expired scanner session. Please log in again."
      });
    }

    // Scanner identity derived EXCLUSIVELY from server-side session
    var scannerIdentity = session.identity;

    // 2. Extract Registration ID
    var rawRegId = (data.registration_id || data.reg_id || "").toString().trim();
    if (!rawRegId) {
      return jsonResponse({
        success: false,
        code: "REGISTRATION_NOT_FOUND",
        message: "Registration ID not found in scan payload."
      });
    }

    // 3. Access Attendance Sheet ONLY
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(APP_CONFIG.SHEETS.ATTENDANCE);
    if (!sheet) {
      return jsonResponse({
        success: false,
        code: "CONFIGURATION_ERROR",
        message: "Attendance sheet not found in database."
      });
    }

    var rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return jsonResponse({
        success: false,
        code: "REGISTRATION_NOT_FOUND",
        message: "Registration ID not found in Attendance sheet."
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
      return jsonResponse({
        success: false,
        code: "REGISTRATION_NOT_FOUND",
        message: "Registration ID not found in Attendance sheet: " + rawRegId
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
      return jsonResponse({
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

    logActivity("QR_VERIFY", scannerIdentity, pEmail, eventId, "Verified registration: " + regId, "SUCCESS");

    return jsonResponse({
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
    Logger.log("handleCertificateQrScan error: " + err.toString());
    return jsonResponse({
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
