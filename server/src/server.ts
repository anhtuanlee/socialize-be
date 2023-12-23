/// <reference path="./types/global.d.ts" />

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import { errorHandler } from './middleware/error';
import router from './routes';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router  API
app.use('/api', router);

//middleware error
app.use(errorHandler);

export default app;
