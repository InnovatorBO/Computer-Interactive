<script lang="ts">
  let showCards = false;

  // List of flashcard image paths
  const flashcardImages = Array.from({ length: 20 }, (_, i) => `/flashcards${i + 1}.png`);

  function toggleCards() {
    showCards = !showCards;
  }
</script>

<div class="flashcards-page">
  <button class="toggle-button" on:click={toggleCards}>
    Terms in this set
    <span class="arrow">{showCards ? '▾' : '▸'}</span>
  </button>

  {#if showCards}
    <div class="flashcards-container">
      {#each flashcardImages as src}
        <div class="flashcard-item">
          <img src={src} alt="Flashcard" />
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .flashcards-page {
    padding: 20px;
  }

  .toggle-button {
    background: linear-gradient(135deg, #0497ad, #02c75b);
    color: white;
    border: none;
    padding: 12px 18px;
    font-size: 1.2rem;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background 0.2s ease-in-out;
    margin-bottom: 20px;
  }

  .toggle-button:hover {
    background: #305bb5;
  }

  .arrow {
    font-size: 1.2rem;
  }

  .flashcards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }

  .flashcard-item img {
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
</style>