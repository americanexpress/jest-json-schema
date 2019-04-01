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

You can pass [Ajv options](http://epoberezkin.github.io/ajv/#options) using
`matchersWithOptions` and passing it your options object. The only option passed
by default is `allErrors: true`.

```js
import { matchersWithOptions } from 'jest-json-schema';

const formats = {
  bcp47: /^[a-z]{2}-[A-Z]{2}$/,
}

expect.extend(matchersWithOptions({ formats }));
```

## Contributing
We welcome Your interest in the American Express Open Source Community on Github.
Any Contributor to any Open Source Project managed by the American Express Open
Source Community must accept and sign an Agreement indicating agreement to the
terms below. Except for the rights granted in this Agreement to American Express
and to recipients of software distributed by American Express, You reserve all
right, title, and interest, if any, in and to Your Contributions. Please [fill
out the Agreement](https://cla-assistant.io/americanexpress/).

## License
Any contributions made under this project will be governed by the [Apache License
 2.0](https://github.com/americanexpress/jest-json-schema/blob/master/LICENSE.txt).

## Code of Conduct
This project adheres to the [American Express Community Guidelines](https://github.com/americanexpress/jest-json-schema/wiki/Code-of-Conduct).
By participating, you are expected to honor these guidelines.
