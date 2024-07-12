import '../style/App.css';
import React from 'react';


const Card = ({img, name, desc}) => {
  return (
        <div className='iconContainer'>
            <img className="icon" alt='icon' src={img} />
            <div className='detailsContainer'>
                <div className="detail iconName"> {name} </div>
                <div className="detail iconDescription"> {desc} </div>
            </div>
        </div>
  );
};

export default Card;