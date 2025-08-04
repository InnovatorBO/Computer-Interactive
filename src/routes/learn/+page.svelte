<script lang="ts">
  let activePopup: string | null = $state(null);

  function showPopup(popupId: string) {
    if (activePopup) {
      closePopup();
    }
    activePopup = popupId;
  }

  function closePopup() {
    activePopup = null;
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      closePopup();
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closePopup();
    }
  }

  function handleBackdropKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
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
      <button class="info-button" onclick={() => showPopup('cpu')}>▼ Click for CPU info</button>
      <button class="info-button" onclick={() => showPopup('ram')}>▼ Click for RAM info</button>
      <button class="info-button" onclick={() => showPopup('gpu')}>▼ Click for GPU info</button>
      <button class="info-button" onclick={() => showPopup('storage')}>▼ Click for Storage info</button>
    </div>
    
    <div class="computer-display">
      <div class="computer-interior">
        <div class="cables">
          <div class="cable cable1"></div>
          <div class="cable cable2"></div>
          <div class="cable cable3"></div>
        </div>
        
        <button class="component cpu" onclick={() => showPopup('cpu')}>CPU</button>
        <button class="component ram" onclick={() => showPopup('ram')}>RAM</button>
        <div class="component motherboard">MOTHERBOARD</div>
        <button class="component gpu" onclick={() => showPopup('gpu')}>VIDEO CARD</button>
        <div class="component psu">PSU</div>
        <button class="component storage" onclick={() => showPopup('storage')}>HARD DRIVE</button>
      </div>
    </div>
  </div>
  
  <button class="help-button" onclick={() => showPopup('help')}>?</button>
</div>

<!-- Popups -->
{#if activePopup === 'cpu'}
  <div 
    class="popup" 
    onclick={handleBackdropClick}
    onkeydown={handleBackdropKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="cpu-title"
    tabindex="-1"
  >
    <div class="popup-content">
      <button class="popup-close" onclick={closePopup} aria-label="Close popup">&times;</button>
      <h2 id="cpu-title">Central Processing Unit (CPU)</h2>
      <p>The CPU is the brain of your computer. It executes instructions from programs and performs calculations. Modern CPUs have multiple cores that can handle different tasks simultaneously, making your computer faster and more efficient. The CPU's speed is measured in gigahertz (GHz), and it works closely with RAM to process data quickly.</p>
    </div>
  </div>
{/if}

{#if activePopup === 'ram'}
  <div 
    class="popup" 
    onclick={handleBackdropClick}
    onkeydown={handleBackdropKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="ram-title"
    tabindex="-1"
  >
    <div class="popup-content">
      <button class="popup-close" onclick={closePopup} aria-label="Close popup">&times;</button>
      <h2 id="ram-title">Random Access Memory (RAM)</h2>
      <p>RAM is your computer's temporary workspace. It stores data that the CPU needs to access quickly while programs are running. More RAM allows you to run more programs simultaneously without slowing down. Unlike storage drives, RAM is volatile, meaning it loses all data when the computer is turned off. Common RAM sizes today range from 8GB to 32GB or more.</p>
    </div>
  </div>
{/if}

{#if activePopup === 'gpu'}
  <div 
    class="popup" 
    onclick={handleBackdropClick}
    onkeydown={handleBackdropKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="gpu-title"
    tabindex="-1"
  >
    <div class="popup-content">
      <button class="popup-close" onclick={closePopup} aria-label="Close popup">&times;</button>
      <h2 id="gpu-title">Graphics Processing Unit (Video Card)</h2>
      <p>The GPU handles all visual processing for your computer. It renders images, videos, and animations you see on your screen. While basic tasks can use integrated graphics, dedicated video cards are essential for gaming, video editing, 3D modeling, and AI workloads. Modern GPUs have thousands of small cores optimized for parallel processing tasks.</p>
    </div>
  </div>
{/if}

{#if activePopup === 'storage'}
  <div 
    class="popup" 
    onclick={handleBackdropClick}
    onkeydown={handleBackdropKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="storage-title"
    tabindex="-1"
  >
    <div class="popup-content">
      <button class="popup-close" onclick={closePopup} aria-label="Close popup">&times;</button>
      <h2 id="storage-title">Storage Drive (Hard Drive/SSD)</h2>
      <p>Storage drives permanently store your data, programs, and operating system. Traditional hard drives (HDDs) use spinning disks, while solid-state drives (SSDs) use flash memory for faster access. SSDs are much faster than HDDs, making your computer boot quicker and programs load faster. Your storage capacity determines how much data you can keep on your computer.</p>
    </div>
  </div>
{/if}

{#if activePopup === 'help'}
  <div 
    class="popup" 
    onclick={handleBackdropClick}
    onkeydown={handleBackdropKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="help-title"
    tabindex="-1"
  >
    <div class="popup-content">
      <button class="popup-close" onclick={closePopup} aria-label="Close popup">&times;</button>
      <h2 id="help-title">How to Use This Explorer</h2>
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
        <button class="quiz-start-btn" onclick={startQuiz}>Start Quiz</button>
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
                onclick={() => selectAnswer(index)}
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
              <button class="submit-btn" onclick={submitAnswer}>
                Submit Answer
              </button>
            {:else if showCorrectAnswer}
              <button class="continue-btn" onclick={continueToNext}>
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
          
          <button class="retry-btn" onclick={resetQuiz}>Take Quiz Again</button>
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
    min-height: 100vh;
    width: 100%;
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
    z-index: 10;
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
    z-index: 1;
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