<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
</script>

<nav class="nav-container">
  <div class="nav-links">
    <a href="/" class:active={$page.url.pathname === '/'}>Home</a>
    <a href="/learn" class:active={$page.url.pathname === '/learn'}>Learn</a>
    <a href="/explore" class:active={$page.url.pathname === '/explore'}>Explore</a>
    <a href="/build" class:active={$page.url.pathname === '/build'}>Build</a>
  </div>
</nav>

<main>
  <slot />
</main>

<style>
  .nav-container {
    padding: 1rem;
    border-bottom: 1px solid #e2e2e2;
    background: #f8f9fa;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .nav-links a {
    text-decoration: none;
    color: #333;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .nav-links a:hover {
    background-color: #e9ecef;
  }

  .nav-links a.active {
    background-color: #007bff;
    color: white;
  }

  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
</style>