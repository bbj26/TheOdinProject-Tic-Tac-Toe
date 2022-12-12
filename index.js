let computerMark = "O";
let currentPlayer = "X";
let gameInProgress = false;
const boardState = ["", "", "", "", "", "", "", "", ""];
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const getDomElements = () => {
  const info = document.querySelector("#info");
  const cells = document.querySelectorAll(".cell");
  const container = document.querySelector(".container");
  const resetBtn = document.querySelector("#reset-btn");
  return {
    info,
    cells,
    container,
    resetBtn,
  };
};

const changePlayer = () => {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
};

const updateNextTurnInfo = () => {
  const { info } = getDomElements();
  info.innerHTML = `${currentPlayer}'s turn`;
};

const declareResult = (result) => {
  const { info } = getDomElements();
  if (result === currentPlayer) {
    info.innerHTML = `${currentPlayer} WINS !!!`;
  } else if (result === "draw") {
    info.innerHTML = `DRAW GAME`;
  }

  showResetBtn();
};

const toggleGame = () => {
  gameInProgress = !gameInProgress;
};

const placeMark = (e) => {
  if (e.target.innerHTML !== "") return;
  e.target.innerHTML = currentPlayer;
  const cellIndex = e.target.id.split("cell")[1];
  boardState[cellIndex] = currentPlayer;
};

const checkWinner = (cells) => {
  const result = winCombos.find((combo) =>
    combo.every((index) => boardState[index] === currentPlayer)
  );
  if (result) {
    colorWinningCombo(result);
    return currentPlayer;
  } else if (boardState.every((cell) => cell !== "")) {
    return "draw";
  }
};

const showResetBtn = () => {
  const { resetBtn } = getDomElements();
  resetBtn.removeAttribute("hidden");
};

const startBtnListeners = () => {
  const { resetBtn, onePlayerBtn, twoPlayersBtn } = getDomElements();
  resetBtn.addEventListener("click", reset);
};

const reset = () => {
  const { cells } = getDomElements();
  currentPlayer = "X";
  gameInProgress = true;
  cells.forEach((cell) => (cell.innerHTML = ""));
  for (let index = 0; index < boardState.length; index++) {
    boardState[index] = "";
  }
  resetColors();
  updateNextTurnInfo();
};

const startTwoPlayerMode = () => {
  const { container, cells } = getDomElements();
  startBtnListeners();
  gameInProgress = true;
  container.addEventListener("click", (e) => {
    if (!gameInProgress) return;
    e.preventDefault();
    placeMark(e);
    const winner = checkWinner(cells);
    if (winner) {
      declareResult(winner);
      toggleGame();
    } else {
      changePlayer();
      updateNextTurnInfo();
    }
  });
};

const startPlayerVsComputerMode = () => {
  const { container, cells } = getDomElements();
  startBtnListeners();
  gameInProgress = true;
  container.addEventListener("click", (e) => {
    if (!gameInProgress || currentPlayer !== "X") return;
    e.preventDefault();
    placeMark(e);
    const winner = checkWinner(cells);
    if (winner) {
      declareResult(winner);
      toggleGame();
    } else {
      changePlayer();
      updateNextTurnInfo();
      playComputerMove();
    }
  });
};

const playComputerMove = () => {
  const possibleMoves = [];
  for (let index = 0; index < boardState.length; index++) {
    if (boardState[index] === "") {
      possibleMoves.push(index);
    }
  }

  const random = Math.floor(Math.random() * possibleMoves.length);
  const nextMove = possibleMoves[random];
  setTimeout(() => {
    boardState[nextMove] = computerMark;
    document.querySelector(`#cell${nextMove}`).innerHTML = computerMark;
    changePlayer();
    updateNextTurnInfo();
  }, 3000);
};

const colorWinningCombo = (indexes) => {
  const winComboCells = [];
  indexes.forEach((index) =>
    winComboCells.push(document.querySelector(`#cell${index}`))
  );
  winComboCells.forEach((cell) =>
    cell.setAttribute("style", "background-color:green")
  );
};

const resetColors = () => {
  const { cells } = getDomElements();
  cells.forEach((cell) => cell.setAttribute("style", "background-color:white"));
};

// startTwoPlayerMode();
startPlayerVsComputerMode();