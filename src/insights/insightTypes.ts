/**
 * Behavioral insight types for the awareness layer.
 */

export type BehavioralInsightType =
  | 'high_subscription_load'
  | 'high_dining_ratio'
  | 'fee_detected'
  | 'rising_utilities'
  | 'strong_savings_rate';

export interface BehavioralInsight {
  type: BehavioralInsightType;
  message: string;
}
