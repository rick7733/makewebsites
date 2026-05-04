# Quotation System Bootstrap (Mode A)

## Quick start

```bash
cd quotation-system
npm run test
npm run start:api
```

## Endpoints

- `GET /health`
- `GET /quotes`
- `POST /quotes`
- `GET /quotes/:id`
- `POST /quotes/calculate`

## Create quote payload

```json
{
  "quoteDate": "2026-05-04",
  "finalAmountMode": "TAX_INCLUDED",
  "taxRate": 0.05,
  "manDayHours": 8,
  "items": [
    { "name": "Feature A", "unit": "MAN_DAY", "qty": 59, "unitPrice": 5850 },
    { "name": "Rebate", "unit": "FIXED", "qty": 1, "unitPrice": -145150, "isDiscount": true }
  ]
}
```

## Calculate payload

```json
{
  "items": [
    { "name": "Feature A", "unit": "MAN_DAY", "qty": 59, "unitPrice": 5850 },
    { "name": "Support", "unit": "MAN_HOUR", "qty": 16, "unitPrice": 1200 },
    { "name": "Rebate", "unit": "FIXED", "qty": 1, "unitPrice": -145150, "isDiscount": true }
  ],
  "taxRate": 0.05,
  "finalAmountMode": "TAX_INCLUDED",
  "manDayHours": 8
}
```
