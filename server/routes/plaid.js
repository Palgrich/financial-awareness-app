// server/routes/plaid.js
// MoneyGator — Plaid integration (sandbox)
//
// Endpoints:
//   POST   /plaid/create_link_token   → token for Plaid Link UI (mobile)
//   POST   /plaid/exchange_token      → exchange public_token → access_token
//   POST   /plaid/sandbox_connect     → shortcut: connect a test bank without Link UI
//   GET    /plaid/status              → is a bank connected?
//   DELETE /plaid/disconnect          → forget the connection
//
// Overrides (only active when a bank is connected):
//   GET /accounts       → real Plaid accounts, mapped to app format
//   GET /transactions   → real Plaid transactions, mapped to app format

import express from 'express';
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';

const router = express.Router();

// ─── Plaid client ────────────────────────────────────────────────────────────
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
const plaid = new PlaidApi(new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
}));

// ─── In-memory store (single user, sandbox only) ─────────────────────────────
// TODO Stage 4: move to PostgreSQL per user
let store = {
  accessToken: null,
  itemId: null,
  institutionName: null,
  txCursor: null,
  transactions: [],
  connectedAt: null,
};

export function isPlaidConnected() {
  return Boolean(store.accessToken);
}

// ─── Helpers: map Plaid → app format ─────────────────────────────────────────
function mapAccountType(a) {
  if (a.type === 'credit') return 'credit';
  if (a.type === 'loan') return 'loan';
  if (a.type === 'investment') return 'investment';
  if (a.type === 'depository') {
    if (a.subtype === 'checking') return 'checking';
    return 'savings';
  }
  return a.type;
}

function mapAccount(a) {
  const raw = a.balances.current ?? a.balances.available ?? 0;
  // App convention: credit balances are negative (money owed)
  const balance = a.type === 'credit' || a.type === 'loan' ? -Math.abs(raw) : raw;
  return {
    id: a.account_id,
    institutionId: store.itemId,
    name: a.name,
    type: mapAccountType(a),
    balance: Number(balance.toFixed(2)),
    mask: a.mask ?? null,
  };
}

const CATEGORY_MAP = {
  FOOD_AND_DRINK: 'Food & Dining',
  GENERAL_MERCHANDISE: 'Shopping',
  TRANSPORTATION: 'Transport',
  TRAVEL: 'Travel',
  ENTERTAINMENT: 'Entertainment',
  RENT_AND_UTILITIES: 'Bills & Utilities',
  LOAN_PAYMENTS: 'Loan Payments',
  PERSONAL_CARE: 'Personal Care',
  MEDICAL: 'Health',
  GENERAL_SERVICES: 'Services',
  GOVERNMENT_AND_NON_PROFIT: 'Gov & Non-profit',
  HOME_IMPROVEMENT: 'Home',
  INCOME: 'Income',
  TRANSFER_IN: 'Transfer',
  TRANSFER_OUT: 'Transfer',
  BANK_FEES: 'Bank Fees',
  OTHER: 'Other',
};

function mapTransaction(t, recurringIds) {
  const primary = t.personal_finance_category?.primary ?? 'OTHER';
  // Plaid: positive = money out, negative = money in
  const isIncome = t.amount < 0;
  return {
    id: t.transaction_id,
    date: t.date,
    merchant: t.merchant_name || t.name,
    category: CATEGORY_MAP[primary] ?? 'Other',
    amount: Math.abs(t.amount),
    type: isIncome ? 'income' : 'expense',
    accountId: t.account_id,
    isRecurring: recurringIds.has(t.transaction_id),
    pending: Boolean(t.pending),
  };
}

// ─── Sync transactions from Plaid ────────────────────────────────────────────
async function syncTransactions() {
  if (!store.accessToken) return [];

  let cursor = store.txCursor;
  let added = [];
  let modified = [];
  let removed = [];
  let hasMore = true;

  while (hasMore) {
    const res = await plaid.transactionsSync({
      access_token: store.accessToken,
      cursor: cursor ?? undefined,
      count: 500,
    });
    added = added.concat(res.data.added);
    modified = modified.concat(res.data.modified);
    removed = removed.concat(res.data.removed);
    hasMore = res.data.has_more;
    cursor = res.data.next_cursor;
  }

  // Merge into local cache
  const byId = new Map(store.transactions.map(t => [t.transaction_id, t]));
  for (const t of added) byId.set(t.transaction_id, t);
  for (const t of modified) byId.set(t.transaction_id, t);
  for (const r of removed) byId.delete(r.transaction_id);

  store.transactions = Array.from(byId.values());
  store.txCursor = cursor;
  return store.transactions;
}

async function getRecurringIds() {
  if (!store.accessToken) return new Set();
  try {
    const res = await plaid.transactionsRecurringGet({ access_token: store.accessToken });
    const ids = new Set();
    for (const s of [...res.data.inflow_streams, ...res.data.outflow_streams]) {
      for (const id of s.transaction_ids ?? []) ids.add(id);
    }
    return ids;
  } catch {
    // Recurring may not be ready yet in sandbox — fall back to empty
    return new Set();
  }
}

