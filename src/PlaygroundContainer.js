// @flow

import React from "react";

import JsonSchemaFormEditor from "./JsonSchemaFormEditor";

type Props = {
  title: string,
};

type State = {
  schema: string,
  uischema: string,
};

class PlaygroundContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      schema: ``,
      uischema: ``,
    };
  }

  render() {
    return (
      <div className="service-playground">
        <div className="playground-info">
          <h1>{this.props.title}</h1>
        </div>
        <JsonSchemaFormEditor
          lang={"yaml"}
          schema={this.state.schema}
          uischema={this.state.uischema}
          schemaTitle="Data Schema"
          uischemaTitle="UI Schema"
          onChange={(newSchema: string, newUiSchema: string) => {
            // could do operations with this
            this.setState({
              schema: newSchema,
              uischema: newUiSchema,
            });
          }}
          width="95%"
          height="800px"
        />
      </div>
    );
  }
}

export default PlaygroundContainer;
