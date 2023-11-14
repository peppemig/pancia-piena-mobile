import { Stack } from "expo-router";
import { AuthContextProvider } from "./providers/AuthProvider";

const Layout = () => {
  return (
    <AuthContextProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Accedi" }} />
      </Stack>
    </AuthContextProvider>
  );
};

export default Layout;
