import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PredefinedGallery from './PredefinedGallery';

// Mock CardGallery
jest.mock('./CardGallery', () => {
  return function MockCardGallery({
    definitionSchema,
    definitionUiSchema,
    onChange,
  }: {
    definitionSchema: { [key: string]: any };
    definitionUiSchema: { [key: string]: any };
    onChange: (defs: any, defsUi: any) => void;
    mods?: any;
    categoryHash: { [key: string]: string };
  }) {
    return (
      <div data-testid='card-gallery'>
        <div data-testid='definitions-count'>
          {Object.keys(definitionSchema).length}
        </div>
        <div data-testid='definitions-ui-count'>
          {Object.keys(definitionUiSchema).length}
        </div>
        <button
          onClick={() => onChange({ newDef: {} }, { newDef: {} })}
          data-testid='gallery-change'
        >
          Change
        </button>
      </div>
    );
  };
});

// Mock utils - use actual implementations
jest.requireActual('./utils');

describe('PredefinedGallery', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    jest.clearAllMocks();
  });

  it('renders CardGallery with definitions', () => {
    render(
      <PredefinedGallery
        schema='{"definitions":{"test":{}}}'
        uischema='{"definitions":{"test":{}}}'
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByTestId('card-gallery')).toBeInTheDocument();
    expect(screen.getByTestId('definitions-count')).toHaveTextContent('1');
    expect(screen.getByTestId('definitions-ui-count')).toHaveTextContent('1');
  });

  it('renders CardGallery with empty definitions', () => {
    render(
      <PredefinedGallery
        schema='{"definitions":{}}'
        uischema='{"definitions":{}}'
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByTestId('card-gallery')).toBeInTheDocument();
    expect(screen.getByTestId('definitions-count')).toHaveTextContent('0');
  });

  it('handles gallery change', () => {
    render(
      <PredefinedGallery
        schema='{"definitions":{"old":{}}}'
        uischema='{"definitions":{"old":{}}}'
        onChange={mockOnChange}
      />,
    );

    const changeButton = screen.getByTestId('gallery-change');
    changeButton.click();

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('creates definitions in uiSchema when missing but refs exist', async () => {
    render(
      <PredefinedGallery
        schema='{"properties":{"field":{"$ref":"#/definitions/test"}}}'
        uischema='{"test":{}}'
        onChange={mockOnChange}
      />,
    );

    // Wait for useEffect to run and call onChange
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it('handles mods with customFormInputs', () => {
    const mods = {
      customFormInputs: {
        custom: {
          displayName: 'Custom',
          matchIf: [{ types: ['string' as const], widget: 'custom' }],
          defaultDataSchema: {},
          defaultUiSchema: { 'ui:widget': 'custom' },
          type: 'string' as const,
          cardBody: () => <div>Custom</div>,
          modalBody: () => <div />,
        },
      },
    };

    render(
      <PredefinedGallery
        schema='{"definitions":{}}'
        uischema='{"definitions":{}}'
        onChange={mockOnChange}
        mods={mods}
      />,
    );

    expect(screen.getByTestId('card-gallery')).toBeInTheDocument();
  });

  it('handles mods with deactivatedFormInputs', () => {
    const mods = {
      deactivatedFormInputs: ['shortAnswer'],
    };

    render(
      <PredefinedGallery
        schema='{"definitions":{}}'
        uischema='{"definitions":{}}'
        onChange={mockOnChange}
        mods={mods}
      />,
    );

    expect(screen.getByTestId('card-gallery')).toBeInTheDocument();
  });

  it('handles empty schema strings', () => {
    render(
      <PredefinedGallery schema='{}' uischema='{}' onChange={mockOnChange} />,
    );

    expect(screen.getByTestId('card-gallery')).toBeInTheDocument();
  });
});
