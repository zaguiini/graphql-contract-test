const { readFileSync } = require("fs");
const glob = require("glob");
const gql = require("graphql-tag");
const get = require("lodash.get");

const { createStubClient } = require("./create-stub-client");

const variables = require("./test-variables.json");

// GraphQL file dumped from Gateway
const introspectionQuery = readFileSync("./gateway_schema.graphql").toString();

const stubClient = createStubClient(introspectionQuery);

glob("./queries/**/*.graphql", (err, files) => {
  if (err) {
    return console.log(err);
  }

  files
    .map((file) => readFileSync(file).toString())
    .forEach((operationString, fileIndex) => {
      const operationAST = gql(operationString);

      const operationName = get(
        operationAST,
        "definitions.0.name.value",
        files[fileIndex]
      );

      const { errors } = stubClient({
        operation: operationString,
        variables: variables[operationName],
      });

      if (!errors) {
        return console.log(`✔ ${operationName} matches the contract`);
      }

      console.log(`✘ ${operationName}`);

      errors.forEach((error) => {
        console.log(`-- ${error.message}`);
      });
    });
});
