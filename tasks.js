// ─────────────────────────────────────────────────────────────────────────────
// TASK SETS — 3 sessions × 3 difficulty levels
// ALL tasks are open-ended — researcher scores 0/1/2 after receiving PDF
// Participant also self-scores 0/1/2 immediately after each task
//
// Scoring rubric (for researcher):
//   2 = Complete, accurate answer with clear reasoning
//   1 = Partial — key idea present but incomplete or imprecise
//   0 = Incorrect, irrelevant, or blank
//
// References:
//   Bloom et al. (1956) — Taxonomy of educational objectives
//   Iqbal, Zheng & Bailey (2004) — Cognitive load across task types
//   Sternberg (1977) — Analogical reasoning
//   Buçinca et al. (2021, CHI) — AI overreliance and cognitive forcing
//   Xu et al. (2022, 2023) — Task complexity in within-subjects design
//   Viator et al. (2022, Frontiers) — Reflection-impulsivity
//   Zucchelli et al. (2025, Frontiers) — Decision making under cognitive load
// ─────────────────────────────────────────────────────────────────────────────

const TASK_SETS = {

  // ── SET A ────────────────────────────────────────────────────────────────
  A: [
    {
      id: "A1",
      diff: "easy",
      type: "Reading Comprehension",
      q: `Read the passage carefully and answer the question below.

"The Great Barrier Reef, located off the coast of Australia, is the world's largest coral reef system. It supports thousands of species of marine life. However, rising ocean temperatures caused by climate change have led to repeated coral bleaching events, where corals expel the algae living in their tissues and turn white. Without algae, corals cannot get nutrients and eventually die. Scientists warn that if global temperatures rise by 2°C above pre-industrial levels, over 99% of the reef could be destroyed."

Question: According to the passage, what directly causes coral bleaching, and what happens to corals after bleaching occurs?`,
      scoring_guide: "Full (2): identifies rising ocean temperatures as cause AND explains corals lose nutrients and die. Partial (1): mentions one part only. Zero (0): incorrect or vague.",
      ans_hint: "Write your answer in your own words."
    },
    {
      id: "A2",
      diff: "medium",
      type: "Logical Reasoning",
      q: `Read carefully and answer the question.

Five researchers — Aiko, Bence, Carlos, Diana, and Elif — are presenting at a conference. Each presents on a different day from Monday to Friday.
  • Aiko presents sometime before Carlos.
  • Elif presents on Wednesday.
  • Bence presents on the day immediately after Diana.
  • Carlos does not present on Friday.

Question: On which day does Aiko present? Show your reasoning step by step.`,
      scoring_guide: "Full (2): correct answer (Monday) with clear step-by-step reasoning. Partial (1): correct answer but no reasoning shown, or reasoning attempted but wrong day reached. Zero (0): incorrect or blank.",
      ans_hint: "Write your reasoning step by step, then give your final answer."
    },
    {
      id: "A3",
      diff: "hard",
      type: "Decision Making",
      q: `Read the scenario and write your decision with full reasoning.

You are a university department head. You must assign one of three candidates to a 6-month visiting researcher position. The position requires: (1) strong publication record, (2) ability to collaborate, (3) availability starting next month, and (4) English proficiency.

  • Candidate A: 12 publications, works well in teams, can start in 3 months, fluent in English.
  • Candidate B: 4 publications, prefers solo work, can start next month, fluent in English.
  • Candidate C: 8 publications, works well in teams, can start next month, intermediate English.

Question: Which candidate do you choose? Address all four criteria explicitly in your answer.`,
      scoring_guide: "Full (2): chooses one candidate AND explicitly addresses all 4 criteria with reasoned tradeoffs. Partial (1): addresses 2-3 criteria or makes a choice without justification. Zero (0): no clear decision or irrelevant answer.",
      ans_hint: "State your choice and address each of the four criteria."
    }
  ],

  // ── SET B ────────────────────────────────────────────────────────────────
  B: [
    {
      id: "B1",
      diff: "easy",
      type: "Reading Comprehension",
      q: `Read the passage carefully and answer the question below.

"In 1928, Alexander Fleming noticed that a mold called Penicillium had contaminated one of his bacterial cultures and was killing the bacteria around it. He identified the active substance as penicillin. However, Fleming struggled to purify it in large quantities. It was not until 1940 that Howard Florey and Ernst Chain successfully purified penicillin and demonstrated its effectiveness in treating infections in humans. The three scientists shared the Nobel Prize in Physiology or Medicine in 1945."

Question: Why did penicillin not become widely used immediately after Fleming's discovery in 1928? Use evidence from the passage.`,
      scoring_guide: "Full (2): identifies that Fleming could not purify penicillin in sufficient quantities AND references 1940 Florey/Chain work. Partial (1): mentions purification problem only without explaining who solved it, or vice versa. Zero (0): incorrect or vague.",
      ans_hint: "Write your answer using specific details from the passage."
    },
    {
      id: "B2",
      diff: "medium",
      type: "Analogical Reasoning",
      q: `Complete the analogy and explain your reasoning.

"Vaccine : Disease :: Firewall : ?"

Options: (A) Computer   (B) Virus   (C) Internet   (D) Hacker

Question: Choose the best answer and write one paragraph explaining: (1) why your choice is correct, and (2) why each of the other three options is wrong.`,
      scoring_guide: "Full (2): selects Hacker (D) AND provides clear reasoning for the correct answer AND explains why at least 2 other options are wrong. Partial (1): correct answer with partial explanation, or wrong answer with strong reasoning attempt. Zero (0): no reasoning or completely off.",
      ans_hint: "State your answer (A/B/C/D) then explain your full reasoning."
    },
    {
      id: "B3",
      diff: "hard",
      type: "Decision Making",
      q: `Read the scenario and write your decision with full reasoning.

You are organizing a 3-day international workshop. Your total budget is $10,000. You must allocate it across four needs:

  • Venue: $4,000 (non-negotiable — without it, the workshop cannot happen)
  • Speaker travel: $3,500 for 3 invited speakers (skipping reduces attendance by 60%)
  • Catering: $2,500 (workshop runs 8 hours/day — skipping meals reduces focus)
  • Recording equipment: $1,500 (allows 500+ remote participants to join)

The total cost of all four items is $11,500. You cannot exceed $10,000.

Question: What do you fund and what do you cut? Justify every decision explicitly.`,
      scoring_guide: "Full (2): recognizes $1,500 must be cut, makes a clear and justified decision about which item to cut or partially reduce, addresses impact of the cut. Partial (1): identifies the budget problem but justification is weak or one item unaddressed. Zero (0): no clear decision or math error leads to wrong framing.",
      ans_hint: "State clearly what you fund and what you cut, and why."
    }
  ],

  // ── SET C ────────────────────────────────────────────────────────────────
  C: [
    {
      id: "C1",
      diff: "easy",
      type: "Reading Comprehension",
      q: `Read the passage carefully and answer the question below.

"Remote work became widespread during the COVID-19 pandemic. Studies conducted between 2020 and 2022 showed mixed results: some workers reported higher productivity due to fewer interruptions, while others reported lower productivity due to home distractions and feelings of isolation. A 2023 meta-analysis of 108 studies found that productivity outcomes depended primarily on the nature of the job — roles requiring deep focus benefited most from remote work, while roles requiring frequent collaboration suffered."

Question: According to the 2023 meta-analysis, what was the main factor that determined whether remote work improved or reduced productivity? Explain with examples from the passage.`,
      scoring_guide: "Full (2): identifies 'nature of the job' as the main factor AND gives both examples (deep focus vs. collaboration). Partial (1): identifies the main factor but gives only one example or no examples. Zero (0): incorrect or irrelevant.",
      ans_hint: "Identify the main factor and support your answer with examples from the passage."
    },
    {
      id: "C2",
      diff: "medium",
      type: "Logical Reasoning",
      q: `Read carefully and answer the question.

A research lab has four rooms: Archive, Biology, Chemistry, and Data. Each room is used by exactly one researcher: Kenji, Leila, Marco, and Nadia.

  • Leila does not work in the Archive or Chemistry room.
  • Marco works in a room whose name comes before Nadia's room alphabetically.
  • Kenji works in the Biology room.
  • Nadia does not work in the Data room.

Question: Which room does each researcher work in? Show your full reasoning.`,
      scoring_guide: "Full (2): correct assignment for all four (Kenji=Biology, Leila=Data, Marco=Archive, Nadia=Chemistry) with step-by-step reasoning. Partial (1): 2-3 correct assignments with some reasoning shown. Zero (0): no reasoning or all wrong.",
      ans_hint: "Work through the clues step by step and assign each researcher to a room."
    },
    {
      id: "C3",
      diff: "hard",
      type: "Decision Making",
      q: `Read the scenario and write a detailed plan with justification.

A PhD student must submit their thesis in 16 weeks. Three chapters remain:

  • Chapter 4 (Methods): Needs 2 weeks of revision. Must be completed before Chapter 5 can begin.
  • Chapter 5 (Results): Can only start after Chapter 4 is done. Estimated 6 weeks to write.
  • Chapter 6 (Discussion): Can be written independently at any time. Estimated 5 weeks. Supervisor says this is the most important chapter for the final evaluation.

The student also has a conference paper due in 6 weeks, estimated to take 3 weeks to write. Submitting it would significantly help their job applications.

Total thesis work = 13 weeks. Conference paper = 3 weeks. Total available = 16 weeks.

Question: Design a week-by-week schedule for all 16 weeks. Should the student submit the conference paper? Justify all choices.`,
      scoring_guide: "Full (2): produces a complete 16-week schedule respecting Chapter 4→5 dependency, addresses conference paper with clear justification, no scheduling conflicts. Partial (1): schedule present but has a dependency error or conference paper decision unjustified. Zero (0): no schedule or major logical errors.",
      ans_hint: "Write a week-by-week plan and explain your reasoning for the conference paper decision."
    }
  ]
};

// ── COUNTERBALANCING ────────────────────────────────────────────────────────
// Assign session order based on participant ID last digit
// Group A→B→C: PIDs ending 1,4,7
// Group B→C→A: PIDs ending 2,5,8
// Group C→A→B: PIDs ending 3,6,9,0
function getTaskSet(pid, sessionNum) {
  const lastChar = pid.trim().slice(-1);
  const digit = parseInt(lastChar);
  let group;
  if ([1,4,7].includes(digit)) group = "ABC";
  else if ([2,5,8].includes(digit)) group = "BCA";
  else group = "CAB";

  const setKey = group[sessionNum - 1]; // session 1→index 0, etc.
  return TASK_SETS[setKey] || TASK_SETS["A"];
}
