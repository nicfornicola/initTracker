import React from 'react';

const NewEncounterButton = ({handleNewEncounter}) => {

    return (
        <button className='dmViewButton' onClick={handleNewEncounter} > New Encounter </button>
    );
};

export default NewEncounterButton;
