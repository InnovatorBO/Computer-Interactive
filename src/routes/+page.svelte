<script>
  import ThreeModel from '$lib/threeModel.svelte';
  let title = 'Home Page';

  // Add your home page functions here
  function handleHomeAction() {
    console.log('Home action triggered');
  }
</script>

<main>
  <h1>3D Model Viewer</h1>
  <ThreeModel />
</main>

<svelte:head>
    <title>Home Page</title>
</svelte:head>

<div class="main-content">
    <h1>Home Page</h1>
    <p>Description/about the product</p>
    <a href="#" class="cta-button" on:click={handleHomeAction}>Go to Product</a>
</div>

<style>
    .main-content {
        flex: 1;
        background: linear-gradient(135deg, 
#2c3e50, 
#34495e);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 300px 20px;
        text-align: center;
    }

    .main-content h1 {
        color: white;
        font-size: 4rem;
        font-weight: 300;
        margin-bottom: 2rem;
        letter-spacing: 2px;
    }

    .main-content p {
        color: white;
        font-size: 2rem;
        font-weight: 300;
        margin-bottom: 3rem;
        opacity: 0.9;
    }

    .cta-button {
        background: linear-gradient(135deg, 
#0497ad, 
#02c75b);
        color: 
#2c3e50;
        padding: 20px 40px;
        border: white 2px solid;
        border-radius: 50px;
        font-size: 1.2rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(26, 188, 156, 0.3);
    }

    .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(26, 188, 156, 0.4);
    }

    @media (max-width: 768px) {
        .main-content h1 {
            font-size: 2.5rem;
        }

        .main-content p {
            font-size: 1.5rem;
        }

        .cta-button {
            padding: 15px 30px;
            font-size: 1rem;
        }
    }
</style>