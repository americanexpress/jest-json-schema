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

const toBeValidSchemaUnderTest = require('../../matchers/toBeValidSchema');

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
