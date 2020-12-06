// @flow

import React, { useState } from "react";

import classnames from "classnames";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { createUseStyles } from "react-jss";

type TabSpec = {
  name: string,
  content: Node,
  id?: string,
};

const useStyles = createUseStyles({
  portalTabs: {
    "& .tab-content": {
      "& .tab-pane > .tab-pane": {
        display: "none",
        padding: "2em",
      },
      "& .active > .tab-pane": {
        display: "block",
      },
    },
    "& .nav": {
      "& .nav-link": {
        position: "relative",
        display: "inline-flex",
        padding: "10px",
      },
      "& li": {
        display: "inline-block",
      },
      "& .nav-item": {
        "& .active": {
          color: "#212529 !important",
          "font-weight": 600,
        },
        "&:hover": {
          cursor: "pointer",
        },
        "& a": {
          color: "#ccc",
        },
      },
    },
  },
});

type Props = {
  defaultActiveTab?: number,
  tabs: TabSpec[],
  withSeparator?: boolean,
  preventRerender?: boolean,
};

export default function Tabs({
  defaultActiveTab = 0,
  tabs = [],
  withSeparator = false,
  preventRerender = false,
}: Props) {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  return (
    <div className={classes.portalTabs}>
      <div className='flex flex-wrap list-reset pl-0 mb-0' tabs>
        {tabs.map(({ name, id }, i) => (
          <div className='-mb-px' key={i} id={id}>
            <div className='inline-block py-2 px-4 no-underline border border-b-0 mx-1 rounded rounded-t'
              className={classnames({ active: activeTab === i })}
              onClick={() => {
                setActiveTab(i);
              }}
            >
              {name}
            </div>
          </div>
        ))}
      </div>
      <TabContent
        activeTab={activeTab}
        className={classnames({
          "with-separator": withSeparator,
        })}
      >
        <React.Fragment>
          {tabs.map(({ content }, i) => (
            <TabPane key={i} tabId={i}>
              {activeTab === i && (preventRerender ? true : content)}
              {preventRerender ? content : ""}
            </TabPane>
          ))}
        </React.Fragment>
      </TabContent>
    </div>
  );
}
