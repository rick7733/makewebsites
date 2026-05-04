const assert = require('assert');
const { calculateQuote } = require('../src');

const result = calculateQuote(
  [
    { name: 'Feature A', unit: 'MAN_DAY', qty: 59, unitPrice: 5850, isDiscount: false },
    { name: 'Rebate', unit: 'FIXED', qty: 1, unitPrice: -145150, isDiscount: true },
    { name: 'Support', unit: 'MAN_HOUR', qty: 16, unitPrice: 1200, isDiscount: false },
  ],
  0.05,
  'TAX_INCLUDED',
  8
);

assert.strictEqual(result.amounts.itemsSubtotal, 219200);
assert.strictEqual(result.amounts.taxAmount, 10960);
assert.strictEqual(result.amounts.finalAmount, 230160);
assert.strictEqual(result.amounts.discountTotal, -145150);
assert.strictEqual(result.amounts.totalHours, 488);
assert.strictEqual(result.amounts.totalDays, 61);

console.log('calculateQuote.test passed');
