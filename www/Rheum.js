(function () {

  "use strict";

  const category = {

    id: "rheum",

    name: "Rheumatology",

    icon: "🦴"

  };

  const N = (id, label, value = 0, extra = {}) => ({

    id,

    label,

    value,

    type: "number",

    ...extra

  });

  const S = (id, label, value, options) => ({

    id,

    label,

    value,

    type: "select",

    options

  });

  const YN = (id, label) =>

    S(id, label, "0", [

      ["0", "No"],

      ["1", "Yes"]

    ]);

  const tools = [

    // 1. DAS28-ESR

    {

      id: "das28_esr",

      name: "DAS28-ESR Calculator",

      description: "Disease Activity Score using 28 joints and ESR.",

      fields: [

        N("tjc", "Tender joint count (0–28)", 0, { min: 0, max: 28 }),

        N("sjc", "Swollen joint count (0–28)", 0, { min: 0, max: 28 }),

        N("esr", "ESR (mm/hour)", 10, { min: 1 }),

        N("gh", "Patient global health (0–100 mm)", 0, { min: 0, max: 100 })

      ],

      calculate(v) {

        const score =

          0.56 * Math.sqrt(v.tjc) +

          0.28 * Math.sqrt(v.sjc) +

          0.70 * Math.log(v.esr) +

          0.014 * v.gh;

        return {

          value: score.toFixed(2),

          interpretation:

            score < 2.6 ? "Remission" :

            score < 3.2 ? "Low disease activity" :

            score <= 5.1 ? "Moderate disease activity" :

            "High disease activity"

        };

      }

    },

    // 2. DAS28-CRP

    {

      id: "das28_crp",

      name: "DAS28-CRP Calculator",

      description: "Disease Activity Score using 28 joints and CRP.",

      fields: [

        N("tjc", "Tender joint count (0–28)", 0, { min: 0, max: 28 }),

        N("sjc", "Swollen joint count (0–28)", 0, { min: 0, max: 28 }),

        N("crp", "CRP (mg/L)", 5, { min: 0 }),

        N("gh", "Patient global health (0–100 mm)", 0, { min: 0, max: 100 })

      ],

      calculate(v) {

        const score =

          0.56 * Math.sqrt(v.tjc) +

          0.28 * Math.sqrt(v.sjc) +

          0.36 * Math.log(v.crp + 1) +

          0.014 * v.gh +

          0.96;

        return {

          value: score.toFixed(2),

          interpretation:

            score < 2.6 ? "Possible remission range" :

            score < 3.2 ? "Low disease activity range" :

            score <= 5.1 ? "Moderate disease activity range" :

            "High disease activity range",

          note: "Interpret using the validated DAS28-CRP equation and applicable thresholds."

        };

      }

    },

    // 3. CDAI

    {

      id: "cdai",

      name: "CDAI",

      description: "Clinical Disease Activity Index for rheumatoid arthritis.",

      fields: [

        N("tjc", "Tender joint count (0–28)", 0, { min: 0, max: 28 }),

        N("sjc", "Swollen joint count (0–28)", 0, { min: 0, max: 28 }),

        N("pga", "Patient global assessment (0–10)", 0, { min: 0, max: 10 }),

        N("e ga", "Evaluator global assessment (0–10)", 0, { min: 0, max: 10 })

      ],

      calculate(v) {

        const score = v.tjc + v.sjc + v.pga + v["e ga"];

        return {

          value: score.toFixed(1),

          interpretation:

            score <= 2.8 ? "Remission" :

            score <= 10 ? "Low disease activity" :

            score <= 22 ? "Moderate disease activity" :

            "High disease activity"

        };

      }

    },

    // 4. SDAI

    {

      id: "sdai",

      name: "SDAI",

      description: "Simplified Disease Activity Index for rheumatoid arthritis.",

      fields: [

        N("tjc", "Tender joint count (0–28)", 0, { min: 0, max: 28 }),

        N("sjc", "Swollen joint count (0–28)", 0, { min: 0, max: 28 }),

        N("pga", "Patient global assessment (0–10)", 0, { min: 0, max: 10 }),

        N("ega", "Evaluator global assessment (0–10)", 0, { min: 0, max: 10 }),

        N("crp", "CRP (mg/dL)", 0, { min: 0 })

      ],

      calculate(v) {

        const score = v.tjc + v.sjc + v.pga + v.ega + v.crp;

        return {

          value: score.toFixed(2),

          interpretation:

            score <= 3.3 ? "Remission" :

            score <= 11 ? "Low disease activity" :

            score <= 26 ? "Moderate disease activity" :

            "High disease activity"

        };

      }

    },

    // 5. ACR/EULAR RA classification criteria

    {

      id: "ra_criteria",

      name: "2010 ACR/EULAR RA Classification Criteria",

      description: "Classification scoring for rheumatoid arthritis.",

      fields: [

        S("joints", "Joint involvement score", "0", [

          ["0", "Large joints only (0)"],

          ["2", "1–3 small joints (2)"],

          ["3", "4–10 small joints (3)"],

          ["5", ">10 joints, including at least 1 small joint (5)"]

        ]),

        S("serology", "Serology score", "0", [

          ["0", "Negative RF and ACPA (0)"],

          ["2", "Low-positive RF or ACPA (2)"],

          ["3", "High-positive RF or ACPA (3)"]

        ]),

        S("duration", "Symptom duration score", "0", [

          ["0", "Less than 6 weeks (0)"],

          ["1", "6 weeks or longer (1)"]

        ]),

        S("acute", "Acute-phase reactants score", "0", [

          ["0", "Normal ESR and CRP (0)"],

          ["1", "Abnormal ESR or CRP (1)"]

        ])

      ],

      calculate(v) {

        const score =

          Number(v.joints) +

          Number(v.serology) +

          Number(v.duration) +

          Number(v.acute);

        return {

          value: score + "/10",

          interpretation:

            score >= 6

              ? "Meets classification score threshold; clinical assessment required."

              : "Below classification score threshold.",

          note: "Apply only to patients with clinical synovitis not better explained by another condition."

        };

      }

    },

    // 6. HAQ-DI

    {

      id: "haq_di",

      name: "HAQ-DI",

      description: "Health Assessment Questionnaire Disability Index.",

      fields: [

        N("d1", "Dressing and grooming (0–3)", 0, { min: 0, max: 3 }),

        N("d2", "Arising (0–3)", 0, { min: 0, max: 3 }),

        N("d3", "Eating (0–3)", 0, { min: 0, max: 3 }),

        N("d4", "Walking (0–3)", 0, { min: 0, max: 3 }),

        N("d5", "Hygiene (0–3)", 0, { min: 0, max: 3 }),

        N("d6", "Reach (0–3)", 0, { min: 0, max: 3 }),

        N("d7", "Grip (0–3)", 0, { min: 0, max: 3 }),

        N("d8", "Usual activities (0–3)", 0, { min: 0, max: 3 })

      ],

      calculate(v) {

        const score = (

          v.d1 + v.d2 + v.d3 + v.d4 +

          v.d5 + v.d6 + v.d7 + v.d8

        ) / 8;

        return {

          value: score.toFixed(2) + "/3",

          interpretation: "Higher scores indicate greater disability.",

          note: "This simplified calculation does not adjust for aids or assistance."

        };

      }

    },

    // 7. SLEDAI-2K

    {

      id: "sledai2k",

      name: "SLEDAI-2K",

      description: "Systemic Lupus Erythematosus Disease Activity Index.",

      fields: [

        N("score8", "Selected active 8-point descriptors", 0, { min: 0, max: 24, step: 8 }),

        N("score4", "Selected active 4-point descriptors", 0, { min: 0, max: 24, step: 4 }),

        N("score2", "Selected active 2-point descriptors", 0, { min: 0, max: 24, step: 2 }),

        N("score1", "Selected active 1-point descriptors", 0, { min: 0, max: 24, step: 1 })

      ],

      calculate(v) {

        const score = v.score8 + v.score4 + v.score2 + v.score1;

        return {

          value: score,

          interpretation:

            score === 0 ? "No activity captured by entered descriptors." :

            score <= 5 ? "Mild activity range" :

            score <= 10 ? "Moderate activity range" :

            "High activity range",

          note: "Enter the sum of each descriptor group only once. Use the official SLEDAI-2K worksheet."

        };

      }

    },

    // 8. 2019 EULAR/ACR SLE classification

    {

      id: "sle_criteria",

      name: "2019 EULAR/ACR SLE Classification Criteria",

      description: "Classification scoring for systemic lupus erythematosus.",

      fields: [

        YN("ana", "ANA positive at least once (entry criterion)"),

        N("clinical", "Clinical domain points", 0, { min: 0, max: 20 }),

        N("immunology", "Immunologic domain points", 0, { min: 0, max: 20 })

      ],

      calculate(v) {

        if (Number(v.ana) !== 1) {

          return {

            value: "Entry criterion not met",

            interpretation: "ANA positivity is required to apply these classification criteria."

          };

        }

        const score = v.clinical + v.immunology;

        return {

          value: score + " points",

          interpretation:

            score >= 10

              ? "Meets the numerical threshold if at least one clinical criterion is present."

              : "Below the 10-point threshold.",

          note: "Use the official weighted criteria worksheet and apply the highest item within each domain."

        };

      }

    },

    // 9. SLICC/ACR Damage Index

    {

      id: "slicc_damage",

      name: "SLICC/ACR Damage Index",

      description: "Damage assessment in systemic lupus erythematosus.",

      fields: [

        N("domains", "Number of damaged domains (simplified)", 0, {

          min: 0,

          max: 12,

          step: 1

        })

      ],

      calculate(v) {

        return {

          value: v.domains,

          interpretation: "Simplified domain count only.",

          note: "This is not the official SLICC/ACR Damage Index. Use the full index for clinical assessment."

        };

      }

    },

    // 10. LLDAS

    {

      id: "lldas",

      name: "LLDAS Assessment",

      description: "Lupus Low Disease Activity State screening checklist.",

      fields: [

        YN("sledai", "SLEDAI-2K ≤4?"),

        YN("major", "No major organ activity?"),

        YN("new", "No new disease activity?"),

        N("pga", "Physician global assessment (0–3)", 0, { min: 0, max: 3 }),

        N("pred", "Prednisolone-equivalent dose (mg/day)", 0, { min: 0 }),

        YN("stable", "Stable maintenance treatment?")

      ],

      calculate(v) {

        const pass =

          Number(v.sledai) === 1 &&

          Number(v.major) === 1 &&

          Number(v.new) === 1 &&

          v.pga <= 1 &&

          v.pred <= 7.5 &&

          Number(v.stable) === 1;

        return {

          value: pass ? "LLDAS screening criteria met" : "LLDAS screening criteria not met",

          note: "Confirm against the formal LLDAS definition and treating clinician's assessment."

        };

      }

    },

    // 11. BVAS

    {

      id: "bvas",

      name: "BVAS",

      description: "Birmingham Vasculitis Activity Score.",

      fields: [

        N("score", "Total BVAS from completed worksheet", 0, { min: 0, max: 63 })

      ],

      calculate(v) {

        return {

          value: v.score,

          note: "Manual total only. Use the official BVAS version and item-level worksheet."

        };

      }

    },

    // 12. GPA classification

    {

      id: "gpa_criteria",

      name: "2022 ACR/EULAR GPA Classification Criteria",

      description: "Classification criteria for granulomatosis with polyangiitis.",

      fields: [

        N("sinonasal", "Bloody nasal discharge, crusting, or sinonasal congestion (+3)", 0, { min: 0, max: 1 }),

        N("cartilage", "Cartilaginous involvement (+2)", 0, { min: 0, max: 1 }),

        N("hearing", "Conductive or sensorineural hearing loss (+1)", 0, { min: 0, max: 1 }),

        N("pr3", "PR3-ANCA or c-ANCA positive (+5)", 0, { min: 0, max: 1 }),

        N("biopsy", "Granuloma or giant cells on biopsy (+2)", 0, { min: 0, max: 1 }),

        N("lung", "Pulmonary nodule, mass, or cavitation (+2)", 0, { min: 0, max: 1 }),

        N("renal", "Pauci-immune glomerulonephritis (+1)", 0, { min: 0, max: 1 }),

        N("mpo", "MPO-ANCA or p-ANCA positive (−1)", 0, { min: 0, max: 1 }),

        N("eos", "Eosinophils ≥1 × 10⁹/L (−4)", 0, { min: 0, max: 1 })

      ],

      calculate(v) {

        const score =

          3 * v.sinonasal +

          2 * v.cartilage +

          v.hearing +

          5 * v.pr3 +

          2 * v.biopsy +

          2 * v.lung +

          v.renal -

          v.mpo -

          4 * v.eos;

        return {

          value: score + " points",

          interpretation:

            score >= 5

              ? "Meets classification score threshold."

              : "Below classification score threshold.",

          note: "Apply only after establishing a diagnosis of small- or medium-vessel vasculitis and excluding mimics."

        };

      }

    },

    // 13. MPA classification

    {

      id: "mpa_criteria",

      name: "2022 ACR/EULAR MPA Classification Criteria",

      description: "Classification criteria for microscopic polyangiitis.",

      fields: [

        N("mpo", "MPO-ANCA or p-ANCA positive (+6)", 0, { min: 0, max: 1 }),

        N("renal", "Pauci-immune glomerulonephritis (+3)", 0, { min: 0, max: 1 }),

        N("ild", "Interstitial lung disease or pulmonary fibrosis (+3)", 0, { min: 0, max: 1 }),

        N("sinonasal", "Sinonasal involvement (−3)", 0, { min: 0, max: 1 }),

        N("pr3", "PR3-ANCA or c-ANCA positive (−1)", 0, { min: 0, max: 1 }),

        N("eos", "Eosinophils ≥1 × 10⁹/L (−4)", 0, { min: 0, max: 1 })

      ],

      calculate(v) {

        const score =

          6 * v.mpo +

          3 * v.renal +

          3 * v.ild -

          3 * v.sinonasal -

          v.pr3 -

          4 * v.eos;

        return {

          value: score + " points",

          interpretation:

            score >= 5

              ? "Meets classification score threshold."

              : "Below classification score threshold.",

          note: "Classification criteria are not diagnostic criteria."

        };

      }

    },

    // 14. EGPA classification

    {

      id: "egpa_criteria",

      name: "2022 ACR/EULAR EGPA Classification Criteria",

      description: "Classification criteria for eosinophilic granulomatosis with polyangiitis.",

      fields: [

        N("eos", "Eosinophils ≥1 × 10⁹/L (+5)", 0, { min: 0, max: 1 }),

        N("asthma", "Obstructive airway disease or asthma (+3)", 0, { min: 0, max: 1 }),

        N("polyps", "Nasal polyps (+3)", 0, { min: 0, max: 1 }),

        N("neuropathy", "Mononeuritis multiplex or motor neuropathy (+1)", 0, { min: 0, max: 1 }),

        N("hematuria", "Hematuria (−1)", 0, { min: 0, max: 1 }),

        N("pr3", "PR3-ANCA or c-ANCA positive (−3)", 0, { min: 0, max: 1 }),

        N("biopsy", "Extravascular eosinophilic inflammation (+2)", 0, { min: 0, max: 1 })

      ],

      calculate(v) {

        const score =

          5 * v.eos +

          3 * v.asthma +

          3 * v.polyps +

          v.neuropathy -

          v.hematuria -

          3 * v.pr3 +

          2 * v.biopsy;

        return {

          value: score + " points",

          interpretation:

            score >= 6

              ? "Meets classification score threshold."

              : "Below classification score threshold.",

          note: "Classification criteria are not diagnostic criteria."

        };

      }

    },

    // 15. Giant cell arteritis

    {

      id: "gca_criteria",

      name: "2022 ACR/EULAR Giant Cell Arteritis Classification Criteria",

      description: "Classification score for giant cell arteritis.",

      fields: [

        S("age", "Age at diagnosis", "70", [

          ["under50", "Under 50 years"],

          ["50", "50–69 years"],

          ["70", "70–79 years"],

          ["80", "80 years or older"]

        ]),

        N("jaw", "Jaw or tongue claudication (+2)", 0, { min: 0, max: 1 }),

        N("morning", "Morning stiffness in shoulders/neck (+2)", 0, { min: 0, max: 1 }),

        N("vision", "Sudden visual loss (+3)", 0, { min: 0, max: 1 }),

        N("temporal", "Temporal artery abnormality (+2)", 0, { min: 0, max: 1 }),

        N("esrcrp", "ESR ≥50 mm/h or CRP ≥10 mg/L (+3)", 0, { min: 0, max: 1 }),

        N("biopsy", "Positive temporal artery biopsy or halo sign (+5)", 0, { min: 0, max: 1 }),

        N("axillary", "Bilateral axillary artery involvement (+2)", 0, { min: 0, max: 1 }),

        N("aorta", "Aortic FDG-PET activity (+2)", 0, { min: 0, max: 1 })

      ],

      calculate(v) {

        const agePoints = {

          under50: -100,

          "50": 0,

          "70": 1,

          "80": 3

        };

        const score =

          agePoints[v.age] +

          2 * v.jaw +

          2 * v.morning +

          3 * v.vision +

          2 * v.temporal +

          3 * v.esrcrp +

          5 * v.biopsy +

          2 * v.axillary +

          2 * v.aorta;

        return {

          value: score + " points",

          interpretation:

            score >= 6

              ? "Meets numerical classification threshold."

              : "Below numerical classification threshold.",

          note: "Use the official criteria and clinical evaluation; these criteria are not a stand-alone diagnostic test."

        };

      }

    },

    // 16. Takayasu arteritis

    {

      id: "takayasu_criteria",

      name: "2022 ACR/EULAR Takayasu Arteritis Classification Criteria",

      description: "Classification scoring for Takayasu arteritis.",

      fields: [

        N("age", "Age at diagnosis (years)", 30, { min: 0, max: 120 }),

        N("female", "Female sex (+1)", 0, { min: 0, max: 1 }),

        N("angina", "Angina (+2)", 0, { min: 0, max: 1 }),

        N("limb", "Limb claudication (+2)", 0, { min: 0, max: 1 }),

        N("bruit", "Arterial bruit (+2)", 0, { min: 0, max: 1 }),

        N("pulse", "Reduced upper limb pulse (+2)", 0, { min: 0, max: 1 }),

        N("pressure", "Inter-arm systolic BP difference ≥20 mmHg (+1)", 0, { min: 0, max: 1 }),

        N("imaging", "Large-vessel imaging abnormality (+3)", 0, { min: 0, max: 1 })

      ],

      calculate(v) {

        const score =

          (v.age < 60 ? 1 : 0) +

          v.female +

          2 * v.angina +

          2 * v.limb +

          2 * v.bruit +

          2 * v.pulse +

          v.pressure +

          3 * v.imaging;

        return {

          value: score + " points",

          interpretation:

            score >= 5

              ? "Possible classification threshold met; verify official criteria."

              : "Below simplified threshold.",

          note: "This is a simplified screening implementation, not an official validated calculator."

        };

      }

    },

    // 17. BASDAI

    {

      id: "basdai",

      name: "BASDAI",

      description: "Bath Ankylosing Spondylitis Disease Activity Index.",

      fields: [

        N("q1", "Fatigue (0–10)", 0, { min: 0, max: 10 }),

        N("q2", "Spinal pain (0–10)", 0, { min: 0, max: 10 }),

        N("q3", "Joint pain/swelling (0–10)", 0, { min: 0, max: 10 }),

        N("q4", "Enthesitis discomfort (0–10)", 0, { min: 0, max: 10 }),

        N("q5", "Morning stiffness severity (0–10)", 0, { min: 0, max: 10 }),

        N("q6", "Morning stiffness duration (0–10)", 0, { min: 0, max: 10 })

      ],

      calculate(v) {

        const score =

          (v.q1 + v.q2 + v.q3 + v.q4 + (v.q5 + v.q6) / 2) / 5;

        return {

          value: score.toFixed(2) + "/10",

          interpretation:

            score >= 4

              ? "High disease activity is often considered at BASDAI ≥4."

              : "BASDAI below 4.",

          note: "Interpret alongside clinical findings."

        };

      }

    },

    // 18. ASDAS-CRP

    {

      id: "asdas_crp",

      name: "ASDAS-CRP",

      description: "Ankylosing Spondylitis Disease Activity Score using CRP.",

      fields: [

        N("back", "Back pain (0–10)", 0, { min: 0, max: 10 }),

        N("morning", "Morning stiffness duration (0–10)", 0, { min: 0, max: 10 }),

        N("global", "Patient global assessment (0–10)", 0, { min: 0, max: 10 }),

        N("peripheral", "Peripheral pain/swelling (0–10)", 0, { min: 0, max: 10 }),

        N("crp", "CRP (mg/L)", 5, { min: 0 })

      ],

      calculate(v) {

        const score =

          0.121 * v.back +

          0.058 * v.morning +

          0.110 * v.global +

          0.073 * v.peripheral +

          0.579 * Math.log(v.crp + 1);

        return {

          value: score.toFixed(2),

          interpretation:

            score < 1.3 ? "Inactive disease" :

            score < 2.1 ? "Low disease activity" :

            score <= 3.5 ? "High disease activity" :

            "Very high disease activity"

        };

      }

    },

    // 19. ASDAS-ESR

    {

      id: "asdas_esr",

      name: "ASDAS-ESR",

      description: "Ankylosing Spondylitis Disease Activity Score using ESR.",

      fields: [

        N("back", "Back pain (0–10)", 0, { min: 0, max: 10 }),

        N("morning", "Morning stiffness duration (0–10)", 0, { min: 0, max: 10 }),

        N("global", "Patient global assessment (0–10)", 0, { min: 0, max: 10 }),

        N("peripheral", "Peripheral pain/swelling (0–10)", 0, { min: 0, max: 10 }),

        N("esr", "ESR (mm/hour)", 10, { min: 0 })

      ],

      calculate(v) {

        const score =

          0.079 * v.back +

          0.069 * v.morning +

          0.113 * v.global +

          0.086 * v.peripheral +

          0.293 * Math.sqrt(v.esr) +

          1.0;

        return {

          value: score.toFixed(2),

          interpretation:

            score < 1.3 ? "Inactive disease range" :

            score < 2.1 ? "Low disease activity range" :

            score <= 3.5 ? "High disease activity range" :

            "Very high disease activity range",

          note: "Verify formula and interpretation against the official ASDAS calculator."

        };

      }

    },

    // 20. BASFI

    {

      id: "basfi",

      name: "BASFI",

      description: "Bath Ankylosing Spondylitis Functional Index.",

      fields: [

        N("q1", "Put on socks/stockings (0–10)", 0, { min: 0, max: 10 }),

        N("q2", "Bend forward (0–10)", 0, { min: 0, max: 10 }),

        N("q3", "Reach high shelf (0–10)", 0, { min: 0, max: 10 }),

        N("q4", "Get up from armless chair (0–10)", 0, { min: 0, max: 10 }),

        N("q5", "Get up from floor (0–10)", 0, { min: 0, max: 10 }),

        N("q6", "Stand unsupported (0–10)", 0, { min: 0, max: 10 }),

        N("q7", "Climb steps (0–10)", 0, { min: 0, max: 10 }),

        N("q8", "Look over shoulder (0–10)", 0, { min: 0, max: 10 }),

        N("q9", "Physical activities (0–10)", 0, { min: 0, max: 10 }),

        N("q10", "Full day activities (0–10)", 0, { min: 0, max: 10 })

      ],

      calculate(v) {

        const score = (

          v.q1 + v.q2 + v.q3 + v.q4 + v.q5 +

          v.q6 + v.q7 + v.q8 + v.q9 + v.q10

        ) / 10;

        return {

          value: score.toFixed(2) + "/10",

          interpretation: "Higher scores indicate greater functional limitation."

        };

      }

    },

    // 21. BASMI

    {

      id: "basmi",

      name: "BASMI",

      description: "Bath Ankylosing Spondylitis Metrology Index.",

      fields: [

        N("cervical", "Cervical rotation component (0–10)", 0, { min: 0, max: 10 }),

        N("tragus", "Tragus-to-wall component (0–10)", 0, { min: 0, max: 10 }),

        N("lumbar", "Lumbar side-flexion component (0–10)", 0, { min: 0, max: 10 }),

        N("modified", "Modified Schober component (0–10)", 0, { min: 0, max: 10 }),

        N("intermalleolar", "Intermalleolar distance component (0–10)", 0, { min: 0, max: 10 })

      ],

      calculate(v) {

        const score = (

          v.cervical + v.tragus + v.lumbar +

          v.modified + v.intermalleolar

        ) / 5;

        return {

          value: score.toFixed(2) + "/10",

          interpretation: "Simplified mean of entered components; use the official BASMI scoring method for clinical use."

        };

      }

    },

    // 22. ASAS axial SpA classification

    {

      id: "asas_axspa",

      name: "ASAS Axial Spondyloarthritis Classification Criteria",

      description: "Classification framework for axial spondyloarthritis.",

      fields: [

        YN("backpain", "Back pain ≥3 months with onset before age 45?"),

        YN("imaging", "Sacroiliitis on imaging?"),

        YN("h la", "HLA-B27 positive?"),

        N("features", "Number of additional SpA features", 0, { min: 0, max: 10, step: 1 })

      ],

      calculate(v) {

        if (Number(v.backpain) !== 1) {

          return {

            value: "Entry criteria not met",

            note: "The classification framework applies to chronic back pain beginning before age 45."

          };

        }

        const imagingArm =

          Number(v.imaging) === 1 && v.features >= 1;

        const clinicalArm =

          Number(v["h la"]) === 1 && v.features >= 2;

        return {

          value: imagingArm || clinicalArm

            ? "Classification criteria may be met"

            : "Classification criteria not met",

          note: "Requires the full ASAS definitions of imaging sacroiliitis and SpA features. Classification criteria are not diagnostic criteria."

        };

      }

    }

  ];

  window.MedCalcModules = window.MedCalcModules || [];

  window.MedCalcModules.push({

    category,

    guidance: [

      "Rheumatology calculators are intended for educational and clinical decision support, not as stand-alone diagnostic tools.",

      "Use validated official worksheets and current guidelines when scoring classification criteria."

    ],

    tools

  });

})();
