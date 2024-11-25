import React from 'react';
import SkillGridItem from './SkillGridItem';

const Spacer = () => {
    return <div className="skillGridHeader"/>
}

const Titles = () => {
    return (
        <>
            <Spacer/>
            <Spacer/>
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

const SkillGrid = ({creature, edit=false}) => {
   
    return (
        <div className="skillGridContainer">
            <TitleRow/>
            <SkillGridItem skill={'STR'} skillMod={creature.strength} skillSaveMod= {creature.strength_save} edit={edit}/>
            <SkillGridItem skill={'DEX'} skillMod={creature.dexterity} skillSaveMod= {creature.dexterity_save} edit={edit}/>
            <SkillGridItem skill={'CON'} skillMod={creature.constitution} skillSaveMod= {creature.constitution_save} edit={edit}/>
            <SkillGridItem skill={'INT'} skillMod={creature.intelligence} skillSaveMod= {creature.intelligence_save} edit={edit}/>
            <SkillGridItem skill={'WIS'} skillMod={creature.wisdom} skillSaveMod= {creature.wisdom_save} edit={edit}/>
            <SkillGridItem skill={'CHA'} skillMod={creature.charisma} skillSaveMod= {creature.charisma_save} edit={edit}/>
        </div>
    );
}

export default SkillGrid;