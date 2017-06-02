const buildToMatchSchema = require('./matchers/toMatchSchema');
const toBeValidSchema = require('./matchers/toBeValidSchema');

function matchersWithFormats(formats) {
  return {
    toMatchSchema: buildToMatchSchema(formats),
    toBeValidSchema,
  };
}

module.exports.matchers = matchersWithFormats();
module.exports.matchersWithFormats = matchersWithFormats;
