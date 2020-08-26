module.exports = {
  process(fileData) {
    return `module.exports = \`${fileData}\``;
  },
};
