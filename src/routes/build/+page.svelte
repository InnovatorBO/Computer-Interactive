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
  let modelCounter = 0; // for unique naming

  onMount(() => {
    // Setup
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

    const outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      scene,
      camera
    );
    composer.addPass(outlinePass);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    loader = new GLTFLoader();
    // Load pc case - NOT draggable, just add it
    loader.load('pccase.glb', (gltf) => {
      const caseModel = gltf.scene;
      scene.add(caseModel);
    });

    orbitControls = new OrbitControls(camera, renderer.domElement);
    dragControls = new DragControls(objects, camera, renderer.domElement);
    dragControls.transformGroup = true;

    dragControls.addEventListener('dragstart', (event) => {
      let obj = event.object;
      while (obj.parent && !objects.includes(obj)) {
        obj = obj.parent;
      }
      event.object = obj;
      outlinePass.selectedObjects = [event.object];
      orbitControls.enabled = false;
    });

    dragControls.addEventListener('dragend', (event) => {
      let obj = event.object;
      while (obj.parent && !objects.includes(obj)) {
        obj = obj.parent;
      }
      const key = obj.name.replace('_group', ''); // unique model key

      if (key && modelStates[key]) {
        modelStates[key].position = {
          x: obj.position.x,
          y: obj.position.y,
          z: obj.position.z
        };
        modelStates[key].rotation = {
          x: obj.rotation.x,
          y: obj.rotation.y,
          z: obj.rotation.z
        };
        localStorage.setItem('sceneState', JSON.stringify(modelStates));
      }

      // Collision snap (unchanged)
      objects.forEach(other => {
        if (other !== obj) {
          const dist = obj.position.distanceTo(other.position);
          if (dist < 0.5) {
            obj.position.copy(other.position);
          }
        }
      });

      outlinePass.selectedObjects = [];
      if (enableOrbit) orbitControls.enabled = true;
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const toRemove = [...outlinePass.selectedObjects];
        toRemove.forEach(object => {
          let parent = object;
          while (parent.parent && parent.parent !== scene) {
            parent = parent.parent;
          }
          if (parent.parent === scene) {
            scene.remove(parent);
            objects = objects.filter(n => n !== parent);
            delete modelStates[parent.name.replace('_group', '')];
          }
        });
        dragControls.objects = objects;
        outlinePass.selectedObjects = [];
        localStorage.setItem('sceneState', JSON.stringify(modelStates));
      }
    });

    function animate() {
      requestAnimationFrame(animate);
      if (enableOrbit) orbitControls.update();
      composer.render();
    }
    animate();

    window.addEventListener('resize', onWindowResize);

    // Load saved models from localStorage
    const saved = localStorage.getItem('sceneState');
    if (saved) {
      modelStates = JSON.parse(saved);
      Object.values(modelStates).forEach(({ fileName }) => addModel(fileName));
    }
  });

  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function addModel(fileName) {
    const newGroup = new THREE.Group();
    loader.load(fileName, (gltf) => {
      const newModel = gltf.scene;
      // Assign unique name
      const uniqueName = fileName.replace(/\.[^/.]+$/, "") + "_" + modelCounter++;
      newGroup.name = uniqueName + '_group';
      newModel.name = uniqueName;
      newGroup.add(newModel);

      // If saved state exists, set position/rotation
      const saved = modelStates[uniqueName];
      if (saved) {
        newGroup.position.set(saved.position.x, saved.position.y, saved.position.z);
        newGroup.rotation.set(saved.rotation.x, saved.rotation.y, saved.rotation.z);
      }

      scene.add(newGroup);
      objects.push(newGroup);
      dragControls.objects = objects;

      // Save initial state if not present
      if (!modelStates[uniqueName]) {
        modelStates[uniqueName] = {
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
    <p class='sidebar-label'>CPUs</p>
    <button on:click={() => addModel("ryzencpu.glb")}>AMD Ryzen 9 9950X3D</button>
    <button on:click={() => addModel("ryzen5cpu.glb")}>AMD Ryzen 5 3600X</button>
  </div>
  <div class='sidebar-section'>
    <p class='sidebar-label'>RAM</p>
    <button on:click={() => addModel("micronddr1ramstickglb.glb")}>Micron DDR4</button>
    <button on:click={() => addModel("corsairvengeancelpxramstick.glb")}>Corsair Vengeance LPX</button>
  </div>
  <div class='sidebar-section'>
    <p class='sidebar-label'>GPUs</p>
    <button on:click={() => addModel("trrtx2080.glb")}>RTX 2080ti</button>
    <button on:click={() => addModel("amdrx6700.glb")}>RX 6700 XT</button>
  </div>
  <div class='sidebar-section'>
    <p class='sidebar-label'>Motherboards</p>
    <button on:click={() => addModel("motherboardASUS.glb")}>ASUS x570</button>
  </div>
</div>