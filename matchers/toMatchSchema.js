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

const Ajv = require('ajv');
const chalk = require('chalk');
const { matcherHint } = require('jest-matcher-utils');

function buildToMatchSchema(ajvOptions, afterAjvInitialized) {
  const ajv = new Ajv(ajvOptions);

  if (afterAjvInitialized) {
    afterAjvInitialized(ajv);
  }

  return function toMatchSchema(received, schema, description) {
    const validate = ajv.compile(schema);
    const pass = validate(received);

    const message = pass
      ? () => `${matcherHint('.not.toMatchSchema', undefined, 'schema')}\n\nExpected value not to match schema`
      : () => {
        let messageToPrint = `${description || 'received'}\n`;
        validate.errors.forEach((error) => {
          let line = error.message;

          if (error.keyword === 'additionalProperties') {
            line = `${error.message}, but found '${error.params.additionalProperty}'`;
          } else if (error.dataPath) {
            line = `${error.dataPath} ${error.message}`;
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
