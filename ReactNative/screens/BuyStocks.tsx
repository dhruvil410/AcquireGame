import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Alert } from 'react-native';
import { HotelChain } from '../types';
import { getStockPrice } from '../utils';
import { colors } from '../colors';

type BuyStocksProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (purchases: { hotelId: number; quantity: number }[]) => void;
  hotelChains: HotelChain[];
  hotelsInfo: { hotelAvailable: boolean[]; hotelSharesCount: number[] };
  playerCash: number;
  boardState: number[][];
};

const BuyStocks: React.FC<BuyStocksProps> = ({
  visible,
  onClose,
  onConfirm,
  hotelChains,
  hotelsInfo,
  playerCash,
  boardState,
}) => {
  const [purchases, setPurchases] = useState<{ hotelId: number; quantity: number }[]>([]);
  const [totalStocksToBuy, setTotalStocksToBuy] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

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

  const handleQuantityChange = (hotelId: number, quantity: number) => {
    if (quantity < 0) quantity = 0;
    const updatedPurchases = [...purchases];
    const index = updatedPurchases.findIndex((p) => p.hotelId === hotelId);
    if (index >= 0) {
      updatedPurchases[index].quantity = quantity;
    } else {
      updatedPurchases.push({ hotelId, quantity });
    }
    setPurchases(updatedPurchases);

    // Recalculate total stocks and cost
    let totalStocks = 0;
    let cost = 0;
    updatedPurchases.forEach((p) => {
      totalStocks += p.quantity;
      const chainSize = getChainSize(p.hotelId);
      const price = getStockPrice(p.hotelId, chainSize);
      cost += price * p.quantity;
    });
    setTotalStocksToBuy(totalStocks);
    setTotalCost(cost);
  };

  const handleConfirm = () => {
    if (totalStocksToBuy > 3) {
      Alert.alert('Error', 'You can buy up to 3 stocks.');
      return;
    }
    if (totalCost > playerCash) {
      Alert.alert('Error', 'You do not have enough cash to make this purchase.');
      return;
    }
    onConfirm(purchases);
    setPurchases([]);
    setTotalStocksToBuy(0);
    setTotalCost(0);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Buy Stocks</Text>
        <FlatList
          data={hotelChains}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            // Only show active hotel chains
            if (hotelsInfo.hotelAvailable[item.id]) {
              const chainSize = getChainSize(item.id);
              if (chainSize > 0 && hotelsInfo.hotelSharesCount[item.id] > 0) {
                const price = getStockPrice(item.id, chainSize);
                const purchase = purchases.find((p) => p.hotelId === item.id);
                const quantity = purchase ? purchase.quantity : 0;
                return (
                  <View style={styles.hotelChainCard}>
                    <Text style={styles.hotelChainName}>{item.name}</Text>
                    <Text style={styles.hotelChainPrice}>Price: ${price}</Text>
                    <Text style={styles.hotelChainStocks}>Available: {hotelsInfo.hotelSharesCount[item.id]}</Text>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        onPress={() => handleQuantityChange(item.id, Math.max(0, quantity - 1))}
                      >
                        <Text style={styles.quantityButton}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{quantity}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          handleQuantityChange(
                            item.id,
                            Math.min(quantity + 1, hotelsInfo.hotelSharesCount[item.id])
                          )
                        }
                      >
                        <Text style={styles.quantityButton}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }
            }
            return null;
          }}
        />
        <Text style={styles.totalText}>Total Stocks: {totalStocksToBuy} / 3</Text>
        <Text style={styles.totalText}>Total Cost: ${totalCost}</Text>
        <Text style={styles.totalText}>Your Cash: ${playerCash}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirm Purchase</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BuyStocks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  hotelChainCard: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: colors.tileOccupied,
  },
  hotelChainName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  hotelChainPrice: {
    fontSize: 16,
    color: colors.text,
  },
  hotelChainStocks: {
    fontSize: 16,
    color: colors.text,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    fontSize: 24,
    color: colors.accent,
    paddingHorizontal: 10,
  },
  quantityText: {
    fontSize: 18,
    color: colors.text,
    marginHorizontal: 10,
  },
  totalText: {
    fontSize: 18,
    color: colors.text,
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10, // Add padding to bring buttons inwards
  },
  confirmButton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#B0BEC5',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
