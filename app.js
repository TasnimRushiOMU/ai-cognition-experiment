// ─────────────────────────────────────────────
// APP LOGIC
// ─────────────────────────────────────────────

const AI_SCORES = { none: 0, hint1: 2, hint2: 4, full: 5 };
const COG_MAP   = { 0: 5, 2: 3, 4: 1, 5: 0 };

let PID = "", SESS = "1";
let ti = 0, ts = null;
let aiLevel = null, results = [];
let TASKS = [];
let isControlSession = false;
let cfWouldUse = null, cfLevelChoice = null;
const DATE = new Date().toLocaleDateString("en-GB");

// ── ANSWER CHECK (all open-ended) ─────────────
function chk(ans) {
  if (!ans || ans.trim().length < 5) return { v: "blank", l: "No answer — 0 points" };
  return { v: "open", l: "Open-ended — you will self-score below" };
}

function pct(scores) {
  if (!scores.length) return 0;
  return Math.round((scores.reduce((a, b) => a + b, 0) * 100 / 5) / scores.length);
}

// ── SCREEN ROUTING ────────────────────────────
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("on"));
  document.getElementById(id).classList.add("on");
}

// ── ENTRY ─────────────────────────────────────
function startExp() {
  const p = document.getElementById("pid-input").value.trim();
  const s = document.getElementById("sess-input").value.trim() || "1";
  if (!p) { document.getElementById("pid-err").style.display = "block"; return; }
  const sNum = parseInt(s);
  if (sNum < 1 || sNum > 4) { document.getElementById("sess-err").style.display = "block"; return; }
  document.getElementById("pid-err").style.display = "none";
  document.getElementById("sess-err").style.display = "none";
  PID = p; SESS = s; results = []; ti = 0;
  isControlSession = (sNum === 4);

  // Load correct task set based on PID + session (counterbalancing); session 4 = control (Set D, no AI)
  TASKS = getTaskSet(PID, sNum);

  document.getElementById("pid-lbl").textContent  = PID;
  document.getElementById("sess-lbl").textContent = SESS;
  document.getElementById("date-lbl").textContent = DATE;
  document.getElementById("set-lbl").textContent  = "Set " + (TASKS[0].id[0]);

  const badge = document.getElementById("phase-badge");
  if (isControlSession) {
    badge.textContent = "Control session — no AI available";
    badge.classList.add("control");
  } else {
    badge.textContent = "Phase 2 — AI available";
    badge.classList.remove("control");
  }

  show("s-exp");
  load(0);
}

function goEntry() { show("s-entry"); }

// ── TASK LOAD ─────────────────────────────────
function load(i) {
  ti = i; aiLevel = null; ts = Date.now();
  cfWouldUse = null; cfLevelChoice = null;
  const t = TASKS[i];

  document.getElementById("tnum").textContent     = `Task ${i + 1} of ${TASKS.length}`;
  document.getElementById("task-type").textContent = t.type;
  document.getElementById("qbox").textContent     = t.q;
  document.getElementById("ans-hint").textContent = t.ans_hint || "";

  const db = document.getElementById("diff");
  db.textContent = t.diff.charAt(0).toUpperCase() + t.diff.slice(1);
  db.className   = "diff " + t.diff;

  document.getElementById("ans").value            = "";
  document.getElementById("csl").value            = 4;
  document.getElementById("cv").textContent       = "4";

  if (isControlSession) {
    // No AI panel in control session — replace with a static notice, show counterfactual question
    document.getElementById("ai-score-lbl").textContent = "No AI help in this session";
    document.getElementById("ai-pill").textContent  = "Unavailable";
    document.getElementById("msgs").innerHTML = '<div class="m sys">AI assistance is not available in this session.<br><br>Please complete the task using your own reasoning.</div>';
    document.getElementById("bgrp").innerHTML = '<div class="bgrp-note">No AI help available in this session.</div>';
    document.getElementById("cf-box").style.display = "block";
    document.getElementById("cf-sub").classList.remove("show");
    document.querySelectorAll(".cf-btn").forEach(b => b.classList.remove("sel"));
  } else {
    document.getElementById("ai-score-lbl").textContent = "";
    document.getElementById("ai-pill").textContent  = "Not used";
    document.getElementById("msgs").innerHTML = '<div class="m sys">Hello! How can I help today?<br><br>Choose an option below.</div>';
    resetBgrp();
    document.getElementById("cf-box").style.display = "none";
  }

  document.getElementById("subbtn").disabled = false;
  log("task_start", `${t.id} diff=${t.diff} control=${isControlSession}`);
}

