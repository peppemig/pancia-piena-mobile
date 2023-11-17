import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../ui/Button";
import { useAuthState } from "../../providers/AuthProvider";
import { useState } from "react";
import productsService from "../../api/productsService";
import errorAlert from "../errorAlert";

const editImage = require("../../../assets/edit-product.svg");

type EditProductModal = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  name: string;
  price: string;
  refreshProducts: () => void;
};

const formSchema = z.object({
  name: z.string().min(1).max(50),
  price: z.string().min(1),
});

const EditProductModal = ({
  isVisible,
  setIsVisible,
  id,
  name,
  price,
  refreshProducts,
}: EditProductModal) => {
  const { user } = useAuthState();
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      price: price,
    },
  });

  const onEditProduct = (values: z.infer<typeof formSchema>) => {
    user!
      .getIdToken()
      .then((token) => {
        productsService
          .editProduct(token, id, values)
          .then(() => {
            setIsLoading(false);
            setIsVisible(false);
            refreshProducts();
          })
          .catch(() => {
            setIsLoading(false);
            setIsVisible(false);
            errorAlert("Prova ad effettuare nuovamente la richiesta");
          });
      })
      .catch(() => {
        setIsLoading(false);
        setIsVisible(false);
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
    <Modal
      animationType="slide"
      presentationStyle="formSheet"
      visible={isVisible}
    >
      <View style={styles.container}>
        <Image
          source={editImage}
          placeholder="Image"
          contentFit="contain"
          transition={1000}
          style={{ width: "100%", height: "30%" }}
        />
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 26, fontWeight: "bold" }}>
            Modifica prodotto
          </Text>
          <Text style={{ fontWeight: "500", fontSize: 16 }}>
            Modifica i dati del prodotto
          </Text>
        </View>
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
        </View>
        <View style={{ gap: 6 }}>
          <Button
            label="Modifica"
            variant="primary"
            onPress={handleSubmit(onEditProduct)}
          />
          <Button
            label="Annulla"
            variant="secondary"
            onPress={() => setIsVisible(false)}
          />
        </View>
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
    borderColor: "#E2E8F0",
    borderWidth: 1,
    paddingHorizontal: 14,
  },
});

export default EditProductModal;
