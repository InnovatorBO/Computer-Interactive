<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

  // Function for CTA button
  function handleHomeAction() {
    console.log('Home action triggered');
  }

  let container: HTMLElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let currentModel: THREE.Object3D;
  let modelGroup: THREE.Group;
  let isModelLoaded = false;
  let loadedModels: THREE.Object3D[] = [];
  let currentModelIndex = 0;
  let modelSwitchInterval: number;
  let isAnimating = false;

  onMount(() => {
    scene = new THREE.Scene();
    modelGroup = new THREE.Group();
    scene.add(modelGroup);

    camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 48);

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00ff88, 0.5, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x00c6ff, 0.5, 100);
    pointLight2.position.set(5, -5, 5);
    scene.add(pointLight2);

    isAnimating = true;
    animate();

    loadAllModels();

    setTimeout(() => {
      if (loadedModels.length > 0) {
        startModelSwitching();
      }
    }, 1000);

    const handleResize = () => {
      if (container && camera && renderer) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (modelSwitchInterval) clearInterval(modelSwitchInterval);
      if (renderer) renderer.dispose();
    };
  });

  function loadAllModels() {
    const modelFiles = [
      'dream_computer_setup1.glb',
      'dream_computer_setup2.glb',
      'dream_computer_setup3.glb'
    ];

    const scaleFactors = [1.5, 8.0, 30.5];
    const loader = new GLTFLoader();
    let modelsLoaded = 0;

    modelFiles.forEach((filename, index) => {
      loader.load(
        filename,
        (gltf) => {
          const model = gltf.scene;
          const scale = scaleFactors[index];
          model.scale.set(scale, scale, scale);

          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);

          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          loadedModels[index] = model;
          modelsLoaded++;

          if (index === 0) {
            showModel(0);
            isModelLoaded = true;
          }

          if (modelsLoaded === modelFiles.length) {
            isModelLoaded = true;
          }
        }
      );
    });
  }

  function showModel(index: number) {
    if (!loadedModels[index]) return;
    const newModel = loadedModels[index];

    if (currentModel) {
      const fadeOut = { opacity: 1 };
      const fadeOutAnimation = () => {
        fadeOut.opacity -= 0.05;
        currentModel.traverse((child) => {
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                mat.transparent = true;
                mat.opacity = fadeOut.opacity;
              });
            } else {
              child.material.transparent = true;
              child.material.opacity = fadeOut.opacity;
            }
          }
        });

        if (fadeOut.opacity > 0) {
          requestAnimationFrame(fadeOutAnimation);
        } else {
          modelGroup.remove(currentModel);
          addNewModel();
        }
      };
      fadeOutAnimation();
    } else {
      addNewModel();
    }

    function addNewModel() {
      newModel.traverse((child) => {
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              mat.transparent = true;
              mat.opacity = 0;
            });
          } else {
            child.material.transparent = true;
            child.material.opacity = 0;
          }
        }
      });

      currentModel = newModel;
      modelGroup.add(currentModel);
      modelGroup.position.set(0, -1, 0);
      currentModelIndex = index;

      const fadeIn = { opacity: 0 };
      const fadeInAnimation = () => {
        fadeIn.opacity += 0.05;
        currentModel.traverse((child) => {
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                mat.opacity = fadeIn.opacity;
              });
            } else {
              child.material.opacity = fadeIn.opacity;
            }
          }
        });

        if (fadeIn.opacity < 1) {
          requestAnimationFrame(fadeInAnimation);
        }
      };
      fadeInAnimation();
    }
  }

  function startModelSwitching() {
    modelSwitchInterval = setInterval(() => {
      if (loadedModels.length > 1) {
        const nextIndex = (currentModelIndex + 1) % loadedModels.length;
        showModel(nextIndex);
      }
    }, 15000);
  }

  function animate() {
    requestAnimationFrame(animate);

    if (modelGroup && isModelLoaded && currentModel) {
      modelGroup.rotation.y += 0.012;
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }
</script>

<svelte:head>
  <title>Welcome to the Thinking Machine</title>
</svelte:head>

<div bind:this={container} class="three-container"></div>

<div class="main-content">
  <h1>Thinking Machine</h1>
  <p>Description/about the product</p>
  <a href="/learn" class="cta-button">Go to Product</a>
</div>

<style>
  :global(body) {
    margin: 0;
    overflow-x: hidden;
  }

  .three-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  }

  .main-content {
    flex: 1;
    background: rgba(48, 69, 88, 0.35); 
    backdrop-filter: blur(8px); 
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 300px 20px;
    text-align: center;
    z-index: 1;
  }

  .main-content h1 {
    color: white;
    font-size: 4rem;
    font-weight: 300;
    margin-bottom: 2rem;
    letter-spacing: 2px;
  }

  .main-content p {
    color: white;
    font-size: 2rem;
    font-weight: 300;
    margin-bottom: 3rem;
    opacity: 0.9;
  }

  .cta-button {
    background: linear-gradient(135deg, #0497ad, #02c75b);
    color: #2c3e50;
    padding: 20px 40px;
    border: white 2px solid;
    border-radius: 50px;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(26, 188, 156, 0.3);
  }

  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(26, 188, 156, 0.4);
  }

  @media (max-width: 768px) {
    .main-content h1 {
      font-size: 2.5rem;
    }

    .main-content p {
      font-size: 1.5rem;
    }

    .cta-button {
      padding: 15px 30px;
      font-size: 1rem;
    }
  }
</style>