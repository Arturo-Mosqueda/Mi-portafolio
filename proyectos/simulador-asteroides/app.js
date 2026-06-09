// ====== Impacto humano OFFLINE (sin red) ======
const COASTAL_REGION_NAMES = new Set([
  "México y Centroamérica","Italia","Reino Unido","Francia","Países Bajos","Bélgica",
  "España","Portugal","Turquía","Grecia","Israel","Líbano","Siria y Jordania",
  "Península Arábiga","India","Sri Lanka","Bangladés","China","Japón","Corea del Sur",
  "Taiwán","Filipinas y Sudeste Asiático","Vietnam y Península Indochina",
  "Indonesia","Australia","Nueva Zelanda","Estados Unidos","Canadá","Sudamérica"
]);
function isCoastalRegionName(name=""){
  const n = String(name||"").trim();
  if (!n) return false;
  if (n.toLowerCase().includes("océano")) return true; // caso mar directo
  return COASTAL_REGION_NAMES.has(n);
}

// Densidades promedio (personas/km²) y cajas aproximadas por país/region (bbox: [minLon, minLat, maxLon, maxLat])
const POP_REGIONS = [
    // Densidad extrema (>1000 hab/km²)
    { latMin: 22, latMax: 23, lonMin: 113, lonMax: 114, density: 22706, name: "Macao" },
    { latMin: 43.7, latMax: 43.8, lonMin: 7.4, lonMax: 7.5, density: 19000, name: "Mónaco" },
    { latMin: 1.2, latMax: 1.5, lonMin: 103.6, lonMax: 104.0, density: 8749, name: "Singapur" },
    { latMin: 22.1, latMax: 22.6, lonMin: 113.8, lonMax: 114.4, density: 6954, name: "Hong Kong" },
    { latMin: 23.5, latMax: 25.5, lonMin: 88, lonMax: 92.5, density: 1203, name: "Bangladés" },
    
    // Asia densamente poblada (300-700 hab/km²)
    { latMin: 21, latMax: 25.5, lonMin: 120, lonMax: 122, density: 645, name: "Taiwán" },
    { latMin: 33, latMax: 43, lonMin: 124, lonMax: 132, density: 510, name: "Corea del Sur" },
    { latMin: 7, latMax: 20, lonMin: 72, lonMax: 97, density: 448, name: "India" },
    { latMin: 30, latMax: 46, lonMin: 129, lonMax: 146, density: 326, name: "Japón" },
    { latMin: 23, latMax: 37, lonMin: 60, lonMax: 78, density: 322, name: "Pakistán" },
    { latMin: 8, latMax: 24, lonMin: 92, lonMax: 126, density: 380, name: "Filipinas y Sudeste Asiático" },
    { latMin: 5, latMax: 24, lonMin: 97, lonMax: 110, density: 309, name: "Vietnam y Península Indochina" },
    { latMin: 6, latMax: 10, lonMin: 79, lonMax: 82, density: 333, name: "Sri Lanka" },
    
    // Asia Oriental y Central
    { latMin: 18, latMax: 54, lonMin: 73, lonMax: 135, density: 147, name: "China" },
    { latMin: -10, latMax: 6, lonMin: 95, lonMax: 141, density: 149, name: "Indonesia" },
    { latMin: 5, latMax: 21, lonMin: 97, lonMax: 106, density: 130, name: "Tailandia" },
    
    // Medio Oriente
    { latMin: 33, latMax: 34, lonMin: 35, lonMax: 36.5, density: 573, name: "Líbano" },
    { latMin: 29, latMax: 33.5, lonMin: 34.2, lonMax: 35.9, density: 458, name: "Israel" },
    { latMin: 28.5, latMax: 30.2, lonMin: 47.5, lonMax: 48.5, density: 292, name: "Kuwait" },
    { latMin: 24, latMax: 26.5, lonMin: 50, lonMax: 51.7, density: 267, name: "Catar" },
    { latMin: 23.5, latMax: 26.5, lonMin: 51, lonMax: 56.5, density: 2087, name: "Baréin" },
    { latMin: 22, latMax: 32.5, lonMin: 34, lonMax: 42, density: 127, name: "Siria y Jordania" },
    { latMin: 12, latMax: 32, lonMin: 34, lonMax: 60, density: 159, name: "Península Arábiga" },
    
    // Europa Occidental (alta densidad)
    { latMin: 50.5, latMax: 53.7, lonMin: 3, lonMax: 7.3, density: 537, name: "Países Bajos" },
    { latMin: 49.4, latMax: 51.6, lonMin: 2.3, lonMax: 6.5, density: 388, name: "Bélgica" },
    { latMin: 49, latMax: 52, lonMin: 5.8, lonMax: 15.1, density: 234, name: "Alemania Occidental" },
    { latMin: 45.7, latMax: 47.9, lonMin: 5.9, lonMax: 10.5, density: 220, name: "Suiza" },
    { latMin: 36, latMax: 47.2, lonMin: -5.5, lonMax: 10, density: 195, name: "Italia" },
    { latMin: 41.3, latMax: 51.2, lonMin: -5.8, lonMax: 2, density: 287, name: "Reino Unido" },
    { latMin: 41, latMax: 51.3, lonMin: -5, lonMax: 9.7, density: 122, name: "Francia" },
    
    // Europa Central y Oriental
    { latMin: 48.5, latMax: 51.1, lonMin: 12.1, lonMax: 19, density: 138, name: "República Checa" },
    { latMin: 54.5, latMax: 58, lonMin: 8, lonMax: 15.2, density: 139, name: "Dinamarca" },
    { latMin: 41, latMax: 52, lonMin: 13, lonMax: 24.2, density: 120, name: "Europa Central" },
    { latMin: 44, latMax: 70, lonMin: 20, lonMax: 40, density: 25, name: "Europa Oriental" },
    { latMin: 50, latMax: 82, lonMin: 27, lonMax: 180, density: 8, name: "Rusia" },
    
    // África
    { latMin: -2, latMax: 4, lonMin: 29, lonMax: 30.5, density: 558, name: "Ruanda" },
    { latMin: 5, latMax: 15, lonMin: 3, lonMax: 15, density: 256, name: "Nigeria" },
    { latMin: 13, latMax: 17, lonMin: -17, lonMax: -13, density: 233, name: "Gambia" },
    { latMin: -14, latMax: -10, lonMin: 33, lonMax: 36, density: 219, name: "Malaui" },
    { latMin: -3.5, latMax: -1, lonMin: 29, lonMax: 30.5, density: 454, name: "Burundi" },
    { latMin: -2, latMax: 2, lonMin: 28, lonMax: 31, density: 196, name: "Uganda" },
    { latMin: 4, latMax: 12, lonMin: -4, lonMax: 3, density: 140, name: "Ghana" },
    { latMin: 7, latMax: 11, lonMin: -15, lonMax: -10, density: 125, name: "Sierra Leona" },
    { latMin: 6, latMax: 13, lonMin: 0.2, lonMax: 3.9, density: 152, name: "Togo" },
    { latMin: 6, latMax: 13, lonMin: 0.7, lonMax: 2.9, density: 124, name: "Benín" },
    { latMin: 20, latMax: 37, lonMin: -17, lonMax: 52, density: 30, name: "Norte de África" },
    { latMin: 5, latMax: 20, lonMin: -17, lonMax: 50, density: 50, name: "Sahel" },
    { latMin: -35, latMax: 5, lonMin: 10, lonMax: 50, density: 45, name: "África Subsahariana" },
    
    // América
    { latMin: 13, latMax: 15, lonMin: -90, lonMax: -88.2, density: 166, name: "Guatemala" },
    { latMin: 13, latMax: 14.5, lonMin: -90, lonMax: -87.7, density: 288, name: "El Salvador" },
    { latMin: 17.5, latMax: 20, lonMin: -77.5, lonMax: -76, density: 252, name: "Jamaica" },
    { latMin: 17.5, latMax: 20, lonMin: -72.5, lonMax: -68.3, density: 444, name: "Haití" },
    { latMin: 17.5, latMax: 20, lonMin: -72, lonMax: -68.3, density: 230, name: "República Dominicana" },
    { latMin: 14, latMax: 32, lonMin: -118, lonMax: -86, density: 65, name: "México y Centroamérica" },
    { latMin: 25, latMax: 50, lonMin: -125, lonMax: -65, density: 35, name: "Estados Unidos" },
    { latMin: 41, latMax: 84, lonMin: -141, lonMax: -52, density: 4, name: "Canadá" },
    { latMin: -56, latMax: 13, lonMin: -82, lonMax: -34, density: 25, name: "Sudamérica" },
    
    // Oceanía
    { latMin: -45, latMax: -10, lonMin: 113, lonMax: 154, density: 3, name: "Australia" },
    { latMin: -47.5, latMax: -34, lonMin: 166, lonMax: 179, density: 18, name: "Nueva Zelanda" },
    
    // Regiones poco pobladas
    { latMin: 66, latMax: 90, lonMin: -180, lonMax: 180, density: 0.1, name: "Ártico" },
    { latMin: -90, latMax: -60, lonMin: -180, lonMax: 180, density: 0.00001, name: "Antártida" },
    { latMin: -60, latMax: 60, lonMin: -180, lonMax: 180, density: 0.0001, name: "Océanos" }
];
const WORLD_DENSITY = 60.0; // fallback

