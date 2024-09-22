import '../../dmView/style/App.css';
import React from 'react';

function CorsDemoMessage() {
    return (
        <div>
            <li>Go here and click the <strong>"Request button"</strong> then come back to this page.
                <ul>
                    <li>
                        <a style={{color: "white"}} href="https://cors-anywhere.herokuapp.com/corsdemo">
                            https://cors-anywhere.herokuapp.com/corsdemo
                        </a>
                    </li>
                </ul>
            </li>
        </div>
    );
}

export default CorsDemoMessage;
