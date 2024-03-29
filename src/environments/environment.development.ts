export const environment = {
    production: false,
    graphqlUri: process.env['GRAPHQL_URI'] || 'http://localhost:8000/graphql'
};