import {RemoteRelay, Relay, ApplianceType} from '../relay';
import {Source} from '../source';

export function unmarshallRelay(relay: RemoteRelay): Relay {
  return {
    ison: relay.ison,
    hasTimer: relay.has_timer,
    timerStarted: relay.timer_started,
    timerDuration: relay.timer_duration,
    timerRemaining: relay.timer_remaining,
    source: relay.source
      ? Source[relay.source as keyof typeof Source]
      : undefined,
    name: relay.name,
    applianceType: relay.appliance_type as ApplianceType,
    defaultState: relay.default_state,
    btnType: relay.btn_type,
    btnReverse: relay.btn_reverse,
    autoOn: relay.auto_on,
    autoOff: relay.auto_off,
    power: relay.power,
    schedule: relay.schedule,
    scheduleRules: relay.schedule_rules,
  };
}

export function marshallRelay(relay: Relay): RemoteRelay {
  return {
    ison: relay.ison,
    has_timer: relay.hasTimer ? relay.hasTimer : undefined,
    timer_started: relay.timerStarted,
    timer_duration: relay.timerDuration,
    timer_remaining: relay.timerRemaining,
    source: relay.source,
    name: relay.name,
    appliance_type: relay.applianceType,
    default_state: relay.defaultState,
    btn_type: relay.btnType,
    btn_reverse: relay.btnReverse,
    auto_on: relay.autoOn,
    auto_off: relay.autoOff,
    power: relay.power,
    schedule: relay.schedule,
    schedule_rules: relay.scheduleRules,
  };
}
