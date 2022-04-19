export default interface Wifi {
  ssid?: string;
  enabled?: boolean;
  rssi?: number;
  connected?: boolean;
  ip?: string;
  port?: number;
  gw?: string;
  mask?: string;
  dns?: string;
  ipv4Method?: string;
  key?: string;
}
