import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

type EditSchemaTabProps = {
  schemaText: string;
  uischemaText: string;
  schemaError: string;
  schemaUiError: string;
  onSchemaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUiSchemaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const EditSchemaTab = React.memo(
  ({
    schemaText,
    uischemaText,
    schemaError,
    schemaUiError,
    onSchemaChange,
    onUiSchemaChange,
  }: EditSchemaTabProps) => {
    return (
      <Stack direction='row' spacing={2}>
        <Box sx={{ flex: 1 }}>
          <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
            Data Schema
          </Typography>
          <TextField
            multiline
            fullWidth
            value={schemaText}
            onChange={onSchemaChange}
            error={!!schemaError}
            helperText={schemaError || ''}
            slotProps={{
              input: {
                sx: {
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                },
              },
            }}
            sx={{
              '& .MuiInputBase-root': {
                alignItems: 'flex-start',
              },
            }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
            UI Schema
          </Typography>
          <TextField
            multiline
            fullWidth
            value={uischemaText}
            onChange={onUiSchemaChange}
            error={!!schemaUiError}
            helperText={schemaUiError || ''}
            slotProps={{
              input: {
                sx: {
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                },
              },
            }}
            sx={{
              '& .MuiInputBase-root': {
                alignItems: 'flex-start',
              },
            }}
          />
        </Box>
      </Stack>
    );
  },
);

EditSchemaTab.displayName = 'EditSchemaTab';

export default EditSchemaTab;
