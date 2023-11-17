import { useRouter } from "expo-router";
import { useState } from "react";
import { Image } from "expo-image";
import {
  Text,
  TextInput,
  Alert,
  Keyboard,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { loginWithEmailAndPassword } from "./config/firebase";
import { useAuthState } from "./providers/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import RegisterModal from "./components/register/RegisterModal";
import Button from "./components/ui/Button";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import errorAlert from "./components/errorAlert";

const loginImage = require("../assets/login.svg");

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(7).max(50),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const auth = useAuthState();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    setIsLoading(true);
    Keyboard.dismiss();
    loginWithEmailAndPassword(email, password)
      .then(() => {
        setIsLoading(false);
        router.push("/orders/");
      })
      .catch(() => {
        setIsLoading(false);
        errorAlert("Prova ad effettuare nuovamente l'accesso");
      });
  };

  if (auth.state === "loading" || isLoading) {
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
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Image
          source={loginImage}
          placeholder="Image"
          contentFit="cover"
          transition={1000}
          style={{
            width: "100%",
            flex: 1,
          }}
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
                  secureTextEntry
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
            label="Accedi"
            variant="primary"
            onPress={handleSubmit(login)}
          />
          <Text style={{ textAlign: "center", fontWeight: "500" }}>Oppure</Text>
          <Button
            variant="secondary"
            label="Accedi con Google"
            icon="logo-google"
            iconPosition="left"
            iconSize={18}
          />
        </View>
        <Text style={{ textAlign: "center" }}>
          Non hai un account?{" "}
          <Text
            onPress={() => setIsVisible(true)}
            style={{ fontWeight: "bold", textDecorationStyle: "solid" }}
          >
            Registrati
          </Text>
        </Text>
      </View>
      <RegisterModal isVisible={isVisible} setIsVisible={setIsVisible} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    borderColor: "#E2E8F0",
    borderWidth: 1,
    paddingHorizontal: 14,
  },
});

export default Login;
