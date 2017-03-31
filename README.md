# jest-ajv

> JSON schema matcher for [jest](https://www.npmjs.com/package/jest) using
[ajv](https://www.npmjs.com/package/ajv)

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

```
npm install --save-dev jest-ajv
```

## Usage

In any test file:

```js
import { matchers } from 'jest-ajv';
expect.extend(matchers);
```

Or if you want it available for all test files then set it up the same way in a
[test framework script file](http://facebook.github.io/jest/docs/configuration.html#setuptestframeworkscriptfile-string)

You can add custom formats for your schema validation by instead using
`matchersWithFormats`, and passing it your custom formats.

```js
import { matchersWithFormats } from 'jest-ajv';

const formats = {
  bcp47: /^[a-z]{2}-[A-Z]{2}$/,
}

expect.extend(matchersWithFormats(formats));
```

## Contributing
We welcome Your interest in the American Express Open Source Community on Github.
Any Contributor to any Open Source Project managed by the American Express Open
Source Community must accept and sign an Agreement indicating agreement to the
terms below. Except for the rights granted in this Agreement to American Express
and to recipients of software distributed by American Express, You reserve all
right, title, and interest, if any, in and to Your Contributions. Please [fill
out the Agreement](http://goo.gl/forms/mIHWH1Dcuy).

## License
Any contributions made under this project will be governed by the [Apache License
 2.0](https://github.com/americanexpress/jest-ajv/blob/master/LICENSE.txt).

## Code of Conduct
This project adheres to the [American Express Community Guidelines](https://github.com/americanexpress/jest-ajv/wiki/Code-of-Conduct).
By participating, you are expected to honor these guidelines.
