import React from "react";
import ace from "ace-builds";
import AceEditor from "react-ace";
import { createUseStyles } from "react-jss";
import extendModes from "./extendModes";
extendModes(ace);
const useStyles = createUseStyles({
  yamlEditor: {
    "& .header": {
      "& a": {
        cursor: "pointer",
        marginLeft: "1em",
        marginRight: "1em"
      },
      backgroundColor: "green",
      display: "inline-block",
      width: "100%",
      color: "white",
      padding: "0.5em",
      "& h3": {
        "font-size": "1.5em"
      }
    },
    "& .container": {
      padding: "0",
      ".ace_editor": {
        margin: "0"
      }
    },
    "& .editor": {
      overflow: "hidden"
    },
    "& .viewer": {
      overflow: "auto",
      textAlign: "left"
    },
    display: "inline-block",
    overflow: "hidden",
    border: "1px solid green"
  }
});
export default function YamlEditor({
  onChange,
  yaml,
  width,
  height,
  name
}) {
  const classes = useStyles();
  return /*#__PURE__*/React.createElement("div", {
    className: classes.yamlEditor
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: width ? width : "500px"
    },
    className: "header"
  }, /*#__PURE__*/React.createElement("h3", null, name)), /*#__PURE__*/React.createElement("div", {
    className: "container editor"
  }, /*#__PURE__*/React.createElement(AceEditor, {
    mode: "yaml",
    theme: "github",
    onChange: rawStr => {
      if (onChange) onChange(rawStr);
    },
    editorProps: {
      $blockScrolling: true
    },
    value: yaml,
    width: "100%",
    height: height ? height : "500px"
  })));
}