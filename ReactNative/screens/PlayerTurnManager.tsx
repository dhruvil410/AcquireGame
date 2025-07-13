import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import { PlayerData } from '../types';
import { colors } from '../colors';

import { getStockPrice } from '../utils';
import BuyStocks from './BuyStocks';
import GameNotification from '../notification/GameNotification';
import { HotelChain } from '../types';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

import { StackNavigationProp } from '@react-navigation/stack';

type PlayerTurnManagerRouteProp = RouteProp<RootStackParamList, 'PlayerTurnManager'>;
type PlayerTurnManagerNavigationProp = StackNavigationProp<RootStackParamList, 'PlayerTurnManager'>;

// const navigation=useNavigation<PlayerTurnManagerRouteProp>();

type Props = {
  route: PlayerTurnManagerRouteProp;
  navigation: PlayerTurnManagerNavigationProp;
};

const hotelChains: HotelChain[] = [
  { id: 0, name: 'Luxor', color: colors.hotelColors['0'] },
  { id: 1, name: 'Tower', color: colors.hotelColors['1'] },
  { id: 2, name: 'American', color: colors.hotelColors['2'] },
  { id: 3, name: 'Festival', color: colors.hotelColors['3'] },
  { id: 4, name: 'Imperial', color: colors.hotelColors['4'] },
  { id: 5, name: 'Worldwide', color: colors.hotelColors['5'] },
  { id: 6, name: 'Continental', color: colors.hotelColors['6'] },
];

