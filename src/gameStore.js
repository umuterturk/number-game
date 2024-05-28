import { makeAutoObservable } from "mobx";

class GameStore {
  targetNumber = this.generateTargetNumber();
  guesses = [];
  message = "";
  digitStates = Array(10).fill("unknown"); // States: unknown, inKnown, inUnknown, notIn
  startTime = Date.now();

  constructor() {
    makeAutoObservable(this);
  }

  generateTargetNumber() {
    let digits = [];
    while (digits.length < 4) {
      let randomDigit = Math.floor(Math.random() * 10);
      if (
        (digits.length === 0 && randomDigit === 0) ||
        digits.includes(randomDigit)
      ) {
        continue;
      }
      digits.push(randomDigit);
    }
    return digits.join('');
  }

  addGuess(guess) {
    if (this.isValidGuess(guess)) {
      const result = this.evaluateGuess(guess);
      const currentTime = Date.now();
      const timeSpent = ((currentTime - this.startTime) / 1000).toFixed(2);
      this.guesses.unshift({ guess, result, timeSpent });
      this.message = `Your guess: ${guess}, Result: ${result}`;
      this.startTime = currentTime; // Reset start time for the next guess
    } else {
      this.message = "Invalid guess. Ensure no repetitions and doesn't start with 0.";
    }
  }

  isValidGuess(guess) {
    if (guess.length !== 4 || guess[0] === '0') return false;
    let uniqueDigits = new Set(guess);
    return uniqueDigits.size === 4;
  }

  evaluateGuess(guess) {
    let correctPosition = 0;
    let correctDigit = 0;

    for (let i = 0; i < 4; i++) {
      if (guess[i] === this.targetNumber[i]) {
        correctPosition++;
      } else if (this.targetNumber.includes(guess[i])) {
        correctDigit++;
      }
    }

    return `-${correctDigit} +${correctPosition}`;
  }

  toggleDigitState(digit) {
    const states = ["unknown", "inKnown", "inUnknown", "notIn"];
    const currentStateIndex = states.indexOf(this.digitStates[digit]);
    this.digitStates[digit] = states[(currentStateIndex + 1) % states.length];
  }
}

const gameStore = new GameStore();
export default gameStore;
