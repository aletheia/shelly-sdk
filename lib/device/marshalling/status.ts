import {Json} from '../../util/types';
import {Status} from '../status';
import {marshallRelay, unmarshallRelay} from './relay';

export const unmarshallStatus = (data: Json): Status => {
  return {
    wifi_sta: {
      ssid: data.wifi_sta.ssid,
      rssi: data.wifi_sta.rssi,
      connected: data.wifi_sta.connected,
      ip: data.wifi_sta.ip,
    },
    cloud: {
      enabled: data.cloud.enabled,
      connected: data.cloud.connected,
    },
    mqtt: {
      connected: data.mqtt.connected,
    },
    time: data.time,
    unixtime: data.unixtime,
    serial: data.serial,
    hasUpdate: data.has_update,
    mac: data.mac,
    cfgChangedCounter: data.cfg_changed_cnt,
    actionsStats: {
      skipped: data.actions_stats.skipped,
    },
    relays: data.relays.map((relay: Json) => unmarshallRelay(relay)),
    meters: data.meters.map((meter: Json) => ({
      power: meter.power,
      isValid: meter.is_valid,
    })),
    inputs: data.inputs.map((input: Json) => ({
      input: input.input,
      event: input.event,
      eventCounter: input.event_counter,
    })),
    extSensors: data.ext_sensors,
    extTemperature: data.ext_temperature,
    extHumidity: data.ext_humidity,
    update: {
      status: data.update.status,
      hasUpdate: data.update.has_update,
      newVersion: data.update.new_version,
      oldVersion: data.update.old_version,
    },
    ramTotal: data.ram_total,
    ramFree: data.ram_free,
    fsSize: data.fs_size,
    fsFree: data.fs_free,
    uptime: data.uptime,
  };
};

export const marshallStatus = (status: Status): Json => {
  return {
    wifi_sta: {
      ssid: status.wifi_sta.ssid,
      rssi: status.wifi_sta.rssi,
      connected: status.wifi_sta.connected,
      ip: status.wifi_sta.ip,
    },
    cloud: {
      enabled: status.cloud.enabled,
      connected: status.cloud.connected,
    },
    mqtt: {
      connected: status.mqtt.connected,
    },
    time: status.time,
    unixtime: status.unixtime,
    serial: status.serial,
    has_update: status.hasUpdate,
    mac: status.mac,
    cfg_changed_cnt: status.cfgChangedCounter,
    actions_stats: {
      skipped: status.actionsStats.skipped,
    },
    relays: status.relays.map((relay: Json) => marshallRelay(relay)),
    meters: status.meters.map((meter: Json) => ({
      power: meter.power,
      is_valid: meter.isValid,
    })),
    inputs: status.inputs.map((input: Json) => ({
      input: input.input,
      event: input.event,
      event_counter: input.eventCounter,
    })),
    ext_sensors: status.extSensors,
    ext_temperature: status.extTemperature,
    ext_humidity: status.extHumidity,
    update: {
      status: status.update.status,
      has_update: status.update.hasUpdate,
      new_version: status.update.newVersion,
      old_version: status.update.oldVersion,
    },
    ram_total: status.ramTotal,
    ram_free: status.ramFree,
    fs_size: status.fsSize,
    fs_free: status.fsFree,
    uptime: status.uptime,
  };
};
