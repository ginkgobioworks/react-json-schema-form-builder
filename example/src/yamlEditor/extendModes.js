/*
Adapted from the ace yaml mode file in ace/mode/yaml
https://github.com/ajaxorg/ace/blob/master/lib/ace/mode/yaml.js
*/

export default (ace) => {
  ace.define(
    "ace/mode/yaml",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/yaml_highlight_rules",
      "ace/mode/matching_brace_outdent",
      "ace/mode/folding/coffee",
    ],
    (require, exports) => {
      // disabling linting for file paths that won't show up to linter
      /* eslint-disable */
      const oop = require("../lib/oop");
      const TextMode = require("./text").Mode;
    }
  );

  ace.require("ace/mode/yaml");
};
