import * as THREE from "three";
import { RoomEnvironment } from "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/geometries/RoundedBoxGeometry.js";

const canvas = document.getElementById("stage");
if (canvas) {
  const mode = canvas.dataset.mode || "hero";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const darkQuery = matchMedia("(prefers-color-scheme: dark)");

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mode === "ornament" ? 1.5 : 1.75));

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
  camera.position.set(0.15, 0.2, mode === "ornament" ? 6.6 : 7.6);

  const shell = new THREE.MeshPhysicalMaterial({ color: 0xf4f7fb, metalness: 0.06, roughness: 0.28, clearcoat: 0.75, clearcoatRoughness: 0.18 });
  const trim = new THREE.MeshPhysicalMaterial({ color: 0xd5dee8, metalness: 0.2, roughness: 0.35, clearcoat: 0.4 });
  const screen = new THREE.MeshPhysicalMaterial({ color: 0x071433, metalness: 0.45, roughness: 0.18, emissive: 0x018f75, emissiveIntensity: 0.18 });
  const accent = new THREE.MeshPhysicalMaterial({ color: 0x018f75, metalness: 0.15, roughness: 0.28, emissive: 0x018f75, emissiveIntensity: 0.35 });
  const hoseMat = new THREE.MeshPhysicalMaterial({ color: 0xe7eef5, metalness: 0.04, roughness: 0.32, clearcoat: 0.35 });
  const led = new THREE.MeshBasicMaterial({ color: 0x2ed3b0 });

  function applyTheme() {
    const chosen = document.documentElement.dataset.theme;
    const dark = chosen ? chosen === "dark" : darkQuery.matches;
    shell.color.set(dark ? 0xf7fbff : 0xe7eef6);
    trim.color.set(dark ? 0xc5d0e0 : 0xb7c6d6);
    screen.emissive.set(dark ? 0x2ed3b0 : 0x018f75);
    screen.emissiveIntensity = dark ? 0.28 : 0.16;
    accent.emissiveIntensity = dark ? 0.5 : 0.3;
    led.color.set(dark ? 0x8dfff0 : 0x018f75);
    renderer.toneMappingExposure = dark ? 1.18 : 1.02;
  }
  applyTheme();
  darkQuery.addEventListener("change", applyTheme);
  document.addEventListener("themechange", applyTheme);

  const root = new THREE.Group();
  root.position.set(mode === "hero" ? -0.15 : 0, mode === "hero" ? 0.42 : 0.1, 0);
  root.scale.setScalar(mode === "hero" ? 1.05 : 0.78);
  scene.add(root);

  const device = new THREE.Group();
  device.rotation.y = -0.35;
  root.add(device);

  const body = new THREE.Mesh(new RoundedBoxGeometry(1.7, 1.15, 1.12, 4, 0.14), shell);
  device.add(body);

  const foot = new THREE.Mesh(new RoundedBoxGeometry(1.35, 0.08, 0.9, 2, 0.04), trim);
  foot.position.y = -0.6;
  device.add(foot);

  const bezel = new THREE.Mesh(new RoundedBoxGeometry(1.05, 0.52, 0.04, 2, 0.04), trim);
  bezel.position.set(0, 0.12, 0.56);
  device.add(bezel);
  const display = new THREE.Mesh(new RoundedBoxGeometry(0.92, 0.4, 0.02, 2, 0.03), screen);
  display.position.set(0, 0.12, 0.585);
  device.add(display);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.025, 0.01), accent);
  bar.position.set(-0.08, 0.2, 0.6);
  device.add(bar);

  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.05, 24), accent);
  dial.rotation.x = Math.PI / 2;
  dial.position.set(0.58, -0.28, 0.56);
  device.add(dial);
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), led);
  lamp.position.set(-0.62, 0.42, 0.5);
  device.add(lamp);

  const port = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.16, 20), trim);
  port.rotation.z = Math.PI / 2;
  port.position.set(0.9, 0.05, 0.18);
  device.add(port);

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.98, 0.05, 0.18),
    new THREE.Vector3(1.2, 0.22, 0.42),
    new THREE.Vector3(1.05, -0.15, 0.72),
    new THREE.Vector3(0.55, -0.55, 0.85)
  ]);
  device.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.055, 10, false), hoseMat));
  const rib = new THREE.TorusGeometry(0.07, 0.016, 8, 14);
  const up = new THREE.Vector3(0, 0, 1);
  for (let i = 0; i < 22; i++) {
    const t = i / 21;
    const ring = new THREE.Mesh(rib, hoseMat);
    ring.position.copy(curve.getPoint(t));
    ring.quaternion.setFromUnitVectors(up, curve.getTangent(t).normalize());
    device.add(ring);
  }

  const mask = new THREE.Group();
  mask.position.copy(curve.getPoint(1));
  const elbow = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.22, 16), trim);
  elbow.rotation.x = 0.6;
  mask.add(elbow);
  const cushion = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.045, 12, 28), shell);
  cushion.position.set(0, -0.22, 0.08);
  cushion.rotation.x = 1.1;
  mask.add(cushion);
  const seal = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.02, 10, 24), accent);
  seal.position.copy(cushion.position);
  seal.rotation.copy(cushion.rotation);
  mask.add(seal);
  device.add(mask);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.PointLight(0x2ed3b0, 14, 12);
  rim.position.set(-2.4, 1.4, 2);
  scene.add(rim);
  const fill = new THREE.PointLight(0x3d6dff, 8, 12);
  fill.position.set(2.2, -0.6, 2.4);
  scene.add(fill);

  let mx = 0;
  let my = 0;
  window.addEventListener("pointermove", (e) => {
    mx = e.clientX / window.innerWidth - 0.5;
    my = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  function resize() {
    const w = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
    const h = canvas.clientHeight || 500;
    if (canvas.width !== Math.floor(w * renderer.getPixelRatio()) || canvas.height !== Math.floor(h * renderer.getPixelRatio())) {
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    }
  }

  const clock = new THREE.Clock();
  function frame() {
    const t = clock.getElapsedTime();
    if (!reduce) {
      device.position.y = Math.sin(t * 0.9) * 0.07;
      device.rotation.y = -0.35 + Math.sin(t * 0.32) * 0.12;
      lamp.scale.setScalar(1 + Math.sin(t * 3) * 0.18);
      root.rotation.y += (mx * 0.4 - root.rotation.y) * 0.045;
      root.rotation.x += (-my * 0.18 - root.rotation.x) * 0.045;
    }
    resize();
    renderer.render(scene, camera);
    if (!reduce && !document.hidden) requestAnimationFrame(frame);
  }
  resize();
  frame();
  if (reduce) renderer.render(scene, camera);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !reduce) requestAnimationFrame(frame);
  });
}
