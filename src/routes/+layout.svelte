<script lang="ts">
  import { page } from '$app/stores';
  import '../styles/global.css';
</script>

<div class="page-wrapper">
  <nav class="nav-container">
    <div class="nav-inner">
      <img src="./ttm-logo.png" alt="Logo" class="logo" />
      <div class="nav-links">
        <a href="/" class:active={$page.url.pathname === '/'}>Home</a>
        <a href="/learn" class:active={$page.url.pathname === '/learn'}>Learn</a>
        <a href= "/flashcards" class:active={$page.url.pathname === '/flashcards'}>Flashcards</a>
        <a href="/interactive" class:active={$page.url.pathname === '/interactive'}>Interactive</a>
        <a href= "/explore" class:active={$page.url.pathname === '/explore'}>Explore</a>
        <a href= "/build" class:active={$page.url.pathname === '/build'}>Build</a>
      </div>
    </div>
</nav>

  <main class="main-content">
    <slot />
  </main>

  <footer class="footer">
    <p>© 2025 Branchout – Credits, copyright and legal stuff</p>
  </footer>
</div>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  .page-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
 

  .nav-container {
    display: flex;
    height: 75px;
    width: 100%;
    background: #000;
    padding: 0 2rem;
    border-bottom: 1px solid #000;
    align-items: center;
  }

  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .logo {
    height: 60px;
    width: auto;
    object-fit: contain;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
  }

  .nav-links a {
    text-decoration: none;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: bold;
  }

  .nav-links a.active {
    background: #02c75b;
    color: white;
  }

  .main-content {
    flex: 1;
  }

  .footer {
    background-color: #000;
    color: white;
    text-align: center;
    padding: 1rem;
  }
</style>
