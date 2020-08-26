const {
  buildClientSchema,
  graphqlSync,
  buildSchema,
  getIntrospectionQuery,
} = require("graphql");
const { addMocksToSchema } = require("@graphql-tools/mock");

module.exports.createStubClient = (graphqlFile) => {
  const introspection = graphqlSync(
    buildSchema(graphqlFile),
    getIntrospectionQuery()
  );

  const mockedSchema = addMocksToSchema({
    schema: buildClientSchema(introspection.data),
  });

  return ({ operation, variables }) =>
    graphqlSync({
      schema: mockedSchema,
      source: operation,
      variableValues: variables,
    });
};
