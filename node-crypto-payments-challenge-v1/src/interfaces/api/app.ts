import express from 'express';
// Correct import path for routes
import { routes } from './routes';

const app = express();
app.use(express.json());
app.use('/api', routes);

export default app;