/**
 * MedCalc Module: Endocrinology & Metabolism (Endo)
 * Fully compatible with the MedCalc HTML application structure and obgy.js design architecture.
 */
(function () {
  "use strict";

  // Standard constructor definitions matching obgy.js
  var makeN = (typeof window !== "undefined" && window.N) ? window.N : function (id, label, defaultVal, extra) {
    extra = extra || {};
    return Object.assign({ id: id, label: label, type: "number", value: defaultVal, default: defaultVal }, extra);
  };
  var makeS = (typeof window !== "undefined" && window.S) ? window.S : function (id, label, defaultVal, options) {
    options = options || [];
    return { id: id, label: label, type: "select", value: defaultVal, default: defaultVal, options: options };
  };
  var makeD = (typeof window !== "undefined" && window.D) ? window.D : function (id, label, defaultVal, extra) {
    extra = extra || {};
    return Object.assign({ id: id, label: label, type: "date", value: defaultVal, default: defaultVal }, extra);
  };

  var endoCategory = {
    id: "endo",
    name: "Endocrinology & Metabolism",
    icon: "🔬",
    desc: "Diabetes, thyroid, adrenal, pituitary, bone metabolism, and obesity",
    organs: ["pancreas", "thyroid", "adrenal", "pituitary", "bone", "adipose tissue"],
    region: "systemic / endocrine axes"
  };

  var endoTools = [
    // ==============================================================
    // A. DIABETES MELLITUS
    // ==============================================================
    {
      id: "eAgCalc",
      cat: "endo",
      type: "calc",
      name: "HbA1c to Estimated Average Glucose (eAG)",
      desc: "Translates laboratory HbA1c to mean glucose in mg/dL and mmol/L (ADAG study).",
      organ: "Pancreas / Blood",
      region: "Metabolic / Endocrinology",
      subject: "Diabetes Mellitus / Glycemic Control",
      keywords: ["hba1c", "eag", "average glucose", "adag", "diabetes", "glycemia"],
      guidance: "Translates HbA1c to estimated average glucose (eAG) using the ADAG formula: eAG (mg/dL) = 28.7 × HbA1c − 46.7.\nHelps patients relate laboratory HbA1c percentages to daily home glucometer readings.",
      contraindications: "Unreliable in hemoglobinopathies, severe anemia, hemodialysis, or recent blood transfusion.",
      literature: [
        {
          type: "Seminal ADAG Study",
          icon: "📄",
          title: "Translating the A1C assay into estimated average glucose values",
          citation: "Nathan DM, Kuenen J, Borg R, et al. Diabetes Care. 2008;31(8):1473-1478.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/18540046/" }]
        }
      ],
      fields: [
        makeN("a1c", "HbA1c (%)", 7.5, { min: 4.0, max: 20.0, step: 0.1 })
      ],
      table: {
        headers: ["HbA1c Level (%)", "eAG (mg/dL)", "eAG (mmol/L)", "Glycemic Target Status"],
        rows: [
          { id: "normal", cols: ["< 5.7%", "< 117 mg/dL", "< 6.5 mmol/L", "Normal Non-Diabetic Range"] },
          { id: "prediabetes", cols: ["5.7% – 6.4%", "117 – 139 mg/dL", "6.5 – 7.7 mmol/L", "Prediabetes / Increased Risk"] },
          { id: "target", cols: ["7.0%", "154 mg/dL", "8.6 mmol/L", "Standard ADA Treatment Target (<7.0%)"] },
          { id: "poor", cols: ["≥ 9.0%", "≥ 212 mg/dL", "≥ 11.8 mmol/L", "Uncontrolled / Suboptimal Glycemia"] }
        ]
      },
      calc: function (v) {
        var a1c = +v.a1c;
        var eagMg = 28.7 * a1c - 46.7;
        var eagMmol = eagMg / 18.018;
        var match = "target";
        if (a1c < 5.7) match = "normal";
        else if (a1c < 7.0) match = "prediabetes";
        else if (a1c >= 9.0) match = "poor";
        return {
          value: Math.round(eagMg) + " mg/dL (" + eagMmol.toFixed(1) + " mmol/L)",
          matchId: match,
          eq: "ADAG formula: eAG (mg/dL) = 28.7 × HbA1c − 46.7. eAG (mmol/L) = eAG (mg/dL) ÷ 18.018."
        };
      }
    },
    {
      id: "homaIr",
      cat: "endo",
      type: "calc",
      name: "HOMA-IR (Insulin Resistance)",
      desc: "Homeostatic Model Assessment of peripheral insulin resistance.",
      organ: "Pancreas / Peripheral Tissues",
      region: "Metabolic / Endocrinology",
      subject: "Insulin Resistance / Metabolic Syndrome",
      keywords: ["homa-ir", "insulin resistance", "fasting insulin", "metabolic syndrome"],
      guidance: "HOMA-IR = (Fasting Glucose [mg/dL] × Fasting Insulin [µIU/mL]) ÷ 405. Values >2.0–2.5 indicate insulin resistance.\nStandard research and clinical surrogate measure of basal peripheral insulin resistance.",
      contraindications: "Not validated in patients receiving exogenous insulin therapy or insulin secretagogues.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Homeostasis model assessment: insulin resistance and beta-cell function from fasting plasma glucose and insulin concentrations in man",
          citation: "Matthews DR, Hosker JP, Rudenski AS, et al. Diabetologia. 1985;28(7):412-419.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/3899825/" }]
        }
      ],
      fields: [
        makeN("glu", "Fasting Glucose (mg/dL)", 105, { min: 40, max: 500 }),
        makeN("ins", "Fasting Insulin (µIU/mL)", 12, { min: 1, max: 250, step: 0.5 })
      ],
      table: {
        headers: ["HOMA-IR Score", "Insulin Sensitivity Category", "Clinical Interpretation"],
        rows: [
          { id: "normal", cols: ["< 1.9", "Normal Insulin Sensitivity", "Optimal metabolic sensitivity"] },
          { id: "borderline", cols: ["1.9 – 2.5", "Early / Borderline Resistance", "Increased risk of prediabetes"] },
          { id: "resistant", cols: ["> 2.5", "Significant Insulin Resistance", "High risk of metabolic syndrome and NAFLD"] }
        ]
      },
      calc: function (v) {
        var homa = (+v.glu * +v.ins) / 405;
        var match = "normal";
        var c = "Normal insulin sensitivity (<1.9)";
        if (homa > 2.5) {
          match = "resistant";
          c = "Significant insulin resistance (>2.5)";
        } else if (homa > 1.9) {
          match = "borderline";
          c = "Early / borderline insulin resistance (1.9–2.5)";
        }
        return {
          value: homa.toFixed(2) + " — " + c,
          matchId: match,
          eq: "Formula: HOMA-IR = (Fasting Glucose [mg/dL] × Fasting Insulin [µIU/mL]) ÷ 405."
        };
      }
    },
    {
      id: "homaBeta",
      cat: "endo",
      type: "calc",
      name: "HOMA-β (Beta-Cell Function)",
      desc: "Homeostatic Model Assessment of pancreatic beta-cell secretory capacity.",
      organ: "Pancreas",
      region: "Metabolic / Endocrinology",
      subject: "Pancreatic Beta-Cell Function",
      keywords: ["homa-beta", "beta cell", "insulin secretion", "pancreas"],
      guidance: "HOMA-β = (360 × Fasting Insulin [µIU/mL]) ÷ (Fasting Glucose [mg/dL] − 63). Estimates pancreatic beta-cell function.\nEvaluates remaining endogenous secretory capacity in early type 2 diabetes and metabolic syndrome.",
      contraindications: "Invalid when fasting glucose is ≤63 mg/dL due to zero/negative denominator.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Homeostasis model assessment: insulin resistance and beta-cell function from fasting plasma glucose and insulin concentrations in man",
          citation: "Matthews DR, Hosker JP, Rudenski AS, et al. Diabetologia. 1985;28(7):412-419.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/3899825/" }]
        }
      ],
      fields: [
        makeN("glu", "Fasting Glucose (mg/dL)", 95, { min: 64, max: 400 }),
        makeN("ins", "Fasting Insulin (µIU/mL)", 10, { min: 1, max: 250, step: 0.5 })
      ],
      table: {
        headers: ["HOMA-β Level (%)", "Beta-Cell Secretory Capacity", "Clinical Context"],
        rows: [
          { id: "impaired", cols: ["< 50%", "Impaired Beta-Cell Function", "Substantial secretory defect (typical at T2D diagnosis)"] },
          { id: "normal", cols: ["50% – 120%", "Preserved Beta-Cell Function", "Normal physiological basal insulin secretion"] },
          { id: "hyper", cols: ["> 120%", "Hypersecretory / Compensatory", "Compensatory hyperinsulinemia driven by insulin resistance"] }
        ]
      },
      calc: function (v) {
        var denom = +v.glu - 63;
        if (denom <= 0) return { value: "Invalid: Fasting glucose must be >63 mg/dL", matchId: "impaired", eq: "Formula requires glucose >63 mg/dL." };
        var beta = (360 * +v.ins) / denom;
        var match = "normal";
        if (beta < 50) match = "impaired";
        else if (beta > 120) match = "hyper";
        return {
          value: beta.toFixed(1) + "% beta-cell function",
          matchId: match,
          eq: "Formula: HOMA-β (%) = (360 × Fasting Insulin [µIU/mL]) ÷ (Fasting Glucose [mg/dL] − 63). 100% represents normal reference function."
        };
      }
    },
    {
      id: "quickiIndex",
      cat: "endo",
      type: "calc",
      name: "QUICKI Insulin Sensitivity Index",
      desc: "Quantitative insulin sensitivity check index.",
      organ: "Pancreas / Systemic",
      region: "Metabolic / Endocrinology",
      subject: "Insulin Sensitivity Metrics",
      keywords: ["quicki", "insulin sensitivity", "log-transformed index"],
      guidance: "QUICKI = 1 ÷ [log(Fasting Glucose mg/dL) + log(Fasting Insulin µIU/mL)]. Values <0.33 indicate impaired insulin sensitivity.\nLog-transformed index of insulin sensitivity with high reproducibility.",
      contraindications: "Requires steady-state fasting measurements; invalid postprandially.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Quantitative insulin sensitivity check index: a simple, accurate method for assessing insulin sensitivity in humans",
          citation: "Katz A, Nambi SS, Mather K, et al. J Clin Endocrinol Metab. 2000;85(7):2402-2410.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/10902785/" }]
        }
      ],
      fields: [
        makeN("glu", "Fasting Glucose (mg/dL)", 95, { min: 40, max: 500 }),
        makeN("ins", "Fasting Insulin (µIU/mL)", 10, { min: 1, max: 200, step: 0.1 })
      ],
      table: {
        headers: ["QUICKI Value", "Insulin Sensitivity", "Metabolic Significance"],
        rows: [
          { id: "resistant", cols: ["< 0.33", "Insulin Resistant", "High risk of impaired glucose tolerance"] },
          { id: "normal", cols: ["≥ 0.33", "Preserved Sensitivity", "Normal physiological glucose clearance"] }
        ]
      },
      calc: function (v) {
        var quicki = 1 / (Math.log10(+v.glu) + Math.log10(+v.ins));
        var match = quicki < 0.33 ? "resistant" : "normal";
        var c = quicki < 0.33 ? "Insulin resistance (<0.33)" : "Preserved insulin sensitivity (≥0.33)";
        return {
          value: quicki.toFixed(3) + " — " + c,
          matchId: match,
          eq: "QUICKI = 1 ÷ [log₁₀(Glucose [mg/dL]) + log₁₀(Insulin [µIU/mL])]. Lower values denote worse resistance."
        };
      }
    },
    {
      id: "tygIndex",
      cat: "endo",
      type: "calc",
      name: "TyG Index (Triglyceride–Glucose)",
      desc: "Surrogate biomarker of insulin resistance from routine fasting lipid panel.",
      organ: "Liver / Adipose / Vascular System",
      region: "Metabolic / Endocrinology",
      subject: "Insulin Resistance / Lipid Metabolism",
      keywords: ["tyg", "triglyceride glucose index", "lipid surrogate", "insulin resistance"],
      guidance: "TyG Index = ln[(Fasting Triglycerides mg/dL × Fasting Glucose mg/dL) ÷ 2]. Values ≥8.5–8.8 identify insulin resistance.\nCost-effective surrogate for insulin resistance when serum insulin assays are unavailable.",
      contraindications: "Altered by severe hypertriglyceridemia (>1000 mg/dL) or recent high-fat meal.",
      literature: [
        {
          type: "Validation Study",
          icon: "📄",
          title: "The TyG index may be a useful surrogate marker for insulin resistance in healthy subjects",
          citation: "Simental-Mendía LE, Rodríguez-Morán M, Guerrero-Romero F. Diabetol Metab Syndr. 2010;2:7.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/20181026/" }]
        }
      ],
      fields: [
        makeN("tg", "Fasting Triglycerides (mg/dL)", 160, { min: 30, max: 2000 }),
        makeN("glu", "Fasting Glucose (mg/dL)", 105, { min: 40, max: 600 })
      ],
      table: {
        headers: ["TyG Score", "Classification", "Associated Risk Factors"],
        rows: [
          { id: "normal", cols: ["< 8.5", "Normal Range", "Low cardiometabolic risk profile"] },
          { id: "elevated", cols: ["≥ 8.5", "Elevated TyG Index", "Correlates with metabolic syndrome, NAFLD, and coronary artery calcification"] }
        ]
      },
      calc: function (v) {
        var tyg = Math.log((+v.tg * +v.glu) / 2);
        var match = tyg >= 8.5 ? "elevated" : "normal";
        var c = tyg >= 8.5 ? "Elevated (≥8.5; associated with metabolic syndrome & vascular disease)" : "Normal range (<8.5)";
        return {
          value: tyg.toFixed(2) + " — " + c,
          matchId: match,
          eq: "TyG Index = ln[(Fasting Triglycerides [mg/dL] × Fasting Glucose [mg/dL]) ÷ 2]."
        };
      }
    },
    {
      id: "dmCriteriaRef",
      cat: "endo",
      type: "class",
      name: "Diabetes Diagnostic Criteria Reference",
      desc: "ADA standards of care criteria for diabetes and prediabetes.",
      organ: "Pancreas / Systemic",
      region: "Metabolic / Endocrinology",
      subject: "Diabetes Mellitus / Diagnostics",
      keywords: ["ada criteria", "fpg", "ogtt", "hba1c", "prediabetes", "diagnosis"],
      guidance: "ADA Diagnostic Criteria: Fasting Plasma Glucose ≥126 mg/dL, 2-h OGTT ≥200 mg/dL, HbA1c ≥6.5%, or random glucose ≥200 mg/dL with classic hyperglycemic symptoms.\nConsensus thresholds for establishing the clinical diagnosis of diabetes mellitus.",
      contraindications: "Asymptomatic patients require two abnormal test results from separate samples for formal diagnosis.",
      literature: [
        {
          type: "ADA Standards of Care",
          icon: "📘",
          title: "Classification and Diagnosis of Diabetes: Standards of Care in Diabetes—2024",
          citation: "American Diabetes Association. Diabetes Care. 2024;47(Suppl 1):S20-S42.",
          links: [{ text: "View Guideline (ADA) ↗", url: "https://diabetesjournals.org/care/article/47/Supplement_1/S20/153954" }]
        }
      ],
      fields: [
        makeS("test", "Select test to review", "fpg", [
          ["fpg", "Fasting Plasma Glucose (FPG)"],
          ["a1c", "Hemoglobin A1c (HbA1c)"],
          ["ogtt", "2-hour 75g Oral Glucose Tolerance Test (OGTT)"],
          ["rpg", "Random Plasma Glucose"]
        ])
      ],
      table: {
        headers: ["Diagnostic Test", "Normal", "Prediabetes Threshold", "Diabetes Mellitus Threshold"],
        rows: [
          { id: "fpg", cols: ["Fasting Plasma Glucose", "< 100 mg/dL", "100 – 125 mg/dL (IFG)", "≥ 126 mg/dL"] },
          { id: "a1c", cols: ["Hemoglobin A1c", "< 5.7%", "5.7% – 6.4%", "≥ 6.5%"] },
          { id: "ogtt", cols: ["2-hr 75g OGTT", "< 140 mg/dL", "140 – 199 mg/dL (IGT)", "≥ 200 mg/dL"] },
          { id: "rpg", cols: ["Random Plasma Glucose", "N/A", "N/A", "≥ 200 mg/dL with classic symptoms"] }
        ]
      },
      calc: function (v) {
        var txt = "";
        var match = v.test;
        if (v.test === "fpg") txt = "Normal: <100 mg/dL | Prediabetes (IFG): 100–125 mg/dL | Diabetes: ≥126 mg/dL (requires confirmation).";
        else if (v.test === "a1c") txt = "Normal: <5.7% | Prediabetes: 5.7–6.4% | Diabetes: ≥6.5% (requires confirmation unless unequivocal hyperglycemia).";
        else if (v.test === "ogtt") txt = "Normal: <140 mg/dL | Impaired Glucose Tolerance (IGT): 140–199 mg/dL | Diabetes: ≥200 mg/dL.";
        else txt = "Diabetes: ≥200 mg/dL in a patient with classic symptoms of hyperglycemia or hyperglycemic crisis (no confirmatory test needed).";
        return {
          value: txt,
          matchId: match,
          eq: "ADA Standards of Care in Diabetes. Diagnosis requires two abnormal results from the same sample or two separate test samples."
        };
      }
    },
    {
      id: "tddInsulinHelper",
      cat: "endo",
      type: "calc",
      name: "Estimated Total Daily Insulin (TDD) Helper",
      desc: "Initial total daily insulin requirement based on weight and diabetes type.",
      organ: "Pancreas / Systemic",
      region: "Metabolic / Endocrinology",
      subject: "Insulin Dosing / Diabetes Management",
      keywords: ["tdd", "total daily dose", "insulin dosage", "basal bolus"],
      guidance: "Estimates total daily insulin dose (TDD): typically 0.4–0.5 units/kg/day in type 1 diabetes and 0.5–1.0+ units/kg/day in insulin-resistant type 2 diabetes.\nProvides initial starting doses for basal–bolus insulin regimens.",
      contraindications: "Reduce initial dosing in severe renal impairment (eGFR <30 mL/min) or frail elderly patients.",
      literature: [
        {
          type: "ADA Clinical Practice Guideline",
          icon: "📘",
          title: "Insulin Administration: Standards of Medical Care in Diabetes",
          citation: "American Diabetes Association. Diabetes Care. 2023;46(Suppl 1):S140-S157.",
          links: [{ text: "View Guideline (ADA) ↗", url: "https://diabetesjournals.org/care" }]
        }
      ],
      fields: [
        makeN("weight", "Patient Weight (kg)", 75, { min: 20, max: 250, step: 0.5 }),
        makeS("regimen", "Clinical Scenario", "t1d", [
          ["t1d_honeymoon", "Type 1 Diabetes (honeymoon phase / sensitive: 0.3 units/kg)"],
          ["t1d", "Type 1 Diabetes (typical: 0.5 units/kg)"],
          ["t2d_init", "Type 2 Diabetes (initial starting dose: 0.5 units/kg)"],
          ["t2d_resist", "Type 2 Diabetes (insulin resistant / obese: 0.8 units/kg)"]
        ])
      ],
      table: {
        headers: ["Scenario Factor", "Dosing Multiplier", "Basal Share (50%)", "Prandial Share (50%)"],
        rows: [
          { id: "t1d_honeymoon", cols: ["T1D Honeymoon", "0.3 units/kg/day", "15% of total body weight", "15% divided across meals"] },
          { id: "t1d", cols: ["T1D Standard", "0.5 units/kg/day", "25% of total body weight", "25% divided across meals"] },
          { id: "t2d_init", cols: ["T2D Initial", "0.5 units/kg/day", "25% of total body weight", "25% divided across meals"] },
          { id: "t2d_resist", cols: ["T2D Resistant", "0.8 units/kg/day", "40% of total body weight", "40% divided across meals"] }
        ]
      },
      calc: function (v) {
        var factor = 0.5;
        if (v.regimen === "t1d_honeymoon") factor = 0.3;
        else if (v.regimen === "t2d_resist") factor = 0.8;
        var tdd = +v.weight * factor;
        var basal = Math.round(tdd * 0.5);
        var prandial = Math.round(tdd * 0.5);
        return {
          value: Math.round(tdd) + " units/day (Basal: ~" + basal + "u | Total Bolus: ~" + prandial + "u)",
          matchId: v.regimen,
          eq: "Estimated TDD = Weight (kg) × " + factor + " units/kg. Typically divided 50% basal and 50% bolus (split across 3 meals)."
        };
      }
    },
    {
      id: "basalBolusCalc",
      cat: "endo",
      type: "calc",
      name: "Basal–Bolus Insulin Calculator",
      desc: "Splits known Total Daily Dose (TDD) into basal and mealtime doses.",
      organ: "Pancreas / Systemic",
      region: "Metabolic / Endocrinology",
      subject: "Insulin Regimen Titration",
      keywords: ["basal bolus", "prandial insulin", "tdd split", "glargine", "lispro"],
      guidance: "Splits total daily dose (TDD) into basal (typically 40–50%) and prandial bolus (50–60% divided equally across 3 meals).\nGuides physiological insulin replacement titration.",
      contraindications: "Adjust mealtime ratios individually if meal carbohydrate distribution is significantly asymmetric.",
      literature: [
        {
          type: "Clinical Review",
          icon: "📄",
          title: "Intensive insulin therapy: basal-bolus regimens in type 1 and type 2 diabetes",
          citation: "Hirsch IB. N Engl J Med. 2005;352(2):174-183.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/15647579/" }]
        }
      ],
      fields: [
        makeN("tdd", "Total Daily Insulin Dose (units)", 40, { min: 4, max: 300, step: 1 }),
        makeS("split", "Basal : Prandial Split", "50_50", [
          ["50_50", "50% Basal / 50% Bolus"],
          ["40_60", "40% Basal / 60% Bolus"]
        ])
      ],
      table: {
        headers: ["Split Ratio", "Basal Percentage", "Prandial Percentage", "Per-Meal Bolus (TID)"],
        rows: [
          { id: "50_50", cols: ["50 / 50 Split", "50% of TDD", "50% of TDD", "Total Bolus ÷ 3"] },
          { id: "40_60", cols: ["40 / 60 Split", "40% of TDD", "60% of TDD", "Total Bolus ÷ 3"] }
        ]
      },
      calc: function (v) {
        var tdd = +v.tdd;
        var basalPct = v.split === "50_50" ? 0.5 : 0.4;
        var basal = Math.round(tdd * basalPct);
        var bolusTotal = tdd - basal;
        var perMeal = Math.round(bolusTotal / 3);
        return {
          value: "Basal: " + basal + " units once daily | Prandial: " + perMeal + " units TID with meals",
          matchId: v.split,
          eq: "Basal (" + (basalPct * 100) + "%) = " + basal + "u. Total bolus = " + bolusTotal + "u divided into " + perMeal + "u for breakfast, lunch, and dinner."
        };
      }
    },
    {
      id: "corrInsulinCalc",
      cat: "endo",
      type: "calc",
      name: "Correction Insulin & Sensitivity Factor",
      desc: "Calculates Insulin Sensitivity Factor (ISF) and high-glucose correction dose.",
      organ: "Pancreas / Blood",
      region: "Metabolic / Endocrinology",
      subject: "Hyperglycemia Correction / Insulin Dosing",
      keywords: ["isf", "correction factor", "rule of 1800", "rule of 1500", "correction dose"],
      guidance: "Correction Factor (ISF) = 1800 ÷ TDD (for rapid-acting analogs) or 1500 ÷ TDD (for regular insulin). Correction dose = (Current Glucose − Target Glucose) ÷ ISF.\nCalculates supplemental prandial or bedtime insulin to treat acute hyperglycemia.",
      contraindications: "Beware of insulin stacking; ensure prior bolus active insulin time (3–4 hours) has elapsed.",
      literature: [
        {
          type: "Clinical Guideline",
          icon: "📘",
          title: "Practical Insulin Management in Type 1 and Type 2 Diabetes",
          citation: "Davidson PC, Hebblewhite HR, Steed RD, Bode BW. Diabetes Technol Ther. 2008;10(Suppl 1):S44-S53.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/18473822/" }]
        }
      ],
      fields: [
        makeN("tdd", "Total Daily Insulin Dose (units)", 45, { min: 5, max: 300 }),
        makeN("curr_glu", "Current Blood Glucose (mg/dL)", 240, { min: 70, max: 800 }),
        makeN("target_glu", "Target Blood Glucose (mg/dL)", 120, { min: 80, max: 180 }),
        makeS("analog", "Insulin Type", "rapid", [
          ["rapid", "Rapid-acting analog (Rule of 1800)"],
          ["regular", "Regular insulin (Rule of 1500)"]
        ])
      ],
      table: {
        headers: ["Insulin Preparation", "ISF Formula Constant", "Clinical Application"],
        rows: [
          { id: "rapid", cols: ["Rapid Analog (Lispro/Aspart/Glulisine)", "1800 ÷ TDD", "1 unit drops glucose by X mg/dL"] },
          { id: "regular", cols: ["Regular Human Insulin", "1500 ÷ TDD", "1 unit drops glucose by X mg/dL"] }
        ]
      },
      calc: function (v) {
        var rule = v.analog === "rapid" ? 1800 : 1500;
        var isf = Math.round(rule / +v.tdd);
        var excess = +v.curr_glu - +v.target_glu;
        if (excess <= 0) return { value: "No correction needed (Glucose ≤ Target)", matchId: v.analog, eq: "ISF = " + isf + " mg/dL per 1 unit." };
        var corrDose = excess / isf;
        return {
          value: corrDose.toFixed(1) + " units correction (ISF: 1 unit drops glucose " + isf + " mg/dL)",
          matchId: v.analog,
          eq: "ISF = " + rule + " ÷ TDD. Correction Dose = (Current Glucose − Target) ÷ ISF = " + excess + " ÷ " + isf + "."
        };
      }
    },
    {
      id: "icrCalc",
      cat: "endo",
      type: "calc",
      name: "Insulin-to-Carbohydrate Ratio (ICR)",
      desc: "Rule of 500 for mealtime carbohydrate bolus calculation.",
      organ: "Pancreas / Systemic",
      region: "Metabolic / Endocrinology",
      subject: "Carbohydrate Counting / Prandial Bolus",
      keywords: ["icr", "rule of 500", "carbohydrate ratio", "meal bolus"],
      guidance: "Insulin-to-Carbohydrate Ratio (ICR) = 500 ÷ TDD (rule of 500 for rapid analogs). Grams of carbohydrate divided by ICR yields the mealtime bolus.\nDetermines meal bolus sizing based on planned carbohydrate intake.",
      contraindications: "Individualized adjustments necessary for high-protein/high-fat meals or heavy post-meal exercise.",
      literature: [
        {
          type: "Clinical Study",
          icon: "📄",
          title: "How to calculate the carbohydrate-to-insulin ratio in insulin-pump-treated patients",
          citation: "King AB, Armstrong DU. Diabetes Care. 2007;30(9):2269-2270.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/17586734/" }]
        }
      ],
      fields: [
        makeN("tdd", "Total Daily Insulin Dose (units)", 50, { min: 5, max: 300 }),
        makeN("carbs", "Carbohydrates in meal (grams)", 60, { min: 0, max: 300 })
      ],
      table: {
        headers: ["Formula Rule", "ICR Derivation", "Bolus Calculation"],
        rows: [
          { id: "rule500", cols: ["Rule of 500 (Rapid Analogs)", "500 ÷ TDD", "Planned Carbs (g) ÷ ICR = Meal Dose (units)"] }
        ]
      },
      calc: function (v) {
        var icr = Math.round(500 / +v.tdd);
        var mealBolus = +v.carbs / icr;
        return {
          value: mealBolus.toFixed(1) + " units meal bolus (ICR: 1 unit per " + icr + "g carbs)",
          matchId: "rule500",
          eq: "Rule of 500: ICR = 500 ÷ TDD. Meal bolus = Planned Carbs (g) ÷ ICR."
        };
      }
    },
    {
      id: "hypoClassification",
      cat: "endo",
      type: "class",
      name: "Hypoglycemia Classification",
      desc: "ADA/EASD consensus definitions of hypoglycemia severity.",
      organ: "Pancreas / Brain / Systemic",
      region: "Endocrine Emergencies / Safety",
      subject: "Hypoglycemia Management / Safety",
      keywords: ["hypoglycemia", "low blood sugar", "level 1", "level 2", "level 3", "rule of 15"],
      guidance: "Level 1: Glucose <70 mg/dL (alert value; treat with 15g fast-acting carbs); Level 2: Glucose <54 mg/dL (clinically significant); Level 3: Severe cognitive impairment requiring third-party assistance.\nStandard international safety classification for hypoglycemic events.",
      contraindications: "Severe Level 3 hypoglycemia with loss of consciousness prohibits oral carbohydrates; give IV dextrose or glucagon stat.",
      literature: [
        {
          type: "Consensus Statement",
          icon: "📘",
          title: "Glucose Concentrations Indicating Hypoglycemia: A Consensus Statement from the International Hypoglycaemia Study Group",
          citation: "International Hypoglycaemia Study Group. Diabetes Care. 2017;40(1):155-157.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/27650580/" }]
        }
      ],
      fields: [
        makeN("glu", "Measured Blood Glucose (mg/dL)", 58, { min: 10, max: 120 }),
        makeS("assistance", "Requires external third-party assistance to treat?", "0", [
          ["0", "No"],
          ["1", "Yes"]
        ])
      ],
      table: {
        headers: ["Hypoglycemia Level", "Glucose Cut-Off", "Clinical Status", "Immediate Management"],
        rows: [
          { id: "level1", cols: ["Level 1", "< 70 mg/dL", "Alert value / Autonomic symptoms", "15g fast-acting oral glucose; recheck in 15 min"] },
          { id: "level2", cols: ["Level 2", "< 54 mg/dL", "Clinically significant hypoglycemia", "Immediate fast-acting glucose treatment"] },
          { id: "level3", cols: ["Level 3", "Any level + severe impairment", "Cognitive collapse requiring assistance", "Glucagon (IM/Nasal) or IV Dextrose (D50/D10)"] }
        ]
      },
      calc: function (v) {
        var g = +v.glu, assist = v.assistance === "1";
        var match = "level1";
        var c = "";
        if (assist) {
          match = "level3";
          c = "Level 3: Severe Hypoglycemia (cognitive impairment requiring assistance; glucagon / IV dextrose indicated)";
        } else if (g < 54) {
          match = "level2";
          c = "Level 2: Clinically Significant Hypoglycemia (<54 mg/dL; immediate fast-acting carbohydrate indicated)";
        } else if (g <= 70) {
          match = "level1";
          c = "Level 1: Hypoglycemia Alert Value (54–70 mg/dL; Rule of 15: treat with 15g fast carbohydrate)";
        } else {
          c = "Glucose >70 mg/dL (not meeting hypoglycemia definition threshold)";
        }
        return {
          value: c,
          matchId: match,
          eq: "Rule of 15: Ingest 15g fast-acting glucose, re-test blood sugar in 15 minutes, repeat if still <70 mg/dL."
        };
      }
    },
    {
      id: "dmRemissionRef",
      cat: "endo",
      type: "class",
      name: "Diabetes Remission Criteria Reference",
      desc: "International consensus criteria for remission of type 2 diabetes.",
      organ: "Pancreas / Systemic",
      region: "Metabolic / Endocrinology",
      subject: "Type 2 Diabetes Remission",
      keywords: ["diabetes remission", "hba1c", "off medications", "bariatric", "reversal"],
      guidance: "Diabetes remission is defined as HbA1c <6.5% sustained for ≥3 months in the absence of ongoing glucose-lowering medications.\nGuides evaluation following bariatric surgery or intensive lifestyle intervention.",
      contraindications: "Does not apply to Type 1 diabetes or autoimmune diabetes.",
      literature: [
        {
          type: "Consensus Statement",
          icon: "📘",
          title: "Definition and Interpretation of Remission in Type 2 Diabetes: An International Consensus Report",
          citation: "Riddle MC, Cefalu WT, Evans PH, et al. Diabetes Care. 2021;44(10):2438-2444.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/34462295/" }]
        }
      ],
      fields: [
        makeN("a1c", "HbA1c without medication for ≥3 months (%)", 6.2, { min: 4.0, max: 12.0, step: 0.1 }),
        makeS("meds", "Active glucose-lowering medications taken?", "0", [
          ["0", "None (off all diabetes meds for ≥3 months)"],
          ["1", "Still taking metformin/other meds"]
        ])
      ],
      table: {
        headers: ["Remission Status", "HbA1c Threshold", "Medication Requirement", "Clinical Recommendation"],
        rows: [
          { id: "remission", cols: ["Remission Criteria Met", "< 6.5%", "Off all glucose-lowering drugs ≥3 months", "Annual HbA1c monitoring, diabetes microvascular surveillance"] },
          { id: "noRemission", cols: ["Remission Not Met", "≥ 6.5% or on therapy", "Ongoing pharmacotherapy", "Continue standard guideline-directed diabetes care"] }
        ]
      },
      calc: function (v) {
        var a1c = +v.a1c, noMeds = v.meds === "0";
        var isRem = a1c < 6.5 && noMeds;
        var match = isRem ? "remission" : "noRemission";
        var res = isRem
          ? "Meets Type 2 Diabetes Remission criteria (HbA1c <6.5% sustained for ≥3 months off pharmacotherapy)"
          : "Does not meet remission criteria (requires HbA1c <6.5% completely off glucose-lowering drugs).";
        return {
          value: res,
          matchId: match,
          eq: "Consensus definition (ADA/EASD/Endocrine Society): HbA1c <6.5% (<48 mmol/mol) sustained ≥3 months without therapy."
        };
      }
    },

    // ==============================================================
    // B. THYROID DISORDERS
    // ==============================================================
    {
      id: "tshGuide",
      cat: "endo",
      type: "class",
      name: "TSH / FT4 / FT3 Interpretation Guide",
      desc: "Biochemical thyroid function test pattern classifier.",
      organ: "Thyroid / Pituitary Axis",
      region: "Thyroid Disorders / Diagnostic Testing",
      subject: "Thyroid Function Test Interpretation",
      keywords: ["tsh", "free t4", "hypothyroidism", "hyperthyroidism", "subclinical"],
      guidance: "Interprets discordant TSH and Free T4 patterns: Primary hypothyroidism, primary hyperthyroidism, subclinical disease, central dysfunction, or thyroid hormone resistance.\nInitial diagnostic framework for biochemical thyroid dysfunction.",
      contraindications: "Interference from severe non-thyroidal illness (euthyroid sick syndrome), biotin, or anti-TSH antibodies must be considered.",
      literature: [
        {
          type: "ATA Guidelines",
          icon: "📘",
          title: "2016 American Thyroid Association Guidelines for Diagnosis and Management of Hyperthyroidism and Other Causes of Thyrotoxicosis",
          citation: "Ross DS, Burch HB, Cooper DS, et al. Thyroid. 2016;26(10):1343-1421.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/27521186/" }]
        }
      ],
      fields: [
        makeS("tsh", "Serum TSH", "high", [
          ["low", "Suppressed / Low (<0.4 mIU/L)"],
          ["norm", "Normal (0.4–4.5 mIU/L)"],
          ["high", "Elevated (>4.5 mIU/L)"]
        ]),
        makeS("ft4", "Free T4 (FT4)", "low", [
          ["low", "Low"],
          ["norm", "Normal"],
          ["high", "Elevated"]
        ])
      ],
      table: {
        headers: ["TSH Status", "Free T4 Status", "Diagnostic Pattern", "Primary Etiologies"],
        rows: [
          { id: "primHypo", cols: ["Elevated (>4.5)", "Low", "Primary Overt Hypothyroidism", "Hashimoto thyroiditis, post-ablation, post-surgical"] },
          { id: "subHypo", cols: ["Elevated (>4.5)", "Normal", "Subclinical Hypothyroidism", "Early autoimmune thyroiditis"] },
          { id: "primHyper", cols: ["Low (<0.4)", "Elevated", "Primary Overt Hyperthyroidism", "Graves disease, toxic multinodular goiter, toxic adenoma"] },
          { id: "subHyper", cols: ["Low (<0.4)", "Normal", "Subclinical Hyperthyroidism", "Exogenous levothyroxine over-replacement, autonomous nodule"] },
          { id: "centralHypo", cols: ["Low (<0.4)", "Low", "Central / Secondary Hypothyroidism", "Pituitary or hypothalamic insufficiency"] }
        ]
      },
      calc: function (v) {
        var pattern = "";
        var match = "primHypo";
        if (v.tsh === "high" && v.ft4 === "low") { pattern = "Primary Overt Hypothyroidism (common causes: Hashimoto thyroiditis, post-ablation, thyroidectomy)."; match = "primHypo"; }
        else if (v.tsh === "high" && v.ft4 === "norm") { pattern = "Subclinical Hypothyroidism (consider anti-TPO antibodies, repeat in 6–12 weeks)."; match = "subHypo"; }
        else if (v.tsh === "low" && v.ft4 === "high") { pattern = "Primary Overt Hyperthyroidism / Thyrotoxicosis (Graves disease, toxic multinodular goiter, toxic adenoma)."; match = "primHyper"; }
        else if (v.tsh === "low" && v.ft4 === "norm") { pattern = "Subclinical Hyperthyroidism or exogenous over-replacement."; match = "subHyper"; }
        else if (v.tsh === "low" && v.ft4 === "low") { pattern = "Central / Secondary Hypothyroidism (evaluate pituitary/hypothalamic axis) or severe non-thyroidal illness."; match = "centralHypo"; }
        else if (v.tsh === "high" && v.ft4 === "high") { pattern = "TSH-mediated hyperthyroidism (TSH-secreting pituitary adenoma vs Thyroid Hormone Resistance) or assay artifact."; match = "primHyper"; }
        else { pattern = "Euthyroid (Normal thyroid function tests)."; match = "subHypo"; }
        return {
          value: pattern,
          matchId: match,
          eq: "Always correlate with patient symptoms, drug interference (biotin, amiodarone), and clinical pregnancy status."
        };
      }
    },
    {
      id: "bwpsScore",
      cat: "endo",
      type: "class",
      name: "Thyroid Storm — Burch–Wartofsky Point Scale",
      desc: "Point scale for assessing likelihood of acute life-threatening thyroid storm.",
      organ: "Thyroid / Heart / Brain / Systemic",
      region: "Endocrine Emergencies / Critical Care",
      subject: "Thyroid Emergencies / Thyrotoxicosis",
      keywords: ["bwps", "thyroid storm", "burch wartofsky", "thyrotoxic crisis"],
      guidance: "Burch–Wartofsky Point Scale evaluates thyroid storm based on thermoregulatory, CNS, GI/hepatic, cardiovascular dysfunction, and precipitant. Score ≥45 denotes thyroid storm.\nAids prompt aggressive bedside initiation of antithyroid medications, iodine, beta-blockers, and corticosteroids.",
      contraindications: "Clinical judgment supersedes score; initiate empiric therapy immediately if life-threatening storm is suspected.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Life-threatening thyrotoxicosis. Thyroid storm",
          citation: "Burch HB, Wartofsky L. Endocrinol Metab Clin North Am. 1993;22(2):263-277.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/8333681/" }]
        }
      ],
      fields: [
        makeS("temp", "Temperature (°F)", "0", [
          ["0", "<99 (0)"],
          ["5", "99–99.9 (+5)"],
          ["10", "100–100.9 (+10)"],
          ["15", "101–101.9 (+15)"],
          ["20", "102–102.9 (+20)"],
          ["25", "103–103.9 (+25)"],
          ["30", "≥104.0 (+30)"]
        ]),
        makeS("cns", "CNS effects", "0", [
          ["0", "Absent (0)"],
          ["10", "Mild (agitation: +10)"],
          ["20", "Moderate (delirium, psychosis: +20)"],
          ["30", "Severe (seizures, coma: +30)"]
        ]),
        makeS("gi", "GI / Hepatic dysfunction", "0", [
          ["0", "Absent (0)"],
          ["10", "Moderate (diarrhea, nausea, vomiting: +10)"],
          ["20", "Severe (unexplained jaundice: +20)"]
        ]),
        makeS("hr", "Tachycardia (pulse/min)", "0", [
          ["0", "<90 (0)"],
          ["5", "90–109 (+5)"],
          ["10", "110–119 (+10)"],
          ["15", "120–129 (+15)"],
          ["20", "130–139 (+20)"],
          ["25", "≥140 (+25)"]
        ]),
        makeS("chf", "Congestive heart failure", "0", [
          ["0", "Absent (0)"],
          ["5", "Mild (pedal edema: +5)"],
          ["10", "Moderate (bibasilar rales: +10)"],
          ["15", "Severe (pulmonary edema: +15)"]
        ]),
        makeS("af", "Atrial fibrillation present", "0", [
          ["0", "No (0)"],
          ["10", "Yes (+10)"]
        ]),
        makeS("precip", "Precipitating event identified", "0", [
          ["0", "No (0)"],
          ["10", "Yes (+10)"]
        ])
      ],
      table: {
        headers: ["BWPS Score", "Likelihood of Thyroid Storm", "Recommended Emergency Pathway"],
        rows: [
          { id: "unlikely", cols: ["< 25 Points", "Unlikely", "Standard thyrotoxicosis treatment; re-evaluate precipitant"] },
          { id: "impending", cols: ["25 – 44 Points", "Impending Thyroid Storm", "ICU monitoring, commence thionamide + beta-blocker"] },
          { id: "storm", cols: ["≥ 45 Points", "Highly Suggestive of Thyroid Storm", "EMERGENCY: ICU admission, PTU/Methimazole, Lugol iodine, hydrocortisone, propranolol"] }
        ]
      },
      calc: function (v) {
        var total = +v.temp + +v.cns + +v.gi + +v.hr + +v.chf + +v.af + +v.precip;
        var match = "unlikely";
        var c = total >= 45 ? "Highly suggestive of Thyroid Storm (≥45 points; initiate immediate multimodal therapy)" : total >= 25 ? "Impending Thyroid Storm (25–44 points)" : "Thyroid storm unlikely (<25 points)";
        if (total >= 45) match = "storm";
        else if (total >= 25) match = "impending";
        return {
          value: total + " points — " + c,
          matchId: match,
          eq: "BWPS ≥45: Start propylthiouracil/methimazole, hydrocortisone, beta-blocker, and inorganic iodine (after thionamide)."
        };
      }
    },
    {
      id: "jtaThyroidStorm",
      cat: "endo",
      type: "class",
      name: "Japanese Thyroid Association (JTA) Criteria",
      desc: "Diagnostic criteria for Thyroid Storm (TS1 definite vs TS2 suspected).",
      organ: "Thyroid / Systemic",
      region: "Endocrine Emergencies",
      subject: "Thyroid Emergencies / JTA Criteria",
      keywords: ["jta", "japan thyroid association", "thyroid storm", "ts1", "ts2"],
      guidance: "Japanese Thyroid Association diagnostic criteria combine thyrotoxicosis with specific combinations of CNS, fever, tachycardia, CHF, and GI manifestations.\nAlternative validated clinical criteria for identifying definite vs suspected thyroid storm.",
      contraindications: "Requires documented biochemical thyrotoxicosis (elevated FT4/FT3).",
      literature: [
        {
          type: "JTA Guidelines",
          icon: "📘",
          title: "Diagnostic criteria, clinical features, and incidence of thyroid storm based on nationwide surveys",
          citation: "Akamizu T, Satoh T, Isozaki O, et al. Thyroid. 2012;22(7):661-679.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/22690898/" }]
        }
      ],
      fields: [
        makeS("thyro", "Documented Thyrotoxicosis (elevated FT4/FT3)", "1", [
          ["1", "Yes"],
          ["0", "No"]
        ]),
        makeS("cns", "CNS manifestation (restlessness, delirium, coma)", "0", [
          ["0", "Absent"],
          ["1", "Present"]
        ]),
        makeN("other", "Number of other manifestations (Fever ≥38°C, Tachycardia ≥130, Heart failure, GI/hepatic jaundice)", 1, { min: 0, max: 4, step: 1 })
      ],
      table: {
        headers: ["JTA Staging Category", "Criteria Combination", "Clinical Status"],
        rows: [
          { id: "ts1", cols: ["TS1 (Definite)", "Thyrotoxicosis + CNS manifestation + ≥1 other OR ≥3 other manifestations", "Definite Thyroid Storm"] },
          { id: "ts2", cols: ["TS2 (Suspected)", "Thyrotoxicosis + CNS manifestation OR ≥2 other manifestations", "Suspected Thyroid Storm"] },
          { id: "notMet", cols: ["Criteria Not Met", "Insufficient symptom combination", "Does not meet JTA thyroid storm criteria"] }
        ]
      },
      calc: function (v) {
        if (v.thyro === "0") return { value: "Criteria not met (Thyrotoxicosis is required)", matchId: "notMet", eq: "Thyrotoxicosis must be biochemically documented." };
        var cns = v.cns === "1", o = +v.other;
        var res = "";
        var match = "notMet";
        if (cns && o >= 1) { res = "TS1: Definite Thyroid Storm (CNS manifestation + ≥1 other symptom)"; match = "ts1"; }
        else if (o >= 3) { res = "TS1: Definite Thyroid Storm (≥3 other manifestations without CNS involvement)"; match = "ts1"; }
        else if (cns || o >= 2) { res = "TS2: Suspected Thyroid Storm"; match = "ts2"; }
        else res = "Does not meet JTA thyroid storm criteria";
        return {
          value: res,
          matchId: match,
          eq: "JTA Criteria: Requires thyrotoxicosis + combinations of CNS, fever, tachycardia, CHF, and GI/hepatic dysfunction."
        };
      }
    },
    {
      id: "popoveniucScore",
      cat: "endo",
      type: "class",
      name: "Myxedema Coma — Popoveniuc Score",
      desc: "Scoring tool to assess the probability of life-threatening myxedema coma.",
      organ: "Thyroid / Brain / Systemic",
      region: "Endocrine Emergencies / Critical Care",
      subject: "Severe Hypothyroidism / Myxedema Coma",
      keywords: ["popoveniuc", "myxedema coma", "hypothyroidism emergency", "hypothermia"],
      guidance: "Popoveniuc diagnostic score for myxedema coma based on body temperature, CNS dysfunction, GI features, cardiovascular signs, and precipitating factors.\nQuantitative scoring system to support rapid treatment of life-threatening severe hypothyroidism.",
      contraindications: "Stress-dose IV glucocorticoids must ALWAYS precede IV thyroid hormone replacement to prevent acute adrenal crisis.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "A Diagnostic Scoring System for Myxedema Coma",
          citation: "Popoveniuc G, Chandra T, Sud A, et al. Endocr Pract. 2014;20(8):808-817.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/24583617/" }]
        }
      ],
      fields: [
        makeS("temp", "Body Temperature (°F)", "0", [
          ["0", "≥95.0 (0)"],
          ["10", "93.0–94.9 (+10)"],
          ["20", "<93.0 (+20)"]
        ]),
        makeS("cns", "CNS dysfunction", "0", [
          ["0", "Normal (0)"],
          ["10", "Somnolence / lethargy (+10)"],
          ["20", "Stupor (+20)"],
          ["30", "Coma (+30)"]
        ]),
        makeS("gi", "GI features (ileus, anorexia, severe obstipation)", "0", [
          ["0", "Absent (0)"],
          ["10", "Present (+10)"]
        ]),
        makeS("cv", "Cardiovascular (bradycardia <50, hypotension SBP <90)", "0", [
          ["0", "Absent (0)"],
          ["10", "Present (+10)"]
        ]),
        makeS("precip", "Precipitating illness / trauma / infection", "0", [
          ["0", "Absent (0)"],
          ["10", "Present (+10)"]
        ])
      ],
      table: {
        headers: ["Popoveniuc Score", "Risk Stratification", "Emergency Action Protocol"],
        rows: [
          { id: "low", cols: ["< 25 Points", "Low Risk", "Standard oral levothyroxine replacement"] },
          { id: "intermediate", cols: ["25 – 59 Points", "Intermediate Risk", "Inpatient admission, close monitoring, IV hydrocortisone"] },
          { id: "high", cols: ["≥ 60 Points", "High Risk of Myxedema Coma", "EMERGENCY: ICU, stress-dose IV Hydrocortisone, loading dose IV Levothyroxine ± T3"] }
        ]
      },
      calc: function (v) {
        var total = +v.temp + +v.cns + +v.gi + +v.cv + +v.precip;
        var match = "low";
        var c = total >= 60 ? "High risk for Myxedema Coma (≥60 points; start IV levothyroxine, T3, & hydrocortisone)" : total >= 25 ? "Intermediate risk" : "Low risk (<25 points)";
        if (total >= 60) match = "high";
        else if (total >= 25) match = "intermediate";
        return {
          value: total + " points — " + c,
          matchId: match,
          eq: "Popoveniuc criteria. Stress-dose glucocorticoids must precede thyroid hormone replacement to avoid acute adrenal crisis."
        };
      }
    },
    {
      id: "tiradsRef",
      cat: "endo",
      type: "class",
      name: "Thyroid Nodule ACR TI-RADS Reference",
      desc: "Ultrasound scoring categories and biopsy thresholds for thyroid nodules.",
      organ: "Thyroid",
      region: "Thyroid Ultrasound / Oncology",
      subject: "Thyroid Nodule Risk Stratification",
      keywords: ["ti-rads", "acr tirads", "thyroid nodule", "fna biopsy", "ultrasound"],
      guidance: "ACR TI-RADS risk stratification assigns points for composition, echogenicity, shape, margin, and echogenic foci to determine FNA biopsy thresholds.\nStandardized ultrasound reporting to avoid unnecessary biopsies of benign thyroid nodules.",
      contraindications: "Does not apply to nodules with known high-risk history (prior neck irradiation, PET-positive nodules).",
      literature: [
        {
          type: "ACR White Paper",
          icon: "📘",
          title: "ACR Thyroid Imaging Reporting and Data System (TI-RADS): White Paper of the ACR TI-RADS Committee",
          citation: "Tessler FN, Middleton WD, Grant EG, et al. J Am Coll Radiol. 2017;14(5):587-595.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/28372917/" }]
        }
      ],
      fields: [
        makeS("points", "Total ACR TI-RADS ultrasound points", "tr3", [
          ["tr1", "0 points: TR1 (Benign — 0.3% malignancy risk)"],
          ["tr2", "2 points: TR2 (Not suspicious — 1.5% risk)"],
          ["tr3", "3 points: TR3 (Mildly suspicious — 4.8% risk)"],
          ["tr4", "4–6 points: TR4 (Moderately suspicious — 9.1% risk)"],
          ["tr5", "≥7 points: TR5 (Highly suspicious — 35% risk)"]
        ])
      ],
      table: {
        headers: ["TI-RADS Category", "Malignancy Risk", "FNA Biopsy Cut-off", "US Follow-up Cut-off"],
        rows: [
          { id: "tr1", cols: ["TR1 (0 pts)", "0.3%", "No FNA", "No follow-up"] },
          { id: "tr2", cols: ["TR2 (2 pts)", "1.5%", "No FNA", "No follow-up"] },
          { id: "tr3", cols: ["TR3 (3 pts)", "4.8%", "FNA if ≥ 2.5 cm", "Follow US if ≥ 1.5 cm"] },
          { id: "tr4", cols: ["TR4 (4–6 pts)", "9.1%", "FNA if ≥ 1.5 cm", "Follow US if ≥ 1.0 cm"] },
          { id: "tr5", cols: ["TR5 (≥7 pts)", "35%", "FNA if ≥ 1.0 cm", "Follow US if ≥ 0.5 cm"] }
        ]
      },
      calc: function (v) {
        var txt = "";
        var match = v.points;
        if (v.points === "tr1" || v.points === "tr2") txt = "No FNA biopsy required.";
        else if (v.points === "tr3") txt = "FNA if nodule ≥2.5 cm; follow on ultrasound if ≥1.5 cm.";
        else if (v.points === "tr4") txt = "FNA if nodule ≥1.5 cm; follow on ultrasound if ≥1.0 cm.";
        else txt = "FNA if nodule ≥1.0 cm; follow on ultrasound if ≥0.5 cm.";
        return {
          value: v.points.toUpperCase() + " — " + txt,
          matchId: match,
          eq: "ACR TI-RADS evaluates composition, echogenicity, shape (taller-than-wide), margins, and echogenic foci."
        };
      }
    },
    {
      id: "thyroidVolCalc",
      cat: "endo",
      type: "calc",
      name: "Thyroid Volume Calculator",
      desc: "Calculates total thyroid volume from 3-axis ultrasound measurements.",
      organ: "Thyroid",
      region: "Thyroid Ultrasound",
      subject: "Thyroid Volumetry / Goiter",
      keywords: ["thyroid volume", "ellipsoid formula", "goiter", "ultrasound"],
      guidance: "Calculates thyroid volume using ellipsoid formula: Length × Width × Depth × 0.52 for each lobe. Normal volume is typically <18 mL in women and <25 mL in men.\nQuantifies goiter enlargement and responses to therapy or radioactive iodine.",
      contraindications: "Excludes thyroid isthmus volume unless significantly thickened (>3–4 mm).",
      literature: [
        {
          type: "Ultrasound Reference",
          icon: "📄",
          title: "Ultrasonographic determination of thyroid volume: comparison with gross morphology",
          citation: "Brunn J, Block U, Ruf G, et al. Dtsch Med Wochenschr. 1981;106(41):1338-1340.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/7285870/" }]
        }
      ],
      fields: [
        makeN("r_l", "Right Lobe Length (cm)", 4.5, { min: 1, max: 15, step: 0.1 }),
        makeN("r_w", "Right Lobe Width (cm)", 1.8, { min: 0.5, max: 10, step: 0.1 }),
        makeN("r_d", "Right Lobe Depth (cm)", 1.5, { min: 0.5, max: 10, step: 0.1 }),
        makeN("l_l", "Left Lobe Length (cm)", 4.2, { min: 1, max: 15, step: 0.1 }),
        makeN("l_w", "Left Lobe Width (cm)", 1.7, { min: 0.5, max: 10, step: 0.1 }),
        makeN("l_d", "Left Lobe Depth (cm)", 1.4, { min: 0.5, max: 10, step: 0.1 })
      ],
      table: {
        headers: ["Gender Category", "Normal Volume Threshold", "Goiter Threshold"],
        rows: [
          { id: "female", cols: ["Female Adult", "< 18 mL", "> 18 mL (Thyromegaly)"] },
          { id: "male", cols: ["Male Adult", "< 25 mL", "> 25 mL (Thyromegaly)"] }
        ]
      },
      calc: function (v) {
        var rVol = +v.r_l * +v.r_w * +v.r_d * 0.523;
        var lVol = +v.l_l * +v.l_w * +v.l_d * 0.523;
        var total = rVol + lVol;
        var match = total > 25 ? "male" : "female";
        var c = total > 25 ? "Enlarged (Goiter: >25 mL in males, >18 mL in females)" : "Normal volume";
        return {
          value: total.toFixed(1) + " mL (R: " + rVol.toFixed(1) + " mL | L: " + lVol.toFixed(1) + " mL) — " + c,
          matchId: match,
          eq: "Ellipsoid formula: Volume (mL) = Length × Width × Depth × 0.523 for each lobe. Isthmus excluded unless thickened."
        };
      }
    },
    {
      id: "lt4DoseHelper",
      cat: "endo",
      type: "calc",
      name: "Levothyroxine Dose-Estimation Helper",
      desc: "Initial oral replacement dose in primary overt hypothyroidism.",
      organ: "Thyroid / Systemic",
      region: "Thyroid Disorders / Therapeutics",
      subject: "Levothyroxine Dosing",
      keywords: ["levothyroxine", "lt4 dose", "hypothyroidism", "replacement therapy"],
      guidance: "Full replacement levothyroxine dose is approximately 1.6 mcg/kg/day ideal body weight. Start lower (25–50 mcg/day) in elderly patients or those with coronary artery disease.\nCalculates initial replacement dose for primary hypothyroidism.",
      contraindications: "Uncorrected adrenal insufficiency (must give hydrocortisone prior to initiating levothyroxine).",
      literature: [
        {
          type: "ATA Guidelines",
          icon: "📘",
          title: "Guidelines for the Treatment of Hypothyroidism: Prepared by the American Thyroid Association Task Force on Thyroid Hormone Replacement",
          citation: "Jonklaas J, Bianco AC, Bauer AJ, et al. Thyroid. 2014;24(12):1670-1751.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/25266247/" }]
        }
      ],
      fields: [
        makeN("weight", "Patient Weight (kg)", 70, { min: 30, max: 250 }),
        makeS("category", "Patient Category", "adult", [
          ["adult", "Healthy adult (<60 years, no cardiac disease: 1.6 mcg/kg)"],
          ["elderly", "Elderly or known ischemic heart disease (conservative: 25–50 mcg/day)"],
          ["subclinical", "Subclinical hypothyroidism (partial replacement: 25–50 mcg/day)"]
        ])
      ],
      table: {
        headers: ["Patient Subgroup", "Dosing Rule", "Titration Schedule"],
        rows: [
          { id: "adult", cols: ["Young / Healthy Adult", "1.6 mcg/kg IBW / day", "Recheck TSH in 6–8 weeks"] },
          { id: "elderly", cols: ["Elderly / CAD", "25–50 mcg / day starting dose", "Titrate by 12.5–25 mcg q6–8wks"] },
          { id: "subclinical", cols: ["Subclinical Hypo", "25–50 mcg / day partial dose", "Titrate to target TSH"] }
        ]
      },
      calc: function (v) {
        if (v.category === "elderly" || v.category === "subclinical") {
          return {
            value: "25–50 mcg orally once daily",
            matchId: v.category,
            eq: "Start low and titrate by 12.5–25 mcg every 6–8 weeks based on serum TSH."
          };
        }
        var dose = Math.round((+v.weight * 1.6) / 12.5) * 12.5;
        return {
          value: dose + " mcg orally once daily (1.6 mcg/kg)",
          matchId: "adult",
          eq: "Levothyroxine replacement = 1.6 mcg/kg ideal body weight. Take on an empty stomach with water 30–60 minutes before breakfast."
        };
      }
    },

    // ==============================================================
    // C. ADRENAL DISORDERS
    // ==============================================================
    {
      id: "arrCalc",
      cat: "endo",
      type: "calc",
      name: "Aldosterone-to-Renin Ratio (ARR)",
      desc: "Screens for primary aldosteronism using PAC and PRA.",
      organ: "Adrenal / Kidneys",
      region: "Adrenal Disorders / Endocrine Hypertension",
      subject: "Primary Aldosteronism Screening",
      keywords: ["arr", "aldosterone", "renin", "primary aldosteronism", "conn"],
      guidance: "Aldosterone-to-Renin Ratio (ARR) = PAC (ng/dL) ÷ PRA (ng/mL/h). A ratio ≥20–30 with PAC ≥10–15 ng/dL screens positive for primary aldosteronism.\nFirst-line screening test for primary hyperaldosteronism in treatment-resistant hypertension.",
      contraindications: "Spironolactone, eplerenone, and potassium-wasting diuretics must be held 4–6 weeks prior.",
      literature: [
        {
          type: "Endocrine Society Guideline",
          icon: "📘",
          title: "The Management of Primary Aldosteronism: Case Detection, Diagnosis, and Treatment",
          citation: "Funder JW, Carey RM, Mantero F, et al. J Clin Endocrinol Metab. 2016;101(5):1889-1916.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/26934393/" }]
        }
      ],
      fields: [
        makeN("pac", "Plasma Aldosterone Concentration (PAC, ng/dL)", 24, { min: 1, max: 200, step: 0.5 }),
        makeN("pra", "Plasma Renin Activity (PRA, ng/mL/h)", 0.6, { min: 0.1, max: 50, step: 0.1 })
      ],
      table: {
        headers: ["Screening Outcome", "ARR Value", "PAC Cut-Off", "Next Clinical Step"],
        rows: [
          { id: "neg", cols: ["Negative Screen", "< 20", "PAC < 10 ng/dL", "Primary aldosteronism unlikely"] },
          { id: "pos", cols: ["POSITIVE SCREEN", "≥ 20", "PAC ≥ 10 ng/dL", "Confirmatory salt loading / saline infusion test"] }
        ]
      },
      calc: function (v) {
        var arr = +v.pac / +v.pra;
        var isPos = arr >= 20 && +v.pac >= 10;
        var match = isPos ? "pos" : "neg";
        var c = isPos ? "POSITIVE SCREEN (ARR ≥20 and PAC ≥10 ng/dL; confirmatory suppression test indicated)" : "Negative screening ratio (<20)";
        return {
          value: "ARR: " + arr.toFixed(1) + " (ng/dL per ng/mL/h) — " + c,
          matchId: match,
          eq: "ARR = PAC (ng/dL) ÷ PRA (ng/mL/h). Hold mineralocorticoid receptor antagonists (spironolactone/eplerenone) ≥4–6 weeks prior."
        };
      }
    },
    {
      id: "cortisolUnitConv",
      cat: "endo",
      type: "calc",
      name: "Cortisol Unit Conversion",
      desc: "Converts serum cortisol between µg/dL and nmol/L.",
      organ: "Adrenal / Blood",
      region: "Adrenal Axis / Laboratory",
      subject: "Cortisol Unit Conversion",
      keywords: ["cortisol conversion", "ug/dl to nmol/l", "adrenal assay"],
      guidance: "Converts serum cortisol between µg/dL and nmol/L (1 µg/dL = 27.59 nmol/L).\nEssential for interpreting international endocrine trial results and laboratory assays.",
      contraindications: "Does not adjust for changes in cortisol-binding globulin (CBG) in pregnancy or oral estrogen use.",
      literature: [
        {
          type: "Reference Manual",
          icon: "📄",
          title: "Tietz Textbook of Clinical Chemistry and Molecular Diagnostics",
          citation: "Rifai N, ed. 6th ed. Elsevier; 2018.",
          links: [{ text: "View Source ↗", url: "https://www.elsevier.com" }]
        }
      ],
      fields: [
        makeN("val", "Cortisol Value", 18, { min: 0.1, max: 2000, step: 0.1 }),
        makeS("dir", "Conversion Direction", "ug_to_nmol", [
          ["ug_to_nmol", "µg/dL to nmol/L"],
          ["nmol_to_ug", "nmol/L to µg/dL"]
        ])
      ],
      table: {
        headers: ["Conversion Direction", "Multiplier / Divisor", "Reference Morning Peak"],
        rows: [
          { id: "ug_to_nmol", cols: ["µg/dL to nmol/L", "Multiply by 27.59", "140 – 690 nmol/L"] },
          { id: "nmol_to_ug", cols: ["nmol/L to µg/dL", "Divide by 27.59", "5 – 25 µg/dL"] }
        ]
      },
      calc: function (v) {
        if (v.dir === "ug_to_nmol") {
          var res = +v.val * 27.59;
          return { value: res.toFixed(1) + " nmol/L", matchId: "ug_to_nmol", eq: "Formula: µg/dL × 27.59 = nmol/L. Standard morning peak is ~140–690 nmol/L (5–25 µg/dL)." };
        } else {
          var res = +v.val / 27.59;
          return { value: res.toFixed(2) + " µg/dL", matchId: "nmol_to_ug", eq: "Formula: nmol/L ÷ 27.59 = µg/dL." };
        }
      }
    },
    {
      id: "acthStimInterp",
      cat: "endo",
      type: "class",
      name: "ACTH Stimulation Test Interpretation",
      desc: "Standard 250 mcg cosyntropin stimulation test interpretation.",
      organ: "Adrenal Cortex",
      region: "Adrenal Axis / Diagnostics",
      subject: "Adrenal Insufficiency Testing",
      keywords: ["acth stim", "cosyntropin", "synacthen", "adrenal insufficiency", "cortisol peak"],
      guidance: "Short Synacthen (250 mcg cosyntropin) test: a peak serum cortisol ≥18–20 µg/dL (500 nmol/L) at 30 or 60 minutes rules out primary adrenal insufficiency.\nConfirmatory testing protocol for suspected adrenal failure.",
      contraindications: "May yield false-normal peak in acute secondary adrenal insufficiency (pituitary injury <2–4 weeks ago).",
      literature: [
        {
          type: "Endocrine Society Guideline",
          icon: "📘",
          title: "Diagnosis and Treatment of Primary Adrenal Insufficiency: An Endocrine Society Clinical Practice Guideline",
          citation: "Bornstein SR, Allolio B, Arlt W, et al. J Clin Endocrinol Metab. 2016;101(2):364-389.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/26760000/" }]
        }
      ],
      fields: [
        makeN("peak", "Peak 30-min or 60-min Cortisol (µg/dL)", 19.5, { min: 1, max: 80, step: 0.1 })
      ],
      table: {
        headers: ["Peak Cortisol Level", "Response Classification", "Diagnostic Interpretation"],
        rows: [
          { id: "normal", cols: ["≥ 18.0 µg/dL (≥500 nmol/L)", "Normal Cortisol Response", "Rules out primary adrenal insufficiency"] },
          { id: "subnormal", cols: ["< 18.0 µg/dL (<500 nmol/L)", "Subnormal Response", "Confirms adrenal insufficiency (primary or chronic secondary)"] }
        ]
      },
      calc: function (v) {
        var p = +v.peak;
        var match = p >= 18.0 ? "normal" : "subnormal";
        var c = p >= 18.0 ? "Normal cortisol response (Peak ≥18.0 µg/dL rules out primary adrenal insufficiency)" : "Subnormal response (<18.0 µg/dL; indicates primary or chronic secondary adrenal insufficiency)";
        return {
          value: p + " µg/dL — " + c,
          matchId: match,
          eq: "Diagnostic criteria: Normal peak cortisol is ≥18 µg/dL (or ≥14–15 µg/dL on newer monoclonal assays). Check baseline ACTH."
        };
      }
    },
    {
      id: "dstInterpRef",
      cat: "endo",
      type: "class",
      name: "Dexamethasone Suppression Test (DST)",
      desc: "Overnight 1 mg dexamethasone suppression test interpretation for Cushing syndrome.",
      organ: "Adrenal / Pituitary / Hypothalamus",
      region: "Adrenal Axis / Diagnostics",
      subject: "Cushing Syndrome Screening",
      keywords: ["dst", "dexamethasone suppression", "cushing syndrome", "hypercortisolism"],
      guidance: "Overnight 1 mg dexamethasone suppression test: morning post-dexamethasone cortisol ≤1.8 µg/dL (50 nmol/L) excludes autonomous hypercortisolism.\nFirst-line screening test for Cushing syndrome and autonomous cortisol secretion.",
      contraindications: "False positives caused by CYP3A4 inducers (phenytoin, carbamazepine) accelerating dexamethasone metabolism.",
      literature: [
        {
          type: "Endocrine Society Guideline",
          icon: "📘",
          title: "The Diagnosis of Cushing's Syndrome: An Endocrine Society Clinical Practice Guideline",
          citation: "Nieman LK, Biller BM, Findling JW, et al. J Clin Endocrinol Metab. 2008;93(5):1526-1540.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/18337428/" }]
        }
      ],
      fields: [
        makeN("post_cort", "Post-dexamethasone 8 AM Cortisol (µg/dL)", 1.2, { min: 0.2, max: 50, step: 0.1 })
      ],
      table: {
        headers: ["8 AM Post-Dex Cortisol", "Suppression Status", "Clinical Pathway"],
        rows: [
          { id: "normal", cols: ["≤ 1.8 µg/dL (≤50 nmol/L)", "Normal Suppression", "Excludes autonomous hypercortisolism / Cushing syndrome"] },
          { id: "abnormal", cols: ["> 1.8 µg/dL (>50 nmol/L)", "Abnormal / Non-suppressed", "Suspected Cushing syndrome; proceed to 24-hr UFC or late-night salivary cortisol"] }
        ]
      },
      calc: function (v) {
        var c = +v.post_cort;
        var match = c <= 1.8 ? "normal" : "abnormal";
        var s = c <= 1.8 ? "Normal suppression (≤1.8 µg/dL [≤50 nmol/L]; excludes autonomous hypercortisolism)" : "Abnormal / Non-suppressed (>1.8 µg/dL; autonomous cortisol secretion / Cushing syndrome suspected)";
        return {
          value: c + " µg/dL — " + s,
          matchId: match,
          eq: "Cut-off is 1.8 µg/dL (50 nmol/L) for high diagnostic sensitivity. Confirm with 24-hr urinary free cortisol or late-night salivary cortisol."
        };
      }
    },

    // ==============================================================
    // D. PITUITARY AND HYPOTHALAMUS
    // ==============================================================
    {
      id: "waterDeprivRef",
      cat: "endo",
      type: "class",
      name: "Water Deprivation Test Interpretation",
      desc: "Distinguishes central DI, nephrogenic DI, and primary polydipsia.",
      organ: "Pituitary / Hypothalamus / Kidneys",
      region: "Pituitary Axis / Neuroendocrinology",
      subject: "Diabetes Insipidus / Polyuria",
      keywords: ["water deprivation", "diabetes insipidus", "ddavp", "adh", "polydipsia"],
      guidance: "Interprets water deprivation testing: differentiates central diabetes insipidus, nephrogenic DI, and primary polydipsia based on urine osmolality before and after desmopressin.\nGold-standard protocol for unexplained polyuria–polydipsia syndromes.",
      contraindications: "Stop test immediately if serum sodium exceeds 145 mEq/L or body weight drops >5%.",
      literature: [
        {
          type: "Clinical Review",
          icon: "📄",
          title: "Diagnosis and management of diabetes insipidus for the endocrinologist",
          citation: "Christ-Crain M, Bichet DG, Fenske WK, et al. Nat Rev Endocrinol. 2019;15(10):573-585.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/31417195/" }]
        }
      ],
      fields: [
        makeS("pre", "Urine Osmolality after dehydration (prior to DDAVP)", "low", [
          ["low", "Dilute urine (<300 mOsm/kg)"],
          ["iso", "Intermediate (300–750 mOsm/kg)"],
          ["high", "Concentrated (>750 mOsm/kg; normal)"]
        ]),
        makeS("post", "Response to Desmopressin (DDAVP)", "rise50", [
          ["rise50", ">50% increase in urine osmolality"],
          ["rise10", "<10% to 50% increase in urine osmolality"],
          ["no_rise", "<10% minimal or no increase"]
        ])
      ],
      table: {
        headers: ["Pre-DDAVP Urine Osmolality", "Post-DDAVP Response", "Diagnostic Outcome"],
        rows: [
          { id: "polydipsia", cols: ["> 750 mOsm/kg", "N/A", "Primary Polydipsia (Intact ADH response)"] },
          { id: "centralDi", cols: ["< 300 mOsm/kg", "> 50% Rise", "Complete Central Diabetes Insipidus"] },
          { id: "nephroDi", cols: ["< 300 mOsm/kg", "< 10% Rise", "Complete Nephrogenic Diabetes Insipidus"] },
          { id: "partialDi", cols: ["300 – 750 mOsm/kg", "10% – 50% Rise", "Partial Central or Partial Nephrogenic DI"] }
        ]
      },
      calc: function (v) {
        var dx = "";
        var match = "partialDi";
        if (v.pre === "high") { dx = "Primary Polydipsia (normal renal concentrating response with intact endogenous ADH)."; match = "polydipsia"; }
        else if (v.pre === "low" && v.post === "rise50") { dx = "Complete Central Diabetes Insipidus (deficiency of ADH corrected by exogenous DDAVP)."; match = "centralDi"; }
        else if (v.pre === "low" && v.post === "no_rise") { dx = "Complete Nephrogenic Diabetes Insipidus (renal resistance to ADH; no response to DDAVP)."; match = "nephroDi"; }
        else { dx = "Partial Central DI vs Partial Nephrogenic DI vs chronic primary polydipsia with medullary washout."; match = "partialDi"; }
        return {
          value: dx,
          matchId: match,
          eq: "Serial monitoring of plasma osmolality, urine osmolality, and weight loss during dehydration is mandatory."
        };
      }
    },
    {
      id: "prolactinConv",
      cat: "endo",
      type: "calc",
      name: "Prolactin Unit Conversion & Assessment",
      desc: "Converts prolactin between ng/mL and mIU/L and evaluates hyperprolactinemia.",
      organ: "Pituitary Gland",
      region: "Pituitary Axis / Neuroendocrinology",
      subject: "Hyperprolactinemia / Prolactinoma",
      keywords: ["prolactin", "prolactinoma", "ng/ml to miu/l", "pituitary adenoma"],
      guidance: "Converts prolactin between ng/mL and mIU/L (1 ng/mL ≈ 21.2 mIU/L). Levels >200–250 ng/mL strongly indicate prolactinoma.\nDiagnostic evaluation for hyperprolactinemia, galactorrhea, and pituitary adenomas.",
      contraindications: "Rule out macroprolactinemia via polyethylene glycol (PEG) precipitation when asymptomatic.",
      literature: [
        {
          type: "Endocrine Society Guideline",
          icon: "📘",
          title: "Diagnosis and Treatment of Hyperprolactinemia: An Endocrine Society Clinical Practice Guideline",
          citation: "Melmed S, Casanueva FF, Hoffman AR, et al. J Clin Endocrinol Metab. 2011;96(2):273-288.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/21296991/" }]
        }
      ],
      fields: [
        makeN("val", "Prolactin Value", 85, { min: 1, max: 10000, step: 1 }),
        makeS("dir", "Units", "ng_ml", [
          ["ng_ml", "ng/mL (µg/L)"],
          ["miu_l", "mIU/L"]
        ])
      ],
      table: {
        headers: ["Prolactin Range (ng/mL)", "Clinical Category", "Likely Etiology"],
        rows: [
          { id: "normal", cols: ["< 25 ng/mL", "Normal Range", "Physiological baseline"] },
          { id: "mild", cols: ["25 – 100 ng/mL", "Mild Hyperprolactinemia", "Drugs (antipsychotics), stalk compression, microadenoma, hypothyroidism"] },
          { id: "moderate", cols: ["100 – 250 ng/mL", "Moderate Elevation", "Prolactinoma highly probable"] },
          { id: "macro", cols: ["> 250 ng/mL", "Massive Elevation", "Diagnostic of Macroprolactinoma"] }
        ]
      },
      calc: function (v) {
        var ng = v.dir === "ng_ml" ? +v.val : +v.val / 21.2;
        var miu = v.dir === "ng_ml" ? +v.val * 21.2 : +v.val;
        var match = "normal";
        var c = "";
        if (ng > 250) { match = "macro"; c = "Massive elevation (>250 ng/mL; virtually diagnostic of macroprolactinoma)"; }
        else if (ng > 100) { match = "moderate"; c = "Moderate elevation (100–250 ng/mL; prolactinoma likely)"; }
        else if (ng > 25) { match = "mild"; c = "Mild hyperprolactinemia (medications, stalk effect, microadenoma, hypothyroidism)"; }
        else { match = "normal"; c = "Normal prolactin (<25 ng/mL)"; }
        return {
          value: ng.toFixed(1) + " ng/mL (" + Math.round(miu) + " mIU/L) — " + c,
          matchId: match,
          eq: "Conversion: 1 ng/mL ≈ 21.2 mIU/L. In massive adenomas with normal prolactin, rule out 'hook effect' via serial sample dilution."
        };
      }
    },

    // ==============================================================
    // E. CALCIUM, PHOSPHATE AND BONE METABOLISM
    // ==============================================================
    {
      id: "corrCalcium",
      cat: "endo",
      type: "calc",
      name: "Albumin-Corrected Calcium",
      desc: "Adjusts total serum calcium for hypoalbuminemia or hyperalbuminemia.",
      organ: "Parathyroid / Bones / Blood",
      region: "Calcium & Bone Metabolism",
      subject: "Calcium Homeostasis",
      keywords: ["corrected calcium", "albumin calcium", "hypercalcemia", "hypocalcemia"],
      guidance: "Corrected Calcium = Total Calcium (mg/dL) + 0.8 × (4.0 − Serum Albumin [g/dL]).\nAdjusts total calcium for albumin binding changes; ionized calcium remains preferred.",
      contraindications: "Unreliable in severe renal failure or critical care acid-base derangements.",
      literature: [
        {
          type: "Clinical Reference",
          icon: "📄",
          title: "Interpretation of serum total calcium concentration",
          citation: "Payne RB, Little AJ, Williams RB, Milner JR. Br Med J. 1973;4(5893):643-646.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/4763133/" }]
        }
      ],
      fields: [
        makeN("ca", "Measured Total Calcium (mg/dL)", 8.2, { min: 3, max: 20, step: 0.1 }),
        makeN("alb", "Serum Albumin (g/dL)", 2.8, { min: 0.5, max: 6.0, step: 0.1 })
      ],
      table: {
        headers: ["Corrected Calcium Range", "Diagnostic Status", "Management Focus"],
        rows: [
          { id: "hypo", cols: ["< 8.5 mg/dL", "Hypocalcemia", "Check PTH, 25(OH)D, serum magnesium"] },
          { id: "norm", cols: ["8.5 – 10.5 mg/dL", "Normal", "Physiological normocalcemia"] },
          { id: "hyper", cols: ["> 10.5 mg/dL", "Hypercalcemia", "Evaluate PTH, PTHrP, SPEP/UPEP"] }
        ]
      },
      calc: function (v) {
        var corr = +v.ca + 0.8 * (4.0 - +v.alb);
        var match = "norm";
        var c = corr > 10.5 ? "Hypercalcemia (>10.5 mg/dL)" : corr < 8.5 ? "Hypocalcemia (<8.5 mg/dL)" : "Normal corrected calcium (8.5–10.5 mg/dL)";
        if (corr > 10.5) match = "hyper";
        else if (corr < 8.5) match = "hypo";
        return {
          value: corr.toFixed(2) + " mg/dL — " + c,
          matchId: match,
          eq: "Formula: Corrected Calcium = Measured Total Calcium + 0.8 × (4.0 − Albumin [g/dL])."
        };
      }
    },
    {
      id: "feCaCalc",
      cat: "endo",
      type: "calc",
      name: "Fractional Excretion of Calcium (FECa)",
      desc: "Differentiates Primary Hyperparathyroidism from Familial Hypocalciuric Hypercalcemia (FHH).",
      organ: "Parathyroid / Kidneys",
      region: "Calcium & Bone Metabolism",
      subject: "Differential Diagnosis of Hypercalcemia",
      keywords: ["feca", "fhh", "primary hyperparathyroidism", "calcium clearance"],
      guidance: "FECa = [(Urine Ca × Serum Cr) ÷ (Serum Ca × Urine Cr)]. FECa <0.01 (<1%) suggests Familial Hypocalciuric Hypercalcemia (FHH); >0.02 (>2%) favors Primary Hyperparathyroidism.\nDifferentiates primary hyperparathyroidism from familial hypocalciuric hypercalcemia.",
      contraindications: "Thiazide diuretics alter renal calcium excretion and must be discontinued prior to evaluation.",
      literature: [
        {
          type: "Clinical Guideline",
          icon: "📘",
          title: "Guidelines for the Management of Asymptomatic Primary Hyperparathyroidism",
          citation: "Bilezikian JP, Brandi ML, Eastell R, et al. J Clin Endocrinol Metab. 2014;99(10):3561-3579.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/25162401/" }]
        }
      ],
      fields: [
        makeN("uca", "24-h Urine Calcium (mg/dL)", 8.5, { min: 0.5, max: 80, step: 0.1 }),
        makeN("scr", "Serum Creatinine (mg/dL)", 1.0, { min: 0.2, max: 15, step: 0.05 }),
        makeN("sca", "Serum Total Calcium (mg/dL)", 10.8, { min: 7, max: 20, step: 0.1 }),
        makeN("ucr", "24-h Urine Creatinine (mg/dL)", 85, { min: 5, max: 500, step: 1 })
      ],
      table: {
        headers: ["FECa Percentage", "Diagnostic Suggestion", "Genetic / Surgical Indication"],
        rows: [
          { id: "fhh", cols: ["< 1.0% (<0.01)", "Familial Hypocalciuric Hypercalcemia (FHH)", "Avoid parathyroidectomy; consider CASR gene sequencing"] },
          { id: "gray", cols: ["1.0% – 2.0%", "Overlapping / Indeterminate Zone", "Genetic testing / clinical correlation required"] },
          { id: "phpt", cols: ["> 2.0% (>0.02)", "Primary Hyperparathyroidism (PHPT)", "Parathyroid surgical consultation indicated"] }
        ]
      },
      calc: function (v) {
        var feca = (+v.uca * +v.scr) / (+v.sca * +v.ucr);
        var match = "gray";
        var c = feca < 0.01 ? "FECa <0.01 (<1%): Suggests Familial Hypocalciuric Hypercalcemia (FHH)" : feca > 0.02 ? "FECa >0.02 (>2%): Favors Primary Hyperparathyroidism" : "Intermediate / Gray zone (0.01–0.02; genetic testing may be required)";
        if (feca < 0.01) match = "fhh";
        else if (feca > 0.02) match = "phpt";
        return {
          value: (feca * 100).toFixed(2) + "% (" + feca.toFixed(4) + ") — " + c,
          matchId: match,
          eq: "FECa = (Urine Ca × Serum Cr) ÷ (Serum Ca × Urine Cr). Values must use identical units (mg/dL)."
        };
      }
    },
    {
      id: "tscoreClass",
      cat: "endo",
      type: "class",
      name: "Osteoporosis T-Score Classification",
      desc: "WHO bone mineral density diagnostic criteria by dual-energy X-ray absorptiometry (DXA).",
      organ: "Skeleton / Bone",
      region: "Calcium & Bone Metabolism",
      subject: "Bone Densitometry / Osteoporosis",
      keywords: ["t-score", "dxa", "osteoporosis", "osteopenia", "who criteria"],
      guidance: "WHO T-score criteria: Normal (≥ −1.0), Osteopenia (−1.0 to −2.5), Osteoporosis (≤ −2.5), Severe Osteoporosis (≤ −2.5 plus fragility fracture).\nDiagnostic criteria for dual-energy X-ray absorptiometry (DXA) bone mineral density.",
      contraindications: "In men <50 years and premenopausal women, Z-scores (< -2.0) should be utilized instead of T-scores.",
      literature: [
        {
          type: "WHO Technical Report",
          icon: "📘",
          title: "Assessment of fracture risk and its application to screening for postmenopausal osteoporosis",
          citation: "World Health Organization. WHO Tech Rep Ser. 1994;843:1-129.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/7941614/" }]
        }
      ],
      fields: [
        makeN("tscore", "Lowest DXA T-Score (L-spine, total hip, or femoral neck)", -2.7, { min: -6.0, max: 3.0, step: 0.1 }),
        makeS("fx", "Prior adult low-trauma / fragility fracture?", "0", [
          ["0", "No"],
          ["1", "Yes"]
        ])
      ],
      table: {
        headers: ["DXA T-Score Category", "T-Score Range", "Clinical Diagnosis", "Treatment Threshold"],
        rows: [
          { id: "normal", cols: ["Normal", "≥ −1.0", "Normal Bone Density", "Lifestyle, adequate Ca / Vit D"] },
          { id: "osteopenia", cols: ["Osteopenia", "−1.0 to −2.5", "Low Bone Mass", "Evaluate FRAX for pharmacotherapy"] },
          { id: "osteoporosis", cols: ["Osteoporosis", "≤ −2.5", "Osteoporosis", "Pharmacotherapy indicated (Bisphosphonates/Anabolics)"] },
          { id: "severe", cols: ["Severe Osteoporosis", "≤ −2.5 + Fragility Fx", "Severe / Established Osteoporosis", "Urgent anabolic or antiresorptive therapy"] }
        ]
      },
      calc: function (v) {
        var t = +v.tscore, fx = v.fx === "1";
        var c = "";
        var match = "normal";
        if (t <= -2.5 && fx) { c = "Severe (Established) Osteoporosis (T-score ≤ −2.5 plus fragility fracture)"; match = "severe"; }
        else if (t <= -2.5) { c = "Osteoporosis (T-score ≤ −2.5)"; match = "osteoporosis"; }
        else if (t < -1.0) { c = "Osteopenia / Low Bone Mass (−1.0 to −2.5)"; match = "osteopenia"; }
        else { c = "Normal Bone Mineral Density (T-score ≥ −1.0)"; match = "normal"; }
        return {
          value: c + " (T-score: " + t.toFixed(1) + ")",
          matchId: match,
          eq: "WHO criteria apply to postmenopausal women and men ≥50 years. Use Z-scores (< −2.0 = below expected) in younger populations."
        };
      }
    },
    {
      id: "vitDConv",
      cat: "endo",
      type: "calc",
      name: "Vitamin D Unit Conversion & Status",
      desc: "Converts 25(OH)D between ng/mL and nmol/L.",
      organ: "Bone / Systemic",
      region: "Calcium & Bone Metabolism",
      subject: "Vitamin D Deficiency",
      keywords: ["vitamin d", "25-oh-d", "ng/ml to nmol/l", "cholecalciferol"],
      guidance: "Converts 25-hydroxyvitamin D: 1 ng/mL = 2.5 nmol/L. Sufficiency is generally defined as ≥20–30 ng/mL (50–75 nmol/L).\nInterprets 25(OH)D nutritional status across laboratory unit conventions.",
      contraindications: "Measures total 25(OH)D; does not reflect active 1,25(OH)2D levels in renal failure.",
      literature: [
        {
          type: "Endocrine Society Guideline",
          icon: "📘",
          title: "Evaluation, Treatment, and Prevention of Vitamin D Deficiency: An Endocrine Society Clinical Practice Guideline",
          citation: "Holick MF, Binkley NC, Bischoff-Ferrari HA, et al. J Clin Endocrinol Metab. 2011;96(7):1911-1930.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/21646368/" }]
        }
      ],
      fields: [
        makeN("val", "25-hydroxyvitamin D Value", 22, { min: 1, max: 250 }),
        makeS("unit", "Entered Unit", "ng_ml", [
          ["ng_ml", "ng/mL (µg/L)"],
          ["nmol_l", "nmol/L"]
        ])
      ],
      table: {
        headers: ["Status Category", "Cut-off (ng/mL)", "Cut-off (nmol/L)", "Clinical Recommendation"],
        rows: [
          { id: "severe", cols: ["Severe Deficiency", "< 12 ng/mL", "< 30 nmol/L", "High-dose ergocalciferol / cholecalciferol (50,000 IU weekly)"] },
          { id: "deficient", cols: ["Deficiency", "12 – 19 ng/mL", "30 – 49 nmol/L", "Vitamin D supplementation 2000–5000 IU daily"] },
          { id: "insufficient", cols: ["Insufficiency", "20 – 29 ng/mL", "50 – 74 nmol/L", "Maintenance supplementation 1000–2000 IU daily"] },
          { id: "sufficient", cols: ["Sufficiency", "30 – 100 ng/mL", "75 – 250 nmol/L", "Target physiological sufficiency"] }
        ]
      },
      calc: function (v) {
        var ng = v.unit === "ng_ml" ? +v.val : +v.val / 2.5;
        var nmol = v.unit === "ng_ml" ? +v.val * 2.5 : +v.val;
        var match = "sufficient";
        var c = "";
        if (ng < 12) { match = "severe"; c = "Severe Deficiency (<12 ng/mL [<30 nmol/L])"; }
        else if (ng < 20) { match = "deficient"; c = "Deficiency (12–19 ng/mL [30–49 nmol/L])"; }
        else if (ng < 30) { match = "insufficient"; c = "Insufficiency (20–29 ng/mL [50–74 nmol/L])"; }
        else { match = "sufficient"; c = "Sufficiency (30–100 ng/mL [75–250 nmol/L])"; }
        return {
          value: ng.toFixed(1) + " ng/mL (" + Math.round(nmol) + " nmol/L) — " + c,
          matchId: match,
          eq: "Conversion factor: 1 ng/mL = 2.5 nmol/L."
        };
      }
    },
    {
      id: "fraxPlanned",
      cat: "endo",
      type: "class",
      name: "FRAX Fracture Risk Calculator",
      desc: "Planned — WHO 10-year major osteoporotic and hip fracture risk model.",
      organ: "Skeleton / Bone",
      region: "Calcium & Bone Metabolism",
      subject: "Osteoporosis Fracture Risk Assessment",
      keywords: ["frax", "fracture risk", "osteoporosis", "10-year risk"],
      guidance: "Planned — FRAX WHO fracture risk assessment tool integration.\nPredicts 10-year probability of major osteoporotic and hip fractures.",
      contraindications: "Full country-specific FRAX models require online algorithm license integration.",
      literature: [
        {
          type: "WHO Paper",
          icon: "📄",
          title: "FRAX and the assessment of fracture probability in postmenopausal women",
          citation: "Kanis JA, Oden A, Johansson H, et al. Osteoporos Int. 2008;19(4):385-397.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/18292978/" }]
        }
      ],
      fields: [
        makeS("status", "Integration Status", "planned", [
          ["planned", "Planned FRAX Integration Module"]
        ])
      ],
      table: {
        headers: ["Status", "Description", "Next Step"],
        rows: [
          { id: "planned", cols: ["Planned Module", "FRAX WHO Fracture Risk Algorithm", "Integration pending official API hook"] }
        ]
      },
      calc: function (v) {
        return {
          value: "Planned — FRAX Integration",
          matchId: "planned",
          eq: "Predicts 10-year probability of major osteoporotic fracture and hip fracture."
        };
      }
    },

    // ==============================================================
    // F. OBESITY AND METABOLIC SYNDROME
    // ==============================================================
    {
      id: "whrCalc",
      cat: "endo",
      type: "calc",
      name: "Waist-to-Hip Ratio",
      desc: "Evaluates visceral fat distribution and cardiometabolic risk.",
      organ: "Adipose Tissue / Vascular System",
      region: "Obesity & Metabolic Risk",
      subject: "Central Adiposity Assessment",
      keywords: ["waist to hip ratio", "whr", "visceral fat", "central obesity"],
      guidance: "Waist-to-Hip Ratio = Waist (cm) ÷ Hip (cm). Substantial risk: >0.90 in men, >0.85 in women.\nEvaluates central visceral adiposity and cardiovascular risk.",
      contraindications: "Unreliable during active pregnancy or large abdominal ascites.",
      literature: [
        {
          type: "WHO Consultation Report",
          icon: "📘",
          title: "Waist Circumference and Waist-Hip Ratio: Report of a WHO Expert Consultation",
          citation: "World Health Organization. Geneva: WHO; 2008.",
          links: [{ text: "View WHO Report ↗", url: "https://www.who.int/publications/i/item/9789241598415" }]
        }
      ],
      fields: [
        makeN("waist", "Waist Circumference (cm)", 92, { min: 30, max: 250 }),
        makeN("hip", "Hip Circumference (cm)", 98, { min: 30, max: 250 }),
        makeS("sex", "Sex", "male", [
          ["male", "Male"],
          ["female", "Female"]
        ])
      ],
      table: {
        headers: ["Sex", "Low Risk Threshold", "Increased Risk Threshold", "Substantial Risk Threshold"],
        rows: [
          { id: "male", cols: ["Male", "< 0.90", "0.90 – 0.95", "> 0.95"] },
          { id: "female", cols: ["Female", "< 0.80", "0.80 – 0.85", "> 0.85"] }
        ]
      },
      calc: function (v) {
        var ratio = +v.waist / +v.hip;
        var thresh = v.sex === "male" ? 0.90 : 0.85;
        var match = v.sex;
        var c = ratio >= thresh ? "Substantially increased risk (≥" + thresh + "; abdominal visceral adiposity)" : "Low to moderate risk (<" + thresh + ")";
        return {
          value: ratio.toFixed(2) + " — " + c,
          matchId: match,
          eq: "WHR = Waist (cm) ÷ Hip (cm). WHO cut-offs for central obesity: >0.90 in men, >0.85 in women."
        };
      }
    },
    {
      id: "whtrCalc",
      cat: "endo",
      type: "calc",
      name: "Waist-to-Height Ratio",
      desc: "Cardiometabolic risk screening tool across sexes and ethnicities.",
      organ: "Adipose Tissue / Systemic",
      region: "Obesity & Metabolic Risk",
      subject: "Height-Adjusted Central Obesity",
      keywords: ["whtr", "waist to height ratio", "cardiometabolic risk", "visceral fat"],
      guidance: "Waist-to-Height Ratio = Waist (cm) ÷ Height (cm). A ratio ≥0.50 indicates increased cardiometabolic risk ('keep your waist circumference to less than half your height').\nSimple, height-adjusted screening tool for central obesity across ethnic groups.",
      contraindications: "Does not distinguish muscle mass from fat mass in extreme athletes.",
      literature: [
        {
          type: "Systematic Review",
          icon: "📄",
          title: "Waist-to-height ratio is a better screening tool than waist circumference and BMI for adult cardiometabolic risk factors",
          citation: "Ashwell M, Gunn P, Gibson S. Obes Rev. 2012;13(3):275-286.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/22106927/" }]
        }
      ],
      fields: [
        makeN("waist", "Waist Circumference (cm)", 88, { min: 30, max: 250 }),
        makeN("height", "Height (cm)", 172, { min: 60, max: 250 })
      ],
      table: {
        headers: ["WHtR Ratio", "Risk Category", "Action Recommendation"],
        rows: [
          { id: "healthy", cols: ["< 0.50", "Healthy", "Keep waist to less than half your height"] },
          { id: "increased", cols: ["0.50 – 0.59", "Increased Risk", "Lifestyle intervention recommended"] },
          { id: "veryHigh", cols: ["≥ 0.60", "Very High Risk", "Medical assessment for metabolic complications"] }
        ]
      },
      calc: function (v) {
        var ratio = +v.waist / +v.height;
        var match = "healthy";
        var c = ratio >= 0.60 ? "Very high cardiometabolic risk (≥0.60)" : ratio >= 0.50 ? "Increased cardiometabolic risk (0.50–0.59)" : "Healthy waist-to-height ratio (<0.50)";
        if (ratio >= 0.60) match = "veryHigh";
        else if (ratio >= 0.50) match = "increased";
        return {
          value: ratio.toFixed(2) + " — " + c,
          matchId: match,
          eq: "Waist-to-Height Ratio = Waist ÷ Height. General recommendation: keep waist to less than half your height (<0.50)."
        };
      }
    },
    {
      id: "ibwAbwCalc",
      cat: "endo",
      type: "calc",
      name: "Ideal & Adjusted Body Weight",
      desc: "Devine formula for IBW and Adjusted Body Weight (ABW) for obese drug dosing.",
      organ: "Adipose Tissue / Systemic",
      region: "Obesity & Pharmacology",
      subject: "Weight Dosing Metrics",
      keywords: ["ibw", "abw", "devine formula", "ideal body weight", "adjusted body weight"],
      guidance: "Devine formula for Ideal Body Weight (IBW). Adjusted Body Weight (ABW) = IBW + 0.4 × (Actual Weight − IBW).\nUsed for dosing hydrophilic medications and setting ventilator tidal volumes in obesity.",
      contraindications: "Devine equation is unvalidated for adults under 5 feet (152 cm) in height.",
      literature: [
        {
          type: "Seminal Paper",
          icon: "📄",
          title: "Gentamicin therapy: clinical application of single daily dosing protocol",
          citation: "Devine BJ. Drug Intell Clin Pharm. 1974;8:650-655.",
          links: [{ text: "View Source ↗", url: "https://pubmed.ncbi.nlm.nih.gov" }]
        }
      ],
      fields: [
        makeN("height", "Height (cm)", 175, { min: 140, max: 240 }),
        makeN("weight", "Actual Weight (kg)", 95, { min: 30, max: 300 }),
        makeS("sex", "Sex", "male", [
          ["male", "Male"],
          ["female", "Female"]
        ])
      ],
      table: {
        headers: ["Sex", "Devine IBW Formula", "ABW Correction Multiplier"],
        rows: [
          { id: "male", cols: ["Male", "50 kg + 2.3 kg per inch >5 feet", "IBW + 0.4 × (Actual − IBW)"] },
          { id: "female", cols: ["Female", "45.5 kg + 2.3 kg per inch >5 feet", "IBW + 0.4 × (Actual − IBW)"] }
        ]
      },
      calc: function (v) {
        var htInches = +v.height / 2.54;
        var inchesOver5Ft = Math.max(0, htInches - 60);
        var ibw = v.sex === "male" ? 50 + 2.3 * inchesOver5Ft : 45.5 + 2.3 * inchesOver5Ft;
        var abw = ibw + 0.4 * (+v.weight - ibw);
        return {
          value: "IBW: " + ibw.toFixed(1) + " kg | ABW: " + abw.toFixed(1) + " kg",
          matchId: v.sex,
          eq: "Devine IBW: 50 kg (men) or 45.5 kg (women) + 2.3 kg per inch >5 ft. ABW = IBW + 0.4 × (Actual − IBW)."
        };
      }
    },
    {
      id: "weightLossPct",
      cat: "endo",
      type: "calc",
      name: "Weight-Loss Percentage Calculator",
      desc: "Tracks total percentage body weight loss during anti-obesity therapy.",
      organ: "Adipose Tissue / Systemic",
      region: "Obesity Management",
      subject: "Therapeutic Weight Loss Monitoring",
      keywords: ["weight loss percentage", "tbwl", "obesity therapy", "semaglutide", "tirzepatide"],
      guidance: "Weight Loss % = [(Initial Weight − Current Weight) ÷ Initial Weight] × 100%. A loss of ≥5–10% yields proven cardiometabolic improvements.\nMonitors pharmacological and lifestyle obesity treatment efficacy.",
      contraindications: "Does not differentiate lean mass loss from fat mass loss without DXA/bioimpedance.",
      literature: [
        {
          type: "Clinical Guideline",
          icon: "📘",
          title: "Management of Obesity in Adults: European Clinical Practice Guidelines",
          citation: "Yumuk V, Tsigos C, Fried M, et al. Obes Facts. 2015;8(6):402-424.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/26641646/" }]
        }
      ],
      fields: [
        makeN("init_wt", "Initial / Baseline Weight (kg)", 105, { min: 30, max: 350 }),
        makeN("curr_wt", "Current Weight (kg)", 94, { min: 25, max: 350 })
      ],
      table: {
        headers: ["Weight Loss %", "Clinical Benefit Tier", "Metabolic Impact"],
        rows: [
          { id: "minimal", cols: ["< 5%", "Minimal", "Limited metabolic change"] },
          { id: "meaningful", cols: ["5% – 9.9%", "Clinically Meaningful", "Improves glycemic control, BP, and lipids"] },
          { id: "substantial", cols: ["10% – 14.9%", "Substantial Benefit", "Reduces NASH, sleep apnea, OA pain"] },
          { id: "exceptional", cols: ["≥ 15%", "Exceptional Benefit", "Can drive T2D remission & reduce ASCVD events"] }
        ]
      },
      calc: function (v) {
        var lost = +v.init_wt - +v.curr_wt;
        var pct = (lost / +v.init_wt) * 100;
        var match = "minimal";
        var c = pct >= 15 ? "Exceptional loss (≥15%; reverses metabolic complications and diabetes)" : pct >= 10 ? "Substantial clinical benefit (10–14.9%)" : pct >= 5 ? "Clinically meaningful weight loss (5–9.9%)" : "Minimal weight loss (<5%)";
        if (pct >= 15) match = "exceptional";
        else if (pct >= 10) match = "substantial";
        else if (pct >= 5) match = "meaningful";
        return {
          value: pct.toFixed(1) + "% (" + lost.toFixed(1) + " kg lost) — " + c,
          matchId: match,
          eq: "Percentage Weight Loss = [(Initial Weight − Current Weight) ÷ Initial Weight] × 100%."
        };
      }
    },

    // ==============================================================
    // G. DIABETES EMERGENCIES
    // ==============================================================
    {
      id: "dkaHhsClassifier",
      cat: "endo",
      type: "class",
      name: "DKA & HHS Diagnostic Criteria & Severity",
      desc: "Consensus criteria classifying DKA severity vs Hyperosmolar Hyperglycemic State.",
      organ: "Pancreas / Kidneys / Blood",
      region: "Endocrine Emergencies / Critical Care",
      subject: "Hyperglycemic Crises",
      keywords: ["dka", "hhs", "diabetic ketoacidosis", "hyperosmolar state"],
      guidance: "Classifies DKA vs HHS based on glucose, arterial pH, bicarbonate, ketones, and effective serum osmolality. DKA requires acidosis and ketosis; HHS features severe hyperglycemia with hyperosmolality without ketoacidosis.\nDifferentiates acute hyperglycemic crises to direct fluid and insulin protocols.",
      contraindications: "Euglycemic DKA (SGLT2 inhibitors) presents with lower glucose (<250 mg/dL) despite severe acidosis.",
      literature: [
        {
          type: "ADA Consensus Report",
          icon: "📘",
          title: "Management of Hyperglycemic Crises in Adults",
          citation: "Kitabchi AE, Umpierrez GE, Miles JM, Fisher JN. Diabetes Care. 2009;32(7):1335-1343.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/19564476/" }]
        }
      ],
      fields: [
        makeN("glu", "Blood Glucose (mg/dL)", 450, { min: 100, max: 2500 }),
        makeN("ph", "Arterial pH", 7.18, { min: 6.5, max: 7.6, step: 0.01 }),
        makeN("hco3", "Serum Bicarbonate (mEq/L)", 11, { min: 1, max: 45 }),
        makeS("ketones", "Urine / Serum Ketones", "pos", [
          ["pos", "Positive"],
          ["neg", "Negative"]
        ]),
        makeN("osmol", "Effective Serum Osmolality (mOsm/kg)", 305, { min: 250, max: 450 }),
        makeS("sensorium", "Mental Status", "alert", [
          ["alert", "Alert"],
          ["drowsy", "Drowsy / Lethargic"],
          ["stupor", "Stupor / Coma"]
        ])
      ],
      table: {
        headers: ["Crisis Type", "Glucose (mg/dL)", "Arterial pH", "Bicarbonate (mEq/L)", "Effective Osmolality"],
        rows: [
          { id: "mildDka", cols: ["Mild DKA", "> 250", "7.25 – 7.30", "15 – 18", "Variable"] },
          { id: "modDka", cols: ["Moderate DKA", "> 250", "7.00 – 7.24", "10 – 14", "Variable"] },
          { id: "sevDka", cols: ["Severe DKA", "> 250", "< 7.00", "< 10", "Variable"] },
          { id: "hhs", cols: ["HHS", "> 600", "> 7.30", "> 18", "> 320 mOsm/kg"] }
        ]
      },
      calc: function (v) {
        var g = +v.glu, ph = +v.ph, hco3 = +v.hco3, osm = +v.osmol;
        var res = "";
        var match = "modDka";
        if (g > 600 && ph > 7.30 && hco3 > 18 && osm > 320 && (v.sensorium !== "alert")) {
          res = "Hyperosmolar Hyperglycemic State (HHS)";
          match = "hhs";
        } else if (v.ketones === "pos") {
          if (ph < 7.00 || hco3 < 10 || v.sensorium === "stupor") { res = "Severe Diabetic Ketoacidosis (DKA)"; match = "sevDka"; }
          else if (ph <= 7.24 || (hco3 >= 10 && hco3 <= 14)) { res = "Moderate Diabetic Ketoacidosis (DKA)"; match = "modDka"; }
          else if (ph <= 7.30 && hco3 >= 15) { res = "Mild Diabetic Ketoacidosis (DKA)"; match = "mildDka"; }
          else { res = "Hyperglycemia with ketosis (borderline / resolving DKA)"; match = "mildDka"; }
        } else {
          res = "Hyperglycemia without confirmed ketoacidosis or hyperosmolar state";
          match = "mildDka";
        }
        return {
          value: res,
          matchId: match,
          eq: "DKA requires hyperglycemia, ketosis, and metabolic acidosis. HHS features glucose >600 mg/dL, pH >7.30, HCO₃ >18, and effective osmolality >320 mOsm/kg."
        };
      }
    },
    {
      id: "effOsmolality",
      cat: "endo",
      type: "calc",
      name: "Effective & Total Serum Osmolality",
      desc: "Calculates effective hypertonicity (excluding urea) in hyperglycemic emergencies.",
      organ: "Vascular System / Brain",
      region: "Endocrine Emergencies",
      subject: "Serum Osmolality / Tonicity",
      keywords: ["effective osmolality", "tonicity", "hhs", "dka osmolality"],
      guidance: "Effective Serum Osmolality = 2×Na + (Glucose ÷ 18). Excludes urea because it is a freely permeable solute. Diagnostic criterion for HHS is >320 mOsm/kg.\nCalculates hypertonicity driving intracellular dehydration in diabetic ketoacidosis and hyperosmolar hyperglycemic state.",
      contraindications: "Does not account for unmeasured exogenous osmoles (ethanol, methanol, ethylene glycol).",
      literature: [
        {
          type: "Clinical Review",
          icon: "📄",
          title: "Serum Osmolality and Tonicity: Clinical Applications",
          citation: "Rasouli M. Clin Biochem. 2016;49(12):936-941.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/27041443/" }]
        }
      ],
      fields: [
        makeN("na", "Serum Sodium (mEq/L)", 134, { min: 100, max: 180 }),
        makeN("glu", "Serum Glucose (mg/dL)", 650, { min: 50, max: 2500 }),
        makeN("bun", "BUN (mg/dL)", 38, { min: 2, max: 200 })
      ],
      table: {
        headers: ["Osmolality Parameter", "Calculation Formula", "HHS Cut-off Threshold"],
        rows: [
          { id: "effective", cols: ["Effective Osmolality (Tonicity)", "2×Na + (Glucose ÷ 18)", "> 320 mOsm/kg (Diagnostic for HHS)"] },
          { id: "total", cols: ["Total Osmolality", "Effective + (BUN ÷ 2.8)", "N/A (Urea freely permeable)"] }
        ]
      },
      calc: function (v) {
        var eff = (2 * +v.na) + (+v.glu / 18);
        var tot = eff + (+v.bun / 2.8);
        var match = eff > 320 ? "effective" : "total";
        var c = eff > 320 ? "Meets HHS diagnostic threshold (>320 mOsm/kg; severe hypertonicity)" : "Effective osmolality ≤320 mOsm/kg";
        return {
          value: "Effective: " + Math.round(eff) + " mOsm/kg | Total: " + Math.round(tot) + " mOsm/kg (" + c + ")",
          matchId: match,
          eq: "Effective Osmolality = 2×Na + (Glucose ÷ 18). Total Osmolality = Effective + (BUN ÷ 2.8). Urea is omitted from effective osmolality because it is permeable."
        };
      }
    },

    // ==============================================================
    // H. REPRODUCTIVE ENDOCRINOLOGY
    // ==============================================================
    {
      id: "rotterdamPcos",
      cat: "endo",
      type: "class",
      name: "Rotterdam Criteria for PCOS",
      desc: "International diagnostic consensus checklist for polycystic ovary syndrome.",
      organ: "Ovary / Endocrine Axis",
      region: "Reproductive Endocrinology",
      subject: "PCOS Diagnostics",
      keywords: ["pcos", "rotterdam", "polycystic ovary", "hyperandrogenism", "anovulation"],
      guidance: "Rotterdam 2003 criteria: Diagnosis requires ≥2 of: 1) Oligo- or anovulation, 2) Clinical/biochemical hyperandrogenism, 3) Polycystic ovaries on ultrasound (or elevated AMH).\nStandard international diagnostic framework for polycystic ovary syndrome.",
      contraindications: "Must exclude thyroid disease, hyperprolactinemia, non-classical CAH, and Cushing syndrome.",
      literature: [
        {
          type: "Consensus Statement",
          icon: "📘",
          title: "Revised 2003 consensus on diagnostic criteria for polycystic ovary syndrome",
          citation: "Rotterdam ESHRE/ASRM-Sponsored PCOS Consensus Workshop Group. Fertil Steril. 2004;81(1):19-25.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/14711538/" }]
        }
      ],
      fields: [
        makeS("ovul", "1. Ovulatory dysfunction (oligo- or anovulation, cycle >35 days)", "1", [
          ["0", "No"],
          ["1", "Yes"]
        ]),
        makeS("androgen", "2. Clinical or biochemical hyperandrogenism (hirsutism, acne, elevated testosterone)", "1", [
          ["0", "No"],
          ["1", "Yes"]
        ]),
        makeS("us", "3. Polycystic ovarian morphology on US (≥20 follicles per ovary or volume ≥10 mL) OR elevated serum AMH", "1", [
          ["0", "No"],
          ["1", "Yes"]
        ]),
        makeS("exclude", "Exclusion of other etiologies (CAH, hyperprolactinemia, thyroid dysfunction, Cushing)", "1", [
          ["1", "Other etiologies excluded"],
          ["0", "Other etiologies NOT excluded"]
        ])
      ],
      table: {
        headers: ["Phenotype Criteria Met", "PCOS Diagnosis Status", "Clinical Recommendation"],
        rows: [
          { id: "positive", cols: ["≥ 2 of 3 Criteria Met", "PCOS CONFIRMED", "Evaluate metabolic risk (OGTT, lipids) & manage symptoms"] },
          { id: "negative", cols: ["< 2 Criteria Met", "PCOS Unconfirmed", "Investigate alternative causes of menstrual irregularity"] }
        ]
      },
      calc: function (v) {
        if (v.exclude === "0") return { value: "Criteria not met (alternative etiologies must be excluded)", matchId: "negative", eq: "Exclude non-classical CAH, prolactinoma, thyroid disease." };
        var count = +v.ovul + +v.androgen + +v.us;
        var isPos = count >= 2;
        var match = isPos ? "positive" : "negative";
        return {
          value: isPos ? "POSITIVE for PCOS (meets " + count + " of 3 Rotterdam criteria)" : "Negative for PCOS (<2 criteria met)",
          matchId: match,
          eq: "Rotterdam 2003 criteria: Requires at least 2 of 3 features once secondary causes of hyperandrogenism and anovulation are excluded."
        };
      }
    },
    {
      id: "faiCalc",
      cat: "endo",
      type: "calc",
      name: "Free Androgen Index (FAI)",
      desc: "Estimates circulating active testosterone relative to SHBG in females.",
      organ: "Ovary / Adrenal / Blood",
      region: "Reproductive Endocrinology",
      subject: "Biochemical Hyperandrogenism",
      keywords: ["fai", "free androgen index", "shbg", "testosterone", "pcos"],
      guidance: "Free Androgen Index (FAI) = (Total Testosterone [nmol/L] ÷ SHBG [nmol/L]) × 100. FAI >4.5–5% suggests hyperandrogenemia in females.\nSurrogate measure of biologically active circulating testosterone.",
      contraindications: "Total testosterone MUST be entered in nmol/L (multiply ng/dL by 0.0347 to convert to nmol/L).",
      literature: [
        {
          type: "Clinical Guideline",
          icon: "📘",
          title: "Assessment and management of polycystic ovary syndrome: summary of an international evidence-based guideline",
          citation: "Teede HJ, Misso ML, Costello MF, et al. Med J Aust. 2018;209(7):S22-S32.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/30185603/" }]
        }
      ],
      fields: [
        makeN("testo", "Total Testosterone (nmol/L)", 2.8, { min: 0.1, max: 20, step: 0.1 }),
        makeN("shbg", "SHBG (nmol/L)", 32, { min: 2, max: 250, step: 1 })
      ],
      table: {
        headers: ["FAI Percentage", "Female Androgen Status", "Clinical Context"],
        rows: [
          { id: "normal", cols: ["≤ 5.0%", "Normal", "Normal androgen activity"] },
          { id: "elevated", cols: ["> 5.0%", "Elevated FAI", "Biochemical hyperandrogenism (PCOS indicator)"] }
        ]
      },
      calc: function (v) {
        var fai = (+v.testo / +v.shbg) * 100;
        var match = fai > 5.0 ? "elevated" : "normal";
        var c = fai > 5.0 ? "Elevated FAI (>5.0%; biochemical hyperandrogenism)" : "Normal female FAI range (≤5.0%)";
        return {
          value: fai.toFixed(1) + "% — " + c,
          matchId: match,
          eq: "Formula: FAI = (Total Testosterone [nmol/L] ÷ SHBG [nmol/L]) × 100. Note: Total testosterone must be entered in nmol/L."
        };
      }
    },
    {
      id: "lhFshRatio",
      cat: "endo",
      type: "calc",
      name: "LH/FSH Ratio Calculator",
      desc: "Calculates luteinizing hormone to follicle-stimulating hormone ratio.",
      organ: "Pituitary / Ovary",
      region: "Reproductive Endocrinology",
      subject: "Gonadotropin Evaluation",
      keywords: ["lh fsh ratio", "gonadotropins", "pcos", "pituitary pulse"],
      guidance: "LH/FSH ratio is often elevated (>2.0–3.0) in polycystic ovary syndrome due to pulsatile GnRH abnormalities.\nAdjunctive supportive biomarker in anovulatory reproductive disorders.",
      contraindications: "Must be measured in early follicular phase (days 2–5 of cycle). Not diagnostic on its own.",
      literature: [
        {
          type: "Clinical Study",
          icon: "📄",
          title: "Diagnostic value of LH/FSH ratio in polycystic ovary syndrome",
          citation: "Malini NA, George K. J Hum Reprod Sci. 2018;11(2):176-180.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/30158814/" }]
        }
      ],
      fields: [
        makeN("lh", "LH (IU/L)", 14.5, { min: 0.1, max: 100, step: 0.1 }),
        makeN("fsh", "FSH (IU/L)", 5.2, { min: 0.1, max: 100, step: 0.1 })
      ],
      table: {
        headers: ["LH/FSH Ratio", "Diagnostic Support", "Clinical Interpretation"],
        rows: [
          { id: "normal", cols: ["≤ 2.0", "Normal Ratio", "Balanced gonadotropin secretion"] },
          { id: "elevated", cols: ["> 2.0", "Elevated Ratio", "Characteristic of GnRH pulsatility alteration in PCOS"] }
        ]
      },
      calc: function (v) {
        var ratio = +v.lh / +v.fsh;
        var match = ratio > 2.0 ? "elevated" : "normal";
        var c = ratio > 2.0 ? "Elevated (>2.0; characteristic of pulsatile GnRH abnormalities in PCOS)" : "Normal LH/FSH ratio (≤2.0)";
        return {
          value: ratio.toFixed(2) + " — " + c,
          matchId: match,
          eq: "Ratio = LH (IU/L) ÷ FSH (IU/L). Early follicular phase sample preferred. Supportive but not diagnostic on its own."
        };
      }
    },
    {
      id: "ferrimanGallwey",
      cat: "endo",
      type: "class",
      name: "Modified Ferriman–Gallwey Hirsutism Score",
      desc: "Clinical visual score across 9 androgen-sensitive body areas (0–4 each).",
      organ: "Skin / Hair Follicles",
      region: "Reproductive Endocrinology",
      subject: "Clinical Hirsutism Grading",
      keywords: ["mfg", "ferriman gallwey", "hirsutism", "pcos", "hair score"],
      guidance: "Modified Ferriman–Gallwey (mFG) scores terminal hair growth across 9 body regions (0–4 each). Score ≥4–8 (population-dependent) indicates hirsutism.\nClinical standard for grading androgen-dependent hair growth in women.",
      contraindications: "Cosmetic hair removal within 3 months masks baseline score.",
      literature: [
        {
          type: "Endocrine Society Guideline",
          icon: "📘",
          title: "Evaluation and Treatment of Hirsutism in Premenopausal Women: An Endocrine Society Clinical Practice Guideline",
          citation: "Martin KA, Anderson RR, Chang RJ, et al. J Clin Endocrinol Metab. 2018;103(4):1233-1257.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/29522147/" }]
        }
      ],
      fields: [
        makeN("score", "Total sum score of 9 body regions (0 to 36)", 9, { min: 0, max: 36, step: 1 }),
        makeS("eth", "Ethnic Background", "caucasian", [
          ["caucasian", "Caucasian / Black (cut-off ≥8)"],
          ["mediterranean", "Mediterranean / Middle Eastern / South Asian (cut-off ≥9–10)"],
          ["asian", "East Asian (cut-off ≥4)"]
        ])
      ],
      table: {
        headers: ["Ethnicity Group", "Diagnostic Hirsutism Threshold", "Clinical Management"],
        rows: [
          { id: "caucasian", cols: ["Caucasian / Black", "Score ≥ 8", "Combined oral contraceptives + anti-androgens"] },
          { id: "mediterranean", cols: ["Mediterranean / South Asian", "Score ≥ 9 – 10", "Combined oral contraceptives + anti-androgens"] },
          { id: "asian", cols: ["East Asian", "Score ≥ 4", "Combined oral contraceptives + anti-androgens"] }
        ]
      },
      calc: function (v) {
        var s = +v.score;
        var cut = 8;
        if (v.eth === "mediterranean") cut = 9;
        else if (v.eth === "asian") cut = 4;
        var match = v.eth;
        var c = s >= cut ? "Hirsutism present (score ≥" + cut + ")" : "Normal hair distribution (<" + cut + ")";
        return {
          value: s + " / 36 points — " + c,
          matchId: match,
          eq: "Evaluates upper lip, chin, chest, upper back, lower back, upper abdomen, lower abdomen, upper arms, and thighs (0–4 each)."
        };
      }
    },

    // ==============================================================
    // I. LIPID AND METABOLIC RISK
    // ==============================================================
    {
      id: "lipidRatios",
      cat: "endo",
      type: "calc",
      name: "Lipid Fractions, Ratios & Remnants",
      desc: "Calculates Non-HDL-C, Triglyceride/HDL ratio, Total/HDL ratio, and Remnant cholesterol.",
      organ: "Vascular System / Liver",
      region: "Lipid & Metabolic Risk",
      subject: "Atherogenic Lipid Profiling",
      keywords: ["lipid ratio", "non-hdl", "tg hdl ratio", "remnant cholesterol", "ascvd"],
      guidance: "Calculates Non-HDL-C (Total Chol − HDL), Total/HDL ratio, Triglyceride/HDL ratio, and Remnant Cholesterol (Total Chol − HDL − LDL).\nAtherogenic lipid profiling beyond isolated LDL cholesterol.",
      contraindications: "Friedewald estimation of LDL becomes invalid if triglycerides >400 mg/dL.",
      literature: [
        {
          type: "AHA/ACC Guideline",
          icon: "📘",
          title: "2018 AHA/ACC/AACVPR/AAPA/ABC/ACPM/ADA/AGS/APhA/ASPC/NLA/PCNA Guideline on the Management of Blood Cholesterol",
          citation: "Grundy SM, Stone NJ, Bailey AL, et al. Circulation. 2019;139(25):e1082-e1143.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/30586586/" }]
        }
      ],
      fields: [
        makeN("tc", "Total Cholesterol (mg/dL)", 220, { min: 50, max: 600 }),
        makeN("hdl", "HDL Cholesterol (mg/dL)", 42, { min: 10, max: 150 }),
        makeN("tg", "Triglycerides (mg/dL)", 210, { min: 20, max: 2000 }),
        makeN("ldl", "Direct or Friedewald LDL (mg/dL)", 136, { min: 10, max: 400 })
      ],
      table: {
        headers: ["Lipid Metric", "Formula", "Optimal Target"],
        rows: [
          { id: "nonHdl", cols: ["Non-HDL Cholesterol", "Total Chol − HDL", "< 130 mg/dL (Risk dependent)"] },
          { id: "tgHdl", cols: ["TG / HDL Ratio", "Triglycerides ÷ HDL", "< 3.0 (Marker of small dense LDL)"] },
          { id: "remnant", cols: ["Remnant Cholesterol", "Total Chol − HDL − LDL", "< 30 mg/dL"] }
        ]
      },
      calc: function (v) {
        var nonHdl = +v.tc - +v.hdl;
        var tgHdl = +v.tg / +v.hdl;
        var remnant = +v.tc - +v.hdl - +v.ldl;
        return {
          value: "Non-HDL: " + nonHdl + " mg/dL | TG/HDL: " + tgHdl.toFixed(1) + " | Remnant: " + Math.round(remnant) + " mg/dL",
          matchId: "nonHdl",
          eq: "Non-HDL = TC − HDL. TG/HDL >3.0 suggests small dense LDL particles and insulin resistance. Remnant Cholesterol = TC − HDL − LDL."
        };
      }
    },
    {
      id: "metsynCriteria",
      cat: "endo",
      type: "class",
      name: "Metabolic Syndrome Criteria (NCEP ATP III)",
      desc: "Clinical diagnosis based on presence of ≥3 of 5 cardiometabolic traits.",
      organ: "Adipose / Vascular / Liver",
      region: "Lipid & Metabolic Risk",
      subject: "Metabolic Syndrome Diagnostic Criteria",
      keywords: ["metabolic syndrome", "ncep atp iii", "waist", "triglycerides", "hdl", "hypertension", "glucose"],
      guidance: "NCEP ATP III criteria for Metabolic Syndrome: requires ≥3 of: Elevated waist, Elevated triglycerides (≥150), Low HDL, High BP (≥130/85), Impaired fasting glucose (≥100 mg/dL).\nIdentifies clustering of metabolic risk factors for type 2 diabetes and ASCVD.",
      contraindications: "Waist circumference cut-offs vary in Asian populations (men >90 cm, women >80 cm).",
      literature: [
        {
          type: "NCEP Executive Summary",
          icon: "📘",
          title: "Executive Summary of The Third Report of The National Cholesterol Education Program (NCEP) Expert Panel",
          citation: "Expert Panel on Detection, Evaluation, and Treatment of High Blood Cholesterol in Adults. JAMA. 2001;285(19):2486-2497.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/11368702/" }]
        }
      ],
      fields: [
        makeS("waist", "Elevated waist circumference (>102 cm men, >88 cm women)", "1", [
          ["0", "No"],
          ["1", "Yes"]
        ]),
        makeS("tg", "Elevated Triglycerides (≥150 mg/dL or on drug)", "1", [
          ["0", "No"],
          ["1", "Yes"]
        ]),
        makeS("hdl", "Reduced HDL (<40 mg/dL men, <50 mg/dL women)", "1", [
          ["0", "No"],
          ["1", "Yes"]
        ]),
        makeS("bp", "Elevated Blood Pressure (≥130/85 mmHg or treated)", "0", [
          ["0", "No"],
          ["1", "Yes"]
        ]),
        makeS("glu", "Elevated Fasting Glucose (≥100 mg/dL or treated)", "0", [
          ["0", "No"],
          ["1", "Yes"]
        ])
      ],
      table: {
        headers: ["Criteria Count", "Metabolic Syndrome Diagnosis", "Cardiometabolic Risk"],
        rows: [
          { id: "positive", cols: ["≥ 3 of 5 Criteria", "METABOLIC SYNDROME CONFIRMED", "2x ASCVD risk, 5x T2D risk"] },
          { id: "negative", cols: ["< 3 Criteria", "Negative Criteria", "Lower immediate clustering risk"] }
        ]
      },
      calc: function (v) {
        var total = +v.waist + +v.tg + +v.hdl + +v.bp + +v.glu;
        var isPos = total >= 3;
        var match = isPos ? "positive" : "negative";
        return {
          value: isPos ? "POSITIVE for Metabolic Syndrome (" + total + " / 5 criteria met)" : "Negative (" + total + " / 5 criteria met)",
          matchId: match,
          eq: "NCEP ATP III definition: Requires presence of at least 3 of 5 components."
        };
      }
    },

    // ==============================================================
    // J. ENDOCRINE TUMORS AND SPECIALIZED ASSESSMENT
    // ==============================================================
    {
      id: "pheoScreenRef",
      cat: "endo",
      type: "class",
      name: "Pheochromocytoma Biochemical Screening",
      desc: "Interprets plasma free or 24-hr urinary fractionated metanephrines.",
      organ: "Adrenal Medulla / Sympathetic Ganglia",
      region: "Endocrine Tumors / Hypertension",
      subject: "Pheochromocytoma Screening",
      keywords: ["pheochromocytoma", "metanephrines", "catecholamines", "paraganglioma"],
      guidance: "Screening for pheochromocytoma/paraganglioma: Plasma free metanephrines or 24-hr urinary fractionated metanephrines. Elevations >3–4× upper limit of normal strongly support diagnosis.\nInitial biochemical step before anatomical or functional tumor localization.",
      contraindications: "Acetaminophen, SNRIs, and tricyclic antidepressants can cause false-positive metanephrine elevations.",
      literature: [
        {
          type: "Endocrine Society Guideline",
          icon: "📘",
          title: "Pheochromocytoma and Paraganglioma: An Endocrine Society Clinical Practice Guideline",
          citation: "Lenders JW, Duh QY, Eisenhofer G, et al. J Clin Endocrinol Metab. 2014;99(6):1915-1942.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/24893135/" }]
        }
      ],
      fields: [
        makeS("level", "Degree of Elevation above Upper Limit of Normal (ULN)", "mild", [
          ["norm", "Within normal reference limits"],
          ["mild", "Mild elevation (<2× ULN)"],
          ["mod", "Moderate elevation (2–3× ULN)"],
          ["high", "Marked elevation (≥3–4× ULN)"]
        ])
      ],
      table: {
        headers: ["Metanephrine Level", "Diagnostic Interpretation", "Recommended Next Step"],
        rows: [
          { id: "norm", cols: ["Normal Limits", "Pheochromocytoma Ruled Out", "High negative predictive value (>99%)"] },
          { id: "mild", cols: ["< 2× ULN", "Equivocal / Borderline", "Hold interfering drugs, repeat supine or clonidine test"] },
          { id: "high", cols: ["≥ 3–4× ULN", "Highly Suggestive", "Proceed stat to adrenal CT/MRI imaging"] }
        ]
      },
      calc: function (v) {
        var res = "";
        var match = v.level;
        if (v.level === "high") { res = "Highly suggestive of Pheochromocytoma / Paraganglioma (≥3–4× ULN; proceed directly to anatomical CT/MRI imaging)."; match = "high"; }
        else if (v.level === "mod" || v.level === "mild") { res = "Equivocal / Borderline elevation (frequently false-positive from stress or drugs; hold tricyclics/SNRIs/acetaminophen and consider clonidine suppression test)."; match = "mild"; }
        else { res = "Pheochromocytoma virtually ruled out (>99% negative predictive value)."; match = "norm"; }
        return {
          value: res,
          matchId: match,
          eq: "Plasma free metanephrines should be drawn in supine position after 30 minutes of rest to minimize false positives."
        };
      }
    },
    {
      id: "menChecklist",
      cat: "endo",
      type: "class",
      name: "Multiple Endocrine Neoplasia (MEN) Checklist",
      desc: "Clinical and genetic diagnostic features of MEN1, MEN2A, and MEN2B.",
      organ: "Parathyroid / Pituitary / Pancreas / Thyroid",
      region: "Endocrine Tumors / Genetics",
      subject: "Hereditary Endocrine Syndromes",
      keywords: ["men1", "men2a", "men2b", "multiple endocrine neoplasia", "ret", "menin"],
      guidance: "MEN1 (3 Ps: Parathyroid, Pituitary, Pancreatic neuroendocrine tumors); MEN2A (MTC, Pheochromocytoma, Parathyroid); MEN2B (MTC, Pheochromocytoma, mucosal neuromas/marfanoid habitus).\nDiagnostic criteria and screening guide for hereditary multiple endocrine neoplasia syndromes.",
      contraindications: "Genetic testing (MEN1 gene, RET proto-oncogene) is required to confirm suspected clinical cases.",
      literature: [
        {
          type: "Clinical Guideline",
          icon: "📘",
          title: "Clinical Practice Guidelines for Multiple Endocrine Neoplasia Type 1 (MEN1)",
          citation: "Thakker RV, Newey PJ, Walls GV, et al. J Clin Endocrinol Metab. 2012;97(9):2990-3011.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/22723327/" }]
        }
      ],
      fields: [
        makeS("syndrome", "Select MEN Syndrome to review", "men1", [
          ["men1", "MEN1 (Wermer syndrome)"],
          ["men2a", "MEN2A (Sipple syndrome)"],
          ["men2b", "MEN2B"]
        ])
      ],
      table: {
        headers: ["Syndrome", "Primary Tumor Triad", "Associated Gene Mutation"],
        rows: [
          { id: "men1", cols: ["MEN1", "Parathyroid (95%), Pancreas PNET (40-70%), Pituitary (30-40%)", "MEN1 (menin)"] },
          { id: "men2a", cols: ["MEN2A", "Medullary Thyroid Cancer (100%), Pheo (50%), Parathyroid (20-30%)", "RET proto-oncogene"] },
          { id: "men2b", cols: ["MEN2B", "Medullary Thyroid Cancer (100%), Pheo (50%), Mucosal Neuromas", "RET (M918T mutation)"] }
        ]
      },
      calc: function (v) {
        var txt = "";
        var match = v.syndrome;
        if (v.syndrome === "men1") txt = "MEN1 (3 Ps): Parathyroid adenomas / hyperplasia (>95%), Pancreatic neuroendocrine tumors (gastrinoma, insulinoma: 40–70%), Pituitary adenomas (prolactinoma: 30–40%). Gene: MEN1 (menin).";
        else if (v.syndrome === "men2a") txt = "MEN2A: Medullary Thyroid Carcinoma (>95%), Pheochromocytoma (50%), Primary Hyperparathyroidism (20–30%). Gene: RET proto-oncogene.";
        else txt = "MEN2B: Medullary Thyroid Carcinoma (aggressive, early onset), Pheochromocytoma (50%), Mucosal neuromas (lips/tongue), Marfanoid habitus, Intestinal ganglioneuromatosis. Gene: RET (M918T mutation).";
        return {
          value: txt,
          matchId: match,
          eq: "Clinical diagnosis requires ≥2 classic endocrine tumors or 1 tumor plus a first-degree relative with established diagnosis."
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

    var catExists = false;
    for (var i = 0; i < window.categories.length; i++) {
      if (window.categories[i] && window.categories[i].id === endoCategory.id) {
        catExists = true;
        break;
      }
    }
    if (!catExists) {
      window.categories.push(endoCategory);
    }

    endoTools.forEach(function (tool) {
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

    if (typeof window.SYNONYM_MAP === "object" && window.SYNONYM_MAP !== null) {
      window.SYNONYM_MAP["endo"] = ["endo", "endocrinology", "diabetes", "thyroid", "adrenal", "pituitary", "bone", "calcium", "obesity"];
      window.SYNONYM_MAP["diabetes"] = ["hba1c", "eag", "homa", "insulin", "quicki", "tyg", "dka", "hhs", "ogtt"];
      window.SYNONYM_MAP["thyroid"] = ["tsh", "ft4", "bwps", "jta", "myxedema", "tirads", "goiter", "levothyroxine"];
      window.SYNONYM_MAP["adrenal"] = ["arr", "aldosterone", "renin", "cortisol", "acth", "dexamethasone", "cushing"];
      window.SYNONYM_MAP["calcium"] = ["calcium", "feca", "tscore", "osteoporosis", "vitamin d", "frax"];
    }

    if (typeof window.renderHome === "function") {
      window.renderHome();
    }
  } catch (err) {
    console.error("Critical error registering Endocrinology tools:", err);
  }
})();
