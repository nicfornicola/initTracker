import '../style/App.css';
import React from 'react';

import aaurelion from '../pics/aaurelion.jpg'
import claael from '../pics/claael.jpg'
// import creator from '../pics/creator.jpg'
import diaadree from '../pics/diaadree.jpg'
import osaalo from '../pics/osaalo.jpg'
import naal from '../pics/naal.jpg'
import naath from '../pics/naath.jpg'
import yathira from '../pics/yathira.jpg'
// import mylaakBattle from '../pics/mylaakBattle.jpg'
import mylaakChaos from '../pics/mylaakChaos.jpg'
// import mylaakRegal from '../pics/mylaakRegal.jpg'
// import mylaakImbued from '../pics/mylaakImbued.jpg'
import Card from './Card';

const Pantheon = () => {
  return (
        <div className='page'>
            
            <Card img={diaadree} name={"Diaadree"} desc={"Heart of the Living Wilds"} />
            <Card img={osaalo} name={"Osaalo"} desc={"Marrow of the Silent Wilds"} />
            <Card img={claael} name={"Claael"} desc={"Warden of the Creators Cast"} />

            <Card img={aaurelion} name={"Aaurelion"} desc={"The Lord of Runes"} />
            <Card img={mylaakChaos} name={"Mylaak"} desc={"God of Chaos"} />
            <Card img={yathira} name={"Yaathira"} desc={"Shepherd of the Forgotten"} />

            <Card img={naath} name={"Naath"} desc={"Keeper of Soul Passage"} />
            <Card img={naal} name={"Naal"} desc={"Soverign of the There-After"} />


            {/* 
            <img className="icon" alt='icon' src={creator} />
            <img className="icon" alt='icon' src={mylaakBattle} />
            <img className="icon" alt='icon' src={mylaakImbued} />
            <img className="icon" alt='icon' src={mylaakRegal} /> */}
        </div>
    
  );
};

export default Pantheon;