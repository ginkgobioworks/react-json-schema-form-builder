import * as React from "react";
import Select from "react-select"; // a field that lets you choose adjacent blocks

export default function CardSelector({
  possibleChoices,
  chosenChoices,
  onChange,
  placeholder,
  path
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("ul", null, chosenChoices.map((chosenChoice, index) => /*#__PURE__*/React.createElement("li", {
    key: `${path}_neighbor_${index}`
  }, chosenChoice, " ", /*#__PURE__*/React.createElement("i", {
    className: "fa fa-times",
    onClick: () => onChange([...chosenChoices.slice(0, index), ...chosenChoices.slice(index + 1)])
  })))), /*#__PURE__*/React.createElement(Select, {
    value: {
      value: "",
      label: ""
    },
    placeholder: placeholder,
    options: possibleChoices.filter(choice => !chosenChoices.includes(choice)).map(choice => ({
      value: choice,
      label: choice
    })),
    onChange: val => {
      onChange([...chosenChoices, val.value]);
    },
    className: "card-modal-select"
  }));
}