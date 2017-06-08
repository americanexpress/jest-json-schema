const Ajv = require('ajv');
const chalk = require('chalk');
const { matcherHint } = require('jest-matcher-utils');

function buildToBeValidSchema(ajvOptions) {
  return function toBeValidSchema(received) {
    const ajv = new Ajv(ajvOptions);

    const pass = ajv.validateSchema(received);

    const message = pass
      ? () => `${matcherHint('.not.toBeValidSchema', 'received', '')}\n\nExpected input not to be a valid JSON schema`
      : () => {
        let messageToPrint = 'schema\n';
        ajv.errors.forEach((error) => {
          let line = error.message;

          if (error.dataPath) {
            line = `${error.dataPath} ${error.message}`;
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
