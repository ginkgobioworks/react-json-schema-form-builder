import React, { ReactElement } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '../Tooltip';
import CardSelector from './CardSelector';
import ValueSelector from './ValueSelector';

// a possible dependency
export default function DependencyPossibility({
  possibility,
  neighborNames,
  onChange,
  onDelete,
  parentEnums,
  parentType,
  parentName,
  parentSchema,
}: {
  possibility: {
    children: Array<string>;
    value?: any;
  };
  neighborNames: Array<string>;
  onChange: (newPossibility: { children: Array<string>; value?: any }) => void;
  onDelete: () => void;
  parentEnums?: Array<string | number>;
  parentType?: string;
  parentName?: string;
  parentSchema?: any;
}): ReactElement {
  return (
    <Paper variant='outlined' sx={{ p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant='subtitle2'
            fontWeight='bold'
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}
          >
            Display the following:{' '}
            <Tooltip
              type='help'
              text='Choose the other form elements that depend on this one'
            />
          </Typography>
          <CardSelector
            possibleChoices={
              neighborNames.filter((name) => name !== parentName) || []
            }
            chosenChoices={possibility.children}
            onChange={(chosenChoices: Array<string>) =>
              onChange({ ...possibility, children: [...chosenChoices] })
            }
            placeholder='Choose a dependent...'
          />
          <Typography
            variant='subtitle2'
            fontWeight='bold'
            sx={{ mt: 2, mb: 1 }}
          >
            If &quot;{parentName}&quot; has{' '}
            {possibility.value ? 'the value:' : 'a value.'}
          </Typography>
          {possibility.value && (
            <ValueSelector
              possibility={possibility}
              onChange={(newPossibility: {
                children: Array<string>;
                value?: any;
              }) => onChange(newPossibility)}
              parentEnums={parentEnums}
              parentType={parentType}
              parentName={parentName}
              parentSchema={parentSchema}
            />
          )}
        </Box>
        <IconButton size='small' onClick={() => onDelete()}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </Box>
    </Paper>
  );
}
