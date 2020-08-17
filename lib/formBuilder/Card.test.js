import React from "react";
import { mount } from "enzyme";
import { stringify } from "./utils";
import Card from "./Card"; // mocks to record events

const mockEvent = jest.fn(() => {});
const params = {
  name: "test",
  category: "shortAnswer"
};
const props = {
  componentProps: params,
  onChange: newVals => mockEvent(stringify(newVals, "yaml")),
  onDelete: () => mockEvent("delete"),
  onMoveUp: () => mockEvent("moveUp"),
  onMoveDown: () => mockEvent("moveDown"),
  TypeSpecificParameters: ({
    parameters,
    onChange
  }) => /*#__PURE__*/React.createElement("input", {
    className: "inputVal",
    value: parameters.inputVal || "",
    onChange: val => {
      onChange({ ...parameters,
        inputVal: val.target.value
      });
    }
  })
};
describe("Card", () => {
  it("renders without error", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const wrapper = mount( /*#__PURE__*/React.createElement(Card, props), {
      attachTo: div
    });
    expect(wrapper.exists(".card-container")).toBeTruthy();
  });
  it("calls the delete function on delete", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const wrapper = mount( /*#__PURE__*/React.createElement(Card, props), {
      attachTo: div
    });
    const deleteButton = wrapper.find(".card-container").first().find(".fa-trash").first();
    deleteButton.simulate("click");
    expect(mockEvent).toHaveBeenCalledTimes(1);
    expect(mockEvent).toHaveBeenCalledWith("delete");
    mockEvent.mockClear();
  });
  it("calls the move up and move down functions on arrow presses", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const wrapper = mount( /*#__PURE__*/React.createElement(Card, props), {
      attachTo: div
    });
    const moveUp = wrapper.find(".card-container").first().find(".fa-arrow-up").first();
    moveUp.simulate("click");
    expect(mockEvent).toHaveBeenCalledTimes(1);
    expect(mockEvent).toHaveBeenCalledWith("moveUp");
    const moveDown = wrapper.find(".card-container").first().find(".fa-arrow-down").first();
    moveDown.simulate("click");
    expect(mockEvent).toHaveBeenCalledTimes(2);
    expect(mockEvent).toHaveBeenCalledWith("moveDown");
    mockEvent.mockClear();
  });
  it("opens up the modal on pencil press", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const wrapper = mount( /*#__PURE__*/React.createElement(Card, props), {
      attachTo: div
    });
    const pencil = wrapper.find(".card-container").first().find(".fa-pencil").first();
    pencil.simulate("click");
    expect(wrapper.exists('div[data-test="card-modal"]')).toBeTruthy();
  });
  it("changes the name when the key is altered", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const wrapper = mount( /*#__PURE__*/React.createElement(Card, props), {
      attachTo: div
    });
    const key = wrapper.find(".card-container").first().find(".card-text").at(1);
    key.simulate("focus");
    key.simulate("change", {
      target: {
        value: "wow_name_change"
      }
    });
    key.simulate("blur");
    key.simulate("focus");
    key.simulate("change", {
      target: {
        value: "test"
      }
    });
    key.simulate("blur");
    expect(mockEvent.mock.calls).toEqual([["name: wow_name_change\ncategory: shortAnswer\n"], ["name: test\ncategory: shortAnswer\n"]]);
    mockEvent.mockClear();
  });
  it("calls the onChange with new values when edited", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const wrapper = mount( /*#__PURE__*/React.createElement(Card, props), {
      attachTo: div
    });
    const title = wrapper.find(".card-container").first().find(".card-text").at(2);
    title.simulate("change", {
      target: {
        value: "wow title change"
      }
    });
    title.simulate("blur");
    const description = wrapper.find(".card-container").first().find(".card-text").at(4);
    description.simulate("change", {
      target: {
        value: "wow description change"
      }
    });
    description.simulate("blur");
    expect(mockEvent.mock.calls).toEqual([["name: test\ncategory: shortAnswer\ntitle: wow title change\n"], ["name: test\ncategory: shortAnswer\ndescription: wow description change\n"]]);
    mockEvent.mockClear();
  });
});