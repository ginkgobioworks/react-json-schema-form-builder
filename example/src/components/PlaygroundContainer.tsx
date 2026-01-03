import React, { useState, useCallback, useMemo } from 'react';

import JsonSchemaFormSuite from './JsonSchemaFormSuite';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { exampleMods } from './mods';

// Can be used to set initial schemas and mods (useful for development)
const initialJsonSchema = {};
const initialUiSchema = {};
const mods = exampleMods;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

// Memoize empty error handler to avoid recreating on every render
const emptyErrorHandler = () => {};

export default function PlaygroundContainer({ title }: { title: string }) {
  const [schema, setSchema] = useState(() => JSON.stringify(initialJsonSchema));
  const [uischema, setUischema] = useState(() =>
    JSON.stringify(initialUiSchema),
  );

  const handleChange = useCallback((newSchema: string, newUiSchema: string) => {
    setSchema(newSchema);
    setUischema(newUiSchema);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Container maxWidth='xl' sx={{ py: 3 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent='space-between'
            alignItems={{ xs: 'flex-start', md: 'flex-start' }}
            sx={{ mb: 3 }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant='h5'
                component='h1'
                fontWeight={600}
                gutterBottom
              >
                {title}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                Demo app for the{' '}
                <Link
                  href='https://github.com/ginkgobioworks/react-json-schema-form-builder'
                  target='_blank'
                  rel='noopener'
                >
                  React JSON Schema Form Builder
                </Link>
                , which allows you to visually build a form and obtain the JSON
                Schema corresponding to it.
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Use the <strong>Visual Form Builder</strong> tab to create form
                elements with drag and drop. View the live JSON Schema in{' '}
                <strong>Edit Schema</strong>. Preview your form in{' '}
                <strong>Preview Form</strong>, and manage reusable components in{' '}
                <strong>Pre-Configured Components</strong>.
              </Typography>
            </Box>
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ mt: { xs: 2, md: 0 }, ml: { md: 3 } }}
            >
              <Link
                href='https://react-json-schema-form-builder.readthedocs.io/'
                target='_blank'
                rel='noopener'
              >
                Documentation
              </Link>
              {' · '}
              <Link
                href='https://github.com/ginkgobioworks/react-json-schema-form-builder'
                target='_blank'
                rel='noopener'
              >
                GitHub
              </Link>
            </Typography>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <JsonSchemaFormSuite
              lang={'json'}
              schema={schema}
              uischema={uischema}
              mods={mods}
              schemaTitle='Data Schema'
              uischemaTitle='UI Schema'
              onChange={handleChange}
              width='100%'
            />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
