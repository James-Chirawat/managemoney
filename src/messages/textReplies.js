/**
 * Text replies and message intent helpers
 */

const CATEGORY_RESPONSES = {
  อาหาร: [
    'เติมพลังเรียบร้อย มื้อนี้บัญชีรับรู้แล้วครับ 🍽️',
    'อร่อยแค่ไหนไม่รู้ แต่บันทึกให้ไวมากครับ 😋',
    'มื้อนี้ผ่านเข้าระบบแล้ว กินให้อร่อยนะครับ',
    'ข้าวคือพลังชีวิต บันทึกให้แล้วครับ',
  ],
  เดินทาง: [
    'ค่าเดินทางลงบัญชีแล้ว เดินทางปลอดภัยนะครับ 🚗',
    'เส้นทางวันนี้มีค่าใช้จ่าย ผมเก็บให้แล้วครับ',
    'ถึงที่หมายแบบงบไม่หลุด บันทึกแล้วครับ',
  ],
  ที่พัก: [
    'ค่าอยู่ค่าอาศัยจัดเก็บให้เรียบร้อยครับ 🏠',
    'หลังคาและความสบาย บันทึกให้แล้วครับ',
  ],
  ค่าน้ำค่าไฟ: [
    'บิลประจำบ้านเคลียร์เข้าระบบแล้วครับ 💡',
    'ค่าสาธารณูปโภคเดือนนี้ไม่หลุดบัญชีแน่นอน',
  ],
  ช้อปปิ้ง: [
    'ของใหม่เข้าบ้าน ตัวเลขเข้าบัญชีแล้วครับ 🛍️',
    'ช้อปได้ แต่บัญชีก็ต้องรู้ บันทึกแล้วครับ',
    'รายการนี้ผมจับลงหมวดช้อปปิ้งให้แล้ว',
  ],
  สุขภาพ: [
    'ลงทุนกับสุขภาพเป็นรายจ่ายที่ดีครับ บันทึกแล้ว ❤️',
    'ดูแลตัวเองเก่งมาก รายการนี้ลงบัญชีแล้วครับ',
  ],
  การศึกษา: [
    'ลงทุนกับความรู้คุ้มเสมอ บันทึกให้แล้วครับ 📚',
    'อัปสกิลพร้อมอัปเดตบัญชี เรียบร้อยครับ',
  ],
  บันเทิง: [
    'พักบ้างก็สำคัญ รายการนี้บันทึกแล้วครับ 🎬',
    'ความสุขมีต้นทุน ผมเก็บตัวเลขให้แล้วครับ',
  ],
  เงินเดือน: [
    'เงินเข้าแล้ว ใจฟูได้เลยครับ 💚',
    'รายรับหลักมาแล้ว บันทึกให้เรียบร้อยครับ',
    'เดือนนี้เริ่มมีแรงใจขึ้นทันทีครับ',
  ],
  โบนัส: [
    'โบนัสเข้าแบบนี้ ยิ้มได้เต็มที่ครับ 🎊',
    'เงินพิเศษมาเยือน บันทึกให้แล้วครับ',
    'รายการนี้ทำให้กราฟดูสดใสขึ้นเยอะเลย',
  ],
  งานเสริม: [
    'ขยันหาเงินมากครับ รายรับนี้ลงบัญชีแล้ว 💼',
    'งานเสริมเข้ากระเป๋า ผมบันทึกให้แล้วครับ',
  ],
  ขายของ: [
    'ยอดขายมาแล้ว เก่งมากครับ 📦',
    'ค้าขายไหลลื่น บันทึกรายรับให้แล้วครับ',
    'รายการนี้กลิ่นความปังมาเลยครับ',
  ],
  ของขวัญ: [
    'มีคนใจดีด้วย บันทึกให้แล้วครับ 🎁',
    'รายรับสายอบอุ่น ลงบัญชีเรียบร้อยครับ',
  ],
  อื่นๆ: [
    'บันทึกเรียบร้อยแล้วครับ 📝',
    'เก็บเข้าบัญชีให้แล้วครับ',
    'เรียบร้อยครับ รายการนี้ไม่หลุดแน่นอน',
  ],
};

const MISSING_FIELD_RESPONSES = {
  amount: [
    'รายการนี้จำนวนเงินเท่าไรครับ?',
    'ขอจำนวนเงินเพิ่มนิดเดียว แล้วผมจะบันทึกให้เลยครับ',
    'เห็นรายการแล้วครับ เหลือแค่ยอดเงินเท่าไรนะ?',
  ],
  type: [
    'รายการนี้เป็นรายรับหรือรายจ่ายครับ?',
    'ช่วยบอกนิดนึงครับว่าเงินเข้าหรือเงินออก?',
  ],
  item: [
    'รายการอะไรครับ? ช่วยบอกชื่อรายการนิดนึงนะ',
    'ขอชื่อรายการด้วยครับ จะได้บันทึกให้ตรงหมวด',
  ],
};

