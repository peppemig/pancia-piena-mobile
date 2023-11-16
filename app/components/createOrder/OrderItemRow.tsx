import { View, Text, Pressable } from "react-native";
import React from "react";
import { OrderItem, Product } from "../../types/types";
import { AntDesign } from "@expo/vector-icons";

type OrderItemRowProps = {
  product: Product;
  orderItems: OrderItem[];
  removeQty: (product: Product) => void;
  addQty: (product: Product) => void;
};

const OrderItemRow = ({
  product,
  orderItems,
  removeQty,
  addQty,
}: OrderItemRowProps) => {
  return (
    <View key={product.id}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ fontWeight: "500", fontSize: 18 }}>
            {product.name}
          </Text>
          <Text style={{ fontWeight: "500", fontSize: 16 }}>
            €{product.price}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <Pressable onPress={() => removeQty(product)}>
            <AntDesign name="minuscircleo" color="black" size={24} />
          </Pressable>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {orderItems.find((item) => item.productId === product.id)
              ?.quantity ?? 0}
          </Text>
          <Pressable onPress={() => addQty(product)}>
            <AntDesign name="pluscircleo" color="black" size={24} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default OrderItemRow;
