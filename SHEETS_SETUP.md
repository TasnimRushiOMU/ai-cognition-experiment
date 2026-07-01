# Google Sheets Setup

---

## Step 1 — Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → New spreadsheet
2. Name it: `AI Cognition Experiment Data`

3. **Sheet1** — add these headers in Row 1:
```
pid	session	date	task_num	task_id	task_type	difficulty	elapsed_s	answer	answer_len	ai_level	ai_reliance_0to3	first_hint_latency_s	confidence_1to5	confidence_label	self_score_0to2	researcher_score_0to2	cf_would_use_AI	cf_level	is_control_session
```

4. Create a second sheet tab named exactly: **EventLog**
   Add these headers in Row 1:
```
pid	session	task_num	time_s	event_type	detail
```

---

## Step 2 — Replace Apps Script code

Extensions → Apps Script → delete all → paste this → Save:

```javascript
function doPost(e) {
  try {
    const ss      = SpreadsheetApp.getActiveSpreadsheet();
    const sheet   = ss.getSheetByName("Sheet1");
    const evSheet = ss.getSheetByName("EventLog");
    const data    = JSON.parse(e.postData.contents);
    const type    = data.type;

    // ── Per-task row written immediately on task submission ──
    if (type === "task_row") {
      const r      = data.result;
      const isCtrl = data.is_control ? "yes" : "no";
      sheet.appendRow([
        data.pid, data.session, data.date,
        r.task_num, r.task_id, r.task_type, r.diff,
        r.elapsed_s,
        r.answer, r.answer_len,
        r.ai_level,
        r.ai_reliance != null ? r.ai_reliance : "N/A",
        r.first_hint_lat_s != null ? r.first_hint_lat_s : "N/A",
        r.confidence, r.confidence_label,
        "",   // self_score — filled by next write
        "",   // researcher_score — filled by researcher
        r.cf_would_use != null ? r.cf_would_use : "",
        r.cf_level != null ? r.cf_level : "",
        isCtrl
      ]);
    }

    // ── Self-score update — find the matching row and update column 16 ──
    else if (type === "self_score_update") {
      const rows    = sheet.getDataRange().getValues();
      const pid     = data.pid;
      const session = String(data.session);
      const taskNum = data.task_num;
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === pid &&
            String(rows[i][1]) === session &&
            Number(rows[i][3]) === taskNum) {
          sheet.getRange(i+1, 16).setValue(data.self_score); // column 16 = self_score
          break;
        }
      }
    }

    // ── Event log written at session end ──
    else if (type === "event_log") {
      (data.event_log || []).forEach(ev => {
        evSheet.appendRow([
          data.pid, data.session,
          ev.task, ev.ts, ev.type,
          ev.detail || ""
        ]);
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## Step 3 — Redeploy (required every time you change the script)

Deploy → Manage deployments → Edit (pencil) → Version: **New version** → Deploy

> URL stays the same. No need to update app.js.

---

## Column reference

| Column | Variable | Notes |
|--------|----------|-------|
| A | pid | Participant ID |
| B | session | 1–4 |
| C | date | DD/MM/YYYY |
| D | task_num | 1–3 |
| E | task_id | e.g. A1, B2 |
| F | task_type | Reading / Logical / Decision |
| G | difficulty | easy / medium / hard |
| H | elapsed_s | Time taken in seconds |
| I | answer | Full text of participant's answer |
| J | answer_len | Character count |
| K | ai_level | none / hint1 / hint2 / full / n/a |
| L | ai_reliance_0to3 | 0=none 1=hint 2=step 3=full; N/A in control |
| M | first_hint_latency_s | Seconds from task start to first AI request |
| N | confidence_1to5 | 1=Very unconfident … 5=Very confident |
| O | confidence_label | Text label |
| P | self_score_0to2 | Participant's self-assessment |
| Q | researcher_score_0to2 | **Fill this in manually** after reviewing answers |
| R | cf_would_use_AI | Session 4 only: true/false |
| S | cf_level | Session 4 only: hint1/hint2/full/n/a |
| T | is_control_session | yes/no |

---

## Researcher score (column Q)

After each session CSV/Sheet arrives:
- Read column I (answer) for each task
- Fill column Q with 0 / 1 / 2 using rubric from the report
- Gap between column P and Q = metacognitive accuracy index

---

## Key analysis variables

- **RQ1:** `ai_reliance_0to3` × `difficulty` — does reliance scale with difficulty?
- **RQ2:** `ai_reliance_0to3` × `researcher_score_0to2` — does reliance predict quality?
- **RQ3:** Compare `researcher_score` across sessions 1-3 vs session 4
- **Latency:** `first_hint_latency_s` — did participant try before asking for help?
- **Metacognition:** `self_score` − `researcher_score` — overconfidence index
- **Confidence × reliance:** `confidence_1to5` × `ai_reliance_0to3` — do high-reliance users stay overconfident?
