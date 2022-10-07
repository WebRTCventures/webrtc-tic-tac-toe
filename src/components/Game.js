import React, { useEffect, useState } from 'react';
import Board from './Board';
import { textUtils } from '../vendor/react-janus';

function Game({ janus, room }) {
  const [players, setPlayers] = useState(0);
  const [result, setResult] = useState({ winner: 'none', state: 'none' });
  const myid = textUtils.randomString(12);

  const janusCallback = (handle, event, data) => {
    console.log(event, data);
    switch (event) {
      case 'onsuccess':
        setPlayers(data.participants.length);
        break;
      case 'onjoin':
        if (myid !== data.username) {
          setPlayers((prevState => prevState + 1));
        }
        break;
      default:
        break;
    }
  }

  const handleChangeResult = (r) => {
    setResult(r);
  }

  useEffect(() => {
    textUtils.publishChatroom(
      janus,
      'textroom' + textUtils.randomString(12),
      true,
      room,
      myid,
      myid,
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
          <Board result={result} handleChangeResult={handleChangeResult}/>
        </div>
      )}
      {players >= 2 && (
        <p>This game is full!</p>
      )}
    </>
  )
}

export default Game;