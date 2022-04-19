import axios from 'axios';
import {Json} from '../util/types';
import {unmarshallRemoteSettings} from './marshalling/settings';
import {unmarshallStatus} from './marshalling/status';
import {Settings} from './settings';
import {Status} from './status';
import {Type} from './type';
import {nanoid} from 'nanoid';

const SHELLY_DEFAULT_PORT = 80;

export interface Config {
  name?: string;
  type?: Type;
  id: string;
  ip: string;
  port: number;
}

export interface RemoteDeviceParams {
  ip: string;
  port: number;
  path: string;
  command?: string;
  value?: string;
  body?: Json;
  timeout?: number;
}

const sendCommand = async (params: RemoteDeviceParams): Promise<Json> => {
  const {ip, path, port, command, value} = params;
  const timeout = params.timeout || 1000;
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
    return response.data as Json;
  } else {
    throw new Error(`HTTP ${response.status}`);
  }
};

const updateDevice = async (params: Json) => {
  const {ip, port, path, body} = params;
  const response = await axios({
    method: 'POST',
    url: `http://${ip}:${port}/${path}`,
    headers: {
      'Content-Type': 'application/json',
      'x-requested-with': 'XMLHttpRequest',
    },
    data: body,
  });
  if (response.status === 200) {
    return response.data as Json;
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

    const ipParts = baseIp.split('.');
    const ipBase = ipParts.slice(0, 3).join('.');
    const devices: Config[] = [];

    const scanSegment = async (i: number) => {
      const ip = `${ipBase}.${i}`;
      try {
        const deviceInfo = await sendCommand({
          ip,
          port,
          path: 'settings',
          timeout,
        });
        if (deviceInfo.device) {
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
          return undefined;
        }
      } catch (e) {
        return undefined;
      }
    };

    const promises = [...Array(to - from + 1)].map((_, i) => {
      return scanSegment(i + from);
    });

    await Promise.all(promises);
    return devices.filter(r => r !== undefined) as Config[];
  }
  static async instantiateDevices(configList: Config[]): Promise<Shelly[]> {
    const devices = configList.map(config => {
      return new Shelly(config);
    });
    const promises = devices.map(device => {
      return device.init();
    });
    await Promise.all(promises);
    return devices;
  }
  protected readonly config: Config;
  protected _status?: Status;
  protected _settings?: Settings;

  constructor(config: Partial<Config> & {ip: string}) {
    this.config = Object.assign(
      {},
      {port: SHELLY_DEFAULT_PORT, id: nanoid()},
      config
    );
  }
  async init() {
    await this.settings();
    await this.status();
    return this;
  }

  getConfig(): Config {
    return this.config;
  }

  async settings(): Promise<Settings> {
    const res = await sendCommand({
      ip: this.config.ip,
      port: this.config.port,
      path: 'settings',
    });
    this._settings = unmarshallRemoteSettings(res);
    return this._settings;
  }

  async status(): Promise<Status> {
    const res = await sendCommand({
      ip: this.config.ip,
      port: this.config.port,
      path: 'status',
    });
    this._status = unmarshallStatus(res);
    return this._status;
  }
  async switchOff() {
    return this.switch(false);
  }

  async switchOn() {
    return this.switch(true);
  }

  async switch(state: boolean) {
    return sendCommand({
      ip: this.config.ip,
      port: this.config.port,
      path: 'relay/0',
      command: 'turn',
      value: state ? 'on' : 'off',
    });
  }

  async update(settings: Partial<Settings>) {
    return updateDevice({
      ip: this.config.ip,
      port: this.config.port,
      path: 'settings',
      body: settings,
    });
  }

  toString() {
    return `${this.config.name} (${this.config.id})`;
  }

  serialize() {
    return {
      ...this.config,
      settings: this._settings,
      status: this._status,
    };
  }
}
