import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createMonitoringDB, getLastDataDB } from './database.js';
import { readSensors } from './read-sensors.js';
import { router } from './routes.js';

const READING_PERIOD = 5000;
const PORT = 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/', router);

const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*', // Разрешить origin любого клиента
  },
});

//создаем базу данных
await createMonitoringDB();
//читываем значение датчиков через каждые 1 сек и после валидации записываем их в БД
setInterval(readSensors, READING_PERIOD);

// Устанавливаем соединение WebSocket c клиентом
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  const readSensorsInterval = setInterval(async () => {
    //из базы данных берем последнее значение показателей датчиков
    const data = await getLastDataDB();
    if (data) {
      // Отправляем данные клиентам через WebSocket
      socket.emit('sensorsData', {
        tempData: data.temp,
        humidData: data.humid,
      });
    }
  }, READING_PERIOD);

  //Очищаем интервал при отключении клиента
  socket.on('disconnect', () => {
    clearInterval(readSensorsInterval);
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
