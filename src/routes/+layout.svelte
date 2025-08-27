<script>
  import '../app.css';
</script>

<div class="app">
  <header>
    <h1>Rapor Yönetim Sistemi</h1>
    <nav>
      <a href="/" class="nav-link">Tümü</a>
      <a href="/pending" class="nav-link">Onaylanmayanlar</a>
      <a href="/approved" class="nav-link">Onaylananlar</a>
    </nav>
  </header>
  
  <main>
    <slot />
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #f5f5f5;
  }

  .app {
    min-height: 100vh;
  }

  header {
    background: white;
    border-bottom: 1px solid #e1e5e9;
    padding: 20px;
    margin-bottom: 20px;
  }

  h1 {
    text-align: center;
    color: #333;
    margin: 0 0 20px 0;
  }

  nav {
    display: flex;
    justify-content: center;
    gap: 20px;
  }

  .nav-link {
    padding: 12px 24px;
    text-decoration: none;
    color: #666;
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }

  .nav-link:hover {
    color: #007bff;
    background-color: #f8f9fa;
    border-color: #007bff;
  }

  :global(.nav-link.active) {
    color: #007bff;
    background-color: #e3f2fd;
    border-color: #007bff;
  }

  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  @media (max-width: 768px) {
    nav {
      flex-direction: column;
      align-items: center;
    }
    
    .nav-link {
      width: 200px;
      text-align: center;
    }
  }
</style>