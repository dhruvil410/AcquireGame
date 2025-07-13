import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, useWindowDimensions, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../colors';
import { HotelChain } from '../types';

type BoardNavigationProp = StackNavigationProp<RootStackParamList, 'BoardSetup'>;

type Props = {
    navigation: BoardNavigationProp,
    route: RouteProp<RootStackParamList, 'BoardSetup'>;
};

const BoardSetup: React.FC<Props> = ({ navigation, route }) => {
    const numRows = 9;
    const numCols = 12;

    const windowDimensions = useWindowDimensions();
    const cellMargin = 2;
    const boardWidth = windowDimensions.width - 20;
    const cellSize = (boardWidth - cellMargin * 2 * numCols) / numCols;

    const hotelChains: HotelChain[] = [
        { id: 1, name: 'Luxor', color: '#FFD700' },
        { id: 2, name: 'Tower', color: '#800080' },
        { id: 3, name: 'American', color: '#FF0000' },
        { id: 4, name: 'Festival', color: '#008000' },
        { id: 5, name: 'Imperial', color: '#0000FF' },
        { id: 6, name: 'Worldwide', color: '#FFA500' },
        { id: 7, name: 'Continental', color: '#A52A2A' }
    ];

    const { players } = route.params;
    const boardData = Array.from({ length: numRows }, () =>
        Array.from({ length: numCols }, () => -2)
    );

    const renderHotelChains = () => (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hotelChainsContainer}
        >
            {hotelChains.map(chain => (
                <View key={chain.id} style={[styles.hotelChainCard, { backgroundColor: chain.color }]}>
                    <Text style={styles.hotelChainName}>{chain.name}</Text>
                </View>
            ))}
        </ScrollView>
    );

    const renderPlayers = () => (
        <View style={styles.playersContainer}>
            {players.map(player => (
                <View key={player.id} style={styles.playerCard}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <Text style={styles.playerCash}>Cash: ${player.cash}</Text>
                </View>
            ))}
        </View>
    );

    return (
        <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.title}>Acquire</Text>
            
            <View style={styles.board}>
                {boardData.map((rowData, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {rowData.map((cell, colIndex) => (
                            <TouchableOpacity
                                key={`${rowIndex}-${colIndex}`}
                                style={[styles.cell, { width: cellSize, height: cellSize, margin: cellMargin }]}
                                onPress={() => Alert.alert(`Cell Pressed: ${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`)}
                            >
                                <Text style={styles.cellText}>
                                    {String.fromCharCode(65 + rowIndex)}{colIndex + 1}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>

            <Text style={styles.subtitle}>Available Hotel Chains:</Text>
            {renderHotelChains()}

            <Text style={styles.subtitle}>Player Assets:</Text>
            {renderPlayers()}

            <TouchableOpacity
                style={styles.startGameButton}
                onPress={() => navigation.navigate('PlayerTurnManager', {
                    players,
                    initialBoard: boardData,
                    cellSize,
                    cellMargin,
                })}
            >
                <Text style={styles.buttonText}>Start Game</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentContainer: {
        padding: 10,
        paddingBottom: 30, // Add extra padding at the bottom for better scrolling
    },
    title: {
        fontSize: 28,
        marginBottom: 10,
        textAlign: 'center',
        color: colors.text,
    },
    board: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        borderWidth: 1,
        borderColor: colors.tileBorder,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cellText: {
        color: colors.text,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 22,
        marginTop: 20,
        marginBottom: 10,
        color: colors.text,
    },
    hotelChainsContainer: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    hotelChainCard: {
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: 'center',
        width: 120,
    },
    hotelChainName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    playersContainer: {
        padding: 10,
    },
    playerCard: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#777',
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
    },
    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    playerCash: {
        fontSize: 16,
    },
    startGameButton: {
        backgroundColor: colors.accent,
        padding: 15,
        marginTop: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default BoardSetup;