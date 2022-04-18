import axios from 'axios';
import {unmarshallStatus} from './marshalling/status';
import {Status} from './status';
import {Type} from './type';

const SHELLY_DEFAULT_PORT = 80;

export interface ShellyConfig {
  name?: string;
  type?: Type;
  id: string;
  ip: string;
  port?: number;
}
//192.168.1.154/settings/relay/0?default_state=off

const sendCommand = async (
  ip: string,
  port: number,
  path: string,
  timeout = 0,
  command?: string,
  value?: string
): Promise<any> => {
  let url = `http://${ip}:${port}/${path}`;
  if (command) {
    url += `?${command}=${value}`;
  }
  const response = await axios({
    method: 'GET',
    url,
    headers: {
      'Content-Type': 'application/json',
      'x-requested-with': 'XMLHttpRequest',
    },
    timeout,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error(`HTTP ${response.status}`);
  }
};

const getDeviceStatus = async (ip: string, port: number) => {
  return sendCommand(ip, port, 'status');
};

const scanNetwork = async (
  baseIp: string,
  port = SHELLY_DEFAULT_PORT,
  timeout = 30000
) => {
  const ipRegex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (!ipRegex.test(baseIp)) {
    throw new Error('Invalid IP address');
  }
  const ipParts = baseIp.split('.');
  const ipBase = ipParts.slice(0, 3).join('.');

  const promises = [...Array(255).keys()].map(
    async (i: number): Promise<Shelly | undefined> => {
      const ip = `${ipBase}.${i}`;
      try {
        const status = await sendCommand(ip, port, 'status', timeout);
        if (status.mac) {
          console.log(`Found ${status.mac} at ${ip}`);
          return new Shelly({
            name: status.mac,
            type: Type.SHELLY_1,
            id: status.mac,
            ip,
            port: 80,
          });
        } else {
          return undefined;
        }
      } catch (e) {
        return undefined;
      }
    }
  );
  const results = await Promise.all(promises);
  return results.filter(r => r !== undefined);
};

export class Shelly {
  static async scanNetwork(baseIp: string) {
    return await scanNetwork(baseIp);
  }
  protected status?: Status;

  constructor(protected readonly config: ShellyConfig) {
    this.config = config;
  }
  async init() {
    await this.update();
  }

  async update() {
    const res = await getDeviceStatus(
      this.config.ip,
      this.config.port || SHELLY_DEFAULT_PORT
    );
    this.status = unmarshallStatus(res.data);
  }
  getStatus(): Status {
    if (!this.status) {
      throw new Error('Device not initialized');
    }
    return this.status;
  }
}
