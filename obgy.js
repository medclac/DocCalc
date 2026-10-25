/**
 * MedCalc Module: Obstetrics & Gynaecology (OB-GYN)
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
  var makeD = (typeof window !== "undefined" && window.D) ? window.D : function (id, label, defaultVal, extra) {
    extra = extra || {};
    return Object.assign({ id: id, label: label, type: "date", value: defaultVal, default: defaultVal }, extra);
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
    // ==============================================================
    // PREGNANCY DATING: LMP, EDD & GESTATIONAL AGE
    // ==============================================================
    {
      id: "pregnancyDating",
      cat: "obgyn",
      type: "calc",
      name: "Pregnancy Dating (LMP, EDD & Gestational Age)",
      desc: "Calculates Estimated Due Date (Naegele's rule adjusted for cycle length), current Gestational Age, and antenatal milestones.",
      organ: "Uterus / Fetus / Placenta",
      region: "Obstetric Antenatal Care",
      subject: "Obstetric Dating / Routine Antenatal Care",
      keywords: ["lmp", "edd", "edc", "dating", "gestational age", "due date", "naegele", "trimester", "pregnancy"],
      guidance: "1. Enter the Day, Month, and 4-digit Year of the first day of the Last Normal Menstrual Period (LMP).\n2. Specify average cycle length in days (default 28).\n3. If ultrasound CRL differs by >5–7 days, ultrasound dating takes precedence.",
      contraindications: "Unreliable in irregular cycles or recent hormonal contraception use.",
      literature: [
        {
          type: "ACOG Committee Opinion",
          icon: "📘",
          title: "ACOG Committee Opinion No. 700: Methods for Estimating the Due Date",
          citation: "American College of Obstetricians and Gynecologists. Obstet Gynecol. 2017;129(5):e150-e154.",
          links: [
            { text: "View Guideline (ACOG) ↗", url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date" }
          ]
        }
      ],
      fields: [
        makeN("lmpDay", "LMP Day (1–31)", new Date(Date.now() - 70 * 86400000).getDate(), { min: 1, max: 31, step: 1 }),
        makeN("lmpMonth", "LMP Month (1–12)", new Date(Date.now() - 70 * 86400000).getMonth() + 1, { min: 1, max: 12, step: 1 }),
        makeN("lmpYear", "LMP Year (e.g. 2026)", new Date(Date.now() - 70 * 86400000).getFullYear(), { min: 2020, max: 2035, step: 1 }),
        makeN("cycleLength", "Average Menstrual Cycle Length (Days)", 28, { min: 21, max: 45, step: 1 })
      ],
      table: {
        headers: ["Gestational Stage", "Gestational Weeks", "Key Antenatal Milestones & Routine Testing"],
        rows: [
          { id: "tri1", cols: ["1st Trimester", "0+0 to 13+6 Weeks", "Dating scan (CRL), baseline bloods, aneuploidy screening"] },
          { id: "tri2", cols: ["2nd Trimester", "14+0 to 27+6 Weeks", "Anomaly scan (18–20 wks), 75g OGTT (24–28 wks), Anti-D if Rh-negative"] },
          { id: "tri3", cols: ["3rd Trimester", "28+0 to 40+6 Weeks", "Growth scans, GBS screening (36–37 wks), labor preparation"] },
          { id: "postterm", cols: ["Post-Term Period", "≥ 41+0 Weeks", "Membrane sweep, biophysical profile, induction before 42+0 weeks"] }
        ]
      },
      calc: function (v) {
        var day = Math.floor(+v.lmpDay);
        var month = Math.floor(+v.lmpMonth);
        var year = Math.floor(+v.lmpYear);
        var cycle = +v.cycleLength || 28;

        var monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        // 1. Basic range check
        if (month < 1 || month > 12) {
          return { value: "Invalid Month", eq: "Please enter a valid month between 1 and 12." };
        }

        // 2. Exact days-per-month computation (day 0 of month + 1 returns last day of target month)
        var maxDaysInMonth = new Date(year, month, 0).getDate();
        var selectedMonthName = monthNames[month - 1];

        if (day < 1 || day > maxDaysInMonth) {
          return {
            value: "Invalid Day for " + selectedMonthName,
            eq: selectedMonthName + " " + year + " has only " + maxDaysInMonth + " days. You entered Day " + day + "."
          };
        }

        var lmpDate = new Date(year, month - 1, day);

        // 3. Prevent future LMP calculation
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        var totalDays = Math.floor((today.getTime() - lmpDate.getTime()) / 86400000);
        if (totalDays < 0) {
          return { 
            value: "Future Date Entered", 
            eq: "The LMP date cannot be in the future relative to today's date." 
          };
        }

        // 4. Naegele's rule adjusted for cycle length: LMP + 280 days + (cycle - 28)
        var cycleDiff = cycle - 28;
        var eddDate = new Date(lmpDate.getTime() + (280 + cycleDiff) * 86400000);

        // 5. Gestational Age & Trimester breakdown
        var weeks = Math.floor(totalDays / 7);
        var days = totalDays % 7;

        var stage = "tri1";
        var triName = "1st Trimester";
        if (weeks >= 41) {
          stage = "postterm";
          triName = "Late / Post-Term";
        } else if (weeks >= 28) {
          stage = "tri3";
          triName = "3rd Trimester";
        } else if (weeks >= 14) {
          stage = "tri2";
          triName = "2nd Trimester";
        }

        var eddString = eddDate.toLocaleDateString(undefined, { 
          weekday: "short", 
          year: "numeric", 
          month: "short", 
          day: "numeric" 
        });

        var conceptionDate = new Date(lmpDate.getTime() + (14 + cycleDiff) * 86400000);
        var conceptionStr = conceptionDate.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric"
        });

        return {
          value: weeks + " Weeks, " + days + " Days (" + triName + ")",
          matchId: stage,
          eq: "Estimated Date of Delivery (EDD): " + eddString + "\n" +
              "• Method: Naegele's rule adjusted for " + cycle + "-day cycle\n" +
              "• Estimated Conception: ~" + conceptionStr + "\n" +
              "• Month Check: " + selectedMonthName + " " + year + " validated (" + maxDaysInMonth + " days max)\n" +
              "• Clinical Note: Ultrasound CRL dating takes precedence if difference > 5–7 days."
        };
      }
    }
,

    // ==============================================================
    // 2. BISHOP SCORE FOR CERVICAL RIPENING & INDUCTION
    // ==============================================================
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
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Pelvic scoring for elective induction",
          citation: "Bishop EH. Obstet Gynecol. 1964;24:266-268.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/14199536/" }
          ]
        },
        {
          type: "ACOG Clinical Practice Guideline",
          icon: "📘",
          title: "ACOG Practice Bulletin No. 107: Induction of Labor",
          citation: "American College of Obstetricians and Gynecologists. Obstet Gynecol. 2009;114(2 Pt 1):386-397.",
          links: [
            { text: "View Guideline (DOI) ↗", url: "https://doi.org/10.1097/AOG.0b013e3181b48ef5" }
          ]
        }
      ],
      fields: [
        makeS("dil", "1. Cervical Dilatation", "0", [
          ["0", "Closed (0 pts)"],
          ["1", "1–2 cm (1 pt)"],
          ["2", "3–4 cm (2 pts)"],
          ["3", "≥ 5 cm (3 pts)"]
        ]),
        makeS("eff", "2. Cervical Effacement", "0", [
          ["0", "0–30% (0 pts)"],
          ["1", "40–50% (1 pt)"],
          ["2", "60–70% (2 pts)"],
          ["3", "≥ 80% (3 pts)"]
        ]),
        makeS("stat", "3. Fetal Station (relative to ischial spines)", "0", [
          ["0", "-3 station (0 pts)"],
          ["1", "-2 station (1 pt)"],
          ["2", "-1 or 0 station (2 pts)"],
          ["3", "+1 or lower (+3 pts)"]
        ]),
        makeS("cons", "4. Cervical Consistency", "0", [
          ["0", "Firm (0 pts)"],
          ["1", "Medium (1 pt)"],
          ["2", "Soft (2 pts)"]
        ]),
        makeS("pos", "5. Cervical Position", "0", [
          ["0", "Posterior (0 pts)"],
          ["1", "Mid-position (1 pt)"],
          ["2", "Anterior (2 pts)"]
        ])
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
        var match = "unfavourable";
        var interp = "Unfavourable cervix (Score ≤ 5). Pharmacological or mechanical ripening recommended before induction.";
        if (total >= 8) {
          match = "favourable";
          interp = "Favourable cervix (Score ≥ 8). High likelihood of successful vaginal birth; proceed with oxytocin induction / amniotomy.";
        } else if (total >= 6) {
          match = "intermediate";
          interp = "Intermediate cervix (Score 6–7). Evaluate parity, membrane status, and obstetric indications.";
        }
        return {
          value: "Bishop Score: " + total + " / 13 Points",
          matchId: match,
          eq: interp
        };
      }
    },

    // ==============================================================
    // 3. PREECLAMPSIA DIAGNOSIS & SEVERITY ASSESSMENT (ACOG 2020)
    // ==============================================================
    {
      id: "preeclampsiaAssessment",
      cat: "obgyn",
      type: "class",
      name: "Preeclampsia Diagnostic & Severity Staging",
      desc: "Stratifies gestational hypertension and preeclampsia with or without severe end-organ features.",
      organ: "Placenta / Vascular / Kidney / Liver / Brain",
      region: "Systemic / Obstetric",
      subject: "Obstetric Medicine / High-Risk Pregnancy",
      keywords: ["preeclampsia", "eclampsia", "hypertension", "bp", "proteinuria", "hellp", "magnesium", "seizure", "toxemia", "headache", "platelets"],
      guidance: "1. Confirm gestational age ≥20 weeks.\n2. Obtain seated blood pressure readings.\n3. Check proteinuria (UPCR ≥0.3 or 24-hr urine protein ≥300 mg).\n4. In the absence of proteinuria, evaluate for severe features (thrombocytopenia, renal insufficiency, impaired liver transaminases, pulmonary edema, or new-onset visual/cerebral symptoms).",
      contraindications: "Always exclude pre-existing chronic hypertension, lupus nephritis, and primary microangiopathies (TTP/aHUS).",
      literature: [
        {
          type: "ACOG Practice Bulletin",
          icon: "📘",
          title: "Gestational Hypertension and Preeclampsia (Practice Bulletin No. 222)",
          citation: "American College of Obstetricians and Gynecologists. Obstet Gynecol. 2020;135(6):e237-e260.",
          links: [
            { text: "View Guideline (PubMed) ↗", url: "https://pubmed.ncbi.nlm.nih.gov/32443079/" },
            { text: "View DOI ↗", url: "https://doi.org/10.1097/AOG.0000000000003891", secondary: true }
          ]
        },
        {
          type: "Seminal Multicenter Trial",
          icon: "📄",
          title: "Do women with pre-eclampsia benefit from magnesium sulphate? The Magpie Trial",
          citation: "Altman D, Carroli G, Duley L, et al. Lancet. 2002;359(9321):1877-1890.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/12057549/" }
          ]
        }
      ],
      fields: [
        makeN("sbp", "Systolic Blood Pressure (mmHg)", 162, { min: 70, max: 260, step: 1 }),
        makeN("dbp", "Diastolic Blood Pressure (mmHg)", 108, { min: 40, max: 160, step: 1 }),
        makeN("upcr", "Urine Protein/Creatinine Ratio (mg/mg)", 0.45, { min: 0, max: 15, step: 0.05 }),
        makeS("severeEndOrgan", "Severe Systemic Features Present?", "1", [
          ["0", "None (Platelets ≥100k, Cr ≤1.1, AST/ALT normal, no neuro symptoms/pulm edema)"],
          ["1", "Present (Plt <100k, Cr >1.1, AST/ALT >2x, pulmonary edema, or persistent cerebral/visual disturbance)"]
        ])
      ],
      table: {
        headers: ["Diagnosis Category", "Diagnostic Criteria", "Seizure Prophylaxis", "Delivery Timing"],
        rows: [
          { id: "normal", cols: ["Normotensive / No Preeclampsia", "BP < 140/90 mmHg, no significant end-organ disturbance", "Not indicated", "Standard obstetric indications"] },
          { id: "gesthtn", cols: ["Gestational Hypertension", "BP ≥ 140/90 after 20 wks, no proteinuria, no severe features", "Not routinely indicated", "Induction at 37+0 weeks"] },
          { id: "withoutSevere", cols: ["Preeclampsia without Severe Features", "BP ≥ 140/90 with UPCR ≥ 0.3 mg/mg (no severe criteria)", "Individualized / intrapartum consideration", "Delivery at 37+0 weeks"] },
          { id: "withSevere", cols: ["Preeclampsia WITH SEVERE FEATURES", "BP ≥ 160/110 or severe lab/cerebral end-organ criteria", "IV Magnesium Sulfate indicated stat", "Delivery at ≥ 34+0 weeks (or immediate upon stabilization if unstable)"] }
        ]
      },
      calc: function (v) {
        var s = +v.sbp, d = +v.dbp, upcr = +v.upcr;
        var severeBp = s >= 160 || d >= 110;
        var elevatedBp = s >= 140 || d >= 90;
        var prot = upcr >= 0.3;
        var hasSevere = severeBp || v.severeEndOrgan === "1";

        var cat = "normal", dx = "Normal Blood Pressure Profile", mgmt = "Blood pressures and laboratory criteria within standard range.";

        if (elevatedBp) {
          if (prot && hasSevere) {
            cat = "withSevere";
            dx = "Preeclampsia WITH Severe Features";
            mgmt = "Emergency initiation of IV Labetalol/Hydralazine/oral Nifedipine for severe BP. Administer IV Magnesium sulfate for seizure prophylaxis. Plan delivery at ≥34 weeks or upon clinical decompensation.";
          } else if (hasSevere) {
            cat = "withSevere";
            dx = "Preeclampsia WITH Severe Features (Atypical/Non-proteinuric)";
            mgmt = "Proteinuria is NOT mandatory when systemic end-organ damage exists. Initiate IV Magnesium sulfate and urgent antihypertensive control.";
          } else if (prot) {
            cat = "withoutSevere";
            dx = "Preeclampsia WITHOUT Severe Features";
            mgmt = "Twice-weekly maternal and fetal surveillance. Delivery recommended at 37+0 weeks gestation.";
          } else {
            cat = "gesthtn";
            dx = "Gestational Hypertension";
            mgmt = "Monitor closely for transformation to preeclampsia. Re-check UPCR, platelet counts, and transaminases weekly.";
          }
        }

        return {
          value: dx,
          matchId: cat,
          eq: "Clinical Pathway: " + mgmt
        };
      }
    },

    // ==============================================================
    // 4. APGAR SCORE (NEONATAL ASSESSMENT)
    // ==============================================================
    {
      id: "apgarScore",
      cat: "obgyn",
      type: "class",
      name: "Apgar Score (Neonatal Transition)",
      desc: "Standard 1-minute and 5-minute score evaluating newborn physiological transition after birth.",
      organ: "Neonate / Cardiorespiratory / Nervous System",
      region: "Neonatal / Delivery Suite",
      subject: "Obstetrics / Neonatology",
      keywords: ["apgar", "newborn", "neonate", "delivery", "baby", "resuscitation", "pulse", "tone", "color", "grimace"],
      guidance: "1. Evaluate at 1 minute and 5 minutes post-delivery.\n2. Sum 5 parameters (0 to 2 points each, max 10).\n3. If 5-minute score is <7, continue scoring every 5 minutes for up to 20 minutes.",
      contraindications: "Resuscitation maneuvers must NOT be delayed to assign the 1-minute Apgar score. Not predictive of individual long-term neurological prognosis.",
      literature: [
        {
          type: "Historical Landmark Paper",
          icon: "📄",
          title: "A proposal for a new method of evaluation of the newborn infant",
          citation: "Apgar V. Curr Res Anesth Analg. 1953;32(4):260-267.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/13083014/" }
          ]
        },
        {
          type: "AAP & ACOG Committee Opinion",
          icon: "📘",
          title: "The Apgar Score (Committee Opinion No. 644)",
          citation: "American Academy of Pediatrics, ACOG. Pediatrics. 2015;136(4):819-822.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/26416932/" },
            { text: "View DOI ↗", url: "https://doi.org/10.1542/peds.2015-2651", secondary: true }
          ]
        }
      ],
      fields: [
        makeS("app", "Appearance (Skin Color)", "2", [
          ["0", "Blue or pale all over (0 pts)"],
          ["1", "Pink body, blue extremities / acrocyanosis (1 pt)"],
          ["2", "Completely pink trunk and extremities (2 pts)"]
        ]),
        makeS("pulse", "Pulse (Heart Rate)", "2", [
          ["0", "Absent (0 pts)"],
          ["1", "< 100 beats/min (1 pt)"],
          ["2", "≥ 100 beats/min (2 pts)"]
        ]),
        makeS("grimace", "Grimace (Reflex Irritability)", "2", [
          ["0", "No response to stimulation (0 pts)"],
          ["1", "Grimace or feeble movement (1 pt)"],
          ["2", "Cry, cough, sneeze, or active withdrawal (2 pts)"]
        ]),
        makeS("act", "Activity (Muscle Tone)", "2", [
          ["0", "Limp / flaccid (0 pts)"],
          ["1", "Some flexion of extremities (1 pt)"],
          ["2", "Active motion, well flexed (2 pts)"]
        ]),
        makeS("resp", "Respiration", "2", [
          ["0", "Absent / apnea (0 pts)"],
          ["1", "Slow, irregular, weak gasp (1 pt)"],
          ["2", "Good, strong vigorous cry (2 pts)"]
        ])
      ],
      table: {
        headers: ["Score Range", "Physiological Condition", "Neonatal Action Required"],
        rows: [
          { id: "normal", cols: ["7 – 10 Points", "Normal Transition / Vigorous", "Routine clearing of secretions, drying, warm skin-to-skin contact"] },
          { id: "moderate", cols: ["4 – 6 Points", "Moderately Depressed Infant", "Tactile stimulation, clear airway, positive pressure ventilation (PPV) with room air/blended O2"] },
          { id: "severe", cols: ["0 – 3 Points", "Severely Depressed Infant", "Immediate NRP resuscitation: PPV, evaluate HR, chest compressions, vascular access & epinephrine if HR <60 bpm"] }
        ]
      },
      calc: function (v) {
        var score = +v.app + +v.pulse + +v.grimace + +v.act + +v.resp;
        var match = "normal";
        var text = "Normal transitional physiology. Reassure and maintain thermal warmth.";
        if (score <= 3) {
          match = "severe";
          text = "Severely depressed newborn. Immediate Neonatal Resuscitation Program (NRP) execution mandated.";
        } else if (score <= 6) {
          match = "moderate";
          text = "Moderately depressed infant. Requires positive pressure ventilation, airway support, and continuous reassessment.";
        }
        return {
          value: "Apgar: " + score + " / 10 Points",
          matchId: match,
          eq: text
        };
      }
    },

    // ==============================================================
    // 5. HADLOCK ESTIMATED FETAL WEIGHT (EFW)
    // ==============================================================
    {
      id: "hadlockEfw",
      cat: "obgyn",
      type: "calc",
      name: "Estimated Fetal Weight (Hadlock 4-Parameter)",
      desc: "Ultrasound biometric estimation combining BPD, HC, AC, and FL to calculate fetal weight.",
      organ: "Fetus / Placenta",
      region: "Obstetric Ultrasound",
      subject: "Fetal Medicine / Obstetric Ultrasonography",
      keywords: ["hadlock", "efw", "fetal weight", "fgr", "iugr", "macrosomia", "bpd", "hc", "ac", "fl", "ultrasound"],
      guidance: "1. Measure Biparietal Diameter (BPD) and Head Circumference (HC) at the trans-thalamic plane.\n2. Measure Abdominal Circumference (AC) at the junction of the umbilical vein and ductus venosus/stomach bubble.\n3. Measure Femur Length (FL) across the calcified diaphysis.\n4. Input metrics in centimeters (cm).",
      contraindications: "Inherent biological ultrasound variation gives ±10–15% margin of error. Inaccurate in severe oligohydramnios, severe molding, or multiple gestations.",
      literature: [
        {
          type: "Seminal Biometry Study",
          icon: "📄",
          title: "Estimation of fetal weight with the use of head, body, and femur measurements",
          citation: "Hadlock FP, Harrist RB, Sharman RS, Deter RL, Park SK. Am J Obstet Gynecol. 1985;151(3):333-337.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/3881966/" },
            { text: "View DOI ↗", url: "https://doi.org/10.1016/0002-9378(85)90298-4", secondary: true }
          ]
        },
        {
          type: "SMFM Consult Series",
          icon: "📘",
          title: "SMFM Consult Series #52: Diagnosis and management of fetal growth restriction",
          citation: "Martins JG, Biggio JR, Abuhamad A. Am J Obstet Gynecol. 2020;223(4):B2-B17.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/32679144/" }
          ]
        }
      ],
      fields: [
        makeN("bpd", "Biparietal Diameter (BPD, cm)", 8.4, { min: 2.0, max: 12.0, step: 0.1 }),
        makeN("hc", "Head Circumference (HC, cm)", 30.5, { min: 8.0, max: 40.0, step: 0.1 }),
        makeN("ac", "Abdominal Circumference (AC, cm)", 28.0, { min: 8.0, max: 45.0, step: 0.1 }),
        makeN("fl", "Femur Length (FL, cm)", 6.5, { min: 1.0, max: 10.0, step: 0.1 })
      ],
      table: {
        headers: ["EFW Weight Category", "Clinical Definition", "Key Obstetric Risks", "Management Considerations"],
        rows: [
          { id: "fgr", cols: ["FGR / SGA (< 10th percentile)", "EFW < 10th percentile for GA", "Stillbirth, acidosis, hypoglycemia", "Umbilical & MCA Doppler surveillance, antenatal testing"] },
          { id: "aga", cols: ["Appropriate for GA (10th–90th %ile)", "Normal physiological growth curve", "Standard baseline perinatal risk", "Routine prenatal care"] },
          { id: "lga", cols: ["LGA / Macrosomia (> 90th %ile / >4000g)", "Excessive fetal weight trajectory", "Shoulder dystocia, birth trauma, PPH", "Screen for gestational diabetes; discuss cesarean if EFW >4500-5000g"] }
        ]
      },
      calc: function (v) {
        var b = +v.bpd, h = +v.hc, a = +v.ac, f = +v.fl;
        var logEfw = 1.3596 - (0.00386 * a * f) + (0.0064 * h) + (0.00061 * b * a) + (0.0424 * a) + (0.0174 * f);
        var efwGrams = Math.round(Math.pow(10, logEfw));
        var efwKg = (efwGrams / 1000).toFixed(2);

        var match = "aga";
        if (efwGrams < 2500) match = "fgr";
        else if (efwGrams >= 4000) match = "lga";

        return {
          value: "EFW: " + efwGrams + " g (" + efwKg + " kg)",
          matchId: match,
          eq: "Hadlock 4-parameter regression model:\nLog10(BW) = 1.3596 - (0.00386×AC×FL) + (0.0064×HC) + (0.00061×BPD×AC) + (0.0424×AC) + (0.0174×FL).\nTypical margin of error: ±10–15%."
        };
      }
    },

    // ==============================================================
    // 6. POSTPARTUM HAEMORRHAGE (PPH) SEVERITY STAGING
    // ==============================================================
    {
      id: "pphSeverityAssessment",
      cat: "obgyn",
      type: "class",
      name: "Postpartum Haemorrhage (PPH) Severity Protocol",
      desc: "Clinical staging and escalating medical/surgical management algorithm for obstetric hemorrhage.",
      organ: "Uterus / Systemic Vasculature",
      region: "Obstetric / Delivery Suite",
      subject: "Obstetric Emergencies / Critical Care",
      keywords: ["pph", "haemorrhage", "hemorrhage", "bleeding", "shock", "oxytocin", "uterotonic", "bakri", "transfusion", "postpartum"],
      guidance: "1. Quantify blood loss quantitatively using gravimetric drapes and weighed swabs.\n2. Note delivery route (vaginal vs cesarean).\n3. Re-evaluate vital signs and systemic perfusion continuously.",
      contraindications: "Visual inspection underestimates blood loss by 30–50%. Do not use Methylergometrine in hypertension, or Carboprost (PGF2α) in active asthma.",
      literature: [
        {
          type: "ACOG Practice Bulletin",
          icon: "📘",
          title: "ACOG Practice Bulletin No. 183: Postpartum Hemorrhage",
          citation: "American College of Obstetricians and Gynecologists. Obstet Gynecol. 2017;130(4):e168-e186.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/28937571/" }
          ]
        },
        {
          type: "Landmark Trial (WOMAN Trial)",
          icon: "📄",
          title: "Effect of early tranexamic acid on death in women with post-partum haemorrhage: the WOMAN trial",
          citation: "WOMAN Trial Collaborators. Lancet. 2017;389(10084):2105-2116.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/28456509/" },
            { text: "View DOI ↗", url: "https://doi.org/10.1016/S0140-6736(17)30638-4", secondary: true }
          ]
        }
      ],
      fields: [
        makeN("lossMl", "Cumulative Measured Blood Loss (mL)", 1250, { min: 50, max: 6000, step: 50 }),
        makeS("deliveryMode", "Mode of Delivery", "vaginal", [
          ["vaginal", "Vaginal Delivery"],
          ["cesarean", "Cesarean Delivery"]
        ]),
        makeS("unstableVitals", "Hemodynamic Instability Present?", "0", [
          ["0", "Stable vitals (HR <100, SBP >90)"],
          ["1", "Unstable vitals (HR >110, SBP <90, altered mentation, pallor)"]
        ])
      ],
      table: {
        headers: ["PPH Stage", "Cumulative Blood Loss", "Immediate First-Line Actions", "Second-Line Interventions"],
        rows: [
          { id: "normal", cols: ["Physiologic Loss", "< 500 mL (Vaginal) / < 1000 mL (Cesarean)", "Active management of third stage (AMTSL)", "Routine monitoring"] },
          { id: "stage1", cols: ["Stage 1 PPH", "500–999 mL (or Cesarean >1000 mL stable)", "Fundal massage, 2 large-bore IVs, Oxytocin 20–40U IV infusion", "Rule out the 4 T's (Tone, Trauma, Tissue, Thrombin)"] },
          { id: "stage2", cols: ["Stage 2 PPH", "1000–1499 mL (or vital sign instability)", "Second-line uterotonics (TXA 1g IV stat, Carboprost, Misoprostol)", "Crossmatch 2–4 units PRBCs, transfer to OR, intrauterine balloon tamponade (Bakri)"] },
          { id: "stage3", cols: ["Stage 3 PPH", "≥ 1500 mL (or ongoing instability / DIC)", "Activate Massive Transfusion Protocol (1:1:1 PRBC:FFP:Plt)", "Emergency laparotomy: B-Lynch compressive suture, uterine artery ligation, hysterectomy"] }
        ]
      },
      calc: function (v) {
        var ml = +v.lossMl;
        var unstable = v.unstableVitals === "1";
        var stage = "normal", title = "Physiologic Blood Loss", tx = "Normal third-stage loss. Continue standard post-delivery observation.";

        if (ml >= 1500 || (ml >= 1000 && unstable)) {
          stage = "stage3";
          title = "Stage 3 PPH: Severe / Critical Haemorrhage (≥1500 mL)";
          tx = "EMERGENCY: Trigger Massive Transfusion Protocol (1:1:1 ratio). Give Tranexamic Acid (TXA) 1g IV over 10 min. Surgical hemostasis: intrauterine balloon tamponade, uterine compression sutures, interventional embolization, or emergency hysterectomy.";
        } else if (ml >= 1000 || unstable) {
          stage = "stage2";
          title = "Stage 2 PPH: Moderate Haemorrhage (1000–1499 mL)";
          tx = "Escalate medical therapy: TXA 1g IV stat + secondary uterotonics (Methylergometrine 0.2mg IM if non-hypertensive, Carboprost 0.25mg IM if non-asthmatic, or Misoprostol 800mcg sublingual). Prepare OR and crossmatch blood.";
        } else if ((v.deliveryMode === "vaginal" && ml >= 500) || (v.deliveryMode === "cesarean" && ml >= 1000)) {
          stage = "stage1";
          title = "Stage 1 PPH: Mild Haemorrhage (≥500 mL Vaginal / ≥1000 mL CS)";
          tx = "Initiate vigorous fundal massage, establish two 16G IV lines, start high-dose Oxytocin infusion (20–40 units in 1L crystalloid).";
        }

        return {
          value: title,
          matchId: stage,
          eq: tx
        };
      }
    },

    // ==============================================================
    // 7. GESTATIONAL DIABETES 75g OGTT INTERPRETATION
    // ==============================================================
    {
      id: "ogttInterpretation",
      cat: "obgyn",
      type: "class",
      name: "Gestational Diabetes 75g OGTT (IADPSG / WHO)",
      desc: "Classifies 2-hour 75g oral glucose tolerance test (OGTT) in pregnancy per international criteria.",
      organ: "Endocrine / Pancreas / Fetus",
      region: "Obstetric Metabolic",
      subject: "Obstetric Endocrinology / Maternal-Fetal Medicine",
      keywords: ["gdm", "diabetes", "ogtt", "glucose", "sugar", "iadpsg", "who", "hapo", "pregnancy", "macrosomia"],
      guidance: "1. Patient fasts for 8–14 hours prior to the test.\n2. Obtain fasting venous plasma glucose.\n3. Administer 75g anhydrous oral glucose in 250–300 mL water over 5 minutes.\n4. Draw plasma glucose at 1 hour and 2 hours.",
      contraindications: "Do not perform in acute gastroenteritis or post-bariatric surgery.",
      literature: [
        {
          type: "Seminal HAPO Study",
          icon: "📄",
          title: "Hyperglycemia and Adverse Pregnancy Outcomes (HAPO Study)",
          citation: "HAPO Study Cooperative Research Group. N Engl J Med. 2008;358(19):1991-2002.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/18463375/" }
          ]
        }
      ],
      fields: [
        makeN("fpg", "Fasting Plasma Glucose (mg/dL)", 94, { min: 40, max: 300, step: 1 }),
        makeN("h1", "1-Hour Plasma Glucose (mg/dL)", 175, { min: 40, max: 400, step: 1 }),
        makeN("h2", "2-Hour Plasma Glucose (mg/dL)", 148, { min: 40, max: 400, step: 1 })
      ],
      table: {
        headers: ["OGTT Reading", "Normal Value", "GDM Diagnostic Threshold (IADPSG/WHO)", "Patient Status"],
        rows: [
          { id: "fastingRow", cols: ["Fasting Glucose", "< 92 mg/dL (5.1 mmol/L)", "≥ 92 mg/dL (5.1 mmol/L)", "Evaluated dynamically"] },
          { id: "oneHourRow", cols: ["1-Hour Glucose", "< 180 mg/dL (10.0 mmol/L)", "≥ 180 mg/dL (10.0 mmol/L)", "Evaluated dynamically"] },
          { id: "twoHourRow", cols: ["2-Hour Glucose", "< 153 mg/dL (8.5 mmol/L)", "≥ 153 mg/dL (8.5 mmol/L)", "Evaluated dynamically"] },
          { id: "gdmPositive", cols: ["Summary: GDM Diagnosis", "All 3 thresholds normal", "ANY SINGLE threshold met or exceeded", "Diagnostic of Gestational Diabetes"] }
        ]
      },
      calc: function (v) {
        var f = +v.fpg, h1 = +v.h1, h2 = +v.h2;
        var fAbn = f >= 92;
        var h1Abn = h1 >= 180;
        var h2Abn = h2 >= 153;
        var isGdm = fAbn || h1Abn || h2Abn;

        var exceeded = [];
        if (fAbn) exceeded.push("Fasting ≥92 (val: " + f + ")");
        if (h1Abn) exceeded.push("1-hr ≥180 (val: " + h1 + ")");
        if (h2Abn) exceeded.push("2-hr ≥153 (val: " + h2 + ")");

        return {
          value: isGdm ? "GESTATIONAL DIABETES DIAGNOSED" : "Normal 75g OGTT",
          matchId: isGdm ? "gdmPositive" : "fastingRow",
          eq: isGdm
            ? "Thresholds exceeded: " + exceeded.join(", ") + ".\nPer IADPSG/WHO criteria, one single elevated value confirms GDM."
            : "All values normal (Fasting <92, 1-hr <180, 2-hr <153 mg/dL)."
        };
      }
    },

    // ==============================================================
    // 8. ROTTERDAM PCOS CRITERIA
    // ==============================================================
    {
      id: "rotterdamPcos",
      cat: "obgyn",
      type: "class",
      name: "Rotterdam PCOS Diagnostic Criteria",
      desc: "Evaluates anovulation, hyperandrogenism, and ultrasound polycystic ovaries to define PCOS phenotypes.",
      organ: "Ovary / Endocrine Axis",
      region: "Gynaecologic Reproductive",
      subject: "Gynaecological Endocrinology / Infertility",
      keywords: ["pcos", "rotterdam", "ovary", "polycystic", "androgen", "hirsutism", "infertility", "oligoamenorrhea", "acne"],
      guidance: "1. Exclude secondary causes.\n2. Assess ovulatory dysfunction.\n3. Assess hyperandrogenism.\n4. Assess pelvic ultrasound.",
      contraindications: "Ultrasound criteria are non-specific in adolescents within 8 years of menarche.",
      literature: [
        {
          type: "Rotterdam Consensus Conference",
          icon: "📄",
          title: "Revised 2003 consensus on diagnostic criteria for polycystic ovary syndrome (PCOS)",
          citation: "The Rotterdam ESHRE/ASRM-Sponsored PCOS Consensus Workshop Group. Fertil Steril. 2004;81(1):19-25.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/14711538/" }
          ]
        }
      ],
      fields: [
        makeS("oligo", "1. Ovulatory Dysfunction (Oligo/Anovulation)", "1", [
          ["1", "Present: Cycle length >35 days or <8 cycles/year"],
          ["0", "Absent: Regular predictable monthly ovulatory cycles"]
        ]),
        makeS("hyperandrogen", "2. Hyperandrogenism (Clinical or Biochemical)", "1", [
          ["1", "Present: Hirsutism (mFG ≥4-6), acne, or elevated testosterone"],
          ["0", "Absent: Normal androgens, no hirsutism"]
        ]),
        makeS("usPco", "3. Polycystic Ovarian Morphology on Ultrasound", "1", [
          ["1", "Present: ≥20 follicles (2–9mm) per ovary or ovarian volume ≥10 mL"],
          ["0", "Absent: Normal follicular counts and ovarian volume"]
        ])
      ],
      table: {
        headers: ["Phenotype", "Features Present", "Metabolic Risk Profile", "Diagnostic Status"],
        rows: [
          { id: "phenoA", cols: ["Phenotype A (Classic / Full)", "Anovulation + Hyperandrogenism + Polycystic Ovaries (3/3)", "Highest insulin resistance", "PCOS Confirmed"] },
          { id: "phenoB", cols: ["Phenotype B (Non-PCO)", "Anovulation + Hyperandrogenism (2/3, normal US)", "High metabolic risk", "PCOS Confirmed"] },
          { id: "phenoC", cols: ["Phenotype C (Ovulatory)", "Hyperandrogenism + Polycystic Ovaries (2/3, regular cycles)", "Moderate metabolic risk", "PCOS Confirmed"] },
          { id: "phenoD", cols: ["Phenotype D (Non-Androgenic)", "Anovulation + Polycystic Ovaries (2/3, normal androgens)", "Lowest metabolic risk", "PCOS Confirmed"] },
          { id: "notPcos", cols: ["Incomplete Criteria", "Only 0 or 1 criterion satisfied", "Not consistent with PCOS", "PCOS Not Confirmed"] }
        ]
      },
      calc: function (v) {
        var o = +v.oligo, a = +v.hyperandrogen, u = +v.usPco;
        var count = o + a + u;
        var match = "notPcos", pheno = "PCOS Criteria Not Met (<2 criteria satisfied)";

        if (count === 3) {
          match = "phenoA";
          pheno = "PCOS Confirmed — Phenotype A (Full: Oligo/Anovulation + Hyperandrogenism + PCO Morphology)";
        } else if (o === 1 && a === 1) {
          match = "phenoB";
          pheno = "PCOS Confirmed — Phenotype B (Oligo/Anovulation + Hyperandrogenism)";
        } else if (a === 1 && u === 1) {
          match = "phenoC";
          pheno = "PCOS Confirmed — Phenotype C (Ovulatory: Hyperandrogenism + PCO Morphology)";
        } else if (o === 1 && u === 1) {
          match = "phenoD";
          pheno = "PCOS Confirmed — Phenotype D (Non-androgenic: Oligo/Anovulation + PCO Morphology)";
        }

        return {
          value: pheno,
          matchId: match,
          eq: "Rotterdam 2003 / International 2023 Criteria: Requires ≥2 of 3 features after secondary etiologies have been excluded."
        };
      }
    },

    // ==============================================================
    // 9. RISK OF MALIGNANCY INDEX (RMI I) FOR ADNEXAL MASSES
    // ==============================================================
    {
      id: "rmiOvarianCancer",
      cat: "obgyn",
      type: "class",
      name: "Risk of Malignancy Index (RMI I) for Adnexal Masses",
      desc: "Combines ultrasound characteristics, menopausal status, and CA-125 level to evaluate ovarian malignancy.",
      organ: "Ovary / Adnexa",
      region: "Female Pelvis",
      subject: "Gynaecologic Oncology / Pelvic Mass",
      keywords: ["rmi", "ovary", "ovarian cancer", "adnexal mass", "ca125", "ultrasound", "menopause", "malignancy", "gyne-onc"],
      guidance: "1. Determine menopausal status (Premenopausal M=1, Postmenopausal M=3).\n2. Count ultrasound score.\n3. Enter serum CA-125 in U/mL.\n4. Calculate RMI = U × M × CA-125.",
      contraindications: "Serum CA-125 is frequently elevated in benign premenopausal conditions.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "A risk of malignancy index incorporating CA 125, ultrasound and menopausal status for ovarian cancer",
          citation: "Jacobs I, Oram D, Fairbanks J, et al. Br J Obstet Gynaecol. 1990;97(10):922-929.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/2223684/" }
          ]
        }
      ],
      fields: [
        makeS("meno", "Menopausal Status", "post", [
          ["pre", "Premenopausal (M = 1)"],
          ["post", "Postmenopausal (M = 3)"]
        ]),
        makeS("usFeatures", "Ultrasound Features (multilocular, solid components, bilateral, ascites, mets)", "2", [
          ["0", "0 features (U = 0)"],
          ["1", "1 feature (U = 1)"],
          ["2", "≥ 2 features (U = 3)"]
        ]),
        makeN("ca125", "Serum CA-125 Level (U/mL)", 125, { min: 1, max: 10000, step: 1 })
      ],
      table: {
        headers: ["RMI Score Range", "Malignancy Probability", "Clinical Risk Group", "Recommended Pathway"],
        rows: [
          { id: "low", cols: ["RMI < 25", "< 3%", "Low Risk", "General gynaecology follow-up or conservative laparoscopic surgery"] },
          { id: "mod", cols: ["RMI 25 – 200", "10 – 20%", "Intermediate Risk", "Pelvic MRI / CT abdomen-pelvis, specialized gynaecologist review"] },
          { id: "high", cols: ["RMI > 200", "70 – 85%", "HIGH RISK of Malignancy", "Urgent referral to multidisciplinary Gynaecologic Oncology Centre"] }
        ]
      },
      calc: function (v) {
        var m = v.meno === "post" ? 3 : 1;
        var u = v.usFeatures === "0" ? 0 : v.usFeatures === "1" ? 1 : 3;
        var rmi = Math.round(u * m * +v.ca125);

        var match = "low";
        var rec = "Low risk adnexal mass. Conservative management.";
        if (rmi > 200) {
          match = "high";
          rec = "HIGH RISK FOR OVARIAN CANCER (RMI > 200). Urgent staging CT and referral to Gynaecologic Oncology.";
        } else if (rmi >= 25) {
          match = "mod";
          rec = "Moderate risk adnexal mass. Recommend pelvic MRI.";
        }

        return {
          value: "RMI Score: " + rmi,
          matchId: match,
          eq: "Formula: RMI = Ultrasound (" + u + ") × Menopause (" + m + ") × CA-125 (" + v.ca125 + " U/mL).\n" + rec
        };
      }
    },

    // ==============================================================
    // 10. FIGO CERVICAL CANCER STAGING (2018 REVISED)
    // ==============================================================
    {
      id: "figoCervicalCancer",
      cat: "obgyn",
      type: "class",
      name: "FIGO Cervical Cancer Staging (2018)",
      desc: "Anatomical stage classification for carcinoma of the cervix incorporating imaging and pathological findings.",
      organ: "Cervix / Vagina / Pelvic Lymph Nodes",
      region: "Female Reproductive Pelvis",
      subject: "Gynaecologic Oncology / Cervical Cancer",
      keywords: ["cervix", "cervical cancer", "figo", "staging", "gyne-onc", "hpv", "parametrium", "brachytherapy", "hysterectomy"],
      guidance: "1. Perform clinical pelvic examination, EUA, and imaging (MRI/PET-CT).\n2. Note primary tumor dimensions.\n3. Assess vaginal and parametrial involvement.\n4. Screen for lymphadenopathy.",
      contraindications: "Does not apply to primary vaginal carcinomas.",
      literature: [
        {
          type: "Official FIGO Staging Guidelines",
          icon: "📘",
          title: "Revised FIGO staging for carcinoma of the cervix uteri",
          citation: "Bhatla N, Berek JS, Cuello Fredes M, et al. Int J Gynaecol Obstet. 2019;145(1):129-135.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/30656682/" }
          ]
        }
      ],
      fields: [
        makeS("extent", "Primary Tumor Extension (Local/Regional)", "IB1", [
          ["IA1", "Stage IA1: Microscopic stromal invasion < 3 mm depth"],
          ["IA2", "Stage IA2: Stromal invasion ≥ 3 mm and < 5 mm depth"],
          ["IB1", "Stage IB1: Invasive lesion ≥ 5 mm depth and < 2.0 cm largest dimension"],
          ["IB2", "Stage IB2: Invasive lesion 2.0 cm to < 4.0 cm dimension"],
          ["IB3", "Stage IB3: Invasive lesion ≥ 4.0 cm largest dimension"],
          ["IIA", "Stage IIA: Vaginal involvement (upper two-thirds) without parametrial invasion"],
          ["IIB", "Stage IIB: Parametrial invasion (does not reach pelvic sidewall)"],
          ["IIIA", "Stage IIIA: Involvement of lower third of vagina"],
          ["IIIB", "Stage IIIB: Extension to pelvic sidewall and/or hydronephrosis"],
          ["IVA", "Stage IVA: Biopsy-proven spread to mucosa of bladder or rectum"],
          ["IVB", "Stage IVB: Distant organ metastases beyond pelvis"]
        ]),
        makeS("nodes", "Lymph Node Status (Radiological or Pathological)", "none", [
          ["none", "No metastatic pelvic or para-aortic lymph nodes detected"],
          ["pelvic", "Pelvic lymph node metastasis (upgrades to Stage IIIC1)"],
          ["paraaortic", "Para-aortic lymph node metastasis (upgrades to Stage IIIC2)"]
        ])
      ],
      table: {
        headers: ["FIGO Stage", "Anatomical Criteria", "Standard Clinical Treatment Approach"],
        rows: [
          { id: "IA1", cols: ["Stage IA1", "Microscopic invasion < 3 mm depth", "Fertility-sparing conization or simple total hysterectomy"] },
          { id: "IA2_IB1", cols: ["Stage IA2 / IB1", "Invasion < 2 cm", "Radical hysterectomy + bilateral pelvic lymphadenectomy OR radical trachelectomy"] },
          { id: "IB2_IIA1", cols: ["Stage IB2 / IIA1", "Invasion 2 to < 4 cm", "Radical hysterectomy or concurrent chemoradiation"] },
          { id: "locallyAdvanced", cols: ["Stage IB3, IIB, III, IVA", "Tumor ≥ 4 cm, parametrial invasion, or pelvic wall", "Definitive concurrent chemoradiotherapy (Cisplatin + EBRT + intracavitary brachytherapy)"] },
          { id: "distant", cols: ["Stage IVB", "Distant metastatic spread", "Systemic chemotherapy + immunotherapy + palliative RT"] }
        ]
      },
      calc: function (v) {
        var finalStage = v.extent;
        var match = "locallyAdvanced";

        if (v.nodes === "pelvic" && !v.extent.startsWith("IV")) {
          finalStage = "Stage IIIC1 (Pelvic lymph node metastasis)";
        } else if (v.nodes === "paraaortic" && !v.extent.startsWith("IV")) {
          finalStage = "Stage IIIC2 (Para-aortic lymph node metastasis)";
        }

        if (finalStage === "IA1") match = "IA1";
        else if (finalStage === "IA2" || finalStage === "IB1") match = "IA2_IB1";
        else if (finalStage === "IB2") match = "IB2_IIA1";
        else if (finalStage === "IVB") match = "distant";

        return {
          value: "FIGO: " + finalStage,
          matchId: match,
          eq: "Management determined by stage. Under 2018 FIGO rules, nodal metastases categorize the tumor as Stage IIIC."
        };
      }
    },

    // ==============================================================
    // 11. GANZONI FORMULA (IRON DEFICIT CALCULATOR)
    // ==============================================================
    {
      id: "ganzoniFormula",
      cat: "obgyn",
      type: "calc",
      name: "Iron Deficit Calculator (Ganzoni Formula)",
      desc: "Calculates total parenteral elemental iron requirement for severe iron deficiency anemia in pregnancy.",
      organ: "Bone Marrow / Hematopoietic / Placenta",
      region: "Systemic / Obstetric Hematology",
      subject: "Obstetric Hematology / Anemia",
      keywords: ["ganzoni", "iron", "anemia", "ferric carboxymaltose", "iron sucrose", "hemoglobin", "pregnancy anemia", "depot"],
      guidance: "1. Obtain actual weight (kg).\n2. Enter current venous hemoglobin (g/dL).\n3. Standard target in pregnancy: 11.0 g/dL.\n4. Standard depot iron in pregnancy: 500 mg.",
      contraindications: "Contraindicated in 1st trimester of pregnancy, active systemic infection, or iron overload.",
      literature: [
        {
          type: "Historical Landmark Paper",
          icon: "📄",
          title: "Intravenous iron-dextran: therapeutic and experimental possibilities",
          citation: "Ganzoni AM. Schweiz Med Wochenschr. 1970;100(46):1962-1963.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/5487770/" }
          ]
        }
      ],
      fields: [
        makeN("weight", "Actual Body Weight (kg)", 62, { min: 30, max: 200, step: 0.5 }),
        makeN("actualHb", "Current Hemoglobin (g/dL)", 8.4, { min: 3.0, max: 16.0, step: 0.1 }),
        makeN("targetHb", "Target Hemoglobin (g/dL)", 11.0, { min: 10.0, max: 14.0, step: 0.1 }),
        makeN("depot", "Iron Depot Stores (mg)", 500, { min: 0, max: 1000, step: 50 })
      ],
      calc: function (v) {
        var wt = +v.weight, curHb = +v.actualHb, tgtHb = +v.targetHb, depot = +v.depot;
        var deficit = (wt * (tgtHb - curHb) * 2.4) + depot;
        var roundedDeficit = Math.max(0, Math.round(deficit));
        var fcmVials500 = Math.ceil(roundedDeficit / 500);

        return {
          value: roundedDeficit + " mg Elemental Iron Deficit",
          eq: "Ganzoni Equation:\nTotal Deficit (mg) = [Weight (kg) × (Target Hb − Actual Hb) × 2.4] + Depot (" + depot + " mg).\n\nParenteral Administration Equivalents:\n• Ferric Carboxymaltose (FCM): ~" + fcmVials500 + " vial(s) of 500 mg IV infusion."
        };
      }
    },

    // ==============================================================
    // 12. MANNING'S BIOPHYSICAL PROFILE (BPP)
    // ==============================================================
    {
      id: "manningBpp",
      cat: "obgyn",
      type: "class",
      name: "Manning Biophysical Profile (BPP)",
      desc: "Antenatal fetal surveillance combining ultrasound assessment of 4 biophysical variables with Non-Stress Test (NST).",
      organ: "Fetus / Placenta / Amniotic Sac",
      region: "Obstetric Ultrasound / Antenatal Fetal Assessment",
      subject: "Maternal-Fetal Medicine / Antenatal Surveillance",
      keywords: ["bpp", "manning", "biophysical profile", "nst", "fetal breathing", "amniotic fluid", "fetal movement", "fetal tone", "antenatal surveillance"],
      guidance: "1. Perform dynamic ultrasound for at least 30 minutes.\n2. Score 5 parameters as either 2 (Normal) or 0 (Abnormal):\n   - Non-Stress Test: ≥2 accelerations (≥15 bpm for ≥15 sec) in 20–40 min.\n   - Fetal Breathing: ≥1 episode of rhythmic breathing lasting ≥30 seconds.\n   - Fetal Movement: ≥3 discrete body or limb movements.\n   - Fetal Tone: ≥1 episode of active extension with return to flexion, or opening/closing of hand.\n   - Amniotic Fluid: ≥1 single vertical pocket ≥2 cm × 1 cm.\n3. Maximum score is 10 points (or 8/8 if ultrasound alone without NST).",
      contraindications: "Transient suppression of biophysical activities may occur with maternal administration of magnesium sulfate, corticosteroids, narcotics, or during physiological fetal sleep cycles (extend examination up to 40–60 minutes).",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Antepartum fetal evaluation: development of a fetal biophysical profile",
          citation: "Manning FA, Platt LD, Sipos L. Am J Obstet Gynecol. 1980;136(6):787-795.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/7355965/" }
          ]
        },
        {
          type: "ACOG Practice Bulletin",
          icon: "📘",
          title: "ACOG Practice Bulletin No. 229: Antepartum Fetal Surveillance",
          citation: "American College of Obstetricians and Gynecologists. Obstet Gynecol. 2021;137(6):e116-e127.",
          links: [
            { text: "View Guideline (PubMed) ↗", url: "https://pubmed.ncbi.nlm.nih.gov/34011892/" }
          ]
        }
      ],
      fields: [
        makeS("nst", "1. Non-Stress Test (NST)", "2", [
          ["2", "Reactive: ≥2 accelerations (≥15 bpm for ≥15 sec) in 20–40 min (2 pts)"],
          ["0", "Non-reactive: <2 accelerations in 40 min (0 pts)"]
        ]),
        makeS("fbm", "2. Fetal Breathing Movements", "2", [
          ["2", "Present: ≥1 episode of continuous breathing ≥30 sec in 30 min (2 pts)"],
          ["0", "Absent or <30 sec of continuous breathing in 30 min (0 pts)"]
        ]),
        makeS("fm", "3. Gross Fetal Body Movements", "2", [
          ["2", "Present: ≥3 discrete body/limb movements in 30 min (2 pts)"],
          ["0", "Decreased: ≤2 body/limb movements in 30 min (0 pts)"]
        ]),
        makeS("ft", "4. Fetal Muscle Tone", "2", [
          ["2", "Normal: ≥1 episode of active limb extension with return to flexion (2 pts)"],
          ["0", "Decreased/Absent: Slow extension without return, or completely flaccid (0 pts)"]
        ]),
        makeS("afv", "5. Amniotic Fluid Volume (AFV)", "2", [
          ["2", "Adequate: Single deepest vertical pocket ≥2 cm × 1 cm (2 pts)"],
          ["0", "Oligohydramnios: Largest vertical pocket <2 cm (0 pts)"]
        ])
      ],
      table: {
        headers: ["BPP Score", "Fetal Acidosis Risk", "Clinical Interpretation", "Management Action"],
        rows: [
          { id: "normal", cols: ["Score 8/10 or 10/10", "Minimal risk (<1/1000 stillbirth in 1 wk)", "Normal non-hypoxic fetus", "Repeat testing weekly or per protocol; continue prenatal care"] },
          { id: "equivocal", cols: ["Score 6/10", "Possible fetal asphyxia / indeterminate", "Equivocal fetal status", "Repeat test within 12–24 hours; if oligohydramnios present or ≥37 weeks, consider delivery"] },
          { id: "abnormalLow", cols: ["Score 4/10", "High probability of fetal acidemia", "Abnormal / Fetal compromise", "Strong consideration for delivery if gestational age ≥32 weeks; intensive inpatient monitoring"] },
          { id: "severeHypoxia", cols: ["Score 0/10 to 2/10", "Almost certain severe fetal asphyxia", "Severe fetal compromise", "Immediate delivery indicated after maternal stabilization"] }
        ]
      },
      calc: function (v) {
        var total = +v.nst + +v.fbm + +v.fm + +v.ft + +v.afv;
        var afvNormal = +v.afv === 2;
        var match = "normal";
        var interp = "Normal BPP score (" + total + "/10). Low risk of fetal acidemia or chronic asphyxia.";

        if (total <= 2) {
          match = "severeHypoxia";
          interp = "Severe fetal compromise (Score " + total + "/10). High risk of fetal death/acidemia. Urgent delivery indicated.";
        } else if (total === 4) {
          match = "abnormalLow";
          interp = "Abnormal BPP (Score 4/10). High likelihood of chronic asphyxia. Hospitalize and plan delivery if mature.";
        } else if (total === 6) {
          match = "equivocal";
          interp = "Equivocal BPP (Score 6/10). If oligohydramnios is present, delivery is indicated. Otherwise repeat in 12–24 hours.";
        } else if (total >= 8 && !afvNormal) {
          match = "equivocal";
          interp = "Score " + total + "/10, BUT oligohydramnios is present. Chronic placental insufficiency suspected; delivery indicated at term.";
        }

        return {
          value: "Manning BPP: " + total + " / 10 Points",
          matchId: match,
          eq: interp
        };
      }
    },

    // ==============================================================
    // 13. AMNIOTIC FLUID ASSESSMENT (AFI & SDP / MVP)
    // ==============================================================
    {
      id: "amnioticFluidAssessment",
      cat: "obgyn",
      type: "class",
      name: "Amniotic Fluid Assessment (AFI & SDP / MVP)",
      desc: "Classifies amniotic fluid volume into oligohydramnios, normal, or polyhydramnios using AFI and Single Deepest Pocket (SDP).",
      organ: "Placenta / Amniotic Sac / Fetus",
      region: "Obstetric Ultrasound",
      subject: "Obstetric Ultrasound / Maternal-Fetal Medicine",
      keywords: ["amniotic fluid", "afi", "sdp", "mvp", "oligohydramnios", "polyhydramnios", "deepest pocket", "ultrasound"],
      guidance: "1. Ultrasound probe held perpendicular to the maternal abdomen.\n2. AFI: Sum of the deepest vertical pocket in each of 4 uterine quadrants (free of umbilical cord or fetal small parts).\n3. SDP (Single Deepest Pocket): Vertical dimension of the single largest clear amniotic pocket.\n4. Note: SMFM recommends SDP over AFI for diagnosing oligohydramnios to avoid unnecessary obstetric interventions.",
      contraindications: "Avoid measuring pockets crowded by fetal limbs or containing loops of umbilical cord (verify with Color Doppler).",
      literature: [
        {
          type: "SMFM Consult Series",
          icon: "📘",
          title: "Society for Maternal-Fetal Medicine Consult Series #46: Evaluation and management of polyhydramnios",
          citation: "SMFM, Reddy UM, Abuhamad A, Levine D, et al. Am J Obstet Gynecol. 2018;219(6):B2-B8.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/30312604/" }
          ]
        },
        {
          type: "Cochrane Systematic Review",
          icon: "📄",
          title: "Amniotic fluid index versus single deepest vertical pocket as a screening test for preventing adverse pregnancy outcome",
          citation: "Nabhan AF, Abdelmoula YA. Cochrane Database Syst Rev. 2008;(3):CD006593.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/18646158/" }
          ]
        }
      ],
      fields: [
        makeN("afi", "Amniotic Fluid Index (AFI, cm)", 14.0, { min: 0, max: 45, step: 0.5 }),
        makeN("sdp", "Single Deepest Pocket (SDP / MVP, cm)", 4.5, { min: 0, max: 20, step: 0.1 })
      ],
      table: {
        headers: ["Amniotic Fluid Status", "AFI Diagnostic Criteria", "SDP Diagnostic Criteria", "Obstetric Implications"],
        rows: [
          { id: "oligo", cols: ["Oligohydramnios", "AFI < 5.0 cm", "SDP < 2.0 cm", "Increased risk of umbilical cord compression, meconium aspiration, fetal renal anomalies, or PROM"] },
          { id: "lowNorm", cols: ["Borderline / Low Normal", "AFI 5.0 – 8.0 cm", "SDP 2.0 – 3.0 cm", "Increased surveillance indicated; repeat AFI/SDP in 3–7 days with fetal growth check"] },
          { id: "normal", cols: ["Normal Amniotic Fluid", "AFI 8.1 – 24.0 cm", "SDP 2.1 – 7.9 cm", "Normal physiological amniotic fluid volume"] },
          { id: "poly", cols: ["Polyhydramnios", "AFI ≥ 25.0 cm", "SDP ≥ 8.0 cm", "Associated with gestational diabetes, twin-twin transfusion, fetal GI atresia, aneuploidy; risk of PPH and cord prolapse"] }
        ]
      },
      calc: function (v) {
        var afi = +v.afi, sdp = +v.sdp;
        var match = "normal";
        var title = "Normal Amniotic Fluid Volume";
        var detail = "AFI and SDP are within standard normal physiological limits.";

        if (sdp < 2.0 || afi < 5.0) {
          match = "oligo";
          title = "Oligohydramnios";
          detail = "Oligohydramnios detected (SDP < 2 cm or AFI < 5 cm). Evaluate for membrane rupture (PROM), uteroplacental insufficiency, post-term pregnancy, or fetal genitourinary abnormalities.";
        } else if (sdp >= 8.0 || afi >= 25.0) {
          match = "poly";
          title = "Polyhydramnios";
          detail = "Polyhydramnios detected (SDP ≥ 8 cm or AFI ≥ 25 cm). Screen for gestational diabetes, fetal congenital anomalies (esophageal/duodenal atresia, anencephaly), and maternal torch infections.";
        } else if (afi <= 8.0) {
          match = "lowNorm";
          title = "Borderline Oligohydramnios";
          detail = "Borderline low amniotic fluid (AFI 5.0–8.0 cm). Ensure maternal hydration and repeat ultrasound testing within 1 week.";
        }

        return {
          value: title + " (AFI: " + afi + " cm | SDP: " + sdp + " cm)",
          matchId: match,
          eq: detail
        };
      }
    },

    // ==============================================================
    // 14. FETAL DOPPLER FLOW SURVEILLANCE
    // ==============================================================
    {
      id: "fetalDopplerSurveillance",
      cat: "obgyn",
      type: "class",
      name: "Fetal Doppler Flow Surveillance (UA, MCA, DV)",
      desc: "Classifies severity of placental insufficiency and fetal hypoxia using Umbilical Artery, MCA, and Ductus Venosus Doppler waveforms.",
      organ: "Placenta / Fetal Vasculature / Brain / Heart",
      region: "Obstetric Ultrasound / Fetal Doppler",
      subject: "Fetal Medicine / High-Risk Obstetrics",
      keywords: ["doppler", "umbilical artery", "mca", "ductus venosus", "aedv", "redv", "brain sparing", "fgr", "placental insufficiency"],
      guidance: "1. Sample free loop of Umbilical Artery during fetal quiescence without breathing movements (insonation angle <30°).\n2. Sample Middle Cerebral Artery (MCA) in axial plane at level of circle of Willis, measuring Peak Systolic Velocity (PSV) and Pulsatility Index (PI).\n3. Sample Ductus Venosus (DV) in sagittal or oblique plane at the inlet to the inferior vena cava.",
      contraindications: "Fetal breathing movements dramatically alter venous and arterial waveforms; measurements during fetal respiration are invalid.",
      literature: [
        {
          type: "ISUOG Practice Guideline",
          icon: "📘",
          title: "ISUOG Practice Guidelines: use of Doppler ultrasonography in obstetrics",
          citation: "Bhide A, Acharya G, Bilardo CM, et al. Ultrasound Obstet Gynecol. 2013;41(2):233-239.",
          links: [
            { text: "View Guideline (DOI) ↗", url: "https://doi.org/10.1002/uog.12371" },
            { text: "PubMed ID ↗", url: "https://pubmed.ncbi.nlm.nih.gov/23371348/", secondary: true }
          ]
        },
        {
          type: "TRUFFLE Study",
          icon: "📄",
          title: "2-year neurodevelopmental outcome in early fetal growth restriction (TRUFFLE)",
          citation: "Lees CC, Marlow N, van Wassenaer-Leemhuis A, et al. Lancet. 2015;385(9983):2162-2172.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/25765696/" }
          ]
        }
      ],
      fields: [
        makeS("ua", "1. Umbilical Artery (UA) End-Diastolic Flow", "normal", [
          ["normal", "Normal Positive End-Diastolic Flow (Normal PI)"],
          ["elevated", "Elevated PI (>95th percentile) with positive diastolic flow"],
          ["aedv", "Absent End-Diastolic Velocity (AEDV)"],
          ["redv", "Reversed End-Diastolic Velocity (REDV)"]
        ]),
        makeS("mca", "2. Middle Cerebral Artery (MCA) PI / Brain Sparing", "normal", [
          ["normal", "Normal PI (>5th percentile, no cerebral redistribution)"],
          ["sparing", "Brain Sparing: Low PI (<5th percentile, vasodilation)"],
          ["anemia", "Elevated MCA-PSV > 1.5 MoM (Suspicious for Fetal Anemia)"]
        ]),
        makeS("dv", "3. Ductus Venosus (DV) Waveform", "normal", [
          ["normal", "Normal positive forward a-wave (atrial contraction)"],
          ["elevated", "Elevated DV-PI (>95th percentile) with positive a-wave"],
          ["absentRev", "Absent or Reversed a-wave (Atrial flow reversal)"]
        ])
      ],
      table: {
        headers: ["Doppler Stage", "Hemodynamic Pathology", "Surveillance Frequency", "Delivery Recommendation"],
        rows: [
          { id: "normal", cols: ["Stage 0: Normal Doppler", "Normal placental resistance and normal cerebral flow", "Routine weekly to bi-weekly Doppler", "Standard obstetric indications"] },
          { id: "mild", cols: ["Stage I: Placental Insufficiency", "UA-PI >95th percentile OR MCA-PI <5th %ile (Brain Sparing)", "Twice-weekly UA Doppler, weekly amniotic fluid check", "Delivery at 37+0 weeks (or earlier if preeclampsia decompensates)"] },
          { id: "severe", cols: ["Stage II: Severe Placental Failure", "UA Absent End-Diastolic Velocity (AEDV)", "Daily or alternate-day Doppler + inpatient cCTG", "Delivery at ≥33–34 weeks; administer antenatal corticosteroids"] },
          { id: "critical", cols: ["Stage III / IV: Fetal Acidemia / Failure", "UA Reversed Flow (REDV) OR Ductus Venosus Absent/Reversed a-wave", "Continuous/Frequent cCTG monitoring in specialized tertiary NICU center", "Urgent delivery: REDV at ≥30–32 wks; DV absent/reversed a-wave at ≥28–30 wks"] }
        ]
      },
      calc: function (v) {
        var ua = v.ua, mca = v.mca, dv = v.dv;
        var stage = "normal", title = "Stage 0: Normal Fetal Doppler Profile", rec = "Reassuring feto-placental circulation.";

        if (dv === "absentRev" || ua === "redv") {
          stage = "critical";
          title = "Stage III / IV: Critical Fetal Compromise / Imminent Acidemia";
          rec = "CRITICAL: Fetal myocardial decompensation with high risk of intrauterine demise. Immediate maternal corticosteroid administration and delivery at specialized tertiary center (REDV at ≥30–32 wks; DV a-wave reversal at ≥28–30 wks).";
        } else if (ua === "aedv") {
          stage = "severe";
          title = "Stage II: Severe Placental Insufficiency (UA AEDV)";
          rec = "Severe placental vascular obliteration (>70% of placental bed obliterated). Inpatient admission, daily CTG/Doppler surveillance, and delivery planned at 33–34 weeks gestation.";
        } else if (ua === "elevated" || mca === "sparing") {
          stage = "mild";
          title = "Stage I: Mild Placental Insufficiency / Brain Sparing";
          rec = "Increased placental resistance or cerebral vasodilation (brain sparing). Twice-weekly Doppler surveillance; consider delivery at 37+0 weeks.";
        } else if (mca === "anemia") {
          stage = "mild";
          title = "Suspicious for Moderate-to-Severe Fetal Anemia (MCA-PSV > 1.5 MoM)";
          rec = "Elevated MCA peak systolic velocity. Evaluate for Rh/isoimmunization, Parvovirus B19, or fetomaternal hemorrhage. Urgent referral for fetal cordocentesis/intrauterine blood transfusion.";
        }

        return {
          value: title,
          matchId: stage,
          eq: rec
        };
      }
    },

    // ==============================================================
    // 15. MODIFIED EARLY OBSTETRIC WARNING SYSTEM (MEOWS)
    // ==============================================================
    {
      id: "meowsScore",
      cat: "obgyn",
      type: "class",
      name: "Modified Early Obstetric Warning System (MEOWS)",
      desc: "Standardized physiological bedside track-and-trigger score to detect early clinical deterioration, maternal sepsis, and shock.",
      organ: "Cardiovascular / Respiratory / Neurologic / Systemic",
      region: "Obstetric Inpatient / Delivery Suite",
      subject: "Obstetric Critical Care / Maternal Sepsis",
      keywords: ["meows", "mews", "maternal sepsis", "vital signs", "shock", "early warning", "deterioration", "obstetric emergency"],
      guidance: "1. Record all physiological vitals simultaneously.\n2. Trigger thresholds:\n   - RED TRIGGER: Any single extreme parameter (HR >120 or <50, SBP >160 or <90, DBP >100, RR >30 or <10, Temp >38°C or <35°C, altered consciousness).\n   - YELLOW TRIGGER: 2 or more moderately abnormal parameters.\n3. Escalation: A single Red or two Yellow triggers mandate urgent medical review by an obstetric registrar/senior team.",
      contraindications: "Physiological changes in labor (pain, pushing) alter vitals; clinical contextual judgment required. Does not replace clinical suspicion.",
      literature: [
        {
          type: "CEMACH Landmark Report",
          icon: "📄",
          title: "Saving Mothers' Lives: reviewing maternal deaths to make motherhood safer 2003-2005",
          citation: "Confidential Enquiry into Maternal and Child Health (CEMACH). London: CEMACH; 2007.",
          links: [
            { text: "View Report Info ↗", url: "https://www.oaa-anaes.ac.uk/CEMACH" }
          ]
        },
        {
          type: "Validation Study",
          icon: "📘",
          title: "Validation of a modified early obstetric warning system for the early recognition of developing critical illness",
          citation: "Singh S, McGlennan A, England A, Simons R. Anaesthesia. 2012;67(1):12-18.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/22066604/" }
          ]
        }
      ],
      fields: [
        makeN("hr", "Heart Rate (beats/min)", 88, { min: 30, max: 200, step: 1 }),
        makeN("sbp", "Systolic BP (mmHg)", 118, { min: 50, max: 260, step: 1 }),
        makeN("dbp", "Diastolic BP (mmHg)", 74, { min: 30, max: 150, step: 1 }),
        makeN("rr", "Respiratory Rate (breaths/min)", 16, { min: 6, max: 60, step: 1 }),
        makeN("temp", "Temperature (°C)", 37.0, { min: 32.0, max: 42.0, step: 0.1 }),
        makeS("neuro", "Neurological Consciousness (AVPU)", "A", [
          ["A", "Alert (A)"],
          ["V", "Responsive to Voice (V)"],
          ["P", "Responsive to Pain (P)"],
          ["U", "Unresponsive (U)"]
        ]),
        makeS("lochia", "Lochia / Vaginal Bleeding", "normal", [
          ["normal", "Normal physiologic lochia / minimal bleeding"],
          ["heavy", "Heavy bleeding / clots / offensive lochia"]
        ])
      ],
      table: {
        headers: ["MEOWS Alert Level", "Trigger Criteria", "Clinical Significance", "Mandatory Escalation Action"],
        rows: [
          { id: "normal", cols: ["Green (Normal)", "No trigger thresholds met", "Physiological stability", "Routine obstetric inpatient observations 4–12 hourly"] },
          { id: "yellow", cols: ["Yellow Alert", "Single mildly abnormal parameter", "Potential early disturbance", "Increase observation frequency to 1–2 hourly; investigate source"] },
          { id: "red", cols: ["RED ALERT", "≥1 RED trigger OR ≥2 YELLOW triggers", "Probable critical illness / severe sepsis / occult haemorrhage", "IMMEDIATE review by Obstetric Registrar & Anaesthetist; commence Sepsis 6 protocol if febrile"] }
        ]
      },
      calc: function (v) {
        var hr = +v.hr, sbp = +v.sbp, dbp = +v.dbp, rr = +v.rr, t = +v.temp;
        var reds = 0, yellows = 0;
        var redReasons = [], yellowReasons = [];

        if (hr < 50 || hr > 120) { reds++; redReasons.push("HR " + hr); }
        else if ((hr >= 50 && hr < 60) || (hr > 100 && hr <= 120)) { yellows++; yellowReasons.push("HR " + hr); }

        if (sbp < 90 || sbp >= 160) { reds++; redReasons.push("SBP " + sbp); }
        else if ((sbp >= 90 && sbp < 100) || (sbp >= 140 && sbp < 160)) { yellows++; yellowReasons.push("SBP " + sbp); }

        if (dbp >= 100) { reds++; redReasons.push("DBP " + dbp); }
        else if (dbp >= 90 && dbp < 100) { yellows++; yellowReasons.push("DBP " + dbp); }

        if (rr < 10 || rr > 30) { reds++; redReasons.push("RR " + rr); }
        else if ((rr >= 10 && rr < 12) || (rr >= 21 && rr <= 30)) { yellows++; yellowReasons.push("RR " + rr); }

        if (t < 35.0 || t >= 38.0) { reds++; redReasons.push("Temp " + t + "°C"); }
        else if (t >= 37.5 && t < 38.0) { yellows++; yellowReasons.push("Temp " + t + "°C"); }

        if (v.neuro !== "A") { reds++; redReasons.push("AVPU: " + v.neuro); }
        if (v.lochia === "heavy") { yellows++; yellowReasons.push("Abnormal lochia"); }

        var match = "normal", title = "MEOWS Normal: Physiological Vitals Stable", act = "Maintain routine ward observations.";

        if (reds >= 1 || yellows >= 2) {
          match = "red";
          title = "MEOWS RED TRIGGER (Reds: " + reds + ", Yellows: " + yellows + ")";
          act = "CRITICAL ALERT: Immediate bedside review by Senior Obstetrician and Anaesthetist within 15 minutes. Evaluate for maternal sepsis, severe preeclampsia, or concealed hemorrhage. Reasons: " + redReasons.concat(yellowReasons).join("; ") + ".";
        } else if (yellows === 1) {
          match = "yellow";
          title = "MEOWS Yellow Trigger (Single abnormal parameter)";
          act = "Mild warning trigger (" + yellowReasons.join(", ") + "). Repeat observations in 30–60 minutes. Inform charge midwife.";
        }

        return {
          value: title,
          matchId: match,
          eq: act
        };
      }
    },

    // ==============================================================
    // 16. GROBMAN VBAC SUCCESS PREDICTOR
    // ==============================================================
    {
      id: "grobmanVbac",
      cat: "obgyn",
      type: "calc",
      name: "VBAC / TOLAC Success Predictor (Grobman Model)",
      desc: "Multivariable logistic regression predicting probability of successful vaginal birth after one prior low-transverse cesarean delivery.",
      organ: "Uterus / Pelvis",
      region: "Obstetric / Antenatal Clinic",
      subject: "Obstetrics / Labour & Delivery",
      keywords: ["vbac", "tolac", "grobman", "cesarean", "uterine rupture", "trial of labour", "repeat cesarean"],
      guidance: "1. Valid for women with one prior low-transverse cesarean delivery attempting TOLAC.\n2. Enter maternal age, pre-pregnancy BMI, prior vaginal delivery history, and indication for the prior cesarean.\n3. A predicted success probability ≥60–70% is generally considered favourable by ACOG guidelines.",
      contraindications: "Contraindicated in women with prior classical, T-shaped, or inverted-T uterine incisions, prior extensive uterine rupture, or absolute contraindications to vaginal delivery (e.g., placenta praevia).",
      literature: [
        {
          type: "Seminal Multicenter Study",
          icon: "📄",
          title: "Development of a nomogram for prediction of vaginal birth after cesarean delivery",
          citation: "Grobman WA, Lai Y, Landon MB, et al. Obstet Gynecol. 2007;109(4):806-812.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/17400840/" }
          ]
        },
        {
          type: "ACOG Practice Bulletin",
          icon: "📘",
          title: "ACOG Practice Bulletin No. 205: Vaginal Birth After Cesarean Delivery",
          citation: "American College of Obstetricians and Gynecologists. Obstet Gynecol. 2019;133(2):e110-e127.",
          links: [
            { text: "View Guideline (DOI) ↗", url: "https://doi.org/10.1097/AOG.0000000000003078" }
          ]
        }
      ],
      fields: [
        makeN("age", "Maternal Age (years)", 29, { min: 16, max: 50, step: 1 }),
        makeN("bmi", "Pre-Pregnancy BMI (kg/m²)", 26.5, { min: 15, max: 60, step: 0.1 }),
        makeS("priorVag", "Prior Vaginal Delivery (ever)?", "1", [
          ["1", "Yes (Prior vaginal delivery, before or after CS)"],
          ["0", "No prior vaginal delivery"]
        ]),
        makeS("vbacPrior", "Vaginal Delivery AFTER prior Cesarean (VBAC history)?", "0", [
          ["1", "Yes: Has had successful VBAC previously"],
          ["0", "No: No prior VBAC"]
        ]),
        makeS("indicationArrest", "Indication for Prior CS: Recurring Dystocia / Arrest of Labor?", "0", [
          ["1", "Yes: Prior CS was for cephalopelvic disproportion, failure to progress, or arrest of dilation/descent"],
          ["0", "No: Prior CS was for non-recurrent indication (breech presentation, fetal distress, herpes, etc.)"]
        ])
      ],
      table: {
        headers: ["Predicted VBAC Probability", "Clinical Category", "Shared Decision-Making Guidance"],
        rows: [
          { id: "high", cols: ["Probability ≥ 75%", "Highly Favourable Candidate", "TOLAC has high success odds comparable to multiparous labor; lowest maternal morbidity when successful"] },
          { id: "mod", cols: ["Probability 60% – 74%", "Acceptable / Favourable Candidate", "ACOG guidelines support trial of labor with continuous electronic fetal monitoring and rapid OR availability"] },
          { id: "low", cols: ["Probability < 60%", "Higher Risk of Failed TOLAC", "Increased risk of emergency intrapartum cesarean and associated complications; discuss elective repeat CS (ERCS) at 39 weeks"] }
        ]
      },
      calc: function (v) {
        var age = +v.age, bmi = +v.bmi;
        var priorVag = +v.priorVag, vbacPrior = +v.vbacPrior, arrest = +v.indicationArrest;

        var logit = 2.659 - (0.040 * age) - (0.052 * bmi) + (0.915 * priorVag) + (0.630 * vbacPrior) - (0.651 * arrest);
        var prob = Math.round((Math.exp(logit) / (1 + Math.exp(logit))) * 100);

        var match = "high";
        var advice = "Favourable candidacy for trial of labor after cesarean (TOLAC).";
        if (prob < 60) {
          match = "low";
          advice = "Suboptimal predicted TOLAC success rate (<60%). Detailed counselling regarding maternal-fetal risks of emergency intrapartum cesarean versus elective repeat cesarean (ERCS).";
        } else if (prob < 75) {
          match = "mod";
          advice = "Acceptable TOLAC success probability (60–74%). Encourage shared decision-making with continuous intrapartum fetal monitoring.";
        }

        return {
          value: "Predicted VBAC Success: " + prob + "%",
          matchId: match,
          eq: "Grobman Logistic Regression Model:\nProbability = 1 / (1 + e^-logit)\n" + advice
        };
      }
    },

    // ==============================================================
    // 17. INTRAPARTUM CTG CLASSIFICATION (FIGO / NICHD 3-TIER)
    // ==============================================================
    {
      id: "ctgInterpretation",
      cat: "obgyn",
      type: "class",
      name: "Intrapartum Cardiotocography (FIGO / NICHD 3-Tier)",
      desc: "Standardized 3-tier fetal heart rate (FHR) categorization to evaluate intrapartum hypoxia and guide delivery timing.",
      organ: "Fetus / Myometrium / Placenta",
      region: "Delivery Suite / Intrapartum Monitoring",
      subject: "Obstetrics / Intrapartum Fetal Monitoring",
      keywords: ["ctg", "fhr", "nichd", "figo", "category i", "category ii", "category iii", "decelerations", "variability", "bradycardia", "tachycardia"],
      guidance: "1. Evaluate baseline fetal heart rate (normal 110–160 bpm).\n2. Assess baseline variability (normal 5–25 bpm).\n3. Screen for decelerations: absent, early (head compression), variable (cord compression), late (uteroplacental insufficiency), or prolonged.\n4. Screen for accelerations (reassuring).",
      contraindications: "External ultrasound transducer can inadvertently double-count maternal heart rate in profound fetal bradycardia (confirm with fetal scalp electrode or maternal pulse oximetry).",
      literature: [
        {
          type: "FIGO Consensus Guideline",
          icon: "📘",
          title: "FIGO consensus guidelines on intrapartum fetal monitoring: Cardiotocography",
          citation: "Ayres-de-Campos D, Spong CY, Chandraharan E, et al. Int J Gynaecol Obstet. 2015;131(1):13-24.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/26433401/" }
          ]
        },
        {
          type: "NICHD Workshop Report",
          icon: "📄",
          title: "The 2008 National Institute of Child Health and Human Development workshop report on electronic fetal monitoring",
          citation: "Macones GA, Hankins GD, Spong CY, et al. Obstet Gynecol. 2008;112(3):661-666.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/18757666/" }
          ]
        }
      ],
      fields: [
        makeS("baseline", "1. Baseline Fetal Heart Rate", "normal", [
          ["normal", "Normal: 110 – 160 bpm"],
          ["tachy", "Tachycardia: > 160 bpm"],
          ["brady", "Bradycardia: < 110 bpm (sustained)"]
        ]),
        makeS("variability", "2. Baseline Variability", "moderate", [
          ["moderate", "Moderate: 5 to 25 bpm (Normal)"],
          ["absent", "Absent: Undetectable amplitude"],
          ["minimal", "Minimal: ≤ 5 bpm (and not absent)"],
          ["marked", "Marked: > 25 bpm"]
        ]),
        makeS("decelerations", "3. Decelerations", "none", [
          ["none", "None or Early Decelerations only (reassuring)"],
          ["variable", "Recurrent Variable Decelerations"],
          ["late", "Recurrent Late Decelerations (uteroplacental insufficiency)"],
          ["prolonged", "Prolonged Deceleration (≥ 2 min but < 10 min)"],
          ["sinusoidal", "Sinusoidal Pattern (smooth, undulating 2-5 cycles/min for ≥20 min)"]
        ])
      ],
      table: {
        headers: ["Category / Tier", "Physiological Significance", "Fetal Acidemia Risk", "Recommended Clinical Management"],
        rows: [
          { id: "cat1", cols: ["Category I (Normal / Reassuring)", "Normal acid-base balance; well-oxygenated fetal nervous system", "Negligible risk of acidemia", "Routine intrapartum care; continue electronic fetal monitoring without resuscitation"] },
          { id: "cat2", cols: ["Category II (Indeterminate)", "Not predictive of abnormal fetal acid-base status; requires continued surveillance", "Low-to-moderate risk of emerging acidemia", "Initiate conservative intrauterine resuscitation (left lateral position, IV fluid bolus, stop oxytocin, check maternal vitals); reassess"] },
          { id: "cat3", cols: ["Category III (Pathological / Abnormal)", "Predictive of abnormal fetal acid-base status, hypoxia, and cerebral acidemia", "Extremely high risk of severe asphyxia / metabolic acidosis", "URGENT RESUSCITATION: Stop oxytocin, give tocolysis (terbutaline), oxygen; prepare for immediate operative delivery if unresolved within 10–15 min"] }
        ]
      },
      calc: function (v) {
        var b = v.baseline, varb = v.variability, dec = v.decelerations;
        var cat = "cat2", name = "Category II (Indeterminate)", mgmt = "Initiate conservative intrauterine resuscitation maneuvers and continuous monitoring.";

        var isCat3 = (dec === "sinusoidal") ||
          (varb === "absent" && (dec === "late" || dec === "variable" || b === "brady"));

        var isCat1 = (b === "normal") && (varb === "moderate") && (dec === "none");

        if (isCat3) {
          cat = "cat3";
          name = "Category III (Pathological / High-Risk)";
          mgmt = "EMERGENCY: Strongly predictive of fetal cerebral hypoxia and metabolic acidosis. Discontinue uterotonics immediately, reposition patient to left lateral, administer rapid IV crystalloid, and expedite immediate operative delivery (cesarean or operative vaginal).";
        } else if (isCat1) {
          cat = "cat1";
          name = "Category I (Normal / Reassuring)";
          mgmt = "Fetal heart rate pattern strongly predictive of normal fetal acid-base status. No specific clinical intervention required; continue standard intrapartum monitoring.";
        }

        return {
          value: name,
          matchId: cat,
          eq: mgmt
        };
      }
    },

    // ==============================================================
    // 18. PERINEAL TEAR CLASSIFICATION (SULTAN CLASSIFICATION)
    // ==============================================================
    {
      id: "perinealTearClassification",
      cat: "obgyn",
      type: "class",
      name: "Perineal Tear Classification (Sultan / RCOG)",
      desc: "Standard international classification of obstetric perineal lacerations and anal sphincter injuries (OASIS).",
      organ: "Perineum / Anal Sphincter / Rectum",
      region: "Obstetric / Delivery Suite",
      subject: "Obstetrics / Perineal Trauma",
      keywords: ["perineal tear", "sultan", "oasis", "episiotomy", "anal sphincter", "rcog", "third degree", "fourth degree", "fecal incontinence"],
      guidance: "1. Perform careful systematic digital rectal examination after all vaginal deliveries before perineal repair.\n2. Verify integrity of external anal sphincter (EAS), internal anal sphincter (IAS), and rectal mucosa.\n3. Third- and fourth-degree tears require repair in an operating theatre by an experienced obstetrician using fine absorbable sutures (PDS/Vicryl) with antibiotic and stool softener prophylaxis.",
      contraindications: "Do not attempt repair of OASIS (3rd/4th degree) in the delivery bed under inadequate local analgesia; regional or general anesthesia in an OR setting is required.",
      literature: [
        {
          type: "Seminal Anatomical Classification",
          icon: "📄",
          title: "Obstetric perineal injury",
          citation: "Sultan AH. Ann R Coll Surg Engl. 1999;81(1):40-44.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/10070440/" }
          ]
        },
        {
          type: "RCOG Green-top Guideline",
          icon: "📘",
          title: "The Management of Third- and Fourth-Degree Perineal Tears (Green-top Guideline No. 29)",
          citation: "Royal College of Obstetricians and Gynaecologists. BJOG. 2015;122(11):e119-e132.",
          links: [
            { text: "View Guideline (RCOG) ↗", url: "https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/management-of-third-and-fourth-degree-perineal-tears-green-top-guideline-no-29/" }
          ]
        }
      ],
      fields: [
        makeS("depth", "Deepest Anatomical Tissue Involved", "2nd", [
          ["1st", "First Degree: Perineal skin / vaginal mucosa only (muscles intact)"],
          ["2nd", "Second Degree: Perineal muscles (bulbospongiosus, perineal body) intact sphincter"],
          ["3a", "Third Degree (3a): < 50% of External Anal Sphincter (EAS) thickness torn"],
          ["3b", "Third Degree (3b): ≥ 50% of External Anal Sphincter (EAS) thickness torn"],
          ["3c", "Third Degree (3c): Both EAS and Internal Anal Sphincter (IAS) torn"],
          ["4th", "Fourth Degree: Both EAS and IAS torn + anal/rectal epithelium breached"]
        ])
      ],
      table: {
        headers: ["Tear Degree", "Involved Anatomical Structures", "Surgical Repair Setting", "Postoperative Regimen"],
        rows: [
          { id: "1st", cols: ["1st Degree", "Vaginal epithelium / superficial perineal skin", "Delivery bed (may heal without suturing if hemostatic)", "Routine hygiene and mild analgesia"] },
          { id: "2nd", cols: ["2nd Degree", "Perineal muscles and perineal body (sphincter intact)", "Delivery bed under adequate local anesthesia", "Absorbable continuous suture (Vicryl Rapide), paracetamol/NSAIDs"] },
          { id: "3a_3b", cols: ["3rd Degree (3a / 3b)", "External Anal Sphincter (<50% or ≥50% torn)", "Operating theatre under regional or general anesthesia", "End-to-end or overlap EAS repair with PDS, IV antibiotics, lactulose for 10 days"] },
          { id: "3c_4th", cols: ["3rd Degree (3c) / 4th Degree", "Both EAS & IAS torn ± anal mucosa breached (OASIS)", "Operating theatre with senior obstetrician", "Interrupted 3-0 PDS for IAS, submucosal repair of anorectal mucosa, broad-spectrum antibiotics, laxatives, pelvic floor physio follow-up"] }
        ]
      },
      calc: function (v) {
        var d = v.depth;
        var match = "2nd", title = "Second-Degree Perineal Tear", plan = "Standard perineal repair of vaginal mucosa and bulbospongiosus muscles.";

        if (d === "1st") {
          match = "1st";
          title = "First-Degree Perineal Tear";
          plan = "Superficial skin/mucosa involvement. Suture with fine absorbable suture if actively bleeding or anatomically gaping; otherwise conservative management.";
        } else if (d === "3a" || d === "3b") {
          match = "3a_3b";
          title = "Obstetric Anal Sphincter Injury (OASIS): Grade " + d.toUpperCase();
          plan = "Operative repair in theatre under regional/general anaesthesia by accredited obstetrician. End-to-end (3a) or overlap (3b) repair using 3-0 PDS. Prescribe 7-day prophylactic broad-spectrum antibiotics and lactulose.";
        } else if (d === "3c" || d === "4th") {
          match = "3c_4th";
          title = d === "3c" ? "Grade 3c Perineal Tear (EAS + IAS Torn)" : "Fourth-Degree Perineal Tear (Rectal Mucosa Breached)";
          plan = "MAJOR OBSTETRIC SURGICAL REPAIR: Repair rectal mucosa without penetrating lumen, approximate internal anal sphincter with interrupted mattress sutures, followed by external anal sphincter repair. Mandatory post-op IV antibiotics, strict stool softeners for 10–14 days, and 6–12 week urogynecology follow-up.";
        }

        return {
          value: title,
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 19. BALLARD NEWBORN MATURITY RATING SCORE
    // ==============================================================
    {
      id: "ballardMaturity",
      cat: "obgyn",
      type: "class",
      name: "New Ballard Score for Neonatal Gestational Maturity",
      desc: "Clinical neuromuscular and physical maturity scoring system to estimate neonatal gestational age from 20 to 44 weeks.",
      organ: "Neonate / Neuromuscular / Integumentary",
      region: "Neonatal / Delivery Suite / NICU",
      subject: "Neonatology / Obstetric Pediatrics",
      keywords: ["ballard", "gestational age", "neonate", "newborn", "prematurity", "neuromuscular maturity", "physical maturity"],
      guidance: "1. Evaluate within 12–24 hours of birth for maximum accuracy (reliable down to 20 weeks with New Ballard criteria).\n2. Neuromuscular criteria: Posture, Square Window, Arm Recoil, Popliteal Angle, Scarf Sign, Heel to Ear.\n3. Physical criteria: Skin, Lanugo, Plantar Surface, Breast, Eye/Ear, Genitals.\n4. Score range: -10 (20 weeks) to +50 (44 weeks). Formula: Gestational Age (wks) = (Score × 2 + 120) / 5.",
      contraindications: "Infant depression from perinatal asphyxia, magnesium sulfate administration, neuromuscular disease, or severe hypothermia blunts neuromuscular tone, artificially lowering the score.",
      literature: [
        {
          type: "Seminal Validation Paper",
          icon: "📄",
          title: "New Ballard Score, expanded to include extremely premature infants",
          citation: "Ballard JL, Khoury JC, Wedig K, et al. J Pediatr. 1991;119(3):417-423.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/1880657/" }
          ]
        }
      ],
      fields: [
        makeS("posture", "1. Neuromuscular Posture", "3", [
          ["0", "Arms and legs extended, flaccid (0 pts)"],
          ["1", "Slight or moderate flexion of hips and knees (1 pt)"],
          ["2", "Moderate to strong flexion of hips and knees (2 pts)"],
          ["3", "Legs flexed and abducted, arms slightly flexed (3 pts)"],
          ["4", "Full flexion of arms and legs (4 pts)"]
        ]),
        makeS("squareWin", "2. Square Window (Wrist Flexion)", "3", [
          ["-1", ">90° angle (-1 pt)"],
          ["0", "90° angle (0 pts)"],
          ["1", "60° angle (1 pt)"],
          ["2", "45° angle (2 pts)"],
          ["3", "30° angle (3 pts)"],
          ["4", "0° flat against forearm (4 pts)"]
        ]),
        makeS("armRecoil", "3. Arm Recoil", "3", [
          ["0", "No recoil, remains extended 180° (0 pts)"],
          ["1", "Minimal recoil 140–180° (1 pt)"],
          ["2", "Partial recoil 110–140° (2 pts)"],
          ["3", "Moderate recoil 90–110° (3 pts)"],
          ["4", "Brisk snap recoil <90° (4 pts)"]
        ]),
        makeS("popliteal", "4. Popliteal Angle", "3", [
          ["-1", "180° flat (-1 pt)"],
          ["0", "160° (0 pts)"],
          ["1", "140° (1 pt)"],
          ["2", "120° (2 pts)"],
          ["3", "100° (3 pts)"],
          ["4", "90° (4 pts)"],
          ["5", "<90° (5 pts)"]
        ]),
        makeS("skin", "5. Physical: Skin Texture & Maturity", "3", [
          ["-1", "Sticky, friable, transparent (-1 pt)"],
          ["0", "Gelatinous, red, translucent (0 pts)"],
          ["1", "Smooth pink, visible veins (1 pt)"],
          ["2", "Superficial peeling and/or rash, few veins (2 pts)"],
          ["3", "Cracking, pale areas, rare veins (3 pts)"],
          ["4", "Parchment, deep cracking, no vessels (4 pts)"],
          ["5", "Leathery, deeply cracked, wrinkled (5 pts)"]
        ]),
        makeS("plantar", "6. Physical: Plantar Creases", "3", [
          ["-1", "Heel-toe 40–50 mm (-1 pt)"],
          ["0", ">50 mm no crease (0 pts)"],
          ["1", "Faint red markings (1 pt)"],
          ["2", "Anterior transverse crease only (2 pts)"],
          ["3", "Creases over anterior two-thirds (3 pts)"],
          ["4", "Creases covering entire sole (4 pts)"]
        ])
      ],
      table: {
        headers: ["Maturity Score Total", "Estimated Gestational Age", "Classification", "Care Implications"],
        rows: [
          { id: "pretermExt", cols: ["-10 to 5 Points", "20 – 26 Weeks", "Extremely Preterm", "Tertiary NICU, surfactant, high-frequency oscillatory ventilation, temperature shielding"] },
          { id: "pretermMod", cols: ["10 to 25 Points", "28 – 34 Weeks", "Very / Moderate Preterm", "NICU monitoring, nutritional support, CPAP, jaundice phototherapy screening"] },
          { id: "term", cols: ["30 to 45 Points", "36 – 42 Weeks", "Term Neonate", "Standard routine postnatal newborn transition care and early skin-to-skin breastfeeding"] },
          { id: "postterm", cols: ["≥ 50 Points", "≥ 44 Weeks", "Post-Term", "Screen for macrosomia, hypoglycemia, birth trauma, and meconium aspiration syndrome"] }
        ]
      },
      calc: function (v) {
        var raw = +v.posture + +v.squareWin + +v.armRecoil + +v.popliteal + +v.skin + +v.plantar;
        var totalEstimatedScore = raw * 2;
        var weeks = Math.round(((totalEstimatedScore * 2) + 120) / 5);
        weeks = Math.max(20, Math.min(44, weeks));

        var match = "term";
        if (weeks < 28) match = "pretermExt";
        else if (weeks < 37) match = "pretermMod";
        else if (weeks > 42) match = "postterm";

        return {
          value: "Ballard Score: ~" + totalEstimatedScore + " pts (Estimated GA: " + weeks + " Weeks)",
          matchId: match,
          eq: "New Ballard Formula: GA = (Score × 2 + 120) / 5.\nNeuromuscular and physical hallmarks correlate with clinical neonatal maturity."
        };
      }
    },

    // ==============================================================
    // 20. MISSISSIPPI TRIPLE-CLASS HELLP SYNDROME STAGING
    // ==============================================================
    {
      id: "hellpStaging",
      cat: "obgyn",
      type: "class",
      name: "HELLP Syndrome Classification (Mississippi Triple-Class)",
      desc: "Stratifies severity and maternal-perinatal morbidity of HELLP syndrome based on nadir platelet count and hepatic enzymes.",
      organ: "Liver / Platelets / Vascular Endothelium",
      region: "Obstetric / Maternal-Fetal Medicine",
      subject: "High-Risk Pregnancy / Obstetric Critical Care",
      keywords: ["hellp", "mississippi", "preeclampsia", "platelets", "thrombocytopenia", "ldh", "ast", "microangiopathy", "liver hematoma"],
      guidance: "1. Confirm triad: Hemolysis (abnormal peripheral smear, elevated LDH, elevated indirect bilirubin), Elevated Liver enzymes (AST/ALT), Low Platelets.\n2. Obtain serial complete blood count, LDH, AST, and ALT 6–12 hourly.\n3. Delivery is the definitive cure. Administer IV magnesium sulfate for neuroprotection and seizure prophylaxis.",
      contraindications: "Do not delay emergent delivery in Class 1 HELLP beyond gestational viability once maternal stabilization has occurred.",
      literature: [
        {
          type: "Seminal Staging Study",
          icon: "📄",
          title: "HELLP syndrome: a multifaceted disease",
          citation: "Martin JN Jr, Rinehart EK, May WL, et al. Am J Obstet Gynecol. 1999;180(6 Pt 1):1373-1384.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/10368472/" }
          ]
        },
        {
          type: "ACOG Practice Bulletin",
          icon: "📘",
          title: "Gestational Hypertension and Preeclampsia (Practice Bulletin No. 222)",
          citation: "American College of Obstetricians and Gynecologists. Obstet Gynecol. 2020;135(6):e237-e260.",
          links: [
            { text: "View Guideline (PubMed) ↗", url: "https://pubmed.ncbi.nlm.nih.gov/32443079/" }
          ]
        }
      ],
      fields: [
        makeN("plt", "Nadir Platelet Count (cells/µL)", 72000, { min: 5000, max: 400000, step: 1000 }),
        makeN("ast", "Serum AST / SGOT (U/L)", 115, { min: 10, max: 3000, step: 5 }),
        makeN("ldh", "Serum Lactate Dehydrogenase (LDH, U/L)", 780, { min: 100, max: 5000, step: 10 })
      ],
      table: {
        headers: ["Mississippi Class", "Platelet Threshold", "Hepatic & Hemolytic Markers", "Clinical Risk & Strategy"],
        rows: [
          { id: "class1", cols: ["Class 1 (Severe)", "Platelets ≤ 50,000 /µL", "AST or ALT ≥ 70 U/L, LDH ≥ 600 U/L", "Highest risk of DIC, subcapsular liver hematoma, maternal death; expedite immediate delivery"] },
          { id: "class2", cols: ["Class 2 (Moderate)", "Platelets > 50,000 to ≤ 100,000 /µL", "AST or ALT ≥ 70 U/L, LDH ≥ 600 U/L", "High maternal morbidity; stabilization and planned delivery within 24–48 hours"] },
          { id: "class3", cols: ["Class 3 (Mild)", "Platelets > 100,000 to ≤ 150,000 /µL", "AST or ALT ≥ 40 U/L, LDH ≥ 600 U/L", "Close inpatient monitoring; high risk of progression to Class 1 or 2"] },
          { id: "notHellp", cols: ["Criteria Incomplete", "Platelets > 150,000 /µL or enzymes normal", "Sub-threshold laboratory criteria", "Does not satisfy strict criteria for complete HELLP syndrome"] }
        ]
      },
      calc: function (v) {
        var plt = +v.plt, ast = +v.ast, ldh = +v.ldh;
        var hasEnzymes = ast >= 70 && ldh >= 600;
        var match = "notHellp", title = "Incomplete / Sub-Threshold HELLP Criteria", action = "Maintain close surveillance for emerging microangiopathic hemolytic anemia.";

        if (hasEnzymes && plt <= 50000) {
          match = "class1";
          title = "Mississippi Class 1 HELLP Syndrome (Severe Thrombocytopenia)";
          action = "CRITICAL OBSTETRIC EMERGENCY: Platelets ≤50k. High risk of maternal intracranial hemorrhage, DIC, and liver hematoma. Administer IV Magnesium sulfate, crossmatch PRBCs and platelets, and expedite immediate delivery regardless of gestational age.";
        } else if (hasEnzymes && plt <= 100000) {
          match = "class2";
          title = "Mississippi Class 2 HELLP Syndrome (Moderate Thrombocytopenia)";
          action = "Moderate HELLP syndrome. Continuous inpatient fetal monitoring, IV Magnesium sulfate seizure prophylaxis, antihypertensive titration, and plan delivery.";
        } else if ((ast >= 40 || ldh >= 600) && plt <= 150000) {
          match = "class3";
          title = "Mississippi Class 3 HELLP Syndrome (Mild / Incipient)";
          action = "Mild HELLP syndrome. Re-evaluate laboratory markers every 6–12 hours because rapid deterioration to Class 1 or 2 frequently occurs.";
        }

        return {
          value: title,
          matchId: match,
          eq: action
        };
      }
    },

    // ==============================================================
    // 21. RCOG GREEN-TOP VTE RISK SCORE IN PREGNANCY
    // ==============================================================
    {
      id: "rcogVteScore",
      cat: "obgyn",
      type: "class",
      name: "RCOG Green-top VTE Risk Score (Thromboprophylaxis)",
      desc: "Quantifies antepartum and postpartum venous thromboembolism (VTE) risk to dictate low-molecular-weight heparin (LMWH) thromboprophylaxis.",
      organ: "Vascular Endothelium / Deep Veins / Pulmonary Circulation",
      region: "Obstetric / Antenatal & Postnatal Care",
      subject: "Obstetric Hematology / Maternal Safety",
      keywords: ["vte", "dvt", "pulmonary embolism", "rcog", "thromboprophylaxis", "lmwh", "heparin", "clexane", "pregnancy thrombosis"],
      guidance: "1. Tally risk scores at booking, hospital admission, and delivery.\n2. ANTEPARTUM: Score ≥4 = antenatal LMWH from 1st trimester; Score 3 = antenatal LMWH from 28 weeks.\n3. POSTPARTUM: Score ≥2 = at least 10 days of postpartum LMWH; Score ≥3 = 6 weeks postpartum LMWH.\n4. Any previous unprovoked or estrogen-provoked VTE requires antenatal LMWH.",
      contraindications: "Contraindicated in active major bleeding, severe thrombocytopenia (platelets <50k), severe renal insufficiency (anti-Xa monitoring required), or within 12 hours of epidural catheter insertion/removal.",
      literature: [
        {
          type: "RCOG Green-top Guideline",
          icon: "📘",
          title: "Reducing the Risk of Venous Thromboembolism during Pregnancy and the Puerperium (Green-top Guideline No. 37a)",
          citation: "Royal College of Obstetricians and Gynaecologists. BJOG. 2015;122(11):e52-e73.",
          links: [
            { text: "View Guideline (RCOG) ↗", url: "https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/reducing-the-risk-of-venous-thromboembolism-during-pregnancy-and-the-puerperium-green-top-guideline-no-37a/" }
          ]
        }
      ],
      fields: [
        makeS("priorVte", "1. Previous History of VTE", "0", [
          ["0", "No previous VTE (0 pts)"],
          ["3", "Previous VTE provoked by major transient non-estrogen risk factor (+3 pts)"],
          ["4", "Previous unprovoked or estrogen/pregnancy-provoked VTE (+4 pts)"]
        ]),
        makeS("thrombophilia", "2. High-Risk Known Thrombophilia", "0", [
          ["0", "None / Low risk (0 pts)"],
          ["3", "High-risk: Antithrombin deficiency, Protein C/S deficiency, Antiphospholipid Syndrome (+3 pts)"]
        ]),
        makeS("medicalRisk", "3. Medical Comorbidities (Cancer, Heart disease, SLE, Active IBD, Nephrotic)", "0", [
          ["0", "None (0 pts)"],
          ["3", "Present (+3 pts)"]
        ]),
        makeS("bmiBooking", "4. Booking BMI", "0", [
          ["0", "BMI < 30 kg/m² (0 pts)"],
          ["1", "BMI 30 – 39.9 kg/m² (+1 pt)"],
          ["2", "BMI ≥ 40 kg/m² (+2 pts)"]
        ]),
        makeS("obstetricRisk", "5. Current Obstetric Risk Factors", "0", [
          ["0", "None (0 pts)"],
          ["1", "Single factor: Pre-eclampsia, Twin pregnancy, Smoker, Parity ≥3 (+1 pt)"],
          ["2", "Multiple factors or Hyperemesis/OHSS with dehydration (+2 pts)"],
          ["2_cs", "Emergency Cesarean section in labor (+2 pts)"]
        ]),
        makeS("immobility", "6. Immobility / Hospital Admission / Systemic Infection", "0", [
          ["0", "Mobilizing normally (0 pts)"],
          ["1", "Immobility (>3 days bedrest), current active systemic infection (+1 pt)"]
        ])
      ],
      table: {
        headers: ["Score Total", "Antepartum Recommendation", "Postpartum Recommendation", "Standard Duration"],
        rows: [
          { id: "low", cols: ["Score 0 – 1", "Mobilization and avoidance of dehydration", "Mobilization; no routine LMWH indicated", "N/A"] },
          { id: "mod", cols: ["Score 2 – 3", "Score 3: Start LMWH at 28 weeks; Score 2: Postpartum LMWH", "Postpartum LMWH indicated for ≥10 days (or 6 weeks if score ≥3)", "10 days to 6 weeks postpartum"] },
          { id: "high", cols: ["Score ≥ 4", "Immediate antenatal LMWH thromboprophylaxis from 1st trimester", "Postpartum LMWH indicated for 6 weeks", "Entire pregnancy + 6 weeks postnatal"] }
        ]
      },
      calc: function (v) {
        var score = +v.priorVte + +v.thrombophilia + +v.medicalRisk + +v.bmiBooking + +v.immobility;
        if (v.obstetricRisk === "1") score += 1;
        else if (v.obstetricRisk === "2" || v.obstetricRisk === "2_cs") score += 2;

        var match = "low", advice = "Low VTE risk. Encourage active hydration and mobilization.";

        if (score >= 4) {
          match = "high";
          advice = "HIGH RISK (Score ≥ 4): Commence antenatal LMWH prophylaxis immediately from the 1st trimester. Continue throughout pregnancy and for 6 weeks postpartum.";
        } else if (score === 3) {
          match = "mod";
          advice = "INTERMEDIATE RISK (Score 3): Commence antenatal LMWH thromboprophylaxis from 28 weeks gestation. Continue for at least 10 days to 6 weeks postpartum.";
        } else if (score === 2) {
          match = "mod";
          advice = "POSTPARTUM THRESHOLD MET (Score 2): Prophylactic LMWH indicated postpartum for at least 10 days.";
        }

        return {
          value: "RCOG VTE Risk Score: " + score + " Points",
          matchId: match,
          eq: advice
        };
      }
    },

    // ==============================================================
    // 22. FIGO PALM-COEIN SYSTEM FOR ABNORMAL UTERINE BLEEDING
    // ==============================================================
    {
      id: "palmCoeinClassification",
      cat: "obgyn",
      type: "class",
      name: "FIGO PALM-COEIN Classification for AUB",
      desc: "Comprehensive diagnostic framework categorizing structural (PALM) and non-structural (COEIN) etiologies of abnormal uterine bleeding.",
      organ: "Uterus / Endometrium / Coagulation System",
      region: "Gynaecology / Reproductive Tract",
      subject: "General Gynaecology / Menstrual Disorders",
      keywords: ["palm-coein", "aub", "abnormal uterine bleeding", "menorrhagia", "polyp", "adenomyosis", "leiomyoma", "coagulopathy"],
      guidance: "1. History and pelvic examination, followed by transvaginal ultrasound (TVS) and saline infusion sonography or hysteroscopy as indicated.\n2. PALM etiologies are structurally visible on imaging/histopathology.\n3. COEIN etiologies are non-structural systemic or functional disorders.",
      contraindications: "Always exclude pregnancy via urine hCG before investigating abnormal uterine bleeding in reproductive-aged females.",
      literature: [
        {
          type: "Official FIGO Classification",
          icon: "📘",
          title: "The two FIGO systems for normal and abnormal uterine bleeding symptoms and classification of causes of AUB in the reproductive years",
          citation: "Munro MG, Critchley HOD, Fraser IS; FIGO Menstrual Disorders Committee. Int J Gynaecol Obstet. 2018;143(3):393-408.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/30198563/" }
          ]
        }
      ],
      fields: [
        makeS("polyp", "P - Endometrial / Endocervical Polyp", "0", [
          ["0", "Absent"],
          ["1", "Present on ultrasound / hysteroscopy"]
        ]),
        makeS("adeno", "A - Adenomyosis", "0", [
          ["0", "Absent"],
          ["1", "Present on TVS / MRI (asymmetrical thickening, myometrial cysts)"]
        ]),
        makeS("leiom", "L - Leiomyoma (Fibroids)", "0", [
          ["0", "Absent"],
          ["1", "Present: Submucosal (AUB-L_SM)"],
          ["2", "Present: Other intramural / subserosal (AUB-L_O)"]
        ]),
        makeS("malig", "M - Malignancy & Hyperplasia", "0", [
          ["0", "Absent"],
          ["1", "Present: Atypical endometrial hyperplasia or carcinoma"]
        ]),
        makeS("coag", "C - Coagulopathy", "0", [
          ["0", "Absent"],
          ["1", "Present: Von Willebrand disease, anticoagulant therapy, or chronic thrombocytopenia"]
        ]),
        makeS("ovul", "O - Ovulatory Dysfunction", "1", [
          ["0", "Absent (Regular ovulatory bleeding)"],
          ["1", "Present: Irregular, unpredictable cycles (PCOS, thyroid disorder, perimenopause)"]
        ]),
        makeS("endo", "E - Endometrial Primary Dysfunction", "0", [
          ["0", "Absent"],
          ["1", "Present: Heavy menstrual bleeding with regular cycles and normal imaging (prostaglandin/endothelin defect)"]
        ]),
        makeS("iatro", "I - Iatrogenic", "0", [
          ["0", "Absent"],
          ["1", "Present: Copper IUD, progestin implants, psychotropics, GnRH analogues"]
        ])
      ],
      table: {
        headers: ["Component", "Category", "Classification", "First-Line Workup & Therapy"],
        rows: [
          { id: "palm", cols: ["PALM", "Structural Causes", "Polyp, Adenomyosis, Leiomyoma, Malignancy", "Targeted surgical therapy (polypectomy, myomectomy, hysterectomy, LNG-IUS) or biopsy"] },
          { id: "coein", cols: ["COEIN", "Non-Structural Causes", "Coagulopathy, Ovulatory, Endometrial, Iatrogenic, Not classified", "Medical management: Tranexamic acid, oral progestins, combined OCPs, LNG-IUS, hematology consultation"] }
        ]
      },
      calc: function (v) {
        var str = [];
        var isStructural = false, isNonStructural = false;

        if (v.polyp === "1") { str.push("AUB-P (Polyp)"); isStructural = true; }
        if (v.adeno === "1") { str.push("AUB-A (Adenomyosis)"); isStructural = true; }
        if (v.leiom === "1") { str.push("AUB-L_SM (Submucosal Leiomyoma)"); isStructural = true; }
        else if (v.leiom === "2") { str.push("AUB-L_O (Other Leiomyoma)"); isStructural = true; }
        if (v.malig === "1") { str.push("AUB-M (Malignancy/Hyperplasia)"); isStructural = true; }

        if (v.coag === "1") { str.push("AUB-C (Coagulopathy)"); isNonStructural = true; }
        if (v.ovul === "1") { str.push("AUB-O (Ovulatory Dysfunction)"); isNonStructural = true; }
        if (v.endo === "1") { str.push("AUB-E (Endometrial Dysfunction)"); isNonStructural = true; }
        if (v.iatro === "1") { str.push("AUB-I (Iatrogenic)"); isNonStructural = true; }

        if (str.length === 0) str.push("AUB-N (Not Otherwise Specified)");

        var match = isStructural ? "palm" : "coein";
        return {
          value: "FIGO Diagnosis: " + str.join(" | "),
          matchId: match,
          eq: "FIGO PALM-COEIN Classification:\n• Structural: " + (isStructural ? "Identified on imaging/pathology" : "None detected") + "\n• Non-structural: " + (isNonStructural ? "Identified functional/systemic defect" : "None detected")
        };
      }
    },

    // ==============================================================
    // 23. MODIFIED FERRIMAN-GALLWEY (mFG) SCORE FOR HIRSUTISM
    // ==============================================================
    {
      id: "ferrimanGallwey",
      cat: "obgyn",
      type: "class",
      name: "Modified Ferriman-Gallwey (mFG) Score for Hirsutism",
      desc: "Clinical grading system evaluating terminal hair growth in androgen-sensitive bodily areas to diagnose hirsutism.",
      organ: "Hair Follicles / Skin / Androgen Axis",
      region: "Endocrine / Reproductive Gynaecology",
      subject: "Gynaecologic Endocrinology / Hyperandrogenism",
      keywords: ["ferriman gallwey", "hirsutism", "pcos", "androgens", "testosterone", "terminal hair", "hair growth"],
      guidance: "1. Evaluate 9 body regions (upper lip, chin, chest, upper back, lower back, upper abdomen, lower abdomen, upper arms, thighs).\n2. Score each area 0 (no terminal hair) to 4 (extensive dense virile terminal hair).\n3. Cut-off thresholds: Score ≥4 to 6 indicates clinical hirsutism depending on ethnic background.",
      contraindications: "Cosmetic hair removal (laser, waxing, electrolysis, shaving) within the preceding 3 months obscures evaluation; ask patient about baseline unmanipulated distribution.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Clinical assessment of body hair growth in women",
          citation: "Ferriman D, Gallwey JD. J Clin Endocrinol Metab. 1961;21:1440-1447.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/13892577/" }
          ]
        },
        {
          type: "Endocrine Society Clinical Practice Guideline",
          icon: "📘",
          title: "Evaluation and Treatment of Hirsutism in Premenopausal Women: An Endocrine Society Clinical Practice Guideline",
          citation: "Martin KA, Anderson RR, Chang RJ, et al. J Clin Endocrinol Metab. 2018;103(4):1233-1257.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/29522147/" }
          ]
        }
      ],
      fields: [
        makeS("lip", "1. Upper Lip Hair", "1", [
          ["0", "No terminal hair (0 pts)"],
          ["1", "A few hairs at outer margin (1 pt)"],
          ["2", "Small moustache at outer margin (2 pts)"],
          ["3", "Moustache extending into mid-lip (3 pts)"],
          ["4", "Complete dense moustache (4 pts)"]
        ]),
        makeS("chin", "2. Chin", "1", [
          ["0", "None (0 pts)"],
          ["1", "Few scattered hairs (1 pt)"],
          ["2", "Small clumps (2 pts)"],
          ["3", "Solid beard coverage (3 pts)"],
          ["4", "Complete full heavy beard (4 pts)"]
        ]),
        makeS("chest", "3. Chest", "0", [
          ["0", "None (0 pts)"],
          ["1", "Circumareolar hairs (1 pt)"],
          ["2", "Areolar hairs with midline sternal involvement (2 pts)"],
          ["3", "Extensive sternal coverage (3 pts)"],
          ["4", "Complete chest pectoral coverage (4 pts)"]
        ]),
        makeS("upperAbd", "4. Upper Abdomen", "0", [
          ["0", "None (0 pts)"],
          ["1", "A few midline hairs (1 pt)"],
          ["2", "Midline streak of hair (2 pts)"],
          ["3", "Broad band of hair (3 pts)"],
          ["4", "Full inverted-V abdominal coverage (4 pts)"]
        ]),
        makeS("lowerAbd", "5. Lower Abdomen", "1", [
          ["0", "None (0 pts)"],
          ["1", "Midline strip of hair (1 pt)"],
          ["2", "Midline band of hair (2 pts)"],
          ["3", "Broad triangular band (3 pts)"],
          ["4", "Full masculine distribution (4 pts)"]
        ]),
        makeS("back", "6. Back (Upper / Lower)", "0", [
          ["0", "None (0 pts)"],
          ["1", "A few scattered hairs (1 pt)"],
          ["2", "Slender midline band (2 pts)"],
          ["3", "Broad band of hair (3 pts)"],
          ["4", "Dense full coverage (4 pts)"]
        ]),
        makeS("armsThighs", "7. Upper Arms & Thighs", "1", [
          ["0", "None (0 pts)"],
          ["1", "Sparse terminal hair (1 pt)"],
          ["2", "Moderate terminal hair (2 pts)"],
          ["3", "Dense hair covering >50% (3 pts)"],
          ["4", "Heavy dense masculine coverage (4 pts)"]
        ])
      ],
      table: {
        headers: ["mFG Score", "Clinical Severity", "Androgen Profile Likelihood", "Recommended Management"],
        rows: [
          { id: "normal", cols: ["Score < 4 to 6", "Normal Physiological Variant", "Normal circulating androgens", "Reassurance or cosmetic management"] },
          { id: "mild", cols: ["Score 6 – 15", "Mild Hirsutism", "Common in PCOS; check Total/Free Testosterone, 17-OHP", "Combined oral contraceptives (anti-androgenic progestins) ± cosmetic therapy"] },
          { id: "modSevere", cols: ["Score > 15", "Moderate-to-Severe Hirsutism / Virilization", "High risk of androgen-secreting tumor or severe CAH", "Combine COCP with Spironolactone; pelvic ultrasound and adrenal imaging"] }
        ]
      },
      calc: function (v) {
        var total = +v.lip + +v.chin + +v.chest + +v.upperAbd + +v.lowerAbd + +v.back + +v.armsThighs;
        var match = "normal", cat = "Normal (No Clinical Hirsutism)", plan = "Normal physiological terminal hair distribution.";

        if (total > 15) {
          match = "modSevere";
          cat = "Moderate-to-Severe Hirsutism (Score > 15)";
          plan = "Significantly elevated score. Screen for hyperandrogenic etiologies: PCOS, non-classic congenital adrenal hyperplasia (17-OHP), Cushing syndrome, or ovarian/adrenal androgen-secreting tumors. Initiate combined OCP + anti-androgen therapy (Spironolactone).";
        } else if (total >= 6) {
          match = "mild";
          cat = "Mild Hirsutism (Score 6–15)";
          plan = "Consistent with clinical hyperandrogenism (commonly seen in PCOS). First-line pharmacological therapy consists of combined oral contraceptives.";
        }

        return {
          value: "mFG Score: " + total + " Points",
          matchId: match,
          eq: cat + ".\n" + plan
        };
      }
    },

    // ==============================================================
    // 24. REVISED ASRM (rASRM) ENDOMETRIOSIS STAGING
    // ==============================================================
    {
      id: "rasrmEndometriosis",
      cat: "obgyn",
      type: "class",
      name: "Revised ASRM (rASRM) Endometriosis Staging",
      desc: "Surgical staging classification quantifying extent and depth of peritoneal/ovarian endometriosis and adhesions.",
      organ: "Peritoneum / Ovary / Fallopian Tube / Cul-de-sac",
      region: "Female Pelvis / Laparoscopy",
      subject: "Gynaecologic Surgery / Reproductive Endocrinology",
      keywords: ["endometriosis", "asrm", "rasrm", "endometrioma", "pelvic pain", "infertility", "laparoscopy", "adhesions"],
      guidance: "1. Staged at diagnostic or operative laparoscopy.\n2. Quantify superficial vs deep lesions on peritoneum and ovaries.\n3. Score filmy vs dense adhesions of ovaries and fallopian tubes.\n4. Screen for complete obliteration of the posterior cul-de-sac (automatically scores 40 points).",
      contraindications: "Does not correlate directly with subjective severity of pelvic pain or dysmenorrhea; primarily designed to predict fertility outcomes.",
      literature: [
        {
          type: "Official ASRM Guideline",
          icon: "📘",
          title: "Revised American Society for Reproductive Medicine classification of endometriosis: 1996",
          citation: "American Society for Reproductive Medicine. Fertil Steril. 1997;67(5):817-821.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/9130884/" }
          ]
        }
      ],
      fields: [
        makeS("peritoneum", "1. Peritoneal Endometriosis", "1", [
          ["1", "Superficial < 1 cm (1 pt)"],
          ["2", "Superficial 1–3 cm (2 pts)"],
          ["4", "Deep infiltration > 3 cm (4 pts)"]
        ]),
        makeS("ovaryR", "2. Right Ovarian Lesions / Endometrioma", "0", [
          ["0", "None (0 pts)"],
          ["2", "Superficial < 1 cm (2 pts)"],
          ["16", "Deep endometrioma 1–3 cm (16 pts)"],
          ["20", "Deep endometrioma > 3 cm (20 pts)"]
        ]),
        makeS("ovaryL", "3. Left Ovarian Lesions / Endometrioma", "0", [
          ["0", "None (0 pts)"],
          ["2", "Superficial < 1 cm (2 pts)"],
          ["16", "Deep endometrioma 1–3 cm (16 pts)"],
          ["20", "Deep endometrioma > 3 cm (20 pts)"]
        ]),
        makeS("culdesac", "4. Posterior Cul-de-sac (Pouch of Douglas) Obliteration", "0", [
          ["0", "Normal / Open (0 pts)"],
          ["4", "Partial obliteration (4 pts)"],
          ["40", "Complete obliteration / Frozen pelvis (40 pts)"]
        ]),
        makeS("adhesions", "5. Tubal / Ovarian Adhesions", "0", [
          ["0", "None (0 pts)"],
          ["4", "Filmy adhesions (4 pts)"],
          ["16", "Dense vascular adhesions (16 pts)"]
        ])
      ],
      table: {
        headers: ["rASRM Stage", "Point Threshold", "Severity Description", "Clinical Implications"],
        rows: [
          { id: "stage1", cols: ["Stage I (Minimal)", "1 – 5 Points", "Few superficial implants", "Surgical excision/ablation; favourable spontaneous fertility rates"] },
          { id: "stage2", cols: ["Stage II (Mild)", "6 – 15 Points", "More numerous superficial implants in cul-de-sac", "Laparoscopic excision; medical suppression with dienogest/GnRH"] },
          { id: "stage3", cols: ["Stage III (Moderate)", "16 – 40 Points", "Endometriomas present and peritubal adhesions", "Cystectomy, adhesiolysis; referral for assisted reproductive technologies (IVF)"] },
          { id: "stage4", cols: ["Stage IV (Severe)", "> 40 Points", "Large endometriomas, extensive dense adhesions, cul-de-sac obliteration", "Multidisciplinary laparoscopic excision (colorectal/urology involvement); high infertility burden"] }
        ]
      },
      calc: function (v) {
        var score = +v.peritoneum + +v.ovaryR + +v.ovaryL + +v.culdesac + +v.adhesions;
        var match = "stage1", stageName = "Stage I: Minimal Endometriosis";

        if (score > 40) {
          match = "stage4";
          stageName = "Stage IV: Severe Endometriosis (>40 Points)";
        } else if (score >= 16) {
          match = "stage3";
          stageName = "Stage III: Moderate Endometriosis (16–40 Points)";
        } else if (score >= 6) {
          match = "stage2";
          stageName = "Stage II: Mild Endometriosis (6–15 Points)";
        }

        return {
          value: stageName + " (" + score + " pts)",
          matchId: match,
          eq: "rASRM classification correlates with surgical anatomical distortion. Note: Pain symptoms correlate poorly with stage and are governed by deep infiltrating nerve involvement."
        };
      }
    },

    // ==============================================================
    // 25. POP-Q PELVIC ORGAN PROLAPSE QUANTIFICATION SYSTEM
    // ==============================================================
    {
      id: "popqClassification",
      cat: "obgyn",
      type: "class",
      name: "Pelvic Organ Prolapse Quantification (POP-Q) System",
      desc: "Standard international staging system defining pelvic organ descent relative to the hymen.",
      organ: "Vagina / Bladder / Uterus / Rectum",
      region: "Urogynaecology / Female Pelvic Floor",
      subject: "Urogynaecology / Pelvic Floor Disorders",
      keywords: ["popq", "prolapse", "cystocele", "rectocele", "uterine prolapse", "hymen", "urogynaecology", "pessary"],
      guidance: "1. Examine patient during maximum Valsalva strain in 45° lithotomy position.\n2. The hymenal ring serves as the reference line (0 cm).\n3. Structures proximal (inside) to the hymen are negative values; structures distal (outside) to the hymen are positive values.\n4. Stage is determined by the most severely prolapsed leading anatomical point.",
      contraindications: "Failure to perform maximal Valsalva strain or examining solely in the flat supine position can substantially underestimate stage.",
      literature: [
        {
          type: "Seminal Standardization Paper",
          icon: "📄",
          title: "The standardization of terminology of female pelvic organ prolapse and pelvic floor dysfunction",
          citation: "Bump RC, Mattiasson A, Bø K, et al. Am J Obstet Gynecol. 1996;175(1):10-17.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/8694033/" }
          ]
        }
      ],
      fields: [
        makeN("leadingEdge", "Leading Edge of Most Prolapsed Point Relative to Hymen (cm)", -1.0, { min: -10, max: 10, step: 0.5 }),
        makeN("tvl", "Total Vaginal Length (tvl, cm)", 8.0, { min: 4, max: 15, step: 0.5 })
      ],
      table: {
        headers: ["POP-Q Stage", "Anatomical Criteria (Leading Edge Relative to Hymen)", "Clinical Features", "Management Options"],
        rows: [
          { id: "stage0", cols: ["Stage 0", "Leading edge < -3 cm (no descent)", "Normal anatomical pelvic support", "Routine pelvic floor muscle training (Kegels)"] },
          { id: "stage1", cols: ["Stage 1", "Leading edge is > -3 cm but < -1 cm", "Mild descent inside vagina", "Asymptomatic: pelvic floor physical therapy"] },
          { id: "stage2", cols: ["Stage 2", "Leading edge is between -1 cm and +1 cm", "Descent to the level of the introitus/hymen", "Vaginal pessary fitting or conservative surveillance"] },
          { id: "stage3", cols: ["Stage 3", "Leading edge is > +1 cm but < (tvl - 2 cm)", "Prolapse protrudes beyond hymen", "Vaginal pessary vs reconstructive pelvic surgery (sacrocolpopexy, hysteropexy, colporrhaphy)"] },
          { id: "stage4", cols: ["Stage 4 (Procidentia)", "Leading edge is ≥ (tvl - 2 cm)", "Complete eversion / procidentia of the vagina/uterus", "Surgical reconstruction with apical suspension or colpocleisis"] }
        ]
      },
      calc: function (v) {
        var edge = +v.leadingEdge, tvl = +v.tvl;
        var stage = "stage0", title = "POP-Q Stage 0 (No Prolapse)";

        if (edge >= (tvl - 2)) {
          stage = "stage4";
          title = "POP-Q Stage IV (Complete Procidentia / Full Eversion)";
        } else if (edge > 1) {
          stage = "stage3";
          title = "POP-Q Stage III (Prolapse >1 cm Past Hymen)";
        } else if (edge >= -1 && edge <= 1) {
          stage = "stage2";
          title = "POP-Q Stage II (Leading Edge within 1 cm of Hymen)";
        } else if (edge > -3) {
          stage = "stage1";
          title = "POP-Q Stage I (Descent > -3 cm but < -1 cm)";
        }

        return {
          value: title,
          matchId: stage,
          eq: "Leading edge at " + edge + " cm relative to hymenal ring (tvl = " + tvl + " cm). Stage dictated by the most prolapsed anatomical vector."
        };
      }
    },

    // ==============================================================
    // 26. FIGO LEIOMYOMA SUBCLASSIFICATION SYSTEM
    // ==============================================================
    {
      id: "figoLeiomyoma",
      cat: "obgyn",
      type: "class",
      name: "FIGO Leiomyoma (Fibroid) Subclassification",
      desc: "Anatomical subclassification of uterine fibroids based on proximity to endometrium and serosa.",
      organ: "Myometrium / Endometrium / Uterus",
      region: "Gynaecology / Pelvic Ultrasound",
      subject: "General Gynaecology / Minimally Invasive Gynaecology",
      keywords: ["fibroid", "leiomyoma", "figo", "myomectomy", "submucosal", "intramural", "subserosal", "hysteroscopy"],
      guidance: "1. Evaluate using transvaginal ultrasound (TVS), saline infusion sonohysterography (SIS), or pelvic MRI.\n2. Submucosal (Types 0–2) distort the endometrial cavity and are amenable to hysteroscopic resection.\n3. Types 3–8 are intramural, subserosal, cervical, or parasitic.",
      contraindications: "Large fibroids (>10 cm) require MRI to differentiate from uterine leiomyosarcoma (screen for high LDH, central necrosis, rapid growth).",
      literature: [
        {
          type: "Official FIGO Staging",
          icon: "📘",
          title: "The two FIGO systems for normal and abnormal uterine bleeding symptoms and classification of causes of AUB in the reproductive years",
          citation: "Munro MG, Critchley HOD, Fraser IS. Int J Gynaecol Obstet. 2018;143(3):393-408.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/30198563/" }
          ]
        }
      ],
      fields: [
        makeS("type", "Fibroid Anatomical Relationship to Myometrium", "2", [
          ["0", "Type 0: Pedunculated intracavitary submucosal"],
          ["1", "Type 1: Submucosal < 50% intramural"],
          ["2", "Type 2: Submucosal ≥ 50% intramural"],
          ["3", "Type 3: 100% intramural, but contacts endometrium"],
          ["4", "Type 4: Intramural entirely, no contact with endometrium or serosa"],
          ["5", "Type 5: Subserosal ≥ 50% intramural"],
          ["6", "Type 6: Subserosal < 50% intramural"],
          ["7", "Type 7: Pedunculated subserosal"],
          ["8", "Type 8: Other (Cervical, broad ligament, parasitic)"]
        ])
      ],
      table: {
        headers: ["FIGO Type", "Category", "Anatomical Location", "Surgical Approach"],
        rows: [
          { id: "sm", cols: ["Types 0, 1, 2", "Submucosal (AUB-L_SM)", "Distorts endometrial cavity; major cause of heavy bleeding and infertility", "Hysteroscopic myomectomy (resectoscope)"] },
          { id: "im", cols: ["Types 3, 4", "Intramural", "Confined within myometrial wall", "Laparoscopic or open abdominal myomectomy, UAE, or medical therapy"] },
          { id: "ss", cols: ["Types 5, 6, 7", "Subserosal", "Protrudes outward onto peritoneal surface; causes bulk/pressure symptoms", "Laparoscopic myomectomy"] },
          { id: "other", cols: ["Type 8", "Hybrid / Extrauterine", "Cervical, intraligamentary, or parasitic", "Targeted surgical excision or uterine artery embolization"] }
        ]
      },
      calc: function (v) {
        var t = v.type;
        var match = "im", desc = "Intramural Leiomyoma";

        if (t === "0" || t === "1" || t === "2") {
          match = "sm";
          desc = "Submucosal Leiomyoma (FIGO Type " + t + "): Primary cause of abnormal bleeding. Optimal for hysteroscopic transcervical resection.";
        } else if (t === "5" || t === "6" || t === "7") {
          match = "ss";
          desc = "Subserosal Leiomyoma (FIGO Type " + t + "): Primarily presents with urinary urgency, constipation, and pelvic bulk. Amenable to laparoscopic myomectomy.";
        } else if (t === "8") {
          match = "other";
          desc = "Type 8 Leiomyoma: Cervical or broad ligament fibroid.";
        } else {
          desc = "Intramural Leiomyoma (FIGO Type " + t + "): Confined to the myometrial wall.";
        }

        return {
          value: "FIGO Classification: Type " + t,
          matchId: match,
          eq: desc
        };
      }
    },

    // ==============================================================
    // 27. O-RADS ULTRASOUND RISK STRATIFICATION FOR ADNEXAL LESIONS
    // ==============================================================
    {
      id: "oradsClassification",
      cat: "obgyn",
      type: "class",
      name: "O-RADS Ultrasound Stratification (Adnexal Lesions)",
      desc: "Standardized imaging system by the American College of Radiology for malignancy risk in adnexal masses.",
      organ: "Ovary / Adnexa",
      region: "Pelvic Ultrasound / Gynaecologic Imaging",
      subject: "Gynaecologic Oncology / Pelvic Imaging",
      keywords: ["orads", "ovary", "ovarian cancer", "adnexal mass", "ultrasound", "malignancy", "acr"],
      guidance: "1. Evaluate lesion morphology (simple cyst, smooth unilocular, multilocular, solid component, papillary projection).\n2. Apply Color Doppler score (1 to 4).\n3. Assign O-RADS category 1 through 5.",
      contraindications: "Does not apply to acute gynecologic emergencies (ectopic pregnancy, ovarian torsion, ruptured hemorrhagic cyst with hemoperitoneum).",
      literature: [
        {
          type: "Seminal ACR Consensus",
          icon: "📘",
          title: "Ovarian-Adnexal Reporting and Data System (O-RADS) Ultrasound Risk Stratification and Management System",
          citation: "Andreotti RF, Timmerman D, Strachowski LM, et al. Radiology. 2020;294(1):168-185.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/31687919/" }
          ]
        }
      ],
      fields: [
        makeS("morph", "Ultrasound Morphological Appearance", "3", [
          ["1", "O-RADS 1: Physiologic normal premenopausal ovary (follicle / corpus luteum ≤3 cm)"],
          ["2", "O-RADS 2: Almost certainly benign (Simple cyst ≤10 cm, classic dermoid/endometrioma <10 cm)"],
          ["3", "O-RADS 3: Low risk (Smooth multilocular cyst <10 cm, unilocular with solid component/papillary, Doppler 1-2)"],
          ["4", "O-RADS 4: Intermediate risk (Multilocular with solid components, or solid mass with Doppler 2-3)"],
          ["5", "O-RADS 5: High risk (Solid mass with irregular contours, papillary projection with Doppler 4, or ascites/peritoneal nodules)"]
        ])
      ],
      table: {
        headers: ["O-RADS Tier", "Malignancy Risk", "Clinical Classification", "Recommended Management Strategy"],
        rows: [
          { id: "orads1", cols: ["O-RADS 1", "0%", "Normal Ovary", "No follow-up required"] },
          { id: "orads2", cols: ["O-RADS 2", "< 1%", "Almost Certainly Benign", "Observation or routine follow-up in 1 year; conservative non-surgical management"] },
          { id: "orads3", cols: ["O-RADS 3", "1% to < 10%", "Low Risk of Malignancy", "Management by general gynaecologist; pelvic MRI or ultrasound follow-up in 3–6 months"] },
          { id: "orads4", cols: ["O-RADS 4", "10% to < 50%", "Intermediate Risk", "Pelvic MRI with contrast and consultation with a Gynaecologic Oncologist"] },
          { id: "orads5", cols: ["O-RADS 5", "≥ 50%", "HIGH RISK of Malignancy", "Mandatory referral to a Gynaecologic Oncologist for surgical staging"] }
        ]
      },
      calc: function (v) {
        var m = v.morph;
        var match = "orads" + m;
        var title = "O-RADS " + m;
        var act = "";

        if (m === "5") act = "High Risk of Malignancy (≥50%). Urgent referral to Gynaecologic Oncology for CT staging and surgical debulking.";
        else if (m === "4") act = "Intermediate Risk (10–50%). Pelvic contrast MRI recommended; review in multidisciplinary tumor board.";
        else if (m === "3") act = "Low Risk (1–10%). Conservative surgical excision by general gynaecologist or follow-up ultrasound.";
        else if (m === "2") act = "Benign (<1%). Routine conservative management.";
        else act = "Normal physiologic ovary.";

        return {
          value: title + " Adnexal Lesion",
          matchId: match,
          eq: act
        };
      }
    },

    // ==============================================================
    // 28. ROMA (RISK OF OVARIAN MALIGNANCY ALGORITHM)
    // ==============================================================
    {
      id: "romaScore",
      cat: "obgyn",
      type: "calc",
      name: "Risk of Ovarian Malignancy Algorithm (ROMA)",
      desc: "Combines serum HE4 and CA-125 with menopausal status to calculate probability of finding epithelial ovarian cancer.",
      organ: "Ovary / Pelvic Peritoneum",
      region: "Gynaecologic Oncology / Serum Biomarkers",
      subject: "Gynaecologic Oncology / Pelvic Mass",
      keywords: ["roma", "he4", "ca125", "ovarian cancer", "adnexal mass", "menopause", "biomarker"],
      guidance: "1. Obtain serum Human Epididymis Protein 4 (HE4, pmol/L) and CA-125 (U/mL).\n2. Calculate the Predictive Index (PI) based on menopausal status:\n   - Premenopausal: PI = -12.0 + 2.38×ln(HE4) + 0.0626×ln(CA-125)\n   - Postmenopausal: PI = -8.09 + 1.04×ln(HE4) + 0.732×ln(CA-125)\n3. Calculate ROMA Score = exp(PI) / (1 + exp(PI)) × 100%.",
      contraindications: "Not validated in patients previously treated for ovarian malignancy or during pregnancy.",
      literature: [
        {
          type: "Seminal Multicenter Trial",
          icon: "📄",
          title: "Using a multi-marker model to predict malignancy of adnexal masses in pre- and postmenopausal women",
          citation: "Moore RG, McMeekin DS, Brown AK, et al. Gynecol Oncol. 2009;112(1):40-46.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/18851871/" }
          ]
        }
      ],
      fields: [
        makeS("menoStatus", "Menopausal Status", "post", [
          ["pre", "Premenopausal"],
          ["post", "Postmenopausal"]
        ]),
        makeN("he4", "Serum HE4 Level (pmol/L)", 110, { min: 10, max: 2000, step: 1 }),
        makeN("ca125", "Serum CA-125 Level (U/mL)", 85, { min: 1, max: 5000, step: 1 })
      ],
      table: {
        headers: ["Menopausal Status", "ROMA Threshold", "Stratified Risk Level", "Recommended Clinical Pathway"],
        rows: [
          { id: "low", cols: ["Premenopausal <13.1% / Postmenopausal <27.7%", "Low ROMA Score", "Low Risk of Epithelial Ovarian Cancer", "General gynaecology evaluation; conservative or laparoscopic management"] },
          { id: "high", cols: ["Premenopausal ≥13.1% / Postmenopausal ≥27.7%", "High ROMA Score", "HIGH RISK of Epithelial Ovarian Cancer", "Referral to multidisciplinary Gynaecologic Oncology surgical team"] }
        ]
      },
      calc: function (v) {
        var isPost = v.menoStatus === "post";
        var he4 = +v.he4, ca125 = +v.ca125;

        var lnHe4 = Math.log(he4);
        var lnCa125 = Math.log(ca125);

        var pi = isPost
          ? (-8.09 + (1.04 * lnHe4) + (0.732 * lnCa125))
          : (-12.0 + (2.38 * lnHe4) + (0.0626 * lnCa125));

        var roma = (Math.exp(pi) / (1 + Math.exp(pi))) * 100;
        var romaRounded = roma.toFixed(1);

        var cutoff = isPost ? 27.7 : 13.1;
        var isHigh = roma >= cutoff;
        var match = isHigh ? "high" : "low";

        return {
          value: "ROMA Probability: " + romaRounded + "%",
          matchId: match,
          eq: isHigh
            ? "HIGH RISK for ovarian cancer (Threshold ≥" + cutoff + "%). Refer directly to Gynaecologic Oncology."
            : "LOW RISK for epithelial ovarian cancer (<" + cutoff + "% threshold)."
        };
      }
    },

    // ==============================================================
    // 29. FIGO ENDOMETRIAL CANCER STAGING (2023 REVISION)
    // ==============================================================
    {
      id: "figoEndometrialCancer",
      cat: "obgyn",
      type: "class",
      name: "FIGO Endometrial Cancer Staging (2023)",
      desc: "Pathological and molecular staging of endometrial carcinoma incorporating myometrial depth, LVSI, and molecular subgroups.",
      organ: "Endometrium / Myometrium / Uterus",
      region: "Gynaecologic Oncology / Pelvis",
      subject: "Gynaecologic Oncology / Endometrial Carcinoma",
      keywords: ["endometrial cancer", "figo", "staging", "myometrial invasion", "lymphadenectomy", "pole", "p53", "mmr"],
      guidance: "1. Stage based on surgical hysterectomy and pathological assessment.\n2. Note depth of myometrial invasion (<50% vs ≥50%).\n3. Assess lymphovascular space invasion (LVSI) and cervical stroma.\n4. Screen for molecular classifiers (POLEmut, MMRd, NSMP, p53abn) under FIGO 2023.",
      contraindications: "Does not apply to uterine sarcomas or carcinosarcomas which follow dedicated staging systems.",
      literature: [
        {
          type: "Official FIGO Staging 2023",
          icon: "📘",
          title: "FIGO staging of endometrial cancer: 2023",
          citation: "Berek JS, Matias-Guiu X, Creutzberg C, et al. Int J Gynaecol Obstet. 2023;162(2):383-394.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/37337978/" }
          ]
        }
      ],
      fields: [
        makeS("anat", "Anatomical Extent of Invasion", "IA", [
          ["IA", "Stage IA: Confined to endometrium or < 50% myometrial invasion"],
          ["IB", "Stage IB: Invades ≥ 50% of the myometrium"],
          ["II", "Stage II: Extension to cervical stroma without extrauterine spread"],
          ["IIIA", "Stage IIIA: Invades serosa of corpus and/or adnexa"],
          ["IIIB", "Stage IIIB: Vaginal or parametrial involvement"],
          ["IIIC1", "Stage IIIC1: Metastasis to pelvic lymph nodes"],
          ["IIIC2", "Stage IIIC2: Metastasis to para-aortic lymph nodes"],
          ["IV", "Stage IV: Bladder/bowel mucosal invasion or distant organ metastases"]
        ]),
        makeS("molec", "Molecular Subgroup (FIGO 2023 Integration)", "nsmp", [
          ["nsmp", "NSMP (No Specific Molecular Profile / Normal p53)"],
          ["pole", "POLEmut (Pathogenic POLE mutation - Excellent prognosis)"],
          ["mmrd", "MMRd (Mismatch Repair Deficient / MSI-High)"],
          ["p53abn", "p53abn (Abnormal / mutant p53 - High risk of recurrence)"]
        ])
      ],
      table: {
        headers: ["FIGO 2023 Stage", "Molecular Integration", "Prognostic Impact", "Adjuvant Treatment"],
        rows: [
          { id: "stage1", cols: ["Stage I (IA / IB)", "POLEmut downstages to Stage I (even if IB/II)", "Favourable biological behavior", "Surveillance or vaginal brachytherapy; omit chemotherapy in POLEmut"] },
          { id: "stage2", cols: ["Stage II", "Cervical stromal invasion", "Intermediate risk", "Vaginal brachytherapy + external beam radiation therapy (EBRT)"] },
          { id: "stage3", cols: ["Stage III", "p53abn automatically upgrades stage IA/IB to Stage IIC/III", "High recurrence risk", "Chemoradiation (Carboplatin + Paclitaxel + EBRT)"] },
          { id: "stage4", cols: ["Stage IV", "Distant metastatic spread", "Advanced disease", "Systemic chemotherapy + immunotherapy (Dostarlimab/Pembrolizumab for MMRd)"] }
        ]
      },
      calc: function (v) {
        var anat = v.anat;
        var molec = v.molec;
        var match = "stage1";
        var finalStage = anat;

        if (molec === "pole" && (anat === "IA" || anat === "IB" || anat === "II")) {
          finalStage = "Stage IAAm (POLEmut - Favourable Downstaging)";
          match = "stage1";
        } else if (molec === "p53abn" && (anat === "IA" || anat === "IB")) {
          finalStage = "Stage IICmp53 (p53abn - Molecular High-Risk Upgrade)";
          match = "stage3";
        } else if (anat.startsWith("IIIC") || anat.startsWith("III")) {
          match = "stage3";
        } else if (anat === "IV") {
          match = "stage4";
        } else if (anat === "II") {
          match = "stage2";
        }

        return {
          value: "FIGO 2023: " + finalStage,
          matchId: match,
          eq: "Integrated anatomical and molecular classification per FIGO 2023 guidelines. Molecular profiling guides precision adjuvant therapy."
        };
      }
    },

    // ==============================================================
    // 30. FIGO OVARIAN / FALLOPIAN TUBE CANCER STAGING (2014)
    // ==============================================================
    {
      id: "figoOvarianCancer",
      cat: "obgyn",
      type: "class",
      name: "FIGO Ovarian & Fallopian Tube Cancer Staging",
      desc: "Surgical and pathological staging classification for carcinoma of the ovary, fallopian tube, and peritoneum.",
      organ: "Ovary / Fallopian Tube / Peritoneum / Omentum",
      region: "Gynaecologic Oncology / Peritoneal Cavity",
      subject: "Gynaecologic Oncology / Ovarian Carcinoma",
      keywords: ["ovarian cancer", "figo", "staging", "fallopian tube", "peritoneum", "ascites", "omental cake", "debulking"],
      guidance: "1. Stage surgically via exploratory laparotomy/laparoscopy, peritoneal washings, total hysterectomy, bilateral salpingo-oophorectomy, omentectomy, and pelvic/para-aortic lymphadenectomy.\n2. Stage I: Confined to ovaries/tubes.\n3. Stage II: Pelvic extension.\n4. Stage III: Microscopic/macroscopic peritoneal spread outside pelvis or retroperitoneal nodes.\n5. Stage IV: Distant parenchymal metastases or pleural effusion with positive cytology.",
      contraindications: "Clinical or radiological assessment alone cannot substitute for formal comprehensive surgical staging.",
      literature: [
        {
          type: "Official FIGO Staging",
          icon: "📘",
          title: "Staging classification for cancer of the ovary, fallopian tube, and peritoneum",
          citation: "Prat J; FIGO Committee on Gynecologic Oncology. Int J Gynaecol Obstet. 2014;124(1):1-5.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/24229970/" }
          ]
        }
      ],
      fields: [
        makeS("spread", "Maximal Anatomical Extent of Tumor", "IIIC", [
          ["IA", "Stage IA: Limited to 1 ovary/tube, capsule intact, no surface tumor, washings negative"],
          ["IB", "Stage IB: Involves both ovaries/tubes, capsule intact, washings negative"],
          ["IC", "Stage IC: Surgical capsule rupture, surface tumor, or positive malignant ascites/washings"],
          ["IIA", "Stage IIA: Extension and/or implants on uterus or fallopian tubes"],
          ["IIB", "Stage IIB: Extension to other pelvic intraperitoneal tissues (bladder, rectum, sigmoid)"],
          ["IIIA", "Stage IIIA: Positive retroperitoneal lymph nodes OR microscopic extrapelvic peritoneal spread"],
          ["IIIB", "Stage IIIB: Macroscopic extrapelvic peritoneal metastases ≤ 2 cm in greatest dimension"],
          ["IIIC", "Stage IIIC: Macroscopic extrapelvic peritoneal metastases > 2 cm (omental cake)"],
          ["IVA", "Stage IVA: Pleural effusion with positive cytology"],
          ["IVB", "Stage IVB: Parenchymal liver/spleen metastases or extra-abdominal lymph nodes"]
        ])
      ],
      table: {
        headers: ["FIGO Stage", "Anatomical Distribution", "Standard Primary Therapy"],
        rows: [
          { id: "stage1", cols: ["Stage I (IA, IB, IC)", "Confined to ovaries or fallopian tubes", "Complete surgical staging; adjuvant Carboplatin + Paclitaxel indicated for IC or high-grade serous"] },
          { id: "stage2", cols: ["Stage II (IIA, IIB)", "Pelvic extension below pelvic brim", "Primary debulking surgery followed by 6 cycles systemic IV chemotherapy"] },
          { id: "stage3", cols: ["Stage III (IIIA, IIIB, IIIC)", "Peritoneal metastases beyond pelvis or retroperitoneal nodes", "Maximal cytoreductive surgery (aiming for R0 complete resection) + systemic Carboplatin/Paclitaxel ± Bevacizumab / PARP inhibitors"] },
          { id: "stage4", cols: ["Stage IV (IVA, IVB)", "Pleural effusion or distant parenchymal organ metastases", "Neoadjuvant chemotherapy (NACT) with interval debulking surgery (IDS) or palliative systemic chemotherapy"] }
        ]
      },
      calc: function (v) {
        var s = v.spread;
        var match = "stage1";
        if (s.startsWith("IV")) match = "stage4";
        else if (s.startsWith("III")) match = "stage3";
        else if (s.startsWith("II")) match = "stage2";

        return {
          value: "FIGO Stage " + s,
          matchId: match,
          eq: "Stage dictates cytoreductive surgical intent and adjuvant platinum/taxane doublet therapy."
        };
      }
    },

    // ==============================================================
    // 31. FIGO / WHO PROGNOSTIC SCORING FOR GTN
    // ==============================================================
    {
      id: "gtnPrognosticScore",
      cat: "obgyn",
      type: "class",
      name: "FIGO / WHO Prognostic Scoring for GTN",
      desc: "Scores risk factors to stratify Gestational Trophoblastic Neoplasia into low-risk vs high-risk resistance.",
      organ: "Trophoblast / Uterus / Lung / Brain",
      region: "Gynaecologic Oncology / Trophoblastic Disease",
      subject: "Gynaecologic Oncology / GTD",
      keywords: ["gtn", "gtd", "molar pregnancy", "choriocarcinoma", "hcg", "methotrexate", "trophoblastic"],
      guidance: "1. Score risk factors: Age, Antecedent pregnancy, Interval from index pregnancy, Pre-treatment serum hCG, Largest tumor size, Site of metastases, Number of metastases, and Prior failed chemotherapy.\n2. Low-Risk GTN: Score ≤ 6 (Single-agent chemotherapy with Methotrexate or Actinomycin D).\n3. High-Risk GTN: Score ≥ 7 (Multi-agent chemotherapy with EMA-CO).",
      contraindications: "Does not apply to Placental Site Trophoblastic Tumors (PSTT) or Epithelioid Trophoblastic Tumors (ETT), which are inherently chemoresistant and require surgical hysterectomy.",
      literature: [
        {
          type: "Official FIGO Staging",
          icon: "📘",
          title: "FIGO staging for gestational trophoblastic neoplasia",
          citation: "FIGO Oncology Committee. Int J Gynaecol Obstet. 2002;77(3):285-287.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/12065147/" }
          ]
        },
        {
          type: "Seminal Review",
          icon: "📄",
          title: "Gestational trophoblastic disease: ESMO Clinical Practice Guidelines",
          citation: "Seckl MJ, Sebire NJ, Fisher RA, et al. Ann Oncol. 2013;24(Suppl 6):vi39-vi50.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/23970019/" }
          ]
        }
      ],
      fields: [
        makeS("age", "1. Patient Age", "0", [
          ["0", "< 40 years (0 pts)"],
          ["1", "≥ 40 years (1 pt)"]
        ]),
        makeS("preg", "2. Antecedent Pregnancy", "0", [
          ["0", "Hydatidiform Mole (0 pts)"],
          ["1", "Abortion / Miscarriage (1 pt)"],
          ["2", "Term pregnancy (2 pts)"]
        ]),
        makeS("interval", "3. Interval from Index Pregnancy", "0", [
          ["0", "< 4 months (0 pts)"],
          ["1", "4 to 6 months (1 pt)"],
          ["2", "7 to 12 months (2 pts)"],
          ["4", "> 12 months (4 pts)"]
        ]),
        makeS("hcg", "4. Pre-treatment Serum hCG (IU/L)", "0", [
          ["0", "< 1,000 (0 pts)"],
          ["1", "1,000 to 10,000 (1 pt)"],
          ["2", "> 10,000 to 100,000 (2 pts)"],
          ["4", "> 100,000 (4 pts)"]
        ]),
        makeS("size", "5. Largest Tumor Size", "0", [
          ["0", "< 3 cm (0 pts)"],
          ["1", "3 to 4 cm (1 pt)"],
          ["2", "≥ 5 cm (2 pts)"]
        ]),
        makeS("site", "6. Site of Metastases", "0", [
          ["0", "Lung (0 pts)"],
          ["1", "Spleen, Kidney (1 pt)"],
          ["2", "Gastrointestinal tract (2 pts)"],
          ["4", "Brain, Liver (4 pts)"]
        ]),
        makeS("numMets", "7. Number of Metastases Identified", "0", [
          ["0", "0 (none detected) (0 pts)"],
          ["1", "1 to 4 metastases (1 pt)"],
          ["2", "5 to 8 metastases (2 pts)"],
          ["4", "> 8 metastases (4 pts)"]
        ]),
        makeS("failedDrugs", "8. Prior Failed Chemotherapy", "0", [
          ["0", "None (0 pts)"],
          ["2", "Single drug failure (2 pts)"],
          ["4", "≥ 2 drugs failed (4 pts)"]
        ])
      ],
      table: {
        headers: ["Risk Score Group", "Total Points", "Chemotherapy Regimen", "Curative Expectation"],
        rows: [
          { id: "low", cols: ["Low-Risk GTN", "Score 0 to 6", "Single-Agent Chemotherapy (IM Methotrexate + Folinic Acid rescue or IV Actinomycin D)", "> 99% cure rate with low toxicity"] },
          { id: "high", cols: ["High-Risk GTN", "Score ≥ 7", "Multi-Agent Chemotherapy: EMA-CO (Etoposide, Methotrexate, Actinomycin D, Cyclophosphamide, Vincristine)", "85–95% cure rate; requires specialized tertiary trophoblastic center management"] }
        ]
      },
      calc: function (v) {
        var total = +v.age + +v.preg + +v.interval + +v.hcg + +v.size + +v.site + +v.numMets + +v.failedDrugs;
        var isHigh = total >= 7;
        var match = isHigh ? "high" : "low";

        var advice = isHigh
          ? "HIGH-RISK GTN (Score ≥ 7). Multi-agent chemotherapy (EMA-CO) indicated stat. Referral to specialized trophoblastic disease center."
          : "LOW-RISK GTN (Score ≤ 6). Single-agent intramuscular Methotrexate or pulsed Actinomycin D indicated.";

        return {
          value: "WHO/FIGO Score: " + total + " (" + (isHigh ? "High Risk" : "Low Risk") + ")",
          matchId: match,
          eq: advice
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
      if (window.categories[i] && window.categories[i].id === obgynCategory.id) {
        catExists = true;
        break;
      }
    }
    if (!catExists) {
      window.categories.push(obgynCategory);
    }

    obgynTools.forEach(function (tool) {
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
      window.SYNONYM_MAP["obgyn"] = ["obgyn", "pregnancy", "obstetrics", "gynaecology", "gynecology", "fetal", "cervix", "uterus", "ovary", "dating", "edd", "lmp", "doppler", "bpp", "vbac", "meows", "oasis", "hellp", "popq", "orads", "roma", "figo"];
      window.SYNONYM_MAP["preeclampsia"] = ["preeclampsia", "eclampsia", "hellp", "hypertension", "proteinuria", "magnesium"];
      window.SYNONYM_MAP["cervix"] = ["cervix", "bishop", "ripening", "induction", "dilation", "effacement", "cervical cancer", "figo"];
      window.SYNONYM_MAP["fetal"] = ["hadlock", "efw", "bpp", "manning", "afi", "amniotic", "doppler", "ctg", "ballard", "lmp", "edd"];
      window.SYNONYM_MAP["oncology"] = ["rmi", "orads", "roma", "figo", "cervical cancer", "endometrial cancer", "ovarian cancer", "gtn"];
    }

    if (typeof window.renderHome === "function") {
      window.renderHome();
    }
  } catch (err) {
    console.error("Critical error registering OB-GYN tools:", err);
  }
})();
