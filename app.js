// ─────────────────────────────────────────────────────────────────────────────
// APP LOGIC — AI Cognition Experiment
//
// Key design decisions reflected here:
//
// AI RELIANCE SCALE (0–3, not 0/2/4/5):
//   0 = no help taken
//   1 = concept hint
//   2 = step-by-step hint
//   3 = full answer
//   Rationale: 3 meaningful levels → cleaner ordinal scale for LMM analysis.
//
// COGNITIVE SCORE DROPPED:
//   Previously defined as 5-minus-AI-score, which adds zero independent
//   information. The AI reliance score (0–3) is the dependent variable.
//
// SCORES HIDDEN FROM PARTICIPANT:
//   Showing AI reliance scores during the session would create a demand
//   effect (participants self-censor). Scores appear only in the CSV/PDF
//   that goes to the researcher.
//
// EVENT LOG HIDDEN FROM PARTICIPANT but kept in memory:
//   Timestamps of AI use within each task (first-hint latency) are
//   scientifically valuable. Log written to memory, exported in CSV.
//
// DUAL DATA EXPORT:
//   1. Google Sheets (silent background write via Apps Script web app)
//   2. CSV download (manual backup the participant emails to researcher)
//   Both contain full data including answers and event log.
//
// CONFIDENCE: 5-point labeled radio (Very unconfident → Very confident)
// SELF-SCORE: 0/1/2 collected in overlay — participant sees their own answer
// ─────────────────────────────────────────────────────────────────────────────

// ── GOOGLE SHEETS CONFIG ──────────────────────────────────────────────────────
// Paste your Apps Script Web App URL here after following SHEETS_SETUP.md
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbyf--Tia_SrRr-HXcMxNSuaf-UA2vnjmHmhziQLbsIiFK3KP_bfJsLtjH6ZCyqv0pzBeA/exec";

// ── AI RELIANCE SCALE ─────────────────────────────────────────────────────────
const AI_SCORES = { none: 0, hint1: 1, hint2: 2, full: 3 };

// ── STATE ─────────────────────────────────────────────────────────────────────
let PID = "", SESS = "1";
let ti = 0, ts = null;
let aiLevel = null, results = [], eventLog = [];
let TASKS = [];
let isControlSession = false;
let cfWouldUse = null, cfLevelChoice = null;
const DATE = new Date().toLocaleDateString("en-GB");

// ── HELPERS ───────────────────────────────────────────────────────────────────
function getConf() {
  const checked = document.querySelector('input[name="conf"]:checked');
  return checked ? +checked.value : 3;
}
function resetConf() {
  document.getElementById("c3").checked = true;
}

function pct(scores, max) {
  if (!scores.length) return 0;
  return Math.round((scores.reduce((a,b)=>a+b,0)*100/max)/scores.length);
}

function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("on"));
  document.getElementById(id).classList.add("on");
}

function syncDot(state) {
  const d = document.getElementById("sync-dot");
  if (d) d.className = "sync-dot " + state;
}

function logEv(type, detail) {
  const elapsed = ts ? ((Date.now()-ts)/1000).toFixed(1) : "0.0";
  eventLog.push({ ts: elapsed, type, detail, task: ti+1 });
}

// ── ENTRY ─────────────────────────────────────────────────────────────────────
function startExp() {
  const p = document.getElementById("pid-input").value.trim();
  const s = document.getElementById("sess-input").value.trim() || "1";
  if (!p) { document.getElementById("pid-err").style.display="block"; return; }
  const sNum = parseInt(s);
  if (sNum < 1 || sNum > 4) { document.getElementById("sess-err").style.display="block"; return; }
  document.getElementById("pid-err").style.display = "none";
  document.getElementById("sess-err").style.display = "none";

  PID = p; SESS = s; results = []; eventLog = []; ti = 0;
  isControlSession = (sNum === 4);
  TASKS = getTaskSet(PID, sNum);

  document.getElementById("pid-lbl").textContent  = PID;
  document.getElementById("sess-lbl").textContent = SESS;
  document.getElementById("date-lbl").textContent = DATE;

  const badge = document.getElementById("phase-badge");
  if (isControlSession) {
    badge.textContent = "Control session — no AI";
    badge.classList.add("control");
  } else {
    badge.textContent = "AI available";
    badge.classList.remove("control");
  }

  show("s-exp");
  load(0);
}

function goEntry() { show("s-entry"); }

