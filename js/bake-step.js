import * as THREE from "three";
import { GLTFExporter } from "../vendor/three/GLTFExporter.js";
import { loadStepGeometry, buildModelGroup } from "./viewer.js";

const MODELS = [
  { name: "steering-wheel", src: "assets/models/steering-wheel.step" },
  { name: "enav", src: "assets/models/enav.step" },
  { name: "pcb1", src: "assets/models/pcb1.step" },
];

const logEl = document.getElementById("log");
function log(msg) {
  logEl.textContent += `\n${msg}`;
  logEl.scrollTop = logEl.scrollHeight;
}

async function bake(model) {
  log(`[${model.name}] parsing STEP…`);
  const t0 = performance.now();
  const result = await loadStepGeometry(model.src);
  log(`[${model.name}] parsed in ${(performance.now() - t0).toFixed(0)}ms — ${result.meshes.length} solids`);

  const group = buildModelGroup(result);
  const scene = new THREE.Scene();
  scene.add(group);

  const exporter = new GLTFExporter();
  const glb = await exporter.parseAsync(scene, { binary: true });
  const blob = new Blob([glb], { type: "model/gltf-binary" });
  log(`[${model.name}] exported .glb — ${(blob.size / 1024 / 1024).toFixed(2)} MB`);

  const res = await fetch(`/__save?name=${model.name}.glb`, { method: "POST", body: blob });
  if (!res.ok) throw new Error(`save failed: ${res.status} ${await res.text()}`);
  log(`[${model.name}] saved to assets/models/${model.name}.glb ✓`);
}

const buttonsEl = document.getElementById("buttons");

const allBtn = document.createElement("button");
allBtn.textContent = "Bake all";
allBtn.onclick = async () => {
  for (const model of MODELS) {
    await bake(model).catch((err) => log(`[${model.name}] ERROR: ${err}`));
  }
};
buttonsEl.appendChild(allBtn);

for (const model of MODELS) {
  const btn = document.createElement("button");
  btn.textContent = `Bake ${model.name}`;
  btn.onclick = () => bake(model).catch((err) => log(`[${model.name}] ERROR: ${err}`));
  buttonsEl.appendChild(btn);
}
