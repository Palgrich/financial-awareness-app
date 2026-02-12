/**
 * Rules-based mock "AI" coach responses.
 * Returns helpful educational answers based on keywords.
 * Supports contextual triggers: high APR debt, debt-to-income, budget overspending, savings below target.
 */

export interface CoachMessage {
  id: string;
  text: string;
  isUser: boolean;
  lessonId?: string;
  challengeId?: string;
  lessonTitle?: string;
  challengeTitle?: string;
  budgetSetup?: boolean;
  addDebt?: boolean;
}

export interface CoachContext {
  debts: { apr?: number; balance: number; status: string }[];
  monthlyIncome: number;
  budget: { needsTarget: number; wantsTarget: number; savingsTarget: number } | null;
  needsUsed: number;
  wantsUsed: number;
  savingsUsed: number;
  savingsGoal: number;
  savingsProgress: number;
  /** Subscription load as % of monthly income (null if no income). */
  subscriptionLoadPercent?: number | null;
  /** Financial Clarity score 0–100. */
  clarityScore?: number;
  /** Top expense categories for current scope (e.g. for "why is my score low"). */
  topExpenseCategories?: { name: string; amount: number }[];
}

const QUICK_PROMPTS = [
  'Why did I pay a fee?',
  'How can I avoid account fees?',
  'Explain savings accounts vs checking',
  'Should I use a CD?',
  'What is my debt-to-income ratio?',
  'Am I overspending my budget?',
];

function normalize(input: string): string {
  return input.toLowerCase().replace(/\s+/g, ' ').trim();
}

function match(input: string, keywords: string[]): boolean {
  const n = normalize(input);
  return keywords.some((k) => n.includes(k.toLowerCase()));
}

