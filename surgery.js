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
      guidance: "1. MANTRELS mnemonic: Migration of pain (1), Anorexia (1), Nausea/vomiting (1), Tenderness RLQ (2), Rebound tenderness (1), Elevated temperature ≥37.3°C (1), Leukocytosis WBC >10,000 (2), Shift of neutrophils to left >75% (1).
2. Maximum score = 10.
3. Score ≤4: Appendicitis very unlikely; consider discharge or alternative diagnosis.
4. Score 5–6: Equivocal/compatible; obtain ultrasound or IV-contrast CT.
5. Score ≥7: High probability; urgent surgical consult.",
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
          eq: "MANTRELS Breakdown: Symptoms (3) + Signs (3) + Labs (3) = Total " + score + ".
" + plan
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
      guidance: "1. Based on the therapy required to correct the complication.
2. Grade I: Any deviation without need for pharmacological treatment (except antiemetics, antipyretics, analgesics, diuretics, electrolytes) or surgical, endoscopic, or radiological interventions.
3. Grade II: Pharmacological treatment with drugs other than Grade I (e.g., blood transfusions, TPN, antibiotics).
4. Grade III: Requiring surgical, endoscopic, or radiological intervention (IIIa: without GA; IIIb: under GA).
5. Grade IV: Life-threatening complication requiring ICU management (IVa: single organ dysfunction; IVb: multiorgan dysfunction).
6. Grade V: Death of the patient.",
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
      guidance: "1. Diagnostic criteria: A (Local signs: Murphy sign, RUQ mass/pain) + B (Systemic signs: fever, elevated CRP/WBC) + C (Imaging: sonographic Murphy, wall thickening >4 mm, pericholecystic fluid).
2. Definite diagnosis: 1 from A + 1 from B + 1 from C.
3. Grade I (Mild): Healthy patient, mild gallbladder inflammation, safe for early laparoscopic cholecystectomy.
4. Grade II (Moderate): Marked local inflammation (WBC >18,000, palpable tender RUQ mass, duration >72h, or gangrenous/emphysematous changes).
5. Grade III (Severe): Associated with organ dysfunction (cardiovascular, neurological, respiratory, renal, hepatic, or hematologic).",
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
      guidance: "1. Requires 2-stage assessment: 5 parameters at admission and 6 parameters at 48 hours.
2. Non-gallstone criteria parameters:
   - At admission: Age > 55, WBC > 16,000, Glucose > 200 mg/dL (11 mmol/L), AST > 250 IU/L, LDH > 350 IU/L.
   - Within 48 hours: Hematocrit drop > 10%, BUN rise > 5 mg/dL, Calcium < 8.0 mg/dL, PaO2 < 60 mmHg, Base deficit > 4 mEq/L, Fluid sequestration > 6 L.
3. Score 0–2: Mortality <1%; Score 3–4: ~15%; Score 5–6: ~40%; Score ≥7: >50%–100%.",
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
          eq: "Predicted Hospital Mortality: " + mort + ".
Requires aggressive volume resuscitation with Lactated Ringer's solution."
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
      guidance: "1. Evaluated within first 24 hours.
2. Criteria (1 point each):
   - B: BUN > 25 mg/dL (8.9 mmol/L)
   - I: Impaired mental status (GCS < 15 or disorientation)
   - S: SIRS criteria ≥ 2 (HR>90, RR>20 or PaCO2<32, Temp<36 or >38°C, WBC<4000 or >12000)
   - A: Age > 60 years
   - P: Pleural effusion present on imaging (CXR or CT)
3. BISAP ≥ 3 signifies substantial risk of organ failure and mortality.",
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
          eq: "Mortality Risk: " + mort + ".
Calculated within first 24 hours of admission."
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
      guidance: "1. Based on contrast-enhanced abdominal/pelvic CT findings.
2. Stage 0: Clinically mild diverticulitis (colonic wall thickening, fat stranding).
3. Stage Ia: Pericolic phlegmon or localized pericolic inflammation without abscess.
4. Stage Ib: Pericolic or mesenteric abscess (< 4 cm: antibiotics; ≥ 4 cm: percutaneous CT drain).
5. Stage II: Pelvic, retroperitoneal, or distant intra-abdominal abscess.
6. Stage III: Generalized purulent peritonitis (perforated diverticulum communicates with peritoneum).
7. Stage IV: Generalized feculent peritonitis (large open perforation with free colonic fecal spilling).",
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
      guidance: "1. Calculated at the end of surgery from the anesthesia record using 3 objective intraoperative parameters:
   - Estimated Blood Loss (EBL, mL)
   - Lowest Mean Arterial Pressure (MAP, mmHg)
   - Lowest Heart Rate (bpm)
2. Score range 0 to 10 points.
3. Score ≤ 4 indicates high risk of postop death and major complications (16-fold increase).",
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
          eq: "Components: EBL (" + v.ebl + " pts) + Lowest MAP (" + v.map + " pts) + Lowest HR (" + v.hr + " pts) = " + total + ".
