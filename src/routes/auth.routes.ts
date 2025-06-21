import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';

const router = Router();
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/reset', AuthController.resetPassword);

export default router;
