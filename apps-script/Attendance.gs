/**
 * ============================================================================
 * Attendance.gs — Standard Attendance Management
 * ============================================================================
 * 
 * Manages event attendance tracking on the single unified "Attendance" sheet.
 * 
 * Attendance Columns (A-J / 1-10):
 *   Column A (1):  Attendance_ID   (ATT-[timestamp]-[random])
 *   Column B (2):  Registration_ID (REG-[timestamp]-[random])
 *   Column C (3):  Event_ID
 *   Column D (4):  Name
 *   Column E (5):  Email
 *   Column F (6):  Attendance_Date (DD/MM/YYYY)
 *   Column G (7):  Attendance_Time (HH:mm:ss)
 *   Column H (8):  Method          ("SCAN" / "MANUAL" / "BY-OWN")
 *   Column I (9):  Status          ("DONE" / "PRESENT")
 *   Column J (10): Marked_By       (Coordinator Identity or Staff)
 */

/**
 * POST ?action=attendance
 * 
 * Records standard or staff-marked attendance for an event.
 * 
 * @param {Object} data
 * @return {TextOutput}
 */
function handleNormalAttendance(data) {
  var lock = LockService.getScriptLock();
  try {
    var hasLock = lock.tryLock(APP_CONFIG.LOCK_TIMEOUT_MS);
    if (!hasLock) {
      return jsonResponse({
        success: false,
        code: "SERVER_BUSY",
        message: "Server is busy. Please try again."
      });
    }

    var regId = (data.registration_id || data.reg_id || "").toString().trim();
    var eventId = (data.event_id || data.eventId || "").toString().trim();
    var name = (data.name || data.Name || "").toString().trim();
    var email = (data.email || data.Email || "").toString().trim();
    var markedBy = (data.marked_by || data.markedBy || "Staff Coordinator").toString().trim();
    var method = (data.method || "SCAN").toString().trim();

    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(APP_CONFIG.SHEETS.ATTENDANCE);
    if (!sheet) {
      return jsonResponse({
        success: false,
        code: "SHEET_NOT_FOUND",
        message: "Attendance sheet not found in database."
      });
    }

    var timestamp = new Date().getTime();
    var randomSuffix = Math.floor(100 + Math.random() * 900);
    var attId = "ATT-" + timestamp + "-" + randomSuffix;

    var now = new Date();
    var dateFormatted = Utilities.formatDate(now, APP_CONFIG.TIMEZONE, "dd/MM/yyyy");
    var timeFormatted = Utilities.formatDate(now, APP_CONFIG.TIMEZONE, "HH:mm:ss");

    var newRow = [
      attId,
      regId,
      eventId,
      name,
      email,
      dateFormatted,
      timeFormatted,
      method,
      "DONE",
      markedBy
    ];

    sheet.appendRow(newRow);

    // Update Registrations sheet Attendance_Status if Registration_ID provided
    if (regId) {
      try {
        var regSheet = ss.getSheetByName(APP_CONFIG.SHEETS.REGISTRATIONS);
        if (regSheet) {
          var rHeaderMap = buildHeaderMap_(regSheet);
          var rRows = regSheet.getDataRange().getValues();
          var regColIdx = rHeaderMap["registrationid"] !== undefined ? rHeaderMap["registrationid"] : 0;
          var attStatusColIdx = rHeaderMap["attendancestatus"] !== undefined ? rHeaderMap["attendancestatus"] : 12;

          for (var r = 1; r < rRows.length; r++) {
            if (String(rRows[r][regColIdx]).trim().toUpperCase() === regId.toUpperCase()) {
              regSheet.getRange(r + 1, attStatusColIdx + 1).setValue("PRESENT");
              break;
            }
          }
        }
      } catch (regErr) {
        Logger.log("Registration attendance sync note: " + regErr.toString());
      }
    }

    logActivity("ATTENDANCE_MARKED", markedBy, email, eventId, "Attendance ID: " + attId + " for " + regId, "SUCCESS");

    SpreadsheetApp.flush();

    return jsonResponse({
      success: true,
      code: "ATTENDANCE_RECORDED",
      attendance_id: attId,
      registration_id: regId,
      event_id: eventId,
      name: name,
      email: email,
      status: "DONE",
      marked_by: markedBy,
      date: dateFormatted,
      time: timeFormatted
    });

  } catch (err) {
    return jsonResponse({
      success: false,
      code: "SERVER_ERROR",
      message: "Error recording attendance: " + err.toString()
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (e) {}
  }
}
