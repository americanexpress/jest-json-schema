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

const { matchers, matchersWithOptions } = require('..');

describe('index', () => {
  it('should export all the matchers from the matchers directory', () => {
    expect(matchers).toMatchSnapshot();
  });

  describe('matchersWithOptions', () => {
    it('should return all the matchers', () => {
      expect(matchersWithOptions()).toMatchSnapshot();
    });

    it('should fire extendAjv callback', () => {
      const callback = jest.fn();
      matchersWithOptions({}, callback);
      expect(callback).toHaveBeenCalled();
    });

    it('accepts a custom Ajv class', () => {
      const FakeAjvClass = jest.fn().mockImplementation(() => ({
        opts: { code: { formats: {} } },
        addFormat: jest.fn(),
        addKeyword: jest.fn(),
      }));
      matchersWithOptions({ AjvClass: FakeAjvClass });
      expect(FakeAjvClass).toHaveBeenCalled();
    });
  });
});
