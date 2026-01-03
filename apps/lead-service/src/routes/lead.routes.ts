import { Router } from 'express';
import { createLead, getLeads } from '../controllers/lead.controller';

const router = Router();

router.get('/', getLeads);
router.post('/', createLead);

export default router;
