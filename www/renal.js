// renal.js
(function () {
  window.MedCalcModules = window.MedCalcModules || [];

  const category = {
    id: "renal",
    name: "Nephrology & Renal",
    icon: "🫘",
    desc: "Kidney function, AKI, acid-base, dialysis, electrolytes, and CKD progression"
  };

  const guidance = {
    // A. Kidney Function and CKD
    ckdEpi2021: [
      "CKD-EPI 2021 refit equation estimates GFR without a race modifier. Recommended by KDIGO and ASN/NKF.",
      "Primary standard for chronic kidney disease staging and drug dose titration in adults."
    ],
    ckdEpiCysC: [
      "Combined Creatinine–Cystatin C CKD-EPI equation provides greater accuracy when creatinine-based eGFR is borderline or muscle mass is abnormal.",
      "Confirmatory testing in CKD staging (eGFR 45–59 mL/min/1.73m² with negative albuminuria) or extremes of body habitus."
    ],
    cockcroftGault: [
      "Estimates Creatinine Clearance (CrCl in mL/min). Still widely cited in FDA drug labeling for dose adjustments.",
      "Pharmacokinetic dosing calculator. Note: overestimates true GFR due to tubular creatinine secretion."
    ],
    schwartzPed: [
      "Bedside Schwartz equation: eGFR = 0.413 × Height (cm) ÷ Serum Creatinine (mg/dL).",
      "Standard validated eGFR estimator for children and adolescents aged 1 to 18 years."
    ],
    ckdStaging: [
      "KDIGO GFR Stages: G1 (≥90), G2 (60–89), G3a (45–59), G3b (30–44), G4 (15–29), G5 (<15 mL/min/1.73m²).",
      "Defines stage and severity of established chronic kidney disease."
    ],
    albuminuriaStaging: [
      "Albuminuria Stages: A1 (<30 mg/g; normal to mildly increased), A2 (30–300 mg/g; moderately increased), A3 (>300 mg/g; severely increased).",
      "Independent predictor of CKD progression, cardiovascular mortality, and heart failure."
    ],
    ckdHeatmap: [
      "Combines GFR stage (G1–G5) and Albuminuria stage (A1–A3) into the KDIGO prognostic risk grid (Green: low risk, Yellow: moderate, Orange: high, Red: very high).",
      "Guides referral thresholds, monitoring frequency, and RAAS/SGLT2 inhibitor therapy."
    ],
    uacrCalc: [
      "UACR = (Urine Albumin [mg/dL] ÷ Urine Creatinine [mg/dL]) × 1000 = mg albumin per gram of creatinine.",
      "First-line screening and quantification test for glomerular injury and diabetic nephropathy."
    ],
    upcrCalc: [
      "UPCR = (Urine Protein [mg/dL] ÷ Urine Creatinine [mg/dL]) = g protein per gram of creatinine (roughly equals 24-hr urine protein in grams).",
      "Evaluates total urinary protein excretion (glomerular, tubular, and overflow paraproteins)."
    ],
    fenaCalc: [
      "FENa = (UNa × SCr) ÷ (SNa × UCr) × 100%. <1% suggests prerenal azotemia; >2% suggests intrinsic renal injury (e.g., ATN).",
      "Distinguishes prerenal azotemia from acute tubular necrosis. Invalidated by loop diuretics."
    ],
    feUreaCalc: [
      "FEUrea = (UUrea × SCr) ÷ (BUN × UCr) × 100%. <35% suggests prerenal azotemia; >50% suggests intrinsic renal injury / ATN.",
      "Preferred over FENa when patient has recently received loop diuretics."
    ],

    // B. Acute Kidney Injury (AKI)
    kdigoAki: [
      "KDIGO AKI: Stage 1 (SCr 1.5–1.9× baseline or increase ≥0.3 mg/dL, or UO <0.5 mL/kg/h for 6–12h); Stage 2 (SCr 2.0–2.9× baseline or UO <0.5 mL/kg/h for ≥12h); Stage 3 (SCr 3.0× baseline or ≥4.0 mg/dL, initiation of RRT, or anuria ≥12h).",
      "International consensus criteria for diagnosing and staging acute kidney injury."
    ],
    akinRifleRef: [
      "Compares historic RIFLE (Risk, Injury, Failure, Loss, ESRD) and AKIN criteria with modern KDIGO staging.",
      "Reference guide for comparing epidemiological and clinical trial definitions."
    ],
    uoKgHr: [
      "Urine Output Rate = Volume (mL) ÷ Weight (kg) ÷ Elapsed Time (hours). Oliguria is defined as <0.5 mL/kg/h for ≥6 hours.",
      "Monitors real-time renal perfusion, shock resuscitation, and acute kidney injury."
    ],
    crChangeRatio: [
      "Calculates absolute change (ΔCr) and ratio (Current Cr ÷ Baseline Cr) to determine KDIGO stage eligibility.",
      "Rapid screening for acute rise over baseline kidney function."
    ],
    fluidBalanceCalc: [
      "Fluid Balance = Total Intake (IV fluids, blood, oral, flushes) − Total Output (urine, drains, stool, ultrafiltration).",
      "Critical daily monitoring metric for resuscitation and fluid de-escalation."
    ],
    fluidOverloadPct: [
      "Cumulative Fluid Overload % = [Cumulative Net Fluid Balance (L) ÷ Baseline Admission Weight (kg)] × 100%. Values ≥10% denote severe fluid overload.",
      "Strong independent predictor of mortality, prolonged mechanical ventilation, and RRT requirement in ICU."
    ],

    // C. Electrolytes and Acid-Base
    corrSodium: [
      "Corrected Na = Measured Na + 0.016 × (Glucose − 100) (Katz formula) or + 0.02 × (Glucose − 100) (Hillier formula).",
      "Corrects for osmotic water shifting from intracellular to extracellular space in hyperglycemia."
    ],
    freeWaterDeficit: [
      "Free Water Deficit = Total Body Water × [(Serum Na ÷ 140) − 1]. TBW = Weight (kg) × factor (0.6 men, 0.5 women, 0.5 elderly men, 0.45 elderly women).",
      "Guides rehydration rate in hypernatremia to prevent cerebral edema (target lowering ≤8–10 mmol/L per 24h)."
    ],
    sodiumDeficit: [
      "Sodium Deficit (mmol) = TBW × (Target Na − Current Na). Maximum safe correction rate is typically 6–8 mmol/L in 24 hours.",
      "Calculates hypertonic saline requirements for symptomatic acute hyponatremia."
    ],
    kDeficitEst: [
      "Every 0.3 mEq/L drop in serum K below 4.0 mEq/L corresponds to an approximate total body potassium deficit of 100 mEq.",
      "Rough estimate of potassium replacement requirements; depends on cellular shifts and acid-base status."
    ],
    anionGap: [
      "Serum Anion Gap = Na − (Cl + HCO₃). Normal range is typically 8–12 mEq/L.",
      "Differentiates high anion gap metabolic acidosis (HAGMA) from normal anion gap (hyperchloremic) acidosis."
    ],
    corrAnionGap: [
      "Albumin-Corrected Anion Gap = Measured AG + 2.5 × (4.0 − Serum Albumin [g/dL]).",
      "Prevents false-negative anion gaps in hypoalbuminemic critically ill patients."
    ],
    deltaRatio: [
      "Delta Ratio = (Measured AG − 12) ÷ (24 − Measured HCO₃). <0.4: mixed NAGMA + HAGMA; 0.8–1.2: pure HAGMA; >2.0: concurrent metabolic alkalosis or pre-existing high HCO₃.",
      "Diagnoses complex mixed acid-base disorders."
    ],
    wintersFormula: [
      "Winter's Formula: Expected PaCO₂ = (1.5 × HCO₃) + 8 ± 2. If actual PaCO₂ > expected, concurrent respiratory acidosis exists; if lower, concurrent respiratory alkalosis exists.",
      "Determines adequacy of respiratory compensation in metabolic acidosis."
    ],
    serumOsmolality: [
      "Calculated Osmolality = 2×Na + (Glucose ÷ 18) + (BUN ÷ 2.8). Normal range is 275–295 mOsm/kg.",
      "Estimates total dissolved solutes in serum."
    ],
    osmolarGap: [
      "Osmolar Gap = Measured Osmolality − Calculated Osmolality. A gap >10 mOsm/kg suggests the presence of unmeasured toxic alcohols (toxic alcohols: methanol, ethylene glycol, toxic glycols).",
      "First-line toxicology and nephrology screen for toxic alcohol ingestion."
    ],
    corrCalcium: [
      "Corrected Calcium = Measured Total Calcium (mg/dL) + 0.8 × (4.0 − Serum Albumin [g/dL]).",
      "Adjusts total calcium for changes in protein binding."
    ],
    caPhosProduct: [
      "Calcium–Phosphate Product = Total Calcium (mg/dL) × Serum Phosphate (mg/dL). Values >55 mg²/dL² increase risk of metastatic tissue calcification and calciphylaxis.",
      "Mineral and bone disorder (MBD) monitoring parameter in advanced CKD and dialysis."
    ],

    // D. Dialysis and Renal Replacement Therapy
    aeiouDialysis: [
      "Standard emergency checklist for acute hemodialysis: Acidosis (refractory pH <7.15), Electrolytes (refractory K >6.5), Ingestion (toxic alcohols, lithium, salicylates), Overload (refractory pulmonary edema), Uremia (pericarditis, encephalopathy, neuropathy).",
      "Immediate bedside evaluation for urgent renal replacement therapy."
    ],
    urrCalc: [
      "Urea Reduction Ratio (URR) = [(Pre-BUN − Post-BUN) ÷ Pre-BUN] × 100%. Target minimum is ≥65% (corresponds to single-pool Kt/V ~1.2).",
      "Hemodialysis clearance adequacy index."
    ],
    ktvDaugirdas: [
      "Daugirdas 2nd generation single-pool Kt/V: −ln(R − 0.008×t) + (4 − 3.5×R) × (UF / W). Minimum target: 1.2 per session (recommended 1.4).",
      "Gold-standard fractional urea clearance index for thrice-weekly hemodialysis prescription."
    ],
    idwgCalc: [
      "Interdialytic Weight Gain (IDWG) = Pre-dialysis Weight − Previous Post-dialysis Dry Weight. Target is typically <4–4.5% of dry weight.",
      "Prevents aggressive ultrafiltration rates and excessive intradialytic hypotension."
    ],
    ufrCalc: [
      "Ultrafiltration Rate = [Fluid Removed (mL) ÷ Session Time (hr)] ÷ Post-Dialysis Weight (kg). Rates >13 mL/kg/h are associated with myocardial stunning and increased cardiovascular mortality.",
      "Assesses intradialytic cardiovascular safety."
    ],
    crrtEffluent: [
      "CRRT Effluent Dose (mL/kg/h) = Total Effluent Flow (Dialysate + Replacement + Net UF [mL/h]) ÷ Patient Weight (kg). KDIGO recommended delivered dose is 20–25 mL/kg/h (prescribe 25–30 mL/kg/h to account for downtime).",
      "Guides continuous renal replacement therapy intensity in septic shock and acute kidney injury."
    ],

    // E. Urine Studies and Renal Interpretation
    urineAnionGap: [
      "Urine Anion Gap = UNa + UK − UCl. Negative gap (typically <−10 mEq/L) reflects intact renal ammonium excretion (e.g., diarrhea). Positive gap reflects impaired NH₄⁺ excretion (e.g., Renal Tubular Acidosis).",
      "Distinguishes GI bicarbonate loss from renal tubular acidosis in normal anion gap metabolic acidosis."
    ],
    urineOsmolality: [
      "Interprets urine osmolality in polyuria: <100–150 mOsm/kg indicates water diuresis (primary polydipsia, diabetes insipidus); >300 mOsm/kg indicates solute/osmotic diuresis (glucose, urea, mannitol).",
      "Evaluates concentrating capacity and polyuric disorders."
    ],
    hematuriaChecklist: [
      "Systematic workup for microscopic or gross hematuria: dysmorphic RBCs/casts (glomerular) vs isomorphic RBCs/clots (urological).",
      "Guides nephrology referral vs urological cystoscopy and CT urography."
    ],

    // F. Glomerular Disease and Nephrotic Syndrome
    nephroticClassifier: [
      "Classifies proteinuria: Nephrotic syndrome requires proteinuria >3.5 g/24h (or UPCR >3.5), serum albumin <3.0 g/dL, edema, and hyperlipidemia.",
      "Differentiates pure nephrotic syndrome from nephritic syndrome and isolated proteinuria."
    ],
    nephriticChecklist: [
      "Nephritic syndrome triad: active urinary sediment (dysmorphic red cells, red cell casts), hypertension, and acute kidney injury / oliguria.",
      "Prompts emergent evaluation for rapidly progressive glomerulonephritis (RPGN)."
    ],
    lupusNephritisRef: [
      "ISN/RPS classification: Class I (Minimal mesangial), II (Mesangial proliferative), III (Focal ≤50%), IV (Diffuse >50%), V (Membranous), VI (Advanced sclerotic).",
      "Guides immunosuppressive induction and maintenance protocols in systemic lupus erythematosus."
    ],
    complementSerology: [
      "Classifies glomerular disease by complement C3/C4 levels: Low C3/C4 (Lupus, Post-streptococcal, Cryoglobulinemia, MPGN/dense deposit) vs Normal complement (IgA nephropathy, ANCA vasculitis, Anti-GBM).",
      "Essential diagnostic branch point in acute nephritic syndrome workup."
    ],

    // G. CKD Progression and Kidney Failure Risk
    kfre4Var: [
      "Tangri 4-Variable Kidney Failure Risk Equation (KFRE) calculates 2-year and 5-year risk of progression to kidney failure requiring dialysis or transplant based on Age, Sex, eGFR, and UACR.",
      "Guides timely nephrology referral, vascular access planning, and kidney transplant education."
    ],

    // H. Transplant and Dialysis-Related Assessment
    txReferralCheck: [
      "Evaluates criteria for kidney transplant evaluation: CKD Stage 4/5 with eGFR ≤20 mL/min/1.73m² or established maintenance dialysis.",
      "Prompts timely pre-emptive transplant workup before dialysis initiation."
    ],
    accessRecirc: [
      "Access Recirculation % = [(Peripheral Blood Urea − Arterial Port Urea) ÷ (Peripheral Blood Urea − Venous Port Urea)] × 100%. Values >10% indicate significant stenosis or reversed access lines.",
      "Identifies arteriovenous fistula or graft inflow/outflow dysfunction."
    ],

    // I. Renal Complications and Medication Safety
    ironStudiesCkd: [
      "Evaluates transferrin saturation (TSAT %) and ferritin in CKD. KDIGO targets for initiating erythropoiesis-stimulating agents (ESA): TSAT ≤30% and Ferritin ≤500 ng/mL.",
      "Guides iron supplementation and ESA administration in CKD anemia."
    ],
    contrastAkiCheck: [
      "Checklist of major risk factors for contrast-associated AKI: baseline eGFR <30 mL/min, diabetes with eGFR <45, dehydration, hypotension, and high contrast volume.",
      "Guides isotonic bicarbonate/saline prophylaxis and contrast-volume thresholds."
    ]
  };

  const tools = [
    // ==========================================
    // A. KIDNEY FUNCTION AND CKD
    // ==========================================
    {
      id: "ckdEpi2021",
      cat: "renal",
      subcat: "Kidney Function and CKD",
      name: "eGFR — CKD-EPI 2021 Creatinine Equation",
      desc: "Standard race-free 2021 equation recommended by KDIGO and ASN/NKF.",
      fields: [
        N("scr", "Serum Creatinine (mg/dL)", 1.2, { min: 0.2, max: 25.0, step: 0.05 }),
        N("age", "Age (years)", 58, { min: 18, max: 120 }),
        S("sex", "Sex", "male", [["male", "Male"], ["female", "Female"]])
      ],
      calc: v => {
        const scr = +v.scr, age = +v.age, female = v.sex === "female";
        const kappa = female ? 0.7 : 0.9;
        const alpha = female ? -0.241 : -0.302;
        const minVal = Math.min(scr / kappa, 1);
        const maxVal = Math.max(scr / kappa, 1);
        const genderMultiplier = female ? 1.012 : 1.0;

        const egfr = 142 * Math.pow(minVal, alpha) * Math.pow(maxVal, -1.200) * Math.pow(0.9938, age) * genderMultiplier;
        let stage = egfr >= 90 ? "G1 (Normal/high)" : egfr >= 60 ? "G2 (Mildly decreased)" : egfr >= 45 ? "G3a (Mild-to-moderate decrease)" : egfr >= 30 ? "G3b (Moderate-to-severe decrease)" : egfr >= 15 ? "G4 (Severely decreased)" : "G5 (Kidney failure)";
        
        let guidanceText = "";
        if (egfr >= 90) {
          guidanceText = "Normal or high GFR. If markers of kidney damage (e.g., albuminuria) are present, evaluate for early CKD. Otherwise, standard age-related monitoring.";
        } else if (egfr >= 60) {
          guidanceText = "Mildly decreased GFR. Evaluate for other markers of kidney damage. Monitor renal function and proteinuria annually.";
        } else if (egfr >= 30) {
          guidanceText = "Moderate decrease in GFR (Stage G3). Typically associated with complications of CKD (e.g., anemia, bone mineral disorders). Nephrology consultation and comagement recommended, optimize blood pressure and glycemic control, use ACEi/ARB if albuminuric.";
        } else if (egfr >= 15) {
          guidanceText = "Severe decrease in GFR (Stage G4). Prepare for renal replacement therapy options (dialysis modalities, kidney transplantation). Nephrology referral essential.";
        } else {
          guidanceText = "Kidney failure (Stage G5). Immediate preparation for or initiation of renal replacement therapy (dialysis or urgent transplant evaluation) unless palliative care is chosen.";
        }

        return {
          value: Math.round(egfr) + " mL/min/1.73m² (" + stage + ")",
          eq: "CKD-EPI 2021 refit without race variable: 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^-1.200 × 0.9938^Age [× 1.012 if female].",
          guidance: guidanceText,
          references: "Inker LA, Eneanya ND, Coresh J, et al. New Creatinine- and Cystatin C-Based Equations to Estimate GFR without Race. N Engl J Med. 2021;385(19):1737-1749."
        };
      }
    },
    {
      id: "ckdEpiCysC",
      cat: "renal",
      subcat: "Kidney Function and CKD",
      name: "eGFR — Combined Creatinine–Cystatin C (2021)",
      desc: "Confirmatory equation combining both markers without race modifier.",
      fields: [
        N("scr", "Serum Creatinine (mg/dL)", 1.2, { min: 0.2, max: 25.0, step: 0.05 }),
        N("cysc", "Serum Cystatin C (mg/L)", 1.1, { min: 0.2, max: 15.0, step: 0.05 }),
        N("age", "Age (years)", 58, { min: 18, max: 120 }),
        S("sex", "Sex", "male", [["male", "Male"], ["female", "Female"]])
      ],
      calc: v => {
        const scr = +v.scr, cysc = +v.cysc, age = +v.age, female = v.sex === "female";
        const kappa = female ? 0.7 : 0.9;
        const alpha = female ? -0.219 : -0.144;
        const minScr = Math.min(scr / kappa, 1);
        const maxScr = Math.max(scr / kappa, 1);
        const minCys = Math.min(cysc / 0.8, 1);
        const maxCys = Math.max(cysc / 0.8, 1);
        const genderMult = female ? 0.963 : 1.0;

        const egfr = 135 * Math.pow(minScr, alpha) * Math.pow(maxScr, -0.544) * Math.pow(minCys, -0.323) * Math.pow(maxCys, -0.778) * Math.pow(0.9961, age) * genderMult;
        
        let guidanceText = egfr >= 60 
          ? "Normal to mildly reduced combined eGFR. Reassuring when creatinine alone was borderline."
          : egfr >= 30 
          ? "Moderate reduction in combined eGFR. Confirms CKD stages G3a-G3b; use for precise staging and risk stratification."
          : "Severe reduction in combined eGFR (Stages G4-G5). Prompt nephrology evaluation and preparation for renal replacement therapy.";

        return {
          value: Math.round(egfr) + " mL/min/1.73m²",
          eq: "CKD-EPI 2021 Creatinine-Cystatin C equation. More precise than creatinine alone at eGFR 45–59 mL/min/1.73m².",
          guidance: guidanceText,
          references: "Inker LA, Eneanya ND, Coresh J, et al. New Creatinine- and Cystatin C-Based Equations to Estimate GFR without Race. N Engl J Med. 2021;385(19):1737-1749."
        };
      }
    },
    {
      id: "cockcroftGault",
      cat: "renal",
      subcat: "Kidney Function and CKD",
      name: "Cockcroft–Gault Creatinine Clearance",
      desc: "Estimates CrCl in mL/min for pharmacological dosing adjustments.",
      fields: [
        N("age", "Age (years)", 62, { min: 18, max: 110 }),
        N("weight", "Actual Weight (kg)", 72, { min: 20, max: 300 }),
        N("scr", "Serum Creatinine (mg/dL)", 1.3, { min: 0.2, max: 20.0, step: 0.05 }),
        S("sex", "Sex", "male", [["male", "Male (1.0)"], ["female", "Female (0.85)"]])
      ],
      calc: v => {
        const mult = v.sex === "female" ? 0.85 : 1.0;
        const crcl = ((140 - +v.age) * +v.weight) / (72 * +v.scr) * mult;
        
        let guidanceText = crcl >= 90
          ? "Normal creatinine clearance. Standard drug dosing is typically appropriate unless specific organ toxicities dictate otherwise."
          : crcl >= 50
          ? "Mildly reduced clearance. Review medications cleared renally; minor dosage adjustments may be required for narrow therapeutic index drugs."
          : crcl >= 10
          ? "Moderate-to-severe reduction in clearance. Significant dosage reductions or extended dosing intervals are generally required for renally excreted medications."
          : "Severely impaired clearance. Most renally cleared medications require major dose adjustments or contraindication review.";

        return {
          value: Math.round(crcl) + " mL/min",
          eq: "Cockcroft-Gault: [(140 − Age) × Weight (kg)] ÷ (72 × SCr [mg/dL]) [× 0.85 if female]. Note: Estimates clearance, not GFR.",
          guidance: guidanceText,
          references: "Cockcroft DW, Gault MH. Prediction of creatinine clearance from serum creatinine. Nephron. 1976;16(1):31-41."
        };
      }
    },
    {
      id: "schwartzPed",
      cat: "renal",
      subcat: "Kidney Function and CKD",
      name: "Schwartz Equation (Pediatric eGFR)",
      desc: "Bedside Schwartz formula for children and adolescents aged 1–18 years.",
      fields: [
        N("height", "Height (cm)", 125, { min: 40, max: 220, step: 0.5 }),
        N("scr", "Serum Creatinine (mg/dL)", 0.6, { min: 0.1, max: 15.0, step: 0.05 })
      ],
      calc: v => {
        const egfr = (0.413 * +v.height) / +v.scr;
        
        let guidanceText = egfr >= 90
          ? "Normal pediatric GFR. Normal renal function; monitor routinely."
          : egfr >= 60
          ? "Mildly decreased pediatric GFR. Pediatric nephrology consultation if accompanied by structural abnormalities or proteinuria."
          : "Abnormal/decreased pediatric GFR (<60 mL/min/1.73m²). Pediatric nephrology referral required for management of growth retardation, electrolyte imbalance, and CKD progression.";

        return {
          value: Math.round(egfr) + " mL/min/1.73m²",
          eq: "Bedside Schwartz: eGFR = 0.413 × Height (cm) ÷ Serum Creatinine (mg/dL). Validated for IDMS-traceable enzymatic assays.",
          guidance: guidanceText,
          references: "Schwartz GJ, Muñoz A, Schneider MF, et al. New equations to estimate GFR in children with CKD. J Am Soc Nephrol. 2009;20(3):629-637."
        };
      }
    },
    {
      id: "ckdStaging",
      cat: "renal",
      subcat: "Kidney Function and CKD",
      name: "CKD Staging: G1–G5",
      desc: "KDIGO classification of chronic kidney disease by GFR tier.",
      fields: [
        N("gfr", "eGFR (mL/min/1.73m²)", 42, { min: 1, max: 180, step: 1 })
      ],
      calc: v => {
        const g = +v.gfr;
        let c = g >= 90 ? "Stage G1 — Normal or high GFR (≥90)" : g >= 60 ? "Stage G2 — Mildly decreased (60–89)" : g >= 45 ? "Stage G3a — Mildly to moderately decreased (45–59)" : g >= 30 ? "Stage G3b — Moderately to severely decreased (30–44)" : g >= 15 ? "Stage G4 — Severely decreased (15–29)" : "Stage G5 — Kidney failure (<15)";
        
        let guidanceText = "";
        if (g >= 60) {
          guidanceText = "Stages G1-G2: CKD diagnosis requires structural or functional markers of kidney damage persisting for ≥3 months. Focus on cardiovascular risk reduction and treating underlying etiology.";
        } else if (g >= 30) {
          guidanceText = "Stages G3a-G3b: Moderate CKD. Monitor for secondary complications (anemia, secondary hyperparathyroidism, metabolic acidosis). Implement nephroprotection (BP control, RAS inhibition, SGLT2i).";
        } else {
          guidanceText = "Stages G4-G5: Advanced CKD. Prepare for renal replacement therapy, evaluate for kidney transplantation, create vascular access plans, and manage advanced metabolic disturbances.";
        }

        return {
          value: c,
          eq: "KDIGO GFR categories. Diagnosis of CKD also requires ≥3 months duration and/or evidence of kidney damage.",
          guidance: guidanceText,
          references: "KDIGO 2012 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease. Kidney Int Suppl. 2013;3(1):1-150."
        };
      }
    },
    {
      id: "albuminuriaStaging",
      cat: "renal",
      subcat: "Kidney Function and CKD",
      name: "Albuminuria Staging: A1–A3",
      desc: "KDIGO categorization of persistent albuminuria.",
      fields: [
        N("uacr", "Urine Albumin-to-Creatinine Ratio (mg/g)", 120, { min: 1, max: 8000, step: 1 })
      ],
      calc: v => {
        const u = +v.uacr;
        let s = u < 30 ? "Stage A1: Normal to mildly increased (<30 mg/g)" : u <= 300 ? "Stage A2: Moderately increased (30–300 mg/g)" : "Stage A3: Severely increased (>300 mg/g; includes nephrotic range if >2200 mg/g)";
        
        let guidanceText = u < 30 
          ? "Normal or mild albuminuria. Standard follow-up."
          : u <= 300 
          ? "Moderately increased albuminuria (microalbuminuria). Indicates early glomerular injury, diabetic nephropathy, or endothelial dysfunction. Initiate or optimize RAS inhibitors (ACEi/ARB) and SGLT2 inhibitors."
          : "Severely increased albuminuria (macroalbuminuria / nephrotic range). High risk of progressive renal decline and cardiovascular events. Aggressive blood pressure control, maximum tolerated RAS blockade, and nephrology co-management recommended.";

        return {
          value: s,
          eq: "KDIGO Albuminuria categories: A1 (<30 mg/g), A2 (30–300 mg/g), A3 (>300 mg/g).",
          guidance: guidanceText,
          references: "KDIGO 2012 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease. Kidney Int Suppl. 2013;3(1):1-150."
        };
      }
    },
    {
      id: "ckdHeatmap",
      cat: "renal",
      subcat: "Kidney Function and CKD",
      name: "CKD Risk Classification Grid (KDIGO Heatmap)",
      desc: "Prognostic risk matrix combining GFR and Albuminuria stages.",
      fields: [
        S("gfr_cat", "GFR Category", "g3a", [
          ["g1", "G1 (≥90 mL/min/1.73m²)"],
          ["g2", "G2 (60–89 mL/min/1.73m²)"],
          ["g3a", "G3a (45–59 mL/min/1.73m²)"],
          ["g3b", "G3b (30–44 mL/min/1.73m²)"],
          ["g4", "G4 (15–29 mL/min/1.73m²)"],
          ["g5", "G5 (<15 mL/min/1.73m²)"]
        ]),
        S("alb_cat", "Albuminuria Category", "a2", [
          ["a1", "A1 (<30 mg/g; Normal / Mild)"],
          ["a2", "A2 (30–300 mg/g; Moderate)"],
          ["a3", "A3 (>300 mg/g; Severe)"]
        ])
      ],
      calc: v => {
        const g = v.gfr_cat, a = v.alb_cat;
        let risk = "Low risk (Green)";
        let guidanceText = "";
        
        if (g === "g5" || g === "g4" || (g === "g3b" && a !== "a1") || (g === "g3a" && a === "a3")) {
          risk = "Very High Risk (Red) — Recommend nephrology referral and close monitoring (≥3–4x/year)";
          guidanceText = "Very high risk of progression, cardiovascular events, and mortality. Immediate nephrology referral, frequent monitoring, comprehensive risk factor modification, and preparation for renal replacement therapy.";
        } else if ((g === "g3b" && a === "a1") || (g === "g3a" && a === "a2") || ((g === "g1" || g === "g2") && a === "a3")) {
          risk = "High Risk (Orange) — Nephrology co-management recommended (monitoring ≥2x/year)";
          guidanceText = "High risk of CKD progression and adverse outcomes. Nephrology consultation advised, rigorous blood pressure and glycemic targets, maximize nephroprotective medical therapy.";
        } else if ((g === "g3a" && a === "a1") || ((g === "g1" || g === "g2") && a === "a2")) {
          risk = "Moderate Risk (Yellow) — Annual monitoring recommended";
          guidanceText = "Moderate risk. Monitor GFR and albuminuria at least annually. Treat underlying drivers (diabetes, hypertension) and initiate protective therapies.";
        } else {
          guidanceText = "Low risk of CKD progression. Standard primary care follow-up and lifestyle counseling.";
        }

        return {
          value: risk,
          eq: "KDIGO prognosis grid: Combines GFR and Albuminuria to determine risks of CKD progression, all-cause mortality, and CV events.",
          guidance: guidanceText,
          references: "KDIGO 2012 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease. Kidney Int Suppl. 2013;3(1):1-150."
        };
      }
    },
    {
      id: "uacrCalc",
      cat: "renal",
      subcat: "Kidney Function and CKD",
      name: "Urine Albumin-to-Creatinine Ratio (UACR)",
      desc: "Calculates UACR in mg/g from spot urine albumin and creatinine.",
      fields: [
        N("ualb", "Spot Urine Albumin (mg/dL)", 4.5, { min: 0.1, max: 1000, step: 0.1 }),
        N("ucr", "Spot Urine Creatinine (mg/dL)", 120, { min: 5, max: 800, step: 1 })
      ],
      calc: v => {
        const uacr = (+v.ualb / +v.ucr) * 1000;
        let c = uacr < 30 ? "A1: Normal/mild (<30 mg/g)" : uacr <= 300 ? "A2: Microalbuminuria (30–300 mg/g)" : "A3: Severely increased (>300 mg/g)";
        
        let guidanceText = uacr < 30 
          ? "Normal urine albumin excretion. No evidence of significant glomerular filtration barrier leakage."
          : uacr <= 300 
          ? "Microalbuminuria. Early marker of diabetic kidney disease or vascular injury. Start ACEi or ARB and control blood pressure/glucose."
          : "Macroalbuminuria. Significant glomerular permselectivity loss. Nephrology input, rigorous blood pressure control, and optimized guideline-directed medical therapy recommended.";

        return {
          value: Math.round(uacr) + " mg/g creatinine — " + c,
          eq: "UACR (mg/g) = (Urine Albumin [mg/dL] ÷ Urine Creatinine [mg/dL]) × 1000.",
          guidance: guidanceText,
          references: "KDIGO 2012 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease. Kidney Int Suppl. 2013;3(1):1-150."
        };
      }
    },
    {
      id: "upcrCalc",
      cat: "renal",
      subcat: "Kidney Function and CKD",
      name: "Protein-to-Creatinine Ratio (UPCR)",
      desc: "Spot urine protein-to-creatinine ratio (estimates 24-hr urine protein).",
      fields: [
        N("uprot", "Spot Urine Total Protein (mg/dL)", 65, { min: 1, max: 3000 }),
        N("ucr", "Spot Urine Creatinine (mg/dL)", 100, { min: 5, max: 800 })
      ],
      calc: v => {
        const upcr = +v.uprot / +v.ucr;
        let c = upcr < 0.15 ? "Normal protein excretion (<0.15 g/g)" : upcr < 0.5 ? "Mild proteinuria (0.15–0.49 g/g)" : upcr < 3.5 ? "Moderate-to-heavy proteinuria (0.5–3.49 g/g)" : "Nephrotic-range proteinuria (≥3.5 g/g)";
        
        let guidanceText = upcr < 0.15
          ? "Normal protein excretion. Reassuring baseline."
          : upcr < 3.5
          ? "Non-nephrotic proteinuria. Evaluate for underlying glomerulonephritis, hypertensive nephrosclerosis, or diabetic nephropathy."
          : "Nephrotic-range proteinuria. High suspicion for primary or secondary glomerular disease (e.g., membranous nephropathy, FSGS, minimal change disease, diabetic nephropathy). Nephrology referral and possible renal biopsy warranted.";

        return {
          value: upcr.toFixed(2) + " g/g creatinine (~" + upcr.toFixed(2) + " g/24h) — " + c,
          eq: "UPCR = Urine Protein (mg/dL) ÷ Urine Creatinine (mg/dL). UPCR roughly approximates 24-hour protein excretion in grams.",
          guidance: guidanceText,
          references: "KDIGO 2021 Clinical Practice Guideline for the Management of Glomerular Diseases. Kidney Int. 2021;100(4S):S1-S276."
        };
      }
    },
    {
      id: "fenaCalc",
      cat: "renal",
      subcat: "Kidney Function and CKD",
      name: "Fractional Excretion of Sodium (FENa)",
      desc: "Distinguishes prerenal azotemia from intrinsic acute tubular necrosis.",
      fields: [
        N("una", "Urine Sodium (mEq/L)", 14, { min: 1, max: 250 }),
        N("sna", "Serum Sodium (mEq/L)", 140, { min: 90, max: 180 }),
        N("ucr", "Urine Creatinine (mg/dL)", 90, { min: 5, max: 600 }),
        N("scr", "Serum Creatinine (mg/dL)", 2.4, { min: 0.3, max: 20 })
      ],
      calc: v => {
        const fena = ((+v.una * +v.scr) / (+v.sna * +v.ucr)) * 100;
        let c = fena < 1.0 ? "Prerenal azotemia (<1%)" : fena > 2.0 ? "Intrinsic renal injury / ATN (>2%)" : "Indeterminate / intermediate (1–2%)";
        
        let guidanceText = fena < 1.0
          ? "Suggests avid sodium retention due to effective circulating volume depletion (prerenal azotemia). Respond with fluid resuscitation or optimization of hemodynamics."
          : fena > 2.0
          ? "Suggests tubular dysfunction and inability to reabsorb sodium (intrinsic acute tubular necrosis). Avoid fluid overload; manage supportively."
          : "Intermediate result. Can be seen in early obstruction, contrast nephropathy, or prerenal states in patients on diuretics. Clinical correlation required.";

        return {
          value: fena.toFixed(2) + "% — " + c,
          eq: "FENa = [(Urine Na × Serum Cr) ÷ (Serum Na × Urine Cr)] × 100%. Note: Unreliable if patient received diuretics within 24h (use FEUrea).",
          guidance: guidanceText,
          references: "Miller TR, Anderson RJ, Linas SL, et al. Urinary diagnostic indices in acute renal failure: a prospective study. Ann Intern Med. 1978;89(1):47-50."
        };
      }
    },
    {
      id: "feUreaCalc",
      cat: "renal",
      subcat: "Kidney Function and CKD",
      name: "Fractional Excretion of Urea (FEUrea)",
      desc: "Evaluates prerenal state versus ATN when diuretics invalidate FENa.",
      fields: [
        N("uurea", "Urine Urea Nitrogen (mg/dL)", 350, { min: 10, max: 2500 }),
        N("bun", "Blood Urea Nitrogen (BUN, mg/dL)", 45, { min: 2, max: 200 }),
        N("ucr", "Urine Creatinine (mg/dL)", 80, { min: 5, max: 600 }),
        N("scr", "Serum Creatinine (mg/dL)", 2.2, { min: 0.3, max: 20 })
      ],
      calc: v => {
        const feUrea = ((+v.uurea * +v.scr) / (+v.bun * +v.ucr)) * 100;
        let c = feUrea < 35 ? "Prerenal azotemia (<35%)" : feUrea > 50 ? "Intrinsic renal injury / ATN (>50%)" : "Intermediate / non-diagnostic (35–50%)";
        
        let guidanceText = feUrea < 35
          ? "Suggests prerenal azotemia even in the presence of recent loop diuretic use. Consider volume responsiveness."
          : feUrea > 50
          ? "Suggests intrinsic acute tubular necrosis. Diuretic use does not significantly confound urea handling compared to sodium."
          : "Intermediate urea excretion. Interpret cautiously alongside clinical history and urine sediment.";

        return {
          value: feUrea.toFixed(1) + "% — " + c,
          eq: "FEUrea = [(Urine Urea × Serum Cr) ÷ (BUN × Urine Cr)] × 100%. Urea reabsorption in the proximal tubule is less affected by loop diuretics.",
          guidance: guidanceText,
          references: "Espnel CH. The fractional excretion of urea. A simple and reliable test for differential diagnosis of acute renal failure. JAMA. 1980;244(6):579-581."
        };
      }
    },

    // ==========================================
    // B. ACUTE KIDNEY INJURY (AKI)
    // ==========================================
    {
      id: "kdigoAki",
      cat: "renal",
      subcat: "Acute Kidney Injury (AKI)",
      name: "KDIGO AKI Staging",
      desc: "Consensus criteria based on creatinine change or oliguria duration.",
      fields: [
        S("cr_stage", "Serum Creatinine Criteria", "1", [
          ["0", "No significant rise (<0.3 mg/dL increase and <1.5× baseline)"],
          ["1", "Stage 1: Increase ≥0.3 mg/dL within 48h OR 1.5–1.9× baseline within 7 days"],
          ["2", "Stage 2: 2.0–2.9× baseline creatinine"],
          ["3", "Stage 3: ≥3.0× baseline OR increase to ≥4.0 mg/dL OR initiation of RRT"]
        ]),
        S("uo_stage", "Urine Output Criteria", "0", [
          ["0", "Normal urine output (>0.5 mL/kg/h)"],
          ["1", "Stage 1: <0.5 mL/kg/h for 6–12 hours"],
          ["2", "Stage 2: <0.5 mL/kg/h for ≥12 hours"],
          ["3", "Stage 3: <0.3 mL/kg/h for ≥24 hours OR anuria for ≥12 hours"]
        ])
      ],
      calc: v => {
        const maxStage = Math.max(+v.cr_stage, +v.uo_stage);
        let s = maxStage === 0 ? "No AKI by KDIGO criteria" : "KDIGO AKI Stage " + maxStage;
        
        let guidanceText = "";
        if (maxStage === 0) {
          guidanceText = "No acute kidney injury criteria met. Continue monitoring.";
        } else if (maxStage === 1) {
          guidanceText = "Stage 1 AKI. Review and discontinue nephrotoxic medications, ensure adequate volume status and perfusion pressure, monitor daily creatinine and urine output.";
        } else if (maxStage === 2) {
          guidanceText = "Stage 2 AKI. Moderate severity. Consider nephrology consultation, avoid nephrotoxics strictly, monitor fluid balance closely, and evaluate for intrinsic renal etiologies.";
        } else {
          guidanceText = "Stage 3 AKI. Severe acute kidney injury. Urgent nephrology consultation, evaluation for emergent renal replacement therapy, intensive hemodynamic monitoring, and electrolyte management.";
        }

        return {
          value: s,
          eq: "Staged by whichever criterion (creatinine or urine output) yields the more severe stage.",
          guidance: guidanceText,
          references: "KDIGO Clinical Practice Guideline for Acute Kidney Injury. Kidney Int Suppl. 2012;2(1):1-138."
        };
      }
    },
    {
      id: "akinRifleRef",
      cat: "renal",
      subcat: "Acute Kidney Injury (AKI)",
      name: "AKIN & RIFLE Staging Reference",
      desc: "Historic RIFLE / AKIN classification mapping to modern KDIGO definitions.",
      fields: [
        S("system", "Classification to cross-reference", "rifle", [
          ["rifle", "RIFLE (Risk, Injury, Failure, Loss, ESRD)"],
          ["akin", "AKIN (Stage 1, 2, 3)"]
        ])
      ],
      calc: v => {
        let txt = v.system === "rifle" 
          ? "RIFLE: Risk (1.5× Cr / GFR drop >25%), Injury (2× Cr / GFR drop >50%), Failure (3× Cr or Cr ≥4 with acute rise ≥0.5 / GFR drop >75%), Loss (persistent failure >4 weeks), ESRD (>3 months)."
          : "AKIN: Stage 1 (Cr rise ≥0.3 or 1.5–2×), Stage 2 (2–3× Cr), Stage 3 (>3× Cr or Cr ≥4 with acute rise ≥0.5 or on RRT). KDIGO harmonized both into 48h/7d windows.";
        
        return {
          value: v.system.toUpperCase() + " Criteria",
          eq: txt,
          guidance: "Reference classification tool. Use KDIGO criteria for contemporary clinical practice and research trial definitions.",
          references: "Bellomo R, Ronco C, Kellum JA, Mehta RL, Palevsky P; Acute Dialysis Quality Initiative workgroup. Acute renal failure - definition, outcome measures, animal models, fluid therapy and information technology needs: the Second International Consensus Conference of the Acute Dialysis Quality Initiative (ADQI) group. Crit Care. 2004;8(4):R204-R212."
        };
      }
    },
    {
      id: "uoKgHr",
      cat: "renal",
      subcat: "Acute Kidney Injury (AKI)",
      name: "Urine Output per kg per hour",
      desc: "Calculates normalized urine excretion rate for oliguria monitoring.",
      fields: [
        N("vol", "Total Urine Volume (mL)", 180, { min: 0, max: 10000, step: 5 }),
        N("weight", "Patient Weight (kg)", 75, { min: 10, max: 300, step: 0.5 }),
        N("hours", "Collection Time (hours)", 6, { min: 1, max: 48, step: 1 })
      ],
      calc: v => {
        const rate = +v.vol / +v.weight / +v.hours;
        let c = rate >= 0.5 ? "Adequate output (≥0.5 mL/kg/h)" : rate >= 0.3 ? "Oliguria (0.3–0.49 mL/kg/h) — meets KDIGO Stage 1 if ≥6h" : "Severe oliguria / anuria (<0.3 mL/kg/h)";
        
        let guidanceText = rate >= 0.5
          ? "Adequate renal perfusion based on urine output."
          : rate >= 0.3
          ? "Oliguria detected. Assess volume status, rule out catheter obstruction, and check for prerenal or early AKI causes."
          : "Severe oliguria or anuria. High risk for acute kidney injury progression, fluid overload, and metabolic crisis. Urgent clinical assessment required.";

        return {
          value: rate.toFixed(2) + " mL/kg/h — " + c,
          eq: "Rate = Volume (mL) ÷ Weight (kg) ÷ Time (hours). Oliguria (<0.5 mL/kg/h for ≥6 hours) defines Stage 1 AKI.",
          guidance: guidanceText,
          references: "KDIGO Clinical Practice Guideline for Acute Kidney Injury. Kidney Int Suppl. 2012;2(1):1-138."
        };
      }
    },
    {
      id: "crChangeRatio",
      cat: "renal",
      subcat: "Acute Kidney Injury (AKI)",
      name: "Creatinine Change & Ratio Calculator",
      desc: "Calculates absolute change (ΔCr) and fold-change over baseline.",
      fields: [
        N("base_cr", "Baseline Serum Creatinine (mg/dL)", 1.0, { min: 0.2, max: 20 }),
        N("curr_cr", "Current Serum Creatinine (mg/dL)", 2.3, { min: 0.2, max: 25 })
      ],
      calc: v => {
        const delta = +v.curr_cr - +v.base_cr;
        const ratio = +v.curr_cr / +v.base_cr;
        let c = ratio >= 3.0 || +v.curr_cr >= 4.0 ? "Stage 3 AKI threshold (≥3.0× or Cr ≥4.0)" : ratio >= 2.0 ? "Stage 2 AKI threshold (2.0–2.9×)" : (ratio >= 1.5 || delta >= 0.3) ? "Stage 1 AKI threshold (≥1.5× or Δ ≥0.3 mg/dL)" : "No AKI by creatinine criteria";
        
        let guidanceText = ratio >= 3.0 || +v.curr_cr >= 4.0
          ? "Meets Stage 3 AKI criteria. Immediate evaluation for RRT and nephrology consultation."
          : ratio >= 2.0
          ? "Meets Stage 2 AKI criteria. Aggressive management and optimization of renal perfusion."
          : (ratio >= 1.5 || delta >= 0.3)
          ? "Meets Stage 1 AKI criteria. Review medications and volume status."
          : "Creatinine change does not meet standard AKI threshold.";

        return {
          value: "Ratio: " + ratio.toFixed(2) + "× baseline | ΔCr: +" + delta.toFixed(2) + " mg/dL (" + c + ")",
          eq: "Fold-change = Current Cr ÷ Baseline Cr. Delta Cr = Current Cr − Baseline Cr.",
          guidance: guidanceText,
          references: "KDIGO Clinical Practice Guideline for Acute Kidney Injury. Kidney Int Suppl. 2012;2(1):1-138."
        };
      }
    },
    {
      id: "fluidBalanceCalc",
      cat: "renal",
      subcat: "Acute Kidney Injury (AKI)",
      name: "Fluid Balance Calculator",
      desc: "Net 24-hour balance of all intakes and outputs.",
      fields: [
        N("iv", "IV fluids, infusions, flushes, medications (mL)", 2500, { min: 0, max: 30000 }),
        N("oral", "Oral / enteral intake (mL)", 500, { min: 0, max: 10000 }),
        N("uo", "Urine output (mL)", 1200, { min: 0, max: 15000 }),
        N("drains", "Drains, stool, emesis, ultrafiltration (mL)", 300, { min: 0, max: 15000 })
      ],
      calc: v => {
        const totalIn = +v.iv + +v.oral;
        const totalOut = +v.uo + +v.drains;
        const net = totalIn - totalOut;
        
        let guidanceText = net > 1000
          ? "Significantly positive fluid balance. Monitor for signs of fluid overload, pulmonary edema, and worsening tissue oxygenation. Consider conservative fluid strategies or diuresis."
          : net < -500
          ? "Negative fluid balance. Ensure patient remains adequately fluid-resuscitated unless intentionally diuresing."
          : "Neutral fluid balance. Generally desirable in stable non-resuscitating patients.";

        return {
          value: (net >= 0 ? "+" : "") + net + " mL (" + (net >= 0 ? "Positive" : "Negative") + " balance)",
          eq: "Total In (" + totalIn + " mL) − Total Out (" + totalOut + " mL) = Net " + (net >= 0 ? "+" : "") + net + " mL.",
          guidance: guidanceText,
          references: "Hoste EA, Maitland K, Brudney CS, et al. Four phases of fluid therapy: a conceptual model for fluid management and the IMDR. Br J Anaesth. 2014;113(5):740-747."
        };
      }
    },
    {
      id: "fluidOverloadPct",
      cat: "renal",
      subcat: "Acute Kidney Injury (AKI)",
      name: "Cumulative Fluid Overload Percentage",
      desc: "Calculates % fluid accumulation relative to hospital admission weight.",
      fields: [
        N("net_l", "Cumulative Net Fluid Balance (Liters)", 6.5, { min: -10, max: 50, step: 0.1 }),
        N("weight", "Baseline Admission Weight (kg)", 70, { min: 10, max: 300 })
      ],
      calc: v => {
        const pct = (+v.net_l / +v.weight) * 100;
        let c = pct >= 10 ? "Severe fluid overload (≥10%): independently predicts mortality & prolonged ICU stay" : pct >= 5 ? "Moderate fluid accumulation (5–9.9%)" : "Mild / no significant fluid overload (<5%)";
        
        let guidanceText = pct >= 10
          ? "Severe fluid overload (≥10%). Strongly associated with increased mortality, ventilator dependence, and need for RRT. Initiate aggressive active fluid removal (diuresis or RRT)."
          : pct >= 5
          ? "Moderate fluid accumulation. Re-evaluate ongoing fluid administration and consider proactive fluid de-escalation."
          : "Low fluid overload percentage.";

        return {
          value: pct.toFixed(1) + "% Fluid Overload — " + c,
          eq: "Formula: [Cumulative Net Fluid Balance (L) ÷ Baseline Admission Weight (kg)] × 100%.",
          guidance: guidanceText,
          references: "Goldstein SL, Currier H, Graf JM, et al. Outcome in children receiving continuous venovenous hemofiltration. Pediatrics. 2001;107(4):716-721."
        };
      }
    },

    // ==========================================
    // C. ELECTROLYTES AND ACID-BASE
    // ==========================================
    {
      id: "corrSodium",
      cat: "renal",
      subcat: "Electrolytes and Acid–Base",
      name: "Corrected Sodium in Hyperglycemia",
      desc: "Adjusts measured sodium for hyperglycemic translocational hyponatremia.",
      fields: [
        N("sna", "Measured Serum Sodium (mEq/L)", 130, { min: 100, max: 180 }),
        N("glucose", "Serum Glucose (mg/dL)", 450, { min: 50, max: 2500 })
      ],
      calc: v => {
        const g = +v.glucose;
        const katz = +v.sna + 0.016 * (g - 100);
        const hillier = +v.sna + 0.024 * (g - 100);
        
        let guidanceText = katz >= 135
          ? "Corrected sodium is in the normal range. Hyponatremia is entirely accounted for by osmotic fluid shifts from hyperglycemia."
          : "True concomitant hyponatremia present despite correction. Investigate hypovolemic, euvolemic, or hypervolemic causes of true hyponatremia.";

        return {
          value: "Corrected Na: " + katz.toFixed(1) + " mEq/L (Katz) | " + hillier.toFixed(1) + " mEq/L (Hillier)",
          eq: "Katz: Measured Na + 0.016 × (Glucose − 100). Hillier (often used when glucose >400): Measured Na + 0.024 × (Glucose − 100).",
          guidance: guidanceText,
          references: "Katz MA. Hyperglycemia-induced hyponatremia: calculation of expected serum sodium depression. N Engl J Med. 1973;289(16):843-844."
        };
      }
    },
    {
      id: "freeWaterDeficit",
      cat: "renal",
      subcat: "Electrolytes and Acid–Base",
      name: "Free Water Deficit",
      desc: "Calculates free water required to correct hypernatremia.",
      fields: [
        N("sna", "Serum Sodium (mEq/L)", 158, { min: 140, max: 200 }),
        N("weight", "Weight (kg)", 70, { min: 20, max: 300 }),
        S("demog", "Patient demographics", "m_adult", [
          ["m_adult", "Male adult (factor 0.6)"],
          ["f_adult", "Female adult (factor 0.5)"],
          ["m_elder", "Elderly male (factor 0.5)"],
          ["f_elder", "Elderly female (factor 0.45)"]
        ])
      ],
      calc: v => {
        let f = 0.6;
        if (v.demog === "f_adult" || v.demog === "m_elder") f = 0.5;
        else if (v.demog === "f_elder") f = 0.45;

        const tbw = +v.weight * f;
        const deficit = tbw * ((+v.sna / 140) - 1);
        
        return {
          value: deficit.toFixed(1) + " Liters free water deficit (TBW: " + tbw.toFixed(1) + " L)",
          eq: "Deficit (L) = TBW × [(Serum Na ÷ 140) − 1]. Correct slowly (target reduction ≤8–10 mEq/L in 24 hours to prevent cerebral edema).",
          guidance: "Replace free water enterally (water via NG tube) or via hypotonic IV fluids (e.g., D5W or 0.45% NaCl). Limit serum sodium correction rate to maximum 8–10 mEq/L per 24 hours to prevent osmotic demyelination syndrome.",
          references: "Adrogué HJ, Madias NE. Hypernatremia. N Engl J Med. 2000;342(20):1493-1499."
        };
      }
    },
    {
      id: "sodiumDeficit",
      cat: "renal",
      subcat: "Electrolytes and Acid–Base",
      name: "Sodium Deficit / Replacement Estimate",
      desc: "Calculates sodium required to raise serum sodium in acute hyponatremia.",
      fields: [
        N("curr_na", "Current Serum Sodium (mEq/L)", 118, { min: 80, max: 135 }),
        N("targ_na", "Target Sodium (mEq/L)", 125, { min: 90, max: 140 }),
        N("weight", "Weight (kg)", 70, { min: 20, max: 300 }),
        S("sex", "Sex", "male", [["male", "Male (0.6)"], ["female", "Female (0.5)"]])
      ],
      calc: v => {
        const factor = v.sex === "female" ? 0.5 : 0.6;
        const tbw = +v.weight * factor;
        const deficit = tbw * (+v.targ_na - +v.curr_na);
        
        return {
          value: Math.round(deficit) + " mmol Na deficit",
          eq: "Sodium Deficit (mmol) = TBW × (Target Na − Current Na). Hypertonic saline (3% NaCl) contains ~513 mmol Na/L (~0.513 mmol/mL).",
          guidance: "If patient is symptomatic (seizures, encephalopathy), administer 3% hypertonic saline rapidly (e.g., 100-150 mL bolus over 10 minutes). Strictly limit total 24-hour correction to 6–8 mEq/L (maximum 10–12 mEq/L) to avoid osmotic demyelination.",
          references: "Verbalis JG, Goldsmith SR, Greenberg A, et al. Diagnosis, evaluation, and treatment of hyponatremia: expert panel recommendations. Am J Med. 2013;126(10 Suppl 1):S1-S42."
        };
      }
    },
    {
      id: "potassiumDeficit",
      cat: "renal",
      subcat: "Electrolytes and Acid–Base",
      name: "Potassium Deficit Estimate",
      desc: "Rough estimate of total body potassium deficit in hypokalemia.",
      fields: [
        N("k", "Serum Potassium (mEq/L)", 3.1, { min: 1.0, max: 4.0, step: 0.1 })
      ],
      calc: v => {
        const drop = 4.0 - +v.k;
        if (drop <= 0) return { value: "No hypokalemia (K ≥4.0 mEq/L)", eq: "Serum potassium within normal baseline.", guidance: "Potassium is within normal limits.", references: "Sterns RH, Cox M, Feig PU, Singer I. Internal potassium balance and the control of the plasma potassium concentration. Medicine (Baltimore). 1981;60(5):339-354." };
        const deficit = (drop / 0.3) * 100;
        
        return {
          value: "~" + Math.round(deficit) + " mEq estimated total body deficit",
          eq: "Rule of thumb: Every 0.3 mEq/L drop below 4.0 mEq/L corresponds to ~100 mEq total body potassium deficit. Adjust for cellular shifts (pH, insulin).",
          guidance: "Administer potassium replacement orally if well-tolerated and K is mild-to-moderate (>3.0 mEq/L). Use IV repletion via peripheral line (max 10 mEq/h) or central line (max 20 mEq/h) with cardiac telemetry for severe hypokalemia or ECG changes.",
          references: "Sterns RH, Cox M, Feig PU, Singer I. Internal potassium balance and the control of the plasma potassium concentration. Medicine (Baltimore). 1981;60(5):339-354."
        };
      }
    },
    {
      id: "anionGap",
      cat: "renal",
      subcat: "Electrolytes and Acid–Base",
      name: "Anion Gap",
      desc: "Calculates serum anion gap: Na − (Cl + HCO₃).",
      fields: [
        N("na", "Serum Sodium (mEq/L)", 140, { min: 90, max: 180 }),
        N("cl", "Serum Chloride (mEq/L)", 102, { min: 60, max: 140 }),
        N("hco3", "Serum Bicarbonate (mEq/L)", 18, { min: 2, max: 55 })
      ],
      calc: v => {
        const ag = +v.na - (+v.cl + +v.hco3);
        let c = ag > 12 ? "High Anion Gap Metabolic Acidosis (HAGMA)" : ag < 4 ? "Low Anion Gap (consider severe hypoalbuminemia, paraproteinemia, lithium)" : "Normal Anion Gap (8–12 mEq/L)";
        
        let guidanceText = ag > 12
          ? "High Anion Gap Metabolic Acidosis (HAGMA). Evaluate for MUDPILES (Methanol, Uremia, DKA, Paraldehyde, Iron/Isoniazid, Lactic acidosis, Ethylene glycol, Salicylates)."
          : ag < 4
          ? "Low or negative anion gap. Check serum albumin, check for multiple myeloma (paraproteins), or laboratory error (bromide/lithium toxicity)."
          : "Normal Anion Gap Metabolic Acidosis (NAGMA / hyperchloremic acidosis). Evaluate for GI losses (diarrhea) or renal tubular acidosis (RTA).";

        return {
          value: ag + " mEq/L — " + c,
          eq: "Anion Gap = Na − (Cl + HCO₃). Normal range typically 8–12 mEq/L (in the presence of normal albumin).",
          guidance: guidanceText,
          references: "Emmett M, Narins RG. Clinical use of the anion gap. Medicine (Baltimore). 1977;56(1):38-54."
        };
      }
    },
    {
      id: "corrAnionGap",
      cat: "renal",
      subcat: "Electrolytes and Acid–Base",
      name: "Albumin-Corrected Anion Gap",
      desc: "Adjusts anion gap for hypoalbuminemia in critically ill patients.",
      fields: [
        N("na", "Serum Sodium (mEq/L)", 138, { min: 90, max: 180 }),
        N("cl", "Serum Chloride (mEq/L)", 105, { min: 60, max: 140 }),
        N("hco3", "Serum Bicarbonate (mEq/L)", 16, { min: 2, max: 55 }),
        N("alb", "Serum Albumin (g/dL)", 2.2, { min: 0.5, max: 6.0, step: 0.1 })
      ],
      calc: v => {
        const uncorr = +v.na - (+v.cl + +v.hco3);
        const corr = uncorr + 2.5 * (4.0 - +v.alb);
        
        let guidanceText = corr > 12
          ? "Corrected anion gap is elevated. Unmasked HAGMA present despite hypoalbuminemia."
          : "Corrected anion gap is within normal limits.";

        return {
          value: "Corrected AG: " + corr.toFixed(1) + " mEq/L (Uncorrected: " + uncorr + " mEq/L)",
          eq: "Corrected AG = Observed AG + 2.5 × (4.0 − Albumin [g/dL]). Albumin is the primary unmeasured circulating anion.",
          guidance: guidanceText,
          references: "Figge J, Jabor A, Kazda A, Fencl V. Anion gap and hypoalbuminemia. Crit Care Med. 1998;26(11):1807-1810."
        };
      }
    },
    {
      id: "deltaRatio",
      cat: "renal",
      subcat: "Electrolytes and Acid–Base",
      name: "Delta Ratio (Delta-Delta)",
      desc: "Evaluates mixed high-anion-gap and normal-anion-gap acidoses.",
      fields: [
        N("ag", "Measured Anion Gap (mEq/L)", 22, { min: 4, max: 50 }),
        N("hco3", "Measured Bicarbonate (mEq/L)", 12, { min: 2, max: 50 })
      ],
      calc: v => {
        const dAg = +v.ag - 12;
        const dHco3 = 24 - +v.hco3;
        if (dHco3 <= 0) return { value: "Delta ratio not applicable (HCO₃ ≥24)", eq: "Delta ratio is calculated only in metabolic acidosis.", guidance: "Not applicable for non-acidotic states.", references: "Wrenn K. The delta gap: an approach to mixed acid-base disorders. Ann Emerg Med. 1990;19(11):1310-1313." };
        const ratio = dAg / dHco3;
        let c = ratio < 0.4 ? "<0.4: Pure Normal Anion Gap Acidosis (hyperchloremic)" : ratio < 0.8 ? "0.4–0.8: Mixed HAGMA + Normal Anion Gap Acidosis" : ratio <= 1.5 ? "0.8–1.5: Pure High Anion Gap Metabolic Acidosis" : ">1.5: Concurrent Metabolic Alkalosis or pre-existing high HCO₃";
        
        return {
          value: ratio.toFixed(2) + " — " + c,
          eq: "Delta Ratio = (Anion Gap − 12) ÷ (24 − HCO₃). Compares the increase in unmeasured anions to the decrease in bicarbonate.",
          guidance: "Helps identify hidden concurrent acid-base disturbances (e.g., coexisting metabolic alkalosis or normal anion gap acidosis alongside HAGMA).",
          references: "Wrenn K. The delta gap: an approach to mixed acid-base disorders. Ann Emerg Med. 1990;19(11):1310-1313."
        };
      }
    },
    {
      id: "wintersFormula",
      cat: "renal",
      subcat: "Electrolytes and Acid–Base",
      name: "Winter’s Formula (Respiratory Compensation)",
      desc: "Expected PaCO₂ compensation in primary metabolic acidosis.",
      fields: [
        N("hco3", "Serum Bicarbonate (mEq/L)", 14, { min: 2, max: 35 }),
        N("paco2", "Measured PaCO₂ (mmHg)", 28, { min: 10, max: 100 })
      ],
      calc: v => {
        const expected = (1.5 * +v.hco3) + 8;
        const minP = expected - 2;
        const maxP = expected + 2;
        const actual = +v.paco2;
        let c = actual > maxP ? "Actual PaCO₂ > expected: Concurrent Respiratory Acidosis (hypoventilation)" : actual < minP ? "Actual PaCO₂ < expected: Concurrent Respiratory Alkalosis (hyperventilation)" : "Adequate respiratory compensation";
        
        let guidanceText = actual > maxP
          ? "Inadequate respiratory compensation / concurrent respiratory acidosis. Patient is hypoventilating relative to metabolic acidosis; assess for respiratory failure."
          : actual < minP
          ? "Concurrent respiratory alkalosis. Patient is hyperventilating beyond expected renal compensation (e.g., salicylate toxicity or sepsis)."
          : "Appropriate respiratory compensation for metabolic acidosis.";

        return {
          value: "Expected PaCO₂: " + expected.toFixed(1) + " mmHg (range " + minP.toFixed(1) + "–" + maxP.toFixed(1) + ") — " + c,
          eq: "Winter's Formula: Expected PaCO₂ = (1.5 × HCO₃) + 8 ± 2.",
          guidance: guidanceText,
          references: "Winter RW, Engel K, Treip RP. The estimation of acid-base changes in acute metabolic acidosis. Scand J Clin Lab Invest. 1964;16:387-394."
        };
      }
    },
    {
      id: "serumOsmolality",
      cat: "renal",
      subcat: "Electrolytes and Acid–Base",
      name: "Serum Osmolality & Osmolar Gap",
      desc: "Calculated osmolality and osmolar gap for toxic alcohol evaluation.",
      fields: [
        N("na", "Serum Sodium (mEq/L)", 138, { min: 90, max: 180 }),
        N("glucose", "Serum Glucose (mg/dL)", 110, { min: 20, max: 2000 }),
        N("bun", "BUN (mg/dL)", 18, { min: 2, max: 250 }),
        N("meas_osm", "Measured Osmolality (mOsm/kg; enter 0 if none)", 295, { min: 0, max: 600 })
      ],
      calc: v => {
        const calcOsm = (2 * +v.na) + (+v.glucose / 18) + (+v.bun / 2.8);
        let res = "Calculated Osmolality: " + Math.round(calcOsm) + " mOsm/kg";
        let guidanceText = "Standard calculated osmolality.";
        if (+v.meas_osm > 0) {
          const gap = +v.meas_osm - calcOsm;
          let tier = gap > 10 ? "ELEVATED OSMOLAR GAP (>10 mOsm/kg; suspect toxic alcohols: methanol, ethylene glycol)" : "Normal osmolar gap (≤10 mOsm/kg)";
          res += " | Gap: " + gap.toFixed(1) + " mOsm/kg (" + tier + ")";
          guidanceText = gap > 10
            ? "Elevated osmolar gap (>10 mOsm/kg). Strongly suggests ingestion of unmeasured active osmoles (methanol, ethylene glycol, isopropanol, propylene glycol). Urgent toxicology screen and antidote consideration (fomepizole)."
            : "Normal osmolar gap.";
        }
        return {
          value: res,
          eq: "Calculated Osmolality = 2×Na + (Glucose/18) + (BUN/2.8). Osmolar Gap = Measured − Calculated. Gap >10 prompts toxic alcohol workup.",
          guidance: guidanceText,
          references: "Gore JA, Pannell WP, Bracker M. The osmolar gap in clinical practice. Mayo Clin Proc. 2014;89(3):398-406."
        };
      }
    },
    {
      id: "corrCalcium",
      cat: "renal",
      subcat: "Electrolytes and Acid–Base",
      name: "Corrected Calcium",
      desc: "Payne formula adjusting total calcium for serum albumin binding.",
      fields: [
        N("ca", "Measured Total Calcium (mg/dL)", 8.0, { min: 3, max: 20, step: 0.1 }),
        N("alb", "Serum Albumin (g/dL)", 2.5, { min: 0.5, max: 6.0, step: 0.1 })
      ],
      calc: v => {
        const corr = +v.ca + 0.8 * (4.0 - +v.alb);
        let c = corr > 10.5 ? "Hypercalcemia (>10.5 mg/dL)" : corr < 8.5 ? "Hypocalcemia (<8.5 mg/dL)" : "Normal corrected calcium (8.5–10.5 mg/dL)";
        
        let guidanceText = corr > 10.5
          ? "Corrected hypercalcemia. Evaluate for hyperparathyroidism, malignancy, or Vitamin D toxicity."
          : corr < 8.5
          ? "Corrected hypocalcemia. Check ionized calcium, magnesium, and intact PTH. Replete calcium if symptomatic."
          : "Normal corrected calcium level.";

        return {
          value: corr.toFixed(2) + " mg/dL — " + c,
          eq: "Formula: Corrected Ca = Total Ca (mg/dL) + 0.8 × (4.0 − Albumin [g/dL]). Ionized calcium is preferred when available.",
          guidance: guidanceText,
          references: "Payne RB, Little AJ, Williams RB, Milner JR. Interpretation of serum calcium in patients with abnormal serum proteins. BMJ. 1973;4(5893):643-646."
        };
      }
    },
    {
      id: "caPhosProduct",
      cat: "renal",
      subcat: "Electrolytes and Acid–Base",
      name: "Calcium–Phosphate Product",
      desc: "Evaluates risk of vascular and metastatic tissue calcification in CKD/ESRD.",
      fields: [
        N("ca", "Total Serum Calcium (mg/dL)", 9.2, { min: 4, max: 20, step: 0.1 }),
        N("phos", "Serum Phosphate (mg/dL)", 6.2, { min: 1, max: 20, step: 0.1 })
      ],
      calc: v => {
        const prod = +v.ca * +v.phos;
        let c = prod > 55 ? "Elevated product (>55 mg²/dL²; heightened risk of metastatic calcification / calciphylaxis)" : "Desirable range (≤55 mg²/dL²)";
        
        let guidanceText = prod > 55
          ? "Elevated calcium-phosphate product (>55 mg²/dL²). High risk for vascular calcification, soft tissue deposition, and calciphylaxis. Restrict dietary phosphate, optimize phosphate binders, and manage secondary hyperparathyroidism."
          : "Calcium-phosphate product within desirable therapeutic range.";

        return {
          value: prod.toFixed(1) + " mg²/dL² — " + c,
          eq: "Product = Serum Calcium (mg/dL) × Serum Phosphate (mg/dL). Maintain ≤55 mg²/dL² in advanced CKD.",
          guidance: guidanceText,
          references: "KDIGO Clinical Practice Guideline for Diagnosis, Evaluation, Prevention, and Treatment of Chronic Kidney Disease-Mineral and Bone Disorder (CKD-MBD). Kidney Int Suppl. 2009;(113):S1-S130."
        };
      }
    },

    // ==========================================
    // D. DIALYSIS AND RENAL REPLACEMENT THERAPY
    // ==========================================
    {
      id: "aeiouDialysis",
      cat: "renal",
      subcat: "Dialysis and Renal Replacement Therapy",
      name: "AEIOU Urgent Dialysis Indications",
      desc: "Standard emergency checklist for acute renal replacement therapy.",
      fields: [
        S("a", "A — Severe refractory Acidosis (pH <7.15)", "0", [["0", "No"], ["1", "Yes"]]),
        S("e", "E — Refractory Electrolyte abnormalities (severe hyperkalemia K >6.5)", "0", [["0", "No"], ["1", "Yes"]]),
        S("i", "I — Intoxications / ingestions (toxic alcohols, lithium, salicylates)", "0", [["0", "No"], ["1", "Yes"]]),
        S("o", "O — Fluid Overload refractory to diuretics (pulmonary edema)", "0", [["0", "No"], ["1", "Yes"]]),
        S("u", "U — Uremic complications (encephalopathy, pericarditis, bleeding)", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const count = +v.a + +v.e + +v.i + +v.o + +v.u;
        
        let guidanceText = count >= 1
          ? "Urgent indications present for acute renal replacement therapy. Immediate nephrology consultation and emergent dialysis catheter placement or vascular access."
          : "No emergent indicators present for urgent dialysis. Continue conservative medical management and close monitoring.";

        return {
          value: count >= 1 ? "URGENT RRT CRITERIA MET (" + count + " indication[s])" : "No emergent indication present",
          eq: "AEIOU: Acidosis, Electrolytes (K), Ingestions, Overload, Uremia. Presence of any refractory criterion triggers emergent nephrology evaluation.",
          guidance: guidanceText,
          references: "KDIGO Clinical Practice Guideline for Acute Kidney Injury. Kidney Int Suppl. 2012;2(1):1-138."
        };
      }
    },
    {
      id: "urrCalc",
      cat: "renal",
      subcat: "Dialysis and Renal Replacement Therapy",
      name: "Urea Reduction Ratio (URR)",
      desc: "Percentage reduction in BUN across a hemodialysis session.",
      fields: [
        N("pre", "Pre-dialysis BUN (mg/dL)", 65, { min: 10, max: 250 }),
        N("post", "Post-dialysis BUN (mg/dL)", 20, { min: 2, max: 150 })
      ],
      calc: v => {
        const urr = ((+v.pre - +v.post) / +v.pre) * 100;
        let c = urr >= 65 ? "Adequate clearance (≥65% target achieved)" : "Inadequate clearance (<65%; increase time/blood flow/dialyzer)";
        
        let guidanceText = urr >= 65
          ? "Adequate urea clearance for the session (meets minimum 65% target)."
          : "Inadequate clearance (<65%). Consider increasing blood flow rate, dialysis duration, or dialyzer surface area/efficiency.";

        return {
          value: urr.toFixed(1) + "% — " + c,
          eq: "URR = [(Pre-BUN − Post-BUN) ÷ Pre-BUN] × 100%. Target minimum is 65% for thrice-weekly hemodialysis.",
          guidance: guidanceText,
          references: "National Kidney Foundation. KDOQI Clinical Practice Guideline for Hemodialysis Adequacy: 2015 Update. Am J Kidney Dis. 2015;66(5):884-930."
        };
      }
    },
    {
      id: "ktvDaugirdas",
      cat: "renal",
      subcat: "Dialysis and Renal Replacement Therapy",
      name: "Kt/V (Single-Pool Daugirdas)",
      desc: "Second-generation Daugirdas formula for hemodialysis fractional clearance.",
      fields: [
        N("pre", "Pre-dialysis BUN (mg/dL)", 70, { min: 10, max: 250 }),
        N("post", "Post-dialysis BUN (mg/dL)", 22, { min: 2, max: 150 }),
        N("hours", "Session Duration (hours)", 3.5, { min: 1.0, max: 6.0, step: 0.25 }),
        N("uf", "Ultrafiltration Volume (Liters)", 2.5, { min: 0, max: 10, step: 0.1 }),
        N("weight", "Post-dialysis Weight (kg)", 68, { min: 25, max: 250 })
      ],
      calc: v => {
        const r = +v.post / +v.pre;
        const t = +v.hours;
        const uf = +v.uf;
        const w = +v.weight;
        const ktv = -Math.log(r - 0.008 * t) + (4 - 3.5 * r) * (uf / w);
        let c = ktv >= 1.4 ? "Optimal adequacy (≥1.4)" : ktv >= 1.2 ? "Minimally adequate (1.2–1.39)" : "Inadequate hemodialysis dose (<1.2)";
        
        let guidanceText = ktv >= 1.2
          ? "Hemodialysis dose meets or exceeds minimum adequacy standards (spKt/V ≥1.2)."
          : "Inadequate dialysis dose. Prescribe longer treatment times, higher blood flow rates, or a larger dialyzer to reach target.";

        return {
          value: "spKt/V: " + ktv.toFixed(2) + " — " + c,
          eq: "Daugirdas 2nd gen: spKt/V = −ln(R − 0.008×t) + (4 − 3.5×R) × (UF/W). Target is ≥1.2 (delivered minimum).",
          guidance: guidanceText,
          references: "Daugirdas JT. Second generation logarithmic estimates of single-pool variable volume Kt/V: an analysis of error. J Am Soc Nephrol. 1993;4(5):1205-1213."
        };
      }
    },
    {
      id: "idwgCalc",
      cat: "renal",
      subcat: "Dialysis and Renal Replacement Therapy",
      name: "Dry-Weight and Interdialytic Weight Gain (IDWG)",
      desc: "Calculates absolute and percentage interdialytic fluid accumulation.",
      fields: [
        N("pre_wt", "Current Pre-dialysis Weight (kg)", 73.2, { min: 20, max: 300, step: 0.1 }),
        N("dry_wt", "Target Dry Weight (kg)", 70.0, { min: 20, max: 300, step: 0.1 })
      ],
      calc: v => {
        const idwg = +v.pre_wt - +v.dry_wt;
        const pct = (idwg / +v.dry_wt) * 100;
        let c = pct > 4.5 ? "Excessive fluid gain (>4.5% of dry weight; high cardiovascular stress)" : "Acceptable fluid gain (≤4–4.5%)";
        
        let guidanceText = pct > 4.5
          ? "Excessive interdialytic weight gain (>4.5%). Reinforce dietary sodium and fluid restriction counseling. High IDWG forces rapid ultrafiltration rates, increasing cardiovascular strain and intradialytic hypotension risk."
          : "Acceptable interdialytic weight gain.";

        return {
          value: "+" + idwg.toFixed(1) + " kg (" + pct.toFixed(1) + "% of dry weight) — " + c,
          eq: "IDWG = Pre-dialysis Weight − Dry Weight. Excessive IDWG increases risk of severe intradialytic hypotension.",
          guidance: guidanceText,
          references: "National Kidney Foundation. KDOQI Clinical Practice Guideline for Hemodialysis Adequacy: 2015 Update. Am J Kidney Dis. 2015;66(5):884-930."
        };
      }
    },
    {
      id: "ufrCalc",
      cat: "renal",
      subcat: "Dialysis and Renal Replacement Therapy",
      name: "Ultrafiltration Rate (UFR)",
      desc: "Monitors fluid removal rate to prevent myocardial stunning.",
      fields: [
        N("vol", "Total Fluid Removed (mL)", 2800, { min: 100, max: 8000 }),
        N("hours", "Treatment Duration (hours)", 3.5, { min: 1, max: 8, step: 0.25 }),
        N("weight", "Post-dialysis Weight (kg)", 70, { min: 25, max: 250 })
      ],
      calc: v => {
        const ufr = (+v.vol / +v.hours) / +v.weight;
        let c = ufr > 13 ? "HIGH UFR (>13 mL/kg/h; associated with increased mortality & myocardial stunning)" : "Safe ultrafiltration rate (≤10–13 mL/kg/h)";
        
        let guidanceText = ufr > 13
          ? "High ultrafiltration rate (>13 mL/kg/h). Strongly associated with myocardial stunning, intradialytic hypotension, and increased cardiovascular mortality. Extend dialysis time or reduce interdialytic fluid gains."
          : "Safe ultrafiltration rate.";

        return {
          value: ufr.toFixed(1) + " mL/kg/h — " + c,
          eq: "UFR = [Fluid Removed (mL) ÷ Duration (hr)] ÷ Post-Weight (kg). Recommended safety ceiling is ≤13 mL/kg/h.",
          guidance: guidanceText,
          references: "Flythe JE, Kimmel SE, Brunelli SM. Rapid fluid removal during dialysis is associated with cardiovascular morbidity and mortality. Kidney Int. 2011;79(2):250-257."
        };
      }
    },
    {
      id: "crrtEffluent",
      cat: "renal",
      subcat: "Dialysis and Renal Replacement Therapy",
      name: "CRRT Effluent Dose Calculator",
      desc: "Delivered continuous renal replacement therapy effluent dose in mL/kg/h.",
      fields: [
        N("dialysate", "Dialysate Flow Rate (mL/h)", 1000, { min: 0, max: 4000 }),
        N("replace", "Replacement Fluid Flow Rate (mL/h)", 1000, { min: 0, max: 4000 }),
        N("net_uf", "Net Fluid Removal / UF (mL/h)", 100, { min: 0, max: 1000 }),
        N("weight", "Patient Weight (kg)", 75, { min: 20, max: 250 })
      ],
      calc: v => {
        const totalEffluent = +v.dialysate + +v.replace + +v.net_uf;
        const dose = totalEffluent / +v.weight;
        let c = dose >= 20 && dose <= 25 ? "Target KDIGO delivered dose (20–25 mL/kg/h)" : dose < 20 ? "Underdosed (<20 mL/kg/h)" : "Above standard KDIGO target (>25 mL/kg/h)";
        
        let guidanceText = dose < 20
          ? "Delivered dose is below recommended KDIGO target. Increase prescription to ensure adequate solute clearance."
          : "CRRT effluent dose meets or exceeds recommended KDIGO targets.";

        return {
          value: dose.toFixed(1) + " mL/kg/h (Total effluent: " + totalEffluent + " mL/h) — " + c,
          eq: "Effluent Dose = (Dialysate + Replacement + Net UF) ÷ Weight (kg). KDIGO recommends delivering 20–25 mL/kg/h.",
          guidance: guidanceText,
          references: "KDIGO Clinical Practice Guideline for Acute Kidney Injury. Kidney Int Suppl. 2012;2(1):1-138."
        };
      }
    },

    // ==========================================
    // E. URINE STUDIES AND RENAL INTERPRETATION
    // ==========================================
    {
      id: "urineAnionGap",
      cat: "renal",
      subcat: "Urine Studies and Renal Interpretation",
      name: "Urine Anion Gap",
      desc: "Evaluates unmeasured urinary ammonium (NH₄⁺) in normal anion gap acidosis.",
      fields: [
        N("una", "Urine Sodium (mEq/L)", 40, { min: 1, max: 250 }),
        N("uk", "Urine Potassium (mEq/L)", 25, { min: 1, max: 200 }),
        N("ucl", "Urine Chloride (mEq/L)", 85, { min: 1, max: 300 })
      ],
      calc: v => {
        const uag = (+v.una + +v.uk) - +v.ucl;
        let c = uag < 0 ? "Negative UAG (<0 mEq/L; intact NH₄⁺ excretion; suggests gastrointestinal HCO₃ loss / diarrhea)" : "Positive UAG (>0 mEq/L; impaired NH₄⁺ excretion; suggests distal Renal Tubular Acidosis)";
        
        let guidanceText = uag < 0
          ? "Negative urine anion gap. Kidneys are appropriately excreting ammonium with chloride (e.g., in response to extra-renal bicarbonate loss such as diarrhea)."
          : "Positive urine anion gap. Reflects low urinary ammonium excretion, pointing toward distal renal tubular acidosis (Type 1 RTA) or hypoaldosteronism (Type 4 RTA).";

        return {
          value: uag + " mEq/L — " + c,
          eq: "Urine Anion Gap = (UNa + UK) − UCl. A negative gap reflects ammonium (NH₄⁺) accompanied by chloride.",
          guidance: guidanceText,
          references: "Batlle DC, Husted M, Kuchel GA, Arruda JA. The use of the urine anion gap in the diagnosis of hyperchloremic metabolic acidosis. N Engl J Med. 1988;318(10):594-599."
        };
      }
    },
    {
      id: "urineOsmolality",
      cat: "renal",
      subcat: "Urine Studies and Renal Interpretation",
      name: "Urine Osmolality Interpretation",
      desc: "Distinguishes water diuresis from solute diuresis in polyuric states.",
      fields: [
        N("uosm", "Urine Osmolality (mOsm/kg)", 95, { min: 30, max: 1400 })
      ],
      calc: v => {
        const u = +v.uosm;
        let s = u < 150 ? "Water diuresis (<150 mOsm/kg; primary polydipsia or central/nephrogenic diabetes insipidus)" : u > 300 ? "Solute / osmotic diuresis (>300 mOsm/kg; glucose, urea, mannitol, saline loading)" : "Mixed or indeterminate diuresis (150–300 mOsm/kg)";
        
        let guidanceText = u < 150
          ? "Water diuresis. Highly suggestive of primary polydipsia or central/nephrogenic diabetes insipidus."
          : u > 300
          ? "Solute diuresis. Excess excretion of unmeasured solutes (glucose in uncontrolled diabetes, urea, or mannitol)."
          : "Indeterminate urine osmolality.";

        return {
          value: u + " mOsm/kg — " + s,
          eq: "Urine osmolality <150 mOsm/kg indicates suppression or absence of ADH effect.",
          guidance: guidanceText,
          references: "Robertson GL. Regulation of vasopressin function in health and disease. Recent Prog Horm Res. 1977;33:333-385."
        };
      }
    },
    {
      id: "hematuriaChecklist",
      cat: "renal",
      subcat: "Urine Studies and Renal Interpretation",
      name: "Hematuria Evaluation Checklist",
      desc: "Glomerular vs urological etiology differentiation.",
      fields: [
        S("casts", "RBC casts or dysmorphic RBCs (>50% acanthocytes)", "0", [["0", "Absent"], ["1", "Present"]]),
        S("proteinuria", "Concomitant significant proteinuria (UPCR >0.5 or UACR >300)", "0", [["0", "Absent"], ["1", "Present"]]),
        S("clots", "Gross hematuria with visible blood clots", "0", [["0", "Absent"], ["1", "Present"]]),
        S("brown", "Smoky, tea-colored, or cola-colored urine", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const glom = +v.casts === 1 || +v.proteinuria === 1 || +v.brown === 1;
        const uro = +v.clots === 1;
        let c = "";
        let guidanceText = "";
        if (glom && !uro) {
          c = "Glomerular etiology strongly favored (nephrology referral and biopsy evaluation indicated)";
          guidanceText = "Features suggest glomerular bleeding (nephritis, IgA nephropathy, Alport syndrome). Nephrology referral and serological workup indicated.";
        } else if (uro && !glom) {
          c = "Urological / lower tract source favored (cystoscopy and contrast CT urography indicated)";
          guidanceText = "Features strongly favor urological pathology (malignancy, stones, infection, BPH). Urology evaluation with cystoscopy and CT urography required.";
        } else {
          c = "Indeterminate / overlapping features (nephrology and urology evaluation warranted)";
          guidanceText = "Overlapping or indeterminate features. Dual evaluation by nephrology and urology may be required.";
        }
        return {
          value: c,
          eq: "Dysmorphic RBCs/casts indicate glomerular bleeding; blood clots virtually always denote urological source.",
          guidance: guidanceText,
          references: "American Urological Association. Diagnosis, Evaluation, and Follow-up of Asymptomatic Microhematuria (AMH) in Adults: AUA Guideline. 2020."
        };
      }
    },

    // ==========================================
    // F. GLOMERULAR DISEASE AND NEPHROTIC SYNDROME
    // ==========================================
    {
      id: "nephroticClassifier",
      cat: "renal",
      subcat: "Glomerular Disease and Nephrotic Syndrome",
      name: "Nephrotic-Range Proteinuria Classifier",
      desc: "Evaluates presence of classic nephrotic syndrome triad.",
      fields: [
        N("upcr", "Urine Protein-to-Creatinine Ratio (g/g)", 4.2, { min: 0.1, max: 25, step: 0.1 }),
        N("alb", "Serum Albumin (g/dL)", 2.4, { min: 0.5, max: 5.5, step: 0.1 }),
        S("edema", "Peripheral / periorbital edema present", "1", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const prot = +v.upcr >= 3.5;
        const hypoalb = +v.alb < 3.0;
        const edema = v.edema === "1";
        let c = (prot && hypoalb && edema) ? "Complete Nephrotic Syndrome (Proteinuria ≥3.5 g/g, Albumin <3.0 g/dL, Edema)" : prot ? "Nephrotic-Range Proteinuria without complete nephrotic syndrome" : "Sub-nephrotic proteinuria (<3.5 g/g)";
        
        let guidanceText = (prot && hypoalb && edema)
          ? "Complete nephrotic syndrome confirmed. Initiate evaluation for primary glomerulopathies (membranous nephropathy, minimal change disease, FSGS) or secondary causes (diabetes, amyloidosis, lupus). Initiate edema management (diuretics), lipid control, and thromboembolism prophylaxis if indicated."
          : "Proteinuria or hypoalbuminemia present. Evaluate underlying glomerular pathology.";

        return {
          value: c,
          eq: "Nephrotic syndrome definition requires triad: heavy proteinuria (>3.5 g/24h or UPCR ≥3.5), hypoalbuminemia (<3.0 g/dL), and edema.",
          guidance: guidanceText,
          references: "KDIGO 2021 Clinical Practice Guideline for the Management of Glomerular Diseases. Kidney Int. 2021;100(4S):S1-S276."
        };
      }
    },
    {
      id: "nephriticChecklist",
      cat: "renal",
      subcat: "Glomerular Disease and Nephrotic Syndrome",
      name: "Nephritic Syndrome Evaluation Checklist",
      desc: "Screens for acute glomerulonephritis / rapidly progressive GN triad.",
      fields: [
        S("sediment", "Active urinary sediment (hematuria with dysmorphic RBCs or RBC casts)", "1", [["0", "No"], ["1", "Yes"]]),
        S("htn", "New or acutely worsening hypertension", "1", [["0", "No"], ["1", "Yes"]]),
        S("aki", "Acute kidney injury (elevated creatinine / oliguria)", "1", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const total = +v.sediment + +v.htn + +v.aki;
        let c = total === 3 ? "Classic Acute Nephritic Syndrome triad present — Urgent nephrology evaluation for RPGN" : total === 2 ? "Incomplete nephritic syndrome" : "Criteria not met for nephritic syndrome";
        
        let guidanceText = total === 3
          ? "Classic acute nephritic syndrome triad present. High suspicion for rapidly progressive glomerulonephritis (RPGN). Urgent nephrology consultation, serological workup (ANCA, anti-GBM, complement, ANA/dsDNA), and emergent renal biopsy."
          : "Incomplete nephritic features. Maintain clinical suspicion for glomerular disease.";

        return {
          value: c,
          eq: "Acute nephritic syndrome: Active urinary sediment + Hypertension + Acute renal failure. Rule out rapidly progressive glomerulonephritis.",
          guidance: guidanceText,
          references: "KDIGO 2021 Clinical Practice Guideline for the Management of Glomerular Diseases. Kidney Int. 2021;100(4S):S1-S276."
        };
      }
    },
    {
      id: "lupusNephritisRef",
      cat: "renal",
      subcat: "Glomerular Disease and Nephrotic Syndrome",
      name: "Lupus Nephritis Classification Reference",
      desc: "ISN/RPS renal biopsy histological classification.",
      fields: [
        S("class", "Histological Class", "IV", [
          ["I", "Class I — Minimal mesangial lupus nephritis"],
          ["II", "Class II — Mesangial proliferative lupus nephritis"],
          ["III", "Class III — Focal lupus nephritis (<50% of glomeruli)"],
          ["IV", "Class IV — Diffuse lupus nephritis (≥50% of glomeruli; highest risk)"],
          ["V", "Class V — Membranous lupus nephritis"],
          ["VI", "Class VI — Advanced sclerotic lupus nephritis (≥90% sclerosed)"]
        ])
      ],
      calc: v => {
        let tx = (v.class === "III" || v.class === "IV") ? "Active proliferative disease: requires intense immunosuppressive induction (corticosteroids + mycophenolate or cyclophosphamide)." : v.class === "V" ? "Membranous: treat based on proteinuria severity and nephrotic complications." : "Non-proliferative / sclerotic stage.";
        
        let guidanceText = (v.class === "III" || v.class === "IV")
          ? "Proliferative lupus nephritis (Class III/IV). High risk of progressive renal damage. Aggressive immunosuppressive induction therapy required."
          : "Refer to rheumatology and nephrology for tailored lupus nephritis management protocols.";

        return {
          value: "ISN/RPS Class " + v.class + " — " + tx,
          eq: "Renal biopsy is required to guide treatment in systemic lupus erythematosus with active urinary sediment or proteinuria.",
          guidance: guidanceText,
          references: "Bajema IM, Wilhelmus S, Alpers CE, et al. Revision of the International Society of Nephrology/Renal Pathology Society classification for lupus nephritis: clarification of definitions, and clinical utility. Kidney Int. 2018;93(4):789-796."
        };
      }
    },
    {
      id: "complementSerology",
      cat: "renal",
      subcat: "Glomerular Disease and Nephrotic Syndrome",
      name: "Complement & Serology Interpretation Guide",
      desc: "Differential diagnosis of glomerulonephritis based on C3/C4 levels.",
      fields: [
        S("c3", "Serum C3 Level", "low", [["low", "Low C3"], ["normal", "Normal C3"]]),
        S("c4", "Serum C4 Level", "low", [["low", "Low C4"], ["normal", "Normal C4"]])
      ],
      calc: v => {
        let ddx = "";
        let guidanceText = "";
        if (v.c3 === "low" && v.c4 === "low") {
          ddx = "Low C3 & Low C4: Systemic Lupus Erythematosus (classical pathway), Mixed Cryoglobulinemia, Infective Endocarditis.";
          guidanceText = "Activation of the classical complement pathway. Check ANA, dsDNA, cryoglobulins, blood cultures, and hepatitis serologies.";
        } else if (v.c3 === "low" && v.c4 === "normal") {
          ddx = "Low C3 with Normal C4: Post-streptococcal GN, C3 glomerulopathy / dense deposit disease, atheroembolism.";
          guidanceText = "Activation of the alternative complement pathway. Check ASO titer, anti-DNase B, and evaluate for C3 glomerulopathy.";
        } else {
          ddx = "Normal C3 & C4: IgA Nephropathy, ANCA-associated vasculitis (GPA, MPA), Anti-GBM (Goodpasture) disease.";
          guidanceText = "Complement levels are normal. Evaluate for IgA nephropathy, ANCA vasculitis (MPO/PR3), or anti-GBM disease.";
        }
        return {
          value: ddx,
          eq: "Serum complement levels represent the primary laboratory branch point in evaluating acute glomerulonephritis.",
          guidance: guidanceText,
          references: "KDIGO 2021 Clinical Practice Guideline for the Management of Glomerular Diseases. Kidney Int. 2021;100(4S):S1-S276."
        };
      }
    },

    // ==========================================
    // G. CKD PROGRESSION AND KIDNEY FAILURE RISK
    // ==========================================
    {
      id: "kfre4Var",
      cat: "renal",
      subcat: "CKD Progression and Kidney Failure Risk",
      name: "Kidney Failure Risk Equation (KFRE — 4-Variable)",
      desc: "Predicts 2-year and 5-year probability of needing dialysis or kidney transplantation.",
      fields: [
        N("age", "Age (years)", 62, { min: 18, max: 100 }),
        S("sex", "Sex", "male", [["male", "Male"], ["female", "Female"]]),
        N("egfr", "eGFR (mL/min/1.73m²)", 28, { min: 5, max: 60 }),
        N("uacr", "Urine Albumin-to-Creatinine Ratio (mg/g)", 450, { min: 10, max: 5000 })
      ],
      calc: v => {
        const age = +v.age, egfr = +v.egfr, uacr = +v.uacr, female = v.sex === "female";
        const logUacr = Math.log(uacr);
        const lp = -0.2201 * (age / 10 - 7.03) + (female ? -0.2467 : 0) - 0.5567 * (egfr / 5 - 7.22) + 0.4510 * (logUacr - 5.137);

        const risk2yr = Math.max(0, Math.min(100, (1 - Math.pow(0.9750, Math.exp(lp))) * 100));
        const risk5yr = Math.max(0, Math.min(100, (1 - Math.pow(0.9240, Math.exp(lp))) * 100));

        let interp = risk2yr > 10 ? "High 2-year risk (>10%): prompt vascular access planning & transplant referral" : "Moderate 2-year risk (≤10%)";
        
        let guidanceText = risk2yr > 10
          ? "High 2-year risk of kidney failure (>10%). Urgent nephrology co-management, timely vascular access planning (AV fistula creation), and kidney transplantation evaluation (living and deceased donor listing)."
          : "Moderate-to-low 2-year risk of progression. Continue aggressive nephroprotection and risk factor control.";

        return {
          value: "2-Year Risk: " + risk2yr.toFixed(1) + "% | 5-Year Risk: " + risk5yr.toFixed(1) + "% (" + interp + ")",
          eq: "Tangri 4-Variable KFRE: Predicts treated kidney failure (dialysis or preemptive transplant) in CKD Stages 3–5.",
          guidance: guidanceText,
          references: "Tangri N, Grams ME, Levey AS, et al. Multinational Assessment of Accuracy of Equations for Predicting Risk of Kidney Failure: A Meta-analysis. JAMA. 2016;315(2):164-174."
        };
      }
    },

    // ==========================================
    // H. TRANSPLANT AND DIALYSIS-RELATED ASSESSMENT
    // ==========================================
    {
      id: "txReferralCheck",
      cat: "renal",
      subcat: "Transplant and Dialysis-Related Assessment",
      name: "Kidney Transplant Referral Checklist",
      desc: "Clinical evaluation thresholds for pre-emptive transplant workup.",
      fields: [
        N("egfr", "Current eGFR (mL/min/1.73m²)", 18, { min: 1, max: 60 }),
        S("esrd", "Currently on chronic maintenance dialysis?", "0", [["0", "No"], ["1", "Yes"]]),
        S("contra", "Active absolute contraindications (active malignancy, ongoing substance abuse, refractory infection, severe active cardiovascular instability)", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const eligible = (+v.egfr <= 20 || v.esrd === "1") && v.contra === "0";
        let c = eligible ? "Eligible for Kidney Transplant Evaluation (eGFR ≤20 mL/min/1.73m² without active contraindications)" : v.contra === "1" ? "Active contraindication present; requires stabilization before transplant evaluation" : "eGFR >20 mL/min/1.73m²: continue medical management; refer when eGFR approaches 20";
        
        let guidanceText = eligible
          ? "Patient meets criteria for kidney transplant evaluation. Pre-emptive transplantation offers superior survival and quality of life compared to initiating maintenance dialysis."
          : v.contra === "1"
          ? "Active contraindications must be addressed and stabilized prior to initiating formal transplant workup."
          : "Continue routine CKD management; monitor for approach to eGFR threshold of 20 mL/min/1.73m².";

        return {
          value: c,
          eq: "UNOS and international guidelines recommend pre-emptive transplant workup when eGFR reaches ≤20 mL/min/1.73m².",
          guidance: guidanceText,
          references: "KDIGO Clinical Practice Guideline on the Evaluation and Care of Living Kidney Donors. Transplantation. 2017;101(3S Suppl 1):S1-S109."
        };
      }
    },
    {
      id: "accessRecirc",
      cat: "renal",
      subcat: "Transplant and Dialysis-Related Assessment",
      name: "Vascular Access Recirculation",
      desc: "Urea-based calculation of access recirculation in AV fistulas and grafts.",
      fields: [
        N("sys", "Systemic / Peripheral BUN (mg/dL)", 60, { min: 10, max: 200 }),
        N("art", "Arterial Port BUN (mg/dL)", 54, { min: 10, max: 200 }),
        N("ven", "Venous Port BUN (mg/dL)", 18, { min: 2, max: 150 })
      ],
      calc: v => {
        const sys = +v.sys, art = +v.art, ven = +v.ven;
        if (sys === ven) return { value: "Invalid BUN inputs", eq: "Systemic and venous BUN cannot be identical.", guidance: "Invalid input values.", references: "National Kidney Foundation. KDOQI Clinical Practice Guideline for Vascular Access: 2019 Update. Am J Kidney Dis. 2020;75(2 Suppl 2):S1-S164." };
        const recirc = ((sys - art) / (sys - ven)) * 100;
        let c = recirc > 10 ? "ELEVATED RECIRCULATION (>10%): Suggests venous outflow stenosis or reversed access lines" : "Normal access recirculation (≤10%)";
        
        let guidanceText = recirc > 10
          ? "Elevated access recirculation (>10%). Indicates significant stenosis within the AV fistula/graft or inadvertently reversed blood lines. Vascular access ultrasound and fistula evaluation indicated."
          : "Normal access recirculation.";

        return {
          value: recirc.toFixed(1) + "% — " + c,
          eq: "Recirculation % = [(Systemic BUN − Arterial BUN) ÷ (Systemic BUN − Venous BUN)] × 100%.",
          guidance: guidanceText,
          references: "National Kidney Foundation. KDOQI Clinical Practice Guideline for Vascular Access: 2019 Update. Am J Kidney Dis. 2020;75(2 Suppl 2):S1-S164."
        };
      }
    },

    // ==========================================
    // I. RENAL COMPLICATIONS AND MEDICATION SAFETY
    // ==========================================
    {
      id: "ironStudiesCkd",
      cat: "renal",
      subcat: "Renal Complications and Medication Safety",
      name: "Iron Indices: TSAT and Ferritin",
      desc: "KDIGO targets for managing anemia and guiding iron therapy in CKD.",
      fields: [
        N("tsat", "Transferrin Saturation (TSAT, %)", 22, { min: 1, max: 100 }),
        N("ferritin", "Serum Ferritin (ng/mL)", 250, { min: 5, max: 5000 })
      ],
      calc: v => {
        const t = +v.tsat, f = +v.ferritin;
        let c = "";
        let guidanceText = "";
        if (t <= 30 && f <= 500) {
          c = "Candidate for iron supplementation (TSAT ≤30% and Ferritin ≤500 ng/mL before or during ESA therapy)";
          guidanceText = "Meets criteria for iron supplementation (IV iron preferred in CKD stages 4-5 or on dialysis) to correct iron deficiency and prepare for or support erythropoiesis-stimulating agent (ESA) therapy.";
        } else if (t > 30 && f > 500) {
          c = "Adequate iron stores / replete (hold IV iron unless hyporesponsive)";
          guidanceText = "Iron stores are replete. Hold intravenous iron supplementation to avoid risk of iron overload and toxicity.";
        } else {
          c = "Borderline / intermediate iron stores (evaluate reticulocyte hemoglobin / trend)";
          guidanceText = "Intermediate iron indices. Individualize iron therapy based on hemoglobin trends and ESA requirements.";
        }
        return {
          value: "TSAT: " + t + "% | Ferritin: " + f + " ng/mL — " + c,
          eq: "KDIGO Anemia: Target TSAT >30% and Ferritin >500 ng/mL prior to escalating ESA therapy.",
          guidance: guidanceText,
          references: "KDIGO Clinical Practice Guideline for Anemia in Chronic Kidney Disease. Kidney Int Suppl. 2012;2(4):279-335."
        };
      }
    },
    {
      id: "contrastAkiCheck",
      cat: "renal",
      subcat: "Renal Complications and Medication Safety",
      name: "Contrast-Associated AKI Risk Assessment",
      desc: "Checklist for identifying patients requiring peri-procedural volume prophylaxis.",
      fields: [
        N("egfr", "Baseline eGFR (mL/min/1.73m²)", 28, { min: 5, max: 120 }),
        S("diabetes", "Diabetes Mellitus present?", "1", [["0", "No"], ["1", "Yes"]]),
        S("hypovolemia", "Hypovolemia / shock / dehydration present?", "0", [["0", "No"], ["1", "Yes"]]),
        S("route", "Contrast Administration Route", "ia", [["ia", "Intra-arterial with first-pass renal exposure"], ["iv", "Intravenous (e.g., contrast CT)"]])
      ],
      calc: v => {
        const highRisk = +v.egfr < 30 || (+v.egfr < 45 && v.diabetes === "1" && v.route === "ia") || v.hypovolemia === "1";
        let c = highRisk 
          ? "HIGH RISK for Contrast-Induced AKI: Prophylactic IV isotonic hydration (0.9% NaCl or NaHCO₃) strongly recommended; minimize contrast volume" 
          : "Standard / Low risk: Routine IV hydration generally not mandated for IV contrast if eGFR ≥30.";
        
        let guidanceText = highRisk
          ? "High risk for contrast-associated AKI. Administer peri-procedural IV isotonic crystalloids, hold nephrotoxic agents (NSAIDs, ACEi/ARB/diuretics temporarily if appropriate), and use the minimum possible volume of low-osmolality contrast."
          : "Standard risk profile. Standard precautions and hydration as clinically indicated.";

        return {
          value: c,
          eq: "ACR/NKF Consensus: Prophylaxis indicated for intra-arterial contrast with eGFR <45, or IV contrast with eGFR <30 mL/min/1.73m².",
          guidance: guidanceText,
          references: "American College of Radiology / National Kidney Foundation. ACR Manual on Contrast Media. 2023."
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
