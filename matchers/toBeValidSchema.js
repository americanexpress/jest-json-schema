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

function buildToBeValidSchema(ajv) {
  return function toBeValidSchema(received) {
    const pass = ajv.validateSchema(received);

    const message = pass
      ? () => `${matcherHint('.not.toBeValidSchema', 'received', '')}\n\nExpected input not to be a valid JSON schema`
      : () => {
        let messageToPrint = 'schema\n';
        ajv.errors.forEach((error) => {
          let line = error.message;

          if (error.instancePath) {
            line = `${error.instancePath} ${error.message}`;
          }

          messageToPrint += chalk.red(`  ${line}\n`);
        });
        return `${matcherHint('.toBeValidSchema', 'schema', '')}\n\n${messageToPrint}`;
      };

    return {
      actual: received,
      message,
      name: 'toBeValidSchema',
      pass,
    };
  };
}

module.exports = buildToBeValidSchema;
