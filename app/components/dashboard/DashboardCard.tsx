import { View, Text, StyleSheet } from "react-native";

type DasboardCardProps = {
  label: string;
  value: number;
  desc: string;
  type: "currency" | "stat";
};

const DashboardCard = ({ label, value, desc, type }: DasboardCardProps) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontSize: 20, fontWeight: "500" }}>{label}</Text>
        <Text style={{ fontSize: 16, color: "#64748B" }}>{desc}</Text>
      </View>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>
        {type === "currency" ? "€" : ""}
        {value}
      </Text>
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

export default DashboardCard;
