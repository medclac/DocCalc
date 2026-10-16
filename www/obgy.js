// obgy.js
(function () {
  window.MedCalcModules = window.MedCalcModules || [];

  const category = {
    id: "obgy",
    name: "Obstetrics & Gynaecology",
    icon: "🤰",
    desc: "Obstetric dating, risk scores, labour progress, hypertensive disorders, oncologic staging, and clinical calculators"
  };

  const guidance = {
    // 1. Obstetric Dating and Pregnancy Assessment
    eddGestAge: [
      "Naegele's rule calculates EDD as LMP + 280 days (or LMP + 7 days - 3 months + 1 year for 28-day cycles).",
      "Ultrasound crown-rump length (CRL) before 14 weeks is the gold standard for clinical dating if discordant with LMP by >5–7 days."
    ],
    bppScore: [
      "Biophysical Profile (Manning BPP) scores 5 biophysical variables (2 or 0 each): NST, breathing, movement, tone, and amniotic fluid volume (SDP >2 cm).",
      "Score 8/10 or 10/10 indicates fetal wellbeing; ≤4/10 indicates severe chronic asphyxia requiring delivery evaluation."
    ],
    afiSdp: [
      "AFI (four quadrants sum): Oligohydramnios <5 cm; Normal 5–24 cm; Polyhydramnios ≥25 cm.",
      "SDP (Single Deepest Vertical Pocket): Oligohydramnios <2 cm; Normal 2–8 cm; Polyhydramnios >8 cm."
    ],
    hadlockEfw: [
      "Hadlock 4-parameter formula combines BPD, HC, AC, and FL to estimate fetal weight within ~10–15% mean absolute error.",
      "Abdominal circumference (AC) reflects fetal hepatic glycogen storage and is the most sensitive metric for growth restriction (FGR)."
    ],

    // 2. Antenatal Screening and Risk Assessment
    combinedScreening: [
      "Combines maternal age, fetal NT, serum PAPP-A, and free β-hCG between 11+0 and 13+6 weeks.",
      "Trisomy 21 is classically characterized by increased NT, decreased PAPP-A (<0.4 MoM), and elevated free β-hCG (>2.0 MoM)."
    ],
    ogttDiagnosis: [
      "IADPSG/WHO 75g 2-hour OGTT criteria (GDM diagnosed if any 1 value met): Fasting ≥92 mg/dL (5.1 mmol/L), 1-hour ≥180 mg/dL (10.0 mmol/L), 2-hour ≥153 mg/dL (8.5 mmol/L).",
      "DIPSI guidelines (commonly used in resource-limited settings) consider 2-hour post 75g non-fasting glucose ≥140 mg/dL diagnostic."
    ],

    // 3. Obstetric Scores and Classifications
    apgarScore: [
      "Assessed at 1 and 5 minutes (and 10 mins if <7): Appearance, Pulse, Grimace, Activity, Respiration (0–2 points each).",
      "Score 7–10 is normal; 4–6 moderately abnormal; 0–3 requires immediate active neonatal resuscitation."
    ],
    meowsScore: [
      "Modified Early Obstetric Warning Score: triggers immediate bedside multi-disciplinary review for physiologic extremes in obstetric physiology.",
      "Differentiates Yellow (early alert) and Red triggers (critical maternal deterioration)."
    ],
    shockIndex: [
      "Obstetric Shock Index = Heart Rate (HR) ÷ Systolic Blood Pressure (SBP). Normal obstetric range is 0.7–0.9.",
      "An OSI >0.9 indicates significant occult hypovolemia; OSI ≥1.4 indicates critical uncompensated shock requiring massive transfusion protocol."
    ],

    // 4. Labour and Delivery
    bishopScore: [
      "Evaluates cervix for induction readiness: Dilatation (0–3), Effacement (0–3), Station (0–3), Consistency (0–2), Position (0–2).",
      "Bishop Score ≥8 predicts high likelihood of vaginal delivery (favourable cervix); ≤6 indicates unfavourable cervix requiring ripening."
    ],
    vbacSuccess: [
      "Grobman VBAC / TOLAC prediction model integrates maternal age, BMI, prior vaginal delivery, prior VBAC, and recurring indication for prior cesarean.",
      "Success probability ≥60–70% is generally considered favourable for offering trial of labour."
    ],
    oxytocinInfusion: [
      "Standard low-dose oxytocin protocol: 1–2 mU/min starting dose, titrated by 1–2 mU/min every 30 minutes until 3–4 contractions per 10 minutes.",
      "Calculation: Infusion rate (mL/h) = [Desired mU/min × 60 min/h] ÷ [Units added in 500 mL × 2 mU/mL per unit]."
    ],

    // 5. Obstetric Emergencies
    pphAssessment: [
      "Postpartum Haemorrhage is defined as cumulative blood loss ≥500 mL following vaginal delivery or ≥1000 mL following cesarean delivery.",
      "Massive PPH (>1500 mL or vitals instability) mandates activation of institutional MTP, uterotonics, tranexamic acid, and surgical tamponade."
    ],
    hellpCriteria: [
      "Tennessee criteria: Hemolysis (microangiopathic smear, total bilirubin ≥1.2 mg/dL, or LDH >600 U/L), Elevated liver enzymes (AST ≥70 U/L), Low Platelets (<100,000/µL).",
      "Definitive cure is delivery after maternal stabilization."
    ],
    mgso4Dosing: [
      "Pritchard Regimen: 4g IV + 10g IM (5g each buttock) loading dose, then 5g IM every 4 hours alternating buttocks.",
      "Zuspan Regimen: 4g IV loading dose over 15–20 minutes, followed by 1–2 g/h continuous IV infusion.",
      "Monitor patellar reflexes, respiratory rate (>12/min), and urine output (>25–30 mL/h) to prevent toxicity. Antidote: 10% Calcium Gluconate 10 mL IV."
    ],

    // 6. Hypertensive Disorders of Pregnancy
    preeclampsiaDiag: [
      "Gestational hypertension (SBP ≥140 or DBP ≥90 after 20 weeks) PLUS either proteinuria (≥300 mg/24h or UPCR ≥0.3) OR severe systemic features.",
      "Severe features include: severe BP (≥160/110), platelets <100,000, serum Cr >1.1 mg/dL, elevated transaminases (>2x normal), pulmonary edema, or persistent cerebral/visual symptoms."
    ],

    // 7. Gynaecological Menstrual Disorders
    palmCoein: [
      "FIGO classification for Abnormal Uterine Bleeding (AUB): Structural (Polyp, Adenomyosis, Leiomyoma, Malignancy & hyperplasia) and Non-structural (Coagulopathy, Ovulatory dysfunction, Endometrial, Iatrogenic, Not otherwise classified).",
      "Guides non-invasive imaging versus hormonal/surgical interventions."
    ],
    rotterdamPcos: [
      "Requires ≥2 of 3 criteria (after excluding CAH, hyperprolactinemia, thyroid disorders): 1. Oligo- or anovulation, 2. Clinical and/or biochemical hyperandrogenism, 3. Polycystic ovarian morphology on US (≥20 follicles per ovary or volume ≥10 mL)."
    ],

    // 8. Infertility and Reproductive Medicine
    ovarianReserve: [
      "AMH <1.0 ng/mL or AFC <5–7 follicles denotes diminished ovarian reserve (Bologna / POSEIDON criteria).",
      "AMH >3.5 ng/mL suggests high response and heightened risk for Ovarian Hyperstimulation Syndrome (OHSS)."
    ],
    whoSemenRef: [
      "WHO 6th Edition (2021) lower reference limits: Volume 1.4 mL, Total count 39 million/ejaculate, Concentration 16 million/mL, Progressive motility 30%, Total motility 42%, Normal forms 4%."
    ],

    // 9. Contraception and Family Planning
    whoMecContraception: [
      "Category 1: No restriction; Category 2: Advantages outweigh risks; Category 3: Risks outweigh advantages; Category 4: Unacceptable health risk (contraindicated).",
      "COCs are Category 4 in migraine with aura, BP ≥160/100, active VTE, postpartum <3 weeks non-breastfeeding or <6 weeks breastfeeding, and age ≥35 smoking ≥15 cigarettes/day."
    ],

    // 10. Gynaecological Oncology
    figoCervix: [
      "FIGO 2018 Staging for Carcinoma of the Cervix: Stage I confined to cervix; Stage II extends beyond uterus without pelvic wall/lower third vagina; Stage III pelvic sidewall/lower vagina or hydronephrosis/lymph node involvement (IIIC1 pelvic, IIIC2 para-aortic); Stage IV mucosa of bladder/rectum or distant."
    ],
    rmiOvarian: [
      "Risk of Malignancy Index (RMI I) = U × M × Serum CA-125 (U/mL).",
      "U (Ultrasound: multilocular, solid, bilateral, ascites, metastases; 0=0, 1=1, ≥2=3), M (Menopausal status: pre=1, post=3). Score >200 carries ~75% malignancy risk."
    ],

    // 11. Common Gynaecological Scores
    popqGrading: [
      "Pelvic Organ Prolapse Quantification: Stage 0 (no prolapse); Stage 1 (leading edge >1 cm above hymen); Stage 2 (leading edge between 1 cm above and 1 cm below hymen); Stage 3 (leading edge >1 cm below hymen but less than total vaginal length - 2 cm); Stage 4 (complete eversion / procidentia)."
    ],

    // 12. Drug and Clinical Calculators
    ganzoniIron: [
      "Total Iron Deficit (mg) = [Body Weight (kg) × (Target Hb − Actual Hb) × 2.4] + Iron Stores Depot (500 mg).",
      "Essential for calculating parenteral iron sucrose / ferric carboxymaltose requirements in maternal severe anemia."
    ],

    // 13. Ultrasound and Measurements
    crlDating: [
      "Gestational age (days) ≈ CRL (mm) + 42. Validated between 6 and 14 weeks gestation (CRL 5–84 mm).",
      "Most accurate method for pregnancy dating with a margin of error of ±3 to 5 days."
    ]
  };

  const tools = [
    // ==========================================
    // 1. OBSTETRIC DATING & PREGNANCY ASSESSMENT
    // ==========================================
    {
      id: "eddLmpCalc",
      cat: "obgy",
      subcat: "Obstetric Dating and Pregnancy Assessment",
      name: "EDD and Gestational Age Calculator",
      desc: "Calculates Estimated Date of Delivery (Naegele's rule) and current Gestational Age from LMP.",
      fields: [
        N("cycleDays", "Average Menstrual Cycle Length (days)", 28, { min: 21, max: 45, step: 1 }),
        N("daysSinceLmp", "Days Elapsed Since First Day of LMP", 98, { min: 0, max: 320, step: 1 })
      ],
      calc: v => {
        const cycleAdj = +v.cycleDays - 28;
        const totalEddDays = 280 + cycleAdj;
        const gaDays = +v.daysSinceLmp;
        const gaWeeks = Math.floor(gaDays / 7);
        const gaRemDays = gaDays % 7;
        const daysToDelivery = totalEddDays - gaDays;

        let trimester = "";
        if (gaWeeks < 13) trimester = "First Trimester (0 to 12+6 weeks)";
        else if (gaWeeks < 28) trimester = "Second Trimester (13+0 to 27+6 weeks)";
        else if (gaWeeks <= 42) trimester = "Third Trimester (28+0 weeks to delivery)";
        else trimester = "Post-term (>42+0 weeks)";

        return {
          value: `GA: ${gaWeeks} weeks ${gaRemDays} days (${trimester})`,
          eq: `Naegele's formula adjusted for ${v.cycleDays}-day cycle. Total pregnancy duration = ${totalEddDays} days. Days remaining to EDD = ${daysToDelivery >= 0 ? daysToDelivery : 0} days.`
        };
      }
    },
    {
      id: "hadlockEfw",
      cat: "obgy",
      subcat: "Obstetric Dating and Pregnancy Assessment",
      name: "Estimated Fetal Weight (Hadlock 4-Parameter)",
      desc: "Hadlock ultrasound formula utilizing BPD, HC, AC, and FL.",
      fields: [
        N("bpd", "Biparietal Diameter (BPD, cm)", 8.2, { min: 2.0, max: 12.0, step: 0.1 }),
        N("hc", "Head Circumference (HC, cm)", 30.0, { min: 8.0, max: 40.0, step: 0.1 }),
        N("ac", "Abdominal Circumference (AC, cm)", 28.5, { min: 8.0, max: 45.0, step: 0.1 }),
        N("fl", "Femur Length (FL, cm)", 6.4, { min: 1.0, max: 10.0, step: 0.1 })
      ],
      calc: v => {
        const b = +v.bpd, h = +v.hc, a = +v.ac, f = +v.fl;
        // Hadlock formula: Log10 EFW = 1.3596 - (0.00386 * AC * FL) + (0.0064 * HC) + (0.00061 * BPD * AC) + (0.0424 * AC) + (0.0174 * FL)
        const logEfw = 1.3596 - (0.00386 * a * f) + (0.0064 * h) + (0.00061 * b * a) + (0.0424 * a) + (0.0174 * f);
        const efwGrams = Math.round(Math.pow(10, logEfw));
        return {
          value: `EFW: ${efwGrams} grams (~${(efwGrams / 1000).toFixed(2)} kg)`,
          eq: "Hadlock 4-parameter regression equation: Log10(Weight) = 1.3596 - (0.00386×AC×FL) + (0.0064×HC) + (0.00061×BPD×AC) + (0.0424×AC) + (0.0174×FL). Expected error range: ±10–15%."
        };
      }
    },
    {
      id: "afiSdpCalc",
      cat: "obgy",
      subcat: "Obstetric Dating and Pregnancy Assessment",
      name: "Amniotic Fluid Assessment (AFI & SDP)",
      desc: "Amniotic Fluid Index (four-quadrant sum) and Single Deepest Pocket classification.",
      fields: [
        N("afi", "Amniotic Fluid Index (AFI sum, cm)", 12.5, { min: 0, max: 45.0, step: 0.5 }),
        N("sdp", "Single Deepest Vertical Pocket (SDP, cm)", 4.2, { min: 0, max: 18.0, step: 0.2 })
      ],
      calc: v => {
        const afi = +v.afi, sdp = +v.sdp;
        let afiInterp = afi < 5.0 ? "Oligohydramnios (<5.0 cm)" : afi <= 24.0 ? "Normal AFI (5.0–24.0 cm)" : "Polyhydramnios (>24.0 cm)";
        let sdpInterp = sdp < 2.0 ? "Oligohydramnios (<2.0 cm)" : sdp <= 8.0 ? "Normal SDP (2.0–8.0 cm)" : "Polyhydramnios (>8.0 cm)";
        return {
          value: `AFI: ${afi} cm (${afiInterp}) | SDP: ${sdp} cm (${sdpInterp})`,
          eq: "Clinical consensus: SDP is preferred over AFI in low-risk singleton pregnancies to reduce unnecessary inductions without increasing adverse outcomes."
        };
      }
    },
    {
      id: "bppScore",
      cat: "obgy",
      subcat: "Obstetric Dating and Pregnancy Assessment",
      name: "Manning Biophysical Profile (BPP)",
      desc: "Fetal wellbeing score evaluating 5 ultrasonographic & cardiotocographic parameters.",
      fields: [
        S("nst", "1. Non-Stress Test (Reactive)", "2", [["2", "Reactive: ≥2 accelerations (≥15 bpm for 15s) in 20–40 min (+2)"], ["0", "Non-reactive (+0)"]]),
        S("breathing", "2. Fetal Breathing Movements", "2", [["2", "Present: ≥1 episode of rhythmic breathing lasting ≥30s in 30 min (+2)"], ["0", "Absent / <30s (+0)"]]),
        S("movement", "3. Gross Fetal Body Movements", "2", [["2", "Present: ≥3 discrete body or limb movements in 30 min (+2)"], ["0", "<3 movements (+0)"]]),
        S("tone", "4. Fetal Muscle Tone", "2", [["2", "Present: ≥1 episode of active extension with return to flexion (+2)"], ["0", "Absent / slow extension without flexion (+0)"]]),
        S("fluid", "5. Amniotic Fluid Volume", "2", [["2", "Normal: ≥1 vertical pocket of fluid measuring ≥2 cm (+2)"], ["0", "Oligohydramnios: deepest pocket <2 cm (+0)"]]),
      ],
      calc: v => {
        const score = +v.nst + +v.breathing + +v.movement + +v.tone + +v.fluid;
        let interp = "";
        if (score >= 8) interp = "Normal / Low risk of chronic asphyxia (Conservative management)";
        else if (score === 6) interp = "Equivocal / Possible fetal asphyxia (Repeat test within 24h or deliver if at term/oligohydramnios)";
        else interp = "Abnormal / High risk of fetal asphyxia (Immediate delivery evaluation)";
        return {
          value: `BPP Score: ${score} / 10 — ${interp}`,
          eq: "Each parameter is scored as 2 (Normal) or 0 (Abnormal). Score of 8/8 without NST is clinically equivalent to 10/10."
        };
      }
    },
    {
      id: "gestationalWeightGain",
      cat: "obgy",
      subcat: "Obstetric Dating and Pregnancy Assessment",
      name: "Pregnancy Weight Gain & BMI Target (IOM Guidelines)",
      desc: "Calculates pre-pregnancy BMI and recommended gestational weight gain ranges.",
      fields: [
        N("weight", "Pre-pregnancy Weight (kg)", 60, { min: 30, max: 200, step: 0.5 }),
        N("height", "Height (cm)", 160, { min: 120, max: 210, step: 1 }),
        S("twins", "Singleton or Twin Gestation?", "1", [["1", "Singleton"], ["2", "Twins"]])
      ],
      calc: v => {
        const hM = +v.height / 100;
        const bmi = +v.weight / (hM * hM);
        let cat = "", rec = "";
        if (+v.twins === 1) {
          if (bmi < 18.5) { cat = "Underweight"; rec = "12.5 – 18.0 kg (28–40 lbs)"; }
          else if (bmi < 25.0) { cat = "Normal weight"; rec = "11.5 – 16.0 kg (25–35 lbs)"; }
          else if (bmi < 30.0) { cat = "Overweight"; rec = "7.0 – 11.5 kg (15–25 lbs)"; }
          else { cat = "Obese"; rec = "5.0 – 9.0 kg (11–20 lbs)"; }
        } else {
          if (bmi < 25.0) { cat = "Normal weight (Twins)"; rec = "16.8 – 24.5 kg (37–54 lbs)"; }
          else if (bmi < 30.0) { cat = "Overweight (Twins)"; rec = "14.1 – 22.7 kg (31–50 lbs)"; }
          else { cat = "Obese (Twins)"; rec = "11.3 – 19.1 kg (25–42 lbs)"; }
        }
        return {
          value: `Pre-pregnancy BMI: ${bmi.toFixed(1)} kg/m² (${cat}) — Target Gain: ${rec}`,
          eq: "Institute of Medicine (IOM) recommended total gestational weight gain criteria."
        };
      }
    },

    // ==========================================
    // 2. ANTENATAL SCREENING & RISK ASSESSMENT
    // ==========================================
    {
      id: "combinedScreeningMom",
      cat: "obgy",
      subcat: "Antenatal Screening and Risk Assessment",
      name: "First-Trimester Combined Screening Risk Helper",
      desc: "Interprets Nuchal Translucency (NT), PAPP-A MoM, and free β-hCG MoM patterns.",
      fields: [
        N("nt", "Nuchal Translucency (NT, mm)", 1.8, { min: 0.5, max: 10.0, step: 0.1 }),
        N("pappaMom", "PAPP-A Multiples of Median (MoM)", 1.0, { min: 0.1, max: 5.0, step: 0.05 }),
        N("hcgMom", "Free β-hCG Multiples of Median (MoM)", 1.0, { min: 0.1, max: 5.0, step: 0.05 })
      ],
      calc: v => {
        const nt = +v.nt, pa = +v.pappaMom, hcg = +v.hcgMom;
        let risk = "Standard / Low Risk Pattern";
        if (nt >= 3.5) {
          risk = "High Risk: Markedly increased NT (≥3.5 mm). Strong association with aneuploidies (T21, T18, T13, Turner), cardiac anomalies, and Noonan syndrome. Detailed fetal echo and NIPT/diagnostic testing advised.";
        } else if (pa < 0.4 && hcg > 2.0) {
          risk = "High Risk for Trisomy 21 (Down Syndrome): Classic biochemical signature of low PAPP-A (<0.4 MoM) and elevated free β-hCG (>2.0 MoM).";
        } else if (pa < 0.3 && hcg < 0.3) {
          risk = "High Risk for Trisomy 18 / Trisomy 13: Concordantly low PAPP-A and low β-hCG.";
        }
        return {
          value: risk,
          eq: "Screening performed between 11+0 and 13+6 weeks (CRL 45–84 mm). Definitive risk integrates maternal age through licensed algorithmic software."
        };
      }
    },
    {
      id: "ogttInterpretation",
      cat: "obgy",
      subcat: "Antenatal Screening and Risk Assessment",
      name: "Gestational Diabetes 75g OGTT (IADPSG / WHO)",
      desc: "Diagnostic classification based on 2-hour 75g oral glucose tolerance test.",
      fields: [
        N("fasting", "Fasting Plasma Glucose (mg/dL)", 88, { min: 50, max: 250, step: 1 }),
        N("oneHour", "1-Hour Plasma Glucose (mg/dL)", 165, { min: 50, max: 350, step: 1 }),
        N("twoHour", "2-Hour Plasma Glucose (mg/dL)", 138, { min: 50, max: 350, step: 1 })
      ],
      calc: v => {
        const f = +v.fasting, h1 = +v.oneHour, h2 = +v.twoHour;
        const fAbn = f >= 92;
        const h1Abn = h1 >= 180;
        const h2Abn = h2 >= 153;
        const isGdm = fAbn || h1Abn || h2Abn;
        let details = [];
        if (fAbn) details.push(`Fasting ≥92 mg/dL (${f})`);
        if (h1Abn) details.push(`1-hour ≥180 mg/dL (${h1})`);
        if (h2Abn) details.push(`2-hour ≥153 mg/dL (${h2})`);

        return {
          value: isGdm ? `GESTATIONAL DIABETES DIAGNOSED (${details.join(", ")})` : "Normal 75g OGTT (All values below cut-offs)",
          eq: "IADPSG / ADA / WHO Criteria: Diagnosis requires any ONE abnormal value: Fasting ≥92 mg/dL (5.1 mmol/L), 1-hr ≥180 mg/dL (10.0 mmol/L), 2-hr ≥153 mg/dL (8.5 mmol/L)."
        };
      }
    },

    // ==========================================
    // 3. OBSTETRIC SCORES & CLASSIFICATIONS
    // ==========================================
    {
      id: "apgarScore",
      cat: "obgy",
      subcat: "Obstetric Scores and Classifications",
      name: "Apgar Score (Neonatal Assessment)",
      desc: "Standard 1-minute and 5-minute scoring of neonatal transition.",
      fields: [
        S("app", "Appearance (Skin Color)", "2", [["0", "Blue, pale all over (0)"], ["1", "Pink body, blue extremities (acrocyanosis) (+1)"], ["2", "Completely pink (+2)"]]),
        S("pulse", "Pulse (Heart Rate)", "2", [["0", "Absent (0)"], ["1", "<100 beats/min (+1)"], ["2", "≥100 beats/min (+2)"]]),
        S("grimace", "Grimace (Reflex Irritability)", "2", [["0", "No response to stimulation (0)"], ["1", "Grimace / feeble cry (+1)"], ["2", "Cough, sneeze, vigorous withdrawal (+2)"]]),
        S("activity", "Activity (Muscle Tone)", "2", [["0", "Flaccid, limp (0)"], ["1", "Some flexion of extremities (+1)"], ["2", "Active motion, flexed posture (+2)"]]),
        S("resp", "Respiration", "2", [["0", "Absent (0)"], ["1", "Slow, irregular, weak gasp (+1)"], ["2", "Good, vigorous robust cry (+2)"]])
      ],
      calc: v => {
        const total = +v.app + +v.pulse + +v.grimace + +v.activity + +v.resp;
        let c = total >= 7 ? "Normal transition (Score 7–10)" : total >= 4 ? "Moderately abnormal (Score 4–6; needs airway clearance and gentle stimulation)" : "CRITICAL: Severely depressed neonate (Score 0–3; immediate neonatal resuscitation protocol)";
        return {
          value: `Apgar Score: ${total} / 10 — ${c}`,
          eq: "Scores of 0–3 at ≥5 minutes correlate with increased neonatal mortality risk but do not alone predict neurological outcome."
        };
      }
    },
    {
      id: "obstetricShockIndex",
      cat: "obgy",
      subcat: "Obstetric Scores and Classifications",
      name: "Obstetric Shock Index (OSI)",
      desc: "Early objective predictor of occult massive haemorrhage in pregnancy.",
      fields: [
        N("hr", "Maternal Heart Rate (bpm)", 115, { min: 40, max: 200, step: 1 }),
        N("sbp", "Systolic Blood Pressure (mmHg)", 85, { min: 40, max: 220, step: 1 })
      ],
      calc: v => {
        const osi = +v.hr / +v.sbp;
        let c = "";
        if (osi < 0.7) c = "Normal physiology / low risk";
        else if (osi <= 0.9) c = "Borderline upper obstetric limit (0.7–0.9)";
        else if (osi < 1.4) c = "SIGNIFICANT HEMODYNAMIC COMPROMISE (OSI >0.9): Blood loss likely >1000 mL, prepare blood products";
        else c = "CRITICAL IMMINENT COLLAPSE (OSI ≥1.4): Massive blood loss (>1500–2000 mL), activate Massive Transfusion Protocol immediately";
        return {
          value: `Obstetric Shock Index: ${osi.toFixed(2)} — ${c}`,
          eq: "Formula: OSI = Heart Rate ÷ Systolic BP. In pregnancy, compensatory vasoconstriction can mask maternal hypovolemia until sudden decompensation occurs."
        };
      }
    },
    {
      id: "meowsScore",
      cat: "obgy",
      subcat: "Obstetric Scores and Classifications",
      name: "Modified Early Obstetric Warning Score (MEOWS)",
      desc: "Screening trigger score to detect early clinical deterioration.",
      fields: [
        N("rr", "Respiratory Rate (/min)", 22, { min: 5, max: 50, step: 1 }),
        N("spo2", "Oxygen Saturation (SpO2, %)", 96, { min: 70, max: 100, step: 1 }),
        N("temp", "Body Temperature (°C)", 37.2, { min: 32, max: 42, step: 0.1 }),
        N("sbp", "Systolic BP (mmHg)", 145, { min: 50, max: 250, step: 1 }),
        N("dbp", "Diastolic BP (mmHg)", 92, { min: 30, max: 150, step: 1 }),
        N("hr", "Heart Rate (bpm)", 105, { min: 30, max: 200, step: 1 }),
        S("avpu", "Consciousness Level", "A", [["A", "Alert"], ["V", "Responds to Voice"], ["P", "Responds to Pain"], ["U", "Unresponsive"]])
      ],
      calc: v => {
        let red = 0, yellow = 0;
        const rr = +v.rr, spo2 = +v.spo2, t = +v.temp, s = +v.sbp, d = +v.dbp, hr = +v.hr;
        if (rr < 10 || rr > 30) red++; else if (rr >= 21) yellow++;
        if (spo2 < 92) red++; else if (spo2 <= 95) yellow++;
        if (t < 35.0 || t >= 38.5) red++; else if (t >= 38.0 || (t >= 35.0 && t <= 36.0)) yellow++;
        if (s < 80 || s >= 160) red++; else if ((s >= 140 && s < 160) || (s >= 80 && s < 90)) yellow++;
        if (d >= 105) red++; else if (d >= 90 && d < 105) yellow++;
        if (hr < 40 || hr > 120) red++; else if ((hr >= 100 && hr <= 120) || (hr >= 40 && hr < 50)) yellow++;
        if (v.avpu !== "A") red++;

        let alert = "";
        if (red >= 1) alert = `RED ALERT (${red} Red, ${yellow} Yellow): Immediate urgent obstetric and senior critical care attendance required!`;
        else if (yellow >= 2) alert = `YELLOW ALERT (${yellow} Yellow triggers): Urgent bedside review within 30 minutes. Increase monitoring frequency.`;
        else alert = "Normal parameters (Low clinical risk)";

        return {
          value: alert,
          eq: "MEOWS Protocol: Triggered by 1 Red criterion OR ≥2 Yellow criteria simultaneously."
        };
      }
    },

    // ==========================================
    // 4. LABOUR AND DELIVERY
    // ==========================================
    {
      id: "bishopScore",
      cat: "obgy",
      subcat: "Labour and Delivery",
      name: "Bishop Score for Cervical Ripening and Induction",
      desc: "Standard assessment of cervical favourability before induction of labour.",
      fields: [
        S("dil", "1. Cervical Dilatation (cm)", "0", [["0", "Closed (0)"], ["1", "1–2 cm (+1)"], ["2", "3–4 cm (+2)"], ["3", "≥5 cm (+3)"]]),
        S("eff", "2. Cervical Effacement (%)", "1", [["0", "0–30% (0)"], ["1", "40–50% (+1)"], ["2", "60–70% (+2)"], ["3", "≥80% (+3)"]]),
        S("stat", "3. Fetal Station (relative to ischial spines)", "0", [["0", "-3 station (0)"], ["1", "-2 station (+1)"], ["2", "-1 or 0 station (+2)"], ["3", "+1 or +2 station (+3)"]]),
        S("cons", "4. Cervical Consistency", "1", [["0", "Firm (0)"], ["1", "Medium (+1)"], ["2", "Soft (+2)"]]),
        S("pos", "5. Cervical Position", "0", [["0", "Posterior (0)"], ["1", "Mid-position (+1)"], ["2", "Anterior (+2)"]])
      ],
      calc: v => {
        const score = +v.dil + +v.eff + +v.stat + +v.cons + +v.pos;
        let c = score >= 8 ? "Favourable cervix (High probability of successful vaginal delivery; oxytocin infusion or amniotomy appropriate)" : score <= 6 ? "Unfavourable cervix (High induction failure risk; pre-induction cervical ripening recommended with PGE2/PGE1 or mechanical balloon)" : "Intermediate cervix (Score 7)";
        return {
          value: `Bishop Score: ${score} / 13 — ${c}`,
          eq: "Scores range from 0 to 13. A Bishop score ≥8 signifies cervical readiness comparable to spontaneous labour onset."
        };
      }
    },
    {
      id: "oxytocinCalculator",
      cat: "obgy",
      subcat: "Labour and Delivery",
      name: "Oxytocin Infusion Rate Calculator",
      desc: "Converts desired milliunits per minute (mU/min) into IV infusion pump rates (mL/h).",
      fields: [
        N("doseMu", "Desired Oxytocin Dose (mU/min)", 4, { min: 1, max: 40, step: 1 }),
        S("concentration", "Standard Solution Concentration", "10_500", [
          ["5_500", "5 Units in 500 mL Normal Saline / RL (10 mU/mL)"],
          ["10_500", "10 Units in 500 mL Normal Saline / RL (20 mU/mL)"],
          ["30_500", "30 Units in 500 mL (High concentration: 60 mU/mL)"]
        ])
      ],
      calc: v => {
        const concVal = v.concentration === "5_500" ? 10 : v.concentration === "10_500" ? 20 : 60;
        const mlPerHour = (+v.doseMu * 60) / concVal;
        return {
          value: `Pump Infusion Rate: ${mlPerHour.toFixed(1)} mL/hour`,
          eq: `Formula: mL/h = (Dose in mU/min × 60 min/h) ÷ Concentration (${concVal} mU/mL). Increase by 1–2 mU/min every 30 minutes until regular contractions (3–4 every 10 min).`
        };
      }
    },
    {
      id: "vbacSuccess",
      cat: "obgy",
      subcat: "Labour and Delivery",
      name: "VBAC / TOLAC Success Prediction Helper",
      desc: "Clinical factor weighting for trial of labour after previous cesarean section.",
      fields: [
        S("priorVag", "Prior Vaginal Delivery before or after CD?", "1", [["0", "No prior vaginal delivery (0)"], ["2", "Yes, prior vaginal delivery (+2)"], ["3", "Yes, prior successful VBAC (+3)"]]),
        S("indication", "Indication for primary cesarean", "1", [["0", "Non-recurring (e.g. breech presentation, fetal distress) (+1)"], ["1", "Recurring indication (e.g. cephalopelvic disproportion, arrest of active phase) (0)"]]),
        S("bmi", "Maternal BMI category", "0", [["1", "BMI <30 kg/m² (+1)"], ["0", "BMI ≥30 kg/m² (0)"]]),
        S("cervix", "Cervical status at admission", "1", [["1", "Cervix dilated ≥3 cm or effaced (+1)"], ["0", "Unfavourable / closed (0)"]])
      ],
      calc: v => {
        const pts = +v.priorVag + +v.indication + +v.bmi + +v.cervix;
        let prob = pts >= 4 ? "High VBAC success probability (>75–85%)" : pts >= 2 ? "Moderate VBAC success probability (~60–75%)" : "Lower predicted success rate (<50–60%); ensure close intrapartum monitoring";
        return {
          value: `Prediction: ${prob}`,
          eq: "Success rates are highest with previous vaginal delivery and non-recurring indications. Risk of uterine rupture in low transverse scar is ~0.5–0.7%."
        };
      }
    },

    // ==========================================
    // 5. OBSTETRIC EMERGENCIES
    // ==========================================
    {
      id: "pphSeverityAssessment",
      cat: "obgy",
      subcat: "Obstetric Emergencies",
      name: "Postpartum Haemorrhage (PPH) Severity Staging",
      desc: "Guides blood loss estimation, hemodynamic stages, and immediate management protocols.",
      fields: [
        N("lossMl", "Estimated Cumulative Blood Loss (mL)", 1200, { min: 100, max: 5000, step: 50 }),
        S("mode", "Delivery Mode", "vaginal", [["vaginal", "Vaginal Delivery"], ["cesarean", "Cesarean Section"]]),
        S("instability", "Signs of shock or hemodynamic instability present?", "0", [["0", "Stable vitals"], ["1", "Tachycardia, hypotension, or altered mentation"]])
      ],
      calc: v => {
        const ml = +v.lossMl;
        const unstable = v.instability === "1";
        let stage = "";
        let tx = "";
        if (ml >= 2000 || (ml >= 1500 && unstable)) {
          stage = "STAGE 3: Severe / Catastrophic PPH (>1500–2000 mL)";
          tx = "Activate Massive Transfusion Protocol (1:1:1 PRBC:FFP:Platelets). Tranexamic acid 1g IV. Uterotonics. Surgical intervention (intrauterine balloon tamponade, B-Lynch brace suture, uterine artery ligation, or emergent hysterectomy).";
        } else if (ml >= 1000 || unstable) {
          stage = "STAGE 2: Moderate PPH (1000–1500 mL)";
          tx = "Second-line uterotonics (Carboprost / Misoprostol / Methylergometrine). Mobilize multi-disciplinary team. Type and crossmatch 2–4 units PRBC. Consider Bakri balloon.";
        } else if ((v.mode === "vaginal" && ml >= 500) || (v.mode === "cesarean" && ml >= 1000)) {
          stage = "STAGE 1: Mild PPH";
          tx = "Uterine massage, Oxytocin 20–40 IU in 1000 mL infusion, evaluate 4 T's (Tone, Trauma, Tissue, Thrombin), IV access (two large-bore 16G cannulae).";
        } else {
          stage = "Physiologic Blood Loss (Within expected limits)";
          tx = "Standard active management of third stage of labour (AMTSL).";
        }
        return {
          value: stage,
          eq: tx
        };
      }
    },
    {
      id: "mgso4RegimenCalc",
      cat: "obgy",
      subcat: "Obstetric Emergencies",
      name: "Magnesium Sulfate Dosing & Toxicity Monitor",
      desc: "Loading and maintenance protocols for eclampsia prophylaxis/treatment and toxicity checks.",
      fields: [
        S("protocol", "Selected MgSO4 Protocol", "zuspan", [
          ["zuspan", "Zuspan Regimen (IV only: 4g load, then 1 g/h)"],
          ["pritchard", "Pritchard Regimen (IV + IM: 4g IV + 10g IM, then 5g IM q4h)"]
        ]),
        S("reflex", "Patellar Deep Tendon Reflexes", "intact", [["intact", "Normal / Brisk"], ["depressed", "Diminished / Absent (Toxicity Warning)"]]),
        N("rr", "Respiratory Rate (/min)", 16, { min: 6, max: 40, step: 1 }),
        N("uop", "Urine Output in last hour (mL/h)", 35, { min: 0, max: 200, step: 1 })
      ],
      calc: v => {
        const toxic = v.reflex === "depressed" || +v.rr < 12 || +v.uop < 25;
        let alert = "";
        if (toxic) {
          alert = "SUSPECTED MAGNESIUM TOXICITY! Immediately STOP MgSO4 infusion. Administer 10% Calcium Gluconate 10 mL (1 g) IV over 10 minutes. Check serum Mg level.";
        } else {
          alert = v.protocol === "zuspan" ?
            "Protocol Normal: 4g IV loading over 20 min, followed by 1–2 g/h IV maintenance. Continue for 24h postpartum or after last seizure." :
            "Protocol Normal: 4g IV + 10g deep IM (5g in each buttock) with 1 mL 2% lidocaine. Maintenance: 5g IM q4h alternating buttocks.";
        }
        return {
          value: alert,
          eq: "Clinical safety triad: Patellar reflexes present, Respiratory rate ≥12/min, Urine output ≥25–30 mL/h (magnesium is cleared renally)."
        };
      }
    },
    {
      id: "hellpCriteria",
      cat: "obgy",
      subcat: "Obstetric Emergencies",
      name: "HELLP Syndrome Diagnostic Criteria (Tennessee)",
      desc: "Evaluates hemolysis, hepatic enzymes, and thrombocytopenia.",
      fields: [
        N("plt", "Platelet Count (/µL)", 85000, { min: 5000, max: 450000, step: 1000 }),
        N("ast", "Serum AST / SGOT (U/L)", 95, { min: 10, max: 2000, step: 1 }),
        N("ldh", "Serum LDH (U/L)", 720, { min: 50, max: 4000, step: 10 }),
        N("bili", "Total Bilirubin (mg/dL)", 1.4, { min: 0.1, max: 15.0, step: 0.1 })
      ],
      calc: v => {
        const p = +v.plt, a = +v.ast, l = +v.ldh, b = +v.bili;
        const hemolysis = l >= 600 || b >= 1.2;
        const liver = a >= 70;
        const lowPlt = p < 100000;
        const isComplete = hemolysis && liver && lowPlt;
        const isPartial = (hemolysis ? 1 : 0) + (liver ? 1 : 0) + (lowPlt ? 1 : 0) >= 1 && !isComplete;

        let res = "";
        if (isComplete) {
          let mississippiClass = p < 50000 ? "Class 1 (Severe thrombocytopenia <50k)" : p < 100000 ? "Class 2 (Platelets 50k–100k)" : "Class 3";
          res = `COMPLETE HELLP SYNDROME (${mississippiClass}). Urgent maternal stabilization and prompt delivery planning.`;
        } else if (isPartial) {
          res = "PARTIAL HELLP (ELLP or HEL). High vigilance required; can rapidly evolve into complete HELLP.";
        } else {
          res = "Criteria not met for HELLP syndrome.";
        }
        return {
          value: res,
          eq: "Tennessee criteria: Hemolysis (LDH ≥600 U/L or Bilirubin ≥1.2 mg/dL) + AST ≥70 U/L + Platelets <100,000/µL."
        };
      }
    },

    // ==========================================
    // 6. HYPERTENSIVE DISORDERS OF PREGNANCY
    // ==========================================
    {
      id: "preeclampsiaAssessment",
      cat: "obgy",
      subcat: "Hypertensive Disorders of Pregnancy",
      name: "Preeclampsia Diagnostic & Severity Assessment",
      desc: "ACOG definition of preeclampsia with and without severe features.",
      fields: [
        N("sbp", "Systolic Blood Pressure (mmHg)", 165, { min: 80, max: 260, step: 1 }),
        N("dbp", "Diastolic Blood Pressure (mmHg)", 112, { min: 40, max: 160, step: 1 }),
        N("upcr", "Urine Protein/Creatinine Ratio (mg/mg)", 0.45, { min: 0, max: 10.0, step: 0.05 }),
        S("severeFeatures", "Severe clinical/laboratory features present?", "1", [
          ["0", "None: No thrombocytopenia, elevated Cr, LFT elevation, pulmonary edema, or severe headache/visual changes"],
          ["1", "Present: Platelets <100k, Cr >1.1, AST/ALT >2x, pulmonary edema, or persistent neuro/visual disturbances"]
        ])
      ],
      calc: v => {
        const s = +v.sbp, d = +v.dbp, upcr = +v.upcr;
        const severeBp = s >= 160 || d >= 110;
        const hasProteinuria = upcr >= 0.3;
        const hasSevere = v.severeFeatures === "1" || severeBp;

        let dx = "";
        if ((s >= 140 || d >= 90) && (hasProteinuria || hasSevere)) {
          if (hasSevere) {
            dx = "PREECLAMPSIA WITH SEVERE FEATURES (Indication for antihypertensives, seizure prophylaxis with MgSO4, and consideration of delivery based on GA).";
          } else {
            dx = "PREECLAMPSIA WITHOUT SEVERE FEATURES (Close outpatient/inpatient surveillance until 37 weeks).";
          }
        } else if (s >= 140 || d >= 90) {
          dx = "Gestational Hypertension (Elevated BP without proteinuria or severe end-organ features).";
        } else {
          dx = "Normotensive parameters.";
        }
        return {
          value: dx,
          eq: "First-line IV antihypertensives for severe hypertension (≥160/110): IV Labetalol (20-40-80mg), IV Hydralazine (5-10mg), or oral immediate-release Nifedipine (10-20mg)."
        };
      }
    },

    // ==========================================
    // 7. GYNAECOLOGICAL MENSTRUAL DISORDERS
    // ==========================================
    {
      id: "rotterdamPcos",
      cat: "obgy",
      subcat: "Gynaecological Menstrual Disorders",
      name: "Rotterdam PCOS Diagnostic Criteria",
      desc: "Evaluates the 3 classical pillars of polycystic ovary syndrome.",
      fields: [
        S("oligo", "1. Ovulatory Dysfunction (Oligo- or Anovulation)", "1", [["1", "Present: Cycles >35 days or <8 cycles/year"], ["0", "Absent: Regular regular ovulatory cycles"]]),
        S("androgen", "2. Hyperandrogenism (Clinical and/or Biochemical)", "1", [["1", "Present: Hirsutism (mFG ≥4–8), severe acne, alopecia, or elevated free/total testosterone"], ["0", "Absent"]]),
        S("us", "3. Polycystic Ovarian Morphology on Ultrasound", "1", [["1", "Present: ≥20 follicles (2–9mm) per ovary and/or ovarian volume ≥10 mL in either ovary"], ["0", "Absent"]])
      ],
      calc: v => {
        const count = +v.oligo + +v.androgen + +v.us;
        const isPcos = count >= 2;
        let phenotype = "";
        if (count === 3) phenotype = "Phenotype A (Full: Oligo + Androgen excess + Polycystic ovaries)";
        else if (+v.oligo === 1 && +v.androgen === 1) phenotype = "Phenotype B (Non-PCO: Oligo + Androgen excess)";
        else if (+v.androgen === 1 && +v.us === 1) phenotype = "Phenotype C (Ovulatory: Androgen excess + Polycystic ovaries)";
        else if (+v.oligo === 1 && +v.us === 1) phenotype = "Phenotype D (Non-hyperandrogenic: Oligo + Polycystic ovaries)";

        return {
          value: isPcos ? `PCOS CONFIRMED (${phenotype})` : `PCOS not confirmed (${count}/3 criteria met; minimum 2 required)`,
          eq: "Rotterdam Consensus 2003 / International Evidence-Based Guideline. Exclude thyroid disease, hyperprolactinemia, and non-classic congenital adrenal hyperplasia first."
        };
      }
    },
    {
      id: "palmCoeinAub",
      cat: "obgy",
      subcat: "Gynaecological Menstrual Disorders",
      name: "FIGO PALM-COEIN Classification for AUB",
      desc: "Categorizes causes of Abnormal Uterine Bleeding into structural and non-structural etiologies.",
      fields: [
        S("palm", "Structural (PALM) Etiologies", "none", [
          ["none", "None identified on imaging/histology"],
          ["P", "P — Polyp (Endometrial or endocervical)"],
          ["A", "A — Adenomyosis"],
          ["L", "L — Leiomyoma (Submucosal or other)"],
          ["M", "M — Malignancy and Hyperplasia (Atypical hyperplasia / Endometrial ca)"]
        ]),
        S("coein", "Non-Structural (COEIN) Etiologies", "none", [
          ["none", "None suspected clinically"],
          ["C", "C — Coagulopathy (e.g. von Willebrand disease, anticoagulant therapy)"],
          ["O", "O — Ovulatory dysfunction (PCOS, thyroid disorders, perimenopause)"],
          ["E", "E — Endometrial primary dysfunction"],
          ["I", "I — Iatrogenic (IUD, hormonal contraceptives, psychotropics)"],
          ["N", "N — Not otherwise classified"]
        ])
      ],
      calc: v => {
        let res = [];
        if (v.palm !== "none") res.push(`Structural: ${v.palm}`);
        if (v.coein !== "none") res.push(`Non-Structural: ${v.coein}`);
        return {
          value: res.length > 0 ? `FIGO AUB Category: ${res.join(" | ")}` : "No specific PALM-COEIN category selected",
          eq: "The PALM-COEIN system allows multiple contributing causes to be designated simultaneously (e.g. AUB-L;O)."
        };
      }
    },

    // ==========================================
    // 8. INFERTILITY & REPRODUCTIVE MEDICINE
    // ==========================================
    {
      id: "ovarianReserveAmh",
      cat: "obgy",
      subcat: "Infertility and Reproductive Medicine",
      name: "Ovarian Reserve & AMH Interpretation",
      desc: "Correlates Anti-Müllerian Hormone (AMH) and Antral Follicle Count (AFC) with response.",
      fields: [
        N("amh", "Serum AMH (ng/mL)", 2.4, { min: 0.05, max: 20.0, step: 0.1 }),
        N("afc", "Antral Follicle Count (total bilateral)", 14, { min: 0, max: 60, step: 1 })
      ],
      calc: v => {
        const amh = +v.amh, afc = +v.afc;
        let c = "";
        if (amh < 0.5 || afc < 5) c = "Very Low / Severely Diminished Ovarian Reserve (High risk of poor IVF response / cycle cancellation)";
        else if (amh < 1.1 || afc < 7) c = "Diminished Ovarian Reserve (POSEIDON / Bologna poor responder criteria)";
        else if (amh > 3.5 || afc > 20) c = "High Ovarian Reserve (High response anticipated; risk of OHSS; consider GnRH antagonist protocol & agonist trigger)";
        else c = "Normal Ovarian Reserve (Predicts standard response to controlled ovarian stimulation)";
        return {
          value: `AMH: ${amh} ng/mL | AFC: ${afc} — ${c}`,
          eq: "AMH reflects the pool of pre-antral and small antral follicles and is relatively stable across the menstrual cycle."
        };
      }
    },
    {
      id: "whoSemenAnalysis",
      cat: "obgy",
      subcat: "Infertility and Reproductive Medicine",
      name: "WHO 6th Edition Semen Analysis Interpretation",
      desc: "Evaluates semen parameters against WHO 2021 lower reference limits (5th percentile).",
      fields: [
        N("vol", "Semen Volume (mL)", 2.5, { min: 0.2, max: 10.0, step: 0.1 }),
        N("conc", "Sperm Concentration (million/mL)", 22, { min: 0, max: 300, step: 1 }),
        N("progMot", "Progressive Motility (PR, %)", 38, { min: 0, max: 100, step: 1 }),
        N("morph", "Normal Forms / Morphology (%)", 5, { min: 0, max: 100, step: 1 })
      ],
      calc: v => {
        const vol = +v.vol, conc = +v.conc, pr = +v.progMot, morph = +v.morph;
        let abn = [];
        if (vol < 1.4) abn.push("Hypospermia (<1.4 mL)");
        if (conc < 16) abn.push("Oligozoospermia (<16 M/mL)");
        if (pr < 30) abn.push("Asthenozoospermia (<30% PR)");
        if (morph < 4) abn.push("Teratozoospermia (<4% normal forms)");

        const totalCount = (vol * conc).toFixed(1);
        return {
          value: abn.length === 0 ? `Normozoospermia (Total count: ${totalCount} million; all parameters ≥WHO 6th edition limits)` : `Abnormal Semen Parameters: ${abn.join(", ")} (Total count: ${totalCount} million)`,
          eq: "WHO 2021 limits: Volume ≥1.4 mL, Total Count ≥39 M, Concentration ≥16 M/mL, Progressive Motility ≥30%, Normal Morphology ≥4%."
        };
      }
    },

    // ==========================================
    // 9. CONTRACEPTION AND FAMILY PLANNING
    // ==========================================
    {
      id: "whoMecContraception",
      cat: "obgy",
      subcat: "Contraception and Family Planning",
      name: "WHO Medical Eligibility Criteria (MEC) Checker",
      desc: "Rapid safety screening for Combined Hormonal Contraceptives (COCs) vs Progestin-only/IUDs.",
      fields: [
        S("condition", "Clinical Condition / Risk Factor", "smoker_over35", [
          ["none", "Healthy non-smoker, no vascular risk"],
          ["smoker_over35", "Age ≥35 and smoking ≥15 cigarettes/day"],
          ["migraine_aura", "Migraine with aura (at any age)"],
          ["bp_severe", "Hypertension SBP ≥160 or DBP ≥100 mmHg"],
          ["vte_history", "History of deep vein thrombosis (DVT) or pulmonary embolism"],
          ["breast_cancer", "Current breast cancer"],
          ["pp_lactating", "Postpartum <6 weeks, exclusively breastfeeding"]
        ])
      ],
      calc: v => {
        const cond = v.condition;
        let mecCoc = "1", mecPop = "1", mecIud = "1";
        if (cond === "smoker_over35" || cond === "migraine_aura" || cond === "bp_severe" || cond === "vte_history") {
          mecCoc = "4 (Unacceptable health risk / Absolute contraindication)";
          mecPop = "1 or 2 (Eligible / Safe)";
          mecIud = "1 (Safe)";
        } else if (cond === "breast_cancer") {
          mecCoc = "4"; mecPop = "4"; mecIud = "1 (Copper IUD is Category 1)";
        } else if (cond === "pp_lactating") {
          mecCoc = "4 (<6 weeks PP breastfeeding)"; mecPop = "2 (Safe to initiate)"; mecIud = "1";
        } else {
          mecCoc = "1 (No restriction)"; mecPop = "1"; mecIud = "1";
        }
        return {
          value: `COC Eligibility: MEC ${mecCoc} | POP: ${mecPop} | Copper IUD: ${mecIud}`,
          eq: "WHO MEC Categories: 1 = No restriction; 2 = Advantages outweigh risks; 3 = Risks outweigh advantages; 4 = Unacceptable health risk."
        };
      }
    },

    // ==========================================
    // 10. GYNAECOLOGICAL ONCOLOGY
    // ==========================================
    {
      id: "rmiOvarianCancer",
      cat: "obgy",
      subcat: "Gynaecological Oncology",
      name: "Risk of Malignancy Index (RMI I) for Adnexal Masses",
      desc: "Combines menopausal status, ultrasound features, and CA-125 to estimate ovarian malignancy risk.",
      fields: [
        S("meno", "Menopausal Status", "post", [["pre", "Premenopausal (M = 1)"], ["post", "Postmenopausal (M = 3)"]]),
        S("usFeatures", "Ultrasound Features (Multilocular, solid areas, bilateral, ascites, intra-abdominal mets)", "2", [
          ["0", "0 features (U = 0)"],
          ["1", "1 feature (U = 1)"],
          ["2", "≥2 features (U = 3)"]
        ]),
        N("ca125", "Serum CA-125 Level (U/mL)", 85, { min: 1, max: 5000, step: 1 })
      ],
      calc: v => {
        const m = v.meno === "post" ? 3 : 1;
        const u = v.usFeatures === "0" ? 0 : v.usFeatures === "1" ? 1 : 3;
        const rmi = u * m * +v.ca125;
        let c = rmi >= 200 ? "HIGH RISK for ovarian malignancy (RMI >200 carries ~75% malignancy risk; refer to gynaecologic oncologist)" : "LOW RISK for ovarian malignancy (RMI <200)";
        return {
          value: `RMI Score: ${rmi} — ${c}`,
          eq: "Formula: RMI = U × M × CA-125. An RMI threshold of 200 offers ~80% sensitivity and ~90% specificity for pelvic malignancy."
        };
      }
    },
    {
      id: "figoCervicalCancer",
      cat: "obgy",
      subcat: "Gynaecological Oncology",
      name: "FIGO Cervical Cancer Staging (2018)",
      desc: "Stage mapping based on tumour dimension, pelvic extent, and nodal involvement.",
      fields: [
        S("extent", "Anatomical Extent of Disease", "IB1", [
          ["IA1", "Stage IA1: Microscopic stromal invasion <3 mm depth"],
          ["IA2", "Stage IA2: Stromal invasion ≥3 mm and <5 mm depth"],
          ["IB1", "Stage IB1: Invasive carcinoma ≥5 mm depth and <2 cm largest dimension"],
          ["IB2", "Stage IB2: Invasive carcinoma 2.0 to <4.0 cm dimension"],
          ["IB3", "Stage IB3: Invasive carcinoma ≥4.0 cm largest dimension"],
          ["IIA", "Stage IIA: Involvement of upper 2/3 of vagina without parametrial invasion"],
          ["IIB", "Stage IIB: Parametrial invasion (does not reach pelvic sidewall)"],
          ["IIIA", "Stage IIIA: Involvement of lower third of vagina"],
          ["IIIB", "Stage IIIB: Extension to pelvic sidewall and/or hydronephrosis"],
          ["IVA", "Stage IVA: Spread to mucosa of bladder or rectum"],
          ["IVB", "Stage IVB: Distant metastases"]
        ]),
        S("nodes", "Lymph Node Status (Radiological or Pathological)", "none", [
          ["none", "No pelvic or para-aortic lymph node metastases"],
          ["pelvic", "Pelvic lymph node metastases only (Designates Stage IIIC1)"],
          ["paraaortic", "Para-aortic lymph node metastases (Designates Stage IIIC2)"]
        ])
      ],
      calc: v => {
        let finalStage = v.extent;
        if (v.nodes === "pelvic" && !v.extent.startsWith("IV")) finalStage = "Stage IIIC1 (Pelvic lymph node metastasis)";
        else if (v.nodes === "paraaortic" && !v.extent.startsWith("IV")) finalStage = "Stage IIIC2 (Para-aortic lymph node metastasis)";

        let tx = finalStage.startsWith("IA") || finalStage === "IB1" ? "Early stage: Suitable for fertility-sparing surgery (conization/trachelectomy) or radical hysterectomy + pelvic lymphadenectomy." : "Locally advanced / node-positive: Definitive concurrent chemoradiation (Cisplatin + external beam radiotherapy + brachytherapy).";
        return {
          value: `FIGO Staging: ${finalStage}`,
          eq: tx
        };
      }
    },

    // ==========================================
    // 11. COMMON GYNAECOLOGICAL SCORES
    // ==========================================
    {
      id: "popqStaging",
      cat: "obgy",
      subcat: "Common Gynaecological Scores",
      name: "Pelvic Organ Prolapse Quantification (POP-Q) Staging",
      desc: "Assigns anatomical prolapse stage based on the most dependent leading edge relative to the hymen.",
      fields: [
        N("leadingEdge", "Most Dependent Prolapse Point (cm relative to hymen; above is negative, below is positive)", 2.0, { min: -10.0, max: 15.0, step: 0.5 }),
        N("tvl", "Total Vaginal Length (tvl, cm)", 8.5, { min: 4.0, max: 14.0, step: 0.5 })
      ],
      calc: v => {
        const d = +v.leadingEdge, tvl = +v.tvl;
        let stage = "";
        if (d < -1.0) stage = "Stage I (Leading edge >1 cm above hymen)";
        else if (d >= -1.0 && d <= 1.0) stage = "Stage II (Leading edge between 1 cm above and 1 cm below hymenal plane)";
        else if (d > 1.0 && d < (tvl - 2.0)) stage = "Stage III (Leading edge >1 cm below hymen but < tvl - 2 cm)";
        else stage = "Stage IV: Complete eversion / procidentia (Leading edge ≥ tvl - 2 cm)";
        return {
          value: `POP-Q: ${stage}`,
          eq: "Standardized ICS / AUGS staging based on the 9 POP-Q landmark points: Aa, Ba, C, D, Ap, Bp, gh, pb, and tvl."
        };
      }
    },

    // ==========================================
    // 12. DRUG & CLINICAL CALCULATORS
    // ==========================================
    {
      id: "ganzoniFormula",
      cat: "obgy",
      subcat: "Drug and Clinical Calculators",
      name: "Iron Deficit Calculator (Ganzoni Formula)",
      desc: "Calculates elemental iron requirement for parenteral iron therapy in pregnancy.",
      fields: [
        N("weight", "Actual Body Weight (kg)", 58, { min: 30, max: 180, step: 0.5 }),
        N("actualHb", "Current Hemoglobin (g/dL)", 8.2, { min: 3.0, max: 16.0, step: 0.1 }),
        N("targetHb", "Target Hemoglobin (g/dL, standard 11.0)", 11.0, { min: 9.0, max: 15.0, step: 0.1 }),
        N("depot", "Iron Depot Stores (mg, standard 500 mg)", 500, { min: 0, max: 1000, step: 50 })
      ],
      calc: v => {
        const wt = +v.weight, curHb = +v.actualHb, tgtHb = +v.targetHb, depot = +v.depot;
        const deficit = (wt * (tgtHb - curHb) * 2.4) + depot;
        const roundedDeficit = Math.max(0, Math.round(deficit));
        const fcmVials = Math.ceil(roundedDeficit / 500);
        return {
          value: `Total Iron Deficit: ${roundedDeficit} mg elemental iron`,
          eq: `Ganzoni formula: [Weight (kg) × (Target Hb − Actual Hb) × 2.4] + Depot (${depot} mg). Equivalent to approx. ${fcmVials} infusion(s) of 500 mg Ferric Carboxymaltose or ${(roundedDeficit / 100).toFixed(0)} ampoules of 100 mg Iron Sucrose.`
        };
      }
    },

    // ==========================================
    // 13. ULTRASOUND AND MEASUREMENTS
    // ==========================================
    {
      id: "crlDatingCalc",
      cat: "obgy",
      subcat: "Gynaecological Ultrasound and Measurements",
      name: "Crown–Rump Length (CRL) Dating",
      desc: "Robinson and Fleming formula for first-trimester gestational dating.",
      fields: [
        N("crl", "Crown–Rump Length (CRL, mm)", 45, { min: 5, max: 84, step: 1 })
      ],
      calc: v => {
        const crl = +v.crl;
        // Formula: GA (days) = 42 + CRL (mm) approx, or exact polynomial: 8.052 * sqrt(CRL) + 23.73
        const gaDaysExact = 8.052 * Math.sqrt(crl * 1.037) + 23.73;
        const gaDays = Math.round(gaDaysExact);
        const w = Math.floor(gaDays / 7);
        const d = gaDays % 7;
        return {
          value: `Gestational Age: ${w} weeks ${d} days (±3–5 days)`,
          eq: "Robinson & Fleming formula: Most reliable between 6+0 and 13+6 weeks (CRL 5–84 mm). When discordant with LMP by >5 days, ultrasound CRL re-dates pregnancy."
        };
      }
    },
    {
      id: "pelvicOrganVolume",
      cat: "obgy",
      subcat: "Gynaecological Ultrasound and Measurements",
      name: "Uterine, Ovarian & Fibroid Volume Calculator",
      desc: "Calculates ellipsoidal organ and lesion volume (Length × Width × Height × 0.523).",
      fields: [
        N("len", "Length (cm)", 7.5, { min: 0.5, max: 35.0, step: 0.1 }),
        N("width", "Width / Transverse (cm)", 4.8, { min: 0.5, max: 30.0, step: 0.1 }),
        N("height", "Anteroposterior Height (cm)", 3.9, { min: 0.5, max: 25.0, step: 0.1 })
      ],
      calc: v => {
        const vol = +v.len * +v.width * +v.height * 0.5233;
        return {
          value: `Volume: ${vol.toFixed(1)} cm³ (mL)`,
          eq: "Formula: Ellipsoid Volume = Length × Width × Height × (π ÷ 6) ≈ D1 × D2 × D3 × 0.523. Normal reproductive ovarian volume is 3–9 mL; uterine volume is ~40–100 mL."
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