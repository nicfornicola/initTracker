import React, {useState} from 'react';


const EncounterListItem = ({index, creatureListItem, setEncounterSelectedCreature, clickEncounterCreatureX}) => {
    const [openEditWidget, setOpenEditWidget] = useState(false);
    const [hpChange, setHpChange] = useState(0);
    const [tempHp, setTempHp] = useState(creatureListItem.open5e.hit_points_temp);
    const [overrideHp, setOverrideHp] = useState(creatureListItem.open5e.hit_points_override || 0);
    const [creature, setCreature] = useState(creatureListItem)
    // console.log("render", creature)

    let initiative = 0

    const openEditCreatureStats = (event) => {
        event.stopPropagation(); 
        setOpenEditWidget(!openEditWidget)
    }

    // TODO: if temp hp remove that first, dont go past max
    const handleChangeHpCreature = (type) => {
        console.log(type, hpChange)
        let hpNum = hpChange;
        if(type === 'damage') {

            console.log("temp", creature.open5e.hit_points_temp)
            if(creature.open5e.hit_points_temp > 0) {
                let tempHpRemainder = creature.open5e.hit_points_temp - hpChange
                console.log("?", tempHpRemainder)
                if(tempHpRemainder <= 0) {
                    hpNum = Math.abs(tempHpRemainder)
                    creature.open5e.hit_points_temp = 0
                } else {
                    hpNum = 0
                    creature.open5e.hit_points_temp = tempHpRemainder
                }

                setTempHp(creature.open5e.hit_points_temp)
            }

            hpNum *= -1                
        }
        console.log("===")

        creature.open5e.hit_points_current = creature.open5e.hit_points_current + hpNum

        if(creature.open5e.hit_points_current > creature.open5e.hit_points)
            creature.open5e.hit_points_current = creature.open5e.hit_points

        setCreature({...creature})
        // console.log(creature.open5e.hit_points_current + "/" + creature.open5e.hit_points)
    }

    const handleOverrideHp = (event) => {
        let override = parseInt(event.target.value)
        // Set override in creature
        console.log("override", event.target.value)
        creature.open5e.hit_points_override = override
        // Find old diff between current and max
        let dif = creature.open5e.hit_points - creature.open5e.hit_points_current

        if(override === 0 || isNaN(override)) {
            creature.open5e.hit_points = creature.open5e.hit_points_default
        } else {
            // Change max to override, make current the same dif
            creature.open5e.hit_points = override
        }

        creature.open5e.hit_points_current = creature.open5e.hit_points - dif

       
        setOverrideHp(override)
        setCreature({...creature})
    }

    const handleTempHp = (event) => {
        console.log("temp", event.target.value)
        let tempHp = parseInt(event.target.value)
        creature.open5e.hit_points_temp = isNaN(tempHp) ? 0 : tempHp
        setTempHp(creature.open5e.hit_points_temp)
        setCreature({...creature})
    }

    return (
        <>
            <li className='encounterCreaturesListItem animated-box'
                onClick={() => setEncounterSelectedCreature(creature)}
            >
                <img className="monsterSearchIcon" src={creature.avatarUrl} alt={"list Icon"} />
                <span>{creature.name}</span>
                {creature.open5e.hit_points !== null  ? 
                    <>
                        <button className='encounterCreaturesHp'>
                            {initiative}
                        </button>
                        <button className='encounterCreaturesHp' onClick={(event) => openEditCreatureStats(event)}>
                            {creature.open5e.hit_points_current}
                            <span>/</span>
                            {creature.open5e.hit_points}

                            {tempHp !== 0 && (
                                <span className='tempHp'> (+{tempHp}) </span>
                            )}

                        </button>
                        <button>{creature.open5e.armor_class}</button>
                        
                    </> 
                :
                    <div className='encounterCreaturesHp'/>
                }
                <button className='encounterCreatureX' onClick={(event) => clickEncounterCreatureX(event, creature.name, index)}>
                X
                </button>
            </li>
            {openEditWidget && ( 
                <div className='editStatsContainer shadowBox editHpGrow '>
                    <div className="infoContainerFlag"/>

                    <div className='overHpContainer'>
                        <label className='hpTitle' htmlFor='temphp'>Temp HP</label>
                        <input id='temphp' className='editStatsInput' value={tempHp || 0} onChange={handleTempHp}/>
                        <label className='hpTitle' htmlFor='override'>Override HP </label>
                        <input id='override' className='editStatsInput' defaultValue={overrideHp || 0} onChange={handleOverrideHp}/>
                    </div>

                    <div className='editHpContainer'>
                        <button className='editHpButton' onClick={() => handleChangeHpCreature("heal")}>Heal</button>
                        <input className='editStatsInput' placeholder={"0"} onChange={(event) => setHpChange(parseInt(event.target.value))} autoFocus/>
                        <button className='editHpButton' onClick={() => handleChangeHpCreature("damage")}>Damage</button>
                    </div>
                </div>
            )}
        </>
  );
}

export default EncounterListItem;