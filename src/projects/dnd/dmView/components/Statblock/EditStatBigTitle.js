import React, {useState} from 'react';

const EditStatBigTitle = ({creature, actionTitle, cKey, index, socket = undefined}) => {
    const [value, setValue] = useState(actionTitle);
    const [previous, setPrevious] = useState(actionTitle);

    const handleChange = (event, send = false) => {
        setValue(event.target.value);

        // Only submit onBlur and when the title has changed
        if(send && event.target.value !== previous) {
            setPrevious(event.target.value)
            // socket.emit('statBlockEdit', creature.creatureGuid, cKey, index, event.target.value)
        }
        
    };

    return (
        <input className="editBlockInput" type='text'
            value={value}
            onChange={handleChange} 
            onBlur={(e) => handleChange(e, true)} 
            size={actionTitle.length}
        />
    )
}

export default EditStatBigTitle;