// ── TASK LOAD ─────────────────────────────────────────────────────────────────
function load(i) {
  ti = i; aiLevel = null; ts = Date.now();
  cfWouldUse = null; cfLevelChoice = null;
  const t = TASKS[i];

  document.getElementById("tnum").textContent      = `Task ${i+1} of ${TASKS.length}`;
  document.getElementById("task-type").textContent = t.type;
  document.getElementById("qbox").textContent      = t.q;
  document.getElementById("ans-hint").textContent  = t.ans_hint || "";
  document.getElementById("ans").value             = "";
  resetConf();

  const db = document.getElementById("diff");
  db.textContent = t.diff.charAt(0).toUpperCase() + t.diff.slice(1);
  db.className   = "diff " + t.diff;

  document.getElementById("ai-pill").textContent  = "Not used";
  document.getElementById("msgs").innerHTML       = '<div class="m sys">Hello! How can I help today?<br><br>Choose an option below.</div>';

  if (isControlSession) {
    document.getElementById("ai-pill").textContent = "Unavailable";
    document.getElementById("msgs").innerHTML = '<div class="m sys">AI assistance is not available in this session.<br><br>Please complete the task using your own reasoning.</div>';
    document.getElementById("bgrp").innerHTML = '<div class="bgrp-note">No AI help available in this session.</div>';
    document.getElementById("cf-box").style.display = "block";
    document.getElementById("cf-sub").classList.remove("show");
    document.querySelectorAll(".cf-btn").forEach(b => b.classList.remove("sel"));
  } else {
    resetBgrp();
    document.getElementById("cf-box").style.display = "none";
  }

  document.getElementById("subbtn").disabled = false;
  logEv("task_start", `${t.id} diff=${t.diff}`);
}

function resetBgrp() {
  document.getElementById("bgrp").innerHTML = `
    <button class="ai-btn hint" onclick="aiChoice('hint1')">💡 Hint — explain the concept</button>
    <button class="ai-btn full" onclick="aiChoice('full')">✓ Full answer with reasoning</button>
    <button class="ai-btn btn-sec" onclick="aiChoice('none')" style="font-size:12px">I don't need help</button>`;
}

// ── AI PANEL ──────────────────────────────────────────────────────────────────
function aiChoice(c) {
  const t = TASKS[ti];
  const elapsed = ((Date.now()-ts)/1000).toFixed(1);

  if (c === "none") {
    aiLevel = "none";
    addMsg("Understood — I'll let you work independently.");
    document.getElementById("bgrp").innerHTML = '<div class="bgrp-note">No AI help selected. Submit your answer when ready.</div>';
    document.getElementById("ai-pill").textContent = "Not used";
    logEv("ai_choice", `none at ${elapsed}s reliance=0`);
    return;
  }
  if (c === "hint1") {
    aiLevel = "hint1";
    addMsg(t.hint1 || "Think about the key concepts in the question. What information do you already have?");
    document.getElementById("ai-pill").textContent = "Concept hint";
    logEv("ai_choice", `hint1 at ${elapsed}s reliance=1`);
    document.getElementById("bgrp").innerHTML = `
      <div style="font-size:12px;color:#999;padding:2px 4px">Need more help?</div>
      <button class="ai-btn more" onclick="aiChoice('hint2')">📐 More hint — show the steps</button>
      <button class="ai-btn full" onclick="aiChoice('full')">✓ Full answer with reasoning</button>
      <button class="ai-btn btn-sec" onclick="closeAI()" style="font-size:12px">That's enough, thanks</button>`;
    return;
  }
  if (c === "hint2") {
    aiLevel = "hint2";
    addMsg(t.hint2 || "Break the problem into smaller parts. Try working through each step one at a time.");
    document.getElementById("ai-pill").textContent = "Step hint";
    logEv("ai_choice", `hint2 at ${elapsed}s reliance=2`);
    document.getElementById("bgrp").innerHTML = `
      <button class="ai-btn full" onclick="aiChoice('full')">✓ Full answer with reasoning</button>
      <button class="ai-btn btn-sec" onclick="closeAI()" style="font-size:12px">That's enough, thanks</button>`;
    return;
  }
  if (c === "full") {
    aiLevel = "full";
    addMsg(t.full || "A complete answer would address all parts of the question systematically with reasoning for each point.");
    document.getElementById("ai-pill").textContent = "Full answer";
    logEv("ai_choice", `full at ${elapsed}s reliance=3`);
    document.getElementById("bgrp").innerHTML = '<div class="bgrp-note">Full answer provided. Submit when ready.</div>';
  }
}

function closeAI() {
  document.getElementById("bgrp").innerHTML = '<div class="bgrp-note">AI help complete. Submit when ready.</div>';
}

