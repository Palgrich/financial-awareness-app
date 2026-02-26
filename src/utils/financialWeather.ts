import type { MetricSnapshot } from '../types/domain';

export type WeatherState = 'storm' | 'rain' | 'cloudy' | 'partly-sunny' | 'sunny';

export type ActionUrgency = 'high' | 'medium' | 'low';

export type ActionItem = {
  id: string;
  text: string; // main line with numbers
  cta: string; // call to action label
  urgency: ActionUrgency;
};

export type WeatherResult = {
  state: WeatherState;
  emoji: string;
  label: string;
  description: string;
  actions: ActionItem[];
};

export type ExtendedMetrics = MetricSnapshot & {
  subscriptionCount?: number; // default 16
  subscriptionMonthly?: number; // default 286.85
  monthlyIncome?: number; // default 1240
  spendingThisMonth?: number; // default 961.62
  spendingLastMonth?: number; // default 641.20
  creditPaymentDueDays?: number; // default 2
  creditPaymentAmount?: number; // default 47
  creditCardName?: string; // default 'Credit card'
  daysUntilPayday?: number; // default 8
  amountLeftUntilPayday?: number; // default 340
  dailyBudget?: number; // default 42
  actualDailySpend?: number; // default 67
};

const WEATHER_BANDS: {
  max: number;
  state: WeatherState;
  emoji: string;
  label: string;
  description: string;
}[] = [
  { max: 40, state: 'storm', emoji: '⛈', label: 'Storm', description: 'Your finances need immediate attention.' },
  { max: 55, state: 'rain', emoji: '🌧', label: 'Rain', description: 'A few challenges to address.' },
  { max: 70, state: 'cloudy', emoji: '☁️', label: 'Cloudy', description: 'Steady with room to improve.' },
  { max: 85, state: 'partly-sunny', emoji: '🌤', label: 'Partly Sunny', description: 'Your finances are stable with room to improve.' },
  { max: 101, state: 'sunny', emoji: '☀️', label: 'Sunny', description: 'Your finances are in great shape.' },
];

const URGENCY_RANK: Record<ActionUrgency, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function getFinancialWeather(metrics: ExtendedMetrics): WeatherResult {
  const health = metrics.financialHealth;
  const band =
    WEATHER_BANDS.find((b) => health < b.max) ?? WEATHER_BANDS[WEATHER_BANDS.length - 1];

  const subscriptionCount = metrics.subscriptionCount ?? 16;
  const subscriptionMonthly = metrics.subscriptionMonthly ?? 286.85;
  const monthlyIncome = metrics.monthlyIncome ?? 1240;
  const spendingThisMonth = metrics.spendingThisMonth ?? 961.62;
  const spendingLastMonth = metrics.spendingLastMonth ?? 641.2;
  const creditPaymentDueDays = metrics.creditPaymentDueDays ?? 2;
  const creditPaymentAmount = metrics.creditPaymentAmount ?? 47;
  const creditCardName = metrics.creditCardName ?? 'Credit card';
  const daysUntilPayday = metrics.daysUntilPayday ?? 8;
  const amountLeftUntilPayday = metrics.amountLeftUntilPayday ?? 340;
  const dailyBudget = metrics.dailyBudget ?? 42;
  const actualDailySpend = metrics.actualDailySpend ?? 67;

  const actions: ActionItem[] = [];

  // Subscriptions too heavy
  if (metrics.subscriptionScore < 50) {
    const incomeForPct = monthlyIncome > 0 ? monthlyIncome : 1;
    const pct = Math.round((subscriptionMonthly / incomeForPct) * 100);
    actions.push({
      id: 'subscriptions',
      text: `${subscriptionCount} subscriptions · $${subscriptionMonthly.toFixed(
        0
      )}/mo (${pct}% of income) — too high`,
      cta: 'Review and cut',
      urgency: 'high',
    });
  }

  // Cash control off track
  if (metrics.cashControlScore < 60) {
    const last = spendingLastMonth > 0 ? spendingLastMonth : 1;
    const pctUp = Math.round(((spendingThisMonth - last) / last) * 100);
    actions.push({
      id: 'cash-control',
      text: `Spending up ${pctUp}% vs last month ($${spendingThisMonth.toFixed(
        0
      )} vs $${spendingLastMonth.toFixed(0)}) — off track`,
      cta: 'See breakdown',
      urgency: 'high',
    });
  }

  // Credit card payment risk
  if (metrics.creditScore < 70 || creditPaymentDueDays <= 3) {
    actions.push({
      id: 'credit-payment',
      text: `${creditCardName} payment due in ${creditPaymentDueDays} days · $${creditPaymentAmount} minimum`,
      cta: 'Transfer from debit now',
      urgency: 'high',
    });
  }

  // Payday pacing
  if (daysUntilPayday > 0 && actualDailySpend > dailyBudget) {
    actions.push({
      id: 'payday-pace',
      text: `${daysUntilPayday} days until payday · $${amountLeftUntilPayday} left = $${dailyBudget}/day budget. You're spending $${actualDailySpend}/day`,
      cta: 'Slow down spending',
      urgency: 'medium',
    });
  }

  // Awareness low
  if (metrics.awarenessScore < 60) {
    actions.push({
      id: 'awareness',
      text: 'Financial awareness is low — small steps make a big difference',
      cta: 'Take a 2-min lesson',
      urgency: 'low',
    });
  }

  const sorted = actions
    .sort((a, b) => URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency])
    .slice(0, 3);

  return {
    state: band.state,
    emoji: band.emoji,
    label: band.label,
    description: band.description,
    actions: sorted,
  };
}
