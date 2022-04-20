import {Shelly} from '../../index';

describe('Scan Network Test', () => {
  test('Scan Network', async () => {
    jest.setTimeout(30000);
    const devices = await Shelly.scanNetwork('192.168.1.0/24');
    expect(devices.length).toBe(254);
  });
});
