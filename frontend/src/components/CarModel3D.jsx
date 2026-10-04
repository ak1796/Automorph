import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Preload base GLB model
useGLTF.preload('/models/ferrari.glb');

// Wheel finish hexadecimal colors & metallic properties
const WHEEL_FINISH_MAP = {
  oem_mesh: { color: '#c0c8d0', roughness: 0.12, metalness: 0.95 },
  gloss_black: { color: '#161618', roughness: 0.15, metalness: 0.85 },
  bronze_forged: { color: '#7d5a0a', roughness: 0.28, metalness: 0.9 },
  carbon_aero: { color: '#242426', roughness: 0.45, metalness: 0.7 },
  titanium_silver: { color: '#8b929a', roughness: 0.2, metalness: 0.92 },
  motorsport_gold: { color: '#b48c28', roughness: 0.25, metalness: 0.88 },
};

// Brand-specific 3D proportions & styling presets
export const CAR_3D_PRESETS = {
  'bmw-m3': {
    scale: [0.97, 1.03, 1.05],
    defaultCaliper: '#0055ff', // BMW Motorsport Blue
    hasCarbonRoof: true,
    spoilerOffset: [0, 0.48, 1.95],
    splitterOffset: [0, -0.42, -2.18],
    skirtsOffset: [0, -0.42, 0],
    diffuserOffset: [0, -0.38, 2.12],
    hoodOffset: [0, 0.24, -1.35],
    liveryRoofOffset: [0, 0.85, -0.05],
    liveryHoodOffset: [0, 0.26, -1.35],
  },
  'toyota-supra': {
    scale: [1.02, 0.94, 0.95],
    defaultCaliper: '#dc2626', // GR Supra Red
    hasCarbonRoof: false,
    spoilerOffset: [0, 0.44, 1.76],
    splitterOffset: [0, -0.42, -1.98],
    skirtsOffset: [0, -0.42, 0],
    diffuserOffset: [0, -0.38, 1.92],
    hoodOffset: [0, 0.22, -1.22],
    liveryRoofOffset: [0, 0.78, -0.05],
    liveryHoodOffset: [0, 0.24, -1.22],
  },
  'porsche-911': {
    scale: [1.04, 0.91, 0.97],
    defaultCaliper: '#eab308', // Porsche Carbon Ceramic Yellow
    hasCarbonRoof: false,
    spoilerOffset: [0, 0.45, 1.84],
    splitterOffset: [0, -0.42, -2.02],
    skirtsOffset: [0, -0.42, 0],
    diffuserOffset: [0, -0.38, 1.96],
    hoodOffset: [0, 0.22, -1.25],
    liveryRoofOffset: [0, 0.76, -0.05],
    liveryHoodOffset: [0, 0.24, -1.25],
  },
  'nissan-gtr': {
    scale: [1.03, 1.02, 1.04],
    defaultCaliper: '#eab308', // Gold/Bronze Brembos
    hasCarbonRoof: true,
    spoilerOffset: [0, 0.47, 1.92],
    splitterOffset: [0, -0.42, -2.15],
    skirtsOffset: [0, -0.42, 0],
    diffuserOffset: [0, -0.38, 2.10],
    hoodOffset: [0, 0.24, -1.32],
    liveryRoofOffset: [0, 0.84, -0.05],
    liveryHoodOffset: [0, 0.26, -1.32],
  },
  'ford-mustang': {
    scale: [1.04, 1.04, 1.07],
    defaultCaliper: '#dc2626', // Brembo Red
    hasCarbonRoof: false,
    spoilerOffset: [0, 0.48, 1.98],
    splitterOffset: [0, -0.42, -2.22],
    skirtsOffset: [0, -0.42, 0],
    diffuserOffset: [0, -0.38, 2.15],
    hoodOffset: [0, 0.25, -1.38],
    liveryRoofOffset: [0, 0.86, -0.05],
    liveryHoodOffset: [0, 0.27, -1.38],
  },
  'corvette-c8': {
    scale: [1.05, 0.92, 1.01],
    defaultCaliper: '#dc2626', // Edge Red
    hasCarbonRoof: true,
    spoilerOffset: [0, 0.46, 1.88],
    splitterOffset: [0, -0.42, -2.08],
    skirtsOffset: [0, -0.42, 0],
    diffuserOffset: [0, -0.38, 2.05],
    hoodOffset: [0, 0.23, -1.28],
    liveryRoofOffset: [0, 0.77, -0.05],
    liveryHoodOffset: [0, 0.25, -1.28],
  },
  'lamborghini-huracan': {
    scale: [1.07, 0.88, 0.98],
    defaultCaliper: '#84cc16', // Acid Neon Green
    hasCarbonRoof: false,
    spoilerOffset: [0, 0.44, 1.82],
    splitterOffset: [0, -0.42, -2.04],
    skirtsOffset: [0, -0.42, 0],
    diffuserOffset: [0, -0.38, 1.98],
    hoodOffset: [0, 0.21, -1.24],
    liveryRoofOffset: [0, 0.74, -0.05],
    liveryHoodOffset: [0, 0.23, -1.24],
  },
  'audi-r8': {
    scale: [1.05, 0.92, 0.99],
    defaultCaliper: '#dc2626', // Audi Red
    hasCarbonRoof: true,
    spoilerOffset: [0, 0.45, 1.86],
    splitterOffset: [0, -0.42, -2.06],
    skirtsOffset: [0, -0.42, 0],
    diffuserOffset: [0, -0.38, 2.02],
    hoodOffset: [0, 0.23, -1.26],
    liveryRoofOffset: [0, 0.77, -0.05],
    liveryHoodOffset: [0, 0.25, -1.26],
  },
  'amg-gt': {
    scale: [1.03, 0.93, 1.05],
    defaultCaliper: '#eab308', // AMG Carbon Ceramic Bronze Gold
    hasCarbonRoof: true,
    spoilerOffset: [0, 0.46, 1.94],
    splitterOffset: [0, -0.42, -2.18],
    skirtsOffset: [0, -0.42, 0],
    diffuserOffset: [0, -0.38, 2.10],
    hoodOffset: [0, 0.24, -1.34],
    liveryRoofOffset: [0, 0.79, -0.05],
    liveryHoodOffset: [0, 0.26, -1.34],
  },
  'dodge-challenger': {
    scale: [1.05, 1.06, 1.09],
    defaultCaliper: '#ea580c', // SRT Orange
    hasCarbonRoof: false,
    spoilerOffset: [0, 0.49, 2.02],
    splitterOffset: [0, -0.42, -2.25],
    skirtsOffset: [0, -0.42, 0],
    diffuserOffset: [0, -0.38, 2.18],
    hoodOffset: [0, 0.26, -1.40],
    liveryRoofOffset: [0, 0.88, -0.05],
    liveryHoodOffset: [0, 0.28, -1.40],
  },
};

