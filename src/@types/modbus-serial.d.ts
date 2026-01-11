declare module 'modbus-serial' {
  class ModbusRTU {
    constructor();
    connectTCP(ip: string, options?: { port?: number }): Promise<void>;
    readInputRegisters(
      address: number,
      quantity: number
    ): Promise<{ data: number[] }>;
    close(): Promise<void>;
  }
  export default ModbusRTU;
}
