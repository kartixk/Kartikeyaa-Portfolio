import { Router } from 'express';
import { handleContact } from '../controllers/contactController.js';

const router = Router();

router.post('/contact', handleContact);

export default router;

