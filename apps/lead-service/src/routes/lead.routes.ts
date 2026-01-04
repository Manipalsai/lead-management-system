import { Router } from 'express';
import * as LeadController from '../controllers/lead.controller';

import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', LeadController.createLead);
// specific routes before parameterized routes
router.get('/stats', LeadController.getStats);
router.get('/recent', LeadController.getRecentLeads);
router.get('/notifications', LeadController.getNotifications);
router.post('/notifications/read', LeadController.markNotificationsRead);
router.get('/', LeadController.getLeads);
router.put('/:id', LeadController.updateLead);
router.delete('/:id', LeadController.deleteLead);

export default router;
