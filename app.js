// ─────────────────────────────────────────────────────────────────────────────
// APP LOGIC — AI Cognition Experiment (Bilingual EN/JP)
// ─────────────────────────────────────────────────────────────────────────────

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbyf--Tia_SrRr-HXcMxNSuaf-UA2vnjmHmhziQLbsIiFK3KP_bfJsLtjH6ZCyqv0pzBeA/exec";

// AI RELIANCE: 0=no help, 1=concept hint, 2=step hint, 3=full answer
const AI_SCORES = { none: 0, hint1: 1, hint2: 2, full: 3 };

// ── UI STRINGS ────────────────────────────────────────────────────────────────
const UI = {
  en: {
    confLabels:    ["", "Very unconfident", "Unconfident", "Neutral", "Confident", "Very confident"],
    confQuestion:  "How confident are you in your answer?",
    submitBtn:     "Submit answer",
    aiLabel:       "AI assistant",
    aiSub:         "Choose how much help you want",
    aiNotUsed:     "Not used",
    aiUnavail:     "Unavailable",
    aiNoHelp:      "No AI help available in this session.",
    aiNoHelpSel:   "No AI help selected. Submit your answer when ready.",
    aiDone:        "AI help complete. Submit when ready.",
    aiFullDone:    "Full answer provided. Submit when ready.",
    aiBtn1:        "💡 Hint — explain the concept",
    aiBtn2:        "✓ Full answer with reasoning",
    aiBtn3:        "I don't need help",
    aiMoreHelp:    "Need more help?",
    aiBtn4:        "📐 More hint — show the steps",
    aiBtn5:        "That's enough, thanks",
    aiGreet:       "Hello! How can I help today?\n\nChoose an option below.",
    aiUnavailMsg:  "AI assistance is not available in this session.\n\nPlease complete the task using your own reasoning.",
    cfQ1:          "If AI assistance had been available right now, would you have used it for this task?",
    cfNo:          "No — I would have solved it myself",
    cfYes:         "Yes — I would have used it",
    cfQ2:          "Which level would you have chosen?",
    cfHint1:       "💡 Concept hint",
    cfHint2:       "📐 Step-by-step hint",
    cfFull:        "✓ Full answer",
    ovYourAnswer:  "Your answer",
    ovScoreQ:      "How well did you answer this task?",
    ovScore0:      "0 — Incorrect or blank",
    ovScore1:      "1 — Partially correct",
    ovScore2:      "2 — Fully correct",
    ovSelectScore: "Select a score to continue.",
    ovNextTask:    "Next task →",
    ovViewResults: "View session results",
    ovTimeUp:      "Time up",
    ovSubmitted:   "Task submitted",
    ovScoringGuide:"Scoring guide: ",
    ovTimeTaken:   "Time taken",
    ovConfidence:  "Confidence",
    ovWouldUseAI:  "Would have used AI",
    doneTitle:     "Session complete",
    doneMsg:       "Your responses have been saved. Please also download the CSV backup and email it to the researcher.",
    doneCsvHint:   "CSV filename: ",
    doneDownload:  "⬇ Download CSV backup",
    doneNew:       "New participant",
    taskOf:        (i, n) => `Task ${i} of ${n}`,
    badgeAI:       "AI available",
    badgeControl:  "Control session — no AI",
    syncLabel:     "sync",
    phaseBadge:    "AI available",
  },
  jp: {
    confLabels:    ["", "全く自信がない", "自信がない", "どちらでもない", "自信がある", "非常に自信がある"],
    confQuestion:  "答えにどの程度自信がありますか？",
    submitBtn:     "回答を提出する",
    aiLabel:       "AIアシスタント",
    aiSub:         "どのくらいのサポートが必要ですか？",
    aiNotUsed:     "未使用",
    aiUnavail:     "利用不可",
    aiNoHelp:      "このセッションではAIは利用できません。",
    aiNoHelpSel:   "AIのサポートなしを選択しました。準備ができたら回答を提出してください。",
    aiDone:        "AIのサポートが完了しました。準備ができたら提出してください。",
    aiFullDone:    "完全な回答が提供されました。準備ができたら提出してください。",
    aiBtn1:        "💡 ヒント — 概念を説明する",
    aiBtn2:        "✓ 推論付きの完全な回答",
    aiBtn3:        "サポートは不要です",
    aiMoreHelp:    "さらにサポートが必要ですか？",
    aiBtn4:        "📐 追加ヒント — 手順を示す",
    aiBtn5:        "これで十分です、ありがとう",
    aiGreet:       "こんにちは！どのようにお手伝いできますか？\n\n以下のオプションを選択してください。",
    aiUnavailMsg:  "このセッションではAIは利用できません。\n\n自分自身の推論でタスクを完了してください。",
    cfQ1:          "もし今AIが利用可能だったとしたら、このタスクに使用しましたか？",
    cfNo:          "いいえ — 自分で解決していた",
    cfYes:         "はい — 使用していた",
    cfQ2:          "どのレベルを選んでいましたか？",
    cfHint1:       "💡 概念のヒント",
    cfHint2:       "📐 ステップごとのヒント",
    cfFull:        "✓ 完全な回答",
    ovYourAnswer:  "あなたの回答",
    ovScoreQ:      "このタスクにどの程度答えられましたか？",
    ovScore0:      "0 — 不正解または未記入",
    ovScore1:      "1 — 部分的に正解",
    ovScore2:      "2 — 完全に正解",
    ovSelectScore: "スコアを選択して続けてください。",
    ovNextTask:    "次のタスク →",
    ovViewResults: "セッション結果を見る",
    ovTimeUp:      "時間切れ",
    ovSubmitted:   "タスク提出済み",
    ovScoringGuide:"採点基準：",
    ovTimeTaken:   "所要時間",
    ovConfidence:  "自信度",
    ovWouldUseAI:  "AIを使用していたか",
    doneTitle:     "セッション完了",
    doneMsg:       "回答が保存されました。CSVバックアップをダウンロードして研究者にメールで送付してください。",
    doneCsvHint:   "CSVファイル名：",
    doneDownload:  "⬇ CSVバックアップをダウンロード",
    doneNew:       "新しい参加者",
    taskOf:        (i, n) => `タスク ${i} / ${n}`,
    badgeAI:       "AI利用可能",
    badgeControl:  "コントロールセッション — AIなし",
    syncLabel:     "同期",
    phaseBadge:    "AI利用可能",
  }
};

