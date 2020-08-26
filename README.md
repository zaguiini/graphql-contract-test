# graphql-contract-test

This is an attempt to contract test GraphQL queries on a GraphQL gateway environment.

## Idea

Basically, the GraphQL gateway will dump a schema, which we saved, for this example, as `gateway_schema.graphql`.

We'll probably fetch this file from an introspection query to the endpoint directly or store it somewhere (e.g. S3) then pull it.

The idea is to create a stub GraphQL client which automatically mocks the resolvers as specified on `gateway_schema.graphql`.

This is the same approach as we take on unit and Cypress tests on Talent Portal.

The difference from our current Pact tests is that we're not anymore testing scenarios (e.g. user has the capability of doing something). This is ideal since Pact should only assert that, given an input, we can receive an output in the requested schema. Testing scenarios are the responsibilities of integration/E2E tests.

But the main goal of this POC is to prove that it's possible to have contract testing without tying it to a particular consumer language (e.g. TypeScript). We could dockerize this tool so it could run on basically every language, only giving the correct query files and variables.

## What exactly?

Imagine this schema:

```graphql
type Viewer {
  id: ID!
  name: String!
}

type Query {
  viewer: Viewer
}
```

We can test against the following query:

```graphql
query {
  viewer {
    email
  }
}
```

And it should not work, since `email` is not defined in the GraphQL schema. The same applies for mutations, its arguments and operation variables.

## How?

We're parsing this dumped schema and creating an introspection query from it. Then, from this query, we create a client schema. This allow us to create custom resolvers for each type.

After that, we add mocks as resolvers, so resolvers are added to the scalar types. Like:

```js
{
  ID: () => 'some-random-uuid',
  String: () => 'Hello, World',
}
```

And our client is done. We pass the desired operation (query or mutation) with the desired variables and execute this query against the mocked schema. The result could be either:

### data

Everything was processed correctly. Mind you that the resulting values are not important, as they are automatically generated.

### errors

Something went wrong while resolving the fields: either you requested unknown fields or passed the wrong arguments/variables. This is exactly what we want to test.

## How can I try it?

Install the dependencies with `yarn install` then run `node contract-test.js`

## I want more

There's a branch called `jest-test` which includes a more robust implementation, trying to mimic Pact testing as much as possible and introducing coverage. When you change to that branch, be sure to run `yarn install` again and, instead of running a node script, you can run `yarn test:contract` to fire Jest.
