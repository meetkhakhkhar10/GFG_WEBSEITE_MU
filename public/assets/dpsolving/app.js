
"use strict";

const $ = (id) => document.getElementById(id);

const state = {
  token: localStorage.getItem("gfgmu_token"),
  user: null,
  quiz: null,
  current: 0,
  selected: null,
  timerInterval: null,
  deadline: null,
  answers: [],
  adminTab: "create",
  sending: false
};

// =====================================================
// API HANDLER
// =====================================================

async function api(action, payload = {}) {
  let response;

  try {
    response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action,
        token: state.token,
        ...payload
      })
    });
  } catch (error) {
    console.error("Network error:", error);
    throw new Error(
      "Cannot reach Node.js server. Make sure npm start is running."
    );
  }

  const responseText = await response.text();

  let data;

  try {
    data = JSON.parse(responseText);
  } catch (error) {
    console.error("Invalid backend response:", responseText);

    throw new Error(
      `Backend returned invalid JSON. HTTP ${response.status}. Check server.js.`
    );
  }

  if (!response.ok || !data.ok) {
    console.error("Backend API error:", data);

    throw new Error(
      data.error || `Backend request failed. HTTP ${response.status}.`
    );
  }

  return data;
}

// =====================================================
// COMMON UI FUNCTIONS
// =====================================================

function showToast(message) {
  $("toast").textContent = message;
  $("toast").classList.remove("hidden");

  setTimeout(() => {
    $("toast").classList.add("hidden");
  }, 3200);
}

function message(id, text, success = false) {
  const el = $(id);

  el.textContent = text;
  el.className = "message" + (success ? " success" : "");
  el.classList.remove("hidden");
}

function hideMessage(id) {
  $(id).classList.add("hidden");
}

function showView(name) {
  [
    "authView",
    "studentView",
    "quizView",
    "resultView",
    "adminView"
  ].forEach(id => {
    $(id).classList.toggle("hidden", id !== name);
  });
}

function fmtDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);
}

// =====================================================
// BACKEND CONNECTION CHECK
// =====================================================

async function checkConnection() {
  const connection = $("connection");

  connection.innerHTML = '<i></i> Connecting...';

  try {
    const data = await api("ping");

    console.log("Backend ping successful:", data);

    connection.innerHTML = '<i></i> Connected';

    connection.title = "Backend connection successful.";

    return true;

  } catch (error) {
    console.error("Backend connection failed:", error);

    connection.innerHTML =
      '<i style="background:#dc8a40"></i> Connection failed';

    connection.title = error.message;

    showToast("Backend Error: " + error.message);

    return false;
  }
}

// =====================================================
// AUTHENTICATION TABS
// =====================================================

function setupAuthTabs() {
  document.querySelectorAll(".auth-tab").forEach(btn => {

    btn.addEventListener("click", () => {

      document.querySelectorAll(".auth-tab").forEach(b => {
        b.classList.toggle("active", b === btn);
      });

      $("loginForm").classList.toggle(
        "hidden",
        btn.dataset.tab !== "login"
      );

      $("registerForm").classList.toggle(
        "hidden",
        btn.dataset.tab !== "register"
      );

      hideMessage("authMessage");
    });

  });
}

// =====================================================
// STUDENT LOGIN
// =====================================================

$("loginBtn").addEventListener("click", async () => {

  hideMessage("authMessage");

  $("loginBtn").disabled = true;

  try {

    const d = await api("login", {
      username: $("loginId").value.trim(),
      password: $("loginPassword").value
    });

    state.token = d.token;
    state.user = d.user;

    localStorage.setItem("gfgmu_token", d.token);

    await enterApp();

  } catch (error) {

    message("authMessage", error.message);

  } finally {

    $("loginBtn").disabled = false;

  }

});

// =====================================================
// REGISTRATION WITH EMAIL OTP
// =====================================================

let otpResendTimer = null;
let otpResendAt = 0;

function registrationPayload() {

  return {
    name: $("regName").value.trim(),
    email: $("regEmail").value.trim(),
    studentId: $("regId").value.trim(),
    password: $("regPassword").value
  };

}

