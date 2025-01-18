export const actionsConsts =  {
    "atk mw": "melee weapon attack: ",
    "atk rw": "ranged weapon attack: ",
    "atk m": "melee attack:", 
    "atk r": "ranged attack:", 
    "atk a": "area attack:", 
    "atk aw": "area weapon attack:", 
    "atk ms": "melee spell attack:", 
    "atk mw,rw": "melee or ranged weapon attack:", 
    "atk rs": "ranged spell attack:", 
    "atk ms,rs": "melee or ranged spell attack:", 
    "atk m,r": "melee or ranged attack:", 
    "atk mp": "melee power attack:", 
    "atk rp": "ranged power attack:", 
    "atk mp,rp": "melee or ranged power attack:", 
    "atkr m": "melee attack roll:", 
    "atkr r": "ranged attack roll:", 
    "atkr m,r": "melee or ranged attack roll:", 
}

export const legendaryDescDefault = (name) => {
    return `Legendary Action Uses: 3. Immediately after another creature's turn, The ${name} can expend a use to take one of the following actions. The ${name} regains all expended uses at the start of each of its turns.`
}
