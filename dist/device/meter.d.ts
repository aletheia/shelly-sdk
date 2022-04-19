import { SwitchStatus } from './switch_status';
export interface Meter {
    power: SwitchStatus;
    isValid: boolean;
}
