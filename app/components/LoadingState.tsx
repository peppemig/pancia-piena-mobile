import { View, ActivityIndicator } from "react-native";
import React from "react";

const LoadingState = () => {
  return (
    <View
      style={{ flex: 1, justifyContent: "center", backgroundColor: "white" }}
    >
      <ActivityIndicator
        size="large"
        color="black"
        style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
      />
    </View>
  );
};

export default LoadingState;
