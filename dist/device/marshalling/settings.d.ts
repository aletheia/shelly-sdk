import { Json } from '../../util/types';
import { Settings } from '../settings';
export declare const unmarshallRemoteSettings: (settings: Json) => Settings;
export declare const marshallRemoteSettings: (settings: Settings) => Json;
