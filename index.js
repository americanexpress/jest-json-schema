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

const Ajv = require('ajv').default;
const addFormats = require('ajv-formats');
const buildToMatchSchema = require('./matchers/toMatchSchema');
const buildToBeValidSchema = require('./matchers/toBeValidSchema');

function matchersWithOptions(userOptions = {}, extendAjv) {
  const defaultOptions = {
    allErrors: true,
    strict: false,
    AjvClass: Ajv,
  };

  const options = Object.assign(defaultOptions, userOptions);
  const { AjvClass, ...ajvOptions } = options;
  const ajv = new AjvClass(ajvOptions);
  addFormats(ajv);
  if (typeof extendAjv === 'function') {
    extendAjv(ajv);
  }

  return {
    toMatchSchema: buildToMatchSchema(ajv),
    toBeValidSchema: buildToBeValidSchema(ajv),
  };
}

module.exports.matchers = matchersWithOptions();
module.exports.matchersWithOptions = matchersWithOptions;
