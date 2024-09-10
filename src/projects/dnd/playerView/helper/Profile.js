export class Profile {
    constructor(creature = null, playerHpData = null ) {
        this.guid = creature.guid;
        this.avatarUrl = creature.avatarUrl || "https://www.dndbeyond.com/avatars/42718/687/1581111423-121476494.jpeg";
        this.effects = [];

        this.name = creature.open5e.name; // Get custom names
        this.id = Math.floor(Math.random() * 1000) + 1 // Give it an id, to match dnd beyond stuff
        this.monsterCurrentHp = creature.open5e.hit_points_current || 0;
        this.maxHp = creature.open5e.hit_points || 0;
        this.maxHpBonus = null;
        this.maxHpOverride =  null;
        this.removedHp =  null;
        this.tempHp = creature.open5e.hit_points_temp;
        this.exhaustionLvl = null;
        this.deathSaves = creature.deathSaves;
        this.initiative = creature.open5e.initiative || 0;
        this.type = creature.type

        // if coming from /dnd/dm - generated players, monsters and dummies
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
            this.deathSaves = creature.deathSaves;
            this.initiative = creature.open5e.initiative || 0;
            this.type = creature.type || "monster"; // when creatures are added from dmb they do not get a type so default monster
        // if coming from /dnd/dm but imported from dnd_beyond
        } else if("dnd_b" in creature) {
            this.name = creature.dnd_b.name; 
            this.id = creature.id;
            this.monsterCurrentHp = creature.dnd_b.hit_points_current || 0;
            this.maxHp = creature.dnd_b.hit_points || 0;
            this.maxHpBonus = null;
            this.maxHpOverride =  null;
            this.removedHp = creature.dnd_b.removedHp;
            this.tempHp = creature.dnd_b.hit_points_temp;
            this.exhaustionLvl = null;
            this.deathSaves = creature.dnd_b.deathSaves
            this.initiative = creature.dnd_b.initiative || 0;
            this.type = "player";
            this.from = creature.from;
        } else { // else is from dnd beyond
            const type = creature.userName ? "player" : "monster"
            this.name = playerHpData?.name || creature.name; //try to get the name from playerhp or default for monster and unloaded
            this.id = creature.id;
            this.initiative = creature.initiative;
            this.type = type;
            if(type === "player") {
                this.avatarUrl = playerHpData.avatarUrl || creature.avatarUrl || "https://www.dndbeyond.com/avatars/42718/687/1581111423-121476494.jpeg";
                this.maxHp = playerHpData.maxHp
                this.maxHpBonus = playerHpData.maxHpBonus
                this.maxHpOverride = playerHpData.maxHpOverride
                this.removedHp = playerHpData.removedHp
                this.tempHp = playerHpData.tempHp
                this.exhaustionLvl = playerHpData.exhaustionLvl
                this.deathSaves = playerHpData.deathSaves
                this.monsterCurrentHp = null
                this.from = "dnd_b";
            } else if(type === "monster") {
                if (creature.maximumHitPoints === 0) {
                    this.monsterCurrentHp = 1
                    this.maxHp = 1;
                } else {
                    this.monsterCurrentHp = creature.currentHitPoints;
                    this.maxHp = creature.maximumHitPoints;
                }
                // this.name = creature.name;
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