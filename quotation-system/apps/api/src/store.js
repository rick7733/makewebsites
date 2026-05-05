const { randomUUID } = require('crypto');

const db = {
  quotes: new Map(),
};

function createQuote(payload) {
  const id = randomUUID();
  const quote = {
    id,
    quoteNo: payload.quoteNo || `RT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(db.quotes.size + 1).padStart(3, '0')}`,
    quoteDate: payload.quoteDate || new Date().toISOString().slice(0, 10),
    finalAmountMode: payload.finalAmountMode || 'TAX_INCLUDED',
    taxRate: payload.taxRate == null ? 0.05 : Number(payload.taxRate),
    manDayHours: payload.manDayHours == null ? 8 : Number(payload.manDayHours),
    items: payload.items || [],
  };

  db.quotes.set(id, quote);
  return quote;
}

function getQuote(id) {
  return db.quotes.get(id) || null;
}

function listQuotes() {
  return Array.from(db.quotes.values());
}

module.exports = {
  createQuote,
  getQuote,
  listQuotes,
};
