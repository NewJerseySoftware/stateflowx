import { FlowAction } from '../flow-action.type.js';

export class ActionBuilder {

    async buildActions(
        actions: FlowAction[]
    ): Promise<FlowAction[]> {



        for (const action of actions) {

            for (const connector of action.outputConnectors ?? []) {

                const targetExists = actions.some(
                    target => target.id === connector.actionId
                );

                if (!targetExists) {
                    throw new Error(
                        `Action "${action.id}" connects to unknown action "${connector.actionId}".`
                    );
                }
            }
        }

        

        const builtActions = actions.map((action) => {

            const inputConnectors = actions
                .filter((sourceAction) =>
                    sourceAction.outputConnectors?.some(
                        (connector) =>
                            connector.actionId === action.id
                    )
                )
                .map((sourceAction) => ({
                    actionId: sourceAction.id
                }));

            return {
                ...action,
                inputConnectors
            } as FlowAction;
        });

        return builtActions;
    }
}