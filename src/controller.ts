import type { Request, Response } from 'express';
import {
  get1HourInDataDB,
  get6HoursInDataDB,
  get24HoursInDataDB,
  getDateByDataDB,
} from './db.ts';

// Регистрация пользователя
export async function get1HourInData(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const data = await get1HourInDataDB();
    if (!data || data.length === 0)
      return res.status(404).json({ message: 'Data not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}

export async function get6HoursInData(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const data = await get6HoursInDataDB();
    if (!data || data.length === 0)
      return res.status(404).json({ message: 'Data not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}

export async function get24HoursInData(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const data = await get24HoursInDataDB();
    if (!data || data.length === 0)
      return res.status(404).json({ message: 'Data not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}

export async function getDateByData(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const dateURL = req.params.date;
    const data = await getDateByDataDB(dateURL);
    if (!data || data.length === 0)
      return res.status(404).json({ message: 'Data not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}
