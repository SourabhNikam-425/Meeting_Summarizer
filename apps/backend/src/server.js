import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './db/connection.js';
import { logger } from './config/logger.js';

async function main() {
  await connectDB();

  const PORT = parseInt(env.PORT);
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
    logger.info(`📁 Uploads stored in: ${env.UPLOAD_DIR}`);
    logger.info(`🤖 Gemini AI ready`);
  });
}

main().catch((err) => {
  logger.fatal({ err }, 'Failed to start server');
  process.exit(1);
});