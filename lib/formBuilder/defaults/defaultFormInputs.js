import ShortAnswerInputs from "./ShortAnswerInputs";
import LongAnswerInputs from "./LongAnswerInputs";
import NumberInputs from "./NumberInputs";
import ArrayInputs from "./ArrayInputs";
import DefaultInputs from "./DefaultInputs";
const DEFAULT_FORM_INPUTS = { ...DefaultInputs,
  ...ShortAnswerInputs,
  ...LongAnswerInputs,
  ...NumberInputs,
  ...ArrayInputs
};
export default DEFAULT_FORM_INPUTS;