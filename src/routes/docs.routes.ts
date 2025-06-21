import { Router } from 'express';
import * as DocsController from '../controllers/docs.controller';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Protected routes
router.get('/', protect, DocsController.getAllDocs);
router.post('/', protect, DocsController.createDoc);
router.get('/:id', protect, DocsController.getDocById);
router.put('/:id', protect, DocsController.updateDoc);
router.delete('/:id', protect, DocsController.deleteDoc);

export default router;
