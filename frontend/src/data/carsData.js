// Automotive Catalog Data & Customization Options for AutoMorph AI

export const CARS_DATA = [
  {
    id: "bmw-m3",
    name: "BMW M3 Competition",
    manufacturer: "BMW",
    tagline: "High-Performance Sports Sedan with Pure Motorsport Pedigree",
    basePrice: 76000,
    image: "/images/bmw_m3.jpg",
    accentColor: "#1e3a8a",
    specs: {
      horsepower: 503,
      torqueNm: 650,
      displacementCi: 183, // 3.0L Twin-Turbo Inline-6 (~183 cu in)
      cylinders: 6,
      weightLbs: 3890,
      drivetrain: "RWD / xDrive",
      transmission: "8-Speed M Steptronic",
      topSpeedMph: 180,
      stockAcceleration060: 3.8, // Factory reference
      modelYear: 82, // Comparable ML scale mapping
      origin: 2 // Europe
    },
    description: "The BMW M3 Competition represents the pinnacle of performance sedan engineering. Powered by an M TwinPower Turbo 3.0-liter inline 6-cylinder engine delivering 503 HP to an adaptive chassis."
  },
  {
    id: "toyota-supra",
    name: "Toyota GR Supra 3.0",
    manufacturer: "Toyota",
    tagline: "Purist Performance Coupe Engineered for Track & Street Precision",
    basePrice: 57500,
    image: "/images/toyota_supra.jpg",
    accentColor: "#b91c1c",
    specs: {
      horsepower: 382,
      torqueNm: 500,
      displacementCi: 183, // 3.0L Turbo Inline-6
      cylinders: 6,
      weightLbs: 3400,
      drivetrain: "RWD",
      transmission: "6-Speed Manual / 8-Speed Auto",
      topSpeedMph: 155,
      stockAcceleration060: 3.9,
      modelYear: 82,
      origin: 3 // Asia
    },
    description: "Designed from the ground up to deliver uncompromised driving pleasure, the Toyota GR Supra combines a 382 HP turbocharged 3.0L engine with a perfect 50:50 front-to-rear weight balance."
  },
  {
    id: "porsche-911",
    name: "Porsche 911 Carrera S",
    manufacturer: "Porsche",
    tagline: "The Benchmark Rear-Engine Sports Car for Timeless Performance",
    basePrice: 131300,
    image: "/images/porsche_911.jpg",
    accentColor: "#c2410c",
    specs: {
      horsepower: 443,
      torqueNm: 530,
      displacementCi: 182, // 3.0L Twin-Turbo Boxer-6
      cylinders: 6,
      weightLbs: 3350,
      drivetrain: "RWD",
      transmission: "8-Speed Porsche Doppelkupplung (PDK)",
      topSpeedMph: 191,
      stockAcceleration060: 3.5,
      modelYear: 82,
      origin: 2 // Europe
    },
    description: "The quintessential sports car. With its twin-turbo flat-six engine mounted behind the rear axle, the 911 Carrera S yields unmatched traction, balance, and precision dynamics."
  },
  {
    id: "nissan-gtr",
    name: "Nissan GT-R Nismo",
    manufacturer: "Nissan",
    tagline: "The Legendary Supercar Killer with ATTESA E-TS All-Wheel Traction",
    basePrice: 221000,
    image: "/images/nissan_gtr.jpg",
    accentColor: "#dc2626",
    specs: {
      horsepower: 600,
      torqueNm: 652,
      displacementCi: 232, // 3.8L Twin-Turbo V6
      cylinders: 6,
      weightLbs: 3865,
      drivetrain: "ATTESA E-TS AWD",
      transmission: "6-Speed Dual-Clutch",
      topSpeedMph: 205,
      stockAcceleration060: 2.9,
      modelYear: 82,
      origin: 3 // Asia
    },
    description: "Godzilla returns with hand-built VR38DETT twin-turbo V6 power, carbon aerodynamic bodywork, and relentless cornering grip."
  },
  {
    id: "corvette-c8",
    name: "Chevrolet Corvette C8 Z06",
    manufacturer: "Chevrolet",
    tagline: "Mid-Engine American Supercar featuring LT6 Flat-Plane V8 Power",
    basePrice: 106500,
    image: "/images/corvette_c8.jpg",
    accentColor: "#eab308",
    specs: {
      horsepower: 670,
      torqueNm: 624,
      displacementCi: 335, // 5.5L LT6 Flat-Plane V8
      cylinders: 8,
      weightLbs: 3434,
      drivetrain: "RWD",
      transmission: "8-Speed Dual-Clutch",
      topSpeedMph: 195,
      stockAcceleration060: 2.6,
      modelYear: 82,
      origin: 1 // USA
    },
    description: "The C8 Z06 redefines American performance with a naturally aspirated 5.5L flat-plane V8 screaming to an 8,600 RPM redline."
  },
  {
    id: "ford-mustang",
    name: "Ford Mustang Shelby GT500",
    manufacturer: "Ford",
    tagline: "Raw Muscle Power with 760 HP Supercharged Predator V8 Engine",
    basePrice: 79400,
    image: "/images/ford_mustang.jpg",
    accentColor: "#2563eb",
    specs: {
      horsepower: 760,
      torqueNm: 847,
      displacementCi: 317, // 5.2L Supercharged V8
      cylinders: 8,
      weightLbs: 4171,
      drivetrain: "RWD",
      transmission: "7-Speed Tremec Dual-Clutch",
      topSpeedMph: 180,
      stockAcceleration060: 3.3,
      modelYear: 82,
      origin: 1 // USA
    },
    description: "The pinnacle of Mustang performance. Featuring a 2.65L Eaton supercharger bolted onto a 5.2L cross-plane V8 for unmatched quarter-mile acceleration."
  },
  {
    id: "audi-r8",
    name: "Audi R8 V10 Performance",
    manufacturer: "Audi",
    tagline: "High-Revving Naturally Aspirated V10 Mid-Engine Exotic",
    basePrice: 158600,
    image: "/images/audi_r8.jpg",
    accentColor: "#0284c7",
    specs: {
      horsepower: 602,
      torqueNm: 560,
      displacementCi: 317, // 5.2L FSI V10
      cylinders: 10,
      weightLbs: 3594,
      drivetrain: "Quattro AWD",
      transmission: "7-Speed S tronic Dual-Clutch",
      topSpeedMph: 205,
      stockAcceleration060: 3.1,
      modelYear: 82,
      origin: 2 // Europe
    },
    description: "Shared motorsport architecture with GT3 racers. The Audi R8 combines a spine-tingling 5.2L FSI V10 with Quattro dynamic all-wheel drive."
  },
  {
    id: "lamborghini-huracan",
    name: "Lamborghini Huracán EVO",
    manufacturer: "Lamborghini",
    tagline: "Unadulterated Italian Supercar Emotion with Active Aerodynamics",
    basePrice: 208000,
    image: "/images/lamborghini_huracan.jpg",
    accentColor: "#16a34a",
    specs: {
      horsepower: 631,
      torqueNm: 600,
      displacementCi: 317, // 5.2L V10
      cylinders: 10,
      weightLbs: 3135,
      drivetrain: "AWD",
      transmission: "7-Speed Dual-Clutch",
      topSpeedMph: 202,
      stockAcceleration060: 2.9,
      modelYear: 82,
      origin: 2 // Europe
    },
    description: "Razor-sharp Italian design backed by LDVI predictive dynamics, titanium intake valves, and a screaming 631 HP V10."
  }
];

