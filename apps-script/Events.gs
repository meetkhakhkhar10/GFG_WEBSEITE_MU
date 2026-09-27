/**
 * ============================================================================
 * Events.gs — Dynamic Events Repository (Live Google Sheets Source of Truth)
 * ============================================================================
 * 
 * Rules:
 *   - Google Sheets is the ONLY authoritative source of truth for events.
 *   - NO CacheService or static cache (always fetches fresh data from Sheets).
 *   - Dynamic header mapping (no fragile hardcoded column index assumptions).
 *   - Live event qualification: is_open = (Registration_Status == "OPEN" && Status == "PUBLISHED").
 *   - NO hardcoded event IDs (EVT-0001, EVT-0002, EVT-0003) and NO "|| OPEN" bias.
 */

/**
 * Builds a dynamic case-insensitive header mapping from row 1 of a sheet.
 * 
 * @param {Sheet} sheet
 * @return {Object} Map of columnName.toLowerCase() -> 0-indexed column index
 */
function buildHeaderMap_(sheet) {
  var map = {};
  var lastCol = sheet.getLastColumn();
  if (lastCol <= 0) return map;

  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  for (var i = 0; i < headers.length; i++) {
    var h = String(headers[i] || "").trim().toLowerCase();
    if (h) {
      map[h] = i;
      // Also register sanitized version without spaces/underscores
      var normalized = h.replace(/[\s_-]/g, "");
      map[normalized] = i;
    }
  }
  return map;
}

/**
 * Safely extracts a cell value using candidate column names.
 * 
 * @param {Array} row - 1D array of row cells
 * @param {Object} headerMap - Header mapping
 * @param {Array<string>} candidateKeys - Possible column name aliases
 * @return {*}
 */
function getRowValue_(row, headerMap, candidateKeys) {
  for (var i = 0; i < candidateKeys.length; i++) {
    var key = candidateKeys[i].toLowerCase().replace(/[\s_-]/g, "");
    if (headerMap[key] !== undefined) {
      var val = row[headerMap[key]];
      if (val !== undefined && val !== null && val !== "") {
        return val;
      }
    }
  }
  return "";
}

/**
 * Formats date values safely from Google Sheets without returning "Invalid Date".
 * 
 * @param {*} val
 * @return {string}
 */
function formatEventDate_(val) {
  if (val === undefined || val === null || val === "") {
    return "DECLARED SOON";
  }

  var s = String(val).trim();
  var upper = s.toUpperCase();
  if (upper.indexOf("DECLARED") !== -1 || upper.indexOf("ANNOUNCED") !== -1 || upper.indexOf("TBD") !== -1 || upper === "UPCOMING") {
    return "DECLARED SOON";
  }

  if (val instanceof Date && !isNaN(val.getTime())) {
    return Utilities.formatDate(val, APP_CONFIG.TIMEZONE, "yyyy-MM-dd");
  }

  if (s.indexOf("T") !== -1) {
    try {
      var d = new Date(s);
      if (!isNaN(d.getTime())) {
        return Utilities.formatDate(d, APP_CONFIG.TIMEZONE, "yyyy-MM-dd");
      }
    } catch (e) {}
  }

  return s;
}

/**
 * Formats time values safely from Google Sheets without returning 1899 timestamps.
 * 
 * @param {*} val
 * @return {string}
 */
function formatEventTime_(val) {
  if (val === undefined || val === null || val === "") {
    return "DECLARED SOON";
  }

  var s = String(val).trim();
  var upper = s.toUpperCase();
  if (upper.indexOf("DECLARED") !== -1 || upper.indexOf("TBD") !== -1) {
    return "DECLARED SOON";
  }

  if (val instanceof Date && !isNaN(val.getTime())) {
    return Utilities.formatDate(val, APP_CONFIG.TIMEZONE, "hh:mm a");
  }

  if (s.indexOf("1899-12-30") !== -1 || s.indexOf("1899-12-31") !== -1 || s.indexOf("T") !== -1) {
    try {
      var d = new Date(s);
      if (!isNaN(d.getTime())) {
        return Utilities.formatDate(d, APP_CONFIG.TIMEZONE, "hh:mm a");
      }
    } catch (e) {}
  }

  return s;
}

/**
 * GET ?action=events
 * 
 * Fetches all events from the Events sheet with live dynamic status evaluation.
 * 
 * @return {TextOutput} JSON response
 */
