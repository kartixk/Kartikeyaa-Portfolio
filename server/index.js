import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import contactRoutes from './routes/contactRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', contactRoutes);

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.warn('MONGODB_URI is not set. Contact messages will not be persisted.');
}

async function start() {
  try {
    if (mongoUri) {
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB');
    }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

start();

