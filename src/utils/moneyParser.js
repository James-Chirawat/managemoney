/**
 * Money parsing helpers
 * ดึงจำนวนเงินจากข้อความภาษาไทยแบบทนต่อ comma, บาท, ฿ และวันที่
 */

const MONEY_PATTERN = /(?:฿\s*)?(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?)(?:\s*(?:บาท|บ\.|฿))?/gi;
const DATE_PATTERNS = [
  /\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/g,
  /\d{4}-\d{1,2}-\d{1,2}/g,
];

function stripDateLikeText(text) {
  return DATE_PATTERNS.reduce((result, pattern) => result.replace(pattern, ' '), text);
}

function parseAmountValue(value) {
  const amount = Number(String(value).replace(/บาท|บ\.|฿|,|\s/g, ''));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function extractAmount(text) {
  const textWithoutDates = stripDateLikeText(text);
  const matches = [...textWithoutDates.matchAll(MONEY_PATTERN)];
  if (matches.length === 0) return null;

  const lastMatch = matches[matches.length - 1];
  return parseAmountValue(lastMatch[1]);
}

function hasAmount(text) {
  return extractAmount(text) !== null;
}

function removeMoneyText(text) {
  return stripDateLikeText(text)
    .replace(MONEY_PATTERN, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanTransactionItem(text) {
  return removeMoneyText(text)
    .replace(/(?:วันนี้|เมื่อวาน|พรุ่งนี้)/g, ' ')
    .replace(/^(?:ซื้อ|กิน|จ่าย|ชำระ|เติม|สั่ง|จอง|ขายได้|ขาย|ได้เงิน|รับเงิน|รายได้)\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim() || null;
}

module.exports = {
  cleanTransactionItem,
  extractAmount,
  hasAmount,
  parseAmountValue,
  removeMoneyText,
  stripDateLikeText,
};
