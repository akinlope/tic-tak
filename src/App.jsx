import { useState } from "react";
import { GameBoard } from "./components/GameBoard";
import { Player } from "./components/Player";
import { Log } from "./components/Log";
import { WINNING_COMBINATIONS } from "./winning";
import { GameOver } from "./components/GameOver";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const derivedActivePlayer = (gameTurn) => {
  let currentPlayer = "X";
  if (gameTurn.length > 0 && gameTurn[0].player === "X") {
    currentPlayer = "O";
  }
  return currentPlayer;
}

function App() {
  const [playerName, setPlayerName] = useState({
    X: "Player 1",
    O: "Player 2"
  });
  const [gameTurns, setGameTurns] = useState([]);
  const activePlayer = derivedActivePlayer(gameTurns);
  

  let gameBoard = [...initialGameBoard.map(arr => [...arr])]
  
  for (const turn of gameTurns){
    const {square, player} = turn;
    const {row, col} = square;
    gameBoard[row][col] = player;
  }

  let winner;

  for(const combination of WINNING_COMBINATIONS){
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

    if(firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol){
      winner = playerName[firstSquareSymbol];

    }
  }

  console.log(winner);

  const hasDraw = gameTurns.length == 9 && !winner

  const handleActivePlayer = (rowIndex, colIndex) => {
    
    setGameTurns((prevTurns) => {
      const currentPlayer = derivedActivePlayer(prevTurns)
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];

      return updatedTurns;
    });
  };

  const handlePlayerName = (symbol, newName) => {
    setPlayerName(prevPlayer => {
      return {
        ...prevPlayer, 
        [symbol]: newName
      }
    })
  }
 
  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={"Player 1"}
            symbol={"X"}
            active={activePlayer === "X"}
            handlePlayerName={handlePlayerName}
          />
          <Player
            initialName={"Player 2"}
            symbol={"O"}
            active={activePlayer === "O"}
            handlePlayerName={handlePlayerName}
          />
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} rematch={setGameTurns}/>}
        <GameBoard onSelectedPlayer={handleActivePlayer} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
