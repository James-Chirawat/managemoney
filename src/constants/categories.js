// ─── หมวดรายจ่าย ────────────────────────────────────────
const EXPENSE_CATEGORIES = [
  {
    name: 'อาหาร',
    keywords: ['กิน', 'ข้าวมันไก่', 'ข้าวผัด', 'ข้าว', 'อาหาร', 'กาแฟ', 'ชาไข่มุก', 'ชา', 'ขนมปัง', 'ขนม', 'นม', 'น้ำดื่ม', 'เครื่องดื่ม', 'ก๋วยเตี๋ยว', 'บะหมี่', 'ราเมง', 'ส้มตำ', 'พิซซ่า', 'ไก่ทอด', 'หมูกระทะ', 'ชาบู', 'ร้านอาหาร', 'ร้าน', 'บุฟเฟ่ต์'],
  },
  {
    name: 'เดินทาง',
    keywords: ['แท็กซี่', 'ค่ารถ', 'รถไฟฟ้า', 'รถเมล์', 'รถ', 'น้ำมัน', 'เติมน้ำมัน', 'bts', 'mrt', 'grab', 'bolt', 'วิน', 'มอเตอร์ไซค์', 'เดินทาง', 'ตั๋ว', 'ค่าผ่านทาง', 'ทางด่วน'],
  },
  {
    name: 'ที่พัก',
    keywords: ['ค่าเช่า', 'หอ', 'คอนโด', 'บ้าน', 'ที่พัก', 'โรงแรม', 'ห้อง'],
  },
  {
    name: 'ค่าน้ำค่าไฟ',
    keywords: ['ค่าน้ำ', 'ค่าไฟ', 'ไฟฟ้า', 'ประปา', 'ค่าเน็ต', 'อินเทอร์เน็ต', 'ค่าโทรศัพท์', 'ค่ามือถือ', 'ค่าโทร', 'wifi', 'ไวไฟ'],
  },
  {
    name: 'ช้อปปิ้ง',
    keywords: ['ซื้อ', 'ช้อป', 'ของใช้', 'ของ', 'เสื้อผ้า', 'รองเท้า', 'กระเป๋า', 'เครื่องสำอาง', 'สกินแคร์', 'ของแต่งบ้าน'],
  },
  {
    name: 'สุขภาพ',
    keywords: ['หมอ', 'ยา', 'โรงพยาบาล', 'คลินิก', 'ทำฟัน', 'ตรวจ', 'สุขภาพ', 'ฟิตเนส', 'ยิม'],
  },
  {
    name: 'การศึกษา',
    keywords: ['เรียน', 'คอร์ส', 'หนังสือ', 'ค่าเทอม', 'ติว', 'สัมมนา', 'อบรม'],
  },
  {
    name: 'บันเทิง',
    keywords: ['หนัง', 'เกม', 'Netflix', 'Spotify', 'YouTube', 'คอนเสิร์ต', 'ท่องเที่ยว', 'สวนสนุก'],
  },
];

// ─── หมวดรายรับ ────────────────────────────────────────
const INCOME_CATEGORIES = [
  { name: 'เงินเดือน', keywords: ['เงินเดือน', 'salary', 'ค่าแรง', 'แรง'] },
  { name: 'โบนัส', keywords: ['โบนัส', 'bonus', 'พิเศษ'] },
  { name: 'งานเสริม', keywords: ['งานเสริม', 'ฟรีแลนซ์', 'freelance', 'ค่าคอม', 'คอมมิชชั่น', 'รับงาน'] },
  { name: 'ขายของ', keywords: ['ขาย', 'ลูกค้า', 'ยอดขาย', 'ออเดอร์'] },
  { name: 'ของขวัญ', keywords: ['ให้เงิน', 'อั่งเปา', 'ของขวัญ', 'แม่ให้', 'พ่อให้'] },
];

// ─── Keywords สำหรับแยกรายรับ / รายจ่าย ────────────────
const EXPENSE_KEYWORDS = ['ซื้อ', 'กิน', 'จ่าย', 'ค่า', 'เติม', 'ชำระ', 'สั่ง', 'จอง', 'โอนให้', 'โอนไป', 'หักบัญชี', 'สมัคร', 'ต่ออายุ'];
const INCOME_KEYWORDS = ['เงินเดือน', 'โบนัส', 'ขายได้', 'ลูกค้าโอน', 'ได้เงิน', 'รายได้', 'ค่าคอม', 'ให้เงิน', 'โอนมา', 'เงินเข้า', 'รับเงิน', 'รับมา', 'คืนเงิน'];

// ─── หมวดทั้งหมดที่ Gemini ใช้ได้ ──────────────────────
const ALL_CATEGORIES = [
  'อาหาร', 'เดินทาง', 'ที่พัก', 'ค่าน้ำค่าไฟ', 'ช้อปปิ้ง',
  'สุขภาพ', 'การศึกษา', 'บันเทิง',
  'เงินเดือน', 'โบนัส', 'งานเสริม', 'ขายของ', 'ของขวัญ',
  'อื่นๆ',
];

/**
 * Fallback: จัดหมวดจาก keyword (ใช้เมื่อ Gemini ล้มเหลว)
 */
function categorizeByKeyword(text, type) {
  const categories = type === 'รายรับ' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const normalizedText = String(text || '').toLowerCase();
  let bestMatch = null;

  for (const cat of categories) {
    for (const kw of cat.keywords) {
      const normalizedKeyword = String(kw).toLowerCase();
      if (normalizedText.includes(normalizedKeyword)) {
        if (!bestMatch || normalizedKeyword.length > bestMatch.keywordLength) {
          bestMatch = { name: cat.name, keywordLength: normalizedKeyword.length };
        }
      }
    }
  }

  return bestMatch ? bestMatch.name : 'อื่นๆ';
}

/**
 * Fallback: แยกรายรับ/รายจ่ายจาก keyword
 */
function classifyByKeyword(text) {
  const normalizedText = String(text || '').toLowerCase();

  for (const kw of INCOME_KEYWORDS) {
    if (normalizedText.includes(String(kw).toLowerCase())) return 'รายรับ';
  }
  for (const kw of EXPENSE_KEYWORDS) {
    if (normalizedText.includes(String(kw).toLowerCase())) return 'รายจ่าย';
  }
  return 'รายจ่าย'; // default เป็นรายจ่าย
}

module.exports = {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  EXPENSE_KEYWORDS,
  INCOME_KEYWORDS,
  ALL_CATEGORIES,
  categorizeByKeyword,
  classifyByKeyword,
};