function getEventsList() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(APP_CONFIG.SHEETS.EVENTS);
    if (!sheet) {
      return jsonResponse({
        success: false,
        code: "SHEET_NOT_FOUND",
        error: "Events sheet does not exist in spreadsheet.",
        count: 0,
        events: []
      });
    }

    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return jsonResponse({
        success: true,
        count: 0,
        events: [],
        data: []
      });
    }

    var headerMap = buildHeaderMap_(sheet);
    var events = [];

    for (var r = 1; r < data.length; r++) {
      var row = data[r];

      var id = String(getRowValue_(row, headerMap, ["Event_ID", "event_id", "id", "ID"])).trim();
      if (!id) continue;

      var name = String(getRowValue_(row, headerMap, ["Event_Name", "event_name", "title", "Title", "Name"])).trim() || "Campus Event";
      var description = String(getRowValue_(row, headerMap, ["Description", "description", "desc", "Desc"])).trim();
      
      var rawDate = getRowValue_(row, headerMap, ["Date", "date", "Start_Date", "startDate"]);
      var dateVal = formatEventDate_(rawDate);

      var rawStartTime = getRowValue_(row, headerMap, ["Start_Time", "start_time", "Time", "time"]);
      var startTime = formatEventTime_(rawStartTime);

      var rawEndTime = getRowValue_(row, headerMap, ["End_Time", "end_time"]);
      var endTime = rawEndTime ? formatEventTime_(rawEndTime) : "";

      var rawVenue = String(getRowValue_(row, headerMap, ["Venue", "venue", "Location", "location"])).trim();
      var venue = rawVenue;
      if (!venue || venue.toUpperCase().indexOf("ANNOUNCED") !== -1 || venue.toUpperCase().indexOf("TBD") !== -1) {
        venue = "TO BE ANNOUNCED";
      }

      var deadline = String(getRowValue_(row, headerMap, ["Registration_Deadline", "registration_deadline", "Deadline", "deadline"])).trim() || "TO BE ANNOUNCED";
      var maxParticipants = Number(getRowValue_(row, headerMap, ["Max_Participants", "max_participants", "Capacity", "capacity"])) || 500;
      var regCount = Number(getRowValue_(row, headerMap, ["Registration_Count", "registration_count"])) || 0;

      // Registration_Status normalization
      var rawRegStatus = String(getRowValue_(row, headerMap, ["Registration_Status", "registration_status", "Reg_Status", "reg_status", "RegistrationStatus"])).trim().toUpperCase();
      var regStatus = (rawRegStatus === "OPEN" || rawRegStatus === "LIVE" || rawRegStatus === "ACTIVE") ? "OPEN" : "CLOSED";

      // Publication Status normalization
      var rawStatus = String(getRowValue_(row, headerMap, ["Status", "status", "Event_Status", "event_status"])).trim().toUpperCase();
      var status = (rawStatus === "PUBLISHED" || rawStatus === "ACTIVE" || rawStatus === "COMPLETED" || rawStatus === "CANCELLED" || rawStatus === "DRAFT")
        ? rawStatus
        : "PUBLISHED";

      var organizer = String(getRowValue_(row, headerMap, ["Organizer", "organizer", "Organizer_Name", "organizer_name"])).trim() || "GeeksforGeeks × Marwadi University";
      var contactEmail = String(getRowValue_(row, headerMap, ["Contact_Email", "contact_email", "Email", "email"])).trim() || "gfg@marwadiuniversity.ac.in";
      var contactPhone = String(getRowValue_(row, headerMap, ["Contact_Phone", "contact_phone", "Phone", "phone"])).trim();

      var createdAt = String(getRowValue_(row, headerMap, ["Created_At", "created_at"])).trim();
      var publishedAt = String(getRowValue_(row, headerMap, ["Published_At", "published_at"])).trim();
      var updatedAt = String(getRowValue_(row, headerMap, ["Updated_At", "updated_at"])).trim();

      // Poster / Banner image URL
      var posterUrl = String(getRowValue_(row, headerMap, ["Poster_URL", "poster_url", "Poster_Image", "poster_image", "Banner_Image", "banner_image"])).trim();
      if (!posterUrl) {
        posterUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800";
      }

      var regLink = String(getRowValue_(row, headerMap, ["Registration_Link", "registration_link", "Link", "link"])).trim();
      var category = String(getRowValue_(row, headerMap, ["Category", "category"])).trim() || "Hackathon / Workshop";

      // Live Event Qualification: Registration_Status == OPEN AND Status == PUBLISHED
      var isOpen = (regStatus === "OPEN" && (status === "PUBLISHED" || status === "ACTIVE"));

      events.push({
        id: id,
        title: name,
        description: description,
        date: dateVal,
        start_time: startTime,
        end_time: endTime,
        location: venue,
        venue: venue,
        poster_url: posterUrl,
        poster_image: posterUrl,
        registration_link: regLink,
        category: category,
        registration_deadline: deadline,
        max_participants: maxParticipants,
        capacity: maxParticipants,
        registration_status: regStatus,
        status: status,
        organizer: organizer,
        organizer_name: organizer,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        registration_count: regCount,
        created_at: createdAt,
        published_at: publishedAt,
        updated_at: updatedAt,
        is_open: isOpen,
        is_published: (status === "PUBLISHED" || status === "ACTIVE")
      });
    }

    return jsonResponse({
      success: true,
      count: events.length,
      events: events,
      data: events
    });

  } catch (err) {
    Logger.log("getEventsList error: " + err.toString());
    return jsonResponse({
      success: false,
      code: "FETCH_ERROR",
      error: "Error retrieving events: " + err.toString(),
      count: 0,
      events: []
    });
  }
}

/**
 * GET ?action=event&id=EVENT_ID
 * 
 * Fetches a single event by Event_ID.
 * 
 * @param {string} eventId
 * @return {TextOutput}
 */
function getSingleEvent(eventId) {
  if (!eventId) {
    return jsonResponse({
      success: false,
      code: "INVALID_ID",
      error: "event_id is required"
    });
  }

  var res = getEventsList();
  try {
    var parsed = JSON.parse(res.getContent());
    if (parsed.success && parsed.events) {
      var targetId = String(eventId).trim().toUpperCase();
      for (var i = 0; i < parsed.events.length; i++) {
        if (parsed.events[i].id.toUpperCase() === targetId) {
          return jsonResponse({
            success: true,
            event: parsed.events[i],
            data: parsed.events[i]
          });
        }
      }
    }
  } catch (e) {}

  return jsonResponse({
    success: false,
    code: "EVENT_NOT_FOUND",
    error: "Event not found for ID: " + eventId
  });
}
