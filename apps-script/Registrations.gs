/**
 * ============================================================================
 * Registrations.gs — Event Registration Engine & Participant Records
 * ============================================================================
 * 
 * Manages participant sign-ups for campus hackathons, workshops, and competitions.
 */

/**
 * POST ?action=register
 * 
 * Registers a student/participant for an event.
 * 
 * @param {Object} data
 * @return {TextOutput}
 */
function registerEvent(data) {
  var lock = LockService.getScriptLock();
  try {
    var hasLock = lock.tryLock(APP_CONFIG.LOCK_TIMEOUT_MS);
    if (!hasLock) {
      return jsonResponse({
        success: false,
        code: "SERVER_BUSY",
        message: "Server is currently busy. Please try again in a moment."
      });
    }

    var eventId = (data.event_id || data.eventId || data.Event_ID || "").toString().trim();
    var name = (data.name || data.Name || data.participant_name || "").toString().trim();
    var email = (data.email || data.Email || "").toString().trim();

    // 1. Mandatory field validation (NO default fallback to EVT-0001)
    if (!eventId) {
      return jsonResponse({
        success: false,
        code: "VALIDATION_ERROR",
        message: "event_id is required."
      });
    }

    if (!name) {
      return jsonResponse({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Participant name is required."
      });
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return jsonResponse({
        success: false,
        code: "VALIDATION_ERROR",
        message: "A valid email address is required."
      });
    }

    var phone = (data.phone || data.Phone || data.mobile || "").toString().trim();
    var enrollment = (data.enrollment_number || data.enrollmentNumber || data.enrollment || "").toString().trim();
    var program = (data.program || data.Program || data.branch || "").toString().trim();
    var department = (data.department || data.Department || "").toString().trim();
    var year = (data.year || data.Year || "").toString().trim();
    var college = (data.college || data.College || "Marwadi University").toString().trim();

    var ss = getSpreadsheet();
    var regSheet = ss.getSheetByName(APP_CONFIG.SHEETS.REGISTRATIONS);
    if (!regSheet) {
      return jsonResponse({
        success: false,
        code: "SHEET_NOT_FOUND",
        message: "Registrations sheet not found in database."
      });
    }

    var headerMap = buildHeaderMap_(regSheet);
    var rows = regSheet.getDataRange().getValues();

    // 2. Duplicate Check (Email + Event_ID)
    var cleanEmail = email.toLowerCase();
    var cleanEventId = eventId.toLowerCase();

    for (var r = 1; r < rows.length; r++) {
      var row = rows[r];
      var rowEvent = String(getRowValue_(row, headerMap, ["Event_ID", "event_id"])).trim().toLowerCase();
      var rowEmail = String(getRowValue_(row, headerMap, ["Email", "email"])).trim().toLowerCase();
      var rowRegId = String(getRowValue_(row, headerMap, ["Registration_ID", "registration_id"]));

      if (rowEvent === cleanEventId && rowEmail === cleanEmail) {
        return jsonResponse({
          success: true,
          code: "ALREADY_REGISTERED",
          message: "You are already registered for this event.",
          registration_id: rowRegId,
          event_id: eventId,
          name: name,
          email: email
        });
      }
    }

    // 3. Generate Unique Registration ID: REG-[timestamp]-[random]
    var timestamp = new Date().getTime();
    var randomSuffix = Math.floor(100 + Math.random() * 900);
    var registrationId = "REG-" + timestamp + "-" + randomSuffix;
    var timestampStr = Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");

    // Standard columns for Registrations sheet:
    // Registration_ID, Event_ID, Name, Email, Phone, Enrollment_Number, Program, Department, Year, College, Timestamp, Status, Attendance_Status, Certificate_Status, Certificate_URL
    var newRow = [
      registrationId,
      eventId,
      name,
      email,
      phone,
      enrollment,
      program,
      department,
      year,
      college,
      timestampStr,
      "CONFIRMED",
      "NOT_MARKED",
      "PENDING",
      ""
    ];

    regSheet.appendRow(newRow);

    // 4. Increment Registration_Count in Events sheet if matching event found
    try {
      var eventsSheet = ss.getSheetByName(APP_CONFIG.SHEETS.EVENTS);
      if (eventsSheet) {
        var eHeaderMap = buildHeaderMap_(eventsSheet);
        var eRows = eventsSheet.getDataRange().getValues();
        var idColIdx = eHeaderMap["eventid"] !== undefined ? eHeaderMap["eventid"] : 0;
        var countColIdx = eHeaderMap["registrationcount"] !== undefined ? eHeaderMap["registrationcount"] : 14;

        for (var er = 1; er < eRows.length; er++) {
          if (String(eRows[er][idColIdx]).trim().toUpperCase() === eventId.toUpperCase()) {
            var currentCount = Number(eRows[er][countColIdx]) || 0;
            eventsSheet.getRange(er + 1, countColIdx + 1).setValue(currentCount + 1);
            break;
          }
        }
      }
    } catch (countErr) {
      Logger.log("Registration count increment note: " + countErr.toString());
    }

    // 5. Activity Log
    logActivity("EVENT_REGISTRATION", name, email, eventId, "Registered via Portal API: " + registrationId, "SUCCESS");

    SpreadsheetApp.flush();

    return jsonResponse({
      success: true,
      code: "REGISTRATION_SUCCESS",
      message: "Registration completed successfully.",
      registration_id: registrationId,
      event_id: eventId,
      name: name,
      email: email,
      timestamp: timestampStr
    });

  } catch (err) {
    Logger.log("registerEvent error: " + err.toString());
    return jsonResponse({
      success: false,
      code: "SERVER_ERROR",
      message: "Error submitting registration: " + err.toString()
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (e) {}
  }
}

/**
 * GET ?action=registration&id=REGISTRATION_ID
 * 
 * Fetches a registration record by Registration_ID.
 * 
 * @param {string} registrationId
 * @return {TextOutput}
 */
function getRegistrationById(registrationId) {
  if (!registrationId) {
    return jsonResponse({
      success: false,
      code: "INVALID_ID",
      error: "registration_id is required"
    });
  }

  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(APP_CONFIG.SHEETS.REGISTRATIONS);
    if (!sheet) {
      return jsonResponse({
        success: false,
        code: "SHEET_NOT_FOUND",
        error: "Registrations sheet not found."
      });
    }

    var headerMap = buildHeaderMap_(sheet);
    var rows = sheet.getDataRange().getValues();
    var target = String(registrationId).trim().toUpperCase();

    for (var r = 1; r < rows.length; r++) {
      var row = rows[r];
      var rowRegId = String(getRowValue_(row, headerMap, ["Registration_ID", "registration_id", "id"])).trim().toUpperCase();

      if (rowRegId === target) {
        return jsonResponse({
          success: true,
          registration: {
            registration_id: rowRegId,
            event_id: String(getRowValue_(row, headerMap, ["Event_ID", "event_id"])),
            name: String(getRowValue_(row, headerMap, ["Name", "name"])),
            email: String(getRowValue_(row, headerMap, ["Email", "email"])),
            phone: String(getRowValue_(row, headerMap, ["Phone", "phone"])),
            enrollment_number: String(getRowValue_(row, headerMap, ["Enrollment_Number", "enrollment_number", "enrollment"])),
            program: String(getRowValue_(row, headerMap, ["Program", "program", "branch"])),
            department: String(getRowValue_(row, headerMap, ["Department", "department"])),
            year: String(getRowValue_(row, headerMap, ["Year", "year"])),
            college: String(getRowValue_(row, headerMap, ["College", "college"])),
            status: String(getRowValue_(row, headerMap, ["Status", "status"])),
            attendance_status: String(getRowValue_(row, headerMap, ["Attendance_Status", "attendance_status"])),
            certificate_status: String(getRowValue_(row, headerMap, ["Certificate_Status", "certificate_status"])),
            certificate_url: String(getRowValue_(row, headerMap, ["Certificate_URL", "certificate_url"])),
            timestamp: String(getRowValue_(row, headerMap, ["Timestamp", "timestamp"]))
          }
        });
      }
    }

    return jsonResponse({
      success: false,
      code: "NOT_FOUND",
      error: "Registration not found for ID: " + registrationId
    });

  } catch (err) {
    return jsonResponse({
      success: false,
      code: "FETCH_ERROR",
      error: "Error querying registration: " + err.toString()
    });
  }
}
