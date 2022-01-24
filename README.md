# jest-json-schema

[![npm version](https://badge.fury.io/js/jest-json-schema.svg)](https://badge.fury.io/js/jest-json-schema)
[![Build Status](https://travis-ci.org/americanexpress/jest-json-schema.svg?branch=master)](https://travis-ci.org/americanexpress/jest-json-schema)
[![Mentioned in Awesome Jest](https://awesome.re/mentioned-badge.svg)](https://github.com/jest-community/awesome-jest)

> JSON schema matcher for [jest](https://www.npmjs.com/package/jest)

> Want to get paid for your contributions to `jest-json-schema`?
> Send your resume to oneamex.careers@aexp.com

## Matchers included

### `toMatchSchema(schema)`

Validates that an object matches the given [JSON schema](http://json-schema.org/)

```js
it('validates my json', () => {
  const schema = {
    properties: {
      hello: { type: 'string' },
    },
    required: ['hello'],
  };
  expect({ hello: 'world' }).toMatchSchema(schema);
});
```

## Installation

```bash
$ npm install --save-dev jest-json-schema
```

## Usage

In any test file:

```js
import { matchers } from 'jest-json-schema';
expect.extend(matchers);
```

Or if you want it available for all test files then set it up the same way in a
[test framework script file](http://facebook.github.io/jest/docs/configuration.html#setuptestframeworkscriptfile-string)

You can pass [Ajv options](https://ajv.js.org/options.html) using
`matchersWithOptions` and passing it your options object. The only option passed
by default is `allErrors: true`.

```js
import { matchersWithOptions } from 'jest-json-schema';

const formats = {
  bcp47: /^[a-z]{2}-[A-Z]{2}$/,
}

expect.extend(matchersWithOptions({ formats }));
```

Additionally you can also use a callback to further configure and extend
the Ajv instance used by the matchers:

```js
import ajvKeywords from 'ajv-keywords';
import { matchersWithOptions } from 'jest-json-schema';

const formats = {
  bcp47: /^[a-z]{2}-[A-Z]{2}$/,
}

expect.extend(matchersWithOptions({ formats }, (ajv) => {
  // This uses the `ajv-keywords` library to add pre-made
  // custom keywords to the Ajv instance.
  ajvKeywords(ajv, ['typeof', 'instanceof']);
}));
```

You can also customize the `Ajv` class with the `AjvClass` option:

```js
import Ajv2020 from 'ajv/dist/2020'
import { matchersWithOptions } from 'jest-json-schema';

expect.extend(matchersWithOptions({ AjvClass: Ajv2020 }));
```

### Verbose errors

Ajv supports a verbose option flag which enables more information about individual
errors. This extra information can mean that we can output to Jest more meaningful
errors that can help the development process:

```js
const { matchersWithOptions } = require('jest-json-schema');

expect.extend(matchersWithOptions({
  verbose: true
}));

test('check that property errors are outputted', () => {
  const schema = {
    $id: 'testSchema',
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
    expect(invalidData).toMatchSchema(schema)
  }).toThrowErrorMatchingInlineSnapshot(`
"expect(received).toMatchSchema(schema)

Received:
  .name should be string
    Received: <null>
    Path: testSchema#/properties/name/type
  .dob should match format \\"date\\"
    Received: <string> 02-29-2000
    Path: testSchema#/properties/dob/format
"
`);
});
```

### Example using multiple schema files

If you organise your schemas into separate files and use refs which point to the
various different schemas, it will be important to include those dependent
schema files when extending Jest's `expect` handler, using the `matchersWithOptions`
interface:

#### schemaA.json

```json
{
  "$id": "schemaA",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "description": "Example of a definition schema.",
  "definitions": {
    "testA": {
      "type": "number",
      "const": 1
    },
    "testB": {
      "type": ["null", "string"]
    }
  }
}
```

#### schemaB.json

```json
{
  "$id": "schemaB",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "description": "Example of a schema that references another schema.",
  "$ref": "schemaA#/definitions/testB"
}
```

#### schemaA.test.js

```js
const { matchersWithOptions } = require('jest-json-schema');

// Local schema files are imported like normal. If you use TypeScript you
// will need to ensure `--resolveJsonModule` is enabled.
const schemaA = require('./schemaA.json');
const schemaB = require('./schemaB.json');

expect.extend(matchersWithOptions({
  // Loading in a schema which is comprised only of definitions,
  // which means specific test schemas need to be created.
  // This is good for testing specific conditions for definition schemas.
  schemas: [schemaA]
});

test('schemaA is valid', () => {
  expect(schemaA).toBeValidSchema();
});

test('using schemaA to build a test schema to test a specific definition', () => {
  // This is a test schema which references a definition in one of the
  // pre-loaded schemas. This can allow us to write tests for specific
  // definitions.
  const testSchema = {
    $ref: 'schemaA#/definitions/testA'
  };

  expect(testSchema).toBeValidSchema();

  // Valid
  expect(1).toMatchSchema(testSchema);

  // This example runs through a number of values that we know don't match
  // the schema, ensuring that any future changes to the schema will require
  // the test to be updated.
  ['1', true, false, null, [], {}].forEach(value => {
     expect(value).not.toMatchSchema(testSchema);
  });
});

test('using schemaB which already references a definition in schemaA', () => {
  expect(schemaB).toBeValidSchema();

  // Valid
  ['', '1', null].forEach(value => {
    expect(value).toMatchSchema(schemaB);
  });

  // Invalid
  ['1', true, false, [], {}].forEach(value => {
     expect(value).not.toMatchSchema(schemaB);
  });
});
```
## TypeScript support

If you would like to use `jest-json-schema` library in your TypeScript project, remember to install type definitions from `@types/jest-json-schema` package.

```
npm install --save-dev @types/jest-json-schema
```

Or if `yarn` is your package manager of choice:

```
yarn add @types/jest-json-schema --dev
```

## Contributing

We welcome Your interest in the American Express Open Source Community on Github.
Any Contributor to any Open Source Project managed by the American Express Open
Source Community must accept and sign an Agreement indicating agreement to the
terms below. Except for the rights granted in this Agreement to American Express
and to recipients of software distributed by American Express, You reserve all
right, title, and interest, if any, in and to Your Contributions. Please [fill
out the Agreement](https://cla-assistant.io/americanexpress/).

Please feel free to open pull requests and see [CONTRIBUTING.md](./CONTRIBUTING.md) to learn how to get started contributing.

## License

Any contributions made under this project will be governed by the [Apache License
 2.0](https://github.com/americanexpress/jest-json-schema/blob/master/LICENSE.txt).

## Code of Conduct

This project adheres to the [American Express Community Guidelines](https://github.com/americanexpress/jest-json-schema/wiki/Code-of-Conduct).
By participating, you are expected to honor these guidelines.