// ── STATE ─────────────────────────────────────────────────────────────────────
let PID = "", SESS = "1", LANG = "en";
let ti = 0, ts = null, taskStartTs = null;
let aiLevel = null, firstHintLatency = null;
let results = [], eventLog = [];
let TASKS = [];
let isControlSession = false;
let cfWouldUse = null, cfLevelChoice = null;
const DATE = new Date().toLocaleDateString("en-GB");

function t(key, ...args) {
  const val = UI[LANG][key];
  return typeof val === "function" ? val(...args) : (val ?? UI["en"][key]);
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function getConf() {
  const checked = document.querySelector('input[name="conf"]:checked');
  return checked ? +checked.value : 3;
}
function resetConf() {
  document.getElementById("c3").checked = true;
}
function setLang(lang) {
  LANG = lang;
  document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("sel"));
  document.getElementById("lang-" + lang).classList.add("sel");
  applyLangToUI();
}
function applyLangToUI() {
  // Entry screen
  const confQ = document.querySelector(".conf-label");
  if (confQ) confQ.textContent = t("confQuestion");
  const submitBtn = document.getElementById("subbtn");
  if (submitBtn) submitBtn.textContent = t("submitBtn");
  // Confidence option labels
  const confOpts = [
    ["c1","1"],["c2","2"],["c3","3"],["c4","4"],["c5","5"]
  ];
  confOpts.forEach(([id, val]) => {
    const lbl = document.querySelector(`label[for="${id}"]`);
    if (lbl) lbl.textContent = t("confLabels")[+val];
  });
  // Done screen
  const doneTitle = document.querySelector(".done h2");
  if (doneTitle) doneTitle.textContent = t("doneTitle");
  const doneMsg = document.querySelector(".done > p");
  if (doneMsg) doneMsg.textContent = t("doneMsg");
  const dlBtn = document.querySelector(".done .btn");
  if (dlBtn) dlBtn.textContent = t("doneDownload");
  const newBtn = document.querySelector(".done .btn-sec");
  if (newBtn) newBtn.textContent = t("doneNew");
  // Sync label
  const syncLbl = document.querySelector(".top span:last-child");
  if (syncLbl) syncLbl.firstChild.textContent = t("syncLabel") + " ";
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
  TASKS = getTaskSet(PID, sNum, LANG);

  document.getElementById("pid-lbl").textContent  = PID;
  document.getElementById("sess-lbl").textContent = SESS;
  document.getElementById("date-lbl").textContent = DATE;

  const badge = document.getElementById("phase-badge");
  if (isControlSession) {
    badge.textContent = t("badgeControl");
    badge.classList.add("control");
  } else {
    badge.textContent = t("badgeAI");
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

  document.getElementById("ai-pill").textContent = t("aiNotUsed");

  if (isControlSession) {
    document.getElementById("ai-pill").textContent = t("aiUnavail");
    document.getElementById("msgs").innerHTML = `<div class="m sys">${t("aiUnavailMsg")}</div>`;
    document.getElementById("bgrp").innerHTML = `<div class="bgrp-note">${t("aiNoHelp")}</div>`;
    document.getElementById("cf-box").style.display = "block";
    document.getElementById("cf-sub").classList.remove("show");
    document.querySelectorAll(".cf-btn").forEach(b => b.classList.remove("sel"));
    // Update counterfactual labels
    document.getElementById("cf-q1").textContent = t("cfQ1");
    document.getElementById("cf-no-btn").textContent  = t("cfNo");
    document.getElementById("cf-yes-btn").textContent = t("cfYes");
    document.getElementById("cf-q2").textContent = t("cfQ2");
    document.getElementById("cf-h1-btn").textContent  = t("cfHint1");
    document.getElementById("cf-h2-btn").textContent  = t("cfHint2");
    document.getElementById("cf-f-btn").textContent   = t("cfFull");
  } else {
    document.getElementById("msgs").innerHTML = `<div class="m sys">${t("aiGreet")}</div>`;
    resetBgrp();
    document.getElementById("cf-box").style.display = "none";
  }

  // Update confidence question label
  document.querySelector(".conf-label").textContent = t("confQuestion");
  const confOpts = [["c1","1"],["c2","2"],["c3","3"],["c4","4"],["c5","5"]];
  confOpts.forEach(([id, val]) => {
    const lbl = document.querySelector(`label[for="${id}"]`);
    if (lbl) lbl.textContent = t("confLabels")[+val];
  });
  document.getElementById("subbtn").textContent = t("submitBtn");

  document.getElementById("subbtn").disabled = false;
  logEv("task_start", `${t.id} diff=${t.diff}`);
}

function resetBgrp() {
  document.getElementById("bgrp").innerHTML = `
    <button class="ai-btn hint" onclick="aiChoice('hint1')">${t("aiBtn1")}</button>
    <button class="ai-btn full" onclick="aiChoice('full')">${t("aiBtn2")}</button>
    <button class="ai-btn btn-sec" onclick="aiChoice('none')" style="font-size:12px">${t("aiBtn3")}</button>`;
}

// ── AI PANEL ──────────────────────────────────────────────────────────────────
function aiChoice(c) {
  const tr = TASKS[ti];
  const elapsed = ((Date.now()-taskStartTs)/1000).toFixed(1);

  // Record first-hint latency
  if (c !== "none" && firstHintLatency === null) {
    firstHintLatency = +elapsed;
    logEv("first_ai_request", `latency=${elapsed}s type=${c}`);
  }

  if (c === "none") {
    aiLevel = "none";
    addMsg(t("aiNoHelpSel"));
    document.getElementById("bgrp").innerHTML = `<div class="bgrp-note">${t("aiNoHelpSel")}</div>`;
    document.getElementById("ai-pill").textContent = t("aiNotUsed");
    logEv("ai_choice", `none at ${elapsed}s reliance=0`);
    return;
  }
  if (c === "hint1") {
    aiLevel = "hint1";
    addMsg(tr.hint1 || "Think about the key concepts in the question.");
    document.getElementById("ai-pill").textContent = LANG === "jp" ? "概念ヒント" : "Concept hint";
    logEv("ai_choice", `hint1 at ${elapsed}s reliance=1`);
    document.getElementById("bgrp").innerHTML = `
      <div style="font-size:12px;color:#999;padding:2px 4px">${t("aiMoreHelp")}</div>
      <button class="ai-btn more" onclick="aiChoice('hint2')">${t("aiBtn4")}</button>
      <button class="ai-btn full" onclick="aiChoice('full')">${t("aiBtn2")}</button>
      <button class="ai-btn btn-sec" onclick="closeAI()" style="font-size:12px">${t("aiBtn5")}</button>`;
    return;
  }
  if (c === "hint2") {
    aiLevel = "hint2";
    addMsg(tr.hint2 || "Break the problem into smaller parts.");
    document.getElementById("ai-pill").textContent = LANG === "jp" ? "手順ヒント" : "Step hint";
    logEv("ai_choice", `hint2 at ${elapsed}s reliance=2`);
    document.getElementById("bgrp").innerHTML = `
      <button class="ai-btn full" onclick="aiChoice('full')">${t("aiBtn2")}</button>
      <button class="ai-btn btn-sec" onclick="closeAI()" style="font-size:12px">${t("aiBtn5")}</button>`;
    return;
  }
  if (c === "full") {
    aiLevel = "full";
    addMsg(tr.full || "A complete answer would address all parts systematically.");
    document.getElementById("ai-pill").textContent = LANG === "jp" ? "完全な回答" : "Full answer";
    logEv("ai_choice", `full at ${elapsed}s reliance=3`);
    document.getElementById("bgrp").innerHTML = `<div class="bgrp-note">${t("aiFullDone")}</div>`;
  }
}

function closeAI() {
  document.getElementById("bgrp").innerHTML = `<div class="bgrp-note">${t("aiDone")}</div>`;
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
  const confLabel = t("confLabels")[conf];
  const tr       = TASKS[ti];
  const aiScore  = isControlSession ? null : AI_SCORES[aiLevel || "none"];
  const isBlank  = !ans || ans.trim().length < 5;

  logEv("task_submit", `elapsed=${elapsed}s ai_reliance=${aiScore} conf=${conf} blank=${isBlank} first_hint_lat=${firstHintLatency}`);

  const result = {
    task_num:          ti+1,
    task_id:           tr.id,
    task_type:         tr.type,
    diff:              tr.diff,
    elapsed_s:         elapsed,
    answer:            ans,
    answer_len:        ans.length,
    ai_level:          isControlSession ? "n/a" : (aiLevel || "none"),
    ai_reliance:       aiScore,
    first_hint_lat_s:  firstHintLatency,
    confidence:        conf,
    confidence_label:  confLabel,
    self_score:        null,
    cf_would_use:      isControlSession ? cfWouldUse : null,
    cf_level:          isControlSession ? cfLevelChoice : null,
    language:          LANG,
  };

  results.push(result);
  writeTaskToSheets(result);

  // ── OVERLAY ──
  document.getElementById("ovt").textContent  = t(isControlSession && firstHintLatency === null ? "ovSubmitted" : "ovSubmitted");
  document.getElementById("ovt").textContent  = t(to ? "ovTimeUp" : "ovSubmitted");
  document.getElementById("ov-ans-label").textContent = t("ovYourAnswer");
  document.getElementById("ov-ans-box").textContent   = ans || "(no answer entered)";
  document.getElementById("ovc2").textContent = t("ovScoringGuide") + tr.scoring_guide;
  document.getElementById("ovs").innerHTML = `
    <div class="ostat">${t("ovTimeTaken")}: <b>${elapsed}s</b></div>
    <div class="ostat">${t("ovConfidence")}: <b>${confLabel}</b></div>
    ${isControlSession ? `<div class="ostat">${t("ovWouldUseAI")}: <b>${cfWouldUse ? "Yes ("+cfLevelChoice+")" : "No"}</b></div>` : ""}`;

  document.getElementById("self-score-area").innerHTML = `
    <div class="self-score-wrap">
      <div class="qlbl">${t("ovScoreQ")}</div>
      <div class="ss-row">
        <button class="ss-btn" onclick="setSelfScore(0,this)">${t("ovScore0")}</button>
        <button class="ss-btn" onclick="setSelfScore(1,this)">${t("ovScore1")}</button>
        <button class="ss-btn" onclick="setSelfScore(2,this)">${t("ovScore2")}</button>
      </div>
      <div style="font-size:12px;color:#999">${t("ovSelectScore")}</div>
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
  document.getElementById("ovnxt").textContent = ti+1 < TASKS.length ? t("ovNextTask") : t("ovViewResults");
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
  h += LANG === "jp"
    ? "詳細な回答が保存されました。研究者が後ほど確認します。"
    : "Your detailed responses have been saved. The researcher will review them separately.";
  return h;
}

function buildCSV() {
  const headers = [
    "pid","session","date","language","task_num","task_id","task_type","difficulty",
    "elapsed_s","answer","answer_len",
    "ai_level","ai_reliance_0to3","first_hint_latency_s",
    "confidence_1to5","confidence_label",
    "self_score_0to2","researcher_score_0to2",
    "cf_would_use_AI","cf_level","is_control_session"
  ];
  const rows = results.map(r => [
    PID, SESS, DATE, LANG,
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
  document.getElementById("pdf-name-hint").textContent = t("doneCsvHint") + `assessment_${PID}_session${SESS}.csv`;
  const doneTitle = document.querySelector(".done h2");
  if (doneTitle) doneTitle.textContent = t("doneTitle");
  const doneP = document.querySelector(".done > p:first-of-type");
  if (doneP) doneP.textContent = t("doneMsg");
  const dlBtn = document.querySelector(".done .btn");
  if (dlBtn) dlBtn.textContent = t("doneDownload");
  const newBtn = document.querySelector(".done .btn-sec");
  if (newBtn) newBtn.textContent = t("doneNew");
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
