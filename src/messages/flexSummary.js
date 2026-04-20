const { formatAmount } = require('./textReplies');

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

function sumAmount(rows) {
  return rows.reduce((sum, row) => sum + Number(row.amount), 0);
}

function groupByCategory(rows) {
  return rows.reduce((grouped, row) => {
    grouped[row.category] = (grouped[row.category] || 0) + Number(row.amount);
    return grouped;
  }, {});
}

function topCategories(rows, limit) {
  return Object.entries(groupByCategory(rows))
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function formatThaiDate(dateValue) {
  const [year, month, day] = String(dateValue).split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: 'short',
    timeZone: 'Asia/Bangkok',
  });
}

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

function makeMetricCard(label, value, color, backgroundColor) {
  return {
    type: 'box',
    layout: 'vertical',
    backgroundColor,
    cornerRadius: '14px',
    paddingAll: '12px',
    flex: 1,
    contents: [
      makeText(label, { size: 'xs', color, weight: 'bold' }),
      makeText(value, { size: 'lg', color, weight: 'bold', maxLines: 1 }),
    ],
  };
}

function makeCategoryRows(categories, total) {
  if (categories.length === 0) {
    return [makeText('ยังไม่มีรายการ', { color: '#94A3B8' })];
  }

  return categories.map(([category, amount]) => {
    const percentage = total > 0 ? Math.round((amount / total) * 100) : 0;
    return {
      type: 'box',
      layout: 'horizontal',
      spacing: 'sm',
      margin: 'sm',
      contents: [
        makeText(`${CATEGORY_EMOJI[category] || '📌'} ${category}`, { flex: 4, maxLines: 1 }),
        makeText(`${percentage}%`, { flex: 1, align: 'end', color: '#64748B' }),
        makeText(`${formatAmount(amount)} ฿`, { flex: 2, align: 'end', weight: 'bold', color: '#0F172A' }),
      ],
    };
  });
}

function makeRecentRows(rows) {
  const recentRows = [...rows]
    .sort((a, b) => `${b.date}`.localeCompare(`${a.date}`))
    .slice(0, 5);

  if (recentRows.length === 0) {
    return [makeText('ยังไม่มีรายการล่าสุด', { color: '#94A3B8' })];
  }

  return recentRows.map((row) => {
    const isIncome = row.type === 'รายรับ';
    const color = isIncome ? '#059669' : '#DC2626';
    const sign = isIncome ? '+' : '-';
    return {
      type: 'box',
      layout: 'horizontal',
      spacing: 'sm',
      margin: 'sm',
      contents: [
        makeText(formatThaiDate(row.date), { flex: 2, color: '#64748B', size: 'xs' }),
        makeText(row.item, { flex: 4, maxLines: 1 }),
        makeText(`${sign}${formatAmount(row.amount)} ฿`, { flex: 3, align: 'end', color, weight: 'bold' }),
      ],
    };
  });
}

function makeSection(title, contents) {
  return {
    type: 'box',
    layout: 'vertical',
    spacing: 'xs',
    margin: 'lg',
    contents: [
      makeText(title, { size: 'sm', color: '#0F172A', weight: 'bold' }),
      ...contents,
    ],
  };
}

function buildInsight({ net, totalIncome, totalExpense, expenseRows }) {
  if (net < 0) {
    return 'รายจ่ายสูงกว่ารายรับ ลองดูหมวดที่จ่ายเยอะสุดด้านบนก่อนครับ';
  }

  if (totalIncome === 0 && totalExpense > 0) {
    return 'ช่วงนี้มีแต่รายจ่าย ถ้ามีรายรับเข้ามาอย่าลืมบันทึกนะครับ';
  }

  if (totalIncome > 0 && totalExpense / totalIncome > 0.8) {
    return 'ใช้ไปเกิน 80% ของรายรับแล้ว คุมอีกนิดจะสวยมากครับ';
  }

  if (expenseRows.length === 0) {
    return 'ยังไม่มีรายจ่ายในช่วงนี้ กระแสเงินสดดูสดใสมากครับ';
  }

  return 'ภาพรวมยังดีครับ ดูหมวดจ่ายสูงสุดเพื่อจับจุดประหยัดต่อได้เลย';
}

function generateFlexSummary(rows, label) {
  if (!rows || rows.length === 0) return null;

  const incomeRows = rows.filter((row) => row.type === 'รายรับ');
  const expenseRows = rows.filter((row) => row.type === 'รายจ่าย');
  const totalIncome = sumAmount(incomeRows);
  const totalExpense = sumAmount(expenseRows);
  const net = totalIncome - totalExpense;
  const topExpenseCategories = topCategories(expenseRows, 5);
  const topIncomeCategories = topCategories(incomeRows, 3);
  const avgExpense = expenseRows.length > 0 ? totalExpense / expenseRows.length : 0;
  const netColor = net >= 0 ? '#059669' : '#DC2626';
  const netSign = net >= 0 ? '+' : '-';
  const insight = buildInsight({ net, totalIncome, totalExpense, expenseRows });

  const bubble = {
    type: 'bubble',
    size: 'mega',
    header: {
      type: 'box',
      layout: 'vertical',
      paddingAll: '20px',
      backgroundColor: '#0F172A',
      contents: [
        makeText('สรุปรายรับรายจ่าย', { size: 'lg', color: '#FFFFFF', weight: 'bold' }),
        makeText(`${label} • ${rows.length} รายการ`, { size: 'sm', color: '#CBD5E1', margin: 'xs' }),
      ],
    },
    body: {
      type: 'box',
      layout: 'vertical',
      paddingAll: '16px',
      spacing: 'sm',
      contents: [
        {
          type: 'box',
          layout: 'horizontal',
          spacing: 'sm',
          contents: [
            makeMetricCard('รายรับ', `${formatAmount(totalIncome)} ฿`, '#047857', '#ECFDF5'),
            makeMetricCard('รายจ่าย', `${formatAmount(totalExpense)} ฿`, '#B91C1C', '#FEF2F2'),
          ],
        },
        {
          type: 'box',
          layout: 'vertical',
          backgroundColor: net >= 0 ? '#F0FDF4' : '#FFF1F2',
          cornerRadius: '16px',
          paddingAll: '14px',
          margin: 'md',
          contents: [
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                makeText(net >= 0 ? 'คงเหลือสุทธิ' : 'ติดลบสุทธิ', { flex: 3, color: netColor, weight: 'bold' }),
                makeText(`${netSign}${formatAmount(Math.abs(net))} ฿`, { flex: 3, color: netColor, weight: 'bold', align: 'end', size: 'lg' }),
              ],
            },
            makeText(`เฉลี่ยรายจ่ายต่อรายการ ${formatAmount(avgExpense)} ฿`, { size: 'xs', color: '#64748B', margin: 'xs' }),
          ],
        },
        makeSection('หมวดรายจ่ายสูงสุด', makeCategoryRows(topExpenseCategories, totalExpense)),
        makeSection('แหล่งรายรับ', makeCategoryRows(topIncomeCategories, totalIncome)),
        makeSection('รายการล่าสุด', makeRecentRows(rows)),
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      paddingAll: '14px',
      backgroundColor: '#F8FAFC',
      contents: [
        makeText(insight, { size: 'xs', color: '#475569', wrap: true }),
      ],
    },
  };

  return {
    type: 'flex',
    altText: `สรุป${label}: รับ ${formatAmount(totalIncome)} จ่าย ${formatAmount(totalExpense)} คงเหลือ ${netSign}${formatAmount(Math.abs(net))} บาท`,
    contents: bubble,
  };
}

module.exports = { generateFlexSummary };