" + note
        };
      }
    },

    // ==============================================================
    // 8. CHILD-PUGH SCORE FOR CIRRHOSIS OPERATIVE RISK
    // ==============================================================
    {
      id: "childPughSurgery",
      cat: "surgery",
      type: "calc",
      name: "Child–Pugh Score for Liver Surgical Risk",
      desc: "Grades severity of liver cirrhosis to estimate perioperative mortality before abdominal surgery.",
      organ: "Liver / Portal System",
      region: "Abdomen / Hepatobiliary",
      subject: "Hepatobiliary & General Surgery / Cirrhosis",
      keywords: ["child", "pugh", "turcotte", "cirrhosis", "bilirubin", "albumin", "ascites", "encephalopathy", "inr"],
      guidance: "1. 5 parameters: Total Bilirubin, Serum Albumin, INR / Prothrombin time, Ascites, Hepatic Encephalopathy.
2. In cholestatic diseases (PBC/PSC), bilirubin cutoffs change (1–4, 4–10, >10 mg/dL).
3. Child-Pugh A (5–6 pts): Abdominal surgery well tolerated (perioperative mortality ~10%).
4. Child-Pugh B (7–9 pts): Intermediate risk (~30% mortality); medically optimize first.
5. Child-Pugh C (10–15 pts): Extremely high mortality (up to 70%–80%); elective abdominal surgery is contraindicated.",
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
          eq: "Estimated Abdominal Surgery Perioperative Mortality: " + mort + ".
" + advice
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
      guidance: "1. Class I (Clean): Uninfected operative wound; no inflammation encountered; respiratory, alimentary, genital, or uninfected urinary tracts are NOT entered.
2. Class II (Clean-Contaminated): Operative wound in which respiratory, alimentary, genital, or uninfected urinary tracts are entered under controlled conditions and without unusual contamination (e.g. elective cholecystectomy, appendectomy, colectomy with prep).
3. Class III (Contaminated): Open, fresh, accidental wounds, or operations with major breaks in sterile technique, or gross spillage from GI tract.
4. Class IV (Dirty-Infected): Old traumatic wounds with retained devitalized tissue or wounds involving existing clinical infection or perforated viscera.",
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
      guidance: "1. 6 independent predictors (1 point each):
   - High-risk surgery (intraperitoneal, intrathoracic, or suprainguinal vascular)
   - History of ischemic heart disease
   - History of congestive heart failure
   - History of cerebrovascular disease (stroke or TIA)
   - Insulin therapy for diabetes
   - Preoperative serum creatinine > 2.0 mg/dL (177 µmol/L)
2. Class I (0 pts): 0.4% MACE; Class II (1 pt): 0.9%; Class III (2 pts): 6.6%; Class IV (≥3 pts): >11%.",
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
          eq: "Estimated 30-Day Risk of Major Cardiac Event (MACE): " + risk + ".
" + (score >= 2 ? "Patient has elevated cardiac risk. Check functional capacity and obtain 12-lead ECG." : "Low cardiac complication risk.")
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
      guidance: "1. Sums multi-weighted clinical factors (1, 2, 3, or 5 points):
   - 1 pt: Age 41–60, minor surgery, BMI >25, swollen legs, varicose veins.
   - 2 pts: Age 61–74, major surgery (>45 min), arthroscopic surgery, central line, malignancy.
   - 3 pts: Age ≥75, history of DVT/PE, family history of thrombosis, positive factor V Leiden or antiphospholipid.
   - 5 pts: Stroke within 1 month, elective arthroplasty, hip/pelvis/leg fracture, acute spinal cord injury.
2. Risk tiers: Very low (0), Low (1–2), Moderate (3–4), High (≥5).",
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
      guidance: "1. T (Tumor): Tis (mucosa), T1 (submucosa), T2 (muscularis propria), T3 (subserosa/pericolic fat), T4a (penetrates visceral peritoneum), T4b (direct organ invasion).
2. N (Nodes): N0 (0 nodes), N1a (1 node), N1b (2–3 nodes), N1c (tumor deposits), N2a (4–6 nodes), N2b (≥7 nodes).
3. M (Metastasis): M0 (none), M1a (1 site without peritoneal), M1b (≥2 sites), M1c (peritoneal metastasis).
4. Staging dictates adjuvant chemotherapy (FOLFOX/CAPOX in Stage III and high-risk Stage II).",
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
      guidance: "1. T: T1 (≤2 cm; T1mi ≤0.1cm, T1a 0.1–0.5cm, T1b 0.5–1cm, T1c 1–2cm), T2 (>2 to 5 cm), T3 (>5 cm), T4 (chest wall/skin invasion, peau d'orange, inflammatory).
2. N: N0 (no regional nodes), N1 (1–3 axillary nodes), N2 (4–9 axillary nodes), N3 (≥10 axillary nodes or supraclavicular/internal mammary).
3. M: M0 (none) vs M1 (distant metastasis).
4. Prognostic Stage incorporates ER, PR, HER2 receptor status and histological grade.",
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
      guidance: "1. Abdomen divided into 13 distinct regions (0 Central, 1 Right upper, 2 Epigastrium, 3 Left upper, 4 Left flank, 5 Left lower, 6 Pelvis, 7 Right lower, 8 Right flank, 9 Upper jejunum, 10 Lower jejunum, 11 Upper ileum, 12 Lower ileum).
2. Lesion Size Score in each region: 0 (No macroscopic disease), 1 (Nodules <0.5 cm), 2 (Nodules 0.5–5.0 cm), 3 (Nodules >5 cm or confluent plaque).
3. Maximum PCI score = 39.
4. In colorectal cancer, PCI > 20 generally precludes complete cytoreduction with HIPEC.",
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
      guidance: "1. R0: Complete macroscopic and microscopic resection with no residual tumor (clear histological margin >1 mm or as defined by organ site).
2. R1: Microscopic residual tumor (tumor at ink or positive pathological margin).
3. R2: Macroscopic residual tumor left behind in situ (gross tumor deposits).
4. RX: Presence of residual tumor cannot be assessed.",
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
      guidance: "1. Parkland formula: Total 24h LR = 4 mL × Weight (kg) × % TBSA (2nd and 3rd degree burns only).
2. Administration: 50% given in the first 8 hours FROM THE TIME OF INJURY; remaining 50% given over the next 16 hours.
3. Titrate fluids to maintain urine output of 0.5–1.0 mL/kg/h in adults.
4. Revised Baux Score: Age + % TBSA + [17 if inhalation injury present].
5. Baux Score > 140 predicts near 100% mortality.",
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
          eq: "Resuscitation Plan (Lactated Ringer's):
• First 8 Hours: " + first8 + " mL (at " + rate1 + " mL/hr)
• Next 16 Hours: " + next16 + " mL (at " + rate2 + " mL/hr)
• Revised Baux Score: " + baux + " (" + bauxRisk + ")
• Titrate strictly to target adult urine output: 0.5–1.0 mL/kg/hr."
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
      guidance: "1. ASA I: A normal healthy patient.
2. ASA II: A patient with mild systemic disease (e.g. well-controlled HTN, DM, smoking, obesity BMI 30-40).
3. ASA III: A patient with severe systemic disease with functional limitation (e.g. poorly controlled DM, stable angina, COPD, morbid obesity BMI ≥40, ESRD on dialysis).
4. ASA IV: A patient with severe systemic disease that is a constant threat to life (e.g. recent MI <3 months, unstable angina, severe valve disease, sepsis).
5. ASA V: A moribund patient who is not expected to survive without the operation (e.g. ruptured aortic aneurysm, massive trauma, intracranial bleed with mass effect).
6. ASA VI: A declared brain-dead patient whose organs are being removed for donor purposes.
7. Emergency modifier 'E' is added for emergent procedures.",
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
      guidance: "1. Uses serum Bilirubin, Creatinine, INR, and Sodium.
2. Dialysis ≥2 times in the last 7 days sets Creatinine to 4.0 mg/dL.
3. Standard MELD = 9.57 × ln(Cr) + 3.78 × ln(Bili) + 11.20 × ln(INR) + 6.43.
4. MELD-Na = MELD + 1.32 × (137 − Na) − [0.033 × MELD × (137 − Na)].
5. In non-transplant general surgery:
   - MELD < 10: Low mortality (~5–10%)
   - MELD 10–14: Moderate mortality (~15–20%)
   - MELD ≥ 15: High risk (>30–50%); elective surgery generally avoided.",
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
      guidance: "1. AJCC 8th Edition cutoff age is 55 years at diagnosis.
2. Age < 55 years: Stage I (Any T, Any N, M0) or Stage II (Any T, Any N, M1).
3. Age ≥ 55 years:
   - Stage I: T1 (≤2 cm) / T2 (>2–4 cm), N0, M0
   - Stage II: T1–T2 with N1, or T3 (gross strap muscle invasion or >4 cm), M0
   - Stage III: T4a (gross invasion of subcutaneous soft tissue, larynx, trachea, esophagus, or recurrent laryngeal nerve), Any N, M0
   - Stage IVA: T4b (prevertebral fascia or encasing carotid/mediastinal vessels), Any N, M0
   - Stage IVB: Any T, Any N, M1 (distant metastases).",
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
      guidance: "1. 3 risk factors (1 point each):
   - Concomitant severe medical illness (cardiovascular, respiratory, renal)
   - Preoperative shock (Systolic BP < 90 mmHg on admission)
   - Duration of perforation > 24 hours prior to surgery
2. Score 0: Mortality < 2%; Score 1: ~10%; Score 2: ~20%–30%; Score 3: > 50%.
3. Guides decision between laparoscopic vs open repair (Graham omental patch).",
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
    },
