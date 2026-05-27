import { RuntimeEvent } from "../runtime-event.js";


export interface EventDispatcher {
  dispatch(event: RuntimeEvent): Promise<void>;
}
