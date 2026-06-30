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
      ans_hint: "Write your answer in your own words.",
      hint1: "Look at the sentence right after 'climate change' in the passage. What does it say happens to the algae?",
      hint2: "The passage explains two linked events: rising temperatures → algae expelled (bleaching) → corals lose nutrients → corals die. Try to state both the cause and the consequence in your answer.",
      full: "Rising ocean temperatures caused by climate change directly cause coral bleaching: the corals expel the algae living in their tissues and turn white. After bleaching, because the algae are gone, the corals can no longer get nutrients from them, and as a result the corals eventually die."
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
      ans_hint: "Write your reasoning step by step, then give your final answer.",
      hint1: "Start by placing Elif — her day is fixed (Wednesday). Then think about Bence and Diana: since Bence is immediately after Diana, they must occupy two consecutive days.",
      hint2: "Elif = Wednesday. Diana–Bence must be a consecutive pair from the remaining days (Mon, Tue, Thu, Fri). Carlos ≠ Friday. Try placing Diana–Bence as Thursday–Friday, then see which days are left for Aiko and Carlos, remembering Aiko must come before Carlos.",
      full: "Elif = Wednesday (given). Diana and Bence must be consecutive days from {Mon, Tue, Thu, Fri}. If Diana=Thursday and Bence=Friday, the remaining days Monday and Tuesday go to Aiko and Carlos. Since Aiko must present before Carlos, and Carlos cannot present on Friday (already satisfied), the only valid order for the remaining two is Aiko=Monday, Carlos=Tuesday. This satisfies every constraint. Aiko presents on Monday."
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
      ans_hint: "State your choice and address each of the four criteria.",
      hint1: "None of the three candidates satisfies all four criteria perfectly. Try listing which criteria each candidate fails, then decide which missing criterion is least damaging to the position.",
      hint2: "Candidate A fails on availability (3 months, not next month). Candidate B fails on collaboration (prefers solo work). Candidate C fails on English (intermediate, not fluent). Since the position requires immediate availability and collaboration is core to a visiting role, weigh which single weakness is most tolerable.",
      full: "Candidate C is the strongest overall choice. They have a strong publication record (8 publications), collaborate well in teams, and can start immediately — satisfying three of the four criteria fully. Their only weakness is intermediate (not fluent) English, which is a manageable gap since most academic collaboration happens through written work and presentations where intermediate proficiency is often sufficient. Candidate A is strong on publications and teamwork but fails the immediate-availability requirement, which is critical for a fixed 6-month position. Candidate B is available immediately and fluent in English, but their preference for solo work conflicts directly with the collaboration requirement, which is harder to compensate for than a language gap. Therefore, Candidate C represents the best overall fit."
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
      ans_hint: "Write your answer using specific details from the passage.",
      hint1: "Look at what the passage says Fleming struggled with after his discovery. What specific technical problem prevented penicillin from being used right away?",
      hint2: "Fleming could not purify penicillin in large quantities. The passage tells you who eventually solved this problem and when — look at the sentence mentioning 1940.",
      full: "Penicillin did not become widely used immediately because Alexander Fleming, despite discovering it in 1928, struggled to purify the substance in large enough quantities to be practically useful. It was not until 1940 — twelve years later — that Howard Florey and Ernst Chain successfully purified penicillin and demonstrated that it could effectively treat infections in humans. Only after their work was completed did penicillin become viable for widespread medical use."
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
      ans_hint: "State your answer (A/B/C/D) then explain your full reasoning.",
      hint1: "Think about the relationship type, not just the topic. A vaccine doesn't just relate to disease — it specifically prevents a harmful agent from causing harm. What does a firewall prevent?",
      hint2: "A firewall blocks unauthorized access attempts — typically from a person or automated agent trying to break in. 'Virus' is tempting because it sounds technical, but a firewall's main defensive purpose is against intrusion attempts, not against malicious software directly (that's more antivirus software's job).",
      full: "The best answer is (D) Hacker. A vaccine prevents disease by protecting the body against a harmful biological agent; analogously, a firewall prevents a hacker (a harmful agent attempting unauthorized access) from breaching a system. Option (A) Computer is wrong because a computer is the system being protected, not the threat — it's analogous to 'body', not 'disease'. Option (B) Virus is a tempting but imprecise choice: a firewall's core function is blocking unauthorized network access attempts (typically from hackers), whereas blocking malicious software is more the role of antivirus software. Option (C) Internet is wrong because the internet is the medium through which threats travel, not the threat itself — comparable to calling 'air' the disease instead of the pathogen it carries."
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
      ans_hint: "State clearly what you fund and what you cut, and why.",
      hint1: "First confirm the gap: total needs cost $11,500 but you only have $10,000. That means you must cut exactly $1,500 worth of spending somewhere — either by removing one item entirely or reducing several partially.",
      hint2: "Compare the impact of cutting each item. Venue is non-negotiable. Speaker travel affects attendance significantly (60% drop). Catering affects focus during long sessions. Recording equipment affects reach to remote participants but doesn't affect the in-person experience. Which cut causes the least overall damage to the workshop's core goals?",
      full: "The venue ($4,000) must be funded fully since the workshop cannot happen without it. Speaker travel ($3,500) should also be funded in full because cutting it would reduce attendance by 60%, which undermines the workshop's core purpose. Catering ($2,500) should be funded because an 8-hour daily schedule without food breaks would significantly harm participant focus and experience for in-person attendees. This leaves $10,000 − $4,000 − $3,500 − $2,500 = $0 remaining, exactly $1,500 short of the recording equipment. Therefore, the recording equipment should be cut entirely. While this means remote participants (500+) cannot join live, it is the least damaging cut: it does not affect the in-person experience, attendance, or focus of the actual attendees, and recordings could potentially be arranged later through a lower-cost alternative such as a borrowed camera or volunteer recording."
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
      ans_hint: "Identify the main factor and support your answer with examples from the passage.",
      hint1: "The early part of the passage mentions mixed results without explaining why. Look at the final sentence — it identifies the actual deciding factor behind those mixed results.",
      hint2: "The meta-analysis found the deciding factor was the type of job itself, not individual preference. The passage gives two contrasting examples of job types — one that benefited and one that suffered. Try to name both.",
      full: "According to the 2023 meta-analysis, the main factor that determined whether remote work improved or reduced productivity was the nature of the job itself. Specifically, roles requiring deep focus (such as writing, coding, or analysis) benefited most from remote work, likely because they involve fewer interruptions when working from home. In contrast, roles requiring frequent collaboration (such as team-based or client-facing work) suffered under remote work, likely because spontaneous communication and coordination are harder to replicate outside a shared physical space."
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
      ans_hint: "Work through the clues step by step and assign each researcher to a room.",
      hint1: "Start with the most direct clue: Kenji = Biology. Then use Leila's clue — she's not in Archive or Chemistry, and Biology is already taken by Kenji, so what room is left for her?",
      hint2: "Kenji = Biology. Leila can only be in Data (since Archive, Chemistry, and Biology are all excluded for her). That leaves Marco and Nadia for Archive and Chemistry. Now use the alphabetical clue: 'Archive' comes before 'Chemistry' alphabetically, and Nadia cannot be in Data (already satisfied). Which assignment between Marco and Nadia satisfies 'Marco's room comes before Nadia's room alphabetically'?",
      full: "Kenji = Biology (given directly). Leila cannot be in Archive, Chemistry, or Biology (taken), so Leila = Data. This leaves Archive and Chemistry for Marco and Nadia. Since Marco's room must come before Nadia's room alphabetically, and 'Archive' comes before 'Chemistry' alphabetically, Marco = Archive and Nadia = Chemistry. This also satisfies the clue that Nadia does not work in the Data room. Final assignment: Kenji = Biology, Leila = Data, Marco = Archive, Nadia = Chemistry."
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
      ans_hint: "Write a week-by-week plan and explain your reasoning for the conference paper decision.",
      hint1: "Chapter 5 cannot start before Chapter 4 finishes, so Chapter 4 must come first in the schedule. The conference paper has a hard deadline at week 6 — think about whether the student has enough free time in the first 6 weeks to fit it in alongside Chapter 4.",
      hint2: "Chapter 4 takes 2 weeks (weeks 1-2). That leaves weeks 3-6 (4 weeks) before the conference deadline, but the paper needs 3 weeks and Chapter 5 needs 6 weeks — they can't both fully fit before week 6. Consider writing Chapter 6 (independent of Chapter 4/5) in parallel with the conference paper, since Chapter 6 doesn't depend on anything.",
      full: "Recommended schedule: Weeks 1-2: Chapter 4 revision (must come first). Weeks 3-5: Conference paper (3 weeks, fits before the week-6 deadline). Weeks 3-7: Chapter 6 can be started in parallel during this period since it has no dependencies, finishing around week 7-8 if worked on alongside the conference paper, or scheduled right after. Weeks 6-11 (6 weeks): Chapter 5, which can only begin once Chapter 4 is done (week 2) — schedule it to run from week 6 to week 11 after the conference paper is submitted. Weeks 12-16: Finish Chapter 6 if not completed earlier, plus buffer time for revisions and integration of all three chapters. The conference paper should be submitted: it only requires 3 weeks, fits within the first 6 weeks without delaying the thesis dependency chain (Chapter 4 → 5), and provides significant career benefit. The total work (13 thesis weeks + 3 conference weeks = 16 weeks) exactly matches the available time, so the schedule is tight but feasible if Chapter 6 is worked on in parallel with the conference paper rather than strictly sequentially."
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
