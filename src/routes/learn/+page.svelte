<script lang="ts">
  let title = 'Learn Page';
  let topics: string[] = [];
  let newTopic = '';
  
  // Add your learn page functions here
  function addTopic() {
    if (newTopic.trim()) {
      topics = [...topics, newTopic.trim()];
      newTopic = '';
    }
  }

  function removeTopic(index: number) {
    topics = topics.filter((_, i) => i !== index);
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="page-container">
  <h1>{title}</h1>
  <p>This is the learning section where you can add educational content.</p>
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

  .input-group {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  .action-btn {
    background: #28a745;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }

  .action-btn:hover {
    background: #218838;
  }

  .topic-list {
    list-style: none;
    padding: 0;
  }

  .topic-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background: white;
    border: 1px solid #e2e2e2;
    border-radius: 4px;
  }

  .remove-btn {
    background: #dc3545;
    color: white;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .remove-btn:hover {
    background: #c82333;
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