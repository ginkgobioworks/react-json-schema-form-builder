import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

type Props = {
  children: React.ReactNode;
  onErr?: (arg0: string) => void;
  errMessage?: string;
};

type State = {
  hasError: boolean;
  error: string;
};

/**
 * Container for potentially error generating components.
 * Triggers the optional onErr function with error message as string.
 * Provides the option to attempt rendering the children again.
 *
 * NOTE: This MUST be a class component because React's componentDidCatch
 * lifecycle method is only available in class components. There is no
 * hook equivalent for error boundaries.
 */
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  componentDidCatch(error: Error): void {
    const errorMessage = error.toString();
    this.setState({
      hasError: true,
      error: errorMessage,
    });
    this.props.onErr?.(errorMessage);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: '' });
    this.props.onErr?.('');
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color='error' gutterBottom>
            {this.props.errMessage || this.state.error}
          </Typography>
          <Button
            variant='outlined'
            color='primary'
            onClick={this.handleRetry}
            size='small'
          >
            Try Again
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
