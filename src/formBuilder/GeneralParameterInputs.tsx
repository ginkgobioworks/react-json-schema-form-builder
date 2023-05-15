import * as React from 'react';
import { getCardBody } from './utils';
import type { FC } from 'react';
import type {
  Parameters,
  Mods,
  FormInput,
  CardComponentPropsType,
} from './types';

interface GeneralParameterInputsProps {
  category: string;
  parameters: CardComponentPropsType;
  onChange: (newParams: CardComponentPropsType) => void;
  mods?: Mods;
  allFormInputs: { [key: string]: FormInput };
}

// specify the inputs required for any type of object
const GeneralParameterInputs: FC<GeneralParameterInputsProps> = ({
  category,
  parameters,
  onChange,
  mods,
  allFormInputs,
}) => {
  const CardBody = getCardBody(category, allFormInputs);
  return (
    <div>
      <CardBody parameters={parameters} onChange={onChange} mods={mods || {}} />
    </div>
  );
};

export default GeneralParameterInputs;
