import React from "react";
import { Alert, Modal, ModalHeader, Button, ModalBody, ModalFooter } from "reactstrap";
import { safeLoad as yamlParse, safeDump as yamlStringify } from "js-yaml"; //import Form from "react-jsonschema-form";

import Form from "@rjsf/material-ui"; //import Form from "@rjsf/bootstrap-4";

import Tabs from "./tabs/Tabs";
import YamlEditor from "./yamlEditor/YamlEditor";
import ErrorBoundary from "./ErrorBoundary";
import FormBuilder from "./formBuilder/FormBuilder";
import PreDefinedGallery from "./formBuilder/PreDefinedGallery";

// parse in either YAML or JSON
function parseForJsonSchemaForm(text, language) {
  if (!text || text === "null") return {};
  return language === "yaml" ? yamlParse(text) : JSON.parse(text);
} // stringify in either YAML or JSON


function stringify(obj, language) {
  if (!obj) return "";
  return language === "yaml" ? yamlStringify(obj, {
    skipInvalid: true
  }) : JSON.stringify(obj, null, 5);
} // return error message for parsing or blank if no error


function checkError(text, language) {
  let data;

  try {
    data = parseForJsonSchemaForm(text, language);
  } catch (e) {
    return e.toString();
  }

  if (typeof data === "string") {
    return "Received a string instead of object.";
  }

  return "";
} // generalized editor, either json or yaml


const LangEditor = parameters => {
  return /*#__PURE__*/React.createElement(YamlEditor, {
    name: parameters.name,
    width: "400px",
    height: "400px",
    onChange: parameters.onChange,
    yaml: parameters.value,
    readOnly: parameters.readOnly
  });
};

class JsonSchemaFormEditor extends React.Component {
  constructor(props) {
    super(props); // assign initial values

    this.state = {
      formData: {},
      formToggle: true,
      outputToggle: false,
      schemaFormErrorFlag: "",
      validFormInput: false,
      editorWidth: 700,
      submissionData: {}
    };
  } // update state schema and indicate parsing errors


  updateSchema(text) {
    // update parent
    if (this.props.onChange) this.props.onChange(text, this.props.uischema);
  } // update state ui schema and indicate parsing errors


  updateUISchema(text) {
    // update parent
    if (this.props.onChange) this.props.onChange(this.props.schema, text);
  } // update the internal form data state


  updateFormData(text) {
    try {
      const data = parseForJsonSchemaForm(text, this.props.lang);
      this.setState({
        formData: data,
        schemaFormErrorFlag: ""
      });
    } catch (err) {
      this.setState({
        schemaFormErrorFlag: err.toString()
      });
    }
  }

