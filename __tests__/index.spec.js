const { matchers, matchersWithFormats, matchersWithOptions } = require('../index.js');

describe('index', () => {
  it('should export all the matchers from the matchers directory', () => {
    expect(matchers).toMatchSnapshot();
  });

  describe('matchersWithFormats', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');

    beforeEach(() => consoleWarnSpy.mockClear());

    it('should return all the matchers', () => {
      expect(matchersWithFormats()).toMatchSnapshot();
    });

    it('should warn that the method is deprecated', () => {
      matchersWithFormats();
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });

  describe('matchersWithOptions', () => {
    it('should return all the matchers', () => {
      expect(matchersWithOptions()).toMatchSnapshot();
    });
  });
});
