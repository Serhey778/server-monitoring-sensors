import ModbusRTU from 'modbus-serial';
import dotenv from 'dotenv';
import { validatedData } from './validated.ts';
import { parseValue } from './utils/utils.ts';

dotenv.config();
// Функция для опроса датчиков
export async function readSensors(): Promise<Response | void> {
  const sensor = new ModbusRTU();
  try {
    // подключаемся к датчику
    await sensor.connectTCP(process.env.SENSOR_IP!, {
      port: parseInt(process.env.SENSOR_PORT!),
    });
    // снимаем значение с двух регистров
    const tempValue = await sensor.readInputRegisters(
      parseInt(process.env.TEMP_ADDRESS!),
      1
    );
    const humidValue = await sensor.readInputRegisters(
      parseInt(process.env.HUMID_ADDRESS!),
      1
    );
    // переводим показания датчика температуры в единицу измерения Сельсий
    const temp = parseValue(tempValue.data);
    // переводит показания датчика влажности в проценты
    const humid = parseValue(humidValue.data);
    // Валидация, сохранение в БД и отправляем данные клиенту через WebSocket
    await validatedData(temp, humid);
  } catch (error) {
    return Response.json(
      { message: `Error reading data from the sensor: ${error}` },
      { status: 503 }
    );
  } finally {
    sensor.close();
  }
}
