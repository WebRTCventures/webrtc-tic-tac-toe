import React, {useEffect} from 'react';
import Square from './Square';

export const Patterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6]
]

function Board({ 
  setResult, 
  board,
  handleChooseSquare,
}) {

  useEffect(() => {
    checkWin();
    checkIfTie();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  const checkWin = () => {
    Patterns.forEach(currPattern => {
      const firstPlayer = board[currPattern[0]];
      if (firstPlayer === "") return;
      let foundWinningPattern = true;
      
      currPattern.forEach(idx => {
        if (board[idx] !== firstPlayer) {
          foundWinningPattern = false;
        }
      });

      if (foundWinningPattern) {
        setResult({winner: board[currPattern[0]], state: "won" })
      }
    });
  }

  const checkIfTie = () => {
    let filled = true;
    board.forEach(square => {
      if (square === '') {
        filled = false;
      }
    });

    if (filled) {
      setResult({winner: 'none', state: 'tie'});
    }
  }
  return (
    <div className='board'>
      <div className='row'>
        <Square handleChooseSquare={() => handleChooseSquare(0)} val={board[0]} />
        <Square handleChooseSquare={() => handleChooseSquare(1)} val={board[1]} />
        <Square handleChooseSquare={() => handleChooseSquare(2)} val={board[2]} />
      </div>
      <div className='row'>
        <Square handleChooseSquare={() => handleChooseSquare(3)} val={board[3]} />
        <Square handleChooseSquare={() => handleChooseSquare(4)} val={board[4]} />
        <Square handleChooseSquare={() => handleChooseSquare(5)} val={board[5]} />
      </div>
      <div className='row'>
        <Square handleChooseSquare={() => handleChooseSquare(6)} val={board[6]} />
        <Square handleChooseSquare={() => handleChooseSquare(7)} val={board[7]} />
        <Square handleChooseSquare={() => handleChooseSquare(8)} val={board[8]} />
      </div>
    </div>
  )
}

export default Board;