<script lang="ts">
  import { onMount } from 'svelte';
  import { on } from 'svelte/events';
  import * as THREE from 'three';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'

  import { writable } from 'svelte/store';
  export const modelState = writable({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  });
  import { normalizeUrl } from '@sveltejs/kit';

  let container;  // Reference to the div containing the canvas
  let selectedObject = null;
  let showInfo = false;
  let infoText = '';
  let infoLeft = 0;
  let infoTop = 0;

  const info = [
    {
      components: ["AudioPort1", "AudioPort2", "BackPanel", "GPU_Bracket1", "pCube884", "pCube890", "pCube889", "pCube891", "pCube896", "pCube1200", "pCube1201", "pCube1202", "pCube1203", "pCube1218", "pCube1235", "pCube1236", "pCube1237", "pCylinder97", "pCylinder98", "pCylinder99", "pCylinder100", "pCylinder101", "PowerButton", "PSU_Bracket1", "PSU_Bracket2", "ResetButton", "nurbsToPoly2", "pCube1238"],
      highlights: ["BackPanel", "GPU_Bracket1", "pCube884", "pCube890", "pCube889", "pCube891", "pCube896", "pCylinder97", "pCylinder98", "pCylinder99", "pCylinder100", "pCylinder101", "PSU_Bracket1", "PSU_Bracket2"],
      text: "Computer case - holds parts together and contains ports/buttons"
    },
    {
      components: ["pCube961", 'pCube962', "pCube963", "pCube964", "pCube965", 'pCube966', "pCube967", "pCylinder145", "pCylinder164", "pCube970", "pCube971", "pCube972", 'pCylinder146'],
      highlights: ["pCube970", 'pCylinder146'],
      text: "Top fan - part of radiator; cools down coolant"
    },
    {
      components: ["pCube961001", "pCube962001", "pCube963001", "pCube964001", "pCube965001", "pCube966001", "pCube967001", "pCylinder145001", "pCylinder164001", 'pCube970001', "pCube971001", "pCube972001", "pCylinder146001"],
      highlights: ["pCube970001", "pCylinder146001"],
      text: "Middle fan - part of radiator; cools down coolant"
    },
    {
      components: ["pCube961002", "pCube962002", "pCube963002", "pCube964002", "pCube965002", "pCube966002", "pCube967002", "pCylinder145002", "pCylinder164002", "pCube970002", "pCube971002", "pCube972002", "pCylinder146002"],
      highlights: ["pCube970002", "pCylinder146002"],
      text: "Bottom fan  - part of radiator; cools down coolant"
    },
    {
      components: ["pCube840", "pCube841", "pCube1222", "pCube1220", "pCube181", "pCube181", "pCube182", "pCube183", "pCube184", "pCube1219"],
      highlights: ["pCube840", "pCube841", "pCube1222", "pCube1220"],
      text: "Central Processing Unit/Water Block - cpu does calculations very fast, water block draws heat into cooling system"
    },
    {
      components: ["pCube961003", "pCube962003", "pCube963003", "pCube964003", "pCube965003", "pCube966003", "pCube967003", "pCylinder145003", "pCube1252", "pCube1253", "pCube1254", "pCube1255", "pCube1256", "pCube1257", "pCube1258", "pCube1259", "pCube1260", "pCube1261", "pCube927", "pCube928", "pCube940", "pCube932", "pCube1242", "pCube1243", "pCube1251", "Mesh1069"],
      highlights: ["pCube927", "pCube928", "pCube940", "Mesh1069"],
      text: "Power Supply Unit - converts between AC/DC and gives correct voltage rails for different components"
    },
    {
      components: ["pCube1191", "pCube1192", "pCube1193", "pCube1194", "pCube1195", "pCube1196", "pCube1197", "pCube1198", "pCube1199", "pCylinder162", "pCylinder163"],
      highlights: ['pCube1191'],
      text: "Radiator - controls temperature and prevents heat damage"
    },
    {
      components: ["pCube902", 'pCube910', 'pCube911', "pCube912", "pCube913", "pCube914", "pCube915", "pCube916", "pCube917", "pCube918", "pCube919", "pCube920", "pCube902001", "pCube910001", "pCube911001", "pCube912001", "pCube913001", "pCube914001", "pCube915001", "pCube916001", "pCube917001", "pCube918001", "pCube919001", "pCube920001", "pCube902002", "pCube910002", "pCube911002", "pCube912002", "pCube913002", "pCube914002", "pCube915002", "pCube916002", "pCube917002", "pCube918002", "pCube919002", "pCube920002", "pCube902003", "pCube910003", "pCube911003", "pCube912003", "pCube913003", "pCube914003", "pCube915003", "pCube916003", "pCube917003", "pCube918003", "pCube919003", "pCube920003"],
      highlights: ["pCube911", "pCube911001", "pCube911002", "pCube911003"],
      text: "Random-access memory (RAM): Stores information temporarily for easy use"
    },
    {
      components: ["SSD"],
      highlights: ["SSD"],
      text: 'Solid-state drive/Hard Drive - Stores memory long-term'
    },
    {
      components: ["pCube986", "pCube989", "pCube991", "pCube992", "pCube993", "pCube996", "pCube997", "pCube1178", "pCube1180", "pCube1185", "pCube1186", "pCube1188", "pCube1189", "pCylinder159", "pCylinder156"],
      highlights: ["pCylinder156"],
      text: "GPU Left Fan - Cools down GPU"
    },
    {
      components: ["pCube987", "pCube988", "pCube990", "pCube994", "pCube995", "pCube998", "pCube1179", "pCube1181", "pCube1182", "pCube1183", 'pCube1184', "pCube1187", "pCube1190", "pCylinder161", "pCylinder160"],
      highlights:  ['pCylinder160'],
      text: "GPU Right Fan - Cools down GPU"
    },
    {
      components:  ["pCylinder187", "pCylinder197", "pCylinder199", "pCylinder200", "pCylinder201", "pCylinder202", "pCylinder203", "pCylinder204", 'pCylinder205', "Mesh1032", "Mesh1030_1", "Mesh1032_1", "Mesh1030", "Mesh1028"],
      highlights: ["pCylinder187", "pCylinder203", "pCylinder204", "Mesh1032", "pCylinder201", "pCylinder197", "pCylinder200", "Mesh1028"],
      text: "Nozzle - used for refills? idk"
    },
    {
      components:  ["Resevoir", "pCylinder206", "pCylinder172", "pCylinder176", "pCube1224", "pCube1225"],
      highlights: ["Resevoir", "pCylinder176", "pCube1224", "pCube1225"],
      text: "Reservoir - main water storage/source"
    },
    {
      components: ['pCylinder169', "pCube1215", "pCube1216", "pCube1204", "pCube1205", "pCube1206", "pCube1207", "pCube1208", "pCube1209", "pCube1210", "pCube1211", "pCube1212", "pCube1213"],
      highlights: ["pCylinder169", "pCube1215", "pCube1216"],
      text: "Pump - circulates coolant throughout PC"
    },
    {
      components: ["pCylinder188", "pCylinder192", "pCylinder191", "Mesh1018", "Mesh1019"],
      highlights: ['pCylinder188', 'pCylinder192', 'pCylinder191', "Mesh1018", "Mesh1019"],
      text: "Tubing - carries coolant to maintain healthy PC temperature"
    },
    {
      components: ["pCylinder190", "pCylinder193", "pCylinder194", "Mesh1021", "Mesh1020"],
      highlights: ['pCylinder190', 'pCylinder193', 'pCylinder194', "Mesh1021", "Mesh1020"],
      text: "Tubing - carries coolant to maintain healthy PC temperature"
    },
    {
      components: ["pCylinder189", "pCylinder195", "pCylinder199", "Mesh1029", "Mesh1022"],
      highlights: ['pCylinder189', 'pCylinder195', 'pCylinder199', "Mesh1022", "Mesh1029"],
      text: "Tubing - carries coolant to maintain healthy PC temperature"
    }
  ]
  let gpuText = "Graphics Processing Unit - thinks fast and shows images on screen"
  let gpuHighlight = ["pCube1171", "pCube1169", "pCube1000"]
  let motherBoardText = "Motherboard - connects most other components - contains CPU socket, RAM socket, power connectors, storage connectors, internal conenctors, and voltage regulator modules."
  let motherBoardHighlight = ["pCube511", "pCube476"]

  const toDestroy = []
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
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxSize = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxSize / (2 * Math.tan(fov / 2)));
      cameraZ *= 0.8;
      camera.position.set(center.x, center.y, cameraZ);
      camera.lookAt(center);

      onDestroy(() => {
      unsubscribe();
      });
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseMove(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      if (down) {
        showInfo = false
        selectedObject = null
      }
    }
    function onClick(event) {
      if (
        Math.abs(event.clientX - startX) >= 10 ||
        Math.abs(event.clientY - startY) >= 10
      )
        return;

      // Convert mouse coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableObjects, true);

      if (intersects.length > 0) {
        const clicked = intersects[0].object;
        let chosen = false
        for (const { components, highlights, text} of info) {
          if (components.includes(clicked.name)) {
            infoText = text
            selectedObject = clickableObjects.filter(i => highlights.includes(i.name))
            chosen = true
            break
          }
        }
        if (!chosen) {
          const num = parseInt(clicked.name.slice(5), 10)
          if (clicked.name.slice(0,5) == "pCube" && ((num >= 1000 && num <= 1177) || num === 1240 || num === 1241)) {
            infoText = gpuText
            selectedObject = clickableObjects.filter(n => gpuHighlight.includes(n.name))
          } else {
            infoText = motherBoardText;
            selectedObject = clickableObjects.filter(n => motherBoardHighlight.includes(n.name))
          }
        }
        
        infoLeft = event.clientX;
        infoTop = event.clientY;
        showInfo = true;
      } else {
        showInfo = false;
        selectedObject = null
      }

      down = false
    }
    
    const canvas = renderer.domElement
    let startX: number, startY: number, down: boolean;
    toDestroy.push(
      on(canvas, "mousedown", (e) => {
        startX = e.clientX;
        startY = e.clientY;
        down = true;
      }),
      on(canvas, "touchstart", (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        down = true;
      }),
      on(canvas, "mousemove", onMouseMove),
      on(canvas, "touchmove", e => onMouseMove(e.touches[0])),
      on(canvas, "mouseup", onClick),
      on(canvas, "touchend", (e) => onClick(e.touches[0])
      )
    );

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      outlinePass.selectedObjects = selectedObject ?? [];
      composer.render();
      if (model) {
      modelState.set({
      position: {
        x: model.position.x,
        y: model.position.y,
        z: model.position.z
      },
      rotation: {
        x: model.rotation.x,
        y: model.rotation.y,
        z: model.rotation.z
      }
      });
      }
    }
    animate();

   modelState.subscribe(state => {
    if (model) {
      model.position.set(state.position.x, state.position.y, state.position.z);
      model.rotation.set(state.rotation.x, state.rotation.y, state.rotation.z);
      }
    });
    // Resize handling
    window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  });


    return () => {
      for (const handler of toDestroy) handler()
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
  top: 10px;
  right: 10px;
  background: none; 
  border: none; 
  padding: 0;     
  font-size: 1.2em;
  color: #333;
  cursor: pointer;
  outline: none;
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