import { StyleSheet, Text, View } from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation';
import useSocket from "@/hooks/useSocket";
import useOrientationLock from "@/hooks/useOrientationLock";
import { ReactElement } from "react";

export default function Index() {

  const data = useSocket()
  useOrientationLock(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)


  console.log(data)

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      {/* <Text>
        {JSON.stringify(data)}
      </Text> */}
      <DisplayArea modules={data.modules} activeModule={data.active_module.A} name={"A"}/>
      <DisplayArea modules={data.modules} activeModule={data.active_module.B} name={"B"}/>
    </View>
  );
}

const DisplayArea = ({modules, activeModule, name}:{modules:Module[], activeModule:ActiveModule|'None', name: string}) => {

  const NUM_BUTTONS = 8
  const buttons = []
  for(let i=0; i<8; i++){
    if(activeModule != 'None' && activeModule.sections[i] != 'None'){
      buttons.push(<Button key={name+i}>
        <SectionButtonDisplay section={activeModule.sections[i] as Section}/>
      </Button>)
    } else if(modules[i]){
      buttons.push(<Button key={name+i}>
        <ModuleButtonDisplay module={modules[i]}/>
      </Button>)
    }
    else{
      buttons.push(<Button key={name+i}/>)
    }
  }

  return (
    <View>
      <Text>{activeModule!='None' ? activeModule.name : 'Select a Module'}</Text>
      <View style={styles.displayAreaContainer}>
        {buttons.map(b=>b)}
      </View>
    </View>
  );
}

const Button = ({children}:{children?:React.JSX.Element}) => {
  return(
    <View style={styles.button}>{children}</View>
  )
}

const ModuleButtonDisplay = ({module}:{module:Module}) => {
  return (
    <View>
      <Text>{module.name}</Text>
    </View>
  )
}

const SectionButtonDisplay = ({section}:{section:Section}) => {
  return (
    <View>
      <Text>{section.name}</Text>
    </View>
  )
}

// const Slider = () => {

// }

// const NumberDisplay = () => {

// }

const styles = StyleSheet.create({
  displayAreaContainer: {
    width: 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  button: {
    height: 100,
    backgroundColor: 'green',
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    width: '25%'
  }
})
