# AI Cognition Experiment

Browser-based cognitive experiment investigating AI reliance vs. independent thinking.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main experiment interface |
| `tasks.js` | All task content — edit here to add/change tasks |
| `app.js` | Experiment logic (scoring, routing, PDF) |

## How to deploy (GitHub Pages)

1. Push all files to a GitHub repository
2. Go to repository **Settings → Pages**
3. Source: **Deploy from a branch → main → / (root)**
4. Save — your URL will be: `https://yourusername.github.io/repo-name`

## How to add or change tasks

Open `tasks.js` and add a new object to the `TASKS` array:

```js
{
  id: "unique_id",
  diff: "easy",          // easy / medium / hard
  q: "Question text",
  type: "exact",         // exact = auto-checked, open = researcher scores
  ok: ["answer"],        // accepted answers (numbers only, no symbols)
  ans_hint: "Numbers only (e.g. 42)",
  expl: "Explanation shown after submit",
  hint1: "Concept hint text",
  hint2: "Equation/step hint text",
  full: "Full answer with reasoning"
}
```

## AI usage scoring

| Participant choice | AI score | Cognitive score |
|-------------------|----------|----------------|
| No help | 0 | 5 |
| Concept hint | 2 | 3 |
| Equation hint | 4 | 1 |
| Full answer | 5 | 0 |

Session percentage formula: `((task1 + task2 + task3) × 100 / 5) / 3`

## Data collection

At session end, participants see a summary and click **Print / Save as PDF**, then email the PDF to the researcher.

PDF includes:
- Participant ID, session number, date
- Per-task: time, AI usage score, cognitive usage score, verdict
- Session-level AI usage % and cognitive usage %
