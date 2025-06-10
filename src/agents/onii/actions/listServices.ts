import { Action, composePromptFromState, Content, HandlerCallback, IAgentRuntime, logger, Memory, ModelType, State } from "@elizaos/core";

const servicesTemplate = `
{
  "type": "agent_services",
  "from": "0x234",
  "to": "0x123",
  "data": {
    "services": [
      {
        "id": "blessing_service",
        "name": "Blessings",
        "price": 150,
        "currency": "usdc"
      },
      {
        "id": "bull_post_service",
        "name": "Bull Post",
        "price": 350,
        "currency": "usdc"
      },
      {
        "id": "thread_creation",
        "name": "Twitter Thread",
        "price": 250,
        "currency": "usdc"
      }
    ]
  }
}
  `
export const listServicesAction: Action = {
    name: "LIST_SERVICES",
    similes: ["LIST_SERVICES", "SHOW_SERVICES", "GET_SERVICES"],
    description: "Lists available services for the user",
    validate: async (runtime: IAgentRuntime, message: Memory, state: State) => {
        return true;
    },
    handler: async (
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
AVAILABLE SERVICES:
${formattedServices}

# Task: Can you return a json object of the available services using. 

Return ONLY the json object of the available services in the following format:
{
  "type": "agent_services",
  "from": "0x234",
  "to": "0x123",
  "data": {
    "services": [
      {
        "id": "blessing_service",
        "name": "Blessings",
        "price": 150,
        "currency": "usdc"
      },
      {
        "id": "bull_post_service",
        "name": "Bull Post",
        "price": 350,
        "currency": "usdc"
      },
      {
        "id": "thread_creation",
        "name": "Twitter Thread",
        "price": 250,
        "currency": "usdc"
      }
    ]
  }
}
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
                actions: ["LIST_SERVICES"],
            }

            await callback(responseContent);

            return responseContent;
        } catch (error) {
            logger.error("Error in LIST_SERVICES action:", error);

            const errorResponse: Content = {
                text: "I apologize, but I'm having trouble accessing my services menu right now. Please try again later.",
                actions: ["LIST_SERVICES_ERROR"],
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
                    text: "What services can you provide?",
                }
            },
            {
                name: "{{agentName}}",
                content: {
                    text: "",
                    actions: ["LIST_SERVICES"],
                },
            },
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Can you help me? What do you offer?",
                },
            },
            {
                name: "{{agentName}}",
                content: {
                    text: servicesTemplate,
                    actions: ["LIST_SERVICES"],
                },
            },
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Show me your services menu",
                },
            },
            {
                name: "{{agentName}}",
                content: {
                    text: servicesTemplate,
                    actions: ["LIST_SERVICES"],
                },
            },
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "ls",
                },
            },
            {
                name: "{{agentName}}",
                content: {
                    text: servicesTemplate,
                    actions: ["LIST_SERVICES"],
                },
            },
        ],
    ]
} 