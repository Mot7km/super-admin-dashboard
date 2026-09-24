type InventoryPoTabProps = {
  title: string;
};

const InventoryPoTab = ({ title }: InventoryPoTabProps) => {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-6 shadow-lg space-y-4">
      <h2 className="text-base font-bold text-[var(--text-primary)]">{title}</h2>
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)] bg-[var(--surface)]">
          <div>
            <h4 className="font-bold text-[var(--text-primary)]">PO #2025-084 — Al-Watania Meats</h4>
            <p className="text-[11px] text-[var(--text-muted)]">300x Angus Beef Patties • Total: $1,200.00</p>
          </div>
          <span className="rounded-md bg-amber-500/10 px-2 py-1 font-bold text-amber-500">Pending Delivery</span>
        </div>
      </div>
    </div>
  );
};

export default InventoryPoTab;