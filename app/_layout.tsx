import { Stack } from "expo-router";
import { AuthContextProvider } from "./providers/AuthProvider";

const Layout = () => {
  return (
    <AuthContextProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Accedi" }} />
        <Stack.Screen name="register" options={{ title: "Registrati" }} />
      </Stack>
    </AuthContextProvider>
  );
};

export default Layout;
