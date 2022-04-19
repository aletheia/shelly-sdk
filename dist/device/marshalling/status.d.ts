import { Json } from '../../util/types';
import { Status } from '../status';
export declare const unmarshallStatus: (data: Json) => Status;
export declare const marshallStatus: (status: Status) => Json;
