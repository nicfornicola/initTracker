import React from 'react';
import '../style/App.css'; // Import your CSS file
import deathSaveDefault from '../pics/deathSaveDefault.png'
import deathSaveFail from '../pics/deathSaveFail.png'
import deathSaveSuccess from '../pics/deathSaveSuccess.png'
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