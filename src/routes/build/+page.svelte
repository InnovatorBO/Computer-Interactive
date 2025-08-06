<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

  let container;
  let scene, camera, renderer, loader;
  let orbitControls, dragControls;
  let enableOrbit = true;

  let objects = [];
  let modelStates = {}; // { uniqueName: { fileName, position, rotation } }
  let modelCounter = 0;

  let prices = {
    "trrtx2080.glb": 950,
    "amdrx6700.glb": 500,
    "ryzencpu.glb": 530,
    "ryzen5cpu.glb": 85,
    "micronddr1ramstickglb.glb": 80,
    "corsairvengeancelpxramstick.glb": 70,
    "motherboardASUS.glb": 200,
  };

  const snapZones = {
    "motherboardASUS.glb": { x: -1.3653, y: 0.0993, z: -2.2767 },
    "ryzencpu.glb": { x: -1.457, y: 1.068, z: -2.796 },
    "ryzen5cpu.glb": { x: -1.457, y: 1.068, z: -2.796 },
    "trrtx2080.glb": { x: -0.557, y: -1.293, z: -1.713 },
    "amdrx6700.glb": { x: 0.253, y: -1.314, z: -0.905 },
    "micronddr1ramstickglb.glb": { x: -1.331, y: 0.158, z: -2.324 },
    "corsairvengeancelpxramstick.glb": { x: -1.065, y: 0.043, z: -2.278 }
  };

  const threshold = 0.5;
  let currentPrice = 0;

  onMount(() => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x79818c);
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    composer.addPass(outlinePass);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    loader = new GLTFLoader();

    loader.load('pccase.glb', (gltf) => {
      scene.add(gltf.scene);
    });

    orbitControls = new OrbitControls(camera, renderer.domElement);
    dragControls = new DragControls(objects, camera, renderer.domElement);
    dragControls.transformGroup = true;

    dragControls.addEventListener('dragstart', (event) => {
      let obj = event.object;
      while (obj.parent && !objects.includes(obj)) obj = obj.parent;
      event.object = obj;
      outlinePass.selectedObjects = [event.object];
      orbitControls.enabled = false;
    });

    dragControls.addEventListener('dragend', (event) => {
      let obj = event.object;
      while (obj.parent && !objects.includes(obj)) obj = obj.parent;
      const key = obj.name.replace('_group', '');
      if (modelStates[key]) {
        modelStates[key].position = { x: obj.position.x, y: obj.position.y, z: obj.position.z };
        modelStates[key].rotation = { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z };
        localStorage.setItem('sceneState', JSON.stringify(modelStates));
      }
      requestAnimationFrame(() => {
        const file = modelStates[key]?.fileName;
        const snapTarget = snapZones[file];
        if (snapTarget) {
          const dx = obj.position.x - snapTarget.x;
          const dy = obj.position.y - snapTarget.y;
          const dz = obj.position.z - snapTarget.z;
          if (Math.sqrt(dx * dx + dy * dy + dz * dz) < threshold) {
            obj.position.set(snapTarget.x, snapTarget.y, snapTarget.z);
            modelStates[key].position = { ...snapTarget };
            localStorage.setItem('sceneState', JSON.stringify(modelStates));
          }
        }
        outlinePass.selectedObjects = [];
        if (enableOrbit) orbitControls.enabled = true;
      });
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const toRemove = [...outlinePass.selectedObjects];
        toRemove.forEach(object => {
          let parent = object;
          while (parent.parent && parent.parent !== scene) parent = parent.parent;
          if (parent.parent === scene) {
            scene.remove(parent);
            objects = objects.filter(n => n !== parent);
            const modelName = parent.name.replace('_group', '');
            const modelState = modelStates[modelName];
            if (modelState) {
              currentPrice -= prices[modelState.fileName] || 0;
              delete modelStates[modelName];
              localStorage.setItem('sceneState', JSON.stringify(modelStates));
            }
          }
        });
        dragControls.objects = objects;
        outlinePass.selectedObjects = [];
        if (enableOrbit) orbitControls.enabled = true;
      }
    });

    function animate() {
      requestAnimationFrame(animate);
      if (enableOrbit) orbitControls.update();
      composer.render();
    }
    animate();

    window.addEventListener('resize', onWindowResize);
    const savedCounter = localStorage.getItem('modelCounter');
    if (savedCounter) modelCounter = parseInt(savedCounter);
    const saved = localStorage.getItem('sceneState');
    if (saved) {
      modelStates = JSON.parse(saved);
      Object.entries(modelStates).forEach(([uniqueName, { fileName }]) => {
        addModel(fileName, uniqueName);
      });
    }
  });

  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function addModel(fileName, uniqueName = null) {
    const newGroup = new THREE.Group();
    const name = uniqueName ?? (fileName.replace(/\.[^/.]+$/, "") + "_" + modelCounter++);
    if (!uniqueName) {
      localStorage.setItem('modelCounter', modelCounter);
    }
    if (fileName in prices) { currentPrice += prices[fileName];} 
    loader.load(fileName, (gltf) => {
      const newModel = gltf.scene;
      newGroup.name = name + '_group';
      newModel.name = name;
      newGroup.add(newModel);
      const saved = modelStates[name];
      if (saved) {
        newGroup.position.set(saved.position.x, saved.position.y, saved.position.z);
        newGroup.rotation.set(saved.rotation.x, saved.rotation.y, saved.rotation.z);
      }
      scene.add(newGroup);
      objects.push(newGroup);
      dragControls.objects = objects;
      if (!modelStates[name]) {
        modelStates[name] = {
          fileName,
          position: {
            x: newGroup.position.x,
            y: newGroup.position.y,
            z: newGroup.position.z
          },
          rotation: {
            x: newGroup.rotation.x,
            y: newGroup.rotation.y,
            z: newGroup.rotation.z
          }
        };
        localStorage.setItem('sceneState', JSON.stringify(modelStates));
      }
    });
  }
