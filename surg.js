/**
 * MedCalc Module: General & Surgical Subspecialties (SURGERY)
 * Fully compatible with the MedCalc HTML application structure and ortho.js architecture.
 */
(function () {
  "use strict";

  // Use the global constructors declared in the HTML header
  var makeN = (typeof window !== "undefined" && window.N) ? window.N : function (id, label, defaultVal, extra) {
    extra = extra || {};
    return Object.assign({ id: id, label: label, type: "number", value: defaultVal, default: defaultVal }, extra);
  };
  var makeS = (typeof window !== "undefined" && window.S) ? window.S : function (id, label, defaultVal, options) {
    options = options || [];
    return { id: id, label: label, type: "select", value: defaultVal, default: defaultVal, options: options };
  };

  var surgeryCategory = {
    id: "surgery",
    name: "General & Oncologic Surgery",
    icon: "🔪",
    desc: "Surgical risk stratification, acute abdomen calculators, pancreatitis criteria, oncology TNM, and wound classifications",
    organs: ["appendix", "gallbladder", "pancreas", "colon", "rectum", "breast", "stomach", "liver", "thyroid", "peritoneum"],
    region: "abdomen / oncology / perioperative"
  };

  var surgeryTools = [
    // ==============================================================
    // 1. ALVARADO SCORE FOR ACUTE APPENDICITIS
    // ==============================================================
    {
      id: "alvaradoScore",
      cat: "surgery",
      type: "calc",
      name: "Alvarado Score (MANTRELS) for Acute Appendicitis",
      desc: "Stratifies clinical probability of acute appendicitis to guide cross-sectional imaging vs surgical exploration.",
      organ: "Appendix / Right Lower Quadrant",
      region: "Abdomen / Gastrointestinal",
      subject: "Emergency General Surgery / Acute Abdomen",
      keywords: ["alvarado", "mantrels", "appendicitis", "rlq", "leukocytosis", "rebound", "appendix"],
      guidance: "1. MANTRELS mnemonic: Migration of pain (1), Anorexia (1), Nausea/vomiting (1), Tenderness RLQ (2), Rebound tenderness (1), Elevated temperature ≥37.3°C (1), Leukocytosis WBC >10,000 (2), Shift of neutrophils to left >75% (1).\n2. Maximum score = 10.\n3. Score ≤4: Appendicitis very unlikely; consider discharge or alternative diagnosis.\n4. Score 5–6: Equivocal/compatible; obtain ultrasound or IV-contrast CT.\n5. Score ≥7: High probability; urgent surgical consult.",
      contraindications: "Less specific in women of childbearing age due to pelvic/gynecologic confounders; low sensitivity in pediatric and geriatric cohorts.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "A practical score for the early diagnosis of acute appendicitis",
          citation: "Alvarado A. Ann Emerg Med. 1986;15(5):557-564.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/3963537/" }
          ]
        }
      ],
      fields: [
        makeS("migration", "1. Migration of pain to Right Lower Quadrant", "1", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("anorexia", "2. Anorexia (loss of appetite) or acetone in urine", "1", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("nausea", "3. Nausea or vomiting", "1", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("rlqTenderness", "4. Tenderness in Right Lower Quadrant", "2", [["0", "No (0 pts)"], ["2", "Yes (+2 pts)"]]),
        makeS("rebound", "5. Rebound tenderness in RLQ (Blumberg sign)", "1", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("fever", "6. Elevated temperature (≥ 37.3 °C / 99.1 °F)", "1", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("leukocytosis", "7. Leukocytosis (WBC > 10,000 cells/µL)", "2", [["0", "No (0 pts)"], ["2", "Yes (+2 pts)"]]),
        makeS("shift", "8. Neurotrophil left shift (> 75% segmented neutrophils)", "1", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]])
      ],
      table: {
        headers: ["Score Range", "Risk Level", "Appendicitis Probability", "Clinical Pathway"],
        rows: [
          { id: "low", cols: ["Score 1 – 4", "Low Probability", "< 5%", "Appendicitis ruled out; investigate non-appendiceal causes, outpatient follow-up"] },
          { id: "equivocal", cols: ["Score 5 – 6", "Intermediate / Equivocal", "30% – 50%", "Observation, serial exams, IV-contrast abdominal/pelvic CT or ultrasound"] },
          { id: "high", cols: ["Score 7 – 8", "High Probability", "70% – 80%", "Surgical consultation; diagnostic cross-sectional imaging or laparoscopy"] },
          { id: "definite", cols: ["Score 9 – 10", "Definite Appendicitis", "> 90%", "Immediate surgical exploration (laparoscopic appendectomy)"] }
        ]
      },
      calc: function (v) {
        var score = +v.migration + +v.anorexia + +v.nausea + +v.rlqTenderness + +v.rebound + +v.fever + +v.leukocytosis + +v.shift;
        var match = "low", risk = "Low Risk (Score ≤ 4)", plan = "Appendicitis unlikely. Consider observation or workup of alternative etiologies.";

        if (score >= 9) {
          match = "definite";
          risk = "Definite Acute Appendicitis (Score 9–10)";
          plan = "Very high probability (>90%). Urgent general surgical consult for prompt laparoscopic appendectomy.";
        } else if (score >= 7) {
          match = "high";
          risk = "High Probability (Score 7–8)";
          plan = "High risk of acute appendicitis. Surgical consultation recommended; proceed to imaging (CT/US) or operative theater.";
        } else if (score >= 5) {
          match = "equivocal";
          risk = "Intermediate / Equivocal (Score 5–6)";
          plan = "Equivocal clinical picture. Active observation with abdominal CT scan (or graded compression US in women/children).";
        }

        return {
          value: "Alvarado Score: " + score + " / 10 (" + risk + ")",
          matchId: match,
          eq: "MANTRELS Breakdown: Symptoms (3) + Signs (3) + Labs (3) = Total " + score + ".\n" + plan
        };
      }
    },

    // ==============================================================
    // 2. CLAVIEN-DINDO POSTOPERATIVE COMPLICATIONS CLASSIFICATION
    // ==============================================================
    {
      id: "clavienDindo",
      cat: "surgery",
      type: "class",
      name: "Clavien–Dindo Classification of Surgical Complications",
      desc: "Standardized grading system for reporting postoperative morbidity and complications based on therapy required.",
      organ: "Systemic / Postoperative",
      region: "Perioperative Quality & Outcomes",
      subject: "Surgical Audit / Quality Improvement",
      keywords: ["clavien", "dindo", "complication", "morbidity", "surgical audit", "postop", "icu"],
      guidance: "1. Based on the therapy required to correct the complication.\n2. Grade I: Any deviation without need for pharmacological treatment (except antiemetics, antipyretics, analgesics, diuretics, electrolytes) or surgical, endoscopic, or radiological interventions.\n3. Grade II: Pharmacological treatment with drugs other than Grade I (e.g., blood transfusions, TPN, antibiotics).\n4. Grade III: Requiring surgical, endoscopic, or radiological intervention (IIIa: without GA; IIIb: under GA).\n5. Grade IV: Life-threatening complication requiring ICU management (IVa: single organ dysfunction; IVb: multiorgan dysfunction).\n6. Grade V: Death of the patient.",
      contraindications: "Does not score intraoperative complications that are successfully resolved before conclusion of the index operation.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Classification of surgical complications: a new proposal with evaluation in a cohort of 6336 patients and results of a survey",
          citation: "Dindo D, Demartines N, Clavien PA. Ann Surg. 2004;240(2):205-213.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/15273542/" }
          ]
        }
      ],
      fields: [
        makeS("grade", "Select Highest Postoperative Complication Level", "I", [
          ["I", "Grade I: Minor deviation; bed-side care, electrolytes, antiemetics, analgesics only"],
          ["II", "Grade II: Requires pharmacological treatments, blood transfusions, or TPN"],
          ["IIIa", "Grade IIIa: Intervention required NOT under general anesthesia (local/sedation)"],
          ["IIIb", "Grade IIIb: Intervention required UNDER general anesthesia (re-operation)"],
          ["IVa", "Grade IVa: Life-threatening complication; Single organ dysfunction in ICU (e.g. dialysis)"],
          ["IVb", "Grade IVb: Life-threatening complication; Multi-organ dysfunction (MODS) in ICU"],
          ["V", "Grade V: Brain death or patient mortality"]
        ])
      ],
      table: {
        headers: ["Grade", "Definition", "Therapy Required", "Clinical Example"],
        rows: [
          { id: "gI", cols: ["Grade I", "Minor deviation from ideal postop course", "Antiemetics, antipyretics, wound opening at bedside", "Superficial wound opening, transient urinary retention"] },
          { id: "gII", cols: ["Grade II", "Complication requiring specific drug therapy", "Antibiotics, therapeutic anticoagulation, TPN, blood transfusion", "Surgical site infection needing IV abx, DVT, pneumonia"] },
          { id: "gIIIa", cols: ["Grade IIIa", "Intervention not requiring general anesthesia", "Percutaneous drainage, interventional radiology, endoscopy", "CT-guided drain of intra-abdominal abscess under local"] },
          { id: "gIIIb", cols: ["Grade IIIb", "Intervention requiring general anesthesia", "Re-laparotomy, operative repair, revision anastomosis", "Wound dehiscence reclosure, anastomotic leak re-exploration"] },
          { id: "gIVa", cols: ["Grade IVa", "Single organ failure requiring ICU support", "Hemodialysis, mechanical ventilation, inotropes", "Acute renal failure on CRRT, ARDS on ventilator"] },
          { id: "gIVb", cols: ["Grade IVb", "Multiorgan failure requiring ICU support", "Multi-system support in intensive care unit", "Septic shock with respiratory failure and acute tubular necrosis"] },
          { id: "gV", cols: ["Grade V", "Mortality", "Death of patient", "Postoperative mortality"] }
        ]
      },
      calc: function (v) {
        var g = v.grade;
        var match = "g" + g;
        var desc = "";
        if (g === "I") desc = "Minor deviation from regular course. Handled on ward without prescription systemic therapeutics.";
        else if (g === "II") desc = "Moderate complication. Requires specific pharmacological intervention (e.g., targeted antibiotics or blood transfusion).";
        else if (g === "IIIa" || g === "IIIb") desc = "Severe complication requiring surgical, endoscopic, or radiologic re-intervention.";
        else if (g === "IVa" || g === "IVb") desc = "Critical life-threatening organ failure requiring intensive care (ICU) admission.";
        else desc = "Grade V: Patient mortality. Required inclusion in institutional Morbidity & Mortality (M&M) audit.";

        return {
          value: "Clavien–Dindo Grade " + g,
          matchId: match,
          eq: "Classification Summary: " + desc
        };
      }
    },

    // ==============================================================
    // 3. TOKYO GUIDELINES (TG18) FOR ACUTE CHOLECYSTITIS
    // ==============================================================
    {
      id: "tokyoGuidelines",
      cat: "surgery",
      type: "class",
      name: "Tokyo Guidelines 2018 (TG18) Acute Cholecystitis",
      desc: "Diagnostic criteria and 3-tier severity grading for acute cholecystitis to determine timing of cholecystectomy vs percutaneous drainage.",
      organ: "Gallbladder / Biliary Tree",
      region: "Abdomen / Right Upper Quadrant",
      subject: "Hepatobiliary Surgery / Acute Care Surgery",
      keywords: ["tokyo", "tg18", "cholecystitis", "murphy", "gallbladder", "cholecystectomy", "percutaneous cholecystostomy"],
      guidance: "1. Diagnostic criteria: A (Local signs: Murphy sign, RUQ mass/pain) + B (Systemic signs: fever, elevated CRP/WBC) + C (Imaging: sonographic Murphy, wall thickening >4 mm, pericholecystic fluid).\n2. Definite diagnosis: 1 from A + 1 from B + 1 from C.\n3. Grade I (Mild): Healthy patient, mild gallbladder inflammation, safe for early laparoscopic cholecystectomy.\n4. Grade II (Moderate): Marked local inflammation (WBC >18,000, palpable tender RUQ mass, duration >72h, or gangrenous/emphysematous changes).\n5. Grade III (Severe): Associated with organ dysfunction (cardiovascular, neurological, respiratory, renal, hepatic, or hematologic).",
      contraindications: "Acalculous cholecystitis in critically ill ICU patients often presents without classic Murphy sign; rely on ultrasound/CT wall criteria.",
      literature: [
        {
          type: "Consensus Guidelines",
          icon: "📘",
          title: "Tokyo Guidelines 2018: diagnostic criteria and severity grading of acute cholecystitis",
          citation: "Yokoe M, Horiguchi J, Takada T, et al. J Hepatobiliary Pancreat Sci. 2018;25(1):41-54.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/29032636/" }
          ]
        }
      ],
      fields: [
        makeS("organFail", "1. Any Organ Dysfunction present? (Hypotension requiring vasopressors, GCS<15, PaO2/FiO2<300, Cr>2.0, INR>1.5, Plt<100k)", "0", [
          ["0", "No organ failure"],
          ["1", "Yes — Presence of cardiovascular, renal, respiratory, neuro, hepatic, or hematologic failure"]
        ]),
        makeS("localSevere", "2. Severe local signs? (WBC >18,000, palpable tender mass, complaints >72 hours, gangrenous / emphysematous / biliary peritonitis)", "0", [
          ["0", "No severe local inflammatory findings"],
          ["1", "Yes — Marked local inflammation (duration >72 hrs, WBC >18k, or gangrene)"]
        ])
      ],
      table: {
        headers: ["TG18 Severity Grade", "Inflammatory Spectrum", "Organ Status", "Surgical Action Plan"],
        rows: [
          { id: "g1", cols: ["Grade I (Mild)", "Confined to gallbladder; no organ failure", "Normal organ function", "Early laparoscopic cholecystectomy (within 72–96 hrs of onset)"] },
          { id: "g2", cols: ["Grade II (Moderate)", "Extensive local inflammation; high WBC/long duration", "No organ failure", "Urgent early laparoscopic cholecystectomy (if skilled laparoscopic surgeon); else percutaneous drainage"] },
          { id: "g3", cols: ["Grade III (Severe)", "Severe complicated cholecystitis", "Organ dysfunction present", "ICU resuscitation, urgent Percutaneous Transhepatic Gallbladder Drainage (PTGBD), delayed cholecystectomy"] }
        ]
      },
      calc: function (v) {
        var match = "g1", grade = "Grade I (Mild Acute Cholecystitis)";
        var action = "Safe for early laparoscopic cholecystectomy. First-line approach is urgent laparoscopic surgery within index hospital admission.";

        if (v.organFail === "1") {
          match = "g3";
          grade = "Grade III (Severe Acute Cholecystitis)";
          action = "Emergency ICU resuscitation. Treat organ dysfunction. Perform emergent Percutaneous Transhepatic Gallbladder Drainage (PTGBD). Delay definitive cholecystectomy until patient stabilizes.";
        } else if (v.localSevere === "1") {
          match = "g2";
          grade = "Grade II (Moderate Acute Cholecystitis)";
          action = "High technical difficulty for emergency laparoscopy. Perform early laparoscopic cholecystectomy by experienced laparoscopic surgeon, or elective drainage if surgical risk high.";
        }

        return {
          value: grade,
          matchId: match,
          eq: "Clinical Recommendation: " + action
        };
      }
    },

    // ==============================================================
    // 4. RANSON'S CRITERIA FOR ACUTE PANCREATITIS
    // ==============================================================
    {
      id: "ransonCriteria",
      cat: "surgery",
      type: "calc",
      name: "Ranson’s Criteria for Acute Pancreatitis",
      desc: "Scores 11 clinical and laboratory variables at admission and at 48 hours to predict pancreatitis severity and mortality.",
      organ: "Pancreas / Retroperitoneum",
      region: "Abdomen / Pancreatobiliary",
      subject: "General & HPB Surgery / Acute Pancreatitis",
      keywords: ["ranson", "pancreatitis", "acute abdomen", "amylase", "lipase", "mortality", "pancreas"],
      guidance: "1. Requires 2-stage assessment: 5 parameters at admission and 6 parameters at 48 hours.\n2. Non-gallstone criteria parameters:\n   - At admission: Age > 55, WBC > 16,000, Glucose > 200 mg/dL (11 mmol/L), AST > 250 IU/L, LDH > 350 IU/L.\n   - Within 48 hours: Hematocrit drop > 10%, BUN rise > 5 mg/dL, Calcium < 8.0 mg/dL, PaO2 < 60 mmHg, Base deficit > 4 mEq/L, Fluid sequestration > 6 L.\n3. Score 0–2: Mortality <1%; Score 3–4: ~15%; Score 5–6: ~40%; Score ≥7: >50%–100%.",
      contraindications: "Cannot be calculated completely until 48 hours from admission; for immediate triage within 24 hours, use BISAP score.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Prognostic signs and the role of operative intervention in acute pancreatitis",
          citation: "Ranson JH, Rifkind KM, Roses DF, et al. Surg Gynecol Obstet. 1974;139(1):69-81.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/4834279/" }
          ]
        }
      ],
      fields: [
        makeS("age", "1. Age > 55 years", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("wbc", "2. WBC > 16,000 /µL at admission", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("glucose", "3. Blood glucose > 200 mg/dL (>11.1 mmol/L)", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("ast", "4. Serum AST > 250 IU/L", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("ldh", "5. Serum LDH > 350 IU/L", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("hct", "6. Hematocrit fall > 10% within 48 hours", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("bun", "7. BUN increase > 5 mg/dL within 48 hours", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("calcium", "8. Serum Calcium < 8.0 mg/dL (<2.0 mmol/L)", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("pao2", "9. Arterial PaO2 < 60 mmHg", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("baseDeficit", "10. Base deficit > 4 mEq/L (HCO3- low)", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("fluidSeq", "11. Estimated fluid sequestration > 6 Liters", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]])
      ],
      table: {
        headers: ["Ranson Score", "Severity Classification", "Predicted Mortality Rate", "Clinical Disposition"],
        rows: [
          { id: "mild", cols: ["0 – 2 Points", "Mild Acute Pancreatitis", "< 1% – 3%", "General surgery floor, vigorous IV crystalloid hydration, early oral feeding"] },
          { id: "mod", cols: ["3 – 4 Points", "Moderate Pancreatitis", "15%", "Close step-down or intermediate care monitoring, repeat lab kinetics"] },
          { id: "severe", cols: ["5 – 6 Points", "Severe Pancreatitis", "40%", "ICU admission mandatory; contrast CT for necrotizing pancreatitis at 72h"] },
          { id: "critical", cols: ["≥ 7 Points", "Critical Necrotizing Pancreatitis", "> 50% – 100%", "ICU admission; aggressive fluid resuscitation; monitor for abdominal compartment syndrome"] }
        ]
      },
      calc: function (v) {
        var score = +v.age + +v.wbc + +v.glucose + +v.ast + +v.ldh + +v.hct + +v.bun + +v.calcium + +v.pao2 + +v.baseDeficit + +v.fluidSeq;
        var match = "mild", mort = "< 3%", status = "Mild Pancreatitis";

        if (score >= 7) {
          match = "critical";
          mort = "> 50% – 100%";
          status = "Critical Pancreatitis";
        } else if (score >= 5) {
          match = "severe";
          mort = "~ 40%";
          status = "Severe Pancreatitis";
        } else if (score >= 3) {
          match = "mod";
          mort = "~ 15%";
          status = "Moderately Severe Pancreatitis";
        }

        return {
          value: "Ranson Score: " + score + " / 11 (" + status + ")",
          matchId: match,
          eq: "Predicted Hospital Mortality: " + mort + ".\nRequires aggressive volume resuscitation with Lactated Ringer's solution."
        };
      }
    },

    // ==============================================================
    // 5. BISAP SCORE (BEDSIDE INDEX FOR SEVERITY IN ACUTE PANCREATITIS)
    // ==============================================================
    {
      id: "bisapScore",
      cat: "surgery",
      type: "calc",
      name: "BISAP Score for Acute Pancreatitis",
      desc: "Rapid early triage calculator calculated within the first 24 hours of hospital presentation.",
      organ: "Pancreas / Systemic",
      region: "Abdomen / Gastrointestinal",
      subject: "Acute Care Surgery / Pancreatitis",
      keywords: ["bisap", "pancreatitis", "bun", "sirs", "pleural effusion", "mortality"],
      guidance: "1. Evaluated within first 24 hours.\n2. Criteria (1 point each):\n   - B: BUN > 25 mg/dL (8.9 mmol/L)\n   - I: Impaired mental status (GCS < 15 or disorientation)\n   - S: SIRS criteria ≥ 2 (HR>90, RR>20 or PaCO2<32, Temp<36 or >38°C, WBC<4000 or >12000)\n   - A: Age > 60 years\n   - P: Pleural effusion present on imaging (CXR or CT)\n3. BISAP ≥ 3 signifies substantial risk of organ failure and mortality.",
      contraindications: "Does not differentiate between interstitial edematous and necrotizing pancreatitis on CT.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "A prospective evaluation of the bedside index for severity in acute pancreatitis score in assessing mortality and intermediate markers of severity in acute pancreatitis",
          citation: "Wu BU, Johannes RS, Sun X, et al. Am J Gastroenterol. 2008;103(11):2686-2691.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/18853974/" }
          ]
        }
      ],
      fields: [
        makeS("bun", "1. BUN > 25 mg/dL (> 8.9 mmol/L)", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("impaired", "2. Impaired mental status (GCS < 15 / encephalopathy)", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("sirs", "3. SIRS criteria present (≥ 2 of: Temp, HR>90, RR>20, WBC abnormal)", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("age", "4. Age > 60 years", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("pleural", "5. Pleural effusion on chest radiograph or CT", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]])
      ],
      table: {
        headers: ["BISAP Score", "Severity Stratum", "In-Hospital Mortality", "Recommended Care Level"],
        rows: [
          { id: "b0_1", cols: ["0 – 1 Points", "Low Risk", "< 1%", "General surgical ward; monitored fluid rehydration"] },
          { id: "b2", cols: ["2 Points", "Moderate Risk", "1.6% – 2%", "Step-down unit or telemetry monitoring"] },
          { id: "b3", cols: ["3 Points", "High Risk (Severe)", "5.3% – 8%", "Intensive Care Unit (ICU) admission; aggressive volume titration"] },
          { id: "b4_5", cols: ["4 – 5 Points", "Very High Risk (Critical)", "10% – 22%+", "ICU admission; continuous invasive hemodynamic monitoring; consult surgery/GI"] }
        ]
      },
      calc: function (v) {
        var score = +v.bun + +v.impaired + +v.sirs + +v.age + +v.pleural;
        var match = "b0_1", mort = "< 1%", status = "Low Risk";

        if (score >= 4) {
          match = "b4_5";
          mort = "10% – 22%+";
          status = "Critical Risk";
        } else if (score === 3) {
          match = "b3";
          mort = "5.3% – 8%";
          status = "High Risk";
        } else if (score === 2) {
          match = "b2";
          mort = "~ 1.6%";
          status = "Intermediate Risk";
        }

        return {
          value: "BISAP Score: " + score + " / 5 (" + status + ")",
          matchId: match,
          eq: "Mortality Risk: " + mort + ".\nCalculated within first 24 hours of admission."
        };
      }
    },

    // ==============================================================
    // 6. HINCHEY CLASSIFICATION (MODIFIED) FOR ACUTE DIVERTICULITIS
    // ==============================================================
    {
      id: "hincheyDiverticulitis",
      cat: "surgery",
      type: "class",
      name: "Modified Hinchey Classification for Acute Diverticulitis",
      desc: "CT-based anatomical classification of complicated diverticulitis to dictate conservative, percutaneous, or surgical intervention.",
      organ: "Sigmoid Colon / Pelvis / Peritoneum",
      region: "Abdomen / Colorectal",
      subject: "Colorectal Surgery / Acute Abdomen",
      keywords: ["hinchey", "diverticulitis", "sigmoid", "perforation", "abscess", "peritonitis", "hartmann"],
      guidance: "1. Based on contrast-enhanced abdominal/pelvic CT findings.\n2. Stage 0: Clinically mild diverticulitis (colonic wall thickening, fat stranding).\n3. Stage Ia: Pericolic phlegmon or localized pericolic inflammation without abscess.\n4. Stage Ib: Pericolic or mesenteric abscess (< 4 cm: antibiotics; ≥ 4 cm: percutaneous CT drain).\n5. Stage II: Pelvic, retroperitoneal, or distant intra-abdominal abscess.\n6. Stage III: Generalized purulent peritonitis (perforated diverticulum communicates with peritoneum).\n7. Stage IV: Generalized feculent peritonitis (large open perforation with free colonic fecal spilling).",
      contraindications: "Do not perform colonoscopy during the acute diverticulitis episode due to high risk of iatrogenic perforation (wait 6–8 weeks post-resolution).",
      literature: [
        {
          type: "Seminal & Modified Classification",
          icon: "📄",
          title: "Treatment of complicated diverticulitis: results of a prospective multicentre study",
          citation: "Wasvary H, Turfah F, Kadro O, et al. Am Surg. 1999;65(7):632-635.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/10399971/" }
          ]
        }
      ],
      fields: [
        makeS("stage", "CT Imaging & Operative Presentation", "Ia", [
          ["0", "Stage 0: Mild diverticulitis (colonic wall thickening & pericolic fat stranding)"],
          ["Ia", "Stage Ia: Pericolic phlegmon or localized inflammation, no abscess"],
          ["Ib", "Stage Ib: Pericolic or mesenteric confined abscess"],
          ["II", "Stage II: Distant intra-abdominal, pelvic, or retroperitoneal abscess"],
          ["III", "Stage III: Generalized purulent peritonitis (non-feculent cloudy peritoneal fluid)"],
          ["IV", "Stage IV: Generalized feculent peritonitis (gross free stool in peritoneal cavity)"]
        ]),
        makeS("abscessSize", "Abscess Size (if Stage Ib or II)", "none", [
          ["none", "No abscess / Not applicable"],
          ["small", "Abscess < 3 – 4 cm in diameter"],
          ["large", "Abscess ≥ 4 cm in diameter (accessible for percutaneous drain)"]
        ])
      ],
      table: {
        headers: ["Hinchey Stage", "CT Description", "Peritoneal Status", "Management Strategy"],
        rows: [
          { id: "s0", cols: ["Stage 0", "Wall thickening, mild stranding", "No contamination", "Outpatient/inpatient oral or IV antibiotics (or observational in mild)"] },
          { id: "sIa", cols: ["Stage Ia", "Confined pericolic phlegmon", "Local phlegmon", "Inpatient IV antibiotics, bowel rest, serial abdominal exams"] },
          { id: "sIb", cols: ["Stage Ib", "Confined pericolic abscess", "Localized abscess", "<4 cm: IV antibiotics; ≥4 cm: CT-guided percutaneous drainage"] },
          { id: "sII", cols: ["Stage II", "Distant pelvic/retroperitoneal abscess", "Pelvic/distant fluid collection", "Percutaneous CT-guided drainage + IV antibiotics; elective delayed resection"] },
          { id: "sIII", cols: ["Stage III", "Generalized purulent peritonitis", "Four-quadrant pus", "Emergency laparoscopy/laparotomy: Hartmann procedure or resection with primary anastomosis"] },
          { id: "sIV", cols: ["Stage IV", "Generalized feculent peritonitis", "Free enteric stool / peritonitis", "EMERGENCY RESECTION: Hartmann procedure (sigmoidectomy + end colostomy) + ICU resuscitation"] }
        ]
      },
      calc: function (v) {
        var s = v.stage;
        var match = "s" + s;
        var plan = "";

        if (s === "IV") {
          plan = "Stage IV Feculent Peritonitis: Surgical emergency! Immediate fluid resuscitation, broad-spectrum IV antibiotics, and urgent laparotomy for Hartmann procedure (sigmoid colectomy with end colostomy and rectal stump closure).";
        } else if (s === "III") {
          plan = "Stage III Purulent Peritonitis: Emergent surgical exploration. Sigmoid resection with primary anastomosis ± diverting loop ileostomy OR Hartmann procedure based on hemodynamic stability.";
        } else if (s === "II" || s === "Ib") {
          if (v.abscessSize === "large") {
            plan = "Abscess ≥ 4 cm: Percutaneous CT-guided drainage is the gold standard, along with IV antibiotic therapy. Colonoscopy at 6 weeks.";
          } else {
            plan = "Small abscess (< 4 cm): Initial trial of intravenous broad-spectrum antibiotics and bowel rest. If no clinical improvement in 48–72 hours, repeat CT for drainage.";
          }
        } else {
          plan = "Stage " + s + ": Conservative management with IV antibiotics and bowel rest. Follow up with outpatient colonoscopy in 6–8 weeks to rule out occult colorectal malignancy.";
        }

        return {
          value: "Modified Hinchey Stage " + s,
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 7. SURGICAL APGAR SCORE (SAS)
    // ==============================================================
    {
      id: "surgicalApgar",
      cat: "surgery",
      type: "calc",
      name: "Surgical Apgar Score (SAS)",
      desc: "10-point immediate postoperative score assessing intraoperative hemodynamics to predict 30-day major complication or death.",
      organ: "Cardiovascular / Systemic",
      region: "Operating Room / Intraoperative",
      subject: "General & Vascular Surgery / Operative Audit",
      keywords: ["apgar", "surgical apgar", "ebl", "map", "heart rate", "blood loss", "postoperative mortality"],
      guidance: "1. Calculated at the end of surgery from the anesthesia record using 3 objective intraoperative parameters:\n   - Estimated Blood Loss (EBL, mL)\n   - Lowest Mean Arterial Pressure (MAP, mmHg)\n   - Lowest Heart Rate (bpm)\n2. Score range 0 to 10 points.\n3. Score ≤ 4 indicates high risk of postop death and major complications (16-fold increase).",
      contraindications: "Does not incorporate pre-existing host chronic illnesses or the anatomical complexity of the specific surgical procedure.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "A surgical safety checklist to reduce morbidity and mortality in a global population",
          citation: "Gawande AA, Kwaan MR, Regenbogen SE, et al. J Am Coll Surg. 2007;204(2):201-208.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/17254923/" }
          ]
        }
      ],
      fields: [
        makeS("ebl", "1. Estimated Blood Loss (mL)", "0", [
          ["0", "> 1,000 mL (0 pts)"],
          ["1", "601 – 1,000 mL (+1 pt)"],
          ["2", "101 – 600 mL (+2 pts)"],
          ["3", "≤ 100 mL (+3 pts)"]
        ]),
        makeS("map", "2. Lowest Mean Arterial Pressure (MAP, mmHg)", "1", [
          ["0", "< 40 mmHg (0 pts)"],
          ["1", "40 – 54 mmHg (+1 pt)"],
          ["2", "55 – 69 mmHg (+2 pts)"],
          ["3", "≥ 70 mmHg (+3 pts)"]
        ]),
        makeS("hr", "3. Lowest Heart Rate (bpm) [pathologic bradycardia]", "1", [
          ["0", "> 85 bpm (or severe asystole) (0 pts)"],
          ["1", "76 – 85 bpm (+1 pt)"],
          ["2", "66 – 75 bpm (+2 pts)"],
          ["3", "56 – 65 bpm (+3 pts)"],
          ["4", "40 – 55 bpm (normal sinus stability) (+4 pts)"]
        ])
      ],
      table: {
        headers: ["Surgical Apgar Score", "Risk Category", "Major Complication Rate", "Relative Risk of Death"],
        rows: [
          { id: "highRisk", cols: ["0 – 4 Points", "High Risk", "> 30% – 50%", "Up to 16x baseline mortality; triage to ICU/HDU"] },
          { id: "modRisk", cols: ["5 – 6 Points", "Intermediate Risk", "15% – 20%", "Elevated risk; step-down care and close surgical surveillance"] },
          { id: "lowRisk", cols: ["7 – 8 Points", "Average / Low Risk", "5% – 8%", "Routine post-surgical floor care"] },
          { id: "excellent", cols: ["9 – 10 Points", "Minimal Risk", "< 3%", "Optimal intraoperative stability; rapid standard recovery"] }
        ]
      },
      calc: function (v) {
        var total = +v.ebl + +v.map + +v.hr;
        var match = "lowRisk", risk = "Low Risk", note = "Routine postoperative ward care.";

        if (total <= 4) {
          match = "highRisk";
          risk = "High Risk (Critical)";
          note = "High risk of 30-day major complication or death. Recommend planned admission to ICU or High Dependency Unit (HDU).";
        } else if (total <= 6) {
          match = "modRisk";
          risk = "Moderate Risk";
          note = "Increased complication risk. Maintain continuous monitoring, check postop hematocrit and renal function.";
        } else if (total >= 9) {
          match = "excellent";
          risk = "Minimal Risk";
          note = "Excellent intraoperative hemodynamic stability.";
        }

        return {
          value: "Surgical Apgar Score: " + total + " / 10 (" + risk + ")",
          matchId: match,
          eq: "Components: EBL (" + v.ebl + " pts) + Lowest MAP (" + v.map + " pts) + Lowest HR (" + v.hr + " pts) = " + total + ".\n" + note
        };
      }
    },

    // ==============================================================
    // 8. CHILD-PUGH SCORE FOR CIRRHOSIS OPERATIVE RISK
    // ==============================================================
    {
      id: "childPughSurgery",
      cat: "surgery",
      type: "class",
      name: "Child–Pugh Score for Liver Surgical Risk",
      desc: "Grades severity of liver cirrhosis to estimate perioperative mortality before abdominal surgery.",
      organ: "Liver / Portal System",
      region: "Abdomen / Hepatobiliary",
      subject: "Hepatobiliary & General Surgery / Cirrhosis",
      keywords: ["child", "pugh", "turcotte", "cirrhosis", "bilirubin", "albumin", "ascites", "encephalopathy", "inr"],
      guidance: "1. 5 parameters: Total Bilirubin, Serum Albumin, INR / Prothrombin time, Ascites, Hepatic Encephalopathy.\n2. In cholestatic diseases (PBC/PSC), bilirubin cutoffs change (1–4, 4–10, >10 mg/dL).\n3. Child-Pugh A (5–6 pts): Abdominal surgery well tolerated (perioperative mortality ~10%).\n4. Child-Pugh B (7–9 pts): Intermediate risk (~30% mortality); medically optimize first.\n5. Child-Pugh C (10–15 pts): Extremely high mortality (up to 70%–80%); elective abdominal surgery is contraindicated.",
      contraindications: "Subjective grading of ascites and encephalopathy introduces interobserver variability; calculate alongside MELD-Na.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Surgery in patients with cirrhosis",
          citation: "Pugh RN, Murray-Lyon IM, Dawson JL, et al. Br J Surg. 1973;60(8):646-649.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/4541913/" }
          ]
        }
      ],
      fields: [
        makeS("bili", "1. Total Bilirubin (mg/dL)", "1", [
          ["1", "< 2.0 mg/dL (< 34 µmol/L) (1 pt)"],
          ["2", "2.0 – 3.0 mg/dL (34 – 51 µmol/L) (2 pts)"],
          ["3", "> 3.0 mg/dL (> 51 µmol/L) (3 pts)"]
        ]),
        makeS("alb", "2. Serum Albumin (g/dL)", "1", [
          ["1", "> 3.5 g/dL (> 35 g/L) (1 pt)"],
          ["2", "2.8 – 3.5 g/dL (28 – 35 g/L) (2 pts)"],
          ["3", "< 2.8 g/dL (< 28 g/L) (3 pts)"]
        ]),
        makeS("inr", "3. INR (Prothrombin time prolongation)", "1", [
          ["1", "INR < 1.7 (< 4 sec prolonged) (1 pt)"],
          ["2", "INR 1.7 – 2.3 (4 – 6 sec prolonged) (2 pts)"],
          ["3", "INR > 2.3 (> 6 sec prolonged) (3 pts)"]
        ]),
        makeS("ascites", "4. Ascites presentation", "1", [
          ["1", "None (1 pt)"],
          ["2", "Slight / Mild (easily controlled on diuretics) (2 pts)"],
          ["3", "Moderate / Severe / Refractory (3 pts)"]
        ]),
        makeS("enceph", "5. Hepatic Encephalopathy", "1", [
          ["1", "None (Grade 0) (1 pt)"],
          ["2", "Grade 1 – 2 (mild confusion, asterixis) (2 pts)"],
          ["3", "Grade 3 – 4 (somnolence, stupor, coma) (3 pts)"]
        ])
      ],
      table: {
        headers: ["Child Class", "Points", "1-Year Survival", "Abdominal Surgery Mortality"],
        rows: [
          { id: "classA", cols: ["Class A", "5 – 6 Points", "100%", "Low risk (~ 10% perioperative mortality); elective surgery safe"] },
          { id: "classB", cols: ["Class B", "7 – 9 Points", "80%", "Moderate risk (~ 30% mortality); medical optimization prior to resection"] },
          { id: "classC", cols: ["Class C", "10 – 15 Points", "45%", "Severe risk (50% – 80% mortality); elective abdominal surgery CONTRAINDICATED"] }
        ]
      },
      calc: function (v) {
        var score = +v.bili + +v.alb + +v.inr + +v.ascites + +v.enceph;
        var match = "classA", cls = "Class A", mort = "~ 10%";

        if (score >= 10) {
          match = "classC";
          cls = "Class C";
          mort = "50% – 80%";
        } else if (score >= 7) {
          match = "classB";
          cls = "Class B";
          mort = "~ 30%";
        }

        var advice = (cls === "Class C")
          ? "Elective abdominal surgery is strictly contraindicated. Consider liver transplant evaluation or non-operative management."
          : (cls === "Class B")
          ? "High perioperative risk. Preoperatively correct coagulopathy, drain tense ascites, and optimize nutritional status."
          : "Well-compensated cirrhosis. Patient generally tolerates hepatic or gastrointestinal resection with standard precautions.";

        return {
          value: "Child–Pugh " + cls + " (" + score + " Points)",
          matchId: match,
          eq: "Estimated Abdominal Surgery Perioperative Mortality: " + mort + ".\n" + advice
        };
      }
    },

    // ==============================================================
    // 9. CDC SURGICAL WOUND CLASSIFICATION
    // ==============================================================
    {
      id: "surgicalWoundClass",
      cat: "surgery",
      type: "class",
      name: "CDC Surgical Wound Classification",
      desc: "Classifies operative wounds by intrinsic contamination to predict surgical site infection (SSI) risk.",
      organ: "Skin / Soft Tissue / Operative Field",
      region: "Operating Room / Infection Control",
      subject: "General Surgery / Infection Prevention",
      keywords: ["wound", "cdc", "surgical site infection", "ssi", "clean", "contaminated", "dirty"],
      guidance: "1. Class I (Clean): Uninfected operative wound; no inflammation encountered; respiratory, alimentary, genital, or uninfected urinary tracts are NOT entered.\n2. Class II (Clean-Contaminated): Operative wound in which respiratory, alimentary, genital, or uninfected urinary tracts are entered under controlled conditions and without unusual contamination (e.g. elective cholecystectomy, appendectomy, colectomy with prep).\n3. Class III (Contaminated): Open, fresh, accidental wounds, or operations with major breaks in sterile technique, or gross spillage from GI tract.\n4. Class IV (Dirty-Infected): Old traumatic wounds with retained devitalized tissue or wounds involving existing clinical infection or perforated viscera.",
      contraindications: "Re-evaluate at completion of surgery if intraoperative events (e.g. unexpected viscous perforation or bowel spillage) occurred.",
      literature: [
        {
          type: "CDC Guideline",
          icon: "📘",
          title: "CDC Guideline for the Prevention of Surgical Site Infection",
          citation: "Berríos-Torres SI, Umscheid CA, Bratzler DW, et al. JAMA Surg. 2017;152(8):784-791.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/28467526/" }
          ]
        }
      ],
      fields: [
        makeS("wound", "Select Operative Wound Context", "I", [
          ["I", "Class I (Clean): No entry into GI, respiratory, genital, or urinary tract; no inflammation"],
          ["II", "Class II (Clean-Contaminated): Controlled entry into GI, biliary, respiratory, or urinary tract"],
          ["III", "Class III (Contaminated): Gross GI spillage, acute non-purulent inflammation, open accidental trauma <4h"],
          ["IV", "Class IV (Dirty / Infected): Perforated viscus, purulent pus, fecal soilage, devitalized tissue >4h"]
        ])
      ],
      table: {
        headers: ["Wound Class", "Contamination Level", "Baseline SSI Risk", "Antibiotic Prophylaxis Strategy"],
        rows: [
          { id: "wI", cols: ["Class I: Clean", "Uninfected, non-traumatic, closed primary", "1% – 3%", "Generally not required unless prosthetic implant or hernia mesh inserted"] },
          { id: "wII", cols: ["Class II: Clean-Contam", "Controlled viscous entry; minimal spill", "3% – 8%", "Single prophylactic IV pre-incision dose (e.g., Cefazolin ± Metronidazole)"] },
          { id: "wIII", cols: ["Class III: Contaminated", "Gross enteric spill, acute inflammation", "10% – 15%", "Prophylactic or therapeutic regimen; consider delayed primary skin closure"] },
          { id: "wIV", cols: ["Class IV: Dirty-Infected", "Active infection, pus, stool, devitalized tissue", "> 25% – 40%", "Full therapeutic antibiotic course; leave skin/subcutaneous tissue open for secondary closure"] }
        ]
      },
      calc: function (v) {
        var w = v.wound;
        var match = "w" + w;
        var risk = w === "I" ? "1–3%" : w === "II" ? "3–8%" : w === "III" ? "10–15%" : ">25–40%";
        var advice = (w === "IV")
          ? "Class IV (Dirty): Leave superficial wound open (pack or negative pressure wound therapy) to prevent deep wound dehiscence and fascial dehiscence. Therapeutic antibiotics required."
          : (w === "III")
          ? "Class III (Contaminated): High infection risk. Copious irrigation and consider delayed primary closure."
          : (w === "II")
          ? "Class II (Clean-Contaminated): Standard pre-incision prophylactic antibiotics within 60 minutes of skin cut."
          : "Class I (Clean): Prophylaxis indicated only when prosthetic material (mesh, vascular graft) is implanted.";

        return {
          value: "CDC Wound " + (w === "I" ? "Class I (Clean)" : w === "II" ? "Class II (Clean-Contaminated)" : w === "III" ? "Class III (Contaminated)" : "Class IV (Dirty-Infected)") + " [SSI Risk: " + risk + "]",
          matchId: match,
          eq: "Infection Control Action: " + advice
        };
      }
    },

    // ==============================================================
    // 10. REVISED CARDIAC RISK INDEX (RCRI / LEE CRITERIA)
    // ==============================================================
    {
      id: "rcriSurgery",
      cat: "surgery",
      type: "calc",
      name: "Revised Cardiac Risk Index (RCRI / Lee Criteria)",
      desc: "Predicts perioperative major adverse cardiac events (MACE) in non-cardiac surgical candidates.",
      organ: "Heart / Cardiovascular",
      region: "Cardiothoracic / Preoperative",
      subject: "Preoperative Assessment / Surgical Safety",
      keywords: ["rcri", "lee", "cardiac risk", "mace", "myocardial infarction", "preop", "cardiology"],
      guidance: "1. 6 independent predictors (1 point each):\n   - High-risk surgery (intraperitoneal, intrathoracic, or suprainguinal vascular)\n   - History of ischemic heart disease\n   - History of congestive heart failure\n   - History of cerebrovascular disease (stroke or TIA)\n   - Insulin therapy for diabetes\n   - Preoperative serum creatinine > 2.0 mg/dL (177 µmol/L)\n2. Class I (0 pts): 0.4% MACE; Class II (1 pt): 0.9%; Class III (2 pts): 6.6%; Class IV (≥3 pts): >11%.",
      contraindications: "Does not apply to cardiac surgery. Correlate with functional capacity measured in Metabolic Equivalents (METs).",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Derivation and prospective validation of a simple index for prediction of cardiac risk of major noncardiac surgery",
          citation: "Lee TH, Marcantonio ER, Mangione CM, et al. Circulation. 1999;100(10):1043-1049.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/10477528/" }
          ]
        }
      ],
      fields: [
        makeS("highRisk", "1. High-risk surgery (Intraperitoneal, intrathoracic, or suprainguinal vascular)", "1", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("ihd", "2. History of ischemic heart disease (MI, positive stress test, angina, nitrate use, pathological Q-waves)", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("chf", "3. History of congestive heart failure (pulmonary edema, orthopnea, S3 gallop, PND)", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("stroke", "4. History of cerebrovascular disease (prior stroke or TIA)", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("insulin", "5. Preoperative insulin therapy for diabetes mellitus", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("cr", "6. Preoperative serum creatinine > 2.0 mg/dL (> 177 µmol/L)", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]])
      ],
      table: {
        headers: ["RCRI Class", "Points", "MACE Risk (Cardiac Death, Arrest, MI)", "Preoperative Recommendation"],
        rows: [
          { id: "cI", cols: ["Class I", "0 Points", "0.4%", "Proceed directly to planned surgery; no advanced cardiac testing required"] },
          { id: "cII", cols: ["Class II", "1 Point", "0.9%", "Proceed to surgery; ensure perioperative beta-blocker/statin continuation"] },
          { id: "cIII", cols: ["Class III", "2 Points", "6.6%", "Assess functional capacity (METs); cardiology consultation if poor (<4 METs)"] },
          { id: "cIV", cols: ["Class IV", "≥ 3 Points", "> 11%", "High risk! Formal preoperative cardiology clearance; consider stress imaging / echo"] }
        ]
      },
      calc: function (v) {
        var score = +v.highRisk + +v.ihd + +v.chf + +v.stroke + +v.insulin + +v.cr;
        var match = "cI", cls = "Class I", risk = "0.4%";

        if (score >= 3) {
          match = "cIV";
          cls = "Class IV";
          risk = "> 11.0%";
        } else if (score === 2) {
          match = "cIII";
          cls = "Class III";
          risk = "6.6%";
        } else if (score === 1) {
          match = "cII";
          cls = "Class II";
          risk = "0.9%";
        }

        return {
          value: "RCRI " + cls + " (" + score + " Points)",
          matchId: match,
          eq: "Estimated 30-Day Risk of Major Cardiac Event (MACE): " + risk + ".\n" + (score >= 2 ? "Patient has elevated cardiac risk. Check functional capacity and obtain 12-lead ECG." : "Low cardiac complication risk.")
        };
      }
    },

    // ==============================================================
    // 11. CAPRINI SCORE FOR SURGICAL VENOUS THROMBOEMBOLISM (VTE)
    // ==============================================================
    {
      id: "capriniVte",
      cat: "surgery",
      type: "calc",
      name: "Caprini Score for Venous Thromboembolism (VTE) Risk",
      desc: "Individualized risk assessment score for postoperative deep vein thrombosis (DVT) and pulmonary embolism (PE).",
      organ: "Venous Vasculature / Coagulation",
      region: "Perioperative / Hematologic",
      subject: "General Surgery / Thromboprophylaxis",
      keywords: ["caprini", "vte", "dvt", "pe", "thrombosis", "heparin", "enoxaparin", "prophylaxis"],
      guidance: "1. Sums multi-weighted clinical factors (1, 2, 3, or 5 points):\n   - 1 pt: Age 41–60, minor surgery, BMI >25, swollen legs, varicose veins.\n   - 2 pts: Age 61–74, major surgery (>45 min), arthroscopic surgery, central line, malignancy.\n   - 3 pts: Age ≥75, history of DVT/PE, family history of thrombosis, positive factor V Leiden or antiphospholipid.\n   - 5 pts: Stroke within 1 month, elective arthroplasty, hip/pelvis/leg fracture, acute spinal cord injury.\n2. Risk tiers: Very low (0), Low (1–2), Moderate (3–4), High (≥5).",
      contraindications: "Active hemorrhage or intracranial bleeding requires mechanical prophylaxis (intermittent pneumatic compression) rather than pharmacological anticoagulation.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Venous thromboembolism: a public health concern",
          citation: "Caprini JA. Dis Mon. 2005;51(2-3):70-82.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/15900257/" }
          ]
        }
      ],
      fields: [
        makeS("age", "1. Patient Age Bracket", "0", [
          ["0", "Age ≤ 40 years (0 pts)"],
          ["1", "Age 41 – 60 years (+1 pt)"],
          ["2", "Age 61 – 74 years (+2 pts)"],
          ["3", "Age ≥ 75 years (+3 pts)"]
        ]),
        makeS("surgeryType", "2. Planned Surgical Procedure", "1", [
          ["0", "Minor procedure / ambulatory (< 45 min) (0 pts)"],
          ["1", "Minor surgery with risk factors (+1 pt)"],
          ["2", "Major open surgery (> 45 min) or laparoscopic > 45 min (+2 pts)"]
        ]),
        makeS("malignancy", "3. Active Cancer / Malignancy (present or previous)", "0", [
          ["0", "No active malignancy (0 pts)"],
          ["2", "Yes — Malignancy (+2 pts)"]
        ]),
        makeS("priorVte", "4. Past History of DVT / Pulmonary Embolism", "0", [
          ["0", "No prior VTE (0 pts)"],
          ["3", "Yes — Documented prior DVT or PE (+3 pts)"]
        ]),
        makeS("highRiskMobility", "5. Severe Factors (Elective arthroplasty, pelvic fracture, acute stroke <1 mo)", "0", [
          ["0", "None (0 pts)"],
          ["5", "Yes — Major orthopedic trauma / acute spinal cord paralysis / stroke (+5 pts)"]
        ])
      ],
      table: {
        headers: ["Caprini Score", "Risk Level", "Baseline DVT Risk", "ACCP Guideline Recommendation"],
        rows: [
          { id: "vLow", cols: ["0 Points", "Very Low Risk", "< 0.5%", "Early, frequent ambulation only; no pharmacological prophylaxis required"] },
          { id: "low", cols: ["1 – 2 Points", "Low Risk", "~ 1.5%", "Mechanical prophylaxis: Intermittent Pneumatic Compression (IPC) devices"] },
          { id: "mod", cols: ["3 – 4 Points", "Moderate Risk", "~ 3.0%", "Pharmacologic prophylaxis (LMWH e.g. Enoxaparin 40 mg SC daily) OR IPC"] },
          { id: "high", cols: ["≥ 5 Points", "High / Very High", "> 6.0% – 10%+", "Dual prophylaxis: LMWH + IPC. Extend LMWH to 28 days for oncologic abdominal surgery"] }
        ]
      },
      calc: function (v) {
        var score = +v.age + +v.surgeryType + +v.malignancy + +v.priorVte + +v.highRiskMobility;
        var match = "vLow", risk = "Very Low Risk", rx = "Early ambulation.";

        if (score >= 5) {
          match = "high";
          risk = "High / Highest Risk (Score ≥ 5)";
          rx = "Combined Dual Prophylaxis: Low-Molecular-Weight Heparin (LMWH) + Intermittent Pneumatic Compression (IPC). For abdominal-pelvic cancer resection, extend LMWH for 4 weeks post-discharge.";
        } else if (score >= 3) {
          match = "mod";
          risk = "Moderate Risk (Score 3–4)";
          rx = "Pharmacologic prophylaxis with LMWH or Fondaparinux, OR mechanical IPC devices.";
        } else if (score >= 1) {
          match = "low";
          risk = "Low Risk (Score 1–2)";
          rx = "Mechanical prophylaxis with IPC sleeves.";
        }

        return {
          value: "Caprini Score: " + score + " Points (" + risk + ")",
          matchId: match,
          eq: "Clinical Recommendation: " + rx
        };
      }
    },

    // ==============================================================
    // 12. COLORECTAL CANCER TNM STAGING (AJCC 8TH EDITION)
    // ==============================================================
    {
      id: "tnmColorectal",
      cat: "surgery",
      type: "class",
      name: "Colorectal Cancer TNM Staging (AJCC 8th Edition)",
      desc: "Definitive pathological anatomical staging for colon and rectal carcinomas.",
      organ: "Colon / Rectum",
      region: "Abdomen / Gastrointestinal Oncology",
      subject: "Surgical Oncology / Colorectal Surgery",
      keywords: ["tnm", "ajcc", "colon cancer", "rectal cancer", "submucosa", "muscularis propria", "peritoneal", "lymph nodes"],
      guidance: "1. T (Tumor): Tis (mucosa), T1 (submucosa), T2 (muscularis propria), T3 (subserosa/pericolic fat), T4a (penetrates visceral peritoneum), T4b (direct organ invasion).\n2. N (Nodes): N0 (0 nodes), N1a (1 node), N1b (2–3 nodes), N1c (tumor deposits), N2a (4–6 nodes), N2b (≥7 nodes).\n3. M (Metastasis): M0 (none), M1a (1 site without peritoneal), M1b (≥2 sites), M1c (peritoneal metastasis).\n4. Staging dictates adjuvant chemotherapy (FOLFOX/CAPOX in Stage III and high-risk Stage II).",
      contraindications: "Pathological evaluation requires harvesting of at least 12 regional lymph nodes for accurate N0 classification.",
      literature: [
        {
          type: "Official AJCC Staging System",
          icon: "📘",
          title: "AJCC Cancer Staging Manual, 8th Edition: Colorectum",
          citation: "Amin MB, Edge SB, Greene FL, et al., eds. Springer; 2017.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/28094930/" }
          ]
        }
      ],
      fields: [
        makeS("t", "Primary Tumor Depth of Invasion (T)", "T1", [
          ["Tis", "Tis: Carcinoma in situ (intramucosal)"],
          ["T1", "T1: Invades submucosa"],
          ["T2", "T2: Invades muscularis propria"],
          ["T3", "T3: Invades through muscularis propria into subserosa / pericolic tissue"],
          ["T4a", "T4a: Penetrates visceral peritoneum (surface serosa)"],
          ["T4b", "T4b: Directly invades other adjacent organs or structures"]
        ]),
        makeS("n", "Regional Lymph Nodes (N)", "N0", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1a", "N1a: Metastasis in 1 regional lymph node"],
          ["N1b", "N1b: Metastasis in 2 – 3 regional lymph nodes"],
          ["N1c", "N1c: Tumor deposit(s) in subserosa/mesentery without regional nodal metastasis"],
          ["N2a", "N2a: Metastasis in 4 – 6 regional lymph nodes"],
          ["N2b", "N2b: Metastasis in 7 or more regional lymph nodes"]
        ]),
        makeS("m", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1a", "M1a: Metastasis to 1 site/organ (e.g. solitary liver/lung nodule)"],
          ["M1b", "M1b: Metastasis to 2 or more sites/organs without peritoneal spread"],
          ["M1c", "M1c: Metastasis to peritoneal surface ± other organs"]
        ])
      ],
      table: {
        headers: ["AJCC Stage", "T Category", "N Category", "M Category", "Standard Oncologic Pathway"],
        rows: [
          { id: "stg0", cols: ["Stage 0", "Tis", "N0", "M0", "Complete endoscopic resection or local excision"] },
          { id: "stgI", cols: ["Stage I", "T1 – T2", "N0", "M0", "Surgical resection (colectomy) alone; no adjuvant chemotherapy"] },
          { id: "stgIIA", cols: ["Stage IIA", "T3", "N0", "M0", "Colectomy; evaluate high-risk features for consideration of fluoropyrimidine"] },
          { id: "stgIIB", cols: ["Stage IIB", "T4a", "N0", "M0", "Colectomy; adjuvant chemotherapy indicated for T4 status"] },
          { id: "stgIIC", cols: ["Stage IIC", "T4b", "N0", "M0", "En bloc multivisceral resection + adjuvant chemotherapy"] },
          { id: "stgIII", cols: ["Stage III", "Any T", "N1 – N2", "M0", "Surgical resection + 3–6 months adjuvant FOLFOX or CAPOX"] },
          { id: "stgIV", cols: ["Stage IV", "Any T", "Any N", "M1", "Systemic chemotherapy; evaluate oligometastatic liver/lung resection or HIPEC"] }
        ]
      },
      calc: function (v) {
        var t = v.t, n = v.n, m = v.m;
        var stg = "Stage I", match = "stgI";

        if (m.indexOf("M1") === 0) {
          stg = "Stage IV (" + m + ")";
          match = "stgIV";
        } else if (n !== "N0") {
          stg = "Stage III (" + t + " " + n + " M0)";
          match = "stgIII";
        } else {
          if (t === "Tis") {
            stg = "Stage 0"; match = "stg0";
          } else if (t === "T1" || t === "T2") {
            stg = "Stage I"; match = "stgI";
          } else if (t === "T3") {
            stg = "Stage IIA"; match = "stgIIA";
          } else if (t === "T4a") {
            stg = "Stage IIB"; match = "stgIIB";
          } else if (t === "T4b") {
            stg = "Stage IIC"; match = "stgIIC";
          }
        }

        var chem = (stg.indexOf("Stage III") >= 0)
          ? "Standard indication for 3 to 6 months of oxaliplatin-based adjuvant chemotherapy (FOLFOX or CAPOX)."
          : (stg.indexOf("Stage IV") >= 0)
          ? "Multidisciplinary tumor board assessment: evaluate liver-directed surgery vs systemic targeted therapy."
          : (stg.indexOf("Stage II") >= 0)
          ? "Discuss adjuvant therapy based on MMR/MSI status and high-risk features (T4, bowel obstruction, perforation, <12 nodes harvested)."
          : "Surgical cure achieved. Surveillance colonoscopy at 1 year.";

        return {
          value: "Colorectal AJCC: " + stg + " [" + t + " " + n + " " + m + "]",
          matchId: match,
          eq: chem
        };
      }
    },

    // ==============================================================
    // 13. BREAST CANCER TNM STAGING (AJCC 8TH EDITION)
    // ==============================================================
    {
      id: "tnmBreast",
      cat: "surgery",
      type: "class",
      name: "Breast Cancer Anatomical TNM Staging",
      desc: "AJCC 8th edition anatomical stage grouping based on tumor diameter, nodal metastasis, and distant spread.",
      organ: "Breast / Axilla",
      region: "Chest / Breast Oncology",
      subject: "Surgical Oncology / Breast Surgery",
      keywords: ["breast cancer", "tnm", "ajcc", "mastectomy", "lumpectomy", "sentinel node", "axilla"],
      guidance: "1. T: T1 (≤2 cm; T1mi ≤0.1cm, T1a 0.1–0.5cm, T1b 0.5–1cm, T1c 1–2cm), T2 (>2 to 5 cm), T3 (>5 cm), T4 (chest wall/skin invasion, peau d'orange, inflammatory).\n2. N: N0 (no regional nodes), N1 (1–3 axillary nodes), N2 (4–9 axillary nodes), N3 (≥10 axillary nodes or supraclavicular/internal mammary).\n3. M: M0 (none) vs M1 (distant metastasis).\n4. Prognostic Stage incorporates ER, PR, HER2 receptor status and histological grade.",
      contraindications: "Does not replace the AJCC Clinical and Pathological Prognostic Stage Groups which incorporate biological biomarkers (ER/PR/HER2/Grade).",
      literature: [
        {
          type: "Official AJCC Manual",
          icon: "📘",
          title: "AJCC Cancer Staging Manual, 8th Edition: Breast",
          citation: "Giuliano AE, Connolly JL, Edge SB, et al. Springer; 2017.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/28236249/" }
          ]
        }
      ],
      fields: [
        makeS("t", "Primary Tumor Size & Extension (T)", "T1c", [
          ["Tis", "Tis: Ductal carcinoma in situ (DCIS) / Paget's without invasive tumor"],
          ["T1mi", "T1mi: Microinvasion ≤ 0.1 cm (1 mm)"],
          ["T1a", "T1a: > 0.1 cm to ≤ 0.5 cm"],
          ["T1b", "T1b: > 0.5 cm to ≤ 1.0 cm"],
          ["T1c", "T1c: > 1.0 cm to ≤ 2.0 cm"],
          ["T2", "T2: > 2.0 cm to ≤ 5.0 cm"],
          ["T3", "T3: > 5.0 cm in greatest dimension"],
          ["T4", "T4: Direct extension to chest wall, skin ulceration, satellite nodules, or inflammatory"]
        ]),
        makeS("n", "Axillary & Regional Lymph Nodes (N)", "N0", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1", "N1: Metastases in 1 – 3 axillary lymph nodes"],
          ["N2", "N2: Metastases in 4 – 9 axillary lymph nodes"],
          ["N3", "N3: Metastases in ≥ 10 axillary nodes, infraclavicular, or supraclavicular nodes"]
        ]),
        makeS("m", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No clinical/radiographic evidence of distant metastases"],
          ["M1", "M1: Distant metastasis present (bone, lung, liver, brain)"]
        ])
      ],
      table: {
        headers: ["Anatomical Stage", "T Category", "N Category", "M Category", "Surgical Treatment Paradigm"],
        rows: [
          { id: "bStg0", cols: ["Stage 0", "Tis", "N0", "M0", "Breast conserving surgery (lumpectomy) + radiotherapy, or mastectomy"] },
          { id: "bStgI", cols: ["Stage IA / IB", "T1", "N0 / N1mi", "M0", "Breast conservation with Sentinel Lymph Node Biopsy (SLNB) ± adjuvant therapy"] },
          { id: "bStgIIA", cols: ["Stage IIA", "T0–1 N1 OR T2 N0", "N0 – N1", "M0", "Upfront lumpectomy + SLNB or neoadjuvant chemotherapy"] },
          { id: "bStgIIB", cols: ["Stage IIB", "T2 N1 OR T3 N0", "N0 – N1", "M0", "Consider neoadjuvant therapy to downstage tumor prior to conservation"] },
          { id: "bStgIII", cols: ["Stage IIIA–IIIC", "T3–4, or N2–3", "N2 – N3 / T4", "M0", "Neoadjuvant systemic chemotherapy followed by mastectomy / axillary node dissection"] },
          { id: "bStgIV", cols: ["Stage IV", "Any T", "Any N", "M1", "Palliative systemic therapy (endocrine, anti-HER2, immunotherapy, chemo)"] }
        ]
      },
      calc: function (v) {
        var t = v.t, n = v.n, m = v.m;
        var stg = "Stage IA", match = "bStgI";

        if (m === "M1") {
          stg = "Stage IV"; match = "bStgIV";
        } else if (n === "N3" || t === "T4" || (t === "T3" && n !== "N0") || n === "N2") {
          stg = "Stage III (Locally Advanced)"; match = "bStgIII";
        } else if (t === "Tis" && n === "N0") {
          stg = "Stage 0 (In Situ)"; match = "bStg0";
        } else if (t === "T2" && n === "N1") {
          stg = "Stage IIB"; match = "bStgIIB";
        } else if (t === "T3" && n === "N0") {
          stg = "Stage IIB"; match = "bStgIIB";
        } else if (n === "N1" || (t === "T2" && n === "N0")) {
          stg = "Stage IIA"; match = "bStgIIA";
        } else {
          stg = "Stage IA"; match = "bStgI";
        }

        return {
          value: "Breast AJCC: " + stg + " [" + t + " " + n + " " + m + "]",
          matchId: match,
          eq: "Multidisciplinary Care: Cross-reference with receptor biology (ER, PR, HER2) to determine endocrine and targeted biologic regimen."
        };
      }
    },

    // ==============================================================
    // 14. PERITONEAL CANCER INDEX (PCI - SUGARBAKER)
    // ==============================================================
    {
      id: "pciCalculator",
      cat: "surgery",
      type: "calc",
      name: "Peritoneal Cancer Index (PCI - Sugarbaker)",
      desc: "Scores peritoneal carcinomatosis burden across 13 abdominopelvic regions to determine resectability for cytoreductive surgery (CRS) and HIPEC.",
      organ: "Peritoneum / Omentum / Mesentery",
      region: "Abdomen / Peritoneal Cavity",
      subject: "Surgical Oncology / Hyperthermic Intraperitoneal Chemotherapy",
      keywords: ["pci", "sugarbaker", "carcinomatosis", "hipec", "cytoreduction", "peritoneum", "colorectal"],
      guidance: "1. Abdomen divided into 13 distinct regions (0 Central, 1 Right upper, 2 Epigastrium, 3 Left upper, 4 Left flank, 5 Left lower, 6 Pelvis, 7 Right lower, 8 Right flank, 9 Upper jejunum, 10 Lower jejunum, 11 Upper ileum, 12 Lower ileum).\n2. Lesion Size Score in each region: 0 (No macroscopic disease), 1 (Nodules <0.5 cm), 2 (Nodules 0.5–5.0 cm), 3 (Nodules >5 cm or confluent plaque).\n3. Maximum PCI score = 39.\n4. In colorectal cancer, PCI > 20 generally precludes complete cytoreduction with HIPEC.",
      contraindications: "Extensive small bowel serosal involvement or mesenteric retraction precludes complete cytoreductive resection regardless of total PCI.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Cytoreductive surgery and intraperitoneal chemotherapy for colorectal peritoneal carcinomatosis",
          citation: "Sugarbaker PH. Ann Surg Oncol. 2007;14(8):2178-2180.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/17505856/" }
          ]
        }
      ],
      fields: [
        makeS("r0", "Region 0 (Umbilical / Greater Omentum)", "1", [["0", "0: No tumor"], ["1", "1: < 0.5 cm"], ["2", "2: 0.5 – 5 cm"], ["3", "3: > 5 cm / Confluent"]]),
        makeS("r1", "Region 1 (Right Flank / Diaphragm)", "0", [["0", "0: No tumor"], ["1", "1: < 0.5 cm"], ["2", "2: 0.5 – 5 cm"], ["3", "3: > 5 cm / Confluent"]]),
        makeS("r2", "Region 2 (Epigastrium / Lesser Omentum)", "1", [["0", "0: No tumor"], ["1", "1: < 0.5 cm"], ["2", "2: 0.5 – 5 cm"], ["3", "3: > 5 cm / Confluent"]]),
        makeS("r3", "Region 3 (Left Flank / Diaphragm / Spleen)", "0", [["0", "0: No tumor"], ["1", "1: < 0.5 cm"], ["2", "2: 0.5 – 5 cm"], ["3", "3: > 5 cm / Confluent"]]),
        makeS("r4", "Region 4 (Left Lower Quadrant)", "0", [["0", "0: No tumor"], ["1", "1: < 0.5 cm"], ["2", "2: 0.5 – 5 cm"], ["3", "3: > 5 cm / Confluent"]]),
        makeS("r5", "Region 5 (Pelvis / Cul-de-sac)", "1", [["0", "0: No tumor"], ["1", "1: < 0.5 cm"], ["2", "2: 0.5 – 5 cm"], ["3", "3: > 5 cm / Confluent"]]),
        makeS("r6", "Region 6 (Right Lower Quadrant)", "0", [["0", "0: No tumor"], ["1", "1: < 0.5 cm"], ["2", "2: 0.5 – 5 cm"], ["3", "3: > 5 cm / Confluent"]]),
        makeS("r7", "Region 7 (Small Bowel Mesentery)", "0", [["0", "0: No tumor"], ["1", "1: < 0.5 cm"], ["2", "2: 0.5 – 5 cm"], ["3", "3: > 5 cm / Confluent"]])
      ],
      table: {
        headers: ["PCI Score Range", "Disease Burden", "Complete Resection (CC-0/1) Probability", "HIPEC Candidacy"],
        rows: [
          { id: "pciLow", cols: ["PCI 1 – 10", "Low Burden", "> 85%", "Ideal candidate for Complete Cytoreductive Surgery (CRS) + HIPEC"] },
          { id: "pciMod", cols: ["PCI 11 – 20", "Moderate Burden", "50% – 60%", "Candidate if complete macroscopic clearance is technically achievable"] },
          { id: "pciHigh", cols: ["PCI > 20", "High / Disseminated Burden", "< 20%", "Poor outcome in colorectal cancer; CRS+HIPEC typically contraindicated"] }
        ]
      },
      calc: function (v) {
        var total = +v.r0 + +v.r1 + +v.r2 + +v.r3 + +v.r4 + +v.r5 + +v.r6 + +v.r7;
        var match = "pciLow", st = "Low Burden", cand = "Eligible for complete CRS + HIPEC.";

        if (total > 20) {
          match = "pciHigh";
          st = "Very High Burden (PCI > 20)";
          cand = "In colorectal carcinomatosis, PCI > 20 is associated with low cure rates; systemic chemotherapy preferred over morbid cytoreduction.";
        } else if (total > 10) {
          match = "pciMod";
          st = "Moderate Burden (PCI 11–20)";
          cand = "Proceed with cytoreductive exploration if completeness of cytoreduction score 0 (CC-0) can be guaranteed.";
        }

        return {
          value: "PCI Score: " + total + " / 39 (" + st + ")",
          matchId: match,
          eq: "Clinical Decision: " + cand
        };
      }
    },

    // ==============================================================
    // 15. RESIDUAL TUMOR (R) CLASSIFICATION
    // ==============================================================
    {
      id: "rClassification",
      cat: "surgery",
      type: "class",
      name: "Residual Tumor (R) Classification (UICC / AJCC)",
      desc: "Universal surgical pathology classification for completeness of cancer resection margins.",
      organ: "All Solid Organ Tumors",
      region: "Oncologic Surgery / Pathology",
      subject: "Surgical Oncology / Resection Margins",
      keywords: ["r0", "r1", "r2", "margins", "residual tumor", "resection", "clearance"],
      guidance: "1. R0: Complete macroscopic and microscopic resection with no residual tumor (clear histological margin >1 mm or as defined by organ site).\n2. R1: Microscopic residual tumor (tumor at ink or positive pathological margin).\n3. R2: Macroscopic residual tumor left behind in situ (gross tumor deposits).\n4. RX: Presence of residual tumor cannot be assessed.",
      contraindications: "Does not define the precise millimeter clearance for breast or melanoma margins (e.g., 'no ink on tumor' in breast vs 1–2 cm margins in melanoma).",
      literature: [
        {
          type: "UICC Definition",
          icon: "📘",
          title: "The R classification: a necessity in surgical oncology",
          citation: "Wittekind C, Compton CC, Brierley J. Ann Surg Oncol. 2013;20(1):14-18.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/22956241/" }
          ]
        }
      ],
      fields: [
        makeS("r", "Margin Clearance & Post-Resection Status", "R0", [
          ["R0", "R0: No residual tumor (microscopically and macroscopically negative margins)"],
          ["R1", "R1: Microscopic residual tumor (positive microscopic margin on histology)"],
          ["R2", "R2: Macroscopic residual tumor (gross visible tumor left in patient)"],
          ["RX", "RX: Presence of residual tumor cannot be evaluated"]
        ])
      ],
      table: {
        headers: ["Category", "Margin Status", "Prognostic Implication", "Next Oncologic Step"],
        rows: [
          { id: "r0m", cols: ["R0", "Negative (clear margins)", "Optimal locoregional control and disease-free survival", "Standard surveillance ± adjuvant chemotherapy/radiotherapy"] },
          { id: "r1m", cols: ["R1", "Positive microscopic margin", "Significantly increased risk of locoregional recurrence", "Consider re-resection to achieve clear margins or adjuvant radiation"] },
          { id: "r2m", cols: ["R2", "Positive gross macroscopic margin", "Palliative status; high progression risk", "Palliative radiotherapy, systemic chemo, or targeted therapy"] },
          { id: "rxm", cols: ["RX", "Cannot be assessed", "Indeterminate surgical clearance", "Re-review histology slides with dedicated oncologic pathologist"] }
        ]
      },
      calc: function (v) {
        var r = v.r;
        var match = r === "R0" ? "r0m" : r === "R1" ? "r1m" : r === "R2" ? "r2m" : "rxm";
        var plan = (r === "R0")
          ? "Curative-intent complete R0 resection achieved."
          : (r === "R1")
          ? "R1 Microscopic Residual: Discuss at Multidisciplinary Tumor Board (MDT) for immediate surgical re-excision vs adjuvant targeted radiotherapy."
          : (r === "R2")
          ? "R2 Macroscopic Residual: Incomplete resection. Transition focus to systemic disease control and palliative therapy."
          : "RX: Re-examination of surgical specimens needed.";

        return {
          value: "Resection Margin: " + r,
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 16. PARKLAND FORMULA & BAUX SCORE FOR BURNS
    // ==============================================================
    {
      id: "parklandBauxBurns",
      cat: "surgery",
      type: "calc",
      name: "Parkland Formula & Revised Baux Score (Burns)",
      desc: "Calculates emergency 24-hour fluid resuscitation requirements and predicts mortality in severe burn trauma.",
      organ: "Skin / Fluid & Electrolytes / Vasculature",
      region: "Emergency / Burn Surgery",
      subject: "Acute Care & Burn Surgery / Trauma",
      keywords: ["parkland", "burns", "baux", "tbsa", "fluid resuscitation", "lactated ringers", "rule of nines"],
      guidance: "1. Parkland formula: Total 24h LR = 4 mL × Weight (kg) × % TBSA (2nd and 3rd degree burns only).\n2. Administration: 50% given in the first 8 hours FROM THE TIME OF INJURY; remaining 50% given over the next 16 hours.\n3. Titrate fluids to maintain urine output of 0.5–1.0 mL/kg/h in adults.\n4. Revised Baux Score: Age + % TBSA + [17 if inhalation injury present].\n5. Baux Score > 140 predicts near 100% mortality.",
      contraindications: "Avoid 'fluid creep' (excessive resuscitation leading to abdominal or extremity compartment syndrome); titrate strictly to end-organ perfusion and urine output.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "The revised Baux score: a tool for evaluating mortality in burn patients",
          citation: "Osler T, Glance LG, Hosmer DW. J Trauma. 2010;68(3):690-697.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/20068484/" }
          ]
        }
      ],
      fields: [
        makeN("weight", "Patient Weight (kg)", 70, { min: 10, max: 250, step: 1 }),
        makeN("tbsa", "Total Body Surface Area Burned (% TBSA, 2nd & 3rd degree)", 30, { min: 1, max: 100, step: 1 }),
        makeN("age", "Patient Age (years)", 45, { min: 1, max: 110, step: 1 }),
        makeS("inhalation", "Concomitant Inhalation Injury?", "0", [
          ["0", "No inhalation injury (0 pts)"],
          ["17", "Yes — Inhalation injury present (+17 pts)"]
        ])
      ],
      table: {
        headers: ["Parameter", "Calculated Metric", "Infusion Rate", "Target Endpoint"],
        rows: [
          { id: "f1", cols: ["First 8 Hours", "50% of total volume", "Total ÷ 16 mL/hr", "Urine output 0.5 – 1.0 mL/kg/h (30–50 mL/h)"] },
          { id: "f2", cols: ["Next 16 Hours", "Remaining 50% volume", "Total ÷ 32 mL/hr", "Avoid fluid overload / monitor pulmonary status"] },
          { id: "bauxMort", cols: ["Revised Baux Score", "Age + %TBSA + Inhalation", "Mortality prediction", "Scores >100 represent high mortality; >140 futile"] }
        ]
      },
      calc: function (v) {
        var w = +v.weight, t = +v.tbsa, age = +v.age, inh = +v.inhalation;
        var totalFluid = 4 * w * t;
        var first8 = totalFluid / 2;
        var next16 = totalFluid / 2;
        var rate1 = Math.round(first8 / 8);
        var rate2 = Math.round(next16 / 16);

        var baux = age + t + inh;
        var bauxRisk = baux < 75 ? "< 5% mortality" : baux < 100 ? "10% – 25% mortality" : baux < 125 ? "30% – 60% mortality" : "> 80% – 100% mortality";

        return {
          value: "Total 24h LR: " + totalFluid + " mL | Baux Score: " + baux,
          matchId: "f1",
          eq: "Resuscitation Plan (Lactated Ringer's):\n• First 8 Hours: " + first8 + " mL (at " + rate1 + " mL/hr)\n• Next 16 Hours: " + next16 + " mL (at " + rate2 + " mL/hr)\n• Revised Baux Score: " + baux + " (" + bauxRisk + ")\n• Titrate strictly to target adult urine output: 0.5–1.0 mL/kg/hr."
        };
      }
    },

    // ==============================================================
    // 17. ASA PHYSICAL STATUS CLASSIFICATION SYSTEM
    // ==============================================================
    {
      id: "asaClassification",
      cat: "surgery",
      type: "class",
      name: "ASA Physical Status Classification System",
      desc: "Global preoperative physiological risk grading system developed by the American Society of Anesthesiologists.",
      organ: "Cardiopulmonary / Systemic",
      region: "Preoperative / Anesthesia",
      subject: "Preoperative Evaluation / Surgical Fitness",
      keywords: ["asa", "physical status", "anesthesia", "preop", "fitness", "mortality"],
      guidance: "1. ASA I: A normal healthy patient.\n2. ASA II: A patient with mild systemic disease (e.g. well-controlled HTN, DM, smoking, obesity BMI 30-40).\n3. ASA III: A patient with severe systemic disease with functional limitation (e.g. poorly controlled DM, stable angina, COPD, morbid obesity BMI ≥40, ESRD on dialysis).\n4. ASA IV: A patient with severe systemic disease that is a constant threat to life (e.g. recent MI <3 months, unstable angina, severe valve disease, sepsis).\n5. ASA V: A moribund patient who is not expected to survive without the operation (e.g. ruptured aortic aneurysm, massive trauma, intracranial bleed with mass effect).\n6. ASA VI: A declared brain-dead patient whose organs are being removed for donor purposes.\n7. Emergency modifier 'E' is added for emergent procedures.",
      contraindications: "Does not score surgical complexity or technical procedure-related risks.",
      literature: [
        {
          type: "Official ASA Classification",
          icon: "📘",
          title: "ASA Physical Status Classification System",
          citation: "American Society of Anesthesiologists. Last amended Dec 2020.",
          links: [
            { text: "View Official ASA ↗", url: "https://www.asahq.org/standards-and-practice-parameters/statement-on-asa-physical-status-classification-system" }
          ]
        }
      ],
      fields: [
        makeS("asa", "Patient Physiological Physical Status", "II", [
          ["I", "ASA I: Healthy, non-smoking, no or minimal alcohol"],
          ["II", "ASA II: Mild systemic disease without substantive functional limitations"],
          ["III", "ASA III: Severe systemic disease with substantive functional limitations"],
          ["IV", "ASA IV: Severe systemic disease that is a constant threat to life"],
          ["V", "ASA V: Moribund patient not expected to survive without operation"],
          ["VI", "ASA VI: Declared brain-dead organ donor"]
        ]),
        makeS("emergent", "Is this an Emergency Operation?", "0", [
          ["0", "Elective / Non-emergency"],
          ["E", "Emergency procedure (add 'E' modifier)"]
        ])
      ],
      table: {
        headers: ["ASA Class", "Systemic Burden", "Baseline Perioperative Mortality", "Optimization Priority"],
        rows: [
          { id: "asa1", cols: ["ASA I", "Healthy, fit patient", "< 0.1%", "Standard elective pathway"] },
          { id: "asa2", cols: ["ASA II", "Mild disease; no functional impairment", "~ 0.2%", "Maintain regular medications; smoking cessation"] },
          { id: "asa3", cols: ["ASA III", "Severe systemic disease; functional limits", "~ 1.8% – 4.0%", "Preoperative medical optimization; multidisciplinary review"] },
          { id: "asa4", cols: ["ASA IV", "Incapacitating disease; threat to life", "~ 7.8% – 10%", "High dependency/ICU monitoring; risk-benefit discussion"] },
          { id: "asa5", cols: ["ASA V", "Moribund; survival unlikely without surgery", "~ 20% – 50%+", "Emergent damage-control resuscitation and salvage surgery"] }
        ]
      },
      calc: function (v) {
        var a = v.asa;
        var isE = v.emergent === "E";
        var match = a === "I" ? "asa1" : a === "II" ? "asa2" : a === "III" ? "asa3" : a === "IV" ? "asa4" : "asa5";
        var code = "ASA " + a + (isE ? "-E" : "");
        var mort = a === "I" ? "<0.1%" : a === "II" ? "0.2%" : a === "III" ? "1.8–4%" : a === "IV" ? "8–10%" : ">20–50%";

        return {
          value: code + " (Mortality Baseline: " + mort + ")",
          matchId: match,
          eq: "Clinical Definition: " + (isE ? "Emergency modifier indicates acute surgical necessity. " : "Elective procedure. ") + "Reflects baseline systemic physiological resilience."
        };
      }
    },

    // ==============================================================
    // 18. MELD-NA (MODEL FOR END-STAGE LIVER DISEASE)
    // ==============================================================
    {
      id: "meldNaSurgery",
      cat: "surgery",
      type: "calc",
      name: "MELD-Na Score for Cirrhosis Operative Risk",
      desc: "Continuous laboratory score estimating 90-day mortality in patients with chronic liver disease undergoing surgery.",
      organ: "Liver / Kidney / Electrolytes",
      region: "Abdomen / Hepatology",
      subject: "Hepatobiliary Surgery / Liver Transplant",
      keywords: ["meld", "meld-na", "cirrhosis", "creatinine", "bilirubin", "inr", "sodium", "liver failure"],
      guidance: "1. Uses serum Bilirubin, Creatinine, INR, and Sodium.\n2. Dialysis ≥2 times in the last 7 days sets Creatinine to 4.0 mg/dL.\n3. Standard MELD = 9.57 × ln(Cr) + 3.78 × ln(Bili) + 11.20 × ln(INR) + 6.43.\n4. MELD-Na = MELD + 1.32 × (137 − Na) − [0.033 × MELD × (137 − Na)].\n5. In non-transplant general surgery:\n   - MELD < 10: Low mortality (~5–10%)\n   - MELD 10–14: Moderate mortality (~15–20%)\n   - MELD ≥ 15: High risk (>30–50%); elective surgery generally avoided.",
      contraindications: "Does not score portal hypertension manifestations such as bleeding esophageal varices or refractory ascites directly.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "The Model for End-Stage Liver Disease (MELD)",
          citation: "Kamath PS, Wiesner RH, Malinchoc M, et al. Hepatology. 2001;33(2):464-470.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/11172350/" }
          ]
        }
      ],
      fields: [
        makeN("bili", "Serum Bilirubin (mg/dL)", 1.2, { min: 0.1, max: 40, step: 0.1 }),
        makeN("inr", "International Normalized Ratio (INR)", 1.1, { min: 0.8, max: 10, step: 0.1 }),
        makeN("cr", "Serum Creatinine (mg/dL)", 0.9, { min: 0.2, max: 15, step: 0.1 }),
        makeN("na", "Serum Sodium (mEq/L)", 138, { min: 110, max: 155, step: 1 }),
        makeS("dialysis", "Hemodialysis ≥ 2 times in past 7 days?", "0", [
          ["0", "No"],
          ["1", "Yes (Creatinine locked to 4.0 mg/dL)"]
        ])
      ],
      table: {
        headers: ["MELD-Na Score", "90-Day Medical Mortality", "Abdominal Surgery Mortality", "Surgical Clearance"],
        rows: [
          { id: "mLow", cols: ["< 10", "1.9%", "< 10%", "Elective surgery generally safe; monitor renal and coag status"] },
          { id: "mMod", cols: ["10 – 14", "6.0%", "15% – 25%", "Intermediate risk; optimize hemodynamics and correct coagulopathy"] },
          { id: "mHigh", cols: ["15 – 24", "19.6%", "> 30% – 50%", "High risk; defer elective surgery; consider transplant first"] },
          { id: "mCrit", cols: ["≥ 25", "> 52%+", "> 60% – 80%", "Elective surgery STRICTLY CONTRAINDICATED; emergent life-saving only"] }
        ]
      },
      calc: function (v) {
        var bili = Math.max(1.0, +v.bili);
        var inr = Math.max(1.0, +v.inr);
        var cr = v.dialysis === "1" ? 4.0 : Math.min(4.0, Math.max(1.0, +v.cr));
        var na = Math.min(137, Math.max(125, +v.na));

        var meld = (9.57 * Math.log(cr)) + (3.78 * Math.log(bili)) + (11.20 * Math.log(inr)) + 6.43;
        meld = Math.round(meld);

        var meldNa = meld;
        if (meld > 11) {
          meldNa = meld + 1.32 * (137 - na) - (0.033 * meld * (137 - na));
          meldNa = Math.round(meldNa);
        }
        meldNa = Math.min(40, Math.max(6, meldNa));

        var match = "mLow", advice = "Low perioperative mortality risk.";
        if (meldNa >= 25) {
          match = "mCrit"; advice = "Critical mortality risk (>60%). Elective abdominal surgery is contraindicated.";
        } else if (meldNa >= 15) {
          match = "mHigh"; advice = "Substantial perioperative morbidity. Strongly avoid elective abdominal procedures.";
        } else if (meldNa >= 10) {
          match = "mMod"; advice = "Intermediate surgical risk. Aggressively optimize volume status and liver function.";
        }

        return {
          value: "MELD-Na: " + meldNa + " Points (MELD: " + meld + ")",
          matchId: match,
          eq: "Clinical Decision: " + advice
        };
      }
    },

    // ==============================================================
    // 19. THYROID CANCER TNM STAGING (AJCC 8TH EDITION)
    // ==============================================================
    {
      id: "tnmThyroid",
      cat: "surgery",
      type: "class",
      name: "Differentiated Thyroid Carcinoma TNM (AJCC 8th)",
      desc: "Age-stratified staging (cut-off 55 years) for papillary and follicular thyroid carcinomas.",
      organ: "Thyroid / Neck Nodes",
      region: "Head & Neck / Endocrine",
      subject: "Endocrine Surgery / Surgical Oncology",
      keywords: ["thyroid", "tnm", "ajcc", "papillary", "follicular", "central neck", "lateral neck"],
      guidance: "1. AJCC 8th Edition cutoff age is 55 years at diagnosis.\n2. Age < 55 years: Stage I (Any T, Any N, M0) or Stage II (Any T, Any N, M1).\n3. Age ≥ 55 years:\n   - Stage I: T1 (≤2 cm) / T2 (>2–4 cm), N0, M0\n   - Stage II: T1–T2 with N1, or T3 (gross strap muscle invasion or >4 cm), M0\n   - Stage III: T4a (gross invasion of subcutaneous soft tissue, larynx, trachea, esophagus, or recurrent laryngeal nerve), Any N, M0\n   - Stage IVA: T4b (prevertebral fascia or encasing carotid/mediastinal vessels), Any N, M0\n   - Stage IVB: Any T, Any N, M1 (distant metastases).",
      contraindications: "Does not apply to Medullary Thyroid Carcinoma or Anaplastic Thyroid Carcinoma (all anaplastic are Stage IV).",
      literature: [
        {
          type: "Official AJCC Guideline",
          icon: "📘",
          title: "AJCC Cancer Staging Manual, 8th Edition: Thyroid",
          citation: "Tuttle RM, Haugen B, Perrier ND. Springer; 2017.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/28734003/" }
          ]
        }
      ],
      fields: [
        makeN("age", "Patient Age at Diagnosis (years)", 48, { min: 1, max: 105, step: 1 }),
        makeS("t", "Primary Tumor Size & Extrathyroidal Extension (T)", "T1b", [
          ["T1a", "T1a: Tumor ≤ 1.0 cm, limited to thyroid"],
          ["T1b", "T1b: Tumor > 1.0 cm to ≤ 2.0 cm, limited to thyroid"],
          ["T2", "T2: Tumor > 2.0 cm to ≤ 4.0 cm, limited to thyroid"],
          ["T3a", "T3a: Tumor > 4.0 cm, limited to thyroid"],
          ["T3b", "T3b: Gross invasion of strap muscles (sternohyoid, sternothyroid, omohyoid)"],
          ["T4a", "T4a: Gross invasion of larynx, trachea, esophagus, recurrent laryngeal nerve"],
          ["T4b", "T4b: Gross invasion of prevertebral fascia or encasing carotid artery"]
        ]),
        makeS("n", "Cervical Lymph Nodes (N)", "N0", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1a", "N1a: Central neck compartment nodes (Level VI or VII - prelaryngeal, pretracheal, paratracheal)"],
          ["N1b", "N1b: Lateral neck compartment nodes (Levels I–V) or retropharyngeal"]
        ]),
        makeS("m", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1", "M1: Distant metastasis present (lung, bone)"]
        ])
      ],
      table: {
        headers: ["Age Group", "Stage", "TNM Definition", "Prognosis & Surgical Strategy"],
        rows: [
          { id: "yI", cols: ["< 55 Years", "Stage I", "Any T, Any N, M0", "Excellent >98% 10-year survival; total thyroidectomy or lobectomy ± RAI"] },
          { id: "yII", cols: ["< 55 Years", "Stage II", "Any T, Any N, M1", "Distant metastasis present; total thyroidectomy + radioactive iodine (RAI)"] },
          { id: "oI", cols: ["≥ 55 Years", "Stage I", "T1–T2 N0 M0", "Low risk; thyroid lobectomy or total thyroidectomy"] },
          { id: "oII", cols: ["≥ 55 Years", "Stage II", "T1–T2 N1 M0 OR T3 Any N M0", "Intermediate risk; total thyroidectomy + neck dissection + RAI"] },
          { id: "oIII", cols: ["≥ 55 Years", "Stage III / IV", "T4a–T4b OR M1", "High risk; radical surgical resection + adjuvant RAI / external beam RT"] }
        ]
      },
      calc: function (v) {
        var age = +v.age, t = v.t, n = v.n, m = v.m;
        var stg = "Stage I", match = "yI";

        if (age < 55) {
          if (m === "M1") {
            stg = "Stage II (< 55 yrs with distant metastasis)";
            match = "yII";
          } else {
            stg = "Stage I (< 55 yrs, M0)";
            match = "yI";
          }
        } else {
          if (m === "M1") {
            stg = "Stage IVB (Distant Metastasis)";
            match = "oIII";
          } else if (t === "T4b") {
            stg = "Stage IVA";
            match = "oIII";
          } else if (t === "T4a") {
            stg = "Stage III";
            match = "oIII";
          } else if (t === "T3a" || t === "T3b" || n === "N1a" || n === "N1b") {
            stg = "Stage II";
            match = "oII";
          } else {
            stg = "Stage I";
            match = "oI";
          }
        }

        return {
          value: "Thyroid AJCC: " + stg + " [" + t + " " + n + " " + m + "]",
          matchId: match,
          eq: "Age at diagnosis (" + age + " yrs) is the dominant prognostic variable. Evaluate neck ultrasound for central (VI) vs lateral (II-IV) lymphadenopathy."
        };
      }
    },

    // ==============================================================
    // 20. BOEY SCORE FOR PERFORATED PEPTIC ULCER
    // ==============================================================
    {
      id: "boeyScore",
      cat: "surgery",
      type: "calc",
      name: "Boey Score for Perforated Peptic Ulcer",
      desc: "Scores 3 objective clinical risk factors to predict mortality and morbidity following emergency ulcer repair.",
      organ: "Stomach / Duodenum / Peritoneum",
      region: "Abdomen / Upper GI",
      subject: "Emergency General Surgery / Peritonitis",
      keywords: ["boey", "peptic ulcer", "perforation", "peritonitis", "duodenal ulcer", "graham patch", "mortality"],
      guidance: "1. 3 risk factors (1 point each):\n   - Concomitant severe medical illness (cardiovascular, respiratory, renal)\n   - Preoperative shock (Systolic BP < 90 mmHg on admission)\n   - Duration of perforation > 24 hours prior to surgery\n2. Score 0: Mortality < 2%; Score 1: ~10%; Score 2: ~20%–30%; Score 3: > 50%.\n3. Guides decision between laparoscopic vs open repair (Graham omental patch).",
      contraindications: "Does not score hemodynamic instability occurring intraoperatively.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Risk stratification in perforated duodenal ulcers: a prospective study",
          citation: "Boey J, Choi SK, Poon A, et al. Ann Surg. 1987;205(1):22-26.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/3800458/" }
          ]
        }
      ],
      fields: [
        makeS("illness", "1. Severe concomitant medical illness (severe COPD, CHF, ESRD, cirrhosis)", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("shock", "2. Preoperative shock (Admission Systolic Blood Pressure < 90 mmHg)", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("delayed", "3. Prolonged perforation (> 24 hours from pain onset to surgery)", "0", [["0", "No (≤ 24 hours) (0 pts)"], ["1", "Yes (> 24 hours) (+1 pt)"]])
      ],
      table: {
        headers: ["Boey Score", "Mortality Rate", "Postoperative Morbidity", "Surgical Approach"],
        rows: [
          { id: "b0", cols: ["0 Points", "1.5%", "11%", "Laparoscopic or open Graham omental patch repair; excellent prognosis"] },
          { id: "b1", cols: ["1 Point", "10%", "30%", "Open Graham patch repair; close post-op hemodynamic monitoring"] },
          { id: "b2", cols: ["2 Points", "25% – 30%", "60%", "Open laparotomy, extensive peritoneal lavage, ICU resuscitation"] },
          { id: "b3", cols: ["3 Points", "> 50%", "> 80%", "CRITICAL RISK: Damage control laparotomy, omental patch, ICU vasopressor support"] }
        ]
      },
      calc: function (v) {
        var score = +v.illness + +v.shock + +v.delayed;
        var match = "b" + score;
        var mort = score === 0 ? "1.5%" : score === 1 ? "10%" : score === 2 ? "25%–30%" : "> 50%";
        var advice = score === 0
          ? "Favourable candidate for laparoscopic primary suture repair with pedicled Graham omental patch."
          : (score >= 2)
          ? "High operative mortality. Perform rapid open laparotomy, peritoneal debridement, Graham omental patch, and arrange postop ICU care."
          : "Intermediate surgical risk. Standard open repair with omental pedicle patch.";

        return {
          value: "Boey Score: " + score + " / 3 (Mortality Risk: " + mort + ")",
          matchId: match,
          eq: "Clinical Recommendation: " + advice
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
      if (window.categories[i] && window.categories[i].id === surgeryCategory.id) {
        catExists = true;
        break;
      }
    }
    if (!catExists) {
      window.categories.push(surgeryCategory);
    }

    // 2. Safely add tools
    surgeryTools.forEach(function (tool) {
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
      window.SYNONYM_MAP["surgery"] = ["surgery", "surgical", "general surgery", "acute abdomen", "oncology", "perioperative"];
      window.SYNONYM_MAP["appendicitis"] = ["appendicitis", "alvarado", "mantrels", "appendix", "rlq"];
      window.SYNONYM_MAP["cholecystitis"] = ["cholecystitis", "tokyo", "tg18", "gallbladder", "murphy"];
      window.SYNONYM_MAP["pancreatitis"] = ["pancreatitis", "ranson", "bisap", "amylase", "lipase"];
      window.SYNONYM_MAP["diverticulitis"] = ["diverticulitis", "hinchey", "abscess", "perforation", "sigmoid"];
      window.SYNONYM_MAP["tnm"] = ["tnm", "ajcc", "staging", "colorectal", "breast", "thyroid", "oncology", "cancer"];
      window.SYNONYM_MAP["complication"] = ["clavien", "dindo", "apgar", "complication", "surgical apgar", "asa"];
      window.SYNONYM_MAP["burns"] = ["parkland", "baux", "burn", "tbsa", "fluid", "lactated ringers"];
      window.SYNONYM_MAP["liver"] = ["child", "pugh", "meld", "cirrhosis", "hepatobiliary"];
    }

    // 4. Force repaint if the HTML engine has already initialized
    if (typeof window.renderHome === "function") {
      window.renderHome();
    }
  } catch (err) {
    console.error("Critical error registering Surgery tools:", err);
  }
})();
