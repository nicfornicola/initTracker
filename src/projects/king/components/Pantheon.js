import '../style/App.css';
import React from 'react';

import aaurelion from '../pics/aaurelion.jpg'
import claael from '../pics/claael.jpg'
import creator from '../pics/creator.jpg'
import diaadree from '../pics/diaadree.jpg'
import osaalo from '../pics/osaalo.jpg'
import naal from '../pics/naal.jpg'
import naath from '../pics/naath.jpg'
import yathira from '../pics/yathira.jpg'
import mylaakBattle from '../pics/mylaakBattle.jpg'
import mylaakChaos from '../pics/mylaakChaos.jpg'
import mylaakRegal from '../pics/mylaakRegal.jpg'
import mylaakImbued from '../pics/mylaakImbued.jpg'


const Pantheon = () => {
  return (
    <>
        <div className='iconContainer'>
            <img className="icon" alt='icon' src={aaurelion} />      
            <img className="icon" alt='icon' src={mylaakChaos} />

            <img className="icon" alt='icon' src={claael} />
            <img className="icon" alt='icon' src={creator} />
            <img className="icon" alt='icon' src={diaadree} />
            <img className="icon" alt='icon' src={osaalo} />
            <img className="icon" alt='icon' src={naal} />
            <img className="icon" alt='icon' src={naath} />
            <img className="icon" alt='icon' src={yathira} />
            <img className="icon" alt='icon' src={mylaakBattle} />
            <img className="icon" alt='icon' src={mylaakImbued} />
            <img className="icon" alt='icon' src={mylaakRegal} />
        </div>
        <hr/>
</>
    
  );
};

export default Pantheon;