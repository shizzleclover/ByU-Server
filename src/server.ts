import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const startServer = async () => {
  try {
    // Connect to MongoDB Atlas
    await connectDB();

    // Start Express server
    const PORT = parseInt(env.PORT, 10);
    app.listen(PORT, () => {
      console.log(`
  ╔══════════════════════════════════════════╗
  ║                                          ║
  ║   🚀 ByU Connect API Server             ║
  ║                                          ║
  ║   Port:    ${String(PORT).padEnd(28)}║
  ║   Mode:    ${env.NODE_ENV.padEnd(28)}║
  ║   Health:  http://localhost:${PORT}/api/health  ║
  ║                                          ║
  ╚══════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// ─── Handle unhandled rejections ───
process.on('unhandledRejection', (reason: Error) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

// ─── Handle uncaught exceptions ───
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

startServer();
