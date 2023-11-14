import { Tabs, Redirect } from "expo-router";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useAuthState } from "../providers/AuthProvider";
import { Text } from "react-native";

const Layout = () => {
  const auth = useAuthState();

  if (auth.state === "loading") {
    return <Text>Loading...</Text>;
  }

  if (auth.state === "loaded" && !auth.isAuthentication) {
    return <Redirect href={"/"} />;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="orders/index"
        options={{
          tabBarLabel: "Ordini",
          title: "Ordini",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="chef-hat" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="createOrder/index"
        options={{
          tabBarLabel: "Crea ordine",
          title: "Crea ordine",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          tabBarLabel: "Prodotti",
          title: "Prodotti",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Feather name="package" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard/index"
        options={{
          tabBarLabel: "Dashboard",
          title: "Dashboard",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          tabBarLabel: "Profilo",
          title: "Profilo",
          tabBarIcon: ({ size, color }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
