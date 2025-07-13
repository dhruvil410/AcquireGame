import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Vibration, Platform } from 'react-native';
import { usePreferences } from '../context/PreferencesContext';

interface GameNotificationProps {
  message: string;
  type: 'found' | 'grow' | 'merge';
  onHide: () => void;
}

const GameNotification: React.FC<GameNotificationProps> = ({ message, type, onHide }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const { isVibrationOn } = usePreferences();

  useEffect(() => {
    const showAnimation = Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    });

    const hideAnimation = Animated.timing(translateY, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    });

    // Show the notification
    showAnimation.start();

    // Handle vibration
    if (isVibrationOn) {
      switch (type) {
        case 'found':
          Vibration.vibrate([0, 100, 100, 100]);
          break;
        case 'grow':
          Vibration.vibrate(200);
          break;
        case 'merge':
          Vibration.vibrate([0, 200, 100, 200]);
          break;
      }
    }

    // Hide after delay
    const timer = setTimeout(() => {
      hideAnimation.start(() => {
        onHide();
      });
    }, 2000);

    return () => {
      clearTimeout(timer);
      showAnimation.stop();
      hideAnimation.stop();
      Vibration.cancel();
    };
  }, [type, message, isVibrationOn, onHide, translateY]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'found':
        return '#4CAF50';
      case 'grow':
        return '#2196F3';
      case 'merge':
        return '#FF9800';
      default:
        return '#333333';
    }
  };

  return (
    <View style={styles.notificationWrapper}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }],
            backgroundColor: getBackgroundColor(),
          },
        ]}
      >
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  container: {
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    marginHorizontal: 16,
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameNotification;
