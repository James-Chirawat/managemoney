/**
 * Thai Date Parser
 * แปลงคำภาษาไทยเกี่ยวกับวันที่เป็น YYYY-MM-DD
 */

/**
 * สร้างวันที่ในเขตเวลาไทย (UTC+7)
 */
function getThaiDate(offsetDays = 0) {
  const now = new Date();
  // แปลงเป็นเวลาไทย
  const thaiTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  thaiTime.setUTCDate(thaiTime.getUTCDate() + offsetDays);
  return formatDate(thaiTime);
}

/**
 * Format Date เป็น YYYY-MM-DD
 */
function formatDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * วันที่วันนี้ (Bangkok timezone)
 */
function getToday() {
  return getThaiDate(0);
}

/**
 * วันที่เมื่อวาน (Bangkok timezone)
 */
function getYesterday() {
  return getThaiDate(-1);
}

/**
 * พยายาม parse วันที่จากข้อความภาษาไทย
 * ถ้า parse ไม่ได้ return null (ให้ Gemini จัดการ)
 */
function parseDateFromText(text) {
  const lowerText = text.toLowerCase();

  // วันนี้
  if (lowerText.includes('วันนี้')) {
    return getToday();
  }

  // เมื่อวาน
  if (lowerText.includes('เมื่อวาน')) {
    return getYesterday();
  }

  // พรุ่งนี้
  if (lowerText.includes('พรุ่งนี้')) {
    return getThaiDate(1);
  }

  // Format DD/MM/YYYY
  const slashMatch = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Format DD-MM-YYYY
  const dashMatch = text.match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
  if (dashMatch) {
    const [, day, month, year] = dashMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return null; // ให้ Gemini จัดการ
}

/**
 * Validate ว่าเป็น YYYY-MM-DD ที่ถูกต้อง
 */
function isValidDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    !Number.isNaN(date.getTime()) &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}

module.exports = {
  getToday,
  getYesterday,
  parseDateFromText,
  isValidDate,
  formatDate,
};
