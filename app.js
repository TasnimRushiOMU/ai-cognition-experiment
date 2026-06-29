// ─────────────────────────────────────────────
// APP LOGIC
// ─────────────────────────────────────────────

const AI_SCORES = { none: 0, hint1: 2, hint2: 4, full: 5 };
const COG_MAP   = { 0: 5, 2: 3, 4: 1, 5: 0 };

let PID = "", SESS = "1";
let ti = 0, ts = null, sl = 180, tmrI = null;
let aiLevel = null, results = [];
const DATE = new Date().toLocaleDateString("en-GB");

function chk(task, ans) {
  if (task.type === "open") return { v: "open", l: "Open-ended — researcher scores manually" };
  if (!ans) return { v: "incorrect", l: "Incorrect ✗" };
  const clean = ans.replace(/[^0-9]/g, "");
  const ok = task.ok.some(x => clean === x.replace(/[^0-9]/g, ""));
  return { v: ok ? "correct" : "incorrect", l: ok ? "Correct ✓" : "Incorrect ✗" };
}

function pct(scores) {
  return Math.round((scores.reduce((a, b) => a + b, 0) * 100 / 5) / scores.length);
}

function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("on"));
  document.getElementById(id).classList.add("on");
}

function startExp() {
  const p = document.getElementById("pid-input").value.trim();
  const s = document.getElementById("sess-input").value.trim() || "1";
  if (!p) { document.getElementById("pid-err").style.display = "block"; return; }
  document.getElementById("pid-err").style.display = "none";
  PID = p; SESS = s; results = []; ti = 0;
  document.getElementById("pid-lbl").textContent  = PID;
  document.getElementById("sess-lbl").textContent = SESS;
  document.getElementById("date-lbl").textContent = DATE;
  show("s-exp");
  load(0);
}

function goEntry() { show("s-entry"); }

function load(i) {
  ti = i; aiLevel = null; ts = Date.now(); sl = 180;
  const t = TASKS[i];
  document.getElementById("tnum").textContent     = `Task ${i + 1} of ${TASKS.length}`;
  document.getElementById("qbox").textContent     = t.q;
  document.getElementById("ans-hint").textContent = t.ans_hint || "";
  const db = document.getElementById("diff");
  db.textContent = t.diff.charAt(0).toUpperCase() + t.diff.slice(1);
  db.className   = "diff " + t.diff;
  document.getElementById("ans").value            = "";
  document.getElementById("csl").value            = 4;
  document.getElementById("cv").textContent       = "4";
  document.getElementById("ai-score-lbl").textContent = "AI usage: 0/5";
  document.getElementById("ai-pill").textContent  = "Not used";
  document.getElementById("msgs").innerHTML       = '<div class="m sys">Hello! How can I help today?<br><br>Choose an option below.</div>';
  resetBgrp();
  document.getElementById("subbtn").disabled = false;
  clearInterval(tmrI); tick0();
  tmrI = setInterval(tick, 1000);
  log("task_start", `${t.id} diff=${t.diff}`);
}

function resetBgrp() {
  document.getElementById("bgrp").innerHTML = `
    <button class="ai-btn hint" onclick="aiChoice('hint1')">💡 Hint — explain the concept</button>
    <button class="ai-btn full" onclick="aiChoice('full')">✓ Full answer with reasoning</button>
    <button class="ai-btn btn-sec" onclick="aiChoice('none')" style="font-size:12px">I don't need help</button>`;
}

function tick() {
  sl--;
  tick0();
  if (sl <= 0) { clearInterval(tmrI); log("time_up", TASKS[ti].id); sub(true); }
}
function tick0() {
  const m = Math.floor(sl / 60), s = sl % 60;
  const el = document.getElementById("tmr");
  el.textContent = `${m}:${s.toString().padStart(2, "0")}`;
  el.className = "tmr" + (sl < 30 ? " urg" : "");
}