/**
 * Procedural Dynamic Carbon Texture Generator
 */
const createProceduralCarbonCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#141416';
  ctx.fillRect(0, 0, 64, 64);

  ctx.fillStyle = '#222226';
  for (let i = 0; i < 64; i += 8) {
    for (let j = 0; j < 64; j += 8) {
      if ((i / 8 + j / 8) % 2 === 0) {
        ctx.fillRect(i, j, 8, 8);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
};

/**
 * 1. 3D Aerodynamic Spoiler Component (Rear Decklid / Tail: +Z)
 * Supports dynamic angle-of-attack (AOA) adjustment!
 */
const Spoiler3D = ({ type, paintColor, preset, wingAngleOption }) => {
  const [posX, posY, posZ] = preset.spoilerOffset;
  const carbonTexture = useMemo(() => createProceduralCarbonCanvas(), []);

  // Compute angle of attack in radians (e.g. 2 deg, 8 deg, 16 deg)
  const aoaRad = ((wingAngleOption?.angleDeg || 4) * Math.PI) / 180;

  if (!type || type.id === 'factory_lip') {
    return (
      <group position={[posX, posY, posZ]}>
        {/* Subtle flush trunk lip */}
        <mesh castShadow>
          <boxGeometry args={[1.32, 0.035, 0.16]} />
          <meshStandardMaterial
            color={paintColor || '#154734'}
            roughness={0.25}
            metalness={0.65}
          />
        </mesh>
      </group>
    );
  }

  if (type.id === 'carbon_ducktail') {
    return (
      <group position={[posX, posY + 0.03, posZ]} rotation={[-0.26 - aoaRad * 0.4, 0, 0]}>
        {/* Extended Carbon Ducktail spoiler */}
        <mesh castShadow>
          <boxGeometry args={[1.42, 0.07, 0.26]} />
          <meshStandardMaterial
            map={carbonTexture}
            color="#18181a"
            roughness={0.35}
            metalness={0.7}
          />
        </mesh>
      </group>
    );
  }

  if (type.id === 'gt_track_wing') {
    return (
      <group position={[posX, posY + 0.05, posZ]}>
        {/* Aluminum upright stanchions */}
        <mesh position={[-0.48, 0.18, 0]} castShadow>
          <boxGeometry args={[0.035, 0.36, 0.14]} />
          <meshStandardMaterial color="#111111" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0.48, 0.18, 0]} castShadow>
          <boxGeometry args={[0.035, 0.36, 0.14]} />
          <meshStandardMaterial color="#111111" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* High-downforce main airfoil blade with interactive Angle-of-Attack (AOA) */}
        <mesh position={[0, 0.36, 0.02]} rotation={[0.08 + aoaRad, 0, 0]} castShadow>
          <boxGeometry args={[1.58, 0.045, 0.34]} />
          <meshStandardMaterial
            map={carbonTexture}
            color="#141416"
            roughness={0.3}
            metalness={0.75}
          />
        </mesh>

        {/* Aerodynamic side endplates */}
        <mesh position={[-0.8, 0.36, 0.02]} rotation={[aoaRad * 0.5, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.18, 0.38]} />
          <meshStandardMaterial color="#0c0c0e" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0.8, 0.36, 0.02]} rotation={[aoaRad * 0.5, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.18, 0.38]} />
          <meshStandardMaterial color="#0c0c0e" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>
    );
  }

  if (type.id === 'swan_neck_wing') {
    return (
      <group position={[posX, posY + 0.06, posZ]}>
        {/* Top-hung Swan-Neck curved aluminum brackets */}
        <mesh position={[-0.44, 0.24, -0.06]} rotation={[-0.35, 0, 0]} castShadow>
          <boxGeometry args={[0.04, 0.44, 0.08]} />
          <meshStandardMaterial color="#0f0f12" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0.44, 0.24, -0.06]} rotation={[-0.35, 0, 0]} castShadow>
          <boxGeometry args={[0.04, 0.44, 0.08]} />
          <meshStandardMaterial color="#0f0f12" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Top-mounted competition 3D contour airfoil with interactive AOA */}
        <mesh position={[0, 0.42, 0.04]} rotation={[0.06 + aoaRad, 0, 0]} castShadow>
          <boxGeometry args={[1.68, 0.05, 0.38]} />
          <meshStandardMaterial
            map={carbonTexture}
            color="#101014"
            roughness={0.25}
            metalness={0.8}
          />
        </mesh>

        {/* Large Track Endplates */}
        <mesh position={[-0.85, 0.42, 0.04]} rotation={[aoaRad * 0.5, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.24, 0.42]} />
          <meshStandardMaterial color="#08080a" roughness={0.25} metalness={0.8} />
        </mesh>
        <mesh position={[0.85, 0.42, 0.04]} rotation={[aoaRad * 0.5, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.24, 0.42]} />
          <meshStandardMaterial color="#08080a" roughness={0.25} metalness={0.8} />
        </mesh>
      </group>
    );
  }

  return null;
};

