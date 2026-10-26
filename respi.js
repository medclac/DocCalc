/**
 * MedCalc Module: Respiratory & Pulmonology (RESP)
 * Fully compatible with the MedCalc HTML application structure and ortho.js architecture.
 */
(function () {
  "use strict";

  // Use the global constructors declared in the HTML header (matching ortho.js architecture)
  var makeN = (typeof window !== "undefined" && window.N) ? window.N : function (id, label, defaultVal, extra) {
    extra = extra || {};
    return Object.assign({ id: id, label: label, type: "number", value: defaultVal, default: defaultVal }, extra);
  };
  var makeS = (typeof window !== "undefined" && window.S) ? window.S : function (id, label, defaultVal, options) {
    options = options || [];
    return { id: id, label: label, type: "select", value: defaultVal, default: defaultVal, options: options };
  };

  var respCategory = {
    id: "resp",
    name: "Respiratory & Pulmonology",
    icon: "🫁",
    desc: "Pneumonia severity, pulmonary embolism pathways, COPD staging, acute asthma, ARDS criteria, and blood gas oxygenation",
    organs: ["lung", "airway", "alveoli", "pulmonary vasculature", "pleura", "chest wall"],
    region: "thoracic / respiratory"
  };

  var respTools = [
    // ==============================================================
    // 1. CURB-65 PNEUMONIA SEVERITY SCORE
    // ==============================================================
    {
      id: "curb65",
      cat: "resp",
      type: "class",
      name: "CURB-65 Pneumonia Severity Score",
      desc: "Validated risk stratification score predicting 30-day mortality in community-acquired pneumonia (CAP).",
      organ: "Lung / Systemic Circulation",
      region: "Thoracic / Infectious Disease",
      subject: "Pulmonology / Lower Respiratory Infection",
      keywords: ["curb65", "curb-65", "pneumonia", "cap", "infection", "confusion", "urea", "mortality"],
      guidance: "1. One point for each satisfied criterion: Confusion (AMTS ≤8 or new disorientation), Urea >7 mmol/L (BUN >19 mg/dL), Respiratory Rate ≥30/min, Blood Pressure (SBP <90 or DBP ≤60 mmHg), Age ≥65 years.\n2. Score 0–1: Low risk (<3% 30-day mortality); consider home outpatient management.\n3. Score 2: Intermediate risk (~9% mortality); inpatient admission or monitored short-stay unit recommended.\n4. Score 3–5: High risk (15–40% mortality); urgent hospital admission, consider ICU/HDU escalation.",
      contraindications: "Does not account for social vulnerabilities, hypoxemia, uncompensated comorbidities, or aspiration risk; clinical judgment supersedes score.",
      literature: [
        {
          type: "Seminal Derivation & Validation",
          icon: "📄",
          title: "Defining community acquired pneumonia severity on presentation to hospital: an international derivation and validation study",
          citation: "Lim WS, van der Eerden MM, Laing R, et al. Thorax. 2003;58(5):377-382.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/12728155/" }
          ]
        }
      ],
      fields: [
        makeS("confusion", "1. Confusion (new disorientation in person, place, or time)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("urea", "2. Urea > 7.0 mmol/L (BUN > 19 mg/dL)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("rr", "3. Respiratory Rate ≥ 30 breaths/min", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("bp", "4. Low Blood Pressure (SBP < 90 mmHg or DBP ≤ 60 mmHg)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("age", "5. Age ≥ 65 years", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      table: {
        headers: ["CURB-65 Score", "Risk Category", "30-Day Mortality", "Recommended Site of Care"],
        rows: [
          { id: "curbLow", cols: ["0 – 1 points", "Low Risk", "0.7% – 2.1%", "Outpatient oral antimicrobial therapy if socially and clinically stable"] },
          { id: "curbMod", cols: ["2 points", "Moderate Risk", "~ 9.2%", "Hospital inpatient admission or closely supervised outpatient short-stay observation"] },
          { id: "curbHigh", cols: ["3 – 5 points", "Severe / High Risk", "15% – 40%", "Immediate inpatient hospital admission; evaluate for HDU/ICU level care stat"] }
        ]
      },
      calc: function (v) {
        var score = +v.confusion + +v.urea + +v.rr + +v.bp + +v.age;
        var match = score >= 3 ? "curbHigh" : score === 2 ? "curbMod" : "curbLow";
        var disposition = score >= 3
          ? "Severe CAP (High 30-day mortality risk: 15–40%). Urgent hospital admission; evaluate for ICU/HDU monitoring."
          : score === 2
          ? "Moderate CAP (~9.2% 30-day mortality risk). Consider supervised hospital inpatient admission."
          : "Low-risk CAP (<3% mortality). Outpatient management generally appropriate if oxygenation is stable.";

        return {
          value: "CURB-65 Score: " + score + " / 5",
          matchId: match,
          eq: disposition + "\nCriteria: Confusion, Urea >7 mmol/L, RR ≥30, SBP <90 or DBP ≤60 mmHg, Age ≥65."
        };
      }
    },

    // ==============================================================
    // 2. CRB-65 PNEUMONIA ASSESSMENT (BEDSIDE / NO LABS)
    // ==============================================================
    {
      id: "crb65",
      cat: "resp",
      type: "class",
      name: "CRB-65 Pneumonia Severity Score",
      desc: "Community-acquired pneumonia bedside triage instrument requiring no blood test results.",
      organ: "Lung / Systemic Circulation",
      region: "Thoracic / Primary Care",
      subject: "Pulmonology / Outpatient Triage",
      keywords: ["crb65", "crb-65", "pneumonia", "cap", "triage", "outpatient", "urea-free"],
      guidance: "1. Designed for urgent primary care, prehospital triage, or emergency settings before urea results are available.\n2. Score 0: Low mortality (<1%); suitable for community-based outpatient therapy.\n3. Score 1–2: Intermediate risk; hospital evaluation and inpatient assessment strongly considered.\n4. Score 3–4: Urgent emergency hospital admission with critical care review.",
      contraindications: "Does not evaluate oxygen saturation; patients with pulse oximetry <92% on ambient air mandate hospital assessment regardless of score.",
      literature: [
        {
          type: "Validation Study",
          icon: "📄",
          title: "Severity assessment in community acquired pneumonia: prediction of mortality by basic vs more complex scoring systems",
          citation: "Bauer TT, Ewig S, Marre R, et al. Respir Med. 2006;100(2):310-318.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/16019200/" }
          ]
        }
      ],
      fields: [
        makeS("confusion", "1. Confusion (new cognitive impairment / disorientation)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("rr", "2. Respiratory Rate ≥ 30 breaths/min", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("bp", "3. Hypotension (SBP < 90 mmHg or DBP ≤ 60 mmHg)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("age", "4. Age ≥ 65 years", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      table: {
        headers: ["CRB-65 Score", "Risk Stratification", "30-Day Mortality", "Recommended Disposition"],
        rows: [
          { id: "crb0", cols: ["0 points", "Very Low Risk", "0.9% – 1.2%", "Outpatient management usually suitable; educate on red flag symptoms"] },
          { id: "crb12", cols: ["1 – 2 points", "Intermediate Risk", "5.2% – 8.2%", "Hospital referral recommended; consider admission or close surveillance"] },
          { id: "crb34", cols: ["3 – 4 points", "Severe High Risk", "18% – 34%", "Immediate urgent hospital admission; evaluate for ICU transfer"] }
        ]
      },
      calc: function (v) {
        var score = +v.confusion + +v.rr + +v.bp + +v.age;
        var match = score >= 3 ? "crb34" : score >= 1 ? "crb12" : "crb0";
        var plan = score >= 3
          ? "High risk of 30-day mortality (18–34%). Urgent emergency transfer to hospital; high dependency care."
          : score >= 1
          ? "Intermediate mortality risk (5–8%). Hospital assessment and admission consideration strongly advised."
          : "Low mortality risk (<1.2%). Home-based outpatient antibiotic therapy usually adequate.";

        return {
          value: "CRB-65 Score: " + score + " / 4",
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 3. WELLS SCORE FOR PULMONARY EMBOLISM
    // ==============================================================
    {
      id: "wellsPe",
      cat: "resp",
      type: "class",
      name: "Wells Score for Pulmonary Embolism",
      desc: "Clinical pretest probability model directing D-dimer testing versus CT pulmonary angiography (CTPA).",
      organ: "Pulmonary Arteries / Right Ventricle",
      region: "Pulmonary Vasculature",
      subject: "Vascular Pulmonology / Venous Thromboembolism",
      keywords: ["wells", "pe", "pulmonary embolism", "vte", "d-dimer", "ctpa", "thrombosis"],
      guidance: "1. Two-tier risk stratification: Score ≤ 4 indicates PE Unlikely; Score > 4 indicates PE Likely.\n2. PE Unlikely (≤4): Order high-sensitivity D-dimer. If negative, PE is safely ruled out without imaging.\n3. PE Likely (>4): Proceed directly to CT Pulmonary Angiography (CTPA) or V/Q scan; bypass D-dimer.",
      contraindications: "Not validated during pregnancy without trimester-adjusted pathways; hemodynamically unstable patients require immediate bedside echo and emergent CTPA.",
      literature: [
        {
          type: "Seminal Derivation",
          icon: "📄",
          title: "Derivation of a simple clinical model to categorize patients probability of pulmonary embolism",
          citation: "Wells PS, Anderson DR, Rodger M, et al. Thromb Haemost. 2000;83(3):416-420.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/10744147/" }
          ]
        }
      ],
      fields: [
        makeS("dvtSigns", "1. Clinical signs and symptoms of DVT (leg swelling, pain on palpation)", "0", [["0", "No (0)"], ["3", "Yes (+3.0)"]]),
        makeS("peLikely", "2. An alternative diagnosis is LESS likely than PE", "0", [["0", "No (0)"], ["3", "Yes (+3.0)"]]),
        makeS("hr", "3. Heart rate > 100 beats/min", "0", [["0", "No (0)"], ["1.5", "Yes (+1.5)"]]),
        makeS("immob", "4. Immobilization ≥3 consecutive days OR surgery in previous 4 weeks", "0", [["0", "No (0)"], ["1.5", "Yes (+1.5)"]]),
        makeS("priorVte", "5. Previous objectively diagnosed PE or DVT", "0", [["0", "No (0)"], ["1.5", "Yes (+1.5)"]]),
        makeS("hemoptysis", "6. Hemoptysis", "0", [["0", "No (0)"], ["1", "Yes (+1.0)"]]),
        makeS("malignancy", "7. Active malignancy (treatment within 6 months or palliative)", "0", [["0", "No (0)"], ["1", "Yes (+1.0)"]])
      ],
      table: {
        headers: ["Wells Total", "Probability Tier", "Pretest PE Prevalence", "Diagnostic Pathway"],
        rows: [
          { id: "peUnlikely", cols: ["≤ 4.0 points", "PE Unlikely", "~ 12%", "Obtain high-sensitivity D-dimer. If negative (<500 ng/mL or age-adjusted), stop workup; no CTPA required"] },
          { id: "peLikely", cols: ["> 4.0 points", "PE Likely", "~ 37% – 40%", "Perform emergent CT Pulmonary Angiography (CTPA); start empiric therapeutic anticoagulation if imaging delayed"] }
        ]
      },
      calc: function (v) {
        var score = +v.dvtSigns + +v.peLikely + +v.hr + +v.immob + +v.priorVte + +v.hemoptysis + +v.malignancy;
        var likely = score > 4.0;
        var match = likely ? "peLikely" : "peUnlikely";
        var action = likely
          ? "PE Likely (prevalence ~37–40%). Bypass D-dimer and perform prompt CT Pulmonary Angiography (CTPA)."
          : "PE Unlikely (prevalence ~12%). Order high-sensitivity D-dimer test. Rule out PE if D-dimer is normal.";

        return {
          value: score.toFixed(1) + " Points (" + (likely ? "PE Likely" : "PE Unlikely") + ")",
          matchId: match,
          eq: action
        };
      }
    },

    // ==============================================================
    // 4. REVISED GENEVA SCORE FOR PULMONARY EMBOLISM
    // ==============================================================
    {
      id: "revisedGeneva",
      cat: "resp",
      type: "class",
      name: "Revised Geneva Score for Pulmonary Embolism",
      desc: "Standardized objective clinical decision rule for estimating pulmonary embolism probability.",
      organ: "Pulmonary Arteries",
      region: "Pulmonary Vasculature",
      subject: "Vascular Pulmonology / Venous Thromboembolism",
      keywords: ["geneva", "revised geneva", "pe", "pulmonary embolism", "d-dimer", "triage"],
      guidance: "1. Relies solely on objective standardized clinical criteria without subjective clinical gestalt.\n2. Three-level interpretation: 0–3 points = Low (~8% prevalence); 4–10 points = Intermediate (~28% prevalence); ≥11 points = High (~74% prevalence).\n3. Low/intermediate risk prompts high-sensitivity D-dimer; high risk warrants immediate CTPA.",
      contraindications: "Does not account for hemodynamic shock; massive PE with hypotension requires emergency resuscitation and immediate imaging.",
      literature: [
        {
          type: "Seminal Derivation",
          icon: "📄",
          title: "Prediction of pulmonary embolism in the emergency department: the revised Geneva score",
          citation: "Le Gal G, Righini M, Roy PM, et al. Ann Intern Med. 2006;144(3):165-171.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/16461960/" }
          ]
        }
      ],
      fields: [
        makeS("age", "1. Age > 65 years", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("prev", "2. Previous DVT or PE", "0", [["0", "No (0)"], ["3", "Yes (+3)"]]),
        makeS("surgery", "3. Surgery or lower limb fracture within past month", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        makeS("cancer", "4. Active malignant condition", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        makeS("pain", "5. Unilateral lower-limb pain", "0", [["0", "No (0)"], ["3", "Yes (+3)"]]),
        makeS("hemo", "6. Hemoptysis", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        makeS("hr", "7. Resting Heart Rate", "0", [["0", "< 75 bpm (0)"], ["3", "75 to 94 bpm (+3)"], ["5", "≥ 95 bpm (+5)"]]),
        makeS("dvtSigns", "8. Pain on deep venous palpation AND unilateral limb edema", "0", [["0", "No (0)"], ["4", "Yes (+4)"]])
      ],
      table: {
        headers: ["Score Range", "Geneva Category", "Observed PE Prevalence", "Clinical Pathway"],
        rows: [
          { id: "genLow", cols: ["0 – 3 points", "Low Probability", "7% – 9%", "High-sensitivity D-dimer test; if negative, PE is ruled out"] },
          { id: "genMod", cols: ["4 – 10 points", "Intermediate Probability", "28% – 30%", "High-sensitivity D-dimer test or CTPA depending on institutional pathway"] },
          { id: "genHigh", cols: ["≥ 11 points", "High Probability", "65% – 74%", "Proceed directly to CTPA; avoid delays for D-dimer testing"] }
        ]
      },
      calc: function (v) {
        var score = +v.age + +v.prev + +v.surgery + +v.cancer + +v.pain + +v.hemo + +v.hr + +v.dvtSigns;
        var match = score >= 11 ? "genHigh" : score >= 4 ? "genMod" : "genLow";
        var label = score >= 11 ? "High Probability" : score >= 4 ? "Intermediate Probability" : "Low Probability";

        return {
          value: score + " Points (" + label + ")",
          matchId: match,
          eq: "Revised Geneva 3-tier model: 0–3 Low, 4–10 Intermediate, ≥11 High pretest probability.\nDirects D-dimer vs CT pulmonary angiography."
        };
      }
    },

    // ==============================================================
    // 5. PERC RULE FOR PULMONARY EMBOLISM EXCLUSION
    // ==============================================================
    {
      id: "percRule",
      cat: "resp",
      type: "class",
      name: "PERC Rule for Pulmonary Embolism",
      desc: "Clinical decision instrument to safely exclude pulmonary embolism without laboratory testing in very low-risk patients.",
      organ: "Pulmonary Arteries",
      region: "Emergency Triage",
      subject: "Vascular Pulmonology / Diagnostic Stewardship",
      keywords: ["perc", "rule out", "pulmonary embolism", "pe", "d-dimer", "exclusion"],
      guidance: "1. APPLIES ONLY IF CLINICAL GESTALT PRETEST PROBABILITY IS LOW (<15%).\n2. Must fulfill ALL 8 criteria: Age <50, HR <100, SpO₂ ≥95% on room air, No hemoptysis, No estrogen use, No prior DVT/PE, No unilateral leg swelling, No surgery/trauma within 4 weeks.\n3. If all 8 criteria are met, risk of PE is <1.8%; testing (including D-dimer) can be safely avoided.",
      contraindications: "Do not apply if patient is deemed moderate or high risk on clinical gestalt or Wells score (>4).",
      literature: [
        {
          type: "Seminal Derivation & Validation",
          icon: "📄",
          title: "Clinical criteria to prevent unnecessary diagnostic testing in emergency department patients with suspected pulmonary embolism",
          citation: "Kline JA, Mitchell AM, Kabrhel C, et al. J Thromb Haemost. 2004;2(8):1247-1255.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/15304025/" }
          ]
        }
      ],
      fields: [
        makeS("age", "1. Age < 50 years", "1", [["1", "Yes (criteria met)"], ["0", "No (fails criterion)"]]),
        makeS("pulse", "2. Pulse < 100 beats/min", "1", [["1", "Yes (criteria met)"], ["0", "No (fails criterion)"]]),
        makeS("spo2", "3. SpO₂ ≥ 95% on room air", "1", [["1", "Yes (criteria met)"], ["0", "No (fails criterion)"]]),
        makeS("hemoptysis", "4. No hemoptysis", "1", [["1", "Yes (criteria met)"], ["0", "No (fails criterion)"]]),
        makeS("estrogen", "5. No exogenous estrogen use (OCP, HRT)", "1", [["1", "Yes (criteria met)"], ["0", "No (fails criterion)"]]),
        makeS("priorVte", "6. No prior history of DVT or PE", "1", [["1", "Yes (criteria met)"], ["0", "No (fails criterion)"]]),
        makeS("legSwelling", "7. No unilateral leg swelling", "1", [["1", "Yes (criteria met)"], ["0", "No (fails criterion)"]]),
        makeS("surgery", "8. No recent surgery or trauma requiring hospitalization within 4 weeks", "1", [["1", "Yes (criteria met)"], ["0", "No (fails criterion)"]])
      ],
      table: {
        headers: ["PERC Status", "Criteria Count", "Estimated PE Risk", "Recommended Action"],
        rows: [
          { id: "percNeg", cols: ["PERC Negative", "All 8 criteria met (8/8)", "< 1.5%", "Stop diagnostic workup. No D-dimer or CTPA required in low-pretest patients"] },
          { id: "percPos", cols: ["PERC Positive", "≥ 1 criterion failed (<8/8)", "> 1.5%", "Cannot rule out PE. Proceed with standard diagnostic pathway (D-dimer / CTPA)"] }
        ]
      },
      calc: function (v) {
        var total = +v.age + +v.pulse + +v.spo2 + +v.hemoptysis + +v.estrogen + +v.priorVte + +v.legSwelling + +v.surgery;
        var passed = total === 8;
        var match = passed ? "percNeg" : "percPos";
        var verdict = passed
          ? "PERC RULE NEGATIVE: PE Ruled Out (<1.5% residual risk). No D-dimer or imaging indicated."
          : "PERC RULE POSITIVE: Rule failed (" + (8 - total) + " criteria missed). Proceed with D-dimer testing.";

        return {
          value: total + " / 8 Criteria Met (" + (passed ? "PERC Negative" : "PERC Positive") + ")",
          matchId: match,
          eq: verdict
        };
      }
    },

    // ==============================================================
    // 6. PESI & SIMPLIFIED PESI (sPESI) FOR PE MORTALITY
    // ==============================================================
    {
      id: "pesiScore",
      cat: "resp",
      type: "class",
      name: "PESI & Simplified PESI (sPESI) for Pulmonary Embolism",
      desc: "Stratifies 30-day all-cause mortality and complications in confirmed acute pulmonary embolism.",
      organ: "Pulmonary Arteries / Heart",
      region: "Pulmonary Vasculature",
      subject: "Vascular Pulmonology / PE Prognosis",
      keywords: ["pesi", "spesi", "pulmonary embolism", "mortality", "outpatient", "anticoagulation", "thromboembolism"],
      guidance: "1. Simplified PESI (sPESI): 1 point each for Age >80, History of Cancer, Chronic Cardiopulmonary disease, HR ≥110, SBP <100 mmHg, SpO₂ <90%.\n2. sPESI = 0 points identifies very low-risk patients (30-day mortality ~1%); eligible for early hospital discharge or home treatment.\n3. sPESI ≥ 1 indicates high risk (~11% mortality); requires inpatient admission and monitoring for right ventricular dysfunction.",
      contraindications: "Does not substitute for assessment of right ventricular strain (echocardiography or troponin/BNP).",
      literature: [
        {
          type: "Seminal Simplification",
          icon: "📄",
          title: "Simplification of the pulmonary embolism severity index for prognostic assessment in patients with acute pulmonary embolism",
          citation: "Jiménez D, Aujesky D, Moores L, et al. Arch Intern Med. 2010;170(15):1383-1389.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/20696966/" }
          ]
        }
      ],
      fields: [
        makeN("age", "Patient Age (years)", 62, { min: 18, max: 110, step: 1 }),
        makeS("cancer", "Active cancer / history of malignancy", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("cardiopulm", "Chronic heart failure OR chronic lung disease", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("hr", "Heart rate ≥ 110 beats/min", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("sbp", "Systolic blood pressure < 100 mmHg", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("spo2", "Arterial oxygen saturation (SpO₂) < 90%", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      table: {
        headers: ["sPESI Score", "Risk Tier", "30-Day Mortality", "Recommended Care Pathway"],
        rows: [
          { id: "spesiLow", cols: ["0 points", "Low Risk", "1.0% – 1.1%", "Candidate for outpatient anticoagulation or early discharge (<24h) if socially stable and RV normal"] },
          { id: "spesiHigh", cols: ["≥ 1 point", "Elevated / High Risk", "8.9% – 10.9%", "Hospital admission mandatory; evaluate RV strain via echo/biomarkers (troponin/BNP)"] }
        ]
      },
      calc: function (v) {
        var agePt = +v.age > 80 ? 1 : 0;
        var spesi = agePt + +v.cancer + +v.cardiopulm + +v.hr + +v.sbp + +v.spo2;
        var match = spesi === 0 ? "spesiLow" : "spesiHigh";
        var plan = spesi === 0
          ? "Low Risk (30-day mortality ~1.0%). Consider outpatient oral anticoagulation (DOAC) if hemodynamics and home environment are stable."
          : "Elevated Risk (30-day mortality ~10%). Inpatient hospital admission required; assess for RV overload.";

        return {
          value: "sPESI Score: " + spesi + " (" + (spesi === 0 ? "Low Risk" : "Elevated Risk") + ")",
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 7. GOLD 1–4 SPIROMETRIC AIRFLOW LIMITATION
    // ==============================================================
    {
      id: "gold1to4",
      cat: "resp",
      type: "class",
      name: "GOLD 1–4 Airflow Obstruction Classification",
      desc: "Grades severity of airflow obstruction based on post-bronchodilator FEV₁ percent predicted in COPD.",
      organ: "Bronchi / Small Airways",
      region: "Lower Respiratory Tract",
      subject: "Obstructive Lung Disease / COPD",
      keywords: ["gold", "copd", "fev1", "spirometry", "obstruction", "airflow"],
      guidance: "1. Diagnosis of COPD requires post-bronchodilator FEV₁/FVC < 0.70 in a patient with compatible clinical symptoms/exposures.\n2. Severity grading: GOLD 1 (Mild, FEV₁ ≥80%); GOLD 2 (Moderate, 50–79%); GOLD 3 (Severe, 30–49%); GOLD 4 (Very Severe, <30%).\n3. Note: Spirometric severity grades airflow limitation; symptom burden and exacerbation risk are classified separately using GOLD ABE.",
      contraindications: "Cannot confirm COPD if post-bronchodilator FEV₁/FVC is ≥0.70.",
      literature: [
        {
          type: "Official Strategy Report",
          icon: "📘",
          title: "Global Strategy for the Diagnosis, Management, and Prevention of Chronic Obstructive Pulmonary Disease",
          citation: "Global Initiative for Chronic Obstructive Lung Disease (GOLD). 2024 Report.",
          links: [
            { text: "View GOLD Report ↗", url: "https://goldcopd.org/" }
          ]
        }
      ],
      fields: [
        makeN("fev1", "Post-Bronchodilator FEV₁ (% of predicted)", 65, { min: 10, max: 150, step: 1 })
      ],
      table: {
        headers: ["GOLD Grade", "Airflow Limitation", "Post-BD FEV₁ (% pred)", "Standard Therapeutic Considerations"],
        rows: [
          { id: "gold1", cols: ["GOLD 1", "Mild", "≥ 80%", "Smoking cessation, influenza/pneumococcal vaccination, SABA/SAMA prn"] },
          { id: "gold2", cols: ["GOLD 2", "Moderate", "50% – 79%", "Add maintenance long-acting bronchodilator (LAMA or LABA); pulmonary rehab"] },
          { id: "gold3", cols: ["GOLD 3", "Severe", "30% – 49%", "Dual bronchodilation (LAMA + LABA); screen for inhaled corticosteroids (ICS)"] },
          { id: "gold4", cols: ["GOLD 4", "Very Severe", "< 30%", "Triple therapy (ICS/LABA/LAMA); assess for long-term oxygen therapy (LTOT) & lung volume reduction"] }
        ]
      },
      calc: function (v) {
        var f = +v.fev1;
        var match = f >= 80 ? "gold1" : f >= 50 ? "gold2" : f >= 30 ? "gold3" : "gold4";
        var grade = f >= 80 ? "GOLD 1 (Mild)" : f >= 50 ? "GOLD 2 (Moderate)" : f >= 30 ? "GOLD 3 (Severe)" : "GOLD 4 (Very Severe)";

        return {
          value: grade + " — FEV₁: " + f + "% predicted",
          matchId: match,
          eq: "Applies exclusively when post-bronchodilator FEV₁/FVC < 0.70 confirms fixed airflow obstruction."
        };
      }
    },

    // ==============================================================
    // 8. GOLD ABE ASSESSMENT SCHEMA (COPD 2024)
    // ==============================================================
    {
      id: "goldAbe",
      cat: "resp",
      type: "class",
      name: "GOLD ABE Assessment Schema (COPD 2024 Update)",
      desc: "Combines symptom burden (mMRC or CAT) with exacerbation history to direct initial pharmacological therapy.",
      organ: "Bronchi / Systemic",
      region: "Lower Respiratory Tract",
      subject: "Obstructive Lung Disease / COPD Pharmacotherapy",
      keywords: ["gold", "abe", "copd", "lama", "laba", "exacerbation", "mmrc", "cat"],
      guidance: "1. Group A: Low symptoms (mMRC 0–1 or CAT <10), 0–1 moderate exacerbation (no hospitalization). Treatment: Bronchodilator (LAMA or LABA).\n2. Group B: High symptoms (mMRC ≥2 or CAT ≥10), 0–1 moderate exacerbation. Treatment: Dual bronchodilators (LABA + LAMA).\n3. Group E: High exacerbation risk (≥2 moderate exacerbations OR ≥1 leading to hospitalization). Treatment: LABA + LAMA (add ICS if blood eosinophils ≥300 cells/µL).",
      contraindications: "Ensure accurate documentation of prior 12-month exacerbations and systemic steroid/antibiotic prescriptions.",
      literature: [
        {
          type: "Official Strategy Report",
          icon: "📘",
          title: "Global Strategy for Prevention, Diagnosis and Management of COPD: 2024 Report",
          citation: "Agustí A, Celli BR, Criner GJ, et al. Eur Respir J. 2023;61(4):2300239.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/37024103/" }
          ]
        }
      ],
      fields: [
        makeS("symptoms", "Symptom Burden (mMRC Dyspnea Scale or CAT Score)", "low", [
          ["low", "Low symptoms: mMRC 0–1 or CAT < 10"],
          ["high", "High symptoms: mMRC ≥ 2 or CAT ≥ 10"]
        ]),
        makeS("exac", "Exacerbations in Past 12 Months", "0", [
          ["0", "0 or 1 moderate exacerbation (not requiring hospital admission)"],
          ["2", "≥ 2 moderate exacerbations"],
          ["hosp", "≥ 1 severe exacerbation requiring hospital admission"]
        ])
      ],
      table: {
        headers: ["GOLD Group", "Clinical Profile", "Exacerbation Risk", "Initial Maintenance Regimen"],
        rows: [
          { id: "grpA", cols: ["Group A", "Low symptoms, 0–1 moderate exac", "Low", "A long-acting bronchodilator (LAMA or LABA monotherapy)"] },
          { id: "grpB", cols: ["Group B", "High symptoms, 0–1 moderate exac", "Low", "Dual long-acting bronchodilation: LABA + LAMA combination"] },
          { id: "grpE", cols: ["Group E", "High exacerbation history (≥2 exac or ≥1 hospital)", "HIGH", "LABA + LAMA; add Inhaled Corticosteroid (ICS) if blood eosinophils ≥300"] }
        ]
      },
      calc: function (v) {
        var isExac = v.exac === "2" || v.exac === "hosp";
        var group = isExac ? "E" : (v.symptoms === "high" ? "B" : "A");
        var match = "grp" + group;
        var rx = group === "E"
          ? "Group E: Initial therapy is LABA + LAMA. Consider triple therapy (LABA + LAMA + ICS) if blood eosinophils ≥300 cells/µL."
          : group === "B"
          ? "Group B: Initial therapy is LABA + LAMA dual combination therapy."
          : "Group A: Initial therapy is a bronchodilator (LAMA or LABA monotherapy).";

        return {
          value: "GOLD Group " + group,
          matchId: match,
          eq: rx
        };
      }
    },

    // ==============================================================
    // 9. mMRC DYSPNEA SCALE
    // ==============================================================
    {
      id: "mmrcScale",
      cat: "resp",
      type: "class",
      name: "mMRC (Modified Medical Research Council) Dyspnea Scale",
      desc: "Quantifies the degree of functional disability related to breathlessness during daily physical activity.",
      organ: "Respiratory Center / Diaphragm",
      region: "Functional Pulmonology",
      subject: "Symptom Burden / Chronic Dyspnea",
      keywords: ["mmrc", "dyspnea", "breathlessness", "copd", "exercise tolerance"],
      guidance: "1. Grade 0: Breathless only with strenuous exercise.\n2. Grade 1: Short of breath when hurrying on level ground or walking up a slight hill.\n3. Grade 2: Walks slower than contemporaries on level ground due to breathlessness, or stops for breath when walking at own pace.\n4. Grade 3: Stops for breath after walking ~100 meters or after a few minutes on level ground.\n5. Grade 4: Too breathless to leave the house, or breathless when dressing or undressing.",
      contraindications: "Does not differentiate between cardiac, neuromuscular, and pulmonary causes of breathlessness.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Usefulness of the Medical Research Council (MRC) dyspnoea scale as a measure of disability in patients with chronic obstructive pulmonary disease",
          citation: "Bestall JC, Paul EA, Garrod R, et al. Thorax. 1999;54(7):581-586.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/10377201/" }
          ]
        }
      ],
      fields: [
        makeS("grade", "Select the description that best fits the patient's breathlessness", "1", [
          ["0", "Grade 0: Not troubled with breathlessness except with strenuous exercise"],
          ["1", "Grade 1: Short of breath when hurrying on the level or walking up a slight hill"],
          ["2", "Grade 2: Walks slower than peers or stops for breath when walking at own pace on level"],
          ["3", "Grade 3: Stops for breath after walking about 100 meters or a few minutes on level"],
          ["4", "Grade 4: Too breathless to leave house or breathless when dressing/undressing"]
        ])
      ],
      table: {
        headers: ["mMRC Grade", "Activity Limitation", "COPD Symptom Category", "Functional Status"],
        rows: [
          { id: "g0", cols: ["Grade 0", "Strenuous exertion only", "Low symptom burden", "Preserved exercise tolerance"] },
          { id: "g1", cols: ["Grade 1", "Hurrying or inclines", "Low symptom burden", "Mild limitation"] },
          { id: "g2", cols: ["Grade 2", "Slower than peers", "High symptom burden (≥2)", "Moderate functional impairment"] },
          { id: "g3", cols: ["Grade 3", "Stops after 100 meters", "High symptom burden (≥2)", "Severe functional limitation; candidate for pulmonary rehab"] },
          { id: "g4", cols: ["Grade 4", "Breathless at rest / dressing", "High symptom burden (≥2)", "Very severe disability; assess for home care support"] }
        ]
      },
      calc: function (v) {
        var g = v.grade;
        var match = "g" + g;
        var burden = +g >= 2 ? "High Symptom Burden (mMRC ≥ 2)" : "Low Symptom Burden (mMRC < 2)";

        return {
          value: "mMRC Grade " + g + " (" + burden + ")",
          matchId: match,
          eq: "mMRC Grade ≥2 defines high symptom burden in the GOLD COPD classification system."
        };
      }
    },

    // ==============================================================
    // 10. ACUTE ASTHMA SEVERITY ASSESSMENT (ADULT BTS/SIGN)
    // ==============================================================
    {
      id: "asthmaAdult",
      cat: "resp",
      type: "class",
      name: "Acute Asthma Severity Assessment (Adult BTS/SIGN)",
      desc: "Emergency assessment categorizing acute asthma into moderate, severe, or life-threatening/near-fatal tiers.",
      organ: "Bronchial Tree / Smooth Muscle",
      region: "Emergency Pulmonology",
      subject: "Acute Asthma / Emergency Escalation",
      keywords: ["asthma", "bts", "sign", "pef", "bronchospasm", "silent chest", "status asthmaticus"],
      guidance: "1. Moderate: PEF 50–75% personal best/predicted, RR <25, HR <110, speaking in full sentences.\n2. Severe: PEF 33–50%, RR ≥25, HR ≥110, inability to complete sentences in one breath.\n3. Life-Threatening: PEF <33%, SpO₂ <92%, silent chest, cyanosis, poor respiratory effort, bradycardia, confusion, exhaustion.\n4. Near-Fatal: Elevated PaCO₂ (normal/high PaCO₂ during acute attack signals impending respiratory arrest).",
      contraindications: "Never delay emergency bronchodilators, systemic corticosteroids, or oxygen therapy to complete assessment.",
      literature: [
        {
          type: "Official Clinical Guideline",
          icon: "📘",
          title: "British guideline on the management of asthma",
          citation: "British Thoracic Society; Scottish Intercollegiate Guidelines Network. Thorax. 2019;74(Suppl 1):1-140.",
          links: [
            { text: "View BTS/SIGN ↗", url: "https://www.brit-thoracic.org.uk/" }
          ]
        }
      ],
      fields: [
        makeN("pef", "Peak Expiratory Flow (PEF, % predicted or personal best)", 55, { min: 10, max: 120, step: 1 }),
        makeN("spo2", "Oxygen Saturation (SpO₂, % on room air)", 95, { min: 50, max: 100, step: 1 }),
        makeN("rr", "Respiratory Rate (breaths/min)", 22, { min: 8, max: 60, step: 1 }),
        makeN("hr", "Heart Rate (beats/min)", 105, { min: 30, max: 200, step: 1 }),
        makeS("speech", "Speech Capability", "sentences", [
          ["sentences", "Can speak in full sentences"],
          ["phrases", "Can only speak in short phrases"],
          ["words", "Can only speak in single words / exhausted"]
        ]),
        makeS("danger", "Life-Threatening Features (silent chest, cyanosis, feeble effort, confusion)", "0", [
          ["0", "None present"],
          ["1", "Present: Silent chest, exhaustion, cyanosis, or confusion"]
        ])
      ],
      table: {
        headers: ["Severity Tier", "Clinical Diagnostic Criteria", "Immediate Emergency Action"],
        rows: [
          { id: "astMod", cols: ["Moderate Asthma", "PEF 50–75%, SpO₂ ≥92%, RR <25, HR <110, full sentences", "Nebulized SABA (salbutamol 5mg) + oral prednisolone 40–50 mg"] },
          { id: "astSev", cols: ["Severe Asthma", "PEF 33–50%, RR ≥25, HR ≥110, or speaks in phrases only", "High-flow O₂, back-to-back SABA + ipratropium nebulizers, systemic steroids, urgent senior review"] },
          { id: "astCrit", cols: ["LIFE-THREATENING", "PEF <33%, SpO₂ <92%, silent chest, cyanosis, confusion, exhaustion", "IMMEDIATE CRITICAL CARE CALL: IV Magnesium sulfate (2g), prepare for emergency intubation, ICU transfer"] }
        ]
      },
      calc: function (v) {
        var isDanger = v.danger === "1" || +v.pef < 33 || +v.spo2 < 92 || v.speech === "words";
        var isSevere = +v.pef < 50 || +v.rr >= 25 || +v.hr >= 110 || v.speech === "phrases";

        var match = isDanger ? "astCrit" : isSevere ? "astSev" : "astMod";
        var verdict = isDanger
          ? "LIFE-THREATENING ASTHMA: Emergent ICU call stat. Nebulized salbutamol + ipratropium + IV hydrocortisone + IV magnesium sulfate."
          : isSevere
          ? "ACUTE SEVERE ASTHMA: Urgent medical review, continuous nebulization, systemic corticosteroids, target SpO₂ 94–98%."
          : "MODERATE ASTHMA EXACERBATION: Inhaled SABA via spacer or nebulizer + oral prednisolone; monitor for 1–2 hours.";

        return {
          value: isDanger ? "LIFE-THREATENING ASTHMA" : isSevere ? "ACUTE SEVERE ASTHMA" : "MODERATE ASTHMA",
          matchId: match,
          eq: verdict
        };
      }
    },

    // ==============================================================
    // 11. BERLIN DEFINITION OF ARDS
    // ==============================================================
    {
      id: "berlinArds",
      cat: "resp",
      type: "class",
      name: "Berlin ARDS Definition & Severity Staging",
      desc: "Consensus criteria defining acute respiratory distress syndrome and grading hypoxemia by PaO₂/FiO₂ ratio.",
      organ: "Alveolar-Capillary Membrane",
      region: "Intensive Care Pulmonology",
      subject: "Critical Care / Acute Lung Injury",
      keywords: ["ards", "berlin", "pao2/fio2", "p/f", "peep", "hypoxemia", "icu", "ventilator"],
      guidance: "1. Timing: Within 1 week of a known clinical insult or new/worsening respiratory symptoms.\n2. Chest Imaging: Bilateral opacities not fully explained by effusions, lobar/lung collapse, or nodules.\n3. Origin of Edema: Respiratory failure not fully explained by cardiac failure or fluid overload (objective assessment e.g., echocardiography required if no risk factor present).\n4. Oxygenation (with PEEP ≥ 5 cm H₂O): Mild (P/F 201–300); Moderate (P/F 101–200); Severe (P/F ≤ 100 mmHg).",
      contraindications: "Requires minimum PEEP/CPAP ≥5 cm H₂O. Cannot be staged accurately on ambient air without positive airway pressure.",
      literature: [
        {
          type: "Seminal Consensus Definition",
          icon: "📄",
          title: "Acute respiratory distress syndrome: the Berlin Definition",
          citation: "ARDS Definition Task Force; Ranieri VM, Rubenfeld GD, Thompson BT, et al. JAMA. 2012;307(23):2526-2533.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/22797452/" }
          ]
        }
      ],
      fields: [
        makeS("timing", "1. Acute onset within 1 week of known insult or worsening symptoms", "1", [["1", "Yes"], ["0", "No"]]),
        makeS("imaging", "2. Bilateral opacities on CXR/CT not fully explained by collapse/effusion", "1", [["1", "Yes"], ["0", "No"]]),
        makeS("origin", "3. Edema not fully explained by heart failure or volume overload", "1", [["1", "Yes"], ["0", "No"]]),
        makeN("peep", "PEEP or CPAP level (cm H₂O)", 8, { min: 0, max: 30, step: 1 }),
        makeN("pf", "PaO₂ / FiO₂ ratio (mmHg; e.g. PaO₂ 80 on 50% FiO₂ = 160)", 160, { min: 20, max: 700, step: 5 })
      ],
      table: {
        headers: ["ARDS Category", "PaO₂/FiO₂ (PEEP ≥5)", "Hospital Mortality", "Evidence-Based Ventilator Strategy"],
        rows: [
          { id: "ardsMild", cols: ["Mild ARDS", "201 – 300 mmHg", "~ 27%", "Lung-protective ventilation: Tidal volume 6 mL/kg PBW, plateau pressure <30 cm H₂O"] },
          { id: "ardsMod", cols: ["Moderate ARDS", "101 – 200 mmHg", "~ 32%", "Lung-protective ventilation + higher PEEP titration; consider early prone positioning"] },
          { id: "ardsSev", cols: ["Severe ARDS", "≤ 100 mmHg", "~ 45%", "PRONE POSITIONING (≥16 hrs/day), neuromuscular blockade infusion, evaluate for VV-ECMO"] },
          { id: "notArds", cols: ["Not ARDS", "Criteria not met or P/F >300", "—", "Investigate alternative etiologies (cardiogenic edema, pneumonia, PE)"] }
        ]
      },
      calc: function (v) {
        var meetsCriteria = v.timing === "1" && v.imaging === "1" && v.origin === "1" && +v.peep >= 5;
        var pf = +v.pf;

        if (!meetsCriteria || pf > 300) {
          return {
            value: "Berlin ARDS Criteria Not Met",
            matchId: "notArds",
            eq: "Requires: (1) Acute onset ≤7 days, (2) Bilateral opacities, (3) Non-cardiogenic origin, (4) PEEP ≥5 cm H₂O, and (5) P/F ratio ≤300 mmHg."
          };
        }

        var match = pf <= 100 ? "ardsSev" : pf <= 200 ? "ardsMod" : "ardsMild";
        var label = pf <= 100 ? "Severe ARDS (P/F ≤ 100)" : pf <= 200 ? "Moderate ARDS (P/F 101–200)" : "Mild ARDS (P/F 201–300)";

        return {
          value: label + " [P/F: " + pf + " mmHg]",
          matchId: match,
          eq: "Berlin ARDS confirmed. Tidal volume target: 4–6 mL/kg predicted body weight; keep plateau pressure ≤30 cm H₂O."
        };
      }
    },

    // ==============================================================
    // 12. ROX INDEX FOR HIGH-FLOW NASAL OXYGEN (HFNO)
    // ==============================================================
    {
      id: "roxIndex",
      cat: "resp",
      type: "calc",
      name: "ROX Index for HFNO Success vs Failure",
      desc: "Calculates (SpO₂ / FiO₂) ÷ Respiratory Rate to predict success versus impending failure of high-flow nasal oxygen.",
      organ: "Lungs / Gas Exchange",
      region: "Critical Care / Non-Invasive Support",
      subject: "Acute Hypoxemic Respiratory Failure / HFNO",
      keywords: ["rox", "rox index", "hfno", "high flow", "intubation", "hypoxemia", "failure"],
      guidance: "1. Formula: [SpO₂ (%) ÷ (FiO₂ as a fraction from 0.21 to 1.0)] ÷ Respiratory Rate (/min).\n2. Calculated after 2, 6, and 12 hours of starting HFNO.\n3. ROX ≥ 4.88: High likelihood of HFNO success; continue current therapy.\n4. ROX < 3.85 (at 12 hours): High risk of failure; prompt escalation to invasive mechanical ventilation to avoid delayed emergency intubation.",
      contraindications: "Unreliable if patient is hypercapnic (pH <7.30); does not replace clinical evaluation of work of breathing or exhaustion.",
      literature: [
        {
          type: "Seminal Derivation & Validation",
          icon: "📄",
          title: "Predictors of success of high-flow nasal cannula in pneumonia patients with hypoxemic respiratory failure: The utility of the ROX index",
          citation: "Roca O, Messika J, Caralt B, et al. J Crit Care. 2016;35:200-205.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/27481760/" }
          ]
        }
      ],
      fields: [
        makeN("spo2", "Pulse Oximetry (SpO₂, %)", 94, { min: 50, max: 100, step: 1 }),
        makeN("fio2", "Delivered Oxygen Fraction (FiO₂, %; e.g. 60% = 60)", 60, { min: 21, max: 100, step: 1 }),
        makeN("rr", "Respiratory Rate (breaths/min)", 26, { min: 5, max: 60, step: 1 }),
        makeS("time", "Duration of HFNO Therapy", "6", [
          ["2", "At 2 hours of HFNO"],
          ["6", "At 6 hours of HFNO"],
          ["12", "At 12 hours of HFNO"]
        ])
      ],
      table: {
        headers: ["ROX Threshold", "Therapy Trajectory", "Treatment Failure Risk", "Clinical Action"],
        rows: [
          { id: "roxLow", cols: ["< 3.85 (or <2.85 at 2h)", "High Failure Risk", "> 75% fail HFNO", "ESCALATE: Prepare for invasive mechanical ventilation; intubate without delay"] },
          { id: "roxGrey", cols: ["3.85 – 4.87", "Indeterminate / Grey Zone", "Moderate Risk", "Maintain close ICU monitoring; repeat ROX index in 1–2 hours"] },
          { id: "roxHigh", cols: ["≥ 4.88", "Favorable Response", "< 15% fail HFNO", "Continue HFNO; begin weaning FiO₂ as patient stabilizes"] }
        ]
      },
      calc: function (v) {
        var fracFiO2 = +v.fio2 > 1.0 ? +v.fio2 / 100 : +v.fio2;
        var rox = (+v.spo2 / fracFiO2) / +v.rr;
        var t = v.time;
        var failCutoff = t === "2" ? 2.85 : t === "6" ? 3.47 : 3.85;

        var match = rox < failCutoff ? "roxLow" : rox >= 4.88 ? "roxHigh" : "roxGrey";
        var plan = rox < failCutoff
          ? "HIGH RISK OF HFNO FAILURE (ROX < " + failCutoff + "). Prepare for prompt endotracheal intubation; do not delay."
          : rox >= 4.88
          ? "LOW RISK OF FAILURE (ROX ≥ 4.88). Patient responding favorably to HFNO; continue treatment."
          : "INTERMEDIATE ZONE (" + failCutoff + " to 4.87). Reassess clinical effort and repeat ROX in 1–2 hours.";

        return {
          value: "ROX Index: " + rox.toFixed(2),
          matchId: match,
          eq: "Formula: (SpO₂ / FiO₂) ÷ RR.\n" + plan
        };
      }
    },

    // ==============================================================
    // 13. HACOR SCORE FOR NIV FAILURE RISK
    // ==============================================================
    {
      id: "hacorScore",
      cat: "resp",
      type: "class",
      name: "HACOR Score for Non-Invasive Ventilation (NIV) Failure",
      desc: "Scores Heart rate, Acidosis, Consciousness, Oxygenation, and Respiratory rate to predict NIV failure in hypoxemic patients.",
      organ: "Brainstem / Lungs / Heart",
      region: "Critical Care Resuscitation",
      subject: "Acute Respiratory Failure / Non-Invasive Ventilation",
      keywords: ["hacor", "niv", "bipap", "failure", "intubation", "hypoxemia", "acidosis"],
      guidance: "1. Evaluated after 1–2 hours of non-invasive ventilation (NIV).\n2. Points derived from: Heart rate, Arterial pH, Glasgow Coma Scale, PaO₂/FiO₂ ratio, and Respiratory Rate.\n3. Score > 5 at 1 hour predicts NIV failure with >80% diagnostic accuracy.\n4. Prompts early elective intubation rather than delayed catastrophic crash intubation.",
      contraindications: "Does not replace immediate clinical judgment if patient develops cardiac arrest, vomiting, or acute unmanageable secretions.",
      literature: [
        {
          type: "Seminal Derivation & Validation",
          icon: "📄",
          title: "Assessment of HACOR score for predicting failure of noninvasive ventilation in patients with acute hypoxemic respiratory failure",
          citation: "Duan J, Han X, Bai L, et al. Crit Care. 2017;21(1):86.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/28381285/" }
          ]
        }
      ],
      fields: [
        makeS("hr", "1. Heart Rate (beats/min)", "0", [
          ["0", "< 100 bpm (0 pts)"],
          ["1", "100 to 120 bpm (+1 pt)"],
          ["2", "> 120 bpm (+2 pts)"]
        ]),
        makeS("ph", "2. Arterial pH (ABG)", "0", [
          ["0", "≥ 7.35 (0 pts)"],
          ["2", "7.30 to 7.34 (+2 pts)"],
          ["3", "7.25 to 7.29 (+3 pts)"],
          ["5", "7.20 to 7.24 (+5 pts)"],
          ["8", "< 7.20 (+8 pts)"]
        ]),
        makeS("gcs", "3. Glasgow Coma Scale (GCS)", "0", [
          ["0", "GCS 15 (0 pts)"],
          ["2", "GCS 13 to 14 (+2 pts)"],
          ["5", "GCS 11 to 12 (+5 pts)"],
          ["10", "GCS ≤ 10 (+10 pts)"]
        ]),
        makeS("pf", "4. PaO₂ / FiO₂ Ratio (mmHg)", "0", [
          ["0", "> 300 mmHg (0 pts)"],
          ["1", "201 to 300 mmHg (+1 pt)"],
          ["2", "176 to 200 mmHg (+2 pts)"],
          ["3", "151 to 175 mmHg (+3 pts)"],
          ["4", "126 to 150 mmHg (+4 pts)"],
          ["5", "101 to 125 mmHg (+5 pts)"],
          ["6", "≤ 100 mmHg (+6 pts)"]
        ]),
        makeS("rr", "5. Respiratory Rate (breaths/min)", "0", [
          ["0", "≤ 30 /min (0 pts)"],
          ["1", "31 to 35 /min (+1 pt)"],
          ["2", "36 to 40 /min (+2 pts)"],
          ["3", "41 to 45 /min (+3 pts)"],
          ["4", "> 45 /min (+4 pts)"]
        ])
      ],
      table: {
        headers: ["HACOR Score (at 1–2h)", "NIV Failure Probability", "In-Hospital Mortality", "Recommended Action"],
        rows: [
          { id: "hacorLow", cols: ["≤ 5 points", "Low Risk (< 15%)", "< 10%", "Continue NIV; maintain close respiratory rate and blood gas monitoring"] },
          { id: "hacorHigh", cols: ["> 5 points", "HIGH RISK (> 80%)", "> 45%", "EMERGENT INTUBATION: High likelihood of NIV failure; escalate to mechanical ventilation immediately"] }
        ]
      },
      calc: function (v) {
        var score = +v.hr + +v.ph + +v.gcs + +v.pf + +v.rr;
        var match = score > 5 ? "hacorHigh" : "hacorLow";
        var plan = score > 5
          ? "HACOR > 5 points (>80% NIV failure risk). Prepare for prompt endotracheal intubation; do not prolong failing NIV trial."
          : "HACOR ≤ 5 points (Favorable NIV response). Continue non-invasive ventilation and recheck ABG in 2–4 hours.";

        return {
          value: "HACOR Score: " + score + " Points",
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 14. P/F RATIO & S/F RATIO (OXYGENATION INDICES)
    // ==============================================================
    {
      id: "oxygenationIndices",
      cat: "resp",
      type: "calc",
      name: "PaO₂/FiO₂ (P/F) and SpO₂/FiO₂ (S/F) Ratio",
      desc: "Calculates physiologic arterial and non-invasive pulse oximetric oxygenation ratios for hypoxemic respiratory failure.",
      organ: "Alveoli / Capillary Bed",
      region: "Gas Exchange",
      subject: "Arterial Blood Gas / Hypoxemia",
      keywords: ["p/f", "s/f", "pao2", "spo2", "fio2", "oxygenation", "hypoxemia", "ards"],
      guidance: "1. P/F ratio is the gold standard for defining acute lung injury and ARDS on arterial blood gas.\n2. S/F ratio provides a non-invasive surrogate when ABG is unavailable: S/F 235 roughly corresponds to P/F 200, and S/F 315 corresponds to P/F 300.\n3. Note: SpO₂ values >97% underestimate severe hyperoxemia because the oxyhemoglobin dissociation curve flattens completely.",
      contraindications: "SpO₂ is unreliable in severe shock, peripheral vasoconstriction, carbon monoxide poisoning (carboxyhemoglobin), and methemoglobinemia.",
      literature: [
        {
          type: "Seminal Correlation Study",
          icon: "📄",
          title: "Noninvasive estimation of the PaO₂/FiO₂ ratio by the SpO₂/FiO₂ ratio to identify patients with acute lung injury and acute respiratory distress syndrome",
          citation: "Rice TW, Wheeler AP, Bernard GR, et al. Chest. 2007;132(2):410-417.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/17646227/" }
          ]
        }
      ],
      fields: [
        makeN("fio2", "Fraction of Inspired Oxygen (FiO₂, %; e.g. 40% = 40)", 50, { min: 21, max: 100, step: 1 }),
        makeN("pao2", "Arterial PaO₂ from ABG (mmHg; enter 0 if unavailable)", 80, { min: 0, max: 600, step: 1 }),
        makeN("spo2", "Pulse Oximetry SpO₂ (% on same FiO₂)", 94, { min: 50, max: 100, step: 1 })
      ],
      table: {
        headers: ["Index Value", "Equivalent Hypoxemia Tier", "ARDS Staging", "Clinical Meaning"],
        rows: [
          { id: "hypoxNormal", cols: ["P/F > 300 (S/F > 315)", "Normal / Preserved", "No ARDS", "Normal alveolar-capillary oxygen diffusion"] },
          { id: "hypoxMild", cols: ["P/F 201–300 (S/F 236–315)", "Mild Gas Exchange Deficit", "Mild ARDS", "Initiate low-level PEEP; assess underlying parenchymal cause"] },
          { id: "hypoxMod", cols: ["P/F 101–200 (S/F 151–235)", "Moderate Hypoxemia", "Moderate ARDS", "High risk of respiratory fatigue; optimize lung-protective ventilation"] },
          { id: "hypoxSev", cols: ["P/F ≤ 100 (S/F ≤ 150)", "Severe Hypoxemic Failure", "Severe ARDS", "Refractory shunting; prone positioning, paralytics, ECMO evaluation"] }
        ]
      },
      calc: function (v) {
        var fracFiO2 = +v.fio2 > 1.0 ? +v.fio2 / 100 : +v.fio2;
        var sf = +v.spo2 / fracFiO2;
        var pf = +v.pao2 > 0 ? (+v.pao2 / fracFiO2) : null;

        var refVal = pf !== null ? pf : (sf * (200 / 235));
        var match = refVal <= 100 ? "hypoxSev" : refVal <= 200 ? "hypoxMod" : refVal <= 300 ? "hypoxMild" : "hypoxNormal";
        var label = refVal <= 100 ? "Severe Hypoxemia" : refVal <= 200 ? "Moderate Hypoxemia" : refVal <= 300 ? "Mild Hypoxemia" : "Preserved Oxygenation";

        var outStr = "S/F Ratio: " + Math.round(sf);
        if (pf !== null) {
          outStr = "P/F Ratio: " + Math.round(pf) + " mmHg | " + outStr;
        }

        return {
          value: outStr + " (" + label + ")",
          matchId: match,
          eq: "P/F = PaO₂ ÷ FiO₂ (decimal). S/F = SpO₂ ÷ FiO₂ (decimal). S/F 235 ≈ P/F 200; S/F 315 ≈ P/F 300."
        };
      }
    },

    // ==============================================================
    // 15. ALVEOLAR-ARTERIAL OXYGEN GRADIENT (A-a GRADIENT)
    // ==============================================================
    {
      id: "aaGradient",
      cat: "resp",
      type: "calc",
      name: "Alveolar–Arterial Oxygen Gradient (A-a Gradient)",
      desc: "Distinguishes hypoventilation from V/Q mismatch and shunt as the cause of arterial hypoxemia.",
      organ: "Alveoli / Pulmonary Capillaries",
      region: "Gas Exchange Physiology",
      subject: "Arterial Blood Gas / Physiology",
      keywords: ["a-a gradient", "alveolar", "gas equation", "hypoxemia", "v/q mismatch", "shunt", "abg"],
      guidance: "1. Formula: P_A_O₂ = [FiO₂ × (Patm − PH₂O)] − (PaCO₂ ÷ R). At sea level: [FiO₂ × (760 − 47)] − (PaCO₂ ÷ 0.8).\n2. A-a Gradient = P_A_O₂ − PaO₂.\n3. Expected normal A-a gradient on room air: (Age ÷ 4) + 4 (normal range 5–15 mmHg in young adults, up to 25–30 mmHg in elderly).\n4. Normal gradient in hypoxemic patient indicates pure alveolar hypoventilation (CNS depression, muscle weakness) or low PiO₂ (altitude).\n5. Elevated gradient indicates intrinsic lung pathology: V/Q mismatch, right-to-left shunt, or diffusion impairment.",
      contraindications: "Most accurate on room air (FiO₂ 0.21); high inspired oxygen concentrations distort the respiratory quotient R.",
      literature: [
        {
          type: "Seminal Review",
          icon: "📄",
          title: "The A-a oxygen gradient: interpretation and clinical applications",
          citation: "Kanber GJ, King TE, Kuhn C, et al. Mayo Clin Proc. 1974;49(9):661-667.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/4414164/" }
          ]
        }
      ],
      fields: [
        makeN("age", "Patient Age (years)", 60, { min: 1, max: 110, step: 1 }),
        makeN("pao2", "Measured PaO₂ on ABG (mmHg)", 68, { min: 20, max: 600, step: 1 }),
        makeN("paco2", "Measured PaCO₂ on ABG (mmHg)", 40, { min: 10, max: 150, step: 1 }),
        makeN("fio2", "FiO₂ (decimal or %; e.g. room air = 21% or 0.21)", 21, { min: 21, max: 100, step: 1 })
      ],
      table: {
        headers: ["A-a Gradient Status", "Alveolar Exchange", "Physiologic Mechanism", "Differential Diagnosis"],
        rows: [
          { id: "aaNormal", cols: ["Normal Gradient (≤ Expected)", "Intact alveolar membrane", "Pure Alveolar Hypoventilation", "Opioid / sedative overdose, neuromuscular weakness (GBS/MG), chest wall deformity, high altitude"] },
          { id: "aaElevated", cols: ["Elevated Gradient (> Expected)", "Impaired diffusion / shunt", "V/Q Mismatch or Shunting", "Pneumonia, Pulmonary Embolism, ARDS, Atelectasis, Cardiogenic Pulmonary Edema, Interstitial Lung Disease"] }
        ]
      },
      calc: function (v) {
        var f = +v.fio2 > 1.0 ? +v.fio2 / 100 : +v.fio2;
        var pAtm = 760;
        var pH2O = 47;
        var r = 0.8;

        var pAO2 = (f * (pAtm - pH2O)) - (+v.paco2 / r);
        var gradient = pAO2 - +v.pao2;
        var expectedNormal = (+v.age / 4) + 4;

        var isElevated = gradient > expectedNormal;
        var match = isElevated ? "aaElevated" : "aaNormal";
        var mechanism = isElevated
          ? "ELEVATED A-a Gradient: Intrinsic parenchymal or vascular pathology (V/Q mismatch, shunt, diffusion block: PE, pneumonia, edema, ARDS)."
          : "NORMAL A-a Gradient: Pure hypoventilation or low environmental oxygen (CNS depression, neuromuscular disease, altitude).";

        return {
          value: "A-a Gradient: " + gradient.toFixed(1) + " mmHg (Expected: ≤ " + expectedNormal.toFixed(1) + " mmHg)",
          matchId: match,
          eq: mechanism
        };
      }
    },

    // ==============================================================
    // 16. STOP-BANG SLEEP APNEA SCREENING
    // ==============================================================
    {
      id: "stopBang",
      cat: "resp",
      type: "class",
      name: "STOP-BANG Sleep Apnea Screening Questionnaire",
      desc: "Preoperative and outpatient screening questionnaire for Obstructive Sleep Apnea (OSA).",
      organ: "Pharynx / Upper Airway",
      region: "Sleep Medicine",
      subject: "Sleep Disordered Breathing / Preoperative Risk",
      keywords: ["stop-bang", "osa", "sleep apnea", "snoring", "polysomnography", "preop", "hypopnea"],
      guidance: "1. STOP: Snoring, Tiredness/fatigue, Observed apneas, high blood Pressure.\n2. BANG: BMI >35 kg/m², Age >50 years, Neck circumference >40 cm (16 in), Gender male.\n3. Score 0–2: Low OSA risk.\n4. Score 3–4: Intermediate risk.\n5. Score 5–8: High risk for moderate-to-severe OSA; warrants formal diagnostic polysomnography.",
      contraindications: "Screening tool only; does not establish a definitive medical diagnosis of obstructive sleep apnea without sleep study confirmation.",
      literature: [
        {
          type: "Seminal Derivation & Validation",
          icon: "📄",
          title: "STOP questionnaire: a tool to screen patients for obstructive sleep apnea",
          citation: "Chung F, Yegneswaran B, Liao P, et al. Anesthesiology. 2008;108(5):812-821.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/18431116/" }
          ]
        }
      ],
      fields: [
        makeS("snore", "1. Snoring: Do you snore loudly (louder than talking or through closed doors)?", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("tired", "2. Tired: Do you often feel tired, fatigued, or sleepy during the daytime?", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("observed", "3. Observed: Has anyone observed you stop breathing or choking during sleep?", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("pressure", "4. Blood Pressure: Do you have or are you being treated for hypertension?", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("bmi", "5. BMI: Body Mass Index > 35 kg/m²?", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("age", "6. Age: Age older than 50 years?", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("neck", "7. Neck Circumference: Collar size > 40 cm (16 inches)?", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("gender", "8. Gender: Biological male?", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      table: {
        headers: ["STOP-BANG Score", "Risk Tier for Moderate/Severe OSA", "Sensitivity for AHI >30", "Recommended Pathway"],
        rows: [
          { id: "sbLow", cols: ["0 – 2 points", "Low Risk", "Low probability", "Routine clinical management; reassurance"] },
          { id: "sbMod", cols: ["3 – 4 points", "Intermediate Risk", "~ 75%", "Consider sleep medicine referral if daytime somnolence or CV comorbidities present"] },
          { id: "sbHigh", cols: ["5 – 8 points", "HIGH RISK", "> 93%", "Formal Polysomnography (PSG) or home sleep testing; perioperative airway precautions"] }
        ]
      },
      calc: function (v) {
        var score = +v.snore + +v.tired + +v.observed + +v.pressure + +v.bmi + +v.age + +v.neck + +v.gender;
        var match = score >= 5 ? "sbHigh" : score >= 3 ? "sbMod" : "sbLow";
        var label = score >= 5 ? "High Risk for Moderate-to-Severe OSA" : score >= 3 ? "Intermediate Risk for OSA" : "Low Risk for OSA";

        return {
          value: "STOP-BANG Score: " + score + " / 8 (" + label + ")",
          matchId: match,
          eq: score >= 5
            ? "High risk of moderate-to-severe OSA. Refer for diagnostic polysomnography; plan difficult airway precautions for anesthesia."
            : "Screening assessment complete. Correlate with Epworth Sleepiness Scale and clinical findings."
        };
      }
    },

    // ==============================================================
    // 17. EPWORTH SLEEPINESS SCALE (ESS)
    // ==============================================================
    {
      id: "epworthScale",
      cat: "resp",
      type: "class",
      name: "Epworth Sleepiness Scale (ESS)",
      desc: "Standard self-administered questionnaire measuring daytime sleepiness across eight daily scenarios.",
      organ: "Central Nervous System / Sleep Center",
      region: "Sleep Medicine",
      subject: "Daytime Somnolence / Narcolepsy & OSA",
      keywords: ["epworth", "ess", "sleepiness", "somnolence", "narcolepsy", "osa", "fatigue"],
      guidance: "1. Rates chance of dozing from 0 (would never doze) to 3 (high chance of dozing) in 8 daytime situations.\n2. Total score ranges from 0 to 24.\n3. Score > 10 signifies excessive daytime sleepiness (EDS).\n4. Score ≥ 16 indicates severe pathologic daytime sleepiness; evaluate for narcolepsy, severe OSA, or idiopathics.",
      contraindications: "Subjective measure prone to underreporting by professional drivers or commercial operators.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "A new method for measuring daytime sleepiness: the Epworth Sleepiness Scale",
          citation: "Johns MW. Sleep. 1991;14(6):540-545.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/1798888/" }
          ]
        }
      ],
      fields: [
        makeS("q1", "1. Sitting and reading", "0", [["0", "0 — Would never doze"], ["1", "1 — Slight chance"], ["2", "2 — Moderate chance"], ["3", "3 — High chance"]]),
        makeS("q2", "2. Watching television", "0", [["0", "0 — Would never doze"], ["1", "1 — Slight chance"], ["2", "2 — Moderate chance"], ["3", "3 — High chance"]]),
        makeS("q3", "3. Sitting inactive in a public place (e.g. theater, meeting)", "0", [["0", "0 — Would never doze"], ["1", "1 — Slight chance"], ["2", "2 — Moderate chance"], ["3", "3 — High chance"]]),
        makeS("q4", "4. As a passenger in a car for an hour without a break", "0", [["0", "0 — Would never doze"], ["1", "1 — Slight chance"], ["2", "2 — Moderate chance"], ["3", "3 — High chance"]]),
        makeS("q5", "5. Lying down to rest in the afternoon when circumstances permit", "0", [["0", "0 — Would never doze"], ["1", "1 — Slight chance"], ["2", "2 — Moderate chance"], ["3", "3 — High chance"]]),
        makeS("q6", "6. Sitting and talking to someone", "0", [["0", "0 — Would never doze"], ["1", "1 — Slight chance"], ["2", "2 — Moderate chance"], ["3", "3 — High chance"]]),
        makeS("q7", "7. Sitting quietly after a lunch without alcohol", "0", [["0", "0 — Would never doze"], ["1", "1 — Slight chance"], ["2", "2 — Moderate chance"], ["3", "3 — High chance"]]),
        makeS("q8", "8. In a car, while stopped for a few minutes in traffic", "0", [["0", "0 — Would never doze"], ["1", "1 — Slight chance"], ["2", "2 — Moderate chance"], ["3", "3 — High chance"]])
      ],
      table: {
        headers: ["Score Range", "Daytime Sleepiness Level", "Clinical Interpretation", "Action"],
        rows: [
          { id: "essNormal", cols: ["0 – 10 points", "Normal Range", "Normal daytime alertness", "No specific diagnostic sleep testing required unless symptoms suggest otherwise"] },
          { id: "essMild", cols: ["11 – 15 points", "Excessive Daytime Sleepiness", "Mild-to-moderate somnolence", "Investigate sleep hygiene, sleep debt, shift work, and mild-to-moderate OSA"] },
          { id: "essSevere", cols: ["16 – 24 points", "Severe Excessive Somnolence", "Pathologic daytime sleepiness", "URGENT sleep clinic referral; polysomnography / MSLT; caution regarding driving safety"] }
        ]
      },
      calc: function (v) {
        var score = +v.q1 + +v.q2 + +v.q3 + +v.q4 + +v.q5 + +v.q6 + +v.q7 + +v.q8;
        var match = score >= 16 ? "essSevere" : score >= 11 ? "essMild" : "essNormal";
        var label = score >= 16 ? "Severe Excessive Daytime Sleepiness" : score >= 11 ? "Excessive Daytime Sleepiness" : "Normal Daytime Alertness";

        return {
          value: "ESS Score: " + score + " / 24 (" + label + ")",
          matchId: match,
          eq: score >= 11
            ? "Score >10 indicates excessive daytime sleepiness. Evaluate for obstructive sleep apnea, narcolepsy, or chronic sleep deprivation."
            : "Normal daytime alertness score."
        };
      }
    },

    // ==============================================================
    // 18. SPIROMETRY PATTERN INTERPRETATION
    // ==============================================================
    {
      id: "spirometryInterp",
      cat: "resp",
      type: "class",
      name: "Spirometry Ventilatory Pattern Interpretation",
      desc: "Differential categorization of obstructive, restrictive, and mixed ventilatory defects.",
      organ: "Lungs / Airways / Chest Wall",
      region: "Pulmonary Diagnostics",
      subject: "Pulmonary Function Testing (PFT)",
      keywords: ["spirometry", "fev1", "fvc", "obstruction", "restriction", "pft", "ratio"],
      guidance: "1. Step 1: Examine post-bronchodilator FEV₁/FVC ratio. If <0.70 (or below lower limit of normal LLN), an Obstructive Ventilatory Defect is confirmed.\n2. Step 2: Examine FVC. If FEV₁/FVC is normal (≥0.70) but FVC is <80% predicted, a Possible Restrictive Defect is suspected.\n3. Restriction CANNOT be diagnosed by spirometry alone; total lung capacity (TLC <80% on plethysmography) is required.\n4. If both FEV₁/FVC <0.70 and FVC <80% predicted, suspect Mixed Defect vs air trapping/hyperinflation.",
      contraindications: "Recent myocardial infarction (<1 month), thoracic/abdominal aortic aneurysm, recent eye surgery (cataract), or pneumothorax.",
      literature: [
        {
          type: "Official ATS/ERS Standard",
          icon: "📘",
          title: "Standardisation of spirometry",
          citation: "Miller MR, Hankinson J, Brusasco V, et al. Eur Respir J. 2005;26(2):319-338.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/16055882/" }
          ]
        }
      ],
      fields: [
        makeN("ratio", "Post-Bronchodilator FEV₁/FVC Ratio (decimal, e.g. 0.68)", 0.68, { min: 0.20, max: 1.00, step: 0.01 }),
        makeN("fev1", "Post-Bronchodilator FEV₁ (% predicted)", 65, { min: 10, max: 150, step: 1 }),
        makeN("fvc", "Forced Vital Capacity (FVC, % predicted)", 78, { min: 10, max: 150, step: 1 })
      ],
      table: {
        headers: ["Pattern Category", "FEV₁/FVC Ratio", "FVC % Predicted", "Next Diagnostic Step"],
        rows: [
          { id: "pattNorm", cols: ["Normal Spirometry", "≥ 0.70", "≥ 80%", "Normal mechanical ventilatory function"] },
          { id: "pattObs", cols: ["Obstructive Defect", "< 0.70", "≥ 80%", "Evaluate bronchodilator reversibility (asthma vs COPD); grade severity by FEV₁"] },
          { id: "pattRest", cols: ["Possible Restrictive Defect", "≥ 0.70", "< 80%", "CONFIRM WITH PLETHYSMOGRAPHY: Measure Total Lung Capacity (TLC <80%) and DLCO"] },
          { id: "pattMixed", cols: ["Mixed Pattern / Air Trapping", "< 0.70", "< 80%", "Order full PFT with lung volumes to distinguish true mixed disease from pseudorestriction (severe gas trapping)"] }
        ]
      },
      calc: function (v) {
        var isObs = +v.ratio < 0.70;
        var isLowFvc = +v.fvc < 80;

        var match = "pattNorm", pattern = "Normal Spirometric Pattern";
        if (isObs && isLowFvc) {
          match = "pattMixed";
          pattern = "Mixed Pattern (Obstruction with Reduced FVC)";
        } else if (isObs) {
          match = "pattObs";
          pattern = "Obstructive Ventilatory Defect";
        } else if (isLowFvc) {
          match = "pattRest";
          pattern = "Possible Restrictive Ventilatory Defect";
        }

        return {
          value: pattern + " (FEV₁/FVC: " + (+v.ratio).toFixed(2) + ", FVC: " + v.fvc + "%)",
          matchId: match,
          eq: isLowFvc && !isObs
            ? "Reduced FVC with normal ratio suggests restriction, but true restriction requires Total Lung Capacity (TLC <80%) on body plethysmography."
            : "Spirometric classification per ATS/ERS guidelines."
        };
      }
    },

    // ==============================================================
    // 19. WHO FUNCTIONAL CLASSIFICATION OF PULMONARY HYPERTENSION
    // ==============================================================
    {
      id: "whoPhClass",
      cat: "resp",
      type: "class",
      name: "WHO Functional Assessment of Pulmonary Hypertension",
      desc: "Adapts the NYHA functional classification specifically for pulmonary arterial hypertension (PAH).",
      organ: "Pulmonary Arteries / Right Heart",
      region: "Cardiopulmonary",
      subject: "Pulmonary Vascular Disease / Pulmonary Hypertension",
      keywords: ["pulmonary hypertension", "pah", "who", "nyha", "functional class", "right heart"],
      guidance: "1. Class I: No limitation of physical activity. Ordinary physical activity does not cause undue dyspnea, fatigue, or chest pain.\n2. Class II: Slight limitation. Comfortable at rest, but ordinary physical activity produces undue dyspnea or fatigue.\n3. Class III: Marked limitation. Comfortable at rest, but less than ordinary activity causes dyspnea or presyncope.\n4. Class IV: Inability to perform any physical activity without symptoms. Manifestations of right-heart failure (edema, ascites) or syncope at rest.",
      contraindications: "Subjective assessment; should be paired with 6-minute walk distance (6MWD) and NT-proBNP.",
      literature: [
        {
          type: "Official Consensus Statement",
          icon: "📘",
          title: "Updated clinical classification of pulmonary hypertension",
          citation: "Simonneau G, Montani D, Celermajer DS, et al. J Am Coll Cardiol. 2013;62(25 Suppl):D34-D41.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/24355639/" }
          ]
        }
      ],
      fields: [
        makeS("phClass", "Functional Capability & Symptom Presentation", "II", [
          ["I", "Class I: No limitation of physical activity; ordinary activity does not cause breathlessness"],
          ["II", "Class II: Slight limitation; comfortable at rest, but ordinary activity causes dyspnea or fatigue"],
          ["III", "Class III: Marked limitation; comfortable at rest, but less than ordinary activity causes dyspnea or presyncope"],
          ["IV", "Class IV: Inability to perform any physical activity; symptoms at rest, syncope, or right-heart failure"]
        ])
      ],
      table: {
        headers: ["WHO Class", "Symptom Threshold", "Prognostic Risk", "Therapeutic Strategy"],
        rows: [
          { id: "whoI", cols: ["Class I", "None with ordinary activity", "Low Risk", "Monotherapy or close observation; regular 3–6 month screening"] },
          { id: "whoII", cols: ["Class II", "Ordinary exertion triggers dyspnea", "Low–Intermediate", "Initial oral combination therapy (ERA + PDE5i; e.g. Ambrisentan + Tadalafil)"] },
          { id: "whoIII", cols: ["Class III", "Less than ordinary exertion / presyncope", "Intermediate–High", "Aggressive oral combination therapy or parenteral prostacyclin analogue"] },
          { id: "whoIV", cols: ["Class IV", "Symptoms at rest / Right ventricular failure", "HIGH RISK", "Continuous IV/SC prostacyclin (Epoprostenol / Treprostinil) + urgent lung transplant evaluation"] }
        ]
      },
      calc: function (v) {
        var c = v.phClass;
        var match = "who" + c;
        var plan = c === "IV"
          ? "WHO Functional Class IV (High 1-year mortality >20%). Continuous parenteral prostacyclin infusion and prompt lung transplant referral."
          : c === "III"
          ? "WHO Functional Class III. Double or triple combination targeted pulmonary vasodilator therapy."
          : c === "II"
          ? "WHO Functional Class II. Standard upfront oral dual combination therapy (ERA + PDE5 inhibitor)."
          : "WHO Functional Class I. Stable functional state; routine surveillance.";

        return {
          value: "WHO Functional Class " + c,
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 20. BAP-65 SCORE FOR ACUTE COPD EXACERBATIONS
    // ==============================================================
    {
      id: "bap65",
      cat: "resp",
      type: "class",
      name: "BAP-65 Score for Acute COPD Exacerbations",
      desc: "Scores BUN, Altered mental status, Pulse, and Age ≥65 to predict in-hospital mortality and mechanical ventilation in acute COPD.",
      organ: "Lungs / Systemic Circulation",
      region: "Emergency Pulmonology",
      subject: "COPD Exacerbation / Inpatient Mortality",
      keywords: ["bap65", "bap-65", "copd", "exacerbation", "mortality", "bun", "pulse"],
      guidance: "1. 1 point each: Blood Urea Nitrogen >25 mg/dL (8.9 mmol/L), Altered mental status (lethargy, stupor, disorientation, or GCS <15), Pulse ≥109 beats/min, Age ≥65 years.\n2. Class I (0 pts): In-hospital mortality <1%; suitable for outpatient management.\n3. Class II (1 pt): In-hospital mortality ~1%; consider ward admission.\n4. Class III (2 pts): Mortality ~6%; requires hospital admission.\n5. Class IV (3 pts): Mortality ~13%; evaluate for ICU care.\n6. Class V (4 pts): Mortality >25%; high need for mechanical ventilation; critical care admission.",
      contraindications: "Does not evaluate acute arterial hypercapnic acidosis; an ABG is mandatory in all hospitalized COPD exacerbations.",
      literature: [
        {
          type: "Seminal Derivation & Validation",
          icon: "📄",
          title: "Development and validation of a clinical score to assess risk of all-cause mortality in COPD exacerbations",
          citation: "Shorr AF, Sun X, Johannes RS, et al. Chest. 2005;128(4):2201-2207.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/16236773/" }
          ]
        }
      ],
      fields: [
        makeS("bun", "1. BUN > 25 mg/dL (> 8.9 mmol/L)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("ams", "2. Altered Mental Status (GCS <15, disorientation, or somnolence)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("pulse", "3. Pulse ≥ 109 beats/min", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("age", "4. Age ≥ 65 years", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      table: {
        headers: ["BAP-65 Class", "Score", "In-Hospital Mortality", "Recommended Site of Care"],
        rows: [
          { id: "bap1", cols: ["Class I", "0 points", "< 1.0%", "Outpatient management or short observation if stable"] },
          { id: "bap2", cols: ["Class II", "1 point", "~ 1.0%", "General medical ward admission; monitored oral/IV bronchodilators"] },
          { id: "bap3", cols: ["Class III", "2 points", "~ 5.6%", "Inpatient hospital admission; close monitoring of arterial blood gases"] },
          { id: "bap4", cols: ["Class IV", "3 points", "~ 13.0%", "High-dependency unit or intensive care evaluation"] },
          { id: "bap5", cols: ["Class V", "4 points", "~ 25.0%", "ICU ADMISSION: High risk of mechanical ventilation / NIV failure"] }
        ]
      },
      calc: function (v) {
        var score = +v.bun + +v.ams + +v.pulse + +v.age;
        var cls = score === 0 ? "I" : score === 1 ? "II" : score === 2 ? "III" : score === 3 ? "IV" : "V";
        var match = "bap" + (score + 1);
        var mort = score === 0 ? "<1%" : score === 1 ? "~1%" : score === 2 ? "5.6%" : score === 3 ? "13%" : ">25%";

        return {
          value: "BAP-65 Class " + cls + " (" + score + " / 4 Criteria Met)",
          matchId: match,
          eq: "In-hospital mortality risk: " + mort + ".\nCriteria: BUN >25 mg/dL, Altered mental status, Pulse ≥109 bpm, Age ≥65."
        };
      }
    }
  ];

  // ==============================================================
  // REGISTRATION INTO GLOBAL MEMORY (DOM COLLISION-PROOF)
  // ==============================================================
  try {
    if (!Array.isArray(window.categories)) {
      window.categories = [];
    }
    if (!Array.isArray(window.tools)) {
      window.tools = [];
    }

    // 1. Safely add category
    var catExists = false;
    for (var i = 0; i < window.categories.length; i++) {
      if (window.categories[i] && window.categories[i].id === respCategory.id) {
        catExists = true;
        break;
      }
    }
    if (!catExists) {
      window.categories.push(respCategory);
    }

    // 2. Safely add tools
    respTools.forEach(function (tool) {
      var existingIdx = -1;
      for (var j = 0; j < window.tools.length; j++) {
        if (window.tools[j] && window.tools[j].id === tool.id) {
          existingIdx = j;
          break;
        }
      }
      if (existingIdx >= 0) {
        window.tools[existingIdx] = tool;
      } else {
        window.tools.push(tool);
      }
    });

    // 3. Extend search synonym map
    if (typeof window.SYNONYM_MAP === "object" && window.SYNONYM_MAP !== null) {
      window.SYNONYM_MAP["resp"] = ["resp", "respiratory", "pulmonology", "lung", "pneumonia", "asthma", "copd", "ards", "embolism"];
      window.SYNONYM_MAP["pneumonia"] = ["pneumonia", "curb65", "crb65", "cap", "smartcop", "psi", "port"];
      window.SYNONYM_MAP["pe"] = ["pe", "pulmonary embolism", "wells", "geneva", "perc", "pesi", "spesi", "d-dimer", "thrombosis"];
      window.SYNONYM_MAP["copd"] = ["copd", "gold", "fev1", "bap65", "mmrc", "abe", "emphysema", "bronchitis"];
      window.SYNONYM_MAP["asthma"] = ["asthma", "pef", "bts", "sign", "bronchospasm", "wheeze"];
      window.SYNONYM_MAP["ards"] = ["ards", "berlin", "rox", "hacor", "pao2", "fio2", "p/f", "a-a gradient", "peep"];
      window.SYNONYM_MAP["sleep"] = ["osa", "apnea", "stopbang", "stop-bang", "epworth", "ess", "snoring", "somnolence"];
    }

    // 4. Force repaint if the HTML engine has already initialized
    if (typeof window.renderHome === "function") {
      window.renderHome();
    }
  } catch (err) {
    console.error("Critical error registering Respiratory tools:", err);
  }
})();
