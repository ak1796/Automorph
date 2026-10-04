import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import { useCarContext } from '../context/CarContext';
import CarModel3D from './CarModel3D';
import { Sparkles, RotateCcw, ZoomIn } from 'lucide-react';

/** Skeleton loader shown while the GLB is loading */
const ModelLoadingState = () => (
  <Html center>
    <div className="flex flex-col items-center gap-3 select-none">
      <div className="w-16 h-16 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      <span className="text-xs text-slate-400 font-medium tracking-wider">Loading 3D Model…</span>
    </div>
  </Html>
);

/** Error boundary for Three.js rendering issues */
class ThreeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/** Fallback 2D view when 3D fails */
const FallbackViewer = ({ selectedCar, customizations }) => {
  const overlayStyle = (() => {
    const { id, hex } = customizations.paint;
    if (id === 'stealth_black') return { backgroundColor: '#000000', mixBlendMode: 'multiply', opacity: 0.85 };
    if (id === 'chalk_white') return { backgroundColor: '#ffffff', mixBlendMode: 'overlay', opacity: 0.5 };
    if (id === 'gt_silver') return { backgroundColor: '#94a3b8', mixBlendMode: 'color', opacity: 0.65 };
    return { backgroundColor: hex, mixBlendMode: 'color', opacity: 0.65 };
  })();

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <img
        src={selectedCar.image}
        alt={selectedCar.name}
        className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.95)] transition-all duration-500"
      />
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-500"
        style={{
          ...overlayStyle,
          maskImage: `url(${selectedCar.image})`,
          WebkitMaskImage: `url(${selectedCar.image})`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
        }}
      />
    </div>
  );
};

