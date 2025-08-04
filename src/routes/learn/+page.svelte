<script lang="ts">
  let activePopup: string | null = $state(null);

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
    
  let quizMode = $state(false);
  let currentQuestion = $state(0);
  let score = $state(0);
  let showResults = $state(false);
  let selectedAnswer = $state<number | null>(null);
  let quizCompleted = $state(false);
  let showCorrectAnswer = $state(false);
  let currentQuizQuestions = $state<any[]>([]);

  const questionBank = [
    {
      question: "What is the main function of the CPU?",
      options: [
        "To store data permanently",
        "To execute instructions and perform calculations",
        "To display graphics on screen",
        "To provide power to the computer"
      ],
      correct: 1,
      explanation: "The CPU is the brain of your computer that executes instructions from programs and performs calculations."
    },
    {
      question: "What does RAM stand for?",
      options: [
        "Random Access Memory",
        "Read Only Memory",
        "Remote Access Module",
        "Rapid Application Management"
      ],
      correct: 0,
      explanation: "RAM stands for Random Access Memory, which is your computer's temporary workspace."
    },
    {
      question: "Which component is responsible for rendering graphics and images?",
      options: [
        "CPU",
        "RAM",
        "GPU",
        "Storage Drive"
      ],
      correct: 2,
      explanation: "The GPU handles all visual processing and renders images, videos, and animations you see on your screen."
    },
    {
      question: "What is the difference between HDD and SSD?",
      options: [
        "HDD is faster than SSD",
        "SSD uses flash memory while HDD uses spinning disks",
        "SSD is cheaper than HDD",
        "HDD has more storage capacity"
      ],
      correct: 1,
      explanation: "SSDs use flash memory for faster access, while traditional HDDs use spinning disks."
    },
    {
      question: "What happens to RAM data when the computer is turned off?",
      options: [
        "It is saved permanently",
        "It is transferred to the hard drive",
        "It is lost (volatile memory)",
        "It is backed up automatically"
      ],
      correct: 2,
      explanation: "RAM is volatile memory, meaning it loses all data when the computer is turned off."
    },
    {
      question: "What does CPU stand for?",
      options: [
        "Central Progress Unit",
        "Core Printing Utility",
        "Central Processing Unit",
        "Computer Primitive User"
      ],
      correct: 2,
      explanation: "CPU stands for Central Processing Unit, which is the main component that executes instructions in a computer."
    },
    {
      question: "What is the main function of RAM?",
      options: [
        "To render graphics",
        "To store data permanently",
        "To power the computer",
        "To provide temporary storage to the computer"
      ],
      correct: 3,
      explanation: "RAM provides temporary storage for data that the CPU needs to access quickly while programs are running."
    },
    {
      question: "Which of these is a type of long-term storage?",
      options: [
        "RAM",
        "SSD",
        "USB",
        "Cache"
      ],
      correct: 1,
      explanation: "SSD (Solid State Drive) is a type of long-term storage that uses flash memory for faster access compared to traditional HDDs."
    },
    {
      question: "Which of these components is NOT typically found in a motherboard?",
      options: [
        "CPU socket",
        "Chipset",
        "PSU",
        "VRM"
      ],
      correct: 2,
      explanation: "The PSU (Power Supply Unit) is not part of the motherboard; it provides power to the entire computer system."
    },
    {
      question: "What can happen if a computer’s cooling system fails?",
      options: [
        "The hard drive speeds up",
        "The GPU becomes louder",
        "The system can overheat and shut down",
        "The brightness increases"
      ],
      correct: 2,
      explanation: "If the cooling system fails, the computer can overheat, leading to potential damage and automatic shutdown to prevent further issues."
    },
    {
      question: "Which of the following would most likely be stored in RAM temporarily?",
      options: [
        "An open document being edited",
        "Saved Wi-Fi passwords",
        "Operating system files on your SSD",
        "System BIOS configurations"
      ],
      correct: 0,
      explanation: "An open document being edited is stored in RAM temporarily so that it can be accessed quickly by the CPU while you are working on it."
    },
    {
      question: "Which of these upgrades would be the most helpful for smoother performance in rendering high-resolution images?",
      options: [
        "Upgrading from 8GB to 16GB of RAM",
        "Installing a more powerful GPU",
        "Adding a second monitor",
        "Replacing the CPU with one that has fewer cores"
      ],
      correct: 1,
      explanation: "Installing a more powerful GPU would significantly improve performance in rendering high-resolution images, as the GPU is specifically designed for graphics processing."
    },
    {
      question: "What type of memory is typically built directly into the CPU for fast access?",
      options: [
        "RAM",
        "HDD",
        "ROM",
        "Cache memory"
      ],
      correct: 3,
      explanation: "Cache memory is a small amount of high-speed memory built directly into the CPU to store frequently accessed data for quick retrieval."
    },
    {
      question: "Which motherboard component regulates power to the CPU?",
      options: [
        "Northbridge",
        "Power connector",
        "VRM",
        "I/O ports"
      ],
      correct: 2,
      explanation: "VRM (Voltage Regulator Module) regulates the voltage supplied to the CPU, ensuring it receives stable power for optimal performance." 
    },
    {
      question: "The core of a SSD, which stores data by trapping electrical charges in memory cells, is called:",
      options: [
        "RAM",
        "NAND flash memory",
        "Data bus",
        "Single-core CPU"
      ],
      correct: 1,
      explanation: "NAND flash memory is the core technology used in SSDs to store data by trapping electrical charges in memory cells, allowing for fast read and write speeds."
    },
    {
      question: "The CPU’s processor speed is measured in:",
      options: [
        "Revolutions per minute (RPM)",
        "Terabytes (TB)",
        "Cubic feet per minute (CFM)",
        "Gigahertz (GHz)"
      ],
      correct: 3,
      explanation: "The CPU’s processor speed is measured in gigahertz (GHz), which indicates how many billions of cycles per second the CPU can perform."
    },
    {
      question: "What does a heat sink do?",
      options: [
        "Generate power",
        "Store data",
        "Transfer heat away from components",
        "Render images"
      ],
      correct: 2,
      explanation: "A heat sink transfers heat away from components like the CPU and GPU to prevent overheating, ensuring stable performance and longevity."
    },
    {
      question: "What type of bus carries data between the CPU and RAM?",
      options: [
        "Power bus",
        "Data bus",
        "Control bus",
        "Address bus"
      ],
      correct: 1,
      explanation: "The data bus carries data between the CPU and RAM, allowing the CPU to read and write data stored in memory."
    },
    {
      question: "Which component is essential for displaying images on your monitor?",
      options: [
        "SSD",
        "GPU",
        "PSU",
        "RAM"
      ],
      correct: 1,
      explanation: "The GPU (Graphics Processing Unit) is essential for rendering and displaying images on your monitor, handling all visual processing tasks."
    },
    {
      question: "Which type of memory is used to store textures and shaders in GPUs?",
      options: [
        "VRAM (Video RAM)",
        "ROM (Read-Only Memory)",
        "DRAM (Dynamic RAM)",
        "SRAM (Static RAM)"
      ],
      correct: 0,
      explanation: "VRAM (Video RAM) is used in GPUs to store textures, shaders, and other graphical data that the GPU needs to access quickly for rendering images and videos."
    },
    {
      question: "What does BIOS do when you start a computer?",
      options: [
        "Deletes all temporary files",
        "Configures hardware and loads the operating system",
        "Connects the GPU to the monitor",
        "Creates a password for your computer"
      ],
      correct: 1,
      explanation: "BIOS (Basic Input/Output System) configures hardware components and loads the operating system into RAM when you start your computer, allowing it to boot up properly."
    },
    {
      question: "Which HDD component is directly responsible for accessing and modifying data on the spinning platters?",
      options: [
        "Spindle",
        "Actuator",
        "Read/write heads",
        "Controller"
      ],
      correct: 2,
      explanation: "The read/write heads are directly responsible for accessing and modifying data on the spinning platters of an HDD, moving across the surface to read or write data as needed."
    },
    {
      question: "Where do you plug in a device like a mouse or a keyboard?",
      options: [
        "GPU",
        "CPU socket",
        "I/O port",
        "RAM slot"
      ],
      correct: 2,
      explanation: "I/O ports are used to connect peripherals like a mouse or keyboard to the computer, allowing them to communicate with the CPU and other components."
    },
    {
      question: "What is the function of thermal paste in a computer’s cooling system?",
      options: [
        "To regulate voltage from the PSU",
        "To keep the computer warm in colder temperatures",
        "To fill small gaps between the CPU and the heat sink",
        "To replace the need for fans"
      ],
      correct: 2,
      explanation: "Thermal paste fills microscopic gaps between the CPU and the heat sink, improving heat transfer and helping to keep the CPU cool during operation."
    },
    {
      question: "Which component connects all parts of the computer together?",
      options: [
        "Motherboard",
        "CPU",
        "PSU",
        "Platters"
      ],
      correct: 0,
      explanation: "The motherboard connects all parts of the computer together, allowing communication between the CPU, RAM, GPU, storage drives, and other components."
    }

  ];

  function selectRandomQuestions() {
    const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }

  function startQuiz() {
    currentQuizQuestions = selectRandomQuestions();
    quizMode = true;
    currentQuestion = 0;
    score = 0;
    showResults = false;
    selectedAnswer = null;
    quizCompleted = false;
    showCorrectAnswer = false;
  }
  
  function selectAnswer(answerIndex: number) {
    selectedAnswer = answerIndex;
  }
  
  function submitAnswer() {
      if (selectedAnswer === null) return;
    
      showCorrectAnswer = true;
    
      if (selectedAnswer === currentQuizQuestions[currentQuestion].correct) {
        score++;
      }
  }
  
  function continueToNext() {
    if (currentQuestion < currentQuizQuestions.length - 1) {
        currentQuestion++;
        selectedAnswer = null;
        showCorrectAnswer = false;
      } else {
        showResults = true;
        quizCompleted = true;
      }
  }

  function resetQuiz() {
    quizMode = false;
    currentQuestion = 0;
    score = 0;
    showResults = false;
    selectedAnswer = null;
    quizCompleted = false;
    showCorrectAnswer = false;
    currentQuizQuestions = [];
  }

