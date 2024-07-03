// export const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
export const proxyUrl = '';


export const skills_long = ["Strength Score", "Dexterity Score", "Constitution Score", "Intelligence Score", "Wisdom Score", "Charisma Score"];
export const skill_codes = [3520, 3521, 3522, 3523, 3524, 3525]
export const skills_short = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

export const sortCreaturesByInitiative = (creatures) => {
    return creatures.sort((a, b) => {
        if (a.initiative === null && b.initiative !== null) {
            return 1; // `a` (initiative === null) should come after `b` (initiative !== null)
        } else if (a.initiative !== null && b.initiative === null) {
            return -1; // `a` (initiative !== null) should come before `b` (initiative === null)
        } else if (a.initiative !== null && b.initiative !== null) {
            // Both initiatives are not null, compare them numerically
            return b.initiative - a.initiative;
        } else {
            return 0; // Both are null, maintain the current order
        }
    });
};