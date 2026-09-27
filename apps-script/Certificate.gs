/**
 * ============================================================================
 * Certificate.gs — Certificate Attendance Data Entry Engine
 * ============================================================================
 * 
 * Manages participant self-registration for certificate generation.
 * Writes records directly to the single unified "Attendance" sheet.
 * 
 * Attendance Columns (A-J / 1-10):
 *   [Attendance_ID, Registration_ID, Event_ID, Name, Email, Attendance_Date, Attendance_Time, "BY-OWN", "DONE", ""]
 */

/**
 * POST ?action=certificate_data_entry
 * 
 * Handles participant certificate attendance submission.
 * 
 * @param {Object} data
 * @return {TextOutput}
 */
function handleCertificateDataEntry(data) {
  var lock = LockService.getScriptLock();
  try {
    var hasLock = lock.tryLock(APP_CONFIG.LOCK_TIMEOUT_MS);
    if (!hasLock) {
      return jsonResponse({
        success: false,
        code: "SERVER_BUSY",
        message: "Server is currently busy. Please try submitting again in a moment."
      });
    }

    var name = (data.name || data.Name || data.participant_name || "").toString().trim();
    var email = (data.email || data.Email || "").toString().trim();
    var eventId = (data.event_id || data.eventId || data.Event_ID || "").toString().trim();

    // 1. Mandatory Event_ID validation (No hardcoded fallback allowed)
    if (!eventId) {
      return jsonResponse({
        success: false,
        code: "SUBMISSION_FAILED",
        message: "event_id is required."
      });
    }

    // 2. Mandatory Name validation
    if (!name) {
      return jsonResponse({
        success: false,
        code: "SUBMISSION_FAILED",
        message: "name is required."
      });
    }

    // 3. Email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return jsonResponse({
        success: false,
        code: "SUBMISSION_FAILED",
        message: "A valid email is required."
      });
    }

    // 4. Retrieve single unified Attendance Sheet
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

    // 5. Case-insensitive Duplicate Submission Check (Email + Event_ID)
    var cleanEmail = email.toLowerCase();
    var cleanEventId = eventId.toLowerCase();

    for (var i = 1; i < rows.length; i++) {
      var rowRegId = (rows[i][1] || "").toString().trim(); // Column B
      var rowEvent = (rows[i][2] || "").toString().trim().toLowerCase(); // Column C
      var rowEmail = (rows[i][4] || "").toString().trim().toLowerCase(); // Column E

      if (rowEmail === cleanEmail && rowEvent === cleanEventId) {
        return jsonResponse({
          success: false,
          code: "ALREADY_SUBMITTED",
          message: "Certificate data already submitted for this event.",
          registration_id: rowRegId
        });
      }
    }

    // 6. Generate IDs matching Attendance system format:
    // Attendance_ID:   ATT-[timestamp]-[3 digit random number]
    // Registration_ID: REG-[timestamp]-[3 digit random number]
    var timestamp = new Date().getTime();
    var randomSuffix = Math.floor(100 + Math.random() * 900);
    var registrationId = "REG-" + timestamp + "-" + randomSuffix;
    var attendanceId = "ATT-" + timestamp + "-" + randomSuffix;

    // 7. Date and Time in Asia/Kolkata (Strictly separated)
    var now = new Date();
    var dateFormatted = Utilities.formatDate(now, APP_CONFIG.TIMEZONE, "dd/MM/yyyy");
    var timeFormatted = Utilities.formatDate(now, APP_CONFIG.TIMEZONE, "HH:mm:ss");

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

    logActivity("CERTIFICATE_ENTRY", name, email, eventId, "Created Attendance: " + attendanceId + " / " + registrationId, "SUCCESS");

    SpreadsheetApp.flush();

    return jsonResponse({
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
    Logger.log("handleCertificateDataEntry error: " + err.toString());
    return jsonResponse({
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
