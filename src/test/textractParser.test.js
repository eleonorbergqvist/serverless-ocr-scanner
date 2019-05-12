const textractParser = require('../textractParser');

test('that parsing does not fail on empty result', () => {
  let tree = textractParser.parseToBlockTree({
    "Blocks": [],
  });
  expect(tree.length).toBe(0);
});