// ─── Public API for index.js ─────────────────────────────────────────────────
export async function getPlaidAccounts() {
  const res = await plaid.accountsGet({ access_token: store.accessToken });
  return res.data.accounts.map(mapAccount);
}

export async function getPlaidTransactions() {
  const [txs, recurringIds] = await Promise.all([syncTransactions(), getRecurringIds()]);
  return txs
    .map(t => mapTransaction(t, recurringIds))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// Status
router.get('/plaid/status', (_req, res) => {
  res.json({
    connected: isPlaidConnected(),
    env: PLAID_ENV,
    institution: store.institutionName,
    connectedAt: store.connectedAt,
    transactionsCached: store.transactions.length,
  });
});

// Link token — for the mobile Plaid Link UI
router.post('/plaid/create_link_token', async (req, res) => {
  try {
    const userId = req.body?.userId || 'moneygator-dev-user';
    const r = await plaid.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: 'MoneyGator',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    });
    res.json({ link_token: r.data.link_token, expiration: r.data.expiration });
  } catch (err) {
    console.error('[plaid] create_link_token', err.response?.data ?? err.message);
    res.status(500).json({ error: 'plaid_link_token_failed', details: err.response?.data ?? err.message });
  }
});

// Exchange — after Plaid Link returns a public_token
router.post('/plaid/exchange_token', async (req, res) => {
  try {
    const { public_token } = req.body ?? {};
    if (!public_token) return res.status(400).json({ error: 'public_token required' });

    const r = await plaid.itemPublicTokenExchange({ public_token });
    store.accessToken = r.data.access_token;
    store.itemId = r.data.item_id;
    store.txCursor = null;
    store.transactions = [];
    store.connectedAt = new Date().toISOString();

    // Fetch institution name for display
    try {
      const item = await plaid.itemGet({ access_token: store.accessToken });
      if (item.data.item.institution_id) {
        const inst = await plaid.institutionsGetById({
          institution_id: item.data.item.institution_id,
          country_codes: [CountryCode.Us],
        });
        store.institutionName = inst.data.institution.name;
      }
    } catch { /* non-critical */ }

    res.json({ ok: true, item_id: store.itemId, institution: store.institutionName });
  } catch (err) {
    console.error('[plaid] exchange_token', err.response?.data ?? err.message);
    res.status(500).json({ error: 'plaid_exchange_failed', details: err.response?.data ?? err.message });
  }
});

// Sandbox shortcut — connect a test bank without opening Plaid Link UI
// Works only in sandbox. Lets you see real Plaid data in the app immediately.
router.post('/plaid/sandbox_connect', async (req, res) => {
  if (PLAID_ENV !== 'sandbox') {
    return res.status(403).json({ error: 'sandbox_only' });
  }
  try {
    const institutionId = req.body?.institution_id || 'ins_109508'; // First Platypus Bank
    const pub = await plaid.sandboxPublicTokenCreate({
      institution_id: institutionId,
      initial_products: [Products.Transactions],
    });
    const r = await plaid.itemPublicTokenExchange({ public_token: pub.data.public_token });
    store.accessToken = r.data.access_token;
    store.itemId = r.data.item_id;
    store.txCursor = null;
    store.transactions = [];
    store.connectedAt = new Date().toISOString();
    store.institutionName = 'First Platypus Bank (Sandbox)';

    // Warm up transactions cache (sandbox can take a few seconds to generate)
    let txs = [];
    for (let i = 0; i < 6 && txs.length === 0; i++) {
      txs = await syncTransactions();
      if (txs.length === 0) await new Promise(r => setTimeout(r, 1500));
    }

    const accounts = await getPlaidAccounts();
    res.json({
      ok: true,
      institution: store.institutionName,
      accounts: accounts.length,
      transactions: txs.length,
    });
  } catch (err) {
    console.error('[plaid] sandbox_connect', err.response?.data ?? err.message);
    res.status(500).json({ error: 'plaid_sandbox_connect_failed', details: err.response?.data ?? err.message });
  }
});

// Disconnect — forget the connection (does not remove the item at Plaid)
router.delete('/plaid/disconnect', (_req, res) => {
  store = { accessToken: null, itemId: null, institutionName: null, txCursor: null, transactions: [], connectedAt: null };
  res.json({ ok: true });
});

// ─── Overrides: real data replaces mock when connected ───────────────────────
router.get('/accounts', async (_req, res, next) => {
  if (!isPlaidConnected()) return next();
  try {
    res.json(await getPlaidAccounts());
  } catch (err) {
    console.error('[plaid] accounts', err.response?.data ?? err.message);
    next(); // fall back to mock on error
  }
});

router.get('/transactions', async (_req, res, next) => {
  if (!isPlaidConnected()) return next();
  try {
    res.json(await getPlaidTransactions());
  } catch (err) {
    console.error('[plaid] transactions', err.response?.data ?? err.message);
    next();
  }
});

export default router;
