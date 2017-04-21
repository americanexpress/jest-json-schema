const { matchers, matchersWithFormats } = require('../index.js');

describe('index', () => {
  it('should export all the matchers from the matchers directory', () => {
    expect(matchers).toMatchSnapshot();
  });

  describe('matchersWithFormats', () => {
    it('should return all the matchers', () => {
      expect(matchersWithFormats()).toMatchSnapshot();
    });
  });
});
