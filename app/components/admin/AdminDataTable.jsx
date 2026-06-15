"use client";

/**
 * Tableau générique pour les pages admin avec états loading/vide/erreur et pagination.
 *
 * Props:
 *   columns      — [{ key, label, render? }]
 *   data         — tableau de lignes
 *   loading      — boolean
 *   emptyMessage — string (défaut "Aucun résultat")
 *   error        — string | null
 *   onRetry      — () => void (affiché si error)
 *   pagination   — { total, totalPages }
 *   page         — number
 *   onPageChange — (page: number) => void
 *   perPage      — number (pour calcul range X–Y, optionnel)
 */
export function AdminDataTable({
  columns,
  data,
  loading,
  emptyMessage = "Aucun résultat",
  error,
  onRetry,
  pagination,
  page,
  onPageChange,
  perPage,
}) {
  const pageNumbers = (() => {
    const total = pagination?.totalPages ?? 1;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const set = new Set([1, total, page, page - 1, page + 1].filter(p => p >= 1 && p <= total));
    return [...set].sort((a, b) => a - b).reduce((acc, p, i, arr) => {
      if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
      acc.push(p);
      return acc;
    }, []);
  })();

  return (
    <div className="ap-table-wrap">
      {loading ? (
        <div className="admin-loading-wrap"><span className="admin-loader" />Chargement</div>
      ) : error ? (
        <div className="ap-state ap-state-error">
          <span className="ap-state-icon">⚠️</span>
          {error}
          {onRetry && <button className="ap-state-retry" onClick={onRetry}>Réessayer</button>}
        </div>
      ) : !data?.length ? (
        <div className="ap-state">
          <span className="ap-state-icon">📭</span>
          {emptyMessage}
        </div>
      ) : (
        <>
          <table className="ap-table">
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIdx) => (
                <tr key={row._id ?? rowIdx}>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {pagination?.totalPages > 1 && (
            <div className="ac-pagination">
              <button
                className="ac-page-btn"
                disabled={page === 1}
                onClick={() => onPageChange(p => p - 1)}
              >
                Préc.
              </button>
              <div className="ac-page-numbers">
                {pageNumbers.map((item, i) =>
                  item === "…" ? (
                    <span key={`el-${i}`} className="ac-page-ellipsis">…</span>
                  ) : (
                    <button
                      key={item}
                      className={`ac-page-num ${item === page ? "active" : ""}`}
                      onClick={() => onPageChange(item)}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
              <button
                className="ac-page-btn"
                disabled={page === pagination.totalPages}
                onClick={() => onPageChange(p => p + 1)}
              >
                Suiv.
              </button>
              {pagination.total != null && (
                <span className="ac-page-info">
                  {perPage
                    ? `${((page - 1) * perPage) + 1}–${Math.min(page * perPage, pagination.total)} / ${pagination.total}`
                    : `${pagination.total} résultats`
                  }
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
