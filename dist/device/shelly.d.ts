import { Json } from '../util/types';
import { Settings } from './settings';
import { Status } from './status';
import { Type } from './type';
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
export declare class Shelly {
    protected readonly config: Config;
    static scanNetwork(baseIp: string, from?: number, to?: number, port?: number, timeout?: number): Promise<Config[]>;
    static instantiateDevices(configList: Config[]): Promise<Shelly[]>;
    protected _status?: Status;
    protected _settings?: Settings;
    constructor(config: Config);
    init(): Promise<this>;
    getConfig(): Config;
    settings(): Promise<Settings>;
    status(): Promise<Status>;
    switchOff(): Promise<Json>;
    switchOn(): Promise<Json>;
    switch(state: boolean): Promise<Json>;
    update(settings: Partial<Settings>): Promise<Json>;
    toString(): string;
    serialize(): {
        settings: Settings | undefined;
        status: Status | undefined;
        name?: string | undefined;
        type?: Type | undefined;
        id: string;
        ip: string;
        port: number;
    };
}
