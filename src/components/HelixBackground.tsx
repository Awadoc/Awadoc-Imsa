"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type Palette = { bottom: string; mid: string; top: string; deep: string };

type Props = {
  className?: string;
  /** Recolor here. Defaults to the green palette. */
  palette?: Palette;
  /** Seconds between bursts. The first burst plays on load. */
  cycle?: number;
  /** Horizontal offset of the helix on desktop (world units). 0 = centered. */
  offsetX?: number;
  /** Called once, right after the first frame has been drawn. */
  onReady?: () => void;
};

export const GREEN: Palette = {
  bottom: "#14b8a6", // teal
  mid: "#059669", // emerald
  top: "#84cc16", // lime
  deep: "#064e3b", // forest (strand cores)
};

// World units. The camera sees ~8 units for one screen height; the helix runs on past the
// hero into the pricing section below it, so it needs to be a few screens long.
export const LENGTH = 28;
// Fewer particles per unit of length than the original, to keep the longer helix affordable.
const DENSITY = 0.7;
const VIEW_HEIGHT = 8.19; // world units visible over one hero height (fov 35 at distance 13)

export const vertexShader =/* glsl */ `
  uniform float uTime, uProgress, uPixelRatio, uDim;
  attribute float aT, aSize, aKind, aU, aPhase;
  attribute vec3 aRand, aColor;
  varying vec3 vColor; varying float vAlpha; varying float vBlur;
  void main() {
    vec3 p = position;
    float d = clamp(uProgress * 1.8 - (1.0 - aT) * 0.8 - aRand.x * 0.2, 0.0, 1.0);
    d = d * d * (3.0 - 2.0 * d);
    vec3 dir = normalize(aRand - 0.5 + 0.0001);
    vec3 flow = vec3(
      sin(p.y * 2.1 + uTime * 0.9 + aRand.y * 6.28),
      cos(p.x * 2.7 + uTime * 0.7 + aRand.z * 6.28) * 0.6,
      sin(p.z * 2.3 + uTime * 1.1 + aRand.x * 6.28));
    p += d * (dir * (0.5 + aRand.y * 1.8) + flow * 0.55);
    p.y += d * d * (aRand.z - 0.3) * 0.9;
    p += 0.012 * vec3(sin(uTime * 2.0 + aRand.x * 40.0), cos(uTime * 1.7 + aRand.y * 40.0), sin(uTime * 2.3 + aRand.z * 40.0));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    vBlur = 1.0 - smoothstep(0.5, 2.2, depth);
    float nearFade = smoothstep(0.12, 0.7, depth);
    gl_PointSize = min(aSize * (1.0 + d * aRand.z * 0.5) * (1.0 + vBlur * 0.9) * uPixelRatio * (16.0 / depth), 30.0 * uPixelRatio);
    vColor = aColor;
    // Splash particles only exist while bursting. Rung particles sit in
    // straight rows, so they fade fast instead of lingering as faint lines.
    float vis = aKind > 1.5 ? d : (aKind > 0.5 ? 1.0 - smoothstep(0.0, 0.35, d) : 1.0);
    vAlpha = vis * (0.85 - d * 0.3) * uDim * nearFade * (1.0 - vBlur * 0.7);
    // Linking rungs: two halves reach out from the strands toward the middle in yellow,
    // turn green once they meet, hold, then fade and start over.
    if (aPhase >= 0.0) {
      float c = fract(uTime / 5.0 + aPhase);
      float grow = smoothstep(0.0, 0.5, c);
      float reach = smoothstep(1.0 - grow - 0.04, 1.0 - grow + 0.04, abs(aU));
      float joined = smoothstep(0.5, 0.58, c);
      vColor = mix(vec3(0.961, 0.647, 0.141), vec3(0.13, 0.77, 0.37), joined);
      vAlpha = vis * reach * (1.0 - smoothstep(0.85, 1.0, c)) * 0.95 * nearFade * (1.0 - vBlur * 0.7);
      gl_PointSize *= 1.25;
    }
  }
`;

