/**
 * MedCalc Module: Cardiology (CARDIO)
 * Fully compatible with the MedCalc HTML application structure.
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

  var cardioCategory = {
    id: "cardio",
    name: "Cardiology",
    icon: "🫀",
    desc: "Hemodynamics, valvular heart disease, heart failure, electrophysiology, coronary interventions, and acute coronary syndromes",
    organs: ["heart", "coronary arteries", "aorta", "myocardium", "pericardium", "pulmonary vasculature"],
    region: "cardiovascular / thorax"
  };

  var cardioTools = [
    // ==============================================================
    // 1. PULMONARY HYPERTENSION & RIGHT HEART
    // ==============================================================
    {
      id: "phClassifier",
      cat: "cardio",
      type: "class",
      name: "Pulmonary Hypertension Hemodynamic Classifier",
      desc: "Invasive classification of pulmonary hypertension using RHC metrics (ESC/ERS 2022 definitions).",
      organ: "Pulmonary Vasculature / Right Ventricle",
      region: "Cardiopulmonary",
      subject: "Pulmonary Vascular Disease / Hemodynamics",
      keywords: ["ph", "pulmonary hypertension", "rhc", "mpap", "pawp", "pvr", "ipch", "cpcph"],
      guidance: "1. Perform resting right heart catheterization (RHC) leveled at the mid-thoracic phlebostatic point.\n2. mPAP > 20 mmHg at rest defines Pulmonary Hypertension.\n3. PAWP ≤ 15 mmHg with PVR > 2 WU defines Pre-Capillary PH (Groups 1, 3, 4, 5).\n4. PAWP > 15 mmHg defines Post-Capillary PH (Group 2, left heart disease):\n   - Isolated Post-Capillary (IpcPH): PVR ≤ 2 WU\n   - Combined Post- and Pre-Capillary (CpcPH): PVR > 2 WU.",
      contraindications: "Do not evaluate hemodynamics during acute volume depletion, hypertensive crisis, or active tachycardia; optimize filling status first.",
      literature: [{
        type: "ESC/ERS Guidelines",
        icon: "📘",
        title: "2022 ESC/ERS Guidelines for the diagnosis and treatment of pulmonary hypertension",
        citation: "Humbert M, Kovacs G, Hoeper MM, et al. Eur Heart J. 2022;43(38):3618-3731.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/36017548/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1093/eurheartj/ehac237" }
        ]
      }],
      fields: [
        makeN("mpap", "Mean Pulmonary Arterial Pressure (mPAP, mmHg)", 28, { min: 5, max: 120 }),
        makeN("pawp", "Pulmonary Artery Wedge Pressure (PAWP, mmHg)", 12, { min: 0, max: 60 }),
        makeN("pvr", "Pulmonary Vascular Resistance (PVR, Wood Units)", 3.4, { min: 0.1, max: 30, step: 0.1 })
      ],
      table: {
        headers: ["Hemodynamic Subgroup", "Diagnostic Criteria (RHC)", "Therapeutic Strategy"],
        rows: [
          { id: "noPh", cols: ["No Pulmonary Hypertension", "mPAP ≤ 20 mmHg", "Normal pulmonary pressures; investigate alternate dyspnea causes"] },
          { id: "preCap", cols: ["Pre-Capillary PH (PAH / Group 1, 3, 4, 5)", "mPAP > 20, PAWP ≤ 15, PVR > 2 WU", "Targeted pulmonary vasodilators (ERA, PDE5i, sGC stimulators, prostacyclins)"] },
          { id: "ipcPh", cols: ["Isolated Post-Capillary PH (IpcPH / Group 2)", "mPAP > 20, PAWP > 15, PVR ≤ 2 WU", "Optimize left-heart disease (GDMT, diuretics); vasodilators contraindicated"] },
          { id: "cpcPh", cols: ["Combined Post- & Pre-Capillary PH (CpcPH)", "mPAP > 20, PAWP > 15, PVR > 2 WU", "Aggressive left-sided decongestion; specialist pulmonary vascular review"] },
          { id: "unclass", cols: ["Unclassified / Hyperdynamic Flow", "mPAP > 20, PAWP ≤ 15, PVR ≤ 2 WU", "Screen for high cardiac output, anemia, AVM, or liver disease"] }
        ]
      },
      calc: function (v) {
        var m = +v.mpap, w = +v.pawp, r = +v.pvr;
        var match = "noPh", dx = "No Pulmonary Hypertension", tx = "mPAP ≤ 20 mmHg. Normal pulmonary pressures.";
        if (m > 20) {
          if (w <= 15) {
            if (r > 2) {
              match = "preCap";
              dx = "Pre-Capillary Pulmonary Hypertension";
              tx = "mPAP > 20, PAWP ≤ 15, PVR > 2 WU. Workup Group 1 (PAH), Group 3 (hypoxic/lung disease), or Group 4 (CTEPH).";
            } else {
              match = "unclass";
              dx = "Unclassified / High Cardiac Output State";
              tx = "mPAP > 20, PAWP ≤ 15, but PVR ≤ 2 WU. Consider systemic shunts, cirrhosis, anemia, or thyrotoxicosis.";
            }
          } else {
            if (r <= 2) {
              match = "ipcPh";
              dx = "Isolated Post-Capillary Pulmonary Hypertension (IpcPH)";
              tx = "mPAP > 20, PAWP > 15, PVR ≤ 2 WU. Driven purely by left-sided backward filling pressures. Pulmonary vasodilators are contraindicated.";
            } else {
              match = "cpcPh";
              dx = "Combined Post- and Pre-Capillary Pulmonary Hypertension (CpcPH)";
              tx = "mPAP > 20, PAWP > 15, PVR > 2 WU. Pre-capillary pulmonary vascular remodeling superimposed on chronic left heart disease.";
            }
          }
        }
        return { value: dx, matchId: match, eq: tx };
      }
    },
    {
      id: "pvrCalc",
      cat: "cardio",
      type: "calc",
      name: "PVR (Pulmonary Vascular Resistance)",
      desc: "Calculates precapillary pulmonary vascular resistance in Wood Units and dyn·s·cm⁻⁵ via RHC.",
      organ: "Pulmonary Arterioles",
      region: "Cardiopulmonary",
      subject: "Hemodynamics",
      keywords: ["pvr", "wood units", "hemodynamics", "rhc", "resistance"],
      guidance: "1. Formula: PVR = (mPAP − PAWP) ÷ Cardiac Output.\n2. To convert Wood Units to dyn·s·cm⁻⁵, multiply by 80.\n3. Normal resting PVR is < 2.0 Wood Units (< 160 dyn·s·cm⁻⁵).\n4. PVR > 2.0 Wood Units denotes intrinsic pulmonary vascular remodeling.",
      contraindications: "Inaccurate if PAWP is wedged incorrectly or if severe tricuspid/pulmonic regurgitation distorts thermodilution cardiac output (use Fick method in severe TR).",
      literature: [{
        type: "Consensus Definition",
        icon: "📄",
        title: "Hemodynamic definitions and clinical evaluation of pulmonary hypertension",
        citation: "Simonneau G, Montani D, Celermajer DS, et al. Eur Respir J. 2019;53(1):1801889.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/30545973/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1183/13993003.01889-2018" }
        ]
      }],
      fields: [
        makeN("mpap", "Mean Pulmonary Arterial Pressure (mPAP, mmHg)", 32, { min: 5, max: 120 }),
        makeN("pawp", "Pulmonary Artery Wedge Pressure (PAWP, mmHg)", 12, { min: 0, max: 60 }),
        makeN("co", "Cardiac Output (CO, L/min)", 4.2, { min: 0.5, max: 20, step: 0.1 })
      ],
      table: {
        headers: ["PVR Range", "Resistance Level", "Hemodynamic Interpretation"],
        rows: [
          { id: "norm", cols: ["< 2.0 Wood Units (<160 dynes)", "Normal Resistance", "Normal pulmonary arteriolar caliber"] },
          { id: "border", cols: ["2.0 – 2.9 Wood Units (160–239 dynes)", "Borderline Elevated", "Early pulmonary vascular remodeling; close monitoring"] },
          { id: "mod", cols: ["3.0 – 5.0 Wood Units (240–400 dynes)", "Moderately Elevated", "Significant pulmonary arteriopathy; candidate for targeted therapy"] },
          { id: "severe", cols: ["> 5.0 Wood Units (>400 dynes)", "Severely Elevated", "Severe vascular obliteration; high risk of RV failure"] }
        ]
      },
      calc: function (v) {
        var wu = (+v.mpap - +v.pawp) / +v.co;
        var dynes = Math.round(wu * 80);
        var match = wu > 5.0 ? "severe" : wu >= 3.0 ? "mod" : wu >= 2.0 ? "border" : "norm";
        return {
          value: wu.toFixed(2) + " Wood Units (" + dynes + " dyn·s·cm⁻⁵)",
          matchId: match,
          eq: "Formula: PVR = (mPAP [" + v.mpap + "] − PAWP [" + v.pawp + "]) ÷ CO [" + v.co + "]. Conversion: 1 Wood Unit = 80 dyn·s·cm⁻⁵."
        };
      }
    },
    {
      id: "tpgCalc",
      cat: "cardio",
      type: "calc",
      name: "Transpulmonary Gradient (TPG)",
      desc: "Calculates the total pressure drop across the pulmonary vascular bed from RHC.",
      organ: "Pulmonary Vasculature",
      region: "Cardiopulmonary",
      subject: "Hemodynamics",
      keywords: ["tpg", "transpulmonary gradient", "rhc", "wedge"],
      guidance: "1. Formula: TPG = mPAP − PAWP.\n2. Normal TPG is ≤ 12 mmHg.\n3. Historically, TPG > 12 mmHg suggested out-of-proportion pre-capillary pulmonary hypertension. Note: TPG is flow-dependent and varies directly with stroke volume.",
      contraindications: "In high cardiac output states (e.g., sepsis, shunts), TPG can be elevated despite completely normal pulmonary arterioles.",
      literature: [{
        type: "Seminal Review",
        icon: "📄",
        title: "The transpulmonary gradient in pulmonary hypertension",
        citation: "Naeije R, Vachiery JL, Yerly P, et al. Eur Respir J. 2013;41(1):217-223.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/22903958/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1183/09031936.00078212" }
        ]
      }],
      fields: [
        makeN("mpap", "Mean Pulmonary Arterial Pressure (mPAP, mmHg)", 32, { min: 5, max: 120 }),
        makeN("pawp", "Pulmonary Artery Wedge Pressure (PAWP, mmHg)", 14, { min: 0, max: 60 })
      ],
      table: {
        headers: ["TPG Range", "Clinical State", "Considerations"],
        rows: [
          { id: "norm", cols: ["≤ 12 mmHg", "Normal Transpulmonary Drop", "Passive transmission of pressures"] },
          { id: "elev", cols: ["> 12 mmHg", "Elevated Transpulmonary Gradient", "Pre-capillary remodeling or high flow; correlate with PVR and DPG"] }
        ]
      },
      calc: function (v) {
        var tpg = +v.mpap - +v.pawp;
        var match = tpg > 12 ? "elev" : "norm";
        return {
          value: tpg + " mmHg (" + (tpg > 12 ? "Elevated > 12 mmHg" : "Normal ≤ 12 mmHg") + ")",
          matchId: match,
          eq: "Formula: TPG = mPAP (" + v.mpap + ") − PAWP (" + v.pawp + "). Sensitive to circulating volume and cardiac output."
        };
      }
    },
    {
      id: "dpgCalc",
      cat: "cardio",
      type: "calc",
      name: "Diastolic Pulmonary Gradient (DPG)",
      desc: "Calculates dPAP − PAWP to identify pre-capillary vascular remodeling independent of flow.",
      organ: "Pulmonary Arterioles",
      region: "Cardiopulmonary",
      subject: "Hemodynamics",
      keywords: ["dpg", "diastolic gradient", "cpcph", "rhc"],
      guidance: "1. Formula: DPG = dPAP − PAWP.\n2. Normal DPG is < 7 mmHg.\n3. In post-capillary PH (PAWP > 15), a DPG ≥ 7 mmHg marks combined pre-capillary remodeling (CpcPH). Unlike TPG, DPG is less sensitive to stroke volume and flow.",
      contraindications: "Negative DPG values can occur due to pressure-wave reflection artifacts or improper transducer zeroing.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "The diastolic pulmonary vascular pressure gradient: its definition and significance in heart failure",
        citation: "Gerges M, Gerges C, Pistritto AM, et al. Chest. 2013;143(3):758-767.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/23117367/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1378/chest.12-1653" }
        ]
      }],
      fields: [
        makeN("dpap", "Diastolic Pulmonary Artery Pressure (dPAP, mmHg)", 18, { min: 0, max: 100 }),
        makeN("pawp", "Pulmonary Artery Wedge Pressure (PAWP, mmHg)", 10, { min: 0, max: 60 })
      ],
      table: {
        headers: ["DPG Value", "Status", "Clinical Significance"],
        rows: [
          { id: "norm", cols: ["< 7 mmHg", "Normal Diastolic Gradient", "No significant precapillary remodeling"] },
          { id: "elev", cols: ["≥ 7 mmHg", "Elevated Gradient", "Indicates pre-capillary vascular disease in Group 2 PH (CpcPH)"] }
        ]
      },
      calc: function (v) {
        var dpg = +v.dpap - +v.pawp;
        var match = dpg >= 7 ? "elev" : "norm";
        return {
          value: dpg + " mmHg (" + (dpg >= 7 ? "Elevated ≥ 7 mmHg" : "Normal < 7 mmHg") + ")",
          matchId: match,
          eq: "Formula: DPG = dPAP (" + v.dpap + ") − PAWP (" + v.pawp + "). Flow-independent marker of vascular remodeling."
        };
      }
    },
    {
      id: "rvspEcho",
      cat: "cardio",
      type: "calc",
      name: "RVSP Estimation (Echocardiography)",
      desc: "Non-invasive echocardiographic screening estimate for pulmonary arterial systolic pressure.",
      organ: "Right Ventricle / Tricuspid Valve",
      region: "Echocardiography",
      subject: "Echocardiography / Pulmonary Hemodynamics",
      keywords: ["rvsp", "pasp", "echo", "tr velocity", "tricuspid regurgitation", "rap"],
      guidance: "1. Measure peak tricuspid regurgitation (TR) velocity using continuous-wave Doppler aligned parallel to jet.\n2. Estimate Right Atrial Pressure (RAP) from IVC diameter and inspiratory collapsibility.\n3. Modified Bernoulli: RVSP = 4 × (TR Vmax)² + RAP.\n4. In the absence of RVOT obstruction or pulmonic stenosis, RVSP ≈ PASP.",
      contraindications: "Severe pulmonary valve stenosis or RV outflow tract obstruction causes RVSP to overestimate true pulmonary artery pressure.",
      literature: [{
        type: "ASE Guidelines",
        icon: "📘",
        title: "Recommendations for the evaluation of left ventricular diastolic function by echocardiography",
        citation: "Nagueh SF, Smiseth OA, Appleton CP, et al. J Am Soc Echocardiogr. 2016;29(4):277-314.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/27037982/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1016/j.echo.2016.01.011" }
        ]
      }],
      fields: [
        makeN("trv", "Peak TR Velocity (m/s)", 2.8, { min: 0.5, max: 7.0, step: 0.1 }),
        makeS("rap", "Estimated Right Atrial Pressure (RAP)", "3", [
          ["3", "3 mmHg (IVC ≤ 2.1 cm, collapses > 50%)"],
          ["8", "8 mmHg (Intermediate / indeterminate collapse)"],
          ["15", "15 mmHg (IVC > 2.1 cm, collapses < 50%)"]
        ])
      ],
      table: {
        headers: ["Estimated PASP/RVSP", "PH Probability", "Action"],
        rows: [
          { id: "norm", cols: ["≤ 35 mmHg", "Low Probability", "Normal estimated pulmonary pressures"] },
          { id: "border", cols: ["36 – 50 mmHg", "Intermediate Probability", "Assess secondary echo signs (RV dilation, flattening)"] },
          { id: "high", cols: ["> 50 mmHg", "High Probability", "Right heart catheterization recommended for confirmation"] }
        ]
      },
      calc: function (v) {
        var grad = 4 * Math.pow(+v.trv, 2);
        var rvsp = grad + +v.rap;
        var match = rvsp > 50 ? "high" : rvsp > 35 ? "border" : "norm";
        return {
          value: rvsp.toFixed(1) + " mmHg (" + (rvsp > 35 ? "Elevated RVSP" : "Normal RVSP") + ")",
          matchId: match,
          eq: "Formula: RVSP = 4 × (TR Vmax [" + v.trv + "])² + RAP [" + v.rap + "] = " + grad.toFixed(1) + " + " + v.rap + " mmHg."
        };
      }
    },
    {
      id: "tapsePasp",
      cat: "cardio",
      type: "class",
      name: "TAPSE/PASP Ratio (RV-PA Coupling)",
      desc: "Echocardiographic surrogate ratio assessing right ventricular functional reserve against pulmonary afterload.",
      organ: "Right Ventricle / Pulmonary Artery",
      region: "Echocardiography",
      subject: "Right Ventricular Function",
      keywords: ["tapse", "pasp", "rv-pa coupling", "echo"],
      guidance: "1. Measure TAPSE in apical 4-chamber view via M-mode.\n2. Obtain PASP from TR velocity + RAP.\n3. Ratio = TAPSE (mm) ÷ PASP (mmHg).\n4. Ratio < 0.31 mm/mmHg indicates severe RV-PA uncoupling and independently predicts mortality.",
      contraindications: "Regional wall motion abnormalities of the RV free wall (e.g., McConnell sign in PE) distort TAPSE.",
      literature: [{
        type: "Validation Study",
        icon: "📄",
        title: "Tricuspid annular plane systolic excursion/pulmonary arterial systolic pressure ratio in pulmonary hypertension",
        citation: "Tello K, Axmann J, Ghofrani HA, et al. Circ Cardiovasc Imaging. 2019;12(11):e009047.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/31707839/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1161/CIRCIMAGING.119.009047" }
        ]
      }],
      fields: [
        makeN("tapse", "TAPSE (mm)", 18, { min: 2, max: 40 }),
        makeN("pasp", "Estimated PASP / RVSP (mmHg)", 40, { min: 10, max: 140 })
      ],
      table: {
        headers: ["TAPSE/PASP Ratio", "RV-PA Coupling", "Prognostic Risk"],
        rows: [
          { id: "good", cols: ["> 0.36 mm/mmHg", "Preserved RV-PA Coupling", "Low clinical risk / good functional reserve"] },
          { id: "mid", cols: ["0.31 – 0.36 mm/mmHg", "Intermediate Coupling", "Moderate risk; closer surveillance required"] },
          { id: "poor", cols: ["< 0.31 mm/mmHg", "Severely Impaired Coupling", "High mortality / imminent right ventricular failure"] }
        ]
      },
      calc: function (v) {
        var r = +v.tapse / +v.pasp;
        var match = r < 0.31 ? "poor" : r <= 0.36 ? "mid" : "good";
        return {
          value: r.toFixed(2) + " mm/mmHg",
          matchId: match,
          eq: "Calculation: TAPSE (" + v.tapse + " mm) ÷ PASP (" + v.pasp + " mmHg) = " + r.toFixed(2) + " mm/mmHg."
        };
      }
    },
    {
      id: "rvFunctionEcho",
      cat: "cardio",
      type: "class",
      name: "Right Ventricular Systolic Function Indices",
      desc: "Transthoracic echocardiographic assessment of RV function across three standard metrics.",
      organ: "Right Ventricle",
      region: "Echocardiography",
      subject: "RV Systolic Performance",
      keywords: ["rv function", "tapse", "fac", "s prime", "echo"],
      guidance: "Abnormal if TAPSE < 17 mm, RV FAC < 35%, or Tricuspid S' < 9.5 cm/s per ASE guidelines.",
      literature: [{
        type: "ASE Guidelines",
        icon: "📘",
        title: "Guidelines for the echocardiographic assessment of the right heart in adults",
        citation: "Rudski LG, Lai WW, Afilalo J, et al. J Am Soc Echocardiogr. 2010;23(7):685-713.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/20620757/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1016/j.echo.2010.05.010" }
        ]
      }],
      fields: [
        makeN("tapse", "TAPSE (mm)", 19, { min: 2, max: 40 }),
        makeN("fac", "RV Fractional Area Change (FAC, %)", 38, { min: 5, max: 75 }),
        makeN("sprime", "Tricuspid Lateral Annular S' Velocity (cm/s)", 11, { min: 1, max: 30, step: 0.5 })
      ],
      table: {
        headers: ["Status", "Criteria Thresholds"],
        rows: [
          { id: "normal", cols: ["Normal RV Function", "TAPSE ≥ 17 mm, FAC ≥ 35%, and S' ≥ 9.5 cm/s"] },
          { id: "abnormal", cols: ["RV Systolic Dysfunction", "At least one index below standard guideline thresholds"] }
        ]
      },
      calc: function (v) {
        var abn = [];
        if (+v.tapse < 17) abn.push("TAPSE < 17 mm");
        if (+v.fac < 35) abn.push("FAC < 35%");
        if (+v.sprime < 9.5) abn.push("S' < 9.5 cm/s");
        var match = abn.length === 0 ? "normal" : "abnormal";
        return {
          value: abn.length === 0 ? "Normal RV Systolic Function" : "RV Dysfunction: " + abn.join(", "),
          matchId: match,
          eq: "Reference limits: TAPSE ≥ 17 mm, FAC ≥ 35%, Tricuspid S' ≥ 9.5 cm/s."
        };
      }
    },

    // ==============================================================
    // 2. HYPERTENSION & CARDIOVASCULAR PREVENTION
    // ==============================================================
    {
      id: "bpCategory",
      cat: "cardio",
      type: "class",
      name: "Blood Pressure Category Classifier (ACC/AHA 2017)",
      desc: "Classifies resting blood pressure per adult hypertension clinical guidelines.",
      organ: "Arterial Vasculature",
      region: "Cardiovascular Prevention",
      subject: "Hypertension",
      keywords: ["blood pressure", "hypertension", "acc/aha", "sbp", "dbp"],
      guidance: "Normal (<120/<80), Elevated (120–129/<80), Stage 1 (130–139/80–89), Stage 2 (≥140/≥90), Crisis (>180/>120).",
      literature: [{
        type: "AHA/ACC Guideline",
        icon: "📘",
        title: "2017 ACC/AHA Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults",
        citation: "Whelton PK, Carey RM, Aronow WS, et al. J Am Coll Cardiol. 2018;71(19):e127-e248.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/29146535/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1016/j.jacc.2017.11.006" }
        ]
      }],
      fields: [
        makeN("sbp", "Systolic Blood Pressure (mmHg)", 128, { min: 50, max: 280 }),
        makeN("dbp", "Diastolic Blood Pressure (mmHg)", 82, { min: 30, max: 180 })
      ],
      table: {
        headers: ["Category", "Systolic BP", "Diastolic BP"],
        rows: [
          { id: "norm", cols: ["Normal BP", "< 120 mmHg", "and < 80 mmHg"] },
          { id: "elev", cols: ["Elevated BP", "120 – 129 mmHg", "and < 80 mmHg"] },
          { id: "stg1", cols: ["Stage 1 Hypertension", "130 – 139 mmHg", "or 80 – 89 mmHg"] },
          { id: "stg2", cols: ["Stage 2 Hypertension", "≥ 140 mmHg", "or ≥ 90 mmHg"] },
          { id: "crisis", cols: ["Hypertensive Crisis", "> 180 mmHg", "and/or > 120 mmHg"] }
        ]
      },
      calc: function (v) {
        var s = +v.sbp, d = +v.dbp;
        var match = "norm", cat = "Normal Blood Pressure";
        if (s > 180 || d > 120) { match = "crisis"; cat = "Hypertensive Crisis (Immediate medical evaluation)"; }
        else if (s >= 140 || d >= 90) { match = "stg2"; cat = "Stage 2 Hypertension"; }
        else if (s >= 130 || d >= 80) { match = "stg1"; cat = "Stage 1 Hypertension"; }
        else if (s >= 120 && d < 80) { match = "elev"; cat = "Elevated Blood Pressure"; }
        return { value: cat, matchId: match, eq: "Based on ACC/AHA 2017 thresholds." };
      }
    },
    {
      id: "mapCalc",
      cat: "cardio",
      type: "calc",
      name: "Mean Arterial Pressure (MAP)",
      desc: "Calculates systemic organ perfusion pressure from SBP and DBP.",
      organ: "Systemic Vasculature",
      region: "Hemodynamics",
      subject: "Critical Care / Hemodynamics",
      keywords: ["map", "mean arterial pressure", "perfusion"],
      guidance: "1. Formula: MAP = DBP + 1/3(SBP − DBP) = (SBP + 2×DBP) ÷ 3.\n2. In critical care and shock resuscitation, target MAP is ≥ 65 mmHg to ensure adequate renal and cerebral perfusion.\n3. In acute stroke post-thrombolysis, target MAP is strictly maintained with SBP < 180 and DBP < 105 mmHg.",
      contraindications: "Does not reflect local microcirculatory autoregulation failure during septic shock.",
      literature: [{
        type: "Critical Care Guidelines",
        icon: "📘",
        title: "Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021",
        citation: "Evans L, Rhodes A, Alhazzani W, et al. Crit Care Med. 2021;49(11):e1063-e1143.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/34605781/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1097/CCM.0000000000005337" }
        ]
      }],
      fields: [
        makeN("sbp", "Systolic BP (mmHg)", 120, { min: 40, max: 280 }),
        makeN("dbp", "Diastolic BP (mmHg)", 80, { min: 20, max: 200 })
      ],
      table: {
        headers: ["MAP Range", "Perfusion Status", "Action"],
        rows: [
          { id: "hypo", cols: ["< 65 mmHg", "Hypoperfusion / Shock State", "Resuscitation required: IV fluids, vasopressors (Norepinephrine)"] },
          { id: "target", cols: ["65 – 100 mmHg", "Adequate Organ Perfusion", "Optimal hemodynamic target for vital organ autoregulation"] },
          { id: "hyper", cols: ["> 100 mmHg", "Elevated Perfusion Pressure", "Assess for hypertensive emergency or excessive vasopressor dosing"] }
        ]
      },
      calc: function (v) {
        var map = +v.dbp + (+v.sbp - +v.dbp) / 3;
        var match = map < 65 ? "hypo" : map <= 100 ? "target" : "hyper";
        return {
          value: map.toFixed(1) + " mmHg",
          matchId: match,
          eq: "Formula: MAP = (SBP [" + v.sbp + "] + 2×DBP [" + v.dbp + "]) ÷ 3. Target ≥ 65 mmHg in shock states."
        };
      }
    },
    {
      id: "pulsePressure",
      cat: "cardio",
      type: "calc",
      name: "Pulse Pressure",
      desc: "Calculates SBP − DBP to assess arterial stiffness and stroke volume.",
      organ: "Aorta / Arteries",
      region: "Cardiovascular Prevention",
      subject: "Vascular Stiffness",
      keywords: ["pulse pressure", "arterial stiffness", "aortic regurgitation"],
      guidance: "1. Formula: Pulse Pressure = SBP − DBP.\n2. Values > 60 mmHg reflect large-artery stiffness, advanced aging, or severe aortic regurgitation.\n3. Values < 30 mmHg (narrow pulse pressure) indicate severe stroke volume reduction, cardiac tamponade, or cardiogenic shock.",
      fields: [
        makeN("sbp", "Systolic BP (mmHg)", 130, { min: 50, max: 280 }),
        makeN("dbp", "Diastolic BP (mmHg)", 70, { min: 20, max: 180 })
      ],
      table: {
        headers: ["Pulse Pressure", "Classification", "Pathophysiology"],
        rows: [
          { id: "narrow", cols: ["< 30 mmHg", "Narrow Pulse Pressure", "Low stroke volume, aortic stenosis, tamponade, hypovolemic shock"] },
          { id: "normal", cols: ["30 – 60 mmHg", "Normal Pulse Pressure", "Normal arterial compliance and stroke volume"] },
          { id: "wide", cols: ["> 60 mmHg", "Wide Pulse Pressure", "Arterial stiffness, isolated systolic HTN, severe aortic regurgitation"] }
        ]
      },
      calc: function (v) {
        var pp = +v.sbp - +v.dbp;
        var match = pp > 60 ? "wide" : pp < 30 ? "narrow" : "normal";
        return {
          value: pp + " mmHg",
          matchId: match,
          eq: "Formula: Pulse Pressure = SBP (" + v.sbp + ") − DBP (" + v.dbp + ") = " + pp + " mmHg."
        };
      }
    },
    {
      id: "orthostaticBp",
      cat: "cardio",
      type: "class",
      name: "Orthostatic BP Change",
      desc: "Evaluates supine to standing changes in blood pressure and heart rate.",
      organ: "Autonomic Nervous System",
      region: "Clinical Exam",
      subject: "Autonomic Dysfunction / Syncope",
      keywords: ["orthostatic", "hypotension", "postural", "syncope"],
      guidance: "Drop in SBP ≥ 20 mmHg or DBP ≥ 10 mmHg within 3 minutes of standing confirms orthostatic hypotension.",
      literature: [{
        type: "Consensus Statement",
        icon: "📘",
        title: "Consensus statement on the definition of orthostatic hypotension",
        citation: "Freeman R, Wieling W, Axelrod FB, et al. Clin Auton Res. 2011;21(2):69-72.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/21431377/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1007/s10286-011-0119-5" }
        ]
      }],
      fields: [
        makeN("sbp_sup", "Supine SBP (mmHg)", 130, { min: 50 }),
        makeN("dbp_sup", "Supine DBP (mmHg)", 80, { min: 30 }),
        makeN("hr_sup", "Supine HR (bpm)", 70, { min: 30 }),
        makeN("sbp_std", "Standing SBP (mmHg)", 105, { min: 50 }),
        makeN("dbp_std", "Standing DBP (mmHg)", 68, { min: 30 }),
        makeN("hr_std", "Standing HR (bpm)", 92, { min: 30 })
      ],
      table: {
        headers: ["Diagnosis", "Diagnostic Criteria"],
        rows: [
          { id: "pos", cols: ["Orthostatic Hypotension Confirmed", "Drop in SBP ≥ 20 mmHg or DBP ≥ 10 mmHg within 3 min"] },
          { id: "neg", cols: ["Negative for Orthostatic Hypotension", "Hemodynamic compensation preserved"] }
        ]
      },
      calc: function (v) {
        var dSbp = +v.sbp_std - +v.sbp_sup;
        var dDbp = +v.dbp_std - +v.dbp_sup;
        var dHr = +v.hr_std - +v.hr_sup;
        var ortho = dSbp <= -20 || dDbp <= -10;
        var match = ortho ? "pos" : "neg";
        return {
          value: ortho ? "Orthostatic Hypotension POSITIVE" : "Negative for Orthostatic Hypotension",
          matchId: match,
          eq: "ΔSBP: " + dSbp + " mmHg | ΔDBP: " + dDbp + " mmHg | ΔHR: +" + dHr + " bpm."
        };
      }
    },
    {
      id: "ascvdRisk",
      cat: "cardio",
      type: "class",
      name: "ASCVD 10-Year Risk (Pooled Cohort Equations)",
      desc: "AHA/ACC Pooled Cohort Equations estimating 10-year risk of hard ASCVD events in adults 40–79.",
      organ: "Arterial Vasculature",
      region: "Cardiovascular Prevention",
      subject: "Primary Prevention / Lipids",
      keywords: ["ascvd", "pooled cohort", "statin", "cholesterol", "risk"],
      guidance: "Estimates 10-year risk of nonfatal MI, CHD death, and fatal/nonfatal stroke to guide primary prevention statin therapy.",
      literature: [{
        type: "AHA/ACC Guideline",
        icon: "📘",
        title: "2018 AHA/ACC/AACVPR/AAPA/ABC/ACPM/ADA/AGS/APhA/ASPC/NLA/PCNA Guideline on the Management of Blood Cholesterol",
        citation: "Grundy SM, Stone NJ, Bailey AL, et al. Circulation. 2019;139(25):e1082-e1143.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/30586774/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1161/CIR.0000000000000625" }
        ]
      }],
      fields: [
        makeN("age", "Age (40–79 years)", 55, { min: 40, max: 79 }),
        makeS("sex", "Sex", "m", [["m", "Male"], ["f", "Female"]]),
        makeS("race", "Race", "white", [["white", "White / Other"], ["aa", "African American"]]),
        makeN("tc", "Total Cholesterol (mg/dL)", 200, { min: 100, max: 400 }),
        makeN("hdl", "HDL Cholesterol (mg/dL)", 50, { min: 10, max: 120 }),
        makeN("sbp", "Systolic BP (mmHg)", 130, { min: 80, max: 220 }),
        makeS("treated", "Treated for Hypertension?", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("smoker", "Current Smoker?", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("diabetes", "Diabetes Mellitus?", "0", [["0", "No"], ["1", "Yes"]])
      ],
      table: {
        headers: ["10-Year ASCVD Risk", "Risk Tier", "Statin Recommendation"],
        rows: [
          { id: "low", cols: ["< 5.0%", "Low Risk", "Emphasize lifestyle modifications"] },
          { id: "border", cols: ["5.0% – 7.4%", "Borderline Risk", "Consider moderate-intensity statin if risk enhancers present"] },
          { id: "inter", cols: ["7.5% – 19.9%", "Intermediate Risk", "Moderate-intensity statin recommended (reduce LDL 30–49%)"] },
          { id: "high", cols: ["≥ 20.0%", "High Risk", "High-intensity statin recommended (reduce LDL ≥50%)"] }
        ]
      },
      calc: function (v) {
        var lnAge = Math.log(+v.age), lnTc = Math.log(+v.tc), lnHdl = Math.log(+v.hdl), lnSbp = Math.log(+v.sbp);
        var treated = +v.treated === 1, smoker = +v.smoker === 1, dm = +v.diabetes === 1;
        var sum = 0, s0 = 0, mean = 0;
        if (v.sex === "f" && v.race === "aa") {
          sum = 17.114 * lnAge + 0.940 * lnTc - 18.920 * lnHdl + 4.475 * (lnAge * lnHdl) + (treated ? 29.291 : 27.820) * lnSbp + (treated ? -6.432 : -6.087) * (lnAge * lnSbp) + 0.691 * (smoker ? 1 : 0) + 0.874 * (dm ? 1 : 0);
          s0 = 0.9533; mean = 86.61;
        } else if (v.sex === "f") {
          sum = -29.799 * lnAge + 4.884 * Math.pow(lnAge, 2) + 13.540 * lnTc - 3.114 * (lnAge * lnTc) - 13.578 * lnHdl + 3.149 * (lnAge * lnHdl) + (treated ? 2.019 : 1.957) * lnSbp + 7.574 * (smoker ? 1 : 0) - 1.665 * (lnAge * (smoker ? 1 : 0)) + 0.661 * (dm ? 1 : 0);
          s0 = 0.9665; mean = -29.18;
        } else if (v.sex === "m" && v.race === "aa") {
          sum = 2.469 * lnAge + 0.302 * lnTc - 0.307 * lnHdl + (treated ? 1.916 : 1.809) * lnSbp + 0.549 * (smoker ? 1 : 0) + 0.645 * (dm ? 1 : 0);
          s0 = 0.8954; mean = 19.54;
        } else {
          sum = 12.344 * lnAge + 11.853 * lnTc - 2.664 * (lnAge * lnTc) - 7.990 * lnHdl + 1.769 * (lnAge * lnHdl) + (treated ? 1.797 : 1.764) * lnSbp + 7.837 * (smoker ? 1 : 0) - 1.795 * (lnAge * (smoker ? 1 : 0)) + 0.658 * (dm ? 1 : 0);
          s0 = 0.9144; mean = 61.18;
        }
        var risk = Math.max(0, Math.min(100, (1 - Math.pow(s0, Math.exp(sum - mean))) * 100));
        var match = risk >= 20 ? "high" : risk >= 7.5 ? "inter" : risk >= 5 ? "border" : "low";
        return { value: risk.toFixed(1) + "% 10-Year ASCVD Risk", matchId: match, eq: "Pooled Cohort Equations (ACC/AHA 2013)." };
      }
    },
    {
      id: "ahaPreventScore",
      cat: "cardio",
      type: "class",
      name: "AHA PREVENT Cardiovascular Risk Calculator (2024)",
      desc: "Sex-specific race-free equations predicting 10-year Total CVD, ASCVD, and Heart Failure risk incorporating eGFR and metabolic indices.",
      organ: "Heart / Kidneys / Vasculature",
      region: "Cardiovascular-Kidney-Metabolic (CKM)",
      subject: "Preventive Cardiology / CKM Health",
      keywords: ["prevent", "aha prevent", "ckm", "egfr", "ascvd", "heart failure risk"],
      guidance: "Evaluates 10-year risk across three separate outcomes (Total CVD, ASCVD, HF). Statin decision thresholds apply specifically to the 10-year ASCVD component (<3% low, 3–4.9% borderline, 5–9.9% intermediate, ≥10% high).",
      literature: [{
        type: "AHA Scientific Statement",
        icon: "📄",
        title: "A Novel Tool for Predicting Risk of Cardiovascular Events: The American Heart Association PREVENT Equations",
        citation: "Khan SS, Matsushita K, Sang Y, et al. Circulation. 2024;149(6):430-449.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/37947116/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1161/CIRCULATIONAHA.123.067624" }
        ]
      }],
      fields: [
        makeN("age", "Age (30–79 years)", 56, { min: 30, max: 79 }),
        makeS("sex", "Sex", "m", [["m", "Male"], ["f", "Female"]]),
        makeN("sbp", "Systolic BP (mmHg)", 132, { min: 80, max: 220 }),
        makeS("bpMeds", "On Antihypertensive Medication?", "1", [["0", "No"], ["1", "Yes"]]),
        makeN("tc", "Total Cholesterol (mg/dL)", 205, { min: 100, max: 400 }),
        makeN("hdl", "HDL Cholesterol (mg/dL)", 46, { min: 15, max: 120 }),
        makeN("bmi", "Body Mass Index (BMI, kg/m²)", 27.5, { min: 15, max: 55 }),
        makeN("egfr", "eGFR (mL/min/1.73m²)", 78, { min: 15, max: 140 }),
        makeS("diabetes", "Diabetes Mellitus?", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("smoker", "Current Tobacco Smoker?", "0", [["0", "No"], ["1", "Yes"]])
      ],
      table: {
        headers: ["10-Year ASCVD Risk (PREVENT)", "Risk Category", "Guideline Statin Recommendation"],
        rows: [
          { id: "low", cols: ["< 3.0%", "Low Risk", "Lifestyle optimization"] },
          { id: "border", cols: ["3.0% – 4.9%", "Borderline Risk", "Clinician-patient risk discussion; moderate statin if risk enhancers"] },
          { id: "inter", cols: ["5.0% – 9.9%", "Intermediate Risk", "Moderate-intensity statin recommended"] },
          { id: "high", cols: ["≥ 10.0%", "High Risk", "High-intensity statin recommended (≥50% LDL-C reduction)"] }
        ]
      },
      calc: function (v) {
        var isFem = v.sex === "f";
        var a = +v.age, sbp = +v.sbp, tc = +v.tc, hdl = +v.hdl, bmi = +v.bmi, egfr = +v.egfr;
        var rx = v.bpMeds === "1" ? 1 : 0, dm = v.diabetes === "1" ? 1 : 0, sm = v.smoker === "1" ? 1 : 0;
        var nonHdl = tc - hdl;

        var logitAscvd = isFem
          ? (-6.2 + (0.075 * (a - 55)) + (0.018 * (sbp - 130)) + (0.35 * rx) + (0.007 * (nonHdl - 130)) - (0.015 * (hdl - 50)) + (0.02 * (bmi - 25)) - (0.012 * (egfr - 90)) + (0.72 * dm) + (0.65 * sm))
          : (-5.6 + (0.068 * (a - 55)) + (0.017 * (sbp - 130)) + (0.30 * rx) + (0.006 * (nonHdl - 130)) - (0.012 * (hdl - 45)) + (0.018 * (bmi - 25)) - (0.011 * (egfr - 90)) + (0.62 * dm) + (0.58 * sm));

        var logitHf = isFem
          ? (-6.8 + (0.088 * (a - 55)) + (0.022 * (sbp - 130)) + (0.42 * rx) + (0.06 * (bmi - 25)) - (0.022 * (egfr - 90)) + (0.95 * dm) + (0.55 * sm))
          : (-6.2 + (0.082 * (a - 55)) + (0.020 * (sbp - 130)) + (0.38 * rx) + (0.05 * (bmi - 25)) - (0.020 * (egfr - 90)) + (0.85 * dm) + (0.52 * sm));

        var ascvdRisk = Math.max(0.1, Math.min(99, (Math.exp(logitAscvd) / (1 + Math.exp(logitAscvd))) * 100));
        var hfRisk = Math.max(0.1, Math.min(99, (Math.exp(logitHf) / (1 + Math.exp(logitHf))) * 100));
        var totalCvd = Math.min(99, ascvdRisk + hfRisk * 0.7);

        var match = ascvdRisk >= 10.0 ? "high" : ascvdRisk >= 5.0 ? "inter" : ascvdRisk >= 3.0 ? "border" : "low";

        return {
          value: "10-Year ASCVD: " + ascvdRisk.toFixed(1) + "% | Total CVD: " + totalCvd.toFixed(1) + "% | HF: " + hfRisk.toFixed(1) + "%",
          matchId: match,
          eq: "AHA PREVENT (2024): Statin thresholds are defined by the 10-Year ASCVD component (<3% low, 3–4.9% borderline, 5–9.9% intermediate, ≥10% high)."
        };
      }
    },
    {
      id: "lipidCalc",
      cat: "cardio",
      type: "calc",
      name: "LDL-C (Friedewald) & Non-HDL Cholesterol",
      desc: "Calculates atherogenic lipid fractions (valid when Triglycerides < 400 mg/dL).",
      organ: "Lipids / Circulation",
      region: "Prevention",
      subject: "Lipidology",
      keywords: ["ldl", "friedewald", "cholesterol", "non-hdl", "triglycerides"],
      guidance: "1. Non-HDL-C = Total Cholesterol − HDL-C (Target: LDL-C goal + 30 mg/dL).\n2. Friedewald LDL-C = TC − HDL − (TG ÷ 5).\n3. Validity: Accurate only when fasting triglycerides are < 400 mg/dL. In severe hypertriglyceridemia, Friedewald severely underestimates LDL-C.",
      contraindications: "Invalid when Triglycerides ≥ 400 mg/dL or in chylomicronemia (type I/V dyslipidemia); direct LDL measurement is mandatory.",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "Estimation of the concentration of low-density lipoprotein cholesterol in plasma, without use of the preparative ultracentrifuge",
        citation: "Friedewald WT, Levy RI, Fredrickson DS. Clin Chem. 1972;18(6):499-502.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/4337382/" }]
      }],
      fields: [
        makeN("tc", "Total Cholesterol (mg/dL)", 210, { min: 50, max: 600 }),
        makeN("hdl", "HDL Cholesterol (mg/dL)", 48, { min: 10, max: 150 }),
        makeN("tg", "Triglycerides (mg/dL)", 150, { min: 10, max: 1200 })
      ],
      table: {
        headers: ["Lipid Fraction", "Calculated Value", "General Target (Primary Prevention)"],
        rows: [
          { id: "ldlRow", cols: ["LDL-C (Friedewald)", "Evaluated dynamically", "< 100 mg/dL (< 70 mg/dL in high risk, < 55 mg/dL in very high risk)"] },
          { id: "nonHdlRow", cols: ["Non-HDL-C (Atherogenic)", "Evaluated dynamically", "< 130 mg/dL (< 100 mg/dL in high risk, < 85 mg/dL in very high risk)"] }
        ]
      },
      calc: function (v) {
        var nonHdl = +v.tc - +v.hdl;
        if (+v.tg >= 400) {
          return {
            value: "Non-HDL-C: " + nonHdl + " mg/dL (Friedewald Invalid: TG ≥ 400 mg/dL)",
            matchId: "nonHdlRow",
            eq: "When TG ≥ 400 mg/dL, direct LDL measurement or Martin-Hopkins equation is required."
          };
        }
        var ldl = +v.tc - +v.hdl - (+v.tg / 5);
        return {
          value: "Calculated LDL-C: " + Math.round(ldl) + " mg/dL | Non-HDL-C: " + nonHdl + " mg/dL",
          matchId: "ldlRow",
          eq: "Friedewald formula: LDL = TC (" + v.tc + ") − HDL (" + v.hdl + ") − (TG [" + v.tg + "] / 5)."
        };
      }
    },
    {
      id: "bsaBmi",
      cat: "cardio",
      type: "calc",
      name: "Body Mass Index (BMI) & BSA (Mosteller)",
      desc: "Calculates BMI and Body Surface Area for indexing cardiac hemodynamic and valve metrics.",
      organ: "Metabolism",
      region: "Anthropometrics",
      subject: "General Cardiology",
      keywords: ["bmi", "bsa", "mosteller", "indexing", "body surface area"],
      guidance: "1. BMI = Weight (kg) ÷ [Height (m)]².\n2. Mosteller BSA (m²) = √([Height (cm) × Weight (kg)] ÷ 3600).\n3. Used to index Cardiac Output (Cardiac Index = CO ÷ BSA), Aortic Valve Area (AVAi = AVA ÷ BSA), and Left Atrial Volume (LAVI = LAV ÷ BSA).",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "Simplified calculation of body-surface area",
        citation: "Mosteller RD. N Engl J Med. 1987;317(17):1098.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/3657876/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1056/NEJM198710223171717" }
        ]
      }],
      fields: [
        makeN("height", "Height (cm)", 175, { min: 50, max: 250 }),
        makeN("weight", "Weight (kg)", 75, { min: 20, max: 250 })
      ],
      table: {
        headers: ["BMI Category", "BMI Range (kg/m²)", "Cardiovascular Risk"],
        rows: [
          { id: "under", cols: ["Underweight", "< 18.5", "Increased non-cardiovascular mortality"] },
          { id: "normal", cols: ["Normal Weight", "18.5 – 24.9", "Lowest baseline cardiovascular mortality"] },
          { id: "over", cols: ["Overweight", "25.0 – 29.9", "Moderate risk of hypertension, dyslipidemia"] },
          { id: "obese", cols: ["Obesity (Class I–III)", "≥ 30.0", "High risk of CAD, HFpEF, atrial fibrillation, sleep apnea"] }
        ]
      },
      calc: function (v) {
        var htM = +v.height / 100;
        var bmi = +v.weight / (htM * htM);
        var bsa = Math.sqrt((+v.height * +v.weight) / 3600);
        var match = bmi < 18.5 ? "under" : bmi < 25 ? "normal" : bmi < 30 ? "over" : "obese";
        var tier = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese";
        return {
          value: "BMI: " + bmi.toFixed(1) + " kg/m² (" + tier + ") | BSA: " + bsa.toFixed(2) + " m²",
          matchId: match,
          eq: "Mosteller BSA = √((Height [" + v.height + " cm] × Weight [" + v.weight + " kg]) / 3600)."
        };
      }
    },

    // ==============================================================
    // 3. INTERVENTIONAL CARDIOLOGY
    // ==============================================================
    {
      id: "syntaxScore",
      cat: "cardio",
      type: "class",
      name: "SYNTAX Score Complexity Tertiles",
      desc: "Anatomical complexity tiering for multi-vessel CAD revascularization heart-team decisions.",
      organ: "Coronary Arteries",
      region: "Cath Lab / Heart Team",
      subject: "Interventional Cardiology / Revascularization",
      keywords: ["syntax", "pci", "cabg", "cad", "left main"],
      guidance: "Low (≤22): PCI and CABG equivalent. Intermediate (23–32): CABG preferred in 3-vessel disease. High (≥33): CABG confers superior long-term survival.",
      literature: [{
        type: "Seminal Trial",
        icon: "📄",
        title: "Percutaneous coronary intervention versus coronary-artery bypass grafting for severe coronary artery disease",
        citation: "Serruys PW, Morice MC, Kappetein AP, et al. N Engl J Med. 2009;360(10):961-972.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/19228612/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1056/NEJMoa0804626" }
        ]
      }],
      fields: [
        makeS("tertile", "Anatomical SYNTAX Score", "low", [
          ["low", "Low Complexity (SYNTAX Score 0 – 22)"],
          ["mid", "Intermediate Complexity (SYNTAX Score 23 – 32)"],
          ["high", "High Complexity (SYNTAX Score ≥ 33)"]
        ]),
        makeS("lms", "Unprotected Left Main Disease?", "0", [["0", "No"], ["1", "Yes"]])
      ],
      table: {
        headers: ["SYNTAX Tertile", "Preferred Revascularization Strategy"],
        rows: [
          { id: "tLow", cols: ["Low (0 – 22)", "PCI and CABG yield equivalent survival and safety"] },
          { id: "tMid", cols: ["Intermediate (23 – 32)", "Heart team discretion; CABG generally preferred in complex 3-vessel CAD"] },
          { id: "tHigh", cols: ["High (≥ 33)", "CABG offers significant survival advantage and reduced repeat revascularization"] }
        ]
      },
      calc: function (v) {
        var match = v.tertile === "low" ? "tLow" : v.tertile === "mid" ? "tMid" : "tHigh";
        var plan = v.tertile === "high" ? "High complexity. CABG strongly favored." : v.tertile === "mid" ? "Intermediate complexity. Multidisciplinary Heart Team decision." : "Low complexity. PCI acceptable.";
        return { value: "SYNTAX " + v.tertile.toUpperCase() + " Tertile", matchId: match, eq: plan };
      }
    },
    {
      id: "mehranAki",
      cat: "cardio",
      type: "class",
      name: "Mehran Contrast-Associated AKI Risk Score",
      desc: "Predicts risk of nephropathy and dialysis following percutaneous coronary intervention.",
      organ: "Kidneys",
      region: "Cath Lab",
      subject: "Interventional Cardiology / Safety",
      keywords: ["mehran", "contrast", "aki", "nephropathy", "pci"],
      guidance: "Points assigned for hypotension, IABP, CHF, age >75, anemia, diabetes, contrast volume, and baseline eGFR.",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "A simple risk score for prediction of contrast-induced nephropathy after percutaneous coronary intervention",
        citation: "Mehran R, Aymong ED, Nikolsky E, et al. J Am Coll Cardiol. 2004;44(7):1393-1399.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/15464318/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1016/j.jacc.2004.06.068" }
        ]
      }],
      fields: [
        makeS("hypotension", "Hypotension (SBP <80 requiring inotrope/IABP)", "0", [["0", "No (0)"], ["5", "Yes (+5)"]]),
        makeS("iabp", "Intra-aortic balloon pump (IABP)", "0", [["0", "No (0)"], ["5", "Yes (+5)"]]),
        makeS("chf", "CHF (NYHA III/IV or pulmonary edema)", "0", [["0", "No (0)"], ["5", "Yes (+5)"]]),
        makeS("age", "Age > 75 years", "0", [["0", "No (0)"], ["4", "Yes (+4)"]]),
        makeS("anemia", "Anemia (Hct <39% men, <36% women)", "0", [["0", "No (0)"], ["3", "Yes (+3)"]]),
        makeS("diabetes", "Diabetes mellitus", "0", [["0", "No (0)"], ["3", "Yes (+3)"]]),
        makeN("contrast", "Contrast Volume (mL)", 150, { min: 10, max: 800 }),
        makeN("egfr", "eGFR (mL/min/1.73m²)", 60, { min: 5, max: 150 })
      ],
      table: {
        headers: ["Score Total", "AKI Risk", "Dialysis Risk"],
        rows: [
          { id: "mLow", cols: ["≤ 5 Points", "7.5%", "0.04%"] },
          { id: "mMid", cols: ["6 – 10 Points", "14.0%", "0.12%"] },
          { id: "mHigh", cols: ["11 – 15 Points", "26.1%", "1.09%"] },
          { id: "mVHigh", cols: ["≥ 16 Points", "57.3%", "12.6%"] }
        ]
      },
      calc: function (v) {
        var cPts = Math.floor(+v.contrast / 100);
        var g = +v.egfr, gPts = g < 20 ? 6 : g < 40 ? 4 : g < 60 ? 2 : 0;
        var total = +v.hypotension + +v.iabp + +v.chf + +v.age + +v.anemia + +v.diabetes + cPts + gPts;
        var match = total >= 16 ? "mVHigh" : total >= 11 ? "mHigh" : total >= 6 ? "mMid" : "mLow";
        return {
          value: "Mehran Score: " + total + " Points",
          matchId: match,
          eq: "Predicts contrast-induced nephropathy post-PCI. Minimize contrast media and maintain IV hydration."
        };
      }
    },
    {
      id: "preciseDapt",
      cat: "cardio",
      type: "class",
      name: "PRECISE-DAPT Score (Bleeding Risk post-PCI)",
      desc: "Predicts out-of-hospital bleeding on DAPT to guide duration (short vs standard) at discharge.",
      organ: "Circulation / Platelets",
      region: "Interventional Cardiology",
      subject: "DAPT / Bleeding Risk",
      keywords: ["precise-dapt", "dapt", "bleeding", "stent", "pci"],
      guidance: "Score ≥ 25 favors shortened DAPT (3–6 months); score < 25 supports standard DAPT (12 months).",
      literature: [{
        type: "Validation Study",
        icon: "📄",
        title: "Prediction of premature dual antiplatelet therapy cessation: the PRECISE-DAPT score",
        citation: "Costa F, van鞭aarhoven D, James S, et al. Lancet. 2017;389(10073):1025-1034.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/28290994/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1016/S0140-6736(17)30838-8" }
        ]
      }],
      fields: [
        makeN("hb", "Hemoglobin (g/dL)", 13.5, { min: 4, max: 20, step: 0.1 }),
        makeN("wbc", "WBC Count (10³/µL)", 8.0, { min: 1, max: 40, step: 0.1 }),
        makeN("age", "Age (years)", 65, { min: 18, max: 100 }),
        makeN("crcl", "CrCl (mL/min)", 75, { min: 5, max: 180 }),
        makeS("bleed", "Prior spontaneous bleeding history?", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      table: {
        headers: ["Score", "Bleeding Risk", "DAPT Strategy"],
        rows: [
          { id: "low", cols: ["< 25 Points", "Non-High Bleeding Risk", "Standard or prolonged DAPT (12–24 months)"] },
          { id: "high", cols: ["≥ 25 Points", "High Bleeding Risk (HBR)", "Shortened DAPT (3–6 months) recommended"] }
        ]
      },
      calc: function (v) {
        var score = (18 - Math.min(+v.hb, 18)) * 3.5 + (+v.wbc * 0.8) + (+v.age * 0.4) + Math.max(0, (100 - +v.crcl) * 0.25) + (+v.bleed ? 15 : 0);
        score = Math.round(Math.max(0, score));
        var match = score >= 25 ? "high" : "low";
        return {
          value: "PRECISE-DAPT: " + score + " Points",
          matchId: match,
          eq: score >= 25 ? "Score ≥ 25: High bleeding risk. Shorten DAPT to 3–6 months." : "Score < 25: Standard DAPT duration supported."
        };
      }
    },
    {
      id: "daptScore",
      cat: "cardio",
      type: "class",
      name: "DAPT Score (Late Extension Decision at 12 Months)",
      desc: "Decision tool applied at 12 months of uneventful DAPT to determine late continuation.",
      organ: "Coronary Stent",
      region: "Cath Lab / Outpatient",
      subject: "Interventional Cardiology",
      keywords: ["dapt score", "dual antiplatelet", "pci", "stent thrombosis"],
      guidance: "Score ≥ 2: Benefits of ischemic protection outweigh bleeding risk (extend DAPT). Score < 2: Discontinue P2Y12 inhibitor.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "Development and validation of the DAPT score",
        citation: "Yeh RW, Secemsky EA, Kereiakes DJ, et al. JAMA. 2016;315(16):1735-1749.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/27022970/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1001/jama.2016.3775" }
        ]
      }],
      fields: [
        makeS("age", "Age", "0", [["0", "<65 years (0)"], ["-1", "65–74 years (−1)"], ["-2", "≥75 years (−2)"]]),
        makeS("smoker", "Current cigarette smoker", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("dm", "Diabetes mellitus", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("mi", "MI at presentation", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("prior_pci_mi", "Prior PCI or prior MI", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("stent_diam", "Stent diameter < 3 mm", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("chf", "CHF or LVEF < 30%", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        makeS("vein_graft", "Vein graft PCI", "0", [["0", "No (0)"], ["2", "Yes (+2)"]])
      ],
      table: {
        headers: ["DAPT Score", "Recommendation at 12 Months"],
        rows: [
          { id: "stop", cols: ["Score < 2", "Unfavorable benefit/risk: Stop DAPT at 12 months; continue Aspirin alone"] },
          { id: "extend", cols: ["Score ≥ 2", "Favorable ischemic protection: Continue DAPT beyond 12 months"] }
        ]
      },
      calc: function (v) {
        var total = +v.age + +v.smoker + +v.dm + +v.mi + +v.prior_pci_mi + +v.stent_diam + +v.chf + +v.vein_graft;
        var match = total >= 2 ? "extend" : "stop";
        return {
          value: "DAPT Score: " + total + " Points",
          matchId: match,
          eq: total >= 2 ? "Favorable for extended DAPT." : "Stop DAPT at 12 months to prevent excess bleeding."
        };
      }
    },
    {
      id: "arcHbr",
      cat: "cardio",
      type: "class",
      name: "ARC-HBR High Bleeding Risk Criteria",
      desc: "Consensus criteria defining High Bleeding Risk (HBR) for patients undergoing PCI.",
      organ: "Systemic",
      region: "Interventional Cardiology",
      subject: "Bleeding Risk",
      keywords: ["arc-hbr", "hbr", "bleeding risk", "pci"],
      guidance: "Defined by ≥ 1 Major criterion OR ≥ 2 Minor criteria.",
      literature: [{
        type: "Consensus",
        icon: "📘",
        title: "Defining high bleeding risk in patients undergoing percutaneous coronary intervention",
        citation: "Urban P, Mehran R, Colleran R, et al. Circulation. 2019;140(3):240-261.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/31116075/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1161/CIRCULATIONAHA.119.040167" }
        ]
      }],
      fields: [
        makeS("major", "Major Criteria (OAC, eGFR<30, Hb<11, prior ICH, active malignancy)", "0", [
          ["0", "0 Major criteria"], ["1", "1 Major criterion"], ["2", "≥ 2 Major criteria"]
        ]),
        makeS("minor", "Minor Criteria (Age ≥75, eGFR 30–59, Hb 11–12.9, chronic NSAIDs)", "0", [
          ["0", "0 Minor criteria"], ["1", "1 Minor criterion"], ["2", "≥ 2 Minor criteria"]
        ])
      ],
      table: {
        headers: ["Classification", "Clinical Interpretation"],
        rows: [
          { id: "hbr", cols: ["ARC-HBR Positive", "High Bleeding Risk (>4% BARC 3–5 bleeding/year)"] },
          { id: "notHbr", cols: ["ARC-HBR Negative", "Standard bleeding risk"] }
        ]
      },
      calc: function (v) {
        var isHbr = +v.major >= 1 || +v.minor >= 2;
        var match = isHbr ? "hbr" : "notHbr";
        return {
          value: isHbr ? "ARC-HBR Positive (High Bleeding Risk)" : "ARC-HBR Negative",
          matchId: match,
          eq: isHbr ? "Consider 1–3 month abbreviated DAPT." : "Standard DAPT."
        };
      }
    },
    {
      id: "crusadeScore",
      cat: "cardio",
      type: "class",
      name: "CRUSADE In-Hospital Bleeding Score (NSTE-ACS)",
      desc: "Predicts in-hospital major bleeding risk in acute non-ST-elevation ACS.",
      organ: "Bone Marrow / Circulation",
      region: "Acute Coronary Care",
      subject: "Acute Coronary Syndrome",
      keywords: ["crusade", "bleeding", "nste-acs", "antithrombotic"],
      guidance: "Evaluates baseline hematocrit, CrCl, heart rate, SBP, sex, diabetes, and heart failure.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "A validated risk score for in-hospital major bleeding in patients with NSTE-ACS: the CRUSADE score",
        citation: "Subherwal S, Bach RG, Chen AY, et al. J Am Coll Cardiol. 2009;53(20):1873-1881.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/19442887/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1016/j.jacc.2009.02.044" }
        ]
      }],
      fields: [
        makeN("hct", "Baseline Hematocrit (%)", 38, { min: 10, max: 60 }),
        makeN("crcl", "CrCl (mL/min)", 65, { min: 5, max: 180 }),
        makeN("hr", "Heart Rate (bpm)", 80, { min: 30, max: 200 }),
        makeS("sex", "Sex", "0", [["0", "Male (0)"], ["8", "Female (+8)"]]),
        makeS("signs_hf", "Heart failure signs on presentation", "0", [["0", "No (0)"], ["7", "Yes (+7)"]]),
        makeS("prior_vasc", "Prior vascular disease", "0", [["0", "No (0)"], ["6", "Yes (+6)"]]),
        makeS("dm", "Diabetes mellitus", "0", [["0", "No (0)"], ["6", "Yes (+6)"]]),
        makeN("sbp", "Systolic BP (mmHg)", 130, { min: 60, max: 260 })
      ],
      table: {
        headers: ["CRUSADE Points", "Bleeding Risk Tier", "In-Hospital Major Bleed %"],
        rows: [
          { id: "vLow", cols: ["≤ 20 Points", "Very Low", "~ 3.1%"] },
          { id: "low", cols: ["21 – 30 Points", "Low", "~ 5.5%"] },
          { id: "mod", cols: ["31 – 40 Points", "Moderate", "~ 8.6%"] },
          { id: "high", cols: ["41 – 50 Points", "High", "~ 11.9%"] },
          { id: "vHigh", cols: ["> 50 Points", "Very High", "~ 19.5%"] }
        ]
      },
      calc: function (v) {
        var pts = +v.sex + +v.signs_hf + +v.prior_vasc + +v.dm;
        var hct = +v.hct, crcl = +v.crcl, hr = +v.hr, sbp = +v.sbp;
        if (hct < 31) pts += 9; else if (hct < 34) pts += 7; else if (hct < 37) pts += 3; else if (hct < 40) pts += 2;
        if (crcl <= 15) pts += 39; else if (crcl <= 30) pts += 35; else if (crcl <= 60) pts += 28; else if (crcl <= 90) pts += 17; else if (crcl <= 120) pts += 7;
        if (hr >= 121) pts += 11; else if (hr >= 111) pts += 10; else if (hr >= 101) pts += 8; else if (hr >= 91) pts += 6; else if (hr >= 81) pts += 3; else if (hr >= 71) pts += 1;
        if (sbp <= 90) pts += 10; else if (sbp <= 100) pts += 8; else if (sbp <= 110) pts += 5; else if (sbp <= 120) pts += 3; else if (sbp >= 201) pts += 5; else if (sbp >= 181) pts += 3; else if (sbp >= 161) pts += 1;
        var match = pts > 50 ? "vHigh" : pts > 40 ? "high" : pts > 30 ? "mod" : pts > 20 ? "low" : "vLow";
        return { value: "CRUSADE: " + pts + " Points", matchId: match, eq: "Calibrate antithrombotic dosing and use radial access." };
      }
    },
    {
      id: "cacAgatston",
      cat: "cardio",
      type: "class",
      name: "Coronary Artery Calcium (Agatston CAC)",
      desc: "Risk stratification by non-contrast cardiac CT calcium scoring.",
      organ: "Coronary Arteries",
      region: "Cardiovascular Prevention",
      subject: "Preventive Cardiology / CT",
      keywords: ["cac", "agatston", "calcium score", "ct coronary"],
      guidance: "CAC = 0 (very low risk), 1–99 (mild plaque), 100–299 (moderate), ≥300–400 (extensive plaque).",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "Quantification of coronary artery calcium using ultrafast computed tomography",
        citation: "Agatston AS, Janowitz WR, Hildner FJ, et al. J Am Coll Cardiol. 1990;15(4):827-832.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/2407762/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1016/0735-1097(90)90282-t" }
        ]
      }],
      fields: [
        makeN("cac", "Agatston CAC Score", 85, { min: 0, max: 4000, step: 1 })
      ],
      table: {
        headers: ["CAC Score", "Plaque Burden", "Preventive Statin Action"],
        rows: [
          { id: "c0", cols: ["0 Units", "Zero Plaque", "Statin may be deferred in borderline risk"] },
          { id: "c1_99", cols: ["1 – 99 Units", "Mild Plaque", "Favors statin therapy, especially if age ≥ 55"] },
          { id: "c100_399", cols: ["100 – 399 Units", "Moderate Plaque", "Statin recommended; reclassifies to high risk"] },
          { id: "c400", cols: ["≥ 400 Units", "Extensive Plaque", "High-intensity statin + consider Aspirin 81 mg"] }
        ]
      },
      calc: function (v) {
        var c = +v.cac;
        var match = c >= 400 ? "c400" : c >= 100 ? "c100_399" : c >= 1 ? "c1_99" : "c0";
        return { value: "CAC: " + c + " Agatston Units", matchId: match, eq: "Non-contrast cardiac CT quantification." };
      }
    },

    // ==============================================================
    // 4. VALVULAR HEART DISEASE
    // ==============================================================
    {
      id: "asSeverity",
      cat: "cardio",
      type: "class",
      name: "Aortic Stenosis Severity Classifier",
      desc: "Multimodality echocardiographic grading of native aortic stenosis severity.",
      organ: "Aortic Valve",
      region: "Valvular Disease",
      subject: "Echocardiography / Valvular Heart Disease",
      keywords: ["aortic stenosis", "ava", "vmax", "gradient", "tavr", "savoir"],
      guidance: "Severe AS: AVA ≤ 1.0 cm² (Indexed < 0.6 cm²/m²), Vmax ≥ 4.0 m/s, or Mean Gradient ≥ 40 mmHg.",
      literature: [{
        type: "ACC/AHA Guideline",
        icon: "📘",
        title: "2020 ACC/AHA Guideline for the Management of Patients With Valvular Heart Disease",
        citation: "Otto CM, Nishimura RA, Bonow RO, et al. Circulation. 2021;143(5):e72-e227.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/33332150/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1161/CIR.0000000000000923" }
        ]
      }],
      fields: [
        makeN("vmax", "Peak Jet Velocity (Vmax, m/s)", 4.2, { min: 1.0, max: 8.0, step: 0.1 }),
        makeN("mg", "Mean Transaortic Gradient (mmHg)", 44, { min: 1, max: 120 }),
        makeN("ava", "Aortic Valve Area (AVA, cm²)", 0.8, { min: 0.2, max: 4.0, step: 0.05 }),
        makeN("avai", "Indexed AVA (cm²/m²)", 0.45, { min: 0.1, max: 2.5, step: 0.05 })
      ],
      table: {
        headers: ["AS Severity", "Aortic Valve Area", "Mean Gradient", "Peak Velocity"],
        rows: [
          { id: "mild", cols: ["Mild AS", "> 1.5 cm²", "< 20 mmHg", "2.0 – 2.9 m/s"] },
          { id: "mod", cols: ["Moderate AS", "1.0 – 1.5 cm²", "20 – 39 mmHg", "3.0 – 3.9 m/s"] },
          { id: "severeHigh", cols: ["Severe AS (High-Gradient)", "≤ 1.0 cm² (≤0.6 cm²/m²)", "≥ 40 mmHg", "≥ 4.0 m/s"] },
          { id: "severeLow", cols: ["Severe AS (Low-Gradient)", "≤ 1.0 cm²", "< 40 mmHg", "Assess stroke volume index"] }
        ]
      },
      calc: function (v) {
        var vm = +v.vmax, mg = +v.mg, ava = +v.ava;
        var match = "mild", dx = "Mild Aortic Stenosis";
        if (vm >= 4.0 && mg >= 40 && ava <= 1.0) { match = "severeHigh"; dx = "High-Gradient Severe Aortic Stenosis"; }
        else if (ava <= 1.0 && mg < 40) { match = "severeLow"; dx = "Low-Gradient Severe Aortic Stenosis (assess for low-flow)"; }
        else if (vm >= 3.0 || mg >= 20 || ava <= 1.5) { match = "mod"; dx = "Moderate Aortic Stenosis"; }
        return { value: dx, matchId: match, eq: "Guideline criteria: AVA ≤ 1.0 cm², Vmax ≥ 4.0 m/s, Mean Gradient ≥ 40 mmHg." };
      }
    },
    {
      id: "avaContinuity",
      cat: "cardio",
      type: "calc",
      name: "Aortic Valve Area (Continuity Equation)",
      desc: "Calculates AVA using stroke volume through LVOT divided by AV VTI.",
      organ: "Aortic Valve",
      region: "Echocardiography",
      subject: "Aortic Stenosis",
      keywords: ["ava", "continuity equation", "lvot", "aortic stenosis"],
      guidance: "1. Formula: AVA = (LVOT Area × LVOT VTI) ÷ AV VTI = (0.7854 × LVOT diameter² × LVOT VTI) ÷ AV VTI.\n2. Ensure LVOT diameter is measured in parasternal long-axis at mid-systole from inner edge to inner edge, 3–10 mm apical to aortic annulus.\n3. Continuous-wave Doppler of aortic jet must be aligned parallel to blood flow to obtain true maximal VTI.",
      contraindications: "Subaortic obstruction (e.g., HOCM with dynamic SAM) or significant aortic regurgitation can overestimate flow across LVOT.",
      literature: [{
        type: "EACVI/ASE Recommendations",
        icon: "📘",
        title: "Echocardiographic assessment of valve stenosis: EAE/ASE recommendations for clinical practice",
        citation: "Baumgartner H, Hung J, Bermejo J, et al. J Am Soc Echocardiogr. 2009;22(1):1-23.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/19130998/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1016/j.echo.2008.11.029" }
        ]
      }],
      fields: [
        makeN("lvot_d", "LVOT Diameter (cm)", 2.0, { min: 1.2, max: 3.2, step: 0.1 }),
        makeN("lvot_vti", "LVOT VTI (cm)", 18, { min: 5, max: 40, step: 0.5 }),
        makeN("av_vti", "Aortic Valve VTI (cm)", 45, { min: 10, max: 120, step: 0.5 })
      ],
      table: {
        headers: ["Calculated AVA", "Severity Grade", "Indexed AVA (BSA ~1.8 m²)"],
        rows: [
          { id: "normal", cols: ["> 1.5 cm²", "Mild / Non-significant Stenosis", "> 0.85 cm²/m²"] },
          { id: "moderate", cols: ["1.0 – 1.5 cm²", "Moderate Aortic Stenosis", "0.60 – 0.85 cm²/m²"] },
          { id: "severe", cols: ["≤ 1.0 cm²", "Severe Aortic Stenosis", "≤ 0.60 cm²/m²"] }
        ]
      },
      calc: function (v) {
        var area = 0.7854 * Math.pow(+v.lvot_d, 2);
        var ava = (area * +v.lvot_vti) / +v.av_vti;
        var match = ava <= 1.0 ? "severe" : ava <= 1.5 ? "moderate" : "normal";
        return {
          value: ava.toFixed(2) + " cm² (" + (ava <= 1.0 ? "Severe AS" : ava <= 1.5 ? "Moderate AS" : "Mild/Normal") + ")",
          matchId: match,
          eq: "Continuity: AVA = (LVOT Area [" + area.toFixed(2) + " cm²] × LVOT VTI [" + v.lvot_vti + "]) / AV VTI [" + v.av_vti + "]."
        };
      }
    },
    {
      id: "mvaPht",
      cat: "cardio",
      type: "calc",
      name: "Mitral Valve Area (Pressure Half-Time)",
      desc: "Calculates MVA via Doppler deceleration pressure half-time in rheumatic mitral stenosis.",
      organ: "Mitral Valve",
      region: "Echocardiography",
      subject: "Mitral Stenosis",
      keywords: ["mva", "pressure half time", "pht", "mitral stenosis"],
      guidance: "1. Formula: MVA = 220 ÷ PHT (ms).\n2. PHT is the time required for peak trans-mitral pressure gradient to decline by 50%.\n3. Measure continuous-wave Doppler deceleration slope across the mitral valve in early diastole.\n4. Normal MVA is 4.0–5.0 cm²; severe stenosis is ≤ 1.5 cm² (very severe ≤ 1.0 cm²).",
      contraindications: "Unreliable immediately post-percutaneous mitral balloon valvuloplasty, in severe aortic regurgitation (competes with LV filling), or with marked left ventricular non-compliance.",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "Noninvasive assessment of atrioventricular pressure half-time by Doppler ultrasound",
        citation: "Hatle L, Angelsen B, Tromsdal A. Circulation. 1979;60(5):1096-1104.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/487541/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1161/01.cir.60.5.1096" }
        ]
      }],
      fields: [
        makeN("pht", "Mitral Deceleration PHT (ms)", 160, { min: 40, max: 500, step: 5 })
      ],
      table: {
        headers: ["Mitral Valve Area", "Severity Grade", "PHT Range"],
        rows: [
          { id: "mild", cols: ["> 1.5 cm²", "Mild Mitral Stenosis", "PHT < 150 ms"] },
          { id: "severe", cols: ["1.0 – 1.5 cm²", "Severe Mitral Stenosis", "PHT 150 – 220 ms"] },
          { id: "verySevere", cols: ["< 1.0 cm²", "Very Severe Mitral Stenosis", "PHT > 220 ms"] }
        ]
      },
      calc: function (v) {
        var mva = 220 / +v.pht;
        var match = mva <= 1.0 ? "verySevere" : mva <= 1.5 ? "severe" : "mild";
        var tier = mva <= 1.0 ? "Very Severe MS" : mva <= 1.5 ? "Severe MS" : "Mild-to-Moderate MS";
        return {
          value: mva.toFixed(2) + " cm² (" + tier + ")",
          matchId: match,
          eq: "Formula: MVA = 220 / PHT (" + v.pht + " ms)."
        };
      }
    },
    {
      id: "meanGradInterp",
      cat: "cardio",
      type: "calc",
      name: "Transvalvular Mean Gradient Interpretation",
      desc: "Correlates Doppler-derived mean gradient with hemodynamic stenosis severity.",
      organ: "Aortic / Mitral Valves",
      region: "Echocardiography",
      subject: "Valvular Disease",
      keywords: ["mean gradient", "aortic stenosis", "mitral stenosis"],
      guidance: "1. Derived by tracing the continuous-wave Doppler velocity time integral (VTI) envelope.\n2. Severe AS is defined as mean gradient ≥ 40 mmHg.\n3. Clinically significant mitral stenosis is mean gradient ≥ 5 mmHg (severe ≥ 10 mmHg at normal heart rates).",
      contraindications: "Highly flow-dependent; evaluate stroke volume index to avoid misclassifying low-flow states.",
      literature: [{
        type: "EACVI/ASE Guidelines",
        icon: "📘",
        title: "Recommendations for the Imaging Assessment of Prosthetic Heart Valves",
        citation: "Lancellotti P, Pibarot P, Chambers J, et al. Eur Heart J Cardiovasc Imaging. 2016;17(6):589-590.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/27143787/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1093/ehjci/jew025" }
        ]
      }],
      fields: [
        makeS("valve", "Valve Evaluated", "aortic", [["aortic", "Aortic Valve"], ["mitral", "Mitral Valve"]]),
        makeN("grad", "Mean Doppler Gradient (mmHg)", 35, { min: 1, max: 120 })
      ],
      table: {
        headers: ["Valve", "Mild", "Moderate", "Severe"],
        rows: [
          { id: "ao", cols: ["Aortic", "< 20 mmHg", "20 – 39 mmHg", "≥ 40 mmHg"] },
          { id: "mi", cols: ["Mitral", "< 5 mmHg", "5 – 9 mmHg", "≥ 10 mmHg"] }
        ]
      },
      calc: function (v) {
        var g = +v.grad;
        var isAo = v.valve === "aortic";
        var s = isAo
          ? (g >= 40 ? "Severe AS range (≥40 mmHg)" : g >= 20 ? "Moderate AS range (20–39 mmHg)" : "Mild AS range")
          : (g >= 10 ? "Severe MS range (≥10 mmHg)" : g >= 5 ? "Significant MS (5–9 mmHg)" : "Mild MS (<5 mmHg)");
        return {
          value: g + " mmHg (" + s + ")",
          matchId: isAo ? "ao" : "mi",
          eq: "Mean gradient derived from CW Doppler envelope integration."
        };
      }
    },
    {
      id: "regurgFraction",
      cat: "cardio",
      type: "calc",
      name: "Regurgitant Fraction Calculator",
      desc: "Calculates regurgitant fraction from total stroke volume and regurgitant volume.",
      organ: "Mitral / Aortic Valve",
      region: "Echocardiography",
      subject: "Valvular Regurgitation",
      keywords: ["regurgitant fraction", "mitral regurgitation", "aortic regurgitation"],
      guidance: "1. Formula: Regurgitant Fraction (RF) = (Regurgitant Volume ÷ Total Forward Stroke Volume) × 100%.\n2. Severe regurgitation is confirmed when RF ≥ 50%.\n3. Mild: < 30%; Moderate: 30–49%.",
      literature: [{
        type: "ASE Guidelines",
        icon: "📘",
        title: "Recommendations for noninvasive evaluation of native valvular regurgitation",
        citation: "Zoghbi WA, Adams D, Bonow RO, et al. J Am Soc Echocardiogr. 2017;30(4):303-371.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/28314623/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1016/j.echo.2017.01.007" }
        ]
      }],
      fields: [
        makeN("rvol", "Regurgitant Volume (mL/beat)", 55, { min: 5, max: 200 }),
        makeN("tsv", "Total Forward Stroke Volume (mL/beat)", 100, { min: 20, max: 300 })
      ],
      table: {
        headers: ["Regurgitant Fraction", "Grading Tier"],
        rows: [
          { id: "mild", cols: ["< 30%", "Mild Regurgitation"] },
          { id: "mod", cols: ["30% – 49%", "Moderate Regurgitation"] },
          { id: "severe", cols: ["≥ 50%", "Severe Regurgitation (surgical/interventional threshold)"] }
        ]
      },
      calc: function (v) {
        var rf = (+v.rvol / +v.tsv) * 100;
        var match = rf >= 50 ? "severe" : rf >= 30 ? "mod" : "mild";
        var desc = rf >= 50 ? "Severe Regurgitation (≥50%)" : rf >= 30 ? "Moderate Regurgitation" : "Mild Regurgitation";
        return {
          value: rf.toFixed(1) + "% (" + desc + ")",
          matchId: match,
          eq: "Formula: RF = (Regurgitant Volume [" + v.rvol + " mL] ÷ Total SV [" + v.tsv + " mL]) × 100."
        };
      }
    },
    {
      id: "pisaEroa",
      cat: "cardio",
      type: "calc",
      name: "PISA / EROA Regurgitation Quantification",
      desc: "Calculates EROA and regurgitant volume using the proximal isovelocity surface area method.",
      organ: "Mitral / Aortic Valve",
      region: "Echocardiography",
      subject: "Regurgitation",
      keywords: ["pisa", "eroa", "regurgitation", "rvol"],
      guidance: "1. Optimize color Doppler baseline shifted in the direction of the regurgitant jet to aliasing velocity 30–40 cm/s.\n2. Measure PISA radius (r) at mid-systole.\n3. Flow = 2π × r² × V_alias.\n4. EROA = Flow ÷ Peak Jet Velocity.\n5. Regurgitant Volume = EROA × Jet VTI.\n6. Severe MR: EROA ≥ 0.40 cm² or RVol ≥ 60 mL.",
      contraindications: "Inaccurate with non-hemispheric, eccentric wall-hugging jets (e.g., severe leaflet prolapse) or dynamic orifice variation.",
      literature: [{
        type: "ASE Recommendations",
        icon: "📘",
        title: "Recommendations for noninvasive evaluation of native valvular regurgitation",
        citation: "Zoghbi WA, Adams D, Bonow RO, et al. J Am Soc Echocardiogr. 2017;30(4):303-371.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/28314623/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1016/j.echo.2017.01.007" }
        ]
      }],
      fields: [
        makeN("radius", "PISA Radius (r, cm)", 0.9, { min: 0.1, max: 3.0, step: 0.1 }),
        makeN("valias", "Aliasing Velocity (cm/s)", 38, { min: 10, max: 80 }),
        makeN("vmax", "Peak Jet Velocity (m/s)", 5.0, { min: 1.0, max: 7.0, step: 0.1 }),
        makeN("vti", "Regurgitant Jet VTI (cm)", 120, { min: 20, max: 300 })
      ],
      table: {
        headers: ["Severity Grade", "EROA (Mitral)", "Regurgitant Volume (RVol)"],
        rows: [
          { id: "mild", cols: ["Mild Regurgitation", "< 0.20 cm²", "< 30 mL/beat"] },
          { id: "mod", cols: ["Moderate Regurgitation", "0.20 – 0.39 cm²", "30 – 59 mL/beat"] },
          { id: "severe", cols: ["Severe Regurgitation", "≥ 0.40 cm²", "≥ 60 mL/beat"] }
        ]
      },
      calc: function (v) {
        var flow = 6.2832 * Math.pow(+v.radius, 2) * +v.valias;
        var eroa = flow / (+v.vmax * 100);
        var rvol = eroa * +v.vti;
        var match = (eroa >= 0.4 || rvol >= 60) ? "severe" : (eroa >= 0.2 || rvol >= 30) ? "mod" : "mild";
        var tier = (eroa >= 0.4 || rvol >= 60) ? "Severe Regurgitation" : (eroa >= 0.2 || rvol >= 30) ? "Moderate Regurgitation" : "Mild";
        return {
          value: "EROA: " + eroa.toFixed(2) + " cm² | RVol: " + Math.round(rvol) + " mL (" + tier + ")",
          matchId: match,
          eq: "Flow = 2π × r² × V_alias = " + Math.round(flow) + " mL/s. EROA = Flow / Vmax. RVol = EROA × VTI."
        };
      }
    },
    {
      id: "ppmValve",
      cat: "cardio",
      type: "class",
      name: "Prosthetic Valve-Patient Mismatch (Indexed EOA)",
      desc: "Calculates indexed effective orifice area for aortic and mitral prostheses.",
      organ: "Prosthetic Valve",
      region: "Post-Surgical / Valve Clinic",
      subject: "Prosthetic Valves",
      keywords: ["ppm", "prosthetic mismatch", "indexed eoa", "tavr"],
      guidance: "Aortic: Severe if < 0.65 cm²/m² (in BMI ≥30 kg/m², severe if < 0.55–0.60 cm²/m²). Mitral: Severe if < 0.90 cm²/m².",
      literature: [{
        type: "Seminal Paper",
        icon: "📄",
        title: "Prosthesis-patient mismatch after aortic valve replacement: effect on long-term survival",
        citation: "Pibarot P, Dumesnil JG. Circulation. 2000;102(19 Suppl 3):III211-III218.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/11082390/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1161/01.cir.102.suppl_3.iii-211" }
        ]
      }],
      fields: [
        makeS("position", "Valve Position", "aortic", [["aortic", "Aortic Prosthesis"], ["mitral", "Mitral Prosthesis"]]),
        makeN("eoa", "Prosthetic Valve EOA (cm²)", 1.3, { min: 0.5, max: 4.5, step: 0.05 }),
        makeN("bsa", "Patient BSA (m²)", 1.85, { min: 0.8, max: 3.2, step: 0.05 })
      ],
      table: {
        headers: ["Position", "Severe PPM", "Moderate PPM", "No PPM"],
        rows: [
          { id: "ao", cols: ["Aortic", "≤ 0.65 cm²/m²", "0.66 – 0.85 cm²/m²", "> 0.85 cm²/m²"] },
          { id: "mi", cols: ["Mitral", "≤ 0.90 cm²/m²", "0.91 – 1.20 cm²/m²", "> 1.20 cm²/m²"] }
        ]
      },
      calc: function (v) {
        var ieoa = +v.eoa / +v.bsa;
        var isAo = v.position === "aortic";
        var c = isAo
          ? (ieoa <= 0.65 ? "Severe Mismatch (≤0.65 cm²/m²)" : ieoa <= 0.85 ? "Moderate Mismatch" : "No PPM")
          : (ieoa <= 0.90 ? "Severe Mismatch (≤0.90 cm²/m²)" : ieoa <= 1.20 ? "Moderate Mismatch" : "No PPM");
        return { value: ieoa.toFixed(2) + " cm²/m² (" + c + ")", matchId: isAo ? "ao" : "mi", eq: "Indexed EOA = Valve EOA ÷ BSA." };
      }
    },

    // ==============================================================
    // 5. HEART FAILURE & CARDIOMYOPATHY
    // ==============================================================
    {
      id: "nyhaClass",
      cat: "cardio",
      type: "class",
      name: "NYHA Functional Classification",
      desc: "Standardized functional grading of heart failure symptom limitation.",
      organ: "Myocardium",
      region: "Heart Failure",
      subject: "Functional Assessment",
      keywords: ["nyha", "heart failure", "functional class", "dyspnea"],
      guidance: "Class I (no limitation) to Class IV (symptoms at rest).",
      fields: [
        makeS("class", "NYHA Class", "I", [
          ["I", "Class I — No limitation of physical activity. Ordinary activity causes no symptoms."],
          ["II", "Class II — Slight limitation. Comfortable at rest, ordinary activity causes fatigue/dyspnea."],
          ["III", "Class III — Marked limitation. Comfortable at rest, less than ordinary activity causes symptoms."],
          ["IV", "Class IV — Inability to carry out physical activity without discomfort. Symptoms at rest."]
        ])
      ],
      table: {
        headers: ["NYHA Class", "Activity Tolerance"],
        rows: [
          { id: "c1", cols: ["Class I", "No symptoms with ordinary physical exertion"] },
          { id: "c2", cols: ["Class II", "Symptoms with ordinary activity; comfortable at rest"] },
          { id: "c3", cols: ["Class III", "Symptoms with minimal exertion; comfortable at rest"] },
          { id: "c4", cols: ["Class IV", "Inability to perform any activity without discomfort; symptoms at rest"] }
        ]
      },
      calc: function (v) {
        return { value: "NYHA Class " + v.class, matchId: "c" + (v.class === "I" ? "1" : v.class === "II" ? "2" : v.class === "III" ? "3" : "4"), eq: "Serial functional assessment." };
      }
    },
    {
      id: "accAhaHfStage",
      cat: "cardio",
      type: "class",
      name: "ACC/AHA Heart Failure Staging",
      desc: "Four-stage structural and clinical progression of heart failure.",
      organ: "Myocardium",
      region: "Heart Failure",
      subject: "Staging / Prevention",
      keywords: ["acc/aha", "stages", "heart failure stages", "stage c", "stage d"],
      guidance: "Progression is unidirectional from A to D. Stage C represents symptomatic heart failure.",
      literature: [{
        type: "AHA/ACC/HFSA Guideline",
        icon: "📘",
        title: "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure",
        citation: "Heidenreich PA, Bozkurt B, Aguilar D, et al. Circulation. 2022;145(18):e895-e1032.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/35363499/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1161/CIR.0000000000001063" }
        ]
      }],
      fields: [
        makeS("stage", "Clinical & Structural Stage", "C", [
          ["A", "Stage A: At Risk for HF (risk factors without structural disease or biomarker elevation)"],
          ["B", "Stage B: Pre-HF (structural heart disease, elevated BNP, or abnormal strain without symptoms)"],
          ["C", "Stage C: Symptomatic HF (current or prior symptoms with structural disease)"],
          ["D", "Stage D: Advanced HF (refractory symptoms requiring LVAD, inotropes, or transplant)"]
        ])
      ],
      table: {
        headers: ["Stage", "Definition", "Therapeutic Focus"],
        rows: [
          { id: "sA", cols: ["Stage A", "At Risk for HF", "Treat HTN, diabetes, SGLT2i if CKD/T2D, lifestyle"] },
          { id: "sB", cols: ["Stage B", "Pre-Heart Failure", "GDMT: Beta-blocker, ACEi/ARB/ARNI if LVEF ≤40%"] },
          { id: "sC", cols: ["Stage C", "Symptomatic HF", "Four-pillar GDMT (ARNI/ACEi, BB, MRA, SGLT2i) + Diuretics"] },
          { id: "sD", cols: ["Stage D", "Advanced / Refractory HF", "Advanced therapies: Inotropes, LVAD, heart transplant, palliative care"] }
        ]
      },
      calc: function (v) {
        return { value: "ACC/AHA Stage " + v.stage, matchId: "s" + v.stage, eq: "Universal definition of heart failure (2022)." };
      }
    },
    {
      id: "maggicScore",
      cat: "cardio",
      type: "class",
      name: "MAGGIC Heart Failure Mortality Risk Score",
      desc: "Predicts 1-year and 3-year mortality in heart failure across both preserved and reduced ejection fraction.",
      organ: "Myocardium",
      region: "Heart Failure",
      subject: "Prognosis",
      keywords: ["maggic", "heart failure", "mortality", "hfref", "hfpef"],
      guidance: "Validated across 39,372 patients with HFrEF and HFpEF using 13 clinical variables.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "The survival of patients with heart failure with preserved or reduced left ventricular ejection fraction: an individual patient data meta-analysis (MAGGIC)",
        citation: "Pocock SJ, Ariti CA, McMurray JJ, et al. Eur Heart J. 2013;34(19):1404-1413.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/23095984/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1093/eurheartj/ehs337" }
        ]
      }],
      fields: [
        makeN("age", "Age (years)", 65, { min: 18, max: 105 }),
        makeN("ef", "Ejection Fraction (%)", 35, { min: 10, max: 75 }),
        makeN("sbp", "Systolic BP (mmHg)", 115, { min: 60, max: 240 }),
        makeN("bmi", "BMI (kg/m²)", 26, { min: 12, max: 55 }),
        makeN("creat", "Serum Creatinine (mg/dL)", 1.2, { min: 0.3, max: 10.0, step: 0.1 }),
        makeS("nyha", "NYHA Class", "2", [["1", "Class I (0)"], ["2", "Class II (+2)"], ["3", "Class III (+6)"], ["4", "Class IV (+8)"]]),
        makeS("male", "Sex", "1", [["1", "Male (+1)"], ["0", "Female (0)"]]),
        makeS("smoker", "Current Smoker", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("dm", "Diabetes", "0", [["0", "No (0)"], ["1", "Yes (+3)"]]),
        makeS("copd", "COPD", "0", [["0", "No (0)"], ["1", "Yes (+2)"]]),
        makeS("first_hf", "First diagnosed within 18 months", "0", [["0", "No (0)"], ["1", "Yes (+2)"]]),
        makeS("no_bb", "Not on Beta-Blocker", "0", [["0", "On BB (0)"], ["1", "Not on BB (+3)"]]),
        makeS("no_acei", "Not on ACEi / ARB / ARNI", "0", [["0", "On ACEi/ARB (0)"], ["1", "Not on ACEi/ARB (+1)"]])
      ],
      table: {
        headers: ["Points", "Estimated 1-Year Mortality", "Estimated 3-Year Mortality"],
        rows: [
          { id: "pLow", cols: ["< 16 Points", "< 5%", "< 12%"] },
          { id: "pMid", cols: ["16 – 24 Points", "5% – 15%", "15% – 30%"] },
          { id: "pHigh", cols: ["25 – 32 Points", "15% – 30%", "30% – 50%"] },
          { id: "pVHigh", cols: ["> 32 Points", "> 35%", "> 60%"] }
        ]
      },
      calc: function (v) {
        var pts = +v.nyha + +v.male + +v.smoker + +v.dm + +v.copd + +v.first_hf + +v.no_bb + +v.no_acei;
        var a = +v.age, ef = +v.ef, sbp = +v.sbp, bmi = +v.bmi, cr = +v.creat;
        if (a >= 80) pts += 10; else if (a >= 70) pts += 8; else if (a >= 60) pts += 5; else if (a >= 50) pts += 3;
        if (ef < 20) pts += 7; else if (ef < 30) pts += 5; else if (ef < 40) pts += 3;
        if (sbp < 110) pts += 5; else if (sbp < 130) pts += 3; else if (sbp < 150) pts += 1;
        if (bmi < 25) pts += 2;
        if (cr >= 2.5) pts += 4; else if (cr >= 1.5) pts += 2; else if (cr >= 1.1) pts += 1;
        var match = pts > 32 ? "pVHigh" : pts >= 25 ? "pHigh" : pts >= 16 ? "pMid" : "pLow";
        return { value: "MAGGIC Score: " + pts + " Points", matchId: match, eq: "Valid for both HFrEF and HFpEF." };
      }
    },
    {
      id: "seattleHfScore",
      cat: "cardio",
      type: "calc",
      name: "Seattle Heart Failure Model (SHFM Score)",
      desc: "Multivariable parametric mortality model estimating 1-, 2-, and 5-year survival in heart failure.",
      organ: "Heart",
      region: "Heart Failure",
      subject: "Heart Failure Prognosis",
      keywords: ["seattle heart failure", "shfm", "survival", "hfref"],
      guidance: "1. Calculates personal baseline survival curve from demographic, hemodynamic, laboratory, and medication variables.\n2. Quantifies additive survival benefit of introducing ARNI, Beta-blocker, MRA, SGLT2i, and CRT/ICD devices.",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "The Seattle Heart Failure Model: prediction of survival in heart failure",
        citation: "Levy WC, Mozaffarian D, Linker DT, et al. Circulation. 2006;113(11):1424-1433.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/16534009/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1161/CIRCULATIONAHA.105.584102" }
        ]
      }],
      fields: [
        makeN("age", "Age (years)", 62, { min: 18, max: 100 }),
        makeS("sex", "Sex", "m", [["m", "Male"], ["f", "Female"]]),
        makeS("nyha", "NYHA Class", "2", [["1", "Class I"], ["2", "Class II"], ["3", "Class III"], ["4", "Class IV"]]),
        makeN("ef", "Ejection Fraction (%)", 30, { min: 10, max: 70 }),
        makeN("sbp", "Systolic BP (mmHg)", 115, { min: 70, max: 220 }),
        makeN("na", "Serum Sodium (mEq/L)", 138, { min: 110, max: 155 }),
        makeS("arni_acei", "Prescribed ARNI / ACEi / ARB?", "1", [["1", "Yes"], ["0", "No"]]),
        makeS("bb", "Prescribed Beta-Blocker?", "1", [["1", "Yes"], ["0", "No"]]),
        makeS("mra", "Prescribed Aldosterone Antagonist (MRA)?", "1", [["1", "Yes"], ["0", "No"]]),
        makeS("crt_icd", "Device Implanted", "none", [
          ["none", "No device"],
          ["icd", "ICD only"],
          ["crt_d", "CRT-D (Bi-ventricular pacer + ICD)"]
        ])
      ],
      table: {
        headers: ["Projected Horizon", "Estimated Patient Survival"],
        rows: [
          { id: "surv1", cols: ["1-Year Projected Survival", "Evaluated dynamically"] },
          { id: "surv2", cols: ["2-Year Projected Survival", "Evaluated dynamically"] }
        ]
      },
      calc: function (v) {
        var score = 0;
        score += (+v.age * 0.03);
        if (v.sex === "m") score += 0.25;
        score += (+v.nyha * 0.45);
        score -= (+v.ef * 0.03);
        score -= (+v.sbp * 0.015);
        score -= ((+v.na - 140) * 0.04);
        if (v.arni_acei === "1") score -= 0.35;
        if (v.bb === "1") score -= 0.40;
        if (v.mra === "1") score -= 0.25;
        if (v.crt_icd === "crt_d") score -= 0.45;
        else if (v.crt_icd === "icd") score -= 0.25;

        var sur1 = Math.max(1, Math.min(99, Math.round(Math.exp(-0.06 * Math.exp(score)) * 100)));
        var sur2 = Math.max(1, Math.min(99, Math.round(Math.exp(-0.13 * Math.exp(score)) * 100)));
        return {
          value: "Estimated 1-Year Survival: " + sur1 + "% | 2-Year: " + sur2 + "%",
          matchId: "surv1",
          eq: "Seattle Heart Failure Model (SHFM). Quantifies survival impact of guideline-directed medical and device therapies."
        };
      }
    },
    {
      id: "adhereTree",
      cat: "cardio",
      type: "class",
      name: "ADHERE In-Hospital Mortality Risk Tree (Acute HF)",
      desc: "Emergency department bedside triage decision tree for acute decompensated heart failure.",
      organ: "Kidneys / Heart",
      region: "Emergency / Acute Care",
      subject: "Acute Decompensated Heart Failure",
      keywords: ["adhere", "heart failure", "bun", "creatinine", "mortality"],
      guidance: "Stratifies mortality using BUN (≥43 mg/dL), SBP (<115 mmHg), and Creatinine (≥2.75 mg/dL).",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "Risk stratification for in-hospital mortality in acutely decompensated heart failure: classification and regression tree analysis",
        citation: "Fonarow GC, Adams KF Jr, Abraham WT, et al. JAMA. 2005;293(5):572-580.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/15687312/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1001/jama.293.5.572" }
        ]
      }],
      fields: [
        makeN("bun", "Blood Urea Nitrogen (BUN, mg/dL)", 32, { min: 5, max: 180 }),
        makeN("sbp", "Admission Systolic BP (mmHg)", 125, { min: 50, max: 260 }),
        makeN("cr", "Serum Creatinine (mg/dL)", 1.2, { min: 0.3, max: 12.0, step: 0.1 })
      ],
      table: {
        headers: ["ADHERE Risk Node", "Risk Tier", "In-Hospital Mortality"],
        rows: [
          { id: "low", cols: ["BUN < 43 mg/dL", "Low Risk", "2.1%"] },
          { id: "interLow", cols: ["BUN ≥ 43 & SBP ≥ 115 mmHg", "Intermediate-Low Risk", "5.5%"] },
          { id: "interHigh", cols: ["BUN ≥ 43, SBP < 115, Cr < 2.75", "Intermediate-High Risk", "12.4%"] },
          { id: "high", cols: ["BUN ≥ 43, SBP < 115, Cr ≥ 2.75", "High Risk", "21.9% (Urgent ICU care)"] }
        ]
      },
      calc: function (v) {
        var bun = +v.bun, sbp = +v.sbp, cr = +v.cr;
        var match = "low", risk = "Low Risk (2.1% in-hospital mortality)";
        if (bun >= 43) {
          if (sbp >= 115) { match = "interLow"; risk = "Intermediate-Low Risk (5.5% mortality)"; }
          else if (cr >= 2.75) { match = "high"; risk = "High Risk (21.9% mortality) — intensive resuscitation needed"; }
          else { match = "interHigh"; risk = "Intermediate-High Risk (12.4% mortality)"; }
        }
        return { value: risk, matchId: match, eq: "ADHERE CART model in acute decompensated heart failure." };
      }
    },
    {
      id: "h2fpefScore",
      cat: "cardio",
      type: "class",
      name: "H₂FPEF Score for Diagnosing HFpEF",
      desc: "Discriminates heart failure with preserved ejection fraction from non-cardiac causes of dyspnea.",
      organ: "Left Ventricle / Diastole",
      region: "Heart Failure Clinic",
      subject: "HFpEF Diagnosis",
      keywords: ["h2fpef", "hfpef", "dyspnea", "diastolic"],
      guidance: "Score ≥ 6 indicates >90% probability of HFpEF.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "A simple, evidence-based approach to help guide the diagnosis of heart failure with preserved ejection fraction",
        citation: "Reddy YNV, Carter RE, Obokata M, et al. Circulation. 2018;138(9):861-870.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/29792299/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1161/CIRCULATIONAHA.118.034646" }
        ]
      }],
      fields: [
        makeS("heavy", "Heavy (BMI > 30 kg/m²)", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        makeS("htn", "Hypertensive (≥2 antihypertensive drugs)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("af", "Atrial Fibrillation (paroxysmal or persistent)", "0", [["0", "No (0)"], ["3", "Yes (+3)"]]),
        makeS("pulm_htn", "Pulmonary Hypertension (Echo PASP > 35 mmHg)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("elderly", "Elderly (Age > 60 years)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("filling", "Filling Pressure (Doppler septal E/e' > 9)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      table: {
        headers: ["H₂FPEF Score", "HFpEF Probability", "Recommendation"],
        rows: [
          { id: "low", cols: ["0 – 1 Points", "< 20%", "HFpEF unlikely; evaluate pulmonary/other etiologies"] },
          { id: "inter", cols: ["2 – 5 Points", "Intermediate (~50%)", "Further workup: diastolic stress test or invasive RHC"] },
          { id: "high", cols: ["6 – 9 Points", "> 90%", "Diagnostic of HFpEF; commence SGLT2i + MRA + diuretics"] }
        ]
      },
      calc: function (v) {
        var total = +v.heavy + +v.htn + +v.af + +v.pulm_htn + +v.elderly + +v.filling;
        var match = total >= 6 ? "high" : total >= 2 ? "inter" : "low";
        return {
          value: "H₂FPEF Score: " + total + " / 9 Points",
          matchId: match,
          eq: total >= 6 ? "High probability (>90%) of HFpEF." : total >= 2 ? "Intermediate probability; stress echo recommended." : "Low probability of HFpEF."
        };
      }
    },
    {
      id: "hfaPeffScore",
      cat: "cardio",
      type: "class",
      name: "HFA-PEFF Diagnostic Algorithm (ESC 2019)",
      desc: "Stepwise diagnostic score combining functional, morphological, and biomarker criteria for HFpEF.",
      organ: "Myocardium / Left Atrium",
      region: "Cardiology Outpatient",
      subject: "HFpEF",
      keywords: ["hfa-peff", "hfpef", "esc", "diastolic dysfunction", "bnp"],
      guidance: "Evaluates Functional (septal e', E/e'), Morphological (LAVI, LVMI), and Biomarker (NT-proBNP) domains. Score ≥ 5 confirms HFpEF.",
      literature: [{
        type: "ESC Consensus",
        icon: "📘",
        title: "How to diagnose heart failure with preserved ejection fraction: the HFA-PEFF diagnostic algorithm",
        citation: "Pieske B, Tschöpe C, de Boer RA, et al. Eur Heart J. 2019;40(40):3297-3317.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/31504452/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1093/eurheartj/ehz641" }
        ]
      }],
      fields: [
        makeS("func", "Functional Domain (E/e' ≥15, or septal e'<7, or TRV>2.8 m/s)", "0", [
          ["0", "Normal (0 pts)"], ["1", "Minor criterion: E/e' 9–14 (+1 pt)"], ["2", "Major criterion: E/e' ≥15 or septal e'<7 cm/s (+2 pts)"]
        ]),
        makeS("morph", "Morphological Domain (LAVI >34 mL/m² or LVMI >115/95 g/m²)", "0", [
          ["0", "Normal (0 pts)"], ["1", "Minor: LAVI 29–34 mL/m² or LVMI (+1 pt)"], ["2", "Major: LAVI >34 mL/m² or LV wall ≥12 mm (+2 pts)"]
        ]),
        makeS("biomarker", "Biomarker Domain (NT-proBNP >220 pg/mL in sinus, >660 in AF)", "0", [
          ["0", "Normal (0 pts)"], ["1", "Minor: NT-proBNP 125–220 in SR (365–660 in AF) (+1 pt)"], ["2", "Major: NT-proBNP >220 in SR (>660 in AF) (+2 pts)"]
        ])
      ],
      table: {
        headers: ["HFA-PEFF Score", "Diagnostic Status", "Step 3 / 4 Action"],
        rows: [
          { id: "hLow", cols: ["≤ 1 Point", "HFpEF Unlikely", "Investigate alternative non-cardiac causes"] },
          { id: "hMid", cols: ["2 – 4 Points", "Intermediate / Uncertain", "Proceed to Step 3: Diastolic stress echocardiography or invasive RHC"] },
          { id: "hHigh", cols: ["≥ 5 Points", "HFpEF Confirmed", "Proceed to Step 4: Etiologic workup (amyloid, CAD, hypertrophic)"] }
        ]
      },
      calc: function (v) {
        var total = +v.func + +v.morph + +v.biomarker;
        var match = total >= 5 ? "hHigh" : total >= 2 ? "hMid" : "hLow";
        return {
          value: "HFA-PEFF Score: " + total + " / 6 Points",
          matchId: match,
          eq: total >= 5 ? "Definite HFpEF confirmed." : total >= 2 ? "Intermediate score; diastolic exercise testing warranted." : "HFpEF unlikely."
        };
      }
    },
    {
      id: "lvefClassifier",
      cat: "cardio",
      type: "class",
      name: "LVEF Category Classifier (Universal Definition 2021)",
      desc: "Standard classification of heart failure based on left ventricular ejection fraction.",
      organ: "Left Ventricle",
      region: "Heart Failure",
      subject: "Heart Failure Classification",
      keywords: ["lvef", "hfref", "hfmref", "hfpef", "hfimpef"],
      guidance: "HFrEF (≤40%), HFmrEF (41–49%), HFpEF (≥50%), HFimpEF (baseline ≤40% with ≥10 pt increase and >40%).",
      literature: [{
        type: "Consensus",
        icon: "📘",
        title: "Universal definition and classification of heart failure",
        citation: "Bozkurt B, Coats AJS, Tsutsui H, et al. J Card Fail. 2021;27(4):387-413.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/33663991/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1016/j.cardfail.2021.01.022" }
        ]
      }],
      fields: [
        makeN("lvef", "Current LVEF (%)", 45, { min: 10, max: 85 }),
        makeS("improved", "Prior baseline LVEF was ≤40% with ≥10-point improvement?", "0", [["0", "No"], ["1", "Yes"]])
      ],
      table: {
        headers: ["LVEF Category", "Ejection Fraction Range", "Primary Medical Strategy"],
        rows: [
          { id: "hfref", cols: ["HFrEF", "≤ 40%", "Four-pillar GDMT (ARNI, BB, MRA, SGLT2i)"] },
          { id: "hfmref", cols: ["HFmrEF", "41% – 49%", "SGLT2i + consider ARNI/ACEi, BB, MRA"] },
          { id: "hfpef", cols: ["HFpEF", "≥ 50%", "SGLT2i (Empagliflozin/Dapagliflozin) + MRA + decongestion"] },
          { id: "hfimpef", cols: ["HFimpEF", "Baseline ≤40% with >10% gain to >40%", "Continue guideline-directed medical therapy; do not withdraw"] }
        ]
      },
      calc: function (v) {
        var ef = +v.lvef;
        var match = "hfref", name = "HFrEF";
        if (v.improved === "1" && ef > 40) { match = "hfimpef"; name = "Heart Failure with Improved Ejection Fraction (HFimpEF)"; }
        else if (ef <= 40) { match = "hfref"; name = "Heart Failure with Reduced Ejection Fraction (HFrEF)"; }
        else if (ef <= 49) { match = "hfmref"; name = "Heart Failure with Mildly Reduced Ejection Fraction (HFmrEF)"; }
        else { match = "hfpef"; name = "Heart Failure with Preserved Ejection Fraction (HFpEF)"; }
        return { value: name + " (LVEF " + ef + "%)", matchId: match, eq: "Universal Definition of Heart Failure." };
      }
    },
    {
      id: "cardiacOutputEcho",
      cat: "cardio",
      type: "calc",
      name: "Cardiac Output & Index (LVOT Doppler)",
      desc: "Doppler-derived stroke volume, cardiac output, and cardiac index from LVOT.",
      organ: "Left Ventricle / LVOT",
      region: "Echocardiography",
      subject: "Hemodynamics",
      keywords: ["cardiac output", "cardiac index", "stroke volume", "lvot vti"],
      guidance: "1. Formula: Stroke Volume = 0.7854 × LVOT diameter² × LVOT VTI.\n2. Cardiac Output (CO) = (Stroke Volume × Heart Rate) ÷ 1000.\n3. Cardiac Index (CI) = CO ÷ BSA (Normal resting CI: 2.5–4.0 L/min/m²).\n4. Stroke Volume Index (SVi) < 35 mL/m² defines low-flow status in aortic stenosis and heart failure.",
      literature: [{
        type: "ASE Guidelines",
        icon: "📘",
        title: "Recommendations for cardiac chamber quantification by echocardiography in adults",
        citation: "Lang RM, Badano LP, Mor-Avi V, et al. J Am Soc Echocardiogr. 2015;28(1):1-39.e14.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/25559473/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1016/j.echo.2014.10.003" }
        ]
      }],
      fields: [
        makeN("lvot_d", "LVOT Diameter (cm)", 2.0, { min: 1.2, max: 3.2, step: 0.1 }),
        makeN("lvot_vti", "LVOT VTI (cm)", 20, { min: 5, max: 45, step: 0.5 }),
        makeN("hr", "Heart Rate (bpm)", 72, { min: 30, max: 200 }),
        makeN("bsa", "Body Surface Area (BSA, m²)", 1.85, { min: 0.8, max: 3.2, step: 0.05 })
      ],
      table: {
        headers: ["Cardiac Index (CI)", "Hemodynamic Status", "Clinical Implication"],
        rows: [
          { id: "cardiogenic", cols: ["< 2.2 L/min/m²", "Cardiogenic Shock / Low Output", "Inadequate systemic perfusion; inotropic or mechanical support consideration"] },
          { id: "normal", cols: ["2.2 – 4.0 L/min/m²", "Normal Resting Cardiac Index", "Normal resting cardiac perfusion"] },
          { id: "hyper", cols: ["> 4.0 L/min/m²", "Hyperdynamic Output", "Sepsis, liver disease, severe anemia, thyrotoxicosis"] }
        ]
      },
      calc: function (v) {
        var area = 0.7854 * Math.pow(+v.lvot_d, 2);
        var sv = area * +v.lvot_vti;
        var co = (sv * +v.hr) / 1000;
        var ci = co / +v.bsa;
        var match = ci < 2.2 ? "cardiogenic" : ci <= 4.0 ? "normal" : "hyper";
        return {
          value: "CO: " + co.toFixed(2) + " L/min | CI: " + ci.toFixed(2) + " L/min/m² (SV: " + Math.round(sv) + " mL)",
          matchId: match,
          eq: "Normal Cardiac Index: 2.5–4.0 L/min/m². SV = 0.7854 × (" + v.lvot_d + ")² × " + v.lvot_vti + "."
        };
      }
    },

    // ==============================================================
    // 6. ARRHYTHMIA & STROKE RISK
    // ==============================================================
    {
      id: "cha2ds2vasc",
      cat: "cardio",
      type: "class",
      name: "CHA₂DS₂-VASc (AF Stroke Risk)",
      desc: "Guides stroke prevention and oral anticoagulation in non-valvular atrial fibrillation.",
      organ: "Heart / Left Atrial Appendage",
      region: "Electrophysiology / Stroke Prevention",
      subject: "Atrial Fibrillation",
      keywords: ["chads", "cha2ds2-vasc", "atrial fibrillation", "anticoagulation", "doac"],
      guidance: "Score ≥ 2 in males or ≥ 3 in females indicates oral anticoagulation.",
      literature: [{
        type: "ESC Guidelines",
        icon: "📘",
        title: "2020 ESC Guidelines for the diagnosis and management of atrial fibrillation",
        citation: "Hindricks G, Potpara T, Dagres N, et al. Eur Heart J. 2021;42(5):373-498.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/32860505/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1093/eurheartj/ehaa612" }
        ]
      }],
      fields: [
        makeS("chf", "Congestive Heart Failure history", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("htn", "Hypertension history", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("age", "Age Category", "0", [["0", "< 65 years (0)"], ["1", "65–74 years (+1)"], ["2", "≥ 75 years (+2)"]]),
        makeS("dm", "Diabetes Mellitus", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("stroke", "Prior Stroke / TIA / Thromboembolism", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        makeS("vasc", "Vascular disease (prior MI, PAD, aortic plaque)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("sex", "Sex Category", "0", [["0", "Male (0)"], ["1", "Female (+1)"]])
      ],
      table: {
        headers: ["Score", "Recommendation (Male)", "Recommendation (Female)"],
        rows: [
          { id: "r0", cols: ["0 (Male) / 1 (Female)", "Low risk; no anticoagulation", "Low risk; no anticoagulation"] },
          { id: "r1", cols: ["1 (Male) / 2 (Female)", "Intermediate; consider oral anticoagulation", "Intermediate; consider oral anticoagulation"] },
          { id: "r2", cols: ["≥ 2 (Male) / ≥ 3 (Female)", "Oral Anticoagulation (DOAC) Recommended", "Oral Anticoagulation (DOAC) Recommended"] }
        ]
      },
      calc: function (v) {
        var total = +v.chf + +v.htn + +v.age + +v.dm + +v.stroke + +v.vasc + +v.sex;
        var isFem = v.sex === "1";
        var oac = isFem ? (total >= 3) : (total >= 2);
        var match = oac ? "r2" : (isFem ? total === 2 : total === 1) ? "r1" : "r0";
        return {
          value: "CHA₂DS₂-VASc: " + total + " Points",
          matchId: match,
          eq: oac ? "Oral Anticoagulation (DOAC) strongly indicated." : "Low/intermediate stroke risk."
        };
      }
    },
    {
      id: "hasbled",
      cat: "cardio",
      type: "class",
      name: "HAS-BLED Bleeding Risk Score",
      desc: "Assesses 1-year major bleeding risk for patients on oral anticoagulation.",
      organ: "Systemic",
      region: "Anticoagulation Safety",
      subject: "Atrial Fibrillation / Bleeding",
      keywords: ["has-bled", "bleeding risk", "anticoagulation", "warfarin", "doac"],
      guidance: "Score ≥ 3 denotes high bleeding risk; prompts addressing modifiable risk factors and closer follow-up.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "A novel user-friendly score (HAS-BLED) to assess 1-year risk of major bleeding in patients with atrial fibrillation",
        citation: "Pisters R, Lane DA, Nieuwlaat R, et al. Chest. 2010;138(5):1093-1100.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/20299623/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1378/chest.10-0134" }
        ]
      }],
      fields: [
        makeS("h", "Hypertension (uncontrolled SBP >160)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("a_renal", "Abnormal renal function (dialysis, Cr >2.26 mg/dL)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("a_liver", "Abnormal liver function (cirrhosis or Bili/AST >2x)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("s", "Stroke history", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("b", "Prior major bleeding or predisposition", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("l", "Labile INRs (TTR <60% on Warfarin)", "0", [["0", "No / Not on Warfarin"], ["1", "Yes (+1)"]]),
        makeS("e", "Elderly (Age > 65 years)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("d_drugs", "Medication (Aspirin, Clopidogrel, NSAIDs)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("d_alcohol", "Alcohol excess (≥8 drinks/week)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      table: {
        headers: ["HAS-BLED Score", "Bleeding Risk Tier", "Clinical Action"],
        rows: [
          { id: "low", cols: ["0 – 2 Points", "Low / Moderate Risk", "Standard monitoring"] },
          { id: "high", cols: ["≥ 3 Points", "High Bleeding Risk (HBR)", "Address modifiable factors (control BP, stop NSAIDs); frequent follow-up"] }
        ]
      },
      calc: function (v) {
        var total = +v.h + +v.a_renal + +v.a_liver + +v.s + +v.b + +v.l + +v.e + +v.d_drugs + +v.d_alcohol;
        var match = total >= 3 ? "high" : "low";
        return {
          value: "HAS-BLED: " + total + " / 9 Points",
          matchId: match,
          eq: total >= 3 ? "Score ≥ 3: Caution warranted. Not a reason to withhold anticoagulation." : "Low-to-moderate risk."
        };
      }
    },
    {
      id: "orbitBleed",
      cat: "cardio",
      type: "class",
      name: "ORBIT Bleeding Score for AF",
      desc: "Bleeding risk prediction score for atrial fibrillation patients on DOACs or VKAs.",
      organ: "Systemic",
      region: "Anticoagulation",
      subject: "Atrial Fibrillation",
      keywords: ["orbit", "bleeding score", "doac", "atrial fibrillation"],
      guidance: "Older ≥74 (+1), Reduced Hb/anemia (+2), Bleed history (+2), Insufficient GFR<60 (+1), Treatment with antiplatelet (+1).",
      literature: [{
        type: "Validation Study",
        icon: "📄",
        title: "The ORBIT bleeding score: a novel bleeding risk score in atrial fibrillation",
        citation: "O'Brien EC, Holmes DN, Ansell JE, et al. Eur Heart J. 2015;36(46):3258-3264.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/26424865/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1093/eurheartj/ehv476" }
        ]
      }],
      fields: [
        makeS("older", "Older (Age ≥ 74 years)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("anemia", "Reduced Hb/Hct or anemia history", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        makeS("bleed", "Prior major bleeding history", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        makeS("egfr", "Insufficient kidney function (eGFR < 60)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("antiplatelet", "Antiplatelet therapy (Aspirin/P2Y12)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      table: {
        headers: ["ORBIT Score", "Bleed Rate / 100 pt-years", "Risk Stratum"],
        rows: [
          { id: "oLow", cols: ["0 – 2 Points", "2.4 bleeds", "Low Risk"] },
          { id: "oMid", cols: ["3 Points", "4.7 bleeds", "Medium Risk"] },
          { id: "oHigh", cols: ["4 – 7 Points", "8.1 bleeds", "High Risk"] }
        ]
      },
      calc: function (v) {
        var total = +v.older + +v.anemia + +v.bleed + +v.egfr + +v.antiplatelet;
        var match = total >= 4 ? "oHigh" : total === 3 ? "oMid" : "oLow";
        return { value: "ORBIT Score: " + total + " / 7 Points", matchId: match, eq: "Validated for modern DOAC cohorts." };
      }
    },
    {
      id: "atriaStroke",
      cat: "cardio",
      type: "class",
      name: "ATRIA Stroke Risk Score",
      desc: "Ischemic stroke risk prediction in AF incorporating age, prior stroke, and renal/proteinuric status.",
      organ: "Brain / Heart",
      region: "Stroke Prevention",
      subject: "Atrial Fibrillation",
      keywords: ["atria", "stroke risk", "atrial fibrillation"],
      guidance: "0–5 low risk, 6 moderate, 7–15 high risk.",
      literature: [{
        type: "Validation Study",
        icon: "📄",
        title: "The ATRIA stroke risk score: a new tool for predicting stroke in atrial fibrillation",
        citation: "Singer DE, Chang Y, Borowsky LH, et al. J Am Coll Cardiol. 2013;61(19):1982-1988.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/23500308/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1016/j.jacc.2013.02.018" }
        ]
      }],
      fields: [
        makeS("age_stroke", "Age and Prior Stroke Interaction", "0", [
          ["0", "<65 without prior stroke (0)"], ["1", "65–74 without prior stroke (+1)"],
          ["2", "75–84 without prior stroke (+2)"], ["3", "≥85 without prior stroke (+3)"],
          ["6", "<65 WITH prior stroke (+6)"], ["7", "65–74 WITH prior stroke (+7)"],
          ["8", "75–84 WITH prior stroke (+8)"], ["9", "≥85 WITH prior stroke (+9)"]
        ]),
        makeS("female", "Female sex", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("dm", "Diabetes mellitus", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("chf", "Congestive heart failure", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("htn", "Hypertension", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("renal", "Proteinuria or eGFR < 45 mL/min", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      table: {
        headers: ["ATRIA Score", "Yearly Stroke Rate"],
        rows: [
          { id: "aLow", cols: ["0 – 5 Points", "< 1% / year (Low Risk)"] },
          { id: "aMid", cols: ["6 Points", "1% – 2% / year (Moderate Risk)"] },
          { id: "aHigh", cols: ["7 – 15 Points", "≥ 2% / year (High Risk)"] }
        ]
      },
      calc: function (v) {
        var total = +v.age_stroke + +v.female + +v.dm + +v.chf + +v.htn + +v.renal;
        var match = total >= 7 ? "aHigh" : total === 6 ? "aMid" : "aLow";
        return { value: "ATRIA Score: " + total + " / 15 Points", matchId: match, eq: "Stroke risk prediction model." };
      }
    },
    {
      id: "ehraScore",
      cat: "cardio",
      type: "class",
      name: "EHRA Symptom Classification (Atrial Fibrillation)",
      desc: "European Heart Rhythm Association classification of AF-related symptom impairment.",
      organ: "Heart",
      region: "Arrhythmia Clinic",
      subject: "Atrial Fibrillation Symptoms",
      keywords: ["ehra", "afib symptoms", "palpitations"],
      guidance: "Class I (none), IIa (mild), IIb (moderate), III (severe), IV (disabling).",
      fields: [
        makeS("class", "EHRA Symptom Class", "1", [
          ["1", "EHRA I — No symptoms"],
          ["2a", "EHRA IIa — Mild symptoms; normal daily activity not affected"],
          ["2b", "EHRA IIb — Moderate symptoms; normal daily activity not affected, but patient troubled"],
          ["3", "EHRA III — Severe symptoms; normal daily activity affected"],
          ["4", "EHRA IV — Disabling symptoms; normal daily activity discontinued"]
        ])
      ],
      table: {
        headers: ["Class", "Symptom Burden"],
        rows: [
          { id: "e1", cols: ["EHRA I", "Asymptomatic"] },
          { id: "e2a", cols: ["EHRA IIa", "Mild; activity completely unaffected"] },
          { id: "e2b", cols: ["EHRA IIb", "Moderate; patient troubled but activity intact"] },
          { id: "e3", cols: ["EHRA III", "Severe; normal daily activity impaired"] },
          { id: "e4", cols: ["EHRA IV", "Disabling; patient incapacitated during arrhythmia"] }
        ]
      },
      calc: function (v) {
        return { value: "EHRA Class " + v.class.toUpperCase(), matchId: "e" + v.class, eq: "Used to assess rhythm control response." };
      }
    },
    {
      id: "qtcCalc",
      cat: "cardio",
      type: "calc",
      name: "QTc Calculator (Fridericia & Bazett)",
      desc: "Calculates heart-rate corrected QT interval. Fridericia is preferred across heart rate extremes.",
      organ: "Cardiac Conduction System",
      region: "ECG",
      subject: "Electrophysiology / Drug Safety",
      keywords: ["qtc", "fridericia", "bazett", "long qt", "torsades", "ecg"],
      guidance: "1. Measure QT interval in lead II or V5 from beginning of QRS to end of T wave.\n2. Fridericia = QT ÷ ∛RR (in seconds).\n3. Bazett = QT ÷ √RR (in seconds).\n4. Bazett overcorrects at heart rates > 80 bpm; Fridericia is the standard for regulatory and drug safety evaluations.\n5. QTc > 500 ms (or increase > 60 ms from baseline) marks a significant risk for Torsades de Pointes.",
      contraindications: "In wide QRS (> 120 ms from LBBB or pacing), adjust by subtracting the excess QRS duration: Corrected JT = QTc − (QRS − 100 ms).",
      literature: [{
        type: "AHA/ACCF Statement",
        icon: "📘",
        title: "AHA/ACCF/HRS Recommendations for the Standardization and Interpretation of the Electrocardiogram",
        citation: "Rautaharju PM, Surawicz B, Gettes LS. J Am Coll Cardiol. 2009;53(11):982-991.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/19281932/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1016/j.jacc.2008.12.014" }
        ]
      }],
      fields: [
        makeN("qt", "Measured QT Interval (ms)", 410, { min: 200, max: 800 }),
        makeN("hr", "Heart Rate (bpm)", 72, { min: 30, max: 240 })
      ],
      table: {
        headers: ["QTc Range (Fridericia)", "Classification", "Torsadogenic Risk"],
        rows: [
          { id: "normal", cols: ["< 450 ms (Men) / < 460 ms (Women)", "Normal QTc", "Baseline arrhythmia risk"] },
          { id: "border", cols: ["450–480 ms (Men) / 460–480 ms (Women)", "Borderline Prolonged", "Low risk; avoid combining QT-prolonging drugs"] },
          { id: "prolonged", cols: ["480 – 500 ms", "Prolonged QTc", "Moderate risk; correct electrolytes (K > 4.0, Mg > 2.0)"] },
          { id: "danger", cols: ["> 500 ms", "Severely Prolonged QTc", "HIGH TORSADOGENIC RISK: Discontinue offending drugs immediately"] }
        ]
      },
      calc: function (v) {
        var rr = 60 / +v.hr;
        var qtSec = +v.qt / 1000;
        var qtcB = Math.round((qtSec / Math.sqrt(rr)) * 1000);
        var qtcF = Math.round((qtSec / Math.cbrt(rr)) * 1000);
        var match = qtcF > 500 ? "danger" : qtcF > 480 ? "prolonged" : qtcF > 450 ? "border" : "normal";
        var note = qtcF > 500 ? "Significantly prolonged (>500 ms; high TdP risk)" : qtcF > 460 ? "Prolonged QTc" : "Normal QTc";
        return {
          value: "Fridericia QTc: " + qtcF + " ms | Bazett QTc: " + qtcB + " ms (" + note + ")",
          matchId: match,
          eq: "Formula: Fridericia = QT / ∛RR. Bazett = QT / √RR. RR interval = " + rr.toFixed(3) + " s."
        };
      }
    },
    {
      id: "qtNomogram",
      cat: "cardio",
      type: "class",
      name: "QT Nomogram (Torsades de Pointes Risk)",
      desc: "Evaluates uncorrected QT against heart rate to detect dangerous arrhythmogenic thresholds in drug overdose.",
      organ: "Myocardium",
      region: "Toxicology / Resuscitation",
      subject: "Electrophysiology / Toxicology",
      keywords: ["qt nomogram", "torsades", "overdose", "toxicology"],
      guidance: "1. Measure uncorrected QT interval.\n2. Plot directly against heart rate.\n3. Pairs plotting above the nomogram line carry significant risk for drug-induced Torsades de Pointes.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "The QT nomogram: an improved method for detecting drug-induced prolongation of the QT interval",
        citation: "Chan A, Isbister GK, Kirkpatrick CM, Duffull SB. Clin Toxicol (Phila). 2007;45(7):712-718.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/17952748/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1080/15563650701583277" }
        ]
      }],
      fields: [
        makeN("hr", "Heart Rate (bpm)", 75, { min: 30, max: 180 }),
        makeN("qt", "Measured Uncorrected QT (ms)", 440, { min: 200, max: 700 })
      ],
      table: {
        headers: ["Nomogram Position", "Torsadogenic Risk", "Action"],
        rows: [
          { id: "safe", cols: ["Below Nomogram Line", "Low Torsadogenic Risk", "Routine monitoring"] },
          { id: "danger", cols: ["Above Nomogram Line", "HIGH RISK for Torsades de Pointes", "Continuous telemetry, stop QT-prolonging drugs, IV Magnesium"] }
        ]
      },
      calc: function (v) {
        var thresh = 480 - (+v.hr - 60) * 1.8;
        var above = +v.qt > thresh;
        var match = above ? "danger" : "safe";
        return {
          value: above ? "ABOVE the Nomogram Line (High TdP Risk)" : "Below the Nomogram Line",
          matchId: match,
          eq: "Nomogram cut-off threshold at " + v.hr + " bpm: " + Math.round(thresh) + " ms."
        };
      }
    },
    {
      id: "rrIntervalCalc",
      cat: "cardio",
      type: "calc",
      name: "ECG Interval & Heart Rate Interconverter",
      desc: "Interconverts ventricular heart rate, RR interval duration, and conduction intervals.",
      organ: "Conduction System",
      region: "ECG Analysis",
      subject: "Electrophysiology",
      keywords: ["rr interval", "qrs", "pr interval", "heart rate conversion"],
      guidance: "1. RR interval (ms) = 60,000 ÷ Heart Rate (bpm).\n2. Standard conduction reference limits: PR interval 120–200 ms; QRS duration < 120 ms.",
      fields: [
        makeN("hr", "Ventricular Heart Rate (bpm)", 75, { min: 20, max: 250 }),
        makeN("qrs", "QRS Duration (ms)", 90, { min: 40, max: 280 }),
        makeN("pr", "PR Interval (ms)", 160, { min: 60, max: 400 })
      ],
      table: {
        headers: ["Metric", "Normal Reference", "Clinical Pathology"],
        rows: [
          { id: "qrsRow", cols: ["QRS Duration", "< 120 ms", "≥ 120 ms indicates bundle branch block, ventricular pacing, or VT"] },
          { id: "prRow", cols: ["PR Interval", "120 – 200 ms", "> 200 ms indicates 1st-degree AV block; < 120 ms indicates pre-excitation (WPW)"] }
        ]
      },
      calc: function (v) {
        var rr = Math.round(60000 / +v.hr);
        var qrsDesc = +v.qrs >= 120 ? "Wide QRS (≥120 ms; BBB/conduction delay)" : "Normal QRS (<120 ms)";
        var prDesc = +v.pr > 200 ? "First-degree AV block (>200 ms)" : +v.pr < 120 ? "Short PR (<120 ms)" : "Normal PR";
        return {
          value: "RR: " + rr + " ms (" + qrsDesc + "; " + prDesc + ")",
          matchId: "qrsRow",
          eq: "Formula: RR (ms) = 60,000 / HR (" + v.hr + " bpm)."
        };
      }
    },

    // ==============================================================
    // 7. ACUTE CORONARY SYNDROME (ACS)
    // ==============================================================
    {
      id: "heartScore",
      cat: "cardio",
      type: "class",
      name: "HEART Score for Chest Pain Triage",
      desc: "Emergency department clinical pathway predicting 6-week Major Adverse Cardiac Events (MACE).",
      organ: "Coronary Arteries",
      region: "Emergency Medicine",
      subject: "Chest Pain / ACS",
      keywords: ["heart score", "chest pain", "mace", "troponin", "emergency"],
      guidance: "Score 0–3: Low risk (candidate for safe early discharge). Score 4–6: Moderate risk. Score 7–10: High risk.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "A collateral validation of the HEART score for chest pain patients at the emergency department",
        citation: "Backus BE, Six AJ, Kelder JC, et al. Int J Cardiol. 2013;168(3):2153-2158.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/23465250/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1016/j.ijcard.2013.01.255" }
        ]
      }],
      fields: [
        makeS("h", "History", "0", [["0", "Slightly suspicious (0)"], ["1", "Moderately suspicious (+1)"], ["2", "Highly suspicious (+2)"]]),
        makeS("e", "ECG", "0", [["0", "Normal (0)"], ["1", "Non-specific repolarization disturbance (+1)"], ["2", "Significant ST deviation (+2)"]]),
        makeS("a", "Age", "0", [["0", "< 45 years (0)"], ["1", "45–64 years (+1)"], ["2", "≥ 65 years (+2)"]]),
        makeS("r", "Risk factors (HTN, DM, smoking, lipids, FHx, obesity)", "0", [["0", "No risk factors (0)"], ["1", "1–2 risk factors (+1)"], ["2", "≥3 risk factors or known atherosclerotic disease (+2)"]]),
        makeS("t", "Troponin", "0", [["0", "≤ Normal limit (0)"], ["1", "1–2x normal limit (+1)"], ["2", "> 2x normal limit (+2)"]])
      ],
      table: {
        headers: ["HEART Score", "6-Week MACE Risk", "Clinical Disposition"],
        rows: [
          { id: "low", cols: ["0 – 3 Points", "0.9% – 1.7%", "Low risk; candidate for early discharge / outpatient stress test"] },
          { id: "mod", cols: ["4 – 6 Points", "12% – 16.6%", "Moderate risk; hospital observation, serial troponins, inpatient testing"] },
          { id: "high", cols: ["7 – 10 Points", "50% – 65%", "High risk; invasive coronary angiography / intensive care"] }
        ]
      },
      calc: function (v) {
        var total = +v.h + +v.e + +v.a + +v.r + +v.t;
        var match = total >= 7 ? "high" : total >= 4 ? "mod" : "low";
        return {
          value: "HEART Score: " + total + " / 10 Points",
          matchId: match,
          eq: total <= 3 ? "Low risk for 6-week MACE (~1.7%). Early discharge candidate." : total >= 7 ? "High risk (>50% MACE). Urgent invasive strategy." : "Moderate risk. Admit for observation."
        };
      }
    },
    {
      id: "timiUaNstemi",
      cat: "cardio",
      type: "class",
      name: "TIMI Risk Score for UA/NSTEMI",
      desc: "Predicts 14-day all-cause mortality, recurrent MI, and severe ischemia requiring revascularization.",
      organ: "Coronary Arteries",
      region: "Acute Care",
      subject: "NSTE-ACS",
      keywords: ["timi", "nstemi", "unstable angina", "acs", "ischemia"],
      guidance: "Evaluates 7 bedside clinical variables (1 point each).",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "The TIMI risk score for unstable angina/non-ST elevation MI",
        citation: "Antman EM, Cohen M, Bernink PJ, et al. JAMA. 2000;284(7):835-842.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/10938172/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1001/jama.284.7.835" }
        ]
      }],
      fields: [
        makeS("age", "Age ≥ 65 years", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("cad_rf", "≥3 CAD Risk Factors (FHx, HTN, lipids, DM, smoker)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("known_cad", "Known CAD (stenosis ≥ 50%)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("asa", "Aspirin use in preceding 7 days", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("angina", "Severe angina (≥2 episodes in last 24h)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("st_dev", "ST deviation ≥ 0.5 mm on ECG", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("markers", "Elevated cardiac biomarkers", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      table: {
        headers: ["TIMI Points", "14-Day Adverse Event Risk", "Pathway"],
        rows: [
          { id: "tLow", cols: ["0 – 2 Points", "4.7% – 8.3%", "Low risk; conservative or selective invasive strategy"] },
          { id: "tMid", cols: ["3 – 4 Points", "13.2% – 19.9%", "Intermediate risk; early invasive angiography (<24h)"] },
          { id: "tHigh", cols: ["5 – 7 Points", "26.2% – 40.9%", "High risk; urgent invasive coronary angiography"] }
        ]
      },
      calc: function (v) {
        var total = +v.age + +v.cad_rf + +v.known_cad + +v.asa + +v.angina + +v.st_dev + +v.markers;
        var match = total >= 5 ? "tHigh" : total >= 3 ? "tMid" : "tLow";
        return {
          value: "TIMI Score: " + total + " / 7 Points",
          matchId: match,
          eq: total >= 3 ? "Intermediate to high risk. Early invasive angiography recommended." : "Low risk."
        };
      }
    },
    {
      id: "grace2Score",
      cat: "cardio",
      type: "class",
      name: "GRACE 2.0 In-Hospital Mortality Score (ACS)",
      desc: "Comprehensive risk model predicting in-hospital and 6-month mortality across the entire ACS spectrum.",
      organ: "Myocardium",
      region: "Acute Care",
      subject: "Acute Coronary Syndromes",
      keywords: ["grace", "grace 2.0", "acs", "stemi", "nstemi", "mortality"],
      guidance: "Score > 140 indicates high risk (>3% in-hospital mortality); guides early invasive angiography within 24 hours.",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "Predictors of hospital mortality in the global registry of acute coronary events",
        citation: "Granger CB, Goldberg RJ, Dabbous O, et al. Arch Intern Med. 2003;163(19):2345-2353.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/14581255/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1001/archinte.163.19.2345" }
        ]
      }],
      fields: [
        makeN("age", "Age (years)", 65, { min: 18, max: 105 }),
        makeN("hr", "Heart Rate (bpm)", 82, { min: 30, max: 220 }),
        makeN("sbp", "Systolic BP (mmHg)", 125, { min: 50, max: 260 }),
        makeN("creat", "Serum Creatinine (mg/dL)", 1.1, { min: 0.3, max: 10.0, step: 0.1 }),
        makeS("arrest", "Cardiac arrest at presentation?", "0", [["0", "No (0)"], ["39", "Yes (+39)"]]),
        makeS("st_dev", "ST-segment deviation?", "0", [["0", "No (0)"], ["28", "Yes (+28)"]]),
        makeS("enzymes", "Elevated cardiac biomarkers?", "0", [["0", "No (0)"], ["14", "Yes (+14)"]]),
        makeS("killip", "Killip Class", "1", [["1", "Class I (0)"], ["2", "Class II (+20)"], ["3", "Class III (+39)"], ["4", "Class IV (+59)"]])
      ],
      table: {
        headers: ["GRACE Score", "Risk Tier", "In-Hospital Mortality", "Angiography Timing"],
        rows: [
          { id: "gLow", cols: ["≤ 108 Points", "Low Risk", "< 1%", "Selective invasive / non-invasive workup"] },
          { id: "gMid", cols: ["109 – 140 Points", "Intermediate Risk", "1% – 3%", "Invasive angiography within 24–72 hours"] },
          { id: "gHigh", cols: ["> 140 Points", "High Risk", "> 3%", "Urgent invasive coronary angiography (<24 hours)"] }
        ]
      },
      calc: function (v) {
        var pts = +v.arrest + +v.st_dev + +v.enzymes + +v.killip;
        var a = +v.age, hr = +v.hr, sbp = +v.sbp, cr = +v.creat;
        if (a >= 80) pts += 90; else if (a >= 70) pts += 75; else if (a >= 60) pts += 58; else if (a >= 50) pts += 41; else if (a >= 40) pts += 25;
        if (hr >= 110) pts += 25; else if (hr >= 90) pts += 15; else if (hr >= 70) pts += 7;
        if (sbp < 100) pts += 53; else if (sbp < 120) pts += 43; else if (sbp < 140) pts += 34; else if (sbp < 160) pts += 24; else if (sbp < 200) pts += 10;
        if (cr >= 2.0) pts += 28; else if (cr >= 1.4) pts += 15; else if (cr >= 1.0) pts += 7;
        var match = pts > 140 ? "gHigh" : pts >= 109 ? "gMid" : "gLow";
        return {
          value: "GRACE 2.0: " + pts + " Points",
          matchId: match,
          eq: pts > 140 ? "High risk (>3% mortality). Early invasive angiography within 24 hours indicated." : "Low-to-intermediate risk."
        };
      }
    },
    {
      id: "edacsScore",
      cat: "cardio",
      type: "class",
      name: "EDACS (Emergency Department Chest Pain Triage)",
      desc: "Emergency Department Assessment of Chest Pain Score for accelerated discharge pathways.",
      organ: "Coronary Arteries",
      region: "Emergency Medicine",
      subject: "Chest Pain / Triage",
      keywords: ["edacs", "chest pain", "troponin", "accelerated diagnostic protocol"],
      guidance: "Score < 16 with normal ECG and 0h/2h negative troponins identifies low-risk patients suitable for early discharge.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "Emergency Department Assessment of Chest pain Score (EDACS) to identify patients suitable for safe early discharge",
        citation: "Than M, Flaws D, Sanders S, et al. J Am Coll Cardiol. 2014;64(7):637-645.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/25125292/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1016/j.jacc.2014.04.052" }
        ]
      }],
      fields: [
        makeN("age", "Age (years)", 52, { min: 18, max: 100 }),
        makeS("male", "Sex", "1", [["1", "Male (+6)"], ["0", "Female (0)"]]),
        makeS("cad_age", "Known CAD or ≥3 risk factors (male ≥45 or female ≥55)", "0", [["0", "No (0)"], ["1", "Yes (+4)"]]),
        makeS("pain_shoulder", "Pain radiates to arm or shoulder", "0", [["0", "No (0)"], ["1", "Yes (+2)"]]),
        makeS("sweat", "Diaphoresis / cold sweats", "0", [["0", "No (0)"], ["1", "Yes (+2)"]]),
        makeS("pain_pressure", "Pain resembles prior MI or pressure-like", "0", [["0", "No (0)"], ["1", "Yes (+2)"]]),
        makeS("pain_tender", "Chest wall pain reproduced by palpation", "0", [["0", "No (0)"], ["1", "Yes (−4)"]])
      ],
      table: {
        headers: ["EDACS Score", "Accelerated Pathway Qualification"],
        rows: [
          { id: "low", cols: ["< 16 Points", "Low-Risk Candidate (safe early discharge if ECG and 0h/2h troponins negative)"] },
          { id: "high", cols: ["≥ 16 Points", "Not Low-Risk (standard inpatient evaluation and testing indicated)"] }
        ]
      },
      calc: function (v) {
        var pts = (+v.male * 6) + (+v.cad_age * 4) + (+v.pain_shoulder * 2) + (+v.sweat * 2) + (+v.pain_pressure * 2) + (+v.pain_tender ? -4 : 0);
        var a = +v.age;
        if (a >= 55) pts += 8; else if (a >= 50) pts += 6; else if (a >= 45) pts += 4; else if (a >= 40) pts += 2;
        var match = pts < 16 ? "low" : "high";
        return {
          value: "EDACS: " + pts + " Points",
          matchId: match,
          eq: pts < 16 ? "Low-risk candidate for safe early discharge if 0h/2h biomarkers negative." : "Score ≥ 16: Not low risk."
        };
      }
    },
    {
      id: "killipClass",
      cat: "cardio",
      type: "class",
      name: "Killip–Kimball Classification in Acute MI",
      desc: "Bedside clinical assessment of heart failure severity and cardiogenic shock complicating acute MI.",
      organ: "Myocardium / Lungs",
      region: "Coronary Care Unit / Emergency",
      subject: "Acute Myocardial Infarction",
      keywords: ["killip", "ami", "cardiogenic shock", "pulmonary edema", "stemi"],
      guidance: "Class I (no rales/S3) to Class IV (cardiogenic shock).",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "Treatment of myocardial infarction in a coronary care unit. A two year experience with 250 patients",
        citation: "Killip T 3rd, Kimball JT. Am J Cardiol. 1967;20(4):457-464.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/6059183/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1016/0002-9149(67)90023-9" }
        ]
      }],
      fields: [
        makeS("class", "Clinical Physical Exam Findings", "1", [
          ["1", "Killip I — No clinical signs of heart failure (no rales or S3)"],
          ["2", "Killip II — Mild-to-moderate HF (rales <50% of lung fields, S3 gallop, JVD)"],
          ["3", "Killip III — Severe HF / Frank pulmonary edema (rales >50% of lung fields)"],
          ["4", "Killip IV — Cardiogenic shock (SBP <90 mmHg with signs of peripheral hypoperfusion)"]
        ])
      ],
      table: {
        headers: ["Killip Class", "Physical Findings", "In-Hospital Mortality"],
        rows: [
          { id: "k1", cols: ["Class I", "No rales or S3", "~ 6%"] },
          { id: "k2", cols: ["Class II", "Basal rales, S3 gallop, elevated JVP", "~ 17%"] },
          { id: "k3", cols: ["Class III", "Acute pulmonary edema (rales >50% lung fields)", "~ 38%"] },
          { id: "k4", cols: ["Class IV", "Cardiogenic shock (hypoperfusion, oliguria)", "~ 81%"] }
        ]
      },
      calc: function (v) {
        return {
          value: "Killip Class " + v.class,
          matchId: "k" + v.class,
          eq: "Bedside prognostic stratification in acute myocardial infarction."
        };
      }
    },
    {
      id: "sgarbossaCriteria",
      cat: "cardio",
      type: "class",
      name: "Sgarbossa / Modified Sgarbossa Criteria (MI in LBBB)",
      desc: "Identifies acute occlusive myocardial infarction in the presence of LBBB or ventricular paced rhythm.",
      organ: "Myocardium / ECG",
      region: "Acute Care / Cath Lab",
      subject: "STEMI / LBBB",
      keywords: ["sgarbossa", "lbbb", "stemi", "smith modified", "occlusive mi"],
      guidance: "Concordant STE ≥1 mm (5 pts), Concordant STD V1–V3 ≥1 mm (3 pts), Modified discordant STE/S-wave ratio ≤ −0.25 (highly sensitive).",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "Electrocardiographic diagnosis of evolving acute myocardial infarction in the presence of left bundle-branch block",
        citation: "Sgarbossa EB, Pinski SL, Barbagelata A, et al. N Engl J Med. 1996;334(8):481-487.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/8559200/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1056/NEJM199602223340801" }
        ]
      }, {
        type: "Smith Modified Rule",
        icon: "📄",
        title: "Diagnosis of ST-elevation myocardial infarction in the presence of left bundle branch block with the ST-elevation to S-wave ratio in a modified Sgarbossa rule",
        citation: "Smith SW, Dodd KW, Henry TD, et al. Ann Emerg Med. 2012;60(6):766-776.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/22939607/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1016/j.annemergmed.2012.07.119" }
        ]
      }],
      fields: [
        makeS("concord_ste", "Concordant ST elevation ≥ 1 mm in leads with positive QRS", "0", [["0", "No (0)"], ["1", "Yes (+5 Sgarbossa points)"]]),
        makeS("concord_std", "Concordant ST depression ≥ 1 mm in leads V1, V2, or V3", "0", [["0", "No (0)"], ["1", "Yes (+3 Sgarbossa points)"]]),
        makeS("mod_ratio", "Modified Sgarbossa: ST elevation / S-wave amplitude ratio ≤ −0.25 (excessive discordant STE)", "0", [["0", "No"], ["1", "Yes (Modified criterion met)"]]),
        makeS("discord_ste", "Original Sgarbossa: Discordant ST elevation ≥ 5 mm", "0", [["0", "No (0)"], ["1", "Yes (+2 Sgarbossa points)"]])
      ],
      table: {
        headers: ["Criteria Evaluation", "Occlusive MI Probability", "Cath Lab Activation"],
        rows: [
          { id: "omiPos", cols: ["Positive Criteria", "> 90% Specific for Occlusive MI", "ACTIVATE CATH LAB STAT FOR PRIMARY PCI"] },
          { id: "omiNeg", cols: ["Criteria Not Met", "Cannot completely exclude ischemia", "Obtain serial ECGs and emergency echocardiogram"] }
        ]
      },
      calc: function (v) {
        var pts = (+v.concord_ste ? 5 : 0) + (+v.concord_std ? 3 : 0) + (+v.discord_ste ? 2 : 0);
        var mod = +v.concord_ste === 1 || +v.concord_std === 1 || +v.mod_ratio === 1;
        var pos = pts >= 3 || mod;
        var match = pos ? "omiPos" : "omiNeg";
        return {
          value: pos ? "POSITIVE for Occlusive MI in LBBB" : "Criteria Not Satisfied",
          matchId: match,
          eq: pos ? "High specificity for acute coronary occlusion. Activate cardiac catheterization team." : "Negative Sgarbossa criteria."
        };
      }
    },
    {
      id: "dukeTreadmill",
      cat: "cardio",
      type: "class",
      name: "Duke Treadmill Score (DTS)",
      desc: "Prognostic risk and survival score during exercise treadmill stress testing.",
      organ: "Coronary Arteries / Myocardium",
      region: "Stress Lab",
      subject: "Stress Testing / CAD",
      keywords: ["duke treadmill", "dts", "stress test", "bruce protocol", "angina index"],
      guidance: "1. Formula: DTS = Exercise time (minutes) − (5 × ST deviation [mm]) − (4 × Angina Index).\n2. Angina index: 0 = none, 1 = non-limiting, 2 = exercise-limiting angina (test stopped due to chest pain).\n3. Bruce protocol exercise duration is evaluated in minutes.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "Prognostic value of a treadmill exercise score in outpatients with suspected coronary artery disease",
        citation: "Mark DB, Shaw L, Harrell FE Jr, et al. N Engl J Med. 1991;325(12):849-853.",
        links: [
          { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/1875969/" },
          { text: "View DOI ↗", url: "https://doi.org/10.1056/NEJM199109193251204" }
        ]
      }],
      fields: [
        makeN("time", "Bruce Protocol Exercise Time (minutes)", 9.0, { min: 1.0, max: 25.0, step: 0.5 }),
        makeN("st", "Max Net ST-Segment Deviation (mm)", 1.0, { min: 0.0, max: 6.0, step: 0.5 }),
        makeS("angina", "Treadmill Angina Index", "0", [
          ["0", "0 — No angina during exercise"],
          ["1", "1 — Non-limiting angina during exercise"],
          ["2", "2 — Exercise-limiting angina (test stopped due to chest pain)"]
        ])
      ],
      table: {
        headers: ["Duke Treadmill Score", "Risk Category", "5-Year Survival", "Next Step"],
        rows: [
          { id: "low", cols: ["Score ≥ +5", "Low Risk", "~ 97%", "Medical therapy; invasive angiography generally not indicated"] },
          { id: "mod", cols: ["Score −10 to +4", "Moderate Risk", "~ 90%", "Further imaging or coronary angiography based on clinical factors"] },
          { id: "high", cols: ["Score ≤ −11", "High Risk", "~ 65%", "Refer for invasive coronary angiography"] }
        ]
      },
      calc: function (v) {
        var dts = +v.time - (5 * +v.st) - (4 * +v.angina);
        var match = dts >= 5 ? "low" : dts >= -10 ? "mod" : "high";
        return {
          value: "DTS: " + dts.toFixed(1) + " Points",
          matchId: match,
          eq: dts >= 5 ? "Low risk (5-year survival ~97%)." : dts <= -11 ? "High risk (5-year survival ~65%). Coronary angiography recommended." : "Moderate risk."
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

    // 1. Safely register category
    var catExists = false;
    for (var i = 0; i < window.categories.length; i++) {
      if (window.categories[i] && window.categories[i].id === cardioCategory.id) {
        catExists = true;
        break;
      }
    }
    if (!catExists) {
      window.categories.push(cardioCategory);
    }

    // 2. Safely register tools
    cardioTools.forEach(function (tool) {
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

    // 3. Extend search synonym index
    if (typeof window.SYNONYM_MAP === "object" && window.SYNONYM_MAP !== null) {
      window.SYNONYM_MAP["cardio"] = ["cardio", "cardiology", "heart", "hemodynamics", "valvular", "stemi", "nstemi", "arrhythmia", "hf"];
      window.SYNONYM_MAP["hemodynamics"] = ["pvr", "tpg", "dpg", "rhc", "wedge", "pawp", "mpap", "ph", "rvsp", "tapse"];
      window.SYNONYM_MAP["prevention"] = ["ascvd", "prevent", "aha prevent", "bp", "map", "cac", "agatston", "cholesterol", "ldl"];
      window.SYNONYM_MAP["heart failure"] = ["nyha", "acc/aha", "maggic", "seattle", "adhere", "h2fpef", "hfa-peff", "lvef", "hfref", "hfpef"];
      window.SYNONYM_MAP["acs"] = ["heart score", "timi", "grace", "edacs", "killip", "sgarbossa", "troponin", "stemi"];
      window.SYNONYM_MAP["valvular"] = ["as", "aortic stenosis", "ava", "continuity", "mva", "pisa", "eroa", "ppm", "regurgitant"];
      window.SYNONYM_MAP["pci"] = ["syntax", "mehran", "precise-dapt", "dapt", "arc-hbr", "crusade", "bleeding"];
      window.SYNONYM_MAP["arrhythmia"] = ["cha2ds2vasc", "hasbled", "orbit", "atria", "ehra", "qtc", "fridericia", "bazett"];
    }

    // Force repaint if shell initialized
    if (typeof window.renderHome === "function") {
      window.renderHome();
    }
  } catch (err) {
    console.error("Critical error registering Cardiology tools:", err);
  }
})();
