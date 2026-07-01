# Google Sheets Setup — One-time, ~5 minutes

This connects your experiment to a Google Sheet so data is saved automatically
in the background when each participant finishes a session. No login required
for participants — they never see the Sheet.

---

## Step 1 — Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → New spreadsheet
2. Name it: `AI Cognition Experiment Data`
3. Add these headers in Row 1 (copy-paste the whole line):

```
pid	session	date	task_num	task_id	task_type	difficulty	elapsed_s	answer	answer_len	ai_level	ai_reliance_0to3	confidence_1to5	self_score_0to2	researcher_score	cf_would_use	cf_level	is_control
```

---

## Step 2 — Create an Apps Script Web App

1. In your Sheet → **Extensions → Apps Script**
2. Delete the default code. Paste this:

```javascript
function doPost(e) {
  try {
    const data    = JSON.parse(e.postData.contents);
    const sheet   = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    const pid     = data.pid;
    const session = data.session;
    const date    = data.date;
    const isCtrl  = data.is_control ? "yes" : "no";

    // Write one row per task result
    data.results.forEach(r => {
      sheet.appendRow([
        pid, session, date,
        r.task_num, r.task_id, r.task_type, r.diff,
        r.elapsed_s,
        r.answer, r.answer_len,
        r.ai_level, r.ai_reliance ?? "N/A",
        r.confidence, r.self_score ?? "",
        "",                      // researcher_score — blank, filled by you
        r.cf_would_use ?? "", r.cf_level ?? "",
        isCtrl
      ]);
    });

    // Write event log to a second sheet called "EventLog"
    let evSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("EventLog");
    if (!evSheet) {
      evSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("EventLog");
      evSheet.appendRow(["pid","session","task_num","time_s","event_type","detail"]);
    }
    (data.event_log || []).forEach(ev => {
      evSheet.appendRow([pid, session, ev.task, ev.ts, ev.type, ev.detail]);
    });

    return ContentService.createTextOutput("ok");
  } catch(err) {
    return ContentService.createTextOutput("error: " + err.message);
  }
}
```

3. Click **Save** (Ctrl+S)

---

## Step 3 — Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon next to "Type" → select **Web app**
3. Settings:
   - Description: `AI Cognition Experiment`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Copy the **Web app URL** — looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## Step 4 — Paste URL into app.js

Open `app.js` and replace line 18:

```javascript
const SHEETS_URL = "YOUR_APPS_SCRIPT_URL_HERE";
```

with your actual URL:

```javascript
const SHEETS_URL = "https://script.google.com/macros/s/AKfycb.../exec";
```

Commit to GitHub. Done.

---

## What gets saved where

| Location | Content | Who sees it |
|----------|---------|-------------|
| Google Sheet → Sheet1 | One row per task: all variables | Researcher only |
| Google Sheet → EventLog | Timestamped AI choice events | Researcher only |
| CSV download | Same as Sheet1 + EventLog combined | Backup sent by participant |
| Participant screen | Neutral summary only (no scores) | Participant |

---

## Researcher score column

The `researcher_score` column is left blank automatically. After each session:
1. Open the Sheet
2. Read the `answer` column for each task
3. Fill in 0 / 1 / 2 using the scoring rubric in the report

The `self_score` column is already filled by the participant.
The gap between `self_score` and `researcher_score` = metacognitive accuracy index.
