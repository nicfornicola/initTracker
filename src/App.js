import './App.css';
import React, { useState, useEffect, Component } from 'react';

function Box({ Key }) {

  return (
    <>
      <div className="Box">
        {Key}
      </div>
    </>
  );
}



function Row({ WordsArray }) {

  return (
    <>
      <Box Key={WordsArray[0]} />
      <Box Key={WordsArray[1]} />
      <Box Key={WordsArray[2]} />
      <Box Key={WordsArray[3]} />
      <Box Key={WordsArray[4]} />
    </>
  );
}

function wordSetter(setWord, Word, letter, setRow, RowNum, WordsArray, setArray) {

  if (Word.length < 5 && letter != "enter") {
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
  const styles = [15,27,39,50,62,74];
  const colors = ["green","greenyellow","yellow","yellow","orange","red"];
  return (
    <div className="App">
      <header className="App-header">
      <p className='Pointer' style={{top: styles[RowNum] +"%", color: colors[RowNum] }}> &#8594; </p>
        <div className='Box-Container'>
          <Row WordsArray={WordsArray[0]} />
          <Row WordsArray={WordsArray[1]} />
          <Row WordsArray={WordsArray[2]} />
          <Row WordsArray={WordsArray[3]} />
          <Row WordsArray={WordsArray[4]} />
          <Row WordsArray={WordsArray[5]} />

        </div>
        <Keyboard
          setWord={setWord} Word={Word}
          setRow={setRow} RowNum={RowNum}
          setArray={setArray} WordsArray={WordsArray}
        />
        
      </header>
    </div>
  );
}

export default App;