/**
 * 7. 3D Performance Exhaust Quad Tailpipes Component (Rear Valence: +Z)
 */
const Exhaust3D = ({ type, preset }) => {
  const [posX, posY, posZ] = preset.diffuserOffset;
  const isTitanium = type?.id === 'exhaust_titanium';
  const isCarbon = type?.id === 'exhaust_valved_carbon';

  const tipColor = isTitanium ? '#3b82f6' : isCarbon ? '#1c1c1e' : '#cbd5e1';
  const tipMetalness = isCarbon ? 0.6 : 0.95;
  const tipRoughness = isCarbon ? 0.35 : 0.1;

  return (
    <group position={[posX, posY - 0.02, posZ + 0.12]}>
      {/* Left Dual Exhaust Pipes */}
      <mesh position={[-0.42, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.042, 0.042, 0.18, 16, 1, true]} />
        <meshStandardMaterial color={tipColor} metalness={tipMetalness} roughness={tipRoughness} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.52, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.042, 0.042, 0.18, 16, 1, true]} />
        <meshStandardMaterial color={tipColor} metalness={tipMetalness} roughness={tipRoughness} side={THREE.DoubleSide} />
      </mesh>

      {/* Right Dual Exhaust Pipes */}
      <mesh position={[0.42, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.042, 0.042, 0.18, 16, 1, true]} />
        <meshStandardMaterial color={tipColor} metalness={tipMetalness} roughness={tipRoughness} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.52, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.042, 0.042, 0.18, 16, 1, true]} />
        <meshStandardMaterial color={tipColor} metalness={tipMetalness} roughness={tipRoughness} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

