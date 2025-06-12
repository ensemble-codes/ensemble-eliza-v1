import { gql } from "graphql-request";
import { ensembleClient } from "../clients/ensemble";

interface AgentMetadata {
    name: string;
    description: string;
    imageUri: string;
}

interface Agent {
    id: string;
    name: string;
    agentUri: string;
    reputation: number;
    metadata: AgentMetadata;
}

interface FindAgentsByServiceResponse {
    proposals: {
        service: string;
        issuer: Agent;
    }[]
}

interface FindAgentsByDescriptionResponse {
    agents: Agent[]
}

const findAgentsByServiceQuery = gql`
    query FindAgents($searchTerm: String!) {
        proposals(
            where: {
                service_contains_nocase: $searchTerm
            }
            ) {
                service
                issuer {
                    id
                    name
                    agentUri
                    reputation
                    metadata {
                        name
                        description
                        imageUri
                    }
                }
        }
    }
`

export function findAgentsByService(searchTerm: string) {
    return ensembleClient.request<FindAgentsByServiceResponse>(
        findAgentsByServiceQuery,
        {
            searchTerm,
        }
    )
}

const findAgentsByDescriptionQuery = gql`
    query FindAgents($searchTerm: String!) {
        agents(
            where: {
                metadata_: { description_contains_nocase: $searchTerm }
            }
        ) {
            id
            name
            agentUri
            reputation
            metadata {
                name
                description
                imageUri
            }
        }
    }
`

export function findAgentsByDescription(searchTerm: string) {
    return ensembleClient.request<FindAgentsByDescriptionResponse>(
        findAgentsByDescriptionQuery,
        {
            searchTerm,
        }
    )
}
