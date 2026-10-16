// rheum_extra.js
(function () {
  "use strict";

  window.MedCalcModules = window.MedCalcModules || [];

  const category = {
    id: "rheum",
    name: "Rheumatology",
    icon: "🦴",
    desc: "Arthritis, gout, connective tissue diseases, and other rheumatological conditions"
  };

  const guidance = {

    // 23. Psoriatic Arthritis — CASPAR
    caspar: [
      "CASPAR requires inflammatory articular disease plus at least 3 points from the classification features. Current psoriasis scores 2 points; a history of psoriasis or family history scores 1; typical nail dystrophy, negative rheumatoid factor, dactylitis, and juxta-articular new bone formation each score 1.",
      "Used to classify psoriatic arthritis in patients with inflammatory joint, spinal, or entheseal disease. It supports research classification and does not replace clinical diagnosis."
    ],

    // 24. DAPSA
    dapsa: [
      "DAPSA = tender joint count (68 joints) + swollen joint count (66 joints) + patient pain (0–10) + patient global assessment (0–10) + CRP in mg/dL. Common activity categories are remission ≤4, low >4–14, moderate >14–28, and high >28.",
      "Used to quantify peripheral joint disease activity in psoriatic arthritis and monitor response to treatment. It does not adequately capture skin, enthesitis, or axial disease."
    ],

    // 25. PASDAS
    pasdas: [
      "PASDAS combines patient and physician global assessments, tender and swollen joint counts, enthesitis, dactylitis, and CRP using a weighted equation. Higher scores indicate greater psoriatic arthritis activity; commonly used categories are ≤1.9 very low, >1.9–3.2 low, >3.2–5.4 moderate, and >5.4 high.",
      "Used to assess multiple domains of psoriatic arthritis together, including peripheral joints and other musculoskeletal manifestations. The official weighted formula should be used for clinical scoring."
    ],

    // 26. 2015 ACR/EULAR Gout Classification Criteria
    gout2015: [
      "The 2015 ACR/EULAR gout classification system uses a sufficient criterion of monosodium urate crystals in symptomatic joint fluid or a tophus. Otherwise, it combines the pattern of joint involvement, episode characteristics, time course, tophi, serum urate, synovial-fluid findings, and imaging evidence. A total score of at least 8 supports classification.",
      "Used to classify gout consistently for research and clinical studies. Classification criteria are not a substitute for diagnostic evaluation, and a low score does not independently exclude gout."
    ],

    // 27. Gout Activity Score
    goutActivity: [
      "The Gout Activity Score is a multidimensional assessment of gout burden. The validated score uses specific clinical and patient-reported variables; the simplified inputs below are not sufficient to reproduce the official validated score.",
      "Used to follow gout activity over time and assess response to urate-lowering treatment. For a validated numerical result, use the published scoring instrument and its specified inputs."
    ],

    // 29. Sjögren Syndrome Classification Criteria
    sjogren2016: [
      "The 2016 ACR/EULAR criteria assign 3 points each for anti-SSA/Ro positivity and focal lymphocytic sialadenitis with focus score ≥1 per 4 mm². Ocular staining score ≥5 (or van Bijsterveld ≥4), Schirmer test ≤5 mm/5 min, and unstimulated salivary flow ≤0.1 mL/min each score 1 point. A total ≥4 is the classification threshold in an eligible patient.",
      "Used to classify primary Sjögren syndrome in appropriate patients. These criteria require eligibility and exclusion checks and should not be interpreted as a stand-alone diagnostic test."
    ],

    // 30. Systemic Sclerosis Classification Criteria
    systemicSclerosis2013: [
      "The 2013 ACR/EULAR systemic sclerosis criteria use skin thickening of both hands extending proximal to the metacarpophalangeal joints as a sufficient criterion. Otherwise, weighted features include finger skin changes, fingertip lesions, telangiectasia, abnormal nailfold capillaries, interstitial lung disease or pulmonary arterial hypertension, Raynaud phenomenon, and systemic-sclerosis-related autoantibodies. A total ≥9 supports classification.",
      "Used to classify systemic sclerosis, especially in patients without the characteristic proximal skin thickening. Classification helps standardize research and does not replace clinical assessment."
    ],

    // 31. Idiopathic Inflammatory Myopathy
    myositis2017: [
      "The 2017 EULAR/ACR inflammatory myopathy criteria use weighted clinical, laboratory, and biopsy features to estimate the probability of idiopathic inflammatory myopathy. The official score distinguishes cases with and without muscle biopsy and supports probable or definite classification at specified probability thresholds.",
      "Used to classify inflammatory myopathies for research and structured evaluation. The full validated score requires specific variables and, where applicable, biopsy findings; the simplified checklist below is not the official calculator."
    ],

    // 32. Polymyalgia Rheumatica
    pmr2012: [
      "The 2012 EULAR/ACR PMR classification algorithm starts with age ≥50 years, bilateral shoulder pain, and elevated ESR or CRP. The clinical score uses morning stiffness, hip pain or limited hip range of motion, absence of RF/ACPA, and absence of other joint pain. Ultrasound can contribute additional points. The published thresholds differ between clinical and ultrasound algorithms.",
      "Used to classify patients with a compatible polymyalgia rheumatica presentation and support differentiation from mimics such as rheumatoid arthritis. It is not a stand-alone diagnostic test."
    ],

    // 33. Antiphospholipid Syndrome
    aps2023: [
      "The 2023 ACR/EULAR APS classification criteria use an entry requirement involving an antiphospholipid antibody test and a qualifying clinical criterion, followed by weighted clinical and laboratory domains. Classification requires sufficient points in both clinical and laboratory domains under the official rules.",
      "Used to standardize classification of antiphospholipid syndrome in research. A positive antibody alone does not establish APS; clinical history, persistence of antibodies, laboratory context, and alternative explanations matter."
    ],

    // 34. Behçet Disease
    behcetICBD: [
      "The International Criteria for Behçet Disease assign 2 points each for oral aphthosis, genital aphthosis, and ocular lesions; 1 point each for skin, neurological, and vascular manifestations; and 1 optional point for a positive pathergy test. A total of at least 4 points meets the ICBD classification threshold.",
      "Used to support classification of Behçet disease, a multisystem inflammatory disorder. Clinical judgement is essential because individual features can occur in other conditions."
    ],

    // 35. Fibromyalgia
    fibromyalgia: [
      "The Widespread Pain Index (WPI) counts painful body regions, while the Symptom Severity Scale (SSS) assesses fatigue, waking unrefreshed, cognitive symptoms, and selected associated symptoms. The 2016 criteria use WPI and SSS thresholds together with generalized pain in at least 4 of 5 regions and symptoms generally present for at least 3 months.",
      "Used to structure assessment of widespread pain and associated symptom burden in suspected fibromyalgia. It does not exclude other causes of pain or mean that additional diagnoses cannot coexist."
    ],

    // 36. Osteoarthritis
    osteoarthritis: [
      "Osteoarthritis assessment depends on the joint involved, symptoms, examination, function, and—when indicated—imaging. This tool is a symptom and function checklist, not a validated diagnostic or severity score. It does not generate an official WOMAC, KOOS, HOOS, or other validated instrument score.",
      "Used to organize assessment of pain, stiffness, and functional limitation and to help track symptoms over time. Use the validated instrument appropriate to the joint and clinical setting when a formal score is needed."
    ],

    // 37. Juvenile Idiopathic Arthritis
    jiaSupport: [
      "Juvenile idiopathic arthritis refers to arthritis beginning before age 16, lasting at least 6 weeks, with other causes excluded. Classification into JIA categories depends on the pattern and duration of arthritis, joint distribution, systemic features, psoriasis, enthesitis, family history, and relevant laboratory findings.",
      "Used to structure the initial classification assessment of childhood-onset inflammatory arthritis. This checklist does not establish the diagnosis; infection, malignancy, and other inflammatory or orthopaedic causes must be considered."
    ]
  };

  const YN = (id, label) =>
    S(id, label, "0", [
      ["0", "No"],
      ["1", "Yes"]
    ]);

  const tools = [

    // ==================================================
    // 23. CASPAR Classification Criteria
    // ==================================================
    {
      id: "caspar",
      cat: "rheum",
      subcat: "Psoriatic Arthritis",
      name: "CASPAR Classification Criteria",
      desc: "Classification support for psoriatic arthritis.",
      fields: [
        YN("inflammatory", "Inflammatory articular disease present?"),
        S("psoriasis", "Psoriasis status", "0", [
          ["0", "No current, previous, or family history"],
          ["1", "Previous psoriasis or family history (1 point)"],
          ["2", "Current psoriasis (2 points)"]
        ]),
        YN("nails", "Typical psoriatic nail dystrophy (+1)"),
        YN("rf", "Rheumatoid factor negative (+1)"),
        YN("dactylitis", "Current or previous dactylitis (+1)"),
        YN("bone", "Juxta-articular new bone formation on radiographs (+1)")
      ],
      calc: v => {
        const score =
          +v.psoriasis +
          +v.nails +
          +v.rf +
          +v.dactylitis +
          +v.bone;

        if (v.inflammatory !== "1") {
          return {
            value: "Entry requirement not met",
            eq: "CASPAR requires inflammatory articular disease involving joints, the spine, or entheses."
          };
        }

        return {
          value: score + " points — " +
            (score >= 3
              ? "CASPAR classification threshold met"
              : "CASPAR classification threshold not met"),
          eq: "Threshold: ≥3 points after the inflammatory articular disease entry requirement. Classification criteria are not stand-alone diagnostic criteria."
        };
      }
    },

    // ==================================================
    // 24. DAPSA Calculator
    // ==================================================
    {
      id: "dapsa",
      cat: "rheum",
      subcat: "Psoriatic Arthritis",
      name: "DAPSA Calculator",
      desc: "Disease Activity in Psoriatic Arthritis using peripheral joint counts.",
      fields: [
        N("tjc", "Tender joint count (68 joints)", 0, {
          min: 0, max: 68, step: 1
        }),
        N("sjc", "Swollen joint count (66 joints)", 0, {
          min: 0, max: 66, step: 1
        }),
        N("pain", "Patient pain assessment (0–10)", 0, {
          min: 0, max: 10
        }),
        N("global", "Patient global assessment (0–10)", 0, {
          min: 0, max: 10
        }),
        N("crp", "CRP (mg/dL)", 0, {
          min: 0
        })
      ],
      calc: v => {
        const score =
          v.tjc + v.sjc + v.pain + v.global + v.crp;

        let interpretation;

        if (score <= 4) {
          interpretation = "Remission";
        } else if (score <= 14) {
          interpretation = "Low disease activity";
        } else if (score <= 28) {
          interpretation = "Moderate disease activity";
        } else {
          interpretation = "High disease activity";
        }

        return {
          value: score.toFixed(2) + " — " + interpretation,
          eq: "DAPSA = TJC68 + SJC66 + pain (0–10) + patient global (0–10) + CRP (mg/dL). Assesses peripheral joint disease; it does not capture all skin or axial disease."
        };
      }
    },

    // ==================================================
    // 25. PASDAS
    // ==================================================
    {
      id: "pasdas",
      cat: "rheum",
      subcat: "Psoriatic Arthritis",
      name: "PASDAS Calculator",
      desc: "Multidomain psoriatic arthritis disease activity assessment.",
      fields: [
        N("patient", "Patient global assessment (0–100)", 0, {
          min: 0, max: 100
        }),
        N("physician", "Physician global assessment (0–100)", 0, {
          min: 0, max: 100
        }),
        N("tjc", "Tender joint count (68 joints)", 0, {
          min: 0, max: 68, step: 1
        }),
        N("sjc", "Swollen joint count (66 joints)", 0, {
          min: 0, max: 66, step: 1
        }),
        N("enthesitis", "Enthesitis count (LEI)", 0, {
          min: 0, max: 6, step: 1
        }),
        N("dactylitis", "Dactylitis count", 0, {
          min: 0, max: 20, step: 1
        }),
        N("crp", "CRP (mg/dL)", 0, {
          min: 0
        })
      ],
      calc: v => {
        return {
          value: "Official PASDAS score not calculated",
          eq: "PASDAS requires the validated weighted equation and specific input conventions. These fields organize the required domains but do not produce a validated PASDAS result. Use the official PASDAS worksheet before interpreting disease activity."
        };
      }
    },

    // ==================================================
    // 26. 2015 ACR/EULAR Gout Classification Criteria
    // ==================================================
    {
      id: "gout2015",
      cat: "rheum",
      subcat: "Gout and Crystal Arthropathies",
      name: "2015 ACR/EULAR Gout Classification Criteria",
      desc: "Classification scoring for gout.",
      fields: [
        YN("crystals", "Monosodium urate crystals in symptomatic joint fluid or tophus identified?"),
        S("joint", "Pattern of symptomatic joint involvement", "0", [
          ["0", "Other pattern / no listed joint"],
          ["2", "Ankle or midfoot, without first MTP involvement (+1)"],
          ["2", "First metatarsophalangeal joint involvement (+2)"]
        ]),
        S("episode", "Episode characteristics", "0", [
          ["0", "No typical features"],
          ["1", "One typical episode feature"],
          ["2", "Two typical episode features"],
          ["3", "Three typical episode features"]
        ]),
        S("course", "Time course of episodes", "0", [
          ["0", "No typical time-course pattern"],
          ["1", "One typical episode with resolution"],
          ["2", "Recurrent typical episodes"]
        ]),
        YN("tophi", "Clinical tophus present?"),
        S("urate", "Highest serum urate (mg/dL)", "0", [
          ["-4", "<4 mg/dL"],
          ["0", "4 to <6 mg/dL"],
          ["2", "6 to <8 mg/dL"],
          ["3", "8 to <10 mg/dL"],
          ["4", "≥10 mg/dL"]
        ]),
        S("fluid", "Synovial fluid microscopy", "0", [
          ["0", "Not assessed or inconclusive"],
          ["-2", "MSU crystals absent in symptomatic joint fluid (−2)"]
        ]),
        YN("us", "Imaging evidence of urate deposition or double-contour sign?"),
        YN("de", "Dual-energy CT evidence of urate deposition?")
      ],
      calc: v => {
        if (v.crystals === "1") {
          return {
            value: "Sufficient criterion present",
            eq: "MSU crystals in symptomatic joint fluid or a tophus establish the sufficient classification criterion. Clinical context and differential diagnosis still matter."
          };
        }

        const score =
          Number(v.joint) +
          Number(v.episode) +
          Number(v.course) +
          (v.tophi === "1" ? 4 : 0) +
          Number(v.urate) +
          Number(v.fluid) +
          (v.us === "1" ? 4 : 0) +
          (v.de === "1" ? 4 : 0);

        return {
          value: score + " points — " +
            (score >= 8
              ? "classification threshold reached"
              : "classification threshold not reached"),
          eq: "A score ≥8 supports gout classification under the 2015 ACR/EULAR system. This simplified form omits several detailed scoring rules and is not the official validated calculator."
        };
      }
    },

    // ==================================================
    // 27. Gout Activity Score
    // ==================================================
    {
      id: "goutActivity",
      cat: "rheum",
      subcat: "Gout and Crystal Arthropathies",
      name: "Gout Activity Score",
      desc: "Gout activity tracking support.",
      fields: [
        N("flares", "Gout flares in the previous 12 months", 0, {
          min: 0, max: 100, step: 1
        }),
        N("pain", "Current gout-related pain (0–10)", 0, {
          min: 0, max: 10
        }),
        N("urate", "Serum urate (mg/dL)", 6, {
          min: 0
        }),
        YN("tophi", "Tophi present?"),
        YN("function", "Function limited by gout?")
      ],
      calc: v => {
        return {
          value: "Descriptive assessment only",
          eq:
            "Inputs recorded: " +
            v.flares + " flare(s) in the last year; pain " +
            v.pain + "/10; serum urate " +
            v.urate + " mg/dL; tophi " +
            (v.tophi === "1" ? "present" : "absent") +
            "; gout-related functional limitation " +
            (v.function === "1" ? "present" : "absent") +
            ". These inputs do not reproduce the validated Gout Activity Score (GAS) formula. Do not interpret them as an official GAS numerical score."
        };
      }
    },

    // ==================================================
    // 29. Sjögren Syndrome Classification Criteria
    // ==================================================
    {
      id: "sjogren2016",
      cat: "rheum",
      subcat: "Connective Tissue Diseases",
      name: "2016 ACR/EULAR Sjögren Syndrome Classification Criteria",
      desc: "Weighted classification items for Sjögren syndrome.",
      fields: [
        YN("ssa", "Anti-SSA/Ro antibody positive (+3)"),
        YN("biopsy", "Labial salivary gland biopsy focus score ≥1 per 4 mm² (+3)"),
        YN("ocular", "Ocular staining score ≥5 or van Bijsterveld score ≥4 (+1)"),
        YN("schirmer", "Schirmer test ≤5 mm/5 minutes (+1)"),
        YN("saliva", "Unstimulated whole salivary flow ≤0.1 mL/min (+1)"),
        YN("eligible", "Appropriate eligibility and exclusion criteria reviewed?")
      ],
      calc: v => {
        const score =
          3 * (v.ssa === "1") +
          3 * (v.biopsy === "1") +
          (v.ocular === "1") +
          (v.schirmer === "1") +
          (v.saliva === "1");

        return {
          value: score + " points — " +
            (v.eligible !== "1"
              ? "review eligibility and exclusions"
              : score >= 4
                ? "classification threshold reached"
                : "classification threshold not reached"),
          eq: "Threshold ≥4 points in an eligible patient. Verify all formal inclusion and exclusion rules; this is a classification tool, not a stand-alone diagnosis."
        };
      }
    },

    // ==================================================
    // 30. Systemic Sclerosis Classification Criteria
    // ==================================================
    {
      id: "systemicSclerosis2013",
      cat: "rheum",
      subcat: "Connective Tissue Diseases",
      name: "2013 ACR/EULAR Systemic Sclerosis Classification Criteria",
      desc: "Weighted classification scoring for systemic sclerosis.",
      fields: [
        YN("proximal", "Skin thickening of both hands extending proximal to MCP joints?"),
        S("finger", "Finger skin changes", "0", [
          ["0", "None"],
          ["2", "Puffy fingers (+2)"],
          ["4", "Sclerodactyly (+4)"]
        ]),
        S("lesions", "Fingertip lesions", "0", [
          ["0", "None"],
          ["2", "Digital tip ulcers (+2)"],
          ["3", "Fingertip pitting scars (+3)"]
        ]),
        YN("telangiectasia", "Telangiectasia (+2)"),
        YN("nailfold", "Abnormal nailfold capillaries (+2)"),
        YN("pulmonary", "Pulmonary arterial hypertension or interstitial lung disease (+2)"),
        YN("raynaud", "Raynaud phenomenon (+3)"),
        YN("antibody", "SSc-related autoantibody present (+3)")
      ],
      calc: v => {
        if (v.proximal === "1") {
          return {
            value: "Sufficient criterion present",
            eq: "Bilateral hand skin thickening extending proximal to the MCP joints is sufficient for classification under the 2013 ACR/EULAR criteria, provided exclusion conditions are considered."
          };
        }

        const score =
          Number(v.finger) +
          Number(v.lesions) +
          2 * (v.telangiectasia === "1") +
          2 * (v.nailfold === "1") +
          2 * (v.pulmonary === "1") +
          3 * (v.raynaud === "1") +
          3 * (v.antibody === "1");

        return {
          value: score + " points — " +
            (score >= 9
              ? "classification threshold reached"
              : "classification threshold not reached"),
          eq: "Threshold ≥9 points. Some items use detailed subcriteria and alternative weights in the official system; verify with the full criteria worksheet."
        };
      }
    },

    // ==================================================
    // 31. Idiopathic Inflammatory Myopathy Criteria
    // ==================================================
    {
      id: "myositis2017",
      cat: "rheum",
      subcat: "Connective Tissue Diseases",
      name: "2017 EULAR/ACR Idiopathic Inflammatory Myopathy Classification Support",
      desc: "Structured checklist for inflammatory myopathy assessment.",
      fields: [
        YN("weakness", "Symmetric proximal muscle weakness?"),
        YN("neck", "Neck flexor weakness?"),
        YN("rash", "Heliotrope rash or Gottron sign/papules?"),
        YN("dysphagia", "Dysphagia or oesophageal involvement?"),
        YN("enzymes", "Elevated muscle enzymes?"),
        YN("biopsy", "Muscle biopsy supportive of inflammatory myopathy?"),
        YN("antibody", "Myositis-specific antibody included in the official criteria positive?")
      ],
      calc: v => {
        const count = [
          v.weakness,
          v.neck,
          v.rash,
          v.dysphagia,
          v.enzymes,
          v.biopsy,
          v.antibody
        ].filter(x => x === "1").length;

        return {
          value: count + " supportive features selected",
          eq: "This is a checklist, not the validated EULAR/ACR probability score. The official algorithm uses weighted variables, defined clinical measurements, and biopsy-dependent scoring to estimate classification probability."
        };
      }
    },

    // ==================================================
    // 32. Polymyalgia Rheumatica Criteria
    // ==================================================
    {
      id: "pmr2012",
      cat: "rheum",
      subcat: "Connective Tissue Diseases",
      name: "2012 EULAR/ACR Polymyalgia Rheumatica Classification Support",
      desc: "Clinical feature checklist for suspected polymyalgia rheumatica.",
      fields: [
        N("age", "Age (years)", 70, { min: 0, max: 120 }),
        YN("shoulder", "Bilateral shoulder pain?"),
        YN("esrcrp", "Abnormal ESR or CRP?"),
        N("stiffness", "Morning stiffness duration (minutes)", 60, {
          min: 0, max: 1440
        }),
        YN("hip", "Hip pain or limited hip range of motion?"),
        YN("rf", "RF and ACPA both negative?"),
        YN("other", "Absence of peripheral joint pain?"),
        YN("ultrasound", "Shoulder/hip ultrasound features supportive of PMR?")
      ],
      calc: v => {
        if (
          v.age < 50 ||
          v.shoulder !== "1" ||
          v.esrcrp !== "1"
        ) {
          return {
            value: "Entry features not fulfilled",
            eq: "The 2012 EULAR/ACR classification algorithm starts with age ≥50 years, bilateral shoulder pain, and abnormal ESR and/or CRP."
          };
        }

        let score = 0;

        if (v.stiffness >= 45) score += 2;
        if (v.hip === "1") score += 1;
        if (v.rf === "1") score += 2;
        if (v.other === "1") score += 1;

        return {
          value: score + " clinical points",
          eq: "Clinical algorithm: a score ≥4 supports classification; ultrasound adds a separate scoring pathway. This simplified checklist is not the official calculator and does not diagnose PMR."
        };
      }
    },

    // ==================================================
    // 33. Antiphospholipid Syndrome Classification
    // ==================================================
    {
      id: "aps2023",
      cat: "rheum",
      subcat: "Connective Tissue Diseases",
      name: "2023 ACR/EULAR Antiphospholipid Syndrome Classification Support",
      desc: "Structured assessment of clinical and laboratory domains.",
      fields: [
        YN("lab", "At least one qualifying antiphospholipid antibody test?"),
        YN("thrombosis", "Documented macrovascular venous or arterial thrombosis?"),
        YN("obstetric", "Qualifying obstetric manifestation?"),
        YN("microvascular", "Qualifying microvascular manifestation?"),
        YN("valve", "Qualifying cardiac valve manifestation?"),
        YN("hematologic", "Qualifying hematologic manifestation?"),
        YN("persistent", "Persistent qualifying antibody positivity documented?")
      ],
      calc: v => {
        const clinical = [
          v.thrombosis,
          v.obstetric,
          v.microvascular,
          v.valve,
          v.hematologic
        ].some(x => x === "1");

        return {
          value:
            v.lab !== "1"
              ? "Laboratory entry requirement not met"
              : !clinical
                ? "No listed clinical domain selected"
                : v.persistent !== "1"
                  ? "Clinical feature selected; persistence needs verification"
                  : "Qualifying features selected — formal scoring required",
          eq: "The 2023 ACR/EULAR criteria require formal weighted clinical and laboratory domain scoring and minimum thresholds in both. This checklist is not the official APS classification calculator."
        };
      }
    },

    // ==================================================
    // 34. Behçet Disease — ICBD Criteria
    // ==================================================
    {
      id: "behcetICBD",
      cat: "rheum",
      subcat: "Other Rheumatology Tools",
      name: "Behçet Disease — ICBD Criteria",
      desc: "International Criteria for Behçet Disease scoring.",
      fields: [
        YN("oral", "Oral aphthosis (+2)"),
        YN("genital", "Genital aphthosis (+2)"),
        YN("ocular", "Ocular lesions (+2)"),
        YN("skin", "Skin lesions (+1)"),
        YN("vascular", "Vascular manifestations (+1)"),
        YN("neuro", "Neurological manifestations (+1)"),
        YN("pathergy", "Positive pathergy test (+1)")
      ],
      calc: v => {
        const score =
          2 * (v.oral === "1") +
          2 * (v.genital === "1") +
          2 * (v.ocular === "1") +
          (v.skin === "1") +
          (v.vascular === "1") +
          (v.neuro === "1") +
          (v.pathergy === "1");

        return {
          value: score + " points — " +
            (score >= 4
              ? "ICBD classification threshold reached"
              : "ICBD classification threshold not reached"),
          eq: "ICBD threshold ≥4 points. Clinical assessment is essential because similar manifestations occur in other diseases."
        };
      }
    },

    // ==================================================
    // 35. Fibromyalgia WPI/SSS Calculator
    // ==================================================
    {
      id: "fibromyalgia",
      cat: "rheum",
      subcat: "Other Rheumatology Tools",
      name: "Fibromyalgia WPI/SSS Calculator",
      desc: "Widespread Pain Index and Symptom Severity Scale screening support.",
      fields: [
        N("wpi", "Widespread Pain Index (0–19)", 0, {
          min: 0, max: 19, step: 1
        }),
        N("sss", "Symptom Severity Scale (0–12)", 0, {
          min: 0, max: 12, step: 1
        }),
        YN("generalized", "Pain in at least 4 of 5 generalized regions?"),
        YN("duration", "Symptoms generally present for at least 3 months?")
      ],
      calc: v => {
        const meetsScore =
          (v.wpi >= 7 && v.sss >= 5) ||
          (v.wpi >= 4 && v.wpi <= 6 && v.sss >= 9);

        const meets =
          meetsScore &&
          v.generalized === "1" &&
          v.duration === "1";

        return {
          value: "WPI " + v.wpi + "/19; SSS " + v.sss + "/12",
          eq:
            "2016 criteria screening: " +
            (meets
              ? "the entered features meet the numerical screening pattern."
              : "the entered features do not meet the full numerical screening pattern.") +
            " This supports assessment only; it is not a stand-alone diagnosis."
        };
      }
    },

    // ==================================================
    // 36. Osteoarthritis Assessment Tools
    // ==================================================
    {
      id: "osteoarthritis",
      cat: "rheum",
      subcat: "Other Rheumatology Tools",
      name: "Osteoarthritis Assessment Tools",
      desc: "Symptom and functional assessment checklist for osteoarthritis.",
      fields: [
        S("joint", "Joint being assessed", "knee", [
          ["knee", "Knee"],
          ["hip", "Hip"],
          ["hand", "Hand"],
          ["other", "Other joint"]
        ]),
        N("pain", "Pain severity (0–10)", 0, {
          min: 0, max: 10
        }),
        N("stiffness", "Stiffness severity (0–10)", 0, {
          min: 0, max: 10
        }),
        N("function", "Functional limitation (0–10)", 0, {
          min: 0, max: 10
        }),
        YN("impact", "Symptoms limit usual daily activities?")
      ],
      calc: v => {
        const total = v.pain + v.stiffness + v.function;

        return {
          value: total + "/30 descriptive symptom total",
          eq:
            "Joint: " + v.joint +
            ". Pain, stiffness, and functional limitation are recorded separately. " +
            "This is an unvalidated descriptive total, not an official OA severity score. " +
            "Use a validated instrument such as WOMAC or KOOS/HOOS when formal scoring is required."
        };
      }
    },

    // ==================================================
    // 37. Juvenile Idiopathic Arthritis Classification
    // ==================================================
    {
      id: "jiaSupport",
      cat: "rheum",
      subcat: "Other Rheumatology Tools",
      name: "Juvenile Idiopathic Arthritis Classification Support",
      desc: "Structured checklist for childhood-onset inflammatory arthritis.",
      fields: [
        N("age", "Age at onset (years)", 10, {
          min: 0, max: 100
        }),
        N("duration", "Duration of arthritis (weeks)", 6, {
          min: 0, max: 520
        }),
        N("joints", "Number of joints with arthritis", 1, {
          min: 0, max: 100, step: 1
        }),
        YN("systemic", "Systemic features such as fever/rash?"),
        YN("psoriasis", "Psoriasis or qualifying family history?"),
        YN("enthesitis", "Enthesitis or features suggestive of enthesitis-related arthritis?"),
        YN("uveitis", "Uveitis present?"),
        YN("othercause", "Alternative causes such as infection or malignancy adequately evaluated?")
      ],
      calc: v => {
        if (
          v.age >= 16 ||
          v.duration < 6 ||
          v.joints < 1
        ) {
          return {
            value: "JIA entry features not fulfilled",
            eq: "JIA generally requires arthritis beginning before age 16, persisting for at least 6 weeks, with other causes excluded."
          };
        }

        return {
          value: "JIA assessment indicated",
          eq:
            "Onset age: " + v.age +
            " years; duration: " + v.duration +
            " weeks; joints involved: " + v.joints +
            ". Systemic features: " + (v.systemic === "1" ? "yes" : "no") +
            "; psoriasis-related features: " + (v.psoriasis === "1" ? "yes" : "no") +
            "; enthesitis-related features: " + (v.enthesitis === "1" ? "yes" : "no") +
            "; uveitis: " + (v.uveitis === "1" ? "yes" : "no") +
            ". This does not determine a JIA subtype. Exclude other causes and use specialist assessment."
        };
      }
    }

  ];

  window.MedCalcModules.push({
    category,
    guidance,
    tools
  });

})();
