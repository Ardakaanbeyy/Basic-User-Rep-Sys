<script>
  import { onMount } from 'svelte';
  import ReportList from '$lib/ReportList.svelte';

  let reports = $state([]);
  let loading = $state(false);

  const API_BASE = 'http://localhost:3000/api';

  async function loadPendingReports() {
    loading = true;
    try {
      const response = await fetch(`${API_BASE}/reports/pending`);
      const data = await response.json();
      reports = data;
    } catch (error) {
      console.error('Onaylanmayan raporlar yüklenirken hata:', error);
      alert('Onaylanmayan raporlar yüklenirken bir hata oluştu.');
    } finally {
      loading = false;
    }
  }

  async function approveReport(reportId) {
    try {
      const response = await fetch(`${API_BASE}/reports/${reportId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await loadPendingReports();
      } else {
        throw new Error('Onaylama işlemi başarısız');
      }
    } catch (error) {
      console.error('Rapor onaylanırken hata:', error);
      alert('Rapor onaylanırken bir hata oluştu.');
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
        await loadPendingReports();
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
    
    const currentLink = document.querySelector('a[href="/pending"]');
    if (currentLink) {
      currentLink.classList.add('active');
    }
  });

  onMount(() => {
    loadPendingReports();
  });
</script>

<svelte:head>
  <title>Onaylanmayan Raporlar - Rapor Yönetimi</title>
</svelte:head>

<div class="page-content">
  <div class="page-header">
    <h2>Onaylanmayan Raporlar</h2>
    <p class="page-description">
      Henüz onaylanmamış raporları görüntüleyin. Bu raporları onaylayabilir veya silebilirsiniz. 
      Onaylanan raporlar bu listeden kaldırılır ve "Onaylananlar" sekmesinde görünür.
    </p>
    {#if !loading && reports.length > 0}
      <div class="action-info">
        <div class="info-card warning">
          <span class="info-icon">⚠️</span>
          <div class="info-text">
            <strong>{reports.length}</strong> rapor onay bekliyor
          </div>
        </div>
      </div>
    {/if}
  </div>

  {#if loading}
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Onaylanmayan raporlar yükleniyor...</p>
    </div>
  {:else}
    <ReportList 
      {reports} 
      pageType="pending"
      {approveReport}
      {deleteReport}
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
    margin: 0 auto 20px auto;
    line-height: 1.6;
  }

  .action-info {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .info-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px 25px;
    border-radius: 10px;
    font-size: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .info-card.warning {
    background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
    border: 1px solid #ffeaa7;
    color: #856404;
  }

  .info-icon {
    font-size: 1.2rem;
  }

  .info-text strong {
    font-weight: 700;
    color: #b8860b;
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
    border-top: 4px solid #ffc107;
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
    
    .info-card {
      flex-direction: column;
      text-align: center;
      gap: 8px;
    }
  }
</style>