import React, { useState, ReactElement } from 'react';
import { getRandomId } from '../utils';
import Tooltip from '../Tooltip';

interface DependencyWarningProps {
  parameters: {
    [key: string]: any;
    name?: string;
    dependents?: Array<{
      children: Array<string>;
      value?: any;
    }>;
    type?: string;
    enum?: Array<string | number>;
    neighborNames?: Array<string>;
    schema?: string;
  };
}

// warning message if not all possibilities specified
export default function DependencyWarning({
  parameters,
}: DependencyWarningProps): ReactElement | null {
  const [elementId] = useState(getRandomId());
  if (
    parameters.enum &&
    parameters.dependents &&
    parameters.dependents.length &&
    parameters.dependents[0].value
  ) {
    // get the set of defined enum values
    const definedVals = new Set([]);
    (parameters.dependents || []).forEach((possibility) => {
      if (possibility.value && possibility.value.enum)
        possibility.value.enum.forEach((val: never) => definedVals.add(val));
    });
    const undefinedVals: never[] = [];
    if (Array.isArray(parameters.enum))
      parameters.enum.forEach((val) => {
        if (!definedVals.has(val as never)) undefinedVals.push(val as never);
      });
    if (undefinedVals.length === 0) return null;
    return (
      <React.Fragment>
        <p>
          Warning! The following values do not have associated dependency
          values:{' '}
          <Tooltip
            id={`${elementId}_valuewarning`}
            type='help'
            text='Each possible value for a value-based dependency must be defined to work properly'
          />
        </p>

        <ul>
          {undefinedVals.map((val, index) => (
            <li key={index}>{val}</li>
          ))}
        </ul>
      </React.Fragment>
    );
  }

  return null;
}
