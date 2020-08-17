import React from "react";
import { mount } from "enzyme";
import YamlEditor from "./YamlEditor";
const mockChange = jest.fn(yaml => yaml);
const props = {
  name: "test",
  mode: "edit",
  yaml: "",
  onChange: yaml => mockChange(yaml)
};
describe("YamlEditor", () => {
  it("renders without error", () => {
    const wrapper = mount( /*#__PURE__*/React.createElement(YamlEditor, props));
    expect(wrapper.exists(".yamleditor-react-container")).toBeTruthy();
  });
});