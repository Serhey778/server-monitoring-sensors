import express from 'express';
import { getData, getDateByData } from './controller.js';
import { get1HourInDataDB, get6HoursInDataDB, get24HoursInDataDB, } from './database.js';
export const router = express.Router();
router.get('/', (req, res) => res.status(200).json({ message: 'Hello server monitoring-sensors!' }));
// transfer data in an 1 hour
router.get('/1hour', (req, res) => getData(req, res, get1HourInDataDB));
// transfer data in an 6 hourы
router.get('/6hours', (req, res) => getData(req, res, get6HoursInDataDB));
// transfer data in an 24 hours
router.get('/24hours', (req, res) => getData(req, res, get24HoursInDataDB));
// transfer data by date
router.get('/:date', getDateByData);
