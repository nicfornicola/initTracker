export class Profile {
    constructor(creature = null, playerHpData = null ) {
        const type = creature.userName ? "player" : "monster"
        this.guid = creature.guid;
        this.avatarUrl = creature.avatarUrl || "https://www.dndbeyond.com/avatars/42718/687/1581111423-121476494.jpeg";
        this.type = type;
        this.effects = [];

        // if coming from /dnd/dm
        if(creature.id.toString().includes("open5e")) {
            this.name = creature.open5e.name; // Get custom names
            this.id = Math.floor(Math.random() * 1000) + 1 // Give it an id, to match dnd beyond stuff
            this.monsterCurrentHp = creature.open5e.hit_points_current || 0;
            this.maxHp = creature.open5e.hit_points || 0;
            this.maxHpBonus = null;
            this.maxHpOverride =  null;
            this.removedHp =  null;
            this.tempHp = creature.open5e.hit_points_temp;
            this.exhaustionLvl = null;
            this.deathSaves = null;
            this.initiative = creature.open5e.initiative || 0;
            this.type = creature.id.includes("global") ? "global" : "monster";
        } else { // else is from dnd beyond
            
            this.name = creature.name;
            this.id = creature.id;
            this.initiative = creature.initiative;

            if(type === "player") {
                this.maxHp = playerHpData.maxHp
                this.maxHpBonus = playerHpData.maxHpBonus
                this.maxHpOverride = playerHpData.maxHpOverride
                this.removedHp = playerHpData.removedHp
                this.tempHp = playerHpData.tempHp
                this.exhaustionLvl = playerHpData.exhaustionLvl
                this.deathSaves = playerHpData.deathSaves
                this.monsterCurrentHp = null
            } else if(type === "monster") {

                if (creature.maximumHitPoints === 0) {
                    this.monsterCurrentHp = 1
                    this.maxHp = 1;
                } else {
                    this.monsterCurrentHp = creature.currentHitPoints;
                    this.maxHp = creature.maximumHitPoints;
                }
                this.tempHp = creature.temporaryHitPoints;
                // Monsters from dnd beyond do not have these
                this.maxHpBonus = null;
                this.maxHpOverride = null; 
                this.removedHp = null;
                this.exhaustionLvl = null;
                this.deathSaves = null;
            }
        } 
    }
}