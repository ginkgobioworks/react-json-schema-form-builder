import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import type { WidgetProps } from '@rjsf/utils';

/**
 * Custom RJSF widget for phone number input with country code selector
 */
function PhoneWidget({
  value,
  onChange,
  placeholder,
  required,
  disabled,
  readonly,
  schema,
  uiSchema,
  rawErrors,
}: WidgetProps) {
  const defaultValue = typeof value === 'string' ? value : '';
  const [countryCode, setCountryCode] = React.useState('+1');
  const [phoneNumber, setPhoneNumber] = React.useState('');

  React.useEffect(() => {
    if (defaultValue) {
      // Extract country code if present
      const match = defaultValue.match(/^(\+\d{1,3})(.*)$/);
      if (match) {
        setCountryCode(match[1]);
        setPhoneNumber(match[2]);
      } else {
        setPhoneNumber(defaultValue);
      }
    }
  }, [defaultValue]);

  const handleCountryCodeChange = (newCode: string) => {
    setCountryCode(newCode);
    onChange(`${newCode}${phoneNumber}`);
  };

  const handlePhoneNumberChange = (newNumber: string) => {
    setPhoneNumber(newNumber);
    onChange(`${countryCode}${newNumber}`);
  };

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <TextField
        select
        value={countryCode}
        onChange={(ev) => handleCountryCodeChange(ev.target.value)}
        disabled={disabled || readonly}
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
        onChange={(ev) => handlePhoneNumberChange(ev.target.value)}
        placeholder={placeholder || '+1234567890'}
        disabled={disabled || readonly}
        required={required}
        error={rawErrors && rawErrors.length > 0}
        type='tel'
        size='small'
        fullWidth
        inputProps={{
          'aria-label': 'Phone number',
        }}
      />
    </Box>
  );
}

export default PhoneWidget;
