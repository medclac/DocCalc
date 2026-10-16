// endo.js
(function () {
  window.MedCalcModules = window.MedCalcModules || [];

  const category = {
    id: "endo",
    name: "Endocrinology & Metabolism",
    icon: "🔬",
    desc: "Diabetes, thyroid, adrenal, pituitary, bone metabolism, and obesity"
  };

  const guidance = {
    // A. Diabetes Mellitus
    eAgCalc: [
      "Translates HbA1c to estimated average glucose (eAG) using the ADAG formula: eAG (mg/dL) = 28.7 × HbA1c − 46.7.",
      "Helps patients relate laboratory HbA1c percentages to daily home glucometer readings."
    ],
    homaIr: [
      "HOMA-IR = (Fasting Glucose [mg/dL] × Fasting Insulin [µIU/mL]) ÷ 405. Values >2.0–2.5 indicate insulin resistance.",
      "Standard research and clinical surrogate measure of basal peripheral insulin resistance."
    ],
    homaBeta: [
      "HOMA-β = (360 × Fasting Insulin [µIU/mL]) ÷ (Fasting Glucose [mg/dL] − 63). Estimates pancreatic beta-cell function.",
      "Evaluates remaining endogenous secretory capacity in early type 2 diabetes and metabolic syndrome."
    ],
    quickiIndex: [
      "QUICKI = 1 ÷ [log(Fasting Glucose mg/dL) + log(Fasting Insulin µIU/mL)]. Values <0.33 indicate impaired insulin sensitivity.",
      "Log-transformed index of insulin sensitivity with high reproducibility."
    ],
    tygIndex: [
      "TyG Index = ln[(Fasting Triglycerides mg/dL × Fasting Glucose mg/dL) ÷ 2]. Values ≥8.5–8.8 identify insulin resistance.",
      "Cost-effective surrogate for insulin resistance when serum insulin assays are unavailable."
    ],
    dmCriteriaRef: [
      "ADA Diagnostic Criteria: Fasting Plasma Glucose ≥126 mg/dL, 2-h OGTT ≥200 mg/dL, HbA1c ≥6.5%, or random glucose ≥200 mg/dL with classic hyperglycemic symptoms.",
      "Consensus thresholds for establishing the clinical diagnosis of diabetes mellitus."
    ],
    tddInsulinHelper: [
      "Estimates total daily insulin dose (TDD): typically 0.4–0.5 units/kg/day in type 1 diabetes and 0.5–1.0+ units/kg/day in insulin-resistant type 2 diabetes.",
      "Provides initial starting doses for basal–bolus insulin regimens."
    ],
    basalBolusCalc: [
      "Splits total daily dose (TDD) into basal (typically 40–50%) and prandial bolus (50–60% divided equally across 3 meals).",
      "Guides physiological insulin replacement titration."
    ],
    corrInsulinCalc: [
      "Correction Factor (ISF) = 1800 ÷ TDD (for rapid-acting analogs) or 1500 ÷ TDD (for regular insulin). Correction dose = (Current Glucose − Target Glucose) ÷ ISF.",
      "Calculates supplemental prandial or bedtime insulin to treat acute hyperglycemia."
    ],
    icrCalc: [
      "Insulin-to-Carbohydrate Ratio (ICR) = 500 ÷ TDD (rule of 500 for rapid analogs). Grams of carbohydrate divided by ICR yields the mealtime bolus.",
      "Determines meal bolus sizing based on planned carbohydrate intake."
    ],
    hypoClassification: [
      "Level 1: Glucose <70 mg/dL (alert value; treat with 15g fast-acting carbs); Level 2: Glucose <54 mg/dL (clinically significant); Level 3: Severe cognitive impairment requiring third-party assistance.",
      "Standard international safety classification for hypoglycemic events."
    ],
    dmRemissionRef: [
      "Diabetes remission is defined as HbA1c <6.5% sustained for ≥3 months in the absence of ongoing glucose-lowering medications.",
      "Guides evaluation following bariatric surgery or intensive lifestyle intervention."
    ],

    // B. Thyroid Disorders
    tshGuide: [
      "Interprets discordant TSH and Free T4 patterns: Primary hypothyroidism, primary hyperthyroidism, subclinical disease, central dysfunction, or thyroid hormone resistance.",
      "Initial diagnostic framework for biochemical thyroid dysfunction."
    ],
    bwpsScore: [
      "Burch–Wartofsky Point Scale evaluates thyroid storm based on thermoregulatory, CNS, GI/hepatic, cardiovascular dysfunction, and precipitant. Score ≥45 denotes thyroid storm.",
      "Aids prompt aggressive bedside initiation of antithyroid medications, iodine, beta-blockers, and corticosteroids."
    ],
    jtaThyroidStorm: [
      "Japanese Thyroid Association diagnostic criteria combine thyrotoxicosis with specific combinations of CNS, fever, tachycardia, CHF, and GI manifestations.",
      "Alternative validated clinical criteria for identifying definite vs suspected thyroid storm."
    ],
    popoveniucScore: [
      "Popoveniuc diagnostic score for myxedema coma based on body temperature, CNS dysfunction, GI features, cardiovascular signs, and precipitating factors.",
      "Quantitative scoring system to support rapid treatment of life-threatening severe hypothyroidism."
    ],
    tiradsRef: [
      "ACR TI-RADS risk stratification assigns points for composition, echogenicity, shape, margin, and echogenic foci to determine FNA biopsy thresholds.",
      "Standardized ultrasound reporting to avoid unnecessary biopsies of benign thyroid nodules."
    ],
    thyroidVolCalc: [
      "Calculates thyroid volume using ellipsoid formula: Length × Width × Depth × 0.52 for each lobe. Normal volume is typically <18 mL in women and <25 mL in men.",
      "Quantifies goiter enlargement and responses to therapy or radioactive iodine."
    ],
    lt4DoseHelper: [
      "Full replacement levothyroxine dose is approximately 1.6 mcg/kg/day ideal body weight. Start lower (25–50 mcg/day) in elderly patients or those with coronary artery disease.",
      "Calculates initial replacement dose for primary hypothyroidism."
    ],

    // C. Adrenal Disorders
    arrCalc: [
      "Aldosterone-to-Renin Ratio (ARR) = PAC (ng/dL) ÷ PRA (ng/mL/h). A ratio ≥20–30 with PAC ≥10–15 ng/dL screens positive for primary aldosteronism.",
      "First-line screening test for primary hyperaldosteronism in treatment-resistant hypertension."
    ],
    cortisolUnitConv: [
      "Converts serum cortisol between µg/dL and nmol/L (1 µg/dL = 27.59 nmol/L).",
      "Essential for interpreting international endocrine trial results and laboratory assays."
    ],
    acthStimInterp: [
      "Short Synacthen (250 mcg cosyntropin) test: a peak serum cortisol ≥18–20 µg/dL (500 nmol/L) at 30 or 60 minutes rules out primary adrenal insufficiency.",
      "Confirmatory testing protocol for suspected adrenal failure."
    ],
    dstInterpRef: [
      "Overnight 1 mg dexamethasone suppression test: morning post-dexamethasone cortisol ≤1.8 µg/dL (50 nmol/L) excludes autonomous hypercortisolism.",
      "First-line screening test for Cushing syndrome and autonomous cortisol secretion."
    ],

    // D. Pituitary and Hypothalamus
    waterDeprivRef: [
      "Interprets water deprivation testing: differentiates central diabetes insipidus, nephrogenic DI, and primary polydipsia based on urine osmolality before and after desmopressin.",
      "Gold-standard protocol for unexplained polyuria–polydipsia syndromes."
    ],
    prolactinConv: [
      "Converts prolactin between ng/mL and mIU/L (1 ng/mL ≈ 21.2 mIU/L). Levels >200–250 ng/mL strongly indicate prolactinoma.",
      "Diagnostic evaluation for hyperprolactinemia, galactorrhea, and pituitary adenomas."
    ],

    // E. Calcium, Phosphate and Bone Metabolism
    corrCalcium: [
      "Corrected Calcium = Total Calcium (mg/dL) + 0.8 × (4.0 − Serum Albumin [g/dL]).",
      "Adjusts total calcium for albumin binding changes; ionized calcium remains preferred."
    ],
    feCaCalc: [
      "FECa = [(Urine Ca × Serum Cr) ÷ (Serum Ca × Urine Cr)]. FECa <0.01 (<1%) suggests Familial Hypocalciuric Hypercalcemia (FHH); >0.02 (>2%) favors Primary Hyperparathyroidism.",
      "Differentiates primary hyperparathyroidism from familial hypocalciuric hypercalcemia."
    ],
    tscoreClass: [
      "WHO T-score criteria: Normal (≥ −1.0), Osteopenia (−1.0 to −2.5), Osteoporosis (≤ −2.5), Severe Osteoporosis (≤ −2.5 plus fragility fracture).",
      "Diagnostic criteria for dual-energy X-ray absorptiometry (DXA) bone mineral density."
    ],
    vitDConv: [
      "Converts 25-hydroxyvitamin D: 1 ng/mL = 2.5 nmol/L. Sufficiency is generally defined as ≥20–30 ng/mL (50–75 nmol/L).",
      "Interprets 25(OH)D nutritional status across laboratory unit conventions."
    ],
    fraxPlanned: [
      "Planned — FRAX WHO fracture risk assessment tool integration.",
      "Predicts 10-year probability of major osteoporotic and hip fractures."
    ],

    // F. Obesity and Metabolic Syndrome
    whrCalc: [
      "Waist-to-Hip Ratio = Waist (cm) ÷ Hip (cm). Substantial risk: >0.90 in men, >0.85 in women.",
      "Evaluates central visceral adiposity and cardiovascular risk."
    ],
    whtrCalc: [
      "Waist-to-Height Ratio = Waist (cm) ÷ Height (cm). A ratio ≥0.50 indicates increased cardiometabolic risk ('keep your waist circumference to less than half your height').",
      "Simple, height-adjusted screening tool for central obesity across ethnic groups."
    ],
    ibwAbwCalc: [
      "Devine formula for Ideal Body Weight (IBW). Adjusted Body Weight (ABW) = IBW + 0.4 × (Actual Weight − IBW).",
      "Used for dosing hydrophilic medications and setting ventilator tidal volumes in obesity."
    ],
    weightLossPct: [
      "Weight Loss % = [(Initial Weight − Current Weight) ÷ Initial Weight] × 100%. A loss of ≥5–10% yields proven cardiometabolic improvements.",
      "Monitors pharmacological and lifestyle obesity treatment efficacy."
    ],

    // G. Diabetes Emergencies
    dkaHhsClassifier: [
      "Classifies DKA vs HHS based on glucose, arterial pH, bicarbonate, ketones, and effective serum osmolality. DKA requires acidosis and ketosis; HHS features severe hyperglycemia with hyperosmolality without ketoacidosis.",
      "Differentiates acute hyperglycemic crises to direct fluid and insulin protocols."
    ],
    effOsmolality: [
      "Effective Serum Osmolality = 2×Na + (Glucose ÷ 18). Excludes urea because it is a freely permeable solute. Diagnostic criterion for HHS is >320 mOsm/kg.",
      "Calculates hypertonicity driving intracellular dehydration in diabetic ketoacidosis and hyperosmolar hyperglycemic state."
    ],

    // H. Reproductive Endocrinology
    rotterdamPcos: [
      "Rotterdam 2003 criteria: Diagnosis requires ≥2 of: 1) Oligo- or anovulation, 2) Clinical/biochemical hyperandrogenism, 3) Polycystic ovaries on ultrasound (or elevated AMH).",
      "Standard international diagnostic framework for polycystic ovary syndrome."
    ],
    faiCalc: [
      "Free Androgen Index (FAI) = (Total Testosterone [nmol/L] ÷ SHBG [nmol/L]) × 100. FAI >4.5–5% suggests hyperandrogenemia in females.",
      "Surrogate measure of biologically active circulating testosterone."
    ],
    lhFshRatio: [
      "LH/FSH ratio is often elevated (>2.0–3.0) in polycystic ovary syndrome due to pulsatile GnRH abnormalities.",
      "Adjunctive supportive biomarker in anovulatory reproductive disorders."
    ],
    ferrimanGallwey: [
      "Modified Ferriman–Gallwey (mFG) scores terminal hair growth across 9 body regions (0–4 each). Score ≥4–8 (population-dependent) indicates hirsutism.",
      "Clinical standard for grading androgen-dependent hair growth in women."
    ],

    // I. Lipid and Metabolic Risk
    lipidRatios: [
      "Calculates Non-HDL-C (Total Chol − HDL), Total/HDL ratio, Triglyceride/HDL ratio, and Remnant Cholesterol (Total Chol − HDL − LDL).",
      "Atherogenic lipid profiling beyond isolated LDL cholesterol."
    ],
    metsynCriteria: [
      "NCEP ATP III criteria for Metabolic Syndrome: requires ≥3 of: Elevated waist, Elevated triglycerides (≥150), Low HDL, High BP (≥130/85), Impaired fasting glucose (≥100 mg/dL).",
      "Identifies clustering of metabolic risk factors for type 2 diabetes and ASCVD."
    ],

    // J. Endocrine Tumors and Specialized Assessment
    pheoScreenRef: [
      "Screening for pheochromocytoma/paraganglioma: Plasma free metanephrines or 24-hr urinary fractionated metanephrines. Elevations >3–4× upper limit of normal strongly support diagnosis.",
      "Initial biochemical step before anatomical or functional tumor localization."
    ],
    menChecklist: [
      "MEN1 (3 Ps: Parathyroid, Pituitary, Pancreatic neuroendocrine tumors); MEN2A (MTC, Pheochromocytoma, Parathyroid); MEN2B (MTC, Pheochromocytoma, mucosal neuromas/marfanoid habitus).",
      "Diagnostic criteria and screening guide for hereditary multiple endocrine neoplasia syndromes."
    ]
  };

  const tools = [
    // ==========================================
    // A. DIABETES MELLITUS
    // ==========================================
    {
      id: "eAgCalc",
      cat: "endo",
      subcat: "Diabetes Mellitus",
      name: "HbA1c to Estimated Average Glucose (eAG)",
      desc: "Translates laboratory HbA1c to mean glucose in mg/dL and mmol/L (ADAG study).",
      fields: [
        N("a1c", "HbA1c (%)", 7.5, { min: 4.0, max: 20.0, step: 0.1 })
      ],
      calc: v => {
        const a1c = +v.a1c;
        const eagMg = 28.7 * a1c - 46.7;
        const eagMmol = eagMg / 18.018;
        return {
          value: Math.round(eagMg) + " mg/dL (" + eagMmol.toFixed(1) + " mmol/L)",
          eq: "ADAG formula: eAG (mg/dL) = 28.7 × HbA1c − 46.7. eAG (mmol/L) = eAG (mg/dL) ÷ 18.018."
        };
      }
    },
    {
      id: "homaIr",
      cat: "endo",
      subcat: "Diabetes Mellitus",
      name: "HOMA-IR (Insulin Resistance)",
      desc: "Homeostatic Model Assessment of peripheral insulin resistance.",
      fields: [
        N("glu", "Fasting Glucose (mg/dL)", 105, { min: 40, max: 500 }),
        N("ins", "Fasting Insulin (µIU/mL)", 12, { min: 1, max: 250, step: 0.5 })
      ],
      calc: v => {
        const homa = (+v.glu * +v.ins) / 405;
        let c = homa > 2.5 ? "Significant insulin resistance (>2.5)" : homa > 1.9 ? "Early / borderline insulin resistance (1.9–2.5)" : "Normal insulin sensitivity (<1.9)";
        return {
          value: homa.toFixed(2) + " — " + c,
          eq: "Formula: HOMA-IR = (Fasting Glucose [mg/dL] × Fasting Insulin [µIU/mL]) ÷ 405."
        };
      }
    },
    {
      id: "homaBeta",
      cat: "endo",
      subcat: "Diabetes Mellitus",
      name: "HOMA-β (Beta-Cell Function)",
      desc: "Homeostatic Model Assessment of pancreatic beta-cell secretory capacity.",
      fields: [
        N("glu", "Fasting Glucose (mg/dL)", 95, { min: 64, max: 400 }),
        N("ins", "Fasting Insulin (µIU/mL)", 10, { min: 1, max: 250, step: 0.5 })
      ],
      calc: v => {
        const denom = +v.glu - 63;
        if (denom <= 0) return { value: "Invalid: Fasting glucose must be >63 mg/dL", eq: "Formula requires glucose >63 mg/dL." };
        const beta = (360 * +v.ins) / denom;
        return {
          value: beta.toFixed(1) + "% beta-cell function",
          eq: "Formula: HOMA-β (%) = (360 × Fasting Insulin [µIU/mL]) ÷ (Fasting Glucose [mg/dL] − 63). 100% represents normal reference function."
        };
      }
    },
    {
      id: "quickiIndex",
      cat: "endo",
      subcat: "Diabetes Mellitus",
      name: "QUICKI Insulin Sensitivity Index",
      desc: "Quantitative insulin sensitivity check index.",
      fields: [
        N("glu", "Fasting Glucose (mg/dL)", 95, { min: 40, max: 500 }),
        N("ins", "Fasting Insulin (µIU/mL)", 10, { min: 1, max: 200, step: 0.1 })
      ],
      calc: v => {
        const quicki = 1 / (Math.log10(+v.glu) + Math.log10(+v.ins));
        let c = quicki < 0.33 ? "Insulin resistance (<0.33)" : "Preserved insulin sensitivity (≥0.33)";
        return {
          value: quicki.toFixed(3) + " — " + c,
          eq: "QUICKI = 1 ÷ [log₁₀(Glucose [mg/dL]) + log₁₀(Insulin [µIU/mL])]. Lower values denote worse resistance."
        };
      }
    },
    {
      id: "tygIndex",
      cat: "endo",
      subcat: "Diabetes Mellitus",
      name: "TyG Index (Triglyceride–Glucose)",
      desc: "Surrogate biomarker of insulin resistance from routine fasting lipid panel.",
      fields: [
        N("tg", "Fasting Triglycerides (mg/dL)", 160, { min: 30, max: 2000 }),
        N("glu", "Fasting Glucose (mg/dL)", 105, { min: 40, max: 600 })
      ],
      calc: v => {
        const tyg = Math.log((+v.tg * +v.glu) / 2);
        let c = tyg >= 8.5 ? "Elevated (≥8.5; associated with metabolic syndrome & vascular disease)" : "Normal range (<8.5)";
        return {
          value: tyg.toFixed(2) + " — " + c,
          eq: "TyG Index = ln[(Fasting Triglycerides [mg/dL] × Fasting Glucose [mg/dL]) ÷ 2]."
        };
      }
    },
    {
      id: "dmCriteriaRef",
      cat: "endo",
      subcat: "Diabetes Mellitus",
      name: "Diabetes Diagnostic Criteria Reference",
      desc: "ADA standards of care criteria for diabetes and prediabetes.",
      fields: [
        S("test", "Select test to review", "fpg", [
          ["fpg", "Fasting Plasma Glucose (FPG)"],
          ["a1c", "Hemoglobin A1c (HbA1c)"],
          ["ogtt", "2-hour 75g Oral Glucose Tolerance Test (OGTT)"],
          ["rpg", "Random Plasma Glucose"]
        ])
      ],
      calc: v => {
        let txt = "";
        if (v.test === "fpg") txt = "Normal: <100 mg/dL | Prediabetes (IFG): 100–125 mg/dL | Diabetes: ≥126 mg/dL (requires confirmation).";
        else if (v.test === "a1c") txt = "Normal: <5.7% | Prediabetes: 5.7–6.4% | Diabetes: ≥6.5% (requires confirmation unless unequivocal hyperglycemia).";
        else if (v.test === "ogtt") txt = "Normal: <140 mg/dL | Impaired Glucose Tolerance (IGT): 140–199 mg/dL | Diabetes: ≥200 mg/dL.";
        else txt = "Diabetes: ≥200 mg/dL in a patient with classic symptoms of hyperglycemia or hyperglycemic crisis (no confirmatory test needed).";
        return {
          value: txt,
          eq: "ADA Standards of Care in Diabetes. Diagnosis requires two abnormal results from the same sample or two separate test samples."
        };
      }
    },
    {
      id: "tddInsulinHelper",
      cat: "endo",
      subcat: "Diabetes Mellitus",
      name: "Estimated Total Daily Insulin (TDD) Helper",
      desc: "Initial total daily insulin requirement based on weight and diabetes type.",
      fields: [
        N("weight", "Patient Weight (kg)", 75, { min: 20, max: 250, step: 0.5 }),
        S("regimen", "Clinical Scenario", "t1d", [
          ["t1d_honeymoon", "Type 1 Diabetes (honeymoon phase / sensitive: 0.3 units/kg)"],
          ["t1d", "Type 1 Diabetes (typical: 0.5 units/kg)"],
          ["t2d_init", "Type 2 Diabetes (initial starting dose: 0.5 units/kg)"],
          ["t2d_resist", "Type 2 Diabetes (insulin resistant / obese: 0.8 units/kg)"]
        ])
      ],
      calc: v => {
        let factor = 0.5;
        if (v.regimen === "t1d_honeymoon") factor = 0.3;
        else if (v.regimen === "t2d_resist") factor = 0.8;
        const tdd = +v.weight * factor;
        const basal = Math.round(tdd * 0.5);
        const prandial = Math.round(tdd * 0.5);
        return {
          value: Math.round(tdd) + " units/day (Basal: ~" + basal + "u | Total Bolus: ~" + prandial + "u)",
          eq: "Estimated TDD = Weight (kg) × " + factor + " units/kg. Typically divided 50% basal and 50% bolus (split across 3 meals)."
        };
      }
    },
    {
      id: "basalBolusCalc",
      cat: "endo",
      subcat: "Diabetes Mellitus",
      name: "Basal–Bolus Insulin Calculator",
      desc: "Splits known Total Daily Dose (TDD) into basal and mealtime doses.",
      fields: [
        N("tdd", "Total Daily Insulin Dose (units)", 40, { min: 4, max: 300, step: 1 }),
        S("split", "Basal : Prandial Split", "50_50", [
          ["50_50", "50% Basal / 50% Bolus"],
          ["40_60", "40% Basal / 60% Bolus"]
        ])
      ],
      calc: v => {
        const tdd = +v.tdd;
        const basalPct = v.split === "50_50" ? 0.5 : 0.4;
        const basal = Math.round(tdd * basalPct);
        const bolusTotal = tdd - basal;
        const perMeal = Math.round(bolusTotal / 3);
        return {
          value: "Basal: " + basal + " units once daily | Prandial: " + perMeal + " units TID with meals",
          eq: "Basal (" + (basalPct * 100) + "%) = " + basal + "u. Total bolus = " + bolusTotal + "u divided into " + perMeal + "u for breakfast, lunch, and dinner."
        };
      }
    },
    {
      id: "corrInsulinCalc",
      cat: "endo",
      subcat: "Diabetes Mellitus",
      name: "Correction Insulin & Sensitivity Factor",
      desc: "Calculates Insulin Sensitivity Factor (ISF) and high-glucose correction dose.",
      fields: [
        N("tdd", "Total Daily Insulin Dose (units)", 45, { min: 5, max: 300 }),
        N("curr_glu", "Current Blood Glucose (mg/dL)", 240, { min: 70, max: 800 }),
        N("target_glu", "Target Blood Glucose (mg/dL)", 120, { min: 80, max: 180 }),
        S("analog", "Insulin Type", "rapid", [["rapid", "Rapid-acting analog (Rule of 1800)"], ["regular", "Regular insulin (Rule of 1500)"]])
      ],
      calc: v => {
        const rule = v.analog === "rapid" ? 1800 : 1500;
        const isf = Math.round(rule / +v.tdd);
        const excess = +v.curr_glu - +v.target_glu;
        if (excess <= 0) return { value: "No correction needed (Glucose ≤ Target)", eq: "ISF = " + isf + " mg/dL per 1 unit." };
        const corrDose = excess / isf;
        return {
          value: corrDose.toFixed(1) + " units correction (ISF: 1 unit drops glucose " + isf + " mg/dL)",
          eq: "ISF = " + rule + " ÷ TDD. Correction Dose = (Current Glucose − Target) ÷ ISF = " + excess + " ÷ " + isf + "."
        };
      }
    },
    {
      id: "icrCalc",
      cat: "endo",
      subcat: "Diabetes Mellitus",
      name: "Insulin-to-Carbohydrate Ratio (ICR)",
      desc: "Rule of 500 for mealtime carbohydrate bolus calculation.",
      fields: [
        N("tdd", "Total Daily Insulin Dose (units)", 50, { min: 5, max: 300 }),
        N("carbs", "Carbohydrates in meal (grams)", 60, { min: 0, max: 300 })
      ],
      calc: v => {
        const icr = Math.round(500 / +v.tdd);
        const mealBolus = +v.carbs / icr;
        return {
          value: mealBolus.toFixed(1) + " units meal bolus (ICR: 1 unit per " + icr + "g carbs)",
          eq: "Rule of 500: ICR = 500 ÷ TDD. Meal bolus = Planned Carbs (g) ÷ ICR."
        };
      }
    },
    {
      id: "hypoClassification",
      cat: "endo",
      subcat: "Diabetes Mellitus",
      name: "Hypoglycemia Classification",
      desc: "ADA/EASD consensus definitions of hypoglycemia severity.",
      fields: [
        N("glu", "Measured Blood Glucose (mg/dL)", 58, { min: 10, max: 120 }),
        S("assistance", "Requires external third-party assistance to treat?", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const g = +v.glu, assist = v.assistance === "1";
        let c = "";
        if (assist) c = "Level 3: Severe Hypoglycemia (cognitive impairment requiring assistance; glucagon / IV dextrose indicated)";
        else if (g < 54) c = "Level 2: Clinically Significant Hypoglycemia (<54 mg/dL; immediate fast-acting carbohydrate indicated)";
        else if (g <= 70) c = "Level 1: Hypoglycemia Alert Value (54–70 mg/dL; Rule of 15: treat with 15g fast carbohydrate)";
        else c = "Glucose >70 mg/dL (not meeting hypoglycemia definition threshold)";
        return {
          value: c,
          eq: "Rule of 15: Ingest 15g fast-acting glucose, re-test blood sugar in 15 minutes, repeat if still <70 mg/dL."
        };
      }
    },
    {
      id: "dmRemissionRef",
      cat: "endo",
      subcat: "Diabetes Mellitus",
      name: "Diabetes Remission Criteria Reference",
      desc: "International consensus criteria for remission of type 2 diabetes.",
      fields: [
        N("a1c", "HbA1c without medication for ≥3 months (%)", 6.2, { min: 4.0, max: 12.0, step: 0.1 }),
        S("meds", "Active glucose-lowering medications taken?", "0", [["0", "None (off all diabetes meds for ≥3 months)"], ["1", "Still taking metformin/other meds"]])
      ],
      calc: v => {
        const a1c = +v.a1c, noMeds = v.meds === "0";
        let res = (a1c < 6.5 && noMeds) 
          ? "Meets Type 2 Diabetes Remission criteria (HbA1c <6.5% sustained for ≥3 months off pharmacotherapy)" 
          : "Does not meet remission criteria (requires HbA1c <6.5% completely off glucose-lowering drugs).";
        return {
          value: res,
          eq: "Consensus definition (ADA/EASD/Endocrine Society): HbA1c <6.5% (<48 mmol/mol) sustained ≥3 months without therapy."
        };
      }
    },

    // ==========================================
    // B. THYROID DISORDERS
    // ==========================================
    {
      id: "tshGuide",
      cat: "endo",
      subcat: "Thyroid Disorders",
      name: "TSH / FT4 / FT3 Interpretation Guide",
      desc: "Biochemical thyroid function test pattern classifier.",
      fields: [
        S("tsh", "Serum TSH", "high", [["low", "Suppressed / Low (<0.4 mIU/L)"], ["norm", "Normal (0.4–4.5 mIU/L)"], ["high", "Elevated (>4.5 mIU/L)"]]),
        S("ft4", "Free T4 (FT4)", "low", [["low", "Low"], ["norm", "Normal"], ["high", "Elevated"]])
      ],
      calc: v => {
        let pattern = "";
        if (v.tsh === "high" && v.ft4 === "low") pattern = "Primary Overt Hypothyroidism (common causes: Hashimoto thyroiditis, post-ablation, thyroidectomy).";
        else if (v.tsh === "high" && v.ft4 === "norm") pattern = "Subclinical Hypothyroidism (consider anti-TPO antibodies, repeat in 6–12 weeks).";
        else if (v.tsh === "low" && v.ft4 === "high") pattern = "Primary Overt Hyperthyroidism / Thyrotoxicosis (Graves disease, toxic multinodular goiter, toxic adenoma).";
        else if (v.tsh === "low" && v.ft4 === "norm") pattern = "Subclinical Hyperthyroidism or exogenous over-replacement.";
        else if (v.tsh === "low" && v.ft4 === "low") pattern = "Central / Secondary Hypothyroidism (evaluate pituitary/hypothalamic axis) or severe non-thyroidal illness.";
        else if (v.tsh === "high" && v.ft4 === "high") pattern = "TSH-mediated hyperthyroidism (TSH-secreting pituitary adenoma vs Thyroid Hormone Resistance) or assay artifact.";
        else pattern = "Euthyroid (Normal thyroid function tests).";
        return {
          value: pattern,
          eq: "Always correlate with patient symptoms, drug interference (biotin, amiodarone), and clinical pregnancy status."
        };
      }
    },
    {
      id: "bwpsScore",
      cat: "endo",
      subcat: "Thyroid Disorders",
      name: "Thyroid Storm — Burch–Wartofsky Point Scale",
      desc: "Point scale for assessing likelihood of acute life-threatening thyroid storm.",
      fields: [
        S("temp", "Temperature (°F)", "0", [["0", "<99 (0)"], ["5", "99–99.9 (+5)"], ["10", "100–100.9 (+10)"], ["15", "101–101.9 (+15)"], ["20", "102–102.9 (+20)"], ["25", "103–103.9 (+25)"], ["30", "≥104.0 (+30)"]]),
        S("cns", "CNS effects", "0", [["0", "Absent (0)"], ["10", "Mild (agitation: +10)"], ["20", "Moderate (delirium, psychosis: +20)"], ["30", "Severe (seizures, coma: +30)"]]),
        S("gi", "GI / Hepatic dysfunction", "0", [["0", "Absent (0)"], ["10", "Moderate (diarrhea, nausea, vomiting: +10)"], ["20", "Severe (unexplained jaundice: +20)"]]),
        S("hr", "Tachycardia (pulse/min)", "0", [["0", "<90 (0)"], ["5", "90–109 (+5)"], ["10", "110–119 (+10)"], ["15", "120–129 (+15)"], ["20", "130–139 (+20)"], ["25", "≥140 (+25)"]]),
        S("chf", "Congestive heart failure", "0", [["0", "Absent (0)"], ["5", "Mild (pedal edema: +5)"], ["10", "Moderate (bibasilar rales: +10)"], ["15", "Severe (pulmonary edema: +15)"]]),
        S("af", "Atrial fibrillation present", "0", [["0", "No (0)"], ["10", "Yes (+10)"]]),
        S("precip", "Precipitating event identified", "0", [["0", "No (0)"], ["10", "Yes (+10)"]])
      ],
      calc: v => {
        const total = +v.temp + +v.cns + +v.gi + +v.hr + +v.chf + +v.af + +v.precip;
        let c = total >= 45 ? "Highly suggestive of Thyroid Storm (≥45 points; initiate immediate multimodal therapy)" : total >= 25 ? "Impending Thyroid Storm (25–44 points)" : "Thyroid storm unlikely (<25 points)";
        return {
          value: total + " points — " + c,
          eq: "BWPS ≥45: Start propylthiouracil/methimazole, hydrocortisone, beta-blocker, and inorganic iodine (after thionamide)."
        };
      }
    },
    {
      id: "jtaThyroidStorm",
      cat: "endo",
      subcat: "Thyroid Disorders",
      name: "Japanese Thyroid Association (JTA) Criteria",
      desc: "Diagnostic criteria for Thyroid Storm (TS1 definite vs TS2 suspected).",
      fields: [
        S("thyro", "Documented Thyrotoxicosis (elevated FT4/FT3)", "1", [["1", "Yes"], ["0", "No"]]),
        S("cns", "CNS manifestation (restlessness, delirium, coma)", "0", [["0", "Absent"], ["1", "Present"]]),
        N("other", "Number of other manifestations (Fever ≥38°C, Tachycardia ≥130, Heart failure, GI/hepatic jaundice)", 1, { min: 0, max: 4, step: 1 })
      ],
      calc: v => {
        if (v.thyro === "0") return { value: "Criteria not met (Thyrotoxicosis is required)", eq: "Thyrotoxicosis must be biochemically documented." };
        const cns = v.cns === "1", o = +v.other;
        let res = "";
        if (cns && o >= 1) res = "TS1: Definite Thyroid Storm (CNS manifestation + ≥1 other symptom)";
        else if (o >= 3) res = "TS1: Definite Thyroid Storm (≥3 other manifestations without CNS involvement)";
        else if (cns || o >= 2) res = "TS2: Suspected Thyroid Storm";
        else res = "Does not meet JTA thyroid storm criteria";
        return {
          value: res,
          eq: "JTA Criteria: Requires thyrotoxicosis + combinations of CNS, fever, tachycardia, CHF, and GI/hepatic dysfunction."
        };
      }
    },
    {
      id: "popoveniucScore",
      cat: "endo",
      subcat: "Thyroid Disorders",
      name: "Myxedema Coma — Popoveniuc Score",
      desc: "Scoring tool to assess the probability of life-threatening myxedema coma.",
      fields: [
        S("temp", "Body Temperature (°F)", "0", [["0", "≥95.0 (0)"], ["10", "93.0–94.9 (+10)"], ["20", "<93.0 (+20)"]]),
        S("cns", "CNS dysfunction", "0", [["0", "Normal (0)"], ["10", "Somnolence / lethargy (+10)"], ["20", "Stupor (+20)"], ["30", "Coma (+30)"]]),
        S("gi", "GI features (ileus, anorexia, severe obstipation)", "0", [["0", "Absent (0)"], ["10", "Present (+10)"]]),
        S("cv", "Cardiovascular (bradycardia <50, hypotension SBP <90)", "0", [["0", "Absent (0)"], ["10", "Present (+10)"]]),
        S("precip", "Precipitating illness / trauma / infection", "0", [["0", "Absent (0)"], ["10", "Present (+10)"]])
      ],
      calc: v => {
        const total = +v.temp + +v.cns + +v.gi + +v.cv + +v.precip;
        let c = total >= 60 ? "High risk for Myxedema Coma (≥60 points; start IV levothyroxine, T3, & hydrocortisone)" : total >= 25 ? "Intermediate risk" : "Low risk (<25 points)";
        return {
          value: total + " points — " + c,
          eq: "Popoveniuc criteria. Stress-dose glucocorticoids must precede thyroid hormone replacement to avoid acute adrenal crisis."
        };
      }
    },
    {
      id: "tiradsRef",
      cat: "endo",
      subcat: "Thyroid Disorders",
      name: "Thyroid Nodule ACR TI-RADS Reference",
      desc: "Ultrasound scoring categories and biopsy thresholds for thyroid nodules.",
      fields: [
        S("points", "Total ACR TI-RADS ultrasound points", "tr3", [
          ["tr1", "0 points: TR1 (Benign — 0.3% malignancy risk)"],
          ["tr2", "2 points: TR2 (Not suspicious — 1.5% risk)"],
          ["tr3", "3 points: TR3 (Mildly suspicious — 4.8% risk)"],
          ["tr4", "4–6 points: TR4 (Moderately suspicious — 9.1% risk)"],
          ["tr5", "≥7 points: TR5 (Highly suspicious — 35% risk)"]
        ])
      ],
      calc: v => {
        let txt = "";
        if (v.points === "tr1" || v.points === "tr2") txt = "No FNA biopsy required.";
        else if (v.points === "tr3") txt = "FNA if nodule ≥2.5 cm; follow on ultrasound if ≥1.5 cm.";
        else if (v.points === "tr4") txt = "FNA if nodule ≥1.5 cm; follow on ultrasound if ≥1.0 cm.";
        else txt = "FNA if nodule ≥1.0 cm; follow on ultrasound if ≥0.5 cm.";
        return {
          value: v.points.toUpperCase() + " — " + txt,
          eq: "ACR TI-RADS evaluates composition, echogenicity, shape (taller-than-wide), margins, and echogenic foci."
        };
      }
    },
    {
      id: "thyroidVolCalc",
      cat: "endo",
      subcat: "Thyroid Disorders",
      name: "Thyroid Volume Calculator",
      desc: "Calculates total thyroid volume from 3-axis ultrasound measurements.",
      fields: [
        N("r_l", "Right Lobe Length (cm)", 4.5, { min: 1, max: 15, step: 0.1 }),
        N("r_w", "Right Lobe Width (cm)", 1.8, { min: 0.5, max: 10, step: 0.1 }),
        N("r_d", "Right Lobe Depth (cm)", 1.5, { min: 0.5, max: 10, step: 0.1 }),
        N("l_l", "Left Lobe Length (cm)", 4.2, { min: 1, max: 15, step: 0.1 }),
        N("l_w", "Left Lobe Width (cm)", 1.7, { min: 0.5, max: 10, step: 0.1 }),
        N("l_d", "Left Lobe Depth (cm)", 1.4, { min: 0.5, max: 10, step: 0.1 })
      ],
      calc: v => {
        const rVol = +v.r_l * +v.r_w * +v.r_d * 0.523;
        const lVol = +v.l_l * +v.l_w * +v.l_d * 0.523;
        const total = rVol + lVol;
        let c = total > 25 ? "Enlarged (Goiter: >25 mL in males, >18 mL in females)" : "Normal volume";
        return {
          value: total.toFixed(1) + " mL (R: " + rVol.toFixed(1) + " mL | L: " + lVol.toFixed(1) + " mL) — " + c,
          eq: "Ellipsoid formula: Volume (mL) = Length × Width × Depth × 0.523 for each lobe. Isthmus excluded unless thickened."
        };
      }
    },
    {
      id: "lt4DoseHelper",
      cat: "endo",
      subcat: "Thyroid Disorders",
      name: "Levothyroxine Dose-Estimation Helper",
      desc: "Initial oral replacement dose in primary overt hypothyroidism.",
      fields: [
        N("weight", "Patient Weight (kg)", 70, { min: 30, max: 250 }),
        S("category", "Patient Category", "adult", [
          ["adult", "Healthy adult (<60 years, no cardiac disease: 1.6 mcg/kg)"],
          ["elderly", "Elderly or known ischemic heart disease (conservative: 25–50 mcg/day)"],
          ["subclinical", "Subclinical hypothyroidism (partial replacement: 25–50 mcg/day)"]
        ])
      ],
      calc: v => {
        if (v.category === "elderly" || v.category === "subclinical") {
          return {
            value: "25–50 mcg orally once daily",
            eq: "Start low and titrate by 12.5–25 mcg every 6–8 weeks based on serum TSH."
          };
        }
        const dose = Math.round((+v.weight * 1.6) / 12.5) * 12.5;
        return {
          value: dose + " mcg orally once daily (1.6 mcg/kg)",
          eq: "Levothyroxine replacement = 1.6 mcg/kg ideal body weight. Take on an empty stomach with water 30–60 minutes before breakfast."
        };
      }
    },

    // ==========================================
    // C. ADRENAL DISORDERS
    // ==========================================
    {
      id: "arrCalc",
      cat: "endo",
      subcat: "Adrenal Disorders",
      name: "Aldosterone-to-Renin Ratio (ARR)",
      desc: "Screens for primary aldosteronism using PAC and PRA.",
      fields: [
        N("pac", "Plasma Aldosterone Concentration (PAC, ng/dL)", 24, { min: 1, max: 200, step: 0.5 }),
        N("pra", "Plasma Renin Activity (PRA, ng/mL/h)", 0.6, { min: 0.1, max: 50, step: 0.1 })
      ],
      calc: v => {
        const arr = +v.pac / +v.pra;
        let c = (arr >= 20 && +v.pac >= 10) ? "POSITIVE SCREEN (ARR ≥20 and PAC ≥10 ng/dL; confirmatory suppression test indicated)" : "Negative screening ratio (<20)";
        return {
          value: "ARR: " + arr.toFixed(1) + " (ng/dL per ng/mL/h) — " + c,
          eq: "ARR = PAC (ng/dL) ÷ PRA (ng/mL/h). Hold mineralocorticoid receptor antagonists (spironolactone/eplerenone) ≥4–6 weeks prior."
        };
      }
    },
    {
      id: "cortisolUnitConv",
      cat: "endo",
      subcat: "Adrenal Disorders",
      name: "Cortisol Unit Conversion",
      desc: "Converts serum cortisol between µg/dL and nmol/L.",
      fields: [
        N("val", "Cortisol Value", 18, { min: 0.1, max: 2000, step: 0.1 }),
        S("dir", "Conversion Direction", "ug_to_nmol", [
          ["ug_to_nmol", "µg/dL to nmol/L"],
          ["nmol_to_ug", "nmol/L to µg/dL"]
        ])
      ],
      calc: v => {
        if (v.dir === "ug_to_nmol") {
          const res = +v.val * 27.59;
          return { value: res.toFixed(1) + " nmol/L", eq: "Formula: µg/dL × 27.59 = nmol/L. Standard morning peak is ~140–690 nmol/L (5–25 µg/dL)." };
        } else {
          const res = +v.val / 27.59;
          return { value: res.toFixed(2) + " µg/dL", eq: "Formula: nmol/L ÷ 27.59 = µg/dL." };
        }
      }
    },
    {
      id: "acthStimInterp",
      cat: "endo",
      subcat: "Adrenal Disorders",
      name: "ACTH Stimulation Test Interpretation",
      desc: "Standard 250 mcg cosyntropin stimulation test interpretation.",
      fields: [
        N("peak", "Peak 30-min or 60-min Cortisol (µg/dL)", 19.5, { min: 1, max: 80, step: 0.1 })
      ],
      calc: v => {
        const p = +v.peak;
        let c = p >= 18.0 ? "Normal cortisol response (Peak ≥18.0 µg/dL rules out primary adrenal insufficiency)" : "Subnormal response (<18.0 µg/dL; indicates primary or chronic secondary adrenal insufficiency)";
        return {
          value: p + " µg/dL — " + c,
          eq: "Diagnostic criteria: Normal peak cortisol is ≥18 µg/dL (or ≥14–15 µg/dL on newer monoclonal assays). Check baseline ACTH."
        };
      }
    },
    {
      id: "dstInterpRef",
      cat: "endo",
      subcat: "Adrenal Disorders",
      name: "Dexamethasone Suppression Test (DST)",
      desc: "Overnight 1 mg dexamethasone suppression test interpretation for Cushing syndrome.",
      fields: [
        N("post_cort", "Post-dexamethasone 8 AM Cortisol (µg/dL)", 1.2, { min: 0.2, max: 50, step: 0.1 })
      ],
      calc: v => {
        const c = +v.post_cort;
        let s = c <= 1.8 ? "Normal suppression (≤1.8 µg/dL [≤50 nmol/L]; excludes autonomous hypercortisolism)" : "Abnormal / Non-suppressed (>1.8 µg/dL; autonomous cortisol secretion / Cushing syndrome suspected)";
        return {
          value: c + " µg/dL — " + s,
          eq: "Cut-off is 1.8 µg/dL (50 nmol/L) for high diagnostic sensitivity. Confirm with 24-hr urinary free cortisol or late-night salivary cortisol."
        };
      }
    },

    // ==========================================
    // D. PITUITARY AND HYPOTHALAMUS
    // ==========================================
    {
      id: "waterDeprivRef",
      cat: "endo",
      subcat: "Pituitary and Hypothalamus",
      name: "Water Deprivation Test Interpretation",
      desc: "Distinguishes central DI, nephrogenic DI, and primary polydipsia.",
      fields: [
        S("pre", "Urine Osmolality after dehydration (prior to DDAVP)", "low", [
          ["low", "Dilute urine (<300 mOsm/kg)"],
          ["iso", "Intermediate (300–750 mOsm/kg)"],
          ["high", "Concentrated (>750 mOsm/kg; normal)"]
        ]),
        S("post", "Response to Desmopressin (DDAVP)", "rise50", [
          ["rise50", ">50% increase in urine osmolality"],
          ["rise10", "<10% to 50% increase in urine osmolality"],
          ["no_rise", "<10% minimal or no increase"]
        ])
      ],
      calc: v => {
        let dx = "";
        if (v.pre === "high") dx = "Primary Polydipsia (normal renal concentrating response with intact endogenous ADH).";
        else if (v.pre === "low" && v.post === "rise50") dx = "Complete Central Diabetes Insipidus (deficiency of ADH corrected by exogenous DDAVP).";
        else if (v.pre === "low" && v.post === "no_rise") dx = "Complete Nephrogenic Diabetes Insipidus (renal resistance to ADH; no response to DDAVP).";
        else dx = "Partial Central DI vs Partial Nephrogenic DI vs chronic primary polydipsia with medullary washout.";
        return {
          value: dx,
          eq: "Serial monitoring of plasma osmolality, urine osmolality, and weight loss during dehydration is mandatory."
        };
      }
    },
    {
      id: "prolactinConv",
      cat: "endo",
      subcat: "Pituitary and Hypothalamus",
      name: "Prolactin Unit Conversion & Assessment",
      desc: "Converts prolactin between ng/mL and mIU/L and evaluates hyperprolactinemia.",
      fields: [
        N("val", "Prolactin Value", 85, { min: 1, max: 10000, step: 1 }),
        S("dir", "Units", "ng_ml", [["ng_ml", "ng/mL (µg/L)"], ["miu_l", "mIU/L"]])
      ],
      calc: v => {
        let ng = v.dir === "ng_ml" ? +v.val : +v.val / 21.2;
        let miu = v.dir === "ng_ml" ? +v.val * 21.2 : +v.val;
        let c = ng > 250 ? "Massive elevation (>250 ng/mL; virtually diagnostic of macroprolactinoma)" : ng > 100 ? "Moderate elevation (100–250 ng/mL; prolactinoma likely)" : ng > 25 ? "Mild hyperprolactinemia (medications, stalk effect, microadenoma, hypothyroidism)" : "Normal prolactin (<25 ng/mL)";
        return {
          value: ng.toFixed(1) + " ng/mL (" + Math.round(miu) + " mIU/L) — " + c,
          eq: "Conversion: 1 ng/mL ≈ 21.2 mIU/L. In massive adenomas with normal prolactin, rule out 'hook effect' via serial sample dilution."
        };
      }
    },

    // ==========================================
    // E. CALCIUM, PHOSPHATE AND BONE METABOLISM
    // ==========================================
    {
      id: "corrCalcium",
      cat: "endo",
      subcat: "Calcium, Phosphate and Bone Metabolism",
      name: "Albumin-Corrected Calcium",
      desc: "Adjusts total serum calcium for hypoalbuminemia or hyperalbuminemia.",
      fields: [
        N("ca", "Measured Total Calcium (mg/dL)", 8.2, { min: 3, max: 20, step: 0.1 }),
        N("alb", "Serum Albumin (g/dL)", 2.8, { min: 0.5, max: 6.0, step: 0.1 })
      ],
      calc: v => {
        const corr = +v.ca + 0.8 * (4.0 - +v.alb);
        let c = corr > 10.5 ? "Hypercalcemia (>10.5 mg/dL)" : corr < 8.5 ? "Hypocalcemia (<8.5 mg/dL)" : "Normal corrected calcium (8.5–10.5 mg/dL)";
        return {
          value: corr.toFixed(2) + " mg/dL — " + c,
          eq: "Formula: Corrected Calcium = Measured Total Calcium + 0.8 × (4.0 − Albumin [g/dL])."
        };
      }
    },
    {
      id: "feCaCalc",
      cat: "endo",
      subcat: "Calcium, Phosphate and Bone Metabolism",
      name: "Fractional Excretion of Calcium (FECa)",
      desc: "Differentiates Primary Hyperparathyroidism from Familial Hypocalciuric Hypercalcemia (FHH).",
      fields: [
        N("uca", "24-h Urine Calcium (mg/dL)", 8.5, { min: 0.5, max: 80, step: 0.1 }),
        N("scr", "Serum Creatinine (mg/dL)", 1.0, { min: 0.2, max: 15, step: 0.05 }),
        N("sca", "Serum Total Calcium (mg/dL)", 10.8, { min: 7, max: 20, step: 0.1 }),
        N("ucr", "24-h Urine Creatinine (mg/dL)", 85, { min: 5, max: 500, step: 1 })
      ],
      calc: v => {
        const feca = (+v.uca * +v.scr) / (+v.sca * +v.ucr);
        let c = feca < 0.01 ? "FECa <0.01 (<1%): Suggests Familial Hypocalciuric Hypercalcemia (FHH)" : feca > 0.02 ? "FECa >0.02 (>2%): Favors Primary Hyperparathyroidism" : "Intermediate / Gray zone (0.01–0.02; genetic testing may be required)";
        return {
          value: (feca * 100).toFixed(2) + "% (" + feca.toFixed(4) + ") — " + c,
          eq: "FECa = (Urine Ca × Serum Cr) ÷ (Serum Ca × Urine Cr). Values must use identical units (mg/dL)."
        };
      }
    },
    {
      id: "tscoreClass",
      cat: "endo",
      subcat: "Calcium, Phosphate and Bone Metabolism",
      name: "Osteoporosis T-Score Classification",
      desc: "WHO bone mineral density diagnostic criteria by dual-energy X-ray absorptiometry (DXA).",
      fields: [
        N("tscore", "Lowest DXA T-Score (L-spine, total hip, or femoral neck)", -2.7, { min: -6.0, max: 3.0, step: 0.1 }),
        S("fx", "Prior adult low-trauma / fragility fracture?", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const t = +v.tscore, fx = v.fx === "1";
        let c = "";
        if (t <= -2.5 && fx) c = "Severe (Established) Osteoporosis (T-score ≤ −2.5 plus fragility fracture)";
        else if (t <= -2.5) c = "Osteoporosis (T-score ≤ −2.5)";
        else if (t < -1.0) c = "Osteopenia / Low Bone Mass (−1.0 to −2.5)";
        else c = "Normal Bone Mineral Density (T-score ≥ −1.0)";
        return {
          value: c + " (T-score: " + t.toFixed(1) + ")",
          eq: "WHO criteria apply to postmenopausal women and men ≥50 years. Use Z-scores (< −2.0 = below expected) in younger populations."
        };
      }
    },
    {
      id: "vitDConv",
      cat: "endo",
      subcat: "Calcium, Phosphate and Bone Metabolism",
      name: "Vitamin D Unit Conversion & Status",
      desc: "Converts 25(OH)D between ng/mL and nmol/L.",
      fields: [
        N("val", "25-hydroxyvitamin D Value", 22, { min: 1, max: 250 }),
        S("unit", "Entered Unit", "ng_ml", [["ng_ml", "ng/mL (µg/L)"], ["nmol_l", "nmol/L"]])
      ],
      calc: v => {
        let ng = v.unit === "ng_ml" ? +v.val : +v.val / 2.5;
        let nmol = v.unit === "ng_ml" ? +v.val * 2.5 : +v.val;
        let c = ng < 12 ? "Severe Deficiency (<12 ng/mL [<30 nmol/L])" : ng < 20 ? "Deficiency (12–19 ng/mL [30–49 nmol/L])" : ng < 30 ? "Insufficiency (20–29 ng/mL [50–74 nmol/L])" : "Sufficiency (30–100 ng/mL [75–250 nmol/L])";
        return {
          value: ng.toFixed(1) + " ng/mL (" + Math.round(nmol) + " nmol/L) — " + c,
          eq: "Conversion factor: 1 ng/mL = 2.5 nmol/L."
        };
      }
    },
    {
      id: "fraxPlanned",
      cat: "endo",
      subcat: "Calcium, Phosphate and Bone Metabolism",
      name: "FRAX Fracture Risk Calculator",
      desc: "Planned — WHO 10-year major osteoporotic and hip fracture risk model.",
      planned: true
    },

    // ==========================================
    // F. OBESITY AND METABOLIC SYNDROME
    // ==========================================
    {
      id: "whrCalc",
      cat: "endo",
      subcat: "Obesity and Metabolic Syndrome",
      name: "Waist-to-Hip Ratio",
      desc: "Evaluates visceral fat distribution and cardiometabolic risk.",
      fields: [
        N("waist", "Waist Circumference (cm)", 92, { min: 30, max: 250 }),
        N("hip", "Hip Circumference (cm)", 98, { min: 30, max: 250 }),
        S("sex", "Sex", "male", [["male", "Male"], ["female", "Female"]])
      ],
      calc: v => {
        const ratio = +v.waist / +v.hip;
        const thresh = v.sex === "male" ? 0.90 : 0.85;
        let c = ratio >= thresh ? "Substantially increased risk (≥" + thresh + "; abdominal visceral adiposity)" : "Low to moderate risk (<" + thresh + ")";
        return {
          value: ratio.toFixed(2) + " — " + c,
          eq: "WHR = Waist (cm) ÷ Hip (cm). WHO cut-offs for central obesity: >0.90 in men, >0.85 in women."
        };
      }
    },
    {
      id: "whtrCalc",
      cat: "endo",
      subcat: "Obesity and Metabolic Syndrome",
      name: "Waist-to-Height Ratio",
      desc: "Cardiometabolic risk screening tool across sexes and ethnicities.",
      fields: [
        N("waist", "Waist Circumference (cm)", 88, { min: 30, max: 250 }),
        N("height", "Height (cm)", 172, { min: 60, max: 250 })
      ],
      calc: v => {
        const ratio = +v.waist / +v.height;
        let c = ratio >= 0.60 ? "Very high cardiometabolic risk (≥0.60)" : ratio >= 0.50 ? "Increased cardiometabolic risk (0.50–0.59)" : "Healthy waist-to-height ratio (<0.50)";
        return {
          value: ratio.toFixed(2) + " — " + c,
          eq: "Waist-to-Height Ratio = Waist ÷ Height. General recommendation: keep waist to less than half your height (<0.50)."
        };
      }
    },
    {
      id: "ibwAbwCalc",
      cat: "endo",
      subcat: "Obesity and Metabolic Syndrome",
      name: "Ideal & Adjusted Body Weight",
      desc: "Devine formula for IBW and Adjusted Body Weight (ABW) for obese drug dosing.",
      fields: [
        N("height", "Height (cm)", 175, { min: 140, max: 240 }),
        N("weight", "Actual Weight (kg)", 95, { min: 30, max: 300 }),
        S("sex", "Sex", "male", [["male", "Male"], ["female", "Female"]])
      ],
      calc: v => {
        const htInches = +v.height / 2.54;
        const inchesOver5Ft = Math.max(0, htInches - 60);
        const ibw = v.sex === "male" ? 50 + 2.3 * inchesOver5Ft : 45.5 + 2.3 * inchesOver5Ft;
        const abw = ibw + 0.4 * (+v.weight - ibw);
        return {
          value: "IBW: " + ibw.toFixed(1) + " kg | ABW: " + abw.toFixed(1) + " kg",
          eq: "Devine IBW: 50 kg (men) or 45.5 kg (women) + 2.3 kg per inch >5 ft. ABW = IBW + 0.4 × (Actual − IBW)."
        };
      }
    },
    {
      id: "weightLossPct",
      cat: "endo",
      subcat: "Obesity and Metabolic Syndrome",
      name: "Weight-Loss Percentage Calculator",
      desc: "Tracks total percentage body weight loss during anti-obesity therapy.",
      fields: [
        N("init_wt", "Initial / Baseline Weight (kg)", 105, { min: 30, max: 350 }),
        N("curr_wt", "Current Weight (kg)", 94, { min: 25, max: 350 })
      ],
      calc: v => {
        const lost = +v.init_wt - +v.curr_wt;
        const pct = (lost / +v.init_wt) * 100;
        let c = pct >= 15 ? "Exceptional loss (≥15%; reverses metabolic complications and diabetes)" : pct >= 10 ? "Substantial clinical benefit (10–14.9%)" : pct >= 5 ? "Clinically meaningful weight loss (5–9.9%)" : "Minimal weight loss (<5%)";
        return {
          value: pct.toFixed(1) + "% (" + lost.toFixed(1) + " kg lost) — " + c,
          eq: "Percentage Weight Loss = [(Initial Weight − Current Weight) ÷ Initial Weight] × 100%."
        };
      }
    },

    // ==========================================
    // G. DIABETES EMERGENCIES
    // ==========================================
    {
      id: "dkaHhsClassifier",
      cat: "endo",
      subcat: "Diabetes Emergencies",
      name: "DKA & HHS Diagnostic Criteria & Severity",
      desc: "Consensus criteria classifying DKA severity vs Hyperosmolar Hyperglycemic State.",
      fields: [
        N("glu", "Blood Glucose (mg/dL)", 450, { min: 100, max: 2500 }),
        N("ph", "Arterial pH", 7.18, { min: 6.5, max: 7.6, step: 0.01 }),
        N("hco3", "Serum Bicarbonate (mEq/L)", 11, { min: 1, max: 45 }),
        S("ketones", "Urine / Serum Ketones", "pos", [["pos", "Positive"], ["neg", "Negative"]]),
        N("osmol", "Effective Serum Osmolality (mOsm/kg)", 305, { min: 250, max: 450 }),
        S("sensorium", "Mental Status", "alert", [
          ["alert", "Alert"],
          ["drowsy", "Drowsy / Lethargic"],
          ["stupor", "Stupor / Coma"]
        ])
      ],
      calc: v => {
        const g = +v.glu, ph = +v.ph, hco3 = +v.hco3, osm = +v.osmol;
        let res = "";
        if (g > 600 && ph > 7.30 && hco3 > 18 && osm > 320 && (v.sensorium !== "alert")) {
          res = "Hyperosmolar Hyperglycemic State (HHS)";
        } else if (v.ketones === "pos") {
          if (ph < 7.00 || hco3 < 10 || v.sensorium === "stupor") res = "Severe Diabetic Ketoacidosis (DKA)";
          else if (ph <= 7.24 || (hco3 >= 10 && hco3 <= 14)) res = "Moderate Diabetic Ketoacidosis (DKA)";
          else if (ph <= 7.30 && hco3 >= 15) res = "Mild Diabetic Ketoacidosis (DKA)";
          else res = "Hyperglycemia with ketosis (borderline / resolving DKA)";
        } else {
          res = "Hyperglycemia without confirmed ketoacidosis or hyperosmolar state";
        }
        return {
          value: res,
          eq: "DKA requires hyperglycemia, ketosis, and metabolic acidosis. HHS features glucose >600 mg/dL, pH >7.30, HCO₃ >18, and effective osmolality >320 mOsm/kg."
        };
      }
    },
    {
      id: "effOsmolality",
      cat: "endo",
      subcat: "Diabetes Emergencies",
      name: "Effective & Total Serum Osmolality",
      desc: "Calculates effective hypertonicity (excluding urea) in hyperglycemic emergencies.",
      fields: [
        N("na", "Serum Sodium (mEq/L)", 134, { min: 100, max: 180 }),
        N("glu", "Serum Glucose (mg/dL)", 650, { min: 50, max: 2500 }),
        N("bun", "BUN (mg/dL)", 38, { min: 2, max: 200 })
      ],
      calc: v => {
        const eff = (2 * +v.na) + (+v.glu / 18);
        const tot = eff + (+v.bun / 2.8);
        let c = eff > 320 ? "Meets HHS diagnostic threshold (>320 mOsm/kg; severe hypertonicity)" : "Effective osmolality ≤320 mOsm/kg";
        return {
          value: "Effective: " + Math.round(eff) + " mOsm/kg | Total: " + Math.round(tot) + " mOsm/kg (" + c + ")",
          eq: "Effective Osmolality = 2×Na + (Glucose ÷ 18). Total Osmolality = Effective + (BUN ÷ 2.8). Urea is omitted from effective osmolality because it is permeable."
        };
      }
    },

    // ==========================================
    // H. REPRODUCTIVE ENDOCRINOLOGY
    // ==========================================
    {
      id: "rotterdamPcos",
      cat: "endo",
      subcat: "Reproductive Endocrinology",
      name: "Rotterdam Criteria for PCOS",
      desc: "International diagnostic consensus checklist for polycystic ovary syndrome.",
      fields: [
        S("ovul", "1. Ovulatory dysfunction (oligo- or anovulation, cycle >35 days)", "1", [["0", "No"], ["1", "Yes"]]),
        S("androgen", "2. Clinical or biochemical hyperandrogenism (hirsutism, acne, elevated testosterone)", "1", [["0", "No"], ["1", "Yes"]]),
        S("us", "3. Polycystic ovarian morphology on US (≥20 follicles per ovary or volume ≥10 mL) OR elevated serum AMH", "1", [["0", "No"], ["1", "Yes"]]),
        S("exclude", "Exclusion of other etiologies (CAH, hyperprolactinemia, thyroid dysfunction, Cushing)", "1", [["1", "Other etiologies excluded"], ["0", "Other etiologies NOT excluded"]])
      ],
      calc: v => {
        if (v.exclude === "0") return { value: "Criteria not met (alternative etiologies must be excluded)", eq: "Exclude non-classical CAH, prolactinoma, thyroid disease." };
        const count = +v.ovul + +v.androgen + +v.us;
        return {
          value: count >= 2 ? "POSITIVE for PCOS (meets " + count + " of 3 Rotterdam criteria)" : "Negative for PCOS (<2 criteria met)",
          eq: "Rotterdam 2003 criteria: Requires at least 2 of 3 features once secondary causes of hyperandrogenism and anovulation are excluded."
        };
      }
    },
    {
      id: "faiCalc",
      cat: "endo",
      subcat: "Reproductive Endocrinology",
      name: "Free Androgen Index (FAI)",
      desc: "Estimates circulating active testosterone relative to SHBG in females.",
      fields: [
        N("testo", "Total Testosterone (nmol/L)", 2.8, { min: 0.1, max: 20, step: 0.1 }),
        N("shbg", "SHBG (nmol/L)", 32, { min: 2, max: 250, step: 1 })
      ],
      calc: v => {
        const fai = (+v.testo / +v.shbg) * 100;
        let c = fai > 5.0 ? "Elevated FAI (>5.0%; biochemical hyperandrogenism)" : "Normal female FAI range (≤5.0%)";
        return {
          value: fai.toFixed(1) + "% — " + c,
          eq: "Formula: FAI = (Total Testosterone [nmol/L] ÷ SHBG [nmol/L]) × 100. Note: Total testosterone must be entered in nmol/L."
        };
      }
    },
    {
      id: "lhFshRatio",
      cat: "endo",
      subcat: "Reproductive Endocrinology",
      name: "LH/FSH Ratio Calculator",
      desc: "Calculates luteinizing hormone to follicle-stimulating hormone ratio.",
      fields: [
        N("lh", "LH (IU/L)", 14.5, { min: 0.1, max: 100, step: 0.1 }),
        N("fsh", "FSH (IU/L)", 5.2, { min: 0.1, max: 100, step: 0.1 })
      ],
      calc: v => {
        const ratio = +v.lh / +v.fsh;
        let c = ratio > 2.0 ? "Elevated (>2.0; characteristic of pulsatile GnRH abnormalities in PCOS)" : "Normal LH/FSH ratio (≤2.0)";
        return {
          value: ratio.toFixed(2) + " — " + c,
          eq: "Ratio = LH (IU/L) ÷ FSH (IU/L). Early follicular phase sample preferred. Supportive but not diagnostic on its own."
        };
      }
    },
    {
      id: "ferrimanGallwey",
      cat: "endo",
      subcat: "Reproductive Endocrinology",
      name: "Modified Ferriman–Gallwey Hirsutism Score",
      desc: "Clinical visual score across 9 androgen-sensitive body areas (0–4 each).",
      fields: [
        N("score", "Total sum score of 9 body regions (0 to 36)", 9, { min: 0, max: 36, step: 1 }),
        S("eth", "Ethnic Background", "caucasian", [
          ["caucasian", "Caucasian / Black (cut-off ≥8)"],
          ["mediterranean", "Mediterranean / Middle Eastern / South Asian (cut-off ≥9–10)"],
          ["asian", "East Asian (cut-off ≥4)"]
        ])
      ],
      calc: v => {
        const s = +v.score;
        let cut = 8;
        if (v.eth === "mediterranean") cut = 9;
        else if (v.eth === "asian") cut = 4;
        let c = s >= cut ? "Hirsutism present (score ≥" + cut + ")" : "Normal hair distribution (<" + cut + ")";
        return {
          value: s + " / 36 points — " + c,
          eq: "Evaluates upper lip, chin, chest, upper back, lower back, upper abdomen, lower abdomen, upper arms, and thighs (0–4 each)."
        };
      }
    },

    // ==========================================
    // I. LIPID AND METABOLIC RISK
    // ==========================================
    {
      id: "lipidRatios",
      cat: "endo",
      subcat: "Lipid and Metabolic Risk",
      name: "Lipid Fractions, Ratios & Remnants",
      desc: "Calculates Non-HDL-C, Triglyceride/HDL ratio, Total/HDL ratio, and Remnant cholesterol.",
      fields: [
        N("tc", "Total Cholesterol (mg/dL)", 220, { min: 50, max: 600 }),
        N("hdl", "HDL Cholesterol (mg/dL)", 42, { min: 10, max: 150 }),
        N("tg", "Triglycerides (mg/dL)", 210, { min: 20, max: 2000 }),
        N("ldl", "Direct or Friedewald LDL (mg/dL)", 136, { min: 10, max: 400 })
      ],
      calc: v => {
        const nonHdl = +v.tc - +v.hdl;
        const tgHdl = +v.tg / +v.hdl;
        const tcHdl = +v.tc / +v.hdl;
        const remnant = +v.tc - +v.hdl - +v.ldl;
        return {
          value: "Non-HDL: " + nonHdl + " mg/dL | TG/HDL: " + tgHdl.toFixed(1) + " | Remnant: " + Math.round(remnant) + " mg/dL",
          eq: "Non-HDL = TC − HDL. TG/HDL >3.0 suggests small dense LDL particles and insulin resistance. Remnant Cholesterol = TC − HDL − LDL."
        };
      }
    },
    {
      id: "metsynCriteria",
      cat: "endo",
      subcat: "Lipid and Metabolic Risk",
      name: "Metabolic Syndrome Criteria (NCEP ATP III)",
      desc: "Clinical diagnosis based on presence of ≥3 of 5 cardiometabolic traits.",
      fields: [
        S("waist", "Elevated waist circumference (>102 cm men, >88 cm women)", "1", [["0", "No"], ["1", "Yes"]]),
        S("tg", "Elevated Triglycerides (≥150 mg/dL or on drug)", "1", [["0", "No"], ["1", "Yes"]]),
        S("hdl", "Reduced HDL (<40 mg/dL men, <50 mg/dL women)", "1", [["0", "No"], ["1", "Yes"]]),
        S("bp", "Elevated Blood Pressure (≥130/85 mmHg or treated)", "0", [["0", "No"], ["1", "Yes"]]),
        S("glu", "Elevated Fasting Glucose (≥100 mg/dL or treated)", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const total = +v.waist + +v.tg + +v.hdl + +v.bp + +v.glu;
        return {
          value: total >= 3 ? "POSITIVE for Metabolic Syndrome (" + total + " / 5 criteria met)" : "Negative (" + total + " / 5 criteria met)",
          eq: "NCEP ATP III definition: Requires presence of at least 3 of 5 components."
        };
      }
    },

    // ==========================================
    // J. ENDOCRINE TUMORS AND SPECIALIZED ASSESSMENT
    // ==========================================
    {
      id: "pheoScreenRef",
      cat: "endo",
      subcat: "Endocrine Tumors and Specialized Assessment",
      name: "Pheochromocytoma Biochemical Screening",
      desc: "Interprets plasma free or 24-hr urinary fractionated metanephrines.",
      fields: [
        S("level", "Degree of Elevation above Upper Limit of Normal (ULN)", "mild", [
          ["norm", "Within normal reference limits"],
          ["mild", "Mild elevation (<2× ULN)"],
          ["mod", "Moderate elevation (2–3× ULN)"],
          ["high", "Marked elevation (≥3–4× ULN)"]
        ])
      ],
      calc: v => {
        let res = "";
        if (v.level === "high") res = "Highly suggestive of Pheochromocytoma / Paraganglioma (≥3–4× ULN; proceed directly to anatomical CT/MRI imaging).";
        else if (v.level === "mod" || v.level === "mild") res = "Equivocal / Borderline elevation (frequently false-positive from stress or drugs; hold tricyclics/SNRIs/acetaminophen and consider clonidine suppression test).";
        else res = "Pheochromocytoma virtually ruled out (>99% negative predictive value).";
        return {
          value: res,
          eq: "Plasma free metanephrines should be drawn in supine position after 30 minutes of rest to minimize false positives."
        };
      }
    },
    {
      id: "menChecklist",
      cat: "endo",
      subcat: "Endocrine Tumors and Specialized Assessment",
      name: "Multiple Endocrine Neoplasia (MEN) Checklist",
      desc: "Clinical and genetic diagnostic features of MEN1, MEN2A, and MEN2B.",
      fields: [
        S("syndrome", "Select MEN Syndrome to review", "men1", [
          ["men1", "MEN1 (Wermer syndrome)"],
          ["men2a", "MEN2A (Sipple syndrome)"],
          ["men2b", "MEN2B"]
        ])
      ],
      calc: v => {
        let txt = "";
        if (v.syndrome === "men1") txt = "MEN1 (3 Ps): Parathyroid adenomas / hyperplasia (>95%), Pancreatic neuroendocrine tumors (gastrinoma, insulinoma: 40–70%), Pituitary adenomas (prolactinoma: 30–40%). Gene: MEN1 (menin).";
        else if (v.syndrome === "men2a") txt = "MEN2A: Medullary Thyroid Carcinoma (>95%), Pheochromocytoma (50%), Primary Hyperparathyroidism (20–30%). Gene: RET proto-oncogene.";
        else txt = "MEN2B: Medullary Thyroid Carcinoma (aggressive, early onset), Pheochromocytoma (50%), Mucosal neuromas (lips/tongue), Marfanoid habitus, Intestinal ganglioneuromatosis. Gene: RET (M918T mutation).";
        return {
          value: txt,
          eq: "Clinical diagnosis requires ≥2 classic endocrine tumors or 1 tumor plus a first-degree relative with established diagnosis."
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