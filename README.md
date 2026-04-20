# 💰 ManageMoney LINE Bot

LINE Bot บันทึกรายรับรายจ่าย ด้วย Gemini AI + Supabase

พิมพ์ข้อความภาษาไทยธรรมดา เช่น "กินข้าวมันไก่ 80" แล้วบอทจะวิเคราะห์และบันทึกให้อัตโนมัติ!

## ✨ Features

- 🤖 **AI วิเคราะห์ข้อความ** — ใช้ Google Gemini AI แยกรายรับ/รายจ่าย, จัดหมวด อัตโนมัติ
- 🗄️ **บันทึกลง Supabase** — ข้อมูลเก็บใน PostgreSQL ผ่าน Supabase
- 💬 **ตอบกลับแบบ Conversational** — บอทมี personality เป็นมิตร
- 📅 **รองรับวันที่ภาษาไทย** — "เมื่อวาน", "วันนี้", DD/MM/YYYY
- ⚡ **บันทึกทันทีเมื่อมั่นใจ** — เช่น "กินข้าวมันไก่ 80" จะบันทึกเป็นรายจ่ายเลย ไม่ถามซ้ำ
- 🔄 **ถามกลับเฉพาะตอนจำเป็น** — ถ้าไม่มีจำนวนเงิน หรือข้อความกำกวม เช่น "โอน 500"
- 🎨 **Flex Message ตอนบันทึกสำเร็จ** — รายรับสีเขียว รายจ่ายสีแดง อ่านง่ายกว่า text ธรรมดา
- 📊 **Flex Summary สวยขึ้น** — แสดงรายรับ รายจ่าย คงเหลือ หมวดเด่น รายการล่าสุด และ insight
- 👥 **Multi-user** — แยกข้อมูลตาม LINE user ID อัตโนมัติ

## 📋 ตัวอย่างการใช้งาน

| พิมพ์ | ผลลัพธ์ |
|------|--------|
| กินข้าวมันไก่ 80 | บันทึกทันที: รายจ่าย > อาหาร > 80 บาท |
| เงินเดือน 25000 | รายรับ > เงินเดือน > 25,000 บาท |
| ค่าแท็กซี่ 150 | รายจ่าย > เดินทาง > 150 บาท |
| ขายของได้ 1200 | รายรับ > ขายของ > 1,200 บาท |
| เมื่อวานค่าน้ำ 300 | รายจ่าย > ค่าน้ำค่าไฟ > วันเมื่อวาน |
| โอน 500 | ถามยืนยันก่อน เพราะไม่รู้ว่าเงินเข้าหรือออก |

## 🚀 การติดตั้ง

### 1. Clone และติดตั้ง dependencies

```bash
git clone https://github.com/your-repo/managemoney.git
cd managemoney
npm install
```

### 2. สร้าง LINE Bot

1. ไปที่ [LINE Developers Console](https://developers.line.biz/)
2. สร้าง Provider → สร้าง Messaging API Channel
3. คัดลอก **Channel Secret** และ **Channel Access Token**

### 3. สร้าง Google Gemini API Key

1. ไปที่ [Google AI Studio](https://aistudio.google.com/apikey)
2. สร้าง API Key

### 4. สร้าง Supabase Project

1. ไปที่ [supabase.com](https://supabase.com/) → สร้าง Project ใหม่
2. ไปที่ **Project Settings → API** แล้วคัดลอก:
   - **Project URL** → ใส่ใน `SUPABASE_URL`
   - **anon public key** → ใส่ใน `SUPABASE_ANON_KEY`

### 5. สร้างตาราง transactions

ไปที่ **SQL Editor** ใน Supabase แล้วรัน:

```sql
CREATE TABLE transactions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  item TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('รายรับ', 'รายจ่าย')),
  date DATE NOT NULL,
  line_user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- เปิด RLS (Row Level Security)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- สร้าง policy อนุญาต insert/select ทั้งหมด (สำหรับ anon key)
CREATE POLICY "Allow all inserts" ON transactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all selects" ON transactions
  FOR SELECT USING (true);

-- (Optional) Index สำหรับ query ตาม user
CREATE INDEX idx_transactions_user ON transactions (line_user_id);
CREATE INDEX idx_transactions_date ON transactions (date);
```

### 6. ตั้งค่า Environment Variables

```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env`:

```env
LINE_CHANNEL_ACCESS_TOKEN=your_token
LINE_CHANNEL_SECRET=your_secret
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=gemini-2.0-flash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key
PORT=3000
```

### 7. รัน

```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

### 8. ตั้งค่า Webhook URL ใน LINE

1. ไปที่ LINE Developers Console → Channel settings
2. ตั้ง Webhook URL: `https://your-domain.com/webhook`
3. เปิด "Use webhook"

## 📁 โครงสร้างโปรเจกต์

```
managemoney/
├── src/
│   ├── index.js              # Start server
│   ├── app.js                # Express routes + LINE middleware
│   ├── config.js             # Environment config
│   ├── handlers/
│   │   └── messageHandler.js # Business logic ของข้อความผู้ใช้
│   ├── services/
│   │   ├── lineService.js    # LINE event handler
│   │   ├── geminiService.js  # Gemini AI parser
│   │   └── transactionService.js # Supabase operations
│   ├── messages/
│   │   ├── textReplies.js    # Conversational text replies
│   │   ├── flexTransaction.js # LINE Flex บันทึกสำเร็จ
│   │   ├── flexSummary.js    # LINE Flex summary
│   │   └── index.js
│   ├── state/
│   │   └── pendingConfirmations.js # Pending confirmation in-memory
│   ├── utils/
│   │   ├── dateParser.js     # Thai date parsing
│   │   ├── moneyParser.js    # Money extraction helpers
│   │   └── transactionRules.js # Auto-save / confirmation rules
│   └── constants/
│       ├── categories.js     # Category definitions
│       └── prompts.js        # Gemini prompt templates
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🗄️ Database Schema (Supabase)

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Auto-increment primary key |
| item | TEXT | ชื่อรายการ |
| amount | NUMERIC | จำนวนเงิน |
| category | TEXT | หมวด (อาหาร, เดินทาง, ...) |
| type | TEXT | รายรับ / รายจ่าย |
| date | DATE | วันที่ (YYYY-MM-DD) |
| line_user_id | TEXT | LINE user ID |
| created_at | TIMESTAMPTZ | เวลาที่สร้าง |

## 🌐 Deploy

### Deploy บน Render (แนะนำ — ฟรี)

1. ไปที่ [render.com](https://render.com)
2. สร้าง Web Service → เชื่อม GitHub repo
3. ตั้งค่า:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. เพิ่ม Environment Variables ทั้งหมด
5. ใช้ URL ที่ Render ให้ เป็น LINE Webhook URL

### Deploy บน Railway

1. ไปที่ [railway.app](https://railway.app)
2. เชื่อม GitHub repo → ตั้ง env vars → Deploy

## 📝 License

MIT
