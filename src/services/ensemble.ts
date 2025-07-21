import { findAgentsByDescription, findAgentsByAttributes } from "../utils/graphql/queries/findAgents";

export async function findAgents(searchTerm: string) {
    const matchedAgents = [] 
    const matchedAgentIds = new Set<string>()
    
    const agentsByAttributes = await findAgentsByAttributes(
        [searchTerm.toLowerCase()],
        [searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)]);

    agentsByAttributes.agents.forEach((agent) => {
        if (matchedAgentIds.has(agent.id)) {
            return
        }
        
        matchedAgents.push({
            id: agent.id,
            name: agent.metadata.name,
            description: agent.metadata.description,
            imageUri: agent.metadata.imageUri,
            agentUri: agent.agentUri,
            reputation: agent.reputation,
        })

        matchedAgentIds.add(agent.id)
    });

    const agentsByDescription = await findAgentsByDescription(searchTerm);

    agentsByDescription.agents.forEach((agent) => {
        if (matchedAgentIds.has(agent.id)) {
            return
        }

        matchedAgents.push({
            id: agent.id,
            name: agent.name,
            description: agent.metadata.description,
            imageUri: agent.metadata.imageUri,
            agentUri: agent.agentUri,
            reputation: agent.reputation,
        })

        matchedAgentIds.add(agent.id)
    });

    return matchedAgents;
}
