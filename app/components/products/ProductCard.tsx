import { View, Text, Pressable, Alert, ActivityIndicator } from "react-native";
import { User } from "firebase/auth";
import React, { useState } from "react";
import productsService from "../../api/productsService";
import { useAuthState } from "../../providers/AuthProvider";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  category: string;
  user: User;
  refreshProducts: () => void;
};

const ProductCard = ({
  id,
  name,
  price,
  category,
  refreshProducts,
}: ProductCardProps) => {
  const { user } = useAuthState();
  const [isLoading, setIsLoading] = useState(false);

  const deleteProduct = () => {
    setIsLoading(true);
    user!
      .getIdToken()
      .then((token) => {
        productsService
          .deleteProduct(token, id)
          .then(() => refreshProducts())
          .catch(() => {
            setIsLoading(false);
          });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const onDelete = () => {
    Alert.alert(
      "Elimina prodotto",
      "Sei sicuro di voler eliminare questo prodotto?",
      [
        {
          text: "Si",
          style: "default",
          onPress: () => deleteProduct(),
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
          onPress={onDelete}
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            borderColor: "#EF4444",
            backgroundColor: "#EF4444",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>Elimina</Text>
          {isLoading && <ActivityIndicator size="small" color="white" />}
        </Pressable>
      </View>
    </View>
  );
};

export default ProductCard;
