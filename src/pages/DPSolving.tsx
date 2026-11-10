import React, { useEffect } from "react";
import "@/src/modules/dp-solving/dpsolving.css";

export default function DPSolving() {
  useEffect(() => {
    window.scrollTo(0, 0);

    const script = document.createElement("script");
    script.src = "/assets/dpsolving/app.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="dp-solving-container">
      <div className="ambient ambient-a"></div>
      <div className="ambient ambient-b"></div>

      <header className="topbar">
        <a className="brand" href="/" aria-label="GFG MU home">
          <span className="brand-mark">GfG</span>
          <span className="brand-x">×</span>
          <span className="brand-university">
            MARWADI<br /><b>UNIVERSITY</b>
          </span>
        </a>
        <div className="top-actions">
          <span id="connection" className="connection">
            <i></i> Connecting
          </span>
          <button id="logoutBtn" className="btn btn-ghost hidden">
            Log out
          </button>
        </div>
      </header>

      <main className="shell">
        {/* Auth View */}
        <section id="authView" className="auth-layout">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot"></span> CAMPUS LEARNING • DAILY CHALLENGE
            </div>
            <h1>
              Small steps.<br />
              <span>Big knowledge.</span>
            </h1>
            <p className="hero-sub">
              Your daily dose of coding, technology and problem-solving. Learn something new. Challenge yourself. Climb the leaderboard.
            </p>
            <div className="hero-points">
              <div>
                <b>50 sec</b>
                <small>per question</small>
              </div>
              <div>
                <b>Daily</b>
                <small>fresh challenges</small>
              </div>
              <div>
                <b>XP + Rank</b>
                <small>track your growth</small>
              </div>
            </div>
            <div className="hero-note">
              <span>✦</span> Powered by the GFG × Marwadi University community
            </div>
          </div>

          <div className="auth-card panel">
            <div className="auth-tabs">
              <button className="auth-tab active" data-tab="login">
                Sign in
              </button>
              <button className="auth-tab" data-tab="register">
                Create account
              </button>
            </div>

            <div id="loginForm">
              <p className="kicker">WELCOME BACK</p>
              <h2>Continue your streak.</h2>
              <label>
                Student ID / Username
                <input id="loginId" autoComplete="username" placeholder="Enter your university ID" />
              </label>
              <label>
                Password
                <input id="loginPassword" type="password" autoComplete="current-password" placeholder="Enter your password" />
              </label>
              <button id="loginBtn" className="btn btn-primary btn-wide">
                Sign in <span>→</span>
              </button>
              <p className="form-foot">Admin? Sign in with your administrator credentials.</p>
            </div>

            <div id="registerForm" className="hidden">
              <p className="kicker">JOIN THE ARENA</p>
              <h2>Create your account.</h2>
              <label>
                Full name
                <input id="regName" placeholder="Your full name" />
              </label>
              <label>
                University email
                <input id="regEmail" type="email" placeholder="name@marwadiuniversity.ac.in" />
              </label>
              <label>
                Student ID
                <input id="regId" placeholder="University ID" />
              </label>
              <label>
                Create password
                <input id="regPassword" type="password" minLength={8} autoComplete="new-password" placeholder="At least 8 characters" />
              </label>
              <button id="registerBtn" className="btn btn-primary btn-wide">
                Send email OTP <span>→</span>
              </button>
              <div id="otpStage" className="hidden">
                <label>
                  Email verification code
                  <input id="regOtp" inputMode="numeric" maxLength={6} autoComplete="one-time-code" placeholder="Enter 6-digit OTP" />
                </label>
                <button id="verifyOtpBtn" className="btn btn-primary btn-wide">
                  Verify email & create account <span>→</span>
                </button>
                <button id="resendOtpBtn" className="btn btn-ghost btn-wide" disabled>
                  Resend code in 60s
                </button>
                <p className="form-foot">The code expires in 5 minutes. Check your inbox and spam folder.</p>
              </div>
              <p className="form-foot">Your university email must be verified before the account is created. Admin approval is still required before login.</p>
            </div>

            <div id="authMessage" className="message hidden"></div>
          </div>
        </section>

        {/* Student Dashboard View */}
        <section id="studentView" className="hidden">
          <div className="welcome-row">
            <div>
              <p className="kicker">STUDENT DASHBOARD</p>
              <h1>
                Hey, <span id="studentName">Learner</span> 👋
              </h1>
              <p className="muted">Ready to sharpen your skills today?</p>
            </div>
            <div className="date-chip" id="todayLabel"></div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">⚡</span>
              <small>TOTAL XP</small>
              <b id="myXp">0</b>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🏆</span>
              <small>GLOBAL RANK</small>
              <b id="myRank">—</b>
            </div>
            <div className="stat-card">
              <span className="stat-icon">✓</span>
              <small>QUIZZES TAKEN</small>
              <b id="myAttempts">0</b>
            </div>
            <div className="stat-card">
              <span className="stat-icon">◎</span>
              <small>BEST ACCURACY</small>
              <b id="myAccuracy">0%</b>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="panel daily-card">
              <div className="card-top">
                <div>
                  <p className="kicker">TODAY'S CHALLENGE</p>
                  <h2 id="dailyTitle">Daily Quiz</h2>
                </div>
                <span className="live-pill">
                  <i></i> LIVE
                </span>
              </div>
              <p id="dailyDescription" className="muted">A new challenge is waiting for you.</p>
              <div className="challenge-meta">
                <span>◷ 50 sec / question</span>
                <span>
                  ▤ <b id="questionCount">0</b> questions
                </span>
                <span>✦ Earn XP</span>
              </div>
              <button id="startQuizBtn" className="btn btn-primary">
                Start today's quiz <span>→</span>
              </button>
              <p id="quizStatus" className="tiny muted"></p>
            </div>

            <div className="panel side-card">
              <p className="kicker">YOUR DAILY MOTTO</p>
              <div className="quote-mark">“</div>
              <h3>Consistency beats intensity.</h3>
              <p className="muted">One question at a time. One day at a time. Keep learning.</p>
            </div>
          </div>

          <div className="panel leaderboard-panel">
            <div className="section-head">
              <div>
                <p className="kicker">CAMPUS CHAMPIONS</p>
                <h2>Leaderboard</h2>
              </div>
              <span className="muted tiny">Top participants</span>
            </div>
            <div id="leaderboard" className="leaderboard-list">
              <p className="muted">Loading leaderboard…</p>
            </div>
          </div>
        </section>

        {/* Quiz View */}
        <section id="quizView" className="hidden">
          <div className="quiz-head">
            <button id="exitQuizBtn" className="btn btn-ghost">
              ← Dashboard
            </button>
            <span className="quiz-tag">DAILY CHALLENGE</span>
            <span id="quizProgressText" className="muted tiny">
              Question 1
            </span>
          </div>
          <div className="quiz-layout">
            <div className="panel question-panel">
              <div className="question-meta">
                <span id="questionTopic" className="topic-tag">
                  GENERAL
                </span>
                <span id="questionNumber" className="muted tiny">
                  01 / 05
                </span>
              </div>
              <div className="progress-track">
                <div id="progressBar"></div>
              </div>
              <h1 id="questionText">Question text appears here.</h1>
              <div id="optionsList" className="options-list"></div>
              <div className="question-bottom">
                <span id="selectionHint" className="muted tiny">
                  Select one answer to continue.
                </span>
                <button id="submitAnswerBtn" className="btn btn-primary" disabled>
                  Submit answer →
                </button>
              </div>
            </div>

            <aside className="panel timer-panel">
              <p className="kicker">TIME REMAINING</p>
              <div id="timerRing" className="timer-ring">
                <span id="timerText">50</span>
                <small>SEC</small>
              </div>
              <p className="muted tiny center">This question auto-submits when time runs out.</p>
              <div className="timer-divider"></div>
              <p className="kicker">QUIZ PROGRESS</p>
              <div id="questionDots" className="question-dots"></div>
              <p className="tiny muted">Your deadline is verified by the server. Refreshing will not reset the timer.</p>
            </aside>
          </div>
        </section>

        {/* Result View */}
        <section id="resultView" className="hidden">
          <div className="panel result-card">
            <div className="result-icon">✦</div>
            <p className="kicker">CHALLENGE COMPLETED</p>
            <h1 id="resultHeading">Well played!</h1>
            <p className="muted" id="resultSub">Your result has been recorded.</p>
            <div className="result-score">
              <b id="resultScore">0</b>
              <span>POINTS</span>
            </div>
            <div className="result-stats">
              <div>
                <b id="resultCorrect">0/0</b>
                <small>Correct</small>
              </div>
              <div>
                <b id="resultAccuracy">0%</b>
                <small>Accuracy</small>
              </div>
              <div>
                <b id="resultXp">0</b>
                <small>XP earned</small>
              </div>
            </div>
            <button id="resultHomeBtn" className="btn btn-primary">
              Back to dashboard →
            </button>
          </div>
        </section>

        {/* Admin View */}
        <section id="adminView" className="hidden">
          <div className="welcome-row">
            <div>
              <p className="kicker">CONTROL CENTRE</p>
              <h1>
                Admin <span>Dashboard.</span>
              </h1>
              <p className="muted">Manage questions, participants and daily activity.</p>
            </div>
            <span className="admin-badge">ADMIN ACCESS</span>
          </div>

          <div className="stats-grid admin-stats">
            <div className="stat-card">
              <small>TOTAL STUDENTS</small>
              <b id="adminStudentCount">0</b>
            </div>
            <div className="stat-card">
              <small>PENDING APPROVALS</small>
              <b id="adminPending">0</b>
            </div>
            <div className="stat-card">
              <small>QUESTIONS</small>
              <b id="adminQuestions">0</b>
            </div>
            <div className="stat-card">
              <small>SUBMISSIONS</small>
              <b id="adminSubmissions">0</b>
            </div>
          </div>

          <div className="admin-tabs">
            <button className="admin-tab active" data-admin-tab="create">
              Create question
            </button>
            <button className="admin-tab" data-admin-tab="questions">
              Question bank
            </button>
            <button className="admin-tab" data-admin-tab="students">
              Students
            </button>
            <button className="admin-tab" data-admin-tab="logs">
              Activity logs
            </button>
          </div>

          <div id="adminCreate" className="panel admin-panel">
            <p className="kicker">QUESTION BUILDER</p>
            <h2>Add a quiz question</h2>
            <div className="form-grid">
              <label>
                Quiz title
                <input id="qQuizTitle" placeholder="Daily Tech Challenge" />
              </label>
              <label>
                Publish date
                <input id="qDate" type="date" />
              </label>
              <label>
                Topic
                <input id="qTopic" placeholder="JavaScript / DBMS / AI" />
              </label>
              <label>
                Difficulty
                <select id="qDifficulty">
                  <option>Easy</option>
                  <option selected>Medium</option>
                  <option>Hard</option>
                </select>
              </label>
            </div>
            <label>
              Question
              <textarea id="qText" rows={3} placeholder="Write a clear question…"></textarea>
            </label>
            <div className="form-grid options-form">
              <label>
                Option A
                <input id="qA" />
              </label>
              <label>
                Option B
                <input id="qB" />
              </label>
              <label>
                Option C
                <input id="qC" />
              </label>
              <label>
                Option D
                <input id="qD" />
              </label>
            </div>
            <div className="form-grid">
              <label>
                Correct option
                <select id="qCorrect">
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </label>
              <label>
                XP reward
                <input id="qXp" type="number" min={0} max={100} defaultValue={10} />
              </label>
            </div>
            <label>
              Explanation (optional)
              <textarea id="qExplanation" rows={2} placeholder="Explain the correct answer…"></textarea>
            </label>
            <button id="saveQuestionBtn" className="btn btn-primary">
              Save question to Sheets →
            </button>
            <div id="adminMessage" className="message hidden"></div>
          </div>

          <div id="adminQuestions" className="panel admin-panel hidden">
            <div className="section-head">
              <div>
                <p className="kicker">CONTENT LIBRARY</p>
                <h2>Question bank</h2>
              </div>
              <button id="refreshQuestionsBtn" className="btn btn-secondary">
                Refresh
              </button>
            </div>
            <div id="questionTable" className="table-wrap"></div>
          </div>

          <div id="adminStudents" className="panel admin-panel hidden">
            <div className="section-head">
              <div>
                <p className="kicker">PARTICIPANT MANAGEMENT</p>
                <h2>Students</h2>
              </div>
              <button id="refreshStudentsBtn" className="btn btn-secondary">
                Refresh
              </button>
            </div>
            <div id="studentTable" className="table-wrap"></div>
          </div>

          <div id="adminLogs" className="panel admin-panel hidden">
            <div className="section-head">
              <div>
                <p className="kicker">AUDIT TRAIL</p>
                <h2>Recent activity</h2>
              </div>
              <button id="refreshLogsBtn" className="btn btn-secondary">
                Refresh
              </button>
            </div>
            <div id="logsTable" className="table-wrap"></div>
          </div>
        </section>
      </main>

      <footer>
        <span>GFG × MARWADI UNIVERSITY</span>
        <span>LEARN • BUILD • COMPETE</span>
      </footer>

      <div id="toast" className="toast hidden"></div>
    </div>
  );
}
