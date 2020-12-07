// @flow

import React from "react";
import ace from "ace-builds";
import AceEditor from "react-ace";
import { createUseStyles } from "react-jss";
import extendModes from "./extendModes";

extendModes(ace);

const useStyles = createUseStyles({
  yamlEditor: {
    "& .header": {
      "& a": { cursor: "pointer", marginLeft: "1em", marginRight: "1em" },
      backgroundColor: "green",
      display: "inline-block",
      width: "100%",
      color: "white",
      padding: "0.5em",
      "& h3": {
        "font-size": "1.5em",
      },
    },
    "& .container": { padding: "0", ".ace_editor": { margin: "0" } },
    "& .editor": { overflow: "hidden" },
    "& .viewer": { overflow: "auto", textAlign: "left" },
    display: "inline-block",
    overflow: "hidden",
    border: "1px solid green",
  },
});

export default function YamlEditor({
  onChange,
  yaml,
  width,
  height,
  name,
}: {
  onChange?: (string) => any,
  yaml: string,
  width?: string,
  height?: string,
  name?: string,
}) {
  const classes = useStyles();
  return (
    <div className={classes.yamlEditor}>
      <div style={{ width: width ? width : "500px" }} className="header">
        <h3>{name}</h3>
      </div>
      <div className="container editor">
        <AceEditor
          mode={"yaml"}
          theme="github"
          onChange={(rawStr: string) => {
            if (onChange) onChange(rawStr);
          }}
          editorProps={{
            $blockScrolling: true,
          }}
          value={yaml}
          width={"100%"}
          height={height ? height : "500px"}
        />
      </div>
    </div>
  );
}
