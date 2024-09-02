export const refreshPlayerProfiles = async () => {
    try {
        console.log("Refreshing Player Health")
        console.log("----------------")
        //Get player stats for HP
        const filteredPlayers = creatures.filter(item => item.type === 'player');
        const playerIds = filteredPlayers
            .filter(player => player.from && player.from === "dnd_b") // Filter players where "from" exists and equals "dnd_b"
            .map(player => player.id.toString()); // Map to get the ids as strings

        const refreshedData = await getCharacterStats(playerIds);
        
        let savedEncounters = JSON.parse(localStorage.getItem('savedEncounters'));
        let currentSavedEncounter = savedEncounters.find(e => e.id === playerViewEncounterID);
        // Iterate over the first array using a for loop
        const updatedCreatures = creatures.map(creature => {
            // Need to use creature.id since its from dnd beyond
            const matchedRefresh = refreshedData.find(data => data.id === creature.id);

            if (matchedRefresh) {

                const change = {
                    ...creature,
                    ...matchedRefresh
                }

                // Setting dmb character locally to be shown in dmview
                currentSavedEncounter.currentEncounterCreatures.forEach(savedCreature => {
                    if(savedCreature.id === change.id) {
                        savedCreature.name = change.name;
                        savedCreature.avatarUrl = change.avatarUrl || 'https://www.dndbeyond.com/Content/Skins/Waterdeep/images/icons/monsters/humanoid.jpg';
                        savedCreature.dnd_b.hit_points = change.maxHp;
                        savedCreature.dnd_b.hit_points_current = change.maxHp - change.removedHp;
                        savedCreature.dnd_b.maxHpBonus = change.maxHpBonus;
                        savedCreature.dnd_b.maxHpOverride = change.maxHpOverride;
                        savedCreature.dnd_b.removedHp = change.removedHp;
                        savedCreature.dnd_b.hit_points_temp = change.tempHp;
                        savedCreature.dnd_b.exhaustionLvl = change.exhaustionLvl;
                        savedCreature.dnd_b.deathSaves = change.deathSaves;
                        savedCreature.dnd_b.initiative = change.initiative;
                        
                    }
                })

                return change;
            } else {
                return creature;
            }
        });
        localStorage.setItem('savedEncounters', JSON.stringify(savedEncounters));

        setCreatures([...updatedCreatures]);
        setRefreshPlayersCheck(false);
        setRefreshCheck(refreshMonstersCheck && refreshPlayersCheck);
        console.log("Players Refreshed!")
        return updatedCreatures;

    } catch (error) {
        console.log(error)
        setErrorMessage(error)
        setError(true)
    }  
};

export const refreshMonsterProfiles = async (passedCreatures) => {
    try {
        if (!isOfflineMode) {
            console.log("Refreshing Monster Hp and Initiatives");
            console.log("----------------");
            // Fetch the latest data for monsters and players
            const { data: { monsters, players, turnNum, roundNum, inProgress } } = await getCreatures(gameId);
            handleTurns(inProgress, turnNum, roundNum)

            const allRefreshedCreatures = [...monsters, ...players];
    
            let needToResort = false;
    
            // Function to update a single creature's data
            const updateSingleCreature = (creature, matchedRefresh) => {
                const maxHpIsZero = matchedRefresh.maximumHitPoints === 0
                if(maxHpIsZero) {
                    // If somone does not own the creature they start at 0/0 
                    // so this is to make sure it stays at 1/1 on a refresh
                    // If the users overrides there hp it will get caught above
                    if (!creature.isReleased) {
                        matchedRefresh.currentHitPoints = 1
                        matchedRefresh.maximumHitPoints = 1;
                    } else {
                        // If someone overrides a creatures hp, then removes the override dndbeyond thinkgs maxhp is 0
                        // since its not we save creature.defaultHP set the maxHP back to the correct value
                        // If maxhp is 0 dndbeyond will just send a negative number for currentHP when the creature takes damage
                        // this is why we must add that number to default to get the new current. 
                        // This is a bug with dnd beyond
                        // i.e. maxHp = 0, currentHp = -10, default = 50, 50 + (-10)
                        matchedRefresh.currentHitPoints = creature.defaultHP - Math.abs(matchedRefresh.currentHitPoints)
                        matchedRefresh.maximumHitPoints = creature.defaultHP;
                    }
                }

                const currentHpHasChanged = matchedRefresh.currentHitPoints !== creature.monsterCurrentHp;
                const maxHpHasChanged = matchedRefresh.maximumHitPoints !== creature.maxHp;
                const initiativeHasChanged = matchedRefresh.initiative !== creature.initiative;
    
                // Check if initiative has changed and mark for resorting if needed
                if (initiativeHasChanged) 
                    needToResort = true;
                // Update creature properties based on whether it's a monster or a player
                return {
                    ...creature,
                    monsterCurrentHp: matchedRefresh.userName === undefined && currentHpHasChanged ? matchedRefresh.currentHitPoints : creature.monsterCurrentHp,
                    maxHp: matchedRefresh.userName === undefined && maxHpHasChanged ? matchedRefresh.maximumHitPoints : creature.maxHp,
                    initiative: initiativeHasChanged ? matchedRefresh.initiative : creature.initiative,
                };
            };
    
            // Function to update all creatures in the list
            const updateAllCreatures = (creatureList) => {
                return creatureList.map(creature => {
                    const matchedRefresh = allRefreshedCreatures.find(data => data.name === creature.name);
                    return matchedRefresh ? updateSingleCreature(creature, matchedRefresh) : creature;
                });
            };
    
            // Update the creatures, either passed in or existing ones
            let updatedCreatures = passedCreatures ? updateAllCreatures(passedCreatures) : updateAllCreatures(creatures);
            
            // Resort the creatures if any initiative has changed
            if (needToResort) 
                updatedCreatures = sortCreaturesByInitiative(updatedCreatures);
    
            // Update the state with the new creature list
            setCreatures([...updatedCreatures]);
            
    
            console.log("Monsters Refreshed!");
            return updatedCreatures;
        } else {
            console.log("Offline mode refresh")
        }

        setRefreshMonstersCheck(false);
        setRefreshCheck(refreshMonstersCheck && refreshPlayersCheck);
    } catch (error) {
        console.error("Error refreshing monster profiles:", error);
        setErrorMessage(error);
        setError(true);
    }
};