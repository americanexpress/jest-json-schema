# [6.1.0](https://github.com/americanexpress/jest-json-schema/compare/v6.0.0...v6.1.0) (2022-01-24)


### Features

* **index:** add AjvClass option ([#44](https://github.com/americanexpress/jest-json-schema/issues/44)) ([e79d088](https://github.com/americanexpress/jest-json-schema/commit/e79d08844a453c5b2d394007f190302d9e613af0))

# [6.0.0](https://github.com/americanexpress/jest-json-schema/compare/v5.0.0...v6.0.0) (2021-11-24)


### Features

* **ajv:** update ajv to 8 ([5145fe6](https://github.com/americanexpress/jest-json-schema/commit/5145fe697639750e8bac51a8adf1972b3cae815a))


### BREAKING CHANGES

* **ajv:** AJV API schema has changed

* test(toMatchSchema): fixed issue with inline snapshot/prettiers changes

# [5.0.0](https://github.com/americanexpress/jest-json-schema/compare/v4.0.0...v5.0.0) (2021-01-19)


### chore

* **main:** remove the deprecated function matchersWithFormats ([#23](https://github.com/americanexpress/jest-json-schema/issues/23)) ([94f8ce1](https://github.com/americanexpress/jest-json-schema/commit/94f8ce174d0f20e4d66e8bdc520c56eab35b8141))


### BREAKING CHANGES

* **main:** matchersWithFormats is no longer available. Use matchersWithOptions instead.

Co-authored-by: Nelly Kiboi <nelly.j.kiboi@aexp.com>

# [4.0.0](https://github.com/americanexpress/jest-json-schema/compare/v3.0.0...v4.0.0) (2021-01-19)


* Require Node.js 12 and upgrade jest-matcher-utils to version 26 (#22) ([de9363c](https://github.com/americanexpress/jest-json-schema/commit/de9363c13aad2258cfe104f2413de7cf354b0433)), closes [#22](https://github.com/americanexpress/jest-json-schema/issues/22)


### BREAKING CHANGES

* drops support for Node.js < 12.13 and non-lts versions

* chore(deps): update jest-matcher-utils to v26 and chalk to v4

Co-authored-by: Nelly Kiboi <nelly.j.kiboi@aexp.com>

# [3.0.0](https://github.com/americanexpress/jest-json-schema/compare/v2.1.0...v3.0.0) (2021-01-08)


### chore

* **travis:** remove node 6 from travis config ([0422dfe](https://github.com/americanexpress/jest-json-schema/commit/0422dfe7e0f587d2dfc365667f7a384127d8b75f))


### BREAKING CHANGES

* **travis:** drop support for node 6
