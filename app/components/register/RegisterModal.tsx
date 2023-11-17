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
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import errorAlert from "../errorAlert";

type RegisterModalProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const formSchema = z.object({
  name: z.string().min(3).max(50),
  surname: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(7).max(50),
});

const RegisterModal = ({ isVisible, setIsVisible }: RegisterModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
    },
  });

  const onRegister = (values: z.infer<typeof formSchema>) => {
    const { email, password, name, surname } = values;
    setIsLoading(true);
    Keyboard.dismiss();
    registerWithEmailAndPassword(email, password, name, surname)
      .then(() => {
        setIsLoading(false);
        router.push("/orders/");
      })
      .catch(() => {
        setIsLoading(false);
        errorAlert("Prova ad effettuare nuovamente la registrazione");
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
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Nome"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                  style={{
                    flex: 1,
                    padding: 10,
                  }}
                />
              )}
            />
          </View>
          {errors.name?.message && (
            <Text style={{ color: "#EF4444" }}>{errors.name.message}</Text>
          )}
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              name="surname"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Cognome"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                  style={{
                    flex: 1,
                    padding: 10,
                  }}
                />
              )}
            />
          </View>
          {errors.surname?.message && (
            <Text style={{ color: "#EF4444" }}>{errors.surname.message}</Text>
          )}
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Email"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                  style={{
                    flex: 1,
                    padding: 10,
                  }}
                />
              )}
            />
            <Ionicons name="mail" size={20} />
          </View>
          {errors.email?.message && (
            <Text style={{ color: "#EF4444" }}>{errors.email.message}</Text>
          )}
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Password"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                  style={{
                    flex: 1,
                    padding: 10,
                  }}
                />
              )}
            />
            <Ionicons name="lock-closed" size={20} />
          </View>
          {errors.password?.message && (
            <Text style={{ color: "#EF4444" }}>{errors.password.message}</Text>
          )}
          <Button
            label="Registrati"
            variant="primary"
            onPress={handleSubmit(onRegister)}
          />
          <Text style={{ textAlign: "center", fontWeight: "500" }}>Oppure</Text>
          <Button
            onPress={() => {}}
            variant="secondary"
            label="Registrati con Google"
            icon="logo-google"
            iconPosition="left"
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
    padding: 20,
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
