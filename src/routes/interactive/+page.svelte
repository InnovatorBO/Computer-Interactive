<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
  
  let title = 'Computer Performance Simulator';
  let canvasContainer: HTMLDivElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let controls: any;
  let pcCase: THREE.Group;
  let cpuModel: THREE.Mesh;
  let gpuModel: THREE.Mesh;
  let ramModel: THREE.Mesh;
  let storageModel: THREE.Mesh;
  let isBrowser = browser;
  
  // Initialize Three.js 3D scene
  onMount(async () => {
    if (typeof window !== 'undefined' && canvasContainer) {
      await initThreeJS();
      calculatePerformance();
    }
  });

  async function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasContainer.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create PC case
    createPCCase();
    await loadRealisticModels();

    // Animation loop
    animate();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
  }

  function createPCCase() {
    pcCase = new THREE.Group();

    // Create a more realistic PC case with better proportions
    const caseGeometry = new THREE.BoxGeometry(4, 3, 2);
    const caseMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2c3e50,
      metalness: 0.3,
      roughness: 0.7
    });
    const caseMesh = new THREE.Mesh(caseGeometry, caseMaterial);
    caseMesh.castShadow = true;
    caseMesh.receiveShadow = true;
    pcCase.add(caseMesh);

    // Add front panel with mesh vents
    const frontPanelGeometry = new THREE.PlaneGeometry(3.8, 2.8);
    const frontMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x34495e,
      metalness: 0.2,
      roughness: 0.8
    });
    const frontPanel = new THREE.Mesh(frontPanelGeometry, frontMaterial);
    frontPanel.position.set(0, 0, 1.1);
    pcCase.add(frontPanel);

    // Add mesh vents to front panel
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        const ventGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.05);
        const ventMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x1a1a1a,
          metalness: 0.1,
          roughness: 0.9
        });
        const vent = new THREE.Mesh(ventGeometry, ventMaterial);
        vent.position.set(-1.5 + i * 0.6, -1 + j * 0.6, 1.15);
        pcCase.add(vent);
      }
    }

    // Add side panel with window
    const sideGeometry = new THREE.PlaneGeometry(2, 3);
    const sideMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x34495e, 
      transparent: true, 
      opacity: 0.3,
      metalness: 0.1,
      roughness: 0.9
    });
    const sideMesh = new THREE.Mesh(sideGeometry, sideMaterial);
    sideMesh.position.set(2.1, 0, 0);
    pcCase.add(sideMesh);

    // Add back panel with I/O ports
    const backPanelGeometry = new THREE.PlaneGeometry(3.8, 2.8);
    const backMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x34495e,
      metalness: 0.2,
      roughness: 0.8
    });
    const backPanel = new THREE.Mesh(backPanelGeometry, backMaterial);
    backPanel.position.set(0, 0, -1.1);
    pcCase.add(backPanel);

    // Add I/O ports to back panel
    const ioPortGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.05);
    const ioMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      metalness: 0.1,
      roughness: 0.9
    });
    for (let i = 0; i < 8; i++) {
      const ioPort = new THREE.Mesh(ioPortGeometry, ioMaterial);
      ioPort.position.set(-1.5 + i * 0.4, 1, -1.15);
      pcCase.add(ioPort);
    }

    // Add power button
    const powerButtonGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 8);
    const powerButtonMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x27ae60,
      metalness: 0.5,
      roughness: 0.5
    });
    const powerButton = new THREE.Mesh(powerButtonGeometry, powerButtonMaterial);
    powerButton.position.set(-1.5, 1.2, 1.15);
    powerButton.rotation.x = Math.PI / 2;
    pcCase.add(powerButton);

    scene.add(pcCase);
  }

  async function loadRealisticModels() {
    try {
      // Create simple but distinctive computer components
      
      // CPU - make it more prominent
      const cpuGeometry = new THREE.BoxGeometry(1.0, 1.0, 0.2);
      const cpuMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ff00, // Bright green
        metalness: 0.8,
        roughness: 0.2
      });
      const cpuMesh = new THREE.Mesh(cpuGeometry, cpuMaterial);
      cpuMesh.position.set(-1, 0.5, 0.5);
      cpuMesh.castShadow = true;
      cpuMesh.receiveShadow = true;
      pcCase.add(cpuMesh);
      cpuModel = cpuMesh;

      // CPU heatsink - make it larger and more visible
      const heatsinkGeometry = new THREE.BoxGeometry(1.2, 1.2, 0.4);
      const heatsinkMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513, // Brown
        metalness: 0.3,
        roughness: 0.7
      });
      const heatsinkMesh = new THREE.Mesh(heatsinkGeometry, heatsinkMaterial);
      heatsinkMesh.position.set(-1, 0.5, 0.9);
      heatsinkMesh.castShadow = true;
      pcCase.add(heatsinkMesh);

      // GPU - make it larger and more prominent
      const gpuGeometry = new THREE.BoxGeometry(3.0, 0.4, 1.5);
      const gpuMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff0000, // Bright red
        metalness: 0.6,
        roughness: 0.4
      });
      const gpuMesh = new THREE.Mesh(gpuGeometry, gpuMaterial);
      gpuMesh.position.set(0, -0.5, 0.5);
      gpuMesh.castShadow = true;
      gpuMesh.receiveShadow = true;
      pcCase.add(gpuMesh);
      gpuModel = gpuMesh;

      // GPU fans - make them more visible
      const fanGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 8);
      const fanMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2c3e50,
        metalness: 0.8,
        roughness: 0.2
      });
      for (let i = 0; i < 2; i++) {
        const fan = new THREE.Mesh(fanGeometry, fanMaterial);
        fan.position.set(-0.8 + i * 1.2, -0.5, 0.3);
        fan.rotation.x = Math.PI / 2;
        fan.castShadow = true;
        pcCase.add(fan);
      }

      // RAM - make it taller and more visible
      const ramGeometry = new THREE.BoxGeometry(0.4, 2.0, 0.15);
      const ramMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x0000ff, // Bright blue
        metalness: 0.4,
        roughness: 0.6
      });
      const ramMesh = new THREE.Mesh(ramGeometry, ramMaterial);
      ramMesh.position.set(-1.8, 0, 0.5);
      ramMesh.castShadow = true;
      ramMesh.receiveShadow = true;
      pcCase.add(ramMesh);
      ramModel = ramMesh;

      // Second RAM stick
      const ram2Mesh = new THREE.Mesh(ramGeometry, ramMaterial);
      ram2Mesh.position.set(-1.4, 0, 0.5);
      ram2Mesh.castShadow = true;
      pcCase.add(ram2Mesh);

      // Storage - make it larger and more visible
      const storageGeometry = new THREE.BoxGeometry(2.0, 0.15, 1.0);
      const storageMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffff00, // Bright yellow
        metalness: 0.5,
        roughness: 0.5
      });
      const storageMesh = new THREE.Mesh(storageGeometry, storageMaterial);
      storageMesh.position.set(0, 1.2, 0.5);
      storageMesh.castShadow = true;
      storageMesh.receiveShadow = true;
      pcCase.add(storageMesh);
      storageModel = storageMesh;

      // Power supply - make it more visible
      const psuGeometry = new THREE.BoxGeometry(1.5, 1.0, 2.0);
      const psuMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x7f8c8d,
        metalness: 0.7,
        roughness: 0.3
      });
      const psuMesh = new THREE.Mesh(psuGeometry, psuMaterial);
      psuMesh.position.set(-2.2, -0.8, 0);
      psuMesh.castShadow = true;
      pcCase.add(psuMesh);

      // Motherboard - make it larger
      const motherboardGeometry = new THREE.BoxGeometry(4.0, 0.15, 3.0);
      const motherboardMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x34495e,
        metalness: 0.2,
        roughness: 0.8
      });
      const motherboardMesh = new THREE.Mesh(motherboardGeometry, motherboardMaterial);
      motherboardMesh.position.set(0, 0, 0.3);
      motherboardMesh.castShadow = true;
      pcCase.add(motherboardMesh);
      
    } catch (error) {
      console.error('Failed to create realistic models:', error);
      // Fallback to basic geometric shapes
      createFallbackModels();
    }
  }

  function createFallbackModels() {
    // CPU with heatsink - make it larger
    const cpuGeometry = new THREE.BoxGeometry(1.0, 1.0, 0.2);
    const cpuMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x00ff00, // Bright green
      metalness: 0.8,
      roughness: 0.2
    });
    const cpuMesh = new THREE.Mesh(cpuGeometry, cpuMaterial);
    cpuMesh.position.set(-1, 0.5, 0.5);
    cpuMesh.castShadow = true;
    cpuMesh.receiveShadow = true;
    pcCase.add(cpuMesh);
    cpuModel = cpuMesh;

    // CPU heatsink
    const heatsinkGeometry = new THREE.BoxGeometry(1.2, 1.2, 0.4);
    const heatsinkMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513,
      metalness: 0.3,
      roughness: 0.7
    });
    const heatsinkMesh = new THREE.Mesh(heatsinkGeometry, heatsinkMaterial);
    heatsinkMesh.position.set(-1, 0.5, 0.9);
    heatsinkMesh.castShadow = true;
    pcCase.add(heatsinkMesh);

    // GPU with PCB - make it larger
    const gpuGeometry = new THREE.BoxGeometry(3.0, 0.4, 1.5);
    const gpuMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff0000, // Bright red
      metalness: 0.6,
      roughness: 0.4
    });
    const gpuMesh = new THREE.Mesh(gpuGeometry, gpuMaterial);
    gpuMesh.position.set(0, -0.5, 0.5);
    gpuMesh.castShadow = true;
    gpuMesh.receiveShadow = true;
    pcCase.add(gpuMesh);
    gpuModel = gpuMesh;

    // GPU PCB
    const gpuPcbGeometry = new THREE.BoxGeometry(2.8, 0.1, 1.3);
    const gpuPcbMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2c3e50,
      metalness: 0.2,
      roughness: 0.8
    });
    const gpuPcb = new THREE.Mesh(gpuPcbGeometry, gpuPcbMaterial);
    gpuPcb.position.set(0, -0.5, 0.5);
    pcCase.add(gpuPcb);

    // RAM sticks - make them taller
    const ramGeometry = new THREE.BoxGeometry(0.4, 2.0, 0.15);
    const ramMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0000ff, // Bright blue
      metalness: 0.4,
      roughness: 0.6
    });
    const ramMesh = new THREE.Mesh(ramGeometry, ramMaterial);
    ramMesh.position.set(-1.8, 0, 0.5);
    ramMesh.castShadow = true;
    ramMesh.receiveShadow = true;
    pcCase.add(ramMesh);
    ramModel = ramMesh;

    // Second RAM stick
    const ram2Mesh = new THREE.Mesh(ramGeometry, ramMaterial);
    ram2Mesh.position.set(-1.4, 0, 0.5);
    ram2Mesh.castShadow = true;
    pcCase.add(ram2Mesh);

    // Storage drive - make it larger
    const storageGeometry = new THREE.BoxGeometry(2.0, 0.15, 1.0);
    const storageMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffff00, // Bright yellow
      metalness: 0.5,
      roughness: 0.5
    });
    const storageMesh = new THREE.Mesh(storageGeometry, storageMaterial);
    storageMesh.position.set(0, 1.2, 0.5);
    storageMesh.castShadow = true;
    storageMesh.receiveShadow = true;
    pcCase.add(storageMesh);
    storageModel = storageMesh;

    // Power supply - make it larger
    const psuGeometry = new THREE.BoxGeometry(1.5, 1.0, 2.0);
    const psuMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x7f8c8d,
      metalness: 0.7,
      roughness: 0.3
    });
    const psuMesh = new THREE.Mesh(psuGeometry, psuMaterial);
    psuMesh.position.set(-2.2, -0.8, 0);
    psuMesh.castShadow = true;
    pcCase.add(psuMesh);

    // Motherboard - make it larger
    const motherboardGeometry = new THREE.BoxGeometry(4.0, 0.15, 3.0);
    const motherboardMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x34495e,
      metalness: 0.2,
      roughness: 0.8
    });
    const motherboardMesh = new THREE.Mesh(motherboardGeometry, motherboardMaterial);
    motherboardMesh.position.set(0, 0, 0.3);
    motherboardMesh.castShadow = true;
    pcCase.add(motherboardMesh);
  }



  function updateComponentModel(type: string) {
    if (!scene) return;

    let model: THREE.Mesh;
    let color: string;

    switch (type) {
      case 'cpu':
        if (cpuModel) {
          color = getScoreColor(components.cpu.cinebenchR23, 15000);
          (cpuModel.material as THREE.MeshStandardMaterial).color.setHex(parseInt(color.replace('#', ''), 16));
        }
        break;
      case 'gpu':
        if (gpuModel) {
          color = getScoreColor(components.gpu.gamingFPS, 160);
          (gpuModel.material as THREE.MeshStandardMaterial).color.setHex(parseInt(color.replace('#', ''), 16));
        }
        break;
      case 'ram':
        if (ramModel) {
          color = getScoreColor(components.ram.aida64, 58000);
          (ramModel.material as THREE.MeshStandardMaterial).color.setHex(parseInt(color.replace('#', ''), 16));
        }
        break;
      case 'storage':
        if (storageModel) {
          color = getScoreColor(components.storage.crystalDiskMark, 7000);
          (storageModel.material as THREE.MeshStandardMaterial).color.setHex(parseInt(color.replace('#', ''), 16));
        }
        break;
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    if (pcCase) {
      pcCase.rotation.y += 0.01;
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function onWindowResize() {
    if (camera && renderer && canvasContainer) {
      camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    }
  }

  // Hardware components with their specifications and real benchmark data
  let components = {
    cpu: {
      name: 'Intel Core i5-10400',
      cores: 6,
      threads: 12,
      baseSpeed: 2.9,
      boostSpeed: 4.3,
      cache: 12,
      tdp: 65,
      price: 180,
      // Real benchmark scores
      cinebenchR23: 8500,
      geekbench5: 12000,
      passmark: 15000
    },
    ram: {
      name: 'DDR4-3200',
      capacity: 16,
      speed: 3200,
      channels: 2,
      price: 80,
      // Real benchmark scores
      aida64: 45000,
      latency: 70
    },
    gpu: {
      name: 'NVIDIA GTX 1660 Super',
      vram: 6,
      cores: 1408,
      boostSpeed: 1.78,
      memorySpeed: 14000,
      price: 250,
      // Real benchmark scores
      timespy: 5500,
      firestrike: 15000,
      portRoyal: 0, // Not supported
      gamingFPS: 85 // Average FPS in modern games at 1080p
    },
    storage: {
      name: 'Samsung 970 EVO',
      capacity: 500,
      type: 'NVMe SSD',
      readSpeed: 3500,
      writeSpeed: 3300,
      price: 70,
      // Real benchmark scores
      crystalDiskMark: 3500,
      asSSD: 2800
    }
  };

  // Performance metrics
  let performance = {
    gamingScore: 0,
    productivityScore: 0,
    multitaskingScore: 0,
    overallScore: 0,
    powerConsumption: 0,
    totalPrice: 0,
    // Real benchmark results
    realBenchmarks: {
      timespy: 0,
      cinebench: 0,
      gamingFPS: 0,
      bootTime: 0
    }
  };

  // Available component options with real benchmark data
  let componentOptions = {
    cpu: [
      { 
        name: 'Intel Core i3-10100', 
        cores: 4, threads: 8, baseSpeed: 3.6, boostSpeed: 4.3, cache: 6, tdp: 65, price: 120,
        cinebenchR23: 5500, geekbench5: 8500, passmark: 10000
      },
      { 
        name: 'Intel Core i5-10400', 
        cores: 6, threads: 12, baseSpeed: 2.9, boostSpeed: 4.3, cache: 12, tdp: 65, price: 180,
        cinebenchR23: 8500, geekbench5: 12000, passmark: 15000
      },
      { 
        name: 'Intel Core i7-10700', 
        cores: 8, threads: 16, baseSpeed: 2.9, boostSpeed: 4.8, cache: 16, tdp: 65, price: 300,
        cinebenchR23: 12000, geekbench5: 16000, passmark: 22000
      },
      { 
        name: 'Intel Core i9-10900', 
        cores: 10, threads: 20, baseSpeed: 2.8, boostSpeed: 5.2, cache: 20, tdp: 65, price: 450,
        cinebenchR23: 15000, geekbench5: 20000, passmark: 28000
      },
      { 
        name: 'AMD Ryzen 5 3600', 
        cores: 6, threads: 12, baseSpeed: 3.6, boostSpeed: 4.2, cache: 35, tdp: 65, price: 200,
        cinebenchR23: 9500, geekbench5: 13000, passmark: 17000
      },
      { 
        name: 'AMD Ryzen 7 3700X', 
        cores: 8, threads: 16, baseSpeed: 3.6, boostSpeed: 4.4, cache: 36, tdp: 65, price: 320,
        cinebenchR23: 13000, geekbench5: 18000, passmark: 24000
      }
    ],
    ram: [
      { 
        name: 'DDR4-2400', capacity: 8, speed: 2400, channels: 1, price: 40,
        aida64: 18000, latency: 85
      },
      { 
        name: 'DDR4-2666', capacity: 8, speed: 2666, channels: 1, price: 45,
        aida64: 20000, latency: 80
      },
      { 
        name: 'DDR4-3200', capacity: 16, speed: 3200, channels: 2, price: 80,
        aida64: 45000, latency: 70
      },
      { 
        name: 'DDR4-3600', capacity: 16, speed: 3600, channels: 2, price: 95,
        aida64: 52000, latency: 65
      },
      { 
        name: 'DDR4-4000', capacity: 32, speed: 4000, channels: 2, price: 180,
        aida64: 58000, latency: 60
      }
    ],
    gpu: [
      { 
        name: 'NVIDIA GTX 1650', vram: 4, cores: 896, boostSpeed: 1.66, memorySpeed: 8000, price: 150,
        timespy: 3500, firestrike: 9500, portRoyal: 0, gamingFPS: 55
      },
      { 
        name: 'NVIDIA GTX 1660 Super', vram: 6, cores: 1408, boostSpeed: 1.78, memorySpeed: 14000, price: 250,
        timespy: 5500, firestrike: 15000, portRoyal: 0, gamingFPS: 85
      },
      { 
        name: 'NVIDIA RTX 3060', vram: 12, cores: 3584, boostSpeed: 1.78, memorySpeed: 15000, price: 400,
        timespy: 8500, firestrike: 22000, portRoyal: 4500, gamingFPS: 120
      },
      { 
        name: 'NVIDIA RTX 3070', vram: 8, cores: 5888, boostSpeed: 1.73, memorySpeed: 14000, price: 600,
        timespy: 12000, firestrike: 30000, portRoyal: 7500, gamingFPS: 160
      },
      { 
        name: 'AMD RX 5600 XT', vram: 6, cores: 2304, boostSpeed: 1.56, memorySpeed: 14000, price: 280,
        timespy: 7000, firestrike: 18000, portRoyal: 0, gamingFPS: 100
      },
      { 
        name: 'AMD RX 6700 XT', vram: 12, cores: 2560, boostSpeed: 2.42, memorySpeed: 16000, price: 500,
        timespy: 11000, firestrike: 28000, portRoyal: 6500, gamingFPS: 140
      }
    ],
    storage: [
      { 
        name: 'WD Blue HDD', capacity: 1000, type: 'HDD', readSpeed: 150, writeSpeed: 150, price: 45,
        crystalDiskMark: 150, asSSD: 120, bootTime: 45
      },
      { 
        name: 'Samsung 860 EVO', capacity: 500, type: 'SATA SSD', readSpeed: 550, writeSpeed: 520, price: 60,
        crystalDiskMark: 550, asSSD: 480, bootTime: 15
      },
      { 
        name: 'Samsung 970 EVO', capacity: 500, type: 'NVMe SSD', readSpeed: 3500, writeSpeed: 3300, price: 70,
        crystalDiskMark: 3500, asSSD: 2800, bootTime: 8
      },
      { 
        name: 'Samsung 980 Pro', capacity: 1000, type: 'NVMe SSD', readSpeed: 7000, writeSpeed: 5100, price: 150,
        crystalDiskMark: 7000, asSSD: 5500, bootTime: 5
      }
    ]
  };

  // Selected component indices
  let selectedComponents = {
    cpu: 1,
    ram: 2,
    gpu: 1,
    storage: 2
  };

  // Calculate performance metrics using real benchmark data
  function calculatePerformance() {
    const cpu = componentOptions.cpu[selectedComponents.cpu];
    const ram = componentOptions.ram[selectedComponents.ram];
    const gpu = componentOptions.gpu[selectedComponents.gpu];
    const storage = componentOptions.storage[selectedComponents.storage];

    // Real benchmark calculations
    performance.realBenchmarks.timespy = Math.round(
      (gpu.timespy * 0.7) + (cpu.geekbench5 * 0.01 * 0.3)
    );

    performance.realBenchmarks.cinebench = cpu.cinebenchR23;

    performance.realBenchmarks.gamingFPS = Math.round(
      gpu.gamingFPS * (ram.aida64 / 45000) * (storage.bootTime / 8)
    );

    performance.realBenchmarks.bootTime = Math.round(
      storage.bootTime + (ram.latency * 0.1)
    );

    // Gaming score based on real benchmarks
    performance.gamingScore = Math.round(
      (performance.realBenchmarks.timespy * 0.5) +
      (performance.realBenchmarks.gamingFPS * 0.4) +
      (ram.aida64 * 0.001 * 0.1)
    );

    // Productivity score based on real benchmarks
    performance.productivityScore = Math.round(
      (cpu.cinebenchR23 * 0.6) +
      (ram.aida64 * 0.001 * 0.3) +
      (storage.crystalDiskMark * 0.01 * 0.1)
    );

    // Multitasking score based on real benchmarks
    performance.multitaskingScore = Math.round(
      (ram.aida64 * 0.001 * 0.5) +
      (cpu.passmark * 0.001 * 0.4) +
      (storage.crystalDiskMark * 0.01 * 0.1)
    );

    // Overall score
    performance.overallScore = Math.round(
      (performance.gamingScore * 0.4) +
      (performance.productivityScore * 0.35) +
      (performance.multitaskingScore * 0.25)
    );

    // Power consumption
    performance.powerConsumption = Math.round(
      cpu.tdp + (gpu.cores * 0.1) + (ram.capacity * 0.5)
    );

    // Total price
    performance.totalPrice = cpu.price + ram.price + gpu.price + storage.price;

    // Update 3D models - now handled client-side in onMount
  }

  // Update components when selection changes
  function updateComponent(type: string, index: number) {
    selectedComponents[type] = index;
    components[type] = componentOptions[type][index];
    calculatePerformance();
    updateComponentModel(type);
  }

  // Initialize performance calculation
  calculatePerformance();

  // Get performance color based on score
  function getScoreColor(score: number, maxScore: number = 1000) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return '#28a745';
    if (percentage >= 60) return '#ffc107';
    if (percentage >= 40) return '#fd7e14';
    return '#dc3545';
  }

  // Get performance label
  function getPerformanceLabel(score: number, maxScore: number = 1000) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Fair';
    return 'Poor';
  }

  // Get benchmark description
  function getBenchmarkDescription(benchmark: string) {
    const descriptions = {
      timespy: '3DMark Time Spy - GPU and CPU gaming performance',
      cinebench: 'Cinebench R23 - CPU rendering performance',
      gamingFPS: 'Average FPS in modern games at 1080p',
      bootTime: 'System boot time in seconds'
    };
    return descriptions[benchmark] || '';
  }


</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="page-container">
  <h1>{title}</h1>
  <p>Adjust hardware components to see how they affect your computer's performance!</p>

  <!-- 3D Interactive Model using model-viewer -->
  <div class="model-section">
    <h2>3D Interactive PC Model</h2>
    <p>Professional 3D visualization using JSCAD modeling and model-viewer display!</p>
    <div class="model-container">
      <div class="three-js-container" bind:this={canvasContainer}>
        <div class="model-overlay">
          <div class="performance-indicator cpu-indicator">
            <span class="indicator-label">CPU</span>
            <div class="indicator-bar" style="background: {getScoreColor(components.cpu.cinebenchR23, 15000)}"></div>
          </div>
          <div class="performance-indicator gpu-indicator">
            <span class="indicator-label">GPU</span>
            <div class="indicator-bar" style="background: {getScoreColor(components.gpu.gamingFPS, 160)}"></div>
          </div>
          <div class="performance-indicator ram-indicator">
            <span class="indicator-label">RAM</span>
            <div class="indicator-bar" style="background: {getScoreColor(components.ram.aida64, 58000)}"></div>
          </div>
          <div class="performance-indicator storage-indicator">
            <span class="indicator-label">Storage</span>
            <div class="indicator-bar" style="background: {getScoreColor(components.storage.crystalDiskMark, 7000)}"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="model-legend">
      <div class="legend-item">
        <div class="legend-color" style="background: #28a745;"></div>
        <span>High Performance</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #ffc107;"></div>
        <span>Medium Performance</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #dc3545;"></div>
        <span>Low Performance</span>
      </div>
    </div>
  </div>

  <div class="simulator-grid">
    <!-- Component Selection -->
    <div class="component-section">
      <h2>Hardware Components</h2>
      
      <!-- CPU Selection -->
      <div class="component-card">
        <h3>CPU (Central Processing Unit)</h3>
        <div class="component-info">
          <div class="component-details">
            <p><strong>Selected:</strong> {components.cpu.name}</p>
            <p>Cores: {components.cpu.cores} | Threads: {components.cpu.threads}</p>
            <p>Base Speed: {components.cpu.baseSpeed}GHz | Boost: {components.cpu.boostSpeed}GHz</p>
            <p>Cache: {components.cpu.cache}MB | TDP: {components.cpu.tdp}W</p>
            <p>Price: ${components.cpu.price}</p>
            <p class="benchmark-info">Cinebench R23: {components.cpu.cinebenchR23.toLocaleString()}</p>
            <p class="benchmark-info">Geekbench 5: {components.cpu.geekbench5.toLocaleString()}</p>
          </div>
          <div class="component-selector">
            <label for="cpu-select">Choose CPU:</label>
            <select id="cpu-select" bind:value={selectedComponents.cpu} on:change={() => updateComponent('cpu', selectedComponents.cpu)}>
              {#each componentOptions.cpu as cpu, i}
                <option value={i}>{cpu.name} - ${cpu.price}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>

      <!-- RAM Selection -->
      <div class="component-card">
        <h3>RAM (Random Access Memory)</h3>
        <div class="component-info">
          <div class="component-details">
            <p><strong>Selected:</strong> {components.ram.name}</p>
            <p>Capacity: {components.ram.capacity}GB | Speed: {components.ram.speed}MHz</p>
            <p>Channels: {components.ram.channels}</p>
            <p>Price: ${components.ram.price}</p>
            <p class="benchmark-info">AIDA64 Read: {components.ram.aida64.toLocaleString()} MB/s</p>
            <p class="benchmark-info">Latency: {components.ram.latency}ns</p>
          </div>
          <div class="component-selector">
            <label for="ram-select">Choose RAM:</label>
            <select id="ram-select" bind:value={selectedComponents.ram} on:change={() => updateComponent('ram', selectedComponents.ram)}>
              {#each componentOptions.ram as ram, i}
                <option value={i}>{ram.name} - {ram.capacity}GB - ${ram.price}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>

      <!-- GPU Selection -->
      <div class="component-card">
        <h3>GPU (Graphics Processing Unit)</h3>
        <div class="component-info">
          <div class="component-details">
            <p><strong>Selected:</strong> {components.gpu.name}</p>
            <p>VRAM: {components.gpu.vram}GB | Cores: {components.gpu.cores}</p>
            <p>Boost Speed: {components.gpu.boostSpeed}GHz</p>
            <p>Memory Speed: {components.gpu.memorySpeed}MHz</p>
            <p>Price: ${components.gpu.price}</p>
            <p class="benchmark-info">3DMark Time Spy: {components.gpu.timespy.toLocaleString()}</p>
            <p class="benchmark-info">Gaming FPS: {components.gpu.gamingFPS} FPS</p>
            {#if components.gpu.portRoyal > 0}
              <p class="benchmark-info">Port Royal: {components.gpu.portRoyal.toLocaleString()}</p>
            {/if}
          </div>
          <div class="component-selector">
            <label for="gpu-select">Choose GPU:</label>
            <select id="gpu-select" bind:value={selectedComponents.gpu} on:change={() => updateComponent('gpu', selectedComponents.gpu)}>
              {#each componentOptions.gpu as gpu, i}
                <option value={i}>{gpu.name} - ${gpu.price}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>

      <!-- Storage Selection -->
      <div class="component-card">
        <h3>Storage</h3>
        <div class="component-info">
          <div class="component-details">
            <p><strong>Selected:</strong> {components.storage.name}</p>
            <p>Capacity: {components.storage.capacity}GB | Type: {components.storage.type}</p>
            <p>Read Speed: {components.storage.readSpeed}MB/s</p>
            <p>Write Speed: {components.storage.writeSpeed}MB/s</p>
            <p>Price: ${components.storage.price}</p>
            <p class="benchmark-info">CrystalDiskMark: {components.storage.crystalDiskMark.toLocaleString()} MB/s</p>
            <p class="benchmark-info">AS SSD: {components.storage.asSSD.toLocaleString()} MB/s</p>
          </div>
          <div class="component-selector">
            <label for="storage-select">Choose Storage:</label>
            <select id="storage-select" bind:value={selectedComponents.storage} on:change={() => updateComponent('storage', selectedComponents.storage)}>
              {#each componentOptions.storage as storage, i}
                <option value={i}>{storage.name} - {storage.capacity}GB - ${storage.price}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Results -->
    <div class="performance-section">
      <h2>Performance Analysis</h2>
      
      <!-- Real Benchmark Results -->
      <div class="benchmarks-section">
        <h3>Real Benchmark Results</h3>
        <div class="benchmarks-grid">
          <div class="benchmark-card">
            <h4>3DMark Time Spy</h4>
            <div class="benchmark-score">{performance.realBenchmarks.timespy.toLocaleString()}</div>
            <p>Gaming Performance Score</p>
          </div>
          <div class="benchmark-card">
            <h4>Cinebench R23</h4>
            <div class="benchmark-score">{performance.realBenchmarks.cinebench.toLocaleString()}</div>
            <p>CPU Rendering Performance</p>
          </div>
          <div class="benchmark-card">
            <h4>Gaming FPS</h4>
            <div class="benchmark-score">{performance.realBenchmarks.gamingFPS}</div>
            <p>Average FPS in Modern Games</p>
          </div>
          <div class="benchmark-card">
            <h4>Boot Time</h4>
            <div class="benchmark-score">{performance.realBenchmarks.bootTime}s</div>
            <p>System Startup Time</p>
          </div>
        </div>
      </div>

      <!-- Performance Scores -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="score-display">
            <span class="score" style="color: {getScoreColor(performance.gamingScore, 15000)}">{performance.gamingScore.toLocaleString()}</span>
            <span class="label">Gaming Score</span>
          </div>
          <p>Based on GPU performance, CPU gaming capability, and memory speed</p>
        </div>
        
        <div class="metric-card">
          <div class="score-display">
            <span class="score" style="color: {getScoreColor(performance.productivityScore, 15000)}">{performance.productivityScore.toLocaleString()}</span>
            <span class="label">Productivity Score</span>
          </div>
          <p>Based on CPU rendering, memory bandwidth, and storage speed</p>
        </div>
        
        <div class="metric-card">
          <div class="score-display">
            <span class="score" style="color: {getScoreColor(performance.multitaskingScore, 10000)}">{performance.multitaskingScore.toLocaleString()}</span>
            <span class="label">Multitasking Score</span>
          </div>
          <p>Based on memory capacity, CPU threads, and storage performance</p>
        </div>
        
        <div class="metric-card overall">
          <div class="score-display">
            <span class="score" style="color: {getScoreColor(performance.overallScore, 12000)}">{performance.overallScore.toLocaleString()}</span>
            <span class="label">Overall Performance</span>
          </div>
          <p>Combined score: 40% Gaming + 35% Productivity + 25% Multitasking</p>
        </div>
      </div>

      <!-- System Information -->
      <div class="system-info">
        <h3>System Specifications</h3>
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
            <span class="info-label">Performance Level:</span>
            <span class="info-value">{getPerformanceLabel(performance.overallScore, 12000)}</span>
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
  }

  h1 {
    color: #333;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  p {
    color: #666;
    text-align: center;
    margin-bottom: 2rem;
  }

  .model-section {
    margin-bottom: 3rem;
    text-align: center;
  }

  .model-section h2 {
    color: #495057;
    background: #28a745;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }



  h1 {
    color: #333;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  .model-container {
    width: 100%;
    height: 400px;
    background: #1a1a1a;
    border-radius: 12px;
    margin: 1rem 0;
    overflow: hidden;
    position: relative;
  }

  .three-js-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .three-js-container canvas {
    width: 100% !important;
    height: 100% !important;
  }

  .model-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    color: white;
  }

  .placeholder-content {
    text-align: center;
    padding: 2rem;
  }

  .placeholder-content h3 {
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }

  .placeholder-content p {
    margin-bottom: 1rem;
    opacity: 0.8;
  }

  .performance-overlay {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 1rem;
  }

  .model-overlay {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px;
    border-radius: 8px;
    display: flex;
    gap: 15px;
    z-index: 10;
  }

  .performance-indicator {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .indicator-label {
    font-size: 0.8rem;
    color: #fff;
    font-weight: 500;
  }

  .indicator-bar {
    height: 10px;
    width: 100px;
    border-radius: 5px;
    background: #dc3545; /* Default color */
  }

  .model-legend {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .legend-color {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 2px solid #333;
  }

  /* Model-viewer custom styles */
  model-viewer {
    --poster-color: transparent;
    --progress-bar-color: #007bff;
    --progress-bar-height: 3px;
  }

  model-viewer::part(default-progress-bar) {
    background-color: #007bff;
  }

  model-viewer::part(default-progress-mask) {
    background-color: #007bff;
  }

  .simulator-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .component-section, .performance-section {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid #e9ecef;
  }

  h2 {
    color: #495057;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #007bff;
    padding-bottom: 0.5rem;
  }

  .component-card {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #dee2e6;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  h3 {
    color: #495057;
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
  }

  .component-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    align-items: start;
  }

  .component-details p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: #6c757d;
    text-align: left;
  }

  .component-details p:first-child {
    color: #495057;
    font-weight: 500;
  }

  .benchmark-info {
    color: #007bff !important;
    font-weight: 500 !important;
    font-size: 0.85rem !important;
  }

  .component-selector {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .component-selector label {
    font-weight: 500;
    color: #495057;
  }

  select {
    padding: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    background: white;
    font-size: 0.9rem;
  }

  .benchmarks-section {
    margin-bottom: 2rem;
  }

  .benchmarks-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .benchmark-card {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid #dee2e6;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    text-align: center;
  }

  .benchmark-card h4 {
    color: #495057;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  .benchmark-score {
    font-size: 1.5rem;
    font-weight: bold;
    color: #007bff;

    margin-bottom: 0.5rem;
  }

  .benchmark-card p {
    font-size: 0.8rem;
    color: #6c757d;
    margin: 0;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .metric-card {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid #dee2e6;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .metric-card.overall {
    grid-column: 1 / -1;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: 2px solid #007bff;
  }

  .score-display {
    text-align: center;
    margin: 1rem 0;
  }

  .score {
    display: block;
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 0.25rem;
  }

  .label {
    display: block;
    font-size: 1.1rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .metric-card p {
    font-size: 0.9rem;
    color: #6c757d;
    margin: 0;
    text-align: center;
  }

  .system-info {
    margin-top: 1.5rem;
    background: white;
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid #dee2e6;
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f1f3f4;
  }

  .info-label {
    font-weight: 500;
    color: #495057;
  }

  .info-value {
    font-weight: bold;
    color: #007bff;
  }

  @media (max-width: 768px) {
    .simulator-grid {
      grid-template-columns: 1fr;
    }
    
    .component-info {
      grid-template-columns: 1fr;
    }
    
    .benchmarks-grid {
      grid-template-columns: 1fr;
    }
    
    .metrics-grid {
      grid-template-columns: 1fr;
    }
    
    .info-grid {
      grid-template-columns: 1fr;
    }

    .model-legend {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
