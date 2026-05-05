# 忻旅科技報價系統（模式A：測試環境）

本文件定義「不透過工程師，由 Codex 直接完成」的最小可行落地方案：
- 前端：Vercel
- 後端：Render
- 資料庫：Supabase PostgreSQL
- 檔案：Supabase Storage（或 S3 相容）

## 1. 系統範圍（MVP）

1. 建立客戶、專案、報價單
2. 報價明細支援人天/人時混用
3. 最終金額可切換含稅或未稅
4. 匯出 Excel（套既有樣板）
5. 匯出 PDF（A版型）

## 2. 目錄與服務切分（建議）

- `apps/api`：NestJS API
- `apps/web`：Next.js UI
- `packages/pricing-engine`：計價核心
- `packages/shared-types`：共用型別

## 3. 核心資料結構

```ts
export type Unit = 'MAN_DAY' | 'MAN_HOUR' | 'FIXED';
export type FinalAmountMode = 'TAX_INCLUDED' | 'TAX_EXCLUDED';

export interface QuoteItem {
  itemNo: number;
  name: string;
  spec?: string;
  resourcePlan?: string;
  unit: Unit;
  qty: number;
  unitPrice: number;
  isDiscount?: boolean;
}

export interface Quote {
  quoteNo: string;
  quoteDate: string;
  pricingUnitMode: 'MAN_DAY' | 'MAN_HOUR' | 'MIXED';
  manDayHours: number;
  finalAmountMode: FinalAmountMode;
  taxRate: number;
  items: QuoteItem[];
}
```

## 4. 計價規則

- 明細小計：`qty * unitPrice`
- 未稅總計：`sum(subtotal)`
- 稅額：`未稅總計 * taxRate`
- 含稅總計：`未稅總計 + 稅額`
- 最終顯示：依 `finalAmountMode`

## 5. 測試環境部署步驟（Mode A）

### 5.1 Supabase

1. 建立專案（區域建議 Northeast Asia）
2. 建立 PostgreSQL schema（quotes/quote_items/clients/projects）
3. 建立 bucket：`quote-exports`
4. 設定 service role key 供 API 使用

### 5.2 Render（API）

1. 建立 Web Service，連接 GitHub repo
2. Build command：`npm ci && npm run build:api`
3. Start command：`npm run start:api`
4. 設定環境變數：
   - `DATABASE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `APP_BASE_URL`

### 5.3 Vercel（Web）

1. 匯入 repo，Root 指到 `apps/web`
2. Build command：`npm run build:web`
3. 設定 `NEXT_PUBLIC_API_BASE_URL` 指向 Render API
4. 佈署 Preview 環境驗證流程

## 6. Excel/PDF 匯出策略

### Excel
- 儲存既有模板 `templates/quotation-template.xlsx`
- 以 ExcelJS 指定 cell mapping 填值
- 儲存輸出檔至 storage 並回傳下載 URL

### PDF
- 使用 HTML 模板（A版型）渲染
- Playwright 輸出 A4 PDF
- 保留簽名線，不顯示簽署日期

## 7. 驗收清單（測試環境）

1. 可建立一張含兩筆明細（含折扣）的報價單
2. 人天/人時可混合，計價正確
3. 可切換最終金額顯示含稅/未稅
4. 可下載 Excel 與 PDF
5. PDF 版面符合 A 版型（中文標題、簽名處無日期）