</script>

<style>
  .sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 180px;
  height: 100vh;
  background-color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
  z-index: 100;
  overflow-y: auto;
  scrollbar-width: thin;
}
  
.sidebar button {
  width: 140px;               /* adjust width inside sidebar */
  padding: 0.5rem 1rem;
  margin: 0.5rem 0;
  background-color: #34495e; /* slightly lighter */
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  }

  .sidebar-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  }

  .sidebar-label {
  color: #bdc3c7;
  font-size: 0.9rem;
  margin: 1rem 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  }

  .sidebar-title {
  color: #ecf0f1;      /* light color for contrast */
  margin-bottom: 1rem;
  font-size: 1.4rem;
  font-weight: bold;
  }
</style>

<div bind:this={container} style="width: 100%; height: 500px;"></div>
<div class="sidebar">
  <h2 class="sidebar-title">Items for PC</h2>
  <div class='sidebar-section'>
    <p class='sidebar-label'>Current Price: {currentPrice}</p>
  </div>
  <div class='sidebar-section'>
    <p class='sidebar-label'>CPUs</p>
    <button on:click={() => addModel("ryzencpu.glb")}>AMD Ryzen 9 9950X3D - $530</button>
    <button on:click={() => addModel("ryzen5cpu.glb")}>AMD Ryzen 5 3600X - $85</button>
  </div>
  <div class='sidebar-section'>
    <p class='sidebar-label'>RAM</p>
    <button on:click={() => addModel("micronddr1ramstickglb.glb")}>Micron DDR4 - $80</button>
    <button on:click={() => addModel("corsairvengeancelpxramstick.glb")}>Corsair Vengeance LPX - $70</button>
  </div>
  <div class='sidebar-section'>
    <p class='sidebar-label'>GPUs</p>
    <button on:click={() => addModel("trrtx2080.glb")}>RTX 2080ti - $950</button>
    <button on:click={() => addModel("amdrx6700.glb")}>RX 6700 XT - $500</button>
  </div>
  <div class='sidebar-section'>
    <p class='sidebar-label'>Motherboards</p>
    <button on:click={() => addModel("motherboardASUS.glb")}>ASUS x570 - $200</button>
  </div>
</div>