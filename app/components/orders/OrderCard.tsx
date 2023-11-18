import { View, Text, Pressable, Alert, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Order } from "../../types/types";
import { useAuthState } from "../../providers/AuthProvider";
import ordersService from "../../api/ordersService";
import Button from "../ui/Button";
import errorAlert from "../errorAlert";

type OrderCardProps = {
  order: Order;
  filter: "in-corso" | "completati";
  refreshOrders: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const OrderCard = ({
  order,
  filter,
  refreshOrders,
  setIsLoading,
}: OrderCardProps) => {
  const { user } = useAuthState();

  const deleteOrder = () => {
    setIsLoading(true);
    user!
      .getIdToken()
      .then((token) => {
        ordersService
          .deleteOrder(token, order.id)
          .then(() => refreshOrders())
          .catch(() => {
            setIsLoading(false);
            errorAlert("Prova ad effettuare nuovamente la richiesta");
          });
      })
      .catch(() => {
        setIsLoading(false);
        errorAlert("Prova ad effettuare nuovamente la richiesta");
      });
  };

  const onDelete = () => {
    Alert.alert(
      "Elimina ordine",
      "Sei sicuro di voler eliminare questo ordine?",
      [
        {
          text: "Si",
          style: "default",
          onPress: () => deleteOrder(),
        },
        {
          text: "Chiudi",
          style: "cancel",
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  const onComplete = () => {
    setIsLoading(true);
    user!
      .getIdToken()
      .then((token) => {
        ordersService
          .setOrderToCompleted(token, order.id)
          .then(() => refreshOrders())
          .catch(() => {
            setIsLoading(false);
            errorAlert("Prova ad effettuare nuovamente la richiesta");
          });
      })
      .catch(() => {
        setIsLoading(false);
        errorAlert("Prova ad effettuare nuovamente la richiesta");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>
        Tavolo: {order.tableNumber}
      </Text>
      <View>
        {order.orderItems?.map((item) => (
          <Text
            key={item.productId}
            style={{ fontWeight: "500", fontSize: 16 }}
          >
            {item.quantity} x {item.product.name}
          </Text>
        ))}
      </View>
      {filter === "completati" && (
        <Button label="Elimina ordine" onPress={onDelete} />
      )}
      {filter === "in-corso" && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable onPress={onDelete}>
            <AntDesign name="closecircleo" size={30} color="black" />
          </Pressable>
          <Pressable onPress={onComplete}>
            <AntDesign name="checkcircleo" size={30} color="black" />
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
  },
});

export default OrderCard;
