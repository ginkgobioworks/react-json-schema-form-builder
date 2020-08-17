import React from "react";
import { mount } from "enzyme";
import Section from "./Section"; // mocks to record events

const mockEvent = jest.fn(() => {});
const defaultSchema = {};
const defaultUiSchema = {};
const props = {
  name: "test",
  required: false,
  schema: defaultSchema,
  uischema: defaultUiSchema,
  onChange: (schema, uischema) => mockEvent(schema, uischema),
  onNameChange: newName => mockEvent(newName),
  onRequireToggle: () => mockEvent("toggledRequire"),
  onDelete: () => mockEvent("delete"),
  path: "section",
  definitionData: "",
  definitionUi: ""
};
describe("Section", () => {
  it("renders without error", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const wrapper = mount( /*#__PURE__*/React.createElement(Section, props), {
      attachTo: div
    });
    expect(wrapper.exists(".section-container")).toBeTruthy();
  });
  it("calls the delete function on delete", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const wrapper = mount( /*#__PURE__*/React.createElement(Section, props), {
      attachTo: div
    });
    const deleteButton = wrapper.find(".fa-trash").first();
    deleteButton.simulate("click");
    expect(mockEvent).toHaveBeenCalledTimes(1);
    expect(mockEvent).toHaveBeenCalledWith("delete");
    mockEvent.mockClear();
  });
  it("changes the key name of the section", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const wrapper = mount( /*#__PURE__*/React.createElement(Section, props), {
      attachTo: div
    });
    const keyInput = wrapper.find(".card-text").first();
    keyInput.simulate("focus");
    keyInput.simulate("change", {
      target: {
        value: "wow_key_change"
      }
    });
    keyInput.simulate("blur");
    keyInput.simulate("focus");
    keyInput.simulate("change", {
      target: {
        value: "test"
      }
    });
    keyInput.simulate("blur");
    expect(mockEvent.mock.calls).toEqual([["wow_key_change"], ["test"]]);
    mockEvent.mockClear();
  });
  it("changes the section title", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const wrapper = mount( /*#__PURE__*/React.createElement(Section, props), {
      attachTo: div
    });
    const titleInput = wrapper.find(".card-text").at(2);
    titleInput.simulate("change", {
      target: {
        value: "wow title change"
      }
    });
    expect(mockEvent.mock.calls).toEqual([[{
      title: "wow title change"
    }, {}]]);
    mockEvent.mockClear();
  });
  it("adds components to the internal schema", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const wrapper = mount( /*#__PURE__*/React.createElement(Section, { ...props,
      schema: "",
      uischema: ""
    }), {
      attachTo: div
    });
    const plusButton = wrapper.find(".fa-plus-square").first();
    plusButton.simulate("click");
    const createButton = wrapper.find("button").at(1);
    createButton.simulate("click");
    expect(mockEvent.mock.calls).toEqual([[{
      properties: {
        newInput1: {
          title: "New Input 1",
          type: "string"
        }
      },
      dependencies: {},
      required: [],
      type: "object"
    }, {
      "ui:order": ["newInput1"]
    }]]);
    mockEvent.mockClear();
  });
});