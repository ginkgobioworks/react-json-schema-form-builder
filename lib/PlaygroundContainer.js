import React from "react";
import JsonSchemaFormEditor from "./JsonSchemaFormEditor";

class PlaygroundContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: ``,
      uischema: ``
    };
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "service-playground"
    }, /*#__PURE__*/React.createElement("div", {
      className: "playground-info"
    }, /*#__PURE__*/React.createElement("h1", null, this.props.title)), /*#__PURE__*/React.createElement(JsonSchemaFormEditor, {
      lang: "yaml",
      schema: this.state.schema,
      uischema: this.state.uischema,
      schemaTitle: "Data Schema",
      uischemaTitle: "UI Schema",
      onChange: (newSchema, newUiSchema) => {
        // could do operations with this
        this.setState({
          schema: newSchema,
          uischema: newUiSchema
        });
      },
      width: "95%",
      height: "800px"
    }));
  }

}

export default PlaygroundContainer;