const CustomizerViewer = () => {
  const { selectedCar, customizations } = useCarContext();
  const [autoRotate, setAutoRotate] = useState(false);
  const [viewMode, setViewMode] = useState('3d'); // '3d' | '2d'
  const controlsRef = useRef();

  if (!selectedCar) return null;

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-[420px] sm:h-[500px] lg:h-[560px] bg-[#0a0c10] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">

      {/* Studio background gradient pulse matching paint color */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at 50% 70%, ${customizations.paint.hex}30 0%, rgba(10,12,16,0) 65%)`
        }}
      />

      {/* Top-left info badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
        <span className="bg-[#12151c]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-100">
          {selectedCar.name}
        </span>
        <span className="bg-[#12151c]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-md text-xs text-slate-300 flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block border border-white/30 shadow-sm transition-all duration-300"
            style={{ backgroundColor: customizations.paint.hex }}
          />
          {customizations.paint.name}
        </span>
      </div>

      {/* Top-right: 3D badge + controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* View mode toggle */}
        <div className="flex bg-[#12151c]/90 backdrop-blur-md border border-white/10 rounded-md overflow-hidden">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-2.5 py-1.5 text-[10px] font-semibold transition ${
              viewMode === '3d' ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3D
          </button>
          <button
            onClick={() => setViewMode('2d')}
            className={`px-2.5 py-1.5 text-[10px] font-semibold transition ${
              viewMode === '2d' ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2D
          </button>
        </div>

        <span className="hidden sm:flex items-center gap-1.5 bg-[#12151c]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-md text-[11px] text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Live 3D Studio</span>
        </span>
      </div>

      {/* Bottom-left: Camera View Angle Presets & Controls */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <button
          onClick={handleResetCamera}
          title="Reset Default Camera Angle"
          className="bg-[#12151c]/90 backdrop-blur-md border border-white/10 p-2 rounded-md text-slate-400 hover:text-white transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Preset Angles */}
        <div className="hidden sm:flex bg-[#12151c]/90 backdrop-blur-md border border-white/10 rounded-md overflow-hidden">
          <button
            onClick={() => controlsRef.current?.object && controlsRef.current.object.position.set(4.2, 0.6, 4.2)}
            className="px-2 py-1 text-[10px] text-slate-300 hover:text-white hover:bg-white/10 transition border-r border-white/10"
          >
            3/4 Front
          </button>
          <button
            onClick={() => controlsRef.current?.object && controlsRef.current.object.position.set(-4.2, 0.8, -4.2)}
            className="px-2 py-1 text-[10px] text-slate-300 hover:text-white hover:bg-white/10 transition border-r border-white/10"
          >
            3/4 Rear
          </button>
          <button
            onClick={() => controlsRef.current?.object && controlsRef.current.object.position.set(0, 0.4, 5.2)}
            className="px-2 py-1 text-[10px] text-slate-300 hover:text-white hover:bg-white/10 transition border-r border-white/10"
          >
            Front Nose
          </button>
          <button
            onClick={() => controlsRef.current?.object && controlsRef.current.object.position.set(0, 0.5, -5.2)}
            className="px-2 py-1 text-[10px] text-slate-300 hover:text-white hover:bg-white/10 transition border-r border-white/10"
          >
            Rear Tail
          </button>
          <button
            onClick={() => controlsRef.current?.object && controlsRef.current.object.position.set(5.2, 0.2, 0)}
            className="px-2 py-1 text-[10px] text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            Side Profile
          </button>
        </div>

        <button
          onClick={() => setAutoRotate(prev => !prev)}
          title={autoRotate ? 'Stop Auto-Rotate' : 'Auto-Rotate'}
          className={`bg-[#12151c]/90 backdrop-blur-md border px-3 py-1.5 rounded-md text-[10px] font-medium transition ${
            autoRotate
              ? 'border-white/40 text-white'
              : 'border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          {autoRotate ? '⏹ Stop Rotate' : '↻ Auto-Rotate'}
        </button>
      </div>

      {/* Bottom-right: Drag hint */}
      <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-1.5 bg-[#12151c]/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-md text-[10px] text-slate-500">
        <ZoomIn className="w-3 h-3" />
        <span>Drag to rotate · Scroll to zoom</span>
      </div>

      {/* Active customization chips — bottom center */}
      <div className="absolute bottom-14 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 flex-wrap justify-center px-2 pointer-events-none max-w-[90%]">
        <div className="bg-[#0a0c10]/90 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-[10px] font-medium text-slate-200 shadow-lg flex items-center gap-1">
          <span>🛞</span>
          <span className="truncate max-w-[110px] sm:max-w-none">{customizations?.wheels?.name}</span>
        </div>
        <div className="bg-[#0a0c10]/90 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-[10px] font-medium text-slate-200 shadow-lg flex items-center gap-1">
          <span>🏎️</span>
          <span className="truncate max-w-[110px] sm:max-w-none">{customizations?.spoiler?.name}</span>
        </div>
        <div className="bg-[#0a0c10]/90 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-[10px] font-medium text-slate-200 shadow-lg flex items-center gap-1">
          <span>⚡</span>
          <span className="truncate max-w-[110px] sm:max-w-none">{customizations?.bodyKit?.name}</span>
        </div>
        {customizations?.caliper && (
          <div className="bg-[#0a0c10]/90 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-[10px] font-medium text-slate-200 shadow-lg hidden md:flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: customizations.caliper.hex }}
            />
            <span className="truncate max-w-[90px]">{customizations.caliper.name.split(' ')[0]}</span>
          </div>
        )}
      </div>

      {/* Main viewer area */}
      <div className="absolute inset-0">
        {viewMode === '2d' ? (
          <div className="w-full h-full flex items-center justify-center p-8">
            <FallbackViewer selectedCar={selectedCar} customizations={customizations} />
          </div>
        ) : (
          <ThreeErrorBoundary
            fallback={
              <div className="w-full h-full flex items-center justify-center p-8">
                <FallbackViewer selectedCar={selectedCar} customizations={customizations} />
              </div>
            }
          >
            <Canvas
              dpr={[1, 2]}
              gl={{
                antialias: true,
                alpha: true,
              }}
              camera={{ position: [4.5, 0.5, 4.5], fov: 40 }}
              style={{ background: '#0a0c10' }}
            >
              {/* Scene background */}
              <color attach="background" args={['#0a0c10']} />

              {/* Lighting setup for automotive studio */}
              <ambientLight intensity={0.45} />
              <directionalLight
                position={[5, 8, 5]}
                intensity={1.3}
                castShadow
                shadow-mapSize={[2048, 2048]}
              />
              <directionalLight position={[-5, 4, -4]} intensity={0.55} />
              <pointLight position={[0, 6, 0]} intensity={0.65} color="#ffffff" />
              {/* Rim lights for automotive studio depth */}
              <pointLight position={[-4, 2, -4]} intensity={0.4} color="#6699ff" />
              <pointLight position={[4, 1, -3]} intensity={0.3} color="#ffaa44" />

              <Suspense fallback={<ModelLoadingState />}>
                {/* HDRI environment for reflections */}
                <Environment preset="city" />

                <CarModel3D
                  selectedCar={selectedCar}
                  paintColor={customizations?.paint?.hex}
                  wheelOption={customizations?.wheels}
                  spoilerOption={customizations?.spoiler}
                  bodyKitOption={customizations?.bodyKit}
                  frontSplitterOption={customizations?.frontSplitter}
                  sideSkirtsOption={customizations?.sideSkirts}
                  rearDiffuserOption={customizations?.rearDiffuser}
                  hoodOption={customizations?.hood}
                  caliperOption={customizations?.caliper}
                  liveryOption={customizations?.livery}
                  suspensionOption={customizations?.suspension}
                  exhaustOption={customizations?.exhaust}
                  mirrorCapsOption={customizations?.mirrorCaps}
                  wingAngleOption={customizations?.wingAngle}
                  autoRotate={autoRotate}
                />

                {/* Contact shadow on the floor */}
                <ContactShadows
                  position={[0, -0.45, 0]}
                  opacity={0.75}
                  scale={12}
                  blur={2}
                  far={2}
                  color="#000000"
                />
              </Suspense>

              <OrbitControls
                ref={controlsRef}
                enablePan={false}
                enableDamping
                dampingFactor={0.08}
                minDistance={2.5}
                maxDistance={10}
                maxPolarAngle={Math.PI / 2.1}
                minPolarAngle={0.05}
                autoRotate={autoRotate}
                autoRotateSpeed={1.5}
                target={[0, 0, 0]}
              />
            </Canvas>
          </ThreeErrorBoundary>
        )}
      </div>

      {/* Studio floor reflection line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default CustomizerViewer;
