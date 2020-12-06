// @flow

import React from "react";
import {
  Alert,
  Modal,
  ModalHeader,
  Button,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { safeLoad as yamlParse, safeDump as yamlStringify } from "js-yaml";
//import Form from "react-jsonschema-form";
import Form from "@rjsf/material-ui";
//import Form from "@rjsf/bootstrap-4";
import Tabs from "./tabs/Tabs";
import YamlEditor from "./yamlEditor/YamlEditor";
import ErrorBoundary from "./ErrorBoundary";
import FormBuilder from "./formBuilder/FormBuilder";
import PreDefinedGallery from "./formBuilder/PreDefinedGallery";

type Props = {
  lang: string,
  schema: string,
  uischema: string,
  onChange?: (schema: string, uischema: string) => void,
  schemaTitle?: string,
  uischemaTitle?: string,
  width?: string,
  height?: string,
};

type State = {
  formData: any,
  formToggle: boolean,
  outputToggle: boolean,
  schemaFormErrorFlag: string,
  validFormInput: boolean,
  submissionData: any,
};

// parse in either YAML or JSON
function parseForJsonSchemaForm(text: string, language: string) {
  if (!text || text === "null") return {};
  return language === "yaml" ? yamlParse(text) : JSON.parse(text);
}

// stringify in either YAML or JSON
function stringify(obj: any, language: string) {
  if (!obj) return "";
  return language === "yaml"
    ? yamlStringify(obj, { skipInvalid: true })
    : JSON.stringify(obj, null, 5);
}

// return error message for parsing or blank if no error
function checkError(text: string, language: string) {
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
}

// generalized editor, either json or yaml
const LangEditor = (parameters: {
  name: string,
  onChange: (string) => any,
  lang: string,
  value: string,
  readOnly?: boolean,
}) => {
  return (
    <YamlEditor
      name={parameters.name}
      width={"400px"}
      height={"400px"}
      onChange={parameters.onChange}
      yaml={parameters.value}
      readOnly={parameters.readOnly}
    />
  );
};

class JsonSchemaFormEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // assign initial values
    this.state = {
      formData: {},
      formToggle: true,
      outputToggle: false,
      schemaFormErrorFlag: "",
      validFormInput: false,
      editorWidth: 700,
      submissionData: {},
    };
  }

  // update state schema and indicate parsing errors
  updateSchema(text: string) {
    // update parent
    if (this.props.onChange) this.props.onChange(text, this.props.uischema);
  }

  // update state ui schema and indicate parsing errors
  updateUISchema(text: string) {
    // update parent
    if (this.props.onChange) this.props.onChange(this.props.schema, text);
  }

  // update the internal form data state
  updateFormData(text: string) {
    try {
      const data = parseForJsonSchemaForm(text, this.props.lang);
      this.setState({
        formData: data,
        schemaFormErrorFlag: "",
      });
    } catch (err) {
      this.setState({
        schemaFormErrorFlag: err.toString(),
      });
    }
  }

  render() {
    const schemaError = checkError(this.props.schema, this.props.lang);
    const schemaUiError = checkError(this.props.uischema, this.props.lang);
    return (
      <div
        style={{
          width: this.props.width ? this.props.width : "100%",
          height: this.props.height ? this.props.height : "500px",
        }}
        className="playground-main"
      >
        <div className='relative px-3 py-3 mb-4 border rounded'
          style={{
            display: schemaError === "" ? "none" : "block",
          }}
          color="danger"
        >
          <h5>Schema:</h5> {schemaError}
        </div>
        <div className='relative px-3 py-3 mb-4 border rounded'
          style={{
            display: schemaUiError === "" ? "none" : "block",
          }}
          color="danger"
        >
          <h5>UI Schema:</h5> {schemaUiError}
        </div>
        <div className='relative px-3 py-3 mb-4 border rounded'
          style={{
            display: this.state.schemaFormErrorFlag === "" ? "none" : "block",
          }}
          color="danger"
        >
          <h5>Form:</h5> {this.state.schemaFormErrorFlag}
        </div>
        <Tabs
          tabs={[
            {
              name: "Visual Form Builder",
              id: "form-builder",
              content: (
                <div
                  className="tab-pane"
                  style={{
                    height: this.props.height ? this.props.height : "500px",
                  }}
                >
                  <ErrorBoundary onErr={() => {}}>
                    <FormBuilder
                      schema={this.props.schema}
                      uischema={this.props.uischema}
                      onChange={(newSchema: string, newUiSchema: string) => {
                        if (this.props.onChange)
                          this.props.onChange(newSchema, newUiSchema);
                      }}
                      lang={this.props.lang}
                    />
                  </ErrorBoundary>
                </div>
              ),
            },
            {
              name: "Preview Form",
              id: "preview-form",
              content: (
                <div
                  className="tab-pane"
                  style={{
                    height: this.props.height ? this.props.height : "500px",
                  }}
                >
                  <ErrorBoundary
                    onErr={(err: string) => {
                      this.setState({
                        schemaFormErrorFlag: err,
                      });
                    }}
                    errMessage="Error parsing JSON Schema"
                  >
                    <Form
                      schema={
                        schemaError === ""
                          ? parseForJsonSchemaForm(
                              this.props.schema,
                              this.props.lang
                            )
                          : {}
                      }
                      uiSchema={
                        schemaUiError === ""
                          ? parseForJsonSchemaForm(
                              this.props.uischema,
                              this.props.lang
                            )
                          : {}
                      }
                      onChange={(formData) =>
                        this.updateFormData(JSON.stringify(formData.formData))
                      }
                      formData={this.state.formData}
                      submitButtonMessage={"Submit"}
                      onSubmit={(submissionData) => {
                        // below only runs if validation succeeded
                        this.setState({
                          validFormInput: true,
                          outputToggle: true,
                          submissionData,
                        });
                      }}
                    />
                  </ErrorBoundary>
                  <Modal isOpen={this.state.outputToggle}>
                    <ModalHeader>Form output preview</ModalHeader>
                    <ModalBody>
                      <div className="editor-container">
                        <ErrorBoundary
                          onErr={() => {}}
                          errMessage={"Error parsing JSON Schema Form output"}
                        >
                          {LangEditor({
                            name: "Output Data",
                            onChange: () => {},
                            lang: this.props.lang,
                            value: stringify(this.state.submissionData, "json"),
                            readOnly: true,
                          })}
                        </ErrorBoundary>
                        <br />
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <input type='button' className='inline-block align-middle text-center select-none border font-normal whitespace-no-wrap py-2 px-4 rounded text-base leading-normal no-underline'
                        onClick={() => {
                          this.setState({
                            outputToggle: false,
                          });
                        }}
                        color="secondary"
                      >
                        Close
                      </input>
                    </ModalFooter>
                  </Modal>
                </div>
              ),
            },
            {
              name: "Edit Schema",
              id: "editors",
              content: (
                <div
                  className="tab-pane"
                  style={{
                    height: this.props.height ? this.props.height : "500px",
                    display: "flex",
                    "flex-direction": "row",
                  }}
                >
                  <div style={{ margin: "1em" }} className="editor-container">
                    <ErrorBoundary
                      onErr={(err: string) => {
                        // if rendering initial value causes a crash
                        // eslint-disable-next-line no-console
                        console.error(err);
                        this.updateSchema("{}");
                      }}
                      errMessage={"Error parsing JSON Schema input"}
                    >
                      {LangEditor({
                        name: "Data Schema",
                        onChange: (data: any) => this.updateSchema(data),
                        lang: this.props.lang,
                        value: this.props.schema,
                      })}
                    </ErrorBoundary>
                    <br />
                  </div>
                  <div style={{ margin: "1em" }} className="editor-container">
                    <ErrorBoundary
                      onErr={(err: string) => {
                        // if rendering initial value causes a crash
                        // eslint-disable-next-line no-console
                        console.error(err);
                        this.updateUISchema("{}");
                      }}
                      errMessage={"Error parsing JSON UI Schema input"}
                    >
                      {LangEditor({
                        name: "UI Schema",
                        onChange: (data: any) => this.updateUISchema(data),
                        lang: this.props.lang,
                        value: this.props.uischema,
                      })}
                    </ErrorBoundary>
                  </div>
                </div>
              ),
            },
            {
              name: "Pre-Configured Components",
              id: "pre-configured",
              content: (
                <div
                  className="tab-pane"
                  style={{
                    height: this.props.height ? this.props.height : "500px",
                  }}
                >
                  <ErrorBoundary onErr={() => {}}>
                    <PreDefinedGallery
                      schema={this.props.schema}
                      uischema={this.props.uischema}
                      onChange={(newSchema: string, newUiSchema: string) => {
                        if (this.props.onChange)
                          this.props.onChange(newSchema, newUiSchema);
                      }}
                      lang={this.props.lang}
                    />
                  </ErrorBoundary>
                </div>
              ),
            },
          ]}
          preventRerender
        />
      </div>
    );
  }
}

export default JsonSchemaFormEditor;
