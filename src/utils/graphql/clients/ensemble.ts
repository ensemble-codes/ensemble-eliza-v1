import { GraphQLClient } from "graphql-request";

import dotenv from 'dotenv'

dotenv.config()

export const ensembleClient = new GraphQLClient(
    process.env.ENSEMBLE_SUBGRAPH_URL,
)
