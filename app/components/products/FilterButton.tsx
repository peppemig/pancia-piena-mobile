import { Pressable, Text } from "react-native";

type FilterButtonProps = {
  label: string;
  value: string;
  currentFilter: string;
  onClick: (value: string) => void;
};

const FilterButton = ({
  label,
  value,
  currentFilter,
  onClick,
}: FilterButtonProps) => {
  return (
    <Pressable
      style={{
        backgroundColor: currentFilter === value ? "black" : "transparent",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#E2E8F0",
      }}
      onPress={() => onClick(value)}
    >
      <Text
        style={{
          color: currentFilter === value ? "white" : "black",
          fontWeight: "400",
          fontSize: 14,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default FilterButton;
