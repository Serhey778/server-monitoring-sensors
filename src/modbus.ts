import ModbusRTU from 'modbus-serial';
import { validatedData } from './validated.ts';

// Функция для опроса датчиков
export async function readSensors(): Promise<Response | void> {
  const tempSensorIP = '192.168.1.10';
  const humidSensorIP = '192.168.1.11';
  const tempSensor = new ModbusRTU();
  const humidSensor = new ModbusRTU();

  try {
    await tempSensor.connectTCP(tempSensorIP, { port: 502 });
    await humidSensor.connectTCP(humidSensorIP, { port: 502 });

    // Читаем 10 регистров с датчика 1
    const tempData = await tempSensor.readHoldingRegisters(0, 10);
    // Читаем 10 регистров с датчика 2
    const humidData = await humidSensor.readHoldingRegisters(0, 10);

    // Валидация, сохранение в БД и отправляем данные клиентам через WebSocket
    await validatedData(tempData.data, humidData.data);
  } catch (error) {
    return Response.json(
      { message: `Error reading data from the sensor: ${error}` },
      { status: 503 }
    );
  } finally {
    tempSensor.close();
    humidSensor.close();
  }
}
