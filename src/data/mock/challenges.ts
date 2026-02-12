import { Challenge } from '../../types';

export const mockChallenges: Challenge[] = [
  { id: 'c1', title: 'Avoid fees this month', description: 'Go the full month without any account or overdraft fees.', difficulty: 'medium', status: 'in_progress', rewardText: 'You\'ll keep more of your money.' },
  { id: 'c2', title: 'Cancel 1 unused subscription', description: 'Find and cancel one subscription you no longer use.', difficulty: 'easy', status: 'todo', rewardText: 'Save roughly $10–15 per month.' },
  { id: 'c3', title: 'Save $50 this week', description: 'Set aside $50 in savings by the end of the week.', difficulty: 'easy', status: 'todo', rewardText: 'Build your emergency fund.' },
];
