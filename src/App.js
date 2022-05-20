import './App.css';
import React, { useState } from 'react';





function Row({ Row, WordsArray, RowNum, top }) {

    const colors = ["25,151,0", "greenyellow", "yellow", "yellow", "orange", "red"];

    let borderOn = 0;
    if(Row === RowNum)
    {
        borderOn = 1;
    }
    
    const s = {
        top: top,
        border: '1px dotted rgba(255, 255, 255,' + borderOn + ' )', 
    }

    return (
        <div className='Row' style={s}>
            <div className="Box"> <p>{WordsArray[0]}</p></div>
            <div className="Box"> <p>{WordsArray[1]}</p></div>
            <div className="Box"> <p>{WordsArray[2]}</p></div>
            <div className="Box"> <p>{WordsArray[3]}</p></div>
            <div className="Box"> <p>{WordsArray[4]}</p></div>
        </div>
    );
}

function wordSetter(setWord, Word, letter, setRow, RowNum, WordsArray, setArray) {

    if (Word.length < 5 && letter !== "enter") {
        let w = Word + letter;
        WordsArray[RowNum] = w
        setArray(WordsArray);
        setWord(w);
    }

    if (Word.length === 5 && letter === "enter") {
        WordsArray[RowNum] = Word;
        setRow(RowNum + 1);
        setArray(WordsArray);
        setWord("")
        console.log("Word Entered: " + WordsArray);
    }
}



function Keyboard({ setWord, Word,
    setRow, RowNum,
    setArray, WordsArray }) {

    //console.log("Keybord rendered-------------------------")
    //onclick send in the setter function, word, letter
    return (
        <div className='Keyboard'>
            <button onClick={() => { wordSetter(setWord, Word, "A", setRow, RowNum, WordsArray, setArray) }}>A</button>
            <button onClick={() => { wordSetter(setWord, Word, "B", setRow, RowNum, WordsArray, setArray) }}>B</button>
            <button onClick={() => { wordSetter(setWord, Word, "C", setRow, RowNum, WordsArray, setArray) }}>C</button>
            <button onClick={() => { wordSetter(setWord, Word, "D", setRow, RowNum, WordsArray, setArray) }}>D</button>
            <button onClick={() => { wordSetter(setWord, Word, "E", setRow, RowNum, WordsArray, setArray) }}>E</button>

            <button onClick={() => { wordSetter(setWord, Word, "enter", setRow, RowNum, WordsArray, setArray) }}>Enter</button>
        
            <button onClick={() => setWord(Word.substr(0, Word.length - 1))}> &#8592; </button>
        </div>
    );
}

function App() {
    const [Word, setWord] = useState("");
    const [RowNum, setRow] = useState(0);
    const [WordsArray, setArray] = useState(["", "", "", "", "", ""]);
    //console.log("Word: " + Word);
    //console.log("RowNum: " + RowNum);
    //console.log("Array: " + WordsArray);
    //console.log("Array[]: " + WordsArray[0]);
    return (
        <div className="App">
            <div className="App-header">
                <div>Wordle</div>
            </div>
            <div className='body'>
                <div className='Box-Container'>
                    <Row Row={0} WordsArray={WordsArray[0]} RowNum={RowNum} top={'3% '}/>
                    <Row Row={1} WordsArray={WordsArray[1]} RowNum={RowNum} top={'19%'}/>
                    <Row Row={2} WordsArray={WordsArray[2]} RowNum={RowNum} top={'35%'}/>
                    <Row Row={3} WordsArray={WordsArray[3]} RowNum={RowNum} top={'51%'}/>
                    <Row Row={4} WordsArray={WordsArray[4]} RowNum={RowNum} top={'67%'}/>
                    <Row Row={5} WordsArray={WordsArray[5]} RowNum={RowNum} top={'83%'}/>
         
                </div>
                <Keyboard
                    setWord={setWord} Word={Word}
                    setRow={setRow} RowNum={RowNum}
                    setArray={setArray} WordsArray={WordsArray}
                />
            </div>

        </div>
    );
}

export default App;
