import type { FC } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { HomeStat } from '../home.types';

type HomeStatsProps = {
  stats: HomeStat[];
};

const HomeStats: FC<HomeStatsProps> = ({ stats }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.titleKey}
          className="group relative flex flex-col justify-between overflow-visible rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-3.5 sm:p-5 shadow-lg transition-all duration-300 hover:border-[var(--primary)]/40 hover:-translate-y-0.5 hover:z-20"
          style={{ isolation: 'isolate' }}
        >
          {/* Card content – unchanged */}

          <div className="relative z-10">
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-muted)]">
              <span>{t(stat.titleKey)}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/20">
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl lg:text-3xl">
                {stat.value}
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[var(--primary)]">
                {stat.changeKey ? t(stat.changeKey) : stat.change}
              </span>
            </div>
          </div>

          {/* Chart container */}
          <div className="relative z-10 mt-4 h-14 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stat.data}
                margin={{ top: 24, right: 4, left: 4, bottom: 2 }}
              >
                <defs>
                  <linearGradient id={`grad-${stat.titleKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '10px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    maxWidth: '160px',
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    lineHeight: '1.4',
                    pointerEvents: 'none',
                  }}
                  labelStyle={{
                    color: 'var(--text-muted)',
                    fontSize: '9px',
                    fontWeight: '500',
                    marginBottom: '2px',
                  }}
                  formatter={(val: unknown) => [stat.formatVal(Number(val)), t(stat.titleKey)]}
                  // Allow repositioning to the other side when space is tight
                  allowEscapeViewBox={{ x: true, y: true }}
                  wrapperStyle={{
                    pointerEvents: 'none',
                    zIndex: 100,
                  }}
                  position={{ y: -8 }}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#grad-${stat.titleKey})`}
                  activeDot={{ r: 5, fill: 'var(--primary)', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeStats;