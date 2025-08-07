<script lang="ts">
  import { page } from '$app/stores';
  import '../styles/global.css';
  import { onMount } from 'svelte';
  let menuOpen = false;
</script>

<div class="page-wrapper">
  <nav class="nav-container" on:mouseleave={() => (menuOpen = false)}>
    <div class="nav-inner">
      <div class="logo-section">
        <img src="./ttm-logo.png" alt="Logo" class="logo" />
      </div>
      <button class="menu-toggle" on:click={() => (menuOpen = !menuOpen)}>
        {menuOpen ? '✕' : '☰'}
      </button>
      <div class="nav-links" class:open={menuOpen}>
        <a href="/" class:active={$page.url.pathname === '/'}>Home</a>
        <a href="/learn" class:active={$page.url.pathname === '/learn'}>Learn</a>
        <a href="/flashcards" class:active={$page.url.pathname === '/flashcards'}>Flashcards</a>
        <a href="/interactive" class:active={$page.url.pathname === '/interactive'}>Interactive</a>
        <a href="/explore" class:active={$page.url.pathname === '/explore'}>Explore</a>
        <a href="/build" class:active={$page.url.pathname === '/build'}>Build</a>
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
    width: 100%;
    background: #000;
    padding: 0.5rem 0;
  }

  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .logo-section {
    margin-left: 0;
    margin-right: 2rem;
  }

  .logo {
    height: 60px;
    width: auto;
    object-fit: contain;
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;
  }

  .nav-links a {
    text-decoration: none;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: bold;
    transition: all 0.3s ease-in-out;
  }

  .nav-links a:hover {
    background-color: #373a38;
    transform: translateY(-1px);
  }

  .nav-links a.active {
    background: linear-gradient(135deg, #0496ada1, #02c75ba4); /*#02c75b;*/
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

  .menu-toggle {
    display: none;
    font-size: 2rem;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
  }

  @media (max-width: 768px) {
    .nav-container {
      position: relative;
      z-index: 1000;
    }

    .nav-inner {
      flex-direction: row;
      padding: 0 1rem;
    }

    .menu-toggle {
      display: block;
      order: 1;
    }

    .logo {
      order: 0;
    }

    .nav-links {
      display: none;
      flex-direction: column;
      width: 100%;
      background: #000;
      position: absolute;
      left: 0;
      top: 75px;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    }

    .nav-links.open {
      display: flex;
    }

    .nav-links a {
      width: 100%;
      text-align: center;
      /*border-top: 1px solid #333;*/
    }
  }
</style>