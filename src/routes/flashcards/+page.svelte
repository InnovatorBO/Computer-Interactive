<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { tick } from 'svelte';

  let title = 'Flashcards Page';

  type Flashcard = {
    question: string;
    answer: string;
  };

  let flashcards: Flashcard[] = [
    { question: 'Motherboard', answer: 'Connects all of the different hardware components and allows them to communicate with each other.' },
    { question: 'Chipset', answer: 'Set of electrical components that manages communication between the CPU, memory, and peripherals.' },
    { question: 'Basic Input/Output System (BIOS)', answer: 'Firmware that configures hardware on startup and loads the operating system.' },
    { question: 'Voltage Regulator Module (VRM)', answer: 'Regulates and stabilizes voltage from the power supply to the CPU and memory.' },
    { question: 'CPU', answer: 'Receives and executes instructions from the computer’s program.' },
    { question: 'Buses', answer: 'How data is carried to/from the CPU to input/output devices.' },
    { question: 'Arithmetic and Logic Unit (ALU)', answer: 'CPU unit that performs arithmetic and logical operations.' },
    { question: 'RAM', answer: 'Temporary storage for actively used data.' },
    { question: 'Memory cell', answer: 'Fundamental unit of RAM that stores a bit of binary data.' },
    { question: 'Dynamic RAM (DRAM)', answer: 'Most common type of RAM; stores data in a capacitor that holds charges to represent binary data.' },
    { question: 'GPU', answer: 'A specialized processor that helps render images, videos, and animations.' },
    { question: 'Video RAM (VRAM)', answer: 'High-speed memory that stores textures, shaders, and frame buffers.' },
    { question: 'Printed Circuit Board (PCB)', answer: 'Holds the GPU die, memory chips, VRMs, and integrated circuits.' },
    { question: 'Hard Disk Drive (HDD)', answer: 'Uses spinning disks; more storage but slower and fragile.' },
    { question: 'Platters', answer: 'Spinning disks coated with magnetic material where data is stored as magnetized patterns.' },
    { question: 'Read/Write Arm', answer: 'Accesses and modifies data on spinning platters using magnetic fields.' },
    { question: 'Solid-State Drive (SSD)', answer: 'Uses flash memory, faster and more durable than HDDs.' },
    { question: 'NAND Flash Memory', answer: 'Stores data by trapping electrical charges in memory cells; core of SSDs.' },
    { question: 'Cooling system', answer: 'Fans and heatsinks that remove heat from components.' },
    { question: 'Heatsink', answer: 'A metal block with fins that dissipates heat away from CPUs and GPUs.' }
  ];

  let currentCardIndex = 0;
  let showAnswer = false;

  function flipCard() {
    showAnswer = !showAnswer;
  }

  async function nextCard() {
    showAnswer = false;
    await tick();
    await new Promise((r) => setTimeout(r, 200));
    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
  }

  async function prevCard() {
    showAnswer = false;
    await tick();
    await new Promise((r) => setTimeout(r, 200));
    currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
  }

  async function resetCards() {
    showAnswer = false;
    await tick();
    await new Promise((r) => setTimeout(r, 200));
    currentCardIndex = 0;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') nextCard();
    else if (event.key === 'ArrowLeft') prevCard();
    else if (event.key === ' ') {
      event.preventDefault();
      flipCard();
    }
  }

  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
    }
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeyDown);
    }
  });

  // Catalog
  let showCards = false;
  const flashcardImages = Array.from({ length: 20 }, (_, i) => `/flashcards${i + 1}.png`);
  function toggleCards() {
    showCards = !showCards;
  }

  // Modal logic
  let selectedImage: string | null = null;
  function openImage(src: string) {
    selectedImage = src;
  }
  function closeImage(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      selectedImage = null;
    }
  }
</script>

