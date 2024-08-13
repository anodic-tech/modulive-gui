import { colorIndexMap } from "@/constants/Colors"
import { View, StyleSheet, Text } from "react-native"
import Button from "./Button"
import Encoder from "./Encoder"
import { memo } from "react"

type ModuleDisplayProps = {
  modules:Module[], 
  activeModule:ActiveModule|null, 
  name: string
}

const ModuleDisplay = ({modules, activeModule, name}:ModuleDisplayProps) => {

  console.log('rerender')

  const NUM_MVS = 4
  const mvButtons = []
  for(let i=0; i<NUM_MVS; i++){
      mvButtons.push(<Button 
        key={`mvbutton-${name+i}`}
        text={""}
        bgColor={"rgb(20,20,20)"}
        animationType={"NONE"}  
      />)
  }

  const NUM_BUTTONS = 8
  const buttons = []
  for(let i=0; i<NUM_BUTTONS; i++){

    if(activeModule != null && activeModule.sections[i] != null){
      const section = activeModule.sections[i] as Section
      buttons.push(<Button 
        key={`button-${name+i}`}
        text={section.name}
        bgColor={colorIndexMap[section.color_index]}
        animationType={section.is_playing ? 'BRIGHT' : section.is_triggered ? 'FLASHING' : 'DIM'}
      />)
    } 
    
    else if(activeModule === null && modules[i]){
      const module = modules[i]
      buttons.push(<Button 
        key={`button-${name+i}`}
        text={module.name}
        bgColor={colorIndexMap[module.color_index]}
        animationType={'BRIGHT'}
      />)
    }

    else{
      buttons.push(<Button 
        key={`button-${name+i}`}
        text={""}
        bgColor={"rgb(20,20,20)"}
        animationType={"NONE"}  
      />)
    }
    
  }

  const NUM_ENCODERS = 7
  const encoders = []
  for(let i=0; i<NUM_ENCODERS; i++){
    if(activeModule != null && activeModule.params[i] != null){
      const param = activeModule.params[i] as Param
      encoders.push(<Encoder
        key={`encoder-${name+i}`}
        text={param.name}
        bgColor={colorIndexMap[param.color_index]}
        value={param.value}  
      />)
    } else {
      encoders.push(<Encoder
        key={`encoder-${name+i}`}
        text={""}
        bgColor={"rgb(20,20,20)"}
        value={""}  
      />)
    }
  }

  return (
    <View
      style={{
        ...styles.container,
        borderColor: activeModule!=null ? colorIndexMap[activeModule.color_index] : 'rgb(30,30,30)',
      }}
    >
      <Text style={styles.moduleDisplayHeader}> {name}: {activeModule!=null? activeModule.name : 'Select a Module'}</Text>
      <View style={{...styles.moduleColumnBox, flexDirection: name === 'X' ? 'row' : 'row-reverse'}}>
        <View style={{...styles.moduleRowBox, flex:2, flexGrow: 2}}>
          <View style={{...styles.moduleDisplayContainer, flex:1, flexGrow: 1}}>
            {mvButtons.map(b=>b)}
          </View>
          <View style={{...styles.moduleDisplayContainer, flex:2, flexGrow: 2}}>
            {buttons.map(b=>b)}
          </View>
          <View style={{...styles.moduleDisplayContainer, flex:2, flexGrow: 2}}>
            {buttons.map(b=>b)}
          </View>
        </View>
        <View style={{...styles.moduleRowBox, flex: 1, flexGrow: 1}}>
          <View style={{...styles.moduleDisplayContainer, justifyContent: name === 'X' ? 'flex-start' : 'flex-end'}}>
            {encoders.map(e=>e)}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flex: 1
  },
  moduleColumnBox: {
    display: 'flex',
    // justifyContent: 'space-between',
    gap: 15,
    flexGrow: 1,
    flex: 1
  },
  moduleRowBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    // flexWrap: 'wrap',
    flex: 1,
    flexShrink: 1,
    flexGrow: 1,
  },
  moduleDisplayContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // borderWidth: 1,
    // borderColor: 'rgb(30,70,30)',
    alignContent: 'stretch',
    flexGrow: 1
  },
  moduleDisplayHeader: {
    color: "rgb(200,200,200)",
    fontSize: 20
  },
})


// Custom comparison function
const arePropsEqual = (prevProps:ModuleDisplayProps, nextProps:ModuleDisplayProps) => {
  return (
    prevProps.name === nextProps.name &&
    JSON.stringify(prevProps.activeModule) == JSON.stringify(nextProps.activeModule) &&
    JSON.stringify(prevProps.modules) == JSON.stringify(nextProps.modules)
  );
};

export default memo(ModuleDisplay, arePropsEqual);