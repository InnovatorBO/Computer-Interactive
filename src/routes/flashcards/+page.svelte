<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { tick } from 'svelte';


    let title = 'Flashcards Page';

    type Flashcard = {
        question: string;
        answer: string;
    };

    let flashcards: Flashcard[] = [
      { question: 'Motherboard',
        answer: 'Connects all of the different hardware components and allows them to communicate with each other.'},
      { question: 'Chipset',
        answer: 'Set of electrical components that manages communication between the ACPU, memory, and peripherals.'},
      { question: 'Basic Input/Output System (BIOS)', 
        answer: 'Firmware that configures hardware on startup and loads the operating system.'},
      { question: 'Voltage Regulator Module (VRM)', 
        answer: 'Regulates and stabilizes voltage from the power supply to the CPU and memory.'},
      { question: 'CPU',
        answer: 'Receives and executes instructions from the computer’s program.'},
      { question: 'Buses',
        answer: 'How data is carried to/from the CPU to input/output devices.'},
      { question: 'Arithmetic and Logic Unit (ALU)',
        answer: 'CPU unit that performs arithmetic and logical operations.'},
      { question: 'RAM',
        answer: 'A type of temporary storage where the computer can store data that is actively being used.'},
      { question: 'Memory cell',
        answer: 'Fundamental unit of RAM that store a bit of binary data.'},
      { question: 'Dynamic RAM (DRAM)',
        answer: 'Most common type of RAM; stores data in a capacitor that holds charges to represent binary data.'},
      { question: 'GPU', 
        answer: 'A specialized processor that helps render images, videos, and animations.'},
      { question: 'Video RAM (VRAM)', 
        answer: 'High-speed memory that stores textures, shaders, and frame buffers.'},
      { question: 'Printed Circuit Board (PCB)',
        answer: 'Holds the GPU die, memory chips, VRMs, and integrated circuits.'},
      { question: 'Hard Disk Drive(HDD)',
        answer: 'Uses spinning disks and are cheaper with more storage, but slower and more fragile.'},
      { question: 'Platters',
        answer: 'Spinning disks coated with magnetic material where data is stored as patterns of magnetized regions.'},
      { question: 'Read/Write Arm',
        answer: 'Accesses and modifies data on the spinning platters. It hovers just above the platter surface, using magnetic fields to read data from or write data to specific locations as the platters rotate beneath it.'},
      { question: 'Solid-State Drive(SSD)',
        answer: 'Uses flash memory, making them faster, quieter, and more durable, but they cost more per GB compared to HDDs.'},
      { question: 'NAND Flash Memory',
        answer: "The core of an SSD, storing data by trapping electrical charges in memory cells. The SSD’s controller manages data flow, enabling fast and reliable access to the operating system, applications, and files."},
      { question: 'Cooling system',
        answer: 'A system of fans and heatsinks that removes heat from hardware components'},
      { question: 'Heatsink',
        answer: 'A metal block with fins that dissipates heat away from hardware like CPUs and GPUs.'}
    ];

    let currentCardIndex = 0;
    let showAnswer = false;

    function flipCard() {
      showAnswer = !showAnswer;
    }

    async function nextCard() {
      showAnswer = false;
      await tick();
      await new Promise(r => setTimeout(r, 200));
      currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    }

    async function prevCard() {
      showAnswer = false;
      await tick();
      await new Promise(r => setTimeout(r, 200));
      currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
    }

    async function resetCards() {
      showAnswer = false;
      await tick();
      await new Promise(r => setTimeout(r, 200));
      currentCardIndex = 0;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') {
          nextCard();
      } else if (event.key === 'ArrowLeft') {
          prevCard();
      } else if (event.key === ' ') {
          event.preventDefault();
          flipCard();
      }
    }

    onMount(() => {
      window.addEventListener('keydown', handleKeyDown);
    });

    onDestroy(() => {
      window.removeEventListener('keydown', handleKeyDown);
    });

    let showCards = false;
    const flashcardImages = Array.from({ length: 20 }, (_, i) => `/flashcards${i + 1}.png`);

    function toggleCards() {
      showCards = !showCards;
    }

</script>

<div class="page-container">
  <h1>Flashcards</h1>

  <!-- Main Flashcard Viewer -->
  <div class="flashcards-container">
    <div class="flashcards-content" on:click={flipCard}>
      <div class="flashcard-inner" class:flipped={showAnswer}>
        <div class="flashcard-front">
          <p>{flashcards[currentCardIndex].question}</p>
        </div>
        <div class="flashcard-back">
          <p>{flashcards[currentCardIndex].answer}</p>
        </div>
      </div>
    </div>

    <div class="flashcards-buttons">
        <button class="prev-btn" on:click={prevCard}>Back</button>
        <button class="flip-btn" on:click={flipCard}>Flip</button>
        <button class="next-btn" on:click={nextCard}>Next</button>
    </div>

  </div>

    <hr class="divider" />

  <div class="flashcards-grid-container">
    <button class="toggle-button" on:click={toggleCards}>
      Terms in this set
      <span class="arrow">{showCards ? '▾' : '▸'}</span>
    </button>

    {#if showCards}
      <div class="flashcards-grid">
        {#each flashcardImages as src}
          <div class="flashcard-item">
            <img src={src} alt="Flashcard" />
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  /* Page container */
  .page-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    color: white;
    font-family: system-ui, sans-serif;
  }

  h1 {
    font-size: 2.5rem;
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: center;
  }

  /* Flashcards container (main) */
  .flashcards-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;
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
  }

  .flashcards-content:hover {
    transform: scale(1.02);
  }

  /* Flashcard flip */
  .flashcard-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.5s;
    transform-style: preserve-3d;
  }

  .flashcard-inner.flipped {
    transform: rotateX(180deg);
  }

  .flashcard-front, .flashcard-back {
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
    transform: rotateX(180deg);
  }

  /* Buttons for main flashcards */
  .flashcards-buttons {
    display: flex;
    gap: 1rem;
    width: 500px;
    margin-top: 1rem;
  }

  .prev-btn, .next-btn {
    font-family: 'Arial', sans-serif;
    font-weight: 550;
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background: #000;
    color: #e8ffee;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    flex: 1;
    transition: all 0.3s ease;
  }

  .prev-btn:hover, .next-btn:hover {
    transform: translateY(-2px);
    background: #485270;
  }

  .flip-btn {
    font-family: 'Arial', sans-serif;
    font-weight: 550;
    margin-top: 1rem;
    padding: 0.75rem 7rem;
    background: linear-gradient(45deg, #4a90e2, #357abd);
    transition: all 0.3s ease;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    flex: 1;
  }

  .flip-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
    background: #2f75b5;
  }

  /* Flashcards grid container (bottom) */
  .flashcards-grid-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  /* Toggle button style */
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
    justify-content: center;
    gap: 10px;
    transition: background 0.2s ease-in-out;
    margin-bottom: 20px;
    width: 100%;
    max-width: 500px;
  }

  .toggle-button:hover {
    background: #305bb5;
  }

  .arrow {
    font-size: 1.2rem;
  }

  /* Grid of smaller flashcards */
  .flashcards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 20px;
    max-width: 500px;
    margin: 0 auto;
  }

  .flashcard-item img {
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
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