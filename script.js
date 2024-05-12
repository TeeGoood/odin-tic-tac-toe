function Board() {
  const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  function markBoard(x, y, mark) {
    board[x][y] = mark;
  }

  function getBoard() {
    return board;
  }

  return { markBoard, getBoard };
}

function GameController(player1Name = "player1", player2Name = "player2") {
  const boardObject = Board();
  const players = [
    {
      name: player1Name,
      mark: "X",
    },
    { name: player2Name, mark: "O" },
  ];
  let round = 0;

  function getActivePlayer() {
    const index = round % 2;
    return players[index];
  }

  function getWinner() {
    let winnerMark = "";
    const board = boardObject.getBoard();

    //check horizontal
    for (let row = 0; row <= 2; row++) {
      if (board[row][0] == board[row][1] && board[row][1] == board[row][2]) {
        winnerMark = board[row][0];
      }
    }

    //check vertical
    for (let col = 0; col <= 2; col++) {
      if (board[0][col] == board[1][col] && board[1][col] == board[2][col]) {
        winnerMark = board[0][col];
      }
    }

    //check diagonal
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
      winnerMark = board[0][0];
    }

    //check anti diagonal
    if (board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
      winnerMark = board[0][2];
    }

    if (winnerMark == "") {
      return round < 9 ? null : "draw";
    } else {
      //console.log("winner mark : " + winnerMark);
      return players.find((player) => player.mark == winnerMark).name;
    }
  }

  function getGameState() {
    return {
      board: boardObject.getBoard(),
      activePlayer: getActivePlayer(),
      winner: getWinner(),
    };
  }

  function selectMark(mark) {
    players[0].mark = mark;
  }

  function playRound(x, y) {
    if (getWinner()) return;
    if (boardObject.getBoard()[x][y] != "") return;
    boardObject.markBoard(x, y, getActivePlayer().mark);
    round++;
    /* boardObject.printBoard();
    console.log(`round: ${round}`);
    console.log(`winner: ${getWinner()}`); */
  }

  function restartGame() {
    boardObject = Board();
    round = 0;
  }

  return {
    selectMark,
    playRound,
    restartGame,
    getGameState,
  };
}

function screenController() {
  const gameController = GameController("tee", "tingting");
  const boardDiv = document.querySelector(".board");
  const statusHeader = document.querySelector(".status");

  function updateScreen() {
    const state = gameController.getGameState();
    boardDiv.textContent = "";
    //draw status
    if (state.winner) {
      statusHeader.textContent =
        state.winner == "draw" ? "Draw" : `${state.winner} win`;
    } else {
      statusHeader.textContent = `${state.activePlayer.name}'s turn`;
    }

    //draw board
    state.board.forEach((row, rowIndex) =>
      row.forEach((col, colIndex) => {
        const cellButton = document.createElement("button");
        cellButton.textContent = col;
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.col = colIndex;
        boardDiv.appendChild(cellButton);
      })
    );
  }

  function playRound(e) {
    const col = e.target.dataset.col;
    const row = e.target.dataset.row;
    gameController.playRound(row, col);
    updateScreen();
  }

  boardDiv.addEventListener('click', playRound);
  updateScreen();
}

screenController();
