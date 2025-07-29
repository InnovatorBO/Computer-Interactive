  <script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

  function goToProduct() {
    console.log('Go to product clicked');
    // Add your navigation logic here
  }

  let container: HTMLElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let currentModel: THREE.Object3D;
  let modelGroup: THREE.Group;
  let isModelLoaded = false;
  let loadedModels: THREE.Object3D[] = []; // Store all loaded models
  let currentModelIndex = 0;
  let modelSwitchInterval: number;
  let isAnimating = false; // Start animation immediately

  onMount(() => {
    // Scene setup
    scene = new THREE.Scene();
    
    // Create model group
    modelGroup = new THREE.Group();
    scene.add(modelGroup);
    
    // Camera setup - zoomed out more
    camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 48); // Moved camera further back to zoom out

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting setup
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

    // Start animation loop immediately
    isAnimating = true;
    animate();

    // Load all GLB models
    loadAllModels();

    // Start model switching after first model loads
    setTimeout(() => {
      if (loadedModels.length > 0) {
        startModelSwitching();
      }
    }, 1000); // Reduced wait time
    const handleResize = () => {
      if (container && camera && renderer) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);

    // Start animation loop
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (modelSwitchInterval) {
        clearInterval(modelSwitchInterval);
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  });

  function loadAllModels() {
    const modelFiles = [
      'dream_computer_setup1.glb',
      'dream_computer_setup2.glb', 
      'dream_computer_setup3.glb'
    ];
    
    // Individual scale factors to match model 1's size
    const scaleFactors = [
      1.5,    
      8.0,    
      30.5     
    ];
    
    const loader = new GLTFLoader();
    let modelsLoaded = 0;
    
    modelFiles.forEach((filename, index) => {
      loader.load(
        filename,
        (gltf) => {
          const model = gltf.scene;
          
          // Scale each model individually to match model 1's size
          const scale = scaleFactors[index];
          model.scale.set(scale, scale, scale);
          
          // Center the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          
          // Enable shadows
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          // Store the model
          loadedModels[index] = model;
          modelsLoaded++;
          
          // If this is the first model, show it immediately and start spinning
          if (index === 0) {
            showModel(0);
            isModelLoaded = true; // Enable spinning right away
          }
          
          console.log(`Loaded model ${index + 1}: ${filename} (scale: ${scale})`);
          
          // If all models are loaded, mark as ready
          if (modelsLoaded === modelFiles.length) {
            isModelLoaded = true;
            console.log('All computer models loaded successfully!');
          }
        },
        (progress) => {
          console.log(`Loading ${filename}: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
        },
        (error) => {
          console.error(`Error loading ${filename}:`, error);
        }
      );
    });
  }
  
  function showModel(index: number) {
    if (!loadedModels[index]) return;
    
    const newModel = loadedModels[index];
    
    // If there's a current model, fade it out
    if (currentModel) {
      // Fade out current model
      const fadeOut = { opacity: 1 };
      const fadeOutAnimation = () => {
        fadeOut.opacity -= 0.05;
        currentModel.traverse((child) => {
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
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
          // Remove old model and add new one
          modelGroup.remove(currentModel);
          addNewModel();
        }
      };
      fadeOutAnimation();
    } else {
      // No current model, just add the new one
      addNewModel();
    }
    
    function addNewModel() {
      // Reset opacity for new model
      newModel.traverse((child) => {
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              mat.transparent = true;
              mat.opacity = 0;
            });
          } else {
            child.material.transparent = true;
            child.material.opacity = 0;
          }
        }
      });
      
      // Add new model
      currentModel = newModel;
      modelGroup.add(currentModel);
      modelGroup.position.set(0, -1, 0);
      currentModelIndex = index;
      
      // Fade in new model
      const fadeIn = { opacity: 0 };
      const fadeInAnimation = () => {
        fadeIn.opacity += 0.05;
        currentModel.traverse((child) => {
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.opacity = fadeIn.opacity;
              });
            } else {
              child.material.opacity = fadeIn.opacity;
            }
          }
        });
        
        if (fadeIn.opacity < 1) {
          requestAnimationFrame(fadeInAnimation);
        } else {
          // Animation complete - reset transparency
          currentModel.traverse((child) => {
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                  mat.transparent = false;
                  mat.opacity = 1;
                });
              } else {
                child.material.transparent = false;
                child.material.opacity = 1;
              }
            }
          });
        }
      };
      fadeInAnimation();
    }
  }
  
  function startModelSwitching() {
    // Switch models every 15 seconds
    modelSwitchInterval = setInterval(() => {
      if (loadedModels.length > 1) {
        // Move to next model (cycle back to 0 after the last one)
        const nextIndex = (currentModelIndex + 1) % loadedModels.length;
        showModel(nextIndex);
        console.log(`Switching to computer model ${nextIndex + 1}`);
      }
    }, 15000); // 15 seconds
  }

  function animate() {
    requestAnimationFrame(animate);

    if (modelGroup && isModelLoaded && currentModel) {
      // Rotate the group, which contains the centered model
      modelGroup.rotation.y += 0.004;
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }
</script>

<svelte:head>
  <title>Home Page with 3D Computer</title>
</svelte:head>

<div bind:this={container} class="three-container"></div>

<section class="hero">
  <h1>Home Page</h1>
  <p>Experience the future with our cutting-edge computer setups</p>
  <button class="product-btn" on:click={goToProduct}>
    Go to Product
  </button>
</section>

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

  .hero {
    background: rgba(47, 59, 68, 0.8);
    color: white;
    padding: 2rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: center;
    position: relative;
    z-index: 1;
    backdrop-filter: blur(5px);
  }

  .hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }

  .hero p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
    text-align: center;
    max-width: 600px;
  }

  .product-btn {
    font-size: 1.2rem;
    padding: 1rem 2rem;
    border-radius: 12px;
    border: 3px solid white;
    background: linear-gradient(to right, #00c6ff, #00ff88);
    color: black;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
    font-weight: bold;
  }

  .product-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 198, 255, 0.3);
  }
</style>