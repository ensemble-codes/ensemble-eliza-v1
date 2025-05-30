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

const tweetGenerationTemplate = `# Task: Create a post in the style and voice of {{agentName}}.
{{system}}

About {{agentName}}:
{{bio}}

{{topics}}

{{characterPostExamples}}

Recent Context:
{{recentMessages}}

# Instructions: Write a tweet that captures the essence of what {{agentName}} wants to share. The tweet should be:
- Under 280 characters
- In {{agentName}}'s authentic voice and style
- Related to the ongoing conversation or context
- Not include hashtags unless specifically requested
- Natural and conversational in tone

Return only the tweet text, no additional commentary.`;

export const twitterPostAction: Action = {
  name: "TWITTER_POST",
  similes: ["POST_TWEET", "SHARE_TWEET", "TWEET_THIS", "TWEET_ABOUT"],
  description: "Creates and posts a tweet based on the conversation context",

  validate: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
  ): Promise<boolean> => {
    const room = state.data.room ?? (await runtime.getRoom(message.roomId));
    if (!room) {
      throw new Error("Room not found");
    }

    const pendingTasks = await runtime.getTasks({
      roomId: message.roomId,
      tags: ["TWITTER_POST"],
    });

    if (pendingTasks && pendingTasks.length > 0) {
      if (!runtime.getTaskWorker("Confirm Twitter Post")) {
        await runtime.deleteTask(pendingTasks[0].id);
      } else {
        return false;
      }
    }

    return true;
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

      // Generate tweet content
      const prompt = composePromptFromState({
        state,
        template: tweetGenerationTemplate,
      });

      const tweetContent = await runtime.useModel(ModelType.TEXT_SMALL, {
        prompt,
      });

      logger.debug(tweetContent);

      const cleanTweet = tweetContent
        .trim()
        .replace(/^["'](.*)["']$/, "$1")
        .replace(/\\n/g, "\n");

      const responseContent: Content = {
        text: `I'll tweet this:\n\n${cleanTweet}`,
        actions: ["TWITTER_POST"],
        source: message.content.source,
      };

      const worker = {
        name: "Confirm Twitter Post",
        description: "Confirm if the tweet should be posted.",
        execute: async (
          runtime: IAgentRuntime,
          options: { option: string },
          task
        ) => {
          if (options.option === "cancel") {
            await callback({
              ...responseContent,
              text: "OK, I won't post it.",
              actions: ["TWITTER_POST_CANCELLED"],
            });
            await runtime.deleteTask(task.id);
            return;
          }

          if (options.option !== "post") {
            await callback({
              ...responseContent,
              text: "Bad choice. Should be 'post' or 'cancel'.",
              actions: ["TWITTER_POST_INVALID_OPTION"],
            });
            return;
          }

          await callback({
            ...responseContent,
            text: `https://twitter.com/intent/tweet?text=${cleanTweet}`,
            url: `https://twitter.com/intent/tweet?text=${cleanTweet}`,
            tweetId: "123456789",
          });
        },
      };

      if (!runtime.getTaskWorker("TWITTER_POST")) {
        runtime.registerTaskWorker(worker);
      }

      runtime.createTask({
        roomId: message.roomId,
        name: "Confirm Twitter Post",
        description: "Confirm the tweet to be posted.",
        tags: ["TWITTER_POST", "AWAITING_CHOICE"],
        metadata: {
          options: [
            {
              name: "post",
              description: "Post the tweet to Twitter",
            },
            {
              name: "cancel",
              description: "Cancel the tweet and don't post it",
            },
          ],
        },
      });

      responseContent.text += "\nWaiting for approval";

      await callback({
        ...responseContent,
        actions: ["TWITTER_POST_TASK_NEEDS_CONFIRM"],
      });

      logger.info(
        "TWITTER_POST_TASK_NEEDS_CONFIRM",
        runtime.getTasks({ roomId: message.roomId, tags: ["TWITTER_POST"] })
      );

      return responseContent;
    } catch (error) {
      console.error("Error in TWITTER_POST action:", error);
      throw error;
    }
  },

  examples: [
    [
      {
        name: "{{name1}}",
        content: {
          text: "That's such a great point about neural networks! You should tweet that",
        },
      },
      {
        name: "{{agentName}}",
        content: {
          text: "I'll tweet this:\n\nDeep learning isn't just about layers - it's about understanding how neural networks actually learn from patterns. The magic isn't in the math, it's in the emergent behaviors we're just beginning to understand.",
          actions: ["TWITTER_POST"],
        },
      },
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "Can you share this insight on Twitter?",
        },
      },
      {
        name: "{{agentName}}",
        content: {
          text: "Tweet posted!\nhttps://twitter.com/username/status/123456789",
          actions: ["TWITTER_POST"],
        },
      },
    ],
  ],
};
