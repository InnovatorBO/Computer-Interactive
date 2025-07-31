<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

  let container;
  let scene, camera, renderer, loader;
  let orbitControls, dragControls;
  let enableOrbit = true; // default mode

  let objects = []; // the objects you want to drag

  onMount(() => {
    // scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x384454);
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const processorGroup = new THREE.Group()

    loader = new GLTFLoader();

    let model;
    // add sample objects to drag
    loader.load('cube.glb', (gltf) => {
      model = gltf.scene;
      scene.add(model);
      objects.push(model);
    });

    let model2;
    loader.load('Microprocessor.glb', (gltf) => {
      model2 = gltf.scene;
      model2.traverse((child) => {
        if (child.isMesh) {
          processorGroup.add(child.clone());
        }
      });
      scene.add(processorGroup)
      objects.push(processorGroup)
    });

    // controls
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enabled = enableOrbit;

    dragControls = new DragControls(objects, camera, renderer.domElement);
    dragControls.enabled = !enableOrbit;

    dragControls.addEventListener('dragstart', () => {
      orbitControls.enabled = false;
    });
    dragControls.addEventListener('dragend', () => {
      if (enableOrbit) orbitControls.enabled = true;
    });

    // animate loop
    function animate() {
      requestAnimationFrame(animate);
      if (enableOrbit) orbitControls.update();
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', onWindowResize);
    dragControls.addEventListener('dragend', (event) => {
      const obj = event.object;
      objects.forEach(other => {
      if (other !== obj) {
        const dist = obj.position.distanceTo(other.position);
        if (dist < 0.5) { // snap threshold
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

  function toggleControls() {
    enableOrbit = !enableOrbit;
    orbitControls.enabled = enableOrbit;
    dragControls.enabled = !enableOrbit;
  }
</script>

<div bind:this={container} style="width: 100%; height: 500px;"></div>
<button on:click={toggleControls}>
  {enableOrbit ? 'Switch to Drag Mode' : 'Switch to Orbit Mode'}
</button>