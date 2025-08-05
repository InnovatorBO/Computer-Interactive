<script>
  import { page } from '$app/stores';
  
  $: currentPath = $page.url.pathname;
</script>

<nav class="navbar">
  <div class="nav-container">
    <div class="nav-brand">
      <a href="/">My Svelte Site</a>
    </div>
    
    <ul class="nav-links">
      <li>
        <a href="/" class:active={currentPath === '/'}>
          Home
        </a>
      </li>
      <li>
        <a href="/learn" class:active={currentPath === '/learn'}>
          Learn
        </a>
      </li>
      <li>
        <a href="/interactive" class:active={currentPath === '/interactive'}>
          Interactive
        </a>
      </li>
      <li>
        <a href="/game_page" class:active={currentPath === '/game_page'}>
          Game
        </a>
      </li>
    </ul>
  </div>
</nav>

<style>
  main {

  }
  
  .navbar {
    background-color: #2c3e50;
    padding: 1rem 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
  }
  
  .nav-brand a {
    color: white;
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .nav-links {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 2rem;
  }
  
  .nav-links a {
    color: #ecf0f1;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  .nav-links a:hover {
    background-color: #34495e;
    color: white;
  }
  
  .nav-links a.active {
    background-color: #3498db;
    color: white;
  }
  
  @media (max-width: 768px) {
    .nav-container {
      flex-direction: column;
      gap: 1rem;
    }
    
    .nav-links {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }
  }
</style>