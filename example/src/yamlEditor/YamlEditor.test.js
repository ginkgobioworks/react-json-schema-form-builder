// @flow

import React from "react";
import { mount } from "enzyme";

import YamlEditor from "./YamlEditor";

const mockChange = jest.fn((yaml: string) => yaml);

const props = {
  name: "test",
  mode: "edit",
  yaml: "",
  onChange: (yaml: string) => mockChange(yaml),
};

describe("YamlEditor", () => {
  it("renders without error", () => {
    const wrapper = mount(<YamlEditor {...props} />);

    expect(wrapper.exists(".yamleditor-react-container")).toBeTruthy();
  });
});
