export type TargetScope = 'everyone' | 'plans' | 'businesses' | 'users' | 'percentage';

export type FlagEnvironment = 'production' | 'staging' | 'development';

export interface FeatureFlag {
  id: string;
  key: string;                    // e.g. "pos_v2", "ai_insights", "online_ordering"
  name: string;                   // Localized display name
  description: string;
  isEnabled: boolean;
  targetType: TargetScope;
  targetIds: string[];            // Plan IDs, Business IDs, or User IDs
  targetLabels?: string[];        // Human readable labels for selected targets
  rolloutPercentage?: number;     // 0 - 100%
  environment: FlagEnvironment;
  tags: string[];                 // ['Beta', 'POS', 'AI', 'Billing', etc.]
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastToggledBy?: {
    name: string;
    at: string;
  };
}

export interface FlagFilterState {
  search: string;
  status: 'all' | 'enabled' | 'disabled';
  scope: 'all' | TargetScope;
  environment: 'all' | FlagEnvironment;
  tag: string;
}

export interface FeatureFlagStats {
  total: number;
  active: number;
  scoped: number;
  inRollout: number;
}
