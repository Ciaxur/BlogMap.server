import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import { initMongoose } from './Database';

// ENVIRONMENT CONFIGS
dotenv.config();
const {
  MONGO_URI,
  EXPRESS_PORT,
} = process.env;


// INIT & CONFIG EXPRESS
const app = express();
app.use(cors({
  origin: [
    'localhost:3000',
    'localhost:8000',
    'localhost:8080',
    'lvh.me:3000',
    'lvh.me:8000',
    'lvh.me:8080',
  ],
}));
app.use(express.json());
app.use(helmet());
app.use(morgan('tiny'));

// ROUTE USE
import routesV0 from './Routes/v0';
app.use('/api/v0', routesV0);


// EXPRESS & DB START
initMongoose(MONGO_URI, true);
app.listen(EXPRESS_PORT, () => (
  console.log('Listening on Port', EXPRESS_PORT)
));