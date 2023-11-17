import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "../../types/types";
import Button from "../../components/ui/Button";
import { Picker } from "@react-native-picker/picker";
import { Image } from "expo-image";
import { useState } from "react";
import { useAuthState } from "../../providers/AuthProvider";
import productsService from "../../api/productsService";
import { router } from "expo-router";
import errorAlert from "../../components/errorAlert";

const addImage = require("../../../assets/cooking.svg");

const formSchema = z.object({
  name: z.string().min(1).max(50),
  price: z.string().min(1).max(10),
  category: z.nativeEnum(Category),
});

const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthState();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "",
      category: Category.ANTIPASTO,
    },
  });

  const onCreateProduct = (values: z.infer<typeof formSchema>) => {
    Keyboard.dismiss();
    setIsLoading(true);
    user!
      .getIdToken()
      .then((token) => {
        productsService
          .createProduct(token, values)
          .then(() => {
            setIsLoading(false);
            router.back();
          })
          .catch(() => {
            setIsLoading(false);
            errorAlert("Prova ad effettuare nuovamente la richiesta");
          });
      })
      .catch(() => {
        setIsLoading(false);
        errorAlert("Prova ad effettuare nuovamente la richiesta");
      });
  };

  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", backgroundColor: "white" }}
      >
        <ActivityIndicator
          size="large"
          color="black"
          style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={addImage}
        placeholder="Image"
        contentFit="contain"
        transition={1000}
        style={{ width: "100%", flex: 1 }}
      />
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
        Inserisci nome, prezzo e categoria ed aggiungi un nuovo prodotto al tuo
        menu
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
                placeholder="Nome prodotto"
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
            name="price"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                keyboardType="numeric"
                placeholder="Prezzo"
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
        {errors.price?.message && (
          <Text style={{ color: "#EF4444" }}>{errors.price.message}</Text>
        )}
        <View
          style={{ borderWidth: 1, borderRadius: 10, borderColor: "#E2E8F0" }}
        >
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            name="category"
            render={({ field: { onChange, onBlur, value } }) => (
              <Picker
                style={{
                  marginLeft: 10,
                }}
                onBlur={onBlur}
                selectedValue={value}
                onValueChange={onChange}
              >
                <Picker.Item label="Antipasto" value="ANTIPASTO" />
                <Picker.Item label="Primo" value="PRIMO" />
                <Picker.Item label="Secondo" value="SECONDO" />
                <Picker.Item label="Dolce" value="DOLCE" />
                <Picker.Item label="Bevanda" value="BEVANDA" />
              </Picker>
            )}
          />
        </View>
        {errors.category?.message && (
          <Text style={{ color: "#EF4444" }}>{errors.category.message}</Text>
        )}
      </View>
      <Button
        label="Aggiungi"
        variant="primary"
        onPress={handleSubmit(onCreateProduct)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    padding: 10,
    gap: 16,
    backgroundColor: "white",
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

export default AddProduct;