</script>

<svelte:window on:keydown={handleKeydown} />

<div class="page-container">
  <h1>Learn</h1>
</div>

<div class="explore-container">
  <div class="main-content">
    <div class="sidebar">
      <button class="info-button" on:click={() => showPopup('cpu')}>▼ Click for CPU info</button>
      <button class="info-button" on:click={() => showPopup('ram')}>▼ Click for RAM info</button>
      <button class="info-button" on:click={() => showPopup('gpu')}>▼ Click for GPU info</button>
      <button class="info-button" on:click={() => showPopup('storage')}>▼ Click for Storage info</button>
      <button class="info-button" on:click={() => showPopup('psu')}>▼ Click for PSU info</button>
      <button class="info-button" on:click={() => showPopup('motherboard')}>▼ Click for motherboard info</button>
      
    </div>
    
    <div class="computer-display">
      <div class="computer-interior">
        <img src="/comp.png" alt="Computer interior background" class="background-image" />
        <div class="cables">
          <div class="cable cable1"></div>
          <div class="cable cable2"></div>
          <div class="cable cable3"></div>
        </div>
        
        <div class="component cpu" on:click={() => showPopup('cpu')}>CPU</div>
        <div class="component ram" on:click={() => showPopup('ram')}>RAM</div>
        <div class="component motherboard" on:click={() => showPopup('motherboard')}>MOTHERBOARD</div>
        <div class="component gpu" on:click={() => showPopup('gpu')}>VIDEO CARD</div>
        <div class="component psu" on:click={() => showPopup('psu')} >PSU</div>
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

