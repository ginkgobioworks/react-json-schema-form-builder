import React, { ReactElement } from 'react';

import Box from '@mui/material/Box';
import MuiTabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

type TabSpec = {
  name: string;
  content: ReactElement<any>;
};

type Props = {
  defaultActiveTab?: number;
  tabs: TabSpec[];
  withSeparator?: boolean;
  preventRerender?: boolean;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role='tabpanel'
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      sx={{ py: 3, px: 1 }}
      {...other}
    >
      {value === index && children}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

export default function Tabs({
  defaultActiveTab = 0,
  tabs = [],
  withSeparator = false,
  preventRerender = false,
}: Props) {
  const [activeTab, setActiveTab] = React.useState(defaultActiveTab);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        width: '100%',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <MuiTabs value={activeTab} onChange={handleChange} aria-label='tabs'>
        {tabs.map(({ name }, i) => (
          <Tab key={i} label={name} {...a11yProps(i)} />
        ))}
      </MuiTabs>
      {tabs.map(({ content }, i) => (
        <TabPanel key={i} value={activeTab} index={i}>
          {preventRerender || activeTab === i ? content : <></>}
        </TabPanel>
      ))}
    </Box>
  );
}
