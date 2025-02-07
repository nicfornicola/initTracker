import React, {useState} from 'react';
import magMinus from '../../pics/icons/magMinus.PNG'
import OptionButton from '../EncounterColumn/OptionButton'
import { generateUniqueId } from '../../constants';

const EditSpellInput = ({spellName, path, objIndex, handleChange = undefined}) => {
    const [value, setValue] = useState(spellName)
    const [key] = useState(generateUniqueId())

    if(typeof spellName !== 'string') {
        return null
    }

    return (
        <li key={key} className='spellLi'>
            <input className="editBlockInput" type='text'
                value={value}
                onChange={(e) => setValue(e.target.value)} 
                onBlur={(e) => handleChange(e, 'change', path, objIndex, true)} 
                size={spellName.length}
            />
            <OptionButton wrapperClassName='spellTrash' src={magMinus} message={`Remove: ${spellName.replace(/{@spell|}/g, "")}`}
                onClickFunction={(e) => handleChange(e, 'remove', path, objIndex, true)}
            />
        </li>
    )
}

export default EditSpellInput;