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

const toMatchSchema = require('./matchers/toMatchSchema');
const toBeValidSchema = require('./matchers/toBeValidSchema');

function matchersWithOptions(userOptions = {}) {
  return {
    toMatchSchema: (received, schema) => toMatchSchema(received, schema, userOptions),
    toBeValidSchema: received => toBeValidSchema(received, userOptions),
  };
}

module.exports.matchers = matchersWithOptions();
module.exports.matchersWithOptions = matchersWithOptions;
