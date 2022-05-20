import './App.css';
import React, { useState } from 'react';





function Row({ Row, Word, RowNum, top }) {

    //             ["green",     "greenyellow", "yellow",     "yellow",     "orange",    "red"];
    const colors = ["34,139,34", "127,255,0",   "255,255,49", "255,225,53", "255,165,0", "255,69,0"];

    let borderOn = 0;
    if (Row === RowNum) {
        borderOn = 1;
    }

    const s = {
        top: top,
        border: '2px solid rgba(' + colors[RowNum] + ',' + borderOn + ' )',
    }

    return (
        <div className='Row' style={s}>
            <div className="Box"> <p>{Word[0]}</p></div>
            <div className="Box"> <p>{Word[1]}</p></div>
            <div className="Box"> <p>{Word[2]}</p></div>
            <div className="Box"> <p>{Word[3]}</p></div>
            <div className="Box"> <p>{Word[4]}</p></div>
        </div>
    );
}

function wordSetter(letter, setRow, RowNum, WordsArray, setArray) {

    let WAR = WordsArray[RowNum];
    if (RowNum < 6) {

        if (WAR.length < 5 && letter !== "enter" && letter !== "backspace") {

            let w = WAR + letter;
            WordsArray[RowNum] = w;
            //using the spread operator '...' to setArray since [WordsArray] is not detected as change
            setArray([...WordsArray]);

        }
        else if (WAR.length === 5 && letter === "enter") {

            setRow(RowNum + 1);
            console.log("Word Entered: " + WordsArray);
        }
        else if (WAR.length != 0 && letter === "backspace") {
            WordsArray[RowNum] = WAR.substr(0, WAR.length - 1);
            setArray([...WordsArray]);
        }
    }

    if(letter === "reset")
    {
        setArray(["","","","","",""]);
        setRow(0);
    }

}



function Keyboard({
    setRow, RowNum,
    setArray, WordsArray }) {

    //onclick send in the setter function, word, letter
    return (
        <div className='Keyboard'>
            <button onClick={() => { wordSetter("A", setRow, RowNum, WordsArray, setArray) }}>A</button>
            <button onClick={() => { wordSetter("B", setRow, RowNum, WordsArray, setArray) }}>B</button>
            <button onClick={() => { wordSetter("C", setRow, RowNum, WordsArray, setArray) }}>C</button>
            <button onClick={() => { wordSetter("D", setRow, RowNum, WordsArray, setArray) }}>D</button>
            <button onClick={() => { wordSetter("E", setRow, RowNum, WordsArray, setArray) }}>E</button>

            <button onClick={() => { wordSetter("enter", setRow, RowNum, WordsArray, setArray) }}>Enter</button>
            <button onClick={() => { wordSetter("backspace", setRow, RowNum, WordsArray, setArray) }}> &#8592; </button>
            <button onClick={() => { wordSetter("reset", setRow, RowNum, WordsArray, setArray) }} style={{backgroundColor: 'IndianRed'}}> Reset </button>
        </div>
    );
}

function App() {
    const [WordsArray, setArray] = useState(["", "", "", "", "", ""]);
    const [RowNum, setRow] = useState(0);
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
                <div className='Box-Container'>
                    <Row Row={0} Word={WordsArray[0]} RowNum={RowNum} top={'3% '} />
                    <Row Row={1} Word={WordsArray[1]} RowNum={RowNum} top={'19%'} />
                    <Row Row={2} Word={WordsArray[2]} RowNum={RowNum} top={'35%'} />
                    <Row Row={3} Word={WordsArray[3]} RowNum={RowNum} top={'51%'} />
                    <Row Row={4} Word={WordsArray[4]} RowNum={RowNum} top={'67%'} />
                    <Row Row={5} Word={WordsArray[5]} RowNum={RowNum} top={'83%'} />

                </div>
                <Keyboard
                    setRow={setRow} RowNum={RowNum}
                    setArray={setArray} WordsArray={WordsArray}
                />
            </div>

        </div>
    );
}

export default App;
