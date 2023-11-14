import { View, Text, Modal, StyleSheet, Pressable } from "react-native";

type RegisterModalProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const RegisterModal = ({ isVisible, setIsVisible }: RegisterModalProps) => {
  return (
    <Modal
      animationType="slide"
      presentationStyle="formSheet"
      visible={isVisible}
    >
      <View style={styles.container}>
        <Pressable onPress={() => setIsVisible(false)}>
          <Text>CHIUDI MODAL</Text>
        </Pressable>
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
  },
});

export default RegisterModal;
