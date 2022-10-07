import React, { useState } from 'react';

function JoinCall({ handleJoinGame }) {
  const [roomId, setRoomId] = useState('');

  return (
    <>
      <input type='text' placeholder='Enter Room Number' value={roomId} onChange={(evt) => setRoomId(evt.target.value)} />
      <button onClick={() => handleJoinGame(parseInt(roomId))}>Join Call</button>
    </>
  );
}

export default JoinCall;