function addMsg(txt) {
  const b = document.getElementById("msgs");
  const d = document.createElement("div");
  d.className = "m ai"; d.textContent = txt;
  b.appendChild(d); b.scrollTop = b.scrollHeight;
}

// ── COUNTERFACTUAL (session 4) ────────────────────────────────────────────────
function cfChoice(wouldUse, btnEl) {
  cfWouldUse = wouldUse;
  if (!wouldUse) cfLevelChoice = "n/a";
  document.querySelectorAll("#cf-box .cf-row")[0].querySelectorAll(".cf-btn").forEach(b => b.classList.remove("sel"));
  btnEl.classList.add("sel");
  document.getElementById("cf-sub").classList.toggle("show", wouldUse);
  logEv("cf_choice", `would_use=${wouldUse}`);
}

function cfLevel(level, btnEl) {
  cfLevelChoice = level;
  document.getElementById("cf-sub").querySelectorAll(".cf-btn").forEach(b => b.classList.remove("sel"));
  btnEl.classList.add("sel");
  logEv("cf_level", `level=${level}`);
}

// ── SUBMIT ────────────────────────────────────────────────────────────────────
function sub(to) {
  if (document.getElementById("subbtn").disabled && !to) return;

  if (isControlSession && cfWouldUse === null) {
    document.getElementById("cf-box").scrollIntoView({ behavior:"smooth", block:"center" });
    return;
  }
  if (isControlSession && cfWouldUse === true && cfLevelChoice === null) {
    document.getElementById("cf-sub").scrollIntoView({ behavior:"smooth", block:"center" });
    return;
  }

  document.getElementById("subbtn").disabled = true;

  const elapsed  = Math.round((Date.now()-ts)/1000);
  const ans      = document.getElementById("ans").value.trim();
  const conf     = getConf();
  const t        = TASKS[ti];
  const aiScore  = isControlSession ? null : AI_SCORES[aiLevel || "none"];
  const isBlank  = !ans || ans.trim().length < 5;

  logEv("task_submit", `elapsed=${elapsed}s ai_reliance=${aiScore} conf=${conf} blank=${isBlank}`);

  results.push({
    task_id:      t.id,
    task_type:    t.type,
    diff:         t.diff,
    elapsed_s:    elapsed,
    answer:       ans,
    answer_len:   ans.length,
    ai_level:     isControlSession ? "n/a" : (aiLevel || "none"),
    ai_reliance:  aiScore,           // 0–3 scale; null in control session
    confidence:   conf,              // 1–5 labeled
    self_score:   null,              // filled in overlay
    cf_would_use: isControlSession ? cfWouldUse : null,
    cf_level:     isControlSession ? cfLevelChoice : null,
    researcher_score: null,          // blank — researcher fills after receiving data
  });

  // ── OVERLAY ──
  document.getElementById("ovt").textContent  = to ? "Time up" : "Task submitted";
  document.getElementById("ov-ans-box").textContent = ans || "(no answer entered)";
  document.getElementById("ovc2").textContent = `Scoring guide: ${t.scoring_guide}`;
  document.getElementById("ovs").innerHTML    = `
    <div class="ostat">Time taken: <b>${elapsed}s</b></div>
    <div class="ostat">Confidence: <b>${["","Very unconfident","Unconfident","Neutral","Confident","Very confident"][conf]}</b></div>
    ${isControlSession ? `<div class="ostat">Would have used AI: <b>${cfWouldUse ? "Yes ("+cfLevelChoice+")" : "No"}</b></div>` : ""}`;

  document.getElementById("self-score-area").innerHTML = `
    <div class="self-score-wrap">
      <div class="qlbl">How well did you answer this task?</div>
      <div class="ss-row">
        <button class="ss-btn" onclick="setSelfScore(0,this)">0 — Incorrect or blank</button>
        <button class="ss-btn" onclick="setSelfScore(1,this)">1 — Partially correct</button>
        <button class="ss-btn" onclick="setSelfScore(2,this)">2 — Fully correct</button>
      </div>
      <div style="font-size:12px;color:#999">Select a score to continue.</div>
    </div>`;

  document.getElementById("ovnxt").style.display = "none";
  document.getElementById("ov").classList.add("on");
}

function setSelfScore(score, btnEl) {
  results[results.length-1].self_score = score;
  logEv("self_score", `task=${TASKS[ti].id} self=${score}`);
  document.querySelectorAll(".ss-btn").forEach(b => { b.classList.remove("sel"); b.style=""; });
  btnEl.classList.add("sel");
  document.getElementById("ovnxt").style.display = "block";
  document.getElementById("ovnxt").textContent = ti+1 < TASKS.length ? "Next task →" : "View session results";
}

