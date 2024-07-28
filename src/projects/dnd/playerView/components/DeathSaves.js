import '../style/App.css';
import React from 'react';
import deathSaveDefault from '../pics/icons/deathSaveDefault.png'
import deathSaveFail from '../pics/icons/deathSaveFail.png'
import deathSaveSuccess from '../pics/icons/deathSaveSuccess.png'
const DeathSaves = ({deathSaves}) => {

    const saves = [];
    const fails = [];

    let saveCount = deathSaves.successCount;
    let failCount = deathSaves.failCount;

    for (let i = 0; i < 3; i++) {
        saves.push(<img key={i} alt="deathSaves" className="circle" src={saveCount > 0 ? deathSaveSuccess : deathSaveDefault} />);
        fails.push(<img key={i} alt="deathSaves" className="circle" src={failCount > 0 ? deathSaveFail : deathSaveDefault} />);
        saveCount--;
        failCount--;
    }

    return (
        <div className="grid">
            {saves}
            {fails}
        </div>
    );
};

export default DeathSaves;