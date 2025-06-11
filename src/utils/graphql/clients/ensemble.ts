import { GraphQLClient } from "graphql-request";

import dotenv from 'dotenv'

dotenv.config()

export const ensembleClient = new GraphQLClient(
    process.env.ENSEMBLE_SUBGRAPH_URL || 'https://api.goldsky.com/api/public/project_cm9zz5dndyzbf01tm1a1874j0/subgraphs/ensemble/0.1.0/gn',
)
