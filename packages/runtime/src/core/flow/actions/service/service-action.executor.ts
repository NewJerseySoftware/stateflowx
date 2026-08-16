import { RuntimeContext } from "../../../runtime/runtime-context.interface.js";
import { ServiceAction } from "../service-action.interface.js";


export class ServiceActionExecutor {

    constructor(
        private readonly runtime: RuntimeContext
    ) { }

    async execute(
        action: ServiceAction
    ): Promise<unknown> {

        const service =
            this.runtime.services.get(action.service);

        if (!service) {
            throw new Error(
                `Service not found: ${action.service}`
            );
        }

        return service.execute();
    }
}