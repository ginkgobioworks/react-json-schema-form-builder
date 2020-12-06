// @flow

import React, { useState } from "react";
import {
  Popover,
  PopoverHeader,
  PopoverBody,
  UncontrolledTooltip,
  Button,
} from "reactstrap";
import { createUseStyles } from "react-jss";
import FBRadioGroup from "./radio/FBRadioGroup";

const useStyles = createUseStyles({
  addDetails: {
    "& .popover": {
      width: "300px",
      "z-index": "1051 !important",
      "& .popover-inner": {
        border: "1px solid #1d71ad",
        borderRadius: "4px",
        "& .popover-header": { borderBottom: "1px solid #1d71ad" },
        "& .popover-body": {
          "& .fb-radio-group": { display: "block" },
          "& div": { margin: "0", display: "inline-block", width: "50%" },
          "& .left": { textAlign: "left" },
          "& .right": { textAlign: "right" },
        },
      },
    },
  },
});

export default function Add({
  name,
  addElem,
  hidden,
}: {
  name: string,
  addElem: (choice: string) => void,
  hidden?: boolean,
}) {
  const classes = useStyles();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [createChoice, setCreateChoice] = useState("card");

  return (
    <div style={{ display: hidden ? "none" : "initial" }}>
      <i
        className="fa fa-plus-square card-add"
        onClick={() => setPopoverOpen(true)}
        id={`${name}_add`}
      ></i>
      <UncontrolledTooltip placement="top" target={`${name}_add`}>
        Create new form element
      </UncontrolledTooltip>
      <Popover
        placement="bottom"
        target={`${name}_add`}
        isOpen={popoverOpen}
        toggle={() => setPopoverOpen(false)}
        className={`add-details ${classes.addDetails}`}
        id={`${name}_add_popover`}
      >
        <PopoverHeader>Create New</PopoverHeader>
        <PopoverBody>
          <FBRadioGroup
            className={"choose-create"}
            defaultValue={createChoice}
            horizontal={false}
            options={[
              {
                value: "card",
                label: "Form element",
              },
              {
                value: "section",
                label: "Form section",
              },
            ]}
            onChange={(selection) => {
              setCreateChoice(selection);
            }}
          />
          <div className="left">
            <Button onClick={() => setPopoverOpen(false)} color="secondary">
              Cancel
            </Button>
          </div>
          <div className="right">
            <Button
              onClick={() => {
                addElem(createChoice);
                setPopoverOpen(false);
              }}
              color="primary"
            >
              Create
            </Button>
          </div>
        </PopoverBody>
      </Popover>
    </div>
  );
}
