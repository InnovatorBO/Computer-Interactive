<script>
  import ThreeModel from '$lib/threeModel.svelte';
  let title = 'Home Page';

  // Add your home page functions here
  function handleHomeAction() {
    console.log('Home action triggered');
  }
</script>

<main>
  <h1>3D Model Viewer</h1>
  <ThreeModel />
</main>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="page-container">
  <h1>{title}</h1>
  <p>Welcome to the home page. This is your starting point.</p>
  
  <div class="content-section">
    <h2>Getting Started</h2>
    <p>Add stuff</p>
    
    <button on:click={handleHomeAction} class="action-btn">
      Home Action
    </button>
  </div>
</div>

<style>
  .page-container {
    min-height: 400px;
  }

  .content-section {
    margin-top: 2rem;
    padding: 1.5rem;
    border: 1px solid #e2e2e2;
    border-radius: 8px;
    background: #fafafa;
  }

  .action-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 1rem;
  }

  .action-btn:hover {
    background: #0056b3;
  }

  h1 {
    color: #333;
    margin-bottom: 1rem;
  }

  h2 {
    color: #555;
    margin-bottom: 0.5rem;
  }
</style>