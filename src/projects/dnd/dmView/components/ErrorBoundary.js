import React from "react";
import defaultBackground from '../pics/backgrounds/happyTavern.png'
import ReactGA from "react-ga4";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details to Google Analytics
        ReactGA.event({
            category: "Error",
            label: error.message, // Short description of the error
            value: errorInfo.componentStack ? errorInfo.componentStack.length : 0,
        });

        // Log as pageview
        ReactGA.send({
            hitType: "pageview",
            page: "/error",
            title: "Error Page",
        });
        console.error("ErrorBoundary:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="background " style={{backgroundImage: `url(${defaultBackground})`}}>
                    <div className=" firstLoadMenuContainer">
                        <div className="firstLoadMenu">
                            <div className="homepageTopContent">
                                <h1>🦗Woah! You found a bug! 🐜</h1>
                                <p style={{margin: 0}}>I probably don't know about this bug so please reach out!</p>
                                <p style={{margin: '5px', padding: '5px', border: '2px solid grey'}}><b>nicfornicola@gmail.com</b> or <b>staygo</b> on discord</p>
                                <ul>
                                    <li>
                                        Try refreshing the page
                                    </li>
                                    <li>
                                        Try recreating your encounter
                                    </li>
                                </ul>
                                
                                <details style={{ whiteSpace: "pre-wrap" }}>
                                    <summary>Error message for nerds</summary>
                                    {this?.state?.error?.toString()}
                                    <br />
                                    {this.state.errorInfo?.componentStack}
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;