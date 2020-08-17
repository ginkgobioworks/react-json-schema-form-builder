// @flow

import * as React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { createUseStyles } from 'react-jss';
import FBRadioGroup from '../radio/FBRadioGroup';
import Tooltip from '../Tooltip';
import DependencyWarning from './DependencyWarning';
import DependencyPossibility from './DependencyPossibility';

const useStyles = createUseStyles({
  dependencyField: {
    '& i': { cursor: 'pointer' },
    '& .fa-plus': { marginLeft: '1em' },
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
        '& .card-enum-option': {
          'display': 'flex',
          'flex-direction': 'row',
          '& input': {
            'width': '80%',
            marginRight: '1em',
            marginBottom: '0.5em',
          },
        },
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
  }>
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
  schema?: string,
};

export default function DependencyField({
  parameters,
  onChange,
}: {
  parameters: DependencyParams,
  onChange: (newParams: DependencyParams) => void,
}) {
  const classes = useStyles();
  const valueBased = checkIfValueBasedDependency(parameters.dependents || []);
  return (
    <div className={`form-dependency ${classes.dependencyField}`}>
      <h3>
        Dependencies{' '}
        <Tooltip
          id={`${parameters.path}_dependent`}
          type="help"
          text="Control whether other form elements show based on this one"
        />
      </h3>
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
                label: 'Specific value dependency',
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
          <Tooltip
            id={`${parameters.path}_valuebased`}
            type="help"
            text="Specify whether these elements should show based on this element's value"
          />{' '}
        </React.Fragment>
      )}
      <DependencyWarning parameters={parameters} />
      <div className="form-dependency-conditions">
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
                key={`${parameters.path}_possibility${index}`}
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

        <i
          className="fa fa-plus"
          id={`${parameters.path}_adddependency`}
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
        <UncontrolledTooltip
          placement="top"
          target={`${parameters.path}_adddependency`}
        >
          Add another dependency relation linking this element and other form
          elements
        </UncontrolledTooltip>
      </div>
    </div>
  );
}
