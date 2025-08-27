<script>
  let { reports = [], pageType = 'all', approveReport, deleteReport } = $props();

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  function getPageTitle() {
    switch(pageType) {
      case 'approved': return 'Onaylanan Rapor';
      case 'pending': return 'Onay Bekleyen Rapor';
      default: return 'Toplam Rapor';
    }
  }

  function generateMangaLink(report) {
    const baseUrl = 'https://mangacix.net/books';
    if (report.chapter_num) {
      return `${baseUrl}/${report.title_id}/episode/${report.chapter_num}`;
    } else {
      return `${baseUrl}/${report.title_id}`;
    }
  }
</script>

<div class="report-list">
  {#if reports.length === 0}
    <div class="empty-state">
      <div class="empty-icon">📋</div>
      <h3>Henüz rapor bulunmuyor</h3>
      <p>
        {#if pageType === 'approved'}
          Henüz onaylanmış rapor yok. Tüm raporlar veya onaylanmayanlar sayfasından raporları onaylayabilirsiniz.
        {:else if pageType === 'pending'}
          Henüz onay bekleyen rapor yok. Tüm gelen raporlar onaylanmış durumda!
        {:else}
          Henüz hiç rapor eklenmemiş. Uygulamanızdan rapor gönderdiğinizde burada görünecek.
        {/if}
      </p>
    </div>
  {:else}
    <div class="reports-stats">
      <div class="stats-item">
        <span class="stats-number">{reports.length}</span>
        <span class="stats-label">
          {getPageTitle()}
        </span>
      </div>
      {#if pageType === 'all'}
        <div class="stats-item">
          <span class="stats-number">{reports.filter(r => r.approved).length}</span>
          <span class="stats-label">Onaylanan</span>
        </div>
        <div class="stats-item">
          <span class="stats-number">{reports.filter(r => !r.approved).length}</span>
          <span class="stats-label">Bekleyen</span>
        </div>
      {/if}
    </div>

    <div class="reports-grid">
      {#each reports as report}
        <div class="report-card">
          <div class="report-header">
            <div class="report-id">
              <strong>Başlık ID:</strong> {report.title_id}
            </div>
            <div class="report-status">
              {#if report.approved}
                <span class="status-badge approved">✓ Onaylandı</span>
              {:else}
                <span class="status-badge pending">⏳ Bekliyor</span>
              {/if}
            </div>
          </div>

          <div class="report-content">
            {#if report.chapter_num}
              <div class="report-field">
                <label>Bölüm Numarası:</label>
                <span class="chapter-badge">{report.chapter_num}</span>
              </div>
            {/if}

            {#if report.chapternumbers}
              <div class="report-field">
                <label>Bölüm Numaraları:</label>
                <span class="chapters-text">{report.chapternumbers}</span>
              </div>
            {/if}
            
            <div class="report-field">
              <label>Sebep:</label>
              <div class="reason-text">{report.reason}</div>
            </div>
            
            <div class="report-field">
              <label>Oluşturma Tarihi:</label>
              <span class="date-text">{formatDate(report.created_at)}</span>
            </div>

            <div class="report-field">
              <label>Manga Linki:</label>
              <a href={generateMangaLink(report)} target="_blank" class="manga-link">
                <span class="link-icon">🔗</span>
                {generateMangaLink(report)}
              </a>
            </div>
          </div>

          <div class="report-actions">
            {#if (pageType === 'all' || pageType === 'pending') && !report.approved && approveReport}
              <button 
                class="btn btn-approve"
                onclick={() => approveReport(report._id)}
              >
                <span class="btn-icon">✓</span>
                Onayla
              </button>
            {/if}
            
            <button 
              class="btn btn-delete"
              onclick={() => deleteReport(report._id)}
            >
              <span class="btn-icon">🗑️</span>
              Sil
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .report-list {
    width: 100%;
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;
    color: #666;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 20px;
    opacity: 0.5;
  }

  .empty-state h3 {
    margin-bottom: 15px;
    color: #333;
    font-size: 1.5rem;
  }

  .empty-state p {
    max-width: 400px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .reports-stats {
    display: flex;
    gap: 30px;
    justify-content: center;
    margin-bottom: 40px;
    padding: 25px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .stats-item {
    text-align: center;
  }

  .stats-number {
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
    color: #007bff;
    margin-bottom: 5px;
  }

  .stats-label {
    color: #666;
    font-size: 0.9rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .reports-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 25px;
  }

  .report-card {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.07);
    border: 1px solid #e8ecf0;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .report-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #007bff, #28a745);
  }

  .report-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.15);
  }

  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f8f9fa;
  }

  .report-id {
    font-size: 1.1rem;
    color: #333;
    font-weight: 600;
  }

  .status-badge {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-badge.approved {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .status-badge.pending {
    background-color: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
  }

  .report-content {
    margin-bottom: 25px;
  }

  .report-field {
    margin-bottom: 18px;
  }

  .report-field label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .chapter-badge {
    display: inline-block;
    background: #e3f2fd;
    color: #1565c0;
    padding: 6px 12px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .chapters-text {
    display: inline-block;
    background: #f3e5f5;
    color: #7b1fa2;
    padding: 6px 12px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .manga-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #007bff;
    text-decoration: none;
    padding: 8px 12px;
    background: #f8f9ff;
    border-radius: 6px;
    border: 1px solid #e3f2fd;
    transition: all 0.2s ease;
    font-size: 0.9rem;
    word-break: break-all;
  }

  .manga-link:hover {
    background: #e3f2fd;
    color: #0056b3;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
  }

  .link-icon {
    font-size: 1rem;
    flex-shrink: 0;
  }

  .reason-text {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    line-height: 1.6;
    border-left: 4px solid #007bff;
    color: #495057;
    font-style: italic;
  }

  .date-text {
    color: #6c757d;
    font-size: 0.9rem;
    font-family: 'Courier New', monospace;
  }

  .report-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  .btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .btn-icon {
    font-size: 1rem;
  }

  .btn-approve {
    background-color: #28a745;
    color: white;
    box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
  }

  .btn-approve:hover {
    background-color: #218838;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(40, 167, 69, 0.4);
  }

  .btn-delete {
    background-color: #dc3545;
    color: white;
    box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
  }

  .btn-delete:hover {
    background-color: #c82333;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(220, 53, 69, 0.4);
  }

  @media (max-width: 768px) {
    .reports-grid {
      grid-template-columns: 1fr;
    }
    
    .reports-stats {
      flex-direction: column;
      gap: 20px;
    }
    
    .report-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    
    .report-actions {
      justify-content: stretch;
    }
    
    .btn {
      flex: 1;
      justify-content: center;
    }
  }
</style>