import { Lesson } from '../../types';

export const mockLessons: Lesson[] = [
  {
    id: 'l1',
    title: 'Checking vs savings',
    level: 'beginner',
    durationMin: 3,
    summary: 'When to use each account type and how they differ.',
    sections: [
      { heading: 'Checking accounts', bullets: ['Meant for daily spending and bills.', 'Often have no or low interest.', 'Easy to withdraw and use a debit card.'] },
      { heading: 'Savings accounts', bullets: ['Best for money you don\'t need right away.', 'Usually earn a small amount of interest (APY).', 'May have limits on how many withdrawals you can make per month.'] },
    ],
  },
  {
    id: 'l2',
    title: 'What is APY?',
    level: 'beginner',
    durationMin: 2,
    summary: 'Annual Percentage Yield explains how much your savings can grow.',
    sections: [
      { heading: 'APY explained', bullets: ['APY = Annual Percentage Yield.', 'It includes compound interest over a year.', 'Higher APY means your money grows faster.'] },
    ],
  },
  {
    id: 'l3',
    title: 'Emergency fund basics',
    level: 'beginner',
    durationMin: 4,
    summary: 'Why and how to build a safety net.',
    sections: [
      { heading: 'Why it matters', bullets: ['Covers unexpected expenses (car, medical, job loss).', 'Reduces stress and avoids high-interest debt.'] },
      { heading: 'How much', bullets: ['A common goal is 3–6 months of expenses.', 'Start with a small goal (e.g. $500) and build up.'] },
    ],
  },
  {
    id: 'l4',
    title: 'Understanding account fees',
    level: 'beginner',
    durationMin: 3,
    summary: 'Common bank fees and how they work.',
    sections: [
      { heading: 'Common fees', bullets: ['Monthly maintenance if balance is too low.', 'Overdraft when you spend more than you have.', 'Out-of-network ATM fees.'] },
    ],
    quiz: [
      { id: 'q1', question: 'Which action can help you avoid monthly maintenance fees?', options: ['Keep a minimum balance', 'Use ATMs often', 'Write many checks'], correctIndex: 0 },
      { id: 'q2', question: 'Overdraft fees are charged when:', options: ['You have too much money', 'You spend more than your balance', 'You close the account'], correctIndex: 1 },
      { id: 'q3', question: 'To avoid ATM fees, you should:', options: ['Use any ATM', 'Use your bank\'s ATM or in-network', 'Withdraw large amounts only'], correctIndex: 1 },
    ],
  },
  {
    id: 'l5',
    title: 'How to avoid account fees',
    level: 'intermediate',
    durationMin: 4,
    summary: 'Practical steps to reduce or eliminate fees.',
    sections: [
      { heading: 'Minimum balance', bullets: ['Keep the required minimum in checking or savings.', 'Link accounts if the bank waives fees for combined balance.'] },
      { heading: 'Overdraft', bullets: ['Opt out of overdraft “protection” to avoid fees (transactions may be declined).', 'Set up low-balance alerts.'] },
    ],
    quiz: [
      { id: 'q4', question: 'Linking checking and savings can sometimes:', options: ['Increase fees', 'Help you avoid fees with combined balance', 'Close your account'], correctIndex: 1 },
      { id: 'q5', question: 'Opting out of overdraft protection usually means:', options: ['You get more fees', 'Declined transactions but no overdraft fee', 'Higher interest'], correctIndex: 1 },
      { id: 'q6', question: 'A low-balance alert helps you:', options: ['Earn more interest', 'Avoid overdrafts by knowing when you\'re low', 'Cancel the account'], correctIndex: 1 },
    ],
  },
  {
    id: 'l6',
    title: 'Overdraft in plain English',
    level: 'beginner',
    durationMin: 3,
    summary: 'What overdraft is and how to avoid it.',
    sections: [
      { heading: 'What is overdraft?', bullets: ['Spending more than your account balance.', 'The bank may cover it but charge a fee (often $35 or more).'] },
      { heading: 'Avoiding it', bullets: ['Track your balance.', 'Use alerts; consider opting out of overdraft coverage.'] },
    ],
  },
  {
    id: 'l7',
    title: 'CD basics',
    level: 'beginner',
    durationMin: 3,
    summary: 'What a Certificate of Deposit is and when it can help.',
    sections: [
      { heading: 'What is a CD?', bullets: ['A savings product with a fixed term (e.g. 6 months, 1 year).', 'You agree not to withdraw until the term ends.', 'Often pays a higher rate than a regular savings account.'] },
    ],
    quiz: [
      { id: 'q7', question: 'A CD typically offers:', options: ['No interest', 'Higher interest than regular savings', 'Unlimited withdrawals'], correctIndex: 1 },
      { id: 'q8', question: 'Withdrawing from a CD before the term usually:', options: ['Increases your interest', 'Results in a penalty', 'Has no effect'], correctIndex: 1 },
      { id: 'q9', question: 'CDs are best for money you:', options: ['Need next week', 'Can leave untouched for the term', 'Use for daily spending'], correctIndex: 1 },
    ],
  },
  {
    id: 'l8',
    title: 'CD early withdrawal penalty',
    level: 'intermediate',
    durationMin: 2,
    summary: 'What happens if you take money out before the CD matures.',
    sections: [
      { heading: 'Penalty', bullets: ['Banks charge a penalty (e.g. several months of interest).', 'You may get back less than you put in if you withdraw very early.'] },
    ],
  },
  {
    id: 'l9',
    title: 'CD laddering',
    level: 'intermediate',
    durationMin: 4,
    summary: 'Spreading CD terms to balance rate and access.',
    sections: [
      { heading: 'What is laddering?', bullets: ['Opening multiple CDs with different maturity dates (e.g. 6mo, 1yr, 2yr).', 'As each matures, you can spend or reinvest.'] },
      { heading: 'Benefits', bullets: ['You lock in rates and still get regular access to some money.', 'Reduces the need to break one big CD early.'] },
    ],
  },
  {
    id: 'l10',
    title: 'Managing subscriptions',
    level: 'beginner',
    durationMin: 3,
    summary: 'Track and trim recurring charges.',
    sections: [
      { heading: 'Why it matters', bullets: ['Small monthly fees add up over a year.', 'Many people forget about services they rarely use.'] },
      { heading: 'What to do', bullets: ['List all subscriptions (bank and card statements).', 'Cancel what you don\'t use; share or downgrade where possible.'] },
    ],
  },
  {
    id: 'l11',
    title: 'Simple budgeting',
    level: 'beginner',
    durationMin: 5,
    summary: 'A simple way to plan income and expenses.',
    sections: [
      { heading: '50/30/20 (one approach)', bullets: ['50% needs (rent, utilities, groceries).', '30% wants (dining, entertainment).', '20% savings and debt payoff.'] },
      { heading: 'First steps', bullets: ['Track spending for a month.', 'Set one or two goals (e.g. save $X, pay off one card).'] },
    ],
  },
  {
    id: 'l12',
    title: 'Setting savings goals',
    level: 'beginner',
    durationMin: 3,
    summary: 'How to define and reach a savings target.',
    sections: [
      { heading: 'Good goals', bullets: ['Specific (e.g. $2,000 emergency fund).', 'Realistic for your income.', 'With a timeline.'] },
      { heading: 'Staying on track', bullets: ['Automate a transfer to savings each payday.', 'Review progress monthly.'] },
    ],
  },
];
