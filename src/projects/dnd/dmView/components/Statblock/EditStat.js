import React, {useEffect, useState} from 'react';

const EditStat = ({label, content, type = 'text'}) => {
    
    const [value, setValue] = useState(content);

    useEffect(() => {
        if(!content) {
            content = type === "number" ? 0 : '--'
        }
        setValue(content)
    }, [content])

    let w, h, alignItems, textAlign = ''
    if(type === 'number') {
        w = '45px';
        alignItems = 'center'
        textAlign = 'center'
    } else if (type === 'checkbox') {
        w = '50px'
        h = '15px'
    }

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <div className='editBlock' style={{alignItems}}>
            <i className='editBlockTitle'>{label}</i>
            <input className="editBlockInput" type={type} style={{width: w, height: h, textAlign: textAlign}}
                value={value}
                onChange={handleChange} 
                onFocus={(e) => {e.target.select()}}
            />
        </div>
    )
}

export default EditStat;