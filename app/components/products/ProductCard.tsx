import { View, Text, Pressable } from "react-native";
import { User } from "firebase/auth";
import React from "react";
import Button from "../ui/Button";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  category: string;
  user: User;
  refreshProducts: () => void;
};

const ProductCard = ({ id, name, price, category }: ProductCardProps) => {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#E2E8F0",
        gap: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "white",
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "700" }}>{name}</Text>
      <View>
        <Text style={{ fontWeight: "500", fontSize: 16 }}>€{price}</Text>
        <Text style={{ fontWeight: "500", fontSize: 16 }}>{category}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pressable
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            borderColor: "#E2E8F0",
          }}
        >
          <Text style={{ fontWeight: "700" }}>Modifica</Text>
        </Pressable>
        <Pressable
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            borderColor: "#EF4444",
            backgroundColor: "#EF4444",
          }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>Elimina</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ProductCard;
