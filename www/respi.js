// respi.js
(function () {
  window.MedCalcModules = window.MedCalcModules || [];

  const category = {
    id: "resp",
    name: "Respiratory",
    icon: "🫁",
    desc: "pneumonia, pulmonary embolism, asthama, COPD and etc"
  };

  const guidance = {
    curb: [
      "A higher CURB-65 score indicates greater short-term risk in community-acquired pneumonia. Scores 0–1 are often lower risk, 2 commonly prompts consideration of hospital assessment, and ≥3 suggests severe illness risk; the patient's overall condition still takes priority.",
      "Supports pneumonia severity assessment and decisions about site of care. It is not a diagnosis and should not be used alone to decide discharge or admission."
    ],
    plannedWells: [
      "The two-level result estimates whether pulmonary embolism (PE) is 'likely' or 'unlikely'; it does not confirm or exclude PE by itself.",
      "Helps select the next step in a validated PE pathway, such as D-dimer testing or imaging, according to pretest probability and clinical context."
    ],
    plannedNews: [
      "A higher NEWS2 total, a rapidly rising score, or any single parameter scoring 3 can indicate acute deterioration and need for prompt review. The score must be checked against the official chart and local escalation policy.",
      "Standardises observation of physiological derangement and helps trigger timely clinical assessment; it does not identify the cause of deterioration."
    ],
    gold1to4: [
      "GOLD 1–4 grades airflow obstruction by post-bronchodilator FEV₁ percent predicted: ≥80%, 50–79%, 30–49%, and <30%, respectively. A lower FEV₁ indicates more severe obstruction.",
      "Describes spirometric impairment in established COPD and supports severity assessment. COPD diagnosis also requires compatible context and post-bronchodilator FEV₁/FVC <0.70."
    ],
    goldABE: [
      "Group A generally means fewer symptoms and lower exacerbation risk; B means more symptoms without the higher exacerbation history defining E; E indicates ≥2 moderate exacerbations or ≥1 requiring hospitalisation in the prior year.",
      "Helps group COPD patients by symptoms and exacerbation history to inform initial management. It is separate from the GOLD 1–4 spirometric grade."
    ],
    mmrc: [
      "Higher mMRC grades indicate breathlessness that limits progressively lighter levels of activity. Grade ≥2 is commonly treated as a higher symptom burden in GOLD grouping.",
      "Provides a quick, standardised measure of functional limitation from dyspnoea, useful in COPD assessment and follow-up."
    ],
    catPlanned: [
      "No score is generated because this questionnaire is marked Planned in this version.",
      "CAT/CAAT is used to quantify COPD symptom and health-status impact and monitor change over time."
    ],
    bodePlanned: [
      "No score is generated because this index is marked Planned in this version.",
      "BODE combines body mass index, airflow obstruction, dyspnoea and exercise capacity to help estimate prognosis in COPD."
    ],
    decafPlanned: [
      "No score is generated because this score is marked Planned in this version.",
      "DECAF is used to help assess mortality risk during an acute COPD exacerbation; it should be applied using its validated variables and context."
    ],
    bap65: [
      "Higher BAP-65 scores indicate more adverse-outcome risk in acute COPD exacerbation cohorts. The score uses BUN, altered mental status, pulse and age; it is not a standalone disposition rule.",
      "Provides a rapid risk-stratification aid during acute COPD exacerbations, alongside examination, gas exchange, comorbidities and response to treatment."
    ],
    asthmaAdult: [
      "The result flags severe or potentially life-threatening features among the selected inputs. Any danger feature warrants urgent emergency assessment; a reassuring result cannot rule out serious asthma.",
      "Supports rapid recognition of acute asthma severity and escalation. Do not delay treatment or emergency help to complete a score."
    ],
    crb65: [
      "A higher CRB-65 score indicates increased pneumonia risk. It includes confusion, respiratory rate, blood pressure and age; a high score generally supports urgent hospital assessment.",
      "Offers a bedside pneumonia severity aid when blood urea is unavailable. It complements, rather than replaces, clinical judgement."
    ],
    psiPort: [
      "Higher PSI classes correspond to higher estimated 30-day mortality risk. Classes I–II are usually lower risk, class III may need observation or individualised assessment, and IV–V indicate higher risk.",
      "Helps clinicians estimate pneumonia prognosis and consider outpatient versus hospital management after checking all required variables and clinical stability."
    ],
    smartcop: [
      "Higher SMART-COP scores suggest a greater likelihood of intensive respiratory or vasopressor support being needed. Interpret using the displayed validated score bands.",
      "Identifies pneumonia patients who may need intensive monitoring or organ support; it is a risk tool, not a substitute for immediate assessment of instability."
    ],
    idsaCap: [
      "Major criteria—mechanical ventilation or septic shock requiring vasopressors—indicate severe community-acquired pneumonia. Multiple minor criteria can also support severe-CAP classification.",
      "Helps identify patients who may require ICU-level care. Apply the full guideline criteria and local clinical pathway."
    ],
    berlinArds: [
      "The classification depends on acute timing, bilateral opacities, oedema not fully explained by cardiac failure/fluid overload, and oxygenation impairment under specified respiratory support. Oxygenation alone is insufficient.",
      "Standardises ARDS definition and severity assessment to support communication, clinical decisions and research; assess all diagnostic criteria."
    ],
    globalArds: [
      "A positive classification means the selected inputs meet the chosen Global ARDS definition; eligibility depends on the definition version, imaging, oxygenation and respiratory support details.",
      "Extends standardised ARDS identification across clinical settings. Confirm the applicable definition and assess the whole patient, not just the calculator output."
    ],
    murray: [
      "A higher Murray lung injury score reflects greater abnormalities across oxygenation, chest imaging, PEEP and respiratory-system compliance. It is a descriptive severity aid, not a standalone diagnosis.",
      "Summarises several dimensions of lung injury for clinical communication and selected research/assessment contexts; interpretation depends on complete and accurate inputs."
    ],
    hacor: [
      "A higher HACOR score is associated with greater risk of non-invasive ventilation (NIV) failure in studied populations. Worsening physiology or clinical distress requires prompt reassessment regardless of score.",
      "Can support early reassessment of NIV response and escalation planning. It must not be used as an automatic intubation rule or to delay escalation."
    ],
    rox: [
      "ROX = (SpO₂/FiO₂) divided by respiratory rate. Lower or falling values can be associated with higher high-flow nasal oxygen failure risk; thresholds depend on timepoint and population.",
      "Helps monitor response to high-flow nasal oxygen and identify patients who may need closer reassessment. Use trends and clinical work of breathing, not the index alone."
    ],
    revisedGeneva: [
      "Higher Revised Geneva scores indicate higher pretest probability of PE: commonly 0–3 low, 4–10 intermediate and ≥11 high in the three-level scheme used here.",
      "Provides an objective clinical probability estimate to guide the next step in a validated PE diagnostic pathway; it does not diagnose PE."
    ],
    pesi: [
      "Higher PESI class or sPESI ≥1 indicates greater short-term mortality risk in patients with PE. PESI/sPESI are prognostic tools, not tests that diagnose PE.",
      "Helps risk-stratify patients with confirmed or suspected PE and inform monitoring and disposition alongside haemodynamics, imaging and clinical judgement."
    ],
    perc: [
      "All 8 criteria met may support no further PE testing only when clinician-estimated pretest probability is already low and the rule is appropriate to the setting. If any criterion is not met, this result does not rule out PE.",
      "Reduces unnecessary testing in carefully selected low-risk patients. It must not be used in moderate/high-risk patients or as a general PE exclusion tool."
    ],
    stopBang: [
      "A score of 0–2 is commonly low risk, 3–4 intermediate and 5–8 high risk for obstructive sleep apnoea (OSA). The score screens for risk but does not diagnose OSA.",
      "Identifies people who may benefit from further sleep assessment, particularly when symptoms or relevant comorbidities are present."
    ],
    epworth: [
      "Higher scores indicate greater self-reported likelihood of dozing. Common interpretation: 0–10 usual range, 11–12 mild, 13–15 moderate and 16–24 severe daytime sleepiness.",
      "Quantifies subjective daytime sleepiness and can support assessment or follow-up. Consider causes such as sleep deprivation, medicines and sleep disorders."
    ],
    apache2: [
      "Higher APACHE II totals generally reflect greater acute illness severity and are associated with higher mortality at population level. This version totals points entered by the user; it does not derive all physiology points from raw measurements or calculate an individual mortality probability.",
      "Supports ICU severity description and risk adjustment in appropriate settings. Use the official scoring rules, correct time window and validated clinical context."
    ],
    gcsResp: [
      "GCS ranges from 3 to 15; lower scores indicate a lower observed level of consciousness. Record eye, verbal and motor components separately. Intubation, sedation, language and age can affect scoring.",
      "Standardises serial assessment of consciousness, especially in neurological injury and acute illness. Interpret alongside the cause and trend, not the total alone."
    ],
    whoPH: [
      "WHO functional class I indicates no limitation of ordinary activity; II slight limitation; III marked limitation; IV symptoms at rest and/or signs of right-heart failure.",
      "Describes how pulmonary hypertension affects daily activity and symptoms, supporting clinical assessment and follow-up. It is a functional class, not a diagnostic test."
    ],
    spirometry: [
      "The pattern is based on FEV₁/FVC and FVC relative to the selected reference thresholds. A low FEV₁/FVC suggests obstruction; low FVC may suggest restriction but restriction requires confirmation with lung-volume testing.",
      "Helps interpret lung function in context. Use quality-assured spirometry, appropriate reference equations and lower-limit-of-normal where available; results need clinical correlation."
    ],
    hypoxemia: [
      "The result describes oxygenation using the entered measurements and thresholds. Meaning depends on baseline, altitude, perfusion, supplemental oxygen and measurement quality; pulse oximetry can be inaccurate in some circumstances.",
      "Helps recognise and grade possible low oxygenation, but does not identify the cause. Confirm concerning readings and assess the patient clinically; do not delay urgent care for a number."
    ]
  };

  const tools = [
    {
      id: "curb",
      cat: "resp",
      name: "CURB-65",
      desc: "Community-acquired pneumonia severity aid.",
      fields: [
        S("confusion", "New confusion", "0", [["0", "No"], ["1", "Yes"]]),
        S("urea", "Urea >7 mmol/L", "0", [["0", "No"], ["1", "Yes"]]),
        S("rr", "Respiratory rate ≥30/min", "0", [["0", "No"], ["1", "Yes"]]),
        S("bp", "SBP <90 or DBP ≤60 mmHg", "0", [["0", "No"], ["1", "Yes"]]),
        S("age", "Age ≥65 years", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const n = Number(v.confusion) + Number(v.urea) + Number(v.rr) + Number(v.bp) + Number(v.age);
        let c = n === 0 ? "0 points — lower risk" : n === 1 ? "1 point — increased risk" : n === 2 ? "2 points — consider hospital assessment/admission" : n === 3 ? "3 points — severe pneumonia risk" : "4–5 points — high risk";
        return {
          value: n + " / 5 — " + c,
          eq: "One point each: Confusion, Urea >7 mmol/L, RR ≥30/min, SBP <90 or DBP ≤60 mmHg, Age ≥65. This score supports, but does not replace, clinical judgement."
        };
      }
    },
    {
      id: "plannedWells",
      cat: "resp",
      name: "Wells Score — Pulmonary Embolism",
      desc: "Two-level Wells clinical pretest probability for suspected pulmonary embolism.",
      fields: [
        S("dvt", "Clinical signs of DVT", "0", [["0", "No"], ["1", "Yes"]]),
        S("alt", "PE more likely than an alternative diagnosis", "0", [["0", "No"], ["1", "Yes"]]),
        S("hr", "Heart rate >100/min", "0", [["0", "No"], ["1", "Yes"]]),
        S("immob", "Immobilisation ≥3 days or surgery in previous 4 weeks", "0", [["0", "No"], ["1", "Yes"]]),
        S("prev", "Previous DVT/PE", "0", [["0", "No"], ["1", "Yes"]]),
        S("hemo", "Haemoptysis", "0", [["0", "No"], ["1", "Yes"]]),
        S("cancer", "Active malignancy", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const n = 3 * Number(v.dvt) + 3 * Number(v.alt) + 1.5 * Number(v.hr) + 1.5 * Number(v.immob) + 1.5 * Number(v.prev) + Number(v.hemo) + 1 * Number(v.cancer);
        return {
          value: n.toFixed(1) + " points — " + (n > 4 ? "PE likely" : "PE unlikely"),
          eq: "Two-level Wells: >4 = PE likely; ≤4 = PE unlikely. Use within a validated diagnostic pathway; this score alone does not diagnose or exclude PE."
        };
      }
    },
    {
      id: "gold1to4",
      cat: "resp",
      name: "GOLD 1–4 — Airflow Obstruction Grade",
      desc: "Post-bronchodilator FEV₁ as percent predicted in established COPD.",
      fields: [N("fev1", "Post-bronchodilator FEV₁ (% predicted)", 65, { min: 0, max: 200 })],
      calc: v => {
        const x = +v.fev1;
        const g = x >= 80 ? "GOLD 1 — Mild" : x >= 50 ? "GOLD 2 — Moderate" : x >= 30 ? "GOLD 3 — Severe" : "GOLD 4 — Very severe";
        return {
          value: g,
          eq: "GOLD spirometric grades: 1 ≥80%; 2 = 50–79%; 3 = 30–49%; 4 <30% predicted. COPD diagnosis requires compatible clinical context and post-bronchodilator FEV₁/FVC <0.70."
        };
      }
    },
    {
      id: "goldABE",
      cat: "resp",
      name: "GOLD A/B/E Group",
      desc: "Symptom burden plus exacerbation history; does not replace GOLD spirometric grading.",
      fields: [
        S("symptoms", "Symptoms", "low", [["low", "Lower symptoms: mMRC 0–1 or CAT/CAAT <10"], ["high", "Higher symptoms: mMRC ≥2 or CAT/CAAT ≥10"]]),
        S("exac", "Moderate exacerbations in previous year", "0", [["0", "None"], ["1", "One, no hospitalization"], ["2", "Two or more"], ["hosp", "At least one requiring hospitalization"]])
      ],
      calc: v => {
        const e = v.exac;
        const group = (e === "2" || e === "hosp") ? "Group E" : v.symptoms === "high" ? "Group B" : "Group A";
        return {
          value: group,
          eq: "GOLD A/B/E: Group E if ≥2 moderate exacerbations or ≥1 exacerbation requiring hospitalization in the prior year; otherwise A = lower symptom burden, B = higher symptom burden. Confirm exacerbation history and use the current GOLD guidance."
        };
      }
    },
    {
      id: "mmrc",
      cat: "resp",
      name: "mMRC Dyspnea Scale",
      desc: "Modified Medical Research Council breathlessness grade.",
      fields: [
        S("grade", "Choose the best description", "0", [
          ["0", "Grade 0 — breathless only with strenuous exercise"],
          ["1", "Grade 1 — hurrying or slight hill"],
          ["2", "Grade 2 — walks slower than peers or stops at own pace"],
          ["3", "Grade 3 — stops after about 100 m or a few minutes"],
          ["4", "Grade 4 — too breathless to leave home or breathless dressing"]
        ])
      ],
      calc: v => ({
        value: "mMRC Grade " + v.grade,
        eq: "Higher mMRC grade indicates greater activity limitation from dyspnea. GOLD symptom grouping commonly uses mMRC ≥2 as higher symptom burden."
      })
    },
    {
      id: "catPlanned",
      cat: "resp",
      name: "CAT / CAAT Questionnaire",
      desc: "Planned — questionnaire total and validated interpretation not implemented yet.",
      planned: true
    },
    {
      id: "bodePlanned",
      cat: "resp",
      name: "BODE Index",
      desc: "Planned — BMI, airflow obstruction, dyspnea and exercise capacity components not implemented yet.",
      planned: true
    },
    {
      id: "decafPlanned",
      cat: "resp",
      name: "DECAF Score",
      desc: "Planned — COPD exacerbation mortality score not implemented yet.",
      planned: true
    },
    {
      id: "bap65",
      cat: "resp",
      name: "BAP-65 Score",
      desc: "Risk stratification aid for acute COPD exacerbation; uses BUN, altered mental status, pulse and age.",
      fields: [
        N("bun", "BUN (mg/dL)", 20, { min: 0 }),
        S("ams", "Altered mental status", "0", [["0", "No"], ["1", "Yes"]]),
        N("pulse", "Pulse (/min)", 90, { min: 0, max: 300 }),
        N("age", "Age (years)", 60, { min: 0, max: 120 })
      ],
      calc: v => {
        const bun = +v.bun, ams = +v.ams, p = +v.pulse, a = +v.age;
        const score = (bun > 25 ? 1 : 0) + ams + (p >= 109 ? 1 : 0) + (a >= 65 ? 1 : 0);
        return {
          value: score + " / 4 criteria",
          eq: "BAP-65 factors: BUN >25 mg/dL, altered mental status, pulse ≥109/min, age ≥65 years. Higher scores are associated with greater adverse-outcome risk. This is a risk tool, not a standalone disposition rule; check local validation and units."
        };
      }
    },
    {
      id: "asthmaAdult",
      cat: "resp",
      name: "Acute Asthma Severity Assessment (Adult)",
      desc: "Criteria-based safety assessment. Any life-threatening feature overrides the aggregate impression.",
      fields: [
        N("spo2", "SpO₂ (%)", 96, { min: 0, max: 100 }),
        N("pef", "Peak expiratory flow (% predicted/personal best)", 70, { min: 0, max: 200 }),
        N("rr", "Respiratory rate (/min)", 22, { min: 0, max: 100 }),
        N("hr", "Heart rate (/min)", 100, { min: 0, max: 250 }),
        S("speech", "Speech", "sentences", [["sentences", "Full sentences"], ["phrases", "Phrases only"], ["words", "Words only"], ["unable", "Unable to speak / exhausted"]]),
        S("features", "Danger features", "none", [["none", "None identified"], ["silent", "Silent chest, cyanosis, poor effort, confusion or collapse"]])
      ],
      calc: v => {
        const danger = v.features === "silent" || +v.spo2 < 92 || v.speech === "unable";
        const severe = +v.pef < 50 || +v.rr >= 25 || +v.hr >= 110 || v.speech === "phrases" || v.speech === "words";
        const result = danger ? "Life-threatening / potentially critical features" : severe ? "Severe features — urgent assessment" : "No severe feature identified by these selected inputs";
        return {
          value: result,
          eq: "Selected values: SpO₂ " + v.spo2 + "%; PEF " + v.pef + "%; RR " + v.rr + "/min; HR " + v.hr + "/min. Acute asthma can deteriorate rapidly; use the current local adult acute-asthma pathway. Normal values do not exclude serious disease, and do not delay emergency treatment for scoring."
        };
      }
    },
    {
      id: "crb65",
      cat: "resp",
      name: "CRB-65",
      desc: "Pneumonia severity assessment without a urea result.",
      fields: [
        S("confusion", "New confusion", "0", [["0", "No"], ["1", "Yes"]]),
        S("rr", "Respiratory rate ≥30/min", "0", [["0", "No"], ["1", "Yes"]]),
        S("bp", "SBP <90 or DBP ≤60 mmHg", "0", [["0", "No"], ["1", "Yes"]]),
        S("age", "Age ≥65 years", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const n = Number(v.confusion) + Number(v.rr) + Number(v.bp) + Number(v.age);
        return {
          value: n + " / 4 — " + (n === 0 ? "lower risk" : n === 1 ? "increased risk; consider context and comorbidity" : n === 2 ? "moderate/high risk; consider hospital assessment" : "high risk; urgent hospital assessment generally indicated"),
          eq: "One point each: confusion, RR ≥30, low BP, age ≥65. Use clinical judgement; this score does not independently determine site of care."
        };
      }
    },
    {
      id: "psiPort",
      cat: "resp",
      name: "Pneumonia Severity Index (PSI/PORT)",
      desc: "Point-based PSI estimate. Ensure each item is assessed; class I requires the separate low-risk rule.",
      fields: [
        N("age", "Age (years)", 60, { min: 0, max: 120 }),
        S("sex", "Sex adjustment", "male", [["male", "Male (+0)"], ["female", "Female (−10)"]]),
        S("nursing", "Nursing-home resident", "0", [["0", "No"], ["1", "Yes (+10)"]]),
        S("cancer", "Neoplastic disease", "0", [["0", "No"], ["1", "Yes (+30)"]]),
        S("liver", "Liver disease", "0", [["0", "No"], ["1", "Yes (+20)"]]),
        S("chf", "Congestive heart failure", "0", [["0", "No"], ["1", "Yes (+10)"]]),
        S("cva", "Cerebrovascular disease", "0", [["0", "No"], ["1", "Yes (+10)"]]),
        S("renal", "Renal disease", "0", [["0", "No"], ["1", "Yes (+10)"]]),
        S("mental", "Altered mental status", "0", [["0", "No"], ["1", "Yes (+20)"]]),
        S("rr", "RR ≥30/min", "0", [["0", "No"], ["1", "Yes (+20)"]]),
        S("sbp", "SBP <90 mmHg", "0", [["0", "No"], ["1", "Yes (+20)"]]),
        S("temp", "Temperature <35°C or ≥40°C", "0", [["0", "No"], ["1", "Yes (+15)"]]),
        S("pulse", "Pulse ≥125/min", "0", [["0", "No"], ["1", "Yes (+10)"]]),
        S("ph", "Arterial pH <7.35", "0", [["0", "No"], ["1", "Yes (+30)"]]),
        S("bun", "BUN ≥30 mg/dL", "0", [["0", "No"], ["1", "Yes (+20)"]]),
        S("na", "Sodium <130 mmol/L", "0", [["0", "No"], ["1", "Yes (+20)"]]),
        S("glucose", "Glucose ≥250 mg/dL", "0", [["0", "No"], ["1", "Yes (+10)"]]),
        S("hct", "Hematocrit <30%", "0", [["0", "No"], ["1", "Yes (+10)"]]),
        S("oxygen", "PaO₂ <60 mmHg or SpO₂ <90%", "0", [["0", "No"], ["1", "Yes (+10)"]]),
        S("effusion", "Pleural effusion", "0", [["0", "No"], ["1", "Yes (+10)"]])
      ],
      calc: v => {
        let n = +v.age + (v.sex === "female" ? -10 : 0) + 10 * +v.nursing + 30 * +v.cancer + 20 * +v.liver + 10 * +v.chf + 10 * +v.cva + 10 * +v.renal + 20 * +v.mental + 20 * +v.rr + 20 * +v.sbp + 15 * +v.temp + 10 * +v.pulse + 30 * +v.ph + 20 * +v.bun + 20 * +v.na + 10 * +v.glucose + 10 * +v.hct + 10 * +v.oxygen + 10 * +v.effusion;
        let c = n <= 70 ? "Class II range (≤70)" : n <= 90 ? "Class III range (71–90)" : n <= 130 ? "Class IV range (91–130)" : "Class V range (>130)";
        return {
          value: n + " points — " + c,
          eq: "PSI points are an aid to mortality-risk/site-of-care assessment. Class I uses a separate low-risk rule and is not assigned by this point total alone. Verify units and the complete validated PSI algorithm; clinical judgement takes priority."
        };
      }
    },
    {
      id: "smartcop",
      cat: "resp",
      name: "SMART-COP",
      desc: "Predicts need for intensive respiratory or vasopressor support in CAP.",
      fields: [
        S("sbp", "Low systolic BP criterion", "0", [["0", "No"], ["2", "Yes — 2 points"]]),
        S("multi", "Multilobar chest radiograph involvement", "0", [["0", "No"], ["1", "Yes — 1 point"]]),
        S("albumin", "Albumin <3.5 g/dL", "0", [["0", "No"], ["1", "Yes — 1 point"]]),
        S("rr", "Tachypnea criterion for age", "0", [["0", "No"], ["1", "Yes — 1 point"]]),
        S("pulse", "Heart rate ≥125/min", "0", [["0", "No"], ["1", "Yes — 1 point"]]),
        S("confusion", "Confusion", "0", [["0", "No"], ["1", "Yes — 1 point"]]),
        S("oxygen", "Low oxygenation criterion for age", "0", [["0", "No"], ["2", "Yes — 2 points"]]),
        S("ph", "Arterial pH <7.35", "0", [["0", "No"], ["2", "Yes — 2 points"]])
      ],
      calc: v => {
        const n = 2 * +v.sbp + +v.multi + +v.albumin + +v.rr + +v.pulse + +v.confusion + 2 * +v.oxygen + 2 * +v.ph;
        return {
          value: n + " points",
          eq: "SMART-COP total (0–11): 0–2 lower, 3–4 moderate, 5–6 high, ≥7 very high risk of intensive respiratory/vasopressor support. Apply the original age-specific RR, BP and oxygenation definitions; the inputs here are simplified flags."
        };
      }
    },
    {
      id: "idsaCap",
      cat: "resp",
      name: "IDSA/ATS Severe CAP Criteria",
      desc: "Major/minor criteria for severe community-acquired pneumonia.",
      fields: [
        S("vent", "Invasive mechanical ventilation required", "0", [["0", "No"], ["1", "Yes — major criterion"]]),
        S("shock", "Septic shock requiring vasopressors", "0", [["0", "No"], ["1", "Yes — major criterion"]]),
        S("rr", "RR ≥30/min", "0", [["0", "No"], ["1", "Yes"]]),
        S("oxygen", "PaO₂/FiO₂ ≤250", "0", [["0", "No"], ["1", "Yes"]]),
        S("multi", "Multilobar infiltrates", "0", [["0", "No"], ["1", "Yes"]]),
        S("confusion", "Confusion/disorientation", "0", [["0", "No"], ["1", "Yes"]]),
        S("bun", "BUN ≥20 mg/dL", "0", [["0", "No"], ["1", "Yes"]]),
        S("wbc", "WBC <4,000/µL", "0", [["0", "No"], ["1", "Yes"]]),
        S("platelets", "Platelets <100,000/µL", "0", [["0", "No"], ["1", "Yes"]]),
        S("temp", "Temperature <36°C", "0", [["0", "No"], ["1", "Yes"]]),
        S("bp", "Hypotension requiring aggressive fluid resuscitation", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const major = +v.vent + +v.shock;
        const minor = +v.rr + +v.oxygen + +v.multi + +v.confusion + +v.bun + +v.wbc + +v.platelets + +v.temp + +v.bp;
        return {
          value: major ? "Severe CAP — major criterion present" : minor >= 3 ? "Severe CAP — " + minor + " minor criteria" : "Severe CAP criteria not met by selected items",
          eq: "Severe CAP is defined by ≥1 major criterion or ≥3 minor criteria. Minor criteria count = " + minor + ". Confirm all criteria and use clinical judgement."
        };
      }
    },
    {
      id: "berlinArds",
      cat: "resp",
      name: "Berlin ARDS Definition",
      desc: "Criteria-based assessment and oxygenation severity in acute respiratory distress syndrome.",
      fields: [
        S("timing", "Onset within 1 week of known insult/new respiratory symptoms", "1", [["1", "Yes"], ["0", "No"]]),
        S("imaging", "Bilateral opacities not fully explained by effusions/collapse/nodules", "1", [["1", "Yes"], ["0", "No"]]),
        S("origin", "Respiratory failure not fully explained by cardiac failure/fluid overload", "1", [["1", "Yes"], ["0", "No"], ["u", "Uncertain — further assessment needed"]]),
        N("pf", "PaO₂/FiO₂ ratio (mmHg)", 180, { min: 0, max: 800 }),
        N("peep", "PEEP/CPAP (cm H₂O)", 5, { min: 0, max: 40 })
      ],
      calc: v => {
        const criteria = v.timing === "1" && v.imaging === "1" && v.origin === "1" && +v.peep >= 5;
        const pf = +v.pf;
        const sev = pf > 200 && pf <= 300 ? "Mild oxygenation category" : pf > 100 && pf <= 200 ? "Moderate oxygenation category" : pf <= 100 ? "Severe oxygenation category" : "Does not meet Berlin oxygenation range";
        return {
          value: criteria ? "Berlin criteria supported — " + sev : "Berlin criteria not confirmed from selected inputs",
          eq: "Berlin requires acute timing, bilateral opacities, edema not fully explained by cardiac failure/fluid overload, and PEEP/CPAP ≥5 cm H₂O. P/F: 200–300 mild, >100–200 moderate, ≤100 severe. Requires clinical confirmation."
        };
      }
    },
    {
      id: "globalArds",
      cat: "resp",
      name: "Global ARDS Definition Check",
      desc: "Criteria-based screening; definitions and oxygenation pathways depend on ventilatory support and available measurements.",
      fields: [
        S("timing", "Acute onset within 1 week", "1", [["1", "Yes"], ["0", "No"]]),
        S("imaging", "Bilateral opacities on imaging", "1", [["1", "Yes"], ["0", "No"]]),
        S("origin", "Not primarily explained by cardiac failure/fluid overload", "1", [["1", "Yes"], ["0", "No"], ["u", "Uncertain"]]),
        S("support", "Respiratory support", "invasive", [["invasive", "Invasive ventilation with PEEP ≥5"], ["niv", "NIV/CPAP with pressure support ≥5"], ["hfno", "HFNO ≥30 L/min"], ["none", "No qualifying support"]]),
        N("pf", "PaO₂/FiO₂ (if available; otherwise enter 0)", 180, { min: 0, max: 800 }),
        N("sf", "SpO₂/FiO₂ ratio (if available; otherwise enter 0)", 0, { min: 0, max: 500 })
      ],
      calc: v => {
        const support = v.support !== "none";
        const oxygen = (+v.pf > 0 && +v.pf <= 300) || (+v.sf > 0 && +v.sf <= 315);
        const valid = v.timing === "1" && v.imaging === "1" && v.origin === "1" && support && oxygen;
        return {
          value: valid ? "Global ARDS criteria may be met" : "Criteria not established from selected inputs",
          eq: "This is a screening aid only. Global definitions may use P/F ≤300 or S/F ≤315 (when applicable), with qualifying respiratory support and imaging/clinical criteria. SpO₂-based ratios have limitations, particularly at high saturations; verify the current Global ARDS definition and local protocol."
        };
      }
    },
    {
      id: "murray",
      cat: "resp",
      name: "Murray Lung Injury Score",
      desc: "Four-component lung injury score; interpret with the clinical picture.",
      fields: [
        S("xray", "Chest radiograph quadrants with alveolar consolidation", "0", [["0", "0 quadrants — 0"], ["1", "1 quadrant — 1"], ["2", "2 quadrants — 2"], ["3", "3 quadrants — 3"], ["4", "4 quadrants — 4"]]),
        S("pf", "PaO₂/FiO₂ ratio", "0", [["0", ">300 — 0"], ["1", "225–300 — 1"], ["2", "175–224 — 2"], ["3", "100–174 — 3"], ["4", "<100 — 4"]]),
        S("peep", "PEEP (cm H₂O)", "0", [["0", "≤5 — 0"], ["1", "6–8 — 1"], ["2", "9–11 — 2"], ["3", "12–14 — 3"], ["4", "≥15 — 4"]]),
        S("compliance", "Respiratory system compliance (mL/cm H₂O)", "0", [["0", ">80 — 0"], ["1", "60–79 — 1"], ["2", "40–59 — 2"], ["3", "20–39 — 3"], ["4", "<20 — 4"]])
      ],
      calc: v => {
        const n = (+v.xray + +v.pf + +v.peep + +v.compliance) / 4;
        return {
          value: n.toFixed(2) + " / 4",
          eq: "Murray score = mean of four component scores. Higher scores indicate greater lung injury; commonly ≥2.5 has been used to identify severe lung injury, but it is not a standalone ARDS diagnostic or treatment rule."
        };
      }
    },
    {
      id: "hacor",
      cat: "resp",
      name: "HACOR Score",
      desc: "Early risk score during non-invasive ventilation; use the validated scoring table and clinical context.",
      fields: [
        S("hr", "Heart rate (/min)", "0", [["0", "<100 — 0"], ["1", "100–120 — 1"], ["2", ">120 — 2"]]),
        S("ph", "Arterial pH", "0", [["0", "≥7.35 — 0"], ["2", "7.30–7.34 — 2"], ["3", "7.25–7.29 — 3"], ["5", "7.20–7.24 — 5"], ["8", "<7.20 — 8"]]),
        S("gcs", "GCS", "0", [["0", "15 — 0"], ["2", "13–14 — 2"], ["5", "11–12 — 5"], ["10", "≤10 — 10"]]),
        S("pf", "PaO₂/FiO₂", "0", [["0", ">300 — 0"], ["1", "201–300 — 1"], ["2", "176–200 — 2"], ["3", "151–175 — 3"], ["4", "126–150 — 4"], ["5", "101–125 — 5"], ["6", "≤100 — 6"]]),
        S("rr", "Respiratory rate (/min)", "0", [["0", "≤30 — 0"], ["1", "31–35 — 1"], ["2", "36–40 — 2"], ["3", "41–45 — 3"], ["4", ">45 — 4"]])
      ],
      calc: v => {
        const n = +v.hr + +v.ph + +v.gcs + +v.pf + +v.rr;
        return {
          value: n + " points",
          eq: "HACOR = heart rate + acidosis + consciousness + oxygenation + respiratory rate points. A score >5 at 1–2 hours of NIV has been associated with NIV failure in studied populations. Do not delay intubation or escalation when clinically indicated; confirm the scoring table for your setting."
        };
      }
    },
    {
      id: "rox",
      cat: "resp",
      name: "ROX Index",
      desc: "HFNO monitoring index: (SpO₂/FiO₂) ÷ respiratory rate.",
      fields: [
        N("spo2", "SpO₂ (%)", 94, { min: 0, max: 100 }),
        N("fio2", "FiO₂ (%)", 50, { min: 21, max: 100 }),
        N("rr", "Respiratory rate (/min)", 28, { min: 1, max: 100 }),
        S("time", "Assessment time", "6", [["2", "2 hours"], ["6", "6 hours"], ["12", "12 hours"]])
      ],
      calc: v => {
        const r = (+v.spo2 / (+v.fio2 / 100)) / (+v.rr);
        let cut = v.time === "2" ? 2.85 : v.time === "6" ? 3.47 : 3.85;
        return {
          value: r.toFixed(2),
          eq: "ROX = (SpO₂ ÷ FiO₂ as fraction) ÷ RR. At " + v.time + " h, a value below " + cut.toFixed(2) + " has been associated with higher HFNO failure risk in original cohorts; ≥4.88 has been associated with lower risk. These are context-specific thresholds, not standalone escalation rules."
        };
      }
    },
    {
      id: "revisedGeneva",
      cat: "resp",
      name: "Revised Geneva Score",
      desc: "Clinical pretest probability for suspected pulmonary embolism; objective items.",
      fields: [
        S("age", "Age >65 years", "0", [["0", "No"], ["1", "Yes — 1"]]),
        S("prev", "Previous DVT/PE", "0", [["0", "No"], ["3", "Yes — 3"]]),
        S("surgery", "Surgery/fracture within 1 month", "0", [["0", "No"], ["2", "Yes — 2"]]),
        S("cancer", "Active malignancy", "0", [["0", "No"], ["2", "Yes — 2"]]),
        S("pain", "Unilateral lower limb pain", "0", [["0", "No"], ["3", "Yes — 3"]]),
        S("hemo", "Hemoptysis", "0", [["0", "No"], ["2", "Yes — 2"]]),
        S("hr", "Heart rate", "0", [["0", "<75/min — 0"], ["3", "75–94/min — 3"], ["5", "≥95/min — 5"]]),
        S("dvtSigns", "Pain on deep venous palpation and unilateral edema", "0", [["0", "No"], ["4", "Yes — 4"]])
      ],
      calc: v => {
        const n = +v.age + +v.prev + +v.surgery + +v.cancer + +v.pain + +v.hemo + +v.hr + +v.dvtSigns;
        return {
          value: n + " points — " + (n <= 3 ? "low probability" : n <= 10 ? "intermediate probability" : "high probability"),
          eq: "Revised Geneva three-level interpretation: 0–3 low, 4–10 intermediate, ≥11 high. Use with the validated PE diagnostic pathway and clinical judgement."
        };
      }
    },
    {
      id: "pesi",
      cat: "resp",
      name: "PESI / sPESI",
      desc: "Pulmonary embolism severity index. Select each finding; this estimates prognosis, not PE diagnosis.",
      fields: [
        N("age", "Age (years)", 60, { min: 0, max: 120 }),
        S("male", "Male sex", "0", [["0", "No"], ["1", "Yes (+10 PESI)"]]),
        S("cancer", "Cancer", "0", [["0", "No"], ["1", "Yes"]]),
        S("chf", "Heart failure", "0", [["0", "No"], ["1", "Yes"]]),
        S("lung", "Chronic lung disease", "0", [["0", "No"], ["1", "Yes"]]),
        S("hr", "Heart rate ≥110/min", "0", [["0", "No"], ["1", "Yes"]]),
        S("sbp", "SBP <100 mmHg", "0", [["0", "No"], ["1", "Yes"]]),
        S("rr", "Respiratory rate ≥30/min", "0", [["0", "No"], ["1", "Yes"]]),
        S("temp", "Temperature <36°C", "0", [["0", "No"], ["1", "Yes"]]),
        S("mental", "Altered mental status", "0", [["0", "No"], ["1", "Yes"]]),
        S("spo2", "SpO₂ <90%", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const cancer = +v.cancer, chf = +v.chf, lung = +v.lung, hr = +v.hr, sbp = +v.sbp, rr = +v.rr, temp = +v.temp, mental = +v.mental, spo = +v.spo2;
        const pesi = +v.age + 10 * +v.male + 30 * cancer + 10 * chf + 10 * lung + 20 * hr + 30 * sbp + 20 * rr + 20 * temp + 60 * mental + 20 * spo;
        const sp = (+v.age > 80 ? 1 : 0) + cancer + ((chf || lung) ? 1 : 0) + hr + sbp + spo;
        const cls = pesi <= 65 ? "Class I" : pesi <= 85 ? "Class II" : pesi <= 105 ? "Class III" : pesi <= 125 ? "Class IV" : "Class V";
        return {
          value: "PESI " + pesi + " — " + cls + "; sPESI " + sp + " / 6",
          eq: "PESI classes: I ≤65, II 66–85, III 86–105, IV 106–125, V >125. sPESI: 0 = lower risk; ≥1 = elevated risk. Inputs use the standard variables shown; verify scoring and clinical context. Not a diagnostic test for PE."
        };
      }
    },
    {
      id: "perc",
      cat: "resp",
      name: "PERC Rule",
      desc: "Can be used only when clinician-estimated pretest probability is already low.",
      fields: [
        S("age", "Age <50 years", "0", [["1", "Yes — criterion met"], ["0", "No"]]),
        S("pulse", "Pulse <100/min", "0", [["1", "Yes — criterion met"], ["0", "No"]]),
        S("spo2", "SpO₂ ≥95%", "0", [["1", "Yes — criterion met"], ["0", "No"]]),
        S("hemoptysis", "No hemoptysis", "0", [["1", "Yes — criterion met"], ["0", "No"]]),
        S("estrogen", "No exogenous estrogen", "0", [["1", "Yes — criterion met"], ["0", "No"]]),
        S("prev", "No previous DVT/PE", "0", [["1", "Yes — criterion met"], ["0", "No"]]),
        S("surgery", "No recent surgery/trauma requiring hospitalization", "0", [["1", "Yes — criterion met"], ["0", "No"]]),
        S("dvt", "No unilateral leg swelling", "0", [["1", "Yes — criterion met"], ["0", "No"]])
      ],
      calc: v => {
        const n = Object.values(v).reduce((a, b) => a + Number(b), 0);
        return {
          value: n + " / 8 criteria met",
          eq: n === 8 ? "All 8 PERC criteria are met. In a patient with low clinician-assessed pretest probability, PERC may support no further testing under a validated pathway." : "At least one PERC criterion is not met. PERC cannot rule out PE; continue assessment using an appropriate validated diagnostic pathway."
        };
      }
    },
    {
      id: "stopBang",
      cat: "resp",
      name: "STOP-BANG Sleep Apnea Screen",
      desc: "Screening questionnaire for obstructive sleep apnea risk; not diagnostic.",
      fields: [
        S("snore", "Snoring loudly", "0", [["0", "No"], ["1", "Yes"]]),
        S("tired", "Often tired/daytime sleepy", "0", [["0", "No"], ["1", "Yes"]]),
        S("observed", "Observed apnea", "0", [["0", "No"], ["1", "Yes"]]),
        S("pressure", "Treated/high blood pressure", "0", [["0", "No"], ["1", "Yes"]]),
        S("bmi", "BMI >35 kg/m²", "0", [["0", "No"], ["1", "Yes"]]),
        S("age", "Age >50 years", "0", [["0", "No"], ["1", "Yes"]]),
        S("neck", "Neck circumference >40 cm", "0", [["0", "No"], ["1", "Yes"]]),
        S("gender", "Male sex", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const n = Object.values(v).reduce((a, b) => a + Number(b), 0);
        return {
          value: n + " / 8 — " + (n <= 2 ? "low risk" : n <= 4 ? "intermediate risk" : "high risk"),
          eq: "STOP-BANG: 0–2 low, 3–4 intermediate, 5–8 high risk (commonly used interpretation). Screening does not diagnose OSA; consider formal sleep assessment when indicated."
        };
      }
    },
    {
      id: "epworth",
      cat: "resp",
      name: "Epworth Sleepiness Scale",
      desc: "Rate likelihood of dozing in eight situations from 0 to 3.",
      fields: [
        N("q1", "Sitting and reading (0–3)", 0, { min: 0, max: 3, step: 1 }),
        N("q2", "Watching TV (0–3)", 0, { min: 0, max: 3, step: 1 }),
        N("q3", "Sitting inactive in public (0–3)", 0, { min: 0, max: 3, step: 1 }),
        N("q4", "Passenger in car for an hour (0–3)", 0, { min: 0, max: 3, step: 1 }),
        N("q5", "Lying down in afternoon (0–3)", 0, { min: 0, max: 3, step: 1 }),
        N("q6", "Talking to someone (0–3)", 0, { min: 0, max: 3, step: 1 }),
        N("q7", "Sitting quietly after lunch (0–3)", 0, { min: 0, max: 3, step: 1 }),
        N("q8", "In a car stopped in traffic (0–3)", 0, { min: 0, max: 3, step: 1 })
      ],
      calc: v => {
        const n = Object.values(v).reduce((a, b) => a + Number(b), 0);
        return {
          value: n + " / 24 — " + (n <= 10 ? "usual range" : n <= 12 ? "mild excessive daytime sleepiness" : n <= 15 ? "moderate excessive daytime sleepiness" : "severe excessive daytime sleepiness"),
          eq: "Common interpretation: 0–10 usual range; 11–12 mild; 13–15 moderate; 16–24 severe subjective daytime sleepiness. Interpret clinically."
        };
      }
    },
    {
      id: "apache2",
      cat: "resp",
      name: "APACHE II Score",
      desc: "Enter each acute physiology component's points from the official APACHE II scoring table, plus age and chronic health points.",
      fields: [
        S("temp", "Temperature component points", "0", [["0", "0 points"], ["1", "1 point"], ["2", "2 points"], ["3", "3 points"], ["4", "4 points"]]),
        S("map", "Mean arterial pressure points", "0", [["0", "0 points"], ["1", "1 point"], ["2", "2 points"], ["3", "3 points"], ["4", "4 points"]]),
        S("hr", "Heart rate points", "0", [["0", "0 points"], ["1", "1 point"], ["2", "2 points"], ["3", "3 points"], ["4", "4 points"]]),
        S("rr", "Respiratory rate points", "0", [["0", "0 points"], ["1", "1 point"], ["2", "2 points"], ["3", "3 points"], ["4", "4 points"]]),
        S("oxygen", "Oxygenation points", "0", [["0", "0 points"], ["1", "1 point"], ["2", "2 points"], ["3", "3 points"], ["4", "4 points"]]),
        S("ph", "Arterial pH points", "0", [["0", "0 points"], ["1", "1 point"], ["2", "2 points"], ["3", "3 points"], ["4", "4 points"]]),
        S("na", "Sodium points", "0", [["0", "0 points"], ["1", "1 point"], ["2", "2 points"], ["3", "3 points"], ["4", "4 points"]]),
        S("k", "Potassium points", "0", [["0", "0 points"], ["1", "1 point"], ["2", "2 points"], ["3", "3 points"], ["4", "4 points"]]),
        S("creatinine", "Creatinine points (double if acute renal failure)", "0", [["0", "0 points"], ["1", "1 point"], ["2", "2 points"], ["3", "3 points"], ["4", "4 points"], ["6", "6 points"], ["8", "8 points"]]),
        S("hct", "Hematocrit points", "0", [["0", "0 points"], ["1", "1 point"], ["2", "2 points"], ["3", "3 points"], ["4", "4 points"]]),
        S("wbc", "WBC points", "0", [["0", "0 points"], ["1", "1 point"], ["2", "2 points"], ["3", "3 points"], ["4", "4 points"]]),
        N("gcs", "GCS (3–15)", 15, { min: 3, max: 15, step: 1 }),
        S("age", "Age points", "0", [["0", "≤44 years — 0"], ["2", "45–54 years — 2"], ["3", "55–64 years — 3"], ["5", "65–74 years — 5"], ["6", "≥75 years — 6"]]),
        S("chronic", "Chronic health points", "0", [["0", "No qualifying chronic health points"], ["2", "2 points — elective postoperative"], ["5", "5 points — nonoperative/emergency postoperative"]])
      ],
      calc: v => {
        const aps = +v.temp + +v.map + +v.hr + +v.rr + +v.oxygen + +v.ph + +v.na + +v.k + +v.creatinine + +v.hct + +v.wbc;
        const total = aps + (15 - +v.gcs) + +v.age + +v.chronic;
        return {
          value: total + " points",
          eq: "APACHE II = acute physiology points (entered from the official scoring table) + (15 − GCS) + age points + chronic health points. This tool totals component points but does not derive acute physiology points from raw laboratory/vital values. Use official APACHE II rules and appropriate ICU context."
        };
      }
    },
    {
      id: "gcsResp",
      cat: "resp",
      name: "Glasgow Coma Scale (GCS)",
      desc: "Choose observed best eye, verbal and motor responses. Also available under Neurology.",
      fields: [
        S("eye", "Eye response", "4", [["4", "4 — Spontaneous"], ["3", "3 — To sound"], ["2", "2 — To pressure"], ["1", "1 — None"]]),
        S("verbal", "Verbal response", "5", [["5", "5 — Oriented"], ["4", "4 — Confused"], ["3", "3 — Words"], ["2", "2 — Sounds"], ["1", "1 — None"]]),
        S("motor", "Motor response", "6", [["6", "6 — Obeys commands"], ["5", "5 — Localizes"], ["4", "4 — Normal flexion/withdrawal"], ["3", "3 — Abnormal flexion"], ["2", "2 — Extension"], ["1", "1 — None"]])
      ],
      calc: v => {
        const n = +v.eye + +v.verbal + +v.motor;
        return {
          value: n + " / 15",
          eq: "E" + v.eye + " V" + v.verbal + " M" + v.motor + ". Common severity descriptors: 13–15 mild, 9–12 moderate, 3–8 severe brain injury; interpret cautiously and document components. Intubation, sedation, language and age affect assessment."
        };
      }
    },
    {
      id: "whoPH",
      cat: "resp",
      name: "WHO Pulmonary Hypertension Functional Class",
      desc: "Functional limitation due to pulmonary hypertension (WHO/NYHA functional class).",
      fields: [
        S("class", "Functional class", "I", [["I", "Class I — no limitation of ordinary activity"], ["II", "Class II — slight limitation; comfortable at rest"], ["III", "Class III — marked limitation; comfortable at rest"], ["IV", "Class IV — symptoms at rest and/or signs of right-heart failure"]])
      ],
      calc: v => ({
        value: "WHO functional class " + v.class,
        eq: "Class is assigned from symptom burden and activity limitation. It is a clinical classification, not a numeric score; assess the patient directly."
      })
    },
    {
      id: "spirometry",
      cat: "resp",
      name: "Spirometry Interpretation",
      desc: "Screening pattern from FEV₁/FVC and percent-predicted values; use age-appropriate lower limit of normal when available.",
      fields: [
        N("ratio", "FEV₁/FVC ratio (decimal; e.g. 0.68)", 0.68, { min: 0, max: 2, step: 0.01 }),
        N("fev1", "FEV₁ (% predicted)", 70, { min: 0, max: 200 }),
        N("fvc", "FVC (% predicted)", 80, { min: 0, max: 200 }),
        S("basis", "Obstruction threshold", "fixed", [["fixed", "Fixed ratio 0.70"], ["lln", "Use LLN-based threshold supplied by a respiratory lab"]])
      ],
      calc: v => {
        const obstruct = v.basis === "fixed" ? +v.ratio < 0.70 : false;
        const lowFvc = +v.fvc < 80;
        let pattern;
        if (obstruct && lowFvc) pattern = "Obstructive pattern with low FVC — consider mixed disease or air trapping; lung volumes may be needed";
        else if (obstruct) pattern = "Obstructive ventilatory pattern";
        else if (lowFvc) pattern = "Possible restrictive pattern — restriction requires confirmation by lung volumes";
        else pattern = "No obstruction by selected threshold and FVC not reduced";
        return {
          value: pattern,
          eq: "FEV₁/FVC = " + (+v.ratio).toFixed(2) + "; FEV₁ " + v.fev1 + "% predicted; FVC " + v.fvc + "% predicted. For LLN mode, this compact tool cannot calculate the LLN: compare the ratio with the lab's LLN. Spirometry alone cannot confirm restriction."
        };
      }
    },
    {
      id: "hypoxemia",
      cat: "resp",
      name: "Hypoxemia Assessment",
      desc: "Classifies oxygenation measurements; interpret with altitude, oxygen therapy and clinical status.",
      fields: [
        S("measure", "Measurement", "spo2", [["spo2", "Pulse oximetry SpO₂ (%)"], ["pao2", "Arterial PaO₂ (mmHg)"]]),
        N("value", "Measured value", 94, { min: 0, max: 800 }),
        S("oxygen", "Supplemental oxygen being used?", "no", [["no", "No"], ["yes", "Yes"]])
      ],
      calc: v => {
        const n = +v.value;
        let c;
        if (v.measure === "spo2") {
          c = n >= 95 ? "No hypoxemia by common resting SpO₂ threshold" : n >= 90 ? "Low SpO₂ — assess clinical context and trend" : "Markedly low SpO₂ — urgent assessment generally required";
        } else {
          c = n >= 80 ? "PaO₂ ≥80 mmHg" : n >= 60 ? "Mild hypoxemia range (60–79 mmHg)" : n >= 40 ? "Moderate hypoxemia range (40–59 mmHg)" : "Severe hypoxemia range (<40 mmHg)";
        }
        return {
          value: c,
          eq: "Entered " + (v.measure === "spo2" ? "SpO₂" : "PaO₂") + " = " + n + (v.measure === "spo2" ? "%" : " mmHg") + ". Supplemental oxygen: " + (v.oxygen === "yes" ? "yes" : "no") + ". Pulse oximetry may be inaccurate in poor perfusion, dyshemoglobinemia and other settings; oxygenation must be interpreted clinically."
        };
      }
    }
  ];

  window.MedCalcModules.push({
    category: category,
    guidance: guidance,
    tools: tools
  });
})();
