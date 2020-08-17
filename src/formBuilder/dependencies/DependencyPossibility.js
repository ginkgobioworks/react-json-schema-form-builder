// @flow

import * as React from 'react';
import Tooltip from '../Tooltip';
import CardSelector from './CardSelector';
import ValueSelector from './ValueSelector';

// a possible dependency
export default function DependencyPossibility({
  possibility,
  neighborNames,
  path,
  onChange,
  onDelete,
  parentEnums,
  parentType,
  parentName,
  parentSchema,
}: {
  possibility: {
    children: Array<string>,
    value?: any,
  },
  neighborNames: Array<string>,
  path: string,
  onChange: (newPossibility: {
    children: Array<string>,
    value?: any,
  }) => void,
  onDelete: () => void,
  parentEnums?: Array<string | number>,
  parentType?: string,
  parentName?: string,
  parentSchema?: string,
}) {
  return (
    <div className="form-dependency-condition">
      <h5>
        Display the following:{' '}
        <Tooltip
          id={`${path}_bulk`}
          type="help"
          text="Choose the other form elements that depend on this one"
        />
      </h5>
      <CardSelector
        possibleChoices={
          neighborNames.filter((name) => name !== parentName) || []
        }
        chosenChoices={possibility.children}
        onChange={(chosenChoices: Array<string>) =>
          onChange({ ...possibility, children: [...chosenChoices] })
        }
        placeholder={'Choose a dependent...'}
        path={path}
      />
      <h5>
        If "{parentName}" has {possibility.value ? 'the value:' : 'a value.'}
      </h5>
      <div style={{ display: possibility.value ? 'initial' : 'none' }}>
        <br />
        <ValueSelector
          possibility={possibility}
          onChange={(newPossibility: {
            children: Array<string>,
            value?: any,
          }) => onChange(newPossibility)}
          parentEnums={parentEnums}
          parentType={parentType}
          parentName={parentName}
          parentSchema={parentSchema}
          path={path}
        />
      </div>
      <br />
      <i className="fa fa-times" onClick={() => onDelete()} />
    </div>
  );
}
