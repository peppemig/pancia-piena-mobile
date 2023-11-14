import { Text, Button } from "react-native";
import { useAuthState } from "./providers/AuthProvider";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Register = () => {
  const auth = useAuthState();

  if (auth.state === "loading") {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Text>REGISTRATI</Text>
      <Link href={"/"} asChild>
        <Button title="Accedi" />
      </Link>
    </SafeAreaView>
  );
};

export default Register;
