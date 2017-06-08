const merge = require('lodash/merge');
const chalk = require('chalk');
const buildToMatchSchema = require('./matchers/toMatchSchema');
const buildToBeValidSchema = require('./matchers/toBeValidSchema');

function matchersWithOptions(userOptions = {}) {
  const defaultOptions = {
    allErrors: true,
  };

  const options = merge(defaultOptions, userOptions);

  return {
    toMatchSchema: buildToMatchSchema(options),
    toBeValidSchema: buildToBeValidSchema(options),
  };
}

module.exports.matchers = matchersWithOptions();
module.exports.matchersWithFormats = (formats = {}) => {
  console.warn(chalk.yellow(
    'matchersWithFormats has been deprecated and will be removed in the next major version.\n' +
    'Please use matchersWithOptions instead.'
  ));
  return matchersWithOptions({ unknownFormats: true, formats });
};
module.exports.matchersWithOptions = matchersWithOptions;
