import React, { useState } from 'react';


const EditStatTextArea = ({value, category = undefined, index = undefined, handleChange}) => {
    const [content, setContent] = useState(value)

    const validate = (e, cKey, category, index, send = false) => {
        if(send) {
            handleChange(e, cKey, category, index, send)
        } else {
            setContent(e.target.value)
        }
    }

    const handleFocus = (e) => { 
        if(e.target.value === 'None' || e.target.value === '--') 
            e.target.select();
    }

    return (
        <textarea
            className="editBlockBigInput"
            type="text"
            value={content}
            onChange={(e) => validate(e, 'desc', category, index)} 
            onBlur={(e) => validate(e, 'desc', category, index, true)} 
            onFocus={handleFocus}
        />   
    )
}

export default EditStatTextArea;