import './App.css';
import React, { useState } from 'react';

let WORDLE = "SPLAT";
let ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

class LetterBox {
    constructor(letter) {
        this.letter = letter;
        this.color = "rgb(228, 228, 228)";

        this.index = ALPHA.indexOf(letter);
    }
}

const KEYS = [
    new LetterBox("A"),
    new LetterBox("B"),
    new LetterBox("C"),
    new LetterBox("D"),
    new LetterBox("E"),
    new LetterBox("F"),
    new LetterBox("G"),
    new LetterBox("H"),
    new LetterBox("I"),
    new LetterBox("J"),
    new LetterBox("K"),
    new LetterBox("L"),
    new LetterBox("M"),
    new LetterBox("N"),
    new LetterBox("O"),
    new LetterBox("P"),
    new LetterBox("Q"),
    new LetterBox("R"),
    new LetterBox("S"),
    new LetterBox("T"),
    new LetterBox("U"),
    new LetterBox("V"),
    new LetterBox("W"),
    new LetterBox("X"),
    new LetterBox("Y"),
    new LetterBox("Z")];



function Box({ Letter, Color, RowID, RowNum }) {

    let Border = .25;
    if (Letter !== undefined)
        Border = 1;


    if (RowID < RowNum)
        Border = 0;

    let s = {
        backgroundColor: Color,
        border: '2px solid rgba( 155,158,160, ' + Border + ' )',
    }

    return (
        <div className="Box" style={s}>
            <p>{Letter}</p>
        </div>
    );
}

const GREEN = "#6aaa64";
const YELLOW = "#c9b458";
const GREY = "#464343";

function Row({ RowID, Word, RowNum, top, GameOver }) {

    //             ["green",     "greenyellow", "yellow",   "yellow",     "orange",    "red"];
    const colors = ["34,139,34", "127,255,0", "255,255,49", "255,225,53", "255,165,0", "255,69,0", "0,0,0"];

    let borderOn = 0;

    if (RowID === RowNum && GameOver === 0) {
        borderOn = 1;
    }

    let s = {
        top: top,
        border: '2px solid rgba(' + colors[RowNum] + ', ' + borderOn + ' )',
    }

    //color for each box
    let BoxColorAr = ["#464343", "#464343", "#464343", "#464343", "#464343"]
    let wordle = WORDLE;
    //only change color if we have gone to next row
    if (RowID < RowNum) {
        for (let i = 0; i < 5; i++) {
            let letter = Word[i];
            let index = ALPHA.indexOf(letter);

            //if the wordle has th letter
            if (wordle.includes(letter)) {
                //if the letter is in the right spot
                if (wordle[i] === letter) {
                    BoxColorAr[i] = GREEN;
                    KEYS[index].color = GREEN;
                }
                else //if the letter is in the word but not the right spot
                {
                    BoxColorAr[i] = YELLOW; //yellow
                    KEYS[index].color = YELLOW;

                }
                wordle = wordle.replace(letter, letter.toLowerCase());
            }
            else {
                if (KEYS[index].color !== GREEN && KEYS[index].color !== YELLOW) //if its not green already
                    KEYS[index].color = GREY; //grey
            }

        }
    }

    return (
        <div className='Row' style={s}>
            <Box Letter={Word[0]} Color={BoxColorAr[0]} RowID={RowID} RowNum={RowNum} />
            <Box Letter={Word[1]} Color={BoxColorAr[1]} RowID={RowID} RowNum={RowNum} />
            <Box Letter={Word[2]} Color={BoxColorAr[2]} RowID={RowID} RowNum={RowNum} />
            <Box Letter={Word[3]} Color={BoxColorAr[3]} RowID={RowID} RowNum={RowNum} />
            <Box Letter={Word[4]} Color={BoxColorAr[4]} RowID={RowID} RowNum={RowNum} />
        </div>
    );
}

function resetGame(setArray, setRow, setGameOver) {

    setArray(["", "", "", "", "", ""]);
    setRow(0);
    setGameOver(0);

    for (let i = 0; i < KEYS.length; i++) {
        KEYS[i].color = "rgb(228, 228, 228)";
    }

}

