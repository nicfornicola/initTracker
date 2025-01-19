import React from "react";
import {BoldifyReplace} from "./BoldifyReplace";

function numEnd(input) {
    if(input && input !== '0') {
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

const SpellList = ({ spells }) => {
  	return (
		<ul className="spellList">
			{Object.entries(spells).map(([key, value]) => {
				if (key === "will") {
					return <li key={key}>At will: <BoldifyReplace desc={value.join(", ")} /></li>
				}

				if (key === "daily") {
					return Object.entries(value).map(([dailySpell, spells]) => (
						<li key={dailySpell}>{dailySpell.slice(0, 1)}/day each: <BoldifyReplace desc={spells.join(", ")} /></li>
					));
				}

				if (key === "spells") {
					return Object.entries(value).map(([level, spellDetails]) => {
						if (level === "0") {
							return (
								<li key={level}>Cantrips (at will): <BoldifyReplace desc={spellDetails.spells.join(", ")} /></li>
							);
						}

						const { lower, slots, spells } = spellDetails;
						return (
							<li key={level}>
								{lower && `${numEnd(lower)}-`}
								{numEnd(level)} lvl: ({slots}{" "}
								{lower && <i>{numEnd(level)}-level spell</i>} slots):&nbsp;
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

const SpellCasting = ({ creature, displayAs="trait" }) => {
	return (
		<>
			{creature?.spellcasting?.map((spell, index) => {
				if ((spell.name === "None" && spell.desc === "--") || displayAs !== spell.displayAs) {
					return null;
				}

				return (
					<div className="actionInfo" key={index + spell.name}>
						<strong className="titleColor"> {spell.name}: </strong>
						<BoldifyReplace desc={spell.headerEntries.join("")} />
						<SpellList spells={spell} />
					</div>
				);
			})}
		</>
	);
};

export default SpellCasting;
