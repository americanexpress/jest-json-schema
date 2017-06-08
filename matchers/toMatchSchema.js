const Ajv = require('ajv');
const chalk = require('chalk');
const { matcherHint } = require('jest-matcher-utils');

function buildToMatchSchema(ajvOptions) {
  return function toMatchSchema(received, schema, description) {
    const ajv = new Ajv(ajvOptions);
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
