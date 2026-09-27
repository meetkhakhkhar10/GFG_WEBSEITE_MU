/**
 * ============================================================================
 * Bookings.gs — Campus Facility & Mentorship Session Bookings Engine
 * ============================================================================
 * 
 * Manages laboratory reservations, mentorship slots, and campus room bookings.
 */

/**
 * POST ?action=booking
 * 
 * Submits a new booking request for campus facilities or mentor sessions.
 * 
 * @param {Object} data
 * @return {TextOutput}
 */
function handleFacilityBooking(data) {
  var lock = LockService.getScriptLock();
  try {
    var hasLock = lock.tryLock(APP_CONFIG.LOCK_TIMEOUT_MS);
    if (!hasLock) {
      return jsonResponse({
        success: false,
        code: "SERVER_BUSY",
        message: "Server is busy. Please try submitting again."
      });
    }

    var service = (data.service || data.facility || data.service_name || "Campus Facility").toString().trim();
    var mentor = (data.mentor || data.mentor_name || "Lead Coordinator").toString().trim();
    var name = (data.name || data.Name || "").toString().trim();
    var email = (data.email || data.Email || "").toString().trim();
    var phone = (data.phone || data.Phone || "").toString().trim();
    var date = (data.date || data.Date || "").toString().trim();
    var timeSlot = (data.time_slot || data.slot || data.time || "").toString().trim();
    var notes = (data.notes || data.message || "").toString().trim();

    if (!name || !email) {
      return jsonResponse({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Name and email are required for booking."
      });
    }

    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(APP_CONFIG.SHEETS.BOOKINGS);
    if (!sheet) {
      return jsonResponse({
        success: false,
        code: "SHEET_NOT_FOUND",
        message: "Bookings sheet not found in database."
      });
    }

    var timestamp = new Date().getTime();
    var bookingId = "BKG-" + timestamp + "-" + Math.floor(100 + Math.random() * 900);
    var nowStr = Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");

    // Standard columns for Bookings sheet:
    // Booking_ID, Service, Mentor, Name, Email, Phone, Date, Time_Slot, Status, Notes, Created_At, Updated_At
    var newRow = [
      bookingId,
      service,
      mentor,
      name,
      email,
      phone,
      date,
      timeSlot,
      "PENDING",
      notes,
      nowStr,
      nowStr
    ];

    sheet.appendRow(newRow);

    logActivity("FACILITY_BOOKING", name, email, "", "Booking ID: " + bookingId + " for " + service, "SUCCESS");

    SpreadsheetApp.flush();

    return jsonResponse({
      success: true,
      code: "BOOKING_CREATED",
      message: "Booking request submitted successfully.",
      booking_id: bookingId,
      service: service,
      name: name,
      email: email,
      status: "PENDING"
    });

  } catch (err) {
    Logger.log("handleFacilityBooking error: " + err.toString());
    return jsonResponse({
      success: false,
      code: "SERVER_ERROR",
      message: "Error processing booking: " + err.toString()
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (e) {}
  }
}
