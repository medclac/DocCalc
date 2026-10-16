// ortho.js
(function () {
  window.MedCalcModules = window.MedCalcModules || [];

  const category = {
    id: "ortho",
    name: "Orthopedics & Trauma",
    icon: "🦴",
    desc: "Fracture classifications, trauma rules, joint scores, spine, and compartment syndrome"
  };

  const guidance = {
    // A. Trauma & Fracture Assessment
    gustiloAnderson: [
      "Type I (<1 cm clean wound); Type II (1–10 cm moderate soft-tissue injury); Type IIIA (>10 cm with adequate periosteal coverage); Type IIIB (extensive periosteal stripping requiring flap coverage); Type IIIC (arterial repair required for limb viability).",
      "Guides urgent open fracture debridement, coverage timing, and antibiotic selection."
    ],
    tscherneOestern: [
      "Classifies closed soft-tissue trauma from Grade 0 (minimal/indirect injury) to Grade 3 (severe contusion, degloving, or compartment syndrome).",
      "Prevents catastrophic wound dehiscence and infection by delaying definitive internal fixation until soft-tissue envelope settles."
    ],
    aoOtaRef: [
      "Alphanumeric coding: Bone (1 Humerus, 2 Radius/Ulna, 3 Femur, 4 Tibia/Fibula) + Segment (1 Proximal, 2 Diaphyseal, 3 Distal) + Type (A simple, B wedge, C complex).",
      "Universal language for orthopedic fracture classification, research, and documentation."
    ],
    ottawaAnkle: [
      "Ankle X-ray indicated only if pain in malleolar zone AND: bone tenderness at posterior edge/tip of lateral or medial malleolus (distal 6 cm), OR inability to bear weight (4 steps) both immediately and in ED.",
      "Safely rules out ankle/foot fractures with near 100% sensitivity, reducing unnecessary radiography."
    ],
    ottawaKnee: [
      "Knee X-ray needed for acute injury only if: Age ≥55, isolated patellar tenderness, fibular head tenderness, inability to flex to 90°, or inability to bear weight (4 steps) immediately and in ED.",
      "High sensitivity decision rule to exclude acute knee fractures."
    ],
    pittsburghKnee: [
      "Knee radiograph required only if acute blunt trauma or fall AND either: age <12 or >50, OR inability to walk 4 weight-bearing steps in ED.",
      "Alternative validated decision rule for acute knee trauma with high specificity."
    ],

    // B. Knee & Lower-Limb Assessment
    kellgrenLawrence: [
      "Grade 0: None; Grade 1: Doubtful joint space narrowing (JSN) and possible osteophytes; Grade 2: Definite osteophytes, possible JSN; Grade 3: Moderate multiple osteophytes, definite JSN, sclerosis; Grade 4: Large osteophytes, severe JSN, subchondral sclerosis.",
      "Radiographic gold standard for grading knee and hip osteoarthritis."
    ],
    insallSalvati: [
      "Ratio = Patellar tendon length (LT) ÷ Patellar greatest diagonal length (LP). Normal range: 0.8–1.2. >1.2 indicates Patella Alta; <0.8 indicates Patella Baja.",
      "Lateral knee radiograph ratio to diagnose patellar height abnormalities and instability."
    ],
    catonDeschamps: [
      "Ratio = Distance from inferior patellar articular surface to anterior tibial plateau ÷ length of patellar articular facet. Normal: 0.6–1.2. >1.2 indicates Patella Alta.",
      "Preferred patellofemoral height index after tibial tuberosity osteotomy."
    ],
    legLengthDiscrepancy: [
      "Measures true limb length (ASIS to medial malleolus) vs apparent limb length (umbilicus to medial malleolus). Discrepancy >2 cm typically warrants clinical or shoe-lift intervention.",
      "Evaluates structural pelvic obliquity and structural limb-length difference."
    ],

    // C. Shoulder, Elbow & Upper Limb
    quickDash: [
      "11-item disability score of arm, shoulder, and hand. Scored 0 (no disability) to 100 (severe disability).",
      "Standard functional outcome measure for upper-extremity disorders."
    ],
    gartlandSupracondylar: [
      "Type I: Non-displaced (<2mm, intact anterior humeral line); Type II: Displaced with intact posterior cortex; Type III: Completely displaced with no cortical contact; Type IV: Multidirectionally unstable.",
      "Guides closed reduction, percutaneous pinning (CRPP), or open reduction in pediatric elbow trauma."
    ],
    neerProxHumerus: [
      "Neer criteria require displacement >1 cm or angulation >45° between the 4 major segments: Articular head, Greater tuberosity, Lesser tuberosity, Shaft.",
      "Determines conservative management vs ORIF vs hemiarthroplasty / reverse total shoulder arthroplasty."
    ],
    rockwoodAc: [
      "Type I: Sprain; Type II: CC intact, AC torn; Type III: AC & CC torn (25–100% displacement); Type IV: Posterior clavicle displacement into trapezius; Type V: Severe superior displacement (>100–300%); Type VI: Inferior subacromial/subcoracoid displacement.",
      "Classifies acromioclavicular separations to differentiate conservative from surgical reconstruction."
    ],
    masonRadialHead: [
      "Type I: Small non-displaced (<2mm); Type II: Marginal sector with displacement (>2mm) or angulation; Type III: Comminuted head fracture; Type IV: Radial head fracture with elbow dislocation.",
      "Directs non-operative care, ORIF, excision, or arthroplasty."
    ],

    // D. Hip & Pelvis
    gardenFemoralNeck: [
      "Type I: Incomplete / impacted valgus; Type II: Complete non-displaced; Type III: Complete with partial displacement; Type IV: Completely displaced with loss of trabecular continuity.",
      "Key predictor of avascular necrosis and non-union to choose between percutaneous fixation and arthroplasty in elderly patients."
    ],
    pauwelsAngle: [
      "Angle between fracture line and horizontal plane: Type I (<30°, compression forces favor union); Type II (30–50°, shear forces); Type III (>50°, high vertical shear forces prone to non-union and varus collapse).",
      "Biomechanical classification of femoral neck fractures guiding valgus osteotomy or fixation strategy."
    ],
    pipkinFemoralHead: [
      "Type I: Infrafoveal (below fovea, non-weightbearing); Type II: Suprafoveal (involving major weightbearing zone); Type III: Type I or II with femoral neck fracture; Type IV: Type I or II with acetabular fracture.",
      "Associated with posterior hip dislocations; dictates excision, screw fixation, or joint reconstruction."
    ],
    tonnisHipGrading: [
      "Grade 0: Normal; Grade 1: Increased sclerosis, slight JSN, slight osteophytes; Grade 2: Small subchondral cysts, moderate JSN, loss of femoral head sphericity; Grade 3: Severe JSN, large cysts, head deformity.",
      "Radiographic staging of developmental dysplasia and secondary hip osteoarthritis."
    ],

    // E. Spine & Back Pain
    odiScore: [
      "Oswestry Disability Index (ODI) assesses 10 functional daily domains (0–100%). Minimally important difference is ~10–12%.",
      "Gold-standard functional impairment questionnaire for low back pain and lumbar spine surgery."
    ],
    sinsSpine: [
      "Spinal Instability Neoplastic Score (0–18). Score 0–6 = Stable; 7–12 = Potentially unstable (surgical consultation); 13–18 = Unstable (surgical stabilization indicated).",
      "Comprehensive scoring to identify tumor-related vertebral instability."
    ],
    tlicsSpine: [
      "Thoracolumbar Injury Classification and Severity Score evaluates morphology (0–4), posterior ligamentous complex integrity (0–3), and neurology (0–3). Score ≥5 suggests surgical intervention.",
      "Directs surgical vs non-operative management in acute thoracolumbar trauma."
    ],
    meyerdingSpondylo: [
      "Measures anterior translation of superior vertebral body: Grade I (<25%), Grade II (25–50%), Grade III (51–75%), Grade IV (76–100%), Grade V (Spondyloptosis >100%).",
      "Standard radiographic grading for isthmic and degenerative spondylolisthesis."
    ],
    cobbAngleCalc: [
      "Angle between lines along superior endplate of upper tilted vertebra and inferior endplate of lower tilted vertebra. >10° defines scoliosis; curves >40–50° often warrant operative consideration.",
      "Standard metric for quantifying coronal spinal deformity."
    ],

    // F. Bone Health & Osteoporosis
    tscoreBmd: [
      "T-score compares BMD to healthy young adult peak mean: Normal (≥ −1.0), Osteopenia (−1.0 to −2.5), Osteoporosis (≤ −2.5), Severe Osteoporosis (≤ −2.5 with fragility fracture).",
      "Diagnostic criteria for DXA bone densitometry."
    ],

    // G. Fracture-Specific Classifications
    schatzkerTibialPlateau: [
      "Type I: Split lateral; Type II: Split-depression lateral; Type III: Pure central depression lateral; Type IV: Medial plateau fracture; Type V: Bicondylar fracture; Type VI: Dissociation between metaphysis and diaphysis.",
      "Defines bicondylar vs unicondylar plateau patterns to plan surgical approach and buttress plating."
    ],
    weberAnkle: [
      "Weber A: Infrasyndesmotic fibula fracture (syndesmosis intact); Weber B: Trans-syndesmotic (syndesmosis variable); Weber C: Suprasyndesmotic (syndesmosis torn, unstable, requires fixation).",
      "Simple radiographic categorization of lateral malleolar fracture level relative to the syndesmosis."
    ],
    salterHarris: [
      "Type I: Slipped physis; Type II: Above physis into metaphysis (Thurston–Holland fragment); Type III: Lower through epiphysis into joint; Type IV: Through all three (metaphysis, physis, epiphysis); Type V: Rammed / crushed physis.",
      "Pediatric growth plate trauma classification predicting growth arrest."
    ],
    tilePelvis: [
      "Tile Type A: Stable (intact posterior arch); Type B: Rotationally unstable, vertically stable ('open-book' or lateral compression); Type C: Completely unstable (rotationally and vertically disrupted posterior arch).",
      "Directs emergent pelvic binder application, external fixation, or pelvic packing."
    ],

    // H. Compartment Syndrome & Limb Trauma
    deltaPressure: [
      "ΔP = Diastolic Blood Pressure − Measured Intracompartmental Pressure. A ΔP ≤30 mmHg indicates relative tissue ischemia and supports emergent fasciotomy.",
      "More accurate than absolute compartment pressure alone, particularly in hypotensive trauma patients."
    ],
    abiCalc: [
      "Ankle–Brachial Index = Highest systolic ankle pressure (DP or PT) ÷ Highest systolic brachial pressure. Normal: 0.90–1.30. <0.90 indicates arterial occlusion.",
      "Standard non-invasive screening rule to rule out blunt or penetrating vascular injury in limb trauma."
    ],
    messScore: [
      "Mangled Extremity Severity Score evaluates skeletal/soft-tissue injury (1–4), limb ischemia (1–3, doubled if >6h), shock (0–2), and age (0–2). Score ≥7 predicts limb loss/amputation.",
      "Decision-support tool in high-energy lower-extremity trauma."
    ],
    nexusSpine: [
      "C-spine imaging not required if ALL 5 met: No posterior midline cervical tenderness, no focal neurological deficit, normal alertness, no intoxication, no painful distracting injury.",
      "Clinical decision rule safely clearing the cervical spine without radiography."
    ],

    // I. Functional Outcome & Rehabilitation
    lefsScore: [
      "Lower Extremity Functional Scale (LEFS): 20 items rated 0 to 4 (maximum 80 points). Minimal clinically important difference (MCID) is 9 points.",
      "Tracks functional mobility before and after orthopedic intervention or rehabilitation."
    ],
    tugTest: [
      "Timed Up and Go (TUG): time in seconds to rise from chair, walk 3 meters, turn, return, and sit. <10s = normal; 10–20s = good mobility; >20–30s = high fall risk.",
      "Simple, rapid physical test of dynamic balance and fall probability in elderly and arthroplasty patients."
    ],
    lysholmKnee: [
      "Lysholm Knee Scoring Scale (0–100): Limp (5), Support (5), Locking (15), Instability (25), Pain (25), Swelling (10), Stair climbing (10), Squatting (5).",
      "Measures ligamentous and meniscal chondral functional outcomes."
    ],

    // J. Infection & Postoperative Assessment
    friReference: [
      "Fracture-Related Infection (FRI) diagnostic criteria: Confirmed by sinus tract/fistula, purulent drainage, phenotypically identical pathogens on ≥2 intraoperative cultures, or histological micro-abscesses.",
      "Consensus definition guiding implant retention vs staged exchange."
    ],
    pjiCriteria: [
      "ICM/MSIS Criteria for Periprosthetic Joint Infection: Sinus tract or ≥2 positive cultures = Definite PJI. Minor criteria combine serum CRP/D-dimer, synovial WBC, PMN %, positive leukocyte esterase, and alpha-defensin.",
      "Definitive international diagnostic framework for joint replacement infections."
    ],
    synovialFluidRef: [
      "Normal (<200 WBC/µL, <25% PMN); Non-inflammatory OA (<2,000 WBC); Inflammatory (2,000–50,000 WBC, >50% PMN); Septic native joint (>50,000 WBC/µL, >75–90% PMN).",
      "Arthrocentesis analysis to rule out native joint sepsis and crystal arthropathies."
    ]
  };

  const tools = [
    // ==========================================
    // A. TRAUMA AND FRACTURE ASSESSMENT
    // ==========================================
    {
      id: "gustiloAnderson",
      cat: "ortho",
      subcat: "Trauma and Fracture Assessment",
      name: "Gustilo–Anderson Open Fracture Classification",
      desc: "Grades open fracture soft-tissue injury, periosteal stripping, and vascular compromise.",
      fields: [
        S("type", "Open fracture wound & soft-tissue features", "I", [
          ["I", "Type I — Clean wound <1 cm, minimal soft-tissue injury"],
          ["II", "Type II — Wound 1–10 cm, moderate soft-tissue injury, no extensive stripping"],
          ["IIIA", "Type IIIA — Wound >10 cm, extensive soft-tissue injury, adequate periosteal coverage"],
          ["IIIB", "Type IIIB — Extensive soft-tissue loss, periosteal stripping, requires local/free flap coverage"],
          ["IIIC", "Type IIIC — Open fracture with arterial injury requiring repair for limb salvage"]
        ])
      ],
      calc: v => {
        let inf = v.type === "I" ? "~0–2% infection risk" : v.type === "II" ? "~2–7% infection risk" : v.type === "IIIA" ? "~10–15% infection risk" : v.type === "IIIB" ? "~15–30% infection risk" : "High amputation and infection risk (>25–50%)";
        return {
          value: "Gustilo–Anderson Type " + v.type + " (" + inf + ")",
          eq: "Type I/II: 1st gen cephalosporin. Type III: Add Gram-negative (aminoglycoside). Add penicillin/ampicillin if soil/barnyard contamination. Tetanus prophylaxis indicated."
        };
      }
    },
    {
      id: "tscherneOestern",
      cat: "ortho",
      subcat: "Trauma and Fracture Assessment",
      name: "Tscherne Soft-Tissue Classification (Closed)",
      desc: "Grades soft-tissue injury in closed fractures to determine fixation timing.",
      fields: [
        S("grade", "Soft-tissue presentation", "0", [
          ["0", "Grade 0 — Negligible soft-tissue injury (indirect violence, simple fracture)"],
          ["1", "Grade 1 — Superficial abrasion or contusion from within; mild fracture pattern"],
          ["2", "Grade 2 — Deep contaminated abrasion with local skin/muscle contusion, impending compartment syndrome"],
          ["3", "Grade 3 — Extensive skin contusion or crush, subcutaneous degloving, manifest compartment syndrome"]
        ])
      ],
      calc: v => {
        let rec = +v.grade >= 2 ? "High wound complication risk. Delay definitive open reduction; consider temporary spanning external fixation." : "Favorable soft tissues for standard surgical timing.";
        return {
          value: "Tscherne Closed Grade " + v.grade + " — " + rec,
          eq: "Evaluates contusions, abrasions, blistering, and compartment edema to prevent wound necrosis and infection."
        };
      }
    },
    {
      id: "aoOtaRef",
      cat: "ortho",
      subcat: "Trauma and Fracture Assessment",
      name: "AO/OTA Fracture Classification Reference",
      desc: "Alphanumeric anatomical classification schema.",
      fields: [
        S("bone", "Bone Segment", "32", [
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
        S("type", "Fracture Morphology", "A", [
          ["A", "Type A — Simple (diaphyseal) / Extra-articular (periarticular)"],
          ["B", "Type B — Wedge (diaphyseal) / Partial articular (periarticular)"],
          ["C", "Type C — Multifragmentary (diaphyseal) / Complete articular (periarticular)"]
        ])
      ],
      calc: v => ({
        value: "AO/OTA Code: " + v.bone + "-" + v.type,
        eq: "AO/OTA System: [Bone][Segment]-[Morphology]. Type A represents the simplest pattern; Type C represents complex articular or comminuted fractures."
      })
    },
    {
      id: "ottawaAnkle",
      cat: "ortho",
      subcat: "Trauma and Fracture Assessment",
      name: "Ottawa Ankle Rules",
      desc: "Decision tool to exclude ankle and midfoot fractures without X-rays.",
      fields: [
        S("post_lat", "Bone tenderness at posterior edge/tip of lateral malleolus (distal 6 cm)", "0", [["0", "No"], ["1", "Yes"]]),
        S("post_med", "Bone tenderness at posterior edge/tip of medial malleolus (distal 6 cm)", "0", [["0", "No"], ["1", "Yes"]]),
        S("navicular", "Bone tenderness at the navicular bone", "0", [["0", "No"], ["1", "Yes"]]),
        S("base5", "Bone tenderness at base of 5th metatarsal", "0", [["0", "No"], ["1", "Yes"]]),
        S("weight", "Inability to bear weight both immediately and in ED (4 steps)", "0", [["0", "Able to walk"], ["1", "Unable to bear weight"]])
      ],
      calc: v => {
        const ankleXray = +v.post_lat === 1 || +v.post_med === 1 || +v.weight === 1;
        const footXray = +v.navicular === 1 || +v.base5 === 1 || +v.weight === 1;
        let c = "";
        if (ankleXray && footXray) c = "Ankle Series AND Foot Series X-rays indicated";
        else if (ankleXray) c = "Ankle X-ray Series indicated (AP, lateral, mortise)";
        else if (footXray) c = "Foot X-ray Series indicated";
        else c = "No radiographic imaging indicated (>98% sensitive for excluding fracture)";
        return {
          value: c,
          eq: "Ottawa Ankle Rules: Valid only for acute blunt trauma with malleolar or midfoot pain. Patients able to take 4 steps without bony tenderness do not require radiographs."
        };
      }
    },
    {
      id: "ottawaKnee",
      cat: "ortho",
      subcat: "Trauma and Fracture Assessment",
      name: "Ottawa Knee Rules",
      desc: "Clinical rule to safely rule out acute knee fractures in blunt trauma.",
      fields: [
        N("age", "Patient Age (years)", 34, { min: 1, max: 110 }),
        S("patella", "Isolated bone tenderness of patella (no other bone tenderness)", "0", [["0", "No"], ["1", "Yes"]]),
        S("fib_head", "Tenderness at head of fibula", "0", [["0", "No"], ["1", "Yes"]]),
        S("flexion", "Inability to flex knee to 90 degrees", "0", [["0", "No (can flex to 90°)"], ["1", "Yes (cannot flex 90°)"]]),
        S("weight", "Inability to bear weight both immediately and in ED (4 steps)", "0", [["0", "Able to bear weight"], ["1", "Unable to bear weight"]])
      ],
      calc: v => {
        const need = +v.age >= 55 || +v.patella === 1 || +v.fib_head === 1 || +v.flexion === 1 || +v.weight === 1;
        return {
          value: need ? "Knee X-ray Series indicated" : "No knee radiograph indicated (Fracture excluded with ~99% sensitivity)",
          eq: "Applies to acute knee trauma within 7 days. X-ray indicated if Age ≥55, isolated patellar or fibular head tenderness, flexion <90°, or unable to walk 4 steps."
        };
      }
    },

    // ==========================================
    // B. KNEE AND LOWER-LIMB ASSESSMENT
    // ==========================================
    {
      id: "kellgrenLawrence",
      cat: "ortho",
      subcat: "Knee and Lower-Limb Assessment",
      name: "Kellgren–Lawrence Osteoarthritis Grading",
      desc: "Standard radiographic classification of joint space narrowing and osteophytes.",
      fields: [
        S("grade", "Radiographic joint findings", "2", [
          ["0", "Grade 0: None — No radiographic features of osteoarthritis"],
          ["1", "Grade 1: Doubtful — Minute osteophyte, doubtful joint space narrowing (JSN)"],
          ["2", "Grade 2: Minimal — Definite osteophytes, unimpaired or possible JSN"],
          ["3", "Grade 3: Moderate — Moderate multiple osteophytes, definite JSN, some sclerosis"],
          ["4", "Grade 4: Severe — Large osteophytes, marked JSN, severe subchondral sclerosis, bone contour deformity"]
        ])
      ],
      calc: v => ({
        value: "Kellgren–Lawrence Grade " + v.grade,
        eq: "Grades ≥2 denote radiographically confirmed osteoarthritis on weight-bearing views."
      })
    },
    {
      id: "insallSalvati",
      cat: "ortho",
      subcat: "Knee and Lower-Limb Assessment",
      name: "Insall–Salvati Ratio (Patellar Height)",
      desc: "Ratio of patellar tendon length to patella diagonal length on 30° lateral radiograph.",
      fields: [
        N("tendon", "Patellar Tendon Length (TL, mm)", 46, { min: 10, max: 100, step: 0.5 }),
        N("patella", "Patellar Greatest Length (PL, mm)", 44, { min: 10, max: 100, step: 0.5 })
      ],
      calc: v => {
        const r = +v.tendon / +v.patella;
        let c = r > 1.2 ? "Patella Alta (>1.2; associated with patellar instability, subluxation, chondromalacia)" : r < 0.8 ? "Patella Baja (<0.8; associated with prior surgery, restricted flexion)" : "Normal patellar height (0.8–1.2)";
        return {
          value: "Insall–Salvati Ratio: " + r.toFixed(2) + " — " + c,
          eq: "Formula: Ratio = Tendon Length (LT) ÷ Patellar Length (LP). Measured on lateral knee radiograph with 30° flexion."
        };
      }
    },
    {
      id: "catonDeschamps",
      cat: "ortho",
      subcat: "Knee and Lower-Limb Assessment",
      name: "Caton–Deschamps Index",
      desc: "Alternative patellar height ratio based on articular surface distance.",
      fields: [
        N("at", "Distance from inferior articular surface to tibial plateau (AT, mm)", 40, { min: 5, max: 100, step: 0.5 }),
        N("ap", "Length of patellar articular surface (AP, mm)", 36, { min: 10, max: 100, step: 0.5 })
      ],
      calc: v => {
        const r = +v.at / +v.ap;
        let c = r > 1.2 ? "Patella Alta (>1.2)" : r < 0.6 ? "Patella Baja (<0.6)" : "Normal patellar height (0.6–1.2)";
        return {
          value: "Caton–Deschamps Index: " + r.toFixed(2) + " — " + c,
          eq: "Formula: AT ÷ AP. Independent of tibial tuberosity morphology; useful after tuberosity transfer."
        };
      }
    },
    {
      id: "legLengthDiscrepancy",
      cat: "ortho",
      subcat: "Knee and Lower-Limb Assessment",
      name: "Leg Length Discrepancy Calculator",
      desc: "Calculates true vs apparent leg length discrepancy.",
      fields: [
        N("r_true", "Right True Length (ASIS to Medial Malleolus, cm)", 88.0, { min: 30, max: 140, step: 0.5 }),
        N("l_true", "Left True Length (ASIS to Medial Malleolus, cm)", 86.5, { min: 30, max: 140, step: 0.5 }),
        N("r_app", "Right Apparent Length (Umbilicus to Malleolus, cm)", 94.0, { min: 30, max: 140, step: 0.5 }),
        N("l_app", "Left Apparent Length (Umbilicus to Malleolus, cm)", 92.5, { min: 30, max: 140, step: 0.5 })
      ],
      calc: v => {
        const trueDiff = Math.abs(+v.r_true - +v.l_true);
        const appDiff = Math.abs(+v.r_app - +v.l_app);
        const longerSide = +v.r_true >= +v.l_true ? "Right" : "Left";
        let c = trueDiff > 2.0 ? "Significant structural discrepancy (>2 cm; shoe lift or epiphyseodesis/shortening consideration)" : "Mild / physiologically well-tolerated discrepancy (≤2 cm)";
        return {
          value: "True Difference: " + trueDiff.toFixed(1) + " cm (" + longerSide + " longer) | Apparent: " + appDiff.toFixed(1) + " cm (" + c + ")",
          eq: "True discrepancy reflects bony asymmetry from ASIS. Apparent discrepancy includes pelvic obliquity and spinal scoliosis."
        };
      }
    },

    // ==========================================
    // C. SHOULDER, ELBOW AND UPPER LIMB
    // ==========================================
    {
      id: "quickDash",
      cat: "ortho",
      subcat: "Shoulder, Elbow and Upper Limb",
      name: "QuickDASH Disability Score",
      desc: "11-item self-report questionnaire for arm, shoulder, and hand disability.",
      fields: [
        N("sum", "Sum of 11 completed items (each item rated 1 to 5)", 22, { min: 11, max: 55, step: 1 })
      ],
      calc: v => {
        const score = ((+v.sum / 11) - 1) * 25;
        return {
          value: score.toFixed(1) + " / 100% Disability",
          eq: "QuickDASH = [ (Sum of responses ÷ 11) − 1 ] × 25. 0% = no disability; 100% = maximal functional disability."
        };
      }
    },
    {
      id: "gartlandSupracondylar",
      cat: "ortho",
      subcat: "Shoulder, Elbow and Upper Limb",
      name: "Gartland Classification (Supracondylar)",
      desc: "Pediatric supracondylar humerus fracture extension-type classification.",
      fields: [
        S("type", "Fracture displacement and cortical contact", "I", [
          ["I", "Type I — Undisplaced or minimally displaced (<2 mm), anterior humeral line intersects capitellum"],
          ["II", "Type II — Displaced with intact posterior hinge/cortex (anterior line passes anterior to capitellum)"],
          ["III", "Type III — Completely displaced, no cortical contact, rotational deformity"],
          ["IV", "Type IV — Completely displaced with multidirectional instability (disrupted anterior & posterior periosteum)"]
        ])
      ],
      calc: v => {
        let tx = v.type === "I" ? "Long arm cast / splint immobilization (4 weeks)" : v.type === "II" ? "Closed reduction and percutaneous pinning (CRPP) or casting if stable" : "CRPP with lateral divergent or cross-pins; assess neurovascular status (AIN nerve, radial pulse)";
        return {
          value: "Gartland Type " + v.type + " — " + tx,
          eq: "Check Anterior Interosseous Nerve (AIN: 'OK sign') and radial pulse. Type III/IV require emergent reduction if pulseless."
        };
      }
    },
    {
      id: "neerProxHumerus",
      cat: "ortho",
      subcat: "Shoulder, Elbow and Upper Limb",
      name: "Neer Classification of Proximal Humerus Fractures",
      desc: "Based on displacement (>1 cm) or angulation (>45°) of 4 major parts.",
      fields: [
        S("parts", "Number of displaced segments", "1", [
          ["1", "One-part fracture — No segments displaced >1 cm or angulated >45° (regardless of fracture lines)"],
          ["2_gt", "Two-part: Greater Tuberosity displaced"],
          ["2_sn", "Two-part: Surgical Neck displaced"],
          ["2_an", "Two-part: Anatomical Neck displaced"],
          ["3", "Three-part: Surgical neck + Greater or Lesser Tuberosity displaced"],
          ["4", "Four-part: All segments displaced (articular head, shaft, greater and lesser tuberosities)"]
        ]),
        S("dislocation", "Associated Glenohumeral Dislocation?", "0", [["0", "No"], ["1", "Yes (Fracture-dislocation)"]])
      ],
      calc: v => {
        let tx = v.parts === "1" ? "Non-operative: Sling immobilization, early pendulum exercises." : v.parts === "4" ? "High risk of osteonecrosis. Arthroplasty (Hemi or Reverse Total Shoulder) vs ORIF in young." : "ORIF with locked plate or closed reduction and percutaneous pinning.";
        return {
          value: "Neer " + (v.parts === "1" ? "One-Part" : v.parts.startsWith("2") ? "Two-Part" : v.parts === "3" ? "Three-Part" : "Four-Part") + " Fracture — " + tx,
          eq: "Neer criteria define displacement strictly as >1 cm separation or >45° angulation."
        };
      }
    },
    {
      id: "rockwoodAc",
      cat: "ortho",
      subcat: "Shoulder, Elbow and Upper Limb",
      name: "Rockwood Classification (AC Joint)",
      desc: "Grades acromioclavicular and coracoclavicular ligament disruption.",
      fields: [
        S("type", "Radiographic and clinical AC joint separation", "I", [
          ["I", "Type I — AC ligament sprain; CC intact; normal radiographs"],
          ["II", "Type II — AC torn, CC sprained; clavicle subluxated <50% on Zanca view"],
          ["III", "Type III — AC & CC completely torn; 25–100% superior displacement"],
          ["IV", "Type IV — Clavicle displaced posteriorly into or through trapezius"],
          ["V", "Type V — Exaggerated superior displacement (100–300% CC space increase)"],
          ["VI", "Type VI — Inferior displacement beneath coracoid or acromion"]
        ])
      ],
      calc: v => {
        let mgmt = (v.type === "I" || v.type === "II") ? "Conservative: Sling, ice, early mobilization" : (v.type === "III") ? "Trial of conservative therapy (surgery for manual laborers / overhead athletes)" : "Surgical reconstruction indicated (CC ligament reconstruction / fixation)";
        return {
          value: "Rockwood Type " + v.type + " — " + mgmt,
          eq: "Zanca radiographic view (10–15° cephalic tilt) improves evaluation of acromioclavicular joint congruency."
        };
      }
    },
    {
      id: "masonRadialHead",
      cat: "ortho",
      subcat: "Shoulder, Elbow and Upper Limb",
      name: "Mason Classification (Radial Head)",
      desc: "Classifies radial head fractures to guide non-operative care, ORIF, or excision.",
      fields: [
        S("type", "Fracture displacement and comminution", "I", [
          ["I", "Type I — Small, non-displaced marginal fracture (<2 mm step-off)"],
          ["II", "Type II — Marginal sector fracture with displacement (>2 mm) or angulation"],
          ["III", "Type III — Comminuted fracture involving entire radial head"],
          ["IV", "Type IV — Radial head fracture accompanied by elbow dislocation"]
        ])
      ],
      calc: v => {
        let plan = v.type === "I" ? "Non-operative: Sling for comfort, early active range of motion at 48 hours." : v.type === "II" ? "ORIF if mechanical block to rotation exists; otherwise non-operative trial." : v.type === "III" ? "Arthroplasty (radial head replacement) or ORIF. Avoid excision if interosseous membrane/MCL torn." : "Reduce dislocation, stabilize ligaments, radial head reconstruction or replacement.";
        return {
          value: "Mason Type " + v.type + " — " + plan,
          eq: "Check for associated Essex-Lopresti injury (distal radioulnar joint / interosseous membrane disruption)."
        };
      }
    },

    // ==========================================
    // D. HIP AND PELVIS
    // ==========================================
    {
      id: "gardenFemoralNeck",
      cat: "ortho",
      subcat: "Hip and Pelvis",
      name: "Garden Classification (Femoral Neck)",
      desc: "Classifies intracapsular femoral neck fractures by trabecular displacement (includes vector diagram).",
      fields: [
        S("stage", "AP Hip Radiograph Appearance", "I", [
          ["I", "Stage I — Incomplete or impacted valgus fracture; medial trabeculae angulated"],
          ["II", "Stage II — Complete non-displaced fracture; trabecular orientation preserved"],
          ["III", "Stage III — Complete with partial displacement; trabeculae out of line but still contact"],
          ["IV", "Stage IV — Completely displaced; trabeculae parallel with acetabular lines"]
        ])
      ],
      calc: v => {
        const displaced = v.stage === "III" || v.stage === "IV";
        let tx = displaced ? "High risk of osteonecrosis (~30–40%) & non-union: Hemiarthroplasty or Total Hip Arthroplasty in elderly; urgent anatomical reduction & internal fixation in young." : "Low non-union risk: In situ fixation with cannulated percutaneous screws.";
        
        // Inline SVG visual aid
        const svg = `
<svg width="220" height="95" viewBox="0 0 220 95" style="display:block;margin:10px auto;background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;">
  <path d="M 40 85 C 40 60, 50 45, 75 35 C 95 28, 115 15, 125 35 C 135 55, 110 70, 95 85 Z" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
  <line x1="60" y1="40" x2="105" y2="70" stroke="${displaced ? '#dc2626' : '#2563eb'}" stroke-width="3" stroke-dasharray="${displaced ? '4,4' : 'none'}"/>
  <text x="140" y="45" font-size="12" font-weight="bold" fill="#1e293b">${v.stage === "I" ? "Valgus Incomplete" : v.stage === "II" ? "Non-displaced" : v.stage === "III" ? "Partial Displ." : "Complete Displ."}</text>
  <text x="140" y="65" font-size="10" fill="${displaced ? '#dc2626' : '#16a34a'}">${displaced ? "Unstable / Displaced" : "Stable / Non-displaced"}</text>
</svg>`;

        return {
          value: "Garden Stage " + v.stage + " (" + (displaced ? "Displaced" : "Non-displaced") + ")",
          eq: svg + "\nGarden classification guides surgical fixation choice. Stages I–II are non-displaced; III–IV are displaced with interrupted retinacular vessels."
        };
      }
    },
    {
      id: "pauwelsAngle",
      cat: "ortho",
      subcat: "Hip and Pelvis",
      name: "Pauwels Classification of Femoral Neck Fractures",
      desc: "Biomechanical shear angle of the femoral neck fracture line.",
      fields: [
        N("angle", "Fracture Line Angle relative to Horizontal Plane (degrees)", 48, { min: 10, max: 90, step: 1 })
      ],
      calc: v => {
        const a = +v.angle;
        let c = "";
        let color = "#16a34a";
        if (a < 30) {
          c = "Pauwels Type I (<30°): Predominant compressive forces; lowest non-union rate.";
          color = "#16a34a";
        } else if (a <= 50) {
          c = "Pauwels Type II (30–50°): Moderate shear forces.";
          color = "#d97706";
        } else {
          c = "Pauwels Type III (>50°): High vertical shear forces; high risk of non-union & varus collapse.";
          color = "#dc2626";
        }

        const svg = `
<svg width="220" height="90" viewBox="0 0 220 90" style="display:block;margin:10px auto;background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;">
  <line x1="20" y1="65" x2="190" y2="65" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>
  <line x1="40" y1="65" x2="${40 + 80 * Math.cos(a * Math.PI / 180)}" y2="${65 - 80 * Math.sin(a * Math.PI / 180)}" stroke="${color}" stroke-width="3"/>
  <text x="125" y="35" font-size="12" font-weight="bold" fill="${color}">${a}° Angle</text>
  <text x="125" y="52" font-size="10" fill="#475569">${a < 30 ? "Compressive" : "Vertical Shear"}</text>
</svg>`;

        return {
          value: c,
          eq: svg + "\nType III fractures often require fixed-angle devices or valgus intertrochanteric osteotomy to convert shear forces into compression."
        };
      }
    },
    {
      id: "pipkinFemoralHead",
      cat: "ortho",
      subcat: "Hip and Pelvis",
      name: "Pipkin Classification (Femoral Head)",
      desc: "Femoral head fractures associated with posterior hip dislocations.",
      fields: [
        S("type", "Fracture location and associated injuries", "I", [
          ["I", "Type I — Fracture below fovea capitis femoris (infrafoveal, non-weightbearing)"],
          ["II", "Type II — Fracture above fovea capitis femoris (suprafoveal, weightbearing dome)"],
          ["III", "Type III — Type I or II fracture associated with a femoral neck fracture"],
          ["IV", "Type IV — Type I or II fracture associated with an acetabular fracture (typically posterior wall)"]
        ])
      ],
      calc: v => {
        let tx = v.type === "I" ? "Excision of small fragment if <1/3 surface; or internal fixation if large." : v.type === "II" ? "Anatomical rigid internal fixation (countersunk headless screws)." : v.type === "III" ? "Extremely high risk of osteonecrosis; arthroplasty preferred in older patients." : "Requires stabilization of both femoral head and acetabular wall.";
        return {
          value: "Pipkin Type " + v.type + " — " + tx,
          eq: "Emergent closed reduction of the hip dislocation must be performed within 6 hours to reduce avascular necrosis risk."
        };
      }
    },
    {
      id: "tonnisHipGrading",
      cat: "ortho",
      subcat: "Hip and Pelvis",
      name: "Tönnis Classification of Hip Osteoarthritis",
      desc: "Radiographic staging in hip dysplasia and osteoarthritis.",
      fields: [
        S("grade", "Radiographic joint findings", "1", [
          ["0", "Grade 0: Normal — No signs of osteoarthritis"],
          ["1", "Grade 1: Mild — Slight JSN, slight liping of joint margins, slight sclerosis"],
          ["2", "Grade 2: Moderate — Small subchondral cysts, moderate JSN, moderate loss of femoral head roundness"],
          ["3", "Grade 3: Severe — Severe JSN, large cysts, severe head deformity, extensive osteophytes"]
        ])
      ],
      calc: v => ({
        value: "Tönnis Grade " + v.grade,
        eq: "Used in pre-arthritic and dysplastic hips. Grade 2 or 3 typically precludes joint-preserving periacetabular osteotomy (PAO)."
      })
    },

    // ==========================================
    // E. SPINE AND BACK PAIN
    // ==========================================
    {
      id: "odiScore",
      cat: "ortho",
      subcat: "Spine and Back Pain",
      name: "Oswestry Disability Index (ODI)",
      desc: "Functional outcome questionnaire for low back pain and lumbar disability.",
      fields: [
        N("score", "Total points across 10 completed sections (0 to 50)", 16, { min: 0, max: 50, step: 1 })
      ],
      calc: v => {
        const pct = (+v.score / 50) * 100;
        let c = pct <= 20 ? "Minimal disability (0–20%)" : pct <= 40 ? "Moderate disability (21–40%)" : pct <= 60 ? "Severe disability (41–60%)" : pct <= 80 ? "Crippled (61–80%)" : "Bed-bound / exaggerated symptoms (81–100%)";
        return {
          value: Math.round(pct) + "% Disability — " + c,
          eq: "ODI (%) = (Score ÷ 50) × 100%. The minimally clinically important difference (MCID) is ~10–12 percentage points."
        };
      }
    },
    {
      id: "sinsSpine",
      cat: "ortho",
      subcat: "Spine and Back Pain",
      name: "SINS (Spinal Instability Neoplastic Score)",
      desc: "Identifies instability in neoplastic vertebral spine disease.",
      fields: [
        S("loc", "1. Location", "3", [["3", "Junctional (occiput-C2, C7-T1, T11-L1, L5-S1: +3)"], ["2", "Mobile spine (C3-C6, L2-L4: +2)"], ["1", "Semirigid (T2-T10: +1)"], ["0", "Rigid (S2-S5: 0)"]]),
        S("pain", "2. Pain quality", "3", [["3", "Mechanical / movement-related (+3)"], ["1", "True non-mechanical pain (+1)"], ["0", "Pain-free (0)"]]),
        S("bone", "3. Bone lesion quality", "2", [["2", "Lytic (+2)"], ["1", "Mixed lytic/blastic (+1)"], ["0", "Blastic (0)"]]),
        S("align", "4. Spinal alignment", "0", [["4", "Subluxation / translation present (+4)"], ["2", "De novo deformity (kyphosis/scoliosis: +2)"], ["0", "Normal alignment (0)"]]),
        S("collapse", "5. Vertebral body collapse", "0", [["3", ">50% collapse (+3)"], ["2", "<50% collapse (+2)"], ["1", "No collapse with >50% body involved (+1)"], ["0", "None of the above (0)"]]),
        S("posterolateral", "6. Posterolateral involvement", "0", [["3", "Bilateral (+3)"], ["1", "Unilateral (+1)"], ["0", "None (0)"]])
      ],
      calc: v => {
        const total = +v.loc + +v.pain + +v.bone + +v.align + +v.collapse + +v.posterolateral;
        let c = total <= 6 ? "Stable (0–6 points; radiotherapy/systemic therapy without surgery)" : total <= 12 ? "Potentially Unstable (7–12 points; surgical consultation recommended)" : "UNSTABLE (13–18 points; spinal surgical stabilization indicated)";
        return {
          value: total + " / 18 points — " + c,
          eq: "SINS: Location (0–3), Pain (0–3), Bone lesion (0–2), Alignment (0–4), Collapse (0–3), Posterolateral involvement (0–3)."
        };
      }
    },
    {
      id: "tlicsSpine",
      cat: "ortho",
      subcat: "Spine and Back Pain",
      name: "TLICS Score (Thoracolumbar Trauma)",
      desc: "Thoracolumbar Injury Classification and Severity Score for surgical decision-making.",
      fields: [
        S("morph", "1. Fracture Morphology", "1", [
          ["1", "Compression / burst: simple compression (+1)"],
          ["2", "Burst fracture (+2)"],
          ["3", "Translation / rotation (+3)"],
          ["4", "Distraction injury (+4)"]
        ]),
        S("plc", "2. Posterior Ligamentous Complex (PLC)", "0", [
          ["0", "Intact (0)"],
          ["2", "Suspected / indeterminate (+2)"],
          ["3", "Definite disruption (+3)"]
        ]),
        S("neuro", "3. Neurological Status", "0", [
          ["0", "Intact (0)"],
          ["2", "Nerve root injury (+2)"],
          ["2b", "Complete spinal cord injury (+2)"],
          ["3", "Incomplete spinal cord injury (+3)"],
          ["3b", "Cauda equina syndrome (+3)"]
        ])
      ],
      calc: v => {
        const nPts = (v.neuro === "2" || v.neuro === "2b") ? 2 : (v.neuro === "3" || v.neuro === "3b") ? 3 : 0;
        const total = +v.morph + +v.plc + nPts;
        let c = total <= 3 ? "Non-operative management (TLICS ≤3)" : total === 4 ? "Surgeon's discretion / non-operative or operative (TLICS = 4)" : "Operative stabilization indicated (TLICS ≥5)";
        return {
          value: total + " points — " + c,
          eq: "TLICS = Morphology (1–4) + PLC integrity (0–3) + Neurological status (0–3). Score ≥5 favors surgical stabilization."
        };
      }
    },
    {
      id: "meyerdingSpondylo",
      cat: "ortho",
      subcat: "Spine and Back Pain",
      name: "Meyerding Grading of Spondylolisthesis",
      desc: "Quantifies anterior vertebral translation percentage.",
      fields: [
        N("slip", "Anterior translation percentage (%)", 30, { min: 0, max: 150, step: 1 })
      ],
      calc: v => {
        const s = +v.slip;
        let g = s <= 25 ? "Grade I (<25% slip)" : s <= 50 ? "Grade II (25–50% slip)" : s <= 75 ? "Grade III (51–75% slip)" : s <= 100 ? "Grade IV (76–100% slip)" : "Grade V: Spondyloptosis (>100% complete slip off sacrum)";
        return {
          value: "Meyerding " + g,
          eq: "Grades I–II are low-grade; Grades III–V are high-grade spondylolisthesis requiring reduction and fusion considerations."
        };
      }
    },
    {
      id: "cobbAngleCalc",
      cat: "ortho",
      subcat: "Spine and Back Pain",
      name: "Cobb Angle Calculator (Scoliosis)",
      desc: "Calculates coronal or sagittal spinal curve magnitude.",
      fields: [
        N("top_tilt", "Upper endplate tilt angle from horizontal (degrees)", 18, { min: 0, max: 90, step: 0.5 }),
        N("bot_tilt", "Lower endplate tilt angle from horizontal (degrees)", 24, { min: 0, max: 90, step: 0.5 })
      ],
      calc: v => {
        const cobb = +v.top_tilt + +v.bot_tilt;
        let c = cobb < 10 ? "Not diagnostic of scoliosis (<10°)" : cobb <= 25 ? "Mild scoliosis (10–25°; observation)" : cobb <= 40 ? "Moderate scoliosis (25–40°; bracing consideration in growing child)" : "Severe scoliosis (>40–50°; surgical correction consideration)";
        return {
          value: cobb.toFixed(1) + "° Cobb Angle — " + c,
          eq: "Cobb Angle = Sum of angles between the most tilted upper and lower end vertebrae relative to horizontal."
        };
      }
    },

    // ==========================================
    // F. BONE HEALTH AND OSTEOPOROSIS
    // ==========================================
    {
      id: "tscoreBmd",
      cat: "ortho",
      subcat: "Bone Health and Osteoporosis",
      name: "T-Score and BMD Classification",
      desc: "WHO criteria for DXA bone mineral density assessment.",
      fields: [
        N("tscore", "Lowest DXA T-Score", -2.8, { min: -6.0, max: 3.0, step: 0.1 }),
        S("fragility", "History of adult low-trauma / fragility fracture?", "0", [["0", "No"], ["1", "Yes"]])
      ],
      calc: v => {
        const t = +v.tscore, fx = v.fragility === "1";
        let c = "";
        if (t <= -2.5 && fx) c = "Severe (Established) Osteoporosis";
        else if (t <= -2.5) c = "Osteoporosis";
        else if (t < -1.0) c = "Osteopenia (Low bone mass)";
        else c = "Normal Bone Mineral Density";
        return {
          value: c + " (T-score: " + t.toFixed(1) + ")",
          eq: "Normal: ≥ −1.0; Osteopenia: −1.0 to −2.5; Osteoporosis: ≤ −2.5. Clinical diagnosis of osteoporosis can also be made in the presence of a fragility fracture regardless of T-score."
        };
      }
    },

    // ==========================================
    // G. FRACTURE-SPECIFIC CLASSIFICATIONS
    // ==========================================
    {
      id: "schatzkerTibialPlateau",
      cat: "ortho",
      subcat: "Fracture-Specific Classifications",
      name: "Schatzker Tibial Plateau Classification",
      desc: "Classifies unicondylar vs bicondylar tibial plateau fractures (includes vector diagram).",
      fields: [
        S("type", "Fracture pattern", "II", [
          ["I", "Type I — Pure split fracture of lateral tibial plateau (<4 mm depression)"],
          ["II", "Type II — Split-depression fracture of lateral plateau (most common)"],
          ["III", "Type III — Pure central depression of lateral plateau without split"],
          ["IV", "Type IV — Medial plateau fracture (high energy; check peroneal nerve & popliteal artery)"],
          ["V", "Type V — Bicondylar plateau fracture (both medial & lateral fractured)"],
          ["VI", "Type VI — Plateau fracture with metaphyseal-diaphyseal dissociation"]
        ])
      ],
      calc: v => {
        let desc = (v.type === "I" || v.type === "II" || v.type === "III") ? "Unicondylar Lateral Plateau Injury" : "High-Energy Complex Plateau Injury (Types IV–VI)";
        
        // Inline SVG showing split/depression
        const isBicondylar = v.type === "V" || v.type === "VI";
        const isMedial = v.type === "IV";
        const svg = `
<svg width="220" height="90" viewBox="0 0 220 90" style="display:block;margin:10px auto;background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;">
  <!-- Tibial plateau outline -->
  <path d="M 40 25 C 70 20, 85 30, 110 30 C 135 30, 150 20, 180 25 L 160 85 L 60 85 Z" fill="#e2e8f0" stroke="#334155" stroke-width="2"/>
  <!-- Fracture lines -->
  <line x1="${isMedial ? 60 : 155}" y1="23" x2="${isMedial ? 75 : 140}" y2="55" stroke="#ef4444" stroke-width="3"/>
  ${isBicondylar ? '<line x1="60" y1="23" x2="75" y2="55" stroke="#ef4444" stroke-width="3"/>' : ''}
  <text x="110" y="70" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Schatzker ${v.type}</text>
</svg>`;

        return {
          value: "Schatzker Type " + v.type + " — " + desc,
          eq: svg + "\nTypes I–III: Lateral approach. Types IV–VI: Dual-incision or circular external fixator; high risk of compartment syndrome."
        };
      }
    },
    {
      id: "weberAnkle",
      cat: "ortho",
      subcat: "Fracture-Specific Classifications",
      name: "Weber / Danis–Weber Ankle Classification",
      desc: "Fibula fracture level relative to the distal tibiofibular syndesmosis.",
      fields: [
        S("type", "Fibula fracture level", "B", [
          ["A", "Weber A — Infrasyndesmotic (below ankle joint line; syndesmosis intact; usually stable)"],
          ["B", "Weber B — Trans-syndesmotic (at level of joint line; syndesmosis variable)"],
          ["C", "Weber C — Suprasyndesmotic (above joint line; syndesmosis disrupted; unstable)"]
        ]),
        S("medial", "Associated medial clear space widening (>4 mm) or deltoid rupture?", "0", [["0", "No"], ["1", "Yes (Unstable bimalleolar equivalent)"]])
      ],
      calc: v => {
        let op = (v.type === "C" || (v.type === "B" && v.medial === "1")) ? "Unstable: Operative fixation (ORIF) and syndesmotic assessment required." : "Potentially stable: Weight-bearing splint/boot if medial side intact.";
        return {
          value: "Danis–Weber Type " + v.type + " — " + op,
          eq: "Weber A: Supination-adduction. Weber B: Pronation-eversion or supination-external rotation. Weber C: Requires syndesmotic screw/suture-button fixation if unstable."
        };
      }
    },
    {
      id: "salterHarris",
      cat: "ortho",
      subcat: "Fracture-Specific Classifications",
      name: "Salter–Harris Physeal Fracture Classification",
      desc: "Pediatric growth plate fractures (includes SALTR vector diagram).",
      fields: [
        S("type", "Fracture plane relative to growth plate", "II", [
          ["I", "Type I (Slipped) — Complete separation through physis only (radiographs may look normal)"],
          ["II", "Type II (Above) — Physis extending into Metaphysis (Thurston–Holland sign; most common ~75%)"],
          ["III", "Type III (Lower) — Physis extending into Epiphysis / intra-articular"],
          ["IV", "Type IV (Through) — Fracture line extends through Metaphysis, Physis, AND Epiphysis"],
          ["V", "Type V (Rammed) — Compression / crush injury to physis"]
        ])
      ],
      calc: v => {
        const t = v.type;
        let risk = (t === "I" || t === "II") ? "Good prognosis for growth arrest with closed reduction" : "High risk of partial growth arrest, physeal bar, and angular deformity (requires anatomical reduction)";
        
        // Inline SVG showing SALTR mnemonic
        const svg = `
<svg width="220" height="90" viewBox="0 0 220 90" style="display:block;margin:10px auto;background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;">
  <!-- Metaphysis (top) -->
  <rect x="40" y="10" width="140" height="30" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/>
  <text x="110" y="28" font-size="9" fill="#64748b" text-anchor="middle">METAPHYSIS</text>
  <!-- Physis (middle line) -->
  <line x1="35" y1="45" x2="185" y2="45" stroke="#3b82f6" stroke-width="4"/>
  <!-- Epiphysis (bottom) -->
  <rect x="40" y="50" width="140" height="30" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
  <text x="110" y="68" font-size="9" fill="#64748b" text-anchor="middle">EPIPHYSIS</text>
  <!-- Red fracture marker -->
  <circle cx="110" cy="45" r="7" fill="#ef4444"/>
</svg>`;

        return {
          value: "Salter–Harris Type " + t + " — " + risk,
          eq: svg + "\nSALTR Mnemonic: I = Slipped, II = Above (metaphysis), III = Lower (epiphysis), IV = Through all, V = Rammed (crush)."
        };
      }
    },
    {
      id: "tilePelvis",
      cat: "ortho",
      subcat: "Fracture-Specific Classifications",
      name: "Tile Classification of Pelvic Ring Fractures",
      desc: "Categorizes stability of pelvic ring based on integrity of posterior sacroiliac complex.",
      fields: [
        S("type", "Pelvic ring stability", "A", [
          ["A", "Tile Type A: Stable — Posterior sacroiliac arch completely intact (avulsions, isolated pubic rami)"],
          ["B", "Tile Type B: Rotationally unstable, vertically stable (open-book / lateral compression)"],
          ["C", "Tile Type C: Rotationally AND vertically unstable (complete disruption of posterior sacroiliac complex)"]
        ])
      ],
      calc: v => {
        let plan = v.type === "A" ? "Weight-bearing as tolerated with mobilization." : v.type === "B" ? "Pelvic binder; internal or external fixation to restore pelvic volume." : "High mortality from retroperitoneal hemorrhage. Emergent binder/C-clamp, pelvic packing, and surgical reconstruction.";
        return {
          value: "Tile " + v.type + " Pelvic Fracture — " + plan,
          eq: "Type B1 = Open book (AP compression); Type B2 = Lateral compression; Type C = Vertical shear (complete posterior ring disruption)."
        };
      }
    },

    // ==========================================
    // H. COMPARTMENT SYNDROME AND LIMB TRAUMA
    // ==========================================
    {
      id: "deltaPressure",
      cat: "ortho",
      subcat: "Compartment Syndrome and Limb Trauma",
      name: "Compartment Pressure Perfusion Gradient (ΔP)",
      desc: "Calculates tissue perfusion gradient (Diastolic BP − Compartment Pressure).",
      fields: [
        N("dbp", "Diastolic Blood Pressure (mmHg)", 75, { min: 30, max: 150 }),
        N("cp", "Measured Intracompartmental Pressure (mmHg)", 52, { min: 0, max: 120 })
      ],
      calc: v => {
        const delta = +v.dbp - +v.cp;
        let c = delta <= 30 ? "CRITICAL ISCHEMIA (ΔP ≤30 mmHg): Emergent fasciotomy strongly indicated" : "Perfusion preserved (ΔP >30 mmHg; repeat measurements and serial exams indicated)";
        return {
          value: "ΔP = " + delta + " mmHg — " + c,
          eq: "Formula: ΔP = Diastolic BP − Compartment Pressure. ΔP ≤30 mmHg is more reliable than absolute pressure (>30 mmHg) in hypotensive patients."
        };
      }
    },
    {
      id: "abiCalc",
      cat: "ortho",
      subcat: "Compartment Syndrome and Limb Trauma",
      name: "Ankle–Brachial Index (ABI) in Trauma",
      desc: "Screens for occult arterial injury in extremity trauma and knee dislocations.",
      fields: [
        N("ankle_sbp", "Highest Systolic Pressure in Injured Ankle (DP or PT, mmHg)", 115, { min: 20, max: 250 }),
        N("arm_sbp", "Highest Brachial Systolic Pressure in Arm (mmHg)", 125, { min: 50, max: 250 })
      ],
      calc: v => {
        const abi = +v.ankle_sbp / +v.arm_sbp;
        let c = abi < 0.90 ? "ABNORMAL (ABI <0.90): High suspicion for major arterial injury; prompt CT Angiography indicated" : "Normal extremity perfusion (ABI ≥0.90)";
        return {
          value: "ABI: " + abi.toFixed(2) + " — " + c,
          eq: "ABI = Ankle SBP ÷ Brachial SBP. Knee dislocations with ABI <0.90 require immediate vascular imaging to evaluate popliteal artery."
        };
      }
    },
    {
      id: "messScore",
      cat: "ortho",
      subcat: "Compartment Syndrome and Limb Trauma",
      name: "Mangled Extremity Severity Score (MESS)",
      desc: "Predicts primary salvageability vs amputation in high-energy lower-extremity trauma.",
      fields: [
        S("skeletal", "Skeletal / Soft-tissue injury", "1", [
          ["1", "Low energy (stab, simple gunshot, closed fracture: +1)"],
          ["2", "Medium energy (open or multiple fractures, dislocation: +2)"],
          ["3", "High energy (close-range shotgun, crush, high-velocity military: +3)"],
          ["4", "Very high energy (gross contamination, severe tissue avulsion: +4)"]
        ]),
        S("ischemia", "Limb Ischemia", "1", [
          ["1", "Pulse reduced or absent without tissue ischemia signs (+1)"],
          ["2", "Pulseless, paresthesias, diminished capillary refill (+2)"],
          ["3", "Cool, paralyzed, insensate limb (+3)"]
        ]),
        S("prolonged", "Ischemia time >6 hours?", "0", [["0", "No (<6 hours)"], ["1", "Yes (double the ischemia points)"]]),
        S("shock", "Shock / Hypotension", "0", [
          ["0", "Systolic BP consistently >90 mmHg (0)"],
          ["1", "Transient hypotension (+1)"],
          ["2", "Persistent hypotension (+2)"]
        ]),
        S("age", "Patient Age", "0", [
          ["0", "<30 years (0)"],
          ["1", "30–49 years (+1)"],
          ["2", "≥50 years (+2)"]
        ])
      ],
      calc: v => {
        const isch = +v.prolonged === 1 ? +v.ischemia * 2 : +v.ischemia;
        const total = +v.skeletal + isch + +v.shock + +v.age;
        let c = total >= 7 ? "Score ≥7: Amputation predicted (~100% specificity in original validation)" : "Score <7: Limb salvage supported";
        return {
          value: total + " points — " + c,
          eq: "MESS evaluates Skeletal injury (1–4), Ischemia (1–3, doubled if >6h), Shock (0–2), and Age (0–2)."
        };
      }
    },
    {
      id: "nexusSpine",
      cat: "ortho",
      subcat: "Compartment Syndrome and Limb Trauma",
      name: "NEXUS Cervical Spine Criteria",
      desc: "Low-risk criteria safely ruling out C-spine radiography in blunt trauma.",
      fields: [
        S("midline", "1. Focal midline cervical spine tenderness", "0", [["0", "No tenderness"], ["1", "Present"]]),
        S("neuro", "2. Focal neurological deficit", "0", [["0", "No deficit"], ["1", "Present"]]),
        S("alert", "3. Normal alertness (GCS 15, oriented)", "1", [["1", "Normal alertness"], ["0", "Altered mental status"]]),
        S("intox", "4. Intoxication evidence", "0", [["0", "No intoxication"], ["1", "Intoxicated"]]),
        S("distracting", "5. Painful distracting injury (e.g. long-bone fracture, large burn)", "0", [["0", "None"], ["1", "Present"]])
      ],
      calc: v => {
        const cleared = +v.midline === 0 && +v.neuro === 0 && +v.alert === 1 && +v.intox === 0 && +v.distracting === 0;
        return {
          value: cleared ? "NEXUS CLEARED — No C-spine imaging required" : "NEXUS FAILED — C-spine imaging indicated (CT cervical spine)",
          eq: "All 5 low-risk criteria must be satisfied to safely clear the cervical spine without radiographic imaging (>99% sensitivity)."
        };
      }
    },

    // ==========================================
    // I. FUNCTIONAL OUTCOME AND REHABILITATION
    // ==========================================
    {
      id: "lefsScore",
      cat: "ortho",
      subcat: "Functional Outcome and Rehabilitation",
      name: "Lower Extremity Functional Scale (LEFS)",
      desc: "Self-reported functional mobility scale for lower extremity conditions.",
      fields: [
        N("total", "Sum score of 20 functional items (0 to 80)", 54, { min: 0, max: 80, step: 1 })
      ],
      calc: v => {
        const pct = (+v.total / 80) * 100;
        return {
          value: +v.total + " / 80 points (" + Math.round(pct) + "% function)",
          eq: "LEFS evaluates 20 daily activities from 0 (extreme difficulty) to 4 (no difficulty). The minimal detectable change is 9 points."
        };
      }
    },
    {
      id: "tugTest",
      cat: "ortho",
      subcat: "Functional Outcome and Rehabilitation",
      name: "Timed Up and Go (TUG) Test",
      desc: "Quantifies functional mobility, balance, and fall risk.",
      fields: [
        N("seconds", "Time to rise, walk 3m, turn, and sit (seconds)", 11.5, { min: 3, max: 90, step: 0.5 })
      ],
      calc: v => {
        const t = +v.seconds;
        let c = t < 10 ? "Normal mobility (<10s)" : t <= 20 ? "Good mobility; independent without walking aid (10–20s)" : t <= 30 ? "Impaired mobility; high fall risk (21–30s)" : "Severely impaired mobility (>30s)";
        return {
          value: t.toFixed(1) + " seconds — " + c,
          eq: "TUG evaluates transition from seated to standing, walking speed, and rotational balance."
        };
      }
    },
    {
      id: "lysholmKnee",
      cat: "ortho",
      subcat: "Functional Outcome and Rehabilitation",
      name: "Lysholm Knee Scoring Scale",
      desc: "Evaluates ligamentous and meniscal knee outcomes.",
      fields: [
        N("score", "Total Lysholm score (0 to 100)", 84, { min: 0, max: 100, step: 1 })
      ],
      calc: v => {
        const s = +v.score;
        let c = s >= 95 ? "Excellent (95–100)" : s >= 84 ? "Good (84–94)" : s >= 65 ? "Fair (65–83)" : "Poor (<65)";
        return {
          value: s + " / 100 points — " + c,
          eq: "Scores Limp (5), Support (5), Locking (15), Instability (25), Pain (25), Swelling (10), Stairs (10), Squatting (5)."
        };
      }
    },

    // ==========================================
    // J. ORTHOPEDIC INFECTION AND POSTOPERATIVE
    // ==========================================
    {
      id: "friReference",
      cat: "ortho",
      subcat: "Orthopedic Infection and Postoperative Assessment",
      name: "Fracture-Related Infection (FRI) Criteria",
      desc: "International consensus definition for infection after fracture fixation.",
      fields: [
        S("fistula", "Sinus tract, fistula, or wound breakdown to bone/hardware", "0", [["0", "No"], ["1", "Yes (Definitive)"]]),
        S("pus", "Purulent drainage from wound or pus during surgery", "0", [["0", "No"], ["1", "Yes (Definitive)"]]),
        S("culture", "≥2 separate deep intraoperative cultures with identical pathogen", "0", [["0", "No"], ["1", "Yes (Definitive)"]]),
        S("histo", "Histopathology: >5 neutrophils per high-power field in tissue", "0", [["0", "No"], ["1", "Yes (Definitive)"]])
      ],
      calc: v => {
        const definite = +v.fistula === 1 || +v.pus === 1 || +v.culture === 1 || +v.histo === 1;
        return {
          value: definite ? "CONFIRMED Fracture-Related Infection (FRI)" : "Definitive criteria not met (correlate clinical signs: warmth, erythema, ESR/CRP)",
          eq: "FRI Consensus: Presence of any single definitive criterion confirms fracture-related infection."
        };
      }
    },
    {
      id: "pjiCriteria",
      cat: "ortho",
      subcat: "Orthopedic Infection and Postoperative Assessment",
      name: "Periprosthetic Joint Infection (PJI) ICM Score",
      desc: "2018 International Consensus Meeting definition for hip and knee arthroplasty infection.",
      fields: [
        S("sinus", "Sinus tract communicating with prosthesis or 2 positive identical cultures", "0", [["0", "No"], ["1", "Yes (Definite Major Criterion)"]]),
        S("crp", "Elevated serum CRP (>10 mg/L) or D-Dimer (>860 ng/mL)", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        S("esr", "Elevated serum ESR (>30 mm/h)", "0", [["0", "No (0)"], ["1", "Yes (+1)"]]),
        S("syn_wbc", "Elevated synovial WBC count (>3,000 cells/µL)", "0", [["0", "No (0)"], ["3", "Yes (+3)"]]),
        S("syn_pmn", "Elevated synovial PMN percentage (>70–80%)", "0", [["0", "No (0)"], ["2", "Yes (+2)"]]),
        S("leukocyte", "Positive synovial leukocyte esterase or alpha-defensin", "0", [["0", "No (0)"], ["3", "Yes (+3)"]])
      ],
      calc: v => {
        if (v.sinus === "1") {
          return { value: "DEFINITE PJI (Major Criterion present)", eq: "A sinus tract or ≥2 positive cultures confirms PJI without needing scoring." };
        }
        const pts = +v.crp + +v.esr + +v.syn_wbc + +v.syn_pmn + +v.leukocyte;
        let c = pts >= 6 ? "Infected (PJI confirmed: score ≥6)" : pts >= 2 ? "Inconclusive / Possible PJI (score 2–5; further workup needed)" : "Not infected (score 0–1)";
        return {
          value: pts + " points — " + c,
          eq: "ICM 2018 criteria. Thresholds for acute postoperative infections (<6 weeks) use higher synovial cut-offs (>10,000 WBC/µL)."
        };
      }
    },
    {
      id: "synovialFluidRef",
      cat: "ortho",
      subcat: "Orthopedic Infection and Postoperative Assessment",
      name: "Synovial Fluid Cell Count Interpretation",
      desc: "Differential diagnosis of native joint synovial fluid aspiration.",
      fields: [
        N("wbc", "Synovial Fluid WBC Count (/µL)", 65000, { min: 0, max: 300000, step: 500 }),
        N("pmn", "Polymorphonuclear leukocytes (PMN, %)", 88, { min: 0, max: 100, step: 1 })
      ],
      calc: v => {
        const w = +v.wbc, p = +v.pmn;
        let dx = "";
        if (w > 50000 && p > 75) dx = "SEPTIC ARTHRITIS (>50,000 WBC/µL, >75% PMN; emergent washout indicated)";
        else if (w >= 2000) dx = "Inflammatory joint fluid (2,000–50,000 WBC/µL; crystal arthropathy, RA, reactive arthritis)";
        else if (w >= 200) dx = "Non-inflammatory joint fluid (200–2,000 WBC/µL; osteoarthritis, trauma)";
        else dx = "Normal synovial fluid (<200 WBC/µL, <25% PMN)";
        return {
          value: dx,
          eq: "Crystals (monosodium urate or CPPD) and Gram stain/culture must be evaluated on all aspirations."
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