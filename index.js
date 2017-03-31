const buildToMatchSchema = require('./matchers/toMatchSchema');

function matchersWithFormats(formats) {
  return {
    toMatchSchema: buildToMatchSchema(formats),
  };
}

module.exports.matchers = matchersWithFormats();
module.exports.matchersWithFormats = matchersWithFormats;
