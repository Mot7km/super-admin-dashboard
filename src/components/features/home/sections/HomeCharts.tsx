import type { FC } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import Select from '../../../ui/Select'; // adjust path to your Select component

type HomeTrafficProps = {
  trafficOverviewData: Array<{ name: string; views: number }>;
  branchComparisonData: Array<{
    name: string;
    mainBranchSales: number;
    mallBranchSales: number;
    mainBranchViews: number;
    mallBranchViews: number;
  }>;
  timeFilter: string;
  onTimeFilterChange: (value: string) => void;
};

const HomeTraffic: FC<HomeTrafficProps> = ({
  trafficOverviewData,
  branchComparisonData,
  timeFilter,
  onTimeFilterChange,
}) => {
  const { t } = useTranslation();

  // Options for the custom Select
  const timeFilterOptions = [
    { value: 'thisMonth', label: t('dashboard.thisMonth') },
    { value: 'lastMonth', label: t('dashboard.lastMonth') },
    { value: 'thisYear', label: t('dashboard.thisYear') },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Traffic Overview Card */}
      <div className="flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-5 shadow-lg lg:col-span-7 xl:col-span-7">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            {t('dashboard.trafficOverview')}
          </h2>
          {/* 🔥 Custom Select instead of native dropdown */}
          <Select
            value={timeFilter}
            onChange={onTimeFilterChange}
            options={timeFilterOptions}
            className="w-auto min-w-[120px]"
            // Optionally you can remove the rightIcon if you want a simpler look
          />
        </div>

        <div className="mt-4 h-48 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficOverviewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--color-border)',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                }}
                formatter={(value: unknown) => [
                  `${Number(value || 0).toLocaleString()} Views`,
                  t('dashboard.trafficOverview'),
                ]}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#trafficGrad)"
                dot={{ r: 4, fill: 'var(--primary)', stroke: 'var(--surface)', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: 'var(--accent)', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Branch Comparison Card */}
      <div className="flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-5 shadow-lg lg:col-span-5 xl:col-span-5">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              {t('dashboard.branchComparison')}
            </h2>
            <p className="text-[11px] text-[var(--text-muted)]">{t('dashboard.salesVsViews')}</p>
          </div>
        </div>

        <div className="mt-4 h-48 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={branchComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--color-border)',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text-muted)' }} />
              <Bar
                dataKey="mainBranchSales"
                name={t('dashboard.mainBranchSales')}
                fill="#1683C7"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="mallBranchSales"
                name={t('dashboard.mallBranchSales')}
                fill="#0F766E"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HomeTraffic;