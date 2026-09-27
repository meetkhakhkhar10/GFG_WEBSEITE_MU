/**
 * ============================================================================
 * Stats.gs — Chapter Dashboard Metrics & Aggregation Engine
 * ============================================================================
 * 
 * Aggregates live statistical counters directly from database sheets.
 */

/**
 * GET ?action=stats
 * 
 * Computes live counters across Events, Registrations, Attendance, and Team sheets.
 * 
 * @return {TextOutput}
 */
function getPortalStats() {
  try {
    var ss = getSpreadsheet();

    // 1. Events Counts
    var totalEvents = 0;
    var publishedEvents = 0;
    try {
      var eventsSheet = ss.getSheetByName(APP_CONFIG.SHEETS.EVENTS);
      if (eventsSheet && eventsSheet.getLastRow() > 1) {
        var eHeaderMap = buildHeaderMap_(eventsSheet);
        var eRows = eventsSheet.getDataRange().getValues();
        totalEvents = eRows.length - 1;
        for (var er = 1; er < eRows.length; er++) {
          var status = String(getRowValue_(eRows[er], eHeaderMap, ["Status", "status"])).trim().toUpperCase();
          if (status === "PUBLISHED" || status === "ACTIVE") {
            publishedEvents++;
          }
        }
      }
    } catch (e) {}

    // 2. Registrations Counts
    var totalRegistrations = 0;
    var confirmedRegistrations = 0;
    try {
      var regSheet = ss.getSheetByName(APP_CONFIG.SHEETS.REGISTRATIONS);
      if (regSheet && regSheet.getLastRow() > 1) {
        var rRows = regSheet.getDataRange().getValues();
        totalRegistrations = rRows.length - 1;
        var rHeaderMap = buildHeaderMap_(regSheet);
        for (var rr = 1; rr < rRows.length; rr++) {
          var rStatus = String(getRowValue_(rRows[rr], rHeaderMap, ["Status", "status"])).trim().toUpperCase();
          if (rStatus === "CONFIRMED" || rStatus === "DONE" || !rStatus) {
            confirmedRegistrations++;
          }
        }
      }
    } catch (e) {}

    // 3. Attendance Counts
    var totalAttendance = 0;
    try {
      var attSheet = ss.getSheetByName(APP_CONFIG.SHEETS.ATTENDANCE);
      if (attSheet && attSheet.getLastRow() > 1) {
        totalAttendance = attSheet.getLastRow() - 1;
      }
    } catch (e) {}

    // 4. Team Counts
    var activeTeamMembers = 0;
    try {
      var teamSheet = ss.getSheetByName(APP_CONFIG.SHEETS.TEAM);
      if (teamSheet && teamSheet.getLastRow() > 1) {
        activeTeamMembers = teamSheet.getLastRow() - 1;
      }
    } catch (e) {}

    var stats = {
      total_events: totalEvents,
      published_events: publishedEvents,
      total_registrations: totalRegistrations,
      confirmed_registrations: confirmedRegistrations,
      total_attendance: totalAttendance,
      active_team_members: activeTeamMembers
    };

    // Also update Stats sheet for audit tracking
    try {
      var statsSheet = ss.getSheetByName(APP_CONFIG.SHEETS.STATS);
      if (statsSheet) {
        var nowStr = Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");
        var statsData = [
          ["total_events", totalEvents, nowStr],
          ["published_events", publishedEvents, nowStr],
          ["total_registrations", totalRegistrations, nowStr],
          ["total_attendance", totalAttendance, nowStr],
          ["active_team_members", activeTeamMembers, nowStr]
        ];
        statsSheet.getRange(2, 1, statsData.length, 3).setValues(statsData);
      }
    } catch (sErr) {}

    return jsonResponse({
      success: true,
      stats: stats,
      data: stats
    });

  } catch (err) {
    Logger.log("getPortalStats error: " + err.toString());
    return jsonResponse({
      success: false,
      code: "STATS_ERROR",
      error: "Error calculating portal stats: " + err.toString(),
      stats: {
        total_events: 0,
        published_events: 0,
        total_registrations: 0,
        confirmed_registrations: 0,
        total_attendance: 0,
        active_team_members: 0
      }
    });
  }
}
