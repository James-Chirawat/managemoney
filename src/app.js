const express = require('express');
const line = require('@line/bot-sdk');
const { config } = require('./config');
const { handleEvent } = require('./services/lineService');

function createApp() {
  const app = express();

  // LINE SDK verifies the x-line-signature header against the raw request body.
  // Keep this middleware directly on /webhook and do not add express.json() before it.
  const lineMiddleware = line.middleware({
    channelSecret: config.line.channelSecret,
  });

  app.get('/', (req, res) => {
    res.json({
      status: 'ok',
      name: 'ManageMoney LINE Bot',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/webhook', lineMiddleware, async (req, res) => {
    try {
      const events = req.body.events || [];

      if (events.length === 0) {
        return res.status(200).json({ status: 'no events' });
      }

      const results = await Promise.allSettled(events.map((event) => handleEvent(event)));
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`❌ Event ${index} failed:`, result.reason);
        }
      });

      return res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('❌ Webhook error:', error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  });

  app.use((err, req, res, next) => {
    if (err instanceof line.SignatureValidationFailed) {
      console.error('❌ LINE Signature Validation Failed');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    if (err instanceof line.JSONParseError) {
      console.error('❌ JSON Parse Error');
      return res.status(400).json({ error: 'Invalid JSON' });
    }

    console.error('❌ Unhandled error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
