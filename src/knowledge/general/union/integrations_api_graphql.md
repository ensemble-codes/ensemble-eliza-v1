GraphQL
=======

Unionlabs provides a hosted indexing service for all connected chains, served at [graphql.union.build](https://graphql.union.build/v1/graphql). A [GraphiQL Playground](/reference/graphql) is also provided, which can be used to explore all available data. This guide goes through the most useful queries and types.

Although most HTTP clients can be used to query our API, we recommend [URQL](https://commerce.nearform.com/open-source/urql/). Our GraphQL schema can be downloaded using [`graphqurl`](https://github.com/hasura/graphqurl) or [`graphql-inspector`](https://the-guild.dev/graphql/inspector):

*   [graphql-inspector](#tab-panel-2)
*   [graphqurl](#tab-panel-3)
*   [curl](#tab-panel-4)

    # download .graphql schemanpx @graphql-inspector/cli \  introspect https://graphql.union.build/v1/graphql \  --write schema.graphql

    # download .json schemanpx @graphql-inspector/cli \  introspect https://graphql.union.build/v1/graphql \  --write schema.json

    # download .graphql schemanpx graphqurl https://graphql.union.build/v1/graphql \  --introspect > schema.graphql

    # download .json schemanpx graphqurl https://graphql.union.build/v1/graphql \  --introspect \  --format json > schema.json

    curl --silent --location \    --request POST \    --url 'https://graphql.union.build/v1/graphql' \    --header 'Content-Type: application/json' \    --data '{"query":"query IntrospectionQuery { __schema { description queryType { name description } mutationType { name description } subscriptionType { name description } types { ...FullType } directives { name description locations args { ...InputValue } } } } fragment FullType on __Type { kind name description fields(includeDeprecated: true) { name description args { ...InputValue } type { ...TypeRef } isDeprecated deprecationReason } inputFields { ...InputValue } interfaces { ...TypeRef } enumValues(includeDeprecated: true) { name description isDeprecated deprecationReason } possibleTypes { ...TypeRef } } fragment InputValue on __InputValue { name description type { ...TypeRef } defaultValue } fragment TypeRef on __Type { kind name description ofType { kind name description ofType { kind name description ofType { kind name description ofType { kind name description ofType { kind name description ofType { kind name description ofType { kind name description } } } } } } } }","variables":{}}' \    | jq '.data' > schema.json

[Concepts](#concepts)
---------------------

The following definitions are used across the schema and documentation:

*   `source`: The chain or rollup where the packet is sent from, often prefixed such as `source_connection_id` or `source_channel_id`.
*   `destination`: The chain or roll-up that receives the packet.
*   `sender`: the contract or [EOA](https://ethereum.org/en/developers/docs/accounts/) that made the transfer.
*   `receiver`: the contract or [EOA](https://ethereum.org/en/developers/docs/accounts/) that received the transfer.
*   `universal_chain_id`: the [UCS-04](/ucs/04) chain reference.

[Queries](#queries)
-------------------

Below we have documented some common useful queries that are also leveraged in [app.union.build](https://app.union.build). For all queries, Union provides caches to increase performance. Use the syntax `@cached(ttl: ${time_in_seconds})` to cache the query. The cache key, which is used to map the query to the response, is computed by hashing:

*   the GraphQL query.
*   the GraphQL operation name.
*   the GraphQL variables of the query.

Caching can dramatically improve performance. Always add at least `@cached(ttl: 1)` to cache data between different windows, tabs, or users.

### [Transfers](#transfers)

Transfers facilitated by Union (`ucs03-zkgm-0`) are queryable using v2\_transfers.

    query GetLatest10Transfers @cached(ttl: 1) {  v2_transfers(args: {    p_limit: 10  }) {    sender_canonical    receiver_canonical    base_amount    base_token_meta {      denom      representations {        name        symbol        decimals      }    }  }}

It provides information on the sender, receiver, current stage of the transfer, and asset metadata.

To query for specific addresses (either sender or receiver), add the [canonical](/ucs/05/) address to the `p_addresses_canonical` args clause:

    query GetLatest10UserTransfers @cached(ttl: 1) {  v2_transfers(args: {    p_limit: 10,    p_addresses_canonical: [      "0x3c5daaa3c96ab8fe4cfc2fb6d76193fe959a9f82"    ]  }) {    sender_canonical    receiver_canonical    base_amount    base_token_meta {      denom      representations {        name        symbol        decimals      }    }    source_universal_chain_id    destination_universal_chain_id  }}

Aggregate statistics about all transfers and packets are also available, such as the total amount of transfers and packets:

    query {  v2_stats_count {    name    value  }}

### [Packets](#packets)

Packets, used in general message passing, can be tracked using v1\_packets, similar to v1\_transfers.

    query GetLatest10Packets @cached(ttl: 1) {  v2_packets(args: {    p_limit:10  }) {    source_universal_chain_id    destination_universal_chain_id    data    decoded  }}

### [Traces](#traces)

Both transfers and packets come with traces to track the progress of the message. There are six different trace types:

*   `SEND_PACKET`
*   `PACKET_SEND_LC_UPDATE_Ln` (multiple when state-lens clients are involved)
*   `PACKET_RECV`
*   `WRITE_ACK`
*   `WRITE_ACK_LC_UPDATE_Ln`
*   `PACKET_ACK`

For a specific transaction hash, you can obtain all traces of transfers and packets caused by this transaction (the `initiating_transaction_hash`) by querying

    query GetPacketWithTraces @cached(ttl: 1) {  v2_packets(args: {    p_transaction_hash: "0x9276722fb205ddf6bf94e5baa03ae990e4d4ef44a4342cbf17396f00a6313d57"  }) {    source_universal_chain_id    destination_universal_chain_id    data    decoded    traces {      type      universal_chain_id      transaction_hash      height      timestamp    }  }}

### [Tokens](#tokens)

Unionlabs provides a curated registry of different tokens across different chains, including the bridged asset info for Union’s assets.

    query GetAllSupportedTokens @cached(ttl: 1) {  v2_tokens {    denom    representations {      decimals      name      symbol    }  }}

The assets can also be filtered by a specific chain.

    query GetAllSupportedTokensByChain @cached(ttl: 1) {  v2_tokens(args: {    p_universal_chain_id: "union.union-testnet-10"  }) {    denom    representations {      decimals      name      symbol    }  }}

[Pagination Guide](#pagination-guide)
-------------------------------------

This API uses cursor-based pagination with three parameters that control which data is returned:

### [Parameters](#parameters)

*   **`p_limit`**  
    Maximum number of items to return.
    
    *   Default: `100`
    *   Maximum: `100`
*   **`p_sort_order`**  
    Acts as a cursor for pagination.
    
    *   For the **next page**, pass the `sort_order` value of the **last item** in the current result set.
    *   For the **previous page**, pass the `sort_order` value of the **first item** in the current result set.
*   **`p_comparison`**  
    Controls the pagination direction:
    
    *   `"lt"`: Fetch the **next** page (items **after** the given `sort_order`), results are returned in **descending** order.
    *   `"gt"`: Fetch the **previous** page (items **before** the given `sort_order`), results are returned in **ascending** order.

### [Notes](#notes)

*   Each result includes a `sort_order` field used for pagination.
*   **Do not parse or rely on the contents** of the `sort_order` value — its structure may change at any time. Treat it as an opaque value.
*   **Do not use external filtering or sorting options** — pagination and ordering are controlled solely through these parameters.

### [Example: Fetch first page (latest transfers)](#example-fetch-first-page-latest-transfers)

No cursor needed. This returns the most recent transfers.

    query GetInitialTransfers {  v2_transfers(args: { p_limit: 20 }) {    sender_canonical    receiver_canonical    base_amount    sort_order  }}

### [Example: Fetch next page](#example-fetch-next-page)

Use the `sort_order` value of the **last item** from the previous result.  
Set `p_comparison: "lt"` to fetch items after it (newer → older).

    query GetNextPage {  v2_transfers(args: {    p_limit: 20,    p_sort_order: "cursor-from-last-item",    p_comparison: "lt"  }) {    sender_canonical    receiver_canonical    base_amount    sort_order  }}

### [Example: Fetch previous page](#example-fetch-previous-page)

Use the `sort_order` value of the **first item** from the previous result.  
Set `p_comparison: "gt"` to fetch items before it (older → newer).

    query GetPreviousPage {  v2_transfers(args: {    p_limit: 20,    p_sort_order: "cursor-from-first-item",    p_comparison: "gt"  }) {    sender_canonical    receiver_canonical    base_amount    sort_order  }}

> ℹ️ Always treat `sort_order` as an **opaque string**. It is provided solely for pagination and may change format in the future.

[Filtering Guide](#filtering-guide)
-----------------------------------

This API supports filtering through function parameters. You should **not** use GraphQL-level `where` clauses on the top-level query, as they will only apply **after** the data has been fetched — potentially leading to unexpected or incomplete results.

These parameters must be passed via the `args` object in the GraphQL query.

### [Example: Filter by transaction hash](#example-filter-by-transaction-hash)

    query FilterByTransactionHash {  v2_transfers(args: {    p_limit: 20,    p_transaction_hash: "0x9276722fb205ddf6bf94e5baa03ae990e4d4ef44a4342cbf17396f00a6313d57"  }) {    sender_canonical    receiver_canonical    base_amount    sort_order  }}

### [Example: Filter by source\_universal\_chain\_id](#example-filter-by-source_universal_chain_id)

    query FilterBySourceChain {  v2_transfers(args: {    p_limit: 20,    p_source_universal_chain_id: "union.union-testnet-10"  }) {    sender_canonical    receiver_canonical    base_amount    sort_order  }}

### [Example: Combine with Pagination](#example-combine-with-pagination)

You can combine filters with pagination parameters (`sort_order`, `comparison`) to paginate within a filtered result set.

    query FilterAndPaginate {  v2_transfers(args: {    p_limit: 20,    p_source_universal_chain_id: "union.union-testnet-10",    p_sort_order: "cursor-from-last-item",    p_comparison: "lt"  }) {    sender_canonical    receiver_canonical    base_amount    sort_order  }}

### [Notes](#notes-1)

*   Only parameters defined in the function signature can be used for filtering.
*   GraphQL-level filters (e.g., `where: { ... }`) are ignored at the source level and **should not be used**.

[Rate Limits](#rate-limits)
---------------------------

Rate limits are dynamically applied depending on traffic and abuse detection. If you require increased privilege to datasets and waived rate limits, contact us [here](mailto:cor@union.build)

[Next Steps](#next-steps)
-------------------------

Go to the [explorer](https://cloud.hasura.io/public/graphiql?endpoint=https://graphql.union.build/v1/graphql) and check out all data available. These endpoints can be used for data analytics, scraping, or used in frontends for rapid app development.
