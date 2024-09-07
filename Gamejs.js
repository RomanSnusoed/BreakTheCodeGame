document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("game-board");
  const outputArea = document.getElementById("output-area");
  const maxAttempts = 6; // Maximum number of attempts allowed
  const codeLength = 5; // Length of the secret code
  let attempts = 0; // Counter for the number of attempts made
  let currentGuess = ""; // String to store the current guess
  let secretCode = generateSecretCode(); // Generate the secret code

  // Function to generate a random 5-digit secret code
  function generateSecretCode() {
    let code = "";
    for (let i = 0; i < codeLength; i++) {
      code += Math.floor(Math.random() * 10); // Random digit between 0 and 9
    }
    return code;
  }

  // Function to create the initial game board
  function createGameBoard() {
    for (let i = 0; i < maxAttempts; i++) {
      let row = document.createElement("div");
      row.classList.add("row");
      for (let j = 0; j < codeLength; j++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        row.appendChild(cell);
      }
      gameBoard.appendChild(row);
    }
  }

  // Function to update the game board with the current guess
  function updateBoard() {
    let row = gameBoard.children[attempts]; // Get the current row
    for (let i = 0; i < codeLength; i++) {
      let cell = row.children[i]; // Get the cell in the row
      cell.textContent = currentGuess[i] || ""; // Update cell content
    }
  }

  // Function to provide feedback on the current guess
  function provideFeedback() {
    let row = gameBoard.children[attempts];
    let feedback = Array(codeLength).fill("absent"); // Default feedback is "absent"
    let guessCopy = currentGuess.split(""); // Copy of the current guess
    let codeCopy = secretCode.split(""); // Copy of the secret code

    // First pass: check for correct digits in correct positions
    for (let i = 0; i < codeLength; i++) {
      if (guessCopy[i] === codeCopy[i]) {
        feedback[i] = "correct";
        codeCopy[i] = guessCopy[i] = null; // Mark as processed
      }
    }

    // Second pass: check for correct digits in wrong positions
    for (let i = 0; i < codeLength; i++) {
      if (guessCopy[i] && codeCopy.includes(guessCopy[i])) {
        feedback[i] = "present";
        codeCopy[codeCopy.indexOf(guessCopy[i])] = null; // Mark as processed
      }
    }

    // Update the row cells with the feedback classes
    for (let i = 0; i < codeLength; i++) {
      row.children[i].classList.add(feedback[i]);
    }
  }

  // Function to check if the guess is correct
  function checkWin() {
    return currentGuess === secretCode;
  }

  // Function to display an inspirational quote
  function displayQuote() {
    fetch("https://type.fit/api/quotes")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          let quoteObj = data[Math.floor(Math.random() * data.length)];
          if (quoteObj.text) {
            let quote = quoteObj.text;
            let author = quoteObj.author || "Unknown";
            outputArea.textContent = `"${quote}" - ${author}`;
          } else {
            outputArea.textContent = "Congratulations! You cracked the code!";
          }
        } else {
          outputArea.textContent = "Congratulations! You cracked the code!";
        }
      })
      .catch((error) => {
        outputArea.textContent =
          "Congratulations! You cracked the code! However, we couldn't fetch an inspirational quote at the moment.";
        console.error("Error fetching quote:", error);
      });
  }

  // Function to handle key press events
  function handleKeyPress(event) {
    if (attempts >= maxAttempts) return; // Stop if max attempts reached

    if (event.key >= "0" && event.key <= "9") {
      if (currentGuess.length < codeLength) {
        currentGuess += event.key; // Add digit to current guess
        updateBoard();
      }
    } else if (event.key === "Backspace") {
      currentGuess = currentGuess.slice(0, -1); // Remove last digit
      updateBoard();
    } else if (event.key === "Enter") {
      if (currentGuess.length === codeLength) {
        provideFeedback();
        if (checkWin()) {
          displayQuote(); // Display quote if guess is correct
          return;
        }
        attempts++; // Increment attempt counter
        currentGuess = ""; // Reset current guess
        if (attempts >= maxAttempts) {
          outputArea.textContent = `You did not crack the code. The correct code was ${secretCode}. Press F5 to try again.`;
        }
      }
    }
  }

  // Create the initial game board
  createGameBoard();
  // Add event listener for key press events
  document.addEventListener("keydown", handleKeyPress);
});
