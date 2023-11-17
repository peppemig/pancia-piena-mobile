import { Alert } from "react-native";

const errorAlert = (message: string) =>
  Alert.alert(
    "Ooops! C'è stato un problema",
    message,
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

export default errorAlert;
