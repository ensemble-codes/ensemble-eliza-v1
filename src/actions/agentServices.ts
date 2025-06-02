import {
  Action,
  Content,
  HandlerCallback,
  IAgentRuntime,
  logger,
  Memory,
  State,
} from "@elizaos/core";

interface Service {
  id: string;
  name: string;
  price: number;
  currency: string;
  description?: string;
}

interface AgentServicesResponse {
  type: "agent_services";
  from: string;
  to: string;
  content: {
    data: {
      services: Service[];
      agent_name?: string;
      message?: string;
    };
  };
}

export const agentServicesAction: Action = {
  name: "AGENT_SERVICES",
  similes: [
    "LIST_SERVICES",
    "SHOW_SERVICES",
    "WHAT_SERVICES",
    "SERVICES_MENU",
    "AVAILABLE_SERVICES",
    "WHAT_CAN_YOU_DO",
    "SERVICE_OFFERINGS",
  ],
  description:
    "Presents available services that the agent can provide, including pricing and descriptions",

  validate: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
  ): Promise<boolean> => {
    // Check if the message is asking about services
    const text = message.content.text?.toLowerCase() || "";
    const serviceKeywords = [
      "services",
      "service",
      "help",
      "provide",
      "offer",
      "do",
      "capabilities",
      "menu",
    ];

    const hasServiceKeyword = serviceKeywords.some((keyword) =>
      text.includes(keyword)
    );

    // Look for question patterns
    const questionPatterns = [
      "what",
      "how",
      "can you",
      "do you",
      "are you able",
      "list",
      "show",
    ];

    const hasQuestionPattern = questionPatterns.some((pattern) =>
      text.includes(pattern)
    );

    return hasServiceKeyword && hasQuestionPattern;
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: any,
    callback: HandlerCallback,
    _responses: Memory[]
  ) => {
    try {
      const room = state.data.room ?? (await runtime.getRoom(message.roomId));
      if (!room) {
        throw new Error("No room found");
      }

      // Get agent character information
      const agentName = runtime.character?.name || "Agent";
      const agentId = `${agentName.toLowerCase()}.ensemble`;

      // Get services from agent settings or use defaults
      const defaultServices: Service[] = [
        {
          id: "consultation_service",
          name: "Expert Consultation",
          price: 200,
          currency: "credits",
          description: "Personalized advice and guidance in my area of expertise",
        },
        {
          id: "analysis_service",
          name: "Data Analysis",
          price: 150,
          currency: "credits",
          description: "Comprehensive analysis of your data or situation",
        },
        {
          id: "content_creation",
          name: "Content Creation",
          price: 100,
          currency: "credits",
          description: "Custom content tailored to your needs",
        },
      ];

      // Try to get services from agent settings or knowledge
      let services = defaultServices;
      
      // Check if agent has custom services defined
      if (runtime.character?.settings?.AGENT_SERVICES) {
        try {
          services = JSON.parse(runtime.character.settings.AGENT_SERVICES);
        } catch (error) {
          logger.warn("Failed to parse custom agent services, using defaults");
        }
      }

      // Create structured response data
      const agentServicesResponse: AgentServicesResponse = {
        type: "agent_services",
        from: agentId,
        to: `user_${message.entityId?.toString().substring(0, 8) || "unknown"}`,
        content: {
          data: {
            services,
            agent_name: agentName,
            message: "Here are the services I can provide:",
          },
        },
      };

      // Create human-readable text
      let responseText = `🔧 **${agentName} Services Menu**\n\n`;
      responseText += "Here are the services I can provide:\n\n";

      services.forEach((service, index) => {
        responseText += `${index + 1}. **${service.name}**\n`;
        responseText += `   💰 Price: ${service.price} ${service.currency}\n`;
        if (service.description) {
          responseText += `   📋 ${service.description}\n`;
        }
        responseText += "\n";
      });

      responseText += "Would you like to learn more about any of these services or proceed with a selection?";

      const responseContent: Content = {
        text: responseText,
        actions: ["AGENT_SERVICES"],
        source: message.content.source,
        // Include the structured data for other systems to consume
        data: agentServicesResponse,
      };

      await callback(responseContent);

      logger.info(
        `Agent services presented by ${agentName}:`,
        services.map((s) => s.name)
      );

      return responseContent;
    } catch (error) {
      logger.error("Error in AGENT_SERVICES action:", error);
      
      const errorResponse: Content = {
        text: "I apologize, but I'm having trouble accessing my services menu right now. Please try again later.",
        actions: ["AGENT_SERVICES_ERROR"],
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
        },
      },
      {
        name: "{{agentName}}",
        content: {
          text: "🔧 **{{agentName}} Services Menu**\n\nHere are the services I can provide:\n\n1. **Expert Consultation**\n   💰 Price: 200 credits\n   📋 Personalized advice and guidance in my area of expertise\n\n2. **Data Analysis**\n   💰 Price: 150 credits\n   📋 Comprehensive analysis of your data or situation\n\n3. **Content Creation**\n   💰 Price: 100 credits\n   📋 Custom content tailored to your needs\n\nWould you like to learn more about any of these services or proceed with a selection?",
          actions: ["AGENT_SERVICES"],
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
          actions: ["AGENT_SERVICES"],
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
          actions: ["AGENT_SERVICES"],
        },
      },
    ],
  ],
};
