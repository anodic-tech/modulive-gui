import { Text, View } from "react-native";
import useSocket from "@/hooks/useSocket";

export default function Index() {

  const data = useSocket()

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>
        {JSON.stringify(data)}
      </Text>
    </View>
  );
}
