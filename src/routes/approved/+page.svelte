<script>
  import { onMount } from 'svelte';
  import ReportList from '$lib/ReportList.svelte';

  let reports = $state([]);
  let loading = $state(false);

  const API_BASE = 'http://localhost:3000/api';

  async function loadApprovedReports() {
    loading = true;
    try {
      const response = await fetch(`${API_BASE}/reports/approved`);
      const data = await response.json();
      reports = data;
    } catch (error) {
      console.error('Onaylanan raporlar yüklenirken hata:', error);
      alert('Onaylanan raporlar yüklenirken bir hata oluştu.');
    } finally {
      loading = false;
    }
  }

  async function deleteReport(reportId) {
    if (!confirm('Bu raporu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/reports/${reportId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadApprovedReports();
      } else {
        throw new Error('Silme işlemi başarısız');
      }
    } catch (error) {
      console.error('Rapor silinirken hata:', error);
      alert('Rapor silinirken bir hata oluştu.');
    }
  }

  $effect(() => {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const currentLink = document.querySelector('a[href="/approved"]');
    if (currentLink) {
      currentLink.classList.add('active');
    }
  });

  onMount(() => {
    loadApprovedReports();
  });
</script>

<svelte:head>
  <title>Onaylanan Raporlar - Rapor Yönetimi</title>
</svelte:head>

<div class="page-content">
  <div class="page-header">
    <h2>Onaylanan Raporlar</h2>
    <p class="page-description">
      Onaylamış olduğunuz raporları burada görüntüleyebilirsiniz. Bu raporlar işlem görmüş ve onaylanmış durumdadır.
    </p>
  </div>

  {#if loading}
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Onaylanan raporlar yükleniyor...</p>
    </div>
  {:else}
    <ReportList 
      {reports} 
      pageType="approved"
      deleteReport={deleteReport}
    />
  {/if}
</div>

<style>
  .page-content {
    min-height: 70vh;
  }

  .page-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .page-header h2 {
    color: #333;
    margin-bottom: 10px;
    font-size: 2.5rem;
    font-weight: 600;
  }

  .page-description {
    color: #666;
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    color: #666;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #28a745;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .page-header h2 {
      font-size: 2rem;
    }
    
    .page-description {
      font-size: 1rem;
      padding: 0 20px;
    }
  }
</style>