import './App.css';
import React, { useState } from 'react';


const WORDLE = "ABCDE";

function Box({Word, letter, id}) {

    let color = "#464343";

    if(WORDLE.includes(letter))
    {
        if(WORDLE.indexOf(letter) === id)
            color = "green";
        else
            color = "#f7d560";
    }




    return (
        <div className="Box" style={{ backgroundColor: color }}>
            <p>{letter}</p>
        </div>
    );
}

function Row({ RowID, Word, RowNum, top, GameOver }) {

    //             ["green",     "greenyellow", "yellow",     "yellow",     "orange",    "red"];
    const colors = ["34,139,34", "127,255,0", "255,255,49", "255,225,53", "255,165,0", "255,69,0"];

    let borderOn = 0;
    if (RowID === RowNum && GameOver === 0) {
        borderOn = 1;
    }

    const s = {
        top: top,
        border: '2px solid rgba(' + colors[RowNum] + ',' + borderOn + ' )',
    }

    return (
        <div className='Row' style={s}>
            <Box Word={Word} letter={Word[0]} id={0} />
            <Box Word={Word} letter={Word[1]} id={1} />
            <Box Word={Word} letter={Word[2]} id={2} />
            <Box Word={Word} letter={Word[3]} id={3} />
            <Box Word={Word} letter={Word[4]} id={4} />

        </div>
    );
}

function resetGame(setArray, setRow, setGameOver) {

    setArray(["", "", "", "", "", ""]);
    setRow(0);
    setGameOver(0);

}

function specialSetter(letter, setRow, RowNum, WordsArray, setArray, setGameOver, GameOver) {

    if (GameOver === 0) {
        let WAR = WordsArray[RowNum];

        if (WAR.length === 5 && letter === "enter") {
            if (WAR === WORDLE) {
                console.log("g: " + 1)
                setGameOver(1);

            }
            else if (RowNum === 5) {
                console.log("g: " + 2)
                setGameOver(2);
            }
            else {
                setRow(RowNum + 1);
            }

            console.log("Word Entered: " + WordsArray);
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
        <div className='Keyboard'>
            <button onClick={() => { wordSetter("A", RowNum, WordsArray, setArray, GameOver) }}>A</button>
            <button onClick={() => { wordSetter("B", RowNum, WordsArray, setArray, GameOver) }}>B</button>
            <button onClick={() => { wordSetter("C", RowNum, WordsArray, setArray, GameOver) }}>C</button>
            <button onClick={() => { wordSetter("D", RowNum, WordsArray, setArray, GameOver) }}>D</button>
            <button onClick={() => { wordSetter("E", RowNum, WordsArray, setArray, GameOver) }}>E</button>
            <button onClick={() => { wordSetter("F", RowNum, WordsArray, setArray, GameOver) }}>F</button>
            <button onClick={() => { wordSetter("G", RowNum, WordsArray, setArray, GameOver) }}>G</button>
            <button onClick={() => { wordSetter("H", RowNum, WordsArray, setArray, GameOver) }}>H</button>

            <button onClick={() => { specialSetter("enter", setRow, RowNum, WordsArray, setArray, setGameOver, GameOver) }}>Enter</button>
            <button onClick={() => { specialSetter("backspace", setRow, RowNum, WordsArray, setArray, setGameOver, GameOver) }}> &#8592; </button>
            <button onClick={() => { resetGame(setArray, setRow, setGameOver) }} style={{ backgroundColor: 'IndianRed' }}> Reset </button>
        </div>
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
    //console.log("Word: " + Word);
    //console.log("RowNum: " + RowNum);
    //console.log("Array: " + WordsArray);
    //console.log("Array[]: " + WordsArray[0]);
    console.log("refresh")
    return (
        <div className="App">
            <div className="App-header">
                <div>Wordle</div>
            </div>
            <div className='body'>
                <GameOverElem GameOver={GameOver} setGameOver={setGameOver} />
                <div className='Box-Container'>
                    <Row RowID={0} Word={WordsArray[0]} RowNum={RowNum} top={'3% '} GameOver={GameOver} />
                    <Row RowID={1} Word={WordsArray[1]} RowNum={RowNum} top={'19%'} GameOver={GameOver} />
                    <Row RowID={2} Word={WordsArray[2]} RowNum={RowNum} top={'35%'} GameOver={GameOver} />
                    <Row RowID={3} Word={WordsArray[3]} RowNum={RowNum} top={'51%'} GameOver={GameOver} />
                    <Row RowID={4} Word={WordsArray[4]} RowNum={RowNum} top={'67%'} GameOver={GameOver} />
                    <Row RowID={5} Word={WordsArray[5]} RowNum={RowNum} top={'83%'} GameOver={GameOver} />
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
