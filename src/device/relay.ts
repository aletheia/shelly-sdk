import {SwitchStatus} from './switch_status';
import {Source} from './source';

export enum ApplianceType {
  General = 'General',
}

export interface RemoteRelay {
  ison?: boolean;
  hasTimer?: boolean;
  timer_started?: number;
  timer_duration?: number;
  timer_remaining?: number;
  source?: string;
  name?: string;
  appliance_type?: string;
  has_timer?: boolean;
  default_state?: string;
  btn_type?: string;
  btn_reverse?: number;
  auto_on?: number;
  auto_off?: number;
  power?: number;
  schedule?: boolean;
  schedule_rules?: string[];
}

export interface Relay {
  ison?: boolean;
  hasTimer?: boolean;
  timerStarted?: SwitchStatus;
  timerDuration?: SwitchStatus;
  timerRemaining?: SwitchStatus;
  source?: Source;
  name?: string;
  applianceType?: ApplianceType;
  defaultState?: string;
  btnType?: string;
  btnReverse?: number;
  autoOn?: number;
  autoOff?: number;
  power?: number;
  schedule?: boolean;
  scheduleRules?: string[];
}
