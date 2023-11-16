import { View, Text, Alert, StyleSheet, ScrollView } from "react-native";
import productsService from "../../api/productsService";
import { useState } from "react";
import { OrderItem, Product } from "../../types/types";
import { useAuthState } from "../../providers/AuthProvider";
import { useFocusEffect } from "expo-router";
import React from "react";
import LoadingState from "../../components/LoadingState";
import { ORIGIN_URL, categories } from "../../constants/constants";
import FilterButton from "../../components/products/FilterButton";
import OrderItemRow from "../../components/createOrder/OrderItemRow";
import Separator from "../../components/Separator";
import Button from "../../components/ui/Button";
import SendOrderModal from "../../components/createOrder/SendOrderModal";
import { io, Socket } from "socket.io-client";

const CreateOrder = () => {
  const { user } = useAuthState();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string>("TUTTI");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      getProducts();
      return () => {
        isActive = false;
        setProducts([]);
        setFilteredProducts([]);
        setCurrentFilter("TUTTI");
        setOrderItems([]);
      };
    }, [user])
  );

  useFocusEffect(
    React.useCallback(() => {
      let socket: Socket;

      const connectToSocket = async () => {
        const token = await user!.getIdToken();
        socket = io(ORIGIN_URL!, {
          autoConnect: false,
          query: { token: token },
        });

        socket.connect();
        setSocket(socket);
      };

      connectToSocket();

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }, [user])
  );

  const getProducts = () => {
    setIsLoading(true);
    user!
      .getIdToken()
      .then((token) => {
        productsService
          .getProducts(token)
          .then((res) => {
            setProducts(res.data.products);
            setFilteredProducts(res.data.products);
            setIsLoading(false);
          })
          .catch((e) => {
            setIsLoading(false);
            Alert.alert(
              "Ooops! C'è stato un problema",
              e.message,
              [
                {
                  text: "Chiudi",
                  style: "cancel",
                },
              ],
              {
                cancelable: true,
              }
            );
          });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const filterProducts = (value: string) => {
    if (value === "TUTTI") {
      setFilteredProducts(products);
      setCurrentFilter(value);
      return;
    }
    const filter = products.filter((product) => product.category === value);
    setFilteredProducts(filter);
    setCurrentFilter(value);
  };

  const addQuantity = (product: Product) => {
    const itemIndex = orderItems.findIndex(
      (item) => item.productId === product.id
    );
    if (itemIndex !== -1) {
      const updatedOrderItems = [...orderItems];
      updatedOrderItems[itemIndex].quantity += 1;
      setOrderItems(updatedOrderItems);
    } else {
      setOrderItems((prev) => [
        ...prev,
        {
          productId: product.id,
          quantity: 1,
          productName: product.name,
          productPrice: product.price,
        },
      ]);
    }
  };

  const removeQuantity = (product: Product) => {
    const updatedOrderItems = [...orderItems];
    const itemIndex = updatedOrderItems.findIndex(
      (item) => item.productId === product.id
    );
    if (itemIndex !== -1) {
      if (updatedOrderItems[itemIndex].quantity === 1) {
        updatedOrderItems.splice(itemIndex, 1);
      } else {
        updatedOrderItems[itemIndex].quantity -= 1;
      }
      setOrderItems(updatedOrderItems);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          horizontal
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ flexGrow: 0, gap: 6 }}
        >
          {Object.keys(categories).map((cat) => (
            <FilterButton
              key={cat}
              label={categories[cat]}
              value={cat}
              currentFilter={currentFilter}
              onClick={filterProducts}
            />
          ))}
        </ScrollView>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, gap: 16 }}
        >
          {filteredProducts.length > 0 ? (
            <>
              {Object.keys(categories).map(
                (cat) =>
                  filteredProducts.some((prod) => prod.category === cat) && (
                    <View
                      key={cat}
                      style={{
                        borderWidth: 1,
                        borderColor: "#E2E8F0",
                        padding: 10,
                        borderRadius: 10,
                        backgroundColor: "white",
                      }}
                    >
                      <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                        {categories[cat].toUpperCase()}
                      </Text>
                      {filteredProducts
                        .filter((prod) => prod.category === cat)
                        .map((fprod, index, arr) => (
                          <View key={fprod.id}>
                            <OrderItemRow
                              product={fprod}
                              orderItems={orderItems}
                              addQty={addQuantity}
                              removeQty={removeQuantity}
                            />
                            {index !== arr.length - 1 && (
                              <Separator margin={6} />
                            )}
                          </View>
                        ))}
                    </View>
                  )
              )}
            </>
          ) : (
            <Text>Non hai ancora aggiunto nessun prodotto 😐</Text>
          )}
        </ScrollView>
        {orderItems.length > 0 && (
          <Button
            onPress={() => setIsVisible(true)}
            label="Riepilogo ordine"
            variant="primary"
            icon="arrow-forward"
            iconPosition="right"
            iconSize={20}
          />
        )}
      </View>
      <SendOrderModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        setIsLoading={setIsLoading}
        orderItems={orderItems}
        resetFilteredProducts={() => setFilteredProducts(products)}
        resetOrderItems={() => setOrderItems([])}
        socket={socket!}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    gap: 10,
    backgroundColor: "white",
  },
});

export default CreateOrder;
