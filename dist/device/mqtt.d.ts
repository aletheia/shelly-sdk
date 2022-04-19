export interface MQTT {
    enable: boolean;
    server: string;
    user: string;
    id: string;
    reconnect_timeout_max: number;
    reconnect_timeout_min: number;
    clean_session: boolean;
    keep_alive: number;
    max_qos: number;
    retain: boolean;
    update_period: number;
}
