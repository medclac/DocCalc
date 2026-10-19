// respi.js
(function () {
  window.MedCalcModules = window.MedCalcModules || [];

  const category = {
    id: "resp",
    name: "Respiratory",
    icon: "🫁",
    desc: "pneumonia, pulmonary embolism, asthma, COPD, and etc"
  };

  const guidance = {
    curb: [
      "A higher CURB-65 score indicates greater short-term risk in community-acquired pneumonia (Lim et al., 2003).",
      "**Low Risk (0–1 points):** Often suitable for outpatient management or lower-intensity care, provided social and clinical circumstances permit. What is usually done: Consider outpatient treatment with oral antibiotics and follow-up arrangements.",
      "**Moderate Risk (2 points):** Indicates increased risk requiring closer observation. What is usually done: Prompt hospital assessment and consideration of inpatient or short-stay admission.",
      "**Severe Risk (3–5 points):** Suggests severe illness with high short-term mortality risk. What is usually done: Urgent hospital admission, often with evaluation for high-dependency or intensive care unit (ICU) level support.",
      "Supports pneumonia severity assessment and decisions about site of care. It is not a diagnosis and should not be used alone to decide discharge or admission."
    ],
    plannedWells: [
      "The two-level result estimates whether pulmonary embolism (PE) is 'likely' or 'unlikely'; it does not confirm or exclude PE by itself (Wells et al., 2000).",
      "**PE Unlikely (≤4 points):** Low to intermediate pretest probability. What is usually done: Proceed with a high-sensitivity D-dimer blood test; if negative, PE is effectively excluded without imaging in low-risk pathways.",
      "**PE Likely (>4 points):** Moderate to high pretest probability. What is usually done: Proceed directly to diagnostic imaging, typically CT pulmonary angiography (CTPA), bypassing routine D-dimer testing.",
      "Helps select the next step in a validated PE pathway according to pretest probability and clinical context."
    ],
    plannedNews: [
      "A higher NEWS2 total, a rapidly rising score, or any single parameter scoring 3 can indicate acute deterioration and need for prompt review (Royal College of Physicians, 2017).",
      "**Low Score (0–4 total):** Routine monitoring or ward-based care. What is usually done: Continue standard frequency observations as per local clinical monitoring guidelines.",
      "**Medium Score (5–6 total, or a single score of 3):** Signals moderate physiological derangement. What is usually done: Urgent ward-based clinical review by a registered nurse or junior doctor, and increased monitoring frequency.",
      "**High Score (≥7 total):** Indicates severe acute illness and high risk of rapid deterioration. What is usually done: Emergency assessment by a medical/critical care response team immediately.",
      "Standardises observation of physiological derangement and helps trigger timely clinical assessment; it does not identify the cause of deterioration."
    ],
    gold1to4: [
      "GOLD 1–4 grades airflow obstruction by post-bronchodilator FEV₁ percent predicted (Global Initiative for Chronic Obstructive Lung Disease, 2024).",
      "**GOLD 1 (Mild, ≥80% predicted):** Mild airflow limitation. What is usually done: Inform patient, offer smoking cessation support, and prescribe short-acting bronchodilators as needed.",
      "**GOLD 2 (Moderate, 50–79% predicted):** Moderate airflow limitation with increasing symptoms. What is usually done: Add regular long-acting bronchodilator therapy (LAMA or LABA) and pulmonary rehabilitation referrals if indicated.",
      "**GOLD 3 (Severe, 30–49% predicted):** Severe airflow limitation and pronounced breathlessness. What is usually done: Evaluate for combination inhaler therapies (ICS/LABA/LAMA), assess for chronic hypoxemia, and manage frequent exacerbations.",
      "**GOLD 4 (Very Severe, <30% predicted):** Very severe airflow limitation with significant impact on daily life and high risk of respiratory failure. What is usually done: Comprehensive pulmonary care, long-term oxygen therapy assessment if indicated, and palliative support discussion.",
      "Describes spirometric impairment in established COPD and supports severity assessment. COPD diagnosis also requires compatible context and post-bronchodilator FEV₁/FVC <0.70."
    ],
    goldABE: [
      "Group A generally means fewer symptoms and lower exacerbation risk; B means more symptoms without the higher exacerbation history defining E; E indicates ≥2 moderate exacerbations or ≥1 requiring hospitalisation in the prior year (Global Initiative for Chronic Obstructive Lung Disease, 2024).",
      "**Group A:** Low symptoms, low exacerbation history. What is usually done: A short- or long-acting bronchodilator.",
      "**Group B:** High symptoms, low exacerbation history. What is usually done: Long-acting bronchodilator monotherapy (LAMA or LABA), escalating to dual therapy if symptoms persist.",
      "**Group E:** High exacerbation history (regardless of symptom score). What is usually done: Initial therapy typically starts with LAMA/LABA combination, or ICS/LABA if blood eosinophils are elevated.",
      "Helps group COPD patients by symptoms and exacerbation history to inform initial management. It is separate from the GOLD 1–4 spirometric grade."
    ],
    mmrc: [
      "Higher mMRC grades indicate breathlessness that limits progressively lighter levels of activity. Grade ≥2 is commonly treated as a higher symptom burden in GOLD grouping (Bestall et al., 1999).",
      "**Grade 0–1 (Lower Symptom Burden):** Breathless only with strenuous exertion or hurrying. What is usually done: Lifestyle modification, activity pacing, and intermittent bronchodilators.",
      "**Grade 2–4 (Higher Symptom Burden):** Breathlessness limits daily walking, washing, or causes restriction at rest. What is usually done: Escalation to structured pulmonary rehabilitation, comprehensive symptom management, and regular long-acting inhaled therapy.",
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
      "Higher BAP-65 scores indicate more adverse-outcome risk in acute COPD exacerbation cohorts (Shorr et al., 2005).",
      "**Low Score (0 points):** Lower risk of adverse outcomes. What is usually done: Outpatient management or brief observation if clinical signs are stable.",
      "**Elevated Score (≥1–4 points):** Higher risk of mortality or inpatient complications. What is usually done: Hospital admission, close monitoring of gas exchange, and prompt initiation of targeted medical therapy.",
      "Provides a rapid risk-stratification aid during acute COPD exacerbations, alongside examination, gas exchange, comorbidities and response to treatment."
    ],
    asthmaAdult: [
      "The result flags severe or potentially life-threatening features among clinical inputs. Any danger feature warrants urgent emergency assessment (British Thoracic Society / Scottish Intercollegiate Guidelines Network, 2019).",
      "**No Severe Features:** Reassuring presentation, though severe asthma cannot be entirely ruled out. What is usually done: Standard acute asthma treatment, close observation, and arranged follow-up.",
      "**Severe Features Present:** Signs such as reduced PEF, tachypnea, or using accessory phrases. What is usually done: Urgent high-dose inhaled bronchodilators, systemic corticosteroids, supplemental oxygen, and medical review.",
      "**Life-Threatening Features (Silent chest, cyanosis, exhaustion):** Critical emergency state. What is usually done: Immediate emergency response team activation, preparation for advanced airway management, and critical care transfer.",
      "Supports rapid recognition of acute asthma severity and escalation. Do not delay treatment or emergency help to complete a score."
    ],
    crb65: [
      "A higher CRB-65 score indicates increased pneumonia risk (Bauer et al., 2006).",
      "**0 points:** Lower risk. What is usually done: Outpatient management is often appropriate.",
      "**1–2 points:** Increased risk. What is usually done: Hospital assessment and consideration of inpatient care.",
      "**3–4 points:** High risk. What is usually done: Urgent hospital admission and evaluation for intensive monitoring.",
      "Offers a bedside pneumonia severity aid when blood urea is unavailable. It complements, rather than replaces, clinical judgement."
    ],
    psiPort: [
      "Higher PSI classes correspond to higher estimated 30-day mortality risk (Fine et al., 1997).",
      "**Classes I–II (Low Risk, score ≤70):** What is usually done: Outpatient or short-stay observation management.",
      "**Class III (Moderate Risk, score 71–90):** What is usually done: Brief inpatient admission or closely monitored outpatient care.",
      "**Classes IV–V (High Risk, score >90):** What is usually done: Inpatient hospital admission; Class V often warrants high-dependency or ICU monitoring.",
      "Helps clinicians estimate pneumonia prognosis and consider outpatient versus hospital management after checking all required variables and clinical stability."
    ],
    smartcop: [
      "Higher SMART-COP scores suggest a greater likelihood of intensive respiratory or vasopressor support being needed (Charles et al., 2008).",
      "**Low Risk (0–2 points):** Unlikely to require intensive support. What is usually done: Standard ward care for pneumonia.",
      "**Moderate to Very High Risk (≥3 points):** Increasing risk of needing mechanical ventilation or intensive vasopressor therapy. What is usually done: Early consultation with intensive care specialists and continuous monitoring.",
      "Identifies pneumonia patients who may need intensive monitoring or organ support; it is a risk tool, not a substitute for immediate assessment of instability."
    ],
    idsaCap: [
      "Major criteria—mechanical ventilation or septic shock requiring vasopressors—indicate severe community-acquired pneumonia (Metlay et al., 2019).",
      "**Criteria Met (≥1 Major or ≥3 Minor criteria):** Suggests severe CAP. What is usually done: Immediate ICU admission, broad-spectrum antibiotic coverage, and invasive hemodynamic/respiratory support.",
      "Helps identify patients who may require ICU-level care. Apply the full guideline criteria and local clinical pathway."
    ],
    berlinArds: [
      "The classification depends on acute timing, bilateral opacities, oedema not fully explained by cardiac failure, and oxygenation impairment (ARDefinition Task Force et al., 2012).",
      "**Mild ARDS (P/F 200–300 mmHg):** What is usually done: Ventilatory support with PEEP ≥5 cm H₂O, conservative fluid management, and lung-protective ventilation.",
      "**Moderate ARDS (P/F 100–200 mmHg):** What is usually done: Advanced lung-protective ventilation, neuromuscular blockade if patient-ventilator dyssynchrony is severe, and prone positioning trials.",
      "**Severe ARDS (P/F ≤100 mmHg):** What is usually done: Immediate prone positioning protocols, rescue therapies (such as recruitment maneuvers), and evaluation for ECMO.",
      "Standardises ARDS definition and severity assessment to support communication, clinical decisions and research."
    ],
    globalArds: [
      "A positive classification means the selected inputs meet the chosen Global ARDS definition (Matthay et al., 2024).",
      "**Classification Note:** This is a criteria checklist rather than a numeric score. What is usually done: Confirm underlying risk factors, optimize PEEP and FiO₂ settings, and initiate lung-protective mechanical ventilation guidelines.",
      "Extends standardised ARDS identification across clinical settings. Confirm the applicable definition and assess the whole patient."
    ],
    murray: [
      "A higher Murray lung injury score reflects greater abnormalities across oxygenation, chest imaging, PEEP and compliance (Murray et al., 1988).",
      "**Low Score (<2.5):** Mild to moderate lung injury spectrum. What is usually done: Standard supportive respiratory care and monitoring.",
      "**High Score (≥2.5):** Severe lung injury/ARDS spectrum. What is usually done: Intensive lung-protective ventilation strategies and critical care escalation pathways.",
      "Summarises several dimensions of lung injury for clinical communication and selected research/assessment contexts."
    ],
    hacor: [
      "A higher HACOR score is associated with greater risk of non-invasive ventilation (NIV) failure (Duan et al., 2017).",
      "**Score ≤5:** Suggests favorable response to NIV. What is usually done: Continue NIV with close serial monitoring.",
      "**Score >5 (evaluated after 1–2 hours):** Associated with high risk of NIV failure. What is usually done: Prepare for immediate endotracheal intubation and invasive mechanical ventilation.",
      "Can support early reassessment of NIV response and escalation planning. It must not be used as an automatic intubation rule."
    ],
    rox: [
      "ROX = (SpO₂/FiO₂) divided by respiratory rate. Lower or falling values associate with higher high-flow nasal oxygen (HFNO) failure risk (Roca et al., 2016).",
      "**Low / Falling Index (<3.85 at later hours):** Indicates high probability of HFNO failure. What is usually done: Prompt escalation to non-invasive or invasive mechanical ventilation.",
      "**High Index (≥4.88):** Indicates sustained treatment success with HFNO. What is usually done: Continue HFNO therapy with ongoing clinical monitoring.",
      "Helps monitor response to high-flow nasal oxygen and identify patients who may need closer reassessment."
    ],
    revisedGeneva: [
      "Higher Revised Geneva scores indicate higher pretest probability of PE (Le Gal et al., 2006).",
      "**Low Probability (0–3):** What is usually done: Combine with D-dimer testing to rule out PE safely.",
      "**Intermediate Probability (4–10):** What is usually done: Proceed with diagnostic workup including D-dimer or imaging pathways.",
      "**High Probability (≥11):** What is usually done: Direct diagnostic imaging (CTPA) without waiting for D-dimer results.",
      "Provides an objective clinical probability estimate to guide the next step in a validated PE diagnostic pathway."
    ],
    pesi: [
      "Higher PESI class or sPESI ≥1 indicates greater short-term mortality risk in patients with PE (Aujesky et al., 2005; Jiménez et al., 2010).",
      "**Classes I–II (Low Risk):** What is usually done: Consider early discharge or outpatient management pathways if home conditions are safe.",
      "**Classes III–V (High Risk / sPESI ≥1):** What is usually done: Hospital admission, risk stratification for right ventricular strain, and anticoagulation therapy monitoring.",
      "Helps risk-stratify patients with confirmed or suspected PE to inform monitoring and disposition."
    ],
    perc: [
      "All 8 criteria met may support no further PE testing only when clinician-estimated pretest probability is already low (Kline et al., 2008).",
      "**All 8 Criteria Met:** Low risk of PE. What is usually done: Further diagnostic testing for PE can be safely omitted in low-pretest-probability settings.",
      "**Any Criterion Not Met:** PERC rule cannot be used to rule out PE. What is usually done: Proceed with standard diagnostic testing algorithms (such as D-dimer or Wells score evaluation).",
      "Reduces unnecessary testing in carefully selected low-risk patients."
    ],
    stopBang: [
      "A score of 0–2 is low risk, 3–4 intermediate, and 5–8 high risk for obstructive sleep apnoea (OSA) (Chung et al., 2008).",
      "**Low Risk (0–2):** Unlikely to have moderate-severe OSA. What is usually done: Routine clinical care, reevaluate if symptoms evolve.",
      "**Intermediate Risk (3–4):** Moderate suspicion. What is usually done: Consider referral for formal sleep study if clinical symptoms or comorbidities warrant.",
      "**High Risk (5–8):** High probability of obstructive sleep apnoea. What is usually done: Direct referral to a sleep specialist for diagnostic polysomnography and management.",
      "Identifies people who may benefit from further sleep assessment."
    ],
    epworth: [
      "Higher scores indicate greater self-reported likelihood of dozing (Johns, 1991).",
      "**Normal Range (0–10):** Usual level of daytime sleepiness. What is usually done: Reassure; address general sleep hygiene if needed.",
      "**Mild to Moderate Sleepiness (11–15):** Excessive sleepiness. What is usually done: Investigate underlying sleep deprivation, sleep disorders, or medication side effects.",
      "**Severe Sleepiness (16–24):** High level of excessive daytime sleepiness. What is usually done: Urgent referral to a sleep clinic for comprehensive evaluation and counseling.",
      "Quantifies subjective daytime sleepiness and can support assessment or follow-up."
    ],
    apache2: [
      "Higher APACHE II totals generally reflect greater acute illness severity and are associated with higher mortality at population level (Knaus et al., 1985).",
      "**Classification Note:** This tool computes a multi-parameter injury score. What is usually done: Higher scores prompt higher intensity critical care management, organ support, and specialized prognostic tracking.",
      "Supports ICU severity description and risk adjustment in appropriate settings."
    ],
    gcsResp: [
      "GCS ranges from 3 to 15; lower scores indicate a lower observed level of consciousness (Teasdale & Jennett, 1974).",
      "**Mild Alteration (13–15):** What is usually done: Close neurological observation and serial assessment.",
      "**Moderate Injury (9–12):** What is usually done: Urgent neurological evaluation, close ICU monitoring, and airway assessment.",
      "**Severe Injury (3–8):** What is usually done: Immediate emergency airway securing (intubation), emergency CT head, and critical care management.",
      "Standardises serial assessment of consciousness, especially in neurological injury and acute illness."
    ],
    whoPH: [
      "WHO functional class I indicates no limitation; IV indicates symptoms at rest (Simonneau et al., 2013).",
      "**Class I–II:** Mild functional limitation. What is usually done: Outpatient monitoring and disease-targeted medical therapies.",
      "**Class III–IV:** Marked limitation or symptoms at rest. What is usually done: Advanced combination vasodilator therapy, specialist evaluation, and consideration for transplantation/palliative pathways.",
      "Describes how pulmonary hypertension affects daily activity and symptoms."
    ],
    spirometry: [
      "The pattern is based on FEV₁/FVC and FVC relative to the selected reference thresholds (Miller et al., 2005).",
      "**Obstructive Pattern:** Low FEV₁/FVC ratio. What is usually done: Evaluate for asthma or COPD, initiate bronchodilator therapy, and assess smoking history.",
      "**Possible Restrictive Pattern:** Low FVC with normal ratio. What is usually done: Refer for complete pulmonary function testing (lung volumes and diffusing capacity) to confirm restriction.",
      "Helps interpret lung function in context with quality-assured spirometry."
    ],
    hypoxemia: [
      "The result describes oxygenation using the entered measurements and thresholds (Tobin, 2020).",
      "**Normal Oxygenation:** What is usually done: Monitor routine clinical status.",
      "**Mild to Moderate Hypoxemia:** What is usually done: Administer supplemental oxygen to target safe saturation ranges, investigate the underlying etiology (e.g., pneumonia, PE, heart failure).",
      "**Markedly Low Oxygenation:** What is usually done: Emergency medical response, high-flow oxygen delivery, and immediate critical care escalation.",
      "Recognises and grades possible low oxygenation, but does not identify the cause."
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
          eq: "One point each: Confusion, Urea >7 mmol/L, RR ≥30/min, SBP <90 or DBP ≤60 mmHg, Age ≥65. This score supports, but does not replace, clinical judgement.<br><br><b>References:</b><br>• Lim, W. S., et al. (2003). Defining community acquired pneumonia severity on presentation to hospital: An international derivation and validation study. <i>Thorax</i>, 58(5), 377–382."
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
          eq: "Two-level Wells: >4 = PE likely; ≤4 = PE unlikely. Use within a validated diagnostic pathway; this score alone does not diagnose or exclude PE.<br><br><b>References:</b><br>• Wells, P. S., et al. (2000). Derivation of a simple clinical model to categorize patients probability of pulmonary embolism: increasing the models utility with the SimpliRED D-dimer. <i>Thrombosis and Haemostasis</i>, 83(3), 416–420."
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
          eq: "GOLD spirometric grades: 1 ≥80%; 2 = 50–79%; 3 = 30–49%; 4 <30% predicted. COPD diagnosis requires compatible clinical context and post-bronchodilator FEV₁/FVC <0.70.<br><br><b>References:</b><br>• Global Initiative for Chronic Obstructive Lung Disease. (2024). <i>Global strategy for the diagnosis, management, and prevention of chronic obstructive pulmonary disease: 2024 report</i>."
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
          eq: "GOLD A/B/E: Group E if ≥2 moderate exacerbations or ≥1 exacerbation requiring hospitalization in the prior year; otherwise A = lower symptom burden, B = higher symptom burden. Confirm exacerbation history and use the current GOLD guidance.<br><br><b>References:</b><br>• Global Initiative for Chronic Obstructive Lung Disease. (2024). <i>Global strategy for the diagnosis, management, and prevention of chronic obstructive pulmonary disease: 2024 report</i>."
        };
      }
    },
    {
      id: "mmrc",
      cat: "resp",
      name: "mMRC Dyspnea Scale",
      desc: "Modified Medical Research Council breathlessness grade.",
      isClassification: true,
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
        eq: "Higher mMRC grade indicates greater activity limitation from dyspnea. GOLD symptom grouping commonly uses mMRC ≥2 as higher symptom burden.<br><br><b>References:</b><br>• Bestall, J. C., et al. (1999). Usefulness of the Medical Research Council (MRC) dyspnoea scale as a measure of disability in patients with chronic obstructive pulmonary disease. <i>Thorax</i>, 54(7), 581–586."
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
          eq: "BAP-65 factors: BUN >25 mg/dL, altered mental status, pulse ≥109/min, age ≥65 years. Higher scores are associated with greater adverse-outcome risk. This is a risk tool, not a standalone disposition rule; check local validation and units.<br><br><b>References:</b><br>• Shorr, A. F., et al. (2005). Development and validation of a clinical score to assess risk of all-cause mortality in COPD exacerbations. <i>Chest</i>, 128(4), 2201–2207."
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
          eq: "Selected values: SpO₂ " + v.spo2 + "%; PEF " + v.pef + "%; RR " + v.rr + "/min; HR " + v.hr + "/min. Acute asthma can deteriorate rapidly; use the current local adult acute-asthma pathway. Normal values do not exclude serious disease, and do not delay emergency treatment for scoring.<br><br><b>References:</b><br>• British Thoracic Society / Scottish Intercollegiate Guidelines Network. (2019). <i>BTS/SIGN British guideline on the management of asthma</i>."
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
          eq: "One point each: confusion, RR ≥30, low BP, age ≥65. Use clinical judgement; this score does not independently determine site of care.<br><br><b>References:</b><br>• Bauer, T. T., et al. (2006). Severity assessment in community acquired pneumonia: prediction of mortality by basic vs more complex scoring systems. <i>Respir Med</i>, 100(2), 310–318."
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
          eq: "PSI points are an aid to mortality-risk/site-of-care assessment. Class I uses a separate low-risk rule and is not assigned by this point total alone. Verify units and the complete validated PSI algorithm; clinical judgement takes priority.<br><br><b>References:</b><br>• Fine, M. J., et al. (1997). A prediction rule to identify low-risk patients with community-acquired pneumonia. <i>New England Journal of Medicine</i>, 336(3), 243–250."
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
          eq: "SMART-COP total (0–11): 0–2 lower, 3–4 moderate, 5–6 high, ≥7 very high risk of intensive respiratory/vasopressor support. Apply the original age-specific RR, BP and oxygenation definitions; the inputs here are simplified flags.<br><br><b>References:</b><br>• Charles, P. G., et al. (2008). SMART-COP: a tool for predicting intensive respiratory or vasopressor support in community-acquired pneumonia. <i>Clinical Infectious Diseases</i>, 47(3), 375–384."
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
          eq: "Severe CAP is defined by ≥1 major criterion or ≥3 minor criteria. Minor criteria count = " + minor + ". Confirm all criteria and use clinical judgement.<br><br><b>References:</b><br>• Metlay, J. P., et al. (2019). Diagnosis and treatment of adults with community-acquired pneumonia. An official clinical practice guideline of the American Thoracic Society and Infectious Diseases Society of America. <i>American Journal of Respiratory and Critical Care Medicine</i>, 200(7), e45–e67."
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
          eq: "Berlin requires acute timing, bilateral opacities, edema not fully explained by cardiac failure/fluid overload, and PEEP/CPAP ≥5 cm H₂O. P/F: 200–300 mild, >100–200 moderate, ≤100 severe. Requires clinical confirmation.<br><br><b>References:</b><br>• ARDS Definition Task Force. (2012). Acute respiratory distress syndrome: The Berlin Definition. <i>JAMA</i>, 307(23), 2526–2533."
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
          eq: "This is a screening aid only. Global definitions may use P/F ≤300 or S/F ≤315 (when applicable), with qualifying respiratory support and imaging/clinical criteria. SpO₂-based ratios have limitations, particularly at high saturations; verify the current Global ARDS definition and local protocol.<br><br><b>References:</b><br>• Matthay, M. A., et al. (2024). Global definition of acute respiratory distress syndrome. <i>Lancet Respiratory Medicine</i>, 12(6), 469–482."
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
          eq: "Murray score = mean of four component scores. Higher scores indicate greater lung injury; commonly ≥2.5 has been used to identify severe lung injury, but it is not a standalone ARDS diagnostic or treatment rule.<br><br><b>References:</b><br>• Murray, J. F., et al. (1988). An expanded definition of the adult respiratory distress syndrome. <i>American Review of Respiratory Disease</i>, 138(3), 720–723."
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
          eq: "HACOR = heart rate + acidosis + consciousness + oxygenation + respiratory rate points. A score >5 at 1–2 hours of NIV has been associated with NIV failure in studied populations. Do not delay intubation or escalation when clinically indicated; confirm the scoring table for your setting.<br><br><b>References:</b><br>• Duan, J., et al. (2017). Success of noninvasive ventilation in COPD with acute hypercapnic respiratory failure: a multicenter cohort study. <i>Critical Care</i>, 21(1), 86."
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
          eq: "ROX = (SpO₂ ÷ FiO₂ as fraction) ÷ RR. At " + v.time + " h, a value below " + cut.toFixed(2) + " has been associated with higher HFNO failure risk in original cohorts; ≥4.88 has been associated with lower risk. These are context-specific thresholds, not standalone escalation rules.<br><br><b>References:</b><br>• Roca, O., et al. (2016). Predictors of success of high-flow nasal cannula in pneumonia patients with hypoxemic respiratory failure: The utility of the ROX index. <i>Journal of Critical Care</i>, 35, 200–205."
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
          eq: "Revised Geneva three-level interpretation: 0–3 low, 4–10 intermediate, ≥11 high. Use with the validated PE diagnostic pathway and clinical judgement.<br><br><b>References:</b><br>• Le Gal, G., et al. (2006). Prediction of pulmonary embolism in the emergency department: the revised Geneva score. <i>Annals of Internal Medicine</i>, 144(3), 165–171."
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
          eq: "PESI classes: I ≤65, II 66–85, III 86–105, IV 106–125, V >125. sPESI: 0 = lower risk; ≥1 = elevated risk. Inputs use the standard variables shown; verify scoring and clinical context. Not a diagnostic test for PE.<br><br><b>References:</b><br>• Aujesky, D., et al. (2005). Derivation and validation of a prognostic model for pulmonary embolism toxicity. <i>American Journal of Respiratory and Critical Care Medicine</i>, 172(8), 1041–1046.<br>• Jiménez, D., et al. (2010). Simplification of the pulmonary embolism severity index for prognostic assessment in patients with acute pulmonary embolism. <i>Archives of Internal Medicine</i>, 170(15), 1383–1389."
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
          eq: (n === 8 ? "All 8 PERC criteria are met. In a patient with low clinician-assessed pretest probability, PERC may support no further testing under a validated pathway." : "At least one PERC criterion is not met. PERC cannot rule out PE; continue assessment using an appropriate validated diagnostic pathway.") + "<br><br><b>References:</b><br>• Kline, J. A., et al. (2008). Clinical criteria to prevent unnecessary diagnostic testing in emergency department patients with suspected pulmonary embolism. <i>Journal of Thrombosis and Haemostasis</i>, 2(8), 1247–1255."
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
          eq: "STOP-BANG: 0–2 low, 3–4 intermediate, 5–8 high risk (commonly used interpretation). Screening does not diagnose OSA; consider formal sleep assessment when indicated.<br><br><b>References:</b><br>• Chung, F., et al. (2008). STOP questionnaire: a screening tool to screen for obstructive sleep apnea in anesthesia patients. <i>Anesthesiology</i>, 108(5), 812–821."
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
          eq: "Common interpretation: 0–10 usual range; 11–12 mild; 13–15 moderate; 16–24 severe subjective daytime sleepiness. Interpret clinically.<br><br><b>References:</b><br>• Johns, M. W. (1991). A new method for measuring daytime sleepiness: the Epworth Sleepiness Scale. <i>Sleep</i>, 14(6), 540–545."
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
          eq: "APACHE II = acute physiology points (entered from the official scoring table) + (15 − GCS) + age points + chronic health points. This tool totals component points but does not derive acute physiology points from raw laboratory/vital values. Use official APACHE II rules and appropriate ICU context.<br><br><b>References:</b><br>• Knaus, W. A., et al. (1985). APACHE II: a severity of disease classification system. <i>Critical Care Medicine</i>, 13(10), 818–829."
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
          eq: "E" + v.eye + " V" + v.verbal + " M" + v.motor + ". Common severity descriptors: 13–15 mild, 9–12 moderate, 3–8 severe brain injury; interpret cautiously and document components. Intubation, sedation, language and age affect assessment.<br><br><b>References:</b><br>• Teasdale, G., & Jennett, B. (1974). Assessment of coma and impaired consciousness: A practical scale. <i>The Lancet</i>, 304(7872), 81–84."
        };
      }
    },
    {
      id: "whoPH",
      cat: "resp",
      name: "WHO Pulmonary Hypertension Functional Class",
      desc: "Functional limitation due to pulmonary hypertension (WHO/NYHA functional class).",
      isClassification: true,
      fields: [
        S("class", "Functional class", "I", [["I", "Class I — no limitation of ordinary activity"], ["II", "Class II — slight limitation; comfortable at rest"], ["III", "Class III — marked limitation; comfortable at rest"], ["IV", "Class IV — symptoms at rest and/or signs of right-heart failure"]])
      ],
      calc: v => ({
        value: "WHO functional class " + v.class,
        eq: "Class is assigned from symptom burden and activity limitation. It is a clinical classification, not a numeric score; assess the patient directly.<br><br><b>References:</b><br>• Simonneau, G., et al. (2013). Updated clinical classification of pulmonary hypertension. <i>Journal of the American College of Cardiology</i>, 62(25 Suppl), D34–D41."
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
          eq: "FEV₁/FVC = " + (+v.ratio).toFixed(2) + "; FEV₁ " + v.fev1 + "% predicted; FVC " + v.fvc + "% predicted. For LLN mode, this compact tool cannot calculate the LLN: compare the ratio with the lab's LLN. Spirometry alone cannot confirm restriction.<br><br><b>References:</b><br>• Miller, M. R., et al. (2005). Standardisation of spirometry. <i>European Respiratory Journal</i>, 26(2), 319–338."
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
          eq: "Entered " + (v.measure === "spo2" ? "SpO₂" : "PaO₂") + " = " + n + (v.measure === "spo2" ? "%" : " mmHg") + ". Supplemental oxygen: " + (v.oxygen === "yes" ? "yes" : "no") + ". Pulse oximetry may be inaccurate in poor perfusion, dyshemoglobinemia and other settings; oxygenation must be interpreted clinically.<br><br><b>References:</b><br>• Tobin, M. J. (2020). Principles and practice of mechanical ventilation. <i>McGraw-Hill Education</i>."
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
