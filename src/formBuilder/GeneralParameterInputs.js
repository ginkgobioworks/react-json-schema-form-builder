// @flow

import * as React from 'react';
import { getCardBody } from './utils';
import type { Node } from 'react';
import type { Parameters, Mods, FormInput } from './types';

// specify the inputs required for any type of object
export default function GeneralParameterInputs({
  category,
  parameters,
  onChange,
  mods,
  allFormInputs,
}: {
  category: string,
  parameters: Parameters,
  onChange: (newParams: Parameters) => void,
  mods?: Mods,
  allFormInputs: { [string]: FormInput },
}): Node {
  const CardBody = getCardBody(category, allFormInputs);
  return (
    <div>
      <CardBody parameters={parameters} onChange={onChange} mods={mods || {}} />
    </div>
  );
}
