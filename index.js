let boxes = document.querySelectorAll(".box");
let turn = "X";
let isGameOver = false;

boxes.forEach((e) => {
  e.innerHTML = "";
  e.addEventListener("click", () => {
    if (!isGameOver && e.innerHTML === "") {
      e.innerHTML = turn;
      checkWin();
      checkDraw();
      changeTurn();
      if (!isGameOver) calculateProbabilities();
    }
  });
});

function changeTurn() {
  if (turn === "X") {
    turn = "O";
    document.querySelector(".bg").style.left = "85px";
  } else {
    turn = "X";
    document.querySelector(".bg").style.left = "0";
  }
}

function checkWin() {
  let winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winConditions.length; i++) {
    let v0 = boxes[winConditions[i][0]].innerHTML;
    let v1 = boxes[winConditions[i][1]].innerHTML;
    let v2 = boxes[winConditions[i][2]].innerHTML;

    if (v0 !== "" && v0 === v1 && v0 === v2) {
      isGameOver = true;
      document.querySelector("#results").innerHTML = turn + " wins!";
      document.querySelector("#play-again").style.display = "inline";

      for (let j = 0; j < 3; j++) {
        boxes[winConditions[i][j]].style.backgroundColor = "#08D9D6";
      }
      return;
    }
  }
}

function checkDraw() {
  if (!isGameOver) {
    let isDraw = true;
    boxes.forEach((e) => {
      if (e.innerHTML === "") isDraw = false;
    });
    if (isDraw) {
      isGameOver = true;
      document.querySelector("#results").innerHTML = "Draw";
      document.querySelector("#play-again").style.display = "inline";
    }
  }
}

function calculateProbabilities() {
  let emptyIndexes = [];
  let board = [];

  boxes.forEach((box, index) => {
    board[index] = box.innerHTML;
    if (box.innerHTML === "") emptyIndexes.push(index);
  });

  const outcomes = simulateOutcomes(board, emptyIndexes, turn);
  updateProbabilities(outcomes);
}

function simulateOutcomes(board, emptyIndexes, currentTurn) {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let xWins = 0,
    oWins = 0,
    draws = 0;

  function checkWin(board, player) {
    return winConditions.some((condition) =>
      condition.every((index) => board[index] === player)
    );
  }

  function simulate(board, emptyIndexes, currentTurn) {
    if (checkWin(board, "X")) {
      xWins++;
      return;
    }
    if (checkWin(board, "O")) {
      oWins++;
      return;
    }
    if (emptyIndexes.length === 0) {
      draws++;
      return;
    }

    emptyIndexes.forEach((index, i) => {
      const newBoard = [...board];
      const newEmptyIndexes = [...emptyIndexes];
      newBoard[index] = currentTurn;
      newEmptyIndexes.splice(i, 1);
      simulate(newBoard, newEmptyIndexes, currentTurn === "X" ? "O" : "X");
    });
  }

  simulate(board, emptyIndexes, currentTurn);

  const totalSimulations = xWins + oWins + draws;
  return {
    xWinPercent:
      totalSimulations > 0 ? ((xWins / totalSimulations) * 100).toFixed(2) : 0,
    oWinPercent:
      totalSimulations > 0 ? ((oWins / totalSimulations) * 100).toFixed(2) : 0,
    drawPercent:
      totalSimulations > 0 ? ((draws / totalSimulations) * 100).toFixed(2) : 0,
  };
}

function updateProbabilities({ xWinPercent, oWinPercent, drawPercent }) {
  document.getElementById("x-prob").textContent = xWinPercent;
  document.getElementById("o-prob").textContent = oWinPercent;
  document.getElementById("draw-prob").textContent = drawPercent;
}

document.querySelector("#play-again").addEventListener("click", () => {
  isGameOver = false;
  turn = "X";
  document.querySelector(".bg").style.left = "0";
  document.querySelector("#results").innerHTML = "";
  document.querySelector("#play-again").style.display = "none";

  boxes.forEach((e) => {
    e.innerHTML = "";
    e.style.removeProperty("background-color");
  });

  document.getElementById("x-prob").textContent = "0";
  document.getElementById("o-prob").textContent = "0";
  document.getElementById("draw-prob").textContent = "0";
});
