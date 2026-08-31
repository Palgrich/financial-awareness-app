import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import { authMiddleware } from './middleware/auth.js';
import plaidRouter from './routes/plaid.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(plaidRouter); // Plaid: real data overrides mock when a bank is connected

app.use((req, _res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// In-memory data (do not import from RN app)
const metrics = {
  financialHealth: 82,
  awarenessScore: 74,
  cashControlScore: 68,
  subscriptionScore: 45,
  creditScore: 90,
};

const accounts = [
  { id: 'boa-checking', institutionId: 'inst-boa', name: 'Checking', type: 'checking', balance: 4520.5 },
  { id: 'boa-savings', institutionId: 'inst-boa', name: 'Savings', type: 'savings', balance: 12500.0 },
  { id: 'chase-credit', institutionId: 'inst-chase', name: 'Credit Card', type: 'credit', balance: -892.0 },
  { id: 'chase-checking', institutionId: 'inst-chase', name: 'Checking', type: 'checking', balance: 2100.0 },
  { id: 'ally-savings', institutionId: 'inst-ally', name: 'Savings', type: 'savings', balance: 8400.0 },
];

const transactions = [
  { id: 't1', date: '2026-03-07', merchant: 'Whole Foods', category: 'Groceries', amount: 87.42, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't2', date: '2026-03-06', merchant: 'Netflix', category: 'Entertainment', amount: 15.99, type: 'expense', accountId: 'chase-credit', isRecurring: true },
  { id: 't3', date: '2026-03-06', merchant: 'ACME Corp', category: 'Income', amount: 3200.0, type: 'income', accountId: 'boa-checking', isRecurring: true },
  { id: 't4', date: '2026-03-05', merchant: 'Spotify', category: 'Entertainment', amount: 10.99, type: 'expense', accountId: 'chase-credit', isRecurring: true },
  { id: 't5', date: '2026-03-05', merchant: 'Shell Gas', category: 'Transportation', amount: 52.0, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't6', date: '2026-03-04', merchant: 'Planet Fitness', category: 'Health', amount: 24.99, type: 'expense', accountId: 'boa-checking', isRecurring: true },
  { id: 't7', date: '2026-03-03', merchant: 'Electric Co', category: 'Utilities', amount: 89.0, type: 'expense', accountId: 'boa-checking', isRecurring: true },
  { id: 't8', date: '2026-03-02', merchant: 'Transfer to Savings', category: 'Transfer', amount: 200.0, type: 'expense', accountId: 'boa-checking', isRecurring: false },
  { id: 't9', date: '2026-03-01', merchant: 'Trader Joe\'s', category: 'Groceries', amount: 62.3, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't10', date: '2026-02-28', merchant: 'Freelance Payment', category: 'Income', amount: 500.0, type: 'income', accountId: 'boa-checking', isRecurring: false },
];

const learnData = {
  lessons: [
    { id: 'lesson-1', title: 'The 30% credit rule explained', minutes: 2, status: 'done', lastStartedAt: '2026-02-18T10:00:00.000Z' },
    { id: 'lesson-2', title: 'How to track your spending in 5 min', minutes: 5, status: 'in_progress', lastStartedAt: '2026-02-20T14:30:00.000Z' },
    { id: 'lesson-3', title: 'Why subscriptions drain your wealth', minutes: 2, status: 'not_started' },
    { id: 'lesson-4', title: 'Building an emergency fund', minutes: 4, status: 'not_started' },
    { id: 'lesson-5', title: 'What is a credit score?', minutes: 3, status: 'done', lastStartedAt: '2026-02-15T09:00:00.000Z' },
  ],
  paths: [
    { id: 'path-1', title: 'Money basics', lessonsCount: 8, lastStartedAt: '2026-02-20T14:30:00.000Z' },
    { id: 'path-2', title: 'Credit & debt', lessonsCount: 6, lastStartedAt: '2026-02-18T10:00:00.000Z' },
    { id: 'path-3', title: 'Subscriptions & spending', lessonsCount: 5, lastStartedAt: '2026-02-19T11:00:00.000Z' },
    { id: 'path-4', title: 'Savings & goals', lessonsCount: 7, lastStartedAt: null },
  ],
  challenges: [
    { id: 'challenge-1', title: '7-day spending log', status: 'in_progress', lastUpdatedAt: '2026-02-21T08:00:00.000Z' },
    { id: 'challenge-2', title: 'Cancel one subscription', status: 'todo' },
    { id: 'challenge-3', title: 'Review last statement', status: 'done', lastUpdatedAt: '2026-02-18T16:00:00.000Z' },
  ],
};

app.use('/auth', authRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/metrics', (req, res) => {
  res.json(metrics);
});

app.get('/accounts', (_req, res) => {
  res.json(accounts);
});

app.get('/transactions', (_req, res) => {
  res.json(transactions);
});

app.get('/learn', (req, res) => {
  res.json(learnData);
});

app.post('/learn/lessons/:id/complete', (req, res) => {
  const lesson = learnData.lessons.find((l) => l.id === req.params.id);
  if (lesson) {
    lesson.status = 'done';
    lesson.lastStartedAt = new Date().toISOString();
  }
  res.status(204).send();
});

const PORT = 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`API server running on http://${HOST}:${PORT}`);
  console.log(`Try on phone: http://10.0.0.19:${PORT}/metrics`);
});
