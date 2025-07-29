<script lang="ts">
  let title = 'Computer Hardware Learning Platform';
  
  // Add your home page functions here
  function handleHomeAction() {
    console.log('Home action triggered');
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="page-container">
  <h1>{title}</h1>
  <p>Learn about computer hardware components through interactive experiences!</p>
  
  <div class="features-grid">
    <div class="feature-card">
      <h2>🎮 Performance Simulator</h2>
      <p>Build virtual computers and see how different components affect performance. Test gaming, productivity, and multitasking scenarios.</p>
      <a href="/interactive" class="feature-btn">Try Simulator</a>
    </div>
    
    <div class="feature-card">
      <h2>📚 Learning Resources</h2>
      <p>Explore educational content about computer hardware components, their functions, and how they work together.</p>
      <a href="/learn" class="feature-btn">Start Learning</a>
    </div>
  </div>

  <div class="content-section">
    <h2>What You'll Learn</h2>
    <div class="topics-grid">
      <div class="topic-item">
        <h3>🖥️ CPU (Central Processing Unit)</h3>
        <p>The brain of your computer - learn about cores, threads, clock speeds, and how they impact performance.</p>
      </div>
      
      <div class="topic-item">
        <h3>🎯 GPU (Graphics Processing Unit)</h3>
        <p>Specialized processors for graphics and parallel computing - essential for gaming and creative work.</p>
      </div>
      
      <div class="topic-item">
        <h3>💾 RAM (Random Access Memory)</h3>
        <p>Fast temporary storage that your computer uses for active programs and data processing.</p>
      </div>
      
      <div class="topic-item">
        <h3>💿 Storage</h3>
        <p>Long-term data storage including HDDs, SSDs, and NVMe drives - learn about speed vs capacity trade-offs.</p>
      </div>
    </div>
  </div>
</div>

<style>
  .page-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    color: #333;
    margin-bottom: 0.5rem;
    text-align: center;
    font-size: 2.5rem;
  }

  p {
    color: #666;
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }

  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .feature-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }

  .feature-card h2 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .feature-card p {
    margin-bottom: 1.5rem;
    opacity: 0.9;
    text-align: center;
  }

  .feature-btn {
    display: inline-block;
    background: rgba(255,255,255,0.2);
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    border: 2px solid rgba(255,255,255,0.3);
    transition: all 0.3s ease;
  }

  .feature-btn:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
  }

  .content-section {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 2rem;
    border: 1px solid #e9ecef;
  }

  .content-section h2 {
    color: #495057;
    margin-bottom: 1.5rem;
    text-align: center;
    font-size: 2rem;
  }

  .topics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .topic-item {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #dee2e6;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .topic-item h3 {
    color: #495057;
    margin-bottom: 0.75rem;
    font-size: 1.2rem;
  }

  .topic-item p {
    color: #6c757d;
    margin: 0;
    text-align: left;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .features-grid {
      grid-template-columns: 1fr;
    }
    
    .topics-grid {
      grid-template-columns: 1fr;
    }
  }
</style>