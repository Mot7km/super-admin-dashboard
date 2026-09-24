const Loader = () => (
  <section className="flex min-h-[60vh] items-center justify-center" aria-label="Loading content">
    <div className="rounded-2xl border border-[color:rgba(15,23,42,0.08)] bg-[var(--card)] p-8 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[color:rgba(22,131,199,0.2)] border-t-[var(--primary)]" />
      <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Loading your experience…</h1>
      <p className="mt-2 text-[var(--text-secondary)]">Please wait while the dashboard is prepared.</p>
    </div>
  </section>
)

export default Loader