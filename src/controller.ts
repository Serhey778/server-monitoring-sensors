import type { Request, Response } from 'express';
import type { DataDB } from './type.ts';
import { getDateByDataDB } from './db.ts';

export async function getData(
  req: Request,
  res: Response,
  getDataDB: () => Promise<DataDB[] | void>
): Promise<Response | void> {
  try {
    console.log('start');
    const data = await getDataDB();
    console.log(data);
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
