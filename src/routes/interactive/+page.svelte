<script lang="ts">
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
  
  // Page metadata
  let title = "Interactive PC Builder";
  let isBrowser = typeof window !== 'undefined';
  
  // 3D Model variables
  let canvasContainer;
  let scene;
  let camera;
  let renderer;
  let controls;
  let model;
  let isModelLoaded = false;
  let loadingProgress = 0;
  let loadingError = false;
  let activePopup: string | null = null;
  
  function showPopup(popupId: string): void {
    if (activePopup) {
      closePopup();
    }
    activePopup = popupId;
  }

  function closePopup(): void {
    activePopup = null;
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      closePopup();
    }
  }

  function handleBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      closePopup();
    }
  }

  // Camera and zoom settings (easy to adjust)
  let cameraSettings = {
    initialPosition: { x: 0, y: 1, z: 3 }, // Start closer to the model
    minZoom: 2,                           // Minimum zoom distance
    maxZoom: 8,                           // Maximum zoom distance
    fov: 35                               // Field of view (lower = more zoomed in)
  };
  
  // Component selection
  let selectedComponents = {
    cpu: 0,
    gpu: 0,
    ram: 0,
    storage: 0
  };

  // Performance metrics (now on 0-100 scale)
  let performance = {
    gamingScore: 0,
    productivityScore: 0, 
    multitaskingScore: 0,
    overallScore: 0,
    totalPrice: 0,
    powerConsumption: 0
  };

  let componentOptions = {
    cpu: [
      { name: "Intel Core i9-13900K", price: 599, cores: 24, threads: 32, baseClock: "3.0 GHz", boostClock: "5.8 GHz", tdp: 125, cinebenchR23: 38000, cpuMark: 54800 },
      { name: "AMD Ryzen 9 7950X", price: 549, cores: 16, threads: 32, baseClock: "4.5 GHz", boostClock: "5.7 GHz", tdp: 170, cinebenchR23: 36000, cpuMark: 51300 },
      { name: "Intel Core i7-13700K", price: 419, cores: 16, threads: 24, baseClock: "3.4 GHz", boostClock: "5.4 GHz", tdp: 125, cinebenchR23: 30000, cpuMark: 40200 },
      { name: "AMD Ryzen 7 7700X", price: 349, cores: 8, threads: 16, baseClock: "4.5 GHz", boostClock: "5.4 GHz", tdp: 105, cinebenchR23: 20000, cpuMark: 30000 },
      { name: "Intel Core i5-13600K", price: 319, cores: 14, threads: 20, baseClock: "3.5 GHz", boostClock: "5.1 GHz", tdp: 125, cinebenchR23: 24000, cpuMark: 34500 },
      { name: "AMD Ryzen 5 7600X", price: 249, cores: 6, threads: 12, baseClock: "4.7 GHz", boostClock: "5.3 GHz", tdp: 105, cinebenchR23: 15000, cpuMark: 22500 },
      { name: "Intel Core i3-13100", price: 149, cores: 4, threads: 8, baseClock: "3.4 GHz", boostClock: "4.5 GHz", tdp: 60, cinebenchR23: 9000, cpuMark: 14800 }
    ],
    gpu: [
      { name: "NVIDIA RTX 4090", price: 1599, memory: "24GB GDDR6X", boost: "2.52 GHz", tdp: 450, gamingFPS: 180, timespy: 28500, portRoyal: 25800 },
      { name: "AMD RX 7900 XTX", price: 999, memory: "24GB GDDR6", boost: "2.5 GHz", tdp: 355, gamingFPS: 160, timespy: 25000, portRoyal: 20500 },
      { name: "NVIDIA RTX 4080", price: 1199, memory: "16GB GDDR6X", boost: "2.51 GHz", tdp: 320, gamingFPS: 150, timespy: 23500, portRoyal: 22000 },
      { name: "AMD RX 7900 XT", price: 899, memory: "20GB GDDR6", boost: "2.4 GHz", tdp: 315, gamingFPS: 145, timespy: 23000, portRoyal: 18600 },
      { name: "NVIDIA RTX 4070 Ti", price: 799, memory: "12GB GDDR6X", boost: "2.61 GHz", tdp: 285, gamingFPS: 135, timespy: 20500, portRoyal: 17000 },
      { name: "AMD RX 7800 XT", price: 499, memory: "16GB GDDR6", boost: "2.43 GHz", tdp: 263, gamingFPS: 120, timespy: 17500, portRoyal: 14500 },
      { name: "NVIDIA RTX 4070", price: 599, memory: "12GB GDDR6X", boost: "2.48 GHz", tdp: 200, gamingFPS: 110, timespy: 17000, portRoyal: 14000 },
      { name: "AMD RX 7700 XT", price: 449, memory: "12GB GDDR6", boost: "2.54 GHz", tdp: 245, gamingFPS: 100, timespy: 15800, portRoyal: 12500 },
      { name: "NVIDIA RTX 4060 Ti", price: 399, memory: "8GB GDDR6", boost: "2.54 GHz", tdp: 160, gamingFPS: 90, timespy: 14200, portRoyal: 10000 },
      { name: "Integrated Graphics", price: 0, memory: "Shared", boost: "N/A", tdp: 15, gamingFPS: 30, timespy: 1500, portRoyal: 0 }
    ],
    ram: [
      { name: "Corsair Dominator Platinum 64GB DDR5-6000", price: 349, capacity: "64GB (2x32GB)", type: "DDR5", speed: "6000MHz", timing: "CL36", aida64: 58000 },
      { name: "G.Skill Trident Z5 RGB 32GB DDR5-6400", price: 289, capacity: "32GB (2x16GB)", type: "DDR5", speed: "6400MHz", timing: "CL32", aida64: 55000 },
      { name: "Kingston Fury Beast 32GB DDR5-5600", price: 169, capacity: "32GB (2x16GB)", type: "DDR5", speed: "5600MHz", timing: "CL40", aida64: 50000 },
      { name: "Crucial Pro 32GB DDR5-5200", price: 129, capacity: "32GB (2x16GB)", type: "DDR5", speed: "5200MHz", timing: "CL42", aida64: 48000 },
      { name: "Corsair Vengeance RGB Pro 32GB DDR4-3600", price: 109, capacity: "32GB (2x16GB)", type: "DDR4", speed: "3600MHz", timing: "CL18", aida64: 40000 },
      { name: "G.Skill Ripjaws V 16GB DDR4-3200", price: 59, capacity: "16GB (2x8GB)", type: "DDR4", speed: "3200MHz", timing: "CL16", aida64: 35000 },
      { name: "Crucial Ballistix 16GB DDR4-3600", price: 69, capacity: "16GB (2x8GB)", type: "DDR4", speed: "3600MHz", timing: "CL16", aida64: 38000 },
      { name: "Kingston FURY Beast 16GB DDR4-3200", price: 54, capacity: "16GB (2x8GB)", type: "DDR4", speed: "3200MHz", timing: "CL16", aida64: 35000 },
      { name: "Patriot Viper Steel 16GB DDR4-4400", price: 109, capacity: "16GB (2x8GB)", type: "DDR4", speed: "4400MHz", timing: "CL19", aida64: 42000 }
    ],
    storage: [
      { name: "Samsung 990 Pro 2TB", price: 259, capacity: "2TB", type: "PCIe 4.0 NVMe SSD", form: "M.2", readSpeed: "7450 MB/s", writeSpeed: "6900 MB/s", crystalDiskMark: 7450 },
      { name: "WD Black SN850X 1TB", price: 159, capacity: "1TB", type: "PCIe 4.0 NVMe SSD", form: "M.2", readSpeed: "7300 MB/s", writeSpeed: "6300 MB/s", crystalDiskMark: 7300 },
      { name: "Crucial P5 Plus 1TB", price: 149, capacity: "1TB", type: "PCIe 4.0 NVMe SSD", form: "M.2", readSpeed: "6600 MB/s", writeSpeed: "5000 MB/s", crystalDiskMark: 6600 },
      { name: "Samsung 980 Pro 1TB", price: 129, capacity: "1TB", type: "PCIe 4.0 NVMe SSD", form: "M.2", readSpeed: "7000 MB/s", writeSpeed: "5000 MB/s", crystalDiskMark: 7000 },
      { name: "WD Black SN770 1TB", price: 109, capacity: "1TB", type: "PCIe 4.0 NVMe SSD", form: "M.2", readSpeed: "5150 MB/s", writeSpeed: "4900 MB/s", crystalDiskMark: 5150 },
      { name: "Samsung 970 EVO Plus 1TB", price: 99, capacity: "1TB", type: "PCIe 3.0 NVMe SSD", form: "M.2", readSpeed: "3500 MB/s", writeSpeed: "3300 MB/s", crystalDiskMark: 3500 },
      { name: "Crucial P3 1TB", price: 79, capacity: "1TB", type: "PCIe 3.0 NVMe SSD", form: "M.2", readSpeed: "3500 MB/s", writeSpeed: "3000 MB/s", crystalDiskMark: 3500 },
      { name: "Samsung 870 EVO 1TB", price: 89, capacity: "1TB", type: "SATA SSD", form: "2.5\"", readSpeed: "560 MB/s", writeSpeed: "530 MB/s", crystalDiskMark: 560 },
      { name: "WD Blue 2TB", price: 54, capacity: "2TB", type: "HDD", form: "3.5\"", readSpeed: "147 MB/s", writeSpeed: "147 MB/s", crystalDiskMark: 147 }
    ]
  };

  // Components data structure
  let components = {
    cpu: {
      name: "",
      price: 0,
      cores: 0,
      threads: 0,
      baseClock: "",
      boostClock: "",
      tdp: 0,
      cinebenchR23: 0,
      cpuMark: 0
    },
    gpu: {
      name: "",
      price: 0,
      memory: "",
      boost: "",
      tdp: 0,
      gamingFPS: 0,
      timespy: 0,
      portRoyal: 0
    },
    ram: {
      name: "",
      price: 0,
      capacity: "",
      type: "",
      speed: "",
      timing: "",
      aida64: 0
    },
    storage: {
      name: "",
      price: 0,
      capacity: "",
      type: "",
      form: "",
      readSpeed: "",
      writeSpeed: "",
      crystalDiskMark: 0
    }
  };

  // Reference values for max performance (used to normalize scores to 0-100 scale)
  const referenceValues = {
    cinebenchR23: 40000,
    cpuMark: 55000,
    gamingFPS: 200,
    timespy: 30000,
    portRoyal: 30000,
    aida64: 60000,
    crystalDiskMark: 8000
  };

  // Animated progress values for performance indicators
  const cpuProgress = tweened(0, { duration: 800, easing: cubicOut });
  const gpuProgress = tweened(0, { duration: 800, easing: cubicOut });
  const ramProgress = tweened(0, { duration: 800, easing: cubicOut });
  const storageProgress = tweened(0, { duration: 800, easing: cubicOut });
  
  const gamingScoreAnimation = tweened(0, { duration: 1000, easing: cubicOut });
  const productivityScoreAnimation = tweened(0, { duration: 1000, easing: cubicOut });
  const multitaskingScoreAnimation = tweened(0, { duration: 1000, easing: cubicOut });
  const overallScoreAnimation = tweened(0, { duration: 1000, easing: cubicOut });

  // Initialize components with first options
  function initializeComponents() {
    updateComponent('cpu', selectedComponents.cpu);
    updateComponent('gpu', selectedComponents.gpu);
    updateComponent('ram', selectedComponents.ram);
    updateComponent('storage', selectedComponents.storage);
  }

  // Update component when selection changes
  function updateComponent(type, index) {
    components[type] = { ...componentOptions[type][index] };
    calculatePerformance();
    updateProgressBars();
  }

  // Calculate performance scores based on components - now on 0-100 scale
  function calculatePerformance() {
    // Gaming score (0-100) based heavily on GPU, moderately on CPU, slightly on RAM
    const rawGamingScore = (
      (components.gpu.gamingFPS / referenceValues.gamingFPS * 55) + 
      (components.cpu.cinebenchR23 / referenceValues.cinebenchR23 * 30) + 
      (components.ram.aida64 / referenceValues.aida64 * 15)
    ) / 100;
    performance.gamingScore = Math.round(Math.min(rawGamingScore, 1) * 100);
    
    // Productivity score (0-100) based heavily on CPU, moderately on RAM, slightly on storage
    const rawProductivityScore = (
      (components.cpu.cinebenchR23 / referenceValues.cinebenchR23 * 50) + 
      (components.ram.aida64 / referenceValues.aida64 * 30) + 
      (components.storage.crystalDiskMark / referenceValues.crystalDiskMark * 20)
    ) / 100;
    performance.productivityScore = Math.round(Math.min(rawProductivityScore, 1) * 100);
    
    // Multitasking score (0-100) based on CPU threads, RAM capacity and speed
    const ramCapacityGB = parseInt(components.ram.capacity.split('GB')[0].replace(/\D/g, ''));
    const maxRamCapacity = 64; // Maximum RAM in our options
    const maxThreads = 32; // Maximum threads in our options
    
    const rawMultitaskingScore = (
      (components.cpu.threads / maxThreads * 45) + 
      (ramCapacityGB / maxRamCapacity * 35) + 
      (components.ram.aida64 / referenceValues.aida64 * 20)
    ) / 100;
    performance.multitaskingScore = Math.round(Math.min(rawMultitaskingScore, 1) * 100);
    
    // Overall score (0-100) is weighted average of all scores
    performance.overallScore = Math.round(
      (performance.gamingScore * 0.4) + 
      (performance.productivityScore * 0.4) + 
      (performance.multitaskingScore * 0.2)
    );
    
    // Calculate total price
    performance.totalPrice = components.cpu.price + components.gpu.price + 
                           components.ram.price + components.storage.price;
                           
    // Calculate power consumption (approximate)
    performance.powerConsumption = components.cpu.tdp + components.gpu.tdp + 50; // 50W for other components
    
    // Update animated values - this is what was causing the issue - needed to update the tweened values
    gamingScoreAnimation.set(performance.gamingScore);
    productivityScoreAnimation.set(performance.productivityScore);
    multitaskingScoreAnimation.set(performance.multitaskingScore);
    overallScoreAnimation.set(performance.overallScore);
  }
  
  // Update performance indicator progress bars
  function updateProgressBars() {
    cpuProgress.set(Math.min(components.cpu.cinebenchR23 / referenceValues.cinebenchR23 * 100, 100));
    gpuProgress.set(Math.min(components.gpu.gamingFPS / referenceValues.gamingFPS * 100, 100));
    ramProgress.set(Math.min(components.ram.aida64 / referenceValues.aida64 * 100, 100));
    storageProgress.set(Math.min(components.storage.crystalDiskMark / referenceValues.crystalDiskMark * 100, 100));
  }

  // Helper function to get color based on performance score (now works on 0-100 scale)
  function getScoreColor(value, max = 100) {
    // For values already on 0-100 scale
    let percentage = (typeof max === 'number' && max !== 100) ? value / max : value / 100;
    
    // For values on original scale
    if (value > 100) {
      // Find the appropriate reference value
      for (const [key, refValue] of Object.entries(referenceValues)) {
        if (value <= refValue * 1.2) { // Allow some values to exceed reference
          percentage = value / refValue;
          break;
        }
      }
    }
    
    // Return color based on percentage
    if (percentage >= 0.8) return '#28a745'; // Green - Excellent
    if (percentage >= 0.6) return '#5cb85c'; // Light Green - Very Good
    if (percentage >= 0.4) return '#ffc107'; // Yellow - Good
    if (percentage >= 0.2) return '#fd7e14'; // Orange - Fair
    return '#dc3545';                        // Red - Basic
  }
  
  // Get performance label based on score percentage (now works on 0-100 scale)
  function getPerformanceLabel(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Very Good';
    if (score >= 40) return 'Good';
    if (score >= 20) return 'Fair';
    return 'Basic';
  }

  // Create a gradient color based on score (for the circular indicator)
  function getScoreGradient(score) {
    const color = getScoreColor(score);
    return `conic-gradient(${color} ${score}%, #e9ecef ${score}% 100%)`;
  }

  // Initialize Three.js scene
  async function initThreeJS() {
    if (!canvasContainer) return;
    
    // Create scene, camera and renderer
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f2f5);
    
    // Camera setup with good initial position
    camera = new THREE.PerspectiveCamera(
      cameraSettings.fov, 
      canvasContainer.clientWidth / canvasContainer.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(
      cameraSettings.initialPosition.x,
      cameraSettings.initialPosition.y,
      cameraSettings.initialPosition.z
    );
    
    // Renderer with antialiasing
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasContainer.appendChild(renderer.domElement);
    
    // Add controls with zoom constraints
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = cameraSettings.minZoom;
    controls.maxDistance = cameraSettings.maxZoom;
    controls.target.set(0, 0.5, 0); // Look at the center of the model
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 0, -5);
    scene.add(fillLight);
    
    // Load 3D model
    try {
      await loadModel();
    } catch (error) {
      console.error("Error loading model:", error);
      loadingError = true;
      // Create fallback model if loading fails
      createFallbackModel();
    }
    
    // Start animation loop
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
  }
  
  // Load the 3D model
  async function loadModel() {
    const loader = new GLTFLoader();
    
    return new Promise((resolve, reject) => {
      // Show loading progress
      loader.load(
        '/dream_computer_setup1.glb', // Path to the model in static folder
        (gltf) => {
          model = gltf.scene;
          
          // Center and scale the model appropriately
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          // Calculate appropriate scale
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2 / maxDim; // Scale to fit in a 2 unit box
          
          model.scale.set(scale, scale, scale);
          model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
          
          // Apply shadows to all meshes
          model.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });
          
          scene.add(model);
          isModelLoaded = true;
          loadingProgress = 1;
          resolve(model);
        },
        // Progress callback
        (progress) => {
          if (progress.lengthComputable) {
            loadingProgress = progress.loaded / progress.total;
          }
        },
        // Error callback
        (error) => {
          console.error('Error loading model:', error);
          loadingError = true;
          reject(error);
        }
      );
    });
  }
  
  // Create a fallback model if loading fails
  function createFallbackModel() {
    // Create a basic PC case model
    const caseGeometry = new THREE.BoxGeometry(2, 4, 4);
    const caseMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const pcCase = new THREE.Mesh(caseGeometry, caseMaterial);
    pcCase.position.set(0, 0, 0);
    pcCase.castShadow = true;
    pcCase.receiveShadow = true;
    scene.add(pcCase);
    
    // Add details to make it look more like a PC
    
    // Front panel
    const frontPanelGeometry = new THREE.PlaneGeometry(1.9, 3.9);
    const frontPanelMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const frontPanel = new THREE.Mesh(frontPanelGeometry, frontPanelMaterial);
    frontPanel.position.set(0, 0, 2.01);
    pcCase.add(frontPanel);
    
    // Power button
    const powerButtonGeometry = new THREE.CircleGeometry(0.1, 32);
    const powerButtonMaterial = new THREE.MeshStandardMaterial({ color: 0x00aaff });
    const powerButton = new THREE.Mesh(powerButtonGeometry, powerButtonMaterial);
    powerButton.position.set(0.7, 1.7, 2.02);
    pcCase.add(powerButton);
    
    // USB ports
    const usbGeometry = new THREE.BoxGeometry(0.15, 0.05, 0.02);
    const usbMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    
    const usb1 = new THREE.Mesh(usbGeometry, usbMaterial);
    usb1.position.set(0.7, 1.5, 2.02);
    pcCase.add(usb1);
    
    const usb2 = new THREE.Mesh(usbGeometry, usbMaterial);
    usb2.position.set(0.7, 1.4, 2.02);
    pcCase.add(usb2);
    
    // Side panel window
    const windowGeometry = new THREE.PlaneGeometry(1.8, 3.8);
    const windowMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x88bbff, 
      transparent: true, 
      opacity: 0.2 
    });
    const sideWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    sideWindow.position.set(1.01, 0, 0);
    sideWindow.rotation.y = Math.PI * 0.5;
    pcCase.add(sideWindow);
    
    // Add some internal components
    
    // CPU cooler
    const cpuCoolerGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
    const cpuCoolerMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const cpuCooler = new THREE.Mesh(cpuCoolerGeometry, cpuCoolerMaterial);
    cpuCooler.position.set(0.5, 0, -0.5);
    cpuCooler.rotation.x = Math.PI * 0.5;
    pcCase.add(cpuCooler);
    
    // GPU
    const gpuGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.6);
    const gpuMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const gpu = new THREE.Mesh(gpuGeometry, gpuMaterial);
    gpu.position.set(0, -1, -0.5);
    pcCase.add(gpu);
    
    // RAM sticks
    const ramGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.2);
    const ramMaterial = new THREE.MeshStandardMaterial({ color: 0x009900 });
    
    for (let i = 0; i < 4; i++) {
      const ram = new THREE.Mesh(ramGeometry, ramMaterial);
      ram.position.set(0, 0.8, -1 + (i * 0.25));
      pcCase.add(ram);
    }
    
    isModelLoaded = true;
  }
  
  // Camera zoom functions - easy to call from buttons or UI
  function zoomIn() {
    if (!controls) return;
    const currentDistance = camera.position.distanceTo(controls.target);
    const newDistance = Math.max(currentDistance * 0.8, cameraSettings.minZoom);
    
    // Create a smooth zoom effect
    const startDistance = currentDistance;
    const distanceDelta = newDistance - startDistance;
    
    let progress = 0;
    const animate = () => {
      progress += 0.05;
      if (progress > 1) progress = 1;
      
      const currentDist = startDistance + distanceDelta * progress;
      
      // Update camera position while maintaining direction
      const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
      camera.position.copy(dir.multiplyScalar(currentDist).add(controls.target));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }
  
  function zoomOut() {
    if (!controls) return;
    const currentDistance = camera.position.distanceTo(controls.target);
    const newDistance = Math.min(currentDistance * 1.2, cameraSettings.maxZoom);
    
    // Create a smooth zoom effect
    const startDistance = currentDistance;
    const distanceDelta = newDistance - startDistance;
    
    let progress = 0;
    const animate = () => {
      progress += 0.05;
      if (progress > 1) progress = 1;
      
      const currentDist = startDistance + distanceDelta * progress;
      
      // Update camera position while maintaining direction
      const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
      camera.position.copy(dir.multiplyScalar(currentDist).add(controls.target));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }
  
  // Reset camera to default position
  function resetCamera() {
    if (!controls || !camera) return;
    
    const startPosition = camera.position.clone();
    const endPosition = new THREE.Vector3(
      cameraSettings.initialPosition.x,
      cameraSettings.initialPosition.y,
      cameraSettings.initialPosition.z
    );
    
    const startTarget = controls.target.clone();
    const endTarget = new THREE.Vector3(0, 0.5, 0);
    
    let progress = 0;
    const animate = () => {
      progress += 0.03;
      if (progress > 1) progress = 1;
      
      // Interpolate position and target
      camera.position.lerpVectors(startPosition, endPosition, progress);
      controls.target.lerpVectors(startTarget, endTarget, progress);
      controls.update();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }
  
  // Update camera settings
  function updateCameraSettings(newSettings) {
    Object.assign(cameraSettings, newSettings);
    
    if (controls) {
      controls.minDistance = cameraSettings.minZoom;
      controls.maxDistance = cameraSettings.maxZoom;
    }
    
    if (camera) {
      camera.fov = cameraSettings.fov;
      camera.updateProjectionMatrix();
    }
  }
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer && scene && camera) renderer.render(scene, camera);
  }
  
  // Handle window resize
  function onWindowResize() {
    if (!camera || !renderer || !canvasContainer) return;
    
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
  }

  // Initialize on page load
  onMount(async () => {
    if (isBrowser) {
      initializeComponents();
      await initThreeJS();
    }
  });
</script>

<svelte:head>
  <title>{title} - Interactive PC Builder</title>
</svelte:head>

<div class="page-container">
  <h1>Interactive PC Builder</h1>
  <p class="intro-text">Build your dream PC by selecting components and see how they affect performance.</p>

  <div class="help-btn">
    <button class="help-button" on:click={() => showPopup('help')}>?</button>
    {#if activePopup === 'help'}
      <div class="popup" on:click={handleBackdropClick}>
        <div class="popup-content">
          <button class="popup-close" on:click={closePopup}>&times;</button>
          <h2>How to Use This Builder</h2>
          <p>Welcome to the Interactive PC Builder! This page allows you to visualize how your computer’s performance changes with different budgets. In the "PC Components” section, choose between different CPU, RAM, GPU, and storage components. Then, look in the “Performance Analysis” section to see your performace scores for gaming, productivity, multitasking, and more. Try experimenting with different types, brands, and prices to build your dream computer!</p>
        </div>
      </div>
    {/if}
  </div>

  <!-- 3D Interactive Model using model-viewer -->
  <div class="model-section">
    <div class="model-container">
      {#if isBrowser}
        <div class="three-js-container" bind:this={canvasContainer}>
          {#if !isModelLoaded}
            <div class="loading-container">
              <div class="loading-text">Loading 3D Model... {Math.round(loadingProgress * 100)}%</div>
              <div class="loading-bar-container">
                <div class="loading-bar" style="width: {loadingProgress * 100}%"></div>
              </div>
              {#if loadingError}
                <div class="loading-error">
                  There was an issue loading the 3D model. Creating a simplified version...
                </div>
              {/if}
            </div>
          {/if}
          
          <div class="model-controls">
            <button class="model-button" on:click={zoomIn}>Zoom In</button>
            <button class="model-button" on:click={resetCamera}>Reset View</button>
            <button class="model-button" on:click={zoomOut}>Zoom Out</button>
          </div>
          
          <div class="model-overlay" class:hidden={!isModelLoaded}>
            <div class="performance-indicator">
              <span class="indicator-label">CPU</span>
              <div class="progress-container">
                <div class="progress-bar" style="width: {$cpuProgress}%; background: {getScoreColor($cpuProgress)}"></div>
              </div>
            </div>
            
            <div class="performance-indicator">
              <span class="indicator-label">GPU</span>
              <div class="progress-container">
                <div class="progress-bar" style="width: {$gpuProgress}%; background: {getScoreColor($gpuProgress)}"></div>
              </div>
            </div>
            
            <div class="performance-indicator">
              <span class="indicator-label">RAM</span>
              <div class="progress-container">
                <div class="progress-bar" style="width: {$ramProgress}%; background: {getScoreColor($ramProgress)}"></div>
              </div>
            </div>
            
            <div class="performance-indicator">
              <span class="indicator-label">Storage</span>
              <div class="progress-container">
                <div class="progress-bar" style="width: {$storageProgress}%; background: {getScoreColor($storageProgress)}"></div>
              </div>
            </div>
          </div>
        </div>
        
        
        <div class="model-legend">
          <div class="legend-item">
            <div class="legend-color" style="background: #28a745;"></div>
            <span>Excellent (80-100)</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: #5cb85c;"></div>
            <span>Very Good (60-79)</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: #ffc107;"></div>
            <span>Good (40-59)</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: #fd7e14;"></div>
            <span>Fair (20-39)</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: #dc3545;"></div>
            <span>Basic (0-19)</span>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <div class="simulator-grid">
    <div class="component-section">
      <h2>PC Components</h2>
      
      <div class="component-cards">
        <div class="component-card">
          <h3>CPU</h3>
          <div class="component-info">
            <div class="component-details">
              <p><strong>{components.cpu.name}</strong></p>
              <p>Cores: {components.cpu.cores} | Threads: {components.cpu.threads}</p>
              <p>Base Clock: {components.cpu.baseClock} | Boost: {components.cpu.boostClock}</p>
              <p>TDP: {components.cpu.tdp}W | Price: ${components.cpu.price}</p>
              <div class="benchmark-info">
                <p>Cinebench R23: <span class="score-value" style="color: {getScoreColor(components.cpu.cinebenchR23, referenceValues.cinebenchR23)}">{components.cpu.cinebenchR23}</span></p>
                <p>CPU Mark: <span class="score-value" style="color: {getScoreColor(components.cpu.cpuMark, referenceValues.cpuMark)}">{components.cpu.cpuMark}</span></p>
              </div>
            </div>
            <div class="component-selector">
              <label for="cpu-select">Select CPU</label>
              <select id="cpu-select" bind:value={selectedComponents.cpu} on:change={() => updateComponent('cpu', selectedComponents.cpu)}>
                {#each componentOptions.cpu as cpu, i}
                  <option value={i}>{cpu.name}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>

        <div class="component-card">
          <h3>RAM</h3>
          <div class="component-info">
            <div class="component-details">
              <p><strong>{components.ram.name}</strong></p>
              <p>Capacity: {components.ram.capacity} | Type: {components.ram.type}</p>
              <p>Speed: {components.ram.speed} | Timings: {components.ram.timing}</p>
              <p>Price: ${components.ram.price}</p>
              <div class="benchmark-info">
                <p>AIDA64 Memory Read: <span class="score-value" style="color: {getScoreColor(components.ram.aida64, referenceValues.aida64)}">{components.ram.aida64} MB/s</span></p>
              </div>
            </div>
            <div class="component-selector">
              <label for="ram-select">Select RAM</label>
              <select id="ram-select" bind:value={selectedComponents.ram} on:change={() => updateComponent('ram', selectedComponents.ram)}>
                {#each componentOptions.ram as ram, i}
                  <option value={i}>{ram.name}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>

        <div class="component-card">
          <h3>Graphics Card</h3>
          <div class="component-info">
            <div class="component-details">
              <p><strong>{components.gpu.name}</strong></p>
              <p>Memory: {components.gpu.memory} | Boost: {components.gpu.boost}</p>
              <p>TDP: {components.gpu.tdp}W | Price: ${components.gpu.price}</p>
              <div class="benchmark-info">
                <p>Gaming FPS (1440p): <span class="score-value" style="color: {getScoreColor(components.gpu.gamingFPS, referenceValues.gamingFPS)}">{components.gpu.gamingFPS} FPS</span></p>
                <p>3DMark Time Spy: <span class="score-value" style="color: {getScoreColor(components.gpu.timespy, referenceValues.timespy)}">{components.gpu.timespy}</span></p>
                {#if components.gpu.portRoyal > 0}
                  <p>Port Royal (Ray Tracing): <span class="score-value" style="color: {getScoreColor(components.gpu.portRoyal, referenceValues.portRoyal)}">{components.gpu.portRoyal}</span></p>
                {/if}
              </div>
            </div>
            <div class="component-selector">
              <label for="gpu-select">Select GPU</label>
              <select id="gpu-select" bind:value={selectedComponents.gpu} on:change={() => updateComponent('gpu', selectedComponents.gpu)}>
                {#each componentOptions.gpu as gpu, i}
                  <option value={i}>{gpu.name}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>

        <div class="component-card">
          <h3>Storage</h3>
          <div class="component-info">
            <div class="component-details">
              <p><strong>{components.storage.name}</strong></p>
              <p>Capacity: {components.storage.capacity} | Type: {components.storage.type}</p>
              <p>Form Factor: {components.storage.form} | Price: ${components.storage.price}</p>
              <div class="benchmark-info">
                <p>Read: <span class="score-value" style="color: {getScoreColor(parseFloat(components.storage.readSpeed), 8000)}">{components.storage.readSpeed}</span></p>
                <p>Write: <span class="score-value" style="color: {getScoreColor(parseFloat(components.storage.writeSpeed), 7000)}">{components.storage.writeSpeed}</span></p>
              </div>
            </div>
            <div class="component-selector">
              <label for="storage-select">Select Storage</label>
              <select id="storage-select" bind:value={selectedComponents.storage} on:change={() => updateComponent('storage', selectedComponents.storage)}>
                {#each componentOptions.storage as storage, i}
                  <option value={i}>{storage.name}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="performance-section">
      <h2>Performance Analysis</h2>
      
      <div class="benchmarks-section">
        <h3>PC Benchmark Scores</h3>
        <div class="benchmarks-grid">
          <div class="benchmark-card">
            <h4>Gaming</h4>
            <div class="score-circle" style="background: {getScoreGradient($gamingScoreAnimation)}">
              <span class="score-number" style="color: {getScoreColor($gamingScoreAnimation)}">{$gamingScoreAnimation.toFixed(0)}</span>
            </div>
            <p>{getPerformanceLabel($gamingScoreAnimation)}</p>
          </div>
          
          <div class="benchmark-card">
            <h4>Productivity</h4>
            <div class="score-circle" style="background: {getScoreGradient($productivityScoreAnimation)}">
              <span class="score-number" style="color: {getScoreColor($productivityScoreAnimation)}">{$productivityScoreAnimation.toFixed(0)}</span>
            </div>
            <p>{getPerformanceLabel($productivityScoreAnimation)}</p>
          </div>
          
          <div class="benchmark-card">
            <h4>Multitasking</h4>
            <div class="score-circle" style="background: {getScoreGradient($multitaskingScoreAnimation)}">
              <span class="score-number" style="color: {getScoreColor($multitaskingScoreAnimation)}">{$multitaskingScoreAnimation.toFixed(0)}</span>
            </div>
            <p>{getPerformanceLabel($multitaskingScoreAnimation)}</p>
          </div>
          
          <div class="benchmark-card overall">
            <h4>Overall Performance</h4>
            <div class="score-circle large" style="background: {getScoreGradient($overallScoreAnimation)}">
              <span class="score-number" style="color: {getScoreColor($overallScoreAnimation)}">{$overallScoreAnimation.toFixed(0)}</span>
            </div>
            <p>{getPerformanceLabel($overallScoreAnimation)}</p>
          </div>
        </div>
      </div>
      
      <div class="system-info">
        <h3>System Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Total Price:</span>
            <span class="info-value">${performance.totalPrice}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Power Consumption:</span>
            <span class="info-value">{performance.powerConsumption}W</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Recommended PSU:</span>
            <span class="info-value">{Math.ceil((performance.powerConsumption * 1.5) / 100) * 100}W</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .page-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    /*font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;*/
  }
  
  h1 {
    text-align: center;
    margin-bottom: 0.5rem;
    color: #ffffff;
    font-size: 2.5rem;
  }  
  .intro-text {
    text-align: center;
    max-width: 600px;
    margin: 0 auto 2rem;
    color: #888;
    font-size: 1.1rem;
  }
  
  .model-section {
    margin-bottom: 3rem;
    background: #f8f9fa;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  
  .model-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .three-js-container {
    width: 100%;
    height: 450px;
    position: relative;
    background-color: #f0f2f5;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .three-js-container canvas {
    width: 100%;
    height: 100%;
    outline: none;
  }
  
  .model-controls {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    gap: 0.5rem;
    z-index: 10;
  }
  
  .model-button {
    padding: 0.5rem 1rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
  }
  
  .model-button:hover {
    background: #0069d9;
  }
  
  .model-settings {
    width: 100%;
    max-width: 600px;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    margin: 1rem 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    z-index: 10;
  }
  
  .loading-text {
    margin-bottom: 1rem;
    font-size: 1.1rem;
    color: #333;
  }
  
  .loading-error {
    margin-top: 1rem;
    color: #dc3545;
    font-size: 0.9rem;
  }
  
  .loading-bar-container {
    width: 80%;
    height: 8px;
    background: #e9ecef;
    border-radius: 4px;
    margin: 0 auto;
    overflow: hidden;
  }
  
  .loading-bar {
    height: 100%;
    background: #007bff;
    width: 0%;
    transition: width 0.3s;
  }
  
  .model-overlay {
    position: absolute;
    bottom: 10px;
    left: 10px;
    width: 300px;
    background: rgba(255, 255, 255, 0.9);
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    z-index: 1;
    transition: opacity 0.3s;
  }
  
  .hidden {
    opacity: 0;
    pointer-events: none;
  }
  
  .performance-indicator {
    margin-bottom: 0.8rem;
    display: flex;
    flex-direction: column;
  }
  
  .indicator-label {
    font-weight: 600;
    margin-bottom: 0.3rem;
    font-size: 0.9rem;
    color: #333;
  }
  
  .progress-container {
    width: 100%;
    height: 10px;
    background-color: #e9ecef;
    border-radius: 5px;
    overflow: hidden;
  }
  
  .progress-bar {
    height: 100%;
    transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1), background 0.8s;
  }
  
  .model-legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #333;
  }
  
  .legend-color {
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }
  
  .simulator-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  .component-section, .performance-section {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: #333;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 0.5rem;
  }
  
  h3 {
    font-size: 1.4rem;
    color: #333;
    margin-bottom: 1rem;
  }
  
  .component-cards {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .component-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.2rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .component-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.05);
  }
  
  .component-card h3 {
    margin-top: 0;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .component-info {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
  
  .component-details {
    flex: 2;
  }
  
  .component-details p {
    margin: 0.4rem 0;
    color: #555;
  }
  
  .component-details p:first-child {
    color: #333;
  }
  
  .benchmark-info {
    margin-top: 0.8rem;
    padding-top: 0.8rem;
    border-top: 1px dashed #e0e0e0;
  }
  
  .score-value {
    font-weight: 600;
  }
  
  .component-selector {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .component-selector label {
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  select {
    padding: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    width: 100%;
    background-color: white;
    cursor: pointer;
  }
  
  .benchmarks-section {
    margin-bottom: 2rem;
  }
  
  .benchmarks-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .benchmark-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1.2rem;
    text-align: center;
    transition: transform 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .benchmark-card:hover {
    transform: translateY(-3px);
  }
  
  .benchmark-card.overall {
    background: #f0f7ff;
    grid-column: span 2;
  }
  
  .benchmark-card h4 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #555;
    font-size: 1.1rem;
  }
  
  .score-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.8rem;
    position: relative;
    box-shadow: inset 0 0 8px rgba(0,0,0,0.1);
  }
  
  .score-circle::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    background: white;
    border-radius: 50%;
    z-index: 1;
  }
  
  .score-circle.large {
    width: 150px;
    height: 150px;
  }
  
  .score-number {
    position: relative;
    z-index: 2;
    font-size: 2.5rem;
    font-weight: 700;
  }
  
  .score-circle.large .score-number {
    font-size: 3rem;
  }
  
  .benchmark-card p {
    margin: 0;
    color: #666;
    font-weight: 500;
  }
  
  .system-info {
    background: #f8f9fa;
    padding: 1.2rem;
    border-radius: 8px;
    margin-top: 1.5rem;
  }
  
  .system-info h3 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  
  .info-item {
    text-align: center;
    padding: 0.8rem;
    background: white;
    border-radius: 6px;
  }
  
  .info-label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
    font-size: 0.9rem;
  }
  
  .info-value {
    font-size: 1.4rem;
    font-weight: 600;
    color: #333;
  }
  
  /* Responsive design */
  @media (max-width: 1024px) {
    .simulator-grid {
      grid-template-columns: 1fr;
    }
    
    .info-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
  
  @media (max-width: 768px) {
    .component-info {
      flex-direction: column;
    }
    
    .benchmarks-grid {
      grid-template-columns: 1fr;
    }
    
    .benchmark-card.overall {
      grid-column: span 1;
    }
    
    .info-grid {
      grid-template-columns: 1fr;
    }
    
    .model-legend {
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
    
    .model-overlay {
      width: calc(100% - 20px);
    }
  }

  .help-button {
    position: absolute;
    top: 100px;
    right: 5px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(45deg, #ff6b6b, #ee5a52);
    color: white;
    border: none;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
    transition: all 0.3s ease;
    z-index: 100;
  }

  .help-button:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  }

  .popup:focus-within {
    outline: none;
  }

  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .popup-content {
    background: white;
    padding: 40px;
    border-radius: 20px;
    max-width: 500px;
    width: 90%;
    position: relative;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    animation: popupSlide 0.3s ease-out;
  }

  @keyframes popupSlide {
    from {
      opacity: 0;
      transform: translateY(-50px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .popup-close {
    position: absolute;
    top: 15px;
    right: 20px;
    background: none;
    border: none;
    font-size: 30px;
    cursor: pointer;
    color: #999;
    transition: color 0.3s ease;
  }

  .popup-close:hover {
    color: #333;
  }

  .popup h2 {
    color: #333;
    margin-bottom: 20px;
    font-size: 24px;
    border: none;
  }

  .popup p {
    color: #666;
    line-height: 1.6;
    font-size: 16px;
    text-align: left;
  }

</style>