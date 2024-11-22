document.getElementById("courseName").innerHTML = "COMP 2132";
document.getElementById("assignmentNumber").innerHTML = "Project";

document.addEventListener("DOMContentLoaded", function() {
  const fetchFileLocation = "../assets/data/words.json";
  let words = [];
  let selectedWord = "";
  let hint = "";
  let guessedLetters = [];
  let incorrectGuesses = 0;
  const maxIncorrectGuesses = 6;

  const messageElement = document.getElementById("message");
  const playAgainButton = document.getElementById("play-again");
  const hangmanImage = document.getElementById("hangman-stage");
  const letterButtonsContainer = document.getElementById("letter-buttons");
  const wordContainer = document.getElementById("word-container");
  const hintTextElement = document.getElementById("hint-text");

  async function fetchWords() {
    try {
        const response = await fetch(fetchFileLocation);
        if (!response.ok) {
            throw new Error("Network error: Failed to fetch words data");
        }
        words = await response.json();
        startNewGame();
    } catch (error) {
        messageElement.innerHTML = `<p>${error.message}. Please refresh the page and try again.</p>`;
    }
  }

  function startNewGame() {
    resetGame();
    const randomIndex = Math.floor(Math.random() * words.length);
    selectedWord = words[randomIndex].word;
    hint = words[randomIndex].hint;

    // Update hint and guessed letters
    hintTextElement.textContent = hint;
    guessedLetters = Array(selectedWord.length).fill("_");
    displayWord();
}

function resetGame() {
    if (!messageElement || !playAgainButton) return;

    messageElement.textContent = "";
    playAgainButton.style.display = "none";
    incorrectGuesses = 0;
    updateHangmanImage();
    setupLetterButtons();
}

function setupLetterButtons() {
  letterButtonsContainer.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      const button = document.createElement("button");
      button.textContent = letter;
      button.setAttribute("aria-label", `Guess letter ${letter}`);
      button.addEventListener("click", () => handleGuess(letter, button));
      letterButtonsContainer.appendChild(button);
  }
}

function handleGuess(letter, button) {
  button.disabled = true;
  button.classList.add("disabled");

  if (selectedWord.includes(letter.toLowerCase())) {
      for (let i = 0; i < selectedWord.length; i++) {
          if (selectedWord[i] === letter.toLowerCase()) {
              guessedLetters[i] = letter;
          }
      }
      displayWord();
      if (!guessedLetters.includes("_")) {
          endGame("You win! Your house is safe.");
      }
  } else {
      incorrectGuesses++;
      updateHangmanImage();
      if (incorrectGuesses === maxIncorrectGuesses) {
          endGame("You lose! Hangman Page has set your house on fire.");
      }
  }
}

function updateHangmanImage() {
  hangmanImage.classList.remove("show"); // Reset fade effect
  hangmanImage.src = `../assets/images/hangman${incorrectGuesses}.png`;
  setTimeout(() => hangmanImage.classList.add("show"), 10); // Add fade effect
}

function displayWord() {
  wordContainer.textContent = guessedLetters.join(" ");
}

function endGame(message) {
  messageElement.textContent = message;
  playAgainButton.style.display = "block";
  playAgainButton.onclick = startNewGame;

  // Disable all letter buttons
  const buttons = letterButtonsContainer.querySelectorAll("button");
  buttons.forEach((button) => {
      button.disabled = true;
      button.classList.add("disabled");
  });
}

// Fetch words data and start the game
fetchWords();
});
