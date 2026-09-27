/**
 * ============================================================================
 * Resources.gs — Technical Learning Materials & Development Toolkits
 * ============================================================================
 * 
 * Manages open-source roadmaps, course links, competitive programming cheat-sheets.
 */

/**
 * GET ?action=resources
 * 
 * Fetches all available learning resources.
 * 
 * @return {TextOutput}
 */
function getResourcesList() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(APP_CONFIG.SHEETS.RESOURCES);
    if (!sheet) {
      return jsonResponse({
        success: false,
        code: "SHEET_NOT_FOUND",
        error: "Resources sheet not found.",
        count: 0,
        resources: []
      });
    }

    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return jsonResponse({
        success: true,
        count: 0,
        resources: [],
        data: []
      });
    }

    var headerMap = buildHeaderMap_(sheet);
    var resources = [];

    for (var r = 1; r < data.length; r++) {
      var row = data[r];
      var title = String(getRowValue_(row, headerMap, ["Title", "title"])).trim();
      if (!title) continue;

      var id = String(getRowValue_(row, headerMap, ["Resource_ID", "resource_id", "id"])).trim() || ("res-" + r);
      var description = String(getRowValue_(row, headerMap, ["Description", "description", "desc"])).trim();
      var category = String(getRowValue_(row, headerMap, ["Category", "category"])).trim() || "Guide";
      var url = String(getRowValue_(row, headerMap, ["URL", "url", "Link", "link"])).trim();
      var status = String(getRowValue_(row, headerMap, ["Status", "status"])).trim() || "ACTIVE";

      if (status.toUpperCase() !== "ARCHIVED" && status.toUpperCase() !== "DRAFT") {
        resources.push({
          id: id,
          title: title,
          description: description,
          category: category,
          url: url,
          status: status
        });
      }
    }

    return jsonResponse({
      success: true,
      count: resources.length,
      resources: resources,
      data: resources
    });

  } catch (err) {
    Logger.log("getResourcesList error: " + err.toString());
    return jsonResponse({
      success: false,
      code: "FETCH_ERROR",
      error: "Error retrieving resources: " + err.toString(),
      count: 0,
      resources: []
    });
  }
}
