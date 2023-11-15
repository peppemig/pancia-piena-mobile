import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen options={{ title: "I tuoi prodotti" }} name="index" />
      <Stack.Screen options={{ title: "Aggiungi un prodotto" }} name="add" />
    </Stack>
  );
};

export default Layout;
