const toBeValidSchemaUnderTest = require('../../index').matchers.toBeValidSchema;

expect.extend({
  toBeValidSchemaUnderTest,
});

describe('toBeValidSchema', () => {
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
    expect(schema).toBeValidSchemaUnderTest();
  });

  it('fails schemas with invalid properties', () => {
    schema.properties = [];
    expect(() => expect(schema).toBeValidSchemaUnderTest())
      .toThrowErrorMatchingSnapshot();
  });

  it('fails schemas of invalid types', () => {
    expect(() => expect('schema').toBeValidSchemaUnderTest())
      .toThrowErrorMatchingSnapshot();
  });

  it('fails for valid schema when using .not', () => {
    expect(() => expect(schema).not.toBeValidSchemaUnderTest())
      .toThrowErrorMatchingSnapshot();
  });

  it('assertion error matcherResult property contains matcher name and actual value', () => {
    schema.properties = [];
    try {
      expect(schema).toBeValidSchemaUnderTest();
    } catch (error) {
      expect(error.matcherResult).toEqual({
        actual: schema,
        message: expect.any(Function),
        name: 'toBeValidSchema',
        pass: false,
      });
    }
  });
});
