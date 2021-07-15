// @flow

import React, { useState } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { createUseStyles } from 'react-jss';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import FBRadioGroup from '../radio/FBRadioGroup';
import Tooltip from '../Tooltip';
import DependencyWarning from './DependencyWarning';
import DependencyPossibility from './DependencyPossibility';
import FontAwesomeIcon from '../FontAwesomeIcon';
import { getRandomId } from '../utils';
import type { Node } from 'react';

const useStyles = createUseStyles({
  dependencyField: {
    '& .fa': { cursor: 'pointer' },
    '& .plus': { marginLeft: '1em' },
    '& h4': { marginBottom: '.5em' },
    '& h5': { fontSize: '1em' },
    '& .form-dependency-select': { fontSize: '0.75em', marginBottom: '1em' },
    '& .form-dependency-conditions': {
      textAlign: 'left',
      '& .form-dependency-condition': {
        padding: '1em',
        border: '1px solid gray',
        borderRadius: '4px',
        margin: '1em',
        '& *': { textAlign: 'initial' },
      },
    },
    '& p': { fontSize: '0.75em' },
    '& .fb-radio-button': {
      display: 'block',
    },
  },
});

// checks whether an array corresponds to oneOf dependencies
function checkIfValueBasedDependency(
  dependents: Array<{
    children: Array<string>,
    value?: any,
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
  [string]: any,
  name?: string,
  dependents?: Array<{
    children: Array<string>,
    value?: any,
  }>,
  type?: string,
  enum?: Array<string | number>,
  neighborNames?: Array<string>,
  schema?: any,
};

export default function DependencyField({
  parameters,
  onChange,
}: {
  parameters: DependencyParams,
  onChange: (newParams: DependencyParams) => void,
}): Node {
  const [elementId] = useState(getRandomId());
  const classes = useStyles();
  const valueBased = checkIfValueBasedDependency(parameters.dependents || []);
  return (
    <div className={`form-dependency ${classes.dependencyField}`}>
      <h4>
        Dependencies{' '}
        <Tooltip
          id={`${elementId}_dependent`}
          type='help'
          text='Control whether other form elements show based on this one'
        />
      </h4>
      {!!parameters.dependents && parameters.dependents.length > 0 && (
        <React.Fragment>
          <FBRadioGroup
            defaultValue={valueBased ? 'value' : 'definition'}
            horizontal={false}
            options={[
              {
                value: 'definition',
                label: 'Any value dependency',
              },
              {
                value: 'value',
                label: (
                  <React.Fragment>
                    Specific value dependency{' '}
                    <Tooltip
                      id={`${elementId}_valuebased`}
                      type='help'
                      text="Specify whether these elements should show based on this element's value"
                    />
                  </React.Fragment>
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
        </React.Fragment>
      )}
      <DependencyWarning parameters={parameters} />
      <div className='form-dependency-conditions'>
        {parameters.dependents
          ? parameters.dependents.map((possibility, index) => (
              <DependencyPossibility
                possibility={possibility}
                neighborNames={parameters.neighborNames || []}
                parentEnums={parameters.enum}
                parentType={parameters.type}
                parentName={parameters.name}
                parentSchema={parameters.schema}
                path={parameters.path}
                key={`${elementId}_possibility${index}`}
                onChange={(newPossibility: {
                  children: Array<string>,
                  value?: any,
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
            ))
          : ''}

        <span className='plus' id={`${elementId}_adddependency`}>
          <FontAwesomeIcon
            icon={faPlus}
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
          />
        </span>
        <UncontrolledTooltip
          placement='top'
          target={`${elementId}_adddependency`}
        >
          Add another dependency relation linking this element and other form
          elements
        </UncontrolledTooltip>
      </div>
    </div>
  );
}
