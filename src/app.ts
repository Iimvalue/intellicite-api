import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
// import { connectDB } from './config/database';

dotenv.config();
const port = process.env.PORT || 3000;
// connectDB(); if you need to connect to a database, uncomment this line, ./config/database.ts , ../env
const app: Application = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Welcome to IntelliCite',
    status: 'Server is running successfully',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
    console.info(`Server is running on port ${port}`);
  });
export default app;