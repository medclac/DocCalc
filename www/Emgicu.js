/**
 * MedCalc Module: Emergency Medicine, Adult ICU, Pediatric EM & PICU (EM-ICU)
 * Fully compatible with the MedCalc HTML application structure.
 */
(function () {
  "use strict";

  // Global helper constructors declared in the HTML header
  var makeN = (typeof window !== "undefined" && window.N) ? window.N : function (id, label, defaultVal, extra) {
    extra = extra || {};
    return Object.assign({ id: id, label: label, type: "number", value: defaultVal, default: defaultVal }, extra);
  };
  var makeS = (typeof window !== "undefined" && window.S) ? window.S : function (id, label, defaultVal, options) {
    options = options || [];
    return { id: id, label: label, type: "select", value: defaultVal, default: defaultVal, options: options };
  };

  var emIcuCategory = {
    id: "emicu",
    name: "Emergency & Critical Care (Adult & Peds)",
    icon: "🚨",
    desc: "Emergency risk scores, trauma algorithms, adult ICU severity indices, and pediatric resuscitation (PEM/PICU)",
    organs: ["brain", "heart", "lungs", "kidneys", "vasculature", "abdomen", "systemic"],
    region: "emergency / critical care / pediatrics"
  };

  var emIcuTools = [
    // ==============================================================
    // 1. PEDIATRIC ASSESSMENT TRIANGLE (PAT)
    // ==============================================================
    {
      id: "pediatricAssessmentTriangle",
      cat: "emicu",
      type: "class",
      name: "Pediatric Assessment Triangle (PAT)",
      desc: "Rapid visual and auditory first-impression tool to evaluate pediatric physiological stability before touching the patient.",
      organ: "Central Nervous / Respiratory / Cardiovascular",
      region: "Pediatric Emergency / Triage",
      subject: "Pediatric Emergency Medicine / Resuscitation",
      keywords: ["pat", "pediatric assessment triangle", "appearance", "work of breathing", "circulation", "ticls", "triage", "pem"],
      guidance: "1. Evaluate without touching the patient in the first 30 seconds.\n2. Appearance (TICLS): Tone, Interactivity, Consolability, Look/gaze, Speech/cry.\n3. Work of Breathing: Retractions, nasal flaring, grunting, stridor, wheezing.\n4. Circulation to Skin: Pallor, mottling, cyanosis, petechiae.",
      contraindications: "Does not replace standard primary survey (ABCDE) during cardiac arrest or severe trauma; initiate immediate PALS if pulseless.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "The pediatric assessment triangle: a novel approach for the rapid evaluation of critically ill or injured children",
          citation: "Dieckmann RA, Brownstein D, Gausche-Hill M. Pediatr Emerg Care. 2010;26(4):312-315.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/20386420/" }
          ]
        }
      ],
      fields: [
        makeS("app", "1. Appearance (TICLS: Tone, Interactivity, Consolability, Look, Speech)", "0", [
          ["0", "Normal: Active, alert, consolable, strong cry / normal interaction"],
          ["1", "Abnormal: Lethargic, limp, unreactive, inconsolable, weak cry / dull gaze"]
        ]),
        makeS("wob", "2. Work of Breathing", "0", [
          ["0", "Normal: Quiet, regular, no increased work of breathing"],
          ["1", "Abnormal: Retractions, grunting, nasal flaring, stridor, tachypnea"]
        ]),
        makeS("circ", "3. Circulation to Skin", "0", [
          ["0", "Normal: Pink, warm, brisk capillary refill < 2 sec"],
          ["1", "Abnormal: Pallor, mottling, peripheral/central cyanosis, cold extremities"]
        ])
      ],
      table: {
        headers: ["PAT Pattern", "Appearance", "Work of Breathing", "Circulation", "Physiological State & Action"],
        rows: [
          { id: "stable", cols: ["Stable Child", "Normal", "Normal", "Normal", "Reassuring initial status; proceed with routine triage and secondary survey"] },
          { id: "respDistress", cols: ["Respiratory Distress", "Normal", "Abnormal", "Normal", "Supportive oxygen, inhaled therapy; position of comfort; avoid agitation"] },
          { id: "respFailure", cols: ["Respiratory Failure", "Abnormal", "Abnormal", "Normal/Abnormal", "Immediate bag-valve-mask (BVM) ventilation, prepare for endotracheal intubation"] },
          { id: "shockComp", cols: ["Compensated Shock", "Normal", "Normal", "Abnormal", "Oxygen, rapid IV/IO access, 10–20 mL/kg balanced crystalloid bolus stat"] },
          { id: "shockDecomp", cols: ["Decompensated Shock", "Abnormal", "Normal", "Abnormal", "Aggressive fluid resuscitation, vasoactive support, blood crossmatch if trauma"] },
          { id: "cnsMetabolic", cols: ["CNS / Metabolic Failure", "Abnormal", "Normal", "Normal", "Check blood glucose stat, rule out trauma, toxic ingestion, or status epilepticus"] },
          { id: "cardiopulmFailure", cols: ["Cardiopulmonary Failure", "Abnormal", "Abnormal", "Abnormal", "IMMEDIATE RESUSCITATION: High-flow O2, BVM ventilation, prepare PALS arrest bundle"] }
        ]
      },
      calc: function (v) {
        var a = v.app === "1", w = v.wob === "1", c = v.circ === "1";
        var match = "stable", state = "Stable Patient", plan = "Proceed with focused history and secondary assessment.";

        if (a && w && c) {
          match = "cardiopulmFailure";
          state = "Cardiopulmonary Failure / Imminent Arrest";
          plan = "CRITICAL RESUSCITATION: Call resuscitation team stat. Open airway, high-flow BVM ventilation, immediate IV/IO access, prepare PALS drugs.";
        } else if (a && w && !c) {
          match = "respFailure";
          state = "Pediatric Respiratory Failure";
          plan = "Child is exhausting compensatory effort. Provide positive pressure ventilation and prepare for rapid sequence intubation.";
        } else if (!a && w && !c) {
          match = "respDistress";
          state = "Pediatric Respiratory Distress";
          plan = "Maintain position of comfort. Humidified oxygen, nebulizers (bronchodilator/steroid), keep child calm in parent's lap.";
        } else if (!a && !w && c) {
          match = "shockComp";
          state = "Compensated Shock";
          plan = "Normal mentation with compromised skin perfusion. Administer 10–20 mL/kg IV/IO crystalloid bolus over 10–20 min; re-evaluate.";
        } else if (a && !w && c) {
          match = "shockDecomp";
          state = "Decompensated Shock";
          plan = "Lethargy with circulatory compromise. Aggressive fluid resuscitation, early inotropes/vasopressors, check blood gas and lactate.";
        } else if (a && !w && !c) {
          match = "cnsMetabolic";
          state = "Primary CNS Dysfunction / Metabolic Crisis";
          plan = "Point-of-care blood glucose test stat. Screen for poisoning, non-accidental trauma, sepsis, or intracranial pathology.";
        }

        return {
          value: state,
          matchId: match,
          eq: "PAT Assessment: Appearance: " + (a ? "Abnormal" : "Normal") + " | Breathing: " + (w ? "Abnormal" : "Normal") + " | Circulation: " + (c ? "Abnormal" : "Normal") + ".\n" + plan
        };
      }
    },

    // ==============================================================
    // 2. PECARN PEDIATRIC HEAD TRAUMA RULE (<2 & ≥2 YEARS)
    // ==============================================================
    {
      id: "pecarnHeadTrauma",
      cat: "emicu",
      type: "class",
      name: "PECARN Pediatric Head Trauma Rule",
      desc: "Clinical decision algorithm stratifying risk for clinically significant Traumatic Brain Injury (ciTBI) in children.",
      organ: "Brain / Cranium",
      region: "Pediatric Head Trauma",
      subject: "Pediatric Emergency Medicine / Neurotrauma",
      keywords: ["pecarn", "head trauma", "tbi", "ct head", "pediatric head injury", "skull fracture", "concussion", "pem"],
      guidance: "1. Applies to blunt head trauma presenting within 24 hours with initial GCS 14–15.\n2. In infants < 2 years: Screen for GCS < 15, palpable fracture, non-frontal hematoma, LOC > 5s, severe mechanism, abnormal parental behavior.\n3. In children ≥ 2 years: Screen for GCS < 15, basilar skull fracture signs, history of LOC, vomiting, severe mechanism, severe headache.\n4. ciTBI defined as: death, neurosurgery, intubation > 24 hours, or hospital admission ≥ 2 nights.",
      contraindications: "Not applicable in patients with trivial mechanism (ground-level fall onto carpet), penetrating trauma, pre-existing neurological disorders, or known brain tumors.",
      literature: [
        {
          type: "Seminal Multicenter Study",
          icon: "📄",
          title: "Identification of children at very low risk of clinically-important brain injuries after head trauma: a prospective cohort study",
          citation: "Kuppermann N, Holmes JF, Dayan PS, et al. Lancet. 2009;374(9696):1160-1170.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/19758692/" },
            { text: "View DOI ↗", url: "https://doi.org/10.1016/S0140-6736(09)61558-0", secondary: true }
          ]
        }
      ],
      fields: [
        makeS("ageGroup", "Patient Age Group", "under2", [
          ["under2", "Age < 2 years (< 24 months)"],
          ["over2", "Age ≥ 2 years (2 to 18 years)"]
        ]),
        makeS("highRisk", "High Risk: GCS < 15, Palpable/Basilar Skull Fracture, Altered Mental Status?", "0", [
          ["0", "No high-risk criteria present"],
          ["1", "Yes: GCS < 15, altered mental status, or signs of skull fracture"]
        ]),
        makeS("modRisk", "Intermediate Risk: LOC, Vomiting, Severe Mechanism, Non-frontal Scalp Hematoma, or Severe Headache?", "0", [
          ["0", "None present"],
          ["1", "Yes: ≥1 intermediate risk factor present"]
        ])
      ],
      table: {
        headers: ["PECARN Risk Tier", "ciTBI Risk", "CT Recommendation", "Clinical Strategy"],
        rows: [
          { id: "high", cols: ["High Risk", "4.3% – 4.4%", "CT Head Indicated Stat", "Non-contrast emergency head CT scan recommended promptly"] },
          { id: "mod", cols: ["Intermediate Risk", "~ 0.9%", "Observation vs CT", "Shared decision making: 4–6 hour ED observation vs non-contrast CT head"] },
          { id: "low", cols: ["Very Low Risk", "< 0.05% (< 1 in 2000)", "No CT Head Recommended", "Safe discharge home with standard pediatric head injury warning instructions"] }
        ]
      },
      calc: function (v) {
        var isHigh = v.highRisk === "1";
        var isMod = v.modRisk === "1";
        var isBaby = v.ageGroup === "under2";

        var match = "low", title = "Very Low Risk for ciTBI (<0.05%)", rec = "Head CT scan is NOT indicated. Negative predictive value >99.95%. Safe for observation and discharge home with parental warning return precautions.";

        if (isHigh) {
          match = "high";
          title = "High Risk for ciTBI (~4.4%)";
          rec = "Emergency non-contrast CT head is strongly recommended. Immediate neurosurgical consultation if intracranial hemorrhage is demonstrated.";
        } else if (isMod) {
          match = "mod";
          title = "Intermediate Risk for ciTBI (~0.9%)";
          rec = isBaby
            ? "Intermediate risk in infant. Options: CT head vs clinical observation for 4–6 hours in ED (especially if isolated hematoma, parent preference, or symptoms improve)."
            : "Intermediate risk in child ≥2 years. Shared decision-making: observe in ED for 4–6 hours vs obtain CT head if worsening headache or recurrent vomiting.";
        }

        return {
          value: title,
          matchId: match,
          eq: rec
        };
      }
    },

    // ==============================================================
    // 3. WESTLEY CROUP SCORE
    // ==============================================================
    {
      id: "westleyCroup",
      cat: "emicu",
      type: "class",
      name: "Westley Croup Score",
      desc: "Scores acute laryngotracheobronchitis (croup) severity to guide systemic Dexamethasone and nebulized Epinephrine therapy.",
      organ: "Larynx / Trachea / Upper Airway",
      region: "Pediatric Upper Airway",
      subject: "Pediatric Emergency Medicine / Airway",
      keywords: ["croup", "westley", "stridor", "dexamethasone", "epinephrine", "barking cough", "laryngotracheobronchitis", "pem"],
      guidance: "1. Evaluate child undisturbed in parent's lap.\n2. Inspiratory stridor: None (0), with agitation (1), at rest (2).\n3. Retractions: None (0), mild (1), moderate (2), severe (3).\n4. Air entry: Normal (0), decreased (1), severely decreased (2).\n5. Cyanosis: None (0), with agitation (4), at rest (5).\n6. Level of consciousness: Normal (0), disoriented/lethargic (5).",
      contraindications: "If child has toxic appearance, high fever, or drooling, suspect acute epiglottitis or bacterial tracheitis; do not manipulate airway.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "A randomized, double-blind, crossover study of rac-epinephrine in the treatment of croup",
          citation: "Westley CR, Cotton EK, Brooks JG. Am J Dis Child. 1978;132(5):484-487.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/347715/" }
          ]
        }
      ],
      fields: [
        makeS("stridor", "1. Inspiratory Stridor", "0", [
          ["0", "None (0 pts)"],
          ["1", "Stridor with agitation / crying only (1 pt)"],
          ["2", "Stridor at rest (2 pts)"]
        ]),
        makeS("retract", "2. Chest Retractions", "0", [
          ["0", "None (0 pts)"],
          ["1", "Mild retractions (subcostal / intercostal) (1 pt)"],
          ["2", "Moderate retractions (subcostal + suprasternal) (2 pts)"],
          ["3", "Severe retractions with sternal indrawing (3 pts)"]
        ]),
        makeS("airEntry", "3. Air Entry (Auscultation)", "0", [
          ["0", "Normal air entry (0 pts)"],
          ["1", "Decreased air entry (1 pt)"],
          ["2", "Severely decreased / barely audible (2 pts)"]
        ]),
        makeS("cyanosis", "4. Cyanosis", "0", [
          ["0", "None (0 pts)"],
          ["4", "Cyanosis with agitation only (4 pts)"],
          ["5", "Cyanosis at rest (5 pts)"]
        ]),
        makeS("loc", "5. Level of Consciousness", "0", [
          ["0", "Normal / alert (0 pts)"],
          ["5", "Altered / lethargic / depressed sensorium (5 pts)"]
        ])
      ],
      table: {
        headers: ["Score Range", "Croup Severity", "Recommended Pharmacotherapy", "Disposition Pathway"],
        rows: [
          { id: "mild", cols: ["Score 0 – 2", "Mild Croup", "Oral Dexamethasone 0.15 – 0.6 mg/kg single dose", "Safe for discharge home once oral dose tolerated"] },
          { id: "moderate", cols: ["Score 3 – 5", "Moderate Croup", "Oral/IM Dexamethasone 0.6 mg/kg + consider Nebulized Racemic Epinephrine", "Observe for 3–4 hours in ED; admit if stridor at rest persists"] },
          { id: "severe", cols: ["Score 6 – 11", "Severe Croup", "Dexamethasone 0.6 mg/kg IV/IM + Nebulized Epinephrine (1:1000 0.5 mL/kg, max 5 mL)", "Inpatient pediatric ward admission; high-flow humidified O2"] },
          { id: "critical", cols: ["Score 12 – 17", "Impending Respiratory Failure", "Nebulized Epinephrine stat + IV Dexamethasone + PICU consult", "Emergent PICU admission; prepare endotracheal intubation (ETT 0.5–1 size smaller)"] }
        ]
      },
      calc: function (v) {
        var total = +v.stridor + +v.retract + +v.airEntry + +v.cyanosis + +v.loc;
        var match = "mild", title = "Mild Croup (Score " + total + ")", tx = "Oral Dexamethasone (0.15–0.6 mg/kg, max 16 mg). Discharge home with instructions on humidified air and return precautions.";

        if (total >= 12) {
          match = "critical";
          title = "Impending Respiratory Failure (Score " + total + ")";
          tx = "CRITICAL: Nebulized L-epinephrine 1:1000 (0.5 mL/kg) or racemic epinephrine stat. IV/IM Dexamethasone. Notify PICU and anesthesiology stat for difficult airway.";
        } else if (total >= 6) {
          match = "severe";
          title = "Severe Croup (Score " + total + ")";
          tx = "Administer Dexamethasone 0.6 mg/kg + nebulized Epinephrine immediately. Observe closely for rebound stridor. Inpatient admission required.";
        } else if (total >= 3) {
          match = "moderate";
          title = "Moderate Croup (Score " + total + ")";
          tx = "Administer Dexamethasone 0.6 mg/kg oral/IM. Give nebulized epinephrine if resting stridor or moderate retractions persist. Observe for 3–4 hours.";
        }

        return {
          value: title,
          matchId: match,
          eq: tx
        };
      }
    },

    // ==============================================================
    // 4. PALICC PEDIATRIC ARDS CRITERIA (OI & OSI)
    // ==============================================================
    {
      id: "paliccPards",
      cat: "emicu",
      type: "calc",
      name: "PALICC Pediatric ARDS (OI & OSI Calculator)",
      desc: "Calculates Oxygenation Index (OI) and Oxygen Saturation Index (OSI) to stratify Pediatric ARDS (PARDS).",
      organ: "Lungs / Alveoli / Gas Exchange",
      region: "Pediatric Critical Care / PICU",
      subject: "Pediatric ICU / Mechanical Ventilation",
      keywords: ["palicc", "pards", "oxygenation index", "oi", "osi", "picu", "ards", "ventilator", "pao2", "spo2"],
      guidance: "1. For invasive mechanical ventilation with arterial blood gas: Calculate Oxygenation Index (OI) = (Mean Airway Pressure [Paw] × FiO2 × 100) ÷ PaO2.\n2. When arterial line is absent, use pulse oximetry (SpO2 ≤ 97%): Calculate Oxygen Saturation Index (OSI) = (Paw × FiO2 × 100) ÷ SpO2.\n3. Mild: 4 ≤ OI < 8 (or 5 ≤ OSI < 7.5).\n4. Moderate: 8 ≤ OI < 16 (or 7.5 ≤ OSI < 12.3).\n5. Severe: OI ≥ 16 (or OSI ≥ 12.3).",
      contraindications: "SpO2 > 97% invalidates OSI calculations due to flat portion of oxyhemoglobin dissociation curve.",
      literature: [
        {
          type: "Official PALICC Consensus",
          icon: "📘",
          title: "Pediatric acute respiratory distress syndrome: consensus recommendations from the Pediatric Acute Lung Injury Consensus Conference",
          citation: "Pediatric Acute Lung Injury Consensus Conference Group. Pediatr Crit Care Med. 2015;16(5):428-439.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/25647252/" }
          ]
        }
      ],
      fields: [
        makeN("paw", "Mean Airway Pressure (Paw, cmH2O)", 14, { min: 4, max: 40, step: 0.5 }),
        makeN("fio2", "Fraction of Inspired Oxygen (FiO2, 0.21 to 1.00)", 0.60, { min: 0.21, max: 1.0, step: 0.05 }),
        makeN("pao2", "PaO2 (mmHg, from ABG; leave 0 if using SpO2)", 65, { min: 0, max: 500, step: 1 }),
        makeN("spo2", "SpO2 (%, use if no ABG available, must be ≤ 97%)", 92, { min: 60, max: 97, step: 1 })
      ],
      table: {
        headers: ["PARDS Category", "Oxygenation Index (OI)", "Oxygen Saturation Index (OSI)", "Ventilation Strategy"],
        rows: [
          { id: "none", cols: ["No PARDS", "OI < 4", "OSI < 5", "Standard mechanical ventilation; lung recruitment as needed"] },
          { id: "mild", cols: ["Mild PARDS", "4 ≤ OI < 8", "5 ≤ OSI < 7.5", "Low tidal volume (5–7 mL/kg), moderate PEEP (8–10 cmH2O)"] },
          { id: "moderate", cols: ["Moderate PARDS", "8 ≤ OI < 16", "7.5 ≤ OSI < 12.3", "PEEP titration (10–14 cmH2O), neuromuscular blockade, prone positioning"] },
          { id: "severe", cols: ["Severe PARDS", "OI ≥ 16", "OSI ≥ 12.3", "Consider HFOV, inhaled nitric oxide (iNO), evaluate for VV-ECMO"] }
        ]
      },
      calc: function (v) {
        var paw = +v.paw, fio2 = +v.fio2, pao2 = +v.pao2, spo2 = +v.spo2;
        var useAbg = pao2 > 20;

        var indexVal = 0, indexType = "OI", match = "none", tier = "No PARDS";

        if (useAbg) {
          indexVal = (paw * fio2 * 100) / pao2;
          indexType = "Oxygenation Index (OI)";
          if (indexVal >= 16) { match = "severe"; tier = "Severe PARDS (OI ≥ 16)"; }
          else if (indexVal >= 8) { match = "moderate"; tier = "Moderate PARDS (8 ≤ OI < 16)"; }
          else if (indexVal >= 4) { match = "mild"; tier = "Mild PARDS (4 ≤ OI < 8)"; }
        } else {
          indexVal = (paw * fio2 * 100) / spo2;
          indexType = "Oxygen Saturation Index (OSI)";
          if (indexVal >= 12.3) { match = "severe"; tier = "Severe PARDS (OSI ≥ 12.3)"; }
          else if (indexVal >= 7.5) { match = "moderate"; tier = "Moderate PARDS (7.5 ≤ OSI < 12.3)"; }
          else if (indexVal >= 5.0) { match = "mild"; tier = "Mild PARDS (5.0 ≤ OSI < 7.5)"; }
        }

        return {
          value: tier + " (" + indexType + ": " + indexVal.toFixed(1) + ")",
          matchId: match,
          eq: "Formula: " + (useAbg ? "OI = (Paw × FiO2 × 100) ÷ PaO2" : "OSI = (Paw × FiO2 × 100) ÷ SpO2") + "\nCalculated " + indexType + " = " + indexVal.toFixed(2)
        };
      }
    },

    // ==============================================================
    // 5. VASOACTIVE-INOTROPIC SCORE (VIS)
    // ==============================================================
    {
      id: "visScore",
      cat: "emicu",
      type: "calc",
      name: "Vasoactive-Inotropic Score (VIS)",
      desc: "Quantifies the cumulative pharmacological cardiovascular support in pediatric and adult septic/cardiogenic shock.",
      organ: "Heart / Peripheral Vasculature",
      region: "PICU / Adult ICU / Resuscitation",
      subject: "Critical Care / Hemodynamics",
      keywords: ["vis", "vasoactive inotropic score", "inotropes", "epinephrine", "norepinephrine", "milrinone", "vasopressin", "shock", "picu"],
      guidance: "1. Sum the doses of all active vasoactive infusions in mcg/kg/min (or units/kg/min for vasopressin).\n2. Formula: VIS = Dopamine + Dobutamine + (100 × Epinephrine) + (10 × Milrinone) + (10,000 × Vasopressin) + (100 × Norepinephrine).\n3. VIS > 15–20 within 24–48 hours post-cardiac surgery or septic shock strongly correlates with high mortality and prolonged mechanical ventilation.",
      contraindications: "Enter pure baseline weights without acute fluid resuscitation edema to avoid artificial dilution of dosage calculations.",
      literature: [
        {
          type: "Seminal Validation Study",
          icon: "📄",
          title: "Vasoactive-inotropic score as a predictor of morbidity and mortality in infants after cardiopulmonary bypass",
          citation: "Davidson J, Tong S, Hancock H, et al. Pediatr Crit Care Med. 2012;13(1):24-30.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/21499181/" }
          ]
        }
      ],
      fields: [
        makeN("dopamine", "Dopamine (mcg/kg/min)", 0, { min: 0, max: 30, step: 1 }),
        makeN("dobutamine", "Dobutamine (mcg/kg/min)", 0, { min: 0, max: 30, step: 1 }),
        makeN("epi", "Epinephrine (mcg/kg/min)", 0.08, { min: 0, max: 2.0, step: 0.01 }),
        makeN("norepi", "Norepinephrine (mcg/kg/min)", 0.12, { min: 0, max: 2.0, step: 0.01 }),
        makeN("milrinone", "Milrinone (mcg/kg/min)", 0.35, { min: 0, max: 1.0, step: 0.05 }),
        makeN("vaso", "Vasopressin (units/kg/min, e.g., 0.0003)", 0, { min: 0, max: 0.01, step: 0.0001 })
      ],
      table: {
        headers: ["VIS Score Range", "Hemodynamic Support Severity", "Morbidity / Mortality Odds", "Clinical Implications"],
        rows: [
          { id: "low", cols: ["Score < 10", "Low Support", "Low risk of myocardial failure/cardiovascular mortality", "Routine ICU monitoring; begin weaning vasopressors as tolerated"] },
          { id: "mod", cols: ["Score 10 – 19", "Moderate Support", "Increased length of stay and mechanical ventilation", "Serial lactate, central venous O2 saturation (ScvO2), and echo assessment"] },
          { id: "high", cols: ["Score 20 – 30", "High Support (Critical)", "High morbidity, acute kidney injury, prolonged PICU stay", "Optimize preload, rule out tamponade or adrenal insufficiency, consider hydrocortisone"] },
          { id: "extreme", cols: ["Score > 30", "Extreme / Refractory Shock", "Very high mortality (> 40% – 50%)", "Evaluate for mechanical circulatory support (VA-ECMO / Impella)"] }
        ]
      },
      calc: function (v) {
        var dop = +v.dopamine, dob = +v.dobutamine, epi = +v.epi, ne = +v.norepi, mil = +v.milrinone, vaso = +v.vaso;
        var vis = dop + dob + (100 * epi) + (10 * mil) + (10000 * vaso) + (100 * ne);
        var roundedVis = Math.round(vis * 10) / 10;

        var match = "low", title = "Low Vasoactive Support";
        if (roundedVis > 30) { match = "extreme"; title = "Extreme Support / Refractory Shock (VIS > 30)"; }
        else if (roundedVis >= 20) { match = "high"; title = "High Support (Critical Shock, VIS 20–30)"; }
        else if (roundedVis >= 10) { match = "mod"; title = "Moderate Support (VIS 10–19)"; }

        return {
          value: "VIS Score: " + roundedVis + " (" + title + ")",
          matchId: match,
          eq: "Formula: Dopamine + Dobutamine + (100×Epi) + (10×Milrinone) + (10,000×Vaso) + (100×NorEpi)\nCalculation: " + dop + " + " + dob + " + (" + (100 * epi).toFixed(1) + ") + (" + (10 * mil).toFixed(1) + ") + (" + (10000 * vaso).toFixed(1) + ") + (" + (100 * ne).toFixed(1) + ") = " + roundedVis
        };
      }
    },

    // ==============================================================
    // 6. PEDIATRIC ENDOTRACHEAL TUBE & DEPTH FORMULAS
    // ==============================================================
    {
      id: "pediatricAirwaySizing",
      cat: "emicu",
      type: "calc",
      name: "Pediatric Airway & Resuscitation Equipment Sizing",
      desc: "Calculates age-based cuffed and uncuffed endotracheal tube (ETT) sizes, insertion depth, chest tubes, and DC shock energies.",
      organ: "Trachea / Airway / Thorax",
      region: "Pediatric Resuscitation / Airway",
      subject: "PALS / Pediatric Emergency Medicine",
      keywords: ["ett", "endotracheal tube", "pediatric tube size", "cuffed ett", "ett depth", "chest tube", "pals", "defibrillation"],
      guidance: "1. Uncuffed ETT ID (mm) = (Age in years / 4) + 4.\n2. Cuffed ETT ID (mm) = (Age in years / 4) + 3.5.\n3. Oral Depth of ETT insertion (cm at teeth/lips) = (Age in years / 2) + 12 (or 3 × ETT internal diameter).\n4. Chest tube size (Fr) = 4 × ETT size.\n5. Defibrillation: Initial 2 J/kg, subsequent 4 J/kg (max 10 J/kg).",
      contraindications: "Always have tubes 0.5 mm smaller and 0.5 mm larger immediately available at bedside. Length-based resuscitation tapes (Broselow) supersede age formulas in growth-restricted or macrosomic children.",
      literature: [
        {
          type: "AHA Guidelines",
          icon: "📘",
          title: "Part 4: Pediatric Basic and Advanced Life Support: 2020 American Heart Association Guidelines for CPR and ECC",
          citation: "Topjian AA, Raymond TT, Atkins D, et al. Circulation. 2020;142(16_suppl_2):S469-S523.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/33081526/" }
          ]
        }
      ],
      fields: [
        makeN("ageYrs", "Child Age (years, use 0.5 for 6 months)", 4, { min: 0.1, max: 16, step: 0.5 }),
        makeN("weightKg", "Estimated Weight (kg)", 16, { min: 2, max: 100, step: 0.5 })
      ],
      calc: function (v) {
        var age = +v.ageYrs, wt = +v.weightKg;
        var uncuffed = (age / 4) + 4;
        var cuffed = (age / 4) + 3.5;
        var depth = (age / 2) + 12;
        var chestTube = Math.round(cuffed * 4);
        var shock1 = wt * 2;
        var shock2 = wt * 4;
        var epiDoseMg = (wt * 0.01).toFixed(2);
        var epiDoseMl = (wt * 0.1).toFixed(1);

        return {
          value: "Cuffed ETT: " + cuffed.toFixed(1) + " mm | Depth: " + depth.toFixed(1) + " cm",
          eq: "Resuscitation Equipment & Doses for " + age + " yo (" + wt + " kg):\n" +
              "• Cuffed ETT Size: " + cuffed.toFixed(1) + " mm ID (Keep " + (cuffed - 0.5).toFixed(1) + " and " + (cuffed + 0.5).toFixed(1) + " ready)\n" +
              "• Uncuffed ETT Size: " + uncuffed.toFixed(1) + " mm ID\n" +
              "• Oral ETT Depth (at lip): " + depth.toFixed(1) + " cm\n" +
              "• Chest Tube (Thoracostomy): " + chestTube + " to " + (chestTube + 4) + " Fr\n" +
              "• Defibrillation: Initial shock (2 J/kg) = " + shock1 + " J; Subsequent (4 J/kg) = " + shock2 + " J\n" +
              "• Epinephrine (1:10,000 IV/IO): " + epiDoseMg + " mg (" + epiDoseMl + " mL) every 3–5 min\n" +
              "• Fluid Bolus (10–20 mL/kg): " + (wt * 10) + " to " + (wt * 20) + " mL balanced crystalloid"
        };
      }
    },

    // ==============================================================
    // 7. KOCHER CRITERIA FOR SEPTIC HIP
    // ==============================================================
    {
      id: "kocherCriteria",
      cat: "emicu",
      type: "class",
      name: "Kocher Criteria for Pediatric Septic Arthritis",
      desc: "Differentiates septic arthritis of the hip from transient synovitis in children with acute hip pain or limp.",
      organ: "Hip Joint / Synovium",
      region: "Pediatric Orthopaedics / Infection",
      subject: "Pediatric Emergency Medicine / Orthopaedics",
      keywords: ["kocher", "septic arthritis", "transient synovitis", "pediatric hip", "limp", "fever", "esr", "pem"],
      guidance: "1. Non-weightbearing on affected side (1 pt).\n2. Oral/core temperature > 38.5°C (1 pt).\n3. ESR > 40 mm/hr (1 pt).\n4. Serum WBC > 12,000 cells/µL (1 pt).\n5. Probabilities of septic arthritis: 1 criterion = 3%; 2 criteria = 40%; 3 criteria = 93%; 4 criteria = 99%.",
      contraindications: "Does not rule out osteomyelitis, leukemia, or slipped capital femoral epiphysis (SCFE). Ultrasound-guided joint aspiration is definitive.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Differentiating between septic arthritis and transient synovitis of the hip in children: an evidence-based clinical prediction algorithm",
          citation: "Kocher MS, Zurakowski D, Kasser JR. J Bone Joint Surg Am. 1999;81(12):1662-1670.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/10608376/" }
          ]
        }
      ],
      fields: [
        makeS("nwb", "1. Inability to bear weight on affected side", "0", [["0", "Able to bear weight"], ["1", "Non-weightbearing / refusal to walk"]]),
        makeS("fever", "2. Temperature > 38.5°C (> 101.3°F)", "0", [["0", "Temperature ≤ 38.5°C"], ["1", "Fever > 38.5°C"]]),
        makeS("esr", "3. ESR > 40 mm/hr", "0", [["0", "ESR ≤ 40 mm/hr"], ["1", "ESR > 40 mm/hr"]]),
        makeS("wbc", "4. Serum WBC > 12,000 cells/µL", "0", [["0", "WBC ≤ 12,000"], ["1", "WBC > 12,000 /µL"]])
      ],
      table: {
        headers: ["Kocher Criteria Met", "Septic Arthritis Probability", "Likely Pathology", "Clinical Strategy"],
        rows: [
          { id: "k0", cols: ["0 of 4 Criteria", "< 0.2%", "Transient Synovitis", "Conservative management; outpatient follow-up in 48 hours"] },
          { id: "k1", cols: ["1 of 4 Criteria", "~ 3%", "Transient Synovitis likely", "Hip ultrasound; close follow-up"] },
          { id: "k2", cols: ["2 of 4 Criteria", "~ 40%", "Equivocal / Indeterminate", "Urgent hip ultrasound, orthopaedic consult, consider joint aspiration"] },
          { id: "k3", cols: ["3 of 4 Criteria", "~ 93%", "Septic Arthritis highly probable", "Urgent ultrasound-guided diagnostic hip arthrocentesis; empiric IV antibiotics"] },
          { id: "k4", cols: ["4 of 4 Criteria", "> 99%", "DEFINITIVE SEPTIC ARTHRITIS", "EMERGENT SURGICAL WASHOUT (Arthrotomy) and IV antibiotics to prevent osteonecrosis"] }
        ]
      },
      calc: function (v) {
        var pts = +v.nwb + +v.fever + +v.esr + +v.wbc;
        var match = "k" + pts;
        var prob = pts === 4 ? ">99%" : pts === 3 ? "93%" : pts === 2 ? "40%" : pts === 1 ? "3%" : "<0.2%";
        var act = pts >= 3
          ? "High probability of septic arthritis. Emergent orthopaedic surgical consultation for hip ultrasound and operative joint irrigation/washout."
          : pts === 2
          ? "Moderate probability. Perform hip ultrasound to screen for effusion; joint aspiration recommended if fluid is present."
          : "Low probability of septic arthritis. Favour transient synovitis. Provide oral NSAIDs and arrange reassessment within 48 hours.";

        return {
          value: "Kocher Score: " + pts + "/4 (" + prob + " Probability)",
          matchId: match,
          eq: act
        };
      }
    },

    // ==============================================================
    // 8. SOFA SCORE & DELTA-SOFA (SEPSIS-3)
    // ==============================================================
    {
      id: "sofaScore",
      cat: "emicu",
      type: "class",
      name: "Sequential Organ Failure Assessment (SOFA) Score",
      desc: "Quantifies multi-organ dysfunction in the ICU; an acute change (ΔSOFA ≥ 2) defines Sepsis-3 in suspected infection.",
      organ: "Respiratory / Coagulation / Hepatic / Cardiovascular / CNS / Renal",
      region: "Adult ICU / Critical Care",
      subject: "ICU Severity / Sepsis-3",
      keywords: ["sofa", "sepsis", "septic shock", "sepsis 3", "organ failure", "icu mortality", "pao2", "platelets", "bilirubin"],
      guidance: "1. Evaluate 6 organ systems: Respiration (PaO2/FiO2), Coagulation (Platelets), Liver (Bilirubin), Cardiovascular (MAP/Vasopressors), CNS (GCS), and Renal (Creatinine/Urine output).\n2. Score ranges 0 to 24 points.\n3. An increase of ≥2 points from baseline indicates acute organ dysfunction attributable to infection (Sepsis-3).",
      contraindications: "Chronic organ failure (e.g., end-stage renal disease, cirrhosis) yields high baseline scores; compare with known baseline status.",
      literature: [
        {
          type: "Official Consensus",
          icon: "📘",
          title: "The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3)",
          citation: "Singer M, Deutschman CS, Seymour CW, et al. JAMA. 2016;315(8):801-810.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/26903338/" }
          ]
        }
      ],
      fields: [
        makeS("resp", "1. Respiration: PaO2/FiO2 ratio (mmHg)", "0", [
          ["0", "PaO2/FiO2 ≥ 400 (0 pts)"],
          ["1", "PaO2/FiO2 < 400 (+1 pt)"],
          ["2", "PaO2/FiO2 < 300 (+2 pts)"],
          ["3", "PaO2/FiO2 < 200 with mechanical ventilation (+3 pts)"],
          ["4", "PaO2/FiO2 < 100 with mechanical ventilation (+4 pts)"]
        ]),
        makeS("coag", "2. Coagulation: Platelets (cells/µL)", "0", [
          ["0", "Platelets ≥ 150,000 (0 pts)"],
          ["1", "Platelets < 150,000 (+1 pt)"],
          ["2", "Platelets < 100,000 (+2 pts)"],
          ["3", "Platelets < 50,000 (+3 pts)"],
          ["4", "Platelets < 20,000 (+4 pts)"]
        ]),
        makeS("liver", "3. Liver: Total Bilirubin (mg/dL)", "0", [
          ["0", "Bilirubin < 1.2 mg/dL (0 pts)"],
          ["1", "1.2 to 1.9 mg/dL (+1 pt)"],
          ["2", "2.0 to 5.9 mg/dL (+2 pts)"],
          ["3", "6.0 to 11.9 mg/dL (+3 pts)"],
          ["4", "≥ 12.0 mg/dL (+4 pts)"]
        ]),
        makeS("cv", "4. Cardiovascular: MAP & Vasopressor requirement", "0", [
          ["0", "MAP ≥ 70 mmHg, no vasopressors (0 pts)"],
          ["1", "MAP < 70 mmHg without pressors (+1 pt)"],
          ["2", "Dopamine ≤ 5 mcg/kg/min or Dobutamine any dose (+2 pts)"],
          ["3", "Dopamine > 5 or Epi ≤ 0.1 or Norepi ≤ 0.1 mcg/kg/min (+3 pts)"],
          ["4", "Dopamine > 15 or Epi > 0.1 or Norepi > 0.1 mcg/kg/min (+4 pts)"]
        ]),
        makeS("cns", "5. CNS: Glasgow Coma Scale (GCS)", "0", [
          ["0", "GCS 15 (0 pts)"],
          ["1", "GCS 13 – 14 (+1 pt)"],
          ["2", "GCS 10 – 12 (+2 pts)"],
          ["3", "GCS 6 – 9 (+3 pts)"],
          ["4", "GCS < 6 (+4 pts)"]
        ]),
        makeS("renal", "6. Renal: Creatinine (mg/dL) or Daily Urine Output", "0", [
          ["0", "Creatinine < 1.2 mg/dL (0 pts)"],
          ["1", "Creatinine 1.2 to 1.9 mg/dL (+1 pt)"],
          ["2", "Creatinine 2.0 to 3.4 mg/dL (+2 pts)"],
          ["3", "Creatinine 3.5 to 4.9 mg/dL or Urine < 500 mL/day (+3 pts)"],
          ["4", "Creatinine ≥ 5.0 mg/dL or Urine < 200 mL/day (+4 pts)"]
        ])
      ],
      table: {
        headers: ["SOFA Score", "Predicted In-Hospital ICU Mortality", "Organ Dysfunction Level", "Clinical Action"],
        rows: [
          { id: "sLow", cols: ["0 – 6 Points", "< 10%", "Mild Organ Dysfunction", "Continue standard supportive care; monitor serial delta-SOFA"] },
          { id: "sMod", cols: ["7 – 9 Points", "15% – 20%", "Moderate Multi-Organ Dysfunction", "Surviving Sepsis bundle: blood cultures, early IV antibiotics, source control"] },
          { id: "sHigh", cols: ["10 – 12 Points", "40% – 50%", "Severe Multi-Organ Dysfunction", "Aggressive resuscitation: invasive arterial monitoring, central line, vasopressors"] },
          { id: "sCrit", cols: ["≥ 13 Points", "> 80% – 95%", "Critical Organ Failure (Extreme Mortality)", "Multidisciplinary critical care bundle, assess renal replacement therapy, ECMO"] }
        ]
      },
      calc: function (v) {
        var total = +v.resp + +v.coag + +v.liver + +v.cv + +v.cns + +v.renal;
        var match = "sLow", mort = "<10%";

        if (total >= 13) { match = "sCrit"; mort = ">80% to 95%"; }
        else if (total >= 10) { match = "sHigh"; mort = "40% to 50%"; }
        else if (total >= 7) { match = "sMod"; mort = "15% to 20%"; }

        return {
          value: "SOFA Score: " + total + " / 24 Points (Mortality: " + mort + ")",
          matchId: match,
          eq: "Sepsis-3 Definition: An acute change in SOFA score ≥2 points driven by an infection confirms Sepsis.\nSeptic Shock: Sepsis + persistent hypotension requiring vasopressors to keep MAP ≥65 mmHg + Serum Lactate >2 mmol/L despite adequate fluid resuscitation."
        };
      }
    },

    // ==============================================================
    // 9. BERLIN DEFINITION OF ARDS
    // ==============================================================
    {
      id: "berlinArds",
      cat: "emicu",
      type: "class",
      name: "Berlin Definition of ARDS",
      desc: "Consensus criteria stratifying acute respiratory distress syndrome into Mild, Moderate, and Severe based on PaO2/FiO2 and PEEP.",
      organ: "Lungs / Alveolocapillary Membrane",
      region: "Adult ICU / Mechanical Ventilation",
      subject: "Critical Care / Pulmonology",
      keywords: ["berlin", "ards", "pao2", "fio2", "peep", "protective lung ventilation", "driving pressure", "prone"],
      guidance: "1. Timing: Within 1 week of a known clinical insult or new/worsening respiratory symptoms.\n2. Chest Imaging: Bilateral opacities not fully explained by effusions, atelectasis, or nodules.\n3. Origin of Edema: Respiratory failure not fully explained by cardiac failure or fluid overload (objective assessment such as echocardiography to exclude hydrostatic edema).\n4. Oxygenation with PEEP/CPAP ≥ 5 cmH2O:\n   - Mild: 200 < PaO2/FiO2 ≤ 300 mmHg.\n   - Moderate: 100 < PaO2/FiO2 ≤ 200 mmHg.\n   - Severe: PaO2/FiO2 ≤ 100 mmHg.",
      contraindications: "Does not apply if PEEP < 5 cmH2O or if respiratory failure is purely secondary to cardiogenic pulmonary edema.",
      literature: [
        {
          type: "Official ARDS Consensus",
          icon: "📘",
          title: "Acute respiratory distress syndrome: the Berlin Definition",
          citation: "ARDS Definition Task Force. JAMA. 2012;307(23):2526-2533.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/22797452/" }
          ]
        }
      ],
      fields: [
        makeN("pfRatio", "PaO2 / FiO2 Ratio (mmHg with PEEP ≥ 5 cmH2O)", 135, { min: 20, max: 600, step: 5 }),
        makeS("bilateral", "Bilateral opacities on CXR/CT not fully explained by effusions?", "1", [
          ["1", "Yes: Bilateral infiltrates present"],
          ["0", "No: Unilateral or normal imaging"]
        ]),
        makeS("hydrostatic", "Respiratory failure NOT fully explained by heart failure / fluid overload?", "1", [
          ["1", "Yes: Non-cardiogenic / hydrostatic edema excluded"],
          ["0", "No: Purely cardiogenic pulmonary edema"]
        ])
      ],
      table: {
        headers: ["ARDS Category", "PaO2 / FiO2 Threshold", "ICU Mortality", "Evidence-Based Ventilator Strategy"],
        rows: [
          { id: "notArds", cols: ["Not ARDS", "P/F > 300 mmHg or non-ARDS imaging", "Baseline", "Standard supportive ventilation; wean O2"] },
          { id: "mild", cols: ["Mild ARDS", "201 – 300 mmHg (with PEEP ≥ 5)", "~ 27%", "Low tidal volume (6 mL/kg PBW), PEEP 5–10 cmH2O, keep Pplat < 30"] },
          { id: "moderate", cols: ["Moderate ARDS", "101 – 200 mmHg (with PEEP ≥ 5)", "~ 32%", "PEEP 10–14 cmH2O, consider neuromuscular blockade infusion for 48h, early prone positioning (PROSEVA)"] },
          { id: "severe", cols: ["Severe ARDS", "≤ 100 mmHg (with PEEP ≥ 5)", "~ 45%", "MANDATORY PRONE POSITIONING (≥16 hrs/day), deep paralysis, driving pressure <15 cmH2O, consider VV-ECMO"] }
        ]
      },
      calc: function (v) {
        var pf = +v.pfRatio;
        var qualifies = v.bilateral === "1" && v.hydrostatic === "1";

        if (!qualifies) {
          return {
            value: "Criteria Incomplete (Not ARDS)",
            matchId: "notArds",
            eq: "Berlin criteria require acute onset (<7 days), bilateral opacities on imaging, and objective exclusion of purely cardiogenic hydrostatic edema."
          };
        }

        var match = "notArds", tier = "Not ARDS (P/F > 300)", plan = "Normal gas exchange.";
        if (pf <= 100) {
          match = "severe";
          tier = "Severe ARDS (P/F ≤ 100 mmHg)";
          plan = "CRITICAL: High ICU mortality (~45%). Low-VT ventilation (4–6 mL/kg PBW), maintain Plateau pressure < 30 cmH2O and Driving pressure < 15 cmH2O. Initiate prone positioning (≥16h/day stat) per PROSEVA trial; evaluate for VV-ECMO.";
        } else if (pf <= 200) {
          match = "moderate";
          tier = "Moderate ARDS (P/F 101–200 mmHg)";
          plan = "Moderate ARDS. Tidal volume 6 mL/kg PBW, higher PEEP strategy (10–14 cmH2O), early neuromuscular blockade if patient-ventilator dyssynchrony, strongly recommend prone positioning.";
        } else if (pf <= 300) {
          match = "mild";
          tier = "Mild ARDS (P/F 201–300 mmHg)";
          plan = "Mild ARDS. Protective lung ventilation with tidal volumes 6 mL/kg predicted body weight and PEEP 5–10 cmH2O.";
        }

        return {
          value: tier,
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 10. RAPID SHALLOW BREATHING INDEX (RSBI / YANG-TOBIN)
    // ==============================================================
    {
      id: "rsbiWeaning",
      cat: "emicu",
      type: "calc",
      name: "Rapid Shallow Breathing Index (RSBI / Yang–Tobin)",
      desc: "Calculates the ratio of respiratory rate to tidal volume during spontaneous breathing to predict weaning success.",
      organ: "Respiratory Muscles / Diaphragm / Lungs",
      region: "Adult ICU / Extubation Readiness",
      subject: "Critical Care / Mechanical Ventilation",
      keywords: ["rsbi", "yang tobin", "weaning", "extubation", "tidal volume", "sbt", "ventilator", "icu"],
      guidance: "1. Measure during a spontaneous breathing trial (SBT) on T-piece or minimal pressure support (PS ≤ 5 cmH2O, PEEP 0–5 cmH2O) for 1–2 minutes.\n2. Obtain Respiratory Rate (breaths/min) and Tidal Volume in Liters (L).\n3. Formula: RSBI = Respiratory Rate (breaths/min) ÷ Tidal Volume (L).\n4. RSBI < 105 breaths/min/L predicts successful extubation.",
      contraindications: "Do not measure RSBI while the patient is on high levels of pressure support or sedation, as this artificially inflates tidal volume.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "A prospective study of indexes predicting the outcome of trials of weaning from mechanical ventilation",
          citation: "Yang KL, Tobin MJ. N Engl J Med. 1991;324(21):1445-1450.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/2023603/" }
          ]
        }
      ],
      fields: [
        makeN("rr", "Respiratory Rate during SBT (breaths/min)", 22, { min: 4, max: 60, step: 1 }),
        makeN("vtMl", "Spontaneous Exhaled Tidal Volume (mL)", 450, { min: 50, max: 1500, step: 10 })
      ],
      table: {
        headers: ["RSBI Value", "Breathing Pattern", "Extubation Probability", "Weaning Recommendation"],
        rows: [
          { id: "pass", cols: ["RSBI < 105", "Efficient spontaneous breathing", "High likelihood of successful extubation (> 80%)", "Proceed with spontaneous breathing trial (SBT) completion; prepare for extubation if airway protective reflexes intact"] },
          { id: "fail", cols: ["RSBI ≥ 105", "Rapid shallow tachypnea (diaphragmatic fatigue)", "High likelihood of extubation failure (> 70%)", "Failed weaning test. Resume mechanical ventilatory support; identify and treat underlying etiology"] }
        ]
      },
      calc: function (v) {
        var rr = +v.rr, vtL = (+v.vtMl) / 1000;
        var rsbi = Math.round(rr / vtL);
        var match = rsbi < 105 ? "pass" : "fail";
        var verdict = rsbi < 105 ? "FAVOURABLE: Weaning / Extubation Supported" : "UNFAVOURABLE: High Risk of Extubation Failure";
        var plan = rsbi < 105
          ? "RSBI is " + rsbi + " (< 105 breaths/min/L). Patient demonstrates adequate diaphragmatic power and tidal volume without tachypnea. Safe to extubate if cough, secretions, and mental alertness are intact."
          : "RSBI is " + rsbi + " (≥ 105 breaths/min/L). Rapid shallow breathing indicates impending respiratory muscle exhaustion. Return to full ventilator rest; do not extubate.";

        return {
          value: "RSBI: " + rsbi + " (" + verdict + ")",
          matchId: match,
          eq: "Formula: Respiratory Rate (" + rr + " bpm) ÷ Tidal Volume (" + vtL.toFixed(3) + " L) = " + rsbi + " breaths/min/L.\n" + plan
        };
      }
    },

    // ==============================================================
    // 11. ROX INDEX FOR HIGH-FLOW NASAL CANNULA (HFNC)
    // ==============================================================
    {
      id: "roxIndex",
      cat: "emicu",
      type: "calc",
      name: "ROX Index for HFNC Success vs Failure",
      desc: "Predicts the success of high-flow nasal cannula (HFNC) versus the need for endotracheal intubation in acute hypoxemic respiratory failure.",
      organ: "Lungs / Airway / Respiration",
      region: "Adult ICU / Emergency Department",
      subject: "Critical Care / Non-Invasive Oxygenation",
      keywords: ["rox", "rox index", "hfnc", "high flow", "intubation", "hypoxemia", "respiratory rate", "spo2", "fio2"],
      guidance: "1. Calculate after 2, 6, and 12 hours of HFNC therapy.\n2. Formula: ROX Index = (SpO2 / FiO2) ÷ Respiratory Rate (breaths/min).\n   - (Use SpO2 as percentage, e.g., 95; FiO2 as decimal, e.g., 0.50).\n3. Thresholds at 12 hours:\n   - ROX ≥ 4.88: HFNC success expected (safe to continue).\n   - 3.85 ≤ ROX < 4.88: Indeterminate; re-evaluate within 2 hours.\n   - ROX < 3.85: High risk of HFNC failure; proceed with invasive mechanical intubation without delay.",
      contraindications: "SpO2 must be ≤ 98% for accurate calculation (hyperoxia obscures true impairment). Do not delay emergency intubation for shock, severe encephalopathy, or exhaustion.",
      literature: [
        {
          type: "Seminal Multicenter Validation",
          icon: "📄",
          title: "Predicting success of high-flow nasal cannula in pneumonia patients with hypoxemic respiratory failure: The utility of the ROX index",
          citation: "Roca O, Messika J, Caralt B, et al. J Crit Care. 2016;35:200-205.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/27481760/" }
          ]
        }
      ],
      fields: [
        makeN("spo2", "Oxygen Saturation (SpO2, %)", 94, { min: 60, max: 100, step: 1 }),
        makeN("fio2", "Fraction of Inspired Oxygen (FiO2, 0.21 to 1.00)", 0.60, { min: 0.21, max: 1.0, step: 0.05 }),
        makeN("rr", "Respiratory Rate (breaths/min)", 24, { min: 8, max: 60, step: 1 })
      ],
      table: {
        headers: ["ROX Index Range (at 12h)", "Failure Probability", "Clinical Interpretation", "Action Recommendation"],
        rows: [
          { id: "success", cols: ["ROX ≥ 4.88", "Low risk (< 15%)", "HFNC therapy successful", "Continue HFNC; begin de-escalation of FiO2 and flow as tolerated"] },
          { id: "indeterminate", cols: ["3.85 ≤ ROX < 4.88", "Intermediate risk (~ 40%)", "Equivocal response", "Close continuous monitoring; re-calculate ROX in 1–2 hours"] },
          { id: "failure", cols: ["ROX < 3.85", "Very High risk (> 75%)", "HFNC Failure / Impending Exhaustion", "DO NOT DELAY INTUBATION: Proceed with prompt endotracheal intubation"] }
        ]
      },
      calc: function (v) {
        var s = +v.spo2, f = +v.fio2, rr = +v.rr;
        var rox = (s / f) / rr;
        var roxRounded = rox.toFixed(2);

        var match = "success", title = "HFNC Success Likely (ROX ≥ 4.88)", act = "Continue HFNC. Wean FiO2 and flow as clinical recovery progresses.";
        if (rox < 3.85) {
          match = "failure";
          title = "HIGH RISK OF HFNC FAILURE (ROX < 3.85)";
          act = "CRITICAL: ROX is " + roxRounded + " (< 3.85). Delayed intubation increases ICU mortality. Prepare for rapid sequence intubation (RSI) now.";
        } else if (rox < 4.88) {
          match = "indeterminate";
          title = "Indeterminate / Equivocal ROX (3.85–4.87)";
          act = "ROX is " + roxRounded + ". Patient remains at significant risk. Maintain bedside readiness for airway management and re-evaluate ROX in 1 hour.";
        }

        return {
          value: "ROX Index: " + roxRounded + " (" + title + ")",
          matchId: match,
          eq: "Formula: (SpO2 [" + s + "%] ÷ FiO2 [" + f + "]) ÷ RR [" + rr + " bpm] = " + roxRounded + ".\n" + act
        };
      }
    },

    // ==============================================================
    // 12. DRIVING PRESSURE & STATIC COMPLIANCE
    // ==============================================================
    {
      id: "drivingPressureCalc",
      cat: "emicu",
      type: "calc",
      name: "Driving Pressure (ΔP) & Static Compliance (Cstat)",
      desc: "Calculates respiratory system driving pressure and static lung compliance during invasive mechanical ventilation.",
      organ: "Lungs / Chest Wall / Alveoli",
      region: "Adult ICU / Mechanical Ventilation",
      subject: "Critical Care / Protective Lung Ventilation",
      keywords: ["driving pressure", "delta p", "static compliance", "cstat", "plateau pressure", "peep", "ards", "ventilator"],
      guidance: "1. Perform an end-inspiratory hold (0.5–2.0 sec) during passive volume-controlled ventilation to measure Plateau Pressure (Pplat).\n2. Note total PEEP (including auto-PEEP).\n3. Formula 1: Driving Pressure (ΔP) = Pplat − PEEP (Target ΔP < 15 cmH2O).\n4. Formula 2: Static Compliance (Cstat) = Tidal Volume (mL) ÷ (Pplat − PEEP) (Normal: 50–80 mL/cmH2O; in ARDS typically < 30–40 mL/cmH2O).",
      contraindications: "Measurements require a relaxed, passively ventilated patient without spontaneous respiratory muscle effort or patient-ventilator dyssynchrony.",
      literature: [
        {
          type: "Seminal Multicenter Study",
          icon: "📄",
          title: "Driving pressure and survival in the acute respiratory distress syndrome",
          citation: "Amato MB, Meade MO, Slutsky AS, et al. N Engl J Med. 2015;372(8):747-755.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/25693014/" }
          ]
        }
      ],
      fields: [
        makeN("pplat", "Plateau Pressure (Pplat, cmH2O)", 26, { min: 5, max: 60, step: 1 }),
        makeN("peep", "Total PEEP (cmH2O)", 12, { min: 0, max: 30, step: 1 }),
        makeN("vt", "Tidal Volume (Vt, mL)", 420, { min: 100, max: 1000, step: 10 })
      ],
      table: {
        headers: ["Driving Pressure (ΔP)", "Static Compliance (Cstat)", "Lung Stress / Strain", "Ventilator Strategy"],
        rows: [
          { id: "optimal", cols: ["ΔP < 15 cmH2O", "Normal to mildly reduced (> 35 mL/cmH2O)", "Acceptable cyclic lung stress", "Maintain current lung-protective settings; serial monitoring"] },
          { id: "excessive", cols: ["ΔP ≥ 15 cmH2O", "Severely reduced (< 30 mL/cmH2O)", "High risk of Ventilator-Induced Lung Injury (VILI)", "CRITICAL: Reduce tidal volume by 1 mL/kg PBW, re-titrate PEEP, or consider prone positioning"] }
        ]
      },
      calc: function (v) {
        var pplat = +v.pplat, peep = +v.peep, vt = +v.vt;
        var deltaP = pplat - peep;
        var cstat = deltaP > 0 ? (vt / deltaP).toFixed(1) : "0";

        var match = deltaP < 15 ? "optimal" : "excessive";
        var title = deltaP < 15 ? "Safe Driving Pressure (ΔP < 15 cmH2O)" : "ELEVATED DRIVING PRESSURE (ΔP ≥ 15 cmH2O)";
        var plan = deltaP < 15
          ? "Driving pressure is within protective target (<15 cmH2O). Continue protective ventilation."
          : "HIGH DRIVING PRESSURE: Associated with increased hospital mortality in ARDS. Decrease tidal volume (down to 4–5 mL/kg PBW), evaluate for optimal PEEP to optimize compliance, and consider paralytics/proning.";

        return {
          value: "ΔP: " + deltaP + " cmH2O | Cstat: " + cstat + " mL/cmH2O",
          matchId: match,
          eq: "Calculation: ΔP = " + pplat + " (Pplat) − " + peep + " (PEEP) = " + deltaP + " cmH2O.\nCstat = " + vt + " mL ÷ " + deltaP + " cmH2O = " + cstat + " mL/cmH2O.\n" + plan
        };
      }
    },

    // ==============================================================
    // 13. RASS (RICHMOND AGITATION-SEDATION SCALE)
    // ==============================================================
    {
      id: "rassScore",
      cat: "emicu",
      type: "class",
      name: "Richmond Agitation-Sedation Scale (RASS)",
      desc: "Standard 10-point scale for measuring sedation, agitation, and titrating sedative infusions in the ICU.",
      organ: "Central Nervous System",
      region: "Adult ICU / Sedation Titration",
      subject: "Critical Care / Sedation & Delirium",
      keywords: ["rass", "sedation", "agitation", "propofol", "dexmedetomidine", "cam icu", "delirium", "icu"],
      guidance: "1. Step 1: Observe patient (alert/calm = 0; overt agitation = +1 to +4).\n2. Step 2: If not alert, state patient's name and say 'open your eyes' (awakens with eye contact = -1; eye contact <10s = -2; eye movement but no contact = -3).\n3. Step 3: If no response to voice, physically stimulate patient by shaking shoulder or sternal rub (movement = -4; no response = -5).\n4. Standard target for light sedation: RASS -1 to 0.",
      contraindications: "Does not quantify pain; use CPOT or BPS for objective pain assessment.",
      literature: [
        {
          type: "Seminal Validation",
          icon: "📄",
          title: "The Richmond Agitation-Sedation Scale: validity and reliability in adult intensive care unit patients",
          citation: "Sessler CN, Gosnell MS, Grap MJ, et al. Am J Respir Crit Care Med. 2002;166(10):1338-1344.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/12421743/" }
          ]
        }
      ],
      fields: [
        makeS("rass", "Observed Patient Behavior & Response", "0", [
          ["4", "+4: Combative (Violent, immediate danger to staff, pulling tubes)"],
          ["3", "+3: Very Agitated (Aggressive, pulls at tubes/catheters)"],
          ["2", "+2: Agitated (Frequent non-purposeful movement, fights ventilator)"],
          ["1", "+1: Restless (Anxious, apprehensive, movements not aggressive)"],
          ["0", " 0: Alert and Calm (Normal spontaneous behavior)"],
          ["-1", "-1: Drowsy (Not fully alert, sustained eye contact > 10 sec to voice)"],
          ["-2", "-2: Light Sedation (Brief eye contact < 10 sec to voice)"],
          ["-3", "-3: Moderate Sedation (Movement or eye opening to voice, NO eye contact)"],
          ["-4", "-4: Deep Sedation (No response to voice, movement only to physical stimulation)"],
          ["-5", "-5: Unarousable (No response to voice or physical stimulation)"]
        ])
      ],
      table: {
        headers: ["RASS Tier", "Clinical State", "Sedation Target Suitability", "Titration Recommendation"],
        rows: [
          { id: "agitated", cols: ["+1 to +4", "Agitation / Combative", "Suboptimal", "Evaluate pain (CPOT), treat delirium, cautiously titrate sedatives/analgesics"] },
          { id: "target", cols: ["-1 to 0", "Alert and Calm / Light Sedation", "OPTIMAL TARGET", "Standard target for mechanically ventilated patients; promotes early extubation"] },
          { id: "deep", cols: ["-2 to -3", "Moderate Sedation", "Acceptable in acute phase", "Daily Spontaneous Awakening Trial (SAT); wean sedative infusion"] },
          { id: "paralysis", cols: ["-4 to -5", "Deep Sedation / Unarousable", "Target only for severe ARDS / paralytics / elevated ICP", "High risk of ICU-acquired weakness and delirium; de-escalate unless indicated"] }
        ]
      },
      calc: function (v) {
        var r = +v.rass;
        var match = "target", plan = "Optimal target for ICU sedation.";

        if (r > 0) {
          match = "agitated";
          plan = "Patient is agitated. Screen for untreated pain, hypoxia, full bladder, or delirium before escalating sedatives.";
        } else if (r === 0 || r === -1) {
          match = "target";
          plan = "Optimal light sedation target (RASS 0 to -1). Screen for delirium with CAM-ICU.";
        } else if (r >= -3) {
          match = "deep";
          plan = "Moderate sedation. Conduct daily sedation interruption (SAT) if medically appropriate.";
        } else {
          match = "paralysis";
          plan = "Deep sedation / unarousable. Justified only if managing severe ARDS (paralytics), refractory status epilepticus, or intracranial hypertension.";
        }

        return {
          value: "RASS Score: " + (r > 0 ? "+" + r : r),
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 14. CAM-ICU (CONFUSION ASSESSMENT METHOD FOR THE ICU)
    // ==============================================================
    {
      id: "camIcu",
      cat: "emicu",
      type: "class",
      name: "CAM-ICU (Delirium Screening in the ICU)",
      desc: "Bedside delirium screening instrument for critically ill, mechanically ventilated adult patients.",
      organ: "Brain / Neurocognitive Axis",
      region: "Adult ICU / Neurocritical Care",
      subject: "Critical Care / Delirium Screening",
      keywords: ["cam icu", "delirium", "confusion", "encephalopathy", "rass", "icu psychosis", "inattention"],
      guidance: "1. Prerequisite: Patient must be arousable (RASS -3 or higher; if RASS -4 or -5, patient is unarousable, stop).\n2. Feature 1: Acute change or fluctuating course of mental status.\n3. Feature 2: Inattention (SAVEHAART test: Squeeze hand on letter 'A'; >2 errors is abnormal).\n4. Feature 3: Altered level of consciousness (Current RASS is anything other than 0).\n5. Feature 4: Disorganized thinking (>1 error on 4 simple logic questions).\n6. Delirium Positive = Feature 1 AND Feature 2 AND (Feature 3 OR Feature 4).",
      contraindications: "Cannot be performed in patients in deep coma or pharmacologically paralyzed (RASS -4 or -5).",
      literature: [
        {
          type: "Seminal Validation",
          icon: "📄",
          title: "Evaluation of delirium in critically ill patients: validation of the Confusion Assessment Method for the Intensive Care Unit (CAM-ICU)",
          citation: "Ely EW, Inouye SK, Bernard GR, et al. Crit Care Med. 2001;29(7):1370-1379.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/11445689/" }
          ]
        }
      ],
      fields: [
        makeS("f1", "Feature 1: Acute onset or fluctuating course of mental status?", "1", [
          ["1", "Yes: Acute change or fluctuation over past 24 hours"],
          ["0", "No: Stable mental baseline"]
        ]),
        makeS("f2", "Feature 2: Inattention (SAVEHAART test: >2 errors squeeze on 'A')?", "1", [
          ["1", "Yes: > 2 errors (Inattention present)"],
          ["0", "No: 0 to 2 errors (Attention intact)"]
        ]),
        makeS("f3", "Feature 3: Altered level of consciousness (Current RASS other than 0)?", "1", [
          ["1", "Yes: Current RASS is NOT 0 (e.g., -3, -2, -1, +1, +2)"],
          ["0", "No: Current RASS is exactly 0 (Alert and calm)"]
        ]),
        makeS("f4", "Feature 4: Disorganized thinking (>1 error on logic questions / command)?", "0", [
          ["1", "Yes: > 1 error on logic questions"],
          ["0", "No: 0 or 1 error"]
        ])
      ],
      table: {
        headers: ["CAM-ICU Status", "Diagnostic Algorithm", "Delirium Subtype", "Recommended Non-Pharmacologic / Medical Action"],
        rows: [
          { id: "deliriumPos", cols: ["CAM-ICU POSITIVE", "Feature 1 + Feature 2 + (Feature 3 or 4)", "ICU Delirium Confirmed (Hyperactive / Hypoactive)", "Review deliriogenic medications (benzodiazepines, anticholinergics), treat pain, sleep protocol, early mobilization"] },
          { id: "deliriumNeg", cols: ["CAM-ICU NEGATIVE", "Criteria for delirium not satisfied", "No Delirium Detected", "Routine rescreening every nursing shift (every 8–12 hours)"] }
        ]
      },
      calc: function (v) {
        var f1 = v.f1 === "1", f2 = v.f2 === "1", f3 = v.f3 === "1", f4 = v.f4 === "1";
        var isDelirium = f1 && f2 && (f3 || f4);

        var match = isDelirium ? "deliriumPos" : "deliriumNeg";
        var title = isDelirium ? "CAM-ICU POSITIVE (Delirium Confirmed)" : "CAM-ICU Negative (No Delirium)";
        var plan = isDelirium
          ? "Delirium present. Identify 'THINK' causes: Toxic/meds (stop benzos/anticholinergics), Hypoxemia, Infection/Sepsis, Non-pharmacologic (sleep hygiene, glasses/hearing aids, day/night cycles), K+ or metabolic derangement. Encourage early PT/OT."
          : "Patient does not meet criteria for delirium. Maintain non-pharmacological delirium prevention bundles and repeat screening next shift.";

        return {
          value: title,
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 15. KDIGO AKI STAGING & AEIOU DIALYSIS CRITERIA
    // ==============================================================
    {
      id: "kdigoAkiStaging",
      cat: "emicu",
      type: "class",
      name: "KDIGO Acute Kidney Injury Staging & Emergent Dialysis",
      desc: "Stages acute kidney injury by serum creatinine rise and hourly urine output; outlines 'AEIOU' emergent hemodialysis triggers.",
      organ: "Kidneys / Nephrons",
      region: "Adult ICU / Nephrology",
      subject: "Critical Care Nephrology / Renal Failure",
      keywords: ["kdigo", "aki", "creatinine", "urine output", "dialysis", "crrt", "aeiou", "hyperkalemia", "uremia", "icu"],
      guidance: "1. Stage 1: Serum creatinine 1.5–1.9× baseline OR rise ≥0.3 mg/dL within 48h; or urine <0.5 mL/kg/h for 6–12h.\n2. Stage 2: Creatinine 2.0–2.9× baseline; or urine <0.5 mL/kg/h for ≥12h.\n3. Stage 3: Creatinine ≥3.0× baseline OR rise to ≥4.0 mg/dL OR initiation of RRT; or urine <0.3 mL/kg/h for ≥24h or anuria for ≥12h.\n4. Emergent Dialysis AEIOU: Acidosis (pH < 7.15), Electrolytes (K > 6.5 with ECG changes), Ingestions (toxic alcohols/salicylate), Overload (refractory pulmonary edema), Uremia (pericarditis, encephalopathy).",
      contraindications: "Baseline creatinine must reflect true pre-morbid baseline, not immediate admission value in dehydrated states.",
      literature: [
        {
          type: "Official Clinical Guideline",
          icon: "📘",
          title: "KDIGO Clinical Practice Guideline for Acute Kidney Injury",
          citation: "Kidney Disease: Improving Global Outcomes (KDIGO) AKI Work Group. Kidney Int Suppl. 2012;2(1):1-138.",
          links: [
            { text: "View Guidelines (KDIGO) ↗", url: "https://kdigo.org/guidelines/acute-kidney-injury/" }
          ]
        }
      ],
      fields: [
        makeS("crStage", "Creatinine Rise relative to Baseline", "1", [
          ["0", "No significant rise (Cr < 1.5× baseline and < 0.3 mg/dL rise)"],
          ["1", "Stage 1: 1.5 – 1.9× baseline OR rise ≥ 0.3 mg/dL in 48 hours"],
          ["2", "Stage 2: 2.0 – 2.9× baseline"],
          ["3", "Stage 3: ≥ 3.0× baseline OR absolute Cr ≥ 4.0 mg/dL"]
        ]),
        makeS("uoStage", "Urine Output Criterion", "0", [
          ["0", "Normal urine output (≥ 0.5 mL/kg/hr)"],
          ["1", "Stage 1: < 0.5 mL/kg/hr for 6 to 12 hours"],
          ["2", "Stage 2: < 0.5 mL/kg/hr for ≥ 12 hours"],
          ["3", "Stage 3: < 0.3 mL/kg/hr for ≥ 24 hours OR anuria for ≥ 12 hours"]
        ]),
        makeS("aeiou", "Emergent Dialysis Criteria (AEIOU)?", "0", [
          ["0", "None of the emergent AEIOU criteria present"],
          ["1", "Acidosis: Refractory metabolic acidosis with pH < 7.15"],
          ["2", "Electrolytes: Refractory hyperkalemia (K > 6.5 mEq/L) with ECG changes"],
          ["3", "Ingestion: Toxic ingestions (salicylate, toxic alcohols, lithium)"],
          ["4", "Overload: Refractory pulmonary edema unresponsive to diuretics"],
          ["5", "Uremia: Uremic encephalopathy, pericarditis, or uremic bleeding"]
        ])
      ],
      table: {
        headers: ["KDIGO Stage", "Serum Creatinine", "Urine Output", "Management Action"],
        rows: [
          { id: "noAki", cols: ["No AKI", "Normal", "Normal", "Maintain hydration; avoid nephrotoxins (NSAIDs, aminoglycosides)"] },
          { id: "stage1", cols: ["KDIGO Stage 1", "1.5–1.9× baseline or +0.3 mg/dL", "< 0.5 mL/kg/h for 6–12h", "Discontinue nephrotoxic agents, optimize hemodynamics, track fluid balance"] },
          { id: "stage2", cols: ["KDIGO Stage 2", "2.0–2.9× baseline", "< 0.5 mL/kg/h for ≥ 12h", "Nephrology consult, adjust drug dosing for GFR, screen for RRT readiness"] },
          { id: "stage3", cols: ["KDIGO Stage 3", "≥ 3.0× baseline or Cr ≥ 4.0", "< 0.3 mL/kg/h for ≥ 24h", "Prepare dialysis vascular access, evaluate for intermittent HD vs CRRT"] },
          { id: "emergent", cols: ["EMERGENT RRT (AEIOU)", "Refractory metabolic / fluid emergency", "Any", "IMMEDIATE DIALYSIS CONSULT / VASCULAR SHEATH PLACEMENT STAT"] }
        ]
      },
      calc: function (v) {
        var sCr = +v.crStage, sUo = +v.uoStage, aeiou = v.aeiou !== "0";
        var maxStage = Math.max(sCr, sUo);

        if (aeiou) {
          return {
            value: "EMERGENT INDICATION FOR DIALYSIS (AEIOU TRIGGERED)",
            matchId: "emergent",
            eq: "CRITICAL: Patient meets absolute criteria for emergent renal replacement therapy (AEIOU: Acidosis, Electrolytes, Ingestion, Overload, or Uremia). Place temporary dialysis catheter and initiate urgent hemodialysis/CRRT."
          };
        }

        var match = maxStage === 3 ? "stage3" : maxStage === 2 ? "stage2" : maxStage === 1 ? "stage1" : "noAki";
        var title = maxStage > 0 ? "KDIGO AKI Stage " + maxStage : "No AKI Criteria Met";
        var plan = maxStage === 3
          ? "Severe AKI (Stage 3). High risk of fluid overload and electrolyte catastrophe. Obtain urgent nephrology consultation."
          : maxStage === 2
          ? "Moderate AKI (Stage 2). Avoid all nephrotoxic drugs, monitor urine output hourly via Foley catheter, and adjust drug dosing."
          : maxStage === 1
          ? "Mild AKI (Stage 1). Ensure adequate renal perfusion pressure (MAP ≥65 mmHg) and repeat creatinine in 12–24 hours."
          : "Renal parameters within normal baseline limits.";

        return {
          value: title,
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 16. HEART SCORE FOR CHEST PAIN
    // ==============================================================
    {
      id: "heartScore",
      cat: "emicu",
      type: "class",
      name: "HEART Score for Major Adverse Cardiac Events (MACE)",
      desc: "Stratifies 6-week risk of major adverse cardiac events in emergency department chest pain patients.",
      organ: "Heart / Coronary Arteries",
      region: "Adult Emergency / Chest Pain",
      subject: "Emergency Cardiology / Acute Chest Pain",
      keywords: ["heart score", "chest pain", "mace", "acs", "troponin", "mi", "angina", "ecg", "emergency"],
      guidance: "1. History: Highly suspicious (2), moderately suspicious (1), slightly/non-suspicious (0).\n2. ECG: Significant ST depression (2), non-specific repolarization disturbance/LBBB (1), normal (0).\n3. Age: ≥ 65 (2), 45–64 (1), < 45 (0).\n4. Risk Factors (HTN, hyperlipidemia, DM, smoking, family history, obesity): ≥ 3 risk factors or prior CAD (2), 1–2 risk factors (1), none (0).\n5. Troponin: > 3× normal limit (2), 1–3× normal limit (1), normal (0).",
      contraindications: "Do not use if new ST-elevation MI is present on ECG (activate Cath Lab stat for primary PCI).",
      literature: [
        {
          type: "Seminal Multicenter Study",
          icon: "📄",
          title: "A prospective validation of the HEART score for chest pain patients at the emergency department",
          citation: "Backus BE, Six AJ, Kelder JC, et al. Int J Cardiol. 2013;168(3):2153-2158.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/23465250/" }
          ]
        }
      ],
      fields: [
        makeS("hist", "1. History Suspicion", "1", [
          ["0", "Slightly or non-suspicious (0 pts)"],
          ["1", "Moderately suspicious (1 pt)"],
          ["2", "Highly suspicious for ischemia (2 pts)"]
        ]),
        makeS("ecg", "2. Electrocardiogram (ECG)", "0", [
          ["0", "Normal (0 pts)"],
          ["1", "Non-specific repolarization disturbance, LBBB, or paced (1 pt)"],
          ["2", "Significant ST depression or T-wave inversion (2 pts)"]
        ]),
        makeS("age", "3. Patient Age", "1", [
          ["0", "< 45 years (0 pts)"],
          ["1", "45 to 64 years (1 pt)"],
          ["2", "≥ 65 years (2 pts)"]
        ]),
        makeS("risk", "4. Risk Factors (HTN, Lipids, DM, Smoke, Fam Hx, Prior CAD)", "1", [
          ["0", "No known risk factors (0 pts)"],
          ["1", "1 or 2 cardiovascular risk factors (1 pt)"],
          ["2", "≥ 3 risk factors OR established history of CAD/PVD/stroke (2 pts)"]
        ]),
        makeS("trop", "5. Initial Troponin Level", "0", [
          ["0", "Normal / below 99th percentile cutoff (0 pts)"],
          ["1", "1 to 3× upper limit of normal (1 pt)"],
          ["2", "> 3× upper limit of normal (2 pts)"]
        ])
      ],
      table: {
        headers: ["HEART Score", "6-Week MACE Risk", "Risk Tier", "Recommended ED Pathway"],
        rows: [
          { id: "low", cols: ["Score 0 – 3", "0.9% – 1.7%", "Low Risk", "Candidates for early discharge and outpatient cardiology stress testing"] },
          { id: "mod", cols: ["Score 4 – 6", "12% – 17%", "Moderate Risk", "Admit for serial troponins, continuous telemetry, and non-invasive ischemia testing"] },
          { id: "high", cols: ["Score 7 – 10", "50% – 65%", "HIGH RISK", "Immediate admission, early invasive coronary angiography (Cath lab consult)"] }
        ]
      },
      calc: function (v) {
        var total = +v.hist + +v.ecg + +v.age + +v.risk + +v.trop;
        var match = "low", title = "Low Risk (Score " + total + ")", plan = "MACE risk is <1.7%. Low-risk candidate eligible for safe ED discharge with outpatient cardiology follow-up.";

        if (total >= 7) {
          match = "high";
          title = "HIGH RISK (Score " + total + ")";
          plan = "High risk of 6-week MACE (50–65%). Immediate inpatient cardiology admission, telemetry, dual antiplatelet therapy, and urgent invasive angiography.";
        } else if (total >= 4) {
          match = "mod";
          title = "Moderate Risk (Score " + total + ")";
          plan = "Moderate risk of MACE (12–17%). Admit to observation/chest pain unit for serial high-sensitivity troponins, telemetry, and provocative testing.";
        }

        return {
          value: "HEART Score: " + total + " / 10 Points (" + title + ")",
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 17. WELLS CRITERIA FOR PULMONARY EMBOLISM (PE)
    // ==============================================================
    {
      id: "wellsPe",
      cat: "emicu",
      type: "class",
      name: "Wells' Criteria for Pulmonary Embolism (PE)",
      desc: "Clinical pre-test probability scoring for suspected acute pulmonary embolism to guide D-dimer vs CTPA.",
      organ: "Pulmonary Arteries / Lungs",
      region: "Adult Emergency / Thromboembolism",
      subject: "Emergency Medicine / Pulmonology",
      keywords: ["wells", "pe", "pulmonary embolism", "dvt", "d-dimer", "ctpa", "thrombus", "shortness of breath"],
      guidance: "1. Score 7 variables:\n   - Clinical signs of DVT (3 pts)\n   - PE is #1 diagnosis or equally likely (3 pts)\n   - Heart rate > 100 bpm (1.5 pts)\n   - Immobilization ≥3 days or surgery in 4 weeks (1.5 pts)\n   - Prior PE or DVT (1.5 pts)\n   - Hemoptysis (1 pt)\n   - Active malignancy (1 pt).\n2. Dichotomized model: Score ≤ 4 = PE Unlikely; Score > 4 = PE Likely.",
      contraindications: "In hemodynamic collapse with suspected massive PE, proceed immediately with bedside echocardiography and CTPA or thrombolysis.",
      literature: [
        {
          type: "Seminal Multicenter Study",
          icon: "📄",
          title: "Excluding pulmonary embolism at the bedside without diagnostic imaging: management of patients with suspected pulmonary embolism presenting to the emergency department by using a simple clinical model and d-dimer",
          citation: "Wells PS, Anderson DR, Rodger M, et al. Ann Intern Med. 2001;135(2):98-107.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/11453709/" }
          ]
        }
      ],
      fields: [
        makeS("dvtSigns", "1. Clinical signs and symptoms of DVT (leg swelling, pain on palpation)", "0", [["0", "No (0 pts)"], ["3", "Yes (+3.0 pts)"]]),
        makeS("peLikely", "2. PE is #1 diagnosis OR equally likely to other diagnoses", "0", [["0", "No (0 pts)"], ["3", "Yes (+3.0 pts)"]]),
        makeS("tachy", "3. Heart rate > 100 beats/min", "0", [["0", "No (0 pts)"], ["1.5", "Yes (+1.5 pts)"]]),
        makeS("immo", "4. Immobilization ≥ 3 days OR surgery in past 4 weeks", "0", [["0", "No (0 pts)"], ["1.5", "Yes (+1.5 pts)"]]),
        makeS("priorVte", "5. Previous objectively diagnosed PE or DVT", "0", [["0", "No (0 pts)"], ["1.5", "Yes (+1.5 pts)"]]),
        makeS("hemoptysis", "6. Hemoptysis (coughing blood)", "0", [["0", "No (0 pts)"], ["1", "Yes (+1.0 pt)"]]),
        makeS("cancer", "7. Malignancy (treatment ongoing, within 6 mo, or palliative)", "0", [["0", "No (0 pts)"], ["1", "Yes (+1.0 pt)"]])
      ],
      table: {
        headers: ["Wells Score (Dichotomized)", "PE Probability", "Recommended Diagnostic Pathway"],
        rows: [
          { id: "unlikely", cols: ["Score ≤ 4.0 (PE Unlikely)", "~ 8% – 12%", "Rule out with High-Sensitivity D-dimer (or PERC rule if low pre-test)"] },
          { id: "likely", cols: ["Score > 4.0 (PE Likely)", "~ 35% – 40%", "PROCEED DIRECTLY TO CT PULMONARY ANGIOGRAM (CTPA)"] }
        ]
      },
      calc: function (v) {
        var total = +v.dvtSigns + +v.peLikely + +v.tachy + +v.immo + +v.priorVte + +v.hemoptysis + +v.cancer;
        var isLikely = total > 4.0;
        var match = isLikely ? "likely" : "unlikely";
        var title = isLikely ? "PE Likely (Score > 4.0)" : "PE Unlikely (Score ≤ 4.0)";
        var act = isLikely
          ? "High pre-test probability. Do NOT order D-dimer; proceed directly to CT Pulmonary Angiogram (CTPA) unless contraindicated (severe contrast allergy/acute renal failure)."
          : "PE Unlikely. Check high-sensitivity D-dimer (age-adjusted if age > 50: Age × 10 ng/mL). If D-dimer is normal, PE is safely ruled out without imaging.";

        return {
          value: "Wells Score: " + total.toFixed(1) + " Points (" + title + ")",
          matchId: match,
          eq: act
        };
      }
    },

    // ==============================================================
    // 18. PERC RULE (PULMONARY EMBOLISM RULE-OUT CRITERIA)
    // ==============================================================
    {
      id: "percRule",
      cat: "emicu",
      type: "class",
      name: "PERC Rule (PE Rule-Out Criteria)",
      desc: "8-item clinical rule allowing complete exclusion of pulmonary embolism without D-dimer testing in low-risk patients.",
      organ: "Pulmonary Arteries / Lungs",
      region: "Adult Emergency / Low-Risk Chest Pain",
      subject: "Emergency Medicine / Thromboembolism",
      keywords: ["perc", "perc rule", "pulmonary embolism", "d-dimer", "rule out", "chest pain", "dyspnea"],
      guidance: "1. Only applies if patient is clinically LOW RISK for PE by physician gestalt or Wells score < 2.\n2. ALL 8 criteria must be met (all negative) to rule out PE.\n3. Criteria: Age < 50, HR < 100, SpO2 ≥ 95%, No hemoptysis, No estrogen use, No prior DVT/PE, No unilateral leg swelling, No surgery/trauma requiring hospitalization in past 4 weeks.",
      contraindications: "Do NOT use if patient is intermediate or high risk, hemodynamically unstable, or pregnant.",
      literature: [
        {
          type: "Seminal Multicenter Study",
          icon: "📄",
          title: "Clinical criteria to prevent unnecessary diagnostic testing in emergency department patients with suspected pulmonary embolism",
          citation: "Kline JA, Mitchell AM, Kabrhel C, et al. J Thromb Haemost. 2004;2(8):1247-1267.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/15304025/" }
          ]
        }
      ],
      fields: [
        makeS("age50", "1. Age ≥ 50 years", "0", [["0", "No (Age < 50)"], ["1", "Yes (Age ≥ 50)"]]),
        makeS("hr100", "2. Pulse ≥ 100 beats/min", "0", [["0", "No (HR < 100)"], ["1", "Yes (HR ≥ 100)"]]),
        makeS("spo2", "3. Pulse oximetry SpO2 < 95% on room air", "0", [["0", "No (SpO2 ≥ 95%)"], ["1", "Yes (SpO2 < 95%)"]]),
        makeS("legSwelling", "4. Unilateral leg swelling", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("hemoptysis", "5. Hemoptysis", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("surgery", "6. Recent surgery or trauma requiring hospitalization within 4 weeks", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("priorVte", "7. Prior PE or DVT", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("estrogen", "8. Exogenous estrogen use (OCPs, HRT, tamoxifen)", "0", [["0", "No"], ["1", "Yes"]])
      ],
      table: {
        headers: ["PERC Evaluation", "PE Probability", "Testing Indication", "Action Pathway"],
        rows: [
          { id: "cleared", cols: ["PERC NEGATIVE (All 8 Met)", "< 1.4% (Below testing threshold)", "NO D-DIMER OR CTPA REQUIRED", "Pulmonary embolism reliably ruled out. Stop diagnostic workup for PE"] },
          { id: "failed", cols: ["PERC Positive (≥1 violated)", "> 1.4%", "D-Dimer Testing Indicated", "Obtain high-sensitivity D-dimer testing to determine need for CTPA"] }
        ]
      },
      calc: function (v) {
        var fails = +v.age50 + +v.hr100 + +v.spo2 + +v.legSwelling + +v.hemoptysis + +v.surgery + +v.priorVte + +v.estrogen;
        var match = fails === 0 ? "cleared" : "failed";
        var verdict = fails === 0 ? "PERC RULE NEGATIVE: PE Ruled Out" : "PERC RULE POSITIVE: Cannot Rule Out PE";
        var plan = fails === 0
          ? "All 8 criteria satisfied. Risk of PE is <1.4% (lower than the risk of contrast nephropathy or radiation). No D-dimer or CTPA indicated."
          : "Fails " + fails + " PERC criterion/criteria. Order high-sensitivity D-dimer test (use age-adjusted cutoff if age > 50).";

        return {
          value: verdict,
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 19. GLASGOW COMA SCALE (GCS & GCS-P)
    // ==============================================================
    {
      id: "gcsScale",
      cat: "emicu",
      type: "class",
      name: "Glasgow Coma Scale & GCS-Pupils (GCS-P)",
      desc: "Standardized physiological consciousness assessment (Eye, Verbal, Motor) with pupillary reactivity adjustment.",
      organ: "Brain / Brainstem / Cranial Nerves",
      region: "Emergency / Neurotrauma / ICU",
      subject: "Neurocritical Care / Trauma",
      keywords: ["gcs", "gcs-p", "glasgow coma scale", "coma", "pupils", "brain injury", "tbi", "trauma"],
      guidance: "1. Eye opening (1–4): Spontaneous (4), To sound (3), To pressure (2), None (1).\n2. Verbal response (1–5): Oriented (5), Confused (4), Inappropriate words (3), Incomprehensible sounds (2), None (1).\n3. Motor response (1–6): Obeys commands (6), Localizes pressure (5), Normal flexion/withdrawal (4), Abnormal flexion/decorticate (3), Extension/decerebrate (2), None (1).\n4. Pupils unreactive (0 to 2): Subtract from GCS score to calculate GCS-P (Range 1–15).",
      contraindications: "Document 'T' if endotracheal tube in place (e.g., E4 V_T M6); document if swollen eyes prevent assessment.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Assessment of coma and impaired consciousness. A practical scale",
          citation: "Teasdale G, Jennett B. Lancet. 1974;2(7872):81-84.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/4136544/" }
          ]
        },
        {
          type: "GCS-Pupils Landmark Update",
          icon: "📘",
          title: "The Glasgow Coma Scale at 40 years: standing the test of time",
          citation: "Teasdale G, Maas A, Lecky F, et al. Lancet Neurol. 2014;13(8):844-854.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/25030516/" }
          ]
        }
      ],
      fields: [
        makeS("eye", "1. Eye Opening Response (E)", "4", [
          ["4", "Spontaneous eye opening (4 pts)"],
          ["3", "To speech / sound (3 pts)"],
          ["2", "To pressure / pain (2 pts)"],
          ["1", "None (1 pt)"]
        ]),
        makeS("verbal", "2. Verbal Response (V)", "5", [
          ["5", "Oriented (5 pts)"],
          ["4", "Confused conversation (4 pts)"],
          ["3", "Inappropriate words (3 pts)"],
          ["2", "Incomprehensible sounds / moans (2 pts)"],
          ["1", "No verbal response (1 pt)"]
        ]),
        makeS("motor", "3. Motor Response (M)", "6", [
          ["6", "Obeys commands (6 pts)"],
          ["5", "Localizes to painful pressure (5 pts)"],
          ["4", "Normal flexion / withdrawal (4 pts)"],
          ["3", "Abnormal flexion / decorticate (3 pts)"],
          ["2", "Extension / decerebrate (2 pts)"],
          ["1", "No motor response / flaccid (1 pt)"]
        ]),
        makeS("pupils", "4. Pupillary Light Reactivity (Unreactive Pupils to Subtract)", "0", [
          ["0", "Both pupils reactive (Subtract 0)"],
          ["1", "One pupil unreactive / asymmetric (Subtract 1)"],
          ["2", "Both pupils unreactive / fixed (Subtract 2)"]
        ])
      ],
      table: {
        headers: ["GCS Score", "TBI Severity", "Clinical Status", "Airway & Resuscitation Action"],
        rows: [
          { id: "mild", cols: ["GCS 13 – 15", "Mild TBI", "Conscious, low risk of herniation", "Neurological observations every 30–60 min; CT head per Canadian Head Rule"] },
          { id: "moderate", cols: ["GCS 9 – 12", "Moderate TBI", "Significant lethargy / encephalopathy", "Non-contrast CT head stat; neurosurgical consult; protect airway"] },
          { id: "severe", cols: ["GCS ≤ 8", "Severe TBI (Coma)", "Loss of airway protective reflexes", "INTUBATE STAT ('GCS ≤ 8, Intubate'); maintain CPP 60–70 mmHg, ICP monitoring"] }
        ]
      },
      calc: function (v) {
        var gcs = +v.eye + +v.verbal + +v.motor;
        var p = +v.pupils;
        var gcsp = gcs - p;

        var match = gcs <= 8 ? "severe" : gcs <= 12 ? "moderate" : "mild";
        var tbi = gcs <= 8 ? "Severe TBI / Coma" : gcs <= 12 ? "Moderate TBI" : "Mild Head Injury";
        var plan = gcs <= 8
          ? "GCS ≤ 8: High risk of aspiration and respiratory failure. Immediate definitive endotracheal intubation required. Hyperosmolar therapy (hypertonic saline/mannitol) if unreactive pupils or herniation signs present."
          : "Maintain serial neurological reassessment. Obtain non-contrast head CT if indicated.";

        return {
          value: "GCS: " + gcs + " (E" + v.eye + "V" + v.verbal + "M" + v.motor + ") | GCS-P: " + gcsp + " (" + tbi + ")",
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 20. NIH STROKE SCALE (NIHSS)
    // ==============================================================
    {
      id: "nihssSummary",
      cat: "emicu",
      type: "calc",
      name: "NIH Stroke Scale (NIHSS Summary)",
      desc: "Scores 11 neurological domains (0–42 points) to quantify stroke deficit and guide IV thrombolysis and endovascular thrombectomy (EVT).",
      organ: "Brain / Cerebral Vasculature",
      region: "Adult Emergency / Acute Stroke",
      subject: "Emergency Neurology / Stroke Protocol",
      keywords: ["nihss", "stroke", "tpa", "thrombolysis", "thrombectomy", "ischemic stroke", "neurology"],
      guidance: "1. 11 domains: Level of consciousness, gaze, visual fields, facial palsy, motor arm, motor leg, limb ataxia, sensory, language/aphasia, dysarthria, extinction/inattention.\n2. Score ranges 0 to 42.\n3. Stratification:\n   - 0: No stroke symptoms\n   - 1–4: Minor stroke\n   - 5–15: Moderate stroke\n   - 16–20: Moderate-to-severe stroke\n   - 21–42: Severe stroke.\n4. Score ≥ 6 with large vessel occlusion (LVO) supports endovascular thrombectomy within 24 hours.",
      contraindications: "Administer tissue plasminogen activator (Alteplase/Tenecteplase) within 4.5 hours of last known normal if no hemorrhagic contraindications exist.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Reliability of the National Institutes of Health Stroke Scale",
          citation: "Goldstein LB, Bertels C, Davis JN. Stroke. 1989;20(4):544-548.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/2705218/" }
          ]
        }
      ],
      fields: [
        makeN("nihssPoints", "Total NIHSS Score (0 to 42 Points)", 12, { min: 0, max: 42, step: 1 })
      ],
      table: {
        headers: ["NIHSS Score", "Stroke Severity", "LVO Probability", "Emergency Revascularization Strategy"],
        rows: [
          { id: "minor", cols: ["0 – 4 Points", "Minor Stroke", "Low (< 10%)", "Evaluate for IV thrombolysis (if disabling deficit) or dual antiplatelet therapy (DAPT)"] },
          { id: "moderate", cols: ["5 – 15 Points", "Moderate Stroke", "Moderate (~ 40% – 60%)", "IV Thrombolysis (if <4.5h) + immediate CTA/CTP for Endovascular Thrombectomy (EVT)"] },
          { id: "modSevere", cols: ["16 – 20 Points", "Moderate-to-Severe Stroke", "High (> 70%)", "Emergency EVT candidate + IV thrombolysis; intensive neuro-ICU care"] },
          { id: "severe", cols: ["≥ 21 Points", "Severe Stroke", "Very High (> 80%)", "High risk of hemorrhagic transformation and malignant edema; EVT consultation stat"] }
        ]
      },
      calc: function (v) {
        var pts = +v.nihssPoints;
        var match = "minor", sev = "Minor Stroke", plan = "Evaluate for disabling symptoms (e.g., complete hemianopia or severe aphasia) to determine thrombolysis candidacy.";

        if (pts >= 21) {
          match = "severe";
          sev = "Severe Stroke (Score ≥ 21)";
          plan = "Severe neurological impairment. Immediate CT Angiography to evaluate for Large Vessel Occlusion (LVO) and Endovascular Thrombectomy. High risk of malignant MCA syndrome; neurosurgical consultation.";
        } else if (pts >= 16) {
          match = "modSevere";
          sev = "Moderate-to-Severe Stroke (Score 16–20)";
          plan = "Strong probability of LVO. Administer IV thrombolytic agent if within 4.5 hours and expedite catheter-based thrombectomy.";
        } else if (pts >= 5) {
          match = "moderate";
          sev = "Moderate Stroke (Score 5–15)";
          plan = "Standard indication for IV thrombolysis (<4.5h window). Screen for proximal arterial occlusion on CT angiogram for thrombectomy.";
        }

        return {
          value: "NIHSS: " + pts + " (" + sev + ")",
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 21. GLASGOW-BLATCHFORD BLEEDING SCORE (GBS)
    // ==============================================================
    {
      id: "glasgowBlatchford",
      cat: "emicu",
      type: "class",
      name: "Glasgow-Blatchford Bleeding Score (GBS)",
      desc: "Pre-endoscopic risk stratification for acute upper gastrointestinal bleeding to identify patients safe for outpatient care.",
      organ: "Upper GI Tract / Stomach / Esophagus",
      region: "Adult Emergency / Gastroenterology",
      subject: "Emergency Medicine / GI Bleeding",
      keywords: ["gbs", "glasgow blatchford", "gi bleed", "upper gi bleed", "melena", "bun", "hemoglobin", "endoscopy"],
      guidance: "1. Calculated entirely on pre-endoscopic variables: Blood urea nitrogen, hemoglobin, systolic BP, pulse, melena, syncope, hepatic disease, and heart failure.\n2. Score = 0 to 1 identifies very low-risk patients who can be safely managed as outpatients without emergency hospital admission.\n3. Score ≥ 6 is associated with a >50% risk of needing endoscopic intervention or blood transfusion.",
      contraindications: "Does not replace clinical judgement if patient has active ongoing hematemesis or hemodynamic instability.",
      literature: [
        {
          type: "Seminal Multicenter Study",
          icon: "📄",
          title: "A risk score to predict need for treatment for upper-gastrointestinal haemorrhage",
          citation: "Blatchford O, Murray WR, Blatchford M. Lancet. 2000;356(9238):1318-1321.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/11073021/" }
          ]
        }
      ],
      fields: [
        makeN("bun", "Blood Urea Nitrogen (BUN, mg/dL)", 24, { min: 5, max: 150, step: 1 }),
        makeN("hb", "Hemoglobin (g/dL)", 10.5, { min: 3, max: 20, step: 0.1 }),
        makeS("gender", "Patient Gender", "male", [["male", "Male"], ["female", "Female"]]),
        makeN("sbp", "Systolic BP (mmHg)", 105, { min: 50, max: 220, step: 1 }),
        makeN("hr", "Pulse Rate (beats/min)", 104, { min: 40, max: 200, step: 1 }),
        makeS("melena", "Presentation with Melena?", "1", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("syncope", "Presentation with Syncope?", "0", [["0", "No (0 pts)"], ["2", "Yes (+2 pts)"]]),
        makeS("liverHx", "Known Hepatic Cirrhosis / Chronic Liver Disease?", "0", [["0", "No (0 pts)"], ["2", "Yes (+2 pts)"]]),
        makeS("chfHx", "Known Congestive Heart Failure?", "0", [["0", "No (0 pts)"], ["2", "Yes (+2 pts)"]])
      ],
      table: {
        headers: ["GBS Score", "Intervention / Transfusion Risk", "Risk Tier", "Disposition Strategy"],
        rows: [
          { id: "outpatient", cols: ["Score 0 – 1", "< 1%", "Very Low Risk", "Eligible for discharge with non-emergent outpatient endoscopy"] },
          { id: "inpatient", cols: ["Score 2 – 5", "~ 15% – 30%", "Intermediate Risk", "Inpatient hospital admission, IV proton pump inhibitor, endoscopy within 24h"] },
          { id: "high", cols: ["Score ≥ 6", "> 50%", "HIGH RISK", "Urgent endoscopy (<12–24h), crossmatch blood, ICU/HDU admission"] }
        ]
      },
      calc: function (v) {
        var bun = +v.bun, hb = +v.hb, sbp = +v.sbp, hr = +v.hr;
        var pts = +v.melena + +v.syncope + +v.liverHx + +v.chfHx;

        // BUN points
        if (bun >= 70) pts += 6;
        else if (bun >= 28) pts += 4;
        else if (bun >= 22.4) pts += 3;
        else if (bun >= 18.2) pts += 2;

        // Hemoglobin points
        if (v.gender === "male") {
          if (hb < 10.0) pts += 6;
          else if (hb < 12.0) pts += 3;
          else if (hb < 13.0) pts += 1;
        } else {
          if (hb < 10.0) pts += 6;
          else if (hb < 12.0) pts += 1;
        }

        // SBP points
        if (sbp < 90) pts += 3;
        else if (sbp < 100) pts += 2;
        else if (sbp < 110) pts += 1;

        // Pulse points
        if (hr >= 100) pts += 1;

        var match = "outpatient", rec = "Very low risk (Score ≤ 1). Outpatient management is safe.";
        if (pts >= 6) {
          match = "high";
          rec = "High-risk upper GI bleed (Score ≥ 6). Inpatient admission, IV PPI bolus + infusion, crossmatch PRBCs, and prompt upper endoscopy.";
        } else if (pts >= 2) {
          match = "inpatient";
          rec = "Intermediate risk. Inpatient admission and endoscopic evaluation within 24 hours.";
        }

        return {
          value: "Glasgow-Blatchford Score: " + pts + " Points",
          matchId: match,
          eq: rec
        };
      }
    },

    // ==============================================================
    // 22. ALVARADO SCORE FOR ACUTE APPENDICITIS
    // ==============================================================
    {
      id: "alvaradoScore",
      cat: "emicu",
      type: "class",
      name: "Alvarado Score for Acute Appendicitis (MANTRELS)",
      desc: "Clinical risk scoring tool stratifying likelihood of acute appendicitis in emergency patients with abdominal pain.",
      organ: "Appendix / Gastrointestinal",
      region: "Adult Emergency / General Surgery",
      subject: "Emergency General Surgery / Abdominal Pain",
      keywords: ["alvarado", "mantrels", "appendicitis", "rlq pain", "right lower quadrant", "leukocytosis", "emergency"],
      guidance: "1. MANTRELS mnemonic: Migration of pain (1), Anorexia (1), Nausea/vomiting (1), Tenderness in RLQ (2), Rebound tenderness (1), Elevated temperature (1), Leukocytosis >10,000 (2), Shift to left/neutrophilia (1).\n2. Max score = 10 points.\n3. Score ≤ 4: Appendicitis unlikely; safe for discharge with return precautions.\n4. Score 5–6: Equivocal; observe or obtain CT/ultrasound.\n5. Score ≥ 7: High probability; surgical consultation for appendectomy.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "A practical score for the early diagnosis of acute appendicitis",
          citation: "Alvarado A. Ann Emerg Med. 1986;15(5):557-564.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/3963537/" }
          ]
        }
      ],
      fields: [
        makeS("migr", "1. Migration of pain to RLQ", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("anorexia", "2. Anorexia (loss of appetite)", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("nausea", "3. Nausea or vomiting", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("rlqTend", "4. Tenderness in Right Lower Quadrant (RLQ)", "2", [["0", "No (0 pts)"], ["2", "Yes (+2 pts)"]]),
        makeS("rebound", "5. Rebound tenderness in RLQ", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("fever", "6. Elevated temperature (≥ 37.3°C / 99.1°F)", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("leuko", "7. Leukocytosis (WBC > 10,000 cells/µL)", "2", [["0", "No (0 pts)"], ["2", "Yes (+2 pts)"]]),
        makeS("shift", "8. Left shift of neutrophils (> 75% bands/segs)", "1", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]])
      ],
      table: {
        headers: ["Alvarado Score", "Probability", "Clinical Status", "Recommended Surgical Approach"],
        rows: [
          { id: "low", cols: ["Score 1 – 4", "Low (~ 5%)", "Appendicitis Unlikely", "Discharge with return instructions if symptoms worsen"] },
          { id: "equivocal", cols: ["Score 5 – 6", "Intermediate (~ 30% – 50%)", "Equivocal / Indeterminate", "Abdominal ultrasound / contrast CT scan; serial surgical exams"] },
          { id: "high", cols: ["Score 7 – 10", "High (> 75% – 90%)", "Appendicitis Likely", "General surgery consultation for laparoscopic appendectomy"] }
        ]
      },
      calc: function (v) {
        var total = +v.migr + +v.anorexia + +v.nausea + +v.rlqTend + +v.rebound + +v.fever + +v.leuko + +v.shift;
        var match = "low", title = "Appendicitis Unlikely (Score " + total + ")", plan = "Evaluate for alternative diagnoses. Safe for outpatient discharge with 24-hour return precautions.";

        if (total >= 7) {
          match = "high";
          title = "High Likelihood of Appendicitis (Score " + total + ")";
          plan = "High risk of acute appendicitis. Urgent general surgical consultation for appendectomy. Keep NPO and administer IV fluids and antibiotics.";
        } else if (total >= 5) {
          match = "equivocal";
          title = "Equivocal Appendicitis (Score " + total + ")";
          plan = "Intermediate likelihood. Perform abdominal ultrasound (or contrast CT in adults). Serial abdominal examinations.";
        }

        return {
          value: "Alvarado Score: " + total + " / 10 Points (" + title + ")",
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 23. PARKLAND BURN RESUSCITATION FORMULA
    // ==============================================================
    {
      id: "parklandFormula",
      cat: "emicu",
      type: "calc",
      name: "Parkland Formula for Burn Resuscitation",
      desc: "Calculates total 24-hour crystalloid resuscitation fluid volume for major 2nd and 3rd degree burns.",
      organ: "Skin / Microvasculature / Extracellular Fluid",
      region: "Adult Emergency / Burn Unit / Resuscitation",
      subject: "Trauma / Burn Resuscitation",
      keywords: ["parkland", "burns", "resuscitation", "tbsa", "lactated ringers", "crystalloids", "burn shock"],
      guidance: "1. Parkland Formula: Total 24h Fluid = 4 mL × Weight (kg) × %TBSA (2nd and 3rd degree burns only; exclude superficial 1st degree erythema).\n2. Timing: Half of the total volume is given in the first 8 hours FROM THE TIME OF INJURY (not arrival), and remaining half over the next 16 hours.\n3. Resuscitation fluid: Lactated Ringer's (or Plasma-Lyte).\n4. Titrate hourly to target urine output: 0.5 mL/kg/h in adults (1.0–1.5 mL/kg/h in children).",
      contraindications: "Formula is only an initial starting guide; titrate dynamically to hourly urine output to avoid fluid creep and abdominal compartment syndrome.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Fluid resuscitation in burn injuries",
          citation: "Baxter CR. Clin Plast Surg. 1974;1(4):693-703.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/4619728/" }
          ]
        }
      ],
      fields: [
        makeN("weight", "Patient Weight (kg)", 70, { min: 10, max: 200, step: 1 }),
        makeN("tbsa", "Total Body Surface Area (% TBSA, 2nd & 3rd degree)", 30, { min: 1, max: 100, step: 1 })
      ],
      calc: function (v) {
        var wt = +v.weight, tbsa = +v.tbsa;
        var totalMl = 4 * wt * tbsa;
        var first8h = Math.round(totalMl / 2);
        var next16h = totalMl - first8h;
        var rate1st8 = Math.round(first8h / 8);
        var rateNext16 = Math.round(next16h / 16);

        return {
          value: "Total 24h Volume: " + totalMl + " mL Lactated Ringer's",
          eq: "Parkland Calculation (4 mL × " + wt + " kg × " + tbsa + "% TBSA):\n" +
              "• First 8 Hours (from time of burn): " + first8h + " mL (Rate: ~" + rate1st8 + " mL/hr)\n" +
              "• Remaining 16 Hours: " + next16h + " mL (Rate: ~" + rateNext16 + " mL/hr)\n" +
              "• Urine Output Target: Titrate fluid rate to maintain 0.5 mL/kg/hr (" + Math.round(wt * 0.5) + " mL/hr in this patient)."
        };
      }
    },

    // ==============================================================
    // 24. SURVIVING SEPSIS 1-HOUR BUNDLE
    // ==============================================================
    {
      id: "sepsis1HourBundle",
      cat: "emicu",
      type: "class",
      name: "Surviving Sepsis Campaign (SSC) 1-Hour Bundle",
      desc: "Checklist of 5 mandatory time-critical resuscitation elements to be executed within 60 minutes of sepsis identification.",
      organ: "Systemic Vasculature / Immune / Endothelium",
      region: "Emergency / Adult ICU / Resuscitation",
      subject: "Critical Care / Sepsis Resuscitation",
      keywords: ["sepsis", "bundle", "surviving sepsis", "lactate", "blood cultures", "antibiotics", "crystalloids", "vasopressors"],
      guidance: "1. Measure blood lactate level; remeasure if initial lactate > 2 mmol/L.\n2. Obtain blood cultures PRIOR to antibiotics (do not delay antibiotics >45 min if cultures difficult).\n3. Administer broad-spectrum IV antimicrobials within 1 hour.\n4. Rapidly administer 30 mL/kg balanced crystalloids for hypotension (MAP < 65) or lactate ≥ 4 mmol/L.\n5. Apply vasopressors (Norepinephrine first-line) during or after fluid resuscitation to maintain MAP ≥ 65 mmHg.",
      contraindications: "In congestive heart failure or end-stage renal disease, administer crystalloid aliquots with frequent dynamic volume responsiveness reassessments.",
      literature: [
        {
          type: "Official Consensus Guidelines",
          icon: "📘",
          title: "Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021",
          citation: "Evans L, Rhodes A, Alhazzani W, et al. Crit Care Med. 2021;49(11):e1063-e1143.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/34605781/" }
          ]
        }
      ],
      fields: [
        makeS("lactate", "1. Blood Lactate Measured within 1 hour?", "1", [["1", "Yes: Drawn (Target: remeasure if > 2.0)"], ["0", "No"]]),
        makeS("bcx", "2. Blood Cultures Obtained prior to antibiotics?", "1", [["1", "Yes: 2 sets drawn before antibiotics"], ["0", "No"]]),
        makeS("abx", "3. Broad-Spectrum IV Antibiotics administered within 1 hour?", "1", [["1", "Yes: Antibiotics infused"], ["0", "No"]]),
        makeS("fluid", "4. 30 mL/kg Crystalloid Bolus started for MAP < 65 or Lactate ≥ 4?", "1", [["1", "Yes: 30 mL/kg initiated"], ["0", "No (or not indicated)"]]),
        makeS("pressors", "5. Vasopressors (Norepinephrine) started to maintain MAP ≥ 65?", "1", [["1", "Yes: Pressors active if needed"], ["0", "No"]])
      ],
      table: {
        headers: ["Bundle Compliance", "Time Target", "Completed Elements", "Clinical Outcome Impact"],
        rows: [
          { id: "complete", cols: ["100% Complete (5/5)", "< 60 minutes", "All 5 core interventions executed", "Significant reduction in hospital mortality and ICU length of stay"] },
          { id: "incomplete", cols: ["Incomplete (< 5/5)", "< 60 minutes", "Missing ≥1 critical step", "Every hour delay in antibiotic administration increases mortality by ~7.6%"] }
        ]
      },
      calc: function (v) {
        var count = +v.lactate + +v.bcx + +v.abx + +v.fluid + +v.pressors;
        var isAll = count === 5;
        var match = isAll ? "complete" : "incomplete";

        return {
          value: isAll ? "SURVIVING SEPSIS BUNDLE COMPLETE (5/5)" : "BUNDLE INCOMPLETE (" + count + "/5 Elements Met)",
          matchId: match,
          eq: isAll
            ? "All 5 resuscitation targets met within 1 hour. Continue serial lactate monitoring every 2–4 hours until normalized."
            : "Missing key bundle components. Expedite broad-spectrum IV antibiotics, blood cultures, and 30 mL/kg crystalloids stat."
        };
      }
    },

    // ==============================================================
    // 25. CANADIAN CT HEAD RULE (CCHR)
    // ==============================================================
    {
      id: "canadianCtHead",
      cat: "emicu",
      type: "class",
      name: "Canadian CT Head Rule (CCHR)",
      desc: "Clinical decision rule guiding non-contrast CT head imaging in acute minor blunt head injury (GCS 13–15).",
      organ: "Brain / Cranium",
      region: "Adult Emergency / Trauma",
      subject: "Emergency Neurotrauma / Head CT",
      keywords: ["cchr", "canadian ct head", "head injury", "tbi", "ct head", "concussion", "trauma"],
      guidance: "1. Applies to adult patients with blunt head trauma within 24 hours with loss of consciousness, amnesia, or confusion, and GCS 13–15.\n2. High-Risk Criteria (Requires CT to rule out neurosurgical lesion):\n   - GCS < 15 at 2 hours post-injury\n   - Suspected open or depressed skull fracture\n   - Signs of basilar skull fracture (hemotympanum, raccoon eyes, Battle's sign, CSF leak)\n   - ≥ 2 episodes of vomiting\n   - Age ≥ 65 years.\n3. Medium-Risk Criteria (CT to rule out brain injury on CT):\n   - Retrograde amnesia > 30 minutes\n   - Dangerous mechanism (pedestrian struck, ejected from MV, fall > 3 feet / 5 stairs).",
      contraindications: "Do not apply if age < 16, bleeding disorder/anticoagulant use, or obvious penetrating skull injury.",
      literature: [
        {
          type: "Seminal Multicenter Study",
          icon: "📄",
          title: "The Canadian CT Head Rule for patients with minor head injury",
          citation: "Stiell IG, Wells GA, Vandemheen K, et al. Lancet. 2001;357(9266):1391-1396.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/11356436/" }
          ]
        }
      ],
      fields: [
        makeS("highRisk", "High Risk: GCS < 15 at 2h, Skull/Basilar Fracture signs, ≥2 Vomiting, or Age ≥ 65?", "0", [
          ["0", "No high-risk criteria present"],
          ["1", "Yes: ≥1 High-risk criterion present"]
        ]),
        makeS("medRisk", "Medium Risk: Amnesia > 30 min before impact OR Dangerous Mechanism?", "0", [
          ["0", "No medium-risk criteria present"],
          ["1", "Yes: ≥1 Medium-risk criterion present"]
        ])
      ],
      table: {
        headers: ["CCHR Status", "Neurosurgical Lesion Risk", "CT Head Indication", "Action Pathway"],
        rows: [
          { id: "cleared", cols: ["CCHR Cleared (Rule Negative)", "< 0.1%", "No Head CT Required", "100% sensitivity for neurosurgical intervention; safe for discharge home"] },
          { id: "medium", cols: ["Medium Risk Positive", "~ 8% – 10% (clinically important TBI)", "CT Head Indicated", "Obtain non-contrast head CT to rule out contusion/subdural hematoma"] },
          { id: "high", cols: ["HIGH RISK POSITIVE", "~ 15% – 20% (neurosurgical lesion)", "EMERGENT CT HEAD MANDATORY", "Perform non-contrast CT head stat; notify neurosurgery if positive"] }
        ]
      },
      calc: function (v) {
        var isHigh = v.highRisk === "1";
        var isMed = v.medRisk === "1";

        var match = "cleared", title = "CCHR Negative: No CT Head Indicated", plan = "Patient meets all low-risk criteria. Sensitivity for neurosurgical lesion is 100%. Safe for observation and discharge home.";

        if (isHigh) {
          match = "high";
          title = "HIGH RISK: Non-Contrast CT Head Mandated";
          plan = "Patient satisfies high-risk Canadian CT Head Rule criterion. Urgent non-contrast head CT indicated stat to rule out neurosurgical lesion.";
        } else if (isMed) {
          match = "medium";
          title = "Medium Risk: CT Head Indicated";
          plan = "Patient satisfies medium-risk criterion (dangerous mechanism or prolonged retrograde amnesia). Non-contrast CT head recommended.";
        }

        return {
          value: title,
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 26. CANADIAN C-SPINE RULE (CCR)
    // ==============================================================
    {
      id: "canadianCSpine",
      cat: "emicu",
      type: "class",
      name: "Canadian C-Spine Rule (CCR)",
      desc: "Clinical decision rule to determine the need for cervical spine radiography/CT in alert trauma patients.",
      organ: "Cervical Spine / Spinal Cord",
      region: "Adult Emergency / Trauma",
      subject: "Emergency Spine Trauma / C-Spine Clearance",
      keywords: ["ccr", "canadian c-spine", "c-spine", "cervical spine", "xray", "trauma", "clearance"],
      guidance: "1. Step 1: Any High-Risk Factor (Age ≥ 65, Dangerous mechanism, or Paresthesias in extremities)? If YES, imaging required.\n2. Step 2: Any Low-Risk Factor allowing safe range of motion assessment (Simple rear-end MVC, Sitting in ED, Ambulatory at any time, Delayed onset neck pain, Absence of midline C-spine tenderness)? If NO, imaging required.\n3. Step 3: Able to actively rotate neck 45° left and right? If NO, imaging required; if YES, C-spine cleared clinically without radiographs.",
      contraindications: "Not applicable if GCS < 15, age < 16, non-trauma, unstable vitals, or acute paralysis.",
      literature: [
        {
          type: "Seminal Multicenter Study",
          icon: "📄",
          title: "The Canadian C-spine rule for radiography in alert and stable trauma patients",
          citation: "Stiell IG, Wells GA, Vandemheen KL, et al. JAMA. 2001;286(15):1841-1848.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/11597285/" }
          ]
        }
      ],
      fields: [
        makeS("highRisk", "1. High-Risk Factor Present (Age ≥ 65, Dangerous Mechanism, Paresthesias)?", "0", [
          ["0", "None present"],
          ["1", "Yes: Age ≥ 65, dangerous mechanism, or extremity paresthesias"]
        ]),
        makeS("lowRisk", "2. Low-Risk Factor Present (Rear-end MVC, Sitting, Ambulatory, Delayed pain, No midline pain)?", "1", [
          ["1", "Yes: ≥1 Low-risk factor present allowing ROM testing"],
          ["0", "No: No low-risk factors present"]
        ]),
        makeS("rom", "3. Able to actively rotate neck 45 degrees left and right?", "1", [
          ["1", "Yes: Can rotate 45° left and right"],
          ["0", "No: Cannot rotate 45° left and right"]
        ])
      ],
      table: {
        headers: ["CCR Assessment", "Fracture Sensitivity", "C-Spine Clearance", "Recommended Action"],
        rows: [
          { id: "cleared", cols: ["CCR CLEARED", "100%", "Clinically Cleared", "Remove rigid cervical collar; no cervical spine X-rays or CT required"] },
          { id: "imaging", cols: ["CCR POSITIVE", "100%", "Imaging Required", "Maintain strict cervical collar immobilization; obtain CT cervical spine"] }
        ]
      },
      calc: function (v) {
        var needImaging = v.highRisk === "1" || v.lowRisk === "0" || v.rom === "0";
        var match = needImaging ? "imaging" : "cleared";
        var verdict = needImaging ? "C-Spine Imaging Indicated (CT C-Spine)" : "C-SPINE CLEARED: No Imaging Required";
        var plan = needImaging
          ? "Patient fails Canadian C-Spine criteria. Maintain cervical immobilization and order helical CT of cervical spine from occiput to T1."
          : "Patient safely cleared by Canadian C-Spine Rule (100% sensitivity for clinically important C-spine fracture). Cervical collar may be removed safely.";

        return {
          value: verdict,
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 27. ABC SCORE FOR MASSIVE TRANSFUSION PROTOCOL (MTP)
    // ==============================================================
    {
      id: "abcMtpScore",
      cat: "emicu",
      type: "class",
      name: "ABC Score for Massive Transfusion",
      desc: "Rapid 4-variable bedside score to predict need for Massive Transfusion Protocol (MTP) in trauma.",
      organ: "Circulation / Spleen / Liver / Pelvis",
      region: "Adult Emergency / Trauma Resuscitation",
      subject: "Trauma Resuscitation / Massive Hemorrhage",
      keywords: ["abc score", "massive transfusion", "mtp", "trauma", "fast", "shock", "prbc", "hemorrhage"],
      guidance: "1. 4 variables (1 point each):\n   - Penetrating mechanism (1 pt)\n   - Systolic BP ≤ 90 mmHg (1 pt)\n   - Heart rate ≥ 120 bpm (1 pt)\n   - Positive FAST ultrasound examination (1 pt).\n2. ABC Score ≥ 2 triggers emergent activation of the Massive Transfusion Protocol (1:1:1 PRBC:FFP:Platelets).",
      contraindications: "Clinical gestalt of exsanguinating hemorrhage always supersedes scoring; activate MTP immediately if severe bleeding is manifest.",
      literature: [
        {
          type: "Seminal Validation",
          icon: "📄",
          title: "The Assessment of Blood Consumption score: a simple score for predicting the need for massive transfusion",
          citation: "Nunez TC, Voskresensky IV, Dossett LA, et al. J Trauma. 2009;66(2):346-352.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/19202422/" }
          ]
        }
      ],
      fields: [
        makeS("penetrating", "1. Penetrating Trauma Mechanism", "0", [["0", "Blunt trauma (0 pts)"], ["1", "Penetrating trauma (+1 pt)"]]),
        makeS("hypotension", "2. Systolic Blood Pressure ≤ 90 mmHg in ED", "1", [["0", "SBP > 90 mmHg (0 pts)"], ["1", "SBP ≤ 90 mmHg (+1 pt)"]]),
        makeS("tachycardia", "3. Heart Rate ≥ 120 beats/min in ED", "1", [["0", "HR < 120 bpm (0 pts)"], ["1", "HR ≥ 120 bpm (+1 pt)"]]),
        makeS("fast", "4. Positive FAST Ultrasound (free fluid)", "1", [["0", "Negative FAST (0 pts)"], ["1", "Positive FAST (+1 pt)"]])
      ],
      table: {
        headers: ["ABC Score", "MTP Requirement Odds", "Protocol Status", "Resuscitation Action"],
        rows: [
          { id: "low", cols: ["Score 0 – 1", "< 10%", "MTP Not Indicated", "Type and screen, selective blood transfusion as guided by hemodynamics"] },
          { id: "trigger", cols: ["Score ≥ 2", "> 75% – 85%", "ACTIVATE MASSIVE TRANSFUSION PROTOCOL", "Trigger MTP cooler 1 (1:1:1 balanced ratio), give Tranexamic Acid (TXA 1g IV stat)"] }
        ]
      },
      calc: function (v) {
        var pts = +v.penetrating + +v.hypotension + +v.tachycardia + +v.fast;
        var trigger = pts >= 2;
        var match = trigger ? "trigger" : "low";
        var title = trigger ? "ACTIVATE MASSIVE TRANSFUSION PROTOCOL (Score ≥ 2)" : "Low Probability of MTP (Score < 2)";
        var plan = trigger
          ? "CRITICAL: Score is " + pts + "/4. Activate Massive Transfusion Protocol immediately. Administer balanced 1:1:1 blood products (PRBCs, FFP, Platelets). Give Tranexamic Acid (TXA) 1g IV over 10 min (CRASH-2 trial); warm all fluids."
          : "Score is " + pts + "/4. Low likelihood of requiring >10 units PRBCs. Continue focused resuscitation and re-evaluate if vitals deteriorate.";

        return {
          value: "ABC Score: " + pts + " / 4 (" + title + ")",
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 28. SERUM ANION GAP & DELTA-DELTA GAP (Δ/Δ)
    // ==============================================================
    {
      id: "anionGapDelta",
      cat: "emicu",
      type: "calc",
      name: "Serum Anion Gap & Delta-Delta Gap (Δ/Δ)",
      desc: "Calculates serum Anion Gap and Delta Gap to diagnose mixed high anion gap, normal anion gap, and metabolic alkalosis.",
      organ: "Kidneys / Blood Chemistry",
      region: "Adult ICU / Emergency Medicine",
      subject: "Acid-Base / Critical Care Toxicology",
      keywords: ["anion gap", "delta delta", "delta gap", "hagma", "nagma", "dka", "toxicology", "metabolic acidosis"],
      guidance: "1. Anion Gap (AG) = Na − (Cl + HCO3). Normal is ~10–12 mEq/L.\n2. Albumin correction: Corrected AG = Measured AG + 2.5 × (4.0 − Albumin g/dL).\n3. Delta Ratio (ΔAG / ΔHCO3) = (AG − 12) ÷ (24 − HCO3):\n   - Ratio < 0.4: Pure normal anion gap metabolic acidosis (NAGMA).\n   - Ratio 0.4 to 0.8: Mixed HAGMA + NAGMA.\n   - Ratio 0.8 to 2.0: Pure High Anion Gap Metabolic Acidosis (HAGMA; e.g., DKA, lactic acidosis).\n   - Ratio > 2.0: Mixed HAGMA + Metabolic Alkalosis (or pre-existing compensated respiratory acidosis).",
      literature: [
        {
          type: "Seminal Review",
          icon: "📄",
          title: "The delta anion gap/delta HCO3- ratio in acid-base analysis",
          citation: "Wrenn K. Ann Emerg Med. 1990;19(11):1310-1313.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/2240728/" }
          ]
        }
      ],
      fields: [
        makeN("na", "Serum Sodium (Na, mEq/L)", 138, { min: 100, max: 180, step: 1 }),
        makeN("cl", "Serum Chloride (Cl, mEq/L)", 98, { min: 60, max: 140, step: 1 }),
        makeN("hco3", "Serum Bicarbonate (HCO3, mEq/L)", 12, { min: 2, max: 50, step: 1 }),
        makeN("alb", "Serum Albumin (g/dL)", 4.0, { min: 1.0, max: 6.0, step: 0.1 })
      ],
      calc: function (v) {
        var na = +v.na, cl = +v.cl, hco3 = +v.hco3, alb = +v.alb;
        var ag = na - (cl + hco3);
        var correctedAg = ag + (2.5 * (4.0 - alb));
        var deltaAg = correctedAg - 12;
        var deltaHco3 = 24 - hco3;

        var deltaRatio = deltaHco3 > 0 ? (deltaAg / deltaHco3).toFixed(2) : "N/A";
        var diag = "";

        if (correctedAg > 12) {
          if (deltaHco3 <= 0) {
            diag = "HAGMA with co-existing Metabolic Alkalosis (Elevated HCO3).";
          } else {
            var r = +deltaRatio;
            if (r < 0.8) diag = "Mixed High Anion Gap (HAGMA) AND Normal Anion Gap (NAGMA) Acidosis.";
            else if (r <= 2.0) diag = "Pure High Anion Gap Metabolic Acidosis (HAGMA).";
            else diag = "Mixed HAGMA with concurrent Metabolic Alkalosis (or chronic respiratory acidosis compensation).";
          }
        } else {
          diag = hco3 < 24 ? "Pure Normal Anion Gap Metabolic Acidosis (NAGMA / Hyperchloremic Acidosis)." : "Normal Anion Gap profile.";
        }

        return {
          value: "Anion Gap: " + Math.round(correctedAg) + " mEq/L (Ratio: " + deltaRatio + ")",
          eq: "Calculation: AG = " + na + " − (" + cl + " + " + hco3 + ") = " + ag + " mEq/L (Corrected for Albumin: " + correctedAg.toFixed(1) + " mEq/L).\n" +
              "Delta Ratio = ΔAG (" + deltaAg.toFixed(1) + ") ÷ ΔHCO3 (" + deltaHco3.toFixed(1) + ") = " + deltaRatio + ".\nInterpretation: " + diag
        };
      }
    },

    // ==============================================================
    // 29. RUMACK-MATTHEW NOMOGRAM (ACETAMINOPHEN OVERDOSE)
    // ==============================================================
    {
      id: "rumackMatthew",
      cat: "emicu",
      type: "calc",
      name: "Rumack–Matthew Nomogram (Acetaminophen Toxicity)",
      desc: "Determines hepatotoxicity risk and dictates N-acetylcysteine (NAC) therapy following single acute acetaminophen ingestion.",
      organ: "Liver / Hepatocytes",
      region: "Adult Emergency / Medical Toxicology",
      subject: "Clinical Toxicology / Paracetamol Overdose",
      keywords: ["rumack", "matthew", "acetaminophen", "paracetamol", "nac", "acetylcysteine", "hepatotoxicity", "toxicology"],
      guidance: "1. Only applies to single acute ingestions presenting between 4 and 24 hours post-ingestion.\n2. Obtain 4-hour serum acetaminophen concentration in mcg/mL (or µmol/L).\n3. Treatment Line starts at 150 mcg/mL at 4 hours and halves every 4 hours.\n4. If level is ON or ABOVE the treatment line, initiate intravenous N-acetylcysteine (NAC) immediately.",
      contraindications: "Does NOT apply to chronic supratherapeutic ingestions, staggered doses, extended-release formulations, or presentations >24 hours post-ingestion.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Acetaminophen poisoning and toxicity",
          citation: "Rumack BH, Matthew H. Pediatrics. 1975;55(6):871-876.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/1134886/" }
          ]
        }
      ],
      fields: [
        makeN("hours", "Hours Post-Ingestion (4 to 24 hours)", 4, { min: 4, max: 24, step: 0.5 }),
        makeN("level", "Serum Acetaminophen Concentration (mcg/mL)", 165, { min: 1, max: 1000, step: 1 })
      ],
      table: {
        headers: ["Hours Post-Ingestion", "150-Line Threshold (mcg/mL)", "Hepatotoxicity Risk", "Clinical Action"],
        rows: [
          { id: "h4", cols: ["4 Hours", "150 mcg/mL (990 µmol/L)", "Evaluated dynamically", "Start IV N-acetylcysteine if above line"] },
          { id: "h8", cols: ["8 Hours", "75 mcg/mL (495 µmol/L)", "Evaluated dynamically", "Start IV N-acetylcysteine if above line"] },
          { id: "h12", cols: ["12 Hours", "37.5 mcg/mL (248 µmol/L)", "Evaluated dynamically", "Start IV N-acetylcysteine if above line"] },
          { id: "h16", cols: ["16 Hours", "18.8 mcg/mL (124 µmol/L)", "Evaluated dynamically", "Start IV N-acetylcysteine if above line"] }
        ]
      },
      calc: function (v) {
        var h = +v.hours, lvl = +v.level;
        // Rumack-Matthew 150 line equation: Threshold = 150 * (0.5)^((h - 4)/4)
        var threshold = 150 * Math.pow(0.5, (h - 4) / 4);
        var isToxic = lvl >= threshold;

        var verdict = isToxic ? "TREATMENT WITH NAC INDICATED (Level Above Line)" : "Level Below Treatment Line (Low Risk)";
        var plan = isToxic
          ? "CRITICAL: Level of " + lvl + " mcg/mL at " + h + " hours exceeds the 150-line threshold (" + threshold.toFixed(1) + " mcg/mL). Initiate IV N-acetylcysteine (NAC 3-bag or simplified 2-bag protocol) immediately. Monitor ALT/AST and INR."
          : "Level of " + lvl + " mcg/mL is below treatment threshold (" + threshold.toFixed(1) + " mcg/mL). Hepatotoxicity is highly unlikely. NAC is not routinely indicated for single acute ingestion.";

        return {
          value: verdict,
          matchId: "h4",
          eq: "Treatment Threshold at " + h + " hours = " + threshold.toFixed(1) + " mcg/mL.\n" + plan
        };
      }
    },

    // ==============================================================
    // 30. APACHE II MORTALITY SCORE
    // ==============================================================
    {
      id: "apache2Score",
      cat: "emicu",
      type: "calc",
      name: "APACHE II Severity & Mortality Score",
      desc: "Acute Physiology and Chronic Health Evaluation II benchmarked during the first 24 hours of ICU admission.",
      organ: "Multi-Organ Systemic",
      region: "Adult ICU / Prognostication",
      subject: "Critical Care / ICU Severity Scoring",
      keywords: ["apache", "apache ii", "icu mortality", "acute physiology", "severity score", "critical care"],
      guidance: "1. Calculated from worst physiological values during the first 24 hours of ICU admission.\n2. Acute Physiology Score (12 physiological variables: Temp, MAP, HR, RR, Oxygenation, arterial pH, Na, K, Creatinine, Hematocrit, WBC, GCS).\n3. Age points: 44 or less = 0, 45–54 = 2, 55–64 = 3, 65–74 = 5, ≥ 75 = 6.\n4. Chronic health points: Severe organ insufficiency or immunocompromised = 5 (non-operative/emergency) or 2 (elective).",
      contraindications: "Does not account for subsequent therapeutic interventions or length of stay beyond day 1.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "APACHE II: a severity of disease classification system",
          citation: "Knaus WA, Draper EA, Wagner DP, Zimmerman JE. Crit Care Med. 1985;13(10):818-829.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/3928249/" }
          ]
        }
      ],
      fields: [
        makeN("aps", "Acute Physiology Score (sum of 12 variables, 0 to 60)", 16, { min: 0, max: 60, step: 1 }),
        makeS("agePts", "Patient Age Group", "3", [
          ["0", "≤ 44 years (0 pts)"],
          ["2", "45 to 54 years (+2 pts)"],
          ["3", "55 to 64 years (+3 pts)"],
          ["5", "65 to 74 years (+5 pts)"],
          ["6", "≥ 75 years (+6 pts)"]
        ]),
        makeS("chronic", "Severe Chronic Health Insufficiency (Cirrhosis, NYHA IV, COPD, Immunocompromised)", "0", [
          ["0", "None (0 pts)"],
          ["2", "Elective postoperative patient (+2 pts)"],
          ["5", "Non-operative OR emergency postoperative patient (+5 pts)"]
        ])
      ],
      table: {
        headers: ["APACHE II Total Score", "Estimated ICU Mortality", "Risk Stratification"],
        rows: [
          { id: "a1", cols: ["0 – 9 Points", "~ 3% – 5%", "Low Severity"] },
          { id: "a2", cols: ["10 – 19 Points", "~ 15% – 25%", "Moderate Severity"] },
          { id: "a3", cols: ["20 – 29 Points", "~ 40% – 55%", "High Severity"] },
          { id: "a4", cols: ["≥ 30 Points", "~ 75% – > 85%", "Extreme Severity / Very High Mortality"] }
        ]
      },
      calc: function (v) {
        var total = +v.aps + +v.agePts + +v.chronic;
        var mort = "<5%", match = "a1";

        if (total >= 30) { mort = ">75% to 85%"; match = "a4"; }
        else if (total >= 20) { mort = "40% to 55%"; match = "a3"; }
        else if (total >= 10) { mort = "15% to 25%"; match = "a2"; }

        return {
          value: "APACHE II Score: " + total + " Points (Mortality: " + mort + ")",
          matchId: match,
          eq: "Components: Acute Physiology (" + v.aps + ") + Age Points (" + v.agePts + ") + Chronic Health (" + v.chronic + ") = " + total + " Points.\nEstimated in-hospital mortality probability: " + mort + "."
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
      if (window.categories[i] && window.categories[i].id === emIcuCategory.id) {
        catExists = true;
        break;
      }
    }
    if (!catExists) {
      window.categories.push(emIcuCategory);
    }

    // 2. Safely add tools
    emIcuTools.forEach(function (tool) {
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

    // 3. Extend search synonym map for HTML search bar
    if (typeof window.SYNONYM_MAP === "object" && window.SYNONYM_MAP !== null) {
      window.SYNONYM_MAP["emicu"] = ["emicu", "emergency", "critical care", "icu", "pediatrics", "picu", "pals", "resuscitation", "shock", "trauma"];
      window.SYNONYM_MAP["pediatric"] = ["pediatric", "peds", "pat", "pecarn", "croup", "westley", "palicc", "pards", "kocher", "ett", "airway", "picu", "pem"];
      window.SYNONYM_MAP["trauma"] = ["trauma", "cchr", "canadian ct head", "canadian c-spine", "ccr", "gcs", "gcs-p", "abc score", "mtp", "massive transfusion", "parkland", "burns"];
      window.SYNONYM_MAP["icu"] = ["icu", "sofa", "delta sofa", "sepsis", "berlin", "ards", "rsbi", "rox", "driving pressure", "rass", "cam-icu", "delirium", "kdigo", "aki", "apache"];
      window.SYNONYM_MAP["cardiology"] = ["heart score", "chest pain", "troponin", "mace", "acs", "vis", "vasoactive", "shock"];
      window.SYNONYM_MAP["pulmonary"] = ["wells", "pe", "perc", "pulmonary embolism", "d-dimer", "ards", "rsbi", "rox", "hfnc"];
      window.SYNONYM_MAP["neuro"] = ["gcs", "gcs-p", "nihss", "stroke", "cchr", "pecarn", "cam-icu", "rass", "tbi"];
      window.SYNONYM_MAP["toxicology"] = ["rumack", "acetaminophen", "paracetamol", "nac", "anion gap", "delta gap", "hagma", "tox"];
    }

    // 4. Force repaint if the HTML engine has already initialized
    if (typeof window.renderHome === "function") {
      window.renderHome();
    }
  } catch (err) {
    console.error("Critical error registering Emergency & Critical Care tools:", err);
  }
})();
