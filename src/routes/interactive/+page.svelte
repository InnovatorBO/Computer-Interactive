<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  let title = 'Computer Performance Simulator';
  let isBrowser = browser;
  
  // Component hover states
  let hoveredComponent = '';
  
  // Component positions for 2D diagram
  const componentPositions = {
    cpu: { x: 200, y: 150, width: 80, height: 60 },
    gpu: { x: 100, y: 250, width: 120, height: 40 },
    ram: { x: 350, y: 100, width: 40, height: 100 },
    storage: { x: 100, y: 350, width: 100, height: 30 },
    motherboard: { x: 150, y: 200, width: 200, height: 120 },
    psu: { x: 400, y: 300, width: 60, height: 80 }
  };

  // Image mapping for component images
  const componentImages = {
    cpu: {
      'Intel Core i3-10100': '/parts/cpu-i3-10100.svg',
      'Intel Core i5-10400': '/parts/cpu-i5-10400.svg',
      'Intel Core i7-10700': '/parts/cpu-i7-10700.svg',
      'Intel Core i9-10900': '/parts/cpu-i9-10900.svg',
      'AMD Ryzen 5 3600': '/parts/cpu-ryzen5-3600.svg',
      'AMD Ryzen 7 3700X': '/parts/cpu-ryzen7-3700x.svg'
    },
    gpu: {
      'NVIDIA GTX 1650': '/parts/gpu-gtx1650.svg',
      'NVIDIA GTX 1660 Super': '/parts/gpu-gtx1660super.svg',
      'NVIDIA RTX 3060': '/parts/gpu-rtx3060.svg',
      'NVIDIA RTX 3070': '/parts/gpu-rtx3070.svg',
      'AMD RX 5600 XT': '/parts/gpu-rx5600xt.svg',
      'AMD RX 6700 XT': '/parts/gpu-rx6700xt.svg'
    },
    ram: {
      'DDR4-2400': '/parts/ram-ddr4-2400.svg',
      'DDR4-2666': '/parts/ram-ddr4-2666.svg',
      'DDR4-3200': '/parts/ram-ddr4-3200.svg',
      'DDR4-3600': '/parts/ram-ddr4-3600.svg',
      'DDR4-4000': '/parts/ram-ddr4-4000.svg'
    },
    storage: {
      'WD Blue HDD': '/parts/storage-wd-blue.svg',
      'Samsung 860 EVO': '/parts/storage-860-evo.svg',
      'Samsung 970 EVO': '/parts/storage-970-evo.svg',
      'Samsung 980 Pro': '/parts/storage-980-pro.svg'
    }
  };

  // Hardware components with specifications
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
      timespy: 5500,
      firestrike: 15000,
      portRoyal: 0,
      gamingFPS: 85
    },
    storage: {
      name: 'Samsung 970 EVO',
      capacity: 500,
      type: 'NVMe SSD',
      readSpeed: 3500,
      writeSpeed: 3300,
      price: 70,
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
    realBenchmarks: {
      timespy: 0,
      cinebench: 0,
      gamingFPS: 0,
      bootTime: 0
    }
  };

  // Available component options
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

  // Calculate performance metrics
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

    // Performance scores
    performance.gamingScore = Math.round(
      (performance.realBenchmarks.timespy * 0.5) +
      (performance.realBenchmarks.gamingFPS * 0.4) +
      (ram.aida64 * 0.001 * 0.1)
    );

    performance.productivityScore = Math.round(
      (cpu.cinebenchR23 * 0.6) +
      (ram.aida64 * 0.001 * 0.3) +
      (storage.crystalDiskMark * 0.01 * 0.1)
    );

    performance.multitaskingScore = Math.round(
      (ram.aida64 * 0.001 * 0.5) +
      (cpu.passmark * 0.001 * 0.4) +
      (storage.crystalDiskMark * 0.01 * 0.1)
    );

    performance.overallScore = Math.round(
      (performance.gamingScore * 0.4) +
      (performance.productivityScore * 0.35) +
      (performance.multitaskingScore * 0.25)
    );

    performance.powerConsumption = Math.round(
      cpu.tdp + (gpu.cores * 0.1) + (ram.capacity * 0.5)
    );

    performance.totalPrice = cpu.price + ram.price + gpu.price + storage.price;
  }

  // Update components when selection changes
  function updateComponent(type: string, index: number) {
    selectedComponents[type] = index;
    components[type] = componentOptions[type][index];
    calculatePerformance();
  }

  // Initialize performance calculation
  onMount(() => {
  calculatePerformance();
  });

  // Budget optimizer variables
  let userBudget = 800;
  let showBudgetOptimizer = false;
  let budgetRecommendations = {
    cpu: null,
    ram: null,
    gpu: null,
    storage: null
  };

  // Utility functions
  function getScoreColor(score: number, maxScore: number = 1000) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return '#28a745';
    if (percentage >= 60) return '#ffc107';
    if (percentage >= 40) return '#fd7e14';
    return '#dc3545';
  }

  function getPerformanceLabel(score: number, maxScore: number = 1000) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Fair';
    return 'Poor';
  }

  function handleComponentHover(component: string) {
    hoveredComponent = component;
  }

  function handleComponentLeave() {
    hoveredComponent = '';
  }

  // Budget optimization functions
  function optimizeForBudget() {
    const budget = userBudget;
    let remainingBudget = budget;
    const recommendations = { cpu: null, ram: null, gpu: null, storage: null };
    
    // Allocate budget: 40% GPU, 30% CPU, 20% RAM, 10% Storage
    const gpuBudget = Math.floor(budget * 0.4);
    const cpuBudget = Math.floor(budget * 0.3);
    const ramBudget = Math.floor(budget * 0.2);
    const storageBudget = Math.floor(budget * 0.1);

    // Find best GPU within budget
    recommendations.gpu = componentOptions.gpu
      .filter(gpu => gpu.price <= gpuBudget)
      .sort((a, b) => (b.timespy / b.price) - (a.timespy / a.price))[0];

    // Find best CPU within budget
    recommendations.cpu = componentOptions.cpu
      .filter(cpu => cpu.price <= cpuBudget)
      .sort((a, b) => (b.cinebenchR23 / b.price) - (a.cinebenchR23 / a.price))[0];

    // Find best RAM within budget
    recommendations.ram = componentOptions.ram
      .filter(ram => ram.price <= ramBudget)
      .sort((a, b) => (b.aida64 / a.price) - (a.aida64 / a.price))[0];

    // Find best storage within budget
    recommendations.storage = componentOptions.storage
      .filter(storage => storage.price <= storageBudget)
      .sort((a, b) => (b.crystalDiskMark / a.price) - (a.crystalDiskMark / a.price))[0];

    budgetRecommendations = recommendations;
    showBudgetOptimizer = true;
  }

  function applyBudgetRecommendations() {
    if (budgetRecommendations.cpu) {
      const cpuIndex = componentOptions.cpu.findIndex(cpu => cpu.name === budgetRecommendations.cpu.name);
      if (cpuIndex !== -1) updateComponent('cpu', cpuIndex);
    }
    if (budgetRecommendations.ram) {
      const ramIndex = componentOptions.ram.findIndex(ram => ram.name === budgetRecommendations.ram.name);
      if (ramIndex !== -1) updateComponent('ram', ramIndex);
    }
    if (budgetRecommendations.gpu) {
      const gpuIndex = componentOptions.gpu.findIndex(gpu => gpu.name === budgetRecommendations.gpu.name);
      if (gpuIndex !== -1) updateComponent('gpu', gpuIndex);
    }
    if (budgetRecommendations.storage) {
      const storageIndex = componentOptions.storage.findIndex(storage => storage.name === budgetRecommendations.storage.name);
      if (storageIndex !== -1) updateComponent('storage', storageIndex);
    }
    showBudgetOptimizer = false;
  }

  function getBudgetEfficiency(component: any) {
    if (!component) return 0;
    const performanceMetric = component.timespy || component.cinebenchR23 || component.aida64 || component.crystalDiskMark;
    return performanceMetric / component.price;
  }

  // Spline model control functions
  function resetCamera() {
    const splineViewer = document.querySelector('spline-viewer');
    if (splineViewer && splineViewer.spline) {
      splineViewer.spline.emitEvent('mouseDown', 'ResetCamera');
    }
  }

  function toggleTransparency() {
    const splineViewer = document.querySelector('spline-viewer');
    if (splineViewer && splineViewer.spline) {
      splineViewer.spline.emitEvent('mouseDown', 'ToggleTransparency');
    }
  }

  function highlightComponents() {
    const splineViewer = document.querySelector('spline-viewer');
    if (splineViewer && splineViewer.spline) {
      splineViewer.spline.emitEvent('mouseDown', 'HighlightComponents');
    }
  }

  // Initialize Spline model with transparency
  onMount(() => {
    calculatePerformance();
    
    // Wait for Spline to load and set transparency
    setTimeout(() => {
      const splineViewer = document.querySelector('spline-viewer');
      if (splineViewer) {
        splineViewer.addEventListener('load', () => {
          // Set initial transparency for better component visibility
          if (splineViewer.spline) {
            splineViewer.spline.emitEvent('mouseDown', 'SetTransparency');
          }
        });
      }
    }, 1000);
  });
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="page-container">
  <h1>{title}</h1>
  <p>Adjust hardware components to see how they affect your computer's performance!</p>

  <!-- Budget Optimizer Section -->
  <div class="budget-optimizer-section">
    <h2>Budget Optimizer</h2>
    <div class="budget-controls">
      <div class="budget-input">
        <label for="budget-input">Your Budget: $</label>
        <input 
          type="number" 
          id="budget-input" 
          bind:value={userBudget} 
          min="400" 
          max="2000" 
          step="50"
        />

      </div>
      <button class="optimize-btn" on:click={optimizeForBudget}>
        Find Best Build
      </button>
          </div>
        
    {#if showBudgetOptimizer}
      <div class="budget-recommendations">
        <h3>Recommended Build for ${userBudget}</h3>
        <div class="recommendations-grid">
          {#if budgetRecommendations.cpu}
            <div class="recommendation-card">
              <h4>CPU</h4>
              <p><strong>{budgetRecommendations.cpu.name}</strong></p>
              <p>Price: ${budgetRecommendations.cpu.price}</p>
              <p>Performance: {budgetRecommendations.cpu.cinebenchR23.toLocaleString()}</p>
              <p class="efficiency">Efficiency: {getBudgetEfficiency(budgetRecommendations.cpu).toFixed(1)}</p>
            </div>
          {/if}
          
          {#if budgetRecommendations.gpu}
            <div class="recommendation-card">
              <h4>GPU</h4>
              <p><strong>{budgetRecommendations.gpu.name}</strong></p>
              <p>Price: ${budgetRecommendations.gpu.price}</p>
              <p>Performance: {budgetRecommendations.gpu.timespy.toLocaleString()}</p>
              <p class="efficiency">Efficiency: {getBudgetEfficiency(budgetRecommendations.gpu).toFixed(1)}</p>
            </div>
          {/if}
          
          {#if budgetRecommendations.ram}
            <div class="recommendation-card">
              <h4>RAM</h4>
              <p><strong>{budgetRecommendations.ram.name}</strong></p>
              <p>Price: ${budgetRecommendations.ram.price}</p>
              <p>Performance: {budgetRecommendations.ram.aida64.toLocaleString()} MB/s</p>
              <p class="efficiency">Efficiency: {getBudgetEfficiency(budgetRecommendations.ram).toFixed(1)}</p>
            </div>
              {/if}
          
          {#if budgetRecommendations.storage}
            <div class="recommendation-card">
              <h4>Storage</h4>
              <p><strong>{budgetRecommendations.storage.name}</strong></p>
              <p>Price: ${budgetRecommendations.storage.price}</p>
              <p>Performance: {budgetRecommendations.storage.crystalDiskMark.toLocaleString()} MB/s</p>
              <p class="efficiency">Efficiency: {getBudgetEfficiency(budgetRecommendations.storage).toFixed(1)}</p>
          </div>
        {/if}
      </div>
        
        <div class="budget-summary">
          <div class="total-cost">
            <strong>Total Cost: ${
              (budgetRecommendations.cpu?.price || 0) + 
              (budgetRecommendations.gpu?.price || 0) + 
              (budgetRecommendations.ram?.price || 0) + 
              (budgetRecommendations.storage?.price || 0)
            }</strong>
    </div>
          <div class="budget-remaining">
            <strong>Remaining: ${userBudget - (
              (budgetRecommendations.cpu?.price || 0) + 
              (budgetRecommendations.gpu?.price || 0) + 
              (budgetRecommendations.ram?.price || 0) + 
              (budgetRecommendations.storage?.price || 0)
            )}</strong>
      </div>
      </div>
        
        <button class="apply-recommendations-btn" on:click={applyBudgetRecommendations}>
          Apply Recommendations
        </button>
      </div>
    {/if}
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

  <!-- Interactive 3D Computer Model -->
  <div class="model-section">
    <h2>Interactive 3D Computer Model</h2>
    <p>Explore the computer components in 3D! Click on parts to see details and performance information.</p>
    <div class="spline-container">
      <spline-viewer
        url="https://prod.spline.design/oTp96jd9q-EYn7Wm/scene.splinecode"
        class="spline-viewer"
      ></spline-viewer>
    </div>
    <div class="model-controls">
      <button class="control-btn" on:click={resetCamera}>Reset View</button>
      <button class="control-btn" on:click={toggleTransparency}>Toggle Transparency</button>
      <button class="control-btn" on:click={highlightComponents}>Highlight Components</button>
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
    display: inline-block;
    margin-bottom: 1rem;
  }



  .spline-container {
    width: 100%;
    height: 500px;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    margin: 1rem 0;
    overflow: hidden;
    position: relative;
    border: 2px solid #333;
  }

  .spline-viewer {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }

  .model-controls {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }

  .control-btn {
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }

  .control-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  }

  .budget-optimizer-section {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid #e9ecef;
    margin-bottom: 2rem;
  }

  .budget-controls {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .budget-input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .budget-input label {
    font-weight: 500;
    color: #495057;
  }

  .budget-input input {
    padding: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
    width: 120px;
  }

  .optimize-btn {
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .optimize-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  }

  .budget-recommendations {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    border: 1px solid #dee2e6;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .budget-recommendations h3 {
    color: #495057;
    margin-bottom: 1rem;
    text-align: center;
  }

  .recommendations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .recommendation-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid #dee2e6;
    text-align: center;
  }

  .recommendation-card h4 {
    color: #007bff;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .recommendation-card p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: #6c757d;
  }

  .recommendation-card .efficiency {
    color: #28a745 !important;
    font-weight: 600 !important;
  }

  .budget-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #e9ecef;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .total-cost {
    color: #495057;
  }

  .budget-remaining {
    color: #28a745;
  }

  .apply-recommendations-btn {
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
  }

  .apply-recommendations-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
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

    .budget-controls {
      flex-direction: column;
      align-items: stretch;
    }

    .budget-input {
      justify-content: center;
    }

    .recommendations-grid {
      grid-template-columns: 1fr;
    }

    .budget-summary {
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;
    }
  }
</style>