export const CUSTOMIZATION_OPTIONS = {
  paints: [
    { id: "isle_green", name: "Isle of Man Green", hex: "#154734", finish: "Metallic Gloss", price: 0 },
    { id: "renaissance_red", name: "Renaissance Red", hex: "#b91c1c", finish: "High Gloss", price: 650 },
    { id: "gt_silver", name: "GT Silver Metallic", hex: "#8a959e", finish: "Metallic Gloss", price: 850 },
    { id: "stealth_black", name: "Stealth Satin Black", hex: "#1c1d21", finish: "Satin Matte", price: 1200 },
    { id: "chalk_white", name: "Chalk Pure White", hex: "#e5e7eb", finish: "Gloss Lacquer", price: 0 },
    { id: "miami_blue", name: "Miami Riviera Blue", hex: "#0284c7", finish: "Vibrant Gloss", price: 1500 },
    { id: "speed_yellow", name: "Speed Racing Yellow", hex: "#eab308", finish: "Motorsport Gloss", price: 1100 },
    { id: "nardo_gray", name: "Nardo Performance Gray", hex: "#64748b", finish: "Solid Gloss", price: 950 }
  ],
  wheels: [
    { id: "oem_mesh", name: '19"/20" M Forged Double-Spoke', finish: "Silver Polish", color: "#c0c8d0", price: 0 },
    { id: "gloss_black", name: '20" Satin Black Performance Alloy', finish: "Gloss Black", color: "#181818", price: 1250 },
    { id: "bronze_forged", name: '20" Lightweight Bronze Forged', finish: "Matte Bronze", color: "#7d5a0a", price: 2400 },
    { id: "carbon_aero", name: '21" Carbon Composite Aerodynamic', finish: "Carbon Weave", color: "#242426", price: 3800 },
    { id: "titanium_silver", name: '20" Monoblock Titanium Flow-Form', finish: "Brushed Titanium", color: "#8b929a", price: 1950 },
    { id: "motorsport_gold", name: '19" GT Cup Competition Gold', finish: "Anodized Gold", color: "#b48c28", price: 2750 }
  ],
  spoilers: [
    { id: "factory_lip", name: "Factory Integrated Trunk Lip", price: 0, description: "Subtle aerodynamic lip flush with factory trunk contour." },
    { id: "carbon_ducktail", name: "Carbon Fiber Ducktail Spoiler", price: 950, description: "Extended rear upward kick with exposed carbon fiber weave." },
    { id: "gt_track_wing", name: "GT3 High-Downforce Rear Wing", price: 2800, description: "Motorsport dual-tier aluminum uprights with wide carbon blade." },
    { id: "swan_neck_wing", name: "Apex Swan-Neck Competition Wing", price: 3600, description: "Top-mounted swan-neck stanchions for maximized clean airflow." }
  ],
  bodyKits: [
    { id: "stock_aero", name: "Standard Factory Aerodynamics", price: 0, description: "Clean OEM factory bumpers, rockers, and underbody valence." },
    { id: "m_perf_package", name: "M Performance Carbon Aero Package", price: 3200, description: "Front carbon splitter blades, aerodynamic side blades, and diffuser fins." },
    { id: "track_aerokit", name: "Widebody Track Aerokit & Stance Package", price: 5900, description: "Extended race splitter, deep aero side skirts, rear race diffuser, and wide arches." }
  ],
  frontSplitters: [
    { id: "splitter_stock", name: "OEM Factory Bumper Lower Lip", price: 0 },
    { id: "splitter_carbon_blade", name: "Carbon Fiber Front Splitter Blade", price: 1100 },
    { id: "splitter_track_canards", name: "Track Extended Splitter with Aerodynamic Canards", price: 2200 }
  ],
  sideSkirts: [
    { id: "skirt_stock", name: "OEM Factory Rocker Panels", price: 0 },
    { id: "skirt_carbon_extensions", name: "Carbon Fiber Side Skirt Extensions", price: 1250 },
    { id: "skirt_track_aero", name: "Ground-Effect Aerodynamic Air-Guides", price: 1850 }
  ],
  rearDiffusers: [
    { id: "diffuser_stock", name: "Standard Factory Valence Diffuser", price: 0 },
    { id: "diffuser_carbon_finned", name: "Quad-Fin Carbon Fiber Rear Diffuser", price: 1650 },
    { id: "diffuser_race_tunnels", name: "Full Venturi Tunnel Underbody Diffuser", price: 2900 }
  ],
  hoods: [
    { id: "hood_stock", name: "Standard Factory Hood", price: 0, finish: "Painted OEM" },
    { id: "hood_carbon_lightweight", name: "Full Weave Carbon-Fibre Lightweight Bonnet", price: 1850, weightDeltaLbs: -15, finish: "Visible Carbon Fiber" },
    { id: "hood_vented_carbon", name: "Twin-Vent Carbon-Fibre Heat Extractor Bonnet", price: 2450, weightDeltaLbs: -18, finish: "Exposed Matte Carbon" },
    { id: "hood_power_bulge", name: "Motorsport Center Scooped Carbon Bonnet", price: 3100, weightDeltaLbs: -22, finish: "Gloss Carbon Fiber" }
  ],
  turbochargers: [
    { id: "turbo_stock", name: "OEM Twin-Scroll Turbocharger System", price: 0, hpGain: 0, boostPsi: 18, lag: "Factory Balance" },
    { id: "turbo_stage1", name: "Stage 1 High-Flow Ball-Bearing Turbo Upgrade", price: 3200, hpGain: 65, boostPsi: 24, lag: "Reduced Spool Lag" },
    { id: "turbo_twin_race", name: "Garrett Motorsport Twin-Turbocharger System", price: 7500, hpGain: 140, boostPsi: 32, lag: "Ultra Fast Response" }
  ],
  calipers: [
    { id: "caliper_blue", name: "BMW Motorsport Performance Blue", hex: "#0055ff", price: 0 },
    { id: "caliper_red", name: "Brembo Race Red Gloss", hex: "#dc2626", price: 450 },
    { id: "caliper_yellow", name: "Porsche Carbon Ceramic Acid Yellow", hex: "#eab308", price: 750 },
    { id: "caliper_orange", name: "Arancio Performance Orange", hex: "#ea580c", price: 550 },
    { id: "caliper_lime", name: "Acid Neon Green / Lime", hex: "#84cc16", price: 650 },
    { id: "caliper_stealth", name: "Stealth Satin Carbon Black", hex: "#262626", price: 350 }
  ],
  liveries: [
    { id: "livery_none", name: "Pure Clean Paint (No Livery)", price: 0 },
    { id: "livery_twin_stripes", name: "Dual Center Motorsport Racing Stripes", price: 750 },
    { id: "livery_side_stripes", name: "Lower Rocker Heritage Side Accents", price: 600 },
    { id: "livery_apex_edition", name: "Apex Competition Geometric Decal Pack", price: 1400 }
  ],
  suspension: [
    { id: "susp_stock", name: "Factory Standard Sport Stance", heightOffsetMm: 0, price: 0, weightDeltaLbs: 0, hpGain: 0 },
    { id: "susp_lowered", name: "Sport Lowering Springs (-20mm Drop)", heightOffsetMm: -0.05, price: 850, weightDeltaLbs: -4, hpGain: 0 },
    { id: "susp_track_coilovers", name: "Track Adjustable Inverted Coilovers (-35mm Drop)", heightOffsetMm: -0.09, price: 2600, weightDeltaLbs: -12, hpGain: 0 }
  ],
  exhausts: [
    { id: "exhaust_stock", name: "OEM Factory Stainless Exhaust", price: 0, weightDeltaLbs: 0, hpGain: 0, tips: "Chrome Dual" },
    { id: "exhaust_titanium", name: "Titanium Race Cat-Back Quad Exhaust", price: 3400, weightDeltaLbs: -24, hpGain: 18, tips: "Burnt Titanium Quad" },
    { id: "exhaust_valved_carbon", name: "Acoustic Valved Inconel Exhaust with Carbon Tips", price: 4800, weightDeltaLbs: -18, hpGain: 22, tips: "Carbon Quad" }
  ],
  powertrain: [
    { id: "power_stock", name: "OEM Factory Twin-Scroll Turbo Calibration", price: 0, hpGain: 0, torqueGainNm: 0 },
    { id: "power_stage1", name: "Stage 1 ECU Dynamic Flash (+45 HP / +60 Nm)", price: 1450, hpGain: 45, torqueGainNm: 60 },
    { id: "power_stage2_turbos", name: "Stage 2 Hybrid Turbos & High-Flow Downpipes (+95 HP)", price: 5800, hpGain: 95, torqueGainNm: 120 }
  ],
  wingAngles: [
    { id: "angle_low", name: "Low Drag / High Speed (2° AOA)", angleDeg: 2, downforceKg: 45, dragPenalty: "Low", price: 0 },
    { id: "angle_balanced", name: "Circuit Balanced Downforce (8° AOA)", angleDeg: 8, downforceKg: 110, dragPenalty: "Medium", price: 350 },
    { id: "angle_high_downforce", name: "Sprint Maximum Cornering Attack (16° AOA)", angleDeg: 16, downforceKg: 215, dragPenalty: "High", price: 650 }
  ],
  mirrorCaps: [
    { id: "mirror_body", name: "Body Colored Aerodynamic Mirrors", price: 0 },
    { id: "mirror_carbon", name: "M Performance Carbon Fiber Wing Mirrors", price: 750 },
    { id: "mirror_stealth", name: "Stealth High-Gloss Piano Black Caps", price: 400 }
  ]
};

export const INITIAL_GARAGE_BUILDS = [
  {
    id: "build-101",
    carId: "bmw-m3",
    carName: "BMW M3 Competition",
    carImage: "/images/bmw_m3.jpg",
    savedAt: "2026-10-04",
    customizations: {
      paint: { name: "Isle of Man Green", hex: "#154734" },
      wheels: { name: '20" Satin Black Performance Alloy', price: 1250 },
      spoiler: { name: "Carbon Fiber Ducktail Spoiler", price: 950 },
      bodyKit: { name: "M Performance Carbon Front Splitter", price: 3200 }
    },
    totalPrice: 81400
  },
  {
    id: "build-102",
    carId: "porsche-911",
    carName: "Porsche 911 Carrera S",
    carImage: "/images/porsche_911.jpg",
    savedAt: "2026-10-03",
    customizations: {
      paint: { name: "GT Silver Metallic", hex: "#8a959e" },
      wheels: { name: '21" Carbon Composite Aerodynamic', price: 3800 },
      spoiler: { name: "GT3 High-Downforce Rear Wing", price: 2800 },
      bodyKit: { name: "Widebody Track Aerokit", price: 5900 }
    },
    totalPrice: 143800
  }
];
