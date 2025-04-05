import React, {useEffect, useRef} from 'react';
import OptionButton from '../EncounterColumn/OptionButton'
import magPlus from '../../pics/icons/magPlus.PNG'
import magMinus from '../../pics/icons/magMinus.PNG'
import EditStat from './EditStat';
import EditStatTextArea from './EditStatTextArea';

function getDesc(object) {
    return object.desc || object.description || "No Description found :("
}

const EditStatBig = ({label, content = [], category, handleChange = undefined}) => {

    return (
        <div className='editBlock'>
            <i className='editBlockTitle'>{label}</i>
            {content?.map((action, index) => (
                <div key={label + index} className='actionListItem'>
                    <div style={{display: 'flex'}}>
                        <EditStat value={action.name} cKey={'name'} category={category} index={index} handleChange={handleChange} showLabel={false} />
                        <OptionButton src={magMinus} message={`Remove: ${action.name}`} onClickFunction={(e) => handleChange(e, 'remove', category, index, true)} wrapperClassName='actionTrash'/>
                    </div>
                    <EditStatTextArea value={getDesc(action)} category={category} index={index} handleChange={handleChange}/>
                </div>
            ))}
            <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                <OptionButton src={magPlus} message={`Add ${label.slice(0, -1)}`} onClickFunction={(e) => handleChange(e, 'add', category)}/>
            </div>
            
        </div>
    )
}

export default EditStatBig;