{#if activePopup === 'motherboard'}
  <div class="popup" on:click={handleBackdropClick}>
    <div class="popup-content">
      <button class="popup-close" on:click={closePopup}>&times;</button>
      <h2>Motherboard</h2>
      <p>TThe motherboard is the primary printed circuit board (PCB) in a computer. It’s basically the backbone of a computer, and enables all parts to work together. It connects and allows communication between all the different hardware components (such as the CPU, RAM, storage devices, GPU, peripherals).</p>
    </div>
  </div>
{/if}

{#if activePopup === 'psu'}
  <div class="popup" on:click={handleBackdropClick}>
    <div class="popup-content">
      <button class="popup-close" on:click={closePopup}>&times;</button>
      <h2>Power Supply Unit (PSU)</h2>
      <p>TA Power Supply Unit (PSU) converts electricity from a wall outlet into usable power for a computer’s internal components. It distributes the correct voltage and current to parts like the motherboard, CPU, GPU, and storage devices.</p>
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

<!-- Quiz Section -->
<div class="quiz-section">
  <div class="quiz-container">
    {#if !quizMode}
      <div class="quiz-intro">
        <h2>Test Your Knowledge!</h2>
        <p>Take our mini quiz</p>
        <button class="quiz-start-btn" on:click={startQuiz}>Start Quiz</button>
      </div>
    {:else if !showResults}
      <div class="quiz-question">
        <div class="quiz-header">
          <h2>Question {currentQuestion + 1} of {currentQuizQuestions.length}</h2>
          <div class="quiz-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: {((currentQuestion + 1) / currentQuizQuestions.length) * 100}%"></div>
            </div>
            <span class="score">Score: {score}/{currentQuestion}</span>
          </div>
        </div>
        
        <div class="question-content">
          <h3>{currentQuizQuestions[currentQuestion].question}</h3>
          
          <div class="answer-options">
            {#each currentQuizQuestions[currentQuestion].options as option, index}
              <button 
                class="answer-btn {selectedAnswer === index ? 'selected' : ''} {showCorrectAnswer && index === currentQuizQuestions[currentQuestion].correct ? 'correct' : ''} {showCorrectAnswer && selectedAnswer === index && index !== currentQuizQuestions[currentQuestion].correct ? 'incorrect' : ''}"
                on:click={() => selectAnswer(index)}
                disabled={showCorrectAnswer}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            {/each}
          </div>
          
          {#if showCorrectAnswer}
            <div class="correct-answer">
              <h4>Correct Answer: {String.fromCharCode(65 + currentQuizQuestions[currentQuestion].correct)}. {currentQuizQuestions[currentQuestion].options[currentQuizQuestions[currentQuestion].correct]}</h4>
              <p>{currentQuizQuestions[currentQuestion].explanation}</p>
            </div>
          {/if}
          
          <div class="quiz-actions">
            {#if selectedAnswer !== null && !showCorrectAnswer}
              <button class="submit-btn" on:click={submitAnswer}>
                Submit Answer
              </button>
            {:else if showCorrectAnswer}
              <button class="continue-btn" on:click={continueToNext}>
                {currentQuestion === currentQuizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <div class="quiz-results">
        <h2>Quiz Complete!</h2>
        <div class="results-content">
          <div class="score-display">
            <h3>Your Score: {score}/{currentQuizQuestions.length}</h3>
            <div class="score-percentage">
              {Math.round((score / currentQuizQuestions.length) * 100)}%
            </div>
            <div class="score-message">
              {#if score === currentQuizQuestions.length}
                Perfect, you're a computer expert! 
              {:else if score >= currentQuizQuestions.length * 0.8}
                Great job! 
              {:else if score >= currentQuizQuestions.length * 0.6}
                Good work! Keep learning! 
              {:else}
                Keep studying with our interactive model and flashcards!
              {/if}
            </div>
          </div>
          
          <button class="retry-btn" on:click={resetQuiz}>Take Quiz Again</button>
        </div>
      </div>
    {/if}
  </div>
</div>

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
    height: 600px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }

  .computer-interior {
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #2c3e50, #34495e);
    background-image: url('/comp.png'); 
    background-size: cover;  
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
  }

  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    opacity: 0.3;  
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
    z-index: 1;  
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

  .component:focus {
    outline: 3px solid #ffcc00;
    outline-offset: 2px;
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

  .quiz-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 60px 20px;
    margin-top: 40px;
  }

  .quiz-container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .quiz-intro {
    text-align: center;
  }

  .quiz-intro h2 {
    color: #333;
    font-size: 2.5rem;
    margin-bottom: 20px;
  }

  .quiz-intro p {
    color: #666;
    font-size: 1.2rem;
    margin-bottom: 30px;
  }

  .quiz-start-btn {
    background: linear-gradient(45deg, #4CAF50, #45a049);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 50px;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
  }

  .quiz-start-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }

  .quiz-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #f0f0f0;
  }

  .quiz-header h2 {
    color: #333;
    font-size: 1.5rem;
  }

  .quiz-progress {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .progress-bar {
    width: 150px;
    height: 8px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(45deg, #4CAF50, #45a049);
    transition: width 0.3s ease;
  }

  .score {
    font-weight: bold;
    color: #333;
  }

  .question-content h3 {
    color: #333;
    font-size: 1.3rem;
    margin-bottom: 25px;
    line-height: 1.4;
  }

  .answer-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 30px;
  }

  .answer-btn {
    background: white;
    border: 2px solid #e0e0e0;
    padding: 15px 20px;
    border-radius: 10px;
    text-align: left;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #333;
  }

  .answer-btn:hover {
    border-color: #4CAF50;
    background: #f9f9f9;
  }

  .answer-btn.selected {
    border-color: #4CAF50;
    background: #e8f5e8;
    color: #2e7d32;
  }

  .submit-btn {
    background: linear-gradient(45deg, #2196F3, #1976D2);
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .submit-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }

  .quiz-results {
    text-align: center;
  }

  .quiz-results h2 {
    color: #333;
    font-size: 2rem;
    margin-bottom: 30px;
  }

  .score-display {
    margin-bottom: 30px;
  }

  .score-display h3 {
    color: #333;
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  .score-percentage {
    font-size: 3rem;
    font-weight: bold;
    color: #4CAF50;
    margin-bottom: 15px;
  }

  .score-message {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 20px;
  }

  .retry-btn {
    background: linear-gradient(45deg, #4CAF50, #45a049);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
  }

  .retry-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
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

    .quiz-container {
      padding: 20px;
      margin: 0 10px;
    }
    
    .quiz-header {
      flex-direction: column;
      gap: 15px;
    }
    
    .quiz-progress {
      width: 100%;
      justify-content: center;
    }
    
    .answer-btn {
      font-size: 0.9rem;
      padding: 12px 15px;
    }
  }

  .answer-btn.correct {
    border-color: #4CAF50;
    background: #e8f5e8;
    color: #2e7d32;
  }

  .answer-btn.incorrect {
    border-color: #f44336;
    background: #ffebee;
    color: #c62828;
  }

  .correct-answer {
    background: #e8f5e8;
    border: 2px solid #4CAF50;
    border-radius: 10px;
    padding: 15px;
    margin: 20px 0;
  }

  .correct-answer h4 {
    color: #2e7d32;
    margin-bottom: 10px;
    font-size: 1.1rem;
  }

  .correct-answer p {
    color: #666;
    margin: 0;
    line-height: 1.4;
  }

  .continue-btn {
    background: linear-gradient(45deg, #4CAF50, #45a049);
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }

  .continue-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }
</style>