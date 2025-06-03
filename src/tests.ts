import type { Content, IAgentRuntime, Memory, State, TestSuite, UUID } from '@elizaos/core';
import { v4 as uuidv4 } from 'uuid';

export class StarterTestSuite implements TestSuite {
  name = 'starter';
  description = 'Tests for the starter project';

  tests = [
    {
      name: 'Project structure test',
      fn: async (runtime: IAgentRuntime) => {
        // Test that the runtime has been properly initialized with actions
        if (!runtime.actions || runtime.actions.length === 0) {
          throw new Error('Runtime should have actions registered');
        }

        // Check for required actions
        const requiredActions = ['HELLO_WORLD', 'GENERATE_TWITTER_POST'];
        const missingActions = requiredActions.filter(
          actionName => !runtime.actions.find(action => action.name === actionName)
        );

        if (missingActions.length > 0) {
          throw new Error(`Missing required actions: ${missingActions.join(', ')}`);
        }

        // Check for providers
        if (!runtime.providers || runtime.providers.length === 0) {
          throw new Error('Runtime should have providers registered');
        }
      },
    },
    {
      name: 'Runtime initialization test',
      fn: async (runtime: IAgentRuntime) => {
        // Test that the runtime has basic required properties
        if (!runtime) {
          throw new Error('Runtime should be defined');
        }

        if (!runtime.actions) {
          throw new Error('Runtime should have actions property');
        }

        if (!runtime.providers) {
          throw new Error('Runtime should have providers property');
        }

        // Test that we can access basic runtime methods
        if (typeof runtime.getSetting !== 'function') {
          throw new Error('Runtime should have getSetting method');
        }
      },
    },
    {
      name: 'Plugin initialization test',
      fn: async (runtime: IAgentRuntime) => {
        // Test plugin initialization with empty config
        try {
          await runtime.registerPlugin({
            name: 'starter',
            description: 'A starter plugin for Eliza',
            init: async () => {},
            config: {},
          });
        } catch (error) {
          throw new Error(`Failed to register plugin: ${error.message}`);
        }
      },
    },
    {
      name: 'Hello world action test',
      fn: async (runtime: IAgentRuntime) => {
        const message: Memory = {
          entityId: uuidv4() as UUID,
          roomId: uuidv4() as UUID,
          content: {
            text: 'Can you say hello?',
            source: 'test',
            actions: ['HELLO_WORLD'], // Explicitly request the HELLO_WORLD action
          },
        };

        const state: State = {
          values: {},
          data: {},
          text: '',
        };
        let responseReceived = false;

        // Test the hello world action
        try {
          await runtime.processActions(message, [], state, async (content: Content) => {
            if (content.text === 'hello world!' && content.actions?.includes('HELLO_WORLD')) {
              responseReceived = true;
            }
            return [];
          });

          if (!responseReceived) {
            // Try directly executing the action if processActions didn't work
            const helloWorldAction = runtime.actions.find((a) => a.name === 'HELLO_WORLD');
            if (helloWorldAction) {
              await helloWorldAction.handler(
                runtime,
                message,
                state,
                {},
                async (content: Content) => {
                  if (content.text === 'hello world!' && content.actions?.includes('HELLO_WORLD')) {
                    responseReceived = true;
                  }
                  return [];
                },
                []
              );
            } else {
              throw new Error('HELLO_WORLD action not found in runtime.actions');
            }
          }

          if (!responseReceived) {
            throw new Error('Hello world action did not produce expected response');
          }
        } catch (error) {
          throw new Error(`Hello world action test failed: ${error.message}`);
        }
      },
    },
    {
      name: 'Hello world provider test',
      fn: async (runtime: IAgentRuntime) => {
        const message: Memory = {
          entityId: uuidv4() as UUID,
          roomId: uuidv4() as UUID,
          content: {
            text: 'What can you provide?',
            source: 'test',
          },
        };

        const state: State = {
          values: {},
          data: {},
          text: '',
        };

        // Test the hello world provider
        try {
          if (!runtime.providers || runtime.providers.length === 0) {
            throw new Error('No providers found in runtime');
          }

          // Find the specific provider we want to test
          const helloWorldProvider = runtime.providers.find(
            (p) => p.name === 'HELLO_WORLD_PROVIDER'
          );

          if (!helloWorldProvider) {
            throw new Error('HELLO_WORLD_PROVIDER not found in runtime providers');
          }

          const result = await helloWorldProvider.get(runtime, message, state);

          if (result.text !== 'I am a provider') {
            throw new Error(`Expected provider to return "I am a provider", got "${result.text}"`);
          }
        } catch (error) {
          throw new Error(`Hello world provider test failed: ${error.message}`);
        }
      },
    },
    {
      name: 'Starter service test',
      fn: async (runtime: IAgentRuntime) => {
        // Test service registration and lifecycle
        try {
          const service = runtime.getService('starter');
          if (!service) {
            throw new Error('Starter service not found');
          }

          if (
            service.capabilityDescription !==
            'This is a starter service which is attached to the agent through the starter plugin.'
          ) {
            throw new Error('Incorrect service capability description');
          }

          await service.stop();
        } catch (error) {
          throw new Error(`Starter service test failed: ${error.message}`);
        }
      },
    },
    {
      name: 'Twitter action validation test',
      fn: async (runtime: IAgentRuntime) => {
        // Mock Twitter credentials for testing
        const originalUsername = process.env.TWITTER_USERNAME;
        const originalPassword = process.env.TWITTER_PASSWORD;
        
        process.env.TWITTER_USERNAME = 'test_user';
        process.env.TWITTER_PASSWORD = 'test_password';

        try {
          const message: Memory = {
            entityId: uuidv4() as UUID,
            roomId: uuidv4() as UUID,
            content: {
              text: 'Can you tweet about AI development?',
              source: 'test',
            },
          };

          const state: State = {
            values: {},
            data: {},
            text: '',
          };

          // Test the Twitter post generation action
          const twitterAction = runtime.actions.find((a) => a.name === 'GENERATE_TWITTER_POST');
          if (!twitterAction) {
            throw new Error('GENERATE_TWITTER_POST action not found in runtime.actions');
          }

          // Test validation
          const isValid = await twitterAction.validate(runtime, message, state);
          if (!isValid) {
            throw new Error('Twitter action validation failed');
          }

          let responseReceived = false;
          let tweetGenerated = false;

          // Test handler
          await twitterAction.handler(
            runtime,
            message,
            state,
            {},
            async (content: Content) => {
              responseReceived = true;
              if (content.text && content.text.includes('generated this Twitter post')) {
                tweetGenerated = true;
              }
              return [];
            },
            []
          );

          if (!responseReceived) {
            throw new Error('Twitter action did not produce a response');
          }

          if (!tweetGenerated) {
            throw new Error('Twitter action did not generate expected tweet content');
          }

          // Check if pending post was stored in state
          if (!state.pendingTwitterPosts || Object.keys(state.pendingTwitterPosts).length === 0) {
            throw new Error('Twitter action did not store pending post in state');
          }

        } finally {
          // Restore original environment variables
          if (originalUsername) {
            process.env.TWITTER_USERNAME = originalUsername;
          } else {
            delete process.env.TWITTER_USERNAME;
          }
          
          if (originalPassword) {
            process.env.TWITTER_PASSWORD = originalPassword;
          } else {
            delete process.env.TWITTER_PASSWORD;
          }
        }
      },
    },
  ];
}

export default StarterTestSuite; 