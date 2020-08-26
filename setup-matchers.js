expect.extend({
  toMatchContract: (interaction) => {
    interaction.run();

    return {
      pass: true,
    };
  },
});
