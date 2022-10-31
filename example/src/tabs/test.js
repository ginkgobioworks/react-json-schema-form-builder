import React from "react";

import { ContainerItem } from "@bloomreach/spa-sdk";

import { BrProps } from "@bloomreach/react-sdk";

import { withTheme } from "@rjsf/core";

import { Theme as Bootstrap4Theme } from "@rjsf/bootstrap-4";

const Form = withTheme(Bootstrap4Theme);

export function FormComponent({
  component,
  page,
}: BrProps<ContainerItem>): JSX.Element | null {
  const content: any = component.getContent(page);

  let form;

  try {
    form = JSON.parse(content.form);
  } catch (e) {
    form = { jsonSchema: {}, uischema: {} };
  }

  const schema = form.jsonSchema ?? {};

  const uischema = form.uiSchema ?? {};

  return (
    <div
      className={`jumbotron mb-3 ${page.isPreview() ? "has-edit-button" : ""}`}
    >
      <Form
        schema={schema}
        uiSchema={uischema}
        onSubmit={(submissionData) => {
          console.log(submissionData);
        }}
      />
    </div>
  );
}
