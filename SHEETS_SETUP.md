# Google Sheets Setup

---

## Step 1 — Update Sheet1 headers

Replace Row 1 of Sheet1 with these headers (copy the whole line):

```
pid	session	date	language	gender	age_group	academic_level	field_of_study	ai_frequency	task_num	task_id	task_type	difficulty	elapsed_s	answer	answer_len	ai_level	ai_reliance_0to3	first_hint_latency_s	confidence_1to5	confidence_label	self_score_0to2	researcher_score_0to2	cf_would_use_AI	cf_level	is_control_session
```

EventLog sheet headers (unchanged):
```
pid	session	task_num	time_s	event_type	detail
```

---

## Step 2 — Replace Apps Script code

Extensions → Apps Script → delete all → paste this → Save (Ctrl+S):

```javascript
function doPost(e) {
  try {
    const ss      = SpreadsheetApp.getActiveSpreadsheet();
    const sheet   = ss.getSheetByName("Sheet1");
    const evSheet = ss.getSheetByName("EventLog");
    const data    = JSON.parse(e.postData.contents);
    const type    = data.type;

    // ── Per-task row — written immediately on submission ──
    if (type === "task_row") {
      const r      = data.result;
      const isCtrl = data.is_control ? "yes" : "no";
      const lang   = data.language || "";
      const demo   = data.demographics || {};
      sheet.appendRow([
        data.pid, data.session, data.date, lang,
        demo.gender        || "",
        demo.age_group     || "",
        demo.level         || "",
        demo.field         || "",
        demo.ai_frequency  || "",
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
        r.cf_level     != null ? r.cf_level     : "",
        isCtrl
      ]);
    }

    // ── Self-score update — find matching row, update column 22 ──
    else if (type === "self_score_update") {
      const rows    = sheet.getDataRange().getValues();
      const pid     = data.pid;
      const session = String(data.session);
      const taskNum = data.task_num;
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === pid &&
            String(rows[i][1]) === session &&
            Number(rows[i][9]) === taskNum) {   // column 10 (index 9) = task_num
          sheet.getRange(i+1, 22).setValue(data.self_score); // column 22 = self_score
          break;
        }
      }
    }

    // ── Event log — written at session end ──
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

## Step 3 — Redeploy

Deploy → Manage deployments → Edit (pencil) → Version: **New version** → Deploy

> URL stays the same. No need to update app.js.

---

## Column reference (updated)

| Col | Variable | Notes |
|-----|----------|-------|
| A | pid | Participant ID |
| B | session | 1–4 |
| C | date | |
| D | language | en / jp |
| E | gender | male / female / non-binary / prefer_not_to_say |
| F | age_group | 18-22 / 23-27 / 28-32 / 33+ |
| G | academic_level | undergraduate / masters / phd / other |
| H | field_of_study | STEM / humanities / social_sciences / other |
| I | ai_frequency | daily / weekly / rarely / never |
| J | task_num | 1–3 |
| K | task_id | e.g. A1 |
| L | task_type | |
| M | difficulty | easy / medium / hard |
| N | elapsed_s | |
| O | answer | Full text |
| P | answer_len | |
| Q | ai_level | none / hint1 / hint2 / full / n/a |
| R | ai_reliance_0to3 | |
| S | first_hint_latency_s | |
| T | confidence_1to5 | |
| U | confidence_label | |
| V | self_score_0to2 | Participant self-assessment |
| W | researcher_score_0to2 | **Fill manually** |
| X | cf_would_use_AI | Session 4 only |
| Y | cf_level | Session 4 only |
| Z | is_control_session | yes / no |

---

## Key analysis variables with demographics

- **Gender × AI reliance:** Do male/female participants differ in reliance patterns?
- **Age group × reliance:** Does AI dependency vary by age?
- **Academic level:** UG vs Masters vs PhD
- **Field × reliance:** STEM vs Humanities vs Social Sciences
- **AI familiarity × reliance:** Does prior AI experience predict reliance in the experiment? (daily users may rely more OR less — interesting either way)
- All can be added as covariates in: `ai_reliance ~ difficulty + session + gender + level + field + ai_freq + (1|pid)`

Note: demographics collected only in Session 1 but apply to all 4 sessions. In Sessions 2–4, demographic columns will be blank in the raw sheet — join on `pid` during analysis.
