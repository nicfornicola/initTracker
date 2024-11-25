import React, { useState } from 'react';

function capsFirstLetter(word) {
    if (word === '--')
        return '--'; // Handle empty or undefined input
    return word.charAt(0).toUpperCase() + word.slice(1);
}

const StatblockDropdown = ({label, options, content = '--'}) => {
  const [selectedOption, setSelectedOption] = useState(capsFirstLetter(content));

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className='editBlock'>
        <i className='editBlockTitle'>{label}</i>
        <select className='editBlockInput' value={selectedOption} onChange={handleChange}>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
  );
}

export default StatblockDropdown;