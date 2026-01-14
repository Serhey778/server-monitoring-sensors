import postgres from 'postgres';
import dotenv from 'dotenv';
import type { DataDB } from './type.js';

dotenv.config();
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function createMonitoringDB(): Promise<void> {
  try {
    //включаем расширение
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    //создаем новую таблицу в б/д
    await sql`
      CREATE TABLE IF NOT EXISTS monitoring (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        temp REAL NOT NULL, 
        humid REAL NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    // функция которая удаляет строки в таблице б/д, которые созданы более 30 дней назад
    await sql`
     CREATE OR REPLACE FUNCTION delete_old_records() RETURNS TRIGGER AS $$
      BEGIN
	    DELETE FROM monitoring WHERE created_at < NOW() - INTERVAL '30 days';
	    RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;

    //триггера, который при каждой записи в б/д, вызывает вышеуказанную функцию для каждой строки таблицы
    await sql`
     CREATE TRIGGER delete_old_records_trigger
      BEFORE INSERT ON monitoring
      FOR EACH ROW EXECUTE FUNCTION delete_old_records();
    `;
    console.log('The database was created successfully');
  } catch (error) {
    console.error('Error creating the database:', error);
  }
}

export async function writtenMonitoringDB(
  temp: number,
  humid: number
): Promise<void> {
  const date = new Date();
  try {
    await sql`
      INSERT INTO monitoring (temp, humid, created_at)
      VALUES (${temp}, ${humid}, ${date})
      ON CONFLICT (id) DO NOTHING
    `;
  } catch (error) {
    console.error('Error written the database:', error);
  }
}

export async function getLastDataDB(): Promise<DataDB | undefined> {
  try {
    const data = await sql<DataDB[]>`
    SELECT * 
    FROM monitoring
    ORDER BY created_at DESC
    LIMIT 1;
    `;
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch data.');
  }
}

export async function get1HourInDataDB(): Promise<DataDB[] | undefined> {
  try {
    const data = await sql<DataDB[]>`
    SELECT * 
    FROM monitoring
    WHERE created_at >= NOW() - INTERVAL '1 hour'
    ORDER BY created_at DESC;
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch data.');
  }
}
export async function get6HoursInDataDB(): Promise<DataDB[] | undefined> {
  try {
    const data = await sql<DataDB[]>`
    SELECT *
    FROM monitoring
    WHERE created_at >= NOW() - INTERVAL '6 hours'
    ORDER BY created_at DESC;
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch data.');
  }
}

export async function get24HoursInDataDB(): Promise<DataDB[] | undefined> {
  try {
    const data = await sql<DataDB[]>`
    SELECT *
    FROM monitoring
    WHERE created_at >= NOW() - INTERVAL '24 hours'
    ORDER BY created_at DESC;
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch data.');
  }
}

export async function getDateByDataDB(
  segmentURL: string
): Promise<DataDB[] | undefined> {
  try {
    const data = await sql<DataDB[]>`
     SELECT *
     FROM monitoring
     WHERE DATE(created_at) = ${segmentURL}
     ORDER BY created_at DESC;
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch data.');
  }
}
