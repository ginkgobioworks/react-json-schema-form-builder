import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { withTheme } from '@rjsf/core';
import { Theme as MuiTheme } from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import PhoneWidget from './widgets/PhoneWidget';
import {
  FormBuilder,
  PredefinedGallery,
} from '@ginkgo-bioworks/react-json-schema-form-builder';
import Tabs from './tabs/Tabs';
import ErrorBoundary from './ErrorBoundary';
import EditSchemaTab from './EditSchemaTab';

// Memoize empty error handlers to avoid recreating on every render
const emptyErrorHandler = () => {};

interface Props {
  lang: string;
  schema: string;
  uischema: string;
  onChange?: (schema: string, uischema: string) => void;
  schemaTitle?: string;
  uischemaTitle?: string;
  width?: string;
  height?: string;
  mods?: { [key: string]: any };
}

// Create custom theme with phone widget
const customTheme = {
  ...MuiTheme,
  widgets: {
    ...MuiTheme.widgets,
    phone: PhoneWidget,
  },
};

const Form = withTheme(customTheme);

// return error message for parsing or blank if no error
function checkError(text: string): string {
  let data;
  try {
    data = JSON.parse(text);
  } catch (e: any) {
    return e.toString();
  }
  if (typeof data === 'string') {
    return 'Received a string instead of object.';
  }
  return '';
}

// Format JSON with proper indentation
function formatJson(text: string): string {
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return text;
  }
}

