import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
const logo = require('../../images/logo_noBG.png');

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
        // You can also log error messages to an error reporting service here
    }

    render() {
        if (this.state.errorInfo) {
            // Error path
            return (
                    <React.Fragment>
                        <AppBar position="static">
                            <Toolbar variant="dense">
                                <Typography variant="h6" color="inherit">
                                    <img width={30} height={30} src={logo} alt="Worktrim Logo" />
                                </Typography>

                                <Typography variant="h6" color="inherit">
                                    Worktrim
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        <br /><br />
                        <Container  maxWidth="sm" className ="app-body-content">
                            <div>
                                <h2 className="danger">Something went wrong.</h2>
                                <details style={{ whiteSpace: 'pre-wrap' }}>
                                    Please try again later or contact support;

                                </details>
                            </div>
                        </Container>
                    </React.Fragment>
            );
        }
        // Normally, just render children
        return this.props.children;
    }
}

export default ErrorBoundary;