// ====== NUEVO: ANÁLISIS DE CONSECUENCIAS SECUNDARIAS ======
// Este bloque contiene la lógica para determinar efectos secundarios
// basados en la energía del impacto y la ubicación (tierra/océano).

const SECONDARY_EFFECT_THRESHOLDS = {
    // Energía en Megatones (Mt)
    TSUNAMI: { MIN: 10, REGIONAL: 100, GLOBAL: 1000 },
    SEISMIC: { MIN: 0.1 },
    AIR_BLAST: { MIN: 0.01, DEVASTATING: 50 },
    CLIMATE: { REGIONAL: 20, GLOBAL: 500, EXTINCTION: 100000 }
};

/**
 * Analiza y devuelve una lista de posibles consecuencias secundarias de un impacto.
 * @param {object} impactData - Datos del impacto.
 * @param {number} impactData.megatons - Energía del impacto en megatones de TNT.
 * @param {string} impactData.regionName - Nombre de la región de impacto (para detectar océanos).
 * @returns {Array<object>} Una lista de objetos, cada uno representando un efecto secundario.
 */
function getSecondaryEffects(impactData) {
    const { megatons, regionName } = impactData;
    const effects = [];
    const isOceanicImpact = regionName.toLowerCase().includes('océano') || regionName.toLowerCase().includes('ocean');

    // 1. Potencial de Tsunami (solo para impactos oceánicos)
    if (isOceanicImpact && megatons >= SECONDARY_EFFECT_THRESHOLDS.TSUNAMI.MIN) {
        let severity = 'significativo con alcance regional';
        if (megatons >= SECONDARY_EFFECT_THRESHOLDS.TSUNAMI.GLOBAL) {
            severity = 'devastador a nivel global';
        } else if (megatons >= SECONDARY_EFFECT_THRESHOLDS.TSUNAMI.REGIONAL) {
            severity = 'masivo con alcance transoceánico';
        }
        effects.push({
            title: '⚠️ Riesgo Extremo de Tsunami',
            description: `El impacto en el océano generará un tsunami ${severity}. Las zonas costeras en la cuenca oceánica afectada están en peligro crítico. Las olas podrían viajar miles de kilómetros con una energía destructiva inmensa.`
        });
    }

    // 2. Efectos Sísmicos
    if (megatons >= SECONDARY_EFFECT_THRESHOLDS.SEISMIC.MIN) {
        // Fórmula de estimación muy simplificada (relaciona energía con magnitud)
        const magnitude = (Math.log10(megatons * 4.184e15) - 4.8) / 1.5;
        effects.push({
            title: 'Onda Sísmica Global',
            description: `El impacto generará una onda sísmica equivalente a un terremoto de magnitud ~${magnitude.toFixed(1)}. Esto causará devastación total en la zona de impacto y daños estructurales graves a cientos de kilómetros. Será registrado por sismógrafos en todo el mundo.`
        });
    }

    // 3. Onda de Choque Aérea (Air Blast)
    if (megatons >= SECONDARY_EFFECT_THRESHOLDS.AIR_BLAST.MIN) {
        const severity = megatons > SECONDARY_EFFECT_THRESHOLDS.AIR_BLAST.DEVASTATING ? 'apocalíptica' : 'extremadamente potente';
        effects.push({
            title: 'Onda de Choque Atmosférica',
            description: `La explosión creará una onda de choque ${severity} que se propagará a velocidades supersónicas, arrasando todo a su paso en un radio de cientos (o miles) de kilómetros, mucho más allá de la zona del cráter.`
        });
    }

    // 4. Efectos Climáticos y Atmosféricos
    if (megatons >= SECONDARY_EFFECT_THRESHOLDS.CLIMATE.EXTINCTION) {
        effects.push({
            title: '☠️ Evento de Nivel de Extinción',
            description: 'La inyección masiva de polvo, hollín y aerosoles en la estratosfera bloqueará la luz solar durante años, causando un "invierno de impacto" severo. Esto provocará un colapso global de la agricultura y los ecosistemas, llevando a una extinción en masa.'
        });
    } else if (megatons >= SECONDARY_EFFECT_THRESHOLDS.CLIMATE.GLOBAL) {
        effects.push({
            title: 'Alteración Climática Global',
            description: `Suficiente material será eyectado a la atmósfera para causar un enfriamiento global ("otoño de impacto") durante varios meses o años, afectando gravemente las cosechas y dañando la capa de ozono.`
        });
    } else if (megatons >= SECONDARY_EFFECT_THRESHOLDS.CLIMATE.REGIONAL) {
        effects.push({
            title: 'Efectos Atmosféricos Regionales',
            description: 'La columna de humo y polvo podría causar enfriamiento temporal a nivel regional, así como lluvia ácida que afectaría a los ecosistemas y la agricultura local.'
        });
    }
    
    return effects;
}


function getPopulationDensity(lat, lon){
  for (const region of POP_REGIONS) {
    // Comprueba si la latitud está en el rango
    if (lat >= region.latMin && lat <= region.latMax) {
      // Comprueba la longitud, manejando casos que no cruzan el meridiano 180
      if (region.lonMin <= region.lonMax) {
        if (lon >= region.lonMin && lon <= region.lonMax) {
          return { name: region.name, density: region.density };
        }
      } else { // Maneja casos que cruzan el meridiano 180 (ej. Rusia)
        if (lon >= region.lonMin || lon <= region.lonMax) {
          return { name: region.name, density: region.density };
        }
      }
    }
  }

  const COASTAL_REGION_NAMES = new Set([
  "México y Centroamérica","Italia","Reino Unido","Francia","Países Bajos","Bélgica",
  "España","Portugal","Turquía","Grecia","Israel","Líbano","Siria y Jordania",
  "Península Arábiga","India","Sri Lanka","Bangladés","China","Japón","Corea del Sur",
  "Taiwán","Filipinas y Sudeste Asiático","Vietnam y Península Indochina",
  "Indonesia","Australia","Nueva Zelanda","Estados Unidos","Canadá","Sudamérica"
]);
function isCoastalRegionName(name=""){
  const n = String(name||"").trim();
  if (!n) return false;
  if (n.toLowerCase().includes("océano")) return true; // caso mar directo
  return COASTAL_REGION_NAMES.has(n);
}

  // Si no se encuentra ninguna región específica, la lista ya incluye "Océanos" como valor final por defecto.
  return { name: "Océano / Sin datos", density: 0.0001 };
}
// factores de letalidad y heridos por anillo
const LETHALITY = { crater: 1.00, severe: 0.70, heavy: 0.20, moderate: 0.02, thermal: 0.01 };
const INJURY    = { crater: 0.00, severe: 0.25, heavy: 0.60, moderate: 0.50, thermal: 0.30 };

function areaRingKm2(rOuterKm, rInnerKm){ return Math.PI*(rOuterKm*rOuterKm - rInnerKm*rInnerKm); }
function casualtiesForRing(pop, key){ return { dead: pop*(LETHALITY[key]||0), injured: pop*(INJURY[key]||0) }; }
function formatCompact(n){
  if (!isFinite(n)||n<=0) return '0';
  const abs=Math.abs(n);
  if (abs>=1e9) return (n/1e9).toFixed(1)+' mil M';
  if (abs>=1e6) return (n/1e6).toFixed(1)+' M';
  if (abs>=1e3) return (n/1e3).toFixed(1)+' mil';
  return Math.round(n).toString();
}

async function estimateHumanImpactOffline(lat, lon, ringsKm){
  const {density, name} = getPopulationDensity(lat, lon);
  const perRing = {};
  for (const [key, [r0, r1]] of Object.entries(ringsKm)){
    if (!(r1>0) || r1<=r0){ perRing[key] = {pop:0,dead:0,injured:0}; continue; }
    const area = areaRingKm2(r1, r0);
    const pop = density * area;
    const {dead,injured} = casualtiesForRing(pop, key);
    perRing[key] = {pop, dead, injured};
  }
  const totals = Object.values(perRing).reduce((a,v)=>({pop:a.pop+v.pop, dead:a.dead+v.dead, injured:a.injured+v.injured}), {pop:0,dead:0,injured:0});
  return {regionName:name, density, perRing, totals};
}

        // --- Contenedores y Configuración ---
        const simContainer = document.getElementById('simulation-container');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, simContainer.clientWidth / simContainer.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(simContainer.clientWidth, simContainer.clientHeight);
        // === Calidad de render mejorada ===
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
if (THREE.ACESFilmicToneMapping) renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.physicallyCorrectLights = true;
const MAX_ANISO = renderer.capabilities.getMaxAnisotropy();
simContainer.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 1.5;
        controls.maxDistance = 10;

        const textureLoader = new THREE.TextureLoader();
