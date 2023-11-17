import { View, Text, Pressable } from "react-native";
import React from "react";

type OrderFilter = "in-corso" | "completati";

type FilterOrderButtonProps = {
  label: string;
  filter: OrderFilter;
  ordersFilter: OrderFilter;
  setOrdersFilter: React.Dispatch<React.SetStateAction<OrderFilter>>;
};

const FilterOrderButton = ({
  label,
  filter,
  ordersFilter,
  setOrdersFilter,
}: FilterOrderButtonProps) => {
  return (
    <Pressable
      onPress={() => {
        if (ordersFilter === filter) return;
        setOrdersFilter(filter);
      }}
      style={{
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        padding: 8,
        borderRadius: 10,
        backgroundColor: ordersFilter === filter ? "black" : "transparent",
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          color: ordersFilter === filter ? "white" : "black",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default FilterOrderButton;
