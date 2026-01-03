import React from 'react';
import { render, screen } from '@testing-library/react';
import DependencyWarning from './DependencyWarning';

describe('DependencyWarning', () => {
  it('returns null when there are no enum values', () => {
    const { container } = render(
      <DependencyWarning
        parameters={{
          name: 'test',
          type: 'string',
        }}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('returns null when there are no dependents', () => {
    const { container } = render(
      <DependencyWarning
        parameters={{
          name: 'test',
          enum: ['a', 'b', 'c'],
        }}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('returns null when dependents array is empty', () => {
    const { container } = render(
      <DependencyWarning
        parameters={{
          name: 'test',
          enum: ['a', 'b', 'c'],
          dependents: [],
        }}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('returns null when dependents have no value property', () => {
    const { container } = render(
      <DependencyWarning
        parameters={{
          name: 'test',
          enum: ['a', 'b', 'c'],
          dependents: [{ children: ['child1'] }],
        }}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('returns null when all enum values are covered', () => {
    const { container } = render(
      <DependencyWarning
        parameters={{
          name: 'test',
          enum: ['a', 'b'],
          dependents: [
            {
              children: ['child1'],
              value: { enum: ['a', 'b'] },
            },
          ],
        }}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows warning when some enum values are not covered', () => {
    render(
      <DependencyWarning
        parameters={{
          name: 'test',
          enum: ['a', 'b', 'c'],
          dependents: [
            {
              children: ['child1'],
              value: { enum: ['a'] },
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByText(
        /Warning! The following values do not have associated dependency values:/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
    expect(screen.getByText('c')).toBeInTheDocument();
  });

  it('handles numeric enum values', () => {
    render(
      <DependencyWarning
        parameters={{
          name: 'test',
          enum: [1, 2, 3],
          dependents: [
            {
              children: ['child1'],
              value: { enum: [1] },
            },
          ],
        }}
      />,
    );

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('handles multiple dependents with different enum values', () => {
    const { container } = render(
      <DependencyWarning
        parameters={{
          name: 'test',
          enum: ['a', 'b', 'c'],
          dependents: [
            {
              children: ['child1'],
              value: { enum: ['a'] },
            },
            {
              children: ['child2'],
              value: { enum: ['b', 'c'] },
            },
          ],
        }}
      />,
    );

    // All values are covered by multiple dependents
    expect(container.firstChild).toBeNull();
  });
});
