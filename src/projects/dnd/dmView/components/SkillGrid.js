import React from 'react';
import SkillGridItem from './SkillGridItem';

const Titles = () => {
    return (
        <>
            <div className="skillGridHeader"/>
            <div className="skillGridHeader titleFontFamily">Score</div>
            <div className="skillGridHeader titleFontFamily">Mod</div>
            <div className="skillGridHeader titleFontFamily">Save</div>
        </>
    )
}

const TitleRow = () => {
    return (
        <> 
            <Titles/>
            <Titles/>
            <Titles/>
        </>
    )
}

const SkillGrid = ({creature, edit=false, handleChange}) => {
   
    return (
        <div className="skillGridContainer">
            <TitleRow/>
            <SkillGridItem skillName={'STR'} skillTotal={creature.strength} skillSave={creature.strength_save} edit={edit} handleChange={handleChange}/>
            <SkillGridItem skillName={'DEX'} skillTotal={creature.dexterity} skillSave={creature.dexterity_save} edit={edit} handleChange={handleChange}/>
            <SkillGridItem skillName={'CON'} skillTotal={creature.constitution} skillSave={creature.constitution_save} edit={edit} handleChange={handleChange}/>
            <SkillGridItem skillName={'INT'} skillTotal={creature.intelligence} skillSave={creature.intelligence_save} edit={edit} handleChange={handleChange}/>
            <SkillGridItem skillName={'WIS'} skillTotal={creature.wisdom} skillSave={creature.wisdom_save} edit={edit} handleChange={handleChange}/>
            <SkillGridItem skillName={'CHA'} skillTotal={creature.charisma} skillSave={creature.charisma_save} edit={edit} handleChange={handleChange}/>
        </div>
    );
}

export default SkillGrid;