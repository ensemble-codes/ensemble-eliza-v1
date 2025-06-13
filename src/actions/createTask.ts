import {
  Action,
  composePromptFromState,
  Content,
  HandlerCallback,
  IAgentRuntime,
  logger,
  Memory,
  ModelType,
  State,
} from "@elizaos/core";
import Ensemble from "@ensemble-ai/sdk";
import { Scraper } from 'agent-twitter-client'
import { ethers } from "ethers";

const tweetGenerationTemplate = `
{{bio}}
{{lore}}
{{topics}}

{{characterPostExamples}}

{{recentMessages}}

You are a social media expert. You are given a task and you need to generate a tweet about it.

Example task:
{"task": {"service_id": "thread_creation", "task_id": "task_002", "price": 5, "parameters": {"topic": "crypto trends", "thread_length": "7", "tone": "bullish"}}}

Using information from the task provided by the user. Generate a tweet in the voice and style and perspective of {{agentName}}.
Write a tweet about {{topic}}, from the perspective of {{agentName}} in the a {{tone}} tone. Do not add commentary or acknowledge this request, just write the post.
Your response should be 1, 2, or 3 sentences (choose the length at random).
Your response should not contain any questions. Brief, concise statements only. No emojis. The total character count MUST be less than 187. Use \\n\\n (double spaces) between statements if there are multiple statements in your response.
`

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

interface EnsembleConfig {
  taskRegistryAddress: string;
  agentRegistryAddress: string;
  serviceRegistryAddress: string;
  network: {
    chainId: number;
    rpcUrl: string;
    name: string;
  };
}

function getEnsembleConfig(runtime: IAgentRuntime): EnsembleConfig {
  return {
    taskRegistryAddress: runtime.character.settings.TASK_REGISTRY_ADDRESS ?? '',
    agentRegistryAddress: runtime.character.settings.AGENT_REGISTRY_ADDRESS ?? '',
    serviceRegistryAddress: runtime.character.settings.SERVICE_REGISTRY_ADDRESS ?? '',
    network: {
      chainId: parseInt(runtime.character.settings.NETWORK_CHAIN_ID ?? '0'),
      rpcUrl: runtime.character.settings.NETWORK_RPC_URL ?? '',
      name: runtime.character.settings.NETWORK_NAME ?? '',
    }
  };
}

async function initializeEnsembleSDK(runtime: IAgentRuntime): Promise<Ensemble> {
  const provider = new ethers.JsonRpcProvider(runtime.character.settings.NETWORK_RPC_URL);
  const wallet = new ethers.Wallet(runtime.character.settings.PRIVATE_KEY ?? '', provider);
  
  return Ensemble.create(
    getEnsembleConfig(runtime),
    wallet,
    null
  );
}

async function completeTaskOnChain(runtime: IAgentRuntime, taskId: string, tweetUrl: string): Promise<void> {
  try {
    const ensembleSdk = await initializeEnsembleSDK(runtime);
    await ensembleSdk.completeTask(taskId, tweetUrl);
  } catch (error) {
    logger.error("Failed to complete task on chain:", error);
    throw new Error("Failed to complete task on chain");
  }
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

      const task = JSON.parse(message.content.text ?? "");

      const { topic, tone } = task.task.parameters;

      const template = tweetGenerationTemplate.replace("{{topic}}", topic).replace("{{tone}}", tone);

      const prompt = composePromptFromState({
        state,
        template,
      })

      const tweetContent = await runtime.useModel(ModelType.TEXT_SMALL, {
        prompt
      })

      const cleanTweet = tweetContent
        .trim()
        .replace(/^["'](.*)["']$/, "$1")
        .replace(/\\n/g, "\n");

      const scraper = new Scraper()
      
      await scraper.login(
        runtime.getSetting("TWITTER_USERNAME"), 
        runtime.getSetting("TWITTER_PASSWORD"), 
        runtime.getSetting("TWITTER_EMAIL")
      )

      const tweet = await scraper.sendTweet(cleanTweet)

      const tweetJson: any = await tweet.json()

      logger.info("Tweet sent to Twitter:", { tweetJson })

      const username = tweetJson.data.create_tweet.tweet_results.result.core.user_results.result.legacy.screen_name
      const tweetId = tweetJson.data.create_tweet.tweet_results.result.rest_id
      const tweetUrl = `https://twitter.com/${username}/status/${tweetId}`

      const responseText = `Task completed successfully. Tweet sent to Twitter: ${tweetUrl}\n${cleanTweet}`

      await completeTaskOnChain(runtime, task.task.task_id, tweetUrl);

      const responseContent: Content = {
        text: responseText,
        actions: ["CREATE_TASK"],
        source: message.content.source,
      };

      await callback(responseContent);

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
          text: `Task completed successfully. Tweet sent to Twitter: https://x.com/Onii_AI/status/1775860000000000000 \n A tweet about SuperDeFi has been posted to Twitter.`,
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
          text: `Task completed successfully. Tweet sent to Twitter: https://x.com/Onii_AI/status/1775860000000000000 \n A tweet about SuperDeFi has been posted to Twitter.`,
          actions: ["CREATE_TASK"],
        },
      },
    ],
  ],
}; 