// cardio.js
(function () {
  window.MedCalcModules = window.MedCalcModules || [];

  const category = {
    id: "cardio",
    name: "Cardiology",
    icon: "🫀",
    desc: "Hemodynamics, prevention, valvular disease, HF, arrhythmias, and ACS"
  };

  const guidance = {
    // Pulmonary Hypertension & Right Heart
    phClassifier: [
      "Invasive classification using RHC. mPAP >20 mmHg defines PH. PAWP ≤15 defines pre-capillary; PAWP >15 with PVR ≤2 WU defines IpcPH, while PVR >2 WU defines CpcPH.",
      "Identifies hemodynamic subgroups to guide therapy and prevent inappropriate vasodilator use."
    ],
    pvrCalc: [
      "PVR = (mPAP − PAWP) ÷ CO. Normal PVR is <2 Wood Units (<160 dyn·s·cm⁻⁵). Elevated PVR (>2 WU) marks pulmonary vascular remodeling.",
      "Measures precapillary resistance via invasive right-heart catheterization."
    ],
    tpgCalc: [
      "TPG = mPAP − PAWP. Historically, >12 mmHg suggested disproportionate precapillary remodeling, though DPG/PVR are less flow-dependent.",
      "Calculates pressure drop across the pulmonary bed from invasive RHC."
    ],
    dpgCalc: [
      "DPG = dPAP − PAWP. A value ≥7 mmHg suggests precapillary remodeling in post-capillary pulmonary hypertension.",
      "Detects precapillary vascular changes in elevated left-sided filling pressures."
    ],
    rvspEcho: [
      "RVSP = 4 × (TR velocity)² + estimated RAP. In the absence of RVOT obstruction or pulmonic stenosis, RVSP ≈ PASP.",
      "Non-invasive echocardiographic screening estimate for pulmonary pressures."
    ],
    tapsePasp: [
      "TAPSE/PASP ratio is an echocardiographic surrogate for RV-PA coupling. A ratio <0.31 mm/mmHg indicates poor coupling and higher clinical risk.",
      "Assesses right ventricular reserve against pulmonary vascular afterload."
    ],
    rvFunctionEcho: [
      "Evaluates RV function: abnormal if TAPSE <17 mm, RV FAC <35%, or tricuspid lateral S' <9.5 cm/s.",
      "Transthoracic echocardiographic assessment of RV systolic function."
    ],

    // Hypertension & Prevention
    bpCategory: [
      "Classifies blood pressure based on ACC/AHA guidelines: Normal (<120/<80), Elevated (120–129/<80), Stage 1 HTN (130–139 or 80–89), Stage 2 HTN (≥140 or ≥90), Crisis (>180 and/or >120).",
      "Standardizes hypertension diagnosis and targets."
    ],
    mapCalc: [
      "MAP = DBP + 1/3(SBP − DBP) = (SBP + 2×DBP)/3. An adequate MAP (typically ≥65 mmHg) is necessary for vital organ perfusion.",
      "Calculates mean arterial driving perfusion pressure."
    ],
    pulsePressure: [
      "Pulse pressure = SBP − DBP. Values >60 mmHg reflect large-artery stiffness; very low pulse pressures (<30 mmHg) may indicate low stroke volume.",
      "Screening index for arterial compliance and hemodynamic state."
    ],
    orthostaticBp: [
      "Orthostatic hypotension is defined as a drop in SBP ≥20 mmHg or DBP ≥10 mmHg within 3 minutes of standing.",
      "Evaluates autonomic regulation, volume depletion, and fall risk."
    ],
    ascvdRisk: [
      "Pooled Cohort Equations estimate 10-year risk of first hard ASCVD event (nonfatal MI, CHD death, fatal/nonfatal stroke).",
      "Guides primary prevention statin and blood pressure management."
    ],
    ahaPreventPlanned: [
      "Planned — multi-variable AHA PREVENT risk equations incorporating eGFR and heart failure outcomes.",
      "Under review for integration with complete laboratory inputs."
    ],
    lipidCalc: [
      "Calculates Non-HDL-C (Total Cholesterol − HDL-C) and LDL-C using the Friedewald formula (Total Cholesterol − HDL-C − Triglycerides/5). Valid when TG <400 mg/dL.",
      "Determines atherogenic lipid particles for cardiovascular prevention."
    ],
    bsaBmi: [
      "Calculates Body Mass Index (BMI = kg/m²) and Body Surface Area using Mosteller formula (√(height(cm) × weight(kg) / 3600)).",
      "Standardizes medication dosing, cardiac indices, and hemodynamic parameters."
    ],

    // Interventional Cardiology
    syntaxScore: [
      "Tertile stratification for coronary artery disease complexity: Low (≤22), Intermediate (23–32), High (≥33).",
      "Aids heart team decision-making between PCI and CABG in multi-vessel CAD."
    ],
    mehranAki: [
      "Mehran score predicts risk of contrast-associated acute kidney injury and dialysis after PCI.",
      "Guides peri-procedural hydration, contrast volume thresholds, and renal monitoring."
    ],
    preciseDapt: [
      "PRECISE-DAPT score assesses out-of-hospital bleeding risk on DAPT. Score ≥25 suggests shorter DAPT (e.g., 3–6 months); <25 favors standard/prolonged duration.",
      "Tailors DAPT duration at hospital discharge following stent implantation."
    ],
    daptScore: [
      "Applied after 12 months of uneventful DAPT: Score ≥2 favors prolonged DAPT (ischemic benefit outweighs bleeding); <2 favors stopping DAPT.",
      "Guides late DAPT extension decisions in patients without prior major bleeding."
    ],
    arcHbr: [
      "Academic Research Consortium for High Bleeding Risk: defined by ≥1 major criterion or ≥2 minor criteria.",
      "Standardizes clinical trial and bedside assessment of bleeding risk in PCI."
    ],
    crusadeScore: [
      "Predicts in-hospital major bleeding in acute NSTE-ACS.",
      "Supports safer antithrombotic dosing and bleeding avoidance strategies."
    ],
    cacAgatston: [
      "Agatston CAC scoring: 0 (very low risk), 1–99 (mild plaque), 100–399 (moderate), ≥400 (extensive atherosclerotic burden).",
      "Guides statin decision-making in borderline-to-intermediate ASCVD risk."
    ],

    // Valvular Heart Disease
    asSeverity: [
      "Severe AS is defined by aortic valve area (AVA) ≤1.0 cm² (indexed <0.6 cm²/m²), peak velocity ≥4.0 m/s, or mean gradient ≥40 mmHg.",
      "Grades aortic stenosis severity to guide intervention and surveillance."
    ],
    avaContinuity: [
      "Continuity equation: AVA = (LVOT area × LVOT VTI) ÷ AV VTI = (0.785 × LVOT diameter² × LVOT VTI) ÷ AV VTI.",
      "Gold-standard echocardiographic calculation of effective aortic valve orifice area."
    ],
    mvaPht: [
      "MVA = 220 ÷ Pressure Half-Time (PHT). Validated in rheumatic mitral stenosis.",
      "Estimates mitral valve area without geometry assumptions; less reliable post-valvuloplasty or in severe AR."
    ],
    meanGradInterp: [
      "Classifies valve gradient: severe AS typically has mean gradient ≥40 mmHg; severe MS typically has mean gradient ≥5–10 mmHg.",
      "Correlates Doppler-derived mean gradient with hemodynamic obstruction."
    ],
    regurgFraction: [
      "Regurgitant Fraction (RF) = (Regurgitant Volume ÷ Total Stroke Volume) × 100%. Severe regurgitation is generally indicated by RF ≥50%.",
      "Quantifies regurgitant severity independent of chamber compliance."
    ],
    pisaEroa: [
      "PISA method: Flow = 2π × r² × V_alias. EROA = Flow ÷ Peak Velocity. Regurgitant Volume = EROA × VTI.",
      "Echocardiographic quantification of valvular regurgitant severity."
    ],
    ppmValve: [
      "Prosthetic valve-patient mismatch: Indexed EOA (EOA / BSA). Aortic: severe if <0.65 cm²/m² (obese <0.55–0.60). Mitral: severe if <0.9 cm²/m².",
      "Predicts adverse hemodynamics and reduced survival post-valve replacement."
    ],

    // Heart Failure & Cardiomyopathy
    nyhaClass: [
      "Class I: no limitation; Class II: slight limitation with ordinary activity; Class III: marked limitation with less than ordinary activity; Class IV: symptoms at rest.",
      "Standardized functional classification of heart failure symptoms."
    ],
    accAhaHfStage: [
      "Stage A (at risk), Stage B (pre-heart failure / structural change), Stage C (symptomatic heart failure), Stage D (advanced heart failure).",
      "Emphasizes prevention, structural progression, and specialized therapies."
    ],
    maggicScore: [
      "Estimates 1-year and 3-year mortality in heart failure across both preserved and reduced ejection fraction.",
      "Validated comprehensive prognostic model using readily available bedside variables."
    ],
    seattleHfPlanned: [
      "Planned — multi-drug titration regression model.",
      "Full parametric model planned for future expansion."
    ],
    adhereTree: [
      "ADHERE risk tree stratifies in-hospital mortality in acutely decompensated HF using BUN (≥43 mg/dL), SBP (<115 mmHg), and Creatinine (≥2.75 mg/dL).",
      "Rapid emergency department bedside triage for acute heart failure decompensation."
    ],
    h2fpefScore: [
      "H₂FPEF score estimates probability that dyspnea is due to heart failure with preserved ejection fraction (HFpEF). Score ≥6 denotes high probability (>90%).",
      "Discriminates HFpEF from non-cardiac causes of dyspnea."
    ],
    hfaPeffPlanned: [
      "Planned — stepwise diagnostic algorithm incorporating comprehensive rest and stress echocardiographic criteria.",
      "Algorithm requires advanced diastolic stress and biomarker criteria."
    ],
    lvefClassifier: [
      "Classifies HF by EF: HFrEF (≤40%), HFmrEF (41–49%), HFpEF (≥50%), and HFimpEF (baseline ≤40% with ≥10-point increase and second measurement >40%).",
      "Guides guideline-directed medical therapy (GDMT) selection."
    ],
    cardiacOutputEcho: [
      "SV = 0.785 × (LVOT diameter)² × LVOT VTI. CO = SV × HR / 1000. CI = CO ÷ BSA.",
      "Calculates non-invasive stroke volume, cardiac output, and cardiac index."
    ],

    // Arrhythmia & Stroke Risk
    cha2ds2vasc: [
      "Estimates stroke risk in non-valvular AF. Score ≥2 in men or ≥3 in women indicates oral anticoagulation.",
      "Clinical guideline standard for thromboprophylaxis in atrial fibrillation."
    ],
    hasbled: [
      "HAS-BLED assesses 1-year bleeding risk on anticoagulation. Score ≥3 warrants caution, frequent review, and addressing modifiable risk factors.",
      "Identifies bleed risk factors; not an automatic reason to withhold anticoagulation."
    ],
    orbitBleed: [
      "ORBIT score assesses major bleeding risk in atrial fibrillation patients on anticoagulants: 0–2 low, 3 medium, 4–7 high.",
      "Simplified bleeding score with strong predictive accuracy in DOAC-treated patients."
    ],
    atriaStroke: [
      "ATRIA stroke score stratifies ischemic stroke risk in non-valvular AF: 0–5 low, 6 moderate, 7–15 high risk.",
      "Alternative stroke risk stratification tool incorporating renal impairment and proteinuria."
    ],
    ehraScore: [
      "EHRA symptom score for AF: Class I (no symptoms), IIa (mild), IIb (moderate), III (severe), IV (disabling).",
      "Measures symptom impact and treatment response in atrial fibrillation."
    ],
    qtcCalc: [
      "Calculates rate-corrected QT interval using Bazett (QT / √RR) and Fridericia (QT / ∛RR). Bazett overcorrects at high heart rates; Fridericia is preferred.",
      "Screens for congenital or drug-induced long QT syndrome and arrhythmogenic risk."
    ],
    qtNomogram: [
      "Evaluates QT–Heart Rate pairs against the dangerous threshold on the QT nomogram.",
      "Assesses torsadogenic risk in clinical toxicology and psychotropic overdoses."
    ],
    rrIntervalCalc: [
      "Converts ventricular heart rate to RR interval (RR [ms] = 60,000 / HR) and calculates rhythm intervals.",
      "Basic electrophysiology conversion for ECG measurements."
    ],

    // Acute Coronary Syndrome (ACS)
    heartScore: [
      "Stratifies 6-week MACE risk in acute chest pain: 0–3 low risk (early discharge candidate), 4–6 moderate, 7–10 high.",
      "Emergency department chest pain pathway standard."
    ],
    timiUaNstemi: [
      "TIMI Risk Score for UA/NSTEMI predicts 14-day all-cause mortality, new/recurrent MI, or severe ischemia requiring urgent revascularization.",
      "Guides early invasive strategy in non-ST elevation acute coronary syndromes."
    ],
    grace2Score: [
      "Simplified points model based on the GRACE 2.0 score estimating in-hospital and 6-month mortality in ACS.",
      "Risk-stratifies ACS to determine timing of invasive coronary angiography."
    ],
    edacsScore: [
      "Emergency Department Assessment of Chest Pain Score. Score <16 with non-ischemic ECG and negative serial troponins identifies low-risk patients suitable for early discharge.",
      "Accelerated diagnostic protocol for chest pain triage."
    ],
    killipClass: [
      "Killip classification in acute MI: I (no rales/S3), II (rales <50% lung fields or S3), III (overt pulmonary edema), IV (cardiogenic shock).",
      "Prognostic bedside classification of heart failure complicating acute myocardial infarction."
    ],
    sgarbossaCriteria: [
      "Identifies acute myocardial infarction in the presence of Left Bundle Branch Block (LBBB) or ventricular pacing. Uses concordant ST elevation, concordant ST depression in V1–V3, and excessive discordant ST elevation.",
      "Detects occlusive myocardial infarction obscured by baseline conduction abnormalities."
    ],
    dukeTreadmill: [
      "Duke Treadmill Score = Exercise time (minutes) − (5 × ST deviation [mm]) − (4 × Treadmill Angina Index). Low risk ≥+5, moderate −10 to +4, high risk ≤−11.",
      "Prognostic risk assessment during exercise treadmill testing."
    ]
  };

  const tools = [
    // ==========================================
    // 1. PULMONARY HYPERTENSION AND RIGHT HEART
    // ==========================================
    {
      id: "phClassifier",
      cat: "cardio",
      subcat: "Pulmonary Hypertension and Right Heart",
      name: "Pulmonary Hypertension Hemodynamic Classifier",
      desc: "Invasive classification of pulmonary hypertension using RHC metrics (ESC/ERS definitions).",
      fields: [
        N("mpap", "Mean Pulmonary Arterial Pressure (mPAP, mmHg)", 25, { min: 0, max: 150 }),
        N("pawp", "Pulmonary Artery Wedge Pressure (PAWP, mmHg)", 12, { min: 0, max: 80 }),
        N("pvr", "Pulmonary Vascular Resistance (PVR, Wood Units)", 3.2, { min: 0, max: 40, step: 0.1 })
      ],
      calc: v => {
        const mpap = +v.mpap, pawp = +v.pawp, pvr = +v.pvr;
        let c = "";
        if (mpap <= 20) {
          c = "No pulmonary hypertension (mPAP ≤ 20 mmHg)";
        } else if (pawp <= 15) {
          c = pvr > 2 ? "Pre-capillary Pulmonary Hypertension (mPAP >20, PAWP ≤15, PVR >2 WU)" : "mPAP >20, but PVR ≤2 WU (unclassified / high flow)";
        } else {
          c = pvr <= 2 ? "Isolated Post-Capillary PH (IpcPH) (PAWP >15, PVR ≤2 WU)" : "Combined Post- & Pre-Capillary PH (CpcPH) (PAWP >15, PVR >2 WU)";
        }
        return {
          value: c,
          eq: "Invasive RHC criteria: mPAP >20 mmHg defines PH. Pre-capillary: PAWP ≤15 mmHg and PVR >2 WU. Post-capillary: PAWP >15 mmHg (IpcPH if PVR ≤2 WU; CpcPH if PVR >2 WU)."
        };
      }
    },
    {
      id: "pvrCalc",
      cat: "cardio",
      subcat: "Pulmonary Hypertension and Right Heart",
      name: "PVR (Pulmonary Vascular Resistance)",
      desc: "Calculates PVR in Wood Units and dyn·s·cm⁻⁵ via invasive catheterization.",
      fields: [
        N("mpap", "Mean Pulmonary Arterial Pressure (mPAP, mmHg)", 30, { min: 0, max: 150 }),
        N("pawp", "Pulmonary Artery Wedge Pressure (PAWP, mmHg)", 12, { min: 0, max: 80 }),
        N("co", "Cardiac Output (CO, L/min)", 4.5, { min: 0.1, max: 25, step: 0.1 })
      ],
      calc: v => {
        const wu = (+v.mpap - +v.pawp) / +v.co;
        return {
          value: wu.toFixed(2) + " Wood Units (" + Math.round(wu * 80) + " dyn·s·cm⁻⁵)",
          eq: "PVR = (mPAP − PAWP) ÷ CO. Normal is <2.0 Wood Units (<160 dyn·s·cm⁻⁵). Invasive catheterization required."
        };
      }
    },
    {
      id: "tpgCalc",
      cat: "cardio",
      subcat: "Pulmonary Hypertension and Right Heart",
      name: "Transpulmonary Gradient",
      desc: "Calculates TPG (mPAP − PAWP) from invasive catheterization.",
      fields: [
        N("mpap", "Mean Pulmonary Arterial Pressure (mPAP, mmHg)", 32, { min: 0, max: 150 }),
        N("pawp", "Pulmonary Artery Wedge Pressure (PAWP, mmHg)", 14, { min: 0, max: 80 })
      ],
      calc: v => {
        const tpg = +v.mpap - +v.pawp;
        return {
          value: tpg + " mmHg — " + (tpg > 12 ? "Elevated (>12 mmHg)" : "Normal (≤12 mmHg)"),
          eq: "TPG = mPAP − PAWP. Historically >12 mmHg suggested out-of-proportion pre-capillary remodeling. Sensitive to volume/cardiac output."
        };
      }
    },
    {
      id: "dpgCalc",
      cat: "cardio",
      subcat: "Pulmonary Hypertension and Right Heart",
      name: "Diastolic Pulmonary Gradient",
      desc: "Calculates DPG (dPAP − PAWP) from invasive catheterization.",
      fields: [
        N("dpap", "Diastolic Pulmonary Arterial Pressure (dPAP, mmHg)", 18, { min: 0, max: 120 }),
        N("pawp", "Pulmonary Artery Wedge Pressure (PAWP, mmHg)", 10, { min: 0, max: 80 })
      ],
      calc: v => {
        const dpg = +v.dpap - +v.pawp;
        return {
          value: dpg + " mmHg — " + (dpg >= 7 ? "Elevated (≥7 mmHg; precapillary component)" : "Normal (<7 mmHg)"),
          eq: "DPG = dPAP − PAWP. DPG ≥7 mmHg in post-capillary PH identifies combined post- and pre-capillary PH (CpcPH). Flow-independent."
        };
      }
    },
    {
      id: "rvspEcho",
      cat: "cardio",
      subcat: "Pulmonary Hypertension and Right Heart",
      name: "RVSP Estimate from TR Velocity",
      desc: "Estimates RVSP via peak tricuspid regurgitation (TR) velocity and IVC collapsibility.",
      fields: [
        N("trv", "Peak TR Velocity (m/s)", 2.8, { min: 0.5, max: 7.0, step: 0.1 }),
        S("rap", "Estimated RAP from IVC", "3", [
          ["3", "3 mmHg (IVC ≤2.1 cm, collapses >50%)"],
          ["8", "8 mmHg (Intermediate / indeterminate)"],
          ["15", "15 mmHg (IVC >2.1 cm, collapses <50%)"]
        ])
      ],
      calc: v => {
        const grad = 4 * Math.pow(+v.trv, 2);
        const rvsp = grad + +v.rap;
        return {
          value: rvsp.toFixed(1) + " mmHg — " + (rvsp > 35 ? "Elevated" : "Normal range"),
          eq: "Modified Bernoulli: RVSP = 4 × (TR velocity)² + RAP. Peak gradient = " + grad.toFixed(1) + " mmHg. In the absence of pulmonic stenosis, RVSP ≈ PASP."
        };
      }
    },
    {
      id: "tapsePasp",
      cat: "cardio",
      subcat: "Pulmonary Hypertension and Right Heart",
      name: "TAPSE/PASP Ratio",
      desc: "Echocardiographic index of right ventricular-arterial (RV-PA) coupling.",
      fields: [
        N("tapse", "TAPSE (mm)", 18, { min: 1, max: 45, step: 1 }),
        N("pasp", "Estimated PASP / RVSP (mmHg)", 40, { min: 5, max: 150, step: 1 })
      ],
      calc: v => {
        const r = +v.tapse / +v.pasp;
        const s = r < 0.31 ? "Severely impaired coupling (<0.31)" : r <= 0.36 ? "Intermediate / reduced (0.31–0.36)" : "Preserved coupling (>0.36)";
        return {
          value: r.toFixed(2) + " mm/mmHg — " + s,
          eq: "Ratio = TAPSE (mm) ÷ PASP (mmHg). Lower ratios correlate with adverse prognosis in pulmonary hypertension."
        };
      }
    },
    {
      id: "rvFunctionEcho",
      cat: "cardio",
      subcat: "Pulmonary Hypertension and Right Heart",
      name: "Right Ventricular Function Indices",
      desc: "Evaluates RV longitudinal and radial performance across three standard echo metrics.",
      fields: [
        N("tapse", "TAPSE (mm)", 19, { min: 1, max: 45, step: 1 }),
        N("fac", "RV Fractional Area Change (FAC, %)", 38, { min: 1, max: 80, step: 1 }),
        N("sprime", "Tricuspid Lateral Annular S' velocity (cm/s)", 11, { min: 1, max: 35, step: 0.5 })
      ],
      calc: v => {
        const abn = [];
        if (+v.tapse < 17) abn.push("TAPSE <17 mm");
        if (+v.fac < 35) abn.push("FAC <35%");
        if (+v.sprime < 9.5) abn.push("S' <9.5 cm/s");
        return {
          value: abn.length === 0 ? "Normal RV systolic function across all indices" : "Abnormal indices: " + abn.join(", "),
          eq: "Cut-offs: TAPSE ≥17 mm, RV FAC ≥35%, Tricuspid lateral S' ≥9.5 cm/s. Non-invasive echocardiographic parameters."
        };
      }
    },

    // ==========================================
    // 2. HYPERTENSION AND CARDIOVASCULAR PREVENTION
    // ==========================================
    {
      id: "bpCategory",
      cat: "cardio",
      subcat: "Hypertension and Cardiovascular Prevention",
      name: "Blood Pressure Category Classifier",
      desc: "ACC/AHA 2017 classification for adult resting blood pressure.",
      fields: [
        N("sbp", "Systolic Blood Pressure (mmHg)", 128, { min: 50, max: 300 }),
        N("dbp", "Diastolic Blood Pressure (mmHg)", 82, { min: 30, max: 200 })
      ],
      calc: v => {
        const s = +v.sbp, d = +v.dbp;
        let c = "";
        if (s > 180 || d > 120) c = "Hypertensive Crisis (immediate medical evaluation)";
        else if (s >= 140 || d >= 90) c = "Stage 2 Hypertension";
        else if ((s >= 130 && s <= 139) || (d >= 80 && d <= 89)) c = "Stage 1 Hypertension";
        else if (s >= 120 && s < 130 && d < 80) c = "Elevated Blood Pressure";
        else if (s < 120 && d < 80) c = "Normal Blood Pressure";
        else c = "Stage 1 Hypertension (isolated diastolic)";
        return {
          value: c,
          eq: "ACC/AHA 2017: Normal (<120 & <80), Elevated (120–129 & <80), Stage 1 (130–139 or 80–89), Stage 2 (≥140 or ≥90), Crisis (>180 and/or >120)."
        };
      }
    },
    {
      id: "mapCalc",
      cat: "cardio",
      subcat: "Hypertension and Cardiovascular Prevention",
      name: "Mean Arterial Pressure (MAP)",
      desc: "Perfusion pressure calculated from systolic and diastolic blood pressures.",
      fields: [
        N("sbp", "Systolic BP (mmHg)", 120, { min: 40, max: 280 }),
        N("dbp", "Diastolic BP (mmHg)", 80, { min: 20, max: 200 })
      ],
      calc: v => {
        const map = +v.dbp + (+v.sbp - +v.dbp) / 3;
        return {
          value: map.toFixed(1) + " mmHg",
          eq: "Formula: MAP = DBP + 1/3(SBP − DBP) = (SBP + 2×DBP)/3. Adequate organ perfusion typically requires MAP ≥65 mmHg."
        };
      }
    },
    {
      id: "pulsePressure",
      cat: "cardio",
      subcat: "Hypertension and Cardiovascular Prevention",
      name: "Pulse Pressure",
      desc: "Calculates pulse pressure (SBP − DBP) to evaluate vascular stiffness.",
      fields: [
        N("sbp", "Systolic BP (mmHg)", 130, { min: 40, max: 280 }),
        N("dbp", "Diastolic BP (mmHg)", 70, { min: 20, max: 200 })
      ],
      calc: v => {
        const pp = +v.sbp - +v.dbp;
        let c = pp > 60 ? "Wide pulse pressure (>60 mmHg; suggests arterial stiffness, aortic regurgitation)" : pp < 30 ? "Narrow pulse pressure (<30 mmHg; suggests low stroke volume, tamponade, shock)" : "Normal range (30–60 mmHg)";
        return {
          value: pp + " mmHg — " + c,
          eq: "Pulse pressure = SBP − DBP."
        };
      }
    },
    {
      id: "orthostaticBp",
      cat: "cardio",
      subcat: "Hypertension and Cardiovascular Prevention",
      name: "Orthostatic BP Change",
      desc: "Evaluates supine to standing changes in blood pressure and heart rate.",
      fields: [
        N("sbp_sup", "Supine Systolic BP (mmHg)", 130, { min: 50 }),
        N("dbp_sup", "Supine Diastolic BP (mmHg)", 80, { min: 30 }),
        N("hr_sup", "Supine Heart Rate (/min)", 70, { min: 30 }),
        N("sbp_std", "Standing Systolic BP (mmHg)", 105, { min: 50 }),
        N("dbp_std", "Standing Diastolic BP (mmHg)", 68, { min: 30 }),
        N("hr_std", "Standing Heart Rate (/min)", 92, { min: 30 })
      ],
      calc: v => {
        const dSbp = +v.sbp_std - +v.sbp_sup;
        const dDbp = +v.dbp_std - +v.dbp_sup;
        const dHr = +v.hr_std - +v.hr_sup;
        const ortho = dSbp <= -20 || dDbp <= -10;
        return {
          value: ortho ? "Positive for Orthostatic Hypotension" : "Negative for Orthostatic Hypotension",
          eq: "ΔSBP: " + dSbp + " mmHg, ΔDBP: " + dDbp + " mmHg, ΔHR: +" + dHr + " bpm. Diagnostic criteria: drop in SBP ≥20 mmHg or DBP ≥10 mmHg within 3 min of standing."
        };
      }
    },
    {
      id: "ascvdRisk",
      cat: "cardio",
      subcat: "Hypertension and Cardiovascular Prevention",
      name: "ASCVD 10-Year Risk",
      desc: "AHA/ACC Pooled Cohort Equations for primary prevention in non-diabetic/diabetic adults aged 40–79.",
      fields: [
        N("age", "Age (40–79 years)", 55, { min: 40, max: 79 }),
        S("sex", "Sex", "m", [["m", "Male"], ["f", "Female"]]),
        S("race", "Race", "white", [["white", "White / Other"], ["aa", "African American"]]),
        N("tc", "Total Cholesterol (mg/dL)", 200, { min: 100, max: 400 }),
        N("hdl", "HDL Cholesterol (mg/dL)", 50, { min: 10, max: 120 }),
        N("sbp", "Systolic BP (mmHg)", 130, { min: 80, max: 220 }),
        S("treated", "Treated for High Blood Pressure?", "0", [["0", "No"], ["1", "Yes"]]),
        S("smoker", "Current Smoker?", "0", [["0", "No"], ["1", "Yes"]]),
        S("diabetes", "Diabetes Mellitus?", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const lnAge = Math.log(+v.age), lnTc = Math.log(+v.tc), lnHdl = Math.log(+v.hdl), lnSbp = Math.log(+v.sbp);
        const treated = +v.treated, smoker = +v.smoker, dm = +v.diabetes;
        let sum = 0, s0 = 0, mean = 0;

        if (v.sex === "f" && v.race === "aa") {
          sum = 17.114 * lnAge + 0.940 * lnTc - 18.920 * lnHdl + 4.475 * (lnAge * lnHdl) + (treated ? 29.291 : 27.820) * lnSbp + (treated ? -6.432 : -6.087) * (lnAge * lnSbp) + 0.691 * smoker + 0.874 * dm;
          s0 = 0.9533; mean = 86.61;
        } else if (v.sex === "f") {
          sum = -29.799 * lnAge + 4.884 * Math.pow(lnAge, 2) + 13.540 * lnTc - 3.114 * (lnAge * lnTc) - 13.578 * lnHdl + 3.149 * (lnAge * lnHdl) + (treated ? 2.019 : 1.957) * lnSbp + 7.574 * smoker - 1.665 * (lnAge * smoker) + 0.661 * dm;
          s0 = 0.9665; mean = -29.18;
        } else if (v.sex === "m" && v.race === "aa") {
          sum = 2.469 * lnAge + 0.302 * lnTc - 0.307 * lnHdl + (treated ? 1.916 : 1.809) * lnSbp + 0.549 * smoker + 0.645 * dm;
          s0 = 0.8954; mean = 19.54;
        } else {
          sum = 12.344 * lnAge + 11.853 * lnTc - 2.664 * (lnAge * lnTc) - 7.990 * lnHdl + 1.769 * (lnAge * lnHdl) + (treated ? 1.797 : 1.764) * lnSbp + 7.837 * smoker - 1.795 * (lnAge * smoker) + 0.658 * dm;
          s0 = 0.9144; mean = 61.18;
        }

        const risk = Math.max(0, Math.min(100, (1 - Math.pow(s0, Math.exp(sum - mean))) * 100));
        let tier = risk < 5 ? "Low risk (<5%)" : risk < 7.5 ? "Borderline risk (5% to <7.5%)" : risk < 20 ? "Intermediate risk (7.5% to <20%)" : "High risk (≥20%)";
        return {
          value: risk.toFixed(1) + "% 10-year risk — " + tier,
          eq: "Calculated via ACC/AHA 2013 Pooled Cohort Equations. Risk categories: Low <5%, Borderline 5–7.4%, Intermediate 7.5–19.9%, High ≥20%."
        };
      }
    },
    {
      id: "ahaPreventPlanned",
      cat: "cardio",
      subcat: "Hypertension and Cardiovascular Prevention",
      name: "AHA PREVENT Risk Equations",
      desc: "Planned — 10- and 30-year CKM equations (incorporating eGFR, UACR, and heart failure risk).",
      planned: true
    },
    {
      id: "lipidCalc",
      cat: "cardio",
      subcat: "Hypertension and Cardiovascular Prevention",
      name: "LDL-C / Non-HDL-C Calculations",
      desc: "Calculates Non-HDL-C and Friedewald LDL-C (valid when TG <400 mg/dL).",
      fields: [
        N("tc", "Total Cholesterol (mg/dL)", 210, { min: 50, max: 700 }),
        N("hdl", "HDL Cholesterol (mg/dL)", 48, { min: 10, max: 150 }),
        N("tg", "Triglycerides (mg/dL)", 160, { min: 20, max: 1500 })
      ],
      calc: v => {
        const nonHdl = +v.tc - +v.hdl;
        if (+v.tg >= 400) {
          return {
            value: "Non-HDL-C: " + nonHdl + " mg/dL (Friedewald LDL invalid: TG ≥400)",
            eq: "Non-HDL-C = Total Chol − HDL. Friedewald equation is inaccurate when Triglycerides ≥400 mg/dL; use direct LDL measurement."
          };
        }
        const ldl = +v.tc - +v.hdl - (+v.tg / 5);
        return {
          value: "Calculated LDL-C: " + Math.round(ldl) + " mg/dL | Non-HDL-C: " + nonHdl + " mg/dL",
          eq: "Friedewald formula: LDL = Total Chol − HDL − (TG / 5). Non-HDL = Total Chol − HDL."
        };
      }
    },
    {
      id: "bsaBmi",
      cat: "cardio",
      subcat: "Hypertension and Cardiovascular Prevention",
      name: "BMI and Body-Surface Area (BSA)",
      desc: "Calculates BMI and Mosteller BSA for indexing hemodynamic and echocardiographic parameters.",
      fields: [
        N("height", "Height (cm)", 175, { min: 50, max: 250 }),
        N("weight", "Weight (kg)", 75, { min: 20, max: 300 })
      ],
      calc: v => {
        const htM = +v.height / 100;
        const bmi = +v.weight / (htM * htM);
        const bsa = Math.sqrt((+v.height * +v.weight) / 3600);
        let tier = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese";
        return {
          value: "BMI: " + bmi.toFixed(1) + " kg/m² (" + tier + ") | BSA: " + bsa.toFixed(2) + " m²",
          eq: "BMI = Weight (kg) ÷ Height (m)². Mosteller BSA = √((Height(cm) × Weight(kg)) ÷ 3600)."
        };
      }
    },

    // ==========================================
    // 3. INTERVENTIONAL CARDIOLOGY
    // ==========================================
    {
      id: "syntaxScore",
      cat: "cardio",
      subcat: "Interventional Cardiology",
      name: "SYNTAX Score (Anatomical Complexity)",
      desc: "Anatomical complexity tiering for multi-vessel CAD revascularization heart-team decisions.",
      fields: [
        S("tertile", "Anatomical Complexity Score Tier", "low", [
          ["low", "Low complexity (SYNTAX Score 0–22)"],
          ["mid", "Intermediate complexity (SYNTAX Score 23–32)"],
          ["high", "High complexity (SYNTAX Score ≥33)"]
        ]),
        S("lms", "Unprotected Left Main Involvement?", "0", [["0", "No"], ["1", "Yes"]]),
        S("cto", "Chronic Total Occlusion (CTO) present?", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        let rec = "";
        if (v.tertile === "low") rec = "PCI and CABG yield comparable long-term outcomes.";
        else if (v.tertile === "mid") rec = v.lms === "1" ? "Heart Team review: CABG preferred; PCI feasible based on anatomy." : "CABG generally preferred, PCI conditional.";
        else rec = "CABG offers superior long-term survival and revascularization freedom.";
        return {
          value: v.tertile.toUpperCase() + " tertile — " + rec,
          eq: "SYNTAX Tertiles: Low ≤22, Intermediate 23–32, High ≥33. Additional modifiers: LMS involvement: " + (v.lms === "1" ? "Yes" : "No") + "; CTO: " + (v.cto === "1" ? "Yes" : "No") + "."
        };
      }
    },
    {
      id: "mehranAki",
      cat: "cardio",
      subcat: "Interventional Cardiology",
      name: "Mehran Contrast-Associated AKI Risk Score",
      desc: "Calculates Mehran score for risk of nephropathy and dialysis following percutaneous coronary intervention.",
      fields: [
        S("hypotension", "Hypotension (SBP <80 requiring inotropes/IABP)", "0", [["0", "No (0)"], ["5", "Yes (+5)"]]),
        S("iabp", "Intra-aortic balloon pump (IABP)", "0", [["0", "No (0)"], ["5", "Yes (+5)"]]),
        S("chf", "Congestive heart failure (Class III/IV or pulmonary edema)", "0", [["0", "No (0)"], ["5", "Yes (+5)"]]),
        S("age", "Age >75 years", "0", [["0", "No (0)"], ["4", "Yes (+4)"]]),
        S("anemia", "Anemia (Hct <39% men, <36% women)", "0", [["0", "No (0)"], ["3", "Yes (+3)"]]),
        S("diabetes", "Diabetes mellitus", "0", [["0", "No (0)"], ["3", "Yes (+3)"]]),
        N("contrast", "Contrast Media Volume (mL)", 150, { min: 0, max: 1000 }),
        N("egfr", "eGFR (mL/min/1.73m²)", 60, { min: 5, max: 150 })
      ],
      calc: v => {
        const cPts = Math.floor(+v.contrast / 100);
        let gPts = 0;
        const g = +v.egfr;
        if (g < 20) gPts = 6;
        else if (g < 40) gPts = 4;
        else if (g < 60) gPts = 2;

        const score = +v.hypotension + +v.iabp + +v.chf + +v.age + +v.anemia + +v.diabetes + cPts + gPts;
        let risk = score <= 5 ? "Low risk (AKI ~7.5%, Dialysis ~0.04%)" : score <= 10 ? "Moderate risk (AKI ~14.0%, Dialysis ~0.12%)" : score <= 15 ? "High risk (AKI ~26.1%, Dialysis ~1.09%)" : "Very High risk (AKI ~57.3%, Dialysis ~12.6%)";
        return {
          value: score + " points — " + risk,
          eq: "Mehran points: Hypotension (+5), IABP (+5), CHF (+5), Age >75 (+4), Anemia (+3), Diabetes (+3), Contrast (+1 per 100mL), eGFR (<20: +6, 20–39: +4, 40–59: +2)."
        };
      }
    },
    {
      id: "preciseDapt",
      cat: "cardio",
      subcat: "Interventional Cardiology",
      name: "PRECISE-DAPT",
      desc: "Assesses out-of-hospital bleeding risk to guide DAPT duration post-stent placement.",
      fields: [
        N("hb", "Hemoglobin (g/dL)", 13.5, { min: 4, max: 22, step: 0.1 }),
        N("wbc", "White Blood Cell Count (10³/µL)", 8.0, { min: 1, max: 50, step: 0.1 }),
        N("age", "Age (years)", 65, { min: 18, max: 105 }),
        N("crcl", "Creatinine Clearance (mL/min)", 75, { min: 5, max: 200 }),
        S("bleed", "Prior spontaneous bleeding", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      calc: v => {
        let score = (18 - Math.min(+v.hb, 18)) * 3.5 + (+v.wbc * 0.8) + (+v.age * 0.4) + Math.max(0, (100 - +v.crcl) * 0.25) + (+v.bleed ? 15 : 0);
        score = Math.round(Math.max(0, score));
        let rec = score >= 25 ? "High bleeding risk (≥25): Favors short DAPT (3–6 months)" : "Non-high bleeding risk (<25): Standard/prolonged DAPT (12–24 months)";
        return {
          value: score + " points — " + rec,
          eq: "PRECISE-DAPT uses Hb, WBC, Age, CrCl, and Bleeding history. Score ≥25 identifies high bleeding risk favoring shortened DAPT."
        };
      }
    },
    {
      id: "daptScore",
      cat: "cardio",
      subcat: "Interventional Cardiology",
      name: "DAPT Score",
      desc: "Applied at 12 months post-PCI to decide continuation of dual antiplatelet therapy.",
      fields: [
        S("age", "Age category", "0", [["0", "<65 years (0)"], ["-1", "65–74 years (−1)"], ["-2", "≥75 years (−2)"]]),
        S("smoker", "Current cigarette smoker", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("dm", "Diabetes mellitus", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("mi", "MI at presentation", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("prior_pci_mi", "Prior PCI or prior MI", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("paclitaxel", "Paclitaxel-eluting stent", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("stent_diam", "Stent diameter <3 mm", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("chf", "CHF or LVEF <30%", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        S("vein_graft", "Vein graft PCI", "0", [["0", "No (0)"], ["2", "Yes (+2)"]])
      ],
      calc: v => {
        const score = +v.age + +v.smoker + +v.dm + +v.mi + +v.prior_pci_mi + +v.paclitaxel + +v.stent_diam + +v.chf + +v.vein_graft;
        let interp = score >= 2 ? "Score ≥2: Favorable benefit/risk ratio for prolonged DAPT (>12 months)" : "Score <2: Unfavorable benefit/risk; stop DAPT at 12 months";
        return {
          value: score + " points — " + interp,
          eq: "DAPT Score ranges from −2 to 10. Assesses ischemic vs bleeding benefit after 1 year of uneventful DAPT."
        };
      }
    },
    {
      id: "arcHbr",
      cat: "cardio",
      subcat: "Interventional Cardiology",
      name: "ARC-HBR Criteria",
      desc: "Standardized Academic Research Consortium definition for high bleeding risk post-PCI.",
      fields: [
        S("major", "Any Major Criteria? (OAC, severe renal eGFR<30, severe anemia Hb<11, prior ICH/stroke, recent major bleed, thrombocytopenia <50k)", "0", [["0", "No major criteria"], ["1", "1 major criterion"], ["2", "≥2 major criteria"]]),
        S("minor", "Number of Minor Criteria (Age ≥75, mild anemia, eGFR 30–59, minor bleed in prior year, chronic NSAID/steroid)", "0", [["0", "0 minor criteria"], ["1", "1 minor criterion"], ["2", "≥2 minor criteria"]])
      ],
      calc: v => {
        const isHbr = +v.major >= 1 || +v.minor >= 2;
        return {
          value: isHbr ? "High Bleeding Risk (ARC-HBR Positive)" : "Not High Bleeding Risk (ARC-HBR Negative)",
          eq: "ARC-HBR is defined by at least 1 Major criterion OR at least 2 Minor criteria. High bleeding risk is associated with >4% BARC 3–5 bleeding at 1 year."
        };
      }
    },
    {
      id: "crusadeScore",
      cat: "cardio",
      subcat: "Interventional Cardiology",
      name: "CRUSADE Bleeding Score",
      desc: "Predicts in-hospital major bleeding in acute non-ST-segment elevation ACS.",
      fields: [
        N("hct", "Baseline Hematocrit (%)", 38, { min: 10, max: 60 }),
        N("crcl", "Creatinine Clearance (mL/min)", 65, { min: 5, max: 180 }),
        N("hr", "Heart Rate (/min)", 80, { min: 30, max: 220 }),
        S("sex", "Sex", "0", [["0", "Male (0)"], ["8", "Female (+8)"]]),
        S("signs_hf", "Signs of Heart Failure at presentation", "0", [["0", "No (0)"], ["7", "Yes (+7)"]]),
        S("prior_vasc", "Prior Vascular Disease history", "0", [["0", "No (0)"], ["6", "Yes (+6)"]]),
        S("dm", "Diabetes Mellitus", "0", [["0", "No (0)"], ["6", "Yes (+6)"]]),
        N("sbp", "Systolic Blood Pressure (mmHg)", 130, { min: 60, max: 260 })
      ],
      calc: v => {
        let pts = +v.sex + +v.signs_hf + +v.prior_vasc + +v.dm;
        const hct = +v.hct, crcl = +v.crcl, hr = +v.hr, sbp = +v.sbp;
        if (hct < 31) pts += 9; else if (hct < 34) pts += 7; else if (hct < 37) pts += 3; else if (hct < 40) pts += 2;
        if (crcl <= 15) pts += 39; else if (crcl <= 30) pts += 35; else if (crcl <= 60) pts += 28; else if (crcl <= 90) pts += 17; else if (crcl <= 120) pts += 7;
        if (hr >= 121) pts += 11; else if (hr >= 111) pts += 10; else if (hr >= 101) pts += 8; else if (hr >= 91) pts += 6; else if (hr >= 81) pts += 3; else if (hr >= 71) pts += 1;
        if (sbp <= 90) pts += 10; else if (sbp <= 100) pts += 8; else if (sbp <= 110) pts += 5; else if (sbp <= 120) pts += 3; else if (sbp >= 201) pts += 5; else if (sbp >= 181) pts += 3; else if (sbp >= 161) pts += 1;

        let risk = pts <= 20 ? "Very low risk (3.1%)" : pts <= 30 ? "Low risk (5.5%)" : pts <= 40 ? "Moderate risk (8.6%)" : pts <= 50 ? "High risk (11.9%)" : "Very high risk (19.5%)";
        return {
          value: pts + " points — " + risk,
          eq: "CRUSADE Score predicts in-hospital major bleeding in NSTE-ACS. Stratified into very low (≤20) to very high (>50)."
        };
      }
    },
    {
      id: "cacAgatston",
      cat: "cardio",
      subcat: "Interventional Cardiology",
      name: "Coronary Artery Calcium (Agatston) Category",
      desc: "Stratifies cardiovascular risk by non-contrast cardiac CT calcium score.",
      fields: [
        N("cac", "Agatston CAC Score", 85, { min: 0, max: 5000, step: 1 })
      ],
      calc: v => {
        const c = +v.cac;
        let tier = "";
        if (c === 0) tier = "CAC = 0: Very low 10-year risk; statin may be withheld in borderline patients";
        else if (c < 100) tier = "CAC 1–99: Mild plaque; favors statin therapy, especially if age ≥55";
        else if (c < 400) tier = "CAC 100–399: Moderate atherosclerotic plaque; statin clearly indicated";
        else tier = "CAC ≥400: Extensive calcification; high risk; intensive preventive therapy indicated";
        return {
          value: c + " Agatston units — " + tier,
          eq: "Agatston Categories: 0 (Zero plaque), 1–99 (Mild), 100–399 (Moderate), ≥400 (Severe)."
        };
      }
    },

    // ==========================================
    // 4. VALVULAR HEART DISEASE
    // ==========================================
    {
      id: "asSeverity",
      cat: "cardio",
      subcat: "Valvular Heart Disease",
      name: "Aortic Stenosis Severity Classifier",
      desc: "Multimodality echocardiographic grading of native aortic stenosis severity.",
      fields: [
        N("vmax", "Peak Aortic Jet Velocity (Vmax, m/s)", 4.2, { min: 1, max: 8, step: 0.1 }),
        N("mg", "Mean Transaortic Gradient (mmHg)", 44, { min: 1, max: 120, step: 1 }),
        N("ava", "Aortic Valve Area (AVA, cm²)", 0.8, { min: 0.1, max: 4.0, step: 0.05 }),
        N("avai", "Indexed AVA (cm²/m²)", 0.45, { min: 0.1, max: 2.5, step: 0.05 })
      ],
      calc: v => {
        let c = "";
        if (+v.vmax >= 4.0 && +v.mg >= 40 && +v.ava <= 1.0) {
          c = "High-Gradient Severe Aortic Stenosis";
        } else if (+v.ava <= 1.0 && +v.mg < 40) {
          c = "Low-Gradient Severe AS (assess stroke volume index for paradoxical or low-flow low-gradient AS)";
        } else if (+v.vmax >= 3.0 || +v.mg >= 20 || +v.ava <= 1.5) {
          c = "Moderate Aortic Stenosis";
        } else {
          c = "Mild Aortic Stenosis";
        }
        return {
          value: c,
          eq: "Severe AS criteria: AVA ≤1.0 cm², Indexed AVA ≤0.6 cm²/m², Vmax ≥4.0 m/s, or Mean Gradient ≥40 mmHg."
        };
      }
    },
    {
      id: "avaContinuity",
      cat: "cardio",
      subcat: "Valvular Heart Disease",
      name: "Aortic Valve Area (Continuity Equation)",
      desc: "Calculates AVA using stroke volume through LVOT divided by AV VTI.",
      fields: [
        N("lvot_d", "LVOT Diameter (cm)", 2.0, { min: 1.0, max: 3.5, step: 0.1 }),
        N("lvot_vti", "LVOT VTI (cm)", 18, { min: 5, max: 50, step: 0.5 }),
        N("av_vti", "Aortic Valve VTI (cm)", 45, { min: 10, max: 120, step: 0.5 })
      ],
      calc: v => {
        const d = +v.lvot_d;
        const lvotArea = 0.7854 * Math.pow(d, 2);
        const ava = (lvotArea * +v.lvot_vti) / +v.av_vti;
        return {
          value: ava.toFixed(2) + " cm² (" + (ava <= 1.0 ? "Severe AS range" : ava <= 1.5 ? "Moderate AS range" : "Mild/Normal") + ")",
          eq: "Continuity: AVA = (LVOT Area × LVOT VTI) ÷ AV VTI. LVOT Area = 0.7854 × (LVOT diameter)² = " + lvotArea.toFixed(2) + " cm²."
        };
      }
    },
    {
      id: "mvaPht",
      cat: "cardio",
      subcat: "Valvular Heart Disease",
      name: "Mitral Valve Area (Pressure Half-Time)",
      desc: "Calculates MVA via Doppler deceleration pressure half-time in rheumatic mitral stenosis.",
      fields: [
        N("pht", "Mitral Deceleration Pressure Half-Time (PHT, ms)", 160, { min: 30, max: 600, step: 5 })
      ],
      calc: v => {
        const mva = 220 / +v.pht;
        let c = mva <= 1.0 ? "Very Severe MS" : mva <= 1.5 ? "Severe MS" : "Mild-to-Moderate MS";
        return {
          value: mva.toFixed(2) + " cm² — " + c,
          eq: "Hatle formula: MVA = 220 ÷ PHT (ms). Normal MVA is 4.0–5.0 cm²; severe stenosis is ≤1.5 cm²."
        };
      }
    },
    {
      id: "meanGradInterp",
      cat: "cardio",
      subcat: "Valvular Heart Disease",
      name: "Mean Pressure Gradient Interpretation",
      desc: "Classifies transvalvular mean pressure gradient for aortic or mitral valve.",
      fields: [
        S("valve", "Valve Evaluated", "aortic", [["aortic", "Aortic Valve"], ["mitral", "Mitral Valve"]]),
        N("grad", "Mean Doppler Gradient (mmHg)", 35, { min: 1, max: 120, step: 1 })
      ],
      calc: v => {
        const g = +v.grad;
        let s = "";
        if (v.valve === "aortic") {
          s = g >= 40 ? "Severe Aortic Stenosis range (≥40 mmHg)" : g >= 20 ? "Moderate Aortic Stenosis range (20–39 mmHg)" : "Mild Aortic Stenosis range (<20 mmHg)";
        } else {
          s = g >= 10 ? "Severe Mitral Stenosis range (≥10 mmHg)" : g >= 5 ? "Significant / Moderate Mitral Stenosis (5–9 mmHg)" : "Mild Mitral Stenosis (<5 mmHg)";
        }
        return {
          value: g + " mmHg — " + s,
          eq: "Calculated by tracing Doppler spectral envelope (VTI). Requires clinical correlation with stroke volume."
        };
      }
    },
    {
      id: "regurgFraction",
      cat: "cardio",
      subcat: "Valvular Heart Disease",
      name: "Regurgitant Fraction Calculator",
      desc: "Calculates regurgitant fraction from total stroke volume and regurgitant volume.",
      fields: [
        N("rvol", "Regurgitant Volume (mL/beat)", 55, { min: 1, max: 200 }),
        N("tsv", "Total Forward Stroke Volume (mL/beat)", 100, { min: 10, max: 300 })
      ],
      calc: v => {
        const rf = (+v.rvol / +v.tsv) * 100;
        let tier = rf >= 50 ? "Severe regurgitation (≥50%)" : rf >= 40 ? "Moderate-to-severe regurgitation (40–49%)" : rf >= 30 ? "Moderate regurgitation (30–39%)" : "Mild regurgitation (<30%)";
        return {
          value: rf.toFixed(1) + "% — " + tier,
          eq: "Regurgitant Fraction = (Regurgitant Volume ÷ Total Stroke Volume) × 100%."
        };
      }
    },
    {
      id: "pisaEroa",
      cat: "cardio",
      subcat: "Valvular Heart Disease",
      name: "PISA / EROA Calculator",
      desc: "Proximal isovelocity surface area method for regurgitant orifice area and volume.",
      fields: [
        N("radius", "PISA Radius (r, cm)", 0.9, { min: 0.1, max: 3.0, step: 0.1 }),
        N("valias", "Aliasing Velocity (cm/s)", 38, { min: 10, max: 80, step: 1 }),
        N("vmax", "Peak Regurgitant Jet Velocity (m/s)", 5.0, { min: 1.0, max: 7.0, step: 0.1 }),
        N("vti", "Regurgitant Jet VTI (cm)", 120, { min: 10, max: 300, step: 5 })
      ],
      calc: v => {
        const flow = 6.2832 * Math.pow(+v.radius, 2) * +v.valias;
        const eroa = flow / (+v.vmax * 100);
        const rvol = eroa * +v.vti;
        let tier = eroa >= 0.4 || rvol >= 60 ? "Severe Regurgitation (EROA ≥0.40 cm² or RVol ≥60 mL)" : eroa >= 0.2 || rvol >= 30 ? "Moderate Regurgitation" : "Mild Regurgitation";
        return {
          value: "EROA: " + eroa.toFixed(2) + " cm² | RVol: " + Math.round(rvol) + " mL/beat (" + tier + ")",
          eq: "PISA Flow = 2π × r² × V_alias. EROA = Flow ÷ Vmax. Regurgitant Volume = EROA × VTI."
        };
      }
    },
    {
      id: "ppmValve",
      cat: "cardio",
      subcat: "Valvular Heart Disease",
      name: "Prosthetic Valve-Patient Mismatch (Indexed EOA)",
      desc: "Calculates indexed effective orifice area for aortic and mitral prostheses.",
      fields: [
        S("position", "Valve Position", "aortic", [["aortic", "Aortic Valve Replacement"], ["mitral", "Mitral Valve Replacement"]]),
        N("eoa", "Prosthetic Valve EOA (cm²)", 1.3, { min: 0.4, max: 4.5, step: 0.05 }),
        N("bsa", "Patient BSA (m²)", 1.85, { min: 0.8, max: 3.2, step: 0.05 })
      ],
      calc: v => {
        const ieoa = +v.eoa / +v.bsa;
        let c = "";
        if (v.position === "aortic") {
          c = ieoa <= 0.65 ? "Severe Mismatch (≤0.65 cm²/m²)" : ieoa <= 0.85 ? "Moderate Mismatch (0.66–0.85 cm²/m²)" : "No hemodynamically significant mismatch (>0.85 cm²/m²)";
        } else {
          c = ieoa <= 0.90 ? "Severe Mismatch (≤0.90 cm²/m²)" : ieoa <= 1.20 ? "Moderate Mismatch (0.91–1.20 cm²/m²)" : "No significant mismatch (>1.20 cm²/m²)";
        }
        return {
          value: ieoa.toFixed(2) + " cm²/m² — " + c,
          eq: "Formula: Indexed EOA = Valve EOA ÷ BSA. Evaluates risk of abnormally high postoperative gradients."
        };
      }
    },

    // ==========================================
    // 5. HEART FAILURE AND CARDIOMYOPATHY
    // ==========================================
    {
      id: "nyhaClass",
      cat: "cardio",
      subcat: "Heart Failure and Cardiomyopathy",
      name: "NYHA Functional Class",
      desc: "Functional grading of heart failure symptom limitation.",
      fields: [
        S("class", "Select description", "I", [
          ["I", "Class I — No limitation of physical activity. Ordinary physical activity causes no symptoms."],
          ["II", "Class II — Slight limitation. Comfortable at rest, ordinary activity causes fatigue, palpitation, or dyspnea."],
          ["III", "Class III — Marked limitation. Comfortable at rest, less than ordinary activity causes symptoms."],
          ["IV", "Class IV — Inability to carry on physical activity without discomfort. Symptoms at rest."]
        ])
      ],
      calc: v => ({
        value: "NYHA " + v.class,
        eq: "New York Heart Association functional classification. Serial assessment tracks response to heart failure therapy."
      })
    },
    {
      id: "accAhaHfStage",
      cat: "cardio",
      subcat: "Heart Failure and Cardiomyopathy",
      name: "ACC/AHA Heart-Failure Stages",
      desc: "Four-stage structural and clinical progression of heart failure.",
      fields: [
        S("stage", "Clinical & Structural Stage", "C", [
          ["A", "Stage A: At risk for HF (risk factors without structural disease or symptoms)"],
          ["B", "Stage B: Pre-HF (structural heart disease, elevated biomarkers, no symptoms)"],
          ["C", "Stage C: Symptomatic HF (current or prior symptoms and structural disease)"],
          ["D", "Stage D: Advanced HF (refractory symptoms requiring advanced therapies/LVAD/transplant)"]
        ])
      ],
      calc: v => ({
        value: "ACC/AHA " + v.stage,
        eq: "Progression is unidirectional from A to D. Helps guide preventive and advanced mechanical/transplant interventions."
      })
    },
    {
      id: "maggicScore",
      cat: "cardio",
      subcat: "Heart Failure and Cardiomyopathy",
      name: "MAGGIC Mortality Risk Score",
      desc: "Predicts 1-year and 3-year mortality in HF across preserved and reduced ejection fraction.",
      fields: [
        N("age", "Age (years)", 65, { min: 18, max: 110 }),
        N("ef", "Ejection Fraction (%)", 35, { min: 10, max: 75 }),
        N("sbp", "Systolic BP (mmHg)", 115, { min: 60, max: 240 }),
        N("bmi", "BMI (kg/m²)", 26, { min: 12, max: 60 }),
        N("creat", "Serum Creatinine (mg/dL)", 1.2, { min: 0.3, max: 10.0, step: 0.1 }),
        S("nyha", "NYHA Class", "2", [["1", "Class I (0)"], ["2", "Class II (+2)"], ["3", "Class III (+6)"], ["4", "Class IV (+8)"]]),
        S("male", "Sex", "1", [["1", "Male (+1)"], ["0", "Female (0)"]]),
        S("smoker", "Current Smoker", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("dm", "Diabetes", "0", [["0", "No (0)"], ["1", "Yes (+3)"]]),
        S("copd", "COPD", "0", [["0", "No (0)"], ["1", "Yes (+2)"]]),
        S("first_hf", "First diagnosed within 18 months", "0", [["0", "No (0)"], ["1", "Yes (+2)"]]),
        S("no_bb", "Not prescribed Beta-Blocker", "0", [["0", "Prescribed BB (0)"], ["1", "Not on BB (+3)"]]),
        S("no_acei", "Not prescribed ACEi / ARB / ARNI", "0", [["0", "Prescribed (0)"], ["1", "Not prescribed (+1)"]])
      ],
      calc: v => {
        let pts = +v.nyha + +v.male + +v.smoker + +v.dm + +v.copd + +v.first_hf + +v.no_bb + +v.no_acei;
        const a = +v.age, ef = +v.ef, sbp = +v.sbp, bmi = +v.bmi, cr = +v.creat;
        if (a >= 80) pts += 10; else if (a >= 70) pts += 8; else if (a >= 60) pts += 5; else if (a >= 50) pts += 3;
        if (ef < 20) pts += 7; else if (ef < 30) pts += 5; else if (ef < 40) pts += 3;
        if (sbp < 110) pts += 5; else if (sbp < 130) pts += 3; else if (sbp < 150) pts += 1;
        if (bmi < 25) pts += 2;
        if (cr >= 2.5) pts += 4; else if (cr >= 1.5) pts += 2; else if (cr >= 1.1) pts += 1;

        return {
          value: pts + " points (MAGGIC Risk Score)",
          eq: "MAGGIC HF Risk Score predicts 1-year and 3-year mortality using 13 clinical variables. Validated in both HFrEF and HFpEF."
        };
      }
    },
    {
      id: "seattleHfPlanned",
      cat: "cardio",
      subcat: "Heart Failure and Cardiomyopathy",
      name: "Seattle Heart Failure Model",
      desc: "Planned — multi-variable parametric survival model.",
      planned: true
    },
    {
      id: "adhereTree",
      cat: "cardio",
      subcat: "Heart Failure and Cardiomyopathy",
      name: "ADHERE Risk Tree",
      desc: "Rapid emergency department bedside triage rule for acute decompensated heart failure.",
      fields: [
        N("bun", "Blood Urea Nitrogen (BUN, mg/dL)", 35, { min: 5, max: 200 }),
        N("sbp", "Systolic BP at admission (mmHg)", 110, { min: 50, max: 260 }),
        N("cr", "Serum Creatinine (mg/dL)", 1.4, { min: 0.3, max: 15.0, step: 0.1 })
      ],
      calc: v => {
        const bun = +v.bun, sbp = +v.sbp, cr = +v.cr;
        let risk = "";
        if (bun < 43) {
          risk = "Low risk (~2.1% in-hospital mortality)";
        } else if (sbp >= 115) {
          risk = "Intermediate risk (~5.5% in-hospital mortality)";
        } else if (cr >= 2.75) {
          risk = "High risk (~21.9% in-hospital mortality)";
        } else {
          risk = "Intermediate-High risk (~12.4% in-hospital mortality)";
        }
        return {
          value: risk,
          eq: "ADHERE algorithm: BUN ≥43 mg/dL, SBP <115 mmHg, and Creatinine ≥2.75 mg/dL identify highest in-hospital mortality."
        };
      }
    },
    {
      id: "h2fpefScore",
      cat: "cardio",
      subcat: "Heart Failure and Cardiomyopathy",
      name: "H₂FPEF Score",
      desc: "Distinguishes HFpEF from non-cardiac causes of unexplained dyspnea.",
      fields: [
        S("heavy", "Heavy (BMI >30 kg/m²)", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        S("htn", "Hypertensive (≥2 antihypertensive drugs)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("af", "Atrial Fibrillation (paroxysmal or persistent)", "0", [["0", "No (0)"], ["3", "Yes (+3)"]]),
        S("pulm_htn", "Pulmonary Hypertension (Echo PASP >35 mmHg)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("elderly", "Elder (Age >60 years)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("filling", "Filling Pressure (Doppler E/e' >9)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      calc: v => {
        const score = +v.heavy + +v.htn + +v.af + +v.pulm_htn + +v.elderly + +v.filling;
        let interp = score <= 1 ? "Low probability (<20% chance of HFpEF)" : score <= 5 ? "Intermediate probability (further diagnostic workup/stress testing required)" : "High probability (>90% likelihood of HFpEF)";
        return {
          value: score + " / 9 points — " + interp,
          eq: "H₂FPEF: Heavy (+2), Hypertensive (+1), AF (+3), Pulmonary HTN (+1), Elder (+1), Filling pressure (+1)."
        };
      }
    },
    {
      id: "hfaPeffPlanned",
      cat: "cardio",
      subcat: "Heart Failure and Cardiomyopathy",
      name: "HFA-PEFF Diagnostic Algorithm",
      desc: "Planned — ESC stepwise diagnostic scoring algorithm for HFpEF.",
      planned: true
    },
    {
      id: "lvefClassifier",
      cat: "cardio",
      subcat: "Heart Failure and Cardiomyopathy",
      name: "LVEF Category Classifier",
      desc: "Universal definition and guideline categorization based on left ventricular ejection fraction.",
      fields: [
        N("lvef", "Current Left Ventricular Ejection Fraction (%)", 45, { min: 5, max: 85 }),
        S("improved", "Prior LVEF was ≤40% with a ≥10-point increase?", "0", [["0", "No / First diagnosis"], ["1", "Yes"]])
      ],
      calc: v => {
        const ef = +v.lvef;
        let c = "";
        if (v.improved === "1" && ef > 40) c = "HF with Improved Ejection Fraction (HFimpEF)";
        else if (ef <= 40) c = "HF with Reduced Ejection Fraction (HFrEF)";
        else if (ef <= 49) c = "HF with Mildly Reduced Ejection Fraction (HFmrEF)";
        else c = "HF with Preserved Ejection Fraction (HFpEF)";
        return {
          value: c + " (LVEF " + ef + "%)",
          eq: "Categories: HFrEF ≤40%, HFmrEF 41–49%, HFpEF ≥50%, HFimpEF (baseline ≤40% with ≥10 pt increase and >40%)."
        };
      }
    },
    {
      id: "cardiacOutputEcho",
      cat: "cardio",
      subcat: "Heart Failure and Cardiomyopathy",
      name: "Cardiac Output, Cardiac Index and Stroke Volume",
      desc: "Doppler calculation of stroke volume, cardiac output, and cardiac index from LVOT.",
      fields: [
        N("lvot_d", "LVOT Diameter (cm)", 2.0, { min: 1.0, max: 3.5, step: 0.1 }),
        N("lvot_vti", "LVOT VTI (cm)", 20, { min: 5, max: 50, step: 0.5 }),
        N("hr", "Heart Rate (/min)", 72, { min: 30, max: 200 }),
        N("bsa", "Body Surface Area (m²)", 1.8, { min: 0.8, max: 3.2, step: 0.05 })
      ],
      calc: v => {
        const area = 0.7854 * Math.pow(+v.lvot_d, 2);
        const sv = area * +v.lvot_vti;
        const co = (sv * +v.hr) / 1000;
        const ci = co / +v.bsa;
        return {
          value: "CO: " + co.toFixed(2) + " L/min | CI: " + ci.toFixed(2) + " L/min/m² | SV: " + Math.round(sv) + " mL",
          eq: "SV = 0.7854 × (LVOT d)² × LVOT VTI. CO = SV × HR / 1000. CI = CO ÷ BSA. Normal CI is 2.5–4.0 L/min/m²."
        };
      }
    },

    // ==========================================
    // 6. ARRHYTHMIA AND STROKE RISK
    // ==========================================
    {
      id: "cha2ds2vasc",
      cat: "cardio",
      subcat: "Arrhythmia and Stroke Risk",
      name: "CHA₂DS₂-VASc",
      desc: "Stroke risk stratification in non-valvular atrial fibrillation.",
      fields: [
        S("chf", "Congestive heart failure history", "0", [["0", "No"], ["1", "Yes (+1)"]]),
        S("htn", "Hypertension history", "0", [["0", "No"], ["1", "Yes (+1)"]]),
        S("age", "Age category", "0", [["0", "<65 years (0)"], ["1", "65–74 years (+1)"], ["2", "≥75 years (+2)"]]),
        S("dm", "Diabetes mellitus history", "0", [["0", "No"], ["1", "Yes (+1)"]]),
        S("stroke", "Prior Stroke / TIA / Thromboembolism", "0", [["0", "No"], ["2", "Yes (+2)"]]),
        S("vasc", "Vascular disease (prior MI, PAD, aortic plaque)", "0", [["0", "No"], ["1", "Yes (+1)"]]),
        S("sex", "Sex category", "0", [["0", "Male (0)"], ["1", "Female (+1)"]])
      ],
      calc: v => {
        const score = +v.chf + +v.htn + +v.age + +v.dm + +v.stroke + +v.vasc + +v.sex;
        let risk = v.sex === "1" ? (score === 1 ? "Low risk (female baseline)" : score === 2 ? "Moderate risk" : "High risk (anticoagulation recommended)") : (score === 0 ? "Low risk" : score === 1 ? "Moderate risk" : "High risk (anticoagulation recommended)");
        return {
          value: score + " / 9 points — " + risk,
          eq: "CHA₂DS₂-VASc: CHF (+1), HTN (+1), Age ≥75 (+2), DM (+1), Stroke/TIA (+2), Vasc (+1), Age 65–74 (+1), Female (+1)."
        };
      }
    },
    {
      id: "hasbled",
      cat: "cardio",
      subcat: "Arrhythmia and Stroke Risk",
      name: "HAS-BLED",
      desc: "Major bleeding risk assessment for patients on anticoagulation.",
      fields: [
        S("h", "Hypertension (uncontrolled SBP >160 mmHg)", "0", [["0", "No"], ["1", "Yes (+1)"]]),
        S("a_renal", "Abnormal renal function (dialysis, transplant, Cr >2.26)", "0", [["0", "No"], ["1", "Yes (+1)"]]),
        S("a_liver", "Abnormal liver function (cirrhosis, bili >2x, AST/ALT >3x)", "0", [["0", "No"], ["1", "Yes (+1)"]]),
        S("s", "Stroke history", "0", [["0", "No"], ["1", "Yes (+1)"]]),
        S("b", "Prior major bleeding or predisposition", "0", [["0", "No"], ["1", "Yes (+1)"]]),
        S("l", "Labile INRs (TTR <60% if on VKA)", "0", [["0", "No / Not on VKA"], ["1", "Yes (+1)"]]),
        S("e", "Elderly (age >65 years)", "0", [["0", "No"], ["1", "Yes (+1)"]]),
        S("d_drugs", "Antiplatelet or NSAID medication", "0", [["0", "No"], ["1", "Yes (+1)"]]),
        S("d_alcohol", "Alcohol excess (≥8 drinks/week)", "0", [["0", "No"], ["1", "Yes (+1)"]])
      ],
      calc: v => {
        const score = +v.h + +v.a_renal + +v.a_liver + +v.s + +v.b + +v.l + +v.e + +v.d_drugs + +v.d_alcohol;
        return {
          value: score + " / 9 points — " + (score >= 3 ? "High bleeding risk (≥3; frequent review indicated)" : "Low to moderate bleeding risk"),
          eq: "HAS-BLED factors: H, A, S, B, L, E, D (1 pt each). Score ≥3 indicates caution and addressing modifiable risk factors."
        };
      }
    },
    {
      id: "orbitBleed",
      cat: "cardio",
      subcat: "Arrhythmia and Stroke Risk",
      name: "ORBIT Bleeding Score",
      desc: "Validated bedside bleeding score for patients on oral anticoagulation.",
      fields: [
        S("older", "Age ≥74 years", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("anemia", "Reduced Hb/Hct or anemia history", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        S("bleed", "Bleeding history", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        S("egfr", "Insufficient kidney function (eGFR <60)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("antiplatelet", "Treatment with antiplatelet agent", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      calc: v => {
        const score = +v.older + +v.anemia + +v.bleed + +v.egfr + +v.antiplatelet;
        let c = score <= 2 ? "Low risk (2.4 bleeds/100 pt-years)" : score === 3 ? "Medium risk (4.7 bleeds/100 pt-years)" : "High risk (8.1 bleeds/100 pt-years)";
        return {
          value: score + " / 7 points — " + c,
          eq: "ORBIT: Older ≥74 (+1), Reduced Hb (+2), Bleed history (+2), Insufficient GFR (+1), Treatment with antiplatelet (+1)."
        };
      }
    },
    {
      id: "atriaStroke",
      cat: "cardio",
      subcat: "Arrhythmia and Stroke Risk",
      name: "ATRIA Stroke and Bleeding Scores",
      desc: "Ischemic stroke risk prediction in atrial fibrillation incorporating proteinuria and renal disease.",
      fields: [
        S("age_stroke", "Age and Prior Stroke Interaction", "0", [
          ["0", "<65 without prior stroke (0)"],
          ["1", "65–74 without prior stroke (+1)"],
          ["2", "75–84 without prior stroke (+2)"],
          ["3", "≥85 without prior stroke (+3)"],
          ["6", "<65 WITH prior stroke (+6)"],
          ["7", "65–74 WITH prior stroke (+7)"],
          ["8", "75–84 WITH prior stroke (+8)"],
          ["9", "≥85 WITH prior stroke (+9)"]
        ]),
        S("female", "Female sex", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("dm", "Diabetes mellitus", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("chf", "Congestive heart failure", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("htn", "Hypertension", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("renal", "Proteinuria or eGFR <45 mL/min", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      calc: v => {
        const score = +v.age_stroke + +v.female + +v.dm + +v.chf + +v.htn + +v.renal;
        let tier = score <= 5 ? "Low risk (<1% / year)" : score === 6 ? "Moderate risk (1% to <2% / year)" : "High risk (≥2% / year)";
        return {
          value: score + " / 15 points — " + tier,
          eq: "ATRIA incorporates age/stroke interaction, sex, DM, CHF, HTN, and renal disease/proteinuria."
        };
      }
    },
    {
      id: "ehraScore",
      cat: "cardio",
      subcat: "Arrhythmia and Stroke Risk",
      name: "EHRA Symptom Classification",
      desc: "European Heart Rhythm Association classification of AF-related symptom impairment.",
      fields: [
        S("class", "Select description", "1", [
          ["1", "EHRA I — No symptoms"],
          ["2a", "EHRA IIa — Mild symptoms; normal daily activity not affected"],
          ["2b", "EHRA IIb — Moderate symptoms; normal daily activity not affected, but patient troubled"],
          ["3", "EHRA III — Severe symptoms; normal daily activity affected"],
          ["4", "EHRA IV — Disabling symptoms; normal daily activity discontinued"]
        ])
      ],
      calc: v => ({
        value: "EHRA Class " + v.class.toUpperCase(),
        eq: "Used to quantify symptom burden and gauge symptom-directed rhythm control response."
      })
    },
    {
      id: "qtcCalc",
      cat: "cardio",
      subcat: "Arrhythmia and Stroke Risk",
      name: "QTc Calculator (Bazett, Fridericia)",
      desc: "Calculates corrected QT intervals using heart rate or preceding RR interval.",
      fields: [
        N("qt", "Measured QT Interval (ms)", 410, { min: 200, max: 800 }),
        N("hr", "Heart Rate (/min)", 72, { min: 30, max: 240 })
      ],
      calc: v => {
        const rr = 60 / +v.hr;
        const qtSec = +v.qt / 1000;
        const qtcB = (qtSec / Math.sqrt(rr)) * 1000;
        const qtcF = (qtSec / Math.cbrt(rr)) * 1000;
        let note = qtcF > 480 ? "Prolonged QTc (Fridericia >480 ms)" : qtcF < 450 ? "Normal QTc range" : "Borderline prolonged QTc";
        return {
          value: "Fridericia QTc: " + Math.round(qtcF) + " ms | Bazett QTc: " + Math.round(qtcB) + " ms (" + note + ")",
          eq: "Fridericia = QT ÷ ∛RR. Bazett = QT ÷ √RR. Fridericia is preferred at tachycardia and bradycardia."
        };
      }
    },
    {
      id: "qtNomogram",
      cat: "cardio",
      subcat: "Arrhythmia and Stroke Risk",
      name: "Corrected QT and QT Nomogram Tools",
      desc: "Assesses risk of torsades de pointes based on QT interval and matching heart rate.",
      fields: [
        N("hr", "Heart Rate (/min)", 75, { min: 30, max: 200 }),
        N("qt", "Measured Uncorrected QT Interval (ms)", 440, { min: 200, max: 700 })
      ],
      calc: v => {
        const thresh = 480 - (+v.hr - 60) * 1.8;
        const above = +v.qt > thresh;
        return {
          value: above ? "Above the Nomogram Line — High Torsadogenic Risk" : "Below the Nomogram Line — Low Torsadogenic Risk",
          eq: "The QT nomogram evaluates uncorrected QT against HR. Pairs plotting above the line carry heightened risk for Torsades de Pointes."
        };
      }
    },
    {
      id: "rrIntervalCalc",
      cat: "cardio",
      subcat: "Arrhythmia and Stroke Risk",
      name: "Ventricular Rate and Rhythm Interval Calculator",
      desc: "Interconverts ventricular heart rate and electrocardiographic interval durations.",
      fields: [
        N("hr", "Ventricular Heart Rate (/min)", 75, { min: 20, max: 300 }),
        N("qrs", "QRS Duration (ms)", 90, { min: 40, max: 300 }),
        N("pr", "PR Interval (ms)", 160, { min: 60, max: 500 })
      ],
      calc: v => {
        const rr = 60000 / +v.hr;
        let rhythm = +v.qrs >= 120 ? "Wide QRS (≥120 ms; bundle branch block or ventricular conduction delay)" : "Normal QRS width (<120 ms)";
        let av = +v.pr > 200 ? "First-degree AV block (PR >200 ms)" : +v.pr < 120 ? "Short PR interval (<120 ms; pre-excitation / junctional)" : "Normal PR interval";
        return {
          value: "RR: " + Math.round(rr) + " ms (" + rhythm + "; " + av + ")",
          eq: "RR Interval (ms) = 60,000 ÷ Heart Rate (/min)."
        };
      }
    },

    // ==========================================
    // 7. ACUTE CORONARY SYNDROME (ACS)
    // ==========================================
    {
      id: "heartScore",
      cat: "cardio",
      subcat: "Acute Coronary Syndrome (ACS)",
      name: "HEART Score",
      desc: "Emergency department clinical pathway for 6-week MACE risk.",
      fields: [
        S("h", "History", "0", [["0", "Slightly suspicious (0)"], ["1", "Moderately suspicious (+1)"], ["2", "Highly suspicious (+2)"]]),
        S("e", "ECG", "0", [["0", "Normal (0)"], ["1", "Non-specific repolarization disturbance (+1)"], ["2", "Significant ST deviation (+2)"]]),
        S("a", "Age", "0", [["0", "<45 years (0)"], ["1", "45–64 years (+1)"], ["2", "≥65 years (+2)"]]),
        S("r", "Risk factors (HTN, DM, smoking, dyslipidemia, family history, obesity)", "0", [["0", "No risk factors (0)"], ["1", "1–2 risk factors (+1)"], ["2", "≥3 risk factors or atherosclerotic disease (+2)"]]),
        S("t", "Troponin", "0", [["0", "≤ Normal limit (0)"], ["1", "1–2x normal limit (+1)"], ["2", ">2x normal limit (+2)"]])
      ],
      calc: v => {
        const total = +v.h + +v.e + +v.a + +v.r + +v.t;
        let c = total <= 3 ? "Low risk (0.9–1.7% MACE) — candidate for early discharge" : total <= 6 ? "Moderate risk (12–16.6% MACE) — admission/observation recommended" : "High risk (50–65% MACE) — urgent invasive management candidate";
        return {
          value: total + " / 10 points — " + c,
          eq: "HEART: History (0–2) + ECG (0–2) + Age (0–2) + Risk factors (0–2) + Troponin (0–2)."
        };
      }
    },
    {
      id: "timiUaNstemi",
      cat: "cardio",
      subcat: "Acute Coronary Syndrome (ACS)",
      name: "TIMI Risk Score — UA/NSTEMI",
      desc: "Predicts 14-day mortality and ischemic events in unstable angina and NSTEMI.",
      fields: [
        S("age", "Age ≥65 years", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("cad_rf", "≥3 CAD Risk Factors (FHx, HTN, hyperlipidemia, DM, smoker)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("known_cad", "Known CAD (stenosis ≥50%)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("asa", "Aspirin use in past 7 days", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("angina", "Severe angina (≥2 episodes in 24 hours)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("st_dev", "ST deviation ≥0.5 mm on ECG", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("markers", "Elevated cardiac biomarkers", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      calc: v => {
        const total = +v.age + +v.cad_rf + +v.known_cad + +v.asa + +v.angina + +v.st_dev + +v.markers;
        let risk = total <= 2 ? "Low risk (4.7–8.3% 14-day ischemic event rate)" : total <= 4 ? "Intermediate risk (13.2–19.9% 14-day ischemic event rate)" : "High risk (26.2–40.9% 14-day ischemic event rate)";
        return {
          value: total + " / 7 points — " + risk,
          eq: "TIMI UA/NSTEMI gives 1 point each: Age ≥65, ≥3 CAD risk factors, Known CAD, ASA in past 7 days, Recent severe angina, ST deviation, Elevated markers."
        };
      }
    },
    {
      id: "grace2Score",
      cat: "cardio",
      subcat: "Acute Coronary Syndrome (ACS)",
      name: "GRACE 2.0",
      desc: "Stratifies in-hospital mortality across the acute coronary syndrome spectrum.",
      fields: [
        N("age", "Age (years)", 65, { min: 18, max: 110 }),
        N("hr", "Heart Rate (/min)", 82, { min: 30, max: 240 }),
        N("sbp", "Systolic BP (mmHg)", 125, { min: 50, max: 260 }),
        N("creat", "Serum Creatinine (mg/dL)", 1.1, { min: 0.3, max: 12.0, step: 0.1 }),
        S("arrest", "Cardiac arrest at presentation", "0", [["0", "No (0)"], ["39", "Yes (+39)"]]),
        S("st_dev", "ST-segment deviation", "0", [["0", "No (0)"], ["28", "Yes (+28)"]]),
        S("enzymes", "Elevated cardiac enzymes", "0", [["0", "No (0)"], ["14", "Yes (+14)"]]),
        S("killip", "Killip Class", "1", [["1", "Class I (0)"], ["2", "Class II (+20)"], ["3", "Class III (+39)"], ["4", "Class IV (+59)"]])
      ],
      calc: v => {
        let pts = +v.arrest + +v.st_dev + +v.enzymes + +v.killip;
        const a = +v.age, hr = +v.hr, sbp = +v.sbp, cr = +v.creat;
        if (a >= 80) pts += 90; else if (a >= 70) pts += 75; else if (a >= 60) pts += 58; else if (a >= 50) pts += 41; else if (a >= 40) pts += 25;
        if (hr >= 110) pts += 25; else if (hr >= 90) pts += 15; else if (hr >= 70) pts += 7;
        if (sbp < 100) pts += 53; else if (sbp < 120) pts += 43; else if (sbp < 140) pts += 34; else if (sbp < 160) pts += 24; else if (sbp < 200) pts += 10;
        if (cr >= 2.0) pts += 28; else if (cr >= 1.4) pts += 15; else if (cr >= 1.0) pts += 7;

        let risk = pts <= 108 ? "Low risk (<1% in-hospital mortality)" : pts <= 140 ? "Intermediate risk (1–3% in-hospital mortality)" : "High risk (>3% in-hospital mortality; early invasive strategy indicated)";
        return {
          value: pts + " points — " + risk,
          eq: "GRACE 2.0 incorporates Age, HR, SBP, Creatinine, Arrest, ST deviation, Enzymes, and Killip Class."
        };
      }
    },
    {
      id: "edacsScore",
      cat: "cardio",
      subcat: "Acute Coronary Syndrome (ACS)",
      name: "EDACS",
      desc: "Emergency Department Assessment of Chest Pain Score for accelerated triage.",
      fields: [
        N("age", "Age (years)", 52, { min: 18, max: 100 }),
        S("male", "Sex", "1", [["1", "Male (+6)"], ["0", "Female (0)"]]),
        S("cad_age", "Known CAD or ≥3 Risk Factors in male ≥45 or female ≥55", "0", [["0", "No (0)"], ["1", "Yes (+4)"]]),
        S("pain_shoulder", "Pain radiates to arm or shoulder", "0", [["0", "No (0)"], ["1", "Yes (+2)"]]),
        S("sweat", "Diaphoresis / sweating", "0", [["0", "No (0)"], ["1", "Yes (+2)"]]),
        S("pain_pressure", "Pain resembles prior MI or pressure-like", "0", [["0", "No (0)"], ["1", "Yes (+2)"]]),
        S("pain_tender", "Pain reproduced by palpation", "0", [["0", "No (0)"], ["1", "Yes (−4)"]])
      ],
      calc: v => {
        let pts = +v.male * 6 + +v.cad_age * 4 + +v.pain_shoulder * 2 + +v.sweat * 2 + +v.pain_pressure * 2 + (+v.pain_tender ? -4 : 0);
        const a = +v.age;
        if (a >= 55) pts += 8; else if (a >= 50) pts += 6; else if (a >= 45) pts += 4; else if (a >= 40) pts += 2;
        let c = pts < 16 ? "Low risk candidate (score <16; suitable for accelerated pathway if ECG & serial troponins negative)" : "Not low risk (score ≥16; full evaluation indicated)";
        return {
          value: pts + " points — " + c,
          eq: "EDACS <16 combined with non-ischemic ECG and 0h/2h negative biomarkers supports safe early discharge."
        };
      }
    },
    {
      id: "killipClass",
      cat: "cardio",
      subcat: "Acute Coronary Syndrome (ACS)",
      name: "Killip–Kimball classification",
      desc: "Bedside clinical assessment of heart failure severity in acute myocardial infarction.",
      fields: [
        S("class", "Clinical examination findings", "1", [
          ["1", "Killip I — No clinical signs of heart failure (rales absent, no S3)"],
          ["2", "Killip II — Mild-to-moderate HF (rales <50% of lung fields, S3 gallop)"],
          ["3", "Killip III — Severe HF / Overt pulmonary edema (rales >50% lung fields)"],
          ["4", "Killip IV — Cardiogenic shock (SBP <90 with tissue hypoperfusion)"]
        ])
      ],
      calc: v => {
        const mort = v.class === "1" ? "~6% in-hospital mortality" : v.class === "2" ? "~17% in-hospital mortality" : v.class === "3" ? "~38% in-hospital mortality" : "~81% in-hospital mortality";
        return {
          value: "Killip Class " + v.class + " (" + mort + ")",
          eq: "Killip classification stratifies acute myocardial infarction mortality risk at initial bedside examination."
        };
      }
    },
    {
      id: "sgarbossaCriteria",
      cat: "cardio",
      subcat: "Acute Coronary Syndrome (ACS)",
      name: "Sgarbossa / Modified Sgarbossa criteria",
      desc: "Detects acute occlusive MI in left bundle branch block (LBBB) or ventricular pacing.",
      fields: [
        S("concord_ste", "Concordant ST elevation ≥1 mm in any lead", "0", [["0", "No (0)"], ["1", "Yes (+5 Sgarbossa points)"]]),
        S("concord_std", "Concordant ST depression ≥1 mm in leads V1, V2, or V3", "0", [["0", "No (0)"], ["1", "Yes (+3 Sgarbossa points)"]]),
        S("mod_ratio", "Modified Sgarbossa rule: ST elevation / S-wave amplitude ratio ≤ −0.25 (excessive discordant STE ≥25%)", "0", [["0", "No"], ["1", "Yes (Modified criterion met)"]]),
        S("discord_ste", "Original Sgarbossa: Discordant ST elevation ≥5 mm", "0", [["0", "No (0)"], ["1", "Yes (+2 Sgarbossa points)"]])
      ],
      calc: v => {
        const pts = (+v.concord_ste ? 5 : 0) + (+v.concord_std ? 3 : 0) + (+v.discord_ste ? 2 : 0);
        const mod = +v.concord_ste || +v.concord_std || +v.mod_ratio;
        let res = "";
        if (pts >= 3 || mod) {
          res = "Positive for Occlusive MI in LBBB (Urgent reperfusion consideration)";
        } else {
          res = "Criteria not met for acute occlusive MI (Cannot exclude ischemia; correlate clinically)";
        }
        return {
          value: res + " (Original Sgarbossa: " + pts + " pts)",
          eq: "Original Sgarbossa score ≥3 is highly specific. Modified rule: any concordant STE ≥1mm, concordant STD V1–V3 ≥1mm, or discordant STE/S-wave ratio ≤ −0.25."
        };
      }
    },
    {
      id: "dukeTreadmill",
      cat: "cardio",
      subcat: "Acute Coronary Syndrome (ACS)",
      name: "Duke Treadmill Score",
      desc: "Prognostic risk and survival score for exercise treadmill stress testing.",
      fields: [
        N("time", "Exercise Treadmill Time (Bruce protocol, minutes)", 9.0, { min: 0.5, max: 30, step: 0.5 }),
        N("st", "Max Net ST-Segment Deviation (mm)", 1.0, { min: 0, max: 8, step: 0.5 }),
        S("angina", "Treadmill Angina Index", "0", [
          ["0", "0 — No angina during exercise"],
          ["1", "1 — Non-limiting exercise angina"],
          ["2", "2 — Exercise-limiting angina (test stopped due to chest pain)"]
        ])
      ],
      calc: v => {
        const dts = +v.time - (5 * +v.st) - (4 * +v.angina);
        let tier = dts >= 5 ? "Low risk (≥ +5; 5-year survival ~97%)" : dts >= -10 ? "Moderate risk (−10 to +4; 5-year survival ~90%)" : "High risk (≤ −11; 5-year survival ~65%; coronary angiography recommended)";
        return {
          value: dts.toFixed(1) + " points — " + tier,
          eq: "DTS = Exercise time (min) − (5 × ST deviation in mm) − (4 × Angina Index). Angina index: 0 = none, 1 = non-limiting, 2 = limiting."
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