export const fragmentShader = /* glsl */ `
  varying vec3 vColor; varying float vAlpha; varying float vBlur;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    gl_FragColor = vec4(vColor, smoothstep(0.5, 0.35 - 0.25 * vBlur, r) * vAlpha);
  }
`;

export function buildGeometry(palette: Palette) {
  // Long enough to run past the top and bottom of any viewport. Pitch and
  // particle density stay the same as the original 9-unit helix.
  const k = LENGTH / 9;
  const H = LENGTH, R = 1.25, TURNS = 2.6 * k;
  const c = {
    bottom: new THREE.Color(palette.bottom),
    mid: new THREE.Color(palette.mid),
    top: new THREE.Color(palette.top),
    deep: new THREE.Color(palette.deep),
  };
  const pos: number[] = [], tArr: number[] = [], rnd: number[] = [];
  const size: number[] = [], col: number[] = [], kind: number[] = [];
  const uArr: number[] = [], phase: number[] = [];
  const tmp = new THREE.Color();
  const g = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

  const push = (x: number, y: number, z: number, t: number, s: number, k: number, depth: number, u = 0, ph = -1) => {
    pos.push(x, y, z);
    uArr.push(u);
    phase.push(ph);
    tArr.push(t);
    rnd.push(Math.random(), Math.random(), Math.random());
    size.push(s);
    kind.push(k);
    if (t < 0.5) tmp.copy(c.bottom).lerp(c.mid, t * 2);
    else tmp.copy(c.mid).lerp(c.top, (t - 0.5) * 2);
    tmp.lerp(c.deep, depth);
    col.push(tmp.r, tmp.g, tmp.b);
  };

  // two strands
  for (let s = 0; s < 2; s++) {
    for (let i = 0; i < Math.round(11000 * k * DENSITY); i++) {
      const t = Math.random();
      const a = t * TURNS * Math.PI * 2 + s * Math.PI;
      const r = R + g() * 0.06;
      push(Math.cos(a) * r, (t - 0.5) * H + g() * 0.05, Math.sin(a) * r, t, 1.4 + Math.random() * 1.4, 0, Math.random() * 0.5);
    }
  }
  // rungs
  const RUNGS = Math.round(34 * k);
  for (let j = 0; j < RUNGS; j++) {
    const t = (j + 0.5) / RUNGS;
    const a = t * TURNS * Math.PI * 2;
    const linking = j % 3 === 0; // every third rung is animated
    const ph = Math.random();
    for (let i = 0; i < 160; i++) {
      const u = Math.random() * 2 - 1;
      push(Math.cos(a) * R * u + g() * 0.03, (t - 0.5) * H + g() * 0.03, Math.sin(a) * R * u + g() * 0.03, t, 1.2 + Math.random(), 1, 0.2 + Math.random() * 0.3, u, linking ? ph : -1);
    }
  }
  // splash (only visible while dissolving)
  for (let i = 0; i < Math.round(7000 * k * DENSITY); i++) {
    const t = Math.random();
    const a = t * TURNS * Math.PI * 2 + (Math.random() < 0.5 ? 0 : Math.PI);
    const r = R + g() * 0.35;
    push(Math.cos(a) * r, (t - 0.5) * H + g() * 0.3, Math.sin(a) * r, t, 1.2 + Math.random() * 1.6, 2, Math.random() * 0.7);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("aT", new THREE.Float32BufferAttribute(tArr, 1));
  geo.setAttribute("aRand", new THREE.Float32BufferAttribute(rnd, 3));
  geo.setAttribute("aSize", new THREE.Float32BufferAttribute(size, 1));
  geo.setAttribute("aColor", new THREE.Float32BufferAttribute(col, 3));
  geo.setAttribute("aKind", new THREE.Float32BufferAttribute(kind, 1));
  geo.setAttribute("aU", new THREE.Float32BufferAttribute(uArr, 1));
  geo.setAttribute("aPhase", new THREE.Float32BufferAttribute(phase, 1));
  return geo;
}

export default function HelixBackground({
  className,
  palette = GREEN,
  cycle = 20,
  offsetX = 3.1,
  onReady,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Fresh canvas per mount: safe under React Strict Mode's double effect run
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
    wrap.appendChild(canvas);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 13);

    const geo = buildGeometry(palette);
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        // Phones dim the helix itself but not the linking rungs, so those stay visible.
        uDim: { value: 1 },
      },
    });

    const helix = new THREE.Points(geo, mat);
    const tilt = new THREE.Group();
    tilt.add(helix);
    const baseTilt = -0.62; // leans up and to the right
    tilt.rotation.x = 0.15;
    scene.add(tilt);

    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      mat.uniforms.uDim.value = w < 640 ? 0.5 : 1;
      // The canvas covers the hero plus the section below it. Everything is framed against
      // the hero's height, so the helix looks exactly as it did when the canvas was hero-sized
      // and simply carries on below it.
      const heroH = document.querySelector<HTMLElement>("[data-hero]")?.offsetHeight ?? h;
      const baseH = Math.min(Math.max(heroH, 1), h);
      const worldPerPx = VIEW_HEIGHT / baseH;
      camera.aspect = w / h;
      camera.fov = (2 * Math.atan((h * worldPerPx) / 2 / camera.position.z) * 180) / Math.PI;
      camera.updateProjectionMatrix();
      // Same placement at every screen size: x scales with the hero's aspect ratio, so the
      // helix stays at the same spot relative to the screen's right edge.
      // On big screens the headline runs wider, so push the helix further right.
      const bigScreenShift = Math.min(Math.max((w - 1280) / 640, 0), 1) * 2.6;
      tilt.position.x = (offsetX * (w / baseH)) / 1.6 + bigScreenShift;
      // Keep the helix centered on the hero, not on the (taller) canvas.
      tilt.position.y = ((h - baseH) / 2) * worldPerPx;
      tilt.scale.setScalar(1.15);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    tilt.rotation.z = baseTilt;

    let mx = 0, my = 0;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove);

    const ease = (x: number) => x * x * (3 - 2 * x);
    // Bursts as soon as the page loads, then again every `cycle` seconds.
    // Timeline (seconds): burst 0-1.5, drift 1.5-2.8, reform 2.8-6, formed until the next burst.
    // The burst eases out (fast start) and the clock is nudged forward so particles
    // are already flying on the very first frame.
    const easeOut = (x: number) => 1 - (1 - x) * (1 - x);
    const progressAt = (t: number) => {
      const s = (t + 0.3) % cycle;
      if (s < 1.5) return easeOut(s / 1.5);
      if (s < 2.8) return 1;
      if (s < 6) return 1 - ease((s - 2.8) / 3.2);
      return 0;
    };

    // pause rendering when the hero is scrolled out of view
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);

    const startedAt = performance.now();
    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = (performance.now() - startedAt) / 1000;
      mat.uniforms.uTime.value = t;
      // No more bursts: the helix stays formed and just turns. (progressAt is the old burst timeline, kept in case it is wanted back.)
      mat.uniforms.uProgress.value = 0;
      void progressAt;
      if (!reduceMotion) helix.rotation.y = t * 0.25;
      tilt.rotation.z += (baseTilt - tilt.rotation.z) * 0.1;
      tilt.rotation.y += (mx * 0.3 - tilt.rotation.y) * 0.05;
      tilt.rotation.x += (0.15 + my * 0.2 - tilt.rotation.x) * 0.05;
      renderer.render(scene, camera);
      if (readyRef.current) {
        readyRef.current();
        readyRef.current = undefined;
      }
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, [palette, cycle, offsetX]);

  // Inline styles so it fills its parent even without Tailwind
  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}
    />
  );
}
