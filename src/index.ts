import {Config, Shelly, Type} from './device';

(async () => {
  const ip = '192.168.1.154';
  const port = 80;
  const id = '12345678';
  const name = 'Shelly';
  const type = Type.SHELLY_1;
  const config: Config = {
    name,
    type,
    id,
    ip,
    port,
  };

  const configs = await Shelly.scanNetwork('10.10.10.0', 150, 159);
  console.log(configs);
  const devices = await Shelly.create(configs);
  console.log(devices[0].getSettings());
})();
