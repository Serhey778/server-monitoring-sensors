import { z } from 'zod';
import { writtenMonitoringDB } from './database.ts';
import { io } from './index.ts';

const DataDBSchema = z.object({
  id: z.string(), // id должен быть строкой
  temp: z.number(), // temp должен быть массивом чисел
  humid: z.number(), // humid должен быть массивом чисел
  created_at: z.string(), // created_at должен быть строкой
});

const schema = DataDBSchema.omit({ id: true, created_at: true });

export async function validatedData(temp: number, humid: number) {
  const validated = schema.safeParse({
    temp,
    humid,
  });

  if (!validated.success) {
    return {
      message: 'Data was not validated',
    };
  }
  try {
    // запись в базу данных если валидация прошла успешна
    await writtenMonitoringDB(temp, humid);
  } catch (error) {
    console.error('Error written monitoring in bd:', error);
  }
}
