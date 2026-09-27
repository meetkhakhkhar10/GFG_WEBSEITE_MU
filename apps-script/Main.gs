/**
 * ============================================================================
 * Main.gs — Unified Web App Entry Point (Router & Request Handler)
 * ============================================================================
 * 
 * Contains exactly ONE doGet(e) and ONE doPost(e).
 * Parses incoming requests and dispatches them to appropriate module handlers.
 */

/**
 * Main Web App GET Entry Point
 * 
 * @param {Object} e - HTTP GET event object
 * @return {TextOutput}
 */
function doGet(e) {
  return handleRequest(e, "GET");
}

/**
 * Main Web App POST Entry Point
 * 
 * @param {Object} e - HTTP POST event object
 * @return {TextOutput}
 */
function doPost(e) {
  return handleRequest(e, "POST");
}

/**
 * Unified request dispatcher for both GET and POST requests.
 * 
 * @param {Object} e - Apps Script event object
 * @param {string} method - "GET" or "POST"
 * @return {TextOutput}
 */
function handleRequest(e, method) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var data = {};

    // Parse JSON body or form parameters for POST
    if (method === "POST") {
      if (e && e.postData && e.postData.contents) {
        try {
          data = JSON.parse(e.postData.contents);
        } catch (jsonErr) {
          data = e.parameter || {};
        }
      } else if (e && e.parameter) {
        data = e.parameter;
      }
    } else {
      data = params;
    }

    // Determine and normalize action
    var rawAction = data.action || params.action || "";
    var action = String(rawAction).toLowerCase().trim();

    // ========================================================================
    // 1. HEALTH CHECK / ROOT
    // ========================================================================
    if (!action || action === "health" || action === "status" || action === "ping") {
      return healthCheck();
    }

    // ========================================================================
    // 2. CERTIFICATE & SCANNER ACTIONS (POST)
    // ========================================================================
    if (action === "certificate_data_entry") {
      return handleCertificateDataEntry(data);
    }
    if (action === "scanner_login") {
      return handleCertificateScannerLogin(data);
    }
    if (action === "certificate_qr_scan") {
      return handleCertificateQrScan(data);
    }

    // ========================================================================
    // 3. EVENTS MODULE ACTIONS
    // ========================================================================
    if (action === "events") {
      return getEventsList();
    }
    if (action === "event") {
      var eventId = data.id || data.event_id || params.id || params.event_id || "";
      return getSingleEvent(eventId);
    }

    // ========================================================================
    // 4. REGISTRATIONS & ATTENDANCE ACTIONS
    // ========================================================================
    if (action === "register") {
      return registerEvent(data);
    }
    if (action === "registration") {
      var regId = data.id || data.registration_id || params.id || params.registration_id || "";
      return getRegistrationById(regId);
    }
    if (action === "attendance" || action === "markattendance") {
      return handleNormalAttendance(data);
    }

    // ========================================================================
    // 5. BOOKINGS MODULE ACTIONS
    // ========================================================================
    if (action === "booking" || action === "book") {
      return handleFacilityBooking(data);
    }

    // ========================================================================
    // 6. TEAM, ANNOUNCEMENTS, RESOURCES, STATS MODULE ACTIONS
    // ========================================================================
    if (action === "team") {
      return getTeamList();
    }
    if (action === "announcements") {
      return getAnnouncementsList();
    }
    if (action === "announcement") {
      return handleNewAnnouncement(data);
    }
    if (action === "resources") {
      return getResourcesList();
    }
    if (action === "stats") {
      return getPortalStats();
    }

    // Unrecognized action fallback
    return jsonResponse({
      success: false,
      code: "UNKNOWN_ACTION",
      error: "Unrecognized action: " + rawAction,
      supported_actions: [
        "health", "events", "event", "register", "registration",
        "attendance", "certificate_data_entry", "scanner_login",
        "certificate_qr_scan", "booking", "team", "announcements",
        "announcement", "resources", "stats"
      ]
    });

  } catch (err) {
    Logger.log("Main handler fatal error: " + err.toString());
    return jsonResponse({
      success: false,
      code: "INTERNAL_ERROR",
      error: "Server processing error: " + err.toString()
    });
  }
}

/**
 * Health check endpoint to verify backend API deployment and Spreadsheet connectivity.
 * 
 * @return {TextOutput}
 */
function healthCheck() {
  var isConnected = false;
  var spreadsheetName = "";
  var errorMsg = null;

  try {
    var ss = getSpreadsheet();
    if (ss) {
      isConnected = true;
      spreadsheetName = ss.getName();
    }
  } catch (e) {
    isConnected = false;
    errorMsg = e.toString();
  }

  return jsonResponse({
    success: true,
    service: "GFG × Marwadi University API",
    status: "ACTIVE",
    spreadsheet_connected: isConnected,
    spreadsheet_name: spreadsheetName,
    error: errorMsg,
    timestamp: Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss"),
    version: "2.0.0"
  });
}
