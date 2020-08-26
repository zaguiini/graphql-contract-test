const { readFileSync } = require("fs");
const { createStubClient } = require("./create-stub-client");

// GraphQL file dumped from Gateway
const introspectionQuery = readFileSync("./gateway_schema.graphql").toString();

class Interaction {
  constructor() {
    this.client = createStubClient(introspectionQuery);
  }

  withQuery(query) {
    this.query = query;

    return this;
  }

  withVariables(variables) {
    this.variables = variables;

    return this;
  }

  run() {
    const { errors } = this.client({
      operation: this.query,
      variables: this.variables,
    });

    if (errors) {
      throw errors[0];
    }
  }
}

module.exports = Interaction;