<div class="page-container">
  <h1>Flashcards</h1>

  <!-- Interactive Flashcards -->
  <div class="flashcards-container">
    <button
      type="button"
      class="flashcards-content"
      aria-label={showAnswer ? "Show question" : "Show answer"}
      on:click={flipCard}
    >
      <div class="flashcard-inner" class:flipped={showAnswer}>
        <div class="flashcard-front">
          <p>{flashcards[currentCardIndex].question}</p>
        </div>
        <div class="flashcard-back">
          <p>{flashcards[currentCardIndex].answer}</p>
        </div>
      </div>
    </button>

    <div class="flashcards-buttons">
      <button class="prev-btn" on:click={prevCard}>Back</button>
      <button class="next-btn" on:click={nextCard}>Next</button>
      <button class="reset-btn" on:click={resetCards}>Reset</button>
    </div>
  </div>

  <hr class="divider" />

  <!-- Catalog grid -->
  <div class="flashcards-grid-container">
    <button class="toggle-button" on:click={toggleCards}>
      Terms in this set
      <span class="arrow">{showCards ? '▾' : '▸'}</span>
    </button>

    {#if showCards}
      <div class="flashcards-grid">
        {#each flashcardImages as src}
          <div class="flashcard-item" on:click={() => openImage(src)}>
            <img src={src} alt="Flashcard" />
          </div>
        {/each}
      </div>
    {/if}
  </div>

  {#if selectedImage}
    <div class="modal-backdrop" on:click={closeImage}>
      <img src={selectedImage} alt="Flashcard preview" class="modal-image" />
    </div>
  {/if}
</div>

<style>
  .page-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    color: white;
    font-family: system-ui, sans-serif;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    text-align: center;
  }

  .flashcards-container {
    display: flex;
  }

  .flashcards-content {
    width: 500px;
    height: 300px;
    perspective: 1000px;
    cursor: pointer;
    padding: 2rem;
    font-size: 1.5rem;
    transition: transform 0.3s ease;
    text-align: center;
    background: none;
    border: none;
    outline: none;
    box-shadow: none;
    display: block;
  }

  .flashcards-content:hover,
  .flashcards-content:focus-visible {
    transform: scale(1.02);
  }

  .flashcard-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.5s;
    transform-style: preserve-3d;
  }

  .flashcard-inner.flipped {
    transform: rotateY(180deg);
  }

  .flashcard-front,
  .flashcard-back {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    border: 4px solid white;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    backface-visibility: hidden;
  }

  .flashcard-front {
    background: linear-gradient(135deg, #0497ad, #02c75b);
  }

  .flashcard-back {
    background: #3c46a6;
    transform: rotateY(180deg);
  }

  .flashcards-buttons {
    display: flex;
    gap: 1rem;
    width: 500px;
    margin-top: 1rem;
  }

  .prev-btn,
  .next-btn,
  .reset-btn {
    flex: 1;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    color: white;
  }

  .prev-btn,
  .next-btn {
    background: #3a8dd4;
  }

  .reset-btn {
    background: #6c757d;
  }

  .prev-btn:hover,
  .next-btn:hover {
    background: #2f75b5;
  }

  .flashcards-grid-container {
    width: 100%;
  }

  .toggle-button {
    background: linear-gradient(135deg, #0497ad, #02c75b);
    color: white;
    border: none;
    padding: 12px 18px;
    font-size: 1.2rem;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background 0.2s ease-in-out;
    margin-bottom: 20px;
    width: 100%;
    max-width: 500px;
  }

  .arrow {
    font-size: 1.2rem;
  }

  .flashcards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    width: 100%;
    padding: 20px 40px;
    margin: 0;
  }

  .flashcard-item img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
  }

  .flashcard-item img:hover {
    transform: scale(1.12);
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-image {
    max-width: 90%;
    max-height: 90%;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
  }

  .divider {
    border: none;
    border-top: 1px solid rgba(0, 0, 0, 0.3);
    margin: 30px 0;
    width: 100%;
    max-width: 600px;
    align-self: center;
  }
</style>