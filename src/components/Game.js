import React, { useEffect, useState } from 'react';
import Board from './Board';
import { textUtils } from '../vendor/react-janus';

function Game({ janus, room, username }) {
  const [players, setPlayers] = useState(0);
  const [result, setResult] = useState({ winner: 'none', state: 'none' });
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [player, setPlayer] = useState('X');
  const [turn, setTurn] = useState('X');

  const janusCallback = (handle, event, data) => {
    console.log(event, data);
    switch (event) {
      case 'success':
        setPlayers(data.participants.length);
        break;
      case 'join':
        if (username !== data.username && players < 1) {
          setPlayers((prevState => prevState + 1));
        }
        break;
      case 'message':
        if (username !== data.from) {
          const {square : rivalSquare, player : rivalPlayer} = JSON.parse(data.text);
          const currentPlayer = rivalPlayer === 'X' ? 'O' : 'X';
          setPlayer(currentPlayer);
          setTurn(currentPlayer);
          setBoard(board.map((val, index) => {
            if (index === rivalSquare && val === '') {
              return rivalPlayer
            }
            return val;
          }))
        };
        break;
      default:
        break;
    }
  }

  const chooseSquare = async (square) => {
    if (turn === player && board[square] === '') {
      setTurn(player === 'X' ? 'O' : 'X');

      textUtils.sendData(
        room,
        JSON.stringify({square, player}),
        'message'
      )
      setBoard(board.map((val, index) => {
        if (index === square && val === '') {
          return player
        }
        return val;
      }));
    }
  }

  useEffect(() => {
    textUtils.publishChatroom(
      janus,
      'textroom-' + username,
      true,
      room,
      username,
      username,
      janusCallback
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [janus]);

  return (
    <>
      {players === 0 && (
        <p>Waiting for other participants to join</p>
      )}
      {players === 1 && (
        <div className='gameContainer'>
          <h3>Game {room}</h3>
          <p>User: {username}</p>
          <Board
            setResult={setResult} 
            board={board}
            handleChooseSquare={chooseSquare}
          />
          {result.state === 'won' && <div>{result.winner} won the game</div>}
          {result.state === 'tie' && <div>Game Tied</div>}
        </div>
      )}
      {players >= 2 && (
        <p>This game is full!</p>
      )}
    </>
  )
}

export default Game;