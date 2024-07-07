import React from 'react';
import '../style/App.css';
import tiredGuy from '../pics/exhausted.png'; 

const Exhaustion = ({exhaustionLvl}) => {
  return (
    <div className="exhaustionContainer">
      <img className="exhaustionImg" src={tiredGuy} alt='exhaustion'/>
      <p className='exhaustionText'>x{exhaustionLvl}</p>
    </div>
  );
}

export default Exhaustion;