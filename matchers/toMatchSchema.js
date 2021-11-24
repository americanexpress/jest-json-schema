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

const chalk = require('chalk');
const { matcherHint } = require('jest-matcher-utils');

// Keywords where the `Expected: ...` output is hidden
const ERROR_KEYWORDS_HIDE_EXPECTED = [
  'type',
  // String
  'pattern',
  'format',
  'minLength',
  'maxLength',
  // Number
  'minimum',
  'maximum',
  'exclusiveMinimum',
  'exclusiveMaximum',
  'multipleOf',
  // Object
  'minProperties',
  'maxProperties',
  'required',
  // Array
  'minItems',
  'maxItems',
];

// Keywords where the `Received: ...` output is shown
const ERROR_KEYWORDS_SHOW_RECEIVED = [
  'if',
  'not',
];

const isObject = (input) => Object.prototype.toString.call(input) === '[object Object]';

const formatForPrint = (input, displayType = true) => {
  // Undefined and null are both a type and a value
  if (input === undefined || input === null) {
    return chalk.yellow(`<${input}>`);
  }

  // Empty string should be explicitly marked
  if (input === '') {
    return chalk.yellow('<empty string>');
  }

  // Array or object are stringified
  if (Array.isArray(input) || isObject(input)) {
    return (displayType
      ? chalk.yellow(Array.isArray(input)
        ? '<array> '
        : '<object> ')
      : '') + JSON.stringify(input);
  }

  // String, number or boolean always output their type.
  // This helps distinguish values that might look the same,
  // e.g. `<number> 1` and `<string> 1`
  return `${chalk.yellow(`<${typeof input}>`)} ${input}`;
};

function buildToMatchSchema(ajv) {
  const { verbose } = ajv.opts;

  return function toMatchSchema(received, schema, description) {
    const validate = ajv.compile(schema);
    const pass = validate(received);

    const message = pass
      ? () => {
        let messageToPrint = `${matcherHint('.not.toMatchSchema', undefined, 'schema')}\n\nExpected value not to match schema\n\n`;

        if (verbose) {
          messageToPrint += chalk.red(`received\n${formatForPrint(received)}\n`);
        }

        return messageToPrint;
      }
      : () => {
        let messageToPrint = `${description || 'received'}\n`;

        validate.errors.forEach((error) => {
          let line = error.message;

          if (error.keyword === 'additionalProperties') {
            line = `${error.message}, but found '${error.params.additionalProperty}'`;
          } else if (error.instancePath) {
            line = `${error.instancePath} ${error.message}`;
          }

          // console.log(error);

          if (verbose && error.schemaPath) {
            // Only output expected value if it is not already described in the error.message
            if (!ERROR_KEYWORDS_HIDE_EXPECTED.includes(error.keyword)) {
              switch (error.keyword) {
                // Display the then/else schema which triggered the error
                case 'if':
                  line += `\n    Expected: ${formatForPrint(error.parentSchema[error.params.failingKeyword], false)}`;
                  break;

                default:
                  line += `\n    Expected: ${formatForPrint(error.schema, false)}`;
                  break;
              }
            }

            // Show received value if there is a instancePath
            if (error.instancePath) {
              line += `\n    Received: ${formatForPrint(error.data)}`;

              // Otherwise show received output only for specific keywords
            } else if (ERROR_KEYWORDS_SHOW_RECEIVED.includes(error.keyword)) {
              line += `\n    Received: ${formatForPrint(error.data, false)}`;
            }

            line += `\n    Path:     ${validate.schema.$id || ''}${error.schemaPath}`;
          }

          messageToPrint += chalk.red(`  ${line}\n`);
        });

        return `${matcherHint('.toMatchSchema', undefined, 'schema')}\n\n${messageToPrint}`;
      };

    return {
      actual: received,
      message,
      name: 'toMatchSchema',
      pass,
    };
  };
}

module.exports = buildToMatchSchema;