export function getCoachResponse(userMessage: string, context?: CoachContext): CoachMessage {
  const id = `r-${Date.now()}`;
  const n = normalize(userMessage);

  if (match(userMessage, ['debt', 'income', 'ratio', 'dti'])) {
    const totalDebt = context?.debts.filter((d) => d.status !== 'paid_off').reduce((s, d) => s + d.balance, 0) ?? 0;
    const income = context?.monthlyIncome ?? 3200;
    const ratio = income > 0 ? Math.round((totalDebt / income) * 100) : 0;
    let text = `Your debt-to-income ratio is about ${ratio}% (total debt ÷ monthly income). A ratio under 36% is generally healthy; above 43% may mean debt is eating too much of your income. Consider tracking debts in the app and making a payoff plan.`;
    if (ratio > 40 && context) {
      text += ' I recommend setting up a budget and prioritizing high-APR debt.';
    }
    return { id, isUser: false, text, addDebt: true, lessonId: 'l11', lessonTitle: 'Simple budgeting' };
  }
  if (match(userMessage, ['overspend', 'budget', 'over budget', 'over spending'])) {
    const overspent = context?.budget && (
      context.needsUsed > context.budget.needsTarget ||
      context.wantsUsed > context.budget.wantsTarget
    );
    let text = overspent
      ? "It looks like you're over target in one or more budget categories. Review your Budget Status on the Dashboard. Consider reducing discretionary spending (wants) first, or adjust your budget targets in Profile → Budget Setup."
      : 'Check your Budget Status on the Dashboard to see how you\'re doing against your 50/30/20 targets. If you haven\'t set a budget yet, go to Profile → Budget Setup.';
    return { id, isUser: false, text, budgetSetup: true };
  }
  if (match(userMessage, ['savings', 'target', 'below', 'goal']) && context && context.savingsProgress < 100) {
    return {
      id,
      isUser: false,
      text: `You're at ${Math.round(context.savingsProgress)}% of your savings goal. Small steps help: automate a transfer each payday, cut one subscription, or trim dining out. I can suggest a lesson on building savings.`,
      lessonId: 'l12',
      lessonTitle: 'Setting savings goals',
    };
  }
  if (match(userMessage, ['apr', 'high interest', 'credit card']) && context) {
    const highApr = context.debts.find((d) => (d.apr ?? 0) > 20 && d.status !== 'paid_off');
    if (highApr) {
      return {
        id,
        isUser: false,
        text: `You have debt with APR over 20%, which can be costly. Prioritize paying it down: pay more than the minimum when you can, and avoid new charges. Consider the "Avoid fees this month" challenge and add all your debts in Profile → Debts to track them.`,
        addDebt: true,
        challengeId: 'c1',
        challengeTitle: 'Avoid fees this month',
      };
    }
  }

  if (match(userMessage, ['fee', 'fees', 'charged', 'pay a fee'])) {
    return {
      id,
      isUser: false,
      text: 'Fees can show up for a few reasons: (1) Monthly maintenance when your balance is below the bank’s minimum, (2) Overdraft when a transaction goes through and you don’t have enough funds, (3) Out-of-network ATM use. Check your transaction details to see the fee type. I can suggest a lesson on avoiding fees if you’d like.',
      lessonId: 'l5',
      lessonTitle: 'How to avoid account fees',
    };
  }
  if (match(userMessage, ['avoid', 'prevent', 'no fee'])) {
    return {
      id,
      isUser: false,
      text: 'To avoid account fees: keep the required minimum balance (or link accounts if your bank allows it), set up low-balance alerts, and consider opting out of overdraft “protection” so transactions are declined instead of incurring a fee. Want to try the “Avoid fees this month” challenge?',
      challengeId: 'c1',
      challengeTitle: 'Avoid fees this month',
    };
  }
  if (match(userMessage, ['savings', 'checking', 'difference', 'vs', 'explain'])) {
    return {
      id,
      isUser: false,
      text: 'Checking is for everyday spending and bills—easy to access, often little or no interest. Savings is for money you don’t need right away; it usually earns a bit of interest (APY) and may have limits on how many withdrawals you can make per month. Use checking for daily use and savings for goals and emergency fund.',
      lessonId: 'l1',
      lessonTitle: 'Checking vs savings',
    };
  }
  if (match(userMessage, ['cd', 'certificate', 'deposit', 'should i use'])) {
    return {
      id,
      isUser: false,
      text: 'A CD (Certificate of Deposit) can make sense when you have money you won’t need for a set period (e.g. 6 months or 1 year). You get a fixed rate, often higher than a regular savings account. The tradeoff: you generally can’t withdraw early without a penalty. Good for goals with a clear timeline.',
      lessonId: 'l7',
      lessonTitle: 'CD basics',
    };
  }
  if (match(userMessage, ['clarity', 'score', 'financial health', 'why is my score low', 'score low'])) {
    const score = context?.clarityScore ?? 0;
    const load = context?.subscriptionLoadPercent;
    let text = `Your Financial Clarity score is ${score} out of 100. `;
    if (load != null && load > 10) {
      text += `Subscriptions account for ${Math.round(load)}% of your income, which lowers your score. Consider reviewing the Subscriptions tab to cancel unused services. `;
    }
    if (context?.topExpenseCategories && context.topExpenseCategories.length > 0) {
      const top = context.topExpenseCategories[0];
      text += `Your largest spending category is ${top.name}. `;
    }
    text += score >= 80 ? 'You have strong visibility and stability.' : 'Improve by reducing subscription load, avoiding fees, and keeping positive cash flow.';
    return { id, isUser: false, text };
  }
  if (match(userMessage, ['subscription load', 'subscription load percent', 'spend on subscription'])) {
    const load = context?.subscriptionLoadPercent;
    if (load != null) {
      return {
        id,
        isUser: false,
        text: `You spend ${Math.round(load)}% of your monthly income on subscriptions. ${load > 10 ? "That's on the high side—review your Subscriptions tab and cancel what you don't use." : "That's a reasonable level. Keep an eye on new trials so they don't add up."}`,
      };
    }
    return {
      id,
      isUser: false,
      text: "You don't have subscription charges in the current scope, or income is not set. Check the Subscriptions tab and set your monthly income in Profile to see load as a percentage of income.",
    };
  }
  if (match(userMessage, ['subscription', 'recurring', 'cancel'])) {
    return {
      id,
      isUser: false,
      text: 'Review your Subscriptions tab to see recurring charges. Cancel anything you don’t use. Small monthly amounts add up over a year. You can also try the challenge “Cancel 1 unused subscription” to get started.',
      challengeId: 'c2',
      challengeTitle: 'Cancel 1 unused subscription',
    };
  }
  if (match(userMessage, ['save', 'savings goal', 'emergency'])) {
    return {
      id,
      isUser: false,
      text: 'Start with a small, specific goal (e.g. $500 or one month of expenses). Set up an automatic transfer to savings each payday so you don’t have to think about it. Building an emergency fund of 3–6 months of expenses is a common longer-term target.',
      lessonId: 'l3',
      lessonTitle: 'Emergency fund basics',
    };
  }
  if (match(userMessage, ['apy', 'interest', 'rate'])) {
    return {
      id,
      isUser: false,
      text: 'APY (Annual Percentage Yield) is the rate you earn on savings over a year, including compound interest. A higher APY means your money grows faster. Compare APYs when choosing a savings account or CD.',
      lessonId: 'l2',
      lessonTitle: 'What is APY?',
    };
  }
  if (match(userMessage, ['overdraft'])) {
    return {
      id,
      isUser: false,
      text: 'Overdraft happens when you spend more than your account balance. The bank may cover it but charge a fee (often $35 or more). To avoid it: track your balance, set low-balance alerts, and consider opting out of overdraft coverage so transactions are declined instead.',
      lessonId: 'l6',
      lessonTitle: 'Overdraft in plain English',
    };
  }

  let text = 'I can help with fees, savings vs checking, CDs, overdraft, subscriptions, and budgeting. Try asking: "Why did I pay a fee?" or "What is my debt-to-income ratio?" You can also explore the Learn tab for short lessons.';
  const ctas: Partial<CoachMessage> = {};
  if (context) {
    const highApr = context.debts.find((d) => (d.apr ?? 0) > 20 && d.status !== 'paid_off');
    const overspent = context.budget && (context.needsUsed > context.budget.needsTarget || context.wantsUsed > context.budget.wantsTarget);
    if (highApr) { ctas.addDebt = true; text += ' Tip: You have high-APR debt. Consider tracking it in Debts and paying it down first.'; }
    else if (overspent) { ctas.budgetSetup = true; text += ' Tip: Your budget is over target. Review Budget Setup.'; }
    else if (context.savingsProgress < 80 && context.savingsGoal > 0) { ctas.lessonId = 'l12'; ctas.lessonTitle = 'Setting savings goals'; text += ' Tip: Boost your savings with our goal-setting lesson.'; }
  }
  return { id, isUser: false, text, ...ctas };
}

export function getQuickPrompts(): string[] {
  return [...QUICK_PROMPTS];
}
