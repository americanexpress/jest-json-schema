const toMatchSchema = require('../../matchers/toMatchSchema');

expect.extend({ toMatchSchema });

describe('toMatchSchema', () => {
  let schema;

  beforeEach(() => {
    schema = {
      properties: {
        hello: { type: 'string' },
      },
      required: ['hello'],
    };
  });

  it('does not throw', () => {
    expect({ hello: 'world' }).toMatchSchema(schema);
    expect({ hello: 'a', world: 'b' }).toMatchSchema(schema);
    expect({}).not.toMatchSchema(schema);
    expect({ hello: 1 }).not.toMatchSchema(schema);
  });

  it('fails for wrong type', () => {
    const testObj = { hello: 1 };
    expect(() => expect(testObj).toMatchSchema(schema))
      .toThrowErrorMatchingSnapshot();
  });

  it('fails for missing required keys', () => {
    expect(() => expect({}).toMatchSchema(schema))
      .toThrowErrorMatchingSnapshot();
  });

  it('fails when pattern does not match', () => {
    schema.properties.hello.pattern = '[a-z]+';
    const testObj = { hello: '123' };
    expect(() => expect(testObj).toMatchSchema(schema))
      .toThrowErrorMatchingSnapshot();
  });

  it('fails when additional properties are found but forbidden', () => {
    schema.additionalProperties = false;
    const testObj = {
      hello: 'world',
      another: 'property',
    };
    expect(() => expect(testObj).toMatchSchema(schema))
      .toThrowErrorMatchingSnapshot();
  });

  it('includes the description in the error when provided', () => {
    const testObj = { hello: 1 };
    expect(() => expect(testObj).toMatchSchema(schema, 'en-US language pack'))
    .toThrowErrorMatchingSnapshot();
  });

  it('fails for matching schema when using .not', () => {
    const testObj = { hello: 'world' };
    expect(() => expect(testObj).not.toMatchSchema(schema))
      .toThrowErrorMatchingSnapshot();
  });

  it('does not crash on circular references', () => {
    const testObj = {};
    testObj.hello = testObj;
    expect(() => expect(testObj).toMatchSchema(schema))
      .toThrowErrorMatchingSnapshot();
  });

  it('assertion error matcherResult property contains matcher name and actual value', () => {
    schema.additionalProperties = false;
    const testObj = { another: 'property' };
    try {
      expect(testObj).toMatchSchema(schema);
    } catch (error) {
      expect(error.matcherResult).toEqual({
        actual: testObj,
        message: expect.any(Function),
        name: 'toMatchSchema',
        pass: false,
      });
    }
  });

  describe('custom formats', () => {
    describe('bcp47', () => {
      beforeEach(() => {
        schema = {
          properties: {
            locale: { type: 'string', format: 'bcp47' },
          },
        };
      });

      [
        'en-US',
        'nl-NL',
        'xx-XX',
      ].forEach((locale) => {
        it(`it matches ${locale}`, () => {
          expect({ locale }).toMatchSchema(schema);
        });
      });

      [
        'en-us',
        'EN-US',
        'en_US',
        'enus',
        '123',
      ].forEach((locale) => {
        it(`it does not match ${locale}`, () => {
          expect(() => expect({ locale }).toMatchSchema(schema))
            .toThrowErrorMatchingSnapshot();
        });
      });
    });
  });
});
