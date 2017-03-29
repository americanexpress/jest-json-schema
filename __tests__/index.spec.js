const matchers = require('../index.js');

describe('index', () => {
  it('should export all the matchers from the matchers directory', () => {
    expect(matchers).toMatchSnapshot();
  });
});
