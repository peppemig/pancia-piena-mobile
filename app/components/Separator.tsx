import { View } from "react-native";

const Separator = ({ margin }: { margin: number }) => {
  return (
    <View
      style={{
        borderWidth: 0.5,
        borderColor: "#E2E8F0",
        marginVertical: margin,
      }}
    ></View>
  );
};

export default Separator;
