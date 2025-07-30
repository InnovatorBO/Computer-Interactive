<script lang="ts">
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
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="page-container">
  <h1>Learn</h1>
</div>

<div class="explore-container">
  <div class="main-content">
    <div class="sidebar">
      <button class="info-button" on:click={() => showPopup('cpu')}>▼ Click for info</button>
      <button class="info-button" on:click={() => showPopup('ram')}>▼ Click for info</button>
      <button class="info-button" on:click={() => showPopup('gpu')}>▼ Click for info</button>
      <button class="info-button" on:click={() => showPopup('storage')}>▼ Click for info</button>
    </div>
    
    <div class="computer-display">
      <div class="computer-interior">
        <div class="cables">
          <div class="cable cable1"></div>
          <div class="cable cable2"></div>
          <div class="cable cable3"></div>
        </div>
        
        <div class="component cpu" on:click={() => showPopup('cpu')}>CPU</div>
        <div class="component ram" on:click={() => showPopup('ram')}>RAM</div>
        <div class="component motherboard">MOTHERBOARD</div>
        <div class="component gpu" on:click={() => showPopup('gpu')}>VIDEO CARD</div>
        <div class="component psu">PSU</div>
        <div class="component storage" on:click={() => showPopup('storage')}>HARD DRIVE</div>
      </div>
    </div>
  </div>
  
  <button class="help-button" on:click={() => showPopup('help')}>?</button>
</div>

