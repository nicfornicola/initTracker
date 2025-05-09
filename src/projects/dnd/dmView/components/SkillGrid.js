import React from 'react';
import SkillGridItem from './SkillGridItem';

const changeName = window.location.search.includes('becca')

const Titles = () => {
    return (
        <>
            <div className="skillGridHeader"/>
            <div className="skillGridHeader titleFontFamily"></div>
            <div className="skillGridHeader titleFontFamily">Mod</div>
            {!changeName && 
                <div className="skillGridHeader titleFontFamily">Save</div>
            }
        </>
    )
}

const TitleRow = () => {
    return (
        <> 
            <Titles/>
            <Titles/>
            {!changeName && 
                <Titles/>
            }
        </>
    )
}

const SkillGrid = ({creature, edit=false, handleChange}) => {
   
    return (
        <div className="skillGridContainer" style={changeName ? {gridTemplateColumns: 'repeat(6, minmax(0, 1fr))'} : {}}>
            <TitleRow/>
            <SkillGridItem skillName={'STR'} skillTotal={creature.strength} skillSave={creature.strength_save} edit={edit} handleChange={handleChange}/>
            <SkillGridItem skillName={'DEX'} skillTotal={creature.dexterity} skillSave={creature.dexterity_save} edit={edit} handleChange={handleChange}/>
            <SkillGridItem skillName={'CON'} skillTotal={creature.constitution} skillSave={creature.constitution_save} edit={edit} handleChange={handleChange}/>
            <SkillGridItem skillName={'INT'} skillTotal={creature.intelligence} skillSave={creature.intelligence_save} edit={edit} handleChange={handleChange}/>
            {!changeName && 
                <>
                    <SkillGridItem skillName={'WIS'} skillTotal={creature.wisdom} skillSave={creature.wisdom_save} edit={edit} handleChange={handleChange}/>
                    <SkillGridItem skillName={'CHA'} skillTotal={creature.charisma} skillSave={creature.charisma_save} edit={edit} handleChange={handleChange}/>
                </>
            }
        </div>
    );
}

export default SkillGrid;