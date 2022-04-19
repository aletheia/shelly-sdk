export interface Json {
  [key: string]:
    | string
    | number
    | boolean
    | Json
    | Json[]
    | Date
    | number[]
    | boolean[]
    | string[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | any;
}
