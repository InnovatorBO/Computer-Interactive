<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="page-wrapper">
  <nav class="nav-container">
    <div class="nav-links">
      <a href="/" class:active={$page.url.pathname === '/'}>Home</a>
      <a href="/learn" class:active={$page.url.pathname === '/learn'}>Learn</a>
      <a href="/interactive" class:active={$page.url.pathname === '/interactive'}>Interactive</a>
      <a href="/game" class:active={$page.url.pathname.toString() === '/game'}>Game</a>
      <a href="/flashcards" class:active={$page.url.pathname === '/flashcards'}>Flashcards</a>
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
  }

  .nav-container {
    padding: 1rem;
    background: #000;
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