import { View, Text, Button } from "react-native";
import React from "react";
import { useAuthState } from "../../providers/AuthProvider";
import { logOut } from "../../config/firebase";
import { useRouter } from "expo-router";

const Profile = () => {
  const auth = useAuthState();
  const router = useRouter();

  const onLogout = () => {
    logOut();
    router.replace("/");
  };

  return (
    <View>
      <Text>{auth.user?.email}</Text>
      <Button onPress={onLogout} title="Logout" />
    </View>
  );
};

export default Profile;
