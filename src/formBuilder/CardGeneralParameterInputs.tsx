import React, {
  ReactElement,
  memo,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  defaultUiProps,
  defaultDataProps,
  categoryToNameMap,
  categoryType,
  subtractArray,
  getCardBody,
} from './utils';
import type {
  Mods,
  ModLabels,
  FormInput,
  CardComponentPropsType,
} from './types';
import Tooltip from './Tooltip';

// specify the inputs required for any type of object
function CardGeneralParameterInputs({
  parameters,
  onChange,
  allFormInputs,
  mods,
  showObjectNameInput = true,
}: {
  parameters: CardComponentPropsType;
  onChange: (newParams: CardComponentPropsType) => void;
  mods?: Mods;
  allFormInputs: { [key: string]: FormInput };
  showObjectNameInput?: boolean;
}): ReactElement {
  const [keyState, setKeyState] = useState(parameters.name);
  const [keyError, setKeyError] = useState<null | string>(null);
  const [titleState, setTitleState] = useState(parameters.title);
  const [descriptionState, setDescriptionState] = useState(
    parameters.description,
  );

  // Local state is maintained for controlled inputs to avoid losing focus
  // We include parameters in dependencies to ensure callbacks have latest values

  // Sync local state when parameters prop changes externally
  useEffect(() => {
    setKeyState(parameters.name);
    setTitleState(parameters.title);
    setDescriptionState(parameters.description);
  }, [parameters.name, parameters.title, parameters.description]);

  const categoryMap = useMemo(
    () => categoryToNameMap(allFormInputs),
    [allFormInputs],
  );

  const fetchLabel = useCallback(
    (labelName: string, defaultLabel: string): string | undefined => {
      return mods?.labels?.[labelName as keyof ModLabels] ?? defaultLabel;
    },
    [mods?.labels],
  );

  const objectNameLabel = fetchLabel('objectNameLabel', 'Object Name');
  const displayNameLabel = fetchLabel('displayNameLabel', 'Display Name');
  const descriptionLabel = fetchLabel('descriptionLabel', 'Description');
  const inputTypeLabel = fetchLabel('inputTypeLabel', 'Input Type');

  const availableInputTypes = useMemo(() => {
    const definitionsInSchema =
      parameters.definitionData &&
      Object.keys(parameters.definitionData).length !== 0;

    // Hide the "Reference" option if there are no definitions in the schema
    let inputKeys = Object.keys(categoryMap).filter(
      (key) => key !== 'ref' || definitionsInSchema,
    );
    // Exclude hidden inputs based on mods
    if (mods) inputKeys = subtractArray(inputKeys, mods.deactivatedFormInputs);

    return inputKeys
      .map((key) => ({ value: key, label: categoryMap[key] }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [categoryMap, mods, parameters.definitionData]);

  const handleKeyChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setKeyState(ev.target.value);
    },
    [],
  );

  const handleKeyBlur = useCallback(
    (ev: React.FocusEvent<HTMLInputElement>) => {
      const { value } = ev.target;
      if (
        value === parameters.name ||
        !(parameters.neighborNames && parameters.neighborNames.includes(value))
      ) {
        setKeyError(null);
        onChange({
          ...parameters,
          name: value,
        });
      } else {
        setKeyState(parameters.name);
        setKeyError(`"${value}" is already in use.`);
        onChange({ ...parameters });
      }
    },
    [onChange, parameters],
  );

  const handleTitleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setTitleState(ev.target.value);
    },
    [],
  );

  const handleTitleBlur = useCallback(
    (ev: React.FocusEvent<HTMLInputElement>) => {
      onChange({ ...parameters, title: ev.target.value });
    },
    [onChange, parameters],
  );

  const handleDescriptionChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setDescriptionState(ev.target.value);
    },
    [],
  );

  const handleDescriptionBlur = useCallback(
    (ev: React.FocusEvent<HTMLInputElement>) => {
      onChange({ ...parameters, description: ev.target.value });
    },
    [onChange, parameters],
  );

  const handleInputTypeChange = useCallback(
    (_: unknown, val: { value: string; label: string } | null) => {
      if (!val) return;
      // figure out the new 'type'
      const newCategory = val.value;

      const newProps = {
        ...defaultUiProps(newCategory, allFormInputs),
        ...defaultDataProps(newCategory, allFormInputs),
        name: parameters.name,
        required: parameters.required,
      };
      if (newProps.$ref !== undefined && !newProps.$ref) {
        // assign an initial reference
        const firstDefinition = Object.keys(parameters.definitionData!)[0];
        newProps.$ref = `#/definitions/${firstDefinition || 'empty'}`;
      }
      onChange({
        ...newProps,
        title: newProps.title || parameters.title,
        description: parameters.description,
        default: newProps.default || '',
        type: newProps.type || categoryType(newCategory, allFormInputs),
        category: newProps.category || newCategory,
      });
    },
    [allFormInputs, onChange, parameters],
  );

  const selectedInputType = useMemo(
    () => availableInputTypes.find((opt) => opt.value === parameters.category),
    [availableInputTypes, parameters.category],
  );

  const CardBody = useMemo(
    () => getCardBody(parameters.category!, allFormInputs),
    [parameters.category, allFormInputs],
  );

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {showObjectNameInput && (
          <Box sx={{ flex: 1 }}>
            <Typography
              variant='subtitle2'
              fontWeight='bold'
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}
            >
              {objectNameLabel}{' '}
              <Tooltip
                text={
                  mods?.tooltipDescriptions?.cardObjectName ??
                  'The back-end name of the object'
                }
                type='help'
              />
            </Typography>
            <FormControl fullWidth error={keyError !== null}>
              <TextField
                error={keyError !== null}
                value={keyState || ''}
                placeholder='Key'
                type='text'
                onChange={handleKeyChange}
                onBlur={handleKeyBlur}
                size='small'
                fullWidth
                slotProps={{ input: { className: 'card-text' } }}
              />
              {keyError && <FormHelperText>{keyError}</FormHelperText>}
            </FormControl>
          </Box>
        )}
        <Box sx={{ flex: 1, opacity: parameters.$ref !== undefined ? 0.6 : 1 }}>
          <Typography
            variant='subtitle2'
            fontWeight='bold'
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}
          >
            {displayNameLabel}{' '}
            <Tooltip
              text={
                mods?.tooltipDescriptions?.cardDisplayName ??
                'The user-facing name of this object'
              }
              type='help'
            />
          </Typography>
          <TextField
            value={titleState || ''}
            placeholder='Title'
            type='text'
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            size='small'
            fullWidth
            disabled={parameters.$ref !== undefined}
            slotProps={{ input: { className: 'card-text' } }}
          />
        </Box>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Box sx={{ flex: 1, opacity: parameters.$ref ? 0.6 : 1 }}>
          <Typography
            variant='subtitle2'
            fontWeight='bold'
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}
          >
            {descriptionLabel}{' '}
            <Tooltip
              text={
                mods?.tooltipDescriptions?.cardDescription ??
                'This will appear as help text on the form'
              }
              type='help'
            />
          </Typography>
          <TextField
            value={descriptionState || ''}
            placeholder='Description'
            type='text'
            onChange={handleDescriptionChange}
            onBlur={handleDescriptionBlur}
            size='small'
            fullWidth
            disabled={parameters.$ref !== undefined}
            slotProps={{ input: { className: 'card-text' } }}
          />
        </Box>
        <Box sx={{ flex: showObjectNameInput ? 1 : 2 }}>
          <Typography
            variant='subtitle2'
            fontWeight='bold'
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}
          >
            {inputTypeLabel}{' '}
            <Tooltip
              text={
                mods?.tooltipDescriptions?.cardInputType ??
                'The type of form input displayed on the form'
              }
              type='help'
            />
          </Typography>
          <Autocomplete
            value={selectedInputType}
            options={availableInputTypes}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            onChange={handleInputTypeChange}
            size='small'
            disableClearable
            renderInput={(params) => (
              <TextField {...params} placeholder={inputTypeLabel} />
            )}
          />
        </Box>
      </Stack>
      <CardBody parameters={parameters} onChange={onChange} mods={mods || {}} />
    </Stack>
  );
}

export default memo(CardGeneralParameterInputs);
