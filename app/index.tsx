import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Image } from "expo-image";
import {
  Text,
  TextInput,
  Alert,
  Keyboard,
  StyleSheet,
  View,
  Pressable,
} from "react-native";
import { loginWithEmailAndPassword } from "./config/firebase";
import { useAuthState } from "./providers/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const loginImage = require("../assets/login.png");

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const auth = useAuthState();

  const login = () => {
    Keyboard.dismiss();
    loginWithEmailAndPassword(email, password)
      .then(() => router.push("/orders/"))
      .catch((e) => {
        Alert.alert(
          "Ooops! C'è stato un problema",
          e.message,
          [
            {
              text: "Chiudi",
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
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Image
          source={loginImage}
          placeholder="Image"
          contentFit="cover"
          transition={1000}
          style={{ width: "100%", flex: 1 }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Text
            style={{ textAlign: "center", fontSize: 36, fontWeight: "bold" }}
          >
            PanciaPiena
          </Text>
          <Ionicons name="fast-food" size={30} />
        </View>
        <View style={{ gap: 6 }}>
          <Pressable style={styles.button}>
            <Ionicons name="logo-google" color="white" size={18} />
            <Text style={styles.buttonText}>Accedi con Google</Text>
          </Pressable>
          <Text style={{ textAlign: "center", fontWeight: "500" }}>Oppure</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                flex: 1,
                padding: 10,
              }}
            />
            <Ionicons name="mail" size={20} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={{
                flex: 1,
                padding: 10,
              }}
            />
            <Ionicons name="lock-closed" size={20} />
          </View>
          <Pressable style={styles.button} onPress={login}>
            <Text style={styles.buttonText}>Accedi</Text>
          </Pressable>
        </View>
        <Text style={{ textAlign: "center" }}>
          Non hai ancora un account?{" "}
          <Link href={"/register"} asChild>
            <Text style={{ fontWeight: "bold" }}>Registrati</Text>
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
  button: {
    backgroundColor: "black",
    padding: 16,
    borderRadius: 1000,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 1000,
    borderWidth: 2,
    paddingHorizontal: 14,
  },
});

export default Page;
