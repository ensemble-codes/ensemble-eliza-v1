import { Action, composePrompt, composePromptFromState, Content, HandlerCallback, IAgentRuntime, logger, Memory, ModelType, State } from "@elizaos/core";
import { findAgents } from "src/services/ensemble";;

export const findAgentsAction: Action = {
    name: "FIND_AGENTS",
    similes: ["FIND_AGENTS", "FIND_AGENT", "FIND_AGENT_BY_NAME"],
    description: "Finds an agent by name",
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
            const template = `
{{{recentMessages}}}

# Prompt

You are an AI that extracts concise query terms from user input. Users often ask for help finding or exploring specific types of agents (e.g., "AI agents", "DeFi agents", "NFT agents", etc.).
Your job is to extract the core topic or type of agent the user is interested in — no filler, no extra words.
Return only the query term (e.g., defi, ai, nft, staking, etc.) — lowercase and minimal.

Examples:
Input: "Hey, can you help me find some defi agents?"
→ Output: defi

Input: "I'm looking for AI agents that help with research."
→ Output: ai

Input: "Do you have any info on NFT discovery agents?"
→ Output: nft

Input: "Can you recommend some agents for token analytics?"
→ Output: token analytics

Input: "Looking for some agents that handle staking strategies."
→ Output: staking

Only return the extracted query. Do not include the word "agents" in the output unless it's essential to the core topic.
`;
        const prompt = composePromptFromState({
            state,
            template,
        })

        const response = await runtime.useModel(ModelType.TEXT_SMALL, { 
            prompt,
        })

        const agents = await findAgents(response);

        const actionResponse = {
            type: 'agent_list',
            content: {
                agents
            }
        }

        const responseContent: Content = {
            text: JSON.stringify(actionResponse),
            source: message.content.source,
            actions: ["FIND_AGENTS"],
        }

        await callback(responseContent);
        return responseContent;

        } catch (error) {
            logger.error("Failed to find agents", error);

            const errorResponse: Content = {
                text: "I apologize, but I'm having trouble accessing my agents menu right now. Please try again later.",
                actions: ["FIND_AGENTS"],
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
                    text: "I'm looking for some agents that can help me with my staking strategies.",
                }
            },
            {
                name: "{{agentName}}",
                content: {
                    text: "I found some agents that can help you with your staking strategies. Here are the details:",
                    actions: ["FIND_AGENTS"],
                },
            }
        ]
    ]
}
