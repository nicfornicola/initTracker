import React from "react";
import defaultBackground from '../pics/backgrounds/happyTavern.png'

class ErrorBoundary extends React.Component {


    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render shows the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can log the error to an error reporting service here
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // Render fallback UI
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
                                        Try reacreating your encounter
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