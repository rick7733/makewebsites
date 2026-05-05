const http = require('http');
const { calculateQuote } = require('../../../packages/pricing-engine/src');
const { createQuote, getQuote, listQuotes } = require('./store');

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function send(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') return send(res, 200, { ok: true });

  if (req.method === 'GET' && req.url === '/quotes') {
    return send(res, 200, { data: listQuotes() });
  }

  if (req.method === 'POST' && req.url === '/quotes') {
    try {
      const body = await readJson(req);
      const quote = createQuote(body);
      return send(res, 201, { data: quote });
    } catch (err) {
      return send(res, 400, { error: 'Invalid JSON payload' });
    }
  }

  if (req.method === 'GET' && req.url.startsWith('/quotes/')) {
    const quoteId = req.url.split('/')[2];
    const quote = getQuote(quoteId);
    if (!quote) return send(res, 404, { error: 'Quote not found' });
    return send(res, 200, { data: quote });
  }

  if (req.method === 'POST' && req.url === '/quotes/calculate') {
    try {
      const body = await readJson(req);
      const result = calculateQuote(
        body.items || [],
        body.taxRate == null ? 0.05 : body.taxRate,
        body.finalAmountMode || 'TAX_INCLUDED',
        body.manDayHours == null ? 8 : body.manDayHours
      );
      return send(res, 200, result);
    } catch (err) {
      return send(res, 400, { error: 'Invalid JSON payload' });
    }
  }

  return send(res, 404, { error: 'Not Found' });
});

if (require.main === module) {
  const port = process.env.PORT || 3001;
  server.listen(port, () => console.log(`Quotation API listening on :${port}`));
}

module.exports = server;
