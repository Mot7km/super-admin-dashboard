import { memo, type FC } from 'react';
import {
  Users,
  Radio,
  ShieldCheck,
  Lock,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { GlobalUser, UserStatus } from '../users.types';
import { TelemetryKpiCard } from '../../../common/kpi';

type UserKpiStripProps = {
  users: GlobalUser[];
  activeStatus: 'all' | UserStatus;
  onStatusSelect: (status: 'all' | UserStatus) => void;
};

const UserKpiStrip: FC<UserKpiStripProps> = ({
  users,
  activeStatus,
  onStatusSelect,
}) => {
  const { t } = useTranslation();

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const lockedUsers = users.filter((u) => u.status === 'locked' || u.status === 'disabled').length;

  const totalSessions = users.reduce((sum, u) => sum + u.sessions.length, 0);
  const mfaUsersCount = users.filter((u) => u.mfaEnabled).length;
  const mfaPercent = totalUsers > 0 ? Math.round((mfaUsersCount / totalUsers) * 100) : 0;

  const handleCardClick = (statusKey: 'all' | UserStatus) => {
    if (activeStatus === statusKey && statusKey !== 'all') {
      onStatusSelect('all');
    } else {
      onStatusSelect(statusKey);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Total System Identities */}
      <TelemetryKpiCard
        title={t('users.kpiTotalUsers')}
        value={totalUsers}
        subValue="Across all tenants"
        icon={Users}
        variant="primary"
        badge={{ text: '+19.4% MoM', trend: 'up' }}
        progress={{ value: 100 }}
        footer={{
          label: t('users.activeStatusRate'),
          value: `${activeUsers} / ${totalUsers} Active`,
        }}
        isActive={activeStatus === 'all'}
        onClick={() => handleCardClick('all')}
      />

      {/* 2. Active Sessions & Connected Devices */}
      <TelemetryKpiCard
        title={t('users.kpiActiveSessions')}
        value={totalSessions}
        subValue="Live Devices"
        icon={Radio}
        variant="success"
        badge={{ text: 'Live Sync', isLive: true }}
        progress={{ value: 100 }}
        footer={{
          label: t('users.deviceBreakdown'),
          value: 'Web & POS Connected',
        }}
      />

      {/* 3. MFA Shield Protection Rate */}
      <TelemetryKpiCard
        title={t('users.kpiMfaScore')}
        value={`${mfaPercent}%`}
        subValue={`${mfaUsersCount} / ${totalUsers} 2FA`}
        icon={ShieldCheck}
        variant="cyan"
        badge={{ text: 'Zero-Trust', icon: Activity }}
        progress={{ value: mfaPercent }}
        footer={{
          label: t('users.identityHealth'),
          value: 'High Security Grade',
        }}
      />

      {/* 4. Locked & Disabled Accounts */}
      <TelemetryKpiCard
        title={t('users.kpiLockedUsers')}
        value={lockedUsers}
        subValue="Suspended"
        icon={Lock}
        variant="destructive"
        badge={{
          text: lockedUsers > 0 ? 'Requires Review' : '0 Lockouts',
          isLive: lockedUsers > 0,
        }}
        progress={{ value: Math.max(lockedUsers * 25, 10) }}
        footer={{
          label: t('users.securityFlag'),
          value: 'Action Ready',
          icon: AlertTriangle,
        }}
        isActive={activeStatus === 'locked' || activeStatus === 'disabled'}
        onClick={() => handleCardClick('locked')}
      />
    </div>
  );
};

export default memo(UserKpiStrip);