{#if activePopup === 'cpu'}
  <div class="popup" on:click={handleBackdropClick}>
    <div class="popup-content">
      <button class="popup-close" on:click={closePopup}>&times;</button>
      <h2>Central Processing Unit (CPU)</h2>
      <p>The CPU is the brain of your computer. It executes instructions from programs and performs calculations. Modern CPUs have multiple cores that can handle different tasks simultaneously, making your computer faster and more efficient. The CPU's speed is measured in gigahertz (GHz), and it works closely with RAM to process data quickly.</p>
    </div>
  </div>
{/if}

{#if activePopup === 'ram'}
  <div class="popup" on:click={handleBackdropClick}>
    <div class="popup-content">
      <button class="popup-close" on:click={closePopup}>&times;</button>
      <h2>Random Access Memory (RAM)</h2>
      <p>RAM is your computer's temporary workspace. It stores data that the CPU needs to access quickly while programs are running. More RAM allows you to run more programs simultaneously without slowing down. Unlike storage drives, RAM is volatile, meaning it loses all data when the computer is turned off. Common RAM sizes today range from 8GB to 32GB or more.</p>
    </div>
  </div>
{/if}

{#if activePopup === 'gpu'}
  <div class="popup" on:click={handleBackdropClick}>
    <div class="popup-content">
      <button class="popup-close" on:click={closePopup}>&times;</button>
      <h2>Graphics Processing Unit (Video Card)</h2>
      <p>The GPU handles all visual processing for your computer. It renders images, videos, and animations you see on your screen. While basic tasks can use integrated graphics, dedicated video cards are essential for gaming, video editing, 3D modeling, and AI workloads. Modern GPUs have thousands of small cores optimized for parallel processing tasks.</p>
    </div>
  </div>
{/if}

{#if activePopup === 'storage'}
  <div class="popup" on:click={handleBackdropClick}>
    <div class="popup-content">
      <button class="popup-close" on:click={closePopup}>&times;</button>
      <h2>Storage Drive (Hard Drive/SSD)</h2>
      <p>Storage drives permanently store your data, programs, and operating system. Traditional hard drives (HDDs) use spinning disks, while solid-state drives (SSDs) use flash memory for faster access. SSDs are much faster than HDDs, making your computer boot quicker and programs load faster. Your storage capacity determines how much data you can keep on your computer.</p>
    </div>
  </div>
{/if}

{#if activePopup === 'help'}
  <div class="popup" on:click={handleBackdropClick}>
    <div class="popup-content">
      <button class="popup-close" on:click={closePopup}>&times;</button>
      <h2>How to Use This Explorer</h2>
      <p>Welcome to the Computer Components Explorer! This interactive tool helps you learn about the main parts inside a computer. Click the "Click for info" buttons on the left to learn about different components. You can also click directly on the colored components inside the computer case to see them highlighted. Each component has a specific role in making your computer work!</p>
    </div>
  </div>
{/if}

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(html, body) {
    font-family: Arial, sans-serif;
}

.explore-container {
    min-height: 100vh;
    width: 100%;
    background: #304357;
}

  .page-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 10;
    top: 100px;
  }

  .page-container h1 {
    color: white;
    font-size: 2.5rem;
    margin-bottom: 10px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .page-container p {
    color: #bbb;
    font-size: 1.1rem;
  }

  .explore-container {
    height: 100vh;
    width: 100vw;
    background: #304357;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .main-content {
    display: flex;
    gap: 40px;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 200px;
  }

  .info-button {
    background: linear-gradient(45deg, #4a90e2, #357abd);
    color: white;
    border: none;
    padding: 15px 20px;
    border-radius: 12px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
    position: relative;
    overflow: hidden;
  }

  .info-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  .info-button:hover::before {
    left: 100%;
  }

  .info-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
  }

  .computer-display {
    position: relative;
    background: #f8f9fa;
    border: 8px solid #ddd;
    border-radius: 15px;
    padding: 20px;
    width: 600px;
    height: 450px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }

  .computer-interior {
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #2c3e50, #34495e);
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
  }

  .component {
    position: absolute;
    background: linear-gradient(45deg, #3498db, #2980b9);
    border: 2px solid #fff;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    font-size: 12px;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .component:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  }

  .cpu { 
    width: 80px; 
    height: 80px; 
    top: 100px; 
    left: 150px; 
    background: linear-gradient(45deg, #e74c3c, #c0392b); 
  }
  
  .ram { 
    width: 60px; 
    height: 100px; 
    top: 80px; 
    right: 80px; 
    background: linear-gradient(45deg, #2ecc71, #27ae60); 
  }
  
  .motherboard { 
    width: 200px; 
    height: 40px; 
    bottom: 100px; 
    left: 50px; 
    background: linear-gradient(45deg, #f39c12, #e67e22); 
  }
  
  .gpu { 
    width: 120px; 
    height: 60px; 
    top: 200px; 
    left: 100px; 
    background: linear-gradient(45deg, #9b59b6, #8e44ad); 
  }
  
  .psu { 
    width: 80px; 
    height: 60px; 
    top: 30px; 
    left: 30px; 
    background: linear-gradient(45deg, #34495e, #2c3e50); 
  }
  
  .storage { 
    width: 100px; 
    height: 30px; 
    bottom: 60px; 
    right: 60px; 
    background: linear-gradient(45deg, #16a085, #1abc9c); 
  }

  .help-button {
    position: absolute;
    top: 20px;
    right: 20px;
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
  }

  .popup p {
    color: #666;
    line-height: 1.6;
    font-size: 16px;
  }

  .cables {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
  }

  .cable {
    position: absolute;
    width: 4px;
    background: linear-gradient(45deg, #e74c3c, #c0392b);
    border-radius: 2px;
  }

  .cable1 { 
    width: 80px; 
    height: 4px; 
    top: 140px; 
    left: 230px; 
    transform: rotate(30deg); 
  }
  
  .cable2 { 
    width: 60px; 
    height: 4px; 
    top: 180px; 
    right: 120px; 
    transform: rotate(-45deg); 
  }
  
  .cable3 { 
    width: 100px; 
    height: 4px; 
    bottom: 120px; 
    left: 250px; 
    transform: rotate(15deg); 
  }

  @media (max-width: 768px) {
    .main-content {
      flex-direction: column;
      padding: 100px 20px 20px 20px;
    }
    
    .computer-display {
      width: 90vw;
      height: 60vh;
      max-width: 400px;
      max-height: 300px;
    }
    
    .component {
      font-size: 10px;
    }
    
    .cpu { width: 60px; height: 60px; }
    .ram { width: 40px; height: 80px; }
    .motherboard { width: 150px; height: 30px; }
    .gpu { width: 90px; height: 45px; }
    .psu { width: 60px; height: 45px; }
    .storage { width: 75px; height: 25px; }

    .page-container h1 { font-size: 2rem; }
    .page-container p { font-size: 1rem; }
  }
</style>