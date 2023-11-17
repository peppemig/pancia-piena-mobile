import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import Button from "../ui/Button";
import { OrderItem } from "../../types/types";
import { AntDesign } from "@expo/vector-icons";
import { Socket } from "socket.io-client";
import Separator from "../Separator";
import ordersService from "../../api/ordersService";
import { useAuthState } from "../../providers/AuthProvider";
import errorAlert from "../errorAlert";

type SendOrderModalProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  resetFilteredProducts: () => void;
  resetOrderItems: () => void;
  orderItems: OrderItem[];
  socket: Socket;
};

const SendOrderModal = ({
  isVisible,
  setIsVisible,
  setIsLoading,
  orderItems,
  socket,
  resetFilteredProducts,
  resetOrderItems,
}: SendOrderModalProps) => {
  const { user } = useAuthState();
  const [tableNumber, setTableNumber] = useState("");
  const [error, setError] = useState(false);

  const createOrder = () => {
    setError(false);
    if (tableNumber === "") {
      setError(true);
      return;
    }
    const tableNumberInt = parseInt(tableNumber);
    setIsLoading(true);
    user!
      .getIdToken()
      .then((token) => {
        ordersService
          .createOrder(token, { tableNumber: tableNumberInt, orderItems })
          .then(() => {
            setIsVisible(false);
            socket?.emit("order-created");
            setTableNumber("");
            resetFilteredProducts();
            resetOrderItems();
            setIsLoading(false);
          })
          .catch(() => {
            setIsVisible(false);
            setIsLoading(false);
            errorAlert("Prova ad effettuare nuovamente la richiesta");
          });
      })
      .catch(() => {
        setIsVisible(false);
        setIsLoading(false);
        errorAlert("Prova ad effettuare nuovamente la richiesta");
      });
  };

  return (
    <Modal animationType="slide" visible={isVisible}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            Riepilogo ordine
          </Text>
          <Pressable onPress={() => setIsVisible(false)}>
            <AntDesign name="closecircleo" size={24} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ gap: 10 }}>
          {orderItems.map((item) => (
            <View
              key={item.productId}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {item.productName}
                </Text>
                <Text
                  style={{ fontSize: 16, fontWeight: "400", color: "#979ba0" }}
                >
                  Quantità: {item.quantity}
                </Text>
              </View>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                €{item.quantity * item.productPrice}
              </Text>
            </View>
          ))}
        </ScrollView>
        <Separator margin={1} />
        <View style={{ gap: 6 }}>
          <View style={styles.inputContainer}>
            <TextInput
              value={tableNumber}
              onChangeText={(text) => setTableNumber(text)}
              keyboardType="numeric"
              style={{ flex: 1, padding: 10 }}
              placeholder="Numero tavolo"
            />
          </View>
          {error && (
            <Text style={{ color: "#EF4444" }}>
              Inserisci il numero del tavolo
            </Text>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Totale:</Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              €
              {orderItems.reduce(
                (total, item) => total + item.quantity * item.productPrice,
                0
              )}
            </Text>
          </View>
          <Button
            label="Invia ordine"
            variant="primary"
            onPress={createOrder}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    padding: 20,
    gap: 10,
    backgroundColor: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    borderColor: "#E2E8F0",
    borderWidth: 1,
    paddingHorizontal: 14,
  },
});

export default SendOrderModal;
