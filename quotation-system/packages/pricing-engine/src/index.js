function round0(n) {
  return Math.round(n);
}

function toHours(item, manDayHours) {
  if (item.unit === 'MAN_DAY') return Number(item.qty) * manDayHours;
  if (item.unit === 'MAN_HOUR') return Number(item.qty);
  return null;
}

function calculateQuote(items, taxRate, finalAmountMode, manDayHours = 8) {
  const normalizedItems = items.map((item) => {
    const qty = Number(item.qty);
    const unitPrice = Number(item.unitPrice);
    const subtotal = round0(qty * unitPrice);

    return {
      ...item,
      qty,
      unitPrice,
      subtotal,
      normalizedHours: toHours(item, Number(manDayHours)),
    };
  });

  const itemsSubtotal = normalizedItems.reduce((sum, i) => sum + i.subtotal, 0);
  const discountTotal = normalizedItems
    .filter((i) => i.isDiscount && i.subtotal < 0)
    .reduce((sum, i) => sum + i.subtotal, 0);

  const totalHours = normalizedItems
    .filter((i) => typeof i.normalizedHours === 'number')
    .reduce((sum, i) => sum + i.normalizedHours, 0);

  const preTaxTotal = itemsSubtotal;
  const taxAmount = round0(preTaxTotal * Number(taxRate || 0));
  const totalIncludingTax = preTaxTotal + taxAmount;
  const finalAmount = finalAmountMode === 'TAX_INCLUDED' ? totalIncludingTax : preTaxTotal;

  return {
    items: normalizedItems,
    amounts: {
      itemsSubtotal,
      discountTotal,
      preTaxTotal,
      taxAmount,
      totalIncludingTax,
      finalAmount,
      finalAmountMode,
      totalHours,
      totalDays: Number(manDayHours) > 0 ? Number((totalHours / Number(manDayHours)).toFixed(2)) : null,
    },
  };
}

module.exports = {
  calculateQuote,
};
