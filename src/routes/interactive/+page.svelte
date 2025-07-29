<script lang="ts">
  let title = 'Interactive Page';
  let counter = 0;
  let userInput = '';
  let messages: string[] = [];
  
  // Add your interactive page functions here
  function increment() {
    counter++;
  }

  function decrement() {
    counter--;
  }

  function reset() {
    counter = 0;
  }

  function addMessage() {
    if (userInput.trim()) {
      messages = [...messages, userInput.trim()];
      userInput = '';
    }
  }

  function clearMessages() {
    messages = [];
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="page-container">
  <h1>{title}</h1>
  <p>Yay</p>
</div>

<style>
  .page-container {
    min-height: 400px;
    color: white;
    font-size: 2.5rem;
    margin-bottom: 10px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .content-section {
    margin-top: 2rem;
    padding: 1.5rem;
    border: 1px solid #e2e2e2;
    border-radius: 8px;
    background: #fafafa;
    background: #26343e;
  }

  .counter-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  .counter-btn {
    background: #007bff;
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: bold;
  }

  .counter-btn:hover {
    background: #0056b3;
  }

  .counter-display {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    min-width: 3rem;
    text-align: center;
  }

  .reset-btn {
    background: #6c757d;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }

  .reset-btn:hover {
    background: #545b62;
  }

  .input-group {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  .action-btn {
    background: #28a745;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }

  .action-btn:hover {
    background: #218838;
  }

  .clear-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }

  .clear-btn:hover {
    background: #c82333;
  }

  .messages {
    max-height: 300px;
    overflow-y: auto;
  }

  .message {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background: white;
    border: 1px solid #e2e2e2;
    border-radius: 4px;
  }

  .message-number {
    color: #6c757d;
    font-weight: bold;
    min-width: 2rem;
  }

  .message-text {
    flex: 1;
  }

  h1 {
    color: #ffffff;
    margin-bottom: 1rem;
  }

  h2 {
    color: #ffffff;
    margin-bottom: 0.5rem;
  }
</style>