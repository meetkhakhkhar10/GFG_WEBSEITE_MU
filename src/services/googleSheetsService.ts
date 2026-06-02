import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/spreadsheets");

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize Auth State
export const initSheetsAuth = (
  onAuthSuccess: (user: User, token: string) => void,
  onAuthFailure: () => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (cachedAccessToken) {
        onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      onAuthFailure();
    }
  });
};

// Google Sign In Popup
export const signInWithGoogleSheets = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to retrieve Google Sheets OAuth access token from login.");
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error("Google Sheets OAuth sign in error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Google Sign Out
export const logoutGoogleSheets = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Create a new Google Spreadsheet
export const createSpreadsheet = async (accessToken: string, title: string): Promise<string> => {
  const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        title: title || "GFG MU Chapter Database",
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Failed to create spreadsheet.");
  }

  const data = await response.json();
  return data.spreadsheetId;
};

// Create sheet tabs inside spreadsheet if they don't exist
export const ensureSheetTab = async (accessToken: string, spreadsheetId: string, tabTitle: string): Promise<void> => {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title: tabTitle,
              },
            },
          },
        ],
      }),
    });
    // Ignore error if sheet tab already exists
    if (!response.ok) {
      console.warn(`Note: Tab '${tabTitle}' might already exist. Standard response received.`);
    }
  } catch (err) {
    console.warn(`Could not verify or add tab: ${tabTitle}`, err);
  }
};

// Write student data to sheet
export const syncStudentsToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  students: any[]
): Promise<void> => {
  const tabName = "Students Roster";
  await ensureSheetTab(accessToken, spreadsheetId, tabName);

  const header = [["Student Name", "Email", "Enrollment / Password", "Department", "Year", "Status / Role", "Points"]];
  const rows = students.map((s) => [
    s.name || "",
    s.email || "",
    s.roll || s.enrollment_no || "",
    s.batch || s.department || "",
    s.year || "N/A",
    s.status || s.role || "",
    s.points ?? 0,
  ]);

  const allData = [...header, ...rows];
  const range = `${tabName}!A1:G${allData.length + 5}`;

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: allData,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed syncing student directory to sheet.");
  }
};

// Write attendance logs to sheet
export const syncAttendanceToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  attendanceLogs: any[]
): Promise<void> => {
  const tabName = "Attendance Logs";
  await ensureSheetTab(accessToken, spreadsheetId, tabName);

  const header = [["Student Name", "Enrollment Number", "Event Title", "Checked-In At"]];
  const rows = attendanceLogs.map((log) => [
    log.student_name || "N/A",
    log.enrollment || "N/A",
    log.event_title || "General",
    log.marked_at ? new Date(log.marked_at).toLocaleString() : "N/A",
  ]);

  const allData = [...header, ...rows];
  const range = `${tabName}!A1:D${allData.length + 5}`;

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: allData,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed syncing attendance log to sheet.");
  }
};

// Append raw contact message submissions
export const appendContactSubmissionToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  submission: { name: string; email: string; message: string; timestamp: string }
): Promise<void> => {
  const tabName = "Contact Messages";
  await ensureSheetTab(accessToken, spreadsheetId, tabName);

  // Check headers
  let hasHeaders = false;
  try {
    const checkResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(tabName + "!A1:D1")}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (checkResponse.ok) {
      const data = await checkResponse.json();
      if (data.values && data.values.length > 0 && data.values[0].length > 0) {
        hasHeaders = true;
      }
    }
  } catch (err) {
    console.warn("Unable to check sheet headers. Appending anyway.", err);
  }

  // If no headers exist, write them
  if (!hasHeaders) {
    try {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(tabName + "!A1:D1")}?valueInputOption=RAW`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            values: [["Full Name", "Email Address", "Transmission Message", "Timestamp"]],
          }),
        }
      );
    } catch (err) {
      console.warn("Could not write sheet headers:", err);
    }
  }

  // Append new row
  const appendRange = `${tabName}!A:D`;
  const appendResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(appendRange)}:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        range: appendRange,
        majorDimension: "ROWS",
        values: [[submission.name, submission.email, submission.message, submission.timestamp]],
      }),
    }
  );

  if (!appendResponse.ok) {
    const errData = await appendResponse.json().catch(() => ({}));
    throw new Error(errData.error?.message || "Failed to append submission to Google Sheet.");
  }
};

