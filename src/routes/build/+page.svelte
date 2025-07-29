<script lang='ts'>
    let computerComponents = [
    { id: 1, name: 'CPU', icon: '🧠' },
    { id: 2, name: 'GPU', icon: '🎮' },
    { id: 3, name: 'RAM', icon: '💾' },
  ];
  let droppedItems = []

  function onDragStart(event, item) {
    event.dataTransfer.setData('application/json', JSON.stringify(item));
  }

  function onDrop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('application/json')
    if (data) {
        const item = JSON.parse(data);
        droppedItems = [...droppedItems, item];
    }
  }

  function onDragOver(event) {
    event.preventDefault();
  }
</script>

<style>
  .container {
    display: flex;
    height: 300px;
    border: 2px solid #ccc;
  }
  .sidebar {
    width: 150px;
    border-right: 2px solid #ccc;
    padding: 1rem;
    background: #f9f9f9;
  }
  .sidebar-item {
    cursor: grab;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border: 1px solid #aaa;
    border-radius: 4px;
    text-align: center;
    user-select: none;
    font-size: 1.5rem;
  }
  .drop-area {
    flex-grow: 1;
    padding: 1rem;
    background: #fff;
  }
  .dropped-item {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
</style>

<div class="container">
  <div class="sidebar">
    <h3>Parts</h3>
    {#each computerComponents as item}
      <div
        class="sidebar-item"
        draggable="true"
        on:dragstart={(e) => onDragStart(e, item)}
        title={item.name}
      >
        {item.icon}
        <div style="font-size: 0.8rem;">{item.name}</div>
      </div>
    {/each}
  </div>

  <div
    class="drop-area"
    on:drop={onDrop}
    on:dragover={onDragOver}
  >
    <h3>Your Build</h3>
    {#if droppedItems.length === 0}
      <p>Drag parts here</p>
    {/if}
    {#each droppedItems as ditem (ditem.id)}
      <div class="dropped-item" title={ditem.name}>{ditem.icon} {ditem.name}</div>
    {/each}
  </div>
</div>