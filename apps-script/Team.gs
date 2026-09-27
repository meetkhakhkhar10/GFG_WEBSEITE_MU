/**
 * ============================================================================
 * Team.gs — Chapter Core Team & Faculty Leads Directory
 * ============================================================================
 * 
 * Manages active team members, student coordinators, and technical mentors.
 */

/**
 * GET ?action=team
 * 
 * Fetches all active team members from the Team sheet.
 * 
 * @return {TextOutput}
 */
function getTeamList() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(APP_CONFIG.SHEETS.TEAM);
    if (!sheet) {
      return jsonResponse({
        success: false,
        code: "SHEET_NOT_FOUND",
        error: "Team sheet not found.",
        count: 0,
        team: []
      });
    }

    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return jsonResponse({
        success: true,
        count: 0,
        team: [],
        data: []
      });
    }

    var headerMap = buildHeaderMap_(sheet);
    var team = [];

    for (var r = 1; r < data.length; r++) {
      var row = data[r];
      var name = String(getRowValue_(row, headerMap, ["Name", "name", "Member_Name"])).trim();
      if (!name) continue;

      var id = String(getRowValue_(row, headerMap, ["Team_ID", "team_id", "Member_ID", "id"])).trim() || ("tm-" + r);
      var role = String(getRowValue_(row, headerMap, ["Role", "role", "Position", "position"])).trim() || "Core Team Member";
      var email = String(getRowValue_(row, headerMap, ["Email", "email"])).trim();
      var status = String(getRowValue_(row, headerMap, ["Status", "status"])).trim() || "Active";
      var photoUrl = String(getRowValue_(row, headerMap, ["Photo_URL", "photo_url", "Photo", "photo", "Image", "image"])).trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400";
      var department = String(getRowValue_(row, headerMap, ["Department", "department"])).trim() || "Computer Engineering";
      var linkedin = String(getRowValue_(row, headerMap, ["Linkedin_URL", "linkedin_url", "linkedin"])).trim();
      var github = String(getRowValue_(row, headerMap, ["Github_URL", "github_url", "github"])).trim();

      var isActive = status.toLowerCase() !== "inactive" && status.toLowerCase() !== "disabled";

      if (isActive) {
        team.push({
          id: id,
          name: name,
          role: role,
          position: role,
          department: department,
          email: email,
          status: status,
          photo_url: photoUrl,
          profilePhoto: photoUrl,
          linkedin_url: linkedin,
          github_url: github,
          active: true
        });
      }
    }

    return jsonResponse({
      success: true,
      count: team.length,
      team: team,
      data: team
    });

  } catch (err) {
    Logger.log("getTeamList error: " + err.toString());
    return jsonResponse({
      success: false,
      code: "FETCH_ERROR",
      error: "Error retrieving team members: " + err.toString(),
      count: 0,
      team: []
    });
  }
}
