import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useAuthState } from "../../providers/AuthProvider";
import { logOut } from "../../config/firebase";
import { useRouter } from "expo-router";
import errorAlert from "../../components/errorAlert";
import Button from "../../components/ui/Button";

const Profile = () => {
  const { user } = useAuthState();
  const router = useRouter();

  const onLogout = () => {
    logOut()
      .then(() => router.replace("/"))
      .catch(() => errorAlert("Prova ad effettuare nuovamente il logout"));
  };

  return (
    <View style={styles.container}>
      <Button onPress={onLogout} label="Logout" variant="primary" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    gap: 10,
    backgroundColor: "white",
  },
});

export default Profile;
