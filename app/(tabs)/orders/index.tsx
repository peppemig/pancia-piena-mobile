import { View, Text, StyleSheet, ScrollView } from "react-native";
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
import OrderCard from "../../components/orders/OrderCard";
import errorAlert from "../../components/errorAlert";
import { Ionicons } from "@expo/vector-icons";

type OrderFilter = "in-corso" | "completati";

const Orders = () => {
  const { user } = useAuthState();
  const [ordersData, setOrdersData] = useState<{
    orders: Order[];
    totalPages?: number;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [ordersFilter, setOrdersFilter] = useState<OrderFilter>("in-corso");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [page, setPage] = useState(1);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      getOrders();
      return () => {
        isActive = false;
        setOrdersData(undefined);
        setOrdersFilter("in-corso");
      };
    }, [user])
  );

  useEffect(() => {
    getOrders();
  }, [user, ordersFilter, page]);

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
            : ordersService.getCompletedOrdersPaginated(token, page);

        fetchOrders
          .then((res) => {
            setOrdersData(res.data.ordersData);
          })
          .catch(() => {
            errorAlert("Prova ad effettuare nuovamente la richiesta");
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch(() => {
        setIsLoading(false);
        errorAlert("Prova ad effettuare nuovamente la richiesta");
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
      {ordersData && ordersData.orders.length > 0 ? (
        <>
          {ordersFilter === "completati" && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Ionicons
                disabled={page === 1}
                onPress={() => {
                  if (page === 1) return;
                  setPage((prev) => prev - 1);
                }}
                name="chevron-back-circle-outline"
                size={30}
                color={page === 1 ? "gray" : "black"}
              />
              <Text style={{ fontWeight: "500", fontSize: 16 }}>
                Pagina {page} di {ordersData.totalPages}
              </Text>
              <Ionicons
                disabled={page === ordersData.totalPages}
                onPress={() => {
                  if (page === ordersData.totalPages) return;
                  setPage((prev) => prev + 1);
                }}
                name="chevron-forward-circle-outline"
                size={30}
                color={page === ordersData.totalPages ? "gray" : "black"}
              />
            </View>
          )}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, gap: 6 }}
          >
            {ordersData.orders.map((order) => (
              <OrderCard
                setIsLoading={setIsLoading}
                key={order.id}
                order={order}
                filter={ordersFilter}
                refreshOrders={getOrders}
              />
            ))}
          </ScrollView>
        </>
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
