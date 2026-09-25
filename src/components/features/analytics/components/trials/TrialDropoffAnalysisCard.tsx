import { memo, type FC } from 'react';
import {
  HelpCircle,
  Lightbulb,
  Zap,
  PhoneCall,
  Send,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import { TRIAL_DROPOFF_REASONS } from '../../analytics.mock';

export const TrialDropoffAnalysisCard: FC = memo(() => {
  const { t } = useTranslation();

  const reasons = TRIAL_DROPOFF_REASONS;

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('analytics.trials.dropoffTitle')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('analytics.trials.dropoffSubtitle')}
            </p>
          </div>
        </div>

        <span className="text-xs text-muted-foreground">
          410 non-converted accounts analyzed
        </span>
      </div>

      {/* Grid: Reasons on Left, Smart Automated Interventions on Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Ranked Reasons */}
        <div className="space-y-3.5">
          {reasons.map((item) => (
            <div key={item.id} className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">
                  {t(item.reasonKey)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-muted-foreground">
                    {item.count} accounts
                  </span>
                  <span className="font-bold text-primary">
                    {item.percent}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right: AI & Merchant Success Interventions */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <Lightbulb className="h-4 w-4" />
              <span>{t('analytics.trials.automatedInterventionsTitle')}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('analytics.trials.automatedInterventionsDesc')}
            </p>
          </div>

          <div className="space-y-2 pt-2 text-xs">
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 p-2.5">
              <Zap className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-bold text-foreground">
                  {t('analytics.trials.actionHardwareTitle')}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {t('analytics.trials.actionHardwareDesc')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 p-2.5">
              <PhoneCall className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-bold text-foreground">
                  {t('analytics.trials.actionOnboardingTitle')}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {t('analytics.trials.actionOnboardingDesc')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 p-2.5">
              <Send className="h-4 w-4 text-primary flex-shrink-0" />
              <div className="flex-1">
                <div className="font-bold text-foreground">
                  {t('analytics.trials.actionDiscountNudgeTitle')}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {t('analytics.trials.actionDiscountNudgeDesc')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

TrialDropoffAnalysisCard.displayName = 'TrialDropoffAnalysisCard';
