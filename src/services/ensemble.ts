import { findAgentsByDescription, findAgentsByService } from "../utils/graphql/queries/findAgents";

export async function findAgents(searchTerm: string) {
    const matchedAgents = [] 
    
    const agentsByService = await findAgentsByService(searchTerm);

    agentsByService.proposals.forEach((agent: any) => {
        matchedAgents.push({
            id: agent.issuer.id,
            name: agent.issuer.metadata.name,
            description: agent.issuer.metadata.description,
            agentUri: agent.issuer.agentUri,
            reputation: agent.issuer.reputation,
        })
    });

    const agentsByDescription = await findAgentsByDescription(searchTerm);

    agentsByDescription.agents.forEach((agent: any) => {
        matchedAgents.push({
            id: agent.id,
            name: agent.name,
            description: agent.description,
            agentUri: agent.agentUri,
            reputation: agent.reputation,
        })
    });

    return matchedAgents;
}
