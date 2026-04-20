/**
 * Transaction Service
 * เชื่อมต่อ อ่าน และเขียนข้อมูลธุรกรรมลง Supabase (PostgreSQL)
 */
const { createClient } = require('@supabase/supabase-js');
const { config } = require('../config');

const supabase = createClient(config.supabase.url, config.supabase.anonKey);
const TABLE = config.supabase.table;

function toTransactionRow(data, lineUserId = null) {
  const { item, amount, category, type, date } = data;
  return {
    item,
    amount,
    category,
    type,
    date,
    line_user_id: lineUserId,
  };
}

async function appendTransaction(data, lineUserId = null) {
  try {
    const { data: inserted, error } = await supabase
      .from(TABLE)
      .insert([toTransactionRow(data, lineUserId)])
      .select();

    if (error) {
      console.error('❌ Supabase Insert Error:', error.message);
      return { success: false, error: error.message };
    }

    console.log(`✅ บันทึก: ${data.item} | ${data.amount} | ${data.category} | ${data.type} | ${data.date}`);
    return { success: true, data: inserted };
  } catch (error) {
    console.error('❌ Supabase Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function getTransactions(lineUserId, dateFrom, dateTo) {
  try {
    let query = supabase
      .from(TABLE)
      .select('item, amount, category, type, date')
      .gte('date', dateFrom)
      .lte('date', dateTo)
      .order('date', { ascending: true });

    if (lineUserId) {
      query = query.eq('line_user_id', lineUserId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Supabase Select Error:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('❌ Supabase Error:', error.message);
    return null;
  }
}

async function testConnection() {
  try {
    const { error } = await supabase.from(TABLE).select('id').limit(1);
    if (error) {
      console.error('❌ ไม่สามารถเชื่อมต่อ Supabase:', error.message);
      return false;
    }
    console.log('✅ เชื่อมต่อ Supabase สำเร็จ');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    return false;
  }
}

module.exports = {
  appendTransaction,
  getTransactions,
  supabase,
  testConnection,
};
