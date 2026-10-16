// neuro.js
(function () {
  window.MedCalcModules = window.MedCalcModules || [];

  const category = {
    id: "neuro",
    name: "Neurology",
    icon: "🧠",
    desc: "Coma, stroke, epilepsy, neuromuscular, cognitive, and movement disorders"
  };

  const guidance = {
    // Consciousness & Neurological Exam
    gcs: [
      "Glasgow Coma Scale ranges from 3 to 15 based on Eye (1–4), Verbal (1–5), and Motor (1–6) responses. Scores 13–15 reflect mild, 9–12 moderate, and ≤8 severe impairment / coma.",
      "Bedside standard for serial assessment of consciousness and acute brain injury severity."
    ],
    fourScore: [
      "The Full Outline of UnResponsiveness (FOUR) score evaluates Eye (0–4), Motor (0–4), Brainstem reflexes (0–4), and Respiration (0–4). Total 0–16.",
      "Validates coma depth without requiring verbal response, making it suitable for intubated ICU patients."
    ],
    avpuScale: [
      "AVPU rapidly stratifies responsiveness: Alert, responds to Voice, responds to Pain, or Unresponsive.",
      "Used in rapid first-responder and emergency triage before full GCS scoring."
    ],
    nihssPlanned: [
      "The 11-item National Institutes of Health Stroke Scale (NIHSS) assesses acute stroke impairment deficit.",
      "Standardizes neurological deficit measurement to guide reperfusion and monitor evolution."
    ],
    mrsScore: [
      "Modified Rankin Scale (mRS) measures post-stroke functional disability: 0 (no symptoms) to 5 (severe disability/bedridden), 6 denotes death.",
      "Standard primary functional endpoint for stroke clinical trials and rehabilitation."
    ],
    huntHess: [
      "Grades clinical severity of aneurysmal subarachnoid hemorrhage from Grade 1 (asymptomatic/mild headache) to Grade 5 (deep coma/decerebrate posturing).",
      "Correlates clinical state with perioperative mortality in aneurysmal SAH."
    ],
    wfnsSah: [
      "World Federation of Neurosurgical Societies (WFNS) SAH grading combines GCS and presence of focal motor deficits.",
      "Standardized grading scheme for predicting outcome after aneurysmal SAH."
    ],
    ichScore: [
      "Predicts 30-day mortality in primary intracerebral hemorrhage using GCS, age, ICH volume, IVH presence, and infratentorial origin. Scores 0–6.",
      "Risk-stratification score for spontaneous intracerebral hemorrhage."
    ],
    fisherScale: [
      "Modified Fisher scale classifies SAH blood volume and IVH on CT to predict cerebral vasospasm and delayed cerebral ischemia (DCI).",
      "Guides surveillance and prophylactic hemodynamic management for post-SAH vasospasm."
    ],

    // Stroke & Cerebrovascular Disease
    abcd2: [
      "ABCD² estimates stroke risk at 2, 7, and 90 days following TIA: 0–3 low risk, 4–5 moderate risk, 6–7 high risk.",
      "Aids disposition and urgent imaging triage in acute transient ischemic attack."
    ],
    abcd3i: [
      "ABCD³-I incorporates dual TIA within 7 days and acute DWI infarction on MRI / carotid stenosis to refine post-TIA stroke prediction.",
      "Specialist stroke clinic risk stratification incorporating neurovascular imaging."
    ],
    aspectsScore: [
      "Alberta Stroke Program Early CT Score (ASPECTS) grades early ischemic changes in the MCA territory out of 10 points (subtracting 1 point per involved region).",
      "Determines eligibility for mechanical thrombectomy and thrombolysis in acute anterior circulation stroke."
    ],
    raceScore: [
      "Rapid Arterial oCclusion Evaluation (RACE) score screens for large vessel occlusion (LVO) in prehospital triage: score ≥5 predicts LVO.",
      "Helps EMS identify candidates for direct transport to endovascular-capable comprehensive stroke centers."
    ],
    fastEdScore: [
      "Field Assessment Stroke Triage for Emergency Destination (FAST-ED): score ≥4 predicts large vessel occlusion with high sensitivity/specificity.",
      "Prehospital LVO screening tool."
    ],
    cpssScore: [
      "Cincinnati Prehospital Stroke Scale evaluates facial droop, arm drift, and abnormal speech. 1 abnormal item confers ~72% probability of acute stroke.",
      "Rapid prehospital screening rule for emergency dispatch and paramedics."
    ],
    rosierScore: [
      "Recognition of Stroke in the Emergency Room (ROSIER) tool differentiates acute stroke from stroke mimics. Score >0 indicates probable stroke.",
      "Emergency room bedside recognition tool."
    ],
    cnsScore: [
      "Canadian Neurological Scale evaluates mentation and motor deficit in acute stroke patients.",
      "Bedside serial monitoring tool for non-comatose acute stroke patients."
    ],
    cha2ds2vascRef: [
      "Cross-references stroke risk in non-valvular atrial fibrillation to guide oral anticoagulation.",
      "Cardioembolic stroke prevention standard."
    ],

    // Seizures & Epilepsy
    statusEpilepticus: [
      "Status epilepticus time checkpoints: t1 (5 min: time to initiate treatment) and t2 (30 min: time when long-term neuronal injury begins).",
      "Standardizes rapid escalation of rescue benzodiazepines and second-line antiseizure infusions."
    ],
    caveScore: [
      "CAVE score estimates late seizure risk after intracerebral hemorrhage based on Cortical involvement, Age <65, Volume >10 mL, and Early seizure.",
      "Assesses secondary epileptogenesis risk post-ICH."
    ],
    selectScore: [
      "SeLECT score predicts risk of late unprovoked seizures after ischemic stroke using Severity, Large artery atherosclerosis, Early seizures, Cortical involvement, and Territory.",
      "Identifies patients at high risk of post-stroke epilepsy."
    ],
    twoHelps2b: [
      "2HELPS2B score calculates 72-hour seizure risk in critically ill patients undergoing continuous EEG: score ≥2 warrants prolonged cEEG monitoring.",
      "Guides continuous EEG duration and seizure prophylaxis in neuro-ICU patients."
    ],
    seizureDiaryPlanned: [
      "Planned — longitudinal seizure frequency and trigger tracker.",
      "Logging module planned for future phase."
    ],
    seizureRecurrence: [
      "Stratifies risk of a second unprovoked seizure after a first event based on neuroimaging, abnormal EEG, nocturnal occurrence, and prior neurological deficit.",
      "Aids decision to start antiseizure medication after a single seizure."
    ],
    asmDosingHelper: [
      "Provides standard maintenance dose ranges and renal adjustment considerations for common antiseizure medications (Levetiracetam, Lacosamide, Lamotrigine, Phenytoin).",
      "Guides safe therapeutic dosing and adjustment in kidney impairment."
    ],

    // Neuromuscular Disorders
    mrcGrading: [
      "MRC scale grades muscle strength from 0 (no movement) to 5 (normal power against full resistance).",
      "Standard neurological bedside manual muscle testing scale."
    ],
    mrcSumScore: [
      "MRC sum score evaluates 6 bilateral muscle groups (shoulder abduction, elbow flexion, wrist extension, hip flexion, knee extension, ankle dorsiflexion). Range 0–60. Score <48 indicates significant ICU-acquired weakness.",
      "Quantifies limb weakness in Guillain–Barré syndrome and critical illness polyneuromyopathy."
    ],
    mgAdlScore: [
      "Myasthenia Gravis Activities of Daily Living (MG-ADL) assesses ocular, bulbar, respiratory, and limb impairment from 0 to 24 points.",
      "Tracks patient-reported functional status and response to therapy in myasthenia gravis."
    ],
    qmgPlanned: [
      "Planned — Quantitative Myasthenia Gravis (QMG) formal physician-administered testing score.",
      "Objective examination tool planned for future expansion."
    ],
    mgfaClass: [
      "MGFA Clinical Classification stages myasthenia gravis from Class I (pure ocular) to Class V (intubation required).",
      "Categorizes clinical severity and distribution of weakness in myasthenia gravis."
    ],
    alsfrsScore: [
      "ALS Functional Rating Scale Revised (ALSFRS-R) monitors functional decline in amyotrophic lateral sclerosis across bulbar, fine motor, gross motor, and respiratory domains (0–48).",
      "Prognostic and functional progression scale in ALS/MND."
    ],
    hughesGbs: [
      "Hughes GBS Disability Scale grades functional mobility from 0 (healthy) to 6 (death); Grade 3 = able to walk 5m with aid, Grade 4 = bedbound.",
      "Clinical staging of Guillain–Barré syndrome severity and recovery."
    ],
    egrisScore: [
      "Erasmus GBS Respiratory Insufficiency Score (EGRIS) estimates the probability of mechanical ventilation within 1 week of admission in Guillain–Barré syndrome.",
      "Guides proactive ICU admission and intubation planning in early GBS."
    ],

    // Headache & Migraine
    midasScore: [
      "Migraine Disability Assessment (MIDAS) calculates missed and reduced productive days over the past 3 months: Grade I (0–5), II (6–10), III (11–20), IV (≥21).",
      "Determines the need for preventive migraine therapy."
    ],
    hit6Score: [
      "Headache Impact Test (HIT-6) scores functional limitation and emotional burden: ≤49 little impact, 50–55 moderate, 56–59 substantial, ≥60 severe impact.",
      "Measures headache burden to guide treatment escalation."
    ],
    migraineScreen: [
      "ID-Migraine 3-item screener: Nausea, Photophobia, and Disability. 2 or 3 positive responses yield a 93% positive predictive value for migraine.",
      "Primary care diagnostic screener for undiagnosed migraine."
    ],
    snnoop10: [
      "SNNOOP10 red-flag checklist screens for secondary, potentially life-threatening causes of acute headache.",
      "Systematic safety checklist before diagnosing benign primary headache."
    ],
    ottawaSah: [
      "Ottawa SAH Rule identifies alert adult emergency patients with acute non-traumatic headache who require CT/LP to exclude subarachnoid hemorrhage. 100% sensitive.",
      "Decides which acute peak-onset headaches require urgent neuroimaging."
    ],
    mohScreen: [
      "Medication-overuse headache is suspected with headache ≥15 days/month and regular overuse of acute analgesics/triptans for >3 months.",
      "Identifies secondary chronic headache driven by medication rebound."
    ],

    // Cognition & Dementia
    mmsePlanned: [
      "Planned — Mini-Mental State Examination (copyright-restricted diagnostic cognitive examination).",
      "Global cognitive impairment screen."
    ],
    mocaPlanned: [
      "Planned — Montreal Cognitive Assessment (requires certified training and formal administration).",
      "Sensitive screen for mild cognitive impairment."
    ],
    miniCog: [
      "Mini-Cog combines 3-word recall with a clock drawing test. Score ≤2 indicates high likelihood of cognitive impairment.",
      "Rapid 3-minute cognitive screen suitable for clinic and bedside use."
    ],
    fourAtDelirium: [
      "4AT rapid clinical test for delirium and cognitive impairment: Alertness, AMT4, Attention (months backward), and Acute change. Score ≥4 indicates delirium.",
      "Routine emergency and inpatient delirium screening tool."
    ],
    camDelirium: [
      "Confusion Assessment Method (CAM) diagnoses delirium if Feature 1 (acute onset & fluctuation) AND Feature 2 (inattention) are present, plus either Feature 3 (disorganized thinking) OR Feature 4 (altered level of consciousness).",
      "Standard bedside diagnostic algorithm for delirium."
    ],
    cdrScore: [
      "Clinical Dementia Rating (CDR) stages dementia into 0 (None), 0.5 (Very mild), 1 (Mild), 2 (Moderate), and 3 (Severe) across 6 cognitive domains.",
      "Semi-structured clinical staging tool for Alzheimer's disease and related dementias."
    ],
    fastStaging: [
      "Functional Assessment Staging (FAST) monitors functional progression through 7 stages of Alzheimer's disease.",
      "Tracks functional loss and hospice eligibility in advanced dementia."
    ],
    ad8Screen: [
      "AD8 Informant Interview screens for cognitive changes. A score of ≥2 positive changes indicates cognitive impairment.",
      "Brief 8-item informant questionnaire."
    ],
    fabScore: [
      "Frontal Assessment Battery (FAB) evaluates executive dysfunction through 6 subtests (0–18). Score <12 suggests frontal lobe / executive dysfunction.",
      "Differentiates frontotemporal lobar degeneration and subcortical dementias."
    ],

    // Movement Disorders
    updrsPlanned: [
      "Planned — Movement Disorder Society Unified Parkinson's Disease Rating Scale (MDS-UPDRS).",
      "Comprehensive research and specialty motor assessment battery."
    ],
    hoehnYahr: [
      "Hoehn and Yahr stages Parkinson's disease progression from Stage 1 (unilateral) to Stage 5 (wheelchair-bound/bedridden).",
      "Clinical staging of postural instability and bilateral involvement in Parkinson's disease."
    ],
    schwabEngland: [
      "Schwab and England Activities of Daily Living scale rates independence from 100% (completely independent) to 0% (bedridden, vegetative).",
      "Functional disability score for Parkinsonian conditions."
    ],
    aimsScore: [
      "Abnormal Involuntary Movement Scale (AIMS) monitors tardive dyskinesia in patients on dopamine-blocking medications across facial, extremity, and trunk movements.",
      "Standard screening scale for drug-induced tardive dyskinesia."
    ],
    simpsonAngus: [
      "Simpson–Angus Scale (SAS) evaluates neuroleptic-induced extrapyramidal symptoms and rigidity across 10 items.",
      "Quantifies neuroleptic-induced Parkinsonian rigidity and hypokinesia."
    ],
    barnesAkathisia: [
      "Barnes Akathisia Rating Scale (BARS) assesses drug-induced subjective restlessness and observable motor pacing/fidgeting.",
      "Standard diagnostic scale for medication-induced akathisia."
    ],
    uhdrsPlanned: [
      "Planned — Unified Huntington's Disease Rating Scale (comprehensive motor, cognitive, and behavioral assessment).",
      "Specialty assessment tool for Huntington disease."
    ],

    // Multiple Sclerosis & Neuroinflammation
    edssScore: [
      "Expanded Disability Status Scale (EDSS) grades disability in multiple sclerosis from 0 (normal) to 10 (death from MS). EDSS 4.0 = significant disability but self-sufficient; 6.0 = requires unilateral walking assistance.",
      "Gold-standard primary outcome measure in multiple sclerosis trials and clinics."
    ],
    msfcPlanned: [
      "Planned — Multiple Sclerosis Functional Composite (Timed 25-Foot Walk, 9-Hole Peg Test, PASAT).",
      "Three-part quantitative multidimensional MS assessment battery."
    ],
    mcdonaldChecklist: [
      "2017 McDonald Criteria checklist confirms dissemination in space (DIS) and dissemination in time (DIT) in suspected multiple sclerosis.",
      "Standard diagnostic criteria for relapsing-remitting multiple sclerosis."
    ],
    nmoChecklist: [
      "2015 IPND criteria for Neuromyelitis Optica Spectrum Disorder (NMOSD) with and without AQP4-IgG antibodies.",
      "Differentiates autoimmune astrocytopathy from multiple sclerosis."
    ],
    mogadChecklist: [
      "2023 international diagnostic criteria for MOG-antibody-associated disease (MOGAD) presenting with ON, myelitis, ADEM, or cortical encephalitis.",
      "Differentiates MOGAD from NMOSD and typical MS."
    ]
  };

  const tools = [
    // ==========================================
    // A. CONSCIOUSNESS AND NEUROLOGICAL EXAMINATION
    // ==========================================
    {
      id: "gcs",
      cat: "neuro",
      subcat: "Consciousness and Neurological Examination",
      name: "Glasgow Coma Scale (GCS)",
      desc: "Eye, verbal, and motor responsiveness scoring for acute brain injury and coma.",
      fields: [
        S("eye", "Eye opening response", "4", [
          ["4", "4 — Spontaneous"],
          ["3", "3 — To sound / speech"],
          ["2", "2 — To pressure / pain"],
          ["1", "1 — None"]
        ]),
        S("verbal", "Verbal response", "5", [
          ["5", "5 — Oriented"],
          ["4", "4 — Confused"],
          ["3", "3 — Inappropriate words"],
          ["2", "2 — Incomprehensible sounds"],
          ["1", "1 — None"]
        ]),
        S("motor", "Motor response", "6", [
          ["6", "6 — Obeys commands"],
          ["5", "5 — Localizes pain"],
          ["4", "4 — Normal flexion (withdrawal)"],
          ["3", "3 — Abnormal flexion (decorticate)"],
          ["2", "2 — Extension (decerebrate)"],
          ["1", "1 — None"]
        ])
      ],
      calc: v => {
        const total = +v.eye + +v.verbal + +v.motor;
        let c = total <= 8 ? "Severe brain injury / Coma (≤8)" : total <= 12 ? "Moderate brain injury (9–12)" : "Mild brain injury (13–15)";
        return {
          value: total + " / 15 (E" + v.eye + " V" + v.verbal + " M" + v.motor + ") — " + c,
          eq: "GCS = Eye (1–4) + Verbal (1–5) + Motor (1–6). Record components separately in intubated or sedated patients."
        };
      }
    },
    {
      id: "fourScore",
      cat: "neuro",
      subcat: "Consciousness and Neurological Examination",
      name: "FOUR Score",
      desc: "Coma scale evaluating eye, motor, brainstem reflexes, and respiratory drive.",
      fields: [
        S("eye", "Eye response (E)", "4", [
          ["4", "4 — Eyelids open, tracking, or blinking to command"],
          ["3", "3 — Eyelids open but not tracking"],
          ["2", "2 — Eyelids closed, opens to loud voice"],
          ["1", "1 — Eyelids closed, opens to pain"],
          ["0", "0 — Eyelids remain closed with pain"]
        ]),
        S("motor", "Motor response (M)", "4", [
          ["4", "4 — Thumbs-up, fist, or peace sign"],
          ["3", "3 — Localizing pain"],
          ["2", "2 — Flexion response to pain"],
          ["1", "1 — Extensor posturing to pain"],
          ["0", "0 — No response to pain / generalized myoclonus"]
        ]),
        S("brainstem", "Brainstem reflexes (B)", "4", [
          ["4", "4 — Pupillary and corneal reflexes present"],
          ["3", "3 — One pupil wide and fixed"],
          ["2", "2 — Pupillary or corneal reflexes absent"],
          ["1", "1 — Both pupillary and corneal reflexes absent"],
          ["0", "0 — Absent pupil, corneal, and cough reflex"]
        ]),
        S("respiration", "Respiration pattern (R)", "4", [
          ["4", "4 — Regular breathing, not intubated"],
          ["3", "3 — Cheyne-Stokes breathing, not intubated"],
          ["2", "2 — Irregular breathing, not intubated"],
          ["1", "1 — Intubated, breathes above ventilator rate"],
          ["0", "0 — Intubated, breathes at ventilator rate or apnea"]
        ])
      ],
      calc: v => {
        const total = +v.eye + +v.motor + +v.brainstem + +v.respiration;
        return {
          value: total + " / 16 (E" + v.eye + " M" + v.motor + " B" + v.brainstem + " R" + v.respiration + ")",
          eq: "FOUR Score (0–16). Does not require verbal response; validated for intubated ICU patients."
        };
      }
    },
    {
      id: "avpuScale",
      cat: "neuro",
      subcat: "Consciousness and Neurological Examination",
      name: "AVPU Consciousness Scale",
      desc: "Rapid triage classification of consciousness.",
      fields: [
        S("level", "Responsiveness level", "A", [
          ["A", "Alert — Spontaneously alert and oriented"],
          ["V", "Voice — Responds to verbal stimulus"],
          ["P", "Pain — Responds only to painful stimulus"],
          ["U", "Unresponsive — Completely unresponsive to all stimuli"]
        ])
      ],
      calc: v => ({
        value: "AVPU Category: " + v.level,
        eq: "A correlates with GCS 15; V ~ GCS 12–13; P ~ GCS 8–9; U ~ GCS ≤6. Any patient at 'P' or 'U' requires immediate airway assessment."
      })
    },
    {
      id: "nihssPlanned",
      cat: "neuro",
      subcat: "Consciousness and Neurological Examination",
      name: "NIH Stroke Scale (NIHSS)",
      desc: "Planned — 11-item acute neurological impairment stroke deficit scale.",
      planned: true
    },
    {
      id: "mrsScore",
      cat: "neuro",
      subcat: "Consciousness and Neurological Examination",
      name: "Modified Rankin Scale (mRS)",
      desc: "Measures degree of disability or dependence in daily activities after stroke.",
      fields: [
        S("grade", "Functional disability grade", "0", [
          ["0", "0 — No symptoms at all"],
          ["1", "1 — No significant disability; able to carry out all usual duties despite symptoms"],
          ["2", "2 — Slight disability; unable to carry out all previous activities, but independent"],
          ["3", "3 — Moderate disability; requires some help, but walks without assistance"],
          ["4", "4 — Moderately severe disability; unable to walk or attend to bodily needs without help"],
          ["5", "5 — Severe disability; bedridden, incontinent, requiring constant nursing care"],
          ["6", "6 — Dead"]
        ])
      ],
      calc: v => ({
        value: "mRS Grade " + v.grade + " (" + (+v.grade <= 2 ? "Functional independence" : "Dependent or dead") + ")",
        eq: "Modified Rankin Scale. Scores 0–2 define functional independence; standard primary outcome measure in stroke reperfusion trials."
      })
    },
    {
      id: "huntHess",
      cat: "neuro",
      subcat: "Consciousness and Neurological Examination",
      name: "Hunt and Hess Scale",
      desc: "Clinical severity and surgical mortality predictor in aneurysmal subarachnoid hemorrhage.",
      fields: [
        S("grade", "Clinical status", "1", [
          ["1", "Grade 1 — Asymptomatic or mild headache and slight nuchal rigidity (~30% mortality)"],
          ["2", "Grade 2 — Moderate-to-severe headache, nuchal rigidity, cranial nerve palsy (~40% mortality)"],
          ["3", "Grade 3 — Drowsiness, confusion, or mild focal deficit (~50% mortality)"],
          ["4", "Grade 4 — Stupor, moderate-to-severe hemiparesis, early decerebrate rigidity (~80% mortality)"],
          ["5", "Grade 5 — Deep coma, decerebrate posturing, moribund (~90% mortality)"]
        ])
      ],
      calc: v => ({
        value: "Hunt and Hess " + v.grade,
        eq: "Severe systemic disease (HTN, DM, severe atherosclerosis, COPD) adds 1 grade to the classification."
      })
    },
    {
      id: "wfnsSah",
      cat: "neuro",
      subcat: "Consciousness and Neurological Examination",
      name: "WFNS SAH Grading",
      desc: "World Federation of Neurosurgical Societies scale combining GCS and motor deficit.",
      fields: [
        N("gcs", "Glasgow Coma Scale (3–15)", 15, { min: 3, max: 15, step: 1 }),
        S("focal", "Major focal motor deficit present?", "0", [["0", "No (absent)"], ["1", "Yes (hemiparesis / hemiplegia)"]])
      ],
      calc: v => {
        const g = +v.gcs, f = +v.focal;
        let grade = "";
        if (g === 15 && !f) grade = "Grade I (GCS 15, no motor deficit)";
        else if (g >= 13 && !f) grade = "Grade II (GCS 13–14, no motor deficit)";
        else if (g >= 13 && f) grade = "Grade III (GCS 13–14 WITH focal motor deficit)";
        else if (g >= 7) grade = "Grade IV (GCS 7–12 with or without motor deficit)";
        else grade = "Grade V (GCS 3–6 with or without motor deficit)";
        return {
          value: "WFNS " + grade,
          eq: "WFNS grading standardizes prognostic stratification in aneurysmal subarachnoid hemorrhage."
        };
      }
    },
    {
      id: "ichScore",
      cat: "neuro",
      subcat: "Consciousness and Neurological Examination",
      name: "ICH Score",
      desc: "Predicts 30-day mortality in primary spontaneous intracerebral hemorrhage.",
      fields: [
        N("gcs", "GCS Score (3–15)", 14, { min: 3, max: 15, step: 1 }),
        N("age", "Age (years)", 62, { min: 18, max: 110 }),
        S("vol", "ICH Volume", "0", [["0", "<30 mL (0)"], ["1", "≥30 mL (+1)"]]),
        S("ivh", "Intraventricular Hemorrhage (IVH)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("infra", "Infratentorial origin", "0", [["0", "No / Supratentorial (0)"], ["1", "Yes / Infratentorial (+1)"]])
      ],
      calc: v => {
        let pts = +v.vol + +v.ivh + +v.infra;
        const g = +v.gcs;
        if (g <= 4) pts += 2; else if (g <= 12) pts += 1;
        if (+v.age >= 80) pts += 1;

        let mort = pts === 0 ? "0%" : pts === 1 ? "13%" : pts === 2 ? "26%" : pts === 3 ? "72%" : pts === 4 ? "97%" : "100%";
        return {
          value: pts + " / 6 points — Estimated 30-day mortality: " + mort,
          eq: "ICH Score: GCS 3–4 (+2), GCS 5–12 (+1), Age ≥80 (+1), ICH Volume ≥30 mL (+1), IVH (+1), Infratentorial (+1)."
        };
      }
    },
    {
      id: "fisherScale",
      cat: "neuro",
      subcat: "Consciousness and Neurological Examination",
      name: "Fisher / Modified Fisher Scale",
      desc: "CT grading of SAH and intraventricular blood to predict symptomatic cerebral vasospasm.",
      fields: [
        S("mod", "Modified Fisher Grade (Frontera criteria)", "1", [
          ["1", "Grade 1 — Minimal or thin SAH without bilateral IVH (low vasospasm risk ~24%)"],
          ["2", "Grade 2 — Minimal or thin SAH with bilateral IVH (~33% vasospasm risk)"],
          ["3", "Grade 3 — Thick cisternal SAH without bilateral IVH (~33% vasospasm risk)"],
          ["4", "Grade 4 — Thick cisternal SAH WITH bilateral IVH (highest vasospasm risk ~40%)"]
        ])
      ],
      calc: v => ({
        value: "Modified Fisher " + v.mod,
        eq: "Thick SAH = completely fills ≥1 cistern or fissure. Modified Fisher grade 4 conveys highest risk of delayed cerebral ischemia."
      })
    },

    // ==========================================
    // B. STROKE AND CEREBROVASCULAR DISEASE
    // ==========================================
    {
      id: "abcd2",
      cat: "neuro",
      subcat: "Stroke and Cerebrovascular Disease",
      name: "ABCD² Score (TIA)",
      desc: "Predicts stroke risk at 2, 7, and 90 days following a transient ischemic attack.",
      fields: [
        S("age", "Age ≥60 years", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("bp", "Blood pressure ≥140/90 mmHg at assessment", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("clinical", "Clinical presentation", "0", [
          ["0", "Other symptoms (0)"],
          ["1", "Speech disturbance without unilateral weakness (+1)"],
          ["2", "Unilateral weakness with or without speech (+2)"]
        ]),
        S("duration", "Duration of symptoms", "0", [
          ["0", "<10 minutes (0)"],
          ["1", "10–59 minutes (+1)"],
          ["2", "≥60 minutes (+2)"]
        ]),
        S("dm", "Diabetes mellitus", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      calc: v => {
        const score = +v.age + +v.bp + +v.clinical + +v.duration + +v.dm;
        let c = score <= 3 ? "Low risk (2-day stroke risk ~1.0%)" : score <= 5 ? "Moderate risk (2-day stroke risk ~4.1%)" : "High risk (2-day stroke risk ~8.1%)";
        return {
          value: score + " / 7 points — " + c,
          eq: "ABCD²: Age ≥60 (+1), BP ≥140/90 (+1), Clinical weakness (+2) or speech (+1), Duration ≥60m (+2) or 10–59m (+1), Diabetes (+1)."
        };
      }
    },
    {
      id: "abcd3i",
      cat: "neuro",
      subcat: "Stroke and Cerebrovascular Disease",
      name: "ABCD³-I Score",
      desc: "Incorporates dual TIA and neurovascular imaging (DWI / carotid stenosis) to refine TIA risk.",
      fields: [
        N("abcd2", "Baseline ABCD² Score (0–7)", 4, { min: 0, max: 7, step: 1 }),
        S("dual", "Dual TIA (another TIA within preceding 7 days)", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        S("dwi", "Acute infarction on DWI MRI", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        S("stenosis", "Ipsilateral internal carotid stenosis ≥50%", "0", [["0", "No (0)"], ["2", "Yes (+2)"]])
      ],
      calc: v => {
        const score = +v.abcd2 + +v.dual + +v.dwi + +v.stenosis;
        let tier = score <= 3 ? "Low risk" : score <= 7 ? "Moderate risk" : "High risk (~13% 7-day stroke risk)";
        return {
          value: score + " / 13 points — " + tier,
          eq: "ABCD³-I = ABCD² (0–7) + Dual TIA (+2) + DWI infarction (+2) + Carotid stenosis ≥50% (+2)."
        };
      }
    },
    {
      id: "aspectsScore",
      cat: "neuro",
      subcat: "Stroke and Cerebrovascular Disease",
      name: "ASPECTS (Early Ischemic Changes on CT)",
      desc: "10-point non-contrast CT score for acute anterior circulation ischemic changes.",
      fields: [
        N("subtractions", "Number of ischemic regions involved (0 to 10)", 2, { min: 0, max: 10, step: 1 })
      ],
      calc: v => {
        const score = 10 - +v.subtractions;
        let c = score >= 6 ? "Favorable for mechanical thrombectomy (score 6–10)" : "Large ischemic core (score 0–5; high hemorrhage risk)";
        return {
          value: "ASPECTS " + score + " / 10 — " + c,
          eq: "Starts at 10. Subtract 1 point each for early ischemic change in: Caudate, Lentiform, Internal capsule, Insula, M1, M2, M3, M4, M5, M6."
        };
      }
    },
    {
      id: "raceScore",
      cat: "neuro",
      subcat: "Stroke and Cerebrovascular Disease",
      name: "RACE Score (Prehospital Stroke Assessment)",
      desc: "Prehospital screening scale for large vessel occlusion (LVO) stroke.",
      fields: [
        S("face", "Facial palsy", "0", [["0", "Absent / symmetrical (0)"], ["1", "Mild / asymmetrical (1)"], ["2", "Severe / total paralysis (2)"]]),
        S("arm", "Arm motor function", "0", [["0", "Normal / holds 10s (0)"], ["1", "Moderate / drifts down (1)"], ["2", "Severe / unable to raise (2)"]]),
        S("leg", "Leg motor function", "0", [["0", "Normal / holds 5s (0)"], ["1", "Moderate / drifts down (1)"], ["2", "Severe / unable to raise (2)"]]),
        S("gaze", "Head and gaze deviation", "0", [["0", "Absent (0)"], ["1", "Present (1)"]]),
        S("cortical", "Aphasia / Agnosia", "0", [
          ["0", "Normal (0)"],
          ["1", "Performs 1 of 2 commands / recognizes arm (1)"],
          ["2", "Performs 0 commands / ignores arm completely (2)"]
        ])
      ],
      calc: v => {
        const total = +v.face + +v.arm + +v.leg + +v.gaze + +v.cortical;
        let lvo = total >= 5 ? "High probability of Large Vessel Occlusion (LVO) — score ≥5" : "Low probability of LVO (score <5)";
        return {
          value: total + " / 9 points — " + lvo,
          eq: "RACE score ≥5 has ~85% sensitivity and ~68% specificity for large vessel occlusion. Triage directly to EVT-capable center."
        };
      }
    },
    {
      id: "fastEdScore",
      cat: "neuro",
      subcat: "Stroke and Cerebrovascular Disease",
      name: "FAST-ED Score",
      desc: "Field Assessment Stroke Triage for Emergency Destination.",
      fields: [
        S("face", "Facial palsy", "0", [["0", "Normal / minor (0)"], ["1", "Partial or complete (1)"]]),
        S("arm", "Arm weakness", "0", [["0", "No drift (0)"], ["1", "Drift or some effort (1)"], ["2", "No movement (2)"]]),
        S("speech", "Speech changes", "0", [["0", "Normal (0)"], ["1", "Mild-to-moderate aphasia/dysarthria (1)"], ["2", "Severe receptive/expressive aphasia (2)"]]),
        S("eye", "Eye deviation", "0", [["0", "Normal (0)"], ["1", "Partial (1)"], ["2", "Forced deviation (2)"]]),
        S("denial", "Extinction / Neglect", "0", [["0", "Absent (0)"], ["1", "Extinction to 1 sensory modality (1)"], ["2", "Profound extinction / anosognosia (2)"]])
      ],
      calc: v => {
        const score = +v.face + +v.arm + +v.speech + +v.eye + +v.denial;
        return {
          value: score + " / 9 points — " + (score >= 4 ? "High likelihood of LVO (FAST-ED ≥4)" : "LVO unlikely (<4)"),
          eq: "FAST-ED score ≥4 has comparable accuracy to NIHSS ≥10 for identifying large vessel occlusions."
        };
      }
    },
    {
      id: "cpssScore",
      cat: "neuro",
      subcat: "Stroke and Cerebrovascular Disease",
      name: "Cincinnati Prehospital Stroke Scale",
      desc: "Rapid 3-item prehospital stroke screening rule.",
      fields: [
        S("face", "Facial droop (show teeth or smile)", "0", [["0", "Normal / both sides move equally"], ["1", "Abnormal / one side droops"]]),
        S("arm", "Arm drift (close eyes, hold arms out 10s)", "0", [["0", "Normal / both arms move same"], ["1", "Abnormal / one arm drifts down"]]),
        S("speech", "Abnormal speech ('You can't teach an old dog new tricks')", "0", [["0", "Normal / uses correct words"], ["1", "Abnormal / slurred or inappropriate words"]])
      ],
      calc: v => {
        const n = +v.face + +v.arm + +v.speech;
        return {
          value: n + " / 3 signs abnormal — " + (n >= 1 ? "Positive (~72% probability of stroke if 1 sign; >85% if all 3)" : "Negative"),
          eq: "CPSS screens for acute stroke in prehospital emergency triage. 1 abnormal parameter triggers immediate stroke team alert."
        };
      }
    },
    {
      id: "rosierScore",
      cat: "neuro",
      subcat: "Stroke and Cerebrovascular Disease",
      name: "ROSIER Stroke Recognition Tool",
      desc: "Emergency department instrument to distinguish acute stroke from stroke mimics.",
      fields: [
        S("loc", "Loss of consciousness or syncope", "0", [["0", "No (0)"], ["-1", "Yes (−1)"]]),
        S("seizure", "Seizure activity at onset", "0", [["0", "No (0)"], ["-1", "Yes (−1)"]]),
        S("face", "New asymmetric facial weakness", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("arm", "New asymmetric arm weakness", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("leg", "New asymmetric leg weakness", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("speech", "New speech disturbance", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("visual", "New visual field defect", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      calc: v => {
        const score = +v.loc + +v.seizure + +v.face + +v.arm + +v.leg + +v.speech + +v.visual;
        return {
          value: score + " points — " + (score > 0 ? "Stroke likely (score >0)" : "Stroke unlikely / mimic possible (score ≤0)"),
          eq: "ROSIER subtracts for LOC/seizures and adds for focal neurological deficits. Blood glucose must be checked immediately."
        };
      }
    },
    {
      id: "cnsScore",
      cat: "neuro",
      subcat: "Stroke and Cerebrovascular Disease",
      name: "Canadian Neurological Scale",
      desc: "Bedside serial monitoring tool for non-comatose acute stroke patients.",
      fields: [
        S("mentation", "Mentation (Consciousness, Orientation, Speech)", "3.0", [
          ["3.0", "Alert, fully oriented, normal speech (3.0)"],
          ["2.5", "Alert with orientation or receptive deficit (2.5)"],
          ["2.0", "Drowsy with orientation or expressive deficit (2.0)"],
          ["1.5", "Drowsy, expressive and receptive deficit (1.5)"]
        ]),
        S("motor", "Motor function score (Face, Arm, Leg)", "7.0", [
          ["7.0", "No motor deficit (7.0)"],
          ["5.5", "Mild weakness in 1 or 2 limbs (5.5)"],
          ["3.5", "Moderate weakness / severe unilateral drift (3.5)"],
          ["1.5", "Severe weakness / total paralysis (1.5)"]
        ])
      ],
      calc: v => {
        const total = +v.mentation + +v.motor;
        return {
          value: total.toFixed(1) + " / 10 points",
          eq: "Canadian Neurological Scale = Mentation score (1.5–3.0) + Motor score (1.5–7.0). Validated for serial bedside nursing checks."
        };
      }
    },
    {
      id: "cha2ds2vascRef",
      cat: "neuro",
      subcat: "Stroke and Cerebrovascular Disease",
      name: "CHA₂DS₂-VASc (AF-Related Stroke Risk)",
      desc: "Cross-reference stroke risk in non-valvular atrial fibrillation to guide oral anticoagulation.",
      fields: [
        S("chf", "Congestive heart failure", "0", [["0", "No"], ["1", "Yes (+1)"]]),
        S("htn", "Hypertension history", "0", [["0", "No"], ["1", "Yes (+1)"]]),
        S("age", "Age category", "0", [["0", "<65 years (0)"], ["1", "65–74 years (+1)"], ["2", "≥75 years (+2)"]]),
        S("dm", "Diabetes mellitus", "0", [["0", "No"], ["1", "Yes (+1)"]]),
        S("stroke", "Prior Stroke / TIA / Thromboembolism", "0", [["0", "No"], ["2", "Yes (+2)"]]),
        S("vasc", "Vascular disease (prior MI, PAD, aortic plaque)", "0", [["0", "No"], ["1", "Yes (+1)"]]),
        S("sex", "Sex category", "0", [["0", "Male (0)"], ["1", "Female (+1)"]])
      ],
      calc: v => {
        const score = +v.chf + +v.htn + +v.age + +v.dm + +v.stroke + +v.vasc + +v.sex;
        let oac = v.sex === "1" ? (score >= 3 ? "Anticoagulation recommended (≥3)" : "Low/Moderate risk") : (score >= 2 ? "Anticoagulation recommended (≥2)" : "Low/Moderate risk");
        return {
          value: score + " / 9 points — " + oac,
          eq: "CHA₂DS₂-VASc identifies cardioembolic risk in AF. Prior stroke/TIA gives 2 points."
        };
      }
    },

    // ==========================================
    // C. SEIZURES AND EPILEPSY
    // ==========================================
    {
      id: "statusEpilepticus",
      cat: "neuro",
      subcat: "Seizures and Epilepsy",
      name: "Status Epilepticus Duration Tracker",
      desc: "ILAE operational definition time points: t1 (initiate treatment) and t2 (neuronal injury risk).",
      fields: [
        N("mins", "Seizure duration (minutes)", 6, { min: 0, max: 180, step: 1 }),
        S("type", "Seizure type", "tonic_clonic", [
          ["tonic_clonic", "Convulsive (bilateral tonic-clonic)"],
          ["focal", "Focal with impaired awareness"],
          ["absence", "Absence status"]
        ])
      ],
      calc: v => {
        const m = +v.mins;
        let t1 = 5, t2 = 30;
        if (v.type === "focal") { t1 = 10; t2 = 60; }
        else if (v.type === "absence") { t1 = 10; t2 = 120; }

        let status = m < t1 
          ? "Within pre-status window (<" + t1 + " min). Prepare rescue benzodiazepines."
          : m < t2 
          ? "ACTIVE STATUS EPILEPTICUS (≥t1: " + t1 + " min). Administer full-dose IV Benzodiazepines immediately."
          : "REFRACTORY STATUS EPILEPTICUS (≥t2: " + t2 + " min; risk of neuronal injury). Escalate to 2nd-line IV ASM / anesthetic infusion.";
        return {
          value: m + " minutes — " + status,
          eq: "ILAE operational timepoints: Convulsive t1 = 5 min, t2 = 30 min. Focal t1 = 10 min, t2 = 60 min. Prompt treatment terminates seizures faster."
        };
      }
    },
    {
      id: "caveScore",
      cat: "neuro",
      subcat: "Seizures and Epilepsy",
      name: "CAVE Score (Post-ICH Seizures)",
      desc: "Predicts late unprovoked seizures after spontaneous intracerebral hemorrhage.",
      fields: [
        S("cortical", "Cortical involvement", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("age", "Age <65 years", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("vol", "ICH Volume >10 mL", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("early", "Early seizure within 7 days", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      calc: v => {
        const score = +v.cortical + +v.age + +v.vol + +v.early;
        let risk = score === 0 ? "~0.6% 2-year risk" : score === 1 ? "~3.6%" : score === 2 ? "~9.8%" : score === 3 ? "~34.8%" : "~46.2% 2-year seizure risk";
        return {
          value: score + " / 4 points — " + risk,
          eq: "CAVE: Cortical (+1), Age <65 (+1), Volume >10 mL (+1), Early seizure (+1). Predicts secondary epilepsy post-ICH."
        };
      }
    },
    {
      id: "selectScore",
      cat: "neuro",
      subcat: "Seizures and Epilepsy",
      name: "SeLECT Score (Late Post-Stroke Seizures)",
      desc: "Predicts late seizures and post-stroke epilepsy after ischemic stroke.",
      fields: [
        S("nihss", "Stroke Severity (NIHSS at presentation)", "0", [
          ["0", "NIHSS 0–3 (0)"],
          ["1", "NIHSS 4–10 (+1)"],
          ["2", "NIHSS ≥11 (+2)"]
        ]),
        S("lvo", "Large-artery atherosclerosis etiology", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("early", "Early seizure (within 7 days)", "0", [["0", "No (0)"], ["3", "Yes (+3)"]]),
        S("cortical", "Cortical involvement on neuroimaging", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        S("territory", "Middle cerebral artery (MCA) territory", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      calc: v => {
        const score = +v.nihss + +v.lvo + +v.early + +v.cortical + +v.territory;
        let risk = score <= 1 ? "<2% 1-year risk" : score <= 3 ? "4–8% 1-year risk" : score <= 5 ? "10–20% 1-year risk" : ">30% 1-year risk of post-stroke epilepsy";
        return {
          value: score + " / 9 points — " + risk,
          eq: "SeLECT score: Severity (+1–2), Large artery (+1), Early seizure (+3), Cortical (+2), Territory MCA (+1)."
        };
      }
    },
    {
      id: "twoHelps2b",
      cat: "neuro",
      subcat: "Seizures and Epilepsy",
      name: "2HELPS2B Score (EEG Seizure Risk)",
      desc: "Continuous EEG monitoring score for seizure risk in critically ill patients.",
      fields: [
        S("freq", "Frequency >2 Hz for any periodic/rhythmic pattern", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("ed", "Electroencephalographic periodic discharges (LPD, GPD, BIPD)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("lpd", "Lateralized periodic discharges (LPD) specifically", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("plus", "Plus features (rhythmic, fast, or sharp activity)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("sw", "Sporadic epileptiform discharges (spikes / sharp waves)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("prior", "Brief ictal rhythmic discharges (BIRDs)", "0", [["0", "No (0)"], ["2", "Yes (+2)"]])
      ],
      calc: v => {
        const score = +v.freq + +v.ed + +v.lpd + +v.plus + +v.sw + +v.prior;
        let rec = score === 0 ? "<5% risk (1 hour screening cEEG usually sufficient)" : score === 1 ? "~12% risk (12 hours cEEG recommended)" : "High risk ≥25% (≥24 hours cEEG monitoring recommended)";
        return {
          value: score + " points — " + rec,
          eq: "2HELPS2B: >2 Hz (+1), Epileptiform discharges (+1), LPDs (+1), Plus features (+1), Sporadic spikes (+1), BIRDs (+2)."
        };
      }
    },
    {
      id: "seizureDiaryPlanned",
      cat: "neuro",
      subcat: "Seizures and Epilepsy",
      name: "Epilepsy Seizure-Frequency Diary",
      desc: "Planned — longitudinal seizure frequency and trigger tracker.",
      planned: true
    },
    {
      id: "seizureRecurrence",
      cat: "neuro",
      subcat: "Seizures and Epilepsy",
      name: "Seizure Recurrence Risk Assessment",
      desc: "Stratifies risk of a second unprovoked seizure after an initial unprovoked event.",
      fields: [
        S("mri", "Brain imaging abnormality (tumor, prior stroke, cortical malformation)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("eeg", "Epileptiform abnormalities on EEG", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("sleep", "Seizure occurred during sleep", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("neuro", "Prior focal neurological deficit", "0", [["0", "No (0)"], ["1", "Yes (+1)"]])
      ],
      calc: v => {
        const n = +v.mri + +v.eeg + +v.sleep + +v.neuro;
        let c = n >= 2 ? "High recurrence risk (>60% in 5 years; satisfies practical definition of Epilepsy)" : n === 1 ? "Intermediate recurrence risk (~40%)" : "Lower recurrence risk (~25% in 5 years)";
        return {
          value: n + " / 4 risk factors present — " + c,
          eq: "A single unprovoked seizure with an estimated recurrence risk >60% over 10 years meets the ILAE diagnostic definition of epilepsy."
        };
      }
    },
    {
      id: "asmDosingHelper",
      cat: "neuro",
      subcat: "Seizures and Epilepsy",
      name: "Antiseizure Medication Dose & Renal Helper",
      desc: "Maintenance dose ranges and renal adjustment considerations for common ASMs.",
      fields: [
        S("drug", "Select Antiseizure Medication", "lev", [
          ["lev", "Levetiracetam (Keppra)"],
          ["lac", "Lacosamide (Vimpat)"],
          ["lam", "Lamotrigine (Lamictal)"],
          ["phe", "Phenytoin (Dilantin)"]
        ]),
        N("crcl", "Estimated CrCl (mL/min)", 70, { min: 5, max: 150 })
      ],
      calc: v => {
        const c = +v.crcl;
        let rec = "";
        if (v.drug === "lev") {
          rec = c > 80 ? "Normal dose: 500–1500 mg BID." : c >= 50 ? "CrCl 50–80: 500–1000 mg BID." : c >= 30 ? "CrCl 30–49: 250–750 mg BID." : c >= 15 ? "CrCl 15–29: 250–500 mg BID." : "ESRD / Dialysis: 500–1000 mg once daily (supplement post-HD).";
        } else if (v.drug === "lac") {
          rec = c <= 30 ? "CrCl ≤30 mL/min: Max recommended dose 300 mg/day (reduction of 25%)." : "Normal dose: 100–200 mg BID (max 400 mg/day).";
        } else if (v.drug === "lam") {
          rec = c < 50 ? "Renal excretion of metabolites reduced; reduce maintenance dose by ~25–50%." : "Standard titration required (slow titration to avoid SJS/TEN).";
        } else {
          rec = "Hepatically cleared. Therapeutic range 10–20 mcg/mL. In renal failure or hypoalbuminemia, calculate Sheiner-Tozer corrected phenytoin.";
        }
        return {
          value: rec,
          eq: "Always confirm serum levels, hepatic function, and concomitant CYP-inducing / inhibiting interactions."
        };
      }
    },

    // ==========================================
    // D. NEUROMUSCULAR DISORDERS
    // ==========================================
    {
      id: "mrcGrading",
      cat: "neuro",
      subcat: "Neuromuscular Disorders",
      name: "MRC Muscle Power Grading (0–5)",
      desc: "Medical Research Council standard grading scale for manual muscle strength testing.",
      fields: [
        S("grade", "Observed muscle contraction", "5", [
          ["0", "0 — No contraction detected"],
          ["1", "1 — Trace contraction / flicker of movement"],
          ["2", "2 — Active movement with gravity eliminated"],
          ["3", "3 — Active movement against gravity, but not resistance"],
          ["4", "4 — Active movement against gravity and moderate resistance"],
          ["5", "5 — Normal power against full resistance"]
        ])
      ],
      calc: v => ({
        value: "MRC Grade " + v.grade,
        eq: "Medical Research Council 0–5 manual muscle testing standard."
      })
    },
    {
      id: "mrcSumScore",
      cat: "neuro",
      subcat: "Neuromuscular Disorders",
      name: "Medical Research Council Sum Score",
      desc: "Evaluates 6 bilateral muscle groups (0–60) in GBS, CIDP, and ICU-acquired weakness.",
      fields: [
        N("shoulder", "Shoulder abduction (sum R+L, 0–10)", 10, { min: 0, max: 10 }),
        N("elbow", "Elbow flexion (sum R+L, 0–10)", 10, { min: 0, max: 10 }),
        N("wrist", "Wrist extension (sum R+L, 0–10)", 10, { min: 0, max: 10 }),
        N("hip", "Hip flexion (sum R+L, 0–10)", 10, { min: 0, max: 10 }),
        N("knee", "Knee extension (sum R+L, 0–10)", 10, { min: 0, max: 10 }),
        N("ankle", "Ankle dorsiflexion (sum R+L, 0–10)", 10, { min: 0, max: 10 })
      ],
      calc: v => {
        const total = +v.shoulder + +v.elbow + +v.wrist + +v.hip + +v.knee + +v.ankle;
        let c = total < 48 ? "ICU-acquired weakness / significant quadriparesis (score <48)" : "Preserved strength / non-significant paresis (≥48)";
        return {
          value: total + " / 60 points — " + c,
          eq: "MRC Sum Score sums MRC power (0–5) across 3 upper-extremity and 3 lower-extremity muscle pairs."
        };
      }
    },
    {
      id: "mgAdlScore",
      cat: "neuro",
      subcat: "Neuromuscular Disorders",
      name: "MG-ADL (Myasthenia Gravis)",
      desc: "Patient-reported functional limitation scale for Myasthenia Gravis.",
      fields: [
        S("talk", "Talking", "0", [["0", "Normal (0)"], ["1", "Intermittent slurring (1)"], ["2", "Constant slurring (2)"], ["3", "Difficult to understand (3)"]]),
        S("chew", "Chewing", "0", [["0", "Normal (0)"], ["1", "Fatigue with solid food (1)"], ["2", "Fatigue with soft food (2)"], ["3", "Gastrostomy tube (3)"]]),
        S("swallow", "Swallowing", "0", [["0", "Normal (0)"], ["1", "Rare choke (1)"], ["2", "Frequent choke / modified diet (2)"], ["3", "Gastrostomy tube (3)"]]),
        S("breathe", "Breathing", "0", [["0", "Normal (0)"], ["1", "SOB with exertion (1)"], ["2", "SOB at rest (2)"], ["3", "Ventilator dependence (3)"]]),
        S("brush", "Brushing teeth / combing hair", "0", [["0", "Normal (0)"], ["1", "Extra effort (1)"], ["2", "Rest periods needed (2)"], ["3", "Cannot do (3)"]]),
        S("chair", "Arising from chair", "0", [["0", "Normal (0)"], ["1", "Uses arms (1)"], ["2", "Pushes with arms, several tries (2)"], ["3", "Cannot do (3)"]]),
        S("diplopia", "Double vision", "0", [["0", "None (0)"], ["1", "Occurs with fatigue (1)"], ["2", "Constant daily (2)"], ["3", "Constant throughout day (3)"]]),
        S("ptosis", "Eyelid droop", "0", [["0", "None (0)"], ["1", "Occurs with fatigue (1)"], ["2", "Obstructs some vision (2)"], ["3", "Obstructs entire vision (3)"]])
      ],
      calc: v => {
        const total = +v.talk + +v.chew + +v.swallow + +v.breathe + +v.brush + +v.chair + +v.diplopia + +v.ptosis;
        return {
          value: total + " / 24 points",
          eq: "MG-ADL ranges from 0 to 24. A change of ≥2 points represents clinically meaningful improvement or deterioration."
        };
      }
    },
    {
      id: "qmgPlanned",
      cat: "neuro",
      subcat: "Neuromuscular Disorders",
      name: "QMG Score (Myasthenia Gravis)",
      desc: "Planned — Quantitative Myasthenia Gravis physician-administered test.",
      planned: true
    },
    {
      id: "mgfaClass",
      cat: "neuro",
      subcat: "Neuromuscular Disorders",
      name: "MGFA Clinical Classification",
      desc: "Myasthenia Gravis Foundation of America clinical severity staging.",
      fields: [
        S("class", "Clinical presentation", "I", [
          ["I", "Class I — Purely ocular muscle weakness (ptosis / diplopia)"],
          ["IIa", "Class IIa — Mild generalized weakness, primarily axial or limb muscles"],
          ["IIb", "Class IIb — Mild generalized weakness, predominantly bulbar / respiratory"],
          ["IIIa", "Class IIIa — Moderate generalized weakness, predominantly limb/axial"],
          ["IIIb", "Class IIIb — Moderate generalized weakness, predominantly bulbar/respiratory"],
          ["IVa", "Class IVa — Severe generalized weakness, predominantly limb/axial"],
          ["IVb", "Class IVb — Severe generalized weakness, predominantly bulbar/respiratory"],
          ["V", "Class V — Intubation with or without mechanical ventilation required"]
        ])
      ],
      calc: v => ({
        value: "MGFA Class " + v.class,
        eq: "Classifies the severity and anatomical distribution of myasthenic symptoms."
      })
    },
    {
      id: "alsfrsScore",
      cat: "neuro",
      subcat: "Neuromuscular Disorders",
      name: "ALSFRS-R (Motor Neuron Disease)",
      desc: "Revised ALS Functional Rating Scale monitoring disease progression.",
      fields: [
        N("bulbar", "Bulbar domain (speech, salivation, swallowing: 0–12)", 12, { min: 0, max: 12, step: 1 }),
        N("fine", "Fine motor domain (handwriting, cutting, dressing: 0–12)", 12, { min: 0, max: 12, step: 1 }),
        N("gross", "Gross motor domain (turning in bed, walking, stairs: 0–12)", 12, { min: 0, max: 12, step: 1 }),
        N("resp", "Respiratory domain (dyspnea, orthopnea, ventilation: 0–12)", 12, { min: 0, max: 12, step: 1 })
      ],
      calc: v => {
        const total = +v.bulbar + +v.fine + +v.gross + +v.resp;
        return {
          value: total + " / 48 points",
          eq: "ALSFRS-R (0–48) spans 12 functional items. Decreases of ~1 point/month represent typical ALS progression."
        };
      }
    },
    {
      id: "hughesGbs",
      cat: "neuro",
      subcat: "Neuromuscular Disorders",
      name: "Hughes / GBS Disability Scale",
      desc: "Functional mobility staging in Guillain–Barré syndrome.",
      fields: [
        S("score", "Functional capability", "0", [
          ["0", "0 — Healthy, no symptoms"],
          ["1", "1 — Minor symptoms, capable of running"],
          ["2", "2 — Able to walk 10m independently, cannot run"],
          ["3", "3 — Able to walk 10m with support / aid"],
          ["4", "4 — Bedbound or wheelchair-bound"],
          ["5", "5 — Requiring assisted mechanical ventilation (at least part of day)"],
          ["6", "6 — Dead"]
        ])
      ],
      calc: v => ({
        value: "Hughes Disability Grade " + v.score,
        eq: "Scores ≥3 indicate significant disability; standard entry criterion for IVIg / plasma exchange clinical trials."
      })
    },
    {
      id: "egrisScore",
      cat: "neuro",
      subcat: "Neuromuscular Disorders",
      name: "EGRIS (GBS Respiratory Failure Risk)",
      desc: "Erasmus GBS Respiratory Insufficiency Score predicting mechanical ventilation within 1 week.",
      fields: [
        S("days", "Days between onset of weakness and admission", "0", [
          ["0", ">7 days (0)"],
          ["1", "4–7 days (+1)"],
          ["2", "<4 days (+2)"]
        ]),
        S("bulbar", "Bulbar weakness (facial or deglutition weakness)", "0", [["0", "Absent (0)"], ["1", "Present (+1)"]]),
        S("mrc", "MRC sum score at admission", "0", [
          ["0", "MRC 60–51 (0)"],
          ["1", "MRC 50–41 (+1)"],
          ["2", "MRC 40–31 (+2)"],
          ["3", "MRC 30–21 (+3)"],
          ["4", "MRC ≤20 (+4)"]
        ])
      ],
      calc: v => {
        const score = +v.days + +v.bulbar + +v.mrc;
        let risk = score <= 2 ? "Low risk (~4% probability of ventilation)" : score <= 4 ? "Intermediate risk (~15% probability of ventilation)" : "High risk (~65% probability of ventilation)";
        return {
          value: score + " / 7 points — " + risk,
          eq: "EGRIS combines progression rate, bulbar involvement, and MRC sum score to guide ICU monitoring and elective intubation."
        };
      }
    },

    // ==========================================
    // E. HEADACHE AND MIGRAINE
    // ==========================================
    {
      id: "midasScore",
      cat: "neuro",
      subcat: "Headache and Migraine",
      name: "MIDAS (Migraine Disability Assessment)",
      desc: "Quantifies headache-related disability over the preceding 3 months.",
      fields: [
        N("q1", "Missed days of work/school", 2, { min: 0, max: 90, step: 1 }),
        N("q2", "Productivity reduced by half at work/school", 3, { min: 0, max: 90, step: 1 }),
        N("q3", "Missed days of household work", 2, { min: 0, max: 90, step: 1 }),
        N("q4", "Household productivity reduced by half", 2, { min: 0, max: 90, step: 1 }),
        N("q5", "Missed family/social/leisure days", 1, { min: 0, max: 90, step: 1 })
      ],
      calc: v => {
        const total = +v.q1 + +v.q2 + +v.q3 + +v.q4 + +v.q5;
        let grade = total <= 5 ? "Grade I (Little or no disability)" : total <= 10 ? "Grade II (Mild disability)" : total <= 20 ? "Grade III (Moderate disability)" : "Grade IV (Severe disability — preventive therapy strongly indicated)";
        return {
          value: total + " missed/reduced days — " + grade,
          eq: "MIDAS sums days over the last 3 months. Grade IV (≥21 days) indicates severe functional impact."
        };
      }
    },
    {
      id: "hit6Score",
      cat: "neuro",
      subcat: "Headache and Migraine",
      name: "HIT-6 (Headache Impact Test)",
      desc: "6-item questionnaire assessing headache impact on daily functioning.",
      fields: [
        S("q1", "When you have headaches, how often is the pain severe?", "6", [["6", "Never (6)"], ["8", "Rarely (8)"], ["10", "Sometimes (10)"], ["11", "Very often (11)"], ["13", "Always (13)"]]),
        S("q2", "How often do headaches limit your ability to do usual daily activities?", "6", [["6", "Never (6)"], ["8", "Rarely (8)"], ["10", "Sometimes (10)"], ["11", "Very often (11)"], ["13", "Always (13)"]]),
        S("q3", "When you have a headache, how often do you wish you could lie down?", "6", [["6", "Never (6)"], ["8", "Rarely (8)"], ["10", "Sometimes (10)"], ["11", "Very often (11)"], ["13", "Always (13)"]]),
        S("q4", "In past 4 weeks, how often have you felt too tired to work due to headaches?", "6", [["6", "Never (6)"], ["8", "Rarely (8)"], ["10", "Sometimes (10)"], ["11", "Very often (11)"], ["13", "Always (13)"]]),
        S("q5", "In past 4 weeks, how often did you feel fed up or irritated because of headaches?", "6", [["6", "Never (6)"], ["8", "Rarely (8)"], ["10", "Sometimes (10)"], ["11", "Very often (11)"], ["13", "Always (13)"]]),
        S("q6", "In past 4 weeks, how often did headaches limit your ability to concentrate?", "6", [["6", "Never (6)"], ["8", "Rarely (8)"], ["10", "Sometimes (10)"], ["11", "Very often (11)"], ["13", "Always (13)"]])
      ],
      calc: v => {
        const total = +v.q1 + +v.q2 + +v.q3 + +v.q4 + +v.q5 + +v.q6;
        let c = total <= 49 ? "Little to no impact (≤49)" : total <= 55 ? "Moderate impact (50–55)" : total <= 59 ? "Substantial impact (56–59)" : "Severe impact (≥60)";
        return {
          value: total + " points — " + c,
          eq: "HIT-6 ranges from 36 to 78. Score ≥60 denotes severe impact on daily living."
        };
      }
    },
    {
      id: "migraineScreen",
      cat: "neuro",
      subcat: "Headache and Migraine",
      name: "Migraine Screening Questionnaire (ID-Migraine)",
      desc: "3-item validated diagnostic screener for undiagnosed migraine.",
      fields: [
        S("nausea", "Felt nauseated or sick to your stomach with a headache?", "0", [["0", "No"], ["1", "Yes"]]),
        S("light", "Light bothered you a lot more than when you don't have headaches?", "0", [["0", "No"], ["1", "Yes"]]),
        S("limit", "Headaches limited your ability to work, study, or function for at least a day?", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const n = +v.nausea + +v.light + +v.limit;
        return {
          value: n + " / 3 items positive — " + (n >= 2 ? "Migraine Likely (93% PPV)" : "Migraine Unlikely"),
          eq: "ID-Migraine: 2 or more positive responses has 81% sensitivity and 75% specificity for migraine."
        };
      }
    },
    {
      id: "snnoop10",
      cat: "neuro",
      subcat: "Headache and Migraine",
      name: "SNNOOP10 Red-Flag Checklist",
      desc: "Screening checklist for secondary and life-threatening headache etiologies.",
      fields: [
        S("s_systemic", "Systemic symptoms (fever, weight loss)", "0", [["0", "No"], ["1", "Yes"]]),
        S("n_neoplasm", "Neoplasm / active cancer history", "0", [["0", "No"], ["1", "Yes"]]),
        S("n_neuro", "Neurological deficit or altered consciousness", "0", [["0", "No"], ["1", "Yes"]]),
        S("o_onset", "Onset sudden / thunderclap (peak in <1 min)", "0", [["0", "No"], ["1", "Yes"]]),
        S("o_older", "Older onset (age >50 years)", "0", [["0", "No"], ["1", "Yes"]]),
        S("p_pattern", "Pattern change or new progressive headache", "0", [["0", "No"], ["1", "Yes"]]),
        S("p_postural", "Positional / postural headache (worse upright or lying)", "0", [["0", "No"], ["1", "Yes"]]),
        S("p_papilla", "Papilledema on fundoscopy", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const count = Object.values(v).reduce((a, b) => a + Number(b), 0);
        return {
          value: count === 0 ? "No red flags identified" : count + " RED FLAG(S) PRESENT — Urgent neuroimaging indicated",
          eq: "Any single positive SNNOOP10 red flag warrants secondary headache evaluation and neuroimaging."
        };
      }
    },
    {
      id: "ottawaSah",
      cat: "neuro",
      subcat: "Headache and Migraine",
      name: "Ottawa SAH Rule",
      desc: "Clinical decision rule to exclude subarachnoid hemorrhage in alert patients with acute acute headache.",
      fields: [
        S("age", "Age ≥40 years", "0", [["0", "No"], ["1", "Yes"]]),
        S("neck", "Neck pain or stiffness", "0", [["0", "No"], ["1", "Yes"]]),
        S("onset", "Witnessed loss of consciousness", "0", [["0", "No"], ["1", "Yes"]]),
        S("exertion", "Onset during exertion", "0", [["0", "No"], ["1", "Yes"]]),
        S("thunder", "Thunderclap headache (instant peak pain)", "0", [["0", "No"], ["1", "Yes"]]),
        S("flexion", "Limited neck flexion on examination", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const positive = Object.values(v).some(x => x === "1");
        return {
          value: positive ? "Ottawa Rule POSITIVE — CT head required to investigate SAH" : "Ottawa Rule NEGATIVE — SAH excluded with >99% sensitivity",
          eq: "Applies only to alert patients ≥15 years with a peak headache within 1 hour. If all criteria are NO, SAH can be ruled out without CT."
        };
      }
    },
    {
      id: "mohScreen",
      cat: "neuro",
      subcat: "Headache and Migraine",
      name: "Medication-Overuse Headache Screening",
      desc: "ICHD-3 diagnostic criteria screener for medication-overuse headache (MOH).",
      fields: [
        N("days", "Headache days per month", 16, { min: 0, max: 31, step: 1 }),
        S("triptan", "Triptans, opioids, or combination analgesics used ≥10 days/month?", "0", [["0", "No"], ["1", "Yes"]]),
        S("nsaid", "Simple analgesics (paracetamol, NSAIDs) used ≥15 days/month?", "0", [["0", "No"], ["1", "Yes"]]),
        S("months", "Overuse has continued for >3 months?", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const isMOH = +v.days >= 15 && (+v.triptan === 1 || +v.nsaid === 1) && +v.months === 1;
        return {
          value: isMOH ? "Positive for Medication-Overuse Headache (MOH)" : "Does not meet criteria for Medication-Overuse Headache",
          eq: "ICHD-3 criteria: Headache ≥15 days/month in patient with pre-existing headache and regular overuse of acute medication for >3 months."
        };
      }
    },

    // ==========================================
    // F. COGNITION AND DEMENTIA
    // ==========================================
    {
      id: "mmsePlanned",
      cat: "neuro",
      subcat: "Cognition and Dementia",
      name: "MMSE (Mini-Mental State Examination)",
      desc: "Planned — 30-point copyrighted cognitive screening instrument.",
      planned: true
    },
    {
      id: "mocaPlanned",
      cat: "neuro",
      subcat: "Cognition and Dementia",
      name: "MoCA (Montreal Cognitive Assessment)",
      desc: "Planned — certified 30-point screening battery for mild cognitive impairment.",
      planned: true
    },
    {
      id: "miniCog",
      cat: "neuro",
      subcat: "Cognition and Dementia",
      name: "Mini-Cog",
      desc: "Rapid 3-minute bedside screen combining 3-word recall and clock drawing.",
      fields: [
        S("recall", "3-word delayed recall score", "3", [
          ["0", "0 words recalled (0)"],
          ["1", "1 word recalled (1)"],
          ["2", "2 words recalled (2)"],
          ["3", "3 words recalled (3)"]
        ]),
        S("clock", "Clock Drawing Test (all numbers placed, correct hands and time)", "2", [
          ["0", "Abnormal clock (0)"],
          ["2", "Normal clock (2)"]
        ])
      ],
      calc: v => {
        const rec = +v.recall, clk = +v.clock;
        const total = rec + (rec === 1 || rec === 2 ? clk : 0);
        let screen = (rec === 0) || (rec <= 2 && clk === 0) ? "Positive screen for dementia / cognitive impairment" : "Negative screen (unlikely significant dementia)";
        return {
          value: "Mini-Cog: " + screen,
          eq: "Recall 0 = Demented. Recall 1–2 + abnormal clock = Demented. Recall 1–2 + normal clock OR Recall 3 = Negative screen."
        };
      }
    },
    {
      id: "fourAtDelirium",
      cat: "neuro",
      subcat: "Cognition and Dementia",
      name: "4AT Delirium Screen",
      desc: "Rapid clinical instrument for delirium and cognitive impairment.",
      fields: [
        S("alert", "1. Alertness", "0", [
          ["0", "Normal / fully alert (0)"],
          ["0b", "Mild sleepiness, normal on waking (0)"],
          ["4", "Clearly abnormal / agitated / hyperactive / stuporous (+4)"]
        ]),
        S("amt4", "2. AMT4 (Age, DOB, Place, Current Year)", "0", [
          ["0", "No mistakes (0)"],
          ["1", "1 mistake (+1)"],
          ["2", "2 or more mistakes / untestable (+2)"]
        ]),
        S("attention", "3. Attention (Months of the year backward)", "0", [
          ["0", "Achieves 7 months or more correctly (0)"],
          ["1", "Starts but achieves <7 months / refuses (+1)"],
          ["2", "Untestable (+2)"]
        ]),
        S("acute", "4. Acute change or fluctuating course", "0", [
          ["0", "No (0)"],
          ["4", "Yes (+4)"]
        ])
      ],
      calc: v => {
        const a = v.alert === "4" ? 4 : 0;
        const total = a + +v.amt4 + +v.attention + +v.acute;
        let c = total >= 4 ? "Possible Delirium +/− Cognitive Impairment (score ≥4)" : total >= 1 ? "Possible Cognitive Impairment (score 1–3)" : "Delirium and severe impairment unlikely (score 0)";
        return {
          value: total + " / 12 points — " + c,
          eq: "4AT: Alertness (0 or 4), AMT4 (0–2), Attention (0–2), Acute fluctuation (0 or 4). Score ≥4 strongly suggests delirium."
        };
      }
    },
    {
      id: "camDelirium",
      cat: "neuro",
      subcat: "Cognition and Dementia",
      name: "CAM Delirium Assessment",
      desc: "Confusion Assessment Method diagnostic algorithm for delirium.",
      fields: [
        S("f1", "Feature 1: Acute onset and fluctuating course", "1", [["0", "Absent"], ["1", "Present"]]),
        S("f2", "Feature 2: Inattention (difficulty focusing or keeping track)", "1", [["0", "Absent"], ["1", "Present"]]),
        S("f3", "Feature 3: Disorganized thinking (rambling, illogical speech)", "0", [["0", "Absent"], ["1", "Present"]]),
        S("f4", "Feature 4: Altered level of consciousness (hyperalert, lethargic, stupor)", "0", [["0", "Absent (alert)"], ["1", "Present (abnormal)"]])
      ],
      calc: v => {
        const positive = +v.f1 === 1 && +v.f2 === 1 && (+v.f3 === 1 || +v.f4 === 1);
        return {
          value: positive ? "POSITIVE for Delirium (meets CAM criteria)" : "NEGATIVE for Delirium",
          eq: "CAM criteria: Requires presence of BOTH Feature 1 AND Feature 2, PLUS either Feature 3 OR Feature 4."
        };
      }
    },
    {
      id: "cdrScore",
      cat: "neuro",
      subcat: "Cognition and Dementia",
      name: "Clinical Dementia Rating (CDR)",
      desc: "Semi-structured global dementia staging.",
      fields: [
        S("cdr", "Global Clinical Dementia Rating", "0", [
          ["0", "CDR 0 — None (Normal cognition)"],
          ["0.5", "CDR 0.5 — Very Mild (MCI / questionable dementia)"],
          ["1", "CDR 1 — Mild Dementia"],
          ["2", "CDR 2 — Moderate Dementia"],
          ["3", "CDR 3 — Severe Dementia"]
        ])
      ],
      calc: v => ({
        value: "Global " + v.cdr,
        eq: "Calculated across 6 cognitive domains: Memory, Orientation, Judgment, Community Affairs, Home/Hobbies, Personal Care."
      })
    },
    {
      id: "fastStaging",
      cat: "neuro",
      subcat: "Cognition and Dementia",
      name: "FAST Staging (Dementia)",
      desc: "Functional Assessment Staging scale for Alzheimer's disease progression.",
      fields: [
        S("stage", "Functional stage", "1", [
          ["1", "Stage 1 — Normal adult (no functional decline)"],
          ["2", "Stage 2 — Normal aged adult (subjective memory deficit)"],
          ["3", "Stage 3 — Early dementia / MCI (deficits in demanding employment)"],
          ["4", "Stage 4 — Mild Alzheimer's (assistance in complex tasks: finances, shopping)"],
          ["5", "Stage 5 — Moderate Alzheimer's (requires assistance choosing clothing)"],
          ["6", "Stage 6 — Moderately severe (requires help dressing, bathing, toileting)"],
          ["7", "Stage 7 — Severe (loss of speech, unable to walk, sit, or smile)"]
        ])
      ],
      calc: v => ({
        value: "FAST " + v.stage,
        eq: "Functional Assessment Staging. Stage 7 represents advanced end-stage dementia (hospice qualification threshold)."
      })
    },
    {
      id: "ad8Screen",
      cat: "neuro",
      subcat: "Cognition and Dementia",
      name: "AD8 Dementia Screening",
      desc: "8-item brief informant questionnaire for cognitive change.",
      fields: [
        S("q1", "Problems with judgment (financial decisions, scams)", "0", [["0", "No change"], ["1", "Yes, a change"]]),
        S("q2", "Less interest in hobbies/activities", "0", [["0", "No change"], ["1", "Yes, a change"]]),
        S("q3", "Repeats the same things over and over", "0", [["0", "No change"], ["1", "Yes, a change"]]),
        S("q4", "Trouble learning how to use a tool or appliance", "0", [["0", "No change"], ["1", "Yes, a change"]]),
        S("q5", "Forgets correct month or year", "0", [["0", "No change"], ["1", "Yes, a change"]]),
        S("q6", "Trouble handling complicated financial affairs", "0", [["0", "No change"], ["1", "Yes, a change"]]),
        S("q7", "Trouble remembering appointments", "0", [["0", "No change"], ["1", "Yes, a change"]]),
        S("q8", "Daily thinking or memory problems", "0", [["0", "No change"], ["1", "Yes, a change"]])
      ],
      calc: v => {
        const total = Object.values(v).reduce((a, b) => a + Number(b), 0);
        return {
          value: total + " / 8 points — " + (total >= 2 ? "Cognitive impairment likely (score ≥2)" : "Normal cognition likely (score 0–1)"),
          eq: "AD8: Score of ≥2 indicates significant cognitive decline prompting formal clinical evaluation."
        };
      }
    },
    {
      id: "fabScore",
      cat: "neuro",
      subcat: "Cognition and Dementia",
      name: "Frontal Assessment Battery",
      desc: "6-subtest screening battery for dysexecutive and frontal lobe syndrome.",
      fields: [
        N("similar", "1. Similarities / Conceptualization (0–3)", 3, { min: 0, max: 3, step: 1 }),
        N("fluency", "2. Lexical verbal fluency (0–3)", 3, { min: 0, max: 3, step: 1 }),
        N("motor_series", "3. Motor series (Luria fist-edge-palm: 0–3)", 3, { min: 0, max: 3, step: 1 }),
        N("conflicting", "4. Conflicting instructions (go-no-go: 0–3)", 3, { min: 0, max: 3, step: 1 }),
        N("inhibitory", "5. Inhibitory control (0–3)", 3, { min: 0, max: 3, step: 1 }),
        N("prehension", "6. Environmental autonomy / Prehension behavior (0–3)", 3, { min: 0, max: 3, step: 1 })
      ],
      calc: v => {
        const total = +v.similar + +v.fluency + +v.motor_series + +v.conflicting + +v.inhibitory + +v.prehension;
        let c = total < 12 ? "Frontal dysexecutive dysfunction (<12)" : "Normal frontal lobe function (≥12)";
        return {
          value: total + " / 18 points — " + c,
          eq: "Frontal Assessment Battery. Differentiates Frontotemporal Dementia from Alzheimer's disease."
        };
      }
    },

    // ==========================================
    // G. MOVEMENT DISORDERS
    // ==========================================
    {
      id: "updrsPlanned",
      cat: "neuro",
      subcat: "Movement Disorders",
      name: "MDS-UPDRS (Parkinson Disease)",
      desc: "Planned — Movement Disorder Society Unified Parkinson's Disease Rating Scale.",
      planned: true
    },
    {
      id: "hoehnYahr",
      cat: "neuro",
      subcat: "Movement Disorders",
      name: "Hoehn and Yahr Staging",
      desc: "Classic clinical staging of Parkinson's disease disability and postural involvement.",
      fields: [
        S("stage", "Clinical stage", "1", [
          ["1", "Stage 1 — Unilateral involvement only, usually with minimal or no functional disability"],
          ["1.5", "Stage 1.5 — Unilateral and axial involvement"],
          ["2", "Stage 2 — Bilateral or midline involvement without impairment of balance"],
          ["2.5", "Stage 2.5 — Mild bilateral disease with recovery on pull test"],
          ["3", "Stage 3 — Mild-to-moderate bilateral disease; physically independent; postural instability"],
          ["4", "Stage 4 — Severe disability; still able to walk or stand unassisted"],
          ["5", "Stage 5 — Wheelchair-bound or bedridden unless aided"]
        ])
      ],
      calc: v => ({
        value: "Hoehn and Yahr Stage " + v.stage,
        eq: "Tracks progression of bilateral involvement and emergence of impaired postural reflexes."
      })
    },
    {
      id: "schwabEngland",
      cat: "neuro",
      subcat: "Movement Disorders",
      name: "Schwab and England ADL Scale",
      desc: "Percentage rating of functional daily independence in Parkinson's disease.",
      fields: [
        S("pct", "Independence percentage", "100", [
          ["100", "100% — Completely independent; able to do all chores"],
          ["80", "80% — Independent in most chores; takes twice as long"],
          ["60", "60% — Moderately dependent; needs help with some chores"],
          ["40", "40% — Very dependent; needs help with most chores"],
          ["20", "20% — Nothing alone; severe invalid"],
          ["0", "0% — Completely bedridden, vegetative functions impaired"]
        ])
      ],
      calc: v => ({
        value: v.pct + "% Independence",
        eq: "Rates daily functioning and caregiver dependence in Parkinson's disease."
      })
    },
    {
      id: "aimsScore",
      cat: "neuro",
      subcat: "Movement Disorders",
      name: "AIMS (Abnormal Involuntary Movements)",
      desc: "Quantifies severity of tardive dyskinesia in neuroleptic/dopamine antagonist use.",
      fields: [
        N("facial", "Facial and oral movements (max 16 across 4 items)", 0, { min: 0, max: 16, step: 1 }),
        N("extremity", "Extremity movements (max 8 across 2 items)", 0, { min: 0, max: 8, step: 1 }),
        N("trunk", "Trunk movements (max 4 across 1 item)", 0, { min: 0, max: 4, step: 1 })
      ],
      calc: v => {
        const total = +v.facial + +v.extremity + +v.trunk;
        let c = total >= 2 ? "Positive for abnormal involuntary movements (tardive dyskinesia)" : "Minimal / no dyskinesia";
        return {
          value: total + " / 28 points — " + c,
          eq: "AIMS rates dyskinesia across 7 body areas from 0 (none) to 4 (severe). A score ≥2 in two areas or ≥3 in one area confirms tardive dyskinesia."
        };
      }
    },
    {
      id: "simpsonAngus",
      cat: "neuro",
      subcat: "Movement Disorders",
      name: "Simpson–Angus Scale",
      desc: "Assesses drug-induced extrapyramidal Parkinsonian rigidity and hypokinesia.",
      fields: [
        N("items", "Mean score of 10 examination items (0 to 4 each)", 0.4, { min: 0, max: 4, step: 0.1 })
      ],
      calc: v => {
        const mean = +v.items;
        return {
          value: "Mean SAS score: " + mean.toFixed(2) + " (" + (mean > 0.3 ? "Extrapyramidal signs present" : "Normal") + ")",
          eq: "Evaluates gait, arm drop, shoulder/elbow/wrist rigidity, leg rigidity, and glabella tap. Mean score >0.3 indicates drug-induced parkinsonism."
        };
      }
    },
    {
      id: "barnesAkathisia",
      cat: "neuro",
      subcat: "Movement Disorders",
      name: "Barnes Akathisia Rating Scale",
      desc: "Diagnostic scale for drug-induced subjective and objective akathisia.",
      fields: [
        S("obj", "Objective restlessness", "0", [["0", "Normal (0)"], ["1", "Restless movements (1)"], ["2", "Pacing / cannot sit still (2)"], ["3", "Severe continuous pacing (3)"]]),
        S("subj", "Subjective restlessness", "0", [["0", "None (0)"], ["1", "Mild awareness (1)"], ["2", "Aware of urge to move (2)"], ["3", "Intense distressing restlessness (3)"]]),
        S("global", "Global clinical assessment", "0", [["0", "Absent (0)"], ["1", "Questionable (1)"], ["2", "Mild akathisia (2)"], ["3", "Moderate akathisia (3)"], ["4", "Marked (4)"], ["5", "Severe (5)"]])
      ],
      calc: v => ({
        value: "BARS Global Score: " + v.global + " (" + (+v.global >= 2 ? "Akathisia present" : "No akathisia") + ")",
        eq: "Barnes Akathisia Rating Scale. Global score ≥2 establishes diagnosis of drug-induced akathisia."
      })
    },
    {
      id: "uhdrsPlanned",
      cat: "neuro",
      subcat: "Movement Disorders",
      name: "UHDRS (Huntington Disease)",
      desc: "Planned — Unified Huntington's Disease Rating Scale total motor assessment.",
      planned: true
    },

    // ==========================================
    // H. MULTIPLE SCLEROSIS AND NEUROINFLAMMATION
    // ==========================================
    {
      id: "edssScore",
      cat: "neuro",
      subcat: "Multiple Sclerosis and Neuroinflammation",
      name: "EDSS (Expanded Disability Status Scale)",
      desc: "Standard disability rating in multiple sclerosis from 0 (normal) to 10 (death).",
      fields: [
        S("edss", "Functional mobility & disability tier", "0.0", [
          ["0.0", "0.0 — Normal neurological exam"],
          ["1.5", "1.5 — No disability, minimal signs in >1 functional system"],
          ["2.0", "2.0 — Minimal disability in 1 functional system"],
          ["3.0", "3.0 — Moderate disability in 1 system, fully ambulatory"],
          ["4.0", "4.0 — Fully ambulatory without aid, up and about >12h/day; self-sufficient"],
          ["6.0", "6.0 — Intermittent or unilateral constant assistance (cane, crutch) needed to walk 100m"],
          ["6.5", "6.5 — Constant bilateral assistance (canes, crutches) needed to walk 20m"],
          ["7.0", "7.0 — Essentially restricted to wheelchair; wheels self"],
          ["8.0", "8.0 — Essentially restricted to bed or chair; retains self-care functions"],
          ["9.0", "9.0 — Helpless bed patient; unable to communicate or eat effectively"]
        ])
      ],
      calc: v => ({
        value: "EDSS " + v.edss,
        eq: "EDSS 0–4.0 depends on functional systems; 4.0–7.5 is determined predominantly by ambulation distance and required walking aids."
      })
    },
    {
      id: "msfcPlanned",
      cat: "neuro",
      subcat: "Multiple Sclerosis and Neuroinflammation",
      name: "MSFC (Multiple Sclerosis Functional Composite)",
      desc: "Planned — 3-part quantitative clinical composite (T25FW, 9HPT, PASAT).",
      planned: true
    },
    {
      id: "mcdonaldChecklist",
      cat: "neuro",
      subcat: "Multiple Sclerosis and Neuroinflammation",
      name: "McDonald Criteria Reference Checklist",
      desc: "2017 McDonald diagnostic criteria confirming Dissemination in Space and Time.",
      fields: [
        S("attacks", "Number of clinical attacks", "2", [["1", "1 clinical attack"], ["2", "≥2 clinical attacks"]]),
        S("lesions", "Number of objective clinical lesions", "2", [["1", "1 lesion"], ["2", "≥2 lesions"]]),
        S("dis", "Dissemination in Space (≥1 T2 lesion in ≥2 of 4 areas: periventricular, cortical/juxtacortical, infratentorial, spinal cord)", "1", [["0", "No"], ["1", "Yes"]]),
        S("dit", "Dissemination in Time (simultaneous asymptomatic gadolinium + non-gadolinium lesions, new T2 lesion on follow-up, OR CSF oligoclonal bands)", "1", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const att = +v.attacks, les = +v.lesions, dis = +v.dis === 1, dit = +v.dit === 1;
        let c = "";
        if (att >= 2 && les >= 2) c = "Definite Multiple Sclerosis (no additional imaging criteria needed)";
        else if (att >= 2 && les === 1) c = dis ? "Definite Multiple Sclerosis (DIS confirmed)" : "Requires DIS on MRI";
        else if (att === 1 && les >= 2) c = dit ? "Definite Multiple Sclerosis (DIT confirmed by MRI or CSF oligoclonal bands)" : "Requires DIT on MRI or CSF oligoclonal bands";
        else c = (dis && dit) ? "Definite Multiple Sclerosis (DIS and DIT satisfied)" : "Criteria not fully met; ongoing clinical/radiological surveillance required";
        return {
          value: c,
          eq: "2017 McDonald Criteria: CSF-specific oligoclonal bands can substitute for DIT."
        };
      }
    },
    {
      id: "nmoChecklist",
      cat: "neuro",
      subcat: "Multiple Sclerosis and Neuroinflammation",
      name: "Neuromyelitis Optica (NMOSD) Reference Checklist",
      desc: "2015 IPND diagnostic criteria for NMOSD with and without AQP4-IgG.",
      fields: [
        S("aqp4", "Serum AQP4-IgG antibody status", "pos", [["pos", "Positive"], ["neg", "Negative / Unknown"]]),
        S("core", "Number of core clinical characteristics (Optic neuritis, Acute myelitis, Area postrema syndrome, Brainstem, Diencephalic, Cerebral)", "1", [
          ["1", "1 core clinical characteristic"],
          ["2", "≥2 core clinical characteristics"]
        ])
      ],
      calc: v => {
        let res = "";
        if (v.aqp4 === "pos" && +v.core >= 1) res = "Meets NMOSD criteria with AQP4-IgG (≥1 core characteristic + positive serology)";
        else if (v.aqp4 === "neg" && +v.core >= 2) res = "Possible NMOSD without AQP4-IgG (requires at least 1 of ON, LETM, or area postrema syndrome + MRI criteria)";
        else res = "Does not satisfy 2015 IPND NMOSD diagnostic criteria";
        return {
          value: res,
          eq: "Core characteristics: Optic neuritis, Longitudinal extensive transverse myelitis (LETM ≥3 segments), Area postrema syndrome (intractable hiccups/nausea/vomiting)."
        };
      }
    },
    {
      id: "mogadChecklist",
      cat: "neuro",
      subcat: "Multiple Sclerosis and Neuroinflammation",
      name: "MOGAD Diagnostic Reference Checklist",
      desc: "2023 international diagnostic criteria for MOG antibody-associated disease.",
      fields: [
        S("mog", "Serum MOG-IgG (cell-based assay)", "clear_pos", [
          ["clear_pos", "Clear positive (high titer)"],
          ["low_pos", "Low positive"],
          ["neg", "Negative"]
        ]),
        S("pheno", "Core clinical demyelinating event (ON, Myelitis, ADEM, Cerebral cortical encephalitis, Brainstem/cerebellar)", "1", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        let res = "";
        if (v.mog === "clear_pos" && v.pheno === "1") res = "Satisfies 2023 MOGAD diagnostic criteria (Core event + clear positive MOG-IgG)";
        else if (v.mog === "low_pos" && v.pheno === "1") res = "Possible MOGAD (low-positive titer requires supporting clinical/MRI criteria)";
        else res = "MOGAD criteria not satisfied";
        return {
          value: res,
          eq: "2023 MOGAD panel requires: 1 core clinical event, confirmed positive MOG-IgG by cell-based assay, and exclusion of alternative diagnoses (MS, NMOSD)."
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