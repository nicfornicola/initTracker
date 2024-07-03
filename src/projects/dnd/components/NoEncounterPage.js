import '../style/App.css';
import React from 'react';
import urlSnippet from '../pics/urlSnippet.png';
import CorsDemoMessage from './CorsDemoMessage.js';

function NoEncounterPage() {
    return (
        <div>
            <ul>
                <CorsDemoMessage />
                <li>Click one of your encounters</li>
                <li>Get the encounter ID from the url: ⬇️⬇⬇️⬇⬇️</li>
                <li><img src={urlSnippet} alt="snippet" width="60%" height="20%"/></li>
                <li>Add encounter ID to the url, like this </li>
                <ul>
                    <li>
                        <a href="/dnd/aa3f3817-f44b-4116-b2e5-39e1eebc9f7d">
                            nicfornicola.com/dnd/aa3f3817-f44b-4116-b2e5-39e1eebc9f7d
                        </a>
                    </li>
                </ul>
                <li><strong>Go</strong></li>
            </ul>
        </div>
    );
}

export default NoEncounterPage;
