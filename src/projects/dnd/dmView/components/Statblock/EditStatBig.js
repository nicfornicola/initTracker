import React, {useEffect, useRef} from 'react';

function getDesc(object) {
    return object.desc || object.description || "No Description found :("
}

const EditStatBig = ({label, content = [], category, handleChange = undefined}) => {
    //catergory, name, desc or description
    if(!content || content.length === 0)
        content = [{name: 'None', desc: '--'}]

    const textareaRefs = useRef([]);
    
    useEffect(() => {
        textareaRefs.current.forEach((textarea) => {
            if (textarea) {
                textarea.style.height = "auto"; 
                textarea.style.height = `${textarea.scrollHeight}px`; 
            }
        });
    }, []);


    const handleFocus = (e) => { 
        if(e.target.value === 'None' || e.target.value === '--') 
            e.target.select();
    }
    
    return (
        <div className='editBlock'>
            <i className='editBlockTitle'>{label}</i>
            {content.map((action, index) => (
                <div key={label + index}>
                    <input className="editBlockInput" type='text'
                        value={action.name}
                        onChange={(e) => handleChange(e, 'name', category, index)} 
                        onBlur={(e) => handleChange(e, 'name', category, index, true)} 
                        size={action.name.length}
                        onFocus={handleFocus}
                    />
                    <textarea
                        ref={(element) => (textareaRefs.current[index] = element)} 
                        className="editBlockBigInput"
                        type="text"
                        value={getDesc(action)}
                        onChange={(e) => handleChange(e, 'desc', category, index)} 
                        onBlur={(e) => handleChange(e, 'desc', category, index, true)} 
                        onFocus={handleFocus}
                    />                
                </div>
            ))}
        </div>
    )
}

export default EditStatBig;