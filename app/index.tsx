import { View, StyleSheet, Text, Platform } from "react-native"
import * as ScreenOrientation from 'expo-screen-orientation';
import useSocket from "@/hooks/useSocket";
import useOrientationLock from "@/hooks/useOrientationLock";
import ModuleDisplay from "./ModuleDisplay";
import Fader from "./Fader";
import useWebhook from "@/hooks/useWebhook";
export default function Index() {

  //TODO: Add linter

  let data
  if (Platform.OS === 'android') {
    data = useSocket()
    useOrientationLock(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
  } else {
    data = useWebhook()
  }

  return (
    <View style={styles.container}>
      <View style={styles.moduleContainer}>
        <ModuleDisplay modules={data.modules} activeModule={data.active_module.X} name={"X"} variationKnob={data.variation_knob} />
        <ModuleDisplay modules={data.modules} activeModule={data.active_module.Y} name={"Y"} variationKnob={data.variation_knob} />
        <View style={styles.tempoContainer}>
          <Text style={styles.tempoText}>{Math.floor(data.tempo)}</Text>
        </View>
      </View>
      <View style={styles.mainContainer}>
        <Fader value={(data.xfade + 1) * 50} />
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
    paddingTop: 30,
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
  },
  tempoContainer: {
    position: 'absolute',
    top: '85%',
    width: '100%'
  },
  tempoText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 22
  }
})
