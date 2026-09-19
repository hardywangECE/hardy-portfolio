import * as THREE from "three";
import { OrbitControls } from "../vendor/three/OrbitControls.js";

// occt-import-js is loaded as a classic global script (vendor/occt/occt-import-js.js)
// so its WASM asset resolves relative to that file regardless of page URL depth.
let occtEnginePromise = null;
function getOcctEngine() {
  if (!occtEnginePromise) {
    occtEnginePromise = window.occtimportjs({
      locateFile: (path) => `vendor/occt/${path}`,
    });
  }
  return occtEnginePromise;
}

const stepFileCache = new Map(); // url -> parsed occt result promise

function loadStepGeometry(url) {
  if (!stepFileCache.has(url)) {
    const promise = (async () => {
      const [occt, buffer] = await Promise.all([
        getOcctEngine(),
        fetch(url).then((r) => {
          if (!r.ok) throw new Error(`Failed to fetch ${url}: ${r.status}`);
          return r.arrayBuffer();
        }),
      ]);
      const result = occt.ReadStepFile(new Uint8Array(buffer), {
        linearUnit: "millimeter",
        linearDeflectionType: "bounding_box_ratio",
        linearDeflection: 0.0015,
        angularDeflection: 0.3,
      });
      if (!result.success) throw new Error(`occt-import-js failed to parse ${url}`);
      return result;
    })();
    stepFileCache.set(url, promise);
  }
  return stepFileCache.get(url);
}

const DEFAULT_COLOR = new THREE.Color(0x2ad6c9);

function buildModelGroup(result) {
  const group = new THREE.Group();
  for (const mesh of result.meshes) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(mesh.attributes.position.array, 3)
    );
    if (mesh.attributes.normal) {
      geometry.setAttribute(
        "normal",
        new THREE.Float32BufferAttribute(mesh.attributes.normal.array, 3)
      );
    } else {
      geometry.computeVertexNormals();
    }
    geometry.setIndex(mesh.index.array);
    if (!mesh.attributes.normal) geometry.computeVertexNormals();

    const color = mesh.color
      ? new THREE.Color(mesh.color[0], mesh.color[1], mesh.color[2])
      : DEFAULT_COLOR;

    const material = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.35,
      roughness: 0.55,
      flatShading: false,
    });

    const threeMesh = new THREE.Mesh(geometry, material);
    threeMesh.castShadow = false;
    threeMesh.receiveShadow = false;
    group.add(threeMesh);
  }
  return group;
}

function frameObject(object, camera, controls, offset = 1.6) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  object.position.sub(center); // re-center model at origin

  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const fitDist = (maxDim / 2 / Math.tan((Math.PI * camera.fov) / 360)) * offset;

  const dir = new THREE.Vector3(1, 0.85, 1).normalize();
  camera.position.copy(dir.multiplyScalar(fitDist));
  camera.near = fitDist / 100;
  camera.far = fitDist * 100;
  camera.updateProjectionMatrix();

  controls.target.set(0, 0, 0);
  controls.minDistance = fitDist / 20;
  controls.maxDistance = fitDist * 8;
  controls.update();

  return { size, fitDist };
}

// Grid sized relative to the model so it reads as a "build plate" under any board.
function makeGrid(fitDist) {
  const gridSize = Math.max(fitDist * 1.6, 10);
  const grid = new THREE.GridHelper(gridSize, 24, 0x1c6b6a, 0x123033);
  grid.material.transparent = true;
  grid.material.opacity = 0.55;
  return grid;
}

export class StepViewer {
  constructor(container, { modelUrl, onStatus } = {}) {
    this.container = container;
    this.modelUrl = modelUrl;
    this.onStatus = onStatus || (() => {});
    this.autoRotate = false;
    this._raf = null;
    this._visible = false;
    this._disposed = false;
    this._modelGroup = null;

    this._initScene();
    this._bindEvents();
    this._observeVisibility();
  }

  _initScene() {
    const { clientWidth: w, clientHeight: h } = this.container;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(42, w / h || 1, 0.1, 1000);
    this.camera.position.set(80, 70, 80);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.rotateSpeed = 0.75;
    this.controls.screenSpacePanning = true;

    const hemi = new THREE.HemisphereLight(0x8fd8ff, 0x090c10, 0.9);
    this.scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 1.35);
    key.position.set(6, 10, 8);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x2ad6c9, 0.6);
    rim.position.set(-8, -4, -6);
    this.scene.add(rim);

    this._animate = this._animate.bind(this);
  }

  _bindEvents() {
    this._resizeObserver = new ResizeObserver(() => this._onResize());
    this._resizeObserver.observe(this.container);
  }

  _observeVisibility() {
    this._intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this._visible = entry.isIntersecting;
          if (this._visible) this._startLoop();
          else this._stopLoop();
        }
      },
      { threshold: 0.05 }
    );
    this._intersectionObserver.observe(this.container);
  }

  _onResize() {
    const { clientWidth: w, clientHeight: h } = this.container;
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  async load() {
    this.onStatus("loading", "COMPILING GEOMETRY…");
    try {
      const result = await loadStepGeometry(this.modelUrl);
      if (this._disposed) return;

      this._modelGroup = buildModelGroup(result);
      this.scene.add(this._modelGroup);

      const { fitDist } = frameObject(this._modelGroup, this.camera, this.controls);
      const grid = makeGrid(fitDist);
      grid.position.y = new THREE.Box3().setFromObject(this._modelGroup).min.y;
      this.scene.add(grid);
      this._grid = grid;

      this.onStatus("ready", `${result.meshes.length} SOLIDS LOADED`);
      this._startLoop();
    } catch (err) {
      console.error(err);
      this.onStatus("error", "FAILED TO PARSE MODEL");
    }
  }

  resetView() {
    if (this._modelGroup) frameObject(this._modelGroup, this.camera, this.controls);
  }

  toggleWireframe(force) {
    if (!this._modelGroup) return false;
    let next = force;
    this._modelGroup.traverse((child) => {
      if (child.isMesh) {
        if (next === undefined) next = !child.material.wireframe;
        child.material.wireframe = next;
      }
    });
    return next;
  }

  toggleAutoRotate(force) {
    this.autoRotate = force !== undefined ? force : !this.autoRotate;
    this.controls.autoRotate = this.autoRotate;
    this.controls.autoRotateSpeed = 2.2;
    return this.autoRotate;
  }

  _startLoop() {
    if (this._raf !== null || this._disposed) return;
    this._raf = requestAnimationFrame(this._animate);
  }

  _stopLoop() {
    if (this._raf !== null) {
      cancelAnimationFrame(this._raf);
      this._raf = null;
    }
  }

  _animate() {
    if (this._disposed) return;
    this._raf = requestAnimationFrame(this._animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this._disposed = true;
    this._stopLoop();
    this._resizeObserver?.disconnect();
    this._intersectionObserver?.disconnect();
    this.controls.dispose();
    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
