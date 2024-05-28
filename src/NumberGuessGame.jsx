import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import gameStore from './gameStore';
import './NumberGuessGame.css';

const NumberGuessGame = observer(() => {
  const [guess, setGuess] = useState(Array(4).fill(""));
  const inputRefs = useRef([]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value.match(/^\d$/)) {
      const newGuess = [...guess];
      newGuess[index] = value;
      setGuess(newGuess);
      if (index < 3) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === "") {
      const newGuess = [...guess];
      newGuess[index] = "";
      setGuess(newGuess);
    }
  };

  const handleFocus = (e, index) => {
    e.target.select().focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (guess[index] === "") {
        if (index > 0) {
          const prevInput = inputRefs.current[index - 1];
          if (prevInput) {
            prevInput.select();
            prevInput.focus();
          }
        }
      } else {
        const newGuess = [...guess];
        newGuess[index] = "";
        setGuess(newGuess);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.select();
        prevInput.focus();
      }
    } else if (e.key === "ArrowRight" && index < 3) {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.select();
        nextInput.focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const guessStr = guess.join("");
    if (guessStr.length === 4) {
      gameStore.addGuess(guessStr);
//      setGuess(Array(4).fill(""));
    } else {
      gameStore.message = "Please enter a 4-digit guess.";
    }
    inputRefs.current[0].focus();
  };

  const getDigitClassName = (digit) => {
    const state = gameStore.digitStates[digit];
    if (state === "inKnown") return "digit inKnown";
    if (state === "inUnknown") return "digit inUnknown";
    if (state === "notIn") return "digit notIn";
    return "digit";
  };

  const handleDigitClick = (digit) => {
    gameStore.toggleDigitState(digit);
  };

  return (
    <div>
      <h1>Number Guess Game</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          {guess.map((digit, index) => (
            <input
              key={index}
              id={`input-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => handleFocus(e, index)}
              maxLength="1"
              className={getDigitClassName(digit)}
              ref={(el) => inputRefs.current[index] = el}
            />
          ))}
        </div>
        <button type="submit">Guess</button>
      </form>
      <p>{gameStore.message}</p>
      <div className="help-panel">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={getDigitClassName(i)}
            onClick={() => handleDigitClick(i)}
          >
            {i}
          </span>
        ))}
      </div>
      <ul>
        {gameStore.guesses.map((g, index) => (
          <li key={index}>
            Guess #{gameStore.guesses.length - index}: {g.guess.split('').map((digit, i) => (
              <span key={i} className={getDigitClassName(parseInt(digit))}>
                {digit}
              </span>
            ))}, Result: {g.result}, Time Spent: {g.timeSpent}s
          </li>
        ))}
      </ul>
    </div>
  );
});

export default NumberGuessGame;
