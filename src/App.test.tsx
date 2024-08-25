import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
//import findPairs from './App';

type Player = {
  first_name: string;
  last_name: string;
  h_in: string;
};

const mockPlayers = [
  { first_name: 'Brevin', last_name: 'Knight', h_in: '69' },
  { first_name: 'Nate', last_name: 'Robinson', h_in: '70' },
  { first_name: 'Mike', last_name: 'Wilks', h_in: '69' },
];

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

test('findPairs should return correct pairs', () => {
  const pairs = findPairs(mockPlayers, 139);
  expect(pairs.length).toBe(2);
  expect(pairs).toEqual([
      [{ first_name: 'Brevin', last_name: 'Knight', h_in: '69' }, { first_name: 'Nate', last_name: 'Robinson', h_in: '70' }],
      [{ first_name: 'Nate', last_name: 'Robinson', h_in: '70' }, { first_name: 'Mike', last_name: 'Wilks', h_in: '69' }],
  ]);
});

test('findPairs should return an empty array when no pairs are found', () => {
  const pairs = findPairs(mockPlayers, 150);
  expect(pairs.length).toBe(0);
});