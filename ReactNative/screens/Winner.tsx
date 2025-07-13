import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, ActivityIndicator, Alert } from 'react-native';
import { PlayerData } from '../types';
import { getStockPrice } from '../utils'; 
import { RootStackParamList } from '../navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type WinnerScreenRouteProp = RouteProp<RootStackParamList, 'Winner'>;
type WinnerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Winner'>;

type Props = {
  route: WinnerScreenRouteProp;
  navigation: WinnerScreenNavigationProp;
};

const Winner: React.FC<Props> = ({ route, navigation }) => {
  const { players } = route.params; // All players data passed from previous screen
  const [winner, setWinner] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch winner index from API
  useEffect(() => {
    const fetchWinner = async () => {
      try {
        const response = await fetch('https://acquiregame.onrender.com/declareWinner');
        if (!response.ok) {
          throw new Error('Failed to fetch the winner');
        }

        const playerIndex = await response.json(); // Expecting only a number in the response
        const winnerPlayer = players[playerIndex]; // Get player details using playerIndex

        if (!winnerPlayer) {
          throw new Error('Winner not found in players array');
        }

        setWinner(winnerPlayer);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching winner:', error);
        Alert.alert('Error', 'An error occurred while fetching the winner.');
        setLoading(false);
      }
    };

    fetchWinner();
  }, [players]);

  // Start a new game
  const handleNewGame = () => {
    navigation.navigate('PlayerConfig');
  };

  // Exit the app
  const handleExit = () => {
    BackHandler.exitApp();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Fetching Winner...</Text>
      </View>
    );
  }

  if (!winner) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Could not determine the winner.</Text>
        <TouchableOpacity style={styles.newGameButton} onPress={handleNewGame}>
          <Text style={styles.newGameText}>New Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.exitText}>Exit</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate total assets for the winner
  const totalStockValue = winner.sharesCount.reduce((total, count, hotelId) => {
    const chainSize = 10; // Replace with the actual chain size for each hotel if available
    const stockPrice = getStockPrice(hotelId, chainSize);
    return total + stockPrice * count;
  }, 0);

  const totalAssets = winner.cash + totalStockValue;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Winner</Text>
      <Text style={styles.winnerName}>{winner.name}</Text>
      <Text style={styles.winnerAssets}>
        Total Assets: ${totalAssets.toFixed(2)}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.newGameButton} onPress={handleNewGame}>
          <Text style={styles.newGameText}>New Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.exitText}>Exit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Winner;

// Styles for Winner screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  winnerName: {
    fontSize: 24,
    color: '#2E8B57', // Green for winner's name
    fontWeight: 'bold',
    marginBottom: 10,
  },
  winnerAssets: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  newGameButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginRight: 10,
  },
  newGameText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exitButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  exitText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: '#555',
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
    marginBottom: 20,
  },
});
