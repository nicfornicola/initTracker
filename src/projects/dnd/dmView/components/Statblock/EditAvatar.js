import React from 'react';
import uploadImage from '../../pics/uploadImage.png'
const EditAvatar = ({handleUploadMonsterImage, creature, column}) => {

    return (
        <div className="monsterEncounterIconContainer" onClick={(event) => handleUploadMonsterImage(event, creature, column)} >
            <img className="monsterEncounterIcon" src={creature.avatarUrl} alt={"list Icon"} />
            <div className='uploadIconContainer'>
                <img className="uploadIcon" src={uploadImage} alt={"list Icon"} />
            </div>
        </div>
    )
}

export default EditAvatar;