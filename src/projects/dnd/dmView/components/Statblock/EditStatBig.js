import React, {useEffect, useRef} from 'react';
import OptionButton from '../EncounterColumn/OptionButton'
import magPlus from '../../pics/icons/magPlus.PNG'
import magMinus from '../../pics/icons/magMinus.PNG'


function getDesc(object) {
    return object.desc || object.description || "No Description found :("
}

const EditStatBig = ({label, content = [], category, handleChange = undefined}) => {

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
            {content?.map((action, index) => (
                <div key={label + index} className='actionListItem'>
                    <div style={{display: 'flex'}}>
                        <input className="editBlockInput" type='text'
                            value={action.name}
                            onChange={(e) => handleChange(e, 'name', category, index)} 
                            onBlur={(e) => handleChange(e, 'name', category, index, true)} 
                            size={action.name.length}
                            onFocus={handleFocus}
                        />
                        <OptionButton src={magMinus} message={`Remove: ${action.name}`} onClickFunction={(e) => handleChange(e, 'remove', category, index, true)} wrapperClassName='actionTrash'/>
                    </div>
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
            <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                <OptionButton src={magPlus} message={`Add ${label.slice(0, -1)}`} onClickFunction={(e) => handleChange(e, 'add', category)}/>
            </div>
            
        </div>
    )
}

export default EditStatBig;