const merge = require('lodash/merge');
const buildToMatchSchema = require('./matchers/toMatchSchema');
const buildToBeValidSchema = require('./matchers/toBeValidSchema');

function matchersWithOptions(userOptions = {}) {
  const defaultOptions = {
    allErrors: true,
    unknownFormats: true,
  };

  const options = merge(defaultOptions, userOptions);

  return {
    toMatchSchema: buildToMatchSchema(options),
    toBeValidSchema: buildToBeValidSchema(options),
  };
}

module.exports.matchers = matchersWithOptions();
module.exports.matchersWithFormats = formats => matchersWithOptions({ formats });
module.exports.matchersWithOptions = matchersWithOptions;
