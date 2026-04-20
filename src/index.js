/**
 * ManageMoney LINE Bot
 * Entry point สำหรับ start server
 */
const { createApp } = require('./app');
const { config, validateConfig } = require('./config');
const { testConnection } = require('./services/transactionService');

validateConfig();

async function startServer() {
  try {
    console.log('🔌 กำลังเชื่อมต่อ Supabase...');
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ ไม่สามารถเชื่อมต่อ Supabase ได้');
      console.error('📝 ตรวจสอบ SUPABASE_URL และ SUPABASE_ANON_KEY');
      process.exit(1);
    }

    const app = createApp();
    app.listen(config.port, () => {
      console.log('');
      console.log('╔══════════════════════════════════════════╗');
      console.log('║   💰 ManageMoney LINE Bot Started!       ║');
      console.log('╠══════════════════════════════════════════╣');
      console.log(`║   🌐 Port: ${config.port}                          ║`);
      console.log('║   📡 Webhook: /webhook                   ║');
      console.log(`║   🤖 AI: Gemini ${config.gemini.model}        ║`);
      console.log('║   🗄️  DB: Supabase                       ║');
      console.log('╚══════════════════════════════════════════╝');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
