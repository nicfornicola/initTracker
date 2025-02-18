import React from 'react';

const EnemyBloodiedMessage = ({enemyBloodToggle}) => {
    let optionArr = ["None", "Bloodied", "Blood & HP"]         

    optionArr.forEach((str, index) => {
        if(enemyBloodToggle === index) {
            optionArr[index] = <strong>{">" + str}</strong>
            
        }
    });

    return (
        <>
            {optionArr.map((s) => {
                return <span className='tooltiptext'>{s}</span>
            })}
        </>
    );
};

export default EnemyBloodiedMessage;