function aiChoice(c) {
  const t = TASKS[ti];
  const elapsed = ((Date.now() - ts) / 1000).toFixed(1);
  if (c === "none") {
    aiLevel = "none";
    addMsg("Understood — I'll let you work independently.");
    document.getElementById("bgrp").innerHTML = '<div class="bgrp-note">No AI help selected. Submit your answer when ready.</div>';
    document.getElementById("ai-pill").textContent = "Not used";
    document.getElementById("ai-score-lbl").textContent = "AI usage: 0/5";
    log("ai_choice", "none score=0");
    return;
  }
  if (c === "hint1") {
    aiLevel = "hint1";
    addMsg(t.hint1);
    document.getElementById("ai-pill").textContent = "Concept hint";
    document.getElementById("ai-score-lbl").textContent = "AI usage: 2/5";
    log("ai_choice", `hint1 at ${elapsed}s score=2`);
    document.getElementById("bgrp").innerHTML = `
      <div style="font-size:12px;color:#999;padding:2px 4px">Need more help?</div>
      <button class="ai-btn more" onclick="aiChoice('hint2')">📐 More hint — show the equation</button>
      <button class="ai-btn full" onclick="aiChoice('full')">✓ Full answer with reasoning</button>
      <button class="ai-btn btn-sec" onclick="closeAI()" style="font-size:12px">That's enough, thanks</button>`;
    return;
  }
  if (c === "hint2") {
    aiLevel = "hint2";
    addMsg(t.hint2);
    document.getElementById("ai-pill").textContent = "Equation hint";
    document.getElementById("ai-score-lbl").textContent = "AI usage: 4/5";
    log("ai_choice", `hint2 at ${elapsed}s score=4`);
    document.getElementById("bgrp").innerHTML = `
      <button class="ai-btn full" onclick="aiChoice('full')">✓ Full answer with reasoning</button>
      <button class="ai-btn btn-sec" onclick="closeAI()" style="font-size:12px">That's enough, thanks</button>`;
    return;
  }
  if (c === "full") {
    aiLevel = "full";
    addMsg(t.full);
    document.getElementById("ai-pill").textContent = "Full answer";
    document.getElementById("ai-score-lbl").textContent = "AI usage: 5/5";
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

function sub(to) {
  if (document.getElementById("subbtn").disabled && !to) return;
  document.getElementById("subbtn").disabled = true;
  clearInterval(tmrI);
  const elapsed  = 180 - sl;
  const ans      = document.getElementById("ans").value.trim();
  const cf       = +document.getElementById("csl").value;
  const t        = TASKS[ti];
  const { v, l } = chk(t, ans);
  const aiScore  = AI_SCORES[aiLevel || "none"];
  const cogScore = COG_MAP[aiScore];
  results.push({ task_id: t.id, diff: t.diff, elapsed_s: elapsed, answer: ans, verdict: v, confidence: cf, ai_level: aiLevel || "none", ai_score: aiScore, cog_score: cogScore });
  log("task_submit", `elapsed=${elapsed}s verdict=${v} ai=${aiScore} cog=${cogScore}`);
  document.getElementById("ovt").textContent = to ? "Time up" : "Task submitted";
  const re = document.getElementById("ovr");
  re.textContent = l; re.className = "res " + v;
  document.getElementById("ovy").innerHTML  = ans ? `<b>Your answer:</b> "${ans.slice(0, 110)}"` : "<b>No answer entered.</b>";
  document.getElementById("ovc2").innerHTML = v !== "open" ? `<b>Correct answer:</b> ${t.expl}` : `<b>Note:</b> ${t.expl}`;
  document.getElementById("ovsc").innerHTML = `
    <div class="sc-card"><div class="sl">AI usage</div><div class="sv">${aiScore}/5</div></div>
    <div class="sc-card"><div class="sl">Cognitive usage</div><div class="sv">${cogScore}/5</div></div>`;
  document.getElementById("ovs").innerHTML = `
    <div class="ostat">Time taken: <b>${elapsed}s</b></div>
    <div class="ostat">AI help level: <b>${aiLevel || "none"}</b></div>
    <div class="ostat">Confidence: <b>${cf}/7</b></div>`;
  document.getElementById("ovnxt").textContent = ti + 1 < TASKS.length ? "Next task →" : "View session results";
  document.getElementById("ov").classList.add("on");
}

function nxt() {
  document.getElementById("ov").classList.remove("on");
  if (ti + 1 < TASKS.length) { load(ti + 1); } else { showDone(); }
}

function buildSummHTML() {
  const aiScores  = results.map(r => r.ai_score);
  const cogScores = results.map(r => r.cog_score);
  const aiPct     = pct(aiScores);
  const cogPct    = pct(cogScores);
  const exact     = results.filter(r => r.verdict !== "open");
  const correct   = exact.filter(r => r.verdict === "correct").length;
  let h = `<b>Participant ID:</b> ${PID}<br>`;
  h += `<b>Session:</b> ${SESS} &nbsp;·&nbsp; <b>Date:</b> ${DATE}<br>`;
  h += `<b>Number of correct answers:</b> ${correct} / ${exact.length}<br><br>`;
  results.forEach((r, i) => {
    h += `<b>Task ${i + 1} (${r.diff}):</b><br>`;
    h += `&nbsp;&nbsp;Time required: ${r.elapsed_s}s<br>`;
    h += `&nbsp;&nbsp;AI usage score: ${r.ai_score} / 5<br>`;
    h += `&nbsp;&nbsp;Cognitive usage score: ${r.cog_score} / 5<br>`;
    h += `&nbsp;&nbsp;Verdict: ${r.verdict}<br><br>`;
  });
  h += `<b>AI usage (whole session):</b> ${aiPct}%<br>`;
  h += `<b>Cognitive usage (whole session):</b> ${cogPct}%`;
  return h;
}

function showDone() {
  clearInterval(tmrI);
  document.getElementById("summbox").innerHTML = buildSummHTML();
  show("s-done");
}

function showPrint() {
  document.getElementById("print-content").innerHTML = buildSummHTML().replace(/&nbsp;/g, " ");
  document.getElementById("print-footer").textContent = `Generated: ${new Date().toLocaleString()} · Please email this PDF to the researcher.`;
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

function log(type, detail) {
  const elapsed = ts ? ((Date.now() - ts) / 1000).toFixed(1) : "0.0";
  const tb  = document.getElementById("logb");
  const row = tb.insertRow(0);
  row.innerHTML = `<td>${elapsed}s</td><td>${type}</td><td>${detail}</td>`;
}
