export interface Json {
    [key: string]: string | number | boolean | Json | Json[] | Date | number[] | boolean[] | string[] | any;
}