const PlayerTurnManager: React.FC<Props> = ({ route }) => {
  
  const navigation = useNavigation<PlayerTurnManagerNavigationProp>();

  const { initialBoard, cellSize, cellMargin } = route.params;
  const [players, setPlayers] = useState<PlayerData[]>(route.params.players);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [boardState, setBoardState] = useState(initialBoard);
  const [hotelsInfo, setHotelsInfo] = useState({
    hotelAvailable: [true, true, true, true, true, true, true],
    hotelSharesCount: [25, 25, 25, 25, 25, 25, 25],
  });
  const [currentPlayerAssets, setCurrentPlayerAssets] = useState({
    cash: players[currentTurn].cash,
    sharesCount: players[currentTurn].sharesCount,
    tiles: players[currentTurn].tiles,
  });

  const [isBuyStocksVisible, setIsBuyStocksVisible] = useState(false);
  const [moveIndex, setMoveIndex] = useState(1); // Start from 1 to match /1 endpoint
  const [buttonState, setButtonState] = useState<'placeTile' | 'buyStocks' | 'passTurn'>(
    'placeTile'
  ); // Track button state

  useEffect(() => {
    // Update current player's assets when the turn changes
    const currentPlayer = players[currentTurn];
    setCurrentPlayerAssets({
      cash: currentPlayer.cash,
      sharesCount: currentPlayer.sharesCount,
      tiles: currentPlayer.tiles,
    });
    console.log('Current player assets updated:', currentPlayerAssets);
  }, [currentTurn, players]);

  // Function to navigate to the Winner screen
  const handleFinishGame = () => {
    navigation.navigate('Winner', { players });
  };

  const [notification, setNotification] = useState<{
    visible: boolean;
    message: string;
    type: 'found' | 'grow' | 'merge';
  } | null>(null);

  const determineGameAction = (previousBoardState: number[][], newBoardState: number[][]) => {
    let foundCount = 0;
    let mergeCount = 0;
    let growCount = 0;

    for (let row = 0; row < newBoardState.length; row++) {
      for (let col = 0; col < newBoardState[row].length; col++) {
        if (previousBoardState[row][col] === -2 && newBoardState[row][col] >= 0) {
          // Tile was unoccupied (-2) and is now occupied with a hotel chain (>= 0)
          const neighboringChains = getNeighboringChains(row, col, previousBoardState);
          if (neighboringChains.size === 0) {
            // No neighboring hotel chains, this is a "Found" action
            foundCount++;
          } else if (neighboringChains.size === 1) {
            // One neighboring chain, this is a "Grow" action
            growCount++;
          } else if (neighboringChains.size > 1) {
            // More than one neighboring chain, this is a "Merge" action
            mergeCount++;
          }
        }
      }
    }

    if (mergeCount > 0) {
      return 'merge';
    } else if (foundCount > 0) {
      return 'found';
    } else if (growCount > 0) {
      return 'grow';
    }
    return null;
  };

  const getNeighboringChains = (row: number, col: number, board: number[][]) => {
    const neighboringPositions = [
      [row - 1, col], // Up
      [row + 1, col], // Down
      [row, col - 1], // Left
      [row, col + 1], // Right
    ];

    const chains = new Set<number>();
    neighboringPositions.forEach(([r, c]) => {
      if (r >= 0 && r < board.length && c >= 0 && c < board[0].length) {
        if (board[r][c] >= 0) {
          chains.add(board[r][c]);
        }
      }
    });

    return chains;
  };

  // const handlePlaceTile = async () => {
  //   if (moveIndex > 12) {
  //     Alert.alert('Game Over');
  //     return;
  //   }

  //   try {
  //     // Fetch the next move from the backend
  //     const response = await fetch(`https://acquiregame.onrender.com/${moveIndex}`);
  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch move ${moveIndex}`);
  //     }
  //     const data = await response.json();

  //     const previousBoardState = boardState.map((row) => [...row]); // Deep copy of board state

  //     // Update game state based on the response
  //     const { board, players: updatedPlayersFromBackend, hotelsInfo: updatedHotelsInfo } = data;

  //     // Update board state
  //     setBoardState(board.boardState);

  //     // Determine and announce game action
  //     const gameAction = determineGameAction(previousBoardState, board.boardState);
  //     if (gameAction === 'found') {
  //       setNotification({
  //       visible: true,
  //       message: 'A new hotel chain has been founded!',
  //       type: 'found'
  //     });
  //     } else if (gameAction === 'grow') {
  //       setNotification({
  //         visible: true,
  //         message: 'An existing hotel chain has grown!',
  //         type: 'grow'
  //       });
  //     }  else if (gameAction === 'merge') {
  //       setNotification({
  //         visible: true,
  //         message: 'Two hotel chains have merged!',
  //         type: 'merge'
  //       });
  //     }

  //     // Update hotels info
  //     setHotelsInfo(updatedHotelsInfo);

  //     // Update players
  //     const updatedPlayers = players.map((player, index) => {
  //       const updatedPlayerData = updatedPlayersFromBackend[index];
  //       return {
  //         ...player,
  //         cash: updatedPlayerData.cash,
  //         sharesCount: updatedPlayerData.sharesCount,
  //         tiles: updatedPlayerData.tiles,
  //       };
  //     });
  //     setPlayers(updatedPlayers);

  //     // Update current player's assets
  //     setCurrentPlayerAssets({
  //       cash: updatedPlayers[currentTurn].cash,
  //       sharesCount: updatedPlayers[currentTurn].sharesCount,
  //       tiles: updatedPlayers[currentTurn].tiles,
  //     });

  //     // Update the button state to "buyStocks"
  //     setButtonState('buyStocks');

  //     // Increment move index for next turn
  //     setMoveIndex(moveIndex + 1);
  //   } catch (error) {
  //     console.error('Error fetching move:', error);
  //     Alert.alert('Error', `An error occurred while fetching move ${moveIndex}`);
  //   }
  // };

  const handlePlaceTile = async() =>{
    try{
      const response = await fetch(`https://acquiregame.onrender.com/botTurn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerIndex: currentTurn }), // Send currentTurn as playerIndex
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bot turn');
      }

      const data = await response.json();
      const previousBoardState = boardState.map((row) => [...row]); // Deep copy of board state

      // Update game state based on the response
      const { board, players: updatedPlayersFromBackend, hotelsInfo: updatedHotelsInfo } = data;

      // Update board state
      setBoardState(board.boardState);

      // Determine and announce game action
      const gameAction = determineGameAction(previousBoardState, board.boardState);
      if (gameAction === 'found') {
        setNotification({
        visible: true,
        message: 'A new hotel chain has been founded!',
        type: 'found'
      });
      } else if (gameAction === 'grow') {
        setNotification({
          visible: true,
          message: 'An existing hotel chain has grown!',
          type: 'grow'
        });
      }  else if (gameAction === 'merge') {
        setNotification({
          visible: true,
          message: 'Two hotel chains have merged!',
          type: 'merge'
        });
      }

      // Update hotels info
      setHotelsInfo(updatedHotelsInfo);

      // Update players
      const updatedPlayers = players.map((player, index) => {
        const updatedPlayerData = updatedPlayersFromBackend[index];
        return {
          ...player,
          cash: updatedPlayerData.cash,
          sharesCount: updatedPlayerData.sharesCount,
          tiles: updatedPlayerData.tiles,
        };
      });
      setPlayers(updatedPlayers);

      // Update current player's assets
      setCurrentPlayerAssets({
        cash: updatedPlayers[currentTurn].cash,
        sharesCount: updatedPlayers[currentTurn].sharesCount,
        tiles: updatedPlayers[currentTurn].tiles,
      });

      // Update the button state to "buyStocks"
      setButtonState('buyStocks');

      // Increment move index for next turn
      setMoveIndex(moveIndex + 1);
    } catch (error) {
      console.error('Error fetching move:', error);
      Alert.alert('Error', `An error occurred while fetching move ${moveIndex}`);
    }
  }

  const handleBuyStocks = () => {
    // Open the Buy Stocks modal
    setIsBuyStocksVisible(true);
  };

  const handleConfirmStockPurchase = (purchases: { hotelId: number; quantity: number }[]) => {
    console.log('Starting stock purchase with:', purchases);
    // Update player's cash and shares count
    let totalCost = 0;

    const updatedPlayers = [...players];
    const currentPlayer = { ...updatedPlayers[currentTurn] };
    const updatedHotelSharesCount = [...hotelsInfo.hotelSharesCount];

    purchases.forEach((p) => {
      const chainSize = getChainSize(p.hotelId);
      const price = getStockPrice(p.hotelId, chainSize);
      const cost = price * p.quantity;

      totalCost += cost;

      // currentPlayer.cash -= cost;
      // currentPlayer.sharesCount[p.hotelId] += p.quantity;

      // updatedHotelSharesCount[p.hotelId] -= p.quantity;
      totalCost += cost;
      if (currentPlayer.cash < totalCost) {
        Alert.alert('Error', 'You do not have enough cash.');
        return;
      }

      currentPlayer.cash -= cost;
      currentPlayer.sharesCount[p.hotelId] += p.quantity;
      updatedHotelSharesCount[p.hotelId] -= p.quantity;
    });

    updatedPlayers[currentTurn] = currentPlayer;
    setPlayers(updatedPlayers);

    setHotelsInfo((prevHotelsInfo) => ({
      ...prevHotelsInfo,
      hotelSharesCount: updatedHotelSharesCount,
    }));

    // Update current player's assets
    setCurrentPlayerAssets({
      cash: currentPlayer.cash,
      sharesCount: currentPlayer.sharesCount,
      tiles: currentPlayer.tiles,
    });

    console.log('Final player state:', currentPlayer);
    setIsBuyStocksVisible(false);

    // Update the button state to "passTurn" after buying stocks
    setButtonState('passTurn');
  };

  const handlePassTurn = () => {
    // Proceed to next player's turn
    setCurrentTurn((prevTurn) => (prevTurn + 1) % players.length);

    // Reset the button state to "placeTile" for the next player's turn
    setButtonState('placeTile');
  };

  const getChainSize = (hotelId: number): number => {
    let size = 0;
    for (let row = 0; row < boardState.length; row++) {
      for (let col = 0; col < boardState[row].length; col++) {
        if (boardState[row][col] === hotelId) {
          size++;
        }
      }
    }
    return size;
  };

  const renderPlayerStocks = () => {
    console.log('Rendering stocks with:', currentPlayerAssets.sharesCount);
    
    const playerStocks = currentPlayerAssets.sharesCount
      .map((count, index) => ({
        hotel: hotelChains[index].name,
        count,
        color: hotelChains[index].color
      }))
      .filter(stock => stock.count > 0);

    console.log('Filtered player stocks:', playerStocks);

    if (playerStocks.length === 0) {
      return <Text style={styles.noStocks}>No Stocks Owned</Text>;
    }

    return (
      <View style={styles.stocksContainer}>
        <Text style={styles.playerStocksTitle}>Stocks:</Text>
        {playerStocks.map((stock, index) => (
          <View key={index} style={[styles.stockItem, { borderLeftColor: stock.color }]}>
            <Text style={styles.playerStock}>
              {stock.hotel}: {stock.count}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {notification && notification.visible && (
      <GameNotification
        message={notification.message}
        type={notification.type}
        onHide={() => setNotification(null)}
      />
    )}
    <ScrollView style={styles.container}>
      
       <Text style={styles.title}>Current Turn: {players[currentTurn].name}</Text>
      <View style={styles.board}>
        {boardState.map((rowData, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: 'row' }}>
            {rowData.map((cell, colIndex) => (
              <TouchableOpacity
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  margin: cellMargin,
                  backgroundColor:
                    colors.hotelColors[cell.toString() as keyof typeof colors.hotelColors],
                  borderWidth: 1,
                  borderColor: colors.tileBorder,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 4,
                }}
                disabled // Disable touch as moves are predefined
              >
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>
                  {String.fromCharCode(65 + rowIndex)}
                  {colIndex + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <Text style={styles.subtitle}>Available Hotel Chains:</Text>
      <FlatList
        data={hotelChains}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={[styles.hotelChainCard, { backgroundColor: item.color }]}>
            <Text style={styles.hotelChainName}>{item.name}</Text>
            <Text style={styles.hotelChainStocks}>
              Available Stocks: {hotelsInfo.hotelSharesCount[index]}
            </Text>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hotelChainsList}
      />

      <Text style={styles.subtitle}>Current Player Assets</Text>
      <View style={styles.playerCard}>
        <View style={styles.playerCard}>
        <Text style={styles.playerName}>{players[currentTurn].name}</Text>
        <Text style={styles.playerCash}>Cash: ${currentPlayerAssets.cash.toFixed(2)}</Text>
        {renderPlayerStocks()}
      </View>

      </View>

      {buttonState === 'placeTile' && (
        <TouchableOpacity style={styles.placeTileButton} onPress={handlePlaceTile}>
          <Text style={styles.placeTileText}>Place Tile</Text>
        </TouchableOpacity>
      )}
      {buttonState === 'buyStocks' && (
        <TouchableOpacity style={styles.buyStocksButton} onPress={handleBuyStocks}>
          <Text style={styles.buyStocksText}>Buy Stocks</Text>
        </TouchableOpacity>
      )}
      {buttonState === 'passTurn' && (
        <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.passTurnButton} onPress={handlePassTurn}>
          <Text style={styles.passTurnText}>Pass Turn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.finishGameButton} onPress={handleFinishGame}>
          <Text style={styles.finishGameText}>Finish Game</Text>
        </TouchableOpacity>
      </View>
      )}

      <BuyStocks
        visible={isBuyStocksVisible}
        onClose={() => {
          setIsBuyStocksVisible(false);
          // After closing the modal, proceed to pass the turn
          setButtonState('passTurn');
        }}
        onConfirm={handleConfirmStockPurchase}
        hotelChains={hotelChains}
        hotelsInfo={hotelsInfo}
        playerCash={currentPlayerAssets.cash}
        boardState={boardState}
      />
    </ScrollView>
    </View>
  );
};

export default PlayerTurnManager;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 10,
    // backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10,
  },
  board: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 10,
    color: colors.text,
  },
  hotelChainCard: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
    width: 120,
  },
  hotelChainName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  hotelChainStocks: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  hotelChainsList: {
    paddingVertical: 10,
  },
  playerCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerCash: {
    fontSize: 16,
  },
  playerStocks: {
    fontSize: 16,
  },
  placeTileButton: {
    backgroundColor: colors.accent,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  placeTileText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buyStocksButton: {
    backgroundColor: colors.accent,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buyStocksText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  passTurnButton: {
    backgroundColor: colors.accent,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1, // Make buttons equal width
    marginRight: 10, // Add space between buttons
  },
  passTurnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerStocksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  stocksContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.textSecondary,
    paddingTop: 8,
  },
  stockItem: {
    borderLeftWidth: 6,
    paddingLeft: 12,
    paddingVertical: 8,
    marginVertical: 4,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerStock: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  noStocks: {
    fontSize: 16,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20, // Add bottom margin for better spacing
    paddingHorizontal: 10, // Add horizontal padding
  },
  finishGameButton: {
    backgroundColor: '#DC3545', // Use a more subtle red
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1, // Make buttons equal width
    marginLeft: 10, // Add space between buttons
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Add elevation for Android
  },
  finishGameText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