/**
 * 8. 3D Aerodynamic Wing Mirror Covers Component
 */
const MirrorCaps3D = ({ type, paintColor, preset }) => {
  if (!type || type.id === 'mirror_body') return null;

  const isCarbon = type.id === 'mirror_carbon';
  const capColor = isCarbon ? '#151517' : '#0a0a0c';
  const capRoughness = isCarbon ? 0.35 : 0.15;
  const capMetalness = isCarbon ? 0.7 : 0.85;

  return (
    <group position={[0, 0.22, -0.68]}>
      {/* Left Mirror Shell */}
      <mesh position={[-0.89, 0, 0]} rotation={[0.1, -0.2, 0.15]} castShadow>
        <boxGeometry args={[0.16, 0.1, 0.22]} />
        <meshStandardMaterial color={capColor} roughness={capRoughness} metalness={capMetalness} />
      </mesh>
      {/* Right Mirror Shell */}
      <mesh position={[0.89, 0, 0]} rotation={[0.1, 0.2, -0.15]} castShadow>
        <boxGeometry args={[0.16, 0.1, 0.22]} />
        <meshStandardMaterial color={capColor} roughness={capRoughness} metalness={capMetalness} />
      </mesh>
    </group>
  );
};

/**
 * 2. 3D Front Splitter Component (Front Bumper: -Z)
 */
const FrontSplitter3D = ({ type, preset }) => {
  if (!type || type.id === 'splitter_stock') return null;

  const [posX, posY, posZ] = preset.splitterOffset;
  const isTrack = type.id === 'splitter_track_canards';

  return (
    <group position={[posX, posY, posZ]}>
      {/* Front splitter blade */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[1.78, 0.035, isTrack ? 0.38 : 0.24]} />
        <meshStandardMaterial color="#141416" roughness={0.35} metalness={0.7} />
      </mesh>

      {/* Aerodynamic bumper dive planes / canards */}
      {isTrack && (
        <group>
          <mesh position={[-0.86, 0.16, 0.05]} rotation={[0, 0, 0.35]} castShadow>
            <boxGeometry args={[0.22, 0.02, 0.18]} />
            <meshStandardMaterial color="#111114" roughness={0.3} metalness={0.75} />
          </mesh>
          <mesh position={[0.86, 0.16, 0.05]} rotation={[0, 0, -0.35]} castShadow>
            <boxGeometry args={[0.22, 0.02, 0.18]} />
            <meshStandardMaterial color="#111114" roughness={0.3} metalness={0.75} />
          </mesh>
        </group>
      )}
    </group>
  );
};

/**
 * 3. 3D Side Skirts Component (Left -X / Right +X)
 */
