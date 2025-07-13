# Acquire Game

Acquire Game is a strategy-based board game where players build hotel chains, acquire stocks, and compete to maximize their assets. Players can found, grow, or merge hotel chains to dominate the board and become the wealthiest player by the end of the game.

---

## How the Game Works

### Objective
The goal of the game is to accumulate the highest total assets, which consist of:
1. **Cash**: Earned through gameplay, mergers, and stock sales.
2. **Stock Value**: Determined by the hotel chains you hold shares in and their size at the end of the game.

### Actions in the Game
During each player's turn, they perform the following actions:

1. **Tile Placement**:
   - The player places a tile on the board, which can:
     - **Found a Hotel**: If the tile is not adjacent to an existing hotel chain, it starts a new chain.
     - **Grow a Hotel**: If the tile is adjacent to an existing hotel chain, it expands that chain.
     - **Merge Hotels**: If the tile connects two or more hotel chains, those chains merge into one larger chain.

2. **Stock Purchasing**:
   - After placing a tile, players can purchase stocks from any active hotel chain (up to a maximum of 3 stocks per turn). Stock values depend on the size of the hotel chain.

3. **Mergers**:
   - When two hotel chains merge, the larger chain absorbs the smaller one. Players with stocks in the absorbed chain are rewarded based on majority ownership and can choose to sell, trade, or keep their shares.

---

## Game Progression
1. Players take turns placing tiles and growing or founding hotel chains.
2. Mergers occur when tiles connect multiple hotel chains.
3. The game ends when:
   - A hotel chain becomes "safe" (reaches a size where it cannot merge with another chain).
   - The remaining tiles do not allow for further growth or mergers.

At the end of the game, the player's assets (cash + stock value) are calculated, and the winner is determined.

---

## Bot Strategies

### **Smallest-Anti Bot**
- **Tile Placement**: Plays the **smallest available tile** (numerically lowest) from its hand first.
- **Stock Purchasing**: Buys shares of the **alphabetically first hotel chain** available, prioritizing disruption of opponent growth.

### **Largest-Alpha Bot**
- **Tile Placement**: Plays the **largest available tile** (numerically highest) from its hand first.
- **Stock Purchasing**: Buys shares of the **largest hotel chain**, prioritizing maximizing its own asset value.

---

## Key Features

1. **Dynamic Notifications**:
   - Notifications with vibrations alert players to major actions:
     - **Founding a Hotel**: When a new hotel is started.
     - **Growing a Hotel**: When a hotel chain expands.
     - **Merging Hotels**: When two or more hotels merge.

2. **Automated Bot Actions**:
   - Bots automatically place tiles and purchase stocks based on their strategies. Stock purchases for bots occur without user input.

3. **Interactive Stock Modal**:
   - In **Self Mode**, players can manually choose which stocks to purchase. This modal works correctly and allows custom input.

4. **Intelligent Bot & Self Mode**:
   - Currently under development and will be implemented soon.

---

## Backend Integration

The backend is hosted on Render at:  
**[https://acquiregame.onrender.com](https://acquiregame.onrender.com)**

### Backend Notes:
- The backend handles critical game logic, such as bot strategies, tile placements, and determining winners.
- The backend may go into a "sleep" state after inactivity due to hosting limitations.  
  - The app automatically pings the backend to wake it up.
  - **If this fails, visit the backend URL in your browser to activate it manually.**

---

## Bot Gameplay and Turns

### Turn Phases for Bot Players

1. **Tile Placement**:
   - The bot places a tile on the board based on its selected strategy:
     - **Smallest-Anti Bot**:
       - Places the **numerically smallest tile** available from its hand.
       - If multiple options exist, prioritizes alphabetically earlier hotels for tile placement.
     - **Largest-Alpha Bot**:
       - Places the **numerically largest tile** available.
       - Prioritizes expanding or merging into larger hotel chains.
     - **Random Bot**:
       - Randomly selects and places a tile from its hand.
   - Tile placement actions trigger the following:
     - **Founding a hotel** if the tile starts a new chain.
     - **Growing a hotel** if the tile expands an existing chain.
     - **Merging hotels** if the tile connects two or more chains.

2. **Buy Stocks**:
   - After placing a tile, the bot automatically purchases stocks based on its strategy.
   - The **stock purchase modal** appears during this phase, but the input from the user won't affect bot decisions.
   - Stock decisions:
     - **Smallest-Anti Bot**:
       - Buys stocks from the alphabetically first available hotel.
     - **Largest-Alpha Bot**:
       - Buys stocks from the largest chain to maximize future asset value.
     - **Random Bot**:
       - Randomly selects a hotel to buy stocks from.

3. **Turn Management**:
   - Once the bot completes the tile placement and stock purchase phases:
     - **Pass Turn Button**:
       - Allows progression to the next player's turn (the next bot or user).
     - **Finish Game Button**:
       - Ends the game immediately and navigates to the **Winner Page**.

---

### Ending the Game

When the **Finish Game Button** is pressed:
1. The game evaluates the total assets for all players.
2. **Total Assets** are calculated as:
   - **Cash**: The amount of cash the player holds.
   - **Stock Value**: Based on the size of each hotel chain and the number of stocks the player holds (calculated using the `getStockPrice` function).
3. The player with the highest total assets is declared the **Winner**.

---

### Example Gameplay Flow
1. **Player 1 (Bot)**:
   - Places a tile based on strategy (e.g., **Smallest-Anti**).
   - Automatically buys stocks (e.g., prioritizes alphabetically first hotel).
   - Enables **Pass Turn** or **Finish Game** buttons.

2. **Player 2 (Bot)**:
   - Similar flow as Player 1, with tile placement and stock purchase dictated by its strategy.

3. **Finish Game**:
   - On pressing the **Finish Game Button**, the winner is calculated, considering:
     - **Cash held** by each player.
     - **Stock value** based on the hotel sizes at the end of the game.

4. **Winner Page**:
   - Displays the winner's name and total assets, calculated as `cash + stock value`.

---

## How to Run the Project

This project was built using **React Native CLI** (not Expo). To run the project locally:

1. **Install Dependencies**:
   - Run `npm install` or `yarn` to install all required dependencies.

2. **Start the React Native Server**:
   - Open a terminal and navigate to the project directory.
   - Run:
     ```bash
     npx react-native start
     ```

3. **Run the App on iOS or Android**:
   - Open a second terminal in the same directory and use one of the following commands:
     - For iOS (using a specific simulator, e.g., iPhone 15):
       ```bash
       npx react-native run-ios --simulator="iPhone 15"
       ```
     - For Android:
       ```bash
       npx react-native run-android
       ```

4. **Backend Activation**:
   - Ensure the backend is awake by visiting:
     ```bash
     https://acquiregame.onrender.com
     ```
   - If the backend goes to sleep, it may need to be reactivated by visiting this URL in a browser.

Once these steps are complete, the app will run on the selected emulator or connected device. Enjoy playing Acquire Game!