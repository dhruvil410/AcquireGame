import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { PlayerData, PlayerMode } from "../types";
import { colors } from "../colors";

import mockData from '../mockData.json';

type PlayerConfigNavigatorProp = StackNavigationProp<RootStackParamList, 'PlayerConfig'>;

type Props = {
  navigation: PlayerConfigNavigatorProp;
};

const initialCash = 6000; // Each player starts with $6,000
const initialStocks = Array(7).fill(0); // Initial stock count for each hotel chain

const PlayerConfig: React.FC<Props> = ({ navigation }) => {
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [players, setPlayers] = useState<PlayerData[]>([]);

  useEffect(() => {
    const initialPlayers = Array.from({ length: numPlayers }, (_, index) => ({
      id: index,
      name: `Player ${index + 1}`,
      mode: PlayerMode.Self, // Enum usage
      cash: initialCash,
      sharesCount: [...initialStocks],
      tiles: [], 
    }));
    setPlayers(initialPlayers);
  }, [numPlayers]);

  // Handle changes to player data
  const handlePlayerChange = (id: number, field: keyof PlayerData, value: any) => {
    if (field === 'mode' && (value === 'self' || value === 'intelligent')) {
      Alert.alert(
        'Under Construction',
        'The selected mode is under construction. Please choose another strategy.',
        [{ text: 'OK' }]
      );
      return;
    }
    const updatedPlayers = players.map(player =>
      player.id === id ? { ...player, [field]: value } : player
    );
    setPlayers(updatedPlayers);
  };

  // Function to proceed to the next screen and send setup data to backend
  // const handleProceed = async () => {
  //   const response = mockData;
  //   // Alert.alert('Setup Response', 'Mock setup data loaded successfully');
  //   navigation.navigate('BoardSetup', { players });
  // };

  const handleProceed = async () => {
    const playerModes = players.map(player => player.mode);
  
    // Log the data being sent to the API
    console.log("Data being sent to the API:", { playerTypes: playerModes });
  
    try {
      const response = await fetch("https://acquiregame.onrender.com/setup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerTypes: playerModes }), 
      });
  
      // Check if the request was successful
      if (!response.ok) {
        throw new Error('Failed to set up the game');
      }
  
      // Log success
      console.log("API call successful. Proceeding to the next screen.");
  
      // Navigate to BoardSetup screen with players after successful setup
      navigation.navigate('BoardSetup', { players });
    } catch (error) {
      console.error('Error during setup:', error);
      Alert.alert('Error', 'An error occurred while setting up the game');
    }
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configure Players</Text>

      <Text style={styles.label}>Select Number of Players:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={numPlayers}
          onValueChange={(itemValue) => setNumPlayers(itemValue)}
          style={styles.picker}
          itemStyle={{ color: colors.text }}
        >
          {[2, 3, 4, 5, 6].map(number => (
            <Picker.Item key={number} label={`${number}`} value={number} />
          ))}
        </Picker>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {players.map(player => (
          <View key={player.id} style={styles.playerCard}>
            <Text style={styles.playerTitle}>Player {player.id + 1}</Text>
            <TextInput
              style={styles.input}
              placeholder={`Enter name for Player ${player.id + 1}`}
              value={player.name}
              onChangeText={text => handlePlayerChange(player.id, 'name', text)}
            />
            <Text style={styles.label}>Select Mode:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={player.mode}
                onValueChange={(itemValue) => handlePlayerChange(player.id, 'mode', itemValue)}
                style={styles.picker}
                itemStyle={{ color: colors.text }}
              >
                <Picker.Item label="Self" value="self" />
                <Picker.Item label="Random Bot" value="random" />
                <Picker.Item label="Smallest-Anti Bot" value="smallest_anti" />
                <Picker.Item label="Largest-Alpha Bot" value="largest_alpha" />
                <Picker.Item label="Intelligent Bot" value="intelligent" />
              </Picker>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleProceed}>
        <Text style={styles.buttonText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    color: colors.text,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: colors.text,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.tileBorder,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: colors.background,
  },
  picker: {
    width: '100%',
    color: colors.text,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  playerCard: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    backgroundColor: colors.background,
  },
  playerTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: colors.text,
  },
  input: {
    borderColor: colors.textSecondary,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default PlayerConfig;
