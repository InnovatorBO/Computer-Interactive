<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
    import { normalizeUrl } from '@sveltejs/kit';

  let container;  // Reference to the div containing the canvas
  let selectedObject = null;
  let showInfo = false;
  let infoText = '';
  let infoLeft = 0;
  let infoTop = 0;
  let INTERSECTED = null;
  let computerCase = ["AudioPort1", "AudioPort2", "BackPanel", "GPU_Bracket1", "pCube884", "pCube890", "pCube889", "pCube891", "pCube896", "pCube1200", "pCube1201", "pCube1202", "pCube1203", "pCube1218", "pCube1235", "pCube1236", "pCube1237", "pCylinder97", "pCylinder98", "pCylinder99", "pCylinder100", "pCylinder101", "PowerButton", "PSU_Bracket1", "PSU_Bracket2", "ResetButton", "nurbsToPoly2", "pCube1238"];
  let computerCaseHighlight = ["BackPanel", "GPU_Bracket1", "pCube884", "pCube890", "pCube889", "pCube891", "pCube896", "pCylinder97", "pCylinder98", "pCylinder99", "pCylinder100", "pCylinder101", "PSU_Bracket1", "PSU_Bracket2"];
  let computerCaseText = "Computer case - holds parts together and contains ports/buttons";
  let topFan = ["pCube961", 'pCube962', "pCube963", "pCube964", "pCube965", 'pCube966', "pCube967", "pCylinder145", "pCylinder164", "pCube970", "pCube971", "pCube972", 'pCylinder146']
  let topFanHighlight = ["pCube970", 'pCylinder146']
  let topFanText = "Top fan - part of radiator; cools down coolant"
  let middleFan = ["pCube961001", "pCube962001", "pCube963001", "pCube964001", "pCube965001", "pCube966001", "pCube967001", "pCylinder145001", "pCylinder164001", 'pCube970001', "pCube971001", "pCube972001", "pCylinder146001"]
  let middleFanHighlight = ["pCube970001", "pCylinder146001"]
  let middleFanText = "Middle fan - part of radiator; cools down coolant"
  let bottomFan = ["pCube961002", "pCube962002", "pCube963002", "pCube964002", "pCube965002", "pCube966002", "pCube967002", "pCylinder145002", "pCylinder164002", "pCube970002", "pCube971002", "pCube972002", "pCylinder146002"]
  let bottomFanHighlight = ["pCube970002", "pCylinder146002"]
  let bottomFanText = "Bottom fan  - part of radiator; cools down coolant"
  let cpu = ["pCube840", "pCube841", "pCube1222", "pCube1220", "pCube181", "pCube181", "pCube182", "pCube183", "pCube184", "pCube1219"]
  let cpuHighlight = ["pCube840", "pCube841", "pCube1222", "pCube1220"]
  let cpuText = "Central Processing Unit/Water Block - cpu does calculations very fast, water block draws heat into cooling system"
  let psu = ["pCube961003", "pCube962003", "pCube963003", "pCube964003", "pCube965003", "pCube966003", "pCube967003", "pCylinder145003", "pCube1252", "pCube1253", "pCube1254", "pCube1255", "pCube1256", "pCube1257", "pCube1258", "pCube1259", "pCube1260", "pCube1261", "pCube927", "pCube928", "pCube940", "pCube932", "pCube1242", "pCube1243", "pCube1251", "Mesh1069"]
  let psuHighlight = ["pCube927", "pCube928", "pCube940", "Mesh1069"]
  let psuText = "Power Supply Unit - converts between AC/DC and gives correct voltage rails for different components"
  let radiator = ["pCube1191", "pCube1192", "pCube1193", "pCube1194", "pCube1195", "pCube1196", "pCube1197", "pCube1198", "pCube1199", "pCylinder162", "pCylinder163"]
  let radiatorHighlight = ['pCube1191']
  let radiatorText = "Radiator - controls temperature and prevents heat damage"
  let ram = ["pCube902", 'pCube910', 'pCube911', "pCube912", "pCube913", "pCube914", "pCube915", "pCube916", "pCube917", "pCube918", "pCube919", "pCube920", "pCube902001", "pCube910001", "pCube911001", "pCube912001", "pCube913001", "pCube914001", "pCube915001", "pCube916001", "pCube917001", "pCube918001", "pCube919001", "pCube920001", "pCube902002", "pCube910002", "pCube911002", "pCube912002", "pCube913002", "pCube914002", "pCube915002", "pCube916002", "pCube917002", "pCube918002", "pCube919002", "pCube920002", "pCube902003", "pCube910003", "pCube911003", "pCube912003", "pCube913003", "pCube914003", "pCube915003", "pCube916003", "pCube917003", "pCube918003", "pCube919003", "pCube920003"]
  let ramHighlight = ["pCube911", "pCube911001", "pCube911002", "pCube911003"]
  let ramText = "Random-access memory (RAM): Stores information temporarily for easy use"
  let gpuText = "Graphics Processing Unit - thinks fast and shows images on screen"
  let gpuHighlight = ["pCube1171", "pCube1169", "pCube1000"]
  let ssd = ["SSD"]
  let ssdHighlight = ["SSD"]
  let ssdText = 'Solid-state drive/Hard Drive - Stores memory long-term'
  onMount(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x384454);

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
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
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
        if (computerCase.includes(clicked.name)) {
          infoText = computerCaseText
          let highlight = clickableObjects.filter(n => computerCaseHighlight.includes(n.name))
          selectedObject = highlight
        } else if (topFan.includes(clicked.name)) {
          infoText = topFanText
          let highlight = clickableObjects.filter(n => topFanHighlight.includes(n.name))
          selectedObject = highlight
        } else if (middleFan.includes(clicked.name)) {
          infoText = middleFanText
          let highlight = clickableObjects.filter(n => middleFanHighlight.includes(n.name))
          selectedObject = highlight
        } else if (bottomFan.includes(clicked.name)) {
          infoText = bottomFanText
          let highlight = clickableObjects.filter(n => bottomFanHighlight.includes(n.name))
          selectedObject = highlight 
        } else if (cpu.includes(clicked.name)) {
          infoText = cpuText
          let highlight = clickableObjects.filter(n => cpuHighlight.includes(n.name))
          selectedObject = highlight
        } else if (psu.includes(clicked.name)) {
          infoText = psuText
          let highlight = clickableObjects.filter(n => psuHighlight.includes(n.name))
          selectedObject = highlight 
        } else if (radiator.includes(clicked.name)) {
          infoText = radiatorText
          let highlight = clickableObjects.filter(n => radiatorHighlight.includes(n.name))
          selectedObject = highlight
        } else if (ram.includes(clicked.name)) {
          infoText = ramText
          let highlight = clickableObjects.filter(n => ramHighlight.includes(n.name))
          selectedObject = highlight
        } else if (clicked.name.slice(0,5) == "pCube" && 1000 <= parseInt(clicked.name.slice(5), 10) && parseInt(clicked.name.slice(5), 10) <= 1177 || clicked.name == "pCube1239" || clicked.name == "pCube1240" || clicked.name == "pCube1241" || clicked.name == "pCylinder156" || clicked.name == "pCylinder160") {
          infoText = gpuText
          let highlight = clickableObjects.filter(n => gpuHighlight.includes(n.name))
          selectedObject = highlight
        } else if (ssd.includes(clicked.name)) {
          infoText = ssdText
          let highlight = clickableObjects.filter(n => ssdHighlight.includes(n.name))
          selectedObject = highlight
        } else {
          infoText = clicked.name || 'Clicked object';
          selectedObject = [clicked]
        }
        infoLeft = event.clientX;
        infoTop = event.clientY;
        showInfo = true;
      } else {
        showInfo = false;
        selectedObject = null
      }
    }
    
    window.addEventListener('mousemove', onMouseMove, false)
    renderer.domElement.addEventListener('click', onClick);

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      outlinePass.selectedObjects = selectedObject ?? [];
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
    selectedObject = null;
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