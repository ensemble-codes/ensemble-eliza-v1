import type {
  Action,
  Content,
  HandlerCallback,
  IAgentRuntime,
  Memory,
  State,
} from '@elizaos/core';
import { logger, ModelType } from '@elizaos/core';
import { Scraper } from 'agent-twitter-client';

/**
 * Interface for pending Twitter posts stored in state
 */
interface PendingTwitterPost {
  content: string;
  userId: string;
  timestamp: number;
  postId: string;
}

/**
 * Twitter Post Generation Action
 * Generates a Twitter post based on user request and asks for confirmation
 */
export const generateTwitterPostAction: Action = {
  name: 'TWITTER_POST',
  similes: ['CREATE_TWEET', 'WRITE_TWEET', 'POST_TO_TWITTER', 'TWEET_THIS'],
  description: 'Generates a Twitter post based on user request',

  validate: async (runtime: IAgentRuntime, message: Memory, state: State): Promise<boolean> => {
    // Check if Twitter credentials are configured
    logger.info('Start - Validating TWITTER_POST action');

    const hasCredentials = process.env.TWITTER_USERNAME && process.env.TWITTER_PASSWORD;
    if (!hasCredentials) {
      logger.warn('Twitter credentials not configured');
      return false;
    }

    // Check if the user is requesting a Twitter post
    const text = message.content.text?.toLowerCase() || '';
    const keywords = ['tweet', 'twitter', 'post to twitter', 'share on twitter', 'write a tweet'];
    const response = keywords.some(keyword => text.includes(keyword));
    logger.info('End - Validating TWITTER_POST action. response: ' + response);

    return response
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    options: any,
    callback: HandlerCallback,
    responses: Memory[]
  ) => {
    try {
      logger.info('Handling TWITTER_POST action');

      const userRequest = message.content.text || '';
      
      // Generate tweet content using the runtime's model
      const tweetPrompt = `Generate a compelling Twitter post based on this request: "${userRequest}"

Requirements:
- Keep it under 200 characters
- Make it engaging and authentic
- Include relevant hashtags if appropriate
- Match the tone and style requested
- Do not include quotes around the final tweet

Return only the tweet content, nothing else.`;

      const generatedContent = await runtime.useModel(ModelType.TEXT_SMALL, {
        prompt: tweetPrompt,
      });

      const tweetContent = generatedContent.trim();

      // Validate tweet length
      if (tweetContent.length > 280) {
        const responseContent: Content = {
          text: `The generated tweet is too long (${tweetContent.length} characters). Please try a shorter request or I can help you trim it down.`,
          source: message.content.source,
        };
        await callback(responseContent);
        return responseContent;
      }

      // Store the pending post in state
      const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const pendingPost: PendingTwitterPost = {
        content: tweetContent,
        userId: message.entityId,
        timestamp: Date.now(),
        postId: postId,
      };

      // Get current pending posts or initialize empty object
      const currentPendingPosts = state.pendingTwitterPosts || {};
      currentPendingPosts[postId] = pendingPost;

      // Update state with the pending post (state is mutable in elizaOS)
      state.pendingTwitterPosts = currentPendingPosts;

      // Ask for confirmation
      const responseContent: Content = {
        text: `I've generated this Twitter post for you:\n\n"${tweetContent}"\n\n${tweetContent.length}/280 characters\n\nWould you like me to post this to Twitter? Reply with "yes" or "post it" to confirm, or "no" to cancel.`,
        source: message.content.source,
        metadata: {
          postId: postId,
          pendingPost: true,
        },
        actions: ["TWITTER_POST"],
      };

      await callback(responseContent);
      return responseContent;
    } catch (error) {
      logger.error('Error in TWITTER_POST action:', error);
      
      const errorContent: Content = {
        text: 'Sorry, I encountered an error while generating your Twitter post. Please try again.',
        source: message.content.source,
      };
      
      await callback(errorContent);
      return errorContent;
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

/**
 * Twitter Post Confirmation Action
 * Handles user confirmation and posts the tweet if approved
 */
export const confirmTwitterPostAction: Action = {
  name: 'CONFIRM_TWITTER_POST',
  similes: ['YES', 'POST_IT', 'CONFIRM', 'APPROVE', 'GO_AHEAD'],
  description: 'Confirms and posts a pending Twitter post',

  validate: async (runtime: IAgentRuntime, message: Memory, state: State): Promise<boolean> => {
    // Check if there are pending posts
    const pendingPosts = state.pendingTwitterPosts || {};
    const hasPendingPosts = Object.keys(pendingPosts).length > 0;
    
    if (!hasPendingPosts) {
      return false;
    }

    // Check if the user is confirming
    const text = message.content.text?.toLowerCase() || '';
    const confirmationWords = ['yes', 'post it', 'confirm', 'approve', 'go ahead', 'do it', 'post'];
    return confirmationWords.some(word => text.includes(word));
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    options: any,
    callback: HandlerCallback,
    responses: Memory[]
  ) => {
    try {
      logger.info('Handling CONFIRM_TWITTER_POST action');

      const pendingPosts = state.pendingTwitterPosts || {};
      const postIds = Object.keys(pendingPosts);

      if (postIds.length === 0) {
        const responseContent: Content = {
          text: 'No pending Twitter posts to confirm.',
          source: message.content.source,
        };
        await callback(responseContent);
        return responseContent;
      }

      // Get the most recent pending post for this user
      const userPendingPosts = postIds
        .map(id => pendingPosts[id])
        .filter(post => post.userId === message.entityId)
        .sort((a, b) => b.timestamp - a.timestamp);

      if (userPendingPosts.length === 0) {
        const responseContent: Content = {
          text: 'No pending Twitter posts found for your account.',
          source: message.content.source,
        };
        await callback(responseContent);
        return responseContent;
      }

      const postToConfirm = userPendingPosts[0];

      try {
        // Initialize Twitter scraper
        const scraper = new Scraper();
        
        // Login to Twitter
        await scraper.login(
          process.env.TWITTER_USERNAME!,
          process.env.TWITTER_PASSWORD!,
          process.env.TWITTER_EMAIL
        );

        // Post the tweet
        await scraper.sendTweet(postToConfirm.content);

        logger.info(`Successfully posted tweet: ${postToConfirm.content}`);

        // Remove the pending post from state
        const updatedPendingPosts = { ...pendingPosts };
        delete updatedPendingPosts[postToConfirm.postId];
        state.pendingTwitterPosts = updatedPendingPosts;

        const responseContent: Content = {
          text: `✅ Successfully posted to Twitter!\n\n"${postToConfirm.content}"`,
          source: message.content.source,
        };

        await callback(responseContent);
        return responseContent;
      } catch (twitterError) {
        logger.error('Error posting to Twitter:', twitterError);
        
        const responseContent: Content = {
          text: `❌ Failed to post to Twitter. Please check your Twitter credentials and try again. Error: ${twitterError.message}`,
          source: message.content.source,
        };

        await callback(responseContent);
        return responseContent;
      }
    } catch (error) {
      logger.error('Error in CONFIRM_TWITTER_POST action:', error);
      
      const errorContent: Content = {
        text: 'Sorry, I encountered an error while posting to Twitter. Please try again.',
        source: message.content.source,
      };
      
      await callback(errorContent);
      return errorContent;
    }
  },

  examples: [
    [
      {
        name: '{{user1}}',
        content: {
          text: 'yes, post it',
        },
      },
      {
        name: '{{name2}}',
        content: {
          text: '✅ Successfully posted to Twitter!\n\n"AI is fundamentally changing how we build software. From intelligent code completion to automated testing, developers are becoming more productive and creative than ever. The future of coding is collaborative human-AI partnerships. #AI #SoftwareDevelopment #Tech"',
        },
      },
    ],
  ],
};

/**
 * Twitter Post Cancellation Action
 * Handles user cancellation of pending Twitter posts
 */
export const cancelTwitterPostAction: Action = {
  name: 'CANCEL_TWITTER_POST',
  similes: ['NO', 'CANCEL', 'DONT_POST', 'NEVERMIND', 'ABORT'],
  description: 'Cancels a pending Twitter post',

  validate: async (runtime: IAgentRuntime, message: Memory, state: State): Promise<boolean> => {
    // Check if there are pending posts
    const pendingPosts = state.pendingTwitterPosts || {};
    const hasPendingPosts = Object.keys(pendingPosts).length > 0;
    
    if (!hasPendingPosts) {
      return false;
    }

    // Check if the user is canceling
    const text = message.content.text?.toLowerCase() || '';
    const cancellationWords = ['no', 'cancel', 'dont post', 'don\'t post', 'nevermind', 'abort', 'skip'];
    return cancellationWords.some(word => text.includes(word));
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    options: any,
    callback: HandlerCallback,
    responses: Memory[]
  ) => {
    try {
      logger.info('Handling CANCEL_TWITTER_POST action');

      const pendingPosts = state.pendingTwitterPosts || {};
      const postIds = Object.keys(pendingPosts);

      if (postIds.length === 0) {
        const responseContent: Content = {
          text: 'No pending Twitter posts to cancel.',
          source: message.content.source,
        };
        await callback(responseContent);
        return responseContent;
      }

      // Get the most recent pending post for this user
      const userPendingPosts = postIds
        .map(id => pendingPosts[id])
        .filter(post => post.userId === message.entityId)
        .sort((a, b) => b.timestamp - a.timestamp);

      if (userPendingPosts.length === 0) {
        const responseContent: Content = {
          text: 'No pending Twitter posts found for your account.',
          source: message.content.source,
        };
        await callback(responseContent);
        return responseContent;
      }

      const postToCancel = userPendingPosts[0];

      // Remove the pending post from state
      const updatedPendingPosts = { ...pendingPosts };
      delete updatedPendingPosts[postToCancel.postId];
      state.pendingTwitterPosts = updatedPendingPosts;

      const responseContent: Content = {
        text: `❌ Cancelled the Twitter post:\n\n"${postToCancel.content}"\n\nThe post was not published.`,
        source: message.content.source,
      };

      await callback(responseContent);
      return responseContent;
    } catch (error) {
      logger.error('Error in CANCEL_TWITTER_POST action:', error);
      
      const errorContent: Content = {
        text: 'Sorry, I encountered an error while canceling the Twitter post.',
        source: message.content.source,
      };
      
      await callback(errorContent);
      return errorContent;
    }
  },

  examples: [
    [
      {
        name: '{{user1}}',
        content: {
          text: 'no, cancel it',
        },
      },
      {
        name: '{{name2}}',
        content: {
          text: '❌ Cancelled the Twitter post:\n\n"AI is fundamentally changing how we build software. From intelligent code completion to automated testing, developers are becoming more productive and creative than ever. The future of coding is collaborative human-AI partnerships. #AI #SoftwareDevelopment #Tech"\n\nThe post was not published.',
        },
      },
    ],
  ],
}; 