import './App.css';
import React, { useState } from 'react';





function Row({ WordsArray, top }) {

    return (
        <div className='Row' style={{top: top}}>
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
    const styles = [15, 27, 39, 50, 62, 74];
    const colors = ["green", "greenyellow", "yellow", "yellow", "orange", "red"];
    return (
        <div className="App">
            <header className="App-header">
                Hello
            </header>
            <div className='body'>
                <p className='Pointer' style={{ top: styles[RowNum] + "%", color: colors[RowNum] }}> &#8594; </p>
                <div className='Box-Container'>
                    <Row WordsArray={WordsArray[0]} top={'3%'} />
                    <Row WordsArray={WordsArray[1]} top={'19%'}/>
                    <Row WordsArray={WordsArray[2]} top={'35%'}/>
                    <Row WordsArray={WordsArray[3]} top={'51%'}/>
                    <Row WordsArray={WordsArray[4]} top={'67%'}/>
                    <Row WordsArray={WordsArray[5]} top={'83%'}/>
         
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
