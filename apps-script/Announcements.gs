/**
 * ============================================================================
 * Announcements.gs — Campus Bulletins & Notification Broadcasts
 * ============================================================================
 * 
 * Manages official chapter updates, hackathon notices, and campus bulletins.
 */

/**
 * GET ?action=announcements
 * 
 * Fetches all published announcements.
 * 
 * @return {TextOutput}
 */
function getAnnouncementsList() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(APP_CONFIG.SHEETS.ANNOUNCEMENTS);
    if (!sheet) {
      return jsonResponse({
        success: false,
        code: "SHEET_NOT_FOUND",
        error: "Announcements sheet not found.",
        count: 0,
        announcements: []
      });
    }

    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return jsonResponse({
        success: true,
        count: 0,
        announcements: [],
        data: []
      });
    }

    var headerMap = buildHeaderMap_(sheet);
    var announcements = [];

    for (var r = 1; r < data.length; r++) {
      var row = data[r];
      var title = String(getRowValue_(row, headerMap, ["Title", "title"])).trim();
      if (!title) continue;

      var id = String(getRowValue_(row, headerMap, ["Announcement_ID", "announcement_id", "id"])).trim() || ("ann-" + r);
      var message = String(getRowValue_(row, headerMap, ["Message", "message", "Content", "content", "desc"])).trim();
      var category = String(getRowValue_(row, headerMap, ["Category", "category"])).trim() || "Notice";
      var status = String(getRowValue_(row, headerMap, ["Status", "status"])).trim() || "PUBLISHED";
      var publishedAt = String(getRowValue_(row, headerMap, ["Published_At", "published_at", "Date", "date"])).trim();
      var priority = String(getRowValue_(row, headerMap, ["Priority", "priority"])).trim() || "NORMAL";

      if (status.toUpperCase() !== "ARCHIVED" && status.toUpperCase() !== "DRAFT") {
        announcements.push({
          id: id,
          title: title,
          message: message,
          content: message,
          category: category,
          status: status,
          priority: priority,
          publish_date: publishedAt,
          published_at: publishedAt
        });
      }
    }

    return jsonResponse({
      success: true,
      count: announcements.length,
      announcements: announcements,
      data: announcements
    });

  } catch (err) {
    Logger.log("getAnnouncementsList error: " + err.toString());
    return jsonResponse({
      success: false,
      code: "FETCH_ERROR",
      error: "Error retrieving announcements: " + err.toString(),
      count: 0,
      announcements: []
    });
  }
}

/**
 * POST ?action=announcement
 * 
 * Publishes a new announcement to the chapter feed.
 * 
 * @param {Object} data
 * @return {TextOutput}
 */
function handleNewAnnouncement(data) {
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

    var title = (data.title || data.Title || "").toString().trim();
    var message = (data.message || data.Message || data.content || "").toString().trim();
    var category = (data.category || data.Category || "Notice").toString().trim();

    if (!title || !message) {
      return jsonResponse({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Title and message are required."
      });
    }

    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(APP_CONFIG.SHEETS.ANNOUNCEMENTS);
    if (!sheet) {
      return jsonResponse({
        success: false,
        code: "SHEET_NOT_FOUND",
        message: "Announcements sheet not found."
      });
    }

    var timestamp = new Date().getTime();
    var id = "ANN-" + timestamp;
    var nowStr = Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");

    // Standard columns for Announcements sheet:
    // Announcement_ID, Title, Message, Category, Status, Published_At, Created_At, Updated_At
    var newRow = [
      id,
      title,
      message,
      category,
      "PUBLISHED",
      nowStr,
      nowStr,
      nowStr
    ];

    sheet.appendRow(newRow);

    logActivity("NEW_ANNOUNCEMENT", "Admin", "", "", "Published: " + title, "SUCCESS");

    SpreadsheetApp.flush();

    return jsonResponse({
      success: true,
      code: "ANNOUNCEMENT_PUBLISHED",
      message: "Announcement published successfully.",
      id: id,
      title: title
    });

  } catch (err) {
    Logger.log("handleNewAnnouncement error: " + err.toString());
    return jsonResponse({
      success: false,
      code: "SERVER_ERROR",
      message: "Error publishing announcement: " + err.toString()
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (e) {}
  }
}
