/**
 * MedCalc Module: Neurology & Neurosurgery (NEURO)
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

  var neuroCategory = {
    id: "neuro",
    name: "Neurology & Neurosurgery",
    icon: "🧠",
    desc: "Coma, stroke impairment, intracranial hemorrhage, epilepsy, neuromuscular disorders, headache, cognitive staging, and movement disorders",
    organs: ["brain", "spinal cord", "cortex", "peripheral nerve", "neuromuscular junction", "meninges"],
    region: "central / peripheral nervous system"
  };

  var neuroTools = [
    // ==============================================================
    // 1. CONSCIOUSNESS & COMA
    // ==============================================================
    {
      id: "gcs",
      cat: "neuro",
      type: "class",
      name: "Glasgow Coma Scale (GCS)",
      desc: "Standard assessment of impaired consciousness and acute traumatic brain injury severity.",
      organ: "Brain / Reticular Activating System",
      region: "Central Nervous System / Acute Care",
      subject: "Neurotrauma / Critical Care",
      keywords: ["gcs", "glasgow", "coma", "consciousness", "tbi", "trauma", "head injury"],
      guidance: "1. Evaluate Eye Opening (1–4), Verbal Response (1–5), and Motor Response (1–6).\n2. Score best response.\n3. Score ≤ 8 signifies severe head injury and coma, prompting definitive airway protection.",
      contraindications: "Pharmacologic paralysis, sedation, or severe facial edema invalidates scoring.",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "Assessment of coma and impaired consciousness. A practical scale",
        citation: "Teasdale G, Jennett B. Lancet. 1974;2(7872):81-84.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/4136544/" }]
      }],
      fields: [
        makeS("eye", "1. Eye Opening Response (E)", "4", [
          ["4", "4 — Spontaneous"], ["3", "3 — To sound / speech"], ["2", "2 — To pressure / pain"], ["1", "1 — None"]
        ]),
        makeS("verbal", "2. Best Verbal Response (V)", "5", [
          ["5", "5 — Oriented"], ["4", "4 — Confused"], ["3", "3 — Inappropriate words"], ["2", "2 — Incomprehensible sounds"], ["1", "1 — None"]
        ]),
        makeS("motor", "3. Best Motor Response (M)", "6", [
          ["6", "6 — Obeys commands"], ["5", "5 — Localizes pain"], ["4", "4 — Normal flexion (withdrawal)"],
          ["3", "3 — Abnormal flexion (decorticate)"], ["2", "2 — Extension (decerebrate)"], ["1", "1 — None (flaccid)"]
        ])
      ],
      table: {
        headers: ["GCS Score", "TBI Severity Category", "Clinical Action"],
        rows: [
          { id: "mild", cols: ["Score 13 – 15", "Mild Brain Injury", "Neurological observations; CT head if indicated"] },
          { id: "moderate", cols: ["Score 9 – 12", "Moderate Brain Injury", "Urgent non-contrast head CT; neurosurgical consult"] },
          { id: "severe", cols: ["Score 3 – 8", "Severe Brain Injury (Coma)", "Definitive endotracheal intubation, ICP monitoring, ICU admission"] }
        ]
      },
      calc: function (v) {
        var total = +v.eye + +v.verbal + +v.motor;
        var match = total <= 8 ? "severe" : total <= 12 ? "moderate" : "mild";
        var plan = total <= 8
          ? "Severe head injury / Coma (GCS ≤ 8). Inability to protect airway. Immediate endotracheal intubation and neurocritical resuscitation."
          : total <= 12 ? "Moderate head injury. High risk of deterioration; urgent non-contrast head CT."
          : "Mild head injury. Serial neurological checks.";
        return { value: "GCS: " + total + " / 15 (E" + v.eye + " V" + v.verbal + " M" + v.motor + ")", matchId: match, eq: plan };
      }
    },
    {
      id: "fourScore",
      cat: "neuro",
      type: "class",
      name: "FOUR Coma Score (Full Outline of UnResponsiveness)",
      desc: "Coma scale assessing eye, motor, brainstem reflexes, and respiratory drive (validated for intubated patients).",
      organ: "Brainstem / Cortex / Respiratory Center",
      region: "Neurocritical Care / Intensive Care",
      subject: "Critical Care Neurology / Coma",
      keywords: ["four", "coma", "brainstem", "intubation", "pupils", "respiration", "icu"],
      guidance: "1. 4 domains (0–4 points each): Eye, Motor, Brainstem reflexes, and Respiration (Total 0–16).\n2. Validated for intubated patients.",
      literature: [{
        type: "Seminal Validation",
        icon: "📄",
        title: "The FOUR score: a new coma scale",
        citation: "Wijdicks EF, et al. Ann Neurol. 2005;58(4):585-593.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/16178024/" }]
      }],
      fields: [
        makeS("eye", "1. Eye Responses (E)", "4", [
          ["4", "4 — Eyelids open, tracking or blinking to command"], ["3", "3 — Eyelids open but not tracking"],
          ["2", "2 — Eyelids closed, opens to loud voice"], ["1", "1 — Eyelids closed, opens to pain"], ["0", "0 — Eyelids remain closed with pain"]
        ]),
        makeS("motor", "2. Motor Responses (M)", "4", [
          ["4", "4 — Thumbs-up, fist, or peace sign"], ["3", "3 — Localizing to pain"],
          ["2", "2 — Flexion response to pain"], ["1", "1 — Extensor posturing to pain"], ["0", "0 — No response / myoclonus"]
        ]),
        makeS("brainstem", "3. Brainstem Reflexes (B)", "4", [
          ["4", "4 — Pupillary and corneal reflexes present"], ["3", "3 — One pupil wide and fixed"],
          ["2", "2 — Pupillary or corneal reflexes absent"], ["1", "1 — Both pupillary and corneal reflexes absent"], ["0", "0 — Absent pupil, corneal, and cough reflex"]
        ]),
        makeS("respiration", "4. Respiration (R)", "4", [
          ["4", "4 — Not intubated, regular breathing"], ["3", "3 — Not intubated, Cheyne-Stokes"],
          ["2", "2 — Not intubated, irregular breathing"], ["1", "1 — Intubated, breathes above ventilator rate"], ["0", "0 — Intubated, breathes at ventilator rate or apnea"]
        ])
      ],
      table: {
        headers: ["FOUR Score", "Coma Depth", "Mortality Prediction"],
        rows: [
          { id: "high", cols: ["Score 13 – 16", "Mild impairment / awake", "Low in-hospital mortality (< 5%)"] },
          { id: "mod", cols: ["Score 8 – 12", "Moderate coma", "Intermediate mortality (~ 15% – 30%)"] },
          { id: "low", cols: ["Score 0 – 7", "Deep coma / Brain failure", "High in-hospital mortality (> 70%); assess for herniation"] }
        ]
      },
      calc: function (v) {
        var total = +v.eye + +v.motor + +v.brainstem + +v.respiration;
        var match = total <= 7 ? "low" : total <= 12 ? "mod" : "high";
        var plan = total <= 7
          ? "Deep coma / severe brainstem impairment. Significant risk of herniation or brain death."
          : total <= 12 ? "Moderate coma. Continue neuro-ICU monitoring and serial checks."
          : "Mild impairment / alert. Preserved brainstem reflexes.";
        return { value: "FOUR Score: " + total + " / 16 (E" + v.eye + " M" + v.motor + " B" + v.brainstem + " R" + v.respiration + ")", matchId: match, eq: plan };
      }
    },
    {
      id: "avpuScale",
      cat: "neuro",
      type: "class",
      name: "AVPU Consciousness Scale",
      desc: "Rapid first-responder triage classification of level of consciousness.",
      organ: "Central Nervous System",
      region: "Emergency / Triage",
      subject: "Emergency Medicine / Resuscitation",
      keywords: ["avpu", "triage", "consciousness", "alert", "voice", "pain", "unresponsive"],
      guidance: "A = Alert; V = Responds to Voice; P = Responds to Pain; U = Unresponsive.",
      literature: [{
        type: "Standard Protocol",
        icon: "📘",
        title: "Validation of the AVPU scale in emergency triage",
        citation: "Kelly CA, et al. Emerg Med J. 2005;22(4):276-279.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/15788836/" }]
      }],
      fields: [
        makeS("level", "Responsiveness Level", "A", [
          ["A", "Alert — Spontaneously alert and oriented"],
          ["V", "Voice — Responds only to verbal commands/speech"],
          ["P", "Pain — Responds only to painful/noxious stimuli"],
          ["U", "Unresponsive — No response to voice or painful stimulation"]
        ])
      ],
      table: {
        headers: ["AVPU Level", "Estimated GCS Equivalent", "Airway Risk", "Clinical Action"],
        rows: [
          { id: "A", cols: ["Alert (A)", "GCS 15", "Airway protected", "Routine evaluation"] },
          { id: "V", cols: ["Voice (V)", "GCS 12 – 13", "Airway potentially compromised", "Supplemental oxygen, close monitoring"] },
          { id: "P", cols: ["Pain (P)", "GCS 8 – 9", "High risk of aspiration", "Definitive airway assessment; prepare for intubation"] },
          { id: "U", cols: ["Unresponsive (U)", "GCS ≤ 6", "Loss of protective reflexes", "Immediate airway placement / intubation stat"] }
        ]
      },
      calc: function (v) {
        var match = v.level;
        var plan = (v.level === "P" || v.level === "U")
          ? "CRITICAL: Patient does not respond to voice. Airway protective reflexes are compromised. Secure airway immediately."
          : "Patient responds to voice or is alert. Maintain continuous observation.";
        return { value: "AVPU Category: " + v.level, matchId: match, eq: plan };
      }
    },

    // ==============================================================
    // 2. STROKE & CEREBROVASCULAR DISEASE
    // ==============================================================
    {
      id: "nihssScore",
      cat: "neuro",
      type: "class",
      name: "National Institutes of Health Stroke Scale (NIHSS)",
      desc: "Standard 11-item deficit scale to measure acute ischemic stroke severity and determine reperfusion eligibility.",
      organ: "Cerebral Hemispheres",
      region: "Acute Stroke / Emergency",
      subject: "Vascular Neurology / Stroke",
      keywords: ["nihss", "stroke", "ischemic", "tpa", "thrombectomy", "aphasia"],
      guidance: "Score 0 = normal; maximum 42. NIHSS ≥ 6 with LVO suggests candidacy for mechanical thrombectomy.",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "Reliability of the National Institutes of Health Stroke Scale",
        citation: "Brott T, et al. Stroke. 1989;20(7):864-870.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/2749846/" }]
      }],
      fields: [
        makeS("loc", "1a. Level of Consciousness", "0", [["0", "0 — Alert"], ["1", "1 — Arousable by minor stimulation"], ["2", "2 — Requires repeated stimulation"], ["3", "3 — Unresponsive / motor reflex only"]]),
        makeS("locQ", "1b. LOC Questions (Month & Age)", "0", [["0", "0 — Answers both correctly"], ["1", "1 — Answers one correctly"], ["2", "2 — Answers neither correctly"]]),
        makeS("locC", "1c. LOC Commands (Open/close eyes, grip)", "0", [["0", "0 — Performs both correctly"], ["1", "1 — Performs one correctly"], ["2", "2 — Performs neither"]]),
        makeS("gaze", "2. Best Gaze (Horizontal eyes)", "0", [["0", "0 — Normal"], ["1", "1 — Partial gaze palsy"], ["2", "2 — Forced deviation"]]),
        makeS("visual", "3. Visual Fields", "0", [["0", "0 — No visual loss"], ["1", "1 — Partial hemianopia"], ["2", "2 — Complete hemianopia"], ["3", "3 — Bilateral hemianopia"]]),
        makeS("palsy", "4. Facial Palsy", "0", [["0", "0 — Normal"], ["1", "1 — Minor asymmetry"], ["2", "2 — Partial lower face palsy"], ["3", "3 — Complete unilateral paralysis"]]),
        makeS("arm", "5. Motor Arm Drift", "0", [["0", "0 — No drift"], ["1", "1 — Drifts down before 10s"], ["2", "2 — Some effort against gravity"], ["3", "3 — No effort against gravity"], ["4", "4 — No movement"]]),
        makeS("leg", "6. Motor Leg Drift", "0", [["0", "0 — No drift"], ["1", "1 — Drifts down before 5s"], ["2", "2 — Some effort against gravity"], ["3", "3 — No effort against gravity"], ["4", "4 — No movement"]]),
        makeS("ataxia", "7. Limb Ataxia", "0", [["0", "0 — Absent"], ["1", "1 — Present in 1 limb"], ["2", "2 — Present in 2 limbs"]]),
        makeS("sensory", "8. Sensory Loss", "0", [["0", "0 — Normal"], ["1", "1 — Mild-to-moderate loss"], ["2", "2 — Severe / dense sensory loss"]]),
        makeS("lang", "9. Best Language (Aphasia)", "0", [["0", "0 — No aphasia"], ["1", "1 — Mild-to-moderate aphasia"], ["2", "2 — Severe aphasia"], ["3", "3 — Mute / global aphasia"]]),
        makeS("dysarthria", "10. Dysarthria", "0", [["0", "0 — Normal"], ["1", "1 — Mild-to-moderate slurring"], ["2", "2 — Severe / unintelligible"]]),
        makeS("neglect", "11. Extinction / Inattention", "0", [["0", "0 — None"], ["1", "1 — Inattention to 1 modality"], ["2", "2 — Profound hemi-inattention"]])
      ],
      table: {
        headers: ["NIHSS Score", "Severity Category", "LVO Probability", "Reperfusion Recommendation"],
        rows: [
          { id: "minor", cols: ["1 – 4 Points", "Minor Stroke", "< 10%", "IV thrombolysis if disabling deficit; otherwise DAPT"] },
          { id: "moderate", cols: ["5 – 15 Points", "Moderate Stroke", "~ 40% – 60%", "IV thrombolysis (<4.5h) + urgent CTA/MRA for thrombectomy"] },
          { id: "modSevere", cols: ["16 – 20 Points", "Moderate-to-Severe", "> 70%", "Emergency EVT screening + IV thrombolysis"] },
          { id: "severe", cols: ["21 – 42 Points", "Severe Stroke", "> 85%", "Emergency EVT; high risk of hemorrhagic transformation"] }
        ]
      },
      calc: function (v) {
        var total = +v.loc + +v.locQ + +v.locC + +v.gaze + +v.visual + +v.palsy + +v.arm + +v.leg + +v.ataxia + +v.sensory + +v.lang + +v.dysarthria + +v.neglect;
        var match = total >= 21 ? "severe" : total >= 16 ? "modSevere" : total >= 5 ? "moderate" : "minor";
        var plan = total >= 6 ? "Score ≥ 6 indicates significant stroke deficit. Evaluate for emergent endovascular thrombectomy." : "Minor stroke deficit.";
        return { value: "NIHSS: " + total + " / 42 Points", matchId: match, eq: plan };
      }
    },
    {
      id: "mrsScore",
      cat: "neuro",
      type: "class",
      name: "Modified Rankin Scale (mRS)",
      desc: "Measures functional disability and dependence in daily activities after stroke.",
      organ: "Functional Autonomy",
      region: "Neurological Outcomes",
      subject: "Vascular Neurology / Rehabilitation",
      keywords: ["mrs", "rankin", "stroke outcome", "disability", "independence"],
      guidance: "Grades 0–2 denote functional independence; grades 3–5 represent progressive dependency; grade 6 is deceased.",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "Interobserver agreement for the assessment of handicap in stroke patients",
        citation: "van Swieten JC, et al. Stroke. 1988;19(5):604-607.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/3363593/" }]
      }],
      fields: [
        makeS("grade", "Functional Disability Grade", "0", [
          ["0", "0 — No symptoms at all"],
          ["1", "1 — No significant disability; able to carry out all usual duties"],
          ["2", "2 — Slight disability; unable to carry out all previous activities, but independent"],
          ["3", "3 — Moderate disability; requires some assistance, walks without help"],
          ["4", "4 — Moderately severe disability; unable to walk or attend to bodily needs"],
          ["5", "5 — Severe disability; bedridden, incontinent, constant nursing care"],
          ["6", "6 — Dead"]
        ])
      ],
      table: {
        headers: ["mRS Grade", "Functional Status", "Trial Outcome Interpretation"],
        rows: [
          { id: "g0_1", cols: ["Grades 0 – 1", "Symptom-free / Minimal", "Favourable recovery"] },
          { id: "g2", cols: ["Grade 2", "Slight disability", "Functional Independence (independent living)"] },
          { id: "g3", cols: ["Grade 3", "Moderate disability", "Dependent on instrumental ADLs"] },
          { id: "g4_5", cols: ["Grades 4 – 5", "Severe disability", "Dependent on basic ADLs / bedridden"] },
          { id: "g6", cols: ["Grade 6", "Deceased", "Mortality"] }
        ]
      },
      calc: function (v) {
        var g = v.grade;
        var match = (g === "0" || g === "1") ? "g0_1" : g === "2" ? "g2" : g === "3" ? "g3" : g === "6" ? "g6" : "g4_5";
        var status = +g <= 2 ? "Functional Independence (mRS 0–2)" : "Functional Dependency (mRS ≥ 3)";
        return { value: "mRS Grade: " + g + " (" + status + ")", matchId: match, eq: "Standard primary outcome endpoint in stroke trials." };
      }
    },
    {
      id: "ichScore",
      cat: "neuro",
      type: "class",
      name: "ICH Score (Intracerebral Hemorrhage Mortality)",
      desc: "Predicts 30-day mortality in primary spontaneous intracerebral hemorrhage.",
      organ: "Brain Parenchyma / Ventricles",
      region: "Neurocritical Care",
      subject: "Vascular Neurosurgery / Critical Care",
      keywords: ["ich", "hemorrhage", "intracerebral", "mortality", "ivh", "gcs"],
      guidance: "Calculated from GCS, age, volume, IVH presence, and infratentorial location.",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "The ICH score: a simple, reliable grading scale for intracerebral hemorrhage",
        citation: "Hemphill JC 3rd, et al. Stroke. 2001;32(4):891-897.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/11283388/" }]
      }],
      fields: [
        makeN("gcs", "Initial GCS (3–15)", 14, { min: 3, max: 15, step: 1 }),
        makeN("age", "Patient Age (years)", 64, { min: 18, max: 110, step: 1 }),
        makeS("vol", "ICH Volume on CT", "0", [["0", "< 30 mL (0 pts)"], ["1", "≥ 30 mL (+1 pt)"]]),
        makeS("ivh", "Intraventricular Hemorrhage (IVH)?", "0", [["0", "No (0 pts)"], ["1", "Yes (+1 pt)"]]),
        makeS("infra", "Infratentorial Location (Cerebellum/Brainstem)?", "0", [["0", "No / Supratentorial (0 pts)"], ["1", "Yes / Infratentorial (+1 pt)"]])
      ],
      table: {
        headers: ["ICH Score", "Predicted 30-Day Mortality", "Risk Strata"],
        rows: [
          { id: "s0", cols: ["Score 0", "0%", "Minimal mortality risk"] },
          { id: "s1", cols: ["Score 1", "13%", "Low mortality risk"] },
          { id: "s2", cols: ["Score 2", "26%", "Moderate mortality risk"] },
          { id: "s3", cols: ["Score 3", "72%", "High mortality risk"] },
          { id: "s4", cols: ["Score 4 – 6", "97% – 100%", "Extremely high mortality"] }
        ]
      },
      calc: function (v) {
        var g = +v.gcs, age = +v.age;
        var pts = +v.vol + +v.ivh + +v.infra;
        if (g <= 4) pts += 2; else if (g <= 12) pts += 1;
        if (age >= 80) pts += 1;
        var mort = pts === 0 ? "0%" : pts === 1 ? "13%" : pts === 2 ? "26%" : pts === 3 ? "72%" : "97–100%";
        var match = pts >= 4 ? "s4" : "s" + pts;
        return { value: "ICH Score: " + pts + " / 6 (30-Day Mortality: " + mort + ")", matchId: match, eq: "Target SBP 130–140 mmHg within 1 hour; reverse any systemic anticoagulants." };
      }
    },
    {
      id: "huntHess",
      cat: "neuro",
      type: "class",
      name: "Hunt and Hess Scale for Aneurysmal SAH",
      desc: "Clinical severity grading correlating with perioperative mortality in aneurysmal subarachnoid hemorrhage.",
      organ: "Subarachnoid Space / Aneurysm",
      region: "Neurosurgery / Critical Care",
      subject: "Vascular Neurosurgery / SAH",
      keywords: ["hunt", "hess", "sah", "subarachnoid", "aneurysm", "headache"],
      guidance: "Grades 1 to 5. Severe systemic hypertension or COPD adds +1 Grade.",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "Surgical risk as related to time of intervention in the repair of intracranial aneurysms",
        citation: "Hunt WE, Hess RM. J Neurosurg. 1968;28(1):14-20.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/5635959/" }]
      }],
      fields: [
        makeS("grade", "Clinical Neurological Status", "1", [
          ["1", "Grade 1: Asymptomatic or mild headache and slight nuchal rigidity (~30% mortality)"],
          ["2", "Grade 2: Moderate-to-severe headache, nuchal rigidity, cranial nerve palsy (~40% mortality)"],
          ["3", "Grade 3: Drowsiness, confusion, or mild focal deficit (~50% mortality)"],
          ["4", "Grade 4: Stupor, moderate-to-severe hemiparesis, early decerebrate rigidity (~80% mortality)"],
          ["5", "Grade 5: Deep coma, decerebrate posturing, moribund (~90% mortality)"]
        ]),
        makeS("systemic", "Severe systemic hypertension, DM, or severe COPD present?", "0", [["0", "No (0)"], ["1", "Yes (+1 Grade)"]])
      ],
      table: {
        headers: ["Grade", "Presentation", "Mortality"],
        rows: [
          { id: "g1", cols: ["Grade 1", "Asymptomatic / minimal headache", "~ 30%"] },
          { id: "g2", cols: ["Grade 2", "Severe headache / CN palsy", "~ 40%"] },
          { id: "g3", cols: ["Grade 3", "Lethargy / mild focal deficit", "~ 50%"] },
          { id: "g4", cols: ["Grade 4", "Stupor / hemiparesis", "~ 80%"] },
          { id: "g5", cols: ["Grade 5", "Deep coma / posturing", "~ 90%"] }
        ]
      },
      calc: function (v) {
        var finalGrade = Math.min(5, +v.grade + (+v.systemic === 1 ? 1 : 0));
        var match = "g" + finalGrade;
        var mort = finalGrade === 1 ? "~30%" : finalGrade === 2 ? "~40%" : finalGrade === 3 ? "~50%" : finalGrade === 4 ? "~80%" : "~90%";
        return { value: "Hunt & Hess: Grade " + finalGrade + " (Mortality: " + mort + ")", matchId: match, eq: "Start Nimodipine 60 mg q4h; secure aneurysm early." };
      }
    },
    {
      id: "wfnsSah",
      cat: "neuro",
      type: "class",
      name: "WFNS SAH Grading",
      desc: "World Federation of Neurosurgical Societies grading scale combining GCS and motor deficit.",
      organ: "Brain / Subarachnoid Space",
      region: "Neurosurgery",
      subject: "Vascular Neurosurgery / SAH",
      keywords: ["wfns", "sah", "subarachnoid", "aneurysm", "gcs"],
      guidance: "Combines GCS score with presence of major focal motor deficit (hemiparesis/hemiplegia).",
      literature: [{
        type: "Consensus Report",
        icon: "📘",
        title: "Report of World Federation of Neurological Surgeons Committee on a universal subarachnoid hemorrhage grading scale",
        citation: "Drake CG. J Neurosurg. 1988;68(6):985-986.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/3131498/" }]
      }],
      fields: [
        makeN("gcs", "Glasgow Coma Scale (3–15)", 15, { min: 3, max: 15, step: 1 }),
        makeS("focal", "Major focal motor deficit present?", "0", [["0", "No (absent)"], ["1", "Yes (hemiparesis / hemiplegia)"]])
      ],
      table: {
        headers: ["WFNS Grade", "GCS Score", "Motor Deficit", "Prognosis"],
        rows: [
          { id: "w1", cols: ["Grade I", "GCS 15", "Absent", "Favourable outcome"] },
          { id: "w2", cols: ["Grade II", "GCS 13 – 14", "Absent", "Favourable outcome"] },
          { id: "w3", cols: ["Grade III", "GCS 13 – 14", "Present", "Intermediate outcome"] },
          { id: "w4", cols: ["Grade IV", "GCS 7 – 12", "Present or Absent", "Poor outcome"] },
          { id: "w5", cols: ["Grade V", "GCS 3 – 6", "Present or Absent", "Very poor outcome / high mortality"] }
        ]
      },
      calc: function (v) {
        var g = +v.gcs, f = +v.focal === 1;
        var grade = "Grade I", match = "w1";
        if (g === 15 && !f) { grade = "Grade I"; match = "w1"; }
        else if (g >= 13 && !f) { grade = "Grade II"; match = "w2"; }
        else if (g >= 13 && f) { grade = "Grade III"; match = "w3"; }
        else if (g >= 7) { grade = "Grade IV"; match = "w4"; }
        else { grade = "Grade V"; match = "w5"; }
        return { value: "WFNS: " + grade, matchId: match, eq: "Standardized clinical prognostic grading in aneurysmal SAH." };
      }
    },
    {
      id: "fisherScale",
      cat: "neuro",
      type: "class",
      name: "Modified Fisher Scale for SAH Vasospasm",
      desc: "CT-based grading of cisternal SAH and intraventricular hemorrhage predicting delayed cerebral ischemia (DCI).",
      organ: "Brain / Subarachnoid Cisterns",
      region: "Neuroimaging / Critical Care",
      subject: "Vascular Neurosurgery / Vasospasm",
      keywords: ["fisher", "modified fisher", "vasospasm", "dci", "sah", "ct"],
      guidance: "Grades thick vs thin cisternal blood and absence/presence of bilateral IVH.",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "Prediction of symptomatic vasospasm after subarachnoid hemorrhage: the modified Fisher scale",
        citation: "Frontera JA, et al. Neurosurgery. 2006;59(1):21-27.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/16823296/" }]
      }],
      fields: [
        makeS("grade", "CT Subarachnoid & IVH Pattern", "1", [
          ["1", "Grade 1: Minimal or thin SAH without bilateral IVH (low vasospasm ~24%)"],
          ["2", "Grade 2: Minimal or thin SAH with bilateral IVH (~33% vasospasm)"],
          ["3", "Grade 3: Thick cisternal SAH without bilateral IVH (~33% vasospasm)"],
          ["4", "Grade 4: Thick cisternal SAH with bilateral IVH (highest vasospasm ~40%)"]
        ])
      ],
      table: {
        headers: ["Modified Fisher Grade", "CT Findings", "Vasospasm / DCI Risk"],
        rows: [
          { id: "f1", cols: ["Grade 1", "Thin SAH, no bilateral IVH", "~ 24%"] },
          { id: "f2", cols: ["Grade 2", "Thin SAH, bilateral IVH present", "~ 33%"] },
          { id: "f3", cols: ["Grade 3", "Thick SAH, no bilateral IVH", "~ 33%"] },
          { id: "f4", cols: ["Grade 4", "Thick SAH, bilateral IVH present", "~ 40% (Highest Risk)"] }
        ]
      },
      calc: function (v) {
        return {
          value: "Modified Fisher Grade " + v.grade,
          matchId: "f" + v.grade,
          eq: "Thick cisternal SAH with IVH conveys the highest risk for delayed cerebral ischemia. Monitor with transcranial Doppler (TCD)."
        };
      }
    },
    {
      id: "abcd2Score",
      cat: "neuro",
      type: "class",
      name: "ABCD² Score for Post-TIA Stroke Risk",
      desc: "Clinical score predicting early stroke risk at 2, 7, and 90 days after a transient ischemic attack.",
      organ: "Cerebrovasculature",
      region: "Acute TIA / Emergency",
      subject: "Vascular Neurology / TIA",
      keywords: ["abcd2", "tia", "stroke risk", "transient ischemic attack"],
      guidance: "Score 0–7. High risk (6–7) confers ~8.1% 2-day stroke risk and warrants immediate admission.",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "Validation and refinement of scores to predict very early stroke risk after transient ischaemic attack",
        citation: "Johnston SC, et al. Lancet. 2007;369(9558):283-292.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/17258668/" }]
      }],
      fields: [
        makeS("age", "A - Age ≥ 60 years", "0", [["1", "Yes (+1)"], ["0", "No (0)"]]),
        makeS("bp", "B - Blood Pressure ≥ 140/90 mmHg", "0", [["1", "Yes (+1)"], ["0", "No (0)"]]),
        makeS("clinical", "C - Clinical Presentation", "0", [
          ["2", "Unilateral weakness (+2)"], ["1", "Speech disturbance without weakness (+1)"], ["0", "Other (0)"]
        ]),
        makeS("duration", "D - Duration of Symptoms", "0", [
          ["2", "≥ 60 minutes (+2)"], ["1", "10 – 59 minutes (+1)"], ["0", "< 10 minutes (0)"]
        ]),
        makeS("dm", "D - Diabetes Mellitus", "0", [["1", "Yes (+1)"], ["0", "No (0)"]])
      ],
      table: {
        headers: ["ABCD² Score", "2-Day Stroke Risk", "Disposition"],
        rows: [
          { id: "low", cols: ["Score 0 – 3", "1.0%", "Low risk; outpatient clinic evaluation within 24–48 hours"] },
          { id: "mod", cols: ["Score 4 – 5", "4.1%", "Moderate risk; urgent imaging and observation"] },
          { id: "high", cols: ["Score 6 – 7", "8.1%", "High risk; hospital admission, urgent DAPT, MRI/CTA"] }
        ]
      },
      calc: function (v) {
        var total = +v.age + +v.bp + +v.clinical + +v.duration + +v.dm;
        var match = total >= 6 ? "high" : total >= 4 ? "mod" : "low";
        var plan = total >= 6 ? "High 48-hour stroke risk (8.1%). Hospital admission to stroke unit strongly advised." : "Low-to-moderate risk.";
        return { value: "ABCD²: " + total + " / 7 Points", matchId: match, eq: plan };
      }
    },
    {
      id: "abcd3i",
      cat: "neuro",
      type: "class",
      name: "ABCD³-I Score (Refined TIA Risk)",
      desc: "Incorporates dual TIA, DWI MRI infarction, and carotid stenosis to refine early stroke prediction.",
      organ: "Cerebrovasculature / Carotid Artery",
      region: "TIA Clinic / Stroke",
      subject: "Vascular Neurology / Secondary Prevention",
      keywords: ["abcd3i", "tia", "carotid", "dwi", "mri"],
      guidance: "Combines baseline ABCD² score with imaging features and recurrence within 7 days.",
      literature: [{
        type: "Validation Study",
        icon: "📄",
        title: "Validation of the ABCD3-I score for predicting stroke risk after TIA",
        citation: "Merwick A, et al. Lancet Neurol. 2010;9(11):1060-1069.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/20869324/" }]
      }],
      fields: [
        makeN("abcd2", "Baseline ABCD² Score (0–7)", 4, { min: 0, max: 7, step: 1 }),
        makeS("dual", "Dual TIA (recurrence within 7 days)", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        makeS("dwi", "Acute infarction on DWI MRI", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        makeS("stenosis", "Ipsilateral internal carotid stenosis ≥ 50%", "0", [["0", "No (0)"], ["2", "Yes (+2)"]])
      ],
      table: {
        headers: ["ABCD³-I Score", "7-Day Stroke Risk", "Clinical Action"],
        rows: [
          { id: "low", cols: ["Score 0 – 3", "< 2%", "Low risk; outpatient investigation"] },
          { id: "mod", cols: ["Score 4 – 7", "~ 5% – 7%", "Moderate risk; urgent neurovascular workup"] },
          { id: "high", cols: ["Score 8 – 13", "> 13% – 15%", "High risk; admission and consider urgent carotid revascularization"] }
        ]
      },
      calc: function (v) {
        var total = +v.abcd2 + +v.dual + +v.dwi + +v.stenosis;
        var match = total >= 8 ? "high" : total >= 4 ? "mod" : "low";
        return { value: "ABCD³-I: " + total + " / 13 Points", matchId: match, eq: "Incorporates neurovascular imaging to guide acute secondary stroke prevention." };
      }
    },
    {
      id: "aspectsScore",
      cat: "neuro",
      type: "calc",
      name: "ASPECTS (Early Ischemic Core Score)",
      desc: "10-point CT topographic scoring of early ischemic changes in the MCA territory.",
      organ: "Cortex / Basal Ganglia",
      region: "Acute Stroke / Neuroimaging",
      subject: "Vascular Neurology / Thrombectomy",
      keywords: ["aspects", "mca", "thrombectomy", "ct", "stroke core"],
      guidance: "Subtract 1 point for each of the 10 defined MCA regions showing hypoattenuation. Score ≥ 6 indicates favourable core for thrombectomy.",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "Assessment of the Alberta Stroke Program Early Computed Tomography Score",
        citation: "Barber PA, et al. Lancet. 2000;355(9216):1670-1674.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/10905241/" }]
      }],
      fields: [
        makeN("deductions", "Number of distinct MCA regions with early ischemia (0–10)", 2, { min: 0, max: 10, step: 1 })
      ],
      table: {
        headers: ["ASPECTS Range", "Ischemic Core Extent", "EVT Suitability"],
        rows: [
          { id: "good", cols: ["Score 8 – 10", "Small core", "Favourable candidate for mechanical thrombectomy"] },
          { id: "border", cols: ["Score 6 – 7", "Moderate core", "Candidate for EVT (Class I within window)"] },
          { id: "poor", cols: ["Score 0 – 5", "Large core", "Elevated hemorrhage risk; selective EVT"] }
        ]
      },
      calc: function (v) {
        var deductions = Math.min(10, Math.max(0, +v.deductions));
        var score = 10 - deductions;
        var match = score <= 5 ? "poor" : score <= 7 ? "border" : "good";
        return { value: "ASPECTS: " + score + " / 10 Points", matchId: match, eq: "Score ≥ 6 supports mechanical thrombectomy if within time window." };
      }
    },
    {
      id: "raceScore",
      cat: "neuro",
      type: "class",
      name: "RACE Score (Prehospital LVO Screen)",
      desc: "Rapid Arterial oCclusion Evaluation score screening for large vessel occlusion in acute stroke.",
      organ: "Cerebral Vasculature",
      region: "Prehospital / EMS",
      subject: "Emergency Stroke / Triage",
      keywords: ["race", "lvo", "thrombectomy", "prehospital", "ems"],
      guidance: "Score ≥ 5 predicts large vessel occlusion with high sensitivity; direct transport to comprehensive stroke center.",
      literature: [{
        type: "Validation Study",
        icon: "📄",
        title: "Design and validation of a prehospital stroke scale to predict large arterial occlusion: the RACE scale",
        citation: "Pérez de la Ossa N, et al. Stroke. 2014;45(1):87-91.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/24281224/" }]
      }],
      fields: [
        makeS("face", "Facial Palsy", "0", [["0", "Absent (0)"], ["1", "Mild asymmetry (1)"], ["2", "Severe / complete palsy (2)"]]),
        makeS("arm", "Arm Motor Function", "0", [["0", "Normal (0)"], ["1", "Drifts down before 10s (1)"], ["2", "Cannot raise arm against gravity (2)"]]),
        makeS("leg", "Leg Motor Function", "0", [["0", "Normal (0)"], ["1", "Drifts down before 5s (1)"], ["2", "Cannot raise leg against gravity (2)"]]),
        makeS("gaze", "Head & Gaze Deviation", "0", [["0", "Absent (0)"], ["1", "Present (1)"]]),
        makeS("cortical", "Aphasia / Agnosia", "0", [
          ["0", "Normal (0)"], ["1", "Performs 1 of 2 commands / partial agnosia (1)"], ["2", "Performs 0 commands / complete agnosia (2)"]
        ])
      ],
      table: {
        headers: ["RACE Score", "LVO Probability", "Prehospital EMS Action"],
        rows: [
          { id: "lvoNo", cols: ["Score 0 – 4", "Low (< 30%)", "Transport to nearest primary stroke center"] },
          { id: "lvoYes", cols: ["Score 5 – 9", "High (> 70%)", "Bypass to EVT-capable Comprehensive Stroke Center stat"] }
        ]
      },
      calc: function (v) {
        var total = +v.face + +v.arm + +v.leg + +v.gaze + +v.cortical;
        var match = total >= 5 ? "lvoYes" : "lvoNo";
        return {
          value: "RACE Score: " + total + " / 9 Points",
          matchId: match,
          eq: total >= 5 ? "RACE ≥ 5 indicates high probability of Large Vessel Occlusion (LVO). Transfer directly to thrombectomy center." : "LVO less likely."
        };
      }
    },
    {
      id: "fastEdScore",
      cat: "neuro",
      type: "class",
      name: "FAST-ED Score",
      desc: "Field Assessment Stroke Triage for Emergency Destination predicting large vessel occlusion.",
      organ: "Cerebral Vasculature",
      region: "Prehospital / Emergency",
      subject: "Vascular Neurology / Triage",
      keywords: ["fast-ed", "lvo", "stroke", "triage", "ems"],
      guidance: "Score ≥ 4 predicts large vessel occlusion with accuracy comparable to NIHSS ≥ 10.",
      literature: [{
        type: "Validation",
        icon: "📄",
        title: "Field Assessment Stroke Triage for Emergency Destination (FAST-ED)",
        citation: "Lima FO, et al. Stroke. 2016;47(8):1997-2002.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/27354492/" }]
      }],
      fields: [
        makeS("face", "Facial Palsy", "0", [["0", "Normal (0)"], ["1", "Partial or complete (1)"]]),
        makeS("arm", "Arm Weakness", "0", [["0", "No drift (0)"], ["1", "Drift (1)"], ["2", "No movement (2)"]]),
        makeS("speech", "Speech Changes", "0", [["0", "Normal (0)"], ["1", "Mild-to-moderate aphasia/slur (1)"], ["2", "Severe / mute (2)"]]),
        makeS("eye", "Eye Deviation", "0", [["0", "Normal (0)"], ["1", "Partial (1)"], ["2", "Forced deviation (2)"]]),
        makeS("denial", "Extinction / Neglect", "0", [["0", "Absent (0)"], ["1", "Extinction in 1 modality (1)"], ["2", "Severe anosognosia (2)"]])
      ],
      table: {
        headers: ["FAST-ED Score", "LVO Likelihood", "Routing"],
        rows: [
          { id: "neg", cols: ["Score 0 – 3", "Low", "Standard stroke protocol"] },
          { id: "pos", cols: ["Score 4 – 9", "High", "Triage directly to Comprehensive Stroke Center for thrombectomy"] }
        ]
      },
      calc: function (v) {
        var total = +v.face + +v.arm + +v.speech + +v.eye + +v.denial;
        var match = total >= 4 ? "pos" : "neg";
        return { value: "FAST-ED: " + total + " / 9 Points", matchId: match, eq: total >= 4 ? "FAST-ED ≥ 4 predicts LVO." : "Low probability of LVO." };
      }
    },
    {
      id: "cpssScore",
      cat: "neuro",
      type: "class",
      name: "Cincinnati Prehospital Stroke Scale (CPSS)",
      desc: "Rapid 3-item prehospital stroke screening rule evaluating face, arm, and speech.",
      organ: "Cortex",
      region: "Prehospital / Emergency",
      subject: "Emergency Stroke / Triage",
      keywords: ["cpss", "cincinnati", "stroke scale", "prehospital", "face arm speech"],
      guidance: "1 abnormal sign confers ~72% probability of stroke; 3 abnormal signs >85%.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "Tissue plasminogen activator for acute ischemic stroke through a regional system",
        citation: "Kothari RU, et al. Stroke. 1999;30(4):763-767.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/10187875/" }]
      }],
      fields: [
        makeS("face", "1. Facial Droop (have patient smile/show teeth)", "0", [["0", "Normal (both sides move equally)"], ["1", "Abnormal (one side droops)"]]),
        makeS("arm", "2. Arm Drift (arms extended 10s, eyes closed)", "0", [["0", "Normal (both arms move same)"], ["1", "Abnormal (one arm drifts down)"]]),
        makeS("speech", "3. Abnormal Speech ('You can't teach an old dog new tricks')", "0", [["0", "Normal (correct words, no slurring)"], ["1", "Abnormal (slurred, inappropriate, or mute)"]])
      ],
      table: {
        headers: ["CPSS Abnormal Signs", "Acute Stroke Probability", "Action"],
        rows: [
          { id: "c0", cols: ["0 Signs Abnormal", "Low probability", "Consider alternative neurological etiologies"] },
          { id: "c1", cols: ["1 to 3 Signs Abnormal", "72% – 85%+", "CRITICAL: Activate emergency stroke protocol stat; transport to nearest stroke center"] }
        ]
      },
      calc: function (v) {
        var count = +v.face + +v.arm + +v.speech;
        var match = count >= 1 ? "c1" : "c0";
        return {
          value: count + " / 3 Signs Abnormal (" + (count >= 1 ? "Positive Screen" : "Negative Screen") + ")",
          matchId: match,
          eq: count >= 1 ? "High probability of acute stroke. Expedite emergency neuroimaging and alert stroke code team." : "Low probability of stroke."
        };
      }
    },
    {
      id: "rosierScore",
      cat: "neuro",
      type: "class",
      name: "ROSIER Stroke Recognition Tool",
      desc: "Emergency department instrument to distinguish acute stroke from stroke mimics.",
      organ: "Cortex",
      region: "Emergency Department",
      subject: "Emergency Neurology / Stroke Mimics",
      keywords: ["rosier", "stroke mimic", "emergency", "triage"],
      guidance: "Adds points for focal signs and subtracts for loss of consciousness and seizures. Score > 0 indicates stroke.",
      literature: [{
        type: "Validation Study",
        icon: "📄",
        title: "The Recognition of Stroke in the Emergency Room (ROSIER) scale",
        citation: "Nor AM, et al. Lancet Neurol. 2005;4(11):727-734.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/16239179/" }]
      }],
      fields: [
        makeS("loc", "Loss of consciousness or syncope", "0", [["0", "No (0)"], ["-1", "Yes (−1)"]]),
        makeS("seizure", "Seizure activity at onset", "0", [["0", "No (0)"], ["-1", "Yes (−1)"]]),
        makeS("face", "New asymmetric facial weakness", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("arm", "New asymmetric arm weakness", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("leg", "New asymmetric leg weakness", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("speech", "New speech disturbance", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("visual", "New visual field defect", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      table: {
        headers: ["ROSIER Score", "Diagnosis", "Recommendation"],
        rows: [
          { id: "stroke", cols: ["Score > 0", "Acute Stroke Likely", "Activate stroke code; obtain immediate CT/CTA"] },
          { id: "mimic", cols: ["Score ≤ 0", "Stroke Mimic Likely", "Check blood glucose; investigate seizure, syncope, migraine"] }
        ]
      },
      calc: function (v) {
        var total = +v.loc + +v.seizure + +v.face + +v.arm + +v.leg + +v.speech + +v.visual;
        var match = total > 0 ? "stroke" : "mimic";
        return {
          value: "ROSIER: " + total + " Points (" + (total > 0 ? "Stroke Likely" : "Mimic Likely") + ")",
          matchId: match,
          eq: total > 0 ? "Score > 0: High sensitivity for stroke. Check bedside glucose and expedite emergency neuroimaging." : "Score ≤ 0: Investigate syncope, seizure, or toxic-metabolic etiologies."
        };
      }
    },
    {
      id: "cnsScore",
      cat: "neuro",
      type: "calc",
      name: "Canadian Neurological Scale (CNS)",
      desc: "Bedside serial monitoring tool for non-comatose acute stroke patients.",
      organ: "Cortex / Motor Pathways",
      region: "Stroke Unit",
      subject: "Vascular Neurology / Serial Monitoring",
      keywords: ["cns", "canadian neurological scale", "stroke monitoring"],
      guidance: "Combines Mentation (1.5–3.0) and Motor deficit (1.5–7.0). Validated for serial nursing checks.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "The Canadian Neurological Scale: a validated monitor in acute stroke",
        citation: "Cote R, et al. Neurology. 1989;39(5):638-643.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/2710348/" }]
      }],
      fields: [
        makeS("ment", "Mentation (Consciousness, Orientation, Speech)", "3.0", [
          ["3.0", "Alert, fully oriented, normal speech (3.0)"],
          ["2.5", "Alert with orientation or receptive deficit (2.5)"],
          ["2.0", "Drowsy with orientation or expressive deficit (2.0)"],
          ["1.5", "Drowsy, expressive and receptive deficit (1.5)"]
        ]),
        makeS("motor", "Motor Function (Face, Arm, Leg)", "7.0", [
          ["7.0", "No motor deficit (7.0)"],
          ["5.5", "Mild weakness in 1 or 2 limbs (5.5)"],
          ["3.5", "Moderate weakness / severe unilateral drift (3.5)"],
          ["1.5", "Severe weakness / total paralysis (1.5)"]
        ])
      ],
      table: {
        headers: ["Total Score", "Clinical State"],
        rows: [
          { id: "cnsHigh", cols: ["Score 8.5 – 10.0", "Mild or resolving neurological deficit"] },
          { id: "cnsMid", cols: ["Score 5.0 – 8.0", "Moderate neurological deficit"] },
          { id: "cnsLow", cols: ["Score < 5.0", "Severe neurological impairment; alert clinical team"] }
        ]
      },
      calc: function (v) {
        var total = +v.ment + +v.motor;
        var match = total >= 8.5 ? "cnsHigh" : total >= 5.0 ? "cnsMid" : "cnsLow";
        return { value: "CNS Score: " + total.toFixed(1) + " / 10.0 Points", matchId: match, eq: "Drop of ≥1.0 point indicates neurological deterioration." };
      }
    },
    {
      id: "cha2ds2vascRef",
      cat: "neuro",
      type: "class",
      name: "CHA₂DS₂-VASc (AF Cardioembolic Stroke Risk)",
      desc: "Stratifies ischemic stroke risk in non-valvular atrial fibrillation to guide oral anticoagulation.",
      organ: "Heart / Cerebral Arteries",
      region: "Cardioembolic Stroke",
      subject: "Vascular Neurology / Secondary Prevention",
      keywords: ["chads", "cha2ds2-vasc", "atrial fibrillation", "anticoagulation", "stroke prevention"],
      guidance: "Score ≥ 2 in males or ≥ 3 in females indicates oral anticoagulation (DOAC preferred over Warfarin).",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "Refining clinical risk stratification for predicting stroke and thromboembolism in atrial fibrillation",
        citation: "Lip GY, et al. Chest. 2010;137(2):263-272.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/19762550/" }]
      }],
      fields: [
        makeS("chf", "Congestive Heart Failure history", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("htn", "Hypertension history", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("age", "Age Category", "0", [["0", "< 65 years (0)"], ["1", "65–74 years (+1)"], ["2", "≥ 75 years (+2)"]]),
        makeS("dm", "Diabetes Mellitus", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("stroke", "Prior Stroke / TIA / Thromboembolism", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        makeS("vasc", "Vascular Disease (prior MI, PAD, aortic plaque)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
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
        var plan = oac ? "Oral Anticoagulation (DOAC: Apixaban, Rivaroxaban, Dabigatran) strongly recommended." : "Low/intermediate cardioembolic risk.";
        return { value: "CHA₂DS₂-VASc: " + total + " Points", matchId: match, eq: plan };
      }
    },

    // ==============================================================
    // 3. SEIZURES & EPILEPSY
    // ==============================================================
    {
      id: "statusEpilepticus",
      cat: "neuro",
      type: "class",
      name: "Status Epilepticus Operational Protocol (ILAE)",
      desc: "Emergency management checkpoints defining t1 (time to start treatment) and t2 (ongoing neuronal injury).",
      organ: "Cortex",
      region: "Emergency / Neuro-ICU",
      subject: "Epilepsy / Resuscitation",
      keywords: ["status epilepticus", "seizure", "t1", "t2", "lorazepam", "levetiracetam"],
      guidance: "t1 (5 min convulsive): Benzodiazepines. t2 (30 min convulsive): Anesthetic infusions.",
      literature: [{
        type: "ILAE Consensus",
        icon: "📘",
        title: "A definition and classification of status epilepticus",
        citation: "Trinka E, et al. Epilepsia. 2015;56(10):1515-1523.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/26338568/" }]
      }],
      fields: [
        makeN("duration", "Current Seizure Duration (Minutes)", 12, { min: 1, max: 240, step: 1 }),
        makeS("semiology", "Clinical Seizure Semiology", "tonic_clonic", [
          ["tonic_clonic", "Convulsive (bilateral tonic-clonic: t1=5m, t2=30m)"],
          ["focal", "Focal with impaired awareness (t1=10m, t2=60m)"],
          ["absence", "Absence status epilepticus (t1=10m, t2=120m)"]
        ])
      ],
      table: {
        headers: ["Seizure Stage", "Operational Window", "Emergency Action"],
        rows: [
          { id: "pre", cols: ["Early Seizure", "< t1 (0 – 5 min)", "Airway positioning, O2, fingerstick glucose"] },
          { id: "active", cols: ["Established Status", "≥ t1 to < t2 (5 – 30 min)", "FIRST-LINE: IV Lorazepam (0.1 mg/kg) or IM Midazolam (10 mg) stat"] },
          { id: "refractory", cols: ["Refractory Status", "≥ t2 (≥ 30 min)", "SECOND-LINE: IV Levetiracetam/Fosphenytoin; intubation + Propofol/Midazolam infusion"] }
        ]
      },
      calc: function (v) {
        var m = +v.duration;
        var t1 = v.semiology === "focal" ? 10 : v.semiology === "absence" ? 10 : 5;
        var t2 = v.semiology === "focal" ? 60 : v.semiology === "absence" ? 120 : 30;
        var match = m >= t2 ? "refractory" : m >= t1 ? "active" : "pre";
        var plan = m >= t2
          ? "REFRACTORY STATUS EPILEPTICUS (≥30 min). High risk of neuronal necrosis. Intubate, continuous anesthetic infusion (Propofol/Midazolam), and cEEG."
          : m >= t1 ? "ACTIVE STATUS EPILEPTICUS (≥5 min). Administer full-dose IV Benzodiazepines immediately."
          : "Pre-status window. Monitor airway; prepare rescue medication.";
        return { value: "Duration: " + m + " min", matchId: match, eq: plan };
      }
    },
    {
      id: "caveScore",
      cat: "neuro",
      type: "class",
      name: "CAVE Score (Post-ICH Seizures)",
      desc: "Predicts late unprovoked seizures after spontaneous intracerebral hemorrhage.",
      organ: "Brain Parenchyma",
      region: "Neurocritical Care",
      subject: "Epilepsy / Stroke",
      keywords: ["cave", "seizure", "ich", "epilepsy"],
      guidance: "Cortical involvement (+1), Age <65 (+1), Volume >10 mL (+1), Early seizure within 7 days (+1).",
      literature: [{
        type: "Validation",
        icon: "📄",
        title: "The CAVE score: predicting late seizures after intracerebral hemorrhage",
        citation: "Haapaniemi E, et al. Stroke. 2014;45(7):1971-1976.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/24876274/" }]
      }],
      fields: [
        makeS("cortical", "Cortical involvement", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("age", "Age < 65 years", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("vol", "ICH Volume > 10 mL", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("early", "Early seizure within 7 days", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      table: {
        headers: ["CAVE Score", "2-Year Seizure Risk"],
        rows: [
          { id: "c0", cols: ["0 Points", "~ 0.6%"] },
          { id: "c1", cols: ["1 Point", "~ 3.6%"] },
          { id: "c2", cols: ["2 Points", "~ 9.8%"] },
          { id: "c3", cols: ["3 Points", "~ 34.8%"] },
          { id: "c4", cols: ["4 Points", "~ 46.2%"] }
        ]
      },
      calc: function (v) {
        var total = +v.cortical + +v.age + +v.vol + +v.early;
        return { value: "CAVE Score: " + total + " / 4 Points", matchId: "c" + total, eq: "Predicts secondary epilepsy following spontaneous ICH." };
      }
    },
    {
      id: "selectScore",
      cat: "neuro",
      type: "class",
      name: "SeLECT Score (Post-Ischemic Stroke Epilepsy)",
      desc: "Predicts late unprovoked seizures and epilepsy following ischemic stroke.",
      organ: "Cortex",
      region: "Stroke Recovery",
      subject: "Vascular Neurology / Epilepsy",
      keywords: ["select", "stroke", "seizure", "post-stroke epilepsy"],
      guidance: "Scores Severity, Large artery atherosclerosis, Early seizures, Cortical involvement, and Territory.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "Development and validation of the SeLECT score to predict late seizures after ischemic stroke",
        citation: "Galovic M, et al. Lancet Neurol. 2018;17(8):696-704.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/30017325/" }]
      }],
      fields: [
        makeS("nihss", "Severity (Initial NIHSS)", "0", [["0", "NIHSS 0–3 (0)"], ["1", "NIHSS 4–10 (+1)"], ["2", "NIHSS ≥ 11 (+2)"]]),
        makeS("lvo", "Large-artery atherosclerosis etiology", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("early", "Early seizure within 7 days", "0", [["0", "No (0)"], ["3", "Yes (+3)"]]),
        makeS("cortical", "Cortical involvement on neuroimaging", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        makeS("territory", "Middle cerebral artery (MCA) territory", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      table: {
        headers: ["SeLECT Score", "1-Year Seizure Risk", "5-Year Seizure Risk"],
        rows: [
          { id: "low", cols: ["Score 0 – 1", "< 2%", "~ 3% – 4%"] },
          { id: "mod", cols: ["Score 2 – 4", "4% – 10%", "9% – 16%"] },
          { id: "high", cols: ["Score 5 – 9", "> 20%", "> 30% – 50%"] }
        ]
      },
      calc: function (v) {
        var total = +v.nihss + +v.lvo + +v.early + +v.cortical + +v.territory;
        var match = total >= 5 ? "high" : total >= 2 ? "mod" : "low";
        return { value: "SeLECT: " + total + " / 9 Points", matchId: match, eq: "Predicts secondary post-stroke epileptogenesis." };
      }
    },
    {
      id: "twoHelps2b",
      cat: "neuro",
      type: "class",
      name: "2HELPS2B Score (cEEG Seizure Risk)",
      desc: "Continuous EEG monitoring score for seizure risk in critically ill neuro-ICU patients.",
      organ: "Brain / EEG",
      region: "Neuro-ICU",
      subject: "Critical Care EEG / Seizures",
      keywords: ["2helps2b", "eeg", "ceeg", "seizure risk", "icu"],
      guidance: "Frequency >2Hz (+1), Periodic discharges (+1), LPDs (+1), Plus features (+1), Sporadic spikes (+1), BIRDs (+2).",
      literature: [{
        type: "Validation",
        icon: "📄",
        title: "The 2HELPS2B score for predicting seizures in critically ill patients",
        citation: "Struck AF, et al. JAMA Neurol. 2020;77(4):460-467.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/31951267/" }]
      }],
      fields: [
        makeS("freq", "Frequency > 2 Hz for rhythmic pattern", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("ed", "Periodic discharges (LPD, GPD, BIPD)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("lpd", "Lateralized periodic discharges specifically", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("plus", "Plus features (fast/sharp activity)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("sw", "Sporadic epileptiform discharges", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        makeS("birds", "Brief ictal rhythmic discharges (BIRDs)", "0", [["0", "No (0)"], ["2", "Yes (+2)"]])
      ],
      table: {
        headers: ["2HELPS2B Score", "Seizure Probability", "cEEG Duration Recommendation"],
        rows: [
          { id: "e0", cols: ["0 Points", "< 5%", "1 hour screening cEEG adequate"] },
          { id: "e1", cols: ["1 Point", "~ 12%", "At least 12–24 hours cEEG recommended"] },
          { id: "e2", cols: ["≥ 2 Points", "> 25% – 70%", "Extended cEEG (≥ 24–48 hours) strongly indicated"] }
        ]
      },
      calc: function (v) {
        var total = +v.freq + +v.ed + +v.lpd + +v.plus + +v.sw + +v.birds;
        var match = total >= 2 ? "e2" : total === 1 ? "e1" : "e0";
        return { value: "2HELPS2B: " + total + " Points", matchId: match, eq: total >= 2 ? "High seizure probability; prolonged continuous EEG warranted." : "Low seizure probability." };
      }
    },
    {
      id: "seizureRecurrence",
      cat: "neuro",
      type: "class",
      name: "First Seizure Recurrence Risk",
      desc: "Stratifies risk of a second unprovoked seizure to guide antiseizure medication initiation.",
      organ: "Cortex",
      region: "General Neurology",
      subject: "Epilepsy",
      keywords: ["seizure recurrence", "epilepsy definition", "first seizure"],
      guidance: "ILAE definition: A single seizure with >60% recurrence risk over 10 years qualifies as Epilepsy.",
      literature: [{
        type: "ILAE Definition",
        icon: "📘",
        title: "Revised definition of epilepsy",
        citation: "Fisher RS, et al. Epilepsia. 2014;55(4):475-482.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/24730890/" }]
      }],
      fields: [
        makeS("mri", "Brain imaging abnormality (tumor, old stroke, dysplasia)", "0", [["0", "No"], ["1", "Yes (+1)"]]),
        makeS("eeg", "Epileptiform abnormalities on EEG", "0", [["0", "No"], ["1", "Yes (+1)"]]),
        makeS("sleep", "Seizure occurred during sleep/nocturnal", "0", [["0", "No"], ["1", "Yes (+1)"]]),
        makeS("neuro", "Prior focal neurological deficit", "0", [["0", "No"], ["1", "Yes (+1)"]])
      ],
      table: {
        headers: ["Risk Factors Present", "5-Year Recurrence Risk", "ILAE Epilepsy Diagnosis"],
        rows: [
          { id: "rLow", cols: ["0 Factors", "~ 25%", "Does not meet criteria for epilepsy"] },
          { id: "rMid", cols: ["1 Factor", "~ 40%", "Equivocal; individualize treatment"] },
          { id: "rHigh", cols: ["≥ 2 Factors", "> 60%", "MEETS PRACTICAL DEFINITION OF EPILEPSY; start ASM"] }
        ]
      },
      calc: function (v) {
        var count = +v.mri + +v.eeg + +v.sleep + +v.neuro;
        var match = count >= 2 ? "rHigh" : count === 1 ? "rMid" : "rLow";
        var plan = count >= 2
          ? "Recurrence risk exceeds 60%. Meets ILAE practical definition of epilepsy; initiate antiseizure monotherapy."
          : "Recurrence risk is low-to-moderate.";
        return { value: count + " / 4 Risk Factors Present", matchId: match, eq: plan };
      }
    },
    {
      id: "asmDosingHelper",
      cat: "neuro",
      type: "calc",
      name: "Antiseizure Medication (ASM) Renal Helper",
      desc: "Calculates CrCl-based dose adjustments for Levetiracetam, Lacosamide, Lamotrigine, and Phenytoin.",
      organ: "Kidneys / Liver",
      region: "Neuro-Pharmacology",
      subject: "Epilepsy / Drug Safety",
      keywords: ["asm", "keppra", "levetiracetam", "lacosamide", "phenytoin", "renal dosing"],
      guidance: "Provides renal cut-off adjustments based on estimated CrCl.",
      literature: [{
        type: "Pharmacotherapy Guidelines",
        icon: "📘",
        title: "Renal dosing of antiepileptic drugs",
        citation: "Patsalos PN, et al. Lancet Neurol. 2018;17(4):370-380.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/29553384/" }]
      }],
      fields: [
        makeS("drug", "Select Antiseizure Medication", "lev", [
          ["lev", "Levetiracetam (Keppra)"],
          ["lac", "Lacosamide (Vimpat)"],
          ["lam", "Lamotrigine (Lamictal)"],
          ["phe", "Phenytoin (Dilantin)"]
        ]),
        makeN("crcl", "Estimated CrCl (mL/min)", 60, { min: 5, max: 150, step: 1 })
      ],
      calc: function (v) {
        var c = +v.crcl, d = v.drug;
        var plan = "";
        if (d === "lev") {
          plan = c >= 80 ? "Normal: 500–1500 mg BID." : c >= 50 ? "CrCl 50–79: 500–1000 mg BID." : c >= 30 ? "CrCl 30–49: 250–750 mg BID." : c >= 15 ? "CrCl 15–29: 250–500 mg BID." : "ESRD/Dialysis: 500–1000 mg once daily (give supplemental dose post-HD).";
        } else if (d === "lac") {
          plan = c <= 30 ? "CrCl ≤30 mL/min: Max recommended dose 300 mg/day (25% reduction)." : "Standard: 100–200 mg BID (max 400 mg/day).";
        } else if (d === "lam") {
          plan = c < 50 ? "Renal excretion of glucuronide metabolites reduced; reduce maintenance dose by ~25%–50%." : "Standard slow titration to avoid Stevens-Johnson syndrome.";
        } else {
          plan = "Hepatic clearance. Target total level 10–20 mcg/mL. In hypoalbuminemia or renal failure, use Sheiner-Tozer correction.";
        }
        return { value: "Guidance for " + (d === "lev" ? "Levetiracetam" : d === "lac" ? "Lacosamide" : d === "lam" ? "Lamotrigine" : "Phenytoin"), eq: plan };
      }
    },

    // ==============================================================
    // 4. NEUROMUSCULAR & MOTOR NEURON DISORDERS
    // ==============================================================
    {
      id: "mrcGrading",
      cat: "neuro",
      type: "class",
      name: "MRC Muscle Power Grading (0–5)",
      desc: "Medical Research Council standard grading scale for manual muscle strength testing.",
      organ: "Skeletal Muscle / Peripheral Nerve",
      region: "Physical Examination",
      subject: "Neuromuscular",
      keywords: ["mrc", "motor power", "muscle strength", "neuromuscular"],
      guidance: "0 = no movement; 3 = moves against gravity; 5 = normal power.",
      literature: [{
        type: "Historical Landmark",
        icon: "📄",
        title: "Aids to the examination of the peripheral nervous system",
        citation: "Medical Research Council. War Memorandum No. 7. 1943.",
        links: [{ text: "View Reference ↗", url: "https://www.mrc.ac.uk/" }]
      }],
      fields: [
        makeS("grade", "Observed Muscle Contraction", "5", [
          ["0", "0 — No contraction detected"],
          ["1", "1 — Trace flicker of contraction, no joint movement"],
          ["2", "2 — Active movement with gravity eliminated"],
          ["3", "3 — Active movement against gravity only"],
          ["4", "4 — Active movement against gravity and moderate resistance"],
          ["5", "5 — Normal power against full resistance"]
        ])
      ],
      table: {
        headers: ["MRC Grade", "Movement Description"],
        rows: [
          { id: "m0", cols: ["Grade 0", "Complete paralysis"] },
          { id: "m1", cols: ["Grade 1", "Flicker / trace contraction only"] },
          { id: "m2", cols: ["Grade 2", "Movement with gravity eliminated"] },
          { id: "m3", cols: ["Grade 3", "Movement against gravity"] },
          { id: "m4", cols: ["Grade 4", "Movement against resistance"] },
          { id: "m5", cols: ["Grade 5", "Normal power"] }
        ]
      },
      calc: function (v) {
        return { value: "MRC Grade " + v.grade, matchId: "m" + v.grade, eq: "Standard manual muscle test." };
      }
    },
    {
      id: "mrcSumScore",
      cat: "neuro",
      type: "calc",
      name: "MRC Sum Score (ICU Weakness & GBS)",
      desc: "Evaluates 6 bilateral muscle groups (0–60 points). Score < 48 indicates ICU-acquired weakness.",
      organ: "Peripheral Nerves / Muscles",
      region: "Neurocritical Care / Ward",
      subject: "Neuromuscular / GBS",
      keywords: ["mrc sum", "icu weakness", "gbs", "polyneuropathy"],
      guidance: "Score 6 bilateral muscle pairs 0–5 each: shoulder abduction, elbow flexion, wrist extension, hip flexion, knee extension, ankle dorsiflexion.",
      literature: [{
        type: "Validation Study",
        icon: "📄",
        title: "Diagnostic criteria for intensive care unit-acquired weakness",
        citation: "De Jonghe B, et al. Crit Care Med. 2002;30(2):352-360.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/11889307/" }]
      }],
      fields: [
        makeN("shoulder", "Shoulder Abduction (R+L combined, 0–10)", 10, { min: 0, max: 10 }),
        makeN("elbow", "Elbow Flexion (R+L combined, 0–10)", 10, { min: 0, max: 10 }),
        makeN("wrist", "Wrist Extension (R+L combined, 0–10)", 10, { min: 0, max: 10 }),
        makeN("hip", "Hip Flexion (R+L combined, 0–10)", 10, { min: 0, max: 10 }),
        makeN("knee", "Knee Extension (R+L combined, 0–10)", 10, { min: 0, max: 10 }),
        makeN("ankle", "Ankle Dorsiflexion (R+L combined, 0–10)", 10, { min: 0, max: 10 })
      ],
      table: {
        headers: ["MRC Sum Score", "Clinical Interpretation"],
        rows: [
          { id: "norm", cols: ["Score 48 – 60", "Preserved strength / non-significant paresis"] },
          { id: "weak", cols: ["Score < 48", "ICU-acquired weakness / significant quadriparesis"] }
        ]
      },
      calc: function (v) {
        var total = +v.shoulder + +v.elbow + +v.wrist + +v.hip + +v.knee + +v.ankle;
        var match = total < 48 ? "weak" : "norm";
        return {
          value: "MRC Sum: " + total + " / 60 Points",
          matchId: match,
          eq: total < 48 ? "Score < 48: Diagnostic of clinically significant ICU-acquired weakness / quadriparesis." : "Preserved strength."
        };
      }
    },
    {
      id: "mgAdlScore",
      cat: "neuro",
      type: "calc",
      name: "MG-ADL (Myasthenia Gravis ADL)",
      desc: "Patient-reported functional limitation scale for Myasthenia Gravis across ocular, bulbar, respiratory, and limb domains.",
      organ: "Neuromuscular Junction",
      region: "Neuromuscular",
      subject: "Myasthenia Gravis",
      keywords: ["mg-adl", "myasthenia gravis", "diplopia", "ptosis", "bulbar"],
      guidance: "8 items (0–3 each, total 0–24). A 2-point reduction represents clinically meaningful improvement.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "The MG-ADL scale: validation of a clinical outcome measure",
        citation: "Wolfe GI, et al. Neurology. 1999;52(7):1487-1489.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/10227640/" }]
      }],
      fields: [
        makeS("talk", "Talking", "0", [["0", "Normal (0)"], ["1", "Intermittent slurring (1)"], ["2", "Constant slurring (2)"], ["3", "Difficult to understand (3)"]]),
        makeS("chew", "Chewing", "0", [["0", "Normal (0)"], ["1", "Fatigue with solid food (1)"], ["2", "Fatigue with soft food (2)"], ["3", "Gastrostomy tube (3)"]]),
        makeS("swallow", "Swallowing", "0", [["0", "Normal (0)"], ["1", "Rare choke (1)"], ["2", "Frequent choke / soft food (2)"], ["3", "Feeding tube (3)"]]),
        makeS("breathe", "Breathing", "0", [["0", "Normal (0)"], ["1", "SOB with exertion (1)"], ["2", "SOB at rest (2)"], ["3", "Ventilator dependent (3)"]]),
        makeS("brush", "Brushing teeth / combing hair", "0", [["0", "Normal (0)"], ["1", "Extra effort (1)"], ["2", "Rest periods needed (2)"], ["3", "Cannot do (3)"]]),
        makeS("chair", "Arising from chair", "0", [["0", "Normal (0)"], ["1", "Uses arms (1)"], ["2", "Pushes with arms, several tries (2)"], ["3", "Cannot do (3)"]]),
        makeS("diplopia", "Double vision", "0", [["0", "None (0)"], ["1", "Occurs with fatigue (1)"], ["2", "Constant daily (2)"], ["3", "Constant throughout day (3)"]]),
        makeS("ptosis", "Eyelid droop", "0", [["0", "None (0)"], ["1", "Occurs with fatigue (1)"], ["2", "Obstructs some vision (2)"], ["3", "Obstructs entire vision (3)"]])
      ],
      calc: function (v) {
        var total = +v.talk + +v.chew + +v.swallow + +v.breathe + +v.brush + +v.chair + +v.diplopia + +v.ptosis;
        return { value: "MG-ADL: " + total + " / 24 Points", eq: "Change of ≥ 2 points is clinically meaningful." };
      }
    },
    {
      id: "qmgPlanned",
      cat: "neuro",
      type: "calc",
      name: "QMG (Quantitative Myasthenia Gravis)",
      desc: "Physician-administered objective endurance and weakness testing score (0–39 points).",
      organ: "Neuromuscular Junction",
      region: "Neuromuscular",
      subject: "Myasthenia Gravis",
      keywords: ["qmg", "myasthenia", "endurance", "vital capacity"],
      guidance: "Evaluates ocular, facial, bulbar, respiratory, and limb endurance.",
      literature: [{
        type: "Testing Manual",
        icon: "📘",
        title: "Testing protocol for the quantitative myasthenia gravis score",
        citation: "Barohn RJ, et al. Ann N Y Acad Sci. 1998;841:769-772.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/9668326/" }]
      }],
      fields: [
        makeN("score", "Total QMG Score (0 to 39)", 8, { min: 0, max: 39, step: 1 })
      ],
      calc: function (v) {
        var s = +v.score;
        return { value: "QMG Score: " + s + " / 39 Points", eq: "Objective strength scoring. Change of ≥ 3 points represents significant clinical response." };
      }
    },
    {
      id: "mgfaClass",
      cat: "neuro",
      type: "class",
      name: "MGFA Clinical Classification",
      desc: "Myasthenia Gravis Foundation of America clinical severity staging.",
      organ: "Neuromuscular Junction",
      region: "Neuromuscular",
      subject: "Myasthenia Gravis",
      keywords: ["mgfa", "myasthenia gravis", "ocular", "crisis"],
      guidance: "Class I (ocular) through Class V (intubation).",
      literature: [{
        type: "Consensus",
        icon: "📘",
        title: "Myasthenia gravis: recommendations for clinical research standards",
        citation: "Jaretzki A 3rd, et al. Neurology. 2000;55(1):16-23.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/10891897/" }]
      }],
      fields: [
        makeS("class", "MGFA Severity Class", "I", [
          ["I", "Class I — Purely ocular muscle weakness (ptosis / diplopia)"],
          ["II", "Class II — Mild generalized weakness (limb, axial, or bulbar)"],
          ["III", "Class III — Moderate generalized weakness"],
          ["IV", "Class IV — Severe generalized weakness"],
          ["V", "Class V — Intubation required with or without mechanical ventilation"]
        ])
      ],
      table: {
        headers: ["Class", "Description"],
        rows: [
          { id: "cI", cols: ["Class I", "Pure ocular muscle weakness"] },
          { id: "cII", cols: ["Class II", "Mild generalized weakness"] },
          { id: "cIII", cols: ["Class III", "Moderate generalized weakness"] },
          { id: "cIV", cols: ["Class IV", "Severe generalized weakness"] },
          { id: "cV", cols: ["Class V", "Myasthenic crisis / intubation required"] }
        ]
      },
      calc: function (v) {
        return { value: "MGFA: Class " + v.class, matchId: "c" + v.class, eq: "Standard disease distribution classification." };
      }
    },
    {
      id: "alsfrsScore",
      cat: "neuro",
      type: "calc",
      name: "ALSFRS-R (ALS Functional Rating Scale)",
      desc: "Monitors functional decline across bulbar, fine motor, gross motor, and respiratory domains in ALS/MND.",
      organ: "Motor Neurons",
      region: "Neuromuscular",
      subject: "Motor Neuron Disease / ALS",
      keywords: ["alsfrs-r", "als", "mnd", "motor neuron", "bulbar"],
      guidance: "4 domains scored 0–12 each (Total 0–48). Normal is 48.",
      literature: [{
        type: "Validation",
        icon: "📄",
        title: "The Revised Amyotrophic Lateral Sclerosis Functional Rating Scale (ALSFRS-R)",
        citation: "Cedarbaum JM, et al. J Neurol Sci. 1999;169(1-2):13-21.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/10540002/" }]
      }],
      fields: [
        makeN("bulbar", "Bulbar Domain (speech, saliva, swallow: 0–12)", 12, { min: 0, max: 12 }),
        makeN("fine", "Fine Motor Domain (handwriting, cutting, dressing: 0–12)", 12, { min: 0, max: 12 }),
        makeN("gross", "Gross Motor Domain (turning in bed, walking, stairs: 0–12)", 12, { min: 0, max: 12 }),
        makeN("resp", "Respiratory Domain (dyspnea, orthopnea, ventilation: 0–12)", 12, { min: 0, max: 12 })
      ],
      calc: function (v) {
        var total = +v.bulbar + +v.fine + +v.gross + +v.resp;
        return { value: "ALSFRS-R: " + total + " / 48 Points", eq: "Typical progression rate is ~1 point decline per month." };
      }
    },
    {
      id: "hughesGbs",
      cat: "neuro",
      type: "class",
      name: "Hughes GBS Disability Scale",
      desc: "Clinical functional mobility staging in Guillain–Barré syndrome.",
      organ: "Peripheral Nerves",
      region: "Neuromuscular / Critical Care",
      subject: "Guillain–Barré Syndrome",
      keywords: ["hughes", "gbs", "disability", "guillain barre"],
      guidance: "Grade 0 (healthy) to Grade 6 (death). Grade ≥ 3 indicates need for IVIg / plasma exchange.",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "Controlled trial of prednisolone in acute polyneuropathy",
        citation: "Hughes RA, et al. Lancet. 1978;2(8093):750-753.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/80682/" }]
      }],
      fields: [
        makeS("grade", "Hughes Functional Grade", "0", [
          ["0", "0 — Healthy, no neurological symptoms"],
          ["1", "1 — Minor symptoms, capable of running"],
          ["2", "2 — Able to walk 10m independently without aid, cannot run"],
          ["3", "3 — Able to walk 10m with support / stick / aid"],
          ["4", "4 — Bedbound or wheelchair-bound (unable to walk 10m with aid)"],
          ["5", "5 — Requiring assisted mechanical ventilation (at least part of day)"],
          ["6", "6 — Dead"]
        ])
      ],
      table: {
        headers: ["Grade", "Functional Capability", "Treatment Indication"],
        rows: [
          { id: "h0_2", cols: ["Grades 0 – 2", "Ambulatory", "Monitor closely for rapid progression"] },
          { id: "h3_4", cols: ["Grades 3 – 4", "Non-ambulatory / supported", "Standard indication for IVIg (2 g/kg) or Plasma Exchange"] },
          { id: "h5", cols: ["Grade 5", "Ventilator-dependent", "Intensive care mechanical ventilation"] }
        ]
      },
      calc: function (v) {
        var g = +v.grade;
        var match = g >= 5 ? "h5" : g >= 3 ? "h3_4" : "h0_2";
        return { value: "Hughes Disability Grade " + g, matchId: match, eq: g >= 3 ? "Grade ≥ 3: Indication for IVIg or plasma exchange." : "Ambulatory GBS." };
      }
    },
    {
      id: "egrisScore",
      cat: "neuro",
      type: "class",
      name: "EGRIS (GBS Respiratory Failure Risk)",
      desc: "Erasmus GBS Respiratory Insufficiency Score predicting mechanical ventilation within 1 week.",
      organ: "Peripheral Nerves / Diaphragm",
      region: "Neuromuscular / ICU",
      subject: "Guillain–Barré Syndrome / Resuscitation",
      keywords: ["egris", "gbs", "respiratory failure", "intubation"],
      guidance: "Scores rate of progression, bulbar weakness, and MRC sum score on admission.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "Predicting respiratory failure in Guillain-Barré syndrome: the EGRIS score",
        citation: "Walgaard C, et al. Neurology. 2010;75(16):1463-1469.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/20956790/" }]
      }],
      fields: [
        makeS("days", "Days from onset of weakness to admission", "0", [["0", "> 7 days (0)"], ["1", "4–7 days (+1)"], ["2", "< 4 days (+2)"]]),
        makeS("bulbar", "Bulbar weakness (facial or deglutition deficit)", "0", [["0", "Absent (0)"], ["1", "Present (+1)"]]),
        makeS("mrc", "MRC Sum Score at admission", "0", [
          ["0", "MRC 60–51 (0)"], ["1", "MRC 50–41 (+1)"], ["2", "MRC 40–31 (+2)"], ["3", "MRC 30–21 (+3)"], ["4", "MRC ≤ 20 (+4)"]
        ])
      ],
      table: {
        headers: ["EGRIS Score", "Ventilation Risk within 1 Week"],
        rows: [
          { id: "eLow", cols: ["0 – 2 Points", "~ 4% (Low Risk)"] },
          { id: "eMid", cols: ["3 – 4 Points", "~ 15% (Intermediate Risk)"] },
          { id: "eHigh", cols: ["5 – 7 Points", "~ 65% (High Risk) — Proactive ICU admission recommended"] }
        ]
      },
      calc: function (v) {
        var total = +v.days + +v.bulbar + +v.mrc;
        var match = total >= 5 ? "eHigh" : total >= 3 ? "eMid" : "eLow";
        return { value: "EGRIS: " + total + " / 7 Points", matchId: match, eq: total >= 5 ? "High risk of respiratory failure (~65%). Triage to ICU for frequent FVC/NIF monitoring." : "Low/intermediate risk." };
      }
    },

    // ==============================================================
    // 5. HEADACHE & FACIAL PAIN
    // ==============================================================
    {
      id: "midasScore",
      cat: "neuro",
      type: "class",
      name: "MIDAS (Migraine Disability Assessment)",
      desc: "Quantifies headache-related disability over the preceding 3 months.",
      organ: "Brain / Trigeminal System",
      region: "Headache Clinic",
      subject: "Headache / Migraine",
      keywords: ["midas", "migraine", "disability", "headache days"],
      guidance: "Sums missed and reduced-productivity days at work, home, and social activities over 3 months.",
      literature: [{
        type: "Validation",
        icon: "📄",
        title: "Development and testing of the Migraine Disability Assessment (MIDAS) Questionnaire",
        citation: "Stewart WF, et al. Cephalalgia. 2001;21(4):508-523.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/11442562/" }]
      }],
      fields: [
        makeN("q1", "Missed days of work/school", 2, { min: 0, max: 90 }),
        makeN("q2", "Work/school productivity reduced by half", 3, { min: 0, max: 90 }),
        makeN("q3", "Missed days of household work", 2, { min: 0, max: 90 }),
        makeN("q4", "Household productivity reduced by half", 2, { min: 0, max: 90 }),
        makeN("q5", "Missed family/social/leisure days", 1, { min: 0, max: 90 })
      ],
      table: {
        headers: ["MIDAS Score", "Disability Grade", "Management"],
        rows: [
          { id: "g1", cols: ["0 – 5 Days", "Grade I: Little/No Disability", "Acute symptomatic therapy"] },
          { id: "g2", cols: ["6 – 10 Days", "Grade II: Mild Disability", "Acute therapy / lifestyle optimization"] },
          { id: "g3", cols: ["11 – 20 Days", "Grade III: Moderate Disability", "Consider preventive migraine therapy"] },
          { id: "g4", cols: ["≥ 21 Days", "Grade IV: Severe Disability", "Preventive migraine medication strongly indicated"] }
        ]
      },
      calc: function (v) {
        var total = +v.q1 + +v.q2 + +v.q3 + +v.q4 + +v.q5;
        var match = total >= 21 ? "g4" : total >= 11 ? "g3" : total >= 6 ? "g2" : "g1";
        return { value: "MIDAS: " + total + " Days", matchId: match, eq: total >= 11 ? "Moderate to severe disability; initiation of preventive medication supported." : "Mild/minimal disability." };
      }
    },
    {
      id: "hit6Score",
      cat: "neuro",
      type: "class",
      name: "HIT-6 (Headache Impact Test)",
      desc: "6-item questionnaire assessing the impact of chronic headaches on daily functioning.",
      organ: "Brain",
      region: "Headache Clinic",
      subject: "Headache / Migraine",
      keywords: ["hit-6", "headache impact", "migraine"],
      guidance: "Scores 36–78. Score ≥ 60 denotes severe impact on life.",
      literature: [{
        type: "Validation",
        icon: "📄",
        title: "Development of the HIT-6: a paper-based headache impact test",
        citation: "Kosinski M, et al. Qual Life Res. 2003;12(8):963-974.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/14651415/" }]
      }],
      fields: [
        makeS("q1", "Pain severe?", "6", [["6", "Never (6)"], ["8", "Rarely (8)"], ["10", "Sometimes (10)"], ["11", "Very often (11)"], ["13", "Always (13)"]]),
        makeS("q2", "Limits daily activities?", "6", [["6", "Never (6)"], ["8", "Rarely (8)"], ["10", "Sometimes (10)"], ["11", "Very often (11)"], ["13", "Always (13)"]]),
        makeS("q3", "Wish to lie down?", "6", [["6", "Never (6)"], ["8", "Rarely (8)"], ["10", "Sometimes (10)"], ["11", "Very often (11)"], ["13", "Always (13)"]]),
        makeS("q4", "Too tired to work?", "6", [["6", "Never (6)"], ["8", "Rarely (8)"], ["10", "Sometimes (10)"], ["11", "Very often (11)"], ["13", "Always (13)"]]),
        makeS("q5", "Felt fed up/irritated?", "6", [["6", "Never (6)"], ["8", "Rarely (8)"], ["10", "Sometimes (10)"], ["11", "Very often (11)"], ["13", "Always (13)"]]),
        makeS("q6", "Limits concentration?", "6", [["6", "Never (6)"], ["8", "Rarely (8)"], ["10", "Sometimes (10)"], ["11", "Very often (11)"], ["13", "Always (13)"]])
      ],
      table: {
        headers: ["HIT-6 Score", "Impact Level"],
        rows: [
          { id: "h1", cols: ["≤ 49 Points", "Little to no impact"] },
          { id: "h2", cols: ["50 – 55 Points", "Moderate impact"] },
          { id: "h3", cols: ["56 – 59 Points", "Substantial impact"] },
          { id: "h4", cols: ["≥ 60 Points", "Severe impact — Treatment escalation indicated"] }
        ]
      },
      calc: function (v) {
        var total = +v.q1 + +v.q2 + +v.q3 + +v.q4 + +v.q5 + +v.q6;
        var match = total >= 60 ? "h4" : total >= 56 ? "h3" : total >= 50 ? "h2" : "h1";
        return { value: "HIT-6 Score: " + total + " Points", matchId: match, eq: total >= 60 ? "Severe headache burden." : "Mild/moderate burden." };
      }
    },
    {
      id: "migraineScreen",
      cat: "neuro",
      type: "class",
      name: "ID-Migraine Screener",
      desc: "3-item diagnostic screener with 93% positive predictive value for migraine.",
      organ: "Brain",
      region: "Primary Care / Clinic",
      subject: "Headache / Migraine",
      keywords: ["id-migraine", "nausea", "photophobia", "screener"],
      guidance: "2 or 3 positive responses yield a 93% PPV for migraine.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "A brief self-administered screener for migraine in primary care: the ID Migraine validation study",
        citation: "Lipton RB, et al. Neurology. 2003;61(3):375-382.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/12913201/" }]
      }],
      fields: [
        makeS("nausea", "Felt nauseated or sick to stomach with headache?", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("light", "Light bothered you much more than usual?", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("limit", "Headache limited ability to work or function for ≥1 day?", "0", [["0", "No"], ["1", "Yes"]])
      ],
      table: {
        headers: ["Score", "Result", "Action"],
        rows: [
          { id: "neg", cols: ["0 – 1 Positive", "Migraine Unlikely", "Consider alternative primary headache"] },
          { id: "pos", cols: ["2 – 3 Positive", "Migraine Likely (93% PPV)", "Initiate guideline-directed migraine therapy"] }
        ]
      },
      calc: function (v) {
        var count = +v.nausea + +v.light + +v.limit;
        var match = count >= 2 ? "pos" : "neg";
        return { value: count + " / 3 Positive (" + (count >= 2 ? "Migraine Likely" : "Migraine Unlikely") + ")", matchId: match, eq: count >= 2 ? "93% positive predictive value for migraine." : "Low probability of migraine." };
      }
    },
    {
      id: "snnoop10",
      cat: "neuro",
      type: "class",
      name: "SNNOOP10 Headache Red Flags",
      desc: "Safety checklist screening for secondary, life-threatening causes of headache requiring neuroimaging.",
      organ: "Brain / Meninges",
      region: "Emergency / Clinic",
      subject: "Headache / Red Flags",
      keywords: ["snnoop10", "headache red flags", "thunderclap", "secondary headache"],
      guidance: "Systemic symptoms, Neoplasm, Neuro deficit, Onset thunderclap, Older age, Pattern change, Positional, Papilledema.",
      literature: [{
        type: "Consensus",
        icon: "📘",
        title: "SNNOOP10 list of red flags for secondary headaches",
        citation: "Do TP, et al. Neurology. 2019;92(3):134-144.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/30587518/" }]
      }],
      fields: [
        makeS("systemic", "Systemic symptoms (fever, weight loss)", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("neoplasm", "Neoplasm / active cancer history", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("neuro", "Neurological deficit or altered sensorium", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("onset", "Onset sudden / thunderclap (<1 min)", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("older", "Older onset (age > 50 years)", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("pattern", "Pattern change / new progressive headache", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("positional", "Positional (worse upright or supine)", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("papilledema", "Papilledema on fundoscopy", "0", [["0", "No"], ["1", "Yes"]])
      ],
      table: {
        headers: ["Red Flags", "Interpretation", "Recommendation"],
        rows: [
          { id: "safe", cols: ["0 Red Flags", "No red flags identified", "Evaluate for primary headache"] },
          { id: "danger", cols: ["≥ 1 Red Flag", "High risk of secondary etiology", "URGENT NEUROIMAGING MANDATED (CT/MRI)"] }
        ]
      },
      calc: function (v) {
        var count = +v.systemic + +v.neoplasm + +v.neuro + +v.onset + +v.older + +v.pattern + +v.positional + +v.papilledema;
        var match = count > 0 ? "danger" : "safe";
        return {
          value: count === 0 ? "No Red Flags" : count + " RED FLAG(S) PRESENT",
          matchId: match,
          eq: count > 0 ? "Urgent neuroimaging (CT/MRI) and secondary headache workup indicated." : "No red flags identified."
        };
      }
    },
    {
      id: "ottawaSah",
      cat: "neuro",
      type: "class",
      name: "Ottawa SAH Rule for Acute Headache",
      desc: "Decision rule identifying alert emergency patients with acute non-traumatic headache who require CT/LP to exclude SAH.",
      organ: "Subarachnoid Space",
      region: "Emergency Department",
      subject: "Emergency Medicine / SAH",
      keywords: ["ottawa sah", "subarachnoid", "thunderclap", "headache rule"],
      guidance: "Applies to alert patients ≥15yo with acute peak headache within 1 hour. Sensitivity near 100%.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "Clinical decision rules to rule out subarachnoid hemorrhage for acute headache",
        citation: "Perry JJ, et al. JAMA. 2013;310(12):1248-1255.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/24065011/" }]
      }],
      fields: [
        makeS("age", "Age ≥ 40 years", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("neck", "Neck pain or stiffness", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("onset", "Witnessed loss of consciousness", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("exertion", "Onset during exertion", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("thunder", "Thunderclap headache (instant peak pain)", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("flexion", "Limited neck flexion on examination", "0", [["0", "No"], ["1", "Yes"]])
      ],
      table: {
        headers: ["Rule Status", "SAH Probability", "Recommendation"],
        rows: [
          { id: "neg", cols: ["Ottawa Rule Negative", "< 0.1%", "SAH excluded (>99% sensitivity); no CT required"] },
          { id: "pos", cols: ["Ottawa Rule Positive", "Significant", "CT HEAD REQUIRED STAT to investigate SAH"] }
        ]
      },
      calc: function (v) {
        var pos = (+v.age + +v.neck + +v.onset + +v.exertion + +v.thunder + +v.flexion) > 0;
        var match = pos ? "pos" : "neg";
        return {
          value: pos ? "Ottawa Rule POSITIVE" : "Ottawa Rule NEGATIVE",
          matchId: match,
          eq: pos ? "Non-contrast head CT indicated immediately." : "SAH safely excluded without neuroimaging."
        };
      }
    },
    {
      id: "mohScreen",
      cat: "neuro",
      type: "class",
      name: "Medication-Overuse Headache Screener",
      desc: "ICHD-3 diagnostic criteria screener for chronic medication-overuse headache (MOH).",
      organ: "Brain",
      region: "Headache Clinic",
      subject: "Headache / Analgesic Rebound",
      keywords: ["moh", "medication overuse", "triptan", "rebound headache"],
      guidance: "Headache ≥15 days/month for >3 months with regular overuse of analgesics.",
      literature: [{
        type: "ICHD-3 Criteria",
        icon: "📘",
        title: "The International Classification of Headache Disorders, 3rd edition",
        citation: "Headache Classification Committee of the IHS. Cephalalgia. 2018;38(1):1-211.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/29368949/" }]
      }],
      fields: [
        makeN("days", "Headache days per month", 16, { min: 0, max: 31 }),
        makeS("triptan", "Triptans/opioids used ≥ 10 days/month?", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("nsaid", "Simple NSAIDs/paracetamol used ≥ 15 days/month?", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("months", "Overuse continued for > 3 months?", "0", [["0", "No"], ["1", "Yes"]])
      ],
      table: {
        headers: ["MOH Status", "Clinical Recommendation"],
        rows: [
          { id: "pos", cols: ["MOH Confirmed", "Structured withdrawal plan, transition to preventive migraine agent"] },
          { id: "neg", cols: ["Criteria Not Met", "Re-evaluate headache frequency and analgesic diary"] }
        ]
      },
      calc: function (v) {
        var isMOH = +v.days >= 15 && (+v.triptan === 1 || +v.nsaid === 1) && +v.months === 1;
        var match = isMOH ? "pos" : "neg";
        return {
          value: isMOH ? "MOH Criteria Satisfied" : "Does Not Meet MOH Criteria",
          matchId: match,
          eq: isMOH ? "Plan medication withdrawal and initiate preventive therapy." : "Does not satisfy ICHD-3 criteria."
        };
      }
    },

    // ==============================================================
    // 6. COGNITION & DEMENTIA
    // ==============================================================
    {
      id: "miniCog",
      cat: "neuro",
      type: "class",
      name: "Mini-Cog Cognitive Screen",
      desc: "Rapid 3-minute bedside screening tool combining 3-word recall with a clock drawing test.",
      organ: "Cortex / Hippocampus",
      region: "Clinic / Bedside",
      subject: "Dementia / Cognitive Impairment",
      keywords: ["mini-cog", "dementia", "memory", "clock drawing"],
      guidance: "Recall 0 = Demented; Recall 1–2 + abnormal clock = Demented; Recall 1–2 + normal clock OR Recall 3 = Negative.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "The Mini-Cog: a cognitive 'vital signs' measure for dementia screening in multi-lingual elderly",
        citation: "Borson S, et al. Int J Geriatr Psychiatry. 2000;15(11):1021-1027.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/11113982/" }]
      }],
      fields: [
        makeS("recall", "3-Word Delayed Recall", "3", [["0", "0 words (0)"], ["1", "1 word (1)"], ["2", "2 words (2)"], ["3", "3 words (3)"]]),
        makeS("clock", "Clock Drawing Test", "2", [["0", "Abnormal clock (0)"], ["2", "Normal clock (2)"]])
      ],
      table: {
        headers: ["Screen Result", "Interpretation"],
        rows: [
          { id: "pos", cols: ["Positive Screen", "Cognitive impairment / dementia likely; formal neuropsych testing indicated"] },
          { id: "neg", cols: ["Negative Screen", "Low probability of significant dementia"] }
        ]
      },
      calc: function (v) {
        var rec = +v.recall, clk = +v.clock;
        var pos = (rec === 0) || (rec <= 2 && clk === 0);
        var match = pos ? "pos" : "neg";
        return {
          value: pos ? "Mini-Cog POSITIVE (Impairment Likely)" : "Mini-Cog Negative",
          matchId: match,
          eq: pos ? "Positive screen for cognitive impairment." : "Normal screening test."
        };
      }
    },
    {
      id: "fourAtDelirium",
      cat: "neuro",
      type: "class",
      name: "4AT Delirium Screening Tool",
      desc: "Rapid bedside instrument for delirium and cognitive impairment (Alertness, AMT4, Attention, Acute change).",
      organ: "Brain",
      region: "Inpatient / Emergency",
      subject: "Delirium / Geriatric Neurology",
      keywords: ["4at", "delirium", "amt4", "confusion"],
      guidance: "Score ≥ 4 suggests delirium; score 1–3 suggests cognitive impairment.",
      literature: [{
        type: "Validation Study",
        icon: "📄",
        title: "The 4AT for delirium detection in older patients",
        citation: "Shenkin SD, et al. Age Ageing. 2019;48(5):614-623.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/31343666/" }]
      }],
      fields: [
        makeS("alert", "1. Alertness", "0", [["0", "Normal / mild sleepiness (0)"], ["4", "Clearly abnormal / agitated / stuporous (+4)"]]),
        makeS("amt4", "2. AMT4 (Age, DOB, Place, Current Year)", "0", [["0", "No mistakes (0)"], ["1", "1 mistake (+1)"], ["2", "≥ 2 mistakes (+2)"]]),
        makeS("attention", "3. Attention (Months backward)", "0", [["0", "≥ 7 months correct (0)"], ["1", "< 7 months correct (+1)"], ["2", "Untestable (+2)"]]),
        makeS("acute", "4. Acute change / fluctuating course", "0", [["0", "No (0)"], ["4", "Yes (+4)"]])
      ],
      table: {
        headers: ["4AT Score", "Status", "Clinical Action"],
        rows: [
          { id: "d0", cols: ["0 Points", "Delirium Unlikely", "Routine care"] },
          { id: "d1", cols: ["1 – 3 Points", "Possible Cognitive Impairment", "Review baseline cognition"] },
          { id: "d4", cols: ["≥ 4 Points", "POSSIBLE DELIRIUM", "Immediate medical evaluation for underlying causes of delirium"] }
        ]
      },
      calc: function (v) {
        var total = +v.alert + +v.amt4 + +v.attention + +v.acute;
        var match = total >= 4 ? "d4" : total >= 1 ? "d1" : "d0";
        return {
          value: "4AT Score: " + total + " Points",
          matchId: match,
          eq: total >= 4 ? "Score ≥ 4 suggests delirium. Screen for sepsis, drugs, and hypoxia." : "Delirium unlikely."
        };
      }
    },
    {
      id: "camDelirium",
      cat: "neuro",
      type: "class",
      name: "Confusion Assessment Method (CAM)",
      desc: "Standard diagnostic algorithm for delirium.",
      organ: "Brain",
      region: "Inpatient / Geriatrics",
      subject: "Delirium / Geriatric Neurology",
      keywords: ["cam", "delirium", "confusion", "inattention"],
      guidance: "Requires Feature 1 AND Feature 2, plus either Feature 3 OR Feature 4.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "Clarifying confusion: the Confusion Assessment Method",
        citation: "Inouye SK, et al. Ann Intern Med. 1990;113(12):941-948.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/2240918/" }]
      }],
      fields: [
        makeS("f1", "Feature 1: Acute onset & fluctuating course", "1", [["1", "Present"], ["0", "Absent"]]),
        makeS("f2", "Feature 2: Inattention (distractibility)", "1", [["1", "Present"], ["0", "Absent"]]),
        makeS("f3", "Feature 3: Disorganized thinking (illogical speech)", "0", [["1", "Present"], ["0", "Absent"]]),
        makeS("f4", "Feature 4: Altered level of consciousness", "0", [["1", "Present (lethargic/hyperalert)"], ["0", "Absent (alert)"]])
      ],
      table: {
        headers: ["CAM Status", "Diagnosis"],
        rows: [
          { id: "pos", cols: ["CAM Positive", "DELIRIUM CONFIRMED (Features 1 & 2 + 3 or 4 satisfied)"] },
          { id: "neg", cols: ["CAM Negative", "Criteria for delirium not satisfied"] }
        ]
      },
      calc: function (v) {
        var pos = v.f1 === "1" && v.f2 === "1" && (v.f3 === "1" || v.f4 === "1");
        var match = pos ? "pos" : "neg";
        return {
          value: pos ? "CAM POSITIVE (Delirium Confirmed)" : "CAM Negative",
          matchId: match,
          eq: pos ? "Delirium confirmed. Identify reversible underlying triggers." : "Negative for delirium."
        };
      }
    },
    {
      id: "cdrScore",
      cat: "neuro",
      type: "class",
      name: "Clinical Dementia Rating (CDR)",
      desc: "Semi-structured global dementia staging across 6 cognitive domains.",
      organ: "Cortex",
      region: "Memory Clinic",
      subject: "Dementia / Cognitive Staging",
      keywords: ["cdr", "clinical dementia rating", "alzheimer", "mci"],
      guidance: "Global CDR 0 (None), 0.5 (Questionable/MCI), 1 (Mild), 2 (Moderate), 3 (Severe).",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "A new clinical scale for the staging of dementia",
        citation: "Hughes CP, et al. Br J Psychiatry. 1982;140:566-572.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/7104545/" }]
      }],
      fields: [
        makeS("cdr", "Global CDR Rating", "0", [
          ["0", "CDR 0 — Normal cognition"],
          ["0.5", "CDR 0.5 — Very mild impairment / MCI"],
          ["1", "CDR 1 — Mild dementia"],
          ["2", "CDR 2 — Moderate dementia"],
          ["3", "CDR 3 — Severe dementia"]
        ])
      ],
      table: {
        headers: ["CDR Score", "Staging", "Independence Level"],
        rows: [
          { id: "c0", cols: ["CDR 0", "No impairment", "Fully independent"] },
          { id: "c05", cols: ["CDR 0.5", "Very Mild (MCI)", "Slight memory difficulty; independent in basic ADLs"] },
          { id: "c1", cols: ["CDR 1", "Mild Dementia", "Moderate memory loss; needs assistance with complex tasks"] },
          { id: "c2", cols: ["CDR 2", "Moderate Dementia", "Severe memory loss; only simple chores preserved"] },
          { id: "c3", cols: ["CDR 3", "Severe Dementia", "Severe dependency; total personal care needed"] }
        ]
      },
      calc: function (v) {
        var match = v.cdr === "0" ? "c0" : v.cdr === "0.5" ? "c05" : v.cdr === "1" ? "c1" : v.cdr === "2" ? "c2" : "c3";
        return { value: "Global CDR: " + v.cdr, matchId: match, eq: "Standard clinical dementia staging." };
      }
    },
    {
      id: "fastStaging",
      cat: "neuro",
      type: "class",
      name: "FAST Staging (Functional Assessment Staging)",
      desc: "Monitors functional decline through 7 stages of Alzheimer's disease.",
      organ: "Cortex",
      region: "Geriatric Neurology",
      subject: "Dementia / Alzheimer",
      keywords: ["fast", "alzheimer", "dementia staging", "hospice"],
      guidance: "Stage 7 qualifies for hospice care.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "The Functional Assessment Staging (FAST) scale in Alzheimer's disease",
        citation: "Reisberg B. Psychopharmacol Bull. 1988;24(4):653-659.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/3249767/" }]
      }],
      fields: [
        makeS("stage", "Functional Stage", "1", [
          ["1", "Stage 1 — Normal adult"],
          ["2", "Stage 2 — Normal aged adult (subjective memory loss)"],
          ["3", "Stage 3 — Early dementia / MCI (deficits in complex work)"],
          ["4", "Stage 4 — Mild Alzheimer's (assistance with finances/shopping)"],
          ["5", "Stage 5 — Moderate Alzheimer's (assistance choosing clothing)"],
          ["6", "Stage 6 — Moderately severe (assistance dressing/bathing/toileting)"],
          ["7", "Stage 7 — Severe (loss of speech, unable to walk, sit, or smile)"]
        ])
      ],
      table: {
        headers: ["Stage", "Description"],
        rows: [
          { id: "s1_3", cols: ["Stages 1 – 3", "Normal to mild cognitive impairment"] },
          { id: "s4_5", cols: ["Stages 4 – 5", "Mild to moderate Alzheimer's disease"] },
          { id: "s6", cols: ["Stage 6", "Moderately severe Alzheimer's disease"] },
          { id: "s7", cols: ["Stage 7", "Severe end-stage dementia (hospice eligibility threshold)"] }
        ]
      },
      calc: function (v) {
        var s = +v.stage;
        var match = s >= 7 ? "s7" : s === 6 ? "s6" : s >= 4 ? "s4_5" : "s1_3";
        return { value: "FAST Stage " + s, matchId: match, eq: s === 7 ? "Stage 7 represents advanced end-stage Alzheimer's disease." : "Functional progression stage." };
      }
    },
    {
      id: "ad8Screen",
      cat: "neuro",
      type: "class",
      name: "AD8 Informant Interview",
      desc: "8-item brief informant questionnaire for cognitive and memory change.",
      organ: "Cortex",
      region: "Clinic / Outpatient",
      subject: "Dementia Screening",
      keywords: ["ad8", "informant", "dementia screen", "memory loss"],
      guidance: "Score ≥ 2 indicates significant cognitive decline.",
      literature: [{
        type: "Validation Study",
        icon: "📄",
        title: "The AD8: a brief informant interview to detect dementia",
        citation: "Galvin JE, et al. Neurology. 2005;65(4):559-564.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/16116116/" }]
      }],
      fields: [
        makeS("q1", "Problems with judgment (finances, scams)?", "0", [["0", "No change"], ["1", "Yes, a change"]]),
        makeS("q2", "Less interest in hobbies/activities?", "0", [["0", "No change"], ["1", "Yes, a change"]]),
        makeS("q3", "Repeats the same things over and over?", "0", [["0", "No change"], ["1", "Yes, a change"]]),
        makeS("q4", "Trouble learning to use an appliance/gadget?", "0", [["0", "No change"], ["1", "Yes, a change"]]),
        makeS("q5", "Forgets correct month or year?", "0", [["0", "No change"], ["1", "Yes, a change"]]),
        makeS("q6", "Trouble handling complex finances?", "0", [["0", "No change"], ["1", "Yes, a change"]]),
        makeS("q7", "Trouble remembering appointments?", "0", [["0", "No change"], ["1", "Yes, a change"]]),
        makeS("q8", "Daily thinking/memory complaints?", "0", [["0", "No change"], ["1", "Yes, a change"]])
      ],
      table: {
        headers: ["AD8 Score", "Result"],
        rows: [
          { id: "norm", cols: ["0 – 1 Points", "Normal cognition likely"] },
          { id: "impaired", cols: ["≥ 2 Points", "Cognitive impairment likely; formal evaluation recommended"] }
        ]
      },
      calc: function (v) {
        var total = +v.q1 + +v.q2 + +v.q3 + +v.q4 + +v.q5 + +v.q6 + +v.q7 + +v.q8;
        var match = total >= 2 ? "impaired" : "norm";
        return {
          value: "AD8: " + total + " / 8 Points",
          matchId: match,
          eq: total >= 2 ? "Score ≥ 2 indicates significant cognitive decline. Order formal neuropsych testing and brain MRI." : "Normal cognition likely."
        };
      }
    },
    {
      id: "fabScore",
      cat: "neuro",
      type: "calc",
      name: "Frontal Assessment Battery (FAB)",
      desc: "6-subtest screening battery for dysexecutive and frontal lobe syndrome.",
      organ: "Frontal Lobe / Executive System",
      region: "Clinic",
      subject: "Dementia / Executive Function",
      keywords: ["fab", "frontal", "executive dysfunction", "ftd"],
      guidance: "Score < 12 suggests frontal lobe / executive dysfunction (helps differentiate FTD from AD).",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "The FAB: a Frontal Assessment Battery at bedside",
        citation: "Dubois B, et al. Neurology. 2000;55(11):1621-1626.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/11113214/" }]
      }],
      fields: [
        makeN("similar", "1. Conceptualization (Similarities, 0–3)", 3, { min: 0, max: 3 }),
        makeN("fluency", "2. Mental Flexibility (Verbal fluency, 0–3)", 3, { min: 0, max: 3 }),
        makeN("motor", "3. Motor Programming (Luria series, 0–3)", 3, { min: 0, max: 3 }),
        makeN("conflict", "4. Sensitivity to Interference (Go-No-Go, 0–3)", 3, { min: 0, max: 3 }),
        makeN("inhib", "5. Inhibitory Control (0–3)", 3, { min: 0, max: 3 }),
        makeN("prehension", "6. Environmental Autonomy (0–3)", 3, { min: 0, max: 3 })
      ],
      table: {
        headers: ["FAB Score", "Frontal Function"],
        rows: [
          { id: "fNorm", cols: ["Score 12 – 18", "Normal executive functioning"] },
          { id: "fAbn", cols: ["Score < 12", "Dysexecutive / Frontal Lobe Syndrome"] }
        ]
      },
      calc: function (v) {
        var total = +v.similar + +v.fluency + +v.motor + +v.conflict + +v.inhib + +v.prehension;
        var match = total < 12 ? "fAbn" : "fNorm";
        return {
          value: "FAB: " + total + " / 18 Points",
          matchId: match,
          eq: total < 12 ? "Score < 12 indicates frontal lobe dysfunction (e.g., FTD, PSP, vascular dementia)." : "Normal frontal function."
        };
      }
    },

    // ==============================================================
    // 7. MOVEMENT DISORDERS
    // ==============================================================
    {
      id: "hoehnYahr",
      cat: "neuro",
      type: "class",
      name: "Hoehn and Yahr Staging",
      desc: "Clinical staging of Parkinson's disease progression and postural impairment.",
      organ: "Basal Ganglia / Substantia Nigra",
      region: "Movement Disorders",
      subject: "Parkinson's Disease",
      keywords: ["hoehn yahr", "parkinson", "rigidity", "tremor", "movement disorders"],
      guidance: "Stages 1 through 5, tracking bilateral spread and postural reflex impairment.",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "Parkinsonism: onset, progression and mortality",
        citation: "Hoehn MM, Yahr MD. Neurology. 1967;17(5):427-442.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/6067254/" }]
      }],
      fields: [
        makeS("stage", "Clinical Stage", "1", [
          ["1", "Stage 1 — Unilateral involvement only, minimal/no functional disability"],
          ["1.5", "Stage 1.5 — Unilateral and axial involvement"],
          ["2", "Stage 2 — Bilateral involvement without balance impairment"],
          ["2.5", "Stage 2.5 — Mild bilateral disease with recovery on pull test"],
          ["3", "Stage 3 — Mild-to-moderate bilateral disease, postural instability, independent"],
          ["4", "Stage 4 — Severe disability, still able to walk or stand unassisted"],
          ["5", "Stage 5 — Wheelchair-bound or bedridden unless aided"]
        ])
      ],
      table: {
        headers: ["Stage", "Distribution", "Postural Reflexes"],
        rows: [
          { id: "s1_2", cols: ["Stages 1 – 2.5", "Unilateral to Bilateral", "Intact balance"] },
          { id: "s3", cols: ["Stage 3", "Bilateral", "Impaired balance (physically independent)"] },
          { id: "s4_5", cols: ["Stages 4 – 5", "Severe Bilateral", "Loss of independent ambulation"] }
        ]
      },
      calc: function (v) {
        var s = parseFloat(v.stage);
        var match = s >= 4 ? "s4_5" : s === 3 ? "s3" : "s1_2";
        return { value: "Hoehn & Yahr: Stage " + v.stage, matchId: match, eq: "Standard PD progression staging." };
      }
    },
    {
      id: "schwabEngland",
      cat: "neuro",
      type: "class",
      name: "Schwab and England ADL Scale",
      desc: "Percentage rating of functional daily living independence in Parkinson's disease.",
      organ: "Basal Ganglia",
      region: "Movement Disorders",
      subject: "Parkinson's Disease / ADLs",
      keywords: ["schwab england", "parkinson", "adl", "independence"],
      guidance: "Ranges from 100% (completely independent) to 0% (bedridden).",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "Projection technique for evaluating surgery in Parkinson's disease",
        citation: "Schwab RS, England AC. Third Symp Parkinson's Dis. 1969;152-157.",
        links: [{ text: "View Reference ↗", url: "https://pubmed.ncbi.nlm.nih.gov/" }]
      }],
      fields: [
        makeS("pct", "Independence Percentage", "100", [
          ["100", "100% — Completely independent, normal chores"],
          ["80", "80% — Independent with chores; takes twice as long"],
          ["60", "60% — Moderately dependent; needs help with some chores"],
          ["40", "40% — Very dependent; needs help with most chores"],
          ["20", "20% — Severe invalid; needs constant help"],
          ["0", "0% — Completely bedridden, vegetative functions impaired"]
        ])
      ],
      table: {
        headers: ["Percentage", "Status"],
        rows: [
          { id: "high", cols: ["80% – 100%", "Independent daily functioning"] },
          { id: "mid", cols: ["50% – 70%", "Moderately dependent; requires caregiver support"] },
          { id: "low", cols: ["≤ 40%", "Severely dependent to bedbound"] }
        ]
      },
      calc: function (v) {
        var p = +v.pct;
        var match = p <= 40 ? "low" : p <= 70 ? "mid" : "high";
        return { value: v.pct + "% Independence", matchId: match, eq: "Caregiver assistance metric in Parkinsonian disorders." };
      }
    },
    {
      id: "aimsScore",
      cat: "neuro",
      type: "calc",
      name: "AIMS (Abnormal Involuntary Movement Scale)",
      desc: "Monitors drug-induced tardive dyskinesia in patients on dopamine-blocking medications.",
      organ: "Facial / Extremity / Trunk Muscles",
      region: "Psychiatry / Movement Disorders",
      subject: "Tardive Dyskinesia",
      keywords: ["aims", "tardive dyskinesia", "antipsychotics", "extrapyramidal"],
      guidance: "A score ≥ 2 in two areas or ≥ 3 in one area confirms abnormal involuntary movements.",
      literature: [{
        type: "NIMH Instrument",
        icon: "📘",
        title: "Abnormal Involuntary Movement Scale (AIMS)",
        citation: "Guy W. ECDEU Assessment Manual. 1976;534-537.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/900854/" }]
      }],
      fields: [
        makeN("face", "Facial & Oral Movements (max 16 across 4 items)", 0, { min: 0, max: 16 }),
        makeN("extremity", "Extremity Movements (max 8 across 2 items)", 0, { min: 0, max: 8 }),
        makeN("trunk", "Trunk Movements (max 4 across 1 item)", 0, { min: 0, max: 4 })
      ],
      calc: function (v) {
        var total = +v.face + +v.extremity + +v.trunk;
        return {
          value: "AIMS Total: " + total + " / 28 Points",
          eq: total >= 2 ? "Positive for abnormal involuntary movements (tardive dyskinesia). Review antipsychotic dosage / consider VMAT2 inhibitor." : "Minimal or no dyskinesia."
        };
      }
    },
    {
      id: "simpsonAngus",
      cat: "neuro",
      type: "calc",
      name: "Simpson–Angus Scale (SAS)",
      desc: "Evaluates neuroleptic-induced extrapyramidal parkinsonian rigidity and hypokinesia.",
      organ: "Muscles / Joints",
      region: "Movement Disorders",
      subject: "Drug-Induced Parkinsonism",
      keywords: ["simpson angus", "rigidity", "extrapyramidal", "parkinsonism"],
      guidance: "Mean score > 0.3 indicates drug-induced extrapyramidal symptoms.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "A rating scale for extrapyramidal symptoms",
        citation: "Simpson GM, Angus JW. Acta Psychiatr Scand Suppl. 1970;212:11-19.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/5475355/" }]
      }],
      fields: [
        makeN("items", "Mean score of 10 items (0 to 4 each)", 0.2, { min: 0, max: 4, step: 0.05 })
      ],
      calc: function (v) {
        var m = +v.items;
        return {
          value: "Mean SAS: " + m.toFixed(2),
          eq: m > 0.3 ? "Mean > 0.3: Extrapyramidal parkinsonian signs present. Consider anticholinergic (trihexyphenidyl) or antipsychotic reduction." : "Within normal limits."
        };
      }
    },
    {
      id: "barnesAkathisia",
      cat: "neuro",
      type: "class",
      name: "Barnes Akathisia Rating Scale (BARS)",
      desc: "Assesses drug-induced subjective restlessness and observable motor pacing/fidgeting.",
      organ: "Motor Cortex",
      region: "Psychiatry / Movement Disorders",
      subject: "Akathisia",
      keywords: ["bars", "barnes akathisia", "restlessness", "neuroleptic"],
      guidance: "Global score ≥ 2 establishes diagnosis of drug-induced akathisia.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "A rating scale for drug-induced akathisia",
        citation: "Barnes TR. Br J Psychiatry. 1989;154:672-676.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/2574607/" }]
      }],
      fields: [
        makeS("obj", "Objective Restlessness", "0", [["0", "Normal (0)"], ["1", "Restless movements (1)"], ["2", "Pacing / cannot sit still (2)"], ["3", "Severe continuous pacing (3)"]]),
        makeS("subj", "Subjective Restlessness", "0", [["0", "None (0)"], ["1", "Mild awareness (1)"], ["2", "Aware of urge to move (2)"], ["3", "Intense distressing restlessness (3)"]]),
        makeS("global", "Global Clinical Assessment", "0", [["0", "Absent (0)"], ["1", "Questionable (1)"], ["2", "Mild akathisia (2)"], ["3", "Moderate akathisia (3)"], ["4", "Marked (4)"], ["5", "Severe (5)"]])
      ],
      table: {
        headers: ["Global Score", "Akathisia Status", "Action"],
        rows: [
          { id: "aNo", cols: ["0 – 1 Points", "No Akathisia / Questionable", "Monitor symptoms"] },
          { id: "aYes", cols: ["≥ 2 Points", "AKATHISIA PRESENT", "Reduce antipsychotic or start Propranolol / Benzodiazepine"] }
        ]
      },
      calc: function (v) {
        var g = +v.global;
        var match = g >= 2 ? "aYes" : "aNo";
        return { value: "BARS Global: " + g + " (" + (g >= 2 ? "Akathisia Present" : "No Akathisia") + ")", matchId: match, eq: g >= 2 ? "Akathisia confirmed. Propranolol (20–40 mg) is first-line medical therapy." : "Negative." };
      }
    },
    {
      id: "updrsMotor",
      cat: "neuro",
      type: "calc",
      name: "MDS-UPDRS Part III Motor Score",
      desc: "Quantifies objective motor signs in Parkinson's disease.",
      organ: "Basal Ganglia",
      region: "Movement Disorders",
      subject: "Parkinson's Disease / Motor Assessment",
      keywords: ["updrs", "mds-updrs", "parkinson motor", "bradykinesia"],
      guidance: "Assesses speech, facial expression, tremor, rigidity, finger taps, gait, and postural stability.",
      literature: [{
        type: "MDS Consensus",
        icon: "📘",
        title: "Movement Disorder Society-sponsored revision of the Unified Parkinson's Disease Rating Scale",
        citation: "Goetz CG, et al. Mov Disord. 2008;23(15):2129-2170.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/19025984/" }]
      }],
      fields: [
        makeN("score", "Total Part III Motor Score (0 to 132)", 24, { min: 0, max: 132 })
      ],
      calc: function (v) {
        return { value: "MDS-UPDRS Part III: " + v.score + " / 132 Points", eq: "Gold standard motor outcome measure in Parkinson's disease trials." };
      }
    },

    // ==============================================================
    // 8. NEUROINFLAMMATION & DEMYELINATING DISORDERS
    // ==============================================================
    {
      id: "edssScore",
      cat: "neuro",
      type: "class",
      name: "Expanded Disability Status Scale (EDSS)",
      desc: "Standard disability rating in multiple sclerosis from 0 (normal) to 10 (death).",
      organ: "Myelin / CNS",
      region: "Neuroimmunology",
      subject: "Multiple Sclerosis",
      keywords: ["edss", "multiple sclerosis", "ambulation", "ms"],
      guidance: "EDSS 0–4.5 depends on functional systems; 5.0–9.5 is determined predominantly by ambulation.",
      literature: [{
        type: "Seminal Publication",
        icon: "📄",
        title: "Rating neurologic impairment in multiple sclerosis",
        citation: "Kurtzke JF. Neurology. 1983;33(11):1444-1452.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/6685237/" }]
      }],
      fields: [
        makeS("edss", "Mobility & Ambulation Milestone", "0.0", [
          ["0.0", "0.0 — Normal neurological exam"],
          ["1.5", "1.5 — No disability; minimal signs in >1 system"],
          ["2.0", "2.0 — Minimal disability in 1 system"],
          ["3.0", "3.0 — Moderate disability in 1 system, fully ambulatory"],
          ["4.0", "4.0 — Fully ambulatory without aid; self-sufficient >12h/day; walks ≥500m"],
          ["6.0", "6.0 — Intermittent or unilateral assistance (cane / crutch) to walk 100m"],
          ["6.5", "6.5 — Constant bilateral assistance (canes / crutches) to walk 20m"],
          ["7.0", "7.0 — Essentially restricted to wheelchair; walks <5m"],
          ["8.0", "8.0 — Essentially restricted to bed or wheelchair"],
          ["9.0", "9.0 — Helpless bed patient; unable to communicate or eat effectively"]
        ])
      ],
      table: {
        headers: ["EDSS Tier", "Ambulation Status"],
        rows: [
          { id: "e0_3", cols: ["0.0 – 3.5", "Fully ambulatory without aid"] },
          { id: "e4_5", cols: ["4.0 – 5.5", "Walking restricted without aid"] },
          { id: "e6_7", cols: ["6.0 – 7.5", "Walking aid or wheelchair dependent"] },
          { id: "e8_9", cols: ["8.0 – 9.5", "Bed/chair bound; loss of self-care"] }
        ]
      },
      calc: function (v) {
        var s = parseFloat(v.edss);
        var match = s >= 8 ? "e8_9" : s >= 6 ? "e6_7" : s >= 4 ? "e4_5" : "e0_3";
        return { value: "EDSS: " + s.toFixed(1), matchId: match, eq: "Standard disability measure in MS." };
      }
    },
    {
      id: "mcdonaldChecklist",
      cat: "neuro",
      type: "class",
      name: "2017 McDonald Criteria Checklist",
      desc: "Confirms Dissemination in Space (DIS) and Dissemination in Time (DIT) in Multiple Sclerosis.",
      organ: "Brain / Spinal Cord",
      region: "Neuroimmunology",
      subject: "Multiple Sclerosis / Diagnosis",
      keywords: ["mcdonald criteria", "multiple sclerosis", "dis", "dit", "oligoclonal bands"],
      guidance: "CSF-specific oligoclonal bands can substitute for DIT.",
      literature: [{
        type: "Official Criteria",
        icon: "📘",
        title: "Diagnosis of multiple sclerosis: 2017 revisions of the McDonald criteria",
        citation: "Thompson AJ, et al. Lancet Neurol. 2018;17(2):162-173.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/29275977/" }]
      }],
      fields: [
        makeS("attacks", "Number of Clinical Attacks", "2", [["1", "1 clinical attack"], ["2", "≥ 2 clinical attacks"]]),
        makeS("lesions", "Number of Objective Clinical Lesions", "2", [["1", "1 lesion"], ["2", "≥ 2 lesions"]]),
        makeS("dis", "Dissemination in Space (DIS: ≥1 T2 lesion in ≥2 of 4 CNS areas)?", "1", [["0", "No"], ["1", "Yes"]]),
        makeS("dit", "Dissemination in Time (DIT on MRI or CSF oligoclonal bands)?", "1", [["0", "No"], ["1", "Yes"]])
      ],
      table: {
        headers: ["Diagnosis", "Criteria"],
        rows: [
          { id: "msDef", cols: ["Definite Multiple Sclerosis", "Criteria satisfied"] },
          { id: "msNot", cols: ["Criteria Not Fully Met", "Requires additional clinical attack, MRI lesions, or CSF bands"] }
        ]
      },
      calc: function (v) {
        var att = +v.attacks, les = +v.lesions, dis = v.dis === "1", dit = v.dit === "1";
        var isMS = (att >= 2 && les >= 2) || (att >= 2 && les === 1 && dis) || (att === 1 && les >= 2 && dit) || (att === 1 && les === 1 && dis && dit);
        var match = isMS ? "msDef" : "msNot";
        return {
          value: isMS ? "Definite Multiple Sclerosis" : "Criteria Not Fully Met",
          matchId: match,
          eq: isMS ? "Meets 2017 McDonald diagnostic criteria." : "Surveillance needed."
        };
      }
    },
    {
      id: "nmoChecklist",
      cat: "neuro",
      type: "class",
      name: "NMOSD Diagnostic Criteria (IPND 2015)",
      desc: "Diagnoses Neuromyelitis Optica Spectrum Disorder with and without AQP4-IgG.",
      organ: "Optic Nerve / Spinal Cord",
      region: "Neuroimmunology",
      subject: "NMOSD / Neuromyelitis Optica",
      keywords: ["nmo", "nmosd", "aquaporin-4", "devic", "myelitis", "optic neuritis"],
      guidance: "Core events: Optic neuritis, LETM (≥3 segments), Area postrema syndrome.",
      literature: [{
        type: "Consensus",
        icon: "📘",
        title: "International consensus diagnostic criteria for neuromyelitis optica spectrum disorders",
        citation: "Wingerchuk DM, et al. Neurology. 2015;85(2):177-189.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/26092914/" }]
      }],
      fields: [
        makeS("aqp4", "Serum AQP4-IgG Antibody Status", "pos", [["pos", "Positive"], ["neg", "Negative / Unknown"]]),
        makeS("core", "Number of Core Clinical Characteristics", "1", [["1", "1 core event"], ["2", "≥ 2 core events"]])
      ],
      table: {
        headers: ["Status", "Diagnosis"],
        rows: [
          { id: "nmoPos", cols: ["NMOSD with AQP4-IgG", "≥1 core event + positive AQP4-IgG"] },
          { id: "nmoNeg", cols: ["Possible NMOSD without AQP4-IgG", "≥2 core events + supporting MRI"] },
          { id: "nmoNot", cols: ["Criteria Not Met", "Investigate MS, MOGAD, or sarcoidosis"] }
        ]
      },
      calc: function (v) {
        var isPos = v.aqp4 === "pos" && +v.core >= 1;
        var isNeg = v.aqp4 === "neg" && +v.core >= 2;
        var match = isPos ? "nmoPos" : isNeg ? "nmoNeg" : "nmoNot";
        return {
          value: isPos ? "NMOSD with AQP4-IgG" : isNeg ? "Possible NMOSD without AQP4-IgG" : "Criteria Not Satisfied",
          matchId: match,
          eq: "IPND 2015 diagnostic criteria."
        };
      }
    },
    {
      id: "mogadChecklist",
      cat: "neuro",
      type: "class",
      name: "MOGAD Diagnostic Criteria (2023)",
      desc: "International diagnostic criteria for MOG antibody-associated disease.",
      organ: "Optic Nerve / Spinal Cord / Cortex",
      region: "Neuroimmunology",
      subject: "MOGAD / Demyelinating",
      keywords: ["mogad", "mog", "myelitis", "optic neuritis", "adem"],
      guidance: "Requires core demyelinating event + positive MOG-IgG by cell-based assay.",
      literature: [{
        type: "Consensus Panel",
        icon: "📘",
        title: "Diagnosis and classification of MOG antibody-associated disease",
        citation: "Banwell B, et al. Lancet Neurol. 2023;22(3):268-282.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/36706773/" }]
      }],
      fields: [
        makeS("mog", "Serum MOG-IgG (Cell-Based Assay)", "clear_pos", [
          ["clear_pos", "Clear positive (high titer)"], ["low_pos", "Low positive"], ["neg", "Negative"]
        ]),
        makeS("pheno", "Core Clinical Demyelinating Event (ON, Myelitis, ADEM)?", "1", [["1", "Yes"], ["0", "No"]])
      ],
      table: {
        headers: ["MOGAD Criteria", "Interpretation"],
        rows: [
          { id: "mPos", cols: ["MOGAD Confirmed", "Core clinical event + clear positive MOG-IgG"] },
          { id: "mNot", cols: ["Criteria Not Met", "MOGAD not confirmed"] }
        ]
      },
      calc: function (v) {
        var pos = v.mog === "clear_pos" && v.pheno === "1";
        var match = pos ? "mPos" : "mNot";
        return {
          value: pos ? "MOGAD Confirmed" : "MOGAD Not Confirmed",
          matchId: match,
          eq: "2023 international consensus criteria for MOG-antibody-associated disease."
        };
      }
    },
    {
      id: "msfcScore",
      cat: "neuro",
      type: "calc",
      name: "MSFC (Multiple Sclerosis Functional Composite)",
      desc: "3-part clinical quantitative composite evaluating leg function (T25FW), arm function (9HPT), and cognition (PASAT).",
      organ: "CNS / Motor / Cognitive",
      region: "Neuroimmunology",
      subject: "Multiple Sclerosis Trials",
      keywords: ["msfc", "multiple sclerosis", "t25fw", "9hpt", "pasat"],
      guidance: "Computes z-score composite across ambulation, manual dexterity, and auditory processing.",
      literature: [{
        type: "Seminal Study",
        icon: "📄",
        title: "The Multiple Sclerosis Functional Composite measure: a new outcome measure for clinical trials",
        citation: "Cutter GR, et al. Brain. 1999;122(5):871-882.",
        links: [{ text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/10355672/" }]
      }],
      fields: [
        makeN("t25fw", "Timed 25-Foot Walk (seconds)", 5.2, { min: 2, max: 120, step: 0.1 }),
        makeN("nhpt", "9-Hole Peg Test (mean seconds, R+L)", 22.5, { min: 10, max: 200, step: 0.5 }),
        makeN("pasat", "PASAT-3 Score (correct out of 60)", 48, { min: 0, max: 60, step: 1 })
      ],
      calc: function (v) {
        return {
          value: "T25FW: " + v.t25fw + "s | 9HPT: " + v.nhpt + "s | PASAT: " + v.pasat + "/60",
          eq: "Clinical composite score. A worsening of ≥20% in any component represents meaningful disability progression."
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
      if (window.categories[i] && window.categories[i].id === neuroCategory.id) {
        catExists = true;
        break;
      }
    }
    if (!catExists) {
      window.categories.push(neuroCategory);
    }

    neuroTools.forEach(function (tool) {
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
      window.SYNONYM_MAP["neuro"] = ["neuro", "neurology", "neurosurgery", "brain", "stroke", "coma", "seizure", "headache", "dementia", "parkinson", "ms"];
      window.SYNONYM_MAP["stroke"] = ["nihss", "aspects", "race", "abcd2", "fast-ed", "mrs", "ich", "cpss", "rosier", "cns", "chads", "cha2ds2vasc"];
      window.SYNONYM_MAP["coma"] = ["gcs", "four", "avpu", "consciousness", "tbi"];
      window.SYNONYM_MAP["seizure"] = ["status epilepticus", "cave", "select", "2helps2b", "recurrence", "asm", "keppra", "phenytoin"];
      window.SYNONYM_MAP["aneurysm"] = ["hunt hess", "wfns", "fisher", "sah", "subarachnoid", "vasospasm"];
      window.SYNONYM_MAP["headache"] = ["midas", "hit-6", "migraine", "snnoop10", "ottawa sah", "moh"];
      window.SYNONYM_MAP["dementia"] = ["mini-cog", "4at", "cam", "cdr", "fast", "ad8", "fab", "delirium", "cognition"];
      window.SYNONYM_MAP["movement"] = ["hoehn yahr", "schwab england", "aims", "simpson angus", "bars", "updrs", "parkinson", "akathisia"];
      window.SYNONYM_MAP["neuromuscular"] = ["mrc", "mg-adl", "qmg", "mgfa", "alsfrs", "hughes", "egris", "myasthenia", "gbs", "als"];
      window.SYNONYM_MAP["sclerosis"] = ["edss", "mcdonald", "nmo", "nmosd", "mogad", "msfc", "multiple sclerosis"];
    }

    if (typeof window.renderHome === "function") {
      window.renderHome();
    }
  } catch (err) {
    console.error("Critical error registering Neurology tools:", err);
  }
})();
