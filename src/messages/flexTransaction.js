const { formatAmount, getCategoryComment } = require('./textReplies');

const CATEGORY_EMOJI = {
  อาหาร: '🍽️',
  เดินทาง: '🚗',
  ที่พัก: '🏠',
  ค่าน้ำค่าไฟ: '💡',
  ช้อปปิ้ง: '🛍️',
  สุขภาพ: '❤️',
  การศึกษา: '📚',
  บันเทิง: '🎬',
  เงินเดือน: '💼',
  โบนัส: '🎊',
  งานเสริม: '💪',
  ขายของ: '📦',
  ของขวัญ: '🎁',
  อื่นๆ: '📌',
};

const THEME = {
  รายรับ: {
    accent: '#059669',
    accentDark: '#065F46',
    soft: '#ECFDF5',
    pale: '#D1FAE5',
    title: 'บันทึกรายรับแล้ว',
    amountLabel: 'เงินเข้า',
    sign: '+',
    icon: '💚',
  },
  รายจ่าย: {
    accent: '#DC2626',
    accentDark: '#991B1B',
    soft: '#FEF2F2',
    pale: '#FEE2E2',
    title: 'บันทึกรายจ่ายแล้ว',
    amountLabel: 'เงินออก',
    sign: '-',
    icon: '📝',
  },
};

function makeText(text, options = {}) {
  return {
    type: 'text',
    text,
    size: options.size || 'sm',
    color: options.color || '#334155',
    weight: options.weight,
    align: options.align,
    flex: options.flex,
    margin: options.margin,
    wrap: options.wrap,
    maxLines: options.maxLines,
  };
}

function makeDetailRow(label, value) {
  return {
    type: 'box',
    layout: 'horizontal',
    margin: 'sm',
    contents: [
      makeText(label, { flex: 2, color: '#64748B' }),
      makeText(value, { flex: 4, align: 'end', color: '#0F172A', weight: 'bold', wrap: true }),
    ],
  };
}

function generateTransactionFlex(data) {
  const { item, amount, category, type, date } = data;
  const theme = THEME[type] || THEME['รายจ่าย'];
  const categoryText = `${CATEGORY_EMOJI[category] || '📌'} ${category}`;
  const comment = getCategoryComment(category);
  const amountText = `${theme.sign}${formatAmount(amount)} บาท`;

  return {
    type: 'flex',
    altText: `${theme.title}: ${amountText} ${item}`,
    contents: {
      type: 'bubble',
      size: 'kilo',
      header: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '18px',
        backgroundColor: theme.accent,
        contents: [
          makeText(`${theme.icon} ${theme.title}`, {
            size: 'lg',
            color: '#FFFFFF',
            weight: 'bold',
          }),
          makeText('เก็บเข้าบัญชีเรียบร้อย', {
            size: 'xs',
            color: '#F8FAFC',
            margin: 'xs',
          }),
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '18px',
        backgroundColor: '#FFFFFF',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: theme.soft,
            cornerRadius: '16px',
            paddingAll: '16px',
            contents: [
              makeText(theme.amountLabel, {
                size: 'xs',
                color: theme.accentDark,
                weight: 'bold',
              }),
              makeText(amountText, {
                size: 'xxl',
                color: theme.accent,
                weight: 'bold',
                margin: 'xs',
                maxLines: 1,
              }),
            ],
          },
          {
            type: 'separator',
            margin: 'lg',
            color: '#E2E8F0',
          },
          makeDetailRow('รายการ', item),
          makeDetailRow('หมวด', categoryText),
          makeDetailRow('วันที่', date),
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            paddingAll: '12px',
            cornerRadius: '14px',
            backgroundColor: theme.pale,
            contents: [
              makeText(comment, {
                color: theme.accentDark,
                wrap: true,
              }),
            ],
          },
        ],
      },
    },
  };
}

module.exports = { generateTransactionFlex };