const GENERAL_RESPONSES = {
  notText: 'ตอนนี้รับเฉพาะข้อความนะครับ ลองพิมพ์รายรับรายจ่ายมาได้เลย เช่น กินข้าวมันไก่ 80',
  error: 'ขอโทษครับ ระบบสะดุดชั่วคราว ลองใหม่อีกครั้งนะครับ 🙏',
  greeting: 'สวัสดีครับ! ผมเป็นผู้ช่วยบันทึกรายรับรายจ่าย\n\nพิมพ์ธรรมชาติได้เลย เช่น:\n• กินข้าวมันไก่ 80\n• เงินเดือน 25000\n• ค่าแท็กซี่ 150\n\nถ้าข้อมูลชัดเจน ผมจะบันทึกให้ทันทีครับ',
  help: 'วิธีใช้งานแบบสั้นมาก:\n\nบันทึกรายการ:\n• กินข้าว 80\n• ค่าแท็กซี่ 150\n• เงินเดือน 25000\n• เมื่อวานค่าน้ำ 300\n\nดูสรุป:\n• สรุป\n• สรุปวันนี้\n• วิเคราะห์สัปดาห์นี้\n• วิเคราะห์เดือนนี้\n\nเคสชัดเจนผมบันทึกให้เลย ถ้ากำกวมจริง ๆ ถึงจะถามยืนยันครับ',
  noData: 'ยังไม่มีรายการในช่วงนี้เลยครับ ลองบันทึกรายรับรายจ่ายก่อน แล้วค่อยเรียกสรุปได้เลย 📭',
};

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatAmount(amount) {
  return Number(amount).toLocaleString('th-TH', {
    maximumFractionDigits: 2,
  });
}

function getCategoryComment(category) {
  return CATEGORY_RESPONSES[category]
    ? randomPick(CATEGORY_RESPONSES[category])
    : randomPick(CATEGORY_RESPONSES['อื่นๆ']);
}

function generateMissingFieldReply(missingFields, partialData) {
  const field = missingFields[0];
  const responses = MISSING_FIELD_RESPONSES[field] || MISSING_FIELD_RESPONSES.item;
  let reply = randomPick(responses);

  if (partialData.item && field !== 'item') {
    reply = `รายการ "${partialData.item}" ยังขาดข้อมูลนิดเดียวครับ\n${reply}`;
  }

  return reply;
}

function generateConfirmQuickReply(data) {
  const { item, amount, type, category } = data;
  const formattedAmount = formatAmount(amount);
  const typeEmoji = type === 'รายรับ' ? '💚' : '📝';

  return {
    type: 'text',
    text: [
      'รายการนี้ยังดูคลุมเครือนิดนึงครับ',
      '',
      `${typeEmoji} ${type}: ${formattedAmount} บาท`,
      `รายการ: ${item}`,
      `หมวด: ${category}`,
      '',
      'ให้บันทึกตามนี้ไหมครับ?',
    ].join('\n'),
    quickReply: {
      items: [
        {
          type: 'action',
          action: { type: 'message', label: 'บันทึก ✅', text: 'ใช่' },
        },
        {
          type: 'action',
          action: { type: 'message', label: 'ยกเลิก ❌', text: 'ไม่ใช่' },
        },
      ],
    },
  };
}

function isGreeting(text) {
  const greetings = ['สวัสดี', 'หวัดดี', 'ดี', 'hi', 'hello', 'hey', 'halo'];
  return greetings.some((greeting) => text.toLowerCase().trim() === greeting);
}

function isHelpRequest(text) {
  const helpWords = ['ช่วย', 'help', 'วิธีใช้', 'สอน', 'ใช้ยังไง', 'ทำยังไง'];
  return helpWords.some((word) => text.toLowerCase().includes(word));
}

function isAnalysisRequest(text) {
  const words = ['วิเคราะห์', 'สรุป', 'ดูรายการ', 'รายงาน', 'summary', 'report'];
  return words.some((word) => text.toLowerCase().includes(word));
}

function parseSummaryPeriod(text) {
  const now = new Date(Date.now() + 7 * 60 * 60 * 1000);
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

  if (text.includes('วันนี้')) {
    const today = fmt(year, month, day);
    return { dateFrom: today, dateTo: today, label: 'วันนี้' };
  }

  if (text.includes('เมื่อวาน')) {
    const yesterday = new Date(now);
    yesterday.setUTCDate(day - 1);
    const value = fmt(yesterday.getUTCFullYear(), yesterday.getUTCMonth() + 1, yesterday.getUTCDate());
    return { dateFrom: value, dateTo: value, label: 'เมื่อวาน' };
  }

  if (text.includes('สัปดาห์นี้') || text.includes('อาทิตย์นี้')) {
    const dayOfWeek = now.getUTCDay();
    const monday = new Date(now);
    monday.setUTCDate(day - ((dayOfWeek + 6) % 7));
    const sunday = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);
    return {
      dateFrom: fmt(monday.getUTCFullYear(), monday.getUTCMonth() + 1, monday.getUTCDate()),
      dateTo: fmt(sunday.getUTCFullYear(), sunday.getUTCMonth() + 1, sunday.getUTCDate()),
      label: 'สัปดาห์นี้',
    };
  }

  if (text.includes('เดือนที่แล้ว') || text.includes('เดือนก่อน')) {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const lastDay = new Date(prevYear, prevMonth, 0).getDate();
    return {
      dateFrom: fmt(prevYear, prevMonth, 1),
      dateTo: fmt(prevYear, prevMonth, lastDay),
      label: 'เดือนที่แล้ว',
    };
  }

  const monthMatch = text.match(/เดือน\s*(\d{1,2})/);
  if (monthMatch) {
    const targetMonth = parseInt(monthMatch[1], 10);
    const targetYear = targetMonth > month ? year - 1 : year;
    const lastDay = new Date(targetYear, targetMonth, 0).getDate();
    return {
      dateFrom: fmt(targetYear, targetMonth, 1),
      dateTo: fmt(targetYear, targetMonth, lastDay),
      label: `เดือน ${targetMonth}`,
    };
  }

  const lastDay = new Date(year, month, 0).getDate();
  return {
    dateFrom: fmt(year, month, 1),
    dateTo: fmt(year, month, lastDay),
    label: 'เดือนนี้',
  };
}

module.exports = {
  GENERAL_RESPONSES,
  formatAmount,
  getCategoryComment,
  generateConfirmQuickReply,
  generateMissingFieldReply,
  isAnalysisRequest,
  isGreeting,
  isHelpRequest,
  parseSummaryPeriod,
};
