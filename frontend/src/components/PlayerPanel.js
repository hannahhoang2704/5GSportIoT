import React from 'react';

function PlayerPanel({players, selectedPlayerId, onSelectPlayer}) {
  return (
    <div className="player-panel">
      <h2>Players</h2>
      <ul>
        {players.map((player) => (
          <li
            key={player.id}
            onClick={() => onSelectPlayer(player.id)}
            className={player.id === selectedPlayerId ? 'active' : ''}
            style={{cursor: 'pointer'}}
          >
            {player.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerPanel;
