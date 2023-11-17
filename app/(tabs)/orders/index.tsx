import { View, Text, StyleSheet, Pressable } from "react-native";
import { useAuthState } from "../../providers/AuthProvider";
import { useState, useEffect } from "react";
import { Order } from "../../types/types";
import { io, Socket } from "socket.io-client";
import LoadingState from "../../components/LoadingState";
import FilterOrderButton from "../../components/orders/FilterOrderButton";
import ordersService from "../../api/ordersService";
import { useFocusEffect } from "expo-router";
import React from "react";
import { ORIGIN_URL } from "../../constants/constants";

type OrderFilter = "in-corso" | "completati";

const Orders = () => {
  const { user } = useAuthState();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ordersFilter, setOrdersFilter] = useState<OrderFilter>("in-corso");
  const [socket, setSocket] = useState<Socket | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      getOrders();
      return () => {
        isActive = false;
        setOrders([]);
        setOrdersFilter("in-corso");
      };
    }, [user])
  );

  useEffect(() => {
    getOrders();
  }, [user, ordersFilter]);

  useEffect(() => {
    socket?.on("order-received", () => {
      getOrders();
    });
  }, [socket]);

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

  const getOrders = () => {
    setIsLoading(true);
    user!
      .getIdToken()
      .then((token) => {
        const fetchOrders =
          ordersFilter === "in-corso"
            ? ordersService.getOrders(token)
            : ordersService.getCompletedOrders(token);

        fetchOrders
          .then((res) => {
            setOrders(res.data.orders);
          })
          .catch(() => {})
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", gap: 6 }}>
        <FilterOrderButton
          label="In corso"
          filter="in-corso"
          ordersFilter={ordersFilter}
          setOrdersFilter={setOrdersFilter}
        />
        <FilterOrderButton
          label="Completati"
          filter="completati"
          ordersFilter={ordersFilter}
          setOrdersFilter={setOrdersFilter}
        />
      </View>
      {orders.length > 0 ? (
        <View>
          <Text>Qui ci saranno i tuoi ordini</Text>
        </View>
      ) : (
        <Text>Non hai ancora nessun ordine 😐</Text>
      )}
    </View>
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

export default Orders;
