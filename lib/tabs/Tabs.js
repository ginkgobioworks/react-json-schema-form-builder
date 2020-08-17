import React, { useState } from "react";
import classnames from "classnames";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { createUseStyles } from "react-jss";
const useStyles = createUseStyles({
  portalTabs: {
    "& .tab-content": {
      "& .tab-pane > .tab-pane": {
        display: "none",
        padding: "2em"
      },
      "& .active > .tab-pane": {
        display: "block"
      }
    },
    "& .nav": {
      "& .nav-link": {
        position: "relative",
        display: "inline-flex",
        padding: "10px"
      },
      "& li": {
        display: "inline-block"
      },
      "& .nav-item": {
        "& .active": {
          color: "#212529 !important",
          "font-weight": 600
        },
        "&:hover": {
          cursor: "pointer"
        },
        "& a": {
          color: "#ccc"
        }
      }
    }
  }
});
export default function Tabs({
  defaultActiveTab = 0,
  tabs = [],
  withSeparator = false,
  preventRerender = false
}) {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  return /*#__PURE__*/React.createElement("div", {
    className: classes.portalTabs
  }, /*#__PURE__*/React.createElement(Nav, {
    tabs: true
  }, tabs.map(({
    name,
    id
  }, i) => /*#__PURE__*/React.createElement(NavItem, {
    key: i,
    id: id
  }, /*#__PURE__*/React.createElement(NavLink, {
    className: classnames({
      active: activeTab === i
    }),
    onClick: () => {
      setActiveTab(i);
    }
  }, name)))), /*#__PURE__*/React.createElement(TabContent, {
    activeTab: activeTab,
    className: classnames({
      "with-separator": withSeparator
    })
  }, /*#__PURE__*/React.createElement(React.Fragment, null, tabs.map(({
    content
  }, i) => /*#__PURE__*/React.createElement(TabPane, {
    key: i,
    tabId: i
  }, activeTab === i && (preventRerender ? true : content), preventRerender ? content : "")))));
}