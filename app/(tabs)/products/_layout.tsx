import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Prodotti" }} />
      <Stack.Screen name="create" options={{ title: "Aggiungi un prodotto" }} />
    </Stack>
  );
};

export default Layout;
