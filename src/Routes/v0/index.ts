import { Router } from 'express';
import Paper from './Paper';
import Author from './Author';

const app = Router();

app.use('/paper', Paper);
app.use('/author', Author);

export default app;