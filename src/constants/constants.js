// Constants
export const API_FOOTBALL = 'f0257b77e567f70cce8d7d4e9f4024560e5d98699f7888054ee315d665d7a868';
export const LEAGUE_IDS = {
  63: 'England: Championship',
  128: 'France: Ligue 2'
};
export let LEAGUE_POSITION_PLACEMENTS = {
  63: {
    total: 24,
    promotion: 3,
    playoffs: 7,
    relegation: null
  },
  128: {
    total: 20,
    promotion: 2,
    playoffs: 5,
    relegation: null
  }
}

LEAGUE_POSITION_PLACEMENTS['63'].relegation =  LEAGUE_POSITION_PLACEMENTS['63'].total - 3;
LEAGUE_POSITION_PLACEMENTS['128'].relegation =  LEAGUE_POSITION_PLACEMENTS['128'].total - 3;
