<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
</script>

<div class="page-wrapper">
  <nav class="nav-container">
    <div class="nav-links">
      <a href="/" class:active={$page.url.pathname === '/'}>Home</a>
      <a href="/learn" class:active={$page.url.pathname === '/learn'}>Learn</a>
      <a href="/interactive" class:active={$page.url.pathname === '/interactive'}>Interactive</a>
      <a href="/game_page" class:active={$page.url.pathname === '/game_page'}>Game</a>
      <a href='/explore' class:active={$page.url.pathname === '/explore'}>Explore</a>
      <a href='/build' class:active={$page.url.pathname === '/build'}>Build</a>
    </div>
  </nav>

  <main class="main-content">
    <slot />
  </main>

  <footer class="footer">
    <p>Stuff about branchout and copyright and credits and everything legal</p>
  </footer>
</div>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    height: 100%;
  }

  :global(#svelte) {
    height: 100%;
  }

  .page-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .nav-container {
    padding: 1rem;
    border-bottom: 1px solid #000000;
    background: #000000;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .nav-links a {
    text-decoration: none;
    color: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .nav-links a:hover {
    background-color: #e9ecef;
  }

  .nav-links a.active {
    background-color: linear-gradient(135deg, #0497ad, #02c75b);
    background: linear-gradient(135deg, #0497ad, #02c75b);
    color: white;
  }

  .main-content {
    flex: 1;
  }

  .footer {
    background-color: #000000;
    color: white;
    padding: 20px 20px;
    text-align: center;
  }

  .footer p {
    font-size: 1.1rem;
    font-weight: 300;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;
  }
</style>