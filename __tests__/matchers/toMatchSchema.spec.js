/*
 * Copyright (c) 2017 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

const ajvKeywords = require('ajv-keywords');
const chalk = require('chalk');
const toMatchSchemaUnderTest = require('../..').matchers.toMatchSchema;
const toMatchSchemaWithFormatsUnderTest = require('../..').matchersWithOptions({
  formats: {
    bcp47: /^[a-z]{2}-[A-Z]{2}$/,
  },
}).toMatchSchema;
const toMatchSchemaWithOptionsUnderTest = require('../..').matchersWithOptions(
  {
    verbose: true,
  },
  (ajv) => {
    ajvKeywords(ajv, ['typeof', 'instanceof']);
  }
).toMatchSchema;

chalk.level = 0;

expect.extend({
  toMatchSchemaUnderTest,
  toMatchSchemaWithFormatsUnderTest,
  toMatchSchemaWithOptionsUnderTest,
});

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
    expect({ hello: 'world' }).toMatchSchemaUnderTest(schema);
    expect({ hello: 'a', world: 'b' }).toMatchSchemaUnderTest(schema);
    expect({}).not.toMatchSchemaUnderTest(schema);
    expect({ hello: 1 }).not.toMatchSchemaUnderTest(schema);
  });

  it('fails for wrong type', () => {
    const testObj = { hello: 1 };
    expect(() => expect(testObj).toMatchSchemaUnderTest(schema)).toThrowErrorMatchingSnapshot();
  });

  it('fails for missing required keys', () => {
    expect(() => expect({}).toMatchSchemaUnderTest(schema)).toThrowErrorMatchingSnapshot();
  });

  it('fails when pattern does not match', () => {
    schema.properties.hello.pattern = '[a-z]+';
    const testObj = { hello: '123' };
    expect(() => expect(testObj).toMatchSchemaUnderTest(schema)).toThrowErrorMatchingSnapshot();
  });

  it('fails when additional properties are found but forbidden', () => {
    schema.additionalProperties = false;
    const testObj = {
      hello: 'world',
      another: 'property',
    };
    expect(() => expect(testObj).toMatchSchemaUnderTest(schema)).toThrowErrorMatchingSnapshot();
  });

  it('includes the description in the error when provided', () => {
    const testObj = { hello: 1 };
    expect(() => expect(testObj).toMatchSchemaUnderTest(schema, 'en-US language pack')
    ).toThrowErrorMatchingSnapshot();
  });

  it('fails for matching schema when using .not', () => {
    const testObj = { hello: 'world' };
    expect(() => expect(testObj).not.toMatchSchemaUnderTest(schema)).toThrowErrorMatchingSnapshot();
  });

  it('does not crash on circular references', () => {
    const testObj = {};
    testObj.hello = testObj;
    expect(() => expect(testObj).toMatchSchemaUnderTest(schema)).toThrowErrorMatchingSnapshot();
  });

  it('assertion error matcherResult property contains matcher name and actual value', () => {
    schema.additionalProperties = false;
    const testObj = { another: 'property' };
    expect(() => expect(testObj).toMatchSchemaUnderTest(schema)).toThrow(
      expect.objectContaining({
        matcherResult: {
          actual: testObj,
          message: expect.any(Function),
          name: 'toMatchSchema',
          pass: false,
        },
      })
    );
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

      ['en-US', 'nl-NL', 'xx-XX'].forEach((locale) => {
        it(`it matches ${locale}`, () => {
          expect({ locale }).toMatchSchemaWithFormatsUnderTest(schema);
        });
      });

      ['en-us', 'EN-US', 'en_US', 'enus', '123'].forEach((locale) => {
        it(`it does not match ${locale}`, () => {
          expect(() => expect({ locale }).toMatchSchemaWithFormatsUnderTest(schema)
          ).toThrowErrorMatchingSnapshot();
        });
      });
    });
  });

  describe('custom keywords', () => {
    it('typeof', () => {
      expect('test').toMatchSchemaWithOptionsUnderTest({
        typeof: 'string',
      });

      // Check error is thrown by custom keyword
      expect(() => expect(false).toMatchSchemaWithOptionsUnderTest({
        typeof: 'string',
      })
      ).toThrowErrorMatchingSnapshot();
    });

    it('instanceof', () => {
      expect([]).toMatchSchemaWithOptionsUnderTest({
        instanceof: 'Array',
      });

      // Check error is thrown by custom keyword
      expect(() => expect(false).toMatchSchemaWithOptionsUnderTest({
        instanceof: 'Array',
      })
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe('output verbose errors', () => {
    it('should output an error with only the received input printed', () => {
      // Null
      expect(() => expect(null).not.toMatchSchemaWithOptionsUnderTest({
        type: 'null',
      })
      ).toThrowErrorMatchingSnapshot();

      // Boolean
      expect(() => expect(true).not.toMatchSchemaWithOptionsUnderTest({
        type: 'boolean',
      })
      ).toThrowErrorMatchingSnapshot();

      // Number
      expect(() => expect(1).not.toMatchSchemaWithOptionsUnderTest({
        type: 'number',
      })
      ).toThrowErrorMatchingSnapshot();

      // String
      expect(() => expect(
        'this is valid but expect().not.toMatchSchema has been used'
      ).not.toMatchSchemaWithOptionsUnderTest({
        type: 'string',
      })
      ).toThrowErrorMatchingSnapshot();

      // Object
      expect(() => expect({}).not.toMatchSchemaWithOptionsUnderTest({
        type: 'object',
      })
      ).toThrowErrorMatchingSnapshot();

      // Array
      expect(() => expect([
        'this is valid but expect().not.toMatchSchema has been used',
      ]).not.toMatchSchemaWithOptionsUnderTest({
        minItems: 1,
      })
      ).toThrowErrorMatchingSnapshot();
    });

    it('should display schema $id in the schema path', () => {
      expect(() => expect({
        test: '123',
      }).toMatchSchemaWithOptionsUnderTest({
        $id: 'testSchema',
        allOf: [
          {
            type: 'object',
            properties: {
              test: {
                type: 'number',
              },
            },
          },
        ],
      })
      ).toThrowErrorMatchingSnapshot();
    });

    it('should output error with details printed per errored property', () => {
      expect(() => expect({
        testType: false,
        testNotEmpty: '',
        testEnum: false,
        testConst: false,
        testFormat: 'test',
        testPattern: 'test',
        testItems: [false, 1],
        testNumber: 1,
        testIf: true,
        testElse: undefined,
        testThen: null,
      }).toMatchSchemaWithOptionsUnderTest({
        $schema: 'http://json-schema.org/draft-07/schema#',
        allOf: [
          {
            type: 'object',
            properties: {
              testType: {
                type: 'null',
              },
              testNotEmpty: {
                type: 'string',
                minLength: 1,
              },
              testEnum: {
                enum: [1, 2],
              },
              testConst: {
                const: true,
              },
              testFormat: {
                format: 'email',
              },
              testPattern: {
                pattern: '[0-9]+',
              },
              testItems: {
                items: {
                  const: true,
                },
                minItems: 5,
                maxItems: 1,
                uniqueItems: true,
                contains: {
                  const: true,
                },
              },
              testNumber: {
                multipleOf: 5,
                minimum: 999,
                maximum: 0,
                exclusiveMinimum: 999,
                exclusiveMaximum: 1,
              },
              testRequired: {
                type: 'string',
              },
            },
            propertyNames: {
              pattern: '^false',
            },
            minProperties: 999,
            maxProperties: 1,
            required: ['testRequired'],
          },
          {
            if: {
              type: 'object',
              properties: {
                testIf: {
                  const: true,
                },
              },
            },
            then: {
              type: 'object',
              properties: {
                testThen: {
                  const: true,
                },
              },
            },
            else: {
              type: 'object',
              properties: {
                testElse: {
                  const: true,
                },
              },
            },
          },
          {
            not: {
              type: 'object',
            },
          },
          {
            if: {
              type: 'object',
              properties: {
                testIf: {
                  const: false,
                },
              },
            },
            then: {
              type: 'object',
              properties: {
                testThen: {
                  const: true,
                },
              },
            },
            else: {
              type: 'object',
              properties: {
                testElse: {
                  const: true,
                },
              },
            },
          },
        ],
      })
      ).toThrowErrorMatchingSnapshot();
    });

    it('ensure verbose readme example is correct', () => {
      const testSchema = {
        $id: 'testVerboseReadmeSchema',
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          dob: {
            type: 'string',
            format: 'date',
          },
        },
      };

      const invalidData = {
        name: null,
        dob: '02-29-2000',
      };

      expect(() => {
        expect(invalidData).toMatchSchemaWithOptionsUnderTest(testSchema);
      }).toThrowErrorMatchingInlineSnapshot(`
"expect(received).toMatchSchema(schema)

received
  /name must be string
    Received: <null>
    Path:     testVerboseReadmeSchema#/properties/name/type
  /dob must match format \\"date\\"
    Received: <string> 02-29-2000
    Path:     testVerboseReadmeSchema#/properties/dob/format
"
`);
    });
  });
});
