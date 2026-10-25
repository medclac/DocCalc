/**
 * MedCalc Module: Obstetrics & Gynaecology (OB-GYN)
 * Fully compatible with the MedCalc HTML application structure.
 * Includes structured reference tables (t.table), dynamic stage matching (r.matchId),
 * rich literature links (PubMed / DOI / Guidelines), and search metadata (organs, regions, keywords).
 */
(function () {
  "use strict";

  const obgynCategory = {
    id: "obgyn",
    name: "Obstetrics & Gynaecology",
    icon: "🤰",
    desc: "Obstetric dating, fetal growth, preeclampsia, labour scores, oncologic staging, and gynaecologic calculators",
    organs: ["uterus", "cervix", "ovary", "placenta", "fetus", "pelvis", "fallopian tube"],
    region: "pelvis / reproductive / obstetric"
  };

  // Helper constructors matching the main page
  const N = (id, label, value, extra = {}) => ({ id, label, value, type: "number", ...extra });
  const S = (id, label, value, options) => ({ id, label, value, type: "select", options });

  const obgynTools = [
    // ==============================================================
    // 1. BISHOP SCORE FOR CERVICAL RIPENING & INDUCTION
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
        S("dil", "1. Cervical Dilatation", "0", [
          ["0", "Closed (0 pts)"],
          ["1", "1–2 cm (1 pt)"],
          ["2", "3–4 cm (2 pts)"],
          ["3", "≥ 5 cm (3 pts)"]
        ]),
        S("eff", "2. Cervical Effacement", "0", [
          ["0", "0–30% (0 pts)"],
          ["1", "40–50% (1 pt)"],
          ["2", "60–70% (2 pts)"],
          ["3", "≥ 80% (3 pts)"]
        ]),
        S("stat", "3. Fetal Station (relative to ischial spines)", "0", [
          ["0", "-3 station (0 pts)"],
          ["1", "-2 station (1 pt)"],
          ["2", "-1 or 0 station (2 pts)"],
          ["3", "+1 or lower (+3 pts)"]
        ]),
        S("cons", "4. Cervical Consistency", "0", [
          ["0", "Firm (0 pts)"],
          ["1", "Medium (1 pt)"],
          ["2", "Soft (2 pts)"]
        ]),
        S("pos", "5. Cervical Position", "0", [
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
      calc: v => {
        const total = +v.dil + +v.eff + +v.stat + +v.cons + +v.pos;
        let match = "unfavourable";
        let interp = "Unfavourable cervix (Score ≤ 5). Pharmacological or mechanical ripening recommended before induction.";
        if (total >= 8) {
          match = "favourable";
          interp = "Favourable cervix (Score ≥ 8). High likelihood of successful vaginal birth; proceed with oxytocin induction / amniotomy.";
        } else if (total >= 6) {
          match = "intermediate";
          interp = "Intermediate cervix (Score 6–7). Evaluate parity, membrane status, and obstetric indications.";
        }
        return {
          value: `Bishop Score: ${total} / 13 Points`,
          matchId: match,
          eq: interp
        };
      }
    },

    // ==============================================================
    // 2. PREECLAMPSIA DIAGNOSIS & SEVERITY ASSESSMENT (ACOG 2020)
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
            { text: "DOI: 10.1097/AOG.0000000000003891", url: "https://doi.org/10.1097/AOG.0000000000003891", secondary: true }
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
        N("sbp", "Systolic Blood Pressure (mmHg)", 162, { min: 70, max: 260, step: 1 }),
        N("dbp", "Diastolic Blood Pressure (mmHg)", 108, { min: 40, max: 160, step: 1 }),
        N("upcr", "Urine Protein/Creatinine Ratio (mg/mg)", 0.45, { min: 0, max: 15, step: 0.05 }),
        S("severeEndOrgan", "Severe Systemic Features Present?", "1", [
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
      calc: v => {
        const s = +v.sbp, d = +v.dbp, upcr = +v.upcr;
        const severeBp = s >= 160 || d >= 110;
        const elevatedBp = s >= 140 || d >= 90;
        const prot = upcr >= 0.3;
        const hasSevere = severeBp || v.severeEndOrgan === "1";

        let cat = "normal", dx = "Normal Blood Pressure Profile", mgmt = "Blood pressures and laboratory criteria within standard range.";

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
          eq: `Clinical Pathway: ${mgmt}`
        };
      }
    },

    // ==============================================================
    // 3. APGAR SCORE (NEONATAL ASSESSMENT)
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
            { text: "DOI: 10.1542/peds.2015-2651", url: "https://doi.org/10.1542/peds.2015-2651", secondary: true }
          ]
        }
      ],
      fields: [
        S("app", "Appearance (Skin Color)", "2", [
          ["0", "Blue or pale all over (0 pts)"],
          ["1", "Pink body, blue extremities / acrocyanosis (1 pt)"],
          ["2", "Completely pink trunk and extremities (2 pts)"]
        ]),
        S("pulse", "Pulse (Heart Rate)", "2", [
          ["0", "Absent (0 pts)"],
          ["1", "< 100 beats/min (1 pt)"],
          ["2", "≥ 100 beats/min (2 pts)"]
        ]),
        S("grimace", "Grimace (Reflex Irritability)", "2", [
          ["0", "No response to stimulation (0 pts)"],
          ["1", "Grimace or feeble movement (1 pt)"],
          ["2", "Cry, cough, sneeze, or active withdrawal (2 pts)"]
        ]),
        S("act", "Activity (Muscle Tone)", "2", [
          ["0", "Limp / flaccid (0 pts)"],
          ["1", "Some flexion of extremities (1 pt)"],
          ["2", "Active motion, well flexed (2 pts)"]
        ]),
        S("resp", "Respiration", "2", [
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
      calc: v => {
        const score = +v.app + +v.pulse + +v.grimace + +v.act + +v.resp;
        let match = "normal";
        let text = "Normal transitional physiology. Reassure and maintain thermal warmth.";
        if (score <= 3) {
          match = "severe";
          text = "Severely depressed newborn. Immediate Neonatal Resuscitation Program (NRP) execution mandated.";
        } else if (score <= 6) {
          match = "moderate";
          text = "Moderately depressed infant. Requires positive pressure ventilation, airway support, and continuous reassessment.";
        }
        return {
          value: `Apgar: ${score} / 10 Points`,
          matchId: match,
          eq: text
        };
      }
    },

    // ==============================================================
    // 4. HADLOCK ESTIMATED FETAL WEIGHT (EFW)
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
            { text: "DOI: 10.1016/0002-9378(85)90298-4", url: "https://doi.org/10.1016/0002-9378(85)90298-4", secondary: true }
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
        N("bpd", "Biparietal Diameter (BPD, cm)", 8.4, { min: 2.0, max: 12.0, step: 0.1 }),
        N("hc", "Head Circumference (HC, cm)", 30.5, { min: 8.0, max: 40.0, step: 0.1 }),
        N("ac", "Abdominal Circumference (AC, cm)", 28.0, { min: 8.0, max: 45.0, step: 0.1 }),
        N("fl", "Femur Length (FL, cm)", 6.5, { min: 1.0, max: 10.0, step: 0.1 })
      ],
      table: {
        headers: ["EFW Weight Category", "Clinical Definition", "Key Obstetric Risks", "Management Considerations"],
        rows: [
          { id: "fgr", cols: ["FGR / SGA (< 10th percentile)", "EFW < 10th percentile for GA", "Stillbirth, acidosis, hypoglycemia", "Umbilical & MCA Doppler surveillance, antenatal testing"] },
          { id: "aga", cols: ["Appropriate for GA (10th–90th %ile)", "Normal physiological growth curve", "Standard baseline perinatal risk", "Routine prenatal care"] },
          { id: "lga", cols: ["LGA / Macrosomia (> 90th %ile / >4000g)", "Excessive fetal weight trajectory", "Shoulder dystocia, birth trauma, PPH", "Screen for gestational diabetes; discuss cesarean if EFW >4500-5000g"] }
        ]
      },
      calc: v => {
        const b = +v.bpd, h = +v.hc, a = +v.ac, f = +v.fl;
        // Hadlock formula: Log10(Weight) = 1.3596 - (0.00386*AC*FL) + (0.0064*HC) + (0.00061*BPD*AC) + (0.0424*AC) + (0.0174*FL)
        const logEfw = 1.3596 - (0.00386 * a * f) + (0.0064 * h) + (0.00061 * b * a) + (0.0424 * a) + (0.0174 * f);
        const efwGrams = Math.round(Math.pow(10, logEfw));
        const efwKg = (efwGrams / 1000).toFixed(2);

        let match = "aga";
        if (efwGrams < 2500) match = "fgr";
        else if (efwGrams >= 4000) match = "lga";

        return {
          value: `EFW: ${efwGrams} g (${efwKg} kg)`,
          matchId: match,
          eq: `Hadlock 4-parameter regression model:\nLog10(BW) = 1.3596 - (0.00386×AC×FL) + (0.0064×HC) + (0.00061×BPD×AC) + (0.0424×AC) + (0.0174×FL).\nTypical margin of error: ±10–15%. Correlate with customized gestational growth charts.`
        };
      }
    },

    // ==============================================================
    // 5. POSTPARTUM HAEMORRHAGE (PPH) SEVERITY STAGING
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
            { text: "DOI: 10.1016/S0140-6736(17)30638-4", url: "https://doi.org/10.1016/S0140-6736(17)30638-4", secondary: true }
          ]
        }
      ],
      fields: [
        N("lossMl", "Cumulative Measured Blood Loss (mL)", 1250, { min: 50, max: 6000, step: 50 }),
        S("deliveryMode", "Mode of Delivery", "vaginal", [
          ["vaginal", "Vaginal Delivery"],
          ["cesarean", "Cesarean Delivery"]
        ]),
        S("unstableVitals", "Hemodynamic Instability Present?", "0", [
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
      calc: v => {
        const ml = +v.lossMl;
        const unstable = v.unstableVitals === "1";
        let stage = "normal", title = "Physiologic Blood Loss", tx = "Normal third-stage loss. Continue standard post-delivery observation.";

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
          tx = "Initiate vigorous fundal massage, establish two 16G IV lines, start high-dose Oxytocin infusion (20–40 units in 1L crystalloid), and inspect for genital tract lacerations or retained placental fragments.";
        }

        return {
          value: title,
          matchId: stage,
          eq: tx
        };
      }
    },

    // ==============================================================
    // 6. GESTATIONAL DIABETES 75g OGTT INTERPRETATION
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
      contraindications: "Do not perform in acute gastroenteritis or post-bariatric surgery (risk of severe reactive hypoglycemia / dumping syndrome).",
      literature: [
        {
          type: "Seminal HAPO Study",
          icon: "📄",
          title: "Hyperglycemia and Adverse Pregnancy Outcomes (HAPO Study)",
          citation: "HAPO Study Cooperative Research Group. N Engl J Med. 2008;358(19):1991-2002.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/18463375/" },
            { text: "DOI: 10.1056/NEJMoa0707943", url: "https://doi.org/10.1056/NEJMoa0707943", secondary: true }
          ]
        },
        {
          type: "IADPSG Consensus Guidelines",
          icon: "📘",
          title: "IADPSG Recommendations on the Diagnosis and Classification of Hyperglycemia in Pregnancy",
          citation: "IADPSG Consensus Panel. Diabetes Care. 2010;33(3):676-682.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/20190296/" }
          ]
        }
      ],
      fields: [
        N("fpg", "Fasting Plasma Glucose (mg/dL)", 94, { min: 40, max: 300, step: 1 }),
        N("h1", "1-Hour Plasma Glucose (mg/dL)", 175, { min: 40, max: 400, step: 1 }),
        N("h2", "2-Hour Plasma Glucose (mg/dL)", 148, { min: 40, max: 400, step: 1 })
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
      calc: v => {
        const f = +v.fpg, h1 = +v.h1, h2 = +v.h2;
        const fAbn = f >= 92;
        const h1Abn = h1 >= 180;
        const h2Abn = h2 >= 153;
        const isGdm = fAbn || h1Abn || h2Abn;

        let exceeded = [];
        if (fAbn) exceeded.push(`Fasting ≥92 (val: ${f})`);
        if (h1Abn) exceeded.push(`1-hr ≥180 (val: ${h1})`);
        if (h2Abn) exceeded.push(`2-hr ≥153 (val: ${h2})`);

        return {
          value: isGdm ? "GESTATIONAL DIABETES DIAGNOSED" : "Normal 75g OGTT",
          matchId: isGdm ? "gdmPositive" : "fastingRow",
          eq: isGdm
            ? `Thresholds exceeded: ${exceeded.join(", ")}.\nPer IADPSG/WHO criteria, one single elevated value confirms GDM. Initiate medical nutrition therapy, blood glucose monitoring, and exercise.`
            : `All values normal (Fasting <92, 1-hr <180, 2-hr <153 mg/dL). Standard antenatal dietary advice.`
        };
      }
    },

    // ==============================================================
    // 7. ROTTERDAM PCOS CRITERIA
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
      guidance: "1. Exclude secondary causes (TSH, Prolactin, 17-OHP for CAH, Cushing's).\n2. Assess ovulatory dysfunction (cycle >35 days or <8 cycles/year).\n3. Assess hyperandrogenism (Ferriman-Gallwey hirsutism score or elevated serum free testosterone).\n4. Assess pelvic ultrasound (≥20 follicles per ovary or ovarian volume ≥10 mL).",
      contraindications: "Ultrasound criteria are non-specific in adolescents within 8 years of menarche due to normal multi-follicular ovarian physiology.",
      literature: [
        {
          type: "Rotterdam Consensus Conference",
          icon: "📄",
          title: "Revised 2003 consensus on diagnostic criteria for polycystic ovary syndrome (PCOS)",
          citation: "The Rotterdam ESHRE/ASRM-Sponsored PCOS Consensus Workshop Group. Fertil Steril. 2004;81(1):19-25.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/14711538/" },
            { text: "DOI: 10.1016/j.fertnstert.2003.10.004", url: "https://doi.org/10.1016/j.fertnstert.2003.10.004", secondary: true }
          ]
        },
        {
          type: "International Guideline (2023 Update)",
          icon: "📘",
          title: "Recommendations from the 2023 international evidence-based guideline for the assessment and management of PCOS",
          citation: "Teede HJ, Tay CT, Laven JSE, et al. Eur J Endocrinol. 2023;189(2):G43-G64.",
          links: [
            { text: "View Guideline (DOI) ↗", url: "https://doi.org/10.1093/ejendo/kvad052" }
          ]
        }
      ],
      fields: [
        S("oligo", "1. Ovulatory Dysfunction (Oligo/Anovulation)", "1", [
          ["1", "Present: Cycle length >35 days or <8 cycles/year"],
          ["0", "Absent: Regular predictable monthly ovulatory cycles"]
        ]),
        S("hyperandrogen", "2. Hyperandrogenism (Clinical or Biochemical)", "1", [
          ["1", "Present: Hirsutism (mFG ≥4-6), moderate/severe acne, or elevated testosterone"],
          ["0", "Absent: Normal androgens, no hirsutism"]
        ]),
        S("usPco", "3. Polycystic Ovarian Morphology on Ultrasound", "1", [
          ["1", "Present: ≥20 follicles (2–9mm) per ovary or ovarian volume ≥10 mL"],
          ["0", "Absent: Normal follicular counts and ovarian volume"]
        ])
      ],
      table: {
        headers: ["Phenotype", "Features Present", "Metabolic Risk Profile", "Diagnostic Status"],
        rows: [
          { id: "phenoA", cols: ["Phenotype A (Classic / Full)", "Anovulation + Hyperandrogenism + Polycystic Ovaries (3/3)", "Highest insulin resistance & cardiovascular risk", "PCOS Confirmed"] },
          { id: "phenoB", cols: ["Phenotype B (Non-PCO)", "Anovulation + Hyperandrogenism (2/3, normal US)", "High metabolic risk", "PCOS Confirmed"] },
          { id: "phenoC", cols: ["Phenotype C (Ovulatory)", "Hyperandrogenism + Polycystic Ovaries (2/3, regular cycles)", "Moderate metabolic risk", "PCOS Confirmed"] },
          { id: "phenoD", cols: ["Phenotype D (Non-Androgenic)", "Anovulation + Polycystic Ovaries (2/3, normal androgens)", "Lowest metabolic risk", "PCOS Confirmed"] },
          { id: "notPcos", cols: ["Incomplete Criteria", "Only 0 or 1 criterion satisfied", "Not consistent with PCOS", "PCOS Not Confirmed"] }
        ]
      },
      calc: v => {
        const o = +v.oligo, a = +v.hyperandrogen, u = +v.usPco;
        const count = o + a + u;
        let match = "notPcos", pheno = "PCOS Criteria Not Met (<2 criteria satisfied)";

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
          eq: "Rotterdam 2003 / International 2023 Criteria: Requires ≥2 of 3 features after secondary etiologies (thyroid, prolactin, CAH) have been excluded."
        };
      }
    },

    // ==============================================================
    // 8. RISK OF MALIGNANCY INDEX (RMI I) FOR ADNEXAL MASSES
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
      guidance: "1. Determine menopausal status (Premenopausal M=1, Postmenopausal M=3).\n2. Count ultrasound score (multilocular, solid areas, bilateral, ascites, intra-abdominal mets): 0 features = U0, 1 feature = U1, ≥2 features = U3.\n3. Enter serum CA-125 in U/mL.\n4. Calculate RMI = U × M × CA-125.",
      contraindications: "Serum CA-125 is frequently elevated in benign premenopausal conditions (endometriosis, adenomyosis, PID, fibroids). RMI is most accurate in postmenopausal women.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "A risk of malignancy index incorporating CA 125, ultrasound and menopausal status for ovarian cancer",
          citation: "Jacobs I, Oram D, Fairbanks J, et al. Br J Obstet Gynaecol. 1990;97(10):922-929.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/2223684/" },
            { text: "DOI: 10.1111/j.1471-0528.1990.tb02448.x", url: "https://doi.org/10.1111/j.1471-0528.1990.tb02448.x", secondary: true }
          ]
        },
        {
          type: "NICE Clinical Guideline",
          icon: "📘",
          title: "Ovarian cancer: recognition and initial management (NICE Guideline CG122)",
          citation: "National Institute for Health and Care Excellence (NICE). London; 2011 (updated 2020).",
          links: [
            { text: "View NICE Guidelines ↗", url: "https://www.nice.org.uk/guidance/cg122" }
          ]
        }
      ],
      fields: [
        S("meno", "Menopausal Status", "post", [
          ["pre", "Premenopausal (M = 1)"],
          ["post", "Postmenopausal (M = 3)"]
        ]),
        S("usFeatures", "Ultrasound Features (multilocular, solid components, bilateral, ascites, mets)", "2", [
          ["0", "0 features (U = 0)"],
          ["1", "1 feature (U = 1)"],
          ["2", "≥ 2 features (U = 3)"]
        ]),
        N("ca125", "Serum CA-125 Level (U/mL)", 125, { min: 1, max: 10000, step: 1 })
      ],
      table: {
        headers: ["RMI Score Range", "Malignancy Probability", "Clinical Risk Group", "Recommended Pathway"],
        rows: [
          { id: "low", cols: ["RMI < 25", "< 3%", "Low Risk", "General gynaecology follow-up or conservative laparoscopic surgery"] },
          { id: "mod", cols: ["RMI 25 – 200", "10 – 20%", "Intermediate Risk", "Pelvic MRI / CT abdomen-pelvis, specialized gynaecologist review"] },
          { id: "high", cols: ["RMI > 200", "70 – 85%", "HIGH RISK of Malignancy", "Urgent referral to multidisciplinary Gynaecologic Oncology Centre"] }
        ]
      },
      calc: v => {
        const m = v.meno === "post" ? 3 : 1;
        const u = v.usFeatures === "0" ? 0 : v.usFeatures === "1" ? 1 : 3;
        const rmi = Math.round(u * m * +v.ca125);

        let match = "low";
        let rec = "Low risk adnexal mass. Conservative management or standard benign gynaecologic surgical excision.";
        if (rmi > 200) {
          match = "high";
          rec = "HIGH RISK FOR OVARIAN CANCER (RMI > 200). Sensitivity ~80%, Specificity ~90%. Urgent staging CT and referral to Gynaecologic Oncology multidisciplinary team.";
        } else if (rmi >= 25) {
          match = "mod";
          rec = "Moderate risk adnexal mass. Recommend pelvic MRI and discussion in gynaecological tumor board.";
        }

        return {
          value: `RMI Score: ${rmi}`,
          matchId: match,
          eq: `Formula: RMI = Ultrasound (${u}) × Menopause (${m}) × CA-125 (${v.ca125} U/mL).\n${rec}`
        };
      }
    },

    // ==============================================================
    // 9. FIGO CERVICAL CANCER STAGING (2018 REVISED)
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
      guidance: "1. Perform clinical pelvic examination, examination under anesthesia (EUA), and imaging (MRI/PET-CT).\n2. Note primary tumor dimensions (depth of invasion and largest horizontal diameter).\n3. Assess involvement of upper vs lower vagina, parametria, pelvic wall, or adjacent organs.\n4. Screen for pelvic (IIIC1) or para-aortic (IIIC2) lymphadenopathy.",
      contraindications: "Does not apply to primary vaginal carcinomas or uterine corpus malignancies.",
      literature: [
        {
          type: "Official FIGO Staging Guidelines",
          icon: "📘",
          title: "Revised FIGO staging for carcinoma of the cervix uteri",
          citation: "Bhatla N, Berek JS, Cuello Fredes M, et al. Int J Gynaecol Obstet. 2019;145(1):129-135.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/30656682/" },
            { text: "DOI: 10.1002/ijgo.12749", url: "https://doi.org/10.1002/ijgo.12749", secondary: true }
          ]
        }
      ],
      fields: [
        S("extent", "Primary Tumor Extension (Local/Regional)", "IB1", [
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
        S("nodes", "Lymph Node Status (Radiological or Pathological)", "none", [
          ["none", "No metastatic pelvic or para-aortic lymph nodes detected"],
          ["pelvic", "Pelvic lymph node metastasis (upgrades to Stage IIIC1)"],
          ["paraaortic", "Para-aortic lymph node metastasis (upgrades to Stage IIIC2)"]
        ])
      ],
      table: {
        headers: ["FIGO Stage", "Anatomical Criteria", "Standard Clinical Treatment Approach"],
        rows: [
          { id: "IA1", cols: ["Stage IA1", "Microscopic invasion < 3 mm depth", "Fertility-sparing conization (negative margins) or simple total hysterectomy"] },
          { id: "IA2_IB1", cols: ["Stage IA2 / IB1", "Invasion < 2 cm", "Radical hysterectomy + bilateral pelvic lymphadenectomy OR radical trachelectomy"] },
          { id: "IB2_IIA1", cols: ["Stage IB2 / IIA1", "Invasion 2 to < 4 cm", "Radical hysterectomy or concurrent chemoradiation"] },
          { id: "locallyAdvanced", cols: ["Stage IB3, IIB, III, IVA", "Tumor ≥ 4 cm, parametrial invasion, or pelvic wall", "Definitive concurrent chemoradiotherapy (Cisplatin + EBRT + intracavitary brachytherapy)"] },
          { id: "distant", cols: ["Stage IVB", "Distant metastatic spread", "Systemic chemotherapy + immunotherapy (Pembrolizumab) + palliative RT"] }
        ]
      },
      calc: v => {
        let finalStage = v.extent;
        let match = "locallyAdvanced";

        if (v.nodes === "pelvic" && !v.extent.startsWith("IV")) {
          finalStage = "Stage IIIC1 (Pelvic lymph node metastasis)";
        } else if (v.nodes === "paraaortic" && !v.extent.startsWith("IV")) {
          finalStage = "Stage IIIC2 (Para-aortic lymph node metastasis)";
        }

        if (finalStage === "IA1") match = "IA1";
        else if (finalStage === "IA2" || finalStage === "IB1") match = "IA2_IB1";
        else if (finalStage === "IB2") match = "IB2_IIA1";
        else if (finalStage === "IVB") match = "distant";

        let plan = "Locally Advanced Disease: Standard of care is definitive concurrent chemoradiotherapy (weekly cisplatin + external beam radiation therapy + image-guided brachytherapy).";
        if (match === "IA1" || match === "IA2_IB1") {
          plan = "Early-Stage Disease: Amenable to primary surgical management (radical hysterectomy + lymphadenectomy) or fertility-sparing trachelectomy.";
        } else if (match === "distant") {
          plan = "Metastatic Stage IVB: Palliative systemic platinum-based chemotherapy + Bevacizumab ± Pembrolizumab immunotherapy.";
        }

        return {
          value: `FIGO: ${finalStage}`,
          matchId: match,
          eq: `Management Protocol: ${plan}\nNote: Under 2018 FIGO rules, radiological or histological nodal metastases automatically categorize the tumor as Stage IIIC.`
        };
      }
    },

    // ==============================================================
    // 10. GANZONI FORMULA (IRON DEFICIT CALCULATOR)
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
      guidance: "1. Obtain patient's current actual body weight in kilograms.\n2. Enter current venous hemoglobin (g/dL).\n3. Standard target hemoglobin in pregnancy is 11.0 g/dL.\n4. Standard depot iron store in pregnancy is 500 mg.",
      contraindications: "Contraindicated in 1st trimester of pregnancy, active severe systemic infection, iron overload syndromes, or known hypersensitivity to IV iron formulations.",
      literature: [
        {
          type: "Historical Landmark Paper",
          icon: "📄",
          title: "Intravenous iron-dextran: therapeutic and experimental possibilities",
          citation: "Ganzoni AM. Schweiz Med Wochenschr. 1970;100(46):1962-1963.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/5487770/" }
          ]
        },
        {
          type: "UK Clinical Practice Guideline",
          icon: "📘",
          title: "UK guidelines on the management of iron deficiency in pregnancy",
          citation: "Pavord S, Daru J, Prasannan N, et al. Br J Haematol. 2020;188(6):819-830.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/31576570/" },
            { text: "DOI: 10.1111/bjh.16221", url: "https://doi.org/10.1111/bjh.16221", secondary: true }
          ]
        }
      ],
      fields: [
        N("weight", "Actual Body Weight (kg)", 62, { min: 30, max: 200, step: 0.5 }),
        N("actualHb", "Current Hemoglobin (g/dL)", 8.4, { min: 3.0, max: 16.0, step: 0.1 }),
        N("targetHb", "Target Hemoglobin (g/dL)", 11.0, { min: 10.0, max: 14.0, step: 0.1 }),
        N("depot", "Iron Depot Stores (mg)", 500, { min: 0, max: 1000, step: 50 })
      ],
      calc: v => {
        const wt = +v.weight, curHb = +v.actualHb, tgtHb = +v.targetHb, depot = +v.depot;
        const deficit = (wt * (tgtHb - curHb) * 2.4) + depot;
        const roundedDeficit = Math.max(0, Math.round(deficit));
        const fcmVials500 = Math.ceil(roundedDeficit / 500);
        const ironSucrose100 = Math.ceil(roundedDeficit / 100);

        return {
          value: `${roundedDeficit} mg Elemental Iron Deficit`,
          eq: `Ganzoni Equation:\nTotal Deficit (mg) = [Weight (kg) × (Target Hb − Actual Hb) × 2.4] + Depot (${depot} mg).\n\nParenteral Administration Equivalents:\n• Ferric Carboxymaltose (FCM): ~${fcmVials500} vial(s) of 500 mg IV infusion.\n• Iron Sucrose: ~${ironSucrose100} ampoule(s) of 100 mg IV slow infusion.`
        };
      }
    }
  ];

  // ==============================================================
  // REGISTRATION & AUTO-SYNC INTO APPLICATION MEMORY
  // ==============================================================
  function registerModule() {
    if (typeof window === "undefined") return;

    window.categories = window.categories || [];
    window.tools = window.tools || [];

    // 1. Add category if missing
    if (!window.categories.some(c => c.id === obgynCategory.id)) {
      window.categories.push(obgynCategory);
    }

    // 2. Add tools if missing
    obgynTools.forEach(tool => {
      const existingIdx = window.tools.findIndex(t => t.id === tool.id);
      if (existingIdx >= 0) {
        window.tools[existingIdx] = tool;
      } else {
        window.tools.push(tool);
      }
    });

    // 3. Extend search synonym map
    if (typeof window.SYNONYM_MAP === "object" && window.SYNONYM_MAP !== null) {
      window.SYNONYM_MAP["obgyn"] = ["obgyn", "pregnancy", "obstetrics", "gynaecology", "gynecology", "fetal", "cervix", "uterus", "ovary"];
      window.SYNONYM_MAP["preeclampsia"] = ["preeclampsia", "eclampsia", "hellp", "hypertension", "proteinuria", "magnesium"];
      window.SYNONYM_MAP["cervix"] = ["cervix", "bishop", "ripening", "induction", "dilation", "effacement", "cervical cancer", "figo"];
    }

    // 4. Force a render if the UI engine is ready
    if (typeof window.renderHome === "function") {
      window.renderHome();
    }
  }

  // Register immediately into arrays
  registerModule();

  // Also trigger render after window fully finishes loading
  window.addEventListener("load", function () {
    registerModule();
  });
})();

