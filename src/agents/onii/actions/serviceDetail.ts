import { Action, composePrompt, composePromptFromState, Content, HandlerCallback, IAgentRuntime, logger, Memory, ModelType, State } from "@elizaos/core";

export const serviceDetailAction: Action = {
    name: "SERVICE_DETAIL",
    similes: ["SERVICE_DETAILS", "SERVICE_DESCRIPTION", "SERVICE_INFO"],
    description: "Provides detailed information about a specific service",
    validate: async (runtime: IAgentRuntime, message: Memory, state: State) => {
        return true;
    },
    handler: async(
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ) => {
        try {
            const formattedServices = JSON.parse(runtime.character.settings.AGENT_SERVICES).map(service =>
                `Name: ${service.name}\nPrice: ${service.price} ${service.currency}\nDescription: ${service.description}\n`
            ).join('\n')

            const template = `

# Task: Identify which service a user is requesting from the available options below. 
AVAILABLE SERVICES:
${formattedServices}

Return ONLY the complete service description exactly as listed above (including credits and description). 
Do not add any additional text and explanations.
`;

            const prompt = composePromptFromState({
                state,
                template,
            })

            const response = await runtime.useModel(ModelType.TEXT_SMALL, { 
                prompt,
            })

            const responseContent: Content = {
                text: response,
                source: message.content.source,
                actions: ["SERVICE_DETAIL"]
            }

            await callback(responseContent);

            return responseContent;
        } catch (error) {
            logger.error("Error in SERVICE_DETAIL action:", error);

            const errorResponse: Content = {
                text: "I apologize, but I'm having trouble accessing my services menu right now. Please try again later.",
                actions: ["SERVICE_DETAIL_ERROR"],
                source: message.content.source,
            };

            await callback(errorResponse);
            return errorResponse;
        }
    },
    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "What is the price of the Blessings service?",
                }
            },
            {
                name: "{{agentName}}",
                content: {
                    text: "The Blessings service costs 150 credits. Would you like to proceed with this service or choose another?",
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Can you tell me more about the Blessings service?",
                }
            },
            {
                name: "{{agentName}}",
                content: {
                    text: "The Blessings service is a personalized blessing and good vibes for your projects. It costs 150 credits. Would you like to proceed with this service or choose another?",
                }
            }
        ]
    ]
}