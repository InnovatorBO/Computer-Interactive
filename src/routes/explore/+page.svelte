<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

  let container;  // Reference to the div containing the canvas
  let showInfo = false;
  let infoText = '';
  let infoLeft = 0;
  let infoTop = 0;

  onMount(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    // Load model
    const loader = new GLTFLoader();
    let model;

    const clickableObjects = []; // Store objects that can be clicked

    loader.load('model.glb', (gltf) => {
      model = gltf.scene;
      scene.add(model);

      // Add child meshes to clickableObjects
      model.traverse((child) => {
        if (child.isMesh) {
          clickableObjects.push(child);
        }
      });
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onClick(event) {
      // Convert mouse coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableObjects, true);

      if (intersects.length > 0) {
        const clicked = intersects[0].object;
        infoText = clicked.name || 'Clicked object';
        infoLeft = event.clientX;
        infoTop = event.clientY;
        showInfo = true;
      } else {
        showInfo = false;
      }
    }

    renderer.domElement.addEventListener('click', onClick);

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Resize handling
    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    return () => {
      renderer.dispose();
      renderer.domElement.removeEventListener('click', onClick);
    };
  });

  function closeInfo() {
    showInfo = false;
  }
</script>

<style>
  .info-box {
    position: absolute;
    background: white;
    padding: 0.5em 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
    z-index: 10;
  }
</style>

<div bind:this={container} style="width:100%; height:500px; position:relative;">
  {#if showInfo}
    <div class="info-box" style="left: {infoLeft}px; top: {infoTop}px;">
      {infoText}
      <button on:click={closeInfo}>×</button>
    </div>
  {/if}
</div>