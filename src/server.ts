import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import docsRoutes from './routes/docs.routes';
import notificationsRoutes from './routes/notifications.routes';
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/docs', docsRoutes);
app.use('/api/notifications', notificationsRoutes);

app.get('/', (req, res) => {
    res.send('PaperTrail API Running ✅')
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
