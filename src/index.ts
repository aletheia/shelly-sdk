import {Shelly, ShellyConfig, Type} from './device';

(async () => {
  const ip = '192.168.1.154';
  const port = 80;
  const id = '12345678';
  const name = 'Shelly';
  const type = Type.SHELLY_1;
  const config: ShellyConfig = {
    name,
    type,
    id,
    ip,
    port,
  };

  const devices = await Shelly.scanNetwork('192.168.1.0');
  console.log(devices);
})();
