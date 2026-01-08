import express from 'express';
import {
  get1HourInData,
  get6HoursInData,
  get24HoursInData,
  getDateByData,
} from './controller.ts';

export const router = express.Router();

// transfer data in an 1 hour
router.get('/1hour', get1HourInData);

// transfer data in an 6 hourы
router.get('/6hours', get6HoursInData);

// transfer data in an 24 hours
router.get('/24hours', get24HoursInData);

// transfer data by date
router.get('/:date', getDateByData);
