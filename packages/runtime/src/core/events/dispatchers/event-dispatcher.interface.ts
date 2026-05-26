// core/events/dispatchers/event-dispatcher.interface.ts

import { RuntimeEvent }
    from '../runtime-event-bus.js';

export interface EventDispatcher {

    dispatch(
        event: RuntimeEvent,
    ): Promise<void>;

}