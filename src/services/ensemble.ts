import { findAgentsByDescription, findAgentsByService } from "../utils/graphql/queries/findAgents";

export async function findAgents(searchTerm: string) {
    const matchedAgents = [] 
    const matchedAgentIds = new Set<string>()
    
    const agentsByService = await findAgentsByService(searchTerm);

    agentsByService.proposals.forEach((agent) => {
        if (matchedAgentIds.has(agent.issuer.id)) {
            return
        }
        
        matchedAgents.push({
            id: agent.issuer.id,
            name: agent.issuer.metadata.name,
            description: agent.issuer.metadata.description,
            imageUri: agent.issuer.metadata.imageUri,
            agentUri: agent.issuer.agentUri,
            reputation: agent.issuer.reputation,
        })

        matchedAgentIds.add(agent.issuer.id)
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
