import { Action, composePromptFromState, Content, HandlerCallback, IAgentRuntime, logger, Memory, ModelType, State } from "@elizaos/core";

export const serviceOfferAction: Action = {
    name: "SERVICE_OFFER",
    similes: ["OFFER_SERVICE", "PROVIDE_SERVICE", "SERVICE_PROVIDED"],
    description: "Offers a service to the user",
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
  "content": {
    "data": {
      "services": [
        {
          "id": "blessing_service",
          "name": "Blessings",
          "price": 150,
          "currency": "credits"
        },
        {
          "id": "bull_post_service",
          "name": "Bull Post",
          "price": 350,
          "currency": "credits"
        },
        {
          "id": "thread_creation",
          "name": "Twitter Thread",
          "price": 250,
          "currency": "credits"
        }
      ]
    }
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
                actions: ["SERVICE_OFFER"],
            }

            await callback(responseContent);

            return responseContent;
        } catch (error) {
            logger.error("Error in SERVICE_OFFER action:", error);

            const errorResponse: Content = {
                text: "I apologize, but I'm having trouble accessing my services menu right now. Please try again later.",
                actions: ["SERVICE_OFFER_ERROR"],
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
                    text: "🔧 **{{agentName}} Services Menu**\n\nHere are the services I can provide:\n\n1. **Expert Consultation**\n   💰 Price: 200 credits\n   📋 Personalized advice and guidance in my area of expertise\n\n2. **Data Analysis**\n   💰 Price: 150 credits\n   📋 Comprehensive analysis of your data or situation\n\n3. **Content Creation**\n   💰 Price: 100 credits\n   📋 Custom content tailored to your needs\n\nWould you like to learn more about any of these services or proceed with a selection?",
                    actions: ["SERVICE_OFFER"],
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
                    text: "🔧 **{{agentName}} Services Menu**\n\nHere are the services I can provide:\n\n1. **Expert Consultation**\n   💰 Price: 200 credits\n   📋 Personalized advice and guidance in my area of expertise\n\n2. **Data Analysis**\n   💰 Price: 150 credits\n   📋 Comprehensive analysis of your data or situation\n\n3. **Content Creation**\n   💰 Price: 100 credits\n   📋 Custom content tailored to your needs\n\nWould you like to learn more about any of these services or proceed with a selection?",
                    actions: ["SERVICE_OFFER"],
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
                    text: "🔧 **{{agentName}} Services Menu**\n\nHere are the services I can provide:\n\n1. **Expert Consultation**\n   💰 Price: 200 credits\n   📋 Personalized advice and guidance in my area of expertise\n\n2. **Data Analysis**\n   💰 Price: 150 credits\n   📋 Comprehensive analysis of your data or situation\n\n3. **Content Creation**\n   💰 Price: 100 credits\n   📋 Custom content tailored to your needs\n\nWould you like to learn more about any of these services or proceed with a selection?",
                    actions: ["SERVICE_OFFER"],
                },
            },
        ],
    ]
}
