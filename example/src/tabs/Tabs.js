// @flow

import * as React from 'react';

import classnames from 'classnames';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { createUseStyles } from 'react-jss';

type TabSpec = {
  name: string,
  content: React.Element<any>,
  id?: string,
};

const useStyles = createUseStyles({
  portalTabs: {
    '& .tab-content': {
      '& .tab-pane > .tab-pane': {
        display: 'none',
        padding: '2em',
      },
      '& .active > .tab-pane': {
        display: 'block',
      },
    },
    '& .nav': {
      '& .nav-link': {
        position: 'relative',
        display: 'inline-flex',
        padding: '10px',
      },
      '& li': {
        display: 'inline-block',
      },
      '& .nav-item': {
        '& .active': {
          color: '#212529 !important',
          'font-weight': 600,
        },
        '&:hover': {
          cursor: 'pointer',
        },
        '& a': {
          color: '#ccc',
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
  const [activeTab, setActiveTab] = React.useState(defaultActiveTab);

  return (
    <div className={classes.portalTabs}>
      <Nav tabs>
        {tabs.map(({ name, id }, i) => (
          <NavItem key={i} id={id}>
            <NavLink
              className={classnames({ active: activeTab === i })}
              onClick={() => {
                setActiveTab(i);
              }}
            >
              {name}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <TabContent
        activeTab={activeTab}
        className={classnames({
          'with-separator': withSeparator,
        })}
      >
        <React.Fragment>
          {tabs.map(({ content }, i) => (
            <TabPane key={i} tabId={i}>
              {activeTab === i && (preventRerender ? true : content)}
              {preventRerender ? content : ''}
            </TabPane>
          ))}
        </React.Fragment>
      </TabContent>
    </div>
  );
}
