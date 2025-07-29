<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'

  let container;  // Reference to the div containing the canvas
  let showInfo = false;
  let infoText = '';
  let infoLeft = 0;
  let infoTop = 0;
  let INTERSECTED = null
  onMount(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // OutlinePass: width, height, scene, camera
    const outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      scene,
      camera
    );
    composer.addPass(outlinePass);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 1);
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

    function onMouseMove(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    function onClick(event) {
      // Convert mouse coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableObjects, true);

      if (intersects.length > 0) {
        const clicked = intersects[0].object;
        outlinePass.selectedObjects = [clicked]
        infoText = clicked.name || 'Clicked object';
        infoLeft = event.clientX;
        infoTop = event.clientY;
        showInfo = true;
      } else {
        showInfo = false;
        outlinePass.selectedObjects = []
      }
    }

    window.addEventListener('mousemove', onMouseMove, false)
    renderer.domElement.addEventListener('click', onClick);

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      composer.render();
    }
    animate();

    // Resize handling
    window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
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