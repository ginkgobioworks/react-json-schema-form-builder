import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import type {
  FormInput,
  Mods,
  CardComponentPropsType,
} from '@ginkgo-bioworks/react-json-schema-form-builder';

/**
 * Example custom form input: Phone Number field
 * This demonstrates how to create a custom form input type with:
 * - Custom validation pattern
 * - Country code selection
 * - Format-specific UI schema
 */
const phoneNumberFormInput: FormInput = {
  displayName: 'Phone Number',
  matchIf: [
    {
      types: ['string'],
      widget: 'phone',
    },
  ],
  defaultDataSchema: {
    type: 'string',
    pattern: '^\\+?[1-9]\\d{1,14}$', // E.164 format
  },
  defaultUiSchema: {
    'ui:widget': 'phone',
    'ui:placeholder': '+1234567890',
  },
  type: 'string',
  cardBody: ({ parameters, onChange }) => {
    const defaultValue =
      typeof parameters.default === 'string' ? parameters.default : '';
    const countryCode = (parameters as any).countryCode || '+1';
    const phoneNumber = defaultValue.replace(/^\+?\d{1,3}/, '') || '';

    return (
      <>
        <Typography variant='subtitle2' gutterBottom>
          Default Phone Number
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            select
            value={countryCode}
            onChange={(ev) => {
              const newCode = ev.target.value;
              const newParams: CardComponentPropsType = {
                ...parameters,
                default: `${newCode}${phoneNumber}`,
              };
              (newParams as any).countryCode = newCode;
              onChange(newParams);
            }}
            size='small'
            sx={{ minWidth: 120 }}
          >
            <MenuItem value='+1'>+1 (US)</MenuItem>
            <MenuItem value='+44'>+44 (UK)</MenuItem>
            <MenuItem value='+33'>+33 (FR)</MenuItem>
            <MenuItem value='+49'>+49 (DE)</MenuItem>
            <MenuItem value='+81'>+81 (JP)</MenuItem>
          </TextField>
          <TextField
            value={phoneNumber}
            placeholder='1234567890'
            onChange={(ev) => {
              const newParams: CardComponentPropsType = {
                ...parameters,
                default: `${countryCode}${ev.target.value}`,
              };
              (newParams as any).countryCode = countryCode;
              onChange(newParams);
            }}
            size='small'
            fullWidth
          />
        </Box>
      </>
    );
  },
  modalBody: ({ parameters, onChange }) => (
    <>
      <Typography variant='subtitle2' gutterBottom>
        Phone Number Configuration
      </Typography>
      <TextField
        label='Validation Pattern (regex)'
        value={parameters.pattern || '^\\+?[1-9]\\d{1,14}$'}
        placeholder='^\\+?[1-9]\\d{1,14}$'
        onChange={(ev) => onChange({ ...parameters, pattern: ev.target.value })}
        size='small'
        fullWidth
        sx={{ mb: 2 }}
        helperText='E.164 format: + followed by country code and number'
      />
      <Typography variant='caption' color='text.secondary'>
        Customize the validation pattern for phone number format
      </Typography>
    </>
  ),
};

/**
 * Example Mods configuration demonstrating various customization options
 */
export const exampleMods: Mods = {
  // Custom form inputs - adds new input types to the form builder
  customFormInputs: {
    phone: phoneNumberFormInput,
  },

  // Custom labels - change the text labels throughout the form builder
  labels: {
    formNameLabel: 'Form Title',
    formDescriptionLabel: 'Form Description',
    addElementLabel: 'Add Field',
    addSectionLabel: 'Add Section',
  },

  // Custom tooltip descriptions - customize help text tooltips
  tooltipDescriptions: {
    add: 'Click to add a new field or section to your form',
    cardObjectName: 'The property name used in the JSON schema',
    cardDisplayName: 'The label shown to users when filling out the form',
    cardDescription: 'Additional help text displayed below the field',
    cardInputType:
      'Select the type of input field (text, number, dropdown, etc.)',
  },

  // Deactivated form inputs - hide certain default input types
  // Uncomment to hide these input types:
  // deactivatedFormInputs: ['time', 'password'],

  // Show/hide the form header (title and description fields)
  showFormHead: true,
};
