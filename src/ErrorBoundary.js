// @flow

import React from "react";

type Props = {
  children: any,
  onErr?: (string) => any,
  errMessage?: string,
};

type State = {
  hasError: boolean,
  error: string,
};

/* 
Container for potentially error generating components
Triggers the optional onErr function with error message as string
Provides the option to attempt rendering the children again
*/
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: "" };
  }

  componentDidCatch(error: any) {
    this.setState({ hasError: true });
    const errorMessage = error.toString();
    this.setState({
      error: errorMessage,
    });
    if (this.props.onErr) this.props.onErr(errorMessage);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p>
            {this.props.errMessage ? this.props.errMessage : this.state.error}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: "" });
              if (this.props.onErr) this.props.onErr("");
            }}
          >
            Try Again
          </button>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
