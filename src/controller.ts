import type { Request, Response } from 'express';
import type { DataDB } from './type.js';
import { getDateByDataDB } from './database.js';

export async function getData(
  req: Request,
  res: Response,
  getDataDB: () => Promise<DataDB[] | void>
): Promise<Response | void> {
  try {
    const data = await getDataDB();
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
    const segmentURL = req.params.date;
    const data = await getDateByDataDB(segmentURL);
    if (!data || data.length === 0)
      return res.status(404).json({ message: 'Data not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}
