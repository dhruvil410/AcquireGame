export enum PlayerMode {
  Self = 'self',
  Random = 'random',
  SmallestAnti = 'smallest_anti',
  LargestAlpha = 'largest_alpha',
  Intelligent = 'intelligent',
}

export interface PlayerData {
  id: number;
  name: string;
  mode: PlayerMode ;
  cash: number;
  sharesCount: number[];               // Represents shares count for each hotel chain
  tiles: string[];                      // Player's owned tiles (e.g., ['A1', 'B2'])
}

export interface HotelChain {
  id: number;
  name: string;
  color: string;
  // availableStocks: number;
}

export interface BoardTile {
  row: number;
  col: number;
  hotelChainId: number | null;          // Null if unoccupied, -1 for occupied, 0-6 for hotel chains
}

// This reflects the backend's board state structure for /play response
export interface BoardState {
  boardState: number[][];               // 2D array indicating occupancy and hotel chain on each tile
}

// The GameState represents the state of the game received from the backend
export interface GameState {
  board: BoardState;                    // The board's current state
  players: PlayerData[];                // List of players with updated assets
  hotelsInfo: {
      hotelAvailable: boolean[];        // Availability of each hotel
      hotelSharesCount: number[];       // Stocks available for each hotel
  };
  currentPlayerId: number;              // ID of the current player
}

export interface BackendResponse {
  state: GameState;                     // Game state from backend
  sharesValuation: number[];            // Array for share valuations (optional if needed)
}