function startOtpCooldown(seconds) {

  clearInterval(otpResendTimer);

  otpResendAt = Date.now() + seconds * 1000;

  $("resendOtpBtn").disabled = true;

  const tick = () => {

    const left = Math.max(
      0,
      Math.ceil((otpResendAt - Date.now()) / 1000)
    );

    $("resendOtpBtn").textContent = left
      ? `Resend code in ${left}s`
      : "Resend verification code";

    $("resendOtpBtn").disabled = left > 0;

    if (!left) {
      clearInterval(otpResendTimer);
    }

  };

  tick();

  otpResendTimer = setInterval(tick, 250);

}

async function registrationApi(action, payload) {

  const response = await fetch("/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action,
      ...payload
    })
  });

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Invalid server response during registration. HTTP ${response.status}.`
    );
  }

  if (!response.ok || !data.ok) {
    throw new Error(
      data.error || "Registration request failed."
    );
  }

  return data;

}

// REQUEST OTP

$("registerBtn").addEventListener("click", async () => {

  hideMessage("authMessage");

  const payload = registrationPayload();

  if (
    !payload.name ||
    !payload.email ||
    !payload.studentId ||
    payload.password.length < 8
  ) {
    message(
      "authMessage",
      "Complete all fields. Password must contain at least 8 characters."
    );

    return;
  }

  $("registerBtn").disabled = true;

  try {

    const d = await registrationApi(
      "requestRegistrationOtp",
      payload
    );

    $("otpStage").classList.remove("hidden");

    $("registerBtn").textContent = "OTP sent ✓";

    $("registerBtn").disabled = true;

    [
      "regName",
      "regEmail",
      "regId",
      "regPassword"
    ].forEach(id => {
      $(id).readOnly = true;
    });

    startOtpCooldown(d.resendAfter || 60);

    message(
      "authMessage",
      d.message || "OTP sent to your email.",
      true
    );

    $("regOtp").focus();

  } catch (error) {

    message("authMessage", error.message);

    $("registerBtn").disabled = false;

  }

});

// VERIFY OTP

$("verifyOtpBtn").addEventListener("click", async () => {

  hideMessage("authMessage");

  const payload = registrationPayload();

  payload.otp = $("regOtp").value.trim();

  if (!/^\d{6}$/.test(payload.otp)) {
    message("authMessage", "Enter the valid 6-digit OTP.");
    return;
  }

  $("verifyOtpBtn").disabled = true;

  try {

    const d = await registrationApi(
      "verifyRegistrationOtp",
      payload
    );

    message(
      "authMessage",
      d.message || "Email verified. Await admin approval.",
      true
    );

    $("otpStage").classList.add("hidden");

    $("registerBtn").textContent = "Registration complete ✓";

    $("regOtp").value = "";

    clearInterval(otpResendTimer);

  } catch (error) {

    message("authMessage", error.message);

  } finally {

    $("verifyOtpBtn").disabled = false;

  }

});

// RESEND OTP

$("resendOtpBtn").addEventListener("click", async () => {

  $("resendOtpBtn").disabled = true;

  hideMessage("authMessage");

  try {

    const payload = registrationPayload();

    const d = await registrationApi(
      "requestRegistrationOtp",
      payload
    );

    startOtpCooldown(d.resendAfter || 60);

    message(
      "authMessage",
      "A new OTP has been sent.",
      true
    );

  } catch (error) {

    message("authMessage", error.message);

    startOtpCooldown(60);

  }

});

// =====================================================
// LOGOUT
// =====================================================

$("logoutBtn").addEventListener("click", async () => {

  try {
    await api("logout");
  } catch (error) {
    console.warn("Logout API error:", error);
  }

  localStorage.removeItem("gfgmu_token");

  state.token = null;
  state.user = null;
  state.quiz = null;

  clearInterval(state.timerInterval);

  showView("authView");

  $("logoutBtn").classList.add("hidden");

});

// =====================================================
// ENTER APPLICATION
// =====================================================

async function enterApp() {

  $("logoutBtn").classList.remove("hidden");

  if (state.user.role === "admin") {

    showView("adminView");

    await loadAdmin();

  } else {

    showView("studentView");

    await loadDashboard();

  }

}

// =====================================================
// APPLICATION INITIALIZATION
// =====================================================

async function boot() {

  setupAuthTabs();

  $("todayLabel").textContent = fmtDate(new Date());

  await checkConnection();

  if (state.token) {

    try {

      const d = await api("me");

      state.user = d.user;

      await enterApp();

    } catch (error) {

      console.error("Session restoration failed:", error);

      localStorage.removeItem("gfgmu_token");

      state.token = null;
      state.user = null;

      showView("authView");

    }

  }

}

// =====================================================
// STUDENT DASHBOARD
// =====================================================

async function loadDashboard() {

  const d = await api("dashboard");

  state.user = d.user;

  $("studentName").textContent =
    d.user.name.split(" ")[0];

  $("myXp").textContent = d.user.xp || 0;

  $("myRank").textContent =
    d.rank ? "#" + d.rank : "—";

  $("myAttempts").textContent =
    d.user.attempts || 0;

  $("myAccuracy").textContent =
    (d.user.accuracy || 0) + "%";

  $("dailyTitle").textContent =
    d.quiz?.title || "No quiz published yet";

  $("dailyDescription").textContent =
    d.quiz?.description ||
    "Check back when today's challenge is published.";

  $("questionCount").textContent =
    d.quiz?.questionCount || 0;

  $("quizStatus").textContent =
    d.quiz?.attempted
      ? "You have already completed today's quiz."
      : (
          d.quiz?.questionCount
            ? "Your attempt will be recorded automatically."
            : ""
        );

  $("startQuizBtn").textContent =
    d.quiz?.attempted
      ? "Already completed ✓"
      : "Start today's quiz →";

  $("startQuizBtn").disabled =
    !d.quiz ||
    !d.quiz.questionCount ||
    d.quiz.attempted;

  $("leaderboard").innerHTML =
    d.leaderboard?.length
      ? d.leaderboard.map((x, i) => `
          <div class="leader-row">
            <span class="leader-rank">#${i + 1}</span>
            <span class="leader-name">${esc(x.name)}</span>
            <span class="leader-xp">${x.xp} XP</span>
          </div>
        `).join("")
      : '<p class="muted tiny">No scores yet. Be the first to compete!</p>';

}

// =====================================================
// START QUIZ
// =====================================================

$("startQuizBtn").addEventListener("click", async () => {

  $("startQuizBtn").disabled = true;

  try {

    const d = await api("startQuiz");

    state.quiz = d.quiz;
    state.current = 0;
    state.answers = [];

    showView("quizView");

    renderQuestion(d.question, d.deadline);

  } catch (error) {

    showToast(error.message);

    try {
      await loadDashboard();
    } catch (dashboardError) {
      showToast(dashboardError.message);
    }

  }

});

// =====================================================
// RENDER QUESTION
// =====================================================

function renderQuestion(question, deadline) {

  clearInterval(state.timerInterval);

  state.selected = null;
  state.deadline = deadline;

  const total = state.quiz.questions.length;

  $("questionTopic").textContent =
    question.topic || "GENERAL";

  $("questionNumber").textContent =
    String(state.current + 1).padStart(2, "0") +
    " / " +
    String(total).padStart(2, "0");

  $("quizProgressText").textContent =
    `Question ${state.current + 1} of ${total}`;

  $("questionText").textContent = question.text;

  $("progressBar").style.width =
    (state.current / total * 100) + "%";

  $("optionsList").innerHTML =
    question.options.map((option, i) => `
      <button class="option" data-value="${"ABCD"[i]}">
        <span class="option-letter">${"ABCD"[i]}</span>
        <span>${esc(option)}</span>
      </button>
    `).join("");

  document.querySelectorAll(".option").forEach(button => {

    button.addEventListener("click", () => {

      state.selected = button.dataset.value;

      document.querySelectorAll(".option").forEach(option => {
        option.classList.toggle(
          "selected",
          option === button
        );
      });

      $("submitAnswerBtn").disabled = false;

    });

  });

  $("submitAnswerBtn").disabled = true;

  $("selectionHint").textContent =
    "Select one answer to continue.";

  $("questionDots").innerHTML =
    Array.from({ length: total }, (_, i) => `
      <span class="${
        i === state.current
          ? "current"
          : i < state.current
            ? "done"
            : ""
      }"></span>
    `).join("");

  startTimer();

}

// =====================================================
// QUESTION TIMER
// =====================================================

function startTimer() {

  const tick = () => {

    const left = Math.max(
      0,
      Math.ceil((state.deadline - Date.now()) / 1000)
    );

    $("timerText").textContent = left;

    $("timerRing").classList.toggle(
      "warning",
      left <= 10
    );

    if (left <= 0) {

      clearInterval(state.timerInterval);

      sendAnswer(true);

    }

  };

  tick();

  state.timerInterval = setInterval(tick, 250);

}

// =====================================================
// SUBMIT ANSWER
// =====================================================

$("submitAnswerBtn").addEventListener("click", () => {
  sendAnswer(false);
});

async function sendAnswer(timedOut) {

  if (!state.quiz || state.sending) return;

  state.sending = true;

  clearInterval(state.timerInterval);

  $("submitAnswerBtn").disabled = true;

  try {

    const d = await api("submitAnswer", {

      attemptId: state.quiz.attemptId,

      questionId:
        state.quiz.questions[state.current].id,

      answer: timedOut ? null : state.selected,

      timedOut

    });

    state.answers.push(d.answer);

    if (d.completed) {

      showResult(d.result);

    } else {

      state.current++;

      renderQuestion(
        d.nextQuestion,
        d.deadline
      );

    }

  } catch (error) {

    showToast(error.message);

    if (
      error.message.toLowerCase().includes("expired") ||
      error.message.toLowerCase().includes("attempt")
    ) {

      try {
        await loadDashboard();
        showView("studentView");
      } catch (dashboardError) {
        showToast(dashboardError.message);
      }

    }

  } finally {

    state.sending = false;

  }

}

// =====================================================
// RESULT SCREEN
// =====================================================

function showResult(result) {

  clearInterval(state.timerInterval);

  state.quiz = null;

  showView("resultView");

  $("resultHeading").textContent =
    result.score > 0
      ? "Well played!"
      : "Challenge completed!";

  $("resultSub").textContent =
    "Your result has been securely recorded.";

  $("resultScore").textContent =
    result.score;

  $("resultCorrect").textContent =
    `${result.correct}/${result.total}`;

  $("resultAccuracy").textContent =
    result.accuracy + "%";

  $("resultXp").textContent =
    result.xpEarned;

}

// =====================================================
// EXIT QUIZ
// =====================================================

$("exitQuizBtn").addEventListener("click", async () => {

  if (
    confirm(
      "Leave this quiz? Your active question may be marked unanswered."
    )
  ) {

    try {

      await api("abandonQuiz", {
        attemptId: state.quiz?.attemptId
      });

    } catch (error) {

      console.warn(error);

    }

    clearInterval(state.timerInterval);

    state.quiz = null;

    showView("studentView");

    await loadDashboard();

  }

});

// =====================================================
// RESULT HOME
// =====================================================

$("resultHomeBtn").addEventListener("click", async () => {

  showView("studentView");

  await loadDashboard();

});

// =====================================================
// ADMIN DASHBOARD
// =====================================================

async function loadAdmin() {

  const d = await api("adminStats");

  $("adminStudentCount").textContent =
    d.stats.students;

  $("adminPending").textContent =
    d.stats.pending;

  $("adminQuestions").textContent =
    d.stats.questions;

  $("adminSubmissions").textContent =
    d.stats.submissions;

}

// =====================================================
// ADMIN NAVIGATION
// =====================================================

document.querySelectorAll(".admin-tab").forEach(button => {

  button.addEventListener("click", async () => {

    document.querySelectorAll(".admin-tab").forEach(tab => {
      tab.classList.toggle("active", tab === button);
    });

    state.adminTab = button.dataset.adminTab;

    ["create", "questions", "students", "logs"].forEach(tab => {

      $("admin" + cap(tab)).classList.toggle(
        "hidden",
        tab !== state.adminTab
      );

    });

    try {

      if (state.adminTab === "questions") {
        await loadQuestions();
      }

      if (state.adminTab === "students") {
        await loadStudents();
      }

      if (state.adminTab === "logs") {
        await loadLogs();
      }

    } catch (error) {

      showToast(error.message);

    }

  });

});

function cap(value) {
  return value[0].toUpperCase() + value.slice(1);
}

// =====================================================
// CREATE QUESTION
// =====================================================

$("saveQuestionBtn").addEventListener("click", async () => {

  hideMessage("adminMessage");

  const payload = {

    title:
      $("qQuizTitle").value.trim() ||
      "Daily Tech Challenge",

    date: $("qDate").value,

    topic: $("qTopic").value.trim(),

    difficulty: $("qDifficulty").value,

    text: $("qText").value.trim(),

    options: [
      $("qA").value.trim(),
      $("qB").value.trim(),
      $("qC").value.trim(),
      $("qD").value.trim()
    ],

    correct: $("qCorrect").value,

    xp: Number($("qXp").value || 10),

    explanation: $("qExplanation").value.trim()

  };

  try {

    const d = await api("adminCreateQuestion", payload);

    message("adminMessage", d.message, true);

    [
      "qText",
      "qA",
      "qB",
      "qC",
      "qD",
      "qExplanation"
    ].forEach(id => {
      $(id).value = "";
    });

    await loadAdmin();

  } catch (error) {

    message("adminMessage", error.message);

  }

});

// =====================================================
// ADMIN REFRESH BUTTONS
// =====================================================

$("refreshQuestionsBtn").addEventListener(
  "click",
  () => loadQuestions().catch(e => showToast(e.message))
);

$("refreshStudentsBtn").addEventListener(
  "click",
  () => loadStudents().catch(e => showToast(e.message))
);

$("refreshLogsBtn").addEventListener(
  "click",
  () => loadLogs().catch(e => showToast(e.message))
);

// =====================================================
// ADMIN QUESTIONS TABLE
// =====================================================

async function loadQuestions() {

  const d = await api("adminQuestions");

  $("questionTable").innerHTML = table(
    [
      "Date",
      "Title",
      "Topic",
      "Question",
      "Difficulty"
    ],

    d.questions.map(q => [
      q.date,
      q.title,
      q.topic,
      q.text,
      q.difficulty
    ])

  );

}

// =====================================================
// ADMIN STUDENTS TABLE
// =====================================================

async function loadStudents() {

  const d = await api("adminStudents");

  $("studentTable").innerHTML = table(
    [
      "Student ID",
      "Name",
      "Email",
      "Status",
      "Action"
    ],

    d.students.map(s => [

      s.studentId,

      s.name,

      s.email,

      `<span class="status-pill ${
        s.status === "APPROVED" ? "approved" : ""
      }">${esc(s.status)}</span>`,

      s.status === "APPROVED"
        ? "—"
        : `<button class="small-btn" data-approve="${esc(s.studentId)}">Approve</button>`

    ])

  );

  document.querySelectorAll("[data-approve]").forEach(button => {

    button.addEventListener("click", async () => {

      try {

        await api("adminApproveStudent", {
          studentId: button.dataset.approve
        });

        await loadStudents();

        await loadAdmin();

        showToast("Student approved.");

      } catch (error) {

        showToast(error.message);

      }

    });

  });

}

// =====================================================
// ADMIN ACTIVITY LOGS
// =====================================================

async function loadLogs() {

  const d = await api("adminLogs");

  $("logsTable").innerHTML = table(
    [
      "Time",
      "User",
      "Event",
      "Details"
    ],

    d.logs.map(log => [
      log.timestamp,
      log.user,
      log.event,
      log.details
    ])

  );

}

// =====================================================
// TABLE BUILDER
// =====================================================

function table(headers, rows) {

  if (!rows.length) {
    return '<p class="muted tiny">No records found.</p>';
  }

  return `
    <table>
      <thead>
        <tr>
          ${headers.map(header => `
            <th>${esc(header)}</th>
          `).join("")}
        </tr>
      </thead>

      <tbody>
        ${rows.map(row => `
          <tr>
            ${row.map(value => `
              <td>${
                value === null || value === undefined
                  ? ""
                  : (
                      String(value).startsWith("<")
                        ? value
                        : esc(value)
                    )
              }</td>
            `).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

}

// =====================================================
// START APPLICATION
// =====================================================

boot().catch(error => {

  console.error("Application initialization error:", error);

  showToast(
    "Application error: " + error.message
  );

});
