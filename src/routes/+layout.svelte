<script lang="ts">
</script>

<header class="navbar">
  <div class="logo">
    <img src="/TTM_Logo.png" alt="Logo" />
    <span class="logo-text">The Thinking Machine</span>
  </div>
  <nav class="nav-links">
    <a href="/">Home</a>
    <a href="/learn">Learn</a>
    <a href="/interactive">Interactive</a>
  </nav>
</header>

<main>
  <slot />
</main>

<footer class="footer">
  <p>© 2025 Branchout – Credits, copyright and legal stuff</p>
</footer>

<style>
  :global(html, body, #svelte) {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
    font-family: Arial, sans-serif;
  }

  :global(body, #svelte) {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  main {
    flex: 1; 
    display: flex;
    flex-direction: column;
  }

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: black;
    padding: 1rem 2rem;
    color: white;
    flex-shrink: 0; /* Prevent navbar from shrinking */
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .logo img {
    height: 40px;
  }

  .logo-text {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;
  }

  .nav-links a {
    text-decoration: none;
    color: black;
    background: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: bold;
    transition: background-color 0.2s ease;
  }

  .nav-links a:hover {
    background: #ddd;
  }

  .footer {
    background: black;
    color: white;
    text-align: center;
    padding: 1rem;
    font-size: 0.9rem;
    flex-shrink: 0; /* Prevent footer from shrinking */
  }
</style>