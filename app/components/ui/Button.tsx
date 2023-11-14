import { Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ButtonProps = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconSize?: number;
  onPress?: () => void;
  variant?: "primary" | "secondary";
};

const Button = ({
  label,
  icon,
  iconColor,
  iconSize,
  onPress,
  variant,
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: variant === "primary" ? "black" : "",
        borderColor: variant === "primary" ? "" : "black",
        borderWidth: 1,
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
      }}
    >
      {icon && <Ionicons name={icon} color={iconColor} size={iconSize} />}
      <Text
        style={{
          color: variant === "primary" ? "white" : "black",
          textAlign: "center",
          fontWeight: "500",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default Button;
