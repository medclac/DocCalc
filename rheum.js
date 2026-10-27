/**
 * MedCalc Module: Rheumatology & Clinical Immunology (RHEUM)
 * Fully compatible with the MedCalc HTML application structure and ortho.js architecture.
 * Combines all calculators from rheum.js and rheum_extra.js into a unified, high-yield module.
 */
(function () {
 "use strict";

 // Global field constructors matching ortho.js architecture
 var makeN = (typeof window !== "undefined" && window.N) ? window.N : function (id, label, defaultVal, extra) {
 extra = extra || {};
 return Object.assign({ id: id, label: label, type: "number", value: defaultVal, default: defaultVal }, extra);
 };
 var makeS = (typeof window !== "undefined" && window.S) ? window.S : function (id, label, defaultVal, options) {
 options = options || [];
 return { id: id, label: label, type: "select", value: defaultVal, default: defaultVal, options: options };
 };
 var makeYN = function (id, label, defaultVal) {
 defaultVal = defaultVal !== undefined ? defaultVal : "0";
 return makeS(id, label, defaultVal, [["0", "No"], ["1", "Yes"]]);
 };

 var clamp = function (x, min, max) {
 return Math.max(min, Math.min(max, x));
 };

 var rheumCategory = {
 id: "rheum",
 name: "Rheumatology & Immunology",
 icon: "🦴",
 desc: "Rheumatoid arthritis disease activity, SLE classification & damage, systemic vasculitis, spondyloarthritis, and crystal arthropathies",
 organs: ["joint", "synovium", "spine", "muscle", "skin", "vasculature", "kidney"],
 region: "musculoskeletal / autoimmune / systemic"
 };

 var rheumTools = [
 // ==============================================================
 // 1. DAS28-ESR
 // ==============================================================
 {
 id: "das28_esr",
 cat: "rheum",
 type: "calc",
 name: "DAS28-ESR (Disease Activity Score 28 with ESR)",
 desc: "Standard composite measure of rheumatoid arthritis disease activity using 28 tender/swollen joint counts and ESR.",
 organ: "Peripheral Synovial Joints",
 region: "Systemic Inflammatory Arthropathy",
 subject: "Rheumatoid Arthritis / Disease Monitoring",
 keywords: ["das28", "esr", "rheumatoid arthritis", "ra", "synovitis", "disease activity", "eular"],
 guidance: "1. Evaluate 28 joints: shoulders, elbows, wrists, MCPs (1–5), PIPs (1–5), and knees bilaterally.\n2. Enter ESR in mm/hr and Patient Global Health on a 100 mm Visual Analogue Scale (0 = best, 100 = worst).\n3. DAS28-ESR < 2.6 indicates Clinical Remission; ≤ 3.2 Low Disease Activity; 3.2 to 5.1 Moderate Activity; > 5.1 High Disease Activity.\n4. Directs treat-to-target escalation of DMARDs or biologic agents.",
 contraindications: "Does not count feet/ankles or hips; may underestimate systemic disease in patients with prominent hindfoot/forefoot synovitis.",
 literature: [
 {
 type: "Seminal Derivation",
 icon: "📄",
 title: "Development of a disease activity score based on 28 joint counts",
 citation: "Prevoo ML, van 't Hof MA, Kuper HH, et al. Arthritis Rheum. 1995;38(1):44-48.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/7818570/" }]
 }
 ],
 fields: [
 makeN("tjc", "Tender Joint Count (0–28)", 2, { min: 0, max: 28, step: 1 }),
 makeN("sjc", "Swollen Joint Count (0–28)", 1, { min: 0, max: 28, step: 1 }),
 makeN("esr", "Erythrocyte Sedimentation Rate (ESR, mm/hr)", 25, { min: 1, max: 200, step: 1 }),
 makeN("gh", "Patient Global Health VAS (0–100 mm)", 30, { min: 0, max: 100, step: 1 })
 ],
 table: {
 headers: ["DAS28-ESR Score", "Disease Activity State", "Therapeutic Target", "Recommended Strategy"],
 rows: [
 { id: "remission", cols: ["< 2.6", "Remission", "Primary Treat-to-Target Goal", "Maintain current DMARD regimen; consider tapering if sustained >6 months"] },
 { id: "low", cols: ["2.6 – 3.2", "Low Disease Activity (LDA)", "Acceptable Alternative Target", "Continue current therapy; closely monitor every 3–6 months"] },
 { id: "moderate", cols: ["3.3 – 5.1", "Moderate Disease Activity", "Target Not Achieved", "Adjust/intensify synthetic DMARDs or consider initiating biologic/targeted synthetic DMARD"] },
 { id: "high", cols: ["> 5.1", "High Disease Activity", "Active Severe Synovitis", "Urgent escalation: switch or add bDMARD/tsDMARD; consider bridging corticosteroids"] }
 ]
 },
 calc: function (v) {
 var tjc = clamp(+v.tjc, 0, 28);
 var sjc = clamp(+v.sjc, 0, 28);
 var esr = Math.max(+v.esr, 1);
 var gh = clamp(+v.gh, 0, 100);

 var score = 0.56 * Math.sqrt(tjc) + 0.28 * Math.sqrt(sjc) + 0.70 * Math.log(esr) + 0.014 * gh;
 var rounded = score.toFixed(2);

 var match = score < 2.6 ? "remission" : score <= 3.2 ? "low" : score <= 5.1 ? "moderate" : "high";
 var label = score < 2.6 ? "Remission (<2.6)" : score <= 3.2 ? "Low Activity (2.6–3.2)" : score <= 5.1 ? "Moderate Activity (3.3–5.1)" : "High Disease Activity (>5.1)";

 return {
 value: "DAS28-ESR: " + rounded + " (" + label + ")",
 matchId: match,
 eq: "Formula: 0.56 × √(TJC) + 0.28 × √(SJC) + 0.70 × ln(ESR) + 0.014 × PatientGlobal.\nTarget is sustained remission (<2.6) or low disease activity (≤3.2)."
 };
 }
 },

 // ==============================================================
 // 2. DAS28-CRP
 // ==============================================================
 {
 id: "das28_crp",
 cat: "rheum",
 type: "calc",
 name: "DAS28-CRP (Disease Activity Score 28 with CRP)",
 desc: "Composite measure of rheumatoid arthritis activity utilizing C-reactive protein (mg/L).",
 organ: "Peripheral Synovial Joints",
 region: "Systemic Inflammatory Arthropathy",
 subject: "Rheumatoid Arthritis / Rapid Response",
 keywords: ["das28", "crp", "rheumatoid arthritis", "synovitis", "acute phase", "treat to target"],
 guidance: "1. Uses serum CRP in mg/L instead of ESR, offering faster reflection of inflammatory fluctuations.\n2. Validated cutoffs: < 2.6 Remission, ≤ 2.9 Low Activity, 3.0 to 4.5 Moderate Activity, > 4.5 High Activity.\n3. Note: DAS28-CRP scores generally run lower than DAS28-ESR scores in the same patient.",
 contraindications: "Ensure CRP is entered in mg/L (if entered in mg/dL, multiply by 10).",
 literature: [
 {
 type: "Validation Study",
 icon: "📄",
 title: "Comparison of DAS28-ESR and DAS28-CRP in rheumatoid arthritis",
 citation: "Inoue E, Yamanaka H, Hara M, et al. Ann Rheum Dis. 2007;66(3):407-409.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/17028114/" }]
 }
 ],
 fields: [
 makeN("tjc", "Tender Joint Count (0–28)", 2, { min: 0, max: 28, step: 1 }),
 makeN("sjc", "Swollen Joint Count (0–28)", 1, { min: 0, max: 28, step: 1 }),
 makeN("crp", "C-Reactive Protein (CRP, mg/L)", 8, { min: 0, max: 500, step: 0.5 }),
 makeN("gh", "Patient Global Health VAS (0–100 mm)", 30, { min: 0, max: 100, step: 1 })
 ],
 table: {
 headers: ["DAS28-CRP Score", "Activity Level", "Threshold Guidance"],
 rows: [
 { id: "crpRem", cols: ["< 2.6", "Remission", "Target reached; monitor every 3–6 months"] },
 { id: "crpLow", cols: ["2.6 – 2.9", "Low Disease Activity", "Acceptable disease control"] },
 { id: "crpMod", cols: ["3.0 – 4.5", "Moderate Activity", "Suboptimal control; consider escalating therapy"] },
 { id: "crpHigh", cols: ["> 4.5", "High Disease Activity", "Active disease requiring aggressive therapy modification"] }
 ]
 },
 calc: function (v) {
 var tjc = clamp(+v.tjc, 0, 28);
 var sjc = clamp(+v.sjc, 0, 28);
 var crp = Math.max(+v.crp, 0);
 var gh = clamp(+v.gh, 0, 100);

 var score = 0.56 * Math.sqrt(tjc) + 0.28 * Math.sqrt(sjc) + 0.36 * Math.log(crp + 1) + 0.014 * gh + 0.96;
 var rounded = score.toFixed(2);

 var match = score < 2.6 ? "crpRem" : score <= 2.9 ? "crpLow" : score <= 4.5 ? "crpMod" : "crpHigh";
 var label = score < 2.6 ? "Remission (<2.6)" : score <= 2.9 ? "Low Activity (2.6–2.9)" : score <= 4.5 ? "Moderate Activity (3.0–4.5)" : "High Disease Activity (>4.5)";

 return {
 value: "DAS28-CRP: " + rounded + " (" + label + ")",
 matchId: match,
 eq: "Formula: 0.56 × √(TJC) + 0.28 × √(SJC) + 0.36 × ln(CRP+1) + 0.014 × PatientGlobal + 0.96."
 };
 }
 },

 // ==============================================================
 // 3. CDAI (CLINICAL DISEASE ACTIVITY INDEX)
 // ==============================================================
 {
 id: "cdai",
 cat: "rheum",
 type: "calc",
 name: "CDAI (Clinical Disease Activity Index)",
 desc: "Point-of-care disease activity tool for rheumatoid arthritis requiring no laboratory acute-phase reactants.",
 organ: "Peripheral Synovial Joints",
 region: "Clinic-Based Rheumatology",
 subject: "Rheumatoid Arthritis / Rapid Point of Care",
 keywords: ["cdai", "rheumatoid", "ra", "joint count", "lab free", "treat to target"],
 guidance: "1. Formula: TJC28 + SJC28 + Patient Global Assessment (0–10) + Physician Global Assessment (0–10).\n2. Remission: CDAI ≤ 2.8.\n3. Low Disease Activity: 2.9 to 10.0.\n4. Moderate Disease Activity: 10.1 to 22.0.\n5. High Disease Activity: > 22.0.\n6. Enables immediate treatment decisions during office visits without waiting for blood test results.",
 contraindications: "Does not incorporate lower extremity joints beyond the knees (e.g., MTP joints).",
 literature: [
 {
 type: "Seminal Derivation",
 icon: "📄",
 title: "The Clinical Disease Activity Index (CDAI) revisited",
 citation: "Aletaha D, Smolen J. Clin Exp Rheumatol. 2005;23(5 Suppl 39):S100-S108.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/16273793/" }]
 }
 ],
 fields: [
 makeN("tjc", "Tender Joint Count (0–28)", 1, { min: 0, max: 28, step: 1 }),
 makeN("sjc", "Swollen Joint Count (0–28)", 1, { min: 0, max: 28, step: 1 }),
 makeN("patient_global", "Patient Global Assessment (0–10 scale)", 2, { min: 0, max: 10, step: 0.5 }),
 makeN("doctor_global", "Physician Global Assessment (0–10 scale)", 2, { min: 0, max: 10, step: 0.5 })
 ],
 table: {
 headers: ["CDAI Score", "Disease Activity Category", "Clinical Decision Threshold"],
 rows: [
 { id: "cdaiRem", cols: ["≤ 2.8", "Remission", "Primary treat-to-target goal achieved"] },
 { id: "cdaiLow", cols: ["2.9 – 10.0", "Low Disease Activity", "Acceptable disease control; continue current strategy"] },
 { id: "cdaiMod", cols: ["10.1 – 22.0", "Moderate Disease Activity", "Therapy adjustment warranted"] },
 { id: "cdaiHigh", cols: ["> 22.0", "High Disease Activity", "Escalate therapy (add/switch bDMARD or tsDMARD)"] }
 ]
 },
 calc: function (v) {
 var score = clamp(+v.tjc, 0, 28) + clamp(+v.sjc, 0, 28) + clamp(+v.patient_global, 0, 10) + clamp(+v.doctor_global, 0, 10);
 var match = score <= 2.8 ? "cdaiRem" : score <= 10.0 ? "cdaiLow" : score <= 22.0 ? "cdaiMod" : "cdaiHigh";
 var label = score <= 2.8 ? "Remission (≤2.8)" : score <= 10.0 ? "Low Activity (2.9–10.0)" : score <= 22.0 ? "Moderate Activity (10.1–22.0)" : "High Disease Activity (>22.0)";

 return {
 value: "CDAI: " + score.toFixed(1) + " (" + label + ")",
 matchId: match,
 eq: "CDAI = TJC28 + SJC28 + Patient Global (0-10) + Physician Global (0-10).\nImmediate bedside assessment without laboratory delay."
 };
 }
 },

 // ==============================================================
 // 4. SDAI (SIMPLIFIED DISEASE ACTIVITY INDEX)
 // ==============================================================
 {
 id: "sdai",
 cat: "rheum",
 type: "calc",
 name: "SDAI (Simplified Disease Activity Index)",
 desc: "Validated linear composite score for rheumatoid arthritis combining clinical counts and serum CRP (mg/dL).",
 organ: "Peripheral Synovial Joints",
 region: "Systemic Inflammatory Arthropathy",
 subject: "Rheumatoid Arthritis / ACR-EULAR Remission",
 keywords: ["sdai", "rheumatoid arthritis", "crp", "remission", "eular", "acr"],
 guidance: "1. Formula: TJC28 + SJC28 + Patient Global (0–10) + Physician Global (0–10) + CRP (mg/dL).\n2. SDAI ≤ 3.3 defines stringent ACR/EULAR Boolean-equivalent Remission.\n3. SDAI ≤ 11.0 Low Activity; 11.1 to 26.0 Moderate Activity; > 26.0 High Activity.\n4. CAUTION: CRP must be entered in mg/dL (1.0 mg/dL = 10 mg/L).",
 contraindications: "Entering CRP in mg/L instead of mg/dL will produce invalid falsely elevated scores.",
 literature: [
 {
 type: "Seminal Derivation",
 icon: "📄",
 title: "A simple index of disease activity for rheumatoid arthritis (SDAI)",
 citation: "Smolen JS, Breedveld FC, Schiff MH, et al. Rheumatology (Oxford). 2003;42(2):244-257.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/12595618/" }]
 }
 ],
 fields: [
 makeN("tjc", "Tender Joint Count (0–28)", 1, { min: 0, max: 28, step: 1 }),
 makeN("sjc", "Swollen Joint Count (0–28)", 1, { min: 0, max: 28, step: 1 }),
 makeN("patient_global", "Patient Global Assessment (0–10 scale)", 1.5, { min: 0, max: 10, step: 0.5 }),
 makeN("doctor_global", "Physician Global Assessment (0–10 scale)", 1.5, { min: 0, max: 10, step: 0.5 }),
 makeN("crp", "C-Reactive Protein (CRP, mg/dL)", 0.6, { min: 0, max: 50, step: 0.1 })
 ],
 table: {
 headers: ["SDAI Score", "Activity Category", "ACR/EULAR Classification", "Action"],
 rows: [
 { id: "sdaiRem", cols: ["≤ 3.3", "Stringent Remission", "ACR/EULAR Boolean-equivalent Remission", "Goal achieved; maintain therapy"] },
 { id: "sdaiLow", cols: ["3.4 – 11.0", "Low Disease Activity", "Favorable control", "Monitor regularly"] },
 { id: "sdaiMod", cols: ["11.1 – 26.0", "Moderate Activity", "Active synovitis persists", "Intensify DMARD regimen"] },
 { id: "sdaiHigh", cols: ["> 26.0", "High Disease Activity", "Severe active inflammatory disease", "Prompt treatment escalation stat"] }
 ]
 },
 calc: function (v) {
 var score = clamp(+v.tjc, 0, 28) + clamp(+v.sjc, 0, 28) + clamp(+v.patient_global, 0, 10) + clamp(+v.doctor_global, 0, 10) + Math.max(+v.crp, 0);
 var match = score <= 3.3 ? "sdaiRem" : score <= 11.0 ? "sdaiLow" : score <= 26.0 ? "sdaiMod" : "sdaiHigh";
 var label = score <= 3.3 ? "Stringent Remission (≤3.3)" : score <= 11.0 ? "Low Activity (3.4–11.0)" : score <= 26.0 ? "Moderate Activity (11.1–26.0)" : "High Disease Activity (>26.0)";

 return {
 value: "SDAI: " + score.toFixed(2) + " (" + label + ")",
 matchId: match,
 eq: "SDAI = TJC28 + SJC28 + Patient Global (0-10) + Physician Global (0-10) + CRP (mg/dL).\nSDAI ≤ 3.3 corresponds to ACR/EULAR remission."
 };
 }
 },

 // ==============================================================
 // 5. 2010 ACR/EULAR RHEUMATOID ARTHRITIS CLASSIFICATION
 // ==============================================================
 {
 id: "ra_criteria",
 cat: "rheum",
 type: "class",
 name: "2010 ACR/EULAR Rheumatoid Arthritis Classification",
 desc: "Standardized point-based criteria identifying patients with newly presenting inflammatory arthritis.",
 organ: "Synovial Joints",
 region: "Diagnostic Rheumatology",
 subject: "Rheumatoid Arthritis / Diagnostic Classification",
 keywords: ["acr", "eular", "rheumatoid arthritis", "classification", "rf", "anti-ccp", "acpa"],
 guidance: "1. Mandatory Entry Criterion: At least 1 joint with definite clinical synovitis not better explained by another disease.\n2. Joint Distribution (0–5 pts), Serology RF/ACPA (0–3 pts), Duration ≥6 weeks (0–1 pt), Acute-phase reactants (0–1 pt).\n3. Score ≥ 6 / 10 classifies Definite Rheumatoid Arthritis.",
 contraindications: "Do not apply if synovitis is better explained by SLE, psoriatic arthritis, gout, or osteoarthritis.",
 literature: [
 {
 type: "Official Consensus Classification",
 icon: "📘",
 title: "2010 Rheumatoid arthritis classification criteria: an American College of Rheumatology/European League Against Rheumatism collaborative initiative",
 citation: "Aletaha D, Neogi T, Silman AJ, et al. Arthritis Rheum. 2010;62(9):2569-2581.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/20872595/" }]
 }
 ],
 fields: [
 makeYN("entry_met", "Mandatory Entry: ≥1 joint with definite clinical synovitis?", "1"),
 makeYN("better_explanation", "Is the synovitis better explained by an alternative disease?", "0"),
 makeS("joints", "Joint Involvement Pattern", "2", [
 ["0", "1 large joint (shoulders, elbows, hips, knees, ankles) (0 pts)"],
 ["1", "2–10 large joints (1 pt)"],
 ["2", "1–3 small joints (with or without large joint involvement) (2 pts)"],
 ["3", "4–10 small joints (with or without large joint involvement) (3 pts)"],
 ["5", ">10 joints (at least 1 small joint) (5 pts)"]
 ]),
 makeS("serology", "Serology (Rheumatoid Factor or ACPA / anti-CCP)", "2", [
 ["0", "Negative RF and Negative ACPA (0 pts)"],
 ["2", "Low-positive RF or Low-positive ACPA (≤3× upper limit of normal) (2 pts)"],
 ["3", "High-positive RF or High-positive ACPA (>3× upper limit of normal) (3 pts)"]
 ]),
 makeS("duration", "Symptom Duration", "1", [
 ["0", "< 6 weeks (0 pts)"],
 ["1", "≥ 6 weeks (1 pt)"]
 ]),
 makeS("acute_phase", "Acute-Phase Reactants (ESR or CRP)", "1", [
 ["0", "Normal CRP and Normal ESR (0 pts)"],
 ["1", "Abnormal CRP or Abnormal ESR (1 pt)"]
 ])
 ],
 table: {
 headers: ["Score Status", "Numerical Threshold", "Classification Verdict", "Management"],
 rows: [
 { id: "raClassified", cols: ["≥ 6 / 10", "Threshold Met", "CLASSIFIED AS RHEUMATOID ARTHRITIS", "Initiate conventional synthetic DMARD (Methotrexate) immediately"] },
 { id: "raNotClassified", cols: ["< 6 / 10", "Threshold Not Met", "Does not fulfill formal RA classification", "Close monitoring; reassess over time as symptoms evolve"] },
 { id: "raIneligible", cols: ["Entry Failed", "Ineligible", "Criteria cannot be applied", "Exclude mimics (Psoriatic arthritis, Gout, Viral polyarthritis)"] }
 ]
 },
 calc: function (v) {
 if (v.entry_met !== "1" || v.better_explanation === "1") {
 return {
 value: "Ineligible for RA Classification",
 matchId: "raIneligible",
 eq: "Criteria require ≥1 joint with definite clinical synovitis not explained by an alternative diagnosis."
 };
 }

 var score = +v.joints + +v.serology + +v.duration + +v.acute_phase;
 var classified = score >= 6;
 var match = classified ? "raClassified" : "raNotClassified";
 var verdict = classified
 ? "Meets 2010 ACR/EULAR Classification for Definite Rheumatoid Arthritis (Score ≥ 6/10)."
 : "Below numerical classification threshold (< 6/10). Re-evaluate periodically.";

 return {
 value: score + " / 10 Points (" + (classified ? "RA Classified" : "Not Classified") + ")",
 matchId: match,
 eq: verdict
 };
 }
 },

 // ==============================================================
 // 6. 2019 EULAR/ACR SYSTEMIC LUPUS ERYTHEMATOSUS (SLE)
 // ==============================================================
 {
 id: "sle_criteria",
 cat: "rheum",
 type: "class",
 name: "2019 EULAR/ACR SLE Classification Criteria",
 desc: "Weighted classification criteria for systemic lupus erythematosus with ANA entry requirement.",
 organ: "Multisystem / Autoimmune",
 region: "Systemic Autoimmunity",
 subject: "Systemic Lupus Erythematosus / Classification",
 keywords: ["sle", "lupus", "eular", "acr", "ana", "dsdna", "complement", "nephritis"],
 guidance: "1. Mandatory Entry Criterion: Positive ANA titer ≥ 1:80 on HEp-2 cells at least once.\n2. Criteria grouped into 7 clinical and 3 immunological domains.\n3. Within each domain, ONLY THE HIGHEST WEIGHTED CRITERION COUNTS.\n4. Total Score ≥ 10 points (with at least 1 clinical domain) classifies Systemic Lupus Erythematosus.",
 contraindications: "Do not count a criterion if an alternative etiology (e.g., infection, drug reaction) is more likely.",
 literature: [
 {
 type: "Official Consensus Classification",
 icon: "📘",
 title: "2019 European League Against Rheumatism/American College of Rheumatology classification criteria for systemic lupus erythematosus",
 citation: "Aringer M, Costenbader K, Daikh D, et al. Arthritis Rheumatol. 2019;71(9):1400-1412.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/31385448/" }]
 }
 ],
 fields: [
 makeYN("ana", "Mandatory Entry: ANA positive at least once at titer ≥ 1:80?", "1"),
 makeS("fever", "Constitutional: Unexplained fever (>38.3°C)", "0", [["0", "None (0)"], ["2", "Fever present (+2)"]]),
 makeS("heme", "Hematologic Domain (highest only)", "0", [
 ["0", "None (0)"],
 ["3", "Leukopenia (<4,000/µL) (+3)"],
 ["4", "Thrombocytopenia (<100,000/µL) (+4)"],
 ["4b", "Autoimmune hemolytic anemia (+4)"]
 ]),
 makeS("neuro", "Neuropsychiatric Domain (highest only)", "0", [
 ["0", "None (0)"],
 ["2", "Delirium (+2)"],
 ["3", "Psychosis (+3)"],
 ["5", "Seizures (+5)"]
 ]),
 makeS("skin", "Mucocutaneous Domain (highest only)", "0", [
 ["0", "None (0)"],
 ["2", "Non-scarring alopecia (+2)"],
 ["2b", "Oral ulcers (+2)"],
 ["4", "Subacute cutaneous or discoid lupus (+4)"],
 ["6", "Acute cutaneous lupus (malar rash) (+6)"]
 ]),
 makeS("serosa", "Serosal Domain (highest only)", "0", [
 ["0", "None (0)"],
 ["3", "Pleural or pericardial effusion (+3)"],
 ["5", "Acute pericarditis (+5)"]
 ]),
 makeS("joint", "Musculoskeletal: Synovitis ≥2 joints or tenderness with morning stiffness", "0", [["0", "None (0)"], ["6", "Joint involvement present (+6)"]]),
 makeS("renal", "Renal Domain (highest only)", "0", [
 ["0", "None (0)"],
 ["4", "Proteinuria >0.5 g/24h (+4)"],
 ["8", "Renal biopsy Class II or V lupus nephritis (+8)"],
 ["10", "Renal biopsy Class III or IV lupus nephritis (+10)"]
 ]),
 makeS("antiphos", "Antiphospholipid Antibodies (aCL, anti-β2GP1, or Lupus Anticoagulant)", "0", [["0", "Negative (0)"], ["2", "Positive antiphospholipid antibody (+2)"]]),
 makeS("complement", "Complement Proteins", "0", [
 ["0", "Normal C3 and C4 (0)"],
 ["3", "Low C3 OR Low C4 (+3)"],
 ["4", "Low C3 AND Low C4 (+4)"]
 ]),
 makeS("sle_spec", "Highly Specific SLE Antibodies (anti-dsDNA or anti-Smith)", "0", [["0", "Negative (0)"], ["6", "Positive anti-dsDNA OR anti-Sm (+6)"]])
 ],
 table: {
 headers: ["Total Weighted Score", "ANA Entry Status", "Classification Status", "Recommended Evaluation"],
 rows: [
 { id: "sleClassified", cols: ["≥ 10 Points", "Positive (≥1:80)", "CLASSIFIED AS SYSTEMIC LUPUS ERYTHEMATOSUS", "Comprehensive rheumatology care; evaluate for organ involvement (urinalysis, UPCR, echo)"] },
 { id: "sleSub", cols: ["< 10 Points", "Positive (≥1:80)", "Classification threshold not met", "Monitor clinically; rule out incomplete lupus or connective tissue disease overlap"] },
 { id: "sleNoAna", cols: ["Any score", "Negative (<1:80)", "Entry criterion not met (Not SLE)", "SLE is effectively ruled out; investigate seronegative autoimmune conditions"] }
 ]
 },
 calc: function (v) {
 if (v.ana !== "1") {
 return {
 value: "Entry Criterion Not Met (ANA < 1:80)",
 matchId: "sleNoAna",
 eq: "2019 EULAR/ACR criteria require a positive ANA (≥1:80 on HEp-2 cells) as an obligatory entry criterion."
 };
 }

 var hScore = v.heme === "4b" ? 4 : +v.heme;
 var nScore = +v.neuro;
 var sScore = v.skin === "2b" ? 2 : +v.skin;
 var serScore = +v.serosa;
 var rScore = +v.renal;
 var fScore = +v.fever;
 var jScore = +v.joint;

 var clinicalTotal = fScore + hScore + nScore + sScore + serScore + jScore + rScore;
 var immunoTotal = +v.antiphos + +v.complement + +v.sle_spec;
 var total = clinicalTotal + immunoTotal;

 var hasClinical = clinicalTotal > 0;
 var classified = total >= 10 && hasClinical;

 var match = classified ? "sleClassified" : "sleSub";
 var verdict = classified
 ? "Meets 2019 EULAR/ACR Classification Criteria for Systemic Lupus Erythematosus (Score: " + total + ")."
 : "Score: " + total + " points (Below classification threshold of ≥10 points with ≥1 clinical criterion).";

 return {
 value: total + " Points (" + (classified ? "SLE Classified" : "Threshold Not Met") + ")",
 matchId: match,
 eq: verdict
 };
 }
 },

 // ==============================================================
 // 7. SLEDAI-2K (LUPUS DISEASE ACTIVITY INDEX)
 // ==============================================================
 {
 id: "sledai2k",
 cat: "rheum",
 type: "calc",
 name: "SLEDAI-2K (Systemic Lupus Disease Activity Index 2000)",
 desc: "Validated disease activity index scoring persistent, active, or recurrent manifestations of lupus.",
 organ: "Multisystem / Kidney / Brain / Blood",
 region: "Systemic Autoimmunity",
 subject: "Systemic Lupus Erythematosus / Disease Monitoring",
 keywords: ["sledai", "sledai-2k", "lupus", "disease activity", "flare", "nephritis"],
 guidance: "1. Captures disease manifestations occurring within the prior 10–30 days.\n2. SLEDAI 0: Remission / Inactive disease.\n3. SLEDAI 1–5: Mild activity.\n4. SLEDAI 6–10: Moderate activity.\n5. SLEDAI > 10: High disease activity requiring aggressive immunosuppressive escalation.",
 contraindications: "Does not score accumulated irreversible organ damage (use SLICC/ACR Damage Index).",
 literature: [
 {
 type: "Seminal Publication",
 icon: "📄",
 title: "Derivation of the SLEDAI: a disease activity index for lupus patients",
 citation: "Bombardier C, Gladman DD, Urowitz MB, et al. Arthritis Rheum. 1992;35(6):630-640.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/1599520/" }]
 }
 ],
 fields: [
 makeN("score", "Total SLEDAI-2K Score from Clinical Assessment", 4, { min: 0, max: 105, step: 1 })
 ],
 table: {
 headers: ["SLEDAI-2K Score", "Activity State", "Clinical Action"],
 rows: [
 { id: "slNone", cols: ["0 points", "Inactive Disease", "Maintain baseline hydroxychloroquine therapy"] },
 { id: "slMild", cols: ["1 – 5 points", "Mild Disease Activity", "Minor adjustment; monitor closely"] },
 { id: "slMod", cols: ["6 – 10 points", "Moderate Disease Activity", "Optimize glucocorticoid / immunosuppressive dosing"] },
 { id: "slHigh", cols: ["> 10 points", "High Disease Activity", "Urgent escalation: pulse methylprednisolone, cyclophosphamide, or mycophenolate"] }
 ]
 },
 calc: function (v) {
 var s = Math.max(+v.score, 0);
 var match = s === 0 ? "slNone" : s <= 5 ? "slMild" : s <= 10 ? "slMod" : "slHigh";
 var label = s === 0 ? "Inactive Disease" : s <= 5 ? "Mild Activity (1–5)" : s <= 10 ? "Moderate Activity (6–10)" : "High Disease Activity (>10)";

 return {
 value: "SLEDAI-2K: " + s + " Points (" + label + ")",
 matchId: match,
 eq: "Score reflects active inflammatory features over the preceding 30 days."
 };
 }
 },

 // ==============================================================
 // 8. LUPUS LOW DISEASE ACTIVITY STATE (LLDAS)
 // ==============================================================
 {
 id: "lldas",
 cat: "rheum",
 type: "class",
 name: "Lupus Low Disease Activity State (LLDAS)",
 desc: "Standardized treat-to-target clinical endpoint associated with reduced organ damage accrual in SLE.",
 organ: "Multisystem / Kidney / Vascular",
 region: "Systemic Autoimmunity",
 subject: "SLE Treat-to-Target / Remission Endpoints",
 keywords: ["lldas", "lupus", "low disease activity", "prednisone", "treat to target"],
 guidance: "1. Must fulfill ALL 5 criteria simultaneously:\n- SLEDAI-2K ≤ 4 (with no major organ activity: CNS, renal, cardiopulmonary, vasculitis).\n- No new features of disease activity compared to previous visit.\n- Physician Global Assessment (PGA 0–3) ≤ 1.0.\n- Prednisone (or equivalent) dose ≤ 7.5 mg/day.\n- Well-tolerated standard maintenance immunosuppressants/biologics.\n2. Sustained LLDAS reduces mortality and halts irreversible organ damage accrual.",
 contraindications: "Active lupus nephritis with active urinary sediment automatically disqualifies a patient from LLDAS.",
 literature: [
 {
 type: "Seminal Derivation & Validation",
 icon: "📄",
 title: "Definition of low disease activity in systemic lupus erythematosus",
 citation: "Franklyn K, Lau CS, Navarra SV, et al. Ann Rheum Dis. 2016;75(9):1615-1621.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/26661498/" }]
 }
 ],
 fields: [
 makeYN("sledai", "1. SLEDAI-2K ≤ 4 without activity in major organ systems?", "1"),
 makeYN("new_act", "2. No new or worsening features compared to previous visit?", "1"),
 makeN("pga", "3. Physician Global Assessment (PGA, 0–3 scale)", 0.5, { min: 0, max: 3, step: 0.1 }),
 makeN("pred", "4. Prednisone-equivalent daily dose (mg/day)", 5, { min: 0, max: 100, step: 0.5 }),
 makeYN("immuno", "5. Stable standard maintenance immunosuppressants?", "1")
 ],
 table: {
 headers: ["LLDAS Status", "Criteria Assessment", "Prognostic Impact", "Clinical Action"],
 rows: [
 { id: "lldasMet", cols: ["LLDAS ACHIEVED", "All 5 criteria fulfilled", "Significant reduction in flare rates, organ damage accrual, and mortality", "Maintain current maintenance regimen; consider further steroid tapering"] },
 { id: "lldasFailed", cols: ["LLDAS Not Met", "≥ 1 criterion failed", "Increased risk of flares and accelerated irreversible organ damage", "Review disease drivers: optimize immunosuppressive therapy or address steroid taper"] }
 ]
 },
 calc: function (v) {
 var passed = v.sledai === "1" && v.new_act === "1" && +v.pga <= 1.0 && +v.pred <= 7.5 && v.immuno === "1";
 var match = passed ? "lldasMet" : "lldasFailed";

 return {
 value: passed ? "LLDAS ACHIEVED (Target Met)" : "LLDAS NOT MET",
 matchId: match,
 eq: "Requires: SLEDAI-2K ≤4 without major organ involvement, no new activity, PGA ≤1.0, Prednisone ≤7.5 mg/day, and stable maintenance therapy."
 };
 }
 },

 // ==============================================================
 // 9. 2022 ACR/EULAR ANCA-ASSOCIATED VASCULITIS (GPA / MPA / EGPA)
 // ==============================================================
 {
 id: "aav_classification",
 cat: "rheum",
 type: "class",
 name: "2022 ACR/EULAR Classification: GPA, MPA, and EGPA",
 desc: "Differential weighted classification schemas distinguishing the three primary ANCA-associated vasculitides.",
 organ: "Small-to-Medium Blood Vessels / Lungs / Kidneys",
 region: "Systemic Necrotizing Vasculitis",
 subject: "Systemic Vasculitis / Classification",
 keywords: ["anca", "gpa", "mpa", "egpa", "wegeners", "churg strauss", "vasculitis", "pr3", "mpo"],
 guidance: "1. Applies only to patients with a confirmed diagnosis of small- or medium-vessel vasculitis after excluding mimics.\n2. GPA (Threshold ≥ 5 pts): bloody nasal discharge/crusting (+3), cartilaginous involvement (+2), conductive/sensorineural hearing loss (+1), PR3-ANCA / c-ANCA (+5), pulmonary nodules/cavities (+2), pauci-immune GN (+1).\n3. MPA (Threshold ≥ 5 pts): MPO-ANCA / p-ANCA (+6), fibrosis/ILD (+3), pauci-immune GN (+3), PR3-ANCA (-3), nasal crusting/bloody discharge (-3), eosinophils ≥1.0×10⁹/L (-4).\n4. EGPA (Threshold ≥ 6 pts): Obstructive airway disease/asthma (+3), eosinophils ≥1.0×10⁹/L (+5), nasal polyps (+3), extravascular eosinophilic inflammation (+2), hematuria (-1), PR3-ANCA (-3).",
 contraindications: "These are classification criteria to differentiate types of vasculitis, not diagnostic criteria to rule in vasculitis initially.",
 literature: [
 {
 type: "Official 2022 Consensus",
 icon: "📘",
 title: "2022 American College of Rheumatology/European Alliance of Associations for Rheumatology classification criteria for granulomatosis with polyangiitis",
 citation: "Robson JC, Grayson PC, Ponte C, et al. Ann Rheum Dis. 2022;81(3):315-320.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/35110333/" }]
 }
 ],
 fields: [
 makeS("disease", "Select Vasculitis Classification Model", "gpa", [
 ["gpa", "Granulomatosis with Polyangiitis (GPA)"],
 ["mpa", "Microscopic Polyangiitis (MPA)"],
 ["egpa", "Eosinophilic Granulomatosis with Polyangiitis (EGPA)"]
 ]),
 makeN("score", "Total Weighted Score from Official Worksheet", 6, { min: -10, max: 20, step: 1 }),
 makeYN("vasc_confirmed", "Confirmed small/medium-vessel vasculitis present?", "1")
 ],
 table: {
 headers: ["Subtype", "Classification Threshold", "Key Distinguishing Biomarkers", "First-Line Remission Induction"],
 rows: [
 { id: "gpaMet", cols: ["GPA", "Score ≥ 5 points", "c-ANCA / PR3-ANCA, ENT crusting, lung cavities", "Rituximab or Cyclophosphamide + Glucocorticoids"] },
 { id: "mpaMet", cols: ["MPA", "Score ≥ 5 points", "p-ANCA / MPO-ANCA, rapidly progressive GN, pulmonary fibrosis", "Rituximab or Cyclophosphamide + Glucocorticoids"] },
 { id: "egpaMet", cols: ["EGPA", "Score ≥ 6 points", "Marked eosinophilia, severe asthma, nasal polyposis, MPO+ (~40%)", "Glucocorticoids ± Mepolizumab or Cyclophosphamide (if organ-threatening)"] },
 { id: "aavFailed", cols: ["Subthreshold", "Below cutoff", "Inconclusive classification", "Re-evaluate histology, serology, and clinical features"] }
 ]
 },
 calc: function (v) {
 if (v.vasc_confirmed !== "1") {
 return {
 value: "Ineligible (Vasculitis Not Confirmed)",
 matchId: "aavFailed",
 eq: "Classification criteria require a pre-established clinical diagnosis of small- or medium-vessel vasculitis."
 };
 }

 var s = +v.score;
 var dis = v.disease;
 var threshold = dis === "egpa" ? 6 : 5;
 var classified = s >= threshold;
 var match = classified ? (dis + "Met") : "aavFailed";

 var nameMap = { gpa: "Granulomatosis with Polyangiitis (GPA)", mpa: "Microscopic Polyangiitis (MPA)", egpa: "Eosinophilic Granulomatosis with Polyangiitis (EGPA)" };

 return {
 value: s + " Points (" + (classified ? (nameMap[dis] + " Classified") : "Threshold Not Met") + ")",
 matchId: match,
 eq: "Threshold: GPA ≥5 pts, MPA ≥5 pts, EGPA ≥6 pts.\nFacilitates precise clinical trial enrollment and targeted immunosuppression."
 };
 }
 },

 // ==============================================================
 // 10. BASDAI (BATH ANKYLOSING SPONDYLITIS DISEASE ACTIVITY INDEX)
 // ==============================================================
 {
 id: "basdai",
 cat: "rheum",
 type: "calc",
 name: "BASDAI (Bath Ankylosing Spondylitis Disease Activity Index)",
 desc: "Gold-standard patient-reported outcome measure scoring axial disease activity in ankylosing spondylitis.",
 organ: "Axial Skeleton / Sacroiliac Joints / Entheses",
 region: "Axial Spondyloarthritis",
 subject: "Spondyloarthritis / Biologic Eligibility",
 keywords: ["basdai", "ankylosing spondylitis", "axial spa", "sacroiliitis", "morning stiffness", "biologics"],
 guidance: "1. Six questions scored on a 0–10 Visual Analogue Scale:\n- Q1: Fatigue\n- Q2: Spinal pain\n- Q3: Peripheral joint pain/swelling\n- Q4: Localized enthesitis tenderness\n- Q5: Morning stiffness severity\n- Q6: Morning stiffness duration (0 = 0 hrs, 10 = 2+ hrs)\n2. Formula: [Q1 + Q2 + Q3 + Q4 + ((Q5 + Q6) / 2)] / 5.\n3. BASDAI ≥ 4.0 indicates active disease and serves as standard criterion for initiating TNF or IL-17 inhibitors.",
 contraindications: "Purely subjective patient-reported score; does not capture objective acute-phase reactants (combine with ASDAS-CRP).",
 literature: [
 {
 type: "Seminal Derivation",
 icon: "📄",
 title: "A new approach to defining functional ability in ankylosing spondylitis: the Bath Ankylosing Spondylitis Functional Index",
 citation: "Garrett S, Jenkinson T, Kennedy LG, et al. J Rheumatol. 1994;21(12):2286-2291.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/7699634/" }]
 }
 ],
 fields: [
 makeN("q1", "1. Fatigue / weariness (0–10)", 4, { min: 0, max: 10, step: 0.5 }),
 makeN("q2", "2. Neck, back, or hip pain (0–10)", 5, { min: 0, max: 10, step: 0.5 }),
 makeN("q3", "3. Peripheral joint pain / swelling (0–10)", 3, { min: 0, max: 10, step: 0.5 }),
 makeN("q4", "4. Discomfort in areas tender to touch (enthesitis) (0–10)", 4, { min: 0, max: 10, step: 0.5 }),
 makeN("q5", "5. Morning stiffness severity from waking (0–10)", 5, { min: 0, max: 10, step: 0.5 }),
 makeN("q6", "6. Morning stiffness duration (0=0 min, 5=1 hr, 10=2+ hrs)", 5, { min: 0, max: 10, step: 0.5 })
 ],
 table: {
 headers: ["BASDAI Score", "Activity State", "Biologic Therapy Eligibility", "Clinical Pathway"],
 rows: [
 { id: "basdaiLow", cols: ["< 4.0", "Controlled / Low Activity", "Subthreshold for biologic escalation", "Continue NSAIDs, physical therapy, and stretching exercises"] },
 { id: "basdaiHigh", cols: ["≥ 4.0", "Active Ankylosing Spondylitis", "Eligible for Biologic / Targeted Therapy", "Evaluate for TNF-alpha or IL-17A inhibitor therapy if refractory to ≥2 NSAIDs"] }
 ]
 },
 calc: function (v) {
 var q1 = clamp(+v.q1, 0, 10);
 var q2 = clamp(+v.q2, 0, 10);
 var q3 = clamp(+v.q3, 0, 10);
 var q4 = clamp(+v.q4, 0, 10);
 var q5 = clamp(+v.q5, 0, 10);
 var q6 = clamp(+v.q6, 0, 10);

 var score = (q1 + q2 + q3 + q4 + ((q5 + q6) / 2)) / 5;
 var rounded = score.toFixed(2);
 var match = score >= 4.0 ? "basdaiHigh" : "basdaiLow";
 var label = score >= 4.0 ? "High Disease Activity (≥4.0)" : "Low Disease Activity (<4.0)";

 return {
 value: "BASDAI: " + rounded + " / 10 (" + label + ")",
 matchId: match,
 eq: "Formula: [Q1 + Q2 + Q3 + Q4 + (Q5 + Q6)/2] ÷ 5.\nScore ≥ 4.0 prompts consideration of biologic escalation."
 };
 }
 },

 // ==============================================================
 // 11. ASDAS-CRP (ANKYLOSING SPONDYLITIS DISEASE ACTIVITY SCORE)
 // ==============================================================
 {
 id: "asdas_crp",
 cat: "rheum",
 type: "calc",
 name: "ASDAS-CRP (Ankylosing Spondylitis Disease Activity Score)",
 desc: "Preferred composite disease activity instrument for axial SpA combining patient outcomes with CRP (mg/L).",
 organ: "Axial Skeleton / Entheses",
 region: "Axial Spondyloarthritis",
 subject: "Axial SpA / Objective Disease Activity",
 keywords: ["asdas", "crp", "axial spa", "ankylosing spondylitis", "sacroiliitis", "treat to target"],
 guidance: "1. Formula: 0.121 × BackPain + 0.058 × StiffnessDuration + 0.110 × PatientGlobal + 0.073 × PeripheralPain + 0.579 × ln(CRP + 1).\n2. CRP entered in mg/L.\n3. Cutoffs: < 1.3 Inactive Disease; 1.3 to 2.0 Low Activity; 2.1 to 3.5 High Activity; > 3.5 Very High Activity.\n4. Clinically Important Improvement: Δ ≥ 1.1; Major Improvement: Δ ≥ 2.0.",
 contraindications: "Requires CRP in mg/L (multiply mg/dL by 10).",
 literature: [
 {
 type: "Official ASAS Consensus",
 icon: "📘",
 title: "The Assessment of SpondyloArthritis international Society (ASAS) endorsement of the Ankylosing Spondylitis Disease Activity Score (ASDAS)",
 citation: "Sieper J, Rudwaleit M, Baraliakos X, et al. Ann Rheum Dis. 2009;68(11):1670-1672.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/19822718/" }]
 }
 ],
 fields: [
 makeN("backpain", "Total back pain (0–10 scale)", 5, { min: 0, max: 10, step: 0.5 }),
 makeN("duration", "Morning stiffness duration (0–10 scale)", 4, { min: 0, max: 10, step: 0.5 }),
 makeN("global", "Patient global assessment of disease (0–10)", 5, { min: 0, max: 10, step: 0.5 }),
 makeN("peripheral", "Peripheral joint pain or swelling (0–10)", 2, { min: 0, max: 10, step: 0.5 }),
 makeN("crp", "C-Reactive Protein (CRP, mg/L)", 12, { min: 0, max: 500, step: 0.5 })
 ],
 table: {
 headers: ["ASDAS-CRP Score", "Disease Activity State", "Therapeutic Target", "Management Strategy"],
 rows: [
 { id: "asdasInact", cols: ["< 1.3", "Inactive Disease", "Primary Target", "Optimal control; maintain regimen"] },
 { id: "asdasLow", cols: ["1.3 – 2.0", "Low Disease Activity", "Acceptable Target", "Continue current therapy with periodic monitoring"] },
 { id: "asdasHigh", cols: ["2.1 – 3.5", "High Disease Activity", "Unacceptable", "Consider initiating or switching to TNF-i, IL-17-i, or JAK-i"] },
 { id: "asdasVeryHigh", cols: ["> 3.5", "Very High Disease Activity", "Severe Active Inflammation", "Urgent escalation to targeted biologic/synthetic DMARD"] }
 ]
 },
 calc: function (v) {
 var bp = clamp(+v.backpain, 0, 10);
 var dur = clamp(+v.duration, 0, 10);
 var gl = clamp(+v.global, 0, 10);
 var per = clamp(+v.peripheral, 0, 10);
 var crp = Math.max(+v.crp, 0);

 var score = 0.121 * bp + 0.058 * dur + 0.110 * gl + 0.073 * per + 0.579 * Math.log(crp + 1);
 var rounded = score.toFixed(2);

 var match = score < 1.3 ? "asdasInact" : score <= 2.0 ? "asdasLow" : score <= 3.5 ? "asdasHigh" : "asdasVeryHigh";
 var label = score < 1.3 ? "Inactive Disease (<1.3)" : score <= 2.0 ? "Low Activity (1.3–2.0)" : score <= 3.5 ? "High Activity (2.1–3.5)" : "Very High Activity (>3.5)";

 return {
 value: "ASDAS-CRP: " + rounded + " (" + label + ")",
 matchId: match,
 eq: "Formula: 0.121×BackPain + 0.058×Stiffness + 0.110×PatientGlobal + 0.073×Peripheral + 0.579×ln(CRP+1).\nCutoff ≥2.1 defines high disease activity."
 };
 }
 },

 // ==============================================================
 // 12. ASAS AXIAL SPONDYLOARTHRITIS CLASSIFICATION
 // ==============================================================
 {
 id: "asas_axspa",
 cat: "rheum",
 type: "class",
 name: "ASAS Classification Criteria for Axial Spondyloarthritis",
 desc: "Classifies radiographic and non-radiographic axial SpA through imaging and clinical arms.",
 organ: "Sacroiliac Joints / Spine",
 region: "Axial Spondyloarthritis",
 subject: "Axial Spondyloarthritis / Early Classification",
 keywords: ["asas", "axial spa", "sacroiliitis", "hla-b27", "mri", "ankylosing spondylitis"],
 guidance: "1. Mandatory Entry Criterion: Chronic back pain ≥ 3 months with age of onset < 45 years.\n2. Imaging Arm: Sacroiliitis on imaging (active inflammation on MRI or definite radiographic sacroiliitis) PLUS ≥ 1 SpA feature.\n3. Clinical Arm: Positive HLA-B27 PLUS ≥ 2 SpA features.\n4. SpA Features: Inflammatory back pain, arthritis, enthesitis (heel), uveitis, dactylitis, psoriasis, Crohn/colitis, good response to NSAIDs, family history of SpA, elevated CRP.",
 contraindications: "Does not apply if chronic back pain began at or after age 45.",
 literature: [
 {
 type: "Official ASAS Consensus",
 icon: "📘",
 title: "The development of Assessment of SpondyloArthritis international Society classification criteria for axial spondyloarthritis (part II): validation and final selection",
 citation: "Rudwaleit M, van der Heijde D, Landewé R, et al. Ann Rheum Dis. 2009;68(6):777-783.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/19297344/" }]
 }
 ],
 fields: [
 makeYN("entry", "Back pain ≥ 3 months with onset before age 45?", "1"),
 makeYN("imaging", "Sacroiliitis on MRI (active inflammation) or X-ray (grade ≥2 bilateral or ≥3 unilateral)?", "1"),
 makeYN("hla", "Positive HLA-B27 test?", "0"),
 makeN("features", "Number of SpA Features Present (uveitis, enthesitis, dactylitis, psoriasis, IBD, NSAID response, etc.)", 1, { min: 0, max: 10, step: 1 })
 ],
 table: {
 headers: ["Classification Pathway", "Criteria Requirements", "Status", "Clinical Meaning"],
 rows: [
 { id: "imgArm", cols: ["Imaging Arm", "Sacroiliitis on imaging + ≥ 1 SpA feature", "CLASSIFIED", "Radiographic (AS) or Non-radiographic axial SpA supported"] },
 { id: "clinArm", cols: ["Clinical Arm", "HLA-B27 positive + ≥ 2 SpA features", "CLASSIFIED", "Non-radiographic axial SpA supported via clinical/genetic pathway"] },
 { id: "noArm", cols: ["Subthreshold", "Insufficient imaging/clinical features", "Not Classified", "Investigate mechanical back pain or repeat MRI if suspicion persists"] },
 { id: "noEntry", cols: ["Entry Failed", "Onset ≥45y or duration <3 months", "Ineligible", "Criteria cannot be applied"] }
 ]
 },
 calc: function (v) {
 if (v.entry !== "1") {
 return {
 value: "Ineligible (Entry Criteria Not Met)",
 matchId: "noEntry",
 eq: "Requires chronic back pain ≥3 months beginning before age 45."
 };
 }

 var hasImaging = v.imaging === "1" && +v.features >= 1;
 var hasClinical = v.hla === "1" && +v.features >= 2;

 var match = hasImaging ? "imgArm" : hasClinical ? "clinArm" : "noArm";
 var verdict = hasImaging
 ? "Meets ASAS Imaging Arm (Sacroiliitis on imaging + ≥1 SpA feature)."
 : hasClinical
 ? "Meets ASAS Clinical Arm (HLA-B27 positive + ≥2 SpA features)."
 : "ASAS axial SpA classification criteria not met.";

 return {
 value: (hasImaging || hasClinical) ? "Axial SpA Classified" : "Not Classified",
 matchId: match,
 eq: verdict
 };
 }
 },

 // ==============================================================
 // 13. CASPAR CRITERIA FOR PSORIATIC ARTHRITIS
 // ==============================================================
 {
 id: "caspar",
 cat: "rheum",
 type: "class",
 name: "CASPAR Criteria for Psoriatic Arthritis",
 desc: "Classification criteria for psoriatic arthritis in patients with inflammatory articular disease.",
 organ: "Peripheral Joints / Spine / Entheses / Skin & Nails",
 region: "Psoriatic Arthritis",
 subject: "Spondyloarthritis / Psoriatic Disease",
 keywords: ["caspar", "psoriatic arthritis", "psa", "dactylitis", "nail dystrophy", "enthesitis"],
 guidance: "1. Mandatory Entry Criterion: Established inflammatory articular disease (joint, spine, or enthesis).\n2. Scoring Categories:\n- Current psoriasis (+2) OR personal/family history of psoriasis (+1)\n- Typical psoriatic nail dystrophy (+1)\n- Negative Rheumatoid Factor (+1)\n- Current dactylitis or history of dactylitis recorded by a rheumatologist (+1)\n- Radiographic juxta-articular new bone formation (+1)\n3. Score ≥ 3 points classifies Psoriatic Arthritis (91% sensitivity, 99% specificity).",
 contraindications: "Cannot be applied to patients without inflammatory musculoskeletal disease.",
 literature: [
 {
 type: "Seminal Multicenter Study",
 icon: "📄",
 title: "The Classification of Psoriatic Arthritis (CASPAR) study: a large international study of new classification criteria",
 citation: "Taylor W, Gladman D, Helliwell P, et al. Arthritis Rheum. 2006;54(8):2665-2673.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/16871531/" }]
 }
 ],
 fields: [
 makeYN("inflammatory", "Mandatory Entry: Inflammatory articular disease (joint, spine, or entheseal) present?", "1"),
 makeS("psoriasis", "Psoriasis Presentation", "2", [
 ["0", "No personal or family history of psoriasis (0 pts)"],
 ["1", "Personal history (not current) OR 1st/2nd degree family history of psoriasis (1 pt)"],
 ["2", "Current active psoriatic skin lesions (2 pts)"]
 ]),
 makeYN("nails", "Psoriatic nail dystrophy (onycholysis, pitting, hyperkeratosis)? (+1)", "1"),
 makeYN("rf", "Negative Rheumatoid Factor (by standard lab method)? (+1)", "1"),
 makeYN("dactylitis", "Current dactylitis ('sausage digit') OR past history documented by rheumatologist? (+1)", "0"),
 makeYN("bone", "Juxta-articular new bone formation (ill-defined ossification near joint margins on X-ray)? (+1)", "0")
 ],
 table: {
 headers: ["CASPAR Points", "Threshold Status", "Classification Status", "Diagnostic Action"],
 rows: [
 { id: "casparMet", cols: ["≥ 3 Points", "Met (≥3)", "CLASSIFIED AS PSORIATIC ARTHRITIS", "High specificity (99%). Initiate PsA-directed therapy (csDMARD, TNF-i, IL-17-i, IL-23-i)"] },
 { id: "casparSub", cols: ["< 3 Points", "Subthreshold", "Not classified as PsA", "Consider seronegative RA, reactive arthritis, or undifferentiated spondyloarthritis"] },
 { id: "casparIneligible", cols: ["Entry Failed", "Ineligible", "Criteria cannot be applied", "Requires documented joint, spine, or entheseal inflammation"] }
 ]
 },
 calc: function (v) {
 if (v.inflammatory !== "1") {
 return {
 value: "Entry Criterion Not Met",
 matchId: "casparIneligible",
 eq: "CASPAR requires clinical inflammatory articular disease (peripheral arthritis, spondylitis, or enthesitis)."
 };
 }

 var score = +v.psoriasis + (v.nails === "1" ? 1 : 0) + (v.rf === "1" ? 1 : 0) + (v.dactylitis === "1" ? 1 : 0) + (v.bone === "1" ? 1 : 0);
 var classified = score >= 3;
 var match = classified ? "casparMet" : "casparSub";
 var verdict = classified
 ? "Meets CASPAR Criteria for Psoriatic Arthritis (Score: " + score + " / 6)."
 : "Score: " + score + " / 6 (Threshold of ≥3 points not met).";

 return {
 value: score + " Points (" + (classified ? "PsA Classified" : "Not Classified") + ")",
 matchId: match,
 eq: verdict
 };
 }
 },

 // ==============================================================
 // 14. DAPSA (DISEASE ACTIVITY IN PSORIATIC ARTHRITIS)
 // ==============================================================
 {
 id: "dapsa",
 cat: "rheum",
 type: "calc",
 name: "DAPSA (Disease Activity in Psoriatic Arthritis)",
 desc: "Validated clinical tool evaluating peripheral joint disease activity in psoriatic arthritis.",
 organ: "Peripheral Joints (68/66 Counts)",
 region: "Psoriatic Arthritis",
 subject: "Psoriatic Arthritis / Disease Monitoring",
 keywords: ["dapsa", "psa", "psoriatic arthritis", "joint count", "treat to target"],
 guidance: "1. Formula: TJC68 + SJC66 + Patient Pain (0–10) + Patient Global (0–10) + CRP (mg/dL).\n2. Validated cutoffs:\n- Remission: ≤ 4.0\n- Low Disease Activity: 4.1 to 14.0\n- Moderate Disease Activity: 14.1 to 28.0\n- High Disease Activity: > 28.0\n3. Note: Evaluates peripheral arthritis; skin, axial involvement, and enthesitis require separate assessment.",
 contraindications: "Ensure CRP is entered in mg/dL (divide mg/L by 10).",
 literature: [
 {
 type: "Seminal Derivation",
 icon: "📄",
 title: "Disease activity index for psoriatic arthritis, an update: typical characteristics and response to treatment",
 citation: "Schoels MM, Aletaha D, Funovits J, et al. Ann Rheum Dis. 2010;69(8):1441-1447.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/20525841/" }]
 }
 ],
 fields: [
 makeN("tjc", "Tender Joint Count (0–68)", 2, { min: 0, max: 68, step: 1 }),
 makeN("sjc", "Swollen Joint Count (0–66)", 1, { min: 0, max: 66, step: 1 }),
 makeN("pain", "Patient Pain Assessment VAS (0–10)", 2, { min: 0, max: 10, step: 0.5 }),
 makeN("global", "Patient Global Assessment VAS (0–10)", 2, { min: 0, max: 10, step: 0.5 }),
 makeN("crp", "C-Reactive Protein (CRP, mg/dL)", 0.8, { min: 0, max: 50, step: 0.1 })
 ],
 table: {
 headers: ["DAPSA Score", "Disease Activity State", "Therapeutic Target", "Management"],
 rows: [
 { id: "dapsaRem", cols: ["≤ 4.0", "Remission", "Primary Target", "Optimal peripheral disease control"] },
 { id: "dapsaLow", cols: ["4.1 – 14.0", "Low Disease Activity", "Acceptable Target", "Continue current therapy with periodic evaluation"] },
 { id: "dapsaMod", cols: ["14.1 – 28.0", "Moderate Activity", "Suboptimal", "Intensify DMARD or initiate targeted biologic therapy"] },
 { id: "dapsaHigh", cols: ["> 28.0", "High Disease Activity", "Uncontrolled Disease", "Prompt escalation: switch or add biologic/targeted agent"] }
 ]
 },
 calc: function (v) {
 var score = clamp(+v.tjc, 0, 68) + clamp(+v.sjc, 0, 66) + clamp(+v.pain, 0, 10) + clamp(+v.global, 0, 10) + Math.max(+v.crp, 0);
 var match = score <= 4.0 ? "dapsaRem" : score <= 14.0 ? "dapsaLow" : score <= 28.0 ? "dapsaMod" : "dapsaHigh";
 var label = score <= 4.0 ? "Remission (≤4.0)" : score <= 14.0 ? "Low Activity (4.1–14.0)" : score <= 28.0 ? "Moderate Activity (14.1–28.0)" : "High Disease Activity (>28.0)";

 return {
 value: "DAPSA: " + score.toFixed(2) + " (" + label + ")",
 matchId: match,
 eq: "DAPSA = TJC68 + SJC66 + Pain (0-10) + PatientGlobal (0-10) + CRP (mg/dL).\nPrimary target: Remission (≤4.0) or Low Disease Activity (≤14.0)."
 };
 }
 },

 // ==============================================================
 // 15. 2015 ACR/EULAR GOUT CLASSIFICATION CRITERIA
 // ==============================================================
 {
 id: "gout2015",
 cat: "rheum",
 type: "class",
 name: "2015 ACR/EULAR Gout Classification Criteria",
 desc: "Comprehensive scoring system for classifying gout in patients with acute or chronic inflammatory arthritis.",
 organ: "Synovium / First MTP / Tendons",
 region: "Crystal Arthropathy",
 subject: "Gout / Classification",
 keywords: ["gout", "msu", "uric acid", "urate", "tophus", "first mtp", "podagra", "polarizing"],
 guidance: "1. Sufficient Criterion: Demonstration of Monosodium Urate (MSU) crystals in symptomatic joint fluid or tophus definitively classifies gout without scoring.\n2. Pattern: Ankle/midfoot (+1), 1st MTP (+2).\n3. Typical Episode Characteristics: Erythema, extreme tenderness, difficulty walking (1 feature = +1, 2 features = +2, 3 features = +3).\n4. Time course: Resolution in ≤14 days, complete pain-free intervals (1 episode = +1, recurrent = +2).\n5. Clinical Tophus: Draining or chalky nodule (+4).\n6. Serum Urate: <4 mg/dL (-4), 4–<6 (0), 6–<8 (+2), 8–<10 (+3), ≥10 mg/dL (+4).\n7. Score ≥ 8 classifies Gout.",
 contraindications: "Serum urate levels may fall paradoxically during an acute flare; re-test 2–4 weeks post-flare if baseline was borderline.",
 literature: [
 {
 type: "Official Consensus Classification",
 icon: "📘",
 title: "2015 Gout classification criteria: an American College of Rheumatology/European League Against Rheumatism collaborative initiative",
 citation: "Neogi T, Jansen TL, Dalbeth N, et al. Arthritis Rheumatol. 2015;67(10):2557-2568.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/26352873/" }]
 }
 ],
 fields: [
 makeYN("crystals", "SUFFICIENT CRITERION: MSU crystals identified in symptomatic joint fluid or tophus?", "0"),
 makeS("joint", "Pattern of Symptomatic Joint Involvement", "2", [
 ["0", "Other joints (0 pts)"],
 ["1", "Ankle or midfoot involvement (without 1st MTP) (+1 pt)"],
 ["2", "First metatarsophalangeal joint (1st MTP / podagra) (+2 pts)"]
 ]),
 makeS("characteristics", "Episode Characteristics (erythema, extreme tenderness, difficulty walking)", "3", [
 ["0", "No typical characteristics (0 pts)"],
 ["1", "One characteristic present (+1 pt)"],
 ["2", "Two characteristics present (+2 pts)"],
 ["3", "All three characteristics present (+3 pts)"]
 ]),
 makeS("course", "Time Course of Episode(s)", "2", [
 ["0", "No typical time-course pattern (0 pts)"],
 ["1", "One typical episode (onset <24h, resolution ≤14d, complete pain-free interval) (+1 pt)"],
 ["2", "Recurrent typical episodes (+2 pts)"]
 ]),
 makeYN("tophus", "Clinical tophus present (chalky nodule in ears, olecranon, fingers)? (+4)", "0"),
 makeS("urate", "Serum Urate Level (measured at least 4 weeks post-flare)", "3", [
 ["-4", "< 4.0 mg/dL (-4 pts)"],
 ["0", "4.0 to < 6.0 mg/dL (0 pts)"],
 ["2", "6.0 to < 8.0 mg/dL (+2 pts)"],
 ["3", "8.0 to < 10.0 mg/dL (+3 pts)"],
 ["4", "≥ 10.0 mg/dL (+4 pts)"]
 ]),
 makeYN("imaging", "Imaging evidence of urate deposition (Double-contour sign on ultrasound or DECT urate)? (+4)", "0")
 ],
 table: {
 headers: ["Score Status", "MSU Crystal Confirmation", "Classification Status", "Recommended Clinical Pathway"],
 rows: [
 { id: "goutSufficient", cols: ["Sufficient Criterion", "MSU Crystals Positive", "DEFINITE GOUT CONFIRMED", "Initiate flare treatment (Colchicine/NSAID/Steroid); plan urate-lowering therapy (Allopurinol)"] },
 { id: "goutClassified", cols: ["≥ 8 Points", "Not documented", "CLASSIFIED AS GOUT", "Fulfills 2015 ACR/EULAR criteria; initiate treat-to-target urate lowering (target <6.0 mg/dL)"] },
 { id: "goutSub", cols: ["< 8 Points", "Negative / Not done", "Classification threshold not met", "Evaluate for CPPD (pseudogout), septic arthritis, or psoriatic oligoarthritis"] }
 ]
 },
 calc: function (v) {
 if (v.crystals === "1") {
 return {
 value: "DEFINITE GOUT (MSU Crystals Confirmed)",
 matchId: "goutSufficient",
 eq: "Polarizing light microscopy demonstrating negatively birefringent needle-shaped MSU crystals definitively confirms gout."
 };
 }

 var score = +v.joint + +v.characteristics + +v.course + (v.tophus === "1" ? 4 : 0) + +v.urate + (v.imaging === "1" ? 4 : 0);
 var classified = score >= 8;
 var match = classified ? "goutClassified" : "goutSub";
 var verdict = classified
 ? "Meets 2015 ACR/EULAR Gout Classification Criteria (Score: " + score + " / 8)."
 : "Score: " + score + " points (Below classification threshold of ≥8).";

 return {
 value: score + " Points (" + (classified ? "Gout Classified" : "Threshold Not Met") + ")",
 matchId: match,
 eq: verdict
 };
 }
 },

 // ==============================================================
 // 16. 2016 ACR/EULAR SJÖGREN SYNDROME CRITERIA
 // ==============================================================
 {
 id: "sjogren2016",
 cat: "rheum",
 type: "class",
 name: "2016 ACR/EULAR Primary Sjögren Syndrome Classification",
 desc: "Weighted classification criteria for primary Sjögren syndrome in patients with persistent ocular or oral dryness.",
 organ: "Salivary Glands / Lacrimal Glands / Exocrine",
 region: "Exocrine Gland Autoimmunity",
 subject: "Sjögren Syndrome / Classification",
 keywords: ["sjogren", "anti-ssa", "ro", "schirmer", "salivary biopsy", "sicca", "dry eyes"],
 guidance: "1. Eligible: Patients with daily ocular or oral dryness for >3 months or positive ESSDAI domain.\n2. Criteria:\n- Anti-SSA/Ro positive (+3)\n- Labial salivary gland focal lymphocytic sialadenitis (focus score ≥1 per 4 mm²) (+3)\n- Ocular staining score ≥5 (or van Bijsterveld score ≥4) in at least one eye (+1)\n- Schirmer test ≤ 5 mm / 5 min in at least one eye (+1)\n- Unstimulated whole saliva flow rate ≤ 0.1 mL/min (+1)\n3. Score ≥ 4 classifies Primary Sjögren Syndrome.",
 contraindications: "Exclusion criteria: Prior head/neck radiation, active Hepatitis C, AIDS, sarcoidosis, amyloidosis, graft-versus-host disease, IgG4-related disease.",
 literature: [
 {
 type: "Official Consensus Classification",
 icon: "📘",
 title: "2016 American College of Rheumatology/European League Against Rheumatism classification criteria for primary Sjögren's syndrome",
 citation: "Shiboski CH, Shiboski SC, Seror R, et al. Ann Rheum Dis. 2017;76(1):9-16.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/27789466/" }]
 }
 ],
 fields: [
 makeYN("eligible", "Patient has persistent daily dry eyes/dry mouth >3 months and exclusions ruled out?", "1"),
 makeYN("ssa", "Positive Anti-SSA / Ro antibodies? (+3 pts)", "1"),
 makeYN("biopsy", "Labial salivary gland biopsy focus score ≥ 1 focus/4 mm²? (+3 pts)", "1"),
 makeYN("ocular", "Ocular Staining Score (OSS) ≥ 5 in either eye? (+1 pt)", "0"),
 makeYN("schirmer", "Schirmer test without anesthesia ≤ 5 mm/5 min in either eye? (+1 pt)", "1"),
 makeYN("saliva", "Unstimulated whole salivary flow rate ≤ 0.1 mL/min? (+1 pt)", "0")
 ],
 table: {
 headers: ["Score", "Threshold", "Classification Status", "Management Recommendations"],
 rows: [
 { id: "sjogrenMet", cols: ["≥ 4 Points", "Met (≥4)", "CLASSIFIED AS PRIMARY SJÖGREN SYNDROME", "Symptomatic tear/saliva replacement, secretagogues (Pilocarpine), monitor for lymphoma"] },
 { id: "sjogrenSub", cols: ["< 4 Points", "Subthreshold", "Not classified as Sjögren", "Evaluate alternative causes of sicca (anticholinergic drugs, blepharitis, diabetes)"] },
 { id: "sjogrenIneligible", cols: ["Ineligible", "Exclusions present", "Criteria cannot be applied", "Address secondary dry eyes or underlying systemic conditions"] }
 ]
 },
 calc: function (v) {
 if (v.eligible !== "1") {
 return {
 value: "Ineligible for Classification",
 matchId: "sjogrenIneligible",
 eq: "Requires persistent sicca symptoms >3 months with primary exclusions ruled out (e.g., radiation, HCV, sarcoidosis)."
 };
 }

 var score = (v.ssa === "1" ? 3 : 0) + (v.biopsy === "1" ? 3 : 0) + (v.ocular === "1" ? 1 : 0) + (v.schirmer === "1" ? 1 : 0) + (v.saliva === "1" ? 1 : 0);
 var classified = score >= 4;
 var match = classified ? "sjogrenMet" : "sjogrenSub";
 var verdict = classified
 ? "Meets 2016 ACR/EULAR Classification for Primary Sjögren Syndrome (Score: " + score + " / 9)."
 : "Score: " + score + " / 9 (Threshold of ≥4 points not met).";

 return {
 value: score + " Points (" + (classified ? "Sjögren Classified" : "Not Classified") + ")",
 matchId: match,
 eq: verdict
 };
 }
 },

 // ==============================================================
 // 17. 2013 ACR/EULAR SYSTEMIC SCLEROSIS CLASSIFICATION
 // ==============================================================
 {
 id: "systemicSclerosis2013",
 cat: "rheum",
 type: "class",
 name: "2013 ACR/EULAR Systemic Sclerosis (SSc) Criteria",
 desc: "Point-based criteria for scleroderma with high sensitivity for early and limited cutaneous disease.",
 organ: "Skin / Microvasculature / Lungs / GI Tract",
 region: "Connective Tissue Sclerosis",
 subject: "Systemic Sclerosis / Scleroderma",
 keywords: ["systemic sclerosis", "scleroderma", "raynaud", "sclerodactyly", "centromere", "scl-70", "capillaroscopy"],
 guidance: "1. Sufficient Criterion: Skin thickening of both hands extending proximal to the metacarpophalangeal (MCP) joints classifies Systemic Sclerosis without scoring.\n2. Otherwise, calculate weighted score:\n- Sclerodactyly (+4) OR Puffy fingers (+2) [highest only]\n- Digital tip ulcers (+2) OR Fingertip pitting scars (+3) [highest only]\n- Telangiectasia (+2)\n- Abnormal nailfold capillaries on capillaroscopy (+2)\n- Pulmonary arterial hypertension OR Interstitial lung disease (+2)\n- Raynaud phenomenon (+3)\n- SSc-specific autoantibodies (anti-centromere, anti-topoisomerase I / Scl-70, or anti-RNA polymerase III) (+3)\n3. Score ≥ 9 classifies Systemic Sclerosis.",
 contraindications: "Does not apply if skin thickening is caused by localized scleroderma (morphea), scleredema, or eosinophilic fasciitis.",
 literature: [
 {
 type: "Official Consensus Classification",
 icon: "📘",
 title: "2013 classification criteria for systemic sclerosis: an American College of Rheumatology/European League Against Rheumatism collaborative initiative",
 citation: "van den Hoogen F, Khanna D, Fransen J, et al. Arthritis Rheum. 2013;65(11):2737-2747.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/24122180/" }]
 }
 ],
 fields: [
 makeYN("proximal", "SUFFICIENT CRITERION: Bilateral hand skin thickening extending proximal to MCP joints?", "0"),
 makeS("skinChanges", "Skin thickening of the fingers (highest only)", "4", [
 ["0", "None (0 pts)"],
 ["2", "Puffy fingers (+2 pts)"],
 ["4", "Sclerodactyly (distal to MCP joints) (+4 pts)"]
 ]),
 makeS("ulcers", "Fingertip Lesions (highest only)", "0", [
 ["0", "None (0 pts)"],
 ["2", "Digital tip ulcers (+2 pts)"],
 ["3", "Fingertip pitting scars (+3 pts)"]
 ]),
 makeYN("telangiectasia", "Telangiectasia present? (+2 pts)", "1"),
 makeYN("nailfold", "Abnormal nailfold capillaries (giant capillaries/microhemorrhages)? (+2 pts)", "1"),
 makeYN("lung", "Pulmonary arterial hypertension OR Interstitial lung disease? (+2 pts)", "0"),
 makeYN("raynaud", "Raynaud phenomenon present? (+3 pts)", "1"),
 makeYN("antibodies", "SSc-specific autoantibody positive (Anti-Centromere, Scl-70, or RNA Pol III)? (+3 pts)", "1")
 ],
 table: {
 headers: ["Score Status", "Criteria Assessment", "Classification Status", "Recommended Surveillance"],
 rows: [
 { id: "sscProximal", cols: ["Sufficient Criterion", "Proximal hand thickening", "SYSTEMIC SCLEROSIS CLASSIFIED", "Screen for ILD (HRCT chest), PAH (Echocardiogram/DLCO), and renal crisis (BP monitoring)"] },
 { id: "sscClassified", cols: ["≥ 9 Points", "Threshold met (≥9)", "SYSTEMIC SCLEROSIS CLASSIFIED", "Comprehensive screening for vascular, pulmonary, and visceral involvement"] },
 { id: "sscSub", cols: ["< 9 Points", "Threshold not met", "Not classified as SSc", "Monitor capillaroscopy and antibodies; evaluate for early or overlap syndrome"] }
 ]
 },
 calc: function (v) {
 if (v.proximal === "1") {
 return {
 value: "SYSTEMIC SCLEROSIS CLASSIFIED (Sufficient Criterion)",
 matchId: "sscProximal",
 eq: "Bilateral skin thickening extending proximal to the MCP joints is sufficient on its own to classify Systemic Sclerosis."
 };
 }

 var score = +v.skinChanges + +v.ulcers + (v.telangiectasia === "1" ? 2 : 0) + (v.nailfold === "1" ? 2 : 0) + (v.lung === "1" ? 2 : 0) + (v.raynaud === "1" ? 3 : 0) + (v.antibodies === "1" ? 3 : 0);
 var classified = score >= 9;
 var match = classified ? "sscClassified" : "sscSub";
 var verdict = classified
 ? "Meets 2013 ACR/EULAR Systemic Sclerosis Classification Criteria (Score: " + score + " / 9)."
 : "Score: " + score + " points (Below classification threshold of ≥9 points).";

 return {
 value: score + " Points (" + (classified ? "SSc Classified" : "Threshold Not Met") + ")",
 matchId: match,
 eq: verdict
 };
 }
 },

 // ==============================================================
 // 18. 2022 ACR/EULAR GIANT CELL ARTERITIS (GCA)
 // ==============================================================
 {
 id: "gca_criteria",
 cat: "rheum",
 type: "class",
 name: "2022 ACR/EULAR Giant Cell Arteritis (GCA) Criteria",
 desc: "Weighted diagnostic classification criteria for temporal / giant cell arteritis in older adults.",
 organ: "Temporal Arteries / Aorta / Large Cranial Branches",
 region: "Large-Vessel Vasculitis",
 subject: "Vasculitis / Large Vessel Arteritis",
 keywords: ["gca", "giant cell arteritis", "temporal arteritis", "headache", "jaw claudication", "vision loss", "biopsy"],
 guidance: "1. Mandatory Entry Criterion: Age ≥ 50 years at diagnosis.\n2. Criteria:\n- Morning stiffness in shoulders/neck (+2)\n- Sudden visual loss (+3)\n- Jaw or tongue claudication (+2)\n- New temporal headache (+2)\n- Scalp tenderness (+1)\n- Temporal artery abnormality on palpation (+2)\n- ESR ≥50 mm/hr OR CRP ≥10 mg/L (+3)\n- Temporal artery biopsy showing vasculitis (+5)\n- Temporal artery halo sign on ultrasound (+5)\n- Axillary/large-vessel FDG-PET/CT or halo (+2)\n3. Score ≥ 6 classifies Giant Cell Arteritis.",
 contraindications: "Never delay emergency systemic glucocorticoids to obtain ultrasound, biopsy, or complete criteria scoring when vision is threatened.",
 literature: [
 {
 type: "Official 2022 Consensus",
 icon: "📘",
 title: "2022 American College of Rheumatology/European Alliance of Associations for Rheumatology classification criteria for giant cell arteritis",
 citation: "Ponte C, Grayson PC, Robson JC, et al. Ann Rheum Dis. 2022;81(12):1647-1653.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/36351706/" }]
 }
 ],
 fields: [
 makeYN("age50", "Mandatory Entry: Age at diagnosis ≥ 50 years?", "1"),
 makeYN("headache", "New temporal headache? (+2 pts)", "1"),
 makeYN("jaw", "Jaw or tongue claudication? (+2 pts)", "1"),
 makeYN("vision", "Sudden unexplained loss of vision? (+3 pts)", "0"),
 makeYN("stiffness", "Morning stiffness in shoulders/neck (PMR symptoms)? (+2 pts)", "1"),
 makeYN("esr", "ESR ≥ 50 mm/hr OR CRP ≥ 10 mg/L? (+3 pts)", "1"),
 makeYN("us_biopsy", "Temporal artery biopsy positive OR Halo sign on ultrasound? (+5 pts)", "1")
 ],
 table: {
 headers: ["Score Status", "Numerical Threshold", "Classification Status", "Immediate Clinical Management"],
 rows: [
 { id: "gcaClassified", cols: ["≥ 6 Points", "Met (≥6)", "CLASSIFIED AS GIANT CELL ARTERITIS", "High-dose oral prednisone (40–60 mg/day) or IV methylprednisolone if visual symptoms; add Tocilizumab"] },
 { id: "gcaSub", cols: ["< 6 Points", "Subthreshold", "Classification threshold not met", "Correlate with biopsy, PET-CT, or temporal artery duplex ultrasound; rule out mimics"] },
 { id: "gcaIneligible", cols: ["Entry Failed", "Age < 50", "Ineligible", "Criteria cannot be applied; investigate Takayasu arteritis or primary headache disorders"] }
 ]
 },
 calc: function (v) {
 if (v.age50 !== "1") {
 return {
 value: "Ineligible (Age < 50 years)",
 matchId: "gcaIneligible",
 eq: "2022 ACR/EULAR GCA classification criteria strictly require age ≥50 years at diagnosis."
 };
 }

 var score = (v.headache === "1" ? 2 : 0) + (v.jaw === "1" ? 2 : 0) + (v.vision === "1" ? 3 : 0) + (v.stiffness === "1" ? 2 : 0) + (v.esr === "1" ? 3 : 0) + (v.us_biopsy === "1" ? 5 : 0);
 var classified = score >= 6;
 var match = classified ? "gcaClassified" : "gcaSub";
 var verdict = classified
 ? "Meets 2022 ACR/EULAR Classification Criteria for Giant Cell Arteritis (Score: " + score + ")."
 : "Score: " + score + " points (Below classification threshold of ≥6).";

 return {
 value: score + " Points (" + (classified ? "GCA Classified" : "Threshold Not Met") + ")",
 matchId: match,
 eq: verdict
 };
 }
 },

 // ==============================================================
 // 19. 2016 REVISED FIBROMYALGIA DIAGNOSTIC CRITERIA (WPI / SSS)
 // ==============================================================
 {
 id: "fibromyalgia",
 cat: "rheum",
 type: "class",
 name: "2016 Fibromyalgia Diagnostic Criteria (WPI & SSS)",
 desc: "Combines Widespread Pain Index (WPI) and Symptom Severity Scale (SSS) to assess central pain sensitization.",
 organ: "Central Nervous System / Nociceptive Processing",
 region: "Non-Inflammatory Widespread Pain",
 subject: "Central Sensitization / Chronic Pain",
 keywords: ["fibromyalgia", "wpi", "sss", "widespread pain", "fatigue", "central sensitization"],
 guidance: "1. Diagnostic criteria are satisfied if:\n- WPI ≥ 7 AND SSS ≥ 5 OR WPI 4–6 AND SSS ≥ 9.\n- Generalized pain present in at least 4 of 5 body regions.\n- Symptoms present at a similar level for at least 3 months.\n2. Fibromyalgia diagnosis is valid irrespective of other diagnoses; it does not exclude other clinically important illnesses.",
 contraindications: "Does not rule out concurrent inflammatory arthropathy (RA, SLE, axial SpA) or endocrinopathy (hypothyroidism).",
 literature: [
 {
 type: "Seminal Revision",
 icon: "📄",
 title: "2016 revisions to the 2010/2011 fibromyalgia diagnostic criteria",
 citation: "Wolfe F, Clauw DJ, Fitzcharles MA, et al. Semin Arthritis Rheum. 2016;46(3):319-329.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/27916278/" }]
 }
 ],
 fields: [
 makeN("wpi", "Widespread Pain Index (WPI, count of painful areas, 0–19)", 8, { min: 0, max: 19, step: 1 }),
 makeN("sss", "Symptom Severity Scale (SSS, fatigue/sleep/cognition, 0–12)", 7, { min: 0, max: 12, step: 1 }),
 makeYN("generalized", "Generalized pain in at least 4 of 5 regions (left upper, right upper, left lower, right lower, axial)?", "1"),
 makeYN("duration", "Symptoms present at a similar level for at least 3 months?", "1")
 ],
 table: {
 headers: ["WPI / SSS Score", "Criteria Assessment", "Diagnostic Status", "Recommended Approach"],
 rows: [
 { id: "fmMet", cols: ["WPI ≥7 & SSS ≥5 (or WPI 4–6 & SSS ≥9)", "All criteria fulfilled", "FIBROMYALGIA CRITERIA SATISFIED", "Multimodal approach: aerobic exercise, sleep optimization, SNRIs (Duloxetine) or Gabapentinoids"] },
 { id: "fmSub", cols: ["Below score thresholds", "Criteria not met", "Does not meet fibromyalgia criteria", "Investigate alternative regional or systemic pain etiologies"] }
 ]
 },
 calc: function (v) {
 var w = clamp(+v.wpi, 0, 19);
 var s = clamp(+v.sss, 0, 12);
 var scoreMet = (w >= 7 && s >= 5) || (w >= 4 && w <= 6 && s >= 9);
 var fullMet = scoreMet && v.generalized === "1" && v.duration === "1";

 var match = fullMet ? "fmMet" : "fmSub";
 var verdict = fullMet
 ? "Meets 2016 ACR Diagnostic Criteria for Fibromyalgia (WPI: " + w + ", SSS: " + s + ")."
 : "Criteria for fibromyalgia not fulfilled (WPI: " + w + ", SSS: " + s + ").";

 return {
 value: "WPI " + w + " / 19 | SSS " + s + " / 12 (" + (fullMet ? "Criteria Met" : "Not Met") + ")",
 matchId: match,
 eq: verdict
 };
 }
 },

 // ==============================================================
 // 20. HAQ-DI (HEALTH ASSESSMENT QUESTIONNAIRE DISABILITY INDEX)
 // ==============================================================
 {
 id: "haq_di",
 cat: "rheum",
 type: "calc",
 name: "HAQ-DI (Health Assessment Questionnaire Disability Index)",
 desc: "Standardized measure of functional physical disability in inflammatory arthritis across 8 daily activity domains.",
 organ: "Musculoskeletal Function",
 region: "Functional Assessment",
 subject: "Functional Disability / Patient Reported Outcomes",
 keywords: ["haq", "haq-di", "disability index", "functional limitation", "rheumatoid arthritis"],
 guidance: "1. Evaluates 8 functional categories: Dressing, Arising, Eating, Walking, Hygiene, Reach, Grip, and Activities.\n2. Domain scoring: 0 = Without any difficulty, 1 = With some difficulty, 2 = With much difficulty, 3 = Unable to do.\n3. Overall score is the mean of the 8 domain scores (range 0.0 to 3.0).\n4. Scores 0 to 1 indicate mild functional disability; 1 to 2 moderate; 2 to 3 severe disability.\n5. Minimal Clinically Important Difference (MCID): Reduction of ≥ 0.22 points indicates meaningful improvement.",
 contraindications: "Does not score aids/devices adjustment rules in this compact module.",
 literature: [
 {
 type: "Seminal Publication",
 icon: "📄",
 title: "Measurement of patient outcome in arthritis",
 citation: "Fries JF, Spitz P, Kraines RG, et al. Arthritis Rheum. 1980;23(2):137-145.",
 links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/7362664/" }]
 }
 ],
 fields: [
 makeN("dressing", "Dressing and grooming (0–3)", 1, { min: 0, max: 3, step: 1 }),
 makeN("arising", "Arising from bed/chair (0–3)", 1, { min: 0, max: 3, step: 1 }),
 makeN("eating", "Eating and cutting food (0–3)", 0, { min: 0, max: 3, step: 1 }),
 makeN("walking", "Walking outdoors on level ground (0–3)", 1, { min: 0, max: 3, step: 1 }),
 makeN("hygiene", "Hygiene, washing and bathing (0–3)", 1, { min: 0, max: 3, step: 1 }),
 makeN("reach", "Reach: reach down or take down object (0–3)", 1, { min: 0, max: 3, step: 1 }),
 makeN("grip", "Grip: opening jars or car doors (0–3)", 1, { min: 0, max: 3, step: 1 }),
 makeN("activities", "Activities: running errands and chores (0–3)", 1, { min: 0, max: 3, step: 1 })
 ],
 table: {
 headers: ["HAQ-DI Range", "Functional Impairment Tier", "Clinical Interpretation"],
 rows: [
 { id: "haqMild", cols: ["0.0 – 1.0", "Mild Disability", "Independent in basic self-care; mild limitation in demanding activities"] },
 { id: "haqMod", cols: ["1.1 – 2.0", "Moderate Disability", "Significant daily functional limitations; occupational therapy review"] },
 { id: "haqSevere", cols: ["2.1 – 3.0", "Severe Disability", "Marked impairment in physical function; requires assistive devices or caregiver support"] }
 ]
 },
 calc: function (v) {
 var domains = [
 clamp(+v.dressing, 0, 3), clamp(+v.arising, 0, 3), clamp(+v.eating, 0, 3),
 clamp(+v.walking, 0, 3), clamp(+v.hygiene, 0, 3), clamp(+v.reach, 0, 3),
 clamp(+v.grip, 0, 3), clamp(+v.activities, 0, 3)
 ];

 var sum = domains.reduce(function (acc, val) { return acc + val; }, 0);
 var score = sum / 8;
 var rounded = score.toFixed(2);

 var match = score <= 1.0 ? "haqMild" : score <= 2.0 ? "haqMod" : "haqSevere";
 var label = score <= 1.0 ? "Mild Disability (0.0–1.0)" : score <= 2.0 ? "Moderate Disability (1.1–2.0)" : "Severe Disability (2.1–3.0)";

 return {
 value: "HAQ-DI: " + rounded + " (" + label + ")",
 matchId: match,
 eq: "Mean of 8 functional domains (range 0.0 to 3.0).\nMCID = 0.22 point reduction indicates clinically meaningful improvement."
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
 if (window.categories[i] && window.categories[i].id === rheumCategory.id) {
 catExists = true;
 break;
 }
 }
 if (!catExists) {
 window.categories.push(rheumCategory);
 }

 // 2. Safely add tools (deduplicating existing)
 rheumTools.forEach(function (tool) {
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
 window.SYNONYM_MAP["rheum"] = ["rheum", "rheumatology", "arthritis", "lupus", "vasculitis", "spondyloarthritis", "gout", "scleroderma"];
 window.SYNONYM_MAP["ra"] = ["das28", "cdai", "sdai", "haq", "rheumatoid", "acpa", "anti-ccp", "synovitis"];
 window.SYNONYM_MAP["sle"] = ["lupus", "sle", "sledai", "slicc", "lldas", "ana", "dsdna", "nephritis"];
 window.SYNONYM_MAP["vasculitis"] = ["aav", "gpa", "mpa", "egpa", "anca", "bvas", "giant cell", "gca", "temporal"];
 window.SYNONYM_MAP["spa"] = ["basdai", "asdas", "ankylosing", "spondylitis", "axial", "sacroiliitis", "hla-b27"];
 window.SYNONYM_MAP["gout"] = ["gout", "uric acid", "urate", "msu", "podagra", "tophus", "crystal"];
 window.SYNONYM_MAP["scleroderma"] = ["scleroderma", "systemic sclerosis", "raynaud", "sclerodactyly", "telangiectasia"];
 }

 // 4. Force repaint if the HTML engine has already initialized
 if (typeof window.renderHome === "function") {
 window.renderHome();
 }
 } catch (err) {
 console.error("Critical error registering Rheumatology tools:", err);
 }
})();
;
