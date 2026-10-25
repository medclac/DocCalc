/**
 * MedCalc Module: Obstetrics & Gynaecology (OB-GYN)
 * Fully wrapped with diagnostic error handling.
 */
(function () {
  "use strict";

  try {
    // 1. Check or fallback constructors
    var makeN = window.N || function (id, label, defaultVal, extra) {
      extra = extra || {};
      return Object.assign({ id: id, label: label, type: "number", value: defaultVal, default: defaultVal }, extra);
    };
    var makeS = window.S || function (id, label, defaultVal, options) {
      options = options || [];
      return { id: id, label: label, type: "select", value: defaultVal, default: defaultVal, options: options };
    };

    var obgynCategory = {
      id: "obgyn",
      name: "Obstetrics & Gynaecology",
      icon: "🤰",
      desc: "Obstetric dating, fetal growth, preeclampsia, labour scores, oncologic staging, and gynaecologic calculators",
      organs: ["uterus", "cervix", "ovary", "placenta", "fetus", "pelvis", "fallopian tube"],
      region: "pelvis / reproductive / obstetric"
    };

    var obgynTools = [
      // 1. BISHOP SCORE
      {
        id: "bishopScore",
        cat: "obgyn",
        type: "class",
        name: "Bishop Score for Cervical Ripening",
        desc: "Standard assessment of pre-induction cervical readiness to predict successful vaginal delivery.",
        organ: "Cervix / Uterus",
        region: "Obstetric Pelvis",
        subject: "Obstetrics / Labour & Delivery",
        keywords: ["bishop", "cervix", "induction", "ripening", "labour", "delivery", "effacement", "station", "fetal station", "dilation", "oxytocin"],
        guidance: "1. Perform digital pelvic examination.\n2. Score cervical dilatation, effacement, station, consistency, and position (0–3 points each, max 13).\n3. Score ≥8 indicates a favourable cervix ready for amniotomy or oxytocin; ≤6 suggests cervical ripening required.",
        contraindications: "Contraindicated in unexplained antepartum vaginal bleeding, active placenta praevia, cord presentation, or prior classical uterine incision.",
        fields: [
          makeS("dil", "1. Cervical Dilatation", "0", [["0", "Closed (0 pts)"], ["1", "1–2 cm (1 pt)"], ["2", "3–4 cm (2 pts)"], ["3", "≥ 5 cm (3 pts)"]]),
          makeS("eff", "2. Cervical Effacement", "0", [["0", "0–30% (0 pts)"], ["1", "40–50% (1 pt)"], ["2", "60–70% (2 pts)"], ["3", "≥ 80% (3 pts)"]]),
          makeS("stat", "3. Fetal Station (relative to ischial spines)", "0", [["0", "-3 station (0 pts)"], ["1", "-2 station (1 pt)"], ["2", "-1 or 0 station (2 pts)"], ["3", "+1 or lower (+3 pts)"]]),
          makeS("cons", "4. Cervical Consistency", "0", [["0", "Firm (0 pts)"], ["1", "Medium (1 pt)"], ["2", "Soft (2 pts)"]]),
          makeS("pos", "5. Cervical Position", "0", [["0", "Posterior (0 pts)"], ["1", "Mid-position (1 pt)"], ["2", "Anterior (2 pts)"]])
        ],
        table: {
          headers: ["Score Group", "Cervical Status", "Vaginal Delivery Odds", "Recommended Management"],
          rows: [
            { id: "unfavourable", cols: ["Score 0 – 5", "Unfavourable / Unripe", "Higher risk of failed induction / C-section", "Cervical ripening indicated (PGE2, balloon catheter, or Misoprostol)"] },
            { id: "intermediate", cols: ["Score 6 – 7", "Intermediate Favourability", "Moderate success probability", "Clinical judgement: ripening vs careful low-dose oxytocin titration"] },
            { id: "favourable", cols: ["Score 8 – 13", "Favourable / Ripe Cervix", "High success rate comparable to spontaneous labour", "Direct amniotomy and/or IV oxytocin infusion"] }
          ]
        },
        calc: function (v) {
          var total = +v.dil + +v.eff + +v.stat + +v.cons + +v.pos;
          var match = total >= 8 ? "favourable" : (total >= 6 ? "intermediate" : "unfavourable");
          var interp = total >= 8 ? "Favourable cervix ready for induction." : (total >= 6 ? "Intermediate cervix." : "Unfavourable cervix; ripening recommended.");
          return { value: "Bishop Score: " + total + " / 13 Points", matchId: match, eq: interp };
        }
      },

      // 2. PREECLAMPSIA
      {
        id: "preeclampsiaAssessment",
        cat: "obgyn",
        type: "class",
        name: "Preeclampsia Diagnostic & Severity Staging",
        desc: "Stratifies gestational hypertension and preeclampsia.",
        organ: "Placenta / Vascular / Kidney / Liver / Brain",
        region: "Systemic / Obstetric",
        subject: "Obstetric Medicine / High-Risk Pregnancy",
        keywords: ["preeclampsia", "eclampsia", "hypertension", "bp", "proteinuria", "hellp", "magnesium"],
        fields: [
          makeN("sbp", "Systolic Blood Pressure (mmHg)", 162, { min: 70, max: 260, step: 1 }),
          makeN("dbp", "Diastolic Blood Pressure (mmHg)", 108, { min: 40, max: 160, step: 1 }),
          makeN("upcr", "Urine Protein/Creatinine Ratio (mg/mg)", 0.45, { min: 0, max: 15, step: 0.05 }),
          makeS("severeEndOrgan", "Severe Systemic Features Present?", "1", [
            ["0", "None (Platelets ≥100k, Cr ≤1.1, AST/ALT normal)"],
            ["1", "Present (Plt <100k, Cr >1.1, AST/ALT >2x, pulm edema, neuro symptoms)"]
          ])
        ],
        table: {
          headers: ["Diagnosis Category", "Diagnostic Criteria", "Seizure Prophylaxis", "Delivery Timing"],
          rows: [
            { id: "normal", cols: ["Normotensive", "BP < 140/90 mmHg", "Not indicated", "Standard"] },
            { id: "gesthtn", cols: ["Gestational HTN", "BP ≥ 140/90, no proteinuria", "Not routine", "Induction 37 wks"] },
            { id: "withoutSevere", cols: ["Preeclampsia without Severe", "BP ≥ 140/90 + UPCR ≥ 0.3", "Individualized", "Delivery 37 wks"] },
            { id: "withSevere", cols: ["Preeclampsia WITH SEVERE", "BP ≥ 160/110 or severe features", "Magnesium sulfate stat", "Delivery ≥ 34 wks"] }
          ]
        },
        calc: function (v) {
          var s = +v.sbp, d = +v.dbp, upcr = +v.upcr;
          var severeBp = s >= 160 || d >= 110;
          var elevatedBp = s >= 140 || d >= 90;
          var hasSevere = severeBp || v.severeEndOrgan === "1";
          var cat = "normal", dx = "Normal BP";
          if (elevatedBp) {
            cat = hasSevere ? "withSevere" : (upcr >= 0.3 ? "withoutSevere" : "gesthtn");
            dx = hasSevere ? "Preeclampsia WITH Severe Features" : (upcr >= 0.3 ? "Preeclampsia WITHOUT Severe Features" : "Gestational Hypertension");
          }
          return { value: dx, matchId: cat, eq: "Clinical assessment completed." };
        }
      },

      // 3. APGAR SCORE
      {
        id: "apgarScore",
        cat: "obgyn",
        type: "class",
        name: "Apgar Score (Neonatal Transition)",
        desc: "Standard 1-minute and 5-minute score evaluating newborn condition.",
        organ: "Neonate",
        region: "Delivery Suite",
        subject: "Neonatology",
        keywords: ["apgar", "newborn", "neonate", "resuscitation"],
        fields: [
          makeS("app", "Appearance (Skin Color)", "2", [["0", "Blue/pale (0)"], ["1", "Acrocyanosis (1)"], ["2", "Pink (2)"]]),
          makeS("pulse", "Pulse (Heart Rate)", "2", [["0", "Absent (0)"], ["1", "<100 bpm (1)"], ["2", "≥100 bpm (2)"]]),
          makeS("grimace", "Grimace (Reflex)", "2", [["0", "None (0)"], ["1", "Feeble (1)"], ["2", "Cry/cough (2)"]]),
          makeS("act", "Activity (Muscle Tone)", "2", [["0", "Limp (0)"], ["1", "Some flexion (1)"], ["2", "Active (2)"]]),
          makeS("resp", "Respiration", "2", [["0", "Absent (0)"], ["1", "Slow/irregular (1)"], ["2", "Good cry (2)"]])
        ],
        calc: function (v) {
          var score = +v.app + +v.pulse + +v.grimace + +v.act + +v.resp;
          return { value: "Apgar: " + score + " / 10", matchId: score >= 7 ? "normal" : "severe", eq: score >= 7 ? "Normal transition." : "Depressed newborn." };
        }
      },

      // 4. HADLOCK EFW
      {
        id: "hadlockEfw",
        cat: "obgyn",
        type: "calc",
        name: "Estimated Fetal Weight (Hadlock)",
        desc: "Ultrasound biometric estimation combining BPD, HC, AC, and FL.",
        organ: "Fetus",
        region: "Obstetric Ultrasound",
        subject: "Ultrasonography",
        keywords: ["hadlock", "efw", "fetal weight", "ultrasound"],
        fields: [
          makeN("bpd", "Biparietal Diameter (BPD, cm)", 8.4, { min: 2.0, max: 12.0, step: 0.1 }),
          makeN("hc", "Head Circumference (HC, cm)", 30.5, { min: 8.0, max: 40.0, step: 0.1 }),
          makeN("ac", "Abdominal Circumference (AC, cm)", 28.0, { min: 8.0, max: 45.0, step: 0.1 }),
          makeN("fl", "Femur Length (FL, cm)", 6.5, { min: 1.0, max: 10.0, step: 0.1 })
        ],
        calc: function (v) {
          var b = +v.bpd, h = +v.hc, a = +v.ac, f = +v.fl;
          var logEfw = 1.3596 - (0.00386 * a * f) + (0.0064 * h) + (0.00061 * b * a) + (0.0424 * a) + (0.0174 * f);
          var efwGrams = Math.round(Math.pow(10, logEfw));
          return { value: "EFW: " + efwGrams + " g", eq: "Hadlock 4-parameter regression formula." };
        }
      },

      // 5. PPH PROTOCOL
      {
        id: "pphSeverityAssessment",
        cat: "obgyn",
        type: "class",
        name: "Postpartum Haemorrhage (PPH) Protocol",
        desc: "Clinical staging for obstetric hemorrhage.",
        organ: "Uterus",
        region: "Delivery Suite",
        subject: "Obstetric Emergencies",
        keywords: ["pph", "haemorrhage", "bleeding", "shock"],
        fields: [
          makeN("lossMl", "Measured Blood Loss (mL)", 1250, { min: 50, max: 6000, step: 50 }),
          makeS("deliveryMode", "Mode of Delivery", "vaginal", [["vaginal", "Vaginal Delivery"], ["cesarean", "Cesarean Delivery"]]),
          makeS("unstableVitals", "Hemodynamic Instability?", "0", [["0", "Stable"], ["1", "Unstable"]])
        ],
        calc: function (v) {
          var ml = +v.lossMl;
          var stage = ml >= 1500 ? "Stage 3 PPH (Severe)" : (ml >= 1000 ? "Stage 2 PPH (Moderate)" : "Stage 1 PPH (Mild)");
          return { value: stage, eq: "Blood loss: " + ml + " mL" };
        }
      },

      // 6. OGTT 75g
      {
        id: "ogttInterpretation",
        cat: "obgyn",
        type: "class",
        name: "Gestational Diabetes 75g OGTT",
        desc: "IADPSG / WHO criteria for GDM.",
        organ: "Pancreas",
        region: "Endocrine",
        subject: "Endocrinology",
        keywords: ["gdm", "diabetes", "ogtt", "glucose"],
        fields: [
          makeN("fpg", "Fasting Glucose (mg/dL)", 94),
          makeN("h1", "1-Hour Glucose (mg/dL)", 175),
          makeN("h2", "2-Hour Glucose (mg/dL)", 148)
        ],
        calc: function (v) {
          var isGdm = +v.fpg >= 92 || +v.h1 >= 180 || +v.h2 >= 153;
          return { value: isGdm ? "GESTATIONAL DIABETES DIAGNOSED" : "Normal 75g OGTT", eq: "Thresholds: Fasting ≥92, 1h ≥180, 2h ≥153." };
        }
      },

      // 7. ROTTERDAM PCOS
      {
        id: "rotterdamPcos",
        cat: "obgyn",
        type: "class",
        name: "Rotterdam PCOS Criteria",
        desc: "Phenotypic classification of PCOS.",
        organ: "Ovary",
        region: "Reproductive",
        subject: "Endocrinology",
        keywords: ["pcos", "ovary", "androgen"],
        fields: [
          makeS("oligo", "Ovulatory Dysfunction?", "1", [["1", "Present"], ["0", "Absent"]]),
          makeS("hyperandrogen", "Hyperandrogenism?", "1", [["1", "Present"], ["0", "Absent"]]),
          makeS("usPco", "PCO Morphology on US?", "1", [["1", "Present"], ["0", "Absent"]])
        ],
        calc: function (v) {
          var cnt = +v.oligo + +v.hyperandrogen + +v.usPco;
          return { value: cnt >= 2 ? "PCOS Confirmed (≥2 criteria satisfied)" : "PCOS Criteria Not Met", eq: "Rotterdam criteria." };
        }
      },

      // 8. RMI OVARIAN CANCER
      {
        id: "rmiOvarianCancer",
        cat: "obgyn",
        type: "class",
        name: "Risk of Malignancy Index (RMI I)",
        desc: "Combines ultrasound, menopausal status, and CA-125.",
        organ: "Ovary",
        region: "Pelvis",
        subject: "Gyne-Oncology",
        keywords: ["rmi", "ovary", "cancer", "ca125"],
        fields: [
          makeS("meno", "Menopausal Status", "post", [["pre", "Premenopausal (M=1)"], ["post", "Postmenopausal (M=3)"]]),
          makeS("usFeatures", "US Features", "2", [["0", "0 features (U=0)"], ["1", "1 feature (U=1)"], ["2", "≥2 features (U=3)"]]),
          makeN("ca125", "Serum CA-125 (U/mL)", 125)
        ],
        calc: function (v) {
          var m = v.meno === "post" ? 3 : 1;
          var u = v.usFeatures === "0" ? 0 : (v.usFeatures === "1" ? 1 : 3);
          var rmi = Math.round(u * m * +v.ca125);
          return { value: "RMI Score: " + rmi, eq: "RMI = U (" + u + ") × M (" + m + ") × CA125 (" + v.ca125 + ")" };
        }
      },

      // 9. FIGO CERVICAL CANCER
      {
        id: "figoCervicalCancer",
        cat: "obgyn",
        type: "class",
        name: "FIGO Cervical Cancer Staging",
        desc: "2018 FIGO stage classification.",
        organ: "Cervix",
        region: "Pelvis",
        subject: "Gyne-Oncology",
        keywords: ["cervix", "figo", "cancer"],
        fields: [
          makeS("extent", "Primary Tumor Extension", "IB1", [["IA1", "Stage IA1 (<3mm)"], ["IB1", "Stage IB1 (≥5mm, <2cm)"], ["IIB", "Stage IIB (Parametrial)"], ["IVB", "Stage IVB (Distant)"]]),
          makeS("nodes", "Lymph Nodes", "none", [["none", "No nodal mets"], ["pelvic", "Pelvic nodes (Stage IIIC1)"], ["paraaortic", "Para-aortic (Stage IIIC2)"]])
        ],
        calc: function (v) {
          var st = v.nodes !== "none" ? (v.nodes === "pelvic" ? "Stage IIIC1" : "Stage IIIC2") : v.extent;
          return { value: "FIGO Stage: " + st, eq: "Revised 2018 FIGO staging." };
        }
      },

      // 10. GANZONI FORMULA
      {
        id: "ganzoniFormula",
        cat: "obgyn",
        type: "calc",
        name: "Ganzoni Iron Deficit Calculator",
        desc: "Parenteral iron requirement in pregnancy.",
        organ: "Hematopoietic",
        region: "Systemic",
        subject: "Hematology",
        keywords: ["ganzoni", "iron", "anemia"],
        fields: [
          makeN("weight", "Body Weight (kg)", 62),
          makeN("actualHb", "Actual Hb (g/dL)", 8.4),
          makeN("targetHb", "Target Hb (g/dL)", 11.0),
          makeN("depot", "Iron Depot (mg)", 500)
        ],
        calc: function (v) {
          var def = Math.max(0, Math.round((+v.weight * (+v.targetHb - +v.actualHb) * 2.4) + +v.depot));
          return { value: def + " mg Elemental Iron Deficit", eq: "Ganzoni Equation." };
        }
      }
    ];

    // 2. Push to global memory
    window.categories = window.categories || [];
    window.tools = window.tools || [];

    if (!window.categories.some(function (c) { return c && c.id === obgynCategory.id; })) {
      window.categories.push(obgynCategory);
    }

    obgynTools.forEach(function (tool) {
      var idx = window.tools.findIndex(function (t) { return t && t.id === tool.id; });
      if (idx >= 0) {
        window.tools[idx] = tool;
      } else {
        window.tools.push(tool);
      }
    });

    // 3. Confirm success or alert
    alert("SUCCESS: Loaded " + window.categories.length + " category and " + window.tools.length + " tools into window!");

    // 4. Force HTML screen repaint
    if (typeof window.renderHome === "function") {
      window.renderHome();
    }

  } catch (err) {
    // 5. IF IT FAILS, THIS WILL POP UP ON YOUR SCREEN:
    alert("CRASH IN obgy.js:\nMessage: " + err.message + "\nStack:\n" + err.stack);
  }
})();
