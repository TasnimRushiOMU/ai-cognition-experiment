// ─────────────────────────────────────────────────────────────────────────────
// APP LOGIC — AI Cognition Experiment
// ─────────────────────────────────────────────────────────────────────────────

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbyf--Tia_SrRr-HXcMxNSuaf-UA2vnjmHmhziQLbsIiFK3KP_bfJsLtjH6ZCyqv0pzBeA/exec";

// AI RELIANCE: 0=no help, 1=concept hint, 2=step hint, 3=full answer
const AI_SCORES = { none: 0, hint1: 1, hint2: 2, full: 3 };

// ── STATE ─────────────────────────────────────────────────────────────────────
let PID = "", SESS = "1";
let ti = 0, ts = null, taskStartTs = null;
let aiLevel = null, firstHintLatency = null;
let results = [], eventLog = [];
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
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("on"));
  document.getElementById(id).classList.add("on");
}
function syncDot(state) {
  const d = document.getElementById("sync-dot");
  if (d) d.className = "sync-dot " + state;
}
function logEv(type, detail) {
  const elapsed = taskStartTs ? ((Date.now()-taskStartTs)/1000).toFixed(1) : "0.0";
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
  ti = i; aiLevel = null; firstHintLatency = null;
  ts = Date.now(); taskStartTs = Date.now();
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

  document.getElementById("ai-pill").textContent = "Not used";

  if (isControlSession) {
    document.getElementById("ai-pill").textContent = "Unavailable";
    document.getElementById("msgs").innerHTML = '<div class="m sys">AI assistance is not available in this session.<br><br>Please complete the task using your own reasoning.</div>';
    document.getElementById("bgrp").innerHTML = '<div class="bgrp-note">No AI help available in this session.</div>';
    document.getElementById("cf-box").style.display = "block";
    document.getElementById("cf-sub").classList.remove("show");
    document.querySelectorAll(".cf-btn").forEach(b => b.classList.remove("sel"));
  } else {
    document.getElementById("msgs").innerHTML = '<div class="m sys">Hello! How can I help today?<br><br>Choose an option below.</div>';
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
  const elapsed = ((Date.now()-taskStartTs)/1000).toFixed(1);

  // Record first-hint latency — the moment the participant first asks for any AI help
  if (c !== "none" && firstHintLatency === null) {
    firstHintLatency = +elapsed;
    logEv("first_ai_request", `latency=${elapsed}s type=${c}`);
  }

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

  const elapsed  = Math.round((Date.now()-taskStartTs)/1000);
  const ans      = document.getElementById("ans").value.trim();
  const conf     = getConf();
  const confLabel = ["","Very unconfident","Unconfident","Neutral","Confident","Very confident"][conf];
  const t        = TASKS[ti];
  const aiScore  = isControlSession ? null : AI_SCORES[aiLevel || "none"];
  const isBlank  = !ans || ans.trim().length < 5;

  logEv("task_submit", `elapsed=${elapsed}s ai_reliance=${aiScore} conf=${conf} blank=${isBlank} first_hint_lat=${firstHintLatency}`);

  const result = {
    task_num:          ti+1,
    task_id:           t.id,
    task_type:         t.type,
    diff:              t.diff,
    elapsed_s:         elapsed,
    answer:            ans,
    answer_len:        ans.length,
    ai_level:          isControlSession ? "n/a" : (aiLevel || "none"),
    ai_reliance:       aiScore,           // 0–3; null in control session
    first_hint_lat_s:  firstHintLatency,  // seconds from task start to first AI request; null if no AI used
    confidence:        conf,              // 1–5
    confidence_label:  confLabel,
    self_score:        null,              // filled in overlay
    cf_would_use:      isControlSession ? cfWouldUse : null,
    cf_level:          isControlSession ? cfLevelChoice : null,
  };

  results.push(result);

  // ── IMMEDIATE per-task write to Google Sheets (data loss prevention) ──
  // Writes each task as soon as it's submitted rather than waiting for session end.
  // This means even if the participant closes the browser mid-session, all
  // completed tasks are already saved.
  writeTaskToSheets(result);

  // ── OVERLAY ──
  document.getElementById("ovt").textContent  = to ? "Time up" : "Task submitted";
  document.getElementById("ov-ans-box").textContent = ans || "(no answer entered)";
  document.getElementById("ovc2").textContent = `Scoring guide: ${t.scoring_guide}`;
  document.getElementById("ovs").innerHTML = `
    <div class="ostat">Time taken: <b>${elapsed}s</b></div>
    <div class="ostat">Confidence: <b>${confLabel}</b></div>
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
  const r = results[results.length-1];
  r.self_score = score;
  logEv("self_score", `task=${TASKS[ti].id} self=${score}`);
  document.querySelectorAll(".ss-btn").forEach(b => { b.classList.remove("sel"); });
  btnEl.classList.add("sel");

  // Update self_score in Sheets immediately
  updateSelfScoreInSheets(r);

  document.getElementById("ovnxt").style.display = "block";
  document.getElementById("ovnxt").textContent = ti+1 < TASKS.length ? "Next task →" : "View session results";
}

function nxt() {
  if (results[results.length-1].self_score === null) return;
  document.getElementById("ov").classList.remove("on");
  if (ti+1 < TASKS.length) { load(ti+1); }
  else { showDone(); }
}

// ── GOOGLE SHEETS WRITES ──────────────────────────────────────────────────────

// Write a single task row immediately on submission (data loss prevention)
async function writeTaskToSheets(result) {
  if (!SHEETS_URL || SHEETS_URL === "YOUR_APPS_SCRIPT_URL_HERE") return;
  syncDot("saving");
  try {
    await fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "task_row",
        pid: PID, session: SESS, date: DATE,
        is_control: isControlSession,
        result
      })
    });
    syncDot("saved");
  } catch(e) {
    syncDot("error");
    console.error("Sheets task write failed:", e);
  }
}

// Update self_score on the already-written row
async function updateSelfScoreInSheets(result) {
  if (!SHEETS_URL || SHEETS_URL === "YOUR_APPS_SCRIPT_URL_HERE") return;
  try {
    await fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "self_score_update",
        pid: PID, session: SESS,
        task_num: result.task_num,
        self_score: result.self_score
      })
    });
  } catch(e) {
    console.error("Self-score update failed:", e);
  }
}

// Write event log at session end
async function writeEventLogToSheets() {
  if (!SHEETS_URL || SHEETS_URL === "YOUR_APPS_SCRIPT_URL_HERE") return;
  try {
    await fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "event_log",
        pid: PID, session: SESS,
        event_log: eventLog
      })
    });
  } catch(e) {
    console.error("Event log write failed:", e);
  }
}

// ── SESSION RESULTS ───────────────────────────────────────────────────────────
function buildParticipantSummHTML() {
  const selfTotal = results.reduce((a,r) => a+(r.self_score??0), 0);
  const totalTime = results.reduce((a,r) => a+r.elapsed_s, 0);
  let h = `<b>Participant ID:</b> ${PID}<br>`;
  h += `<b>Session:</b> ${SESS}${isControlSession?" (control — no AI)":""} &nbsp;·&nbsp; <b>Date:</b> ${DATE}<br><br>`;
  h += `<b>Tasks completed:</b> ${results.length} of ${results.length}<br>`;
  h += `<b>Total time:</b> ${totalTime}s<br>`;
  h += `<b>Your self-assessed score:</b> ${selfTotal} / ${results.length*2}<br><br>`;
  h += `Your detailed responses have been saved. The researcher will review them separately.`;
  return h;
}

function buildCSV() {
  const headers = [
    "pid","session","date","task_num","task_id","task_type","difficulty",
    "elapsed_s","answer","answer_len",
    "ai_level","ai_reliance_0to3","first_hint_latency_s",
    "confidence_1to5","confidence_label",
    "self_score_0to2","researcher_score_0to2",
    "cf_would_use_AI","cf_level","is_control_session"
  ];
  const rows = results.map(r => [
    PID, SESS, DATE,
    r.task_num, r.task_id, r.task_type, r.diff,
    r.elapsed_s,
    `"${(r.answer||"").replace(/"/g,'""')}"`,
    r.answer_len,
    r.ai_level,
    r.ai_reliance ?? "N/A",
    r.first_hint_lat_s ?? "N/A",
    r.confidence, r.confidence_label,
    r.self_score ?? "", "",
    r.cf_would_use ?? "", r.cf_level ?? "",
    isControlSession ? "yes" : "no"
  ].join(","));

  const evHeaders = "pid,session,task_num,time_s,event_type,detail";
  const evRows = eventLog.map(e =>
    `${PID},${SESS},${e.task},"${e.ts}","${e.type}","${(e.detail||"").replace(/"/g,'""')}"`
  );

  return [
    "# TASK RESULTS",
    headers.join(","),
    ...rows,
    "",
    "# EVENT LOG",
    evHeaders,
    ...evRows
  ].join("\n");
}

function showDone() {
  document.getElementById("summbox").innerHTML = buildParticipantSummHTML();
  document.getElementById("pdf-name-hint").textContent =
    `CSV filename: assessment_${PID}_session${SESS}.csv`;
  show("s-done");
  writeEventLogToSheets();
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
