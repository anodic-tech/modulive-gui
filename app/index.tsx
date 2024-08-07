import { View } from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation';
import useSocket from "@/hooks/useSocket";
import useOrientationLock from "@/hooks/useOrientationLock";
import ModuleDisplay from "./ModuleDisplay";
export default function Index() {

  const data = useSocket()
  useOrientationLock(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "rgb(30,30,30)"
      }}
    >
      {/* <Text>
        {JSON.stringify(data)}
      </Text> */}
      <ModuleDisplay modules={data.modules} activeModule={data.active_module.X} name={"X"}/>
      <ModuleDisplay modules={data.modules} activeModule={data.active_module.Y} name={"Y"}/>
    </View>
  );
}
