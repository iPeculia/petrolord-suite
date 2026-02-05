/**
 * GraphQL API Service
 * Defines schema and handles queries/mutations for FDP data.
 */

export class GraphQLAPIService {
    static async executeQuery(query, variables = {}) {
        console.log(`[GraphQL] Executing query...`, query);
        await new Promise(resolve => setTimeout(resolve, 600)); // Simulate processing

        // Mock resolver logic based on query content
        if (query.includes('getField')) {
            return {
                data: {
                    field: {
                        id: variables.id || "f-123",
                        name: "Deepwater Alpha",
                        reserves: { p50: 500, unit: "MMbbl" }
                    }
                }
            };
        }
        
        if (query.includes('createWell')) {
            return {
                data: {
                    createWell: {
                        id: "w-new-" + Date.now(),
                        name: variables.input?.name || "New Well",
                        status: "Planned"
                    }
                }
            };
        }

        return { data: null, errors: [{ message: "Query not mocked" }] };
    }

    static getSchema() {
        return `
            type Field { id: ID!, name: String!, reserves: Float }
            type Well { id: ID!, name: String!, status: String }
            type Query {
                getField(id: ID!): Field
                getWell(id: ID!): Well
            }
            type Mutation {
                createWell(input: WellInput!): Well
            }
        `;
    }
}