// ==============================================================
    // 21. RIPASA SCORE FOR ACUTE APPENDICITIS
    // ==============================================================
    {
      id: "ripasaScore",
      cat: "surgery",
      type: "calc",
      name: "RIPASA Score for Acute Appendicitis",
      desc: "High-sensitivity diagnostic score optimized for Asian and Middle Eastern populations to reduce negative appendectomies.",
      organ: "Appendix / RLQ",
      region: "Abdomen / Gastrointestinal",
      subject: "Emergency General Surgery / Appendicitis",
      keywords: ["ripasa", "appendicitis", "alvarado", "asian", "urinanalysis", "leukocytosis"],
      guidance: "1. Evaluates 14 clinical and laboratory variables designed to achieve >95% sensitivity.\n2. Score < 7.0: Low probability of acute appendicitis; observation or alternative diagnosis.\n3. Score 7.5 – 11.5: High probability of acute appendicitis; surgical evaluation / CT scan.\n4. Score > 11.5: Definite acute appendicitis; proceed to appendectomy.",
      contraindications: "In atypical presentations or immunocompromised patients, low threshold for IV-contrast CT remains indicated.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "RIPASA score: a new scoring system for the diagnosis of acute appendicitis",
          citation: "Chong CF, Adi MI, Thien A, et al. Singapore Med J. 2010;51(3):220-225.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/20428744/" }
          ]
        }
      ],
      fields: [
        makeS("gender", "1. Patient Gender", "1", [["1", "Male (+1.0 pt)"], ["0.5", "Female (+0.5 pt)"]]),
        makeS("age", "2. Patient Age Bracket", "1", [["1", "< 40 years (+1.0 pt)"], ["0.5", "≥ 40 years (+0.5 pt)"]]),
        makeS("rlqPain", "3. Right iliac fossa (RIF / RLQ) pain", "0.5", [["0", "No (0 pts)"], ["0.5", "Yes (+0.5 pt)"]]),
        makeS("migr", "4. Pain migration to RIF", "0.5", [["0", "No (0 pts)"], ["0.5", "Yes (+0.5 pt)"]]),
        makeS("anorexia", "5. Anorexia", "1", [["0", "No (0 pts)"], ["1", "Yes (+1.0 pt)"]]),
        makeS("nausea", "6. Nausea and vomiting", "1", [["0", "No (0 pts)"], ["1", "Yes (+1.0 pt)"]]),
        makeS("duration", "7. Duration of symptoms", "1", [["1", "< 48 hours (+1.0 pt)"], ["0.5", "> 48 hours (+0.5 pt)"]]),
        makeS("rifTend", "8. RIF tenderness", "1", [["0", "No (0 pts)"], ["1", "Yes (+1.0 pt)"]]),
        makeS("guarding", "9. Guarding present in RIF", "2", [["0", "No (0 pts)"], ["2", "Yes (+2.0 pts)"]]),
        makeS("rebound", "10. Rebound tenderness in RIF", "1", [["0", "No (0 pts)"], ["1", "Yes (+1.0 pt)"]]),
        makeS("rovsing", "11. Rovsing's sign positive", "2", [["0", "No (0 pts)"], ["2", "Yes (+2.0 pts)"]]),
        makeS("fever", "12. Elevated temperature (37.0°C – 39.0°C)", "1", [["0", "No (0 pts)"], ["1", "Yes (+1.0 pt)"]]),
        makeS("wbc", "13. Leukocytosis (elevated WBC)", "1", [["0", "No (0 pts)"], ["1", "Yes (+1.0 pt)"]]),
        makeS("urinalysis", "14. Urinalysis negative for blood/leukocytes/bacteria", "1", [["0", "Abnormal urinalysis (0 pts)"], ["1", "Negative urinalysis (+1.0 pt)"]])
      ],
      table: {
        headers: ["RIPASA Score", "Appendicitis Probability", "Sensitivity / Specificity", "Clinical Action"],
        rows: [
          { id: "ripasaLow", cols: ["< 7.0 Points", "Low Probability (< 15%)", "High NPV", "Ward observation; re-evaluate in 6 hours or outpatient workup"] },
          { id: "ripasaEquiv", cols: ["7.5 – 11.5 Points", "High Probability (65% – 85%)", "Equivocal / High", "Urgent surgical consultation; contrast-enhanced abdominal CT"] },
          { id: "ripasaHigh", cols: ["> 11.5 Points", "Definite Appendicitis (> 95%)", "Very High Specificity", "Direct surgical pathway: proceed to laparoscopic appendectomy"] }
        ]
      },
      calc: function (v) {
        var score = +v.gender + +v.age + +v.rlqPain + +v.migr + +v.anorexia + +v.nausea + +v.duration + +v.rifTend + +v.guarding + +v.rebound + +v.rovsing + +v.fever + +v.wbc + +v.urinalysis;
        score = Math.round(score * 10) / 10;
        var match = "ripasaLow", status = "Low Probability (<7.0)", plan = "Observation or alternative diagnostic pathway.";

        if (score > 11.5) {
          match = "ripasaHigh"; status = "Definite Acute Appendicitis (>11.5)"; plan = "Immediate general surgery consultation for appendectomy.";
        } else if (score >= 7.5) {
          match = "ripasaEquiv"; status = "High Probability (7.5–11.5)"; plan = "Surgical consult; obtain abdominal CT or graded compression ultrasound.";
        }

        return {
          value: "RIPASA Score: " + score + " Points (" + status + ")",
          matchId: match,
          eq: "Clinical Recommendation: " + plan
        };
      }
    },

    // ==============================================================
    // 22. APPENDICITIS INFLAMMATORY RESPONSE (AIR) SCORE
    // ==============================================================
    {
      id: "airScore",
      cat: "surgery",
      type: "calc",
      name: "AIR Score (Appendicitis Inflammatory Response)",
      desc: "Graded objective scoring incorporating quantitative CRP and left shift to out-perform Alvarado in reducing admissions.",
      organ: "Appendix / Peritoneum",
      region: "Abdomen / Acute Care",
      subject: "Emergency General Surgery / Appendicitis",
      keywords: ["air score", "appendicitis", "crp", "leukocytosis", "rebound", "inflammatory response"],
      guidance: "1. 8 variables with graded points for CRP, WBC, and neutrophil percentage.\n2. Low Risk (0–4 pts): Outpatient discharge with follow-up if symptoms persist.\n3. Intermediate Risk (5–8 pts): Active in-hospital observation, diagnostic imaging (US/CT).\n4. High Risk (9–12 pts): Urgent surgical exploration (laparoscopy).",
      contraindications: "Serial exams essential if initial imaging is non-diagnostic.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "The appendicitis inflammatory response score: a tool for resolving suspicion of appendicitis",
          citation: "Andersson M, Andersson RE. World J Surg. 2008;32(8):1843-1849.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/18553045/" }
          ]
        }
      ],
      fields: [
        makeS("vomiting", "1. Vomiting", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("painRif", "2. Pain in Right Iliac Fossa (RIF)", "1", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("rebound", "3. Rebound tenderness or muscular defense", "1", [
          ["0", "None (0 pts)"],
          ["1", "Light / Mild (+1 pt)"],
          ["2", "Medium (+2 pts)"],
          ["3", "Strong / Severe (+3 pts)"]
        ]),
        makeS("temp", "4. Body temperature ≥ 38.5 °C (101.3 °F)", "0", [["0", "No (< 38.5°C) (0 pts)"], ["1", "Yes (≥ 38.5°C) (+1 pt)"]]),
        makeS("wbc", "5. White Blood Cell Count (WBC, /µL)", "1", [
          ["0", "< 10,000 /µL (0 pts)"],
          ["1", "10,000 – 14,900 /µL (+1 pt)"],
          ["2", "≥ 15,000 /µL (+2 pts)"]
        ]),
        makeS("pmne", "6. Proportion of neutrophils (%)", "1", [
          ["0", "< 70% (0 pts)"],
          ["1", "70% – 84% (+1 pt)"],
          ["2", "≥ 85% (+2 pts)"]
        ]),
        makeS("crp", "7. Serum C-Reactive Protein (CRP, mg/L)", "1", [
          ["0", "< 10 mg/L (0 pts)"],
          ["1", "10 – 49 mg/L (+1 pt)"],
          ["2", "≥ 50 mg/L (+2 pts)"]
        ])
      ],
      table: {
        headers: ["AIR Score", "Risk Stratification", "Negative Appendectomy Rate", "Recommended Clinical Pathway"],
        rows: [
          { id: "airLow", cols: ["0 – 4 Points", "Low Risk", "< 2%", "Outpatient surveillance; return precautions if pain worsens"] },
          { id: "airInt", cols: ["5 – 8 Points", "Intermediate Risk", "15% – 20%", "Inpatient observation with serial exams, pelvic/abdominal ultrasound or CT"] },
          { id: "airHigh", cols: ["9 – 12 Points", "High Risk (Advanced)", "> 70% (High Perforation Risk)", "Direct surgical exploration (diagnostic laparoscopy / appendectomy)"] }
        ]
      },
      calc: function (v) {
        var score = +v.vomiting + +v.painRif + +v.rebound + +v.temp + +v.wbc + +v.pmne + +v.crp;
        var match = "airLow", risk = "Low Risk (0–4)", plan = "Consider outpatient discharge with close safety-net advice.";

        if (score >= 9) {
          match = "airHigh"; risk = "High Risk (9–12)"; plan = "High likelihood of phlegmonous or perforated appendicitis. Proceed to urgent laparoscopy.";
        } else if (score >= 5) {
          match = "airInt"; risk = "Intermediate Risk (5–8)"; plan = "Equivocal findings. Inpatient observation + abdominal ultrasound/CT.";
        }

        return {
          value: "AIR Score: " + score + " / 12 (" + risk + ")",
          matchId: match,
          eq: "Clinical Protocol: " + plan
        };
      }
    },

    // ==============================================================
    // 23. STRASBERG IATROGENIC BILE DUCT INJURY CLASSIFICATION
    // ==============================================================
    {
      id: "strasbergBileDuct",
      cat: "surgery",
      type: "class",
      name: "Strasberg Bile Duct Injury Classification",
      desc: "Categorizes laparoscopic cholecystectomy iatrogenic biliary injuries and major ductal transections.",
      organ: "Cystic Duct / Common Hepatic Duct / Biliary Tree",
      region: "Abdomen / Hepatobiliary",
      subject: "Hepatobiliary Surgery / Laparoscopic Complications",
      keywords: ["strasberg", "bismuth", "bile duct injury", "cholecystectomy", "leak", "hepaticodochoduodenostomy", "roux-en-y"],
      guidance: "1. Type A: Leak from cystic duct or small accessory ducts in liver bed (duct of Luschka).\n2. Type B: Occlusion of part of biliary tree (aberrant right sectoral branch).\n3. Type C: Bile leak from transected aberrant sectoral branch without communication with common duct.\n4. Type D: Lateral injury to major bile duct (> or < 50% circumference).\n5. Type E (Bismuth E1–E5): Circumferential transection of main biliary trunk at or below confluence.",
      contraindications: "Never blindly clip in a bloody, bile-stained Calot triangle; convert to open or abort with drainage and transfer to tertiary HPB center.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "An analysis of the problem of biliary injury during laparoscopic cholecystectomy",
          citation: "Strasberg SM, Hertl M, Soper NJ. J Am Coll Surg. 1995;180(1):101-125.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/8000648/" }
          ]
        }
      ],
      fields: [
        makeS("type", "Biliary Injury Pattern", "A", [
          ["A", "Type A: Cystic duct leak or leak from minor liver bed ducts (Duct of Luschka)"],
          ["B", "Type B: Occlusion / ligation of aberrant right hepatic duct branch"],
          ["C", "Type C: Transection of aberrant right duct with ongoing bile leak (not communicating)"],
          ["D", "Type D: Lateral incision/injury of major common bile duct (partial transection)"],
          ["E1", "Type E1: Transection > 2 cm distal to main hepatic duct confluence"],
          ["E2", "Type E2: Transection < 2 cm distal to confluence"],
          ["E3", "Type E3: Transection flush with confluence; confluence intact"],
          ["E4", "Type E4: Transection destroying confluence; right and left ducts separated"],
          ["E5", "Type E5: Stricture / transection involving confluence AND aberrant right branch"]
        ])
      ],
      table: {
        headers: ["Strasberg Type", "Anatomical Disruption", "Clinical Manifestation", "Definitive Surgical Management"],
        rows: [
          { id: "tA", cols: ["Type A", "Cystic duct / Luschka leak", "Bilioma, localized peritonitis", "ERCP with biliary sphincterotomy ± biliary stent placement"] },
          { id: "tB", cols: ["Type B", "Aberrant sectoral occlusion", "Segmental atrophy / recurrent cholangitis", "Often conservative if asymptomatic; segmental hepatic resection if symptomatic"] },
          { id: "tC", cols: ["Type C", "Aberrant sectoral transection with leak", "Persistent biliary fistula", "Percutaneous drainage or Roux-en-Y hepaticojejunostomy to sectoral duct"] },
          { id: "tD", cols: ["Type D", "Lateral partial CBD injury", "Bile leak / biliary peritonitis", "Primary suture repair over T-tube if small (<50%); Roux-en-Y if extensive"] },
          { id: "tE", cols: ["Type E (E1–E5)", "Major circumferential duct transection", "Complete obstructive jaundice + peritonitis", "Specialized reconstruction: End-to-side Roux-en-Y Hepaticojejunostomy at tertiary center"] }
        ]
      },
      calc: function (v) {
        var t = v.type;
        var match = t === "A" ? "tA" : t === "B" ? "tB" : t === "C" ? "tC" : t === "D" ? "tD" : "tE";
        var plan = (t === "A")
          ? "First-line: Endoscopic Retrograde Cholangiopancreatography (ERCP) with sphincterotomy and plastic stent."
          : (t === "D")
          ? "Lateral injury: If recognized intraoperatively and <50% circumference, primary repair over a T-tube without tension. If >50%, Roux-en-Y reconstruction."
          : (t.indexOf("E") === 0)
          ? "Major Bismuth-Strasberg Type " + t + " transection. Do NOT attempt simple end-to-end ductal anastomosis. Urgent referral to experienced Hepato-Pancreato-Biliary (HPB) surgeon for Roux-en-Y Hepaticojejunostomy."
          : "Drain collection and obtain MRCP to map segmental biliary anatomy.";

        return {
          value: "Strasberg Type " + t + " Bile Duct Injury",
          matchId: match,
          eq: "Management Protocol: " + plan
        };
      }
    },

    // ==============================================================
    // 24. NCCN PANCREATIC CANCER RESECTABILITY CRITERIA
    // ==============================================================
    {
      id: "nccnPancreasResect",
      cat: "surgery",
      type: "class",
      name: "NCCN Pancreatic Adenocarcinoma Resectability",
      desc: "Vascular contact criteria (SMA, Celiac, CHA, SMV/PV) on triphasic CT defining operative resectability.",
      organ: "Pancreas / Celiac / SMA / Portal Vein",
      region: "Abdomen / Retroperitoneum",
      subject: "Surgical Oncology / HPB Surgery",
      keywords: ["pancreas", "nccn", "resectable", "borderline", "sma", "celiac", "portal vein", "whipple"],
      guidance: "1. Resectable: No arterial contact (Celiac, SMA, CHA) and no contact or ≤180° contact with SMV/PV without vein contour irregularity.\n2. Borderline Resectable: Solid tumor contact with SMA ≤180°, or CHA contact without celiac extension, or >180° SMV/PV contact with reconstructible vein, or reconstructible IVC involvement.\n3. Locally Advanced (Unresectable): Solid tumor contact >180° with SMA or Celiac axis, or unreconstructible SMV/PV occlusion.\n4. Metastatic: Distant organ metastases or non-regional nodes.",
      contraindications: "Triphasic multi-detector thin-slice CT with dedicated pancreatic protocol is required before staging resectability.",
      literature: [
        {
          type: "NCCN Clinical Practice Guidelines",
          icon: "📘",
          title: "NCCN Guidelines: Pancreatic Adenocarcinoma",
          citation: "Tempero MA, Malafa MP, Al-Hawary M, et al. J Natl Compr Canc Netw. 2021;19(4):439-473.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/33845462/" }
          ]
        }
      ],
      fields: [
        makeS("arterial", "1. Arterial Vascular Contact (SMA / Celiac / CHA)", "none", [
          ["none", "No arterial contact with SMA, Celiac axis, or CHA"],
          ["cha", "CHA contact without extension to celiac axis or bifurcation"],
          ["sma_part", "SMA or Celiac axis abutment ≤ 180° of vessel circumference"],
          ["sma_encase", "SMA or Celiac axis encasement > 180° of vessel circumference"]
        ]),
        makeS("venous", "2. Venous Contact (Superior Mesenteric Vein / Portal Vein)", "none", [
          ["none", "No venous contact, or ≤ 180° contact without contour irregularity"],
          ["smv_recon", "SMV/PV contact > 180° OR vein distortion, but technically reconstructible"],
          ["smv_unrecon", "Complete SMV/PV occlusion without suitable proximal/distal targets for graft reconstruction"]
        ]),
        makeS("distant", "3. Distant Metastases (Liver, peritoneum, lung, distant nodes)", "0", [
          ["0", "No distant metastases"],
          ["1", "Yes — Distant metastases present"]
        ])
      ],
      table: {
        headers: ["Resectability Status", "Arterial Criteria", "Venous Criteria", "Recommended Clinical Pathway"],
        rows: [
          { id: "res", cols: ["Resectable", "No contact with SMA/Celiac/CHA", "None or ≤180° contact without deformity", "Upfront surgical resection (Pancreaticoduodenectomy / Whipple or distal pancreatectomy)"] },
          { id: "br", cols: ["Borderline Resectable", "≤180° SMA/celiac contact OR reconstructible CHA", "Reconstructible SMV/PV abutment or encasement", "Neoadjuvant chemotherapy (FOLFIRINOX) ± SBRT followed by restaging for surgery"] },
          { id: "la", cols: ["Locally Advanced (Unresectable)", ">180° SMA or celiac axis encasement", "Unreconstructible SMV/PV occlusion", "Definitive systemic chemotherapy / clinical trials; surgery contraindicated"] },
          { id: "met", cols: ["Metastatic", "Any", "Any", "Palliative systemic therapy and symptom control / biliary stenting"] }
        ]
      },
      calc: function (v) {
        var match = "res", verdict = "Resectable Pancreatic Carcinoma";
        var plan = "Candidate for upfront oncologic surgical resection (Whipple or Distal Pancreatectomy) followed by adjuvant chemotherapy.";

        if (v.distant === "1") {
          match = "met"; verdict = "Metastatic Disease (M1)";
          plan = "Surgical resection is contraindicated. Palliative systemic chemotherapy (mFOLFIRINOX or Gemcitabine/Nab-paclitaxel) + biliary stenting as needed.";
        } else if (v.arterial === "sma_encase" || v.venous === "smv_unrecon") {
          match = "la"; verdict = "Locally Advanced / Unresectable";
          plan = "Arterial encasement >180° or non-reconstructible portal venous occlusion. Primary systemic chemotherapy; surgical exploration generally futile.";
        } else if (v.arterial === "cha" || v.arterial === "sma_part" || v.venous === "smv_recon") {
          match = "br"; verdict = "Borderline Resectable Pancreatic Cancer";
          plan = "Indication for Neoadjuvant Chemotherapy (FOLFIRINOX) to downstage tumor and clear margins prior to planned vascular resection.";
        }

        return {
          value: verdict,
          matchId: match,
          eq: "Multidisciplinary Recommendation: " + plan
        };
      }
    },

    // ==============================================================
    // 25. AAST SPLEEN INJURY SCALE (TRAUMA)
    // ==============================================================
    {
      id: "aastSpleen",
      cat: "surgery",
      type: "class",
      name: "AAST Spleen Injury Scale (Trauma)",
      desc: "American Association for the Surgery of Trauma anatomical grading for blunt and penetrating splenic injuries.",
      organ: "Spleen / Splenic Vessels",
      region: "Abdomen / Left Upper Quadrant Trauma",
      subject: "Trauma Surgery / Acute Care Surgery",
      keywords: ["aast", "spleen", "splenic injury", "trauma", "splenectomy", "angioembolization", "hemoperitoneum"],
      guidance: "1. Grade I: Subcapsular hematoma <10% surface area; parenchymal laceration <1 cm depth.\n2. Grade II: Subcapsular hematoma 10–50%; intraparenchymal hematoma <5 cm; laceration 1–3 cm depth.\n3. Grade III: Subcapsular hematoma >50% or ruptured; intraparenchymal hematoma ≥5 cm; laceration >3 cm depth.\n4. Grade IV: Laceration involving segmental or hilar vessels producing devascularization of >25% of spleen.\n5. Grade V: Completely shattered spleen or hilar vascular avulsion devascularizing entire spleen.",
      contraindications: "Hemodynamic instability (refractory to initial 1L crystalloid/blood) dictates emergent exploratory laparotomy regardless of radiographic AAST grade.",
      literature: [
        {
          type: "Official AAST Scale",
          icon: "📘",
          title: "Organ injury scaling 2018 update: Spleen, liver, and kidney",
          citation: "Kozar RA, Crandall M, Shanmuganathan K, et al. J Trauma Acute Care Surg. 2018;85(6):1119-1122.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/30462622/" }
          ]
        }
      ],
      fields: [
        makeS("grade", "Select Anatomical Splenic Injury Pattern (AAST)", "II", [
          ["I", "Grade I: Subcapsular hematoma <10% surface area; laceration <1 cm parenchymal depth"],
          ["II", "Grade II: Subcapsular hematoma 10%–50%; laceration 1–3 cm parenchymal depth"],
          ["III", "Grade III: Subcapsular hematoma >50% or expanding; laceration >3 cm parenchymal depth"],
          ["IV", "Grade IV: Laceration involving segmental or hilar vessels with >25% devascularization"],
          ["V", "Grade V: Completely shattered spleen or total hilar vascular devascularization"]
        ]),
        makeS("blush", "CT Intravenous Contrast Extravasation ('Vascular Blush')?", "0", [
          ["0", "No active extravasation on CT"],
          ["1", "Yes — Active arterial contrast extravasation present"]
        ]),
        makeS("hemodynamics", "Patient Hemodynamic Stability", "stable", [
          ["stable", "Hemodynamically stable (responded to resuscitation)"],
          ["unstable", "Hemodynamically unstable (persistent hypotension / non-responder)"]
        ])
      ],
      table: {
        headers: ["AAST Grade", "Parenchymal Anatomy", "Non-Operative Management (NOM)", "Surgical / Angiographic Action"],
        rows: [
          { id: "g1", cols: ["Grade I – II", "Superficial laceration / small hematoma", "Success rate > 95%", "Admit for bed rest, serial abdominal exams, and serial hematocrits"] },
          { id: "g3", cols: ["Grade III", "Deep laceration (>3 cm) / large hematoma", "Success rate ~ 85%", "ICU / step-down monitoring; angioembolization if contrast blush present"] },
          { id: "g4", cols: ["Grade IV", "Segmental vessel devascularization (>25%)", "Selective NOM feasible in stable", "Splenic artery angioembolization; prepare for operative intervention"] },
          { id: "g5", cols: ["Grade V / Shock", "Shattered spleen / hilar avulsion", "NOM rarely successful", "EMERGENT LAPAROTOMY: Splenectomy + post-splenectomy vaccine prophylaxis"] }
        ]
      },
      calc: function (v) {
        var g = v.grade;
        var blush = v.blush === "1";
        var unstable = v.hemodynamics === "unstable";
        var match = "g" + (g === "I" || g === "II" ? "1" : g === "III" ? "3" : g === "IV" ? "4" : "5");

        if (unstable) {
          return {
            value: "AAST Grade " + g + " (HEMODYNAMICALLY UNSTABLE)",
            matchId: "g5",
            eq: "SURGICAL EMERGENCY: Persistent hypotension in splenic trauma mandates immediate exploratory laparotomy and splenectomy. Do not transport to CT suite."
          };
        }

        var plan = "";
        if (blush) {
          plan = "Active arterial contrast blush identified: Urgent transcatheter splenic artery angioembolization (SAE) indicated to facilitate successful non-operative management.";
        } else if (g === "IV" || g === "V") {
          plan = "High-grade splenic injury (Grade " + g + "). Intensive care unit monitoring, serial hemoglobin checks, and low threshold for angiographic embolization or surgery.";
        } else {
          plan = "Non-Operative Management (NOM) supported. Bed rest, serial physical exams, and hemoglobin surveillance every 6 hours.";
        }

        return {
          value: "AAST Grade " + g + " Splenic Trauma (Stable)",
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 26. AAST LIVER INJURY SCALE (TRAUMA)
    // ==============================================================
    {
      id: "aastLiver",
      cat: "surgery",
      type: "class",
      name: "AAST Liver Injury Scale (Trauma)",
      desc: "Anatomical classification for hepatic parenchymal and juxtahepatic venous injuries.",
      organ: "Liver / Hepatic Veins / IVC",
      region: "Abdomen / Right Upper Quadrant Trauma",
      subject: "Trauma Surgery / Acute Care Surgery",
      keywords: ["aast", "liver", "hepatic trauma", "pringle maneuver", "angioembolization", "perihepatic packing"],
      guidance: "1. Grade I: Subcapsular hematoma <10% surface area; laceration <1 cm parenchymal depth.\n2. Grade II: Subcapsular hematoma 10%–50%; laceration 1–3 cm depth, <10 cm length.\n3. Grade III: Subcapsular hematoma >50% or expanding; laceration >3 cm depth.\n4. Grade IV: Parenchymal disruption involving 25%–75% of hepatic lobe or 1–3 Couinaud segments.\n5. Grade V: Parenchymal disruption >75% of hepatic lobe OR juxtahepatic venous injury (retrohepatic IVC / major central hepatic veins).\n6. Grade VI: Hepatic avulsion.",
      contraindications: "Juxtahepatic venous injuries have catastrophic mortality; temporary perihepatic packing and damage control laparotomy are standard.",
      literature: [
        {
          type: "Official AAST Scale",
          icon: "📘",
          title: "Organ injury scaling 2018 update: Spleen, liver, and kidney",
          citation: "Kozar RA, Crandall M, Shanmuganathan K, et al. J Trauma Acute Care Surg. 2018;85(6):1119-1122.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/30462622/" }
          ]
        }
      ],
      fields: [
        makeS("grade", "Select Anatomical Hepatic Injury Pattern (AAST)", "II", [
          ["I", "Grade I: Hematoma <10% surface area; laceration <1 cm parenchymal depth"],
          ["II", "Grade II: Hematoma 10%–50%; laceration 1–3 cm depth, <10 cm length"],
          ["III", "Grade III: Hematoma >50% or ruptured; laceration >3 cm parenchymal depth"],
          ["IV", "Grade IV: Parenchymal disruption involving 25%–75% of hepatic lobe (1–3 segments)"],
          ["V", "Grade V: Disruption >75% of lobe OR Juxtahepatic venous injury (retrohepatic IVC / central hepatic veins)"],
          ["VI", "Grade VI: Hepatic avulsion (incompatible with survival without transplant)"]
        ]),
        makeS("pringle", "Intraoperative Hemorrhage responsive to Pringle Maneuver?", "na", [
          ["na", "Not evaluated intraoperatively / Non-operative management"],
          ["yes", "Yes: Bleeding ceases with Pringle clamp (portal vein / hepatic artery injury)"],
          ["no", "No: Bleeding continues despite Pringle clamp (retrohepatic IVC / hepatic venous injury)"]
        ])
      ],
      table: {
        headers: ["AAST Grade", "Pathology", "Operative Strategy", "Damage Control Modality"],
        rows: [
          { id: "l1", cols: ["Grade I – II", "Superficial capsular laceration", "Non-operative management (>90% success)", "Observation, serial hemoglobin, bed rest"] },
          { id: "l3", cols: ["Grade III", "Deep laceration (>3 cm)", "Non-operative in stable; embolization if blush", "Topical hemostatics, cautery, or transcatheter embolization"] },
          { id: "l4", cols: ["Grade IV", "Lobar disruption (25%–75%)", "Resuscitative laparotomy if unstable", "Perihepatic packing, Pringle maneuver, tractotomy with deep suture ligation"] },
          { id: "l5", cols: ["Grade V – VI", "Juxtahepatic venous tear / central rupture", "Damage Control Laparotomy", "Tight 4-quadrant perihepatic packing, temporary abdominal closure, ICU resuscitation"] }
        ]
      },
      calc: function (v) {
        var g = v.grade;
        var match = (g === "I" || g === "II") ? "l1" : g === "III" ? "l3" : g === "IV" ? "l4" : "l5";
        var plan = "";

        if (g === "V" || g === "VI") {
          plan = "Grade V/VI Complex Hepatic Injury: Extreme risk of exsanguination. Proceed with Damage Control Surgery: tight perihepatic gauze packing, Pringle clamp, and avoid direct exploration of retrohepatic retroperitoneal hematoma. Rapid transfer to ICU.";
        } else if (v.pringle === "no") {
          plan = "Hemorrhage refractory to Pringle clamp suggests major hepatic vein or retrohepatic inferior vena cava injury. Pack liver tightly without mobilizing retrohepatic plane.";
        } else {
          plan = "Stable Grade " + g + " injury is managed non-operatively with bed rest, intensive monitoring, and selective hepatic artery embolization if contrast extravasation occurs.";
        }

        return {
          value: "AAST Grade " + g + " Hepatic Trauma",
          matchId: match,
          eq: "Clinical Action: " + plan
        };
      }
    },

    // ==============================================================
    // 27. ARISCAT POSTOPERATIVE PULMONARY COMPLICATIONS SCORE
    // ==============================================================
    {
      id: "ariscatScore",
      cat: "surgery",
      type: "calc",
      name: "ARISCAT Score for Postoperative Pulmonary Complications",
      desc: "Multicenter validated risk score predicting postoperative respiratory failure, pneumonia, and pleural effusion.",
      organ: "Lungs / Diaphragm / Airway",
      region: "Preoperative / Thoracoabdominal",
      subject: "Preoperative Assessment / General Surgery",
      keywords: ["ariscat", "pulmonary", "complication", "pneumonia", "respiratory failure", "preop", "atelectasis"],
      guidance: "1. 7 independent clinical variables predicting PPCs.\n2. Low Risk (< 26 pts): PPC incidence ~1.6%.\n3. Intermediate Risk (26–44 pts): PPC incidence ~13.3%.\n4. High Risk (≥ 45 pts): PPC incidence ~42.1%.\n5. High-risk patients benefit from lung-protective ventilation, incentive spirometry, and early chest physiotherapy.",
      contraindications: "Does not score preexisting tracheostomy or home mechanical ventilation.",
      literature: [
        {
          type: "Seminal Multicenter Study",
          icon: "📄",
          title: "Prediction of postoperative pulmonary complications in a population-based surgical cohort",
          citation: "Canet J, Gallart L, Gomar C, et al. Anesthesiology. 2010;113(6):1338-1350.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/21045639/" }
          ]
        }
      ],
      fields: [
        makeS("age", "1. Patient Age", "0", [
          ["0", "≤ 50 years (0 pts)"],
          ["3", "51 – 80 years (+3 pts)"],
          ["16", "> 80 years (+16 pts)"]
        ]),
        makeS("spo2", "2. Preoperative SpO2 breathing room air", "0", [
          ["0", "≥ 96% on room air (0 pts)"],
          ["8", "91% – 95% (+8 pts)"],
          ["24", "≤ 90% (+24 pts)"]
        ]),
        makeS("uri", "3. Respiratory infection in the last 1 month", "0", [
          ["0", "No (0 pts)"],
          ["17", "Yes (+17 pts)"]
        ]),
        makeS("anemia", "4. Preoperative Anemia (Hemoglobin ≤ 10 g/dL)", "0", [
          ["0", "No (> 10 g/dL) (0 pts)"],
          ["11", "Yes (≤ 10 g/dL) (+11 pts)"]
        ]),
        makeS("incision", "5. Surgical Incision Site", "15", [
          ["0", "Peripheral / Superficial (0 pts)"],
          ["15", "Upper abdominal incision (+15 pts)"],
          ["24", "Intrathoracic procedure (+24 pts)"]
        ]),
        makeS("duration", "6. Expected Duration of Surgery", "16", [
          ["0", "< 2 hours (0 pts)"],
          ["16", "2 to 3 hours (+16 pts)"],
          ["23", "> 3 hours (+23 pts)"]
        ]),
        makeS("emergency", "7. Emergency Surgery", "0", [
          ["0", "Elective (0 pts)"],
          ["8", "Emergency procedure (+8 pts)"]
        ])
      ],
      table: {
        headers: ["ARISCAT Score", "Risk Tier", "PPC Incidence Rate", "Perioperative Respiratory Optimization"],
        rows: [
          { id: "aLow", cols: ["< 26 Points", "Low Risk", "1.6%", "Standard routine extubation and ward recovery"] },
          { id: "aMod", cols: ["26 – 44 Points", "Intermediate Risk", "13.3%", "Incentive spirometry, early mobilization, multimodal thoracic analgesia"] },
          { id: "aHigh", cols: ["≥ 45 Points", "High Risk", "42.1%", "High risk of postop respiratory failure! Consider HDU/ICU bed and postoperative CPAP"] }
        ]
      },
      calc: function (v) {
        var score = +v.age + +v.spo2 + +v.uri + +v.anemia + +v.incision + +v.duration + +v.emergency;
        var match = "aLow", risk = "Low Risk (<26)", ppc = "1.6%";

        if (score >= 45) {
          match = "aHigh"; risk = "High Risk (≥45)"; ppc = "42.1%";
        } else if (score >= 26) {
          match = "aMod"; risk = "Intermediate Risk (26–44)"; ppc = "13.3%";
        }

        var rec = score >= 45
          ? "High PPC risk. Intraoperative lung-protective ventilation (low tidal volume 6 mL/kg, PEEP). Plan postoperative high-dependency monitoring and epidural analgesia."
          : "Standard perioperative pulmonary precautions and postoperative incentive spirometry.";

        return {
          value: "ARISCAT Score: " + score + " Points (" + risk + ")",
          matchId: match,
          eq: "Predicted Postoperative Pulmonary Complication Rate: " + ppc + ".\n" + rec
        };
      }
    },

    // ==============================================================
    // 28. FORREST CLASSIFICATION OF PEPTIC ULCER HEMORRHAGE
    // ==============================================================
    {
      id: "forrestClassification",
      cat: "surgery",
      type: "class",
      name: "Forrest Classification of Peptic Ulcer Hemorrhage",
      desc: "Endoscopic classification of upper gastrointestinal ulcer bleeding to predict rebleeding risk and guide endoscopic hemostasis.",
      organ: "Stomach / Duodenum / Gastric Mucosa",
      region: "Abdomen / Upper GI Bleed",
      subject: "Upper GI Surgery / Surgical Endoscopy",
      keywords: ["forrest", "peptic ulcer", "gi bleed", "endoscopy", "spurting", "visible vessel", "hemoclip"],
      guidance: "1. Grade Ia: Spurting arterial hemorrhage (active bleeding).\n2. Grade Ib: Oozing hemorrhage without spurting.\n3. Grade IIa: Non-bleeding visible vessel (pigmented protuberance).\n4. Grade IIb: Adherent clot covering ulcer base.\n5. Grade IIc: Flat pigmented spot (hematin deposit).\n6. Grade III: Clean ulcer base without signs of recent bleeding.\n7. Grades Ia, Ib, IIa require dual endoscopic therapy (e.g. epinephrine injection + hemoclip or thermal coagulation).",
      contraindications: "Forceful washing of adherent clot without ready availability of endoscopic clips and thermal probes may provoke torrential hemorrhage.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Endoscopy in gastrointestinal bleeding",
          citation: "Forrest JA, Finlayson ND, Shearman DJ. Lancet. 1974;2(7877):394-397.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/4136718/" }
          ]
        }
      ],
      fields: [
        makeS("grade", "Endoscopic Ulcer Stigmata", "IIa", [
          ["Ia", "Forrest Ia: Active arterial spurting hemorrhage"],
          ["Ib", "Forrest Ib: Active oozing hemorrhage without arterial spurt"],
          ["IIa", "Forrest IIa: Non-bleeding visible vessel (pigmented protuberance)"],
          ["IIb", "Forrest IIb: Adherent clot covering the ulcer base"],
          ["IIc", "Forrest IIc: Flat pigmented spot on ulcer base"],
          ["III", "Forrest III: Clean ulcer base with no vascular stigmata"]
        ])
      ],
      table: {
        headers: ["Forrest Class", "Ulcer Stigmata", "Rebleeding Risk", "Endoscopic & Medical Action"],
        rows: [
          { id: "fIa", cols: ["Class Ia", "Spurting hemorrhage", "85% – 90%", "EMERGENT DUAL THERAPY: Epinephrine + Hemoclip / Gold probe + High-dose IV PPI"] },
          { id: "fIb", cols: ["Class Ib", "Oozing hemorrhage", "50% – 60%", "DUAL THERAPY: Endoscopic hemostasis + continuous IV PPI infusion"] },
          { id: "fIIa", cols: ["Class IIa", "Non-bleeding visible vessel", "40% – 50%", "DUAL THERAPY: Mechanical hemoclip or thermal coagulation + IV PPI"] },
          { id: "fIIb", cols: ["Class IIb", "Adherent clot", "25% – 30%", "Careful targeted clot irrigation; treat underlying visible vessel if uncovered"] },
          { id: "fIIc", cols: ["Class IIc", "Flat pigmented spot", "7% – 10%", "No endoscopic intervention required; oral or IV PPI therapy"] },
          { id: "fIII", cols: ["Class III", "Clean ulcer base", "< 3% – 5%", "No endoscopic therapy; safe for early oral intake and discharge on oral PPI"] }
        ]
      },
      calc: function (v) {
        var g = v.grade;
        var match = "f" + g;
        var plan = "";

        if (g === "Ia" || g === "Ib" || g === "IIa") {
          plan = "High risk for rebleeding (" + (g === "Ia" ? "85–90%" : g === "Ib" ? "50–60%" : "40–50%") + "). Mandatory Dual Endoscopic Hemostasis: Epinephrine injection PLUS thermal coaptation or mechanical Through-The-Scope (TTS) hemoclips. Initiate high-dose IV Pantoprazole 80 mg bolus followed by 8 mg/hr infusion for 72 hours.";
        } else if (g === "IIb") {
          plan = "Intermediate rebleeding risk (~25–30%). Targeted irrigation and cold snare shave of clot with dual hemostasis readiness.";
        } else {
          plan = "Low rebleeding risk (<5–10%). Endoscopic hemostasis is NOT indicated. Treat with standard oral proton pump inhibitors (PPI) and test for Helicobacter pylori.";
        }

        return {
          value: "Forrest Class " + g + " Ulcer Bleed",
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 29. GLASGOW-BLATCHFORD BLEEDING SCORE (GBS)
    // ==============================================================
    {
      id: "glasgowBlatchford",
      cat: "surgery",
      type: "calc",
      name: "Glasgow–Blatchford Bleeding Score (GBS)",
      desc: "Pre-endoscopic risk stratification for acute upper gastrointestinal bleeding to identify low-risk outpatients vs those requiring urgent endoscopy.",
      organ: "Upper Gastrointestinal / Vasculature",
      region: "Abdomen / Emergency Department",
      subject: "Emergency General Surgery / Endoscopy",
      keywords: ["glasgow", "blatchford", "gbs", "upper gi bleed", "blood urea nitrogen", "hemoglobin", "melena"],
      guidance: "1. Calculated prior to endoscopy using only clinical and laboratory variables.\n2. Score = 0: Extremely low risk (<0.5% intervention rate); safe for discharge without emergency in-hospital endoscopy.\n3. Score ≥ 1: Inpatient admission required.\n4. Score ≥ 6: High risk (>50% risk of needing transfusion, endoscopic hemostasis, or surgical intervention).",
      contraindications: "Does not replace clinical judgement if patient has suspected esophageal varices with massive hematemesis.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "A risk score to predict need for treatment for upper-gastrointestinal haemorrhage",
          citation: "Blatchford O, Murray WR, Blatchford M. Lancet. 2000;356(9238):1318-1321.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/11073021/" }
          ]
        }
      ],
      fields: [
        makeS("bun", "1. Blood Urea Nitrogen (BUN, mg/dL)", "0", [
          ["0", "< 18.2 mg/dL (< 6.5 mmol/L) (0 pts)"],
          ["2", "18.2 – 22.3 mg/dL (6.5 – 7.9 mmol/L) (+2 pts)"],
          ["3", "22.4 – 27.9 mg/dL (8.0 – 9.9 mmol/L) (+3 pts)"],
          ["4", "28.0 – 69.9 mg/dL (10.0 – 24.9 mmol/L) (+4 pts)"],
          ["6", "≥ 70.0 mg/dL (≥ 25.0 mmol/L) (+6 pts)"]
        ]),
        makeS("hbMale", "2. Hemoglobin (Men)", "0", [
          ["0", "Hb ≥ 13.0 g/dL or Female patient (0 pts)"],
          ["1", "Hb 12.0 – 12.9 g/dL (+1 pt)"],
          ["3", "Hb 10.0 – 11.9 g/dL (+3 pts)"],
          ["6", "Hb < 10.0 g/dL (+6 pts)"]
        ]),
        makeS("hbFem", "3. Hemoglobin (Women)", "0", [
          ["0", "Hb ≥ 12.0 g/dL or Male patient (0 pts)"],
          ["1", "Hb 10.0 – 11.9 g/dL (+1 pt)"],
          ["6", "Hb < 10.0 g/dL (+6 pts)"]
        ]),
        makeS("sbp", "4. Systolic Blood Pressure (mmHg)", "0", [
          ["0", "≥ 110 mmHg (0 pts)"],
          ["1", "100 – 109 mmHg (+1 pt)"],
          ["2", "90 – 99 mmHg (+2 pts)"],
          ["3", "< 90 mmHg (+3 pts)"]
        ]),
        makeS("hr", "5. Pulse rate ≥ 100 bpm", "0", [["0", "No (< 100 bpm) (0 pts)"], ["1", "Yes (≥ 100 bpm) (+1 pt)"]]),
        makeS("melena", "6. Presentation with melena", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("syncope", "7. Presentation with syncope", "0", [["0", "No (0 pts)"], ["2", "Yes (+2 pts)"]]),
        makeS("hepatic", "8. Known hepatic disease (cirrhosis/portal HTN)", "0", [["0", "No (0 pts)"], ["2", "Yes (+2 pts)"]]),
        makeS("cardiac", "9. Known cardiac failure", "0", [["0", "No (0 pts)"], ["2", "Yes (+2 pts)"]])
      ],
      table: {
        headers: ["GBS Score", "Risk Stratification", "Need for Intervention / Transfusion", "Recommended Pathway"],
        rows: [
          { id: "gbs0", cols: ["Score 0", "Very Low Risk", "< 0.5%", "Safe for outpatient management without admission; routine elective endoscopy"] },
          { id: "gbsLow", cols: ["Score 1 – 5", "Intermediate Risk", "10% – 25%", "Inpatient hospital admission, IV PPI, in-hospital diagnostic endoscopy within 24h"] },
          { id: "gbsHigh", cols: ["Score ≥ 6", "High Risk", "> 50% – 70%", "Urgent resuscitation, blood transfusion, emergent therapeutic endoscopy within 12h"] }
        ]
      },
      calc: function (v) {
        var score = +v.bun + +v.hbMale + +v.hbFem + +v.sbp + +v.hr + +v.melena + +v.syncope + +v.hepatic + +v.cardiac;
        var match = "gbs0", status = "Score 0 (Very Low Risk)";
        var action = "Patient meets all low-risk criteria. Suitable for outpatient workup.";

        if (score >= 6) {
          match = "gbsHigh"; status = "Score " + score + " (High Risk)";
          action = "High probability of active bleeding requiring transfusion or endoscopic hemostasis. Urgent inpatient admission and endoscopy within 12 hours.";
        } else if (score >= 1) {
          match = "gbsLow"; status = "Score " + score + " (Intermediate Risk)";
          action = "Hospital admission required. Perform endoscopy within 24 hours.";
        }

        return {
          value: "GBS Score: " + score + " / 23 (" + status + ")",
          matchId: match,
          eq: "Clinical Decision: " + action
        };
      }
    },

    // ==============================================================
    // 30. SVS WIfI CLASSIFICATION (WOUND, ISCHEMIA, FOOT INFECTION)
    // ==============================================================
    {
      id: "svsWifiScore",
      cat: "surgery",
      type: "class",
      name: "SVS WIfI Classification (Limb Threatening Ischemia)",
      desc: "Society for Vascular Surgery classification predicting 1-year amputation risk and benefit of revascularization in diabetic foot and CLTI.",
      organ: "Arteries / Lower Limb / Foot",
      region: "Vascular Surgery / Diabetic Foot",
      subject: "Vascular Surgery / Limb Preservation",
      keywords: ["wifi", "svs", "amputation", "ischemia", "diabetic foot", "clti", "revascularization"],
      guidance: "1. Evaluates 3 distinct clinical axes graded 0 to 3:\n   - Wound (W): 0 (no ulcer/pain), 1 (shallow ulcer on distal foot), 2 (deep ulcer to bone/gangrene limited to digits), 3 (extensive ulcer/gangrene to midfoot or calcaneus).\n   - Ischemia (I): Ankle-Brachial Index (ABI) or Toe Pressure (TP): 0 (ABI ≥0.80, TP ≥60), 1 (ABI 0.60–0.79, TP 40–59), 2 (ABI 0.40–0.59, TP 30–39), 3 (ABI <0.40, TP <30).\n   - Foot Infection (fI): 0 (uninfected), 1 (mild cellulitis <2 cm), 2 (moderate cellulitis >2 cm/fascial abscess), 3 (SIRS / septic shock).\n2. Yields 1-year amputation risk (Very low, Low, Moderate, High) and Revascularization benefit.",
      contraindications: "Calcified vessels (ABI >1.30) mandate using toe pressures (TP) or transcutaneous oxygen (TcPO2) instead of ankle pressures.",
      literature: [
        {
          type: "Official SVS Classification",
          icon: "📘",
          title: "The Society for Vascular Surgery Lower Extremity Threatened Limb Classification System",
          citation: "Mills JL Sr, Conte MS, Armstrong DG, et al. J Vasc Surg. 2014;59(1):220-234.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/24126108/" }
          ]
        }
      ],
      fields: [
        makeS("wound", "1. Wound Grade (W)", "1", [
          ["0", "W-0: No ulcer (ischemic rest pain only)"],
          ["1", "W-1: Minimal, shallow ulcer on distal leg/foot, no gangrene"],
          ["2", "W-2: Deep ulcer with exposed bone/tendon, gangrene limited to digits"],
          ["3", "W-3: Extensive deep ulcer, gangrene extending to midfoot/hindfoot"]
        ]),
        makeS("ischemia", "2. Ischemia Grade (I)", "1", [
          ["0", "I-0: ABI ≥ 0.80 (Toe Pressure ≥ 60 mmHg)"],
          ["1", "I-1: ABI 0.60 – 0.79 (Toe Pressure 40 – 59 mmHg)"],
          ["2", "I-2: ABI 0.40 – 0.59 (Toe Pressure 30 – 39 mmHg)"],
          ["3", "I-3: ABI < 0.40 (Toe Pressure < 30 mmHg)"]
        ]),
        makeS("infection", "3. Foot Infection Grade (fI)", "1", [
          ["0", "fI-0: Uninfected, no signs of inflammation"],
          ["1", "fI-1: Mild (local cellulitis ≤ 2 cm, superficial)"],
          ["2", "fI-2: Moderate (cellulitis > 2 cm, deep tissue involvement, abscess)"],
          ["3", "fI-3: Severe (Systemic Inflammatory Response Syndrome / Sepsis)"]
        ])
      ],
      table: {
        headers: ["WIfI Clinical Stage", "W-I-fI Profile", "1-Year Major Amputation Risk", "Benefit of Revascularization"],
        rows: [
          { id: "wStage1", cols: ["Clinical Stage 1", "Low W, Low I, Low fI", "Very Low (< 5%)", "Very low benefit; local debridement and wound care"] },
          { id: "wStage2", cols: ["Clinical Stage 2", "Moderate single domain", "Low (~ 10%)", "Low to moderate benefit based on healing progress"] },
          { id: "wStage3", cols: ["Clinical Stage 3", "High single or moderate multiple", "Moderate (~ 25%)", "Moderate to high benefit; urgent vascular consultation"] },
          { id: "wStage4", cols: ["Clinical Stage 4", "Severe multi-domain (W3, I3, or fI3)", "High (> 50%)", "HIGH BENEFIT: Emergent revascularization + surgical debridement"] }
        ]
      },
      calc: function (v) {
        var w = +v.wound, i = +v.ischemia, fi = +v.infection;
        var sum = w + i + fi;
        var match = "wStage1", stg = "Stage 1 (Very Low Amputation Risk)", ben = "Local wound care; revascularization rarely required.";

        if (w === 3 || i === 3 || fi === 3 || sum >= 6) {
          match = "wStage4"; stg = "Stage 4 (High Amputation Risk >50%)";
          ben = "Emergent revascularization (bypass or endovascular angioplasty) combined with surgical drainage/debridement.";
        } else if (sum >= 4) {
          match = "wStage3"; stg = "Stage 3 (Moderate Amputation Risk ~25%)";
          ben = "High benefit of revascularization to restore pulsatile straight-line flow to the foot.";
        } else if (sum >= 2) {
          match = "wStage2"; stg = "Stage 2 (Low Amputation Risk ~10%)";
          ben = "Optimize glycemic control, debridement, and offloading; consider revascularization if non-healing at 4 weeks.";
        }

        return {
          value: "WIfI Score: W" + w + "-I" + i + "-fI" + fi + " (" + stg + ")",
          matchId: match,
          eq: "Limb Preservation Strategy: " + ben
        };
      }
    },

    // ==============================================================
    // 31. INTRA-ABDOMINAL HYPERTENSION & COMPARTMENT SYNDROME (WSACS)
    // ==============================================================
    {
      id: "wsacsIahAcs",
      cat: "surgery",
      type: "calc",
      name: "Intra-Abdominal Hypertension & Compartment Syndrome (WSACS)",
      desc: "Calculates Abdominal Perfusion Pressure (APP) and stages Intra-Abdominal Hypertension (IAH) via transvesical bladder pressure.",
      organ: "Peritoneal Cavity / Bladder / Renal Vasculature",
      region: "Critical Care / Postoperative Abdomen",
      subject: "Acute Care Surgery / Surgical ICU",
      keywords: ["wsacs", "iah", "acs", "abdominal compartment syndrome", "bladder pressure", "decompressive laparotomy", "app"],
      guidance: "1. Transvesical bladder pressure measured in supine position at end-expiration (instillation of ≤25 mL saline).\n2. Normal IAP: 5–7 mmHg in healthy adults (up to 12 mmHg in ICU patients).\n3. Intra-Abdominal Hypertension (IAH): Sustained IAP ≥ 12 mmHg.\n   - Grade I: 12–15 mmHg\n   - Grade II: 16–20 mmHg\n   - Grade III: 21–25 mmHg\n   - Grade IV: > 25 mmHg\n4. Abdominal Compartment Syndrome (ACS): Sustained IAP > 20 mmHg with NEW organ failure/dysfunction (oliguria, hypoxemia, hypotension).\n5. Abdominal Perfusion Pressure (APP) = MAP − IAP (target ≥ 60 mmHg).",
      contraindications: "Neurogenic bladder, pelvic hematoma, or external bladder compression can falsely elevate transvesical measurements.",
      literature: [
        {
          type: "WSACS Consensus Guidelines",
          icon: "📘",
          title: "Intra-abdominal hypertension and the abdominal compartment syndrome: updated consensus definitions",
          citation: "Kirkpatrick AW, Roberts DJ, De Waele J, et al. Intensive Care Med. 2013;39(7):1190-1206.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/23673399/" }
          ]
        }
      ],
      fields: [
        makeN("iap", "Intra-Abdominal Pressure via Bladder (IAP, mmHg)", 18, { min: 0, max: 60, step: 1 }),
        makeN("map", "Mean Arterial Pressure (MAP, mmHg)", 75, { min: 30, max: 150, step: 1 }),
        makeS("organFail", "New or Worsening Organ Failure? (Oliguria, increased peak airway pressure, shock)", "0", [
          ["0", "No new organ dysfunction"],
          ["1", "Yes — New organ failure present (renal, respiratory, or cardiovascular)"]
        ])
      ],
      table: {
        headers: ["Category", "IAP Range", "APP Target", "Therapeutic Intervention"],
        rows: [
          { id: "normal", cols: ["Normal / Mild", "< 12 mmHg", "APP ≥ 60 mmHg", "Maintain standard ICU fluid balance; no decompressive therapy needed"] },
          { id: "g1_2", cols: ["IAH Grade I – II", "12 – 20 mmHg", "APP ≥ 60 mmHg", "Evacuate intraluminal contents (NG tube, rectal tube), optimize sedation/analgesia"] },
          { id: "g3_4", cols: ["IAH Grade III – IV", "> 20 mmHg (no failure)", "APP often < 60", "Neuromuscular blockade, paracentesis if fluid present; prepare for decompression"] },
          { id: "acsAlert", cols: ["ABDOMINAL COMPARTMENT SYNDROME", "> 20 mmHg + Organ Failure", "APP < 60 mmHg", "SURGICAL EMERGENCY: Emergent Decompressive Laparotomy with temporary open abdomen"] }
        ]
      },
      calc: function (v) {
        var iap = +v.iap;
        var map = +v.map;
        var app = map - iap;
        var hasFail = v.organFail === "1";

        var match = "normal", dx = "Normal IAP (<12 mmHg)", action = "Adequate perfusion.";

        if (iap > 20 && hasFail) {
          match = "acsAlert";
          dx = "ABDOMINAL COMPARTMENT SYNDROME (ACS)";
          action = "SURGICAL EMERGENCY: Decompressive laparotomy with temporary open abdominal closure (e.g. Bogota bag or negative-pressure temporary closure).";
        } else if (iap > 25) {
          match = "g3_4"; dx = "IAH Grade IV (> 25 mmHg)";
          action = "Paracentesis for free fluid, deep sedation/paralysis. If organ failure emerges, immediate surgical decompression.";
        } else if (iap >= 21) {
          match = "g3_4"; dx = "IAH Grade III (21–25 mmHg)";
          action = "Decompress stomach and colon; avoid positive fluid balance; monitor urine output hourly.";
        } else if (iap >= 16) {
          match = "g1_2"; dx = "IAH Grade II (16–20 mmHg)";
          action = "Nasogastric/colonic decompression, prokinetics, optimize sedation.";
        } else if (iap >= 12) {
          match = "g1_2"; dx = "IAH Grade I (12–15 mmHg)";
          action = "Initial conservative non-operative interventions and serial 4-hour IAP measurements.";
        }

        return {
          value: "IAP: " + iap + " mmHg | APP: " + app + " mmHg (" + dx + ")",
          matchId: match,
          eq: "Abdominal Perfusion Pressure: APP = MAP (" + map + ") − IAP (" + iap + ") = " + app + " mmHg (Goal ≥ 60 mmHg).\n" + action
        };
      }
    },

    // ==============================================================
    // 32. SHOCK INDEX & ABC SCORE FOR MASSIVE TRANSFUSION
    // ==============================================================
    {
      id: "shockIndexAbcTrauma",
      cat: "surgery",
      type: "calc",
      name: "Shock Index & ABC Score for Massive Transfusion",
      desc: "Rapid bedside trauma calculator predicting hypovolemic shock, occult bleeding, and requirement for Massive Transfusion Protocol (MTP).",
      organ: "Systemic / Coagulation / Intravascular Volume",
      region: "Trauma Bay / Resuscitation",
      subject: "Trauma Surgery / Acute Hemostasis",
      keywords: ["shock index", "abc score", "massive transfusion", "mtp", "trauma", "fast", "pelvic fracture"],
      guidance: "1. Shock Index (SI) = Heart Rate ÷ Systolic BP. Normal is 0.5–0.7. SI ≥ 0.9 suggests significant hypovolemia and occult bleeding.\n2. ABC Score (Assessment of Blood Consumption): 4 non-weighted criteria (1 point each):\n   - Penetrating mechanism (1 pt)\n   - Emergency Department SBP ≤ 90 mmHg (1 pt)\n   - Emergency Department HR ≥ 120 bpm (1 pt)\n   - Positive FAST exam (fluid in abdomen/pericardium) (1 pt)\n3. ABC Score ≥ 2 triggers activation of Massive Transfusion Protocol (1:1:1 pRBC:FFP:Platelets).",
      contraindications: "Beta-blockers blunt tachycardia; elderly patients develop significant decompensation at lower SI thresholds.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "A simple, readily available score to predict the need for massive transfusion in the trauma patient",
          citation: "Nunez TC, Voskresensky IV, Dossett LA, et al. J Trauma. 2009;66(2):346-352.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/19202468/" }
          ]
        }
      ],
      fields: [
        makeN("hr", "Heart Rate (HR, bpm)", 125, { min: 30, max: 220, step: 1 }),
        makeN("sbp", "Systolic Blood Pressure (SBP, mmHg)", 88, { min: 30, max: 250, step: 1 }),
        makeS("penetrating", "1. Penetrating Injury Mechanism", "0", [["0", "Blunt mechanism (0 pts)"], ["1", "Penetrating trauma (+1 pt)"]]),
        makeS("fast", "2. Positive FAST Ultrasound (free fluid)", "1", [["0", "Negative FAST (0 pts)"], ["1", "Positive FAST (+1 pt)"]])
      ],
      table: {
        headers: ["Metric", "Threshold Value", "Probability of Massive Transfusion", "Clinical Protocol Action"],
        rows: [
          { id: "mtpNo", cols: ["ABC Score 0 – 1", "< 2 Points (SI < 0.9)", "< 5% (Low)", "Standard resuscitation with balanced crystalloid / cross-matched blood if needed"] },
          { id: "mtpYes", cols: ["ABC Score ≥ 2", "≥ 2 Points (or SI ≥ 1.0)", "> 40% – 50% (High)", "ACTIVATE MASSIVE TRANSFUSION PROTOCOL (MTP): 1:1:1 uncrossed PRBC, FFP, and Platelets"] }
        ]
      },
      calc: function (v) {
        var hr = +v.hr;
        var sbp = +v.sbp;
        var si = Math.round((hr / sbp) * 100) / 100;

        var abcScore = +v.penetrating + +v.fast + (sbp <= 90 ? 1 : 0) + (hr >= 120 ? 1 : 0);
        var needMtp = abcScore >= 2 || si >= 1.0;
        var match = needMtp ? "mtpYes" : "mtpNo";

        var advice = needMtp
          ? "ACTIVATE MASSIVE TRANSFUSION PROTOCOL (MTP). Transfuse balanced blood products in 1:1:1 ratio (pRBC : Plasma : Platelets). Administer Tranexamic Acid (TXA 1g IV within 3 hours). Move directly to operating room or interventional radiology."
          : "Low probability of massive transfusion. Continue standard hemodynamic resuscitation and monitor serial lactate/base deficit.";

        return {
          value: "Shock Index: " + si + " | ABC Score: " + abcScore + " / 4 (" + (needMtp ? "ACTIVATE MTP" : "MTP Not Indicated") + ")",
          matchId: match,
          eq: "Formula: Shock Index = HR (" + hr + ") ÷ SBP (" + sbp + ") = " + si + " (Normal 0.5–0.7).\nABC Criteria: Penetrating (" + v.penetrating + ") + SBP≤90 (" + (sbp <= 90 ? 1 : 0) + ") + HR≥120 (" + (hr >= 120 ? 1 : 0) + ") + FAST (" + v.fast + ") = " + abcScore + ".\n" + advice
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
      window.SYNONYM_MAP["appendicitis"] = ["appendicitis", "alvarado", "mantrels", "ripasa", "air score", "appendix", "rlq"];
      window.SYNONYM_MAP["cholecystitis"] = ["cholecystitis", "tokyo", "tg18", "gallbladder", "murphy", "strasberg", "bile duct"];
      window.SYNONYM_MAP["pancreatitis"] = ["pancreatitis", "ranson", "bisap", "amylase", "lipase", "nccn", "whipple"];
      window.SYNONYM_MAP["diverticulitis"] = ["diverticulitis", "hinchey", "abscess", "perforation", "sigmoid"];
      window.SYNONYM_MAP["tnm"] = ["tnm", "ajcc", "staging", "colorectal", "breast", "thyroid", "oncology", "cancer"];
      window.SYNONYM_MAP["complication"] = ["clavien", "dindo", "apgar", "complication", "surgical apgar", "asa", "ariscat"];
      window.SYNONYM_MAP["burns"] = ["parkland", "baux", "burn", "tbsa", "fluid", "lactated ringers"];
      window.SYNONYM_MAP["liver"] = ["child", "pugh", "meld", "cirrhosis", "hepatobiliary", "aast", "pringle"];
      window.SYNONYM_MAP["trauma"] = ["aast", "spleen", "liver", "shock index", "abc score", "massive transfusion", "wifi", "iah", "acs"];
      window.SYNONYM_MAP["bleeding"] = ["forrest", "gbs", "glasgow blatchford", "ulcer", "melena", "endoscopy"];
    }

    // 4. Force repaint if the HTML engine has already initialized
    if (typeof window.renderHome === "function") {
      window.renderHome();
    }
  } catch (err) {
    console.error("Critical error registering Surgery tools:", err);
  }
})();
