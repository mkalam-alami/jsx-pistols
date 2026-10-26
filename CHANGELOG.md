# Changelog

## 0.6.0 (unreleased)

* Upgrade all dependencies to their latest major versions (Babel 8, Preact 11, preact-render-to-string 6, minimatch 10, TypeScript 7)
* **Breaking:** Node.js `^22.18.0 || >=24.11.0` is now required (Babel 8 and Preact 11 are ESM-only and loaded through `require()`)
* **Breaking:** Default Babel options now use `ignoreExtensions` for `@babel/preset-typescript` and the explicit `classic` runtime for `@babel/plugin-transform-react-jsx`; custom Babel options must follow the Babel 8 option format

## 0.5.1 (October 30, 2020)

* Remove unnecessary files from build

## 0.5.0 (October 30, 2020)

* Use native require() in production
* Drop caching capabilities in transpile mode, only advertise it for development
* Expose express engine function
* Drop fs-extra dependency
* Upgrade all dependencies

## 0.4.0 (August 13, 2020)

* Invalidate require cache for imported templates in dev mode
* Drop support for wrapper tags (templates should use fragments instead)

## 0.3.2 (July 21, 2020)

* Downgrade fs-extra to 8.1.0 for better Node compatibility

## 0.3.1 (July 19, 2020)

* Support wrapper tags that will be discarded from the output
* Upgrade all dependencies

## 0.2.0 (June 29, 2020)

* Prepend "\<!doctype html>" to "\<html>" tags by default
* Support compiled .js templates
* Allow disabling Babel transpiler
* Fix templates not being found if an incomplete filename containing a dot is passed
* Minor optimizations

## 0.1.1 (June 29, 2020)

* Add TSDoc comments
* Expand Readme documentation

## 0.1.0 (June 28, 2020)

* Make Babel options customizable
* Rewrite Express integration
* Fix crash when using relative imports in templates

## 0.0.2 (June 27, 2020)

* Make preact an explicit dependency

## 0.0.1 (June 27, 2020)

* Initial release