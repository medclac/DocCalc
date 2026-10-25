/**
 * MedCalc Module: Orthopaedics & Trauma (ORTHO)
 * Fully compatible with the MedCalc HTML application structure.
 */
(function () {
  "use strict";

  // Use the global constructors declared in the HTML header
  var makeN = (typeof window !== "undefined" && window.N) ? window.N : function (id, label, defaultVal, extra) {
    extra = extra || {};
    return Object.assign({ id: id, label: label, type: "number", value: defaultVal, default: defaultVal }, extra);
  };
  var makeS = (typeof window !== "undefined" && window.S) ? window.S : function (id, label, defaultVal, options) {
    options = options || [];
    return { id: id, label: label, type: "select", value: defaultVal, default: defaultVal, options: options };
  };

  var orthoCategory = {
    id: "ortho",
    name: "Orthopaedics & Trauma",
    icon: "🦴",
    desc: "Fracture classifications, trauma rules, joint scores, spine stability, and compartment syndrome",
    organs: ["bone", "joint", "femur", "tibia", "spine", "hip", "knee", "shoulder", "ankle"],
    region: "musculoskeletal / trauma"
  };

  var orthoTools = [
    // ==============================================================
    // 1. GUSTILO-ANDERSON OPEN FRACTURE CLASSIFICATION
    // ==============================================================
    {
      id: "gustiloAnderson",
      cat: "ortho",
      type: "class",
      name: "Gustilo–Anderson Open Fracture Classification",
      desc: "Standard assessment of open fracture wound size, soft-tissue injury, and vascular compromise.",
      organ: "Bone / Soft Tissue / Vasculature",
      region: "Extremity Trauma",
      subject: "Orthopaedic Trauma / Open Fractures",
      keywords: ["gustilo", "anderson", "open fracture", "trauma", "infection", "periosteum", "debridement"],
      guidance: "1. Wound size should be evaluated definitively in the operating theater after surgical debridement.\n2. Initiate IV prophylactic antibiotics immediately (within 1–3 hours of injury) in the emergency room.\n3. Type I/II: 1st generation cephalosporin (Cefazolin). Type III: Add aminoglycoside (Gentamicin) for gram-negative coverage. Add Penicillin/Ampicillin for barnyard/soil contamination.",
      contraindications: "Final classification should not be established until operative exploration; superficial wound assessment in the ED often underestimates deep muscular or periosteal damage.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Prevention of infection in the treatment of one thousand and twenty-five open fractures of long bones",
          citation: "Gustilo RB, Anderson JT. J Bone Joint Surg Am. 1976;58(4):453-458.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/773941/" }
          ]
        },
        {
          type: "Validation & Refinement",
          icon: "📘",
          title: "The problems of open fractures of the femoral shaft: review of 115 consecutive cases",
          citation: "Gustilo RB, Mendoza RM, Williams DN. J Trauma. 1984;24(8):742-746.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/6471139/" }
          ]
        }
      ],
      fields: [
        makeS("type", "Wound characteristics & soft-tissue presentation", "I", [
          ["I", "Type I: Clean puncture < 1 cm, minimal contusion, clean"],
          ["II", "Type II: Laceration 1–10 cm, moderate soft-tissue damage, no flap or avulsion"],
          ["IIIA", "Type IIIA: Laceration > 10 cm, extensive soft-tissue injury, adequate periosteal coverage"],
          ["IIIB", "Type IIIB: Extensive soft-tissue loss with periosteal stripping, requires flap reconstruction"],
          ["IIIC", "Type IIIC: Open fracture associated with arterial injury requiring vascular repair"]
        ])
      ],
      table: {
        headers: ["Gustilo Type", "Wound & Soft Tissue", "Infection Rate", "Empiric Antibiotic Regimen"],
        rows: [
          { id: "typeI", cols: ["Type I", "< 1 cm; clean puncture; minimal contusion", "0% – 2%", "1st generation cephalosporin (Cefazolin 2g IV q8h)"] },
          { id: "typeII", cols: ["Type II", "1 – 10 cm; moderate muscle damage; no periosteal stripping", "2% – 7%", "1st generation cephalosporin (Cefazolin 2g IV q8h)"] },
          { id: "typeIIIA", cols: ["Type IIIA", "> 10 cm; high-energy; adequate bone coverage", "10% – 15%", "Cephalosporin + Aminoglycoside (Gentamicin 5 mg/kg IV daily)"] },
          { id: "typeIIIB", cols: ["Type IIIB", "Extensive loss; bone exposed; requires rotational/free flap", "15% – 30%", "Cephalosporin + Aminoglycoside; add Penicillin if barnyard contamination"] },
          { id: "typeIIIC", cols: ["Type IIIC", "Arterial injury requiring revascularization for salvage", "25% – 50%+", "Cephalosporin + Aminoglycoside; emergency vascular surgery consult stat"] }
        ]
      },
      calc: function (v) {
        var t = v.type;
        var match = "type" + t;
        var inf = t === "I" ? "0–2%" : t === "II" ? "2–7%" : t === "IIIA" ? "10–15%" : t === "IIIB" ? "15–30%" : ">25–50%";
        var abx = (t === "I" || t === "II")
          ? "Cefazolin 2g IV q8h (clindamycin or vancomycin if cephalosporin allergy)."
          : "Cefazolin 2g IV q8h + Gentamicin 5 mg/kg daily. Add Penicillin G/Ampicillin if organic/soil contamination suspected.";

        return {
          value: "Gustilo–Anderson Type " + t + " (Infection Risk: " + inf + ")",
          matchId: match,
          eq: "Clinical Protocol: " + abx + "\nPlan urgent operative debridement within 12–24 hours; verify tetanus immunization."
        };
      }
    },

    // ==============================================================
    // 2. TSCHERNE CLOSED FRACTURE SOFT-TISSUE CLASSIFICATION
    // ==============================================================
    {
      id: "tscherneOestern",
      cat: "ortho",
      type: "class",
      name: "Tscherne Classification (Closed Fractures)",
      desc: "Grades closed soft-tissue trauma and impending compartment syndrome to determine fixation timing.",
      organ: "Skin / Muscle / Soft Tissue",
      region: "Extremity Trauma",
      subject: "Orthopaedic Trauma / Soft Tissue",
      keywords: ["tscherne", "closed fracture", "soft tissue", "compartment", "blister", "degloving"],
      guidance: "1. Carefully inspect for closed degloving (Morel-Lavallée lesion), fracture blisters, and skin tenting.\n2. Grade 0–1: Favourable for primary internal fixation.\n3. Grade 2–3: High risk of wound breakdown and necrosis; delay definitive internal fixation and consider temporary spanning external fixator.",
      contraindications: "Fracture blisters and dermal contusions often evolve over 24–48 hours; repeat clinical evaluation frequently.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "A new classification of soft-tissue damage in open and closed fractures",
          citation: "Oestern HJ, Tscherne H. Unfallheilkunde. 1984;87(3):111-115.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/6720042/" }
          ]
        }
      ],
      fields: [
        makeS("grade", "Soft-Tissue Presentation", "0", [
          ["0", "Grade 0: Negligible soft-tissue injury (indirect violence, simple fracture pattern)"],
          ["1", "Grade 1: Superficial abrasion or contusion from within; mild-to-moderate fracture pattern"],
          ["2", "Grade 2: Deep contaminated abrasion, local skin/muscle contusion, impending compartment syndrome"],
          ["3", "Grade 3: Extensive skin contusion or crush, subcutaneous degloving, manifest compartment syndrome"]
        ])
      ],
      table: {
        headers: ["Tscherne Grade", "Soft Tissue Findings", "Wound Complication Risk", "Fixation Strategy"],
        rows: [
          { id: "g0", cols: ["Grade 0", "Minimal injury; no significant contusion", "Very low (< 2%)", "Standard primary internal fixation"] },
          { id: "g1", cols: ["Grade 1", "Superficial abrasion; mild contusion", "Low (~ 5%)", "Early internal fixation acceptable once skin wrinkles appear"] },
          { id: "g2", cols: ["Grade 2", "Deep abrasion; severe muscle contusion; tense swelling", "High (~ 15% – 25%)", "Delay definitive ORIF; consider temporary spanning external fixator"] },
          { id: "g3", cols: ["Grade 3", "Extensive degloving/crush; arterial injury; compartment syndrome", "Very High (> 35%)", "Emergent fasciotomy / spanning external fixator; strict delay of open surgery"] }
        ]
      },
      calc: function (v) {
        var g = v.grade;
        var match = "g" + g;
        var rec = +g >= 2
          ? "High wound complication risk. Delay definitive open reduction; consider temporary spanning external fixation until soft tissue envelope settles."
          : "Favourable soft tissues for standard surgical timing.";

        return {
          value: "Tscherne Closed Grade " + g,
          matchId: match,
          eq: "Clinical Recommendation: " + rec + "\nEvaluates contusions, abrasions, blistering, and compartment edema to prevent wound necrosis and infection."
        };
      }
    },

    // ==============================================================
    // 3. AO/OTA FRACTURE CLASSIFICATION REFERENCE
    // ==============================================================
    {
      id: "aoOtaRef",
      cat: "ortho",
      type: "class",
      name: "AO/OTA Fracture Classification Reference",
      desc: "Universal alphanumeric anatomical classification schema for long bone fractures.",
      organ: "Long Bones / Diaphysis / Metaphysis",
      region: "Appendicular Skeleton",
      subject: "Orthopaedic Trauma / Classification",
      keywords: ["ao", "ota", "fracture", "alphanumeric", "diaphysis", "articular"],
      guidance: "1. Identify the bone: 1 Humerus, 2 Radius/Ulna, 3 Femur, 4 Tibia/Fibula.\n2. Identify the segment: 1 Proximal, 2 Diaphyseal, 3 Distal (4 Malleolar for segment 4).\n3. Determine the fracture morphology: Type A (Simple/Extra-articular), Type B (Wedge/Partial articular), Type C (Multifragmentary/Complete articular).",
      contraindications: "Does not quantify associated soft-tissue compromise, open wounds, or host physiological status.",
      literature: [
        {
          type: "Official AO/OTA Compendium",
          icon: "📘",
          title: "Fracture and Dislocation Classification Compendium—2018",
          citation: "Meinberg EG, Agel J, Roberts CS, et al. J Orthop Trauma. 2018;32(Suppl 1):S1-S170.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/29256945/" },
            { text: "View DOI ↗", url: "https://doi.org/10.1097/BOT.0000000000001063", secondary: true }
          ]
        }
      ],
      fields: [
        makeS("bone", "Bone Segment", "32", [
          ["11", "11 — Humerus, proximal"],
          ["12", "12 — Humerus, diaphysis"],
          ["13", "13 — Humerus, distal"],
          ["21", "21 — Radius/Ulna, proximal"],
          ["22", "22 — Radius/Ulna, diaphysis"],
          ["23", "23 — Radius/Ulna, distal"],
          ["31", "31 — Femur, proximal"],
          ["32", "32 — Femur, diaphysis"],
          ["33", "33 — Femur, distal"],
          ["41", "41 — Tibia/Fibula, proximal"],
          ["42", "42 — Tibia/Fibula, diaphysis"],
          ["43", "43 — Tibia/Fibula, distal (pilon)"],
          ["44", "44 — Malleolar segment"]
        ]),
        makeS("type", "Fracture Morphology", "A", [
          ["A", "Type A — Simple (diaphyseal) / Extra-articular (periarticular)"],
          ["B", "Type B — Wedge (diaphyseal) / Partial articular (periarticular)"],
          ["C", "Type C — Multifragmentary (diaphyseal) / Complete articular (periarticular)"]
        ])
      ],
      table: {
        headers: ["AO/OTA Type", "Diaphyseal Definition", "Articular Definition", "Surgical Complexity"],
        rows: [
          { id: "typeA", cols: ["Type A", "Simple fracture (2 main fragments)", "Extra-articular (no joint involvement)", "Lowest complexity / High union rate"] },
          { id: "typeB", cols: ["Type B", "Wedge fracture (spiral or bending butterfly)", "Partial articular (part of joint attached to shaft)", "Intermediate complexity"] },
          { id: "typeC", cols: ["Type C", "Multifragmentary / Complex segmental", "Complete articular (joint dissociated from shaft)", "Highest surgical complexity / High complication rate"] }
        ]
      },
      calc: function (v) {
        var match = "type" + v.type;
        return {
          value: "AO/OTA Code: " + v.bone + "-" + v.type,
          matchId: match,
          eq: "AO/OTA Nomenclature: [Bone][Segment]-[Morphology]. Type A represents the simplest pattern; Type C represents complex articular or comminuted patterns."
        };
      }
    },

    // ==============================================================
    // 4. OTTAWA ANKLE RULES
    // ==============================================================
    {
      id: "ottawaAnkle",
      cat: "ortho",
      type: "class",
      name: "Ottawa Ankle Rules",
      desc: "Clinical decision algorithm to rule out malleolar and midfoot fractures without radiographs.",
      organ: "Ankle / Fibula / Tibia / Midfoot",
      region: "Lower Limb / Trauma",
      subject: "Emergency Orthopaedics / Ankle Trauma",
      keywords: ["ottawa", "ankle", "foot", "malleolus", "fracture", "xray", "triage", "navicular"],
      guidance: "1. Applies exclusively to acute blunt trauma within 48 hours.\n2. Palpate the entire distal 6 cm of the posterior edge and tip of both lateral and medial malleoli.\n3. Palpate the base of the 5th metatarsal and the navicular bone.\n4. Test weight bearing (patient must be able to take 4 steps, limping permitted).",
      contraindications: "Not applicable in patients <18 years of age, polytrauma, distracting painful injuries, intoxication, or altered mental status.",
      literature: [
        {
          type: "Seminal Multicenter Study",
          icon: "📄",
          title: "Use of radiography in acute ankle injuries: the Ottawa Ankle Rules",
          citation: "Stiell IG, Greenberg GH, McKnight RD, et al. JAMA. 1993;269(9):1127-1132.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/8437303/" }
          ]
        }
      ],
      fields: [
        makeS("postLat", "1. Bone tenderness at posterior edge or tip of lateral malleolus (distal 6 cm)", "0", [["0", "No tenderness"], ["1", "Tenderness present"]]),
        makeS("postMed", "2. Bone tenderness at posterior edge or tip of medial malleolus (distal 6 cm)", "0", [["0", "No tenderness"], ["1", "Tenderness present"]]),
        makeS("navicular", "3. Bone tenderness at navicular bone", "0", [["0", "No tenderness"], ["1", "Tenderness present"]]),
        makeS("base5", "4. Bone tenderness at base of 5th metatarsal", "0", [["0", "No tenderness"], ["1", "Tenderness present"]]),
        makeS("weight", "5. Inability to bear weight for 4 steps (both immediately and in ED)", "0", [["0", "Able to bear weight"], ["1", "Unable to bear weight (4 steps)"]])
      ],
      table: {
        headers: ["Imaging Recommendation", "Clinical Thresholds", "Sensitivity", "Clinical Action"],
        rows: [
          { id: "none", cols: ["No Radiographs Indicated", "No bony tenderness at malleolar/foot landmarks AND able to walk 4 steps", "> 98%", "Discharge with supportive brace / RICE protocol; reassess if pain persists > 5–7 days"] },
          { id: "ankle", cols: ["Ankle Radiograph Series", "Tenderness along posterior lateral or medial malleolus OR unable to walk 4 steps", "> 98%", "Obtain AP, lateral, and mortise ankle radiographs"] },
          { id: "foot", cols: ["Foot Radiograph Series", "Tenderness at navicular or base of 5th metatarsal OR unable to walk 4 steps", "> 98%", "Obtain AP, lateral, and oblique foot radiographs"] },
          { id: "both", cols: ["Ankle AND Foot Series", "Malleolar and midfoot tenderness criteria both satisfied", "> 98%", "Complete ankle and foot radiological series"] }
        ]
      },
      calc: function (v) {
        var ankleNeed = +v.postLat === 1 || +v.postMed === 1 || +v.weight === 1;
        var footNeed = +v.navicular === 1 || +v.base5 === 1 || +v.weight === 1;

        var match = "none", verdict = "No Radiographs Indicated", detail = "Fracture reliably excluded (>98% sensitivity). Treat symptomatically with RICE.";

        if (ankleNeed && footNeed) {
          match = "both";
          verdict = "Ankle AND Foot X-Ray Series Indicated";
          detail = "Meets criteria for both ankle (malleolar) and midfoot series.";
        } else if (ankleNeed) {
          match = "ankle";
          verdict = "Ankle X-Ray Series Indicated (AP, Lateral, Mortise)";
          detail = "Positive malleolar zone criteria or inability to bear weight.";
        } else if (footNeed) {
          match = "foot";
          verdict = "Foot X-Ray Series Indicated (AP, Lateral, Oblique)";
          detail = "Positive midfoot zone criteria (5th metatarsal or navicular tenderness).";
        }

        return {
          value: verdict,
          matchId: match,
          eq: detail
        };
      }
    },

    // ==============================================================
    // 5. OTTAWA KNEE RULE
    // ==============================================================
    {
      id: "ottawaKnee",
      cat: "ortho",
      type: "class",
      name: "Ottawa Knee Rule for Acute Knee Trauma",
      desc: "Clinical decision instrument determining the necessity of radiography in acute knee injuries.",
      organ: "Knee / Patella / Fibula",
      region: "Lower Extremity / Trauma",
      subject: "Emergency Orthopaedics / Knee Injuries",
      keywords: ["ottawa", "knee", "patella", "fibular head", "fracture", "xray", "trauma"],
      guidance: "1. Evaluates acute blunt knee trauma within 7 days.\n2. Test flexion to 90 degrees.\n3. Palpate patella and head of fibula independently.\n4. Assess ability to bear weight for 4 full steps in the emergency department.",
      contraindications: "Not validated in patients <18 years of age, isolated superficial lacerations, chronic degenerative conditions, or altered sensorium.",
      literature: [
        {
          type: "Seminal Multicenter Study",
          icon: "📄",
          title: "Derivation of a decision rule for the use of radiography in acute knee injuries",
          citation: "Stiell IG, Greenberg GH, Wells GA, et al. Ann Emerg Med. 1995;26(4):405-413.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/7574120/" }
          ]
        }
      ],
      fields: [
        makeN("age", "Patient Age (years)", 32, { min: 1, max: 110, step: 1 }),
        makeS("patella", "Isolated tenderness of the patella (no other bone tenderness)", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("fibHead", "Tenderness at the head of the fibula", "0", [["0", "No"], ["1", "Yes"]]),
        makeS("flexion", "Inability to flex knee to 90 degrees", "0", [["0", "Can flex to 90°"], ["1", "Cannot flex to 90°"]]),
        makeS("weight", "Inability to bear weight immediately AND for 4 steps in ED", "0", [["0", "Able to bear weight"], ["1", "Unable to take 4 steps"]])
      ],
      table: {
        headers: ["Rule Assessment", "Diagnostic Criteria", "Fracture Sensitivity", "Recommended Pathway"],
        rows: [
          { id: "cleared", cols: ["Negative (Rule Out)", "Age < 55, no patella/fibular tenderness, flexes to 90°, and able to walk 4 steps", "99% – 100%", "No knee radiographs needed; conservative symptomatic management"] },
          { id: "xray", cols: ["Positive (Imaging Needed)", "ANY criterion satisfied: Age ≥ 55, patella tenderness, fibula tenderness, flexion < 90°, or non-weightbearing", "99% – 100%", "Order standard AP and lateral knee radiographs"] }
        ]
      },
      calc: function (v) {
        var need = +v.age >= 55 || +v.patella === 1 || +v.fibHead === 1 || +v.flexion === 1 || +v.weight === 1;
        var match = need ? "xray" : "cleared";
        var verdict = need ? "Knee Radiographs Indicated" : "No Radiographs Required (Knee Cleared)";
        var note = need
          ? "Patient fulfills ≥1 Ottawa Knee Rule criterion. Perform AP and lateral knee radiographs."
          : "Ottawa Knee Rule negative: Sensitivity near 100% for ruling out clinically significant knee fracture.";

        return {
          value: verdict,
          matchId: match,
          eq: note
        };
      }
    },

    // ==============================================================
    // 6. COMPARTMENT SYNDROME PERFUSION GRADIENT (DELTA PRESSURE)
    // ==============================================================
    {
      id: "deltaPressure",
      cat: "ortho",
      type: "calc",
      name: "Compartment Perfusion Gradient (ΔP)",
      desc: "Calculates tissue perfusion gradient (Diastolic BP − Compartment Pressure) to guide emergent fasciotomy.",
      organ: "Muscle / Fascia / Vasculature",
      region: "Extremity / Compartment",
      subject: "Orthopaedic Trauma / Surgical Emergencies",
      keywords: ["compartment syndrome", "delta pressure", "fasciotomy", "diastolic", "intracompartmental", "ischemia"],
      guidance: "1. Use an electronic manometer or side-port needle system to measure compartment pressure (CP).\n2. Measure pressure in all compartments of the affected limb within 5 cm of the fracture zone.\n3. Obtain real-time non-invasive or arterial diastolic blood pressure (DBP).\n4. ΔP ≤ 30 mmHg signifies tissue hypoperfusion and muscle ischemia.",
      contraindications: "Clinical exam findings (pain out of proportion, pain on passive stretch, tense compartment) supersede pressure readings. If clinical signs are unequivocal, do not delay fasciotomy for pressure measurement.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "The role of compartment pressure measurement in the diagnosis of compartment syndrome",
          citation: "McQueen MM, Court-Brown CM. J Bone Joint Surg Br. 1996;78(1):99-104.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/8603612/" }
          ]
        }
      ],
      fields: [
        makeN("dbp", "Diastolic Blood Pressure (mmHg)", 75, { min: 20, max: 150, step: 1 }),
        makeN("cp", "Measured Compartment Pressure (mmHg)", 48, { min: 0, max: 120, step: 1 })
      ],
      table: {
        headers: ["Perfusion Gradient (ΔP)", "Tissue Oxygenation", "Ischemia Status", "Surgical Action"],
        rows: [
          { id: "normal", cols: ["> 30 mmHg", "Adequate microvascular perfusion", "Non-ischemic", "Serial examinations; repeat measurement if clinical deterioration occurs"] },
          { id: "critical", cols: ["≤ 30 mmHg", "Microvascular collapse; tissue hypoxia", "Critical Muscle Ischemia", "EMERGENT FASCIOTOMY: Complete decompression of all compartments"] }
        ]
      },
      calc: function (v) {
        var delta = +v.dbp - +v.cp;
        var match = delta <= 30 ? "critical" : "normal";
        var title = delta <= 30 ? "CRITICAL ISCHEMIA: Emergent Fasciotomy Indicated" : "Perfusion Preserved (ΔP > 30 mmHg)";
        var plan = delta <= 30
          ? "ΔP is " + delta + " mmHg (≤30 mmHg threshold). Decompress all compartments immediately to prevent irreversible myonecrosis and Volkmann ischemic contracture."
          : "ΔP is " + delta + " mmHg (>30 mmHg). Maintain close serial neurovascular monitoring and repeat pressure measurements as indicated.";

        return {
          value: "ΔP = " + delta + " mmHg (" + title + ")",
          matchId: match,
          eq: "Formula: ΔP = Diastolic BP (" + v.dbp + " mmHg) − Compartment Pressure (" + v.cp + " mmHg).\n" + plan
        };
      }
    },

    // ==============================================================
    // 7. GARDEN FEMORAL NECK FRACTURE CLASSIFICATION
    // ==============================================================
    {
      id: "gardenFemoralNeck",
      cat: "ortho",
      type: "class",
      name: "Garden Classification of Femoral Neck Fractures",
      desc: "Classifies intracapsular femoral neck fractures by trabecular alignment to predict avascular necrosis.",
      organ: "Femur / Hip Joint / Trabeculae",
      region: "Hip / Proximal Femur",
      subject: "Orthopaedic Trauma / Adult Reconstruction",
      keywords: ["garden", "femoral neck", "hip fracture", "valgus", "avascular necrosis", "hemiarthroplasty", "cannulated screws"],
      guidance: "1. Evaluate dedicated AP and lateral radiographs of the injured hip.\n2. Stages I and II are non-displaced; medial compressive trabeculae remain in contact.\n3. Stages III and IV are displaced; retinacular retinacular blood supply (lateral epiphyseal vessels) disrupted.\n4. Directs surgical choice between internal fixation vs arthroplasty in elderly patients.",
      contraindications: "Traction internal rotation views are required to reliably differentiate Stage I from Stage II fractures.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Low-angle fixation in fractures of the femoral neck",
          citation: "Garden RS. J Bone Joint Surg Br. 1961;43(4):647-663.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/13896859/" }
          ]
        }
      ],
      fields: [
        makeS("stage", "AP Hip Radiographic Trabecular Orientation", "I", [
          ["I", "Stage I: Incomplete / impacted in valgus; medial trabeculae angulated greenstick"],
          ["II", "Stage II: Complete non-displaced fracture; trabecular pattern aligned"],
          ["III", "Stage III: Complete partially displaced fracture; trabeculae out of line but in contact"],
          ["IV", "Stage IV: Completely displaced fracture; femoral head trabeculae aligned with acetabulum"]
        ])
      ],
      table: {
        headers: ["Garden Stage", "Trabecular Displacement", "Avascular Necrosis Risk", "Standard Treatment"],
        rows: [
          { id: "stageI", cols: ["Stage I", "Incomplete / Valgus impacted", "< 10%", "Percutaneous in situ fixation with 3 parallel cannulated screws"] },
          { id: "stageII", cols: ["Stage II", "Complete; non-displaced", "~ 10% – 15%", "Percutaneous in situ fixation with 3 parallel cannulated screws"] },
          { id: "stageIII", cols: ["Stage III", "Complete; partially displaced", "25% – 35%", "Young: urgent anatomical reduction + ORIF. Elderly: Hemiarthroplasty or THA"] },
          { id: "stageIV", cols: ["Stage IV", "Completely displaced; loss of contact", "35% – 50%+", "Elderly: Arthroplasty (Hemiarthroplasty / Total Hip Arthroplasty). Young: emergent closed/open reduction"] }
        ]
      },
      calc: function (v) {
        var s = v.stage;
        var match = "stage" + s;
        var isDisplaced = s === "III" || s === "IV";
        var plan = isDisplaced
          ? "Displaced Intracapsular Fracture. High risk of nonunion and osteonecrosis. In independent elderly patients, Total Hip Arthroplasty (THA) or Hemiarthroplasty is indicated. In young physiological patients, perform urgent anatomical reduction and rigid screw fixation."
          : "Non-Displaced / Stable Femoral Neck Fracture. Preserved medial calcar trabeculae. Standard management is closed reduction in situ with 3 parallel cannulated cancellous screws.";

        return {
          value: "Garden Stage " + s + " (" + (isDisplaced ? "Displaced Fracture" : "Non-Displaced Fracture") + ")",
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 8. PAUWELS CLASSIFICATION OF FEMORAL NECK FRACTURES
    // ==============================================================
    {
      id: "pauwelsAngle",
      cat: "ortho",
      type: "class",
      name: "Pauwels Classification of Femoral Neck Fractures",
      desc: "Biomechanical shear angle of femoral neck fracture line predicting non-union and varus collapse.",
      organ: "Femur / Femoral Neck",
      region: "Hip / Proximal Femur",
      subject: "Orthopaedic Trauma / Biomechanics",
      keywords: ["pauwels", "femoral neck", "shear", "biomechanics", "osteotomy", "varus"],
      guidance: "1. Measure angle between fracture line and horizontal line across the pelvis on non-rotated AP pelvis radiograph.\n2. Type I: < 30° (compressive forces dominate; highest union rate).\n3. Type II: 30°–50° (shear forces present).\n4. Type III: > 50° (high vertical shear forces; prone to varus collapse and nonunion).",
      contraindications: "Significant limb external rotation distorts angle measurement; traction internal rotation view is required.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Der Schenkelhalsbruch ein mechanisches Problem",
          citation: "Pauwels F. Stuttgart: Ferdinand Enke; 1935.",
          links: [
            { text: "View Book Reference ↗", url: "https://pubmed.ncbi.nlm.nih.gov/24982633/" }
          ]
        }
      ],
      fields: [
        makeN("angle", "Fracture Line Angle Relative to Horizontal Plane (°)", 48, { min: 10, max: 90, step: 1 })
      ],
      table: {
        headers: ["Pauwels Type", "Angle to Horizontal", "Biomechanical Stress", "Fixation Strategy"],
        rows: [
          { id: "typeI", cols: ["Type I", "< 30°", "Compressive forces promote healing", "Standard parallel cannulated cancellous screws"] },
          { id: "typeII", cols: ["Type II", "30° – 50°", "Moderate shear and compressive forces", "Cannulated screws with sliding hip screw (DHS)"] },
          { id: "typeIII", cols: ["Type III", "> 50°", "High vertical shear; varus collapse tendency", "Sliding hip screw with derotation screw, fixed-angle plate, or valgus osteotomy"] }
        ]
      },
      calc: function (v) {
        var a = +v.angle;
        var match = "typeI", label = "Type I (<30°)", rec = "Dominant compressive forces. Highly favourable union rate with 3 parallel cannulated screws.";

        if (a > 50) {
          match = "typeIII";
          label = "Type III (>50°)";
          rec = "High vertical shear forces. High risk of nonunion and secondary varus displacement. Consider fixed-angle dynamic hip screw (DHS) or valgus intertrochanteric osteotomy to convert shear into compression.";
        } else if (a >= 30) {
          match = "typeII";
          label = "Type II (30°–50°)";
          rec = "Moderate shear forces. Stable construct required (DHS or locked plating).";
        }

        return {
          value: "Pauwels " + label + " (" + a + "°)",
          matchId: match,
          eq: rec
        };
      }
    },

    // ==============================================================
    // 9. PIPKIN CLASSIFICATION OF FEMORAL HEAD FRACTURES
    // ==============================================================
    {
      id: "pipkinFemoralHead",
      cat: "ortho",
      type: "class",
      name: "Pipkin Classification (Femoral Head Fractures)",
      desc: "Classifies femoral head fractures associated with posterior hip dislocations.",
      organ: "Femur / Femoral Head / Acetabulum",
      region: "Hip Joint",
      subject: "Orthopaedic Trauma / Hip Dislocations",
      keywords: ["pipkin", "femoral head", "hip dislocation", "infrafoveal", "suprafoveal", "avascular necrosis"],
      guidance: "1. Confirm post-reduction congruency on AP pelvis and dedicated Judet acetabular views.\n2. Obtain pelvic CT to evaluate fragment size, intra-articular loose bodies, and associated neck fractures.\n3. Type I: Below fovea (infrafoveal, non-weightbearing).\n4. Type II: Above fovea (suprafoveal, weightbearing).\n5. Type III: Type I or II with femoral neck fracture (extreme AVN risk).\n6. Type IV: Type I or II with acetabular wall fracture.",
      contraindications: "Perform emergent closed reduction of the dislocated hip within 6 hours before definitive surgical planning to prevent femoral head osteonecrosis.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Treatment of grade IV fracture-dislocation of the hip: a review",
          citation: "Pipkin G. J Bone Joint Surg Am. 1957;39-A(5):1027-1042.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/13475403/" }
          ]
        }
      ],
      fields: [
        makeS("type", "Fracture location and associated fractures", "I", [
          ["I", "Type I: Fracture below fovea capitis femoris (infrafoveal, non-weightbearing)"],
          ["II", "Type II: Fracture above fovea capitis femoris (suprafoveal, weightbearing dome)"],
          ["III", "Type III: Type I or II fracture associated with a femoral neck fracture"],
          ["IV", "Type IV: Type I or II fracture associated with an acetabular fracture (typically posterior wall)"]
        ])
      ],
      table: {
        headers: ["Pipkin Type", "Anatomical Location", "Avascular Necrosis Risk", "Surgical Management"],
        rows: [
          { id: "typeI", cols: ["Type I", "Infrafoveal (non-weightbearing dome)", "Low (~ 10%)", "Non-operative if anatomical; excise small fragments (<1/3 surface) or screw fixation"] },
          { id: "typeII", cols: ["Type II", "Suprafoveal (weightbearing articular dome)", "Moderate (15% – 25%)", "Anatomical open reduction and internal fixation with countersunk headless screws"] },
          { id: "typeIII", cols: ["Type III", "Femoral head + Femoral neck fracture", "Extremely High (> 50%)", "Young: urgent anatomical reduction + ORIF. Elderly: Primary Total Hip Arthroplasty"] },
          { id: "typeIV", cols: ["Type IV", "Femoral head + Acetabular fracture", "High (~ 30% – 40%)", "Rigid anatomical stabilization of both femoral head and acetabular column/wall"] }
        ]
      },
      calc: function (v) {
        var t = v.type;
        var match = "type" + t;
        var plan = t === "I"
          ? "Infrafoveal fracture. Excision of small fragment if <1/3 surface; internal fixation if large fragment."
          : t === "II"
          ? "Suprafoveal weightbearing fracture. Rigid anatomical internal fixation with countersunk headless compression screws."
          : t === "III"
          ? "Type III fracture. Catastrophic risk of osteonecrosis. In older patients, primary Total Hip Arthroplasty is preferred. In young patients, emergency reduction and internal fixation."
          : "Type IV fracture. Requires dual approach or surgical hip dislocation to reconstruct both the femoral head and acetabulum.";

        return {
          value: "Pipkin Type " + t + " Femoral Head Fracture",
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 10. SCHATZKER TIBIAL PLATEAU CLASSIFICATION
    // ==============================================================
    {
      id: "schatzkerTibialPlateau",
      cat: "ortho",
      type: "class",
      name: "Schatzker Tibial Plateau Classification",
      desc: "Categorizes unicondylar and bicondylar tibial plateau fractures to guide surgical approach.",
      organ: "Proximal Tibia / Knee Joint",
      region: "Knee / Lower Extremity",
      subject: "Orthopaedic Trauma / Joint Fractures",
      keywords: ["schatzker", "tibial plateau", "knee fracture", "lateral plateau", "bicondylar", "subchondral"],
      guidance: "1. Evaluate plain radiographs (AP, lateral, 40° oblique views) and non-contrast CT with 3D reconstructions.\n2. Types I–III: Lateral plateau injuries (lower energy).\n3. Type IV: Medial plateau injury (high energy, associated with cruciate/collateral ligament tears and peroneal nerve injury).\n4. Types V–VI: Bicondylar patterns and metaphyseal-diaphyseal dissociation (high risk of compartment syndrome).",
      contraindications: "Coronal plane shear fractures (posterior column) are not adequately captured by the original 2D Schatzker classification; correlate with 3-column CT classification.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "The tibial plateau fracture. The Toronto experience 1968--1975",
          citation: "Schatzker J, McBroom R, Bruce D. Clin Orthop Relat Res. 1979;(138):94-104.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/436302/" }
          ]
        }
      ],
      fields: [
        makeS("type", "Fracture pattern and anatomical location", "II", [
          ["I", "Type I: Pure split of the lateral tibial plateau (wedge fracture, <4 mm depression)"],
          ["II", "Type II: Split-depression of the lateral plateau (wedge split with depressed articular fragments)"],
          ["III", "Type III: Pure central depression of the lateral plateau (no cortical split)"],
          ["IV", "Type IV: Medial tibial plateau fracture (involves medial condyle ± intercondylar eminence)"],
          ["V", "Type V: Bicondylar tibial plateau fracture (both condyles fractured, continuous metaphysis)"],
          ["VI", "Type VI: Tibial plateau fracture with metaphyseal-diaphyseal dissociation"]
        ])
      ],
      table: {
        headers: ["Schatzker Type", "Fracture Pattern", "Energy Level", "Surgical Strategy"],
        rows: [
          { id: "typeI", cols: ["Type I", "Lateral wedge split without depression", "Low / Moderate (young bone)", "Anatomical reduction, cancellous lag screws with lateral buttress plate"] },
          { id: "typeII", cols: ["Type II", "Lateral split-depression", "Moderate", "Elevate articular surface, bone graft/substitute, lateral locking plate"] },
          { id: "typeIII", cols: ["Type III", "Central lateral depression without split", "Low (osteoporotic bone)", "Cortical window elevation, subchondral bone graft, raft screws/plate"] },
          { id: "typeIV", cols: ["Type IV", "Medial plateau fracture", "High Energy (shear)", "Medial buttress plate; rule out peroneal nerve & popliteal artery injuries"] },
          { id: "typeV", cols: ["Type V", "Bicondylar fracture", "High Energy", "Spanning external fixator initially, followed by dual-column plating"] },
          { id: "typeVI", cols: ["Type VI", "Metaphyseal-diaphyseal dissociation", "Very High Energy", "Staged protocol: spanning external fixator, delayed definitive dual plating"] }
        ]
      },
      calc: function (v) {
        var t = v.type;
        var match = "type" + t;
        var desc = (t === "I" || t === "II" || t === "III")
          ? "Low-to-moderate energy lateral plateau injury. Surgical goal: anatomical reduction of joint surface and rigid lateral buttress plating."
          : "High-energy tibial plateau injury. High risk of severe soft-tissue envelope compromise and acute compartment syndrome. Staged spanning external fixation typically required prior to open reconstruction.";

        return {
          value: "Schatzker Type " + t + " Tibial Plateau Fracture",
          matchId: match,
          eq: desc
        };
      }
    },

    // ==============================================================
    // 11. WEBER ANKLE FRACTURE CLASSIFICATION
    // ==============================================================
    {
      id: "weberAnkle",
      cat: "ortho",
      type: "class",
      name: "Danis–Weber Ankle Fracture Classification",
      desc: "Categorizes fibular fractures relative to the distal tibiofibular syndesmosis.",
      organ: "Fibula / Tibia / Syndesmosis",
      region: "Ankle Joint",
      subject: "Orthopaedic Trauma / Foot & Ankle",
      keywords: ["weber", "ankle fracture", "fibula", "syndesmosis", "mortise", "bimalleolar"],
      guidance: "1. Evaluate mortise, AP, and lateral ankle radiographs.\n2. Identify fibular fracture level relative to the tibial plafond (syndesmosis level).\n3. Assess medial clear space on mortise view (normal ≤ 4 mm).\n4. Widening of the medial clear space indicates deltoid ligament rupture (bimalleolar equivalent).",
      contraindications: "A high proximal fibular fracture (Maisonneuve fracture) can be missed if full-length tibia/fibula radiographs are not obtained in unexplained medial clear space widening.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "The operative treatment of ankle fractures",
          citation: "Weber BG. In: Die Verletzungen des oberen Sprunggelenkes. Bern: Verlag Hans Huber; 1972.",
          links: [
            { text: "View Book Reference ↗", url: "https://pubmed.ncbi.nlm.nih.gov/4678120/" }
          ]
        }
      ],
      fields: [
        makeS("type", "Fibula fracture level relative to ankle joint line", "B", [
          ["A", "Weber A: Infrasyndesmotic (below the syndesmosis; transverse avulsion)"],
          ["B", "Weber B: Trans-syndesmotic (spiral/oblique fracture starting at joint line)"],
          ["C", "Weber C: Suprasyndesmotic (above the syndesmosis; syndesmotic rupture)"]
        ]),
        makeS("medial", "Associated medial clear space widening (>4 mm) or medial malleolar fracture?", "0", [
          ["0", "No (Medial side intact)"],
          ["1", "Yes (Medial malleolar fracture or deltoid ligament rupture)"]
        ])
      ],
      table: {
        headers: ["Weber Type", "Anatomical Level", "Syndesmosis Status", "Standard Management"],
        rows: [
          { id: "weberA", cols: ["Weber A", "Below syndesmosis", "Intact", "Stable; conservative immobilization in walking boot / cast (unless medial malleolus displaced)"] },
          { id: "weberB", cols: ["Weber B", "At the level of syndesmosis", "Variable (partially torn)", "If medial side intact: weight-bearing boot. If medial clear space >4 mm: ORIF"] },
          { id: "weberC", cols: ["Weber C", "Above syndesmosis", "Disrupted / Torn", "Unstable; ORIF of fibula + syndesmotic screw or suture-button fixation"] }
        ]
      },
      calc: function (v) {
        var t = v.type;
        var hasMedial = v.medial === "1";
        var match = "weber" + t;
        var stable = t === "A" && !hasMedial;
        var unstable = t === "C" || hasMedial;

        var rec = "";
        if (t === "C") {
          rec = "Unstable Weber C fracture. Syndesmosis is torn. Operative reduction and internal fixation (ORIF) of the fibula and intraoperative stress testing of the syndesmosis required.";
        } else if (t === "B") {
          rec = hasMedial
            ? "Unstable Weber B fracture (Bimalleolar or Bimalleolar-equivalent with medial clear space widening). Operative fixation (ORIF) recommended."
            : "Stable isolated Weber B fracture. Intact deltoid ligament. Non-operative management with weight-bearing functional orthosis or short-leg cast.";
        } else {
          rec = "Stable Weber A fracture. Syndesmosis and deltoid ligament intact. Conservative treatment with protected weight-bearing.";
        }

        return {
          value: "Danis–Weber Type " + t + " (" + (unstable ? "Unstable" : "Stable") + ")",
          matchId: match,
          eq: rec
        };
      }
    },

    // ==============================================================
    // 12. SALTER-HARRIS PHYSEAL FRACTURE CLASSIFICATION
    // ==============================================================
    {
      id: "salterHarris",
      cat: "ortho",
      type: "class",
      name: "Salter–Harris Physeal Fracture Classification",
      desc: "Pediatric growth plate fractures categorized by fracture plane relative to the physis.",
      organ: "Physis / Growth Plate / Pediatric Bone",
      region: "Pediatric Orthopaedics / Growth Plate",
      subject: "Pediatric Trauma / Physeal Injuries",
      keywords: ["salter", "harris", "physis", "growth plate", "pediatric", "thurston holland", "growth arrest"],
      guidance: "1. Type I: Slipped (through physis only).\n2. Type II: Above (physis into metaphysis with Thurston-Holland fragment; most common ~75%).\n3. Type III: Lower (physis into epiphysis; intra-articular).\n4. Type IV: Through (metaphysis, physis, and epiphysis; intra-articular).\n5. Type V: Rammed (crush injury to physis).",
      contraindications: "Initial radiographs in Type I and Type V injuries may appear normal; maintain a high index of suspicion in focal physeal tenderness.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Injuries involving the epiphyseal plate",
          citation: "Salter RB, Harris WR. J Bone Joint Surg Am. 1963;45(3):587-622.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/14022837/" }
          ]
        }
      ],
      fields: [
        makeS("type", "Fracture plane relative to growth plate", "II", [
          ["I", "Type I (Slipped): Transverse separation through the hypertrophic zone of the physis only"],
          ["II", "Type II (Above): Through physis exiting into the metaphysis (Thurston-Holland fragment)"],
          ["III", "Type III (Lower): Through physis extending into the epiphysis (intra-articular)"],
          ["IV", "Type IV (Through): Vertical shear traversing metaphysis, physis, and epiphysis"],
          ["V", "Type V (Rammed): Axial compressive crush injury destroying the physis"]
        ])
      ],
      table: {
        headers: ["Salter Type", "Mnemonic (SALTR)", "Physeal Zone", "Growth Arrest Risk"],
        rows: [
          { id: "typeI", cols: ["Type I", "S = Slipped", "Hypertrophic zone", "Low risk; closed reduction and splinting"] },
          { id: "typeII", cols: ["Type II", "A = Above (Metaphysis)", "Physis + Metaphysis", "Low risk (~ 5%); closed reduction usually successful"] },
          { id: "typeIII", cols: ["Type III", "L = Lower (Epiphysis)", "Physis + Epiphysis (Intra-articular)", "Moderate risk; requires anatomical reduction (ORIF if >2 mm step)"] },
          { id: "typeIV", cols: ["Type IV", "T = Through all 3", "Metaphysis + Physis + Epiphysis", "High risk of physeal bar formation; anatomical ORIF mandatory"] },
          { id: "typeV", cols: ["Type V", "R = Rammed (Crush)", "Germinal / Reserve zone crushed", "Severe risk (~ 100% partial/complete growth arrest and angular deformity)"] }
        ]
      },
      calc: function (v) {
        var t = v.type;
        var match = "type" + t;
        var risk = (t === "I" || t === "II")
          ? "Good prognosis for normal growth following closed reduction. Preserve periosteal hinge; avoid repetitive forceful reduction maneuvers."
          : "High risk of partial growth arrest, physeal bony bar formation, and angular limb deformity. Anatomical reduction with smooth percutaneous pins or non-physeal crossing screws required.";

        return {
          value: "Salter–Harris Type " + t + " (" + (t === "I" || t === "II" ? "Low Growth Risk" : "High Growth Risk") + ")",
          matchId: match,
          eq: "Mnemonic SALTR: I = Slipped, II = Above, III = Lower, IV = Through, V = Rammed.\n" + risk
        };
      }
    },

    // ==============================================================
    // 13. TILE PELVIC RING INJURY CLASSIFICATION
    // ==============================================================
    {
      id: "tilePelvis",
      cat: "ortho",
      type: "class",
      name: "Tile Classification of Pelvic Ring Fractures",
      desc: "Categorizes pelvic ring disruption based on the integrity of the posterior sacroiliac complex.",
      organ: "Pelvis / Sacrum / Sacroiliac Joint",
      region: "Pelvis / Polytrauma",
      subject: "Orthopaedic Trauma / Pelvic Disruption",
      keywords: ["tile", "pelvis", "pelvic ring", "open book", "vertical shear", "sacroiliac", "shock"],
      guidance: "1. Evaluate AP pelvis, inlet (45° caudal), and outlet (45° cephalic) views + CT scan.\n2. Tile A: Stable (posterior arch intact; e.g., avulsion, isolated pubic ramus).\n3. Tile B: Rotationally unstable, vertically stable (e.g., open-book, lateral compression).\n4. Tile C: Rotationally and vertically unstable (complete posterior sacroiliac disruption).",
      contraindications: "Avoid repetitive manual pelvic springing / compression tests in unstable pelvic trauma; can disrupt nascent retroperitoneal blood clots.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Pelvic ring fractures: should they be fixed?",
          citation: "Tile M. J Bone Joint Surg Br. 1988;70(1):1-12.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/3276697/" }
          ]
        }
      ],
      fields: [
        makeS("type", "Pelvic Ring Stability and Posterior Arch Status", "A", [
          ["A", "Tile Type A: Stable (Posterior sacroiliac arch completely intact; isolated rami / avulsions)"],
          ["B", "Tile Type B: Rotationally unstable, vertically stable (Open-book or lateral compression)"],
          ["C", "Tile Type C: Rotationally AND vertically unstable (Complete disruption of posterior SI complex)"]
        ])
      ],
      table: {
        headers: ["Tile Type", "Posterior Arch Status", "Vector Force", "Initial Emergency Management"],
        rows: [
          { id: "typeA", cols: ["Tile A", "Intact", "Low-energy direct blow", "Conservative; protected weight-bearing as tolerated"] },
          { id: "typeB", cols: ["Tile B", "Incompletely disrupted", "AP compression (Open-book) or lateral compression", "Apply commercial pelvic binder or sheet at greater trochanters; anterior external or internal fixation"] },
          { id: "typeC", cols: ["Tile C", "Completely disrupted", "Vertical shear / high-velocity trauma", "CRITICAL: Emergent pelvic binder/C-clamp, pelvic preperitoneal packing, massive transfusion protocol"] }
        ]
      },
      calc: function (v) {
        var t = v.type;
        var match = "type" + t;
        var plan = t === "A"
          ? "Stable pelvic fracture. Intact posterior sacroiliac complex. Mobilization with weight-bearing as tolerated."
          : t === "B"
          ? "Rotationally unstable pelvic fracture. Apply pelvic binder at the level of the greater trochanters to reduce pelvic volume. Internal or external fixation indicated."
          : "Vertically unstable pelvic fracture. Extreme risk of life-threatening retroperitoneal hemorrhage. Emergent resuscitation, pelvic binder/C-clamp, pelvic packing, and surgical reconstruction.";

        return {
          value: "Tile Type " + t + " Pelvic Disruption",
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 14. ANKLE-BRACHIAL INDEX (ABI) IN EXTREMITY TRAUMA
    // ==============================================================
    {
      id: "abiCalc",
      cat: "ortho",
      type: "calc",
      name: "Ankle–Brachial Index (ABI) in Extremity Trauma",
      desc: "Screens for occult arterial injury in limb trauma and knee dislocations.",
      organ: "Popliteal Artery / Tibial Arteries / Peripheral Vasculature",
      region: "Lower Extremity / Trauma",
      subject: "Orthopaedic Trauma / Vascular Complications",
      keywords: ["abi", "ankle brachial index", "arterial injury", "knee dislocation", "popliteal artery", "doppler"],
      guidance: "1. Measure highest systolic blood pressure in the uninjured brachial artery using a Doppler probe.\n2. Measure highest systolic pressure in the dorsalis pedis (DP) and posterior tibial (PT) arteries of the injured extremity.\n3. Calculate ABI = Injured Ankle SBP ÷ Brachial SBP.\n4. An ABI < 0.90 has >95% sensitivity for significant arterial disruption.",
      contraindications: "Heavily calcified, incompressible vessels (Mönckeberg sclerosis) in diabetic or ESRD patients produce falsely elevated ABI readings (>1.30).",
      literature: [
        {
          type: "Seminal Multicenter Study",
          icon: "📄",
          title: "The ankle-brachial index is a useful tool for evaluating vascular injury in knee dislocations",
          citation: "Mills WJ, Barei DP, Pham P. J Trauma. 2004;56(6):1261-1265.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/15211135/" }
          ]
        }
      ],
      fields: [
        makeN("ankleSbp", "Highest Systolic Pressure in Injured Ankle (DP or PT, mmHg)", 115, { min: 20, max: 250, step: 1 }),
        makeN("armSbp", "Highest Brachial Systolic Pressure (mmHg)", 125, { min: 50, max: 250, step: 1 })
      ],
      table: {
        headers: ["ABI Range", "Perfusion Status", "Arterial Injury Probability", "Recommended Action"],
        rows: [
          { id: "normal", cols: ["≥ 0.90", "Normal extremity perfusion", "Arterial injury ruled out (> 99% NPV)", "Serial clinical pulse examinations for 24 hours"] },
          { id: "abnormal", cols: ["< 0.90", "Arterial flow compromised", "High risk of major arterial injury", "EMERGENCY: Urgent CT Angiography and immediate vascular surgery consultation"] }
        ]
      },
      calc: function (v) {
        var abi = (+v.ankleSbp / +v.armSbp);
        var match = abi < 0.90 ? "abnormal" : "normal";
        var verdict = abi < 0.90 ? "ABNORMAL (ABI < 0.90)" : "Normal Perfusion (ABI ≥ 0.90)";
        var action = abi < 0.90
          ? "Critical arterial compromise suspected. Perform immediate CT Angiography (CTA) or on-table angiography and request urgent vascular surgical exploration."
          : "Normal arterial hemodynamics. Reassure and maintain serial distal pulse examinations.";

        return {
          value: "ABI: " + abi.toFixed(2) + " (" + verdict + ")",
          matchId: match,
          eq: "Calculation: " + v.ankleSbp + " mmHg (Ankle) ÷ " + v.armSbp + " mmHg (Brachial) = " + abi.toFixed(2) + ".\n" + action
        };
      }
    },

    // ==============================================================
    // 15. MANGLED EXTREMITY SEVERITY SCORE (MESS)
    // ==============================================================
    {
      id: "messScore",
      cat: "ortho",
      type: "class",
      name: "Mangled Extremity Severity Score (MESS)",
      desc: "Scores skeletal injury, ischemia, shock, and age to predict limb salvage versus primary amputation.",
      organ: "Limb / Bone / Vasculature / Peripheral Nerve",
      region: "Lower Limb / Severe Trauma",
      subject: "Orthopaedic Trauma / Limb Salvage",
      keywords: ["mess", "mangled", "salvage", "amputation", "limb ischemia", "blast injury", "gustilo"],
      guidance: "1. Skeletal/Soft-Tissue: Low energy = 1, Medium energy = 2, High energy = 3, Massive crush = 4.\n2. Limb Ischemia: Reduced pulse = 1, Absent pulse = 2, Cold/insensate/paralyzed = 3. Double points if ischemia > 6 hours.\n3. Shock: SBP > 90 mmHg = 0, Transient hypotension = 1, Persistent shock = 2.\n4. Age: < 30 = 0, 30–49 = 1, ≥ 50 = 2.",
      contraindications: "MESS is a decision-support aid, not an absolute indicator. Modern microsurgical limb reconstruction allows salvage in select cases with scores ≥7.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "The Mangled Extremity Severity Score: a primary guide to salvage or amputation",
          citation: "Johansen K, Daines M, Howey T, et al. J Trauma. 1990;30(5):568-572.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/2342140/" }
          ]
        }
      ],
      fields: [
        makeS("skeletal", "1. Skeletal and Soft-Tissue Energy", "1", [
          ["1", "Low energy: Simple closed fracture, low-velocity gunshot, stab (+1 pt)"],
          ["2", "Medium energy: Open or multiple fractures, dislocation, moderate crush (+2 pts)"],
          ["3", "High energy: Close-range shotgun, high-velocity military, severe crush (+3 pts)"],
          ["4", "Massive crush / severe avulsion / extensive contamination (+4 pts)"]
        ]),
        makeS("ischemia", "2. Limb Ischemia Severity", "1", [
          ["1", "Pulse reduced or absent, but normal capillary refill, no tissue ischemia (+1 pt)"],
          ["2", "Pulseless, paresthesias, diminished capillary refill (+2 pts)"],
          ["3", "Cool, paralyzed, insensate, no capillary refill (+3 pts)"]
        ]),
        makeS("ischemiaTime", "Ischemia duration > 6 hours?", "0", [
          ["0", "No (≤ 6 hours)"],
          ["1", "Yes (> 6 hours: Double the ischemia points)"]
        ]),
        makeS("shock", "3. Systemic Hypotension / Shock", "0", [
          ["0", "Normotensive: Systolic BP consistently > 90 mmHg (0 pts)"],
          ["1", "Transient hypotension responsive to IV fluids (+1 pt)"],
          ["2", "Persistent hypotension refractory to fluids (+2 pts)"]
        ]),
        makeS("age", "4. Patient Age", "0", [
          ["0", "< 30 years (0 pts)"],
          ["1", "30 to 49 years (+1 pt)"],
          ["2", "≥ 50 years (+2 pts)"]
        ])
      ],
      table: {
        headers: ["MESS Total Score", "Clinical Prediction", "Limb Salvage Feasibility", "Recommended Strategy"],
        rows: [
          { id: "salvage", cols: ["Score < 7", "Limb Salvage Supported", "High success rate of functional salvage", "Aggressive debridement, skeletal stabilization, and vascular reconstruction"] },
          { id: "amputation", cols: ["Score ≥ 7", "High Amputation Risk", "High morbidity/mortality with attempted salvage", "Early primary amputation indicated (or multidisciplinary trauma salvage consensus)"] }
        ]
      },
      calc: function (v) {
        var baseIsch = +v.ischemia;
        var ischPoints = v.ischemiaTime === "1" ? baseIsch * 2 : baseIsch;
        var total = +v.skeletal + ischPoints + +v.shock + +v.age;

        var isAmp = total >= 7;
        var match = isAmp ? "amputation" : "salvage";
        var plan = isAmp
          ? "Score ≥ 7 points: Strongly correlates with limb loss and failed salvage. Primary amputation should be considered to reduce secondary systemic sepsis and mortality."
          : "Score < 7 points: Favourable for limb salvage. Proceed with emergent revascularization, debridement, and skeletal stabilization.";

        return {
          value: "MESS Score: " + total + " Points (" + (isAmp ? "Amputation Predicted" : "Salvage Supported") + ")",
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 16. NEXUS CERVICAL SPINE CRITERIA
    // ==============================================================
    {
      id: "nexusSpine",
      cat: "ortho",
      type: "class",
      name: "NEXUS Cervical Spine Criteria",
      desc: "Low-risk clinical decision rule to safely clear the cervical spine without radiography in blunt trauma.",
      organ: "Cervical Spine / Spinal Cord",
      region: "Spine / Trauma",
      subject: "Spine Surgery / Emergency Trauma",
      keywords: ["nexus", "cervical spine", "c-spine", "trauma", "clearance", "xray", "ct"],
      guidance: "1. Patient must satisfy ALL 5 low-risk criteria to be cleared clinically without imaging.\n2. Criteria: No posterior midline tenderness, No focal neurologic deficit, Normal alertness, No intoxication, No painful distracting injury.\n3. If any single criterion is positive, obtain non-contrast CT of the cervical spine.",
      contraindications: "Does not apply to penetrating neck trauma or delayed presentations (>48 hours post-injury).",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Validity of a set of clinical criteria to rule out injury to the cervical spine in patients with blunt trauma",
          citation: "Hoffman JR, Mower WR, Wolfson AB, et al. N Engl J Med. 2000;343(2):94-99.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/10891516/" }
          ]
        }
      ],
      fields: [
        makeS("midline", "1. Focal midline cervical spine tenderness", "0", [["0", "No tenderness"], ["1", "Tenderness present"]]),
        makeS("neuro", "2. Focal neurological deficit", "0", [["0", "No deficit"], ["1", "Deficit present"]]),
        makeS("alert", "3. Normal alertness (GCS 15, oriented to person, place, time)", "1", [["1", "Normal alertness"], ["0", "Altered mental status / GCS < 15"]]),
        makeS("intox", "4. Evidence of intoxication (alcohol, drugs)", "0", [["0", "No intoxication"], ["1", "Intoxicated"]]),
        makeS("distracting", "5. Painful distracting injury (e.g., long bone fracture, severe burn)", "0", [["0", "None"], ["1", "Distracting injury present"]])
      ],
      table: {
        headers: ["NEXUS Status", "Criteria Assessment", "Sensitivity for Fracture", "Clinical Action"],
        rows: [
          { id: "cleared", cols: ["NEXUS Cleared", "ALL 5 low-risk criteria met", "> 99%", "Cervical collar may be safely removed; no radiographic imaging required"] },
          { id: "imaging", cols: ["NEXUS Failed", "ANY criterion violated", "> 99%", "Maintain strict cervical collar immobilization; obtain CT cervical spine"] }
        ]
      },
      calc: function (v) {
        var cleared = +v.midline === 0 && +v.neuro === 0 && +v.alert === 1 && +v.intox === 0 && +v.distracting === 0;
        var match = cleared ? "cleared" : "imaging";
        var verdict = cleared ? "NEXUS CLEARED: No C-Spine Imaging Required" : "NEXUS FAILED: C-Spine CT Indicated";
        var note = cleared
          ? "All 5 criteria met. Patient can be cleared clinically without radiographs (>99% sensitivity for cervical spine injury)."
          : "≥1 NEXUS criterion failed. Maintain cervical collar and perform helical CT of the cervical spine from occiput to T1.";

        return {
          value: verdict,
          matchId: match,
          eq: note
        };
      }
    },

    // ==============================================================
    // 17. KELLGREN-LAWRENCE OSTEOARTHRITIS GRADING
    // ==============================================================
    {
      id: "kellgrenLawrence",
      cat: "ortho",
      type: "class",
      name: "Kellgren–Lawrence Osteoarthritis Grading System",
      desc: "Radiographic staging system for osteophyte formation and joint space narrowing in osteoarthritis.",
      organ: "Knee / Hip / Articular Cartilage",
      region: "Joints / Musculoskeletal",
      subject: "Adult Reconstruction / Joint Arthrosis",
      keywords: ["kellgren", "lawrence", "osteoarthritis", "joint space", "osteophyte", "subchondral", "arthroplasty"],
      guidance: "1. Perform weight-bearing anteroposterior (AP) and 45° flexion posteroanterior (Rosenberg view) knee radiographs.\n2. Grade 0: No osteoarthritic changes.\n3. Grade 1: Doubtful joint space narrowing (JSN) with possible osteophytic lipping.\n4. Grade 2: Definite marginal osteophytes with unimpaired joint space.\n5. Grade 3: Moderate multiple osteophytes, definite JSN, some subchondral sclerosis.\n6. Grade 4: Large osteophytes, marked JSN, severe sclerosis, and bone contour deformity.",
      contraindications: "Non-weight-bearing radiographs underestimate joint space narrowing by up to 50%; always assess standing views.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "Radiological assessment of osteo-arthrosis",
          citation: "Kellgren JH, Lawrence JS. Ann Rheum Dis. 1957;16(4):494-502.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/13498604/" }
          ]
        }
      ],
      fields: [
        makeS("grade", "Radiographic Joint Findings", "2", [
          ["0", "Grade 0: None (No osteophytes or joint space narrowing)"],
          ["1", "Grade 1: Doubtful (Minute osteophyte, doubtful joint space narrowing)"],
          ["2", "Grade 2: Minimal (Definite osteophytes, preserved or doubtful joint space narrowing)"],
          ["3", "Grade 3: Moderate (Moderate osteophytes, definite narrowing, some subchondral sclerosis)"],
          ["4", "Grade 4: Severe (Large osteophytes, severe narrowing, sclerosis, bone deformity)"]
        ])
      ],
      table: {
        headers: ["K-L Grade", "Osteophytes", "Joint Space Narrowing (JSN)", "Clinical Pathway"],
        rows: [
          { id: "grade0", cols: ["Grade 0", "None", "None", "Normal joint; investigate soft tissue / periarticular etiologies"] },
          { id: "grade1", cols: ["Grade 1", "Possible / minute", "Doubtful", "Physical therapy, quadriceps strengthening, weight optimization"] },
          { id: "grade2", cols: ["Grade 2", "Definite osteophytes", "Possible / minimal", "Mild OA; NSAIDs, physical therapy, activity modification"] },
          { id: "grade3", cols: ["Grade 3", "Moderate osteophytes", "Definite JSN", "Moderate OA; intra-articular injections, unloader braces, osteotomy in young"] },
          { id: "grade4", cols: ["Grade 4", "Large osteophytes", "Bone-on-bone obliteration", "End-stage OA; Arthroplasty (Unicompartmental or Total Knee Arthroplasty)"] }
        ]
      },
      calc: function (v) {
        var g = v.grade;
        var match = "grade" + g;
        var summary = g === "0" ? "Normal Joint" : g === "1" ? "Doubtful OA" : g === "2" ? "Mild Radiographic OA" : g === "3" ? "Moderate OA" : "End-Stage Severe OA";
        var plan = (+g >= 3)
          ? "Advanced radiographic osteoarthritis. If conservative modalities fail, surgical consultation for joint arthroplasty (TKA/THA) or realignment osteotomy is indicated."
          : "Non-operative management: Weight loss, low-impact exercise, oral/topical NSAIDs, and physical therapy.";

        return {
          value: "Kellgren–Lawrence Grade " + g + " (" + summary + ")",
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 18. TLICS SCORE (THORACOLUMBAR SPINE TRAUMA)
    // ==============================================================
    {
      id: "tlicsSpine",
      cat: "ortho",
      type: "class",
      name: "Thoracolumbar Injury Classification and Severity Score (TLICS)",
      desc: "Algorithms guiding surgical versus non-operative management in thoracolumbar spinal trauma.",
      organ: "Spine / Thoracolumbar Vertebrae / Spinal Cord",
      region: "Spine / Trauma",
      subject: "Spine Surgery / Neurotrauma",
      keywords: ["tlics", "spine", "thoracolumbar", "burst fracture", "posterior ligamentous complex", "neurology"],
      guidance: "1. Evaluate CT and MRI of the thoracolumbar spine.\n2. Score Injury Morphology: Compression (1 pt), Burst (+1 pt = 2), Translation/Rotation (3 pts), Distraction (4 pts).\n3. Score Posterior Ligamentous Complex (PLC): Intact (0 pts), Suspected/Indeterminate (2 pts), Disrupted (3 pts).\n4. Score Neurological Status: Intact (0 pts), Root injury (2 pts), Complete cord (2 pts), Incomplete cord (3 pts), Cauda equina (3 pts).",
      contraindications: "Does not apply to cervical spine injuries (use SLIC criteria) or osteoporotic compression fractures without acute high-energy trauma.",
      literature: [
        {
          type: "Seminal Publication",
          icon: "📄",
          title: "The Thoracolumbar Injury Classification and Severity Score: a new paradigm",
          citation: "Vaccaro AR, Lehman RA Jr, Hurlbert RJ, et al. Spine (Phila Pa 1976). 2005;30(20):2325-2333.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/16227897/" }
          ]
        }
      ],
      fields: [
        makeS("morph", "1. Injury Morphology", "1", [
          ["1", "Compression / wedge fracture (1 pt)"],
          ["2", "Burst fracture (2 pts)"],
          ["3", "Translational / rotational displacement (3 pts)"],
          ["4", "Distraction injury (e.g., Chance fracture) (4 pts)"]
        ]),
        makeS("plc", "2. Posterior Ligamentous Complex (PLC) Integrity", "0", [
          ["0", "Intact (0 pts)"],
          ["2", "Suspected / Indeterminate (e.g., signal change on MRI) (2 pts)"],
          ["3", "Disrupted (widened interspinous space, facet subluxation) (3 pts)"]
        ]),
        makeS("neuro", "3. Neurological Status", "0", [
          ["0", "Intact: Normal motor, sensory, and sphincters (0 pts)"],
          ["2", "Nerve root injury (+2 pts)"],
          ["2b", "Complete spinal cord injury (AIS A) (+2 pts)"],
          ["3", "Incomplete spinal cord injury (AIS B–D) (+3 pts)"],
          ["3b", "Cauda equina syndrome (+3 pts)"]
        ])
      ],
      table: {
        headers: ["TLICS Total Score", "Clinical Stability", "Recommended Treatment Approach"],
        rows: [
          { id: "nonop", cols: ["Score ≤ 3", "Stable thoracolumbar fracture", "Non-operative management (TLSO brace or early mobilization)"] },
          { id: "indeterminate", cols: ["Score = 4", "Equivocal / Indeterminate stability", "Surgeon's discretion: Non-operative with close monitoring vs surgical stabilization"] },
          { id: "operative", cols: ["Score ≥ 5", "Unstable thoracolumbar injury", "SURGICAL MANAGEMENT: Operative reduction, posterior/anterior stabilization ± decompression"] }
        ]
      },
      calc: function (v) {
        var nScore = (v.neuro === "2" || v.neuro === "2b") ? 2 : (v.neuro === "3" || v.neuro === "3b") ? 3 : 0;
        var total = +v.morph + +v.plc + nScore;

        var match = "nonop";
        var plan = "Score ≤ 3: Non-operative management is supported. Consider mobilization in an orthosis (TLSO).";
        if (total >= 5) {
          match = "operative";
          plan = "Score ≥ 5: Operative intervention strongly indicated. Posterior instrumentation ± decompression recommended.";
        } else if (total === 4) {
          match = "indeterminate";
          plan = "Score = 4: Indeterminate. Surgical vs non-operative approach based on patient factors, comorbidities, and pain.";
        }

        return {
          value: "TLICS Score: " + total + " Points",
          matchId: match,
          eq: plan
        };
      }
    },

    // ==============================================================
    // 19. PERIPROSTHETIC JOINT INFECTION (PJI) ICM SCORE
    // ==============================================================
    {
      id: "pjiCriteria",
      cat: "ortho",
      type: "class",
      name: "Periprosthetic Joint Infection (PJI) ICM Score",
      desc: "2018 International Consensus Meeting definition for hip and knee arthroplasty infection.",
      organ: "Prosthesis / Synovium / Joint",
      region: "Joint Replacement / Arthroplasty",
      subject: "Adult Reconstruction / Joint Infection",
      keywords: ["pji", "infection", "arthroplasty", "crp", "esr", "synovial", "leukocyte esterase"],
      guidance: "1. Major Criteria (Sinus tract or ≥2 positive identical cultures) definitively confirm PJI without scoring.\n2. Minor Criteria: Serum CRP/D-dimer (2 pts), Serum ESR (1 pt), Synovial WBC >3000 (3 pts), Synovial PMN% >70% (2 pts), Positive leukocyte esterase/alpha-defensin (3 pts).\n3. Score ≥ 6 confirms PJI.",
      contraindications: "Cutoffs differ in acute postoperative period (<6 weeks from surgery) where higher synovial thresholds apply (synovial WBC >10,000/µL).",
      literature: [
        {
          type: "Official Consensus Definition",
          icon: "📘",
          title: "The 2018 Definition of Periprosthetic Hip and Knee Infection",
          citation: "Parvizi J, Tan TL, Goswami K, et al. J Arthroplasty. 2018;33(5):1309-1314.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/29551303/" }
          ]
        }
      ],
      fields: [
        makeS("sinus", "1. Major Criterion: Sinus tract communicating with prosthesis or 2 positive identical cultures", "0", [
          ["0", "No major criteria satisfied"],
          ["1", "Yes: Major criterion present (Definitive PJI)"]
        ]),
        makeS("crp", "2. Elevated Serum CRP (>10 mg/L) or D-Dimer (>860 ng/mL)", "0", [["0", "No (0 pts)"], ["2", "Elevated (+2 pts)"]]),
        makeS("esr", "3. Elevated Serum ESR (>30 mm/hr)", "0", [["0", "No (0 pts)"], ["1", "Elevated (+1 pt)"]]),
        makeS("synWbc", "4. Elevated Synovial WBC count (>3,000 cells/µL)", "0", [["0", "No (0 pts)"], ["3", "Elevated (+3 pts)"]]),
        makeS("synPmn", "5. Elevated Synovial PMN percentage (>70%)", "0", [["0", "No (0 pts)"], ["2", "Elevated (+2 pts)"]]),
        makeS("leukocyte", "6. Positive Synovial Leukocyte Esterase or Alpha-Defensin", "0", [["0", "Negative (0 pts)"], ["3", "Positive (+3 pts)"]])
      ],
      table: {
        headers: ["ICM Score", "Diagnostic Status", "Infection Probability", "Recommended Surgical Pathway"],
        rows: [
          { id: "major", cols: ["Major Criterion", "DEFINITE PJI", "~ 100%", "Staged revision arthroplasty (1-stage vs 2-stage protocol with antibiotic spacer)"] },
          { id: "infected", cols: ["Score ≥ 6", "Infected (PJI Confirmed)", "> 95%", "Operative revision / debridement, antibiotics, and implant retention (DAIR) or staged exchange"] },
          { id: "possible", cols: ["Score 2 – 5", "Inconclusive / Possible PJI", "Intermediate", "Further diagnostic evaluation: repeat aspiration, next-generation sequencing, frozen sections"] },
          { id: "notInfected", cols: ["Score 0 – 1", "Not Infected", "< 5%", "Routine follow-up; evaluate non-infectious causes of prosthetic failure"] }
        ]
      },
      calc: function (v) {
        if (v.sinus === "1") {
          return {
            value: "DEFINITE PJI (Major Criterion Present)",
            matchId: "major",
            eq: "Presence of a sinus tract communicating with the prosthesis or two separate positive periprosthetic cultures with phenotypically identical organisms confirms PJI without further scoring."
          };
        }

        var pts = +v.crp + +v.esr + +v.synWbc + +v.synPmn + +v.leukocyte;
        var match = pts >= 6 ? "infected" : pts >= 2 ? "possible" : "notInfected";
        var status = pts >= 6 ? "Infected (PJI Confirmed)" : pts >= 2 ? "Inconclusive / Possible PJI" : "Not Infected";

        return {
          value: "ICM Score: " + pts + " Points (" + status + ")",
          matchId: match,
          eq: pts >= 6
            ? "PJI confirmed by 2018 ICM criteria (score ≥6). Multidisciplinary infectious disease consultation and surgical planning (DAIR vs staged exchange) indicated."
            : pts >= 2
            ? "Inconclusive score (2–5 points). Correlate with intraoperative histology (>5 PMN/HPF), synovial alpha-defensin, or repeat arthrocentesis."
            : "Low probability of periprosthetic joint infection."
        };
      }
    },

    // ==============================================================
    // 20. SYNOVIAL FLUID CELL COUNT INTERPRETATION
    // ==============================================================
    {
      id: "synovialFluidRef",
      cat: "ortho",
      type: "class",
      name: "Synovial Fluid Cell Count Interpretation",
      desc: "Differential diagnosis of native joint synovial fluid aspiration based on WBC count and PMN%.",
      organ: "Synovial Fluid / Native Joint",
      region: "Joint Aspiration / Arthrocentesis",
      subject: "Orthopaedic Infections / Rheumatology",
      keywords: ["synovial fluid", "arthrocentesis", "septic arthritis", "wbc", "pmn", "crystals", "gout"],
      guidance: "1. Perform diagnostic arthrocentesis prior to initiating systemic antimicrobial therapy.\n2. Send synovial fluid for WBC count, differential, polarized light microscopy (crystals), Gram stain, and cultures.\n3. Native joint septic arthritis threshold is classically >50,000 WBC/µL with >75% PMNs.",
      contraindications: "Do not pass aspiration needle through overlying cellulitis or cutaneous abscess to prevent iatrogenic seeding of the joint.",
      literature: [
        {
          type: "Seminal Review",
          icon: "📄",
          title: "Synovial fluid analysis",
          citation: "Shmerling RH. In: UpToDate. Waltham, MA: UpToDate; 2021.",
          links: [
            { text: "View on PubMed ↗", url: "https://pubmed.ncbi.nlm.nih.gov/19077271/" }
          ]
        }
      ],
      fields: [
        makeN("wbc", "Synovial Fluid WBC Count (cells/µL)", 65000, { min: 0, max: 300000, step: 500 }),
        makeN("pmn", "Polymorphonuclear Leukocytes (PMN, %)", 88, { min: 0, max: 100, step: 1 })
      ],
      table: {
        headers: ["Category", "WBC Count (/µL)", "PMN %", "Typical Etiologies"],
        rows: [
          { id: "normal", cols: ["Normal", "< 200", "< 25%", "Normal physiological joint"] },
          { id: "noninflammatory", cols: ["Non-inflammatory", "200 – 2,000", "< 50%", "Osteoarthritis, trauma, meniscal tear, osteochondritis dissecans"] },
          { id: "inflammatory", cols: ["Inflammatory", "2,000 – 50,000", "> 50%", "Rheumatoid arthritis, gout, pseudogout, reactive arthritis"] },
          { id: "septic", cols: ["Septic Arthritis", "> 50,000 (often >100k)", "> 75% – 90%", "Bacterial septic arthritis; emergent joint washout indicated"] }
        ]
      },
      calc: function (v) {
        var w = +v.wbc, p = +v.pmn;
        var match = "normal", dx = "Normal Synovial Fluid", plan = "Normal cellularity.";

        if (w > 50000 && p > 75) {
          match = "septic";
          dx = "SEPTIC ARTHRITIS (>50,000 WBC/µL, >75% PMN)";
          plan = "EMERGENCY: High likelihood of bacterial septic joint. Initiate emergent arthroscopic or open joint debridement/washout and empiric IV antibiotics after cultures.";
        } else if (w >= 2000) {
          match = "inflammatory";
          dx = "Inflammatory Synovial Fluid (2,000–50,000 WBC/µL)";
          plan = "Consistent with crystal arthropathy (Gout/CPPD) or inflammatory arthropathy (RA/Spondyloarthritis). Check polarized microscopy for birefringent crystals.";
        } else if (w >= 200) {
          match = "noninflammatory";
          dx = "Non-Inflammatory Synovial Fluid (200–2,000 WBC/µL)";
          plan = "Consistent with mechanical or degenerative conditions (Osteoarthritis, internal derangement, resolving trauma).";
        }

        return {
          value: dx,
          matchId: match,
          eq: plan
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
      if (window.categories[i] && window.categories[i].id === orthoCategory.id) {
        catExists = true;
        break;
      }
    }
    if (!catExists) {
      window.categories.push(orthoCategory);
    }

    // 2. Safely add tools
    orthoTools.forEach(function (tool) {
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

    // 3. Extend search synonym map
    if (typeof window.SYNONYM_MAP === "object" && window.SYNONYM_MAP !== null) {
      window.SYNONYM_MAP["ortho"] = ["ortho", "orthopaedics", "orthopedics", "fracture", "bone", "joint", "trauma", "spine", "compartment"];
      window.SYNONYM_MAP["fracture"] = ["fracture", "gustilo", "weber", "schatzker", "garden", "tlics", "salter", "pauwels", "ao", "pipkin", "tile"];
      window.SYNONYM_MAP["knee"] = ["knee", "ottawa", "schatzker", "kellgren", "patella", "synovial"];
      window.SYNONYM_MAP["ankle"] = ["ankle", "malleolus", "ottawa", "weber", "syndesmosis", "abi"];
      window.SYNONYM_MAP["trauma"] = ["trauma", "mess", "gustilo", "fasciotomy", "compartment", "delta pressure", "nexus", "tile"];
    }

    // 4. Force repaint if the HTML engine has already initialized
    if (typeof window.renderHome === "function") {
      window.renderHome();
    }
  } catch (err) {
    console.error("Critical error registering Ortho tools:", err);
  }
})();
