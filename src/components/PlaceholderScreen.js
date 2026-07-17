import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlaceholderScreen({ title, message }) {
  return (
    <SafeAreaView style={styles.screen} edges={["left", "right", "bottom"]}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F5F7F6",
  },
  card: {
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE3E0",
    borderRadius: 18,
  },
  title: {
    color: "#236B4E",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  message: {
    color: "#667085",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 10,
    textAlign: "center",
  },
});