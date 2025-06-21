import { Router } from 'express';
import * as NotificationsController from '../controllers/notifications.controller';
import { authMiddleware as protect } from '../middleware/authMiddleware';

const router = Router();

// Protected routes
router.get('/', protect, NotificationsController.getAllNotifications);
router.post('/', protect, NotificationsController.createNotification);
router.get('/:id', protect, NotificationsController.getNotificationById);
router.delete('/:id', protect, NotificationsController.deleteNotification);

export default router;
