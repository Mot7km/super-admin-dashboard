import { memo, type FC } from 'react';
import {
  MapPin,
  Building,
  Compass,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import { EGYPT_GOVERNORATES_DATA } from '../../analytics.mock';

export const GeographicGovernoratesCard: FC = memo(() => {
  const { t, locale } = useTranslation();

  const governorates = EGYPT_GOVERNORATES_DATA;

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('analytics.geo.title')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('analytics.geo.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-muted/30 px-3 py-1 text-xs font-semibold text-muted-foreground">
          <Compass className="h-3.5 w-3.5" />
          <span>Egypt & Regional Coverage</span>
        </div>
      </div>

      {/* Governorates Distribution List */}
      <div className="space-y-3.5">
        {governorates.map((gov) => {
          const name = locale === 'ar' ? gov.nameAr : gov.nameEn;

          return (
            <div key={gov.id} className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Building className="h-3.5 w-3.5 text-primary" />
                  <span>{name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-foreground">
                    {gov.businessCount} {t('analytics.geo.merchants')}
                  </span>
                  <span className="font-bold text-primary">
                    {gov.percent}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-500"
                  style={{ width: `${gov.percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

GeographicGovernoratesCard.displayName = 'GeographicGovernoratesCard';
