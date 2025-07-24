<script>

    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  
    /** @type {HTMLDivElement | null} */
    let container;
  
    onMount(() => {
      if (!container) {return;}
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 5;
  
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
  
      scene.background = new THREE.Color(0xf0f0f0);

      const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0);
      scene.add(light);
  
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight.position.set(5, 10, 7.5); // x, y, z
      scene.add(directionalLight);

      function animate() {
        requestAnimationFrame(animate);

        scene.rotation.x += 0.01;
        scene.rotation.y += 0.01;

        renderer.render(scene, camera);
      }

      const loader = new GLTFLoader();
      loader.load('/models/scene.gltf', gltf => {
        scene.add(gltf.scene);
        animate();
      }, undefined, err => console.error(err));

      return () => {
        renderer.dispose();
      };
    });
  </script>
  
  <div bind:this={container} style="width: 100%; height: 500px;"> </div>
  