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

function Board() {

  return (
    <div className='board'>
      
    </div>
  )
}

export default Board;