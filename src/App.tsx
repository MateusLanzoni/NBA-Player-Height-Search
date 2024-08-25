
import React, { useState } from 'react';
import axios from 'axios';

interface Player {
  first_name: string;
  last_name: string;
  h_in: string;
  img_url?: string;  // Optional property for the image URL
}

// Example: Map player names to image URLs (Replace with real URLs)
const playerImageMap: { [key: string]: string } = {
  "Brevin Knight": "https://example.com/brevin_knight.jpg",
  "Nate Robinson": "https://example.com/nate_robinson.jpg",
  "Mike Wilks": "https://example.com/mike_wilks.jpg",
};

const App: React.FC = () => {
  const [inputHeight, setInputHeight] = useState<number | ''>('');
  const [playerPairs, setPlayerPairs] = useState<[Player, Player][] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchPlayerData = async () => {
    try {
      const response = await axios.get('https://mach-eight.uc.r.appspot.com');
      const players = response.data.values as Player[];

      // Assign image URLs from the map
      players.forEach(player => {
        const fullName = `${player.first_name} ${player.last_name}`;
        if (playerImageMap[fullName]) {
          player.img_url = playerImageMap[fullName];
        }
      });

      return players;
    } catch (error) {
      console.error('Error fetching player data', error);
      setErrorMessage('Failed to fetch player data.');
      return [];
    }
  };

  const findPairs = (players: Player[], targetHeight: number): [Player, Player][] => {
    const pairs: [Player, Player][] = [];
    const heightMap: { [key: string]: Player } = {};

    players.forEach(player => {
      const currentHeight = parseInt(player.h_in);
      const neededHeight = targetHeight - currentHeight;

      if (heightMap[neededHeight]) {
        pairs.push([heightMap[neededHeight], player]);
      }
      heightMap[currentHeight] = player;
    });

    return pairs;
  };

  const handleSearch = async () => {
    if (typeof inputHeight !== 'number' || inputHeight <= 0) {
      setErrorMessage('Please enter a valid height in centimeters.');
      return;
    }

    // Convert the input height from cm to inches
    const heightInInches = Math.round(inputHeight / 2.54);

    const players = await fetchPlayerData();
    const pairs = findPairs(players, heightInInches);

    // Check for individual player matches
    const individualMatches = players.filter(
      player => parseInt(player.h_in) === heightInInches
    );

    if (pairs.length > 0 || individualMatches.length > 0) {
      setPlayerPairs(pairs);

      // Display individual matches as pairs with themselves
      individualMatches.forEach(player => {
        pairs.push([player, player]);
      });

      setPlayerPairs(pairs);
      setErrorMessage('');
    } else {
      setPlayerPairs(null);
      setErrorMessage('No matches found');
    }
  };

  return (
    <div className="App">
      <h1>NBA Player Height Search</h1>
      <input
        type="number"
        value={inputHeight}
        onChange={(e) => setInputHeight(Number(e.target.value))}
        placeholder="Enter height in centimeters"
      />
      <button onClick={handleSearch}>Search</button>
      {errorMessage && <p>{errorMessage}</p>}
      {playerPairs && (
        <ul>
          {playerPairs.map(([player1, player2], index) => (
            <li key={index}>
              <div>
                {player1.img_url && (
                  <img src={player1.img_url} alt={player1.first_name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                )}
                {player1.first_name} {player1.last_name} &nbsp;
                {player2.img_url && (
                  <img src={player2.img_url} alt={player2.first_name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                )}
                {player2.first_name} {player2.last_name}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
