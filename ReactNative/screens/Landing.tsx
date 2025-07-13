import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import React, { useEffect } from "react";
import { Animated,View, Text, StyleSheet, TouchableOpacity,ImageBackground } from "react-native";

type LandingScreenNavigationProp = StackNavigationProp<RootStackParamList,'Landing'>;

type Props={
    navigation: LandingScreenNavigationProp;
};

const baseUrl = "https://acquiregame.onrender.com";

const wakeUpBackend = async (baseUrl: string) => {
  try {
    console.log(`Pinging backend at ${baseUrl}...`);
    const response = await fetch(baseUrl);
    if (response.ok) {
      console.log("Backend is awake and ready.");
    } else {
      console.warn("Backend responded but not OK:", response.status);
    }
  } catch (error) {
    console.error("Error waking up the backend:", error);
  }
};


const Landing:React.FC<Props>=({navigation})=>{
  useEffect(() => {
    // Wake up the backend when the Landing screen loads
    wakeUpBackend(baseUrl);
  }, []);

    return(
        <ImageBackground
      source={require('../assests/background.png')}
      style={styles.background}
    >
        <View style={styles.overlay}>
            <Text style={styles.title}>Acquire Game</Text>
            <Text style={styles.tagline}>Build your Empire and outsmart your opponents</Text>
        
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PlayerConfig')}
      >
        <Text style={styles.buttonText}>Let's Begin</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
    )
}
export default Landing;

const styles = StyleSheet.create({
    background: {
      flex: 1,
      resizeMode: 'cover',
      
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)', 
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#FFFFFF', 
      textAlign: 'center',
    },
    tagline: {
      fontSize: 18,
      marginBottom: 40,
      color: '#DDDDDD', 
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#FFC107', 
      paddingVertical: 15,
      paddingHorizontal: 60,
      borderRadius: 8,
    },
    buttonText: {
      color: '#000000', 
      fontSize: 18,
      fontWeight: 'bold',
    },
});