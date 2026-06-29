// ─────────────────────────────────────────────
// TASKS — edit this file to add / change tasks
// type: "exact"  → answer checked automatically
// type: "open"   → researcher scores manually
// ans_hint       → shown below the answer box
// ok             → accepted correct answers (exact type only)
// ─────────────────────────────────────────────

const TASKS = [
  {
    id: "speed",
    diff: "easy",
    q: "A train leaves at 9:00 AM and arrives at 11:30 AM. The journey is 180 km.\nWhat is the average speed in km/h?",
    type: "exact",
    ok: ["72"],
    ans_hint: "Numbers only (e.g. 72)",
    expl: "180 km ÷ 2.5 hours = 72 km/h",
    hint1: "Speed = distance ÷ time. The journey runs from 9:00 AM to 11:30 AM. How many hours is that?",
    hint2: "The journey is 2.5 hours. Now calculate: speed = 180 ÷ 2.5. What do you get?",
    full: "The journey takes 2.5 hours (9:00 AM to 11:30 AM).\nSpeed = distance ÷ time = 180 ÷ 2.5 = 72 km/h.\nThe answer is 72 km/h."
  },
  {
    id: "revenue",
    diff: "medium",
    q: "A company's revenue grew by 20% in year 1 and fell by 15% in year 2.\nStarting from ¥1,000,000, what is the revenue at the end of year 2?\nGive your answer in ¥ (numbers only).",
    type: "exact",
    ok: ["1020000", "1,020,000"],
    ans_hint: "Numbers only (e.g. 1020000)",
    expl: "¥1,000,000 × 1.20 = ¥1,200,000 → × 0.85 = ¥1,020,000",
    hint1: "Apply each percentage change one at a time. A 20% increase means multiplying by 1.20. What is ¥1,000,000 × 1.20?",
    hint2: "Year 1: ¥1,000,000 × 1.20 = ¥1,200,000. Now a 15% fall means × 0.85. Calculate ¥1,200,000 × 0.85.",
    full: "Step 1: ¥1,000,000 × 1.20 = ¥1,200,000 (after year 1).\nStep 2: ¥1,200,000 × 0.85 = ¥1,020,000 (after year 2).\nNote: +20% then −15% is NOT the same as +5%.\nAnswer: ¥1,020,000."
  },
  {
    id: "schedule",
    diff: "hard",
    q: "Plan a 3-day research trip. Sites to visit: 2h, 3h, 1.5h, 4h, 2.5h, 1h.\nMax 8 hours per day. Assign all 6 sites across 3 days so no day exceeds 8h and the workload is as even as possible.\nShow your day-by-day schedule.",
    type: "open",
    ok: null,
    ans_hint: "Write your schedule (e.g. Day 1: 4h + 2.5h + 1h ...)",
    expl: "Many valid solutions. Example: Day 1: 4+2.5+1=7.5h · Day 2: 3+2=5h · Day 3: 1.5h.",
    hint1: "Add all times: 2+3+1.5+4+2.5+1 = 14h total across 3 days (~4.7h/day). The 4h site is heaviest — use it as an anchor for one day.",
    hint2: "Try: Day 1: 4+2.5+1=7.5h · Day 2: 3+2=5h · Day 3: 1.5h. All days under 8h.",
    full: "Total = 14h across 3 days.\nDay 1: 4h + 2.5h + 1h = 7.5h\nDay 2: 3h + 2h = 5h\nDay 3: 1.5h\nAll days within the 8h limit."
  }
];
