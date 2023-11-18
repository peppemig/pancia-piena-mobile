import { View, Text } from "react-native";

type RecentOrderRowProps = {
  tableNumber: number;
  totalPrice: string;
};

const RecentOrderRow = ({ tableNumber, totalPrice }: RecentOrderRowProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <View
          style={{
            backgroundColor: "#F1F5F9",
            padding: 6,
            borderRadius: 50,
            height: 40,
            width: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>{tableNumber}</Text>
        </View>
        <Text style={{ fontWeight: "500", fontSize: 16 }}>
          Tavolo: {tableNumber}
        </Text>
      </View>
      <Text style={{ fontWeight: "500", fontSize: 16 }}>€{totalPrice}</Text>
    </View>
  );
};

export default RecentOrderRow;