function resetBgrp() {
  document.getElementById("bgrp").innerHTML = `
    <button class="ai-btn hint" onclick="aiChoice('hint1')">💡 Hint — explain the concept</button>
    <button class="ai-btn full" onclick="aiChoice('full')">✓ Full answer with reasoning</button>
    <button class="ai-btn btn-sec" onclick="aiChoice('none')" style="font-size:12px">I don't need help</button>`;
}

// ── AI PANEL ──────────────────────────────────
function aiChoice(c) {
  const t = TASKS[ti];
  const elapsed = ((Date.now() - ts) / 1000).toFixed(1);

  if (c === "none") {
    aiLevel = "none";
    addMsg("Understood — I'll let you work independently.");
    document.getElementById("bgrp").innerHTML = '<div class="bgrp-note">No AI help selected. Submit your answer when ready.</div>';
    document.getElementById("ai-pill").textContent = "Not used";
    log("ai_choice", "none score=0");
    return;
  }
  if (c === "hint1") {
    aiLevel = "hint1";
    addMsg(t.hint1 || "Think about the key concepts in the question. What information do you already have?");
    document.getElementById("ai-pill").textContent = "Concept hint";
    log("ai_choice", `hint1 at ${elapsed}s score=2`);
    document.getElementById("bgrp").innerHTML = `
      <div style="font-size:12px;color:#999;padding:2px 4px">Need more help?</div>
      <button class="ai-btn more" onclick="aiChoice('hint2')">📐 More hint — show the steps</button>
      <button class="ai-btn full" onclick="aiChoice('full')">✓ Full answer with reasoning</button>
      <button class="ai-btn btn-sec" onclick="closeAI()" style="font-size:12px">That's enough, thanks</button>`;
    return;
  }
  if (c === "hint2") {
    aiLevel = "hint2";
    addMsg(t.hint2 || "Break the problem into smaller parts. Try working through each piece of information one at a time.");
    document.getElementById("ai-pill").textContent = "Step hint";
    log("ai_choice", `hint2 at ${elapsed}s score=4`);
    document.getElementById("bgrp").innerHTML = `
      <button class="ai-btn full" onclick="aiChoice('full')">✓ Full answer with reasoning</button>
      <button class="ai-btn btn-sec" onclick="closeAI()" style="font-size:12px">That's enough, thanks</button>`;
    return;
  }
  if (c === "full") {
    aiLevel = "full";
    addMsg(t.full || "A complete answer would address all parts of the question systematically, providing evidence or reasoning for each point.");
    document.getElementById("ai-pill").textContent = "Full answer";
    log("ai_choice", `full at ${elapsed}s score=5`);
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

// ── SUBMIT ────────────────────────────────────
// ── COUNTERFACTUAL (control session only) ─────
function cfChoice(wouldUse, btnEl) {
  cfWouldUse = wouldUse;
  cfLevelChoice = wouldUse ? cfLevelChoice : "n/a";
  document.querySelectorAll("#cf-box .cf-row")[0].querySelectorAll(".cf-btn").forEach(b => b.classList.remove("sel"));
  btnEl.classList.add("sel");
  const sub = document.getElementById("cf-sub");
  if (wouldUse) { sub.classList.add("show"); }
  else { sub.classList.remove("show"); }
  log("counterfactual_choice", `would_use=${wouldUse}`);
}

function cfLevel(level, btnEl) {
  cfLevelChoice = level;
  document.getElementById("cf-sub").querySelectorAll(".cf-btn").forEach(b => b.classList.remove("sel"));
  btnEl.classList.add("sel");
  log("counterfactual_level", `level=${level}`);
}

function sub(to) {
  if (document.getElementById("subbtn").disabled && !to) return;

  // In control session, require a counterfactual choice before allowing submission
  if (isControlSession && cfWouldUse === null) {
    document.getElementById("cf-box").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  if (isControlSession && cfWouldUse === true && cfLevelChoice === null) {
    document.getElementById("cf-sub").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  document.getElementById("subbtn").disabled = true;

  const elapsed  = Math.round((Date.now() - ts) / 1000);
  const ans      = document.getElementById("ans").value.trim();
  const cf       = +document.getElementById("csl").value;
  const t        = TASKS[ti];
  const { v, l } = chk(ans);
  const isBlank  = !ans || ans.trim().length < 5;

  // Control session: no AI panel exists, so ai_score is null (not 0 — 0 implies AI was available but declined)
  const aiScore  = isControlSession ? null : AI_SCORES[aiLevel || "none"];
  const cogScore = isControlSession ? (isBlank ? 0 : 5) : (isBlank ? 0 : COG_MAP[aiScore]);

  results.push({
    task_id: t.id,
    task_type: t.type,
    diff: t.diff,
    elapsed_s: elapsed,
    answer: ans,
    answer_length: ans.length,
    verdict: v,
    confidence: cf,
    ai_level: isControlSession ? "n/a (control)" : (aiLevel || "none"),
    ai_score: aiScore,
    cog_score: cogScore,
    self_score: null,  // filled in overlay
    cf_would_use: isControlSession ? cfWouldUse : null,
    cf_level: isControlSession ? cfLevelChoice : null
  });

  log("task_submit", `elapsed=${elapsed}s ai=${aiScore} cog=${cogScore} ans_len=${ans.length} control=${isControlSession}`);

  // Show overlay with self-score — note: AI/cognitive usage scores are deliberately NOT shown to the
  // participant here to avoid a demand effect (participants moderating behavior because they know they're
  // being scored on reliance). Scores are still logged internally and appear only in the researcher's PDF.
  document.getElementById("ovt").textContent   = to ? "Time up" : "Task submitted";
  document.getElementById("ovy").textContent   = ans ? `Your answer (${ans.length} characters)` : "No answer entered.";
  document.getElementById("ovc2").textContent  = `Scoring guide (for your reference): ${t.scoring_guide}`;
  document.getElementById("ovsc").innerHTML    = "";

  if (isControlSession) {
    document.getElementById("ovs").innerHTML = `
      <div class="ostat">Time taken: <b>${elapsed}s</b></div>
      <div class="ostat">Confidence: <b>${cf}/7</b></div>`;
  } else {
    document.getElementById("ovs").innerHTML = `
      <div class="ostat">Time taken: <b>${elapsed}s</b></div>
      <div class="ostat">Confidence: <b>${cf}/7</b></div>`;
  }

  // Self-score buttons
  document.getElementById("self-score-area").innerHTML = `
    <div style="font-size:13px;font-weight:500;margin-bottom:8px">How well did you answer? (self-score)</div>
    <div style="display:flex;gap:8px">
      <button class="ss-btn" onclick="setSelfScore(0)">0 — Incorrect / blank</button>
      <button class="ss-btn" onclick="setSelfScore(1)">1 — Partial</button>
      <button class="ss-btn" onclick="setSelfScore(2)">2 — Complete</button>
    </div>
    <div style="font-size:12px;color:#999;margin-top:6px">Select a score to continue.</div>`;

  document.getElementById("ovnxt").style.display = "none";
  document.getElementById("ov").classList.add("on");
}

function setSelfScore(score) {
  // Save self score to last result
  results[results.length - 1].self_score = score;
  log("self_score", `task=${TASKS[ti].id} self=${score}`);

  // Highlight selected button
  document.querySelectorAll(".ss-btn").forEach(b => b.style.background = "");
  event.target.style.background = "#5b6af0";
  event.target.style.color = "#fff";

  // Show next button
  document.getElementById("ovnxt").style.display = "block";
  document.getElementById("ovnxt").textContent = ti + 1 < TASKS.length ? "Next task →" : "View session results";
}

function nxt() {
  // Require self-score before proceeding
  if (results[results.length - 1].self_score === null) {
    document.querySelector(".ss-btn")?.focus();
    return;
  }
  document.getElementById("ov").classList.remove("on");
  if (ti + 1 < TASKS.length) { load(ti + 1); } else { showDone(); }
}

// ── SESSION RESULTS ───────────────────────────
// Two versions are built deliberately:
//  - buildPdfHTML(): full detail including AI/cognitive scores — goes ONLY into the printed PDF
//  - buildParticipantSummHTML(): neutral on-screen confirmation — shown to the participant before printing
// This avoids revealing reliance scores on-screen, which could cause participants to alter behaviour
// in later sessions once they realise what is being measured (a demand-characteristics effect).
function buildPdfHTML() {
  const cogScores  = results.map(r => r.cog_score);
  const selfScores = results.map(r => r.self_score ?? 0);
  const cogPct     = pct(cogScores);
  const selfTotal  = selfScores.reduce((a, b) => a + b, 0);

  let h = `<b>Participant ID:</b> ${PID}<br>`;
  h += `<b>Session:</b> ${SESS} ${isControlSession ? "(control — no AI)" : ""} &nbsp;·&nbsp; <b>Date:</b> ${DATE}<br>`;
  h += `<b>Task set:</b> ${TASKS[0].id[0]}<br><br>`;

  results.forEach((r, i) => {
    h += `<b>Task ${i + 1} — ${r.task_type} (${r.diff}):</b><br>`;
    h += `&nbsp;&nbsp;Time required: ${r.elapsed_s}s<br>`;
    h += `&nbsp;&nbsp;Answer length: ${r.answer_length} characters<br>`;
    if (isControlSession) {
      h += `&nbsp;&nbsp;AI usage score: N/A (no AI available this session)<br>`;
      h += `&nbsp;&nbsp;Would have used AI: ${r.cf_would_use ? "Yes (" + (r.cf_level || "n/a") + ")" : "No"}<br>`;
    } else {
      h += `&nbsp;&nbsp;AI usage score: ${r.ai_score} / 5<br>`;
    }
    h += `&nbsp;&nbsp;Cognitive usage score: ${r.cog_score} / 5<br>`;
    h += `&nbsp;&nbsp;Participant self-score: ${r.self_score} / 2<br>`;
    h += `&nbsp;&nbsp;Researcher score: ___ / 2 &nbsp;(to be filled by researcher)<br>`;
    h += `&nbsp;&nbsp;Confidence: ${r.confidence} / 7<br><br>`;
  });

  if (!isControlSession) {
    const aiPct = pct(results.map(r => r.ai_score));
    h += `<b>AI usage — whole session:</b> ${aiPct}%<br>`;
  }
  h += `<b>Cognitive usage — whole session:</b> ${cogPct}%<br>`;
  h += `<b>Total self-score:</b> ${selfTotal} / ${results.length * 2}<br>`;
  h += `<b>Total researcher score:</b> ___ / ${results.length * 2} &nbsp;(to be filled)`;
  return h;
}

function buildParticipantSummHTML() {
  const selfScores = results.map(r => r.self_score ?? 0);
  const selfTotal  = selfScores.reduce((a, b) => a + b, 0);
  const totalTime  = results.reduce((a, r) => a + r.elapsed_s, 0);

  let h = `<b>Participant ID:</b> ${PID}<br>`;
  h += `<b>Session:</b> ${SESS} &nbsp;·&nbsp; <b>Date:</b> ${DATE}<br><br>`;
  h += `<b>Tasks completed:</b> ${results.length} / ${results.length}<br>`;
  h += `<b>Total time:</b> ${totalTime}s<br>`;
  h += `<b>Your self-assessed score:</b> ${selfTotal} / ${results.length * 2}<br><br>`;
  h += `Thank you for completing this session. Your detailed responses have been recorded for the researcher's review.`;
  return h;
}

function showDone() {
  document.getElementById("summbox").innerHTML = buildParticipantSummHTML();
  document.getElementById("pdf-name-hint").textContent =
    `When saving PDF, name the file: assessment_${PID}_session${SESS}`;
  show("s-done");
}

// ── PRINT ─────────────────────────────────────
function showPrint() {
  document.getElementById("print-content").innerHTML = buildPdfHTML().replace(/&nbsp;/g, " ");
  document.getElementById("print-footer").textContent =
    `Generated: ${new Date().toLocaleString()} · Please email this PDF to the researcher.`;
  document.getElementById("print-overlay").style.display = "block";
  const origTitle = document.title;
  document.title = `assessment_${PID}_session${SESS}`;
  setTimeout(() => {
    window.print();
    setTimeout(() => { document.title = origTitle; }, 2000);
  }, 400);
}

function closePrint() {
  document.getElementById("print-overlay").style.display = "none";
}

// ── EVENT LOG ─────────────────────────────────
function log(type, detail) {
  const elapsed = ts ? ((Date.now() - ts) / 1000).toFixed(1) : "0.0";
  const tb  = document.getElementById("logb");
  const row = tb.insertRow(0);
  row.innerHTML = `<td>${elapsed}s</td><td>${type}</td><td>${detail}</td>`;
}
