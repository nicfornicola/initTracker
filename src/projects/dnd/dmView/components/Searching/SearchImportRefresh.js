import React, {useState, useEffect} from 'react';
import { generateUniqueId, INIT_ENCOUNTER_NAME, COLOR_GREEN, COLOR_RED} from '../../constants'
import { ThreeDots } from 'react-loader-spinner'
import { useImportedPlayers } from '../../../../../providers/ImportedPlayersProvider';
import { useHomebrewProvider } from '../../../../../providers/HomebrewProvider';
import 'react-tabs/style/react-tabs.css';
import greenCheck from '../../pics/icons/check.png'
import redCheck from '../../pics/icons/checkRed.png'
import refresh from '../../pics/icons/refresh.png'
import OptionButton from '../EncounterColumn/OptionButton';
import { useUser } from '../../../../../providers/UserProvider';
import { ImportDndBeyondCharacters } from '../../api/ImportDndBeyondCharacters'

const SearchImportRefresh = ({creature, encounterGuid}) => {    
    const {addImportedPlayers} = useImportedPlayers();
    const {username} = useUser();

    const [refreshLoading, setRefreshLoading] = useState(false);
    const [refreshCheck, setRefreshCheck] = useState(false);
    const [refreshImage, setRefreshImage] = useState(greenCheck);

    const handleImportRefresh = async (dndCharacterId, eGuid) => {
        setRefreshLoading(true);
        const getExtra = false
        const playerDataArray = await ImportDndBeyondCharacters([dndCharacterId], eGuid, undefined, username, [creature?.name], getExtra);

        //If the playerDataArray is empty, it means the import failed or the player was not found
        if(playerDataArray[0].status === 403) {
            setRefreshImage(redCheck);
        } else {
            setRefreshImage(greenCheck)
            addImportedPlayers(playerDataArray)
        }
        setRefreshCheck(true);
        setRefreshLoading(false);
    }

    useEffect(() => {
        if(refreshCheck) {
            const timer = setTimeout(() => {
                setRefreshCheck(false)
            }, 2000); 
            return () => clearInterval(timer);
        }
    }, [refreshCheck])


    return (
        <div className='refreshListOption' style={(creature?.status === 403 || refreshCheck || refreshLoading) ? {opacity: 1} : {}}>
            <OptionButton src={refreshCheck ? refreshImage : refresh} 
                message={`Reload ${creature?.name}`} 
                onClickFunction={() => handleImportRefresh(creature?.dnd_b_player_id, encounterGuid)} 
                imgClassName={refreshLoading ? 'spinningImage refreshListOptionMargin' : 'refreshListOptionMargin'} 
            />
        </div>
        
    );
}

export default SearchImportRefresh;