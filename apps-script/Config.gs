/**
 * ============================================================================
 * Config.gs — Central Configuration for GFG × Marwadi University Apps Script
 * ============================================================================
 * 
 * Single source of configuration for the unified Google Apps Script Web App.
 * All modules reference APP_CONFIG and its helper utilities.
 */

var APP_CONFIG = {
  // SPREADSHEET CONFIGURATION
  // Replace with your Google Spreadsheet ID (from the sheet URL: https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit)
  SPREADSHEET_ID: "PASTE_YOUR_SPREADSHEET_ID_HERE",

  // TIMEZONE
  TIMEZONE: "Asia/Kolkata",

  // LOCK TIMEOUT (ms) to prevent race conditions during write operations
  LOCK_TIMEOUT_MS: 30000,

  // SESSION DURATION (30 minutes) for coordinator QR scanner sessions
  SESSION_LIFETIME_MS: 30 * 60 * 1000,

  // EXACT SHEET NAMES (Do not alter)
  SHEETS: {
    EVENTS: "Events",
    REGISTRATIONS: "Registrations",
    ATTENDANCE: "Attendance",
    BOOKINGS: "Bookings",
    TEAM: "Team",
    ANNOUNCEMENTS: "Announcements",
    RESOURCES: "Resources",
    STATS: "Stats",
    LOGS: "Logs"
  },

  // AUTHORIZED SCANNER ACCOUNTS (Server-Authoritative Identities)
  SCANNER_ACCOUNTS: {
    "meet123": {
      password: "meet",
      identity: "Meet Khakhkhar"
    },
    "vyshnavi": {
      password: "vyshnavi123",
      identity: "Vyshnavi"
    }
  }
};

/**
 * Connects to the configured Google Spreadsheet.
 * Uses SpreadsheetApp.openById(APP_CONFIG.SPREADSHEET_ID) primarily,
 * falling back to getActiveSpreadsheet() if SPREADSHEET_ID has not been modified.
 * 
 * @return {Spreadsheet}
 */
function getSpreadsheet() {
  if (APP_CONFIG.SPREADSHEET_ID && APP_CONFIG.SPREADSHEET_ID !== "PASTE_YOUR_SPREADSHEET_ID_HERE") {
    try {
      return SpreadsheetApp.openById(APP_CONFIG.SPREADSHEET_ID);
    } catch (e) {
      Logger.log("Error opening spreadsheet by ID (" + APP_CONFIG.SPREADSHEET_ID + "): " + e.toString());
      throw new Error("Unable to open Spreadsheet with ID: " + APP_CONFIG.SPREADSHEET_ID + ". Check permissions and ID.");
    }
  }
  
  var active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) {
    return active;
  }
  
  throw new Error("Spreadsheet ID is not configured in Config.gs and no active spreadsheet is bound.");
}

/**
 * Standard JSON Response formatter for Apps Script Web App.
 * 
 * @param {Object} obj - JSON payload to return
 * @return {TextOutput}
 */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Activity logger that safely appends audit records to the Logs sheet.
 * 
 * @param {string} action
 * @param {string} user
 * @param {string} email
 * @param {string} eventId
 * @param {string} details
 * @param {string} status
 */
function logActivity(action, user, email, eventId, details, status) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(APP_CONFIG.SHEETS.LOGS);
    if (!sheet) return;

    var logId = "LOG-" + new Date().getTime() + "-" + Math.floor(100 + Math.random() * 900);
    var timestamp = Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");

    sheet.appendRow([
      logId,
      action || "",
      user || "",
      email || "",
      eventId || "",
      details || "",
      timestamp,
      status || "OK"
    ]);
  } catch (e) {
    Logger.log("Activity log error: " + e.toString());
  }
}
