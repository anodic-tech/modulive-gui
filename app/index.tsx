import { View, StyleSheet, Text } from "react-native"
import * as ScreenOrientation from 'expo-screen-orientation';
import useSocket from "@/hooks/useSocket";
import useOrientationLock from "@/hooks/useOrientationLock";
import ModuleDisplay from "./ModuleDisplay";
import Fader from "./Fader";
export default function Index() {

  const data = useSocket()
  useOrientationLock(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)

  return (
    <View style={styles.container}>
      <View style={styles.moduleContainer}>
        <ModuleDisplay modules={data.modules} activeModule={data.active_module.X} name={"X"}/>
        <ModuleDisplay modules={data.modules} activeModule={data.active_module.Y} name={"Y"}/>
      </View>
      <View style={styles.mainContainer}>
        <Fader value={(data.xfade+1)*50}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexGrow: 1,
    padding: 15,
    gap: 15,
    backgroundColor: "rgb(30,30,30)"
  },
  moduleContainer: {
    flex: 1,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-evenly",
    gap: 15,

    alignContent: "stretch",
  },
  mainContainer: {
    height: 40
  }
})
