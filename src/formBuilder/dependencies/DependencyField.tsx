import React, { useState, ReactElement } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import FBRadioGroup from '../radio/FBRadioGroup';
import TooltipComponent from '../Tooltip';
import DependencyWarning from './DependencyWarning';
import DependencyPossibility from './DependencyPossibility';
import { getRandomId } from '../utils';

// checks whether an array corresponds to oneOf dependencies
function checkIfValueBasedDependency(
  dependents: Array<{
    children: Array<string>;
    value?: any;
  }>,
) {
  let valueBased = true;
  if (dependents && Array.isArray(dependents) && dependents.length > 0) {
    dependents.forEach((possibility) => {
      if (!possibility.value || !possibility.value.enum) {
        valueBased = false;
      }
    });
  } else {
    valueBased = false;
  }

  return valueBased;
}

type DependencyParams = {
  [key: string]: any;
  name?: string;
  dependents?: Array<{
    children: Array<string>;
    value?: any;
  }>;
  type?: string;
  enum?: Array<string | number>;
  neighborNames?: Array<string>;
  schema?: any;
};

export default function DependencyField({
  parameters,
  onChange,
}: {
  parameters: DependencyParams;
  onChange: (newParams: DependencyParams) => void;
}): ReactElement {
  const [elementId] = useState(getRandomId());
  const valueBased = checkIfValueBasedDependency(parameters.dependents || []);

  return (
    <Box>
      <Typography
        variant='subtitle2'
        fontWeight='bold'
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}
      >
        Dependencies{' '}
        <TooltipComponent
          type='help'
          text='Control whether other form elements show based on this one'
        />
      </Typography>
      {!!parameters.dependents && parameters.dependents.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <FBRadioGroup
            defaultValue={valueBased ? 'value' : 'definition'}
            horizontal={false}
            options={[
              {
                value: 'definition',
                label: 'Any Value Dependency',
              },
              {
                value: 'value',
                label: (
                  <Box
                    component='span'
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    Specific Value Dependency{' '}
                    <TooltipComponent
                      type='help'
                      text="Specify whether these elements should show based on this element's value"
                    />
                  </Box>
                ),
              },
            ]}
            onChange={(selection) => {
              if (parameters.dependents) {
                const newDependents = [...parameters.dependents];
                if (selection === 'definition') {
                  parameters.dependents.forEach((possibility, index) => {
                    newDependents[index] = {
                      ...possibility,
                      value: undefined,
                    };
                  });
                } else {
                  parameters.dependents.forEach((possibility, index) => {
                    newDependents[index] = {
                      ...possibility,
                      value: { enum: [] },
                    };
                  });
                }
                onChange({
                  ...parameters,
                  dependents: newDependents,
                });
              }
            }}
          />
        </Box>
      )}
      <DependencyWarning parameters={parameters} />
      <Stack spacing={2}>
        {parameters.dependents?.map((possibility, index) => (
          <DependencyPossibility
            possibility={possibility}
            neighborNames={parameters.neighborNames || []}
            parentEnums={parameters.enum}
            parentType={parameters.type}
            parentName={parameters.name}
            parentSchema={parameters.schema}
            key={`${elementId}_possibility${index}`}
            onChange={(newPossibility: {
              children: Array<string>;
              value?: any;
            }) => {
              const newDependents = parameters.dependents
                ? [...parameters.dependents]
                : [];
              newDependents[index] = newPossibility;
              onChange({
                ...parameters,
                dependents: newDependents,
              });
            }}
            onDelete={() => {
              const newDependents = parameters.dependents
                ? [...parameters.dependents]
                : [];
              onChange({
                ...parameters,
                dependents: [
                  ...newDependents.slice(0, index),
                  ...newDependents.slice(index + 1),
                ],
              });
            }}
          />
        ))}
      </Stack>
      <Tooltip
        title='Add another dependency relation linking this element and other form elements'
        placement='top'
      >
        <IconButton
          size='small'
          color='primary'
          onClick={() => {
            const newDependents = parameters.dependents
              ? [...parameters.dependents]
              : [];
            newDependents.push({
              children: [],
              value: valueBased ? { enum: [] } : undefined,
            });
            onChange({
              ...parameters,
              dependents: newDependents,
            });
          }}
          aria-label='Add another dependency relation'
          sx={{ mt: 1 }}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
