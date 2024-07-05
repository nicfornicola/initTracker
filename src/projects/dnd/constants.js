import aid from './pics/effects/aid.png'; 
import bane from './pics/effects/bane.png'; 
import bladeWard from './pics/effects/bladeWard.png'; 
import bless from './pics/effects/bless.png'; 
import blinded from './pics/effects/blinded.png'; 
import boneChilled from './pics/effects/boneChilled.png'; 
import barkSkin from './pics/effects/barkSkin.png'; 
import command from './pics/effects/command.png'; 
import confused from './pics/effects/confused.png'; 
import disguised from './pics/effects/disguised.png'; 
import ensnared from './pics/effects/ensnared.png'; 
import faireFire from './pics/effects/faireFire.png'; 
import guidance from './pics/effects/guidance.png'; 
import guidingBolt from './pics/effects/guidingBolt.png'; 
import hex from './pics/effects/hex.png'; 
import holdPerson from './pics/effects/holdPerson.png'; 
import huntersMark from './pics/effects/huntersMark.png'; 
import invis from './pics/effects/invis.png'; 
import poisened from './pics/effects/poisened.png'; 
import rayOfFrost from './pics/effects/rayOfFrost.png'; 
import sheildOfFaith from './pics/effects/sheildOfFaith.png'; 
import silence from './pics/effects/silence.png'; 
import slept from './pics/effects/slept.png'; 
import webbed from './pics/effects/webbed.png'; 

export const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
// export const proxyUrl = 'https://nics-cors-anywhere-99e39b544c5d.herokuapp.com/';
// export const proxyUrl = '';

export const skills_long = ["Strength Score", "Dexterity Score", "Constitution Score", "Intelligence Score", "Wisdom Score", "Charisma Score"];
export const skill_codes = [3520, 3521, 3522, 3523, 3524, 3525];
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


export const effectObjs = [
    {img: aid, effect: "Aided"}, 
    {img: bane, effect: "Baned"}, 
    {img: bladeWard, effect: "Blade Ward"}, 
    {img: bless, effect: "Blessed"}, 
    {img: blinded, effect: "Blinded"}, 
    {img: boneChilled, effect: "Bone Chilled"}, 
    {img: barkSkin, effect: "Bark Skin"}, 
    {img: command, effect: "Command"}, 
    {img: confused, effect: "Confused"}, 
    {img: disguised, effect: "Disguised"}, 
    {img: ensnared, effect: "Ensnared"}, 
    {img: faireFire, effect: "Faire Fire"}, 
    {img: guidance, effect: "Guidance"}, 
    {img: guidingBolt, effect: "Guiding Bolt"}, 
    {img: hex, effect: "Hexed"}, 
    {img: holdPerson, effect: "Hold Person"}, 
    {img: huntersMark, effect: "Hunters Mark"}, 
    {img: invis, effect: "Invisible"}, 
    {img: poisened, effect: "Poisened"}, 
    {img: rayOfFrost, effect: "Slowed"}, 
    {img: sheildOfFaith, effect: "Sheild Of Faith"}, 
    {img: silence, effect: "Silenced"}, 
    {img: slept, effect: "Slept"}, 
    {img: webbed, effect: "Enwebbed"}, 
];