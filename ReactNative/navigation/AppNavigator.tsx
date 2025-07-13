import React from "react";
import { DrawerActions, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView,DrawerItem } from '@react-navigation/drawer';

import { PreferencesProvider } from '../context/PreferencesContext';

import Landing from "../screens/Landing";
import PlayerConfig from "../screens/PlayerConfig";
import BoardSetup from "../screens/Boardsetup";
import PlayerTurnManager from "../screens/PlayerTurnManager";
import Winner from "../screens/Winner";
import { PlayerData } from "../types";
import Preferences from '../screens/Preferences';
import { Alert, BackHandler, Text, TouchableOpacity } from "react-native";

export type RootStackParamList={
    Landing: undefined;
    PlayerConfig: undefined;
    BoardSetup:{players:PlayerData[]};
    PlayerTurnManager: { players: PlayerData[]; initialBoard: number[][]; cellSize: number; cellMargin: number };
    Winner: { players: PlayerData[] };
}

const Stack=createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

// const AppNavigator: React.FC=()=>(
//     <NavigationContainer>
//         <Stack.Navigator initialRouteName="Landing">
//             <Stack.Screen name="Landing"
//             component={Landing}
//             options={{headerShown:false}}/>
//             <Stack.Screen name="PlayerConfig"
//             component={PlayerConfig}
//             options={{title:'Players'}}/>
//             <Stack.Screen
//             name="BoardSetup"
//             component={BoardSetup}
//             options={{ title: 'Game Board' }}/>
//             <Stack.Screen name="PlayerTurnManager"
//             component={PlayerTurnManager}
//             options={{title:'Player Turn'}}/>
//         </Stack.Navigator>
//     </NavigationContainer>
// )

const MainStackNavigator: React.FC = () => (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
      <Stack.Screen
      name="PlayerConfig"
      component={PlayerConfig}
      options={({ navigation }) => ({
        title: 'Players',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={{ marginLeft: 15 }}
          >
            <Text style={{ fontSize: 18, color: '#007AFF' }}>☰</Text>
          </TouchableOpacity>
        ),
      })}
    />
      <Stack.Screen
      name="BoardSetup"
      component={BoardSetup}
      options={({ navigation }) => ({
        title: 'Game Board',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={{ marginLeft: 15 }}
          >
            <Text style={{ fontSize: 18, color: '#007AFF' }}>☰</Text>
          </TouchableOpacity>
        ),
      })}
    />

      <Stack.Screen 
      name="PlayerTurnManager" 
      component={PlayerTurnManager} 
      options={({ navigation }) => ({
        title: 'Player Turn',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={{ marginLeft: 15 }}
          >
            <Text style={{ fontSize: 18, color: '#007AFF' }}>☰</Text>
          </TouchableOpacity>
        ),
      })} />

        <Stack.Screen 
                name="Winner" 
                component={Winner} 
                options={{ 
                title: 'Game Over',
                headerLeft: () => null, 
                gestureEnabled: false, 
                headerBackTitle: ' ', 
                }} 
            />
    </Stack.Navigator>
  );
  // Custom Drawer Content
const CustomDrawerContent: React.FC<DrawerContentComponentProps>  = ({ navigation }) => (
    <DrawerContentScrollView>
      <DrawerItem label="Preferences" onPress={() => navigation.navigate('Preferences')} />
      <DrawerItem
        label="Quit Game"
        onPress={() =>
          Alert.alert(
            'Quit Game',
            'Are you sure you want to quit?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Quit', onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: true }
          )
        }
      />
    </DrawerContentScrollView>
  );
  
  
  const AppNavigator: React.FC = () => (
    <PreferencesProvider>
      <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={MainStackNavigator} options={{ headerShown: false }} />
        <Drawer.Screen name="Preferences" component={Preferences} options={{ title: 'Preferences' }} />
      </Drawer.Navigator>
      </NavigationContainer>
    </PreferencesProvider>
  );

export default AppNavigator;
