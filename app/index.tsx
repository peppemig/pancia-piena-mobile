import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, Button, TextInput, Alert, Keyboard } from "react-native";
import { loginWithEmailAndPassword } from "./config/firebase";
import { useAuthState } from "./providers/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const auth = useAuthState();

  useEffect(() => {
    console.log(auth.state);
  }, [auth]);

  const login = () => {
    Keyboard.dismiss();
    loginWithEmailAndPassword(email, password)
      .then(() => router.push("/orders/"))
      .catch((e) => {
        Alert.alert(
          "Alert Title",
          e.message,
          [
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
          {
            cancelable: true,
          }
        );
      });
  };

  if (auth.state === "loading") {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Text>ACCEDI</Text>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={{ backgroundColor: "white", padding: 10 }}
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={{ backgroundColor: "white", padding: 10 }}
      />
      <Button title="Accedi" onPress={login} />
      <Link href={"/register"} asChild>
        <Button title="Registrati" />
      </Link>
    </SafeAreaView>
  );
};

export default Page;
