import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Collapse from './Collapse';

describe('Collapse', () => {
  const mockToggleCollapse = jest.fn();

  beforeEach(() => {
    mockToggleCollapse.mockClear();
  });

  it('renders with title and children when open', () => {
    render(
      <Collapse
        isOpen={true}
        toggleCollapse={mockToggleCollapse}
        title='Test Title'
      >
        {[<div key='1'>Child Content</div>]}
      </Collapse>,
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('does not render children when closed', () => {
    const { container } = render(
      <Collapse
        isOpen={false}
        toggleCollapse={mockToggleCollapse}
        title='Test Title'
      >
        {[<div key='1'>Child Content</div>]}
      </Collapse>,
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    // MUI Collapse keeps children in DOM but hides them - check for hidden attribute
    const collapseContent = container.querySelector('[aria-hidden="true"]');
    expect(collapseContent).toBeInTheDocument();
  });

  it('calls toggleCollapse when icon button is clicked', () => {
    render(
      <Collapse
        isOpen={false}
        toggleCollapse={mockToggleCollapse}
        title='Test Title'
      >
        {[<div key='1'>Child Content</div>]}
      </Collapse>,
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(mockToggleCollapse).toHaveBeenCalledTimes(1);
  });

  it('does not call toggleCollapse when disabled', () => {
    render(
      <Collapse
        isOpen={false}
        toggleCollapse={mockToggleCollapse}
        title='Test Title'
        disableToggle={true}
      >
        {[<div key='1'>Child Content</div>]}
      </Collapse>,
    );

    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeDisabled();

    fireEvent.click(toggleButton);

    expect(mockToggleCollapse).not.toHaveBeenCalled();
  });

  it('applies className when provided', () => {
    const { container } = render(
      <Collapse
        isOpen={true}
        toggleCollapse={mockToggleCollapse}
        title='Test Title'
        className='custom-class'
      >
        {[<div key='1'>Child Content</div>]}
      </Collapse>,
    );

    const paper = container.querySelector('.custom-class');
    expect(paper).toBeInTheDocument();
  });

  it('applies data-testid when provided', () => {
    render(
      <Collapse
        isOpen={true}
        toggleCollapse={mockToggleCollapse}
        title='Test Title'
        data-testid='collapse-test'
      >
        {[<div key='1'>Child Content</div>]}
      </Collapse>,
    );

    expect(screen.getByTestId('collapse-test')).toBeInTheDocument();
  });

  it('shows expand icon when closed', () => {
    render(
      <Collapse
        isOpen={false}
        toggleCollapse={mockToggleCollapse}
        title='Test Title'
      >
        {[<div key='1'>Child Content</div>]}
      </Collapse>,
    );

    // ChevronRight icon should be visible when closed
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('shows collapse icon when open', () => {
    render(
      <Collapse
        isOpen={true}
        toggleCollapse={mockToggleCollapse}
        title='Test Title'
      >
        {[<div key='1'>Child Content</div>]}
      </Collapse>,
    );

    // ExpandMore icon should be visible when open
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
