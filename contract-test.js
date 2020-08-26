const { readFileSync } = require("fs");
const glob = require("glob");
const gql = require("graphql-tag");
const { basename } = require("path");
const { createStubClient } = require("./create-stub-client");

// GraphQL file dumped from Gateway
const introspectionQuery = readFileSync("./gateway_schema.graphql").toString();

const stubClient = createStubClient(introspectionQuery);

const variables = {
  AddUser: {
    input: {},
  },
};

glob("./queries/**/*.graphql", (err, files) => {
  if (err) {
    return console.log(err);
  }

  files
    .map((file) => readFileSync(file).toString())
    .forEach((operationString, fileIndex) => {
      const operationAST = gql(operationString);

      const operationName =
        operationAST.definitions[0] && operationAST.definitions[0].name
          ? operationAST.definitions[0].name.value
          : files[fileIndex];

      const { errors } = stubClient({
        operation: operationString,
        variables: variables[operationName],
      });

      if (!errors) {
        return console.log(`✔ ${operationName} matches`);
      }

      console.log(`✘ ${operationName}`);

      errors.forEach((error) => {
        console.log(`-- ${error.message}`);
      });
    });
});
