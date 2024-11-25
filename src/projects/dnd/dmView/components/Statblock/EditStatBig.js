import React, {useEffect, useRef} from 'react';

function getDesc(object) {
    return object.desc || object.description || "No Description found :("
}

const EditStatBig = ({label, content = []}) => {
    if(content === null)
        content = [{name: 'None', desc: '--'}]

    const textareaRefs = useRef([]);
    

    useEffect(() => {
        textareaRefs.current.forEach((textarea) => {
            if (textarea) {
                textarea.style.height = "auto"; // Reset the height to calculate properly
                textarea.style.height = `${textarea.scrollHeight}px`; // Adjust the height
            }
        });
    }, [content]);

    return (
        <div className='editBlock'>
            <i className='editBlockTitle'>{label}</i>
            {content.map((action, index) => (
                <div key={action.name + index}>
                    <input className="editBlockInput" type='text' value={action.name} size={action.name.length} style={{fontWeight: 'bold'}} />
                    <textarea
                        ref={(element) => (textareaRefs.current[index] = element)} // Assign the ref
                        className="editBlockBigInput"
                        type="text"
                        defaultValue={getDesc(action)}
                    />                
                </div>
            ))}
        </div>
    )
}

export default EditStatBig;