// helper para texturas con anisotropía + sRGB
function loadMap(url){
  return textureLoader.load(url, (t)=>{
    try{ t.anisotropy = MAX_ANISO; }catch(e){}
    if (THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding;
  });
}

        // --- Tierra y Escena (CON TEXTURAS CORREGIDAS Y MÁS ESTABLES) ---
        const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
        const earthMaterial = new THREE.MeshPhongMaterial({
  map: loadMap('https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg'),
  bumpMap: loadMap('https://raw.githubusercontent.com/turban/webgl-earth/master/images/elev_bump_4k.jpg'),
  bumpScale: 0.015,
  specularMap: loadMap('https://raw.githubusercontent.com/turban/webgl-earth/master/images/water_4k.png'),
  specular: new THREE.Color(0x222222),
  shininess: 20,
  emissiveMap: loadMap('https://raw.githubusercontent.com/turban/webgl-earth/master/images/lights_4k.png'),
  emissive: new THREE.Color(0x111111),
  emissiveIntensity: 0.55
});
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earth);

        // Nubes mejoradas
        const cloudGeometry = new THREE.SphereGeometry(1.008, 64, 64);
        const cloudMaterial = new THREE.MeshLambertMaterial({
  map: loadMap('https://raw.githubusercontent.com/turban/webgl-earth/master/images/clouds_4k.png'),
  transparent: true,
  opacity: 0.78,
  depthWrite: false
});
        const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        scene.add(clouds);

        // Atmósfera
        const atmosphereGeometry = new THREE.SphereGeometry(1.04, 64, 64);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x87ceeb,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        scene.add(atmosphere);

        const moonPivot = new THREE.Object3D();
        scene.add(moonPivot);
        const moonGeometry = new THREE.SphereGeometry(0.27, 48, 48);
        const moonTexture = textureLoader.load('https://raw.githubusercontent.com/ajhager/moon-2d-texture/master/moonmap4k.jpg');
        const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture, shininess: 10 });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.set(3.5, 0, 0);
        moonPivot.add(moon);

        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000, y = (Math.random() - 0.5) * 2000, z = (Math.random() - 0.5) * 2000;
            if (Math.sqrt(x*x + y*y + z*z) > 100) starVertices.push(x, y, z);
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.01 }));
        scene.add(stars);
        
        scene.add(new THREE.AmbientLight(0x111111, 0.7));
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.35);
        directionalLight.position.set(5, 3, 5);
        directionalLight.target.position.set(0, 0, 0);
        scene.add(directionalLight);
        scene.add(directionalLight.target);
        camera.position.z = 3;

        // --- Lógica de Asteroides ---
        // --- Lógica de Asteroides ---
let activeAsteroids = [], activeEffects = [];
const DEFAULT_PREDEFINED_VELOCITY = 20;
const predefinedAsteroidsData = [
    { group: 'Asteroides mas grandes por potencial de impacto', name: '29075 (1950 DA)', diameter: 0.917, mass: 8.08e+11, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '101955 Bennu (1999 RQ36)', diameter: 0.497, mass: 7.33e+10, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '(1979 XB)', diameter: 0.696, mass: 3.53e+11, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '(2007 FT3)', diameter: 0.36, mass: 4.9e+10, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '(2024 JW16)', diameter: 0.226, mass: 1.21e+10, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '(2015 JJ)', diameter: 0.136, mass: 2.64e+09, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '(2022 PX1)', diameter: 0.124, mass: 2e+09, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '(2016 YM4)', diameter: 0.12, mass: 1.81e+09, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '(2025 SC5)', diameter: 0.061, mass: 2.38e+08, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '(2008 UB7)', diameter: 0.061, mass: 2.38e+08, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '(2019 VB37)', diameter: 0.045, mass: 9.54e+07, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '(2007 DX40)', diameter: 0.042, mass: 7.76e+07, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '(2000 SG344)', diameter: 0.039, mass: 6.19e+07, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '(2005 QK76)', diameter: 0.033, mass: 3.77e+07, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '(2008 JL3)', diameter: 0.031, mass: 3.12e+07, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '(2021 GX9)', diameter: 0.03, mass: 2.83e+07, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '(2023 DO)', diameter: 0.028, mass: 2.3e+07, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '(2025 LK)', diameter: 0.015, mass: 3.53e+06, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '(2013 TP4)', diameter: 0.011, mass: 1.4e+06, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides mas grandes por potencial de impacto', name: '(2010 RF12)', diameter: 0.007, mass: 359000, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2000 SG344)', diameter: 37.8, mass: 5.64e+07, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2025 LK)', diameter: 16.1, mass: 4.36e+06, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2012 HG2)', diameter: 15.9, mass: 4.21e+06, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2020 VV)', diameter: 13.9, mass: 2.81e+06, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2017 LD)', diameter: 11.7, mass: 1.67e+06, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2010 VQ)', diameter: 10.3, mass: 1.14e+06, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2020 VN1)', diameter: 9.4, mass: 869000, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2022 NX1)', diameter: 8.8, mass: 715000, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2017 WT28)', diameter: 8.6, mass: 665000, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2015 YJ)', diameter: 7.9, mass: 515000, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2020 VW)', diameter: 7.7, mass: 478000, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2006 JY26)', diameter: 7.6, mass: 460000, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2010 RF12)', diameter: 7.5, mass: 442000, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2020 CQ1)', diameter: 6.7, mass: 314000, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2000 LG6)', diameter: 6.1, mass: 238000, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2022 UL11)', diameter: 5.8, mass: 204000, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2006 RH120)', diameter: 4.2, mass: 77600, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2025 FK14)', diameter: 4.1, mass: 72000, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2022 SX55)', diameter: 3.2, mass: 34300, velocity: DEFAULT_PREDEFINED_VELOCITY },
    { group: 'Asteroides con mayor probabilidad de impacto', name: '(2020 CD3)', diameter: 1.9, mass: 7180, velocity: DEFAULT_PREDEFINED_VELOCITY },
];

// Ajuste de unidades: El segundo grupo tiene el diámetro en metros, se convierte a km.
predefinedAsteroidsData.forEach((ast) => {
    if (ast.group === 'Asteroides con mayor probabilidad de impacto') {
        ast.diameter = ast.diameter / 1000;
    }
});
        const predefinedSelect = document.getElementById('predefined-asteroid');
const GROUP_LABEL_MAP = {
    'Asteroides mas grandes por potencial de impacto': 'Asteroides más grandes por potencial de impacto',
    'Asteroides con mayor probabilidad de impacto': 'Asteroides con mayor probabilidad de impacto'
};

function formatDiameterLabel(value) {
    return value >= 1 ? value.toFixed(2) : value.toFixed(3);
}

function formatMassLabel(value) {
    if (!value) return '0';
    return value >= 1e6 ? value.toExponential(2) : value.toFixed(0);
}

// Agrupa los asteroides por categoría en el menú
const grouped = new Map();
predefinedAsteroidsData.forEach((ast, index) => {
    if (!grouped.has(ast.group)) grouped.set(ast.group, []);
    grouped.get(ast.group).push({ ast, index });
});

