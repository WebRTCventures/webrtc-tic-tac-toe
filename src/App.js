import React, { useState } from 'react';
import './App.css';
import Game from './components/Game';
import JoinGame from './components/JoinGame';
import { JanusComponent } from './vendor/react-janus';

function App() {
  const [inGame, setInGame] = useState(false);
  const [room, setRoom] = useState('')

  const handleJoinGame = (roomId) => {
    setRoom(roomId);
    setInGame(true);
  }
  return (
    <>
      {inGame ? (
        <>
          <JanusComponent 
            server="/janus"
            iceUrls='stun:stun.l.google.com:19302'>
              <Game room={room}/>
          </JanusComponent>
        </>
      ) : (
        <JoinGame handleJoinGame={handleJoinGame} />
      )}
    </>
  );
}

export default App;
