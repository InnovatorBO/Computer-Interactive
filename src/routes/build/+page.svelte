<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'

  let container;
  let scene, camera, renderer, loader;
  let orbitControls, dragControls;
  let enableOrbit = true; // default mode

  let objects = []; // the objects you want to drag

  onMount(() => {
    // scene setup
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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const processorGroup = new THREE.Group()

    loader = new GLTFLoader();

    let model;
    // add sample objects to drag
    loader.load('pccase.glb', (gltf) => {
      model = gltf.scene;
      scene.add(model);
      //objects.push(model);
    });

    // controls
    orbitControls = new OrbitControls(camera, renderer.domElement);

    dragControls = new DragControls(objects, camera, renderer.domElement);
    dragControls.addEventListener('dragstart', (event) => {
      let obj = event.object;
      while (obj.parent && !objects.includes(obj)) {
        obj = obj.parent;
      }
      event.object = obj; 
      outlinePass.selectedObjects = [event.object]
      orbitControls.enabled = false;
    });
    dragControls.addEventListener('dragend', () => {
      outlinePass.selectedObjects = []
      if (enableOrbit) orbitControls.enabled = true;
    });

    // animate loop
    function animate() {
      requestAnimationFrame(animate);
      if (enableOrbit) orbitControls.update();
      composer.render();
    }
    animate();

    window.addEventListener('resize', onWindowResize);
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
        }
      });
      dragControls.objects = objects;
      outlinePass.selectedObjects = [];
      }
    });
    dragControls.addEventListener('dragend', (event) => {
      const obj = event.object;
      objects.forEach(other => {
      if (other !== obj) {
        const dist = obj.position.distanceTo(other.position);
        if (dist < 0.5) {
          obj.position.copy(other.position);
          }
        }
      });
      });
  });

  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function addAMD() {
    let newModel;
    loader.load("cylinder.glb", (gltf) => {
      newModel = gltf.scene;
      scene.add(newModel);
      objects.push(newModel);
      dragControls.objects = objects;
    });
  }

  function addMicron() {
    let newModel;
    loader.load("updatedprocessor.glb", (gltf) => {
      newModel = gltf.scene;
      scene.add(newModel);
      objects.push(newModel);
      dragControls.objects = objects;
    });
  }

  function addRTX() {
    let newModel;
    loader.load("trrtx2080.glb", (gltf) => {
      newModel = gltf.scene;
      scene.add(newModel);
      objects.push(newModel);
      dragControls.objects = objects;
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
    <button on:click={() => addAMD()}>AMD Ryzen 9 9950X3D</button>
    <button>Intel Core i9-14900K</button>
  </div>
  <div class='sidebar-section'>
    <p class='sidebar-label'>RAM</p>
    <button on:click={() => addMicron()}>Micron DDR5</button>
    <button>Samsung SDIN5B2-32G</button>
  </div>
  <div class='sidebar-section'>
    <p class='sidebar-label'>GPUs</p>
    <button on:click={() => addRTX()}>RTX2080ti</button>
    <button>Arc B580</button>
  </div>
</div>