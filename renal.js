/**
 * MedCalc Module: Nephrology & Renal Medicine (RENAL)
 * Fully compatible with the MedCalc HTML application structure and ortho.js architecture.
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

  var renalCategory = {
    id: "renal",
    name: "Nephrology & Renal",
    icon: "🫘",
    desc: "Kidney function (eGFR), AKI staging, acid-base balance, dialysis adequacy, electrolytes, and CKD risk",
    organs: ["kidney", "nephron", "glomerulus", "tubule", "vasculature", "bladder"],
    region: "renal / metabolic / acid-base"
  };

  var renalTools = [
    // ==============================================================
    // 1. CKD-EPI 2021 CREATININE EQUATION (eGFR)
    // ==============================================================
    {
      id: "ckdEpi2021",
      cat: "renal",
      type: "calc",
      name: "eGFR — CKD-EPI 2021 Creatinine Equation",
      desc: "Standard race-free 2021 equation recommended by KDIGO and ASN/NKF.",
      organ: "Glomerulus / Nephron",
      region: "Renal Function",
      subject: "Nephrology / CKD Assessment",
      keywords: ["egfr", "ckd", "gfr", "creatinine", "ckd-epi", "kdigo", "filtration"],
      guidance: "1. KDIGO 2021 refit equation removes race variables from eGFR calculation.\n2. Gold standard for staging chronic kidney disease and guiding renally cleared drug adjustments.\n3. Requires steady-state serum creatinine; inaccurate in acute kidney injury or unstable hemodynamics.",
      contraindications: "Unreliable in acute renal failure, dialysis dependence, severe sarcopenia, amputees, or extreme muscle mass (bodybuilders).",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "New Creatinine- and Cystatin C-Based Equations to Estimate GFR without Race",
          citation: "Inker LA, Eneanya ND, Coresh J, et al. N Engl J Med. 2021;385(19):1737-1749.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/34554658/" }]
        }
      ],
      fields: [
        makeN("scr", "Serum Creatinine (mg/dL)", 1.2, { min: 0.2, max: 25.0, step: 0.05 }),
        makeN("age", "Age (years)", 58, { min: 18, max: 120, step: 1 }),
        makeS("sex", "Biological Sex", "male", [["male", "Male"], ["female", "Female"]])
      ],
      table: {
        headers: ["CKD Stage", "eGFR Range (mL/min/1.73m²)", "Functional Status", "Recommended Clinical Pathway"],
        rows: [
          { id: "g1", cols: ["G1", "≥ 90", "Normal or high", "Check for albuminuria or structural disease; monitor annually"] },
          { id: "g2", cols: ["G2", "60 – 89", "Mildly decreased", "Evaluate markers of kidney damage; optimize cardiovascular risk"] },
          { id: "g3a", cols: ["G3a", "45 – 59", "Mild-to-moderate decrease", "Screen for anemia, MBD, and electrolyte disturbances; SGLT2i/RAASi"] },
          { id: "g3b", cols: ["G3b", "30 – 44", "Moderate-to-severe decrease", "Nephrology consultation; manage metabolic acidosis and CKD-MBD"] },
          { id: "g4", cols: ["G4", "15 – 29", "Severely decreased", "Prepare for renal replacement therapy, vascular access, or transplant"] },
          { id: "g5", cols: ["G5", "< 15", "Kidney failure (ESRD)", "Initiate or prepare for urgent RRT (hemodialysis, PD, or transplant)"] }
        ]
      },
      calc: function (v) {
        var scr = +v.scr, age = +v.age, female = v.sex === "female";
        var kappa = female ? 0.7 : 0.9;
        var alpha = female ? -0.241 : -0.302;
        var minVal = Math.min(scr / kappa, 1);
        var maxVal = Math.max(scr / kappa, 1);
        var genderMultiplier = female ? 1.012 : 1.0;

        var egfr = 142 * Math.pow(minVal, alpha) * Math.pow(maxVal, -1.200) * Math.pow(0.9938, age) * genderMultiplier;
        var rounded = Math.round(egfr);

        var stage = rounded >= 90 ? "G1" : rounded >= 60 ? "G2" : rounded >= 45 ? "G3a" : rounded >= 30 ? "G3b" : rounded >= 15 ? "G4" : "G5";
        var matchId = stage.toLowerCase();

        return {
          value: rounded + " mL/min/1.73m² (Stage " + stage + ")",
          matchId: matchId,
          eq: "CKD-EPI 2021 Race-Free: 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^-1.200 × 0.9938^Age [× 1.012 if female].\nEvaluates baseline clearance and guides chronic kidney disease staging."
        };
      }
    },

    // ==============================================================
    // 2. COMBINED CREATININE-CYSTATIN C CKD-EPI (2021)
    // ==============================================================
    {
      id: "ckdEpiCysC",
      cat: "renal",
      type: "calc",
      name: "eGFR — Combined Creatinine–Cystatin C (2021)",
      desc: "Confirmatory equation combining both markers without race modifier.",
      organ: "Glomerulus / Nephron",
      region: "Renal Function",
      subject: "Nephrology / Precision eGFR",
      keywords: ["cystatin", "creatinine", "egfr", "cysc", "ckd-epi", "kdigo"],
      guidance: "1. Recommended by KDIGO when creatinine-alone eGFR is 45–59 mL/min/1.73m² without proteinuria.\n2. Invaluable when creatinine estimates are biased by muscle mass, amputation, liver disease, or malnutrition.\n3. Eliminates race variables.",
      contraindications: "Uncontrolled thyroid disorders and high-dose systemic corticosteroid therapy alter cystatin C levels independently of GFR.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "New Creatinine- and Cystatin C-Based Equations to Estimate GFR without Race",
          citation: "Inker LA, Eneanya ND, Coresh J, et al. N Engl J Med. 2021;385(19):1737-1749.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/34554658/" }]
        }
      ],
      fields: [
        makeN("scr", "Serum Creatinine (mg/dL)", 1.2, { min: 0.2, max: 25.0, step: 0.05 }),
        makeN("cysc", "Serum Cystatin C (mg/L)", 1.1, { min: 0.2, max: 15.0, step: 0.05 }),
        makeN("age", "Age (years)", 58, { min: 18, max: 120, step: 1 }),
        makeS("sex", "Biological Sex", "male", [["male", "Male"], ["female", "Female"]])
      ],
      table: {
        headers: ["eGFR Category", "Value (mL/min/1.73m²)", "Accuracy Tier", "Clinical Action"],
        rows: [
          { id: "cysNormal", cols: ["Normal / Preserved", "≥ 60", "High Precision", "CKD rule-out verified when creatinine eGFR was borderline (45-59)"] },
          { id: "cysMildMod", cols: ["Moderate Reduction", "30 – 59", "High Precision", "Confirms CKD Stages G3a–G3b; nephroprotection and cardiovascular risk reduction"] },
          { id: "cysSevere", cols: ["Severe / Failure", "< 30", "High Precision", "Confirms advanced CKD (G4-G5); timely vascular access & RRT preparation"] }
        ]
      },
      calc: function (v) {
        var scr = +v.scr, cysc = +v.cysc, age = +v.age, female = v.sex === "female";
        var kappa = female ? 0.7 : 0.9;
        var alpha = female ? -0.219 : -0.144;
        var minScr = Math.min(scr / kappa, 1);
        var maxScr = Math.max(scr / kappa, 1);
        var minCys = Math.min(cysc / 0.8, 1);
        var maxCys = Math.max(cysc / 0.8, 1);
        var genderMult = female ? 0.963 : 1.0;

        var egfr = 135 * Math.pow(minScr, alpha) * Math.pow(maxScr, -0.544) * Math.pow(minCys, -0.323) * Math.pow(maxCys, -0.778) * Math.pow(0.9961, age) * genderMult;
        var rounded = Math.round(egfr);
        var match = rounded >= 60 ? "cysNormal" : rounded >= 30 ? "cysMildMod" : "cysSevere";

        return {
          value: rounded + " mL/min/1.73m² (Combined eGFR)",
          matchId: match,
          eq: "CKD-EPI 2021 Creatinine-Cystatin C: Superior diagnostic accuracy over creatinine alone; eliminates muscle mass confounders."
        };
      }
    },

    // ==============================================================
    // 3. COCKCROFT-GAULT CREATININE CLEARANCE (CrCl)
    // ==============================================================
    {
      id: "cockcroftGault",
      cat: "renal",
      type: "calc",
      name: "Cockcroft–Gault Creatinine Clearance (CrCl)",
      desc: "Estimates CrCl in mL/min for pharmacological dosing adjustments.",
      organ: "Kidney / Pharmacokinetics",
      region: "Renal Elimination",
      subject: "Clinical Pharmacology / Drug Dosing",
      keywords: ["cockcroft", "gault", "crcl", "clearance", "dosing", "pharmacokinetics", "creatinine"],
      guidance: "1. Formula still heavily referenced in FDA-approved medication package inserts (e.g., direct oral anticoagulants, antibiotics).\n2. Overestimates GFR by 10–20% because of proximal tubular creatinine secretion.\n3. Use actual body weight or ideal/adjusted body weight for obese individuals according to institutional pharmacy protocols.",
      contraindications: "Not indexed to 1.73 m² body surface area; do not use for definitive chronic kidney disease staging.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Prediction of creatinine clearance from serum creatinine",
          citation: "Cockcroft DW, Gault MH. Nephron. 1976;16(1):31-41.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/1244564/" }]
        }
      ],
      fields: [
        makeN("age", "Age (years)", 62, { min: 18, max: 110, step: 1 }),
        makeN("weight", "Patient Weight (kg)", 72, { min: 20, max: 300, step: 0.5 }),
        makeN("scr", "Serum Creatinine (mg/dL)", 1.3, { min: 0.2, max: 20.0, step: 0.05 }),
        makeS("sex", "Biological Sex", "male", [["male", "Male (1.0)"], ["female", "Female (0.85)"]])
      ],
      table: {
        headers: ["CrCl Range", "Renal Elimination Tier", "Drug Dosing Guidance"],
        rows: [
          { id: "crclNormal", cols: ["> 90 mL/min", "Normal Clearance", "Standard dosing across all medications"] },
          { id: "crclMild", cols: ["50 – 89 mL/min", "Mild Impairment", "Standard dosing for most; review narrow-therapeutic agents (e.g., DOACs)"] },
          { id: "crclMod", cols: ["30 – 49 mL/min", "Moderate Impairment", "Dose reduction or extended dosing interval required for renal cleared drugs"] },
          { id: "crclSevere", cols: ["15 – 29 mL/min", "Severe Impairment", "Substantial dose reduction required; consult package inserts"] },
          { id: "crclEsrd", cols: ["< 15 mL/min", "End-Stage / ESRD", "Contraindicated or hemodialysis-specific dosing regimens required"] }
        ]
      },
      calc: function (v) {
        var mult = v.sex === "female" ? 0.85 : 1.0;
        var crcl = ((140 - +v.age) * +v.weight) / (72 * +v.scr) * mult;
        var rounded = Math.round(crcl);

        var match = rounded >= 90 ? "crclNormal" : rounded >= 50 ? "crclMild" : rounded >= 30 ? "crclMod" : rounded >= 15 ? "crclSevere" : "crclEsrd";

        return {
          value: rounded + " mL/min",
          matchId: match,
          eq: "Cockcroft-Gault: [(140 − Age) × Weight (kg)] ÷ (72 × SCr [mg/dL]) [× 0.85 if female]. Note: unadjusted for BSA."
        };
      }
    },

    // ==============================================================
    // 4. BEDSIDE SCHWARTZ PEDIATRIC eGFR
    // ==============================================================
    {
      id: "schwartzPed",
      cat: "renal",
      type: "calc",
      name: "Bedside Schwartz Equation (Pediatric eGFR)",
      desc: "Validated bedside formula for children and adolescents aged 1–18 years.",
      organ: "Pediatric Kidney",
      region: "Pediatric Nephrology",
      subject: "Pediatric Renal Function",
      keywords: ["schwartz", "pediatric", "children", "egfr", "creatinine", "height"],
      guidance: "1. Validated specifically for IDMS-traceable enzymatic serum creatinine assays.\n2. Bedside coefficient k = 0.413 applies to all pediatric ages 1 to 18 years.\n3. Staging thresholds in children mirror adult KDIGO criteria.",
      contraindications: "Not validated for neonates (<1 year old) or post-pubertal adolescents who have attained adult body habitus.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "New equations to estimate GFR in children with CKD",
          citation: "Schwartz GJ, Muñoz A, Schneider MF, et al. J Am Soc Nephrol. 2009;20(3):629-637.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/19158356/" }]
        }
      ],
      fields: [
        makeN("height", "Height (cm)", 125, { min: 40, max: 220, step: 0.5 }),
        makeN("scr", "Serum Creatinine (mg/dL)", 0.6, { min: 0.1, max: 15.0, step: 0.05 })
      ],
      table: {
        headers: ["Pediatric eGFR", "Classification", "Clinical Implication"],
        rows: [
          { id: "pedNormal", cols: ["≥ 90 mL/min/1.73m²", "Normal Pediatric eGFR", "Normal renal function; routine primary care follow-up"] },
          { id: "pedMild", cols: ["60 – 89 mL/min/1.73m²", "Mildly Decreased", "Monitor blood pressure, urinalysis, and growth percentiles"] },
          { id: "pedSevere", cols: ["< 60 mL/min/1.73m²", "Impaired Pediatric eGFR", "Pediatric nephrology referral; assess renal osteodystrophy, anemia, and growth arrest"] }
        ]
      },
      calc: function (v) {
        var egfr = (0.413 * +v.height) / +v.scr;
        var rounded = Math.round(egfr);
        var match = rounded >= 90 ? "pedNormal" : rounded >= 60 ? "pedMild" : "pedSevere";

        return {
          value: rounded + " mL/min/1.73m²",
          matchId: match,
          eq: "Bedside Schwartz Formula: eGFR = (0.413 × Height [cm]) ÷ Serum Creatinine [mg/dL]."
        };
      }
    },

    // ==============================================================
    // 5. FRACTIONAL EXCRETION OF SODIUM (FENa)
    // ==============================================================
    {
      id: "fenaCalc",
      cat: "renal",
      type: "calc",
      name: "Fractional Excretion of Sodium (FENa)",
      desc: "Distinguishes prerenal azotemia from intrinsic acute tubular necrosis (ATN).",
      organ: "Nephron / Proximal & Distal Tubule",
      region: "Acute Renal Failure",
      subject: "Acute Kidney Injury / Diagnostic Indices",
      keywords: ["fena", "sodium", "atn", "prerenal", "azotemia", "tubular", "fractional excretion"],
      guidance: "1. FENa < 1% indicates intact tubular sodium reabsorption in response to renal hypoperfusion (prerenal azotemia).\n2. FENa > 2% indicates impaired tubular sodium reabsorption caused by structural tubular damage (ATN).\n3. Inaccurate if loop or thiazide diuretics were administered within the preceding 24 hours.",
      contraindications: "Diuretic use invalidates test (promotes natriuresis despite prerenal state); use FEUrea instead. FENa can also be <1% in acute glomerulonephritis, contrast nephropathy, or rhabdomyolysis.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Urinary diagnostic indices in acute renal failure: a prospective study",
          citation: "Miller TR, Anderson RJ, Linas SL, et al. Ann Intern Med. 1978;89(1):47-50.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/666184/" }]
        }
      ],
      fields: [
        makeN("una", "Urine Sodium (mEq/L)", 14, { min: 1, max: 250, step: 1 }),
        makeN("sna", "Serum Sodium (mEq/L)", 140, { min: 90, max: 180, step: 1 }),
        makeN("ucr", "Urine Creatinine (mg/dL)", 90, { min: 5, max: 600, step: 1 }),
        makeN("scr", "Serum Creatinine (mg/dL)", 2.4, { min: 0.3, max: 20, step: 0.1 })
      ],
      table: {
        headers: ["FENa %", "Diagnostic Category", "Tubular Function", "Initial Management"],
        rows: [
          { id: "prerenal", cols: ["< 1.0%", "Prerenal Azotemia", "Intact sodium avidity", "Fluid resuscitation or optimization of renal perfusion / cardiac output"] },
          { id: "intermediate", cols: ["1.0% – 2.0%", "Indeterminate / Mixed", "Variable tubular handling", "Correlate with clinical history, diuretic timing, and urine microscopy"] },
          { id: "atn", cols: ["> 2.0%", "Intrinsic AKI / Acute Tubular Necrosis", "Impaired tubular reabsorption", "Avoid fluid overload; discontinue nephrotoxins; supportive care"] }
        ]
      },
      calc: function (v) {
        var fena = ((+v.una * +v.scr) / (+v.sna * +v.ucr)) * 100;
        var match = fena < 1.0 ? "prerenal" : fena > 2.0 ? "atn" : "intermediate";
        var label = fena < 1.0 ? "Prerenal Azotemia (<1%)" : fena > 2.0 ? "Intrinsic Renal Injury / ATN (>2%)" : "Indeterminate (1–2%)";

        return {
          value: fena.toFixed(2) + "% (" + label + ")",
          matchId: match,
          eq: "FENa = [(Urine Na × Serum Cr) ÷ (Serum Na × Urine Cr)] × 100%.\nCaution: Loop diuretics artificially elevate FENa."
        };
      }
    },

    // ==============================================================
    // 6. FRACTIONAL EXCRETION OF UREA (FEUrea)
    // ==============================================================
    {
      id: "feUreaCalc",
      cat: "renal",
      type: "calc",
      name: "Fractional Excretion of Urea (FEUrea)",
      desc: "Evaluates prerenal state versus ATN when diuretics invalidate FENa.",
      organ: "Proximal Tubule",
      region: "Acute Renal Failure",
      subject: "Acute Kidney Injury / Diagnostic Indices",
      keywords: ["feurea", "urea", "diuretics", "prerenal", "atn", "fractional excretion"],
      guidance: "1. Urea reabsorption takes place passively in the proximal tubule and is largely unaffected by loop or distal diuretics.\n2. FEUrea < 35% strongly supports prerenal azotemia.\n3. FEUrea > 50% indicates acute tubular necrosis.",
      contraindications: "Osmotic diuresis (severe hyperglycemia, mannitol) can decrease proximal urea reabsorption and cause falsely elevated FEUrea.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "The fractional excretion of urea: a simple and reliable test for differential diagnosis of acute renal failure",
          citation: "Espiel CH. JAMA. 1980;244(6):579-581.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/7392134/" }]
        }
      ],
      fields: [
        makeN("uurea", "Urine Urea Nitrogen (mg/dL)", 350, { min: 10, max: 2500, step: 5 }),
        makeN("bun", "Blood Urea Nitrogen (BUN, mg/dL)", 45, { min: 2, max: 200, step: 1 }),
        makeN("ucr", "Urine Creatinine (mg/dL)", 80, { min: 5, max: 600, step: 1 }),
        makeN("scr", "Serum Creatinine (mg/dL)", 2.2, { min: 0.3, max: 20, step: 0.1 })
      ],
      table: {
        headers: ["FEUrea %", "Diagnostic Tier", "Diuretic Sensitivity", "Clinical Direction"],
        rows: [
          { id: "fePrerenal", cols: ["< 35%", "Prerenal Azotemia", "Diuretic-independent", "Fluid challenge / hemodynamic restoration"] },
          { id: "feInter", cols: ["35% – 50%", "Indeterminate", "Equivocal", "Serial monitoring; review urinary sediment"] },
          { id: "feAtn", cols: ["> 50%", "Intrinsic AKI / ATN", "Diuretic-independent", "Supportive care, fluid balance management, avoid volume overload"] }
        ]
      },
      calc: function (v) {
        var feUrea = ((+v.uurea * +v.scr) / (+v.bun * +v.ucr)) * 100;
        var match = feUrea < 35 ? "fePrerenal" : feUrea > 50 ? "feAtn" : "feInter";
        var label = feUrea < 35 ? "Prerenal Azotemia (<35%)" : feUrea > 50 ? "Intrinsic Renal Injury / ATN (>50%)" : "Indeterminate (35–50%)";

        return {
          value: feUrea.toFixed(1) + "% (" + label + ")",
          matchId: match,
          eq: "FEUrea = [(Urine Urea × Serum Cr) ÷ (BUN × Urine Cr)] × 100%.\nIndicated when loop diuretics invalidate FENa."
        };
      }
    },

    // ==============================================================
    // 7. KDIGO ACUTE KIDNEY INJURY (AKI) STAGING
    // ==============================================================
    {
      id: "kdigoAki",
      cat: "renal",
      type: "class",
      name: "KDIGO Acute Kidney Injury (AKI) Staging",
      desc: "Consensus criteria based on creatinine change or oliguria duration.",
      organ: "Kidney / Systemic Hemodynamics",
      region: "Critical Care / Nephrology",
      subject: "Acute Kidney Injury / Staging",
      keywords: ["kdigo", "aki", "acute kidney injury", "oliguria", "creatinine", "rrt"],
      guidance: "1. Stage according to the criterion (creatinine rise OR urine output drop) that gives the more severe stage.\n2. Stage 1: Serum Cr rise ≥0.3 mg/dL within 48h or 1.5–1.9× baseline within 7 days, or urine output <0.5 mL/kg/h for 6–12h.\n3. Stage 2: Serum Cr 2.0–2.9× baseline, or urine output <0.5 mL/kg/h for ≥12h.\n4. Stage 3: Serum Cr ≥3.0× baseline or ≥4.0 mg/dL, initiation of RRT, or anuria ≥12h.",
      contraindications: "Urine output criteria require an indwelling urinary catheter for continuous hourly accuracy and may be confounded by diuretics.",
      literature: [
        {
          type: "Official Clinical Guideline",
          icon: "📘",
          title: "KDIGO Clinical Practice Guideline for Acute Kidney Injury",
          citation: "Kidney Disease: Improving Global Outcomes (KDIGO) AKI Work Group. Kidney Int Suppl. 2012;2(1):1-138.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/31198734/" }]
        }
      ],
      fields: [
        makeS("cr_stage", "Serum Creatinine Elevation", "1", [
          ["0", "No significant rise (<0.3 mg/dL increase and <1.5× baseline)"],
          ["1", "Stage 1: Increase ≥0.3 mg/dL within 48h OR 1.5–1.9× baseline within 7d"],
          ["2", "Stage 2: 2.0–2.9× baseline creatinine"],
          ["3", "Stage 3: ≥3.0× baseline OR Cr ≥4.0 mg/dL OR initiation of RRT"]
        ]),
        makeS("uo_stage", "Urine Output Rate", "0", [
          ["0", "Normal output (>0.5 mL/kg/h)"],
          ["1", "Stage 1: <0.5 mL/kg/h for 6–12 hours"],
          ["2", "Stage 2: <0.5 mL/kg/h for ≥12 hours"],
          ["3", "Stage 3: <0.3 mL/kg/h for ≥24 hours OR anuria for ≥12 hours"]
        ])
      ],
      table: {
        headers: ["KDIGO Stage", "Serum Creatinine Criteria", "Urine Output Criteria", "Recommended Protocol"],
        rows: [
          { id: "aki0", cols: ["No AKI", "Cr within normal baseline limits", "Adequate (>0.5 mL/kg/h)", "Routine clinical monitoring"] },
          { id: "aki1", cols: ["Stage 1", "Rise ≥0.3 mg/dL or 1.5–1.9× baseline", "<0.5 mL/kg/h for 6–12 hr", "Discontinue nephrotoxic agents; ensure volume status and perfusion pressure"] },
          { id: "aki2", cols: ["Stage 2", "2.0 – 2.9× baseline", "<0.5 mL/kg/h for ≥12 hr", "Nephrology consult; adjust drug dosing; check diagnostic indices (FENa/sediment)"] },
          { id: "aki3", cols: ["Stage 3", "≥3.0× baseline or Cr ≥4.0 mg/dL or RRT", "<0.3 mL/kg/h for ≥24h or anuria ≥12h", "Urgent RRT preparation; ICU admission; strict fluid balance monitoring"] }
        ]
      },
      calc: function (v) {
        var maxStage = Math.max(+v.cr_stage, +v.uo_stage);
        var matchId = "aki" + maxStage;
        var label = maxStage === 0 ? "No AKI Criteria Met" : "KDIGO AKI Stage " + maxStage;

        var rec = maxStage === 3
          ? "Stage 3 AKI. Critical renal dysfunction. Urgent nephrology consultation and prepare for emergent renal replacement therapy."
          : maxStage === 2
          ? "Stage 2 AKI. Moderate severity. Review medications, avoid IV contrast, and monitor fluid balance meticulously."
          : maxStage === 1
          ? "Stage 1 AKI. Stop nephrotoxics (NSAIDs, aminoglycosides, ACEi/ARB), optimize perfusion, and recheck creatinine within 24–48 hours."
          : "Normal renal dynamics. No AKI criteria fulfilled.";

        return {
          value: label,
          matchId: matchId,
          eq: "Governed by the most severe criteria (Creatinine vs Urine Output).\n" + rec
        };
      }
    },

    // ==============================================================
    // 8. CUMULATIVE FLUID OVERLOAD PERCENTAGE
    // ==============================================================
    {
      id: "fluidOverloadPct",
      cat: "renal",
      type: "calc",
      name: "Cumulative Fluid Overload Percentage",
      desc: "Calculates percentage fluid accumulation relative to hospital baseline weight.",
      organ: "Systemic Vasculature / Interstitial Space",
      region: "Critical Care Resuscitation",
      subject: "Fluid Resuscitation / AKI Complications",
      keywords: ["fluid overload", "resuscitation", "edema", "icu", "mortality", "rrt"],
      guidance: "1. Formula: [Cumulative Net Fluid Balance (L) ÷ Baseline Admission Weight (kg)] × 100%.\n2. Fluid accumulation ≥10% defines severe fluid overload and is an independent predictor of ICU mortality and prolonged mechanical ventilation.\n3. Guides transition from fluid resuscitation to active de-resuscitation (diuretics or ultrafiltration).",
      contraindications: "Requires accurate baseline dry admission weight; error in admission weight skews calculation.",
      literature: [
        {
          type: "Seminal Multicenter Study",
          icon: "📄",
          title: "Outcome in children receiving continuous venovenous hemofiltration",
          citation: "Goldstein SL, Currier H, Graf JM, et al. Pediatrics. 2001;107(4):716-721.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/11335745/" }]
        }
      ],
      fields: [
        makeN("net_l", "Cumulative Net Fluid Balance (Liters)", 6.5, { min: -10, max: 50, step: 0.1 }),
        makeN("weight", "Baseline Admission Weight (kg)", 70, { min: 10, max: 300, step: 0.5 })
      ],
      table: {
        headers: ["Fluid Overload %", "Severity Category", "Organ Impact", "Clinical Action"],
        rows: [
          { id: "foLow", cols: ["< 5%", "Mild / Normal", "Preserved pulmonary gas exchange", "Continue tailored maintenance hydration"] },
          { id: "foMod", cols: ["5% – 9.9%", "Moderate Fluid Gain", "Subclinical interstitial pulmonary edema", "Re-evaluate maintenance IV fluids; initiate conservative fluid management"] },
          { id: "foSevere", cols: ["≥ 10%", "Severe Fluid Overload", "Significantly increased mortality & ventilator failure", "ACTIVE DE-ESCALATION: Loop diuretics (furosemide infusion) or urgent RRT ultrafiltration"] }
        ]
      },
      calc: function (v) {
        var pct = (+v.net_l / +v.weight) * 100;
        var match = pct >= 10 ? "foSevere" : pct >= 5 ? "foMod" : "foLow";
        var status = pct >= 10 ? "Severe Overload (≥10%)" : pct >= 5 ? "Moderate Gain (5–9.9%)" : "Acceptable (<5%)";

        return {
          value: pct.toFixed(1) + "% Fluid Overload (" + status + ")",
          matchId: match,
          eq: "Formula: [Cumulative Net Fluid Balance (L) ÷ Baseline Weight (kg)] × 100%.\nThreshold ≥10% associated with adverse outcomes."
        };
      }
    },

    // ==============================================================
    // 9. CORRECTED SODIUM IN HYPERGLYCEMIA
    // ==============================================================
    {
      id: "corrSodium",
      cat: "renal",
      type: "calc",
      name: "Corrected Sodium in Hyperglycemia",
      desc: "Adjusts measured serum sodium for hyperglycemic translocational osmotic shifts.",
      organ: "Extracellular Fluid / Plasma",
      region: "Electrolytes / Acid-Base",
      subject: "Endocrine & Renal Emergencies / DKA / HHS",
      keywords: ["sodium", "corrected sodium", "hyperglycemia", "dka", "hhs", "katz", "hillier"],
      guidance: "1. Glucose acts as an effective osmole, drawing water out of cells and diluting serum sodium.\n2. Katz correction factor: add 1.6 mEq/L Na for every 100 mg/dL glucose above 100.\n3. Hillier correction factor: add 2.4 mEq/L Na for every 100 mg/dL glucose above 100 (more accurate when glucose >400 mg/dL).\n4. Directs selection of 0.9% normal saline versus 0.45% half-normal saline in DKA/HHS resuscitation.",
      contraindications: "Does not account for non-glucose effective osmoles such as mannitol or maltose.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Hyperglycemia-induced hyponatremia: calculation of expected serum sodium depression",
          citation: "Katz MA. N Engl J Med. 1973;289(16):843-844.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/4763428/" }]
        }
      ],
      fields: [
        makeN("sna", "Measured Serum Sodium (mEq/L)", 130, { min: 100, max: 180, step: 1 }),
        makeN("glucose", "Serum Glucose (mg/dL)", 450, { min: 50, max: 2500, step: 5 })
      ],
      table: {
        headers: ["Corrected Na Range", "Physiological Tonicity", "DKA/HHS Fluid Selection"],
        rows: [
          { id: "hypoNa", cols: ["< 135 mEq/L", "True Hypotonic Hyponatremia", "Infuse 0.9% Normal Saline (154 mEq/L Na) at 250–500 mL/hr"] },
          { id: "normoNa", cols: ["135 – 145 mEq/L", "Eunatremic Tonicity", "Switch to 0.45% Half-Normal Saline (77 mEq/L Na) once hemodynamically stable"] },
          { id: "hyperNa", cols: ["> 145 mEq/L", "Hypernatremic / Hypertonic", "Infuse 0.45% NaCl to avoid excessive osmolar shift; monitor sodium closely"] }
        ]
      },
      calc: function (v) {
        var g = +v.glucose;
        var katz = +v.sna + 0.016 * (g - 100);
        var hillier = +v.sna + 0.024 * (g - 100);

        var match = katz < 135 ? "hypoNa" : katz <= 145 ? "normoNa" : "hyperNa";

        return {
          value: "Katz: " + katz.toFixed(1) + " mEq/L | Hillier: " + hillier.toFixed(1) + " mEq/L",
          matchId: match,
          eq: "Katz Formula: Measured Na + 0.016 × (Glucose − 100).\nHillier Formula: Measured Na + 0.024 × (Glucose − 100)."
        };
      }
    },

    // ==============================================================
    // 10. FREE WATER DEFICIT IN HYPERNATREMIA
    // ==============================================================
    {
      id: "freeWaterDeficit",
      cat: "renal",
      type: "calc",
      name: "Free Water Deficit in Hypernatremia",
      desc: "Calculates free water required to restore serum sodium to 140 mEq/L.",
      organ: "Total Body Water / Intracellular Fluid",
      region: "Electrolytes / Acid-Base",
      subject: "Fluid & Electrolyte Disorders / Hypernatremia",
      keywords: ["free water", "deficit", "hypernatremia", "sodium", "tbw", "rehydration"],
      guidance: "1. Formula: Total Body Water (TBW) × [(Serum Na ÷ 140) − 1].\n2. TBW coefficients: Male adult = 0.6; Female adult = 0.5; Elderly male = 0.5; Elderly female = 0.45.\n3. Lower serum sodium slowly: maximum 8–10 mEq/L reduction in 24 hours to prevent fatal cerebral edema.\n4. Administer free water enterally (via NG/oral) or intravenously as 5% Dextrose in Water (D5W).",
      contraindications: "Do not correct sodium rapidly; rapid reduction causes water to rush into hyperosmolar brain cells leading to herniation.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Hypernatremia",
          citation: "Adrogué HJ, Madias NE. N Engl J Med. 2000;342(20):1493-1499.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/10816188/" }]
        }
      ],
      fields: [
        makeN("sna", "Current Serum Sodium (mEq/L)", 158, { min: 140, max: 200, step: 1 }),
        makeN("weight", "Patient Weight (kg)", 70, { min: 20, max: 300, step: 0.5 }),
        makeS("demog", "Patient Demographic Group", "m_adult", [
          ["m_adult", "Adult Male (TBW 60%)"],
          ["f_adult", "Adult Female (TBW 50%)"],
          ["m_elder", "Elderly Male (TBW 50%)"],
          ["f_elder", "Elderly Female (TBW 45%)"]
        ])
      ],
      table: {
        headers: ["Deficit Severity", "Volume (Liters)", "Correction Speed", "Preferred Fluid"],
        rows: [
          { id: "fwdMod", cols: ["Moderate Deficit", "< 5 Liters", "Correct over 24–48 hours (≤0.5 mEq/L/hr)", "Enteral water via NG tube or IV D5W"] },
          { id: "fwdSevere", cols: ["Severe Deficit", "≥ 5 Liters", "Correct over 48–72 hours (max 8–10 mEq/L/day)", "Enteral water + IV D5W with serial sodium checks q4h"] }
        ]
      },
      calc: function (v) {
        var f = 0.6;
        if (v.demog === "f_adult" || v.demog === "m_elder") f = 0.5;
        else if (v.demog === "f_elder") f = 0.45;

        var tbw = +v.weight * f;
        var deficit = tbw * ((+v.sna / 140) - 1);
        var match = deficit >= 5.0 ? "fwdSevere" : "fwdMod";

        return {
          value: deficit.toFixed(1) + " L Free Water Deficit (TBW: " + tbw.toFixed(1) + " L)",
          matchId: match,
          eq: "Formula: Deficit (L) = TBW × [(Serum Na ÷ 140) − 1].\nMax rate of correction: 8–10 mEq/L per 24 hours to prevent cerebral edema."
        };
      }
    },

    // ==============================================================
    // 11. SERUM ANION GAP & ALBUMIN CORRECTION
    // ==============================================================
    {
      id: "anionGap",
      cat: "renal",
      type: "calc",
      name: "Serum Anion Gap & Albumin Correction",
      desc: "Calculates raw and albumin-adjusted anion gap to evaluate metabolic acidosis.",
      organ: "Plasma / Extracellular Buffer",
      region: "Acid-Base Physiology",
      subject: "Metabolic Acidosis / Diagnostic Workup",
      keywords: ["anion gap", "acidosis", "hagma", "mudpiles", "albumin", "electrolyte"],
      guidance: "1. Formula: Anion Gap = Na − (Cl + HCO₃).\n2. Albumin correction: Corrected AG = Measured AG + 2.5 × (4.0 − Albumin [g/dL]).\n3. Hypoalbuminemia significantly lowers baseline anion gap (by ~2.5 mEq/L per 1 g/dL albumin drop), masking high-anion-gap acidosis (HAGMA).",
      contraindications: "Severe hypercalcemia, hypermagnesemia, or lithium intoxication can cause an artifactually lowered anion gap.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Anion gap and hypoalbuminemia",
          citation: "Figge J, Jabor A, Kazda A, Fencl V. Crit Care Med. 1998;26(11):1807-1810.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/9824071/" }]
        }
      ],
      fields: [
        makeN("na", "Serum Sodium (mEq/L)", 140, { min: 90, max: 180, step: 1 }),
        makeN("cl", "Serum Chloride (mEq/L)", 102, { min: 60, max: 140, step: 1 }),
        makeN("hco3", "Serum Bicarbonate (mEq/L)", 18, { min: 2, max: 55, step: 1 }),
        makeN("alb", "Serum Albumin (g/dL)", 2.2, { min: 0.5, max: 6.0, step: 0.1 })
      ],
      table: {
        headers: ["Corrected AG", "Acid-Base State", "Primary Differential Diagnosis"],
        rows: [
          { id: "agLow", cols: ["< 4 mEq/L", "Low Anion Gap", "Severe hypoalbuminemia, multiple myeloma (cationic paraprotein), lithium"] },
          { id: "agNormal", cols: ["4 – 12 mEq/L", "Normal Anion Gap", "Normal baseline or NAGMA (diarrhea, renal tubular acidosis)"] },
          { id: "agHigh", cols: ["> 12 mEq/L", "Elevated Anion Gap (HAGMA)", "MUDPILES: Methanol, Uremia, DKA, Propylene glycol, INH/Iron, Lactic acidosis, Ethylene glycol, Salicylates"] }
        ]
      },
      calc: function (v) {
        var rawAg = +v.na - (+v.cl + +v.hco3);
        var corrAg = rawAg + 2.5 * (4.0 - +v.alb);

        var match = corrAg > 12 ? "agHigh" : corrAg < 4 ? "agLow" : "agNormal";
        var label = corrAg > 12 ? "HAGMA (Anion Gap Elevated)" : corrAg < 4 ? "Low Anion Gap" : "Normal Anion Gap";

        return {
          value: "Corrected AG: " + corrAg.toFixed(1) + " mEq/L (Raw: " + rawAg + " mEq/L)",
          matchId: match,
          eq: "Corrected AG = [Na − (Cl + HCO₃)] + 2.5 × (4.0 − Albumin).\nDiagnosis: " + label
        };
      }
    },

    // ==============================================================
    // 12. WINTER'S FORMULA FOR RESPIRATORY COMPENSATION
    // ==============================================================
    {
      id: "wintersFormula",
      cat: "renal",
      type: "calc",
      name: "Winter’s Formula (Respiratory Compensation)",
      desc: "Expected PaCO₂ compensation in primary metabolic acidosis.",
      organ: "Lungs / Brainstem Chemoreceptors",
      region: "Acid-Base Physiology",
      subject: "Arterial Blood Gas / Acid-Base",
      keywords: ["winters", "acidosis", "paco2", "bicarbonate", "compensation", "abg", "metabolic"],
      guidance: "1. Formula: Expected PaCO₂ = (1.5 × HCO₃) + 8 ± 2.\n2. In primary metabolic acidosis, alveolar hyperventilation blows off CO₂ to buffer pH.\n3. If actual PaCO₂ > expected, there is a concurrent secondary respiratory acidosis (respiratory failure/hypoventilation).\n4. If actual PaCO₂ < expected, there is a concurrent respiratory alkalosis (e.g., sepsis, salicylate toxicity).",
      contraindications: "Applies exclusively to primary metabolic acidosis; not applicable to primary metabolic alkalosis or respiratory disorders.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "The estimation of acid-base changes in acute metabolic acidosis",
          citation: "Winter RW, Engel K, Treip RP. Scand J Clin Lab Invest. 1964;16:387-394.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/14163820/" }]
        }
      ],
      fields: [
        makeN("hco3", "Serum Bicarbonate (mEq/L)", 14, { min: 2, max: 35, step: 1 }),
        makeN("paco2", "Measured PaCO₂ on ABG (mmHg)", 28, { min: 10, max: 100, step: 1 })
      ],
      table: {
        headers: ["Actual vs Expected PaCO₂", "Acid-Base Interpretation", "Physiological Etiology"],
        rows: [
          { id: "respAcid", cols: ["Actual > Expected", "Mixed Acidosis: Metabolic Acidosis + Respiratory Acidosis", "Respiratory muscle fatigue, CNS depression, COPD, impending arrest"] },
          { id: "respAdequate", cols: ["Actual = Expected (±2)", "Appropriate Respiratory Compensation", "Intact respiratory drive and normal pulmonary compensation"] },
          { id: "respAlk", cols: ["Actual < Expected", "Mixed Disorder: Metabolic Acidosis + Respiratory Alkalosis", "Early sepsis, salicylate toxicity, hepatic encephalopathy, pulmonary embolism"] }
        ]
      },
      calc: function (v) {
        var expected = (1.5 * +v.hco3) + 8;
        var minP = expected - 2;
        var maxP = expected + 2;
        var actual = +v.paco2;

        var match = actual > maxP ? "respAcid" : actual < minP ? "respAlk" : "respAdequate";
        var verdict = actual > maxP
          ? "Concurrent Respiratory Acidosis (Inadequate Hyperventilation)"
          : actual < minP
          ? "Concurrent Respiratory Alkalosis (Excessive Hyperventilation)"
          : "Appropriate Respiratory Compensation";

        return {
          value: "Expected PaCO₂: " + expected.toFixed(1) + " mmHg (" + minP.toFixed(1) + "–" + maxP.toFixed(1) + ")",
          matchId: match,
          eq: "Winter's Formula: (1.5 × HCO₃) + 8 ± 2.\nStatus: " + verdict + " (Actual PaCO₂: " + actual + " mmHg)."
        };
      }
    },

    // ==============================================================
    // 13. AEIOU URGENT DIALYSIS INDICATIONS
    // ==============================================================
    {
      id: "aeiouDialysis",
      cat: "renal",
      type: "class",
      name: "AEIOU Indications for Urgent Dialysis",
      desc: "Emergency decision checklist for acute renal replacement therapy.",
      organ: "Kidney / Systemic Physiology",
      region: "Nephrology Emergencies",
      subject: "Critical Care Nephrology / Dialysis",
      keywords: ["aeiou", "dialysis", "urgent rrt", "hyperkalemia", "uremia", "pulmonary edema"],
      guidance: "1. A — Acidosis: Refractory metabolic acidosis with arterial pH < 7.15 despite medical therapy.\n2. E — Electrolytes: Refractory severe hyperkalemia (K > 6.5 mEq/L or ECG changes) unresponsive to shift/excretion agents.\n3. I — Ingestions: Toxic alcohols (methanol, ethylene glycol), lithium, salicylates, valproate.\n4. O — Overload: Refractory pulmonary edema unresponsive to intravenous loop diuretics.\n5. U — Uremia: Clinical uremic pericarditis, encephalopathy, asterixis, or bleeding diathesis.",
      contraindications: "Lack of vascular access or hemodynamic instability (requires continuous RRT rather than intermittent hemodialysis).",
      literature: [
        {
          type: "Official Consensus Guide",
          icon: "📘",
          title: "KDIGO Clinical Practice Guideline for Acute Kidney Injury",
          citation: "Kidney Int Suppl. 2012;2(1):1-138.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/31198734/" }]
        }
      ],
      fields: [
        makeS("a", "A — Refractory Acidosis (pH <7.15)", "0", [["0", "Absent"], ["1", "Present"]]),
        makeS("e", "E — Refractory Hyperkalemia (K >6.5 mEq/L or ECG changes)", "0", [["0", "Absent"], ["1", "Present"]]),
        makeS("i", "I — Ingestions (toxic alcohols, lithium, salicylates)", "0", [["0", "Absent"], ["1", "Present"]]),
        makeS("o", "O — Fluid Overload refractory to diuretics (pulmonary edema)", "0", [["0", "Absent"], ["1", "Present"]]),
        makeS("u", "U — Uremic complications (pericarditis, encephalopathy, bleeding)", "0", [["0", "Absent"], ["1", "Present"]])
      ],
      table: {
        headers: ["AEIOU Criteria Met", "Dialysis Urgency", "Clinical Action"],
        rows: [
          { id: "noRrt", cols: ["0 Indications", "No Emergent Dialysis Indicated", "Continue medical management and treat underlying cause"] },
          { id: "urgentRrt", cols: ["≥ 1 Indication", "EMERGENT RRT MANDATED", "Immediate nephrology consult, emergency temporary dialysis catheter placement, initiate HD or CRRT"] }
        ]
      },
      calc: function (v) {
        var count = +v.a + +v.e + +v.i + +v.o + +v.u;
        var match = count >= 1 ? "urgentRrt" : "noRrt";
        var label = count >= 1
          ? "EMERGENT DIALYSIS INDICATED (" + count + " active criteria)"
          : "No Emergent Indication Present";

        return {
          value: label,
          matchId: match,
          eq: "AEIOU Mnemonic: Acidosis, Electrolytes (K+), Ingestions, Overload, Uremia.\nAny single refractory criterion warrants emergent renal replacement therapy."
        };
      }
    },

    // ==============================================================
    // 14. UREA REDUCTION RATIO (URR) & spKt/V DAUGIRDAS
    // ==============================================================
    {
      id: "dialysisAdequacy",
      cat: "renal",
      type: "calc",
      name: "Hemodialysis Adequacy (URR & Daugirdas spKt/V)",
      desc: "Delivered fractional urea clearance and percentage reduction across hemodialysis.",
      organ: "Blood / Artificial Dialyzer",
      region: "Renal Replacement Therapy",
      subject: "End-Stage Renal Disease / Dialysis Adequacy",
      keywords: ["urr", "kt/v", "daugirdas", "hemodialysis", "dialysis", "adequacy", "urea clearance"],
      guidance: "1. KDOQI targets for thrice-weekly hemodialysis: URR ≥ 65%, single-pool Kt/V (spKt/V) ≥ 1.2 per session (recommended target 1.4).\n2. Draw post-dialysis blood sample precisely using the slow-flow / stop-pump technique to prevent cardiopulmonary recirculation artifact.\n3. Inadequate clearance requires increasing treatment duration, blood flow (Qb), dialysate flow (Qd), or dialyzer surface area.",
      contraindications: "Sampling post-BUN without stopping blood pump produces falsely high clearance readings due to line recirculation.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Second generation logarithmic estimates of single-pool variable volume Kt/V: an analysis of error",
          citation: "Daugirdas JT. J Am Soc Nephrol. 1993;4(5):1205-1213.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/8305648/" }]
        }
      ],
      fields: [
        makeN("pre", "Pre-dialysis BUN (mg/dL)", 70, { min: 10, max: 250, step: 1 }),
        makeN("post", "Post-dialysis BUN (mg/dL)", 22, { min: 2, max: 150, step: 1 }),
        makeN("hours", "Treatment Duration (hours)", 3.5, { min: 1.0, max: 6.0, step: 0.25 }),
        makeN("uf", "Ultrafiltration Volume Removed (Liters)", 2.5, { min: 0, max: 10, step: 0.1 }),
        makeN("weight", "Post-dialysis Body Weight (kg)", 68, { min: 25, max: 250, step: 0.5 })
      ],
      table: {
        headers: ["spKt/V Range", "URR %", "Adequacy Category", "Prescription Adjustment"],
        rows: [
          { id: "inadequate", cols: ["< 1.20", "< 65%", "Inadequate Clearance", "Increase blood flow rate (Qb), extend session time, or increase dialyzer surface area"] },
          { id: "adequate", cols: ["1.20 – 1.39", "65% – 70%", "Minimally Adequate", "Meets minimum threshold; titrate upward toward optimal target 1.4"] },
          { id: "optimal", cols: ["≥ 1.40", "> 70%", "Optimal Clearance Target", "Prescription delivers robust solute removal with low mortality profile"] }
        ]
      },
      calc: function (v) {
        var pre = +v.pre, post = +v.post, t = +v.hours, uf = +v.uf, w = +v.weight;
        var r = post / pre;
        var urr = ((pre - post) / pre) * 100;
        var ktv = -Math.log(r - 0.008 * t) + (4 - 3.5 * r) * (uf / w);

        var match = ktv >= 1.4 ? "optimal" : ktv >= 1.2 ? "adequate" : "inadequate";
        var label = ktv >= 1.4 ? "Optimal Adequacy" : ktv >= 1.2 ? "Minimally Adequate" : "Inadequate Clearance";

        return {
          value: "spKt/V: " + ktv.toFixed(2) + " | URR: " + urr.toFixed(1) + "% (" + label + ")",
          matchId: match,
          eq: "Daugirdas 2nd Gen: spKt/V = −ln(R − 0.008×t) + (4 − 3.5×R) × (UF/W).\nKDOQI delivered minimum: spKt/V ≥ 1.20 (URR ≥ 65%)."
        };
      }
    },

    // ==============================================================
    // 15. ULTRAFILTRATION RATE (UFR) & CARDIOVASCULAR SAFETY
    // ==============================================================
    {
      id: "ufrCalc",
      cat: "renal",
      type: "calc",
      name: "Hemodialysis Ultrafiltration Rate (UFR)",
      desc: "Monitors hourly fluid removal rate per kg to prevent myocardial stunning and mortality.",
      organ: "Myocardium / Systemic Circulation",
      region: "Hemodialysis Safety",
      subject: "Dialysis Hemodynamics / Cardiovascular Risk",
      keywords: ["ufr", "ultrafiltration", "stunning", "dialysis", "hypotension", "fluid removal"],
      guidance: "1. Formula: [Total Fluid Removed (mL) ÷ Duration (hours)] ÷ Post-dialysis Weight (kg).\n2. Safe threshold: UFR ≤ 10–13 mL/kg/h.\n3. Excessive UFR (>13 mL/kg/h) triggers recurrent myocardial stunning, splanchnic ischemia, loss of residual kidney function, and cardiovascular death.",
      contraindications: "Does not replace continuous real-time blood pressure and blood volume monitoring during dialysis.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Rapid fluid removal during dialysis is associated with cardiovascular morbidity and mortality",
          citation: "Flythe JE, Kimmel SE, Brunelli SM. Kidney Int. 2011;79(2):250-257.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/20927040/" }]
        }
      ],
      fields: [
        makeN("vol", "Total Fluid Removed (mL)", 2800, { min: 100, max: 8000, step: 50 }),
        makeN("hours", "Treatment Duration (hours)", 3.5, { min: 1, max: 8, step: 0.25 }),
        makeN("weight", "Post-dialysis Weight (kg)", 70, { min: 25, max: 250, step: 0.5 })
      ],
      table: {
        headers: ["UFR Range (mL/kg/h)", "Cardiovascular Risk", "Physiological Strain", "Intervention"],
        rows: [
          { id: "ufrSafe", cols: ["≤ 10.0", "Low / Baseline", "Well tolerated hemodynamically", "Maintain current dry weight and restriction education"] },
          { id: "ufrBorder", cols: ["10.1 – 13.0", "Moderate Risk", "Subclinical myocardial hypoperfusion", "Reinforce dietary sodium/fluid restriction to curb weight gain"] },
          { id: "ufrHigh", cols: ["> 13.0", "CRITICAL RISK", "Severe myocardial stunning & high mortality", "Extend treatment time or prescribe additional ultrafiltration sessions"] }
        ]
      },
      calc: function (v) {
        var ufr = (+v.vol / +v.hours) / +v.weight;
        var match = ufr > 13.0 ? "ufrHigh" : ufr > 10.0 ? "ufrBorder" : "ufrSafe";
        var status = ufr > 13.0 ? "CRITICAL RISK (>13 mL/kg/h)" : ufr > 10.0 ? "Borderline Safe" : "Safe UFR (≤10 mL/kg/h)";

        return {
          value: ufr.toFixed(1) + " mL/kg/h (" + status + ")",
          matchId: match,
          eq: "Formula: [Fluid Removed (mL) ÷ Hours] ÷ Weight (kg).\nThreshold >13 mL/kg/h correlates with myocardial stunning."
        };
      }
    },

    // ==============================================================
    // 16. URINE ANION GAP (UAG) IN NORMAL AG ACIDOSIS
    // ==============================================================
    {
      id: "urineAnionGap",
      cat: "renal",
      type: "calc",
      name: "Urine Anion Gap (UAG)",
      desc: "Evaluates unmeasured urinary ammonium (NH₄⁺) to differentiate RTA from diarrhea.",
      organ: "Distal Tubule / Collecting Duct",
      region: "Acid-Base Diagnostics",
      subject: "Normal Anion Gap Acidosis / Tubulopathy",
      keywords: ["urine anion gap", "uag", "nagma", "ammonium", "rta", "diarrhea", "type 1 rta"],
      guidance: "1. Formula: Urine Anion Gap = (UNa + UK) − UCl.\n2. In normal anion gap metabolic acidosis (NAGMA), negative UAG (<0, usually -20 to -50 mEq/L) reflects intact renal ammonium excretion accompanied by chloride (e.g., gastrointestinal diarrhea).\n3. Positive UAG (>0) reflects impaired distal proton/ammonium secretion, diagnostic of distal Renal Tubular Acidosis (Type 1 RTA) or hypoaldosteronism (Type 4 RTA).",
      contraindications: "Invalid in presence of unmeasured urinary anions (ketoacids, hippurate from toluene, penicillin) or polyuria; use Urine Osmolal Gap in questionable cases.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "The use of the urine anion gap in the diagnosis of hyperchloremic metabolic acidosis",
          citation: "Batlle DC, Husted M, Kuchel GA, Arruda JA. N Engl J Med. 1988;318(10):594-599.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/3344007/" }]
        }
      ],
      fields: [
        makeN("una", "Urine Sodium (mEq/L)", 40, { min: 1, max: 250, step: 1 }),
        makeN("uk", "Urine Potassium (mEq/L)", 25, { min: 1, max: 200, step: 1 }),
        makeN("ucl", "Urine Chloride (mEq/L)", 85, { min: 1, max: 300, step: 1 })
      ],
      table: {
        headers: ["Urine Anion Gap", "Ammonium Excretion", "Primary Diagnosis", "Clinical Pathway"],
        rows: [
          { id: "uagNeg", cols: ["Negative (< 0 mEq/L)", "Intact / Robust (NH₄⁺ > 80 mEq/L)", "GI Bicarbonate Loss (Diarrhea, ileostomy)", "Volume resuscitation and bicarbonate/potassium replacement"] },
          { id: "uagPos", cols: ["Positive (> 0 mEq/L)", "Impaired Renal Excretion", "Renal Tubular Acidosis (Type 1 or Type 4 RTA)", "Nephrology workup: urine pH, serum aldosterone/renin, oral citrate therapy"] }
        ]
      },
      calc: function (v) {
        var uag = (+v.una + +v.uk) - +v.ucl;
        var match = uag < 0 ? "uagNeg" : "uagPos";
        var verdict = uag < 0
          ? "Negative UAG: Intact Ammonium Excretion (Gastrointestinal Loss / Diarrhea)"
          : "Positive UAG: Impaired Urinary Ammonium Excretion (Renal Tubular Acidosis)";

        return {
          value: uag + " mEq/L (" + (uag < 0 ? "Negative" : "Positive") + ")",
          matchId: match,
          eq: "Formula: UAG = (Urine Na + Urine K) − Urine Cl.\nClinical diagnosis: " + verdict
        };
      }
    },

    // ==============================================================
    // 17. TANGRI KIDNEY FAILURE RISK EQUATION (4-VARIABLE KFRE)
    // ==============================================================
    {
      id: "kfre4Var",
      cat: "renal",
      type: "calc",
      name: "Kidney Failure Risk Equation (KFRE — 4-Variable)",
      desc: "Calculates 2-year and 5-year probability of treated kidney failure (dialysis or transplant).",
      organ: "Kidney / Systemic Vasculature",
      region: "CKD Progression",
      subject: "Chronic Kidney Disease / Prognostic Modeling",
      keywords: ["kfre", "tangri", "kidney failure", "dialysis risk", "esrd", "progression", "ckd"],
      guidance: "1. Validated internationally in patients with CKD Stages 3–5 (eGFR <60 mL/min/1.73m²).\n2. Inputs: Age, Sex, eGFR, and Urine Albumin-to-Creatinine Ratio (UACR).\n3. High 2-year risk (>10–20%) guides timely nephrology referral, modality education, and arteriovenous fistula placement.\n4. Identifies fast progressors far more accurately than eGFR alone.",
      contraindications: "Not validated for acute kidney injury or patients already undergoing dialysis.",
      literature: [
        {
          type: "Seminal Multicenter Study",
          icon: "📄",
          title: "Multinational Assessment of Accuracy of Equations for Predicting Risk of Kidney Failure: A Meta-analysis",
          citation: "Tangri N, Grams ME, Levey AS, et al. JAMA. 2016;315(2):164-174.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/26757172/" }]
        }
      ],
      fields: [
        makeN("age", "Age (years)", 62, { min: 18, max: 100, step: 1 }),
        makeS("sex", "Biological Sex", "male", [["male", "Male"], ["female", "Female"]]),
        makeN("egfr", "eGFR (mL/min/1.73m²)", 28, { min: 5, max: 60, step: 1 }),
        makeN("uacr", "Urine Albumin-to-Creatinine Ratio (mg/g)", 450, { min: 10, max: 5000, step: 10 })
      ],
      table: {
        headers: ["2-Year Kidney Failure Risk", "Risk Tier", "Recommended Action"],
        rows: [
          { id: "kfreLow", cols: ["< 5%", "Low Risk", "Manage in primary care / general nephrology with annual monitoring and standard nephroprotection"] },
          { id: "kfreMod", cols: ["5% – 10%", "Intermediate Risk", "Nephrology co-management; monitor eGFR and UACR q3–6 months; maximize SGLT2i/RAASi"] },
          { id: "kfreHigh", cols: ["> 10%", "High Risk of Failure", "Mandatory nephrology care; pre-emptive transplant workup; advance vascular access planning"] }
        ]
      },
      calc: function (v) {
        var age = +v.age, egfr = +v.egfr, uacr = +v.uacr, female = v.sex === "female";
        var logUacr = Math.log(uacr);
        var lp = -0.2201 * (age / 10 - 7.03) + (female ? -0.2467 : 0) - 0.5567 * (egfr / 5 - 7.22) + 0.4510 * (logUacr - 5.137);

        var risk2yr = Math.max(0, Math.min(100, (1 - Math.pow(0.9750, Math.exp(lp))) * 100));
        var risk5yr = Math.max(0, Math.min(100, (1 - Math.pow(0.9240, Math.exp(lp))) * 100));

        var match = risk2yr > 10 ? "kfreHigh" : risk2yr >= 5 ? "kfreMod" : "kfreLow";
        var tier = risk2yr > 10 ? "High 2-Year Risk (>10%)" : risk2yr >= 5 ? "Intermediate Risk" : "Low Progression Risk";

        return {
          value: "2-Yr Risk: " + risk2yr.toFixed(1) + "% | 5-Yr Risk: " + risk5yr.toFixed(1) + "% (" + tier + ")",
          matchId: match,
          eq: "Tangri 4-Variable Model: Predicts end-stage renal disease requiring renal replacement therapy within 2 and 5 years."
        };
      }
    },

    // ==============================================================
    // 18. NEPHROTIC SYNDROME DIAGNOSTIC CLASSIFIER
    // ==============================================================
    {
      id: "nephroticClassifier",
      cat: "renal",
      type: "class",
      name: "Nephrotic Syndrome Diagnostic Classifier",
      desc: "Evaluates triad of nephrotic-range proteinuria, hypoalbuminemia, and peripheral edema.",
      organ: "Glomerular Podocytes / Basement Membrane",
      region: "Glomerulopathy",
      subject: "Glomerular Disease / Nephrotic Syndrome",
      keywords: ["nephrotic", "proteinuria", "albumin", "edema", "hyperlipidemia", "podocyte", "fsgs"],
      guidance: "1. Nephrotic Syndrome classic triad: Heavy proteinuria (>3.5 g/24h or UPCR ≥3.5 g/g), Hypoalbuminemia (<3.0 g/dL), and Peripheral Edema.\n2. Often accompanied by severe hyperlipidemia (elevated LDL, cholesterol) and lipiduria (oval fat bodies, 'Maltese crosses').\n3. Highest risk for thromboembolic events (deep vein thrombosis, renal vein thrombosis) when serum albumin drops <2.0–2.5 g/dL.",
      contraindications: "Distinguish from nephritic syndrome which features active sediment (hematuria, RBC casts) and acute renal failure.",
      literature: [
        {
          type: "Official Clinical Guideline",
          icon: "📘",
          title: "KDIGO 2021 Clinical Practice Guideline for the Management of Glomerular Diseases",
          citation: "Kidney Disease: Improving Global Outcomes (KDIGO) Glomerular Diseases Work Group. Kidney Int. 2021;100(4S):S1-S276.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/34556256/" }]
        }
      ],
      fields: [
        makeN("upcr", "Urine Protein-to-Creatinine Ratio (UPCR, g/g)", 4.2, { min: 0.1, max: 25.0, step: 0.1 }),
        makeN("alb", "Serum Albumin (g/dL)", 2.4, { min: 0.5, max: 5.5, step: 0.1 }),
        makeS("edema", "Peripheral / Periorbital Edema Present?", "1", [["0", "No"], ["1", "Yes"]])
      ],
      table: {
        headers: ["Syndrome Criteria", "Diagnostic Category", "Complication Profile", "Recommended Management"],
        rows: [
          { id: "subNephrotic", cols: ["UPCR < 3.5 g/g", "Sub-nephrotic Proteinuria", "Low thromboembolic risk", "ACEi/ARB or SGLT2i antiproteinuric therapy; monitor renal profile"] },
          { id: "isolatedHeavy", cols: ["UPCR ≥ 3.5 g/g; Albumin ≥ 3.0", "Nephrotic-Range Proteinuria (Isolated)", "Moderate risk", "Rule out secondary focal glomerulosclerosis; initiate nephrology workup"] },
          { id: "fullNephrotic", cols: ["UPCR ≥ 3.5, Alb < 3.0, Edema", "COMPLETE NEPHROTIC SYNDROME", "Severe risk of thrombosis, infection & anasarca", "URGENT RENAL BIOPSY, loop diuretics, statin, consider prophylactic anticoagulation if albumin <2.0"] }
        ]
      },
      calc: function (v) {
        var prot = +v.upcr >= 3.5;
        var hypoalb = +v.alb < 3.0;
        var edema = v.edema === "1";

        var isComplete = prot && hypoalb && edema;
        var match = isComplete ? "fullNephrotic" : prot ? "isolatedHeavy" : "subNephrotic";
        var label = isComplete
          ? "COMPLETE NEPHROTIC SYNDROME (Proteinuria ≥3.5, Albumin <3.0, Edema)"
          : prot
          ? "Isolated Nephrotic-Range Proteinuria"
          : "Sub-nephrotic Proteinuria (<3.5 g/g)";

        return {
          value: label,
          matchId: match,
          eq: "Definition: Proteinuria ≥3.5 g/24h (UPCR ≥3.5), serum albumin <3.0 g/dL, and clinical edema.\nPrompt nephrology evaluation and kidney biopsy."
        };
      }
    },

    // ==============================================================
    // 19. GLOMERULAR DISEASE SEROLOGY & COMPLEMENT (C3/C4)
    // ==============================================================
    {
      id: "complementSerology",
      cat: "renal",
      type: "class",
      name: "Glomerular Disease Serology & Complement Guide",
      desc: "Algorithmic differential diagnosis of acute glomerulonephritis based on C3 and C4 consumption.",
      organ: "Glomerulus / Complement System",
      region: "Immunonephrology",
      subject: "Nephritic Syndrome / Glomerulonephritis",
      keywords: ["complement", "c3", "c4", "lupus", "anca", "psgn", "cryoglobulinemia", "glomerulonephritis"],
      guidance: "1. Low C3 and Low C4 signifies Classical Complement Pathway activation: Systemic Lupus Erythematosus (SLE), Mixed Cryoglobulinemia, Infective Endocarditis, Shunt nephritis.\n2. Low C3 with Normal C4 signifies Alternative Pathway activation: Post-streptococcal GN (PSGN), C3 glomerulopathy / dense deposit disease, atheroembolic disease.\n3. Normal C3 and Normal C4: IgA nephropathy, ANCA-associated vasculitis (GPA, MPA), Anti-GBM (Goodpasture) disease.",
      contraindications: "Does not obviate the need for formal serologies (ANA, dsDNA, ANCA, anti-GBM) and percutaneous renal biopsy.",
      literature: [
        {
          type: "Official Clinical Guideline",
          icon: "📘",
          title: "KDIGO 2021 Clinical Practice Guideline for the Management of Glomerular Diseases",
          citation: "Kidney Int. 2021;100(4S):S1-S276.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/34556256/" }]
        }
      ],
      fields: [
        makeS("c3", "Serum Complement C3 Level", "low", [["low", "Low C3 (consumed)"], ["normal", "Normal C3"]]),
        makeS("c4", "Serum Complement C4 Level", "low", [["low", "Low C4 (consumed)"], ["normal", "Normal C4"]])
      ],
      table: {
        headers: ["Complement Pattern", "Pathway Activated", "Classic Etiologies", "Key Diagnostic Tests"],
        rows: [
          { id: "bothLow", cols: ["Low C3 & Low C4", "Classical Pathway", "Lupus Nephritis, Cryoglobulinemia, Subacute Bacterial Endocarditis", "ANA, anti-dsDNA, rheumatoid factor, cryoglobulins, blood cultures, echo"] },
          { id: "c3LowOnly", cols: ["Low C3 + Normal C4", "Alternative Pathway", "Post-streptococcal GN, C3 Glomerulopathy (DDD), Atheroembolism", "ASO titer, anti-DNase B, C3 nephritic factor (C3NeF)"] },
          { id: "bothNormal", cols: ["Normal C3 & C4", "Non-complement / Pauci-immune", "ANCA Vasculitis (GPA/MPA), IgA Nephropathy, Anti-GBM Disease", "p-ANCA (MPO), c-ANCA (PR3), Anti-GBM antibody titer"] }
        ]
      },
      calc: function (v) {
        var match = "bothNormal", ddx = "Normal C3 & C4 (Pauci-immune / IgA / Anti-GBM)";

        if (v.c3 === "low" && v.c4 === "low") {
          match = "bothLow";
          ddx = "Classical Pathway Consumption: Lupus Nephritis, Cryoglobulinemia, Endocarditis";
        } else if (v.c3 === "low" && v.c4 === "normal") {
          match = "c3LowOnly";
          ddx = "Alternative Pathway Activation: Post-streptococcal GN, C3 Glomerulopathy";
        }

        return {
          value: ddx,
          matchId: match,
          eq: "Serum complement profile establishes the primary laboratory branch point in acute nephritic syndrome workup."
        };
      }
    },

    // ==============================================================
    // 20. CALCIUM-PHOSPHATE PRODUCT IN CKD-MBD
    // ==============================================================
    {
      id: "caPhosProduct",
      cat: "renal",
      type: "calc",
      name: "Calcium–Phosphate Product (Ca × Pi)",
      desc: "Evaluates risk of vascular calcification, soft tissue deposition, and calciphylaxis.",
      organ: "Vascular Smooth Muscle / Bone / Parathyroid",
      region: "Mineral & Bone Disorder (MBD)",
      subject: "CKD-MBD / Dialysis Complications",
      keywords: ["calcium", "phosphate", "ca x p", "calciphylaxis", "vascular calcification", "ckd-mbd"],
      guidance: "1. Formula: Total Serum Calcium (mg/dL) × Serum Phosphate (mg/dL).\n2. Maintain Ca × P product < 55 mg²/dL² in advanced CKD Stages 4–5 and ESRD.\n3. Product > 55 mg²/dL² exponentially increases risk of vascular media calcification, calcific uremic arteriolopathy (calciphylaxis), and cardiovascular death.\n4. Treat with non-calcium-based phosphate binders (sevelamer, lanthanum) and calcimimetics if elevated.",
      contraindications: "Does not measure ionized calcium; severely abnormal albumin levels may distort total calcium.",
      literature: [
        {
          type: "Official Clinical Guideline",
          icon: "📘",
          title: "KDIGO Clinical Practice Guideline for Diagnosis, Evaluation, Prevention, and Treatment of Chronic Kidney Disease-Mineral and Bone Disorder (CKD-MBD)",
          citation: "Kidney Disease: Improving Global Outcomes (KDIGO) CKD-MBD Work Group. Kidney Int Suppl. 2009;(113):S1-S130.",
          links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/19644521/" }]
        }
      ],
      fields: [
        makeN("ca", "Total Serum Calcium (mg/dL)", 9.2, { min: 4.0, max: 20.0, step: 0.1 }),
        makeN("phos", "Serum Phosphate (mg/dL)", 6.2, { min: 1.0, max: 20.0, step: 0.1 })
      ],
      table: {
        headers: ["Product (mg²/dL²)", "Metastatic Calcification Risk", "Cardiovascular Impact", "Therapeutic Action"],
        rows: [
          { id: "capSafe", cols: ["≤ 55", "Desirable / Controlled", "Standard baseline risk in CKD", "Maintain dietary phosphate restrictions and current binder regimen"] },
          { id: "capHigh", cols: ["> 55", "ELEVATED RISK", "High risk of coronary calcification & calciphylaxis", "Aggressive phosphate control: switch to non-calcium phosphate binders, optimize dialysis clearance"] }
        ]
      },
      calc: function (v) {
        var prod = +v.ca * +v.phos;
        var match = prod > 55 ? "capHigh" : "capSafe";
        var status = prod > 55 ? "Elevated (>55 mg²/dL²; High Calcification Risk)" : "Controlled (≤55 mg²/dL²)";

        return {
          value: prod.toFixed(1) + " mg²/dL² (" + status + ")",
          matchId: match,
          eq: "Formula: Calcium (mg/dL) × Phosphate (mg/dL).\nKDIGO clinical target: maintain product below 55 mg²/dL²."
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
      if (window.categories[i] && window.categories[i].id === renalCategory.id) {
        catExists = true;
        break;
      }
    }
    if (!catExists) {
      window.categories.push(renalCategory);
    }

    // 2. Safely add tools
    renalTools.forEach(function (tool) {
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
      window.SYNONYM_MAP["renal"] = ["renal", "nephrology", "kidney", "gfr", "egfr", "aki", "ckd", "dialysis", "acid-base", "electrolytes"];
      window.SYNONYM_MAP["egfr"] = ["egfr", "gfr", "ckd-epi", "cystatin", "cockcroft", "crcl", "schwartz", "clearance"];
      window.SYNONYM_MAP["aki"] = ["aki", "kdigo", "fena", "feurea", "atn", "prerenal", "azotemia", "oliguria"];
      window.SYNONYM_MAP["dialysis"] = ["dialysis", "hemodialysis", "rrt", "aeiou", "urr", "kt/v", "daugirdas", "ufr", "ultrafiltration"];
      window.SYNONYM_MAP["acidbase"] = ["anion gap", "winters", "acidosis", "uag", "bicarbonate", "paco2", "hagma", "nagma"];
      window.SYNONYM_MAP["glomerulus"] = ["nephrotic", "nephritic", "complement", "c3", "c4", "lupus", "proteinuria", "hematuria"];
    }

    // 4. Force repaint if the HTML engine has already initialized
    if (typeof window.renderHome === "function") {
      window.renderHome();
    }
  } catch (err) {
    console.error("Critical error registering Renal tools:", err);
  }
})();
