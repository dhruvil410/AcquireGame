import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { usePreferences } from '../context/PreferencesContext';
import { useNavigation } from '@react-navigation/native';

const Preferences: React.FC = () => {
  const { isMusicOn, toggleMusic, isVibrationOn, toggleVibration } = usePreferences();
  const navigation = useNavigation();

  const quitGame = () => {
    Alert.alert(
      'Quit Game',
      'Are you sure you want to quit the game?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Quit', onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Preferences</Text>

      <View style={styles.preferenceContainer}>
        <Text style={styles.label}>Game Music</Text>
        <Switch value={isMusicOn} onValueChange={toggleMusic} />
      </View>

      <View style={styles.preferenceContainer}>
        <Text style={styles.label}>Vibration</Text>
        <Switch value={isVibrationOn} onValueChange={toggleVibration} />
      </View>

      <TouchableOpacity style={styles.quitButton} onPress={quitGame}>
        <Text style={styles.quitButtonText}>Quit Game</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Preferences;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  preferenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
  },
  quitButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 40,
    alignItems: 'center',
  },
  quitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});