<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

  let dropdownOpen = false;
  let openDescription: string | null = null;

  const pages = [
    { name: 'Learn', path: '/learn', description: 'Learn about computer components with interactive 2D diagrams and explanations. Quiz yourself with practice questions.' },
    { name: 'Explore', path: '/explore', description: 'Explore the different parts of a 3D computer visually and interactively.' },
    { name: 'Flashcards', path: '/flashcards', description: 'Practice and test your knowledge with computer component flashcards.' },
    { name: 'Game', path: '/game', description: 'Play a game to reinforce your understanding of computer parts.' },
    { name: 'Build', path: '/game_page', description: 'Build your own computer and understand the specs.' },
    { name: 'Interactive', path: '/interactive', description: 'Interact with computer models and simulations.' },
  ];

  function toggleDropdown() {
    dropdownOpen = !dropdownOpen;
  }
  function toggleDescription(pageName: string) {
    openDescription = openDescription === pageName ? null : pageName;
  }

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
  let animationId: number;

  onMount(() => {
    if (!container) return;

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
      antialias: true,
      powerPreference: "high-performance"
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
  });

  onDestroy(() => {
    if (modelSwitchInterval) {
      clearInterval(modelSwitchInterval);
    }
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    if (renderer) {
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
    // Clean up loaded models
    loadedModels.forEach(model => {
      if (model) {
        disposeModel(model);
      }
    });
    loadedModels = [];
  });

  function disposeModel(model: THREE.Object3D) {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
  }

  function loadAllModels() {
    const modelFiles = [
      'dream_computer_setup1.glb',
      //'dream_computer_setup2.glb',
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
              // Ensure materials are properly configured
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach(mat => {
                    mat.needsUpdate = true;
                  });
                } else {
                  child.material.needsUpdate = true;
                }
              }
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
        },
        (progress) => {
          // Progress callback
        },
        (error) => {
          console.error('Error loading model:', error);
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
    if (modelSwitchInterval) {
      clearInterval(modelSwitchInterval);
    }
    modelSwitchInterval = setInterval(() => {
      if (loadedModels.length > 1) {
        const nextIndex = (currentModelIndex + 1) % loadedModels.length;
        showModel(nextIndex);
      }
    }, 15000);
  }

  function animate() {
    if (!isAnimating) return;
    
    animationId = requestAnimationFrame(animate);

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
  <div class="dropdown-container">
    <button class="dropdown-toggle" on:click={toggleDropdown} aria-expanded={dropdownOpen}>
      {dropdownOpen ? '▼' : '►'} Explore each page
    </button>
    {#if dropdownOpen}
      <div class="dropdown-menu">
        {#each pages as page}
          <div class="dropdown-page">
            <div class="page-link-row">
              <a href={page.path} class="dropdown-link" on:click|preventDefault={() => toggleDescription(page.name)}>{page.name}</a>
            </div>
            {#if openDescription === page.name}
              <div class="page-description">{page.description}</div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
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

  .dropdown-container {
    margin-bottom: 2rem;
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .dropdown-toggle {
    width: 100%;
    background: linear-gradient(135deg, #0497ad, #02c75b);
    color: #fff;
    font-size: 1.5rem;
    font-weight: bold;
    border: none;
    border-radius: 16px 16px 0 0;
    padding: 20px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(26, 188, 156, 0.2);
    text-align: left;
    transition: background 0.3s;
  }
  .dropdown-toggle:focus {
    outline: 2px solid #02c75b;
  }
  .dropdown-menu {
    width: 100%;
    background: #fff;
    border-radius: 0 0 16px 16px;
    box-shadow: 0 8px 24px rgba(26, 188, 156, 0.15);
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
    z-index: 10;
  }
  .dropdown-page {
    border-bottom: 1px solid #e0e0e0;
    padding: 0 20px;
  }
  .dropdown-page:last-child {
    border-bottom: none;
  }
  .page-link-row {
    display: flex;
    align-items: center;
    padding: 18px 0 6px 0;
  }
  .dropdown-link {
    color: #0497ad;
    font-size: 1.2rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s;
  }
  .dropdown-link:hover {
    color: #02c75b;
    text-decoration: underline;
  }
  .page-description {
    font-size: 1rem;
    color: #333;
    background: #f6f8fa;
    border-radius: 8px;
    margin-bottom: 10px;
    margin-left: 10px;
    margin-right: 10px;
    padding: 12px 16px;
    box-shadow: 0 2px 8px rgba(26, 188, 156, 0.07);
    animation: fadeIn 0.2s;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
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