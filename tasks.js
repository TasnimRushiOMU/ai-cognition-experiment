// ─────────────────────────────────────────────────────────────────────────────
// TASK SETS — English (EN) and Japanese (JP) versions
// 3 sessions × 3 difficulty levels × 2 languages + Set D (control)
// ─────────────────────────────────────────────────────────────────────────────

const TASK_SETS = {

  // ── SET A ──────────────────────────────────────────────────────────────────
  A: {
    en: [
      {
        id: "A1", diff: "easy", type: "Reading Comprehension",
        q: `Read the passage carefully and answer the question below.

"The Great Barrier Reef, located off the coast of Australia, is the world's largest coral reef system. It supports thousands of species of marine life. However, rising ocean temperatures caused by climate change have led to repeated coral bleaching events, where corals expel the algae living in their tissues and turn white. Without algae, corals cannot get nutrients and eventually die. Scientists warn that if global temperatures rise by 2°C above pre-industrial levels, over 99% of the reef could be destroyed."

Question: According to the passage, what directly causes coral bleaching, and what happens to corals after bleaching occurs?`,
        scoring_guide: "Full (2): identifies rising ocean temperatures as cause AND explains corals lose nutrients and die. Partial (1): mentions one part only. Zero (0): incorrect or vague.",
        ans_hint: "Write your answer in your own words.",
        hint1: "Look at the sentence right after 'climate change' in the passage. What does it say happens to the algae?",
        hint2: "The passage explains two linked events: rising temperatures → algae expelled (bleaching) → corals lose nutrients → corals die. Try to state both the cause and the consequence.",
        full: "Rising ocean temperatures caused by climate change directly cause coral bleaching: the corals expel the algae living in their tissues and turn white. After bleaching, because the algae are gone, the corals can no longer get nutrients and eventually die."
      },
      {
        id: "A2", diff: "medium", type: "Logical Reasoning",
        q: `Read carefully and answer the question.

Five researchers — Aiko, Bence, Carlos, Diana, and Elif — are presenting at a conference. Each presents on a different day from Monday to Friday.
  • Aiko presents sometime before Carlos.
  • Elif presents on Wednesday.
  • Bence presents on the day immediately after Diana.
  • Carlos does not present on Friday.

Question: On which day does Aiko present? Show your reasoning step by step.`,
        scoring_guide: "Full (2): correct answer (Monday) with clear step-by-step reasoning. Partial (1): correct answer but no reasoning, or reasoning attempted but wrong day. Zero (0): incorrect or blank.",
        ans_hint: "Write your reasoning step by step, then give your final answer.",
        hint1: "Start by placing Elif — her day is fixed (Wednesday). Then think about Bence and Diana: since Bence is immediately after Diana, they must occupy two consecutive days.",
        hint2: "Elif = Wednesday. Diana–Bence must be consecutive from {Mon, Tue, Thu, Fri}. Carlos ≠ Friday. Try Diana=Thursday, Bence=Friday, leaving Monday and Tuesday for Aiko and Carlos. Aiko must come before Carlos.",
        full: "Elif = Wednesday. Diana and Bence must be consecutive: Diana=Thursday, Bence=Friday. Remaining days Monday and Tuesday go to Aiko and Carlos. Since Aiko must present before Carlos: Aiko=Monday, Carlos=Tuesday. Answer: Monday."
      },
      {
        id: "A3", diff: "hard", type: "Decision Making",
        q: `Read the scenario and write your decision with full reasoning.

You are a university department head. You must assign one of three candidates to a 6-month visiting researcher position. The position requires: (1) strong publication record, (2) ability to collaborate, (3) availability starting next month, and (4) English proficiency.

  • Candidate A: 12 publications, works well in teams, can start in 3 months, fluent in English.
  • Candidate B: 4 publications, prefers solo work, can start next month, fluent in English.
  • Candidate C: 8 publications, works well in teams, can start next month, intermediate English.

Question: Which candidate do you choose? Address all four criteria explicitly in your answer.`,
        scoring_guide: "Full (2): chooses one candidate AND explicitly addresses all 4 criteria with reasoned tradeoffs. Partial (1): addresses 2-3 criteria or choice without justification. Zero (0): no clear decision.",
        ans_hint: "State your choice and address each of the four criteria.",
        hint1: "None of the three candidates satisfies all four criteria perfectly. List which criteria each candidate fails, then decide which missing criterion is least damaging.",
        hint2: "A fails on availability. B fails on collaboration. C fails on English. Which single weakness is most tolerable for a visiting researcher role?",
        full: "Candidate C is the strongest choice. They have 8 publications, collaborate well, and can start immediately — satisfying three of the four criteria. Their intermediate English is the only gap, which is manageable in most academic settings. Candidate A cannot start on time (critical for a fixed 6-month position). Candidate B's preference for solo work directly conflicts with the collaboration requirement."
      }
    ],
    jp: [
      {
        id: "A1", diff: "easy", type: "読解",
        q: `以下の文章をよく読んで、質問に答えてください。

「オーストラリア沿岸に位置するグレートバリアリーフは、世界最大のサンゴ礁群です。何千もの海洋生物の種を支えています。しかし、気候変動による海水温の上昇が繰り返しサンゴの白化現象を引き起こしています。白化とは、サンゴが組織内に共生する藻類を排出し、白くなる現象です。藻類がなければ、サンゴは栄養を得ることができず、最終的に死滅します。科学者たちは、地球の気温が産業革命前の水準より2℃上昇した場合、礁の99%以上が破壊される可能性があると警告しています。」

質問：この文章によると、サンゴの白化を直接引き起こす原因は何ですか？また、白化が起きた後、サンゴはどうなりますか？`,
        scoring_guide: "満点(2)：海水温の上昇が原因であることを特定し、かつサンゴが栄養を失い死滅することを説明している。部分点(1)：どちらか一方のみ言及。0点：不正解または曖昧。",
        ans_hint: "自分の言葉で答えてください。",
        hint1: "文章の中で「気候変動」の直後の文を見てください。藻類に何が起きると書かれていますか？",
        hint2: "文章は二つの連鎖した出来事を説明しています：海水温上昇 → 藻類の排出（白化）→ サンゴが栄養を失う → サンゴの死滅。原因と結果の両方を述べてみましょう。",
        full: "気候変動による海水温の上昇がサンゴの白化を直接引き起こします。サンゴは組織内の藻類を排出して白くなります。白化後は藻類がなくなるため、サンゴは栄養を得られなくなり、最終的に死滅します。"
      },
      {
        id: "A2", diff: "medium", type: "論理的推論",
        q: `よく読んで質問に答えてください。

5人の研究者（アイコ、ベンセ、カルロス、ダイアナ、エリフ）が学会で発表します。それぞれ月曜日から金曜日の異なる曜日に発表します。
  • アイコはカルロスより前に発表する。
  • エリフは水曜日に発表する。
  • ベンセはダイアナの翌日に発表する。
  • カルロスは金曜日には発表しない。

質問：アイコは何曜日に発表しますか？推論の手順を示しながら答えてください。`,
        scoring_guide: "満点(2)：正解（月曜日）かつ明確な段階的推論あり。部分点(1)：正解だが推論なし、または推論途中で誤り。0点：不正解または空白。",
        ans_hint: "推論を段階的に書いてから、最終的な答えを示してください。",
        hint1: "まずエリフの曜日を確定させましょう（水曜日）。次にベンセとダイアナについて：ベンセはダイアナの翌日なので、二人は連続した曜日でなければなりません。",
        hint2: "エリフ＝水曜日。ダイアナ＝木曜日、ベンセ＝金曜日と仮定すると、残りは月曜日と火曜日がアイコとカルロスに。アイコはカルロスより前に発表する必要があります。",
        full: "エリフ＝水曜日（確定）。ダイアナ＝木曜日、ベンセ＝金曜日（連続かつ残りの制約を満たす）。残りの月曜日と火曜日はアイコとカルロスへ。アイコはカルロスより前なので：アイコ＝月曜日、カルロス＝火曜日。答え：月曜日。"
      },
      {
        id: "A3", diff: "hard", type: "意思決定",
        q: `以下のシナリオを読み、理由を含めた決定を述べてください。

あなたは大学の学科長です。6ヶ月の訪問研究員ポジションに3人の候補者のうち1人を選ばなければなりません。このポジションには以下が求められます：(1) 十分な業績（論文数）、(2) 協調性、(3) 来月からの着任可能性、(4) 英語力。

  • 候補者A：論文12本、チームワーク良好、着任可能は3ヶ月後、英語堪能。
  • 候補者B：論文4本、単独作業を好む、来月から着任可能、英語堪能。
  • 候補者C：論文8本、チームワーク良好、来月から着任可能、英語は中級。

質問：どの候補者を選びますか？4つの条件すべてに言及しながら答えてください。`,
        scoring_guide: "満点(2)：候補者を1人選び、4つの条件すべてにトレードオフを含めた理由を明示。部分点(1)：2〜3条件のみ言及または理由なしの選択。0点：明確な決定なし。",
        ans_hint: "選んだ候補者を明示し、4つの条件それぞれについて述べてください。",
        hint1: "3人の候補者はいずれも4つの条件を完全には満たしていません。各候補者がどの条件を満たしていないかをリストアップし、どの欠点が最も許容できるかを考えてみましょう。",
        hint2: "Aは着任時期が遅い。Bは協調性に欠ける。Cは英語力が中級。訪問研究員として最も重要な条件はどれでしょうか？",
        full: "候補者Cが最適です。論文8本の業績があり、チームワークも良好で、来月から着任できます。英語が中級という点が唯一の弱点ですが、多くの学術的な場面では許容範囲内です。候補者Aは着任が3ヶ月後と遅く、6ヶ月の固定期間には致命的です。候補者Bは単独作業を好む傾向があり、協調性という要件と直接矛盾します。"
      }
    ]
  },

  // ── SET B ──────────────────────────────────────────────────────────────────
  B: {
    en: [
      {
        id: "B1", diff: "easy", type: "Reading Comprehension",
        q: `Read the passage carefully and answer the question below.

"In 1928, Alexander Fleming noticed that a mold called Penicillium had contaminated one of his bacterial cultures and was killing the bacteria around it. He identified the active substance as penicillin. However, Fleming struggled to purify it in large quantities. It was not until 1940 that Howard Florey and Ernst Chain successfully purified penicillin and demonstrated its effectiveness in treating infections in humans. The three scientists shared the Nobel Prize in Physiology or Medicine in 1945."

Question: Why did penicillin not become widely used immediately after Fleming's discovery in 1928? Use evidence from the passage.`,
        scoring_guide: "Full (2): identifies purification problem AND references 1940 Florey/Chain work. Partial (1): only one element. Zero (0): incorrect or vague.",
        ans_hint: "Write your answer using specific details from the passage.",
        hint1: "Look at what the passage says Fleming struggled with after his discovery. What specific technical problem prevented immediate use?",
        hint2: "Fleming could not purify penicillin in large quantities. Who solved this problem and when?",
        full: "Penicillin did not become widely used immediately because Fleming struggled to purify it in large quantities. It was not until 1940 that Florey and Chain successfully purified penicillin and demonstrated its effectiveness in treating human infections."
      },
      {
        id: "B2", diff: "medium", type: "Analogical Reasoning",
        q: `Complete the analogy and explain your reasoning.

"Vaccine : Disease :: Firewall : ?"

Options: (A) Computer   (B) Virus   (C) Internet   (D) Hacker

Question: Choose the best answer and write one paragraph explaining: (1) why your choice is correct, and (2) why each of the other three options is wrong.`,
        scoring_guide: "Full (2): selects Hacker (D) AND provides reasoning for correct answer AND explains why ≥2 others are wrong. Partial (1): correct answer with partial explanation. Zero (0): no reasoning.",
        ans_hint: "State your answer (A/B/C/D) then explain your full reasoning.",
        hint1: "Think about the relationship type: a vaccine prevents a harmful agent from causing harm. What does a firewall prevent?",
        hint2: "A firewall blocks unauthorized access attempts — typically from a person trying to break in. 'Virus' is tempting but that's more what antivirus software targets.",
        full: "The answer is (D) Hacker. A vaccine prevents disease (a harmful agent); a firewall prevents a hacker (a harmful agent attempting unauthorized access). (A) Computer is wrong — it's the system being protected, not the threat. (B) Virus is imprecise — firewalls primarily block intrusion attempts, not malware. (C) Internet is the medium, not the threat."
      },
      {
        id: "B3", diff: "hard", type: "Decision Making",
        q: `Read the scenario and write your decision with full reasoning.

You are organizing a 3-day international workshop. Your total budget is $10,000. You must allocate it across four needs:

  • Venue: $4,000 (non-negotiable — without it, the workshop cannot happen)
  • Speaker travel: $3,500 for 3 invited speakers (skipping reduces attendance by 60%)
  • Catering: $2,500 (workshop runs 8 hours/day — skipping meals reduces focus)
  • Recording equipment: $1,500 (allows 500+ remote participants to join)

The total cost of all four items is $11,500. You cannot exceed $10,000.

Question: What do you fund and what do you cut? Justify every decision explicitly.`,
        scoring_guide: "Full (2): recognizes $1,500 must be cut, makes justified decision about which item, addresses impact. Partial (1): identifies shortfall but weak justification. Zero (0): no clear decision or math error.",
        ans_hint: "State clearly what you fund and what you cut, and why.",
        hint1: "First confirm the gap: total needs cost $11,500 but you only have $10,000. You must cut exactly $1,500 somewhere.",
        hint2: "Venue is non-negotiable. Speaker travel affects attendance by 60%. Catering affects in-person focus. Recording affects remote reach only. Which cut causes least damage to the workshop's core goals?",
        full: "Venue ($4,000), speaker travel ($3,500), and catering ($2,500) should all be funded: total = $10,000. The recording equipment ($1,500) should be cut. While this means remote participants cannot join live, it does not affect the in-person experience, attendance, or focus — making it the least damaging cut."
      }
    ],
    jp: [
      {
        id: "B1", diff: "easy", type: "読解",
        q: `以下の文章をよく読んで、質問に答えてください。

「1928年、アレクサンダー・フレミングは、ペニシリウムというカビが細菌培養液を汚染し、周囲の細菌を死滅させていることに気づきました。彼はその有効成分をペニシリンと特定しました。しかし、フレミングは大量精製に苦心しました。1940年になってようやく、ハワード・フローリーとエルンスト・チェーンがペニシリンの精製に成功し、人体への感染症治療における有効性を実証しました。3人の科学者は1945年にノーベル生理学・医学賞を共同受賞しました。」

質問：1928年のフレミングの発見後、ペニシリンがすぐに広く使用されなかった理由は何ですか？文章から根拠を示して答えてください。`,
        scoring_guide: "満点(2)：大量精製の問題を特定し、1940年のフローリーとチェーンの業績にも言及。部分点(1)：どちらか一方のみ。0点：不正解または曖昧。",
        ans_hint: "文章の具体的な情報を使って答えてください。",
        hint1: "フレミングが発見後に苦心したことは何か、文章に書かれています。何の技術的問題が即時使用を妨げたのでしょうか？",
        hint2: "フレミングはペニシリンを大量に精製できませんでした。この問題を誰がいつ解決しましたか？",
        full: "ペニシリンはフレミングが大量精製に苦心したため、すぐには広く使用されませんでした。1940年になってようやく、フローリーとチェーンがペニシリンの精製に成功し、人体への感染症治療における有効性を実証したことで、実用化への道が開かれました。"
      },
      {
        id: "B2", diff: "medium", type: "類推推論",
        q: `類推を完成させ、推論を説明してください。

「ワクチン：病気 ＝ ファイアウォール：？」

選択肢：(A) コンピュータ　(B) ウイルス　(C) インターネット　(D) ハッカー

質問：最も適切な答えを選び、(1)なぜその選択が正しいか、(2)なぜ他の3つの選択肢が誤りなのかを一段落で説明してください。`,
        scoring_guide: "満点(2)：ハッカー(D)を選択し、正解の理由と他の選択肢の誤りを2つ以上説明。部分点(1)：正解だが説明が部分的。0点：推論なし。",
        ans_hint: "答え(A/B/C/D)を明示してから、推論を説明してください。",
        hint1: "関係性の種類を考えましょう：ワクチンは有害なもの（病気）から守ります。ファイアウォールは何から守るのでしょうか？",
        hint2: "ファイアウォールは不正アクセスの試みをブロックします。「ウイルス」は魅力的な選択肢ですが、それはどちらかといえばウイルス対策ソフトの役割です。",
        full: "答えは(D)ハッカーです。ワクチンが病気（有害な存在）を防ぐように、ファイアウォールはハッカー（不正アクセスを試みる有害な存在）を防ぎます。(A)コンピュータは守られる対象であり、脅威ではありません。(B)ウイルスはファイアウォールよりもウイルス対策ソフトが主に対処するものです。(C)インターネットは脅威が伝わる媒体であり、脅威そのものではありません。"
      },
      {
        id: "B3", diff: "hard", type: "意思決定",
        q: `以下のシナリオを読み、理由を含めた決定を述べてください。

あなたは3日間の国際ワークショップを企画しています。予算の総額は10,000ドルです。以下の4つの費用に配分しなければなりません：

  • 会場費：4,000ドル（必須 — これがなければワークショップ自体が開催できない）
  • 講演者の交通費：招待講演者3名分で3,500ドル（省略すると参加者が60%減少する）
  • ケータリング：2,500ドル（1日8時間のプログラム — 食事なしでは集中力が低下する）
  • 録音・録画機器：1,500ドル（500名以上のリモート参加者が参加可能になる）

4項目の合計は11,500ドルですが、予算は10,000ドルを超えられません。

質問：何を資金調達し、何を削減しますか？すべての決定について明確な理由を述べてください。`,
        scoring_guide: "満点(2)：1,500ドルの削減が必要であることを認識し、どの項目を削るか明確な理由を述べ、その影響に言及。部分点(1)：予算不足を特定したが理由が不十分。0点：明確な決定なし。",
        ans_hint: "何を資金調達し、何を削減するかを明確に述べ、理由を説明してください。",
        hint1: "まず差額を確認しましょう：4項目の合計は11,500ドルですが、予算は10,000ドルです。どこかで正確に1,500ドルを削減しなければなりません。",
        hint2: "会場費は必須です。講演者の交通費を省くと参加者が60%減ります。ケータリングを省くと集中力に影響します。録画機器を省くとリモート参加者のみに影響します。どれを削ることがワークショップの本来の目的への影響が最も小さいでしょうか？",
        full: "会場費（4,000ドル）、講演者交通費（3,500ドル）、ケータリング（2,500ドル）の合計がちょうど10,000ドルとなるため、これらをすべて資金調達します。録音・録画機器（1,500ドル）を削減します。リモート参加者がリアルタイムで参加できなくなりますが、対面参加者の体験・参加者数・集中力には影響しないため、最も影響の少ない削減項目です。"
      }
    ]
  },

  // ── SET C ──────────────────────────────────────────────────────────────────
  C: {
    en: [
      {
        id: "C1", diff: "easy", type: "Reading Comprehension",
        q: `Read the passage carefully and answer the question below.

"Remote work became widespread during the COVID-19 pandemic. Studies conducted between 2020 and 2022 showed mixed results: some workers reported higher productivity due to fewer interruptions, while others reported lower productivity due to home distractions and feelings of isolation. A 2023 meta-analysis of 108 studies found that productivity outcomes depended primarily on the nature of the job — roles requiring deep focus benefited most from remote work, while roles requiring frequent collaboration suffered."

Question: According to the 2023 meta-analysis, what was the main factor that determined whether remote work improved or reduced productivity? Explain with examples from the passage.`,
        scoring_guide: "Full (2): identifies 'nature of the job' AND gives both examples. Partial (1): identifies factor but gives only one example. Zero (0): incorrect or irrelevant.",
        ans_hint: "Identify the main factor and support with examples from the passage.",
        hint1: "The early part of the passage mentions mixed results without explaining why. Look at the final sentence — it identifies the actual deciding factor.",
        hint2: "The meta-analysis found the deciding factor was the type of job itself. The passage gives two contrasting examples — one that benefited and one that suffered. Try to name both.",
        full: "The main factor was the nature of the job itself. Roles requiring deep focus benefited most from remote work, while roles requiring frequent collaboration suffered. This explains why earlier studies showed mixed results — the outcome depended on job type, not individual preference."
      },
      {
        id: "C2", diff: "medium", type: "Logical Reasoning",
        q: `Read carefully and answer the question.

A research lab has four rooms: Archive, Biology, Chemistry, and Data. Each room is used by exactly one researcher: Kenji, Leila, Marco, and Nadia.

  • Leila does not work in the Archive or Chemistry room.
  • Marco works in a room whose name comes before Nadia's room alphabetically.
  • Kenji works in the Biology room.
  • Nadia does not work in the Data room.

Question: Which room does each researcher work in? Show your full reasoning.`,
        scoring_guide: "Full (2): correct assignment for all four with step-by-step reasoning. Partial (1): 2-3 correct with some reasoning. Zero (0): no reasoning or all wrong.",
        ans_hint: "Work through the clues step by step and assign each researcher to a room.",
        hint1: "Start with the most direct clue: Kenji = Biology. Then use Leila's clue — she's not in Archive or Chemistry, and Biology is taken.",
        hint2: "Kenji=Biology. Leila can only be in Data. That leaves Archive and Chemistry for Marco and Nadia. Use the alphabetical clue: Archive comes before Chemistry. Nadia ≠ Data (already satisfied).",
        full: "Kenji=Biology (given). Leila cannot be in Archive, Chemistry, or Biology (taken) → Leila=Data. Remaining: Archive and Chemistry for Marco and Nadia. Archive comes before Chemistry alphabetically, and Marco's room must come before Nadia's → Marco=Archive, Nadia=Chemistry."
      },
      {
        id: "C3", diff: "hard", type: "Decision Making",
        q: `Read the scenario and write a detailed plan with justification.

A PhD student must submit their thesis in 16 weeks. Three chapters remain:

  • Chapter 4 (Methods): Needs 2 weeks of revision. Must be completed before Chapter 5 can begin.
  • Chapter 5 (Results): Can only start after Chapter 4 is done. Estimated 6 weeks to write.
  • Chapter 6 (Discussion): Can be written independently at any time. Estimated 5 weeks. Supervisor says this is the most important chapter.

The student also has a conference paper due in 6 weeks, estimated to take 3 weeks to write. Submitting it would significantly help their job applications.

Total thesis work = 13 weeks. Conference paper = 3 weeks. Total available = 16 weeks.

Question: Design a week-by-week schedule for all 16 weeks. Should the student submit the conference paper? Justify all choices.`,
        scoring_guide: "Full (2): complete 16-week schedule respecting Chapter 4→5 dependency, conference paper decision justified, no conflicts. Partial (1): schedule present but dependency error or unjustified decision. Zero (0): no schedule or major errors.",
        ans_hint: "Write a week-by-week plan and explain your reasoning for the conference paper decision.",
        hint1: "Chapter 5 cannot start before Chapter 4 finishes. The conference paper is due in 6 weeks and takes 3 weeks. Can it fit alongside Chapter 4 in the first 6 weeks?",
        hint2: "Weeks 1-2: Chapter 4. Weeks 3-5: Conference paper (fits before week-6 deadline). Chapter 6 can start in parallel since it has no dependencies. Chapter 5 starts week 6, runs to week 11. Chapter 6 fills remaining weeks.",
        full: "Weeks 1-2: Chapter 4 revision. Weeks 3-5: Conference paper (submits by week 6 deadline). Weeks 3-8: Chapter 6 (independent, written in parallel). Weeks 6-11: Chapter 5 (starts after Chapter 4 done). Weeks 12-16: Buffer and integration. The conference paper should be submitted — it fits within 16 weeks without delaying the thesis dependency chain and provides significant career benefit."
      }
    ],
    jp: [
      {
        id: "C1", diff: "easy", type: "読解",
        q: `以下の文章をよく読んで、質問に答えてください。

「新型コロナウイルスのパンデミック中にリモートワークが広く普及しました。2020年から2022年にかけて実施された研究では結果が分かれています。中断が少ないことで生産性が向上したと報告した労働者がいる一方、自宅での気散じや孤立感から生産性が低下したと報告した労働者もいました。2023年に108件の研究を対象に実施されたメタ分析では、生産性の結果は主に仕事の性質によって決まることが明らかになりました。深い集中を要する役割はリモートワークから最も恩恵を受け、頻繁なコラボレーションを要する役割は悪影響を受けました。」

質問：2023年のメタ分析によると、リモートワークが生産性を向上させるか低下させるかを決定する主な要因は何でしたか？文章の例を挙げて説明してください。`,
        scoring_guide: "満点(2)：「仕事の性質」を主な要因として特定し、両方の例を挙げる。部分点(1)：要因は特定したが例が一方のみ。0点：不正解または無関係。",
        ans_hint: "主な要因を特定し、文章の例で裏付けてください。",
        hint1: "文章の前半は結果が分かれていると述べていますが、理由は説明していません。最後の文を見てください — 実際の決定要因が示されています。",
        hint2: "メタ分析では決定要因は仕事の種類そのものだとわかりました。文章には対照的な2種類の例（恩恵を受けたものと悪影響を受けたもの）が示されています。両方を挙げてみましょう。",
        full: "主な要因は仕事の性質そのものです。深い集中を要する役割はリモートワークから最も恩恵を受け、頻繁なコラボレーションを要する役割は悪影響を受けました。これが、以前の研究で結果が分かれた理由を説明しています。結果は個人の好みではなく、仕事の種類によって決まるからです。"
      },
      {
        id: "C2", diff: "medium", type: "論理的推論",
        q: `よく読んで質問に答えてください。

ある研究室には4つの部屋があります：アーカイブ室、生物学室、化学室、データ室。それぞれの部屋は研究者1人が使用しています。研究者は：ケンジ、レイラ、マルコ、ナディア。

  • レイラはアーカイブ室でも化学室でも働いていない。
  • マルコが使う部屋の名前は、アルファベット順でナディアの部屋より前に来る。
  • ケンジは生物学室で働いている。
  • ナディアはデータ室では働いていない。

質問：各研究者がどの部屋で働いているか答えてください。推論の全手順を示してください。`,
        scoring_guide: "満点(2)：4人全員の正しい割り当てと段階的推論。部分点(1)：2〜3人正解で推論あり。0点：推論なしまたは全て不正解。",
        ans_hint: "手掛かりを一つずつ確認しながら、各研究者を部屋に割り当ててください。",
        hint1: "最も直接的な手掛かりから始めましょう：ケンジ＝生物学室。次にレイラの手掛かり — アーカイブ室でも化学室でもなく、生物学室も使われています。",
        hint2: "ケンジ＝生物学室。レイラはデータ室しか残っていない。残りのアーカイブ室と化学室はマルコとナディアへ。アルファベット順で「Archive」は「Chemistry」より前に来ます。",
        full: "ケンジ＝生物学室（確定）。レイラはアーカイブ室、化学室、生物学室（使用済み）のいずれにも入れないため、レイラ＝データ室。残りのアーカイブ室と化学室はマルコとナディアへ。アルファベット順でArchiveはChemistryより前なので：マルコ＝アーカイブ室、ナディア＝化学室。"
      },
      {
        id: "C3", diff: "hard", type: "意思決定",
        q: `以下のシナリオを読み、理由を含めた詳細な計画を述べてください。

博士課程の学生が16週間以内に学位論文を提出しなければなりません。残りは3章です：

  • 第4章（研究方法）：2週間の修正が必要。第5章を始める前に完成させなければならない。
  • 第5章（結果）：第4章完成後にのみ開始可能。執筆に6週間かかる見込み。
  • 第6章（考察）：いつでも独立して執筆可能。5週間かかる見込み。指導教員はこの章が最も重要と述べている。

また、6週間後に締め切りがある学会論文があり、執筆に3週間かかる見込みです。提出すれば就職活動に大きく役立ちます。

論文執筆合計：13週間。学会論文：3週間。利用可能時間：16週間。

質問：全16週間の週ごとのスケジュールを作成してください。学会論文を提出すべきですか？すべての選択について理由を述べてください。`,
        scoring_guide: "満点(2)：第4→5章の依存関係を守る16週間の完全なスケジュール、学会論文の決定に理由あり、競合なし。部分点(1)：スケジュールはあるが依存関係の誤りまたは理由なし。0点：スケジュールなしまたは重大な誤り。",
        ans_hint: "週ごとの計画を書き、学会論文の決定について推論を説明してください。",
        hint1: "第5章は第4章が完成するまで開始できません。学会論文は6週間後が締め切りで3週間かかります。第4章と並行して最初の6週間に収まりますか？",
        hint2: "第1〜2週：第4章。第3〜5週：学会論文（第6週の締め切りに間に合う）。第6章は独立しているので並行して開始可能。第5章は第6週から開始し第11週まで。残りの週はバッファと統合。",
        full: "第1〜2週：第4章修正。第3〜5週：学会論文（第6週締め切りまでに提出）。第3〜8週：第6章（独立しているため並行執筆）。第6〜11週：第5章（第4章完成後に開始）。第12〜16週：バッファと全章の統合。学会論文は提出すべきです — 論文の依存関係を乱さずに16週間内に収まり、就職活動に大きく役立つからです。"
      }
    ]
  },

  // ── SET D (CONTROL — NO AI) ────────────────────────────────────────────────
  D: {
    en: [
      {
        id: "D1", diff: "easy", type: "Reading Comprehension",
        q: `Read the passage carefully and answer the question below.

"Honeybee colonies have been declining worldwide since the early 2000s, a phenomenon researchers call colony collapse disorder. Scientists have identified several contributing factors: pesticide exposure, loss of wildflower habitat, and a parasitic mite called Varroa destructor. A 2021 review concluded that no single cause fully explains the decline — instead, these factors interact, weakening bee immune systems and making colonies more vulnerable to disease."

Question: According to the passage, why does the 2021 review conclude that no single cause explains colony collapse disorder?`,
        scoring_guide: "Full (2): explains that the factors interact and weaken immune systems, making colonies more vulnerable to disease, rather than acting alone. Partial (1): lists factors without explaining the interaction. Zero (0): incorrect or vague.",
        ans_hint: "Write your answer in your own words.",
        hint1: "no AI available in this session",
        hint2: "no AI available in this session",
        full:  "no AI available in this session"
      },
      {
        id: "D2", diff: "medium", type: "Logical Reasoning",
        q: `Read carefully and answer the question.

Four friends — Hana, Ivan, Julia, and Kofi — each own a different pet: a cat, dog, parrot, and rabbit. Each lives on a different floor of the same building, floors 1 to 4.
  • The dog owner lives on a higher floor than Hana.
  • Ivan owns the parrot.
  • Julia lives on floor 1.
  • Kofi lives directly above the cat owner.

Question: Who owns the dog, and what floor do they live on? Show your reasoning step by step.`,
        scoring_guide: "Full (2): correctly identifies the dog owner and their floor with clear reasoning. Partial (1): correct conclusion without full reasoning, or partial reasoning with an error. Zero (0): incorrect or blank.",
        ans_hint: "Write your reasoning step by step, then give your final answer.",
        hint1: "no AI available in this session",
        hint2: "no AI available in this session",
        full:  "no AI available in this session"
      },
      {
        id: "D3", diff: "hard", type: "Decision Making",
        q: `Read the scenario and write your decision with full reasoning.

You manage a small research lab with one shared microscope. Three PhD students need access this week:
  • Student X: needs 4 hours, has a thesis committee meeting in 3 days and needs the data beforehand.
  • Student Y: needs 6 hours, has no upcoming deadline but has been waiting three weeks already.
  • Student Z: needs 2 hours, is training a new visiting researcher who only has 2 days left in the lab.

The microscope is available for 10 hours total this week, split however you choose.

Question: How do you allocate the 10 hours among the three students? Justify your reasoning.`,
        scoring_guide: "Full (2): allocation within 10 hours AND addresses urgency (X's deadline, Z's visitor constraint) and fairness (Y's wait time) explicitly. Partial (1): allocation given but only one factor justified. Zero (0): no clear allocation or exceeds hours.",
        ans_hint: "State how many hours each student gets, and why.",
        hint1: "no AI available in this session",
        hint2: "no AI available in this session",
        full:  "no AI available in this session"
      }
    ],
    jp: [
      {
        id: "D1", diff: "easy", type: "読解",
        q: `以下の文章をよく読んで、質問に答えてください。

「ミツバチのコロニーは2000年代初めから世界中で減少しており、研究者はこの現象をコロニー崩壊症候群と呼んでいます。科学者たちはいくつかの要因を特定しています：農薬への暴露、野草の生息地の喪失、そしてバロアダニと呼ばれる寄生虫です。2021年のレビューでは、単一の原因で減少を完全に説明することはできず、これらの要因が相互作用してミツバチの免疫系を弱め、コロニーをより病気にかかりやすくしていると結論付けました。」

質問：この文章によると、2021年のレビューはなぜコロニー崩壊症候群を単一の原因では説明できないと結論付けたのですか？`,
        scoring_guide: "満点(2)：要因が相互作用して免疫系を弱め、病気にかかりやすくするという仕組みを説明。部分点(1)：要因を列挙するだけで相互作用を説明しない。0点：不正解または曖昧。",
        ans_hint: "自分の言葉で答えてください。",
        hint1: "このセッションではAIは利用できません",
        hint2: "このセッションではAIは利用できません",
        full:  "このセッションではAIは利用できません"
      },
      {
        id: "D2", diff: "medium", type: "論理的推論",
        q: `よく読んで質問に答えてください。

4人の友人（ハナ、イワン、ジュリア、コフィ）がそれぞれ異なるペット（猫、犬、オウム、ウサギ）を飼っています。全員が同じビルの異なるフロア（1〜4階）に住んでいます。
  • 犬の飼い主はハナより上のフロアに住んでいる。
  • イワンはオウムを飼っている。
  • ジュリアは1階に住んでいる。
  • コフィは猫の飼い主の真上のフロアに住んでいる。

質問：犬を飼っているのは誰で、何階に住んでいますか？推論の手順を示しながら答えてください。`,
        scoring_guide: "満点(2)：犬の飼い主と階数を正しく特定し、明確な推論あり。部分点(1)：正解だが推論不完全、または推論途中で誤り。0点：不正解または空白。",
        ans_hint: "推論を段階的に書いてから、最終的な答えを示してください。",
        hint1: "このセッションではAIは利用できません",
        hint2: "このセッションではAIは利用できません",
        full:  "このセッションではAIは利用できません"
      },
      {
        id: "D3", diff: "hard", type: "意思決定",
        q: `以下のシナリオを読み、理由を含めた決定を述べてください。

あなたは共有顕微鏡が1台ある小さな研究室を管理しています。3人の博士課程の学生が今週使用する必要があります：
  • 学生X：4時間必要。3日後に論文委員会のミーティングがあり、それまでにデータが必要。
  • 学生Y：6時間必要。差し迫った締め切りはないが、すでに3週間待っている。
  • 学生Z：2時間必要。残り2日しかない訪問研究者のトレーニングを行っている。

顕微鏡は今週合計10時間使用可能で、自由に配分できます。

質問：3人の学生に10時間をどのように配分しますか？推論を述べてください。`,
        scoring_guide: "満点(2)：10時間以内の配分で、緊急性（Xの締め切り、Zの訪問者制約）と公平性（Yの待ち時間）の両方に明示的に言及。部分点(1)：配分はあるが一方の要因のみ正当化。0点：明確な配分なしまたは時間超過。",
        ans_hint: "各学生に何時間割り当てるか述べ、その理由を説明してください。",
        hint1: "このセッションではAIは利用できません",
        hint2: "このセッションではAIは利用できません",
        full:  "このセッションではAIは利用できません"
      }
    ]
  }
};

// ── ROUTING ────────────────────────────────────────────────────────────────────
function getTaskSet(pid, sessionNum, lang) {
  const setKey = getSetKey(pid, sessionNum);
  return TASK_SETS[setKey][lang] || TASK_SETS[setKey]["en"];
}

function getSetKey(pid, sessionNum) {
  if (sessionNum == 4) return "D";
  const lastChar = pid.trim().slice(-1);
  const digit    = parseInt(lastChar);
  let group;
  if ([1,4,7].includes(digit)) group = "ABC";
  else if ([2,5,8].includes(digit)) group = "BCA";
  else group = "CAB";
  return group[sessionNum - 1];
}
