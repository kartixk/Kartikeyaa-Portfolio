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
    if (!origin || (origin && origin.includes('vercel.app')) || allowedOrigins.includes(origin)) {
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
        const rootIndexPath = path.resolve(__dirname, '..', 'index.html');
        console.error('index.html not found in dist. Looking in root.');
        
        if (fs.existsSync(rootIndexPath)) {
          console.warn('Serving root index.html as fallback (this might not work correctly).');
          res.sendFile(rootIndexPath);
        } else {
           res.status(404).send(`
            <div style="font-family: sans-serif; padding: 20px;">
              <h1>Deployment Error: Build Missing</h1>
              <p>The server is running, but the <code>dist/index.html</code> file is missing.</p>
              <hr/>
              <h3>Action Required:</h3>
              <ol>
                <li>Go to Render Dashboard -> Settings</li>
                <li>Ensure <b>Build Command</b> is set to: <code>npm run render-build</code></li>
                <li>Ensure <b>Start Command</b> is set to: <code>npm start</code></li>
                <li>Go to "Manual Deploy" -> "Clear Build Cache & Deploy"</li>
              </ol>
            </div>
          `);
        }
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

