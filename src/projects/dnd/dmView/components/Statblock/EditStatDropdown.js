import React from 'react';

function capsFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

const EditStatDropdown = ({label, options, value, cKey, handleChange = undefined}) => {

    return (
        <div className='editBlock'>
            <i className='editBlockTitle'>{label}</i>
            <select className='editBlockInput' 
                style={{width: 'fit-content'}}
                value={value ? capsFirstLetter(value) : '--'} 
                onChange={(e) => handleChange(e, cKey)}
                onBlur={(e) => handleChange(e, cKey, undefined, undefined, true)}
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default EditStatDropdown;