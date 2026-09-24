import { ChefHat } from 'lucide-react';

type OrdersHeaderProps = {
  title: string;
  subtitle: string;
  kdsBadge: string;
};

const OrdersHeader = ({ title, subtitle, kdsBadge }: OrdersHeaderProps) => {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Title row with badge – wraps on small screens */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl lg:text-3xl break-words">
          {title}
        </h1>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] sm:text-xs font-bold text-blue-500 ring-1 ring-blue-500/20 whitespace-nowrap">
          <ChefHat className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          {kdsBadge}
        </span>
      </div>

      {/* Subtitle – always on its own line */}
      <p className="text-xs text-[var(--text-muted)] sm:text-sm break-words">
        {subtitle}
      </p>
    </div>
  );
};

export default OrdersHeader;