function nxt() {
  if (results[results.length-1].self_score === null) return;
  document.getElementById("ov").classList.remove("on");
  if (ti+1 < TASKS.length) { load(ti+1); }
  else { showDone(); }
}

// ── SESSION RESULTS ───────────────────────────────────────────────────────────
function buildParticipantSummHTML() {
  // Neutral summary — no reliance scores shown to avoid demand effect
  const selfTotal = results.reduce((a,r)=>a+(r.self_score??0),0);
  const totalTime = results.reduce((a,r)=>a+r.elapsed_s,0);
  let h = `<b>Participant ID:</b> ${PID}<br>`;
  h += `<b>Session:</b> ${SESS}${isControlSession?" (control — no AI)":""} &nbsp;·&nbsp; <b>Date:</b> ${DATE}<br><br>`;
  h += `<b>Tasks completed:</b> ${results.length} of ${results.length}<br>`;
  h += `<b>Total time:</b> ${totalTime}s<br>`;
  h += `<b>Your self-assessed score:</b> ${selfTotal} / ${results.length*2}<br><br>`;
  h += `Your detailed responses have been saved. The researcher will review them separately.`;
  return h;
}

function buildCSV() {
  // Full data CSV for researcher — includes answers, AI reliance, all scores, event log
  const headers = [
    "pid","session","date","task_num","task_id","task_type","difficulty",
    "elapsed_s","answer","answer_len","ai_level","ai_reliance_0to3",
    "confidence_1to5","self_score_0to2","researcher_score_0to2",
    "cf_would_use_AI","cf_level","is_control_session"
  ];

  const rows = results.map((r,i) => [
    PID, SESS, DATE, i+1, r.task_id, r.task_type, r.diff,
    r.elapsed_s,
    `"${(r.answer||"").replace(/"/g,'""')}"`,  // quote-escaped answer
    r.answer_len,
    r.ai_level,
    r.ai_reliance ?? "N/A",
    r.confidence,
    r.self_score ?? "",
    "",                                          // researcher_score — blank
    r.cf_would_use ?? "", r.cf_level ?? "",
    isControlSession ? "yes" : "no"
  ].join(","));

  // Append event log as a separate section
  const evHeaders = "event_task,event_time_s,event_type,event_detail";
  const evRows = eventLog.map(e =>
    `${e.task},"${e.ts}","${e.type}","${(e.detail||"").replace(/"/g,'""')}"`
  );

  return [
    "# TASK RESULTS",
    headers.join(","),
    ...rows,
    "",
    "# EVENT LOG (AI choice timestamps)",
    evHeaders,
    ...evRows
  ].join("\n");
}

function showDone() {
  document.getElementById("summbox").innerHTML = buildParticipantSummHTML();
  document.getElementById("pdf-name-hint").textContent =
    `CSV filename: assessment_${PID}_session${SESS}.csv`;
  show("s-done");

  // Silent background write to Google Sheets
  sendToSheets();
}

// ── GOOGLE SHEETS WRITE ───────────────────────────────────────────────────────
// Uses a Google Apps Script Web App as a lightweight proxy.
// The Apps Script appends one row per task result to your Sheet.
// Setup instructions: see SHEETS_SETUP.md
async function sendToSheets() {
  if (!SHEETS_URL || SHEETS_URL === "YOUR_APPS_SCRIPT_URL_HERE") {
    syncDot("error"); return;
  }
  syncDot("saving");
  try {
    const payload = {
      pid: PID, session: SESS, date: DATE,
      is_control: isControlSession,
      results: results.map((r,i) => ({
        task_num: i+1, task_id: r.task_id, task_type: r.task_type,
        diff: r.diff, elapsed_s: r.elapsed_s,
        answer: r.answer, answer_len: r.answer_len,
        ai_level: r.ai_level, ai_reliance: r.ai_reliance,
        confidence: r.confidence, self_score: r.self_score,
        cf_would_use: r.cf_would_use, cf_level: r.cf_level
      })),
      event_log: eventLog
    };
    await fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors",      // Apps Script requires no-cors for cross-origin POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    syncDot("saved");
  } catch(e) {
    syncDot("error");
    console.error("Sheets write failed:", e);
  }
}

// ── CSV DOWNLOAD ──────────────────────────────────────────────────────────────
function downloadCSV() {
  const csv  = buildCSV();
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `assessment_${PID}_session${SESS}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function closePrint() {
  document.getElementById("print-overlay").style.display = "none";
}
