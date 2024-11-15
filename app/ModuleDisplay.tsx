import { colorIndexMap } from "@/constants/Colors"
import { View, StyleSheet, Text } from "react-native"
import Button from "./Button"
import Encoder from "./Encoder"
import { memo } from "react"

type ModuleDisplayProps = {
  modules:Module[], 
  activeModule:ActiveModule|null, 
  name: string,
  variationKnob: number
}


//TODO: Fix performance
const ModuleDisplay = ({modules, activeModule, name, variationKnob}:ModuleDisplayProps) => {

  const NUM_MVS = 4
  const mvButtons = []
  for(let i=0; i<NUM_MVS; i++){
    if(activeModule != null && activeModule.macro_variations[i] != null){
      const mv = activeModule.macro_variations[i] as MacroVariation
      mvButtons.push(<Button
        key={`mv-${name+i}`}
        text={mv.name}
        bgColor={colorIndexMap[mv.color_index]}
        animationType={mv.is_active? 'BRIGHT' : 'DIM'}
        value={mv.is_active ? variationKnob: null}  
      />)
    } else {
      mvButtons.push(<Button
        key={`mv-${i}`}
        text={""}
        bgColor={"rgb(20,20,20)"}
        animationType={'NONE'}
      />)
    }
  }

  const NUM_SECTIONS = 8
  const sections = []
  for(let i=0; i<NUM_SECTIONS; i++){

    if(activeModule != null && activeModule.sections[i] != null){
      const section = activeModule.sections[i] as Clip
      sections.push(<Button 
        key={`section-${name+i}`}
        text={section.name}
        bgColor={colorIndexMap[section.color_index]}
        animationType={section.is_playing ? 'BRIGHT' : section.is_triggered ? 'FLASHING' : 'DIM'}
        value={(section.is_playing ? `${section.position}/` : '') + `${section.length}${section.looping ? ' L' : ''}`}
        highlight={section.is_playing}
      />)
    } 
    
    else if(activeModule === null && modules[i]){
      const module = modules[i]
      sections.push(<Button 
        key={`section-${name+i}`}
        text={module.name}
        bgColor={colorIndexMap[module.color_index]}
        animationType={'BRIGHT'}
      />)
    }

    else{
      sections.push(<Button 
        key={`section-${name+i}`}
        text={""}
        bgColor={"rgb(20,20,20)"}
        animationType={"NONE"}  
      />)
    }
    
  }

  const NUM_DYNAMIC_CLIPS = 8
  const clips = []
  for(let i=0; i<NUM_DYNAMIC_CLIPS; i++){

    if(activeModule != null && activeModule.dynamic_clips[i] != null){
      const clip = activeModule.dynamic_clips[i] as Clip
      clips.push(<Button 
        key={`clip-${name+i}`}
        text={clip.name}
        bgColor={colorIndexMap[clip.color_index]}
        animationType={clip.is_playing ? 'BRIGHT' : clip.is_triggered ? 'FLASHING' : 'DIM'}
      />)
    } 
    
    else if(activeModule === null && modules[i+NUM_SECTIONS]){
      const module = modules[i+NUM_SECTIONS]
      clips.push(<Button 
        key={`clip-${name+i}`}
        text={module.name}
        bgColor={colorIndexMap[module.color_index]}
        animationType={'BRIGHT'}
      />)
    }

    else{
      clips.push(<Button 
        key={`clip-${name+i}`}
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
      style={styles.container}>
      <Text style={{...styles.moduleDisplayHeader, 
        borderColor: activeModule!=null ? colorIndexMap[activeModule.color_index] : 'rgb(30,30,30)'}}> {name}: {activeModule!=null? activeModule.name : 'Select a Module'}</Text>
      <View style={{...styles.moduleColumnBox, flexDirection: name === 'X' ? 'row' : 'row-reverse'}}>
        <View style={{...styles.moduleRowBox, flex:2, flexGrow: 2}}>
          <View style={{...styles.moduleDisplayContainer, flex:1, flexGrow: 1}}>
            {mvButtons.map(b=>b)}
          </View>
          <View style={{...styles.moduleDisplayContainer, flex:2, flexGrow: 2}}>
            {sections.map(b=>b)}
          </View>
          <View style={{...styles.moduleDisplayContainer, flex:2, flexGrow: 2}}>
            {clips.map(c=>c)}
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
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flex: 1
  },
  moduleColumnBox: {
    display: 'flex',
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
    flex: 1,
    flexShrink: 1,
    flexGrow: 1,
  },
  moduleDisplayContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'stretch',
    flexGrow: 1,
    width: '100%'
  },
  moduleDisplayHeader: {
    color: "rgb(200,200,200)",
    fontSize: 20,
    borderWidth: 2
  },
})


// Custom comparison function
const arePropsEqual = (prevProps:ModuleDisplayProps, nextProps:ModuleDisplayProps) => {
  return (
    prevProps.name === nextProps.name &&
    JSON.stringify(prevProps.activeModule) == JSON.stringify(nextProps.activeModule) &&
    JSON.stringify(prevProps.modules) == JSON.stringify(nextProps.modules) &&
    prevProps.variationKnob === nextProps.variationKnob
  );
};

export default memo(ModuleDisplay, arePropsEqual);