// solid_organ_oncology.js
(function () {
  window.MedCalcModules = window.MedCalcModules || [];

  const category = {
    id: "solid_organ_oncology",
    name: "Solid Organ Oncology & TNM Staging",
    icon: "🔬",
    desc: "Comprehensive AJCC 8th Edition TNM staging and risk stratification for solid organ systems (excluding Ob/Gyn and Hematology)"
  };

  const guidance = {
    organTnmGeneral: [
      "AJCC 8th Edition TNM Staging defines primary tumor extent (T), regional lymph node involvement (N), and distant metastasis (M) for solid organ malignancies.",
      "Guides surgical planning, adjuvant or neoadjuvant therapy selection, and prognostic counseling."
    ]
  };

  const tools = [
    // ==========================================
    // A. ESOPHAGEAL CANCER (TNM)
    // ==========================================
    {
      id: "esophagealTnm",
      cat: "solid_organ_oncology",
      subcat: "Upper Gastrointestinal Staging",
      name: "Esophageal and Esophagogastric Junction Cancer TNM Staging",
      desc: "AJCC 8th Edition staging for esophageal carcinoma (squamous cell carcinoma and adenocarcinoma).",
      fields: [
        S("histology", "Histological Subtype", "adenocarcinoma", [
          ["adenocarcinoma", "Adenocarcinoma"],
          ["squamous", "Squamous Cell Carcinoma"]
        ]),
        S("t_stage", "Primary Tumor (T)", "T2", [
          ["Tis", "Tis: High-grade dysplasia / carcinoma in situ"],
          ["T1a", "T1a: Tumor invades lamina propria or muscularis mucosae"],
          ["T1b", "T1b: Tumor invades submucosa"],
          ["T2", "T2: Tumor invades muscularis propria"],
          ["T3", "T3: Tumor invades adventitia"],
          ["T4a", "T4a: Resectable tumor invading pleura, pericardium, or diaphragm"],
          ["T4b", "T4b: Unresectable tumor invading adjacent structures (aorta, vertebral body, trachea)"]
        ]),
        S("n_stage", "Regional Lymph Nodes (N)", "N1", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1", "N1: Metastasis in 1–2 regional lymph nodes"],
          ["N2", "N2: Metastasis in 3–6 regional lymph nodes"],
          ["N3", "N3: Metastasis in 7 or more regional lymph nodes"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1", "M1: Distant metastasis present"]
        ])
      ],
      calc: v => {
        const t = v.t_stage, n = v.n_stage, m = v.m_stage, hist = v.histology;
        let stage = "Stage II";
        let guidanceText = "Localized esophageal cancer is typically managed with multimodality therapy including neoadjuvant chemoradiotherapy followed by surgical esophagectomy, or definitive chemoradiotherapy for unresectable/cervical tumors.";

        if (m === "M1") {
          stage = "Stage IV";
          guidanceText = "Metastatic esophageal cancer. Systemic therapy (chemotherapy and/or immunotherapy like pembrolizumab based on PD-L1/HER2 status) with palliative measures.";
        } else if (t === "T4b" || n === "N3") {
          stage = "Stage IVA / IVB";
          guidanceText = "Locally advanced or unresectable disease. Multidisciplinary evaluation for definitive chemoradiotherapy or palliative care.";
        }

        return {
          value: "Stage Classification: " + stage + " (" + hist + ", T: " + t + ", N: " + n + ", M: " + m + ")",
          eq: "AJCC 8th Edition Esophageal Staging.",
          guidance: guidanceText,
          references: "Rice TW, Patil DT, Blackstone EH. 8th Edition AJCC/UICC Staging of Esophageal Cancer: The New Staging System. Ann Cardiothorac Surg. 2017;6(2):119-130."
        };
      },
      isClassification: true
    },

    // ==========================================
    // B. GASTRIC (STOMACH) CANCER (TNM)
    // ==========================================
    {
      id: "gastricTnm",
      cat: "solid_organ_oncology",
      subcat: "Upper Gastrointestinal Staging",
      name: "Gastric (Stomach) Cancer TNM Staging",
      desc: "AJCC 8th Edition staging for gastric adenocarcinoma.",
      fields: [
        S("t_stage", "Primary Tumor (T)", "T2", [
          ["Tis", "Tis: Carcinoma in situ; intraepithelial tumor without invasion of lamina propria"],
          ["T1a", "T1a: Tumor invades lamina propria or muscularis mucosae"],
          ["T1b", "T1b: Tumor invades submucosa"],
          ["T2", "T2: Tumor invades muscularis propria"],
          ["T3", "T3: Tumor invades subserosal connective tissue without visceral peritoneum invasion"],
          ["T4a", "T4a: Tumor penetrates serosa (visceral peritoneum)"],
          ["T4b", "T4b: Tumor invades adjacent structures"]
        ]),
        S("n_stage", "Regional Lymph Nodes (N)", "N1", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1", "N1: Metastasis in 1–2 regional lymph nodes"],
          ["N2", "N2: Metastasis in 3–6 regional lymph nodes"],
          ["N3a", "N3a: Metastasis in 7–15 regional lymph nodes"],
          ["N3b", "N3b: Metastasis in 16 or more regional lymph nodes"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1", "M1: Distant metastasis present"]
        ])
      ],
      calc: v => {
        const t = v.t_stage, n = v.n_stage, m = v.m_stage;
        let stage = "Stage II";
        let guidanceText = "Surgical resection with D2 lymphadenectomy is primary for localized gastric cancer. Perioperative or adjuvant systemic chemotherapy is standard for resectable stage IB or higher.";

        if (m === "M1") {
          stage = "Stage IV";
          guidanceText = "Metastatic gastric cancer. Systemic therapy (chemotherapy combined with trastuzumab if HER2-positive, or immunotherapy/nivolumab for PD-L1 positive) and palliation.";
        } else if (n === "N3a" || n === "N3b" || t === "T4b") {
          stage = "Stage IIIB / IIIC";
          guidanceText = "Advanced locoregional disease. Perioperative chemotherapy and multimodality evaluation recommended.";
        }

        return {
          value: "Stage Classification: " + stage + " (T: " + t + ", N: " + n + ", M: " + m + ")",
          eq: "AJCC 8th Edition Gastric Cancer Staging.",
          guidance: guidanceText,
          references: "AJCC Cancer Staging Manual. 8th ed. New York: Springer; 2017."
        };
      },
      isClassification: true
    },

    // ==========================================
    // C. HEPATOCELLULAR CARCINOMA (LIVER TNM)
    // ==========================================
    {
      id: "liverTnm",
      cat: "solid_organ_oncology",
      subcat: "Hepatobiliary Staging",
      name: "Hepatocellular Carcinoma (HCC) TNM Staging",
      desc: "AJCC 8th Edition staging for primary hepatocellular carcinoma.",
      fields: [
        S("t_stage", "Primary Tumor (T)", "T2", [
          ["T1a", "T1a: Solitary tumor ≤ 2 cm, with or without vascular invasion"],
          ["T1b", "T1b: Solitary tumor > 2 cm, without vascular invasion"],
          ["T2", "T2: Solitary tumor > 2 cm, with vascular invasion, or multiple tumors none > 5 cm"],
          ["T3", "T3: Multiple tumors > 5 cm, or tumor involving a major branch of portal/hepatic vein"],
          ["T4", "T4: Tumor(s) with direct invasion of adjacent organs (other than gallbladder) or perforation of visceral peritoneum"]
        ]),
        S("n_stage", "Regional Lymph Nodes (N)", "N0", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1", "N1: Regional lymph node metastasis"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1", "M1: Distant metastasis present"]
        ])
      ],
      calc: v => {
        const t = v.t_stage, n = v.n_stage, m = v.m_stage;
        let stage = "Stage I / II";
        let guidanceText = "Management depends heavily on underlying liver function (Child-Pugh class). Curative options include surgical resection, liver transplantation, or radiofrequency ablation for early-stage disease.";

        if (m === "M1") {
          stage = "Stage IV";
          guidanceText = "Advanced/metastatic HCC. Systemic therapy options include immunotherapy combinations (atezolizumab + bevacizumab or durvalumab + tremelimumab) or multikinase inhibitors (lenvatinib, sorafenib).";
        } else if (t === "T3" || t === "T4" || n === "N1") {
          stage = "Stage IIIA / IIIB";
          guidanceText = "Locally advanced HCC. Consider transarterial chemoembolization (TACE), selective internal radiation therapy (SIRT), or systemic therapies.";
        }

        return {
          value: "Stage Classification: " + stage + " (T: " + t + ", N: " + n + ", M: " + m + ")",
          eq: "AJCC 8th Edition Hepatocellular Carcinoma Staging.",
          guidance: guidanceText,
          references: "AJCC Cancer Staging Manual. 8th ed. New York: Springer; 2017."
        };
      },
      isClassification: true
    },

    // ==========================================
    // D. PANCREATIC ADENOCARCINOMA (TNM)
    // ==========================================
    {
      id: "pancreaticTnm",
      cat: "solid_organ_oncology",
      subcat: "Hepatobiliary Staging",
      name: "Exocrine Pancreatic Cancer TNM Staging",
      desc: "AJCC 8th Edition staging for pancreatic ductal adenocarcinoma.",
      fields: [
        S("t_stage", "Primary Tumor (T)", "T2", [
          ["Tis", "Tis: Carcinoma in situ"],
          ["T1", "T1: Tumor ≤ 2 cm in greatest dimension, limited to pancreas"],
          ["T2", "T2: Tumor > 2 cm and ≤ 4 cm in greatest dimension, limited to pancreas"],
          ["T3", "T3: Tumor > 4 cm in greatest dimension, limited to pancreas"],
          ["T4", "T4: Tumor extends beyond pancreas (involves celiac axis, superior mesenteric artery, or common hepatic artery) — Unresectable"]
        ]),
        S("n_stage", "Regional Lymph Nodes (N)", "N1", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1", "N1: Metastasis in 1–3 regional lymph nodes"],
          ["N2", "N2: Metastasis in 4 or more regional lymph nodes"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1", "M1: Distant metastasis present"]
        ])
      ],
      calc: v => {
        const t = v.t_stage, n = v.n_stage, m = v.m_stage;
        let stage = "Stage I / II";
        let guidanceText = "Surgical resection (Whipple procedure or distal pancreatectomy) followed by adjuvant multi-agent chemotherapy (e.g., FOLFIRINOX or gemcitabine/capecitabine) is standard for resectable disease.";

        if (m === "M1") {
          stage = "Stage IV";
          guidanceText = "Metastatic pancreatic cancer. Systemic therapy (FOLFIRINOX or gemcitabine/nab-paclitaxel) and palliative care / biliary stent placement.";
        } else if (t === "T4") {
          stage = "Stage III (Locally Advanced / Unresectable)";
          guidanceText = "Locally advanced unresectable pancreatic cancer due to major arterial encasement. Evaluate for induction systemic chemotherapy or clinical trials.";
        }

        return {
          value: "Stage Classification: " + stage + " (T: " + t + ", N: " + n + ", M: " + m + ")",
          eq: "AJCC 8th Edition Pancreatic Cancer Staging.",
          guidance: guidanceText,
          references: "AJCC Cancer Staging Manual. 8th ed. New York: Springer; 2017."
        };
      },
      isClassification: true
    },

    // ==========================================
    // E. GALLBLADDER CANCER (TNM)
    // ==========================================
    {
      id: "gallbladderTnm",
      cat: "solid_organ_oncology",
      subcat: "Hepatobiliary Staging",
      name: "Gallbladder Cancer TNM Staging",
      desc: "AJCC 8th Edition staging for gallbladder carcinoma.",
      fields: [
        S("t_stage", "Primary Tumor (T)", "T2a", [
          ["Tis", "Tis: Carcinoma in situ"],
          ["T1a", "T1a: Tumor invades lamina propria"],
          ["T1b", "T1b: Tumor invades muscular layer"],
          ["T2a", "T2a: Tumor invades perimuscular connective tissue on the peritoneal side without liver involvement"],
          ["T2b", "T2b: Tumor invades perimuscular connective tissue on the hepatic side with liver involvement"],
          ["T3", "T3: Tumor perforates the serosa and/or directly invades the liver and/or one other adjacent organ"],
          ["T4", "T4: Tumor invades main portal vein or hepatic artery, or invades multiple extrahepatic organs"]
        ]),
        S("n_stage", "Regional Lymph Nodes (N)", "N0", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1", "N1: Metastasis to 1–3 regional lymph nodes"],
          ["N2", "N2: Metastasis to 4 or more regional lymph nodes"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1", "M1: Distant metastasis present"]
        ])
      ],
      calc: v => {
        const t = v.t_stage, n = v.n_stage, m = v.m_stage;
        let stage = "Stage I / II";
        let guidanceText = "Surgical resection (cholecystectomy with hepatic wedge resection and portal lymphadenectomy) is curative for early stages. Advanced disease requires systemic therapy.";

        if (m === "M1") {
          stage = "Stage IVB";
          guidanceText = "Metastatic gallbladder cancer. Systemic therapy (gemcitabine-cisplatin combined with immunotherapy like durvalumab) and palliative care.";
        } else if (t === "T4" || n === "N2") {
          stage = "Stage IVA";
          guidanceText = "Locally advanced unresectable disease. Multidisciplinary evaluation.";
        }

        return {
          value: "Stage Classification: " + stage + " (T: " + t + ", N: " + n + ", M: " + m + ")",
          eq: "AJCC 8th Edition Gallbladder Cancer Staging.",
          guidance: guidanceText,
          references: "AJCC Cancer Staging Manual. 8th ed. New York: Springer; 2017."
        };
      },
      isClassification: true
    },

    // ==========================================
    // F. CHOLANGIOCARCINOMA (BILE DUCTS TNM)
    // ==========================================
    {
      id: "bileDuctTnm",
      cat: "solid_organ_oncology",
      subcat: "Hepatobiliary Staging",
      name: "Extrahepatic Bile Duct (Cholangiocarcinoma) TNM Staging",
      desc: "AJCC 8th Edition staging for perihilar and distal extrahepatic cholangiocarcinoma.",
      fields: [
        S("t_stage", "Primary Tumor (T)", "T2", [
          ["T1", "T1: Tumor confined to the bile duct wall, with a depth < 5 mm"],
          ["T2", "T2: Tumor invades beyond the wall of the bile duct (5–12 mm depth, or involving surrounding adipose tissue)"],
          ["T3", "T3: Tumor invades adjacent structures (liver, pancreas, duodenum, gallbladder)"],
          ["T4", "T4: Tumor invades celiac axis, superior mesenteric artery, or common hepatic artery"]
        ]),
        S("n_stage", "Regional Lymph Nodes (N)", "N0", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1", "N1: Metastasis to 1–3 regional lymph nodes"],
          ["N2", "N2: Metastasis to 4 or more regional lymph nodes"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1", "M1: Distant metastasis present"]
        ])
      ],
      calc: v => {
        const t = v.t_stage, n = v.n_stage, m = v.m_stage;
        let stage = "Stage I / II";
        let guidanceText = "Surgical resection with negative margins is the only potential cure. Adjuvant capecitabine is recommended post-resection.";

        if (m === "M1") {
          stage = "Stage IV";
          guidanceText = "Advanced/metastatic cholangiocarcinoma. Gemcitabine-cisplatin plus immunotherapy, and comprehensive molecular profiling for actionable targets (FGFR2 fusions, IDH1 mutations).";
        } else if (t === "T4") {
          stage = "Stage III (Unresectable)";
          guidanceText = "Locally advanced vascular encasement. Evaluation for clinical trials or systemic therapy.";
        }

        return {
          value: "Stage Classification: " + stage + " (T: " + t + ", N: " + n + ", M: " + m + ")",
          eq: "AJCC 8th Edition Bile Duct Cancer Staging.",
          guidance: guidanceText,
          references: "AJCC Cancer Staging Manual. 8th ed. New York: Springer; 2017."
        };
      },
      isClassification: true
    },

    // ==========================================
    // G. RENAL CELL CARCINOMA (KIDNEY TNM)
    // ==========================================
    {
      id: "kidneyTnm",
      cat: "solid_organ_oncology",
      subcat: "Genitourinary Staging",
      name: "Renal Cell Carcinoma (Kidney) TNM Staging",
      desc: "AJCC 8th Edition staging for renal cell carcinoma.",
      fields: [
        S("t_stage", "Primary Tumor (T)", "T1b", [
          ["T1a", "T1a: Tumor ≤ 4 cm, limited to kidney"],
          ["T1b", "T1b: Tumor > 4 cm and ≤ 7 cm, limited to kidney"],
          ["T2a", "T2a: Tumor > 7 cm and ≤ 10 cm, limited to kidney"],
          ["T2b", "T2b: Tumor > 10 cm, limited to kidney"],
          ["T3a", "T3a: Tumor extends into renal veins, segmental branches, or perinephric fat/renal sinus"],
          ["T3b", "T3b: Tumor extends into vena cava below diaphragm"],
          ["T3c", "T3c: Tumor extends into vena cava above diaphragm or invades wall of vena cava"],
          ["T4", "T4: Tumor invades beyond Gerota fascia (including ipsilateral adrenal gland)"]
        ]),
        S("n_stage", "Regional Lymph Nodes (N)", "N0", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1", "N1: Regional lymph node metastasis"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1", "M1: Distant metastasis present"]
        ])
      ],
      calc: v => {
        const t = v.t_stage, n = v.n_stage, m = v.m_stage;
        let stage = "Stage I";
        let guidanceText = "Localized renal cell carcinoma is managed with partial nephrectomy (nephron-sparing surgery) or radical nephrectomy. Active surveillance is an option for small renal masses in elderly or comorbid patients.";

        if (m === "M1") {
          stage = "Stage IV";
          guidanceText = "Metastatic renal cell carcinoma. First-line systemic therapy with immunotherapy combinations (e.g., nivolumab + ipilimumab) or immunotherapy-tyrosine kinase inhibitor combinations.";
        } else if (t === "T4" || n === "N1") {
          stage = "Stage III";
          guidanceText = "Locally advanced renal cell carcinoma. Surgical resection with regional lymphadenectomy or thrombectomy when feasible.";
        } else if (t.startsWith("T2") || t.startsWith("T3")) {
          stage = "Stage II / III";
          guidanceText = "Higher stage localized renal tumor. Radical nephrectomy and comprehensive evaluation.";
        }

        return {
          value: "Stage Classification: " + stage + " (T: " + t + ", N: " + n + ", M: " + m + ")",
          eq: "AJCC 8th Edition Renal Cell Carcinoma Staging.",
          guidance: guidanceText,
          references: "AJCC Cancer Staging Manual. 8th ed. New York: Springer; 2017."
        };
      },
      isClassification: true
    },

    // ==========================================
    // H. BLADDER CANCER (TNM)
    // ==========================================
    {
      id: "bladderTnm",
      cat: "solid_organ_oncology",
      subcat: "Genitourinary Staging",
      name: "Urothelial Bladder Cancer TNM Staging",
      desc: "AJCC 8th Edition staging for urinary bladder carcinoma.",
      fields: [
        S("t_stage", "Primary Tumor (T)", "T2a", [
          ["Ta", "Ta: Non-invasive papillary carcinoma"],
          ["Tis", "Tis: Carcinoma in situ ('flat tumor')"],
          ["T1", "T1: Tumor invades subepithelial connective tissue"],
          ["T2a", "T2a: Tumor invades superficial muscularis propria (inner half)"],
          ["T2b", "T2b: Tumor invades deep muscularis propria (outer half)"],
          ["T3", "T3: Tumor invades perivesical tissue"],
          ["T4a", "T4a: Tumor invades prostatic stroma, uterus, or vagina"],
          ["T4b", "T4b: Tumor invades pelvic wall or abdominal wall"]
        ]),
        S("n_stage", "Regional Lymph Nodes (N)", "N0", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1", "N1: Single regional lymph node metastasis in true pelvis"],
          ["N2", "N2: Multiple regional lymph node metastasis in true pelvis"],
          ["N3", "N3: Metastasis to common iliac lymph nodes"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1", "M1: Distant metastasis present"]
        ])
      ],
      calc: v => {
        const t = v.t_stage, n = v.n_stage, m = v.m_stage;
        let stage = "Stage I";
        let guidanceText = "Non-muscle invasive bladder cancer (Ta, Tis, T1) is managed with transurethral resection of bladder tumor (TURBT) ± intravesical therapy (BCG). Muscle-invasive disease (T2+) requires radical cystectomy with urinary diversion and neoadjuvant cisplatin-based chemotherapy.";

        if (m === "M1") {
          stage = "Stage IV";
          guidanceText = "Metastatic urothelial carcinoma. Systemic platinum-based chemotherapy or antibody-drug conjugates (e.g., enfortumab vedotin + pembrolizumab) and immunotherapy.";
        } else if (t.startsWith("T2") || t.startsWith("T3") || t.startsWith("T4") || n !== "N0") {
          stage = "Stage II / III / IV (Locally Advanced)";
          guidanceText = "Muscle-invasive or node-positive bladder cancer. Multimodal bladder preservation or radical cystectomy with pelvic lymph node dissection.";
        }

        return {
          value: "Stage Classification: " + stage + " (T: " + t + ", N: " + n + ", M: " + m + ")",
          eq: "AJCC 8th Edition Bladder Cancer Staging.",
          guidance: guidanceText,
          references: "AJCC Cancer Staging Manual. 8th ed. New York: Springer; 2017."
        };
      },
      isClassification: true
    },

    // ==========================================
    // I. TESTICULAR CANCER (TNM)
    // ==========================================
    {
      id: "testisTnm",
      cat: "solid_organ_oncology",
      subcat: "Genitourinary Staging",
      name: "Testicular Cancer TNM / S Staging",
      desc: "AJCC 8th Edition staging for testicular germ cell tumors incorporating post-orchiectomy serum tumor markers (S).",
      fields: [
        S("t_stage", "Primary Tumor (T)", "T1", [
          ["T1", "T1: Tumor limited to testis and epididymis without vascular/lymphatic invasion"],
          ["T2", "T2: Tumor limited to testis and epididymis with vascular/lymphatic invasion, or tumor invading hilar soft tissue/epididymis/visceral tunica vaginalis"],
          ["T3", "T3: Tumor invades spermatic cord with or without vascular/lymphatic invasion"],
          ["T4", "T4: Tumor invades scrotum with or without vascular/lymphatic invasion"]
        ]),
        S("n_stage", "Regional Lymph Nodes (N)", "N1", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1", "N1: Lymph node mass ≤ 2 cm in greatest dimension, or multiple nodes none > 2 cm"],
          ["N2", "N2: Lymph node mass > 2 cm and ≤ 5 cm, or multiple nodes"],
          ["N3", "N3: Lymph node mass > 5 cm in greatest dimension"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1a", "M1a: Non-regional nodal or pulmonary metastasis"],
          ["M1b", "M1b: Non-pulmonary visceral metastasis"]
        ]),
        S("s_stage", "Serum Tumor Markers (S)", "S0", [
          ["S0", "S0: Serum tumor marker levels within normal limits (LDH <1.5x ULN, hCG <5, AFP <40)"],
          ["S1", "S1: LDH <1.5x ULN AND hCG <5,000 AND AFP <1,000"],
          ["S2", "S2: LDH 1.5–10x ULN OR hCG 5,000–50,000 OR AFP 1,000–10,000"],
          ["S3", "S3: LDH >10x ULN OR hCG >50,000 OR AFP >10,000"]
        ])
      ],
      calc: v => {
        const t = v.t_stage, n = v.n_stage, m = v.m_stage, s = v.s_stage;
        let stage = "Stage I";
        let guidanceText = "Radical inguinal orchiectomy is diagnostic and initial treatment. Further management (active surveillance, adjuvant chemotherapy, or retroperitoneal lymph node dissection) is dictated by histology (seminoma vs non-seminoma) and risk stratification.";

        if (m.startsWith("M1") || s === "S3") {
          stage = "Stage III (Poor / Intermediate Risk)";
          guidanceText = "Advanced metastatic germ cell tumor. Primary multi-agent induction chemotherapy (BEP: Bleomycin, Etoposide, Cisplatin or EP) urgently required.";
        } else if (n !== "N0" || s === "S1" || s === "S2") {
          stage = "Stage II";
          guidanceText = "Node-positive or marker-elevated testicular cancer. Chemotherapy or radiation therapy depending on seminomatous vs non-seminomatous histology.";
        }

        return {
          value: "Stage Classification: " + stage + " (T: " + t + ", N: " + n + ", M: " + m + ", S: " + s + ")",
          eq: "AJCC 8th Edition Testicular Cancer Staging including Serum Tumor Markers (S).",
          guidance: guidanceText,
          references: "AJCC Cancer Staging Manual. 8th ed. New York: Springer; 2017."
        };
      },
      isClassification: true
    },

    // ==========================================
    // J. HEAD AND NECK SQUAMOUS CELL CARCINOMA (TNM)
    // ==========================================
    {
      id: "headNeckTnm",
      cat: "solid_organ_oncology",
      subcat: "Head and Neck Staging",
      name: "Head and Neck Mucosal Squamous Cell Carcinoma TNM Staging",
      desc: "AJCC 8th Edition staging for oral cavity, larynx, and hypopharynx squamous cell carcinoma.",
      fields: [
        S("t_stage", "Primary Tumor (T)", "T2", [
          ["T1", "T1: Tumor ≤ 2 cm, depth of invasion (DOI) ≤ 5 mm"],
          ["T2", "T2: Tumor ≤ 2 cm with DOI > 5 mm and ≤ 10 mm, or tumor > 2 cm and ≤ 4 cm with DOI ≤ 10 mm"],
          ["T3", "T3: Tumor > 4 cm, or any tumor with DOI > 10 mm"],
          ["T4a", "T4a: Moderately advanced local disease (invades bone, deep/extrinsic muscle of tongue, maxillary sinus, skin)"],
          ["T4b", "T4b: Very advanced local disease (invades masticator space, pterygoid plates, skull base, encases carotid artery)"]
        ]),
        S("n_stage", "Regional Lymph Nodes (N)", "N1", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1", "N1: Metastasis in single ipsilateral lymph node ≤ 3 cm without ENE"],
          ["N2a", "N2a: Metastasis in single ipsilateral node ≤ 3 cm with ENE, or > 3 cm and ≤ 6 cm without ENE"],
          ["N2b", "N2b: Metastasis in multiple ipsilateral nodes ≤ 6 cm without ENE"],
          ["N2c", "N2c: Metastasis in bilateral or contralateral nodes ≤ 6 cm without ENE"],
          ["N3a", "N3a: Metastasis in lymph node > 6 cm without ENE"],
          ["N3b", "N3b: Metastasis in any node with clinically overt Extranodal Extension (ENE)"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1", "M1: Distant metastasis present"]
        ])
      ],
      calc: v => {
        const t = v.t_stage, n = v.n_stage, m = v.m_stage;
        let stage = "Stage II";
        let guidanceText = "Multidisciplinary management involving surgery and/or radiation therapy with concurrent systemic therapy (cisplatin). Incorporates Depth of Invasion (DOI) and Extranodal Extension (ENE).";

        if (m === "M1") {
          stage = "Stage IVC";
          guidanceText = "Metastatic head and neck squamous cell carcinoma. Systemic therapy (platinum/5-FU combined with pembrolizumab or immunotherapy alone based on PD-L1 CPS).";
        } else if (t === "T4b" || n.startsWith("N3")) {
          stage = "Stage IVB";
          guidanceText = "Very advanced locoregional disease. Often unresectable; primary chemoradiotherapy or palliative protocols.";
        } else if (t === "T3" || t.startsWith("T4") || n.startsWith("N2")) {
          stage = "Stage III / IVA";
          guidanceText = "Locally advanced head and neck cancer. Aggressive multimodality surgical resection and/or adjuvant chemoradiotherapy.";
        }

        return {
          value: "Stage Classification: " + stage + " (T: " + t + ", N: " + n + ", M: " + m + ")",
          eq: "AJCC 8th Edition Head and Neck Staging (incorporates Depth of Invasion and Extranodal Extension [ENE]).",
          guidance: guidanceText,
          references: "Lydiatt WM, Patel SG, O'Sullivan B, et al. Head and Neck cancers-major changes in the American Joint Committee on Cancer eighth edition staging manual. CA Cancer J Clin. 2017;67(2):122-137."
        };
      },
      isClassification: true
    },

    // ==========================================
    // K. HPV-MEDIATED OROPHARYNGEAL CANCER (TNM)
    // ==========================================
    {
      id: "hpvOropharynxTnm",
      cat: "solid_organ_oncology",
      subcat: "Head and Neck Staging",
      name: "HPV-Mediated (p16-Positive) Oropharyngeal Cancer Staging",
      desc: "AJCC 8th Edition specialized clinical staging for p16-positive (HPV-driven) oropharyngeal squamous cell carcinoma.",
      fields: [
        S("t_stage", "Clinical Primary Tumor (cT)", "cT1", [
          ["cT1", "cT1: Tumor ≤ 2 cm in greatest dimension"],
          ["cT2", "cT2: Tumor > 2 cm and ≤ 4 cm in greatest dimension"],
          ["cT3", "cT3: Tumor > 4 cm or extension to lingual surface of epiglottis"],
          ["cT4", "cT4: Tumor invades larynx, extramuscular tongue muscle, medial pterygoid, hard palate, mandible, or skull base / encases carotid artery"]
        ]),
        S("n_stage", "Clinical Regional Lymph Nodes (cN)", "cN1", [
          ["cN0", "cN0: No regional lymph node metastasis"],
          ["cN1", "cN1: Unilateral or bilateral metastasis in cervical lymph nodes ≤ 6 cm"],
          ["cN2", "cN2: Contralateral or bilateral lymph node metastasis > 6 cm, or matted nodes"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1", "M1: Distant metastasis present"]
        ])
      ],
      calc: v => {
        const t = v.t_stage, n = v.cN_stage || v.n_stage, m = v.m_stage;
        let stage = "Stage I";
        let guidanceText = "HPV-positive oropharyngeal cancer has a significantly more favorable prognosis than HPV-negative head and neck cancers. Treated with definitive radiation therapy ± systemic therapy, or transoral robotic surgery (TORS) followed by risk-adapted adjuvant therapy.";

        if (m === "M1") {
          stage = "Stage IV";
          guidanceText = "Metastatic HPV-positive oropharyngeal cancer. Systemic immunotherapy or chemotherapy protocols.";
        } else if (n === "cN2" || t === "cT4") {
          stage = "Stage III";
          guidanceText = "Locally advanced HPV-positive oropharyngeal cancer. Definitive chemoradiotherapy or surgery with adjuvant risk-adapted therapy.";
        } else if (t === "cT3" || n === "cN1") {
          stage = "Stage II";
          guidanceText = "Intermediate stage HPV-positive oropharyngeal cancer with excellent overall survival outcomes.";
        }

        return {
          value: "Stage Classification: " + stage + " (p16+, T: " + t + ", N: " + n + ", M: " + m + ")",
          eq: "AJCC 8th Edition p16+ (HPV-mediated) Oropharyngeal Cancer Staging.",
          guidance: guidanceText,
          references: "O'Sullivan B, Huang SH, Su J, et al. Development and validation of a staging system for p16-positive oropharyngeal cancer by the International Collaboration on Oropharyngeal cancer Network for Staging (ICON-S): a multicentre cohort study. Lancet Oncol. 2016;17(4):440-451."
        };
      },
      isClassification: true
    },

    // ==========================================
    // L. GASTROINTESTINAL STROMAL TUMOR (GIST)
    // ==========================================
    {
      id: "gistStaging",
      cat: "solid_organ_oncology",
      subcat: "Rare & Neuroendocrine Tumors",
      name: "Gastrointestinal Stromal Tumor (GIST) Risk Staging",
      desc: "AJCC risk stratification combining tumor site, size, and mitotic rate.",
      fields: [
        S("site", "Primary Tumor Site", "gastric", [
          ["gastric", "Gastric"],
          ["small_intestine", "Small Intestine / Duodenum / Colorectal"]
        ]),
        S("size", "Tumor Size", "5_10", [
          ["le_2", "≤ 2 cm"],
          ["2_5", "> 2 cm to ≤ 5 cm"],
          ["5_10", "> 5 cm to ≤ 10 cm"],
          ["gt_10", "> 10 cm"]
        ]),
        S("mitotic", "Mitotic Rate (per 5 High Power Fields)", "low", [
          ["low", "≤ 5 mitoses per 5 HPF"],
          ["high", "> 5 mitoses per 5 HPF"]
        ])
      ],
      calc: v => {
        const site = v.site, size = v.size, mit = v.mitotic;
        let risk = "Very Low Risk";
        let guidanceText = "Localized GIST is primarily managed with complete surgical resection without routine lymphadenectomy. Adjuvant imatinib is indicated for intermediate- to high-risk profiles.";

        if (size === "gt_10" || mit === "high" || (site === "small_intestine" && size === "5_10")) {
          risk = "High Risk";
          guidanceText = "High-risk GIST. Adjuvant tyrosine kinase inhibitor therapy (imatinib) strongly recommended for at least 3 years.";
        } else if (size === "5_10" && mit === "low" && site === "gastric") {
          risk = "Intermediate Risk";
          guidanceText = "Intermediate risk. Evaluate mutational testing (KIT and PDGFRA) to guide adjuvant treatment decisions.";
        }

        return {
          value: "GIST Risk Category: " + risk + " (" + site + ", Size: " + size + ", Mitotic rate: " + mit + ")",
          eq: "AJCC / Fletcher GIST Risk Classification Matrix.",
          guidance: guidanceText,
          references: "Miettinen M, Lasota J. Gastrointestinal stromal tumors: pathology on the basis of molecular biology. Semin Oncol. 2006;33(3):270-281."
        };
      },
      isClassification: true
    },

    // ==========================================
    // M. NEUROENDOCRINE TUMORS (NET)
    // ==========================================
    {
      id: "netTnm",
      cat: "solid_organ_oncology",
      subcat: "Rare & Neuroendocrine Tumors",
      name: "Gastroenteropancreatic Neuroendocrine Tumors (GEP-NET) Staging",
      desc: "AJCC 8th Edition TNM staging for midgut, hindgut, and pancreatic neuroendocrine tumors.",
      fields: [
        S("grade", "WHO Histological Grade", "g2", [
          ["g1", "Grade 1 (Ki-67 index < 3% or < 2 mitoses/2 mm²)"],
          ["g2", "Grade 2 (Ki-67 index 3–20% or 2–20 mitoses/2 mm²)"],
          ["g3", "Grade 3 (Ki-67 index > 20% or > 20 mitoses/2 mm²)"]
        ]),
        S("t_stage", "Primary Tumor Extent (T)", "T2", [
          ["T1", "T1: Tumor limited to lamina propria/submucosa or size ≤ 2 cm (site dependent)"],
          ["T2", "T2: Tumor invades muscularis propria or size > 2 cm"],
          ["T3", "T3: Tumor penetrates through muscularis propria / subserosa"],
          ["T4", "T4: Tumor invades visceral peritoneum or adjacent organs"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1", "M1: Distant metastasis present"]
        ])
      ],
      calc: v => {
        const grade = v.grade, t = v.t_stage, m = v.m_stage;
        let stage = "Stage I / II";
        let guidanceText = "Management includes surgical resection for localized tumors, somatostatin analogs (octreotide/lanreotide) for functional/slow-growing tumors, PRRT (peptide receptor radionuclide therapy), and targeted therapies.";

        if (m === "M1") {
          stage = "Stage IV";
          guidanceText = "Metastatic neuroendocrine tumor. Somatostatin analogs, liver-directed therapies (embolization/radioablation), PRRT, or systemic cytotoxic chemotherapy for high-grade (G3) tumors.";
        } else if (grade === "g3") {
          stage = "Stage III (High Grade Neuroendocrine Carcinoma)";
          guidanceText = "High-grade neuroendocrine carcinoma. Typically managed with platinum-based chemotherapy regimens similar to small cell carcinoma.";
        }

        return {
          value: "NET Staging Classification (Grade: " + grade.toUpperCase() + ", T: " + t + ", M: " + m + ")",
          eq: "AJCC 8th Edition GEP-NET Staging.",
          guidance: guidanceText,
          references: "AJCC Cancer Staging Manual. 8th ed. New York: Springer; 2017."
        };
      },
      isClassification: true
    },

    // ==========================================
    // N. CENTRAL NERVOUS SYSTEM (WHO CNS GRADING)
    // ==========================================
    {
      id: "cnsGrading",
      cat: "solid_organ_oncology",
      subcat: "Central Nervous System",
      name: "WHO Central Nervous System (CNS) Tumor Grading",
      desc: "World Health Organization histological grading system for primary central nervous system tumors (gliomas, meningiomas, medulloblastoma).",
      fields: [
        S("who_grade", "WHO Histological Grade", "grade4", [
          ["grade1", "WHO Grade 1 (Low proliferative potential, pilocytic astrocytoma, meningioma)"],
          ["grade2", "WHO Grade 2 (Infiltrative, low mitotic activity, diffuse astrocytoma)"],
          ["grade3", "WHO Grade 3 (Malignant, histological evidence of atypia and brisk mitosis, anaplastic astrocytoma)"],
          ["grade4", "WHO Grade 4 (Cytologically malignant, mitotically active, necrosis-prone, glioblastoma)"]
        ])
      ],
      calc: v => {
        const grade = v.who_grade;
        let text = "";
        let guidanceText = "";

        if (grade === "grade1") {
          text = "WHO Grade 1 — Benign / Low Risk";
          guidanceText = "Surgical resection alone is frequently curative for Grade 1 CNS tumors (e.g., pilocytic astrocytoma or low-grade meningioma).";
        } else if (grade === "grade2") {
          text = "WHO Grade 2 — Infiltrative / Low-Grade";
          guidanceText = "Infiltrative low-grade gliomas. Management involves surgical resection, molecular profiling (IDH mutation, 1p/19q codeletion), and risk-adapted radiation or chemotherapy.";
        } else if (grade === "grade3") {
          text = "WHO Grade 3 — Anaplastic / Malignant";
          guidanceText = "Anaplastic tumors. Multidisciplinary approach combining maximal safe surgical resection followed by concurrent fractionated radiation therapy and chemotherapy (e.g., temozolomide).";
        } else {
          text = "WHO Grade 4 — Highly Malignant (e.g., Glioblastoma)";
          guidanceText = "Aggressive high-grade malignant CNS tumor. Maximal safe surgical resection followed by Stupp protocol (concurrent chemoradiotherapy with temozolomide followed by adjuvant temozolomide and tumor-treating fields).";
        }

        return {
          value: text,
          eq: "WHO Classification of Tumours of the Central Nervous System grading paradigm.",
          guidance: guidanceText,
          references: "Louis DN, Perry A, Wesseling P, et al. The 2021 WHO Classification of Tumors of the Central Nervous System: a summary. Neuro Oncol. 2021;23(8):1231-1251."
        };
      },
      isClassification: true
    },

    // ==========================================
    // O. SMALL CELL LUNG CANCER (VALSG STAGING)
    // ==========================================
    {
      id: "sclcStaging",
      cat: "solid_organ_oncology",
      subcat: "Thoracic Staging",
      name: "Small Cell Lung Cancer (SCLC) Staging",
      desc: "Veterans Affairs Lung Study Group (VALSG) staging framework for small cell lung cancer.",
      fields: [
        S("sclc_stage", "SCLC Clinical Extent", "limited", [
          ["limited", "Limited Stage: Disease restricted to one hemithorax, with or without regional lymph nodes (can be safely encompassed within a single radiation portal)"],
          ["extensive", "Extensive Stage: Disseminated disease beyond the confines of one hemithorax, including malignant pleural/pericardial effusion or distant metastasis"]
        ])
      ],
      calc: v => {
        const stage = v.sclc_stage;
        let text = stage === "limited" ? "Limited Stage SCLC" : "Extensive Stage SCLC";
        let guidanceText = stage === "limited"
          ? "Limited-stage SCLC. Standard treatment is concurrent platinum-based chemotherapy (cisplatin/carboplatin + etoposide) combined with early thoracic radiation therapy. Consider prophylactic cranial irradiation (PCI) for responders."
          : "Extensive-stage SCLC. Systemic chemo-immunotherapy (carboplatin + etoposide + atezolizumab or durvalumab) is standard first-line treatment. Palliative radiation therapy as indicated.";

        return {
          value: text,
          eq: "VALSG two-stage framework for Small Cell Lung Cancer.",
          guidance: guidanceText,
          references: "Zochbauer-Muller S, et al. Small cell lung cancer: staging and management. Semin Oncol. 2003;30(1):24-32."
        };
      },
      isClassification: true
    },

    // ==========================================
    // P. THYMIC TUMORS (TNM / MASAOKA-KOGA)
    // ==========================================
    {
      id: "thymicTnm",
      cat: "solid_organ_oncology",
      subcat: "Thoracic Staging",
      name: "Thymic Tumors (Thymoma & Thymic Carcinoma) TNM Staging",
      desc: "AJCC 8th Edition staging for thymic epithelial tumors.",
      fields: [
        S("t_stage", "Primary Tumor (T)", "T1b", [
          ["T1a", "T1a: Tumor encapsulated or with microscopic transcapsular invasion only, ≤ 5 cm"],
          ["T1b", "T1b: Tumor encapsulated or with microscopic transcapsular invasion only, > 5 cm"],
          ["T2", "T2: Tumor with macroscopic invasion into the mediastinal pleura or pericardium"],
          ["T3", "T3: Tumor with macroscopic invasion into the lung, brachiocephalic vein, superior vena cava, chest wall, or phrenic nerve"],
          ["T4", "T4: Tumor with macroscopic invasion into the aorta, arch vessels, myocardium, trachea, or esophagus"]
        ]),
        S("n_stage", "Regional Lymph Nodes (N)", "N0", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1", "N1: Metastasis in anterior mediastinal lymph nodes"],
          ["N2", "N2: Metastasis in intrathoracic lymph nodes beyond anterior mediastinum"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1a", "M1a: Separate pleural or pericardial nodule(s)"],
          ["M1b", "M1b: Pulmonary parenchymal metastasis or distant organ metastasis"]
        ])
      ],
      calc: v => {
        const t = v.t_stage, n = v.n_stage, m = v.m_stage;
        let stage = "Stage I / II";
        let guidanceText = "Surgical resection (thymectomy) is the primary treatment for localized thymic tumors. Adjuvant radiation therapy is considered for advanced stages or incomplete resections.";

        if (m.startsWith("M1")) {
          stage = "Stage IVB (" + m + ")";
          guidanceText = "Metastatic thymic tumor. Systemic therapy (platinum-based chemotherapy regimens such as CAP/carboplatin + paclitaxel) and palliative care.";
        } else if (t === "T4" || n === "N2") {
          stage = "Stage IVA / IVB";
          guidanceText = "Locally advanced thymic malignancy. Multidisciplinary evaluation for induction chemotherapy followed by surgical resection and/or radiation.";
        }

        return {
          value: "Stage Classification: " + stage + " (T: " + t + ", N: " + n + ", M: " + m + ")",
          eq: "AJCC 8th Edition Thymic Tumors Staging.",
          guidance: guidanceText,
          references: "Kondo K, et al. The revised staging system for thymic epithelial tumors: the Joint Committee on Staging of Thymic Epithelial Tumors of the Japanese Society for Research on the Thymus and the International Association for the Study of Lung Cancer. J Thorac Oncol. 2014;9(9 Suppl 2):S97-S103."
        };
      },
      isClassification: true
    },

    // ==========================================
    // Q. SMALL INTESTINAL ADENOCARCINOMA (TNM)
    // ==========================================
    {
      id: "smallBowelTnm",
      cat: "solid_organ_oncology",
      subcat: "Gastrointestinal Staging",
      name: "Small Intestinal Adenocarcinoma TNM Staging",
      desc: "AJCC 8th Edition staging for non-GIST, non-NET adenocarcinomas of the duodenum, jejunum, and ileum.",
      fields: [
        S("t_stage", "Primary Tumor (T)", "T2", [
          ["Tis", "Tis: Carcinoma in situ"],
          ["T1", "T1: Tumor invades lamina propria or submucosa"],
          ["T2", "T2: Tumor invades muscularis propria"],
          ["T3", "T3: Tumor invades through muscularis propria into subserosa or non-peritonealized tissue without serosal penetration"],
          ["T4", "T4: Tumor penetrates visceral peritoneum or directly invades other organs/structures"]
        ]),
        S("n_stage", "Regional Lymph Nodes (N)", "N1", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1", "N1: Metastasis in 1–2 regional lymph nodes"],
          ["N2", "N2: Metastasis in 3 or more regional lymph nodes"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1", "M1: Distant metastasis present"]
        ])
      ],
      calc: v => {
        const t = v.t_stage, n = v.n_stage, m = v.m_stage;
        let stage = "Stage II";
        let guidanceText = "Surgical resection with wide regional lymphadenectomy is the primary treatment for localized small bowel adenocarcinoma. Adjuvant chemotherapy (fluoropyrimidine-based) is often considered for high-risk or node-positive disease.";

        if (m === "M1") {
          stage = "Stage IV";
          guidanceText = "Metastatic small bowel adenocarcinoma. Systemic therapy regimens modeled on colorectal cancer protocols (FOLFOX / CAPOX).";
        } else if (n !== "N0") {
          stage = "Stage III";
          guidanceText = "Node-positive small bowel adenocarcinoma. Post-operative adjuvant chemotherapy recommended.";
        }

        return {
          value: "Stage Classification: " + stage + " (T: " + t + ", N: " + n + ", M: " + m + ")",
          eq: "AJCC 8th Edition Small Intestine Adenocarcinoma Staging.",
          guidance: guidanceText,
          references: "AJCC Cancer Staging Manual. 8th ed. New York: Springer; 2017."
        };
      },
      isClassification: true
    },

    // ==========================================
    // R. ANAL SQUAMOUS CELL CARCINOMA (TNM)
    // ==========================================
    {
      id: "analTnm",
      cat: "solid_organ_oncology",
      subcat: "Gastrointestinal Staging",
      name: "Anal Squamous Cell Carcinoma TNM Staging",
      desc: "AJCC 8th Edition staging for squamous cell carcinoma of the anal canal.",
      fields: [
        S("t_stage", "Primary Tumor (T)", "T2", [
          ["T1", "T1: Tumor ≤ 2 cm in greatest dimension"],
          ["T2", "T2: Tumor > 2 cm and ≤ 5 cm"],
          ["T3", "T3: Tumor > 5 cm in greatest dimension"],
          ["T4", "T4: Tumor of any size invading adjacent organ(s) such as vagina, urethra, or bladder"]
        ]),
        S("n_stage", "Regional Lymph Nodes (N)", "N1", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1", "N1: Metastasis in perirectal, inguinal, internal iliac, and/or external iliac lymph nodes"],
          ["N2", "N2: Metastasis in contralateral inguinal and/or bilateral internal iliac lymph nodes"],
          ["N3", "N3: Metastasis in bilateral inguinal and/or bilateral pelvic lymph nodes"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1", "M1: Distant metastasis present"]
        ])
      ],
      calc: v => {
        const t = v.t_stage, n = v.n_stage, m = v.m_stage;
        let stage = "Stage II";
        let guidanceText = "Definitive chemoradiotherapy (Nigro protocol: 5-FU + mitomycin C combined with radiation therapy) is the gold standard for anal squamous cell carcinoma, preserving sphincter function.";

        if (m === "M1") {
          stage = "Stage IV";
          guidanceText = "Metastatic anal cancer. Systemic chemotherapy (carboplatin + paclitaxel) and immunotherapy protocols.";
        } else if (t === "T4" || n.startsWith("N2") || n.startsWith("N3")) {
          stage = "Stage IIIB / IIIC";
          guidanceText = "Locally advanced anal cancer. Definitive concurrent chemoradiotherapy.";
        }

        return {
          value: "Stage Classification: " + stage + " (T: " + t + ", N: " + n + ", M: " + m + ")",
          eq: "AJCC 8th Edition Anal Squamous Cell Carcinoma Staging.",
          guidance: guidanceText,
          references: "AJCC Cancer Staging Manual. 8th ed. New York: Springer; 2017."
        };
      },
      isClassification: true
    },

    // ==========================================
    // S. CUTANEOUS SQUAMOUS CELL CARCINOMA (TNM)
    // ==========================================
    {
      id: "skinNmicTnm",
      cat: "solid_organ_oncology",
      subcat: "Musculoskeletal & Skin Staging",
      name: "Cutaneous Squamous Cell Carcinoma (cSCC) TNM Staging",
      desc: "AJCC 8th Edition staging for cutaneous squamous cell carcinoma of the head and neck / body.",
      fields: [
        S("t_stage", "Primary Tumor (T)", "T2", [
          ["Tis", "Tis: Carcinoma in situ"],
          ["T1", "T1: Tumor < 2 cm in greatest dimension, with < 2 high-risk features"],
          ["T2", "T2: Tumor ≥ 2 cm, or any size with 2+ high-risk features (depth > 2mm, perineural invasion, Clark level ≥ IV)"],
          ["T3", "T3: Tumor with invasion of maxilla, mandible, skull base, or temporal bone"],
          ["T4", "T4: Tumor with invasion through cortical bone or axial skeleton"]
        ]),
        S("n_stage", "Regional Lymph Nodes (N)", "N0", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1", "N1: Single ipsilateral node ≤ 3 cm without ENE"],
          ["N2", "N2: Single ipsilateral node > 3 cm without ENE, or multiple nodes, or ENE-positive"],
          ["N3", "N3: Node > 6 cm or multiple positive nodes with ENE"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1", "M1: Distant metastasis present"]
        ])
      ],
      calc: v => {
        const t = v.t_stage, n = v.n_stage, m = v.m_stage;
        let stage = "Stage I / II";
        let guidanceText = "Surgical excision with clear margins (Mohs micrographic surgery or wide local excision) is primary. Adjuvant radiation therapy indicated for high-risk features, perineural invasion, or positive nodes.";

        if (m === "M1") {
          stage = "Stage IV";
          guidanceText = "Metastatic cutaneous squamous cell carcinoma. Systemic therapy with anti-PD-1 immunotherapy (cemiplimab or pembrolizumab).";
        } else if (t === "T3" || t === "T4" || n !== "N0") {
          stage = "Stage III / IV (Locally Advanced)";
          guidanceText = "Locally advanced cSCC. Multidisciplinary surgical resection, neck dissection, and adjuvant chemoradiotherapy or immunotherapy.";
        }

        return {
          value: "Stage Classification: " + stage + " (T: " + t + ", N: " + n + ", M: " + m + ")",
          eq: "AJCC 8th Edition Cutaneous Squamous Cell Carcinoma Staging.",
          guidance: guidanceText,
          references: "Karia SZ, et al. American Joint Committee on Cancer staging cancer manual updates for cutaneous squamous cell carcinoma. CA Cancer J Clin. 2018."
        };
      },
      isClassification: true
    },

    // ==========================================
    // T. UVEAL / OCULAR MELANOMA (TNM)
    // ==========================================
    {
      id: "uvealMelanomaTnm",
      cat: "solid_organ_oncology",
      subcat: "Rare & Ocular Staging",
      name: "Uveal (Choroidal / Ciliary Body) Melanoma TNM Staging",
      desc: "AJCC 8th Edition staging for primary uveal melanoma based on basal tumor diameter and thickness.",
      fields: [
        S("t_stage", "Primary Tumor (T)", "T2a", [
          ["T1", "T1: Small tumor (thickness ≤ 3 mm and basal diameter ≤ 12 mm)"],
          ["T2a", "T2a: Medium tumor without ciliary body involvement/extrascleral extension"],
          ["T2b", "T2b: Medium tumor with ciliary body involvement"],
          ["T3a", "T3a: Large tumor without ciliary body involvement"],
          ["T3b", "T3b: Large tumor with ciliary body involvement"],
          ["T4", "T4: Very large tumor with extrascleral extension"]
        ]),
        S("n_stage", "Regional Lymph Nodes (N)", "N0", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1", "N1: Regional lymph node metastasis present"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1a", "M1a: Distant metastasis in maximum dimension ≤ 3 cm"],
          ["M1b", "M1b: Distant metastasis 3.1–8 cm"],
          ["M1c", "M1c: Distant metastasis > 8 cm"]
        ])
      ],
      calc: v => {
        const t = v.t_stage, n = v.n_stage, m = v.m_stage;
        let stage = "Stage I / II";
        let guidanceText = "Ophthalmology oncology management includes globe-conserving plaque brachytherapy, proton beam radiotherapy, or enucleation for very large tumors. Regular systemic liver surveillance required due to high metastatic tropism to the liver.";

        if (m.startsWith("M1")) {
          stage = "Stage IV (" + m + ")";
          guidanceText = "Metastatic uveal melanoma (typically hepatic). Liver-directed therapies (transarterial chemoembolization, immunoembolization, surgical resection, or radioembolization) and systemic therapy (tebentafusp for HLA-A*02:01 positive patients).";
        } else if (t === "T4") {
          stage = "Stage IIIC";
          guidanceText = "Locally advanced uveal melanoma with extrascleral extension. Enucleation and orbital evaluation.";
        }

        return {
          value: "Stage Classification: " + stage + " (T: " + t + ", N: " + n + ", M: " + m + ")",
          eq: "AJCC 8th Edition Uveal Melanoma Staging.",
          guidance: guidanceText,
          references: "Damato B, et al. Staging of uveal melanoma. Eye (Lond). 2013;27(2):185-191."
        };
      },
      isClassification: true
    },

    // ==========================================
    // U. ADRENOCORTICAL CARCINOMA (ENSAT / AJCC)
    // ==========================================
    {
      id: "adrenalTnm",
      cat: "solid_organ_oncology",
      subcat: "Endocrine Staging",
      name: "Adrenocortical Carcinoma (ACC) ENSAT Staging",
      desc: "European Network for the Study of Adrenal Tumours (ENSAT) / AJCC 8th Edition staging for adrenocortical carcinoma.",
      fields: [
        S("t_stage", "Primary Tumor (T)", "T2", [
          ["T1", "T1: Tumor ≤ 5 cm, no extra-adrenal invasion"],
          ["T2", "T2: Tumor > 5 cm, no extra-adrenal invasion"],
          ["T3", "T3: Tumor of any size with local invasion into surrounding adipose tissue"],
          ["T4", "T4: Tumor invading adjacent organs (kidney, renal vein, vena cava, pancreas, spleen)"]
        ]),
        S("n_stage", "Regional Lymph Nodes (N)", "N0", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1", "N1: Regional lymph node metastasis present"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1", "M1: Distant metastasis present"]
        ])
      ],
      calc: v => {
        const t = v.t_stage, n = v.n_stage, m = v.m_stage;
        let stage = "Stage I / II";
        let guidanceText = "Open radical en-bloc surgical resection is the only curative treatment for localized adrenocortical carcinoma. Adjuvant mitotane therapy is typically recommended for high-risk resected tumors.";

        if (m === "M1") {
          stage = "Stage IV";
          guidanceText = "Metastatic adrenocortical carcinoma. Systemic therapy with EDP-M (Etoposide, Doxorubicin, Cisplatin plus Mitotane) and local metastasectomy when feasible.";
        } else if (t === "T4" || n === "N1") {
          stage = "Stage III";
          guidanceText = "Locally advanced ACC. En-bloc multi-organ surgical resection with regional lymphadenectomy.";
        }

        return {
          value: "Stage Classification: " + stage + " (T: " + t + ", N: " + n + ", M: " + m + ")",
          eq: "ENSAT / AJCC 8th Edition Adrenocortical Carcinoma Staging.",
          guidance: guidanceText,
          references: "Fassnacht M, et al. European Network for the Study of Adrenal Tumours (ENSAT) staging for adrenocortical carcinoma. J Clin Endocrinol Metab. 2009;94(2):408-412."
        };
      },
      isClassification: true
    },

    // ==========================================
    // V. PULMONARY NEUROENDOCRINE TUMORS (LUNG NET)
    // ==========================================
    {
      id: "lungNetTnm",
      cat: "solid_organ_oncology",
      subcat: "Thoracic Staging",
      name: "Pulmonary Neuroendocrine Tumor (Carcinoid) TNM Staging",
      desc: "AJCC 8th Edition staging for typical and atypical pulmonary carcinoid tumors.",
      fields: [
        S("histology", "Histological Subtype", "typical", [
          ["typical", "Typical Carcinoid (< 2 mitoses/2 mm², no necrosis)"],
          ["atypical", "Atypical Carcinoid (2–20 mitoses/2 mm² or punctate necrosis)"]
        ]),
        S("t_stage", "Primary Tumor (T)", "T1b", [
          ["T1a", "T1a: Tumor ≤ 1 cm"],
          ["T1b", "T1b: Tumor > 1 cm and ≤ 2 cm"],
          ["T1c", "T1c: Tumor > 2 cm and ≤ 3 cm"],
          ["T2a", "T2a: Tumor > 3 cm and ≤ 4 cm"],
          ["T2b", "T2b: Tumor > 4 cm and ≤ 5 cm"],
          ["T3", "T3: Tumor > 5 cm and ≤ 7 cm, or main bronchus involvement < 2 cm from carina"],
          ["T4", "T4: Tumor > 7 cm or invading mediastinum, heart, trachea, esophagus"]
        ]),
        S("n_stage", "Regional Lymph Nodes (N)", "N0", [
          ["N0", "N0: No regional lymph node metastasis"],
          ["N1", "N1: Ipsilateral peribronchial/hilar nodes"],
          ["N2", "N2: Ipsilateral mediastinal/subcarinal nodes"]
        ]),
        S("m_stage", "Distant Metastasis (M)", "M0", [
          ["M0", "M0: No distant metastasis"],
          ["M1", "M1: Distant metastasis present"]
        ])
      ],
      calc: v => {
        const t = v.t_stage, n = v.n_stage, m = v.m_stage, hist = v.histology;
        let stage = "Stage I / II";
        let guidanceText = "Surgical resection (lobectomy or segmentectomy with systematic lymph node dissection) is the primary treatment for localized pulmonary neuroendocrine tumors.";

        if (m === "M1") {
          stage = "Stage IV";
          guidanceText = "Metastatic pulmonary neuroendocrine tumor. Somatostatin analogs, PRRT, or systemic therapy depending on carcinoid grade.";
        } else if (n === "N2" || t === "T4") {
          stage = "Stage III";
          guidanceText = "Locally advanced pulmonary carcinoid. Multidisciplinary surgical and oncologic evaluation.";
        }

        return {
          value: "Stage Classification: " + stage + " (" + hist + " carcinoid, T: " + t + ", N: " + n + ", M: " + m + ")",
          eq: "AJCC 8th Edition Pulmonary Neuroendocrine Tumors Staging.",
          guidance: guidanceText,
          references: "Travis WD, et al. The 2015 World Health Organization Classification of Lung Tumors. J Thorac Oncol. 2015;10(9):1243-1260."
        };
      },
      isClassification: true
    }
  ];

  window.MedCalcModules.push({
    category: category,
    guidance: guidance,
    tools: tools
  });
})();
