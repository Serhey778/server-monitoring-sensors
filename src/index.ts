import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createMonitoringDB } from './db.ts';
import { readSensors } from './modbus.ts';
import { router } from './routes.ts';

const PORT = 500;
const app = express();
const server = http.createServer(app);
export const io = new SocketIOServer(server);
app.use(cors());
app.use(express.json());

app.use('/api/', router);

await createMonitoringDB();
setInterval(readSensors, 5000);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
