import { MQTT } from './mqtt';
import { Relay } from './relay';
import { Type } from './type';
import Wifi from './wifi';
export interface Device {
    type: Type;
    mac: string;
    hostname: string;
    num_outputs: number;
}
export interface SNTP {
    server: string;
    enabled: boolean;
}
export interface Login {
    enabled: boolean;
    unprotected: boolean;
    username: string;
}
export interface BuildInfo {
    id: string;
    timestamp: string;
    version: string;
}
export declare enum Mode {
    relay = "relay"
}
export declare enum Locale {
    EuropeRome = "Europe/Rome"
}
export interface Timezone {
    timezone: Locale;
    lat: number;
    lng: number;
    tzAutodetect: boolean;
    tzUtcOffset: number;
    tzDst: boolean;
    tzDstAuto: boolean;
}
export interface HWInfo {
    ramTotal: number;
    ramFree: number;
    fsSize: number;
    fsFree: number;
    uptime: number;
}
export interface ExternalSwitch {
    enable: boolean;
    reverse: boolean;
    switchRelays: {
        [k: string]: {
            relayNum: number;
        };
    };
}
export interface Settings extends Timezone, ExternalSwitch {
    device: Device;
    wifiAccessPoint: Wifi;
    wifi: Wifi;
    wifi02: Wifi;
    accessPointRoaming: {
        enabled: boolean;
        threshold: number;
    };
    mqtt: MQTT;
    coiot: {
        enabled: boolean;
        updatePeriod: number;
        peer: string;
    };
    sntp: SNTP;
    login: Login;
    pinCode: string;
    name: string;
    fw: string;
    factoryResetFromSwitch: boolean;
    discoverable: boolean;
    buildInfo: BuildInfo;
    cloud: {
        enabled: boolean;
        connected: boolean;
    };
    time: string;
    unixtime: number;
    debugEnabled: boolean;
    allowCrossOrigin: boolean;
    actions: {
        active: boolean;
        names: string[];
    };
    hwinfo: {
        revision: string;
        batchId: number;
    };
    mode: Mode;
    longpushTime: number;
    relays: Relay[];
    extSensors: {};
    extTemperature: {};
    extHumidity: {};
    ecoModeEnabled: boolean;
}
