import axios from 'axios';
import {unmarshallRemoteSettings} from './marshalling/settings';
import {unmarshallStatus} from './marshalling/status';
import {Settings} from './settings';
import {Status} from './status';
import {Type} from './type';

const SHELLY_DEFAULT_PORT = 80;

export interface Config {
  name?: string;
  type?: Type;
  id: string;
  ip: string;
  port: number;
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

export class Shelly {
  static async scanNetwork(
    baseIp: string,
    from = 0,
    to = 255,
    port = SHELLY_DEFAULT_PORT,
    timeout = 30000
  ): Promise<Config[]> {
    const ipRegex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(baseIp)) {
      throw new Error('Invalid IP address');
    }
    console.log(`Scanning network from ${baseIp}.${from} to ${baseIp}.${to}`);

    const ipParts = baseIp.split('.');
    const ipBase = ipParts.slice(0, 3).join('.');
    const devices: Config[] = [];

    const scanSegment = async (i: number) => {
      const ip = `${ipBase}.${i}`;
      try {
        const deviceInfo = await sendCommand(ip, port, 'settings', timeout);
        if (deviceInfo.device) {
          console.log(`Found ${deviceInfo.device.mac} at ${ip}`);
          const config = {
            name: deviceInfo.name,
            type: deviceInfo.device.type,
            id: deviceInfo.device.hostname,
            ip,
            port,
          };
          devices.push(config);
          return config;
        } else {
          console.log(`No device found at ${ip}`);
          return undefined;
        }
      } catch (e) {
        // console.log(`Failed to scan ${ip}: ${(e as Error).message}`);
        return undefined;
      }
    };

    const promises = [...Array(to - from + 1)].map((_, i) => {
      return scanSegment(i + from);
    });

    await Promise.all(promises);
    return devices.filter(r => r !== undefined) as Config[];
  }
  static async create(configList: Config[]): Promise<Shelly[]> {
    const devices = configList.map(config => {
      return new Shelly(config);
    });
    const promises = devices.map(device => {
      return device.init();
    });
    await Promise.all(promises);
    return devices;
  }
  protected status?: Status;
  protected settings?: Settings;

  constructor(protected readonly config: Config) {
    this.config = config;
  }
  async init() {
    await this.updateSettings();
    return this;
  }

  async updateSettings() {
    console.log(`Updating settings for ${this.config.ip}`);
    const res = await sendCommand(this.config.ip, this.config.port, 'settings');
    this.settings = unmarshallRemoteSettings(res);
  }

  async updateStatus() {
    const res = await sendCommand(this.config.ip, this.config.port, 'status');
    this.status = unmarshallStatus(res);
  }

  getStatus(): Status {
    if (!this.status) {
      throw new Error('Device not initialized');
    }
    return this.status;
  }

  getSettings(): Settings {
    if (!this.settings) {
      throw new Error('Device not initialized');
    }
    return this.settings;
  }
}
