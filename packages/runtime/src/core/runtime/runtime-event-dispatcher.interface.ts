import { RuntimeEvent } from "../events/runtime-event.js";


export interface RuntimeEventDispatcher {
    dispatch(event: RuntimeEvent): Promise<void>;
}