/**
 * MedCalc Module: Endocrinology & Metabolism (ENDO)
 * Fully compatible with the MedCalc HTML application structure and obgy.js architecture.
 * Enhanced version with deep clinical interpretations, physiological significance, diagnostic pearls, and guidance matrix.
 */
(function () {
 "use strict";

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
 desc: "Comprehensive clinical module covering diabetes mellitus, thyroid storm/myxedema, adrenal axes, calcium/bone metabolism, pituitary neuroendocrinology, and reproductive metabolic health.",
 organs: ["pancreas", "thyroid", "adrenal", "pituitary", "bone", "hypothalamus", "adipose"],
 region: "endocrine / systemic / metabolic"
 };

 var endoGuidance = {
 // A. Diabetes Mellitus
 eAgCalc: [
 "Translates HbA1c to estimated average glucose (eAG) using the ADAG formula: eAG (mg/dL) = 28.7 × HbA1c − 46.7.",
 "Pathophysiology & Physiological Significance: Glycated hemoglobin reflects cumulative plasma glucose exposure over the 120-day erythrocyte lifespan. Bridges laboratory glycation markers with daily glucometer self-monitoring trends to evaluate chronic glucotoxicity."
 ],
 homaIr: [
 "HOMA-IR = (Fasting Glucose [mg/dL] × Fasting Insulin [µIU/mL]) ÷ 405. Values >2.0–2.5 denote significant peripheral insulin resistance.",
 "Pathophysiology & Physiological Significance: Models hepatic and peripheral tissue resistance to insulin-mediated glucose uptake. Elevated values reflect impaired post-receptor signaling pathways and compensatory beta-cell hypersecretion."
 ],
 homaBeta: [
 "HOMA-β = (360 × Fasting Insulin [µIU/mL]) ÷ (Fasting Glucose [mg/dL] − 63). Quantifies basal pancreatic beta-cell secretory reserve.",
 "Pathophysiology & Physiological Significance: Estimates basal insulin release relative to glucose stimulatory thresholds. Tracks the destruction or functional exhaustion of pancreatic islet beta cells over time."
 ],
 quickiIndex: [
 "QUICKI = 1 ÷ [log(Fasting Glucose mg/dL) + log(Fasting Insulin µIU/mL)]. Values <0.33 indicate impaired insulin sensitivity.",
 "Pathophysiology & Physiological Significance: Logarithmic transformation normalizes skewed insulin and glucose distributions, providing enhanced statistical correlation with gold-standard clamp measures of tissue sensitivity."
 ],
 tygIndex: [
 "TyG Index = ln[(Fasting Triglycerides mg/dL × Fasting Glucose mg/dL) ÷ 2]. Values ≥8.5–8.8 identify insulin resistance.",
 "Pathophysiology & Physiological Significance: Integrates glucotoxicity and lipotoxicity. Elevated triglycerides reflect hepatic insulin resistance (failure of insulin to suppress VLDL secretion), mirroring peripheral resistance."
 ],
 dmCriteriaRef: [
 "ADA Diagnostic Criteria: Fasting Plasma Glucose ≥126 mg/dL, 2-h OGTT ≥200 mg/dL, HbA1c ≥6.5%, or random glucose ≥200 mg/dL with hyperglycemic symptoms.",
 "Pathophysiology & Physiological Significance: Defines glycemic thresholds above which microvascular damage (retinopathy, nephropathy) increases exponentially due to advanced glycation end-products."
 ],
 tddInsulinHelper: [
 "Estimates total daily insulin dose (TDD): 0.4–0.5 units/kg/day in T1D and 0.5–1.0+ units/kg/day in insulin-resistant T2D.",
 "Pathophysiology & Physiological Significance: Prevents ketoacidosis in absolute insulin deficiency (T1D) and glucotoxicity in T2D while avoiding iatrogenic hypoglycemia."
 ],
 basalBolusCalc: [
 "Splits TDD into basal (40–50%) and prandial bolus (50–60% divided equally across 3 meals).",
 "Pathophysiology & Physiological Significance: Mimics normal biphasic pancreatic secretion, suppressing hepatic gluconeogenesis overnight and between meals while covering acute postprandial glucose spikes."
 ],
 corrInsulinCalc: [
 "Correction Factor (ISF) = 1800 ÷ TDD (rapid analogs). Correction dose = (Current Glucose − Target Glucose) ÷ ISF.",
 "Pathophysiology & Physiological Significance: Quantifies how much a single unit of rapid-acting insulin lowers blood glucose, enabling safe correction of acute hyperglycemic spikes without stacking."
 ],
 icrCalc: [
 "Insulin-to-Carbohydrate Ratio (ICR) = 500 ÷ TDD (rule of 500). Meal bolus = Grams of carbohydrates ÷ ICR.",
 "Pathophysiology & Physiological Significance: Matches prandial insulin delivery to intestinal carbohydrate absorption rates, preventing postprandial glycemic excursions."
 ],
 hypoClassification: [
 "Level 1: <70 mg/dL; Level 2: <54 mg/dL (clinically significant); Level 3: Severe cognitive impairment requiring third-party assistance.",
 "Pathophysiology & Physiological Significance: Prevents fatal neuroglycopenia, cardiac arrhythmias, and cerebral ischemia caused by central nervous system glucose deprivation."
 ],
 dmRemissionRef: [
 "Diabetes remission is defined as HbA1c <6.5% sustained for ≥3 months off all glucose-lowering pharmacotherapy.",
 "Pathophysiology & Physiological Significance: Demonstrates successful reversal of beta-cell glucotoxicity and restoration of near-normal insulin sensitivity following bariatric surgery or weight loss."
 ],

 // B. Thyroid Disorders
 tshGuide: [
 "Interprets discordant TSH and Free T4 patterns: Primary hypothyroidism, hyperthyroidism, subclinical disease, central dysfunction, or thyroid hormone resistance.",
 "Pathophysiology & Physiological Significance: Unlocks the primary vs central axis feedback dynamics governing basal metabolic rate and oxygen consumption."
 ],
 bwpsScore: [
 "Burch–Wartofsky Point Scale evaluates thyroid storm based on fever, CNS, GI, cardiovascular dysfunction, and precipitant. Score ≥45 denotes thyroid storm.",
 "Pathophysiology & Physiological Significance: Captures multi-organ adrenergic hypersensitivity, hypermetabolic state, and systemic decompensation triggered by overwhelming thyroid hormone excess."
 ],
 jtaThyroidStorm: [
 "Japanese Thyroid Association criteria combine thyrotoxicosis with specific combinations of CNS, fever, tachycardia, CHF, and GI manifestations.",
 "Pathophysiology & Physiological Significance: Validates acute thyrotoxic crisis using objective multi-system organ dysfunction metrics."
 ],
 popoveniucScore: [
 "Popoveniuc diagnostic score for myxedema coma based on temperature, CNS dysfunction, GI features, cardiovascular signs, and precipitating factors.",
 "Pathophysiology & Physiological Significance: Quantifies profound systemic hypometabolism, hypothermia, and encephalopathy, directing emergency supportive and hormone replacement therapies."
 ],
 tiradsRef: [
 "ACR TI-RADS risk stratification assigns points for composition, echogenicity, shape, margin, and echogenic foci to determine FNA biopsy thresholds.",
 "Pathophysiology & Physiological Significance: Balances malignancy detection against unnecessary invasive biopsies by categorizing nodular sonographic architectural patterns."
 ],
 thyroidVolCalc: [
 "Calculates thyroid volume using ellipsoid formula: Length × Width × Depth × 0.52 for each lobe. Normal volume <18 mL (women) and <25 mL (men).",
 "Pathophysiology & Physiological Significance: Quantifies glandular hypertrophy resulting from iodine deficiency, autoimmune stimulation (Graves), or multinodular goiter."
 ],
 lt4DoseHelper: [
 "Full replacement levothyroxine dose is ~1.6 mcg/kg/day ideal body weight. Start lower (25–50 mcg/day) in elderly or cardiac patients.",
 "Pathophysiology & Physiological Significance: Restores circulating thyroxine pools to normalize basal metabolic rate, thermogenesis, and lipid metabolism."
 ],

 // C. Adrenal Disorders
 arrCalc: [
 "Aldosterone-to-Renin Ratio (ARR) = PAC (ng/dL) ÷ PRA (ng/mL/h). Ratio ≥20–30 with PAC ≥10–15 ng/dL screens positive for primary aldosteronism.",
 "Pathophysiology & Physiological Significance: Unmasks autonomous mineralocorticoid excess that drives sodium retention, potassium wasting, and resistant hypertension independent of angiotensin II."
 ],
 cortisolUnitConv: [
 "Converts serum cortisol between µg/dL and nmol/L (1 µg/dL = 27.59 nmol/L).",
 "Pathophysiology & Physiological Significance: Harmonizes glucocorticoid laboratory data across international clinical assays."
 ],
 acthStimInterp: [
 "Short Synacthen (250 mcg cosyntropin) test: peak serum cortisol ≥18–20 µg/dL rules out primary adrenal insufficiency.",
 "Pathophysiology & Physiological Significance: Tests the maximal secretory reserve of the zona fasciculata in the adrenal cortex, confirming or excluding Addison disease."
 ],
 dstInterpRef: [
 "Overnight 1 mg dexamethasone suppression test: morning post-dexamethasone cortisol ≤1.8 µg/dL excludes autonomous hypercortisolism.",
 "Pathophysiology & Physiological Significance: Assesses negative feedback inhibition of the HPA axis; failure to suppress indicates autonomous cortisol hypersecretion."
 ],

 // D. Pituitary and Hypothalamus
 waterDeprivRef: [
 "Interprets water deprivation testing: differentiates central DI, nephrogenic DI, and primary polydipsia based on urine osmolality before and after desmopressin.",
 "Pathophysiology & Physiological Significance: Differentiates central neurohypophyseal failure from renal tubular unresponsiveness and primary behavioral water loading."
 ],
 prolactinConv: [
 "Converts prolactin between ng/mL and mIU/L (1 ng/mL ≈ 21.2 mIU/L). Levels >250 ng/mL strongly indicate prolactinoma.",
 "Pathophysiology & Physiological Significance: Evaluates lactotroph axis regulation and identifies autonomous pituitary tumor secretion vs dopamine antagonist drug effects."
 ],

 // E. Calcium, Phosphate and Bone Metabolism
 corrCalcium: [
 "Corrected Calcium = Total Calcium (mg/dL) + 0.8 × (4.0 − Serum Albumin [g/dL]).",
 "Pathophysiology & Physiological Significance: Accounts for protein-bound calcium fractions, revealing true physiological calcium status when serum albumin fluctuates."
 ],
 feCaCalc: [
 "FECa = [(Urine Ca × Serum Cr) ÷ (Serum Ca × Urine Cr)]. FECa <1% suggests FHH; >2% favors Primary Hyperparathyroidism.",
 "Pathophysiology & Physiological Significance: Evaluates renal tubular handling of calcium relative to glomerular filtration."
 ],
 tscoreClass: [
 "WHO T-score criteria: Normal (≥−1.0), Osteopenia (−1.0 to −2.5), Osteoporosis (≤−2.5), Severe Osteoporosis (≤−2.5 plus fragility fracture).",
 "Pathophysiology & Physiological Significance: Quantifies skeletal structural integrity and fracture vulnerability."
 ],
 vitDConv: [
 "Converts 25-hydroxyvitamin D: 1 ng/mL = 2.5 nmol/L. Sufficiency defined as ≥20–30 ng/mL.",
 "Pathophysiology & Physiological Significance: Ensures adequate hormonal substrate for intestinal calcium and phosphate absorption and mineralization of bone osteoid."
 ],
 fraxPlanned: [
 "Planned — FRAX WHO fracture risk assessment tool integration.",
 "Pathophysiology & Physiological Significance: Estimates 10-year fracture probability by combining clinical risk factors with bone density."
 ],

 // F. Obesity and Metabolic Syndrome
 whrCalc: [
 "Waist-to-Hip Ratio = Waist (cm) ÷ Hip (cm). Substantial risk: >0.90 in men, >0.85 in women.",
 "Pathophysiology & Physiological Significance: Differentiates android (visceral) from gynoid (subcutaneous) fat distribution, identifying high visceral adipose tissue depots that secrete pro-inflammatory adipokines and drive insulin resistance."
 ],
 whtrCalc: [
 "Waist-to-Height Ratio = Waist (cm) ÷ Height (cm). Ratio ≥0.50 indicates increased cardiometabolic risk.",
 "Pathophysiology & Physiological Significance: Provides a universal height-adjusted threshold for central adiposity and cardiometabolic risk across diverse ethnic populations."
 ],
 ibwAbwCalc: [
 "Devine formula for Ideal Body Weight (IBW). Adjusted Body Weight (ABW) = IBW + 0.4 × (Actual Weight − IBW).",
 "Pathophysiology & Physiological Significance: Corrects for altered pharmacokinetic volume of distribution of hydrophilic drugs in adipose tissue."
 ],
 weightLossPct: [
 "Weight Loss % = [(Initial Weight − Current Weight) ÷ Initial Weight] × 100%. Loss of ≥5–10% yields proven cardiometabolic improvements.",
 "Pathophysiology & Physiological Significance: Quantifies therapeutic success in reversing ectopic fat deposition, hepatic steatosis, and metabolic syndrome."
 ],

 // G. Diabetes Emergencies
 dkaHhsClassifier: [
 "Classifies DKA vs HHS based on glucose, arterial pH, bicarbonate, ketones, and effective serum osmolality.",
 "Pathophysiology & Physiological Significance: Differentiates absolute insulin deficiency ketotic acidemia from relative insulin deficiency hyperosmolar dehydration to guide emergency resuscitation."
 ],
 effOsmolality: [
 "Effective Serum Osmolality = 2×Na + (Glucose ÷ 18). Excludes urea. Diagnostic criterion for HHS is >320 mOsm/kg.",
 "Pathophysiology & Physiological Significance: Measures effective tonicity driving osmotic water shifts out of intracellular neuronal compartments."
 ],

 // H. Reproductive Endocrinology
 rotterdamPcos: [
 "Rotterdam 2003 criteria: Diagnosis requires ≥2 of: 1) Oligo/anovulation, 2) Hyperandrogenism, 3) Polycystic ovaries on ultrasound or high AMH.",
 "Pathophysiology & Physiological Significance: Captures multi-faceted endocrine, ovarian, and metabolic manifestations driven by hypothalamic-pituitary-ovarian dysregulation and hyperinsulinemia."
 ],
 faiCalc: [
 "Free Androgen Index (FAI) = (Total Testosterone [nmol/L] ÷ SHBG [nmol/L]) × 100. FAI >4.5–5% suggests hyperandrogenemia.",
 "Pathophysiology & Physiological Significance: Accounts for hepatic SHBG suppression by hyperinsulinemia, revealing true bioavailable testosterone levels."
 ],
 lhFshRatio: [
 "LH/FSH ratio elevated (>2.0–3.0) in polycystic ovary syndrome due to pulsatile GnRH abnormalities.",
 "Pathophysiology & Physiological Significance: Reflects hypothalamic GnRH pulse frequency alterations that preferentially stimulate pituitary LH secretion over FSH."
 ],
 ferrimanGallwey: [
 "Modified Ferriman–Gallwey (mFG) scores terminal hair growth across 9 body regions (0–4 each). Score ≥4–8 indicates hirsutism.",
 "Pathophysiology & Physiological Significance: Quantifies end-organ cutaneous 5-alpha-reductase sensitivity and pilosebaceous unit response to circulating androgens."
 ],

 // I. Lipid and Metabolic Risk
 lipidRatios: [
 "Calculates Non-HDL-C, Total/HDL ratio, Triglyceride/HDL ratio, and Remnant Cholesterol.",
 "Pathophysiology & Physiological Significance: Captures all atherogenic apolipoprotein B-containing particles and remnant lipoproteins driving atherogenesis beyond isolated LDL-C."
 ],
 metsynCriteria: [
 "NCEP ATP III criteria for Metabolic Syndrome: requires ≥3 of: Elevated waist, Triglycerides ≥150, Low HDL, High BP ≥130/85, Impaired fasting glucose ≥100.",
 "Pathophysiology & Physiological Significance: Identifies systemic insulin resistance clustering that exponentially accelerates cardiovascular disease and type 2 diabetes risk."
 ],

 // J. Endocrine Tumors and Specialized Assessment
 pheoScreenRef: [
 "Screening for pheochromocytoma/paraganglioma: Plasma free or 24-hr urinary fractionated metanephrines. Elevations >3–4× ULN support diagnosis.",
 "Pathophysiology & Physiological Significance: Detects autonomous intratumoral O-methylated catecholamine metabolite production by chromaffin tissue."
 ],
 menChecklist: [
 "MEN1 (3 Ps: Parathyroid, Pituitary, Pancreatic NETs); MEN2A (MTC, Pheochromocytoma, Parathyroid); MEN2B (MTC, Pheochromocytoma, mucosal neuromas).",
 "Pathophysiology & Physiological Significance: Unmasks hereditary oncogenic mutations affecting neuroendocrine cell lineages."
 ]
 };

 var endoTools = [
 // ==========================================
 // A. DIABETES MELLITUS
 // ==========================================
 {
 id: "eAgCalc",
 cat: "endo",
 type: "calc",
 subcat: "Diabetes Mellitus",
 name: "HbA1c to Estimated Average Glucose (eAG)",
 desc: "Translates laboratory HbA1c to mean glucose in mg/dL and mmol/L (ADAG study).",
 organ: "Pancreas / Systemic",
 region: "Systemic Metabolism",
 subject: "Diabetes Care / Glycemia Surveillance",
 keywords: ["hba1c", "eag", "glucose", "adag", "glycemia", "diabetes"],
 guidance: "1. Input the patient's latest laboratory HbA1c (%).\n2. The eAG translates HbA1c into units matching patient self-monitoring blood glucose (mg/dL or mmol/L).\n3. Valid only when red blood cell lifespan is normal (exclude hemolytic anemia, hemoglobinopathies, pregnancy, severe renal failure).",
 contraindications: "Inaccurate in conditions altering erythrocyte turnover (e.g., sickle cell disease, hemodialysis, acute blood loss, blood transfusion).",
 literature: [
 {
 type: "A1C-Derived Average Glucose (ADAG) Study",
 icon: "📄",
 title: "Translating the A1C Assay Into Estimated Average Glucose Values",
 citation: "Nathan DM, Kuenen J, Borg R, et al. Diabetes Care. 2008;31(8):1473-1478.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/18540040/" }]
 }
 ],
 fields: [
 makeN("a1c", "HbA1c (%)", 7.5, { min: 4.0, max: 20.0, step: 0.1 })
 ],
 table: {
 headers: ["HbA1c (%)", "eAG (mg/dL)", "eAG (mmol/L)", "Clinical Interpretation & Physiological Significance"],
 rows: [
 { id: "normal", cols: ["< 5.7%", "< 117 mg/dL", "< 6.5 mmol/L", "Normal Glycemic Profile: Unimpaired glucose homeostasis and normal insulin sensitivity."] },
 { id: "prediabetes", cols: ["5.7 – 6.4%", "117 – 137 mg/dL", "6.5 – 7.6 mmol/L", "Prediabetes: Early beta-cell dysfunction and insulin resistance; high risk for microvascular/macrovascular disease progression."] },
 { id: "target", cols: ["6.5 – 7.0%", "140 – 154 mg/dL", "7.8 – 8.6 mmol/L", "ADA Target: Optimal glycemic control for non-pregnant adults to minimize long-term vascular complications."] },
 { id: "suboptimal", cols: ["> 8.0%", "> 183 mg/dL", "> 10.2 mmol/L", "Suboptimal Control: Chronic sustained hyperglycemia; elevated risk of retinopathy, nephropathy, and neuropathy."] }
 ]
 },
 calc: function (v) {
 var a1c = +v.a1c;
 var eagMg = 28.7 * a1c - 46.7;
 var eagMmol = eagMg / 18.018;

 var match = "target";
 if (a1c < 5.7) match = "normal";
 else if (a1c <= 6.4) match = "prediabetes";
 else if (a1c > 8.0) match = "suboptimal";

 return {
 value: Math.round(eagMg) + " mg/dL (" + eagMmol.toFixed(1) + " mmol/L)",
 matchId: match,
 eq: "ADAG Linear Regression Formula:\neAG (mg/dL) = 28.7 × HbA1c − 46.7\neAG (mmol/L) = [28.7 × HbA1c − 46.7] ÷ 18.018\n\nPathophysiology & Physiological Significance: Glycated hemoglobin reflects cumulative plasma glucose exposure over the 120-day erythrocyte lifespan. Bridges laboratory glycation markers with daily glucometer self-monitoring trends to evaluate chronic glucotoxicity."
 };
 }
 },
 {
 id: "homaIr",
 cat: "endo",
 type: "calc",
 subcat: "Diabetes Mellitus",
 name: "HOMA-IR (Insulin Resistance)",
 desc: "Homeostatic Model Assessment of peripheral insulin resistance.",
 organ: "Pancreas / Liver / Muscle",
 region: "Metabolic / Systemic",
 subject: "Insulin Resistance & Metabolic Syndrome",
 keywords: ["homa", "homa-ir", "insulin resistance", "fasting glucose", "hyperinsulinemia"],
 guidance: "1. Obtain fasting serum glucose (mg/dL) and fasting insulin (µIU/mL) after an 8–12 hour overnight fast.\n2. HOMA-IR models steady-state basal insulin resistance.\n3. Cut-off points vary slightly by population; values >2.0 to 2.5 signify clinically meaningful insulin resistance.",
 contraindications: "Unreliable in patients receiving exogenous insulin therapy or those with acute systemic severe illness.",
 literature: [
 {
 type: "Original HOMA Model Paper",
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
 headers: ["HOMA-IR Range", "Insulin Sensitivity Status", "Clinical Correlation & Significance"],
 rows: [
 { id: "sensitive", cols: ["< 1.9", "Normal Insulin Sensitivity", "Optimal metabolic tissue responsiveness and normal glucose disposal."] },
 { id: "borderline", cols: ["1.9 – 2.5", "Early / Borderline Insulin Resistance", "Compensatory hyperinsulinemia maintaining normoglycemia; indicates need for lifestyle modification."] },
 { id: "resistant", cols: ["> 2.5", "Significant Insulin Resistance", "Strongly associated with Metabolic Syndrome, NAFLD/MASH, PCOS, and accelerated atherogenesis."] }
 ]
 },
 calc: function (v) {
 var homa = (+v.glu * +v.ins) / 405;
 var match = "sensitive";
 var c = "Normal insulin sensitivity (<1.9)";
 if (homa > 2.5) {
 match = "resistant";
 c = "Significant insulin resistance (>2.5)";
 } else if (homa >= 1.9) {
 match = "borderline";
 c = "Early / borderline insulin resistance (1.9–2.5)";
 }
 return {
 value: homa.toFixed(2) + " — " + c,
 matchId: match,
 eq: "HOMA-IR Formula: (Fasting Glucose [mg/dL] × Fasting Insulin [µIU/mL]) ÷ 405\n\nPathophysiology & Physiological Significance: Models hepatic and peripheral tissue resistance to insulin-mediated glucose uptake. Elevated values reflect impaired post-receptor signaling pathways and compensatory beta-cell hypersecretion."
 };
 }
 },
 {
 id: "homaBeta",
 cat: "endo",
 type: "calc",
 subcat: "Diabetes Mellitus",
 name: "HOMA-β (Beta-Cell Function)",
 desc: "Homeostatic Model Assessment of pancreatic beta-cell secretory capacity.",
 organ: "Pancreas",
 region: "Abdominal / Pancreato-biliary",
 subject: "Pancreatic Beta-Cell Function",
 keywords: ["homa-beta", "beta cell", "pancreas", "insulin secretion", "diabetes"],
 guidance: "1. Requires fasting glucose >63 mg/dL.\n2. Expressed as a percentage of normal reference beta-cell function (100%).\n3. Decreases progressively prior to and during the clinical course of Type 2 Diabetes.",
 literature: [
 {
 type: "Landmark Publication",
 icon: "📄",
 title: "Homeostasis model assessment: insulin resistance and beta-cell function",
 citation: "Matthews DR et al. Diabetologia. 1985;28(7):412-419.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/3899825/" }]
 }
 ],
 fields: [
 makeN("glu", "Fasting Glucose (mg/dL)", 95, { min: 64, max: 400 }),
 makeN("ins", "Fasting Insulin (µIU/mL)", 10, { min: 1, max: 250, step: 0.5 })
 ],
 table: {
 headers: ["HOMA-β (%)", "Beta-Cell Status", "Clinical Context & Significance"],
 rows: [
 { id: "normal", cols: ["80 – 100%", "Normal Reference Function", "Healthy secretory reserve and normal islet architecture."] },
 { id: "reduced", cols: ["50 – 79%", "Mild to Moderate Beta-Cell Impairment", "Early dysglycemia; compensatory capacity waning under sustained lipotoxicity/glucotoxicity."] },
 { id: "severely_reduced", cols: ["< 50%", "Substantial Beta-Cell Failure", "Advanced islet secretory exhaustion; typical at clinical diagnosis of Type 2 Diabetes or LADA."] }
 ]
 },
 calc: function (v) {
 var denom = +v.glu - 63;
 if (denom <= 0) return { value: "Invalid: Fasting glucose must be >63 mg/dL", eq: "Formula requires glucose >63 mg/dL." };
 var beta = (360 * +v.ins) / denom;
 var match = "normal";
 if (beta < 50) match = "severely_reduced";
 else if (beta < 80) match = "reduced";

 return {
 value: beta.toFixed(1) + "% beta-cell function",
 matchId: match,
 eq: "HOMA-β Formula: (360 × Fasting Insulin [µIU/mL]) ÷ (Fasting Glucose [mg/dL] − 63)\n\nPathophysiology & Physiological Significance: Estimates basal insulin release relative to glucose stimulatory thresholds. Tracks the destruction or functional exhaustion of pancreatic islet beta cells over time."
 };
 }
 },
 {
 id: "quickiIndex",
 cat: "endo",
 type: "calc",
 subcat: "Diabetes Mellitus",
 name: "QUICKI Insulin Sensitivity Index",
 desc: "Quantitative insulin sensitivity check index derived from logarithmic transformation.",
 organ: "Systemic / Pancreas",
 region: "Systemic Metabolism",
 subject: "Insulin Sensitivity Metrics",
 keywords: ["quicki", "insulin sensitivity", "logarithm", "glucose"],
 guidance: "1. Measure fasting glucose (mg/dL) and fasting insulin (µIU/mL).\n2. QUICKI correlates strongly with hyperinsulinemic-euglycemic clamp studies.\n3. Lower numbers correspond to worsening insulin resistance.",
 literature: [
 {
 type: "Validation Study",
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
 headers: ["QUICKI Value", "Sensitivity Status", "Clinical Context & Significance"],
 rows: [
 { id: "normal", cols: ["≥ 0.33", "Preserved Insulin Sensitivity", "Normal cellular glucose uptake and robust metabolic flexibility."] },
 { id: "impaired", cols: ["< 0.33", "Impaired Insulin Sensitivity", "High correlation with metabolic syndrome, visceral adiposity, hypertension, and endothelial dysfunction."] }
 ]
 },
 calc: function (v) {
 var quicki = 1 / (Math.log10(+v.glu) + Math.log10(+v.ins));
 var match = quicki < 0.33 ? "impaired" : "normal";
 var c = quicki < 0.33 ? "Insulin resistance (<0.33)" : "Preserved insulin sensitivity (≥0.33)";
 return {
 value: quicki.toFixed(3) + " — " + c,
 matchId: match,
 eq: "QUICKI Formula = 1 ÷ [log₁₀(Glucose [mg/dL]) + log₁₀(Insulin [µIU/mL])]\n\nPathophysiology & Physiological Significance: Logarithmic transformation normalizes skewed insulin and glucose distributions, providing enhanced statistical correlation with gold-standard clamp measures of tissue sensitivity."
 };
 }
 },
 {
 id: "tygIndex",
 cat: "endo",
 type: "calc",
 subcat: "Diabetes Mellitus",
 name: "TyG Index (Triglyceride–Glucose)",
 desc: "Cost-effective surrogate marker of insulin resistance calculated from fasting lipids and glucose.",
 organ: "Liver / Pancreas / Adipose",
 region: "Systemic / Cardiovascular",
 subject: "Metabolic Risk / Insulin Resistance",
 keywords: ["tyg", "triglyceride", "glucose", "insulin resistance", "nafld"],
 guidance: "1. Enter fasting serum triglycerides (mg/dL) and fasting glucose (mg/dL).\n2. Useful in resource-limited settings where serum insulin is unavailable.\n3. Cut-off values ≥8.5–8.8 identify insulin resistance and heightened NAFLD/MASH risk.",
 literature: [
 {
 type: "Clinical Validation",
 icon: "📄",
 title: "The TyG index as a marker for insulin resistance in healthy population",
 citation: "Guerrero-Romero F, Simental-Mendía LE, González-Ortiz M, et al. Eur J Clin Invest. 2010;40(8):715-720.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/20546221/" }]
 }
 ],
 fields: [
 makeN("tg", "Fasting Triglycerides (mg/dL)", 160, { min: 30, max: 2000 }),
 makeN("glu", "Fasting Glucose (mg/dL)", 105, { min: 40, max: 600 })
 ],
 table: {
 headers: ["TyG Score", "Insulin Sensitivity", "Associated Risks & Physiological Significance"],
 rows: [
 { id: "normal", cols: ["< 8.5", "Normal Range", "Low cardiometabolic risk; normal hepatic VLDL assembly and glucose disposal."] },
 { id: "elevated", cols: ["≥ 8.5", "Elevated TyG Index", "Reflects lipotoxicity, hepatic steatosis (NAFLD), impaired skeletal muscle glucose uptake, and accelerated macrovascular disease."] }
 ]
 },
 calc: function (v) {
 var tyg = Math.log((+v.tg * +v.glu) / 2);
 var match = tyg >= 8.5 ? "elevated" : "normal";
 var c = tyg >= 8.5 ? "Elevated (≥8.5; metabolic risk)" : "Normal range (<8.5)";
 return {
 value: tyg.toFixed(2) + " — " + c,
 matchId: match,
 eq: "TyG Index = ln[ (Fasting Triglycerides [mg/dL] × Fasting Glucose [mg/dL]) ÷ 2 ]\n\nPathophysiology & Physiological Significance: Integrates glucotoxicity and lipotoxicity. Elevated triglycerides reflect hepatic insulin resistance (failure of insulin to suppress VLDL secretion), mirroring peripheral resistance."
 };
 }
 },
 {
 id: "dmCriteriaRef",
 cat: "endo",
 type: "class",
 subcat: "Diabetes Mellitus",
 name: "Diabetes Diagnostic Criteria Reference",
 desc: "ADA standards of care criteria for diabetes and prediabetes.",
 organ: "Pancreas / Systemic",
 region: "Systemic",
 subject: "Endocrine Diagnostics",
 keywords: ["ada", "diagnostic criteria", "fpg", "a1c", "ogtt", "diabetes diagnosis"],
 guidance: "1. Select the diagnostic laboratory test to review criteria.\n2. Unless there is a clear clinical diagnosis based on overt hyperglycemia, diagnosis requires two abnormal test results from the same sample or two separate test samples.",
 literature: [
 {
 type: "ADA Standards of Care",
 icon: "📘",
 title: "ADA Standards of Care in Diabetes—2024: Classification and Diagnosis of Diabetes",
 citation: "American Diabetes Association. Diabetes Care. 2024;47(Suppl. 1):S20-S42.",
 links: [{ text: "View Guidelines (ADA) ↗", url: "https://diabetesjournals.org/care/issue/47/Supplement_1" }]
 }
 ],
 fields: [
 makeS("test", "Select Test Criterion", "fpg", [
 ["fpg", "Fasting Plasma Glucose (FPG)"],
 ["a1c", "Hemoglobin A1c (HbA1c)"],
 ["ogtt", "2-hour 75g Oral Glucose Tolerance Test (OGTT)"],
 ["rpg", "Random Plasma Glucose + Symptoms"]
 ])
 ],
 table: {
 headers: ["Category", "FPG (mg/dL)", "HbA1c (%)", "2-h OGTT (mg/dL)", "Clinical Significance"],
 rows: [
 { id: "normal", cols: ["Normal", "< 100", "< 5.7%", "< 140", "Normal glucose tolerance and homeostatic regulation."] },
 { id: "prediabetes", cols: ["Prediabetes", "100 – 125", "5.7 – 6.4%", "140 – 199", "High risk state for type 2 diabetes and cardiovascular disease; warrants intensive lifestyle intervention."] },
 { id: "diabetes", cols: ["Diabetes Mellitus", "≥ 126", "≥ 6.5%", "≥ 200", "Establishes clinical diagnosis; requires comprehensive vascular risk staging and multidisciplinary management."] }
 ]
 },
 calc: function (v) {
 var txt = "";
 var match = "diabetes";
 if (v.test === "fpg") {
 txt = "Normal: <100 mg/dL | Prediabetes (IFG): 100–125 mg/dL | Diabetes: ≥126 mg/dL (requires confirmation).";
 } else if (v.test === "a1c") {
 txt = "Normal: <5.7% | Prediabetes: 5.7–6.4% | Diabetes: ≥6.5% (requires confirmation).";
 } else if (v.test === "ogtt") {
 txt = "Normal: <140 mg/dL | Impaired Glucose Tolerance (IGT): 140–199 mg/dL | Diabetes: ≥200 mg/dL.";
 } else {
 txt = "Diabetes: ≥200 mg/dL in a patient with classic symptoms of hyperglycemia (polyuria, polydipsia, weight loss) or hyperglycemic crisis.";
 }
 return {
 value: txt,
 matchId: match,
 eq: "ADA Standard Guidelines. Diagnosis requires two concordant results unless overt symptoms are present.\n\nPathophysiology & Physiological Significance: Defines glycemic thresholds above which microvascular damage (retinopathy, nephropathy) increases exponentially due to advanced glycation end-products."
 };
 }
 },
 {
 id: "tddInsulinHelper",
 cat: "endo",
 type: "calc",
 subcat: "Diabetes Mellitus",
 name: "Estimated Total Daily Insulin (TDD) Helper",
 desc: "Initial total daily insulin requirement based on weight and diabetes phenotype.",
 organ: "Pancreas / Systemic",
 region: "Systemic Therapeutics",
 subject: "Insulin Regimen Titration",
 keywords: ["tdd", "insulin dose", "basal", "bolus", "type 1", "type 2"],
 guidance: "1. Select clinical scenario and input actual body weight (kg).\n2. Computes initial Total Daily Dose (TDD) and splits into 50% basal and 50% prandial.",
 literature: [
 {
 type: "Clinical Guideline",
 icon: "📘",
 title: "Pharmacologic Approaches to Glycemic Treatment: Standards of Care in Diabetes",
 citation: "American Diabetes Association. Diabetes Care. 2024;47(Suppl. 1):S158-S178.",
 links: [{ text: "View Guidelines ↗", url: "https://diabetesjournals.org/care" }]
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
 headers: ["Phenotype", "Weight Factor", "Basal Share", "Prandial Share", "Physiological Rationale"],
 rows: [
 { id: "honeymoon", cols: ["T1D Honeymoon", "0.3 units/kg/day", "50%", "50%", "Residual endogenous beta-cell function reduces exogenous requirement."] },
 { id: "typical", cols: ["T1D / T2D Baseline", "0.5 units/kg/day", "50%", "50%", "Standard physiological replacement mimicking healthy pancreatic output."] },
 { id: "resistant", cols: ["T2D Severe Resistance", "0.8 – 1.0 units/kg/day", "50%", "50%", "Overcomes severe peripheral insulin resistance and hepatic glucose overproduction."] }
 ]
 },
 calc: function (v) {
 var factor = 0.5;
 var match = "typical";
 if (v.regimen === "t1d_honeymoon") { factor = 0.3; match = "honeymoon"; }
 else if (v.regimen === "t2d_resist") { factor = 0.8; match = "resistant"; }

 var tdd = +v.weight * factor;
 var basal = Math.round(tdd * 0.5);
 var prandial = Math.round(tdd * 0.5);

 return {
 value: Math.round(tdd) + " units/day (Basal: ~" + basal + "u | Total Bolus: ~" + prandial + "u)",
 matchId: match,
 eq: "Estimated TDD = Weight (kg) × " + factor + " units/kg\nStandard physiological distribution: 50% Basal + 50% Prandial.\n\nPathophysiology & Physiological Significance: Prevents ketoacidosis in absolute insulin deficiency (T1D) and glucotoxicity in T2D while avoiding iatrogenic hypoglycemia."
 };
 }
 },
 {
 id: "basalBolusCalc",
 cat: "endo",
 type: "calc",
 subcat: "Diabetes Mellitus",
 name: "Basal–Bolus Insulin Calculator",
 desc: "Splits known Total Daily Dose (TDD) into basal and mealtime doses.",
 organ: "Pancreas / Systemic",
 region: "Therapeutics",
 subject: "Insulin Dosing Regimens",
 keywords: ["basal", "bolus", "tdd", "prandial", "glargine", "lispro"],
 guidance: "1. Input the established or targeted TDD.\n2. Select preferred split (50/50 vs 40/60).\n3. Divides total prandial insulin across three main meals.",
 fields: [
 makeN("tdd", "Total Daily Insulin Dose (units)", 40, { min: 4, max: 300, step: 1 }),
 makeS("split", "Basal : Prandial Split", "50_50", [
 ["50_50", "50% Basal / 50% Bolus"],
 ["40_60", "40% Basal / 60% Bolus"]
 ])
 ],
 calc: function (v) {
 var tdd = +v.tdd;
 var basalPct = v.split === "50_50" ? 0.5 : 0.4;
 var basal = Math.round(tdd * basalPct);
 var bolusTotal = tdd - basal;
 var perMeal = Math.round(bolusTotal / 3);

 return {
 value: "Basal: " + basal + " units once daily | Prandial: " + perMeal + " units TID with meals",
 eq: "Basal Dose (" + (basalPct * 100) + "%) = " + basal + " units\nTotal Prandial = " + bolusTotal + " units → ~" + perMeal + " units per meal.\n\nPathophysiology & Physiological Significance: Mimics normal biphasic pancreatic secretion, suppressing hepatic gluconeogenesis overnight and between meals while covering acute postprandial glucose spikes."
 };
 }
 },
 {
 id: "corrInsulinCalc",
 cat: "endo",
 type: "calc",
 subcat: "Diabetes Mellitus",
 name: "Correction Insulin & Sensitivity Factor",
 desc: "Calculates Insulin Sensitivity Factor (ISF) and high-glucose correction dose.",
 organ: "Pancreas",
 region: "Therapeutics",
 subject: "Acute Hyperglycemia Management",
 keywords: ["isf", "correction dose", "rule of 1800", "rule of 1500", "hyperglycemia"],
 guidance: "1. Enter TDD, current glucose, target glucose, and insulin analog type.\n2. Uses Rule of 1800 for rapid analogs (lispro/aspart/glulisine) or 1500 for regular insulin.",
 fields: [
 makeN("tdd", "Total Daily Insulin Dose (units)", 45, { min: 5, max: 300 }),
 makeN("curr_glu", "Current Blood Glucose (mg/dL)", 240, { min: 70, max: 800 }),
 makeN("target_glu", "Target Blood Glucose (mg/dL)", 120, { min: 80, max: 180 }),
 makeS("analog", "Insulin Type", "rapid", [
 ["rapid", "Rapid-acting analog (Rule of 1800)"],
 ["regular", "Regular insulin (Rule of 1500)"]
 ])
 ],
 calc: function (v) {
 var rule = v.analog === "rapid" ? 1800 : 1500;
 var isf = Math.round(rule / +v.tdd);
 var excess = +v.curr_glu - +v.target_glu;
 if (excess <= 0) {
 return { value: "No correction needed (Glucose ≤ Target)", eq: "ISF = " + isf + " mg/dL reduction per 1 unit." };
 }
 var corrDose = excess / isf;
 return {
 value: corrDose.toFixed(1) + " units correction (ISF: 1u drops glucose " + isf + " mg/dL)",
 eq: "ISF = " + rule + " ÷ TDD = " + isf + " mg/dL/unit\nCorrection Dose = (Current Glucose − Target) ÷ ISF.\n\nPathophysiology & Physiological Significance: Quantifies how much a single unit of rapid-acting insulin lowers blood glucose, enabling safe correction of acute hyperglycemic spikes without stacking."
 };
 }
 },
 {
 id: "icrCalc",
 cat: "endo",
 type: "calc",
 subcat: "Diabetes Mellitus",
 name: "Insulin-to-Carbohydrate Ratio (ICR)",
 desc: "Rule of 500 for mealtime carbohydrate bolus calculation.",
 organ: "Pancreas",
 region: "Therapeutics",
 subject: "Carbohydrate Counting & Bolus Dosing",
 keywords: ["icr", "rule of 500", "carbs", "bolus", "insulin ratio"],
 guidance: "1. Enter current TDD and planned carbohydrate intake in grams.\n2. Rule of 500 estimates grams of carbohydrate covered by 1 unit of rapid-acting insulin.",
 fields: [
 makeN("tdd", "Total Daily Insulin Dose (units)", 50, { min: 5, max: 300 }),
 makeN("carbs", "Carbohydrates in meal (grams)", 60, { min: 0, max: 300 })
 ],
 calc: function (v) {
 var icr = Math.round(500 / +v.tdd);
 var mealBolus = +v.carbs / icr;
 return {
 value: mealBolus.toFixed(1) + " units meal bolus (ICR: 1 unit per " + icr + "g carbs)",
 eq: "Rule of 500: ICR = 500 ÷ TDD = 1 unit per " + icr + " grams of carbohydrate.\nMeal Bolus = Carbs (g) ÷ ICR.\n\nPathophysiology & Physiological Significance: Matches prandial insulin delivery to intestinal carbohydrate absorption rates, preventing postprandial glycemic excursions."
 };
 }
 },
 {
 id: "hypoClassification",
 cat: "endo",
 type: "class",
 subcat: "Diabetes Mellitus",
 name: "Hypoglycemia Classification",
 desc: "ADA/EASD international consensus severity classification for hypoglycemia.",
 organ: "Systemic / Brain",
 region: "Emergency / Safety",
 subject: "Patient Safety & Hypoglycemia",
 keywords: ["hypoglycemia", "glucose", "level 1", "level 2", "level 3", "rule of 15"],
 guidance: "1. Input measured glucose concentration and third-party assistance status.\n2. Level 1 (54–70 mg/dL): Rule of 15 (15g fast carbs, recheck in 15 min).\n3. Level 2 (<54 mg/dL): Clinically significant; urgent treatment needed.\n4. Level 3: Severe cognitive impairment requiring third-party assistance (glucagon/IV dextrose).",
 literature: [
 {
 type: "Consensus Statement",
 icon: "📄",
 title: "Glucose Concentrations of Less Than 3.0 mmol/L (54 mg/dL) Should Be Reported in Clinical Trials",
 citation: "International Hypoglycaemia Study Group. Diabetes Care. 2017;40(1):155-157.",
 links: [{ text: "View Statement ↗", url: "https://pubmed.ncbi.nlm.nih.gov/27658796/" }]
 }
 ],
 fields: [
 makeN("glu", "Measured Blood Glucose (mg/dL)", 58, { min: 10, max: 120 }),
 makeS("assistance", "Requires external third-party assistance to treat?", "0", [
 ["0", "No"],
 ["1", "Yes (Severe cognitive dysfunction)"]
 ])
 ],
 table: {
 headers: ["Level", "Glycemic Threshold", "Clinical Description", "Physiological Significance & Action"],
 rows: [
 { id: "lvl1", cols: ["Level 1", "54 – 70 mg/dL", "Hypoglycemia Alert Value", "Triggers autonomic counter-regulatory response (epinephrine, glucagon); treat with 15g fast-acting carbs."] },
 { id: "lvl2", cols: ["Level 2", "< 54 mg/dL", "Clinically Significant Hypoglycemia", "Onset of neuroglycopenia; immediate fast-acting carbohydrate treatment required."] },
 { id: "lvl3", cols: ["Severe", "Any glucose", "Severe Cognitive Impairment", "Loss of consciousness, seizures, or coma requiring parenteral Glucagon or IV Dextrose."] }
 ]
 },
 calc: function (v) {
 var g = +v.glu, assist = v.assistance === "1";
 var match = "lvl1";
 var c = "";

 if (assist) {
 match = "lvl3";
 c = "Level 3: Severe Hypoglycemia (Requires third-party assistance; administer Glucagon / IV Dextrose)";
 } else if (g < 54) {
 match = "lvl2";
 c = "Level 2: Clinically Significant Hypoglycemia (<54 mg/dL; immediate fast-acting carbohydrate)";
 } else if (g <= 70) {
 match = "lvl1";
 c = "Level 1: Hypoglycemia Alert Value (54–70 mg/dL; apply Rule of 15)";
 } else {
 c = "Glucose >70 mg/dL (Above official hypoglycemia alert threshold)";
 }

 return {
 value: c,
 matchId: match,
 eq: "Rule of 15: Administer 15g fast-acting carbohydrates, recheck in 15 minutes.\n\nPathophysiology & Physiological Significance: Prevents fatal neuroglycopenia, cardiac arrhythmias, and cerebral ischemia caused by central nervous system glucose deprivation."
 };
 }
 },
 {
 id: "dmRemissionRef",
 cat: "endo",
 type: "class",
 subcat: "Diabetes Mellitus",
 name: "Diabetes Remission Criteria Reference",
 desc: "International consensus criteria for remission of Type 2 Diabetes.",
 organ: "Pancreas / Systemic",
 region: "Endocrine Outcomes",
 subject: "Diabetes Remission Tracking",
 keywords: ["remission", "hba1c", "metabolic surgery", "bariatric", "lifestyle"],
 guidance: "1. Evaluate sustained HbA1c in patients off all glucose-lowering drugs for ≥3 months.\n2. Remission is defined as HbA1c <6.5% (<48 mmol/mol) in the absence of pharmacological therapy.",
 literature: [
 {
 type: "Consensus Report",
 icon: "📄",
 title: "Definition and Interpretation of Remission in Type 2 Diabetes",
 citation: "Riddle MC, Cefalu WT, Evans PH, et al. Diabetes Care. 2021;44(10):2438-2444.",
 links: [{ text: "View Consensus ↗", url: "https://pubmed.ncbi.nlm.nih.gov/34462359/" }]
 }
 ],
 fields: [
 makeN("a1c", "HbA1c without medication for ≥3 months (%)", 6.2, { min: 4.0, max: 12.0, step: 0.1 }),
 makeS("meds", "Active glucose-lowering medications taken?", "0", [
 ["0", "None (off all diabetes meds for ≥3 months)"],
 ["1", "Still taking metformin/GLP-1/SGLT2i or other meds"]
 ])
 ],
 calc: function (v) {
 var a1c = +v.a1c, noMeds = v.meds === "0";
 var isRemission = a1c < 6.5 && noMeds;
 return {
 value: isRemission 
? "Meets Type 2 Diabetes Remission Criteria (HbA1c <6.5% sustained off drugs)" 
: "Does not meet remission criteria (Requires HbA1c <6.5% completely off pharmacotherapy)",
 eq: "Consensus Statement: HbA1c <6.5% sustained for at least 3 months off drugs.\n\nPathophysiology & Physiological Significance: Demonstrates successful reversal of beta-cell glucotoxicity and restoration of near-normal insulin sensitivity following bariatric surgery or weight loss."
 };
 }
 },

 // ==========================================
 // B. THYROID DISORDERS
 // ==========================================
 {
 id: "tshGuide",
 cat: "endo",
 type: "class",
 subcat: "Thyroid Disorders",
 name: "TSH / FT4 Diagnostic Pattern Matrix",
 desc: "Algorithmic interpretation of thyroid function tests (TFTs).",
 organ: "Thyroid / Pituitary",
 region: "Neck / Endocrine",
 subject: "Thyroid Function Testing",
 keywords: ["tsh", "ft4", "hypothyroidism", "hyperthyroidism", "hashimoto", "graves"],
 guidance: "1. Select serum TSH status and Free T4 (FT4) level.\n2. Identifies overt primary, subclinical, central, or resistance patterns.\n3. Rule out acute non-thyroidal illness, pregnancy-specific ranges, and drug interference (biotin, amiodarone).",
 literature: [
 {
 type: "ATA Guidelines",
 icon: "📘",
 title: "Guidelines for Diagnosis and Management of Hyperthyroidism and Other Causes of Thyrotoxicosis",
 citation: "Ross DS, Burch HB, Cooper DS, et al. Thyroid. 2016;26(10):1343-1421.",
 links: [{ text: "View ATA Guidelines ↗", url: "https://pubmed.ncbi.nlm.nih.gov/27521817/" }]
 }
 ],
 fields: [
 makeS("tsh", "Serum TSH Level", "high", [
 ["low", "Suppressed / Low (<0.4 mIU/L)"],
 ["norm", "Normal (0.4–4.5 mIU/L)"],
 ["high", "Elevated (>4.5 mIU/L)"]
 ]),
 makeS("ft4", "Free T4 (FT4) Level", "low", [
 ["low", "Low"],
 ["norm", "Normal"],
 ["high", "Elevated"]
 ])
 ],
 table: {
 headers: ["TSH Status", "FT4 Status", "Biochemical Diagnosis", "Physiological Significance & Next Step"],
 rows: [
 { id: "prim_hypo", cols: ["Elevated", "Low", "Primary Overt Hypothyroidism", "Thyroid gland failure; feedback loop drives TSH up. Check anti-TPO antibodies; initiate Levothyroxine."] },
 { id: "sub_hypo", cols: ["Elevated", "Normal", "Subclinical Hypothyroidism", "Early thyroid failure with compensated pituitary feedback. Repeat TSH in 6–12 wks."] },
 { id: "prim_hyper", cols: ["Suppressed", "Elevated", "Primary Overt Hyperthyroidism", "Autonomous thyroid hormone excess suppressing TSH. Check TRAb and thyroid scintigraphy."] },
 { id: "sub_hyper", cols: ["Suppressed", "Normal", "Subclinical Hyperthyroidism", "Early thyrotoxicosis; measure Free T3 to evaluate for T3-toxicosis."] },
 { id: "central_hypo", cols: ["Low / Normal", "Low", "Central / Secondary Hypothyroidism", "Pituitary or hypothalamic failure. Evaluate sellar MRI and full anterior pituitary axis."] },
 { id: "tsh_oma", cols: ["High / Normal", "Elevated", "TSH-secreting Adenoma or Resistance", "Inappropriate TSH secretion unresponsive to negative feedback. Check pituitary MRI."] }
 ]
 },
 calc: function (v) {
 var pattern = "", match = "prim_hypo";
 if (v.tsh === "high" && v.ft4 === "low") { pattern = "Primary Overt Hypothyroidism"; match = "prim_hypo"; }
 else if (v.tsh === "high" && v.ft4 === "norm") { pattern = "Subclinical Hypothyroidism"; match = "sub_hypo"; }
 else if (v.tsh === "low" && v.ft4 === "high") { pattern = "Primary Overt Hyperthyroidism / Thyrotoxicosis"; match = "prim_hyper"; }
 else if (v.tsh === "low" && v.ft4 === "norm") { pattern = "Subclinical Hyperthyroidism"; match = "sub_hyper"; }
 else if (v.tsh === "low" && v.ft4 === "low") { pattern = "Central (Secondary/Tertiary) Hypothyroidism"; match = "central_hypo"; }
 else if (v.tsh === "high" && v.ft4 === "high") { pattern = "TSH-mediated Hyperthyroidism (TSHoma vs Thyroid Hormone Resistance)"; match = "tsh_oma"; }
 else { pattern = "Euthyroid Pattern (Normal TFTs)"; match = "prim_hypo"; }

 return {
 value: pattern,
 matchId: match,
 eq: "Logarithmic log-linear feedback relationship between TSH and Free T4.\n\nPathophysiology & Physiological Significance: Unlocks the primary vs central axis feedback dynamics governing basal metabolic rate and oxygen consumption."
 };
 }
 },
 {
 id: "bwpsScore",
 cat: "endo",
 type: "class",
 subcat: "Thyroid Disorders",
 name: "Thyroid Storm — Burch–Wartofsky Point Scale",
 desc: "Bedside scoring tool for evaluating the likelihood of acute, life-threatening thyroid storm.",
 organ: "Thyroid / Heart / Systemic",
 region: "Emergency / Endocrine Critical Care",
 subject: "Thyrotoxic Crisis Management",
 keywords: ["bwps", "burch-wartofsky", "thyroid storm", "thyrotoxicosis", "fever", "tachycardia"],
 guidance: "1. Sum assigned points across 7 clinical domains.\n2. Score ≥45 indicates Thyroid Storm; 25–44 impending storm; <25 unlikely.\n3. High score warrants immediate ICU admission and multimodal therapy (Propylthiouracil/Methimazole, Iodine, Beta-blocker, Hydrocortisone).",
 literature: [
 {
 type: "Seminal Publication",
 icon: "📄",
 title: "Life-threatening thyrotoxicosis. Thyroid storm",
 citation: "Burch HB, Wartofsky L. Endocrinol Metab Clin North Am. 1993;22(2):263-277.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/8325287/" }]
 }
 ],
 fields: [
 makeS("temp", "Temperature (°F)", "0", [
 ["0", "<99.0 (0 pts)"],
 ["5", "99.0–99.9 (+5 pts)"],
 ["10", "100.0–100.9 (+10 pts)"],
 ["15", "101.0–101.9 (+15 pts)"],
 ["20", "102.0–102.9 (+20 pts)"],
 ["25", "103.0–103.9 (+25 pts)"],
 ["30", "≥104.0 (+30 pts)"]
 ]),
 makeS("cns", "CNS Dysfunction", "0", [
 ["0", "Absent (0 pts)"],
 ["10", "Mild (agitation, anxiety: +10 pts)"],
 ["20", "Moderate (delirium, psychosis, extreme lethargy: +20 pts)"],
 ["30", "Severe (seizures, coma: +30 pts)"]
 ]),
 makeS("gi", "GI / Hepatic Dysfunction", "0", [
 ["0", "Absent (0 pts)"],
 ["10", "Moderate (diarrhea, nausea, vomiting, abdominal pain: +10 pts)"],
 ["20", "Severe (unexplained jaundice: +20 pts)"]
 ]),
 makeS("hr", "Tachycardia (beats/min)", "0", [
 ["0", "<90 (0 pts)"],
 ["5", "90–109 (+5 pts)"],
 ["10", "110–119 (+10 pts)"],
 ["15", "120–129 (+15 pts)"],
 ["20", "130–139 (+20 pts)"],
 ["25", "≥140 (+25 pts)"]
 ]),
 makeS("chf", "Congestive Heart Failure", "0", [
 ["0", "Absent (0 pts)"],
 ["5", "Mild (pedal edema: +5 pts)"],
 ["10", "Moderate (bibasilar rales: +10 pts)"],
 ["15", "Severe (pulmonary edema: +15 pts)"]
 ]),
 makeS("af", "Atrial Fibrillation Present?", "0", [
 ["0", "No (0 pts)"],
 ["10", "Yes (+10 pts)"]
 ]),
 makeS("precip", "Precipitating Event Identified?", "0", [
 ["0", "No (0 pts)"],
 ["10", "Yes (+10 pts)"]
 ])
 ],
 table: {
 headers: ["BWPS Total Score", "Likelihood of Thyroid Storm", "Management & Physiological Significance"],
 rows: [
 { id: "storm", cols: ["≥ 45 Points", "Highly Suggestive of Thyroid Storm", "Immediate ICU admission, thionamides, inorganic iodine, beta-blockers, and stress-dose glucocorticoids to avert cardiovascular collapse."] },
 { id: "impending", cols: ["25 – 44 Points", "Impending Thyroid Storm", "Aggressive surveillance and preemptive treatment of precipitating triggers."] },
 { id: "unlikely", cols: ["< 25 Points", "Thyroid Storm Unlikely", "Investigate alternative etiologies for fever and tachycardia."] }
 ]
 },
 calc: function (v) {
 var total = +v.temp + +v.cns + +v.gi + +v.hr + +v.chf + +v.af + +v.precip;
 var match = "unlikely";
 var c = "";
 if (total >= 45) {
 match = "storm";
 c = "Highly suggestive of Thyroid Storm (≥45 points)";
 } else if (total >= 25) {
 match = "impending";
 c = "Impending Thyroid Storm (25–44 points)";
 } else {
 c = "Thyroid storm unlikely (<25 points)";
 }
 return {
 value: total + " Points — " + c,
 matchId: match,
 eq: "BWPS Total = Temp + CNS + GI + Heart Rate + CHF + AF + Precipitating Event.\n\nPathophysiology & Physiological Significance: Captures multi-organ adrenergic hypersensitivity, hypermetabolic state, and systemic decompensation triggered by overwhelming thyroid hormone excess."
 };
 }
 },
 {
 id: "jtaThyroidStorm",
 cat: "endo",
 type: "class",
 subcat: "Thyroid Disorders",
 name: "Japanese Thyroid Association (JTA) Storm Criteria",
 desc: "Diagnostic criteria classifying Thyroid Storm into TS1 (definite) and TS2 (suspected).",
 organ: "Thyroid / Systemic",
 region: "Emergency Medicine",
 subject: "Thyroid Emergencies",
 keywords: ["jta", "thyroid storm", "japan thyroid association", "ts1", "ts2"],
 guidance: "1. Requires documented thyrotoxicosis (elevated FT4/FT3).\n2. TS1 (Definite): Thyrotoxicosis + (CNS symptoms + ≥1 other feature) OR (≥3 other features).\n3. TS2 (Suspected): Thyrotoxicosis + combination of 2 other features.",
 literature: [
 {
 type: "JTA Guideline",
 icon: "📄",
 title: "Primary diagnostic criteria for thyroid storm",
 citation: "Akamizu T, Satoh T, Isozaki O, et al. Thyroid. 2012;22(7):661-679.",
 links: [{ text: "View Diagnostic Criteria ↗", url: "https://pubmed.ncbi.nlm.nih.gov/22690898/" }]
 }
 ],
 fields: [
 makeS("thyro", "Documented Thyrotoxicosis (elevated FT4/FT3)?", "1", [
 ["1", "Yes (Documented)"],
 ["0", "No"]
 ]),
 makeS("cns", "CNS Manifestations (restlessness, delirium, coma)", "0", [
 ["0", "Absent"],
 ["1", "Present"]
 ]),
 makeN("other", "Count of other signs (Fever ≥38°C, Tachycardia ≥130, CHF, GI/Jaundice)", 1, { min: 0, max: 4, step: 1 })
 ],
 calc: function (v) {
 var thyro = v.thyro === "1";
 var cns = v.cns === "1";
 var o = +v.other;
 
if (!thyro) {
 return { value: "Criteria Not Met", eq: "Documented thyrotoxicosis is mandatory for JTA classification." };
 }
 
var res = "";
 if ((cns && o >= 1) || o >= 3) res = "TS1: Definite Thyroid Storm";
 else if (cns || o >= 2) res = "TS2: Suspected Thyroid Storm";
 else res = "Does not meet JTA Thyroid Storm Criteria";

 return {
 value: res,
 eq: "JTA Framework: Classifies based on combination of CNS, fever, tachycardia, CHF, and GI manifestations.\n\nPathophysiology & Physiological Significance: Validates acute thyrotoxic crisis using objective multi-system organ dysfunction metrics."
 };
 }
 },
 {
 id: "popoveniucScore",
 cat: "endo",
 type: "class",
 subcat: "Thyroid Disorders",
 name: "Myxedema Coma — Popoveniuc Score",
 desc: "Quantitative diagnostic scoring tool for life-threatening severe hypothyroidism.",
 organ: "Thyroid / Brain / Systemic",
 region: "Emergency / Critical Care",
 subject: "Myxedema Coma Risk Assessment",
 keywords: ["myxedema coma", "popoveniuc", "hypothermia", "bradycardia", "coma"],
 guidance: "1. Sum assigned points across temperature, CNS, GI, cardiovascular, and precipitating factors.\n2. Score ≥60 indicates high probability of Myxedema Coma.\n3. Mandatory note: Stress-dose hydrocortisone MUST precede thyroid hormone administration to prevent acute adrenal crisis.",
 literature: [
 {
 type: "Validation Article",
 icon: "📄",
 title: "Diagnostic rating system for myxedema coma",
 citation: "Popoveniuc G, Chandra T, Sud A, et al. Endocr Pract. 2014;20(8):808-817.",
 links: [{ text: "View Study ↗", url: "https://pubmed.ncbi.nlm.nih.gov/24709686/" }]
 }
 ],
 fields: [
 makeS("temp", "Body Temperature (°F)", "0", [
 ["0", "≥95.0 (0 pts)"],
 ["10", "93.0–94.9 (+10 pts)"],
 ["20", "<93.0 (+20 pts)"]
 ]),
 makeS("cns", "CNS Dysfunction", "0", [
 ["0", "Normal (0 pts)"],
 ["10", "Somnolence / Lethargy (+10 pts)"],
 ["20", "Stupor (+20 pts)"],
 ["30", "Coma (+30 pts)"]
 ]),
 makeS("gi", "GI Features (ileus, severe obstipation)", "0", [
 ["0", "Absent (0 pts)"],
 ["10", "Present (+10 pts)"]
 ]),
 makeS("cv", "Cardiovascular (Bradycardia <50, Hypotension SBP <90)", "0", [
 ["0", "Absent (0 pts)"],
 ["10", "Present (+10 pts)"]
 ]),
 makeS("precip", "Precipitating Illness / Infection", "0", [
 ["0", "Absent (0 pts)"],
 ["10", "Present (+10 pts)"]
 ])
 ],
 calc: function (v) {
 var total = +v.temp + +v.cns + +v.gi + +v.cv + +v.precip;
 var c = total >= 60 ? "High Risk for Myxedema Coma (≥60 pts)" : total >= 25 ? "Intermediate Risk (25–59 pts)" : "Low Risk (<25 pts)";
 return {
 value: total + " Points — " + c,
 eq: "Popoveniuc Score: Critical rule—Always administer IV Glucocorticoids before IV Levothyroxine/T3.\n\nPathophysiology & Physiological Significance: Quantifies profound systemic hypometabolism, hypothermia, and encephalopathy, directing emergency supportive and hormone replacement therapies."
 };
 }
 },
 {
 id: "tiradsRef",
 cat: "endo",
 type: "class",
 subcat: "Thyroid Disorders",
 name: "Thyroid Nodule ACR TI-RADS Reference",
 desc: "Ultrasound risk stratification and FNA fine-needle biopsy size thresholds.",
 organ: "Thyroid",
 region: "Neck Ultrasound",
 subject: "Thyroid Nodule Evaluation",
 keywords: ["ti-rads", "acr tirads", "thyroid nodule", "fna", "biopsy", "ultrasound"],
 guidance: "1. Sum ACR TI-RADS points derived from composition, echogenicity, shape, margin, and echogenic foci.\n2. Identifies risk tier (TR1–TR5) and size cutoff for FNA biopsy vs ultrasound follow-up.",
 literature: [
 {
 type: "ACR White Paper",
 icon: "📘",
 title: "ACR Thyroid Imaging Reporting and Data System (TI-RADS): White Paper of the ACR TI-RADS Committee",
 citation: "Tessler FN, Middleton WD, Grant EG, et al. J Am Coll Radiol. 2017;14(5):587-595.",
 links: [{ text: "View ACR Guidelines ↗", url: "https://pubmed.ncbi.nlm.nih.gov/28373099/" }]
 }
 ],
 fields: [
 makeS("points", "Select ACR TI-RADS Category", "tr3", [
 ["tr1", "0 points: TR1 (Benign — <2% risk)"],
 ["tr2", "2 points: TR2 (Not Suspicious — <2% risk)"],
 ["tr3", "3 points: TR3 (Mildly Suspicious — 5% risk)"],
 ["tr4", "4–6 points: TR4 (Moderately Suspicious — 5–20% risk)"],
 ["tr5", "≥7 points: TR5 (Highly Suspicious — >20% risk)"]
 ])
 ],
 table: {
 headers: ["Category", "Malignancy Risk", "FNA Biopsy Threshold", "US Follow-up Threshold"],
 rows: [
 { id: "tr1", cols: ["TR1 / TR2", "< 2%", "No FNA recommended", "No routine follow-up"] },
 { id: "tr3", cols: ["TR3", "~5%", "FNA if ≥ 2.5 cm", "Follow US if ≥ 1.5 cm"] },
 { id: "tr4", cols: ["TR4", "5 – 20%", "FNA if ≥ 1.5 cm", "Follow US if ≥ 1.0 cm"] },
 { id: "tr5", cols: ["TR5", "> 20%", "FNA if ≥ 1.0 cm", "Follow US if ≥ 0.5 cm"] }
 ]
 },
 calc: function (v) {
 var txt = "", match = "tr3";
 if (v.points === "tr1" || v.points === "tr2") { txt = "No FNA required."; match = "tr1"; }
 else if (v.points === "tr3") { txt = "FNA if nodule ≥2.5 cm; follow on US if ≥1.5 cm."; match = "tr3"; }
 else if (v.points === "tr4") { txt = "FNA if nodule ≥1.5 cm; follow on US if ≥1.0 cm."; match = "tr4"; }
 else { txt = "FNA if nodule ≥1.0 cm; follow on US if ≥0.5 cm."; match = "tr5"; }

 return {
 value: v.points.toUpperCase() + " — " + txt,
 matchId: match,
 eq: "ACR TI-RADS Standardized Guidance based on 5 ultrasound feature domains.\n\nPathophysiology & Physiological Significance: Balances malignancy detection against unnecessary invasive biopsies by categorizing nodular sonographic architectural patterns."
 };
 }
 },
 {
 id: "thyroidVolCalc",
 cat: "endo",
 type: "calc",
 subcat: "Thyroid Disorders",
 name: "Thyroid Volume Calculator",
 desc: "Calculates total thyroid volume using 3D ultrasound ellipsoid dimensions.",
 organ: "Thyroid",
 region: "Neck Ultrasound",
 subject: "Goiter & Thyroid Morphometry",
 keywords: ["thyroid volume", "goiter", "ellipsoid", "ultrasound", "graves"],
 guidance: "1. Measure Length, Width, and Depth (cm) for both Right and Left thyroid lobes.\n2. Normal thyroid volume is typically <18 mL in females and <25 mL in males.\n3. Excludes isthmus volume unless significantly hypertrophied.",
 fields: [
 makeN("r_l", "Right Lobe Length (cm)", 4.5, { min: 1, max: 15, step: 0.1 }),
 makeN("r_w", "Right Lobe Width (cm)", 1.8, { min: 0.5, max: 10, step: 0.1 }),
 makeN("r_d", "Right Lobe Depth (cm)", 1.5, { min: 0.5, max: 10, step: 0.1 }),
 makeN("l_l", "Left Lobe Length (cm)", 4.2, { min: 1, max: 15, step: 0.1 }),
 makeN("l_w", "Left Lobe Width (cm)", 1.7, { min: 0.5, max: 10, step: 0.1 }),
 makeN("l_d", "Left Lobe Depth (cm)", 1.4, { min: 0.5, max: 10, step: 0.1 })
 ],
 calc: function (v) {
 var rVol = +v.r_l * +v.r_w * +v.r_d * 0.523;
 var lVol = +v.l_l * +v.l_w * +v.l_d * 0.523;
 var total = rVol + lVol;
 var c = total > 25 ? "Enlarged (Goiter: >25 mL in males, >18 mL in females)" : "Normal overall volume";

 return {
 value: total.toFixed(1) + " mL (Right: " + rVol.toFixed(1) + " mL | Left: " + lVol.toFixed(1) + " mL) — " + c,
 eq: "Ellipsoid Formula: Volume (mL) = Length × Width × Depth × 0.523 for each lobe.\n\nPathophysiology & Physiological Significance: Quantifies glandular hypertrophy resulting from iodine deficiency, autoimmune stimulation (Graves), or multinodular goiter."
 };
 }
 },
 {
 id: "lt4DoseHelper",
 cat: "endo",
 type: "calc",
 subcat: "Thyroid Disorders",
 name: "Levothyroxine Replacement Dose Helper",
 desc: "Initial oral daily dose estimation for primary hypothyroidism.",
 organ: "Thyroid / Systemic",
 region: "Pharmacotherapy",
 subject: "Thyroid Replacement Dosing",
 keywords: ["levothyroxine", "synthroid", "hypothyroidism", "tsh", "lt4 dose"],
 guidance: "1. Primary overt hypothyroidism: Full replacement dose is ~1.6 mcg/kg ideal body weight.\n2. In elderly patients (>60 years) or those with coronary artery disease, start low (25–50 mcg/day) to prevent angina or arrhythmias.",
 fields: [
 makeN("weight", "Patient Weight (kg)", 70, { min: 30, max: 250 }),
 makeS("category", "Clinical Profile", "adult", [
 ["adult", "Healthy adult (<60 years, no CAD: 1.6 mcg/kg)"],
 ["elderly", "Elderly or known CAD (conservative: 25–50 mcg/day)"],
 ["subclinical", "Subclinical hypothyroidism (partial replacement: 25–50 mcg/day)"]
 ])
 ],
 calc: function (v) {
 if (v.category === "elderly" || v.category === "subclinical") {
 return {
 value: "25–50 mcg orally once daily",
 eq: "Start conservative dose. Recheck TSH in 6–8 weeks and titrate by 12.5–25 mcg increments."
 };
 }
 var dose = Math.round((+v.weight * 1.6) / 12.5) * 12.5;
 return {
 value: dose + " mcg orally once daily (rounded to commercial dose)",
 eq: "Full Replacement = 1.6 mcg/kg/day. Take on empty stomach with water 30–60 mins before breakfast.\n\nPathophysiology & Physiological Significance: Restores circulating thyroxine pools to normalize basal metabolic rate, thermogenesis, and lipid metabolism."
 };
 }
 },

 // ==========================================
 // C. ADRENAL DISORDERS
 // ==========================================
 {
 id: "arrCalc",
 cat: "endo",
 type: "calc",
 subcat: "Adrenal Disorders",
 name: "Aldosterone-to-Renin Ratio (ARR)",
 desc: "First-line screening ratio for Primary Aldosteronism in hypertension.",
 organ: "Adrenal Cortex / Kidney",
 region: "Retroperitoneal / Endocrine",
 subject: "Endocrine Hypertension Screening",
 keywords: ["arr", "aldosterone", "renin", "primary aldosteronism", "conn syndrome", "hypertension"],
 guidance: "1. Input Plasma Aldosterone Concentration (PAC, ng/dL) and Plasma Renin Activity (PRA, ng/mL/h).\n2. ARR ≥20–30 with absolute PAC ≥10–15 ng/dL indicates a POSITIVE screen.\n3. Discontinue mineralocorticoid receptor antagonists (spironolactone/eplerenone) for ≥4–6 weeks prior to testing.",
 literature: [
 {
 type: "Endocrine Society Clinical Practice Guideline",
 icon: "📘",
 title: "Management of Primary Aldosteronism: Case Detection, Diagnosis, and Treatment",
 citation: "Funder JW, Carey RM, Mantero F, et al. J Clin Endocrinol Metab. 2016;101(5):1889-1916.",
 links: [{ text: "View Guidelines ↗", url: "https://pubmed.ncbi.nlm.nih.gov/26934778/" }]
 }
 ],
 fields: [
 makeN("pac", "Plasma Aldosterone Concentration (PAC, ng/dL)", 24, { min: 1, max: 200, step: 0.5 }),
 makeN("pra", "Plasma Renin Activity (PRA, ng/mL/h)", 0.6, { min: 0.1, max: 50, step: 0.1 })
 ],
 table: {
 headers: ["ARR Score", "PAC Level", "Screening Result", "Physiological Significance & Action"],
 rows: [
 { id: "positive", cols: ["≥ 20 – 30", "≥ 10 – 15 ng/dL", "POSITIVE Screening Test", "Autonomous aldosterone hypersecretion suppressing renin. Proceed to confirmatory suppression testing."] },
 { id: "negative", cols: ["< 20", "Any level", "Negative Screening Test", "Primary aldosteronism unlikely; evaluate essential hypertension or renal artery stenosis."] }
 ]
 },
 calc: function (v) {
 var arr = +v.pac / +v.pra;
 var isPos = arr >= 20 && +v.pac >= 10;
 var match = isPos ? "positive" : "negative";
 var c = isPos ? "POSITIVE SCREEN (Confirmatory test indicated)" : "Negative screening ratio (<20)";

 return {
 value: "ARR: " + arr.toFixed(1) + " (ng/dL per ng/mL/h) — " + c,
 matchId: match,
 eq: "ARR Formula = PAC (ng/dL) ÷ PRA (ng/mL/h).\n\nPathophysiology & Physiological Significance: Unmasks autonomous mineralocorticoid excess that drives sodium retention, potassium wasting, and resistant hypertension independent of angiotensin II."
 };
 }
 },
 {
 id: "cortisolUnitConv",
 cat: "endo",
 type: "calc",
 subcat: "Adrenal Disorders",
 name: "Cortisol Unit Conversion",
 desc: "Converts serum cortisol between mass (µg/dL) and SI molar units (nmol/L).",
 organ: "Adrenal / Systemic",
 region: "Laboratory Endocrinology",
 subject: "Unit Conversions",
 keywords: ["cortisol", "conversion", "ug/dl", "nmol/l", "cushing", "addison"],
 guidance: "1. Standard conversion factor: 1 µg/dL = 27.59 nmol/L.\n2. Morning peak cortisol (8 AM): 5–25 µg/dL (140–690 nmol/L).",
 fields: [
 makeN("val", "Cortisol Concentration", 18, { min: 0.1, max: 2000, step: 0.1 }),
 makeS("dir", "Conversion Direction", "ug_to_nmol", [
 ["ug_to_nmol", "µg/dL to nmol/L"],
 ["nmol_to_ug", "nmol/L to µg/dL"]
 ])
 ],
 calc: function (v) {
 if (v.dir === "ug_to_nmol") {
 var nmol = +v.val * 27.59;
 return { value: nmol.toFixed(1) + " nmol/L", eq: "Formula: µg/dL × 27.59 = nmol/L\n\nPathophysiology & Physiological Significance: Harmonizes glucocorticoid laboratory data across international clinical assays." };
 } else {
 var ug = +v.val / 27.59;
 return { value: ug.toFixed(2) + " µg/dL", eq: "Formula: nmol/L ÷ 27.59 = µg/dL\n\nPathophysiology & Physiological Significance: Harmonizes glucocorticoid laboratory data across international clinical assays." };
 }
 }
 },
 {
 id: "acthStimInterp",
 cat: "endo",
 type: "class",
 subcat: "Adrenal Disorders",
 name: "ACTH Stimulation Test Interpretation",
 desc: "Short Synacthen (250 mcg cosyntropin) stimulation test interpreter.",
 organ: "Adrenal Cortex",
 region: "Retroperitoneal / Endocrine",
 subject: "Adrenal Insufficiency Testing",
 keywords: ["acth stim", "cosyntropin", "synacthen", "adrenal insufficiency", "addison"],
 guidance: "1. Measure serum cortisol baseline, 30 min, and 60 min after 250 mcg IV/IM Cosyntropin.\n2. Peak cortisol ≥18.0 µg/dL (500 nmol/L) rules out primary adrenal insufficiency.\n3. Note: Monoclonal cortisol assays may use lower post-stim cutoffs (~14–15 µg/dL).",
 literature: [
 {
 type: "Endocrine Society Guideline",
 icon: "📘",
 title: "Diagnosis and Treatment of Primary Adrenal Insufficiency: An Endocrine Society Guideline",
 citation: "Bornstein SR, Allolio B, Arlt W, et al. J Clin Endocrinol Metab. 2016;101(2):364-389.",
 links: [{ text: "View Guideline ↗", url: "https://pubmed.ncbi.nlm.nih.gov/26760001/" }]
 }
 ],
 fields: [
 makeN("peak", "Peak 30-min or 60-min Cortisol (µg/dL)", 19.5, { min: 1, max: 80, step: 0.1 })
 ],
 calc: function (v) {
 var p = +v.peak;
 var passes = p >= 18.0;
 return {
 value: p + " µg/dL — " + (passes ? "Normal Cortisol Response (≥18.0 µg/dL)" : "Subnormal Response (<18.0 µg/dL — Adrenal Insufficiency)"),
 eq: "Diagnostic Criterion: Peak post-stimulation cortisol threshold = 18.0 µg/dL (500 nmol/L).\n\nPathophysiology & Physiological Significance: Tests the maximal secretory reserve of the zona fasciculata in the adrenal cortex, confirming or excluding Addison disease."
 };
 }
 },
 {
 id: "dstInterpRef",
 cat: "endo",
 type: "class",
 subcat: "Adrenal Disorders",
 name: "1 mg Overnight Dexamethasone Suppression Test (DST)",
 desc: "Screening test interpretation for hypercortisolism / Cushing syndrome.",
 organ: "Adrenal / Pituitary",
 region: "Systemic",
 subject: "Cushing Syndrome Screening",
 keywords: ["dst", "dexamethasone", "cushing", "hypercortisolism", "cortisol"],
 guidance: "1. Patient takes 1 mg oral dexamethasone at 11 PM; serum cortisol is measured at 8 AM next morning.\n2. Serum cortisol ≤1.8 µg/dL (50 nmol/L) excludes autonomous hypercortisolism.\n3. Confirm abnormal results with 24-hour urine free cortisol or late-night salivary cortisol.",
 literature: [
 {
 type: "Endocrine Society Guideline",
 icon: "📘",
 title: "The Diagnosis of Cushing's Syndrome: An Endocrine Society Clinical Practice Guideline",
 citation: "Nieman LK, Biller BM, Findling JW, et al. J Clin Endocrinol Metab. 2008;93(5):1526-1540.",
 links: [{ text: "View Guideline ↗", url: "https://pubmed.ncbi.nlm.nih.gov/18337428/" }]
 }
 ],
 fields: [
 makeN("post_cort", "Post-Dexamethasone 8 AM Cortisol (µg/dL)", 1.2, { min: 0.2, max: 50, step: 0.1 })
 ],
 calc: function (v) {
 var c = +v.post_cort;
 var suppressed = c <= 1.8;
 return {
 value: c + " µg/dL — " + (suppressed ? "Normal Suppression (≤1.8 µg/dL; Excludes Cushing)" : "Abnormal Non-Suppression (>1.8 µg/dL; Cushing suspected)"),
 eq: "High Sensitivity Cutoff: 1.8 µg/dL (50 nmol/L).\n\nPathophysiology & Physiological Significance: Assesses negative feedback inhibition of the HPA axis; failure to suppress indicates autonomous cortisol hypersecretion."
 };
 }
 },

 // ==========================================
 // D. PITUITARY AND HYPOTHALAMUS
 // ==========================================
 {
 id: "waterDeprivRef",
 cat: "endo",
 type: "class",
 subcat: "Pituitary and Hypothalamus",
 name: "Water Deprivation Test Interpretation",
 desc: "Differential diagnosis protocol for polyuria-polydipsia syndromes (Central vs Nephrogenic DI vs Primary Polydipsia).",
 organ: "Pituitary / Kidney",
 region: "Neuroendocrine / Renal",
 subject: "Water Balance & Diabetes Insipidus",
 keywords: ["water deprivation", "diabetes insipidus", "ddavp", "desmopressin", "primary polydipsia", "adh"],
 guidance: "1. Fluid restriction until plasma osmolality >295 mOsm/kg or weight loss >3–5%.\n2. Measure urine osmolality, then inject Desmopressin (DDAVP) and recheck urine osmolality.\n3. Central DI shows marked rise in urine osmolality (>50%) after DDAVP; Nephrogenic DI shows <10% response.",
 literature: [
 {
 type: "Review Article",
 icon: "📄",
 title: "Diagnosis and Management of Diabetes Insipidus for the Endocrinologist",
 citation: "Christ-Crain M, Bichet DG, Fenske WK, et al. Nat Rev Endocrinol. 2019;15(10):587-598.",
 links: [{ text: "View Article ↗", url: "https://pubmed.ncbi.nlm.nih.gov/31346265/" }]
 }
 ],
 fields: [
 makeS("pre", "Urine Osmolality after dehydration (prior to DDAVP)", "low", [
 ["low", "Dilute urine (<300 mOsm/kg)"],
 ["iso", "Intermediate (300–750 mOsm/kg)"],
 ["high", "Concentrated (>750 mOsm/kg; normal response)"]
 ]),
 makeS("post", "Urine Osmolality Increase post-Desmopressin (DDAVP)", "rise50", [
 ["rise50", ">50% Significant increase in urine osmolality"],
 ["rise10", "10% – 50% Moderate increase"],
 ["no_rise", "<10% Minimal or no increase"]
 ])
 ],
 table: {
 headers: ["Diagnosis", "Urine Osm (Post-Fluid Restriction)", "DDAVP Response", "Physiological Significance"],
 rows: [
 { id: "cdi", cols: ["Complete Central DI", "< 300 mOsm/kg", "> 50% increase", "Posterior pituitary vasopressin deficiency corrected by exogenous V2 receptor agonist."] },
 { id: "ndi", cols: ["Complete Nephrogenic DI", "< 300 mOsm/kg", "< 10% minimal rise", "Renal tubular V2 receptor resistance unresponsive to exogenous vasopressin."] },
 { id: "pp", cols: ["Primary Polydipsia", "> 750 mOsm/kg", "No significant change", "Intact ADH axis and renal concentrating ability; excessive primary fluid intake."] }
 ]
 },
 calc: function (v) {
 var dx = "", match = "cdi";
 if (v.pre === "high") { dx = "Primary Polydipsia (Intact endogenous ADH)"; match = "pp"; }
 else if (v.pre === "low" && v.post === "rise50") { dx = "Complete Central Diabetes Insipidus (Deficiency of ADH)"; match = "cdi"; }
 else if (v.pre === "low" && v.post === "no_rise") { dx = "Complete Nephrogenic Diabetes Insipidus (Renal ADH resistance)"; match = "ndi"; }
 else { dx = "Partial Central DI vs Partial Nephrogenic DI vs Medullary Washout"; match = "cdi"; }

 return {
 value: dx,
 matchId: match,
 eq: "Water Deprivation Protocol: Evaluates endogenous ADH release followed by renal V2 receptor responsiveness.\n\nPathophysiology & Physiological Significance: Differentiates central neurohypophyseal failure from renal tubular unresponsiveness and primary behavioral water loading."
 };
 }
 },
 {
 id: "prolactinConv",
 cat: "endo",
 type: "calc",
 subcat: "Pituitary and Hypothalamus",
 name: "Prolactin Unit Conversion & Assessment",
 desc: "Converts prolactin between ng/mL and mIU/L and evaluates severity.",
 organ: "Pituitary",
 region: "Sella Turcica / Neuroendocrine",
 subject: "Hyperprolactinemia",
 keywords: ["prolactin", "prolactinoma", "conversion", "ng/ml", "miu/l", "galactorrhea"],
 guidance: "1. Conversion factor: 1 ng/mL ≈ 21.2 mIU/L.\n2. Prolactin >250 ng/mL strongly suggests macroprolactinoma.\n3. In giant adenomas with normal prolactin, rule out 'Hook Effect' by running serial sample dilutions.",
 literature: [
 {
 type: "Endocrine Society Guideline",
 icon: "📘",
 title: "Diagnosis and Treatment of Hyperprolactinemia: An Endocrine Society Clinical Practice Guideline",
 citation: "Melmed S, Casanueva FF, Hoffman AR, et al. J Clin Endocrinol Metab. 2011;96(2):273-288.",
 links: [{ text: "View Guideline ↗", url: "https://pubmed.ncbi.nlm.nih.gov/21296991/" }]
 }
 ],
 fields: [
 makeN("val", "Prolactin Concentration", 85, { min: 1, max: 10000, step: 1 }),
 makeS("dir", "Units", "ng_ml", [
 ["ng_ml", "ng/mL (µg/L)"],
 ["miu_l", "mIU/L"]
 ])
 ],
 calc: function (v) {
 var ng = v.dir === "ng_ml" ? +v.val : +v.val / 21.2;
 var miu = v.dir === "ng_ml" ? +v.val * 21.2 : +v.val;
 var c = "";
 if (ng > 250) c = "Massive elevation (>250 ng/mL; Virtually diagnostic of macroprolactinoma)";
 else if (ng > 100) c = "Moderate elevation (100–250 ng/mL; Prolactinoma likely)";
 else if (ng > 25) c = "Mild hyperprolactinemia (Drugs, stalk compression, microadenoma)";
 else c = "Normal Prolactin Level (<25 ng/mL)";

 return {
 value: ng.toFixed(1) + " ng/mL (" + Math.round(miu) + " mIU/L) — " + c,
 eq: "Conversion: 1 ng/mL = 21.2 mIU/L.\n\nPathophysiology & Physiological Significance: Evaluates lactotroph axis regulation and identifies autonomous pituitary tumor secretion vs dopamine antagonist drug effects."
 };
 }
 },

 // ==========================================
 // E. CALCIUM, PHOSPHATE AND BONE METABOLISM
 // ==========================================
 {
 id: "corrCalcium",
 cat: "endo",
 type: "calc",
 subcat: "Calcium, Phosphate and Bone Metabolism",
 name: "Albumin-Corrected Calcium",
 desc: "Adjusts total serum calcium for hypoalbuminemia or hyperalbuminemia.",
 organ: "Parathyroid / Bone / Kidney",
 region: "Systemic Electrolytes",
 subject: "Calcium Disorders",
 keywords: ["corrected calcium", "albumin", "hypercalcemia", "hypocalcemia", "parathyroid"],
 guidance: "1. Formula: Corrected Ca = Total Ca + 0.8 × (4.0 − Albumin).\n2. Ionized serum calcium is gold standard when available.",
 fields: [
 makeN("ca", "Measured Total Calcium (mg/dL)", 8.2, { min: 3, max: 20, step: 0.1 }),
 makeN("alb", "Serum Albumin (g/dL)", 2.8, { min: 0.5, max: 6.0, step: 0.1 })
 ],
 calc: function (v) {
 var corr = +v.ca + 0.8 * (4.0 - +v.alb);
 var c = corr > 10.5 ? "Hypercalcemia (>10.5 mg/dL)" : corr < 8.5 ? "Hypocalcemia (<8.5 mg/dL)" : "Normal corrected calcium (8.5–10.5 mg/dL)";
 return {
 value: corr.toFixed(2) + " mg/dL — " + c,
 eq: "Corrected Calcium (mg/dL) = Measured Total Calcium + 0.8 × (4.0 − Serum Albumin [g/dL])\n\nPathophysiology & Physiological Significance: Accounts for protein-bound calcium fractions, revealing true physiological calcium status when serum albumin fluctuates."
 };
 }
 },
 {
 id: "feCaCalc",
 cat: "endo",
 type: "calc",
 subcat: "Calcium, Phosphate and Bone Metabolism",
 name: "Fractional Excretion of Calcium (FECa)",
 desc: "Differentiates Primary Hyperparathyroidism (PHPT) from Familial Hypocalciuric Hypercalcemia (FHH).",
 organ: "Parathyroid / Kidney",
 region: "Renal / Mineral Metabolism",
 subject: "Hypercalcemia Differential Diagnosis",
 keywords: ["feca", "fhh", "phpt", "hyperparathyroidism", "calcium clearance"],
 guidance: "1. Requires 24-hour urine calcium, urine creatinine, serum calcium, and serum creatinine.\n2. FECa <0.01 (<1%) points to FHH (inactivating CASR gene mutation; surgery non-beneficial).\n3. FECa >0.02 (>2%) favors Primary Hyperparathyroidism.",
 literature: [
 {
 type: "Clinical Guideline",
 icon: "📘",
 title: "Guidelines for the Management of Asymptomatic Primary Hyperparathyroidism",
 citation: "Bilezikian JP, Khan AA, Silverberg SJ, et al. J Clin Endocrinol Metab. 2022;107(10):2641-2650.",
 links: [{ text: "View Guidelines ↗", url: "https://pubmed.ncbi.nlm.nih.gov/36154327/" }]
 }
 ],
 fields: [
 makeN("uca", "24-h Urine Calcium (mg/dL)", 8.5, { min: 0.5, max: 80, step: 0.1 }),
 makeN("scr", "Serum Creatinine (mg/dL)", 1.0, { min: 0.2, max: 15, step: 0.05 }),
 makeN("sca", "Serum Total Calcium (mg/dL)", 10.8, { min: 7, max: 20, step: 0.1 }),
 makeN("ucr", "24-h Urine Creatinine (mg/dL)", 85, { min: 5, max: 500, step: 1 })
 ],
 table: {
 headers: ["FECa Ratio", "FECa (%)", "Favored Diagnosis", "Physiological Significance & Impact"],
 rows: [
 { id: "fhh", cols: ["< 0.01", "< 1.0%", "Familial Hypocalciuric Hypercalcemia (FHH)", "Renal calcium-sensing receptor mutation increases renal calcium reabsorption. Avoid unnecessary parathyroidectomy."] },
 { id: "gray", cols: ["0.01 – 0.02", "1.0 – 2.0%", "Indeterminate / Gray Zone", "Requires genetic CASR testing and family screening."] },
 { id: "phpt", cols: ["> 0.02", "> 2.0%", "Primary Hyperparathyroidism (PHPT)", "Autonomous parathyroid hormone hypersecretion increases renal calcium excretion. Parathyroidectomy indicated if surgical criteria met."] }
 ]
 },
 calc: function (v) {
 var feca = (+v.uca * +v.scr) / (+v.sca * +v.ucr);
 var match = "gray";
 var c = "";

 if (feca < 0.01) { match = "fhh"; c = "FECa <1%: Suggests FHH"; }
 else if (feca > 0.02) { match = "phpt"; c = "FECa >2%: Favors Primary Hyperparathyroidism"; }
 else { c = "Gray Zone (1–2%)"; }

 return {
 value: (feca * 100).toFixed(2) + "% (" + feca.toFixed(4) + ") — " + c,
 matchId: match,
 eq: "FECa = (Urine Ca × Serum Cr) ÷ (Serum Ca × Urine Cr)\n\nPathophysiology & Physiological Significance: Evaluates renal tubular handling of calcium relative to glomerular filtration."
 };
 }
 },
 {
 id: "tscoreClass",
 cat: "endo",
 type: "class",
 subcat: "Calcium, Phosphate and Bone Metabolism",
 name: "Osteoporosis WHO T-Score Diagnostic Criteria",
 desc: "Bone mineral density DXA diagnostic classification.",
 organ: "Bone / Skeleton",
 region: "Skeletal System",
 subject: "Metabolic Bone Disease",
 keywords: ["dxa", "t-score", "osteoporosis", "osteopenia", "bone density", "fracture"],
 guidance: "1. Applies to postmenopausal women and men aged ≥50 years.\n2. T-score compares BMD to young adult normal reference peak.\n3. Severe osteoporosis is defined as T-score ≤ −2.5 PLUS a low-trauma fragility fracture.",
 literature: [
 {
 type: "WHO Technical Report",
 icon: "📘",
 title: "Assessment of fracture risk and its application to screening for postmenopausal osteoporosis",
 citation: "World Health Organization. WHO Tech Rep Ser. 1994;843:1-129.",
 links: [{ text: "View WHO Report ↗", url: "https://pubmed.ncbi.nlm.nih.gov/7941614/" }]
 }
 ],
 fields: [
 makeN("tscore", "Lowest DXA T-Score (Spine / Femoral Neck / Total Hip)", -2.7, { min: -6.0, max: 3.0, step: 0.1 }),
 makeS("fx", "Prior adult low-trauma / fragility fracture?", "0", [
 ["0", "No"],
 ["1", "Yes"]
 ])
 ],
 table: {
 headers: ["DXA T-Score Threshold", "Fragility Fracture", "WHO Diagnostic Classification", "Physiological Significance"],
 rows: [
 { id: "normal", cols: ["T-score ≥ −1.0", "No", "Normal Bone Density", "Normal skeletal mass and mineralization."] },
 { id: "osteopenia", cols: ["−1.0 > T-score > −2.5", "No", "Osteopenia / Low Bone Mass", "Increased bone turnover and structural vulnerability."] },
 { id: "osteoporosis", cols: ["T-score ≤ −2.5", "No", "Osteoporosis", "Significantly degraded trabecular microarchitecture and high fracture risk."] },
 { id: "severe", cols: ["T-score ≤ −2.5", "Yes", "Severe (Established) Osteoporosis", "Compromised skeletal biomechanical competence with documented fragility fracture."] }
 ]
 },
 calc: function (v) {
 var t = +v.tscore;
 var fx = v.fx === "1";
 var match = "normal";
 var c = "";

 if (t <= -2.5 && fx) { match = "severe"; c = "Severe (Established) Osteoporosis"; }
 else if (t <= -2.5) { match = "osteoporosis"; c = "Osteoporosis"; }
 else if (t < -1.0) { match = "osteopenia"; c = "Osteopenia / Low Bone Mass"; }
 else { c = "Normal Bone Mineral Density"; }

 return {
 value: c + " (T-score: " + t.toFixed(1) + ")",
 matchId: match,
 eq: "WHO DXA Criteria: Evaluates standard deviations relative to healthy young adult mean.\n\nPathophysiology & Physiological Significance: Quantifies skeletal structural integrity and fracture vulnerability."
 };
 }
 },
 {
 id: "vitDConv",
 cat: "endo",
 type: "calc",
 subcat: "Calcium, Phosphate and Bone Metabolism",
 name: "Vitamin D Unit Conversion & Status",
 desc: "Converts 25-hydroxyvitamin D [25(OH)D] between ng/mL and nmol/L.",
 organ: "Bone / Systemic",
 region: "Nutritional Endocrinology",
 subject: "Vitamin D Status",
 keywords: ["vitamin d", "25-oh-d", "conversion", "ng/ml", "nmol/l", "rickets", "osteomalacia"],
 guidance: "1. Conversion factor: 1 ng/mL = 2.5 nmol/L.\n2. General sufficiency target: 20–30 ng/mL (50–75 nmol/L) per Endocrine Society / Institute of Medicine.",
 fields: [
 makeN("val", "25-hydroxyvitamin D Level", 22, { min: 1, max: 250 }),
 makeS("unit", "Entered Unit", "ng_ml", [
 ["ng_ml", "ng/mL (µg/L)"],
 ["nmol_l", "nmol/L"]
 ])
 ],
 calc: function (v) {
 var ng = v.unit === "ng_ml" ? +v.val : +v.val / 2.5;
 var nmol = v.unit === "ng_ml" ? +v.val * 2.5 : +v.val;
 var c = "";
 if (ng < 12) c = "Severe Deficiency (<12 ng/mL [<30 nmol/L])";
 else if (ng < 20) c = "Deficiency (12–19 ng/mL [30–49 nmol/L])";
 else if (ng < 30) c = "Insufficiency (20–29 ng/mL [50–74 nmol/L])";
 else c = "Sufficiency (30–100 ng/mL [75–250 nmol/L])";

 return {
 value: ng.toFixed(1) + " ng/mL (" + Math.round(nmol) + " nmol/L) — " + c,
 eq: "Conversion: 1 ng/mL = 2.5 nmol/L\n\nPathophysiology & Physiological Significance: Ensures adequate hormonal substrate for intestinal calcium and phosphate absorption and mineralization of bone osteoid."
 };
 }
 },
 {
 id: "fraxPlanned",
 cat: "endo",
 type: "calc",
 subcat: "Calcium, Phosphate and Bone Metabolism",
 name: "FRAX Fracture Risk Assessment Model",
 desc: "WHO 10-year probability tool for major osteoporotic and hip fractures.",
 organ: "Bone / Skeleton",
 region: "Skeletal Risk",
 subject: "Osteoporosis Fracture Risk",
 keywords: ["frax", "fracture risk", "osteoporosis", "hip fracture"],
 guidance: "Integrates clinical risk factors (age, sex, BMI, prior fracture, steroid use, smoking, alcohol, secondary osteoporosis) with optional DXA femoral neck BMD.",
 calc: function () {
 return {
 value: "FRAX Risk Tool Module Active",
 eq: "Integrates WHO country-specific epidemiological fracture rates.\n\nPathophysiology & Physiological Significance: Estimates 10-year fracture probability by combining clinical risk factors with bone density."
 };
 }
 },

 // ==========================================
 // F. OBESITY AND METABOLIC SYNDROME
 // ==========================================
 {
 id: "whrCalc",
 cat: "endo",
 type: "calc",
 subcat: "Obesity and Metabolic Syndrome",
 name: "Waist-to-Hip Ratio (WHR)",
 desc: "Evaluates central visceral adiposity and cardiovascular risk.",
 organ: "Adipose Tissue / Systemic",
 region: "Anthropometry",
 subject: "Visceral Adiposity",
 keywords: ["whr", "waist to hip", "visceral fat", "obesity", "metabolic risk"],
 guidance: "1. Measure waist circumference midway between lower rib margin and iliac crest.\n2. Measure hip circumference at widest diameter of buttocks.\n3. High risk: WHR >0.90 in men, >0.85 in women.",
 literature: [
 {
 type: "WHO Expert Consultation",
 icon: "📘",
 title: "Waist Circumference and Waist-Hip Ratio: Report of a WHO Expert Consultation",
 citation: "World Health Organization. Geneva: WHO Guidelines. 2008.",
 links: [{ text: "View WHO Report ↗", url: "https://www.who.int/publications/i/item/9789241598439" }]
 }
 ],
 fields: [
 makeN("waist", "Waist Circumference (cm)", 92, { min: 30, max: 250 }),
 makeN("hip", "Hip Circumference (cm)", 98, { min: 30, max: 250 }),
 makeS("sex", "Biological Sex", "male", [
 ["male", "Male"],
 ["female", "Female"]
 ])
 ],
 calc: function (v) {
 var ratio = +v.waist / +v.hip;
 var thresh = v.sex === "male" ? 0.90 : 0.85;
 var c = ratio >= thresh ? "Substantially Increased Cardiometabolic Risk (≥" + thresh + ")" : "Low/Moderate Risk (<" + thresh + ")";
 return {
 value: ratio.toFixed(2) + " — " + c,
 eq: "WHR = Waist (cm) ÷ Hip (cm)\n\nPathophysiology & Physiological Significance: Differentiates android (visceral) from gynoid (subcutaneous) fat distribution, identifying high visceral adipose tissue depots that secrete pro-inflammatory adipokines and drive insulin resistance."
 };
 }
 },
 {
 id: "whtrCalc",
 cat: "endo",
 type: "calc",
 subcat: "Obesity and Metabolic Syndrome",
 name: "Waist-to-Height Ratio (WHtR)",
 desc: "Height-adjusted central obesity screening metric ('Keep waist under half your height').",
 organ: "Adipose / Systemic",
 region: "Anthropometry",
 subject: "Cardiometabolic Risk Screening",
 keywords: ["whtr", "waist height ratio", "central obesity", "metabolic syndrome"],
 guidance: "1. Divide waist circumference by height (same units).\n2. Ratio ≥0.50 denotes increased cardiometabolic risk across sexes and ethnic groups.",
 fields: [
 makeN("waist", "Waist Circumference (cm)", 88, { min: 30, max: 250 }),
 makeN("height", "Height (cm)", 172, { min: 60, max: 250 })
 ],
 calc: function (v) {
 var ratio = +v.waist / +v.height;
 var c = ratio >= 0.60 ? "Very High Risk (≥0.60)" : ratio >= 0.50 ? "Increased Risk (0.50–0.59)" : "Healthy Ratio (<0.50)";
 return {
 value: ratio.toFixed(2) + " — " + c,
 eq: "WHtR = Waist (cm) ÷ Height (cm). Target ratio is <0.50.\n\nPathophysiology & Physiological Significance: Provides a universal height-adjusted threshold for central adiposity and cardiometabolic risk across diverse ethnic populations."
 };
 }
 },
 {
 id: "ibwAbwCalc",
 cat: "endo",
 type: "calc",
 subcat: "Obesity and Metabolic Syndrome",
 name: "Ideal & Adjusted Body Weight (Devine)",
 desc: "Calculates Ideal Body Weight (IBW) and Adjusted Body Weight (ABW) for clinical drug dosing in obesity.",
 organ: "Systemic",
 region: "Anthropometry / Dosing",
 subject: "Clinical Pharmacology in Obesity",
 keywords: ["ibw", "abw", "devine", "ideal body weight", "adjusted body weight", "dosing"],
 guidance: "1. Devine formula calculates IBW based on height and sex.\n2. ABW = IBW + 0.4 × (Actual Weight − IBW).\n3. Use ABW for dosing hydrophilic medications in obese individuals.",
 fields: [
 makeN("height", "Height (cm)", 175, { min: 140, max: 240 }),
 makeN("weight", "Actual Weight (kg)", 95, { min: 30, max: 300 }),
 makeS("sex", "Biological Sex", "male", [
 ["male", "Male"],
 ["female", "Female"]
 ])
 ],
 calc: function (v) {
 var htInches = +v.height / 2.54;
 var inchesOver5Ft = Math.max(0, htInches - 60);
 var ibw = v.sex === "male" ? 50 + 2.3 * inchesOver5Ft : 45.5 + 2.3 * inchesOver5Ft;
 var abw = ibw + 0.4 * (+v.weight - ibw);

 return {
 value: "IBW: " + ibw.toFixed(1) + " kg | ABW: " + abw.toFixed(1) + " kg",
 eq: "Devine IBW Formula & ABW = IBW + 0.4 × (Actual Weight − IBW).\n\nPathophysiology & Physiological Significance: Corrects for altered pharmacokinetic volume of distribution of hydrophilic drugs in adipose tissue."
 };
 }
 },
 {
 id: "weightLossPct",
 cat: "endo",
 type: "calc",
 subcat: "Obesity and Metabolic Syndrome",
 name: "Weight Loss Percentage Calculator",
 desc: "Monitors total percentage body weight reduction during obesity treatment.",
 organ: "Adipose / Systemic",
 region: "Therapeutic Surveillance",
 subject: "Obesity Pharmacotherapy & Surgery",
 keywords: ["weight loss %", "percentage loss", "bariatric", "semaglutide", "tirzepatide"],
 guidance: "1. Enter baseline weight and current weight.\n2. A 5–10% loss yields meaningful improvement in glycemic control, BP, and lipids; ≥15% can induce diabetes remission.",
 fields: [
 makeN("init_wt", "Initial / Baseline Weight (kg)", 105, { min: 30, max: 350 }),
 makeN("curr_wt", "Current Weight (kg)", 94, { min: 25, max: 350 })
 ],
 calc: function (v) {
 var lost = +v.init_wt - +v.curr_wt;
 var pct = (lost / +v.init_wt) * 100;
 var c = pct >= 15 ? "Exceptional Loss (≥15%; Disease-modifying)" : pct >= 10 ? "Substantial Loss (10–14.9%)" : pct >= 5 ? "Clinically Meaningful Loss (5–9.9%)" : "Minimal Loss (<5%)";

 return {
 value: pct.toFixed(1) + "% (" + lost.toFixed(1) + " kg lost) — " + c,
 eq: "Weight Loss % = [ (Initial Weight − Current Weight) ÷ Initial Weight ] × 100%\n\nPathophysiology & Physiological Significance: Quantifies therapeutic success in reversing ectopic fat deposition, hepatic steatosis, and metabolic syndrome."
 };
 }
 },

 // ==========================================
 // G. DIABETES EMERGENCIES
 // ==========================================
 {
 id: "dkaHhsClassifier",
 cat: "endo",
 type: "class",
 subcat: "Diabetes Emergencies",
 name: "DKA & HHS Diagnostic Criteria & Staging",
 desc: "Differentiates Diabetic Ketoacidosis (DKA) severity levels from Hyperosmolar Hyperglycemic State (HHS).",
 organ: "Pancreas / Kidney / Brain",
 region: "Emergency / Critical Care",
 subject: "Hyperglycemic Crises",
 keywords: ["dka", "hhs", "ketoacidosis", "hyperosmolar", "bicarbonate", "ph", "anion gap"],
 guidance: "1. DKA requires triad of hyperglycemia, high anion gap metabolic acidosis, and ketonemia/ketonuria.\n2. HHS requires glucose >600 mg/dL, arterial pH >7.30, HCO3 >18 mEq/L, and effective osmolality >320 mOsm/kg.\n3. Guides fluid, insulin, and potassium replacement protocols.",
 literature: [
 {
 type: "ADA Consensus Statement",
 icon: "📘",
 title: "Hyperglycemic Crises in Adult Patients With Diabetes",
 citation: "Kitabchi AE, Umpierrez GE, Miles JM, Fisher JN. Diabetes Care. 2009;32(7):1335-1343.",
 links: [{ text: "View Statement ↗", url: "https://pubmed.ncbi.nlm.nih.gov/19564476/" }]
 }
 ],
 fields: [
 makeN("glu", "Blood Glucose (mg/dL)", 450, { min: 100, max: 2500 }),
 makeN("ph", "Arterial pH", 7.18, { min: 6.5, max: 7.6, step: 0.01 }),
 makeN("hco3", "Serum Bicarbonate (mEq/L)", 11, { min: 1, max: 45 }),
 makeS("ketones", "Serum / Urine Ketones", "pos", [
 ["pos", "Positive"],
 ["neg", "Negative"]
 ]),
 makeN("osmol", "Effective Osmolality (mOsm/kg)", 305, { min: 250, max: 450 }),
 makeS("sensorium", "Mental Status / Sensorium", "alert", [
 ["alert", "Alert"],
 ["drowsy", "Drowsy / Lethargic"],
 ["stupor", "Stupor / Coma"]
 ])
 ],
 table: {
 headers: ["Crisis Entity", "Arterial pH", "Serum HCO3", "Effective Osmolality", "Sensorium & Significance"],
 rows: [
 { id: "mild_dka", cols: ["Mild DKA", "7.25 – 7.30", "15 – 18 mEq/L", "Variable", "Alert; ketoacidosis requiring IV fluids and insulin."] },
 { id: "mod_dka", cols: ["Moderate DKA", "7.00 – 7.24", "10 – 14 mEq/L", "Variable", "Alert / Drowsy; significant acidemia."] },
 { id: "sev_dka", cols: ["Severe DKA", "< 7.00", "< 10 mEq/L", "Variable", "Stupor / Coma; profound acidemia and multi-organ risk."] },
 { id: "hhs", cols: ["HHS", "> 7.30", "> 18 mEq/L", "> 320 mOsm/kg", "Stupor / Coma; severe hyperosmolality driving cellular dehydration."] }
 ]
 },
 calc: function (v) {
 var g = +v.glu, ph = +v.ph, hco3 = +v.hco3, osm = +v.osmol;
 var match = "mild_dka";
 var res = "";

 if (g > 600 && ph > 7.30 && hco3 > 18 && osm > 320 && v.sensorium !== "alert") {
 res = "Hyperosmolar Hyperglycemic State (HHS)";
 match = "hhs";
 } else if (v.ketones === "pos") {
 if (ph < 7.00 || hco3 < 10 || v.sensorium === "stupor") {
 res = "Severe Diabetic Ketoacidosis (DKA)";
 match = "sev_dka";
 } else if (ph <= 7.24 || (hco3 >= 10 && hco3 <= 14)) {
 res = "Moderate Diabetic Ketoacidosis (DKA)";
 match = "mod_dka";
 } else if (ph <= 7.30 && hco3 >= 15) {
 res = "Mild Diabetic Ketoacidosis (DKA)";
 match = "mild_dka";
 } else {
 res = "Hyperglycemia with Ketosis (Borderline / Resolving DKA)";
 }
 } else {
 res = "Isolated Hyperglycemia without DKA or HHS criteria";
 }

 return {
 value: res,
 matchId: match,
 eq: "ADA Hyperglycemic Crisis Classification Criteria.\n\nPathophysiology & Physiological Significance: Differentiates absolute insulin deficiency ketotic acidemia from relative insulin deficiency hyperosmolar dehydration to guide emergency resuscitation."
 };
 }
 },
 {
 id: "effOsmolality",
 cat: "endo",
 type: "calc",
 subcat: "Diabetes Emergencies",
 name: "Effective & Total Serum Osmolality",
 desc: "Calculates hypertonicity (excluding urea) driving cellular dehydration in DKA/HHS.",
 organ: "Systemic / Kidney",
 region: "Fluid & Electrolytes",
 subject: "Osmolar Disorders",
 keywords: ["effective osmolality", "hypertonicity", "hhs", "dka", "hyperglycemia"],
 guidance: "1. Effective Osmolality = 2×Na + (Glucose ÷ 18).\n2. Excludes Blood Urea Nitrogen (BUN) because urea is a freely permeable membrane solute.\n3. Criterion for HHS is effective osmolality >320 mOsm/kg.",
 fields: [
 makeN("na", "Serum Sodium (mEq/L)", 134, { min: 100, max: 180 }),
 makeN("glu", "Serum Glucose (mg/dL)", 650, { min: 50, max: 2500 }),
 makeN("bun", "Blood Urea Nitrogen (mg/dL)", 38, { min: 2, max: 200 })
 ],
 calc: function (v) {
 var eff = (2 * +v.na) + (+v.glu / 18);
 var tot = eff + (+v.bun / 2.8);
 var c = eff > 320 ? "Meets HHS Diagnostic Threshold (>320 mOsm/kg)" : "Normal / Mildly elevated effective osmolality (≤320 mOsm/kg)";

 return {
 value: "Effective: " + Math.round(eff) + " mOsm/kg | Total: " + Math.round(tot) + " mOsm/kg (" + c + ")",
 eq: "Effective Osmolality = 2×Na + (Glucose ÷ 18)\n\nPathophysiology & Physiological Significance: Measures effective tonicity driving osmotic water shifts out of intracellular neuronal compartments."
 };
 }
 },

 // ==========================================
 // H. REPRODUCTIVE ENDOCRINOLOGY
 // ==========================================
 {
 id: "rotterdamPcos",
 cat: "endo",
 type: "class",
 subcat: "Reproductive Endocrinology",
 name: "Rotterdam Criteria for PCOS",
 desc: "International diagnostic consensus criteria for Polycystic Ovary Syndrome.",
 organ: "Ovary / Pituitary / Adipose",
 region: "Reproductive Pelvis",
 subject: "Polycystic Ovary Syndrome",
 keywords: ["rotterdam", "pcos", "anovulation", "hyperandrogenism", "polycystic ovaries", "amh"],
 guidance: "1. Diagnosis requires at least 2 out of 3 features once secondary causes (CAH, hyperprolactinemia, Cushing, thyroid disease) are excluded.\n2. Criteria: 1) Oligo/anovulation, 2) Clinical/biochemical hyperandrogenism, 3) Ultrasound PCO morphology (≥20 follicles per ovary or volume ≥10 mL) or elevated AMH.",
 literature: [
 {
 type: "Consensus Guideline",
 icon: "📘",
 title: "Recommendations from the 2023 International Evidence-based Guideline for the Assessment and Management of Polycystic Ovary Syndrome",
 citation: "Teede HJ, Tay CT, Laven JSE, et al. Hum Reprod. 2023;38(9):1655-1679.",
 links: [{ text: "View Guidelines ↗", url: "https://pubmed.ncbi.nlm.nih.gov/37540960/" }]
 }
 ],
 fields: [
 makeS("ovul", "1. Ovulatory Dysfunction (cycle >35 days or amenorrhea)", "1", [
 ["0", "No"],
 ["1", "Yes"]
 ]),
 makeS("androgen", "2. Hyperandrogenism (hirsutism, acne, elevated testosterone)", "1", [
 ["0", "No"],
 ["1", "Yes"]
 ]),
 makeS("us", "3. Polycystic Ovarian Morphology on US (or elevated serum AMH)", "1", [
 ["0", "No"],
 ["1", "Yes"]
 ]),
 makeS("exclude", "Exclusion of secondary etiologies (CAH, Prolactin, Thyroid, Cushing)", "1", [
 ["1", "Other etiologies excluded"],
 ["0", "Other etiologies NOT excluded"]
 ])
 ],
 table: {
 headers: ["Phenotype", "Ovulatory Dysfunction", "Hyperandrogenism", "PCO Morphology / AMH", "Physiological Significance"],
 rows: [
 { id: "phenoA", cols: ["Phenotype A", "Present", "Present", "Present", "Classic severe PCOS phenotype with high metabolic and reproductive risk."] },
 { id: "phenoB", cols: ["Phenotype B", "Present", "Present", "Absent", "Anovulatory hyperandrogenemic phenotype."] },
 { id: "phenoC", cols: ["Phenotype C", "Absent", "Present", "Present", "Ovulatory hyperandrogenemic phenotype."] },
 { id: "phenoD", cols: ["Phenotype D", "Present", "Absent", "Present", "Non-androgenic ovulatory dysfunction phenotype."] }
 ]
 },
 calc: function (v) {
 if (v.exclude === "0") {
 return { value: "Criteria Not Met", eq: "Exclusion of secondary etiologies is mandatory prior to establishing PCOS diagnosis." };
 }
 var count = +v.ovul + +v.androgen + +v.us;
 var isPcos = count >= 2;
 var match = "phenoA";

 if (count === 3) match = "phenoA";
 else if (v.ovul === "1" && v.androgen === "1") match = "phenoB";
 else if (v.androgen === "1" && v.us === "1") match = "phenoC";
 else if (v.ovul === "1" && v.us === "1") match = "phenoD";

 return {
 value: isPcos ? "POSITIVE for PCOS (Meets " + count + " of 3 Rotterdam Criteria)" : "Negative for PCOS (<2 criteria met)",
 matchId: match,
 eq: "Rotterdam 2003 / International 2023 Consensus Framework.\n\nPathophysiology & Physiological Significance: Captures multi-faceted endocrine, ovarian, and metabolic manifestations driven by hypothalamic-pituitary-ovarian dysregulation and hyperinsulinemia."
 };
 }
 },
 {
 id: "faiCalc",
 cat: "endo",
 type: "calc",
 subcat: "Reproductive Endocrinology",
 name: "Free Androgen Index (FAI)",
 desc: "Calculates surrogate index of biologically active circulating testosterone relative to SHBG.",
 organ: "Ovary / Adrenal / Liver",
 region: "Reproductive Endocrinology",
 subject: "Hyperandrogenemia Screening",
 keywords: ["fai", "free androgen index", "testosterone", "shbg", "hirsutism", "pcos"],
 guidance: "1. Total Testosterone (nmol/L) and SHBG (nmol/L) must be measured.\n2. FAI >4.5–5.0% indicates biochemical hyperandrogenemia in females.",
 fields: [
 makeN("testo", "Total Testosterone (nmol/L)", 2.8, { min: 0.1, max: 20, step: 0.1 }),
 makeN("shbg", "Sex Hormone-Binding Globulin (SHBG, nmol/L)", 32, { min: 2, max: 250, step: 1 })
 ],
 calc: function (v) {
 var fai = (+v.testo / +v.shbg) * 100;
 var c = fai > 5.0 ? "Elevated FAI (>5.0%; Biochemical Hyperandrogenemia)" : "Normal Female Reference Range (≤5.0%)";
 return {
 value: fai.toFixed(1) + "% — " + c,
 eq: "FAI (%) = (Total Testosterone [nmol/L] ÷ SHBG [nmol/L]) × 100\n\nPathophysiology & Physiological Significance: Accounts for hepatic SHBG suppression by hyperinsulinemia, revealing true bioavailable testosterone levels."
 };
 }
 },
 {
 id: "lhFshRatio",
 cat: "endo",
 type: "calc",
 subcat: "Reproductive Endocrinology",
 name: "LH / FSH Ratio Calculator",
 desc: "Calculates ratio of luteinizing hormone to follicle-stimulating hormone.",
 organ: "Pituitary / Ovary",
 region: "Reproductive Axis",
 subject: "Gonadotropin Pulsatility",
 keywords: ["lh fsh ratio", "lh", "fsh", "pcos", "gonadotropins"],
 guidance: "1. Obtain early follicular phase (Day 2–4) LH and FSH levels.\n2. Ratio >2.0–3.0 is characteristic of altered GnRH pulsatility in PCOS.",
 fields: [
 makeN("lh", "LH (IU/L)", 14.5, { min: 0.1, max: 100, step: 0.1 }),
 makeN("fsh", "FSH (IU/L)", 5.2, { min: 0.1, max: 100, step: 0.1 })
 ],
 calc: function (v) {
 var ratio = +v.lh / +v.fsh;
 var c = ratio > 2.0 ? "Elevated Ratio (>2.0; Suggestive of PCOS neuroendocrine alteration)" : "Normal LH/FSH Ratio (≤2.0)";
 return {
 value: ratio.toFixed(2) + " — " + c,
 eq: "Ratio = LH (IU/L) ÷ FSH (IU/L)\n\nPathophysiology & Physiological Significance: Reflects hypothalamic GnRH pulse frequency alterations that preferentially stimulate pituitary LH secretion over FSH."
 };
 }
 },
 {
 id: "ferrimanGallwey",
 cat: "endo",
 type: "class",
 subcat: "Reproductive Endocrinology",
 name: "Modified Ferriman–Gallwey (mFG) Hirsutism Score",
 desc: "Clinical visual evaluation of androgen-dependent terminal hair growth across 9 anatomical sites.",
 organ: "Skin / Hair Follicles",
 region: "Dermatologic / Systemic",
 subject: "Clinical Hyperandrogenism",
 keywords: ["ferriman gallwey", "hirsutism", "terminal hair", "pcos", "androgens"],
 guidance: "1. Visual assessment of 9 body regions scored 0 to 4 each.\n2. Ethnicity-specific cutoffs: ≥4 for East Asian, ≥8 for Caucasian/Black, ≥9–10 for Mediterranean/Middle Eastern.",
 literature: [
 {
 type: "Seminal Assessment Article",
 icon: "📄",
 title: "Clinical assessment of body hair growth in women",
 citation: "Ferriman D, Gallwey JD. J Clin Endocrinol Metab. 1961;21:1440-1447.",
 links: [{ text: "View Article ↗", url: "https://pubmed.ncbi.nlm.nih.gov/13892577/" }]
 }
 ],
 fields: [
 makeN("score", "Total Sum Score of 9 Body Regions (0 to 36)", 9, { min: 0, max: 36, step: 1 }),
 makeS("eth", "Ethnic / Population Background", "caucasian", [
 ["caucasian", "Caucasian / Black (Cutoff ≥8)"],
 ["mediterranean", "Mediterranean / Middle Eastern / South Asian (Cutoff ≥9)"],
 ["asian", "East Asian (Cutoff ≥4)"]
 ])
 ],
 calc: function (v) {
 var s = +v.score;
 var cut = 8;
 if (v.eth === "mediterranean") cut = 9;
 else if (v.eth === "asian") cut = 4;

 var isHirsute = s >= cut;
 return {
 value: s + " / 36 Points — " + (isHirsute ? "Hirsutism Present (Score ≥" + cut + ")" : "Normal Terminal Hair Distribution (<" + cut + ")"),
 matchId: match,
 eq: "mFG System: Evaluates androgen-sensitive dermal pilosebaceous units.\n\nPathophysiology & Physiological Significance: Quantifies end-organ cutaneous 5-alpha-reductase sensitivity and pilosebaceous unit response to circulating androgens."
 };
 }
 },

 // ==========================================
 // I. LIPID AND METABOLIC RISK
 // ==========================================
 {
 id: "lipidRatios",
 cat: "endo",
 type: "calc",
 subcat: "Lipid and Metabolic Risk",
 name: "Atherogenic Lipid Fractions & Ratios",
 desc: "Calculates Non-HDL Cholesterol, TG/HDL ratio, Total/HDL ratio, and Remnant Cholesterol.",
 organ: "Vascular System / Liver",
 region: "Cardiovascular Metabolism",
 subject: "Atherogenic Lipid Profiling",
 keywords: ["non-hdl", "lipid ratios", "tg/hdl", "remnant cholesterol", "atherosclerosis"],
 guidance: "1. Non-HDL-C = Total Cholesterol − HDL-C.\n2. TG/HDL Ratio >3.0 serves as a surrogate marker for small dense LDL particles and insulin resistance.",
 fields: [
 makeN("tc", "Total Cholesterol (mg/dL)", 220, { min: 50, max: 600 }),
 makeN("hdl", "HDL Cholesterol (mg/dL)", 42, { min: 10, max: 150 }),
 makeN("tg", "Triglycerides (mg/dL)", 210, { min: 20, max: 2000 }),
 makeN("ldl", "Direct or Friedewald LDL (mg/dL)", 136, { min: 10, max: 400 })
 ],
 calc: function (v) {
 var nonHdl = +v.tc - +v.hdl;
 var tgHdl = +v.tg / +v.hdl;
 var remnant = +v.tc - +v.hdl - +v.ldl;

 return {
 value: "Non-HDL: " + nonHdl + " mg/dL | TG/HDL: " + tgHdl.toFixed(1) + " | Remnant: " + Math.round(remnant) + " mg/dL",
 eq: "Non-HDL = Total Chol − HDL | TG/HDL Ratio: >3.0 indicates atherogenic small dense LDL phenotype.\n\nPathophysiology & Physiological Significance: Captures all atherogenic apolipoprotein B-containing particles and remnant lipoproteins driving atherogenesis beyond isolated LDL-C."
 };
 }
 },
 {
 id: "metsynCriteria",
 cat: "endo",
 type: "class",
 subcat: "Lipid and Metabolic Risk",
 name: "Metabolic Syndrome Diagnostic Criteria (NCEP ATP III)",
 desc: "Clinical diagnosis of Metabolic Syndrome based on presence of ≥3 of 5 cardiometabolic traits.",
 organ: "Systemic / Vascular",
 region: "Systemic Risk",
 subject: "Metabolic Syndrome Staging",
 keywords: ["metabolic syndrome", "ncep atp iii", "waist", "triglycerides", "hdl", "hypertension", "glucose"],
 guidance: "1. Diagnosis established when at least 3 of 5 components are present.\n2. Criteria: 1) Waist >102cm (men) / >88cm (women), 2) TG ≥150 mg/dL, 3) HDL <40 (men) / <50 (women), 4) BP ≥130/85 mmHg, 5) Fasting Glucose ≥100 mg/dL.",
 literature: [
 {
 type: "NCEP ATP III Panel Report",
 icon: "📘",
 title: "Third Report of the National Cholesterol Education Program (NCEP) Expert Panel on Detection, Evaluation, and Treatment of High Blood Cholesterol in Adults (Adult Treatment Panel III)",
 citation: "National Institutes of Health. Circulation. 2002;106(25):3143-3421.",
 links: [{ text: "View Circulation Report ↗", url: "https://pubmed.ncbi.nlm.nih.gov/12485966/" }]
 }
 ],
 fields: [
 makeS("waist", "Elevated Waist Circumference (>102 cm men, >88 cm women)", "1", [
 ["0", "No"],
 ["1", "Yes"]
 ]),
 makeS("tg", "Elevated Triglycerides (≥150 mg/dL or on drug treatment)", "1", [
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
 headers: ["Component Count", "Metabolic Syndrome Status", "Physiological Significance & Action"],
 rows: [
 { id: "positive", cols: ["3 – 5 Criteria Met", "POSITIVE for Metabolic Syndrome", "Clustering of insulin resistance, atherogenic dyslipidemia, and vascular stiffness. Aggressive lifestyle and cardiovascular risk reduction."] },
 { id: "negative", cols: ["0 – 2 Criteria Met", "Negative for Metabolic Syndrome", "Address individual isolated metabolic risk factors."] }
 ]
 },
 calc: function (v) {
 var total = +v.waist + +v.tg + +v.hdl + +v.bp + +v.glu;
 var isPos = total >= 3;
 var match = isPos ? "positive" : "negative";

 return {
 value: (isPos ? "POSITIVE for Metabolic Syndrome" : "Negative") + " (" + total + " / 5 Criteria Met)",
 matchId: match,
 eq: "NCEP ATP III Definition: Requires presence of ≥3 of 5 cardiometabolic risk domains.\n\nPathophysiology & Physiological Significance: Identifies systemic insulin resistance clustering that exponentially accelerates cardiovascular disease and type 2 diabetes risk."
 };
 }
 },

 // ==========================================
 // J. ENDOCRINE TUMORS AND SPECIALIZED ASSESSMENT
 // ==========================================
 {
 id: "pheoScreenRef",
 cat: "endo",
 type: "class",
 subcat: "Endocrine Tumors and Specialized Assessment",
 name: "Pheochromocytoma Biochemical Screening",
 desc: "Interprets plasma free or 24-hr urinary fractionated metanephrines.",
 organ: "Adrenal Medulla / Sympathetic Ganglia",
 region: "Retroperitoneal",
 subject: "Adrenal Tumors",
 keywords: ["pheochromocytoma", "paraganglioma", "metanephrines", "catecholamines", "adrenal incidentaloma"],
 guidance: "1. Plasma free metanephrines or 24-hr urinary metanephrines.\n2. Elevations >3–4× upper limit of normal (ULN) are highly diagnostic.",
 literature: [
 {
 type: "Endocrine Society Guideline",
 icon: "📘",
 title: "Pheochromocytoma and Paraganglioma: An Endocrine Society Clinical Practice Guideline",
 citation: "Lenders JW, Duh QY, Eisenhofer G, et al. J Clin Endocrinol Metab. 2014;99(6):1915-1942.",
 links: [{ text: "View Guideline ↗", url: "https://pubmed.ncbi.nlm.nih.gov/24893135/" }]
 }
 ],
 fields: [
 makeS("level", "Degree of Metanephrine Elevation", "mild", [
 ["norm", "Within normal reference limits"],
 ["mild", "Mild elevation (<2× Upper Limit of Normal)"],
 ["mod", "Moderate elevation (2–3× Upper Limit of Normal)"],
 ["high", "Marked elevation (≥3–4× Upper Limit of Normal)"]
 ])
 ],
 calc: function (v) {
 var res = "";
 if (v.level === "high") res = "Highly Suggestive of Pheochromocytoma / Paraganglioma (Proceed directly to CT/MRI imaging).";
 else if (v.level === "mod" || v.level === "mild") res = "Equivocal / Borderline Elevation (Rule out drug interference; consider clonidine suppression test).";
 else res = "Pheochromocytoma virtually excluded (>99% negative predictive value).";

 return {
 value: res,
 eq: "Biochemical testing must precede anatomical tumor localization (CT/MRI).\n\nPathophysiology & Physiological Significance: Detects autonomous intratumoral O-methylated catecholamine metabolite production by chromaffin tissue."
 };
 }
 },
 {
 id: "menChecklist",
 cat: "endo",
 type: "class",
 subcat: "Endocrine Tumors and Specialized Assessment",
 name: "Multiple Endocrine Neoplasia (MEN) Checklist",
 desc: "Clinical and genetic diagnostic features of MEN1, MEN2A, and MEN2B syndromes.",
 organ: "Parathyroid / Pituitary / Pancreas / Thyroid / Adrenal",
 region: "Multi-organ Endocrine",
 subject: "Hereditary Endocrine Neoplasia",
 keywords: ["men1", "men2a", "men2b", "wermer", "sipple", "medullary thyroid cancer", "pheochromocytoma"],
 guidance: "1. Select syndrome to review classic tumor triads and genetic loci.\n2. Clinical diagnosis requires ≥2 classic endocrine tumors or 1 tumor plus a first-degree relative with established diagnosis.",
 literature: [
 {
 type: "Clinical Guideline",
 icon: "📘",
 title: "Clinical Practice Guidelines for Multiple Endocrine Neoplasia Type 1 (MEN1)",
 citation: "Thakker RV, Newey PJ, Walls GV, et al. J Clin Endocrinol Metab. 2012;97(9):2990-3011.",
 links: [{ text: "View Guidelines ↗", url: "https://pubmed.ncbi.nlm.nih.gov/22723327/" }]
 }
 ],
 fields: [
 makeS("syndrome", "Select MEN Syndrome", "men1", [
 ["men1", "MEN1 (Wermer Syndrome)"],
 ["men2a", "MEN2A (Sipple Syndrome)"],
 ["men2b", "MEN2B"]
 ])
 ],
 table: {
 headers: ["Syndrome", "Primary Tumors / Features", "Gene Locus", "Physiological Significance"],
 rows: [
 { id: "men1", cols: ["MEN1", "Parathyroid Adenomas (>95%), Pancreatic NETs (40-70%), Pituitary Adenomas (30-40%)", "MEN1 (Menin)", "Tumor suppressor gene mutations driving multi-gland endocrine hyperplasia and neoplasia."] },
 { id: "men2a", cols: ["MEN2A", "Medullary Thyroid Carcinoma (>95%), Pheochromocytoma (50%), Primary Hyperparathyroidism (20-30%)", "RET Proto-oncogene", "Activating point mutations in RET receptor tyrosine kinase."] },
 { id: "men2b", cols: ["MEN2B", "Medullary Thyroid Carcinoma (Aggressive), Pheochromocytoma (50%), Mucosal Neuromas, Marfanoid Habitus", "RET (M918T mutation)", "Highly aggressive RET mutation mandating early prophylactic thyroidectomy in infancy."] }
 ]
 },
 calc: function (v) {
 var txt = "", match = "men1";
 if (v.syndrome === "men1") {
 txt = "MEN1 (3 Ps): Parathyroid (>95%), Pancreatic NETs (gastrinoma/insulinoma: 40–70%), Pituitary adenomas (30–40%). Gene: MEN1.";
 match = "men1";
 } else if (v.syndrome === "men2a") {
 txt = "MEN2A: Medullary Thyroid Carcinoma (>95%), Pheochromocytoma (50%), Primary Hyperparathyroidism (20–30%). Gene: RET.";
 match = "men2a";
 } else {
 txt = "MEN2B: Aggressive Medullary Thyroid Carcinoma, Pheochromocytoma (50%), Mucosal neuromas, Marfanoid habitus. Gene: RET (M918T).";
 match = "men2b";
 }

 return {
 value: txt,
 matchId: match,
 eq: "Genetic testing and family screening indicated upon clinical diagnosis of index case.\n\nPathophysiology & Physiological Significance: Unmasks hereditary oncogenic mutations affecting neuroendocrine cell lineages."
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
 window.SYNONYM_MAP["endo"] = ["endo", "endocrinology", "diabetes", "thyroid", "adrenal", "insulin", "hba1c", "glucose", "tsh", "calcium", "metabolism", "pcos", "cushing", "addison"];
 window.SYNONYM_MAP["diabetes"] = ["diabetes", "hba1c", "eag", "homa", "insulin", "dka", "hhs", "hypoglycemia"];
 window.SYNONYM_MAP["thyroid"] = ["thyroid", "tsh", "ft4", "thyroid storm", "myxedema", "ti-rads", "goiter", "levothyroxine"];
 }

 if (typeof window.renderHome === "function") {
 window.renderHome();
 }
 } catch (err) {
 console.error("Critical error registering Endocrinology tools:", err);
 }
})();
