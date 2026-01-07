import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createMonitoringDB } from './libs/db.ts';
import { readSensors } from './libs/modbus.ts';

const PORT = 500;
const app = express();
const server = http.createServer(app);
export const socketServer = new SocketIOServer(server);
app.use(cors());
app.use(express.json());

//app.use('/api/users', userRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
await createMonitoringDB();
setInterval(readSensors, 5000);
