import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        options={{ title: "I tuoi prodotti", headerShadowVisible: false }}
        name="index"
      />
      <Stack.Screen
        options={{ title: "Aggiungi un prodotto", headerShadowVisible: false }}
        name="add"
      />
    </Stack>
  );
};

export default Layout;
