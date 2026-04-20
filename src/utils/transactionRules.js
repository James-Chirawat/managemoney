/**
 * Transaction confidence rules
 * ใช้ร่วมกับ Gemini เพื่อกันไม่ให้ถามซ้ำในเคสที่มนุษย์อ่านแล้วชัดเจน
 */
const { EXPENSE_KEYWORDS, INCOME_KEYWORDS } = require('../constants/categories');
const { hasAmount } = require('./moneyParser');

const AUTO_SAVE_CONFIDENCE = 0.58;

const TRANSFER_OUT_WORDS = ['โอนให้', 'โอนไป', 'โอนค่า', 'โอนจ่าย', 'จ่ายโอน'];
const TRANSFER_IN_WORDS = ['โอนมา', 'โอนเข้า', 'ลูกค้าโอน', 'ได้รับโอน'];
const AMBIGUOUS_TRANSFER_PATTERNS = [
  /(^|\s)โอน\s*\d/,
  /(^|\s)โอนเงิน\s*\d/,
  /(^|\s)transfer\s*\d/i,
];
const AMBIGUOUS_GENERIC_PATTERNS = [
  /^เงิน\s*\d/,
  /^ยอด\s*\d/,
  /^รับ\s*\d/,
];

function normalizeText(text) {
  return String(text || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function includesAny(text, keywords) {
  const normalized = normalizeText(text);
  return keywords.some((keyword) => normalized.includes(String(keyword).toLowerCase()));
}

function hasDirectionalTransfer(text) {
  return includesAny(text, TRANSFER_OUT_WORDS) || includesAny(text, TRANSFER_IN_WORDS);
}

function hasExplicitTypeSignal(text) {
  return includesAny(text, EXPENSE_KEYWORDS) || includesAny(text, INCOME_KEYWORDS) || hasDirectionalTransfer(text);
}

function isAmbiguousTransactionText(text) {
  const normalized = normalizeText(text);

  if (hasDirectionalTransfer(normalized)) return false;

  const isAmbiguousTransfer = AMBIGUOUS_TRANSFER_PATTERNS.some((pattern) => pattern.test(normalized));
  if (isAmbiguousTransfer) return true;

  return AMBIGUOUS_GENERIC_PATTERNS.some((pattern) => pattern.test(normalized));
}

function hasRequiredTransactionFields(parsed) {
  return Boolean(
    parsed &&
    parsed.item &&
    parsed.amount !== null &&
    parsed.amount !== undefined &&
    parsed.type &&
    parsed.category &&
    (!Array.isArray(parsed.missing_fields) || parsed.missing_fields.length === 0)
  );
}

function isObviousTransactionText(text, parsed) {
  if (!hasRequiredTransactionFields(parsed)) return false;
  if (!hasAmount(text)) return false;
  if (isAmbiguousTransactionText(text)) return false;

  // item + amount คือ pattern หลักของบอทนี้ ถ้าไม่มีสัญญาณรายรับให้ถือว่าเป็นรายจ่ายได้
  return hasExplicitTypeSignal(text) || parsed.type === 'รายจ่าย' || parsed.type === 'รายรับ';
}

function shouldAutoSaveTransaction(parsed, originalText) {
  if (!hasRequiredTransactionFields(parsed)) return false;
  if (isAmbiguousTransactionText(originalText)) return false;
  if (Number(parsed.confidence) >= AUTO_SAVE_CONFIDENCE) return true;
  return isObviousTransactionText(originalText, parsed);
}

function boostConfidenceForObviousTransaction(parsed, originalText) {
  if (!parsed || !isObviousTransactionText(originalText, parsed)) return parsed;

  return {
    ...parsed,
    confidence: Math.max(Number(parsed.confidence) || 0, hasExplicitTypeSignal(originalText) ? 0.95 : 0.88),
  };
}

module.exports = {
  AUTO_SAVE_CONFIDENCE,
  boostConfidenceForObviousTransaction,
  hasExplicitTypeSignal,
  hasRequiredTransactionFields,
  isAmbiguousTransactionText,
  isObviousTransactionText,
  shouldAutoSaveTransaction,
};
