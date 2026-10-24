// obgy.js
(function () {
  "use strict";

  const category = {
    id: "obgyn",
    name: "OB-GYN",
    icon: "🤰",
    desc: "Obstetric dating, risk scores, labour progress, hypertensive disorders, oncologic staging, and clinical calculators"
  };

  const tools = [
    // ==========================================
    // 1. OBSTETRIC DATING & PREGNANCY ASSESSMENT
    // ==========================================
    {
      id: "eddLmpCalc",
      cat: "obgyn",
      name: "EDD & Gestational Age Calculator",
      desc: "Calculates Estimated Date of Delivery (Naegele's rule) and current Gestational Age from LMP.",
      guidance: "1. Confirm the first day of the last normal menstrual period (LMP).\n2. Verify the patient's typical menstrual cycle length (standard is 28 days).\n3. Enter the elapsed days since LMP to compute current gestational maturity and remaining days to delivery.",
      contraindications: "Inaccurate in irregular menses, recent cessation of hormonal contraception, or post-partum conception before resumption of menses. Ultrasound CRL takes precedence if discordant by >5–7 days.",
      references: "1. ACOG Committee Opinion No. 700: Methods for Estimating the Due Date. Obstet Gynecol. 2017;129(5):e150-e154.\n2. Naegele FC. Lehrbuch der Geburtshülfe. Heidelberg; 1830.",
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
          value: `GA: ${gaWeeks}w ${gaRemDays}d (${trimester})`,
          eq: `Naegele's formula adjusted for ${v.cycleDays}-day cycle. Total gestation = ${totalEddDays} days. Days remaining to EDD = ${Math.max(0, daysToDelivery)} days.`
        };
      }
    },
    {
      id: "hadlockEfw",
      cat: "obgyn",
      name: "Estimated Fetal Weight (Hadlock 4-Parameter)",
      desc: "Ultrasound biometric estimation of fetal weight combining BPD, HC, AC, and FL.",
      guidance: "1. Measure Biparietal Diameter (BPD) at the transthalamic plane.\n2. Obtain Head Circumference (HC) at the same plane.\n3. Measure Abdominal Circumference (AC) at the junction of the umbilical vein and portal sinus.\n4. Measure Femur Length (FL) across the calcified diaphysis excluding epiphyses.",
      contraindications: "Mean absolute error is ~10–15%. Error rates increase markedly in severe oligohydramnios, multiple gestations, fetal macrosomia (>4000g), or severe fetal growth restriction.",
      references: "1. Hadlock FP, et al. Estimation of fetal weight with the use of head, body, and femur measurements—a prospective study. Am J Obstet Gynecol. 1985;151(3):333-337.",
      fields: [
        N("bpd", "Biparietal Diameter (BPD, cm)", 8.2, { min: 2.0, max: 12.0, step: 0.1 }),
        N("hc", "Head Circumference (HC, cm)", 30.0, { min: 8.0, max: 40.0, step: 0.1 }),
        N("ac", "Abdominal Circumference (AC, cm)", 28.5, { min: 8.0, max: 45.0, step: 0.1 }),
        N("fl", "Femur Length (FL, cm)", 6.4, { min: 1.0, max: 10.0, step: 0.1 })
      ],
      calc: v => {
        const b = +v.bpd, h = +v.hc, a = +v.ac, f = +v.fl;
        const logEfw = 1.3596 - (0.00386 * a * f) + (0.0064 * h) + (0.00061 * b * a) + (0.0424 * a) + (0.0174 * f);
        const efwGrams = Math.round(Math.pow(10, logEfw));
        return {
          value: `EFW: ${efwGrams} g (~${(efwGrams / 1000).toFixed(2)} kg)`,
          eq: "Hadlock 4-parameter regression: Log10(Weight) = 1.3596 - (0.00386×AC×FL) + (0.0064×HC) + (0.00061×BPD×AC) + (0.0424×AC) + (0.0174×FL). Estimated error: ±10–15%."
        };
      }
    },
    {
      id: "afiSdpCalc",
      cat: "obgyn",
      name: "Amniotic Fluid Assessment (AFI & SDP)",
      desc: "Four-quadrant Amniotic Fluid Index and Single Deepest Pocket classification.",
      fields: [
        N("afi", "Amniotic Fluid Index (AFI sum, cm)", 12.5, { min: 0, max: 45.0, step: 0.5 }),
        N("sdp", "Single Deepest Vertical Pocket (SDP, cm)", 4.2, { min: 0, max: 18.0, step: 0.2 })
      ],
      guidance: "1. For AFI: Divide maternal abdomen into 4 quadrants; measure the vertical depth of the largest fluid pocket free of umbilical cord and fetal small parts in each quadrant, then sum them.\n2. For SDP: Measure the maximum vertical pocket depth perpendicular to the uterine contour without cord loops.",
      contraindications: "Do not include pockets that contain reverberation artifacts or loops of umbilical cord (verify using color Doppler). In twin pregnancies, SDP is the only validated method.",
      references: "1. Reddy UM, et al. Fetal imaging: executive summary of a Eunice Kennedy Shriver NICHD Workshop. Obstet Gynecol. 2014;123(5):1070-1082.\n2. Nabhan AF, Abdelmoula YA. Amniotic fluid index versus single deepest vertical pocket. Cochrane Database Syst Rev. 2008;(3):CD006593.",
      calc: v => {
        const afi = +v.afi, sdp = +v.sdp;
        const afiInterp = afi < 5.0 ? "Oligohydramnios (<5.0 cm)" : afi <= 24.0 ? "Normal AFI (5.0–24.0 cm)" : "Polyhydramnios (>24.0 cm)";
        const sdpInterp = sdp < 2.0 ? "Oligohydramnios (<2.0 cm)" : sdp <= 8.0 ? "Normal SDP (2.0–8.0 cm)" : "Polyhydramnios (>8.0 cm)";
        return {
          value: `AFI: ${afi} cm | SDP: ${sdp} cm`,
          eq: `AFI Status: ${afiInterp}\nSDP Status: ${sdpInterp}\nNote: SDP measurement is preferred over AFI in low-risk singleton pregnancies to avoid overdiagnosing oligohydramnios.`
        };
      }
    },
    {
      id: "bppScore",
      cat: "obgyn",
      name: "Manning Biophysical Profile (BPP)",
      desc: "Antenatal fetal wellbeing score evaluating 5 ultrasonographic and cardiotocographic parameters.",
      guidance: "1. Perform continuous real-time ultrasound examination for up to 30 minutes.\n2. Evaluate fetal breathing (≥30s), gross body movements (≥3), fetal tone (extension/flexion), and vertical fluid pocket (≥2 cm).\n3. Pair with a 20–40 minute Non-Stress Test (NST).",
      contraindications: "Transiently depressed by maternal magnesium sulfate, corticosteroids, opioids, sedatives, or fetal sleep cycles. Equivocal scores should be repeated after waking the fetus.",
      references: "1. Manning FA, et al. Fetal assessment based on fetal biophysical profile scoring: experience in 12,620 referred high-risk pregnancies. Am J Obstet Gynecol. 1987;157(4 Pt 1):880-888.",
      fields: [
        S("nst", "1. Non-Stress Test (Reactive)", "2", [["2", "Reactive: ≥2 accelerations (≥15 bpm for 15s) in 20–40 min (+2)"], ["0", "Non-reactive (+0)"]]),
        S("breathing", "2. Fetal Breathing Movements", "2", [["2", "Present: ≥1 episode lasting ≥30s in 30 min (+2)"], ["0", "Absent or <30s (+0)"]]),
        S("movement", "3. Gross Fetal Body Movements", "2", [["2", "Present: ≥3 discrete body/limb movements in 30 min (+2)"], ["0", "<3 movements (+0)"]]),
        S("tone", "4. Fetal Muscle Tone", "2", [["2", "Present: ≥1 active extension with return to flexion (+2)"], ["0", "Absent / slow extension without rapid return (+0)"]]),
        S("fluid", "5. Amniotic Fluid Volume", "2", [["2", "Normal: ≥1 vertical pocket measuring ≥2 cm (+2)"], ["0", "Oligohydramnios: deepest pocket <2 cm (+0)"]])
      ],
      calc: v => {
        const score = +v.nst + +v.breathing + +v.movement + +v.tone + +v.fluid;
        let interp = "";
        if (score >= 8) interp = "Low risk of chronic asphyxia (Conservative antenatal care).";
        else if (score === 6) interp = "Equivocal (Repeat testing within 24 hours; deliver if oligohydramnios present or at term).";
        else interp = "High risk of fetal asphyxia (Immediate clinical and delivery evaluation).";
        return {
          value: `BPP Score: ${score} / 10`,
          eq: `Interpretation: ${interp}\nNote: An ultrasound score of 8/8 (without NST) carries diagnostic equivalence to 10/10 if amniotic fluid is normal.`
        };
      }
    },
    {
      id: "gestationalWeightGain",
      cat: "obgyn",
      name: "Pregnancy Weight Gain Target (IOM)",
      desc: "Calculates pre-pregnancy BMI and recommended gestational weight gain targets.",
      guidance: "1. Obtain maternal pre-pregnancy weight (or accurate 1st-trimester booking weight) and height.\n2. Select whether singleton or twin gestation.\n3. Track weekly gain trajectory during the 2nd and 3rd trimesters.",
      contraindications: "Not applicable to triplet or higher-order multiple gestations. Does not adjust for rapid weight changes driven by severe pathological edema or ascites.",
      references: "1. Institute of Medicine (IOM) and National Research Council. Weight Gain During Pregnancy: Reexamining the Guidelines. Washington, DC: The National Academies Press; 2009.",
      fields: [
        N("weight", "Pre-pregnancy Weight (kg)", 60, { min: 30, max: 200, step: 0.5 }),
        N("height", "Height (cm)", 160, { min: 120, max: 210, step: 1 }),
        S("twins", "Gestation Type", "1", [["1", "Singleton Gestation"], ["2", "Twin Gestation"]])
      ],
      calc: v => {
        const hM = +v.height / 100;
        const bmi = +v.weight / (hM * hM);
        let cat = "", rec = "";
        if (+v.twins === 1) {
          if (bmi < 18.5) { cat = "Underweight"; rec = "12.5 – 18.0 kg (0.5 kg/week in 2nd/3rd trimester)"; }
          else if (bmi < 25.0) { cat = "Normal weight"; rec = "11.5 – 16.0 kg (0.4 kg/week in 2nd/3rd trimester)"; }
          else if (bmi < 30.0) { cat = "Overweight"; rec = "7.0 – 11.5 kg (0.28 kg/week in 2nd/3rd trimester)"; }
          else { cat = "Obese"; rec = "5.0 – 9.0 kg (0.22 kg/week in 2nd/3rd trimester)"; }
        } else {
          if (bmi < 25.0) { cat = "Normal weight (Twins)"; rec = "16.8 – 24.5 kg"; }
          else if (bmi < 30.0) { cat = "Overweight (Twins)"; rec = "14.1 – 22.7 kg"; }
          else { cat = "Obese (Twins)"; rec = "11.3 – 19.1 kg"; }
        }
        return {
          value: `BMI: ${bmi.toFixed(1)} kg/m² (${cat})`,
          eq: `Recommended Total Weight Gain: ${rec}\nBased on Institute of Medicine (IOM) gestational weight criteria.`
        };
      }
    },

    // ==========================================
    // 2. ANTENATAL SCREENING & RISK ASSESSMENT
    // ==========================================
    {
      id: "combinedScreeningMom",
      cat: "obgyn",
      name: "First-Trimester Combined Screening Helper",
      desc: "Risk pattern interpreter for Nuchal Translucency, PAPP-A MoM, and free β-hCG MoM.",
      guidance: "1. Perform ultrasound between 11+0 and 13+6 weeks (CRL 45–84 mm) with an accredited sonographer.\n2. Measure true fetal midsagittal NT with inner-to-inner callipers.\n3. Input maternal serum PAPP-A and free β-hCG expressed in Multiples of the Median (MoM).",
      contraindications: "Not diagnostic of chromosomal aneuploidy (screening only). Do not perform outside 11+0 to 13+6 weeks gestation.",
      references: "1. Malone FD, et al. First-trimester or second-trimester screening, or both, for Down's syndrome. N Engl J Med. 2005;353(19):2001-2011.",
      fields: [
        N("nt", "Nuchal Translucency (NT, mm)", 1.8, { min: 0.5, max: 10.0, step: 0.1 }),
        N("pappaMom", "PAPP-A (MoM)", 1.0, { min: 0.1, max: 5.0, step: 0.05 }),
        N("hcgMom", "Free β-hCG (MoM)", 1.0, { min: 0.1, max: 5.0, step: 0.05 })
      ],
      calc: v => {
        const nt = +v.nt, pa = +v.pappaMom, hcg = +v.hcgMom;
        let risk = "Standard / Low-Risk Pattern";
        let detail = "Biomarkers reflect normal maternal serum distributions.";
        if (nt >= 3.5) {
          risk = "High Risk: Markedly Increased NT (≥3.5 mm)";
          detail = "Significant association with Trisomies 21/18/13, Turner syndrome, major congenital heart disease, and Noonan syndrome. Recommend diagnostic testing (CVS/Amniocentesis) and fetal echocardiography.";
        } else if (pa < 0.4 && hcg > 2.0) {
          risk = "High Risk Pattern for Trisomy 21 (Down Syndrome)";
          detail = "Classic biochemical profile: suppressed PAPP-A (<0.4 MoM) coupled with elevated free β-hCG (>2.0 MoM).";
        } else if (pa < 0.3 && hcg < 0.3) {
          risk = "High Risk Pattern for Trisomy 18 / Trisomy 13";
          detail = "Severe concordant suppression of both serum analytes (PAPP-A and free β-hCG <0.3 MoM).";
        }
        return {
          value: risk,
          eq: `${detail}\nScreening window: CRL 45–84 mm. Final patient-specific odds require algorithmic integration with maternal age.`
        };
      }
    },
    {
      id: "ogttInterpretation",
      cat: "obgyn",
      name: "Gestational Diabetes 75g OGTT (IADPSG / WHO)",
      desc: "Diagnostic classification based on the standard 2-hour 75g oral glucose tolerance test.",
      guidance: "1. Patient must fast for 8–14 hours prior to morning test.\n2. Draw fasting venous plasma sample.\n3. Administer 75g anhydrous oral glucose dissolved in water over 5 minutes.\n4. Draw venous plasma at exactly 1 hour and 2 hours post-load.",
      contraindications: "Do not perform during acute febrile illness, severe hyperemesis, or post-bariatric surgery (dumping syndrome risk; use self-monitoring profiles instead).",
      references: "1. International Association of Diabetes and Pregnancy Study Groups Consensus Panel. IADPSG recommendations on the diagnosis and classification of hyperglycemia in pregnancy. Diabetes Care. 2010;33(3):676-682.",
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
        if (fAbn) details.push(`Fasting: ${f} mg/dL (cut-off ≥92)`);
        if (h1Abn) details.push(`1-hour: ${h1} mg/dL (cut-off ≥180)`);
        if (h2Abn) details.push(`2-hour: ${h2} mg/dL (cut-off ≥153)`);

        return {
          value: isGdm ? "GESTATIONAL DIABETES DIAGNOSED" : "Normal 75g OGTT",
          eq: isGdm ?
            `Thresholds exceeded: ${details.join("; ")}.\nPer IADPSG/WHO criteria, any single abnormal value confirms GDM.` :
            "All values are below diagnostic thresholds (Fasting <92, 1h <180, 2h <153 mg/dL)."
        };
      }
    },

    // ==========================================
    // 3. OBSTETRIC SCORES & CLASSIFICATIONS
    // ==========================================
    {
      id: "apgarScore",
      cat: "obgyn",
      name: "Apgar Score (Neonatal Assessment)",
      desc: "Standard 1-minute and 5-minute scoring of physiological neonatal transition.",
      guidance: "1. Score at exactly 1 minute and 5 minutes after complete delivery.\n2. If the 5-minute score is <7, continue scoring every 5 minutes up to 20 minutes.\n3. Score each component from 0 to 2 points.",
      contraindications: "Resuscitation must NOT be delayed to calculate the 1-minute Apgar score. Not an indicator of single etiology or future long-term neurological outcome.",
      references: "1. Apgar V. A proposal for a new method of evaluation of the newborn infant. Curr Res Anesth Analg. 1953;32(4):260-267.\n2. American Academy of Pediatrics, ACOG. The Apgar Score. Pediatrics. 2015;136(4):819-822.",
      fields: [
        S("app", "Appearance (Skin Color)", "2", [["0", "Blue or pale all over (0)"], ["1", "Pink body, blue extremities / acrocyanosis (+1)"], ["2", "Completely pink (+2)"]]),
        S("pulse", "Pulse (Heart Rate)", "2", [["0", "Absent (0)"], ["1", "<100 beats/min (+1)"], ["2", "≥100 beats/min (+2)"]]),
        S("grimace", "Grimace (Reflex Irritability)", "2", [["0", "No response to suction/stimulation (0)"], ["1", "Grimace or feeble cry (+1)"], ["2", "Cough, sneeze, or vigorous withdrawal (+2)"]]),
        S("activity", "Activity (Muscle Tone)", "2", [["0", "Limp / flaccid (0)"], ["1", "Some flexion of extremities (+1)"], ["2", "Active motion, flexed posture (+2)"]]),
        S("resp", "Respiration", "2", [["0", "Absent (0)"], ["1", "Slow, irregular, gasping (+1)"], ["2", "Vigorous, strong cry (+2)"]])
      ],
      calc: v => {
        const total = +v.app + +v.pulse + +v.grimace + +v.activity + +v.resp;
        let c = total >= 7 ? "Normal transition (Score 7–10)" : total >= 4 ? "Moderately abnormal (Score 4–6; needs airway clearance and tactile stimulation)" : "SEVERELY DEPRESSED (Score 0–3; execute immediate neonatal resuscitation algorithm)";
        return {
          value: `Apgar: ${total} / 10`,
          eq: `Status: ${c}\nCalculated across Appearance, Pulse, Grimace, Activity, and Respiration.`
        };
      }
    },
    {
      id: "obstetricShockIndex",
      cat: "obgyn",
      name: "Obstetric Shock Index (OSI)",
      desc: "Early bedside predictor of occult or massive haemorrhage in obstetric care.",
      guidance: "1. Obtain contemporaneous maternal heart rate and systolic blood pressure.\n2. Calculate OSI = Heart Rate ÷ Systolic BP.\n3. Re-evaluate dynamically alongside visual blood loss checks.",
      contraindications: "Can be confounded by baseline sinus tachycardia (sepsis, dehydration, beta-agonist tocolytic therapy) or pre-existing severe gestational hypertension.",
      references: "1. Nathan HL, et al. The Obstetric Shock Index: a flag for early resuscitation. BJOG. 2014;121(12):1559-1560.",
      fields: [
        N("hr", "Maternal Heart Rate (bpm)", 115, { min: 40, max: 200, step: 1 }),
        N("sbp", "Systolic Blood Pressure (mmHg)", 85, { min: 40, max: 220, step: 1 })
      ],
      calc: v => {
        const osi = +v.hr / +v.sbp;
        let c = "";
        if (osi < 0.7) c = "Normal physiology / low risk of shock.";
        else if (osi <= 0.9) c = "Normal upper limit for obstetric physiology (0.7–0.9).";
        else if (osi < 1.4) c = "SIGNIFICANT HEMODYNAMIC COMPROMISE: Blood loss likely >1000 mL. Alert obstetric team and crossmatch blood.";
        else c = "CRITICAL IMMINENT COLLAPSE: Massive haemorrhage (>1500–2000 mL). Trigger Massive Transfusion Protocol immediately.";
        return {
          value: `OSI: ${osi.toFixed(2)}`,
          eq: `Clinical Classification: ${c}\nFormula: Heart Rate ÷ Systolic BP. Maternal vascular reserve often masks significant blood loss until sudden hemodynamic decompensation occurs.`
        };
      }
    },
    {
      id: "meowsScore",
      cat: "obgyn",
      name: "Modified Early Obstetric Warning Score (MEOWS)",
      desc: "Screening trigger score to detect early clinical and physiological deterioration in pregnancy.",
      guidance: "1. Record a complete set of bedside maternal vital signs.\n2. Input respiratory rate, room-air SpO₂, temperature, BP, pulse, and AVPU level.\n3. Identify presence of single Red triggers or paired Yellow triggers.",
      contraindications: "Not a substitute for continuous clinical judgment. Must be tailored in patients with known baseline chronic respiratory disease or congenital cardiac defects.",
      references: "1. Confidential Enquiry into Maternal and Child Health (CEMACH). Saving Mothers' Lives: Reviewing maternal deaths to make motherhood safer. London: CEMACH; 2007.",
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
        if (red >= 1) alert = `RED ALERT (${red} Red, ${yellow} Yellow): Immediate urgent multi-disciplinary review required!`;
        else if (yellow >= 2) alert = `YELLOW ALERT (${yellow} Yellow triggers): Urgent bedside review within 30 min. Increase vital monitoring.`;
        else alert = "Normal parameters (Low clinical risk)";

        return {
          value: alert,
          eq: "MEOWS Escalation Rule: Triggered by 1 RED marker OR ≥2 YELLOW markers simultaneously."
        };
      }
    },

    // ==========================================
    // 4. LABOUR AND DELIVERY
    // ==========================================
    {
      id: "bishopScore",
      cat: "obgyn",
      name: "Bishop Score for Cervical Ripening and Induction",
      desc: "Standard assessment of cervical readiness and favourability before induction of labour.",
      guidance: "1. Perform digital vaginal examination to determine dilatation, effacement, station, consistency, and position.\n2. Sum the scores (0 to 13 total).\n3. Score ≥8 indicates readiness for direct oxytocin/amniotomy; ≤6 indicates need for cervical ripening.",
      contraindications: "Do not perform digital exam in suspected placenta praevia, unexplained antepartum vaginal bleeding, or preterm premature rupture of membranes without induction indication.",
      references: "1. Bishop EH. Pelvic scoring for elective induction. Obstet Gynecol. 1964;24:266-268.",
      fields: [
        S("dil", "1. Cervical Dilatation", "0", [["0", "Closed (0)"], ["1", "1–2 cm (+1)"], ["2", "3–4 cm (+2)"], ["3", "≥5 cm (+3)"]]),
        S("eff", "2. Cervical Effacement", "1", [["0", "0–30% (0)"], ["1", "40–50% (+1)"], ["2", "60–70% (+2)"], ["3", "≥80% (+3)"]]),
        S("stat", "3. Fetal Station (relative to spines)", "0", [["0", "-3 station (0)"], ["1", "-2 station (+1)"], ["2", "-1 or 0 station (+2)"], ["3", "+1 or +2 station (+3)"]]),
        S("cons", "4. Cervical Consistency", "1", [["0", "Firm (0)"], ["1", "Medium (+1)"], ["2", "Soft (+2)"]]),
        S("pos", "5. Cervical Position", "0", [["0", "Posterior (0)"], ["1", "Mid-position (+1)"], ["2", "Anterior (+2)"]])
      ],
      calc: v => {
        const score = +v.dil + +v.eff + +v.stat + +v.cons + +v.pos;
        let c = score >= 8 ? "Favourable cervix (High probability of successful vaginal delivery; oxytocin infusion or amniotomy appropriate)." : score <= 6 ? "Unfavourable cervix (High failure risk; cervical ripening indicated with prostaglandins or mechanical Foley balloon)." : "Intermediate cervix (Score 7).";
        return {
          value: `Bishop Score: ${score} / 13`,
          eq: `Clinical Strategy: ${c}\nStandard Bishop cutoff: ≥8 predicts success comparable to spontaneous labour.`
        };
      }
    },
    {
      id: "oxytocinCalculator",
      cat: "obgyn",
      name: "Oxytocin Infusion Rate Calculator",
      desc: "Converts targeted milliunits per minute (mU/min) into volumetric IV infusion pump rates (mL/h).",
      guidance: "1. Confirm oxytocin solution concentration (units added to 500 mL diluent).\n2. Select starting dose (typically 1–2 mU/min).\n3. Titrate upward by 1–2 mU/min every 30 minutes until 3–4 contractions occur per 10 minutes.",
      contraindications: "Uterine tachysystole (>5 contractions in 10 minutes over 30 minutes), abnormal fetal heart rate patterns, cephalopelvic disproportion, prior classical cesarean scar, or placenta praevia.",
      references: "1. ACOG Practice Bulletin No. 107: Induction of Labor. Obstet Gynecol. 2009;114(2 Pt 1):386-397.",
      fields: [
        N("doseMu", "Targeted Oxytocin Dose (mU/min)", 4, { min: 1, max: 40, step: 1 }),
        S("concentration", "Standard Solution Concentration", "10_500", [
          ["5_500", "5 Units in 500 mL (10 mU/mL)"],
          ["10_500", "10 Units in 500 mL (20 mU/mL)"],
          ["30_500", "30 Units in 500 mL (60 mU/mL)"]
        ])
      ],
      calc: v => {
        const concVal = v.concentration === "5_500" ? 10 : v.concentration === "10_500" ? 20 : 60;
        const mlPerHour = (+v.doseMu * 60) / concVal;
        return {
          value: `${mlPerHour.toFixed(1)} mL/hour`,
          eq: `Formula: mL/h = (mU/min × 60 min/h) ÷ Solution Concentration (${concVal} mU/mL).\nTitrate carefully with continuous electronic fetal cardiotocography.`
        };
      }
    },
    {
      id: "vbacSuccess",
      cat: "obgyn",
      name: "VBAC / TOLAC Success Prediction Helper",
      desc: "Clinical factor weighting for trial of labour after prior low transverse cesarean section.",
      guidance: "1. Verify candidate has one prior low transverse uterine scar.\n2. Evaluate prior vaginal delivery history, non-recurring initial indications, BMI, and admission cervical status.\n3. Discuss institutional readiness for emergency cesarean delivery.",
      contraindications: "Prior classical, inverted T, or unknown uterine extension scar; previous uterine rupture; extensive transmural uterine myomectomy; or standard contraindications to vaginal delivery.",
      references: "1. Grobman WA, et al. Development of a nomogram for prediction of success of trial of labor after cesarean delivery. Obstet Gynecol. 2007;109(4):806-812.",
      fields: [
        S("priorVag", "Prior Vaginal Delivery?", "1", [["0", "No prior vaginal delivery (0)"], ["2", "Yes, prior vaginal delivery (+2)"], ["3", "Yes, prior successful VBAC (+3)"]]),
        S("indication", "Prior Cesarean Indication", "1", [["1", "Non-recurring (e.g. breech, herpes, fetal distress) (+1)"], ["0", "Recurring (e.g. cephalopelvic disproportion, dystocia) (0)"]]),
        S("bmi", "Maternal BMI", "0", [["1", "BMI <30 kg/m² (+1)"], ["0", "BMI ≥30 kg/m² (0)"]]),
        S("cervix", "Cervical Status on Admission", "1", [["1", "Favourable / dilated ≥3 cm (+1)"], ["0", "Closed / unfavourable (0)"]])
      ],
      calc: v => {
        const pts = +v.priorVag + +v.indication + +v.bmi + +v.cervix;
        let prob = pts >= 4 ? "High VBAC success rate (>75–85%)" : pts >= 2 ? "Moderate success rate (~60–75%)" : "Lower success rate (<50–60%)";
        return {
          value: prob,
          eq: "Success probability is highest with a prior vaginal delivery and non-recurring indication. Baseline risk of uterine rupture in low transverse scar is ~0.5–0.7%."
        };
      }
    },

    // ==========================================
    // 5. OBSTETRIC EMERGENCIES
    // ==========================================
    {
      id: "pphSeverityAssessment",
      cat: "obgyn",
      name: "Postpartum Haemorrhage (PPH) Severity Staging",
      desc: "Clinical staging and immediate step-by-step management protocol for PPH.",
      guidance: "1. Quantify blood loss quantitatively (weigh drapes/sponges; use calibrated collection bags).\n2. Note delivery mode and hemodynamic stability.\n3. Follow stage-specific intervention protocols.",
      contraindications: "Do not rely on visual estimation alone (visual inspection routinely underestimates blood loss by 30–50%). Avoid Ergometrine in hypertension or Carboprost in active asthma.",
      references: "1. Committee on Practice Bulletins-Obstetrics. Practice Bulletin No. 183: Postpartum Hemorrhage. Obstet Gynecol. 2017;130(4):e168-e186.\n2. WHO Guidelines for the Management of Postpartum Haemorrhage and Retained Placenta. Geneva: WHO; 2012.",
      fields: [
        N("lossMl", "Cumulative Blood Loss (mL)", 1200, { min: 100, max: 5000, step: 50 }),
        S("mode", "Delivery Mode", "vaginal", [["vaginal", "Vaginal Delivery"], ["cesarean", "Cesarean Delivery"]]),
        S("instability", "Hemodynamic Instability Present?", "0", [["0", "Stable vitals"], ["1", "Tachycardia, hypotension, or pallor"]])
      ],
      calc: v => {
        const ml = +v.lossMl;
        const unstable = v.instability === "1";
        let stage = "", tx = "";
        if (ml >= 2000 || (ml >= 1500 && unstable)) {
          stage = "STAGE 3: Severe / Catastrophic PPH (>1500–2000 mL)";
          tx = "Action: Activate Massive Transfusion Protocol (1:1:1 PRBC:FFP:Platelets). Administer Tranexamic Acid (TXA) 1g IV over 10 min. Surgical management (intrauterine balloon tamponade, B-Lynch suture, uterine artery ligation, or hysterectomy).";
        } else if (ml >= 1000 || unstable) {
          stage = "STAGE 2: Moderate PPH (1000–1500 mL)";
          tx = "Action: Escalate uterotonics (Carboprost 0.25mg IM, Misoprostol 800mcg sublingual, or Methylergometrine 0.2mg IM if non-hypertensive). Mobilize bedside team, crossmatch 2–4 units PRBC, consider Bakri balloon.";
        } else if ((v.mode === "vaginal" && ml >= 500) || (v.mode === "cesarean" && ml >= 1000)) {
          stage = "STAGE 1: Mild PPH";
          tx = "Action: Uterine fundal massage, oxytocin infusion (20–40 units in 1000 mL), evaluate 4 T's (Tone, Trauma, Tissue, Thrombin), insert two 16G IV cannulae.";
        } else {
          stage = "Physiologic Blood Loss";
          tx = "Continue routine active management of the third stage of labour (AMTSL).";
        }
        return {
          value: stage,
          eq: tx
        };
      }
    },
    {
      id: "mgso4RegimenCalc",
      cat: "obgyn",
      name: "Magnesium Sulfate Dosing & Toxicity Monitor",
      desc: "Loading and maintenance protocols for eclampsia prophylaxis/treatment and bedside toxicity checks.",
      guidance: "1. Choose either the Zuspan (IV) or Pritchard (IV+IM) protocol.\n2. Regularly monitor patellar deep tendon reflexes, respiratory rate (>12/min), and hourly urine output (>25–30 mL/h).\n3. Keep antidote (Calcium Gluconate) at the bedside.",
      contraindications: "Myasthenia gravis (absolute contraindication; precipitates fatal myasthenic crisis), heart block, severe myocardial damage, or severe anuric renal failure.",
      references: "1. The Magpie Trial Collaborative Group. Do women with pre-eclampsia benefit from magnesium sulphate? Lancet. 2002;359(9321):1877-1890.\n2. Zuspan FP. Problems encountered in the treatment of pregnancy-induced hypertension. Am J Obstet Gynecol. 1978;131(6):591-597.",
      fields: [
        S("protocol", "Selected MgSO4 Protocol", "zuspan", [
          ["zuspan", "Zuspan Protocol (IV only: 4g load, then 1–2 g/h)"],
          ["pritchard", "Pritchard Protocol (IV + IM: 4g IV + 10g IM, then 5g IM q4h)"]
        ]),
        S("reflex", "Patellar Deep Tendon Reflexes", "intact", [["intact", "Brisk / Normal"], ["depressed", "Diminished / Absent (Toxicity Warning)"]]),
        N("rr", "Respiratory Rate (/min)", 16, { min: 6, max: 40, step: 1 }),
        N("uop", "Urine Output in last hour (mL/h)", 35, { min: 0, max: 200, step: 1 })
      ],
      calc: v => {
        const toxic = v.reflex === "depressed" || +v.rr < 12 || +v.uop < 25;
        let alert = "";
        if (toxic) {
          alert = "SUSPECTED MAGNESIUM TOXICITY! Immediately STOP MgSO4. Administer 10% Calcium Gluconate 10 mL (1 g) IV slowly over 10 minutes. Send stat serum magnesium level.";
        } else {
          alert = v.protocol === "zuspan" ?
            "Infusion Normal: Zuspan IV 4g loading over 20 min, then 1–2 g/h continuous IV infusion. Continue for 24h postpartum or after last fit." :
            "Regimen Normal: Pritchard 4g IV + 10g deep IM loading (5g in each buttock with 1 mL 2% lidocaine). Maintenance: 5g IM every 4 hours alternating buttocks.";
        }
        return {
          value: toxic ? "TOXICITY ALERT" : "Protocol Running Safely",
          eq: `${alert}\nToxicity Check: Patellar reflexes present, RR ≥12/min, Urine output ≥25–30 mL/h.`
        };
      }
    },
    {
      id: "hellpCriteria",
      cat: "obgyn",
      name: "HELLP Syndrome Diagnostic Criteria (Tennessee)",
      desc: "Evaluates microangiopathic hemolysis, hepatic transaminases, and thrombocytopenia.",
      guidance: "1. Evaluate pregnant or postpartum patient presenting with epigastric/RUQ pain, malaise, or hypertension.\n2. Obtain complete blood count with peripheral smear, AST/ALT, LDH, and total bilirubin.\n3. Classify as complete HELLP or partial syndrome.",
      contraindications: "Do not delay delivery in confirmed complete HELLP at ≥34 weeks or with maternal/fetal deterioration. Exclude hemolytic uremic syndrome (HUS), TTP, and acute fatty liver of pregnancy (AFLP).",
      references: "1. Sibai BM. Diagnosis, controversies, and management of the syndrome of hemolysis, elevated liver enzymes, and low platelet count. Obstet Gynecol. 2004;103(5 Pt 1):981-991.\n2. Martin JN Jr, et al. Better classification of HELLP syndrome. Am J Obstet Gynecol. 1999;181(4):1043-1044.",
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

        let res = "", classification = "";
        if (isComplete) {
          const mississippi = p < 50000 ? "Mississippi Class 1 (Platelets <50k)" : "Mississippi Class 2 (Platelets 50k–100k)";
          res = "COMPLETE HELLP SYNDROME";
          classification = `${mississippi}: High risk of DIC, subcapsular liver hematoma, and placental abruption. Stabilize and plan immediate delivery.`;
        } else if (isPartial) {
          res = "PARTIAL HELLP SYNDROME";
          classification = "ELLP or HEL variants present. Close laboratory surveillance mandated as rapid progression to complete HELLP is common.";
        } else {
          res = "HELLP Criteria Not Met";
          classification = "Parameters do not satisfy the classical Tennessee triad.";
        }
        return {
          value: res,
          eq: `${classification}\nTennessee Criteria: Hemolysis (LDH ≥600 U/L or Bilirubin ≥1.2 mg/dL) + AST ≥70 U/L + Platelets <100,000/µL.`
        };
      }
    },

    // ==========================================
    // 6. HYPERTENSIVE DISORDERS OF PREGNANCY
    // ==========================================
    {
      id: "preeclampsiaAssessment",
      cat: "obgyn",
      name: "Preeclampsia Diagnostic & Severity Assessment",
      desc: "ACOG classification of preeclampsia with and without severe features.",
      guidance: "1. Confirm gestational age ≥20 weeks.\n2. Obtain 2 elevated blood pressure readings at least 4 hours apart (or minutes apart if severe ≥160/110).\n3. Check for proteinuria (UPCR ≥0.3 or 24-hr protein ≥300 mg) and systemic end-organ dysfunction.",
      contraindications: "Do not wait for proteinuria to diagnose preeclampsia if severe clinical or biochemical features are present.",
      references: "1. American College of Obstetricians and Gynecologists. Gestational Hypertension and Preeclampsia: ACOG Practice Bulletin, Number 222. Obstet Gynecol. 2020;135(6):e237-e260.",
      fields: [
        N("sbp", "Systolic Blood Pressure (mmHg)", 165, { min: 80, max: 260, step: 1 }),
        N("dbp", "Diastolic Blood Pressure (mmHg)", 112, { min: 40, max: 160, step: 1 }),
        N("upcr", "Urine Protein/Creatinine Ratio (mg/mg)", 0.45, { min: 0, max: 10.0, step: 0.05 }),
        S("severeFeatures", "Severe Systemic Features Present?", "1", [
          ["0", "None: No thrombocytopenia, elevated Cr, LFT elevation, pulmonary edema, or severe persistent neuro symptoms"],
          ["1", "Present: Platelets <100k, Cr >1.1, AST/ALT >2x, pulmonary edema, or refractory cerebral/visual disturbances"]
        ])
      ],
      calc: v => {
        const s = +v.sbp, d = +v.dbp, upcr = +v.upcr;
        const severeBp = s >= 160 || d >= 110;
        const hasProteinuria = upcr >= 0.3;
        const hasSevere = v.severeFeatures === "1" || severeBp;

        let dx = "", rec = "";
        if ((s >= 140 || d >= 90) && (hasProteinuria || hasSevere)) {
          if (hasSevere) {
            dx = "PREECLAMPSIA WITH SEVERE FEATURES";
            rec = "Urgent IV antihypertensives (Labetalol, Hydralazine, or oral Nifedipine). Seizure prophylaxis with IV MgSO4. Delivery indicated at ≥34 weeks (or earlier if maternal/fetal instability).";
          } else {
            dx = "PREECLAMPSIA WITHOUT SEVERE FEATURES";
            rec = "Close outpatient/inpatient surveillance with twice-weekly monitoring until planned delivery at 37 weeks.";
          }
        } else if (s >= 140 || d >= 90) {
          dx = "Gestational Hypertension";
          rec = "Monitor closely for development of proteinuria or end-organ features.";
        } else {
          dx = "Normotensive Baseline";
          rec = "Blood pressure and laboratory markers within expected limits.";
        }
        return {
          value: dx,
          eq: `${rec}\nSevere BP threshold: SBP ≥160 or DBP ≥110 mmHg. Proteinuria threshold: UPCR ≥0.3 mg/mg.`
        };
      }
    },

    // ==========================================
    // 7. GYNAECOLOGICAL MENSTRUAL DISORDERS
    // ==========================================
    {
      id: "rotterdamPcos",
      cat: "obgyn",
      name: "Rotterdam PCOS Diagnostic Criteria",
      desc: "Evaluates the three diagnostic pillars of Polycystic Ovary Syndrome.",
      guidance: "1. Rule out mimicking endocrinopathies (TSH, Prolactin, 17-OHP for CAH).\n2. Assess ovulatory function (cycles >35 days or <8 cycles/year).\n3. Evaluate clinical hirsutism/acne or elevated biochemical androgens.\n4. Perform transvaginal ultrasound for follicle count and ovarian volume.",
      contraindications: "Pelvic ultrasound criteria are non-specific in adolescents within 8 years of menarche (high prevalence of multi-follicular ovaries).",
      references: "1. The Rotterdam ESHRE/ASRM-Sponsored PCOS Consensus Workshop Group. Revised 2003 consensus on diagnostic criteria for polycystic ovary syndrome. Fertil Steril. 2004;81(1):19-25.\n2. Teede HJ, et al. Recommendations from the 2023 international evidence-based guideline for the assessment and management of polycystic ovary syndrome. Eur J Endocrinol. 2023;189(2):G43-G64.",
      fields: [
        S("oligo", "1. Ovulatory Dysfunction (Oligo/Anovulation)", "1", [["1", "Present: Cycle length >35 days or <8 cycles/year"], ["0", "Absent: Regular ovulatory cycles"]]),
        S("androgen", "2. Hyperandrogenism (Clinical or Biochemical)", "1", [["1", "Present: Hirsutism (mFG ≥4–8), severe cystic acne, or elevated free/total testosterone"], ["0", "Absent"]]),
        S("us", "3. Polycystic Ovaries on Ultrasound", "1", [["1", "Present: ≥20 follicles (2–9mm) per ovary and/or ovarian volume ≥10 mL"], ["0", "Absent"]])
      ],
      calc: v => {
        const count = +v.oligo + +v.androgen + +v.us;
        const isPcos = count >= 2;
        let phenotype = "";
        if (count === 3) phenotype = "Phenotype A (Full: Anovulation + Hyperandrogenism + PCO Morphology)";
        else if (+v.oligo === 1 && +v.androgen === 1) phenotype = "Phenotype B (Non-PCO: Anovulation + Hyperandrogenism)";
        else if (+v.androgen === 1 && +v.us === 1) phenotype = "Phenotype C (Ovulatory: Hyperandrogenism + PCO Morphology)";
        else if (+v.oligo === 1 && +v.us === 1) phenotype = "Phenotype D (Non-androgenic: Anovulation + PCO Morphology)";

        return {
          value: isPcos ? `PCOS CONFIRMED (${phenotype})` : `PCOS Not Confirmed (${count}/3 criteria satisfied)`,
          eq: "Rotterdam Consensus: Diagnosis requires ≥2 of 3 features after excluding thyroid dysfunction, hyperprolactinemia, and congenital adrenal hyperplasia."
        };
      }
    },
    {
      id: "palmCoeinAub",
      cat: "obgyn",
      name: "FIGO PALM-COEIN Classification for AUB",
      desc: "Categorizes causes of Abnormal Uterine Bleeding into structural and non-structural etiologies.",
      guidance: "1. Confirm non-gestational abnormal uterine bleeding.\n2. Screen for structural defects via transvaginal ultrasound, hysteroscopy, or histopathology (PALM).\n3. Screen for medical, coagulopathic, or endocrine etiologies (COEIN).",
      contraindications: "Not applicable during pregnancy. Always perform a urine pregnancy test first to exclude bleeding related to ectopic pregnancy or miscarriage.",
      references: "1. Munro MG, et al. The two FIGO systems for normal and abnormal uterine bleeding symptoms and classification of causes of abnormal uterine bleeding in the reproductive years. Int J Gynaecol Obstet. 2018;143(3):393-408.",
      fields: [
        S("palm", "Structural (PALM) Etiologies", "none", [
          ["none", "None identified on imaging/histology"],
          ["P", "P — Polyp (Endometrial or endocervical)"],
          ["A", "A — Adenomyosis"],
          ["L", "L — Leiomyoma (Submucosal or intramural)"],
          ["M", "M — Malignancy and Hyperplasia (Endometrial hyperplasia/cancer)"]
        ]),
        S("coein", "Non-Structural (COEIN) Etiologies", "none", [
          ["none", "None identified"],
          ["C", "C — Coagulopathy (e.g. von Willebrand disease, anticoagulant therapy)"],
          ["O", "O — Ovulatory dysfunction (PCOS, thyroid disease)"],
          ["E", "E — Endometrial primary dysfunction"],
          ["I", "I — Iatrogenic (IUD, hormones, psychotropics)"],
          ["N", "N — Not otherwise classified"]
        ])
      ],
      calc: v => {
        let res = [];
        if (v.palm !== "none") res.push(`Structural (PALM): ${v.palm}`);
        if (v.coein !== "none") res.push(`Non-Structural (COEIN): ${v.coein}`);
        return {
          value: res.length > 0 ? res.join(" | ") : "No PALM-COEIN category identified",
          eq: "PALM-COEIN Classification: Enables multiple concurrent etiologies (e.g., AUB-P;O) to direct combined medical and surgical care."
        };
      }
    },

    // ==========================================
    // 8. INFERTILITY & REPRODUCTIVE MEDICINE
    // ==========================================
    {
      id: "ovarianReserveAmh",
      cat: "obgyn",
      name: "Ovarian Reserve & AMH Interpretation",
      desc: "Correlates Anti-Müllerian Hormone (AMH) and Antral Follicle Count (AFC) with ovarian stimulation response.",
      guidance: "1. Draw serum AMH (can be measured on any day of the menstrual cycle).\n2. Perform early follicular transvaginal ultrasound (day 2–4) for bilateral Antral Follicle Count (2–10 mm follicles).\n3. Use combined profile to guide gonadotropin dosing in assisted reproduction.",
      contraindications: "Does not independently predict spontaneous natural conception in fertile couples. Serum AMH can be falsely suppressed by prolonged oral contraceptive use.",
      references: "1. Ferraretti AP, et al. ESHRE consensus on the definition of 'poor response' to ovarian stimulation for in vitro fertilization: the Bologna criteria. Hum Reprod. 2011;26(7):1616-1624.\n2. Alviggi C, et al. A new more detailed stratification of low responders to ovarian stimulation: from a poor ovarian response to a low prognosis. The POSEIDON criteria. Front Endocrinol. 2016;7:1-7.",
      fields: [
        N("amh", "Serum AMH (ng/mL)", 2.4, { min: 0.05, max: 20.0, step: 0.1 }),
        N("afc", "Antral Follicle Count (total bilateral)", 14, { min: 0, max: 60, step: 1 })
      ],
      calc: v => {
        const amh = +v.amh, afc = +v.afc;
        let c = "";
        if (amh < 0.5 || afc < 5) c = "Severely Diminished Ovarian Reserve (Very high risk of cycle cancellation / poor IVF response).";
        else if (amh < 1.1 || afc < 7) c = "Diminished Ovarian Reserve (Satisfies Bologna / POSEIDON criteria for poor ovarian response).";
        else if (amh > 3.5 || afc > 20) c = "High Ovarian Reserve (Risk of Ovarian Hyperstimulation Syndrome [OHSS]; consider GnRH antagonist protocol and GnRH agonist trigger).";
        else c = "Normal Ovarian Reserve (Anticipate standard response to controlled ovarian stimulation).";
        return {
          value: `AMH: ${amh} ng/mL | AFC: ${afc}`,
          eq: `Response Prediction: ${c}\nAMH directly reflects the functional cohort of pre-antral and small antral follicles.`
        };
      }
    },
    {
      id: "whoSemenAnalysis",
      cat: "obgyn",
      name: "WHO 6th Edition Semen Analysis Interpretation",
      desc: "Evaluates semen parameters against WHO 2021 lower reference limits (5th percentile).",
      guidance: "1. Collect sample after 2 to 7 days of sexual abstinence.\n2. Deliver sample to the laboratory within 60 minutes, maintained near body temperature (20–37°C).\n3. Compare volume, count, progressive motility, and strict morphology against 2021 standards.",
      contraindications: "A single abnormal semen analysis is not diagnostic. Always repeat testing 2–4 weeks later before confirming male factor subfertility.",
      references: "1. World Health Organization. WHO Laboratory Manual for the Examination and Processing of Human Semen, 6th ed. Geneva: World Health Organization; 2021.",
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
          value: abn.length === 0 ? "Normozoospermia" : `Abnormal: ${abn.join(", ")}`,
          eq: `Total Sperm Count: ${totalCount} million/ejaculate.\nWHO 6th Ed (2021) lower reference limits: Volume ≥1.4 mL, Total Count ≥39 M, Concentration ≥16 M/mL, Progressive Motility ≥30%, Morphology ≥4%.`
        };
      }
    },

    // ==========================================
    // 9. CONTRACEPTION AND FAMILY PLANNING
    // ==========================================
    {
      id: "whoMecContraception",
      cat: "obgyn",
      name: "WHO Medical Eligibility Criteria (MEC) Checker",
      desc: "Rapid safety screening for Combined Hormonal Contraceptives (COCs) vs Progestin-only/IUDs.",
      guidance: "1. Identify patient clinical conditions and cardiovascular risk factors.\n2. Cross-reference against WHO MEC categories (1 to 4).\n3. Category 1 & 2: Eligible for use; Category 3: Clinical risks outweigh benefits; Category 4: Unacceptable health risk (contraindicated).",
      contraindications: "Combined hormonal methods are strictly contraindicated (MEC 4) in migraine with aura, severe hypertension (≥160/100), active/prior VTE, breast cancer, and smokers age ≥35.",
      references: "1. World Health Organization. Medical Eligibility Criteria for Contraceptive Use, 5th ed. Geneva: World Health Organization; 2015.",
      fields: [
        S("condition", "Clinical Condition / Risk Factor", "smoker_over35", [
          ["none", "Healthy non-smoker, no vascular risk factors"],
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
          value: `COC: MEC ${mecCoc}`,
          eq: `POP Eligibility: MEC ${mecPop}\nCopper IUD Eligibility: MEC ${mecIud}\nCategories: 1 = No restriction; 2 = Advantages outweigh risks; 3 = Risks outweigh advantages; 4 = Unacceptable health risk.`
        };
      }
    },

    // ==========================================
    // 10. GYNAECOLOGICAL ONCOLOGY
    // ==========================================
    {
      id: "rmiOvarianCancer",
      cat: "obgyn",
      name: "Risk of Malignancy Index (RMI I) for Adnexal Masses",
      desc: "Combines menopausal status, ultrasound features, and CA-125 to estimate ovarian cancer risk.",
      guidance: "1. Establish menopausal status (premenopausal = 1, postmenopausal = 3).\n2. Count ultrasound features of malignancy: multilocular, solid areas, metastases, ascites, bilateral lesions (0 = 0, 1 = 1, ≥2 = 3).\n3. Measure serum CA-125 in U/mL.",
      contraindications: "CA-125 is non-specific in premenopausal women (frequently elevated in endometriosis, adenomyosis, PID, and uterine fibroids).",
      references: "1. Jacobs I, et al. A risk of malignancy index incorporating CA 125, ultrasound and menopausal status for the accurate identification of ovarian cancer. Br J Obstet Gynaecol. 1990;97(10):922-929.",
      fields: [
        S("meno", "Menopausal Status", "post", [["pre", "Premenopausal (M = 1)"], ["post", "Postmenopausal (M = 3)"]]),
        S("usFeatures", "Ultrasound Features (multilocular, solid areas, bilateral, ascites, mets)", "2", [
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
        let c = rmi >= 200 ? "HIGH RISK for ovarian malignancy (RMI >200 carries ~75% malignancy risk; refer to gynaecologic oncology)." : "LOW RISK for ovarian malignancy (RMI <200).";
        return {
          value: `RMI Score: ${rmi}`,
          eq: `Clinical Risk: ${c}\nFormula: RMI = Ultrasound (U) × Menopause (M) × CA-125. Cut-off of 200 provides ~80% sensitivity and ~90% specificity.`
        };
      }
    },
    {
      id: "figoCervicalCancer",
      cat: "obgyn",
      name: "FIGO Cervical Cancer Staging (2018)",
      desc: "Stage mapping based on primary tumor dimensions, local vaginal/pelvic extent, and lymph node status.",
      guidance: "1. Perform clinical pelvic examination under anesthesia and cross-sectional imaging (MRI/CT/PET).\n2. Record depth of stromal invasion and largest horizontal tumor diameter.\n3. Identify regional pelvic or para-aortic lymph node involvement.",
      contraindications: "Does not apply to non-cervical tumors (endometrial, vaginal, or uterine sarcomas). Radiological staging must be supplemented with examination under anesthesia when feasible.",
      references: "1. Bhatla N, et al. Revised FIGO staging for carcinoma of the cervix uteri. Int J Gynaecol Obstet. 2019;145(1):129-135.",
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
          ["pelvic", "Pelvic lymph node metastases only (Stage IIIC1)"],
          ["paraaortic", "Para-aortic lymph node metastases (Stage IIIC2)"]
        ])
      ],
      calc: v => {
        let finalStage = v.extent;
        if (v.nodes === "pelvic" && !v.extent.startsWith("IV")) finalStage = "Stage IIIC1 (Pelvic lymph node metastasis)";
        else if (v.nodes === "paraaortic" && !v.extent.startsWith("IV")) finalStage = "Stage IIIC2 (Para-aortic lymph node metastasis)";

        const tx = finalStage.startsWith("IA") || finalStage === "IB1" ?
          "Early Stage: Eligible for fertility-sparing surgery (conization/trachelectomy) or radical hysterectomy with bilateral pelvic lymphadenectomy." :
          "Locally Advanced: Definitive concurrent chemoradiotherapy (weekly Cisplatin + external beam pelvic radiation + intracavitary brachytherapy).";
        return {
          value: `FIGO: ${finalStage}`,
          eq: `Management Strategy: ${tx}\nPer FIGO 2018 staging rules, nodal metastasis upgrades disease to Stage IIIC.`
        };
      }
    },

    // ==========================================
    // 11. COMMON GYNAECOLOGICAL SCORES
    // ==========================================
    {
      id: "popqStaging",
      cat: "obgyn",
      name: "Pelvic Organ Prolapse Quantification (POP-Q) Staging",
      desc: "Standardized anatomical staging of pelvic organ prolapse relative to the hymenal plane.",
      guidance: "1. Position patient in lithotomy and have her perform maximal Valsalva or cough.\n2. Measure the most dependent prolapsing point in centimeters relative to the hymen (negative above, positive below).\n3. Measure Total Vaginal Length (tvl) with prolapse reduced.",
      contraindications: "Inaccurate if examined without maximal straining or in an unrelaxed patient. Does not measure functional urinary or bowel bother symptoms.",
      references: "1. Bump RC, et al. The standardization of terminology of female pelvic organ prolapse and pelvic floor dysfunction. Am J Obstet Gynecol. 1996;175(1):10-17.",
      fields: [
        N("leadingEdge", "Most Dependent Prolapse Point (cm relative to hymen)", 2.0, { min: -10.0, max: 15.0, step: 0.5 }),
        N("tvl", "Total Vaginal Length (tvl, cm)", 8.5, { min: 4.0, max: 14.0, step: 0.5 })
      ],
      calc: v => {
        const d = +v.leadingEdge, tvl = +v.tvl;
        let stage = "";
        if (d < -1.0) stage = "Stage I (Leading edge >1 cm above the hymen)";
        else if (d >= -1.0 && d <= 1.0) stage = "Stage II (Leading edge between 1 cm above and 1 cm below the hymen)";
        else if (d > 1.0 && d < (tvl - 2.0)) stage = "Stage III (Leading edge >1 cm below hymen, but < tvl − 2 cm)";
        else stage = "Stage IV: Complete procidentia / eversion (Leading edge ≥ tvl − 2 cm)";
        return {
          value: `POP-Q: ${stage}`,
          eq: "ICS / AUGS POP-Q Staging: Based on anatomical measurements during maximal Valsalva relative to the hymenal ring."
        };
      }
    },

    // ==========================================
    // 12. DRUG & CLINICAL CALCULATORS
    // ==========================================
    {
      id: "ganzoniFormula",
      cat: "obgyn",
      name: "Iron Deficit Calculator (Ganzoni Formula)",
      desc: "Calculates total elemental iron required for parenteral iron therapy in severe pregnancy anemia.",
      guidance: "1. Obtain maternal weight in kilograms.\n2. Enter current hemoglobin and set target hemoglobin (typically 11.0 g/dL in pregnancy).\n3. Standard iron store depot is 500 mg.",
      contraindications: "Contraindicated in first trimester of pregnancy, active severe bacteremia, known hypersensitivity to iron complexes, or iron overload states (hemochromatosis).",
      references: "1. Ganzoni AM. Intravenous iron-dextran: therapeutic and experimental possibilities. Schweiz Med Wochenschr. 1970;100(46):1962-1963.\n2. Pavord S, et al. UK guidelines on the management of iron deficiency in pregnancy. Br J Haematol. 2020;188(6):819-830.",
      fields: [
        N("weight", "Actual Body Weight (kg)", 58, { min: 30, max: 180, step: 0.5 }),
        N("actualHb", "Current Hemoglobin (g/dL)", 8.2, { min: 3.0, max: 16.0, step: 0.1 }),
        N("targetHb", "Target Hemoglobin (g/dL)", 11.0, { min: 9.0, max: 15.0, step: 0.1 }),
        N("depot", "Iron Depot Stores (mg)", 500, { min: 0, max: 1000, step: 50 })
      ],
      calc: v => {
        const wt = +v.weight, curHb = +v.actualHb, tgtHb = +v.targetHb, depot = +v.depot;
        const deficit = (wt * (tgtHb - curHb) * 2.4) + depot;
        const roundedDeficit = Math.max(0, Math.round(deficit));
        const fcmVials = Math.ceil(roundedDeficit / 500);
        return {
          value: `${roundedDeficit} mg elemental iron`,
          eq: `Formula: [Weight (kg) × (Target Hb − Actual Hb) × 2.4] + Depot (${depot} mg).\nEquivalent to approx. ${fcmVials} dose(s) of 500 mg Ferric Carboxymaltose (FCM) or ${(roundedDeficit / 100).toFixed(0)} ampoules of 100 mg Iron Sucrose.`
        };
      }
    },

    // ==========================================
    // 13. ULTRASOUND AND MEASUREMENTS
    // ==========================================
    {
      id: "crlDatingCalc",
      cat: "obgyn",
      name: "Crown–Rump Length (CRL) Dating",
      desc: "Gold standard Robinson and Fleming formula for first-trimester pregnancy dating.",
      guidance: "1. Perform ultrasound between 6+0 and 13+6 weeks (CRL 5–84 mm).\n2. Measure true fetal midsagittal plane with fetus in neutral position (avoid hyperflexion or hyperextension).\n3. Re-date pregnancy if CRL dating differs from LMP dating by >5 days.",
      contraindications: "Not validated when CRL >84 mm (use BPD/HC in the second trimester) or when CRL <5 mm.",
      references: "1. Robinson HP, Fleming JE. A critical evaluation of sonar 'crown-rump length' measurements. Br J Obstet Gynaecol. 1975;82(9):702-710.",
      fields: [
        N("crl", "Crown–Rump Length (CRL, mm)", 45, { min: 5, max: 84, step: 1 })
      ],
      calc: v => {
        const crl = +v.crl;
        const gaDaysExact = 8.052 * Math.sqrt(crl * 1.037) + 23.73;
        const gaDays = Math.round(gaDaysExact);
        const w = Math.floor(gaDays / 7);
        const d = gaDays % 7;
        return {
          value: `GA: ${w} weeks ${d} days`,
          eq: "Robinson & Fleming formula: Margin of error ±3–5 days. Supersedes menstrual dating if discordance exceeds 5 days before 14 weeks."
        };
      }
    },
    {
      id: "pelvicOrganVolume",
      cat: "obgyn",
      name: "Uterine & Ovarian Volume Calculator",
      desc: "Calculates ellipsoidal organ and lesion volume (Length × Width × Height × 0.523).",
      guidance: "1. Measure maximum longitudinal dimension (Length) in the sagittal plane.\n2. Measure maximum anteroposterior dimension (Height) perpendicular to length.\n3. Measure maximum transverse dimension (Width) in the coronal/axial plane.",
      contraindications: "Assumes prolate ellipsoid geometry. Inaccurate for irregular, lobulated fibroid uteri or asymmetric dumbbell-shaped pelvic masses.",
      references: "1. Orsini LF, et al. Pelvic organs in premenarcheal girls: real-time ultrasonography. Radiology. 1984;153(1):113-116.",
      fields: [
        N("len", "Length (cm)", 7.5, { min: 0.5, max: 35.0, step: 0.1 }),
        N("width", "Width / Transverse (cm)", 4.8, { min: 0.5, max: 30.0, step: 0.1 }),
        N("height", "Anteroposterior Height (cm)", 3.9, { min: 0.5, max: 25.0, step: 0.1 })
      ],
      calc: v => {
        const vol = +v.len * +v.width * +v.height * 0.5233;
        return {
          value: `Volume: ${vol.toFixed(1)} cm³ (mL)`,
          eq: "Ellipsoid Equation: Length × Width × Height × (π ÷ 6) ≈ D1 × D2 × D3 × 0.523.\nNormal ovarian volume: 3–9 mL. Normal reproductive uterine volume: ~40–100 mL."
        };
      }
    }
  ];

  // Self-registration into index.html architecture
  if (typeof window !== "undefined") {
    if (Array.isArray(window.tools)) {
      // Append tools directly if tools array already initialized
      tools.forEach(t => {
        if (!window.tools.some(existing => existing.id === t.id)) {
          window.tools.push(t);
        }
      });
    }

    if (Array.isArray(window.categories)) {
      const exists = window.categories.some(c => c.id === category.id);
      if (!exists) {
        window.categories.push(category);
      }
    }

    // Retain modular registration
    window.MedCalcModules = window.MedCalcModules || [];
    window.MedCalcModules.push({
      category: category,
      tools: tools
    });
  }
})();
