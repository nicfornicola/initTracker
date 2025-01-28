import React from "react";
import {BoldifyReplace} from "./BoldifyReplace";

function numEnd(input) {
    if(!input && input !== '0') {
        return ""
    }
    // Convert the input to a number
    const number = parseInt(input, 10);

    // Return the input as-is if it's not a valid number
    if (isNaN(number)) return input;

    const suffixes = ["th", "st", "nd", "rd"];
    const remainder = number % 100;

    // Handle special cases for 11, 12, and 13
    if (remainder >= 11 && remainder <= 13) {
        return `${number}th`;
    }

    // Use the last digit to determine the suffix
    const lastDigit = number % 10;
    const suffix = suffixes[lastDigit] || "th";
    return `${number}${suffix}`;
}

const SpellList = ({ spellListObj }) => {
  	return (
		<ul className="spellList">
			{Object.entries(spellListObj).map(([key, value]) => {
				if (key === "will") {
					return <li key={key}><b>At will</b>: <BoldifyReplace desc={value.join(", ")} /></li>
				}

				if (key === "daily" || key === "week" || key === "lr" || key === "sr") {
					return Object.entries(value).map(([dailySpell, spells]) => (
						<li key={dailySpell}><b>{dailySpell.slice(0, 1)}/day each:</b> <BoldifyReplace desc={spells.join(", ")} /></li>
					));
				}

				if (key === "spells") {
					return Object.entries(value).map(([level, spellDetails]) => {
						if (level === "0") {
							return (
								<li key={level}><b>Cantrips:</b> <BoldifyReplace desc={spellDetails.spells.join(", ")} /></li>
							);
						}

						const { lower, slots, spells } = spellDetails;
						return (
							<li key={level}>
                                <b>{lower && `${numEnd(lower)}-`}{numEnd(level)} lvl</b>:
                                ({slots}{" "}{lower && <i>{numEnd(level)}-level spell</i>} slots):&nbsp;
								<BoldifyReplace desc={spells.join(", ")} />
							</li>
						);
					});
				}
				return null
			})}
		</ul>
  	);
};

const SpellCasting = ({ creature}) => {
    if(!creature?.spellcasting)
        return null
	return creature?.spellcasting?.length > 0 &&
            <>
                <h1 className='infoTitle'>Spells</h1>
                <hr className="lineSeperator" />
                {creature?.spellcasting?.map((spellListObj, index) => {
                    // this will be 'action' or 'undefined'
                    spellListObj.displayAs = spellListObj.displayAs ?? "trait"
                    if ((spellListObj.name === "None" && spellListObj.desc === "--")) {
                        return null;
                    }

                    return (
                        <div className="actionInfo" key={index + spellListObj.name}>
                            <strong className="titleColor"> {spellListObj.name}: </strong>
                            <BoldifyReplace desc={spellListObj.headerEntries} />
                            <SpellList spellListObj={spellListObj} />
                        </div>
                    );
                })}
            </>
};

export default SpellCasting;
