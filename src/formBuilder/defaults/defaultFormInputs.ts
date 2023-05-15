import shortAnswerInputs from './shortAnswerInputs';
import longAnswerInputs from './longAnswerInputs';
import numberInputs from './numberInputs';
import arrayInputs from './arrayInputs';
import defaultInputs from './defaultInputs';
import referenceInputs from './referenceInputs';
import { FormInput } from '../types';

const DEFAULT_FORM_INPUTS: { [key: string]: FormInput } = {
  ...defaultInputs,
  ...referenceInputs,
  ...shortAnswerInputs,
  ...longAnswerInputs,
  ...numberInputs,
  ...arrayInputs,
};

export default DEFAULT_FORM_INPUTS;
