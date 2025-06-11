import {
  Action,
  Content,
  HandlerCallback,
  IAgentRuntime,
  logger,
  Memory,
  State,
} from "@elizaos/core";

interface CreateTaskRequest {
  task: {
    service_id: string;
    task_id: string;
    price: number;
    parameters: Record<string, any>;
  };
}

interface CreateTaskResponse {
  type: "create_task";
  from: string;
  to: string;
  content: {
    data: {
      task_id: string;
      service_id: string;
      parameters: Record<string, any>;
      price: number;
      notes: string;
    };
  };
}

export const createTaskAction: Action = {
  name: "CREATE_TASK",
  similes: [
    "CREATE_TASK",
    "MAKE_TASK",
    "DO_TASK",
    "EXECUTE_TASK",
    "RUN_TASK",
    "PERFORM_TASK",
  ],
  description:
    "Creates and executes a task based on the provided task object",

  validate: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
  ): Promise<boolean> => {
    // Simple validation - check if message contains task-related content
    const text = message.content.text?.toLowerCase() || "";
    const taskKeywords = [
      "create task",
      "make task",
      "do task",
      "execute",
      "perform",
      "run task",
      "task",
    ];

    return taskKeywords.some((keyword) => text.includes(keyword));
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

      // Get wallet address from runtime or use default
      const walletAddress = runtime.getSetting("WALLET_ADDRESS") || "0x515e4af972D84920a9e774881003b2bD797c4d4b";
      
      // Try to parse task from message content
      let taskData: CreateTaskRequest;
      try {
        // Look for JSON in the message
        const jsonMatch = message.content.text?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          taskData = JSON.parse(jsonMatch[0]);
          console.log({ taskData });
        } else {
          throw new Error("No JSON task data found in message");
        }
      } catch (parseError) {
        throw new Error("Failed to parse task data from message");
      }

      // Use service info from the task object
      const serviceId = taskData.task.service_id;
      const price = taskData.task.price;
      const taskId = taskData.task.task_id;

      // Create response
      const createTaskResponse: CreateTaskResponse = {
        type: "create_task",
        from: walletAddress,
        to: "onii.ensemble",
        content: {
          data: {
            task_id: taskId,
            service_id: serviceId,
            parameters: taskData.task.parameters,
            price: price,
            notes: `Task with service ${serviceId}`,
          },
        },
      };

      // Create human-readable response
      let responseText = `✅ **Task Created Successfully**\n\n`;
      responseText += `🔧 **Service**: ${serviceId}\n`;
      responseText += `🆔 **Task ID**: ${taskId}\n`;
      responseText += `💰 **Price**: ${price} USDC\n`;
      responseText += `👤 **Agent**: Onii\n\n`;
      
      if (Object.keys(taskData.task.parameters).length > 0) {
        responseText += `⚙️ **Parameters**:\n`;
        Object.entries(taskData.task.parameters).forEach(([key, value]) => {
          responseText += `   • ${key}: ${value}\n`;
        });
        responseText += `\n`;
      }

      responseText += `🚀 Task is now being processed...`;

      const responseContent: Content = {
        text: responseText,
        actions: ["CREATE_TASK"],
        source: message.content.source,
        // Include structured data for API consumption
        data: createTaskResponse,
      };

      await callback(responseContent);

      logger.info(
        `Task created by Onii:`,
        {
          taskId,
          serviceId: serviceId,
          price: price,
          parameters: taskData.task.parameters,
        }
      );

      return responseContent;
    } catch (error) {
      logger.error("Error in CREATE_TASK action:", error);
      
      const errorResponse: Content = {
        text: "I apologize, but I'm having trouble creating your task right now. Please try again later.",
        actions: ["CREATE_TASK_ERROR"],
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
          text: 'Create task: {"task": {"service_id": "bull_post_service", "task_id": "task_001", "price": 1, "parameters": {"project_name": "SuperDeFi", "key_features": "yield farming, NFT staking", "target_audience": "DeFi enthusiasts"}}}',
        },
      },
      {
        name: "{{agentName}}",
        content: {
          text: `✅ **Task Created Successfully**

🔧 **Service**: bull_post_service
🆔 **Task ID**: task_001
💰 **Price**: 1 USDC
👤 **Agent**: Onii

⚙️ **Parameters**:
   • project_name: SuperDeFi
   • key_features: yield farming, NFT staking
   • target_audience: DeFi enthusiasts

🚀 Task is now being processed...`,
          actions: ["CREATE_TASK"],
        },
      },
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: 'Create task: {"task": {"service_id": "thread_creation", "task_id": "task_002", "price": 5, "parameters": {"topic": "crypto trends", "thread_length": "7", "tone": "bullish"}}}',
        },
      },
      {
        name: "{{agentName}}",
        content: {
          text: `✅ **Task Created Successfully**

🔧 **Service**: thread_creation
🆔 **Task ID**: task_002
💰 **Price**: 5 USDC
👤 **Agent**: Onii

⚙️ **Parameters**:
   • topic: crypto trends
   • thread_length: 7
   • tone: bullish

🚀 Task is now being processed...`,
          actions: ["CREATE_TASK"],
        },
      },
    ],
  ],
}; 