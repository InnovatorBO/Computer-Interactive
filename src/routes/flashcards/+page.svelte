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

</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="page-container">
    <h1>Flashcards</h1>
</div>

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
        <button class="next-btn" on:click={nextCard}>Next</button>
        <button class="reset-btn" on:click={resetCards}>Reset</button>
    </div>
</div>

<style>

    .page-container {
        min-height: 150px;
        color: white;
        font-size: 2.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .flashcards-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        margin-bottom: 50px;
    }

    .flashcards-content {
        margin-top: 2rem;
        padding: 2rem;
        transition: transform 0.3s ease;
        text-align: center;
        font-size: 1.5rem;
        perspective: 1000px;
        width: 500px;
        height: 300px;
        cursor: pointer;
    }

    .flashcards-content:hover {
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

    .flashcard-front, .flashcard-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        background: linear-gradient(135deg, #0497ad, #02c75b);
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 4px solid #fff;
        border-radius: 12px;
        font-size: 1.5rem;
        padding: 1rem;
    }

    .flashcard-back {
        background: #3c46a6;
        transform: rotateY(180deg);
    }
    .flashcards-buttons {
        display: flex;
        gap: 1rem;
    }
    
    .prev-btn, .next-btn {
        margin-top: 1rem;
        padding: 0.75rem 1.5rem;
        background: #3a8dd4;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        flex: 1;
    }

    .reset-btn {
        margin-top: 1rem;
        padding: 0.75rem 1.5rem;
        background: #6c757d;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        flex: 1;
    }

    .prev-btn:hover, .next-btn:hover {
        background: #2f75b5
    }

    h1 {
        font-size: 2.5rem;
        margin-top: 2.5rem;
    }

</style>