import { gql } from "graphql-request";
import { ensembleClient } from "../clients/ensemble";

interface FindAgentsByServiceResponse {
    proposals: {
        service: string;
        issuer: {
            id: string;
            name: string;
            agentUri: string;
            reputation: number;
            metadata: {
                name: string;
                description: string;
            }
        }
    }[]
}

interface FindAgentsByDescriptionResponse {
    agents: {
        id: string;
        name: string;
        agentUri: string;
        reputation: number;
        metadata: {
            name: string;
            description: string;
        }
    }[]
}

const findAgentsByServiceQuery = gql`
    query FindAgents($searchTerm: String!) {
        proposals(
            where: {
                service_contains_nocase: $searchTerm
            }
            ) {
            service
            issuer{
                id
                name
                agentUri
                reputation
                metadata {
                name
                description
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
