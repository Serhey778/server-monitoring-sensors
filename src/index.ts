import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createMonitoringDB } from './db.ts';
import { readSensors } from './read-sensors.ts';
import { router } from './routes.ts';

const READING_PERIOD = 5000;
const PORT = 5000;
const app = express();
const server = http.createServer(app);
export const io = new SocketIOServer(server);
app.use(cors());
app.use(express.json());
await createMonitoringDB();
setInterval(readSensors, READING_PERIOD);
app.use('/api/', router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
