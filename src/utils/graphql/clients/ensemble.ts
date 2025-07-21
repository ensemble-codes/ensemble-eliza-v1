import { GraphQLClient } from "graphql-request";

import dotenv from 'dotenv'

dotenv.config()

export const ensembleClient = new GraphQLClient(
    process.env.ENSEMBLE_SUBGRAPH_URL || 'https://api.goldsky.com/api/public/project_cmcnps2k01akp01uobifl4bby/subgraphs/ensemble-subgraph/0.0.1/gn',
)
