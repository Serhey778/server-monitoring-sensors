import postgres from 'postgres';

import type { DataDB } from './type.ts';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function createMonitoringDB(): Promise<void> {
  try {
    sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Удаляем таблицу, если существует
    // sql`DROP TABLE IF EXISTS monitoring`;

    sql`
      CREATE TABLE IF NOT EXISTS monitoring (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        temp INT[] NOT NULL, 
        humid INT[] NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    // создание функции
    sql`
     CREATE OR REPLACE FUNCTION delete_old_records() RETURNS TRIGGER AS $$
      BEGIN
	    DELETE FROM monitoring WHERE created_at < NOW() - INTERVAL '30 days';
	    RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;

    //Создание триггера
    sql`
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
  temp: number[],
  humid: number[]
): Promise<void> {
  const date = new Date().toISOString();
  try {
    sql`
      INSERT INTO monitoring (temp, humid, created_at)
        VALUES (${temp}, ${humid}, ${date})
        ON CONFLICT (id) DO NOTHING;
    `;
    console.log('Data was written to the database successfully');
  } catch (error) {
    console.error('Error written the database:', error);
  }
}

export async function get1HourInDataDB(): Promise<DataDB[] | void> {
  try {
    const data: DataDB[] = await sql`
    SELECT *
    FROM monitoring
    WHERE created_at >= NOW() - INTERVAL '1 hour';
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch data.');
  }
}
export async function get6HoursInDataDB(): Promise<DataDB[] | void> {
  try {
    const data: DataDB[] = await sql`
    SELECT *
    FROM monitoring
    WHERE created_at >= NOW() - INTERVAL '6 hours';
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch data.');
  }
}

export async function get24HoursInDataDB(): Promise<DataDB[] | void> {
  try {
    const data: DataDB[] = await sql`
    SELECT *
    FROM monitoring
    WHERE created_at >= NOW() - INTERVAL '24 hours';
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch data.');
  }
}

export async function getDateByDataDB(
  dateURL: string
): Promise<DataDB[] | void> {
  try {
    const data: DataDB[] = await sql`
     SELECT *
     FROM monitoring
     WHERE DATE(created_at) = ${dateURL};
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch data.');
  }
}
