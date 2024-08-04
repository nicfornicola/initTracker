import React from 'react';

const EncounterListTitleEdit = ({inputRef, encounterName, handleEditTitleChange, handleCloseEditBox}) => {
    return (
        <>
            <label className='titleLabel animated-label' htmlFor="titleEdit" >Name Your Encounter</label>
            <div name="titleEdit" className='encounterTitleEditContainer'>
                <input
                    ref={inputRef}
                    className='encounterTitleEditInput'
                    type="text"
                    value={encounterName === 'Name Your Encounter' ? '' : encounterName}
                    onChange={handleEditTitleChange}
                    autoFocus
                />
                <button className='submitButton' onClick={() => handleCloseEditBox("save")}>✅</button>
                <button className='submitButton' onClick={() => handleCloseEditBox("close")}>❌</button>
            </div>
        </>
       
    );
}

export default EncounterListTitleEdit;