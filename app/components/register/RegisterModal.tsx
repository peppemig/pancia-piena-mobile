import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Text,
  TextInput,
  Alert,
  Keyboard,
  StyleSheet,
  View,
  Modal,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../ui/Button";
import { registerWithEmailAndPassword } from "../../config/firebase";

type RegisterModalProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const RegisterModal = ({ isVisible, setIsVisible }: RegisterModalProps) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onRegister = () => {
    setIsLoading(false);
    Keyboard.dismiss();
    registerWithEmailAndPassword(email, password, name, surname)
      .then(() => {
        setIsLoading(false);
        router.push("/orders/");
      })
      .catch(() => {
        setIsLoading(false);
        Alert.alert(
          "Ooops! C'è stato un problema",
          "Prova ad effettuare nuovamente la registrazione",
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

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator
          size="large"
          color="black"
          style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
        />
      </SafeAreaView>
    );
  }

  return (
    <Modal
      animationType="slide"
      presentationStyle="formSheet"
      visible={isVisible}
    >
      <View style={styles.container}>
        <Text style={{ textAlign: "center", fontSize: 36, fontWeight: "bold" }}>
          Crea il tuo account
        </Text>
        <View style={{ gap: 6 }}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Nome"
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                flex: 1,
                padding: 10,
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Cognome"
              value={surname}
              onChangeText={(text) => setSurname(text)}
              style={{
                flex: 1,
                padding: 10,
              }}
            />
          </View>
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
              secureTextEntry
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
          <Button label="Registrati" variant="primary" onPress={onRegister} />
          <Text style={{ textAlign: "center", fontWeight: "500" }}>Oppure</Text>
          <Button
            onPress={() => {}}
            variant="secondary"
            label="Registrati con Google"
            icon="logo-google"
            iconSize={18}
          />
        </View>
        <Text style={{ textAlign: "center" }}>
          Hai già un account?{" "}
          <Text
            onPress={() => setIsVisible(false)}
            style={{ fontWeight: "bold", textDecorationStyle: "solid" }}
          >
            Accedi
          </Text>
        </Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    padding: 10,
    gap: 20,
    backgroundColor: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
  },
});

export default RegisterModal;