  render() {
    const schemaError = checkError(this.props.schema, this.props.lang);
    const schemaUiError = checkError(this.props.uischema, this.props.lang);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: this.props.width ? this.props.width : "100%",
        height: this.props.height ? this.props.height : "500px"
      },
      className: "playground-main"
    }, /*#__PURE__*/React.createElement(Alert, {
      style: {
        display: schemaError === "" ? "none" : "block"
      },
      color: "danger"
    }, /*#__PURE__*/React.createElement("h5", null, "Schema:"), " ", schemaError), /*#__PURE__*/React.createElement(Alert, {
      style: {
        display: schemaUiError === "" ? "none" : "block"
      },
      color: "danger"
    }, /*#__PURE__*/React.createElement("h5", null, "UI Schema:"), " ", schemaUiError), /*#__PURE__*/React.createElement(Alert, {
      style: {
        display: this.state.schemaFormErrorFlag === "" ? "none" : "block"
      },
      color: "danger"
    }, /*#__PURE__*/React.createElement("h5", null, "Form:"), " ", this.state.schemaFormErrorFlag), /*#__PURE__*/React.createElement(Tabs, {
      tabs: [{
        name: "Visual Form Builder",
        id: "form-builder",
        content: /*#__PURE__*/React.createElement("div", {
          className: "tab-pane",
          style: {
            height: this.props.height ? this.props.height : "500px"
          }
        }, /*#__PURE__*/React.createElement(ErrorBoundary, {
          onErr: () => {}
        }, /*#__PURE__*/React.createElement(FormBuilder, {
          schema: this.props.schema,
          uischema: this.props.uischema,
          onChange: (newSchema, newUiSchema) => {
            if (this.props.onChange) this.props.onChange(newSchema, newUiSchema);
          },
          lang: this.props.lang
        })))
      }, {
        name: "Preview Form",
        id: "preview-form",
        content: /*#__PURE__*/React.createElement("div", {
          className: "tab-pane",
          style: {
            height: this.props.height ? this.props.height : "500px"
          }
        }, /*#__PURE__*/React.createElement(ErrorBoundary, {
          onErr: err => {
            this.setState({
              schemaFormErrorFlag: err
            });
          },
          errMessage: "Error parsing JSON Schema"
        }, /*#__PURE__*/React.createElement(Form, {
          schema: schemaError === "" ? parseForJsonSchemaForm(this.props.schema, this.props.lang) : {},
          uiSchema: schemaUiError === "" ? parseForJsonSchemaForm(this.props.uischema, this.props.lang) : {},
          onChange: formData => this.updateFormData(JSON.stringify(formData.formData)),
          formData: this.state.formData,
          submitButtonMessage: "Submit",
          onSubmit: submissionData => {
            // below only runs if validation succeeded
            this.setState({
              validFormInput: true,
              outputToggle: true,
              submissionData
            });
          }
        })), /*#__PURE__*/React.createElement(Modal, {
          isOpen: this.state.outputToggle
        }, /*#__PURE__*/React.createElement(ModalHeader, null, "Form output preview"), /*#__PURE__*/React.createElement(ModalBody, null, /*#__PURE__*/React.createElement("div", {
          className: "editor-container"
        }, /*#__PURE__*/React.createElement(ErrorBoundary, {
          onErr: () => {},
          errMessage: "Error parsing JSON Schema Form output"
        }, LangEditor({
          name: "Output Data",
          onChange: () => {},
          lang: this.props.lang,
          value: stringify(this.state.submissionData, "json"),
          readOnly: true
        })), /*#__PURE__*/React.createElement("br", null))), /*#__PURE__*/React.createElement(ModalFooter, null, /*#__PURE__*/React.createElement(Button, {
          onClick: () => {
            this.setState({
              outputToggle: false
            });
          },
          color: "secondary"
        }, "Close"))))
      }, {
        name: "Edit Schema",
        id: "editors",
        content: /*#__PURE__*/React.createElement("div", {
          className: "tab-pane",
          style: {
            height: this.props.height ? this.props.height : "500px",
            display: "flex",
            "flex-direction": "row"
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            margin: "1em"
          },
          className: "editor-container"
        }, /*#__PURE__*/React.createElement(ErrorBoundary, {
          onErr: err => {
            // if rendering initial value causes a crash
            // eslint-disable-next-line no-console
            console.error(err);
            this.updateSchema("{}");
          },
          errMessage: "Error parsing JSON Schema input"
        }, LangEditor({
          name: "Data Schema",
          onChange: data => this.updateSchema(data),
          lang: this.props.lang,
          value: this.props.schema
        })), /*#__PURE__*/React.createElement("br", null)), /*#__PURE__*/React.createElement("div", {
          style: {
            margin: "1em"
          },
          className: "editor-container"
        }, /*#__PURE__*/React.createElement(ErrorBoundary, {
          onErr: err => {
            // if rendering initial value causes a crash
            // eslint-disable-next-line no-console
            console.error(err);
            this.updateUISchema("{}");
          },
          errMessage: "Error parsing JSON UI Schema input"
        }, LangEditor({
          name: "UI Schema",
          onChange: data => this.updateUISchema(data),
          lang: this.props.lang,
          value: this.props.uischema
        }))))
      }, {
        name: "Pre-Configured Components",
        id: "pre-configured",
        content: /*#__PURE__*/React.createElement("div", {
          className: "tab-pane",
          style: {
            height: this.props.height ? this.props.height : "500px"
          }
        }, /*#__PURE__*/React.createElement(ErrorBoundary, {
          onErr: () => {}
        }, /*#__PURE__*/React.createElement(PreDefinedGallery, {
          schema: this.props.schema,
          uischema: this.props.uischema,
          onChange: (newSchema, newUiSchema) => {
            if (this.props.onChange) this.props.onChange(newSchema, newUiSchema);
          },
          lang: this.props.lang
        })))
      }],
      preventRerender: true
    }));
  }

}

export default JsonSchemaFormEditor;