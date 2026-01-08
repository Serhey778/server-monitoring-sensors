import { z } from 'zod';
import { writtenMonitoringDB } from './db.ts';
import { io } from './index.ts';

const DataDBSchema = z.object({
  id: z.string(), // id должен быть строкой
  temp: z.array(z.number()), // temp должен быть массивом чисел
  humid: z.array(z.number()), // humid должен быть массивом чисел
  created_at: z.string(), // created_at должен быть строкой
});

const schema = DataDBSchema.omit({ id: true, created_at: true });

export async function validatedData(temp: number[], humid: number[]) {
  const validated = schema.safeParse({
    temp,
    humid,
  });

  if (!validated.success) {
    return {
      message: 'Data was not validated',
    };
  }
  await writtenMonitoringDB(temp, humid);

  // Отправляем данные клиентам через WebSocket
  io.emit('sensorsData', {
    tempData: temp,
    humidData: humid,
  });
}