function specialSetter(letter, setRow, RowNum, WordsArray, setArray, setGameOver, GameOver) {

    if (GameOver === 0) {
        let WAR = WordsArray[RowNum];

        if (WAR.length === 5 && letter === "enter") {
            if (WAR === WORDLE) {
                setGameOver(1);
            }
            else if (RowNum === 5) {
                setGameOver(2);
            }

            setRow(RowNum + 1);
        }
        else if (WAR.length !== 0 && letter === "backspace") {
            WordsArray[RowNum] = WAR.substr(0, WAR.length - 1);
            setArray([...WordsArray]);
        }
    }
}

function wordSetter(letter, RowNum, WordsArray, setArray, GameOver) {

    if (GameOver === 0) {

        let WAR = WordsArray[RowNum];
        if (RowNum < 6) {

            if (WAR.length < 5) {

                let w = WAR + letter;
                WordsArray[RowNum] = w;
                //using the spread operator '...' to setArray since [WordsArray] is not detected as change
                setArray([...WordsArray]);

            }
        }
    }
}



function Keyboard({
    setRow, RowNum,
    setArray, WordsArray,
    setGameOver, GameOver }) {


    //onclick send in the setter function, word, letter
    return (
        <>
            <div className='Keyboard'>
                <div className='top'>
                    <button style={{ backgroundColor: KEYS[16].color }} onMouseOver="changeColor" onClick={() => { wordSetter("Q", RowNum, WordsArray, setArray, GameOver) }}>Q</button>
                    <button style={{ backgroundColor: KEYS[22].color }} onClick={() => { wordSetter("W", RowNum, WordsArray, setArray, GameOver) }}>W</button>
                    <button style={{ backgroundColor: KEYS[4].color }} onClick={() => { wordSetter("E", RowNum, WordsArray, setArray, GameOver) }}>E</button>
                    <button style={{ backgroundColor: KEYS[17].color }} onClick={() => { wordSetter("R", RowNum, WordsArray, setArray, GameOver) }}>R</button>
                    <button style={{ backgroundColor: KEYS[19].color }} onClick={() => { wordSetter("T", RowNum, WordsArray, setArray, GameOver) }}>T</button>
                    <button style={{ backgroundColor: KEYS[24].color }} onClick={() => { wordSetter("Y", RowNum, WordsArray, setArray, GameOver) }}>Y</button>
                    <button style={{ backgroundColor: KEYS[20].color }} onClick={() => { wordSetter("U", RowNum, WordsArray, setArray, GameOver) }}>U</button>
                    <button style={{ backgroundColor: KEYS[8].color }} onClick={() => { wordSetter("I", RowNum, WordsArray, setArray, GameOver) }}>I</button>
                    <button style={{ backgroundColor: KEYS[14].color }} onClick={() => { wordSetter("O", RowNum, WordsArray, setArray, GameOver) }}>O</button>
                    <button style={{ backgroundColor: KEYS[15].color }} onClick={() => { wordSetter("P", RowNum, WordsArray, setArray, GameOver) }}>P</button>
                </div>
                <br />
                <div className='middle'>
                    <button style={{ backgroundColor: KEYS[0].color }} onClick={() => { wordSetter("A", RowNum, WordsArray, setArray, GameOver) }}>A</button>
                    <button style={{ backgroundColor: KEYS[18].color }} onClick={() => { wordSetter("S", RowNum, WordsArray, setArray, GameOver) }}>S</button>
                    <button style={{ backgroundColor: KEYS[3].color }} onClick={() => { wordSetter("D", RowNum, WordsArray, setArray, GameOver) }}>D</button>
                    <button style={{ backgroundColor: KEYS[5].color }} onClick={() => { wordSetter("F", RowNum, WordsArray, setArray, GameOver) }}>F</button>
                    <button style={{ backgroundColor: KEYS[6].color }} onClick={() => { wordSetter("G", RowNum, WordsArray, setArray, GameOver) }}>G</button>
                    <button style={{ backgroundColor: KEYS[7].color }} onClick={() => { wordSetter("H", RowNum, WordsArray, setArray, GameOver) }}>H</button>
                    <button style={{ backgroundColor: KEYS[9].color }} onClick={() => { wordSetter("J", RowNum, WordsArray, setArray, GameOver) }}>J</button>
                    <button style={{ backgroundColor: KEYS[10].color }} onClick={() => { wordSetter("K", RowNum, WordsArray, setArray, GameOver) }}>K</button>
                    <button style={{ backgroundColor: KEYS[11].color }} onClick={() => { wordSetter("L", RowNum, WordsArray, setArray, GameOver) }}>L</button>
                </div>
                <br />
                <div className='bot'>
                    <button className='enter' onClick={() => { specialSetter("enter", setRow, RowNum, WordsArray, setArray, setGameOver, GameOver) }}>Enter</button>
                    <button style={{ backgroundColor: KEYS[25].color }} onClick={() => { wordSetter("Z", RowNum, WordsArray, setArray, GameOver) }}>Z</button>
                    <button style={{ backgroundColor: KEYS[23].color }} onClick={() => { wordSetter("X", RowNum, WordsArray, setArray, GameOver) }}>X</button>
                    <button style={{ backgroundColor: KEYS[2].color }} onClick={() => { wordSetter("C", RowNum, WordsArray, setArray, GameOver) }}>C</button>
                    <button style={{ backgroundColor: KEYS[21].color }} onClick={() => { wordSetter("V", RowNum, WordsArray, setArray, GameOver) }}>V</button>
                    <button style={{ backgroundColor: KEYS[1].color }} onClick={() => { wordSetter("B", RowNum, WordsArray, setArray, GameOver) }}>B</button>
                    <button style={{ backgroundColor: KEYS[13].color }} onClick={() => { wordSetter("N", RowNum, WordsArray, setArray, GameOver) }}>N</button>
                    <button style={{ backgroundColor: KEYS[12].color }} onClick={() => { wordSetter("M", RowNum, WordsArray, setArray, GameOver) }}>M</button>
                    <button className='backspace' onClick={() => { specialSetter("backspace", setRow, RowNum, WordsArray, setArray, setGameOver, GameOver) }}> &#8592; </button>
                </div>
            </div>
            <button className='reset' onClick={() => { resetGame(setArray, setRow, setGameOver) }} style={{ backgroundColor: 'IndianRed' }}> Reset </button>
        </>
    );
}

