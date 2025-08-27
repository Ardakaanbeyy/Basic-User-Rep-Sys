<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import ReportList from '$lib/ReportList.svelte';

  let reports = $state([]);
  let loading = $state(false);

  const API_BASE = 'http://localhost:3000/api';

  async function loadReports() {
    loading = true;
    try {
      const response = await fetch(`${API_BASE}/reports`);
      const data = await response.json();
      reports = data;
    } catch (error) {
      console.error('Raporlar yüklenirken hata:', error);
      alert('Raporlar yüklenirken bir hata oluştu.');
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
        await loadReports();
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
        await loadReports();
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
    
    const currentLink = document.querySelector('a[href="/"]');
    if (currentLink) {
      currentLink.classList.add('active');
    }
  });

  onMount(() => {
    loadReports();
  });
</script>

<svelte:head>
  <title>Tüm Raporlar - Rapor Yönetimi</title>
</svelte:head>

<div class="page-content">
  <div class="page-header">
    <h2>Tüm Raporlar</h2>
    <p class="page-description">
      Sisteme gönderilmiş tüm raporları görüntüleyin. Onaylanmamış raporları onaylayabilir veya raporları silebilirsiniz.
    </p>
  </div>

  {#if loading}
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Raporlar yükleniyor...</p>
    </div>
  {:else}
    <ReportList 
      {reports} 
      pageType="all"
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
    border-top: 4px solid #007bff;
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