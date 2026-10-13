import { Button, ButtonText } from "@/components/ui/button";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit src/app/index.tsx.</Text>
      <Button onPress={()=>{router.push('/camera')}}><ButtonText>Camera</ButtonText></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#032601",
    justifyContent: "center",
  },
    text: {
    color: '#fff',
  },
});
