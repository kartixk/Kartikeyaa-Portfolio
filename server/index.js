import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import contactRoutes from './routes/contactRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:5173',
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // Also allow any vercel.app subdomain, or specific allowed origins
    // Allow requests from Vercel, Render subdomains, and localhost
    if (!origin || 
        origin.includes('vercel.app') || 
        origin.includes('onrender.com') || 
        allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', contactRoutes);

// Static file serving in production
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.resolve(__dirname, '..', 'dist');
  console.log('Production mode detected.');
  console.log('Static files path:', publicPath);

  if (fs.existsSync(publicPath)) {
    console.log('Static directory exists. Contents:', fs.readdirSync(publicPath));
  } else {
    console.error('Static directory NOT FOUND.');
    console.log('Root directory folders:', fs.readdirSync(path.resolve(__dirname, '..')));
  }

  // Serve any static files
  app.use(express.static(publicPath));

  // Handle React routing
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      const indexPath = path.resolve(publicPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send(`
          <div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
            <h1 style="color: #d32f2f;">Deployment Error: Build Folder Missing</h1>
            <p>The backend server is running, but the <b>frontend build</b> (the <code>dist</code> folder) was not created.</p>
            <hr/>
            <h3>How to fix this:</h3>
            <ol>
              <li>Go to your <b>Render Dashboard</b>.</li>
              <li>Go to <b>Settings</b>.</li>
              <li>Check your <b>Build Command</b>. It MUST be: <code>npm run render-build</code></li>
              <li>Check your <b>Start Command</b>. It MUST be: <code>npm start</code></li>
              <li>Go to <b>Manual Deploy</b> and click <b>"Clear Build Cache & Deploy"</b>.</li>
            </ol>
            <p><i>Note: The build process usually takes 2-3 minutes. Check the "Logs" tab in Render to see if "vite build" completes successfully.</i></p>
          </div>
        `);
      }
    }
  });
}
 else {
  // Simple welcome message for non-production
  app.get('/', (req, res) => {
    res.send('Server is running in development mode. Use the frontend dev server for the UI.');
  });
}

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

