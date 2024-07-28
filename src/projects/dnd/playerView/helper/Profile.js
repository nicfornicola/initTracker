export class Profile {
    constructor(creature = null, playerHpData = null ) {
        const type = creature.userName ? "player" : "monster"
        
        this.id = creature.id;
        this.name = creature.name;
        this.initiative = creature.initiative;
        this.avatarUrl = creature.avatarUrl || "https://www.dndbeyond.com/avatars/42718/687/1581111423-121476494.jpeg";
        this.type = type;
        this.effects = [];


        if(type === "player") {
            this.monsterCurrentHp = null
            this.maxHp = playerHpData.maxHp
            this.maxHpBonus = playerHpData.maxHpBonus
            this.maxHpOverride = playerHpData.maxHpOverride
            this.removedHp = playerHpData.removedHp
            this.tempHp = playerHpData.tempHp
            this.exhaustionLvl = playerHpData.exhaustionLvl
            this.deathSaves = playerHpData.deathSaves
        } else {
            this.monsterCurrentHp = creature.currentHitPoints;
            this.maxHp = creature.maximumHitPoints;
            this.maxHpBonus = null;
            this.maxHpOverride =  null;
            this.removedHp =  null;
            this.tempHp =   null;
            this.exhaustionLvl = null;
            this.deathSaves = null;
        }
    }

    log() {
        console.log(`${this}`);
    }

}