grouped.forEach((items, groupKey) => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = GROUP_LABEL_MAP[groupKey] || groupKey;
    items.forEach(({ ast, index }) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${ast.name} — D=${formatDiameterLabel(ast.diameter)} km · M=${formatMassLabel(ast.mass)} kg`;
        optgroup.appendChild(option);
    });
    predefinedSelect.appendChild(optgroup);
});

        // --- NUEVO: Lógica para cargar datos de asteroides predefinidos ---
        function loadPredefinedAsteroid(index) {
            const data = predefinedAsteroidsData[index];
            document.getElementById('custom-name').value = data.name;
            document.getElementById('custom-diameter').value = data.diameter;
            document.getElementById('custom-velocity').value = data.velocity;
        }

        predefinedSelect.addEventListener('change', (event) => {
            loadPredefinedAsteroid(event.target.value);
            updateLaunchPreview();
        });

        // Cargar el primer asteroide de la lista por defecto
        loadPredefinedAsteroid(0);


        function latLonToVector3(lat, lon, radius) {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);
            const x = -(radius * Math.sin(phi) * Math.cos(theta));
            const y = radius * Math.cos(phi);
            const z = radius * Math.sin(phi) * Math.sin(theta);
            return new THREE.Vector3(x, y, z);
        }

        // --- LÓGICA DE LANZAMIENTO REFACTORIZADA ---
 function launchAsteroid(data) {
    // 🟢 Guarda el asteroide lanzado (para el modal de datos reales)
    lastLaunchedAsteroidName = data.name || '';
    lastLaunchData = { ...data };
    lastImpactContext = null;
    refreshRealDataButtonState(); // habilita o deshabilita el botón "Ver datos reales"
    setLaunchStatus(`Lanzamiento en curso hacia ${data.lat.toFixed(2)}°, ${data.lon.toFixed(2)}°.`, 'success');
    if (infoPanel) {
        infoPanel.textContent = `Asteroide ${data.name} en trayectoria de impacto.`;
    }

    // 🪨 Crea el grupo del asteroide y su cola
    const asteroidGroup = new THREE.Group();
    const scale = Math.max(0.02, data.diameter / 100);
    const rockGeometry = new THREE.DodecahedronGeometry(scale, 0);
    const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, flatShading: true });
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);

    const tailGeometry = new THREE.ConeGeometry(scale * 0.8, scale * 5, 16);
    const tailMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500, transparent: true, opacity: 0.7 });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.z = scale * 2.5;
    tail.rotation.x = Math.PI / 2;

    asteroidGroup.add(rock);
    asteroidGroup.add(tail);

    // 🌍 Calcula dirección hacia la Tierra
    const localTargetVector = latLonToVector3(data.lat, data.lon, 1);
    const startPosition = localTargetVector.clone().normalize().multiplyScalar(10);
    asteroidGroup.position.copy(startPosition);
    asteroidGroup.lookAt(new THREE.Vector3(0, 0, 0));

    // 🚀 Inserta el asteroide en la simulación
    const asteroidObj = {
        mesh: asteroidGroup,
        target: localTargetVector,
        data: data,
        progress: 0,
        speed: data.velocity / 1000
    };
    activeAsteroids.push(asteroidObj);
    earth.add(asteroidGroup);
}

        const launchCustomBtn = document.getElementById('launch-custom');
const infoPanel = document.getElementById('info');
const launchStatus = document.getElementById('launch-status');
const launchPreview = document.getElementById('launch-preview');
const launchFields = {
    name: document.getElementById('custom-name'),
    diameter: document.getElementById('custom-diameter'),
    density: document.getElementById('custom-density'),
    velocity: document.getElementById('custom-velocity'),
    lat: document.getElementById('custom-lat'),
    lon: document.getElementById('custom-lon')
};
const FIELD_RULES = {
    diameter: { min: 0.001, max: 100, label: 'diámetro' },
    density: { min: 300, max: 9000, label: 'densidad' },
    velocity: { min: 1, max: 75, label: 'velocidad' },
    lat: { min: -90, max: 90, label: 'latitud' },
    lon: { min: -180, max: 180, label: 'longitud' }
};

function setLaunchStatus(message = '', type = '') {
    if (!launchStatus) return;
    launchStatus.textContent = message;
    launchStatus.className = `launch-status ${type}`.trim();
}

function clampValue(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function estimateLaunchMetrics(data) {
    const dMeters = data.diameter * 1000;
    const volume = (4 / 3) * Math.PI * Math.pow(dMeters / 2, 3);
    const mass = volume * data.density;
    const energyJ = 0.5 * mass * Math.pow(data.velocity * 1000, 2);
    const megatons = energyJ / 4.184e15;
    return { mass, energyJ, megatons };
}

function formatEnergyPreview(megatons) {
    if (!Number.isFinite(megatons)) return 'Sin datos';
    if (megatons >= 1000) return `${(megatons / 1000).toFixed(2)} Gt TNT`;
    if (megatons >= 1) return `${megatons.toFixed(2)} Mt TNT`;
    return `${(megatons * 1000).toFixed(2)} kt TNT`;
}

function setFieldError(field, hasError) {
    if (!field) return;
    field.classList.toggle('input-error', hasError);
    field.setAttribute('aria-invalid', hasError ? 'true' : 'false');
}

function readLaunchForm({ correctRanges = false } = {}) {
    const errors = [];
    const corrections = [];
    const data = {
        name: launchFields.name.value.trim() || 'Asteroide sin nombre',
        diameter: parseFloat(launchFields.diameter.value),
        density: parseFloat(launchFields.density.value),
        velocity: parseFloat(launchFields.velocity.value),
        lat: parseFloat(launchFields.lat.value),
        lon: parseFloat(launchFields.lon.value)
    };

    Object.entries(FIELD_RULES).forEach(([key, rule]) => {
        const field = launchFields[key];
        const value = data[key];
        if (!Number.isFinite(value)) {
            errors.push(`Ingresa un valor numérico para ${rule.label}.`);
            setFieldError(field, true);
            return;
        }

        if (value < rule.min || value > rule.max) {
            if (correctRanges) {
                const corrected = clampValue(value, rule.min, rule.max);
                data[key] = corrected;
                field.value = corrected;
                corrections.push(`${rule.label} ajustada a ${corrected}`);
                setFieldError(field, false);
            } else {
                errors.push(`${rule.label} debe estar entre ${rule.min} y ${rule.max}.`);
                setFieldError(field, true);
            }
            return;
        }

        setFieldError(field, false);
    });

    return { data, errors, corrections };
}

function updateLaunchPreview() {
    if (!launchPreview) return;
    const { data, errors } = readLaunchForm();
    if (errors.length) {
        launchPreview.innerHTML = '';
        launchCustomBtn.disabled = true;
        setLaunchStatus(errors[0], 'error');
        return;
    }

    launchCustomBtn.disabled = false;
    const metrics = estimateLaunchMetrics(data);
    launchPreview.innerHTML = `
        <div class="preview-stat"><span>Masa estimada</span><strong>${metrics.mass.toExponential(2)} kg</strong></div>
        <div class="preview-stat"><span>Energía</span><strong>${formatEnergyPreview(metrics.megatons)}</strong></div>
        <div class="preview-stat"><span>Velocidad</span><strong>${data.velocity.toFixed(1)} km/s</strong></div>
        <div class="preview-stat"><span>Objetivo</span><strong>${data.lat.toFixed(2)}°, ${data.lon.toFixed(2)}°</strong></div>
    `;
    setLaunchStatus('Parámetros listos para lanzar.', 'success');
}

Object.values(launchFields).forEach((field) => {
    field.addEventListener('input', updateLaunchPreview);
    field.addEventListener('change', updateLaunchPreview);
});
updateLaunchPreview();

launchCustomBtn.addEventListener('click', () => {
    const { data, errors, corrections } = readLaunchForm({ correctRanges: true });
    if (errors.length) {
        setLaunchStatus(errors[0], 'error');
        updateLaunchPreview();
        return;
    }

    updateLaunchPreview();
    if (corrections.length) {
        setLaunchStatus(`${corrections.join(', ')}. Lanzamiento preparado.`, 'success');
    }
    launchAsteroid(data);
});


        window.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                launchCustomBtn.click(); // Simula el clic en el botón de lanzamiento
            }
        });

        const utcInput = document.getElementById('utc-time');
        const utcInfo = document.getElementById('utc-info');
        const mapContainer = document.getElementById('impact-map-container');
        const realDataButton = document.getElementById('show-real-data');
        const realDataModal = document.getElementById('real-data-modal');
        const realDataMeta = document.getElementById('real-data-meta');
        const realDataEmpty = document.getElementById('real-data-empty');
        const realDataTable = document.getElementById('real-data-table');
        const realDataTableBody = document.getElementById('real-data-table-body');
        const realDataClose = document.getElementById('real-data-close');
        let mapZoomCenter = { x: 50, y: 50 };
        const DEFAULT_MAP_ZOOM = 1;
        const AUTO_MAP_ZOOM = 2.5;
        const MAX_MAP_ZOOM = 24;
        const TARGET_RING_RADIUS_PX = 96;
        const MIN_CLEAR_RING_RADIUS_PX = 80;
        const AUTO_MAP_ZOOM_DURATION = 4000;
        let autoZoomTimeout = null;
        let currentMapZoom = DEFAULT_MAP_ZOOM;
        const realAsteroidCatalog = new Map();
        let realDataCatalogLoaded = false;
        let lastLaunchedAsteroidName = '';
        let lastLaunchData = null;
        let lastImpactContext = null;
        const REAL_DATA_FALLBACK = JSON.parse(String.raw`{
  "probabilidad": [
    {
      "designation": "(2010 RF12)",
      "year_range": "2095-2122",
      "potential_impacts": "70",
      "impact_probability": "0.102637259",
      "absolute_magnitude": "28.39",
      "estimated_diameter_m": "7.5",
      "palermo_scale_cum": "-2.97",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2020 CD3)",
      "year_range": "2082-2118",
      "potential_impacts": "115",
      "impact_probability": "0.025233816",
      "absolute_magnitude": "31.75",
      "estimated_diameter_m": "1.9",
      "palermo_scale_cum": "-5.17",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2017 WT28)",
      "year_range": "2083-2121",
      "potential_impacts": "113",
      "impact_probability": "0.011543968",
      "absolute_magnitude": "28.08",
      "estimated_diameter_m": "8.6",
      "palermo_scale_cum": "-3.84",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2006 RH120)",
      "year_range": "2044-2124",
      "potential_impacts": "119",
      "impact_probability": "0.008166502",
      "absolute_magnitude": "29.64",
      "estimated_diameter_m": "4.2",
      "palermo_scale_cum": "-4.31",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2020 VW)",
      "year_range": "2074-2079",
      "potential_impacts": "12",
      "impact_probability": "0.007026243",
      "absolute_magnitude": "28.32",
      "estimated_diameter_m": "7.7",
      "palermo_scale_cum": "-3.82",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2006 JY26)",
      "year_range": "2073-2122",
      "potential_impacts": "107",
      "impact_probability": "0.005020801",
      "absolute_magnitude": "28.35",
      "estimated_diameter_m": "7.6",
      "palermo_scale_cum": "-4.15",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2020 CQ1)",
      "year_range": "2070-2122",
      "potential_impacts": "50",
      "impact_probability": "0.004646357",
      "absolute_magnitude": "28.81",
      "estimated_diameter_m": "6.7",
      "palermo_scale_cum": "-4.33",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2022 SX55)",
      "year_range": "2035-2058",
      "potential_impacts": "5",
      "impact_probability": "0.004032325",
      "absolute_magnitude": "30.23",
      "estimated_diameter_m": "3.2",
      "palermo_scale_cum": "-4.21",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2022 NX1)",
      "year_range": "2075-2121",
      "potential_impacts": "50",
      "impact_probability": "0.003172466",
      "absolute_magnitude": "28.03",
      "estimated_diameter_m": "8.8",
      "palermo_scale_cum": "-4.24",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2000 SG344)",
      "year_range": "2069-2122",
      "potential_impacts": "300",
      "impact_probability": "0.002743395",
      "absolute_magnitude": "24.79",
      "estimated_diameter_m": "37.8",
      "palermo_scale_cum": "-2.77",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2025 FK14)",
      "year_range": "2080-2090",
      "potential_impacts": "14",
      "impact_probability": "0.002430067",
      "absolute_magnitude": "29.65",
      "estimated_diameter_m": "4.1",
      "palermo_scale_cum": "-5",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2020 VV)",
      "year_range": "2044-2122",
      "potential_impacts": "424",
      "impact_probability": "0.002318442",
      "absolute_magnitude": "27.27",
      "estimated_diameter_m": "13.9",
      "palermo_scale_cum": "-3.83",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2017 LD)",
      "year_range": "2053-2122",
      "potential_impacts": "319",
      "impact_probability": "0.00221825",
      "absolute_magnitude": "27.52",
      "estimated_diameter_m": "11.7",
      "palermo_scale_cum": "-4.14",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2000 LG6)",
      "year_range": "2081-2122",
      "potential_impacts": "116",
      "impact_probability": "0.002130626",
      "absolute_magnitude": "29.02",
      "estimated_diameter_m": "6.1",
      "palermo_scale_cum": "-4.99",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2012 HG2)",
      "year_range": "2052-2122",
      "potential_impacts": "689",
      "impact_probability": "0.001985448",
      "absolute_magnitude": "26.97",
      "estimated_diameter_m": "15.9",
      "palermo_scale_cum": "-3.84",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2025 LK)",
      "year_range": "2052-2079",
      "potential_impacts": "15",
      "impact_probability": "0.001734924",
      "absolute_magnitude": "26.92",
      "estimated_diameter_m": "16.1",
      "palermo_scale_cum": "-3.48",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2020 VN1)",
      "year_range": "2115-2122",
      "potential_impacts": "2",
      "impact_probability": "0.001706598",
      "absolute_magnitude": "27.9",
      "estimated_diameter_m": "9.4",
      "palermo_scale_cum": "-4.66",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2022 UL11)",
      "year_range": "2096-2123",
      "potential_impacts": "52",
      "impact_probability": "0.001642442",
      "absolute_magnitude": "29.13",
      "estimated_diameter_m": "5.8",
      "palermo_scale_cum": "-5.12",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2015 YJ)",
      "year_range": "2042-2122",
      "potential_impacts": "119",
      "impact_probability": "0.001638472",
      "absolute_magnitude": "28.28",
      "estimated_diameter_m": "7.9",
      "palermo_scale_cum": "-4.06",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2010 VQ)",
      "year_range": "2087-2122",
      "potential_impacts": "21",
      "impact_probability": "0.001584593",
      "absolute_magnitude": "27.7",
      "estimated_diameter_m": "10.3",
      "palermo_scale_cum": "-4.42",
      "torino_scale": "0",
      "relative_velocity_km_s": "",
      "composition_type": "Desconocido"
    }
  ],
  "grandes": [
    {
      "designation": "29075 (1950 DA)",
      "year_range": "2880-2880",
      "potential_impacts": "1",
      "impact_probability": "0.0003848",
      "absolute_magnitude": "17.94",
      "estimated_diameter_km": "0.917",
      "palermo_scale_cum": "-0.92",
      "torino_scale": "",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "101955 Bennu (1999 RQ36)",
      "year_range": "2178-2290",
      "potential_impacts": "157",
      "impact_probability": "0.0005717",
      "absolute_magnitude": "20.63",
      "estimated_diameter_km": "0.497",
      "palermo_scale_cum": "-1.4",
      "torino_scale": "",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2008 JL3)",
      "year_range": "2027-2122",
      "potential_impacts": "44",
      "impact_probability": "0.000165815",
      "absolute_magnitude": "25.31",
      "estimated_diameter_km": "0.031",
      "palermo_scale_cum": "-2.68",
      "torino_scale": "0",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(1979 XB)",
      "year_range": "2056-2113",
      "potential_impacts": "4",
      "impact_probability": "8.52E-07",
      "absolute_magnitude": "18.54",
      "estimated_diameter_km": "0.696",
      "palermo_scale_cum": "-2.7",
      "torino_scale": "0",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2000 SG344)",
      "year_range": "2069-2122",
      "potential_impacts": "300",
      "impact_probability": "0.002743395",
      "absolute_magnitude": "24.79",
      "estimated_diameter_km": "0.039",
      "palermo_scale_cum": "-2.77",
      "torino_scale": "0",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2010 RF12)",
      "year_range": "2095-2122",
      "potential_impacts": "70",
      "impact_probability": "0.102637259",
      "absolute_magnitude": "28.39",
      "estimated_diameter_km": "0.007",
      "palermo_scale_cum": "-2.97",
      "torino_scale": "0",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2025 SC5)",
      "year_range": "2086-2107",
      "potential_impacts": "5",
      "impact_probability": "0.000337254",
      "absolute_magnitude": "23.83",
      "estimated_diameter_km": "0.061",
      "palermo_scale_cum": "-2.97",
      "torino_scale": "0",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2015 JJ)",
      "year_range": "2111-2111",
      "potential_impacts": "1",
      "impact_probability": "6.75E-05",
      "absolute_magnitude": "22.09",
      "estimated_diameter_km": "0.136",
      "palermo_scale_cum": "-3.06",
      "torino_scale": "0",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2007 FT3)",
      "year_range": "2030-2119",
      "potential_impacts": "87",
      "impact_probability": "7.74E-07",
      "absolute_magnitude": "19.97",
      "estimated_diameter_km": "0.36",
      "palermo_scale_cum": "-3.06",
      "torino_scale": "0",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2022 PX1)",
      "year_range": "2040-2040",
      "potential_impacts": "1",
      "impact_probability": "3.23E-06",
      "absolute_magnitude": "22.28",
      "estimated_diameter_km": "0.124",
      "palermo_scale_cum": "-3.1",
      "torino_scale": "0",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2005 QK76)",
      "year_range": "2030-2059",
      "potential_impacts": "6",
      "impact_probability": "7.05E-05",
      "absolute_magnitude": "25.18",
      "estimated_diameter_km": "0.033",
      "palermo_scale_cum": "-3.18",
      "torino_scale": "0",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2021 GX9)",
      "year_range": "2032-2052",
      "potential_impacts": "2",
      "impact_probability": "8.22E-05",
      "absolute_magnitude": "25.34",
      "estimated_diameter_km": "0.03",
      "palermo_scale_cum": "-3.25",
      "torino_scale": "0",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2025 LK)",
      "year_range": "2052-2079",
      "potential_impacts": "15",
      "impact_probability": "0.001734924",
      "absolute_magnitude": "26.92",
      "estimated_diameter_km": "0.015",
      "palermo_scale_cum": "-3.48",
      "torino_scale": "0",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2023 DO)",
      "year_range": "2057-2092",
      "potential_impacts": "25",
      "impact_probability": "0.00045491",
      "absolute_magnitude": "25.55",
      "estimated_diameter_km": "0.028",
      "palermo_scale_cum": "-3.57",
      "torino_scale": "0",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2013 TP4)",
      "year_range": "2026-2026",
      "potential_impacts": "1",
      "impact_probability": "3.53E-05",
      "absolute_magnitude": "27.52",
      "estimated_diameter_km": "0.011",
      "palermo_scale_cum": "-3.6",
      "torino_scale": "0",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2019 VB37)",
      "year_range": "2049-2067",
      "potential_impacts": "5",
      "impact_probability": "5.70E-05",
      "absolute_magnitude": "24.5",
      "estimated_diameter_km": "0.045",
      "palermo_scale_cum": "-3.61",
      "torino_scale": "0",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2008 UB7)",
      "year_range": "2044-2101",
      "potential_impacts": "50",
      "impact_probability": "3.38E-05",
      "absolute_magnitude": "23.84",
      "estimated_diameter_km": "0.061",
      "palermo_scale_cum": "-3.62",
      "torino_scale": "0",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2024 JW16)",
      "year_range": "2082-2121",
      "potential_impacts": "12",
      "impact_probability": "2.32E-06",
      "absolute_magnitude": "20.98",
      "estimated_diameter_km": "0.226",
      "palermo_scale_cum": "-3.63",
      "torino_scale": "0",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2007 DX40)",
      "year_range": "2035-2122",
      "potential_impacts": "93",
      "impact_probability": "7.76E-05",
      "absolute_magnitude": "24.62",
      "estimated_diameter_km": "0.042",
      "palermo_scale_cum": "-3.64",
      "torino_scale": "0",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    },
    {
      "designation": "(2016 YM4)",
      "year_range": "2121-2121",
      "potential_impacts": "1",
      "impact_probability": "1.34E-05",
      "absolute_magnitude": "22.36",
      "estimated_diameter_km": "0.12",
      "palermo_scale_cum": "-3.69",
      "torino_scale": "0",
      "relative_velocity_km_s": "N/A",
      "composition_type": "Desconocido"
    }
  ]
}`);
        const REAL_DATA_FILES = [
            { path: 'asteroides_potencial_impacto con mas probabilidad.csv', label: 'Mayor probabilidad de impacto', diameterKey: 'estimated_diameter_m', unit: 'm', fallbackKey: 'probabilidad' },
            { path: 'asteroides_potencial_impacto mas grandes.csv', label: 'Asteroides de mayor tamaño', diameterKey: 'estimated_diameter_km', unit: 'km', fallbackKey: 'grandes' }
        ];

        function normalizeAsteroidKey(value = '') {
            return value.toString().normalize('NFKD').replace(/[^\w()\s.-]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
        }

        function safeNumber(raw) {
            if (raw === undefined || raw === null) return null;
            const input = raw.toString().trim();
            if (!input || input.toLowerCase() === 'n/a') return null;
            const num = Number(input);
            return Number.isFinite(num) ? num : null;
        }

        function formatProbability(prob) {
            if (!Number.isFinite(prob)) return 'Sin dato';
            const percent = prob * 100;
            const decimals = percent >= 1 ? 2 : percent >= 0.01 ? 3 : 4;
            const percentText = `${percent.toFixed(decimals)}%`;
            const sciText = prob < 0.0001 ? prob.toExponential(2) : prob.toFixed(Math.min(decimals + 2, 6));
            return `${percentText} (${sciText})`;
        }

        function formatDiameter(km) {
            if (!Number.isFinite(km)) return 'Sin dato';
            if (km >= 1) return `${km.toFixed(2)} km`;
            return `${(km * 1000).toFixed(0)} m (${km.toFixed(3)} km)`;
        }

        function formatMassKg(mass) {
            if (!Number.isFinite(mass)) return 'Sin dato';
            if (mass >= 1e12) return `${(mass / 1e12).toFixed(2)} Tt (${mass.toExponential(3)} kg)`;
            if (mass >= 1e9) return `${(mass / 1e9).toFixed(2)} Gt (${mass.toExponential(3)} kg)`;
            if (mass >= 1e6) return `${(mass / 1e6).toFixed(1)} Mt (${mass.toExponential(3)} kg)`;
            return `${mass.toLocaleString('es-MX', { maximumFractionDigits: 0 })} kg`;
        }

        function formatVelocity(value) {
            if (!Number.isFinite(value)) return 'Sin dato';
            return `${value.toFixed(2)} km/s`;
        }

        function formatEnergy(energyJ, megatons) {
            if (!Number.isFinite(energyJ)) return 'Sin dato';
            const mtText = Number.isFinite(megatons) ? `${megatons.toFixed(3)} Mt TNT` : '—';
            return `${energyJ.toExponential(3)} J (${mtText})`;
        }

        function refreshRealDataButtonState() {
            if (!realDataButton) return;
            realDataButton.disabled = !normalizeAsteroidKey(lastLaunchedAsteroidName);
        }

        function registerAsteroidRecord(record, meta) {
            const designation = record.designation?.trim();
            if (!designation) return;
            const key = normalizeAsteroidKey(designation);
            const existing = realAsteroidCatalog.get(key) || { designation, sources: [] };
            const updated = { ...existing };
            updated.designation = designation;
            const sources = new Set(existing.sources || []);
            if (meta?.label) sources.add(meta.label);
            updated.sources = Array.from(sources);
            if (record.year_range) updated.yearRange = record.year_range.trim();
            const potential = safeNumber(record.potential_impacts);
            if (potential !== null) updated.potentialImpacts = potential;
            const probability = safeNumber(record.impact_probability);
            if (probability !== null) updated.impactProbability = probability;
            const magnitude = safeNumber(record.absolute_magnitude);
            if (magnitude !== null) updated.absoluteMagnitude = magnitude;
            const palermo = safeNumber(record.palermo_scale_cum);
            if (palermo !== null) updated.palermoScale = palermo;
            const torino = record.torino_scale?.trim();
            if (torino) updated.torinoScale = torino;
            const velocity = safeNumber(record.relative_velocity_km_s);
            if (velocity !== null) updated.relativeVelocity = velocity;
            const composition = record.composition_type?.trim();
            if (composition) updated.compositionType = composition;
            const diameterRaw = safeNumber(record[meta.diameterKey]);
            if (diameterRaw !== null) {
                const km = meta.unit === 'm' ? diameterRaw / 1000 : diameterRaw;
                if (Number.isFinite(km)) updated.estimatedDiameterKm = km;
            }
            realAsteroidCatalog.set(key, updated);
        }

        function parseCsv(text) {
            const lines = text.replace(/\r/g, '').split('\n').filter(line => line.trim().length > 0);
            if (!lines.length) return [];
            const headers = lines.shift().split(',');
            return lines.map(line => {
                const cells = line.split(',');
                const row = {};
                headers.forEach((header, index) => {
                    row[header.trim()] = (cells[index] ?? '').trim();
                });
                return row;
            });
        }

        async function loadRealAsteroidCatalog() {
            try {
                await Promise.all(REAL_DATA_FILES.map(async (file) => {
                    let records = [];
                    if (typeof fetch === 'function') {
                        try {
                            const response = await fetch(encodeURI(file.path));
                            if (!response.ok) throw new Error(`HTTP ${response.status}`);
                            const text = await response.text();
                            records = parseCsv(text);
                        } catch (error) {
                            console.warn(`[Catálogo real] No se pudo cargar ${file.path}:`, error);
                        }
                    }

                    if (!records.length) {
                        const fallback = REAL_DATA_FALLBACK[file.fallbackKey] || [];
                        if (!records.length && fallback.length) {
                            records = fallback;
                        }
                    }

                    if (!records.length) {
                        console.warn(`[Catálogo real] Sin datos para ${file.label}.`);
                        return;
                    }

                    records.forEach(record => registerAsteroidRecord(record, file));
                }));
            } finally {
                realDataCatalogLoaded = true;
            }
        }

        function buildRealDataRows(record, key) {
            const rows = [];
            rows.push(['Nombre oficial', record.designation]);
            if (record.sources?.length) rows.push(['Origen de los datos', record.sources.join(' · ')]);
            rows.push(['Años en los que podria caer', record.yearRange || 'Sin dato']);
            rows.push(['Veces en los que se acerca a la Tierra', Number.isFinite(record.potentialImpacts) ? record.potentialImpacts.toLocaleString('es-MX') : 'Sin dato']);
            rows.push(['Probabilidad de impacto', formatProbability(record.impactProbability)]);
            rows.push(['Brillo aparente (H)', Number.isFinite(record.absoluteMagnitude) ? record.absoluteMagnitude.toFixed(2) : 'Sin dato']);
            rows.push(['Diámetro estimado', formatDiameter(record.estimatedDiameterKm)]);
            rows.push(['Escala de Palermo (cumulativa)', Number.isFinite(record.palermoScale) ? record.palermoScale.toFixed(2) : 'Sin dato']);
            const torinoText = record.torinoScale && record.torinoScale.toString().trim() !== '' ? record.torinoScale : 'Sin dato';

            const simContextMatches = lastImpactContext && normalizeAsteroidKey(lastImpactContext.name) === key;
            if (simContextMatches) {
                rows.push(['Masa utilizada en la simulación', formatMassKg(lastImpactContext.mass)]);
                rows.push(['Densidad asumida', Number.isFinite(lastImpactContext.density) ? `${lastImpactContext.density.toLocaleString('es-MX')} kg/m³` : 'Sin dato']);
                rows.push(['Velocidad inicial simulada', `${lastImpactContext.velocity.toFixed(2)} km/s`]);
                rows.push(['Diámetro en simulación', formatDiameter(lastImpactContext.diameter)]);
                rows.push(['Energía liberada (estimada)', formatEnergy(lastImpactContext.energyJ, lastImpactContext.megatons)]);
            }

            return rows;
        }

        function openRealDataModal() {
            if (!realDataModal) return;
            const key = normalizeAsteroidKey(lastLaunchedAsteroidName);
            const record = realAsteroidCatalog.get(key);
            if (!realDataCatalogLoaded) {
                realDataMeta.textContent = 'Descargando catálogo oficial...';
            } else if (record?.sources?.length) {
                realDataMeta.textContent = `Fuentes: ${record.sources.join(' · ')}`;
            } else {
                realDataMeta.textContent = '';
            }

            if (record) {
                const rows = buildRealDataRows(record, key);
                realDataTableBody.innerHTML = rows.map(([label, value]) => `<tr><th>${label}</th><td>${value}</td></tr>`).join('');
                realDataTable.classList.remove('hidden');
                realDataEmpty.classList.add('hidden');
            } else {
                realDataTable.classList.add('hidden');
                realDataTableBody.innerHTML = '';
                realDataEmpty.classList.remove('hidden');
                if (!normalizeAsteroidKey(lastLaunchedAsteroidName)) {
                    realDataEmpty.textContent = 'Lanza un asteroide de la lista para ver datos reales disponibles.';
                } else if (!realDataCatalogLoaded) {
                    realDataEmpty.textContent = 'El catálogo se está cargando, intenta de nuevo en unos segundos.';
                } else {
                    realDataEmpty.textContent = `No encontramos información oficial para “${lastLaunchedAsteroidName}”.`;
                }
            }

            realDataModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeRealDataModal() {
            if (!realDataModal) return;
            realDataModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (realDataButton) {
            realDataButton.addEventListener('click', () => {
                openRealDataModal();
            });
        }
        if (realDataClose) {
            realDataClose.addEventListener('click', closeRealDataModal);
        }
        if (realDataModal) {
            realDataModal.addEventListener('click', (event) => {
                if (event.target === realDataModal) closeRealDataModal();
            });
        }
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && realDataModal?.classList.contains('active')) {
                closeRealDataModal();
            }
        });

        refreshRealDataButtonState();
        loadRealAsteroidCatalog();

        function applyMapZoom(zoom = currentMapZoom) {
            currentMapZoom = zoom;
            if (mapContainer) {
                mapContainer.style.transformOrigin = `${mapZoomCenter.x}% ${mapZoomCenter.y}%`;
                mapContainer.style.transform = `scale(${currentMapZoom})`;
            }
        }

        function resetMapZoom() {
            mapZoomCenter = { x: 50, y: 50 };
            applyMapZoom(DEFAULT_MAP_ZOOM);
        }

        function triggerImpactZoom(xPercent, yPercent, targetZoom = AUTO_MAP_ZOOM, options = {}) {
            const { hold = false, duration = AUTO_MAP_ZOOM_DURATION } = options;
            mapZoomCenter = { x: xPercent, y: yPercent };
            applyMapZoom(Math.min(targetZoom, MAX_MAP_ZOOM));
            if (autoZoomTimeout) clearTimeout(autoZoomTimeout);
            if (!hold) {
                autoZoomTimeout = setTimeout(() => {
                    resetMapZoom();
                }, duration);
            } else {
                autoZoomTimeout = null;
            }
        }

        function updateLightByUTC() {
            const timeValue = utcInput?.value || '12:00';
            const [hourStr = '12', minuteStr = '0'] = timeValue.split(':');
            const hours = Number(hourStr);
            const minutes = Number(minuteStr);
            const totalHours = ((isNaN(hours) ? 12 : hours) % 24) + (isNaN(minutes) ? 0 : minutes) / 60;
            const angle = (totalHours / 24) * Math.PI * 2 - Math.PI;
            const distance = 6;
            const height = 1.5;
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            directionalLight.position.set(x, height, z);
            directionalLight.target.position.set(0, 0, 0);
            directionalLight.target.updateMatrixWorld();

            let subsolarLon = (totalHours - 12) * 15;
            subsolarLon = ((subsolarLon + 540) % 360) - 180;
            if (utcInfo) {
                const absLon = Math.abs(subsolarLon).toFixed(1);
                const hemisphere = subsolarLon === 0 ? '' : subsolarLon > 0 ? ' E' : ' O';
                const formattedLon = `${absLon}°${hemisphere}`.trim();
                utcInfo.textContent = `El Sol ilumina aproximadamente la longitud ${formattedLon}.`;
            }
        }

        if (utcInput) {
            utcInput.addEventListener('input', updateLightByUTC);
            utcInput.addEventListener('change', updateLightByUTC);
        }

        updateLightByUTC();
        resetMapZoom();

        function clearDamageCircles() {
            const container = document.getElementById('impact-map-container');
            const existing = container.querySelectorAll('.damage-circle');
            existing.forEach(e => e.remove());
        }

        function createDamageCircle(container, pxRadius, label, color = 'rgba(255,165,0,0.25)', leftPercent, topPercent, percentRadius = 0) {
            if (pxRadius <= 0 || !container) return;

            const diameterPx = Math.max(pxRadius * 2, 2);

            const buildCircle = (targetLeft) => {
                const circle = document.createElement('div');
                circle.className = 'damage-circle';
                circle.style.position = 'absolute';
                circle.style.left = `${targetLeft}%`;
                circle.style.top = `${topPercent}%`;
                circle.style.transform = 'translate(-50%,-50%)';
                circle.style.borderRadius = '50%';
                circle.style.border = `2px solid ${color}`;
                circle.style.background = color;
                circle.style.pointerEvents = 'none';
                circle.style.width = `${diameterPx}px`;
                circle.style.height = `${diameterPx}px`;
                circle.title = label;
                return circle;
            };

            container.appendChild(buildCircle(leftPercent));

            if (percentRadius > 0) {
                if (leftPercent - percentRadius < 0) {
                    container.appendChild(buildCircle(leftPercent + 100));
                }
                if (leftPercent + percentRadius > 100) {
                    container.appendChild(buildCircle(leftPercent - 100));
                }
            }
        }

        function updateDamageLegend(entries) {
            const legend = document.getElementById('damage-legend');
            if (!legend) return;
            if (!entries.length) {
                legend.textContent = 'Sin estimaciones disponibles.';
                return;
            }
            let html = '<strong>Radios de Daño Estimados</strong>';
            entries.forEach(({ label, radiusKm, color }) => {
                const swatchColor = color.startsWith('rgba')
                    ? color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, 'rgb($1,$2,$3)')
                    : color;
                html += `<div class="legend-row"><span class="legend-color" style="background:${swatchColor};"></span>${label}: ${radiusKm.toFixed(2)} km</div>`;
            });
            legend.innerHTML = html;
        }

        function handleImpact(asteroidObj) {
            const { diameter, velocity, name } = asteroidObj.data;
            const d_m = diameter * 1000;
            const densityInput = parseFloat(asteroidObj.data.density ?? document.getElementById('custom-density')?.value ?? '3000');
            const density = isNaN(densityInput) ? 3000 : densityInput;
            const volume = (4 / 3) * Math.PI * Math.pow(d_m / 2, 3);
            const mass = volume * density;
            const v_ms = velocity * 1000;
            const energyJ = 0.5 * mass * v_ms * v_ms;
            const megatons = energyJ / 4.184e15;

            lastImpactContext = {
                name,
                mass,
                density,
                velocity,
                diameter,
                energyJ,
                megatons
            };

            // Panel de datos físicos (se mantiene en #consequences)
            let consequenceText = `<strong>Impacto: ${name}</strong><br>`;
            consequenceText += `Diámetro: ${diameter} km — Densidad: ${density} kg/m³<br>`;
            consequenceText += `Masa estimada: ${mass.toExponential(3)} kg<br>`;
            consequenceText += `Energía: ${energyJ.toExponential(3)} J (${megatons.toFixed(3)} megatones de TNT equivalente)`;
            document.getElementById('consequences').innerHTML = consequenceText;
            setLaunchStatus(`Impacto confirmado: ${formatEnergyPreview(megatons)} liberados.`, 'success');
            if (infoPanel) {
                infoPanel.textContent = `Impacto de ${name}: ${formatEnergyPreview(megatons)} liberados. Haz clic en otro punto para cambiar el objetivo.`;
            }

            // Cálculos de radios de daño
            const E = Math.max(megatons, 1e-9);
            const C_crater = 1.5, C_severe = 1.2, C_heavy = 2.5, C_moderate = 5.0, C_thermal = 4.0;
            const crater_km = C_crater * Math.pow(E, 1 / 3);
            const severe_km = C_severe * Math.pow(E, 1 / 3);
            const heavy_km = C_heavy * Math.pow(E, 1 / 3);
            const moderate_km = C_moderate * Math.pow(E, 1 / 3);
            const thermal_km = C_thermal * Math.pow(E, 1 / 3);

            // ---- NUEVA SECCIÓN: Impacto Humano y Secundario ----
            const ringsKm = {
                crater:   [0, crater_km],
                severe:   [crater_km, severe_km],
                heavy:    [severe_km, heavy_km],
                moderate: [heavy_km,  moderate_km],
                thermal:  [moderate_km, thermal_km]
            };

            // Se ejecuta la estimación y luego se actualizan ambos paneles.
            estimateHumanImpactOffline(asteroidObj.data.lat, asteroidObj.data.lon, ringsKm).then(({regionName, density, perRing, totals}) => {
                // 1. Panel de Impacto Humano
                const humanImpactContainer = document.getElementById('human-impact-summary');
                const deadTotal = totals.dead, affectedTotal = totals.dead + totals.injured;
                const deadCrater = perRing.crater?.dead || 0, deadSevere = perRing.severe?.dead || 0;
                const deadHeavy = perRing.heavy?.dead || 0, deadModerate = perRing.moderate?.dead || 0;

                const humanImpactHtml = `
                  <div class="pop-panel">
                    <h4>Impacto Humano Estimado</h4>
                    <div class="row"><span class="strong">📍 Región:</span> ${regionName} (${density.toFixed(2)} pers/km²)</div>
                    <div class="row"><span class="strong">💀 Víctimas mortales:</span> ${formatCompact(deadTotal)}</div>
                    <span class="strong">🏘️ Población afectada total (por consecuencias secundarias):</span> ${formatCompact(affectedTotal)}
                    <div class="row muted" style="font-size: 0.9em; margin-top: 8px;">
                      Detalle de víctimas:<br>
                      - Cráter: ${formatCompact(deadCrater)} | - Zona severa: ${formatCompact(deadSevere)}<br>
                      - Zona fuerte: ${formatCompact(deadHeavy)} | - Zona moderada: ${formatCompact(deadModerate)}
                    </div>
                  </div>`;
                humanImpactContainer.innerHTML = humanImpactHtml;

                // 2. Panel de Consecuencias Secundarias
                const secondaryEffectsContainer = document.getElementById('secondary-effects-container');
                const impactAnalysisData = { megatons, regionName } ;;
                const isOceanicImpact = String(regionName).toLowerCase().includes('océano') || String(regionName).toLowerCase().includes('ocean');
                const isCoastal = isOceanicImpact || isCoastalRegionName(regionName);

              

                const secondaryEffects = getSecondaryEffects(impactAnalysisData);
                
                let secondaryHtml;
                if (secondaryEffects.length > 0) {
                    let effectsList = '<ul>';
                    secondaryEffects.forEach(effect => {
                        effectsList += `<li><strong>${effect.title}:</strong> ${effect.description}</li>`;
                    });
                    effectsList += '</ul>';
                    secondaryHtml = `<div class="results-panel"><h4>Consecuencias Secundarias</h4>${effectsList}</div>`;
                } else {
                    secondaryHtml = `<div class="results-panel"><h4>Consecuencias Secundarias</h4><p>Los efectos secundarios a gran escala son improbables para un impacto de esta magnitud.</p></div>`;
                }
                secondaryEffectsContainer.innerHTML = secondaryHtml;

            }).catch(err => {
                console.warn('[Análisis de Impacto] fallo:', err);
                document.getElementById('human-impact-summary').innerHTML = '';
                document.getElementById('secondary-effects-container').innerHTML = '';
            });

            const map = document.getElementById('impact-map-container');
            const marker = document.getElementById('impact-marker');
            const xPercent = (asteroidObj.data.lon + 180) % 360 / 360 * 100;
            const yPercent = (90 - asteroidObj.data.lat) % 180 / 180 * 100;
            map.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
            marker.style.left = `${xPercent}%`;
            marker.style.top = `${yPercent}%`;
            marker.style.opacity = '1';

            clearDamageCircles();

            const earthCircumferenceKm = 40075;
            const pxPerKm = map.clientWidth ? map.clientWidth / earthCircumferenceKm : 0;
            const crater_px = crater_km * pxPerKm;
            const severe_px = severe_km * pxPerKm;
            const heavy_px = heavy_km * pxPerKm;
            const moderate_px = moderate_km * pxPerKm;
            const thermal_px = thermal_km * pxPerKm;
            const percentPerPx = map.clientWidth ? 100 / map.clientWidth : 0;
            const crater_pct = crater_px * percentPerPx;
            const severe_pct = severe_px * percentPerPx;
            const heavy_pct = heavy_px * percentPerPx;
            const moderate_pct = moderate_px * percentPerPx;
            const thermal_pct = thermal_px * percentPerPx;

            const ringsPx = [thermal_px, moderate_px, heavy_px, severe_px, crater_px]
                .filter(v => typeof v === 'number' && v > 0);
            const largestPx = ringsPx.length ? Math.max(...ringsPx) : 0;
            const shouldHoldZoom = largestPx < MIN_CLEAR_RING_RADIUS_PX;

            if (shouldHoldZoom) {
                const neededScale = Math.min(
                    MAX_MAP_ZOOM,
                    TARGET_RING_RADIUS_PX / Math.max(1, largestPx)
                );
                triggerImpactZoom(xPercent, yPercent, neededScale, { hold: true });
                setTimeout(() => {
                    marker.style.opacity = '0';
                }, 2500);
            } else {
                triggerImpactZoom(xPercent, yPercent);
                setTimeout(() => {
                    marker.style.opacity = '0';
                }, 4000);
            }

            const legendEntries = [
                { label: 'Cráter (transitorio)', radiusKm: crater_km, color: 'rgba(255,140,0,0.45)' },
                { label: 'Daño severo', radiusKm: severe_km, color: 'rgba(255,69,0,0.30)' },
                { label: 'Daño fuerte', radiusKm: heavy_km, color: 'rgba(255,0,0,0.20)' },
                { label: 'Daño moderado', radiusKm: moderate_km, color: 'rgba(255,0,0,0.12)' },
                { label: 'Efecto térmico', radiusKm: thermal_km, color: 'rgba(255,165,0,0.08)' }
            ];

            if (pxPerKm > 0) {
                createDamageCircle(map, crater_px, `${crater_km.toFixed(2)} km (cráter)`, 'rgba(255,140,0,0.45)', xPercent, yPercent, crater_pct);
                createDamageCircle(map, severe_px, `${severe_km.toFixed(2)} km (severo)`, 'rgba(255,69,0,0.30)', xPercent, yPercent, severe_pct);
                createDamageCircle(map, heavy_px, `${heavy_km.toFixed(2)} km (fuerte)`, 'rgba(255,0,0,0.20)', xPercent, yPercent, heavy_pct);
                createDamageCircle(map, moderate_px, `${moderate_km.toFixed(2)} km (moderado)`, 'rgba(255,0,0,0.12)', xPercent, yPercent, moderate_pct);
                createDamageCircle(map, thermal_px, `${thermal_km.toFixed(2)} km (térmico)`, 'rgba(255,165,0,0.08)', xPercent, yPercent, thermal_pct);
            }

            updateDamageLegend(legendEntries);

            const impactGlow = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffa500, transparent: true, opacity: 0.8 }));
            impactGlow.position.copy(asteroidObj.target);
            impactGlow.userData.startTime = Date.now();
            earth.add(impactGlow);
            activeEffects.push(impactGlow);
        }

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const targetMarker = new THREE.Mesh(new THREE.SphereGeometry(0.02, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
        targetMarker.visible = false;
        earth.add(targetMarker);

        function onMouseClick(event) {
            event.preventDefault();
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);

            const worldIntersects = raycaster.intersectObject(earth);

            if (worldIntersects.length > 0) {
                const worldPoint = worldIntersects[0].point;
                const localPoint = earth.worldToLocal(worldPoint.clone());
                
                const phi = Math.acos(localPoint.y);
                const theta = Math.atan2(localPoint.z, -localPoint.x);
                const lat = 90 - THREE.MathUtils.radToDeg(phi);
                let lon = THREE.MathUtils.radToDeg(theta) - 180;
                if (lon < -180) lon += 360;
                
                document.getElementById('custom-lat').value = lat.toFixed(2);
                document.getElementById('custom-lon').value = lon.toFixed(2);
                
                targetMarker.position.copy(localPoint);
                targetMarker.visible = true;
                setTimeout(() => { targetMarker.visible = false; }, 2000);
            }
        }
        simContainer.addEventListener('click', onMouseClick);

        function animate() {
            requestAnimationFrame(animate);
            const now = Date.now();
            const rotationSpeed = 0.0025;
            
            earth.rotation.y += rotationSpeed;
            clouds.rotation.y += rotationSpeed * 1.25;
            moonPivot.rotation.y += rotationSpeed * 0.6;
            moon.rotation.y += rotationSpeed * 2;
            
            for (let i = activeAsteroids.length - 1; i >= 0; i--) {
                const ast = activeAsteroids[i];
                ast.progress += ast.speed;
                ast.mesh.position.lerp(ast.target, ast.progress);

                if (ast.mesh.position.distanceTo(ast.target) < 0.05) {
                    handleImpact(ast);
                    earth.remove(ast.mesh);
                    ast.mesh.traverse(child => {
                        if (child.geometry) child.geometry.dispose();
                        if (child.material) child.material.dispose();
                    });
                    activeAsteroids.splice(i, 1);
                }
            }

            for (let i = activeEffects.length - 1; i >= 0; i--) {
                const effect = activeEffects[i];
                const elapsedTime = (now - effect.userData.startTime) / 1000;
                const life = 1.5;
                if (elapsedTime > life) {
                    earth.remove(effect);
                    effect.geometry.dispose(); effect.material.dispose();
                    activeEffects.splice(i, 1);
                } else {
                    const lifePercent = elapsedTime / life;
                    effect.scale.setScalar(1 + lifePercent * 5);
                    effect.material.opacity = 1.0 - lifePercent;
                }
            }

            controls.update();
            renderer.render(scene, camera);
        }
        
        window.addEventListener('resize', () => {
            camera.aspect = simContainer.clientWidth / simContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(simContainer.clientWidth, simContainer.clientHeight);
        });

        animate();
