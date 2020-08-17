// @flow

import * as React from 'react';
import Tooltip from '../Tooltip';

// warning message if not all possibilities specified
export default function DependencyWarning({
  parameters,
}: {
  parameters: {
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
  },
}) {
  if (
    parameters.enum &&
    parameters.dependents &&
    parameters.dependents.length &&
    parameters.dependents[0].value
  ) {
    // get the set of defined enum values
    const definedVals = new Set([]);
    parameters.dependents.forEach((possibility) => {
      if (possibility.value && possibility.value.enum)
        possibility.value.enum.forEach((val) => definedVals.add(val));
    });
    const undefinedVals = [];
    if (Array.isArray(parameters.enum))
      parameters.enum.forEach((val) => {
        if (!definedVals.has(val)) undefinedVals.push(val);
      });
    if (undefinedVals.length === 0) return null;
    return (
      <React.Fragment>
        <p>
          Warning! The following values do not have associated dependency
          values:{' '}
          <Tooltip
            id={`${parameters.path}_valuewarning`}
            type="help"
            text="Each possible value for a value-based dependency must be defined to work properly"
          />
        </p>

        <ul>
          {undefinedVals.map((val) => (
            <li>{val}</li>
          ))}
        </ul>
      </React.Fragment>
    );
  }

  return null;
}
