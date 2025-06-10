import { Action, composePromptFromState, Content, HandlerCallback, IAgentRuntime, logger, Memory, ModelType, State } from "@elizaos/core";

interface ServiceParameter {
    name: string;
    required: boolean;
    description: string;
}

interface ServiceWithParameters {
    id: string;
    name: string;
    price: number;
    currency: string;
    description?: string;
    parameters: ServiceParameter[];
}

interface ServiceDetailsResponse {
    type: "service_details";
    from: string;
    to: string;
    data: {
        service: ServiceWithParameters;
    };
}

export const serviceDetailsAction: Action = {
    name: "SERVICE_DETAILS",
    similes: ["SERVICE_DETAILS", "SERVICE_DESCRIPTION", "SERVICE_INFO"],
    description: "Provides detailed information about a specific service including parameters",
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
            // Parse available services
            const services: ServiceWithParameters[] = JSON.parse(runtime.character.settings.AGENT_SERVICES);
            
            // Create service list for LLM prompt
            const servicesList = services.map(service => 
                `- ${service.name} (ID: ${service.id}): ${service.description}`
            ).join('\n');

            const template = `
# Task: Identify which service the user is requesting from the available options below.

AVAILABLE SERVICES:
${servicesList}

USER MESSAGE: ${message.content.text}

Return ONLY the service ID (like "bull_post_service", "thread_creation", etc.) that best matches the user's request. 
If the request is ambiguous or you cannot determine which service they want, return "UNCLEAR".
Do not add any additional text or explanations.
`;

            const prompt = composePromptFromState({
                state,
                template,
            });

            const serviceIdResponse = await runtime.useModel(ModelType.TEXT_SMALL, { 
                prompt,
            });

            const serviceId = serviceIdResponse.trim();

            // Handle unclear requests
            if (serviceId === "UNCLEAR") {
                const responseContent: Content = {
                    text: `I'm not sure which service you're asking about. I offer these services:\n\n${services.map((s, i) => `${i + 1}. **${s.name}** - ${s.description}`).join('\n')}\n\nCould you please specify which one you'd like to know more about?`,
                    source: message.content.source,
                    actions: ["SERVICE_DETAILS"]
                };
                await callback(responseContent);
                return responseContent;
            }

            // Find the requested service
            const requestedService = services.find(service => service.id === serviceId);

            if (!requestedService) {
                const responseContent: Content = {
                    text: `I couldn't find a service with that name. Available services are:\n\n${services.map((s, i) => `${i + 1}. **${s.name}** - ${s.description}`).join('\n')}\n\nWhich one would you like to know more about?`,
                    source: message.content.source,
                    actions: ["SERVICE_DETAILS"]
                };
                await callback(responseContent);
                return responseContent;
            }

            // Generate agent and user identifiers
            const agentName = runtime.character?.name || "Agent";
            const agentId = `${agentName.toLowerCase()}.ensemble`;
            const userId = `user_${message.entityId?.toString().substring(0, 8) || "unknown"}`;

            // Create structured response
            const serviceDetailsResponse: ServiceDetailsResponse = {
                type: "service_details",
                from: agentId,
                to: userId,
                data: {
                    service: requestedService
                }
            };

            const responseContent: Content = {
                text: JSON.stringify(serviceDetailsResponse, null, 2),
                source: message.content.source,
                actions: ["SERVICE_DETAILS"],
                data: serviceDetailsResponse
            };

            await callback(responseContent);
            return responseContent;

        } catch (error) {
            logger.error("Error in SERVICE_DETAILS action:", error);

            const errorResponse: Content = {
                text: "I apologize, but I'm having trouble accessing my services information right now. Please try again later.",
                actions: ["SERVICE_DETAILS_ERROR"],
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
                    text: "Tell me about the Bull Post service",
                }
            },
            {
                name: "{{agentName}}",
                content: {
                    text: JSON.stringify({
                        type: "service_details",
                        from: "onii.ensemble",
                        to: "user_12345678",
                        data: {
                            service: {
                                id: "bull_post_service",
                                name: "Bull Post",
                                price: 1,
                                currency: "usdc",
                                description: "Confident, bullish content creation for your crypto portfolio",
                                parameters: [
                                    {
                                        name: "project_name",
                                        required: true,
                                        description: "What's your project called?"
                                    },
                                    {
                                        name: "key_features", 
                                        required: true,
                                        description: "What are the main features to highlight?"
                                    },
                                    {
                                        name: "target_audience",
                                        required: false,
                                        description: "Who is your target audience?"
                                    }
                                ]
                            }
                        }
                    }, null, 2)
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "What about Twitter threads?",
                }
            },
            {
                name: "{{agentName}}",
                content: {
                    text: JSON.stringify({
                        type: "service_details",
                        from: "onii.ensemble",
                        to: "user_12345678",
                        data: {
                            service: {
                                id: "thread_creation",
                                name: "Twitter Thread",
                                price: 5,
                                currency: "usdc",
                                description: "Engaging Twitter threads about crypto, gaming, or tech trends",
                                parameters: [
                                    {
                                        name: "topic",
                                        required: true,
                                        description: "What topic should the thread cover?"
                                    },
                                    {
                                        name: "thread_length",
                                        required: false,
                                        description: "How many tweets in the thread? (default: 5-7)"
                                    },
                                    {
                                        name: "tone",
                                        required: false,
                                        description: "What tone should the thread have? (bullish, informative, casual)"
                                    }
                                ]
                            }
                        }
                    }, null, 2)
                }
            }
        ]
    ]
}