const JsonSchemaFormEditor: React.FC<Props> = ({
  schema,
  uischema,
  onChange,
  width,
  height,
  mods,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [outputToggle, setOutputToggle] = useState(false);
  const [schemaFormErrorFlag, setSchemaFormErrorFlag] = useState('');
  const [submissionData, setSubmissionData] = useState<any>({});
  const [schemaText, setSchemaText] = useState(() => formatJson(schema));
  const [uischemaText, setUischemaText] = useState(() => formatJson(uischema));

  // Local text state is maintained for controlled inputs
  // We include schema/uischema in dependencies to ensure callbacks have latest values

  // Update local state when props change from outside (e.g., form builder)
  useEffect(() => {
    setSchemaText(formatJson(schema));
  }, [schema]);

  useEffect(() => {
    setUischemaText(formatJson(uischema));
  }, [uischema]);

  // Memoized error checks
  const schemaError = useMemo(() => checkError(schemaText), [schemaText]);
  const schemaUiError = useMemo(() => checkError(uischemaText), [uischemaText]);

  // Update state schema and indicate parsing errors
  const updateSchema = useCallback(
    (text: string) => {
      setSchemaText(text);
      // Only update parent if valid JSON
      const error = checkError(text);
      if (!error && onChange) {
        onChange(text, uischema);
      }
    },
    [onChange, uischema],
  );

  // Update state ui schema and indicate parsing errors
  const updateUISchema = useCallback(
    (text: string) => {
      setUischemaText(text);
      // Only update parent if valid JSON
      const error = checkError(text);
      if (!error && onChange) {
        onChange(schema, text);
      }
    },
    [onChange, schema],
  );

  // Update the internal form data state
  const updateFormData = useCallback((text: string) => {
    try {
      const data = JSON.parse(text);
      setFormData(data);
      setSchemaFormErrorFlag('');
    } catch (err: any) {
      setSchemaFormErrorFlag(err.toString());
    }
  }, []);

  const handleFormChange = useCallback(
    (formDataObj: { formData?: any }) => {
      if (formDataObj.formData !== undefined) {
        updateFormData(JSON.stringify(formDataObj.formData));
      }
    },
    [updateFormData],
  );

  const handleFormSubmit = useCallback((submissionDataObj: any) => {
    setOutputToggle(true);
    setSubmissionData(submissionDataObj);
  }, []);

  const handleDialogClose = useCallback(() => {
    setOutputToggle(false);
  }, []);

  const handleSchemaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateSchema(e.target.value);
    },
    [updateSchema],
  );

  const handleUiSchemaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateUISchema(e.target.value);
    },
    [updateUISchema],
  );

  const handleFormBuilderChange = useCallback(
    (newSchema: string, newUiSchema: string) => {
      onChange?.(newSchema, newUiSchema);
    },
    [onChange],
  );

  const handleFormError = useCallback((err: string) => {
    setSchemaFormErrorFlag(err);
  }, []);

  // Memoize parsed schemas for form
  const parsedSchema = useMemo(() => {
    return schemaError === '' ? JSON.parse(schemaText) : {};
  }, [schemaError, schemaText]);

  const parsedUiSchema = useMemo(() => {
    return schemaUiError === '' ? JSON.parse(uischemaText) : {};
  }, [schemaUiError, uischemaText]);

  // Memoize Edit Schema tab content separately to prevent tabs array recreation on every keystroke
  const editSchemaTabContent = useMemo(
    () => (
      <EditSchemaTab
        schemaText={schemaText}
        uischemaText={uischemaText}
        schemaError={schemaError}
        schemaUiError={schemaUiError}
        onSchemaChange={handleSchemaChange}
        onUiSchemaChange={handleUiSchemaChange}
      />
    ),
    [
      schemaText,
      uischemaText,
      schemaError,
      schemaUiError,
      handleSchemaChange,
      handleUiSchemaChange,
    ],
  );

  const tabs = useMemo(
    () => [
      {
        name: 'Preview Form',
        content: (
          <>
            <ErrorBoundary
              onErr={handleFormError}
              errMessage='Error parsing JSON Schema'
            >
              <Form
                schema={parsedSchema}
                uiSchema={parsedUiSchema}
                onChange={handleFormChange}
                formData={formData}
                validator={validator}
                liveValidate
                onSubmit={handleFormSubmit}
              />
            </ErrorBoundary>
            <Dialog open={outputToggle} onClose={handleDialogClose}>
              <DialogTitle>Form output preview</DialogTitle>
              <DialogContent>
                <ErrorBoundary
                  onErr={emptyErrorHandler}
                  errMessage='Error parsing JSON Schema Form output'
                >
                  <Typography variant='subtitle1' fontWeight='bold'>
                    Output Data
                  </Typography>
                  <Box
                    component='pre'
                    sx={{
                      backgroundColor: 'grey.100',
                      maxHeight: '70vh',
                      overflowY: 'auto',
                      p: 2,
                    }}
                  >
                    {JSON.stringify(submissionData.formData, null, 2)}
                  </Box>
                </ErrorBoundary>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose} color='inherit'>
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ),
      },
      {
        name: 'Visual Form Builder',
        content: (
          <ErrorBoundary onErr={emptyErrorHandler}>
            <FormBuilder
              schema={schema}
              uischema={uischema}
              mods={mods}
              onChange={handleFormBuilderChange}
            />
          </ErrorBoundary>
        ),
      },
      {
        name: 'Pre-Configured Components',
        content: (
          <ErrorBoundary onErr={emptyErrorHandler}>
            <PredefinedGallery
              schema={schema}
              uischema={uischema}
              mods={mods}
              onChange={handleFormBuilderChange}
            />
          </ErrorBoundary>
        ),
      },
      {
        name: 'Edit Schema',
        content: editSchemaTabContent,
      },
    ],
    [
      handleFormError,
      parsedSchema,
      parsedUiSchema,
      handleFormChange,
      formData,
      handleFormSubmit,
      outputToggle,
      handleDialogClose,
      submissionData,
      schema,
      uischema,
      mods,
      handleFormBuilderChange,
      editSchemaTabContent,
    ],
  );

  return (
    <Box
      sx={{
        width: width || '100%',
      }}
    >
      {schemaError && (
        <Alert severity='error' sx={{ mb: 1 }}>
          <Typography variant='subtitle2'>Schema:</Typography> {schemaError}
        </Alert>
      )}
      {schemaUiError && (
        <Alert severity='error' sx={{ mb: 1 }}>
          <Typography variant='subtitle2'>UI Schema:</Typography>{' '}
          {schemaUiError}
        </Alert>
      )}
      {schemaFormErrorFlag && (
        <Alert severity='error' sx={{ mb: 1 }}>
          <Typography variant='subtitle2'>Form:</Typography>{' '}
          {schemaFormErrorFlag}
        </Alert>
      )}
      <Tabs tabs={tabs} />
    </Box>
  );
};

export default JsonSchemaFormEditor;
