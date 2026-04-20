require('dotenv').config();

const config = {
  // LINE
  line: {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
  },

  // Gemini AI
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  },

  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    table: 'transactions',
  },

  // Server
  port: process.env.PORT || 3000,
};

// ─── Validate required config ───────────────────────────
function validateConfig() {
  const required = [
    ['LINE_CHANNEL_ACCESS_TOKEN', config.line.channelAccessToken],
    ['LINE_CHANNEL_SECRET', config.line.channelSecret],
    ['GEMINI_API_KEY', config.gemini.apiKey],
    ['SUPABASE_URL', config.supabase.url],
    ['SUPABASE_ANON_KEY', config.supabase.anonKey],
  ];

  const missing = required
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    console.error('❌ Missing environment variables:');
    missing.forEach((name) => console.error(`   - ${name}`));
    console.error('\n📝 ดูตัวอย่างได้ที่ .env.example');
    process.exit(1);
  }
}

module.exports = { config, validateConfig };
