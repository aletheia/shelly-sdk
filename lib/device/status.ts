import {Json} from '../util/types';
import {Input} from './Input';
import {Meter} from './meter';
import {Relay} from './relay';
import {HWInfo} from './settings';
import {SwitchStatus} from './switch_status';
import {Update} from './update';
import Wifi from './wifi';

export interface Status extends HWInfo {
  wifi_sta: Wifi;
  cloud: {
    enabled: true;
    connected: true;
  };
  mqtt: {
    connected: false;
  };
  time: string;
  unixtime: number;
  serial: number;
  hasUpdate: boolean;
  mac: string;
  cfgChangedCounter: SwitchStatus;
  actionsStats: {
    skipped: SwitchStatus;
  };
  relays: Relay[];
  meters: Meter[];
  inputs: Input[];
  extSensors: {};
  extTemperature: {};
  extHumidity: {};
  update: Update;
}
