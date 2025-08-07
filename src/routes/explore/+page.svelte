<script lang="ts">
  import { onMount } from 'svelte';
  import { on } from 'svelte/events';
  import * as THREE from 'three';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

  import ModelViewer from './modelviewer.svelte';
  import cpuUrl from "./models/cpu.glb?url";
  import gpuUrl from "./models/gpu.glb?url";
  import motherboardUrl from "./models/motherboard.glb?url";
  import ramUrl from "./models/ram.glb?url";
  import memoryUrl from "./models/memory.glb?url";

  import { writable } from 'svelte/store';

  let container;
  let selectedObject = null;
  let showInfo = false;
  let infoText = '';
  let infoLeft = 0;
  let infoTop = 0;

  const modelState = writable({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  });


  const models = [
    {
      url: cpuUrl,
      label: "CPU",
      description: "The Central Processing Unit (CPU) performs all the main calculations and instructions of the computer."
    },
    {
      url: gpuUrl,
      label: "GPU",
      description: "The Graphics Processing Unit (GPU) renders images and handles graphical computations, especially in gaming and design."
    },
    {
      url: motherboardUrl,
      label: "Motherboard",
      description: "The motherboard connects all the components together, allowing communication between the CPU, RAM, storage, and peripherals."
    },
    {
      url: ramUrl,
      label: "RAM",
      description: "Random-Access Memory (RAM) stores temporary data for fast access by the CPU while the system is running."
    },
    {
      url: memoryUrl,
      label: "Memory",
      description: "Memory (like SSDs or HDDs) stores long-term data including files, software, and the operating system."
    },
    {
      url: "",
      label: "Coming Soon",
      description: "More components will be added soon!"
    }
  ];

  function closeInfo() {
    showInfo = false;
    selectedObject = null;
  }

  onMount(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x384454);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0.08, 0.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
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

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.DirectionalLight(0xffffff, 1.5).position.set(5, 10, 7.5));
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    const loader = new GLTFLoader();
    const clickableObjects = [];

    loader.load('model.glb', (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      model.traverse((child) => {
        if (child.isMesh) clickableObjects.push(child);
      });

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxSize = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxSize / (2 * Math.tan(fov / 2))) * 0.8;

      camera.position.set(center.x, center.y, cameraZ);
      camera.lookAt(center);

      modelState.set({
        position: model.position,
        rotation: model.rotation
      });

      modelState.subscribe((state) => {
        model.position.set(state.position.x, state.position.y, state.position.z);
        model.rotation.set(state.rotation.x, state.rotation.y, state.rotation.z);
      });
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let down = false, startX = 0, startY = 0;

    const canvas = renderer.domElement;

    function onMouseMove(e) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      if (down) showInfo = false;
    }

    function onClick(e) {
      if (Math.abs(e.clientX - startX) >= 10 || Math.abs(e.clientY - startY) >= 10) return;

      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableObjects, true);

      if (intersects.length > 0) {
        infoText = `Clicked object: ${intersects[0].object.name}`;
        selectedObject = [intersects[0].object];
        infoLeft = e.clientX;
        infoTop = e.clientY;
        showInfo = true;
      } else {
        showInfo = false;
        selectedObject = null;
      }

      down = false;
    }

    on(canvas, "mousedown", (e) => {
      startX = e.clientX;
      startY = e.clientY;
      down = true;
    });

    on(canvas, "mousemove", onMouseMove);
    on(canvas, "mouseup", onClick);

    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      composer.setSize(container.clientWidth, container.clientHeight);
    });

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      outlinePass.selectedObjects = selectedObject ?? [];
      composer.render();
    }

    animate();
  });
</script>

<style>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem 2rem; /* row gap + column gap */
  justify-items: center;
}

.grid-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  background: #2c3e50;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 620px; /* consistent width */
  min-height: 160px; /* prevent tight squeezing */
}

.viewer {
  flex-shrink: 0;
  width: 300px;
  height: 300px;
  overflow: hidden;               /* ← hides any overflow from model */
  box-sizing: border-box;        /* ← ensures padding doesn’t expand box */
  display: flex;
  align-items: center;
  justify-content: center;
}
.details {
  margin-left: 1.5rem;
  color: white;
  width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.label {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 0.95rem;
  line-height: 1.4;
  word-break: break-word;
}

  .info-box {
    position: absolute;
    background: white;
    color: #111;
    padding: 40px;
    border-radius: 20px;
    max-width: 500px;
    width: 90%;
    border: 1px solid #ccc;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    animation: popupSlide 0.3s ease-out;
  }

  .info-box button {
  position: absolute;
  color: black;
  background: white;
  padding: 40px;
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  border: 1px solid #ccc;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  animation: popupSlide 0.3s ease-out;
  }

  .grid-section {
    padding: 2rem;
    background-color: #384454;
    color: white;
  }

  .grid-section h2 {
    text-align: center;
    margin-bottom: 1rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, auto);
    gap: 2rem;
    justify-items: center;
    align-items: center;
  }

  .viewer {
    background: #2c3e50;
    padding: 1rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }

  .label {
    margin-top: 0.5rem;
    font-weight: bold;
    color: white;
  }
</style>

<h2>Learn about the different parts of a computer by clicking on the model!</h2>
<div bind:this={container} style="width:100%; height:500px; position:relative;">
  {#if showInfo}
    <div class="info-box" style="left: {infoLeft}px; top: {infoTop}px;">
      {infoText}
      <button on:click={closeInfo}>X</button>
    </div>
  {/if}
</div>

<div class="grid-section">
  <h2>View 3D Models</h2>
  <div class="grid">
    {#each models as model}
      <div class="grid-item">
        <div class="viewer">
          {#if model.url}
            <ModelViewer modelUrl={model.url} width={300} height={300} />
          {/if}
        </div>
        <div class="details">
          <div class="label">{model.label}</div>
          <div class="description">{model.description}</div>
        </div>
      </div>
    {/each}
  </div>
</div>