function GameOverElem({ GameOver }) {

    let vis = "hidden";
    let borderColor = "";

    if (GameOver > 0) {
        vis = "visible"
        if (GameOver === 1) {
            borderColor = "green";
        }

        if (GameOver === 2) {
            borderColor = "red";
        }
    }

    const s = {
        visibility: vis,
        border: '2px solid ' + borderColor,

    }

    return (
        <div className='GameOverContainer' style={s}>
            <div className='GameOverTile'>
                <strong>{WORDLE}</strong>
            </div>
        </div>
    );
}


function App() {
    const [WordsArray, setArray] = useState(["", "", "", "", "", ""]);
    const [RowNum, setRow] = useState(0);
    const [GameOver, setGameOver] = useState(0);

    return (
        <div className="App">
            <div className="App-header">
                <div>Wordle</div>
            </div>
            <div className='body'>

                <GameOverElem GameOver={GameOver} setGameOver={setGameOver} />
                <div className='Box-Container'>
                    <Row RowID={0} Word={WordsArray[0]} RowNum={RowNum} top={'2% '} GameOver={GameOver} />
                    <Row RowID={1} Word={WordsArray[1]} RowNum={RowNum} top={'18%'} GameOver={GameOver} />
                    <Row RowID={2} Word={WordsArray[2]} RowNum={RowNum} top={'34%'} GameOver={GameOver} />
                    <Row RowID={3} Word={WordsArray[3]} RowNum={RowNum} top={'50%'} GameOver={GameOver} />
                    <Row RowID={4} Word={WordsArray[4]} RowNum={RowNum} top={'66%'} GameOver={GameOver} />
                    <Row RowID={5} Word={WordsArray[5]} RowNum={RowNum} top={'82%'} GameOver={GameOver} />
                </div>
                <Keyboard
                    setRow={setRow} RowNum={RowNum}
                    setArray={setArray} WordsArray={WordsArray}
                    setGameOver={setGameOver} GameOver={GameOver}
                />
            </div>

        </div>
    );
}

export default App;
