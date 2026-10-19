(function () {
  "use strict";

  const category = {
    id: "rheum",
    name: "Rheumatology",
    icon: "🦴"
    desc: "slicc, EULAR, DAS28, CDAI, MPA, EGVA and etc "
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

  const YN = (id, label, value = "0") =>
    S(id, label, value, [
      { value: "0", label: "No" },
      { value: "1", label: "Yes" }
    ]);

  const clamp = (x, min, max) =>
    Math.max(min, Math.min(max, x));

  const num = (v, id) => {
    const x = Number(v[id]);
    return Number.isFinite(x) ? x : 0;
  };

  const yes = (v, id) => num(v, id) === 1;

  const fmt = (x, digits = 2) =>
    Number(x).toFixed(digits);

  const tools = [

    // =====================================================
    // 1. DAS28-ESR
    // =====================================================

    {
      id: "das28_esr",
      cat: "rheum",
      name: "DAS28-ESR",
      desc: "Disease Activity Score in 28 joints using ESR.",
      fields: [
        N("tjc", "Tender joint count (0–28)", 0,
          { min: 0, max: 28, step: 1 }),
        N("sjc", "Swollen joint count (0–28)", 0,
          { min: 0, max: 28, step: 1 }),
        N("esr", "ESR (mm/hour)", 10,
          { min: 0, max: 200 }),
        N("gh", "Patient global health (0–100 mm)", 0,
          { min: 0, max: 100 })
      ],

      calc: v => {
        const tjc = clamp(num(v, "tjc"), 0, 28);
        const sjc = clamp(num(v, "sjc"), 0, 28);
        const esr = Math.max(num(v, "esr"), 1);
        const gh = clamp(num(v, "gh"), 0, 100);

        const score =
          0.56 * Math.sqrt(tjc) +
          0.28 * Math.sqrt(sjc) +
          0.70 * Math.log(esr) +
          0.014 * gh;

        let activity;

        if (score < 2.6) {
          activity = "Remission range";
        } else if (score <= 3.2) {
          activity = "Low disease activity";
        } else if (score <= 5.1) {
          activity = "Moderate disease activity";
        } else {
          activity = "High disease activity";
        }

        return {
          value: fmt(score),
          eq: "DAS28-ESR = 0.56√TJC28 + 0.28√SJC28 + 0.70 ln(ESR) + 0.014 × patient global",
          interpretation: activity
        };
      }
    },

    // =====================================================
    // 2. DAS28-CRP
    // =====================================================

    {
      id: "das28_crp",
      cat: "rheum",
      name: "DAS28-CRP",
      desc: "Rheumatoid arthritis disease activity using CRP.",
      fields: [
        N("tjc", "Tender joint count (0–28)", 0,
          { min: 0, max: 28, step: 1 }),
        N("sjc", "Swollen joint count (0–28)", 0,
          { min: 0, max: 28, step: 1 }),
        N("crp", "CRP (mg/L)", 5,
          { min: 0, max: 500 }),
        N("gh", "Patient global health (0–100 mm)", 0,
          { min: 0, max: 100 })
      ],

      calc: v => {
        const tjc = clamp(num(v, "tjc"), 0, 28);
        const sjc = clamp(num(v, "sjc"), 0, 28);
        const crp = Math.max(num(v, "crp"), 0);
        const gh = clamp(num(v, "gh"), 0, 100);

        const score =
          0.56 * Math.sqrt(tjc) +
          0.28 * Math.sqrt(sjc) +
          0.36 * Math.log(crp + 1) +
          0.014 * gh +
          0.96;

        return {
          value: fmt(score),
          eq: "DAS28-CRP formula; CRP must be entered in mg/L.",
          interpretation:
            "Use the validated DAS28-CRP thresholds appropriate to the specific formula and clinical protocol. Do not automatically apply ESR-based thresholds."
        };
      }
    },

    // =====================================================
    // 3. CDAI
    // =====================================================

    {
      id: "cdai",
      cat: "rheum",
      name: "CDAI",
      desc: "Clinical Disease Activity Index for rheumatoid arthritis.",
      fields: [
        N("tjc", "Tender joint count (0–28)", 0,
          { min: 0, max: 28, step: 1 }),
        N("sjc", "Swollen joint count (0–28)", 0,
          { min: 0, max: 28, step: 1 }),
        N("patient_global", "Patient global assessment (0–10)", 0,
          { min: 0, max: 10 }),
        N("doctor_global", "Physician global assessment (0–10)", 0,
          { min: 0, max: 10 })
      ],

      calc: v => {
        const score =
          clamp(num(v, "tjc"), 0, 28) +
          clamp(num(v, "sjc"), 0, 28) +
          clamp(num(v, "patient_global"), 0, 10) +
          clamp(num(v, "doctor_global"), 0, 10);

        let activity;

        if (score <= 2.8) {
          activity = "Remission";
        } else if (score <= 10) {
          activity = "Low disease activity";
        } else if (score <= 22) {
          activity = "Moderate disease activity";
        } else {
          activity = "High disease activity";
        }

        return {
          value: fmt(score),
          eq: "CDAI = tender joints + swollen joints + patient global + physician global",
          interpretation: activity
        };
      }
    },

    // =====================================================
    // 4. SDAI
    // =====================================================

    {
      id: "sdai",
      cat: "rheum",
      name: "SDAI",
      desc: "Simplified Disease Activity Index for rheumatoid arthritis.",
      fields: [
        N("tjc", "Tender joint count (0–28)", 0,
          { min: 0, max: 28, step: 1 }),
        N("sjc", "Swollen joint count (0–28)", 0,
          { min: 0, max: 28, step: 1 }),
        N("patient_global", "Patient global assessment (0–10)", 0,
          { min: 0, max: 10 }),
        N("doctor_global", "Physician global assessment (0–10)", 0,
          { min: 0, max: 10 }),
        N("crp", "CRP (mg/dL)", 0.5,
          { min: 0, max: 50 })
      ],

      calc: v => {
        const score =
          clamp(num(v, "tjc"), 0, 28) +
          clamp(num(v, "sjc"), 0, 28) +
          clamp(num(v, "patient_global"), 0, 10) +
          clamp(num(v, "doctor_global"), 0, 10) +
          Math.max(num(v, "crp"), 0);

        let activity;

        if (score <= 3.3) {
          activity = "Remission";
        } else if (score <= 11) {
          activity = "Low disease activity";
        } else if (score <= 26) {
          activity = "Moderate disease activity";
        } else {
          activity = "High disease activity";
        }

        return {
          value: fmt(score),
          eq: "SDAI = TJC28 + SJC28 + patient global + physician global + CRP (mg/dL)",
          interpretation: activity
        };
      }
    },

    // =====================================================
    // 5. 2010 ACR/EULAR RA CLASSIFICATION
    // =====================================================

    {
      id: "ra_criteria",
      cat: "rheum",
      name: "2010 ACR/EULAR RA Classification",
      desc: "Point-based rheumatoid arthritis classification criteria.",
      fields: [
        S("joints", "Joint involvement score", "0", [
          { value: "0", label: "0: 1 large joint" },
          { value: "1", label: "1: 2–10 large joints" },
          { value: "2", label: "2: 1–3 small joints" },
          { value: "3", label: "3: 4–10 small joints" },
          { value: "5", label: "5: More than 10 joints, including a small joint" }
        ]),
        S("serology", "Serology score", "0", [
          { value: "0", label: "0: RF and ACPA negative" },
          { value: "2", label: "2: Low-positive RF or ACPA" },
          { value: "3", label: "3: High-positive RF or ACPA" }
        ]),
        S("duration", "Symptom duration score", "0", [
          { value: "0", label: "0: Less than 6 weeks" },
          { value: "1", label: "1: 6 weeks or longer" }
        ]),
        S("acute_phase", "Acute-phase reactant score", "0", [
          { value: "0", label: "0: Both ESR and CRP normal" },
          { value: "1", label: "1: ESR or CRP abnormal" }
        ]),
        YN("entry_met", "At least one joint with definite clinical synovitis?", "1"),
        YN("better_explanation", "Is another diagnosis better explaining the synovitis?", "0")
      ],

      calc: v => {
        const score =
          num(v, "joints") +
          num(v, "serology") +
          num(v, "duration") +
          num(v, "acute_phase");

        let interpretation;

        if (!yes(v, "entry_met")) {
          interpretation =
            "Entry requirement not met: definite clinical synovitis must be present.";
        } else if (yes(v, "better_explanation")) {
          interpretation =
            "Do not apply the classification score when another diagnosis better explains the synovitis.";
        } else if (score >= 6) {
          interpretation =
            "Meets the numerical threshold for RA classification, subject to the official criteria and clinical assessment.";
        } else {
          interpretation =
            "Below the numerical threshold for RA classification.";
        }

        return {
          value: score + "/10",
          eq: "Joint involvement + serology + symptom duration + acute-phase reactants",
          interpretation
        };
      }
    },

    // =====================================================
    // 6. HAQ-DI
    // =====================================================

    {
      id: "haq_di",
      cat: "rheum",
      name: "HAQ Disability Index",
      desc: "Functional disability assessment commonly used in rheumatoid arthritis.",
      fields: [
        N("dressing", "Dressing and grooming domain (0–3)", 0,
          { min: 0, max: 3 }),
        N("arising", "Arising domain (0–3)", 0,
          { min: 0, max: 3 }),
        N("eating", "Eating domain (0–3)", 0,
          { min: 0, max: 3 }),
        N("walking", "Walking domain (0–3)", 0,
          { min: 0, max: 3 }),
        N("hygiene", "Hygiene domain (0–3)", 0,
          { min: 0, max: 3 }),
        N("reach", "Reach domain (0–3)", 0,
          { min: 0, max: 3 }),
        N("grip", "Grip domain (0–3)", 0,
          { min: 0, max: 3 }),
        N("activities", "Other activities domain (0–3)", 0,
          { min: 0, max: 3 })
      ],

      calc: v => {
        const ids = [
          "dressing", "arising", "eating", "walking",
          "hygiene", "reach", "grip", "activities"
        ];

        const score =
          ids.reduce((sum, id) =>
            sum + clamp(num(v, id), 0, 3), 0
          ) / ids.length;

        return {
          value: fmt(score),
          eq: "Simplified mean of 8 domain scores; the full HAQ-DI also requires its official scoring and aids/devices rules.",
          interpretation:
            "Range 0–3. Higher scores indicate greater functional disability. This simplified result is not a substitute for the validated HAQ-DI worksheet."
        };
      }
    },

    // =====================================================
    // 7. SLEDAI-2K
    // =====================================================

    {
      id: "sledai2k",
      cat: "rheum",
      name: "SLEDAI-2K",
      desc: "Systemic Lupus Erythematosus Disease Activity Index 2000.",
      fields: [
        N("score", "Total SLEDAI-2K score from official worksheet", 0,
          { min: 0, max: 105, step: 1 })
      ],

      calc: v => {
        const score = Math.max(num(v, "score"), 0);

        let interpretation;

        if (score === 0) {
          interpretation = "No activity captured by the score.";
        } else if (score <= 5) {
          interpretation = "Low numerical activity range.";
        } else if (score <= 10) {
          interpretation = "Moderate numerical activity range.";
        } else {
          interpretation = "Higher numerical activity range.";
        }

        return {
          value: fmt(score, 0),
          eq: "Enter the total calculated using the official SLEDAI-2K descriptor worksheet.",
          interpretation:
            interpretation +
            " These descriptive bands are approximate; use the validated worksheet and clinical context."
        };
      }
    },

    // =====================================================
    // 8. 2019 EULAR/ACR SLE CLASSIFICATION
    // =====================================================

    {
      id: "sle_criteria",
      cat: "rheum",
      name: "2019 EULAR/ACR SLE Classification",
      desc: "Weighted classification criteria for systemic lupus erythematosus.",
      fields: [
        YN("ana", "ANA positive at least once at titre ≥1:80?", "1"),
        N("score", "Total weighted points from official criteria worksheet", 0,
          { min: 0, max: 100 }),
        YN("clinical", "At least one clinical criterion present?", "0")
      ],

      calc: v => {
        const score = Math.max(num(v, "score"), 0);

        let interpretation;

        if (!yes(v, "ana")) {
          interpretation =
            "Entry criterion not met: a positive ANA at least once is required.";
        } else if (!yes(v, "clinical")) {
          interpretation =
            "A clinical criterion is required for classification.";
        } else if (score >= 10) {
          interpretation =
            "Meets the numerical classification threshold if official attribution and domain rules are satisfied.";
        } else {
          interpretation =
            "Below the numerical classification threshold.";
        }

        return {
          value: fmt(score, 0) + " points",
          eq: "Use the official weighted criteria worksheet; only the highest-scoring item in each domain counts.",
          interpretation
        };
      }
    },

    // =====================================================
    // 9. SLICC/ACR DAMAGE INDEX
    // =====================================================

    {
      id: "slicc_damage",
      cat: "rheum",
      name: "SLICC/ACR Damage Index",
      desc: "Assesses accumulated organ damage in systemic lupus erythematosus.",
      fields: [
        N("damage", "Official SLICC/ACR Damage Index total", 0,
          { min: 0, max: 47, step: 1 })
      ],

      calc: v => {
        const score = Math.max(num(v, "damage"), 0);

        return {
          value: fmt(score, 0),
          eq: "Enter the total from the official SLICC/ACR Damage Index worksheet.",
          interpretation:
            "Higher scores indicate greater accumulated damage. This is a damage index, not a measure of current lupus activity. Do not calculate it by simply counting affected organ systems."
        };
      }
    },

    // =====================================================
    // 10. LUPUS LOW DISEASE ACTIVITY STATE
    // =====================================================

    {
      id: "lldas",
      cat: "rheum",
      name: "Lupus Low Disease Activity State",
      desc: "Checklist support for LLDAS assessment.",
      fields: [
        YN("seldai", "SLEDAI-2K ≤4?", "1"),
        YN("major", "No major organ activity?", "1"),
        YN("new", "No new disease activity compared with previous assessment?", "1"),
        N("pga", "Physician global assessment (0–3)", 0,
          { min: 0, max: 3 }),
        N("pred", "Prednisolone-equivalent dose (mg/day)", 5,
          { min: 0, max: 200 }),
        YN("standard", "Standard maintenance immunosuppressants/approved biologics only?", "1")
      ],

      calc: v => {
        const conditions = [
          yes(v, "seldai"),
          yes(v, "major"),
          yes(v, "new"),
          num(v, "pga") <= 1,
          num(v, "pred") <= 7.5,
          yes(v, "standard")
        ];

        const met = conditions.filter(Boolean).length;

        return {
          value: met + "/6 checklist items met",
          eq: "LLDAS requires all relevant formal criteria to be satisfied.",
          interpretation:
            met === 6
              ? "All entered checklist items are met. Confirm the full formal LLDAS definition before classifying the patient as being in LLDAS."
              : "One or more checklist items are not met. This simplified checklist does not replace the complete formal LLDAS definition."
        };
      }
    },

    // =====================================================
    // 11. BVAS
    // =====================================================

    {
      id: "bvas",
      cat: "rheum",
      name: "BVAS",
      desc: "Birmingham Vasculitis Activity Score.",
      fields: [
        N("score", "Total BVAS from official worksheet", 0,
          { min: 0, max: 63, step: 1 })
      ],

      calc: v => {
        const score = Math.max(num(v, "score"), 0);

        return {
          value: fmt(score, 0),
          eq: "Use the official BVAS version and scoring worksheet.",
          interpretation:
            score === 0
              ? "No active vasculitis features captured by the entered BVAS."
              : "A score above zero indicates active features have been scored. Higher scores generally indicate greater scored activity; interpretation depends on the BVAS version and clinical context."
        };
      }
    },

    // =====================================================
    // 12. GPA CLASSIFICATION
    // =====================================================

    {
      id: "gpa_criteria",
      cat: "rheum",
      name: "2022 GPA Classification Criteria",
      desc: "Weighted criteria support for granulomatosis with polyangiitis.",
      fields: [
        N("score", "Total weighted points from official GPA worksheet", 0,
          { min: -10, max: 20 }),
        YN("entry", "Clinical presentation compatible with small/medium-vessel vasculitis?", "1"),
        YN("exclude", "A better alternative diagnosis is present?", "0")
      ],

      calc: v => {
        const score = num(v, "score");

        let interpretation;

        if (!yes(v, "entry")) {
          interpretation = "The required clinical context for applying classification criteria is absent.";
        } else if (yes(v, "exclude")) {
          interpretation = "Consider the alternative diagnosis before applying classification criteria.";
        } else if (score >= 5) {
          interpretation = "Meets the 2022 ACR/EULAR GPA numerical classification threshold, provided the official criteria and exclusions are satisfied.";
        } else {
          interpretation = "Below the GPA numerical classification threshold.";
        }

        return {
          value: fmt(score, 0) + " points",
          eq: "Enter the weighted total from the official 2022 ACR/EULAR GPA criteria worksheet.",
          interpretation
        };
      }
    },

    // =====================================================
    // 13. MPA CLASSIFICATION
    // =====================================================

    {
      id: "mpa_criteria",
      cat: "rheum",
      name: "2022 MPA Classification Criteria",
      desc: "Weighted criteria support for microscopic polyangiitis.",
      fields: [
        N("score", "Total weighted points from official MPA worksheet", 0,
          { min: -10, max: 20 }),
        YN("entry", "Clinical presentation compatible with vasculitis?", "1"),
        YN("exclude", "A better alternative diagnosis is present?", "0")
      ],

      calc: v => {
        const score = num(v, "score");

        let interpretation;

        if (!yes(v, "entry")) {
          interpretation = "The required clinical context for applying classification criteria is absent.";
        } else if (yes(v, "exclude")) {
          interpretation = "Consider the alternative diagnosis before applying classification criteria.";
        } else if (score >= 5) {
          interpretation = "Meets the 2022 ACR/EULAR MPA numerical classification threshold, provided the official criteria and exclusions are satisfied.";
        } else {
          interpretation = "Below the MPA numerical classification threshold.";
        }

        return {
          value: fmt(score, 0) + " points",
          eq: "Enter the weighted total from the official 2022 ACR/EULAR MPA criteria worksheet.",
          interpretation
        };
      }
    },

    // =====================================================
    // 14. EGPA CLASSIFICATION
    // =====================================================

    {
      id: "egpa_criteria",
      cat: "rheum",
      name: "2022 EGPA Classification Criteria",
      desc: "Weighted criteria support for eosinophilic granulomatosis with polyangiitis.",
      fields: [
        N("score", "Total weighted points from official EGPA worksheet", 0,
          { min: -10, max: 20 }),
        YN("entry", "Clinical presentation compatible with vasculitis?", "1"),
        YN("exclude", "A better alternative diagnosis is present?", "0")
      ],

      calc: v => {
        const score = num(v, "score");

        let interpretation;

        if (!yes(v, "entry")) {
          interpretation = "The required clinical context for applying classification criteria is absent.";
        } else if (yes(v, "exclude")) {
          interpretation = "Consider the alternative diagnosis before applying classification criteria.";
        } else if (score >= 6) {
          interpretation = "Meets the 2022 ACR/EULAR EGPA numerical classification threshold, provided the official criteria and exclusions are satisfied.";
        } else {
          interpretation = "Below the EGPA numerical classification threshold.";
        }

        return {
          value: fmt(score, 0) + " points",
          eq: "Enter the weighted total from the official 2022 ACR/EULAR EGPA criteria worksheet.",
          interpretation
        };
      }
    },

    // =====================================================
    // 15. GCA CLASSIFICATION
    // =====================================================

    {
      id: "gca_criteria",
      cat: "rheum",
      name: "2022 GCA Classification Criteria",
      desc: "Weighted criteria support for giant cell arteritis.",
      fields: [
        N("score", "Total weighted points from official GCA worksheet", 0,
          { min: -10, max: 20 }),
        YN("entry", "Age at diagnosis ≥50 years?", "1"),
        YN("exclude", "A better alternative diagnosis is present?", "0")
      ],

      calc: v => {
        const score = num(v, "score");

        let interpretation;

        if (!yes(v, "entry")) {
          interpretation = "Age entry criterion not met.";
        } else if (yes(v, "exclude")) {
          interpretation = "Consider the alternative diagnosis before applying classification criteria.";
        } else if (score >= 6) {
          interpretation = "Meets the 2022 ACR/EULAR GCA numerical classification threshold, provided the official criteria and exclusions are satisfied.";
        } else {
          interpretation = "Below the GCA numerical classification threshold.";
        }

        return {
          value: fmt(score, 0) + " points",
          eq: "Enter the weighted total from the official 2022 ACR/EULAR GCA criteria worksheet.",
          interpretation
        };
      }
    },

    // =====================================================
    // 16. TAKAYASU ARTERITIS CLASSIFICATION
    // =====================================================

    {
      id: "takayasu_criteria",
      cat: "rheum",
      name: "2022 Takayasu Arteritis Classification",
      desc: "Weighted criteria support for Takayasu arteritis.",
      fields: [
        N("score", "Total weighted points from official Takayasu worksheet", 0,
          { min: -10, max: 20 }),
        YN("entry", "Age at diagnosis ≤60 years?", "1"),
        YN("imaging", "Imaging evidence of large-vessel vasculitis?", "1"),
        YN("exclude", "A better alternative diagnosis is present?", "0")
      ],

      calc: v => {
        const score = num(v, "score");

        let interpretation;

        if (!yes(v, "entry") || !yes(v, "imaging")) {
          interpretation = "The age or imaging entry requirement is not met.";
        } else if (yes(v, "exclude")) {
          interpretation = "Consider the alternative diagnosis before applying classification criteria.";
        } else if (score >= 5) {
          interpretation = "Meets the 2022 ACR/EULAR Takayasu arteritis numerical classification threshold, provided the official criteria and exclusions are satisfied.";
        } else {
          interpretation = "Below the Takayasu arteritis numerical classification threshold.";
        }

        return {
          value: fmt(score, 0) + " points",
          eq: "Enter the weighted total from the official 2022 ACR/EULAR Takayasu arteritis criteria worksheet.",
          interpretation
        };
      }
    },

    // =====================================================
    // 17. BASDAI
    // =====================================================

    {
      id: "basdai",
      cat: "rheum",
      name: "BASDAI",
      desc: "Bath Ankylosing Spondylitis Disease Activity Index.",
      fields: [
        N("fatigue", "Fatigue (0–10)", 0, { min: 0, max: 10 }),
        N("pain", "Spinal pain (0–10)", 0, { min: 0, max: 10 }),
        N("joints", "Joint pain/swelling (0–10)", 0, { min: 0, max: 10 }),
        N("enthesitis", "Enthesitis-related tenderness (0–10)", 0,
          { min: 0, max: 10 }),
        N("morning_severity", "Morning stiffness severity (0–10)", 0,
          { min: 0, max: 10 }),
        N("morning_duration", "Morning stiffness duration (0–10)", 0,
          { min: 0, max: 10 })
      ],

      calc: v => {
        const fatigue = clamp(num(v, "fatigue"), 0, 10);
        const pain = clamp(num(v, "pain"), 0, 10);
        const joints = clamp(num(v, "joints"), 0, 10);
        const enthesitis = clamp(num(v, "enthesitis"), 0, 10);
        const severity = clamp(num(v, "morning_severity"), 0, 10);
        const duration = clamp(num(v, "morning_duration"), 0, 10);

        const score =
          (
            fatigue +
            pain +
            joints +
            enthesitis +
            (severity + duration) / 2
          ) / 5;

        return {
          value: fmt(score),
          eq: "BASDAI = [Q1 + Q2 + Q3 + Q4 + (Q5 + Q6)/2] / 5",
          interpretation:
            score >= 4
              ? "BASDAI ≥4 is commonly used to indicate high disease activity."
              : "BASDAI <4 is below the commonly used high-activity threshold. Interpret alongside symptoms and clinical findings."
        };
      }
    },

    // =====================================================
    // 18. ASDAS-CRP
    // =====================================================

    {
      id: "asdas_crp",
      cat: "rheum",
      name: "ASDAS-CRP",
      desc: "Ankylosing Spondylitis Disease Activity Score using CRP.",
      fields: [
        N("backpain", "Back pain (0–10)", 0, { min: 0, max: 10 }),
        N("duration", "Morning stiffness duration (0–10)", 0,
          { min: 0, max: 10 }),
        N("global", "Patient global assessment (0–10)", 0,
          { min: 0, max: 10 }),
        N("peripheral", "Peripheral pain/swelling (0–10)", 0,
          { min: 0, max: 10 }),
        N("crp", "CRP (mg/L)", 5, { min: 0, max: 500 })
      ],

      calc: v => {
        const backpain = clamp(num(v, "backpain"), 0, 10);
        const duration = clamp(num(v, "duration"), 0, 10);
        const global = clamp(num(v, "global"), 0, 10);
        const peripheral = clamp(num(v, "peripheral"), 0, 10);
        const crp = Math.max(num(v, "crp"), 0);

        const score =
          0.121 * backpain +
          0.058 * duration +
          0.110 * global +
          0.073 * peripheral +
          0.579 * Math.log(crp + 1);

        let activity;

        if (score < 1.3) {
          activity = "Inactive disease";
        } else if (score < 2.1) {
          activity = "Low disease activity";
        } else if (score <= 3.5) {
          activity = "High disease activity";
        } else {
          activity = "Very high disease activity";
        }

        return {
          value: fmt(score),
          eq: "ASDAS-CRP formula; CRP entered in mg/L.",
          interpretation: activity
        };
      }
    },

    // =====================================================
    // 19. ASDAS-ESR
    // =====================================================

    {
      id: "asdas_esr",
      cat: "rheum",
      name: "ASDAS-ESR",
      desc: "Ankylosing Spondylitis Disease Activity Score using ESR.",
      fields: [
        N("backpain", "Back pain (0–10)", 0, { min: 0, max: 10 }),
        N("duration", "Morning stiffness duration (0–10)", 0,
          { min: 0, max: 10 }),
        N("global", "Patient global assessment (0–10)", 0,
          { min: 0, max: 10 }),
        N("peripheral", "Peripheral pain/swelling (0–10)", 0,
          { min: 0, max: 10 }),
        N("esr", "ESR (mm/hour)", 10, { min: 0, max: 200 })
      ],

      calc: v => {
        const backpain = clamp(num(v, "backpain"), 0, 10);
        const duration = clamp(num(v, "duration"), 0, 10);
        const global = clamp(num(v, "global"), 0, 10);
        const peripheral = clamp(num(v, "peripheral"), 0, 10);
        const esr = Math.max(num(v, "esr"), 0);

        const score =
          0.079 * backpain +
          0.069 * duration +
          0.113 * global +
          0.086 * peripheral +
          0.293 * Math.sqrt(esr);

        let activity;

        if (score < 1.3) {
          activity = "Inactive disease";
        } else if (score < 2.1) {
          activity = "Low disease activity";
        } else if (score <= 3.5) {
          activity = "High disease activity";
        } else {
          activity = "Very high disease activity";
        }

        return {
          value: fmt(score),
          eq: "ASDAS-ESR formula; ESR entered in mm/hour.",
          interpretation:
            activity +
            ". Verify the formula and input definitions against the validated ASDAS-ESR calculator used in your clinical setting."
        };
      }
    },

    // =====================================================
    // 20. BASFI
    // =====================================================

    {
      id: "basfi",
      cat: "rheum",
      name: "BASFI",
      desc: "Bath Ankylosing Spondylitis Functional Index.",
      fields: [
        N("q1", "Question 1 (0–10)", 0, { min: 0, max: 10 }),
        N("q2", "Question 2 (0–10)", 0, { min: 0, max: 10 }),
        N("q3", "Question 3 (0–10)", 0, { min: 0, max: 10 }),
        N("q4", "Question 4 (0–10)", 0, { min: 0, max: 10 }),
        N("q5", "Question 5 (0–10)", 0, { min: 0, max: 10 }),
        N("q6", "Question 6 (0–10)", 0, { min: 0, max: 10 }),
        N("q7", "Question 7 (0–10)", 0, { min: 0, max: 10 }),
        N("q8", "Question 8 (0–10)", 0, { min: 0, max: 10 }),
        N("q9", "Question 9 (0–10)", 0, { min: 0, max: 10 }),
        N("q10", "Question 10 (0–10)", 0, { min: 0, max: 10 })
      ],

      calc: v => {
        const ids = [
          "q1", "q2", "q3", "q4", "q5",
          "q6", "q7", "q8", "q9", "q10"
        ];

        const score = ids.reduce(
          (sum, id) => sum + clamp(num(v, id), 0, 10),
          0
        ) / 10;

        return {
          value: fmt(score),
          eq: "BASFI = sum of 10 item scores / 10",
          interpretation:
            "Range 0–10. Higher scores indicate greater functional limitation. There is no single universal BASFI cutoff that determines treatment for every patient."
        };
      }
    },

    // =====================================================
    // 21. BASMI
    // =====================================================

    {
      id: "basmi",
      cat: "rheum",
      name: "BASMI",
      desc: "Bath Ankylosing Spondylitis Metrology Index.",
      fields: [
        N("cervical", "Cervical rotation (degrees)", 0,
          { min: 0, max: 180 }),
        N("tragus", "Tragus-to-wall distance (cm)", 0,
          { min: 0, max: 50 }),
        N("lumbar", "Lumbar side flexion (cm)", 0,
          { min: 0, max: 50 }),
        N("modified_schober", "Modified Schober measurement (cm)", 0,
          { min: 0, max: 30 }),
        N("intermalleolar", "Intermalleolar distance (cm)", 0,
          { min: 0, max: 200 })
      ],

      calc: v => {
        const values = [
          num(v, "cervical"),
          num(v, "tragus"),
          num(v, "lumbar"),
          num(v, "modified_schober"),
          num(v, "intermalleolar")
        ];

        return {
          value: "Measurements entered",
          eq: "The official BASMI requires measurement-specific transformations and scoring.",
          interpretation:
            "This tool records the five BASMI-related measurements but does not calculate the validated BASMI score. Use the official BASMI scoring method; do not interpret a simple average of these differently scaled measurements as BASMI."
        };
      }
    },

    // =====================================================
    // 22. ASAS AXIAL SPONDYLOARTHRITIS CLASSIFICATION
    // =====================================================

    {
      id: "asas_axspa",
      cat: "rheum",
      name: "ASAS Axial SpA Classification",
      desc: "Classification support for axial spondyloarthritis.",
      fields: [
        YN("entry", "Back pain for ≥3 months with onset before age 45?", "1"),
        YN("imaging", "Sacroiliitis on imaging according to ASAS definition?", "0"),
        YN("hla", "HLA-B27 positive?", "0"),
        N("features", "Number of additional SpA features present", 0,
          { min: 0, max: 10, step: 1 })
      ],

      calc: v => {
        const entry = yes(v, "entry");
        const imaging = yes(v, "imaging");
        const hla = yes(v, "hla");
        const features = Math.max(num(v, "features"), 0);

        const imagingArm = imaging && features >= 1;
        const clinicalArm = hla && features >= 2;

        let interpretation;

        if (!entry) {
          interpretation =
            "Entry criteria not met: chronic back pain with onset before age 45 is required.";
        } else if (imagingArm || clinicalArm) {
          interpretation =
            "ASAS axial SpA classification pathway met. This is a classification result, not a stand-alone diagnosis.";
        } else {
          interpretation =
            "ASAS axial SpA classification pathways are not met using the entered information.";
        }

        return {
          value: imagingArm || clinicalArm
            ? "Classification pathway met"
            : "Classification pathway not met",
          eq: "Imaging arm: sacroiliitis on imaging + ≥1 SpA feature. Clinical arm: HLA-B27 + ≥2 SpA features.",
          interpretation
        };
      }
    }

  ];

  // =====================================================
  // GUIDANCE FOR EACH CALCULATOR
  // Each entry: [interpretation, whyUsed]
  // =====================================================

  const guidance = {

    das28_esr: [
      "Common DAS28-ESR categories are remission <2.6, low activity 2.6–3.2, moderate activity >3.2–5.1, and high activity >5.1. Clinical assessment remains necessary.",
      "Used to quantify rheumatoid arthritis activity and monitor response to treatment over time."
    ],

    das28_crp: [
      "Interpret using thresholds validated for the exact DAS28-CRP formula. ESR-based thresholds should not automatically be applied to CRP-based scores.",
      "Used to assess rheumatoid arthritis activity when CRP is used as the acute-phase reactant."
    ],

    cdai: [
      "CDAI ≤2.8 indicates remission; >2.8–10 low activity; >10–22 moderate activity; >22 high activity.",
      "Used to assess rheumatoid arthritis activity without requiring an ESR or CRP result."
    ],

    sdai: [
      "SDAI ≤3.3 indicates remission; >3.3–11 low activity; >11–26 moderate activity; >26 high activity. Enter CRP in mg/dL.",
      "Used to quantify rheumatoid arthritis activity using joint counts, global assessments, and CRP."
    ],

    ra_criteria: [
      "A score of at least 6/10 may classify RA when the entry requirements and exclusions are satisfied. Classification criteria do not replace clinical diagnosis.",
      "Used to standardize classification of rheumatoid arthritis in appropriate patients with clinical synovitis."
    ],

    haq_di: [
      "The HAQ-DI ranges from 0 to 3, with higher scores indicating greater disability. This module uses a simplified domain average and does not implement all official scoring rules.",
      "Used to measure functional limitations in daily activities, particularly in rheumatoid arthritis."
    ],

    sledai2k: [
      "A higher SLEDAI-2K score generally indicates more disease activity. A score of zero means no activity was captured by the entered official score; the index does not capture every clinical concern.",
      "Used to quantify systemic lupus erythematosus activity and help monitor changes over time."
    ],

    sle_criteria: [
      "The 2019 EULAR/ACR classification system requires ANA positivity as an entry criterion and at least 10 weighted points, including an eligible clinical criterion, with attribution rules satisfied.",
      "Used to classify SLE consistently for research and clinical classification. It is not a stand-alone diagnostic test."
    ],

    slicc_damage: [
      "Higher SLICC/ACR Damage Index scores indicate greater accumulated organ damage. Damage is distinct from current inflammatory disease activity.",
      "Used to document and follow irreversible or persistent damage associated with lupus or its treatment."
    ],

    lldas: [
      "All relevant formal LLDAS requirements must be met. The checklist in this module is simplified and does not independently establish LLDAS.",
      "Used to assess whether lupus activity is sufficiently controlled to meet a low-disease-activity target."
    ],

    bvas: [
      "A higher BVAS generally reflects more active vasculitis features. Interpretation depends on the version used and the clinical context.",
      "Used to systematically record and monitor active manifestations of systemic vasculitis."
    ],

    gpa_criteria: [
      "The 2022 ACR/EULAR GPA classification threshold is ≥5 points, applied only after the required clinical context and exclusions are considered. Enter the score from the official worksheet.",
      "Used to classify granulomatosis with polyangiitis in appropriate patients with vasculitis; it does not independently diagnose GPA."
    ],

    mpa_criteria: [
      "The 2022 ACR/EULAR MPA classification threshold is ≥5 points, subject to the official entry context and exclusions. Enter the score from the official worksheet.",
      "Used to classify microscopic polyangiitis in appropriate patients with vasculitis."
    ],

    egpa_criteria: [
      "The 2022 ACR/EULAR EGPA classification threshold is ≥6 points, subject to the official entry context and exclusions. Enter the score from the official worksheet.",
      "Used to classify eosinophilic granulomatosis with polyangiitis in appropriate patients with vasculitis."
    ],

    gca_criteria: [
      "The 2022 ACR/EULAR GCA classification threshold is ≥6 points, with the age entry requirement and official criteria satisfied.",
      "Used to classify giant cell arteritis in the appropriate clinical setting, especially for research and standardized classification."
    ],

    takayasu_criteria: [
      "The 2022 ACR/EULAR Takayasu arteritis classification threshold is ≥5 points, with the official age and imaging entry requirements satisfied.",
      "Used to classify Takayasu arteritis in patients with appropriate large-vessel imaging and clinical findings."
    ],

    basdai: [
      "BASDAI ranges from 0 to 10. A score ≥4 is commonly used to indicate high disease activity, but treatment decisions require broader clinical assessment.",
      "Used to measure patient-reported disease activity in ankylosing spondylitis and axial spondyloarthritis."
    ],

    asdas_crp: [
      "Common ASDAS activity categories are <1.3 inactive, 1.3–<2.1 low, 2.1–3.5 high, and >3.5 very high activity. Confirm that the implementation and units match a validated ASDAS-CRP calculator.",
      "Used to assess axial spondyloarthritis activity using patient-reported symptoms and CRP."
    ],

    asdas_esr: [
      "Common ASDAS activity categories are <1.3 inactive, 1.3–<2.1 low, 2.1–3.5 high, and >3.5 very high activity. Verify the equation and input definitions against a validated ASDAS-ESR calculator.",
      "Used to assess axial spondyloarthritis activity when ESR is used instead of CRP."
    ],

    basfi: [
      "BASFI ranges from 0 to 10. Higher scores indicate greater functional limitation; there is no single universal cutoff that determines treatment for every patient.",
      "Used to measure the effect of ankylosing spondylitis or axial spondyloarthritis on physical functioning."
    ],

    basmi: [
      "This module records five relevant measurements but does not calculate the official BASMI score. The validated BASMI method uses measurement-specific transformations or scoring.",
      "Used to assess spinal mobility and physical limitation in ankylosing spondylitis and axial spondyloarthritis."
    ],

    asas_axspa: [
      "The imaging arm requires sacroiliitis on imaging plus at least one SpA feature. The clinical arm requires HLA-B27 positivity plus at least two SpA features. Entry criteria and the official definitions must be satisfied.",
      "Used to classify axial spondyloarthritis in patients with chronic back pain beginning before age 45. Classification does not equal diagnosis."
    ]

  };

  // =====================================================
  // REGISTER MODULE
  // =====================================================

  window.MedCalcModules = window.MedCalcModules || [];

  window.MedCalcModules.push({
    category,
    guidance,
    tools
  });

})();
