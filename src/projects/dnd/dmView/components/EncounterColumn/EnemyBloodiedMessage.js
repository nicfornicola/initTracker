import React from 'react';

const EnemyBloodiedMessage = ({enemyBloodToggle}) => {
    let sArray = ["None\n", "Bloodied\n", "Blood & HP\n"]         

    sArray.forEach((str, index) => {
        if(enemyBloodToggle === index) {
            sArray[index] = ">" + str
            
        }
    });

    return (
        <div className="dropdown">
            {sArray}
        </div>
    );
};

export default EnemyBloodiedMessage;
