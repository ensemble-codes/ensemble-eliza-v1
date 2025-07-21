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

interface FindAgentsByAttributeResponse {
    agents: Agent[]
}

interface FindAgentsByDescriptionResponse {
    agents: Agent[]
}

const findAgentsByAttributesQuery = gql`
    query FindAgents($searchTerms: [String!]) {
        agents(
            where: {
                metadata_: { attributes_contains_nocase: $searchTerms }
        }) {
                id
                name
                agentUri
                reputation
                metadata {
                    attributes
                    name
                    description
                    imageUri
                }
        }
    }
`

export function findAgentsByAttributes(searchTerms: string[]) {
    return ensembleClient.request<FindAgentsByAttributeResponse>(
        findAgentsByAttributesQuery,
        {
            searchTerms,
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
