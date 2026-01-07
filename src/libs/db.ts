import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function createMonitoringDB(): Promise<void> {
  try {
    // Создаем расширение
    sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Удаляем таблицу, если существует
    // sql`DROP TABLE IF EXISTS monitoring`;

    // Создаем таблицу с правильным синтаксисом
    sql`
      CREATE TABLE IF NOT EXISTS monitoring (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        temp INT NOT NULL, 
        humid INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
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
  temp: number,
  humid: number
): Promise<void> {
  try {
    sql`
      INSERT INTO monitoring (temp, humid)
        VALUES (${temp}, ${humid})
        ON CONFLICT (id) DO NOTHING;
    `;
    console.log('Data was written to the database successfully');
  } catch (error) {
    console.error('Error written the database:', error);
  }
}
