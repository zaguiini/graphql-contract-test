const addUser = require("../addUser.graphql");
const Interaction = require("../../interaction");

describe("AddUser", () => {
  let interaction;

  beforeAll(() => {
    interaction = new Interaction().withQuery(addUser).withVariables({
      input: {
        name: "Ok bud",
        email: "testing@something.com",
      },
    });
  });

  it("matches the available fields", () => {
    expect(interaction).toMatchContract();
  });
});
