import ModbusRTU from 'modbus-serial';
import { validatedData } from './validated.ts';
import { parseValue } from './utils/utils.ts';
import {
  SENSOR_IP,
  SENSOR_PORT,
  TEMP_ADDRESS,
  HUMID_ADDRESS,
} from './utils/const.ts';

// Функция для опроса датчиков
export async function readSensors(): Promise<Response | void> {
  const sensor = new ModbusRTU();

  try {
    // подключаемся к датчику
    await sensor.connectTCP(SENSOR_IP, { port: SENSOR_PORT });

    // снимаем значение с двух регистров
    const tempValue = await sensor.readInputRegisters(TEMP_ADDRESS, 1);
    const humidValue = await sensor.readInputRegisters(HUMID_ADDRESS, 1);

    // переводим показания датчика температуры в единицу измерения Сельсий
    const temp = parseValue(tempValue.data);
    // переводит показания датчика влажности в проценты
    const humid = parseValue(humidValue.data);

    console.log(temp);
    console.log(humid);
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
