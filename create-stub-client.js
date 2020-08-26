const {
  buildClientSchema,
  graphqlSync,
  buildSchema,
  getIntrospectionQuery,
} = require("graphql");
const { addMocksToSchema } = require("@graphql-tools/mock");

module.exports.createStubClient = (introspectionQuery) => {
  const schema = graphqlSync(
    buildSchema(introspectionQuery),
    getIntrospectionQuery()
  );

  const clientSchema = buildClientSchema(schema.data);

  const mockedSchema = addMocksToSchema({ schema: clientSchema });

  return ({ operation, variables }) =>
    graphqlSync({
      schema: mockedSchema,
      source: operation,
      variableValues: variables,
    });
};
