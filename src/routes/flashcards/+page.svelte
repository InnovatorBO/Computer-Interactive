<script lang="ts">
  let showFlashcards = false;
  const flashcards = Array.from({ length: 20 }, (_, i) => `/flashcards${i + 1}.png`);

  let selectedImage: string | null = null;

  function openImage(src: string) {
    selectedImage = src;
  }

  function closeImage(e: MouseEvent) {
    // Close only if you click the backdrop, not the image
    if (e.target === e.currentTarget) {
      selectedImage = null;
    }
  }
</script>

<div class="container">
  <button class="toggle-btn" on:click={() => (showFlashcards = !showFlashcards)}>
    Terms in this set
    <span class="arrow">{showFlashcards ? '▼' : '▶'}</span>
  </button>

  {#if showFlashcards}
    <div class="flashcards-grid">
      {#each flashcards as src}
        <div class="flashcard" on:click={() => openImage(src)}>
          <img src={src} alt="Flashcard" />
        </div>
      {/each}
    </div>
  {/if}

  {#if selectedImage}
    <div class="modal-backdrop" on:click={closeImage}>
      <img src={selectedImage} alt="Selected flashcard" class="modal-image" />
    </div>
  {/if}
</div>

<style>
.container {
  padding: 2rem;
}

/* --- BUTTON --- */
.toggle-btn {
  background: linear-gradient(135deg, #00c6ff, #02c75b);
  border: none;
  color: white;
  font-size: 1.2rem;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.toggle-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 198, 255, 0.5);
}

.arrow {
  font-size: 1.2rem;
}

.flashcards-grid {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
  gap: 1.5rem; 
  justify-content: center;
}

.flashcard {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.flashcard img {
  width: 100%;
  max-width: 300px; 
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.flashcard:hover img {
  transform: scale(1.08);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
}

/* --- MODAL --- */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-image {
  max-width: 90%;
  max-height: 90%;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
}
</style>