const SideSkirts3D = ({ type, preset }) => {
  if (!type || type.id === 'skirt_stock') return null;

  const [posX, posY, posZ] = preset.skirtsOffset;
  const isTrack = type.id === 'skirt_track_aero';
  const width = isTrack ? 0.14 : 0.08;

  return (
    <group position={[posX, posY, posZ]}>
      {/* Left Rocker Blade */}
      <mesh position={[-0.9, 0.02, 0]} castShadow>
        <boxGeometry args={[width, 0.035, 2.75]} />
        <meshStandardMaterial color="#141416" roughness={0.35} metalness={0.7} />
      </mesh>
      {/* Right Rocker Blade */}
      <mesh position={[0.9, 0.02, 0]} castShadow>
        <boxGeometry args={[width, 0.035, 2.75]} />
        <meshStandardMaterial color="#141416" roughness={0.35} metalness={0.7} />
      </mesh>

      {/* Track Air-Guide Winglets near rear wheel arches */}
      {isTrack && (
        <group>
          <mesh position={[-0.94, 0.1, 1.2]} castShadow>
            <boxGeometry args={[0.02, 0.14, 0.22]} />
            <meshStandardMaterial color="#111114" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0.94, 0.1, 1.2]} castShadow>
            <boxGeometry args={[0.02, 0.14, 0.22]} />
            <meshStandardMaterial color="#111114" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
};

/**
 * 4. 3D Rear Diffuser Component (Rear Bumper Lower Valence: +Z)
 */
const RearDiffuser3D = ({ type, preset }) => {
  if (!type || type.id === 'diffuser_stock') return null;

  const [posX, posY, posZ] = preset.diffuserOffset;
  const isRace = type.id === 'diffuser_race_tunnels';

  return (
    <group position={[posX, posY, posZ]}>
      {/* Lower underbody tray */}
      <mesh position={[0, -0.02, 0]} castShadow>
        <boxGeometry args={[1.56, 0.03, 0.32]} />
        <meshStandardMaterial color="#111114" roughness={0.4} metalness={0.65} />
      </mesh>

      {/* Vertical Strakes / Venturi Diffuser Fins */}
      <mesh position={[-0.45, 0.04, 0.02]} castShadow>
        <boxGeometry args={[0.03, 0.14, 0.36]} />
        <meshStandardMaterial color="#0f0f12" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-0.15, 0.04, 0.02]} castShadow>
        <boxGeometry args={[0.03, 0.14, 0.36]} />
        <meshStandardMaterial color="#0f0f12" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0.15, 0.04, 0.02]} castShadow>
        <boxGeometry args={[0.03, 0.14, 0.36]} />
        <meshStandardMaterial color="#0f0f12" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0.45, 0.04, 0.02]} castShadow>
        <boxGeometry args={[0.03, 0.14, 0.36]} />
        <meshStandardMaterial color="#0f0f12" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Race Tunnel Strakes (Full Venturi Package) */}
      {isRace && (
        <group>
          <mesh position={[-0.68, 0.06, 0.04]} castShadow>
            <boxGeometry args={[0.03, 0.16, 0.4]} />
            <meshStandardMaterial color="#08080a" roughness={0.25} metalness={0.85} />
          </mesh>
          <mesh position={[0.68, 0.06, 0.04]} castShadow>
            <boxGeometry args={[0.03, 0.16, 0.4]} />
            <meshStandardMaterial color="#08080a" roughness={0.25} metalness={0.85} />
          </mesh>
        </group>
      )}
    </group>
  );
};

/**
 * 5. 3D Hood Style Component (Front Engine Bonnet: -Z)
 */
const HoodStyle3D = ({ type, preset }) => {
  if (!type || type.id === 'hood_stock') return null;

  const [posX, posY, posZ] = preset.hoodOffset;

  if (type.id === 'hood_vented_carbon') {
    return (
      <group position={[posX, posY, posZ]}>
        {/* Left heat extractor louver */}
        <mesh position={[-0.26, 0.02, 0]} rotation={[0.06, 0, 0]} castShadow>
          <boxGeometry args={[0.18, 0.025, 0.38]} />
          <meshStandardMaterial color="#111114" roughness={0.35} metalness={0.7} />
        </mesh>
        {/* Right heat extractor louver */}
        <mesh position={[0.26, 0.02, 0]} rotation={[0.06, 0, 0]} castShadow>
          <boxGeometry args={[0.18, 0.025, 0.38]} />
          <meshStandardMaterial color="#111114" roughness={0.35} metalness={0.7} />
        </mesh>
      </group>
    );
  }

  if (type.id === 'hood_power_bulge') {
    return (
      <group position={[posX, posY + 0.015, posZ]}>
        {/* Aggressive center power bulge with air intake cowl */}
        <mesh position={[0, 0.02, 0]} rotation={[0.05, 0, 0]} castShadow>
          <boxGeometry args={[0.52, 0.04, 0.65]} />
          <meshStandardMaterial color="#141416" roughness={0.3} metalness={0.75} />
        </mesh>
      </group>
    );
  }

  return null;
};

/**
 * 6. 3D Racing Liveries & Decals Component
 */
