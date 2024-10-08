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

const SkillGrid = ({creature}) => {
   
    return (
        <div className="skillGridContainer">
            <TitleRow/>
            <SkillGridItem skill={'STR'} skillMod={creature.strength} skillSaveMod= {creature.strength_save}/>
            <SkillGridItem skill={'DEX'} skillMod={creature.dexterity} skillSaveMod= {creature.dexterity_save}/>
            <SkillGridItem skill={'CON'} skillMod={creature.constitution} skillSaveMod= {creature.constitution_save}/>
            <SkillGridItem skill={'INT'} skillMod={creature.intelligence} skillSaveMod= {creature.intelligence_save}/>
            <SkillGridItem skill={'WIS'} skillMod={creature.wisdom} skillSaveMod= {creature.wisdom_save}/>
            <SkillGridItem skill={'CHA'} skillMod={creature.charisma} skillSaveMod= {creature.charisma_save}/>
        </div>
    );
}

export default SkillGrid;