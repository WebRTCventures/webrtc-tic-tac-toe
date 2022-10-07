import React, { useState } from 'react';
import './App.css';
import Game from './components/Game';
import { JanusComponent } from './vendor/react-janus';

function App() {
  const [inGame, setInGame] = useState(false);
  const [room, setRoom] = useState('')
  const [username, setUsername] = useState('')

  const handleJoinGame = () => {
    if (room && username) setInGame(true);
  }
  return (
    <>
      {inGame ? (
        <>
          <JanusComponent 
            server="/janus"
            iceUrls='stun:stun.l.google.com:19302'>
              <Game room={room} username={username} setInGame={setInGame}/>
          </JanusComponent>
        </>
      ) : (
        <>
          <input type='text' placeholder='Enter Room Number' value={room} onChange={(evt) => setRoom(parseInt(evt.target.value))} />
          <input type='text' placeholder="Enter Username" value={username} onChange={(evt) => setUsername(evt.target.value)} />
          <button onClick={() => handleJoinGame(parseInt(room))}>Join Call</button>
        </>
      )}
    </>
  );
}

export default App;