const Livery3D = ({ type, preset }) => {
  if (!type || type.id === 'livery_none') return null;

  const [rX, rY, rZ] = preset.liveryRoofOffset;
  const [hX, hY, hZ] = preset.liveryHoodOffset;

  if (type.id === 'livery_twin_stripes') {
    return (
      <group>
        {/* Roof stripes */}
        <mesh position={[rX - 0.12, rY + 0.01, rZ]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[0.08, 0.01, 1.25]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[rX + 0.12, rY + 0.01, rZ]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[0.08, 0.01, 1.25]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Hood stripes */}
        <mesh position={[hX - 0.12, hY + 0.01, hZ]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[0.08, 0.01, 1.15]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[hX + 0.12, hY + 0.01, hZ]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[0.08, 0.01, 1.15]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
        </mesh>
      </group>
    );
  }

  if (type.id === 'livery_side_stripes') {
    return (
      <group>
        {/* Left rocker stripe */}
        <mesh position={[-0.87, -0.22, 0]}>
          <boxGeometry args={[0.015, 0.06, 2.3]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.2} />
        </mesh>
        {/* Right rocker stripe */}
        <mesh position={[0.87, -0.22, 0]}>
          <boxGeometry args={[0.015, 0.06, 2.3]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.2} />
        </mesh>
      </group>
    );
  }

  if (type.id === 'livery_apex_edition') {
    return (
      <group>
        {/* Apex geometric accent lines */}
        <mesh position={[rX, rY + 0.012, rZ]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[0.35, 0.01, 1.3]} />
          <meshStandardMaterial color="#0284c7" roughness={0.25} metalness={0.3} />
        </mesh>
        <mesh position={[hX, hY + 0.012, hZ]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[0.35, 0.01, 1.2]} />
          <meshStandardMaterial color="#0284c7" roughness={0.25} metalness={0.3} />
        </mesh>
        <mesh position={[-0.87, -0.2, 0]}>
          <boxGeometry args={[0.015, 0.08, 2.4]} />
          <meshStandardMaterial color="#0284c7" roughness={0.25} metalness={0.3} />
        </mesh>
        <mesh position={[0.87, -0.2, 0]}>
          <boxGeometry args={[0.015, 0.08, 2.4]} />
          <meshStandardMaterial color="#0284c7" roughness={0.25} metalness={0.3} />
        </mesh>
      </group>
    );
  }

  return null;
};

/**
 * CarModel3D — Main Component
 * Renders base GLTF mesh, custom paint, wheel finishes, calipers, ride height,
 * and attaches perfectly positioned 3D aerodynamic components.
 */
const CarModel3D = ({
  selectedCar,
  paintColor,
  wheelOption,
  spoilerOption,
  bodyKitOption,
  frontSplitterOption,
  sideSkirtsOption,
  rearDiffuserOption,
  hoodOption,
  caliperOption,
  liveryOption,
  suspensionOption,
  exhaustOption,
  mirrorCapsOption,
  wingAngleOption,
  autoRotate,
}) => {
  const carId = selectedCar?.id || selectedCar?.carId || 'bmw-m3';
  const preset = CAR_3D_PRESETS[carId] || CAR_3D_PRESETS['bmw-m3'];

  // Load base GLB model
  const { scene } = useGLTF('/models/ferrari.glb');
  const groupRef = useRef();

  // Ride height dynamic offset
  const suspensionDrop = suspensionOption?.heightOffsetMm || 0;
  const basePosY = -0.45 + suspensionDrop;

  // Material updates on GLTF hierarchy
  useEffect(() => {
    if (!scene) return;

    const targetBodyColor = new THREE.Color(paintColor || '#154734');
    const wheelSpec = WHEEL_FINISH_MAP[wheelOption?.id] || {
      color: wheelOption?.color || '#c0c8d0',
      roughness: 0.15,
      metalness: 0.9,
    };
    const targetRimColor = new THREE.Color(wheelSpec.color);
    const targetCaliperColor = new THREE.Color(caliperOption?.hex || preset.defaultCaliper);

    scene.traverse((child) => {
      if (!child.isMesh) return;

      const matName = (child.material?.name || '').toLowerCase();
      const meshName = (child.name || '').toLowerCase();

      // 1. Exterior Paint
      if (
        matName === 'body_color' ||
        matName === '_0098_dodgerblue' ||
        matName === 'ferrari_yellow' ||
        meshName.includes('body')
      ) {
        if (!child.material._automorphCloned) {
          child.material = child.material.clone();
          child.material._automorphCloned = true;
        }
        child.material.color.set(targetBodyColor);
        child.material.metalness = 0.68;
        child.material.roughness = 0.18;
      }

      // 2. Wheels / Rims
      if (matName === 'metal_chrome' || meshName.includes('rim_')) {
        if (!child.material._automorphCloned) {
          child.material = child.material.clone();
          child.material._automorphCloned = true;
        }
        child.material.color.set(targetRimColor);
        child.material.metalness = wheelSpec.metalness;
        child.material.roughness = wheelSpec.roughness;
      }

      // 3. Brake Calipers
      if (matName === 'leather_red' || meshName.includes('brake')) {
        if (!child.material._automorphCloned) {
          child.material = child.material.clone();
          child.material._automorphCloned = true;
        }
        child.material.color.set(targetCaliperColor);
        child.material.metalness = 0.75;
        child.material.roughness = 0.25;
      }

      // 4. Carbon Roof option for cars with carbon roof
      if (preset.hasCarbonRoof && (matName.includes('roof') || meshName.includes('roof'))) {
        if (!child.material._automorphCloned) {
          child.material = child.material.clone();
          child.material._automorphCloned = true;
        }
        child.material.color.set(new THREE.Color('#101012'));
        child.material.roughness = 0.5;
      }
    });
  }, [
    scene,
    carId,
    paintColor,
    wheelOption,
    caliperOption,
    preset,
  ]);

  // Handle continuous studio rotation
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  // Consolidate package options with individual component options
  const activeFrontSplitter =
    frontSplitterOption && frontSplitterOption.id !== 'splitter_stock'
      ? frontSplitterOption
      : bodyKitOption?.id === 'm_perf_package'
      ? { id: 'splitter_carbon_blade', name: 'M Performance Splitter' }
      : bodyKitOption?.id === 'track_aerokit'
      ? { id: 'splitter_track_canards', name: 'Track Aero Splitter' }
      : frontSplitterOption;

  const activeSideSkirts =
    sideSkirtsOption && sideSkirtsOption.id !== 'skirt_stock'
      ? sideSkirtsOption
      : bodyKitOption?.id === 'm_perf_package'
      ? { id: 'skirt_carbon_extensions', name: 'Carbon Side Extensions' }
      : bodyKitOption?.id === 'track_aerokit'
      ? { id: 'skirt_track_aero', name: 'Widebody Track Skirts' }
      : sideSkirtsOption;

  const activeRearDiffuser =
    rearDiffuserOption && rearDiffuserOption.id !== 'diffuser_stock'
      ? rearDiffuserOption
      : bodyKitOption?.id === 'm_perf_package'
      ? { id: 'diffuser_carbon_finned', name: 'Carbon Finned Diffuser' }
      : bodyKitOption?.id === 'track_aerokit'
      ? { id: 'diffuser_race_tunnels', name: 'Venturi Race Diffuser' }
      : rearDiffuserOption;

  return (
    <group ref={groupRef}>
      {/* 3D Base Car Body with Stance Proportions & Ride Height Drop */}
      <primitive
        object={scene}
        scale={preset.scale}
        position={[0, basePosY, 0]}
        rotation={[0, Math.PI * 0.15, 0]}
      />

      {/* Aerodynamic Attachments parented to suspension height & stance */}
      <group position={[0, suspensionDrop, 0]}>
        {/* 1. Rear Spoiler with Adjustable AOA */}
        <Spoiler3D
          type={spoilerOption}
          paintColor={paintColor}
          preset={preset}
          wingAngleOption={wingAngleOption}
        />

        {/* 2. Front Splitter */}
        <FrontSplitter3D type={activeFrontSplitter} preset={preset} />

        {/* 3. Side Skirts */}
        <SideSkirts3D type={activeSideSkirts} preset={preset} />

        {/* 4. Rear Diffuser */}
        <RearDiffuser3D type={activeRearDiffuser} preset={preset} />

        {/* 5. Performance Quad Exhaust Tailpipes */}
        <Exhaust3D type={exhaustOption} preset={preset} />

        {/* 6. Aerodynamic Wing Mirror Covers */}
        <MirrorCaps3D type={mirrorCapsOption} paintColor={paintColor} preset={preset} />

        {/* 7. Hood Style */}
        <HoodStyle3D type={hoodOption} preset={preset} />

        {/* 8. Racing Liveries & Decals */}
        <Livery3D type={liveryOption} preset={preset} />
      </group>
    </group>
  );
};

export default CarModel3D;
