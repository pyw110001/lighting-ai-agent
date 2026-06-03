"use client";

import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  OrthographicCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";

const vertexShader = `
  attribute float aSize;
  attribute float aAlpha;
  varying float vAlpha;
  uniform float uPixelRatio;

  void main() {
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * uPixelRatio;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    float glow = smoothstep(0.5, 0.0, dist);
    float core = smoothstep(0.18, 0.0, dist);
    vec3 color = mix(uColor, vec3(1.0), core * 0.65);
    gl_FragColor = vec4(color, glow * vAlpha);
  }
`;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function gaussian(scale = 1) {
  return (Math.random() + Math.random() + Math.random() - 1.5) * scale;
}

export function ThreeBeamBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
      powerPreference: "high-performance",
    });
    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 2;

    const particleCount = window.innerWidth < 760 ? 1500 : 2800;
    const positions = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);

    for (let index = 0; index < particleCount; index += 1) {
      const isBeam = index < particleCount * 0.56;
      const isBaseGlow = !isBeam && index < particleCount * 0.84;
      const offset = index * 3;

      if (isBeam) {
        const y = randomBetween(-1.05, 1.08);
        const taper = 0.012 + Math.pow(Math.max(0.05, 1 - Math.abs(y + 0.1)), 2.2) * 0.035;
        positions[offset] = 0.36 + gaussian(taper);
        positions[offset + 1] = y;
        positions[offset + 2] = randomBetween(-0.2, 0.2);
        sizes[index] = randomBetween(2.8, 8.8);
        alphas[index] = randomBetween(0.28, 0.82);
        velocities[index] = randomBetween(0.00055, 0.00155);
      } else if (isBaseGlow) {
        positions[offset] = 0.36 + gaussian(0.36);
        positions[offset + 1] = -0.48 + gaussian(0.055);
        positions[offset + 2] = randomBetween(-0.3, 0.15);
        sizes[index] = randomBetween(3.5, 12);
        alphas[index] = randomBetween(0.16, 0.42);
        velocities[index] = randomBetween(0.00008, 0.00035);
      } else {
        positions[offset] = randomBetween(-1.1, 1.1);
        positions[offset + 1] = randomBetween(-0.9, 0.9);
        positions[offset + 2] = randomBetween(-0.5, 0.2);
        sizes[index] = randomBetween(1.2, 4.4);
        alphas[index] = randomBetween(0.06, 0.22);
        velocities[index] = randomBetween(0.00004, 0.0002);
      }

      basePositions[offset] = positions[offset];
      basePositions[offset + 1] = positions[offset + 1];
      basePositions[offset + 2] = positions[offset + 2];
      phases[index] = randomBetween(0, Math.PI * 2);
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
    geometry.setAttribute("aAlpha", new BufferAttribute(alphas, 1));

    const material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uColor: { value: new Color("#6470ff") },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader,
      fragmentShader,
    });

    const points = new Points(geometry, material);
    scene.add(points);

    let animationFrame = 0;
    let frame = 0;

    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    }

    function render() {
      frame += 1;

      if (!reducedMotion) {
        for (let index = 0; index < particleCount; index += 1) {
          const offset = index * 3;
          const isBeam = index < particleCount * 0.56;
          const drift = Math.sin(frame * 0.012 + phases[index]) * (isBeam ? 0.008 : 0.018);
          positions[offset] = basePositions[offset] + drift;
          positions[offset + 1] += velocities[index];

          if (positions[offset + 1] > 1.1) {
            positions[offset + 1] = isBeam ? -1.08 : -0.62 + gaussian(0.06);
          }

          alphas[index] = Math.max(
            0.04,
            alphas[index] + Math.sin(frame * 0.018 + phases[index]) * 0.0009,
          );
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.aAlpha.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    }

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
    />
  );
}
