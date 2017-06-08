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

const toMatchSchemaUnderTest = require('../../matchers/toMatchSchema')();
const toMatchSchemaWithFormatsUnderTest = require('../../matchers/toMatchSchema')({
  bcp47: /^[a-z]{2}-[A-Z]{2}$/,
});

expect.extend({
  toMatchSchemaUnderTest,
  toMatchSchemaWithFormatsUnderTest,
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
    expect(() => expect(testObj).toMatchSchemaUnderTest(schema))
      .toThrowErrorMatchingSnapshot();
  });

  it('fails for missing required keys', () => {
    expect(() => expect({}).toMatchSchemaUnderTest(schema))
      .toThrowErrorMatchingSnapshot();
  });

  it('fails when pattern does not match', () => {
    schema.properties.hello.pattern = '[a-z]+';
    const testObj = { hello: '123' };
    expect(() => expect(testObj).toMatchSchemaUnderTest(schema))
      .toThrowErrorMatchingSnapshot();
  });

  it('fails when additional properties are found but forbidden', () => {
    schema.additionalProperties = false;
    const testObj = {
      hello: 'world',
      another: 'property',
    };
    expect(() => expect(testObj).toMatchSchemaUnderTest(schema))
      .toThrowErrorMatchingSnapshot();
  });

  it('includes the description in the error when provided', () => {
    const testObj = { hello: 1 };
    expect(() => expect(testObj).toMatchSchemaUnderTest(schema, 'en-US language pack'))
    .toThrowErrorMatchingSnapshot();
  });

  it('fails for matching schema when using .not', () => {
    const testObj = { hello: 'world' };
    expect(() => expect(testObj).not.toMatchSchemaUnderTest(schema))
      .toThrowErrorMatchingSnapshot();
  });

  it('does not crash on circular references', () => {
    const testObj = {};
    testObj.hello = testObj;
    expect(() => expect(testObj).toMatchSchemaUnderTest(schema))
      .toThrowErrorMatchingSnapshot();
  });

  it('assertion error matcherResult property contains matcher name and actual value', () => {
    schema.additionalProperties = false;
    const testObj = { another: 'property' };
    try {
      expect(testObj).toMatchSchemaUnderTest(schema);
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
          expect({ locale }).toMatchSchemaWithFormatsUnderTest(schema);
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
          expect(() => expect({ locale }).toMatchSchemaWithFormatsUnderTest(schema))
            .toThrowErrorMatchingSnapshot();
        });
      });
    });
  });
});
